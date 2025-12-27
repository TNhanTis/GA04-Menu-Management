# 🚀 Quick Start Testing Guide

## Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm run start:dev
```

Wait until you see: **"Application is running on: http://localhost:3000"**

---

## Step 2: Run Automated Tests

Open a **NEW terminal** (keep the backend running) and run:

```bash
./test-menu-items-api.sh
```

This will automatically test all 14 endpoints and show you the results! ✅

---

## Step 3: Manual Testing with Postman/Thunder Client

### Import this collection to test manually:

**Base URL:** `http://localhost:3000`

### 1️⃣ **Create Item**
```
POST /api/admin/menu/items
Content-Type: application/json

Body:
{
  "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "category_id": "GET_FROM_CATEGORIES_API",
  "name": "Phở Bò Đặc Biệt",
  "description": "Special beef noodle soup",
  "price": 55000,
  "prep_time_minutes": 15,
  "status": "available",
  "is_chef_recommended": true
}
```

### 2️⃣ **Get All Items**
```
GET /api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
```

### 3️⃣ **Get Single Item**
```
GET /api/admin/menu/items/{ITEM_ID}
```

### 4️⃣ **Update Item**
```
PUT /api/admin/menu/items/{ITEM_ID}
Content-Type: application/json

Body:
{
  "name": "Updated Name",
  "price": 60000
}
```

### 5️⃣ **Update Status**
```
PATCH /api/admin/menu/items/{ITEM_ID}/status
Content-Type: application/json

Body:
{
  "status": "unavailable"
}
```

### 6️⃣ **Delete Item**
```
DELETE /api/admin/menu/items/{ITEM_ID}
```

---

## Step 4: Test with Frontend UI

1. Start frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

2. Open browser: **http://localhost:5173/items**

3. Test these features:
   - ✅ View items table
   - ✅ Click "Add New Item"
   - ✅ Fill the form and create
   - ✅ Use search box
   - ✅ Try filters (category, status)
   - ✅ Change sort order
   - ✅ Edit an item (click ✏️)
   - ✅ Delete an item (click 🗑️)
   - ✅ Quick status change (dropdown in table)

---

## Step 5: View Database

To see the actual data in database:

```bash
cd backend
npx prisma studio
```

Opens **http://localhost:5555** - A visual database browser!

Navigate to `menu_items` table to see all your items.

---

## 🎯 Expected Results

### Create Item Response:
```json
{
  "id": "uuid-here",
  "name": "Phở Bò Đặc Biệt",
  "price": 55000,
  "status": "available",
  "category": {
    "id": "...",
    "name": "Main Courses"
  },
  "photos": [],
  "modifierGroups": []
}
```

### Get All Items Response:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Phở Bò Đặc Biệt",
      "price": 55000,
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

---

## 🐛 Troubleshooting

### Problem: Server not starting
**Solution:**
```bash
cd backend
npx prisma generate
npm install
npm run start:dev
```

### Problem: "Category not found"
**Solution:** Create a category first:
```bash
curl -X POST http://localhost:3000/api/admin/menu/categories \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "name": "Main Courses",
    "description": "Our signature dishes",
    "status": "active"
  }'
```

### Problem: Validation errors
Check these requirements:
- ✅ Name: 2-80 characters
- ✅ Price: Must be > 0
- ✅ Status: Must be "available", "unavailable", or "sold_out"
- ✅ Category ID: Must exist and be active

---

## 📝 Quick Test Checklist

- [ ] Server starts without errors
- [ ] Can create item with valid data
- [ ] Can't create item with price = 0 (validation works)
- [ ] Can get list of all items
- [ ] Can search items by name
- [ ] Can filter by category
- [ ] Can filter by status
- [ ] Can sort by price/name/date
- [ ] Pagination works (page=2)
- [ ] Can get single item details
- [ ] Can update item
- [ ] Can update status (PATCH endpoint)
- [ ] Can delete item
- [ ] Deleted item doesn't appear in list

---

**All tests passing? Congratulations! 🎉 Your API is working perfectly!**
