#!/usr/bin/env python3

# Note for the reader: this script is way overcomplicated because this originally also tried to manage inserting into
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
import traceback
from collections import defaultdict

load_dotenv()

DATA_FILE = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_FILE.exists(), f"Open library data directory {DATA_FILE} does not exist"

DATA_OUT_DIR = Path(os.environ["DATA_OUT_DIR"])
if not DATA_OUT_DIR.exists():
    DATA_OUT_DIR.mkdir()

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]

# Only 1 million lines per each CSV file
CHUNK_MAX_ROWS = 1000 * 1000 * 1

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
    ol_id: str
    title: str
    alternate_titles: list[str] | None
    dewey_numbers: list[str] | None
    lc_classifications: list[str] | None
    subtitle: str | None
    description: str | None
    covers: list[int] | None
    excerpts: list[str] | None
    # A JSON blob of a list of links
    links: str | None

class Edition(Writeable):
    ol_id: str
    book_ol_id: str
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
    name: str
    subject_type: typing.Literal["topic", "place", "person", "time"]


class BookSubject(Writeable):
    book_ol_id: str
    subject_name: str


class Genre(Writeable):
    name: str


class EditionGenre(Writeable):
    edition_ol_id: str
    genre_name: str


class Author(Writeable):
    ol_id: str
    name: str
    eastern_order: bool | None
    personal_name: str | None
    enumeration: str | None
    title: str | None
    alternate_names: list[str] | None
    bio: str | None
    location: str | None
    birth_date: str | None
    death_date: str | None
    photos: list[int] | None


class BookAuthor(Writeable):
    book_ol_id: str
    author_ol_id: str
    role: str | None
    as_what: str | None


class TableManager:

    def __init__(self,
                 out_file_path: Path):
        self.out_file_path = out_file_path
        self._curr_id = 0
        self.key_cache = {}
        self._chunk_line_count = 0
        self._chunk_number = 0

    def _open_chunk(self):
        # Split the extension out of out_file and add the chunk number
        out_file_name = self.out_file_path.stem
        out_file_ext = self.out_file_path.suffix
        chunk_path = self.out_file_path.with_name(f"{out_file_name}.{self._chunk_number}{out_file_ext}")

        self._out_file = open(chunk_path, "w", encoding="utf-8")
        self._chunk_line_count = 0
        self._chunk_number += 1
        self._writer = csv.writer(
            self._out_file, quoting=csv.QUOTE_MINIMAL
        )

    def _close_chunk(self):
        self._out_file.close()

    def __enter__(self):
        self._open_chunk()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._close_chunk()

    def write(self, line: Writeable):
        if self._chunk_line_count == 0:
            self._writer.writerow(line.get_header())

        self._chunk_line_count += 1
        self._writer.writerow(line.get_values())

        if self._chunk_line_count >= CHUNK_MAX_ROWS:
            self._close_chunk()
            self._open_chunk()


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


def process_book_subjects(book_ol_id: str, subjects_list: list[str] | None, subject_type: str, subject_manager: TableManager, book_subject_manager: TableManager, **kwargs):
    if not subjects_list:
        return

    for subject_raw in subjects_list:
        if not subject_raw:
            continue

        # Check whether the subject manager already has this subject
        if subject_raw not in subject_manager.key_cache:
            subject = Subject(
                name=subject_raw,
                subject_type=subject_type
            )
            subject_manager.write(subject)
            subject_manager.key_cache[subject_raw] = True

        book_subject_key = f"{book_ol_id}-{subject_raw}"
        if book_subject_key in book_subject_manager.key_cache:
            continue
        else:
            book_subject_manager.key_cache[book_subject_key] = True
            book_subject = BookSubject(
                book_ol_id=book_ol_id,
                subject_name=subject_raw
            )
            book_subject_manager.write(book_subject)


def extract_image_ids(image_ids_raw):
    if image_ids_raw and isinstance(image_ids_raw, list):
        image_ids = []
        for image_id in image_ids_raw:
            if isinstance(image_id, int):
                image_ids.append(image_id)
            elif image_id is not None:
                print(f"Unexpected image ID type {type(image_id)}: {image_id}")
        return image_ids


def parse_isbn(isbn_raw: str | None,
               numbers: int) -> str | None:
    if not isbn_raw:
        return

    isbn_str = ""
    for ch in isbn_raw:
        if ch.isdigit():
            isbn_str += ch

    if len(isbn_str) == numbers:
        return isbn_str

def parse_date(date_raw: str) -> str | None:
    if date_raw:
        try:
            parsed_date = parse(date_raw)
            return parsed_date.strftime("%Y-%m-%d")
        except (ParserError, OverflowError):
            return None
    return None


def process_book_line(line_data, book_manager, book_author_manager, **kwargs) -> tuple[bool, bool]:
    if "title" not in line_data:
        return False, False

    book_ol_id = line_data["key"].split("/works/")[1]

    excerpts = None
    if "first_sentence" in line_data:
        excerpts = [extract_text(line_data, "first_sentence")]

    if "excerpts" in line_data:
        if excerpts is None:
            excerpts = []
        for excerpt in line_data["excerpts"]:
            excerpts.append(extract_text(excerpt, "excerpt"))

    links = None
    if "links" in line_data:
        links = json.dumps(line_data["links"])

    book = Book(
        ol_id=book_ol_id,
        title=line_data["title"],
        alternate_titles=line_data.get("alternate_titles"),
        dewey_numbers=line_data.get("dewey_decimal_class"),
        lc_classifications=line_data.get("lc_classifications"),
        subtitle=line_data.get("subtitle"),
        description=extract_text(line_data, "description"),
        covers=extract_image_ids(line_data.get("covers")),
        excerpts=excerpts,
        links=links
    )
    book_manager.write(book)

    if "authors" in line_data:
        for author_role in line_data["authors"]:

            if "author" not in author_role:
                continue

            author = author_role["author"]
            if isinstance(author, str):
                continue

            author_ol_id = author["key"].split("/authors/")[1]

            book_author_key = f"{book_ol_id}-{author_ol_id}"
            if book_author_key in book_author_manager.key_cache:
                continue

            book_author_manager.key_cache[book_author_key] = True
            book_author = BookAuthor(
                book_ol_id=book_ol_id,
                author_ol_id=author_ol_id,
                role=author.get("role"),
                as_what=author.get("as")
            )
            book_author_manager.write(book_author)

    if "subjects" in line_data:
        process_book_subjects(book_ol_id, line_data["subjects"], "topic", **kwargs)

    if "subject_places" in line_data:
        process_book_subjects(book_ol_id, line_data["subject_places"], "place", **kwargs)

    if "subject_people" in line_data:
        process_book_subjects(book_ol_id, line_data["subject_people"], "person", **kwargs)

    if "subject_times" in line_data:
        process_book_subjects(book_ol_id, line_data["subject_times"], "time", **kwargs)


    return True, False


def process_edition_genres(
        genres: list[str] | None,
        edition_ol_id: str,
        genre_manager: TableManager,
        edition_genre_manager: TableManager,
        **kwargs,
):
    if not genres:
        return

    for genre_raw in genres:
        if not genre_raw:
            continue

        # Check whether the genre manager already has this genre
        if genre_raw not in genre_manager.key_cache:
            genre = Genre(
                name=genre_raw
            )
            genre_manager.write(genre)
            genre_manager.key_cache[genre_raw] = True

        genre_edition_key = f"{edition_ol_id}-{genre_raw}"
        if genre_edition_key in edition_genre_manager.key_cache:
            continue
        else:
            edition_genre_manager.key_cache[genre_edition_key] = True
            genre_edition = EditionGenre(
                edition_ol_id=edition_ol_id,
                genre_name=genre_raw
            )
            edition_genre_manager.write(genre_edition)

def process_edition_line(line_data, book_manager, edition_manager, **kwargs) -> tuple[bool, bool]:
    if "works" not in line_data or len(line_data["works"]) == 0:
        return False, True

    if "title" not in line_data:
        return False, True

    edition_ol_id = line_data["key"].split("/books/")[1]
    book_ol_id = line_data["works"][0]["key"].split("/works/")[1]

    publish_date_raw = line_data.get("publish_date")
    publish_date = None
    if publish_date_raw:
        publish_date = parse_date(publish_date_raw)

    edition = Edition(
        ol_id=edition_ol_id,
        book_ol_id=book_ol_id,
        title=line_data["title"],
        subtitle=line_data.get("subtitle"),
        alternate_titles=line_data.get("alternate_titles"),
        publish_places=line_data.get("publish_places"),
        number_of_pages=line_data.get("number_of_pages"),
        publish_date=publish_date,
        isbn_10=parse_isbn(first_or_none(line_data, "isbn_10"), 10),
        isbn_13=parse_isbn(first_or_none(line_data, "isbn_13"), 13),
        lc_classifications=line_data.get("lc_classifications"),
        series=first_or_none(line_data, "series"),
        covers=extract_image_ids(line_data.get("covers"))
    )
    edition_manager.write(edition)

    if "genres" in line_data:
        process_edition_genres(line_data["genres"], edition_ol_id, **kwargs)

    return True, False

def process_author_line(line_data, author_manager, **kwargs) -> tuple[bool, bool]:
    if "name" not in line_data:
        return False, True

    if "key" not in line_data:
        return False, True

    author_ol_id = line_data["key"].split("/authors/")[1]

    author = Author(
        ol_id=author_ol_id,
        name=line_data["name"],
        eastern_order=line_data.get("eastern_order"),
        personal_name=line_data.get("personal_name"),
        enumeration=line_data.get("enumeration"),
        title=line_data.get("title"),
        alternate_names=line_data.get("alternate_names"),
        bio=extract_text(line_data, "bio"),
        location=line_data.get("location"),
        birth_date=parse_date(line_data.get("birth_date")),
        death_date=parse_date(line_data.get("death_date")),
        photos=extract_image_ids(line_data.get("photos"))
    )
    author_manager.write(author)

    return True, False

# Useful for testing, pass in a limit to only process a certain number of lines
LIMIT = None

def process(**kwargs):
    print(f"Loading {DATA_FILE}")

    total = 0
    total_by_type = defaultdict(int)
    included_by_type = defaultdict(int)
    errors = 0

    with gzip.open(DATA_FILE) as in_file:

        type_processors = {
            "/type/work": process_book_line,
            "/type/edition": process_edition_line,
            "/type/author": process_author_line
        }

        # We expect this to have ~100 million lines
        for raw_line in tqdm(in_file, total=(LIMIT or 100 * 1000 * 1000)):
            try:
                total += 1
                line = raw_line.decode("utf-8").split("\t")
                line_type = line[0]
                total_by_type[line_type] += 1

                if line_type in type_processors:
                    line_data = json.loads(line[-1])

                    included, was_error = type_processors[line_type](line_data, **kwargs)
                    if was_error:
                        errors += 1

                    if included:
                        included_by_type[line_type] += 1
            except Exception as e:
                print(f"Unhandled exception {e}, processing line {line}")
                print(e.args)
                traceback.print_exception(e)
                errors += 1

            if LIMIT:
                if total >= LIMIT:
                    print(f"Done - reached limit of {LIMIT}")
                    break

    print(f"Finished preprocessing - total records: {total}, errors: {errors}")
    with open("statistics.json", 'w') as stats_file:
        stats_file.write(json.dumps({
            "total": "total",
            "total_by_type": total_by_type,
            "included_by_type": included_by_type,
            "errors": errors
        }, indent=4, sort_keys=True))

def main():
    # Note: the copy_from_csv scripts expect these filenames to correspond to table names
    with TableManager(DATA_OUT_DIR / "ol_books.csv") as book_manager:
        with TableManager(DATA_OUT_DIR / "ol_editions.csv") as edition_manager:
            with TableManager(DATA_OUT_DIR / "subjects.csv") as subject_manager:
                with TableManager(DATA_OUT_DIR / "book_subjects.csv") as book_subject_manager:
                    with TableManager(DATA_OUT_DIR / "genres.csv") as genre_manager:
                        with TableManager(DATA_OUT_DIR / "edition_genres.csv") as edition_genre_manager:
                            with TableManager(DATA_OUT_DIR / "ol_authors.csv") as author_manager:
                                with TableManager(DATA_OUT_DIR / "ol_book_authors.csv") as book_author_manager:
                                    process(
                                        book_manager=book_manager,
                                        edition_manager=edition_manager,
                                        subject_manager=subject_manager,
                                        book_subject_manager=book_subject_manager,
                                        genre_manager=genre_manager,
                                        edition_genre_manager=edition_genre_manager,
                                        author_manager=author_manager,
                                        book_author_manager=book_author_manager
                                    )


if __name__ == "__main__":
    main()
