import os
from pathlib import Path
from dotenv import load_dotenv
import gzip
from tqdm import tqdm
import csv
import datetime

load_dotenv()

RATINGS_DATA_FILE = Path(os.environ["OL_DATA_DUMP_RATINGS_PATH"])
assert RATINGS_DATA_FILE.exists()

READING_LOG_DATA_FILE = Path(os.environ["OL_DATA_DUMP_READING_LOG_PATH"])
assert READING_LOG_DATA_FILE.exists()

DATA_OUT_DIR = Path(os.environ["DATA_OUT_DIR"])
assert DATA_OUT_DIR.exists()


def process_into_csv(in_file_path: Path, out_file_path: Path, header: list[str], process):
    with gzip.open(in_file_path, 'r') as fin:
        with open(out_file_path, 'w') as fout:
            writer = csv.writer(fout)
            writer.writerow(header)
            for raw_line in tqdm(fin):
                line = raw_line.decode("utf-8").strip()
                line_segments = line.split("\t")
                writer.writerow(process(line_segments))


def process_rating_line(line_segments: list):
    book, edition, rating_str, date = line_segments
    book_ol_id = book.split("/works/")[1]
    edition_ol_id = None
    if edition:
        edition_ol_id = edition.split("/books/")[1]
    rating = int(rating_str)
    # Make sure the date is in ISO format
    date = datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%Y-%m-%d")
    return book_ol_id, edition_ol_id, rating, date


def process_ratings():
    out_file_path = DATA_OUT_DIR / "ol_ratings.csv"
    process_into_csv(RATINGS_DATA_FILE, out_file_path, [
        "ol_book_id", "ol_edition_id", "rating", "date"
    ], process_rating_line)


def process_reading_list_line(line_segments: list):
    work, edition, status, date = line_segments
    work_ol_id = work.split("/works/")[1]
    edition_ol_id = None
    if edition:
        edition_ol_id = edition.split("/books/")[1]
    # Make sure the date is in ISO format
    date = datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%Y-%m-%d")
    return work_ol_id, edition_ol_id, status, date


def process_reading_list():
    out_file_path = DATA_OUT_DIR / "ol_reading_log_items.csv"
    process_into_csv(READING_LOG_DATA_FILE, out_file_path,
        ["ol_book_id", "ol_edition_id", "status", "date"],
                     process_reading_list_line)


if __name__ == "__main__":
    print("Processing ratings...")
    process_ratings()
    print("Processing reading_lists")
    process_reading_list()
