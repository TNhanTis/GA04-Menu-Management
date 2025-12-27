# 🎯 Complete Testing Instructions for Menu Items API

## 📚 Available Testing Resources

I've created 4 documents to help you test:

1. **`QUICK_TEST_GUIDE.md`** - Start here! Simple step-by-step guide
2. **`API_TESTING_GUIDE.md`** - Comprehensive documentation with all details
3. **`CURL_COMMANDS.md`** - Ready-to-copy curl commands for every endpoint
4. **`test-menu-items-api.sh`** - Automated test script (runs all tests)

---

## 🚀 Fastest Way to Test (3 Methods)

### Method 1: Automated Script (Recommended) ⚡

```bash
# Terminal 1: Start backend
cd backend
npm run start:dev

# Terminal 2: Run automated tests
./test-menu-items-api.sh
```

This will test all 14 endpoints automatically! ✅

---

### Method 2: Manual cURL Testing 🖥️

Follow the commands in `CURL_COMMANDS.md`:

```bash
# 1. Get categories
curl http://localhost:3000/api/admin/menu/categories?status=active

# 2. Create item (replace <CATEGORY_ID>)
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Phở Bò",
    "price": 55000,
    "status": "available"
  }'

# 3. Get all items
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

# ... see CURL_COMMANDS.md for all 18+ commands
```

---

### Method 3: Frontend UI Testing 🎨

```bash
# Terminal 1: Backend (if not running)
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

Then open: **http://localhost:5173/items**

Test these features:
- ✅ View items in table
- ✅ Search by name
- ✅ Filter by category/status
- ✅ Sort by price/name/date
- ✅ Create new item
- ✅ Edit existing item
- ✅ Quick status change
- ✅ Delete item
- ✅ Pagination

---

## 📋 What Gets Tested

### ✅ CRUD Operations
- [x] Create item
- [x] Read all items
- [x] Read single item
- [x] Update item
- [x] Delete item (soft delete)

### ✅ Filtering
- [x] Search by name/description
- [x] Filter by category
- [x] Filter by status
- [x] Filter by chef recommended

### ✅ Sorting
- [x] Sort by name (A-Z, Z-A)
- [x] Sort by price (low-high, high-low)
- [x] Sort by date (newest, oldest)

### ✅ Pagination
- [x] Page number
- [x] Items per page
- [x] Total count
- [x] Total pages

### ✅ Validation
- [x] Name length (2-80 chars)
- [x] Price > 0
- [x] Status values (available/unavailable/sold_out)
- [x] Prep time (0-240 minutes)
- [x] Category exists and is active
- [x] Invalid data rejected

### ✅ Special Features
- [x] Quick status update (PATCH endpoint)
- [x] Soft delete (is_deleted flag)
- [x] Modifier groups attachment
- [x] Photo display
- [x] Category relationship

---

## 🎯 Testing Checklist

Copy this and check off as you test:

```
Backend API Testing:
[ ] Server starts successfully
[ ] Can get categories list
[ ] Can create item with valid data
[ ] Validation errors work (price=0 rejected)
[ ] Validation errors work (name too short)
[ ] Validation errors work (invalid status)
[ ] Can get all items
[ ] Can search items by name
[ ] Can filter by category
[ ] Can filter by status
[ ] Can filter by chef recommended
[ ] Can sort by price ascending
[ ] Can sort by name descending
[ ] Pagination works (page 2)
[ ] Can get single item details
[ ] Can update item
[ ] Can quick-update status (PATCH)
[ ] Can soft delete item
[ ] Deleted item hidden from list

Frontend UI Testing:
[ ] Items table displays correctly
[ ] Search box filters items
[ ] Category filter works
[ ] Status filter works
[ ] Chef recommended filter works
[ ] Sort dropdown works
[ ] Pagination buttons work
[ ] Create modal opens
[ ] Can create new item via form
[ ] Form validation works
[ ] Edit modal opens with data
[ ] Can update item via form
[ ] Status dropdown in table works
[ ] Delete confirmation appears
[ ] Can delete item
[ ] Table updates after operations

Integration Testing:
[ ] Backend + Frontend communicate
[ ] Creates from UI appear in database
[ ] Updates from UI persist
[ ] Deletes from UI work
[ ] Filters reflect backend logic
[ ] Validation messages show in UI
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module '@prisma/client'"
```bash
cd backend
npx prisma generate
```

### Issue 2: "Category not found"
**Create a category first:**
```bash
curl -X POST http://localhost:3000/api/admin/menu/categories \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "name": "Main Courses",
    "status": "active"
  }'
```

### Issue 3: Port 3000 already in use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or change port in backend/.env
PORT=3001
```

### Issue 4: Frontend can't connect to backend
**Check CORS settings in `backend/src/main.ts`:**
```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

### Issue 5: Validation not working
**Make sure ValidationPipe is enabled in `main.ts`:**
```typescript
app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true,
}));
```

---

## 📊 Expected Test Results

### ✅ Successful Create Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Phở Bò Đặc Biệt",
  "price": 55000,
  "prepTimeMinutes": 15,
  "status": "available",
  "isChefRecommended": true,
  "category": {
    "id": "...",
    "name": "Main Courses"
  },
  "photos": [],
  "modifierGroups": []
}
```

### ✅ Successful List Response:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Phở Bò Đặc Biệt",
      "price": 55000,
      "status": "available",
      "category": { "id": "...", "name": "Main Courses" },
      "primaryPhoto": null,
      "modifierGroupsCount": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### ❌ Validation Error Response:
```json
{
  "statusCode": 400,
  "message": [
    "Price must be greater than 0"
  ],
  "error": "Bad Request"
}
```

---

## 🎓 Next Steps After Testing

1. **If all tests pass:**
   - ✅ Merge your feature branch
   - ✅ Update team on completed features
   - ✅ Move to next task (photos upload by Nhân)

2. **If tests fail:**
   - Check backend terminal for errors
   - Review validation messages
   - Check database with `npx prisma studio`
   - Review the implementation files

3. **Optional improvements:**
   - Add more Vietnamese sample items
   - Test with real images (Nhân's work)
   - Test modifier groups integration (Hải's work)
   - Add authentication (future)

---

## 📞 Need Help?

1. **Check backend logs:** Look at the terminal running `npm run start:dev`
2. **Check database:** Run `npx prisma studio` to view data
3. **Check network:** Use browser DevTools Network tab
4. **Review code:** Check the files in `backend/src/menu-items/`

---

## 🎉 Success Criteria

Your implementation is complete when:
- ✅ All 14 automated tests pass
- ✅ All manual tests pass
- ✅ Frontend UI works smoothly
- ✅ Validation catches invalid data
- ✅ Database shows correct data
- ✅ No errors in terminal
- ✅ Team members can use your API

---

**Ready to test? Start with the automated script:**

```bash
./test-menu-items-api.sh
```

**Good luck! 🚀**
