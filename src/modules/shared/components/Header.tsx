"use client";

import { usePathname } from "next/navigation";
import { Sparkles, Terminal } from "lucide-react";

export function Header() {
  const pathname = usePathname();

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
    <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-8 py-5 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          {getTitle()}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{getSubtitle()}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Terminal className="h-3.5 w-3.5 text-purple-400" />
          <span>App Router Modular Monolith</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Whisper AI</span>
        </div>
      </div>
    </header>
  );
}
