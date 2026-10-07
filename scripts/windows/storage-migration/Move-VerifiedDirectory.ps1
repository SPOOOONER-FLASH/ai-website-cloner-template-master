$ErrorActionPreference = 'Stop'

function Assert-PhysicalAncestors {
  param([string]$Path)
  $ancestor = [IO.Path]::GetDirectoryName([IO.Path]::GetFullPath($Path))
  while ($ancestor) {
    if (Test-Path -LiteralPath $ancestor) {
      $entry = Get-Item -LiteralPath $ancestor -Force
      if ($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw "Path guard rejected a junction ancestor: $ancestor"
      }
    }
    $ancestor = [IO.Path]::GetDirectoryName($ancestor)
  }
}

function Assert-CleanupProof {
  param($Owner, [string]$Source, [string]$Destination)
  if ($Owner.source -ne $Source -or -not $Owner.cleanupAuthorized -or
      $Owner.verification -notmatch '^verify-[a-f0-9]{32}\.json$') {
    throw 'Cleanup has no valid complete-verification record.'
  }
  $proof = Get-Content -LiteralPath "$PSScriptRoot\$($Owner.verification)" -Raw | ConvertFrom-Json
  if (-not $proof.sha256_verified -or $proof.source -ne $Source -or $proof.target -ne $Destination) {
    throw 'Complete-verification evidence does not match this resource.'
  }
}

function Remove-MigrationSource {
  param([string]$Backup, [string]$Expected)
  $absolute = [IO.Path]::GetFullPath($Backup)
  $profileRoot = 'C:\Users\86132\'
  if ($absolute -ne [IO.Path]::GetFullPath($Expected) -or
      -not $absolute.StartsWith($profileRoot, [StringComparison]::OrdinalIgnoreCase) -or
      -not $absolute.EndsWith('.codex-moved-20261007', [StringComparison]::OrdinalIgnoreCase)) {
    throw "Deletion guard rejected $absolute"
  }
  $rootItem = Get-Item -LiteralPath $absolute -Force
  if ($rootItem.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    throw 'The cleanup root must be a physical directory.'
  }
  Assert-PhysicalAncestors -Path $absolute
  # Unlink nested junctions first, so Windows PowerShell cannot recurse into targets.
  $pending = [Collections.Generic.Stack[string]]::new()
  $pending.Push($absolute)
  while ($pending.Count -gt 0) {
    foreach ($entry in [IO.DirectoryInfo]::new($pending.Pop()).EnumerateFileSystemInfos()) {
      if ($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        if ($entry.Attributes -band [IO.FileAttributes]::Directory) {
          [IO.Directory]::Delete($entry.FullName)
        } else {
          [IO.File]::Delete($entry.FullName)
        }
      } elseif ($entry.Attributes -band [IO.FileAttributes]::Directory) {
        $pending.Push($entry.FullName)
      }
    }
  }
  Remove-Item -LiteralPath $absolute -Recurse -Force
  if (Test-Path -LiteralPath $absolute) { throw "Cleanup incomplete: $absolute" }
}

function Move-VerifiedDirectory {
  param([Parameter(Mandatory)][string]$Source,
        [Parameter(Mandatory)][string]$Destination,
        [switch]$CopyOnly)
  $sourcePath = [IO.Path]::GetFullPath($Source)
  $destinationPath = [IO.Path]::GetFullPath($Destination)
  if (-not $sourcePath.StartsWith('C:\Users\86132\', [StringComparison]::OrdinalIgnoreCase) -or
      -not $destinationPath.StartsWith('E:\WorkResources\', [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Only explicit C user resources to E:\WorkResources are supported.'
  }
  $backup = $sourcePath + '.codex-moved-20261007'
  $ownerFile = "$destinationPath.codex-migration-owner.json"
  if (Test-Path -LiteralPath $destinationPath) {
    if ((Get-Item -LiteralPath $destinationPath -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) {
      throw 'Destination root must be a physical E directory.'
    }
  }
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    if (Test-Path -LiteralPath $backup) {
      if (-not (Test-Path -LiteralPath $ownerFile)) { throw 'Interrupted rename has no ownership record; original preserved.' }
      $owner = Get-Content -LiteralPath $ownerFile -Raw | ConvertFrom-Json
      Assert-CleanupProof -Owner $owner -Source $sourcePath -Destination $destinationPath
      Assert-PhysicalAncestors -Path $backup
      if ((Get-Item -LiteralPath $backup -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Recovery backup must be physical.' }
      Move-Item -LiteralPath $backup -Destination $sourcePath
      Write-Host "Recovered original path after interrupted cutover: $sourcePath"
    } else {
      Write-Host "SKIP ABSENT: $sourcePath"
      return
    }
  }
  $item = Get-Item -LiteralPath $sourcePath -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    if ([IO.Path]::GetFullPath($item.Target) -ne $destinationPath) {
      throw "Source is already a link to another destination: $sourcePath"
    }
    if (-not $CopyOnly -and (Test-Path -LiteralPath $backup)) {
      if (-not (Test-Path -LiteralPath $ownerFile)) { throw 'Cleanup has no ownership record.' }
      $owner = Get-Content -LiteralPath $ownerFile -Raw | ConvertFrom-Json
      Assert-CleanupProof -Owner $owner -Source $sourcePath -Destination $destinationPath
      & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" $backup $destinationPath "$PSScriptRoot\resume-verification.json" --allow-target-extras
      if ($LASTEXITCODE -ne 0) { throw 'Cannot clean an unverified previous source.' }
      Remove-MigrationSource -Backup $backup -Expected $backup
    }
    Write-Host "Already migrated: $sourcePath"
    return
  }
  if (Test-Path -LiteralPath $backup) { throw "Original backup already exists: $backup" }
  Assert-PhysicalAncestors -Path $sourcePath
  Assert-PhysicalAncestors -Path $destinationPath
  $id = [guid]::NewGuid().ToString('N')
  if (Test-Path -LiteralPath $destinationPath) {
    if (-not (Test-Path -LiteralPath $ownerFile)) { throw 'Refusing to overwrite an existing unrelated E directory.' }
    $owner = Get-Content -LiteralPath $ownerFile -Raw | ConvertFrom-Json
    if ($owner.source -ne $sourcePath) { throw 'Destination belongs to another source.' }
  } else {
    New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
    @{source=$sourcePath;destination=$destinationPath} | ConvertTo-Json | Set-Content -LiteralPath $ownerFile -Encoding utf8
  }
  Write-Host "COPY: $sourcePath -> $destinationPath"
  & robocopy.exe $sourcePath $destinationPath /E /XJ /COPY:DAT /DCOPY:DAT /R:1 /W:1 /MT:16 /NFL /NDL /NP "/LOG:$PSScriptRoot\copy-$id.log" > $null
  $copyExit = $LASTEXITCODE
  if ($copyExit -ge 8) { throw "Robocopy failed with $copyExit; source untouched. See copy-$id.log" }
  # Robocopy requires extra privileges for /SJ; recreate links with the native cmdlet.
  $linksJson = & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" --links $sourcePath
  if ($LASTEXITCODE -ne 0) { throw 'Link inventory failed; source untouched.' }
  foreach ($entry in ($linksJson | ConvertFrom-Json)) {
    $newLink = Join-Path $destinationPath $entry.relative
    if (-not (Test-Path -LiteralPath $newLink)) {
      $linkTarget = $entry.target
      if ($entry.kind -eq 'Junction') {
        if ($linkTarget.StartsWith('\\?\')) { $linkTarget = $linkTarget.Substring(4) }
        New-Item -ItemType Junction -Path $newLink -Target $linkTarget | Out-Null
      } elseif ($entry.directory) {
        [IO.Directory]::CreateSymbolicLink($newLink, $linkTarget) | Out-Null
      } else {
        [IO.File]::CreateSymbolicLink($newLink, $linkTarget) | Out-Null
      }
    }
  }
  Write-Host "VERIFY SHA256: $sourcePath"
  & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" $sourcePath $destinationPath "$PSScriptRoot\verify-$id.json"
  if ($LASTEXITCODE -ne 0) { throw 'Verification failed; source untouched.' }
  @{source=$sourcePath;destination=$destinationPath;cleanupAuthorized=$true;verification="verify-$id.json"} | ConvertTo-Json | Set-Content -LiteralPath $ownerFile -Encoding utf8
  if ($CopyOnly) { Write-Host 'Verified copy ready; original remains on C.'; return }
  # Cutover may fail when the active app holds a working-directory handle.
  Move-Item -LiteralPath $sourcePath -Destination $backup
  try {
    New-Item -ItemType Junction -Path $sourcePath -Target $destinationPath | Out-Null
  } catch {
    Move-Item -LiteralPath $backup -Destination $sourcePath
    throw
  }
  # Recheck the renamed source before removing it. Originals survive any mismatch.
  & 'C:\Python314\python.exe' "$PSScriptRoot\verify-tree.py" $backup $destinationPath "$PSScriptRoot\cutover-$id.json"
  if ($LASTEXITCODE -ne 0) {
    [IO.Directory]::Delete($sourcePath)
    Move-Item -LiteralPath $backup -Destination $sourcePath
    throw 'Source changed during cutover; original path restored.'
  }
  Remove-MigrationSource -Backup $backup -Expected $backup
  $record = @{source=$sourcePath;destination=$destinationPath;state='moved-and-verified';time=(Get-Date).ToString('o');verification="verify-$id.json"}
  $record | ConvertTo-Json -Compress | Add-Content -LiteralPath "$PSScriptRoot\completed.jsonl" -Encoding utf8
  Write-Host "MOVED AND VERIFIED: $sourcePath"
}
