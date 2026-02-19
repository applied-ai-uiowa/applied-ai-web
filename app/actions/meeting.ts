"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { meeting, Meeting } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function createMeeting(
  formData: FormData
): Promise<ActionResult<Meeting>> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const datetime = formData.get("datetime") as string;
    const location = formData.get("location") as string;
    const details = formData.get("details") as string;
    const rsvpLink = formData.get("rsvpLink") as string;

    if (!title || !datetime || !location) {
      return {
        success: false,
        message: "Title, datetime, and location are required",
      };
    }

    const [created] = await db
      .insert(meeting)
      .values({
        title,
        datetime: new Date(datetime),
        location,
        details: details || null,
        rsvpLink: rsvpLink || null,
      })
      .returning();

    revalidatePath("/");
    revalidatePath("/meetings");
    revalidatePath("/admin");

    return { success: true, data: created };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create meeting",
    };
  }
}

export async function updateMeeting(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const datetime = formData.get("datetime") as string;
    const location = formData.get("location") as string;
    const details = formData.get("details") as string;
    const rsvpLink = formData.get("rsvpLink") as string;

    if (!title || !datetime || !location) {
      return {
        success: false,
        message: "Title, datetime, and location are required",
      };
    }

    await db
      .update(meeting)
      .set({
        title,
        datetime: new Date(datetime),
        location,
        details: details || null,
        rsvpLink: rsvpLink || null,
        updatedAt: new Date(),
      })
      .where(eq(meeting.id, id));

    revalidatePath("/");
    revalidatePath("/meetings");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating meeting:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update meeting",
    };
  }
}

export async function deleteMeeting(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    await db.delete(meeting).where(eq(meeting.id, id));

    revalidatePath("/");
    revalidatePath("/meetings");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete meeting",
    };
  }
}
