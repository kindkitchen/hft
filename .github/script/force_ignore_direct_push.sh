#!/usr/bin/env bash
set -e

### Make sure we're in the repo root
cd "$(git rev-parse --show-toplevel)"

### Protected branches
protected=("main" "some_another_protected_branch")

### Current branch
BRANCH="${GITHUB_REF#refs/heads/}"

for b in "${protected[@]}"; do
  if [[ "$BRANCH" == "$b" ]]; then
    echo "Direct push to protected branch '$b' detected — restoring branch to remote state..."

    ### Fetch latest remote state
    git fetch origin "$BRANCH"
