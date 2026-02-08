# Social Studio

**AI-powered studio for Instagram Reels & YouTube creators.** Upload one reel, get everything done in one place — subtitles, thumbnails, captions, descriptions, and scheduling. Built with [Tambo](https://tambo.co/) Generative UI for [**The UI Strikes Back**](https://www.wemakedevs.org/hackathons/tambo) hackathon (WeMakeDevs × Tambo AI).

---

## About the Hackathon

**[The UI Strikes Back](https://www.wemakedevs.org/hackathons/tambo)** is an online hackathon (Feb 2–8) focused on building **Generative UI** applications with Tambo. The AI decides which components to render based on natural language, so users don’t have to learn your app; the right UI appears from what they say.



## Features

### Dashboard (traditional UI)

- **Auto Captions** — Upload video → Whisper transcription → SRT captions
- **Thumbnail Designer** — AI-generated YouTube thumbnails 
- **SEO Metadata** — Video descriptions and hashtags
- **Script Writer** — YouTube video scripts (topic, duration, tone)
- **Instagram Captions** — Instagram captions from a photo + mood
- **Logo Creator** — Brand logos from name, industry, style
- **Reel Scriptwriter** — Instagram Reel scripts (format, duration)
- **Brand Name Generator** — Name + tagline suggestions
- **Content Calendar** — Plan and schedule posts with a calendar

### Tambo AI Chat (Generative UI)

A single **AI Chat** in the dashboard header (Tambo logo icon) that:

- **Renders tools in the chat** when you ask in plain language:
  - *“I want captions for a video”* → Auto Captions UI appears in the thread
  - *“I want a YouTube thumbnail”* → Thumbnail Designer appears in the chat
  - *“Generate a script for…”* → Script Writer with your topic
  - Same for metadata, photo captions, logo, reel script, brand names
- **Content Calendar via chat only** — No calendar widget in chat; you say things like *“Add an event for Feb 14”* or *“List my events”* and the AI performs CRUD via tools and confirms in text.
- **Speech-to-text** — Mic button in the chat for voice input (Tambo Voice).
- **Clear chat** — Start a new conversation anytime.

All of this is powered by **Tambo’s Generative UI**: registered React components + Zod schemas + calendar tools. The model chooses which component to show (or which tool to call) from the user’s message.

---

## Tech Stack

| Layer        | Tech |
|-------------|------|
| Framework   | Next.js 16 (App Router), React 19 |
| Generative UI | [Tambo AI React SDK](https://www.npmjs.com/package/@tambo-ai/react) (`@tambo-ai/react`) |
| Backend     | [Appwrite](https://appwrite.io/) (auth, database, storage) |
| AI / APIs   | OpenAI (Whisper, DALL·E, script/metadata/captions), Tambo API (chat + voice) |
| UI          | Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/), Radix UI, Framer Motion |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd uptime-tracker-tambo
npm install
```

### 2. Environment variables

Create `.env.local` in the project root with:

```env
# Appwrite (required for auth, DB, storage)
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID=
NEXT_PUBLIC_APPWRITE_VIDEOS_TABLE_ID=
NEXT_PUBLIC_APPWRITE_CAPTIONS_TABLE_ID=
NEXT_PUBLIC_APPWRITE_THUMBNAILS_TABLE_ID=
NEXT_PUBLIC_APPWRITE_CALENDAR_TABLE_ID=
NEXT_PUBLIC_APPWRITE_METADATA_TABLE_ID=

# Tambo (required for AI chat + voice)
NEXT_PUBLIC_TAMBO_API_KEY=

# OpenAI (for captions, thumbnails, scripts, etc.)
OPENAI_API_KEY=
```

Get a Tambo API key from [tambo.co/dashboard](https://tambo.co/dashboard). Configure Appwrite and OpenAI as needed for your instance.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or sign in, then use the dashboard and the **AI Chat** (Tambo icon in the header).

---

## How Tambo Is Used

- **Generative components** — Eight tools (Captions, Thumbnail, Metadata, Script Writer, Photo Captions, Logo Creator, Reel Script, Brand Name) are registered with Tambo with Zod `propsSchema` and descriptions. The AI picks the right one from the user’s message and renders it inline in the chat.
- **Tools (no UI)** — Four calendar tools (`list_calendar_events`, `add_calendar_event`, `update_calendar_event`, `delete_calendar_event`) are registered so the AI can manage the content calendar via conversation; no calendar widget is rendered in the chat.
- **Context** — Current user ID is provided so calendar tools are scoped to the logged-in user.
- **Voice** — `useTamboVoice` powers the mic button in the chat for speech-to-text input.

---

**Built for [The UI Strikes Back](https://www.wemakedevs.org/hackathons/tambo) — WeMakeDevs × Tambo AI.**  
*May the components be with you.*
