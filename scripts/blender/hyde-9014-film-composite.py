"""Gradient sweep + HYDE lockup over the frames of scripts/blender/hyde-9014-film.py.

python3 scripts/blender/hyde-9014-film-composite.py <frames_dir> <out.mp4> <Archivo.ttf> <logo.png>
Archivo is the site typeface (Google Fonts, variable wght/wdth). The logo PNG is
public/images/brand/hyde/hyde-logo-horizontal-graphite.svg rendered 150 px wide.
Needs Pillow, numpy and ffmpeg on PATH.
"""
import sys, glob, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont
D, OUT, FONT, LOGO = sys.argv[1:5]; FPS = 24
W, H = 1280, 720
t = np.linspace(0, 1, H)[:, None]
top, bot = np.array([128, 128, 130]), np.array([226, 226, 226])
g = (top + (bot - top) * t ** 0.8)[:, None, :].repeat(W, 1).reshape(H, W, 3)
BG = Image.fromarray(g.astype(np.uint8)).convert("RGBA")
def font(sz, w):
    f = ImageFont.truetype(FONT, sz); f.set_variation_by_axes([w, 100]); return f
logo = Image.open(LOGO).convert("RGBA")
lock = Image.new("RGBA", (W, H))
d = ImageDraw.Draw(lock); ink = (38, 38, 40, 255)
x0, y0 = 640, 612
lock.alpha_composite(logo, (x0, y0 + 2))
x = x0 + logo.width + 36
d.text((x, y0), "9014", font=font(22, 650), fill=ink)
d.text((x, y0 + 27), "135 · 60 · Ø19 mm", font=font(20, 380), fill=ink)
x += int(max(d.textlength("9014", font=font(22, 650)), d.textlength("135 · 60 · Ø19 mm", font=font(20, 380)))) + 40
d.text((x, y0), "SSS", font=font(22, 650), fill=ink)
d.text((x, y0 + 27), "satin stainless steel", font=font(20, 380), fill=ink)
frames = sorted(glob.glob(f"{D}/f_*.png"))
ff = subprocess.Popen(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS),
    "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", "-movflags", "+faststart", OUT],
    stdin=subprocess.PIPE)
n = len(frames)
for i, f in enumerate(frames):
    im = BG.copy(); im.alpha_composite(Image.open(f).convert("RGBA"))
    s = i / FPS; a = min(max((s - 14.2) / 1.0, 0), 1)       # lockup fades in during the pull-back hold
    if a > 0:
        l = lock.copy(); l.putalpha(l.getchannel("A").point(lambda v: int(v * a))); im.alpha_composite(l)
    im.convert("RGB").save(ff.stdin, "PNG")
ff.stdin.close(); ff.wait(); print("OK", n, ff.returncode)
