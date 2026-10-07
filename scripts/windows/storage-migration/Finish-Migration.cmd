@echo off
"E:\WorkResources\tools\powershell\pwsh.exe" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "E:\WorkResources\migration\Finish-Migration.ps1"
set "MIGRATION_EXIT=%ERRORLEVEL%"
pause
exit /b %MIGRATION_EXIT%
