CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    activity_type VARCHAR NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user_activities_user_id FOREIGN KEY (user_id) REFERENCES profiles (id),
    CONSTRAINT fk_user_activities_book_id FOREIGN KEY (book_id) REFERENCES books (id)
);
