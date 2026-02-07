"use client";

import { useRef, useState } from "react";
import { Upload, X, FileVideo, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile, getFileUrl } from "@/app/lib/storage";
import { addRow } from "@/app/lib/db";
import { getUser, getErrorMessage } from "@/app/lib/auth";
import { transcribeVideo } from "@/app/lib/whisper";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

export default function CaptionsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [srtContent, setSrtContent] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess(false);
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
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setError("");
    setLoading(true);
    setStep("Generating captions...");
    setProgress(0);
    setSuccess(false);
    setSrtContent("");

    try {
      // Get current user
      const userResult = await getUser();
      if (!userResult.success || !userResult.data) {
        setError("You must be logged in to upload.");
        setLoading(false);
        return;
      }

      // Step 1: Generate SRT via Whisper API
      setStep("Generating captions...");
      const srt = await transcribeVideo(selectedFile);
      setSrtContent(srt);

      // Step 2: Upload file to Appwrite storage
      setStep("Uploading video...");
      const uploadedFile = await uploadFile(selectedFile, (p) => setProgress(p));

      // Step 3: Build the public video URL
      const videoUrl = getFileUrl(uploadedFile.$id);

      // Step 4: Save row in the videos table
      setStep("Saving to database...");
      await addRow(process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_TABLE_ID!, {
        owner: userResult.data.rows[0].$id,
        videoUrl,
        fileName: selectedFile.name,
      });

      setSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setStep("");
      setProgress(0);
    }
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

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl p-4 mb-6 text-sm font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Video uploaded and saved successfully!
        </div>
      )}

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
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {/* Step & progress indicator */}
      {loading && (
        <div className="mb-4 max-w-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{step}</span>
            {progress > 0 && <span className="ml-auto">{progress}%</span>}
          </div>
          {progress > 0 && (
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Generate Button */}
      <Button
        className="bg-brand hover:bg-brand/90 text-white gap-2"
        disabled={!selectedFile || loading}
        onClick={handleGenerate}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {step || "Processing..."}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate
          </>
        )}
      </Button>

      {/* SRT Output */}
      {srtContent && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Generated Captions (SRT)
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => {
                const blob = new Blob([srtContent], { type: "text/srt" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "captions.srt";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download SRT
            </Button>
          </div>
          <pre className="bg-muted border border-border rounded-xl p-4 text-sm text-foreground overflow-auto max-h-80 whitespace-pre-wrap">
            {srtContent}
          </pre>
        </div>
      )}
    </div>
  );
}
