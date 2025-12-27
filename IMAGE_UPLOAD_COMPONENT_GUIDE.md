# ImageUpload Component - Quick Reference

## 📍 Location
`frontend/src/components/ImageUpload.tsx`

## 🎯 Purpose
Reusable component for uploading and managing menu item photos with drag & drop, preview, and primary photo selection.

## 📦 Props

```typescript
interface ImageUploadProps {
  itemId: string;              // Menu item ID (required)
  photos: Photo[];             // Current photos array
  onPhotosChange: () => void;  // Callback after upload/delete
}

interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
}
```

## 🔌 Usage Example

```tsx
import ImageUpload from "../components/ImageUpload";

function MenuItemForm() {
  const [item, setItem] = useState<MenuItem | null>(null);

  const handlePhotosChange = () => {
    // Reload item data to get updated photos
    loadItemDetails(item.id);
  };

  return (
    <ImageUpload
      itemId={item.id}
      photos={item.photos || []}
      onPhotosChange={handlePhotosChange}
    />
  );
}
```

## ✨ Features

### 1. Upload Methods
- **Drag & Drop**: Drag files into the upload zone
- **Click to Browse**: Click zone to open file picker
- **Multiple Files**: Upload up to 10 images at once

### 2. Validation
- **File Types**: JPG, PNG, WebP only
- **File Size**: Max 5MB per file
- **File Count**: Max 10 files per upload
- **Error Messages**: Clear validation errors

### 3. Photo Management
- **Preview Grid**: Responsive thumbnail grid
- **Primary Badge**: Visual indicator (⭐ Primary)
- **Set Primary**: One-click to set any photo as primary
- **Delete**: Remove photo with confirmation
- **Auto-reload**: Parent component refreshes after changes

### 4. UI States
- **Empty State**: Friendly message when no photos
- **Loading State**: Shows during upload
- **Error State**: Displays validation/API errors
- **Drag Active**: Visual feedback when dragging

## 🎨 Styling

Matches your app's dark theme:
- Background: `#0f172a` (navy)
- Cards: `#1e293b` (slate)
- Border: `#334155` (dark gray)
- Primary: `#6366f1` (indigo)
- Text: `#cbd5e1` (light gray)

## 🔗 Backend Integration

### Endpoints Used
```typescript
// Upload photos
POST /api/admin/menu/items/:itemId/photos
Content-Type: multipart/form-data
Body: FormData with 'photos' field

// Delete photo
DELETE /api/admin/menu/items/:itemId/photos/:photoId

// Set primary photo
PATCH /api/admin/menu/items/:itemId/photos/:photoId/primary
```

## 📋 Validation Rules

```typescript
// File types (MIME types)
const validTypes = ["image/jpeg", "image/png", "image/webp"];

// File size
const maxSize = 5 * 1024 * 1024; // 5MB

// File count
const maxFiles = 10;
```

## 🛠️ Customization

### Change Colors
Modify inline styles in `ImageUpload.tsx`:
- Line 94: Upload zone border
- Line 96: Drag active background
- Line 125: Error background
- Line 180: Primary badge background

### Change Limits
Modify validation:
- Line 54: File size limit
- Line 60: Max file count
- Line 88: Accept attribute (file types)

### Change Grid Layout
Modify line 146:
```tsx
gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"
// Change 150px to adjust thumbnail size
```

## 🐛 Troubleshooting

### Photos not showing
- Check `API_BASE_URL` environment variable
- Verify backend `/uploads` folder exists
- Check photo.url starts with `/uploads/`

### Upload fails
- Check backend file size limit (5MB)
- Verify MIME type validation in backend
- Check network tab for API errors

### Primary badge not updating
- Ensure `onPhotosChange` callback is implemented
- Check parent component reloads data
- Verify API returns updated photos

## 🔐 Security Features

1. **Client-side validation**: File type and size
2. **Server-side validation**: MIME type, extension, size
3. **UUID naming**: Prevents file name conflicts
4. **Safe paths**: No path traversal possible
5. **Multipart parsing**: Multer with limits

## 📱 Responsive Design

- **Desktop**: 4-5 columns grid
- **Tablet**: 3 columns grid
- **Mobile**: 2 columns grid
- Auto-adapts with `auto-fill` and `minmax()`

## 🎯 Best Practices

1. **Always provide onPhotosChange**: Parent must reload data
2. **Handle loading state**: Show feedback during upload
3. **Validate on client**: Quick feedback before API call
4. **Confirm delete**: Prevent accidental deletion
5. **Show primary clearly**: Visual indicator helps UX

## 📚 Related Files

- Component: `frontend/src/components/ImageUpload.tsx`
- Usage: `frontend/src/pages/MenuItemsManagement.tsx` (line 1268)
- Backend API: `backend/src/menu-photos/menu-photos.controller.ts`
- Backend Service: `backend/src/menu-photos/menu-photos.service.ts`

## 🚀 Future Enhancements

Potential improvements:
- Image cropping before upload
- Drag to reorder photos
- Bulk actions (delete multiple)
- Image compression
- Progress bar per file
- Preview modal (lightbox)
- Lazy loading for many photos

---

**Created:** December 27, 2025  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

