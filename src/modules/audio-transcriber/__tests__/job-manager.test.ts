import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { jobManager } from "../services/job-manager.service.js";

describe("JobManagerService", () => {
  it("creates a new job in queued state", async () => {
    const job = await jobManager.createJob(
      "https://www.tiktok.com/@creator/video/11223344"
    );

    assert.ok(job.id);
    assert.equal(job.status, "queued");
    assert.equal(job.inputUrl, "https://www.tiktok.com/@creator/video/11223344");
    assert.ok(job.createdAt);
  });

  it("updates job status and progress", async () => {
    const job = await jobManager.createJob(
      "https://www.tiktok.com/@creator/video/99887766"
    );

    const updated = await jobManager.updateJob(job.id, {
      status: "extracting",
      progress: 40,
      currentStepMessage: "Extracting audio track...",
    });

    assert.equal(updated.status, "extracting");
    assert.equal(updated.progress, 40);

    const retrieved = await jobManager.getJob(job.id);
    assert.equal(retrieved?.status, "extracting");
  });

  it("lists all jobs", async () => {
    const jobs = await jobManager.listJobs();
    assert.ok(Array.isArray(jobs));
    assert.ok(jobs.length >= 2);
  });
});
