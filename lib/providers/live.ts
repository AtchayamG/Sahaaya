import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { liveAnalysisSchema, replayFixture, type LiveAnalysis } from "../domain";

export class LiveProviderError extends Error {
  constructor(public readonly code: "missing_key" | "refused" | "invalid_output" | "provider_error", message: string, options?: ErrorOptions) { super(message, options); }
}

export async function analyzeWithGpt56(note: string): Promise<LiveAnalysis> {
  if (!process.env.OPENAI_API_KEY) throw new LiveProviderError("missing_key", "Live GPT-5.6 is unavailable because the server key is not configured.");
  if (!note.trim() || note.length > 4000) throw new LiveProviderError("invalid_output", "The continuity note must contain 1 to 4,000 characters.");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await client.responses.parse({
      model: "gpt-5.6",
      store: false,
      reasoning: { effort: "low" },
      max_output_tokens: 4000,
      input: [
        { role: "system", content: "You map a fictional household continuity note into exactly five bounded responsibilities. Use only the supplied fact and member IDs. Never invent credentials, access codes, medical/legal/financial advice, external actions, or emergency dispatch. Cite every proposal and responsibility. Return blocking gaps when the note cannot ground a required detail." },
        { role: "user", content: JSON.stringify({ note, allowedFacts: replayFixture.facts, allowedMembers: replayFixture.members }) },
      ],
      text: { format: zodTextFormat(liveAnalysisSchema, "sahaaya_continuity_analysis") },
    });
    if (!response.output_parsed) throw new LiveProviderError("refused", "GPT-5.6 did not return an analysis that can be used.");
    const parsed = liveAnalysisSchema.parse(response.output_parsed);
    validateGrounding(parsed);
    return parsed;
  } catch (error) {
    if (error instanceof LiveProviderError) throw error;
    if (error instanceof OpenAI.APIError) throw new LiveProviderError("provider_error", `Live GPT-5.6 provider request failed (HTTP ${error.status}, code ${error.code ?? "unknown"}).`);
    console.error("Sahaaya live provider failed", error instanceof Error ? `${error.name}: ${error.message}` : "Unknown provider failure");
    throw new LiveProviderError("provider_error", "Live GPT-5.6 could not complete the analysis. Replay remains available separately.", { cause: error });
  }
}

function validateGrounding(analysis: LiveAnalysis): void {
  const factIds = new Set(replayFixture.facts.map((item) => item.id));
  const memberIds = new Set(replayFixture.members.map((item) => item.id));
  const responsibilityIds = new Set(analysis.responsibilities.map((item) => item.id));
  const grounded = analysis.responsibilities.every((item) => item.sourceFactIds.every((id) => factIds.has(id)))
    && analysis.proposals.every((item) => responsibilityIds.has(item.responsibilityId) && memberIds.has(item.primaryMemberId) && item.rationaleFactIds.every((id) => factIds.has(id)))
    && analysis.gaps.every((item) => item.sourceFactIds.every((id) => factIds.has(id)) && item.affectedResponsibilityIds.every((id) => responsibilityIds.has(id)));
  if (!grounded) throw new LiveProviderError("invalid_output", "Live analysis referenced evidence outside the bounded household facts.");
}
