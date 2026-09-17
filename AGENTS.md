# AGENTS.md

AI context for this repository. Read this before doing anything.

---

## Who / Environment

- **Owner:** Luiz Otávio — Tech Lead, content creator, educator (300k+
  students).
- **Stack:** macOS, Neovim, Tmux, Node.js, TypeScript.
- **Tone:** teammate, direct, no corporate fluff.
- **Language:** Match the owner's language in chat. Keep code, comments,
  documentation, commits, PRs, issues, and other repository artifacts in
  English. The owner's native language is Brazilian Portuguese; ignore typos and
  casual spelling in conversation.

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

**Prefer test-driven development (TDD) whenever practical.**

**Issues → branch → PR → merge.** That's it.

### Worktree location

All new Git worktrees must live under
`~/sannux-data/worktrees/<repo>/<worktree_name>`. Never create them inside a
project checkout or as its sibling. This host-local root is excluded from
`synchosts`; transfer anything needed on another host deliberately. Do not move
or remove existing worktrees solely to satisfy this policy.

1. **Pick an issue** from GitHub Issues. If none exists, create one first using
   the appropriate issue template.
2. **Create a branch** for that issue.
3. **Work in small conventional commits** (`feat`, `fix`, `refactor`, `chore`,
   `docs`).
4. **Open a PR** using the PR template and reference the issue in the body
   (`closes #N`).
5. **Merge** the PR. GitHub closes the linked issue automatically.
6. **Clean up** the completed task locally and remotely (see below).

Before reviewing, updating, or commenting on a PR, check its current state.
Merged or closed PRs are historical, read-only records: do not modify or comment
on them unless the user explicitly asks. Put follow-up work in an issue or a new
PR.

No local task files. No MEMORY.md ceremony. The git log + Issues + PRs are the
record.

### Post-delivery cleanup

Delivery includes cleanup, not just a merged PR. Once the work is merged:

- Confirm the primary checkout is available to this task before switching or
  updating it, even if it is clean. If another task owns or actively uses it,
  leave it untouched and report the return to `main` as blocked pending
  coordination. Otherwise, switch it to `main` and fast-forward to the remote.
- Remove the completed task's branches locally and remotely after verifying
  their work is included in `main`.
- Remove clean temporary worktrees created for the task, then prune stale
  worktree and remote-tracking references.
- Remove task-owned scratch directories and disposable artifacts, including
  `.scratch`, temporary `run_dir` outputs, test reports, screenshots, and logs.
  Keep committed deliverables and reusable dependencies/build caches.
- Stop task-owned servers and watchers; close browser tabs or sessions created
  for the task unless the owner explicitly wants them left running.
- Verify the checkout is clean and report any intentionally retained resources
  or cleanup blockers before calling the task complete.

This is standing authorization for **task-scoped, post-merge cleanup**. It is
not permission to delete other people's work or every non-`main` branch. Inspect
ownership, uncommitted changes, and unmerged commits first. If ownership is
unclear or cleanup could discard unmerged work, preserve it and ask the owner.
Never force-remove dirty worktrees or use blanket cleanup commands to bypass
these checks. Preserve `main` and the primary worktree.

### Commit style

```
type(scope): short imperative description

Optional (but desired for context) body explaining the why.

Co-Authored-By: <AGENT_NAME> <noreply@AGENT_COMPANY.com>
```

### Safety rules

- Never force-push `main`.
- Destructive git operations outside the standing post-delivery cleanup
  authorization require explicit user confirmation.
- Never commit `.env` or secrets.

---

## GitHub Discussions

GitHub Discussions is enabled on this repo as a **general dev forum** and as the
**blog comment system** (via [giscus](https://giscus.app)).

- **Forum:** community-facing space for Q&A, ideas, polls, show-and-tell, and
  announcements. Not widely advertised yet — organic traffic only for now, but
  intended to grow into a proper forum.
- **Blog comments:** each blog post has a giscus widget that maps to a
  Discussion in the "Geral" category. The giscus bot creates the Discussion
  automatically on first comment.
- **Categories:** Geral, Novidades, Perguntas e Respostas, Mostrar algo, Ideias,
  Enquetes.

---

## Editor page note

`/editor/` uses Monaco 0.56.0 + monaco-vim 0.4.4 via pinned AMD CDN builds. The
workspace modules live in `src/scripts/editor/`, bundled by Astro with marked
and DOMPurify. Shiki highlighting is lazy-loaded from a pinned CDN. Preview HTML
is always sanitized. Browser regressions: `npm run test:editor` against a
running local server (see README).
