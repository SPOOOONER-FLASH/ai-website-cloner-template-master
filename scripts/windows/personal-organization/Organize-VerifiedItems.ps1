[CmdletBinding()]
param(
  [Parameter(Mandatory)][ValidateSet('Apply','Verify','Undo')][string]$Mode,
  [string]$PlanPath,
  [Parameter(Mandatory)][string]$RunDirectory
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$receiptPath = Join-Path ([IO.Path]::GetFullPath($RunDirectory)) 'receipt.json'
$protectedNames = @('.claude','.codex','cantonlock','hyde','hyde-c-original-20260925','APP Desktop','Cursor','GAMER','Compressed','Documents','Music','Programs','Video')

function Full([string]$path) {
  if (-not [IO.Path]::IsPathFullyQualified($path)) { throw "Absolute path required: $path" }
  return [IO.Path]::GetFullPath($path).TrimEnd('\','/')
}
function Same([string]$a, [string]$b) { return $a.Equals($b, [StringComparison]::OrdinalIgnoreCase) }
function Within([string]$path, [string]$root) { return $path.StartsWith($root + '\', [StringComparison]::OrdinalIgnoreCase) }
function No-LinkParents([string]$path, [string]$root) {
  $cursor = $path
  while ($true) {
    if (Test-Path -LiteralPath $cursor) {
      $item = Get-Item -LiteralPath $cursor -Force
      if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Reparse point rejected: $cursor" }
    }
    if (Same $cursor $root) { break }
    $cursor = Split-Path -Parent $cursor
    if (-not $cursor) { throw "Parent walk escaped root: $path" }
  }
}
function Validate-Entry($entry, $roots, $protected) {
  $source = Full $entry.Source
  $destination = Full $entry.Destination
  $parent = Split-Path -Parent $source
  $root = @($roots | Where-Object { Same $_ $parent })
  if ($root.Count -ne 1) { throw "Only direct root children may move: $source" }
  if (-not (Within $destination $root[0]) -or (Same (Split-Path -Parent $destination) $root[0])) { throw "Destination must be a category inside source root: $destination" }
  if (-not (Same (Split-Path -Leaf $source) (Split-Path -Leaf $destination))) { throw "Preserve original item name: $source" }
  if (@($protected | Where-Object { Same $_ $source }).Count -or (Split-Path -Leaf $source) -in $protectedNames) { throw "Protected path rejected: $source" }
  $category = Join-Path $root[0] ([IO.Path]::GetRelativePath($root[0], $destination).Split('\')[0])
  if (@($protected | Where-Object { Same $_ $category }).Count -or (Split-Path -Leaf $category) -in $protectedNames) { throw "Protected destination rejected: $destination" }
  if ((Split-Path -Leaf $source) -match '^(~\$|~WRL)' -or [IO.Path]::GetExtension($source) -in @('.crdownload','.part','.partial','.tmp')) { throw "Temporary item rejected: $source" }
  No-LinkParents $source $root[0]
  No-LinkParents $destination $root[0]
  return $root[0]
}
function Tree([string]$path) {
  $base = Get-Item -LiteralPath $path -Force
  if ($base.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Reparse point rejected: $path" }
  if (-not $base.PSIsContainer) {
    return @([pscustomobject]@{Path='.'; Kind='File'; Bytes=[long]$base.Length; SHA256=(Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash})
  }
  $rows = [Collections.Generic.List[object]]::new()
  $rows.Add([pscustomobject]@{Path='.'; Kind='Directory'; Bytes=0L; SHA256=''})
  $stack = [Collections.Generic.Stack[string]]::new()
  $stack.Push($path)
  while ($stack.Count) {
    foreach ($item in Get-ChildItem -LiteralPath $stack.Pop() -Force) {
      if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Nested reparse point rejected: $($item.FullName)" }
      if ($item.PSIsContainer -and $item.Name -in @('.git','.claude','.codex')) { throw "Project/state marker rejected: $($item.FullName)" }
      $relative = [IO.Path]::GetRelativePath($path, $item.FullName)
      if ($item.PSIsContainer) {
        $rows.Add([pscustomobject]@{Path=$relative; Kind='Directory'; Bytes=0L; SHA256=''})
        $stack.Push($item.FullName)
      } else {
        $rows.Add([pscustomobject]@{Path=$relative; Kind='File'; Bytes=[long]$item.Length; SHA256=(Get-FileHash -LiteralPath $item.FullName -Algorithm SHA256).Hash})
      }
    }
  }
  return @($rows | Sort-Object Path)
}
function Assert-Tree($expected, [string]$path) {
  $actual = @(Tree $path)
  $a = @($expected | ForEach-Object { @($_.Path,$_.Kind,[string]$_.Bytes,$_.SHA256) -join "`t" } | Sort-Object)
  $b = @($actual | ForEach-Object { @($_.Path,$_.Kind,[string]$_.Bytes,$_.SHA256) -join "`t" } | Sort-Object)
  if ($a.Count -ne $b.Count -or @(Compare-Object $a $b -CaseSensitive).Count) { throw "Inventory or SHA mismatch: $path" }
}
function Save-Receipt($value) {
  $temp = $receiptPath + '.new'
  $value | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath $temp -Encoding utf8
  [IO.File]::Move($temp, $receiptPath, $true)
}
function Current-Path($entry) {
  $source = Test-Path -LiteralPath $entry.Source
  $destination = Test-Path -LiteralPath $entry.Destination
  if ($source -eq $destination) { throw "Expected exactly one location (source or destination): $($entry.Source)" }
  if ($source) { return $entry.Source }
  return $entry.Destination
}
function Rename-Exact([string]$source, [string]$destination) {
  # Same-volume rename, with exact destination semantics and no overwriting/nesting.
  if ((Get-Item -LiteralPath $source -Force).PSIsContainer) {
    [IO.Directory]::Move($source, $destination)
  } else {
    [IO.File]::Move($source, $destination, $false)
  }
}

if ($Mode -eq 'Apply') {
  if (Test-Path -LiteralPath $receiptPath) { throw 'Receipt already exists; use Verify or Undo. Do not overwrite the move journal.' }
  if (-not $PlanPath) { throw 'Apply requires PlanPath' }
  $plan = Get-Content -LiteralPath $PlanPath -Raw | ConvertFrom-Json
  if ($plan.Version -ne 1 -or -not @($plan.Entries).Count) { throw 'Invalid or empty plan' }
  $roots = @($plan.Roots | ForEach-Object { Full $_ })
  foreach ($root in $roots) {
    if (Same $root ([IO.Path]::GetPathRoot($root).TrimEnd('\'))) { throw "Volume root rejected: $root" }
    if (-not (Get-Item -LiteralPath $root -Force).PSIsContainer) { throw "Root directory required: $root" }
    No-LinkParents $root $root
  }
  $protected = @($plan.ProtectedPaths | ForEach-Object { Full $_ })
  $seenSource = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  $seenTarget = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  # All boundaries, collisions and file hashes are checked before any move.
  $entries = foreach ($entry in $plan.Entries) {
    $root = Validate-Entry $entry $roots $protected
    $source = Full $entry.Source
    $destination = Full $entry.Destination
    if (-not $seenSource.Add($source) -or -not $seenTarget.Add($destination)) { throw 'Duplicate plan path' }
    if (Test-Path -LiteralPath $destination) { throw "Destination occupied: $destination" }
    $item = Get-Item -LiteralPath $source -Force
    if ($item.Attributes -band ([IO.FileAttributes]::Hidden -bor [IO.FileAttributes]::System)) { throw "Hidden/system item rejected: $source" }
    [pscustomobject]@{Source=$source; Destination=$destination; Root=$root; Reason=$entry.Reason; Status='pending'; Inventory=@(Tree $source)}
  }
  foreach ($entry in $entries) {
    foreach ($other in $entries) {
      if (Within $entry.Destination $other.Source) { throw 'Destination is inside another moving source' }
    }
  }
  New-Item -ItemType Directory -Path ([IO.Path]::GetFullPath($RunDirectory)) -Force | Out-Null
  $receipt = [pscustomobject]@{Version=1; StartedUtc=[datetime]::UtcNow.ToString('o'); State='applying'; Roots=$roots; ProtectedPaths=$protected; Entries=@($entries)}
  Save-Receipt $receipt
  foreach ($entry in $receipt.Entries) {
    Validate-Entry $entry $receipt.Roots $receipt.ProtectedPaths | Out-Null
    Assert-Tree $entry.Inventory $entry.Source
    if (Test-Path -LiteralPath $entry.Destination) { throw "Destination became occupied: $($entry.Destination)" }
    New-Item -ItemType Directory -Path (Split-Path -Parent $entry.Destination) -Force | Out-Null
    $entry.Status = 'moving'
    Save-Receipt $receipt
    Rename-Exact $entry.Source $entry.Destination
    Assert-Tree $entry.Inventory $entry.Destination
    $entry.Status = 'verified'
    Save-Receipt $receipt
  }
  $receipt.State = 'complete'
  Save-Receipt $receipt
} else {
  $receipt = Get-Content -LiteralPath $receiptPath -Raw | ConvertFrom-Json
  foreach ($entry in $receipt.Entries) {
    Validate-Entry $entry $receipt.Roots $receipt.ProtectedPaths | Out-Null
    Assert-Tree $entry.Inventory (Current-Path $entry)
  }
  if ($Mode -eq 'Verify') {
    foreach ($entry in $receipt.Entries) {
      $current = Current-Path $entry
      if ($receipt.State -eq 'complete' -and -not (Same $current $entry.Destination)) { throw 'Complete receipt has an item at its original location' }
      if ($receipt.State -eq 'undone' -and -not (Same $current $entry.Source)) { throw 'Undo receipt has an item at its organized location' }
    }
  }
  if ($Mode -eq 'Undo') {
    # Preflight every original path before undoing even the first item.
    $reverse = @($receipt.Entries)
    [array]::Reverse($reverse)
    foreach ($entry in $reverse) {
      if (Same (Current-Path $entry) $entry.Source) { continue }
      if (Test-Path -LiteralPath $entry.Source) { throw "Original path occupied: $($entry.Source)" }
      Validate-Entry $entry $receipt.Roots $receipt.ProtectedPaths | Out-Null
      Assert-Tree $entry.Inventory $entry.Destination
      $entry.Status = 'reverting'
      Save-Receipt $receipt
      Rename-Exact $entry.Destination $entry.Source
      Assert-Tree $entry.Inventory $entry.Source
      $entry.Status = 'reverted'
      Save-Receipt $receipt
    }
    $receipt.State = 'undone'
    Save-Receipt $receipt
  }
}
$files = @($receipt.Entries | ForEach-Object {$_.Inventory} | Where-Object Kind -eq 'File')
[pscustomobject]@{Mode=$Mode; State=$receipt.State; Items=@($receipt.Entries).Count; Files=$files.Count; Bytes=($files | Measure-Object Bytes -Sum).Sum; Receipt=$receiptPath} | ConvertTo-Json -Compress
