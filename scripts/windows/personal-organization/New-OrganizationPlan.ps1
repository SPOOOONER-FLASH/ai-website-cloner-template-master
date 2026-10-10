[CmdletBinding()]
param([Parameter(Mandatory)][string]$RunDirectory)
$ErrorActionPreference = 'Stop'
$roots = @((Join-Path $env:USERPROFILE 'Desktop'), (Join-Path $env:USERPROFILE 'Downloads'))
$protectedNames = @('cantonlock','hyde','hyde-c-original-20260925','APP Desktop','Cursor','GAMER','Compressed','Documents','Music','Programs','Video')
$folderCategories = @{
  '600 research'='02_学习研究\研究论文与资料'
  'behavior of entertainment'='02_学习研究\课程作业与项目'
  'CSC'='02_学习研究\课程作业与项目'
  'GUSTO'='01_工作业务\以前的实习与项目'
  '个人社团以及建立信息'='03_个人生活\简历与申请'
  '申根签证申请表'='03_个人生活\签证与旅行'
  '美国签证'='03_个人生活\签证与旅行'
  '尼日利亚'='01_工作业务\客户资料'
  'hungry root I hate'='04_图片设计\图片与截图'
  '新建文件夹'='99_待确认\原有文件夹'
  'Adobe Illustrator 2021 SP'='05_软件安装包\安装与软件资源'
  'clashcn.com_cfw-cn-app_0.20.39'='05_软件安装包\安装与软件资源'
  'Green and Beige Illustrative Email Marketing Campaign Infographic'='04_图片设计\设计导出'
  '未命名的设计'='04_图片设计\设计导出'
}
function Category($item) {
  $name = $item.Name
  $ext = $item.Extension.ToLowerInvariant()
  if ($item.PSIsContainer) {
    if ($folderCategories.ContainsKey($name)) { return $folderCategories[$name] }
    if ($name -match 'Transformers|BluRay|WEB-DL|rarbg') { return '06_影音娱乐\影视与字幕' }
    return '99_待确认\原有文件夹'
  }
  if ($name -match '^cantonlock\.com') { return '01_工作业务\网站检查报告' }
  if ($name -match 'BAU.?2027') { return '01_工作业务\展会资料' }
  if ($name -match 'Quotation|询盘分析|三个邮件|^\+234') { return '01_工作业务\报价与客户沟通' }
  if ($name -match '^CLIENT-RUNBOOK|HYDE|RAYEN|huien-preview|master-key-plan|Glass door hardware|谷歌.*网络') { return '01_工作业务\交接与网站资料' }
  if ($name -match 'Visa|Visum|Invitation Letter|邀请函|DriverLicense') { return '03_个人生活\签证与旅行' }
  if ($name -match '^CV_|简历|SOP|推荐信') { return '03_个人生活\简历与申请' }
  if ($name -match 'Lease|Brokerage|Conservice|Complaint|BBB response|crystaltowers') { return '03_个人生活\租房与生活记录' }
  if ($ext -in @('.exe','.msi','.msix','.apk','.dmg') -or $name -match 'DownKyi|clashcn') { return '05_软件安装包\安装与软件资源' }
  if ($name -match '未命名的设计|Infographic|Shampoo|九樽|植萃|Jiuzun|Customer Journey|Antonyms|key point poster|media plan|Gantt|传统文化古风|餐饮宣传|葫芦娃|试用魔力') { return '04_图片设计\设计导出' }
  if ($name -match '^DALL') { return '04_图片设计\AI图片素材' }
  if ($ext -in @('.png','.jpg','.jpeg','.jfif','.webp','.svg')) { return '04_图片设计\图片与截图' }
  if ($ext -in @('.mp3','.wav','.flac')) { return '06_影音娱乐\音乐素材' }
  if ($ext -in @('.mp4','.mov','.mkv','.torrent','.srt','.ass')) { return '06_影音娱乐\影视与视频' }
  if ($name -match '黑神话|悟空|西游记') { return '02_学习研究\黑神话与文化研究' }
  if ($name -match '女性|feminis|Gender|小红书|赋权|增权') { return '02_学习研究\女性与传播研究' }
  if ($name -match 'Gatsby|盖茨比|DownSub|bilibili') { return '02_学习研究\文学与字幕笔记' }
  if ($name -match 'grounded-theory|Journal|frison|harlow|Garza|Bridging|jahng|Philippi|Roy-Social|loneliness|Communication Patterns|推特|传播学') { return '02_学习研究\研究论文与资料' }
  if ($name -match 'Assignment|^ass\d|AAP|rubric|^PPT\d|^Self-Deception|^The Introduction of Lie|信与不信|思考题|参考文献|Class Schedule|新生答疑|podcast|Radio Dramas|Project Pitch|Game Script|^historical|^outline|^The[_ ]Role[_ ]of[_ ]Communication|^The Role of Communication|寻梦环游记|^JHU_|caregiving|^point_|^copypaste|^ai[-必]|^sim-|Answer_to_Question|Healthcare_Organizations|国货.*报告|抖音.*报告') { return '02_学习研究\课程作业与项目' }
  if ($ext -in @('.zip','.rar','.7z','.tar','.gz')) { return '99_待确认\压缩包' }
  if ($ext -in @('.pdf','.doc','.docx','.ppt','.pptx','.xlsx','.caj','.txt')) { return '99_待确认\用途不明确的文档' }
  return '99_待确认\其他文件'
}
$entries = [Collections.Generic.List[object]]::new()
$held = [Collections.Generic.List[object]]::new()
$protected = [Collections.Generic.List[string]]::new()
foreach ($root in $roots) {
  foreach ($item in Get-ChildItem -LiteralPath $root -Force) {
    $reason = ''
    if ($item.Name -in $protectedNames) { $reason = '固定项目、程序入口或既有目录'; $protected.Add($item.FullName) }
    elseif ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { $reason = '既有目录链接' }
    elseif ($item.Attributes -band ([IO.FileAttributes]::Hidden -bor [IO.FileAttributes]::System)) { $reason = '隐藏或系统文件' }
    elseif ($item.Name -match '^(~\$|~WRL)' -or $item.Extension -in @('.crdownload','.part','.partial','.tmp')) { $reason = '临时或未完成文件' }
    elseif ($item.Name -match '^\d{2}_') { $reason = '已有分类目录' }
    elseif ($item.Extension -in @('.lnk','.url')) { $reason = '常用桌面快捷方式' }
    if ($reason) { $held.Add([pscustomobject]@{Path=$item.FullName;Reason=$reason}); continue }
    $category = Category $item
    $destination = Join-Path (Join-Path $root $category) $item.Name
    if (Test-Path -LiteralPath $destination) { throw "Collision requires manual classification: $destination" }
    $entries.Add([pscustomobject]@{Source=$item.FullName;Destination=$destination;Reason=$category})
  }
}
New-Item -ItemType Directory -Path $RunDirectory -Force | Out-Null
$plan = [pscustomobject]@{Version=1;CreatedUtc=[datetime]::UtcNow.ToString('o');Roots=$roots;ProtectedPaths=@($protected);Held=@($held);Entries=@($entries)}
$plan | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunDirectory 'plan.json') -Encoding utf8
$entries | Group-Object Reason | Sort-Object Name | Select-Object Name,Count | Format-Table -AutoSize
Write-Output "PLAN: $($entries.Count) moves; $($held.Count) held. No items moved yet."
