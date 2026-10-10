# Isolated restore fixtures. These never use production Claude directories.
$ErrorActionPreference = 'Stop'
$id = [Guid]::NewGuid().ToString('N')
$cRoot = "C:\Users\86132\Downloads\cantonlock\tmp\codex-claude-restore-tests\$id"
$eRoot = "E:\WorkResources\migration-tests\claude-restore-$id"
$original = "$cRoot\original"
$source = "$eRoot\data"
$shared = "$eRoot\shared"
foreach ($dir in @($cRoot,$eRoot,$source,$shared,"$eRoot\archives","$source\projects\test\memory")) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}
'test memory preserved exactly' | Set-Content -LiteralPath "$source\projects\test\memory\MEMORY.md"
'{"type":"test-session"}' | Set-Content -LiteralPath "$source\projects\test\session.jsonl"
'shared target must remain intact' | Set-Content -LiteralPath "$shared\keep.txt"
New-Item -ItemType Junction -Path "$source\shared-link" -Target $shared | Out-Null
$sharedHash = (Get-FileHash -LiteralPath "$shared\keep.txt" -Algorithm SHA256).Hash
foreach ($helper in @('Move-VerifiedDirectory.ps1','verify-tree.py')) {
  Copy-Item -LiteralPath "$PSScriptRoot\$helper" -Destination "$eRoot\$helper"
}
$restoreText = Get-Content -LiteralPath "$PSScriptRoot\Restore-ClaudeData.ps1" -Raw
$restoreText = $restoreText.Replace('C:\Users\86132\.claude', $original).Replace('E:\WorkResources\home\claude', $source)
$restoreText = $restoreText.Replace('E:\WorkResources\archives\claude-before-restore-20261009-', "$eRoot\archives\claude-before-restore-")
$restoreText | Set-Content -LiteralPath "$eRoot\Restore-ClaudeData.ps1"
@('function Get-Process {}', "& '$eRoot\Restore-ClaudeData.ps1'", 'exit $LASTEXITCODE') | Set-Content -LiteralPath "$eRoot\invoke.ps1"

# A wrong original link must be refused without touching any content.
New-Item -ItemType Junction -Path $original -Target $shared | Out-Null
& 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File "$eRoot\invoke.ps1" > "$eRoot\wrong-link.log" 2>&1
if ($LASTEXITCODE -ne 1 -or (Get-Item -LiteralPath $original).Target -ne $shared -or
    -not (Test-Path -LiteralPath "$source\projects\test\memory\MEMORY.md")) { throw 'Wrong-link guard failed' }
Write-Host 'WRONG_LINK_REJECTED_WITH_ORIGINALS_PRESERVED'
[IO.Directory]::Delete($original)

# A valid fixture must become a physical C directory, retaining nested links.
New-Item -ItemType Junction -Path $original -Target $source | Out-Null
& 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File "$eRoot\invoke.ps1" > "$eRoot\restore.log" 2>&1
if ($LASTEXITCODE -ne 0) { Get-Content -LiteralPath "$eRoot\restore.log"; throw 'Isolated restore failed' }
$success = Get-Content -LiteralPath "$eRoot\claude-restore-success.json" -Raw | ConvertFrom-Json
if ((Get-Item -LiteralPath $original -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Restored C root is still a link' }
if (-not (Test-Path -LiteralPath "$original\projects\test\memory\MEMORY.md") -or
    -not (Test-Path -LiteralPath "$original\projects\test\session.jsonl") -or
    (Get-Item -LiteralPath "$original\shared-link").Target -ne $shared -or
    (Get-FileHash -LiteralPath "$shared\keep.txt" -Algorithm SHA256).Hash -ne $sharedHash) { throw 'Restored content or nested link is wrong' }
if (Test-Path -LiteralPath $source) { throw 'E active-data location was not archived' }
if (-not (Test-Path -LiteralPath $success.safetyArchive) -or
    (Test-Path -LiteralPath "$original.codex-e-link-20261009")) { throw 'Safety archive or old-link cleanup is wrong' }
Write-Host 'PHYSICAL_C_RESTORE_MEMORY_SESSION_AND_LINK_PRESERVATION_PASSED'

# Repeat invocation must recognize the saved successful restore without overwriting C.
& 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File "$eRoot\invoke.ps1" > "$eRoot\repeat.log" 2>&1
if ($LASTEXITCODE -ne 0) { throw 'Successful restore is not repeatable' }
Write-Host 'RESTORE_REPEAT_PASSED'
$heldLock = [IO.File]::Open("$eRoot\claude-restore.lock", [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
try {
  & 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File "$eRoot\invoke.ps1" > "$eRoot\locked.log" 2>&1
  if ($LASTEXITCODE -ne 75 -or (Get-Content -LiteralPath "$eRoot\locked.log" -Raw) -notmatch 'RESTORE_ALREADY_RUNNING') { throw 'Concurrent restore lock was not enforced' }
} finally { $heldLock.Dispose() }
Write-Host 'CONCURRENT_RESTORE_REFUSED_WITH_BUSY_STATUS'

# Exercise the two interruption windows with real verified fixture copies.
foreach ($phase in @('missing-original','physical-installed','archive-installed')) {
  $caseC = "$cRoot\$phase"
  $caseE = "$eRoot\$phase"
  $caseOriginal = "$caseC\original"
  $caseSource = "$caseE\data"
  $caseId = [Guid]::NewGuid().ToString('N')
  $caseStaging = "$caseOriginal.codex-restore-20261009-$caseId"
  $caseOldLink = "$caseOriginal.codex-e-link-20261009"
  foreach ($dir in @($caseC,$caseE,$caseSource,$caseStaging,"$caseE\archives")) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  'recover this exact memory' | Set-Content -LiteralPath "$caseSource\MEMORY.md"
  $caseExpectedHash = (Get-FileHash -LiteralPath "$caseSource\MEMORY.md").Hash
  Copy-Item -LiteralPath "$caseSource\MEMORY.md" -Destination "$caseStaging\MEMORY.md"
  foreach ($helper in @('Move-VerifiedDirectory.ps1','verify-tree.py')) { Copy-Item -LiteralPath "$PSScriptRoot\$helper" -Destination "$caseE\$helper" }
  & 'C:\Python314\python.exe' "$caseE\verify-tree.py" $caseSource $caseStaging "$caseE\claude-restore-verify-$caseId.json"
  if ($LASTEXITCODE -ne 0) { throw 'Recovery fixture initial verification failed' }
  @{id=$caseId;original=$caseOriginal;source=$caseSource;staging=$caseStaging;oldLink=$caseOldLink;verification="claude-restore-verify-$caseId.json";phase='verified-copy-ready'} |
    ConvertTo-Json | Set-Content -LiteralPath "$caseE\claude-restore-progress.json"
  New-Item -ItemType Junction -Path $caseOldLink -Target $caseSource | Out-Null
  if ($phase -ne 'missing-original') { Move-Item -LiteralPath $caseStaging -Destination $caseOriginal }
  if ($phase -eq 'archive-installed') {
    [IO.Directory]::Delete($caseOldLink)
    Move-Item -LiteralPath $caseSource -Destination "$caseE\archives\claude-before-restore-$caseId"
  }
  $caseRestore = (Get-Content -LiteralPath "$PSScriptRoot\Restore-ClaudeData.ps1" -Raw).Replace('C:\Users\86132\.claude',$caseOriginal).Replace('E:\WorkResources\home\claude',$caseSource)
  $caseRestore = $caseRestore.Replace('E:\WorkResources\archives\claude-before-restore-20261009-',"$caseE\archives\claude-before-restore-")
  $caseRestore | Set-Content -LiteralPath "$caseE\Restore-ClaudeData.ps1"
  @('function Get-Process {}', "& '$caseE\Restore-ClaudeData.ps1'", 'exit $LASTEXITCODE') | Set-Content -LiteralPath "$caseE\invoke.ps1"
  & 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File "$caseE\invoke.ps1" > "$caseE\recovery.log" 2>&1
  if ($LASTEXITCODE -ne 0) { Get-Content -LiteralPath "$caseE\recovery.log"; throw "Recovery fixture failed: $phase" }
  if ((Get-Item -LiteralPath $caseOriginal -Force).Attributes -band [IO.FileAttributes]::ReparsePoint -or
      -not (Test-Path -LiteralPath "$caseE\claude-restore-success.json") -or
      (Get-FileHash -LiteralPath "$caseOriginal\MEMORY.md").Hash -ne $caseExpectedHash) {
    throw "Recovery did not preserve the verified physical C files: $phase"
  }
  Write-Host "INTERRUPTED_RESTORE_RECOVERY_PASSED: $phase"
}
# A competing successful manual restore must not turn the waiter into failed.
$waitC = "$cRoot\waiter-physical"
$waitE = "$eRoot\waiter"
New-Item -ItemType Directory -Path $waitC,$waitE -Force | Out-Null
(Get-Content -LiteralPath "$PSScriptRoot\Wait-RestoreClaude.ps1" -Raw).Replace('C:\Users\86132\.claude',$waitC) | Set-Content -LiteralPath "$waitE\Wait-RestoreClaude.ps1"
@(
  "@{state='claude-restored-to-physical-C';original='$waitC'} | ConvertTo-Json | Set-Content -LiteralPath '$waitE\claude-restore-success.json'",
  'Write-Host RESTORE_ALREADY_RUNNING',
  'exit 75'
) | Set-Content -LiteralPath "$waitE\Restore-ClaudeData.ps1"
@('function Get-Process {}', "& '$waitE\Wait-RestoreClaude.ps1'", 'exit $LASTEXITCODE') | Set-Content -LiteralPath "$waitE\invoke.ps1"
& 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File "$waitE\invoke.ps1" > "$waitE\waiter.log" 2>&1
if ($LASTEXITCODE -ne 0 -or (Get-Content -LiteralPath "$waitE\claude-restore-wait-status.json" -Raw | ConvertFrom-Json).state -ne 'complete') {
  throw 'Waiter marked a competing successful restore as failed'
}
Write-Host 'WAITER_BUSY_THEN_SUCCESS_RECEIPT_PASSED'
'test cancellation' | Set-Content -LiteralPath "$waitE\claude-restore-wait.stop"
& 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File "$waitE\invoke.ps1" > "$waitE\cancel.log" 2>&1
if ($LASTEXITCODE -ne 2 -or (Get-Content -LiteralPath "$waitE\claude-restore-wait-status.json" -Raw | ConvertFrom-Json).state -ne 'cancelled') { throw 'Waiter cancellation guard failed' }
Write-Host 'WAITER_CANCEL_GUARD_PASSED'
Write-Host "Retained isolated fixtures: $cRoot and $eRoot"
exit 0
