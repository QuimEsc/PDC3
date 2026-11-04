import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8');
const root = 'GamificacioPDC/academic/PDC3';
const activityId = 'u01-05';

function fixture(scores, settings = { secondAttemptWithHint: true, requireCorrectionAfterFailure: false }) {
  const values = new Map();
  const props = new Map([['GRUP_ID', 'PDC3'], ['OPENAI_MODEL', 'gpt-6-luna']]);
  const cache = new Map();
  let calls = 0;
  let duringGrade = null;
  const propertyStore = {
    getProperty: key => props.get(key) || null,
    setProperty: (key, value) => { props.set(key, value); },
    deleteProperty: key => { props.delete(key); },
  };
  const context = vm.createContext({
    Date, JSON, Math, Number, String, Object, Array, Error, Boolean, isFinite,
    console: { log() {} },
    PropertiesService: { getScriptProperties: () => propertyStore },
    CacheService: { getScriptCache: () => ({ get: key => cache.get(key), put: (key, value) => cache.set(key, value) }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) },
  });
  vm.runInContext(source, context);
  const realOpenAIGrade = context.pdcOpenAIGrade_;
  context.pdcSubmissionKey_ = (student, activity, submission) => `${student}:${activity}:${submission}`;
  context.pdcFirebaseAdminGet_ = path => {
    if (values.has(path)) return values.get(path);
    const entries = [...values.entries()].filter(([key]) => key.startsWith(`${path}/`) && !key.slice(path.length + 1).includes('/'));
    return entries.length ? Object.fromEntries(entries.map(([key, value]) => [key.slice(path.length + 1), value])) : null;
  };
  context.pdcFirebaseAdminPatch_ = (path, updates) => {
    for (const [key, value] of Object.entries(updates)) values.set(`${path}/${key}`, value);
  };
  context.pdcRubricGradeIssues_ = () => [];
  context.pdcApplyPdcCalibration_ = (_, __, grade) => grade;
  context.pdcNormalizeRubricGrade_ = (_, __, grade) => grade;
  context.pdcSanitizeStudentGrade_ = grade => grade;
  context.pdcSealGradeFeedback_ = grade => grade;
  context.pdcOpenAIGrade_ = () => {
    calls++;
    if (duringGrade) duringGrade();
    const score = scores.shift();
    if (score instanceof Error) throw score;
    return { score, status: score >= 8 ? 'correct' : score >= 5 ? 'partial' : 'incorrect',
      feedback: 'Retorn de prova', confidence: 0.95, criterionScores: [], teacherReview: false };
  };
  values.set('GamificacioPDC/teacherState/PDC3', {
    dashboard: {
      unitAccess: [{ unitId: 'u01', enabled: true, configuredEnabled: true, explicitlyClosed: false,
        closed: false, term: 1, termClosed: false }],
      assessmentPlan: { terms: [{ term: 1, closed: false }], activities: [{ activityId, maxGradedAttempts: 2 }] },
      pedagogicalSettings: settings,
    },
  });
  const send = (id, attemptsBefore, variant = 0, answerSession = 'session', currentSession = 'session') => {
    values.set(`${root}/events/TEST/${id}-answer`, {
      eventId: `${id}-answer`, submissionId: id, studentId: 'TEST', sessionId: answerSession,
      unitId: 'u01', activityId, sequence: attemptsBefore * 2 + 1, createdAt: Date.now(),
      payload: { answer: 'Resposta pròpia', kind: 'open', attemptsBefore, variant }, status: 'PROCESSING',
    });
    return context.pdcGradeOpenFirebase_({ groupId: 'PDC3', studentId: 'TEST', sessionId: currentSession, activityId, submissionId: id });
  };
  return { context, values, props, send, realOpenAIGrade, calls: () => calls, duringGrade: callback => { duringGrade = callback; } };
}

test('un ANSWER persistent es recupera amb el mateix submissionId després de reconnectar', () => {
  const f = fixture([6]);
  const result = f.send('reconnect-1', 0, 0, 'old-session', 'new-session');
  assert.equal(result.grade.score, 6);
  assert.equal(result.progress.lastSubmissionId, 'reconnect-1');
  assert.equal(f.calls(), 1);
  const retry = f.send('reconnect-1', 0, 0, 'old-session', 'new-session');
  assert.equal(retry.grade.score, 6);
  assert.equal(f.calls(), 1);
});

test('la configuració Firebase real viu dins dashboard; la ruta arrel sola no és font operativa', () => {
  const f = fixture([6]);
  const path = 'GamificacioPDC/teacherState/PDC3';
  const state = f.values.get(path);
  assert.equal(state.unitAccess, undefined);
  assert.equal(f.send('s1', 0).progress.score, 6);
  f.values.set(path, { unitAccess: state.dashboard.unitAccess,
    assessmentPlan: state.dashboard.assessmentPlan, settings: state.dashboard.pedagogicalSettings });
  assert.throws(() => f.send('s2', 0), /configuracio de classe/);
});

test('una acció docent posterior a la importació preval sobre el snapshot dashboard', () => {
  const f = fixture([4]);
  const path = 'GamificacioPDC/teacherState/PDC3';
  const state = f.values.get(path);
  state.unitAccess = [{ ...state.dashboard.unitAccess[0], enabled: false, closed: true }];
  assert.throws(() => f.send('s1', 0), /unitat no esta oberta/);
  state.unitAccess = state.dashboard.unitAccess;
  state.settings = { secondAttemptEnabled: false, secondAttemptWithHint: false, requireCorrectionAfterFailure: false };
  const first = f.send('s1', 0);
  assert.equal(first.progress.locked, true);
  assert.equal(first.progress.gradedAttempts, 1);
});

test('primer intent aprovat: una nota i cap segon intent', () => {
  const f = fixture([7]);
  const result = f.send('s1', 0);
  assert.equal(result.progress.score, 7);
  assert.equal(result.progress.finalScore, 7);
  assert.equal(result.progress.bestScore, 7);
  assert.equal(result.progress.locked, true);
  assert.equal(result.attempt, 1);
  assert.equal(f.calls(), 1);
  assert.equal(f.send('s1', 0).recovered, true);
  assert.equal(f.calls(), 1);
  assert.throws(() => f.send('s2', 1), /intent pendent/);
  assert.equal(f.values.get(`${root}/backendGrades/TEST/s1`).model, 'gpt-6-luna');
  assert.equal(f.values.get(`${root}/pendingEvents/s1-grade`).payload.progress.score, 7);
  const recovered = f.context.pdcSubmissionStatus_({ groupId: 'PDC3', studentId: 'TEST', activityId, submissionId: 's1', phase: 'GRADE' });
  assert.equal(recovered.state, 'SAVED');
  assert.equal(recovered.progress.score, 7);
});

test('dos intents independents: millora, millor nota i historial', () => {
  const f = fixture([4, 7]);
  assert.equal(f.send('s1', 0).progress.locked, false);
  const second = f.send('s2', 1);
  assert.equal(second.attempt, 2);
  assert.equal(second.progress.score, 7);
  assert.equal(second.progress.finalScore, 7);
  assert.equal(second.progress.bestScore, 7);
  assert.equal(second.progress.firstScore, 4);
  assert.equal(second.progress.locked, true);
  assert.equal(f.values.get(`${root}/backendGrades/TEST/s1`).score, 4);
  assert.equal(f.values.get(`${root}/backendGrades/TEST/s2`).score, 7);
  assert.throws(() => f.send('s3', 2), /intent pendent/);
  assert.equal(f.calls(), 2);
});

test('dos suspesos: la nota final és l’última i la millor es conserva separadament', () => {
  const f = fixture([4, 3], { secondAttemptWithHint: true, requireCorrectionAfterFailure: true });
  f.send('s1', 0);
  const second = f.send('s2', 1);
  assert.equal(second.progress.score, 3);
  assert.equal(second.progress.finalScore, 3);
  assert.equal(second.progress.bestScore, 4);
  assert.equal(second.progress.lastScore, 3);
  assert.equal(second.progress.lockReason, 'MAX_INTENTS');
  assert.equal(second.progress.correctionRequired, false);
  assert.equal(second.progress.locked, true);
  assert.throws(() => f.send('s3', 2), /intent pendent/);
});

test('4.8 seguit de 4.5 conserva 4.8 informatiu i aplica 4.5 acadèmic', () => {
  const f = fixture([4.8, 4.5]);
  f.send('s1', 0);
  const second = f.send('s2', 1);
  assert.equal(second.progress.score, 4.5);
  assert.equal(second.progress.finalScore, 4.5);
  assert.equal(second.progress.bestScore, 4.8);
});

test('5.0 exacte supera i no obri un segon intent', () => {
  const f = fixture([5]);
  const first = f.send('s1', 0);
  assert.equal(first.progress.lockReason, 'SUPERADA');
  assert.equal(first.progress.score, 5);
  assert.throws(() => f.send('s2', 1), /intent pendent/);
});

test('fallada tècnica del segon intent conserva ANSWER i el primer resultat fins al retry del mateix ID', () => {
  const f = fixture([4, new Error('API unavailable'), 3]);
  f.send('s1', 0);
  assert.throws(() => f.send('s2', 1), /API unavailable/);
  assert.ok(f.values.get(`${root}/events/TEST/s2-answer`));
  assert.equal(f.values.get(`${root}/backendGrades/TEST/s2`), undefined);
  assert.equal(f.values.get(`${root}/events/TEST/s1-grade`).payload.progress.score, 4);
  const recovered = f.send('s2', 1);
  assert.equal(recovered.progress.score, 3);
  assert.equal(recovered.progress.bestScore, 4);
  assert.equal(f.calls(), 3);
});

test('una millora parcial de 2.5 a 4.5 conserva 4.5 i tanca després de dos intents', () => {
  const f = fixture([2.5, 4.5]);
  f.send('s1', 0);
  const second = f.send('s2', 1);
  assert.equal(second.progress.score, 4.5);
  assert.equal(second.progress.firstScore, 2.5);
  assert.equal(second.progress.locked, true);
  assert.equal(second.progress.correctionRequired, false);
});

test('una nota amb revisió docent manté nota i no crea un tercer intent', () => {
  const f = fixture([]);
  f.context.pdcOpenAIGrade_ = () => {
    const score = 7;
    return { score, status: 'review', feedback: 'Revisió de prova', confidence: 0.5, criterionScores: [], teacherReview: true };
  };
  const result = f.send('s1', 0);
  assert.equal(result.progress.score, 7);
  assert.equal(result.progress.locked, true);
  assert.equal(result.grade.teacherReview, true);
  assert.throws(() => f.send('s2', 1), /intent pendent/);
});

test('error OpenAI conserva ANSWER i no consumeix intent; retry usa el mateix ID', () => {
  const f = fixture([new Error('API unavailable'), 6]);
  assert.throws(() => f.send('s1', 0), /API unavailable/);
  assert.ok(f.values.get(`${root}/events/TEST/s1-answer`));
  assert.equal(f.values.get(`${root}/backendGrades/TEST/s1`), undefined);
  assert.equal(f.send('s1', 0).progress.gradedAttempts, 1);
  assert.equal(f.calls(), 2);
});

test('petició concurrent del mateix ID no duplica la crida ni la factura', () => {
  const f = fixture([6]);
  f.duringGrade(() => assert.throws(() => f.send('s1', 0), /processant/));
  f.send('s1', 0);
  assert.equal(f.calls(), 1);
});

test('grading Firebase no accedeix a Sheets ni accepta nota del client', () => {
  const f = fixture([6]);
  f.context.pdcObjects_ = () => { throw new Error('Sheets offline'); };
  const result = f.send('s1', 0);
  assert.equal(result.progress.score, 6);
  assert.equal(f.values.get(`${root}/events/TEST/s1-grade`).payload.serverGrade, true);
  assert.equal(f.context.pdcOpenGradingModel_(), 'gpt-6-luna');
});

test('la sessió i la ANSWER canònica impedixen corregir submissions alienes o notes del client', () => {
  const f = fixture([6]);
  f.props.set('PDC_ACTIVE_STUDENT_SESSION_PDC3_TEST', 'session');
  assert.throws(() => f.context.pdcRequireOpenGradeSession_({ groupId: 'PDC3', studentId: 'TEST', sessionId: 'foreign' }), /un altre dispositiu/);
  f.context.pdcRequireOpenGradeSession_({ groupId: 'PDC3', studentId: 'TEST', sessionId: 'session' });
  assert.throws(() => f.context.pdcGradeOpenFirebase_({ groupId: 'PDC3', studentId: 'TEST', sessionId: 'session', activityId, submissionId: 'missing' }), /resposta encara no/);
  f.values.set(`${root}/events/TEST/s1-answer`, { eventId: 's1-answer', submissionId: 's1', studentId: 'OTHER', sessionId: 'session', unitId: 'u01', activityId,
    payload: { answer: 'Resposta', kind: 'open', attemptsBefore: 0 }, createdAt: Date.now() });
  assert.throws(() => f.context.pdcGradeOpenFirebase_({ groupId: 'PDC3', studentId: 'TEST', sessionId: 'session', activityId, submissionId: 's1' }), /resposta encara no/);
  f.values.delete(`${root}/events/TEST/s1-answer`);
  const result = f.send('s1', 0);
  assert.equal(result.grade.score, 6);
  assert.equal(f.context.pdcGradeOpenFirebase_({ groupId: 'PDC3', studentId: 'TEST', sessionId: 'session', activityId, submissionId: 's1', score: 10,
    answer: 'nota inventada', activity: { modelAnswer: 'falsa' } }).grade.score, 6);
  assert.equal(f.calls(), 1);
});

test('els dos intents usen exactament el mateix model, prompt i pressupost de resposta', () => {
  const f = fixture([]);
  const bodies = [];
  f.context.pdcOpenAIGrade_ = f.realOpenAIGrade;
  f.context.OPENAI_ACTIU = true;
  f.context.pdcOpenAIApiKey_ = () => 'test-only-key';
  f.context.pdcActivityOrdinal_ = () => 5;
  f.context.UrlFetchApp = { fetch: (_url, options) => {
    bodies.push(JSON.parse(options.payload));
    return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ output: [{ content: [{ type: 'output_text', text: JSON.stringify({
      score: 4, status: 'incorrect', feedback: 'Revisa la dada.', strengths: [], improvements: [],
      teacherReview: false, confidence: 0.95, reviewReason: '', criterionScores: [],
    }) }] }] }) };
  } };
  const activity = f.context.PDC_ACTIVITY_CATALOG[activityId];
  f.context.pdcOpenAIGrade_(activity, 'Primera resposta');
  f.context.pdcOpenAIGrade_(activity, 'Segona resposta');
  assert.equal(bodies.length, 2);
  for (const body of bodies) {
    assert.equal(body.model, 'gpt-6-luna');
    assert.equal(body.reasoning.effort, 'medium');
    assert.equal(body.max_output_tokens, 1600);
  }
  assert.deepEqual(bodies[0].input[0], bodies[1].input[0]);
  const first = JSON.parse(bodies[0].input[1].content[0].text);
  const second = JSON.parse(bodies[1].input[1].content[0].text);
  assert.deepEqual({ ...first, answer: '' }, { ...second, answer: '' });
  assert.ok(!('previousGrade' in second));
});

test('el worker no projecta intent 2 si falla Sheets en intent 1', () => {
  const f = fixture([]);
  const pending = {};
  for (const [id, time] of [['s1', 1], ['s2', 2]]) {
    pending[`${id}-grade`] = { eventId: `${id}-grade`, submissionId: id, studentId: 'TEST', activityId,
      unitId: 'u01', sessionId: 'session', status: 'SYNC_PENDING', createdAt: time,
      payload: { kind: 'open', answer: 'resposta', grade: { score: 4 }, progress: { gradedAttempts: time }, serverGrade: true } };
    f.values.set(`${root}/backendGrades/TEST/${id}`, { grade: { score: 4, status: 'incorrect', feedback: 'prova' },
      telemetry: { studentId: 'TEST', activityId, submissionId: id, gradingMode: 'open' }, maxAttempts: 2 });
  }
  f.values.set(`${root}/pendingEvents`, pending);
  f.context.pdcConfigValue_ = () => 'PDC3';
  f.context.pdcSubmissionState_ = () => 'MISSING';
  const processed = [];
  f.context.pdcSaveProgressFromWorker_ = data => { processed.push(data.submissionId); throw Error('Sheets offline'); };
  f.context.pdcFirebaseAdminSet_ = (path, value) => { f.values.set(path, value); };
  f.context.pdcTeacherProjectionWorker_ = () => {};
  f.context.pdcAcademicSyncWorker_();
  assert.deepEqual(processed, ['s1']);
  assert.equal(f.values.get(`${root}/pendingEvents/s1-grade`).status, 'SYNC_ERROR');
  assert.equal(pending['s2-grade'].status, 'SYNC_PENDING');
});

test('el worker no substituïx una valoració docent posterior', () => {
  const f = fixture([]);
  const eventId = 's1-grade';
  const updatePath = 'GamificacioPDC/teacherState/PDC3/studentUpdates/TEST/' + activityId;
  const teacherDecision = { score: 9, teacherOverrideScore: 9, reviewedByTeacher: true };
  f.values.set(updatePath, teacherDecision);
  f.values.set(`${root}/pendingEvents`, { [eventId]: { eventId, submissionId: 's1', studentId: 'TEST', activityId,
    unitId: 'u01', sessionId: 'session', status: 'SYNC_PENDING', createdAt: 1,
    payload: { kind: 'open', answer: 'resposta', serverGrade: true, progress: { gradedAttempts: 1 } } } });
  f.values.set(`${root}/backendGrades/TEST/s1`, { grade: { score: 4, status: 'incorrect', feedback: 'prova' },
    telemetry: { studentId: 'TEST', activityId, submissionId: 's1', gradingMode: 'open' }, maxAttempts: 2 });
  f.context.pdcConfigValue_ = () => 'PDC3';
  f.context.pdcSubmissionState_ = () => 'MISSING';
  f.context.pdcSaveProgressFromWorker_ = () => ({ progress: { score: 4, finalScore: 4 }, student: {} });
  f.context.pdcFirebaseAdminSet_ = (path, value) => { f.values.set(path, value); };
  f.context.pdcFirebaseAdminDelete_ = path => { f.values.delete(path); };
  f.context.pdcObjects_ = () => [];
  f.context.pdcAppend_ = () => {};
  f.context.pdcCompleteSubmission_ = () => {};
  f.context.pdcTeacherProjectionWorker_ = () => {};
  f.context.pdcAcademicSyncWorker_();
  assert.deepEqual(f.values.get(updatePath), teacherDecision);
  assert.equal(f.values.has('GamificacioPDC/teacherState/PDC3/studentUpdates/TEST'), false);
  assert.equal(f.values.get(`${root}/pendingEvents/${eventId}`), undefined);
});

test('el worker projecta en Sheets la nota final inferior i conserva la millor sense perdre intents', () => {
  const rows = { Progres: [], Respostes: [] };
  const context = vm.createContext({ Date, JSON, Math, Number, String, Object, Array, Error, Boolean, isFinite,
    Utilities: { getUuid: () => 'test-uuid' } });
  vm.runInContext(source, context);
  context.pdcObjects_ = name => rows[name] || [];
  context.pdcSheet_ = name => name;
  context.pdcAppend_ = (name, fields) => rows[name].push({ _row: rows[name].length + 2, ...fields });
  context.pdcWriteRow_ = (name, rowNumber, fields) => Object.assign(rows[name][rowNumber - 2], fields);
  context.pdcActivityPolicy_ = () => ({ maxGradedAttempts: 2, retryCounts: true });
  context.pdcProgressRewards_ = () => ({ badges: [], avatars: [] });
  context.pdcCompleteReinforcement_ = () => false;
  context.pdcStudentProfile_ = () => ({});
  context.pdcCompleteSubmission_ = () => {};
  context.pdcSubmissionId_ = value => value;
  const send = (submissionId, score) => context.pdcSaveProgressFromWorker_({
    studentId: 'TEST', activityId, unitId: 'u01', kind: 'open', submissionId,
    answer: 'Resposta de prova', score, status: 'incorrect', feedback: 'Retorn',
    gradeJson: JSON.stringify({ score, status: 'incorrect' }), _authoritativeOpenGrade: true,
    _openGradeMaxAttempts: 2,
  });
  send('first', 4);
  const second = send('second', 3);
  assert.equal(rows.Progres.length, 1);
  assert.equal(rows.Respostes.length, 2);
  assert.deepEqual(rows.Respostes.map(row => row.Puntuacio), [4, 3]);
  assert.equal(rows.Progres[0].Puntuacio, 3);
  assert.equal(rows.Progres[0].IntentsQualificables, 2);
  assert.equal(JSON.parse(rows.Progres[0].UltimaNotaJSON).bestScore, 4);
  assert.equal(second.progress.score, 3);
  assert.equal(second.progress.bestScore, 4);
  assert.equal(second.progress.correctionRequired, false);
});
