import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a top Instagram caption writer with expertise in social media engagement. Your job is to analyze an uploaded photo and generate 5 creative, engaging Instagram captions based on the mood/style requested.

**Caption Rules:**
- Each caption should be unique in style and length (mix of short punchy ones and longer storytelling ones).
- Include relevant emojis naturally — don't overdo it.
- Add 3-5 relevant hashtags at the end of each caption.
- Match the requested mood perfectly (casual, aesthetic, witty, inspirational, professional, humorous).
- First line should be a scroll-stopping hook.
- Captions should feel authentic, not robotic or generic.
- Keep captions Instagram-optimized (under 2200 characters each).

**Output Format (strict JSON):**
{
  "captions": [
    "Caption 1 text here with #hashtags",
    "Caption 2 text here with #hashtags",
    "Caption 3 text here with #hashtags",
    "Caption 4 text here with #hashtags",
    "Caption 5 text here with #hashtags"
  ]
}

Return ONLY the JSON object. No markdown, no code fences, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const mood = (formData.get("mood") as string) || "casual";

    if (!imageFile) {
      return NextResponse.json(
        { error: "An image is required." },
        { status: 400 },
      );
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate 5 Instagram captions for this photo. Mood/style: ${mood}. Analyze the photo content and create captions that match what's shown in the image.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      temperature: 0.9,
      max_tokens: 2048,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "No captions were generated. Please try again." },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed.captions) || parsed.captions.length === 0) {
      return NextResponse.json(
        { error: "Invalid response format. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ captions: parsed.captions });
  } catch (err: unknown) {
    console.error("Photo caption generation error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Caption generation failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
