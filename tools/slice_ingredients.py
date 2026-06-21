"""
Slice the 8-ingredient art sheet into 8 transparent square PNGs.

Pipeline:
  crop label band -> white->transparent (whole sheet) -> segment items by the
  white vertical GAPS between them (not fixed columns) -> trim + center each on
  a square canvas -> resize 512.

Usage:
  python tools/slice_ingredients.py <source_image> [out_dir]
"""
import sys
from pathlib import Path
from PIL import Image

# Left-to-right order in the sheet -> output filenames (no extension).
NAMES = ["tomato", "basil", "mozzarella", "dough", "garlic", "oliveoil", "chili", "shrimp"]

WHITE_THRESHOLD = 238   # pixels with min(R,G,B) >= this become transparent
OUT_SIZE = 512          # final square size
PAD_RATIO = 0.10        # transparent margin around the trimmed art
LABEL_MARGIN = 18       # px to crop above the detected label band
FALLBACK_BAND = 0.68    # used only if no label band is detected
COL_OPAQUE_MIN = 3      # a column with fewer opaque px is considered "gap"
MIN_ITEM_W = 40         # ignore runs narrower than this (noise)
MERGE_GAP = 12          # merge item runs separated by a gap < this many px


def find_label_top(sheet: Image.Image) -> int:
    rgb = sheet.convert("RGB")
    W, H = rgb.size
    px = rgb.load()
    for y in range(int(H * 0.45), H):
        dark = sum(1 for x in range(0, W, 4) if all(c < 70 for c in px[x, y]))
        if dark > 5:
            return y
    return int(H * FALLBACK_BAND)


def whiten_to_alpha(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
                px[x, y] = (r, g, b, 0)
    return im


def segment_columns(im: Image.Image):
    """Return [(x0, x1), ...] item spans found between white vertical gaps."""
    alpha = im.getchannel("A")
    w, h = alpha.size
    ap = alpha.load()
    opaque = []
    for x in range(w):
        c = sum(1 for y in range(0, h, 2) if ap[x, y] > 20)
        opaque.append(c)

    # contiguous runs of non-gap columns
    runs = []
    start = None
    for x in range(w):
        gap = opaque[x] < COL_OPAQUE_MIN
        if not gap and start is None:
            start = x
        elif gap and start is not None:
            runs.append([start, x]); start = None
    if start is not None:
        runs.append([start, w])

    # merge runs separated by a tiny gap, then drop noise-width runs
    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] < MERGE_GAP:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return [(a, b) for a, b in merged if (b - a) >= MIN_ITEM_W]


def square_pad(im: Image.Image) -> Image.Image:
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    side = int(max(w, h) * (1 + PAD_RATIO))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    return canvas.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)


def main():
    if len(sys.argv) < 2:
        print("usage: python tools/slice_ingredients.py <source_image> [out_dir]")
        sys.exit(1)
    src = Path(sys.argv[1])
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public/images/ingredients")
    out_dir.mkdir(parents=True, exist_ok=True)

    sheet = Image.open(src).convert("RGBA")
    W, H = sheet.size
    cut = max(0, find_label_top(sheet) - LABEL_MARGIN)
    print(f"  art band: y=0..{cut} (sheet {W}x{H})")

    band = whiten_to_alpha(sheet.crop((0, 0, W, cut)))
    spans = segment_columns(band)
    print(f"  detected {len(spans)} item spans: {spans}")
    if len(spans) != len(NAMES):
        print(f"  !! expected {len(NAMES)} items, got {len(spans)} — check the sheet/thresholds")

    for i, (x0, x1) in enumerate(spans):
        if i >= len(NAMES):
            break
        tile = square_pad(band.crop((x0, 0, x1, cut)))
        dest = out_dir / f"{NAMES[i]}.png"
        tile.save(dest)
        print(f"  saved {dest}  span x={x0}..{x1}")
    print("done.")


if __name__ == "__main__":
    main()
