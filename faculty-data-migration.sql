-- Faculty Data Migration for Vignan AI & Data Science Department
-- Insert real faculty data from facultyData.ts

-- First, create user profiles for each faculty member
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

-- Insert faculty data with proper password hashing (in production, hash the passwords properly)
INSERT INTO faculty (
    id, user_id, faculty_id, name, designation, role, email, phone, 
    department, specialization, experience, qualification, password_hash, 
    can_change_password, office_room, joining_date
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'AIDS-HVS1',
    'Dr. V. Srinivas',
    'HOD',
    'hod',
    'vsrinivas@vignan.ac.in',
    '+91 9876543201',
    'AI & Data Science',
    'Machine Learning, Deep Learning',
    15,
    'Ph.D in Computer Science',
    '@VSrinivas231', -- In production, use proper password hashing
    true,
    'Block-A, Room 301',
    '2010-01-01'
),
(
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'AIDS-ANK1',
    'Dr. N. Murali Krishna',
    'Associate Prof.',
    'faculty',
    'nmkrishna@vignan.ac.in',
    '+91 9876543202',
    'AI & Data Science',
    'Data Mining, Big Data Analytics',
    12,
    'Ph.D in Computer Science',
    '@NMKrishna342',
    true,
    'Block-A, Room 302',
    '2012-01-01'
),
(
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'AIDS-ABR1',
    'Dr. B. Ramakrishna',
    'Associate Prof.',
    'faculty',
    'bramakrishna@vignan.ac.in',
    '+91 9876543203',
    'AI & Data Science',
    'Computer Vision, Image Processing',
    10,
    'Ph.D in Electronics',
    '@BRamakrishna189',
    true,
    'Block-A, Room 303',
    '2014-01-01'
),
(
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004',
    'AIDS-PSRR1',
    'Mr. S. Ramana Reddy',
    'Asst. Prof.',
    'faculty',
    'sramana@vignan.ac.in',
    '+91 9876543204',
    'AI & Data Science',
    'Natural Language Processing, Python Programming',
    8,
    'M.Tech in CSE',
    '@SRReddy583',
    true,
    'Block-A, Room 304',
    '2016-01-01'
),
(
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000005',
    'AIDS-PGL1',
    'Mrs. G. Lavanya',
    'Asst. Prof.',
    'faculty',
    'glavanya@vignan.ac.in',
    '+91 9876543205',
    'AI & Data Science',
    'Data Structures, Algorithms',
    6,
    'M.Tech in CSE',
    '@GLavanya478',
    true,
    'Block-A, Room 305',
    '2018-01-01'
),
(
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000006',
    'AIDS-PTSP1',
    'Mr. T. Sai Lalith Prasad',
    'Asst. Prof.',
    'faculty',
    'tsailalith@vignan.ac.in',
    '+91 9876543206',
    'AI & Data Science',
    'Database Systems, Web Technologies',
    5,
    'M.Tech in CSE',
    '@TSPrasad764',
    true,
    'Block-A, Room 306',
    '2019-01-01'
),
(
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000007',
    'AIDS-PRY1',
    'Mrs. R. Yamini',
    'Asst. Prof.',
    'faculty',
    'ryamini@vignan.ac.in',
    '+91 9876543207',
    'AI & Data Science',
    'Statistics, Mathematics for AI',
    4,
    'M.Sc in Statistics',
    '@RYamini225',
    true,
    'Block-A, Room 307',
    '2020-01-01'
),
(
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000008',
    'AIDS-PCN1',
    'Mr. CH. Naresh',
    'Asst. Prof.',
    'faculty',
    'chnaresh@vignan.ac.in',
    '+91 9876543208',
    'AI & Data Science',
    'Software Engineering, Project Management',
    7,
    'M.Tech in CSE',
    '@CHNaresh611',
    true,
    'Block-A, Room 308',
    '2017-01-01'
),
(
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000009',
    'AIDS-PKS1',
    'Mrs. K. Sindhuja',
    'Asst. Prof.',
    'faculty',
    'ksindhuja@vignan.ac.in',
    '+91 9876543209',
    'AI & Data Science',
    'Cloud Computing, IoT',
    3,
    'M.Tech in CSE',
    '@KSindhuja839',
    true,
    'Block-A, Room 309',
    '2021-01-01'
),
(
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000010',
    'AIDS-DKS1',
    'Mr. K. Somesh',
    'DTP Operator',
    'admin',
    'ksomesh@vignan.ac.in',
    '+91 9876543210',
    'AI & Data Science',
    'Administrative Support, Data Entry',
    5,
    'Diploma in Computer Applications',
    '@KSomesh702',
    true,
    'Block-A, Room 310',
    '2019-01-01'
);

-- Insert sample courses
INSERT INTO courses (id, course_code, course_name, credits, year, semester, description) VALUES
('10000000-0000-0000-0000-000000000001', 'AI1001', 'Introduction to Artificial Intelligence', 4, '1st Year', 1, 'Basic concepts of AI and machine learning'),
('10000000-0000-0000-0000-000000000002', 'DS1001', 'Data Structures and Algorithms', 4, '1st Year', 1, 'Fundamental data structures and algorithms'),
('10000000-0000-0000-0000-000000000003', 'PY1001', 'Python Programming', 3, '1st Year', 1, 'Introduction to Python programming'),
('10000000-0000-0000-0000-000000000004', 'ML2001', 'Machine Learning', 4, '2nd Year', 1, 'Machine learning algorithms and applications'),
('10000000-0000-0000-0000-000000000005', 'DL3001', 'Deep Learning', 4, '3rd Year', 1, 'Neural networks and deep learning'),
('10000000-0000-0000-0000-000000000006', 'CV3002', 'Computer Vision', 3, '3rd Year', 2, 'Image processing and computer vision'),
('10000000-0000-0000-0000-000000000007', 'NLP3003', 'Natural Language Processing', 3, '3rd Year', 2, 'Text processing and NLP techniques'),
('10000000-0000-0000-0000-000000000008', 'BD4001', 'Big Data Analytics', 4, '4th Year', 1, 'Big data processing and analytics'),
('10000000-0000-0000-0000-000000000009', 'SE2002', 'Software Engineering', 3, '2nd Year', 2, 'Software development methodologies'),
('10000000-0000-0000-0000-000000000010', 'ST2003', 'Statistics for AI', 3, '2nd Year', 1, 'Statistical methods for AI applications');

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

-- Insert faculty course assignments
INSERT INTO faculty_courses (faculty_id, course_id, year, section) VALUES
-- Dr. V. Srinivas (HOD) - Machine Learning courses
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', '2nd Year', 'A'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', '3rd Year', 'A'),

-- Dr. N. Murali Krishna - Data Mining and Big Data
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000008', '4th Year', 'A'),
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '1st Year', 'A'),

-- Dr. B. Ramakrishna - Computer Vision
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006', '3rd Year', 'A'),

-- Mr. S. Ramana Reddy - NLP and Python
('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000007', '3rd Year', 'A'),
('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', '1st Year', 'A'),

-- Mrs. G. Lavanya - Data Structures
('00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '1st Year', 'B'),

-- Mr. T. Sai Lalith Prasad - Database and Web Technologies
('00000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', '1st Year', 'B'),

-- Mrs. R. Yamini - Statistics
('00000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000010', '2nd Year', 'A'),

-- Mr. CH. Naresh - Software Engineering
('00000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000009', '2nd Year', 'A'),

-- Mrs. K. Sindhuja - AI Introduction
('00000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', '1st Year', 'A');

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

-- Insert some sample department events
INSERT INTO department_events (id, title, description, event_date, start_time, end_time, venue, organizer_id) VALUES
('40000000-0000-0000-0000-000000000001', 
 'AI & Data Science Symposium 2025', 
 'Annual symposium featuring latest research in AI and Data Science', 
 '2025-04-15', 
 '09:00:00', 
 '17:00:00', 
 'Main Auditorium', 
 '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002', 
 'Industry Expert Talk on Machine Learning', 
 'Guest lecture by industry expert on current ML trends', 
 '2025-03-28', 
 '14:00:00', 
 '16:00:00', 
 'Conference Hall', 
 '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000003', 
 'Project Exhibition', 
 'Final year project exhibition and evaluation', 
 '2025-04-20', 
 '10:00:00', 
 '16:00:00', 
 'Exhibition Hall', 
 '00000000-0000-0000-0000-000000000002');
