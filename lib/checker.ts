import type { Activity } from "./curriculum";

export type LocalGrade = {
  status: "correct" | "partial" | "incorrect" | "ai";
  score: number;
  feedback: string;
};

function normalise(value: unknown) {
  return String(value ?? "").trim().toLocaleLowerCase("ca").replace(/\s+/g, " ");
}

export function gradeLocally(activity: Activity, answer: unknown, locale: "va" | "es" = "va"): LocalGrade {
  const tr = (valencian: string, spanish: string) => locale === "va" ? valencian : spanish;
  if (["open", "decision", "mission", "text"].includes(activity.kind)) {
    return { status: "ai", score: 0, feedback: tr("Aquesta resposta s'avalua amb la guia de criteris.", "Esta respuesta se evalúa con la guía de criterios.") };
  }

  if (activity.kind === "numeric") {
    const raw = String(answer ?? "").replace(",", ".").replace(/[^\d.+-]/g, "");
    const value = Number(raw);
    const expected = Number(activity.answer);
    if (!Number.isFinite(value)) return { status: "incorrect", score: 0, feedback: tr("Escriu un nombre i revisa la unitat.", "Escribe un número y revisa la unidad.") };
    const correct = Math.abs(value - expected) <= (activity.tolerance ?? 0.001);
    return correct
      ? { status: "correct", score: 10, feedback: tr("Resultat correcte. Comprova que el procediment i la unitat també apareixen.", "Resultado correcto. Comprueba que el procedimiento y la unidad también aparecen.") }
      : { status: "incorrect", score: 0, feedback: tr("El resultat no coincideix. Revisa substitució, operacions i unitats.", "El resultado no coincide. Revisa la sustitución, las operaciones y las unidades.") };
  }

  if (activity.kind === "choice") {
    const correct = normalise(answer) === normalise(activity.answer);
    return correct
      ? { status: "correct", score: 10, feedback: activity.explanation }
      : { status: "incorrect", score: 0, feedback: `${tr("Encara no.", "Todavía no.")} ${activity.hint}` };
  }

  if (activity.kind === "order") {
    const received = Array.isArray(answer) ? answer : String(answer ?? "").split("|");
    const expected = activity.items ?? [];
    const exact = received.length === expected.length && received.every((item, i) => item === expected[i]);
    if (exact) return { status: "correct", score: 10, feedback: tr("Seqüència completa i ben ordenada.", "Secuencia completa y bien ordenada.") };
    const positions = received.filter((item, i) => item === expected[i]).length;
    return { status: positions >= Math.ceil(expected.length / 2) ? "partial" : "incorrect", score: Math.round((positions / expected.length) * 10), feedback: tr("Alguns passos no estan en la posició correcta. Busca dependències entre passos.", "Algunos pasos no están en la posición correcta. Busca dependencias entre pasos.") };
  }

  if (activity.kind === "match") {
    const received = typeof answer === "object" && answer ? answer as Record<string, string> : {};
    const expected = activity.mapping ?? {};
    const entries = Object.entries(expected);
    const hits = entries.filter(([key, value]) => received[key] === value).length;
    if (hits === entries.length) return { status: "correct", score: 10, feedback: tr("Totes les associacions són correctes.", "Todas las asociaciones son correctas.") };
    return { status: hits >= Math.ceil(entries.length / 2) ? "partial" : "incorrect", score: Math.round((hits / entries.length) * 10), feedback: `${hits} ${tr("de", "de")} ${entries.length} ${tr("associacions correctes. Revisa les definicions.", "asociaciones correctas. Revisa las definiciones.")}` };
  }

  return { status: "incorrect", score: 0, feedback: tr("No s'ha pogut corregir aquesta resposta.", "No se ha podido corregir esta respuesta.") };
}
