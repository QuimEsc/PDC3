# Release teacher recovery + explicit blank — 2026-11-05

Sanitized static release from validated candidate 4f25904. Public parent e23c7b9; no private source ancestry imported. Runtime dependencies are the hashed JS/CSS assets in manifest.json; existing public configuration and old cached assets are preserved. Source patch is against private functional baseline b07140b, not an import of Git history. Test-only emulator/harness is excluded from runtime.

## Compatibility and rollback

Order: candidate Firebase Rules, then Code.gs in the existing Apps Script project/deployment, then this static frontend. Existing Configuracio and appsscript files remain byte-for-byte unchanged. gpt-6-luna / medium / 1600; no teacher policy or rubric changes.

Return point: Pages e23c7b9a11e6ea5b2b96b09565b2f8957dafa311; Apps Script version28 (Code LF SHA256 26b015d7679d5eae138948c8d59ecec45ae142fc960beb302fb981756322446f); Rules normalized SHA256 463b4f23e85c173cda9fe1c63000dc897e26cbe000efbac3bdeb39a17167ecbd. Exact deployment config, private project content, Rules, RTDB and authenticated workbook export are kept outside Git.

If critical failure: stop test writes, roll back frontend first; retain compatible stricter Rules. Do not downgrade backend to v28 with ungraded EXPLICIT_NO_ANSWER submissions: reconcile using compatible code or stop for a decision. Confirmed zero grades remain readable. Never restore the whole database/workbook over subsequent legitimate work. Existing single every-minute pdcForceAcademicSync trigger is preserved.

Prior gates: targeted56/56, Rules emulator12/12, visual8/8, global360PASS/0FAIL/2SKIP, TSC/lint/build/build:github PASS. No unchanged-source rerun.
