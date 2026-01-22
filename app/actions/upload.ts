"use server";

import { put, del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { ActionResult } from "@/lib/types";

export async function uploadImage(
  formData: FormData
): Promise<ActionResult & { url?: string }> {
  try {
    await requireAdmin();

    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        message: "File must be an image",
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: "File size must be less than 5MB",
      };
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      success: true,
      message: "Image uploaded successfully",
      url: blob.url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

export async function deleteImage(url: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!url) {
      return {
        success: false,
        message: "No URL provided",
      };
    }

    // Delete from Vercel Blob
    await del(url);

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}
