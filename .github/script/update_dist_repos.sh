#!/usr/bin/env bash
set -e
###
echo """Make sure we're in the repository root"""
cd "$(git rev-parse --show-toplevel)"
###
echo """Prepare message"""
message="$(git log -1 --pretty=%B main)"
###
echo """Prepare timestamp"""
timestamp="$(date +"%Y-%m-%d/%H-%M-%S")"
###
echo """Array of pairs: 'local_path|remote_repo_url'"""
REPOS=(
  "./|https://github.com/kindkitchen/hft_.git"
  "./hft_web|https://github.com/kindkitchen/hft_web_.git"
)
########################################
for entry in "${REPOS[@]}"; do
  IFS="|" read -r PATH REPO <<< "$entry"
  ###
  echo """Processing $PATH -> $REPO"""
  ###
  echo """Change directory to $PATH"""
  cd "$PATH"
  ###
  echo """Remove original git repository"""
  rm -fr .git
  ###
  echo """Reinitialize new one"""
  git init
  ###
  echo """Remove origin (if existed)"""
  git remote remove origin 2>/dev/null || true
  ###
  echo """Add origin"""
  git remote add origin "$REPO"
  ###
  echo """Stage all files"""
  git add .
  ###
  echo """Commit with original last commit message from main"""
  git commit -m "$message"
  ###
  echo """Make history-snapshot branch"""
  git push origin HEAD:"$timestamp"
  ###
  echo """Update main branch"""
  git push origin HEAD:main --force
  ###
  echo """Change directory back"""
  cd -
done
##########################################
