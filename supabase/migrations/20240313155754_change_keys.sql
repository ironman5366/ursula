-- Rename the old columns "book_id" to "legacy_book_id" and make them nullable
ALTER TABLE reading_list_items RENAME COLUMN book_id TO legacy_book_id;
ALTER TABLE reading_list_items ALTER COLUMN legacy_book_id DROP NOT NULL;

ALTER TABLE reviews RENAME COLUMN book_id TO legacy_book_id;
ALTER TABLE reviews ALTER COLUMN legacy_book_id DROP NOT NULL;

ALTER TABLE currently_reading_items RENAME COLUMN book_id TO legacy_book_id;
ALTER TABLE currently_reading_items ALTER COLUMN legacy_book_id DROP NOT NULL;

ALTER TABLE recommendations RENAME COLUMN book_id TO legacy_book_id;
ALTER TABLE recommendations ALTER COLUMN legacy_book_id DROP NOT NULL;

-- Change the foreign keys
ALTER TABLE reading_list_items ADD COLUMN IF NOT EXISTS ol_book_id INTEGER REFERENCES ol_books (id);
UPDATE reading_list_items SET ol_book_id = (SELECT legacy_book_mappings.ol_book_id FROM legacy_book_mappings WHERE legacy_book_mappings.legacy_book_id = reading_list_items.legacy_book_id LIMIT 1) WHERE reading_list_items.ol_book_id IS NULL;

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ol_book_id INTEGER REFERENCES ol_books (id);
UPDATE reviews SET ol_book_id = (SELECT legacy_book_mappings.ol_book_id FROM legacy_book_mappings WHERE legacy_book_mappings.legacy_book_id = reviews.legacy_book_id LIMIT 1) WHERE reviews.ol_book_id IS NULL;

ALTER TABLE currently_reading_items ADD COLUMN IF NOT EXISTS ol_book_id INTEGER REFERENCES ol_books (id);
UPDATE currently_reading_items SET ol_book_id = (SELECT legacy_book_mappings.ol_book_id FROM legacy_book_mappings WHERE legacy_book_mappings.legacy_book_id = currently_reading_items.legacy_book_id LIMIT 1) WHERE currently_reading_items.ol_book_id IS NULL;

ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS ol_book_id INTEGER REFERENCES ol_books (id);
UPDATE recommendations SET ol_book_id = (SELECT legacy_book_mappings.ol_book_id FROM legacy_book_mappings WHERE legacy_book_mappings.legacy_book_id = recommendations.legacy_book_id LIMIT 1) WHERE recommendations.ol_book_id IS NULL;
