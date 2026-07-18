import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeWithGpt56, LiveProviderError } from "@/lib/providers/live";

const requestSchema = z.object({ note: z.string().min(1).max(4000) }).strict();

export async function POST(request: Request) {
  try {
    const { note } = requestSchema.parse(await request.json());
    return NextResponse.json({ provider: "Live GPT-5.6", stored: false, analysis: await analyzeWithGpt56(note) });
  } catch (error) {
    if (error instanceof LiveProviderError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.code === "missing_key" ? 503 : 422 });
    if (error instanceof z.ZodError) return NextResponse.json({ error: "invalid_request", message: "A bounded continuity note is required." }, { status: 400 });
    return NextResponse.json({ error: "invalid_request", message: "The request could not be processed." }, { status: 400 });
  }
}
