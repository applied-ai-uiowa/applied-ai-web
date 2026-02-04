"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function createProject(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const category = formData.get("category") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!title || !category) {
      return {
        success: false,
        message: "Title and category are required",
      };
    }

    const [created] = await db.insert(projects).values({
      title,
      description: description || null,
      githubUrl: githubUrl || null,
      category,
      sortOrder,
    }).returning();

    revalidatePath("/projects");
    revalidatePath("/admin");

    return { success: true, message: "Project created successfully", data: created };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateProject(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const category = formData.get("category") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!title || !category) {
      return {
        success: false,
        message: "Title and category are required",
      };
    }

    await db
      .update(projects)
      .set({
        title,
        description: description || null,
        githubUrl: githubUrl || null,
        category,
        sortOrder,
      })
      .where(eq(projects.id, id));

    revalidatePath("/projects");
    revalidatePath("/admin");

    return { success: true, message: "Project updated successfully" };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProject(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    await db.delete(projects).where(eq(projects.id, id));

    revalidatePath("/projects");
    revalidatePath("/admin");

    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export async function reorderProjects(
  orderedIds: number[]
): Promise<ActionResult> {
  try {
    await requireAdmin();

    // Update sort order for each project
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(projects)
        .set({ sortOrder: i })
        .where(eq(projects.id, orderedIds[i]));
    }

    revalidatePath("/projects");
    revalidatePath("/admin");

    return { success: true, message: "Projects reordered successfully" };
  } catch (error) {
    console.error("Error reordering projects:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reorder projects",
    };
  }
}
