-- Update the "reviews" table to add a "note" text field
ALTER TABLE reviews ADD COLUMN note TEXT;

-- Add a unique constraint across reviews (user_id, book_id)
ALTER TABLE reviews ADD CONSTRAINT unique_user_book UNIQUE (user_id, book_id);
