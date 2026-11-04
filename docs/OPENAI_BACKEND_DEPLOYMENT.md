# Backend candidate — 04-11-2026

## Authorized deployment completed

**Apps Script v28 deployed and verified on 04-11-2026 at 16:27 UTC / 17:27 Europe/Madrid.** The user explicitly authorized backend-only publication after final CI success. The published Code hash matches the manifest. The project, deployment, endpoint, access, private Configuracio and appsscript manifest are unchanged. Pages remains e23c7b9; no merge or frontend/Rules deployment was performed. Rollback v27 is retained and was not needed.

The exact previously stored synthetic ANSWER was resumed from the real production browser: one GRADE, one attempt, 10/10, feedback and next-activity navigation. The original ANSWER is byte-equivalent as structured data, with its original identity and date. Reload/re-entry recovered the same answer, score and feedback. Backend telemetry records Luna medium, 5,099 ms, 1,418 input / 283 output tokens. No diagnostic API calls were repeated.

The worker projected the grade to Sheets: Progres and one Respostes history row match the original submission, answer, feedback, score and attempt. The teacher UI displays the same values. GRADE is SYNCED; queues are 0/0/0. One existing time-based pdcForceAcademicSync trigger was observed, with recent completed post-deployment executions. No trigger was changed.

Final integrity: 578/578 pre-existing events unchanged; all prior backendGrades, real-student events/teacher updates, commands and evaluation/pedagogical settings preserved. Only the expected synthetic GRADE and its normal projection/rewards were added. The 26 historical plus 19 newer previously pending ANSWER were not regraded.

There was no eligible synthetic pedagogical review: the result is correct without a review flag. Review-screen reading was verified, but no teacher-review write was executed or fabricated. Credential rotation remains separately authorized. The sections below retain the original baseline and rollout procedure for traceability; they do not indicate a pending deployment.

## Production baseline

- Pages publishes the root of `main`, commit `e23c7b9a11e6ea5b2b96b09565b2f8957dafa311`; its latest Pages run succeeded.
- Actual entry bundle: `index-DUM5W3i9.js`; application bundle: `PdcApp-4hXCCR2w.js`. `index-Cvp8n_Qh.js` is not the live entry point.
- Apps Script deployment remains v27. Its Code matches the validated local baseline after normalizing line endings.
- The repository contains published assets and partial older source files, not the complete buildable application source. This PR preserves every existing publication asset, root config and HTML byte for byte.

## Reproduced production failure

The real published student interface accepted an authorized synthetic U03-05 response into RTDB as an immutable ANSWER, then failed to return a grade. A single follow-up request with the same submission identity returned HTTP 200 with `ok=false` and the original-context validation error. It did not invoke OpenAI or create a GRADE.

Read-only comparison proved that the current activity hash and pedagogical policy matched the stored context. Only the serialized object-key order differed after RTDB storage. Hashing the returned object directly therefore rejected unchanged content. RTDB also omits empty arrays.

The backend fix preserves the original activityVersion SHA-256 check, original question, rubric, policy and attempt guards. It compares stored academic content independently of object-key order and restores only the known empty data/rubric lists omitted by RTDB. It never rewrites the ANSWER. It does not change historical review hashing, grading models, prompts or scores.

The candidate also rejects incomplete/failed/malformed API results, validates correction types, and returns sanitized classified API errors. There are no automatic billable retries. The old PowerShell diagnostic now delegates to the real backend request/parser with fabricated input.

Backend source was previously absent from public main. Both self-contained Code.gs copies are included so the deployment is reviewable; `OPENAI_BACKEND_PATCH.diff` shows the precise change against production v27. The two Configuracio.gs files are templates only. The branch is based directly on public main; it does not import unrelated local history or credentials.

## Validation

```sh
node --test tests/openai-context-rtdb.test.mjs tests/openai-integration.test.mjs tests/open-grading-firebase.test.mjs
```

These 33 standalone tests need Node 22+, no package installation, no credentials and no network. They cover all 90 real open activity contexts through RTDB-style serialization, rejection of altered content/policy/attempts, parser failures, same-ID recovery and grading idempotency. Separate tests in the complete local source additionally exercise the actual frontend context builder.

The fix accepts the exact unchanged synthetic ANSWER that production rejected. This is a local proof of the cause and repair, not a claim that production is already fixed. No new diagnostic OpenAI calls were needed in this investigation.

Read-only impact check at the start: 45 ungraded ANSWER, including the 26 older cases and 19 new records whose original activity hash/content match but whose stored-key hash differs. None was graded or rewritten. Integrity after the synthetic smoke: 577/577 original events unchanged, backendGrades and teacherState unchanged, queues 0/0/0. The one added synthetic ANSWER remains pending until authorized publication. The final full-source suite has 304 PASS / 0 FAIL / 1 emulator SKIP (305 total); TSC, lint and both builds PASS. Candidate GitHub Actions run `41861734915` succeeded with all 33 standalone tests.

## Deployment — requires express authorization

1. Keep Pages, Firebase Rules, evaluation configuration and model unchanged. This is a backend-only candidate; merging files into GitHub does not update Apps Script.
2. Read the current Apps Script content/version and deployment identity again; stop if production has changed since v27. Preserve all existing private configuration and other server files. **Never push these template Configuracio.gs files over the live configuration.**
3. Stage only the candidate Code in the established private Apps Script project. Compare the candidate hash with `openai-candidate-manifest.json`; retain v27 as rollback and keep the same endpoint/access settings.
4. After authorization, create a version and update the existing deployment. Confirm the deployed Code hash and read-only health. Do not create a new endpoint.
5. Resume the already stored synthetic U03-05 submission, using its existing ID, session and original content. Recheck that no backendGrade already exists before any grading retry. Do not create another attempt or replay the 26 historical ANSWER.
6. Verify one backendGrade/GRADE, the worker projection in Sheets, teacher detail, reload and matching content/score/feedback. Test a synthetic teacher review only through existing controls and only when there is a corresponding synthetic review; never touch real reviews for a smoke test.
7. Reconcile before/after data, preserving all original real events, grades, reviews and overrides. Confirm queues drain normally. If a critical regression occurs, restore deployment version 27 at the same endpoint; never restore the whole academic database.

## Credential handling

The live key was found in unrelated local Git history and removed from its working-tree configuration. No occurrence was found in the 293 blobs reachable from public main; deleted or inaccessible references are not proven clean. This PR does not carry that local history. Rotation/revocation requires owner authorization: stage a replacement privately, verify a brief call, switch only the private backend key with a rollback window, then revoke the old key once continuity is confirmed. Do not publish or log either key.

## Remaining access limitation

Initially, Apps Script execution history required Google identity verification and the OAuth processes listing returned 403. The user subsequently completed the normal browser login; recent worker executions and the single trigger were read successfully. No permission expansion or workaround was attempted. The failed API processes listing is not used as execution evidence.
