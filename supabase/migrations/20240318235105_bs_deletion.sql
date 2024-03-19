-- High statement timeout
SET statement_timeout = '3h';

-- We need these indexes for this deletion to be performant
CREATE INDEX IF NOT EXISTS ol_reading_log_items_edition_id_idx ON ol_reading_log_items (edition_id);
CREATE INDEX IF NOT EXISTS ol_ratings_edition_id_idx ON ol_ratings (edition_id);

CREATE INDEX IF NOT EXISTS book_subjects_book_id_idx ON book_subjects (book_id);
CREATE INDEX IF NOT EXISTS book_subjects_subject_id_idx ON book_subjects (subject_id);


-- Delete all books associated with the author 'OL8497983A' via the book_authors table
CREATE OR REPLACE FUNCTION delete_bs_author(delete_ol_id text) RETURNS void AS $$
DECLARE
    delete_author_id integer;
    books_to_delete integer[];
    editions_to_delete integer[];
    books_affected integer := 0;
    editions_affected integer := 0;
    book_authors_affected integer := 0;
    authors_affected integer := 0;
    reading_log_items_affected integer := 0;
    ratings_affected integer := 0;
    subjects_affected integer := 0;
BEGIN
    -- Find the author id with that OL id
    SELECT id INTO delete_author_id FROM authors WHERE ol_id = delete_ol_id;

    -- If the author is not found, raise a notice and exit the function
    IF delete_author_id IS NULL THEN
        RAISE NOTICE 'Author with OL ID % not found', delete_ol_id;
        RETURN;
    END IF;

    RAISE NOTICE 'Deleting all records associated with %s (authors ID = %s)', delete_ol_id, delete_author_id;

    -- Get the list of book IDs associated with the author
    SELECT array_agg(book_id) INTO books_to_delete FROM book_authors WHERE author_id = delete_author_id;
    SELECT array_agg(id) INTO editions_to_delete FROM editions WHERE book_id = ANY(books_to_delete);

    -- Log the number of books to be deleted
    RAISE NOTICE 'Books to be deleted: %', array_length(books_to_delete, 1);

    -- Delete reading log items associated with the books
    WITH deleted_reading_log_items AS (
        DELETE FROM ol_reading_log_items WHERE book_id = ANY(books_to_delete) OR edition_id=ANY(editions_to_delete)
            RETURNING *
    ) SELECT count(*) INTO reading_log_items_affected FROM deleted_reading_log_items;

    RAISE NOTICE 'Deleted % reading log items', reading_log_items_affected;

    -- Delete ratings associated with the books
    WITH deleted_ratings AS (
        DELETE FROM ol_ratings WHERE book_id = ANY(books_to_delete) or edition_id=ANY(editions_to_delete)
            RETURNING *
    ) SELECT count(*) INTO ratings_affected FROM deleted_ratings;

    RAISE NOTICE 'Deleted % ratings', ratings_affected;

    -- Delete editions associated with the books
    WITH deleted_editions AS (
        DELETE FROM editions WHERE id = ANY(editions_to_delete)
            RETURNING *
    ) SELECT count(*) INTO editions_affected FROM deleted_editions;

    RAISE NOTICE 'Deleted % editions', editions_affected;

    -- Delete the subjects associated with the books
    WITH deleted_subjects AS (
        DELETE FROM book_subjects WHERE book_id = ANY(books_to_delete)
            RETURNING *
    ) SELECT count(*) INTO subjects_affected FROM deleted_subjects;

    -- Delete book_authors entries for the author
    WITH deleted_book_authors AS (
        DELETE FROM book_authors WHERE book_id = ANY(books_to_delete)
            RETURNING *
    ) SELECT count(*) INTO book_authors_affected FROM deleted_book_authors;
    RAISE NOTICE 'Deleted % book_authors entries', book_authors_affected;

    -- Delete the books
    WITH deleted_books AS (
        DELETE FROM books WHERE id = ANY(books_to_delete)
            RETURNING *
    ) SELECT count(*) INTO books_affected FROM deleted_books;

    RAISE NOTICE 'Deleted % books', books_affected;

    -- Delete the author
    WITH deleted_authors AS (
        DELETE FROM authors WHERE id = delete_author_id
            RETURNING *
    ) SELECT count(*) INTO authors_affected FROM deleted_authors;
    RAISE NOTICE 'Deleted % authors', authors_affected;

    RAISE NOTICE 'Finished!';
END;
$$ LANGUAGE plpgsql;

-- These are authors who we want NOTHING by - if they're associated with anything, nuke it from the database
SELECT delete_bs_author('OL9615339A'); -- IRB media, just summaries
SELECT delete_bs_author('OL8497983A'); -- Quantum publishing, same
SELECT delete_bs_author('OL3106373A'); -- Insight editions, A bunch of merchandise crap
SELECT delete_bs_author('OL12577507A'); -- Gunis media
SELECT delete_bs_author('OL7983102A'); -- Warner bros entertainment posters
SELECT delete_bs_author('OL11174076A'); -- Adele coloring books;
SELECT delete_bs_author('OL4712881A'); -- Great britain, a bunch of legal docs
SELECT delete_bs_author('OL4529419A'); -- US Congress, public records
SELECT delete_bs_author('OL539875A'); -- Philip Parker, a guy who algorithmically generates books


-- This is a more measured approach - find authors with large numbers of books, or who may be associated with garbage
-- data, and delete data which is *only* associated with them. We'll do this by just deleting the book_authors and
-- authors records, and then doing a later pass to delete orphan books

CREATE OR REPLACE FUNCTION delete_only_bs_author(delete_ol_id text) RETURNS void AS $$
DECLARE
    delete_author_id integer;
    book_authors_affected integer := 0;
    authors_affected integer := 0;
BEGIN
    -- Find the author id with that OL id
    SELECT id INTO delete_author_id FROM authors WHERE authors.ol_id = delete_ol_id;

    -- If the author is not found, raise a notice and exit the function
    IF delete_author_id IS NULL THEN
        RAISE NOTICE 'Author with OL ID % not found', delete_ol_id;
        RETURN;
    END IF;

    RAISE NOTICE 'Deleting author records associated with %s (authors ID = %s)', delete_ol_id, delete_author_id;

    -- Delete book_authors entries for the author
    WITH deleted_book_authors AS (
        DELETE FROM book_authors WHERE author_id = delete_author_id
            RETURNING *
    ) SELECT count(*) INTO book_authors_affected FROM deleted_book_authors;
    RAISE NOTICE 'Deleted % book_authors entries', book_authors_affected;

    -- Delete the author
    WITH deleted_authors AS (
        DELETE FROM authors WHERE id = delete_author_id
            RETURNING *
    ) SELECT count(*) INTO authors_affected FROM deleted_authors;
    RAISE NOTICE 'Deleted % authors', authors_affected;

    RAISE NOTICE 'Finished!';
END;
$$ LANGUAGE plpgsql;


-- Delete any authors with > 2000 books

SELECT
    author.name,
    author.ol_id,
    delete_only_bs_author(author.ol_id), -- noqa
    count(*) AS author_id_count
FROM book_authors
INNER JOIN public.authors AS author ON book_authors.author_id = author.id
GROUP BY author.id, author.name, author.ol_id
HAVING count(*) > 2000;

-- Do a cleanup to delete orphan books - find books with no record in book authors, and delete them

SELECT count(*) FROM books
WHERE NOT EXISTS (
    SELECT 1
    FROM book_authors
    WHERE book_authors.book_id = books.id
);

CREATE OR REPLACE FUNCTION delete_orphan_books() RETURNS void AS $$
DECLARE
    books_affected integer := 0;
    editions_affected integer := 0;
    deleted_subjects integer := 0;
    deleted_reading_log_items integer := 0;
    deleted_ratings integer := 0;
    orphan_books integer := 0;
BEGIN

    RAISE NOTICE 'Deleting orphan books';

    SELECT COUNT(*) FROM books
    WHERE NOT EXISTS (SELECT 1
                      FROM book_authors
                      WHERE book_authors.book_id = books.id) into orphan_books;


    RAISE NOTICE 'Found % orphan books', orphan_books;


    WITH deleted_reading_log_items AS (
        DELETE FROM ol_reading_log_items USING
            (SELECT id FROM books WHERE NOT EXISTS (SELECT 1 FROM book_authors WHERE book_authors.book_id = books.id)) b
            WHERE ol_reading_log_items.book_id = b.id
            RETURNING *
    ) SELECT count(*) INTO deleted_reading_log_items FROM deleted_reading_log_items;

    RAISE NOTICE 'Deleted % reading log items', deleted_reading_log_items;

    WITH deleted_ratings AS (
        DELETE FROM ol_ratings USING
            (SELECT id FROM books WHERE NOT EXISTS (SELECT 1 FROM book_authors WHERE book_authors.book_id = books.id)) b
            WHERE ol_ratings.book_id = b.id
            RETURNING *
    ) SELECT count(*) INTO deleted_ratings FROM deleted_ratings;

    RAISE NOTICE 'Deleted % ratings', deleted_ratings;

    WITH deleted_subjects AS (
        DELETE FROM book_subjects USING
            (SELECT id FROM books WHERE NOT EXISTS (SELECT 1 FROM book_authors WHERE book_authors.book_id = books.id)) b
            WHERE book_subjects.book_id = b.id
            RETURNING *
    ) SELECT count(*) INTO deleted_subjects FROM deleted_subjects;

    WITH deleted_editons AS (
        DELETE FROM editions
            USING public.books b
            WHERE editions.book_id = b.id
                AND NOT EXISTS (SELECT 1
                                FROM book_authors
                                WHERE book_authors.book_id = b.id)) SELECT count(*) INTO editions_affected
    FROM deleted_editons;
    RAISE NOTICE 'Deleted % editions', editions_affected;

    WITH deleted_books AS (
        DELETE FROM books
            WHERE NOT EXISTS (SELECT 1
                              FROM book_authors
                              WHERE book_authors.book_id = books.id)) SELECT count(*) INTO books_affected
    FROM deleted_books;
    RAISE NOTICE 'Deleted % books', books_affected;

END
$$ LANGUAGE plpgsql;
