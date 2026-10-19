"""第 140 届广交会第一期 · 3 小时观展动线图（手机竖屏）。

布局取自官方《第一期导向手册》第 3 页全馆示意图和第 12 页 B 区楼层图（2026-10-08 发布）：
北面是珠江；A 区 1–5 馆在南排、6–8 在北；B 区 9–11 在南排、12–13 在北；D 区 17–20 在西，
广交会会堂在 A、D 之间；C 区 14–16 在新港东路以南。2 楼珠江散步道经中央平台连通 A、B。
只画相对位置，不按比例。

    python scripts/canton-fair/build_route_map.py
输出 docs/collaboration/assets/2026-10-19-canton-fair-route.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path("docs/collaboration/assets/2026-10-19-canton-fair-route.png")
W, H = 1080, 1600
FONT = "C:/Windows/Fonts/msyh.ttc"
BOLD = "C:/Windows/Fonts/msyhbd.ttc"
f = lambda s, b=False: ImageFont.truetype(BOLD if b else FONT, s)

INK, MUTED, LINE = (30, 30, 30), (110, 110, 110), (200, 200, 200)
AREA = {"A": (66, 103, 178), "B": (196, 170, 90), "C": (60, 160, 140), "D": (140, 110, 170)}
ROUTE = (214, 40, 40)
STAR = (230, 120, 0)

im = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(im)
d.text((40, 30), "广交会第一期 · 3 小时动线（从 B 区出发）", font=f(40, True), fill=INK)
d.text((40, 88), "10-19 收展日 · 只画相对位置，不按比例 · 上北下南", font=f(24), fill=MUTED)

# 珠江与道路
d.rectangle([40, 140, W - 40, 170], fill=(200, 225, 245))
d.text((W // 2 - 40, 140), "珠 江（北）", font=f(22), fill=(60, 100, 150))
d.rectangle([40, 640, W - 40, 668], fill=(235, 235, 235))
d.text((60, 640), "新港东路", font=f(20), fill=MUTED)


def hall(box, label, color, alpha=1.0, text_color="white", size=30):
    x0, y0, x1, y1 = box
    c = tuple(int(255 - (255 - v) * alpha) for v in color)
    d.rounded_rectangle(box, 10, fill=c)
    tw = d.textlength(label, font=f(size, True))
    d.text(((x0 + x1 - tw) / 2, (y0 + y1) / 2 - size * 0.65), label, font=f(size, True), fill=text_color)


# D 区（西）
for k, n in enumerate(["17", "18", "19", "20"]):
    hall((50 + k * 52, 380, 98 + k * 52, 560), n, AREA["D"], 0.45, INK, 24)
d.text((60, 570), "D 区", font=f(26, True), fill=AREA["D"])
# 广交会会堂
hall((70, 220, 250, 350), "广交会会堂", AREA["D"], 0.8, "white", 24)
# A 区
for k, n in enumerate(["1", "2", "3", "4", "5"]):
    hall((290 + k * 64, 400, 346 + k * 64, 560), n, AREA["A"], 0.4, INK, 26)
for k, n in enumerate(["6", "7", "8"]):
    hall((300 + k * 100, 230, 390 + k * 100, 360), n, AREA["A"], 0.4, INK, 26)
d.text((300, 570), "A 区", font=f(26, True), fill=AREA["A"])
# 中央平台
d.rounded_rectangle((618, 230, 668, 560), 8, fill=(225, 225, 225))
for k, ch in enumerate("中央平台"):
    d.text((630, 300 + k * 50), ch, font=f(24), fill=INK)
# B 区
for k, n in enumerate(["9", "10", "11"]):
    hall((700 + k * 112, 400, 800 + k * 112, 560), n, AREA["B"], 1.0, "white", 34)
for k, n in enumerate(["12", "13"]):
    hall((820 + k * 112, 230, 920 + k * 112, 360), n, AREA["B"], 0.55, INK, 30)
d.text((700, 570), "B 区（起点）", font=f(26, True), fill=AREA["B"])
# C 区（南）
for k, n in enumerate(["14", "15", "16"]):
    hall((560 + k * 110, 700, 660 + k * 110, 830), n, AREA["C"], 0.45, INK, 28)
d.text((560, 845), "C 区（新港东路以南）", font=f(24, True), fill=AREA["C"])


def badge(xy, n, color=ROUTE, r=24):
    x, y = xy
    d.ellipse((x - r, y - r, x + r, y + r), fill=color)
    tw = d.textlength(str(n), font=f(28, True))
    d.text((x - tw / 2, y - 20), str(n), font=f(28, True), fill="white")


def arrow(points, color=ROUTE, w=8, dash=False):
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if dash:
            steps = int(max(abs(x1 - x0), abs(y1 - y0)) // 22) or 1
            for s in range(0, steps, 2):
                a, b = s / steps, min(1, (s + 1) / steps)
                d.line((x0 + (x1 - x0) * a, y0 + (y1 - y0) * a, x0 + (x1 - x0) * b, y0 + (y1 - y0) * b), fill=color, width=w)
        else:
            d.line((x0, y0, x1, y1), fill=color, width=w)
    (x0, y0), (x1, y1) = points[-2], points[-1]
    import math
    ang = math.atan2(y1 - y0, x1 - x0)
    L = 26
    d.polygon([(x1, y1), (x1 - L * math.cos(ang - 0.45), y1 - L * math.sin(ang - 0.45)), (x1 - L * math.cos(ang + 0.45), y1 - L * math.sin(ang + 0.45))], fill=color)


# 路线：10.1 → 11.1 →（13.1）→ 2 楼散步道 → 中央平台 → A 区散步道 → 广交会会堂 3 楼
arrow([(880, 530), (968, 530)])
badge((842, 530), 1)
badge((1004, 530), 2)
arrow([(1004, 505), (1004, 392)], dash=True)
badge((1012, 252), 3, MUTED, 20)
arrow([(990, 380), (700, 380), (668, 380)])
badge((643, 196), 4)
arrow([(618, 380), (270, 380), (250, 300)])
badge((160, 196), 5)
d.text((700, 384), "2 楼珠江散步道", font=f(20), fill=ROUTE)
# 可选：C 区照明、D 区 17.2 安防
arrow([(643, 560), (643, 690)], STAR, 6, dash=True)
badge((900, 765), "C", STAR, 22)
arrow([(250, 290), (200, 380)], STAR, 6, dash=True)
badge((236, 600), "D", STAR, 22)

# 图例 / 时间
y = 940
d.line((40, y - 16, W - 40, y - 16), fill=LINE, width=2)
items = [
    (ROUTE, "1", "10.1 锁具馆（1 楼）· 0:00–1:10", "雅洁 F15-16 ★ · 找推杆墙 H43 / K41 · 汉瑞 L07 · 补拍 OUBAO / 必达"),
    (ROUTE, "2", "11.1 门窗五金（1 楼，东隔壁）· 1:10–1:55", "拓臣 H07-12 · TUTTI H34 · 富尔达 L25 · 闭门器一排 I17–J25 · 科艺 H19"),
    (MUTED, "3", "13.1 合页铰链（北面）· 只扫一眼，5 分钟", "有时间才去；没时间跳过"),
    (ROUTE, "4", "上 2 楼，经珠江散步道到中央平台 · 2:00–2:20", "中央平台西侧「新品首发展厅」：看单品展台和说明牌"),
    (ROUTE, "5", "沿 A 区 2 楼往西到广交会会堂 3 楼 · 2:25–2:55", "CF 奖展示厅 ★：陈列、灯光、留白，最接近 BAU"),
    (STAR, "C", "可选：C 区 14.4 / 15.4 照明（经中央平台南天桥）", "只看展位打光，拍天花和光斑；和第 5 站二选一"),
    (STAR, "D", "可选：D 区 17.2 安防用品", "门禁、电锁，同一批工程客户；时间富余才去"),
]
for color, n, title, sub in items:
    badge((70, y + 22), n, color, 22)
    d.text((110, y), title, font=f(26, True), fill=INK)
    d.text((110, y + 38), sub, font=f(21), fill=MUTED)
    y += 82
d.text((40, H - 40), "来源：广交会官方第一期导向手册 p3、p12；展位号：广交会 365，2026-10-18 查询", font=f(18), fill=MUTED)

OUT.parent.mkdir(parents=True, exist_ok=True)
im.save(OUT, optimize=True)
print(OUT, im.size)
