import { useState } from "react";

const API = "";

function PipelineStep({ number, title, active, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: done ? "#111827" : active ? "#2563eb" : "#e5e7eb",
          color: done || active ? "#fff" : "#6b7280",
          fontWeight: 900,
          transition: "0.3s",
          boxShadow: active ? "0 0 0 5px #dbeafe" : "none",
          flexShrink: 0,
        }}
      >
        {done ? "✓" : number}
      </div>

      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 900,
            color: "#111827",
            opacity: 1,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

function Line({ active }) {
  return (
    <div
      style={{
        height: 2,
        flex: 1,
        minWidth: 20,
        background: active ? "#2563eb" : "#e5e7eb",
        transition: "0.3s",
      }}
    />
  );
}

function Check({ label, value, state }) {
  let color = "#64748b";
  let background = "#f1f5f9";
  let icon = "—";

  if (state === "verified") {
    color = "#166534";
    background = "#dcfce7";
    icon = "✓";
  }

  if (state === "tampered") {
    color = "#b91c1c";
    background = "#fee2e2";
    icon = "!";
  }

  if (state === "checking") {
    color = "#1d4ed8";
    background = "#dbeafe";
    icon = "…";
  }

  if (state === "simulated") {
    color = "#92400e";
    background = "#fef3c7";
    icon = "S";
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "13px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#111827",
          opacity: 1,
        }}
      >
        {label}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color,
          }}
        >
          {value}
        </span>

        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            background,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [flow, setFlow] = useState(0);
  const [status, setStatus] = useState("idle");

  const [message, setMessage] = useState(
    "Click Start Agent to begin the demonstration."
  );

  const [action, setAction] = useState(
    "AI agent compared suppliers and generated a recommendation."
  );

  const [decision, setDecision] = useState(null);
  const [recordId, setRecordId] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [tampered, setTampered] = useState(false);

  function startAgent() {
    setFlow(1);
    setStatus("running");
    setTampered(false);
    setRecordId("");
    setEvidence(null);
    setDecision(null);

    setMessage(
      "AGENT → Procurement task received. Ready to analyze suppliers."
    );
  }

  async function nextStep() {
    if (flow === 1) {
      setFlow(2);
      setStatus("running");

      setMessage(
        "AGENT → Analyzing available supplier information..."
      );

      return;
    }

    if (flow === 2) {
      const agentDecision = {
        supplier: "Northstar Industrial",
        score: "92/100",
        reason:
          "Best combined price, delivery and reliability score.",
      };

      setDecision(agentDecision);

      setAction(
        `Demo agent recommended ${agentDecision.supplier} with a score of ${agentDecision.score}. ${agentDecision.reason}`
      );

      setFlow(3);
      setStatus("running");

      setMessage(
        "AGENT → Decision generated. Recommendation is ready to be recorded."
      );

      return;
    }

    if (flow === 3) {
      setFlow(4);
      setStatus("running");

      setMessage(
        "OBSERVE → Capturing the agent's action..."
      );

      return;
    }

    if (flow === 4) {
      setFlow(5);
      setStatus("running");

      setMessage(
        "COMMIT → Creating cryptographic commitment..."
      );

      return;
    }

    if (flow === 5) {
      setFlow(6);
      setStatus("running");

      setMessage(
        "SIGN → Signing the cryptographic evidence receipt..."
      );

      return;
    }

    if (flow === 6) {
      await verifyWithCool();
      return;
    }
  }

  async function verifyWithCool() {
    setFlow(7);
    setStatus("checking");

    setMessage(
      "VERIFY → Checking cryptographic evidence..."
    );

    try {
      const response = await fetch(`${API}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "supplier.recommendation",
          description: action,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Verification failed"
        );
      }

      setEvidence(data.evidence);

      setRecordId(
        data.evidence?.record?.record_id || ""
      );

      if (data.verified) {
        setFlow(8);
        setStatus("verified");

        setMessage(
          "✓ VERIFIED → Cryptographic evidence is valid."
        );
      } else {
        setFlow(8);
        setStatus("tampered");
        setTampered(true);

        setMessage(
          "✗ TAMPERED → Evidence verification failed."
        );
      }
    } catch (error) {
      setFlow(8);
      setStatus("tampered");
      setTampered(true);

      setMessage(
        `ERROR → ${error.message}`
      );
    }
  }

  function manualVerify() {
    setDecision(null);
    setTampered(false);
    setEvidence(null);
    setRecordId("");

    setFlow(4);
    setStatus("running");

    setMessage(
      "OBSERVE → Capturing manual agent action..."
    );
  }

  async function tamperEvidence() {
    setFlow(7);
    setStatus("checking");

    setMessage(
      "VERIFY → Checking modified evidence..."
    );

    try {
      const response = await fetch(`${API}/api/tamper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Tamper test failed"
        );
      }

      if (!data.verified) {
        // IMPORTANT:
        // Move out of flow 7 so the button does not stay
        // stuck on "Verifying..."
        setFlow(8);

        setStatus("tampered");
        setTampered(true);

        setMessage(
          "✗ EVIDENCE TAMPERED → Modification detected."
        );
      } else {
        setFlow(8);

        setStatus("verified");

        setMessage(
          "Unexpected result: tampered evidence accepted."
        );
      }
    } catch (error) {
      setFlow(8);

      setStatus("tampered");
      setTampered(true);

      setMessage(
        `ERROR → ${error.message}`
      );
    }
  }

  function getButtonText() {
    if (flow === 0) return "▶ Start AI Agent";

    if (flow === 8 && status === "verified")
      return "✓ Agent Completed";

    if (flow === 8 && status === "tampered")
      return "✗ Evidence Tampered";

    if (flow === 1) return "Next → Analyze Task";

    if (flow === 2) return "Next → Make Decision";

    if (flow === 3) return "Next → OBSERVE";

    if (flow === 4) return "Next → COMMIT";

    if (flow === 5) return "Next → SIGN";

    if (flow === 6) return "Next → VERIFY";

    if (flow === 7) return "Verifying...";

    return "Next";
  }

  const observeDone = flow > 4;
  const commitDone = flow > 5;
  const signDone = flow > 6;
  const verifyDone = flow === 8;

  const bindingState =
    tampered
      ? "tampered"
      : status === "verified"
      ? "verified"
      : status === "checking"
      ? "checking"
      : "checking";

  const signatureState =
    tampered
      ? "tampered"
      : status === "verified"
      ? "verified"
      : status === "checking"
      ? "checking"
      : "checking";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          height: 70,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 42px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#111827",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
            }}
          >
            AP
          </div>

          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#111827",
                opacity: 1,
              }}
            >
              AgentProof
            </div>

            <div
              style={{
                fontSize: 10,
                color: "#64748b",
              }}
            >
              Cryptographic AI Accountability
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            color: "#111827",
            opacity: 1,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />

          CooL SDK Connected
        </div>
      </header>

      {/* MAIN */}

      <main
        style={{
          maxWidth: 1250,
          margin: "0 auto",
          padding: "50px 28px 80px",
        }}
      >
        {/* HERO */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 0.7fr",
            gap: 28,
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "7px 11px",
                borderRadius: 20,
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: 11,
                fontWeight: 900,
                marginBottom: 17,
              }}
            >
              AI AGENT EVIDENCE LAYER
            </div>

            <h1
              style={{
                fontSize: 48,
                lineHeight: 1.05,
                letterSpacing: -2,
                margin: 0,
                color: "#111827",
                fontWeight: 900,
                opacity: 1,
              }}
            >
              Proving What AI Agents Actually Did.
            </h1>

            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "#64748b",
                maxWidth: 690,
                marginTop: 20,
              }}
            >
              AgentProof creates independently verifiable
              cryptographic evidence for autonomous agent actions.
            </p>

            <button
              onClick={
                flow === 0
                  ? startAgent
                  : nextStep
              }
              disabled={flow === 7}
              style={{
                marginTop: 20,
                border: "none",
                background:
                  flow === 8
                    ? status === "tampered"
                      ? "#dc2626"
                      : "#22c55e"
                    : "#2563eb",
                color: "#fff",
                padding: "14px 22px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 900,
                cursor:
                  flow === 7
                    ? "default"
                    : "pointer",
                boxShadow:
                  flow === 8
                    ? "none"
                    : "0 7px 20px rgba(37,99,235,0.2)",
              }}
            >
              {getButtonText()}
            </button>
          </div>

          {/* STATUS */}

          <div
            style={{
              background: "#111827",
              color: "#fff",
              borderRadius: 18,
              padding: 25,
              minHeight: 190,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                LIVE STATUS
              </div>

              <div
                style={{
                  fontSize: 27,
                  fontWeight: 900,
                  marginTop: 12,
                }}
              >
                {status === "verified"
                  ? "VERIFIED"
                  : status === "tampered"
                  ? "TAMPERED"
                  : status === "running"
                  ? "AGENT ACTIVE"
                  : status === "checking"
                  ? "PROCESSING"
                  : "READY"}
              </div>

              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "#94a3b8",
                  marginTop: 8,
                }}
              >
                {message}
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #334155",
                paddingTop: 15,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#64748b",
                }}
              >
                RECORD
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#cbd5e1",
                  fontFamily: "monospace",
                  marginTop: 5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {recordId || "Waiting..."}
              </div>
            </div>
          </div>
        </section>

        {/* PIPELINE */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 25,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              fontWeight: 900,
              letterSpacing: 0.8,
              marginBottom: 22,
            }}
          >
            AGENT → EVIDENCE PIPELINE
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              overflowX: "auto",
            }}
          >
            <PipelineStep
              number="1"
              title="AGENT"
              active={flow >= 1 && flow < 3}
              done={flow >= 3}
            />

            <Line active={flow >= 3} />

            <PipelineStep
              number="2"
              title="DECIDE"
              active={flow === 3}
              done={flow >= 4}
            />

            <Line active={flow >= 4} />

            <PipelineStep
              number="3"
              title="OBSERVE"
              active={flow === 4}
              done={observeDone}
            />

            <Line active={flow >= 5} />

            <PipelineStep
              number="4"
              title="COMMIT"
              active={flow === 5}
              done={commitDone}
            />

            <Line active={flow >= 6} />

            <PipelineStep
              number="5"
              title="SIGN"
              active={flow === 6}
              done={signDone}
            />

            <Line active={flow >= 7} />

            <PipelineStep
              number="6"
              title="VERIFY"
              active={flow === 7}
              done={verifyDone}
            />
          </div>
        </section>

        {/* AGENT SIMULATION */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 26,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#2563eb",
                  fontWeight: 900,
                  letterSpacing: 0.8,
                }}
              >
                DEMO AGENT
              </div>

              <h2
                style={{
                  fontSize: 21,
                  margin: "6px 0 0",
                  color: "#111827",
                  fontWeight: 900,
                  opacity: 1,
                }}
              >
                Autonomous Procurement Simulation
              </h2>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                color: "#64748b",
                padding: "7px 10px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              DEMO
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 18,
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#64748b",
                  fontWeight: 900,
                }}
              >
                TASK
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1.6,
                  marginTop: 8,
                  color: "#111827",
                  opacity: 1,
                }}
              >
                Compare suppliers and recommend the best
                option for a procurement request.
              </div>

              <div
                style={{
                  marginTop: 16,
                  fontSize: 11,
                  color: "#64748b",
                  lineHeight: 1.6,
                }}
              >
                The agent simulation demonstrates autonomous
                behavior. CooL is used for cryptographic evidence.
              </div>
            </div>

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#64748b",
                  fontWeight: 900,
                  marginBottom: 12,
                }}
              >
                CURRENT AGENT STATE
              </div>

              {[
                "Task received",
                "Analyzing suppliers",
                "Decision generated",
                "Action recorded",
                "Evidence verified",
              ].map((text, index) => {
                const n = index + 1;

                const completed =
                  (n === 1 && flow >= 1) ||
                  (n === 2 && flow >= 2) ||
                  (n === 3 && flow >= 3) ||
                  (n === 4 && flow >= 4) ||
                  (n === 5 && flow === 8 && status === "verified");

                const active =
                  (n === 1 && flow === 1) ||
                  (n === 2 && flow === 2) ||
                  (n === 3 && flow === 3) ||
                  (n === 4 &&
                    flow >= 4 &&
                    flow < 8) ||
                  (n === 5 && flow === 7);

                return (
                  <div
                    key={text}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 9,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: completed
                          ? "#dcfce7"
                          : active
                          ? "#dbeafe"
                          : "#f1f5f9",
                        color: completed
                          ? "#166534"
                          : active
                          ? "#1d4ed8"
                          : "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {completed ? "✓" : n}
                    </div>

                    <span
                      style={{
                        fontSize: 12,
                        fontWeight:
                          completed || active
                            ? 800
                            : 500,
                        color:
                          completed || active
                            ? "#111827"
                            : "#94a3b8",
                      }}
                    >
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DECISION */}

          {decision && (
            <div
              style={{
                marginTop: 20,
                padding: 18,
                borderRadius: 12,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#166534",
                  fontWeight: 900,
                }}
              >
                AGENT DECISION
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginTop: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                    }}
                  >
                    Recommended Supplier
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      marginTop: 4,
                      color: "#111827",
                      opacity: 1,
                    }}
                  >
                    {decision.supplier}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                    }}
                  >
                    Decision Score
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      marginTop: 4,
                      color: "#111827",
                      opacity: 1,
                    }}
                  >
                    {decision.score}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#475569",
                  marginTop: 12,
                }}
              >
                {decision.reason}
              </div>
            </div>
          )}
        </section>

        {/* RESULT */}

        {status === "verified" && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 14,
              padding: 18,
              marginBottom: 28,
              color: "#166534",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            ✓ Cryptographic evidence verified successfully.
          </div>
        )}

        {status === "tampered" && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 14,
              padding: 18,
              marginBottom: 28,
              color: "#991b1b",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            ✗ Evidence tampering detected. The verifier rejected
            the modified evidence.
          </div>
        )}

        {/* MANUAL ACTION */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 0.8fr",
            gap: 28,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 18,
              padding: 25,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                fontWeight: 900,
              }}
            >
              MANUAL ACTION
            </div>

            <h2
              style={{
                fontSize: 21,
                margin: "7px 0 18px",
                color: "#111827",
                fontWeight: 900,
                opacity: 1,
              }}
            >
              Record an agent action
            </h2>

            <textarea
              value={action}
              onChange={(e) =>
                setAction(e.target.value)
              }
              rows={5}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                padding: 13,
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                color: "#111827",
                background: "#ffffff",
                opacity: 1,
                WebkitTextFillColor: "#111827",
                caretColor: "#111827",
                outline: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 13,
              }}
            >
              <button
                onClick={manualVerify}
                disabled={flow === 7}
                style={{
                  border: "none",
                  background: "#111827",
                  color: "#fff",
                  padding: "11px 17px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Record & Verify
              </button>

              <button
                onClick={tamperEvidence}
                disabled={flow === 7}
                style={{
                  border: "1px solid #fecaca",
                  background: "#fff",
                  color: "#b91c1c",
                  padding: "11px 17px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Test Tampering
              </button>
            </div>
          </div>

          {/* EVIDENCE */}

          <div
            style={{
              background: "#111827",
              color: "#fff",
              borderRadius: 18,
              padding: 25,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 900,
              }}
            >
              CRYPTOGRAPHIC RECEIPT
            </div>

            <h2
              style={{
                fontSize: 21,
                margin: "7px 0 18px",
                color: "#ffffff",
                fontWeight: 900,
                opacity: 1,
              }}
            >
              Evidence object
            </h2>

            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                fontWeight: 900,
              }}
            >
              RECORD ID
            </div>

            <div
              style={{
                marginTop: 6,
                padding: 11,
                borderRadius: 8,
                background: "#1e293b",
                fontFamily: "monospace",
                fontSize: 10,
                color: "#cbd5e1",
                wordBreak: "break-all",
              }}
            >
              {recordId || "Not generated yet"}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                fontWeight: 900,
                marginTop: 16,
              }}
            >
              BINDING HASH
            </div>

            <div
              style={{
                marginTop: 6,
                padding: 11,
                borderRadius: 8,
                background: "#1e293b",
                fontFamily: "monospace",
                fontSize: 10,
                color: "#cbd5e1",
                wordBreak: "break-all",
              }}
            >
              {evidence?.binding_hash ||
                "Waiting for evidence"}
            </div>
          </div>
        </section>

        {/* VERIFICATION */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 25,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              fontWeight: 900,
            }}
          >
            VERIFICATION
          </div>

          <h2
            style={{
              fontSize: 21,
              margin: "7px 0 15px",
              color: "#111827",
              fontWeight: 900,
              opacity: 1,
            }}
          >
            Evidence checks
          </h2>

          <Check
            label="Binding"
            value={
              status === "verified"
                ? "PASS"
                : status === "tampered"
                ? "FAIL"
                : "WAITING"
            }
            state={bindingState}
          />

          <Check
            label="Hybrid Signature"
            value={
              status === "verified"
                ? "PASS"
                : status === "tampered"
                ? "FAIL"
                : "WAITING"
            }
            state={signatureState}
          />

          <Check
            label="Attestation"
            value="SIMULATED"
            state="simulated"
          />

          <Check
            label="Enclave"
            value="SIMULATED"
            state="simulated"
          />
        </section>

        {/* ARCHITECTURE */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 28,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              fontWeight: 900,
            }}
          >
            ARCHITECTURE
          </div>

          <h2
            style={{
              fontSize: 23,
              margin: "7px 0 25px",
              color: "#111827",
              fontWeight: 900,
              opacity: 1,
            }}
          >
            From autonomous action to verifiable evidence
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {[
              ["01", "AI Agent", "Performs an autonomous task."],
              ["02", "AgentProof", "Captures the important action."],
              ["03", "CooL SDK", "Creates cryptographic evidence."],
              ["04", "Verifier", "Checks the evidence."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 18,
                  background: "#fafafa",
                }}
              >
                <div
                  style={{
                    color: "#2563eb",
                    fontSize: 10,
                    fontWeight: 900,
                  }}
                >
                  {number}
                </div>

                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 900,
                    marginTop: 8,
                    color: "#111827",
                    opacity: 1,
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    lineHeight: 1.6,
                    marginTop: 7,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DISCLAIMER */}

        <div
          style={{
            padding: "17px 20px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 12,
            color: "#92400e",
            fontSize: 12,
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          <strong>Demo note:</strong> The procurement agent shown
          here is a deterministic simulation for demonstration.
          AgentProof proves the integrity and provenance of
          recorded evidence; it does not prove that an agent's
          decision is correct, fair, safe, or optimal.
        </div>

        {/* FOOTER */}

        <footer
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            color: "#94a3b8",
            fontSize: 11,
          }}
        >
          <span>
            AgentProof · Powered by CooL
          </span>

          <span>
            OBSERVE · COMMIT · SIGN · VERIFY
          </span>
        </footer>
      </main>
    </div>
  );
}