#!/usr/bin/env python3
import asyncio
import os
import queue
from pathlib import Path
from dotenv import load_dotenv
import psycopg
from pydantic import BaseModel
import gzip
from tqdm import tqdm

load_dotenv()

DATA_FILE = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_FILE.exists(), f"Open library data directory {DATA_FILE} does not exist"

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]
BATCH_SIZE = 1000


def get_db_conn():
    return psycopg.connect(POSTGRES_CONN_URL)


class Insertable(BaseModel):
    columns: tuple[str]

    def get_values(self):
        raise NotImplementedError()


class Book(Insertable):
    ol_id: str
    title: str
    alternate_titles: list[str] | None
    dewey_numbers: list[str] | None
    lc_classifications: list[str] | None
    subtitle: str | None
    description: str | None

class TableManager:

    def __init__(self,
                 table_name: str,
                 shutdown_event: asyncio.Event,
                 task_group: asyncio.TaskGroup):

        self.table_name = table_name
        self.queue = asyncio.Queue()

        self._lock = asyncio.Lock()
        self._curr_id = 0
        self._worker_task = task_group.create_task(self._worker())
        self._shutdown_event = shutdown_event

    def get_id(self):
        async with self._lock:
            self._curr_id += 1
            return self._curr_id

    async def _worker(self):
        print(f"In worker for {self.table_name}")
        conn = get_db_conn()
        while not self._shutdown_event.is_set():
            pass


def main():
    shutdown_event = asyncio.Event()
    async with asyncio.TaskGroup() as task_group:
        book_manager = TableManager("ol_books", shutdown_event, task_group)
        edition_manager = TableManager("ol_editions", shutdown_event, task_group)

        print(f"Loading {DATA_FILE}")

        total_records = 0
        with gzip.open(DATA_FILE) as in_file:
            for raw_line in tqdm(in_file):
                line_segments = raw_line.decode("utf-8").split("\t")

                total_records += 1

        print(f"Shutting down")
        shutdown_event.set()





if __name__ == "__main__":
    main()
