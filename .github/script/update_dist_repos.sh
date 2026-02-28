#!/usr/bin/env bash
set -e

just printInfo "Ensure we are in repository root"
cd "$(git rev-parse --show-toplevel)"

just printInfo "Prepare last commit message"
message="$(git log -1 --pretty=%B main)"

just printInfo "Prepare timestamp"
timestamp="$(date +"%Y-%m-%d/%H-%M-%S")"

just printInfo "Array of pairs: 'PATH_TO_REPO|remote_repo_url'"
REPOS=(
  "./|https://github.com/kindkitchen/hft_.git"
  "./hft_web|https://github.com/kindkitchen/hft_web_.git"
)

for entry in "${REPOS[@]}"; do
  IFS="|" read -r PATH_TO_REPO REMOTE <<< "$entry"

  just printInfo "Processing $PATH_TO_REPO -> $REMOTE"

  if [[ "$PATH_TO_REPO" == "./" ]]; then
    just printInfo "At root repo, normal push"

    git remote remove origin 2>/dev/null || true
    git remote add origin "$REMOTE"
    git add -A

    if git diff --cached --quiet; then
      just printInfo "⚠️ No changes in root repo, skipping..."
      continue
    fi

    git commit -m "$message"
    git branch -M main
    git push origin main --force
  else
    just printInfo "Non-root path, copying .git folder"
    cp -r .git "$PATH_TO_REPO/.git"

    cd "$PATH_TO_REPO"

    git remote remove origin 2>/dev/null || true
    git remote add origin "$REMOTE"

    # create orphan branch
    git checkout --orphan "$timestamp"
    git reset --hard

    git add -A
    git commit -m "$message"

    git push origin HEAD:"$timestamp" --force
    git push origin HEAD:main --force

    just printInfo "Cleaning up copied .git"
    rm -rf .git

    cd - >/dev/null
  fi

  just printInfo "---------------------------"
done