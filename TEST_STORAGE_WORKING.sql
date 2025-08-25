-- Test Storage Setup - Verify Everything is Working
-- Run this to confirm your storage setup is complete

-- 1. Check all storage buckets
SELECT '✅ Storage Buckets Status:' as status;
SELECT 
    name,
    public,
    file_size_limit,
    CASE 
        WHEN name = 'profiles' THEN 'Profile Photos'
        WHEN name = 'documents' THEN 'Certificates & Files'
        WHEN name = 'materials' THEN 'Study Materials'
        WHEN name = 'timetables' THEN 'Timetables'
        ELSE 'Other'
    END as purpose
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials', 'timetables')
ORDER BY name;

-- 2. Check all policies for each bucket
SELECT '✅ Storage Policies Summary:' as status;
SELECT 
    b.name as bucket_name,
    COUNT(p.id) as total_policies,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%INSERT%') as upload_policies,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%SELECT%') as read_policies,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%UPDATE%') as update_policies,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%DELETE%') as delete_policies
FROM storage.buckets b
LEFT JOIN storage.policies p ON b.id = p.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
GROUP BY b.name, b.id
ORDER BY b.name;

-- 3. Detailed policy breakdown
SELECT '✅ Detailed Policy Analysis:' as status;
SELECT 
    b.name as bucket_name,
    p.name as policy_name,
    CASE 
        WHEN p.definition LIKE '%INSERT%' THEN '📤 Upload'
        WHEN p.definition LIKE '%SELECT%' THEN '👁️ Read'
        WHEN p.definition LIKE '%UPDATE%' THEN '✏️ Update'
        WHEN p.definition LIKE '%DELETE%' THEN '🗑️ Delete'
        ELSE '❓ Other'
    END as policy_type,
    CASE 
        WHEN p.definition LIKE '%auth.uid()%' THEN '🔐 User-specific'
        WHEN p.definition LIKE '%auth.role()%' THEN '🔑 Authenticated'
        WHEN p.definition LIKE '%public%' THEN '🌐 Public'
        ELSE '❓ Custom'
    END as access_level
FROM storage.buckets b
JOIN storage.policies p ON b.id = p.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
ORDER BY b.name, policy_type;

-- 4. Final verification
SELECT '✅ Setup Verification:' as status;
SELECT 
    'All Required Buckets' as check_item,
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ PASS'
        ELSE '❌ FAIL - Missing buckets'
    END as status,
    COUNT(*) as found_count,
    '4' as required_count
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials', 'timetables')

UNION ALL

SELECT 
    'All Buckets Have Policies' as check_item,
    CASE 
        WHEN COUNT(*) >= 12 THEN '✅ PASS'
        ELSE '❌ FAIL - Missing policies'
    END as status,
    COUNT(*) as found_count,
    '12+' as required_count
FROM storage.policies p
JOIN storage.buckets b ON p.bucket_id = b.id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')

UNION ALL

SELECT 
    'Public Read Access' as check_item,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ PASS'
        ELSE '❌ FAIL - Missing public read'
    END as status,
    COUNT(*) as found_count,
    '4' as required_count
FROM storage.policies p
JOIN storage.buckets b ON p.bucket_id = b.id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
AND p.definition LIKE '%SELECT%' AND p.definition LIKE '%public%';

-- 5. Test file count (if any exist)
SELECT '📁 Current Files in Storage:' as status;
SELECT 
    b.name as bucket_name,
    COUNT(f.id) as file_count,
    COALESCE(SUM(f.metadata->>'size')::bigint, 0) as total_size_bytes
FROM storage.buckets b
LEFT JOIN storage.objects f ON b.id = f.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
GROUP BY b.name, b.id
ORDER BY b.name;
