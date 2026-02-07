"use client";

import { useState, useRef } from "react";
import {
  Camera,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Upload,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PhotoCaptionsPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mood, setMood] = useState("casual");
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

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

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
    if (!image) {
      setError("Please upload a photo first.");
      return;
    }

    setLoading(true);
    setError("");
    setCaptions([]);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("mood", mood);

      const res = await fetch("/api/generate-photo-captions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate captions. Please try again.");
        return;
      }

      setCaptions(data.captions);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = async (caption: string, index: number) => {
    await navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Photo Captions
        </h1>
        <p className="text-muted-foreground">
          Upload a photo and let AI generate perfect Instagram captions tailored
          to your style and mood.
        </p>
      </div>

      {/* Upload & Settings */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-foreground text-sm mb-4">
          Upload Your Photo
        </h3>

        {/* Image Upload Area */}
        {!imagePreview ? (
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand/50 hover:bg-brand/5 transition-colors mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">
              Click to upload a photo
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WebP (max 10MB)
            </p>
          </div>
        ) : (
          <div className="relative mb-4 max-w-sm">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="w-full rounded-xl border border-border object-cover max-h-[300px]"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-7 h-7 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Mood Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Caption Mood
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full sm:w-auto text-sm bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            {moods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <Button
          className="bg-brand hover:bg-brand/90 text-white gap-2"
          onClick={handleGenerate}
          disabled={loading || !image}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Captions...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Captions
            </>
          )}
        </Button>
      </div>

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand" />
              Generated Captions
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
          <div className="space-y-3">
            {captions.map((caption, index) => (
              <div
                key={index}
                className="bg-muted rounded-lg p-4 flex items-start justify-between gap-3 group"
              >
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  {caption}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyCaption(caption, index)}
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
      {captions.length === 0 && !loading && (
        <div className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <Camera className="w-7 h-7 text-brand" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            No captions generated yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Upload a photo and select a mood to generate scroll-stopping
            Instagram captions with AI.
          </p>
        </div>
      )}
    </div>
  );
}
