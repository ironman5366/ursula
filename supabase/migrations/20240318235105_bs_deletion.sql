-- Delete all books associated with the author 'OL34694732W' via the book_authors table

CREATE OR REPLACE FUNCTION delete_bs_author(delete_ol_id text) RETURNS void AS $$
DECLARE
    delete_author_id integer;
    books_affected integer := 0;
    editions_affected integer := 0;
    book_authors_affected integer := 0;
    authors_affected integer := 0;
BEGIN
    -- Find the author id with that OL id
    SELECT id INTO delete_author_id FROM authors WHERE ol_id = delete_ol_id;

    -- If the author is not found, raise a notice and exit the function
    IF delete_author_id IS NULL THEN
        RAISE NOTICE 'Author with OL ID % not found', delete_ol_id;
        RETURN;
    END IF;

    WITH deleted_editions AS (
        DELETE FROM editions WHERE book_id IN (SELECT book_id FROM book_authors WHERE author_id = delete_author_id)
            RETURNING *
    )
    SELECT count(*) INTO editions_affected FROM deleted_editions;

    -- Delete books associated with the author
    WITH deleted_books AS (
        DELETE FROM books
            WHERE id IN (SELECT book_id FROM book_authors WHERE author_id = delete_author_id)
            RETURNING *
    )
    SELECT count(*) INTO books_affected FROM deleted_books;

    -- Delete book_authors entries for the author
    WITH deleted_book_authors AS (
        DELETE FROM book_authors WHERE author_id = delete_author_id
            RETURNING *
    )
    SELECT count(*) INTO book_authors_affected FROM deleted_book_authors;

    -- Delete the author
    WITH deleted_authors AS (
        DELETE FROM authors WHERE id = delete_author_id
            RETURNING *
    )
    SELECT count(*) INTO authors_affected FROM deleted_authors;

    -- Print the number of affected rows
    RAISE NOTICE 'Deleted % editions', editions_affected;
    RAISE NOTICE 'Deleted % books', books_affected;
    RAISE NOTICE 'Deleted % book_authors entries', book_authors_affected;
    RAISE NOTICE 'Deleted % authors', authors_affected;
END;
$$ LANGUAGE plpgsql;



SELECT delete_bs_author('OL9615339A') -- IRB media, just summaries
