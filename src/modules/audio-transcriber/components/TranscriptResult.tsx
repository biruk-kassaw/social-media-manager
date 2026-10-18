"use client";

import { useState } from "react";
import { TranscriptionResult, AudioMetadata } from "../types";
import { formatDuration } from "@/lib/utils";
import {
  Copy,
  Check,
  Download,
  FileText,
  Clock,
  Sparkles,
  Layers,
  CheckCircle,
  Languages,
} from "lucide-react";

interface TranscriptResultProps {
  result: TranscriptionResult;
  metadata?: AudioMetadata;
}

export function TranscriptResult({ result, metadata }: TranscriptResultProps) {
  // Default to Amharic if available, otherwise text
  const [activeTab, setActiveTab] = useState<"amharic" | "english" | "segments">(
    result.amharicText ? "amharic" : "english"
  );
  const [segmentLang, setSegmentLang] = useState<"amharic" | "english">(
    result.amharicSegments ? "amharic" : "english"
  );
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const englishWordCount = result.text.split(/\s+/).filter(Boolean).length;
  const amharicWordCount = result.amharicText
    ? result.amharicText.split(/\s+/).filter(Boolean).length
    : 0;

  const handleCopy = async (textToCopy: string, tabKey: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedTab(tabKey);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const title = metadata?.title || "tiktok_transcript";
    const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50)}_amharic_english.txt`;

    let content = `=====================================================\n`;
    content += `Title: ${metadata?.title || "TikTok Audio"}\n`;
    content += `Author: ${metadata?.author || "Creator"}\n`;
    content += `Engine: ${result.provider} (${result.model || "default"})\n`;
    content += `Generated: ${result.completedAt}\n`;
    content += `=====================================================\n\n`;

    if (result.amharicText) {
      content += `🇪🇹 AMHARIC TRANSLATION (የአማርኛ ትርጉም)\n`;
      content += `-----------------------------------------------------\n`;
      content += `${result.amharicText}\n\n`;
    }

    content += `🇬🇧 ENGLISH TRANSCRIPTION\n`;
    content += `-----------------------------------------------------\n`;
    content += `${result.text}\n\n`;

    if (result.amharicSegments && result.amharicSegments.length > 0) {
      content += `-----------------------------------------------------\n`;
      content += `AMHARIC TIMESTAMPS (የጊዜ ማሳያ ክፍሎች):\n`;
      content += `-----------------------------------------------------\n`;
      result.amharicSegments.forEach((seg) => {
        content += `[${seg.start}s - ${seg.end}s] ${seg.text}\n`;
      });
      content += `\n`;
    }

    if (result.segments && result.segments.length > 0) {
      content += `-----------------------------------------------------\n`;
      content += `ENGLISH TIMESTAMPS:\n`;
      content += `-----------------------------------------------------\n`;
      result.segments.forEach((seg) => {
        content += `[${seg.start}s - ${seg.end}s] ${seg.text}\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentDisplaySegments =
    segmentLang === "amharic" && result.amharicSegments
      ? result.amharicSegments
      : result.segments;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header with badges and meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Languages className="h-5 w-5 text-purple-400" />
              Content Result
            </h3>

            {result.amharicText && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 font-semibold flex items-center gap-1">
                <span>🇪🇹</span>
                <span>አማርኛ ትርጉም (Amharic)</span>
              </span>
            )}

            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              English Transcript
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
            {result.amharicText && (
              <>
                <span className="text-amber-300/80 font-medium">
                  {amharicWordCount} Amharic words
                </span>
                <span>•</span>
              </>
            )}
            <span>{englishWordCount} English words</span>
            <span>•</span>
            <span className="text-purple-300 font-medium">
              Engine: {result.provider}
            </span>
          </p>
        </div>

        {/* Global Export Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 border border-purple-500/30 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download All (.txt)</span>
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1">
          {result.amharicText && (
            <button
              type="button"
              onClick={() => setActiveTab("amharic")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "amharic"
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <span>🇪🇹</span>
              <span>Amharic (አማርኛ)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("english")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "english"
                ? "bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <span>🇬🇧</span>
            <span>English Transcript</span>
          </button>

          {(result.segments?.length || result.amharicSegments?.length) ? (
            <button
              type="button"
              onClick={() => setActiveTab("segments")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "segments"
                  ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Timestamped Segments</span>
            </button>
          ) : null}
        </div>

        {/* Quick copy for active tab */}
        {activeTab === "amharic" && result.amharicText && (
          <button
            type="button"
            onClick={() => handleCopy(result.amharicText!, "amharic")}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-200 text-xs font-medium border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer mr-1"
          >
            {copiedTab === "amharic" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied Amharic!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Amharic (አማርኛ)</span>
              </>
            )}
          </button>
        )}

        {activeTab === "english" && (
          <button
            type="button"
            onClick={() => handleCopy(result.text, "english")}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer mr-1"
          >
            {copiedTab === "english" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied English!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy English</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "amharic" && result.amharicText && (
        <div className="space-y-3">
          <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-6 font-sans leading-relaxed text-amber-50/95 text-base sm:text-lg whitespace-pre-wrap select-text shadow-inner">
            {result.amharicText}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>✨</span>
            <span>
              Translated by Google Gemini AI into natural Amharic script (ፊደል).
            </span>
          </p>
        </div>
      )}

      {activeTab === "english" && (
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 font-sans leading-relaxed text-slate-200 text-sm whitespace-pre-wrap select-text">
          {result.text}
        </div>
      )}

      {activeTab === "segments" && (
        <div className="space-y-3">
          {/* Sub-selector for segment language if both exist */}
          {result.amharicSegments && result.segments && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pb-1">
              <span>Segment language:</span>
              <button
                type="button"
                onClick={() => setSegmentLang("amharic")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  segmentLang === "amharic"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                አማርኛ (Amharic)
              </button>
              <button
                type="button"
                onClick={() => setSegmentLang("english")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  segmentLang === "english"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                English
              </button>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {currentDisplaySegments?.map((seg) => (
              <div
                key={seg.id}
                className="flex items-start gap-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-sm hover:border-slate-700 transition-colors"
              >
                <span className="font-mono text-xs text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 flex-shrink-0">
                  {seg.start}s - {seg.end}s
                </span>
                <p
                  className={`text-sm ${
                    segmentLang === "amharic"
                      ? "text-amber-100 font-medium"
                      : "text-slate-200"
                  }`}
                >
                  {seg.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
