# Current Plan

## Task: Mobile pass and Astro planning

Run a final mobile validation of the migrated site pages, then produce a calm,
low-risk Astro migration plan without changing the live deployment flow yet.

Current Date: 2026-02-17

- [x] Step 1: Analyze requirements and define mobile validation criteria.
- [x] Step 2: Run mobile checks on home + all year routes in localhost.
- [x] Step 3: Fix any mobile issues found.
- [x] Step 4: Verify/Test.
- [x] Step 5: Write Astro phased plan (setup, migration strategy, rollout).
- [x] Step 6: Update CHANGELOG.md.
- [ ] Step 7: Clear PLAN.md (remove all completed content).

Mobile audit summary:
- Tooling: local Playwright headless audit in `localhost:3000`.
- Scope: home (`/`) + all year routes except `2017/*` redirects.
- Result after fixes: all migrated post pages pass without horizontal overflow
  in `390x844` and `320x568`.
- Remaining issue (deferred by scope): home page (`/`) still has horizontal
  overflow on `320px` due legacy card width rules.

Astro phased plan (no pressure rollout):
- Phase 0: freeze current static baseline and keep deploy flow unchanged.
  - Keep current root static site deploy as source of truth.
  - Add visual/mobile checklist as release gate.
- Phase 1: create isolated Astro workspace (`astro-site/`) in same repo.
  - Static output only (`output: \"static\"`).
  - Mirror current URL structure using `src/pages/.../index.astro`.
  - Reuse existing CSS/JS assets first, then incrementally optimize.
- Phase 2: migrate posts with deterministic templates.
  - Legacy HTML posts: convert to Astro pages with shared 2026 shell layout.
  - Markdown-source posts: store markdown files and render with Astro markdown.
  - Keep shiki strategy lightweight (build-time or pre-generated snippets).
- Phase 3: parallel validation and cutover.
  - Build Astro output and compare route-by-route against current static output.
  - Validate SEO parity (`title`, description, canonical behavior, sitemap).
  - Switch deployment to Astro `dist/` only after parity checklist passes.
- Phase 4: home migration as dedicated milestone.
  - Redesign/fix mobile overflow in the Astro home version.
  - Keep ad/link visibility constraints as explicit acceptance criteria.

_(Note: Once all items are checked `[x]`, this file should be cleared for the
next task)_
