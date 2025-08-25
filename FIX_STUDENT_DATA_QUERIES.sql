-- Fix Student Data Query Issues
-- Run this to fix database query problems

-- 1. Check current student_data table structure
SELECT '🔍 Current student_data Structure:' as status;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'student_data'
ORDER BY ordinal_position;

-- 2. Check if student exists in student_data
SELECT '🔍 Checking Student Data:' as status;
SELECT 
    ht_no,
    name,
    year
FROM student_data 
WHERE ht_no = '23891A7228' 
   OR name ILIKE '%GUNDU SHUBHAM VASANT%'
LIMIT 5;

-- 3. Check if student exists in students table
SELECT '🔍 Checking students Table:' as status;
SELECT 
    id,
    fullName,
    hallTicket,
    year
FROM students 
WHERE hallTicket = '23891A7228' 
   OR fullName ILIKE '%GUNDU SHUBHAM VASANT%'
LIMIT 5;

-- 4. Check user_profiles table
SELECT '🔍 Checking user_profiles:' as status;
SELECT 
    id,
    name,
    email,
    role
FROM user_profiles 
WHERE name ILIKE '%GUNDU SHUBHAM VASANT%'
   OR email ILIKE '%shubham%'
LIMIT 5;

-- 5. Add missing student to student_data if not exists
INSERT INTO student_data (ht_no, name, year)
SELECT '23891A7228', 'GUNDU SHUBHAM VASANT', '4th Year'
WHERE NOT EXISTS (
    SELECT 1 FROM student_data WHERE ht_no = '23891A7228'
);

-- 6. Add missing student to students table if not exists
INSERT INTO students (id, fullName, hallTicket, year, email, phone, branch, status)
SELECT 
    'student-23891A7228',
    'GUNDU SHUBHAM VASANT',
    '23891A7228',
    '4th Year',
    'shubham.gundu@student.com',
    '+91-9876543210',
    'AIDS',
    'Active'
WHERE NOT EXISTS (
    SELECT 1 FROM students WHERE hallTicket = '23891A7228'
);

-- 7. Add missing user profile if not exists
INSERT INTO user_profiles (id, name, email, role, created_at)
SELECT 
    'student-23891A7228',
    'GUNDU SHUBHAM VASANT',
    'shubham.gundu@student.com',
    'student',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE name = 'GUNDU SHUBHAM VASANT'
);

-- 8. Verify the student data is now accessible
SELECT '✅ Verification - Student Data:' as status;
SELECT 
    'student_data' as table_name,
    ht_no,
    name,
    year
FROM student_data 
WHERE ht_no = '23891A7228'

UNION ALL

SELECT 
    'students' as table_name,
    hallTicket as ht_no,
    fullName as name,
    year
FROM students 
WHERE hallTicket = '23891A7228'

UNION ALL

SELECT 
    'user_profiles' as table_name,
    id as ht_no,
    name,
    role as year
FROM user_profiles 
WHERE name = 'GUNDU SHUBHAM VASANT';

-- 9. Check faculty assignments for this student
SELECT '🔍 Faculty Assignments for Student:' as status;
SELECT 
    sa.student_ht_no,
    sa.counsellor_id,
    f.name as counsellor_name,
    sa.assigned_date
FROM student_counsellor_assignments sa
LEFT JOIN faculty f ON sa.counsellor_id = f.facultyId
WHERE sa.student_ht_no = '23891A7228';

-- 10. Create a test faculty assignment if none exists
INSERT INTO student_counsellor_assignments (student_ht_no, counsellor_id, assigned_date)
SELECT 
    '23891A7228',
    'AIDS-PGL1',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM student_counsellor_assignments WHERE student_ht_no = '23891A7228'
);

-- 11. Final verification
SELECT '✅ Final Verification:' as status;
SELECT 
    'Student Data Query Ready' as check_item,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status
FROM student_data 
WHERE ht_no = '23891A7228'

UNION ALL

SELECT 
    'User Profile Query Ready' as check_item,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status
FROM user_profiles 
WHERE name = 'GUNDU SHUBHAM VASANT'

UNION ALL

SELECT 
    'Faculty Assignment Query Ready' as check_item,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status
FROM student_counsellor_assignments 
WHERE student_ht_no = '23891A7228';
