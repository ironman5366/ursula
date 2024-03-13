# Data Scripts

This directory contains ETL scripts for downloading and processing the data dumps from Open Library, which
you can find at https://openlibrary.org/developers/dumps.

The current state is a bit of a mess (as is the OL data), so if you're interested in using or referencing any of this,
please don't hesitate to reach out to me for help. The basics:

- Preprocess scripts process data into cleaned CSV files - there are two -
  - `preprocess_main` for all the data in the the main dump file
  - `preprocess_extras` for ratings and reading log (used to compute book popularity and sift through the messy data)
- CSVs are bulk uploaded with `upload.py` and `copy_from_csv.sh`
- Data is processed and linked in the database with SQL migrations back in the main app

`preprocess_main.py` has some tech debt from an initial version which also aimed to upload the data directly, and isn't
the best reference - if you're interested in processing OpenLibrary data from scratch, I'd recommend a method closer to
what's done in https://github.com/LibrariesHacked/openlibrary-search - keep the preprocessing as minimal as possible
in Python, and do the heavy lifting in SQL.

You can also look at `preprocess_extras`, which was made after I learned my lesson from the first pass, and takes a
much lighter approach.

If you want to run this code directly:

- `cp .env.example .env`
- (...setup your .env file)
- `pipenv install`
- `pipenv shell`
- (whatever script you want to run)
