#!/bin/bash

set -euo pipefail

printf "\360\237\215\272\t  Pulling from all remotes...  \n"

for remote in $(git remote); do
    git pull -r $remote main
done

printf "Pushing to all remotes...\n"
for remote in $(git remote); do
    git push $remote
done

printf "Pushed to all remotes.\n"

