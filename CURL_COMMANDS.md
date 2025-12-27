# 📋 Copy-Paste cURL Commands

## Prerequisites
1. Backend server running on http://localhost:3000
2. Have a valid category ID (get from categories API)

---

## 🔍 Step 1: Get Categories (Get a Category ID first)

```bash
curl http://localhost:3000/api/admin/menu/categories?status=active
```

**Copy one of the `"id"` values from the response!**

---

## ➕ Step 2: Create a Menu Item

**Replace `<CATEGORY_ID>` with actual ID from Step 1!**

```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Phở Bò Đặc Biệt",
    "description": "Special Vietnamese beef noodle soup with fresh herbs",
    "price": 55000,
    "prep_time_minutes": 15,
    "status": "available",
    "is_chef_recommended": true
  }'
```

**Copy the `"id"` from the response for next steps!**

---

## 📋 Step 3: Get All Menu Items

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
```

---

## 🔎 Step 4: Search Items by Name

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&search=phở"
```

---

## 🏷️ Step 5: Filter by Status

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&status=available"
```

---

## 📁 Step 6: Filter by Category

**Replace `<CATEGORY_ID>` with your category ID!**

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&category_id=<CATEGORY_ID>"
```

---

## ⭐ Step 7: Get Chef Recommended Only

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&is_chef_recommended=true"
```

---

## 🔽 Step 8: Sort by Price (Low to High)

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&sortBy=price_asc"
```

---

## 🔼 Step 9: Sort by Price (High to Low)

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&sortBy=price_desc"
```

---

## 🔤 Step 10: Sort by Name (A-Z)

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&sortBy=name_asc"
```

---

## 📄 Step 11: Pagination (Page 1, 5 items per page)

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&page=1&limit=5"
```

---

## 🎯 Step 12: Combined Filters

Search + Status + Sort + Pagination:

```bash
curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11&search=phở&status=available&sortBy=price_asc&page=1&limit=10"
```

---

## 👁️ Step 13: Get Single Item Details

**Replace `<ITEM_ID>` with actual item ID!**

```bash
curl http://localhost:3000/api/admin/menu/items/<ITEM_ID>
```

---

## ✏️ Step 14: Update an Item

**Replace `<ITEM_ID>` with actual item ID!**

```bash
curl -X PUT http://localhost:3000/api/admin/menu/items/<ITEM_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phở Bò Tái Đặc Biệt",
    "description": "Special beef noodle soup with rare beef",
    "price": 65000,
    "is_chef_recommended": false
  }'
```

---

## 🚦 Step 15: Update Status to Unavailable

**Replace `<ITEM_ID>` with actual item ID!**

```bash
curl -X PATCH http://localhost:3000/api/admin/menu/items/<ITEM_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "unavailable"}'
```

---

## ✅ Step 16: Update Status to Available

**Replace `<ITEM_ID>` with actual item ID!**

```bash
curl -X PATCH http://localhost:3000/api/admin/menu/items/<ITEM_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "available"}'
```

---

## 🔴 Step 17: Update Status to Sold Out

**Replace `<ITEM_ID>` with actual item ID!**

```bash
curl -X PATCH http://localhost:3000/api/admin/menu/items/<ITEM_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "sold_out"}'
```

---

## 🗑️ Step 18: Delete Item (Soft Delete)

**Replace `<ITEM_ID>` with actual item ID!**

```bash
curl -X DELETE http://localhost:3000/api/admin/menu/items/<ITEM_ID>
```

---

## ❌ Validation Test 1: Create with Invalid Price (should fail)

```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Invalid Item",
    "price": 0,
    "status": "available"
  }'
```

**Expected:** Error message about price must be > 0

---

## ❌ Validation Test 2: Create with Short Name (should fail)

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

**Expected:** Error message about name length (2-80 characters)

---

## ❌ Validation Test 3: Create with Invalid Status (should fail)

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

**Expected:** Error message about invalid status value

---

## ❌ Validation Test 4: Create with Excessive Prep Time (should fail)

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

**Expected:** Error message about prep time (max 240 minutes)

---

## 🎨 Bonus: Create Item with Modifier Groups

First get modifier groups:

```bash
curl http://localhost:3000/api/admin/menu/modifier-groups?status=active
```

Then create item with modifiers (replace IDs):

```bash
curl -X POST http://localhost:3000/api/admin/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "category_id": "<CATEGORY_ID>",
    "name": "Cà Phê Sữa Đá",
    "description": "Vietnamese iced coffee with condensed milk",
    "price": 25000,
    "prep_time_minutes": 5,
    "status": "available",
    "is_chef_recommended": true,
    "modifier_group_ids": ["<MODIFIER_GROUP_ID_1>", "<MODIFIER_GROUP_ID_2>"]
  }'
```

---

## 🎯 Quick Copy-Paste Workflow

1. **Get category ID:**
   ```bash
   curl http://localhost:3000/api/admin/menu/categories?status=active
   ```

2. **Create item (replace CATEGORY_ID):**
   ```bash
   curl -X POST http://localhost:3000/api/admin/menu/items -H "Content-Type: application/json" -d '{"restaurant_id":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","category_id":"CATEGORY_ID","name":"Test Item","price":50000,"status":"available"}'
   ```

3. **Get all items:**
   ```bash
   curl "http://localhost:3000/api/admin/menu/items?restaurant_id=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
   ```

4. **Update item (replace ITEM_ID):**
   ```bash
   curl -X PUT http://localhost:3000/api/admin/menu/items/ITEM_ID -H "Content-Type: application/json" -d '{"price":60000}'
   ```

5. **Delete item (replace ITEM_ID):**
   ```bash
   curl -X DELETE http://localhost:3000/api/admin/menu/items/ITEM_ID
   ```

---

**💡 Tip:** Use `| jq` at the end of curl commands for pretty JSON output:
```bash
curl http://localhost:3000/api/admin/menu/items/<ITEM_ID> | jq
```

(Install jq: `sudo apt install jq` on Ubuntu/Debian)
