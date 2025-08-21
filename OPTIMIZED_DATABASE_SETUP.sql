-- ===================================
-- AI & DATA SCIENCE DEPARTMENT
-- OPTIMIZED DATABASE SETUP
-- Based on actual code analysis
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin', 'hod');
CREATE TYPE designation_type AS ENUM ('HOD', 'Associate Prof.', 'Asst. Prof.', 'DTP Operator');
CREATE TYPE academic_year AS ENUM ('1st Year', '2nd Year', '3rd Year', '4th Year');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read', 'scheduled');

-- ===================================
-- CORE TABLES (Actually Used)
-- ===================================

-- 1. User Profiles Table (Central authentication)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    hall_ticket VARCHAR(50), -- For students
    name VARCHAR(255),
    year VARCHAR(20), -- For students
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Faculty Table (Authentication & Management)
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
    office_room VARCHAR(50),
    joining_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Students Table (Student Records)
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
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Student Data Table (Registration Validation)
CREATE TABLE student_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ht_no VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(255) NOT NULL,
    year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Courses Table
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

-- 6. Messages Table (HOD Messaging)
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

-- 7. Time Slots Table (Timetable Management)
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    order_index INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Department Events Table
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

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================

CREATE INDEX idx_faculty_faculty_id ON faculty(faculty_id);
CREATE INDEX idx_faculty_role ON faculty(role);
CREATE INDEX idx_students_hall_ticket ON students(hall_ticket);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_student_data_ht_no ON student_data(ht_no);
CREATE INDEX idx_student_data_year ON student_data(year);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_time_slots_active ON time_slots(is_active, order_index);
CREATE INDEX idx_department_events_date ON department_events(event_date, is_active);

-- ===================================
-- ROW LEVEL SECURITY
-- ===================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_events ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies (Allow all operations for now - can be tightened later)
CREATE POLICY "Allow all operations" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON faculty FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON student_data FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON courses FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON time_slots FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON department_events FOR ALL USING (true);

-- ===================================
-- INSERT FACULTY DATA
-- ===================================

-- Insert user profiles for faculty
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

-- Insert faculty records
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

-- ===================================
-- INSERT STUDENT VALIDATION DATA
-- ===================================

INSERT INTO student_data (ht_no, student_name, year) VALUES
-- 3rd Year Students
('22891A7205', 'BADINENI HEMANTH', '3rd Year'),
('23891A7201', 'AEMIREDDY DEEKSHITHA', '3rd Year'),
('23891A7202', 'AEMIREDDY DEEPAK REDDY', '3rd Year'),
('23891A7203', 'ALAMPALLY SAI KUMAR', '3rd Year'),
('23891A7204', 'ANANTHULA SHIVAJI', '3rd Year'),
('23891A7205', 'ANDELA KEERTHANA', '3rd Year'),
('23891A7206', 'ANVITH PV', '3rd Year'),
('23891A7207', 'BANIGANDLAPATI G K BHARADWAJ', '3rd Year'),
('23891A7209', 'BAYYA SANTHOSH', '3rd Year'),
('23891A7210', 'BOLLA SAI SURYA ANANTH', '3rd Year'),
('23891A7211', 'CHERUKU VINUTHNA', '3rd Year'),
('23891A7212', 'CHINTHALA REVANTH REDDY', '3rd Year'),
('23891A7213', 'DAMERUPPULA DHANISKH', '3rd Year'),
('23891A7214', 'DANDU RUTHVIK REDDY', '3rd Year'),
('23891A7215', 'DHATRIC PRANAV', '3rd Year'),
('23891A7216', 'DONURU SINDHU', '3rd Year'),
('23891A7217', 'DOTI RAHUL', '3rd Year'),
('23891A7218', 'ERRAKOL LOKESH YADAV', '3rd Year'),
('23891A7219', 'GANJI YASHWANTH KUMAR', '3rd Year'),
('23891A7220', 'GADDAM SAI PRAJWAL', '3rd Year'),
('23891A7221', 'GADDI PRANEETH', '3rd Year'),
('23891A7222', 'GALI AKHIL', '3rd Year'),
('23891A7223', 'GOGIKAR YASHWANTH', '3rd Year'),
('23891A7224', 'GOLI PRANAY KUMAR', '3rd Year'),
('23891A7226', 'GOSHIKA SHIVASHANKAR', '3rd Year'),
('23891A7227', 'GUNAGANTI POOJA', '3rd Year'),
('23891A7228', 'GUNDU SHUBHAM VASANT', '3rd Year'),
('23891A7229', 'JAKKALA PRAVEEN', '3rd Year'),
('23891A7230', 'JAKKAPALLI AJAY', '3rd Year'),
('23891A7231', 'SAINISH SINGH', '3rd Year'),
('23891A7232', 'JILLA SRAVANTHI', '3rd Year'),
('23891A7233', 'KANCHARAKUNTLA PRAVEEN REDDY', '3rd Year'),
('23891A7234', 'KANDREGULA BARGAVA', '3rd Year'),
('23891A7235', 'KANUGULA SAI RAM SHIKHARA', '3rd Year'),
('23891A7236', 'KAPARTHI ARUN KUMAR', '3rd Year'),
('23891A7237', 'KARNATI ASHRITHA', '3rd Year'),
('23891A7238', 'KAVALI POOJA', '3rd Year'),
('23891A7239', 'KOMMU DIVYA', '3rd Year'),
('23891A7240', 'KOTHA GAGAN TEJ REDDY', '3rd Year'),
('23891A7241', 'KOTHURU SRIKAR', '3rd Year'),
('23891A7242', 'MANALA HARISH', '3rd Year'),
('23891A7243', 'MARNENI ANIL CHIRANJEETH', '3rd Year'),
('23891A7244', 'MOKU HARSHAVARDHAN REDDY', '3rd Year'),
('23891A7245', 'MUKKERLA SHIVA SHANKAR', '3rd Year'),
('23891A7246', 'MUSTIPALLY PRANAVI', '3rd Year'),
('23891A7247', 'NADIMINTI JHANSI LAXMI', '3rd Year'),
('23891A7248', 'VISSAKOTI SRIRAM', '3rd Year'),
('23891A7249', 'PAKKIRU DAMINI', '3rd Year'),
('23891A7250', 'PALADHI SRUTHIKA', '3rd Year'),
('23891A7251', 'PANDRE UDAY KUMAR', '3rd Year'),
('23891A7252', 'PARSA SRI HARSHITH MANIDEEP', '3rd Year'),
('23891A7253', 'PONNALURI MAIDHILI KRISHNA', '3rd Year'),
('23891A7254', 'POTLAPALLI ANOOP CHARAN', '3rd Year'),
('23891A7255', 'VEMURI BHAVA PRAVALLIKA', '3rd Year'),
('23891A7256', 'RACHAKONDA GANESH', '3rd Year'),
('23891A7257', 'REGONDA RAGHAVENDRA', '3rd Year'),
('23891A7258', 'SANEM AKSHITHA', '3rd Year'),
('23891A7259', 'SHAIKMOHAMMAD ZAID SHARIFF', '3rd Year'),
('23891A7260', 'SHAIK SAHEER', '3rd Year'),
('23891A7261', 'SYED ALI ASHRAF', '3rd Year'),
('23891A7262', 'TEJASHWINI RAYUDU', '3rd Year'),
('23891A7263', 'THANGELLA SAHASRA REDDY', '3rd Year'),
('23891A7264', 'UJWAL KUMAR RAI', '3rd Year'),
('24895A7201', 'EMPATI PREETHAM', '3rd Year'),
('24895A7202', 'GUGULOTH RAHUL', '3rd Year'),
('24895A7203', 'VANGA NITHIN', '3rd Year'),
('24895A7204', 'KAMATI SHIRISHA', '3rd Year'),
('24895A7205', 'CHILKAMARRI PREM KUMAR', '3rd Year'),
('24895A7206', 'ORUGANTI SIDDU', '3rd Year'),

-- 2nd Year Students
('24891A7201', 'ADIMULAM RAGHU RAM', '2nd Year'),
('24891A7202', 'ALLAM CHARAN TEJA', '2nd Year'),
('24891A7203', 'ALLE HARSHAVARDHAN', '2nd Year'),
('24891A7204', 'AMILPUR HANSIKA', '2nd Year'),
('24891A7205', 'ANUJ ARUN KUMAR', '2nd Year'),
('24891A7206', 'BOBBILLA KRANTHI KUMAR', '2nd Year'),
('24891A7207', 'BURRA AMRUTASRI', '2nd Year'),
('24891A7210', 'CHILUVERU ADITHYA', '2nd Year'),
('24891A7211', 'DINDI ABHISHEK REDDY', '2nd Year'),
('24891A7212', 'DONURU SPOORTHI', '2nd Year'),
('24891A7213', 'ENDHURI RAGHU', '2nd Year'),
('24891A7214', 'ENDROJU SRUJITH KUMAR', '2nd Year'),
('24891A7215', 'ENUGULA BINDU', '2nd Year'),
('24891A7216', 'ESLAVATH CHARAN', '2nd Year'),
('24891A7217', 'GADE LAXMI SATHWIKA', '2nd Year'),
('24891A7218', 'GONELA TEJ SAI KUMAR', '2nd Year'),
('24891A7219', 'GOSHIKONDA NAVATEJA', '2nd Year'),
('24891A7220', 'GUGLAVATH ABHIDAS', '2nd Year'),
('24891A7221', 'GUNAMGARI VAISHNAVI', '2nd Year'),
('24891A7222', 'JILUKARA CHANDU', '2nd Year'),
('24891A7223', 'K N DEEKSHITHA', '2nd Year'),
('24891A7224', 'K PRAJITH REDDY', '2nd Year'),
('24891A7225', 'K.SHIVA CHARAN REDDY', '2nd Year'),
('24891A7226', 'KADAPA TARUN KUMAR', '2nd Year'),
('24891A7227', 'KALIMI SAI NANDHU', '2nd Year'),
('24891A7228', 'KANISETTY KRISHNA MANI CHANDRA', '2nd Year'),
('24891A7229', 'KASANI NAVANEETH KUMAR', '2nd Year'),
('24891A7230', 'KASIREDDY NAGENDAR REDDY', '2nd Year'),
('24891A7231', 'KETHIREDDY SRIVARSHITHAREDDY', '2nd Year'),
('24891A7232', 'KOMATIREDDY AKSHITHA REDDY', '2nd Year'),
('24891A7233', 'KORRA PAVAN KUMAR', '2nd Year'),
('24891A7234', 'KUKUNOORI NIVEDITHA', '2nd Year'),
('24891A7235', 'KURUGUNTLA GUNASRI REDDY', '2nd Year'),
('24891A7236', 'M.AKHILA', '2nd Year'),
('24891A7237', 'MADDA CHATHUR', '2nd Year'),
('24891A7238', 'MAILA VINAY KUMAR', '2nd Year'),
('24891A7239', 'MALLEPALLY YASHWANTH', '2nd Year'),
('24891A7240', 'MALOTH AKHIL', '2nd Year'),
('24891A7241', 'MANGALI BHARATH KUMAR', '2nd Year'),
('24891A7242', 'MARAM KARTHIK REDDY', '2nd Year'),
('24891A7243', 'MARRIVADA AKSHAYA', '2nd Year'),
('24891A7244', 'MEKAM JAHINDRA', '2nd Year'),
('24891A7245', 'MERUGU SRINITH REDDY', '2nd Year'),
('24891A7246', 'MILIKA SREEKURTHI', '2nd Year'),
('24891A7247', 'NEERUGUTTI BHANU PRASAD', '2nd Year'),
('24891A7248', 'PANUMATI VIJAY REDDY', '2nd Year'),
('24891A7249', 'POLAMONI RAKESH', '2nd Year'),
('24891A7250', 'POTTA SUDARSHAN GOUD', '2nd Year'),
('24891A7251', 'RAMPALLI KOUSHIK', '2nd Year'),
('24891A7252', 'RAVI ANAND REDDY', '2nd Year'),
('24891A7253', 'S.ARTHI', '2nd Year'),
('24891A7254', 'SAMALA SHASHANTH', '2nd Year'),
('24891A7255', 'SARIKONDA RAVEENA', '2nd Year'),
('24891A7256', 'SEEKURTHI PRISHA PRIYANJAL', '2nd Year'),
('24891A7257', 'SHAIK FARIDA RAHAMAT', '2nd Year'),
('24891A7258', 'SHAIK SANIYA', '2nd Year'),
('24891A7259', 'SUNKARA RITHIKA', '2nd Year'),
('24891A7260', 'SURUGURI NETHRA', '2nd Year'),
('24891A7261', 'SUTHARI HARIKA', '2nd Year'),
('24891A7262', 'UDUTHA SHRAVANI', '2nd Year'),
('24891A7263', 'VADIKARI KALYAN', '2nd Year'),
('24891A7264', 'VALABOJU HAMSIKA', '2nd Year');

-- ===================================
-- INSERT SAMPLE COURSES
-- ===================================

INSERT INTO courses (id, course_code, course_name, credits, year, semester, description) VALUES
('10000000-0000-0000-0000-000000000001', 'AI1001', 'Introduction to Artificial Intelligence', 4, '1st Year', 1, 'Basic concepts of AI and machine learning'),
('10000000-0000-0000-0000-000000000002', 'DS1001', 'Data Structures and Algorithms', 4, '1st Year', 1, 'Fundamental data structures and algorithms'),
('10000000-0000-0000-0000-000000000003', 'PY1001', 'Python Programming', 3, '1st Year', 1, 'Introduction to Python programming'),
('10000000-0000-0000-0000-000000000004', 'ML2001', 'Machine Learning', 4, '2nd Year', 1, 'Machine learning algorithms and applications'),
('10000000-0000-0000-0000-000000000005', 'DL3001', 'Deep Learning', 4, '3rd Year', 1, 'Neural networks and deep learning'),
('10000000-0000-0000-0000-000000000006', 'CV3002', 'Computer Vision', 3, '3rd Year', 2, 'Image processing and computer vision'),
('10000000-0000-0000-0000-000000000007', 'NLP3003', 'Natural Language Processing', 3, '3rd Year', 2, 'Text processing and NLP techniques'),
('10000000-0000-0000-0000-000000000008', 'BD4001', 'Big Data Analytics', 4, '4th Year', 1, 'Big data processing and analytics');

-- ===================================
-- INSERT DEFAULT TIME SLOTS
-- ===================================

INSERT INTO time_slots (id, slot_name, start_time, end_time, order_index, is_active) VALUES
('20000000-0000-0000-0000-000000000001', '9:00 - 9:50', '09:00:00', '09:50:00', 1, true),
('20000000-0000-0000-0000-000000000002', '9:50 - 10:40', '09:50:00', '10:40:00', 2, true),
('20000000-0000-0000-0000-000000000003', '11:00 - 11:50', '11:00:00', '11:50:00', 3, true),
('20000000-0000-0000-0000-000000000004', '11:50 - 12:40', '11:50:00', '12:40:00', 4, true),
('20000000-0000-0000-0000-000000000005', '1:30 - 2:20', '13:30:00', '14:20:00', 5, true),
('20000000-0000-0000-0000-000000000006', '2:20 - 3:10', '14:20:00', '15:10:00', 6, true),
('20000000-0000-0000-0000-000000000007', '3:30 - 4:20', '15:30:00', '16:20:00', 7, true),
('20000000-0000-0000-0000-000000000008', '4:20 - 5:10', '16:20:00', '17:10:00', 8, true);

-- ===================================
-- INSERT SAMPLE DEPARTMENT EVENTS
-- ===================================

INSERT INTO department_events (id, title, description, event_date, start_time, end_time, venue, organizer_id) VALUES
('40000000-0000-0000-0000-000000000001', 'AI & Data Science Symposium 2025', 'Annual symposium featuring latest research in AI and Data Science', '2025-04-15', '09:00:00', '17:00:00', 'Main Auditorium', '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002', 'Industry Expert Talk on Machine Learning', 'Guest lecture by industry expert on current ML trends', '2025-03-28', '14:00:00', '16:00:00', 'Conference Hall', '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000003', 'Project Exhibition', 'Final year project exhibition and evaluation', '2025-04-20', '10:00:00', '16:00:00', 'Exhibition Hall', '00000000-0000-0000-0000-000000000002');

-- ===================================
-- CREATE DEMO STUDENT ACCOUNT
-- ===================================

-- Insert demo student user profile
INSERT INTO user_profiles (id, email, role, hall_ticket, name, year, is_active) VALUES
('30000000-0000-0000-0000-000000000001', 'student@vignan.ac.in', 'student', '20AI001', 'Rahul Sharma', '3rd Year', true);

-- Insert demo student record
INSERT INTO students (
    id, user_id, hall_ticket, name, email, phone, year, section,
    father_name, mother_name, date_of_birth, blood_group, is_active
) VALUES (
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

-- Add demo student to student_data for validation
INSERT INTO student_data (ht_no, student_name, year) VALUES
('20AI001', 'RAHUL SHARMA', '3rd Year');

-- ===================================
-- SETUP COMPLETE!
-- ===================================

-- Summary:
-- ✅ 8 Essential tables created with proper relationships
-- ✅ All 10 faculty members added with working credentials
-- ✅ Complete student validation database (120+ records)
-- ✅ Sample courses and time slots
-- ✅ Demo student account for testing
-- ✅ Department events for homepage
-- ✅ Simple RLS policies (allow all for now)
-- ✅ Performance indexes created
-- ✅ Optimized schema based on actual code usage

-- Test Credentials:
-- HOD: AIDS-HVS1 / @VSrinivas231
-- Faculty: AIDS-ANK1 / @NMKrishna342
-- Admin: AIDS-DKS1 / @KSomesh702
-- Student: Register with any hall ticket from student_data table

-- Environment Variables Already Set:
-- VITE_SUPABASE_URL=https://plthigkzjkcxunifsptr.supabase.co
-- VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
