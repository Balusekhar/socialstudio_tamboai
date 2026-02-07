"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Download,
  Save,
  RefreshCw,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Pencil,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile, getFileUrl } from "@/app/lib/storage";
import { addRow } from "@/app/lib/db";
import { getUser, getErrorMessage } from "@/app/lib/auth";

interface GeneratedImage {
  data: string;
  mimeType: string;
}

export default function ThumbnailPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setError("");
    setSuccessMessage("");
    setLoading(true);
    setImage(null);
    setSaved(false);
    setEditing(false);
    setEditPrompt("");

    try {
      const res = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate image.");
        return;
      }

      setImage(data.image);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt.trim() || !image) return;

    setError("");
    setSuccessMessage("");
    setEditLoading(true);

    try {
      const res = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editPrompt: editPrompt.trim(),
          imageData: image.data,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to edit image.");
        return;
      }

      setImage(data.image);
      setSaved(false);
      setEditPrompt("");
      setEditing(false);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setEditLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const byteString = atob(image.data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: image.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thumbnail-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!image) return;
    setError("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const userResult = await getUser();
      if (!userResult.success || !userResult.data) {
        setError("You must be logged in to save thumbnails.");
        return;
      }

      const byteString = atob(image.data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: image.mimeType });
      const file = new File([blob], `thumbnail-${Date.now()}.png`, {
        type: image.mimeType,
      });

      const uploaded = await uploadFile(file);
      const thumbnailUrl = getFileUrl(uploaded.$id);

      await addRow(process.env.NEXT_PUBLIC_APPWRITE_THUMBNAILS_TABLE_ID!, {
        owner: userResult.data.rows[0].$id,
        thumbnailUrl: String(thumbnailUrl),
      });

      setSaved(true);
      setSuccessMessage("Thumbnail saved successfully!");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Thumbnail
        </h1>
        <p className="text-muted-foreground">
          Create eye-catching thumbnails for your reels with AI assistance.
          Powered by ChatGPT.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Describe your thumbnail
        </label>
        <textarea
          id="prompt"
          rows={3}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 resize-none"
          placeholder="e.g. Master ClawdBot in 30 Minutes — focused young developer, ClawdBot logo, dark blue/purple gradient..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading || editLoading}
        />
        <div className="flex items-center gap-3 mt-3">
          <Button
            className="bg-brand hover:bg-brand/90 text-white gap-2"
            disabled={!prompt.trim() || loading || editLoading}
            onClick={handleGenerate}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {image ? "Regenerate" : "Generate Thumbnail"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl p-4 mb-6 text-sm font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl p-4 mb-6 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {(loading || editLoading) && (
        <div className="mb-8 max-w-2xl">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            {editLoading ? "Applying edits..." : "Generating thumbnail..."}
          </h2>
          <div className="aspect-video bg-muted rounded-xl overflow-hidden border border-border animate-pulse flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
          </div>
        </div>
      )}

      {/* Generated Image */}
      {image && !loading && !editLoading && (
        <div className="mb-8 max-w-2xl">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            AI Generated Thumbnail
          </h2>
          <div className="relative bg-muted rounded-xl overflow-hidden border border-border">
            <div className="aspect-video">
              <img
                src={`data:${image.mimeType};base64,${image.data}`}
                alt="Generated thumbnail"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Saved badge */}
            {saved && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Saved
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-brand hover:bg-brand/90 text-white"
              onClick={handleSave}
              disabled={saving || saved}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                setEditing(!editing);
                setEditPrompt("");
              }}
            >
              {editing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={handleGenerate}
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>

          {/* Edit input */}
          {editing && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40"
                placeholder="e.g. Make the text bigger, change background to red, add a glow effect..."
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editPrompt.trim()) handleEdit();
                }}
                disabled={editLoading}
                autoFocus
              />
              <Button
                className="bg-brand hover:bg-brand/90 text-white gap-1.5"
                disabled={!editPrompt.trim() || editLoading}
                onClick={handleEdit}
              >
                {editLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Apply
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!image && !loading && (
        <div className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <ImageIcon className="w-7 h-7 text-brand" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            No thumbnail yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Enter a prompt above and click &quot;Generate Thumbnail&quot; to
            create a high-CTR thumbnail for your video.
          </p>
        </div>
      )}
    </div>
  );
}
