"use client";

import { useRef, useState } from "react";
import {
  Upload,
  X,
  FileVideo,
  Sparkles,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile, getFileUrl } from "@/app/lib/storage";
import { addRow } from "@/app/lib/db";
import { getUser, getErrorMessage } from "@/app/lib/auth";
import { transcribeVideo } from "@/app/lib/whisper";

const MAX_FILE_SIZE = 500 * 1024 * 1024;

export default function TamboCaptions() {
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
      setError("File size exceeds 500 MB.");
      return;
    }
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      const userResult = await getUser();
      if (!userResult.success || !userResult.data) {
        setError("You must be logged in to upload.");
        setLoading(false);
        return;
      }

      setStep("Generating captions...");
      const srt = await transcribeVideo(selectedFile);
      setSrtContent(srt);

      setStep("Uploading video...");
      const uploadedFile = await uploadFile(selectedFile, (p) => setProgress(p));
      const videoUrl = getFileUrl(uploadedFile.$id);

      setStep("Saving video...");
      const videoRow = await addRow(
        process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_TABLE_ID!,
        { owner: userResult.data.rows[0].$id, videoUrl, fileName: selectedFile.name }
      );

      setStep("Uploading captions...");
      const srtBlob = new Blob([srt], { type: "text/srt" });
      const srtFile = new File(
        [srtBlob],
        selectedFile.name.replace(/\.[^.]+$/, "") + ".srt",
        { type: "text/srt" }
      );
      const uploadedSrt = await uploadFile(srtFile);

      setStep("Saving captions...");
      const captionUrl = getFileUrl(uploadedSrt.$id);
      await addRow(process.env.NEXT_PUBLIC_APPWRITE_CAPTIONS_TABLE_ID!, {
        owner: userResult.data.rows[0].$id,
        video: videoRow.$id,
        captionUrl: String(captionUrl),
      });

      setSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setStep("");
      setProgress(0);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Auto Captions</h3>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />

      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg p-3 mb-3 text-xs font-medium">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          Captions generated and saved!
        </div>
      )}

      {!selectedFile ? (
        <div
          className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center text-center mb-3 hover:border-brand/40 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-6 h-6 text-brand mb-2" />
          <p className="text-xs text-muted-foreground mb-2">Upload video (MP4, MOV, WebM)</p>
          <Button type="button" size="sm" className="bg-brand hover:bg-brand/90 text-white text-xs"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Choose File
          </Button>
        </div>
      ) : (
        <div className="bg-muted border border-border rounded-lg p-3 mb-3 flex items-center gap-3">
          <FileVideo className="w-5 h-5 text-brand shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{selectedFile.name}</p>
            <p className="text-[10px] text-muted-foreground">{formatSize(selectedFile.size)}</p>
          </div>
          <button onClick={removeFile} disabled={loading} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {loading && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{step}</span>
            {progress > 0 && <span className="ml-auto">{progress}%</span>}
          </div>
          {progress > 0 && (
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      <Button
        size="sm"
        className="bg-brand hover:bg-brand/90 text-white gap-1.5 text-xs w-full"
        disabled={!selectedFile || loading}
        onClick={handleGenerate}
      >
        {loading ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" />{step || "Processing..."}</>
        ) : (
          <><Sparkles className="w-3.5 h-3.5" />Generate Captions</>
        )}
      </Button>

      {srtContent && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Generated SRT</span>
            <Button variant="outline" size="sm" className="text-[10px] h-6 px-2"
              onClick={() => {
                const blob = new Blob([srtContent], { type: "text/srt" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "captions.srt"; a.click();
                URL.revokeObjectURL(url);
              }}>
              Download SRT
            </Button>
          </div>
          <pre className="bg-muted border border-border rounded-lg p-3 text-[11px] text-foreground overflow-auto max-h-40 whitespace-pre-wrap">
            {srtContent}
          </pre>
        </div>
      )}
    </div>
  );
}
