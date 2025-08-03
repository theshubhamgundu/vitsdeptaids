# 🚀 Deploy to Vercel - Step by Step

## Prerequisites Completed ✅
- Application is built and ready
- Supabase fallback system implemented
- All faculty data prepared

## Step 1: Deploy to Vercel

### Option A: Via Vercel MCP (Recommended)
Since Vercel MCP is connected, the deployment will be automatic when you push to git.

### Option B: Manual Deployment
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Vite project
5. Click "Deploy"

## Step 2: Add Environment Variables

After deployment, in your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
VITE_SUPABASE_URL = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
NODE_ENV = production
```

3. Click **Save**
4. **Redeploy** the application

## Step 3: Test Your Deployment

After deployment completes:

1. **Visit your Vercel URL**
2. **Check System Status** - Should show "Demo Mode" initially
3. **Test Login** with these credentials:

### HOD Login:
- Faculty ID: `AIDS-HVS1`
- Password: `@VSrinivas231`

### Faculty Login:
- Faculty ID: `AIDS-ANK1` 
- Password: `@NMKrishna342`

### Student Login:
- Hall Ticket: `20AI001`
- Password: `student123`

## Step 4: Setup Supabase Database

1. **Create Supabase Project** at [supabase.com](https://supabase.com)
2. **Copy Project URL and Anon Key**
3. **Open SQL Editor** in Supabase
4. **Run Schema Script** (paste contents of `supabase-schema.sql`)
5. **Run Data Migration** (paste contents of `faculty-data-migration.sql`)
6. **Create Storage Buckets**:
   - profiles (public)
   - documents (private)
   - materials (public)
   - timetables (public)

## Step 5: Connect Database

1. **Add Environment Variables** in Vercel (from Step 2)
2. **Trigger Redeploy** in Vercel
3. **Visit Application** - Status should change to "Production Mode"
4. **Test Database Features**:
   - Login with faculty credentials
   - Send messages as HOD
   - Create timetables as Admin

## 🎉 Deployment Complete!

Your application will be live at: `https://your-project-name.vercel.app`

## 📞 Troubleshooting

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure Supabase database scripts ran without errors
4. Test in "Demo Mode" first, then add database connection

## 🔑 Login Credentials Summary

All faculty credentials are ready to use:
- **HOD**: AIDS-HVS1 / @VSrinivas231
- **9 Faculty Members** with individual credentials
- **Admin**: AIDS-DKS1 / @KSomesh702
- **Student Demo**: 20AI001 / student123

The system is production-ready! 🚀
