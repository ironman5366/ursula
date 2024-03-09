#!/usr/bin/env bash
set -e;

echo "Copying data from $1 to $2";
psql $POSTGRES_CONN_URL -c "\copy $2 FROM $1 WITH CSV";
