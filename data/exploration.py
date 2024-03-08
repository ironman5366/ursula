#!/usr/bin/env python3
import os
from pathlib import Path
from dotenv import load_dotenv
import gzip
from tqdm import tqdm

load_dotenv()

DATA_DIR = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_DIR.exists(), f"Open library data directory {DATA_DIR} does not exist"

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]


def get_db_conn():
    pass


types = set()

def main():
    in_file = DATA_DIR / "ol_dump_2024-02-29.txt.gz"
    print(f"Loading {in_file}")
    total = 0
    with gzip.open(os.path.join(in_file)) as fin:
        for line in tqdm(fin):
            l = line.decode("utf-8").split("\t")
            types.add(l[0])
            total += 1

    print(list(types))
    print(f"Total lines: {total}")


if __name__ == "__main__":
    main()
