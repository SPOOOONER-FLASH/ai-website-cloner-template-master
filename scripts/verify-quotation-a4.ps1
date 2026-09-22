# Verify that a quotation workbook really prints on ONE A4 page.
#
#   powershell -File scripts/verify-quotation-a4.ps1 "<path to .xlsx>" [more.xlsx ...]
#
# Why this is not just "set PaperSize = A4 and count pages"
# ---------------------------------------------------------
# The sheet asks for A4 and `PageSetup.PaperSize` reads back 9 (xlPaperA4), yet on a
# machine whose only printers default to Letter, Excel lays the sheet out for Letter and
# `ExportAsFixedFormat` writes a 612x792pt (Letter) PDF. A page count taken that way
# answers a question about Letter while appearing to answer one about A4 -- on
# 2026-09-21 that produced a confident "A4 verified" for two quotations that had only
# ever been measured on Letter. Changing the printer's default paper needs admin rights,
# so it is not available here either.
#
# What this does instead is exact and printer-independent: Letter is 6.1mm WIDER and
# 18mm SHORTER than A4, so the two print areas can be made identical by moving the
# margins. With side margins of 0.366" and top/bottom of 0.0535", a Letter sheet has
# exactly the 7.768" x 10.893" print area that A4 has at the 0.25"/0.4" margins this
# template uses. If the sheet still reports one page and no vertical break inside that
# box, it fits A4.
#
# Layout is never modified: the probe runs on a copy and the copy is closed unsaved.

param([Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)][string[]]$Paths)

# A4 print area under this template's margins, expressed as Letter margins.
$SideMargin = 0.366
$EndMargin  = 0.0535

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$failed = 0
try {
    foreach ($path in $Paths) {
        # A file that is not there is a failure, not a skip. Letting Resolve-Path throw
        # and carrying on printed PASS for the one workbook that existed and still left
        # $LASTEXITCODE at 0, which reads exactly like "all three verified".
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
            "FAIL  file not found   $path"
            $failed++
            continue
        }
        $resolved = (Resolve-Path -LiteralPath $path).Path
        $probe = Join-Path $env:TEMP ("a4probe-" + [guid]::NewGuid().ToString("N") + ".xlsx")
        Copy-Item -LiteralPath $resolved -Destination $probe -Force

        $book = $excel.Workbooks.Open($probe)
        try {
            $sheet = $book.Worksheets.Item(1)
            $setup = $sheet.PageSetup
            $setup.LeftMargin   = $excel.InchesToPoints($SideMargin)
            $setup.RightMargin  = $excel.InchesToPoints($SideMargin)
            $setup.TopMargin    = $excel.InchesToPoints($EndMargin)
            $setup.BottomMargin = $excel.InchesToPoints($EndMargin)

            $pages  = $setup.Pages.Count
            $breaks = $sheet.VPageBreaks.Count
            $name   = Split-Path $resolved -Leaf

            if ($pages -eq 1 -and $breaks -eq 0) {
                "PASS  1 page, no vertical break   $name"
            } else {
                "FAIL  $pages page(s), $breaks vertical break(s)   $name"
                $failed++
            }
        } finally {
            $book.Close($false)
            Remove-Item -LiteralPath $probe -Force -ErrorAction SilentlyContinue
        }
    }
} finally {
    $excel.Quit()
}

if ($failed -gt 0) { exit 1 }
