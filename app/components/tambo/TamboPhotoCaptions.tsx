"use client";

import { useState, useRef } from "react";
import { Camera, Sparkles, Loader2, Copy, Check, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TamboPhotoCaptionsProps {
  mood?: string;
}

export default function TamboPhotoCaptions({ mood: initialMood }: TamboPhotoCaptionsProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mood, setMood] = useState(initialMood || "casual");
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const moods = [
    { value: "casual", label: "Casual" },
    { value: "aesthetic", label: "Aesthetic" },
    { value: "witty", label: "Witty" },
    { value: "inspirational", label: "Inspirational" },
    { value: "professional", label: "Professional" },
    { value: "humorous", label: "Humorous" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload a valid image."); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
    setCaptions([]);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setCaptions([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!image) { setError("Please upload a photo first."); return; }
    setLoading(true);
    setError("");
    setCaptions([]);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("mood", mood);
      const res = await fetch("/api/generate-photo-captions", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate captions."); return; }
      setCaptions(data.captions);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Photo Captions</h3>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      {!imagePreview ? (
        <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:border-brand/50 transition-colors mb-3"
          onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-5 h-5 text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Click to upload a photo</p>
        </div>
      ) : (
        <div className="relative mb-3">
          <img src={imagePreview} alt="Preview" className="w-full rounded-lg border border-border object-cover max-h-[150px]" />
          <button onClick={removeImage}
            className="absolute top-1 right-1 w-5 h-5 bg-background/80 backdrop-blur rounded-full flex items-center justify-center">
            <X className="w-3 h-3 text-foreground" />
          </button>
        </div>
      )}

      <select value={mood} onChange={(e) => setMood(e.target.value)}
        className="w-full text-xs bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground mb-3 focus:outline-none focus:ring-2 focus:ring-brand/50">
        {moods.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
      </select>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <Button size="sm" className="bg-brand hover:bg-brand/90 text-white gap-1.5 text-xs w-full mb-3"
        onClick={handleGenerate} disabled={loading || !image}>
        {loading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>) :
          (<><Sparkles className="w-3.5 h-3.5" />Generate Captions</>)}
      </Button>

      {captions.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Camera className="w-3 h-3 text-brand" />Captions
          </span>
          {captions.map((caption, index) => (
            <div key={index} className="bg-muted rounded-lg p-2 flex items-start justify-between gap-2 group">
              <p className="text-xs text-foreground leading-relaxed flex-1">{caption}</p>
              <button onClick={async () => { await navigator.clipboard.writeText(caption); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000); }}
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
