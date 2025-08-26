-- Add password column to students table for authentication
-- Run this in your Supabase SQL Editor

-- Add password column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT '';

-- Update existing students to have hall ticket as default password
UPDATE students 
SET password = hall_ticket 
WHERE password = '' OR password IS NULL;

-- Update the demo student to have correct password
UPDATE students 
SET password = '20AI001' 
WHERE hall_ticket = '20AI001';

-- Create index for faster password lookups
CREATE INDEX IF NOT EXISTS idx_students_password ON students(password);
