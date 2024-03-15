ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
-- Update all profiles to make their username their full name, or if it doesn't exist, "default username"::id
UPDATE profiles SET username = COALESCE(full_name, 'default username'::TEXT || id::TEXT);
-- Make username not nullable
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE profiles RENAME COLUMN avatar_url TO avatar_key;

-- Create a unique constraint on (user_id, book_id) on reading_list_items
ALTER TABLE reading_list_items DROP CONSTRAINT IF EXISTS unique_user_new_book;
ALTER TABLE reading_list_items ADD CONSTRAINT unique_user_new_book UNIQUE (user_id, book_id);

-- Create a foreign key on (user_id) on reading_list_items
ALTER TABLE reading_list_items DROP CONSTRAINT IF EXISTS reading_list_items_user_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_ol_book_id_fkey;

ALTER TABLE reviews ADD FOREIGN KEY (book_id) REFERENCES books (id);

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS unique_user_review_book;
ALTER TABLE reviews ADD CONSTRAINT unique_user_review_book UNIQUE (user_id, book_id)


-- TODO: make this less permissive
create policy "Allow avatar uploads"
    on storage.objects
    for all
    to authenticated
    with check (
        true
    );
