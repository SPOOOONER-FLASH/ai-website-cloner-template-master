# Small, disposable fixtures exercise the destructive-operation guards and recovery.
$ErrorActionPreference = 'Stop'
. 'E:\WorkResources\migration\Move-VerifiedDirectory.ps1'
$caseId = [guid]::NewGuid().ToString('N')
$fixtureRoot = "C:\Users\86132\Downloads\cantonlock\tmp\codex-storage-verification\$caseId"
$targetRoot = "E:\WorkResources\migration\tests\$caseId"
New-Item -ItemType Directory -Path $fixtureRoot -Force | Out-Null
New-Item -ItemType Directory -Path "$targetRoot\link-target" -Force | Out-Null

# A killed process between source rename and junction creation must recover the path.
$source = "$fixtureRoot\rename-recovery"
$target = "$targetRoot\rename-recovery"
New-Item -ItemType Directory -Path $source -Force | Out-Null
'first' | Set-Content -LiteralPath "$source\a.txt"
'second' | Set-Content -LiteralPath "$source\b.txt"
Move-VerifiedDirectory -Source $source -Destination $target -CopyOnly
Move-Item -LiteralPath $source -Destination "$source.codex-moved-20261007"
Move-VerifiedDirectory -Source $source -Destination $target
if ((Get-Item -LiteralPath $source -Force).LinkType -ne 'Junction') { throw 'Rename recovery failed.' }

# Interrupted cleanup leaves a subset. CopyOnly must preserve it; retry must verify it.
$source = "$fixtureRoot\partial-cleanup"
$target = "$targetRoot\partial-cleanup"
New-Item -ItemType Directory -Path $source -Force | Out-Null
'first' | Set-Content -LiteralPath "$source\a.txt"
'second' | Set-Content -LiteralPath "$source\b.txt"
New-Item -ItemType Junction -Path "$source\linked" -Target "$targetRoot\link-target" | Out-Null
Move-VerifiedDirectory -Source $source -Destination $target -CopyOnly
$backup = "$source.codex-moved-20261007"
Move-Item -LiteralPath $source -Destination $backup
New-Item -ItemType Junction -Path $source -Target $target | Out-Null
Remove-Item -LiteralPath "$backup\a.txt"
[IO.Directory]::Delete("$backup\linked")
Move-VerifiedDirectory -Source $source -Destination $target -CopyOnly
if (-not (Test-Path -LiteralPath "$backup\b.txt")) { throw 'CopyOnly removed a source file.' }
Move-VerifiedDirectory -Source $source -Destination $target
if (Test-Path -LiteralPath $backup) { throw 'Partial cleanup did not complete.' }
if (-not (Test-Path -LiteralPath "$targetRoot\link-target")) { throw 'Link target was deleted.' }

# The verifier must reject missing/different payloads and lexical C paths through links.
& 'C:\Python314\python.exe' 'E:\WorkResources\migration\verify-tree.py' $target "$targetRoot\link-target" "$targetRoot\mismatch.json"
if ($LASTEXITCODE -ne 1) { throw 'Content mismatch was accepted.' }
$rejected = $false
try { Assert-PhysicalAncestors -Path "$source\nested.codex-moved-20261007" } catch { $rejected = $true }
if (-not $rejected) { throw 'Junction ancestor was accepted.' }
Write-Host 'PASS: copy/junction preservation, content mismatch, rename recovery, partial cleanup recovery, CopyOnly, ancestor guards.'
exit 0
