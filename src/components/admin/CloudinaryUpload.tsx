"use client";

import { useEffect, useRef, useState } from "react";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  hint?: string;
  folder?: string;
  accept?: string;
}

export function CloudinaryUpload({
  onUpload,
  currentUrl,
  label = "Upload Image",
  hint = "JPG, PNG, WebP, or PDF (max 10MB)",
  folder = "portfolio",
  accept = "image/jpeg,image/png,image/webp,image/gif,application/pdf",
}: CloudinaryUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileType, setFileType] = useState<"image" | "pdf">("image");

  useEffect(() => {
    setPreview(currentUrl || "");
    if (currentUrl) {
      setFileType(currentUrl.toLowerCase().endsWith(".pdf") ? "pdf" : "image");
    }
  }, [currentUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Format tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File terlalu besar. Maksimal 10MB.");
      return;
    }

    const isPdf = file.type === "application/pdf";
    setError("");
    setUploading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
      if (!cloudName || !apiKey) {
        throw new Error("Cloudinary env vars belum diset di .env.local");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "portfolio_upload");
      formData.append("api_key", apiKey);
      formData.append("folder", folder);

      // Upload everything as "image" — Cloudinary generates preview for PDFs too
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Upload gagal (${res.status})`);
      }

      const data = await res.json();
      const url = data.secure_url;
      setPreview(url);
      setFileType(isPdf ? "pdf" : "image");
      onUpload(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload gagal";
      setError(message);
      console.error("Cloudinary upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="font-[family-name:var(--font-body)] text-xs text-text-muted block">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="w-20 h-20 rounded-lg bg-surface-2 border border-border overflow-hidden shrink-0 flex items-center justify-center">
          {preview ? (
            fileType === "pdf" ? (
              <div className="flex flex-col items-center gap-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="text-[9px] text-red-400 font-semibold">PDF</span>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}
        </div>

        <div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-surface-2 border border-border text-text-primary text-sm px-4 py-2 rounded-lg hover:bg-surface-container-high hover:border-accent/40 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                {preview ? "Change File" : "Upload File"}
              </>
            )}
          </button>
          <p className="font-[family-name:var(--font-body)] text-xs text-text-muted mt-1.5">
            {hint}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          ⚠️ {error}
        </p>
      )}

      {/* URL display */}
      {preview && (
        <input
          readOnly
          value={preview}
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-muted text-xs font-[family-name:var(--font-code)] focus:outline-none"
        />
      )}
    </div>
  );
}
