CREATE OR REPLACE FUNCTION search_all(search_text text) RETURNS TABLE (
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
    FROM books
    WHERE to_tsvector('english', books.title) @@ plainto_tsquery('english', search_text)
)  UNION (
    SELECT
        id AS entity_id_numeric,
        NULL::uuid as entity_id_uuid,
        'authors' AS entity_type,
        'name' AS result_field,
        name AS search_field,
        -- TODO: this should eventually be based on a metric of author popularity
        2 AS order_key
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
        1000 AS order_key
    FROM profiles
    WHERE username ILIKE search_text || '%'
)
ORDER BY order_key DESC
$$;
