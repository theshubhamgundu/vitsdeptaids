# Vignan AI & Data Science Department Management System - Deployment Guide

## 🚀 Deployment Overview

This guide walks you through deploying the Vignan AI & Data Science Department Management System to Vercel with Supabase database integration.

## 📋 Prerequisites

- Vercel account (connected via MCP)
- Supabase account (connected via MCP)
- Git repository access

## 🛠️ Database Setup (Supabase)

### Step 1: Create Database Schema

1. Run the schema creation script in your Supabase SQL editor:
   ```sql
   -- Execute the contents of supabase-schema.sql
   ```

2. This will create:
   - All necessary tables (faculty, students, courses, messages, etc.)
   - Proper indexes for performance
   - Row Level Security policies
   - Enum types for data consistency

### Step 2: Populate Faculty Data

1. Run the faculty data migration script:
   ```sql
   -- Execute the contents of faculty-data-migration.sql
   ```

2. This populates the database with:
   - All 10 faculty members with correct credentials
   - Sample courses and assignments
   - Default time slots for timetable creation
   - Sample department events

### Step 3: Create Storage Buckets

In your Supabase dashboard, create these storage buckets:

1. **profiles** (public) - For profile photos
2. **documents** (private) - For official documents
3. **materials** (public) - For study materials
4. **timetables** (public) - For timetable files

## 🔐 Environment Variables

### Required Supabase Variables

Set these in your Vercel project environment:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Application Variables

```env
NODE_ENV=production
VITE_APP_URL=https://your-vercel-app.vercel.app
```

## 📱 Faculty Login Credentials

The system comes pre-configured with these faculty accounts:

### HOD Account
- **Faculty ID**: AIDS-HVS1
- **Password**: @VSrinivas231
- **Name**: Dr. V. Srinivas
- **Role**: HOD

### Faculty Accounts
1. **AIDS-ANK1** / @NMKrishna342 - Dr. N. Murali Krishna (Associate Prof.)
2. **AIDS-ABR1** / @BRamakrishna189 - Dr. B. Ramakrishna (Associate Prof.)
3. **AIDS-PSRR1** / @SRReddy583 - Mr. S. Ramana Reddy (Asst. Prof.)
4. **AIDS-PGL1** / @GLavanya478 - Mrs. G. Lavanya (Asst. Prof.)
5. **AIDS-PTSP1** / @TSPrasad764 - Mr. T. Sai Lalith Prasad (Asst. Prof.)
6. **AIDS-PRY1** / @RYamini225 - Mrs. R. Yamini (Asst. Prof.)
7. **AIDS-PCN1** / @CHNaresh611 - Mr. CH. Naresh (Asst. Prof.)
8. **AIDS-PKS1** / @KSindhuja839 - Mrs. K. Sindhuja (Asst. Prof.)

### Admin Account
- **Faculty ID**: AIDS-DKS1
- **Password**: @KSomesh702
- **Name**: Mr. K. Somesh
- **Role**: Admin

### Student Account
- **Hall Ticket**: 20AI001
- **Password**: student123
- **Name**: Rahul Sharma

## ⚡ Deployment Steps

### 1. Push Code to Repository

The application is already built and ready for deployment.

### 2. Deploy to Vercel

The project includes proper Vercel configuration in `vercel.json`:

- Automatic static build configuration
- API routes for backend functionality
- Environment variable management
- Framework detection (Vite)

### 3. Configure Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add all required variables listed above

### 4. Enable Vercel Functions

The project uses Vercel functions for:
- API routes (`/netlify/functions/api.ts`)
- Static file serving
- Server-side rendering support

## 🔒 Security Configuration

### Row Level Security (RLS)

The database uses Supabase RLS with these policies:

1. **Faculty Access**: Faculty can read their own data and student data
2. **Student Access**: Students can read their own data and faculty information  
3. **Message Access**: Role-based message access controls
4. **Admin Access**: Admins have broader access for management functions

### Authentication Flow

1. **Login**: Users authenticate via faculty ID/hall ticket + password
2. **Session**: JWT token stored in localStorage for session management
3. **Authorization**: Role-based access control on all routes
4. **Data Access**: Supabase RLS enforces data access rules

## 📊 Features Overview

### Student Dashboard
- View timetables by year
- Check attendance and results
- Access study materials
- Apply for leave
- View fee payment status
- Receive notifications

### Faculty Dashboard  
- Manage assigned students
- Upload study materials
- Record attendance
- View and send messages
- Access personal profile

### HOD Dashboard
- Send department-wide messages
- View faculty assignments and workload
- Manage timetables
- Review leave applications
- Access analytics and reports

### Admin Dashboard
- Create and manage faculty profiles
- Create and manage student profiles
- Design custom timetables
- Upload department content
- System configuration

## 🚀 Post-Deployment Steps

1. **Test Authentication**: Verify all login credentials work
2. **Check Database Connectivity**: Ensure Supabase connection is stable
3. **Test Core Features**: Verify timetables, messages, and data display
4. **Upload Content**: Add real study materials and announcements
5. **User Training**: Provide access credentials to actual faculty and students

## 🛟 Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure all Supabase variables are correctly set
2. **Database Connection**: Check Supabase project URL and keys
3. **Build Errors**: Verify all dependencies are installed
4. **Authentication Issues**: Confirm faculty data exists in database

### Support

For technical issues:
- Check browser console for error messages
- Verify Supabase connection in Network tab
- Test API endpoints directly
- Review Vercel function logs

## 📈 Monitoring & Maintenance

### Regular Tasks
- Monitor Supabase usage and storage
- Review and update user access
- Backup important data regularly
- Update faculty and student information

### Performance Optimization
- Monitor page load times
- Optimize image sizes and caching
- Review database query performance
- Implement CDN for static assets

---

The system is now fully deployed and ready for use by the Vignan AI & Data Science Department! 🎉
