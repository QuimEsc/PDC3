"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Activity, Unit } from "./curriculum";

declare global {
  interface Window {
    PDC_CONFIG?: {
      appsScriptUrl?: string;
      groupId?: string;
      firebaseRoot?: string;
      liveHeartbeatMs?: number;
      liveTtlHours?: number;
    };
    firebaseConfig?: Record<string, string>;
    firebase?: any;
  }
}

const teacherTokenKey = "pdc-teacher-token-v1";
const sessionKey = "pdc-student-session-v1";
const demoStudents = [
  { id: "A01", name: "Aina" }, { id: "A02", name: "Biel" }, { id: "A03", name: "Carla" },
  { id: "A04", name: "Dídac" }, { id: "A05", name: "Elena" }, { id: "A06", name: "Ferran" },
];

export type Student = { id: string; name: string; energy?: number; streak?: number };
export type StudentSession = { studentId: string; studentName: string; sessionId: string };
export type AiGrade = {
  status: "correct" | "partial" | "incorrect" | "review";
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  teacherReview: boolean;
};

const getConfig = () => typeof window === "undefined" ? {} : window.PDC_CONFIG ?? {};
export const isConfigured = () => Boolean(getConfig().appsScriptUrl && !getConfig().appsScriptUrl?.includes("POSA_ACI"));
export const isDemo = () => typeof window === "undefined" || new URLSearchParams(window.location.search).get("demo") === "1" || !isConfigured();

export async function apiCall(action: string, payload: Record<string, unknown> = {}) {
  if (isDemo()) return demoCall(action, payload);
  const token = sessionStorage.getItem(teacherTokenKey) || "";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), action === "grade_open" ? 60000 : 30000);
  try {
    const response = await fetch(getConfig().appsScriptUrl!, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, groupId: getConfig().groupId || "PDC3", teacherToken: token, ...payload }),
      redirect: "follow",
      signal: controller.signal,
    });
    const data = await response.json();
    if (data.authRequired) sessionStorage.removeItem(teacherTokenKey);
    if (!response.ok || data.ok === false) throw new Error(data.error || "Error del servidor.");
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error(payload.locale === "es" ? "El servidor tarda demasiado. Vuelve a intentarlo." : "El servidor tarda massa. Torna-ho a intentar.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function demoCall(action: string, payload: Record<string, unknown>) {
  const spanish = payload.locale === "es";
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(action === "grade_open" ? 450 : 90);
  if (action === "list_students") return { ok: true, students: demoStudents };
  if (action === "bootstrap") {
    const student = demoStudents.find((item) => item.id === payload.studentId) ?? demoStudents[0];
    return { ok: true, student: { ...student, energy: 120, streak: 3 }, progress: [] };
  }
  if (action === "teacher_login") {
    if (!String(payload.password || "").trim()) throw new Error(spanish ? "Escribe la contraseña." : "Escriu la contrasenya.");
    sessionStorage.setItem(teacherTokenKey, "DEMO");
    return { ok: true, teacherToken: "DEMO" };
  }
  if (action === "grade_open") {
    const answer = String(payload.answer || "").trim();
    const activity = payload.activity as Activity;
    const terms = (activity?.rubric ?? []).flatMap((criterion) => criterion.description.toLocaleLowerCase("ca").split(/\W+/)).filter((word) => word.length > 6);
    const matches = terms.filter((term) => answer.toLocaleLowerCase("ca").includes(term)).length;
    const lengthScore = Math.min(6, Math.floor(answer.length / 55));
    const score = Math.max(1, Math.min(10, lengthScore + Math.min(4, matches)));
    return {
      ok: true,
      grade: {
        status: score >= 8 ? "correct" : score >= 5 ? "partial" : "review",
        score,
        feedback: score >= 8 ? (spanish ? "Respuesta bien argumentada y conectada con el caso." : "Resposta ben argumentada i connectada amb el cas.") : (spanish ? "La idea principal es útil, pero falta citar datos o explicar mejor la relación causal." : "La idea principal és útil, però falta citar dades o explicar millor la relació causal."),
        strengths: answer.length > 90 ? [spanish ? "Respuesta desarrollada" : "Resposta desenvolupada"] : [spanish ? "Has iniciado una explicación" : "Has iniciat una explicació"],
        improvements: spanish ? ["Cita un dato concreto", "Relaciónalo con un concepto de la teoría"] : ["Cita una dada concreta", "Relaciona-la amb un concepte de la teoria"],
        teacherReview: score < 5,
      },
    };
  }
  if (action === "teacher_dashboard") return { ok: true, reviews: [], recent: [] };
  return { ok: true };
}

export async function teacherLogin(password: string, locale: "va" | "es" = "va") {
  const data = await apiCall("teacher_login", { password, locale });
  sessionStorage.setItem(teacherTokenKey, data.teacherToken);
  return data;
}

export function hasTeacherToken() {
  return isDemo() ? sessionStorage.getItem(teacherTokenKey) === "DEMO" : Boolean(sessionStorage.getItem(teacherTokenKey));
}

export function clearTeacherToken() {
  sessionStorage.removeItem(teacherTokenKey);
}

export function createStudentSession(student: Student): StudentSession {
  const session = { studentId: student.id, studentName: student.name, sessionId: crypto.randomUUID() };
  sessionStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}

export function readStudentSession(): StudentSession | null {
  try {
    return JSON.parse(sessionStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
}

export function clearStudentSession() {
  sessionStorage.removeItem(sessionKey);
}

function safeKey(value: string) {
  return String(value || "sense-id").trim().replace(/[.#$[\]/]/g, "_").slice(0, 100) || "sense-id";
}

let db: any = null;
let liveRef: any = null;
let session: StudentSession | null = null;
let heartbeat: ReturnType<typeof setInterval> | null = null;
let ownerListener: ((snap: any) => void) | null = null;

export function initFirebase() {
  if (db) return db;
  if (!window.firebase || !window.firebaseConfig || isDemo()) return null;
  if (!window.firebase.apps.length) window.firebase.initializeApp(window.firebaseConfig);
  db = window.firebase.database();
  return db;
}

function livePath(studentId: string) {
  const config = getConfig();
  return [safeKey(config.firebaseRoot || "GamificacioPDC"), "live", safeKey(config.groupId || "PDC3"), safeKey(studentId)].join("/");
}

export async function startLive(nextSession: StudentSession, onReplaced: () => void) {
  stopLive();
  session = nextSession;
  const database = initFirebase();
  if (!database) return;
  liveRef = database.ref(livePath(nextSession.studentId));
  await liveRef.transaction((value: any) => ({
    ...(value || {}),
    studentId: nextSession.studentId,
    studentName: nextSession.studentName,
    sessionId: nextSession.sessionId,
    connectedAt: window.firebase.database.ServerValue.TIMESTAMP,
    updatedAt: window.firebase.database.ServerValue.TIMESTAMP,
  }));
  ownerListener = (snapshot: any) => {
    const owner = String(snapshot.val() || "");
    if (owner && owner !== session?.sessionId) onReplaced();
  };
  liveRef.child("sessionId").on("value", ownerListener);
  heartbeat = setInterval(() => publishLive({ heartbeat: true }), getConfig().liveHeartbeatMs || 20000);
}

export async function publishActivity(activity: Activity, unit: Unit, answer: unknown = "") {
  if (!liveRef || !session) return;
  const serialised = typeof answer === "string" ? answer : JSON.stringify(answer);
  await liveRef.transaction((value: any) => {
    if (value?.sessionId && value.sessionId !== session?.sessionId) return;
    return {
      ...(value || {}),
      groupId: getConfig().groupId || "PDC3",
      studentId: session!.studentId,
      studentName: session!.studentName,
      sessionId: session!.sessionId,
      unitId: unit.id,
      unitTitle: unit.title,
      activityId: activity.id,
      activityTitle: activity.title,
      kind: activity.kind,
      question: activity.prompt,
      context: activity.context || "",
      answer: serialised.slice(0, 12000),
      state: "WORKING",
      attempts: Number(value?.attempts || 0),
      helpCount: Number(value?.helpCount || 0),
      updatedAt: window.firebase.database.ServerValue.TIMESTAMP,
    };
  });
}

export async function publishLive(changes: Record<string, unknown>) {
  if (!liveRef || !session) return;
  const payload: Record<string, unknown> = { updatedAt: window.firebase.database.ServerValue.TIMESTAMP };
  Object.entries(changes).forEach(([key, value]) => {
    payload[key] = typeof value === "string" ? value.slice(0, 12000) : value;
  });
  await liveRef.update(payload);
}

export function subscribeLive(callback: (items: any[]) => void) {
  const database = initFirebase();
  if (!database) {
    callback([]);
    return () => {};
  }
  const path = [safeKey(getConfig().firebaseRoot || "GamificacioPDC"), "live", safeKey(getConfig().groupId || "PDC3")].join("/");
  const ref = database.ref(path);
  const listener = (snapshot: any) => {
    const value = snapshot.val() || {};
    callback(Object.values(value));
  };
  ref.on("value", listener);
  return () => ref.off("value", listener);
}

export async function sendTeacherComment(studentId: string, text: string) {
  const database = initFirebase();
  if (!database) return;
  const path = [safeKey(getConfig().firebaseRoot || "GamificacioPDC"), "comments", safeKey(getConfig().groupId || "PDC3"), safeKey(studentId)].join("/");
  await database.ref(path).set({ text: text.slice(0, 600), updatedAt: window.firebase.database.ServerValue.TIMESTAMP });
}

export function subscribeComment(studentId: string, callback: (text: string) => void) {
  const database = initFirebase();
  if (!database) return () => {};
  const path = [safeKey(getConfig().firebaseRoot || "GamificacioPDC"), "comments", safeKey(getConfig().groupId || "PDC3"), safeKey(studentId)].join("/");
  const ref = database.ref(path);
  const listener = (snapshot: any) => {
    const value = snapshot.val();
    if (value?.text) callback(value.text);
  };
  ref.on("value", listener);
  return () => ref.off("value", listener);
}

export function stopLive() {
  if (heartbeat) clearInterval(heartbeat);
  if (liveRef && ownerListener) liveRef.child("sessionId").off("value", ownerListener);
  heartbeat = null;
  ownerListener = null;
  liveRef = null;
  session = null;
}
