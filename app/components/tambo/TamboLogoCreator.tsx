"use client";

import { useState, useEffect } from "react";
import { Palette, Sparkles, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TamboLogoCreatorProps {
  brandName?: string;
  industry?: string;
  style?: string;
}

export default function TamboLogoCreator({ brandName: initialBrand, industry: initialIndustry, style: initialStyle }: TamboLogoCreatorProps) {
  const [brandName, setBrandName] = useState(initialBrand || "");
  const [industry, setIndustry] = useState(initialIndustry || "technology");
  const [style, setStyle] = useState(initialStyle || "minimal");
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
    if (!brandName.trim()) return;
    setLoading(true);
    setError("");
    setLogoUrl(null);
    setLogoData(null);
    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName: brandName.trim(), industry, style }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate logo."); return; }
      setLogoData(data.image.data);
      setLogoUrl(`data:${data.image.mimeType};base64,${data.image.data}`);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialBrand?.trim()) handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (!logoData) return;
    const byteString = atob(logoData);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName.trim().toLowerCase().replace(/\s+/g, "-")}-logo.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Logo Creator</h3>

      <input type="text" placeholder="Brand name..." value={brandName}
        onChange={(e) => setBrandName(e.target.value)} disabled={loading}
        className="w-full text-xs bg-muted border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 mb-2" />

      <div className="grid grid-cols-2 gap-2 mb-3">
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}
          className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50">
          {industries.map((i) => (<option key={i.value} value={i.value}>{i.label}</option>))}
        </select>
        <select value={style} onChange={(e) => setStyle(e.target.value)}
          className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50">
          {styles.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
        </select>
      </div>

      <Button size="sm" className="bg-brand hover:bg-brand/90 text-white gap-1.5 text-xs w-full mb-3"
        disabled={loading || !brandName.trim()} onClick={handleGenerate}>
        {loading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" />Designing...</>) :
          (<><Sparkles className="w-3.5 h-3.5" />Generate Logo</>)}
      </Button>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {loading && (
        <div className="bg-muted rounded-lg border border-border p-6 flex flex-col items-center animate-pulse mb-3">
          <Palette className="w-8 h-8 text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground">Designing your logo...</p>
        </div>
      )}

      {logoUrl && !loading && (
        <div>
          <div className="bg-muted rounded-lg border border-border p-4 flex items-center justify-center mb-2">
            <img src={logoUrl} alt="Generated logo" className="max-w-[200px] max-h-[200px] object-contain" />
          </div>
          <Button size="sm" variant="outline" className="gap-1 text-xs w-full" onClick={handleDownload}>
            <Download className="w-3 h-3" />Download PNG
          </Button>
        </div>
      )}
    </div>
  );
}
