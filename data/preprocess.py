#!/usr/bin/env python3

# Note for the reader: this script is way overcomplicated because this originally also tried to manager inserting into
# the database, so I tried to do some fancy metaprogramming and worker stuff to keep track of everything. Conceptually
# this just preprocesses the data into separate CSV files that correspond to temp tables in the DB. Basically the same
# approach at https://github.com/LibrariesHacked/openlibrary-search, but for my DB schema and
# with some tech debt from my hubris :).

import os
import typing
from pathlib import Path
from dotenv import load_dotenv
import psycopg
from pydantic import BaseModel
import gzip
from tqdm import tqdm
import json
from dateutil.parser import parse, ParserError
import csv

load_dotenv()

DATA_FILE = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_FILE.exists(), f"Open library data directory {DATA_FILE} does not exist"

DATA_OUT_DIR = Path(os.environ["DATA_OUT_DIR"])
if not DATA_OUT_DIR.exists():
    DATA_OUT_DIR.mkdir()

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]

def get_db_conn():
    return psycopg.connect(POSTGRES_CONN_URL)


class Writeable(BaseModel):
    def get_header(self):
        return list(self.model_fields.keys())

    def get_values(self):
        """
        Return values ready for postgres csv insertion - iterate through model fields, format arrays as {{}} instead of []
        """

        formatted_vals = []
        for field in self.model_fields:
            val = getattr(self, field)

            if isinstance(val, list):
                inner_vals = list(map(json.dumps, val))
                array_val = "{" + ",".join(inner_vals) + "}"
                formatted_vals.append(array_val)
            else:
                formatted_vals.append(val)

        return formatted_vals


class Book(Writeable):
    id: int
    ol_id: str
    title: str
    alternate_titles: list[str] | None
    dewey_numbers: list[str] | None
    lc_classifications: list[str] | None
    subtitle: str | None
    description: str | None


class Edition(Writeable):
    id: int
    ol_id: str
    book_id: int
    title: str
    covers: list[int] | None
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


class Subject(Writeable):
    id: int
    name: str
    subject_type: typing.Literal["topic", "place", "person", "time"]


class TableManager:

    def __init__(self,
                 out_file_path: Path):
        self.out_file_path = out_file_path
        self._curr_id = 0
        self._id_cache: dict[str, int] = {}
        self._is_first = True

    def __enter__(self):
        self.out_file = open(self.out_file_path, "w", encoding="utf-8")
        self.writer = csv.writer(
            self.out_file, quoting=csv.QUOTE_MINIMAL
        )
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.out_file.close()

    def get_id(self, key: str):
        if key in self._id_cache:
            return self._id_cache[key]

        self._curr_id += 1
        self._id_cache[key] = self._curr_id
        return self._curr_id

    def write(self, line: Writeable):
        if self._is_first:
            self.writer.writerow(line.get_header())
            self._is_first = False

        self.writer.writerow(line.get_values())


def first_or_none(line, val):
    if val in line and line[val]:
        return line[val][0]
    return None


def extract_text(line, val):
    if val in line and line[val]:
        raw_text = line[val]
        if isinstance(raw_text, str):
            return raw_text
        elif isinstance(raw_text, dict):
            return raw_text["value"]
        else:
            raise ValueError(f"Unexpected type {type(val)}, {val}")

    return None


def process_book_line(line_data, managers: dict[str, TableManager]) -> tuple[bool, bool]:
    book_manager = managers["/type/work"]

    if "title" not in line_data:
        return False, False

    book_ol_id = line_data["key"].split("/works/")[1]
    book_id = book_manager.get_id(book_ol_id)
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
    book_manager.write(book)
    return True, False


def process_edition_line(line_data, managers: dict[str, TableManager]) -> tuple[bool, bool]:
    edition_manager = managers["/type/edition"]
    book_manager = managers["/type/work"]

    if "works" not in line_data or len(line_data["works"]) == 0:
        return False, False

    if "title" not in line_data:
        return False, False

    edition_ol_id = line_data["key"].split("/books/")[1]
    work_id = line_data["works"][0]["key"]

    publish_date_raw = line_data.get("publish_date")
    publish_date = None
    if publish_date_raw:
        try:
            publish_date = parse(publish_date_raw).isoformat()
        except ParserError:
            return False, True
        # Really bushwhacking here lol
        except OverflowError:
            print(f"WTF we got an overflow error from the parser for the publish date: {publish_date_raw}")
            return False, True

    edition_id = edition_manager.get_id(edition_ol_id)
    book_id = book_manager.get_id(work_id)

    covers = None
    if "covers" in line_data and isinstance(line_data["covers"], list):
        covers = []
        for cover in line_data["covers"]:
            if isinstance(cover, int):
                covers.append(cover)
            elif cover is not None:
                print(f"Unexpected cover type {type(cover)}: {cover}")

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
        series=first_or_none(line_data, "series"),
        covers=covers
    )
    edition_manager.write(edition)
    return True, False



def main():
    print(f"Loading {DATA_FILE}")

    total = 0
    total_by_type = {}
    included_by_type = {}
    errors = 0

    with gzip.open(DATA_FILE) as in_file:
        with TableManager(DATA_OUT_DIR / "ol_books.csv") as book_manager:
            with TableManager(DATA_OUT_DIR / "ol_editions.csv") as edition_manager:
                with TableManager(DATA_OUT_DIR / "ol_subjects.csv") as subject_manager:
                    type_managers = {
                        "/type/work": book_manager,
                        "/type/edition": edition_manager,
                    }

                    type_processors = {
                        "/type/work": process_book_line,
                        "/type/edition": process_edition_line,
                    }

                    # We expect this to have ~100 million lines
                    for raw_line in tqdm(in_file, total=(100 * 1000 * 1000)):
                        try:
                            total += 1
                            line = raw_line.decode("utf-8").split("\t")
                            line_type = line[0]
                            total_by_type[line_type] += 1

                            if line_type in type_processors:
                                line_data = json.loads(line[-1])

                                included, was_error = type_processors[line_type](line_data, type_managers)
                                if was_error:
                                    errors += 1

                                if included:
                                    included_by_type[line_type] += 1
                        except Exception as e:
                            print(f"Unhandled exception {e}, processing line {line}")
                            print(e.args), e.with_traceback()
                            errors += 1

    print(f"Finished preprocessing queues - total records: {total}, errors: {errors}")
    with open("statistics.json", 'w') as stats_file:
        stats_file.write(json.dumps({
            "total": "total",
            "total_by_type": total_by_type,
            "included_by_type": included_by_type,
            "errors": errors
        }, indent=4, sort_keys=True))


if __name__ == "__main__":
    main()
