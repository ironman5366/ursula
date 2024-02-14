#!/usr/bin/env bash
set -e
export EXPO_NO_DOTENV=1
echo "Loading .env.$1"
export $(cat .env.$1 | xargs)
npx expo start
