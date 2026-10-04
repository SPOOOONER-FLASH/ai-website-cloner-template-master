[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$RendererPath,

  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$OutputPath,

  [ValidateNotNullOrEmpty()]
  [string]$PythonCommand = 'python',

  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$fragmentPath = Join-Path $repositoryRoot 'docs\design-references\2026-10-03-navigation-options.html'
$resolvedFragment = (Resolve-Path -LiteralPath $fragmentPath).Path
$resolvedRenderer = (Resolve-Path -LiteralPath $RendererPath).Path
$resolvedOutput = [IO.Path]::GetFullPath($OutputPath)

if ([IO.Path]::GetExtension($resolvedOutput) -ne '.html') {
  throw 'OutputPath must name an HTML document.'
}
if ($resolvedOutput -eq $resolvedFragment) {
  throw 'The standalone export must not overwrite the editable fragment.'
}

$outputDirectory = [IO.Path]::GetDirectoryName($resolvedOutput)
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$rendererArguments = @($resolvedFragment, $resolvedOutput, '--title', 'Hyde Navigation Options')
if ($Force) {
  $rendererArguments += '--force'
}
& $PythonCommand $resolvedRenderer @rendererArguments
$rendererExitCode = $LASTEXITCODE
if ($rendererExitCode -ne 0) {
  throw "Visualization renderer failed with exit code $rendererExitCode."
}

$exportFile = Get-Item -LiteralPath $resolvedOutput
if ($exportFile.Length -eq 0) {
  throw 'The exported document is empty.'
}
[pscustomobject]@{
  Path = $exportFile.FullName
  Bytes = $exportFile.Length
  SHA256 = (Get-FileHash -LiteralPath $resolvedOutput -Algorithm SHA256).Hash
}
