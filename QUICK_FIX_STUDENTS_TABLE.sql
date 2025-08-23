-- Quick Fix for Students List Table
-- Run this in your Supabase SQL Editor to fix the column mismatch

-- Drop the existing table if it has wrong structure
DROP TABLE IF EXISTS students_list CASCADE;

-- Create the correct students_list table
CREATE TABLE students_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hall_ticket VARCHAR(20) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,  -- This is what the code expects
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    year VARCHAR(20) NOT NULL,
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

-- Insert sample students
INSERT INTO students_list (hall_ticket, student_name, email, phone, year, section, cgpa, attendance, status, branch, semester, address, emergency_contact, admission_date) VALUES
('22AI001', 'K. Somesh', 'somesh.k@vit.ac.in', '+91-9876543210', '1st Year', 'A', 8.5, 85, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543211', '2022-07-01'),
('22AI002', 'T. Sai Lalith Prasad', 'lalith.t@vit.ac.in', '+91-9876543212', '1st Year', 'A', 8.8, 92, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543213', '2022-07-01'),
('22AI003', 'R. Priyanka', 'priyanka.r@vit.ac.in', '+91-9876543214', '1st Year', 'A', 8.2, 88, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543215', '2022-07-01'),
('22AI004', 'S. Rahul', 'rahul.s@vit.ac.in', '+91-9876543216', '1st Year', 'B', 8.0, 82, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543217', '2022-07-01'),
('22AI005', 'M. Divya', 'divya.m@vit.ac.in', '+91-9876543218', '1st Year', 'B', 8.7, 90, 'Active', 'AI & DS', 1, 'VIT Vellore Campus', '+91-9876543219', '2022-07-01'),
('21AI001', 'A. Kumar', 'kumar.a@vit.ac.in', '+91-9876543220', '2nd Year', 'A', 8.9, 94, 'Active', 'AI & DS', 3, 'VIT Vellore Campus', '+91-9876543221', '2021-07-01'),
('21AI002', 'B. Priya', 'priya.b@vit.ac.in', '+91-9876543222', '2nd Year', 'A', 8.6, 89, 'Active', 'AI & DS', 3, 'VIT Vellore Campus', '+91-9876543222', '2021-07-01'),
('20AI001', 'C. Rajesh', 'rajesh.c@vit.ac.in', '+91-9876543223', '3rd Year', 'A', 8.4, 87, 'Active', 'AI & DS', 5, 'VIT Vellore Campus', '+91-9876543224', '2020-07-01'),
('20AI002', 'D. Anjali', 'anjali.d@vit.ac.in', '+91-9876543225', '3rd Year', 'B', 8.1, 85, 'Active', 'AI & DS', 5, 'VIT Vellore Campus', '+91-9876543226', '2020-07-01'),
('19AI001', 'E. Suresh', 'suresh.e@vit.ac.in', '+91-9876543227', '4th Year', 'A', 8.3, 86, 'Active', 'AI & DS', 7, 'VIT Vellore Campus', '+91-9876543228', '2019-07-01');

-- Verify the table was created correctly
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'students_list'
ORDER BY ordinal_position;

-- Check the data
SELECT COUNT(*) as total_students FROM students_list;
SELECT * FROM students_list LIMIT 3;
