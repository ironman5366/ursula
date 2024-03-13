SET statement_timeout = '3h';
ALTER TABLE IF EXISTS books RENAME TO legacy_books;
ALTER TABLE IF EXISTS editions RENAME TO legacy_editions;
ALTER TABLE IF EXISTS authors RENAME TO legacy_authors;
ALTER TABLE IF EXISTS book_authors RENAME TO legacy_book_authors;

CREATE TABLE IF NOT EXISTS legacy_book_mappings (
    id SERIAL PRIMARY KEY,
    legacy_book_id INTEGER NOT NULL REFERENCES legacy_books (id),
    ol_book_id INTEGER NOT NULL REFERENCES ol_books (id)
);

CREATE INDEX IF NOT EXISTS legacy_book_mappings_legacy_book_id_idx ON legacy_book_mappings (legacy_book_id);
CREATE INDEX IF NOT EXISTS legacy_book_mappings_ol_book_id_idx ON legacy_book_mappings (ol_book_id);

INSERT INTO legacy_book_mappings (legacy_book_id, ol_book_id)
SELECT
    legacy_books.id AS legacy_book_id,
    ol_books.id AS ol_book_id
FROM ol_editions
INNER JOIN legacy_editions ON ol_editions.isbn_13_or_10 = legacy_editions.isbn_13_or_10
INNER JOIN ol_books ON ol_editions.book_id = ol_books.id
INNER JOIN legacy_books ON legacy_editions.book_id = legacy_books.id;
