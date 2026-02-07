"use client";

import { useRef, useState } from "react";
import { Upload, X, FileVideo, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

const languages = [
  { value: "en", label: "English" },
  { value: "te", label: "Telugu" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
];

export default function CaptionsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a video file (MP4, MOV, or WebM).");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 500 MB. Please choose a smaller file.");
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Captions
        </h1>
        <p className="text-muted-foreground">
          Generate subtitles and captions from your reel audio automatically.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Area */}
      {!selectedFile ? (
        <div
          className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center mb-6 hover:border-brand/40 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-brand" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            Upload a video to generate captions
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Drag and drop your reel here, or click to browse. We support MP4,
            MOV, and WebM formats (max 500 MB).
          </p>
          <Button
            type="button"
            className="bg-brand hover:bg-brand/90 text-white"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose File
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
            <FileVideo className="w-6 h-6 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatSize(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={removeFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {/* Language Select */}
      <div className="mb-6 max-w-sm">
        <Label htmlFor="language" className="text-sm font-medium text-foreground mb-2 block">
          Translate to
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language" className="w-full">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Generate Button */}
      <Button
        className="bg-brand hover:bg-brand/90 text-white gap-2"
        disabled={!selectedFile || !language}
      >
        <Sparkles className="w-4 h-4" />
        Generate
      </Button>
    </div>
  );
}
