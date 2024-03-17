CREATE INDEX IF NOT EXISTS idx_fts_title
ON public.books USING gin (to_tsvector('english'::regconfig, title));

CREATE INDEX IF NOT EXISTS idx_fts_author_name
ON public.authors USING gin (to_tsvector('english'::regconfig, name));

CREATE INDEX IF NOT EXISTS idx_fts_profiles_name
ON public.profiles USING gin (to_tsvector('english'::regconfig, full_name));

CREATE INDEX IF NOT EXISTS idx_users_username_lower ON profiles (lower(username));

CREATE OR REPLACE FUNCTION search_all(search_text text) RETURNS TABLE (
    entity_id_numeric integer,
    entity_id_uuid uuid,
    entity_type text,
    result_type text,
    search_field text,
    order_key integer
) LANGUAGE sql AS $$
(
    SELECT
        id AS entity_id_numeric,
        NULL as entity_id_uuid,
        'books' AS entity_type,
        'book_title' AS result_type,
        title AS search_field,
        popularity AS order_key
    FROM books
    WHERE to_tsvector('english', books.title) @@ plainto_tsquery('english', search_text)
)  UNION (
    SELECT
        id AS entity_id_numeric,
        NULL as entity_id_uuid,
        'authors' AS entity_type,
        'author_name' AS result_type,
        name AS search_field,
        1 AS order_key
    FROM authors
    WHERE to_tsvector('english', authors.name) @@ plainto_tsquery('english', search_text)
)
    UNION (
    SELECT
        NULL AS entity_id_numeric,
        id::uuid AS entity_id_uuid,
        'profiles' AS entity_type,
        'profiles_username' AS result_type,
        username AS search_field,
        1 AS order_key
    FROM profiles
    WHERE username ILIKE search_text || '%'
)
$$;
