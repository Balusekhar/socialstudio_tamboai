"use client";

import { useState, useEffect } from "react";
import { Clapperboard, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TamboReelScriptProps {
  topic?: string;
  format?: string;
  duration?: string;
}

export default function TamboReelScript({ topic: initialTopic, format: initialFormat, duration: initialDuration }: TamboReelScriptProps) {
  const [topic, setTopic] = useState(initialTopic || "");
  const [format, setFormat] = useState(initialFormat || "hook-story-cta");
  const [duration, setDuration] = useState(initialDuration || "30");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formats = [
    { value: "hook-story-cta", label: "Hook > Story > CTA" },
    { value: "tutorial", label: "Quick Tutorial" },
    { value: "listicle", label: "Listicle / Tips" },
    { value: "before-after", label: "Before & After" },
    { value: "day-in-life", label: "Day in My Life" },
    { value: "trending", label: "Trending Audio Script" },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setScript("");
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), duration, format, platform: "instagram" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate script."); return; }
      setScript(data.script);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTopic?.trim()) handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Reel Scriptwriter</h3>

      <textarea rows={2}
        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none mb-2"
        placeholder="Reel topic..." value={topic} onChange={(e) => setTopic(e.target.value)} disabled={loading} />

      <div className="grid grid-cols-2 gap-2 mb-3">
        <select value={format} onChange={(e) => setFormat(e.target.value)}
          className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50">
          {formats.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
        </select>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}
          className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50">
          <option value="15">15s</option>
          <option value="30">30s</option>
          <option value="60">60s</option>
          <option value="90">90s</option>
        </select>
      </div>

      <Button size="sm" className="bg-brand hover:bg-brand/90 text-white gap-1.5 text-xs w-full mb-3"
        disabled={loading || !topic.trim()} onClick={handleGenerate}>
        {loading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" />Writing...</>) :
          (<><Sparkles className="w-3.5 h-3.5" />Generate Reel Script</>)}
      </Button>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {script && (
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Clapperboard className="w-3 h-3 text-brand" />Script
            </span>
            <button onClick={async () => { await navigator.clipboard.writeText(script); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="text-xs text-muted-foreground hover:text-foreground">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-xs text-foreground whitespace-pre-line leading-relaxed max-h-60 overflow-auto">{script}</p>
        </div>
      )}
    </div>
  );
}
