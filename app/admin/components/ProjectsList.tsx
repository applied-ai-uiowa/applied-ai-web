"use client";

import { useState } from "react";
import { createProject, deleteProject } from "@/app/actions/projects";
import { Project } from "@/db/schema";

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({
  projects: initialProjects,
}: ProjectsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createProject(formData);

    if (result.success) {
      setMessage("Project created successfully!");
      form.reset();
      setShowForm(false);
    } else {
      setMessage(result.message || "Failed to create project");
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const result = await deleteProject(id);
    if (result.success) {
      setMessage("Project deleted successfully!");
    } else {
      setMessage(result.message || "Failed to delete project");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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
          className="space-y-4 rounded-lg border-gray-700 bg-gray-900 p-4"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
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
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
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
              type="url"
              id="githubUrl"
              name="githubUrl"
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="demoUrl"
              className="block text-sm font-medium text-gray-300"
            >
              Demo URL
            </label>
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
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
              type="text"
              id="category"
              name="category"
              required
              placeholder="e.g., Computer Vision, NLP"
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-gray-300"
            >
              Sort Order
            </label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              defaultValue={0}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {initialProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-start justify-between rounded-lg border-gray-700 bg-gray-900 p-4"
          >
            <div>
              <h3 className="font-medium text-gray-100">{project.title}</h3>
              <p className="text-sm text-gray-400">{project.category}</p>
              {project.description && (
                <p className="mt-1 text-sm text-gray-400">
                  {project.description}
                </p>
              )}
              <div className="mt-2 flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Demo
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(project.id)}
              className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
