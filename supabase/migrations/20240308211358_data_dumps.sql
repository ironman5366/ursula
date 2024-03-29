CREATE TABLE IF NOT EXISTS ol_files_uploaded (
    id SERIAL PRIMARY KEY,
    file_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ol_books (
    id SERIAL PRIMARY KEY,
    ol_id VARCHAR(255) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    alternate_titles TEXT [],
    dewey_numbers TEXT [],
    lc_classifications TEXT [],
    subtitle TEXT,
    description TEXT,
    covers INTEGER [],
    excerpts TEXT [],
    links JSONB
);
CREATE INDEX IF NOT EXISTS ol_books_ol_id_idx ON ol_books (ol_id);


CREATE TABLE IF NOT EXISTS ol_reading_log_items (
    id SERIAL PRIMARY KEY,
    ol_book_id VARCHAR(255) NOT NULL,
    ol_edition_id VARCHAR(255),
    status TEXT NOT NULL,
    date DATE
);

CREATE INDEX IF NOT EXISTS ol_reading_log_items_ol_book_id_idx ON ol_reading_log_items (ol_book_id);
CREATE INDEX IF NOT EXISTS ol_reading_log_items_ol_edition_id_idx ON ol_reading_log_items (ol_edition_id);

CREATE TABLE IF NOT EXISTS ol_ratings (
    id SERIAL PRIMARY KEY,
    ol_book_id VARCHAR(255) NOT NULL,
    ol_edition_id VARCHAR(255),
    rating INTEGER NOT NULL,
    date DATE
);

CREATE INDEX IF NOT EXISTS ol_ratings_ol_book_id_idx ON ol_ratings (ol_book_id);


CREATE TABLE IF NOT EXISTS ol_editions (
    id SERIAL PRIMARY KEY,
    ol_id VARCHAR(255) NOT NULL UNIQUE,
    book_ol_id VARCHAR(255),
    title TEXT NOT NULL,
    subtitle TEXT,
    alternate_titles TEXT [],
    publish_places TEXT [],
    number_of_pages INTEGER,
    publish_date DATE,
    covers INTEGER [],
    isbn_10 VARCHAR(10),
    isbn_13 VARCHAR(13),
    lc_classifications TEXT [],
    series TEXT
);

CREATE INDEX IF NOT EXISTS ol_editions_ol_id_idx ON ol_editions (ol_id);

CREATE TABLE IF NOT EXISTS ol_book_authors (
    id SERIAL PRIMARY KEY,
    book_ol_id VARCHAR(255),
    author_ol_id VARCHAR(255),
    role TEXT,
    as_what TEXT
);


CREATE TABLE IF NOT EXISTS ol_authors (
    id SERIAL PRIMARY KEY,
    ol_id VARCHAR(255) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    eastern_order BOOL,
    personal_name TEXT,
    enumeration TEXT,
    title TEXT,
    alternate_names TEXT [],
    bio TEXT,
    location TEXT,
    birth_date DATE,
    death_date DATE,
    photos INTEGER []
);

CREATE INDEX IF NOT EXISTS ol_authors_ol_id_idx ON ol_authors (ol_id);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS genres_name_idx ON genres (name);

CREATE TABLE IF NOT EXISTS edition_genres (
    id SERIAL PRIMARY KEY,
    edition_ol_id VARCHAR(255),
    genre_name TEXT
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    -- One of "topic", "person", "place", "time"
    subject_type VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS subjects_name_idx ON subjects (name);

CREATE TABLE IF NOT EXISTS book_subjects (
    id SERIAL PRIMARY KEY,
    book_ol_id VARCHAR(255),
    subject_name TEXT
);
