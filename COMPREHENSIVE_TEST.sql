-- Comprehensive Test - Verify All Fixes
-- Run this to test everything is working properly

-- 1. Test Storage Buckets
SELECT '🧪 Testing Storage Buckets:' as test;
SELECT 
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public = true AND file_size_limit > 0 THEN '✅ Ready'
        ELSE '❌ Not Ready'
    END as status
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials', 'timetables')
ORDER BY name;

-- 2. Test Storage Policies
SELECT '🧪 Testing Storage Policies:' as test;
SELECT 
    b.name as bucket_name,
    COUNT(p.id) as total_policies,
    CASE 
        WHEN COUNT(p.id) >= 4 THEN '✅ Complete'
        ELSE '❌ Incomplete'
    END as policy_status
FROM storage.buckets b
LEFT JOIN storage.policies p ON b.id = p.bucket_id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')
GROUP BY b.name, b.id
ORDER BY b.name;

-- 3. Test Student Data
SELECT '🧪 Testing Student Data:' as test;
SELECT 
    'student_data' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Has Data'
        ELSE '❌ No Data'
    END as status
FROM student_data 
WHERE ht_no = '23891A7228'

UNION ALL

SELECT 
    'students' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Has Data'
        ELSE '❌ No Data'
    END as status
FROM students 
WHERE hallTicket = '23891A7228'

UNION ALL

SELECT 
    'user_profiles' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Has Data'
        ELSE '❌ No Data'
    END as status
FROM user_profiles 
WHERE name = 'GUNDU SHUBHAM VASANT';

-- 4. Test Faculty Assignments
SELECT '🧪 Testing Faculty Assignments:' as test;
SELECT 
    COUNT(*) as assignment_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Assigned'
        ELSE '❌ Not Assigned'
    END as status
FROM student_counsellor_assignments 
WHERE student_ht_no = '23891A7228';

-- 5. Test Database Queries (Simulate App Queries)
SELECT '🧪 Testing Database Queries:' as test;

-- Test student_data query
SELECT 
    'student_data query' as query_name,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Working'
        ELSE '❌ Failed'
    END as status
FROM student_data 
WHERE ht_no = '23891A7228'

UNION ALL

-- Test students query
SELECT 
    'students query' as query_name,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Working'
        ELSE '❌ Failed'
    END as status
FROM students 
WHERE hallTicket = '23891A7228'

UNION ALL

-- Test user_profiles query
SELECT 
    'user_profiles query' as query_name,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Working'
        ELSE '❌ Failed'
    END as status
FROM user_profiles 
WHERE name = 'GUNDU SHUBHAM VASANT'

UNION ALL

-- Test faculty assignment query
SELECT 
    'faculty assignment query' as query_name,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Working'
        ELSE '❌ Failed'
    END as status
FROM student_counsellor_assignments 
WHERE student_ht_no = '23891A7228';

-- 6. Test Storage Upload Capability
SELECT '🧪 Testing Storage Upload Capability:' as test;
SELECT 
    'profiles' as bucket,
    'Profile Photos' as purpose,
    CASE 
        WHEN public = true THEN '✅ Ready for Upload'
        ELSE '❌ Not Ready'
    END as upload_status
FROM storage.buckets 
WHERE name = 'profiles'

UNION ALL

SELECT 
    'documents' as bucket,
    'Certificates & Files' as purpose,
    CASE 
        WHEN public = true THEN '✅ Ready for Upload'
        ELSE '❌ Not Ready'
    END as upload_status
FROM storage.buckets 
WHERE name = 'documents'

UNION ALL

SELECT 
    'materials' as bucket,
    'Study Materials' as purpose,
    CASE 
        WHEN public = true THEN '✅ Ready for Upload'
        ELSE '❌ Not Ready'
    END as upload_status
FROM storage.buckets 
WHERE name = 'materials';

-- 7. Final Summary
SELECT '🎯 Final Test Summary:' as test;
SELECT 
    'Storage Buckets' as component,
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ All 4 Buckets Ready'
        ELSE '❌ Missing Buckets'
    END as status
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials', 'timetables')

UNION ALL

SELECT 
    'Storage Policies' as component,
    CASE 
        WHEN COUNT(*) >= 16 THEN '✅ All Policies Set'
        ELSE '❌ Missing Policies'
    END as status
FROM storage.policies p
JOIN storage.buckets b ON p.bucket_id = b.id
WHERE b.name IN ('profiles', 'documents', 'materials', 'timetables')

UNION ALL

SELECT 
    'Student Data' as component,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Student Data Available'
        ELSE '❌ No Student Data'
    END as status
FROM student_data 
WHERE ht_no = '23891A7228'

UNION ALL

SELECT 
    'Faculty Assignments' as component,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Assignments Exist'
        ELSE '❌ No Assignments'
    END as status
FROM student_counsellor_assignments 
WHERE student_ht_no = '23891A7228';

-- 8. Ready for Testing
SELECT '🚀 Ready for Application Testing:' as test;
SELECT 
    'Profile Photo Upload' as feature,
    'Try uploading a profile photo in the app' as instruction,
    'Should work without 400/406 errors' as expected_result
UNION ALL
SELECT 
    'Student Data Loading' as feature,
    'Check student dashboard and profile' as instruction,
    'Should load student data without errors' as expected_result
UNION ALL
SELECT 
    'Faculty Assignment Display' as feature,
    'Check faculty dashboard for assigned students' as instruction,
    'Should show assigned students correctly' as expected_result;
