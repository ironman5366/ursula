-- Drop all existing tables, and re-create them in a sane way

DROP TABLE reading_lists;
DROP TABLE reviews;
DROP TABLE search_cache_books;
DROP TABLE authors;
DROP TABLE books;
DROP TABLE search_cache;


-- Create all tables again
CREATE TABLE "public"."authors"(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    name VARCHAR(255) NOT NULL
);

CREATE POLICY "No one can write to authors"
ON public.authors FOR ALL WITH CHECK (false);

CREATE POLICY "Anyone can read authors"
ON public.authors FOR SELECT USING (true);

CREATE TABLE "public"."books"(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) NOT NULL,

    google_id VARCHAR(255) NOT NULL,

    small_thumbnail_url TEXT NOT NULL,
    large_thumbnail_url TEXT NOT NULL,

    author_id BIGINT NOT NULL,
    CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE POLICY "No one can create books"
ON public.books FOR ALL WITH CHECK (false);

CREATE POLICY "Anyone can read books"
ON public.books FOR SELECT USING (true);


CREATE TABLE "public"."reviews" (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    user_uid UUID NOT NULL,
    CONSTRAINT fk_user_uid FOREIGN KEY (user_uid) REFERENCES profiles(id),

    -- prev_review_id makes up the linked list that we use to track the stack of reviews
    prev_review_id BIGINT NOT NULL,
    CONSTRAINT fk_prev_review_id FOREIGN KEY (prev_review_id) REFERENCES reviews(id),

    book_id BIGINT NOT NULL,
    CONSTRAINT fk_book_id FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE POLICY "Only a user can create a review for themself"
ON public.reviews FOR INSERT WITH CHECK (
    auth.jwt() ->> 'uid' = user_uid::text
);

CREATE POLICY "Only a user can update a review for themself"
ON public.reviews FOR UPDATE WITH CHECK (
    auth.jwt() ->> 'uid' = user_uid::text
);

CREATE POLICY "Anyone can read reviews"
ON public.reviews FOR SELECT USING (true);

CREATE TABLE "public"."reading_lists" (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    user_uid UUID NOT NULL,
    CONSTRAINT fk_user_uid FOREIGN KEY (user_uid) REFERENCES profiles(id),

    book_id BIGINT NOT NULL,
    CONSTRAINT fk_book_id FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE POLICY "Only a user can create an item in their reading list"
ON public.reading_lists FOR INSERT WITH CHECK (
    auth.jwt() ->> 'uid' = user_uid::text
);

CREATE POLICY "Only a user can update an item in their reading list"
ON public.reading_lists FOR UPDATE WITH CHECK (
    auth.jwt() ->> 'uid' = user_uid::text
);

CREATE POLICY "Anyone can read reading lists"
ON public.reading_lists FOR SELECT USING (true);


CREATE TABLE search_cache (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    query VARCHAR (255) NOT NULL,
    -- The query should be unique
    CONSTRAINT unique_query UNIQUE (query)
);

CREATE POLICY "No one can write to or read from the search cache"
ON search_cache FOR ALL USING (false);


CREATE TABLE search_cache_books (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    cache_id BIGINT NOT NULL,
    CONSTRAINT fk_cache_id FOREIGN KEY (cache_id) REFERENCES search_cache(id),

    book_id BIGINT NOT NULL,
    CONSTRAINT fk_book_id FOREIGN KEY (book_id) REFERENCES books(id)
);


CREATE POLICY "No one can write to or read from the search cache books"
ON search_cache_books FOR ALL USING (false);

