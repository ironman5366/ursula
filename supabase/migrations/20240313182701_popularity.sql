SET statement_timeout = '12h';

ALTER TABLE books ADD COLUMN IF NOT EXISTS reading_count INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS popularity INTEGER GENERATED ALWAYS AS (reading_count + rating_count) STORED;

ALTER TABLE ol_reading_log_items ADD COLUMN IF NOT EXISTS book_id INTEGER REFERENCES books (id);
ALTER TABLE ol_reading_log_items ADD COLUMN IF NOT EXISTS edition_id INTEGER REFERENCES editions (id);
ALTER TABLE ol_ratings ADD COLUMN IF NOT EXISTS book_id INTEGER REFERENCES books (id);
ALTER TABLE ol_ratings ADD COLUMN IF NOT EXISTS edition_id INTEGER REFERENCES editions (id);

UPDATE ol_reading_log_items SET book_id = (SELECT books.id FROM books WHERE books.ol_id = ol_reading_log_items.ol_book_id LIMIT 1) WHERE ol_reading_log_items.book_id IS NULL;
UPDATE ol_reading_log_items SET edition_id = (SELECT editions.id FROM editions WHERE editions.ol_id = ol_reading_log_items.ol_edition_id LIMIT 1) WHERE ol_reading_log_items.edition_id IS NULL AND ol_reading_log_items.ol_edition_id IS NOT NULL;

UPDATE ol_ratings SET book_id = (SELECT books.id FROM books WHERE books.ol_id = ol_ratings.ol_book_id LIMIT 1) WHERE ol_ratings.book_id IS NULL;
UPDATE ol_ratings SET edition_id = (SELECT editions.id FROM editions WHERE editions.ol_id = ol_ratings.ol_edition_id LIMIT 1) WHERE ol_ratings.edition_id IS NULL AND ol_ratings.ol_edition_id IS NOT NULL;

CREATE OR REPLACE FUNCTION update_book_counts() RETURNS VOID AS $$
BEGIN
    UPDATE books b
    SET
        reading_count = (SELECT COUNT(*) FROM ol_reading_log_items WHERE book_id = b.id),
        rating_count = (SELECT COUNT(*) FROM ol_ratings WHERE book_id = b.id);
END;
$$ LANGUAGE plpgsql;

SELECT update_book_counts();

CREATE OR REPLACE FUNCTION search_book_titles(search_text TEXT)
RETURNS TABLE (book BOOKS, rank DOUBLE PRECISION)
LANGUAGE sql
AS $$
SELECT book, ts_rank(to_tsvector('english', book.title), plainto_tsquery('english', search_text)) AS rank
FROM books book
WHERE to_tsvector('english', book.title) @@ plainto_tsquery('english', search_text)
ORDER BY book.popularity DESC, rank DESC LIMIT 30;
$$;
