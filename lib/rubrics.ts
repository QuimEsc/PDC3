import { EVIDENCE_COEFFICIENTS, type EvidenceType } from "./assessment-config";
import { evaluationCriteria } from "./curricular-alignment";
import { curriculum } from "./curriculum";
import type { Evidence } from "./assessment-engine";

export const RUBRIC_LEVELS = ["MOLT_CONSOLIDAT", "CONSOLIDAT", "EN_PROCES", "INICIAL", "SENSE_INFORMACIO"] as const;
export type RubricLevel = typeof RUBRIC_LEVELS[number];
export type RatingLevel = RubricLevel | "UNRATED";
export const SCORED_RUBRIC_LEVELS = ["MOLT_CONSOLIDAT", "CONSOLIDAT", "EN_PROCES", "INICIAL"] as const;
export type ScoredRubricLevel = typeof SCORED_RUBRIC_LEVELS[number];
export type RubricLevelScores = Readonly<Record<ScoredRubricLevel, number>>;
export type RubricLevelScale = { revision: number; scores: RubricLevelScores };

export const DEFAULT_TEACHER_RUBRIC_SCORES: RubricLevelScores = Object.freeze({
  MOLT_CONSOLIDAT: 10, CONSOLIDAT: 7, EN_PROCES: 4, INICIAL: 1,
});
// Existing curricular projections remain on their approved scale until a separate academic decision.
export const APPROVED_TEACHER_RUBRIC_SCORES: RubricLevelScores = Object.freeze({
  MOLT_CONSOLIDAT: 10, CONSOLIDAT: 7.5, EN_PROCES: 5, INICIAL: 2.5,
});

export function validTeacherRubricScores(value: unknown): value is RubricLevelScores {
  if (!value || typeof value !== "object" || Object.keys(value).length !== SCORED_RUBRIC_LEVELS.length) return false;
  const scores = value as RubricLevelScores;
  return SCORED_RUBRIC_LEVELS.every((level, i) => {
    const score = scores[level];
    return Number.isFinite(score) && score >= 0 && score <= 10
      && (i === 0 || scores[SCORED_RUBRIC_LEVELS[i - 1]] > score);
  });
}

export function effectiveTeacherRubricScale(scale?: RubricLevelScale): RubricLevelScale {
  if (scale && Number.isSafeInteger(scale.revision) && scale.revision > 0 && validTeacherRubricScores(scale.scores)) {
    return { revision: scale.revision, scores: scale.scores };
  }
  return { revision: 0, scores: DEFAULT_TEACHER_RUBRIC_SCORES };
}

export function teacherRubricLevelScore(level: unknown, scores: RubricLevelScores): number | null {
  return SCORED_RUBRIC_LEVELS.includes(level as ScoredRubricLevel) ? scores[level as ScoredRubricLevel] : null;
}
export const RUBRIC_LABELS: Record<RatingLevel, string> = {
  UNRATED: "Sense valorar", MOLT_CONSOLIDAT: "Molt consolidat", CONSOLIDAT: "Consolidat",
  EN_PROCES: "En procés", INICIAL: "Inicial", SENSE_INFORMACIO: "Sense informació suficient",
};
export const RUBRIC_TOPICS = ["GLOBAL", ...curriculum.map((unit) => unit.id)] as const;
export const RUBRIC_EVIDENCE_TYPES = Object.keys(EVIDENCE_COEFFICIENTS) as EvidenceType[];
export const RUBRIC_IMPORT_HEADERS = ["Indicador", "Criteri", "Molt consolidat", "Consolidat", "En procés", "Inicial", "Sense informació suficient"] as const;

export type RubricIndicator = { indicatorId: string; name: string; criteria: string[]; descriptors: Record<RubricLevel, string> };
export type RubricTemplate = { rubricId: string; version: number; name: string; topic: string; evidenceType: EvidenceType;
  indicators: RubricIndicator[]; createdAt: string; updatedAt: string; status: "ACTIVE" | "ARCHIVED" };
export type RubricAssessment = { assessmentId: string; rubricId: string; rubricVersion: number; groupId: string;
  topic: string; date: string; evidenceType: EvidenceType; status: "ACTIVE" | "CLOSED";
  snapshot: RubricTemplate; applicationName?: string; rubricNameSnapshot?: string; context?: string;
  createdAt: string; updatedAt: string };
export type RubricRating = { assessmentId: string; studentId: string; indicatorId: string; levelId: RubricLevel;
  revision: number; updatedAt: string; status?: "SYNC_PENDING" | "SYNCED" | "SYNC_ERROR" };
export type RubricImportRow = { indicator: string; criterion: string; descriptors: Record<RubricLevel, string> };

export function rubricTopicLabel(topic: string) {
  if (topic === "GLOBAL") return "Global";
  const unit = curriculum.find((item) => item.id === topic);
  return unit ? `Tema ${unit.order}` : topic;
}

export function validateRubric(name: string, topic: string, evidenceType: string, rows: RubricImportRow[]) {
  const errors: string[] = [];
  if (!name.trim()) errors.push("El nom de la rúbrica és obligatori.");
  if (!(RUBRIC_TOPICS as readonly string[]).includes(topic)) errors.push("Tema desconegut.");
  if (!RUBRIC_EVIDENCE_TYPES.includes(evidenceType as EvidenceType)) errors.push("Tipus d’evidència desconegut.");
  if (!rows.length) errors.push("Cal almenys un indicador.");
  const indicators = new Map<string, RubricIndicator>();
  rows.forEach((row, index) => {
    const number = index + 1;
    const indicatorName = String(row.indicator || "").trim();
    const criterionId = String(row.criterion || "").trim();
    if (!indicatorName) errors.push(`Fila ${number}: indicador buit.`);
    if (!evaluationCriteria[criterionId]) errors.push(`Fila ${number}: criteri desconegut (${criterionId || "buit"}).`);
    const descriptors = Object.fromEntries(RUBRIC_LEVELS.map((level) => [level, String(row.descriptors?.[level] || "").trim()])) as Record<RubricLevel, string>;
    RUBRIC_LEVELS.forEach((level) => { if (!descriptors[level]) errors.push(`Fila ${number}: descriptor ${RUBRIC_LABELS[level]} buit.`); });
    if (!indicatorName || !criterionId) return;
    const previous = indicators.get(indicatorName);
    if (previous) {
      if (JSON.stringify(previous.descriptors) !== JSON.stringify(descriptors)) errors.push(`Fila ${number}: l’indicador ${indicatorName} té descriptors diferents entre files.`);
      if (previous.criteria.includes(criterionId)) errors.push(`Fila ${number}: indicador i criteri duplicats.`);
      else previous.criteria.push(criterionId);
    } else indicators.set(indicatorName, { indicatorId: `i${indicators.size + 1}`, name: indicatorName, criteria: [criterionId], descriptors });
  });
  return { errors, indicators: [...indicators.values()] };
}

export function rubricRows(template: RubricTemplate): RubricImportRow[] {
  return template.indicators.flatMap((indicator) => indicator.criteria.map((criterion) => ({ indicator: indicator.name, criterion, descriptors: indicator.descriptors })));
}
export function createRubric(input: Pick<RubricTemplate, "name" | "topic" | "evidenceType"> & { rows: RubricImportRow[] },
  previous?: RubricTemplate, now = new Date().toISOString(), id = crypto.randomUUID()): RubricTemplate {
  const checked = validateRubric(input.name, input.topic, input.evidenceType, input.rows);
  if (checked.errors.length) throw new Error(checked.errors.join("\n"));
  const previousByName = new Map(previous?.indicators.map((item) => [item.name, item]) || []);
  return { rubricId: previous?.rubricId || id, version: previous ? previous.version + 1 : 1,
    name: input.name.trim(), topic: input.topic, evidenceType: input.evidenceType, indicators: checked.indicators.map((item) => ({
      ...item, indicatorId: previousByName.get(item.name)?.indicatorId || `${id.slice(0, 8)}-${item.indicatorId}`,
    })), createdAt: previous?.createdAt || now, updatedAt: now, status: "ACTIVE" };
}
export function createRubricAssessment(template: RubricTemplate, groupId: string, id = crypto.randomUUID(), now = new Date().toISOString(),
  metadata?: { applicationName: string; date: string; context?: string }): RubricAssessment {
  return { assessmentId: id, rubricId: template.rubricId, rubricVersion: template.version, groupId, topic: template.topic,
    date: metadata?.date || now, evidenceType: template.evidenceType, status: "ACTIVE", snapshot: structuredClone(template),
    applicationName: metadata?.applicationName?.trim() || template.name, rubricNameSnapshot: template.name,
    context: metadata?.context?.trim() || "", createdAt: now, updatedAt: now };
}
export function nextRubricLevel(current: RatingLevel): RubricLevel {
  const index = RUBRIC_LEVELS.indexOf(current as RubricLevel);
  return RUBRIC_LEVELS[(index + 1) % RUBRIC_LEVELS.length];
}
export function rubricScore(indicators: RubricIndicator[], ratings: Record<string, Pick<RubricRating, "levelId"> | undefined>,
  scale: RubricLevelScores = DEFAULT_TEACHER_RUBRIC_SCORES): number | null {
  const scores = indicators.map((item) => teacherRubricLevelScore(ratings[item.indicatorId]?.levelId, scale))
    .filter((value): value is number => value !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}
export function rubricEvidence(assessment: RubricAssessment, studentId: string,
  ratings: Record<string, RubricRating | undefined>, scale: RubricLevelScores = DEFAULT_TEACHER_RUBRIC_SCORES): Evidence[] {
  return assessment.snapshot.indicators.flatMap((indicator) => {
    const score = teacherRubricLevelScore(ratings[indicator.indicatorId]?.levelId, scale);
    if (score === null) return [];
    return indicator.criteria.map((criterion) => ({
      id: `rubric:${assessment.assessmentId}:${studentId}:${indicator.indicatorId}:${criterion}`,
      source: "RUBRIC" as const, studentId, evidenceType: assessment.evidenceType,
      unitId: assessment.topic === "GLOBAL" ? undefined : assessment.topic,
      family: `rubric:${assessment.rubricId}`, criteria: [{ id: criterion, weight: 1 }], score, date: assessment.date,
      assessmentId: assessment.assessmentId, rubricId: assessment.rubricId, indicatorId: indicator.indicatorId,
    }));
  });
}

export function parseRubricCsv(text: string) {
  const lines: string[][] = []; let row: string[] = [], cell = "", quote = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') { if (quote && text[i + 1] === '"') { cell += '"'; i++; } else quote = !quote; }
    else if (char === "," && !quote) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quote) { if (char === "\r" && text[i + 1] === "\n") i++; row.push(cell); lines.push(row); row = []; cell = ""; }
    else cell += char;
  }
  row.push(cell); if (row.some(Boolean)) lines.push(row);
  const metadata = { name: lines[0]?.[1] || "", topic: lines[1]?.[1] || "", evidenceType: lines[2]?.[1] || "" };
  const start = lines.findIndex((line) => line[0]?.replace(/^\uFEFF/, "") === RUBRIC_IMPORT_HEADERS[0]);
  const rows = (start < 0 ? [] : lines.slice(start + 1)).filter((line) => line.some((value) => value.trim())).map((line) => ({
    indicator: line[0] || "", criterion: line[1] || "",
    descriptors: Object.fromEntries(RUBRIC_LEVELS.map((level, index) => [level, line[index + 2] || ""])) as Record<RubricLevel, string>,
  }));
  return { ...metadata, rows };
}
