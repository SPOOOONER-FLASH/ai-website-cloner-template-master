"""Composite one ONE TAKE film: gradient field, HYDE lockup, grain, vignette → mp4.

python3 scripts/blender/one-take-composite.py <frames_dir> <out.mp4> <Archivo.ttf> <logo.png>
<frames_dir> holds f_0001.png… and the lockup.json that one-take.py wrote beside them.
Archivo is the site typeface (Google Fonts, variable wght/wdth); the logo is
public/images/brand/hyde/hyde-logo-horizontal-graphite.svg rendered 150 px wide.
"""
import sys, glob, json, os, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont
D, OUT, FONT, LOGO = sys.argv[1:5]; FPS = 24
W, H = 1280, 720
lock = json.load(open(os.path.join(D, "lockup.json")))["lockup"]
model, dims, code, finish = lock
t = np.linspace(0, 1, H)[:, None]
top, bot = np.array([138, 138, 140]), np.array([234, 234, 234])
g = (top + (bot - top) * t ** 0.8)[:, None, :].repeat(W, 1).reshape(H, W, 3)
BG = Image.fromarray(g.astype(np.uint8)).convert("RGBA")
rng = np.random.default_rng(7)
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.14 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.2
def font(sz, w):
    f = ImageFont.truetype(FONT, sz); f.set_variation_by_axes([w, 100]); return f
logo = Image.open(LOGO).convert("RGBA")
lockup = Image.new("RGBA", (W, H)); d = ImageDraw.Draw(lockup); ink = (38, 38, 40, 255)
y0 = 612
w1 = int(max(d.textlength(model, font=font(22, 650)), d.textlength(dims, font=font(20, 380))))
w2 = int(max(d.textlength(code, font=font(22, 650)) if code else 0, d.textlength(finish, font=font(20, 380))))
x = min(640, W - 64 - (logo.width + 36 + w1 + 40 + w2))   # right-align when the lockup is long
lockup.alpha_composite(logo, (x, y0 + 2)); x += logo.width + 36
d.text((x, y0), model, font=font(22, 650), fill=ink)
d.text((x, y0 + 27), dims, font=font(20, 380), fill=ink)
x += int(max(d.textlength(model, font=font(22, 650)), d.textlength(dims, font=font(20, 380)))) + 40
if code: d.text((x, y0), code, font=font(22, 650), fill=ink)
d.text((x, y0 + 27), finish, font=font(20, 380), fill=ink)
frames = sorted(glob.glob(os.path.join(D, "f_*.png")))
ff = subprocess.Popen(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS),
    "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "17", "-preset", "slow", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
for i, f in enumerate(frames):
    im = BG.copy(); im.alpha_composite(Image.open(f).convert("RGBA"))
    a = min(max((i / FPS - 9.6) / 1.0, 0), 1)                       # lockup fades in as the pull-back settles
    if a > 0:
        l = lockup.copy(); l.putalpha(l.getchannel("A").point(lambda v: int(v * a))); im.alpha_composite(l)
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    arr = arr * vig[..., None] + rng.normal(0, 2.2, arr.shape)      # vignette + fine grain: less CG, more film
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(ff.stdin, "PNG")
ff.stdin.close(); ff.wait(); print("OK", model, len(frames), ff.returncode)
