"use client";

import { useState } from "react";
import Image from "next/image";
import { createBoardMember, deleteBoardMember } from "@/app/actions/board";
import { BoardMember } from "@/db/schema";
import ImageUpload from "./ImageUpload";

interface BoardMembersListProps {
  members: BoardMember[];
}

export default function BoardMembersList({
  members: initialMembers,
}: BoardMembersListProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add the uploaded photo URL to the form data
    if (photoUrl) {
      formData.set("photoUrl", photoUrl);
    }

    const result = await createBoardMember(formData);

    if (result.success) {
      setMessage("Board member created successfully!");
      form.reset();
      setPhotoUrl("");
      setShowForm(false);
    } else {
      setMessage(result.message || "Failed to create board member");
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this board member?")) return;

    const result = await deleteBoardMember(id);
    if (result.success) {
      setMessage("Board member deleted successfully!");
    } else {
      setMessage(result.message || "Failed to delete board member");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? "Cancel" : "Add Board Member"}
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-300"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              required
              placeholder="e.g., President, VP"
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-300"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
            />
          </div>

          <ImageUpload
            currentImageUrl={photoUrl}
            onUploadComplete={(url) => setPhotoUrl(url)}
            label="Board Member Photo"
          />

          <input type="hidden" name="photoUrl" value={photoUrl} />

          <div>
            <label
              htmlFor="linkedinUrl"
              className="block text-sm font-medium text-gray-300"
            >
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              value="true"
              defaultChecked
              className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-300"
            >
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Board Member"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {initialMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-start justify-between rounded-lg border-gray-700 bg-gray-900 p-4"
          >
            <div className="flex gap-4">
              {member.photoUrl && (
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  width={64}
                  height={64}
                  className="shrink-0 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-medium text-gray-100">{member.name}</h3>
                <p className="text-sm text-indigo-400">{member.role}</p>
                {member.bio && (
                  <p className="mt-1 text-sm text-gray-400">{member.bio}</p>
                )}
                <div className="mt-2 flex gap-4">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-gray-200"
                    >
                      LinkedIn
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-gray-200"
                    >
                      GitHub
                    </a>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Status: {member.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(member.id)}
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
