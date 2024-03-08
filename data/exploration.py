#!/usr/bin/env python3
import os
from pathlib import Path
from dotenv import load_dotenv
import gzip
from tqdm import tqdm
import json

load_dotenv()

DATA_FILE = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_FILE.exists(), f"Open library data file {DATA_FILE} does not exist"

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]


all_types = ['/type/language', '/type/edition', '/type/user', '/type/author', '/type/macro', '/type/permission', '/type/scan_location', '/type/template', '/type/uri', '/type/library', '/type/work', '/type/page', '/type/collection', '/type/tag', '/type/rawtext', '/type/object', '/type/local_id', '/type/series', '/type/home', '/type/i18n_page', '/type/subject', '/type/about', '/type/doc', '/type/delete', '/type/place', '/type/scan_record', '/type/volume', '/type/type', '/type/backreference', '/type/redirect', '/type/list', '/type/usergroup', '/type/i18n']
examples_by_type = {}

def main():
    print(f"Loading {DATA_FILE}")
    total = 0
    with gzip.open(os.path.join(DATA_FILE)) as fin:
        for line in tqdm(fin):
            l = line.decode("utf-8").split("\t")
            line_type = l[0]
            line_data = l[-1]
            if line_type not in examples_by_type:
                examples_by_type[line_type] = l[:-1] + [
                    json.loads(line_data)
                ]

            total += 1

            if set(all_types) == set(examples_by_type.keys()):
                print("All types found!")
                break

    print(f"Total lines: {total}")
    with open("examples_by_type.json", 'w') as examples_file:
        examples_file.write(json.dumps(examples_by_type, indent=4, sort_keys=True))


if __name__ == "__main__":
    main()
