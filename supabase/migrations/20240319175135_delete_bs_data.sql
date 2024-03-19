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
