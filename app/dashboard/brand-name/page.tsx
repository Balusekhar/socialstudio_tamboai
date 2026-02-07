"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Sparkles,
  Loader2,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandSuggestion {
  name: string;
  tagline: string;
  available: boolean;
}

export default function BrandNamePage() {
  const [keywords, setKeywords] = useState("");
  const [industry, setIndustry] = useState("technology");
  const [nameStyle, setNameStyle] = useState("modern");
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
    { value: "abstract", label: "Abstract / Made-up" },
    { value: "descriptive", label: "Descriptive" },
    { value: "short", label: "Short & Punchy" },
  ];

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      setError("Please describe your brand or enter keywords.");
      return;
    }

    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const res = await fetch("/api/generate-brand-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords.trim(),
          industry,
          nameStyle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate names. Please try again.");
        return;
      }

      setSuggestions(data.suggestions);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyName = async (name: string, index: number) => {
    await navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Brand Name Generator
        </h1>
        <p className="text-muted-foreground">
          Discover the perfect brand name for your business or personal brand.
          AI generates unique, memorable names with taglines.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-foreground text-sm mb-4">
          Tell Us About Your Brand
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Keywords & Description
            </label>
            <textarea
              placeholder="e.g. sustainable fashion, eco-friendly clothing for millennials, organic materials, minimalist aesthetic"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={3}
              className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                {industries.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Name Style
              </label>
              <select
                value={nameStyle}
                onChange={(e) => setNameStyle(e.target.value)}
                className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                {nameStyles.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
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
          disabled={loading || !keywords.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Names...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Brand Names
            </>
          )}
        </Button>
      </div>

      {/* Generated Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-brand" />
              Name Suggestions
            </h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-muted rounded-lg p-4 flex items-start justify-between gap-3 group hover:ring-2 hover:ring-brand/20 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground mb-1">
                    {suggestion.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.tagline}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyName(suggestion.name, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && !loading && (
        <div className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <BadgeCheck className="w-7 h-7 text-brand" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            No names generated yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Describe your brand, pick an industry and style, then let AI suggest
            unique brand names with taglines.
          </p>
        </div>
      )}
    </div>
  );
}
