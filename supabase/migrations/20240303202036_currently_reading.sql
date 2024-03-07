CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    activity_type VARCHAR NOT NULL,
    activity_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_activities_user_id FOREIGN KEY (user_id) REFERENCES profiles (id)
);


CREATE TABLE reading_lists (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_reading_lists_user_id FOREIGN KEY (user_id) REFERENCES profiles (id)
);

-- Add an optional "list_id" column to reading_list_items which references the reading_lists table
ALTER TABLE reading_list_items ADD COLUMN list_id INTEGER REFERENCES reading_lists (id) ON DELETE CASCADE;


CREATE TABLE currently_reading_items (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_currently_reading_items_user_id FOREIGN KEY (user_id) REFERENCES profiles (id),
    CONSTRAINT fk_currently_reading_items_book_id FOREIGN KEY (book_id) REFERENCES books (id)
);

CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    recomender_id UUID NOT NULL,
    recomendee_id UUID NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_recommendations_recomender_id FOREIGN KEY (recomender_id) REFERENCES profiles (id),
    CONSTRAINT fk_recommendations_recomendee_id FOREIGN KEY (recomendee_id) REFERENCES profiles (id),
    CONSTRAINT fk_recommendations_book_id FOREIGN KEY (book_id) REFERENCES books (id)
);

CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id UUID NOT NULL,
    followee_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_follows_follower_id FOREIGN KEY (follower_id) REFERENCES profiles (id),
    CONSTRAINT fk_follows_followee_id FOREIGN KEY (followee_id) REFERENCES profiles (id),
    -- Unique constraint to prevent duplicate follows
    CONSTRAINT unique_follower_followee UNIQUE (follower_id, followee_id)
);
