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
import datetime
import json
from dateutil.parser import parse, ParserError

load_dotenv()

DATA_FILE = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_FILE.exists(), f"Open library data directory {DATA_FILE} does not exist"

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]
BATCH_SIZE = 1000


def get_db_conn():
    return psycopg.connect(POSTGRES_CONN_URL)


class Book(BaseModel):
    id: int
    ol_id: str
    title: str
    alternate_titles: list[str] | None
    dewey_numbers: list[str] | None
    lc_classifications: list[str] | None
    subtitle: str | None
    description: str | None

class Edition(BaseModel):
    id: int
    ol_id: str
    book_id: int
    title: str
    subtitle: str | None
    alternate_titles: list[str] | None
    publish_places: list[str] | None
    number_of_pages: int | None

    # This should be pre-processed as an ISO date
    publish_date: str | None

    isbn_10: str | None
    isbn_13: str | None
    lc_classifications: list[str] | None
    series: str | None

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
        self._id_cache: dict[str, int] = {}

    async def get_id(self, key: str):
        if key in self._id_cache:
            return self._id_cache[key]

        async with self._lock:
            self._curr_id += 1
            self._id_cache[key] = self._curr_id
            return self._curr_id

    def _take_batch(self):
        batch = []
        while len(batch) < BATCH_SIZE:
            try:
                batch.append(self.queue.get_nowait())
            except asyncio.QueueEmpty:
                break

        return batch

    async def _worker(self):
        print(f"In worker for {self.table_name}")
        conn = get_db_conn()

        while not self._shutdown_event.is_set():
            print(f"Trying to take batch for {self.table_name}...")
            batch = self._take_batch()
            if not batch:
                print(f"No batch, sleeping")
                await asyncio.sleep(1)
                continue

            # Get the field names from pydantic on batch[0]
            columns = list(batch[0].model_fields.keys())

            print(f"Writing batch of {len(batch)} for {self.table_name}...")
            curr = conn.cursor()

            with curr.copy(f"COPY {self.table_name}(f({', '.join(columns)})) FROM STDIN (format csv") as copy:
                for row in batch:
                    values = [getattr(row, col) for col in columns]
                    copy.write(values)


def first_or_none(line, val):
    if val in line and line[val]:
        return line[val][0]
    return None

def extract_text(line, val):
    if val in line and line[val]:
        if isinstance(val, str):
            return val
        elif isinstance(val, dict):
            return val["value"]
        else:
            raise ValueError(f"Unexpected type {type(val)}, {val}")

    return None

async def main():
    shutdown_event = asyncio.Event()
    async with asyncio.TaskGroup() as task_group:
        book_manager = TableManager("ol_books", shutdown_event, task_group)
        edition_manager = TableManager("ol_editions", shutdown_event, task_group)

        print(f"Loading {DATA_FILE}")

        total_records = 0
        books = 0
        editions = 0
        date_parse_errors = 0

        with gzip.open(DATA_FILE) as in_file:
            for raw_line in tqdm(in_file):
                line_segments = raw_line.decode("utf-8").split("\t")
                line_type = line_segments[0]
                total_records += 1

                if line_type == "/type/work":
                    books += 1
                    line_data = json.loads(line_segments[-1])
                    book_ol_id = line_data["key"]
                    book_id = await book_manager.get_id(book_ol_id)
                    book = Book(
                        id=book_id,
                        ol_id=book_ol_id,
                        title=line_data["title"],
                        alternate_titles=line_data.get("alternate_titles"),
                        dewey_numbers=line_data.get("dewey_decimal_class"),
                        lc_classifications=line_data.get("lc_classifications"),
                        subtitle=line_data.get("subtitle"),
                        description=extract_text(line_data, "description")
                    )
                    book_manager.queue.put_nowait(book)
                elif line_type == "/type/edition":
                    editions += 1

                    line_data = json.loads(line_segments[-1])
                    if "works" not in line_data or len(line_data["works"]) == 0:
                        continue

                    if "title" not in line_data:
                        continue

                    edition_ol_id = line_data["key"]
                    work_id = line_data["works"][0]["key"]

                    publish_date_raw = line_data.get("publish_date")
                    publish_date = None
                    if publish_date_raw:
                        try:
                            publish_date = parse(publish_date_raw).isoformat()
                        except ParserError:
                            date_parse_errors += 1



                    edition_id = await edition_manager.get_id(edition_ol_id)
                    book_id = await book_manager.get_id(work_id)

                    edition = Edition(
                        id=edition_id,
                        ol_id=edition_ol_id,
                        book_id=book_id,
                        title=line_data["title"],
                        subtitle=line_data.get("subtitle"),
                        alternate_titles=line_data.get("alternate_titles"),
                        publish_places=line_data.get("publish_places"),
                        number_of_pages=line_data.get("number_of_pages"),
                        publish_date=publish_date,
                        isbn_10=first_or_none(line_data, "isbn_10"),
                        isbn_13=first_or_none(line_data, "isbn_13"),
                        lc_classifications=line_data.get("lc_classifications"),
                        series=first_or_none(line_data, "series")
                    )
                    edition_manager.queue.put_nowait(edition)
                else:
                    pass

                if total_records >= 500 * 1000:
                    print(f"Processed {total_records} records, {books} books, {editions} editions stopping here to check the vibes")
                    break

    print(f"Shutting down")
    shutdown_event.set()



if __name__ == "__main__":
   asyncio.run(main())
