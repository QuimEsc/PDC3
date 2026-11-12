import { assessmentScope, calculateStudentAssessment } from "./assessment";
import type { Evidence } from "./assessment-engine";
import type { RubricData } from "./rubric-service";
import {
  APPROVED_TEACHER_RUBRIC_SCORES, RUBRIC_LEVELS, rubricEvidence, rubricScore,
  teacherRubricLevelScore, validTeacherRubricScores, type RubricLevel, type RubricLevelScores, type RubricRating,
} from "./rubrics";
import type { AssessmentPlan, UnitAccess } from "./services";

type ClosureState = { plan: Partial<AssessmentPlan>; unitAccess: UnitAccess[] };
type AssessmentInput = Parameters<typeof calculateStudentAssessment>[0];

function legacyNumericScore(rating: unknown) {
  if (!rating || typeof rating !== "object" || !("score" in rating)) return null;
  return typeof rating.score === "number" && Number.isFinite(rating.score) ? rating.score : null;
}

/** Read-only plan. The baseline is the scale currently used by the curricular projection. */
export function previewTeacherRubricScale(data: RubricData, scores: RubricLevelScores, closure: ClosureState) {
  if (!validTeacherRubricScores(scores)) throw new Error("Escala de rúbriques docents no vàlida.");
  const { plan } = assessmentScope("all", closure.plan);
  const closedTerms = new Set(plan.terms.filter(term => term.closed).map(term => term.term));
  const closedUnits = new Set(closure.unitAccess.filter(unit => unit.closed || unit.termClosed).map(unit => unit.unitId));
  plan.units.forEach(unit => { if (closedTerms.has(unit.term)) closedUnits.add(unit.unitId); });

  const before: Evidence[] = [], after: Evidence[] = [];
  const orphanApplications = Object.keys(data.ratings).filter(id => !data.assessments[id]).sort();
  const rows = Object.entries(data.assessments).sort(([a], [b]) => a.localeCompare(b)).flatMap(([assessmentKey, assessment]) => {
    const scopedUnit = plan.units.find(unit => unit.unitId === assessment.topic);
    const isProtected = assessment.status !== "ACTIVE" || (assessment.topic === "GLOBAL"
      ? closedTerms.size > 0 || closedUnits.size > 0
      : !scopedUnit || closedUnits.has(assessment.topic));
    const indicators = new Set(assessment.snapshot.indicators.map(indicator => indicator.indicatorId));
    return Object.entries(data.ratings[assessmentKey] || {}).sort(([a], [b]) => a.localeCompare(b)).map(([studentId, ratings]) => {
      const recognized: Record<string, RubricRating> = {};
      const details = Object.entries(ratings).map(([indicatorId, rating]) => {
        const levelId = rating?.levelId;
        const recognizedLevel = indicators.has(indicatorId) && RUBRIC_LEVELS.includes(levelId as RubricLevel)
          && rating.assessmentId === assessment.assessmentId && rating.studentId === studentId && rating.indicatorId === indicatorId;
        if (recognizedLevel) recognized[indicatorId] = rating;
        const originalScore = recognizedLevel ? teacherRubricLevelScore(levelId, APPROVED_TEACHER_RUBRIC_SCORES)
          : legacyNumericScore(rating);
        const proposedScore = recognizedLevel ? teacherRubricLevelScore(levelId, scores) : null;
        return { indicatorId, levelId: levelId ?? null, originalScore, proposedScore,
          difference: originalScore !== null && proposedScore !== null ? proposedScore - originalScore : null,
          state: !recognizedLevel ? "AMBIGUOUS" : levelId === "SENSE_INFORMACIO" ? "NO_INFORMATION" : "IDENTIFIED" };
      });
      const original = rubricEvidence(assessment, studentId, recognized, APPROVED_TEACHER_RUBRIC_SCORES);
      before.push(...original);
      after.push(...(isProtected ? original : rubricEvidence(assessment, studentId, recognized, scores)));
      return { assessmentId: assessment.assessmentId, studentId, protected: isProtected,
        beforeAverage: rubricScore(assessment.snapshot.indicators, recognized, APPROVED_TEACHER_RUBRIC_SCORES),
        afterAverage: rubricScore(assessment.snapshot.indicators, recognized, scores), ratings: details };
    });
  });
  return { rubrics: Object.keys(data.catalog).length, applications: Object.keys(data.assessments).length,
    legacyApplications: Object.keys(data.assessments).length,
    identifiableRatings: rows.flatMap(row => row.ratings).filter(rating => rating.state !== "AMBIGUOUS").length,
    ambiguousRatings: rows.flatMap(row => row.ratings).filter(rating => rating.state === "AMBIGUOUS").length,
    orphanApplications, rows, before, after };
}

/** Recompute only recognised evidence already present in each supplied curricular view. */
export function previewTeacherRubricCurricularImpact(plan: ReturnType<typeof previewTeacherRubricScale>, inputs: AssessmentInput[]) {
  const baseline = new Map(plan.before.map(evidence => [evidence.id, evidence]));
  const proposed = new Map(plan.after.map(evidence => [evidence.id, evidence]));
  return inputs.map(input => {
    const before = calculateStudentAssessment(input);
    const closedUnit = input.unitAccess?.some(unit => unit.unitId === input.scopeId && (unit.closed || unit.termClosed));
    if (before.closed || closedUnit) return { studentId: input.studentId, scopeId: input.scopeId, protected: true, before, after: before };
    const history = (input.evidenceHistory || []).map(evidence => {
      const original = baseline.get(evidence.id);
      return evidence.source === "RUBRIC" && original && evidence.score === original.score &&
        evidence.studentId === original.studentId && evidence.assessmentId === original.assessmentId &&
        evidence.indicatorId === original.indicatorId ? { ...evidence, score: proposed.get(evidence.id)!.score } : evidence;
    });
    return { studentId: input.studentId, scopeId: input.scopeId, protected: false, before,
      after: calculateStudentAssessment({ ...input, evidenceHistory: history }) };
  });
}
