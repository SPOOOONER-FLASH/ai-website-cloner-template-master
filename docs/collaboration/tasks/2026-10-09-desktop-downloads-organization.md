# Desktop and Downloads organization

User request: organize Desktop and Downloads logically. This is a local file operation, with no site build or deployment.

## Plan

1. Record the top-level inventory privately on E; classify by work/business, study/research, personal documents, design/images, software, entertainment, and uncertain purpose. Preserve original names and duplicate copies.
2. Leave the shared `Downloads/cantonlock` checkout, Desktop `hyde` and existing migration junctions, Claude state, application entry folders, standard download-manager folders, hidden/system files, Office locks and partial downloads at their original paths.
3. Move eligible top-level files or complete folders inside their original Desktop/Downloads root. Never overwrite. Check source and destination bounds and reject reparse points and active project markers.
4. Capture complete relative file/directory inventories and SHA-256 hashes before each batch. Journal each move, verify after it, and retain an undo operation that refuses occupied original paths and changed content.
5. Generate a private searchable location index and CSV. Run a final verification and document actual totals in an agent update. Keep private filenames and manifests out of Git.

The private plan and receipts live under `E:/WorkResources/organization/2026-10-09-desktop-downloads/`. This task does not resume the earlier C-to-E migration.

## Completed result

322 top-level files/folder bundles were grouped in place, preserving 1,740 leaf files (2,993,800,683 bytes). All 416 original top-level entries are accounted for: 322 moved and 94 retained. Full post-move SHA-256 verification and the retained root-file hash checks passed. No files or duplicate copies were deleted.

| Root | Moved bundles/files | Leaf files verified | Visible entries before | Visible entries after |
|---|---:|---:|---:|---:|
| Desktop | 31 | 1,438 | 42 | 18 |
| Downloads | 291 | 302 | 297 | 14 |

Categories are work/business, study/research, personal life/documents, images/design, software installers, entertainment, and uncertain purpose. Each root has a `00_整理说明` folder with a full original/current location CSV, a top-level move CSV, and instructions. Desktop has no new entertainment category because its existing game folder and shortcuts were retained.

All `.lnk`/`.url` entries, `GAMER`, `APP Desktop`, `Cursor`, `Compressed`, and the existing standard download-manager folders were retained. `Compressed` contains pre-existing long nested filenames and was specifically excluded to avoid lengthening them. `cantonlock`, Desktop `hyde` and its existing backup alias remain at the same paths; `.claude` remains a physical C directory.

Reproduce the audit with PowerShell 7:

```powershell
& 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File 'E:\WorkResources\organization\2026-10-09-desktop-downloads\Test-OrganizationResult.ps1' -RunDirectory 'E:\WorkResources\organization\2026-10-09-desktop-downloads'
```

Private evidence: `receipt.json`, `inventory-before.json`, `held-before.json`, `plan.json`, and `final-audit.json` in that run directory. No private inventories or document contents are committed. Standalone recovery and auditing scripts are copied beside the receipt.
