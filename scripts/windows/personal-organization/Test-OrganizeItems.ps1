[CmdletBinding()]
param([Parameter(Mandatory)][string]$TestRoot)
$ErrorActionPreference = 'Stop'
$runner = Join-Path $PSScriptRoot 'Organize-VerifiedItems.ps1'
$caseRoot = Join-Path ([IO.Path]::GetFullPath($TestRoot)) ('case-' + [guid]::NewGuid().ToString('N'))
$root = Join-Path $caseRoot 'Desktop'
$run = Join-Path $caseRoot 'receipt'
New-Item -ItemType Directory -Path $root, (Join-Path $root 'folder\empty') -Force | Out-Null
Set-Content -LiteralPath (Join-Path $root 'note.txt') -Value 'original'
Set-Content -LiteralPath (Join-Path $root 'folder\part.txt') -Value 'folder data'
function Write-Plan($entries, $path) {
  @{Version=1; Roots=@($root); ProtectedPaths=@(); Entries=@($entries)} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $path -Encoding utf8
}
function Expect-Failure([scriptblock]$operation, [string]$label) {
  $failed = $false
  try { & $operation | Out-Null } catch { $failed = $true }
  if (-not $failed) { throw "Expected rejection: $label" }
}
$note = Join-Path $root 'note.txt'
$target = Join-Path $root '01_Study\note.txt'
$plan = Join-Path $caseRoot 'plan.json'
Write-Plan @(@{Source=$note; Destination=$target; Reason='fixture'}, @{Source=(Join-Path $root 'folder'); Destination=(Join-Path $root '01_Study\folder'); Reason='fixture'}) $plan
New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
Set-Content -LiteralPath $target -Value 'occupied'
Expect-Failure { & $runner -Mode Apply -PlanPath $plan -RunDirectory $run } 'destination collision'
if (-not (Test-Path -LiteralPath $note)) { throw 'Collision preflight moved a source' }
# Move the test-owned collision aside; retain it as evidence.
Move-Item -LiteralPath $target -Destination (Join-Path $caseRoot 'collision-evidence.txt')
& $runner -Mode Apply -PlanPath $plan -RunDirectory $run
if (Test-Path -LiteralPath $note) { throw 'Source did not move' }
& $runner -Mode Verify -RunDirectory $run
if (-not (Test-Path -LiteralPath (Join-Path $root '01_Study\folder\empty'))) { throw 'Empty folder lost' }
Set-Content -LiteralPath $note -Value 'new file at original path'
Expect-Failure { & $runner -Mode Undo -RunDirectory $run } 'occupied original path'
Move-Item -LiteralPath $note -Destination (Join-Path $caseRoot 'new-original-evidence.txt')
Add-Content -LiteralPath $target -Value 'changed after organization'
Expect-Failure { & $runner -Mode Undo -RunDirectory $run } 'changed content'
Set-Content -LiteralPath $target -Value 'original'
& $runner -Mode Undo -RunDirectory $run
& $runner -Mode Verify -RunDirectory $run
if (-not (Test-Path -LiteralPath $note)) { throw 'Undo did not restore source' }
$protected = Join-Path $root 'cantonlock'
New-Item -ItemType Directory -Path $protected | Out-Null
Write-Plan @(@{Source=$protected; Destination=(Join-Path $root '99_Unknown\cantonlock')}) $plan
Expect-Failure { & $runner -Mode Apply -PlanPath $plan -RunDirectory (Join-Path $caseRoot 'protected-receipt') } 'shared checkout'
Write-Plan @(@{Source=$note; Destination=(Join-Path $caseRoot 'outside\note.txt')}) $plan
Expect-Failure { & $runner -Mode Apply -PlanPath $plan -RunDirectory (Join-Path $caseRoot 'outside-receipt') } 'outside root'
$link = Join-Path $root 'alias'
New-Item -ItemType Junction -Path $link -Target (Join-Path $root 'folder') | Out-Null
Write-Plan @(@{Source=$link; Destination=(Join-Path $root '99_Unknown\alias')}) $plan
Expect-Failure { & $runner -Mode Apply -PlanPath $plan -RunDirectory (Join-Path $caseRoot 'link-receipt') } 'junction source'
Write-Plan @(@{Source=$note; Destination=(Join-Path $protected 'note.txt')}) $plan
Expect-Failure { & $runner -Mode Apply -PlanPath $plan -RunDirectory (Join-Path $caseRoot 'protected-target-receipt') } 'protected destination'
Write-Plan @(@{Source=$note; Destination=(Join-Path $link 'note.txt')}) $plan
Expect-Failure { & $runner -Mode Apply -PlanPath $plan -RunDirectory (Join-Path $caseRoot 'linked-target-receipt') } 'junction destination'
$hidden = Join-Path $root 'hidden.txt'
Set-Content -LiteralPath $hidden -Value 'hidden'
[IO.File]::SetAttributes($hidden, [IO.FileAttributes]::Hidden)
Write-Plan @(@{Source=$hidden; Destination=(Join-Path $root '99_Unknown\hidden.txt')}) $plan
Expect-Failure { & $runner -Mode Apply -PlanPath $plan -RunDirectory (Join-Path $caseRoot 'hidden-receipt') } 'hidden source'
# Simulate an interruption after one exact rename, before the journal update.
$recovery = Join-Path $caseRoot 'interrupted-receipt'
Write-Plan @(@{Source=$note; Destination=$target; Reason='fixture'}, @{Source=(Join-Path $root 'folder'); Destination=(Join-Path $root '01_Study\folder'); Reason='fixture'}) $plan
& $runner -Mode Apply -PlanPath $plan -RunDirectory $recovery
[IO.File]::Move($target, $note, $false)
$journal = Get-Content -LiteralPath (Join-Path $recovery 'receipt.json') -Raw | ConvertFrom-Json
$journal.State = 'applying'
$journal.Entries[0].Status = 'pending'
$journal.Entries[1].Status = 'moving'
$journal | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath (Join-Path $recovery 'receipt.json') -Encoding utf8
& $runner -Mode Verify -RunDirectory $recovery
& $runner -Mode Undo -RunDirectory $recovery
& $runner -Mode Verify -RunDirectory $recovery
Write-Output "PASS: move, SHA verification, empty folder, undo, collision, changed content, protected source/target, bounds, junction source/target, hidden file, interrupted recovery. Evidence retained: $caseRoot"
