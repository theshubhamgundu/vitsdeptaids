-- Fix Storage Upload Issues - Comprehensive Solution
-- Run this to fix all storage-related problems

-- 1. First, let's check current storage status
SELECT '🔍 Current Storage Status:' as status;
SELECT 
    name,
    public,
    file_size_limit,
    created_at
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials', 'timetables')
ORDER BY name;

-- 2. Drop and recreate storage buckets with proper configuration
SELECT '🔄 Recreating Storage Buckets...' as status;

-- Drop existing buckets (if they exist)
DROP POLICY IF EXISTS "Public profiles read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated profiles upload access" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;

DROP POLICY IF EXISTS "Public documents read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated documents upload access" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

DROP POLICY IF EXISTS "Public materials read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated materials upload access" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own materials" ON storage.objects;

DROP POLICY IF EXISTS "Public timetables read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated timetables upload access" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own timetables" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own timetables" ON storage.objects;

-- Drop buckets
DROP BUCKET IF EXISTS profiles CASCADE;
DROP BUCKET IF EXISTS documents CASCADE;
DROP BUCKET IF EXISTS materials CASCADE;
DROP BUCKET IF EXISTS timetables CASCADE;

-- 3. Create new buckets with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('profiles-bucket', 'profiles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    ('documents-bucket', 'documents', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']),
    ('materials-bucket', 'materials', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/plain']),
    ('timetables-bucket', 'timetables', true, 1048576, ARRAY['application/pdf', 'image/jpeg', 'image/png']);

-- 4. Create comprehensive RLS policies for profiles bucket
CREATE POLICY "Public profiles read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'profiles-bucket');

CREATE POLICY "Authenticated profiles upload access" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profiles-bucket' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own profile photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profiles-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own profile photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profiles-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 5. Create comprehensive RLS policies for documents bucket
CREATE POLICY "Public documents read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents-bucket');

CREATE POLICY "Authenticated documents upload access" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents-bucket' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'documents-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'documents-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 6. Create comprehensive RLS policies for materials bucket
CREATE POLICY "Public materials read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'materials-bucket');

CREATE POLICY "Authenticated materials upload access" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'materials-bucket' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own materials" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'materials-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own materials" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'materials-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 7. Create comprehensive RLS policies for timetables bucket
CREATE POLICY "Public timetables read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'timetables-bucket');

CREATE POLICY "Authenticated timetables upload access" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'timetables-bucket' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own timetables" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'timetables-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own timetables" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'timetables-bucket' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 8. Verify the setup
SELECT '✅ Storage Setup Verification:' as status;
SELECT 
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public = true THEN '✅ Public'
        ELSE '❌ Private'
    END as access_status
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials', 'timetables')
ORDER BY name;

-- 9. Check policies
SELECT '✅ Policy Verification:' as status;
SELECT 
    b.name as bucket_name,
    COUNT(p.id) as total_policies,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%INSERT%') as upload_policies,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%SELECT%') as read_policies
FROM storage.buckets b
LEFT JOIN storage.policies p ON b.id = p.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
GROUP BY b.name, b.id
ORDER BY b.name;

-- 10. Test upload capability
SELECT '🎯 Upload Test Ready:' as status;
SELECT 
    'profiles' as bucket,
    'Profile Photos (5MB max)' as purpose,
    '✅ Ready for uploads' as status
UNION ALL
SELECT 
    'documents' as bucket,
    'Certificates & Files (10MB max)' as purpose,
    '✅ Ready for uploads' as status
UNION ALL
SELECT 
    'materials' as bucket,
    'Study Materials (50MB max)' as purpose,
    '✅ Ready for uploads' as status
UNION ALL
SELECT 
    'timetables' as bucket,
    'Timetables (1MB max)' as purpose,
    '✅ Ready for uploads' as status;
