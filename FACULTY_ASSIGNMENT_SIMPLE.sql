-- Simplified Faculty-Student Assignment System
-- Works with your existing student_data table structure

-- =====================================================
-- 1. FACULTY ASSIGNMENT TABLES
-- =====================================================

-- Faculty role assignments table
CREATE TABLE IF NOT EXISTS faculty_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    year VARCHAR(20) NOT NULL, -- '1st Year', '2nd Year', '3rd Year', '4th Year'
    role VARCHAR(20) NOT NULL CHECK (role IN ('coordinator', 'counsellor')),
    max_students INTEGER, -- For counsellors, NULL for coordinators
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure only one coordinator per year
    UNIQUE(year, role) WHERE role = 'coordinator',
    
    -- Ensure faculty can only have one role per year
    UNIQUE(faculty_id, year)
);

-- Student-counsellor assignments table (only for counsellors)
CREATE TABLE IF NOT EXISTS student_counsellor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_ht_no VARCHAR(50) NOT NULL, -- Reference to student_data.ht_no
    counsellor_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    year VARCHAR(20) NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure student is only assigned to one counsellor per year
    UNIQUE(student_ht_no, year),
    
    -- Ensure counsellor is assigned to this year
    FOREIGN KEY (counsellor_id, year) REFERENCES faculty_assignments(faculty_id, year)
);

-- =====================================================
-- 2. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_faculty_assignments_year_role ON faculty_assignments(year, role);
CREATE INDEX IF NOT EXISTS idx_faculty_assignments_faculty_id ON faculty_assignments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_student_counsellor_assignments_student_ht_no ON student_counsellor_assignments(student_ht_no);
CREATE INDEX IF NOT EXISTS idx_student_counsellor_assignments_counsellor_id ON student_counsellor_assignments(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_student_counsellor_assignments_year ON student_counsellor_assignments(year);

-- =====================================================
-- 3. FUNCTIONS FOR AUTOMATIC ASSIGNMENTS
-- =====================================================

-- Function to automatically assign students to counsellors for a given year
CREATE OR REPLACE FUNCTION assign_students_to_counsellors(target_year VARCHAR(20))
RETURNS VOID AS $$
DECLARE
    counsellor_record RECORD;
    student_record RECORD;
    students_per_counsellor INTEGER;
    current_count INTEGER;
    counsellor_id UUID;
BEGIN
    -- Get all counsellors for the target year
    FOR counsellor_record IN 
        SELECT fa.faculty_id, fa.max_students
        FROM faculty_assignments fa
        WHERE fa.year = target_year AND fa.role = 'counsellor'
        ORDER BY fa.max_students DESC
    LOOP
        -- Get students for this year that aren't already assigned
        FOR student_record IN
            SELECT sd.ht_no, sd.student_name
            FROM student_data sd
            LEFT JOIN student_counsellor_assignments sca ON sd.ht_no = sca.student_ht_no AND sca.year = target_year
            WHERE sd.year = target_year AND sca.id IS NULL
            ORDER BY sd.ht_no
            LIMIT counsellor_record.max_students
        LOOP
            -- Assign student to this counsellor
            INSERT INTO student_counsellor_assignments (student_ht_no, counsellor_id, year)
            VALUES (student_record.ht_no, counsellor_record.faculty_id, target_year);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to get students visible to a faculty member
CREATE OR REPLACE FUNCTION get_visible_students_for_faculty(faculty_uuid UUID)
RETURNS TABLE (
    ht_no VARCHAR(50),
    student_name VARCHAR(255),
    year VARCHAR(20),
    branch VARCHAR(100),
    role VARCHAR(20),
    assignment_type VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sd.ht_no,
        sd.student_name,
        sd.year,
        sd.branch,
        fa.role,
        CASE 
            WHEN fa.role = 'coordinator' THEN 'All students in year'
            ELSE 'Assigned subset'
        END as assignment_type
    FROM faculty_assignments fa
    JOIN student_data sd ON fa.year = sd.year
    LEFT JOIN student_counsellor_assignments sca ON sd.ht_no = sca.student_ht_no AND sca.year = fa.year
    WHERE fa.faculty_id = faculty_uuid
    AND (
        -- Coordinator sees all students in their year
        (fa.role = 'coordinator') 
        OR 
        -- Counsellor sees only assigned students
        (fa.role = 'counsellor' AND sca.counsellor_id = faculty_uuid)
    )
    ORDER BY sd.ht_no;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. SAMPLE FACULTY ASSIGNMENTS
-- =====================================================

-- Assign faculty roles for different years (assuming you have faculty table)
-- Uncomment and modify these based on your actual faculty data

/*
INSERT INTO faculty_assignments (faculty_id, year, role, max_students) VALUES
-- Coordinators (one per year)
((SELECT id FROM faculty WHERE faculty_id = 'F001'), '1st Year', 'coordinator', NULL),
((SELECT id FROM faculty WHERE faculty_id = 'F002'), '2nd Year', 'coordinator', NULL),
((SELECT id FROM faculty WHERE faculty_id = 'F003'), '3rd Year', 'coordinator', NULL),
((SELECT id FROM faculty WHERE faculty_id = 'F004'), '4th Year', 'coordinator', NULL),

-- Counsellors (multiple per year)
((SELECT id FROM faculty WHERE faculty_id = 'F001'), '1st Year', 'counsellor', 15),
((SELECT id FROM faculty WHERE faculty_id = 'F002'), '1st Year', 'counsellor', 15),
((SELECT id FROM faculty WHERE faculty_id = 'F003'), '2nd Year', 'counsellor', 20),
((SELECT id FROM faculty WHERE faculty_id = 'F004'), '2nd Year', 'counsellor', 20),
((SELECT id FROM faculty WHERE faculty_id = 'F005'), '3rd Year', 'counsellor', 18),
((SELECT id FROM faculty WHERE faculty_id = 'F001'), '3rd Year', 'counsellor', 18),
((SELECT id FROM faculty WHERE faculty_id = 'F002'), '4th Year', 'counsellor', 22),
((SELECT id FROM faculty WHERE faculty_id = 'F003'), '4th Year', 'counsellor', 22)
ON CONFLICT (faculty_id, year) DO NOTHING;
*/

-- =====================================================
-- 5. USEFUL QUERIES FOR YOUR SYSTEM
-- =====================================================

-- Query 1: Get all faculty assignments with student counts
SELECT 
    f.name as faculty_name,
    f.faculty_id,
    fa.year,
    fa.role,
    fa.max_students,
    CASE 
        WHEN fa.role = 'coordinator' THEN 
            (SELECT COUNT(*) FROM student_data sd WHERE sd.year = fa.year)
        ELSE 
            (SELECT COUNT(*) FROM student_counsellor_assignments sca 
             WHERE sca.counsellor_id = fa.faculty_id AND sca.year = fa.year)
    END as current_student_count
FROM faculty f
JOIN faculty_assignments fa ON f.id = fa.faculty_id
ORDER BY fa.year, fa.role, f.name;

-- Query 2: Get unassigned students for 4th year
SELECT 
    sd.ht_no,
    sd.student_name,
    sd.year,
FROM student_data sd
LEFT JOIN student_counsellor_assignments sca ON sd.ht_no = sca.student_ht_no AND sca.year = sd.year
WHERE sd.year = '4th Year' AND sca.id IS NULL
ORDER BY sd.ht_no;

-- Query 3: Get students assigned to a specific counsellor
SELECT 
    sd.ht_no,
    sd.student_name,
    sd.year,
    sca.assigned_at
FROM student_data sd
JOIN student_counsellor_assignments sca ON sd.ht_no = sca.student_ht_no
JOIN faculty f ON sca.counsellor_id = f.id
WHERE f.faculty_id = 'F002' AND sca.year = '1st Year'
ORDER BY sd.ht_no;

-- Query 4: Check if a faculty has any assignments
SELECT 
    f.name,
    f.faculty_id,
    CASE 
        WHEN COUNT(fa.id) > 0 THEN 'Has assignments'
        ELSE 'No assignments'
    END as assignment_status
FROM faculty f
LEFT JOIN faculty_assignments fa ON f.id = fa.faculty_id
GROUP BY f.id, f.name, f.faculty_id
ORDER BY f.name;

-- Query 5: Get year-wise student distribution
SELECT 
    sd.year,
    COUNT(*) as total_students,
    COUNT(sca.id) as assigned_students,
    COUNT(*) - COUNT(sca.id) as unassigned_students
FROM student_data sd
LEFT JOIN student_counsellor_assignments sca ON sd.ht_no = sca.student_ht_no AND sca.year = sd.year
GROUP BY sd.year
ORDER BY sd.year;

-- =====================================================
-- 6. AUTOMATIC ASSIGNMENT EXECUTION
-- =====================================================

-- Execute automatic assignments for all years (after setting up faculty assignments)
-- SELECT assign_students_to_counsellors('1st Year');
-- SELECT assign_students_to_counsellors('2nd Year');
-- SELECT assign_students_to_counsellors('3rd Year');
-- SELECT assign_students_to_counsellors('4th Year');

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Verify assignments were created
SELECT 
    f.name as counsellor_name,
    fa.year,
    COUNT(sca.id) as assigned_students,
    fa.max_students as max_allowed
FROM faculty_assignments fa
JOIN faculty f ON fa.faculty_id = f.id
LEFT JOIN student_counsellor_assignments sca ON fa.faculty_id = sca.counsellor_id AND sca.year = fa.year
WHERE fa.role = 'counsellor'
GROUP BY f.id, f.name, fa.year, fa.max_students
ORDER BY fa.year, f.name;

-- Test the visibility function for a specific faculty (after setting up assignments)
-- SELECT * FROM get_visible_students_for_faculty(
--     (SELECT id FROM faculty WHERE faculty_id = 'F002')
-- );
