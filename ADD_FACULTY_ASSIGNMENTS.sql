-- Add Faculty Assignments for Testing
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what faculty we have
SELECT id, faculty_id, name, email FROM faculty WHERE name LIKE '%Lavanya%' OR faculty_id LIKE '%AIDS%';

-- 2. Let's see what students we have in 3rd Year (since the screenshot shows 3rd Year)
SELECT COUNT(*) as total_3rd_year FROM student_data WHERE year = '3rd Year';
SELECT ht_no, student_name FROM student_data WHERE year = '3rd Year' LIMIT 5;

-- 3. Add faculty assignment for Mrs. G. Lavanya (replace FACULTY_UUID with actual UUID from step 1)
-- First, get the faculty UUID:
-- SELECT id FROM faculty WHERE name LIKE '%Lavanya%' OR faculty_id LIKE '%AIDS%' LIMIT 1;

-- Then add the assignment (uncomment and replace FACULTY_UUID):
/*
INSERT INTO faculty_assignments (faculty_id, year, role, max_students) VALUES
('FACULTY_UUID_HERE', '3rd Year', 'counsellor', 25)
ON CONFLICT (faculty_id, year) DO NOTHING;
*/

-- 4. Add some student-counsellor assignments (replace FACULTY_UUID):
/*
INSERT INTO student_counsellor_assignments (student_ht_no, counsellor_id, year, assigned_at) VALUES
('23891A7228', 'FACULTY_UUID_HERE', '3rd Year', NOW()),
('23891A7229', 'FACULTY_UUID_HERE', '3rd Year', NOW()),
('23891A7230', 'FACULTY_UUID_HERE', '3rd Year', NOW()),
('23891A7231', 'FACULTY_UUID_HERE', '3rd Year', NOW()),
('23891A7232', 'FACULTY_UUID_HERE', '3rd Year', NOW()),
('23891A7233', 'FACULTY_UUID_HERE', '3rd Year', NOW()),
('23891A7234', 'FACULTY_UUID_HERE', '3rd Year', NOW()),
('23891A7235', 'FACULTY_UUID_HERE', '3rd Year', NOW())
ON CONFLICT (student_ht_no, year) DO NOTHING;
*/

-- 5. Verify the assignments were created
SELECT 
    f.name as faculty_name,
    fa.year,
    fa.role,
    COUNT(sca.id) as assigned_students
FROM faculty_assignments fa
JOIN faculty f ON fa.faculty_id = f.id
LEFT JOIN student_counsellor_assignments sca ON fa.faculty_id = sca.counsellor_id AND fa.year = sca.year
WHERE f.name LIKE '%Lavanya%' OR f.faculty_id LIKE '%AIDS%'
GROUP BY f.id, f.name, fa.year, fa.role;

-- 6. Test the visibility function (replace FACULTY_UUID):
-- SELECT * FROM get_visible_students_for_faculty('FACULTY_UUID_HERE');

-- 7. Check if the RPC function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_visible_students_for_faculty';
