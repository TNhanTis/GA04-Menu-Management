# 🚀 Quick Deployment Checklist

Use this checklist to ensure everything is deployed correctly.

## ✅ Pre-Deployment

- [ ] Code is committed to GitHub
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database schema is finalized

## 1️⃣ Supabase Setup (15 minutes)

- [ ] Create Supabase project
- [ ] Copy Database URL (with password)
- [ ] Create `menu-photos` bucket (PUBLIC)
- [ ] Setup storage policies (read, insert, delete)
- [ ] Copy Project URL
- [ ] Copy service_role key
- [ ] Copy anon public key

**Credentials to save:**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:PASSWORD@...
```

## 2️⃣ Backend Deployment (10 minutes)

- [ ] Create Render Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure build command
- [ ] Configure start command
- [ ] Add environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=3000
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET (generate random)
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_KEY
  - [ ] FRONTEND_URL (use localhost first)
- [ ] Deploy and wait
- [ ] Copy backend URL

**Backend URL:**
```
https://your-backend.onrender.com
```

## 3️⃣ Frontend Deployment (5 minutes)

- [ ] Create Vercel project
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variable:
  - [ ] VITE_API_URL=https://your-backend.onrender.com
- [ ] Deploy and wait
- [ ] Copy frontend URL

**Frontend URL:**
```
https://your-app.vercel.app
```

## 4️⃣ Update Backend (5 minutes)

- [ ] Go back to Render
- [ ] Update FRONTEND_URL with Vercel URL
- [ ] Save changes
- [ ] Wait for redeploy

## 5️⃣ Testing (10 minutes)

- [ ] Visit backend URL - should see API message
- [ ] Visit frontend URL - should see login page
- [ ] Create admin account
- [ ] Test Categories CRUD
- [ ] Test Menu Items CRUD
- [ ] **Test photo upload** - photos should appear
- [ ] Test Modifiers CRUD
- [ ] Test search functionality
- [ ] Test pagination
- [ ] Test filters and sorting

## 6️⃣ Load Sample Data (Optional - 5 minutes)

- [ ] Open Supabase SQL Editor
- [ ] Run `sample-data.sql`
- [ ] Refresh frontend
- [ ] Verify sample data appears

## 🎯 Post-Deployment

- [ ] Change admin password to strong password
- [ ] Save all credentials securely
- [ ] Test on mobile device
- [ ] Test photo upload/delete
- [ ] Verify all grading criteria
- [ ] Submit URLs to instructor

## 📋 URLs to Submit

```
Frontend Admin Dashboard: https://your-app.vercel.app
Backend API: https://your-backend.onrender.com
GitHub Repository: https://github.com/TNhanTis/GA04-Menu-Management

Admin Login:
Email: admin@example.com
Password: [your-password]
```

## ⚠️ Common Issues

**Backend won't start:**
- Check Render logs
- Verify DATABASE_URL format
- Ensure migrations ran successfully

**Frontend can't connect:**
- Check VITE_API_URL in Vercel
- Check FRONTEND_URL in Render
- Check browser console for CORS errors

**Photos won't upload:**
- Verify Supabase bucket is PUBLIC
- Check storage policies are set
- Verify SUPABASE_SERVICE_KEY in Render
- Check Render logs for errors

**Database connection fails:**
- Double-check DATABASE_URL
- Ensure password is correct
- Try connection string from Supabase settings

## 🔄 Redeploy Commands

**Force redeploy frontend:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

**Clear Render cache and redeploy:**
- Render Dashboard → Service → Manual Deploy → Clear Build Cache

## ⏱️ Total Time Estimate

- **First time deployment**: ~45 minutes
- **Subsequent deployments**: ~5 minutes (automatic)

---

**Once complete, your app is LIVE! 🎉**
