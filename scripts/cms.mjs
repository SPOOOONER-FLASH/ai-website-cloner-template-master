/**
 * Opens the content manager on this machine — no GitHub login, no OAuth, no accounts.
 *
 * Decap has two modes. The GitHub backend needs an OAuth service in the middle, which is
 * real setup. The LOCAL backend needs none: `decap-server` exposes the repo's content
 * folder over localhost and the admin page writes files straight to disk.
 *
 * The trade-off, stated plainly: local mode only works on this computer, and saving
 * writes files rather than making commits — so the edits still have to be committed and
 * pushed afterwards. For a one-person content workflow that is usually simpler than
 * standing up an auth service. Set up the GitHub backend when colleagues need access too.
 *
 *   npm run cms
 */
import { spawn } from "node:child_process";

const children = [];

function run(label, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n${label} exited with code ${code}`);
      shutdown(code ?? 1);
    }
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Starting the content manager…\n");

// Decap's local proxy: gives the admin page read/write access to content/ on disk.
run("decap-server", "npx", ["-y", "decap-server"]);

// The site itself, so /admin has somewhere to live.
run("next dev", "npm", ["run", "dev", "--", "-p", "3001"]);

setTimeout(() => {
  console.log("\n────────────────────────────────────────────────");
  console.log("  Content manager:  http://localhost:3001/admin/index.html");
  console.log("  (dev needs the /index.html; the live site serves /admin/ directly)");
  console.log("  Site preview:     http://localhost:3001/");
  console.log("");
  console.log("  No login required in local mode.");
  console.log("  Saving writes files in content/ — commit them when you are done.");
  console.log("  Press Ctrl+C to stop.");
  console.log("────────────────────────────────────────────────\n");
}, 4000);
