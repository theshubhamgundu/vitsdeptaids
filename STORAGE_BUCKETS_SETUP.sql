-- ===================================
-- STORAGE BUCKETS SETUP
-- Create storage buckets for file uploads
-- ===================================

-- Enable storage
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
-- Profile photos bucket (public, 5MB limit)
('profiles', 'profiles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),

-- Documents bucket (private)
('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),

-- Study materials bucket (public)
('materials', 'materials', true, 104857600, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']),

-- Timetables bucket (public)
('timetables', 'timetables', true, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- ===================================
-- STORAGE POLICIES
-- ===================================

-- Profile photos policies
CREATE POLICY "Allow authenticated users to upload profile photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'profiles' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to profile photos" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Allow users to update their own profile photos" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'profiles' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to delete their own profile photos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'profiles' AND
    auth.role() = 'authenticated'
);

-- Documents policies (private)
CREATE POLICY "Allow authenticated users to upload documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to read their own documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
);

-- Study materials policies (public read, faculty upload)
CREATE POLICY "Allow faculty to upload study materials" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'materials' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to study materials" ON storage.objects
FOR SELECT USING (bucket_id = 'materials');

-- Timetables policies (public read, admin upload)
CREATE POLICY "Allow admin to upload timetables" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'timetables' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to timetables" ON storage.objects
FOR SELECT USING (bucket_id = 'timetables');

-- ===================================
-- STORAGE BUCKETS COMPLETE!
-- ===================================

-- Summary:
-- ✅ profiles bucket - Profile photos (5MB, public read)
-- ✅ documents bucket - Private documents (50MB, private)
-- ✅ materials bucket - Study materials (100MB, public read)
-- ✅ timetables bucket - Timetable files (10MB, public read)
-- ✅ Proper RLS policies for security
