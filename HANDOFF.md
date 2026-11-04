# Current handoff — 04-11-2026

- Branch: `fix/openai-rtdb-context-20261104`, directly based on public Pages main `e23c7b9`. No unrelated local history imported.
- **Production failure reproduced; fix prepared, NOT DEPLOYED.** Published U03-05 synthetic ANSWER is preserved without GRADE pending authorized backend publication and same-ID recovery.
- Actual production: Apps Script v27; Pages entry `index-DUM5W3i9.js`, lazy `PdcApp-4hXCCR2w.js`. Root HTML/config/assets remain unchanged by this branch.
- Cause: v27 hashes a returned RTDB object with a different key order and rejects unchanged context before OpenAI. The guard also needs to account for empty arrays omitted by RTDB. Original question/rubric/policy match; this is not a credential or model failure.
- Backend repair preserves the original hash and semantic guards; rejects incomplete/malformed API results; diagnostics use the actual request/parser. Both Code.gs copies identical; Configuracio.gs copies are secret-free templates.
- Standalone candidate tests: 33/33 PASS locally. GitHub CI runs only these offline tests, never calls OpenAI and does not deploy.
- Complete source validation: 302 tests at the recorded full run, 301 PASS / 0 FAIL / 1 emulator SKIP; three additional standalone tests PASS. TSC and lint PASS (three prior warnings). Frontend artifacts match production; no frontend changes.
- No real academic edits, historical regrading, model changes, credential rotation or deployment. One new authorized synthetic ANSWER was created by the actual browser; it must be resumed, not replaced.
- The four direct API diagnostics from the earlier session passed; do not rerun them without a new reason. They are not evidence of a complete Apps Script/browser round trip.
- Remaining: explicit backend deployment authorization; verify recovery of the existing synthetic ID, worker/Sheets and teacher review after publication. Google execution-history UI needs identity verification; process-list API returned 403.
- Credential risk: real key in unrelated local history. Current/reachable public main scan found none; rotation/revocation remains owner-authorized and is not performed by this PR.
- Read `docs/OPENAI_BACKEND_DEPLOYMENT.md` for baseline, evidence, safe deployment, credential handling and v27 rollback. Never publish configuration templates over private live configuration.
- Private evidence remains outside Git under the PDC3 audit directory `production-openai-20261104`; no pupil information or credentials included here.

Every intervention must read and update this file and the current checkpoint of `PDC3_HANDOFF.md`, including failed or blocked checks. Preserve the earlier handoff history in the complete local source; do not claim this publication repository is the full frontend source tree.
