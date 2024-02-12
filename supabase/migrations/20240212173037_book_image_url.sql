-- Alter the books table to have a "large_thumbnail_url" and "small_thumbnail_url" column
ALTER TABLE "public"."books" ADD COLUMN "large_thumbnail_url" text NOT NULL DEFAULT '';
ALTER TABLE "public"."books" ADD COLUMN "small_thumbnail_url" text NOT NULL DEFAULT '';