SET statement_timeout = 0;

SELECT delete_bs_author('OL2964716A'); -- Spark notes
SELECT delete_bs_author('OL946459A'); -- perry moore

ALTER TABLE books ADD COLUMN IF NOT EXISTS extended_search_name TEXT;
CREATE INDEX IF NOT EXISTS idx_fts_extended_search_name ON books USING gin (to_tsvector('english', extended_search_name));

CREATE OR REPLACE FUNCTION update_book_search_name(update_book_id INT) RETURNS BOOKS AS $$
UPDATE books
SET extended_search_name =
        books.title || ' ' || (SELECT string_agg(authors.name, ', ')
   FROM books JOIN book_authors ON books.id = book_authors.book_id JOIN authors ON book_authors.author_id = authors.id WHERE books.id = update_book_id)  || ' '|| COALESCE(books.subtitle, '')
WHERE books.id = update_book_id;
$$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION update_all_book_search_names() RETURNS VOID AS $$
UPDATE books
SET extended_search_name = books.title || ' ' ||
                           (SELECT string_agg(authors.name, ', ')
                            FROM book_authors
                                     JOIN authors ON book_authors.author_id = authors.id
                            WHERE book_authors.book_id = books.id) || ' ' ||
       COALESCE(books.subtitle, '')
$$ LANGUAGE sql;

SELECT cron.schedule('update-book-search-name', '0 0 * * 0', 'SET statement_timeout = 0; SELECT update_all_book_search_names()');

ALTER TABLE books ADD COLUMN IF NOT EXISTS last_reified_at TIMESTAMP DEFAULT NULL;
ALTER TABLE books ADD COLUMN IF NOT EXISTS editions_count INTEGER DEFAULT 0;

-- Change the column popularity to be a generated reading_count + rating_count + editions_count
ALTER TABLE books ADD COLUMN IF NOT EXISTS popularity_new INTEGER GENERATED ALWAYS AS (reading_count + rating_count + editions_count) STORED;

CREATE OR REPLACE FUNCTION update_book_counts() RETURNS VOID AS $$
BEGIN
    UPDATE books b
    SET
        reading_count = (SELECT COUNT(*) FROM ol_reading_log_items WHERE book_id = b.id),
        rating_count = (SELECT COUNT(*) FROM ol_ratings WHERE book_id = b.id),
        editions_count = (SELECT COUNT(*) FROM editions WHERE book_id = b.id);
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('update-book-counts', '30 20 * * 4', 'SET statement_timeout = 0; SELECT update_book_counts();');
