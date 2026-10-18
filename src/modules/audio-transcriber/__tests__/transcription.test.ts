import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MockTranscriptionProvider } from "../providers/transcription/mock-whisper.provider.js";
import { getTranscriptionProvider } from "../providers/transcription/factory.js";

describe("Transcription Providers", () => {
  it("MockTranscriptionProvider returns structured transcription with segments and Amharic translation", async () => {
    const provider = new MockTranscriptionProvider();
    const result = await provider.transcribe("fake/path.mp3");

    assert.ok(result.text.length > 0);
    assert.ok(result.amharicText && result.amharicText.length > 0);
    assert.equal(result.isEnglish, true);
    assert.equal(result.language, "en");
    assert.ok(Array.isArray(result.segments));
    assert.ok(Array.isArray(result.amharicSegments));
    assert.ok((result.segments?.length || 0) > 0);
    assert.equal(result.provider, "Mock Whisper Engine");
  });

  it("factory returns mock provider when preferred is mock", () => {
    const provider = getTranscriptionProvider("mock");
    assert.equal(provider.name, "Mock Whisper Engine");
  });

  it("factory resolves Gemini provider when preferred is gemini and key exists", () => {
    const origKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = "test-gemini-key";

    const provider = getTranscriptionProvider("gemini");
    assert.equal(provider.name, "Google Gemini AI");

    if (origKey) process.env.GEMINI_API_KEY = origKey;
    else delete process.env.GEMINI_API_KEY;
  });

  it("factory falls back safely to mock when API key is missing", () => {
    const origKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const provider = getTranscriptionProvider("openai");
    assert.equal(provider.name, "Mock Whisper Engine");

    if (origKey) process.env.OPENAI_API_KEY = origKey;
  });
});
