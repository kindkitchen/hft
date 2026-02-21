#!/usr/bin/env bash
set -e

### Make sure we're in the repository root
cd "$(git rev-parse --show-toplevel)"
### Prepare message
message="$(git log -1 --pretty=%B main)"
### Prepare timestamp
timestamp="$(date +"%Y-%m-%d/%H-%M-%S")"
### Stage all files
git add .
### Commit with original last commit message from main
git commit -m "$message"
### Add private remote destination repo
git remote add dist https://github.com/kindkitchen/hft_.git
### Make history-snapshot branch
git push dist HEAD:"$timestamp"
### Update main branch
git push dist HEAD:main --force

### Update <hft_web_> dist repo
rm -fr .git
cd hft_web
git init
git add .
git commit -m "$message"
git remote add dist https://github.com/kindkitchen/hft_web_.git
git push dist HEAD:"$timestamp"
git push dist HEAD:main --force
