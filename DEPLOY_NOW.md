# 🚀 DEPLOY NOW - Quick Start Guide

**Time to complete: 45 minutes**

Follow these steps in order. Don't skip any step!

---

## 📦 What You'll Need

- GitHub account (you have this ✅)
- [Supabase account](https://supabase.com) - Sign up (FREE)
- [Render account](https://render.com) - Sign up (FREE)
- [Vercel account](https://vercel.com) - Sign up (FREE)

---

## 🎯 Step 1: Push to GitHub (2 minutes)

```bash
cd /home/gia-bao/Documents/Web/GA04/GA04-Menu-Management
git add .
git commit -m "Ready for deployment with Supabase storage"
git push origin main
```

✅ **Verify**: Check GitHub - your code should be there

---

## 🗄️ Step 2: Setup Supabase (15 minutes)

### 2.1 Create Project
1. Go to https://supabase.com → Sign in
2. Click **"New Project"**
3. Fill in:
   - Name: `menu-management`
   - Database Password: **SAVE THIS PASSWORD!**
   - Region: Choose closest to you
4. Click **"Create"** (wait 2 minutes)

### 2.2 Get Database URL
1. Go to **Settings** → **Database**
2. Find **"Connection string"** → **"URI"**
3. Copy it (looks like: `postgresql://postgres:...`)
4. Replace `[YOUR-PASSWORD]` with your database password
5. **SAVE IT**: `DATABASE_URL=postgresql://...`

### 2.3 Create Storage
1. Go to **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Settings:
   - Name: `menu-photos`
   - **Public bucket: CHECK THIS BOX ✅**
4. Click **"Create bucket"**

### 2.4 Setup Policies
1. Click your `menu-photos` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**

**Policy 1 - Read**:
- Template: "Enable read access for all users"
- Click **"Use this template"** → **"Review"** → **"Save policy"**

**Policy 2 - Insert**:
- Click **"New Policy"** → **"For full customization"**
- Policy name: `Enable upload for all users`
- Allowed operations: ✅ **INSERT**
- Target roles: ALL
- Click **"Review"** → **"Save policy"**

**Policy 3 - Delete**:
- Click **"New Policy"** → **"For full customization"**
- Policy name: `Enable delete for all users`
- Allowed operations: ✅ **DELETE**
- Target roles: ALL
- Click **"Review"** → **"Save policy"**

### 2.5 Get API Keys
1. Go to **Settings** → **API**
2. Copy these (KEEP THEM SAFE):
   - **Project URL**: `SUPABASE_URL=https://xxxxx.supabase.co`
   - **service_role** key: `SUPABASE_SERVICE_KEY=eyJhbGc...`

✅ **You should have saved**:
- `DATABASE_URL=postgresql://...`
- `SUPABASE_URL=https://...`
- `SUPABASE_SERVICE_KEY=eyJhbGc...`

---

## 🖥️ Step 3: Deploy Backend to Render (10 minutes)

### 3.1 Create Service
1. Go to https://render.com → Sign in
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** → Authorize
4. Select your `GA04-Menu-Management` repository

### 3.2 Configure Service
Fill in:
- **Name**: `menu-management-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && npm run start:prod`
- **Instance Type**: Free

### 3.3 Add Environment Variables
Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | Paste from Supabase (step 2.2) |
| `SUPABASE_URL` | Paste from Supabase (step 2.5) |
| `SUPABASE_SERVICE_KEY` | Paste from Supabase (step 2.5) |
| `JWT_SECRET` | Generate at https://passwordsgenerator.net/ (32 chars) |
| `FRONTEND_URL` | `http://localhost:5173` (temporary - we'll update this) |

### 3.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (~5-10 minutes) ☕
3. Once deployed, copy your URL: `https://menu-management-backend.onrender.com`
4. **SAVE IT**: You'll need this for frontend!

✅ **Test**: Visit your backend URL - should see: `{"message":"Table Management API is running"}`

---

## 🎨 Step 4: Deploy Frontend to Vercel (5 minutes)

### 4.1 Create Project
1. Go to https://vercel.com → Sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** on your `GA04-Menu-Management` repo

### 4.2 Configure
Fill in:
- **Framework Preset**: Vite (auto-detected ✅)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected ✅)
- **Output Directory**: `dist` (auto-detected ✅)

### 4.3 Add Environment Variable
Click **"Environment Variables"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render URL from step 3.4 |

Example: `https://menu-management-backend.onrender.com`

### 4.4 Deploy
1. Click **"Deploy"**
2. Wait (~2-3 minutes) ☕
3. Once deployed, copy your URL: `https://your-app.vercel.app`
4. **SAVE IT**: This is your live app URL!

✅ **Test**: Visit your frontend URL - should see login page

---

## 🔄 Step 5: Update Backend (5 minutes)

### 5.1 Add Frontend URL to Render
1. Go back to Render dashboard
2. Click your backend service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update value to your Vercel URL (from step 4.4)
6. Click **"Save Changes"**

### 5.2 Wait for Redeploy
Render will automatically redeploy (~3-5 minutes) ☕

✅ **Done!** Backend now accepts requests from your frontend

---

## 🧪 Step 6: Test Everything (10 minutes)

### 6.1 Create Admin Account
1. Visit your Vercel URL
2. Click "Register" or use existing account
3. Login

### 6.2 Test Categories
- ✅ Create a category
- ✅ Edit it
- ✅ Deactivate it

### 6.3 Test Menu Items
- ✅ Create a menu item
- ✅ Set price, description
- ✅ **Upload a photo** (most important!)
- ✅ Photo should appear immediately
- ✅ Edit the item
- ✅ Upload another photo
- ✅ Set primary photo
- ✅ Delete a photo
- ✅ Delete the item

### 6.4 Test Modifiers
- ✅ Create modifier group
- ✅ Add options
- ✅ Attach to menu item

### 6.5 Verify in Supabase
1. Go to Supabase → **Storage** → `menu-photos`
2. Open `menu-items` folder
3. You should see uploaded images!
4. Click an image → Copy URL → Open in browser
5. Image should load ✅

---

## 🎉 YOU'RE LIVE!

**Your live URLs**:
- 🎨 **Frontend**: `https://your-app.vercel.app`
- 🖥️ **Backend**: `https://menu-management-backend.onrender.com`
- 🗄️ **Database**: Supabase PostgreSQL
- 📸 **Photos**: Supabase Storage

---

## 📋 Submit These URLs

```
Student Name: [Your Name]
Assignment: GA04 - Menu Management System

Frontend (Admin Dashboard): https://your-app.vercel.app
Backend API: https://menu-management-backend.onrender.com
GitHub Repository: https://github.com/TNhanTis/GA04-Menu-Management

Admin Login:
Email: your-email@example.com
Password: [your-password]

Notes: 
- All features working
- Photos stored in Supabase Storage
- Auto-deploys on git push
```

---

## ⚠️ TROUBLESHOOTING

### Backend won't start
→ Check Render **Logs** tab
→ Verify `DATABASE_URL` is correct
→ Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

### Frontend can't connect
→ Check Vercel **Environment Variables**
→ Verify `VITE_API_URL` is correct
→ Check browser console for errors

### Photos won't upload
→ Go to Supabase → Storage → `menu-photos`
→ Verify bucket is **PUBLIC**
→ Check storage policies are set
→ Check Render logs for errors

### Need to redeploy?
```bash
git commit --allow-empty -m "Redeploy"
git push
```

---

## 📚 More Help?

- **Detailed guide**: See `COMPLETE_DEPLOYMENT_GUIDE.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Integration details**: See `SUPABASE_INTEGRATION_SUMMARY.md`

---

## ✅ Success Checklist

Before submitting:
- [ ] Backend URL returns API message
- [ ] Frontend loads login page
- [ ] Can create admin account
- [ ] Can CRUD categories
- [ ] Can CRUD menu items
- [ ] **Photos upload and display**
- [ ] Can set primary photo
- [ ] Can delete photos
- [ ] Can CRUD modifiers
- [ ] Search works
- [ ] Filters and sorting work
- [ ] Images visible in Supabase Storage

---

**🚀 Ready to get 10/10? Deploy now!**
