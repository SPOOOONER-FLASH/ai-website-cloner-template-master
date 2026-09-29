/**
 * writeFileSync that survives the Windows file lock this checkout keeps hitting.
 *
 * Since 2026-09-25 direct writes to content/i18n/<code>/ui.json and
 * src/data/generated/i18n-client/*.json intermittently fail with errno -4094 (UNKNOWN,
 * open) — something on this machine (indexer or antivirus) holds the file briefly after
 * another process wrote it. Writing a sibling temp file and renaming over the target
 * has never failed here, so every i18n generator writes through this.
 */
import { renameSync, writeFileSync } from "node:fs";

export function safeWrite(path, text) {
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, path);
}
