CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('0 0 * * 0', 'SELECT update_book_counts()', 'Update book counts');

CREATE INDEX IF NOT EXISTS book_authors_book_id_idx ON book_authors (book_id);
CREATE INDEX IF NOT EXISTS book_authors_author_id_idx ON book_authors (author_id);
