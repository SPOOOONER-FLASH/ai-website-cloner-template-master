# Codex: watermark test portability

- Scope: replace the Windows-drive test fixture with host-resolved paths so the same safety assertion works on Windows and Linux CI.
- Root cause evidence: GitHub Actions treated `C:/repo/...` as a relative path and prefixed the runner working directory; Windows treated it as absolute.
- Validation: reproduced the failing path semantics, watched the first portable expectation fail locally, then passed the focused 8 tests and the full 114-test suite.
- Untouched: watermark production logic, product images, Kimi SEO data and generated `out/`.
