"use client";

import { useState } from "react";
import { createEpisode, deleteEpisode } from "@/app/actions/episodes";
import { Episode } from "@/db/schema";

interface EpisodesListProps {
  episodes: Episode[];
}

export default function EpisodesList({
  episodes: initialEpisodes,
}: EpisodesListProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createEpisode(formData);

    if (result.success) {
      setMessage("Episode created successfully!");
      form.reset();
      setShowForm(false);
    } else {
      setMessage(result.message || "Failed to create episode");
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this episode?")) return;

    const result = await deleteEpisode(id);
    if (result.success) {
      setMessage("Episode deleted successfully!");
    } else {
      setMessage(result.message || "Failed to delete episode");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? "Cancel" : "Add Episode"}
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
              htmlFor="durationMinutes"
              className="block text-sm font-medium text-gray-300"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="durationMinutes"
              name="durationMinutes"
              required
              min={1}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="tag"
              className="block text-sm font-medium text-gray-300"
            >
              Tag
            </label>
            <input
              type="text"
              id="tag"
              name="tag"
              required
              placeholder="e.g., Prompting, Automation, Testing"
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="spotifyUrl"
              className="block text-sm font-medium text-gray-300"
            >
              Spotify URL (leave empty for &quot;coming soon&quot;)
            </label>
            <input
              type="url"
              id="spotifyUrl"
              name="spotifyUrl"
              placeholder="https://..."
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
            {loading ? "Creating..." : "Create Episode"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {initialEpisodes.map((episode, index) => (
          <div
            key={episode.id}
            className="flex items-center justify-between rounded-lg border-gray-700 bg-gray-900 p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-indigo-400">
                  Ep {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-gray-400">
                  • {episode.durationMinutes} min
                </span>
                <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-200">
                  {episode.tag}
                </span>
              </div>
              <h3 className="font-medium text-gray-100">{episode.title}</h3>
              {episode.description && (
                <p className="mt-1 text-sm text-gray-400">
                  {episode.description}
                </p>
              )}
              {episode.spotifyUrl ? (
                <a
                  href={episode.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Listen on Spotify
                </a>
              ) : (
                <span className="mt-2 inline-block text-sm text-gray-500">
                  Coming soon
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(episode.id)}
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
