"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { boardMembers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function createBoardMember(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const photoUrl = formData.get("photoUrl") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!name || !role) {
      return {
        success: false,
        message: "Name and role are required",
      };
    }

    const [created] = await db.insert(boardMembers).values({
      name,
      role,
      bio: bio || null,
      photoUrl: photoUrl || null,
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      sortOrder,
      isActive,
    }).returning();

    revalidatePath("/board");
    revalidatePath("/admin");

    return { success: true, message: "Board member created successfully", data: created };
  } catch (error) {
    console.error("Error creating board member:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create board member",
    };
  }
}

export async function updateBoardMember(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const photoUrl = formData.get("photoUrl") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!name || !role) {
      return {
        success: false,
        message: "Name and role are required",
      };
    }

    await db
      .update(boardMembers)
      .set({
        name,
        role,
        bio: bio || null,
        photoUrl: photoUrl || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        sortOrder,
        isActive,
      })
      .where(eq(boardMembers.id, id));

    revalidatePath("/board");
    revalidatePath("/admin");

    return { success: true, message: "Board member updated successfully" };
  } catch (error) {
    console.error("Error updating board member:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update board member",
    };
  }
}

export async function deleteBoardMember(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    // First, get the board member to retrieve their photo URL
    const [member] = await db
      .select()
      .from(boardMembers)
      .where(eq(boardMembers.id, id))
      .limit(1);

    if (!member) {
      return {
        success: false,
        message: "Board member not found",
      };
    }

    // Delete the board member from the database
    await db.delete(boardMembers).where(eq(boardMembers.id, id));

    // Delete the photo from blob storage if it exists
    if (member.photoUrl) {
      const { deleteImage } = await import("./upload");
      await deleteImage(member.photoUrl);
    }

    revalidatePath("/board");
    revalidatePath("/admin");

    return { success: true, message: "Board member deleted successfully" };
  } catch (error) {
    console.error("Error deleting board member:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete board member",
    };
  }
}

export async function reorderBoardMembers(
  orderedIds: number[]
): Promise<ActionResult> {
  try {
    await requireAdmin();

    // Update sort order for each board member
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(boardMembers)
        .set({ sortOrder: i })
        .where(eq(boardMembers.id, orderedIds[i]));
    }

    revalidatePath("/board");
    revalidatePath("/admin");

    return { success: true, message: "Board members reordered successfully" };
  } catch (error) {
    console.error("Error reordering board members:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to reorder board members",
    };
  }
}
