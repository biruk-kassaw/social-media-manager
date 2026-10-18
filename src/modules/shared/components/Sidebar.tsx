"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  Clock,
  Sparkles,
  TrendingUp,
  Layers,
  Flame,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../context/SidebarContext";

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

function SidebarNavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="overflow-y-auto">
        {/* Brand header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link
            href="/audio-transcriber"
            onClick={onClose}
            className="flex items-center gap-3"
          >
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

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors md:hidden cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
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
                    onClick={onClose}
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
    </div>
  );
}

export function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNavContent onClose={close} />
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 bg-slate-950/70 backdrop-blur-xl flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-20">
        <SidebarNavContent />
      </aside>
    </>
  );
}
