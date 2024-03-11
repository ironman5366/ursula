ALTER TABLE ol_editions ADD COLUMN book_id INTEGER;
UPDATE ol_editions SET book_id = (SELECT ol_books.id FROM ol_books WHERE ol_books.ol_id = ol_editions.book_ol_id);

ALTER TABLE ol_book_authors ADD COLUMN book_id INTEGER;
ALTER TABLE ol_book_authors ADD COLUMN author_id INTEGER;

UPDATE ol_book_authors SET book_id = (SELECT ol_books.id FROM ol_books WHERE ol_books.ol_id = ol_book_authors.book_ol_id);
UPDATE ol_book_authors SET author_id = (SELECT ol_authors.id FROM ol_authors WHERE ol_authors.ol_id = ol_book_authors.author_ol_id);

ALTER TABLE edition_genres ADD COLUMN edition_id INTEGER;
ALTER TABLE edition_genres ADD COLUMN genre_id INTEGER;

UPDATE edition_genres SET edition_id = (SELECT ol_editions.id FROM ol_editions WHERE ol_editions.ol_id = edition_genres.edition_ol_id);
UPDATE edition_genres SET genre_id = (SELECT genres.id FROM genres WHERE genres.name = edition_genres.genre_name);

ALTER TABLE book_subjects ADD COLUMN book_id INTEGER;
ALTER TABLE book_subjects ADD COLUMN subject_id INTEGER;

UPDATE book_subjects SET book_id = (SELECT ol_books.id FROM ol_books WHERE ol_books.ol_id = book_subjects.book_ol_id);
UPDATE book_subjects SET subject_id = (SELECT subjects.id FROM subjects WHERE subjects.name = book_subjects.subject_name);
