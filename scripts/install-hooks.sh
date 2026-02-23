#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit

echo 'Git hooks installed successfully.'
echo "core.hooksPath=$(git config --get core.hooksPath)"
