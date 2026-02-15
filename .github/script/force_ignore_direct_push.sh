#!/usr/bin/env bash
set -e

# Make sure we're in the repository root
cd "$(git rev-parse --show-toplevel)"

# Protected branches
protected=("main_dist" "another_branch_to_block")

# Current branch
BRANCH="${GITHUB_REF#refs/heads/}"

# Last pushed commit SHA
COMMIT_HASH=$(git rev-parse HEAD)

# Marker branch name
MARKER_BRANCH="_blocked_direct_push_${COMMIT_HASH}"

# Check if branch is protected
for b in "${protected[@]}"; do
    if [[ "$BRANCH" == "$b" ]]; then
        echo "Protected branch '$b' detected."
        
        # Check if marker branch already exists remotely
        if git ls-remote --exit-code origin "$MARKER_BRANCH" >/dev/null 2>&1; then
            echo "Marker branch '$MARKER_BRANCH' exists — this commit was already handled. Allow push."
            exit 0
        fi
        
        # Create marker branch locally
        git checkout -b "$MARKER_BRANCH"
        git push origin "$MARKER_BRANCH"
        echo "Marker branch '$MARKER_BRANCH' created."
        
        # Switch back to protected branch
        git checkout "$BRANCH"
        
        # Reset branch to previous commit (HEAD^1) to undo offending push
        git reset --hard HEAD^1
        
        # Force push to remove offending commit
        git push origin "$BRANCH" --force
        echo "Direct push reverted and branch restored."
        exit 0
    fi
done

echo "Branch '$BRANCH' is not protected — no action needed."
