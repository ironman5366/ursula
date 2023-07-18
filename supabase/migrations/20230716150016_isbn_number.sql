ALTER TABLE "public"."rankings"
RENAME TO reviews;

ALTER TABLE "public"."reviews"
ALTER COLUMN isbn
TYPE bigint USING isbn::bigint;

ALTER TABLE "public"."reviews"
ALTER COLUMN isbn SET NOT NULL;