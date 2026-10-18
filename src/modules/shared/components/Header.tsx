"use client";

import { usePathname } from "next/navigation";
import { Sparkles, Terminal, Menu } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export function Header() {
  const pathname = usePathname();
  const { toggle } = useSidebar();

  const getTitle = () => {
    if (pathname.includes("/history")) return "Transcription History";
    return "Audio Extractor & English Transcription";
  };

  const getSubtitle = () => {
    if (pathname.includes("/history"))
      return "Review, export, and manage your previous audio extraction jobs.";
    return "Extract high-fidelity audio tracks from TikTok videos and transcribe speech into English.";
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-3.5 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle navigation menu"
          className="p-2 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/80 md:hidden cursor-pointer flex-shrink-0 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-lg md:text-xl font-bold tracking-tight text-white truncate">
            {getTitle()}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate hidden sm:block">
            {getSubtitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Terminal className="h-3.5 w-3.5 text-purple-400" />
          <span>App Router Modular Monolith</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] sm:text-xs text-purple-300 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Whisper AI</span>
        </div>
      </div>
    </header>
  );
}
