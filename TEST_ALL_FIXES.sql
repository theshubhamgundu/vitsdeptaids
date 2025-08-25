-- Test All Fixes - Comprehensive Verification Script
-- Run this in your Supabase SQL Editor to verify everything is working

-- 1. Test student_data table
SELECT 'Testing student_data table...' as test_step;
SELECT COUNT(*) as total_students FROM student_data;
SELECT ht_no, student_name, year FROM student_data LIMIT 3;

-- 2. Test faculty table
SELECT 'Testing faculty table...' as test_step;
SELECT COUNT(*) as total_faculty FROM faculty;
SELECT id, name, faculty_id FROM faculty LIMIT 3;

-- 3. Test faculty_assignments table
SELECT 'Testing faculty_assignments table...' as test_step;
SELECT COUNT(*) as total_assignments FROM faculty_assignments;
SELECT 
    fa.id,
    fa.faculty_id,
    f.name as faculty_name,
    fa.year,
    fa.role
FROM faculty_assignments fa
JOIN faculty f ON fa.faculty_id = f.id
LIMIT 5;

-- 4. Test student_counsellor_assignments table
SELECT 'Testing student_counsellor_assignments table...' as test_step;
SELECT COUNT(*) as total_student_assignments FROM student_counsellor_assignments;
SELECT 
    sca.student_ht_no,
    sca.counsellor_id,
    f.name as counsellor_name,
    sca.year
FROM student_counsellor_assignments sca
JOIN faculty f ON sca.counsellor_id = f.id
LIMIT 5;

-- 5. Test the RPC function
SELECT 'Testing get_visible_students_for_faculty function...' as test_step;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_visible_students_for_faculty';

-- 6. Test storage buckets
SELECT 'Testing storage buckets...' as test_step;
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name IN ('profiles', 'documents', 'materials');

-- 7. Test storage policies
SELECT 'Testing storage policies...' as test_step;
SELECT 
    p.name as policy_name,
    b.name as bucket_name
FROM storage.policies p
JOIN storage.buckets b ON p.bucket_id = b.id
WHERE b.name IN ('profiles', 'documents', 'materials');

-- 8. Test a sample faculty assignment (replace with actual faculty ID)
SELECT 'Testing sample faculty assignment...' as test_step;
-- First, get a faculty ID
SELECT id, name, faculty_id FROM faculty LIMIT 1;

-- Then test the assignment (uncomment and replace FACULTY_UUID with actual UUID)
/*
SELECT * FROM get_visible_students_for_faculty('FACULTY_UUID_HERE');
*/

-- 9. Summary report
SELECT 'Summary Report' as test_step;
SELECT 
    'student_data' as table_name,
    COUNT(*) as record_count
FROM student_data
UNION ALL
SELECT 
    'faculty' as table_name,
    COUNT(*) as record_count
FROM faculty
UNION ALL
SELECT 
    'faculty_assignments' as table_name,
    COUNT(*) as record_count
FROM faculty_assignments
UNION ALL
SELECT 
    'student_counsellor_assignments' as table_name,
    COUNT(*) as record_count
FROM student_counsellor_assignments;
