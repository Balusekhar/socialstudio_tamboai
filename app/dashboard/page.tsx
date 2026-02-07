"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, logout } from "@/app/lib/auth";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Upload, Subtitles, ImageIcon, Calendar } from "lucide-react";

interface User {
  name: string;
  email: string;
  $id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser();
      if (result.success && result.data) {
        setUser(result.data as User);
      } else {
        router.push("/auth");
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-full border-[5px] border-brand flex items-center justify-center">
              <div className="w-[5px] h-[5px] bg-brand rounded-full"></div>
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              IG Studio
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name?.split(" ")[0] ?? "Creator"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your studio at a glance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Upload Reel",
              description: "Drag & drop your video to get started",
              icon: Upload,
            },
            {
              title: "AI Captions",
              description: "Generate subtitles from your audio",
              icon: Subtitles,
            },
            {
              title: "Thumbnails",
              description: "Create eye-catching cover images",
              icon: ImageIcon,
            },
            {
              title: "Schedule",
              description: "Plan your content calendar",
              icon: Calendar,
            },
          ].map((action) => (
            <div
              key={action.title}
              className="bg-card border border-border rounded-2xl p-6 hover:border-brand/30 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                <action.icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">
              No reels yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Upload your first reel to start generating captions, thumbnails,
              and descriptions with AI.
            </p>
            <Button className="mt-6 bg-brand hover:bg-brand/90 text-white gap-2">
              <Upload className="w-4 h-4" />
              Upload your first reel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
