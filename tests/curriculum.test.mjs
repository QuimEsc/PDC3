import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

test("el banc declara 18 unitats consecutives", () => {
  const source = fs.readFileSync(new URL("../lib/curriculum.ts", import.meta.url), "utf8");
  const ids = [...source.matchAll(/id: "u(\d\d)", order:/g)].map((match) => match[1]);
  assert.equal(ids.length, 18);
  assert.deepEqual(ids, Array.from({ length: 18 }, (_, index) => String(index + 1).padStart(2, "0")));
  assert.match(source, /base \+ "09"/);
});

test("cada unitat té teoria i els formats oberts acordats", () => {
  const source = fs.readFileSync(new URL("../lib/curriculum.ts", import.meta.url), "utf8");
  const content = fs.readFileSync(new URL("../lib/curriculum-content.ts", import.meta.url), "utf8");
  assert.equal((source.match(/theory: \[/g) || []).length, 18);
  assert.equal((source.match(/^    numeric: \{/gm) || []).length, 18);
  assert.equal((source.match(/^    interpretation: \{/gm) || []).length, 18);
  assert.equal((source.match(/^    decision: \{/gm) || []).length, 18);
  assert.equal((source.match(/^    mission: \{/gm) || []).length, 18);
  assert.equal((content.match(/^  u\d\d: \{/gm) || []).length, 18);
  assert.equal((content.match(/scientificText: \{/g) || []).length, 18);
  assert.equal((content.match(/modelComment: "/g) || []).length, 18);
});

test("la versió castellana manté la mateixa estructura curricular", () => {
  const valencian = fs.readFileSync(new URL("../lib/curriculum.ts", import.meta.url), "utf8");
  const spanish = fs.readFileSync(new URL("../lib/curriculum-es.ts", import.meta.url), "utf8");
  const spanishContent = fs.readFileSync(new URL("../lib/curriculum-content-es.ts", import.meta.url), "utf8");
  const unitPattern = /id: "u(\d\d)", order:/g;
  assert.deepEqual(
    [...spanish.matchAll(unitPattern)].map((match) => match[1]),
    [...valencian.matchAll(unitPattern)].map((match) => match[1]),
  );
  assert.equal((spanish.match(/^    numeric: \{/gm) || []).length, 18);
  assert.equal((spanishContent.match(/^  u\d\d: \{/gm) || []).length, 18);
  assert.match(spanish, /title: "Investigar el mundo"/);
  assert.match(spanishContent, /title: "Cuando una coincidencia no demuestra una causa"/);
});

test("la interfície ofereix VAL i ES amb valencià inicial", () => {
  const app = fs.readFileSync(new URL("../app/PdcApp.tsx", import.meta.url), "utf8");
  assert.match(app, /useState<Locale>\("va"\)/);
  assert.match(app, />VAL<\/button>/);
  assert.match(app, />ES<\/button>/);
  assert.match(app, /document\.documentElement\.lang/);
});

test("Sheets, Firebase i la clau d'IA queden separats", () => {
  const services = fs.readFileSync(new URL("../lib/services.ts", import.meta.url), "utf8");
  const backend = fs.readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8");
  assert.match(services, /appsScriptUrl/);
  assert.match(services, /firebase\.database/);
  assert.match(backend, /getProperty\("OPENAI_API_KEY"\)/);
  assert.doesNotMatch(services, /OPENAI_API_KEY/);
});
