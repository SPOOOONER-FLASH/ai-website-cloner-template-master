#!/usr/bin/env node

// This is a Codex Stop hook, not a project-wide loop for other HYDE/RAYEN agents.
// The existing Codex Goal provides persistence across turns; this hook prevents
// premature completion of the user-authorized, measurable checklist in this one chat.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const GOAL_SESSION_ID = "01a085d0-c428-7210-b89a-dc7c4cd8cf02";
const TASK_FILE = fileURLToPath(
  new URL("../../docs/collaboration/tasks/2026-09-27-codex-desktop-search-goal.md", import.meta.url),
);

export function stopDecision(input, taskText) {
  if (input?.hook_event_name !== "Stop") return {};
  if (input.session_id !== GOAL_SESSION_ID || input.stop_hook_active) return {};

  const outstanding = taskText
    .split(/\r?\n/)
    .filter((line) => /^- \[ \] /.test(line))
    .map((line) => line.replace(/^- \[ \] /, ""));

  if (outstanding.length === 0) return {};
  return {
    decision: "block",
    reason:
      `The user's HYDE goal still has ${outstanding.length} actionable checklist item(s) in ` +
      "docs/collaboration/tasks/2026-09-27-codex-desktop-search-goal.md. " +
      `Continue with the highest-priority unblocked item: ${outstanding[0]} ` +
      "Use evidence, keep Claude/RAYEN-owned files untouched, test the owned change, " +
      "and update the checklist only when verified. If a real external dependency " +
      "blocks the item, record it as [?] with evidence instead of looping on it.",
  };
}

async function main() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  try {
    const input = JSON.parse(raw);
    const taskText = readFileSync(TASK_FILE, "utf8");
    process.stdout.write(`${JSON.stringify(stopDecision(input, taskText))}\n`);
  } catch {
    // Missing or malformed data must not trap the user or other sessions.
    process.stdout.write("{}\n");
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
