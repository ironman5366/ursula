create index if not exists idx_fts_title
on public.books using gin (to_tsvector('english'::regconfig, title));

create index if not exists idx_fts_author_name
on public.authors using gin (to_tsvector('english'::regconfig, name));


create or replace view v_search as (
    (
        select
            id as entity_id,
            'books' as entity_type,
            'book_title' as result_type,
            title as search_field,
            popularity as order_key
        from books
    )
    union
    (
        select
            id as entity_id,
            'authors' as entity_type,
            'author_name' as result_type,
            name as search_field,
            1 as order_key
        from authors
    )
);
