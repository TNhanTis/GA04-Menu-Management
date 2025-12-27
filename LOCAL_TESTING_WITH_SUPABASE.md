# 🧪 Local Testing with Supabase

This guide helps you test Supabase Storage integration locally before deployment.

## Step 1: Get Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **service_role** key (secret key)

## Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase
2. Create bucket named: `menu-photos`
3. Make it **PUBLIC** ✅
4. Set file size limit: **5 MB**
5. Add storage policies (see COMPLETE_DEPLOYMENT_GUIDE.md section 1.4)

## Step 3: Update Local Environment

Create/update `backend/.env` file:

```env
# Database
DATABASE_URL="your-supabase-database-url"

# JWT
JWT_SECRET="your-secret-key-for-development"

# Frontend
FRONTEND_URL="http://localhost:5173"

# Supabase Storage
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGc..."

# Server
PORT=3000
NODE_ENV=development
```

## Step 4: Test Locally

### Start Backend:
```bash
cd backend
npm run start:dev
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

### Test Photo Upload:
1. Open http://localhost:5173
2. Login to admin
3. Go to Menu Items
4. Create/edit an item
5. Upload a photo
6. Photo should appear immediately
7. Check Supabase Storage - file should be there

## Step 5: Verify Supabase Storage

1. Go to Supabase → **Storage** → `menu-photos`
2. Navigate to `menu-items/` folder
3. You should see uploaded images with UUID filenames
4. Click an image → Copy public URL
5. Paste URL in browser → Image should load

## 🐛 Troubleshooting

### Error: "Failed to upload file"
- Check SUPABASE_URL is correct
- Check SUPABASE_SERVICE_KEY is the **service_role** key (not anon key)
- Verify bucket name is exactly `menu-photos`

### Error: "Storage bucket not found"
- Create the bucket in Supabase
- Ensure bucket name matches `SUPABASE_BUCKET` in code

### Error: "Access denied"
- Make sure bucket is PUBLIC
- Check storage policies are set correctly
- Try using service_role key instead of anon key

### Images upload but don't display
- Check public URL format
- Verify bucket is PUBLIC
- Check browser console for CORS errors

## ✅ Success Indicators

When everything works correctly:

1. ✅ Upload shows progress
2. ✅ Image appears in UI immediately
3. ✅ Image shows ⭐ badge if primary
4. ✅ Image URL starts with `https://xxxxx.supabase.co/storage/v1/object/public/menu-photos/`
5. ✅ Delete removes image from UI and Supabase
6. ✅ Set primary updates the star badge

## 🔄 Switch Back to Local Storage (Optional)

If you want to test local storage instead:

1. Restore original `menu-photos.controller.ts` (diskStorage)
2. Restore original `menu-photos.service.ts` (file system)
3. Restore `main.ts` (static assets)
4. Remove SUPABASE env variables

But **for deployment**, you MUST use Supabase Storage!

## 📝 Notes

- Local development with Supabase is identical to production
- Same code works in both environments
- No need to switch between local/remote storage
- All images stored in cloud (even during development)

---

**Ready to deploy?** Follow `COMPLETE_DEPLOYMENT_GUIDE.md` 🚀
