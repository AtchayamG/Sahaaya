import { replayFixtureSchema } from "./contracts";

export const replayFixture = replayFixtureSchema.parse({
  scenario: { organizer: "Mira", absenceWindow: "72 hours", fictional: true },
  facts: [
    { id: "fact_school", category: "school", statement: "Aarav must be collected from the named school pickup point at 3:15 PM on weekdays.", sourceLabel: "Mira's continuity note", sensitivity: "ordinary_household" },
    { id: "fact_pet", category: "pet", statement: "Milo needs food each morning and evening during the absence.", sourceLabel: "Mira's continuity note", sensitivity: "ordinary_household" },
    { id: "fact_elder", category: "wellness", statement: "Auntie Leela expects a friendly phone check each evening; escalate unanswered calls to Arjun.", sourceLabel: "Mira's continuity note", sensitivity: "ordinary_household" },
    { id: "fact_utility", category: "utility", statement: "The electricity bill reminder falls on the second day; payment credentials are not included.", sourceLabel: "Mira's continuity note", sensitivity: "ordinary_household" },
    { id: "fact_access", category: "access", statement: "Neha can coordinate home access with Arjun if a trusted person needs entry; no access code is recorded.", sourceLabel: "Mira's continuity note", sensitivity: "ordinary_household" }
  ],
  members: [
    { id: "member_arjun", displayName: "Arjun", relationship: "Spouse", availability: "Evenings and by phone", allowedCategories: ["school", "wellness", "utility", "access"] },
    { id: "member_lakshmi", displayName: "Lakshmi", relationship: "Grandmother", availability: "Weekday afternoons", allowedCategories: ["school", "pet", "wellness"] },
    { id: "member_neha", displayName: "Neha", relationship: "Neighbour", availability: "Morning and emergency backup", allowedCategories: ["pet", "access"] }
  ],
  responsibilities: [
    { id: "resp_school", title: "School pickup", category: "school", sourceFactIds: ["fact_school"], window: "Weekdays at 3:15 PM", criticality: "time_sensitive" },
    { id: "resp_pet", title: "Feed Milo", category: "pet", sourceFactIds: ["fact_pet"], window: "Morning and evening", criticality: "routine" },
    { id: "resp_elder", title: "Check on Auntie Leela", category: "wellness", sourceFactIds: ["fact_elder"], window: "Each evening", criticality: "routine" },
    { id: "resp_utility", title: "Electricity bill reminder", category: "utility", sourceFactIds: ["fact_utility"], window: "Day two", criticality: "time_sensitive" },
    { id: "resp_access", title: "Coordinate trusted home access", category: "access", sourceFactIds: ["fact_access"], window: "Only if needed", criticality: "routine" }
  ],
  proposals: [
    { id: "proposal_school", responsibilityId: "resp_school", primaryMemberId: "member_lakshmi", backupMemberId: "member_arjun", rationaleFactIds: ["fact_school"] },
    { id: "proposal_pet", responsibilityId: "resp_pet", primaryMemberId: "member_neha", backupMemberId: "member_lakshmi", rationaleFactIds: ["fact_pet"] },
    { id: "proposal_elder", responsibilityId: "resp_elder", primaryMemberId: "member_arjun", backupMemberId: "member_lakshmi", rationaleFactIds: ["fact_elder"] },
    { id: "proposal_utility", responsibilityId: "resp_utility", primaryMemberId: "member_arjun", rationaleFactIds: ["fact_utility"] },
    { id: "proposal_access", responsibilityId: "resp_access", primaryMemberId: "member_neha", backupMemberId: "member_arjun", rationaleFactIds: ["fact_access"] }
  ]
});
