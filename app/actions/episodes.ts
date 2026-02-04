"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { episodes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function createEpisode(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const durationMinutes = parseInt(formData.get("durationMinutes") as string);
    const tag = formData.get("tag") as string;
    const spotifyUrl = formData.get("spotifyUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!title || !tag || isNaN(durationMinutes)) {
      return {
        success: false,
        message: "Title, tag, and duration are required",
      };
    }

    const [created] = await db.insert(episodes).values({
      title,
      description: description || null,
      durationMinutes,
      tag,
      spotifyUrl: spotifyUrl || null,
      sortOrder,
    }).returning();

    revalidatePath("/episodes");
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Episode created successfully", data: created };
  } catch (error) {
    console.error("Error creating episode:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create episode",
    };
  }
}

export async function updateEpisode(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const durationMinutes = parseInt(formData.get("durationMinutes") as string);
    const tag = formData.get("tag") as string;
    const spotifyUrl = formData.get("spotifyUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!title || !tag || isNaN(durationMinutes)) {
      return {
        success: false,
        message: "Title, tag, and duration are required",
      };
    }

    await db
      .update(episodes)
      .set({
        title,
        description: description || null,
        durationMinutes,
        tag,
        spotifyUrl: spotifyUrl || null,
        sortOrder,
      })
      .where(eq(episodes.id, id));

    revalidatePath("/episodes");
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Episode updated successfully" };
  } catch (error) {
    console.error("Error updating episode:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update episode",
    };
  }
}

export async function deleteEpisode(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    await db.delete(episodes).where(eq(episodes.id, id));

    revalidatePath("/episodes");
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Episode deleted successfully" };
  } catch (error) {
    console.error("Error deleting episode:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete episode",
    };
  }
}

export async function reorderEpisodes(
  orderedIds: number[]
): Promise<ActionResult> {
  try {
    await requireAdmin();

    // Update sort order for each episode
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(episodes)
        .set({ sortOrder: i })
        .where(eq(episodes.id, orderedIds[i]));
    }

    revalidatePath("/episodes");
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Episodes reordered successfully" };
  } catch (error) {
    console.error("Error reordering episodes:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reorder episodes",
    };
  }
}
