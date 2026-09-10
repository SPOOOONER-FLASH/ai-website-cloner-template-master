# Codex — 原图进入石材场景

- 在36aa5fa73c的13份照片卡后，补564暖石材与310冷石材两份PNG/Blender。产品源RGB逐像素核对，背景与既有边缘alpha单独处理；不重画金属或模拟安装。已目检最终成图，四个564通孔、锁舌和实际两件完整保留；310为完整一件。
- 新脚本 scripts/build-hardware-material-studies.mjs、scripts/blender/hardware-material-study.py；产物在原审阅包 material-studies/。审阅页已有15份主展示与14份退回存档，29张输出、153张来源全量解码。
- 15份.blend全部重新打开，确认纹理打包。新增脚本ESLint通过；隔离环境完整npm run check再次通过：241单测、25导出测试、1367页内部链接和资源检查均通过。
- 图像仍受工厂源图分辨率限制；2D产品照片不能换角度当完整CAD。具体插芯配套、多样空间、客户两张指定空间仍不标全完成。
- 上批提交遇到三小时前遗留的零字节index.lock，确认无git进程且可独占打开后移到tmp/codex-stale-index-20260910-033045.lock保留，没有删除或修改索引内容。
- 未改其他任务的content/public/out；本批提交为设计产物。后续继续逐图遮罩与构图，不能对不同部件盲用这两款的连通组件数量配置。
