[CmdletBinding()]
param([Parameter(Mandatory)][string]$RunDirectory)
$ErrorActionPreference = 'Stop'
$receipt = Get-Content -LiteralPath (Join-Path $RunDirectory 'receipt.json') -Raw | ConvertFrom-Json
$plan = Get-Content -LiteralPath (Join-Path $RunDirectory 'plan.json') -Raw | ConvertFrom-Json
if ($receipt.State -ne 'complete') { throw 'A completed move receipt is required' }
$categoryDescriptions = @{
  '01_工作业务'='报价、客户沟通、展会、网站报告和交接；以前的实习另放子目录。'
  '02_学习研究'='课程作业、研究论文、文学笔记，以及女性传播、黑神话文化研究。'
  '03_个人生活'='签证、旅行、简历申请、租房和生活记录。'
  '04_图片设计'='设计导出、AI 图片素材、照片和截图。'
  '05_软件安装包'='软件安装包和资源包；已安装程序的路径保留。'
  '06_影音娱乐'='音乐素材、影视字幕、视频和游戏入口。'
  '99_待确认'='用途不明确的文档、压缩包和原有文件夹，保留原名。'
}
foreach ($root in $receipt.Roots) {
  $entries = @($receipt.Entries | Where-Object Root -eq $root)
  $index = Join-Path $root '00_整理说明'
  if (Test-Path -LiteralPath $index) { throw "Index destination already exists: $index" }
  New-Item -ItemType Directory -Path $index | Out-Null
  $rows = foreach ($entry in $entries) {
    foreach ($file in $entry.Inventory | Where-Object Kind -eq 'File') {
      $original = $entry.Source
      $current = $entry.Destination
      if ($file.Path -ne '.') { $original = Join-Path $original $file.Path; $current = Join-Path $current $file.Path }
      [pscustomobject]@{'原位置'=$original; '现在位置'=$current; '归类'=$entry.Reason; '文件大小字节'=$file.Bytes; 'SHA256'=$file.SHA256}
    }
  }
  $rows | Export-Csv -LiteralPath (Join-Path $index '文件去哪了.csv') -Encoding utf8BOM -NoTypeInformation
  $entries | Select-Object @{n='原位置';e={$_.Source}},@{n='现在位置';e={$_.Destination}},@{n='归类';e={$_.Reason}} | Export-Csv -LiteralPath (Join-Path $index '目录与散文件清单.csv') -Encoding utf8BOM -NoTypeInformation
  $categories = @(Get-ChildItem -LiteralPath $root -Directory | Where-Object Name -match '^(0[1-6]|99)_' | Sort-Object Name)
  $held = @($plan.Held | Where-Object {(Split-Path -Parent $_.Path) -eq $root -and $_.Reason -notmatch '隐藏|临时'})
  $text = [Collections.Generic.List[string]]::new()
  $text.Add('桌面与下载整理说明 — 2026-10-09')
  $text.Add("本目录：$root")
  $text.Add("已归类 $($entries.Count) 个散文件或完整文件夹，内含 $(@($rows).Count) 个文件。")
  $text.Add('文件和重复副本全部保留，原文件名保留；完整文件夹的内部结构保留。')
  $text.Add('')
  foreach ($category in $categories) { $text.Add("$($category.Name)：$($categoryDescriptions[$category.Name])") }
  $text.Add('')
  $text.Add('查找文件：打开“文件去哪了.csv”，按 Ctrl+F 搜索旧文件名。“现在位置”就是新的完整路径。')
  $text.Add('“目录与散文件清单.csv”只列这次移动的顶层项目，方便快速查看。')
  $text.Add('')
  $text.Add('保留原路径的可见入口：')
  foreach ($item in $held) { $text.Add("$($item.Path) — $($item.Reason)") }
  $text.Add('隐藏系统文件、Office 临时锁文件也保留原位置。')
  $text.Add('Claude 数据仍在 C:\Users\86132\.claude；Claude/Codex 工作项目仍在原 Downloads\cantonlock。')
  $text.Add('这次是按用途整理，没有继续跨盘迁移；软件入口和已安装程序不改动。')
  $text.Add('')
  $text.Add("详细校验和移动记录：$(Join-Path $RunDirectory 'receipt.json')")
  $text.Add('需要撤回这次归类时，可在 PowerShell 粘贴以下整行命令：')
  $text.Add("& 'E:\WorkResources\tools\powershell\pwsh.exe' -NoProfile -File '$(Join-Path $RunDirectory 'Organize-VerifiedItems.ps1')' -Mode Undo -RunDirectory '$RunDirectory'")
  $text.Add('成功时显示 Mode=Undo、State=undone；若原位置已有同名文件或归类后的内容已改动，会报错并停止。此时保留现场，把错误信息发给 Codex，不要覆盖或删除文件。')
  $text.Add('撤回会恢复被移动的文件；分类目录和本说明会保留。')
  $text | Set-Content -LiteralPath (Join-Path $index '整理说明.txt') -Encoding utf8BOM
}
Write-Output 'Indexes written to Desktop and Downloads 00_整理说明; private receipts retained on E.'
