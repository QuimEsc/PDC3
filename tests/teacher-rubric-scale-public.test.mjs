import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { pendingBackend } from "./support/pending-backend.mjs";

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const scores = { MOLT_CONSOLIDAT: 10, CONSOLIDAT: 7, EN_PROCES: 4, INICIAL: 1 };

test("teacher route validates permissions, bounds, order and revision without changing academic data", () => {
  const fixture = pendingBackend();
  fixture.ctx.console.error = () => {};
  fixture.ctx.pdcJson_ = data => ({ text: JSON.stringify(data) });
  const submit = (changes = {}) => JSON.parse(fixture.ctx.doPost({ postData: { contents: JSON.stringify({
    action: "teacher_save_rubric_level_scale", groupId: "TEST", teacherToken: "teacher-test",
    scores, expectedRevision: 0, ...changes,
  }) } }).text);
  const record = "GamificacioPDC/rubrics/TEST/levelScale";
  const original = fixture.answer("original", "u03-05");
  assert.equal(submit({ teacherToken: "" }).ok, false);
  assert.equal(submit({ groupId: "OTHER" }).ok, false);
  assert.equal(submit({ scores: { ...scores, INICIAL: 4 } }).ok, false);
  assert.equal(submit({ scores: { ...scores, INICIAL: -1 } }).ok, false);
  assert.equal(fixture.read(record), null);
  const first = submit();
  assert.deepEqual(first.scale, { revision: 1, scores });
  assert.deepEqual(submit(), first);
  const updated = { ...scores, CONSOLIDAT: 7.25 };
  assert.equal(submit({ scores: updated }).ok, false);
  assert.deepEqual(submit({ scores: updated, expectedRevision: 1 }).scale, { revision: 2, scores: updated });
  assert.deepEqual(fixture.read(record + "/history/v1").scores, scores);
  assert.deepEqual(fixture.read(fixture.root + "/events/SYNTHETIC/original-answer"), structuredClone(original));
  assert.equal(fixture.calls(), 0);
});

test("three Rules copies protect the scale and the two Apps Script copies match", () => {
  const rules = read("public/firebase-rules.json");
  for (const path of ["firebase-rules.json", "PUJAR_A_GITHUB/firebase-rules.json"]) assert.equal(read(path), rules);
  const group = JSON.parse(rules).rules.GamificacioPDC.rubrics.$group;
  assert.equal(group.levelScale[".write"], false);
  assert.equal(group[".write"], undefined);
  assert.match(group[".read"], /auth\.token\.groupId === \$group.*role === 'teacher'/);
  assert.equal(read("APPSCRIPT/Code.gs"), read("apps-script/Code.gs"));
});

test("review source and reference patch match the export manifest", () => {
  const manifest = JSON.parse(read("release/teacher-rubric-level-scale.json"));
  const hash = path => createHash("sha256").update(read(path)).digest("hex");
  for (const [path, digest] of Object.entries(manifest.files)) assert.equal(hash(path), digest, path);
  assert.equal(hash(manifest.referencePatch.path), manifest.referencePatch.sha256);
});
