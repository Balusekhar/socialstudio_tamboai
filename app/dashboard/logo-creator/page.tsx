"use client";

import { useState } from "react";
import {
  Palette,
  Sparkles,
  Loader2,
  Download,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoCreatorPage() {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("technology");
  const [style, setStyle] = useState("minimal");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoData, setLogoData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "fashion", label: "Fashion & Beauty" },
    { value: "food", label: "Food & Beverage" },
    { value: "fitness", label: "Fitness & Health" },
    { value: "creative", label: "Creative & Design" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ];

  const styles = [
    { value: "minimal", label: "Minimal" },
    { value: "bold", label: "Bold & Modern" },
    { value: "elegant", label: "Elegant" },
    { value: "playful", label: "Playful" },
    { value: "vintage", label: "Vintage" },
    { value: "geometric", label: "Geometric" },
  ];

  const handleGenerate = async () => {
    if (!brandName.trim()) {
      setError("Please enter your brand name.");
      return;
    }

    setLoading(true);
    setError("");
    setLogoUrl(null);
    setLogoData(null);

    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          industry,
          style,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate logo. Please try again.");
        return;
      }

      setLogoData(data.image.data);
      setLogoUrl(`data:${data.image.mimeType};base64,${data.image.data}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!logoData) return;
    const byteString = atob(logoData);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName.trim().toLowerCase().replace(/\s+/g, "-")}-logo.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Logo Creator
        </h1>
        <p className="text-muted-foreground">
          Design a professional brand logo for your Instagram presence using AI.
          Perfect for personal brands and businesses.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-foreground text-sm mb-4">
          Logo Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              placeholder="e.g. Stellar Studio"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
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
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full text-sm bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                {styles.map((s) => (
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
          disabled={loading || !brandName.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Designing Logo...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Logo
            </>
          )}
        </Button>
      </div>

      {/* Generated Logo */}
      {logoUrl && !loading && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-brand" />
            Your Brand Logo
          </h3>
          <div className="flex flex-col items-center">
            <div className="bg-muted rounded-xl border border-border p-8 mb-4">
              <img
                src={logoUrl}
                alt="Generated logo"
                className="max-w-[300px] max-h-[300px] object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleGenerate}
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-6">
          <div className="bg-muted rounded-xl border border-border p-12 flex flex-col items-center justify-center animate-pulse">
            <Palette className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">Designing your logo...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!logoUrl && !loading && (
        <div className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <Palette className="w-7 h-7 text-brand" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            No logo created yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Enter your brand name, pick an industry and style, then let AI
            design a professional logo for you.
          </p>
        </div>
      )}
    </div>
  );
}
