"""One-off generator for favicon set + OG image from the real brand badge.
Run once; outputs land directly in public/. Not part of the build pipeline.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')
BRAND = os.path.join(PUB, 'assets', 'brand')

badge = Image.open(os.path.join(BRAND, 'logo-badge-black.png')).convert('RGBA')

BG = (20, 20, 20, 255)       # matches theme-color #141414
CARD = (10, 10, 10, 255)

def flatten(img, bg):
    canvas = Image.new('RGBA', img.size, bg)
    canvas.alpha_composite(img)
    return canvas.convert('RGB')

def square_icon(size, bg=None):
    im = badge.resize((size, size), Image.LANCZOS)
    if bg is None:
        return im
    return flatten(im, bg)

# --- favicons ---
square_icon(16).save(os.path.join(PUB, 'favicon-16x16.png'))
square_icon(32).save(os.path.join(PUB, 'favicon-32x32.png'))
square_icon(180, BG).save(os.path.join(PUB, 'apple-touch-icon.png'))
square_icon(192).save(os.path.join(PUB, 'android-chrome-192x192.png'))
square_icon(512).save(os.path.join(PUB, 'android-chrome-512x512.png'))

# multi-size .ico
ico_sizes = [16, 32, 48]
ico_imgs = [badge.resize((s, s), Image.LANCZOS) for s in ico_sizes]
ico_imgs[0].save(os.path.join(PUB, 'favicon.ico'), format='ICO', sizes=[(s, s) for s in ico_sizes])

# --- OG image, 1200x630 ---
W, H = 1200, 630

# vertical vignette (small gradient strip stretched, cheap + smooth)
strip = Image.new('RGB', (1, H))
spx = strip.load()
for y in range(H):
    t = y / H
    shade = int(14 + 10 * (1 - abs(t - 0.5) * 2))
    spx[0, y] = (shade, shade, shade)
og = strip.resize((W, H))

# faint chrome-silver glow behind the badge (brand accent, not an arbitrary color)
glow = Image.new('L', (W, H), 0)
gdraw = ImageDraw.Draw(glow)
gdraw.ellipse([W * 0.5 - 260, H / 2 - 260 - 40, W * 0.5 + 260, H / 2 + 260 - 40], fill=60)
glow = glow.filter(ImageFilter.GaussianBlur(110))
glow_rgb = Image.new('RGB', (W, H), (138, 138, 144))
og.paste(glow_rgb, (0, 0), glow)

badge_size = 300
badge_r = badge.resize((badge_size, badge_size), Image.LANCZOS)
bx, by = (W - badge_size) // 2, 60
og.paste(badge_r, (bx, by), badge_r)

draw = ImageDraw.Draw(og)

try:
    font_tag = ImageFont.truetype(r"C:\Windows\Fonts\bahnschrift.ttf", 36)
    font_sub = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 24)
except Exception:
    font_tag = ImageFont.load_default()
    font_sub = ImageFont.load_default()

tagline = "WHERE YOUR SMILE BECOMES YOUR SIGNATURE"
sub = "Custom-Fit Grillz  ·  Handmade Jewelry  ·  Alabama"

def draw_centered(draw, text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, y), text, font=font, fill=fill)

draw_centered(draw, tagline, by + badge_size + 40, font_tag, (240, 236, 250))
draw_centered(draw, sub, by + badge_size + 40 + 48, font_sub, (176, 168, 190))

og.save(os.path.join(PUB, 'og-image.jpg'), quality=92)

# --- PWA manifest ---
manifest = '''{
  "name": "GoldMoufDog Custom Grillz & Jewelry",
  "short_name": "GoldMoufDog",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#141414",
  "background_color": "#141414",
  "display": "standalone"
}
'''
with open(os.path.join(PUB, 'site.webmanifest'), 'w') as f:
    f.write(manifest)

print('done')
