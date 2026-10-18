"use client";

import { useEffect, useState } from "react";
import { HistoryList } from "@/modules/audio-transcriber/components/HistoryList";
import { TranscriptResult } from "@/modules/audio-transcriber/components/TranscriptResult";
import { TranscriberJob } from "@/modules/audio-transcriber/types";
import { Clock, RefreshCw, X } from "lucide-react";

export default function HistoryPage() {
  const [jobs, setJobs] = useState<TranscriberJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<TranscriberJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            Transcription Archive
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Browse all historical audio extraction and transcription jobs.
          </p>
        </div>

        <button
          onClick={fetchJobs}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {selectedJob?.result && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Viewing Selected Job Details
            </span>
            <button
              onClick={() => setSelectedJob(null)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>Close View</span>
            </button>
          </div>
          <TranscriptResult
            result={selectedJob.result}
            metadata={selectedJob.metadata}
          />
        </div>
      )}

      {isLoading && jobs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading archive...</span>
        </div>
      ) : (
        <HistoryList jobs={jobs} onSelectJob={(job) => setSelectedJob(job)} />
      )}
    </div>
  );
}
