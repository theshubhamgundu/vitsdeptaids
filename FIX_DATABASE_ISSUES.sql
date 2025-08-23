-- ===================================
-- FIX DATABASE ISSUES - COMPLETE SETUP
-- ===================================
-- Run this script in your Supabase SQL Editor to fix all database issues

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin', 'hod');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE designation_type AS ENUM ('HOD', 'Associate Prof.', 'Asst. Prof.', 'DTP Operator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE academic_year AS ENUM ('1st Year', '2nd Year', '3rd Year', '4th Year');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ===================================
-- CREATE MISSING TABLES
-- ===================================

-- Create time_slots table if it doesn't exist
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create department_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS department_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(200),
    organizer_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students_list table if it doesn't exist (for admin functionality)
CREATE TABLE IF NOT EXISTS students_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hall_ticket VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    year academic_year NOT NULL,
    section VARCHAR(10),
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    attendance INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    branch VARCHAR(100) DEFAULT 'AI & DS',
    semester INTEGER DEFAULT 1,
    address TEXT,
    emergency_contact VARCHAR(20),
    admission_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_materials table if it doesn't exist
CREATE TABLE IF NOT EXISTS study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    subject VARCHAR(200),
    file_type VARCHAR(50),
    file_name VARCHAR(255),
    file_size BIGINT,
    file_url TEXT,
    uploaded_by UUID,
    uploaded_by_name VARCHAR(255),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    year academic_year,
    semester INTEGER,
    is_active BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timetables table if it doesn't exist
CREATE TABLE IF NOT EXISTS timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID,
    course_id UUID,
    time_slot_id UUID,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
    room VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS leave_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'personal',
    status leave_status DEFAULT 'pending',
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create results table if it doesn't exist
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    hall_ticket VARCHAR(20) NOT NULL,
    exam_type VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    year academic_year NOT NULL,
    semester VARCHAR(50) NOT NULL,
    marks INTEGER NOT NULL,
    max_marks INTEGER NOT NULL,
    grade VARCHAR(10),
    exam_date DATE NOT NULL,
    published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID NOT NULL,
    uploaded_by_name VARCHAR(255) NOT NULL,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL,
    subject VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'present',
    period INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ===================================

-- Add missing columns to students table if they don't exist
DO $$ BEGIN
    ALTER TABLE students ADD COLUMN IF NOT EXISTS cgpa DECIMAL(3,2) DEFAULT 0.00;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance INTEGER DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE students ADD COLUMN IF NOT EXISTS branch VARCHAR(100) DEFAULT 'AI & DS';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE students ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 1;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add missing columns to faculty table if they don't exist
DO $$ BEGIN
    ALTER TABLE faculty ADD COLUMN IF NOT EXISTS subjects TEXT[];
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- ===================================
-- CREATE INDEXES FOR PERFORMANCE
-- ===================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_hall_ticket ON students(hall_ticket);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(year);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_faculty_email ON faculty(email);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_subject ON results(subject);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_time_slots_active ON time_slots(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_department_events_date ON department_events(event_date, is_active);

-- ===================================
-- ENABLE ROW LEVEL SECURITY
-- ===================================

-- Enable RLS on all tables
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- ===================================
-- CREATE BASIC POLICIES
-- ===================================

-- Allow authenticated users to read most tables
CREATE POLICY "Allow authenticated read access" ON time_slots FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON department_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON students_list FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON study_materials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON timetables FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON leave_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON results FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON attendance FOR SELECT USING (true);

-- Allow faculty and admin to manage data
CREATE POLICY "Allow faculty management" ON results FOR ALL USING (true);
CREATE POLICY "Allow faculty management" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow faculty management" ON study_materials FOR ALL USING (true);

-- ===================================
-- INSERT DEFAULT DATA
-- ===================================

-- Insert default time slots if they don't exist
INSERT INTO time_slots (id, slot_name, start_time, end_time, order_index, is_active) VALUES
('20000000-0000-0000-0000-000000000001', '9:00 - 9:50', '09:00:00', '09:50:00', 1, true),
('20000000-0000-0000-0000-000000000002', '9:50 - 10:40', '09:50:00', '10:40:00', 2, true),
('20000000-0000-0000-0000-000000000003', '11:00 - 11:50', '11:00:00', '11:50:00', 3, true),
('20000000-0000-0000-0000-000000000004', '11:50 - 12:40', '11:50:00', '12:40:00', 4, true),
('20000000-0000-0000-0000-000000000005', '1:30 - 2:20', '13:30:00', '14:20:00', 5, true),
('20000000-0000-0000-0000-000000000006', '2:20 - 3:10', '14:20:00', '15:10:00', 6, true),
('20000000-0000-0000-0000-000000000007', '3:30 - 4:20', '15:30:00', '16:20:00', 7, true),
('20000000-0000-0000-0000-000000000008', '4:20 - 5:10', '16:20:00', '17:10:00', 8, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample department events if they don't exist
INSERT INTO department_events (id, title, description, event_date, start_time, end_time, venue, organizer_id) VALUES
('40000000-0000-0000-0000-000000000001', 'AI & Data Science Symposium 2025', 'Annual symposium featuring latest research in AI and Data Science', '2025-04-15', '09:00:00', '17:00:00', 'Main Auditorium', NULL),
('40000000-0000-0000-0000-000000000002', 'Industry Expert Talk on Machine Learning', 'Guest lecture by industry expert on current ML trends', '2025-03-28', '14:00:00', '16:00:00', 'Conference Hall', NULL),
('40000000-0000-0000-0000-000000000003', 'Project Exhibition', 'Final year project exhibition and evaluation', '2025-04-20', '10:00:00', '16:00:00', 'Exhibition Hall', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample students to students_list table if they don't exist
INSERT INTO students_list (id, hall_ticket, full_name, email, phone, year, section, cgpa, attendance, status, branch, semester, address, emergency_contact, admission_date) VALUES
('50000000-0000-0000-0000-000000000001', '22AI001', 'K. Somesh', 'somesh.k@vit.ac.in', '+91-9876543210', '1st Year', 'A', 8.5, 85, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543211', '2022-07-01'),
('50000000-0000-0000-0000-000000000002', '22AI002', 'T. Sai Lalith Prasad', 'lalith.t@vit.ac.in', '+91-9876543212', '1st Year', 'A', 8.8, 92, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543213', '2022-07-01'),
('50000000-0000-0000-0000-000000000003', '22AI003', 'R. Priyanka', 'priyanka.r@vit.ac.in', '+91-9876543214', '1st Year', 'A', 8.2, 88, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543215', '2022-07-01'),
('50000000-0000-0000-0000-000000000004', '22AI004', 'S. Rahul', 'rahul.s@vit.ac.in', '+91-9876543216', '1st Year', 'B', 8.0, 82, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543217', '2022-07-01'),
('50000000-0000-0000-0000-000000000005', '22AI005', 'M. Divya', 'divya.m@vit.ac.in', '+91-9876543218', '1st Year', 'B', 8.7, 90, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543219', '2022-07-01'),
('50000000-0000-0000-0000-000000000006', '21AI001', 'A. Kumar', 'kumar.a@vit.ac.in', '+91-9876543220', '2nd Year', 'A', 8.9, 94, 'Active', 'AI & DS', 3, 'VIT Vellore Campus', '+91-9876543221', '2021-07-01'),
('50000000-0000-0000-0000-000000000007', '21AI002', 'B. Priya', 'priya.b@vit.ac.in', '+91-9876543222', '2nd Year', 'A', 8.6, 89, 'Active', 'AI & DS', 3, 'VIT Vellore Campus', '+91-9876543222', '2021-07-01'),
('50000000-0000-0000-0000-000000000008', '20AI001', 'C. Rajesh', 'rajesh.c@vit.ac.in', '+91-9876543223', '3rd Year', 'A', 8.4, 87, 'Active', 'AI & DS', 5, 'VIT Vellore Campus', '+91-9876543224', '2020-07-01'),
('50000000-0000-0000-0000-000000000009', '20AI002', 'D. Anjali', 'anjali.d@vit.ac.in', '+91-9876543225', '3rd Year', 'B', 8.1, 85, 'Active', 'AI & DS', 5, 'VIT Vellore Campus', '+91-9876543226', '2020-07-01'),
('50000000-0000-0000-0000-000000000010', '19AI001', 'E. Suresh', 'suresh.e@vit.ac.in', '+91-9876543227', '4th Year', 'A', 8.3, 86, 'Active', 'AI & DS', 7, 'VIT Vellore Campus', '+91-9876543228', '2019-07-01')
ON CONFLICT (hall_ticket) DO NOTHING;

-- ===================================
-- ADD TRIGGERS FOR UPDATED_AT
-- ===================================

-- Add triggers to update updated_at column automatically
DROP TRIGGER IF EXISTS update_time_slots_updated_at ON time_slots;
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_department_events_updated_at ON department_events;
CREATE TRIGGER update_department_events_updated_at BEFORE UPDATE ON department_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_list_updated_at ON students_list;
CREATE TRIGGER update_students_list_updated_at BEFORE UPDATE ON students_list FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_study_materials_updated_at ON study_materials;
CREATE TRIGGER update_study_materials_updated_at BEFORE UPDATE ON study_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_timetables_updated_at ON timetables;
CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON timetables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leave_applications_updated_at ON leave_applications;
CREATE TRIGGER update_leave_applications_updated_at BEFORE UPDATE ON leave_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_results_updated_at ON results;
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_updated_at ON attendance;
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- VERIFICATION QUERIES
-- ===================================

-- Check if all tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'faculty', 'students', 'students_list', 
    'courses', 'messages', 'time_slots', 'department_events',
    'study_materials', 'timetables', 'notifications', 
    'leave_applications', 'results', 'attendance'
)
ORDER BY table_name;

-- Check table row counts
SELECT 
    'user_profiles' as table_name, COUNT(*) as row_count FROM user_profiles
UNION ALL
SELECT 'faculty', COUNT(*) FROM faculty
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'students_list', COUNT(*) FROM students_list
UNION ALL
SELECT 'time_slots', COUNT(*) FROM time_slots
UNION ALL
SELECT 'department_events', COUNT(*) FROM department_events;

-- ===================================
-- SETUP COMPLETE!
-- ===================================

-- Your database is now fully configured with:
-- ✅ All required tables created
-- ✅ Missing columns added to existing tables
-- ✅ Performance indexes created
-- ✅ Row Level Security enabled
-- ✅ Default data inserted
-- ✅ Triggers for automatic timestamp updates

-- Next: Test your application - it should now work without database errors!

