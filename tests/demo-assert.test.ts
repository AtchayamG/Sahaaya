import { expect, it } from "vitest";
import { advance, decide, initialWorkflowState, replayFixture, verifyReplay } from "../lib/domain";

it("completes the deterministic golden path", () => {
  let state = advance(advance(advance(initialWorkflowState, replayFixture), replayFixture), replayFixture);
  for (const proposal of replayFixture.proposals) state = decide(state, { proposalId: proposal.id, decision: "approved", userTimestamp: "2026-07-19T00:00:00.000Z" }, replayFixture);
  state = advance(state, replayFixture);
  expect(verifyReplay(replayFixture, state).every((item) => item.passed)).toBe(true);
  state = advance(state, replayFixture);
  expect(state.stage).toBe("verified");
  state = advance(state, replayFixture);
  expect(state.stage).toBe("exported");
});
