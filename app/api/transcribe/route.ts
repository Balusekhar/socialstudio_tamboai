import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Video file is required." }, { status: 400 });
    }

    // Call OpenAI Whisper API to generate SRT
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "srt",
    });

    return NextResponse.json({ srt: transcription });
  } catch (err: unknown) {
    console.error("Whisper transcription error:", err);

    const message =
      err instanceof Error ? err.message : "Transcription failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
