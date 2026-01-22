"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/actions/upload";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onUploadComplete,
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null
  );
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    if (result.success && result.url) {
      setMessage("Image uploaded successfully!");
      onUploadComplete(result.url);
    } else {
      setMessage(result.message || "Failed to upload image");
      setPreview(currentImageUrl || null);
    }

    setUploading(false);
  }

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {preview && (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-600">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : preview
              ? "Change Image"
              : "Choose Image"}
        </button>

        {message && (
          <p
            className={
              message.includes("success")
                ? "text-sm text-green-400"
                : "text-sm text-red-400"
            }
          >
            {message}
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400">Accepts images up to 5MB</p>
    </div>
  );
}
