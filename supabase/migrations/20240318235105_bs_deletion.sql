-- We need these indexes for this deletion to be performant
CREATE INDEX IF NOT EXISTS ol_reading_log_items_edition_id_idx ON ol_reading_log_items (edition_id);
CREATE INDEX IF NOT EXISTS ol_ratings_edition_id_idx ON ol_ratings (edition_id);


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

SELECT delete_bs_author('OL9615339A'); -- IRB media, just summaries
SELECT delete_bs_author('OL8497983A'); -- Quantum publishing, same
SELECT delete_bs_author('OL3106373A'); -- Insight editions, A bunch of merchandise crap
SELECT delete_bs_author('OL12577507A'); -- Gunis media
