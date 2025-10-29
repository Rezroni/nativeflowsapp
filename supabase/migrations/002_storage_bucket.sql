-- Create storage bucket for chart images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chart-images', 'chart-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for chart-images bucket
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload chart images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chart-images');

-- Allow authenticated users to read their own images
CREATE POLICY "Users can read their own chart images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chart-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access (for sharing analyses)
CREATE POLICY "Public can read chart images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'chart-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own chart images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'chart-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'chart-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own chart images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'chart-images' AND auth.uid()::text = (storage.foldername(name))[1]);
