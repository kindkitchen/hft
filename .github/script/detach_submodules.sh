#!/usr/bin/env bash
set -e

### Make sure we're in the repository root
cd "$(git rev-parse --show-toplevel)"

###
git config --global user.email "hft@ci.cd"
git config --global user.name "Hft Root"

### Branch to store flattened code
FLATTEN_BRANCH="main_dist"

### Create or reset the branch
git checkout -B "$FLATTEN_BRANCH"

### Loop over all first-level submodules
for sub in $(git config --file .gitmodules --get-regexp path | awk '{print $2}'); do
    echo "Detaching submodule: $sub"

    ### Remove submodule from git index (keep files)
    git rm --cached -r "$sub"

    ### Remove submodule metadata
    rm -rf ".git/modules/$sub"

    ### Remove .git inside submodule to make it a normal folder
    rm -rf "$sub/.git"
done

### Stage all files
git add .

### Commit with original last commit message from main
ORIGINAL_MSG=$(git log -1 --pretty=%B main)
git commit -m "$ORIGINAL_MSG"

echo "Submodules detached and committed to $FLATTEN_BRANCH"

### Make this branch present in current repository
git push origin main_dist --force
