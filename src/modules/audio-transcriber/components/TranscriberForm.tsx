"use client";

import { useState } from "react";
import {
  Link2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Cpu,
  Video,
  Flame,
  GraduationCap,
  Briefcase,
  Languages,
} from "lucide-react";
import { AmharicTone } from "../types";

interface TranscriberFormProps {
  onSubmit: (
    url: string,
    provider: "openai" | "groq" | "gemini" | "mock",
    tone: AmharicTone
  ) => Promise<void>;
  isLoading: boolean;
}

export function TranscriberForm({ onSubmit, isLoading }: TranscriberFormProps) {
  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState<
    "openai" | "groq" | "gemini" | "mock"
  >("gemini");
  const [tone, setTone] = useState<AmharicTone>("creator");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please enter a TikTok video URL or embed code.");
      return;
    }

    try {
      await onSubmit(url.trim(), provider, tone);
    } catch (err: any) {
      setError(err?.message || "Failed to start extraction");
    }
  };

  const setSampleUrl = (sample: string) => {
    setUrl(sample);
    setError(null);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-400" />
            Media Input
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Submit a direct TikTok URL, mobile short link, or HTML embed code.
          </p>
        </div>

        {/* Engine selector */}
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-lg p-1">
          <Cpu className="h-4 w-4 text-slate-400 ml-2" />
          <select
            value={provider}
            onChange={(e) =>
              setProvider(
                e.target.value as "openai" | "groq" | "gemini" | "mock"
              )
            }
            disabled={isLoading}
            className="bg-transparent text-xs text-slate-200 font-medium py-1 px-2 focus:outline-none cursor-pointer"
          >
            <option value="gemini" className="bg-slate-900 text-slate-200">
              Google Gemini (gemini-3.8-flash)
            </option>
            <option value="mock" className="bg-slate-900 text-slate-200">
              Mock Engine (Instant / Offline)
            </option>
            <option value="groq" className="bg-slate-900 text-slate-200">
              Groq Whisper (whisper-large-v3)
            </option>
            <option value="openai" className="bg-slate-900 text-slate-200">
              OpenAI Whisper (whisper-1)
            </option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            TikTok Video Link or Embed Snippet
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Link2 className="h-5 w-5" />
            </div>
            <textarea
              rows={3}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              disabled={isLoading}
              placeholder="e.g. https://www.tiktok.com/@username/video/1234567890 or https://vm.tiktok.com/ZM... or <blockquote class='tiktok-embed' cite='...'>"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all resize-none"
            />
          </div>
          {error && (
            <p className="mt-2 text-xs font-medium text-rose-400 flex items-center gap-1.5">
              <span>⚠️</span> {error}
            </p>
          )}
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            Try sample:
          </span>
          <button
            type="button"
            onClick={() =>
              setSampleUrl(
                "https://www.tiktok.com/@garyvee/video/7300000000000000000"
              )
            }
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            Direct URL
          </button>
          <button
            type="button"
            onClick={() => setSampleUrl("https://vm.tiktok.com/ZM8abc123/")}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            Short Link (vm.tiktok)
          </button>
          <button
            type="button"
            onClick={() =>
              setSampleUrl(
                '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@creator/video/7200112233445566778"></blockquote>'
              )
            }
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            Embed Snippet
          </button>
        </div>

        {/* Amharic Tone & Style Selection */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Languages className="h-4 w-4" />
              Amharic Script Localization Style (የአማርኛ ስክሪፕት አቀራረብ)
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Two-step AI localization
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setTone("creator")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                tone === "creator"
                  ? "bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/60 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame
                  className={`h-4 w-4 ${
                    tone === "creator" ? "text-amber-400" : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    tone === "creator" ? "text-amber-200" : "text-slate-300"
                  }`}
                >
                  Conversational Creator
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 font-medium">
                ፈጣሪ / ማራኪ አቀራረብ
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Fast hooks, lively Addis Ababa conversational rhythm, perfect for TikTok & Reels.
              </p>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setTone("educational")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                tone === "educational"
                  ? "bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-transparent border-sky-500/60 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/40"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap
                  className={`h-4 w-4 ${
                    tone === "educational" ? "text-sky-400" : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    tone === "educational" ? "text-sky-200" : "text-slate-300"
                  }`}
                >
                  Informative / Educational
                </span>
              </div>
              <p className="text-[11px] text-sky-300/80 font-medium">
                ትምህርታዊ / ማብራሪያ
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Clear concepts breakdown, friendly educational Amharic, structured explanation.
              </p>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setTone("formal")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                tone === "formal"
                  ? "bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent border-purple-500/60 shadow-md shadow-purple-500/10 ring-1 ring-purple-500/40"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Briefcase
                  className={`h-4 w-4 ${
                    tone === "formal" ? "text-purple-400" : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    tone === "formal" ? "text-purple-200" : "text-slate-300"
                  }`}
                >
                  Formal / Professional
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80 font-medium">
                መደበኛ / ቢዝነስ
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Respectful broadcast grade, polished phrasing for business and corporate delivery.
              </p>
            </button>
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Extract Audio & Localize to Amharic</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
