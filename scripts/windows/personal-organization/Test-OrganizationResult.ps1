[CmdletBinding()]
param([Parameter(Mandatory)][string]$RunDirectory)
$ErrorActionPreference = 'Stop'
$receiptPath = Join-Path $RunDirectory 'receipt.json'
$receipt = Get-Content -LiteralPath $receiptPath -Raw | ConvertFrom-Json
if ($receipt.State -ne 'complete') { throw 'Organization is not complete' }
& (Join-Path $PSScriptRoot 'Organize-VerifiedItems.ps1') -Mode Verify -RunDirectory $RunDirectory
$before = @(Get-Content -LiteralPath (Join-Path $RunDirectory 'inventory-before.json') -Raw | ConvertFrom-Json)
$held = @(Get-Content -LiteralPath (Join-Path $RunDirectory 'held-before.json') -Raw | ConvertFrom-Json)
$moves = @{}
foreach ($entry in $receipt.Entries) { $moves[$entry.Source] = $entry }
foreach ($item in $before) {
  $expected = $item.FullName
  if ($moves.ContainsKey($expected)) { $expected = $moves[$expected].Destination }
  if (-not (Test-Path -LiteralPath $expected)) { throw "Original item missing: $($item.FullName)" }
  $actual = Get-Item -LiteralPath $expected -Force
  if ($actual.PSIsContainer -ne $item.Directory) { throw "Item type changed: $expected" }
}
foreach ($item in $held) {
  $actual = Get-Item -LiteralPath $item.Path -Force
  if ($actual.PSIsContainer -ne $item.Directory -or $actual.LinkType -ne $item.LinkType -or ($actual.Target -join '|') -ne ($item.Target -join '|')) { throw "Preserved entry changed: $($item.Path)" }
  if (-not $item.Directory -and (Get-FileHash -LiteralPath $item.Path -Algorithm SHA256).Hash -ne $item.SHA256) { throw "Preserved file content changed: $($item.Path)" }
}
$roots = foreach ($root in $receipt.Roots) {
  $entries = @($receipt.Entries | Where-Object Root -eq $root)
  $files = @($entries | ForEach-Object {$_.Inventory} | Where-Object Kind -eq 'File')
  $index = Join-Path $root '00_整理说明'
  $csv = @(Import-Csv -LiteralPath (Join-Path $index '文件去哪了.csv'))
  if ($csv.Count -ne $files.Count) { throw "Index row count differs: $root" }
  foreach ($row in $csv) { if (-not (Test-Path -LiteralPath $row.'现在位置' -PathType Leaf)) { throw "Index points to a missing file: $($row.'现在位置')" } }
  $now = @(Get-ChildItem -LiteralPath $root -Force)
  $oldVisible = @($before | Where-Object {$_.Root -eq $root -and $_.Attributes -notmatch 'Hidden|System'}).Count
  $newVisible = @($now | Where-Object {-not ($_.Attributes -band ([IO.FileAttributes]::Hidden -bor [IO.FileAttributes]::System))}).Count
  [pscustomobject]@{Root=$root;MovedItems=$entries.Count;VerifiedFiles=$files.Count;Bytes=($files|Measure-Object Bytes -Sum).Sum;VisibleEntriesBefore=$oldVisible;VisibleEntriesAfter=$newVisible;Index=$index}
}
$audit = [pscustomobject]@{VerifiedUtc=[datetime]::UtcNow.ToString('o');State='complete';OriginalTopLevelItems=$before.Count;MovedTopLevelItems=@($receipt.Entries).Count;PreservedTopLevelItems=$held.Count;AllOriginalItemsPresent=$true;AllMovedFileHashesMatch=$true;AllPreservedRootFileHashesMatch=$true;Roots=@($roots);ReceiptSHA256=(Get-FileHash -LiteralPath $receiptPath -Algorithm SHA256).Hash}
$audit | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunDirectory 'final-audit.json') -Encoding utf8
$audit | ConvertTo-Json -Depth 8
