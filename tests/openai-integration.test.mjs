import test from 'node:test';
import assert from 'node:assert/strict';
import { createProbeContext, readProbeConfig, runProbe } from '../scripts/verify-openai.mjs';

const config = { key: 'test-only-key', active: true, model: 'gpt-6-luna', correctionModel: 'gpt-6-luna' };
const grade = { score: 7, status: 'partial', feedback: 'Revisa el càlcul.', criterionScores: [], confidence: 0.9 };
const packet = result => ({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(result) }] }] });
function withReply(status, body) {
  const context = createProbeContext(config);
  context.UrlFetchApp = { fetch: () => ({ getResponseCode: () => status,
    getContentText: () => typeof body === 'string' ? body : JSON.stringify(body) }) };
  return context;
}
const activity = { id: 'diagnostic-01', prompt: 'Prova', rubric: [], modelAnswer: 'Dos.' };

test('HTTP 200 incomplete no es transforma en una qualificació encara que incloga JSON', () => {
  const context = withReply(200, { ...packet(grade), status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' } });
  assert.throws(() => context.pdcOpenAIGrade_(activity, 'Resposta'), error => error.code === 'OPENAI_INCOMPLETE_MAX_OUTPUT_TOKENS');
});

for (const [http, apiCode, expected] of [[401, 'invalid_api_key', 'OPENAI_AUTH'], [403, '', 'OPENAI_ACCESS'],
  [404, 'model_not_found', 'OPENAI_MODEL'], [429, 'rate_limit_exceeded', 'OPENAI_RATE_LIMIT'],
  [429, 'insufficient_quota', 'OPENAI_BILLING'], [503, '', 'OPENAI_SERVER']]) {
  test(`HTTP ${http}/${apiCode || 'HTML'} conserva la causa sense reflectir secrets`, () => {
    const body = apiCode ? { error: { code: apiCode, message: 'PRIVATE_UPSTREAM_DETAIL' } } : '<html>PRIVATE_UPSTREAM_DETAIL</html>';
    const context = withReply(http, body);
    assert.throws(() => context.pdcOpenAIGrade_(activity, 'Resposta'), error => {
      assert.equal(error.code, expected);
      assert.equal(error.httpStatus, http);
      assert.ok(!error.message.includes('PRIVATE_UPSTREAM_DETAIL'));
      return true;
    });
  });
}

test('refusal, resposta buida i JSON malformat no generen una nota', () => {
  for (const [body, code] of [
    [{ status: 'completed', output: [{ content: [{ type: 'refusal', refusal: 'No' }] }] }, 'OPENAI_REFUSAL'],
    [{ status: 'completed', output: [] }, 'OPENAI_EMPTY_OUTPUT'],
    [{ status: 'completed', output: [{ content: [{ type: 'output_text', text: '{' }] }] }, 'OPENAI_INVALID_RESULT_JSON'],
    ['<html>broken</html>', 'OPENAI_INVALID_RESPONSE'],
    [{ status: 'failed', error: { message: 'PRIVATE_UPSTREAM_DETAIL' } }, 'OPENAI_RESPONSE_FAILED'],
  ]) {
    assert.throws(() => withReply(200, body).pdcOpenAIGrade_(activity, 'Resposta'), error => error.code === code);
  }
});

test('correcció exigeix passed booleà, feedback i confiança vàlids', () => {
  const good = { passed: true, feedback: 'Continua.', confidence: 0.9 };
  for (const invalid of [{ ...good, passed: 'false' }, { ...good, confidence: 2 }, { ...good, feedback: null }]) {
    assert.throws(() => withReply(200, packet(invalid)).pdcOpenAICorrection_(activity, 'Resposta'),
      error => error.code === 'OPENAI_INVALID_CORRECTION');
  }
  assert.equal(withReply(200, packet(good)).pdcOpenAICorrection_(activity, 'Resposta').passed, true);
});

test('prova diagnòstica reutilitza body i parser reals, sense reintentar ni escriure acadèmicament', async () => {
  let calls = 0;
  const result = await runProbe(config, 'grade', async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.openai.com/v1/responses');
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'gpt-6-luna');
    assert.equal(body.reasoning.effort, 'medium');
    assert.equal(body.max_output_tokens, 1600);
    assert.equal(body.text.format.name, 'pdc_grade');
    return new Response(JSON.stringify(packet(grade)), { status: 200 });
  });
  assert.equal(calls, 1);
  assert.equal(result.resultValid, true);
  assert.equal(result.http, 200);
  assert.equal(result.automaticRetries, 0);
});

test('el diagnòstic no revela excepcions de transport ni usa una clau absent', async () => {
  assert.throws(() => readProbeConfig(undefined, {}), /Falta una clau/);
  let calls = 0;
  const result = await runProbe(config, 'grade', () => { calls++; throw new Error('PRIVATE_UPSTREAM_DETAIL'); });
  assert.equal(calls, 1);
  assert.equal(result.errorCode, 'OPENAI_TRANSPORT_OR_TIMEOUT');
  assert.ok(!JSON.stringify(result).includes('PRIVATE_UPSTREAM_DETAIL'));
});
