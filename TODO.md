# POKPOK Report Repo - TODO

## HIGH Priority

- [ ] **Migrate changelog to JSON-driven system**
  - Plan: [docs/changelog-json-migration-plan.md](docs/changelog-json-migration-plan.md)
  - Current: Hardcoded HTML (338 lines)
  - Target: JSON data file (~50 lines) + JS renderer
  - Benefits: Easy maintenance, no HTML knowledge needed
  - Estimated effort: 2-3 hours

## MEDIUM Priority

- [ ] Add custom domain support for updates page
  - Current: `xclv-ai.github.io/pokpok-report/updates.html`
  - Target: `updates.pokpok.ai`

- [ ] Link updates page from pokpok.ai footer/nav

## LOW Priority

- [ ] Add JSON schema validation for changelog.json
- [ ] Add search/filter functionality to updates page
- [ ] Auto-generate changelog from GitHub commits (GitHub Actions)

---

**Last Updated:** 2026-02-02
