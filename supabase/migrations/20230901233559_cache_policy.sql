ALTER TABLE search_cache FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
ON search_cache FOR select
using ( true );

ALTER TABLE search_cache_books FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
ON search_cache_books FOR select
using ( true );