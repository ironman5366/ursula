-- We're finally done with this migration! now we can just enforce that this isn't nullable. If this breaks we can go in
-- and manually add the legacy mappings and re-run
ALTER TABLE reading_list_items ALTER COLUMN ol_book_id SET NOT NULL;
ALTER TABLE reading_list_items RENAME COLUMN ol_book_id TO book_id;

ALTER TABLE reviews ALTER COLUMN ol_book_id SET NOT NULL;
ALTER TABLE reviews RENAME COLUMN ol_book_id TO book_id;

ALTER TABLE currently_reading_items ALTER COLUMN ol_book_id SET NOT NULL;
ALTER TABLE currently_reading_items RENAME COLUMN ol_book_id TO book_id;

ALTER TABLE recommendations ALTER COLUMN ol_book_id SET NOT NULL;
ALTER TABLE recommendations RENAME COLUMN ol_book_id TO book_id;

-- Rename "ol_books" to "books"
ALTER TABLE IF EXISTS ol_books RENAME TO books;
ALTER TABLE IF EXISTS ol_editions RENAME TO editions;
ALTER TABLE IF EXISTS ol_authors RENAME TO authors;
ALTER TABLE IF EXISTS ol_book_authors RENAME TO book_authors;
