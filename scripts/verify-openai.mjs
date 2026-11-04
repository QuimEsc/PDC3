import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

// Only fabricated content. This tool cannot write to Firebase, Sheets or Apps Script.
const activity = {
  id: 'diagnostic-01', kind: 'open',
  prompt: 'Una planta mesura 4 cm al matí i 6 cm a la vesprada. Quant ha crescut? Explica el càlcul.',
  context: 'Prova tècnica fictícia, sense alumnat ni registre acadèmic.',
  modelAnswer: 'Ha crescut 2 cm, perquè 6 menys 4 és 2.',
  rubric: [{ label: 'Resultat', points: 5, description: 'Identifica 2 cm.' },
    { label: 'Raonament', points: 5, description: 'Explica la diferència entre les dues mesures.' }],
};
const answer = 'Ha crescut 2 cm perquè reste 6 menys 4.';

export function readProbeConfig(configPath, env = process.env) {
  const text = configPath ? fs.readFileSync(configPath, 'utf8') : '';
  function literal(name) {
    const matches = [...text.matchAll(new RegExp(`(?:var|const|let)\\s+${name}\\s*=\\s*["']([^"']*)["']`, 'g'))];
    const values = [...new Set(matches.map(m => m[1].trim()))];
    if (values.length > 1) throw new Error(`Configuració contradictòria: ${name}.`);
    return values[0] || '';
  }
  const fileKey = literal('OPENAI_API_KEY');
  const envKey = (env.OPENAI_API_KEY || '').trim();
  const usable = value => value && !/^(?:POSA_|LA_TEUA_)/.test(value);
  if (usable(fileKey) && usable(envKey) && fileKey !== envKey) {
    throw new Error('Claus diferents en el fitxer i en l’entorn; selecciona una única font.');
  }
  const key = usable(fileKey) ? fileKey : usable(envKey) ? envKey : '';
  if (!key) throw new Error('Falta una clau privada: usa OPENAI_API_KEY o --config-path fora del repositori.');
  return {
    key, active: !/\bOPENAI_ACTIU\s*=\s*false\b/.test(text),
    model: literal('OPENAI_MODEL') || env.OPENAI_MODEL || 'gpt-6-luna',
    correctionModel: literal('OPENAI_CORRECTION_MODEL') || env.OPENAI_CORRECTION_MODEL || 'gpt-6-luna',
  };
}

export function createProbeContext(config) {
  const context = vm.createContext({
    OPENAI_API_KEY: config.key, OPENAI_ACTIU: config.active,
    OPENAI_MODEL: config.model, OPENAI_CORRECTION_MODEL: config.correctionModel,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null }) },
    console: { log() {}, error() {} },
  });
  vm.runInContext(fs.readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8'), context);
  return context;
}

export async function runProbe(config, mode = 'grade', transport = fetch) {
  if (!['grade', 'correction'].includes(mode)) throw new Error('Mode no vàlid.');
  const context = createProbeContext(config);
  const invoke = () => mode === 'grade'
    ? context.pdcOpenAIGrade_(activity, answer)
    : context.pdcOpenAICorrection_(activity, answer);
  const captured = new Error('CAPTURE_ONLY');
  let request;
  context.UrlFetchApp = { fetch: (url, options) => { request = { url, options }; throw captured; } };
  try { invoke(); } catch (error) { if (error !== captured) throw error; }
  if (request?.url !== 'https://api.openai.com/v1/responses') throw new Error('Endpoint no autoritzat.');
  const body = JSON.parse(request.options.payload);
  const started = Date.now();
  let response;
  let raw;
  try {
    response = await transport(request.url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...request.options.headers },
      body: request.options.payload, signal: AbortSignal.timeout(60000),
    });
    raw = await response.text();
  } catch {
    return { mode, http: 0, model: body.model, durationMs: Date.now() - started,
      resultValid: false, errorCode: 'OPENAI_TRANSPORT_OR_TIMEOUT', automaticRetries: 0 };
  }
  let parsed = {};
  try { parsed = JSON.parse(raw); } catch { /* The real parser below rejects this response. */ }
  context.UrlFetchApp = { fetch: () => ({ getResponseCode: () => response.status, getContentText: () => raw }) };
  let valid = false;
  let errorCode = '';
  try {
    const result = invoke();
    valid = mode === 'grade'
      ? Number.isFinite(result.score) && typeof result.feedback === 'string' && Array.isArray(result.criterionScores)
      : typeof result.passed === 'boolean' && typeof result.feedback === 'string' && Number.isFinite(result.confidence);
    if (!valid) errorCode = 'OPENAI_RESULT_INVALID';
  } catch (error) {
    // Never print upstream bodies/messages: they can contain sensitive request information.
    errorCode = /^OPENAI_[A-Z0-9_]+$/.test(error.code || '') ? error.code : 'OPENAI_RESULT_REJECTED';
  }
  return { mode, http: response.status, model: body.model, returnedModel: parsed.model || null,
    reasoning: body.reasoning?.effort || null, maxOutputTokens: body.max_output_tokens,
    apiStatus: parsed.status || null, incompleteReason: parsed.incomplete_details?.reason || null,
    durationMs: Date.now() - started, resultValid: valid, errorCode,
    inputTokens: parsed.usage?.input_tokens ?? null, outputTokens: parsed.usage?.output_tokens ?? null,
    apiErrorCode: typeof parsed.error?.code === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(parsed.error.code) ? parsed.error.code : null,
    automaticRetries: 0 };
}

async function main() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--config-path', '--model', '--mode', '--output'].includes(args[i]) || !args[i + 1]) {
      throw new Error('Ús: node scripts/verify-openai.mjs [--config-path FITXER_PRIVAT] [--mode grade|correction|all] [--model MODEL] [--output FITXER].');
    }
    options[args[i]] = args[i + 1];
  }
  const config = readProbeConfig(options['--config-path'] || process.env.PDC_OPENAI_CONFIG);
  if (options['--model']) config.model = config.correctionModel = options['--model'];
  const mode = options['--mode'] || 'grade';
  if (!['grade', 'correction', 'all'].includes(mode)) throw new Error('Mode no vàlid.');
  const results = [];
  for (const item of mode === 'all' ? ['grade', 'correction'] : [mode]) {
    const result = await runProbe(config, item);
    results.push(result);
    console.log(JSON.stringify(result));
    if (options['--output']) fs.writeFileSync(options['--output'], JSON.stringify(results, null, 2) + '\n');
  }
  if (results.some(result => !result.resultValid)) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => {
    // All setup errors are locally authored; no raw network exceptions or credentials.
    console.error(error.message.startsWith('Configuració') || error.message.startsWith('Claus diferents') || error.message.startsWith('Falta una clau')
      ? error.message : 'No s’ha pogut completar la prova. Revisa la ruta privada i els arguments.');
    process.exitCode = 1;
  });
}
