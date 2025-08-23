-- Faculty-Student Assignment System Schema
-- This system supports coordinators (one per year) and counsellors (multiple per year)

-- =====================================================
-- 1. CORE TABLES
-- =====================================================

-- Faculty table (assuming you already have this)
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) DEFAULT 'AI & DS',
    designation VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student table (assuming you already have this)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ht_no VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    year VARCHAR(20) NOT NULL, -- '1st Year', '2nd Year', '3rd Year', '4th Year'
    section VARCHAR(10),
    branch VARCHAR(100) DEFAULT 'AI & DS',
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. ASSIGNMENT TABLES
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
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    counsellor_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    year VARCHAR(20) NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure student is only assigned to one counsellor per year
    UNIQUE(student_id, year),
    
    -- Ensure counsellor is assigned to this year
    FOREIGN KEY (counsellor_id, year) REFERENCES faculty_assignments(faculty_id, year)
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_faculty_assignments_year_role ON faculty_assignments(year, role);
CREATE INDEX IF NOT EXISTS idx_faculty_assignments_faculty_id ON faculty_assignments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_student_counsellor_assignments_student_id ON student_counsellor_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_counsellor_assignments_counsellor_id ON student_counsellor_assignments(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_student_counsellor_assignments_year ON student_counsellor_assignments(year);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(year);

-- =====================================================
-- 4. FUNCTIONS FOR AUTOMATIC ASSIGNMENTS
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
            SELECT s.id, s.ht_no, s.student_name
            FROM students s
            LEFT JOIN student_counsellor_assignments sca ON s.id = sca.student_id AND sca.year = target_year
            WHERE s.year = target_year AND sca.id IS NULL
            ORDER BY s.ht_no
            LIMIT counsellor_record.max_students
        LOOP
            -- Assign student to this counsellor
            INSERT INTO student_counsellor_assignments (student_id, counsellor_id, year)
            VALUES (student_record.id, counsellor_record.faculty_id, target_year);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to get students visible to a faculty member
CREATE OR REPLACE FUNCTION get_visible_students_for_faculty(faculty_uuid UUID)
RETURNS TABLE (
    student_id UUID,
    ht_no VARCHAR(50),
    student_name VARCHAR(255),
    year VARCHAR(20),
    section VARCHAR(10),
    branch VARCHAR(100),
    role VARCHAR(20),
    assignment_type VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.ht_no,
        s.student_name,
        s.year,
        s.section,
        s.branch,
        fa.role,
        CASE 
            WHEN fa.role = 'coordinator' THEN 'All students in year'
            ELSE 'Assigned subset'
        END as assignment_type
    FROM faculty_assignments fa
    JOIN students s ON fa.year = s.year
    LEFT JOIN student_counsellor_assignments sca ON s.id = sca.student_id AND sca.year = fa.year
    WHERE fa.faculty_id = faculty_uuid
    AND (
        -- Coordinator sees all students in their year
        (fa.role = 'coordinator') 
        OR 
        -- Counsellor sees only assigned students
        (fa.role = 'counsellor' AND sca.counsellor_id = faculty_uuid)
    )
    ORDER BY s.ht_no;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample faculty (if not exists)
INSERT INTO faculty (faculty_id, name, email, department, designation) VALUES
('F001', 'Dr. John Smith', 'john.smith@university.edu', 'AI & DS', 'Professor'),
('F002', 'Dr. Sarah Johnson', 'sarah.johnson@university.edu', 'AI & DS', 'Associate Professor'),
('F003', 'Dr. Michael Brown', 'michael.brown@university.edu', 'AI & DS', 'Assistant Professor'),
('F004', 'Dr. Emily Davis', 'emily.davis@university.edu', 'AI & DS', 'Professor'),
('F005', 'Dr. Robert Wilson', 'robert.wilson@university.edu', 'AI & DS', 'Associate Professor')
ON CONFLICT (faculty_id) DO NOTHING;

-- Assign faculty roles for different years
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

-- =====================================================
-- 6. USEFUL QUERIES
-- =====================================================

-- Query 1: Get all faculty assignments with counts
SELECT 
    f.name as faculty_name,
    f.faculty_id,
    fa.year,
    fa.role,
    fa.max_students,
    CASE 
        WHEN fa.role = 'coordinator' THEN 
            (SELECT COUNT(*) FROM students s WHERE s.year = fa.year)
        ELSE 
            (SELECT COUNT(*) FROM student_counsellor_assignments sca 
             WHERE sca.counsellor_id = fa.faculty_id AND sca.year = fa.year)
    END as current_student_count
FROM faculty f
JOIN faculty_assignments fa ON f.id = fa.faculty_id
ORDER BY fa.year, fa.role, f.name;

-- Query 2: Get unassigned students for a year
SELECT 
    s.ht_no,
    s.student_name,
    s.year,
    s.section
FROM students s
LEFT JOIN student_counsellor_assignments sca ON s.id = sca.student_id AND sca.year = s.year
WHERE s.year = '4th Year' AND sca.id IS NULL
ORDER BY s.ht_no;

-- Query 3: Get students assigned to a specific counsellor
SELECT 
    s.ht_no,
    s.student_name,
    s.year,
    s.section,
    sca.assigned_at
FROM students s
JOIN student_counsellor_assignments sca ON s.id = sca.student_id
JOIN faculty f ON sca.counsellor_id = f.id
WHERE f.faculty_id = 'F002' AND sca.year = '1st Year'
ORDER BY s.ht_no;

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
    s.year,
    COUNT(*) as total_students,
    COUNT(sca.id) as assigned_students,
    COUNT(*) - COUNT(sca.id) as unassigned_students
FROM students s
LEFT JOIN student_counsellor_assignments sca ON s.id = sca.student_id AND sca.year = s.year
GROUP BY s.year
ORDER BY s.year;

-- =====================================================
-- 7. AUTOMATIC ASSIGNMENT EXECUTION
-- =====================================================

-- Execute automatic assignments for all years
SELECT assign_students_to_counsellors('1st Year');
SELECT assign_students_to_counsellors('2nd Year');
SELECT assign_students_to_counsellors('3rd Year');
SELECT assign_students_to_counsellors('4th Year');

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Verify assignments were created
SELECT 
    f.name as counsellor_name,
    fa.year,
    COUNT(sca.id) as assigned_students,
    fa.max_students as max_allowed
FROM faculty_assignments fa
JOIN faculty f ON fa.faculty_id = f.id
LEFT JOIN student_counsellor_assignments sca ON fa.faculty_id = sca.counsellor_id AND fa.year = sca.year
WHERE fa.role = 'counsellor'
GROUP BY f.id, f.name, fa.year, fa.max_students
ORDER BY fa.year, f.name;

-- Test the visibility function for a specific faculty
SELECT * FROM get_visible_students_for_faculty(
    (SELECT id FROM faculty WHERE faculty_id = 'F002')
);
