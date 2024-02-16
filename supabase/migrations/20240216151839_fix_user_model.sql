DROP TABLE IF EXISTS "public"."profiles";

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();

-- Remove the "username" column
ALTER TABLE "public"."users" DROP COLUMN username;

ALTER TABLE "public"."users" RENAME TO profiles;
