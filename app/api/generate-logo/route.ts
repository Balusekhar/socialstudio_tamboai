import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a world-class brand identity designer. Generate a professional, modern brand logo based on the user's specifications.

**Logo Design Rules:**
- Clean, scalable vector-style design that works at any size.
- Simple and memorable — the best logos are instantly recognizable.
- Use a solid white or transparent-looking background.
- The brand name should be clearly legible if included.
- Icon/symbol should be meaningful and relate to the industry.
- Follow the requested style (minimal, bold, elegant, playful, vintage, geometric).
- Use a limited color palette (2-3 colors max) that fits the industry.
- Professional quality suitable for social media profiles, business cards, and websites.
- Square aspect ratio, centered composition.

**Industry-specific guidance:**
- Technology: Clean lines, modern sans-serif, blue/purple tones.
- Fashion: Elegant serif or thin sans-serif, black/gold/neutral tones.
- Food: Warm colors, approachable shapes, appetizing feel.
- Fitness: Bold, energetic, strong typography, red/orange/black.
- Creative: Artistic, unique, expressive colors.
- E-Commerce: Trustworthy, modern, clean.
- Education: Approachable, structured, blue/green tones.

Generate a high-quality, professional logo image.`;

export async function POST(req: NextRequest) {
  try {
    const { brandName, industry, style } = await req.json();

    if (!brandName || typeof brandName !== "string" || brandName.trim().length === 0) {
      return NextResponse.json(
        { error: "A brand name is required." },
        { status: 400 },
      );
    }

    const prompt = `${SYSTEM_PROMPT}

Brand name: "${brandName.trim()}"
Industry: ${industry || "general"}
Style: ${style || "minimal"}

Create a professional brand logo for "${brandName.trim()}". The logo should be a clean, high-quality design on a solid white background, suitable for Instagram profile picture and social media branding.`;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
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
      { error: "No logo was generated. Please try a different name or style." },
      { status: 500 },
    );
  } catch (err: unknown) {
    console.error("Logo generation error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Logo generation failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
