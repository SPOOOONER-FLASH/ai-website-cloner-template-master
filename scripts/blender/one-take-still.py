"""One ONE TAKE frame as a still: the film's gradient field, grain and vignette, no lockup.

python3 scripts/blender/one-take-still.py <frame.png> <out.webp> [width]

Used for the detail images on /stories/9014/ — frames 181 and 217 of the 9014 film,
rendered at RES 2.0 / 32 samples by one-take.py. Same field as one-take-composite.py, scaled
to the frame, so a still and the film beside it read as one shoot.
"""
import sys, numpy as np
from PIL import Image
SRC, OUT = sys.argv[1:3]; WIDTH = int(sys.argv[3]) if len(sys.argv) > 3 else 1600
fg = Image.open(SRC).convert("RGBA"); W, H = fg.size
t = np.linspace(0, 1, H)[:, None]
top, bot = np.array([138, 138, 140]), np.array([234, 234, 234])
g = (top + (bot - top) * t ** 0.8)[:, None, :].repeat(W, 1).reshape(H, W, 3)
im = Image.fromarray(g.astype(np.uint8)).convert("RGBA"); im.alpha_composite(fg)
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.14 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.2
arr = np.asarray(im.convert("RGB")).astype(np.float32) * vig[..., None]
arr += np.random.default_rng(7).normal(0, 2.2 * W / 1280, arr.shape)
out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
out.resize((WIDTH, round(H * WIDTH / W)), Image.LANCZOS).save(OUT, "WEBP", quality=84)
print("OK", OUT)
