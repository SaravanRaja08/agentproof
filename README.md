# AgentProof

### Proving What AI Agents Actually Did.

AgentProof is a cryptographic evidence layer for AI agents.

AI agents are increasingly making decisions and taking actions autonomously. Traditional logs can tell us what an application claims happened, but they do not provide strong evidence that the recorded information was not modified afterward.

AgentProof uses the **CooL SDK (Cryptographic Observability & on-chain Ledger)** to create tamper-evident, independently verifiable evidence for important agent actions.

---

## The Problem

AI agents can:

- Make decisions
- Recommend actions
- Interact with external systems
- Execute tasks autonomously

But organizations need a reliable way to answer:

> **"What did the agent actually do?"**

Normal application logs can potentially be changed after the event.

AgentProof adds a cryptographic evidence layer to make important agent actions independently verifiable.

---

## What AgentProof Does

The demo simulates an AI procurement agent.

The agent:

1. Receives a task
2. Analyzes the task
3. Makes a decision
4. Records the action
5. Creates cryptographic evidence using CooL
6. Verifies the evidence

The result is:

**VERIFIED ✓**

The demo can then intentionally modify the evidence.

Verification detects the modification:

**EVIDENCE TAMPERED ✗**

---

## Why CooL Matters

CooL is not just included as a library.

It is the core evidence layer of AgentProof.

AgentProof uses:

```text
AI Agent
   ↓
AgentProof
   ↓
CooL SDK
   ↓
Cryptographic Evidence
   ↓
Verification
   ↓
VERIFIED / TAMPERED