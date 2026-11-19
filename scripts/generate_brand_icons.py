import os
from PIL import Image, ImageDraw, ImageFilter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS_DIR = os.path.join(ROOT_DIR, "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

def create_apple_squircle_mask(size, radius):
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=255)
    return mask

def create_gradient_bg(size, color_top, color_bottom):
    base = Image.new('RGBA', (size, size))
    draw = ImageDraw.Draw(base)
    r1, g1, b1 = color_top
    r2, g2, b2 = color_bottom
    for y in range(size):
        t = y / (size - 1)
        t_smooth = t * t * (3 - 2 * t)
        r = int(r1 + (r2 - r1) * t_smooth)
        g = int(g1 + (g2 - g1) * t_smooth)
        b = int(b1 + (b2 - b1) * t_smooth)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    return base

def draw_master_brand_icon(size=1024):
    """
    Renders the official JD Extractor brand icon at 1024x1024 master resolution.
    Dual-card verified match motif:
    - Back card: Candidate Resume (translucent frosted glass)
    - Front card: Target Job Description (crisp solid white with Apple rounded corners)
    - Badge: Verified ATS Match / Instant Extraction checkmark badge
    - Canvas: Apple continuous curvature squircle with rich Cupertino royal blue gradient
    """
    img = create_gradient_bg(size, (0, 122, 255), (1, 56, 170))
    mask = create_apple_squircle_mask(size, int(size * 0.225))
    img.putalpha(mask)
    
    overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 0. Apple Glass Specular Rim Highlight (subtle inner bezel)
    draw.rounded_rectangle([2, 2, size-3, size-3], radius=int(size * 0.225), outline=(255, 255, 255, 50), width=6)
    
    # 1. Back Sheet: Candidate Resume (Frosted Glass Card)
    bx1, by1 = int(size * 0.21), int(size * 0.17)
    bx2, by2 = int(size * 0.69), int(size * 0.77)
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=int(size * 0.055), fill=(255, 255, 255, 65))
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=int(size * 0.055), outline=(255, 255, 255, 110), width=5)
    
    # Back sheet category pill
    draw.rounded_rectangle([int(size * 0.27), int(size * 0.24), int(size * 0.44), int(size * 0.285)],
                           radius=int(size * 0.016), fill=(255, 255, 255, 130))
    # Back sheet lines
    for y_pct in [0.34, 0.41, 0.48]:
        draw.rounded_rectangle([int(size * 0.27), int(size * y_pct), int(size * 0.58), int(size * (y_pct + 0.032))],
                               radius=int(size * 0.014), fill=(255, 255, 255, 85))

    # 2. Front Sheet: Target Job Posting (Pure Solid White Card)
    fx1, fy1 = int(size * 0.33), int(size * 0.23)
    fx2, fy2 = int(size * 0.81), int(size * 0.83)
    
    # Ambient drop shadow under front sheet
    shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle([fx1 - 10, fy1 + 16, fx2 + 10, fy2 + 32], radius=int(size * 0.06), fill=(0, 16, 65, 130))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=28))
    overlay = Image.alpha_composite(overlay, shadow)
    draw = ImageDraw.Draw(overlay)
    
    # Front card body
    draw.rounded_rectangle([fx1, fy1, fx2, fy2], radius=int(size * 0.055), fill=(255, 255, 255, 255))
    
    # Front card top category tag (Apple Electric Blue)
    draw.rounded_rectangle([int(size * 0.39), int(size * 0.31), int(size * 0.58), int(size * 0.365)],
                           radius=int(size * 0.018), fill=(0, 113, 227, 255))
    
    # Front card structured data lines (Slate-Blue)
    draw.rounded_rectangle([int(size * 0.39), int(size * 0.42), int(size * 0.75), int(size * 0.455)],
                           radius=int(size * 0.016), fill=(215, 224, 238, 255))
    draw.rounded_rectangle([int(size * 0.39), int(size * 0.49), int(size * 0.71), int(size * 0.525)],
                           radius=int(size * 0.016), fill=(215, 224, 238, 255))
    draw.rounded_rectangle([int(size * 0.39), int(size * 0.56), int(size * 0.63), int(size * 0.595)],
                           radius=int(size * 0.016), fill=(215, 224, 238, 255))

    # 3. Verified Match Badge (Bottom Left/Center Intersection)
    bcx, bcy = int(size * 0.38), int(size * 0.72)
    br = int(size * 0.135)
    
    # Badge shadow
    b_shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    bs_draw = ImageDraw.Draw(b_shadow)
    bs_draw.ellipse([bcx - br - 8, bcy - br + 10, bcx + br + 8, bcy + br + 24], fill=(0, 25, 80, 135))
    b_shadow = b_shadow.filter(ImageFilter.GaussianBlur(radius=20))
    overlay = Image.alpha_composite(overlay, b_shadow)
    draw = ImageDraw.Draw(overlay)
    
    # Badge base (Apple Blue #0071E3 with Crisp White Rim)
    draw.ellipse([bcx - br, bcy - br, bcx + br, bcy + br], fill=(0, 113, 227, 255), outline=(255, 255, 255, 255), width=7)
    
    # Checkmark inside badge (Razor-Sharp Anti-Aliased)
    cw = int(size * 0.026)
    p1 = (bcx - int(br * 0.42), bcy - int(br * 0.02))
    p2 = (bcx - int(br * 0.08), bcy + int(br * 0.36))
    p3 = (bcx + int(br * 0.44), bcy - int(br * 0.34))
    draw.line([p1, p2], fill=(255, 255, 255, 255), width=cw)
    draw.line([p2, p3], fill=(255, 255, 255, 255), width=cw)
    
    final_master = Image.alpha_composite(img, overlay)
    return final_master

def generate_all_icons():
    print("Generating master 1024x1024 icon...")
    master = draw_master_brand_icon(1024)
    
    # Save master
    master_path = os.path.join(ICONS_DIR, "icon1024.png")
    master.save(master_path, "PNG")
    print(f"Saved {master_path}")
    
    # Downsample with Lanczos filter for exceptional clarity
    sizes = [128, 48, 32, 16]
    for s in sizes:
        resized = master.resize((s, s), Image.Resampling.LANCZOS)
        out_file = os.path.join(ICONS_DIR, f"icon{s}.png")
        resized.save(out_file, "PNG")
        print(f"Saved {out_file} ({s}x{s})")
        
    # Also save favicon.png
    favicon_path = os.path.join(ICONS_DIR, "favicon.png")
    master.resize((32, 32), Image.Resampling.LANCZOS).save(favicon_path, "PNG")
    print(f"Saved {favicon_path}")
    
    print("All icon assets generated successfully!")

if __name__ == "__main__":
    generate_all_icons()
