#!/usr/bin/env bash
set -e

echo "Ensure we are in repository root"
cd "$(git rev-parse --show-toplevel)"

echo "Prepare last commit message"
message="$(git log -1 --pretty=%B main)"

echo "Prepare timestamp"
timestamp="$(date +"%Y-%m-%d/%H-%M-%S")"

echo "Array of pairs: 'PATH_TO_REPO|remote_repo_url'"
REPOS=(
  "./|https://github.com/kindkitchen/hft_.git"
  "./hft_web|https://github.com/kindkitchen/hft_web_.git"
)

for entry in "${REPOS[@]}"; do
  IFS="|" read -r PATH_TO_REPO REMOTE <<< "$entry"

  echo "Processing $PATH_TO_REPO -> $REMOTE"

  if [[ "$PATH_TO_REPO" == "./" ]]; then
    echo "At root repo, normal push"

    git remote remove origin 2>/dev/null || true
    git remote add origin "$REMOTE"
    git add -A

    if git diff --cached --quiet; then
      echo "⚠️ No changes in root repo, skipping..."
      continue
    fi

    git commit -m "$message"
    git branch -M main
    git push origin main --force
  else
    echo "Non-root path, copying .git folder"
    cp -r .git "$PATH_TO_REPO/.git"

    cd "$PATH_TO_REPO"

    # create orphan branch
    git checkout --orphan "$timestamp"
    git reset --hard

    git add -A
    git commit -m "$message"

    git push origin HEAD:"$timestamp" --force
    git push origin HEAD:main --force

    echo "Cleaning up copied .git"
    rm -rf .git

    cd - >/dev/null
  fi

  echo "---------------------------"
done