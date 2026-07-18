import { z } from "zod";

export const factIdSchema = z.enum(["fact_school", "fact_pet", "fact_elder", "fact_utility", "fact_access"]);
export const memberIdSchema = z.enum(["member_arjun", "member_lakshmi", "member_neha"]);
export const responsibilityIdSchema = z.enum(["resp_school", "resp_pet", "resp_elder", "resp_utility", "resp_access"]);
const categorySchema = z.enum(["school", "pet", "wellness", "utility", "access"]);

export const householdFactSchema = z.object({ id: factIdSchema, category: categorySchema, statement: z.string().min(1), sourceLabel: z.string().min(1), sensitivity: z.literal("ordinary_household") }).strict();
export const circleMemberSchema = z.object({ id: memberIdSchema, displayName: z.string().min(1), relationship: z.string().min(1), availability: z.string().min(1), allowedCategories: z.array(categorySchema).min(1) }).strict();
export const responsibilitySchema = z.object({ id: responsibilityIdSchema, title: z.string().min(1), category: categorySchema, sourceFactIds: z.array(factIdSchema).min(1), window: z.string().min(1), criticality: z.enum(["routine", "time_sensitive"]) }).strict();
export const assignmentProposalSchema = z.object({ id: z.string().regex(/^proposal_/), responsibilityId: responsibilityIdSchema, primaryMemberId: memberIdSchema, backupMemberId: memberIdSchema.nullable(), rationaleFactIds: z.array(factIdSchema).min(1) }).strict();
export const assignmentDecisionSchema = z.object({ proposalId: z.string().regex(/^proposal_/), decision: z.enum(["approved", "rejected"]), userTimestamp: z.string().datetime() }).strict();
export const continuityGapSchema = z.object({ id: z.string().regex(/^gap_/), affectedResponsibilityIds: z.array(responsibilityIdSchema).min(1), sourceFactIds: z.array(factIdSchema), severity: z.enum(["noncritical", "blocking"]), explanation: z.string().min(1), question: z.string().min(1) }).strict();
export const liveAnalysisSchema = z.object({ responsibilities: z.array(responsibilitySchema).length(5), gaps: z.array(continuityGapSchema), proposals: z.array(assignmentProposalSchema).length(5) }).strict();
export const replayFixtureSchema = z.object({
  scenario: z.object({ organizer: z.literal("Mira"), absenceWindow: z.literal("72 hours"), fictional: z.literal(true) }).strict(),
  facts: z.array(householdFactSchema).length(5), members: z.array(circleMemberSchema).length(3), responsibilities: z.array(responsibilitySchema).length(5), proposals: z.array(assignmentProposalSchema).length(5),
}).strict();

export type ReplayFixture = z.infer<typeof replayFixtureSchema>;
export type AssignmentDecision = z.infer<typeof assignmentDecisionSchema>;
export type LiveAnalysis = z.infer<typeof liveAnalysisSchema>;
