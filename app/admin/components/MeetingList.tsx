"use client";

import { useState } from "react";
import {
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "@/app/actions/meeting";
import { Meeting } from "@/db/schema";
import ImageUpload from "./ImageUpload";

interface MeetingListProps {
  meetings: Meeting[];
}

function getLocalDateTimeString(utcDate: string | Date) {
  if (!utcDate) return "";
  const date = new Date(utcDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDatetime(dt: string | Date) {
  return new Date(dt).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MeetingList({
  meetings: initialMeetings,
}: MeetingListProps) {
  const [items, setItems] = useState(initialMeetings);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Convert datetime-local (local time) to UTC ISO string for storage
    const datetimeInput = formData.get("datetime") as string;
    if (datetimeInput) {
      formData.set("datetime", new Date(datetimeInput).toISOString());
    }

    const result = editingItem
      ? await updateMeeting(editingItem.id, formData)
      : await createMeeting(formData);

    if (result.success) {
      if (editingItem) {
        const updatedItem: Meeting = {
          ...editingItem,
          title: formData.get("title") as string,
          datetime: new Date(formData.get("datetime") as string),
          location: formData.get("location") as string,
          details: (formData.get("details") as string) || null,
          slidesUrl: (formData.get("slidesUrl") as string) || null,
          recordingUrl: (formData.get("recordingUrl") as string) || null,
          imageUrl: imageUrl || editingItem.imageUrl,
        };
        setItems(
          items.map((item) => (item.id === editingItem.id ? updatedItem : item))
        );
        setMessage("Meeting updated successfully!");
      } else {
        if (result.data) {
          setItems([result.data as Meeting, ...items]);
        }
        setMessage("Meeting created successfully!");
      }
      form.reset();
      setShowForm(false);
      setEditingItem(null);
      setImageUrl("");
    } else {
      setMessage(
        result.message ||
          (editingItem
            ? "Failed to update meeting"
            : "Failed to create meeting")
      );
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (
      !confirm(
        "Delete this meeting? Attendance records for this meeting will also be deleted."
      )
    )
      return;

    const result = await deleteMeeting(id);
    if (result.success) {
      setMessage("Meeting deleted successfully!");
      setItems(items.filter((item) => item.id !== id));
    } else {
      setMessage(result.message || "Failed to delete meeting");
    }
  }

  function handleEdit(m: Meeting) {
    setEditingItem(m);
    setImageUrl(m.imageUrl ?? "");
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingItem(null);
    setImageUrl("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300"
        >
          {showForm ? "Cancel" : "Add Meeting"}
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
              htmlFor="datetime"
              className="block text-sm font-medium text-gray-300"
            >
              Date &amp; Time
            </label>
            <input
              key={editingItem?.id ?? "new"}
              type="datetime-local"
              id="datetime"
              name="datetime"
              required
              defaultValue={
                editingItem?.datetime
                  ? getLocalDateTimeString(editingItem.datetime)
                  : ""
              }
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
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
              key={editingItem?.id ?? "new"}
              type="text"
              id="location"
              name="location"
              required
              defaultValue={editingItem?.location ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-300"
            >
              Details{" "}
              <span className="font-normal text-gray-500">
                (markdown supported)
              </span>
            </label>
            <textarea
              key={editingItem?.id ?? "new"}
              id="details"
              name="details"
              rows={3}
              defaultValue={editingItem?.details ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="slidesUrl"
              className="block text-sm font-medium text-gray-300"
            >
              Slides URL
            </label>
            <input
              key={editingItem?.id ?? "new"}
              type="url"
              id="slidesUrl"
              name="slidesUrl"
              defaultValue={editingItem?.slidesUrl ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="recordingUrl"
              className="block text-sm font-medium text-gray-300"
            >
              Recording URL
            </label>
            <input
              key={editingItem?.id ?? "new"}
              type="url"
              id="recordingUrl"
              name="recordingUrl"
              defaultValue={editingItem?.recordingUrl ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <ImageUpload
            key={editingItem?.id ?? "new"}
            currentImageUrl={editingItem?.imageUrl}
            onUploadComplete={(url) => setImageUrl(url)}
            label="Meeting Photo"
          />
          <input type="hidden" name="imageUrl" value={imageUrl} />

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
                ? "Update Meeting"
                : "Create Meeting"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items
          .filter((item) => item.id !== editingItem?.id)
          .map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30"
            >
              <div>
                <h3 className="font-medium text-gray-100">{m.title}</h3>
                <p className="text-sm text-yellow-200">
                  {formatDatetime(m.datetime)} · {m.location}
                </p>
                {m.details && (
                  <p className="mt-1 text-sm text-gray-300">{m.details}</p>
                )}
                {(m.slidesUrl || m.recordingUrl || m.imageUrl) && (
                  <p className="mt-1 text-xs text-yellow-400/70">
                    {m.slidesUrl && "Slides "}
                    {m.recordingUrl && "Recording "}
                    {m.imageUrl && "Photo"}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
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
