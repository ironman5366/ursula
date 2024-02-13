-- Make "book_id" and "query_id" be unique together in the search_cache_entries table
ALTER TABLE search_cache_entries ADD CONSTRAINT unique_book_query UNIQUE (book_id, query_id);
