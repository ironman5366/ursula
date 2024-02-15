-- Alter the "reading_list_items" table to add a unique constraint on user_id, book_id
ALTER TABLE reading_list_items ADD CONSTRAINT reading_list_items_user_id_book_id_unique UNIQUE (user_id, book_id);
