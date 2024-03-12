#!/usr/bin/env python3
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
import click
from tqdm import tqdm
import backoff
import traceback
import time


@backoff.on_exception(backoff.expo, Exception, max_tries=20)
def copy_csv_file(csv_path, filename):
    start_time = time.time()
    print(f"Uploading {csv_path}")
    try:
        # Run the copy_from_csv.sh script as a subprocess, and output to STDOUT
        subprocess.check_call(['./copy_from_csv.sh', csv_path, filename], text=True, stdout=subprocess.PIPE,
                              stderr=subprocess.PIPE)
        print(f"Upload of {csv_path} complete")
    except subprocess.CalledProcessError as e:
        end_time = time.time()
        # Get as much info as we can, these flakes are often costly to get to
        print(f"Failed after {end_time - start_time} seconds. Retrying...")
        print(f"Error occurred: {e} - will try again with backoff")
        print(e)
        print(e.args)
        print(e.cmd)
        print(e.stderr)
        print(e.stdout)
        print(e.returncode)
        traceback.print_exc()

        raise e


@click.command()
@click.argument('directory', type=click.Path(exists=True, file_okay=False, dir_okay=True))
@click.option('--max-uploads', type=int, default=3, help='Maximum number of concurrent uploads')
def upload(directory, max_uploads):
    csv_files = list(sorted([file for file in os.listdir(directory) if file.endswith('.csv')]))

    with ThreadPoolExecutor(max_workers=max_uploads) as executor:
        futures = []
        for file in csv_files:
            filename = file.split(".")[0]

            csv_path = os.path.join(directory, file)
            future = executor.submit(copy_csv_file, csv_path, filename)
            futures.append(future)

        print("Submitted all tasks, waiting for completion...")

        # Wait for all futures to complete
        for future in tqdm(as_completed(futures), total=len(csv_files)):
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred: {e}")
    print("All tasks completed.")


if __name__ == "__main__":
    upload()
