CREATE INDEX IF NOT EXISTS idx_fts_title
ON public.books USING gin (to_tsvector('english'::regconfig, title));

CREATE INDEX IF NOT EXISTS idx_fts_author_name
ON public.authors USING gin (to_tsvector('english'::regconfig, name));

CREATE INDEX IF NOT EXISTS idx_fts_profiles_name
ON public.profiles USING gin (to_tsvector('english'::regconfig, full_name));

CREATE INDEX idx_users_username_lower ON users (lower(username));

CREATE OR REPLACE VIEW v_search AS (
    (
        SELECT
            id AS entity_id,
            'books' AS entity_type,
            'book_title' AS result_type,
            title AS search_field,
            popularity AS order_key
        FROM books
    )
    UNION
    (
        SELECT
            id AS entity_id,
            'authors' AS entity_type,
            'author_name' AS result_type,
            name AS search_field,
            1 AS order_key
        FROM authors
    )
    UNION
    (
        SELECT
            id AS entity_id,
            'profiles' AS entity_type,
            'profiles_name' AS result_type,
            full_name AS search_field,
            1 AS order_key
        FROM profiles
    )
    UNION
    (
        SELECT
            id AS entity_id,
            'profiles_username' AS result_type,
            username AS search_field,
            1 AS order_key,
            con
            'profiles' AS entity_type
    )
);
