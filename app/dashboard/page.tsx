"use client";

import { useEffect, useState } from "react";
import {
  Video,
  Subtitles,
  ImageIcon,
  AlignLeft,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/app/lib/auth";
import { listRows } from "@/app/lib/db";
import { Query } from "@/app/lib/appwrite";

interface StatCard {
  title: string;
  count: number;
  icon: React.ElementType;
  href: string;
  description: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
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
    {
      title: "Metadata Entries",
      count: 0,
      icon: AlignLeft,
      href: "/dashboard/metadata",
      description: "Descriptions & hashtags generated",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userResult = await getUser();
        if (!userResult.success || !userResult.data) return;

        const userId = userResult.data.rows[0].$id;
        setUserName(userResult.data.rows[0].name as string);

        // Fetch counts for videos and captions in parallel
        const [videosResult, captionsResult] = await Promise.all([
          listRows(process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_TABLE_ID!, [
            Query.equal("owner", userId),
          ]).catch(() => ({ total: 0 })),
          listRows(process.env.NEXT_PUBLIC_APPWRITE_CAPTIONS_TABLE_ID!, [
            Query.equal("owner", userId),
          ]).catch(() => ({ total: 0 })),
        ]);

        setStats((prev) =>
          prev.map((card) => {
            if (card.title === "Videos Uploaded")
              return { ...card, count: videosResult.total };
            if (card.title === "Captions Generated")
              return { ...card, count: captionsResult.total };
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      )}
    </div>
  );
}
