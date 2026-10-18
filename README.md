# CreatorStudio: Modular Content Tools Platform

A modular Next.js application designed for creator managers and digital creators. The first feature is an **Audio Extractor & English Transcription Tool** that accepts TikTok media URLs, isolates the clean audio track, transcribes spoken speech into English, and provides timestamped segments and export options.

---

## 🌟 Key Highlights & Architecture

- **Modular Monolith**: Organized into self-contained feature modules (`src/modules/*`) with isolated logic, types, schemas, and provider interfaces.
- **Provider-Agnostic Transcription**: Supports **OpenAI Whisper** (`whisper-1`), **Groq Whisper** (`whisper-large-v3` for ultra-fast processing), and a built-in **Mock Provider** for offline/instant local testing.
- **Pure TypeScript Audio Extraction**: Ported extraction pipeline matching TikTok URL patterns, short URLs (`vm.tiktok.com`, `vt.tiktok.com`), and HTML blockquote embed codes.
- **Asynchronous Pipeline & Job Manager**: Long-running jobs run asynchronously in the background with file-backed job persistence and progress tracking (`queued` → `extracting` → `transcribing` → `completed` / `failed`).
- **Rich Dashboard UI**: Built with Tailwind CSS, dark aesthetic, real-time polling, timestamps toggle, copy to clipboard, and `.txt` file export.

---

## 🏗️ Directory Structure

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx                # App shell (Sidebar + Header)
│   │   ├── audio-transcriber/
│   │   │   └── page.tsx              # Audio extractor & transcriber page
│   │   └── history/
│   │       └── page.tsx              # Past transcription jobs archive
│   ├── api/
│   │   ├── audio-transcriber/
│   │   │   └── route.ts              # POST job start, GET provider status
│   │   └── jobs/
│   │       ├── route.ts              # GET list historical jobs
│   │       └── [id]/
│   │           └── route.ts          # GET poll single job status & results
│   ├── globals.css                   # Tailwind tokens and dark theme styling
│   └── layout.tsx                    # Root HTML layout
├── modules/
│   ├── audio-transcriber/
│   │   ├── components/               # TranscriberForm, JobProgress, TranscriptResult, HistoryList
│   │   ├── providers/
│   │   │   ├── audio-extractor/      # TikTok extractor (IAudioExtractor interface)
│   │   │   └── transcription/        # OpenAI, Groq, and Mock Whisper providers (ITranscriptionProvider)
│   │   ├── schemas/                  # Zod request validation & regex parser
│   │   ├── services/                 # Audio extraction, transcription, job manager & pipeline
│   │   └── types/                    # Domain TypeScript types
│   └── shared/
│       └── components/               # Sidebar, Header, shared navigation
└── lib/
    ├── env.ts                        # Type-safe environment variable reader
    └── utils.ts                      # Styling and formatting utilities
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### 2. Installation
```bash
git clone <repo-url>
cd social-media-manager
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your chosen provider in `.env.local`:
```env
# Provider options: 'mock' (default offline), 'openai', or 'groq'
TRANSCRIPTION_PROVIDER=mock

# Required if using OpenAI Whisper
OPENAI_API_KEY=your_openai_api_key_here

# Required if using Groq Whisper (ultra-fast whisper-large-v3)
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to the `/audio-transcriber` tool.

---

## 🧪 Running Automated Tests

Run the test suite using:
```bash
npm test
```
The test suite covers:
- TikTok URL and embed blockquote regex extraction
- Zod schema validation
- Job Manager state transitions and persistence
- Transcription provider factory and fallback behavior

---

## 🔌 How to Add or Replace a Transcription Provider

All transcription providers implement the `ITranscriptionProvider` interface located in [src/modules/audio-transcriber/providers/transcription/types.ts](file:///c:/Users/user/Desktop/personal%20projects/social%20media%20manager/src/modules/audio-transcriber/providers/transcription/types.ts):

```typescript
export interface ITranscriptionProvider {
  readonly name: string;
  readonly modelName: string;
  transcribe(audioPath: string, options?: TranscriptionOptions): Promise<TranscriptionResult>;
}
```

To add a new provider (e.g. Deepgram or AssemblyAI):
1. Create `src/modules/audio-transcriber/providers/transcription/my-provider.ts` implementing `ITranscriptionProvider`.
2. Register your provider in [factory.ts](file:///c:/Users/user/Desktop/personal%20projects/social%20media%20manager/src/modules/audio-transcriber/providers/transcription/factory.ts).
3. Add the corresponding API key to `.env.example` and `src/lib/env.ts`.

---

## 🧩 How to Add a New Feature Module

To add future features (e.g., *Trend Discovery* or *Amharic Script Generation*):
1. Create a dedicated folder in `src/modules/<new-module-name>/`.
2. Define `components/`, `services/`, `schemas/`, `types/`, and barrel `index.ts`.
3. Add the UI route under `src/app/(dashboard)/<new-module-name>/page.tsx`.
4. Link the new tool in [Sidebar.tsx](file:///c:/Users/user/Desktop/personal%20projects/social%20media%20manager/src/modules/shared/components/Sidebar.tsx).

---

## 🚢 Production Deployment

### Option 1: Vercel
Because the extractor and transcription pipeline are written in pure TypeScript, the application is compatible with Vercel:
1. Connect your GitHub repository to Vercel.
2. Set your environment variables (`TRANSCRIPTION_PROVIDER`, `OPENAI_API_KEY` or `GROQ_API_KEY`) in the Vercel Project Settings.
3. Deploy!

### Option 2: Docker Container (Render, Railway, Fly.io, VPS)
A `Dockerfile` is provided for containerized deployments:
```bash
docker build -t creator-studio .
docker run -p 3000:3000 --env-file .env.local creator-studio
```
