"use client";

import { useState } from "react";
import {
  createProject,
  deleteProject,
  updateProject,
  reorderProjects,
} from "@/app/actions/projects";
import { Project } from "@/db/schema";

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({
  projects: initialProjects,
}: ProjectsListProps) {
  const [items, setItems] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = editingItem
      ? await updateProject(editingItem.id, formData)
      : await createProject(formData);

    if (result.success) {
      if (editingItem) {
        // Update local state with edited values
        const updatedItem = {
          ...editingItem,
          title: formData.get("title") as string,
          description: (formData.get("description") as string) || null,
          githubUrl: (formData.get("githubUrl") as string) || null,
          category: formData.get("category") as string,
        };
        setItems(items.map((item) => (item.id === editingItem.id ? updatedItem : item)));
        setMessage("Project updated successfully!");
      } else {
        // Add new item to local state
        if (result.data) {
          setItems([...items, result.data as Project]);
        }
        setMessage("Project created successfully!");
      }
      form.reset();
      setShowForm(false);
      setEditingItem(null);
    } else {
      setMessage(
        result.message ||
          (editingItem ? "Failed to update project" : "Failed to create project")
      );
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const result = await deleteProject(id);
    if (result.success) {
      setMessage("Project deleted successfully!");
      setItems(items.filter((item) => item.id !== id));
    } else {
      setMessage(result.message || "Failed to delete project");
    }
  }

  function handleEdit(project: Project) {
    setEditingItem(project);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingItem(null);
  }

  async function handleMoveUp(index: number) {
    if (index === 0 || reordering) return;
    setReordering(true);

    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);

    const orderedIds = newItems.map((item) => item.id);
    const result = await reorderProjects(orderedIds);

    if (!result.success) {
      setItems(items);
      setMessage(result.message || "Failed to reorder projects");
    }

    setReordering(false);
  }

  async function handleMoveDown(index: number) {
    if (index === items.length - 1 || reordering) return;
    setReordering(true);

    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);

    const orderedIds = newItems.map((item) => item.id);
    const result = await reorderProjects(orderedIds);

    if (!result.success) {
      setItems(items);
      setMessage(result.message || "Failed to reorder projects");
    }

    setReordering(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300"
        >
          {showForm ? "Cancel" : "Add Project"}
        </button>
        {message && (
          <p
            className={
              message.includes("success") ? "text-green-400" : "text-red-400"
            }
          >
            {message}
          </p>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              key={editingItem?.id ?? "new"}
              type="text"
              id="title"
              name="title"
              required
              defaultValue={editingItem?.title ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              key={editingItem?.id ?? "new"}
              id="description"
              name="description"
              rows={3}
              defaultValue={editingItem?.description ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="githubUrl"
              className="block text-sm font-medium text-gray-300"
            >
              GitHub URL
            </label>
            <input
              key={editingItem?.id ?? "new"}
              type="url"
              id="githubUrl"
              name="githubUrl"
              defaultValue={editingItem?.githubUrl ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300"
            >
              Category
            </label>
            <input
              key={editingItem?.id ?? "new"}
              type="text"
              id="category"
              name="category"
              required
              placeholder="e.g., Computer Vision, NLP"
              defaultValue={editingItem?.category ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading
              ? editingItem
                ? "Updating..."
                : "Creating..."
              : editingItem
                ? "Update Project"
                : "Create Project"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.filter((item) => item.id !== editingItem?.id).map((project, index) => (
          <div
            key={project.id}
            className="flex items-start justify-between rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30"
          >
            <div className="flex items-start gap-2">
              <div className="flex flex-col">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || reordering}
                  className="p-1 text-gray-400 hover:text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === items.length - 1 || reordering}
                  className="p-1 text-gray-400 hover:text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <h3 className="font-medium text-gray-100">{project.title}</h3>
                <p className="text-sm text-yellow-200">{project.category}</p>
                {project.description && (
                  <p className="mt-1 text-sm text-gray-300">
                    {project.description}
                  </p>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-yellow-300 hover:text-yellow-200"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
