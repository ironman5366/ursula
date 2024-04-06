-- noqa
-- This may take an exceptionally long time, I bootstrapped by doing WITH NO DATA and scheduling a cron job to
-- populate it the first time
CREATE MATERIALIZED VIEW IF NOT EXISTS v_materialized_books_search AS -- noqa
SELECT -- noqa
    books.*,
    books.title || ' '
    || (
        SELECT string_agg(authors.name, ', ')
        FROM book_authors
        INNER JOIN authors ON book_authors.author_id = authors.id
        WHERE book_authors.book_id = books.id
    ) || ' '
    || coalesce(books.subtitle, '') AS v_extended_search_name
FROM books; -- noqa

CREATE INDEX IF NOT EXISTS idx_v_materialized_books_search ON v_materialized_books_search USING gin (to_tsvector('english', v_extended_search_name));

CREATE OR REPLACE FUNCTION search_only_books_materialized(search_text text) RETURNS SETOF v_materialized_books_search AS $$
    SELECT * FROM v_materialized_books_search WHERE plainto_tsquery('english', search_text) @@ to_tsvector('english', v_extended_search_name)
    ORDER BY popularity, editions_count DESC
$$ LANGUAGE sql;


CREATE OR REPLACE FUNCTION search_all_materialized(search_text text) RETURNS TABLE (
    entity_id_numeric integer,
    entity_id_uuid uuid,
    entity_type text,
    result_field text,
    search_field text,
    order_key integer
) LANGUAGE sql AS $$
(
    SELECT
        id AS entity_id_numeric,
        NULL::uuid as entity_id_uuid,
        'books' AS entity_type,
        'title' AS result_field,
        title AS search_field,
        popularity AS order_key
    FROM v_materialized_books_search
    WHERE to_tsvector('english', v_materialized_books_search.v_extended_search_name) @@ plainto_tsquery('english', search_text)
)  UNION (
    SELECT
        id AS entity_id_numeric,
        NULL::uuid as entity_id_uuid,
        'authors' AS entity_type,
        'name' AS result_field,
        name AS search_field,
        -- TODO: this should eventually be based on a metric of author popularity
        0 AS order_key
    FROM authors
    WHERE to_tsvector('english', authors.name) @@ plainto_tsquery('english', search_text)
)
UNION (
    SELECT
        NULL AS entity_id_numeric,
        id::uuid AS entity_id_uuid,
        'profiles' AS entity_type,
        'username' AS result_field,
        username AS search_field,
        1 AS order_key
    FROM profiles
    WHERE username ILIKE search_text || '%'
)
ORDER BY order_key DESC
$$;
