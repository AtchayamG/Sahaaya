import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import type { ReplayFixture } from "./contracts";
import type { WorkflowState } from "./workflow";
import { verifyReplay, type VerificationResult } from "./verification";

export type RolePackItem = Readonly<{ responsibilityId: string; title: string; window: string; citationIds: readonly string[] }>;
export type RolePack = Readonly<{ memberId: string; memberName: string; items: readonly RolePackItem[] }>;
export type ContinuityReceipt = Readonly<{ runId: string; provider: "Replay" | "Live GPT-5.6"; approvedDecisions: number; verification: readonly VerificationResult[]; checksum: string }>;
export type CompiledContinuity = Readonly<{ packs: readonly RolePack[]; receipt: ContinuityReceipt }>;

export function compileContinuity(fixture: ReplayFixture, state: WorkflowState, provider: ContinuityReceipt["provider"] = "Replay"): CompiledContinuity {
  const verification = verifyReplay(fixture, state);
  if (verification.some((result) => !result.passed)) throw new Error("Continuity pack failed deterministic verification.");
  const packs = fixture.members.map((member) => ({
    memberId: member.id,
    memberName: member.displayName,
    items: fixture.proposals.filter((proposal) => proposal.primaryMemberId === member.id).map((proposal) => {
      const responsibility = fixture.responsibilities.find((item) => item.id === proposal.responsibilityId);
      if (!responsibility) throw new Error("Proposal references an unknown responsibility.");
      return { responsibilityId: responsibility.id, title: responsibility.title, window: responsibility.window, citationIds: responsibility.sourceFactIds };
    }),
  })).filter((pack) => pack.items.length > 0);
  const canonical = JSON.stringify({ provider, packs, verification });
  const checksum = bytesToHex(sha256(new TextEncoder().encode(canonical)));
  return {
    packs,
    receipt: {
      runId: `run_${checksum.slice(0, 12)}`,
      provider,
      approvedDecisions: state.decisions.filter((item) => item.decision === "approved").length,
      verification,
      checksum,
    },
  };
}
