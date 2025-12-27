# 🎯 How to Access Menu Items Management

## ✅ Frontend is Running!

Your frontend should be running at: **http://localhost:5173**

---

## 📍 Available Pages with Navigation Menu

I've added a navigation bar at the top of every page. You can now easily access:

### 1. **Menu Items Management** (Your Main Task)
**URL:** http://localhost:5173/items

Click on **"🍜 Menu Items"** in the navigation bar

**Features:**
- ✅ View all menu items in a table
- ✅ Search by name/description
- ✅ Filter by category, status, chef recommended
- ✅ Sort by name, price, date
- ✅ Create new items (button at top right)
- ✅ Edit items (✏️ button)
- ✅ Delete items (🗑️ button)
- ✅ Quick status change (dropdown in table)
- ✅ Pagination

---

### 2. **Categories Management** (Hải's Work)
**URL:** http://localhost:5173/categories

Click on **"📁 Categories"** in navigation

---

### 3. **Modifiers Management** (Hải's Work)
**URL:** http://localhost:5173/modifiers

Click on **"➕ Modifiers"** in navigation

---

### 4. **Tables Management** (Previous Work)
**URL:** http://localhost:5173/ (home page)

Click on **"🪑 Tables"** in navigation

---

### 5. **Guest Menu** (Nhân's Work)
**URL:** http://localhost:5173/menu?table=xxx&token=xxx

Click on **"📱 Guest Menu"** in navigation

---

## 🚀 Quick Start Steps

### If Frontend is NOT running:

```bash
# Terminal 1: Start Frontend
cd frontend
npm run dev
```

The frontend will start at: http://localhost:5173

### If Backend is NOT running:

```bash
# Terminal 2: Start Backend
cd backend
npm run start:dev
```

The backend will start at: http://localhost:3000

---

## 🎨 What You Should See

### 1. Open http://localhost:5173
You'll see the **Tables Management** page with a **navigation bar at the top**

### 2. Click "🍜 Menu Items" in the navigation
Or directly go to: http://localhost:5173/items

You should see:
- **Header:** "🍽️ Menu Items Management"
- **Button:** "➕ Add New Item" (top right)
- **Filters:** Search box, dropdowns for category/status/chef-recommended/sort
- **Table:** List of menu items with photos, names, prices, etc.
- **Actions:** Edit and Delete buttons for each item

### 3. Test Creating an Item
1. Click **"➕ Add New Item"**
2. Fill the form:
   - Name: "Phở Bò"
   - Category: Select from dropdown
   - Price: 55000
   - Status: Available
3. Click **"Create Item"**
4. Item appears in the table!

---

## 🐛 Troubleshooting

### Issue 1: "Cannot connect to backend"
**Check if backend is running:**
```bash
curl http://localhost:3000
```

If not working, start it:
```bash
cd backend
npx prisma generate
npm run start:dev
```

---

### Issue 2: "No categories in dropdown"
**Create a category first:**

Go to: http://localhost:5173/categories

Or use curl:
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

---

### Issue 3: "Page is blank"
1. Check browser console (F12) for errors
2. Make sure both frontend and backend are running
3. Try refreshing the page (Ctrl+R)

---

### Issue 4: "Navigation bar not showing"
- Clear browser cache (Ctrl+Shift+R)
- The navigation was just added, refresh the page

---

## 📸 Expected View

### Navigation Bar (Top of Every Page):
```
┌────────────────────────────────────────────────────────────┐
│ 🍽️ Smart Restaurant                                         │
│                                                             │
│  [🪑 Tables] [📁 Categories] [🍜 Menu Items] [➕ Modifiers] │
│  [📱 Guest Menu]                                            │
└────────────────────────────────────────────────────────────┘
```

### Menu Items Page:
```
┌────────────────────────────────────────────────────────────┐
│  🍽️ Menu Items Management           [➕ Add New Item]      │
│  Manage your restaurant menu items                         │
├────────────────────────────────────────────────────────────┤
│  🔍 Search... [Category ▼] [Status ▼] [Chef Rec ▼] [Sort ▼]│
├────────────────────────────────────────────────────────────┤
│  Photo | Name | Category | Price | Status | Actions        │
│  ───────────────────────────────────────────────────────── │
│  🍜    | Phở  | Mains   | 55,000| [Available▼] | ✏️ 🗑️   │
│  🍚    | Cơm  | Mains   | 40,000| [Available▼] | ✏️ 🗑️   │
├────────────────────────────────────────────────────────────┤
│              [← Previous]  Page 1 of 2  [Next →]           │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Navigation bar visible at top of page
- [ ] Can click between different pages
- [ ] Menu Items page loads at /items
- [ ] Can see "Add New Item" button
- [ ] Can see filter controls
- [ ] Table shows menu items (or empty state)
- [ ] Can click "Add New Item" - modal opens
- [ ] Can create a new item
- [ ] Can edit an item
- [ ] Can delete an item
- [ ] Can change status from dropdown
- [ ] Filters work correctly

---

## 🎉 You're All Set!

**Main URL:** http://localhost:5173/items

Just click on **"🍜 Menu Items"** in the navigation bar!

If you see any issues, check:
1. Both frontend (5173) and backend (3000) are running
2. Browser console for errors (F12)
3. Backend logs for API errors

---

**Happy Testing! 🚀**
