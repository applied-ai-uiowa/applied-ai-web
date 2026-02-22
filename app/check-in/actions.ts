"use server";

import { db } from "@/db";
import { attendance, meeting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitCheckIn(formData: FormData): Promise<void> {
  const meetingIdRaw = String(formData.get("meetingId") || "").trim();
  const meetingId = Number(meetingIdRaw);

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const note = String(formData.get("note") || "").trim();

  // Send the user back to the same check-in page with the same meeting id.
  const backTo = meetingIdRaw
    ? `/check-in?m=${encodeURIComponent(meetingIdRaw)}`
    : "/check-in";

  // Validate meeting id
  if (!meetingIdRaw || Number.isNaN(meetingId) || meetingId <= 0) {
    redirect(`${backTo}&error=missing_meeting`);
  }

  // Validate meeting exists
  const m = await db
    .select()
    .from(meeting)
    .where(eq(meeting.id, meetingId))
    .limit(1);

  if (m.length === 0) {
    redirect(`${backTo}&error=invalid_meeting`);
  }

  // Optional email validation
  if (email && !isValidEmail(email)) {
    redirect(`${backTo}&error=invalid_email`);
  }

  // Save attendance
  await db.insert(attendance).values({
    meetingId,
    name: name || null,
    email: email || null,
    note: note || null,
  });

  // Redirect with success flag
  redirect(`${backTo}&ok=1`);
}
