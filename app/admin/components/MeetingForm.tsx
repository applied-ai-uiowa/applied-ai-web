"use client";

import { useState } from "react";
import { updateMeeting } from "@/app/actions/meeting";
import { Meeting } from "@/db/schema";

interface MeetingFormProps {
  initialData: Meeting | null;
}

export default function MeetingForm({ initialData }: MeetingFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await updateMeeting(formData);

    if (result.success) {
      setMessage("Meeting updated successfully!");
    } else {
      setMessage(result.message || "Failed to update meeting");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          defaultValue={initialData?.title || ""}
          required
          className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="datetime"
          className="block text-sm font-medium text-gray-300"
        >
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          defaultValue={
            initialData?.datetime
              ? new Date(initialData.datetime).toLocaleString('sv-SE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).replace(' ', 'T')
              : ""
          }
          required
          className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-300"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={initialData?.location || ""}
          required
          className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="details"
          className="block text-sm font-medium text-gray-300"
        >
          Details
        </label>
        <textarea
          id="details"
          name="details"
          rows={3}
          defaultValue={initialData?.details || ""}
          className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="rsvpLink"
          className="block text-sm font-medium text-gray-300"
        >
          RSVP Link
        </label>
        <input
          type="url"
          id="rsvpLink"
          name="rsvpLink"
          defaultValue={initialData?.rsvpLink || ""}
          className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 shadow-sm focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Meeting"}
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
    </form>
  );
}
