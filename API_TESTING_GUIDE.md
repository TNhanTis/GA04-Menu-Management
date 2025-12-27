# Menu Items API Testing Guide

## 📋 Prerequisites

1. **Start Backend Server**
```bash
cd backend
npx prisma generate  # Generate Prisma client (first time only)
npm run start:dev    # Server will run on http://localhost:3000
```

2. **Verify Server is Running**
```bash
curl http://localhost:3000
# Should return: "Hello World!" or similar
```

---

## 🔧 API Endpoints Overview

All Menu Items endpoints are under: `http://localhost:3000/api/admin/menu/items`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/menu/items` | List all items with filters |
| GET | `/api/admin/menu/items/:id` | Get single item details |
| POST | `/api/admin/menu/items` | Create new item |
| PUT | `/api/admin/menu/items/:id` | Update item |
| PATCH | `/api/admin/menu/items/:id/status` | Update item status |
| DELETE | `/api/admin/menu/items/:id` | Delete item (soft delete) |

---

## 🧪 Testing Instructions

### **Step 1: Get List of Categories (from Hải's API)**

First, we need a valid category ID to create items:

```bash
curl http://localhost:3000/api/admin/menu/categories
```

**Expected Response:**
```json
[
  {
    "id": "some-uuid-here",
    "name": "Main Courses",
    "status": "active"
  }
]
```

**📝 Copy a category `id` for the next steps!**

---

### **Step 2: Create a New Menu Item**

Replace `<CATEGORY_ID>` with the actual category ID from Step 1:

```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Bánh Mì Thịt Nướng",
    "description": "Vietnamese grilled pork sandwich with fresh vegetables",
    "price": 35000,
    "prep_time_minutes": 10,
    "status": "available",
    "is_chef_recommended": true
  }'
```

**Expected Response:**
```json
{
  "id": "newly-created-item-id",
  "name": "Bánh Mì Thịt Nướng",
  "price": 35000,
  "status": "available",
  "category": {
    "id": "...",
    "name": "Main Courses"
  },
  "photos": [],
  "modifierGroups": []
}
```

**📝 Copy the item `id` for testing other endpoints!**

---

### **Step 3: Get All Menu Items (No Filters)**

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Bánh Mì Thịt Nướng",
      "price": 35000,
      "status": "available",
      "category": { ... }
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

### **Step 4: Get Items with Filters**

#### Filter by Search Term:
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&search=bánh"
```

#### Filter by Category:
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&category_id=<CATEGORY_ID>"
```

#### Filter by Status:
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&status=available"
```

#### Filter Chef Recommended Only:
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&is_chef_recommended=true"
```

#### Sort by Price (Low to High):
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&sortBy=price_asc"
```

#### Sort by Name (A-Z):
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&sortBy=name_asc"
```

#### Pagination (Page 2, 5 items per page):
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&page=2&limit=5"
```

#### Combined Filters:
```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&search=phở&status=available&sortBy=price_asc&page=1&limit=10"
```

---

### **Step 5: Get Single Item Details**

Replace `<ITEM_ID>` with actual item ID:

```bash
curl http://localhost:3000/api/admin/menu/items/<ITEM_ID>
```

**Expected Response:** Full item details with photos, modifiers, category info

---

### **Step 6: Update an Item**

Replace `<ITEM_ID>` with actual item ID:

```bash
curl -X PUT http://localhost:3000/api/admin/menu/items/<ITEM_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bánh Mì Đặc Biệt",
    "description": "Special Vietnamese sandwich with extra ingredients",
    "price": 45000,
    "is_chef_recommended": false
  }'
```

**Note:** You can update only specific fields (partial update)

---

### **Step 7: Update Item Status (Quick Status Change)**

Replace `<ITEM_ID>` with actual item ID:

#### Set to Unavailable:
```bash
curl -X PATCH http://localhost:3000/api/admin/menu/items/<ITEM_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "unavailable"}'
```

#### Set to Sold Out:
```bash
curl -X PATCH http://localhost:3000/api/admin/menu/items/<ITEM_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "sold_out"}'
```

#### Set back to Available:
```bash
curl -X PATCH http://localhost:3000/api/admin/menu/items/<ITEM_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "available"}'
```

---

### **Step 8: Create Item with Modifier Groups**

First, get modifier groups from Hải's API:

```bash
curl http://localhost:3000/api/admin/menu/modifier-groups
```

Copy some modifier group IDs, then create item:

```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Cà Phê Sữa",
    "description": "Vietnamese iced coffee with condensed milk",
    "price": 25000,
    "prep_time_minutes": 5,
    "status": "available",
    "is_chef_recommended": true,
    "modifier_group_ids": ["<MODIFIER_GROUP_ID_1>", "<MODIFIER_GROUP_ID_2>"]
  }'
```

---

### **Step 9: Delete an Item (Soft Delete)**

Replace `<ITEM_ID>` with actual item ID:

```bash
curl -X DELETE http://localhost:3000/api/admin/menu/items/<ITEM_ID>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Menu item \"Bánh Mì Thịt Nướng\" has been deleted"
}
```

**Note:** Item is soft deleted (is_deleted = true), won't appear in GET requests

---

## ✅ **Validation Testing**

### Test 1: Create with Invalid Data (Price = 0)
```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Test Item",
    "price": 0,
    "status": "available"
  }'
```

**Expected:** 400 Bad Request - "Price must be greater than 0"

---

### Test 2: Create with Short Name (< 2 chars)
```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "X",
    "price": 10000,
    "status": "available"
  }'
```

**Expected:** 400 Bad Request - "Name must be between 2 and 80 characters"

---

### Test 3: Create with Invalid Status
```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Test Item",
    "price": 10000,
    "status": "invalid_status"
  }'
```

**Expected:** 400 Bad Request - "Status must be available, unavailable, or sold_out"

---

### Test 4: Create with Non-existent Category
```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "00000000-0000-0000-0000-000000000000",
    "name": "Test Item",
    "price": 10000,
    "status": "available"
  }'
```

**Expected:** 404 Not Found - "Category with ID ... not found"

---

### Test 5: Create with Prep Time > 240
```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Test Item",
    "price": 10000,
    "prep_time_minutes": 300,
    "status": "available"
  }'
```

**Expected:** 400 Bad Request - "Preparation time cannot exceed 240 minutes"

---

## 🎯 **Quick Test All Endpoints Script**

Save this as `test-menu-items.sh` and run it:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
RESTAURANT_ID="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

echo "🧪 Testing Menu Items API..."
echo ""

# Get categories first
echo "1️⃣ Getting categories..."
CATEGORIES=$(curl -s "$BASE_URL/api/admin/menu/categories")
echo "$CATEGORIES"
echo ""

# Extract first category ID (you may need jq for this)
# CATEGORY_ID=$(echo $CATEGORIES | jq -r '.[0].id')

# For now, use the sample restaurant category ID
echo "2️⃣ Creating new menu item..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/menu/items" \
  -H "Content-Type: application/json" \
  -d "{
    \"restaurant_id\": \"$RESTAURANT_ID\",
    \"category_id\": \"REPLACE_WITH_CATEGORY_ID\",
    \"name\": \"Test Item $(date +%s)\",
    \"description\": \"Test description\",
    \"price\": 50000,
    \"prep_time_minutes\": 15,
    \"status\": \"available\",
    \"is_chef_recommended\": true
  }")
echo "$CREATE_RESPONSE"
echo ""

# Extract item ID (you may need jq)
# ITEM_ID=$(echo $CREATE_RESPONSE | jq -r '.id')

echo "3️⃣ Getting all items..."
curl -s "$BASE_URL/api/admin/menu/items?restaurant_id=$RESTAURANT_ID"
echo ""

echo "4️⃣ Getting single item..."
# curl -s "$BASE_URL/api/admin/menu/items/$ITEM_ID"
echo ""

echo "5️⃣ Updating item..."
# curl -s -X PUT "$BASE_URL/api/admin/menu/items/$ITEM_ID" \
#   -H "Content-Type: application/json" \
#   -d '{"price": 60000}'
echo ""

echo "6️⃣ Updating status..."
# curl -s -X PATCH "$BASE_URL/api/admin/menu/items/$ITEM_ID/status" \
#   -H "Content-Type: application/json" \
#   -d '{"status": "unavailable"}'
echo ""

echo "✅ Testing complete!"
```

---

## 🌐 **Testing with Frontend UI**

1. Start frontend:
```bash
cd frontend
npm run dev
```

2. Navigate to: **http://localhost:5173/items**

3. Test UI features:
   - ✅ View items table
   - ✅ Search items
   - ✅ Filter by category/status
   - ✅ Sort by different fields
   - ✅ Click "Add New Item" button
   - ✅ Fill form and create item
   - ✅ Edit existing item
   - ✅ Change status from dropdown
   - ✅ Delete item

---

## 🐛 **Common Issues & Solutions**

### Issue 1: "Cannot find module '@prisma/client'"
**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue 2: "Category not found"
**Solution:** Get valid category ID first:
```bash
curl http://localhost:3000/api/admin/menu/categories
```

### Issue 3: Server not responding
**Solution:** Check if server is running:
```bash
curl http://localhost:3000
```

### Issue 4: CORS errors in browser
**Solution:** Backend already configured CORS for http://localhost:5173

---

## 📊 **Expected Database State**

After testing, check database:

```bash
cd backend
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all menu_items records
- See relationships with categories
- Check is_deleted flag for soft-deleted items
- View attached modifier groups in menu_item_modifier_groups table

---

## 🎉 **Success Criteria**

You've successfully tested the API when:
- ✅ Can create new items with valid data
- ✅ Validation errors appear for invalid data
- ✅ Can filter/search items
- ✅ Can sort items by different fields
- ✅ Pagination works correctly
- ✅ Can update item details
- ✅ Can quick-change status
- ✅ Can soft delete items
- ✅ Deleted items don't appear in GET requests
- ✅ Can attach modifier groups to items

---

**Need help? Check the terminal output for detailed error messages!**
