"use client";

import { useState } from "react";
import { TranscriptionResult, AudioMetadata, AmharicTone } from "../types";
import {
  Copy,
  Check,
  Download,
  Clock,
  Sparkles,
  CheckCircle,
  Languages,
  Flame,
  GraduationCap,
  Briefcase,
  Wand2,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TranscriptResultProps {
  result: TranscriptionResult;
  metadata?: AudioMetadata;
  jobId?: string;
  onResultUpdated?: (result: TranscriptionResult) => void;
}

export function TranscriptResult({
  result,
  metadata,
  jobId,
  onResultUpdated,
}: TranscriptResultProps) {
  // Default to Amharic if available, otherwise text
  const [activeTab, setActiveTab] = useState<"amharic" | "english" | "segments">(
    result.amharicText ? "amharic" : "english"
  );
  const [segmentLang, setSegmentLang] = useState<"amharic" | "english">(
    result.amharicSegments ? "amharic" : "english"
  );
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Refine / Regenerate script state
  const [showRefine, setShowRefine] = useState(false);
  const [refineTone, setRefineTone] = useState<AmharicTone>(
    result.amharicTone || "creator"
  );
  const [customInstructions, setCustomInstructions] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [refineSuccess, setRefineSuccess] = useState(false);

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
    content += `Amharic Style: ${result.amharicTone || "creator"}\n`;
    content += `Generated: ${result.completedAt}\n`;
    content += `=====================================================\n\n`;

    if (result.amharicText) {
      content += `🇪🇹 AMHARIC SCRIPT (የአማርኛ ስክሪፕት - ${result.amharicTone || "creator"})\n`;
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

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRefining(true);
    setRefineError(null);
    setRefineSuccess(false);

    try {
      const res = await fetch("/api/audio-transcriber/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: result.text,
          segments: result.segments,
          tone: refineTone,
          customInstructions: customInstructions.trim() || undefined,
          jobId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to refine Amharic script");
      }

      const updated: TranscriptionResult = {
        ...result,
        amharicText: data.amharicText,
        amharicSegments: data.amharicSegments,
        amharicTone: data.amharicTone,
      };

      if (onResultUpdated) {
        onResultUpdated(updated);
      }

      setRefineSuccess(true);
      setActiveTab("amharic");
      setTimeout(() => setRefineSuccess(false), 3000);
    } catch (err: any) {
      setRefineError(err?.message || "Failed to refine script");
    } finally {
      setIsRefining(false);
    }
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
                <span>አማርኛ ስክሪፕት (Amharic)</span>
              </span>
            )}

            {result.amharicTone && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium flex items-center gap-1">
                {result.amharicTone === "creator" && <Flame className="h-3 w-3 text-amber-400" />}
                {result.amharicTone === "educational" && <GraduationCap className="h-3 w-3 text-sky-400" />}
                {result.amharicTone === "formal" && <Briefcase className="h-3 w-3 text-purple-400" />}
                <span className="capitalize">{result.amharicTone} Style</span>
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

        {/* Global Actions: Refine Script & Download */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRefine(!showRefine)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border ${
              showRefine
                ? "bg-amber-500/20 text-amber-200 border-amber-500/40"
                : "bg-slate-800/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border-amber-500/30"
            }`}
          >
            <Wand2 className="h-4 w-4 text-amber-400" />
            <span>Refine / Polish Script</span>
            {showRefine ? (
              <ChevronUp className="h-3.5 w-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
            )}
          </button>

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

      {/* Refine / Script Tuning Drawer */}
      {showRefine && (
        <form
          onSubmit={handleRefineSubmit}
          className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Amharic Script Tuning & Regeneration
              </h4>
            </div>
            <span className="text-[11px] text-amber-400/90">
              No audio re-download needed
            </span>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-2">
              Select Desired Script Tone:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRefineTone("creator")}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  refineTone === "creator"
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span>Conversational Creator</span>
                </div>
                <p className="text-[10px] text-amber-300/80 font-medium">ፈጣሪ / ማራኪ አቀራረብ</p>
                <p className="text-[10px] text-slate-400 mt-0.5">TikTok & Reels energetic delivery</p>
              </button>

              <button
                type="button"
                onClick={() => setRefineTone("educational")}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  refineTone === "educational"
                    ? "bg-sky-500/20 border-sky-500/60 text-sky-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <GraduationCap className="h-3.5 w-3.5 text-sky-400" />
                  <span>Educational / Explanatory</span>
                </div>
                <p className="text-[10px] text-sky-300/80 font-medium">ትምህርታዊ / ማብራሪያ</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Clear conceptual breakdown</p>
              </button>

              <button
                type="button"
                onClick={() => setRefineTone("formal")}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  refineTone === "formal"
                    ? "bg-purple-500/20 border-purple-500/60 text-purple-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                  <span>Formal / Professional</span>
                </div>
                <p className="text-[10px] text-purple-300/80 font-medium">መደበኛ / ቢዝነስ</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Broadcast and business grade</p>
              </button>
            </div>
          </div>

          {/* Custom instructions textarea */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
              Custom Creator Instructions (Optional):
            </label>
            <textarea
              rows={2}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. 'Make the opening hook more shocking', 'Use more Addis Ababa youth slang', 'Simplify the sentence structure', 'Highlight the call to action at the end'..."
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
            />

            {/* Quick chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[10px] text-slate-500 mr-1">Quick chips:</span>
              {[
                "🔥 Punchier Opening Hook",
                "🗣️ Addis Ababa Spoken Slang",
                "⚡ Faster Pacing",
                "🎯 Stronger Call to Action",
                "📖 Simpler Vocabulary",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() =>
                    setCustomInstructions((prev) =>
                      prev ? `${prev}, ${chip}` : chip
                    )
                  }
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {refineError && (
            <p className="text-xs text-rose-400 font-medium">⚠️ {refineError}</p>
          )}

          {refineSuccess && (
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Amharic script localized and regenerated successfully!
            </p>
          )}

          {/* Action button */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowRefine(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isRefining}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isRefining ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Regenerating Script...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Regenerate Amharic Script</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

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
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>
              Localized by AI into modern conversational Amharic script (ፊደል). Click "Refine / Polish Script" to adjust style or wording.
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
