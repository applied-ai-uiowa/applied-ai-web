"use client";

import { useState } from "react";
import Image from "next/image";
import {
  createBoardMember,
  deleteBoardMember,
  updateBoardMember,
  reorderBoardMembers,
} from "@/app/actions/board";
import { BoardMember } from "@/db/schema";
import ImageUpload from "./ImageUpload";

interface BoardMembersListProps {
  members: BoardMember[];
}

export default function BoardMembersList({
  members: initialMembers,
}: BoardMembersListProps) {
  const [items, setItems] = useState(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
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

    const result = editingItem
      ? await updateBoardMember(editingItem.id, formData)
      : await createBoardMember(formData);

    if (result.success) {
      if (editingItem) {
        // Update local state with edited values
        const updatedItem = {
          ...editingItem,
          name: formData.get("name") as string,
          role: formData.get("role") as string,
          bio: (formData.get("bio") as string) || null,
          photoUrl: photoUrl || null,
          linkedinUrl: (formData.get("linkedinUrl") as string) || null,
          githubUrl: (formData.get("githubUrl") as string) || null,
          isActive: formData.get("isActive") === "true",
        };
        setItems(items.map((item) => (item.id === editingItem.id ? updatedItem : item)));
        setMessage("Board member updated successfully!");
      } else {
        // Add new item to local state
        if (result.data) {
          setItems([...items, result.data as BoardMember]);
        }
        setMessage("Board member created successfully!");
      }
      form.reset();
      setPhotoUrl("");
      setShowForm(false);
      setEditingItem(null);
    } else {
      setMessage(
        result.message ||
          (editingItem
            ? "Failed to update board member"
            : "Failed to create board member")
      );
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this board member?")) return;

    const result = await deleteBoardMember(id);
    if (result.success) {
      setMessage("Board member deleted successfully!");
      setItems(items.filter((item) => item.id !== id));
    } else {
      setMessage(result.message || "Failed to delete board member");
    }
  }

  function handleEdit(member: BoardMember) {
    setEditingItem(member);
    setPhotoUrl(member.photoUrl || "");
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingItem(null);
    setPhotoUrl("");
  }

  async function handleMoveUp(index: number) {
    if (index === 0 || reordering) return;
    setReordering(true);

    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);

    const orderedIds = newItems.map((item) => item.id);
    const result = await reorderBoardMembers(orderedIds);

    if (!result.success) {
      setItems(items);
      setMessage(result.message || "Failed to reorder board members");
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
    const result = await reorderBoardMembers(orderedIds);

    if (!result.success) {
      setItems(items);
      setMessage(result.message || "Failed to reorder board members");
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
          className="space-y-4 rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              key={editingItem?.id ?? "new"}
              type="text"
              id="name"
              name="name"
              required
              defaultValue={editingItem?.name ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
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
              key={editingItem?.id ?? "new"}
              type="text"
              id="role"
              name="role"
              required
              placeholder="e.g., President, VP"
              defaultValue={editingItem?.role ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
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
              key={editingItem?.id ?? "new"}
              id="bio"
              name="bio"
              rows={3}
              defaultValue={editingItem?.bio ?? ""}
              className="mt-1 block w-full rounded-md border border-yellow-500/20 bg-black/30 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:ring-yellow-400/40 focus:outline-none"
            />
          </div>

          <ImageUpload
            key={editingItem?.id ?? "new"}
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
              key={editingItem?.id ?? "new"}
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              defaultValue={editingItem?.linkedinUrl ?? ""}
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

          <div className="flex items-center">
            <input
              key={editingItem?.id ?? "new"}
              type="checkbox"
              id="isActive"
              name="isActive"
              value="true"
              defaultChecked={editingItem?.isActive ?? true}
              className="h-4 w-4 rounded border-yellow-500/30 text-yellow-400 focus:ring-yellow-400/40"
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
            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading
              ? editingItem
                ? "Updating..."
                : "Creating..."
              : editingItem
                ? "Update Board Member"
                : "Create Board Member"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.filter((item) => item.id !== editingItem?.id).map((member, index) => (
          <div
            key={member.id}
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
              <div className="flex gap-4">
                {member.photoUrl && (
                  <div className="h-16 w-16 shrink-0">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-100">{member.name}</h3>
                  <p className="text-sm text-yellow-200">{member.role}</p>
                  {member.bio && (
                    <p className="mt-1 text-sm text-gray-300">{member.bio}</p>
                  )}
                  <div className="mt-2 flex gap-4">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-yellow-200"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-yellow-200"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-300">
                    Status: {member.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
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
