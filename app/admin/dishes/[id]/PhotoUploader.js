"use client";

import { useState, useTransition, useRef } from "react";
import { addDishPhoto, removeDishPhoto } from "../actions";

export default function PhotoUploader({
  dishId,
  photos,
  cloudinaryConfigured,
  cloudName,
  uploadPreset,
}) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too large (max 5MB).");
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "lady-d-kitchen");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Upload failed");
      }
      const result = await addDishPhoto(dishId, data.secure_url);
      if (!result.ok) {
        throw new Error(result.error);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function onRemove(photoUrl) {
    if (!confirm("Remove this photo?")) return;
    startTransition(async () => {
      const result = await removeDishPhoto(dishId, photoUrl);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-card p-6 space-y-4">
      <h2 className="font-medium">Photos</h2>

      {!cloudinaryConfigured ? (
        <p className="text-sm text-[#A69A88] bg-[#F7F5F1] border border-[#E8E2D5] rounded-md p-3">
          Photo upload is not configured. Set
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
          CLOUDINARY_UPLOAD_PRESET in your .env to enable it.
        </p>
      ) : (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={uploading || isPending}
            className="text-sm"
          />
          {uploading && (
            <span className="text-sm text-[#A69A88]">Uploading…</span>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-[#7A2634]">{error}</p>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {photos.map((url) => (
            <div
              key={url}
              className="relative group aspect-square bg-[#F7F5F1] rounded-md overflow-hidden"
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemove(url)}
                disabled={isPending}
                className="absolute top-1 right-1 bg-white/90 text-[#7A2634] hover:bg-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        !uploading && cloudinaryConfigured && (
          <p className="text-sm text-[#A69A88]">No photos yet.</p>
        )
      )}
    </section>
  );
}
