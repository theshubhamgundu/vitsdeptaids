-- ========================================
-- DATABASE CLEANUP SCRIPT
-- Remove all pre-filled data for fresh start
-- ========================================

-- WARNING: This will remove ALL existing data
-- Only run this if you want to start completely fresh

-- Delete all existing records
DELETE FROM department_events;
DELETE FROM messages;
DELETE FROM notifications;
DELETE FROM timetables;
DELETE FROM time_slots;
DELETE FROM courses;
DELETE FROM students;
DELETE FROM faculty;
DELETE FROM user_profiles;

-- Reset sequences (if any)
-- Supabase uses UUIDs, so no sequences to reset

-- Insert only the default time slots (essential for system)
INSERT INTO time_slots (id, slot_name, start_time, end_time, order_index, is_active) VALUES
('20000000-0000-0000-0000-000000000001', '9:00 - 9:50', '09:00:00', '09:50:00', 1, true),
('20000000-0000-0000-0000-000000000002', '9:50 - 10:40', '09:50:00', '10:40:00', 2, true),
('20000000-0000-0000-0000-000000000003', '11:00 - 11:50', '11:00:00', '11:50:00', 3, true),
('20000000-0000-0000-0000-000000000004', '11:50 - 12:40', '11:50:00', '12:40:00', 4, true),
('20000000-0000-0000-0000-000000000005', '1:30 - 2:20', '13:30:00', '14:20:00', 5, true),
('20000000-0000-0000-0000-000000000006', '2:20 - 3:10', '14:20:00', '15:10:00', 6, true),
('20000000-0000-0000-0000-000000000007', '3:30 - 4:20', '15:30:00', '16:20:00', 7, true),
('20000000-0000-0000-0000-000000000008', '4:20 - 5:10', '16:20:00', '17:10:00', 8, true);

-- ========================================
-- CLEANUP COMPLETE!
-- ========================================

-- What was removed:
-- ✅ All faculty data
-- ✅ All student data  
-- ✅ All user profiles
-- ✅ All messages
-- ✅ All timetables
-- ✅ All courses
-- ✅ All department events
-- ✅ All notifications

-- What remains:
-- ✅ Database schema (tables, indexes, policies)
-- ✅ Default time slots for timetable creation

-- Next steps:
-- 1. Faculty/Admin will need to create their profiles manually
-- 2. Students will register through the new student signup process
-- 3. All data will be created organically by users
-- 4. System is now completely clean for testing
