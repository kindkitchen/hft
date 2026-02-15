#!/usr/bin/env bash
set -e

### Make sure we're in the repository root
cd "$(git rev-parse --show-toplevel)"

### Stage all files
git add .
### Commit with original last commit message from main
git commit -m "$(git log -1 --pretty=%B main)"
### Add private remote destination repo
git remote add dist https://github.com/kindkitchen/hft_.git
### Make history-snapshot branch
git push dist $(date +"%Y-%m-%d/%H-%M-%S")
### Update main branch
git push dist main --force
