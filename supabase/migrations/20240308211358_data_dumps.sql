CREATE TABLE IF NOT EXISTS ol_books (
    id SERIAL PRIMARY KEY,
    ol_id VARCHAR(255) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    alternate_titles TEXT [],
    dewey_numbers TEXT [],
    lc_classifications TEXT [],
    subtitle TEXT,
    description TEXT,
    covers INTEGER []
);

CREATE TABLE IF NOT EXISTS ol_editions (
    id SERIAL PRIMARY KEY,
    ol_id VARCHAR(255) NOT NULL UNIQUE,
    book_id INTEGER,
    title TEXT NOT NULL,
    subtitle TEXT,
    alternate_titles TEXT [],
    publish_places TEXT [],
    number_of_pages INTEGER,
    publish_date DATE,
    covers INTEGER [],
    isbn_10 VARCHAR(255),
    isbn_13 VARCHAR(255),
    lc_classifications TEXT [],
    series TEXT
);


CREATE TABLE IF NOT EXISTS ol_book_excerpts (
    id SERIAL PRIMARY KEY,
    book_id INTEGER,
    edition_id INTEGER,
    is_first_sentence BOOLEAN NOT NULL,
    excerpt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ol_book_links (
    id SERIAL PRIMARY KEY,
    book_id INTEGER,
    url TEXT NOT NULL,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    -- One of "topic", "person", "place", "time"
    subject_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS book_subjects (
    id SERIAL PRIMARY KEY,
    book_id INTEGER,
    subject_id INTEGER
);
