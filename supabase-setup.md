# Supabase Setup Guide for College Department Management System

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Database Schema

Run the following SQL commands in your Supabase SQL editor:

### Users and Authentication

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'faculty', 'admin', 'hod')),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  profile_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE public.students (
  id UUID REFERENCES public.user_profiles(id) PRIMARY KEY,
  hall_ticket VARCHAR(20) UNIQUE NOT NULL,
  admission_year INTEGER NOT NULL,
  current_year INTEGER NOT NULL CHECK (current_year BETWEEN 1 AND 4),
  current_semester INTEGER NOT NULL CHECK (current_semester BETWEEN 1 AND 8),
  branch VARCHAR(10) NOT NULL DEFAULT 'AI & DS',
  section VARCHAR(5) NOT NULL DEFAULT 'A',
  cgpa DECIMAL(3,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Graduated', 'Suspended')),
  date_of_birth DATE,
  blood_group VARCHAR(5),
  address TEXT,
  parent_name VARCHAR(100),
  parent_phone VARCHAR(15),
  emergency_contact VARCHAR(15),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faculty table
CREATE TABLE public.faculty (
  id UUID REFERENCES public.user_profiles(id) PRIMARY KEY,
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  designation VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL DEFAULT 'AI & DS',
  joining_date DATE NOT NULL,
  experience VARCHAR(20),
  specializations TEXT[],
  qualifications TEXT,
  office_location VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Retired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  credits INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  year INTEGER NOT NULL,
  branch VARCHAR(10) NOT NULL,
  faculty_id UUID REFERENCES public.faculty(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  course_id UUID REFERENCES public.courses(id),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Dropped')),
  UNIQUE(student_id, course_id)
);

-- Create results table
CREATE TABLE public.results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID REFERENCES public.enrollments(id),
  exam_type VARCHAR(50) NOT NULL,
  internal_marks DECIMAL(5,2),
  external_marks DECIMAL(5,2),
  total_marks DECIMAL(5,2),
  grade VARCHAR(2),
  exam_date DATE,
  published_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  course_id UUID REFERENCES public.courses(id),
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  marked_by UUID REFERENCES public.faculty(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id, date)
);

-- Create leave_applications table
CREATE TABLE public.leave_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES public.user_profiles(id),
  applicant_type VARCHAR(20) NOT NULL CHECK (applicant_type IN ('student', 'faculty')),
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  approved_by UUID REFERENCES public.user_profiles(id),
  approved_date DATE,
  comments TEXT,
  documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_materials table
CREATE TABLE public.study_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50),
  file_size BIGINT,
  uploaded_by UUID REFERENCES public.faculty(id),
  upload_date DATE DEFAULT CURRENT_DATE,
  access_level VARCHAR(20) DEFAULT 'Public' CHECK (access_level IN ('Public', 'Restricted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timetables table
CREATE TABLE public.timetables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  branch VARCHAR(10) NOT NULL,
  section VARCHAR(5) NOT NULL,
  file_url TEXT NOT NULL,
  upload_date DATE DEFAULT CURRENT_DATE,
  uploaded_by UUID REFERENCES public.user_profiles(id),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES public.user_profiles(id),
  sender_id UUID REFERENCES public.user_profiles(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies

```sql
-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Faculty and admin can view all students" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND user_type IN ('faculty', 'admin', 'hod')
    )
  );

-- Faculty policies
CREATE POLICY "Faculty can view their own data" ON public.faculty
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Everyone can view faculty data" ON public.faculty
  FOR SELECT USING (true);

-- Course policies
CREATE POLICY "Students can view their enrolled courses" ON public.courses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.students s ON e.student_id = s.id
      WHERE s.id = auth.uid() AND e.course_id = courses.id
    )
  );

CREATE POLICY "Faculty can view courses they teach" ON public.courses
  FOR SELECT USING (faculty_id = auth.uid());

CREATE POLICY "Admin can manage all courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND user_type IN ('admin', 'hod')
    )
  );
```

### Functions and Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_applications_updated_at BEFORE UPDATE ON public.leave_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `profiles` (for profile photos)
   - `documents` (for academic documents)
   - `materials` (for study materials)
   - `timetables` (for timetable files)

3. Set up storage policies:

```sql
-- Profile photos bucket policy
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

-- Documents bucket policy
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Study materials bucket policy
CREATE POLICY "Faculty can upload study materials" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'materials' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND user_type IN ('faculty', 'admin', 'hod')
    )
  );

CREATE POLICY "Study materials are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'materials');
```

## 4. Authentication Setup

1. In Supabase dashboard, go to Authentication → Settings
2. Enable email authentication
3. Configure email templates
4. Set up redirect URLs for your Vercel deployment

## 5. Environment Variables

Add these to your Vercel deployment:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

## 6. Seed Data (Optional)

```sql
-- Insert admin user (after creating auth user)
INSERT INTO public.user_profiles (id, user_type, first_name, last_name, email, phone)
VALUES (
  'your-auth-user-id',
  'admin',
  'Admin',
  'User',
  'admin@vignan.ac.in',
  '+91 9876543210'
);

-- Insert sample faculty
INSERT INTO public.user_profiles (id, user_type, first_name, last_name, email, phone)
VALUES (
  gen_random_uuid(),
  'faculty',
  'Dr. Priya',
  'Sharma',
  'priya.sharma@vignan.ac.in',
  '+91 9876543211'
);

-- Add corresponding faculty record
INSERT INTO public.faculty (id, employee_id, designation, department, joining_date, experience)
VALUES (
  (SELECT id FROM public.user_profiles WHERE email = 'priya.sharma@vignan.ac.in'),
  'VIT-AIML-001',
  'Professor & HOD',
  'AI & DS',
  '2015-08-01',
  '15+ years'
);
```

## 7. API Integration

The application will use Supabase client for:
- Authentication
- Real-time data synchronization
- File uploads
- Database operations

Make sure to install Supabase client:

```bash
npm install @supabase/supabase-js
```

## 8. Deployment Notes

- Ensure all environment variables are set in Vercel
- Enable Row Level Security for all tables
- Test authentication flow in production
- Verify file upload permissions
- Check CORS settings for your domain
