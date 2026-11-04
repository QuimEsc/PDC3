# DESPLEGAMENT AUTORITZAT — v28 VERIFICADA EN PRODUCCIÓ — 04-11-2026

**Reparació del bloqueig de context desplegada i validada en el flux sintètic provat.** Esta secció substituïx l’estat pendent de desplegament dels checkpoints inferiors.

- **Autorització:** l’usuari ha aprovat publicar només backend de PR #1 quan CI fora verd i reprendre el mateix ANSWER sintètic. CI `41862976399` SUCCESS en HEAD públic `2b611f5`, hash i còpies Code.gs verificats, dos worktrees nets abans de publicar.
- **Publicació:** Apps Script **v28**, 04-11-2026 17:27 Europe/Madrid (16:27 UTC), mateix projecte, deployment, endpoint i accessos. Només Code canviat; Configuracio i appsscript preservats exactament. Candidat SHA-256 LF `26b015d7679d5eae138948c8d59ecec45ae142fc960beb302fb981756322446f`. Contingut de la versió publicada llegit de nou i comparat. Health HTTP 200 / ok=true. Rollback **v27** conservat, no executat.
- **Pages/Rules/settings/model:** Pages continua `e23c7b9`, sense publicació ni merge a main; Rules i configuració d’avaluació/pedagògica intactes. Luna / medium / 1600 intactes. Cap rotació de credencial.
- **Smoke REAL del navegador:** Profe / u03-05, represa de l’ANSWER existent amb el mateix submissionId, resposta i data originals. Retorn normal d’Apps Script/OpenAI al navegador: **10/10**, feedback de quatre criteris i «Següent activitat». Un únic intent i un únic GRADE; cap nou ANSWER o identificador en esta sessió.
- **OpenAI real des del backend:** backendGrade confirma `gpt-6-luna`, `medium`, status OK, 5.099 ms; telemetria **1.418 tokens d’entrada / 283 d’eixida**. No s’han repetit els diagnòstics Node ni fet benchmarks. No confondre amb les quatre crides diagnòstiques anteriors: ara sí que s’ha acreditat el recorregut publicat del navegador.
- **Reload REAL PASS:** després de reload i reobrir u03-05 es conserva el text exacte, 10/10, feedback i «Següent activitat». Original ANSWER estrictament idèntic al de la sessió anterior; dos events totals del mateix submissionId (ANSWER + GRADE), un sol intent.
- **Sheets i docent PASS:** lectura del backend sobre Progres confirma nota 10, intent 1, mateix submissionId, resposta exacta i feedback idèntic a GRADE. Respostes/answerHistory conté una única fila del mateix ID, nota 10. El panell docent, resum d’unitat → Profe/Interpreta les dades, mostra resposta completa, primer/final/millor/últim 10/10 i un intent. No s’ha modificat el llibre des del navegador ni exportat cap còpia nova.
- **Worker PASS:** GRADE acaba **SYNCED**. Lectura autenticada d’execucions post-deploy mostra pdcForceAcademicSync completat cada minut en la mostra 17:33–17:36. Activadors: **1**, basat en temps, funció pdcForceAcademicSync, sense crear-ne ni editar-ne cap. El percentatge històric d’errors mostrat (0,19 %) no s’ha esborrat ni presentat com a error nou.
- **Cues finals:** academic/pendingEvents **0**, teacher commands pendents **0**, Arena pendingFinalizations **0**. Cap neteja manual.
- **Integritat final PASS:** **578/578 events preexistents idèntics**, 0 modificats/perduts; events reals i tots els backendGrades anteriors preservats. Actualitzacions docents reals, commands, assessmentConfig i settings idèntics. Única incorporació: GRADE de l’ANSWER sintètic ja existent i la seua projecció/recompenses ordinàries de Profe. Cap qualificació real canviada.
- **Casos pendents fora del smoke:** els **26 històrics + 19 nous** existents abans de la investigació continuen sense requalificació automàtica. No s’ha executat cap lot ni cap canvi de política. Recuperació d’estos casos requerix decisió separada de l’usuari.
- **Revisions docents:** la vista funciona en lectura; no hi ha revisió pedagògica sintètica pendent perquè el resultat és correcte i sense bandera de revisió. **No s’ha executat una escriptura de revisió docent ni s’ha fabricat un cas per provar-la.** No declarar eixa mutació com a PASS real.
- **Gate:** source i artefacte exactament iguals al candidat validat: 305 totals / 304 PASS / 0 FAIL / 1 SKIP (emulador Arena), TSC/lint/builds PASS, CI públic 33/33 PASS. No gate redundant ni source canviat després del deploy.
- **Credencial:** no exposada en 293 blobs assolibles del main públic; risc de l’historial local separat documentat. Rotació/revocació continua pendent d’autorització; no és part d’este desplegament.
- **Continuïtat:** no repetir deploy ni smoke. PR https://github.com/QuimEsc/PDC3/pull/1 continua sense merge. Conservar els checkpoints antics com a històric; no pujar l’ancestria del source local.

Evidències privades: `production-openai-20261104/backend-deployment-result.json`, `deployment-v27-rollback-metadata.json`, `health-v28.json`, `browser-to-backend-grade-proof.json`, `sheets-through-backend-proof.json`, `synthetic-teacher-detail-v28.json`, `integrity-after-v28-smoke.json`, `worker-v28-executions.txt`, `browser-v28-grade-pass.png`. Sense credencials en informes; registre acadèmic només en el directori privat autoritzat.

---
# Current handoff — 04-11-2026

- Branch: `fix/openai-rtdb-context-20261104`, directly based on public Pages main `e23c7b9`. No unrelated local history imported.
- **Production failure reproduced; fix prepared, NOT DEPLOYED.** Published U03-05 synthetic ANSWER is preserved without GRADE pending authorized backend publication and same-ID recovery.
- Actual production: Apps Script v27; Pages entry `index-DUM5W3i9.js`, lazy `PdcApp-4hXCCR2w.js`. Root HTML/config/assets remain unchanged by this branch.
- Cause: v27 hashes a returned RTDB object with a different key order and rejects unchanged context before OpenAI. The guard also needs to account for empty arrays omitted by RTDB. Original question/rubric/policy match; this is not a credential or model failure.
- Backend repair preserves the original hash and semantic guards; rejects incomplete/malformed API results; diagnostics use the actual request/parser. Both Code.gs copies identical; Configuracio.gs copies are secret-free templates.
- Standalone candidate tests: 33/33 PASS locally and in GitHub Actions run `41861734915` (success) on code commit `9ee1615`. CI never calls OpenAI or deploys.
- Complete source final gate: **305 total, 304 PASS / 0 FAIL / 1 emulator SKIP**. TSC, lint (three prior warnings), normal build and GitHub build PASS. Frontend artifacts match production; no frontend changes.
- Baseline contained 45 ANSWER without grade: 26 already present on 03-11 plus 19 new ones with the same object-order mismatch. They were inspected read-only; none was regraded. The browser smoke added one authorized synthetic ANSWER, still pending, not another real-student response.
- After investigation: **577/577 original events unchanged**, real-student events identical, backendGrades/teacherState/assessmentConfig identical; queues 0/0/0. No new GRADE. Fresh Sheets projection verification remains pending because grading stops before creating a projection event.
- No real academic edits, historical regrading, model changes, credential rotation or deployment. One new authorized synthetic ANSWER was created by the actual browser; it must be resumed, not replaced.
- The four direct API diagnostics from the earlier session passed; do not rerun them without a new reason. They are not evidence of a complete Apps Script/browser round trip.
- Remaining: explicit backend deployment authorization; verify recovery of the existing synthetic ID, worker/Sheets and teacher review after publication. Google execution-history UI needs identity verification; process-list API returned 403.
- Credential risk: real key in unrelated local history. Current/reachable public main scan found none; rotation/revocation remains owner-authorized and is not performed by this PR.
- Read `docs/OPENAI_BACKEND_DEPLOYMENT.md` for baseline, evidence, safe deployment, credential handling and v27 rollback. Never publish configuration templates over private live configuration.
- Private evidence remains outside Git under the PDC3 audit directory `production-openai-20261104`; no pupil information or credentials included here.
- PR: https://github.com/QuimEsc/PDC3/pull/1 (draft, no merge/deployment). The precise code change against v27 is in `docs/OPENAI_BACKEND_PATCH.diff`. Whitespace in the newly imported full backend is inherited from v27, not a formatting refactor.

Every intervention must read and update this file and the current checkpoint of `PDC3_HANDOFF.md`, including failed or blocked checks. Preserve the earlier handoff history in the complete local source; do not claim this publication repository is the full frontend source tree.
