import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a top-tier YouTube SEO and content strategist. Your job is to generate a highly engaging, algorithm-optimized YouTube video description AND a set of powerful hashtags based on the user's prompt about their video.

**Description Rules:**
- Start with a compelling hook (first 2 lines are visible before "Show More", so make them count).
- Include a clear summary of what the viewer will learn or see.
- Use short paragraphs and line breaks for readability.
- Add a natural call-to-action (subscribe, like, comment).
- Weave in relevant keywords naturally for SEO — never keyword-stuff.
- Keep it between 150-300 words. Engaging, conversational tone.
- Do NOT include hashtags inside the description — they go separately.

**Hashtag Rules:**
- Generate 15-20 hashtags.
- Mix broad/trending tags (high volume) with niche-specific tags (low competition).
- Always include 2-3 hashtags with the video's core topic.
- Include a branded hashtag suggestion if relevant.
- All lowercase, no spaces inside tags.
- Order: most relevant first, broader ones last.

**Output Format (strict JSON):**
{
  "description": "The full YouTube description text here...",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "..."]
}

Return ONLY the JSON object. No markdown, no code fences, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "A prompt describing your video is required." },
        { status: 400 },
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt.trim() },
      ],
      temperature: 0.8,
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "No response was generated. Please try again." },
        { status: 500 },
      );
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);

    if (!parsed.description || !Array.isArray(parsed.hashtags)) {
      return NextResponse.json(
        { error: "Invalid response format. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      description: parsed.description,
      hashtags: parsed.hashtags,
    });
  } catch (err: unknown) {
    console.error("Metadata generation error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Metadata generation failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
