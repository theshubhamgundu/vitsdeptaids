-- Setup Storage Buckets for Profile Photos and Documents
-- Run this in your Supabase SQL Editor

-- 1. Create storage buckets if they don't exist
-- Note: Storage buckets are created through the Supabase dashboard, not SQL
-- Go to Storage > Create a new bucket for each of these:

-- Bucket: "profiles" (for profile photos)
-- Public bucket: true
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- Bucket: "documents" (for certificates, materials, etc.)
-- Public bucket: true
-- File size limit: 10MB
-- Allowed MIME types: application/pdf, image/*, text/*

-- Bucket: "materials" (for study materials)
-- Public bucket: true
-- File size limit: 10MB
-- Allowed MIME types: application/pdf, image/*, text/*

-- 2. Set up Row Level Security (RLS) policies for the profiles bucket
-- This allows users to upload their own profile photos

-- Policy for profiles bucket - allow authenticated users to upload their own photos
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow users to upload their own profile photos',
  (SELECT id FROM storage.buckets WHERE name = 'profiles'),
  '(
    bucket_id = (SELECT id FROM storage.buckets WHERE name = ''profiles'')
    AND auth.uid()::text = (storage.foldername(name))[1]
  )'
) ON CONFLICT DO NOTHING;

-- Policy for profiles bucket - allow public read access
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow public read access to profile photos',
  (SELECT id FROM storage.buckets WHERE name = 'profiles'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''profiles'')'
) ON CONFLICT DO NOTHING;

-- 3. Set up RLS policies for the documents bucket
-- Allow authenticated users to upload documents

INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow authenticated users to upload documents',
  (SELECT id FROM storage.buckets WHERE name = 'documents'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''documents'') AND auth.role() = ''authenticated'''
) ON CONFLICT DO NOTHING;

-- Policy for documents bucket - allow public read access
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow public read access to documents',
  (SELECT id FROM storage.buckets WHERE name = 'documents'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''documents'')'
) ON CONFLICT DO NOTHING;

-- 4. Set up RLS policies for the materials bucket
-- Allow faculty to upload study materials

INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow faculty to upload study materials',
  (SELECT id FROM storage.buckets WHERE name = 'materials'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''materials'') AND auth.role() = ''authenticated'''
) ON CONFLICT DO NOTHING;

-- Policy for materials bucket - allow public read access
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow public read access to study materials',
  (SELECT id FROM storage.buckets WHERE name = 'materials'),
  'bucket_id = (SELECT id FROM storage.buckets WHERE name = ''materials'')'
) ON CONFLICT DO NOTHING;

-- 5. Check if buckets exist
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials');

-- 6. Check if policies exist
SELECT 
    p.name as policy_name,
    b.name as bucket_name,
    p.definition
FROM storage.policies p
JOIN storage.buckets b ON p.bucket_id = b.id
WHERE b.name IN ('profiles', 'documents', 'materials');
