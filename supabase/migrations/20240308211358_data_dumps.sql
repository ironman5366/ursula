CREATE TABLE IF NOT EXISTS ol_books (
    id SERIAL PRIMARY KEY,
    ol_id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    alternate_titles TEXT [],
    dewey_numbers VARCHAR(255) [],
    lc_classifications VARCHAR(255) [],
    subtitle VARCHAR(255),
    description TEXT
);

CREATE TABLE IF NOT EXISTS ol_book_editions (
    id SERIAL PRIMARY KEY,
    ol_id VARCHAR(255) NOT NULL UNIQUE,
    book_id INTEGER REFERENCES ol_books (id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    alternate_titles TEXT [],
    publish_places VARCHAR(255) [],
    number_of_pages INTEGER,
    publish_date DATE,
    covers INTEGER,
    isbn_10 VARCHAR(255),
    isbn_13 VARCHAR(255),
    lc_classifications VARCHAR(255) [],
    series VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS ol_book_excerpts (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES ol_books (id) NOT NULL,
    edition_id INTEGER REFERENCES ol_book_editions (id),
    is_first_sentence BOOLEAN NOT NULL,
    excerpt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ol_book_links (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES ol_books (id) NOT NULL,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    -- One of "topic", "person", "place", "time"
    subject_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS book_subjects (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES ol_books (id) NOT NULL,
    subject_id INTEGER REFERENCES subjects (id) NOT NULL
);
