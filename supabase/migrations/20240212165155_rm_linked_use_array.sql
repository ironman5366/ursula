DROP TABLE "public"."reading_lists";
DROP TABLE "public"."reviews";
DROP TABLE "public"."search_cache_books";
DROP TABLE "public"."search_cache";
DROP TABLE "public"."books";
DROP TABLE "public"."authors";

-- The only table we want to keep is "profiles", but rename it to "users"
ALTER TABLE "public"."profiles" RENAME TO "users";

-- Create all tables again with the new schema

CREATE TABLE "public"."authors" (
    "id" int PRIMARY KEY,
    "name" text NOT NULL UNIQUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "public"."books" (
    "id" int PRIMARY KEY,
    "name" text NOT NULL,
    "description" text NOT NULL,
    "author_id" int NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "author_id" FOREIGN KEY ("author_id") REFERENCES "authors" (
        "id"
    ) ON DELETE CASCADE
);


CREATE TABLE "public"."editions" (
    "id" int PRIMARY KEY,
    "name" text NOT NULL,
    "book_id" int NOT NULL,
    "isbn_10" text UNIQUE,
    "isbn_13" text UNIQUE,
    "google_id" text NOT NULL UNIQUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "books" (
        "id"
    ) ON DELETE CASCADE
);


CREATE TABLE "public"."reviews" (
    "id" int PRIMARY KEY,
    "book_id" int NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "books" (
        "id"
    ) ON DELETE CASCADE,
    CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users" (
        "id"
    ) ON DELETE CASCADE
);

-- Alter the users table so that they have an integer array which references review IDs.
ALTER TABLE "public"."users" ADD COLUMN "review_ids" integer [] NOT NULL DEFAULT '{}';

CREATE TABLE "public"."reading_list_items" (
    "id" int PRIMARY KEY,
    "book_id" int NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "books" (
        "id"
    ) ON DELETE CASCADE,
    CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users" (
        "id"
    ) ON DELETE CASCADE
);
