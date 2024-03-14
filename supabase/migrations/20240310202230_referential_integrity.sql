SET statement_timeout = '12h';
CREATE OR REPLACE PROCEDURE proc_batched_update(table_name text, get_total_query text, update_query text) AS $$
DECLARE affected_rows INTEGER;
    DECLARE total_rows INTEGER;
    DECLARE progress INTEGER;
BEGIN
    -- Get the total number of rows to be updated
    EXECUTE get_total_query INTO total_rows;

    RAISE NOTICE 'Total rows to update on %: %', table_name, total_rows;

    progress := 0;

    LOOP
        EXECUTE update_query;

        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        progress := progress + affected_rows;

        RAISE NOTICE 'Updated % rows in %, progress: %/%', affected_rows, table_name, progress, total_rows;

        COMMIT;

        EXIT WHEN affected_rows = 0;
    END LOOP;

    RAISE NOTICE 'Update completed. Total rows updated in %: %', table_name, progress;
END $$ LANGUAGE plpgsql;

ALTER TABLE ol_editions ADD COLUMN IF NOT EXISTS book_id integer;
CALL proc_batched_update(
    'ol_editions',
    'SELECT COUNT(*) FROM ol_editions WHERE book_id IS NULL',
    'WITH cte AS (
                SELECT ol_editions.id, book_ol_id
                FROM ol_editions
                JOIN ol_books ON ol_books.ol_id = ol_editions.book_ol_id
                WHERE ol_editions.book_id IS NULL
                LIMIT 50000
            )
            UPDATE ol_editions
            SET book_id = ol_books.id
            FROM cte
            JOIN ol_books ON ol_books.ol_id = book_ol_id
            WHERE ol_editions.id = cte.id;'
);

ALTER TABLE ol_book_authors ADD COLUMN IF NOT EXISTS book_id integer;
ALTER TABLE ol_book_authors ADD COLUMN IF NOT EXISTS author_id integer;

CALL proc_batched_update(
    'ol_book_authors', 'SELECT COUNT(*) FROM ol_book_authors WHERE book_id IS NULL',
    'WITH cte AS (
                SELECT ol_book_authors.id, book_ol_id, author_ol_id
                FROM ol_book_authors
                JOIN ol_books ON ol_books.ol_id = ol_book_authors.book_ol_id
                JOIN ol_authors ON ol_authors.ol_id = ol_book_authors.author_ol_id
                WHERE ol_book_authors.book_id IS NULL
                LIMIT 50000
            )
            UPDATE ol_book_authors
            SET book_id = ol_books.id, author_id = ol_authors.id
            FROM cte
            JOIN ol_books ON ol_books.ol_id = book_ol_id
            JOIN ol_authors ON ol_authors.ol_id = author_ol_id
            WHERE ol_book_authors.id = cte.id;'
);

CALL proc_batched_update(
    'ol_book_authors', 'SELECT COUNT(*) FROM ol_book_authors WHERE author_id IS NULL',
    'WITH cte AS (
                SELECT ol_book_authors.id, author_ol_id
                FROM ol_book_authors
                JOIN ol_authors ON ol_authors.ol_id = ol_book_authors.author_ol_id
                WHERE ol_book_authors.author_id IS NULL
                LIMIT 50000
            )
            UPDATE ol_book_authors
            SET author_id = ol_authors.id
            FROM cte
            JOIN ol_authors ON ol_authors.ol_id = author_ol_id
            WHERE ol_book_authors.id = cte.id;'
);

ALTER TABLE edition_genres ADD COLUMN IF NOT EXISTS edition_id integer;
ALTER TABLE edition_genres ADD COLUMN IF NOT EXISTS genre_id integer;

UPDATE edition_genres SET edition_id = (SELECT ol_editions.id FROM ol_editions WHERE ol_editions.ol_id = edition_genres.edition_ol_id) WHERE edition_genres.edition_id IS NULL;
UPDATE edition_genres SET genre_id = (SELECT genres.id FROM genres WHERE genres.name = edition_genres.genre_name) WHERE edition_genres.genre_id IS NULL;

ALTER TABLE book_subjects ADD COLUMN IF NOT EXISTS book_id integer;
ALTER TABLE book_subjects ADD COLUMN IF NOT EXISTS subject_id integer;

UPDATE book_subjects SET book_id = (SELECT ol_books.id FROM ol_books WHERE ol_books.ol_id = book_subjects.book_ol_id) WHERE book_subjects.book_id IS NULL;
UPDATE book_subjects SET subject_id = (SELECT subjects.id FROM subjects WHERE subjects.name = book_subjects.subject_name) WHERE book_subjects.subject_id IS NULL;

-- Now a DO block that checks if the foreign keys exist and if not, creates them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ol_editions_book_id_fkey') THEN
    ALTER TABLE ol_editions ADD FOREIGN KEY (book_id) REFERENCES ol_books (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ol_book_authors_book_id_fkey') THEN
    ALTER TABLE ol_book_authors ADD FOREIGN KEY (book_id) REFERENCES ol_books (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ol_book_authors_author_id_fkey') THEN
    ALTER TABLE ol_book_authors ADD FOREIGN KEY (author_id) REFERENCES ol_authors (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'edition_genres_edition_id_fkey') THEN
    ALTER TABLE edition_genres ADD FOREIGN KEY (edition_id) REFERENCES ol_editions (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'edition_genres_genre_id_fkey') THEN
    ALTER TABLE edition_genres ADD FOREIGN KEY (genre_id) REFERENCES genres (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_subjects_book_id_fkey') THEN
    ALTER TABLE book_subjects ADD FOREIGN KEY (book_id) REFERENCES ol_books (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_subjects_subject_id_fkey') THEN
    ALTER TABLE book_subjects ADD FOREIGN KEY (subject_id) REFERENCES subjects (id);
  END IF;
END$$;

-- Create a generated column that's isbn 13 OR 10
ALTER TABLE ol_editions ADD COLUMN IF NOT EXISTS isbn_13_or_10 text GENERATED ALWAYS AS (coalesce(isbn_13, isbn_10)) STORED;
-- Put an index on it
CREATE INDEX IF NOT EXISTS ol_editions_isbn_13_or_10_idx ON ol_editions (isbn_13_or_10);

-- Do the same thing for editions
ALTER TABLE editions ADD COLUMN IF NOT EXISTS isbn_13_or_10 text GENERATED ALWAYS AS (coalesce(isbn_13, isbn_10)) STORED;
CREATE INDEX IF NOT EXISTS editions_isbn_13_or_10_idx ON editions (isbn_13_or_10);
