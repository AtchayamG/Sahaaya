import { afterEach, describe, expect, it } from "vitest";
import { analyzeWithGpt56, LiveProviderError } from "../lib/providers/live";

const originalKey = process.env.OPENAI_API_KEY;
afterEach(() => { if (originalKey) process.env.OPENAI_API_KEY = originalKey; else delete process.env.OPENAI_API_KEY; });

describe("Live provider boundary", () => {
  it("fails closed when the server key is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(analyzeWithGpt56("bounded fictional note")).rejects.toMatchObject({ code: "missing_key" } satisfies Partial<LiveProviderError>);
  });
  it("rejects empty notes before any provider call", async () => {
    process.env.OPENAI_API_KEY = "redacted-test-value";
    await expect(analyzeWithGpt56(" ")).rejects.toMatchObject({ code: "invalid_output" } satisfies Partial<LiveProviderError>);
  });
});
