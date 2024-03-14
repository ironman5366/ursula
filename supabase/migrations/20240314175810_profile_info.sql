ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
-- Update all profiles to make their username their full name
UPDATE profiles SET username = full_name;
-- Make username not nullable
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
