"use client";

import { useState, useEffect } from "react";
import {
  AlignLeft,
  Hash,
  Sparkles,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addRow } from "@/app/lib/db";
import { getUser, getErrorMessage } from "@/app/lib/auth";

const METADATA_TABLE_ID = process.env.NEXT_PUBLIC_APPWRITE_METADATA_TABLE_ID!;

export default function MetadataPage() {
  const [prompt, setPrompt] = useState("");
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
      if (result.success && result.data) {
        setUserId(result.data.rows[0].$id);
      }
    })();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe your video first.");
      return;
    }

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

      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.");
        return;
      }

      setDescription(data.description);
      setHashtags(data.hashtags);

      // Save to database
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
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "desc" | "tags") => {
    await navigator.clipboard.writeText(text);
    if (type === "desc") {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    } else {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Metadata
        </h1>
        <p className="text-muted-foreground">
          Generate optimized YouTube descriptions and hashtags with AI.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-foreground text-sm mb-3">
          Describe your video
        </h3>
        <textarea
          placeholder="e.g. A 10-minute tutorial on how to build a portfolio website using Next.js and Tailwind CSS, targeted at beginner developers..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none mb-4"
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <Button
          className="bg-brand hover:bg-brand/90 text-white gap-2"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {(description || hashtags.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description */}
          {description && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-brand" />
                  Description
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => copyToClipboard(description, "desc")}
                >
                  {copiedDesc ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted rounded-lg p-4 max-h-[400px] overflow-auto">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          )}

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Hash className="w-4 h-4 text-brand" />
                  Hashtags
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() =>
                    copyToClipboard(hashtags.join(" "), "tags")
                  }
                >
                  {copiedTags ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-brand/10 text-brand text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-brand/20 transition-colors"
                    onClick={() => copyToClipboard(tag, "tags")}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
