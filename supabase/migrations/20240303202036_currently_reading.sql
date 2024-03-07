CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    activity_type VARCHAR NOT NULL,
    activity_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_activities_user_id FOREIGN KEY (user_id) REFERENCES profiles (id)
);


CREATE TABLE reading_lists (
       id SERIAL PRIMARY KEY,
       user_id INTEGER NOT NULL,
       name VARCHAR NOT NULL,
       is_default BOOLEAN NOT NULL DEFAULT FALSE,
       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
       CONSTRAINT fk_reading_lists_user_id FOREIGN KEY (user_id) REFERENCES profiles (id),
);


CREATE TABLE currently_reading_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_currently_reading_items_user_id FOREIGN KEY (user_id) REFERENCES profiles (id),
    CONSTRAINT fk_currently_reading_items_book_id FOREIGN KEY (book_id) REFERENCES books (id)
);

CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    recomender_id INTEGER NOT NULL,
    recomendee_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_recommendations_recomender_id FOREIGN KEY (recomender_id) REFERENCES profiles (id),
    CONSTRAINT fk_recommendations_recomendee_id FOREIGN KEY (recomendee_id) REFERENCES profiles (id),
    CONSTRAINT fk_recommendations_book_id FOREIGN KEY (book_id) REFERENCES books (id)
);

CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followee_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_follows_follower_id FOREIGN KEY (follower_id) REFERENCES profiles (id),
    CONSTRAINT fk_follows_followee_id FOREIGN KEY (followee_id) REFERENCES profiles (id),
    -- Unique constraint to prevent duplicate follows
    CONSTRAINT unique_follower_followee UNIQUE (follower_id, followee_id)
);
