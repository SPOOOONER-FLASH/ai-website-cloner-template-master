@echo off
cd /d "E:\WorkResources\migration"
if errorlevel 1 exit /b 1
"E:\WorkResources\tools\powershell\pwsh.exe" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "E:\WorkResources\migration\Restore-ClaudeData.ps1"
set "RESTORE_EXIT=%ERRORLEVEL%"
pause
exit /b %RESTORE_EXIT%
