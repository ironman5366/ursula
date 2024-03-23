CREATE OR REPLACE FUNCTION search_only_books(search_text text) RETURNS SETOF books AS $$
    SELECT * FROM books WHERE plainto_tsquery('english', search_text) @@ to_tsvector('english',title) ORDER BY popularity DESC
$$ LANGUAGE SQL;
