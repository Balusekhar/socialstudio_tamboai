"use client";

import { useState, useEffect } from "react";
import { AlignLeft, Hash, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addRow } from "@/app/lib/db";
import { getUser, getErrorMessage } from "@/app/lib/auth";

const METADATA_TABLE_ID = process.env.NEXT_PUBLIC_APPWRITE_METADATA_TABLE_ID!;

interface TamboMetadataProps {
  videoDescription?: string;
}

export default function TamboMetadata({ videoDescription }: TamboMetadataProps) {
  const [prompt, setPrompt] = useState(videoDescription || "");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getUser();
      if (result.success && result.data) setUserId(result.data.rows[0].$id);
    })();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setDescription("");
    setHashtags([]);

    try {
      const res = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setDescription(data.description);
      setHashtags(data.hashtags);

      if (userId) {
        try {
          await addRow(METADATA_TABLE_ID, {
            owner: userId,
            description: data.description,
            hashtags: data.hashtags,
          });
        } catch (dbErr) {
          console.error("Failed to save metadata:", getErrorMessage(dbErr));
        }
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoDescription?.trim()) handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async (text: string, type: "desc" | "tags") => {
    await navigator.clipboard.writeText(text);
    if (type === "desc") { setCopiedDesc(true); setTimeout(() => setCopiedDesc(false), 2000); }
    else { setCopiedTags(true); setTimeout(() => setCopiedTags(false), 2000); }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">SEO Metadata</h3>

      <textarea
        rows={2}
        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none mb-3"
        placeholder="Describe your video..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />

      <Button size="sm" className="bg-brand hover:bg-brand/90 text-white gap-1.5 text-xs w-full mb-3"
        disabled={loading || !prompt.trim()} onClick={handleGenerate}>
        {loading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>) :
          (<><Sparkles className="w-3.5 h-3.5" />Generate Metadata</>)}
      </Button>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {description && (
        <div className="bg-muted rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
              <AlignLeft className="w-3 h-3 text-brand" />Description
            </span>
            <button onClick={() => copy(description, "desc")} className="text-xs text-muted-foreground hover:text-foreground">
              {copiedDesc ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">{description}</p>
        </div>
      )}

      {hashtags.length > 0 && (
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Hash className="w-3 h-3 text-brand" />Hashtags
            </span>
            <button onClick={() => copy(hashtags.join(" "), "tags")} className="text-xs text-muted-foreground hover:text-foreground">
              {copiedTags ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {hashtags.map((tag) => (
              <span key={tag} className="inline-flex bg-brand/10 text-brand text-[10px] font-medium px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
