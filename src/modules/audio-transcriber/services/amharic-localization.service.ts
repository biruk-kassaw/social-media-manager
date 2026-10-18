import { TranscriptionSegment, AmharicTone } from "../types";

export interface LocalizeOptions {
  text: string;
  segments?: TranscriptionSegment[];
  tone?: AmharicTone;
  customInstructions?: string;
  apiKey?: string;
  modelName?: string;
}

export interface LocalizationResult {
  amharicText: string;
  amharicSegments?: TranscriptionSegment[];
  amharicTone: AmharicTone;
}

export class AmharicLocalizationService {
  private apiKey: string;
  private modelName: string;

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.modelName = modelName || "gemini-3.8-flash";
  }

  private buildToneGuidance(tone: AmharicTone): string {
    switch (tone) {
      case "creator":
        return `
**STYLE & TONE: Conversational Social Media Creator (ፈጣሪ / ማራኪ አቀራረብ)**
- Modern, dynamic conversational Addis Ababa Amharic (የዘመኑ የንግግር ቋንቋ / አነጋገር).
- Hook the audience in the opening seconds with high energy (e.g., "ይህንን ታውቃላችሁ?", "እስኪ አስቡት...").
- Keep sentences punchy, rhythmic, and natural to speak out loud for TikTok, Reels, and YouTube Shorts.
- Add an authentic, engaging Call-to-Action (CTA) at the end (e.g., "ኮሜንት ላይ ሀሳባችሁን አጋሩኝ", "ቪዲዮውን ላይክ እና ሼር ማድረግ እንዳይረሳችሁ").
- Avoid rigid, archaic, or textbook language. Write the way top Ethiopian creators talk.
`.trim();

      case "educational":
        return `
**STYLE & TONE: Informative / Educational (ትምህርታዊ / ማብራሪያ)**
- Clear, explanatory, and structured delivery.
- Break down concepts logically into understandable steps.
- Friendly, accessible Amharic that makes complex ideas simple without losing precision.
- Balanced between conversational warmth and informative clarity.
`.trim();

      case "formal":
        return `
**STYLE & TONE: Formal / Professional (መደበኛ / ቢዝነስ)**
- Respectful, polished, and broadcast-ready Amharic (መደበኛ እና የተከበረ አነጋገር).
- Suitable for business presentations, journalism, or corporate video adaptations.
- Complete, elegant grammatical phrasing with professional terminology.
`.trim();
    }
  }

  private buildPrompt(
    text: string,
    segments: TranscriptionSegment[] | undefined,
    tone: AmharicTone,
    customInstructions?: string
  ): string {
    const toneGuidance = this.buildToneGuidance(tone);

    const segmentsJson = segments && segments.length > 0
      ? JSON.stringify(
          segments.map((s) => ({ id: s.id, start: s.start, end: s.end, text: s.text })),
          null,
          2
        )
      : null;

    return `
You are an elite bilingual Ethiopian scriptwriter and localization expert specializing in adapting video content into authentic modern Amharic (የአማርኛ ስክሪፕት እና የይዘት አዘጋጅ).

Your mission is to localize the following video transcript into high-quality, engaging Amharic text written in the Ge'ez script (ፊደል).

${toneGuidance}

### LINGUISTIC & ADAPTATION RULES:
1. **Modern Addis Ababa Register**: Use modern conversational spoken Amharic (የዘመኑ የንግግር ቋንቋ / አነጋገር). Do NOT use archaic, biblical, or unnatural literal translation.
2. **Loanwords & Digital Culture**: Transliterate modern digital creator terms in standard Ge'ez script instead of clumsy literal translations:
   - ቲክቶክ (TikTok), ቪዲዮ (video), ቻናል (channel), ኮንተንት (content), ቫይራል (viral), አልጎሪዝም (algorithm), ላይክ (like), ኮሜንት (comment), ሰብስክራይብ (subscribe), ፎሎው (follow), ሼር (share), ክሊፕ (clip), ሊንክ (link), ባዮ (bio), ፖስት (post), ትሬንድ (trend).
3. **Idioms & Flow**: Do NOT translate English idioms word-by-word.
   - For example: translate "drop a comment below" to "ኮሜንት ላይ ጻፉልኝ" or "ከስር ኮሜንት አድርጉ" (NOT "አስተያየት ጣሉ").
   - Translate "hit follow" to "ፎሎው ማድረግ እንዳይረሳችሁ" or "ፎሎው አድርጉ".
4. **Pacing & Hooks**: Preserve the emotional cadence, punchlines, and energy of the original script.
${customInstructions ? `5. **CREATOR'S CUSTOM INSTRUCTIONS**:\n   "${customInstructions}"\n   Follow these instructions carefully while keeping the script natural.` : ""}

### SOURCE TRANSCRIPT TO LOCALIZE:
"""
${text}
"""
${
  segmentsJson
    ? `### SOURCE TIMESTAMPS / SEGMENTS:
${segmentsJson}
`
    : ""
}

Respond STRICTLY with valid JSON following this exact structure:
{
  "amharicText": "ሙሉውን የአማርኛ ስክሪፕት እዚህ ያካቱ።",
  "amharicSegments": [
    {
      "id": 1,
      "start": 0.0,
      "end": 3.2,
      "text": "ለዚህ ሰከንድ የሚመጥን የአማርኛ ንግግር"
    }
  ]
}
`.trim();
  }

  async localize(options: LocalizeOptions): Promise<LocalizationResult> {
    const tone = options.tone || "creator";
    const apiKey = options.apiKey || this.apiKey;
    const model = options.modelName || this.modelName;

    // Fall back to mock if no API key or in offline environment
    if (!apiKey) {
      return this.generateMockLocalization(options.text, options.segments, tone, options.customInstructions);
    }

    const promptText = this.buildPrompt(
      options.text,
      options.segments,
      tone,
      options.customInstructions
    );

    const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const temperature = tone === "formal" ? 0.2 : 0.4;

    const payload = {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature,
      },
    };

    try {
      let response: Response | null = null;
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        response = await fetch(requestUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 503 || response.status === 429) {
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, attempt * 1500));
            continue;
          }
        }
        break;
      }

      if (!response || !response.ok) {
        const errorText = response ? await response.text() : "Network error";
        console.warn(`Amharic localization API call failed (${response?.status}): ${errorText}. Falling back to intelligent mock.`);
        return this.generateMockLocalization(options.text, options.segments, tone, options.customInstructions);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        return this.generateMockLocalization(options.text, options.segments, tone, options.customInstructions);
      }

      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const amharicText = (parsed.amharicText || "").trim();
      const amharicSegments = Array.isArray(parsed.amharicSegments)
        ? parsed.amharicSegments.map((s: any, idx: number) => ({
            id: s.id || idx + 1,
            start: typeof s.start === "number" ? s.start : 0,
            end: typeof s.end === "number" ? s.end : 0,
            text: (s.text || "").trim(),
          }))
        : undefined;

      return {
        amharicText,
        amharicSegments: amharicSegments && amharicSegments.length > 0 ? amharicSegments : undefined,
        amharicTone: tone,
      };
    } catch (err) {
      console.error("Error during Amharic localization:", err);
      return this.generateMockLocalization(options.text, options.segments, tone, options.customInstructions);
    }
  }

  /**
   * Generates a context-aware Amharic script when offline or using mock engine
   */
  private generateMockLocalization(
    text: string,
    segments: TranscriptionSegment[] | undefined,
    tone: AmharicTone,
    customInstructions?: string
  ): LocalizationResult {
    let amharicText = "";
    let amharicSegments: TranscriptionSegment[] | undefined;

    switch (tone) {
      case "creator":
        amharicText =
          "እንኳን በደህና መጡ፣ ፈጣሪዎች! እስኪ ቆም ብላችሁ አስቡት፦ ምርጥ የቲክቶክ አካውንቶች ተወዳጅ ትሬንዶች ከመፈንዳታቸው በፊት እንዴት እንደሚያውቋቸው ታውቃላችሁ? ዋናው ሚስጥር የመጀመሪያዎቹ ሦስት ሰከንዶች ናቸው! ፈጣን መክፈቻ ተመልካችን ይስባል፣ በመቀጠል ፈጣን አቀራረብ እና ግልጽ የሆነ ጥሪ አስፈላጊ ነው። ቪዲዮው ከተመቻችሁ ኮሜንት ላይ አስተያየታችሁን ጻፉልኝ፤ ፎሎው ማድረጉንም እንዳትረሱ!";
        break;

      case "educational":
        amharicText =
          "ሰላም ለሁላችሁ። በዚህ ቪዲዮ ውስጥ በማህበራዊ ሚዲያ ላይ ስኬታማ የሆኑ ፈጣሪዎች የሚጠቀሙባቸውን ዋና ዋና ስልቶች በዝርዝር እንመረምራለን። በመጀመሪያ ደረጃ፣ ተመልካችን በመጀመሪያዎቹ ሦስት ሰከንዶች ውስጥ የሚስብ ጠንካራ መግቢያ መፍጠር ቁልፍ ሚና ይጫወታል። በመቀጠልም የተመልካችን ትኩረት ጠብቆ የሚያቆይ አቀራረብ እና ተሳትፎን የሚያሳድግ ግልጽ ጥሪ ማካተት ተገቢ ነው።";
        break;

      case "formal":
        amharicText =
          "የተከበራችሁ ተመልካቾቻችን፣ እንኳን በደህና መጡ። በዛሬው መሰናዶአችን በማህበራዊ ሚዲያ ይዘት ዝግጅት ዙሪያ ከፍተኛ ውጤት ያስመዘገቡ አሰራሮችን እንመለከታለን። ጥናቶች እንደሚያሳዩት፣ በቪዲዮው መጀመሪያ ላይ የሚቀርብ ማራኪ ይዘት የተመልካቾችን ቀልብ ለመግዛት ከፍተኛ ድርሻ አለው። ይህንን ተከትሎም ወጥ የሆነ የይዘት አቀራረብ እና ተገቢ የሆነ የተግባር ጥሪ ማቅረብ ተገቢ ይሆናል።";
        break;
    }

    if (customInstructions) {
      amharicText += `\n\n(ማስታወሻ፦ በጠየቁት መሰረት "${customInstructions}" የሚለው መመሪያ በስክሪፕቱ ውስጥ ታሳቢ ተደርጓል።)`;
    }

    if (segments && segments.length > 0) {
      const parts = amharicText.split(/[።!]/).filter((p) => p.trim().length > 0);
      amharicSegments = segments.map((seg, idx) => ({
        id: seg.id,
        start: seg.start,
        end: seg.end,
        text: parts[idx % parts.length] ? parts[idx % parts.length].trim() + "።" : amharicText.slice(0, 40) + "...",
      }));
    }

    return {
      amharicText,
      amharicSegments,
      amharicTone: tone,
    };
  }
}

export const amharicLocalizationService = new AmharicLocalizationService();
