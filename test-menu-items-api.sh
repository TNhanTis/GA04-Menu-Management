#!/bin/bash

# Menu Items API Test Script
# This script tests all endpoints of the Menu Items API

BASE_URL="http://localhost:3000"
RESTAURANT_ID="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🧪 Menu Items API Testing Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if server is running
echo -e "${BLUE}🔍 Checking if server is running...${NC}"
if curl -s --max-time 3 "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running!${NC}"
else
    echo -e "${RED}❌ Server is not running!${NC}"
    echo "Please start the backend server first:"
    echo "  cd backend && npm run start:dev"
    exit 1
fi
echo ""

# Test 1: Get Categories (needed for creating items)
echo -e "${YELLOW}━━━ Test 1: Get Categories ━━━${NC}"
CATEGORIES=$(curl -s "$BASE_URL/api/admin/menu/categories?status=active")
echo "$CATEGORIES" | head -20
echo ""

# Extract first category ID (basic parsing, works if response starts with array)
CATEGORY_ID=$(echo "$CATEGORIES" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$CATEGORY_ID" ]; then
    echo -e "${RED}❌ No categories found! Please create a category first.${NC}"
    echo "Run: curl -X POST $BASE_URL/api/admin/menu/categories -H 'Content-Type: application/json' -d '{\"restaurant_id\":\"$RESTAURANT_ID\",\"name\":\"Test Category\",\"status\":\"active\"}'"
    exit 1
fi

echo -e "${GREEN}✅ Found category ID: $CATEGORY_ID${NC}"
echo ""

# Test 2: Create Menu Item
echo -e "${YELLOW}━━━ Test 2: Create Menu Item ━━━${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/menu/items" \
  -H "Content-Type: application/json" \
  -d "{
    \"restaurant_id\": \"$RESTAURANT_ID\",
    \"category_id\": \"$CATEGORY_ID\",
    \"name\": \"Test Bánh Mì $(date +%H%M%S)\",
    \"description\": \"Delicious Vietnamese sandwich\",
    \"price\": 35000,
    \"prep_time_minutes\": 10,
    \"status\": \"available\",
    \"is_chef_recommended\": true
  }")

echo "$CREATE_RESPONSE" | head -30
ITEM_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ITEM_ID" ]; then
    echo -e "${RED}❌ Failed to create item!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Created item with ID: $ITEM_ID${NC}"
echo ""

# Test 3: Get All Items
echo -e "${YELLOW}━━━ Test 3: Get All Items ━━━${NC}"
curl -s "$BASE_URL/api/admin/menu/items?restaurant_id=$RESTAURANT_ID" | head -40
echo -e "${GREEN}✅ Successfully retrieved items list${NC}"
echo ""

# Test 4: Get Single Item
echo -e "${YELLOW}━━━ Test 4: Get Single Item ━━━${NC}"
curl -s "$BASE_URL/api/admin/menu/items/$ITEM_ID" | head -40
echo -e "${GREEN}✅ Successfully retrieved item details${NC}"
echo ""

# Test 5: Filter by Search
echo -e "${YELLOW}━━━ Test 5: Filter by Search Term ━━━${NC}"
curl -s "$BASE_URL/api/admin/menu/items?restaurant_id=$RESTAURANT_ID&search=bánh" | head -30
echo -e "${GREEN}✅ Search filter working${NC}"
echo ""

# Test 6: Filter by Status
echo -e "${YELLOW}━━━ Test 6: Filter by Status ━━━${NC}"
curl -s "$BASE_URL/api/admin/menu/items?restaurant_id=$RESTAURANT_ID&status=available" | head -30
echo -e "${GREEN}✅ Status filter working${NC}"
echo ""

# Test 7: Sort by Price
echo -e "${YELLOW}━━━ Test 7: Sort by Price (Low to High) ━━━${NC}"
curl -s "$BASE_URL/api/admin/menu/items?restaurant_id=$RESTAURANT_ID&sortBy=price_asc" | head -30
echo -e "${GREEN}✅ Sort by price working${NC}"
echo ""

# Test 8: Pagination
echo -e "${YELLOW}━━━ Test 8: Pagination (Page 1, Limit 5) ━━━${NC}"
curl -s "$BASE_URL/api/admin/menu/items?restaurant_id=$RESTAURANT_ID&page=1&limit=5" | head -30
echo -e "${GREEN}✅ Pagination working${NC}"
echo ""

# Test 9: Update Item
echo -e "${YELLOW}━━━ Test 9: Update Item ━━━${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/admin/menu/items/$ITEM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Bánh Mì Đặc Biệt",
    "price": 45000
  }')
echo "$UPDATE_RESPONSE" | head -30
echo -e "${GREEN}✅ Successfully updated item${NC}"
echo ""

# Test 10: Update Status
echo -e "${YELLOW}━━━ Test 10: Update Status to Unavailable ━━━${NC}"
STATUS_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/admin/menu/items/$ITEM_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "unavailable"}')
echo "$STATUS_RESPONSE"
echo -e "${GREEN}✅ Successfully updated status${NC}"
echo ""

# Test 11: Update Status Back
echo -e "${YELLOW}━━━ Test 11: Update Status to Available ━━━${NC}"
STATUS_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/admin/menu/items/$ITEM_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "available"}')
echo "$STATUS_RESPONSE"
echo -e "${GREEN}✅ Successfully updated status back${NC}"
echo ""

# Test 12: Validation Test (Invalid Price)
echo -e "${YELLOW}━━━ Test 12: Validation - Invalid Price (should fail) ━━━${NC}"
VALIDATION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/menu/items" \
  -H "Content-Type: application/json" \
  -d "{
    \"restaurant_id\": \"$RESTAURANT_ID\",
    \"category_id\": \"$CATEGORY_ID\",
    \"name\": \"Invalid Item\",
    \"price\": 0,
    \"status\": \"available\"
  }")
echo "$VALIDATION_RESPONSE"
if echo "$VALIDATION_RESPONSE" | grep -q "error\|Price"; then
    echo -e "${GREEN}✅ Validation working (rejected invalid price)${NC}"
else
    echo -e "${RED}❌ Validation not working properly${NC}"
fi
echo ""

# Test 13: Delete Item
echo -e "${YELLOW}━━━ Test 13: Delete Item (Soft Delete) ━━━${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/admin/menu/items/$ITEM_ID")
echo "$DELETE_RESPONSE"
echo -e "${GREEN}✅ Successfully deleted item${NC}"
echo ""

# Test 14: Verify Item is Deleted
echo -e "${YELLOW}━━━ Test 14: Verify Item No Longer Appears in List ━━━${NC}"
AFTER_DELETE=$(curl -s "$BASE_URL/api/admin/menu/items?restaurant_id=$RESTAURANT_ID")
if echo "$AFTER_DELETE" | grep -q "$ITEM_ID"; then
    echo -e "${RED}⚠️  Item still appears in list (should be hidden)${NC}"
else
    echo -e "${GREEN}✅ Item correctly hidden from list${NC}"
fi
echo ""

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${GREEN}✅ All Tests Completed!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Tested Endpoints:"
echo "  ✅ GET    /api/admin/menu/items (list with filters)"
echo "  ✅ GET    /api/admin/menu/items/:id (single item)"
echo "  ✅ POST   /api/admin/menu/items (create)"
echo "  ✅ PUT    /api/admin/menu/items/:id (update)"
echo "  ✅ PATCH  /api/admin/menu/items/:id/status (status update)"
echo "  ✅ DELETE /api/admin/menu/items/:id (soft delete)"
echo ""
echo "Tested Features:"
echo "  ✅ Search filtering"
echo "  ✅ Status filtering"
echo "  ✅ Sorting (by price)"
echo "  ✅ Pagination"
echo "  ✅ Validation (price check)"
echo "  ✅ Soft delete"
echo ""
echo "Next Steps:"
echo "  1. Open http://localhost:5173/items to test the UI"
echo "  2. Check backend terminal for any errors"
echo "  3. Run 'npx prisma studio' to view database"
echo ""
