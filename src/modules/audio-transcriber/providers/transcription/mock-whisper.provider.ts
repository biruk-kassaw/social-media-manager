import { TranscriptionResult } from "../../types";
import { ITranscriptionProvider, TranscriptionOptions } from "./types";

export class MockTranscriptionProvider implements ITranscriptionProvider {
  readonly name = "Mock Whisper Engine";
  readonly modelName = "whisper-mock-v1";

  async transcribe(
    audioPath: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    // Simulate brief processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const sampleText =
      "Welcome back, creators! In this video, we're breaking down how top accounts identify viral trends before they blow up. Notice how quick hooks capture viewer attention within the first three seconds, followed by high-retention pacing and a clear call to action.";

    const segments = [
      {
        id: 1,
        start: 0.0,
        end: 3.2,
        text: "Welcome back, creators!",
      },
      {
        id: 2,
        start: 3.2,
        end: 7.8,
        text: "In this video, we're breaking down how top accounts identify viral trends before they blow up.",
      },
      {
        id: 3,
        start: 7.8,
        end: 13.5,
        text: "Notice how quick hooks capture viewer attention within the first three seconds,",
      },
      {
        id: 4,
        start: 13.5,
        end: 18.0,
        text: "followed by high-retention pacing and a clear call to action.",
      },
    ];

    const sampleAmharicText =
      "እንኳን በደህና መጡ፣ ፈጣሪዎች! በዚህ ቪዲዮ ውስጥ ከፍተኛ ተከታይ ያላቸው አካውንቶች ተወዳጅ የሆኑ አዝማሚያዎችን ከመስፋፋታቸው በፊት እንዴት እንደሚያውቁ እንመለከታለን። ፈጣን መክፈቻዎች በመጀመሪያዎቹ ሦስት ሰከንዶች ውስጥ የተመልካቾችን ቀልብ እንዴት እንደሚስቡ፣ ተከታይ የሆነ ማራኪ አቀራረብ እና ግልጽ የሆነ ጥሪ እንዳላቸው ልብ ይበሉ።";

    const amharicSegments = [
      {
        id: 1,
        start: 0.0,
        end: 3.2,
        text: "እንኳን በደህና መጡ፣ ፈጣሪዎች!",
      },
      {
        id: 2,
        start: 3.2,
        end: 7.8,
        text: "በዚህ ቪዲዮ ውስጥ ከፍተኛ ተከታይ ያላቸው አካውንቶች ተወዳጅ የሆኑ አዝማሚያዎችን ከመስፋፋታቸው በፊት እንዴት እንደሚያውቁ እንመለከታለን።",
      },
      {
        id: 3,
        start: 7.8,
        end: 13.5,
        text: "ፈጣን መክፈቻዎች በመጀመሪያዎቹ ሦስት ሰከንዶች ውስጥ የተመልካቾችን ቀልብ እንዴት እንደሚስቡ ልብ ይበሉ፣",
      },
      {
        id: 4,
        start: 13.5,
        end: 18.0,
        text: "ተከታይ የሆነ ማራኪ አቀራረብ እና ግልጽ የሆነ ጥሪ አላቸው።",
      },
    ];

    return {
      text: sampleText,
      amharicText: sampleAmharicText,
      language: options?.language || "en",
      isEnglish: true,
      segments,
      amharicSegments,
      duration: 18.0,
      provider: this.name,
      model: this.modelName,
      completedAt: new Date().toISOString(),
    };
  }
}
