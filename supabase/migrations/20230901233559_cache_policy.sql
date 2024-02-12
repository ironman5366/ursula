ALTER TABLE search_cache FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
ON search_cache FOR SELECT
USING (true);

ALTER TABLE search_cache_books FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
ON search_cache_books FOR SELECT
USING (true);
