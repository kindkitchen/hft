#!/usr/bin/env bash
set -e
###
just print """Make sure we're in the repository root"""
cd "$(git rev-parse --show-toplevel)"
###
just print """Prepare message"""
message="$(git log -1 --pretty=%B main)"
###
just print """Prepare timestamp"""
timestamp="$(date +"%Y-%m-%d/%H-%M-%S")"
###
just print """Array of pairs: 'local_path|remote_repo_url'"""
REPOS=(
  "./|https://github.com/kindkitchen/hft_.git"
  "./hft_web|https://github.com/kindkitchen/hft_web_.git"
)
########################################
for entry in "${REPOS[@]}"; do
  IFS="|" read -r PATH_TO_REPO REPO <<< "$entry"
  ###
  just print """Processing $PATH_TO_REPO -> $REPO"""
  ###
  just print """Change directory to $PATH_TO_REPO"""
  cd "$PATH_TO_REPO"
  ###
  just print """Remove original git repository"""
  rm -fr .git
  ###
  just print """Reinitialize new one"""
  git init
  ###
  just print """Remove origin (if existed)"""
  git remote remove origin 2>/dev/null || true
  ###
  just print """Add origin"""
  git remote add origin "$REPO"
  ###
  just print """Stage all files"""
  git add .
  ###
  just print """Commit with original last commit message from main"""
  git commit -m "$message"
  ###
  just print """Make history-snapshot branch"""
  git push origin HEAD:"$timestamp"
  ###
  just print """Update main branch"""
  git push origin HEAD:main --force
  ###
  just print """Change directory back"""
  cd -
done
##########################################
