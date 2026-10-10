# One-shot continuation of the authorized Claude rollback, not a recurring task.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
[Environment]::CurrentDirectory = $PSScriptRoot
$statusPath = "$PSScriptRoot\claude-restore-wait-status.json"
$stopPath = "$PSScriptRoot\claude-restore-wait.stop"
$deadline = [DateTime]::UtcNow.AddHours(4)
function Write-WaitState([string]$State, [string]$Detail) {
  @{state=$State;detail=$Detail;pid=$PID;time=(Get-Date).ToString('o');deadlineUtc=$deadline.ToString('o')} |
    ConvertTo-Json | Set-Content -LiteralPath $statusPath -Encoding utf8
}
Write-WaitState 'waiting-for-Claude-to-exit' 'Save Claude work and exit completely. No processes are stopped.'
$quietSince = $null
try {
  while ([DateTime]::UtcNow -lt $deadline) {
    if (Test-Path -LiteralPath $stopPath) { Write-WaitState 'cancelled' 'Stop marker found; no rollback performed.'; exit 2 }
    # A manual invocation may have completed while this one-shot waiter was idle.
    if (Test-Path -LiteralPath "$PSScriptRoot\claude-restore-success.json") {
      $savedSuccess = $null
      try { $savedSuccess = Get-Content -LiteralPath "$PSScriptRoot\claude-restore-success.json" -Raw | ConvertFrom-Json } catch {}
      $currentRoot = Get-Item -LiteralPath 'C:\Users\86132\.claude' -Force -ErrorAction SilentlyContinue
      if ($savedSuccess.state -eq 'claude-restored-to-physical-C' -and
          $savedSuccess.original -eq 'C:\Users\86132\.claude' -and $currentRoot -and
          -not ($currentRoot.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
        Write-WaitState 'complete' 'Claude data is a verified physical C directory; successful restore receipt found.'
        exit 0
      }
    }
    $active = @(Get-Process | Where-Object {$_.ProcessName -match '^claude(?:$|[-_])'})
    if ($active.Count) { $quietSince = $null }
    elseif (-not $quietSince) { $quietSince = [DateTime]::UtcNow }
    elseif (([DateTime]::UtcNow - $quietSince).TotalSeconds -ge 10) {
      Write-WaitState 'restoring-Claude-to-C' 'Claude exited; running the verified rollback.'
      & 'E:\WorkResources\tools\powershell\pwsh.exe' -NoLogo -NoProfile -ExecutionPolicy Bypass -File "$PSScriptRoot\Restore-ClaudeData.ps1"
      $restoreExit = $LASTEXITCODE
      if ($restoreExit -eq 75) {
        Write-WaitState 'waiting-for-current-restore' 'Another invocation is restoring Claude; waiting for its successful receipt.'
        $quietSince = $null
        Start-Sleep -Seconds 2
        continue
      }
      if ($restoreExit -ne 0) { Write-WaitState 'failed' "Restore exit $restoreExit. Originals preserved. See claude-restore-wait.log."; exit $restoreExit }
      if (Test-Path -LiteralPath "$PSScriptRoot\Report-Migration.ps1") { & "$PSScriptRoot\Report-Migration.ps1" }
      Write-WaitState 'complete' 'Claude data is a verified physical C directory; E safety archive retained.'
      exit 0
    }
    Start-Sleep -Seconds 2
  }
  Write-WaitState 'expired' 'Claude did not exit within four hours. Use Restore-ClaudeData.cmd after exiting Claude.'
  exit 3
} catch {
  Write-WaitState 'failed' $_.Exception.Message
  Write-Output $_.Exception.Message
  exit 1
}
