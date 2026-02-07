"use client";
import React, { useState } from "react";
import {
  Type,
  Image as ImageIcon,
  AlignLeft,
  Play,
  Calendar,
  Zap,
  Instagram,
  Youtube,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [thumbnails] = useState<string[]>([
    "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?auto=format&fit=crop&w=300&q=60",
    "https://images.unsplash.com/photo-1603126004251-d01882b9bfd3?auto=format&fit=crop&w=300&q=60",
    "https://plus.unsplash.com/premium_photo-1677171749349-6f38fab550b2?auto=format&fit=crop&w=300&q=60",
  ]);

  return (
    <section className="max-w-[1440px] mx-auto px-10 py-16">
      <div className="mb-12">
        <h2 className="text-[42px] lg:text-[52px] font-medium tracking-tight leading-[1.1] mb-2 text-foreground">
          Your AI workflow, <span className="text-muted-foreground">simplified.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Vertical Video Preview */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-[700px]">
          <div className="flex-1 bg-black rounded-[48px] relative overflow-hidden shadow-2xl group border-10 border-background ring-1 ring-border">
            <img
              src="https://images.unsplash.com/photo-1539109132314-34a9c6ee8929?auto=format&fit=crop&w=800&q=80"
              className="w-full h-full object-cover opacity-80"
              alt="Reel Preview"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-12">
              <div className="bg-yellow-400 text-black font-black text-3xl px-4 py-2 rotate-[-2deg] shadow-lg">
                VIRAL
              </div>
              <div className="bg-white text-black font-black text-4xl px-4 py-2 mt-2 rotate-[1deg] shadow-lg uppercase">
                Hooks
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div className="h-full w-2/3 bg-white rounded-full"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between px-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 20}`}
                    alt="avatar"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">Live Workspace</p>
          </div>
        </div>

        {/* Right Side: Bento Grid Features */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Card 1: AI Captions */}
          <div className="bg-card rounded-[40px] p-8 border border-border flex flex-col justify-between group hover:border-brand/30 transition-all shadow-sm h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm border border-border">
                  <Type className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Zap className="w-3 h-3" /> Real-time
                </div>
              </div>
              <h3 className="text-[22px] font-bold mb-3 tracking-tight text-foreground">
                AI Captions
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Synced subtitles with viral animation styles.
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-background p-4 rounded-xl border border-border text-[13px] font-medium text-foreground shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                &quot;The secret to growth is consistency...&quot;
              </div>
              <div className="bg-background p-4 rounded-xl border border-border text-[13px] font-medium text-muted-foreground shadow-sm flex items-center gap-3 opacity-60">
                <div className="w-2 h-2 rounded-full bg-muted"></div>
                &quot;Wait until you see the next part.&quot;
              </div>
            </div>
          </div>

          {/* Card 2: Thumbnails with AI Gen */}
          <div className="bg-card rounded-[40px] p-8 border border-border flex flex-col group hover:border-brand/30 transition-all shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm border border-border text-foreground">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-[22px] font-bold mb-1 tracking-tight text-foreground">
              Thumbnails
            </h3>
            <p className="text-muted-foreground text-sm mb-6 italic">
              Powered by Gemini Image 2.5
            </p>
            <div className="flex gap-2 mt-auto">
              {thumbnails.map((url, i) => (
                <div
                  key={i}
                  className="flex-1 aspect-[3/4] rounded-xl bg-muted overflow-hidden relative shadow-sm border border-border">
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt={`AI Option ${i}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: SEO Metadata */}
          <div className="bg-card rounded-[40px] p-8 border border-border flex flex-col group hover:border-brand/30 transition-all shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm border border-border text-foreground">
                <AlignLeft className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-[22px] font-bold mb-3 tracking-tight text-foreground">
              SEO Metadata
            </h3>
            <div className="bg-background rounded-2xl p-5 border border-border shadow-sm space-y-4 mt-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Viral Title
                </span>
                <p className="text-xs font-semibold text-foreground">
                  5 Secrets for Vertical Growth 🚀
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  AI Description
                </span>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  Stop scrolling! Today I am breaking down the workflow that
                  changed my reach forever...
                </p>
              </div>
              <div className="flex gap-1.5 pt-1">
                {["Growth", "Creator", "Reels"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Content Calendar */}
          <div className="bg-card rounded-[40px] p-8 border border-border flex flex-col group hover:border-brand/30 transition-all shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg text-primary-foreground">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex -space-x-1.5">
                <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center shadow-sm border border-border">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center shadow-sm border border-border">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                </div>
              </div>
            </div>
            <h3 className="text-[22px] font-bold mb-3 tracking-tight text-foreground">
              Content Calendar
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Automated multi-platform scheduling.
            </p>
            <div className="mt-auto space-y-2">
              <div className="bg-background p-3 rounded-xl border border-border flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center text-[10px] font-bold">
                    MON
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    Reel #1: Hook Tips
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">
                  09:00 AM
                </span>
              </div>
              <div className="bg-background p-3 rounded-xl border border-border flex items-center justify-between shadow-sm opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-lg flex items-center justify-center text-[10px] font-bold">
                    TUE
                  </div>
                  <span className="text-xs font-medium text-foreground">Reel #2: BTS</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">
                  12:30 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
