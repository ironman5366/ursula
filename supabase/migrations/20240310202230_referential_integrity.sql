ALTER TABLE ol_editions ADD COLUMN IF NOT EXISTS book_id INTEGER;
UPDATE ol_editions SET book_id = (SELECT ol_books.id FROM ol_books WHERE ol_books.ol_id = ol_editions.book_ol_id) WHERE book_id IS NULL;

ALTER TABLE ol_book_authors ADD COLUMN IF NOT EXISTS book_id INTEGER;
ALTER TABLE ol_book_authors ADD COLUMN IF NOT EXISTS author_id INTEGER;

UPDATE ol_book_authors SET book_id = (SELECT ol_books.id FROM ol_books WHERE ol_books.ol_id = ol_book_authors.book_ol_id) WHERE ol_book_authors.book_id IS NULL;
UPDATE ol_book_authors SET author_id = (SELECT ol_authors.id FROM ol_authors WHERE ol_authors.ol_id = ol_book_authors.author_ol_id) WHERE ol_book_authors.author_id IS NULL;

ALTER TABLE edition_genres ADD COLUMN IF NOT EXISTS edition_id INTEGER;
ALTER TABLE edition_genres ADD COLUMN IF NOT EXISTS genre_id INTEGER;

UPDATE edition_genres SET edition_id = (SELECT ol_editions.id FROM ol_editions WHERE ol_editions.ol_id = edition_genres.edition_ol_id) WHERE edition_genres.edition_id IS NULL;
UPDATE edition_genres SET genre_id = (SELECT genres.id FROM genres WHERE genres.name = edition_genres.genre_name) WHERE edition_genres.genre_id IS NULL;

ALTER TABLE book_subjects ADD COLUMN IF NOT EXISTS book_id INTEGER;
ALTER TABLE book_subjects ADD COLUMN IF NOT EXISTS subject_id INTEGER;

UPDATE book_subjects SET book_id = (SELECT ol_books.id FROM ol_books WHERE ol_books.ol_id = book_subjects.book_ol_id) WHERE book_subjects.book_id IS NULL;
UPDATE book_subjects SET subject_id = (SELECT subjects.id FROM subjects WHERE subjects.name = book_subjects.subject_name) WHERE book_subjects.subject_id IS NULL;

-- Now a DO block that checks if the foreign keys exist and if not, creates them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ol_editions_book_id_fkey') THEN
    ALTER TABLE ol_editions ADD FOREIGN KEY (book_id) REFERENCES ol_books (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ol_book_authors_book_id_fkey') THEN
    ALTER TABLE ol_book_authors ADD FOREIGN KEY (book_id) REFERENCES ol_books (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ol_book_authors_author_id_fkey') THEN
    ALTER TABLE ol_book_authors ADD FOREIGN KEY (author_id) REFERENCES ol_authors (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'edition_genres_edition_id_fkey') THEN
    ALTER TABLE edition_genres ADD FOREIGN KEY (edition_id) REFERENCES ol_editions (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'edition_genres_genre_id_fkey') THEN
    ALTER TABLE edition_genres ADD FOREIGN KEY (genre_id) REFERENCES genres (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_subjects_book_id_fkey') THEN
    ALTER TABLE book_subjects ADD FOREIGN KEY (book_id) REFERENCES ol_books (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_subjects_subject_id_fkey') THEN
    ALTER TABLE book_subjects ADD FOREIGN KEY (subject_id) REFERENCES subjects (id);
  END IF;
END$$;
