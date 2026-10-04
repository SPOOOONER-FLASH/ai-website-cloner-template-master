# Navigation inline read repair — 2026-10-03

Agent: Codex. Scope: repair the conversation preview of the existing three navigation proposals after two `Invalid visualization read request` failures.

The retained diagnosis and display-copy path are in `tasks/2026-10-03-navigation-discoverability-options.md`, under Inline read repair. The app rejects symlinks in the checked directory chain; the apparent C visualization root is an E-targeting Junction. Windows slash style passes the installed guard and does not explain this failure.

Verification: reproduced rejection of the previous chain with the default `.codex` boundary; replacement under the explicitly authorized, ordinary C workspace passes the path, filename and no-symlink guards. SHA-256 confirms exact equality to the retained proposal; bundled renderer accepts it. Existing local browser verification confirmed all three variants render and switch.

Untouched: canonical HTML, website source, `out/`, other agents' paths and the migration Junction. No release rebuild is required.

Limit: the actual failed request's chosen boundary was not read, and the final inline response has not yet displayed at the time of this note. Next useful check is that the conversation shows the three proposals; if it still rejects them, investigate authorization-to-boundary mapping rather than modifying the mockup.
