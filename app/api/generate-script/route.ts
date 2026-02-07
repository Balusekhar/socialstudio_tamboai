import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const YOUTUBE_SYSTEM_PROMPT = `You are an expert YouTube scriptwriter who has written scripts for channels with millions of subscribers. Your job is to write a complete, ready-to-record YouTube video script based on the user's topic.

**Script Structure:**
1. **Hook (first 30 seconds):** Start with a bold, curiosity-driven opening that stops the scroll. Use a question, shocking stat, or bold claim. Never start with "Hey guys, welcome back."
2. **Intro:** Briefly introduce the topic and what the viewer will gain. Keep it under 30 seconds.
3. **Main Content:** Break the topic into clear sections with smooth transitions. Use storytelling, examples, and analogies to keep viewers engaged. Include retention hooks every 2-3 minutes ("But here's where it gets interesting...", "Now this next part is crucial...").
4. **CTA & Outro:** End with a strong call-to-action (subscribe, comment, watch next video). Keep it natural, not pushy.

**Tone & Style Rules:**
- Write in a conversational, energetic tone — like talking to a friend.
- Use short sentences and paragraphs for easy reading on a teleprompter.
- Include [B-ROLL] or [SCREEN RECORDING] markers where visuals should change.
- Add [PAUSE] markers for dramatic effect where needed.
- Never use filler or fluff — every sentence should earn its place.

**Format the script clearly with section headers.**

Return ONLY the script text. No JSON, no code fences, no meta-commentary.`;

const INSTAGRAM_SYSTEM_PROMPT = `You are a viral Instagram Reels scriptwriter. You craft short, punchy scripts that hook viewers in the first second and keep them watching until the end.

**Script Rules:**
- **Hook (first 1-2 seconds):** Open with a bold statement, question, or visual cue that stops the scroll immediately.
- **Body:** Deliver value fast. No fluff. Use short, punchy sentences. Every second counts.
- **CTA:** End with a clear call-to-action (follow, save, share, comment).

**Format Guidelines:**
- Use [ON SCREEN TEXT] markers for text overlays.
- Use [VISUAL] markers for scene/shot descriptions.
- Use [VOICEOVER] or [SPEAKING TO CAMERA] to indicate delivery style.
- Write the timing for each section (e.g., "0:00-0:03").
- Keep the energy high and the language casual/relatable.

**Adapt to the requested format:**
- Hook → Story → CTA: Classic storytelling arc.
- Quick Tutorial: Step-by-step with clear visuals.
- Listicle / Tips: Numbered tips, fast cuts.
- Before & After: Contrast transformation.
- Day in My Life: Personal, authentic narration.
- Trending Audio Script: Sync actions/cuts to trending audio beats.

Return ONLY the script text. No JSON, no code fences, no meta-commentary.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, duration, platform } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "A topic is required to generate a script." },
        { status: 400 },
      );
    }

    const isInstagram = platform === "instagram";
    const systemPrompt = isInstagram
      ? INSTAGRAM_SYSTEM_PROMPT
      : YOUTUBE_SYSTEM_PROMPT;

    // Build the user message with context
    let userMessage = `Topic: ${topic.trim()}\n`;
    userMessage += `Target duration: ${duration || "10"} ${isInstagram ? "seconds" : "minutes"}\n`;

    if (isInstagram && body.format) {
      userMessage += `Script format: ${body.format}\n`;
    }

    if (!isInstagram && body.tone) {
      userMessage += `Tone: ${body.tone}\n`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.85,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "No script was generated. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ script: content });
  } catch (err: unknown) {
    console.error("Script generation error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Script generation failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
