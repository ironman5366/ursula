-- The "updated_at" column on the "profiles" table should be updated whenever the profile is updated.
ALTER TABLE "public"."profiles" ALTER COLUMN "updated_at" SET DEFAULT now();
