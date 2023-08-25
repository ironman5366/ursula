-- Fix mistakes made in the previous migration
-- 1. Set the `id` columns as primary keys
ALTER TABLE "public"."authors" ADD PRIMARY KEY ("id");
ALTER TABLE "public"."books" ADD PRIMARY KEY ("id");
ALTER TABLE "public"."reading_lists" ADD PRIMARY KEY ("id");

-- 2. Rename the `crated_at` column to `created_at` on the `reading_lists` table
ALTER TABLE "public"."reading_lists" RENAME COLUMN "crated_at" TO "created_at";

-- 3. Drop the `prev_ranking_id` and `isbn` columns from the `reading_lists` table
ALTER TABLE "public"."reading_lists" DROP COLUMN "prev_ranking_id";
ALTER TABLE "public"."reading_lists" DROP COLUMN "isbn";

-- 4. Add a foreign key column to the `reading_lists` table that references the `books` table
ALTER TABLE "public"."reading_lists" ADD COLUMN "book_id" BIGINT;
ALTER TABLE "public"."reading_lists" ADD CONSTRAINT "fk_reading_lists_book_id" FOREIGN KEY ("book_id") REFERENCES "public"."books" ("id");

-- Create a search cache

CREATE TABLE "public"."search_cache" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now"(),
    "query" character varying NOT NULL
);

CREATE TABLE "public"."search_cache_books" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "cache_id" BIGINT NOT NULL,
    "book_id" BIGINT NOT NULL,
    CONSTRAINT "fk_cache_id" FOREIGN KEY("cache_id") REFERENCES "public"."search_cache"("id"),
    CONSTRAINT "fk_book_id" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id")
);
