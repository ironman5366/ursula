#!/usr/bin/env python3
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg
from pydantic import BaseModel

load_dotenv()

DATA_DIR = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_DIR.exists(), f"Open library data directory {DATA_DIR} does not exist"

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]

BATCH_SIZE = 1000


def get_db_conn():
    return psycopg.connect(POSTGRES_CONN_URL)


class TableIDGenerator:
    lock: asyncio.Lock
    id: int

    def get_id(self):
        async with self.lock:
            self.id += 1
            return self.id


table_ids: dict[str, TableIDGenerator] = {}
def get_id_for_table(table: str):
    if table not in table_ids:
        table_ids[table] = TableIDGenerator()
    return table_ids[table].get_id()

def main():
    pass

if __name__ == "__main__":
    main()
