import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("apps-script/Code.gs", "utf8");
const backend = source.slice(source.indexOf("/** Permanent Sheets catalogue"), source.indexOf("/** Explicit Sheets -> Firebase publication"));
const PDC_SHEETS = { RUBRICS: "BibliotecaRubriques", RUBRIC_ASSESSMENTS: "RubricaAplicacions", RUBRIC_RATINGS: "RubricaValoracions" };
const sheets = Object.fromEntries(Object.values(PDC_SHEETS).map((name) => [name, []]));
let firebase = {};
const clone = (value) => value == null ? value : structuredClone(value);
const read = (path) => path.split("/").reduce((value, segment) => value?.[segment], firebase);
const write = (path, value) => {
  const parts = path.split("/"), leaf = parts.pop(); let cursor = firebase;
  for (const part of parts) cursor = cursor[part] ||= {};
  if (value === null) delete cursor[leaf]; else cursor[leaf] = clone(value);
};
const context = { PDC_SHEETS, PDC_COLUMNS: { RubricaAplicacions: ["NomAplicacio"] }, PDC_OBJECTS_CACHE: {}, JSON, Object, Number, console,
  pdcConfigValue_: () => "TEST", pdcFirebaseRootPath_: (section, group) => `ROOT/${section}/${group}`,
  pdcFirebaseKey_: value => String(value), pdcText_: value => String(value ?? "").trim(),
  pdcFirebaseAdminGet_: path => clone(read(path)), pdcFirebaseAdminSet_: write,
  pdcFirebaseAdminDelete_: path => write(path, null), pdcObjects_: name => sheets[name].map((row, i) => ({ ...row, _row: i + 2 })),
  pdcSheet_: name => ({ getName: () => name, deleteRow: row => sheets[name].splice(row - 2, 1) }),
  pdcHeaders_: () => ["NomAplicacio"], pdcBook_: () => null, pdcEnsureSheet_: () => {},
  pdcWriteRow_: (sheet, row, fields) => { const name = sheet.getName(); sheets[name][row - 2] = { ...sheets[name][row - 2], ...fields }; },
  pdcAppend_: (name, fields) => { sheets[name].push(clone(fields)); },
};
vm.createContext(context); vm.runInContext(backend, context);
const template = { rubricId: "rubric", version: 1, name: "Prova", topic: "GLOBAL", evidenceType: "ORAL_PRESENTATION",
  indicators: [{ indicatorId: "i1", name: "Plantejament", criteria: ["MAT-1.1", "MAT-1.2"], descriptors: {
    MOLT_CONSOLIDAT: "Molt", CONSOLIDAT: "Bé", EN_PROCES: "Procés", INICIAL: "Inicial", SENSE_INFORMACIO: "Sense dades",
  } }], createdAt: "2026-10-07", updatedAt: "2026-10-07", status: "ACTIVE" };
const assessment = { assessmentId: "assessment", rubricId: "rubric", rubricVersion: 1, groupId: "TEST", topic: "GLOBAL",
  date: "2026-10-07", evidenceType: "ORAL_PRESENTATION", status: "ACTIVE", snapshot: template, createdAt: "2026-10-07", updatedAt: "2026-10-07" };
test("worker projecta biblioteca, aplicació i últim nivell a Sheets amb upsert idempotent", () => {
  write("ROOT/rubrics/TEST/catalog/rubric/versions/1", template);
  write("ROOT/rubrics/TEST/assessments/assessment", assessment);
  write("ROOT/rubrics/TEST/pending/catalog-rubric-1", { kind: "CATALOG", rubricId: "rubric", version: 1, createdAt: 1 });
  write("ROOT/rubrics/TEST/pending/assessment-assessment", { kind: "ASSESSMENT", assessmentId: "assessment", createdAt: 2 });
  write("ROOT/rubrics/TEST/ratings/assessment/TEST/i1", { assessmentId: "assessment", studentId: "TEST", indicatorId: "i1", levelId: "CONSOLIDAT", revision: 10, updatedAt: "2026-10-07", status: "SYNC_PENDING" });
  context.pdcProjectRubrics_();
  assert.equal(sheets.BibliotecaRubriques.length, 2);
  assert.equal(sheets.RubricaAplicacions.length, 1);
  assert.equal(sheets.RubricaValoracions.length, 1);
  assert.equal(read("ROOT/rubrics/TEST/pending/catalog-rubric-1"), undefined);
  assert.equal(read("ROOT/rubrics/TEST/ratings/assessment/TEST/i1/status"), "SYNCED");
  context.pdcProjectRubrics_();
  assert.equal(sheets.BibliotecaRubriques.length, 2); assert.equal(sheets.RubricaValoracions.length, 1);
  write("ROOT/rubrics/TEST/ratings/assessment/TEST/i1", { assessmentId: "assessment", studentId: "TEST", indicatorId: "i1", levelId: "EN_PROCES", revision: 11, updatedAt: "2026-10-08", status: "SYNC_PENDING" });
  context.pdcProjectRubrics_();
  assert.equal(sheets.RubricaValoracions[0].Nivell, "EN_PROCES");
  assert.equal(sheets.RubricaValoracions.length, 1);
  write("ROOT/rubrics/TEST/ratings/assessment/TEST/i1", { assessmentId: "assessment", studentId: "TEST", indicatorId: "i1", levelId: "CONSOLIDAT", revision: 9, updatedAt: "2026-10-06", status: "SYNC_PENDING" });
  context.pdcProjectRubrics_();
  assert.equal(sheets.RubricaValoracions[0].Nivell, "EN_PROCES");
});
test("Sheets és la biblioteca mestra i el reinici del curs no elimina el catàleg", () => {
  write("ROOT/rubrics/TEST/catalog", null);
  assert.equal(context.pdcTeacherSyncRubrics_().count, 1);
  assert.equal(read("ROOT/rubrics/TEST/catalog/rubric/currentVersion"), 1);
  const reset = source.slice(source.indexOf("function pdcClearFirebaseCourse_"), source.indexOf("function pdcFirebaseRootPath_"));
  assert.match(reset, /\["assessments", "ratings", "pending"\]/);
  assert.doesNotMatch(reset, /\["catalog"\]/);
  const list = source.slice(source.indexOf("var sheetsToClear = ["), source.indexOf("var cleared = {}"));
  assert.match(list, /RUBRIC_ASSESSMENTS/); assert.match(list, /RUBRIC_RATINGS/);
  assert.doesNotMatch(list, /PDC_SHEETS\.RUBRICS/);
});
test("Rules només permeten al docent escriure rúbriques", () => {
  const rules = JSON.parse(fs.readFileSync("public/firebase-rules.json", "utf8"));
  const grant = rules.rules.GamificacioPDC.rubrics.$group;
  for (const key of ["catalog", "assessments", "ratings", "pending", "deletedAssessments"]) {
    assert.match(grant[key][".write"], /role === 'teacher'/);
    assert.doesNotMatch(grant[key][".write"], /role === 'student'/);
  }
  assert.equal(grant.levelScale[".write"], false);
});
test("worker elimina per assessmentId, recalcula evidència i conserva rúbrica i altra aplicació", () => {
  const other = { ...assessment, assessmentId: "other" };
  write("ROOT/rubrics/TEST/assessments/other", other);
  write("ROOT/rubrics/TEST/ratings/other/TEST/i1", { assessmentId: "other", studentId: "TEST", indicatorId: "i1", levelId: "INICIAL", revision: 1, updatedAt: "2026-10-08", status: "SYNC_PENDING" });
  context.pdcProjectRubrics_();
  write("ROOT/rubrics/TEST/deletedAssessments/assessment", { deletedAt: 1 });
  write("ROOT/rubrics/TEST/assessments/assessment", null);
  write("ROOT/rubrics/TEST/ratings/assessment", null);
  write("ROOT/rubrics/TEST/pending/delete-assessment-assessment", { kind: "DELETE_ASSESSMENT", assessmentId: "assessment", createdAt: 10 });
  context.pdcProjectRubrics_();
  assert.equal(sheets.RubricaAplicacions.some(row => row.AplicacioId === "assessment"), false);
  assert.equal(sheets.RubricaValoracions.some(row => row.AplicacioId === "assessment"), false);
  assert.equal(read("ROOT/rubrics/TEST/catalog/rubric/versions/1").name, "Prova");
  assert.equal(read("ROOT/rubrics/TEST/assessments/other").assessmentId, "other");
  assert.equal(read("ROOT/rubrics/TEST/pending/delete-assessment-assessment"), undefined);
  context.pdcProjectRubrics_();
  assert.equal(sheets.RubricaValoracions.some(row => row.AplicacioId === "assessment"), false);
});
