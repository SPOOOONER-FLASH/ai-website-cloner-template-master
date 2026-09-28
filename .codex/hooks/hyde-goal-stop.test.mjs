import assert from "node:assert/strict";
import { test } from "node:test";
import { stopDecision } from "./hyde-goal-stop.mjs";

const matching = {
  hook_event_name: "Stop",
  session_id: "01a085d0-c428-7210-b89a-dc7c4cd8cf02",
  stop_hook_active: false,
};

test("continues this goal when an actionable item remains", () => {
  const result = stopDecision(matching, "- [x] Done\n- [ ] Verify the public desktop\n- [?] Factory input");
  assert.equal(result.decision, "block");
  assert.match(result.reason, /Verify the public desktop/);
});

test("does not trap other sessions or loop on a continued turn", () => {
  const tasks = "- [ ] Verify the public desktop";
  assert.deepEqual(stopDecision({ ...matching, session_id: "another-chat" }, tasks), {});
  assert.deepEqual(stopDecision({ ...matching, stop_hook_active: true }, tasks), {});
  assert.deepEqual(stopDecision({ ...matching, hook_event_name: "SubagentStop" }, tasks), {});
});

test("stops when all actionable items are done or externally blocked", () => {
  assert.deepEqual(stopDecision(matching, "- [x] Done\n- [?] Factory input"), {});
});
