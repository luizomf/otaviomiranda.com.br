#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Bootstrap an AGENTS workflow in a repository.

Usage:
  bash scripts/bootstrap-agents.sh [--target <path>] [--force]

Options:
  --target <path>  Target repository path (default: current git root or cwd)
  --force          Overwrite existing managed files
  -h, --help       Show this help message
USAGE
}

target=""
force="false"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --target)
      if [ "$#" -lt 2 ]; then
        echo "ERROR: --target requires a value" >&2
        exit 1
      fi
      target="$2"
      shift 2
      ;;
    --force)
      force="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [ -z "$target" ]; then
  if git rev-parse --show-toplevel >/dev/null 2>&1; then
    target="$(git rev-parse --show-toplevel)"
  else
    target="$(pwd)"
  fi
fi

repo_root="$(cd "$target" && pwd)"

mkdir -p "$repo_root/.agents" "$repo_root/.githooks" "$repo_root/scripts"

write_file() {
  local path="$1"
  local content="$2"

  if [ -e "$path" ] && [ "$force" != "true" ]; then
    echo "skip: $path (already exists)"
    return
  fi

  printf '%s' "$content" > "$path"
  echo "write: $path"
}

AGENTS_CONTENT=$(cat <<'TXT'
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
- Install hooks once per clone: `bash scripts/install-hooks.sh`.

## Project Workflow

- `.agents/PLAN.md` = current task board (single source of truth for what is in
  progress).
- When a task is done: verify/test, update local memory, commit, and clear
  `.agents/PLAN.md` for the next task.
TXT
)

SOUL_CONTENT=$(cat <<'TXT'
# SOUL.md

Operational behavior for this repository.

- Language: PT-BR in chat; English (US) in code, commits, and file names.
- Style: direct, concise, no corporate fluff.
- Execution: prioritize doing over proposing; keep the user informed of key
  steps.
- Safety: do not perform destructive git actions unless explicitly requested.
- Continuity: if a decision matters for future sessions, record it in
  `.agents/MEMORY.md`.
TXT
)

USER_CONTENT=$(cat <<'TXT'
# USER.md

User profile (practical only).

- Name/role:
- Environment:
- Preference:
- Communication:
TXT
)

MEMORY_CONTENT=$(cat <<'TXT'
# MEMORY.md

Private continuity notes for session recovery.

## Stable Context

- Project:
- Content source:
- Required conventions:

## Current Architecture Snapshot (YYYY-MM-DD)

- Main pages/modules:
- Styling/runtime:
- Build/deploy:

## Recently Completed

- 

## Open TODOs

- 

## Recovery Quickstart

1. Check state: `git status -sb`.
2. Read active board: `PLAN.md`.
3. Run local validation command.
TXT
)

PLAN_CONTENT=$(cat <<'TXT'
# Current Plan

No active tasks right now.

Last update: YYYY-MM-DD
TXT
)

PRE_COMMIT_CONTENT=$(cat <<'TXT'
#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

staged_files="$(git diff --cached --name-only --diff-filter=ACMR)"

if [ -z "$staged_files" ]; then
  exit 0
fi

# Never allow personal context files to be staged.
if printf '%s\n' "$staged_files" | rg -q '^\.agents/'; then
  echo 'ERROR: .agents/ is personal context and must never be committed.'
  echo 'Remove it from the index and retry:'
  echo '  git reset HEAD .agents/'
  exit 1
fi

# Enforce memory update only for non-doc code/config changes.
if ! printf '%s\n' "$staged_files" | rg -qv '^(README\.md|CHANGELOG\.md|PLAN\.md|AGENTS\.md|\.githooks/|\.github/|.*\.md$)'; then
  exit 0
fi

memory_file='.agents/MEMORY.md'
if [ ! -f "$memory_file" ]; then
  echo "ERROR: ${memory_file} not found."
  echo 'Update/create your local memory file before committing code changes.'
  exit 1
fi

get_mtime() {
  local file="$1"
  local ts

  ts="$(stat -f %m "$file" 2>/dev/null || true)"
  if [ -n "$ts" ]; then
    echo "$ts"
    return
  fi

  ts="$(stat -c %Y "$file" 2>/dev/null || true)"
  if [ -n "$ts" ]; then
    echo "$ts"
    return
  fi

  echo 0
}

head_ts="$(git log -1 --format=%ct 2>/dev/null || echo 0)"
memory_ts="$(get_mtime "$memory_file")"

if [ "$memory_ts" -le "$head_ts" ]; then
  echo 'ERROR: code/config changes detected, but .agents/MEMORY.md was not updated after the last commit.'
  echo 'Please add a short log entry to .agents/MEMORY.md and commit again.'
  exit 1
fi

exit 0
TXT
)

INSTALL_HOOKS_CONTENT=$(cat <<'TXT'
#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit

echo 'Git hooks installed successfully.'
echo "core.hooksPath=$(git config --get core.hooksPath)"
TXT
)

write_file "$repo_root/AGENTS.md" "$AGENTS_CONTENT"
write_file "$repo_root/.agents/SOUL.md" "$SOUL_CONTENT"
write_file "$repo_root/.agents/USER.md" "$USER_CONTENT"
write_file "$repo_root/.agents/MEMORY.md" "$MEMORY_CONTENT"
write_file "$repo_root/.agents/PLAN.md" "$PLAN_CONTENT"
write_file "$repo_root/.githooks/pre-commit" "$PRE_COMMIT_CONTENT"
write_file "$repo_root/scripts/install-hooks.sh" "$INSTALL_HOOKS_CONTENT"

chmod +x "$repo_root/.githooks/pre-commit" "$repo_root/scripts/install-hooks.sh"

echo
echo "Bootstrap complete in: $repo_root"
echo "Next steps:"
echo "  1) Review AGENTS.md and .agents/* templates"
echo "  2) Run: bash scripts/install-hooks.sh"
echo "  3) Optionally add an npm script: hooks:install"
