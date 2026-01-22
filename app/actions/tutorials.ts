"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { tutorials } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function createTutorial(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const category = formData.get("category") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!title || !url || !category) {
      return {
        success: false,
        message: "Title, URL, and category are required",
      };
    }

    await db.insert(tutorials).values({
      title,
      description: description || null,
      url,
      category,
      sortOrder,
    });

    revalidatePath("/tutorials");
    revalidatePath("/admin");

    return { success: true, message: "Tutorial created successfully" };
  } catch (error) {
    console.error("Error creating tutorial:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create tutorial",
    };
  }
}

export async function updateTutorial(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const category = formData.get("category") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!title || !url || !category) {
      return {
        success: false,
        message: "Title, URL, and category are required",
      };
    }

    await db
      .update(tutorials)
      .set({ title, description: description || null, url, category, sortOrder })
      .where(eq(tutorials.id, id));

    revalidatePath("/tutorials");
    revalidatePath("/admin");

    return { success: true, message: "Tutorial updated successfully" };
  } catch (error) {
    console.error("Error updating tutorial:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update tutorial",
    };
  }
}

export async function deleteTutorial(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    await db.delete(tutorials).where(eq(tutorials.id, id));

    revalidatePath("/tutorials");
    revalidatePath("/admin");

    return { success: true, message: "Tutorial deleted successfully" };
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete tutorial",
    };
  }
}

export async function reorderTutorials(
  orderedIds: number[]
): Promise<ActionResult> {
  try {
    await requireAdmin();

    // Update sort order for each tutorial
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(tutorials)
        .set({ sortOrder: i })
        .where(eq(tutorials.id, orderedIds[i]));
    }

    revalidatePath("/tutorials");
    revalidatePath("/admin");

    return { success: true, message: "Tutorials reordered successfully" };
  } catch (error) {
    console.error("Error reordering tutorials:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reorder tutorials",
    };
  }
}
