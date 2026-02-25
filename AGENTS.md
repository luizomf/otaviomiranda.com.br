# AGENTS

Minimal repository rules for coding agents.

## Context Order (always read first)

1. `./.agents/SOUL.md`
2. `./.agents/USER.md`
3. `./.agents/MEMORY.md`
4. `./.agents/PLAN.md`

## Hard Rules

- Never commit files inside `./.agents/` (private/local only).
- Use small conventional commits.
- For every code/config commit: append a short log entry to
  `./.agents/MEMORY.md` first.
- Install hooks once per clone: `npm run hooks:install`.

## Project Workflow

- `.agents/PLAN.md` = current task board (single source of truth for what is in
  progress).
- When a task is done: verify/test, update local memory, commit, and clear
  `.agents/PLAN.md` for the next task.
