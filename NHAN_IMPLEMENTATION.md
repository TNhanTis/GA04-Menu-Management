# Menu Management - Nhân's Implementation

## Overview

This implementation covers the **Photos & Guest View** portion of the Menu Management assignment as specified in task.md.

## Features Implemented

### Backend (Node.js + NestJS)

#### 1. Database Schema

- ✅ Created complete Prisma schema for menu management:
  - `MenuCategory` - Menu categories
  - `MenuItem` - Menu items with prices, descriptions, etc.
  - `MenuItemPhoto` - Photos for menu items with primary flag
  - `ModifierGroup` - Modifier groups (size, toppings)
  - `ModifierOption` - Options within modifier groups
  - `MenuItemModifierGroup` - Junction table linking items to modifiers

#### 2. Photo Upload API (`menu-photos` module)

- ✅ **POST** `/api/admin/menu/items/:itemId/photos` - Upload multiple photos
  - Uses `multer` for file handling
  - Validates file types (JPG, PNG, WebP only)
  - Max file size: 5MB per image
  - Generates random UUID filenames for security
  - Stores files in `backend/uploads/` directory
  - Auto-sets first photo as primary

- ✅ **DELETE** `/api/admin/menu/items/:itemId/photos/:photoId` - Delete a photo
  - Removes file from filesystem
  - Deletes DB record
  - Auto-promotes another photo to primary if needed

- ✅ **PATCH** `/api/admin/menu/items/:itemId/photos/:photoId/primary` - Set primary photo
  - Unsets all other photos as primary
  - Sets selected photo as primary

#### 3. Guest Menu API (`menu` module)

- ✅ **GET** `/api/menu` - Public endpoint for guest menu
  - Requires `table` and `token` query params for QR verification
  - Returns full menu data structure:
    - Categories (active only)
    - Menu items (available only, not deleted)
    - Primary photos for each item
    - All photos
    - Modifier groups and options
  - Supports filtering:
    - `categoryId` - Filter by category
    - `search` - Search item names
    - `chefRecommended` - Filter chef recommendations
  - Supports sorting:
    - `sortBy=price_asc` - Sort by price ascending
    - `sortBy=price_desc` - Sort by price descending
    - `sortBy=name` - Sort alphabetically
  - Supports pagination:
    - `page` - Page number
    - `limit` - Items per page

### Frontend (React + TypeScript)

#### 1. MenuPhotoUpload Component

Located: `frontend/src/components/MenuPhotoUpload.tsx`

Features:

- ✅ Drag & drop file upload
- ✅ Click to select files
- ✅ Multiple file upload support
- ✅ Photo preview gallery
- ✅ Set primary photo button
- ✅ Delete photo button
- ✅ Visual indication of primary photo (badge)
- ✅ Upload progress feedback

#### 2. Enhanced Guest Menu Page

Located: `frontend/src/pages/Menu.tsx`

Features:

- ✅ Displays full menu with real data from API
- ✅ Category filtering with button tabs
- ✅ Search functionality
- ✅ Shows primary photo for each item
- ✅ Displays item details:
  - Name, description, price
  - Chef recommendation badge
  - Category tag
  - Preparation time
  - Modifier availability indicator
- ✅ Responsive mobile-first design
- ✅ Modern, attractive UI with:
  - Gradient header
  - Card-based layout
  - Hover effects
  - Error handling
  - Loading states
- ✅ Pagination info in footer

## Installation & Setup

### Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Run database migrations:

```bash
npx prisma migrate dev
# Or manually run the SQL:
psql -U your_user -d your_db -f prisma/migrations/002_create_menu_tables.sql
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

4. Start the server:

```bash
npm run start:dev
```

The backend will run on http://localhost:3000

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

### Testing Photo Upload

1. First, create a menu item using the admin interface (implemented by Bảo)
2. Use the MenuPhotoUpload component in the item edit form
3. Drag and drop images or click to select
4. Images will be uploaded and displayed immediately
5. Click "Set as Primary" to change the main image
6. Click "Delete" to remove an image

### Testing Guest Menu

1. Generate a QR code for a table (existing functionality)
2. Scan the QR code or visit: `http://localhost:5173/menu?table=TABLE_ID&token=TOKEN`
3. The menu will display with:
   - All categories in filter tabs
   - Menu items with photos
   - Search functionality
   - Chef recommendations
   - Modifiers info

### API Testing Examples

**Upload photos:**

```bash
curl -X POST http://localhost:3000/api/admin/menu/items/ITEM_ID/photos \
  -F "photos=@photo1.jpg" \
  -F "photos=@photo2.jpg"
```

**Get guest menu:**

```bash
curl "http://localhost:3000/api/menu?table=TABLE_ID&token=TOKEN&categoryId=CAT_ID"
```

## Security Features

1. **File Upload Security:**
   - File type validation (MIME type checking)
   - File size limits (5MB max)
   - Random UUID filenames (prevents path traversal)
   - Files stored outside web root initially

2. **Guest Menu Security:**
   - QR token verification required
   - Token signature validation (JWT)
   - Table status checking
   - Only active categories/items shown

## Business Rules Implemented

✅ Menu items visible only when:

- Category is Active
- Item status is 'available'
- Item is not deleted

✅ Photo management:

- First uploaded photo auto-set as primary
- Deleting primary photo auto-promotes another
- Only one primary photo per item

✅ Guest menu optimization:

- Efficient queries (no N+1)
- Primary photo loaded first
- Active modifiers only

## File Structure

```
backend/
  src/
    menu/
      menu.controller.ts    # Guest menu endpoint
      menu.service.ts       # Menu business logic
      menu.module.ts
    menu-photos/
      menu-photos.controller.ts  # Photo CRUD endpoints
      menu-photos.service.ts     # Photo business logic
      menu-photos.module.ts
  prisma/
    schema.prisma         # Complete menu schema
    migrations/
      002_create_menu_tables.sql  # Menu tables migration
  uploads/               # Photo storage directory

frontend/
  src/
    components/
      MenuPhotoUpload.tsx    # Photo upload component
      MenuPhotoUpload.css
    pages/
      Menu.tsx              # Enhanced guest menu
      Menu.css
```

## Collaboration Points

This implementation is designed to work with:

- **Hải's work:**
  - Uses MenuCategory model for filtering
  - Uses ModifierGroup/ModifierOption for item customization
  - Compatible with category CRUD operations

- **Bảo's work:**
  - MenuPhotoUpload component can be imported into MenuItem form
  - Uses MenuItem model for photo attachment
  - Guest menu displays items created via admin interface

## Future Enhancements

- [ ] Image compression/resizing using Sharp
- [ ] Cloud storage (S3/Cloudinary) instead of local filesystem
- [ ] Lazy loading for image gallery
- [ ] Image optimization for different screen sizes
- [ ] Batch delete photos
- [ ] Reorder photos (drag & drop)

## Testing

Sample data is included in the migration file for testing:

- 3 categories (Appetizers, Main Courses, Drinks)
- 3 menu items (Phở Bò, Bún Chả, Cơm Tấm)
- Sample photos and modifiers

## Notes

- Restaurant ID is hardcoded as `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11` for testing
- In production, restaurant ID should come from authenticated admin session
- Photo paths are relative (`/uploads/...`) for easy deployment
- All endpoints follow the API structure specified in ASSIGNMENT.md
