-- ===================================
-- VIGNAN AI & DATA SCIENCE DEPARTMENT
-- COMPLETE SUPABASE DATABASE SETUP
-- ===================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin', 'hod');
CREATE TYPE designation_type AS ENUM ('HOD', 'Associate Prof.', 'Asst. Prof.', 'DTP Operator');
CREATE TYPE academic_year AS ENUM ('1st Year', '2nd Year', '3rd Year', '4th Year');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');

-- User Profiles Table (Central authentication)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faculty Table
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    faculty_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    designation designation_type NOT NULL,
    role user_role DEFAULT 'faculty',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) DEFAULT 'AI & Data Science',
    specialization TEXT,
    experience INTEGER DEFAULT 0,
    qualification TEXT,
    password_hash TEXT NOT NULL,
    can_change_password BOOLEAN DEFAULT true,
    profile_photo_url TEXT,
    office_room VARCHAR(50),
    joining_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    hall_ticket VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    year academic_year NOT NULL,
    section VARCHAR(10),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    address TEXT,
    date_of_birth DATE,
    blood_group VARCHAR(5),
    profile_photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits INTEGER DEFAULT 3,
    year academic_year NOT NULL,
    semester INTEGER CHECK (semester IN (1, 2)),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    recipients TEXT[] NOT NULL,
    recipient_count INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'general',
    status message_status DEFAULT 'sent',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_count INTEGER DEFAULT 0,
    acknowledgment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time Slots Table
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    order_index INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timetables Table
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year academic_year NOT NULL,
    section VARCHAR(10),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
    time_slot VARCHAR(50) NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    room VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Events Table
CREATE TABLE department_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(255),
    organizer_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_faculty_faculty_id ON faculty(faculty_id);
CREATE INDEX idx_faculty_role ON faculty(role);
CREATE INDEX idx_students_hall_ticket ON students(hall_ticket);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (allowing reads for authenticated users)
CREATE POLICY "Allow authenticated read access" ON faculty FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON students FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON timetables FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON time_slots FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access" ON department_events FOR SELECT USING (true);

-- Allow faculty to insert messages
CREATE POLICY "Allow faculty to send messages" ON messages FOR INSERT WITH CHECK (true);

-- Allow time slot management
CREATE POLICY "Allow time slot management" ON time_slots FOR ALL USING (true);

-- ===================================
-- INSERT FACULTY DATA
-- ===================================

-- Insert user profiles for each faculty member
INSERT INTO user_profiles (id, email, role, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'vsrinivas@vignan.ac.in', 'hod', true),
('00000000-0000-0000-0000-000000000002', 'nmkrishna@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000003', 'bramakrishna@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000004', 'sramana@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000005', 'glavanya@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000006', 'tsailalith@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000007', 'ryamini@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000008', 'chnaresh@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000009', 'ksindhuja@vignan.ac.in', 'faculty', true),
('00000000-0000-0000-0000-000000000010', 'ksomesh@vignan.ac.in', 'admin', true);

-- Insert faculty data
INSERT INTO faculty (
    id, user_id, faculty_id, name, designation, role, email, phone, 
    department, specialization, experience, qualification, password_hash, 
    can_change_password, office_room, joining_date
) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AIDS-HVS1', 'Dr. V. Srinivas', 'HOD', 'hod', 'vsrinivas@vignan.ac.in', '+91 9876543201', 'AI & Data Science', 'Machine Learning, Deep Learning', 15, 'Ph.D in Computer Science', '@VSrinivas231', true, 'Block-A, Room 301', '2010-01-01'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'AIDS-ANK1', 'Dr. N. Murali Krishna', 'Associate Prof.', 'faculty', 'nmkrishna@vignan.ac.in', '+91 9876543202', 'AI & Data Science', 'Data Mining, Big Data Analytics', 12, 'Ph.D in Computer Science', '@NMKrishna342', true, 'Block-A, Room 302', '2012-01-01'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'AIDS-ABR1', 'Dr. B. Ramakrishna', 'Associate Prof.', 'faculty', 'bramakrishna@vignan.ac.in', '+91 9876543203', 'AI & Data Science', 'Computer Vision, Image Processing', 10, 'Ph.D in Electronics', '@BRamakrishna189', true, 'Block-A, Room 303', '2014-01-01'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'AIDS-PSRR1', 'Mr. S. Ramana Reddy', 'Asst. Prof.', 'faculty', 'sramana@vignan.ac.in', '+91 9876543204', 'AI & Data Science', 'Natural Language Processing, Python Programming', 8, 'M.Tech in CSE', '@SRReddy583', true, 'Block-A, Room 304', '2016-01-01'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'AIDS-PGL1', 'Mrs. G. Lavanya', 'Asst. Prof.', 'faculty', 'glavanya@vignan.ac.in', '+91 9876543205', 'AI & Data Science', 'Data Structures, Algorithms', 6, 'M.Tech in CSE', '@GLavanya478', true, 'Block-A, Room 305', '2018-01-01'),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'AIDS-PTSP1', 'Mr. T. Sai Lalith Prasad', 'Asst. Prof.', 'faculty', 'tsailalith@vignan.ac.in', '+91 9876543206', 'AI & Data Science', 'Database Systems, Web Technologies', 5, 'M.Tech in CSE', '@TSPrasad764', true, 'Block-A, Room 306', '2019-01-01'),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'AIDS-PRY1', 'Mrs. R. Yamini', 'Asst. Prof.', 'faculty', 'ryamini@vignan.ac.in', '+91 9876543207', 'AI & Data Science', 'Statistics, Mathematics for AI', 4, 'M.Sc in Statistics', '@RYamini225', true, 'Block-A, Room 307', '2020-01-01'),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', 'AIDS-PCN1', 'Mr. CH. Naresh', 'Asst. Prof.', 'faculty', 'chnaresh@vignan.ac.in', '+91 9876543208', 'AI & Data Science', 'Software Engineering, Project Management', 7, 'M.Tech in CSE', '@CHNaresh611', true, 'Block-A, Room 308', '2017-01-01'),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', 'AIDS-PKS1', 'Mrs. K. Sindhuja', 'Asst. Prof.', 'faculty', 'ksindhuja@vignan.ac.in', '+91 9876543209', 'AI & Data Science', 'Cloud Computing, IoT', 3, 'M.Tech in CSE', '@KSindhuja839', true, 'Block-A, Room 309', '2021-01-01'),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', 'AIDS-DKS1', 'Mr. K. Somesh', 'DTP Operator', 'admin', 'ksomesh@vignan.ac.in', '+91 9876543210', 'AI & Data Science', 'Administrative Support, Data Entry', 5, 'Diploma in Computer Applications', '@KSomesh702', true, 'Block-A, Room 310', '2019-01-01');

-- Insert sample courses
INSERT INTO courses (id, course_code, course_name, credits, year, semester, description) VALUES
('10000000-0000-0000-0000-000000000001', 'AI1001', 'Introduction to Artificial Intelligence', 4, '1st Year', 1, 'Basic concepts of AI and machine learning'),
('10000000-0000-0000-0000-000000000002', 'DS1001', 'Data Structures and Algorithms', 4, '1st Year', 1, 'Fundamental data structures and algorithms'),
('10000000-0000-0000-0000-000000000003', 'PY1001', 'Python Programming', 3, '1st Year', 1, 'Introduction to Python programming'),
('10000000-0000-0000-0000-000000000004', 'ML2001', 'Machine Learning', 4, '2nd Year', 1, 'Machine learning algorithms and applications'),
('10000000-0000-0000-0000-000000000005', 'DL3001', 'Deep Learning', 4, '3rd Year', 1, 'Neural networks and deep learning'),
('10000000-0000-0000-0000-000000000006', 'CV3002', 'Computer Vision', 3, '3rd Year', 2, 'Image processing and computer vision'),
('10000000-0000-0000-0000-000000000007', 'NLP3003', 'Natural Language Processing', 3, '3rd Year', 2, 'Text processing and NLP techniques'),
('10000000-0000-0000-0000-000000000008', 'BD4001', 'Big Data Analytics', 4, '4th Year', 1, 'Big data processing and analytics');

-- Insert default time slots
INSERT INTO time_slots (id, slot_name, start_time, end_time, order_index, is_active) VALUES
('20000000-0000-0000-0000-000000000001', '9:00 - 9:50', '09:00:00', '09:50:00', 1, true),
('20000000-0000-0000-0000-000000000002', '9:50 - 10:40', '09:50:00', '10:40:00', 2, true),
('20000000-0000-0000-0000-000000000003', '11:00 - 11:50', '11:00:00', '11:50:00', 3, true),
('20000000-0000-0000-0000-000000000004', '11:50 - 12:40', '11:50:00', '12:40:00', 4, true),
('20000000-0000-0000-0000-000000000005', '1:30 - 2:20', '13:30:00', '14:20:00', 5, true),
('20000000-0000-0000-0000-000000000006', '2:20 - 3:10', '14:20:00', '15:10:00', 6, true),
('20000000-0000-0000-0000-000000000007', '3:30 - 4:20', '15:30:00', '16:20:00', 7, true),
('20000000-0000-0000-0000-000000000008', '4:20 - 5:10', '16:20:00', '17:10:00', 8, true);

-- Insert sample student for demo
INSERT INTO user_profiles (id, email, role, is_active) VALUES
('30000000-0000-0000-0000-000000000001', 'student@vignan.ac.in', 'student', true);

INSERT INTO students (
    id, user_id, hall_ticket, name, email, phone, year, section,
    father_name, mother_name, date_of_birth, blood_group, is_active
) VALUES
(
    '30000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '20AI001',
    'Rahul Sharma',
    'student@vignan.ac.in',
    '+91 9876543211',
    '3rd Year',
    'A',
    'Suresh Sharma',
    'Priya Sharma',
    '2002-05-15',
    'A+',
    true
);

-- Insert sample department events
INSERT INTO department_events (id, title, description, event_date, start_time, end_time, venue, organizer_id) VALUES
('40000000-0000-0000-0000-000000000001', 'AI & Data Science Symposium 2025', 'Annual symposium featuring latest research in AI and Data Science', '2025-04-15', '09:00:00', '17:00:00', 'Main Auditorium', '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002', 'Industry Expert Talk on Machine Learning', 'Guest lecture by industry expert on current ML trends', '2025-03-28', '14:00:00', '16:00:00', 'Conference Hall', '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000003', 'Project Exhibition', 'Final year project exhibition and evaluation', '2025-04-20', '10:00:00', '16:00:00', 'Exhibition Hall', '00000000-0000-0000-0000-000000000002');

-- ===================================
-- SETUP COMPLETE!
-- ===================================

-- Your database is now ready with:
-- ✅ Complete schema with all tables
-- ✅ All 10 faculty members with credentials  
-- ✅ Sample courses and time slots
-- ✅ Demo student account
-- ✅ Sample department events
-- ✅ Row Level Security enabled
-- ✅ Performance indexes created

-- Next: Configure environment variables in Vercel:
-- VITE_SUPABASE_URL=https://kncqarmijdchduwkrani.supabase.co
-- VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuY3Fhcm1pamRjaGR1d2tyYW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDQ2NzQsImV4cCI6MjA2OTc4MDY3NH0.EUQ7HXEUREZRACpEWchWd5p4YvA1vHRGyYI3uhuwDgU
