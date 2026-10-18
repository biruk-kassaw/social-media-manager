"use client";

import { TranscriberJob } from "../types";
import { formatDuration } from "@/lib/utils";
import {
  Clock,
  Music,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface JobProgressProps {
  job: TranscriberJob;
  onRetry?: () => void;
}

export function JobProgress({ job, onRetry }: JobProgressProps) {
  const isFailed = job.status === "failed";
  const isCompleted = job.status === "completed";

  const steps = [
    { label: "Link Validated", active: true, done: job.progress >= 20 },
    {
      label: "Audio Extracted",
      active: job.progress >= 25,
      done: job.progress >= 50,
    },
    {
      label: "Speech Transcription",
      active: job.progress >= 50,
      done: job.progress >= 80,
    },
    {
      label: "Amharic Localization",
      active: job.progress >= 80,
      done: isCompleted,
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-5 sm:space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isFailed
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : isCompleted
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-purple-500/20 text-purple-400 border border-purple-500/30 animate-pulse"
            }`}
          >
            {isFailed ? (
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : isCompleted ? (
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h4 className="font-semibold text-white text-xs sm:text-sm md:text-base">
                {isFailed
                  ? "Processing Failed"
                  : isCompleted
                  ? "Processing Complete"
                  : "Processing Pipeline Active"}
              </h4>
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                {job.id}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              {job.currentStepMessage}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-base sm:text-lg font-bold font-mono text-purple-400">
            {job.progress}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 sm:h-2.5 overflow-hidden p-0.5 border border-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFailed
              ? "bg-rose-500"
              : isCompleted
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-purple-500 to-indigo-400 animate-pulse"
          }`}
          style={{ width: `${job.progress}%` }}
        />
      </div>

      {/* Steps Pipeline Visualizer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-1">
        {steps.map((step, idx) => (
          <div
            key={step.label}
            className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs flex items-center gap-2 sm:gap-2.5 transition-all ${
              step.done
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : step.active
                ? "bg-purple-950/30 border-purple-500/40 text-purple-200"
                : "bg-slate-950/40 border-slate-800/80 text-slate-400"
            }`}
          >
            <div
              className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold flex-shrink-0 ${
                step.done
                  ? "bg-emerald-500 text-slate-950"
                  : step.active
                  ? "bg-purple-500 text-white animate-spin"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {step.done ? "✓" : idx + 1}
            </div>
            <span className="font-medium truncate">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Extracted Metadata Preview */}
      {job.metadata && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Music className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                {job.metadata.title}
              </h5>
              <p className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                <span>@{job.metadata.author}</span>
                {job.metadata.duration && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(job.metadata.duration)}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="uppercase text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                  {job.metadata.format}
                </span>
              </p>
            </div>
          </div>

          <a
            href={job.metadata.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-purple-300 flex items-center gap-1 transition-colors self-end sm:self-center flex-shrink-0"
          >
            <span>View TikTok</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Error display */}
      {isFailed && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-sm flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold">Pipeline Execution Failed</p>
            <p className="text-xs text-rose-400 mt-1">{job.error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
