import { describe, expect, it } from "vitest";
import { advance, decide, initialWorkflowState, replayFixture, replayFixtureSchema, verifyReplay } from "../lib/domain";

describe("Replay domain", () => {
  it("rejects unknown contract keys", () => expect(() => replayFixtureSchema.parse({ ...replayFixture, unexpected: true })).toThrow());
  it("blocks compilation until every proposal is approved", () => {
    let state = advance(advance(advance(initialWorkflowState, replayFixture), replayFixture), replayFixture);
    expect(state.stage).toBe("review_pending");
    expect(() => advance(state, replayFixture)).toThrow(/explicit approval/);
    for (const proposal of replayFixture.proposals) state = decide(state, { proposalId: proposal.id, decision: "approved", userTimestamp: "2026-07-19T00:00:00.000Z" }, replayFixture);
    expect(advance(state, replayFixture).stage).toBe("candidate_compiled");
  });
  it("keeps Replay grounded and bounded", () => {
    const results = verifyReplay(replayFixture, initialWorkflowState);
    expect(results.filter((item) => item.name !== "human_approval").every((item) => item.passed)).toBe(true);
    expect(results.find((item) => item.name === "human_approval")?.passed).toBe(false);
  });
});
