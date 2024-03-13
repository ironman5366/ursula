ALTER TABLE ol_reading_log_items ADD COLUMN IF NOT EXISTS book_id INTEGER REFERENCES books (id);
ALTER TABLE ol_reading_log_items ADD COLUMN IF NOT EXISTS edition_id INTEGER REFERENCES editions (id);
ALTER TABLE ol_ratings ADD COLUMN IF NOT EXISTS book_id INTEGER REFERENCES books (id);
ALTER TABLE ol_ratings ADD COLUMN IF NOT EXISTS edition_id INTEGER REFERENCES editions (id);

UPDATE ol_reading_log_items SET book_id = (SELECT books.id FROM books WHERE books.ol_id = ol_reading_log_items.book_id LIMIT 1) WHERE ol_reading_log_items.book_id IS NULL;
UPDATE ol_reading_log_items SET edition_id = (SELECT editions.id FROM editions WHERE editions.ol_id = ol_reading_log_items.edition_id) WHERE ol_reading_log_items.edition_id IS NULL AND ol_reading_log_items.ol_edition_id IS NOT NULL;

UPDATE ol_ratings SET book_id = (SELECT books.id FROM books WHERE books.ol_id = ol_ratings.book_id LIMIT 1) WHERE ol_ratings.book_id IS NULL;
UPDATE ol_ratings SET edition_id = (SELECT editions.id FROM editions WHERE editions.ol_id = ol_ratings.edition_id) WHERE ol_ratings.edition_id IS NULL AND ol_ratings.ol_edition_id IS NOT NULL;
