#!/bin/bash

echo "Pushing to all remotes..."

for remote in $(git remote); do
    git pull -r $remote main
done

for remote in $(git remote); do
    git push $remote
done

echo "Pushed to all remotes."
