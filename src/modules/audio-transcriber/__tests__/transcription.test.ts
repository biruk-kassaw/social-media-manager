import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MockTranscriptionProvider } from "../providers/transcription/mock-whisper.provider.js";
import { getTranscriptionProvider } from "../providers/transcription/factory.js";
import { amharicLocalizationService } from "../services/amharic-localization.service.js";

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

describe("Amharic Script Localization Service (Two-Step Pipeline)", () => {
  it("localizes transcript into conversational creator style with segments", async () => {
    const sampleSegments = [
      { id: 1, start: 0.0, end: 3.5, text: "Welcome creators to the video!" },
      { id: 2, start: 3.5, end: 7.0, text: "Here is how to get viral traction." },
    ];

    const result = await amharicLocalizationService.localize({
      text: "Welcome creators to the video! Here is how to get viral traction.",
      segments: sampleSegments,
      tone: "creator",
    });

    assert.ok(result.amharicText.length > 0);
    assert.equal(result.amharicTone, "creator");
    assert.ok(Array.isArray(result.amharicSegments));
    assert.equal(result.amharicSegments?.length, 2);
    assert.equal(result.amharicSegments?.[0].id, 1);
  });

  it("localizes into educational and formal styles appropriately", async () => {
    const educational = await amharicLocalizationService.localize({
      text: "Today we analyze social media algorithms step by step.",
      tone: "educational",
    });
    assert.equal(educational.amharicTone, "educational");
    assert.ok(educational.amharicText.length > 0);

    const formal = await amharicLocalizationService.localize({
      text: "We present quarterly strategic initiatives for our organization.",
      tone: "formal",
    });
    assert.equal(formal.amharicTone, "formal");
    assert.ok(formal.amharicText.length > 0);
  });

  it("applies custom instructions to script refinement", async () => {
    const customized = await amharicLocalizationService.localize({
      text: "Check out this product now.",
      tone: "creator",
      customInstructions: "Add energetic TikTok hook",
    });

    assert.ok(customized.amharicText.length > 0);
    assert.equal(customized.amharicTone, "creator");
  });
});
