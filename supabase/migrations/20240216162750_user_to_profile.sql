-- Remove the "username" column
ALTER TABLE "public"."users" DROP COLUMN username;

ALTER TABLE "public"."users" RENAME TO profiles;
