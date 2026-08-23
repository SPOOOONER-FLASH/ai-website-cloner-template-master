# Recalculates a workbook with the locally installed Excel and reports any error cells.
#
# The xlsx skill ships recalc.py, which drives LibreOffice; LibreOffice is not installed
# here and its helper additionally needs socket.AF_UNIX, which Windows has no equivalent
# for. Excel COM does the same job: it evaluates every formula and, because the file is
# saved afterwards, it also writes the cached values openpyxl leaves out — without which
# pandas and most previewers read every formula cell as empty.
param([Parameter(Mandatory=$true)][string]$Path)

$full = (Resolve-Path $Path).Path
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
  $wb = $excel.Workbooks.Open($full)
  $excel.CalculateFullRebuild()

  $formulas = 0; $errors = 0; $detail = @()
  foreach ($ws in $wb.Worksheets) {
    # SpecialCells throws rather than returning empty when a sheet has no formulas.
    try { $cells = $ws.UsedRange.SpecialCells(-4123) } catch { continue }
    foreach ($c in $cells) {
      $formulas++
      $v = $c.Text
      if ($v -match '^#(REF|VALUE|NAME|DIV/0|N/A|NULL|NUM)') {
        $errors++
        $detail += "$($ws.Name)!$($c.Address($false,$false)) = $v"
      }
    }
  }

  $wb.Save()
  $wb.Close($true)

  [pscustomobject]@{
    status         = if ($errors -gt 0) { 'errors_found' } else { 'success' }
    total_formulas = $formulas
    total_errors   = $errors
    error_cells    = $detail
  } | ConvertTo-Json -Depth 3
}
finally {
  $excel.Quit()
  [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
}
