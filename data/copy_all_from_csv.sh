#!/usr/bin/env bash
set -e;

# In the directory $1, look for any csv file, and run `./copy_from_csv.sh file_name.csv file_name` on it.
# Do this all concurrently, and join at the end.

# Array for pids
pids=()

for file in $1/*.csv; do
  # Split all the extensions off of the file (we expect it to have at least two extensions)
  filename=$(basename "$file" | cut -d. -f1)

  # Do the copy in the background
  echo "Copying $file to ${filename%.*}"
  ./copy_from_csv.sh "$file" "${filename%.*}" &
  # Store the pid
  pids+=($!)
done

# Wait for all pids
for pid in ${pids[*]}; do
  wait $pid
done
