CREATE TABLE IF NOT EXISTS currently_reading_items (
    id serial PRIMARY KEY,
    user_id "uuid" NOT NULL,
    book_id integer NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT currently_reading_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT currently_reading_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES books (id)
);
