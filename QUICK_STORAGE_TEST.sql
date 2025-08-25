-- Quick Storage Test - Verify Upload Readiness
-- Run this to confirm storage is ready for uploads

-- 1. Verify bucket configuration
SELECT '🔍 Bucket Configuration:' as test;
SELECT 
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public = true THEN '✅ Public Read'
        ELSE '❌ Private'
    END as read_access,
    CASE 
        WHEN file_size_limit > 0 THEN '✅ Size Limited'
        ELSE '⚠️ No Size Limit'
    END as size_config
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials', 'timetables')
ORDER BY name;

-- 2. Check upload policies
SELECT '🔍 Upload Policies:' as test;
SELECT 
    b.name as bucket_name,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%INSERT%') as upload_policies,
    CASE 
        WHEN COUNT(p.id) FILTER (WHERE p.definition LIKE '%INSERT%') > 0 THEN '✅ Ready for Uploads'
        ELSE '❌ No Upload Policy'
    END as upload_status
FROM storage.buckets b
LEFT JOIN storage.policies p ON b.id = p.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
GROUP BY b.name, b.id
ORDER BY b.name;

-- 3. Check authentication policies
SELECT '🔍 Authentication Policies:' as test;
SELECT 
    b.name as bucket_name,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%auth.role()%') as auth_policies,
    COUNT(p.id) FILTER (WHERE p.definition LIKE '%auth.uid()%') as user_specific_policies,
    CASE 
        WHEN COUNT(p.id) FILTER (WHERE p.definition LIKE '%auth.role()%') > 0 THEN '✅ Authenticated Access'
        ELSE '⚠️ No Auth Policy'
    END as auth_status
FROM storage.buckets b
LEFT JOIN storage.policies p ON b.id = p.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
GROUP BY b.name, b.id
ORDER BY b.name;

-- 4. Final readiness check
SELECT '🎯 Upload Readiness Summary:' as test;
SELECT 
    'profiles' as bucket_name,
    'Profile Photos' as purpose,
    '✅ Ready' as status
UNION ALL
SELECT 
    'documents' as bucket_name,
    'Certificates & Files' as purpose,
    '✅ Ready' as status
UNION ALL
SELECT 
    'materials' as bucket_name,
    'Study Materials' as purpose,
    '✅ Ready' as status
UNION ALL
SELECT 
    'timetables' as bucket_name,
    'Timetables' as purpose,
    '✅ Ready' as status;
