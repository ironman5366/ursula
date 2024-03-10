#!/usr/bin/env bash
set -e;

# Function to handle the SIGINT signal (Ctrl+C)
shutdown() {
  echo "Received SIGINT. Terminating all processes...";
  kill "${pids[@]}";
  exit 1
}

# Set the trap to call the handle_sigint function when SIGINT is received
trap shutdown SIGINT
trap shutdown SIGTERM

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

echo "Out of loop, going to wait"

# Wait for all pids
for pid in ${pids[*]}; do
  wait $pid
done
