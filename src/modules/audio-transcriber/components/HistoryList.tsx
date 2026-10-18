"use client";

import { useState } from "react";
import { TranscriberJob } from "../types";
import { formatDate, formatDuration } from "@/lib/utils";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface HistoryListProps {
  jobs: TranscriberJob[];
  onSelectJob?: (job: TranscriberJob) => void;
}

export function HistoryList({ jobs, onSelectJob }: HistoryListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (jobs.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-white">
          No Transcription History Yet
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          Start by submitting a TikTok video URL on the Audio Transcriber page to
          generate your first English transcript.
        </p>
      </div>
    );
  }

  const handleCopy = async (id: string, text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        const isCompleted = job.status === "completed";
        const isFailed = job.status === "failed";

        return (
          <div
            key={job.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 sm:p-5 backdrop-blur-xl transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4"
          >
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : isFailed
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : isFailed ? (
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-none">
                    {job.metadata?.title || job.inputUrl}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {job.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-400 mt-1">
                  <span>{formatDate(job.createdAt)}</span>
                  {job.metadata?.author && (
                    <>
                      <span>•</span>
                      <span>@{job.metadata.author}</span>
                    </>
                  )}
                  {job.metadata?.duration && (
                    <>
                      <span>•</span>
                      <span>{formatDuration(job.metadata.duration)}</span>
                    </>
                  )}
                  {job.result?.amharicText && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">🇪🇹 አማርኛ</span>
                    </>
                  )}
                  <span>•</span>
                  <span
                    className={`capitalize font-medium ${
                      isCompleted
                        ? "text-emerald-400"
                        : isFailed
                        ? "text-rose-400"
                        : "text-purple-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {job.result && (
                  <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 break-words">
                    {job.result.amharicText ? (
                      <span className="text-amber-200">
                        🇪🇹 {job.result.amharicText}
                      </span>
                    ) : (
                      `"${job.result.text}"`
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60 flex-shrink-0">
              {job.result && (
                <button
                  type="button"
                  onClick={() => handleCopy(job.id, job.result?.text)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === job.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}

              {onSelectJob && (
                <button
                  type="button"
                  onClick={() => onSelectJob(job)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 border border-purple-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
