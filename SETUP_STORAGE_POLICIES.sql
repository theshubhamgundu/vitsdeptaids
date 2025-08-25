-- Setup Storage Policies for Profile Photos and Documents
-- Run this AFTER creating the buckets in the Supabase Dashboard

-- 1. Check if buckets exist
SELECT 'Checking storage buckets...' as step;
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials');

-- 2. Set up RLS policies for profiles bucket
-- Allow authenticated users to upload their own profile photos
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow users to upload their own profile photos',
  (SELECT id FROM storage.buckets WHERE name = 'profiles'),
  '(
    bucket_id = (SELECT id FROM storage.buckets WHERE name = ''profiles'')
    AND auth.uid()::text = (storage.foldername(name))[1]
  )'
) ON CONFLICT DO NOTHING;

-- Allow public read access to profile photos
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow public read access to profile photos',
  (SELECT id FROM storage.buckets WHERE name = 'profiles'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''profiles'')'
) ON CONFLICT DO NOTHING;

-- 3. Set up RLS policies for documents bucket
-- Allow authenticated users to upload documents
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow authenticated users to upload documents',
  (SELECT id FROM storage.buckets WHERE name = 'documents'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''documents'') AND auth.role() = ''authenticated'''
) ON CONFLICT DO NOTHING;

-- Allow public read access to documents
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow public read access to documents',
  (SELECT id FROM storage.buckets WHERE name = 'documents'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''documents'')'
) ON CONFLICT DO NOTHING;

-- 4. Set up RLS policies for materials bucket
-- Allow authenticated users to upload study materials
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow authenticated users to upload study materials',
  (SELECT id FROM storage.buckets WHERE name = 'materials'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''materials'') AND auth.role() = ''authenticated'''
) ON CONFLICT DO NOTHING;

-- Allow public read access to study materials
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow public read access to study materials',
  (SELECT id FROM storage.buckets WHERE name = 'materials'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''materials'')'
) ON CONFLICT DO NOTHING;

-- 5. Verify policies were created
SELECT 'Verifying storage policies...' as step;
SELECT 
    p.name as policy_name,
    b.name as bucket_name,
    p.definition
FROM storage.policies p
JOIN storage.buckets b ON p.bucket_id = b.id
WHERE b.name IN ('profiles', 'documents', 'materials')
ORDER BY b.name, p.name;
