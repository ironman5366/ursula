#!/usr/bin/env python3
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
import click
from tqdm import tqdm
import backoff

@backoff.on_exception(backoff.expo, Exception, max_tries=8)
def copy_csv_file(csv_path, filename):
    print(f"Uploading {csv_path}")
    # Run the copy_from_csv.sh script as a subprocess, and output to STDOUT
    subprocess.run(['./copy_from_csv.sh', csv_path, filename], check=True, text=True, stdout=subprocess.PIPE,
                   stderr=subprocess.PIPE)
    print(f"Upload of {csv_path} complete")


@click.command()
@click.argument('directory', type=click.Path(exists=True, file_okay=False, dir_okay=True))
@click.option('--max-uploads', type=int, default=5, help='Maximum number of concurrent uploads')
def main(directory, max_uploads):
    csv_files = [file for file in os.listdir(directory) if file.endswith('.csv')]

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

if __name__ == '__main__':
    main()
