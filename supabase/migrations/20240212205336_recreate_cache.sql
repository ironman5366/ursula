-- I messed up last time, so drop and recreate everything

DROP TABLE "public"."reading_list_items";
DROP TABLE "public"."reviews";
DROP TABLE "public"."editions";
DROP TABLE "public"."books";
DROP TABLE "public"."authors";

-- Create all tables again with the new schema

CREATE TABLE "public"."authors"
(
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE "public"."books"
(
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author_id" INT NOT NULL,
    "large_thumbnail_url" TEXT,
    "small_thumbnail_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT "author_id" FOREIGN KEY ("author_id") REFERENCES "authors" (
        "id"
    ) ON DELETE CASCADE
);


CREATE TABLE "public"."editions"
(
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "book_id" INT NOT NULL,
    "isbn_10" TEXT UNIQUE,
    "isbn_13" TEXT UNIQUE,
    "google_id" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "books" (
        "id"
    ) ON DELETE CASCADE
);


CREATE TABLE "public"."reviews"
(
    "id" SERIAL PRIMARY KEY,
    "book_id" INT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "books" (
        "id"
    ) ON DELETE CASCADE,
    CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users" (
        "id"
    ) ON DELETE CASCADE
);


CREATE TABLE "public"."reading_list_items"
(
    "id" SERIAL PRIMARY KEY,
    "book_id" INT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "books" (
        "id"
    ) ON DELETE CASCADE,
    CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users" (
        "id"
    ) ON DELETE CASCADE
);
-- Alter the "books" table to drop the author_id column
ALTER TABLE "public"."books" DROP COLUMN author_id;

-- Instead create a book_authors table
CREATE TABLE "public"."book_authors"
(
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books (id),
    author_id INTEGER REFERENCES authors (id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
