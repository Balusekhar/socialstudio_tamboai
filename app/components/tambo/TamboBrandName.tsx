"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandSuggestion {
  name: string;
  tagline: string;
  available: boolean;
}

interface TamboBrandNameProps {
  keywords?: string;
  industry?: string;
  nameStyle?: string;
}

export default function TamboBrandName({ keywords: initialKeywords, industry: initialIndustry, nameStyle: initialStyle }: TamboBrandNameProps) {
  const [keywords, setKeywords] = useState(initialKeywords || "");
  const [industry, setIndustry] = useState(initialIndustry || "technology");
  const [nameStyle, setNameStyle] = useState(initialStyle || "modern");
  const [suggestions, setSuggestions] = useState<BrandSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "fashion", label: "Fashion & Beauty" },
    { value: "food", label: "Food & Beverage" },
    { value: "fitness", label: "Fitness & Health" },
    { value: "creative", label: "Creative & Design" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "education", label: "Education" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "other", label: "Other" },
  ];

  const nameStyles = [
    { value: "modern", label: "Modern & Sleek" },
    { value: "playful", label: "Playful & Fun" },
    { value: "professional", label: "Professional" },
    { value: "abstract", label: "Abstract" },
    { value: "descriptive", label: "Descriptive" },
    { value: "short", label: "Short & Punchy" },
  ];

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const res = await fetch("/api/generate-brand-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: keywords.trim(), industry, nameStyle }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate names."); return; }
      setSuggestions(data.suggestions);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialKeywords?.trim()) handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Brand Name Generator</h3>

      <textarea rows={2}
        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none mb-2"
        placeholder="Describe your brand or enter keywords..." value={keywords} onChange={(e) => setKeywords(e.target.value)} disabled={loading} />

      <div className="grid grid-cols-2 gap-2 mb-3">
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}
          className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50">
          {industries.map((i) => (<option key={i.value} value={i.value}>{i.label}</option>))}
        </select>
        <select value={nameStyle} onChange={(e) => setNameStyle(e.target.value)}
          className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50">
          {nameStyles.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
        </select>
      </div>

      <Button size="sm" className="bg-brand hover:bg-brand/90 text-white gap-1.5 text-xs w-full mb-3"
        disabled={loading || !keywords.trim()} onClick={handleGenerate}>
        {loading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>) :
          (<><Sparkles className="w-3.5 h-3.5" />Generate Names</>)}
      </Button>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            <BadgeCheck className="w-3 h-3 text-brand" />Suggestions
          </span>
          {suggestions.map((s, index) => (
            <div key={index} className="bg-muted rounded-lg p-2 flex items-start justify-between gap-2 group">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">{s.tagline}</p>
              </div>
              <button onClick={async () => { await navigator.clipboard.writeText(s.name); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000); }}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                {copiedIndex === index ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
