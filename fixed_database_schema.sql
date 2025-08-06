-- COMPLETE DATABASE SCHEMA FIX
-- Run this in your Supabase SQL Editor

-- Drop existing conflicting tables if they exist
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS leave_applications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS student_results CASCADE;
DROP TABLE IF EXISTS study_materials CASCADE;
DROP TABLE IF EXISTS student_faculty_mappings CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 1. User Profiles - Central authentication table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'hod', 'admin')),
    phone TEXT,
    profile_completed BOOLEAN DEFAULT FALSE,
    profile_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    hall_ticket TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
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

-- 3. Faculty table
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

-- 4. Student-Faculty Mappings
CREATE TABLE student_faculty_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    mapping_type TEXT NOT NULL CHECK (mapping_type IN ('coordinator', 'counsellor')),
    assigned_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Study Materials
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

-- 6. Student Results
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
    exam_date DATE NOT NULL,
    published_date TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    uploaded_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('General', 'Academic', 'Alert', 'Reminder')),
    recipients UUID[] NOT NULL,
    recipient_names TEXT[] NOT NULL,
    sent_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'Sent' CHECK (status IN ('Draft', 'Sent', 'Scheduled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Leave Applications
CREATE TABLE leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL,
    applicant_type TEXT NOT NULL CHECK (applicant_type IN ('student', 'faculty')),
    applicant_name TEXT NOT NULL,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    approved_by UUID REFERENCES faculty(id),
    approved_by_name TEXT,
    approval_date TIMESTAMPTZ,
    comments TEXT,
    documents TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. User Sessions for multi-device login
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

-- Create indexes for performance
CREATE INDEX idx_students_hall_ticket ON students(hall_ticket);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_faculty_faculty_id ON faculty(faculty_id);
CREATE INDEX idx_faculty_email ON faculty(email);
CREATE INDEX idx_mappings_student_id ON student_faculty_mappings(student_id);
CREATE INDEX idx_mappings_faculty_id ON student_faculty_mappings(faculty_id);
CREATE INDEX idx_mappings_type ON student_faculty_mappings(mapping_type);
CREATE INDEX idx_materials_subject ON study_materials(subject);
CREATE INDEX idx_materials_year ON study_materials(year);
CREATE INDEX idx_materials_uploaded_by ON study_materials(uploaded_by);
CREATE INDEX idx_results_student_id ON student_results(student_id);
CREATE INDEX idx_results_subject ON student_results(subject);
CREATE INDEX idx_results_exam_type ON student_results(exam_type);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipients ON messages USING GIN(recipients);
CREATE INDEX idx_leave_applicant_id ON leave_applications(applicant_id);
CREATE INDEX idx_leave_status ON leave_applications(status);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_session_id ON user_sessions(session_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mappings_updated_at BEFORE UPDATE ON student_faculty_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON study_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON student_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_updated_at BEFORE UPDATE ON leave_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_faculty_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow all for now, we'll refine later)
CREATE POLICY "Allow all operations" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON faculty FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON student_faculty_mappings FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON study_materials FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON student_results FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON leave_applications FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON user_sessions FOR ALL USING (true);

-- Insert some sample data for testing
INSERT INTO user_profiles (email, name, role) VALUES 
('admin@test.com', 'Test Admin', 'admin'),
('faculty@test.com', 'Dr. Test Faculty', 'faculty'),
('student@test.com', 'Test Student', 'student');

INSERT INTO faculty (faculty_id, name, email, designation, user_profile_id) VALUES 
('FAC001', 'Dr. Test Faculty', 'faculty@test.com', 'Professor', (SELECT id FROM user_profiles WHERE email = 'faculty@test.com'));

INSERT INTO students (hall_ticket, name, email, year, semester, user_profile_id) VALUES 
('20AI001', 'Test Student', 'student@test.com', '3rd Year', '6th Semester', (SELECT id FROM user_profiles WHERE email = 'student@test.com'));
