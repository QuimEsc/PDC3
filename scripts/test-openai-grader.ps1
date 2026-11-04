param(
  [string]$ConfigPath = "",
  [string]$Model = "",
  [ValidateSet("grade", "correction", "all")]
  [string]$Mode = "grade",
  [string]$OutputPath = ""
)

# Compatibility entry point; request and parser come from the actual backend.
# Credentials are read by Node from the private file or environment, never arguments.
$ErrorActionPreference = "Stop"
$probeArguments = @((Join-Path $PSScriptRoot "verify-openai.mjs"), "--mode", $Mode)
if ($ConfigPath) { $probeArguments += @("--config-path", $ConfigPath) }
if ($Model) { $probeArguments += @("--model", $Model) }
if ($OutputPath) { $probeArguments += @("--output", $OutputPath) }
& node @probeArguments
exit $LASTEXITCODE