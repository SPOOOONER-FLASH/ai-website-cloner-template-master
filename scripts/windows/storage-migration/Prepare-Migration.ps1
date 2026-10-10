# Recreate the bounded migration plans and deploy the helper scripts to E.
# This script does not move or delete user resources.
$ErrorActionPreference = 'Stop'
$migrationRoot = 'E:\WorkResources\migration'
New-Item -ItemType Directory -Path $migrationRoot -Force | Out-Null
foreach ($name in @('Move-VerifiedDirectory.ps1','verify-tree.py','Finish-Migration.ps1','Finish-Migration.cmd','Report-Migration.ps1','Restore-ClaudeData.ps1','Restore-ClaudeData.cmd','Wait-RestoreClaude.ps1')) {
  Copy-Item -LiteralPath "$PSScriptRoot\$name" -Destination "$migrationRoot\$name" -Force
}
$live = @()
foreach ($name in @('guides-visual-refresh','hyde-claims','hyde-fluidity','hyde-release')) {
  $live += @{source="C:\Users\86132\.codex\worktrees\$name\cantonlock-c-original-20260925";destination="E:\WorkResources\archives\20260925\worktrees\$name"}
}
foreach ($entry in Get-ChildItem -LiteralPath 'C:\Users\86132' -Force -Directory | Where-Object Name -Like 'rayen-*-c-original-20260925') {
  $live += @{source=$entry.FullName;destination="E:\WorkResources\archives\20260925\rayen\$($entry.Name)"}
}
$live += @{source='C:\Users\86132\Desktop\hyde-c-original-20260925';destination='E:\WorkResources\archives\20260925\desktop-hyde'}
$live += @{source='C:\Users\86132\.codex\visualizations-c-original-20260925';destination='E:\WorkResources\archives\20260925\visualizations'}
$live += @{source='C:\Users\86132\AppData\Local\npm-cache';destination='E:\WorkResources\caches\npm'}
$live += @{source='C:\Users\86132\.cache';destination='E:\WorkResources\home\cache'}
$offline = @(
  @{source='C:\Users\86132\.codex';destination='E:\WorkResources\home\codex'},
  @{source='C:\Users\86132\AppData\Local\OpenAI';destination='E:\WorkResources\appdata\local\OpenAI'},
  @{source='C:\Users\86132\AppData\Local\Codex';destination='E:\WorkResources\appdata\local\Codex'},
  @{source='C:\Users\86132\AppData\Roaming\Codex';destination='E:\WorkResources\appdata\roaming\Codex'},
  @{source='C:\Users\86132\AppData\Local\Packages\OpenAI.Codex_2p2nqsd0c76g0\LocalCache';destination='E:\WorkResources\appdata\packages\Codex-LocalCache'}
)
$live | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath "$migrationRoot\plan-live.json" -Encoding utf8
$offline | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath "$migrationRoot\plan-offline.json" -Encoding utf8
Write-Host "Plans and helpers prepared in $migrationRoot. No C resource was moved."
