# AGENTS

Meaning of each file:

- `AGENTS.md` - agent guidelines and project rules.
- `PLAN.md` - the current featured being implemented.
- `CHANGELOG.md` - factual record of completed changes, aligned with commits.
# 🤖 Project AI Guidelines (Context Dispatcher)

Welcome, AI Assistant! Before taking any action or answering any prompt in this repository, you **MUST** read the following files in the exact order below to load your context, personality, user preferences, and current memory:

1.  **`./.agents/SOUL.md`**: Defines who you are, your tone, rules of engagement (like the Green Light Protocol), and technical guardrails.
2.  **`./.agents/USER.md`**: Defines who the user is, their environment, hardware, and preferences.
3.  **`./.agents/MEMORY.md`**: Your long-term memory. Read this to know what we did in previous sessions, what bugs we found, and what you noted for yourself.
4.  **`./PLAN.md`**: Our Kanban/Sprint board. Shows exactly what we are working on *right now*.
5.  **`./CHANGELOG.md`**: Factual history of commits and finished tasks.

> **CRITICAL**: The `.agents/` folder is intentionally ignored in `.gitignore` to protect personal data. Never commit personal context files.
>
> *Do not start coding until you have read the relevant context files above.*

## Commit & Memory Protocol (Mandatory)

- Every code/config change must be committed in small, conventional-commit chunks.
- Before each code/config commit, append a short entry to local `./.agents/MEMORY.md`.
- Never stage or commit anything inside `./.agents/`.
- Run `npm run hooks:install` once per clone. The pre-commit hook enforces these rules.

## 5. New Plan

When a task is finished, added to the change log and pushed to the repository,
clear the current plan and use this template to create new one.

```md
# Current Plan

## Task: <task name>

<task description>

Current Date: YYYY-MM-DD

- [ ] Step 1: Analyze requirements.
- [ ] Step 2: Implement core logic.
- [ ] Step 3: Verify/Test.
- [ ] Step 4: Update CHANGELOG.md.
- [ ] Step 5: Clear PLAN.md (remove all completed content).

_(Note: Once all items are checked `[x]`, this file should be cleared for the
next task)_
```
