"use client";

import { useState } from "react";
import { createTutorial, deleteTutorial } from "@/app/actions/tutorials";
import { Tutorial } from "@/db/schema";

interface TutorialsListProps {
  tutorials: Tutorial[];
}

export default function TutorialsList({
  tutorials: initialTutorials,
}: TutorialsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createTutorial(formData);

    if (result.success) {
      setMessage("Tutorial created successfully!");
      form.reset();
      setShowForm(false);
    } else {
      setMessage(result.message || "Failed to create tutorial");
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this tutorial?")) return;

    const result = await deleteTutorial(id);
    if (result.success) {
      setMessage("Tutorial deleted successfully!");
    } else {
      setMessage(result.message || "Failed to delete tutorial");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300"
        >
          {showForm ? "Cancel" : "Add Tutorial"}
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
              type="text"
              id="title"
              name="title"
              required
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
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-300"
            >
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              required
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
              type="text"
              id="category"
              name="category"
              required
              placeholder="e.g., Python, Machine Learning"
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
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
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Tutorial"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {initialTutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30"
          >
            <div>
              <h3 className="font-medium text-gray-100">{tutorial.title}</h3>
              <p className="text-sm text-yellow-200">{tutorial.category}</p>
              {tutorial.description && (
                <p className="mt-1 text-sm text-gray-300">
                  {tutorial.description}
                </p>
              )}
              <a
                href={tutorial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-yellow-300 hover:text-yellow-200"
              >
                {tutorial.url}
              </a>
            </div>
            <button
              onClick={() => handleDelete(tutorial.id)}
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
