-- Complete Database Schema for Educational Management System
-- Run this in your Supabase SQL Editor

-- First, let's properly set up the user_profiles table
DROP TABLE IF EXISTS user_profiles CASCADE;
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

-- Students table - Core student information
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

-- Faculty table - Enhanced with authentication fields
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

-- Student-Faculty Mappings table
CREATE TABLE student_faculty_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    mapping_type TEXT NOT NULL CHECK (mapping_type IN ('coordinator', 'counsellor')),
    assigned_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, mapping_type, is_active) -- Ensure one active mapping per type per student
);

-- Study Materials table
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

-- Student Results table
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

-- Messages table
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

-- Leave Applications table
CREATE TABLE leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL, -- Can be student or faculty
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

-- Sessions table for multi-device login tracking
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

-- Indexes for better performance
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

-- Updated triggers for timestamp updates
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

-- RLS Policies

-- User Profiles policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Allow profile creation" ON user_profiles FOR INSERT WITH CHECK (true);

-- Students policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own data" ON students FOR SELECT USING (
    user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Faculty and admin can view students" ON students FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role IN ('faculty', 'hod', 'admin'))
);
CREATE POLICY "Admin can manage students" ON students FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Faculty policies
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faculty can view all faculty" ON faculty FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role IN ('faculty', 'hod', 'admin'))
);
CREATE POLICY "Faculty can update own data" ON faculty FOR UPDATE USING (
    user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin can manage faculty" ON faculty FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Student-Faculty Mappings policies
ALTER TABLE student_faculty_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faculty can view their mappings" ON student_faculty_mappings FOR SELECT USING (
    faculty_id IN (SELECT id FROM faculty WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))
);
CREATE POLICY "Admin can manage mappings" ON student_faculty_mappings FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Study Materials policies
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All authenticated users can view materials" ON study_materials FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Faculty can manage materials" ON study_materials FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role IN ('faculty', 'hod', 'admin'))
);

-- Student Results policies
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own results" ON student_results FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))
);
CREATE POLICY "Faculty can view and manage results" ON student_results FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role IN ('faculty', 'hod', 'admin'))
);

-- Messages policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faculty can manage their messages" ON messages FOR ALL USING (
    sender_id IN (SELECT id FROM faculty WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))
);

-- Leave Applications policies
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON leave_applications FOR SELECT USING (
    (applicant_type = 'student' AND applicant_id IN (SELECT id FROM students WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))) OR
    (applicant_type = 'faculty' AND applicant_id IN (SELECT id FROM faculty WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())))
);
CREATE POLICY "Users can create own applications" ON leave_applications FOR INSERT WITH CHECK (
    (applicant_type = 'student' AND applicant_id IN (SELECT id FROM students WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))) OR
    (applicant_type = 'faculty' AND applicant_id IN (SELECT id FROM faculty WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())))
);
CREATE POLICY "Faculty and admin can manage applications" ON leave_applications FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND role IN ('faculty', 'hod', 'admin'))
);

-- User Sessions policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON user_sessions FOR ALL USING (
    user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
);
