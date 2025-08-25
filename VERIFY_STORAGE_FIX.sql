-- Verify Storage Setup - Quick Test
-- Run this after setting up storage buckets

-- 1. Check if storage buckets exist
SELECT 'Storage Buckets Status:' as info;
SELECT 
    name,
    public,
    file_size_limit,
    CASE 
        WHEN name = 'profiles' THEN '✅ Profile photos'
        WHEN name = 'documents' THEN '✅ Certificates & files'
        WHEN name = 'materials' THEN '✅ Study materials'
        ELSE '❓ Unknown'
    END as purpose
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials')
ORDER BY name;

-- 2. Check storage policies
SELECT 'Storage Policies Status:' as info;
SELECT 
    p.name as policy_name,
    b.name as bucket_name,
    CASE 
        WHEN p.definition LIKE '%auth.uid()%' THEN '✅ User-specific upload'
        WHEN p.definition LIKE '%public%' THEN '✅ Public read access'
        WHEN p.definition LIKE '%authenticated%' THEN '✅ Authenticated upload'
        ELSE '❓ Custom policy'
    END as policy_type
FROM storage.policies p
JOIN storage.buckets b ON p.bucket_id = b.id
WHERE b.name IN ('profiles', 'documents', 'materials')
ORDER BY b.name, p.name;

-- 3. Summary
SELECT 'Setup Summary:' as info;
SELECT 
    COUNT(*) as total_buckets,
    COUNT(*) FILTER (WHERE public = true) as public_buckets,
    COUNT(*) FILTER (WHERE file_size_limit > 0) as configured_buckets
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials');

-- 4. Test data (if any exists)
SELECT 'Test Files (if any):' as info;
SELECT 
    b.name as bucket_name,
    COUNT(f.id) as file_count
FROM storage.buckets b
LEFT JOIN storage.objects f ON b.id = f.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials')
GROUP BY b.name, b.id
ORDER BY b.name;
