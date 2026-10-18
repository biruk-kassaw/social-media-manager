"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  Video,
  Layers,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
}

const mainNav: NavItem[] = [
  {
    name: "Audio Transcriber",
    href: "/audio-transcriber",
    icon: AudioLines,
  },
  {
    name: "Transcription History",
    href: "/history",
    icon: Clock,
  },
];

const futureModules: NavItem[] = [
  {
    name: "Trend Intelligence",
    href: "#",
    icon: TrendingUp,
    badge: "Roadmap",
    disabled: true,
  },
  {
    name: "Amharic Script AI",
    href: "#",
    icon: Sparkles,
    badge: "Roadmap",
    disabled: true,
  },
  {
    name: "Content Ideation",
    href: "#",
    icon: Flame,
    badge: "Roadmap",
    disabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800/80">
          <Link href="/audio-transcriber" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                CreatorStudio
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  v1.0
                </span>
              </h1>
              <p className="text-xs text-slate-400">Content Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-3 py-5 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Active Tools
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/audio-transcriber" && pathname === "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                      isActive
                        ? "bg-purple-600/15 text-purple-200 border border-purple-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-purple-400"
                          : "text-slate-400 group-hover:text-slate-200"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Modular Extensions
            </div>
            <div className="space-y-1">
              {futureModules.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed select-none"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">
            Next.js Modular Monolith
          </span>
        </div>
      </div>
    </aside>
  );
}
