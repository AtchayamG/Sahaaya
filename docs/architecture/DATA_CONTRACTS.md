# Data Contracts

Required contract families:

- `HouseholdFact`: stable ID, category, statement, source label, sensitivity classification.
- `CircleMember`: stable ID, display name, relationship, declared availability, allowed responsibility categories.
- `ContinuityResponsibility`: stable ID, title, source fact IDs, deadline/window, criticality.
- `ContinuityGap`: stable ID, affected responsibility IDs, source fact IDs, severity, explanation, question.
- `AssignmentProposal`: responsibility ID, primary member ID, optional backup ID, rationale fact IDs.
- `AssignmentDecision`: proposal ID, approve/reject, optional revision, user timestamp.
- `RolePack`: member ID, approved responsibility items, citations, unresolved noncritical notes.
- `VerificationResult`: named deterministic assertions and pass/fail evidence.
- `ContinuityReceipt`: run ID, provider label, decision totals, verification summary, content checksum.

All schemas are strict. Unknown keys, IDs, citations, prohibited sensitivity categories, or unsupported responsibility counts fail validation.

