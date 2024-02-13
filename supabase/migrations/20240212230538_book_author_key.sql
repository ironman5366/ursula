-- Books should have a varchar field "author_key", and name and author_key should be unique together
ALTER TABLE books ADD COLUMN author_key VARCHAR(255);
ALTER TABLE books ADD CONSTRAINT author_key_title_unique UNIQUE (name, author_key);

-- Add a table "search_cache_entries" to store the search results

CREATE TABLE search_cache_queries (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE search_cache_entries (
    id SERIAL PRIMARY KEY,
    query_id INTEGER REFERENCES search_cache_queries (id),
    book_id INTEGER REFERENCES books (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
