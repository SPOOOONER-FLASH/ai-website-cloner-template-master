# Reversible local file organization

Use PowerShell 7. The planning script groups visible top-level Desktop and Downloads items by purpose; it leaves working projects, known app entries, junctions, hidden/system files, Office locks and partial downloads alone. Classification is based on names and types, with uncertain items placed under `99_待确认`. Review the private plan before applying it.

`Organize-VerifiedItems.ps1` accepts a JSON plan with absolute `Roots`, `ProtectedPaths`, and `Entries` containing `Source`, `Destination`, and `Reason`. Sources must be direct children of the declared roots, and destinations must preserve the item name inside a category in the same root. It rejects reparse points, nested project/state markers, occupied destinations, duplicate paths, and destinations inside protected or moving sources.

Apply inventories every file, empty directory, and SHA-256 before the first move. Each exact same-volume rename has a journal entry written before it and a verified entry afterward. No delete, overwrite, cross-drive copy, junction creation, environment change, or application restart is performed.

Verify checks the full inventory at the current source or destination and requires all items to match the location implied by a complete/undone receipt. Undo first verifies all original/destination pairs; if a file has changed or the original name is now occupied, it stops. It can also recover a partially applied journal. Undo leaves newly created empty category directories and indexes in place.

Keep plans, detailed inventories, hashes, and CSV indexes private rather than committing them. Copy the runner next to the private receipt so recovery does not depend on the working checkout. `Write-OrganizationIndex.ps1` creates a `00_整理说明` folder in each root after successful application. The location CSV includes original and current paths for every leaf file.

Example (PowerShell; choose a fresh run directory):

```powershell
$run = 'E:\WorkResources\organization\YYYY-MM-DD-desktop-downloads'
& .\New-OrganizationPlan.ps1 -RunDirectory $run
# Inspect $run\plan.json before applying.
Copy-Item -LiteralPath .\Organize-VerifiedItems.ps1 -Destination (Join-Path $run 'Organize-VerifiedItems.ps1')
& .\Organize-VerifiedItems.ps1 -Mode Apply -PlanPath (Join-Path $run 'plan.json') -RunDirectory $run
& .\Organize-VerifiedItems.ps1 -Mode Verify -RunDirectory $run
& .\Write-OrganizationIndex.ps1 -RunDirectory $run
```

Run `Test-OrganizeItems.ps1 -TestRoot <private-absolute-directory>` for move/undo integrity and safety fixtures. Test artifacts are retained for inspection. This tool handles local organization independently of the C-to-E storage migration tools.

`Test-OrganizationResult.ps1 -RunDirectory <private-run-directory>` rechecks moved file hashes, accounts for every original top-level item, checks retained entry types/link targets/root-file hashes, and validates CSV row counts and current file locations. It requires the private before snapshots captured for this run and writes `final-audit.json`.
