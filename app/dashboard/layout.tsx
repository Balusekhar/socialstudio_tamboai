"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/app/lib/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import TamboWrapper from "@/app/components/tambo/TamboWrapper";

// TamboChat uses useTamboVoice (Web Worker) — load only on client to avoid "Worker is not defined" during SSR
const TamboChat = dynamic(
  () => import("@/app/components/tambo/TamboChat").then((m) => m.default),
  { ssr: false }
);

interface User {
  name: string;
  email: string;
  $id: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser();
      if (result.success && result.data) {
        const list = result.data as { rows?: { $id: string; name?: string; email?: string }[] };
        const row = list.rows?.[0];
        if (row) {
          setUser({
            $id: row.$id,
            name: row.name ?? "",
            email: row.email ?? "",
          });
          setUserId(row.$id);
        } else {
          router.push("/auth");
        }
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
    <TamboWrapper userId={userId}>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          {/* Top Navbar - responsive: wrap on small, touch-friendly */}
          <header className="flex h-14 min-h-[56px] shrink-0 items-center border-b border-border px-3 sm:px-4 gap-2 flex-wrap sm:flex-nowrap">
            <SidebarTrigger className="-ml-1 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center sm:justify-start" />

            <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline truncate max-w-[120px] lg:max-w-[180px]">
                {user?.email}
              </span>
              <ThemeToggle />

              {/* Tambo Chat Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChatOpen(true)}
                className="gap-1.5 sm:gap-2 min-h-[40px] sm:min-h-0 px-2.5 sm:px-3"
              >
                <img
                  src="/tambo.png"
                  alt="Tambo AI"
                  className="w-4 h-4 rounded shrink-0"
                />
                <span className="hidden sm:inline">AI Chat</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 sm:gap-2 min-h-[40px] sm:min-h-0 px-2.5 sm:px-3"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          {/* Page Content - responsive padding */}
          <main className="flex-1 p-4 sm:p-6 min-w-0 overflow-x-auto">
            {children}
          </main>
        </SidebarInset>

        {/* Tambo Chat Panel */}
        <TamboChat open={chatOpen} onClose={() => setChatOpen(false)} />
      </SidebarProvider>
    </TamboWrapper>
  );
}
