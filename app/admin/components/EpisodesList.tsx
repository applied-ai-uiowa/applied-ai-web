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
          className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300"
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
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
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
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
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
            {loading ? "Creating..." : "Create Episode"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {initialEpisodes.map((episode, index) => (
          <div
            key={episode.id}
            className="flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-yellow-200">
                  Ep {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-gray-400">
                  • {episode.durationMinutes} min
                </span>
                <span className="rounded-full border border-yellow-500/30 bg-yellow-400/10 px-2 py-0.5 text-xs text-yellow-200">
                  {episode.tag}
                </span>
              </div>
              <h3 className="font-medium text-gray-100">{episode.title}</h3>
              {episode.description && (
                <p className="mt-1 text-sm text-gray-300">
                  {episode.description}
                </p>
              )}
              {episode.spotifyUrl ? (
                <a
                  href={episode.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-yellow-300 hover:text-yellow-200"
                >
                  Listen on Spotify
                </a>
              ) : (
                <span className="mt-2 inline-block text-sm text-gray-300">
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
