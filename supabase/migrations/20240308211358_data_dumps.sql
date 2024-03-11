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

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

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

CREATE TABLE IF NOT EXISTS book_subjects (
    id SERIAL PRIMARY KEY,
    book_ol_id INTEGER,
    subject_name TEXT
);
