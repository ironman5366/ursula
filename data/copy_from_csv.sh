#!/usr/bin/env bash
set -e;

echo "Copying data from $1 to $2";

# Grab the headers from the CSV file so we don't have to worry about column order
headers=$(head -n 1 "$1");

psql "$POSTGRES_CONN_URL" <<EOF
SET statement_timeout = '20min';
\copy $2 ($headers) FROM '$1' WITH CSV HEADER;
EOF

echo "Finished copying $1";
