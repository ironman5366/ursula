-- Replace a bunch of foreign keys with CASCADE'ing foreign keys

ALTER TABLE book_authors DROP CONSTRAINT ol_book_authors_author_id_fkey;
ALTER TABLE book_authors DROP CONSTRAINT ol_book_authors_book_id_fkey;
ALTER TABLE book_authors ADD CONSTRAINT book_authors_book_id_fkey FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE;
ALTER TABLE book_authors ADD CONSTRAINT book_authors_author_id_fkey FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE;


ALTER TABLE book_subjects DROP CONSTRAINT book_subjects_subject_id_fkey;
ALTER TABLE book_subjects DROP CONSTRAINT book_subjects_book_id_fkey;
ALTER TABLE book_subjects ADD CONSTRAINT book_subjects_book_id_fkey FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE;
ALTER TABLE book_subjects ADD CONSTRAINT book_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE;


ALTER TABLE currently_reading_items DROP CONSTRAINT IF EXISTS currently_reading_items_ol_book_id_fkey;
ALTER TABLE currently_reading_items DROP CONSTRAINT IF EXISTS fk_currently_reading_items_user_id;
ALTER TABLE currently_reading_items ADD CONSTRAINT currently_reading_items_ol_book_id_fkey FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE;
ALTER TABLE currently_reading_items ADD CONSTRAINT currently_reading_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE;


ALTER TABLE edition_genres DROP CONSTRAINT IF EXISTS edition_genres_genre_id_fkey;
ALTER TABLE edition_genres DROP CONSTRAINT IF EXISTS edition_genres_edition_id_fkey;
ALTER TABLE edition_genres ADD CONSTRAINT edition_genres_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES editions (id) ON DELETE CASCADE;
ALTER TABLE edition_genres ADD CONSTRAINT edition_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE;


ALTER TABLE ol_ratings DROP CONSTRAINT IF EXISTS ol_ratings_book_id_fkey;
ALTER TABLE ol_ratings DROP CONSTRAINT IF EXISTS ol_ratings_edition_id_fkey;
ALTER TABLE ol_ratings ADD CONSTRAINT ol_ratings_book_id_fkey FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE;
ALTER TABLE ol_ratings ADD CONSTRAINT ol_ratings_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES editions (id) ON DELETE CASCADE;

ALTER TABLE ol_reading_log_items DROP CONSTRAINT IF EXISTS ol_reading_log_items_book_id_fkey;
ALTER TABLE ol_reading_log_items DROP CONSTRAINT IF EXISTS ol_reading_log_items_edition_id_fkey;
ALTER TABLE ol_reading_log_items ADD CONSTRAINT ol_reading_log_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE;
ALTER TABLE ol_reading_log_items ADD CONSTRAINT ol_reading_log_items_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES editions (id) ON DELETE CASCADE;

-- NOTE: we intentionally don't do this with reviews or reading_list_items.
-- If we try to delete a book that a user has reviewed we need to care about it
