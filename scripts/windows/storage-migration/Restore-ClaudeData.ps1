# Restore this task's Claude migration without deleting the E safety copy.
$ErrorActionPreference = 'Stop'
$restoreLock = $null
try {
  Set-Location -LiteralPath $PSScriptRoot
  [Environment]::CurrentDirectory = $PSScriptRoot
  # The manual launcher and one-shot waiter must never cut over simultaneously.
  try { $restoreLock = [IO.File]::Open("$PSScriptRoot\claude-restore.lock", [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None) }
  catch [IO.IOException] {
    if (($_.Exception.HResult -band 0xffff) -eq 32) {
      Write-Host 'RESTORE_ALREADY_RUNNING: Another restore holds the exclusive lock. Wait for it to finish.' -ForegroundColor Yellow
      exit 75
    }
    throw
  }
  $active = @(Get-Process | Where-Object { $_.Id -ne $PID -and $_.ProcessName -match '^claude(?:$|[-_])' })
  if ($active.Count) { throw 'Claude is still running. Save its work and completely exit Claude, including the tray icon, then retry. No processes were stopped.' }
  . "$PSScriptRoot\Move-VerifiedDirectory.ps1"
  $original = 'C:\Users\86132\.claude'
  $moved = 'E:\WorkResources\home\claude'
  $stagingPrefix = 'C:\Users\86132\.claude.codex-restore-20261009-'
  $oldLink = 'C:\Users\86132\.claude.codex-e-link-20261009'
  $successPath = "$PSScriptRoot\claude-restore-success.json"
  $progressPath = "$PSScriptRoot\claude-restore-progress.json"
  function Read-RestoreProgress {
    $record = Get-Content -LiteralPath $progressPath -Raw | ConvertFrom-Json
    if ($record.id -notmatch '^[a-f0-9]{32}$' -or $record.original -ne $original -or
        $record.source -ne $moved -or $record.oldLink -ne $oldLink -or
        $record.staging -ne ($stagingPrefix + $record.id) -or
        $record.verification -ne "claude-restore-verify-$($record.id).json") {
      throw 'Interrupted restore progress does not match the fixed Claude paths. All files preserved.'
    }
    $verified = Get-Content -LiteralPath (Join-Path $PSScriptRoot $record.verification) -Raw | ConvertFrom-Json
    if (-not $verified.sha256_verified -or $verified.source -ne $moved -or $verified.target -ne $record.staging) {
      throw 'Interrupted restore has no valid full-copy evidence. All files preserved.'
    }
    return $record
  }
  function Complete-ClaudeRestore {
    param([string]$RestoreId, [string]$ProofPath)
    $archive = "E:\WorkResources\archives\claude-before-restore-20261009-$RestoreId"
    Assert-PhysicalAncestors -Path $archive
    $cItem = Get-Item -LiteralPath $original -Force
    if ($cItem.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Restored C data must be physical.' }
    if (Test-Path -LiteralPath $oldLink) {
      $oldLinkItem = Get-Item -LiteralPath $oldLink -Force
      if ($oldLinkItem.LinkType -ne 'Junction' -or [IO.Path]::GetFullPath($oldLinkItem.Target) -ne $moved) {
        throw 'Old-link cleanup was refused. All data was preserved.'
      }
      # Unlink only this known junction; never recurse into its contents.
      [IO.Directory]::Delete($oldLink)
    }
    if (Test-Path -LiteralPath $moved) {
      if (Test-Path -LiteralPath $archive) { throw 'Claude safety archive destination already exists.' }
      if ((Get-Item -LiteralPath $moved -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'E safety source must remain physical.' }
      Move-Item -LiteralPath $moved -Destination $archive
    } elseif (-not (Test-Path -LiteralPath $archive)) { throw 'E safety archive was not found. C files remain preserved.' }
    if (Test-Path -LiteralPath "$moved.codex-migration-owner.json") {
      Move-Item -LiteralPath "$moved.codex-migration-owner.json" -Destination "$archive.codex-migration-owner.json"
    }
    $proof = Get-Content -LiteralPath $ProofPath -Raw | ConvertFrom-Json
    @{state='claude-restored-to-physical-C';time=(Get-Date).ToString('o');original=$original;safetyArchive=$archive;files=$proof.files;bytes=$proof.bytes;verification=$ProofPath} |
      ConvertTo-Json | Set-Content -LiteralPath $successPath -Encoding utf8
    Write-Host 'SUCCESS: Claude data is back in C:\Users\86132\.claude as a physical directory. All current files were verified; the E copy is retained as a dated safety archive. Reopen Claude.' -ForegroundColor Green
  }
  Assert-PhysicalAncestors -Path $original
  Assert-PhysicalAncestors -Path $moved
  if (-not (Test-Path -LiteralPath $original)) {
    $interrupted = Read-RestoreProgress
    $savedLink = Get-Item -LiteralPath $oldLink -Force
    if ($savedLink.LinkType -ne 'Junction' -or [IO.Path]::GetFullPath($savedLink.Target) -ne $moved) {
      throw 'Interrupted restore original link is not the expected E link. Nothing was replaced.'
    }
    Move-Item -LiteralPath $oldLink -Destination $original
    Write-Host 'Recovered the original Claude link after an interrupted rename; preparing a fresh verified copy.'
  }
  $originalItem = Get-Item -LiteralPath $original -Force
  if (-not ($originalItem.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
    if (Test-Path -LiteralPath $successPath) {
      $saved = Get-Content -LiteralPath $successPath -Raw | ConvertFrom-Json
      if ($saved.original -eq $original -and $saved.state -eq 'claude-restored-to-physical-C') {
        Write-Host 'SUCCESS: Claude data is already a physical C directory.' -ForegroundColor Green
        exit 0
      }
    }
    if (Test-Path -LiteralPath $progressPath) {
      $interrupted = Read-RestoreProgress
      $archive = "E:\WorkResources\archives\claude-before-restore-20261009-$($interrupted.id)"
      $recoverySource = if (Test-Path -LiteralPath $moved) { $moved } else { $archive }
      Assert-PhysicalAncestors -Path $recoverySource
      if ((Get-Item -LiteralPath $recoverySource -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Recovery source must be physical.' }
      $recoveryProof = "$PSScriptRoot\claude-restore-recovery-$($interrupted.id).json"
      & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" $recoverySource $original $recoveryProof
      if ($LASTEXITCODE -ne 0) { throw 'Interrupted C installation differs from its preserved E copy. Neither copy was overwritten.' }
      Complete-ClaudeRestore -RestoreId $interrupted.id -ProofPath $recoveryProof
      exit 0
    }
    throw 'C Claude data is already a physical directory without a restore receipt or valid progress record. It was not overwritten.'
  }
  if ($originalItem.LinkType -ne 'Junction' -or [IO.Path]::GetFullPath($originalItem.Target) -ne $moved) {
    throw 'C Claude data does not match the expected E migration link. Nothing was changed.'
  }
  $movedItem = Get-Item -LiteralPath $moved -Force
  if ($movedItem.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'E Claude source must be physical.' }
  if (Test-Path -LiteralPath $oldLink) { throw 'An interrupted restore link exists. Preserve it and ask Codex to inspect before retrying.' }
  $id = [Guid]::NewGuid().ToString('N')
  # Each attempt gets a fresh directory. Failed copies remain preserved, never reused.
  $staging = $stagingPrefix + $id
  $ownerPath = "$staging.owner.json"
  if (Test-Path -LiteralPath $staging) { throw 'Fresh staging name already exists; nothing was overwritten.' }
  New-Item -ItemType Directory -Path $staging | Out-Null
  @{original=$original;source=$moved;purpose='claude-restore-20261009'} | ConvertTo-Json | Set-Content -LiteralPath $ownerPath -Encoding utf8
  Write-Host 'COPY CLAUDE BACK TO C'
  & robocopy.exe $moved $staging /E /XJ /COPY:DAT /DCOPY:DAT /R:1 /W:1 /MT:8 /NFL /NDL /NP "/LOG:$PSScriptRoot\claude-restore-copy-$id.log" > $null
  if ($LASTEXITCODE -ge 8) { throw 'Claude restore copy failed; E data and the original link remain intact.' }
  $linksJson = & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" --links $moved
  if ($LASTEXITCODE -ne 0) { throw 'Claude link inventory failed; original path preserved.' }
  foreach ($entry in ($linksJson | ConvertFrom-Json)) {
    $newLink = Join-Path $staging $entry.relative
    if (-not (Test-Path -LiteralPath $newLink)) {
      $target = $entry.target
      if ($entry.kind -eq 'Junction') {
        if ($target.StartsWith('\\?\')) { $target = $target.Substring(4) }
        New-Item -ItemType Junction -Path $newLink -Target $target | Out-Null
      } elseif ($entry.directory) { [IO.Directory]::CreateSymbolicLink($newLink, $target) | Out-Null }
      else { [IO.File]::CreateSymbolicLink($newLink, $target) | Out-Null }
    }
  }
  $verification = "$PSScriptRoot\claude-restore-verify-$id.json"
  & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" $moved $staging $verification
  if ($LASTEXITCODE -ne 0) { throw 'Claude restore SHA verification failed; original path preserved.' }
  if (@(Get-Process | Where-Object { $_.Id -ne $PID -and $_.ProcessName -match '^claude(?:$|[-_])' }).Count) {
    throw 'Claude restarted during copying. Original link remains in place; exit Claude and retry.'
  }
  @{id=$id;original=$original;source=$moved;staging=$staging;oldLink=$oldLink;verification="claude-restore-verify-$id.json";phase='verified-copy-ready'} |
    ConvertTo-Json | Set-Content -LiteralPath $progressPath -Encoding utf8
  Move-Item -LiteralPath $original -Destination $oldLink
  try { Move-Item -LiteralPath $staging -Destination $original }
  catch { Move-Item -LiteralPath $oldLink -Destination $original; throw }
  $cutoverProof = "$PSScriptRoot\claude-restore-cutover-$id.json"
  & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" $moved $original $cutoverProof
  if ($LASTEXITCODE -ne 0) {
    Move-Item -LiteralPath $original -Destination $staging
    Move-Item -LiteralPath $oldLink -Destination $original
    throw 'Claude changed during cutover. The original E link was restored; all copies preserved.'
  }
  Complete-ClaudeRestore -RestoreId $id -ProofPath $cutoverProof
  exit 0
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
} finally {
  if ($restoreLock) { $restoreLock.Dispose() }
}
