"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Download,
  Save,
  ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile, getFileUrl } from "@/app/lib/storage";
import { addRow } from "@/app/lib/db";
import { getUser, getErrorMessage } from "@/app/lib/auth";

interface TamboThumbnailProps {
  prompt?: string;
}

interface GeneratedImage {
  data: string;
  mimeType: string;
}

export default function TamboThumbnail({ prompt: initialPrompt }: TamboThumbnailProps) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError("");
    setSuccessMessage("");
    setLoading(true);
    setImage(null);
    setSaved(false);

    try {
      const res = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate image."); return; }
      setImage(data.image);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt?.trim()) handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (!image) return;
    const byteString = atob(image.data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
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
        setError("You must be logged in to save.");
        return;
      }
      const byteString = atob(image.data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: image.mimeType });
      const file = new File([blob], `thumbnail-${Date.now()}.png`, { type: image.mimeType });
      const uploaded = await uploadFile(file);
      const thumbnailUrl = getFileUrl(uploaded.$id);
      await addRow(process.env.NEXT_PUBLIC_APPWRITE_THUMBNAILS_TABLE_ID!, {
        owner: userResult.data.rows[0].$id,
        thumbnailUrl: String(thumbnailUrl),
      });
      setSaved(true);
      setSuccessMessage("Thumbnail saved!");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Thumbnail Designer</h3>

      <textarea
        rows={2}
        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none mb-3"
        placeholder="Describe your thumbnail..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />

      <Button size="sm" className="bg-brand hover:bg-brand/90 text-white gap-1.5 text-xs w-full mb-3"
        disabled={!prompt.trim() || loading} onClick={handleGenerate}>
        {loading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>) :
          (<><Sparkles className="w-3.5 h-3.5" />{image ? "Regenerate" : "Generate Thumbnail"}</>)}
      </Button>

      {successMessage && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg p-2 mb-3 text-xs">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />{successMessage}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg p-2 mb-3 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </div>
      )}

      {loading && (
        <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border animate-pulse flex items-center justify-center mb-3">
          <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
        </div>
      )}

      {image && !loading && (
        <div className="mb-3">
          <div className="relative bg-muted rounded-lg overflow-hidden border border-border">
            <div className="aspect-video">
              <img src={`data:${image.mimeType};base64,${image.data}`} alt="Generated thumbnail"
                className="w-full h-full object-cover" />
            </div>
            {saved && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />Saved
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={handleDownload}>
              <Download className="w-3 h-3" />Download
            </Button>
            <Button size="sm" className="gap-1 text-xs h-7 bg-brand hover:bg-brand/90 text-white"
              onClick={handleSave} disabled={saving || saved}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
