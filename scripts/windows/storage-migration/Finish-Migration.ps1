$ErrorActionPreference = 'Stop'
try {
  # Release an inherited C project working directory before any rename.
  Set-Location -LiteralPath $PSScriptRoot
  [Environment]::CurrentDirectory = $PSScriptRoot
  $activeApps = @(Get-Process | Where-Object {
    $_.Id -ne $PID -and (
      $_.ProcessName -match '^(ChatGPT|Claude|claude|codex|codex-code-mode-host|codex-computer-use-swift|node_repl)$' -or
      ($_.Path -and (
        $_.Path -like 'C:\Users\86132\.cache\codex-runtimes\*' -or
        $_.Path -like 'C:\Users\86132\AppData\Local\OpenAI\Codex\*' -or
        $_.Path -like 'C:\Users\86132\AppData\Local\Packages\Claude_*\LocalCache\*'
      ))
    )
  })
  if ($activeApps.Count) {
    $names = ($activeApps.ProcessName | Sort-Object -Unique) -join ', '
    throw "Close Codex and Claude completely, including tray icons, then run again. Still running: $names. No processes were stopped."
  }
  . "$PSScriptRoot\Move-VerifiedDirectory.ps1"
  $log = "$PSScriptRoot\finish-transcript.log"
  Start-Transcript -LiteralPath $log -Append | Out-Null
  $failures = @()
  foreach ($planFile in @('plan-live.json', 'plan-offline.json')) {
    if ($failures.Count) { throw 'Child-resource migrations remain incomplete. Parent directories were not moved. Send finish-transcript.log to Codex.' }
    $plan = Get-Content -LiteralPath "$PSScriptRoot\$planFile" -Raw | ConvertFrom-Json
    foreach ($entry in $plan) {
      try {
        Move-VerifiedDirectory -Source $entry.source -Destination $entry.destination
      } catch {
        $failure = @{source=$entry.source;destination=$entry.destination;error=$_.Exception.Message;time=(Get-Date).ToString('o')}
        $failures += $failure
        $failure | ConvertTo-Json -Compress | Add-Content -LiteralPath "$PSScriptRoot\finish-failures.jsonl" -Encoding utf8
        Write-Host "PENDING: $($entry.source): $($_.Exception.Message)" -ForegroundColor Yellow
      }
    }
  }
  if ($failures.Count) { throw "$($failures.Count) directories remain. Original files were preserved. Send finish-transcript.log to Codex." }
  foreach ($required in @(
    @{source='C:\Users\86132\Downloads\cantonlock';destination='E:\WorkResources\projects\cantonlock'},
    @{source='C:\Users\86132\.codex';destination='E:\WorkResources\home\codex'},
    @{source='C:\Users\86132\.claude';destination='E:\WorkResources\home\claude'},
    @{source='C:\Users\86132\.cache';destination='E:\WorkResources\home\cache'}
  )) {
    $mapped = Get-Item -LiteralPath $required.source -Force
    $physical = Get-Item -LiteralPath $required.destination -Force
    if ($mapped.LinkType -ne 'Junction' -or [IO.Path]::GetFullPath($mapped.Target) -ne $required.destination -or
        ($physical.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
      throw "Required mapping is incomplete: $($required.source). Environment settings were not changed."
    }
  }
  # Install future developer-cache and temporary-directory locations only after cutover.
  $settings = @{
    CODEX_HOME='E:\WorkResources\home\codex'
    TEMP='E:\WorkResources\Temp'
    TMP='E:\WorkResources\Temp'
    npm_config_cache='E:\WorkResources\caches\npm'
    PIP_CACHE_DIR='E:\WorkResources\caches\pip'
    CLAUDE_CODE_TMPDIR='E:\WorkResources\Temp\claude'
  }
  if (-not (Test-Path -LiteralPath "$PSScriptRoot\environment-before.json")) {
    $original = @{}
    foreach ($name in $settings.Keys) { $original[$name] = [Environment]::GetEnvironmentVariable($name, 'User') }
    $original | ConvertTo-Json | Set-Content -LiteralPath "$PSScriptRoot\environment-before.json" -Encoding utf8
  }
  foreach ($name in $settings.Keys) {
    New-Item -ItemType Directory -Path $settings[$name] -Force | Out-Null
    [Environment]::SetEnvironmentVariable($name, $settings[$name], 'User')
  }
  $summary = @{time=(Get-Date).ToString('o');state='all-planned-directories-migrated';CFreeBytes=(Get-PSDrive C).Free;EFreeBytes=(Get-PSDrive E).Free;settings=$settings}
  $summary | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath "$PSScriptRoot\finish-success.json" -Encoding utf8
  if (Test-Path -LiteralPath "$PSScriptRoot\Report-Migration.ps1") { & "$PSScriptRoot\Report-Migration.ps1" }
  Write-Host 'SUCCESS: Work resources are on E. Original paths are compatibility links. Restart Windows before reopening Codex/Claude so all applications inherit the new TEMP/cache settings.' -ForegroundColor Green
  Stop-Transcript | Out-Null
  exit 0
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  try { Stop-Transcript | Out-Null } catch {}
  exit 1
}
