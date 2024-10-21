#!/bin/bash

npm ci

npm run build

npm run test

npm version 5.1.3 --no-git-tag-version --workspaces

npm publish --workspaces --tag beta