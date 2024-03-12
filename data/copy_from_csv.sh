#!/usr/bin/env bash
set -e;

echo "Checking if $1 has already been uploaded...";

# Check if the file has already been uploaded
is_uploaded=$(psql "$POSTGRES_CONN_URL" -tAc "SELECT EXISTS(SELECT 1 FROM ol_files_uploaded WHERE file_name = '$1')")

if [ "$is_uploaded" = "t" ]; then
  echo "File $1 has already been uploaded. Skipping upload.";
else
  echo "File $1 has not been uploaded. Proceeding with upload.";

  echo "Copying data from $1 to $2";

  # Grab the headers from the CSV file so we don't have to worry about column order
  headers=$(head -n 1 "$1");

  psql "$POSTGRES_CONN_URL" <<EOF
  SET statement_timeout = '20min';
  \copy $2 ($headers) FROM '$1' WITH CSV HEADER;
  INSERT INTO ol_files_uploaded (file_name) VALUES ('$1');
  \q;
EOF

  echo "Finished copying $1";
fi
