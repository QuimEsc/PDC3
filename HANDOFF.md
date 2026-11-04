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
