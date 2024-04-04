ALTER TABLE currently_reading_items ADD CONSTRAINT currently_reading_items_book_id_user_id_unique UNIQUE (book_id, user_id);
