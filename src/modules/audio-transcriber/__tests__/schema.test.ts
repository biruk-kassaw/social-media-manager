import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractTikTokUrl,
  transcribeRequestSchema,
  refineScriptSchema,
} from "../schemas/transcriber.schema.js";

describe("TikTok URL extraction and schema validation", () => {
  it("should extract URL from standard TikTok link", () => {
    const url = "https://www.tiktok.com/@creator/video/7234567890123456789";
    assert.equal(extractTikTokUrl(url), url);
  });

  it("should extract URL from mobile short links", () => {
    const vmUrl = "https://vm.tiktok.com/ZM8abc123/";
    assert.equal(extractTikTokUrl(vmUrl), "https://vm.tiktok.com/ZM8abc123");

    const vtUrl = "https://vt.tiktok.com/ZS8def456/";
    assert.equal(extractTikTokUrl(vtUrl), "https://vt.tiktok.com/ZS8def456");
  });

  it("should extract URL from HTML blockquote embed code", () => {
    const embed = `
      <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@scout2015/video/6718335390845095173" data-video-id="6718335390845095173">
        <section><a href="https://www.tiktok.com/@scout2015">@scout2015</a></section>
      </blockquote>
    `;
    assert.equal(
      extractTikTokUrl(embed),
      "https://www.tiktok.com/@scout2015/video/6718335390845095173"
    );
  });

  it("should throw on invalid input", () => {
    assert.throws(() => extractTikTokUrl("https://youtube.com/watch?v=123"));
    assert.throws(() => extractTikTokUrl("not a url"));
  });

  it("validates request schema correctly and defaults tone to creator", () => {
    const valid = transcribeRequestSchema.safeParse({
      url: "https://www.tiktok.com/@creator/video/123456789",
    });
    assert.equal(valid.success, true);
    if (valid.success) {
      assert.equal(valid.data.tone, "creator");
    }

    const withFormalTone = transcribeRequestSchema.safeParse({
      url: "https://www.tiktok.com/@creator/video/123456789",
      tone: "formal",
    });
    assert.equal(withFormalTone.success, true);
    if (withFormalTone.success) {
      assert.equal(withFormalTone.data.tone, "formal");
    }

    const invalid = transcribeRequestSchema.safeParse({
      url: "https://google.com",
    });
    assert.equal(invalid.success, false);
  });

  it("validates refineScriptSchema correctly", () => {
    const valid = refineScriptSchema.safeParse({
      text: "Sample English transcript text",
      tone: "educational",
      customInstructions: "Add punchier hook",
    });
    assert.equal(valid.success, true);

    const invalid = refineScriptSchema.safeParse({
      text: "",
    });
    assert.equal(invalid.success, false);
  });
});
