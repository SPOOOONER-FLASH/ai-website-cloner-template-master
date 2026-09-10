# Codex — 原图 Blender 阶段交付

- 完成13份主展示：客户三件原图组合、307＋072＋015已确认部件组合、11个单品；PNG、打包纹理的 .blend、每图QA均落盘。不是产品CAD，照片排版不证明真实比例或完整供货套装。
- 21项审阅页面归档20个型号、153张原图；13张旧生成稿及1张抠图实验退回折叠。孔位、旋钮、螺丝变形不能靠继续整图生成解决。最新目标已改为原图保真优先。
- 新增072记录已现场核对双欧规孔及五张图，撤销旧“072缺图”状态；307线上页面明确072及015/9080E。锁芯仍依门厚另选。原作图清单中的035不能当307的指定配件。
- 文件：docs/design-references/2026-09-09-professional-hardware-sets/；scripts/build-hardware-image-board.mjs；scripts/blender/hardware-photo-stage.py、hardware-source-layout.py、verify-hardware-source-layouts.py；docs/research/2026-09-09-hardware-image-standards.md；目标文件。
- 验证：全部153张来源与27张输出完整解码；13个PNG目检；13份 .blend 重新打开确认照片已打包。build脚本ESLint通过。隔离工作树 e780b52788 的 npm run check 通过：241单测、25导出测试、1367页内部链接/资源检查；为匹配当前工作内容，隔离树补入共享目录已有的12个未跟踪改名MP4。未改主树这些视频。浏览器控制不可用，HTML未声称完成浏览器视觉验收。
- 未碰其他任务的页面、目录、public资源或out；并行任务持有发布构建。本批是设计文件推送，不是生产图片替换或部署。
- 下一步：以源照片前景制作更多空间构图，完成两张指定场景的最终替代图。当前统一照片卡是保真基础，不是全部美术需求完成。主匙实物组、玻璃门配置及缺唯一型号项仍保持具体缺口。应用Goal仍paused，当前工具无修改文字/恢复接口；未伪标完成。
