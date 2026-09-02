---
name: clarify-task
description: Clarify ambiguous or underspecified requests and turn them into an actionable task brief by asking only high-value questions. Use when the user asks to improve a prompt or when missing choices would materially change the result; do not delay clear, low-risk tasks with unnecessary questions.
---

# Clarify task

Help the user and the agent reach a shared, actionable understanding of the
request with as little friction as possible.

## Decide whether clarification is needed

Before asking a question:

1. Inspect the conversation and any available project context.
2. Separate facts that can be discovered safely from choices only the user can
   make.
3. Identify only uncertainties that would materially change the approach,
   scope, output, or risk.

If the request is already clear enough for a safe next step, proceed without
asking questions.

## Clarification flow

1. Briefly restate the outcome you understand the user wants.
2. Ask one to three high-value questions at a time, with the most consequential
   question first.
3. When helpful, give two or three concrete options and mark a sensible default
   as recommended. Allow the user to provide a different answer.
4. Do not ask for information that can be found in the supplied files,
   workspace, conversation, or other authorized context.
5. After the answers are sufficient, summarize the agreed task as a working
   brief and continue the requested work.

Consider only the dimensions relevant to the current request:

- desired outcome and deliverable;
- scope and explicit non-goals;
- existing inputs or starting point;
- intended audience or user;
- technical, style, time, or compatibility constraints;
- examples or references that define the expected result;
- acceptance criteria and what "done" means;
- permissions or decisions required before risky or irreversible actions.

## Working brief

Use a compact subset of this structure rather than forcing every field:

- **Goal:** The result the user wants.
- **Deliverable:** What will be produced or changed.
- **Scope:** What is included and excluded.
- **Inputs:** Relevant files, examples, data, or existing behavior.
- **Constraints:** Requirements that shape the solution.
- **Done when:** Observable acceptance criteria.
- **Assumptions:** Defaults used where the user had no preference.

If the user asked to improve a prompt, provide the refined prompt after the
brief. If the user asked the agent to perform a task, use the brief to perform
that task; do not stop after merely rewriting the request.

## Boundaries

- Do not interrogate the user about low-impact preferences.
- Do not repeat questions the user has already answered.
- Do not expand the request beyond the user's intent.
- For a safe, reversible choice, state a reasonable assumption and proceed.
- Stop for clarification when a missing decision would cause a materially
  different result or authorize a risky, destructive, costly, or external
  action.
