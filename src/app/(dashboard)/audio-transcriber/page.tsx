"use client";

import { useState, useEffect, useRef } from "react";
import { TranscriberForm } from "@/modules/audio-transcriber/components/TranscriberForm";
import { JobProgress } from "@/modules/audio-transcriber/components/JobProgress";
import { TranscriptResult } from "@/modules/audio-transcriber/components/TranscriptResult";
import { TranscriberJob } from "@/modules/audio-transcriber/types";
import {
  Sparkles,
  AudioWaveform,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AudioTranscriberPage() {
  const [currentJob, setCurrentJob] = useState<TranscriberJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for job updates until completed or failed
  useEffect(() => {
    if (!currentJob) return;

    if (currentJob.status === "completed" || currentJob.status === "failed") {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    const pollJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${currentJob.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.job) {
            setCurrentJob(data.job);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    pollingRef.current = setInterval(pollJob, 1200);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [currentJob?.id, currentJob?.status]);

  const handleSubmit = async (
    url: string,
    provider: "openai" | "groq" | "gemini" | "mock"
  ) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/audio-transcriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, provider }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start extraction");
      }

      setCurrentJob(data.job);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (currentJob) {
      handleSubmit(currentJob.inputUrl, "mock");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Intro hero banner */}


      {/* Media Input Form */}
      <TranscriberForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting || (currentJob !== null && currentJob.status !== "completed" && currentJob.status !== "failed")}
      />

      {/* Progress / Status Display */}
      {currentJob && (
        <JobProgress job={currentJob} onRetry={handleRetry} />
      )}

      {/* Transcript Results Panel */}
      {currentJob?.result && (
        <TranscriptResult
          result={currentJob.result}
          metadata={currentJob.metadata}
        />
      )}
    </div>
  );
}
