#!/usr/bin/env bash
set -e

# Make sure we're in the repo root
cd "$(git rev-parse --show-toplevel)"

# Protected branches
protected=("main" "another_branch_to_block")

# Current branch
BRANCH="${GITHUB_REF#refs/heads/}"

for b in "${protected[@]}"; do
  if [[ "$BRANCH" == "$b" ]]; then
    echo "Direct push to protected branch '$b' detected — restoring branch to remote state..."

    # Fetch latest remote state
    git fetch origin "$BRANCH"

    # Reset branch to remote, discarding local pushed commits
    git reset --hard "origin/$BRANCH"

    # Force push to remote to remove unwanted commits
    git push origin "$BRANCH" --force

    echo "Branch '$BRANCH' restored to remote state."
    exit 0
  fi
done

echo "Branch '$BRANCH' is not protected — no action needed."
