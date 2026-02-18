"use server";

import { db } from "@/db";
import { aiNews } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllNews() {
  return db
    .select()
    .from(aiNews)
    .orderBy(desc(aiNews.createdAt), asc(aiNews.sortOrder), desc(aiNews.id));
}

export async function createNews(input: {
  title: string;
  url: string;
  summary?: string;
  source?: string;
  publishedAt?: string; // ISO string optional
  sortOrder?: number;
  isActive?: boolean;
}) {
  const title = input.title?.trim();
  const url = input.url?.trim();

  if (!title) throw new Error("Title is required.");
  if (!url) throw new Error("URL is required.");

  const publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;

  const [created] = await db
    .insert(aiNews)
    .values({
      title,
      url,
      summary: input.summary?.trim() || null,
      source: input.source?.trim() || null,
      publishedAt: publishedAt ?? null,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
    })
    .returning();

  revalidatePath("/admin/news");
  revalidatePath("/news");

  return created;
}

export async function deleteNews(id: number) {
  if (!id || Number.isNaN(Number(id))) throw new Error("Invalid id.");
  await db.delete(aiNews).where(eq(aiNews.id, id));
  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function toggleNewsActive(id: number) {
  if (!id || Number.isNaN(Number(id))) throw new Error("Invalid id.");

  const rows = await db.select().from(aiNews).where(eq(aiNews.id, id)).limit(1);
  const item = rows[0];
  if (!item) throw new Error("News item not found.");

  await db
    .update(aiNews)
    .set({ isActive: !item.isActive })
    .where(eq(aiNews.id, id));

  revalidatePath("/admin/news");
  revalidatePath("/news");
}
