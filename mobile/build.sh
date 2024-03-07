#!/usr/bin/env bash
set -e
eas build -p ios -e $1 --local --output=dist/build.ipa
