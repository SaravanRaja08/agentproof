import { CooL, verifyEvidence } from "cool-nwc";

const cool = new CooL({
  applicationId: "agentproof-demo"
});

console.log("AgentProof AI Agent is acting...");

const { evidence } = await cool.record({
  type: "agent.action",
  metadata: {
    agent: "Procurement Agent",
    action: "supplier.recommendation"
  },
  payloads: {
    action: "Compared suppliers and generated recommendation"
  }
});

console.log("Evidence created!");

const verdict = await verifyEvidence(evidence);

console.log("Verification result:", verdict.ok);
console.log(verdict);