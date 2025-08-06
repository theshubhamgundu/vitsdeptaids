-- ==================================================================
-- COMPLETE EDUCATIONAL MANAGEMENT SYSTEM DATABASE SCHEMA
-- This script will create all necessary tables for the application
-- ==================================================================

-- 1. First, fix the existing user_profiles table
DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'hod', 'admin')),
    phone TEXT,
    bio TEXT,
    profile_photo TEXT,
    profile_completed BOOLEAN DEFAULT FALSE,
    profile_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students table - Core student information
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    hall_ticket TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    full_name TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    year TEXT NOT NULL,
    semester TEXT,
    section TEXT,
    branch TEXT DEFAULT 'AI & DS',
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    attendance INTEGER DEFAULT 0,
    guardian_name TEXT,
    guardian_phone TEXT,
    address TEXT,
    bio TEXT,
    profile_photo TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'At Risk')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enhanced faculty table (replace existing)
DROP TABLE IF EXISTS faculty CASCADE;
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    faculty_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    designation TEXT,
    specialization TEXT,
    qualification TEXT,
    experience TEXT,
    office_location TEXT,
    bio TEXT,
    profile_photo TEXT,
    role TEXT DEFAULT 'Faculty' CHECK (role IN ('Faculty', 'HOD', 'Admin')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Student-Faculty Mappings for coordinator/counsellor assignments
CREATE TABLE student_faculty_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    mapping_type TEXT NOT NULL CHECK (mapping_type IN ('coordinator', 'counsellor')),
    assigned_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, faculty_id, mapping_type) -- Prevent duplicate mappings
);

-- 5. Study Materials uploaded by faculty
CREATE TABLE study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'doc', 'ppt', 'video', 'image', 'other')),
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    file_path TEXT,
    year TEXT NOT NULL,
    semester TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    uploaded_by_name TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Student Results and academic performance
CREATE TABLE student_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    hall_ticket TEXT NOT NULL,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('Mid-term', 'End-term', 'Internal', 'Assignment')),
    subject TEXT NOT NULL,
    year TEXT NOT NULL,
    semester TEXT NOT NULL,
    marks INTEGER NOT NULL CHECK (marks >= 0),
    max_marks INTEGER NOT NULL CHECK (max_marks > 0),
    grade TEXT NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((marks::DECIMAL / max_marks::DECIMAL) * 100) STORED,
    exam_date DATE NOT NULL,
    published_date TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    uploaded_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Messages between faculty and students
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('General', 'Academic', 'Alert', 'Reminder')),
    recipients UUID[] NOT NULL, -- Array of student IDs
    recipient_names TEXT[] NOT NULL, -- Array of student names
    sent_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'Sent' CHECK (status IN ('Draft', 'Sent', 'Scheduled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Leave Applications for students and faculty
CREATE TABLE leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL, -- Can reference students.id or faculty.id
    applicant_type TEXT NOT NULL CHECK (applicant_type IN ('student', 'faculty')),
    applicant_name TEXT NOT NULL,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    total_days INTEGER GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    approved_by UUID REFERENCES faculty(id),
    approved_by_name TEXT,
    approval_date TIMESTAMPTZ,
    comments TEXT,
    documents TEXT[], -- Array of document URLs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. User Sessions for multi-device login tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL UNIQUE,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create performance indexes
CREATE INDEX idx_students_hall_ticket ON students(hall_ticket);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_students_branch ON students(branch);
CREATE INDEX idx_students_status ON students(status);

CREATE INDEX idx_faculty_faculty_id ON faculty(faculty_id);
CREATE INDEX idx_faculty_email ON faculty(email);
CREATE INDEX idx_faculty_role ON faculty(role);
CREATE INDEX idx_faculty_status ON faculty(status);

CREATE INDEX idx_mappings_student_id ON student_faculty_mappings(student_id);
CREATE INDEX idx_mappings_faculty_id ON student_faculty_mappings(faculty_id);
CREATE INDEX idx_mappings_type ON student_faculty_mappings(mapping_type);
CREATE INDEX idx_mappings_active ON student_faculty_mappings(is_active);

CREATE INDEX idx_materials_subject ON study_materials(subject);
CREATE INDEX idx_materials_year ON study_materials(year);
CREATE INDEX idx_materials_semester ON study_materials(semester);
CREATE INDEX idx_materials_uploaded_by ON study_materials(uploaded_by);
CREATE INDEX idx_materials_active ON study_materials(is_active);

CREATE INDEX idx_results_student_id ON student_results(student_id);
CREATE INDEX idx_results_hall_ticket ON student_results(hall_ticket);
CREATE INDEX idx_results_subject ON student_results(subject);
CREATE INDEX idx_results_exam_type ON student_results(exam_type);
CREATE INDEX idx_results_year ON student_results(year);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipients ON messages USING GIN(recipients);
CREATE INDEX idx_messages_type ON messages(message_type);

CREATE INDEX idx_leave_applicant_id ON leave_applications(applicant_id);
CREATE INDEX idx_leave_applicant_type ON leave_applications(applicant_type);
CREATE INDEX idx_leave_status ON leave_applications(status);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_sessions_active ON user_sessions(is_active);

-- 11. Create update timestamp function and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mappings_updated_at BEFORE UPDATE ON student_faculty_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON study_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON student_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_updated_at BEFORE UPDATE ON leave_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_faculty_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- 13. Create basic RLS policies (Allow all for now - we'll refine later)
-- User Profiles
CREATE POLICY "Allow all user_profiles operations" ON user_profiles FOR ALL USING (true);

-- Students  
CREATE POLICY "Allow all students operations" ON students FOR ALL USING (true);

-- Faculty
CREATE POLICY "Allow all faculty operations" ON faculty FOR ALL USING (true);

-- Mappings
CREATE POLICY "Allow all mappings operations" ON student_faculty_mappings FOR ALL USING (true);

-- Study Materials
CREATE POLICY "Allow all materials operations" ON study_materials FOR ALL USING (true);

-- Results
CREATE POLICY "Allow all results operations" ON student_results FOR ALL USING (true);

-- Messages
CREATE POLICY "Allow all messages operations" ON messages FOR ALL USING (true);

-- Leave Applications
CREATE POLICY "Allow all leave operations" ON leave_applications FOR ALL USING (true);

-- Sessions
CREATE POLICY "Allow all sessions operations" ON user_sessions FOR ALL USING (true);

-- 14. Insert sample data for testing
-- Sample User Profiles
INSERT INTO user_profiles (email, name, role) VALUES 
('admin@vgnt.com', 'System Admin', 'admin'),
('hod@vgnt.com', 'Dr. V. Srinivas', 'hod'),
('faculty1@vgnt.com', 'Dr. N. Murali Krishna', 'faculty'),
('faculty2@vgnt.com', 'Dr. B. Ramakrishna', 'faculty'),
('student1@vgnt.com', 'Rahul Sharma', 'student'),
('student2@vgnt.com', 'Priya Reddy', 'student'),
('student3@vgnt.com', 'Amit Kumar', 'student');

-- Sample Faculty
INSERT INTO faculty (faculty_id, name, email, designation, role, user_profile_id) VALUES 
('HOD001', 'Dr. V. Srinivas', 'hod@vgnt.com', 'Professor & HOD', 'HOD', (SELECT id FROM user_profiles WHERE email = 'hod@vgnt.com')),
('FAC001', 'Dr. N. Murali Krishna', 'faculty1@vgnt.com', 'Associate Professor', 'Faculty', (SELECT id FROM user_profiles WHERE email = 'faculty1@vgnt.com')),
('FAC002', 'Dr. B. Ramakrishna', 'faculty2@vgnt.com', 'Associate Professor', 'Faculty', (SELECT id FROM user_profiles WHERE email = 'faculty2@vgnt.com'));

-- Sample Students
INSERT INTO students (hall_ticket, name, full_name, email, year, semester, section, cgpa, attendance, user_profile_id) VALUES 
('20AI001', 'Rahul Sharma', 'Rahul Kumar Sharma', 'student1@vgnt.com', '3rd Year', '6th Semester', 'A', 8.45, 88, (SELECT id FROM user_profiles WHERE email = 'student1@vgnt.com')),
('20AI002', 'Priya Reddy', 'Priya Lakshmi Reddy', 'student2@vgnt.com', '3rd Year', '6th Semester', 'A', 9.12, 92, (SELECT id FROM user_profiles WHERE email = 'student2@vgnt.com')),
('20AI003', 'Amit Kumar', 'Amit Kumar Singh', 'student3@vgnt.com', '3rd Year', '6th Semester', 'B', 8.78, 85, (SELECT id FROM user_profiles WHERE email = 'student3@vgnt.com'));

-- Sample Student-Faculty Mappings
INSERT INTO student_faculty_mappings (student_id, faculty_id, mapping_type) VALUES 
((SELECT id FROM students WHERE hall_ticket = '20AI001'), (SELECT id FROM faculty WHERE faculty_id = 'FAC001'), 'coordinator'),
((SELECT id FROM students WHERE hall_ticket = '20AI001'), (SELECT id FROM faculty WHERE faculty_id = 'FAC002'), 'counsellor'),
((SELECT id FROM students WHERE hall_ticket = '20AI002'), (SELECT id FROM faculty WHERE faculty_id = 'FAC001'), 'coordinator'),
((SELECT id FROM students WHERE hall_ticket = '20AI003'), (SELECT id FROM faculty WHERE faculty_id = 'FAC002'), 'coordinator');

-- Sample Study Materials
INSERT INTO study_materials (title, description, subject, file_type, file_name, file_size, file_url, year, semester, uploaded_by, uploaded_by_name) VALUES 
('Introduction to Machine Learning', 'Comprehensive guide to ML fundamentals', 'Machine Learning', 'pdf', 'ML_Introduction.pdf', 2048000, 'https://demo-storage.com/ml-intro.pdf', '3rd Year', '6th Semester', (SELECT id FROM faculty WHERE faculty_id = 'FAC001'), 'Dr. N. Murali Krishna'),
('Data Structures and Algorithms', 'Complete notes on DSA with examples', 'Data Structures', 'pdf', 'DSA_Notes.pdf', 1536000, 'https://demo-storage.com/dsa-notes.pdf', '2nd Year', '4th Semester', (SELECT id FROM faculty WHERE faculty_id = 'FAC002'), 'Dr. B. Ramakrishna');

-- Sample Student Results
INSERT INTO student_results (student_id, student_name, hall_ticket, exam_type, subject, year, semester, marks, max_marks, grade, exam_date, uploaded_by, uploaded_by_name) VALUES 
((SELECT id FROM students WHERE hall_ticket = '20AI001'), 'Rahul Sharma', '20AI001', 'Mid-term', 'Machine Learning', '3rd Year', '6th Semester', 85, 100, 'A', '2024-03-15', (SELECT id FROM faculty WHERE faculty_id = 'FAC001'), 'Dr. N. Murali Krishna'),
((SELECT id FROM students WHERE hall_ticket = '20AI002'), 'Priya Reddy', '20AI002', 'Mid-term', 'Machine Learning', '3rd Year', '6th Semester', 92, 100, 'A+', '2024-03-15', (SELECT id FROM faculty WHERE faculty_id = 'FAC001'), 'Dr. N. Murali Krishna');

-- Sample Messages
INSERT INTO messages (sender_id, sender_name, title, content, message_type, recipients, recipient_names) VALUES 
((SELECT id FROM faculty WHERE faculty_id = 'FAC001'), 'Dr. N. Murali Krishna', 'Assignment Reminder', 'Please submit your ML assignment by Friday.', 'Academic', ARRAY[(SELECT id FROM students WHERE hall_ticket = '20AI001'), (SELECT id FROM students WHERE hall_ticket = '20AI002')], ARRAY['Rahul Sharma', 'Priya Reddy']);

-- ==================================================================
-- VERIFICATION QUERIES TO RUN AFTER SCHEMA CREATION
-- ==================================================================

-- Run these queries after executing the schema to verify everything works:

-- 1. Check all tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 2. Verify sample data
-- SELECT 'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
-- UNION ALL SELECT 'students', COUNT(*) FROM students  
-- UNION ALL SELECT 'faculty', COUNT(*) FROM faculty
-- UNION ALL SELECT 'student_faculty_mappings', COUNT(*) FROM student_faculty_mappings
-- UNION ALL SELECT 'study_materials', COUNT(*) FROM study_materials
-- UNION ALL SELECT 'student_results', COUNT(*) FROM student_results
-- UNION ALL SELECT 'messages', COUNT(*) FROM messages;

-- 3. Test relationships
-- SELECT s.name as student_name, f.name as faculty_name, sfm.mapping_type
-- FROM students s
-- JOIN student_faculty_mappings sfm ON s.id = sfm.student_id
-- JOIN faculty f ON f.id = sfm.faculty_id
-- WHERE sfm.is_active = true;
