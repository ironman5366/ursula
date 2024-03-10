-- Restore the foreign keys on the loaded data
ALTER TABLE ol_editions ADD CONSTRAINT fk_ol_editions_book_id FOREIGN KEY (book_id) REFERENCES ol_books (id);
ALTER TABLE ol_book_excerpts ADD CONSTRAINT fk_ol_book_excerpts_book_id FOREIGN KEY (book_id) REFERENCES ol_books (id);
ALTER TABLE ol_book_excerpts ADD CONSTRAINT fk_ol_book_excerpts_edition_id FOREIGN KEY (edition_id) REFERENCES ol_editions (id);
ALTER TABLE ol_book_links ADD CONSTRAINT fk_ol_book_links_book_id FOREIGN KEY (book_id) REFERENCES ol_books (id);
ALTER TABLE book_subjects ADD CONSTRAINT fk_book_subjects_book_id FOREIGN KEY (book_id) REFERENCES ol_books (id);
