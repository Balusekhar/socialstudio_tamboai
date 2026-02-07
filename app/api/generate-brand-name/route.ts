import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a brand naming expert and creative strategist. Your job is to generate unique, memorable brand name suggestions based on the user's description, industry, and preferred style.

**Naming Rules:**
- Generate exactly 8 brand name suggestions.
- Each name should be unique, memorable, and easy to pronounce.
- Names should be 1-3 words max.
- Include a short, catchy tagline for each name (under 10 words).
- Consider domain availability — prefer names that could have a .com domain.
- Mix different creative approaches: portmanteaus, abstract words, descriptive names, invented words.
- Avoid generic or overused naming patterns.
- Match the requested style (modern, playful, professional, abstract, descriptive, short).

**Output Format (strict JSON):**
{
  "suggestions": [
    { "name": "BrandName", "tagline": "A short catchy tagline here", "available": true },
    { "name": "AnotherName", "tagline": "Another catchy tagline", "available": true }
  ]
}

Notes:
- Set "available" to true for all suggestions (this is a placeholder — real availability checks would need a domain API).
- Return ONLY the JSON object. No markdown, no code fences, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const { keywords, industry, nameStyle } = await req.json();

    if (!keywords || typeof keywords !== "string" || keywords.trim().length === 0) {
      return NextResponse.json(
        { error: "Keywords or a brand description is required." },
        { status: 400 },
      );
    }

    const userMessage = `Keywords/Description: ${keywords.trim()}
Industry: ${industry || "general"}
Name Style: ${nameStyle || "modern"}

Generate 8 unique brand name suggestions with taglines.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.95,
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "No names were generated. Please try again." },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
      return NextResponse.json(
        { error: "Invalid response format. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ suggestions: parsed.suggestions });
  } catch (err: unknown) {
    console.error("Brand name generation error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Brand name generation failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
