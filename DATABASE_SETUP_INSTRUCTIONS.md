# 🚀 Database Setup Instructions

## ✅ Environment Variables Already Set

The environment variables have been configured:

- `VITE_SUPABASE_URL`: https://plthigkzjkcxunifsptr.supabase.co
- `VITE_SUPABASE_ANON_KEY`: Your anon key

## 📋 Next Steps - Apply Database Schema

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard/projects
2. Select your project: `plthigkzjkcxunifsptr`
3. Click on **SQL Editor** in the left sidebar
4. Click **"New Query"**

### Step 2: Apply the Optimized Schema

1. Copy the entire content from `OPTIMIZED_DATABASE_SETUP.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** button

This will create:

- ✅ 8 essential tables (user_profiles, faculty, students, student_data, courses, messages, time_slots, department_events)
- ✅ All 10 faculty members with working credentials
- ✅ Complete student validation database (120+ student records)
- ✅ Sample courses and time slots
- ✅ Demo student account for testing
- ✅ Performance indexes and basic security

### Step 3: Verify Setup (After Running SQL)

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables:
   - `user_profiles`
   - `faculty`
   - `students`
   - `student_data`
   - `courses`
   - `messages`
   - `time_slots`
   - `department_events`

### Step 4: Test Faculty Table

1. Click on `faculty` table
2. You should see 10 faculty members including:
   - Dr. V. Srinivas (HOD) - AIDS-HVS1
   - Dr. N. Murali Krishna (Faculty) - AIDS-ANK1
   - Mr. K. Somesh (Admin) - AIDS-DKS1

### Step 5: Test Student Data Table

1. Click on `student_data` table
2. You should see 120+ student records
3. Search for "23891A7228" - should find "GUNDU SHUBHAM VASANT"

## 🧪 Testing Credentials

### Faculty Login Test:

- **HOD**: AIDS-HVS1 / @VSrinivas231
- **Faculty**: AIDS-ANK1 / @NMKrishna342
- **Admin**: AIDS-DKS1 / @KSomesh702

### Student Registration Test:

Try registering with any hall ticket from the student_data table:

- **Hall Ticket**: 23891A7228
- **Name**: GUNDU SHUBHAM VASANT (must be exact, uppercase)
- **Year**: 3rd Year

## 🔧 If Something Goes Wrong

### SQL Execution Fails:

1. Check if you have the correct project selected
2. Make sure you're using the **SQL Editor**, not Table Editor
3. Try running the SQL in smaller chunks if needed

### Tables Not Created:

1. Refresh the Supabase dashboard
2. Check the **Logs** section for error messages
3. Ensure you have admin access to the project

### Connection Still Fails:

1. Verify the environment variables are correct
2. Check the browser console for any errors
3. The system will use local fallback if database is unavailable

## 📞 Next Steps After Database Setup

Once you've successfully applied the SQL schema:

1. **Test the application** - Try logging in with faculty credentials
2. **Test student registration** - Use a valid hall ticket from student_data
3. **Verify admin functions** - Login as admin and check content management
4. **Check fallback system** - Ensure local fallback works if database is down

The application is designed to work with both database and local fallback, so it will be functional regardless of database status.

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Faculty can login with provided credentials
- ✅ Students can register with valid hall tickets
- ✅ Dashboard pages load without errors
- ✅ No database connection errors in browser console

**Let me know when you've applied the SQL schema and I'll test the connection!**
