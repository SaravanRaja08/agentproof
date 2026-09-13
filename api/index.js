import express from "express";
import cors from "cors";
import { CooL, verifyEvidence } from "cool-nwc";

const app = express();

app.use(cors());
app.use(express.json());

const cool = new CooL({
  applicationId: "agentproof-demo",
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AgentProof",
    cool: "connected",
  });
});

// Create and verify clean evidence
app.post("/api/verify", async (req, res) => {
  try {
    const { evidence } = await cool.record({
      type: "agent.action",
      metadata: {
        agent: "Procurement Agent",
        action: req.body.action || "supplier.recommendation",
      },
      payloads: {
        action:
          req.body.description ||
          "AI agent compared suppliers and generated a recommendation",
      },
    });

    const verdict = await verifyEvidence(evidence);

    res.json({
      success: true,
      verified: verdict.ok,
      evidence,
      verdict,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create evidence, modify it, and verify the modified evidence
app.post("/api/tamper", async (req, res) => {
  try {
    const { evidence } = await cool.record({
      type: "agent.action",
      metadata: {
        agent: "Procurement Agent",
        action: "supplier.recommendation",
      },
      payloads: {
        action: "Compared suppliers and generated a recommendation",
      },
    });

    // Make a complete copy of the original evidence
    const tamperedEvidence = JSON.parse(JSON.stringify(evidence));

    // Change the metadata hash by one character.
    // This changes the evidence after it was signed.
    if (tamperedEvidence.record?.event?.metadata_hash) {
      const originalHash = tamperedEvidence.record.event.metadata_hash;

      const lastCharacter = originalHash.slice(-1);
      const replacement = lastCharacter === "0" ? "1" : "0";

      tamperedEvidence.record.event.metadata_hash =
        originalHash.slice(0, -1) + replacement;
    }

    // Verify the modified evidence with CooL
    const verdict = await verifyEvidence(tamperedEvidence);

    res.json({
      success: true,
      verified: verdict.ok,
      tampered: true,
      verdict,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Export for Vercel
export default app;