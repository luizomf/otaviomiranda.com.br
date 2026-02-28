# CLAUDE.md

AI context for this repository. Read this before doing anything.

---

## Who / Environment

- **Owner:** Luiz Otávio — Tech Lead, content creator, educator (300k+
  students).
- **Stack:** macOS, Neovim, Tmux, Node.js, TypeScript.
- **Tone:** teammate, direct, no corporate fluff.
- **Language:** English everywhere — code, comments, commits, PRs, issues,
  files. Chat is also English. Owner's native language is Brazilian Portuguese;
  expect typos and creative spelling in chat — ignore them. If a topic gets
  complex, either party may switch to PT-BR briefly to avoid miscommunication.

---

## Project — otaviomiranda.com.br

Personal site + blog. Astro SSG, deployed to GitHub Pages via Actions.

### Key paths

| Path                    | What                                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| `src/pages/`            | File-based routing. `[...slug].astro` = posts, `blog/[page].astro` = archive |
| `src/components/`       | All UI components (see comments inside each file)                            |
| `src/layouts/`          | `BaseLayout` (all pages) · `BlankLayout` (editor only)                       |
| `src/styles/global.css` | Global CSS only — variables, reset, cross-component rules                    |
| `src/content/posts/`    | Markdown posts (`text.md` + frontmatter)                                     |
| `src/content.config.ts` | Zod schema for content collection                                            |
| `src/config/`           | Static data (courses, testimonials, contacts, coupon)                        |
| `src/utils/`            | `post-date.ts`, `post-path.ts` — helpers for content collection              |
| `scripts/`              | One-off Node.js migration scripts, NOT part of the build                     |
| `astro.config.mjs`      | Astro config — site URL, integrations, image settings                        |

### Architecture decisions (stable)

- **Scoped styles by default.** CSS that belongs to one component lives in its
  `<style>` block. Only truly global/cross-component CSS goes in `global.css`.
- **`:global()` for parent-context selectors** (e.g.
  `:global(.section-dark) li`).
- **`containerClass` vs `linkClass` in PillLink:** `containerClass` lands on
  ColorfulBorder's root div (gets page scope ✓). `linkClass` lands on the inner
  `<a>` (only has PillLink scope) — parent pages must use
  `.wrapper :global(.linkClass)` to style it.
- **Dark mode:** `data-theme="dark"` on `.article-section` elements. Scoped to
  post/blog/contacts pages only. Toggle saves to `localStorage`.
- **SectionHeader classes stay global** (`.section-header`, `.section-eyeball`,
  `.section-title`, `.section-line`) because `.section-line` is used as slotted
  content in contacts.astro and scoped styles wouldn't reach it.

---

## Workflow

**Issues → branch → PR → merge.** That's it.

1. **Pick an issue** from GitHub Issues.
2. **Work in small conventional commits** (`feat`, `fix`, `refactor`, `chore`,
   `docs`).
3. **Open a PR** referencing the issue (`closes #N`).
4. **Merge** and close.

No local task files. No MEMORY.md ceremony. The git log + Issues are the record.

### Commit style

```
type(scope): short imperative description

Optional body explaining the why.

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Safety rules

- Never force-push `main`.
- If hooks are installed, do not skip them unless explicitly asked.
- No destructive git ops without explicit user confirmation.
- Never commit `.env`, secrets, or `.agents/`.

---

## Editor page note

`/editor/` uses Monaco + marked + DOMPurify (CDN, `is:inline`). Vim mode via
`monaco-vim`. DOMPurify is always active. ~680-line inline script — deferred
refactor (tracked in Issues).
