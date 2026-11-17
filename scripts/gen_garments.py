"""
Placeholder garment cutout generator for Rabble.
Produces studio-isolated, transparent-background garment cutouts with
soft fabric shading, folds, grain and printed graphics - NOT flat vector stickers.
Replace with production .webp photography by swapping files in /public/garments
(paths live only in /data/products.ts).
"""
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def font(px):
    return ImageFont.truetype(FONT_PATH, int(px))

random.seed(7)
np.random.seed(7)

W, H = 960, 1160          # logical canvas
SS = 2                    # supersample
GW, GH = W * SS, H * SS

OUT = "/home/claude/rabble/public/garments"
EDI = "/home/claude/rabble/public/editorial"


def bezier(pts, n=48):
    """De Casteljau evaluation of a bezier defined by control pts."""
    out = []
    for i in range(n + 1):
        t = i / n
        p = [list(pt) for pt in pts]
        while len(p) > 1:
            p = [[p[j][0] + (p[j + 1][0] - p[j][0]) * t,
                  p[j][1] + (p[j + 1][1] - p[j][1]) * t] for j in range(len(p) - 1)]
        out.append(tuple(p[0]))
    return out


def path_points(segments):
    pts = []
    for seg in segments:
        pts.extend(bezier(seg)[:-1])
    return [(x * SS, y * SS) for x, y in pts]


def jitter(pts, amp=2.0):
    return [(x + random.uniform(-amp, amp) * SS, y + random.uniform(-amp, amp) * SS) for x, y in pts]


def make_mask(pts):
    m = Image.new("L", (GW, GH), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return m.filter(ImageFilter.GaussianBlur(1.5 * SS))


def shade_garment(base_rgb, mask, folds, highlight_box, extra_dark=None):
    """Return RGBA garment body with form shading, folds and grain."""
    img = Image.new("RGB", (GW, GH), base_rgb)

    # --- form shading: darken toward silhouette edges (rounded fabric) ---
    hard = mask.point(lambda v: 255 if v > 128 else 0)
    inner = hard.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MinFilter(9))
    edge = ImageOps.invert(inner).point(lambda v: v)
    edge = Image.composite(edge, Image.new("L", (GW, GH), 0), hard)
    edge = edge.filter(ImageFilter.GaussianBlur(26 * SS / 2))
    dark = Image.new("RGB", (GW, GH), tuple(max(0, c - 70) for c in base_rgb))
    img = Image.composite(dark, img, edge.point(lambda v: int(v * 0.75)))

    # --- centre highlight ---
    hl = Image.new("L", (GW, GH), 0)
    d = ImageDraw.Draw(hl)
    d.ellipse([c * SS for c in highlight_box], fill=46)
    hl = hl.filter(ImageFilter.GaussianBlur(70 * SS / 2))
    light = Image.new("RGB", (GW, GH), tuple(min(255, c + 34) for c in base_rgb))
    img = Image.composite(light, img, hl)

    # --- fold shadows + sheen ---
    fl = Image.new("L", (GW, GH), 0)
    d = ImageDraw.Draw(fl)
    for seg in folds:
        pts = [(x * SS, y * SS) for x, y in bezier(seg, 36)]
        d.line(pts, fill=120, width=int(9 * SS))
    fl = fl.filter(ImageFilter.GaussianBlur(14 * SS / 2))
    dk2 = Image.new("RGB", (GW, GH), tuple(max(0, c - 48) for c in base_rgb))
    img = Image.composite(dk2, img, fl.point(lambda v: int(v * 0.55)))
    # offset sheen
    fs = fl.transform((GW, GH), Image.AFFINE, (1, 0, -8 * SS, 0, 1, -6 * SS))
    lt2 = Image.new("RGB", (GW, GH), tuple(min(255, c + 26) for c in base_rgb))
    img = Image.composite(lt2, img, fs.point(lambda v: int(v * 0.35)))

    if extra_dark:
        ed = Image.new("L", (GW, GH), 0)
        d = ImageDraw.Draw(ed)
        for box, a in extra_dark:
            d.ellipse([c * SS for c in box], fill=a)
        ed = ed.filter(ImageFilter.GaussianBlur(30 * SS / 2))
        dk3 = Image.new("RGB", (GW, GH), tuple(max(0, c - 60) for c in base_rgb))
        img = Image.composite(dk3, img, ed)

    # --- fabric grain ---
    arr = np.asarray(img).astype(np.int16)
    noise = np.random.normal(0, 5.0, (GH, GW, 1)).astype(np.int16)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)

    out = Image.new("RGBA", (GW, GH), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


# ---------------------------------------------------------------- silhouettes
def tee_outline(back=False):
    nl, nr = (352, 86), (608, 86)
    neck_dip = 150 if not back else 108
    segs = [
        [nl, (300, 92), (196, 118), (152, 132)],                 # left shoulder
        [(152, 132), (108, 230), (78, 340), (68, 396)],          # sleeve outer L
        [(68, 396), (118, 432), (182, 452), (222, 458)],         # sleeve hem L
        [(222, 458), (240, 420), (248, 400), (254, 392)],        # underarm L
        [(254, 392), (240, 640), (236, 900), (240, 1084)],       # body side L
        [(240, 1084), (400, 1096), (560, 1096), (720, 1084)],    # hem
        [(720, 1084), (724, 900), (720, 640), (706, 392)],       # body side R
        [(706, 392), (712, 400), (720, 420), (738, 458)],        # underarm R
        [(738, 458), (778, 452), (842, 432), (892, 396)],        # sleeve hem R
        [(892, 396), (882, 340), (852, 230), (808, 132)],        # sleeve outer R
        [(808, 132), (764, 118), (660, 92), nr],                 # right shoulder
        [nr, (560, neck_dip), (400, neck_dip), nl],              # neckline
    ]
    return jitter(path_points(segs), 1.6)


def tee_folds():
    return [
        [(300, 760), (360, 820), (420, 880), (430, 980)],
        [(640, 720), (600, 800), (560, 900), (570, 1010)],
        [(360, 950), (460, 985), (560, 985), (660, 950)],
        [(120, 300), (150, 340), (170, 380), (176, 408)],
        [(836, 300), (806, 340), (788, 380), (782, 408)],
        [(290, 500), (310, 560), (316, 620), (312, 680)],
        [(668, 520), (650, 590), (646, 650), (650, 700)],
    ]


def slip_outline():
    segs = [
        [(388, 92), (380, 150), (372, 190), (368, 214)],          # strap L
        [(368, 214), (412, 262), (452, 294), (480, 310)],         # V-neck L
        [(480, 310), (508, 294), (548, 262), (592, 214)],         # V-neck R
        [(592, 214), (588, 190), (580, 150), (572, 92)],          # strap R
        [(572, 92), (578, 92), (584, 92), (590, 92)],
        [(590, 92), (612, 200), (626, 330), (628, 430)],          # side R upper
        [(628, 430), (646, 640), (668, 880), (686, 1116)],        # flare R
        [(686, 1116), (560, 1132), (420, 1132), (274, 1116)],     # hem
        [(274, 1116), (292, 880), (314, 640), (332, 430)],        # flare L
        [(332, 430), (334, 330), (348, 200), (370, 92)],          # side L upper
        [(370, 92), (376, 92), (382, 92), (388, 92)],
    ]
    return jitter(path_points(segs), 1.4)


def slip_folds():
    return [
        [(400, 420), (396, 620), (392, 820), (396, 1040)],
        [(500, 360), (498, 600), (496, 840), (500, 1080)],
        [(590, 430), (596, 640), (604, 860), (612, 1050)],
        [(345, 500), (348, 700), (350, 900), (356, 1060)],
    ]


def coord_outline():
    segs = [
        [(356, 100), (300, 108), (230, 124), (196, 138)],         # shoulder L
        [(196, 138), (158, 280), (128, 420), (118, 520)],         # kimono sleeve L
        [(118, 520), (196, 556), (262, 566), (296, 566)],         # sleeve hem L
        [(296, 566), (292, 560), (290, 556), (288, 550)],
        [(288, 550), (282, 720), (278, 900), (282, 1056)],        # body L
        [(282, 1056), (420, 1070), (548, 1070), (680, 1056)],     # hem
        [(680, 1056), (684, 900), (680, 720), (674, 550)],        # body R
        [(674, 550), (672, 556), (670, 560), (666, 566)],
        [(666, 566), (700, 566), (766, 556), (844, 520)],         # sleeve hem R
        [(844, 520), (834, 420), (804, 280), (766, 138)],         # kimono sleeve R
        [(766, 138), (732, 124), (662, 108), (606, 100)],         # shoulder R
        [(606, 100), (540, 148), (420, 148), (356, 100)],         # scoop neck
    ]
    return jitter(path_points(segs), 1.6)


def column_outline():
    segs = [
        [(362, 96), (330, 104), (300, 112), (286, 120)],
        [(286, 120), (300, 190), (308, 240), (310, 272)],         # armhole L
        [(310, 272), (300, 540), (296, 820), (300, 1112)],        # side L
        [(300, 1112), (420, 1124), (540, 1124), (660, 1112)],     # hem
        [(660, 1112), (664, 820), (660, 540), (650, 272)],        # side R
        [(650, 272), (652, 240), (660, 190), (674, 120)],         # armhole R
        [(674, 120), (660, 112), (630, 104), (598, 96)],
        [(598, 96), (540, 126), (420, 126), (362, 96)],           # boat neck
    ]
    return jitter(path_points(segs), 1.4)


def side_outline(length=1080, top=120, width=96, cx=480):
    """Side-profile of a hanging garment: narrow wavy drape."""
    hw = width / 2
    wob = lambda: random.uniform(-10, 10)
    segs = [
        [(cx - 12, top), (cx - hw * 0.9, top + 30), (cx - hw, top + 70), (cx - hw, top + 120)],
        [(cx - hw, top + 120),
         (cx - hw + wob(), top + 150 + (length - top) * 0.3),
         (cx - hw + wob(), top + 150 + (length - top) * 0.6),
         (cx - hw * 0.84, length)],
        [(cx - hw * 0.84, length), (cx, length + 14), (cx, length + 14), (cx + hw * 0.84, length)],
        [(cx + hw * 0.84, length),
         (cx + hw + wob(), top + 150 + (length - top) * 0.6),
         (cx + hw + wob(), top + 150 + (length - top) * 0.3),
         (cx + hw, top + 120)],
        [(cx + hw, top + 120), (cx + hw, top + 70), (cx + hw * 0.9, top + 30), (cx + 12, top)],
        [(cx + 12, top), (cx + 4, top - 4), (cx - 4, top - 4), (cx - 12, top)],
    ]
    return jitter(path_points(segs), 1.2)


def side_folds(length=1080, top=120, cx=480):
    f = []
    for dx in (-22, 0, 20):
        f.append([(cx + dx, top + 120), (cx + dx + random.uniform(-8, 8), top + 400),
                  (cx + dx + random.uniform(-8, 8), top + 700), (cx + dx, length - 30)])
    return f


# ---------------------------------------------------------------- prints
def texturize_print(layer, mask):
    """Make a print layer look screen-printed: slight erosion + grain."""
    a = layer.split()[3]
    a = ImageOps.autocontrast(a)
    arr = np.asarray(a).astype(np.int16)
    arr = np.clip(arr - np.random.normal(6, 16, arr.shape), 0, 255).astype(np.uint8)
    a = Image.fromarray(arr).filter(ImageFilter.GaussianBlur(0.6 * SS))
    layer.putalpha(a)
    clipped = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    clipped.paste(layer, (0, 0), mask.point(lambda v: 255 if v > 200 else 0))
    return clipped


def draw_text_block(d, cx, y, lines, fill, size=64, lh_mult=1.18, tracking=0):
    """Real typographic print lines, centred on cx (logical px)."""
    fnt = font(size * SS)
    lh = int(size * lh_mult * SS)
    for li, line in enumerate(lines):
        if tracking:
            line = (" " * tracking).join(list(line))
        bb = d.textbbox((0, 0), line, font=fnt)
        w = bb[2] - bb[0]
        d.text((cx * SS - w / 2 - bb[0], y * SS + li * lh), line, font=fnt, fill=fill)


def print_reprint(d, back):
    cobalt = (24, 60, 196, 255)
    if not back:
        d.ellipse([368 * SS, 308 * SS, 592 * SS, 532 * SS], outline=cobalt, width=9 * SS)
        d.ellipse([396 * SS, 336 * SS, 564 * SS, 504 * SS], outline=cobalt, width=3 * SS)
        draw_text_block(d, 480, 384, ["RBL®"], cobalt, size=58)
        draw_text_block(d, 480, 560, ["REPRINT 01 — AW26"], cobalt, size=22)
    else:
        draw_text_block(d, 480, 268, ["A CROWD", "WITH A", "POINT OF", "VIEW."], cobalt, size=74, lh_mult=1.12)
        # barcode strip
        x = 330
        random.seed(12)
        while x < 630:
            bw = random.choice([3, 5, 9])
            d.rectangle([x * SS, 648 * SS, (x + bw) * SS, 704 * SS], fill=cobalt)
            x += bw + random.choice([4, 6])
        draw_text_block(d, 480, 718, ["ONE RUN — NO RESTOCKS"], cobalt, size=20)


def print_static(d, back):
    bone = (236, 233, 224, 255)
    if not back:
        for i in range(9):
            x = (330 + i * 34) * SS
            h = [60, 150, 90, 210, 120, 180, 70, 160, 100][i]
            d.rectangle([x, (470 - h) * SS, x + 20 * SS, 470 * SS], fill=bone)
        draw_text_block(d, 480, 500, ["STATIC"], bone, size=42, tracking=1)
    else:
        draw_text_block(d, 480, 300, ["STATIC"], bone, size=84)
        draw_text_block(d, 480, 414, ["NOISE YOU CAN WEAR"], bone, size=22)
        random.seed(5)
        for i in range(13):
            y = (500 + i * 24) * SS
            d.rectangle([310 * SS, y, (310 + random.randint(100, 340)) * SS, y + 4 * SS], fill=bone)
        d.rectangle([290 * SS, 268 * SS, 668 * SS, 812 * SS], outline=bone, width=5 * SS)


def print_motive(d, back):
    rust = (173, 68, 36, 255)
    ink = (40, 36, 32, 255)
    if not back:
        d.pieslice([360 * SS, 310 * SS, 600 * SS, 550 * SS], 180, 360, fill=rust)
        d.rectangle([360 * SS, 446 * SS, 600 * SS, 462 * SS], fill=ink)
        draw_text_block(d, 480, 486, ["MOTIVE"], ink, size=36, tracking=1)
    else:
        d.pieslice([310 * SS, 280 * SS, 650 * SS, 620 * SS], 0, 180, fill=rust)
        d.pieslice([390 * SS, 430 * SS, 570 * SS, 610 * SS], 180, 360, fill=ink)
        d.line([310 * SS, 668 * SS, 650 * SS, 668 * SS], fill=ink, width=8 * SS)
        draw_text_block(d, 480, 692, ["MOTIVE"], rust, size=76)
        draw_text_block(d, 480, 790, ["EVERY CROWD NEEDS ONE"], ink, size=22)


def print_chorus(d, back):
    cream = (238, 231, 212, 255)
    if not back:
        draw_text_block(d, 480, 316, ["CHORUS", "CHORUS", "CHORUS"], cream, size=44, lh_mult=1.16)
    else:
        draw_text_block(d, 480, 292, ["CHORUS"] * 6, cream, size=62, lh_mult=1.14)
        d.rectangle([306 * SS, 272 * SS, 654 * SS, 742 * SS], outline=cream, width=5 * SS)


# ---------------------------------------------------------------- assembly
def finish(img, name, size=(W, H)):
    img = img.resize(size, Image.LANCZOS)
    img.save(f"{OUT}/{name}.webp", "WEBP", quality=88)
    print("saved", name)


def ribbed_collar(img, base_rgb, back=False):
    d = ImageDraw.Draw(img)
    rib = tuple(max(0, c - 42) for c in base_rgb)
    dipy = 150 if not back else 108
    d.arc([346 * SS, (66 if not back else 60) * SS, 614 * SS, (dipy + 26) * SS],
          15, 165, fill=rib + (255,), width=16 * SS)
    # inner neck shadow
    sh = Image.new("L", img.size, 0)
    ImageDraw.Draw(sh).arc([352 * SS, 70 * SS, 608 * SS, (dipy + 20) * SS], 20, 160, fill=90, width=22 * SS)
    sh = sh.filter(ImageFilter.GaussianBlur(8 * SS))
    dkc = Image.new("RGBA", img.size, tuple(max(0, c - 60) for c in base_rgb) + (255,))
    img.paste(dkc, (0, 0), Image.composite(sh, Image.new("L", img.size, 0), img.split()[3]))


def build_tee(slug, base_rgb, print_fn):
    for view in ("front", "back", "side"):
        if view == "side":
            pts = side_outline(length=1070, top=130, width=98)
            mask = make_mask(pts)
            img = shade_garment(base_rgb, mask, side_folds(1070, 130), (430, 200, 530, 980))
        else:
            back = view == "back"
            pts = tee_outline(back)
            mask = make_mask(pts)
            img = shade_garment(
                base_rgb, mask, tee_folds(), (380, 220, 580, 760),
                extra_dark=[((230, 380, 290, 480), 60), ((670, 380, 730, 480), 60)])
            ribbed_collar(img, base_rgb, back)
            pl = Image.new("RGBA", (GW, GH), (0, 0, 0, 0))
            print_fn(ImageDraw.Draw(pl), back)
            img.alpha_composite(texturize_print(pl, mask))
        finish(img, f"{slug}-{view}")


def build_drape(slug, base_rgb, outline_fn, folds_fn, length=1120, seam=None):
    for view in ("front", "back", "side"):
        if view == "side":
            pts = side_outline(length=length - 20, top=120, width=84)
            mask = make_mask(pts)
            img = shade_garment(base_rgb, mask, side_folds(length - 20, 120), (436, 200, 524, 1000))
        else:
            pts = outline_fn()
            mask = make_mask(pts)
            img = shade_garment(base_rgb, mask, folds_fn(), (400, 260, 560, 900))
            if view == "back" and seam:
                d = ImageDraw.Draw(img)
                d.line([480 * SS, seam[0] * SS, 480 * SS, seam[1] * SS],
                       fill=tuple(max(0, c - 30) for c in base_rgb) + (255,), width=3 * SS)
        finish(img, f"{slug}-{view}")


# ---------------------------------------------------------------- editorial
def grain(img, sigma=7):
    arr = np.asarray(img).astype(np.int16)
    arr = np.clip(arr + np.random.normal(0, sigma, arr.shape[:2] + (1,)), 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


def editorial_strip():
    w, h = 2400, 680
    img = Image.new("RGB", (w, h))
    top, bot = (232, 227, 216), (168, 156, 138)
    for y in range(h):
        t = y / h
        img.paste(tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)), (0, y, w, y + 1))
    d = ImageDraw.Draw(img, "RGBA")
    # diagonal studio light bands
    for i, x in enumerate(range(-400, w, 420)):
        d.polygon([(x, h), (x + 520, 0), (x + 700, 0), (x + 180, h)],
                  fill=(255, 252, 244, 26 if i % 2 else 40))
    # floor shadow figures (abstract street silhouettes)
    for cx, sw, sh2 in ((430, 130, 430), (700, 110, 380), (1480, 150, 460), (1760, 120, 400)):
        fig = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        fd = ImageDraw.Draw(fig)
        fd.ellipse([cx - sw // 2, h - sh2, cx + sw // 2, h - sh2 + 180], fill=(60, 52, 44, 90))
        fd.rectangle([cx - sw // 3, h - sh2 + 90, cx + sw // 3, h - 30], fill=(60, 52, 44, 80))
        fig = fig.filter(ImageFilter.GaussianBlur(22))
        img.paste(Image.alpha_composite(img.convert("RGBA"), fig).convert("RGB"), (0, 0))
    img = grain(img, 6)
    img.save(f"{EDI}/lifestyle-strip.webp", "WEBP", quality=85)
    print("saved lifestyle-strip")


def editorial_panel(name, top, bot, accent, dark=False):
    w, h = 980, 1240
    img = Image.new("RGB", (w, h))
    for y in range(h):
        t = y / h
        img.paste(tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)), (0, y, w, y + 1))
    d = ImageDraw.Draw(img, "RGBA")
    if dark:
        for i in range(8):
            x = 120 + i * 96
            hh = random.randint(180, 620)
            d.rectangle([x, h - 260 - hh, x + 46, h - 260], fill=accent + (210,))
        d.rectangle([90, 180, w - 90, h - 220], outline=accent + (160,), width=4)
    else:
        for i in range(5):
            cx = 160 + i * 170
            curve = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            cd = ImageDraw.Draw(curve)
            pts = [(cx + math.sin(y / 140 + i) * 34, y) for y in range(140, h - 120, 8)]
            cd.line(pts, fill=accent + (70,), width=44)
            curve = curve.filter(ImageFilter.GaussianBlur(18))
            img = Image.alpha_composite(img.convert("RGBA"), curve).convert("RGB")
            d = ImageDraw.Draw(img, "RGBA")
    img = grain(img, 5)
    img.save(f"{EDI}/{name}.webp", "WEBP", quality=85)
    print("saved", name)


def manifesto_bg():
    w, h = 2000, 1100
    img = Image.new("RGB", (w, h))
    for y in range(h):
        t = y / h
        img.paste(tuple(int(28 + 10 * t) for _ in range(3)), (0, y, w, y + 1))
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, w, 180):
        d.line([(x, 0), (x - 160, h)], fill=(255, 255, 255, 7), width=60)
    img = grain(img, 8)
    img.save(f"{EDI}/manifesto-bg.webp", "WEBP", quality=82)
    print("saved manifesto-bg")


if __name__ == "__main__":
    build_tee("reprint-tee-01", (229, 224, 211), print_reprint)   # bone
    build_tee("static-tee-02", (44, 42, 42), print_static)        # washed black
    build_tee("motive-tee-03", (223, 212, 192), print_motive)     # ecru
    build_tee("chorus-tee-04", (96, 102, 78), print_chorus)       # olive
    build_drape("drape-coord-01", (238, 232, 222), coord_outline,
                lambda: [[(360, 620), (356, 760), (352, 900), (356, 1030)],
                         [(480, 580), (478, 740), (476, 900), (480, 1040)],
                         [(600, 620), (604, 760), (608, 900), (604, 1030)],
                         [(160, 220), (176, 330), (190, 430), (200, 500)],
                         [(800, 220), (784, 330), (770, 430), (760, 500)]],
                length=1070, seam=(160, 1040))
    build_drape("sandstone-slip", (205, 178, 148), slip_outline, slip_folds,
                length=1130, seam=(240, 1100))
    build_drape("clay-column", (176, 138, 116), column_outline,
                lambda: [[(380, 300), (376, 560), (372, 820), (376, 1080)],
                         [(480, 280), (478, 560), (476, 840), (480, 1090)],
                         [(580, 300), (584, 560), (588, 820), (584, 1080)]],
                length=1120, seam=(140, 1090))
    editorial_strip()
    editorial_panel("print-lab", (36, 34, 33), (22, 21, 20), (24, 60, 196), dark=True)
    editorial_panel("boutique-edit", (242, 236, 227), (216, 200, 180), (186, 158, 128), dark=False)
    manifesto_bg()
    print("done")
