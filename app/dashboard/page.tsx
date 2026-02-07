"use client";

import { useEffect, useState } from "react";
import {
  Video,
  Subtitles,
  ImageIcon,
  Loader2,
  ArrowRight,
  ExternalLink,
  Download,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/app/lib/auth";
import { listRows } from "@/app/lib/db";
import { Query } from "@/app/lib/appwrite";
import { Button } from "@/components/ui/button";

interface StatCard {
  title: string;
  count: number;
  icon: React.ElementType;
  href: string;
  description: string;
}

interface VideoRow {
  $id: string;
  $createdAt: string;
  fileName: string;
  videoUrl: string;
}

interface CaptionRow {
  $id: string;
  $createdAt: string;
  captionUrl: string;
  video: string;
}

interface ThumbnailRow {
  $id: string;
  $createdAt: string;
  thumbnailUrl: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [captions, setCaptions] = useState<CaptionRow[]>([]);
  const [thumbnails, setThumbnails] = useState<ThumbnailRow[]>([]);
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Videos Uploaded",
      count: 0,
      icon: Video,
      href: "/dashboard/captions",
      description: "Total videos you've uploaded",
    },
    {
      title: "Captions Generated",
      count: 0,
      icon: Subtitles,
      href: "/dashboard/captions",
      description: "Subtitles generated from your videos",
    },
    {
      title: "Thumbnails Created",
      count: 0,
      icon: ImageIcon,
      href: "/dashboard/thumbnail",
      description: "Custom thumbnails for your reels",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userResult = await getUser();
        if (!userResult.success || !userResult.data) return;

        const userId = userResult.data.rows[0].$id;
        setUserName(userResult.data.rows[0].name as string);

        const [videosResult, captionsResult, thumbnailsResult] =
          await Promise.all([
            listRows(process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_TABLE_ID!, [
              Query.equal("owner", userId),
              Query.orderDesc("$createdAt"),
            ]).catch(() => ({ total: 0, rows: [] })),
            listRows(process.env.NEXT_PUBLIC_APPWRITE_CAPTIONS_TABLE_ID!, [
              Query.equal("owner", userId),
              Query.orderDesc("$createdAt"),
            ]).catch(() => ({ total: 0, rows: [] })),
            listRows(process.env.NEXT_PUBLIC_APPWRITE_THUMBNAILS_TABLE_ID!, [
              Query.equal("owner", userId),
              Query.orderDesc("$createdAt"),
            ]).catch(() => ({ total: 0, rows: [] })),
          ]);

        const vRows = (videosResult as { total: number; rows: VideoRow[] })
          .rows ?? [];
        const cRows = (captionsResult as { total: number; rows: CaptionRow[] })
          .rows ?? [];
        const tRows = (
          thumbnailsResult as { total: number; rows: ThumbnailRow[] }
        ).rows ?? [];

        setVideos(vRows);
        setCaptions(cRows);
        setThumbnails(tRows);

        setStats((prev) =>
          prev.map((card) => {
            if (card.title === "Videos Uploaded")
              return { ...card, count: videosResult.total };
            if (card.title === "Captions Generated")
              return { ...card, count: captionsResult.total };
            if (card.title === "Thumbnails Created")
              return { ...card, count: thumbnailsResult.total };
            return card;
          }),
        );
      } catch {
        // silently fail – cards stay at 0
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Overview
        </h1>
        <p className="text-muted-foreground">
          {userName
            ? `Welcome back, ${userName}. Here's a snapshot of your studio.`
            : "Welcome to your studio. Here's a snapshot of your activity."}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group bg-card border border-border rounded-2xl p-5 hover:border-brand/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-brand" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {card.count}
                </p>
                <p className="text-sm font-medium text-foreground mb-0.5">
                  {card.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Videos Section */}
          <Section
            title="Videos"
            icon={Video}
            href="/dashboard/captions"
            count={videos.length}
          >
            {videos.length === 0 ? (
              <EmptyState message="No videos uploaded yet." />
            ) : (
              <div className="divide-y divide-border">
                {videos.map((v) => (
                  <div
                    key={v.$id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="w-9 h-9 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {v.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(v.$createdAt)}
                      </p>
                    </div>
                    <a
                      href={v.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Captions Section */}
          <Section
            title="Captions (SRT)"
            icon={Subtitles}
            href="/dashboard/captions"
            count={captions.length}
          >
            {captions.length === 0 ? (
              <EmptyState message="No captions generated yet." />
            ) : (
              <div className="divide-y divide-border">
                {captions.map((c) => (
                  <div
                    key={c.$id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="w-9 h-9 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Caption file
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(c.$createdAt)}
                      </p>
                    </div>
                    <a
                      href={c.captionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Thumbnails Section */}
          <Section
            title="Thumbnails"
            icon={ImageIcon}
            href="/dashboard/thumbnail"
            count={thumbnails.length}
          >
            {thumbnails.length === 0 ? (
              <EmptyState message="No thumbnails created yet." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {thumbnails.map((t) => (
                  <a
                    key={t.$id}
                    href={t.thumbnailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-video bg-muted rounded-xl overflow-hidden border border-border hover:border-brand/40 transition-colors"
                  >
                    <img
                      src={t.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="absolute bottom-1.5 left-2 text-[10px] text-white/70 bg-black/50 px-1.5 py-0.5 rounded">
                      {formatDate(t.$createdAt)}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  href,
  count,
  children,
}: {
  title: string;
  icon: React.ElementType;
  href: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand" />
          <h2 className="text-sm font-semibold text-foreground">
            {title}
            <span className="ml-1.5 text-muted-foreground font-normal">
              ({count})
            </span>
          </h2>
        </div>
        <Link
          href={href}
          className="text-xs text-brand hover:text-brand/80 font-medium"
        >
          View all
        </Link>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        {children}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-sm text-muted-foreground text-center py-6">{message}</p>
  );
}
