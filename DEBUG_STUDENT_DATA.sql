-- Debug Student Data Issues
-- Run this in your Supabase SQL Editor to check the student_data table

-- 1. Check if student_data table exists and has data
SELECT COUNT(*) as total_students FROM student_data;

-- 2. Check the structure of the first few records
SELECT 
    id,
    ht_no,
    student_name,
    year,
    section,
    branch
FROM student_data 
LIMIT 5;

-- 3. Check for any records with missing names or HT numbers
SELECT 
    COUNT(*) as records_with_missing_names,
    COUNT(*) FILTER (WHERE student_name IS NULL OR student_name = '') as null_names,
    COUNT(*) FILTER (WHERE ht_no IS NULL OR ht_no = '') as null_ht_numbers
FROM student_data;

-- 4. Check year distribution
SELECT 
    year,
    COUNT(*) as student_count
FROM student_data 
GROUP BY year 
ORDER BY year;

-- 5. Check for any data type issues
SELECT 
    ht_no,
    student_name,
    year,
    CASE 
        WHEN ht_no IS NULL THEN 'NULL'
        WHEN ht_no = '' THEN 'EMPTY'
        ELSE 'HAS_VALUE'
    END as ht_no_status,
    CASE 
        WHEN student_name IS NULL THEN 'NULL'
        WHEN student_name = '' THEN 'EMPTY'
        ELSE 'HAS_VALUE'
    END as name_status
FROM student_data 
WHERE ht_no IS NULL OR ht_no = '' OR student_name IS NULL OR student_name = ''
LIMIT 10;

-- 6. Check if there are any duplicate HT numbers
SELECT 
    ht_no,
    COUNT(*) as count
FROM student_data 
WHERE ht_no IS NOT NULL AND ht_no != ''
GROUP BY ht_no 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 7. Sample data for 3rd Year (since that's what's shown in the screenshot)
SELECT 
    ht_no,
    student_name,
    year,
    section
FROM student_data 
WHERE year = '3rd Year'
ORDER BY ht_no
LIMIT 10;
