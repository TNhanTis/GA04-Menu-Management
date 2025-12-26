# Quick Fix Guide - Prisma Type Errors

## Problem

After adding new Prisma models (MenuCategory, MenuItem, MenuItemPhoto, etc.), TypeScript shows errors like:

```
Property 'menuItem' does not exist on type 'PrismaService'
```

## Solution Steps

### Option 1: Restart VS Code TypeScript Server (Quickest)

1. In VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: "TypeScript: Restart TS Server"
3. Select it and wait a few seconds
4. Errors should disappear

### Option 2: Regenerate Prisma Client (If Option 1 doesn't work)

```bash
cd backend
npx prisma generate
```

### Option 3: Clean Build (Nuclear option)

```bash
cd backend
rm -rf node_modules
rm -rf dist
npm install
npx prisma generate
npm run build
```

## Why This Happens

- Prisma Client generates TypeScript types dynamically based on your schema
- VS Code's TypeScript server caches these types
- When you add new models, the cache needs to be refreshed
- The generated Prisma Client is located in `backend/node_modules/@prisma/client` or `node_modules/@prisma/client` depending on your workspace structure

## Verify It Works

After fixing, these imports should work without errors:

```typescript
// In menu.service.ts
await this.prisma.menuCategory.findMany();
await this.prisma.menuItem.findMany();

// In menu-photos.service.ts
await this.prisma.menuItemPhoto.findMany();
```

## Run the Project

### Backend

```bash
cd backend
npm run start:dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Test the Implementation

1. **Create Menu Data** (using sample migration):

```bash
cd backend
psql -U your_user -d your_db -f prisma/migrations/002_create_menu_tables.sql
```

2. **Test Guest Menu API**:
   Visit: `http://localhost:3000/api/menu?table=TABLE_ID&token=VALID_TOKEN`

3. **Test Photo Upload** (using curl):

```bash
curl -X POST http://localhost:3000/api/admin/menu/items/ITEM_ID/photos \
  -F "photos=@/path/to/image.jpg"
```

## Common Issues

### Issue: "Cannot find module './MenuPhotoUpload.css'"

**Fix**: Make sure the CSS file exists in the same directory as the component:

```
frontend/src/components/
  ├── MenuPhotoUpload.tsx
  └── MenuPhotoUpload.css
```

### Issue: "Property 'env' does not exist on type 'ImportMeta'"

**Fix**: This is a TypeScript warning. The code still works. To fix, add to `vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
```

### Issue: Upload directory doesn't exist

**Fix**: Create it manually:

```bash
mkdir backend/uploads
```

Or it will be created automatically on first upload.

## Files Created/Modified

### Backend

- `backend/prisma/schema.prisma` - Added all menu models
- `backend/prisma/migrations/002_create_menu_tables.sql` - Database migration
- `backend/src/menu/menu.service.ts` - NEW: Guest menu service
- `backend/src/menu/menu.controller.ts` - MODIFIED: Added full menu endpoint
- `backend/src/menu/menu.module.ts` - MODIFIED: Added MenuService
- `backend/src/menu-photos/` - NEW MODULE: Photo upload functionality
- `backend/src/main.ts` - MODIFIED: Added static file serving
- `backend/src/app.module.ts` - MODIFIED: Added MenuPhotosModule
- `backend/uploads/` - NEW: Photo storage directory

### Frontend

- `frontend/src/components/MenuPhotoUpload.tsx` - NEW: Photo upload component
- `frontend/src/components/MenuPhotoUpload.css` - NEW: Component styles
- `frontend/src/pages/Menu.tsx` - MODIFIED: Enhanced guest menu page
- `frontend/src/pages/Menu.css` - MODIFIED: Enhanced styles

See `NHAN_IMPLEMENTATION.md` for complete documentation.
