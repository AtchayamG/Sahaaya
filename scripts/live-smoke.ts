import { analyzeWithGpt56 } from "../lib/providers/live";
import { replayFixture } from "../lib/domain";

async function main() {
  const note = replayFixture.facts.map((fact) => `${fact.id}: ${fact.statement}`).join("\n");
  const analysis = await analyzeWithGpt56(note);

  console.log(JSON.stringify({
    provider: "Live GPT-5.6",
    stored: false,
    status: "validated",
    responsibilities: analysis.responsibilities.length,
    proposals: analysis.proposals.length,
    gaps: analysis.gaps.length,
  }));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown live smoke failure.";
  const cause = error instanceof Error && error.cause instanceof Error ? error.cause.message.slice(0, 240) : undefined;
  console.error(JSON.stringify({ provider: "Live GPT-5.6", status: "failed", message, cause }));
  process.exitCode = 1;
});
