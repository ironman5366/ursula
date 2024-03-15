ALTER TABLE books ADD COLUMN IF NOT EXISTS book_key TEXT;

CALL proc_batched_update(
    'books',
    'SELECT COUNT(*) FROM books WHERE book_key IS NULL',
    'WITH batch AS (
       SELECT id
       FROM books
       WHERE book_key IS NULL
       ORDER BY id
       LIMIT 100000
   )
   UPDATE books b
   SET book_key = (
       SELECT STRING_AGG(a.name, ''::'' ORDER BY a.name) || ''::'' || b.title
       FROM book_authors ba
       JOIN authors a ON ba.author_id = a.id
       WHERE b.id = ba.book_id
   )
   WHERE b.id IN (SELECT id FROM batch);'
);

-- Create a dedup_books table with the same schema as books
--
CREATE TABLE dedup_books AS SELECT * FROM books WHERE 1 = 0; -- noqa
