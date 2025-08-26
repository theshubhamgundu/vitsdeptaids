-- ===================================
-- SIMPLE DATABASE SETUP
-- Minimal schema that matches the code exactly
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table (minimal schema)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    hall_ticket VARCHAR(50),
    name VARCHAR(255),
    year VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table (minimal schema)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    hall_ticket VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    year VARCHAR(20) NOT NULL,
    section VARCHAR(10) DEFAULT 'A',
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_data table for validation
CREATE TABLE IF NOT EXISTS student_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ht_no VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(255) NOT NULL,
    year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_data DISABLE ROW LEVEL SECURITY;

-- Insert sample student data for testing
INSERT INTO student_data (ht_no, student_name, year) VALUES
('23891A7224', 'GOLI PRANAY KUMAR', '3rd Year'),
('23891A7228', 'GUNDU SHUBHAM VASANT', '3rd Year'),
('24891A7223', 'K N DEEKSHITHA', '2nd Year')
ON CONFLICT (ht_no) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_hall_ticket ON user_profiles(hall_ticket);
CREATE INDEX IF NOT EXISTS idx_students_hall_ticket ON students(hall_ticket);
CREATE INDEX IF NOT EXISTS idx_student_data_ht_no ON student_data(ht_no);

-- ===================================
-- SETUP COMPLETE!
-- ===================================

-- Test the tables
SELECT 'user_profiles' as table_name, COUNT(*) as record_count FROM user_profiles
UNION ALL
SELECT 'students' as table_name, COUNT(*) as record_count FROM students
UNION ALL
SELECT 'student_data' as table_name, COUNT(*) as record_count FROM student_data;
