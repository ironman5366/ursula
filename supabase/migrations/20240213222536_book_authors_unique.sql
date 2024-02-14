-- On the "book_authors" table, author_id and book_id should be unique together
ALTER TABLE book_authors ADD CONSTRAINT book_authors_unique UNIQUE (author_id, book_id);
