#!/usr/bin/env bash
set -e;

echo "Copying data from $1 to $2";

# Grab the headers from the CSV file so we don't have to worry about column order
headers=$(head -n 1 "$1");
command="\copy $2 ($headers) FROM $1 WITH CSV HEADER";

echo "Running copy command: $command";
psql "$POSTGRES_CONN_URL" -c "$command";
