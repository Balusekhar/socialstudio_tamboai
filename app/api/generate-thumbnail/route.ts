import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a YouTube thumbnail design expert specializing in high-CTR visuals that boost click-through rates by 20-30%. Every thumbnail must follow these strict rules based on 2026 best practices:

**Core Principles (ALWAYS enforce):**
- One focal point only: Single subject (face, product, or key object) dominating 40-60% of frame.
- Faces with strong emotion: Wide eyes, open mouth (surprise/excitement), direct gaze. Faces increase CTR 20-30%.
- Bold text: 4 words MAX, all caps, sans-serif font (Impact/Bebas/Arial Black), 100pt+ equivalent, white/neon with thick black outline + glow/drop shadow.
- High contrast: Bright subject on dark/blurred background. Never low-contrast or pastel.
- Visual cues: 1 arrow or circle max, red/yellow, pointing to mystery element.
- Composition: Text left, face/object right. Eyes in upper third. 16:9 aspect (1280x720), mobile-readable at 168x94px.
- Background: Blurred gradient (dark blue/purple/black) or solid dark color. No clutter.
- Curiosity gap: Promise transformation ("Master X Fast", "$0 to $10K", "I Was Wrong").
- Colors: Neon accents (blue/cyan/red) on dark base. Avoid busy patterns.

**Output Format:**
Generate ultra-detailed, ultra-realistic, cinematic thumbnail. Include sharp details, photorealistic, 8K quality. --ar 16:9 --v 6 --q 2 --style raw.

**Reject if:**
- Text >4 words or unreadable.
- Multiple focal points or clutter.
- No emotion/face (unless product demo).
- Low contrast or busy background.

User's thumbnail request:
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, editPrompt, imageData } = await req.json();

    // Edit mode: modify an existing image
    if (editPrompt && imageData) {
      if (typeof editPrompt !== "string" || editPrompt.trim().length === 0) {
        return NextResponse.json(
          { error: "An edit instruction is required." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(imageData, "base64");
      const file = await toFile(buffer, "thumbnail.png", {
        type: "image/png",
      });

      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: file,
        prompt: SYSTEM_PROMPT + editPrompt.trim(),
        size: "1536x1024",
      });

      if (response.data?.[0]?.b64_json) {
        return NextResponse.json({
          image: {
            data: response.data[0].b64_json,
            mimeType: "image/png",
          },
        });
      }

      return NextResponse.json(
        { error: "Failed to edit the image. Please try again." },
        { status: 500 },
      );
    }

    // Generate mode: create a new thumbnail
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "A prompt is required." },
        { status: 400 },
      );
    }

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: SYSTEM_PROMPT + prompt.trim(),
      n: 1,
      size: "1536x1024",
      quality: "medium",
    });

    if (response.data?.[0]?.b64_json) {
      return NextResponse.json({
        image: {
          data: response.data[0].b64_json,
          mimeType: "image/png",
        },
      });
    }

    return NextResponse.json(
      { error: "No image was generated. Please try a different prompt." },
      { status: 500 },
    );
  } catch (err: unknown) {
    console.error("Thumbnail generation error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Image generation failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
