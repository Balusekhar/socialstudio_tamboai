"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Subtitles,
  ImageIcon,
  AlignLeft,
  Calendar,
  LayoutDashboard,
  FileText,
  Camera,
  Palette,
  Clapperboard,
  BadgeCheck,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  $id: string;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "General",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Content Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    label: "YouTube",
    items: [
      {
        title: "Auto Captions",
        href: "/dashboard/captions",
        icon: Subtitles,
      },
      {
        title: "Thumbnail Designer",
        href: "/dashboard/thumbnail",
        icon: ImageIcon,
      },
      {
        title: "SEO Metadata",
        href: "/dashboard/metadata",
        icon: AlignLeft,
      },
      {
        title: "Script Writer",
        href: "/dashboard/script-writer",
        icon: FileText,
      },
    ],
  },
  {
    label: "Instagram",
    items: [
      {
        title: "Photo Captions",
        href: "/dashboard/photo-captions",
        icon: Camera,
      },
      {
        title: "Logo Creator",
        href: "/dashboard/logo-creator",
        icon: Palette,
      },
      {
        title: "Reel Scriptwriter",
        href: "/dashboard/reel-script",
        icon: Clapperboard,
      },
      {
        title: "Brand Name Generator",
        href: "/dashboard/brand-name",
        icon: BadgeCheck,
      },
    ],
  },
];

export function AppSidebar({ user }: { user: User | null }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] shrink-0 rounded-full border-[5px] border-brand flex items-center justify-center">
            <div className="w-[5px] h-[5px] bg-brand rounded-full"></div>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            Social Studio
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 rounded-full bg-brand/10 flex items-center justify-center text-brand font-semibold text-sm">
              {user.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
