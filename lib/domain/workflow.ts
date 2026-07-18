import { assignmentDecisionSchema, type AssignmentDecision, type ReplayFixture } from "./contracts";

export type WorkflowStage = "idle" | "mapped" | "rehearsed" | "review_pending" | "candidate_compiled" | "verified" | "exported";
export type WorkflowState = Readonly<{ stage: WorkflowStage; decisions: ReadonlyArray<AssignmentDecision> }>;
export const initialWorkflowState: WorkflowState = { stage: "idle", decisions: [] };
const nextStage: Record<Exclude<WorkflowStage, "exported">, WorkflowStage> = { idle: "mapped", mapped: "rehearsed", rehearsed: "review_pending", review_pending: "candidate_compiled", candidate_compiled: "verified", verified: "exported" };

export function advance(state: WorkflowState, fixture: ReplayFixture): WorkflowState {
  if (state.stage === "exported") return state;
  if (state.stage === "review_pending") {
    const approved = new Set(state.decisions.filter((item) => item.decision === "approved").map((item) => item.proposalId));
    if (fixture.proposals.some((proposal) => !approved.has(proposal.id))) throw new Error("Every assignment requires explicit approval before compilation.");
  }
  return { ...state, stage: nextStage[state.stage] };
}

export function decide(state: WorkflowState, decision: AssignmentDecision, fixture: ReplayFixture): WorkflowState {
  if (state.stage !== "review_pending") throw new Error("Assignment decisions are accepted only during review.");
  const parsed = assignmentDecisionSchema.parse(decision);
  if (!fixture.proposals.some((proposal) => proposal.id === parsed.proposalId)) throw new Error("Unknown proposal ID.");
  return { ...state, decisions: [...state.decisions.filter((item) => item.proposalId !== parsed.proposalId), parsed] };
}
