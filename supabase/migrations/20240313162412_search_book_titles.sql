CREATE OR REPLACE FUNCTION search_book_titles(search_text text)
RETURNS TABLE (book books, rank double precision)
LANGUAGE sql
AS $$
    SELECT book, ts_rank(to_tsvector('english', book.title), plainto_tsquery('english', search_text)) AS rank
    FROM books book
        WHERE to_tsvector('english', book.title) @@ plainto_tsquery('english', search_text)
    ORDER BY rank DESC
$$;
