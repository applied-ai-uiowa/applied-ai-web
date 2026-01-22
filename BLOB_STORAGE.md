# Vercel Blob Storage Integration

## Overview

Board member photos are now stored using Vercel Blob Storage instead of external URLs. This provides:

- ✅ Automatic CDN distribution
- ✅ Optimized image delivery
- ✅ No external dependencies
- ✅ Easy management through Vercel Dashboard

## What Was Added

### 1. Dependencies

- `@vercel/blob` - Vercel Blob Storage SDK

### 2. Server Actions (`app/actions/upload.ts`)

- `uploadImage()` - Uploads images to Blob storage with validation
  - Max file size: 5MB
  - Only accepts image files
  - Adds random suffix to prevent collisions
  - Returns public URL
- `deleteImage()` - Deletes images from Blob storage (optional cleanup)

### 3. Image Upload Component (`app/admin/components/ImageUpload.tsx`)

- Client-side image upload with preview
- Drag-and-drop support
- Shows upload progress
- Displays current/uploaded image
- Error handling

### 4. Updated Board Members Form

The `BoardMembersList` component now uses the `ImageUpload` component instead of a text input for photo URLs.

## Environment Variables

Your `.env.local` already has the Blob token:

```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

This was auto-added when you created the Blob store in Vercel.

## Usage

### Adding a Board Member with Photo

1. Go to Admin Dashboard → Board Members
2. Click "Add Board Member"
3. Fill in the form fields
4. Click "Choose Image" to upload a photo
5. Select an image file (JPG, PNG, etc.)
6. The image uploads automatically and shows a preview
7. Complete the rest of the form
8. Click "Create Board Member"

### Image Requirements

- **Format**: Any common image format (JPG, PNG, WebP, etc.)
- **Max Size**: 5MB
- **Recommended**: Square images work best (e.g., 400x400px)

## How It Works

```
User selects image
    ↓
ImageUpload component
    ↓
uploadImage() Server Action
    ↓
Vercel Blob Storage
    ↓
Returns public URL (https://xxx.public.blob.vercel-storage.com/...)
    ↓
URL saved to database
    ↓
Image displayed on site
```

## Vercel Dashboard

You can view/manage uploaded images at:
https://vercel.com/YOUR_TEAM/YOUR_PROJECT/stores/blob

From there you can:

- View all uploaded files
- Delete old/unused files
- Monitor storage usage
- See bandwidth usage

## Storage Limits

Vercel Blob free tier includes:

- **Storage**: 1 GB
- **Bandwidth**: 100 GB/month

If you exceed these limits, you can upgrade or implement image cleanup.

## Optional: Automatic Cleanup

If you want to automatically delete old images when board members are removed, you can update the `deleteBoardMember` action:

```typescript
// In app/actions/board.ts
import { deleteImage } from "./upload";

export async function deleteBoardMember(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    // Get the member to find their photo URL
    const [member] = await db
      .select()
      .from(boardMembers)
      .where(eq(boardMembers.id, id))
      .limit(1);

    // Delete from database
    await db.delete(boardMembers).where(eq(boardMembers.id, id));

    // Optionally delete the image from Blob storage
    if (member?.photoUrl) {
      await deleteImage(member.photoUrl);
    }

    revalidatePath("/board");
    revalidatePath("/admin");

    return { success: true, message: "Board member deleted successfully" };
  } catch (error) {
    // ... error handling
  }
}
```

## Testing

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/admin (after adding Clerk keys)

3. Test uploading an image:
   - Click "Add Board Member"
   - Upload a photo
   - Verify the preview shows
   - Submit the form
   - Check the Board page to see the image displayed

## Troubleshooting

### "Missing BLOB_READ_WRITE_TOKEN"

- Make sure `.env.local` has the `BLOB_READ_WRITE_TOKEN`
- Run `vercel env pull` to sync environment variables

### "Failed to upload image"

- Check file size (must be < 5MB)
- Ensure file is an image type
- Check network connection

### Images not displaying

- Verify the URL starts with `https://` and ends with image extension
- Check browser console for CORS errors
- Ensure Blob store is public (default)

## Alternative: Using URLs

If you prefer, users can still manually enter image URLs instead of uploading. The form accepts both:

- Uploaded images (via ImageUpload component)
- External URLs (via text input)

To switch back to URL input, replace the `<ImageUpload>` component in `BoardMembersList.tsx` with the original text input.
