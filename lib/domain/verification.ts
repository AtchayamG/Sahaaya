import type { ReplayFixture } from "./contracts";
import type { WorkflowState } from "./workflow";

export type VerificationResult = Readonly<{ name: string; passed: boolean; evidence: string }>;
export function verifyReplay(fixture: ReplayFixture, state: WorkflowState): ReadonlyArray<VerificationResult> {
  const knownFacts = new Set(fixture.facts.map((fact) => fact.id));
  const knownMembers = new Map(fixture.members.map((member) => [member.id, member]));
  return [
    { name: "exact_responsibility_count", passed: fixture.responsibilities.length === 5, evidence: `${fixture.responsibilities.length} responsibilities` },
    { name: "grounded_responsibilities", passed: fixture.responsibilities.every((item) => item.sourceFactIds.every((id) => knownFacts.has(id))), evidence: "Every responsibility cites a known fact." },
    { name: "allowed_assignments", passed: fixture.proposals.every((proposal) => { const responsibility = fixture.responsibilities.find((item) => item.id === proposal.responsibilityId); const member = knownMembers.get(proposal.primaryMemberId); return Boolean(responsibility && member?.allowedCategories.includes(responsibility.category)); }), evidence: "Every proposed owner allows the responsibility category." },
    { name: "human_approval", passed: fixture.proposals.every((proposal) => state.decisions.some((item) => item.proposalId === proposal.id && item.decision === "approved")), evidence: "Every proposal has an explicit approved decision." },
    { name: "fictional_replay", passed: fixture.scenario.fictional, evidence: "Replay fixture is explicitly fictional." }
  ];
}
