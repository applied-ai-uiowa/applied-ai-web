"use server";

import { db } from "@/db";
import { aiNews } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function getAllNews() {
  return db
    .select()
    .from(aiNews)
    .orderBy(asc(aiNews.sortOrder), desc(aiNews.createdAt));
}

export async function createNews(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const source = String(formData.get("source") || "").trim();
  const summary = String(formData.get("summary") || "").trim();

  if (!title || !url) return { ok: false, error: "Title and URL are required." };
  if (!isValidUrl(url)) return { ok: false, error: "Please enter a valid URL." };

  await db.insert(aiNews).values({
    title,
    url,
    source: source || null,
    summary: summary || null,
  });

  return { ok: true };
}

export async function deleteNews(id: number) {
  await db.delete(aiNews).where(eq(aiNews.id, id));
  return { ok: true };
}

export async function toggleNewsActive(id: number, isActive: boolean) {
  await db.update(aiNews).set({ isActive }).where(eq(aiNews.id, id));
  return { ok: true };
}
