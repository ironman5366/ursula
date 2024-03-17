CREATE INDEX IF NOT EXISTS idx_fts_title
ON public.books USING gin (to_tsvector('english'::regconfig, title));

CREATE INDEX IF NOT EXISTS idx_fts_author_name
ON public.authors USING gin (to_tsvector('english'::regconfig, name));


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
);
