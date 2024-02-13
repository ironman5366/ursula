-- Make "description" in the books table nullable
ALTER TABLE books ALTER COLUMN description DROP NOT NULL;
