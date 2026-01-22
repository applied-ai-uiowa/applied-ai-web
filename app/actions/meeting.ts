"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { meeting } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function updateMeeting(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const datetime = formData.get("datetime") as string;
    const location = formData.get("location") as string;
    const details = formData.get("details") as string;
    const rsvpLink = formData.get("rsvpLink") as string;

    // Validate required fields
    if (!title || !datetime || !location) {
      return {
        success: false,
        message: "Title, datetime, and location are required",
      };
    }

    // Check if a meeting already exists
    const existingMeeting = await db.select().from(meeting).limit(1);

    if (existingMeeting.length > 0) {
      // Update existing meeting
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
        .where(eq(meeting.id, existingMeeting[0].id));
    } else {
      // Create new meeting
      await db.insert(meeting).values({
        title,
        datetime: new Date(datetime),
        location,
        details: details || null,
        rsvpLink: rsvpLink || null,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Meeting updated successfully" };
  } catch (error) {
    console.error("Error updating meeting:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update meeting",
    };
  }
}
