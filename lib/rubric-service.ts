"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiCall, firebasePath, initFirebase, isDemo, safeKey } from "./services";
import { APPROVED_TEACHER_RUBRIC_SCORES, createRubricAssessment, effectiveTeacherRubricScale, rubricEvidence,
  validTeacherRubricScores, type RubricAssessment, type RubricLevel, type RubricLevelScale, type RubricLevelScores,
  type RubricRating, type RubricTemplate } from "./rubrics";

export type RubricData = { catalog: Record<string, { currentVersion: number; versions: Record<string, RubricTemplate> }>;
  assessments: Record<string, RubricAssessment>; ratings: Record<string, Record<string, Record<string, RubricRating>>>;
  levelScale?: RubricLevelScale };
const empty = (): RubricData => ({ catalog: {}, assessments: {}, ratings: {} });
let demo = empty();
const demoKey = "pdc-rubrics-demo-v1";
const readDemo = () => {
  try { demo = { ...empty(), ...JSON.parse(localStorage.getItem(demoKey) || "{}") }; } catch { demo = empty(); }
  return demo;
};
const persistDemo = () => { try { localStorage.setItem(demoKey, JSON.stringify(demo)); } catch { /* Demo remains available in memory. */ } };
const path = (...parts: string[]) => firebasePath("rubrics", ...parts);
const key = (value: string) => safeKey(value);
const database = () => {
  const db = initFirebase();
  if (!db) throw new Error("La biblioteca de rúbriques no està disponible.");
  return db;
};
export async function readRubricData(): Promise<RubricData> {
  if (isDemo()) return structuredClone(readDemo());
  const snapshot = await database().ref(path()).once("value");
  return { ...empty(), ...(snapshot.val() || {}) };
}
export function subscribeRubrics(callback: (data: RubricData) => void) {
  if (isDemo()) { callback(structuredClone(readDemo())); return () => {}; }
  const ref = database().ref(path());
  const listener = (snapshot: any) => callback({ ...empty(), ...(snapshot.val() || {}) });
  ref.on("value", listener);
  return () => ref.off("value", listener);
}
export async function saveTeacherRubricScale(scores: RubricLevelScores, expectedRevision: number): Promise<RubricLevelScale> {
  if (!validTeacherRubricScores(scores)) throw new Error("Introduïx quatre valors estrictament descendents entre 0 i 10.");
  if (isDemo()) {
    const current = readDemo();
    if (effectiveTeacherRubricScale(current.levelScale).revision !== expectedRevision) throw new Error("L’escala ha canviat. Recarrega-la.");
    const levelScale = { revision: expectedRevision + 1, scores };
    const next = { ...current, levelScale };
    localStorage.setItem(demoKey, JSON.stringify(next));
    demo = next;
    return levelScale;
  }
  const { scale } = await apiCall("teacher_save_rubric_level_scale", { scores, expectedRevision });
  if (!scale || effectiveTeacherRubricScale(scale).revision === 0 ||
      Object.keys(scores).some(level => scale.scores[level] !== scores[level as keyof RubricLevelScores])) {
    throw new Error("No s’ha pogut confirmar l’escala guardada.");
  }
  return { revision: scale.revision, scores: scale.scores };
}
export function listRubrics(data: RubricData) {
  return Object.values(data.catalog || {}).map((entry) => entry.versions?.[entry.currentVersion])
    .filter((entry): entry is RubricTemplate => Boolean(entry && entry.status === "ACTIVE"))
    .sort((a, b) => a.topic.localeCompare(b.topic, "ca") || a.name.localeCompare(b.name, "ca"));
}
export async function saveRubric(template: RubricTemplate) {
  if (isDemo()) {
    readDemo();
    const entry = demo.catalog[template.rubricId] || { currentVersion: 0, versions: {} };
    entry.versions[template.version] = structuredClone(template); entry.currentVersion = template.version;
    demo.catalog[template.rubricId] = entry; persistDemo(); return;
  }
  const db = database(), id = key(template.rubricId);
  const current = (await db.ref(path("catalog", id)).once("value")).val();
  if (template.version !== Number(current?.currentVersion || 0) + 1) throw new Error("La rúbrica ha canviat. Recarrega-la abans d’editar.");
  await db.ref(path()).update({
    [`catalog/${id}/versions/${template.version}`]: template,
    [`catalog/${id}/currentVersion`]: template.version,
    [`pending/catalog-${id}-${template.version}`]: { kind: "CATALOG", rubricId: template.rubricId, version: template.version, status: "SYNC_PENDING", createdAt: Date.now() },
  });
}
export async function applyRubric(template: RubricTemplate, groupId: string,
  metadata?: { applicationName: string; date: string; context?: string }) {
  if (metadata && (!metadata.applicationName.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)))
    throw new Error("Indica un nom i una data vàlids.");
  const assessment = createRubricAssessment(template, groupId, crypto.randomUUID(), new Date().toISOString(), metadata);
  if (isDemo()) { readDemo(); demo.assessments[assessment.assessmentId] = assessment; persistDemo(); return assessment; }
  await database().ref(path()).update({
    [`assessments/${key(assessment.assessmentId)}`]: assessment,
    [`pending/assessment-${key(assessment.assessmentId)}`]: { kind: "ASSESSMENT", assessmentId: assessment.assessmentId, status: "SYNC_PENDING", createdAt: Date.now() },
  });
  return assessment;
}

export async function updateRubricApplication(assessmentId: string,
  metadata: { applicationName: string; date: string; context: string }) {
  if (!metadata.applicationName.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.date))
    throw new Error("Indica un nom i una data vàlids.");
  const id = key(assessmentId), now = new Date().toISOString();
  if (isDemo()) {
    readDemo(); const previous = demo.assessments[id];
    if (!previous) throw new Error("L’aplicació ja no existeix.");
    demo.assessments[id] = { ...previous, ...metadata, applicationName: metadata.applicationName.trim(),
      context: metadata.context.trim(), updatedAt: now };
    persistDemo(); return demo.assessments[id];
  }
  const db = database();
  const result = await db.ref(path("assessments", id)).transaction((previous: RubricAssessment | null) =>
    previous ? { ...previous, applicationName: metadata.applicationName.trim(), date: metadata.date,
      context: metadata.context.trim(), updatedAt: now } : undefined);
  if (!result.committed) throw new Error("L’aplicació ja no existeix.");
  await db.ref(path("pending", `assessment-${id}`)).set({ kind: "ASSESSMENT", assessmentId,
    status: "SYNC_PENDING", createdAt: Date.now() });
  return result.snapshot.val() as RubricAssessment;
}

export async function deleteRubricApplication(assessmentId: string) {
  const id = key(assessmentId);
  if (isDemo()) {
    readDemo(); delete demo.assessments[id]; delete demo.ratings[id]; persistDemo();
  } else {
    const db = database();
    await db.ref(path()).update({
      [`deletedAssessments/${id}`]: { deletedAt: Date.now() },
      [`assessments/${id}`]: null, [`ratings/${id}`]: null,
      [`pending/assessment-${id}`]: null,
      [`pending/delete-assessment-${id}`]: { kind: "DELETE_ASSESSMENT", assessmentId,
        status: "SYNC_PENDING", createdAt: Date.now() },
    });
  }
  // A delayed local click must not resurrect a deleted application.
  for (const [ratingId, task] of pending) if (ratingId.startsWith(`${id}/`)) {
    task.cancelled = true; clearTimeout(task.timer); pending.delete(ratingId);
  }
}

// One writer per assessment/student/indicator. Rapid taps change the desired value immediately;
// an in-flight write finishes before the newest value is sent, so stale replies cannot win.
type Pending = { desired: RubricLevel; revision: number; flushing: boolean; timer?: ReturnType<typeof setTimeout>;
  cancelled?: boolean; listeners: Set<(status: "pending" | "saved" | "error") => void> };
const pending = new Map<string, Pending>();
const ratingKey = (assessmentId: string, studentId: string, indicatorId: string) => [assessmentId, studentId, indicatorId].map(key).join("/");
export function pendingRubricWrites() { return pending.size; }
export function saveRubricRating(assessmentId: string, studentId: string, indicatorId: string, levelId: RubricLevel,
  notify?: (status: "pending" | "saved" | "error") => void) {
  const id = ratingKey(assessmentId, studentId, indicatorId);
  const task = pending.get(id) || { desired: levelId, revision: Date.now() * 1000, flushing: false, listeners: new Set() } as Pending;
  task.desired = levelId; task.revision++;
  if (notify) task.listeners.add(notify);
  pending.set(id, task); task.listeners.forEach((listener) => listener("pending"));
  clearTimeout(task.timer);
  task.timer = setTimeout(() => void flush(id, task), 120);
}
async function flush(id: string, task: Pending) {
  if (task.cancelled || task.flushing || pending.get(id) !== task) return;
  task.flushing = true;
  const revision = task.revision, levelId = task.desired;
  const [assessmentId, studentId, indicatorId] = id.split("/");
  const rating: RubricRating = { assessmentId, studentId, indicatorId, levelId, revision,
    updatedAt: new Date().toISOString(), status: "SYNC_PENDING" };
  try {
    if (isDemo()) { readDemo(); (demo.ratings[assessmentId] ||= {})[studentId] ||= {}; demo.ratings[assessmentId][studentId][indicatorId] = rating; persistDemo(); }
    else {
      const db = database();
      if ((await db.ref(path("deletedAssessments", assessmentId)).once("value")).val()) {
        pending.delete(id); return;
      }
      const ref = db.ref(path("ratings", assessmentId, studentId, indicatorId));
      const saved = await ref.transaction((current: RubricRating | null) => current && current.revision > revision ? undefined : rating);
      if (!saved.committed && saved.snapshot.val()?.levelId !== levelId) throw new Error("Valoració més recent en una altra pestanya.");
    }
    if (task.revision === revision) { pending.delete(id); task.listeners.forEach((listener) => listener("saved")); }
  } catch {
    task.listeners.forEach((listener) => listener("error"));
    // Keep the desired level and retry on connectivity; the teacher can keep working.
    clearTimeout(task.timer); task.timer = setTimeout(() => void flush(id, task), 5000);
  } finally {
    task.flushing = false;
    if (pending.get(id) === task && task.revision !== revision) {
      clearTimeout(task.timer); task.timer = setTimeout(() => void flush(id, task), 0);
    }
  }
}
export function rubricOperationalEvidence(data: RubricData) {
  return Object.values(data.assessments || {}).flatMap((assessment) =>
    Object.entries(data.ratings?.[key(assessment.assessmentId)] || {}).flatMap(([studentId, ratings]) =>
      rubricEvidence(assessment, studentId, ratings, APPROVED_TEACHER_RUBRIC_SCORES)));
}
