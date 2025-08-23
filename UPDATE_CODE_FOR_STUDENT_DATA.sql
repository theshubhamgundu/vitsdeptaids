-- First, check your student_data table structure
-- Run this to see what columns you have

SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'student_data'
ORDER BY ordinal_position;

-- Then check a few sample records to see the data format
SELECT * FROM student_data LIMIT 3;

-- Check the total count
SELECT COUNT(*) as total_students FROM student_data;
