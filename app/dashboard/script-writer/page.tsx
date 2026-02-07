"use client";

import { useState } from "react";
import {
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScriptWriterPage() {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("10");
  const [tone, setTone] = useState("educational");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const tones = [
    { value: "educational", label: "Educational" },
    { value: "entertaining", label: "Entertaining" },
    { value: "motivational", label: "Motivational" },
    { value: "conversational", label: "Conversational" },
    { value: "professional", label: "Professional" },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a video topic.");
      return;
    }

    setLoading(true);
    setError("");
    setScript("");

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          duration,
          tone,
          platform: "youtube",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate script. Please try again.");
        return;
      }

      setScript(data.script);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Script Writer
        </h1>
        <p className="text-muted-foreground">
          Generate engaging YouTube video scripts powered by AI. Define your
          topic, duration, and tone to get a ready-to-record script.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-foreground text-sm mb-4">
          Script Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Video Topic
            </label>
            <textarea
              placeholder="e.g. How to build a personal portfolio website using Next.js and deploy it for free on Vercel"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Target Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                <option value="5">Short (5 min)</option>
                <option value="10">Medium (10 min)</option>
                <option value="15">Long (15 min)</option>
                <option value="20">Extended (20+ min)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <Button
          className="bg-brand hover:bg-brand/90 text-white gap-2 mt-4"
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Script...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Script
            </>
          )}
        </Button>
      </div>

      {/* Generated Script */}
      {script && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand" />
              Generated Script
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={copyToClipboard}
              >
                {copied ? (
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
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={handleGenerate}
                disabled={loading}
              >
                <RotateCcw className="w-3 h-3" />
                Regenerate
              </Button>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4 max-h-[600px] overflow-auto">
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              {script}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!script && !loading && (
        <div className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-brand" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            No script generated yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Enter your video topic, choose a duration and tone, then click
            &quot;Generate Script&quot; to create a full YouTube video script.
          </p>
        </div>
      )}
    </div>
  );
}
