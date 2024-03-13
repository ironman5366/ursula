ALTER TABLE IF EXISTS books RENAME TO legacy_books;
ALTER TABLE IF EXISTS editions RENAME TO legacy_editions;
ALTER TABLE IF EXISTS authors RENAME TO legacy_authors;

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


-- These indexes are expensive and we don't need them anymore
DROP INDEX IF EXISTS ol_editions_isbn_10_idx;
DROP INDEX IF EXISTS ol_editions_isbn_13_idx;

-- Change the foreign keys
ALTER TABLE reading_list_items ADD COLUMN IF NOT EXISTS ol_book_id INTEGER REFERENCES ol_books (id);
UPDATE reading_list_items SET ol_book_id = (SELECT legacy_book_mappings.ol_book_id FROM legacy_book_mappings WHERE legacy_book_mappings.legacy_book_id = reading_list_items.book_id) WHERE reading_list_items.ol_book_id IS NULL;

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ol_book_id INTEGER REFERENCES ol_books (id);
UPDATE reviews SET ol_book_id = (SELECT legacy_book_mappings.ol_book_id FROM legacy_book_mappings WHERE legacy_book_mappings.legacy_book_id = reviews.book_id) WHERE reviews.ol_book_id IS NULL;
