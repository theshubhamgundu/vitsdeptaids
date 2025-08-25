-- Test Faculty Assignments and Add Sample Data
-- Run this in your Supabase SQL Editor to test the faculty assignment system

-- 1. First, let's check what faculty we have
SELECT id, faculty_id, name, email FROM faculty LIMIT 5;

-- 2. Check what students we have in student_data
SELECT COUNT(*) as total_students FROM student_data;
SELECT DISTINCT year FROM student_data ORDER BY year;

-- 3. Check existing faculty assignments
SELECT 
    fa.id,
    fa.faculty_id,
    f.name as faculty_name,
    fa.year,
    fa.role,
    fa.max_students
FROM faculty_assignments fa
JOIN faculty f ON fa.faculty_id = f.id
ORDER BY fa.year, fa.role;

-- 4. Check existing student-counsellor assignments
SELECT 
    sca.id,
    sca.student_ht_no,
    sca.counsellor_id,
    f.name as counsellor_name,
    sca.year,
    sca.assigned_at
FROM student_counsellor_assignments sca
JOIN faculty f ON sca.counsellor_id = f.id
ORDER BY sca.year, sca.student_ht_no;

-- 5. Add a test faculty assignment (replace with actual faculty ID)
-- First, get a faculty ID to use
SELECT id, faculty_id, name FROM faculty WHERE faculty_id LIKE '%AIDS%' LIMIT 1;

-- Then add a coordinator assignment (replace 'FACULTY_UUID_HERE' with actual UUID)
-- INSERT INTO faculty_assignments (faculty_id, year, role, max_students) VALUES
-- ('FACULTY_UUID_HERE', '4th Year', 'coordinator', NULL);

-- 6. Add a test counsellor assignment (replace with actual faculty ID)
-- INSERT INTO faculty_assignments (faculty_id, year, role, max_students) VALUES
-- ('FACULTY_UUID_HERE', '4th Year', 'counsellor', 20);

-- 7. Add some student-counsellor assignments (replace with actual faculty ID)
-- INSERT INTO student_counsellor_assignments (student_ht_no, counsellor_id, year, assigned_at) VALUES
-- ('22891A7201', 'FACULTY_UUID_HERE', '4th Year', NOW()),
-- ('22891A7202', 'FACULTY_UUID_HERE', '4th Year', NOW()),
-- ('22891A7203', 'FACULTY_UUID_HERE', '4th Year', NOW());

-- 8. Test the RPC function (replace with actual faculty UUID)
-- SELECT * FROM get_visible_students_for_faculty('FACULTY_UUID_HERE');

-- 9. Check if the RPC function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_visible_students_for_faculty';
