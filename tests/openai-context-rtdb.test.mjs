// Standalone contract tests: Node built-ins only, usable in the publication repo.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

function backend() {
  const ctx = vm.createContext({ Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (_, text) => [...createHash('sha256').update(text).digest()] } });
  vm.runInContext(fs.readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8'), ctx);
  return ctx;
}
const settings = { requireCorrectionAfterFailure: false, secondAttemptWithHint: true,
  secondAttemptEnabled: true, allowContinueAfterFirst: false, scorePolicy: 'SECOND_ATTEMPT' };
const throughDatabase = value => {
  if (Array.isArray(value)) return value.length ? value.map(throughDatabase) : undefined;
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort()
    .map(key => [key, throughDatabase(value[key])]).filter(([, item]) => item !== undefined && item !== null));
  return value;
};
function answer(ctx, activity) {
  const snapshot = { id: activity.id, unitId: activity.unitId, kind: activity.kind, prompt: activity.prompt,
    context: activity.context || '', data: activity.data || [], modelAnswer: activity.modelAnswer, rubric: activity.rubric || [] };
  return throughDatabase({ payload: { attemptsBefore: 0, attemptNumber: 1, recoveryContext: {
    schemaVersion: 'PDC_ANSWER_CONTEXT_V1', gradingSchemaVersion: 'PDC_OPEN_RUBRIC_V1',
    activityVersion: ctx.pdcHistoricalReviewHash_(snapshot), activitySnapshot: snapshot,
    pedagogicalPolicySnapshot: settings, scorePolicySnapshot: 'SECOND_ATTEMPT', threshold: 5, maxAttempts: 2,
  } } });
}

test('u03-05: RTDB reorders keys but preserves content, the original hash and the ANSWER', () => {
  const ctx = backend(), activity = ctx.PDC_ACTIVITY_CATALOG['u03-05'], event = answer(ctx, activity);
  assert.notEqual(ctx.pdcHistoricalReviewHash_(event.payload.recoveryContext.activitySnapshot), event.payload.recoveryContext.activityVersion);
  const before = JSON.stringify(event);
  assert.doesNotThrow(() => ctx.pdcValidateAnswerRecoveryContext_(event, activity, settings, 2));
  assert.equal(JSON.stringify(event), before);
});

test('all 90 open contexts, including empty data omitted by RTDB, remain recoverable', () => {
  const ctx = backend();
  const activities = Object.values(ctx.PDC_ACTIVITY_CATALOG).filter(item => ['open', 'decision', 'mission', 'text'].includes(item.kind));
  assert.equal(activities.length, 90);
  assert.ok(activities.some(item => !item.data?.length));
  for (const activity of activities) assert.doesNotThrow(() => ctx.pdcValidateAnswerRecoveryContext_(answer(ctx, activity), activity, settings, 2), activity.id);
});

test('different rubric, text, policy, attempt or hash remain rejected before grading', () => {
  const ctx = backend(), activity = ctx.PDC_ACTIVITY_CATALOG['u03-05'];
  for (const change of [
    event => { event.payload.recoveryContext.activitySnapshot.rubric[0].points--; },
    event => { event.payload.recoveryContext.activitySnapshot.prompt = 'Different'; },
    event => { event.payload.recoveryContext.activitySnapshot.data.reverse(); },
    event => { event.payload.recoveryContext.activityVersion = 'invalid'; },
    event => { event.payload.recoveryContext.pedagogicalPolicySnapshot.scorePolicy = 'BEST_ATTEMPT'; },
    event => { event.payload.recoveryContext.maxAttempts = 1; },
    event => { event.payload.attemptNumber = 3; },
  ]) {
    const event = answer(ctx, activity); change(event);
    assert.throws(() => ctx.pdcValidateAnswerRecoveryContext_(event, activity, settings, 2), /context original/);
  }
});
