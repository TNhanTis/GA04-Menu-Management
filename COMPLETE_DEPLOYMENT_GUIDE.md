# 🚀 Complete Deployment Guide

This guide will walk you through deploying your Menu Management System with:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage

---

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- Supabase account (sign up at https://supabase.com)

---

## Part 1: Setup Supabase (Database + Storage)

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `menu-management` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Get Database Connection String

1. In your Supabase project, go to **"Settings"** → **"Database"**
2. Scroll down to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
5. Replace `[YOUR-PASSWORD]` with your database password
6. **Save this** - you'll need it for Render

### 1.3 Setup Storage Bucket

1. In Supabase, go to **"Storage"** in left sidebar
2. Click **"Create a new bucket"**
3. Bucket settings:
   - **Name**: `menu-photos`
   - **Public bucket**: ✅ **YES** (check this box - important!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
4. Click **"Create bucket"**

### 1.4 Configure Storage Policies

1. Click on your `menu-photos` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Create these policies:

**Policy 1: Public Read Access**
- Template: **"Enable read access for all users"**
- Click **"Use this template"**
- Click **"Review"** → **"Save policy"**

**Policy 2: Public Upload Access** (for development - tighten this later)
- Click **"New Policy"** → **"Create policy from scratch"**
- Policy name: `Enable upload for all users`
- Allowed operations: ✅ **INSERT**
- Target roles: Check **"All roles"**
- Click **"Review"** → **"Save policy"**

**Policy 3: Public Delete Access** (for development)
- Click **"New Policy"** → **"Create policy from scratch"**
- Policy name: `Enable delete for all users`
- Allowed operations: ✅ **DELETE**
- Target roles: Check **"All roles"**
- Click **"Review"** → **"Save policy"**

### 1.5 Get Supabase Credentials

1. Go to **"Settings"** → **"API"**
2. Copy and save these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGc...` (long string)
   - **service_role** key: `eyJhbGc...` (long string - keep this secret!)

---

## Part 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

```bash
cd /home/gia-bao/Documents/Web/GA04/GA04-Menu-Management
git add .
git commit -m "Setup Supabase storage and deployment config"
git push origin main
```

### 2.2 Create Render Web Service

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `GA04-Menu-Management` repository

### 2.3 Configure Render Service

Fill in these settings:

**Basic Settings:**
- **Name**: `menu-management-backend` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your branch name)
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build Settings:**
- **Build Command**: 
  ```
  npm install && npx prisma generate && npm run build
  ```
- **Start Command**: 
  ```
  npx prisma migrate deploy && npm run start:prod
  ```

**Instance Type:**
- Select **"Free"** (for testing) or **"Starter"** (for production)

### 2.4 Add Environment Variables

Click **"Add Environment Variable"** and add these **one by one**:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `3000` | |
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@...` | From Supabase Step 1.2 |
| `JWT_SECRET` | Generate random string | Use https://passwordsgenerator.net/ (32+ chars) |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | From Supabase Step 1.5 |
| `SUPABASE_SERVICE_KEY` | `eyJhbGc...` | **service_role** key from Step 1.5 |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **Add after deploying frontend** |
| `FRONTEND_MENU_URL` | `https://your-menu.vercel.app` | Optional, if you have separate menu URL |

⚠️ **Important**: Don't click "Create Web Service" yet! We need to add FRONTEND_URL after deploying frontend.

### 2.5 Deploy Backend (First Time)

1. For now, set `FRONTEND_URL` to `http://localhost:5173` (temporary)
2. Click **"Create Web Service"**
3. Wait for deployment (~5-10 minutes)
4. Once deployed, copy your backend URL: `https://menu-management-backend.onrender.com`

---

## Part 3: Deploy Frontend to Vercel

### 3.1 Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 3.2 Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://menu-management-backend.onrender.com` |

(Use the backend URL from Step 2.5)

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment (~2-3 minutes)
3. Once deployed, copy your frontend URL: `https://your-app.vercel.app`

---

## Part 4: Update Backend with Frontend URL

### 4.1 Add Frontend URL to Render

1. Go back to Render dashboard
2. Click on your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` variable with your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy (~3-5 minutes)

---

## Part 5: Run Database Migrations

### 5.1 Option A: Automatic (Recommended)

✅ **Already done!** Your start command includes `npx prisma migrate deploy`

The migrations will run automatically when Render deploys.

### 5.2 Option B: Manual (If needed)

If you need to run migrations manually:

1. In Render dashboard, go to your service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

---

## Part 6: Test Your Deployment

### 6.1 Test Backend

1. Visit: `https://menu-management-backend.onrender.com/`
2. Should see: `{"message":"Table Management API is running"}`

### 6.2 Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Should see the login page
3. Create an admin account and test all features

### 6.3 Test Photo Upload

1. Log in to admin dashboard
2. Go to Menu Items
3. Create or edit an item
4. Upload a photo
5. Photo should appear immediately (stored in Supabase)

---

## Part 7: Load Sample Data (Optional)

### 7.1 Connect to Supabase Database

1. In Supabase, go to **"SQL Editor"**
2. Click **"New query"**
3. Copy the contents of `sample-data.sql` from your project
4. Paste into the editor
5. Click **"Run"**

This will create sample categories, menu items, and modifiers.

---

## 🎉 Deployment Complete!

Your application is now live at:
- **Admin Dashboard**: `https://your-app.vercel.app`
- **Backend API**: `https://menu-management-backend.onrender.com`
- **Database**: Supabase PostgreSQL
- **Photos**: Supabase Storage

---

## 📝 Important URLs to Save

Create a document with these URLs:

```
Frontend URL: https://your-app.vercel.app
Backend URL: https://menu-management-backend.onrender.com
Supabase URL: https://xxxxx.supabase.co
Supabase Project: https://app.supabase.com/project/xxxxx

Admin Email: your-email@example.com
Admin Password: ********
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check Render logs: Click service → "Logs" tab
- Verify `DATABASE_URL` is correct
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set

### Frontend can't connect to backend
- Check browser console for errors
- Verify `VITE_API_URL` in Vercel settings
- Verify `FRONTEND_URL` in Render settings
- Check CORS errors in Render logs

### Photos won't upload
- Check Supabase Storage bucket is **public**
- Verify storage policies are set correctly
- Check `SUPABASE_SERVICE_KEY` in Render
- Check Render logs for upload errors

### Database connection errors
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Check Supabase database is active
- Try connection pooling URL from Supabase settings

---

## 🔄 Auto-Deployment

Both platforms support auto-deployment:

**Vercel:**
- Automatically redeploys on every push to `main` branch
- Also creates preview deployments for PRs

**Render:**
- Automatically redeploys on every push to `main` branch
- Configure in: Service Settings → "Auto-Deploy"

---

## 💰 Cost Estimate

**Free Tier (Perfect for assignment/testing):**
- Vercel: Free (100GB bandwidth/month)
- Render: Free (750 hours/month)
- Supabase: Free (500MB database, 1GB storage)

**Total: $0/month** ✅

**Production (If scaling up later):**
- Vercel Pro: $20/month
- Render Starter: $7/month
- Supabase Pro: $25/month
- Total: ~$52/month

---

## 🔐 Security Checklist

Before submitting:
- ✅ Change default admin password
- ✅ All environment variables set correctly
- ✅ No sensitive data in git repository
- ✅ CORS configured with specific origins
- ✅ JWT secret is strong and random
- ✅ Supabase service_role key is kept secret

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Check logs in Render/Vercel dashboard
3. Verify all environment variables
4. Check Supabase storage policies
5. Review CORS settings

---

**Good luck with your deployment! 🚀**
