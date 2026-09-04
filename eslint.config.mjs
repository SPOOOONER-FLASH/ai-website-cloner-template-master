import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    ".worktrees/**",
    "next-env.d.ts",
    // Agent scratch space — gitignored, throwaway, and not worth a lint gate.
    // See the tmp/<agent>-<purpose>/ convention in AGENTS.md.
    "tmp/**",
    /*
      Installed skills are vendored third-party code. Fifteen of their `.cjs` scripts use
      require(), which this config forbids for our own TypeScript — so `npm run check`
      was failing on files nobody here wrote and nobody here should edit. The only other
      ways out were patching vendored code that `npx skills add` overwrites on the next
      update, or weakening the rule for the whole project. Neither is worth it to lint
      somebody else's installer.
    */
    ".agents/skills/**",
    ".claude/skills/**",
  ]),
]);

export default eslintConfig;
