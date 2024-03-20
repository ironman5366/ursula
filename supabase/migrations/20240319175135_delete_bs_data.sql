SET statement_timeout = '5h';

CREATE INDEX IF NOT EXISTS ol_authors_ol_id_idx ON authors (ol_id);
CREATE INDEX IF NOT EXISTS books_popularity_idx ON books (popularity);
CREATE INDEX IF NOT EXISTS book_subjects_subject_id_idx ON book_subjects (subject_id);
CREATE INDEX IF NOT EXISTS book_subjects_book_id_idx ON book_subjects (book_id);
CREATE INDEX IF NOT EXISTS ol_ratings_edition_id_idx ON ol_ratings (edition_id);
CREATE INDEX IF NOT EXISTS ol_reading_log_items_edition_id_idx ON ol_reading_log_items (edition_id);


CREATE OR REPLACE FUNCTION delete_bs_author(delete_ol_id text) RETURNS void AS $$
    DECLARE
        delete_author_id integer;
    BEGIN

        SELECT id INTO delete_author_id FROM authors WHERE ol_id = delete_ol_id;
        IF delete_author_id IS NULL THEN
            RAISE NOTICE 'No author with OL ID % found', delete_ol_id;
            RETURN;
        END IF;

        -- Delete all the books from the books table associated with this author by looking at book_authors.
        DELETE FROM books WHERE id IN (SELECT book_id FROM book_authors WHERE author_id = delete_author_id);

        -- Delete the actual author
        DELETE FROM authors WHERE id = delete_author_id;
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
SELECT delete_bs_author('OL10026209A'); -- Someone who publishes trivia about popular books
SELECT delete_bs_author('OL8374311A');
SELECT delete_bs_author('OL10136442A'); -- Sumoreads
SELECT delete_bs_author('OL7551984A'); -- Paula Croyle, a woman who publishes the same children's book but with different names on the cover


CREATE OR REPLACE FUNCTION delete_orphan_books() RETURNS void AS $$
DECLARE
    deleted_book_count integer;
BEGIN

    RAISE NOTICE 'Deleting orphan books';

    WITH deleted_books AS (
        DELETE FROM books
            WHERE NOT EXISTS (SELECT 1
                              FROM book_authors
                              WHERE book_authors.book_id = books.id)
               AND popularity = 0
               AND covers is NULL
               ) SELECT COUNT(*) into deleted_book_count;


    RAISE NOTICE 'Deleted % books', deleted_book_count;

END
$$ LANGUAGE plpgsql;


-- By doing this twice we can see the number of orphans that were just in the database at large, and the
-- number of author based orphans
SELECT delete_orphan_books();

-- -- Delete any authors who are in the database as having written > 2500 books. We can confidently say that nobody
-- -- has written that many books, so these are likely to be spam or other bad data.
-- DELETE FROM public.authors
-- WHERE id IN (
--     SELECT author_id
--     FROM book_authors
--     GROUP BY author_id
--     HAVING count(*) > 2500
-- ) AND photos IS NULL AND birth_date IS NULL AND death_date IS NULL AND bio IS NULL;
-- SELECT delete_orphan_books();
