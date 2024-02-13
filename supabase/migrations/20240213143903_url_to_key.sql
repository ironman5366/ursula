-- Change "large_thumbnail_url" and "small_thumbnail_url" on books to "large_thumbnail_key" and "small_thumbnail_key" respectively
ALTER TABLE books RENAME COLUMN large_thumbnail_url TO large_thumbnail_key;
ALTER TABLE books RENAME COLUMN small_thumbnail_url TO small_thumbnail_key;
