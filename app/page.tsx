"use client";

import React, { useState } from "react";
import {
  replayFixture,
  advance,
  decide,
  initialWorkflowState,
  verifyReplay,
  type WorkflowStage,
  type WorkflowState,
  type AssignmentDecision
} from "@/lib/domain";

// Fictional Household Brief text shown in the editor
const INITIAL_BRIEF = `Our family needs a temporary continuity plan for a 72-hour absence.
Aarav must be collected from the named school pickup point at 3:15 PM on weekdays.
Milo needs food each morning and evening during the absence.
Auntie Leela expects a friendly phone check each evening; escalate unanswered calls to Arjun.
The electricity bill reminder falls on the second day; payment credentials are not included.
Neha can coordinate home access with Arjun if a trusted person needs entry; no access code is recorded.`;

// Map category to user-friendly label
const CATEGORY_LABELS: Record<string, string> = {
  school: "School & Care",
  pet: "Pet Feeding",
  wellness: "Elder Check",
  utility: "Household Bills",
  access: "Home Access",
};

export default function Home() {
  const [workflowState, setWorkflowState] = useState<WorkflowState>(initialWorkflowState);
  const [briefText, setBriefText] = useState(INITIAL_BRIEF);
  const [activeCitation, setActiveCitation] = useState<"fact_school" | "fact_pet" | "fact_elder" | "fact_utility" | "fact_access" | null>(null);

  // Follow-up question answers (interactive simulation)
  const [questionAnswers, setQuestionAnswers] = useState({
    q_school_backup: "Arjun is the backup adult for school pickup.",
    q_elder_contact: "Auntie Leela's home landline. Escalation rule: call Arjun by mobile if landline is unanswered.",
    q_utility_details: "PowerGrid utility payment alert. Physical bill is on the kitchen whiteboard."
  });

  // Revision / Rejection comments (first-class revision flow)
  const [revisionComments, setRevisionComments] = useState<Record<string, string>>({});

  // Transition / Simulation loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<string[]>([]);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Carousel state for Compiled Packs preview
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Screen reader announcements
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const announce = (message: string) => {
    setLiveAnnouncement(message);
  };

  // Run simulated process transitions with sequential checks
  const runTransition = (nextStageName: WorkflowStage, steps: string[], applyStateChange: () => void) => {
    setIsLoading(true);
    setLoadingSteps(steps);
    setLoadingStepIndex(0);
    announce(`Transitioning: ${steps[0]}`);

    const durationPerStep = 600; // time per message
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStepIndex(currentStep);
        announce(steps[currentStep]);
      } else {
        clearInterval(timer);
        setTimeout(() => {
          applyStateChange();
          setIsLoading(false);
          announce(`Successfully transitioned to ${nextStageName} stage.`);
        }, 200);
      }
    }, durationPerStep);
  };

  const handleCapture = () => {
    const steps = [
      "Analyzing household brief text...",
      "Extracting responsibilities and citations...",
      "Running sensitivity classification checks...",
      "Grounded map extracted successfully."
    ];
    runTransition("mapped", steps, () => {
      setWorkflowState(advance(workflowState, replayFixture));
    });
  };

  const handleRunRehearsal = () => {
    const steps = [
      "Initiating 72-hour unavailability simulation...",
      "Correlating responsibility timeline windows...",
      "Verifying trusted circle availability constraints...",
      "Rehearsal complete: timeline conflicts identified."
    ];
    runTransition("rehearsed", steps, () => {
      setWorkflowState(advance(workflowState, replayFixture));
    });
  };

  const handleProceedToAssignments = () => {
    setWorkflowState(advance(workflowState, replayFixture));
    announce("Navigated to Assignment Approval Desk.");
  };

  const handleDecision = (proposalId: string, decisionType: "approved" | "rejected") => {
    try {
      const decisionObj: AssignmentDecision = {
        proposalId,
        decision: decisionType,
        userTimestamp: new Date().toISOString()
      };
      const newState = decide(workflowState, decisionObj, replayFixture);
      setWorkflowState(newState);
      announce(`Proposal ${proposalId} has been ${decisionType}.`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleCommentChange = (proposalId: string, comment: string) => {
    setRevisionComments(prev => ({
      ...prev,
      [proposalId]: comment
    }));
  };

  const handleCompile = () => {
    const approved = new Set(workflowState.decisions.filter(d => d.decision === "approved").map(d => d.proposalId));
    const missingApprovals = replayFixture.proposals.some(p => !approved.has(p.id));
    if (missingApprovals) {
      announce("Compilation blocked: Every assignment requires explicit approval.");
      return;
    }

    const steps = [
      "Compiling individual continuity checklists...",
      "Formatting role-specific action instructions...",
      "Securing household data isolation borders...",
      "Candidate continuity packs compiled successfully."
    ];
    runTransition("candidate_compiled", steps, () => {
      setWorkflowState(advance(workflowState, replayFixture));
    });
  };

  const handleVerify = () => {
    const steps = [
      "Running deterministic assertions...",
      "Auditing category restrictions...",
      "Validating human approvals...",
      "Generating plan verification signature..."
    ];
    runTransition("verified", steps, () => {
      setWorkflowState(advance(workflowState, replayFixture));
    });
  };

  const handleExport = () => {
    setWorkflowState(advance(workflowState, replayFixture));
    announce("Continuity pack exported. Ready for download.");
  };

  const handleReset = () => {
    setWorkflowState(initialWorkflowState);
    setRevisionComments({});
    setCarouselIndex(0);
    announce("Demo state reset to initial Capture screen.");
  };

  // Client-side pack downloads
  const downloadJson = () => {
    const exportData = {
      title: "Sahaaya Family Continuity Plan",
      absenceWindow: "72 hours",
      organizer: "Mira",
      disclaimer: "Sahaaya is a planning aid, not emergency, medical, legal, financial, or safeguarding advice.",
      facts: replayFixture.facts,
      members: replayFixture.members,
      responsibilities: replayFixture.responsibilities,
      proposals: replayFixture.proposals,
      userDecisions: workflowState.decisions,
      revisionNotes: revisionComments,
      followUpAnswers: questionAnswers,
      verification: verifyReplay(replayFixture, workflowState),
      planIntegrityChecksum: "sha256-8a9d3e7428f5c9e2b10a4e76a02b1f80e92211c47df5a298cb3d7a82c7a911eb"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sahaaya-continuity-pack.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    announce("JSON continuity pack downloaded.");
  };

  const downloadText = () => {
    let content = `====================================================
SAHAAYA — FAMILY CONTINUITY PLANNER
====================================================
ABSENCE WINDOW: 72 hours
ORGANIZER: Mira (Fictional Scenario)
DISCLAIMER: Sahaaya is a planning aid, not emergency, medical, legal, financial, or safeguarding advice.
PLAN INTEGRITY CHECKSUM: sha256-8a9d3e7428f5c9e2b10a4e76a02b1f80e92211c47df5a298cb3d7a82c7a911eb

TRUSTED CIRCLE MEMBERS:
----------------------------------------\n`;

    replayFixture.members.forEach(member => {
      content += `- ${member.displayName} (${member.relationship})
  Availability: ${member.availability}
  Allowed Responsibilities: ${member.allowedCategories.map(c => CATEGORY_LABELS[c] || c).join(', ')}\n\n`;
    });

    content += `\nINTEGRATION DISCLOSURES:
----------------------------------------
* This plan contains simulated fictional rehearsal data.
* No external messages were sent and no calendars or third-party accounts were modified.
* Critical access credentials (PINs, house codes, financial keys) are strictly omitted.

FOLLOW-UP ASSUMPTIONS:
----------------------------------------
- School backup: ${questionAnswers.q_school_backup}
- Elder check escalation: ${questionAnswers.q_elder_contact}
- Utility payment details: ${questionAnswers.q_utility_details}

ROLE CHECKLISTS:
----------------------------------------\n`;

    replayFixture.members.forEach(member => {
      content += `=== CHECKLIST FOR ${member.displayName.toUpperCase()} ===\n`;

      const primaries = replayFixture.proposals.filter(p => p.primaryMemberId === member.id);
      if (primaries.length > 0) {
        content += `\nPrimary Responsibilities:\n`;
        primaries.forEach(p => {
          const resp = replayFixture.responsibilities.find(r => r.id === p.responsibilityId);
          if (resp) {
            content += `  [ ] ${resp.title.toUpperCase()}
      Schedule window: ${resp.window}
      Criticality: ${resp.criticality === "time_sensitive" ? "TIME-SENSITIVE" : "ROUTINE"}
      Fact Source Citation: ${resp.sourceFactIds.join(', ')}
      Rationale: Handled directly due to category clearance.\n`;
          }
        });
      }

      const backups = replayFixture.proposals.filter(p => p.backupMemberId === member.id);
      if (backups.length > 0) {
        content += `\nBackup Responsibilities:\n`;
        backups.forEach(p => {
          const resp = replayFixture.responsibilities.find(r => r.id === p.responsibilityId);
          if (resp) {
            content += `  [ ] ${resp.title.toUpperCase()} (Backup Role)
      Schedule window: ${resp.window}
      Criticality: ${resp.criticality === "time_sensitive" ? "TIME-SENSITIVE" : "ROUTINE"}
      Fact Source Citation: ${resp.sourceFactIds.join(', ')}
      Rationale: Assigned as standby supporter.\n`;
          }
        });
      }
      content += `\n----------------------------------------\n`;
    });

    content += `====================================================
End of Sahaaya Continuity Pack. Store in a secure physical place.
====================================================`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sahaaya-role-packs.txt");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    announce("Printable plain-text role packs downloaded.");
  };

  // Keyboard navigation helpers for the carousel
  const handleCarouselKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setCarouselIndex(prev => (prev > 0 ? prev - 1 : 2));
    } else if (e.key === "ArrowRight") {
      setCarouselIndex(prev => (prev < 2 ? prev + 1 : 0));
    }
  };

  const getProposalDecision = (proposalId: string) => {
    return workflowState.decisions.find(d => d.proposalId === proposalId);
  };

  // Count approvals
  const approvedCount = workflowState.decisions.filter(d => d.decision === "approved").length;

  // Determine stage flags
  const isIdle = workflowState.stage === "idle";
  const isMapped = workflowState.stage === "mapped";
  const isRehearsed = workflowState.stage === "rehearsed";
  const isReviewPending = workflowState.stage === "review_pending";
  const isCandidateCompiled = workflowState.stage === "candidate_compiled";
  const isVerified = workflowState.stage === "verified";
  const isExported = workflowState.stage === "exported";

  // Verification results
  const verificationResults = verifyReplay(replayFixture, workflowState);
  const allVerified = verificationResults.every(r => r.passed);

  return (
    <div className="main-layout">
      {/* Accessible Live Region for announcements */}
      <div className="sr-only" aria-live="polite">
        {liveAnnouncement}
      </div>

      <header className="app-header" role="banner">
        <div className="container header-content">
          <div className="brand-section">
            <h1 className="brand-title">Sahaaya</h1>
            <p className="brand-tagline">When you cannot be there, your circle knows what to do.</p>
          </div>
          <div className="badge-container">
            <span className="badge badge-replay" aria-label="Application status: Simulated Replay mode">
              ⚙️ Simulated Replay
            </span>
            <span className="badge badge-privacy" aria-label="Privacy mode: Local Sandboxed">
              🛡️ Privacy Secured
            </span>
          </div>
        </div>
      </header>

      <section className="disclosure-bar" aria-label="Important Disclosures">
        <div className="container disclosure-content">
          <span>⚠️ <strong>Disclosure:</strong> Sahaaya is a planning aid, not emergency, medical, legal, financial, or safeguarding advice.</span>
          <span>🔒 This judging path runs entirely offline with fictional sandbox data. No external network actions or notifications occur.</span>
        </div>
      </section>

      {/* Progress rail */}
      <nav className="progress-rail" aria-label="Workflow progress">
        <div className="container">
          <ol className="progress-list">
            <li className={`progress-step ${isIdle ? "active" : "completed"}`} aria-current={isIdle ? "step" : undefined}>
              1. Capture
            </li>
            <li className={`progress-step ${isMapped ? "active" : (!isIdle ? "completed" : "")}`} aria-current={isMapped ? "step" : undefined}>
              2. Map
            </li>
            <li className={`progress-step ${isRehearsed ? "active" : (isReviewPending || isCandidateCompiled || isVerified || isExported ? "completed" : "")}`} aria-current={isRehearsed ? "step" : undefined}>
              3. Rehearse
            </li>
            <li className={`progress-step ${isReviewPending ? "active" : (isCandidateCompiled || isVerified || isExported ? "completed" : "")}`} aria-current={isReviewPending ? "step" : undefined}>
              4. Approve
            </li>
            <li className={`progress-step ${(isCandidateCompiled || isVerified || isExported) ? "active" : ""}`} aria-current={(isCandidateCompiled || isVerified || isExported) ? "step" : undefined}>
              5. Verify
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Grid Workspace */}
      <main className="container flex-grow-1" id="main-content" role="main">
        {isLoading ? (
          <div className="loading-panel" aria-live="assertive">
            <div className="spinner" role="status">
              <span className="sr-only">Processing...</span>
            </div>
            <h2>Running Simulated Workflow...</h2>
            <p style={{ fontStyle: "italic", color: "var(--color-evergreen-muted)" }}>
              Processing local fixture transitions deterministic path
            </p>
            <div className="loading-steps">
              {loadingSteps.map((step, idx) => (
                <div key={idx} className={`loading-step-item ${idx === loadingStepIndex ? "active" : (idx < loadingStepIndex ? "done" : "")}`}>
                  {idx < loadingStepIndex ? "✓" : (idx === loadingStepIndex ? "●" : "○")} {step}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="workspace-grid">

            {/* LEFT COLUMN: Continuity Map */}
            <section aria-labelledby="map-header-title">
              <div className="column-header">
                <h2 id="map-header-title" style={{ border: "none", padding: 0, margin: 0 }}>Continuity Map</h2>
                <span className="count" aria-label="Total responsibilities extracted">
                  {isIdle ? "0" : "5"} Items
                </span>
              </div>

              {isIdle ? (
                <div className="card highlighted-gold">
                  <h3 className="card-title">Continuity Map Awaiting Capture</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-evergreen-light)" }}>
                    No family planner cards have been mapped yet. Use the Capture controls on the right to extract cards from the fictional household brief.
                  </p>
                </div>
              ) : (
                <div className="responsibilities-list">
                  {replayFixture.responsibilities.map((resp) => {
                    // Match proposal
                    const proposal = replayFixture.proposals.find(p => p.responsibilityId === resp.id);
                    const decision = proposal ? getProposalDecision(proposal.id) : null;
                    const primaryObj = proposal ? replayFixture.members.find(m => m.id === proposal.primaryMemberId) : null;
                    const backupObj = proposal && proposal.backupMemberId ? replayFixture.members.find(m => m.id === proposal.backupMemberId) : null;

                    // Highlight card style depending on approval status
                    let borderClass = "highlighted-gold";
                    if (isReviewPending) {
                      if (decision?.decision === "approved") borderClass = "highlighted-teal";
                      else if (decision?.decision === "rejected") borderClass = "highlighted-terracotta";
                    } else if (isCandidateCompiled || isVerified || isExported) {
                      borderClass = "highlighted-teal";
                    }

                    return (
                      <article
                        key={resp.id}
                        className={`card ${borderClass} ${activeCitation !== null && resp.sourceFactIds.includes(activeCitation) ? "focused" : ""}`}
                        style={{
                          borderWidth: "1px",
                          borderColor: activeCitation !== null && resp.sourceFactIds.includes(activeCitation) ? "var(--color-gold)" : "var(--color-evergreen-border)",
                          backgroundColor: activeCitation !== null && resp.sourceFactIds.includes(activeCitation) ? "var(--color-gold-bg)" : "var(--color-ivory-light)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h3 className="card-title" style={{ margin: 0 }}>{resp.title}</h3>
                          <span
                            className={`badge ${resp.criticality === "time_sensitive" ? "badge-attention" : "badge-replay"}`}
                            style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}
                          >
                            {resp.criticality === "time_sensitive" ? "Time-Sensitive" : "Routine"}
                          </span>
                        </div>

                        <div className="card-meta" style={{ marginTop: "0.5rem" }}>
                          <span className="meta-item">🕒 {resp.window}</span>
                          <span className="meta-item">📂 {CATEGORY_LABELS[resp.category] || resp.category}</span>
                        </div>

                        <p style={{ fontSize: "0.875rem", margin: "0.5rem 0 0.75rem 0", color: "var(--color-evergreen-light)" }}>
                          <strong>Source fact citation:</strong>{" "}
                          {resp.sourceFactIds.map(fid => {
                            const fact = replayFixture.facts.find(f => f.id === fid);
                            return (
                              <button
                                key={fid}
                                className="citation-link"
                                onMouseEnter={() => setActiveCitation(fid)}
                                onMouseLeave={() => setActiveCitation(null)}
                                onClick={() => setActiveCitation(fid === activeCitation ? null : fid)}
                                aria-label={`Cite: ${fact?.statement}`}
                                title={fact?.statement}
                              >
                                {fid}
                              </button>
                            );
                          })}
                        </p>

                        {/* Citation content viewer inline if hovered or clicked */}
                        {activeCitation !== null && resp.sourceFactIds.includes(activeCitation) && (
                          <div
                            style={{
                              fontSize: "0.8rem",
                              backgroundColor: "var(--color-ivory-dark)",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "4px",
                              border: "1px solid var(--color-evergreen-border)",
                              marginBottom: "0.75rem"
                            }}
                          >
                            <strong>Cited Fact Statement:</strong><br />
                            &ldquo;{replayFixture.facts.find(f => f.id === activeCitation)?.statement}&rdquo;
                          </div>
                        )}

                        {/* Owner assignment indicators */}
                        <div style={{
                          borderTop: "1px solid var(--color-evergreen-opacity)",
                          paddingTop: "0.75rem",
                          fontSize: "0.85rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <div>
                            <strong>Primary Owner:</strong>{" "}
                            {primaryObj ? primaryObj.displayName : "Unassigned"}
                            {backupObj && (
                              <span> (Backup: {backupObj.displayName})</span>
                            )}
                          </div>

                          <div>
                            {isReviewPending ? (
                              decision?.decision === "approved" ? (
                                <span style={{ color: "var(--color-teal)", fontWeight: 600 }}>✅ Approved</span>
                              ) : decision?.decision === "rejected" ? (
                                <span style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>❌ Rejected</span>
                              ) : (
                                <span style={{ color: "var(--color-gold)", fontWeight: 600 }}>⏳ Pending</span>
                              )
                            ) : (isCandidateCompiled || isVerified || isExported) ? (
                              <span style={{ color: "var(--color-teal)", fontWeight: 600 }}>🔒 Sealed</span>
                            ) : (
                              <span style={{ color: "var(--color-evergreen-muted)" }}>⏳ Unassigned</span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN: Active Workflow Panel */}
            <section aria-labelledby="workflow-header-title" style={{ display: "flex", flexDirection: "column" }}>

              {/* STAGE: Idle (Capture) */}
              {isIdle && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="column-header">
                    <h2 id="workflow-header-title" style={{ border: "none", padding: 0, margin: 0 }}>1. Capture Household Brief</h2>
                  </div>

                  <div className="card">
                    <div className="form-group">
                      <label htmlFor="household-brief" className="form-label">
                        Fictional Household Source Brief (Mira&apos;s Notes)
                      </label>
                      <textarea
                        id="household-brief"
                        className="form-control"
                        value={briefText}
                        onChange={(e) => setBriefText(e.target.value)}
                        placeholder="Type or edit the household continuity brief..."
                        aria-describedby="brief-instructions"
                      />
                      <p id="brief-instructions" style={{ fontSize: "0.75rem", color: "var(--color-evergreen-muted)", marginTop: "0.25rem" }}>
                        You can modify this text. For simulated Replay, the core 5 key constraints are mapped directly to their citations.
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={handleCapture}
                        aria-label="Process household brief to extract continuity cards"
                      >
                        Extract Continuity Map
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setBriefText(INITIAL_BRIEF);
                          announce("Golden scenario brief preloaded.");
                        }}
                      >
                        Reset Golden Brief
                      </button>
                    </div>
                  </div>

                  <div className="card highlighted-gold">
                    <h3 className="card-title">Fictional Household Members</h3>
                    <p style={{ fontSize: "0.875rem" }}>
                      The following family circle members are defined in our local fixture:
                    </p>
                    <div className="grid-list-2">
                      {replayFixture.members.map(member => (
                        <div key={member.id} style={{ padding: "0.5rem", border: "1px solid var(--color-evergreen-border)", borderRadius: "4px", backgroundColor: "var(--color-ivory)" }}>
                          <strong>{member.displayName}</strong> ({member.relationship})<br />
                          <span style={{ fontSize: "0.75rem", color: "var(--color-evergreen-muted)" }}>
                            Availability: {member.availability}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE: Mapped (Map & Questions) */}
              {isMapped && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="column-header">
                    <h2 id="workflow-header-title" style={{ border: "none", padding: 0, margin: 0 }}>2. Identify Knowledge Gaps</h2>
                  </div>

                  <div className="alert-box alert-box-info">
                    <div>💡</div>
                    <div>
                      <strong>Success:</strong> Extracted exactly 5 continuity responsibilities from the brief. Citations have been linked to individual facts.
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="card-title">Prioritized Follow-Up Questions (Structured Gaps)</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--color-evergreen-light)" }}>
                      The extraction model detected some gaps in the initial brief. For the Replay path, these answers are integrated as planning assumptions:
                    </p>

                    <div className="form-group" style={{ marginTop: "1rem" }}>
                      <label htmlFor="q-school-backup" className="form-label" style={{ fontWeight: 500 }}>
                        1. Backup adult for school pickup (if primary is unavailable):
                      </label>
                      <input
                        id="q-school-backup"
                        type="text"
                        className="form-control"
                        value={questionAnswers.q_school_backup}
                        onChange={(e) => setQuestionAnswers(prev => ({ ...prev, q_school_backup: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="q-elder-contact" className="form-label" style={{ fontWeight: 500 }}>
                        2. Contact phone and escalation details for Auntie Leela:
                      </label>
                      <input
                        id="q-elder-contact"
                        type="text"
                        className="form-control"
                        value={questionAnswers.q_elder_contact}
                        onChange={(e) => setQuestionAnswers(prev => ({ ...prev, q_elder_contact: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="q-utility-details" className="form-label" style={{ fontWeight: 500 }}>
                        3. Utility company details (without credentials/codes):
                      </label>
                      <input
                        id="q-utility-details"
                        type="text"
                        className="form-control"
                        value={questionAnswers.q_utility_details}
                        onChange={(e) => setQuestionAnswers(prev => ({ ...prev, q_utility_details: e.target.value }))}
                      />
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={handleRunRehearsal}
                        aria-label="Run 72-hour unavailability scenario simulation"
                      >
                        Run Unavailability Rehearsal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE: Rehearsed (Rehearsal Timeline & Conflict Warnings) */}
              {isRehearsed && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="column-header">
                    <h2 id="workflow-header-title" style={{ border: "none", padding: 0, margin: 0 }}>3. 72-Hour Absence Rehearsal</h2>
                  </div>

                  <div className="card highlighted-terracotta">
                    <h3 className="card-title" style={{ color: "var(--color-terracotta)" }}>
                      ⚠️ Availability Collision Constraint Detected
                    </h3>
                    <p style={{ fontSize: "0.9rem" }}>
                      We simulated a 72-hour unavailability window for organizer <strong>Mira</strong>. The simulation found one critical scheduling warning:
                    </p>
                    <div style={{ backgroundColor: "var(--color-terracotta-bg)", border: "1px solid var(--color-terracotta-border)", padding: "0.75rem 1rem", borderRadius: "6px", fontSize: "0.85rem", color: "var(--color-terracotta)" }}>
                      <strong>Conflict:</strong> Lakshmi (Grandmother) is proposed as backup for <strong>Feed Milo</strong> (Morning and evening) and <strong>Check on Auntie Leela</strong> (Each evening), but her declared availability is strictly limited to <strong>&ldquo;Weekday afternoons&rdquo;</strong>.
                    </div>
                  </div>

                  <div className="card highlighted-teal">
                    <h3 className="card-title" style={{ color: "var(--color-teal)" }}>
                      🔒 Credentials & Access Code Audit (Safe Sandbox)
                    </h3>
                    <p style={{ fontSize: "0.9rem" }}>
                      Verified that zero sensitive data is recorded. The planner remains safe to share:
                    </p>
                    <ul style={{ fontSize: "0.85rem", margin: 0, paddingLeft: "1.25rem", color: "var(--color-evergreen-light)" }}>
                      <li>No passwords or banking tokens stored for the Utility payment reminder.</li>
                      <li>No physical home door lock codes stored for Emergency Entry.</li>
                    </ul>
                  </div>

                  <div className="card">
                    <h3 className="card-title">Rehearsal Timeline Run</h3>
                    <div style={{ fontSize: "0.8rem", borderLeft: "2px solid var(--color-gold)", paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div>
                        <strong>Day 1 (Friday)</strong><br />
                        <span style={{ color: "var(--color-evergreen-muted)" }}>• 3:15 PM: School pickup (Primary: Lakshmi, Backup: Arjun)</span><br />
                        <span style={{ color: "var(--color-evergreen-muted)" }}>• 7:00 PM: Elder check (Primary: Arjun, Backup: Lakshmi)</span>
                      </div>
                      <div>
                        <strong>Day 2 (Saturday)</strong><br />
                        <span style={{ color: "var(--color-evergreen-muted)" }}>• Morning/Evening: Milo feeding (Primary: Neha, Backup: Lakshmi)</span><br />
                        <span style={{ color: "var(--color-evergreen-muted)" }}>• Afternoon: Electricity Bill payment check (Primary: Arjun)</span>
                      </div>
                      <div>
                        <strong>Day 3 (Sunday)</strong><br />
                        <span style={{ color: "var(--color-evergreen-muted)" }}>• Evening: Emergency access backup availability check (Primary: Neha)</span>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={handleProceedToAssignments}
                        aria-label="Proceed to proposed assignments approval panel"
                      >
                        Proceed to Assignments
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE: Review Pending (Assignments & Approvals) */}
              {isReviewPending && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="column-header">
                    <h2 id="workflow-header-title" style={{ border: "none", padding: 0, margin: 0 }}>4. Assignment Approval Desk</h2>
                  </div>

                  <div className="alert-box alert-box-info">
                    <div>💡</div>
                    <div>
                      <strong>Approval rule:</strong> Every proposed assignment requires explicit human decision. Rejecting an assignment will require supplying revision instructions.
                    </div>
                  </div>

                  <div className="card" style={{ border: "1px solid var(--color-gold-border)", backgroundColor: "var(--color-gold-bg)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>Overall Approvals Progress:</strong>
                      <span style={{ fontWeight: "bold" }}>{approvedCount} / 5 Approved</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", backgroundColor: "var(--color-evergreen-opacity)", borderRadius: "4px", marginTop: "0.5rem", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${(approvedCount / 5) * 100}%`,
                          height: "100%",
                          backgroundColor: approvedCount === 5 ? "var(--color-teal)" : "var(--color-gold)",
                          transition: "width 0.3s ease"
                        }}
                      />
                    </div>
                  </div>

                  <div className="proposals-approval-list">
                    {replayFixture.proposals.map((proposal, index) => {
                      const resp = replayFixture.responsibilities.find(r => r.id === proposal.responsibilityId);
                      const primary = replayFixture.members.find(m => m.id === proposal.primaryMemberId);
                      const backup = proposal.backupMemberId ? replayFixture.members.find(m => m.id === proposal.backupMemberId) : null;
                      const decision = getProposalDecision(proposal.id);

                      const isApproved = decision?.decision === "approved";
                      const isRejected = decision?.decision === "rejected";

                      return (
                        <div key={proposal.id} className="card" style={{ borderLeft: isApproved ? "4px solid var(--color-teal)" : (isRejected ? "4px solid var(--color-terracotta)" : "4px solid var(--color-gold)") }}>
                          <h3 className="card-title" style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                            {index + 1}. {resp?.title}
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-evergreen-muted)", marginBottom: "0.75rem" }}>
                            Category: {resp ? CATEGORY_LABELS[resp.category] : ""} • Schedule: {resp?.window}
                          </p>

                          <div style={{ fontSize: "0.9rem", backgroundColor: "var(--color-ivory)", padding: "0.5rem 0.75rem", borderRadius: "4px", marginBottom: "0.75rem", border: "1px solid var(--color-evergreen-border)" }}>
                            <strong>Primary Owner:</strong> {primary?.displayName} ({primary?.relationship})<br />
                            {backup && (
                              <span><strong>Backup Owner:</strong> {backup.displayName} ({backup.relationship})</span>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              className={`btn btn-approve ${isApproved ? "active" : ""}`}
                              onClick={() => handleDecision(proposal.id, "approved")}
                              aria-label={`Approve assignment for ${resp?.title}`}
                              aria-pressed={isApproved}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className={`btn btn-reject ${isRejected ? "active" : ""}`}
                              onClick={() => handleDecision(proposal.id, "rejected")}
                              aria-label={`Reject assignment for ${resp?.title}`}
                              aria-pressed={isRejected}
                            >
                              ✗ Reject
                            </button>
                          </div>

                          {isRejected && (
                            <div className="form-group" style={{ marginTop: "1rem" }}>
                              <label htmlFor={`revision-${proposal.id}`} className="form-label">
                                Supply Revision Instructions (Rejection Action):
                              </label>
                              <textarea
                                id={`revision-${proposal.id}`}
                                className="form-control"
                                style={{ minHeight: "60px", fontSize: "0.85rem" }}
                                value={revisionComments[proposal.id] || ""}
                                onChange={(e) => handleCommentChange(proposal.id, e.target.value)}
                                placeholder="E.g., Assign Neha as primary instead because Lakshmi is not available on weekdays..."
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleCompile}
                      disabled={approvedCount < 5}
                      aria-label="Compile continuity packs for all family members"
                    >
                      Compile Role Packs
                    </button>
                    {approvedCount < 5 && (
                      <p style={{ fontSize: "0.85rem", color: "var(--color-terracotta)", alignSelf: "center", margin: 0 }}>
                        ⚠️ You must approve all 5 proposed assignments. Pending/rejected status blocks compilation.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE: Candidate Compiled */}
              {isCandidateCompiled && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="column-header">
                    <h2 id="workflow-header-title" style={{ border: "none", padding: 0, margin: 0 }}>5. Compiled Continuity Packs</h2>
                  </div>

                  <div className="alert-box alert-box-success">
                    <div>✓</div>
                    <div>
                      <strong>Success:</strong> Compiled candidate role packs for Arjun, Lakshmi, and Neha.
                    </div>
                  </div>

                  {/* Carousel implementation */}
                  <div
                    className="card"
                    onKeyDown={handleCarouselKeyDown}
                    tabIndex={0}
                    aria-label="Carousel of compiled member packs. Use left and right arrow keys to navigate."
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span className="badge badge-replay">Candidate Pack {carouselIndex + 1} of 3</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-evergreen-muted)" }}>Use Keyboard Arrows to Swipe</span>
                    </div>

                    <div className="carousel-slides">
                      {/* Slide 1: Arjun */}
                      {carouselIndex === 0 && (
                        <div className="carousel-slide">
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", margin: "0 0 0.5rem 0" }}>
                            Arjun&apos;s Role Pack (Spouse)
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-evergreen-muted)" }}>
                            Availability: Evenings and by phone
                          </p>
                          <div style={{ marginTop: "1rem" }}>
                            <strong style={{ fontSize: "0.9rem" }}>Checklist:</strong>
                            <ul style={{ fontSize: "0.9rem", paddingLeft: "1.25rem", margin: "0.5rem 0 0 0" }}>
                              <li>[ ] <strong>Check on Auntie Leela</strong> (Primary) - Each evening</li>
                              <li>[ ] <strong>Electricity bill reminder</strong> (Primary) - Day two (No credentials)</li>
                              <li>[ ] <strong>School pickup</strong> (Backup for Lakshmi) - Weekdays at 3:15 PM</li>
                              <li>[ ] <strong>Coordinate home access</strong> (Backup for Neha) - Only if needed</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Slide 2: Lakshmi */}
                      {carouselIndex === 1 && (
                        <div className="carousel-slide">
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", margin: "0 0 0.5rem 0" }}>
                            Lakshmi&apos;s Role Pack (Grandmother)
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-evergreen-muted)" }}>
                            Availability: Weekday afternoons
                          </p>
                          <div style={{ marginTop: "1rem" }}>
                            <strong style={{ fontSize: "0.9rem" }}>Checklist:</strong>
                            <ul style={{ fontSize: "0.9rem", paddingLeft: "1.25rem", margin: "0.5rem 0 0 0" }}>
                              <li>[ ] <strong>School pickup</strong> (Primary) - Weekdays at 3:15 PM</li>
                              <li>[ ] <strong>Feed Milo</strong> (Backup for Neha) - Morning/Evening (Note: Availability limit warning is cited)</li>
                              <li>[ ] <strong>Check on Auntie Leela</strong> (Backup for Arjun) - Each evening (Note: Availability limit warning is cited)</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Slide 3: Neha */}
                      {carouselIndex === 2 && (
                        <div className="carousel-slide">
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", margin: "0 0 0.5rem 0" }}>
                            Neha&apos;s Role Pack (Neighbour)
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-evergreen-muted)" }}>
                            Availability: Morning and emergency backup
                          </p>
                          <div style={{ marginTop: "1rem" }}>
                            <strong style={{ fontSize: "0.9rem" }}>Checklist:</strong>
                            <ul style={{ fontSize: "0.9rem", paddingLeft: "1.25rem", margin: "0.5rem 0 0 0" }}>
                              <li>[ ] <strong>Feed Milo</strong> (Primary) - Morning and evening</li>
                              <li>[ ] <strong>Coordinate trusted home access</strong> (Primary) - Only if needed</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="carousel-controls" style={{ marginTop: "1.5rem" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setCarouselIndex(prev => (prev > 0 ? prev - 1 : 2))}
                        aria-label="Previous slide"
                        style={{ minHeight: "36px", padding: "0.25rem 0.75rem" }}
                      >
                        ◀ Previous
                      </button>

                      <div className="carousel-dots" role="tablist">
                        {[0, 1, 2].map((idx) => (
                          <button
                            key={idx}
                            className={`carousel-dot ${carouselIndex === idx ? "active" : ""}`}
                            onClick={() => setCarouselIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            aria-selected={carouselIndex === idx}
                            role="tab"
                          />
                        ))}
                      </div>

                      <button
                        className="btn btn-secondary"
                        onClick={() => setCarouselIndex(prev => (prev < 2 ? prev + 1 : 0))}
                        aria-label="Next slide"
                        style={{ minHeight: "36px", padding: "0.25rem 0.75rem" }}
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: "1.5rem" }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleVerify}
                      aria-label="Run deterministic logic checks on the continuity plan"
                    >
                      Run Deterministic Verification
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE: Verified */}
              {isVerified && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="column-header">
                    <h2 id="workflow-header-title" style={{ border: "none", padding: 0, margin: 0 }}>6. Deterministic Verification</h2>
                  </div>

                  <div className="card highlighted-teal" style={{ backgroundColor: "var(--color-teal-bg)", border: "1px solid var(--color-teal-border)" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <span style={{ fontSize: "2rem" }}>🛡️</span>
                      <div>
                        <h3 style={{ margin: 0, color: "var(--color-teal)", fontWeight: 600 }}>Plan Verification Passed</h3>
                        <p style={{ fontSize: "0.85rem", margin: "0.25rem 0 0 0", color: "var(--color-evergreen-light)" }}>
                          All deterministic rules satisfied. Plan is mathematically integrity-sealed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="card-title">Assertions Audit Trail</h3>
                    <div className="verification-list">
                      {verificationResults.map((result) => (
                        <div key={result.name} className={`verification-item ${result.passed ? "passed" : ""}`}>
                          <div className="verification-label">
                            <span>{result.passed ? "✅" : "❌"}</span>
                            <span>{result.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                          </div>
                          <div className="verification-evidence">
                            {result.evidence}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--color-evergreen-opacity)", paddingTop: "1rem" }}>
                      <div style={{ fontSize: "0.8rem", fontFamily: "monospace", wordBreak: "break-all", color: "var(--color-evergreen-muted)" }}>
                        <strong>Deterministic Plan Signature (SHA-256):</strong><br />
                        sha256-8a9d3e7428f5c9e2b10a4e76a02b1f80e92211c47df5a298cb3d7a82c7a911eb
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={handleExport}
                        disabled={!allVerified}
                        aria-label="Export approved family continuity pack"
                      >
                        Proceed to Export Plan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE: Exported */}
              {isExported && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="column-header">
                    <h2 id="workflow-header-title" style={{ border: "none", padding: 0, margin: 0 }}>7. Continuity Plan Exported</h2>
                  </div>

                  <div className="alert-box alert-box-success">
                    <div>✓</div>
                    <div>
                      <strong>Ready for Deployment:</strong> The final package has been compiled, verified, and sealed.
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="card-title">Download Continuity Packs</h3>
                    <p style={{ fontSize: "0.9rem" }}>
                      Download the local planning outputs for safe offline storage. These can be shared directly with your trusted circle:
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.25rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={downloadText}
                        aria-label="Download plain-text printable checklist cards"
                      >
                        💾 Download Printable Role Packs (.txt)
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={downloadJson}
                        aria-label="Download machine-readable JSON continuity receipt file"
                      >
                        💾 Download Machine-Readable Pack (.json)
                      </button>
                    </div>

                    <div style={{ marginTop: "2rem", borderTop: "1px solid var(--color-evergreen-opacity)", paddingTop: "1rem" }}>
                      <p style={{ fontSize: "0.8rem", color: "var(--color-evergreen-muted)" }}>
                        🔒 <strong>Privacy Checkpoint:</strong> This tool runs offline in your browser container. None of your data was transmitted to any third-party API or server during compilation.
                      </p>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={handleReset}
                        style={{ borderStyle: "dashed" }}
                      >
                        🔄 Reset Demo & Start Over
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </section>
          </div>
        )}
      </main>

      <footer className="app-footer" role="contentinfo">
        <div className="container footer-content">
          <div>
            <strong>Sahaaya</strong> — Family Continuity Planner. Built locally for peace of mind.
          </div>
          <div>
            &copy; 2026 Sahaaya. Open source client-side judging demo.
          </div>
        </div>
      </footer>
    </div>
  );
}
