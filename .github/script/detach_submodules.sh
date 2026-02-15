#!/usr/bin/env bash
set -e

### Make sure we're in the repository root
cd "$(git rev-parse --show-toplevel)"

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

echo "Submodules successfully detached"
