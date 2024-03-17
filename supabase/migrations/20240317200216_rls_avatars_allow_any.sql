DROP POLICY IF EXISTS "Allow avatar uploads" ON storage.objects;

-- Allow anybody to do anything on the storage.objects table
CREATE POLICY "Do anything with avatars" ON "storage"."objects" FOR ALL USING (true)
