# OPENAI / RTDB — PRODUCTION FAILURE REPRODUCED — 04-11-2026

Read `HANDOFF.md` first. Production remains Apps Script v27 and Pages `e23c7b9`; this PR does not deploy.

An authorized synthetic response from the real browser was persisted as ANSWER, then rejected before grading because RTDB reordered object keys. The existing activityVersion and policy match. The backend candidate accepts the unchanged stored content while preserving all actual question/rubric/policy/attempt guards. The synthetic ANSWER remains pending until authorized backend publication; do not create another ID.

Candidate Code and offline tests are included because public main previously had publication assets and partial source fragments, not this backend. Root HTML, configuration and assets are untouched. The clean branch is based on public main and imports no local credential-bearing history.

PR https://github.com/QuimEsc/PDC3/pull/1: 33 standalone tests PASS locally and in GitHub Actions `41861734915` on code commit `9ee1615`. Final complete-source gate: 304 PASS / 0 FAIL / 1 emulator SKIP, total 305; TSC/lint/builds PASS. 577/577 original events and all real-student data remain unchanged; queues 0/0/0. Baseline had 19 new ungraded contexts with the same mismatch, in addition to the 26 historical cases; none was regraded. Only one new authorized synthetic ANSWER exists and must be resumed after publication.

Full-source gate and limitations are recorded in `HANDOFF.md`. See `docs/OPENAI_BACKEND_DEPLOYMENT.md` for exact rollout/rollback and credential handling. No real grades/reviews, historical ANSWER, models or evaluation policies were changed.
