import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { TranscriberJob, JobStatus } from "../types";

class JobManagerService {
  private jobs = new Map<string, TranscriberJob>();
  private storeFile: string;
  private initialized = false;

  constructor() {
    this.storeFile = path.join(process.cwd(), "temp", "jobs.json");
  }

  private async init(): Promise<void> {
    if (this.initialized) return;
    try {
      await fs.mkdir(path.dirname(this.storeFile), { recursive: true });
      const data = await fs.readFile(this.storeFile, "utf-8");
      const parsed: TranscriberJob[] = JSON.parse(data);
      for (const job of parsed) {
        this.jobs.set(job.id, job);
      }
    } catch {
      // file might not exist yet
    }
    this.initialized = true;
  }

  private async persist(): Promise<void> {
    try {
      const allJobs = Array.from(this.jobs.values());
      await fs.writeFile(this.storeFile, JSON.stringify(allJobs, null, 2));
    } catch (err) {
      console.error("Failed to persist jobs:", err);
    }
  }

  async createJob(inputUrl: string): Promise<TranscriberJob> {
    await this.init();
    const id = "job_" + crypto.randomBytes(6).toString("hex");
    const job: TranscriberJob = {
      id,
      status: "queued",
      inputUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 5,
      currentStepMessage: "Job queued in processing pipeline...",
    };
    this.jobs.set(id, job);
    await this.persist();
    return job;
  }

  async getJob(id: string): Promise<TranscriberJob | undefined> {
    await this.init();
    return this.jobs.get(id);
  }

  async updateJob(
    id: string,
    updates: Partial<TranscriberJob>
  ): Promise<TranscriberJob> {
    await this.init();
    const existing = this.jobs.get(id);
    if (!existing) {
      throw new Error(`Job ${id} not found`);
    }

    const updated: TranscriberJob = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.jobs.set(id, updated);
    await this.persist();
    return updated;
  }

  async listJobs(): Promise<TranscriberJob[]> {
    await this.init();
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

// Singleton instance for the application
export const jobManager = new JobManagerService();
