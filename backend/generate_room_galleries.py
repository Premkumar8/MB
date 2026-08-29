import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

def create_room_image(theme, room_type, output_path, width=1200, height=800):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img = Image.new("RGB", (width, height), "#1a1a1a")
    draw = ImageDraw.Draw(img)

    # Color palettes & floor styling based on theme
    palettes = {
        "white-marble": {
            "floor_base": (245, 245, 248),
            "floor_vein": (160, 165, 175),
            "wall_color": (235, 235, 238),
            "accent": (212, 175, 55),
            "ceiling": (250, 250, 252),
            "dark": (40, 40, 45)
        },
        "black-stone": {
            "floor_base": (25, 25, 28),
            "floor_vein": (200, 205, 215),
            "wall_color": (45, 45, 50),
            "accent": (212, 175, 55),
            "ceiling": (35, 35, 38),
            "dark": (15, 15, 18)
        },
        "beige-marble": {
            "floor_base": (228, 218, 198),
            "floor_vein": (180, 160, 130),
            "wall_color": (238, 232, 220),
            "accent": (190, 140, 70),
            "ceiling": (248, 245, 238),
            "dark": (55, 45, 35)
        },
        "grey-stone": {
            "floor_base": (120, 125, 132),
            "floor_vein": (80, 85, 92),
            "wall_color": (210, 212, 216),
            "accent": (50, 50, 55),
            "ceiling": (235, 236, 240),
            "dark": (35, 38, 42)
        },
        "viola-pink": {
            "floor_base": (240, 235, 238),
            "floor_vein": (110, 35, 60),
            "wall_color": (245, 240, 242),
            "accent": (140, 45, 75),
            "ceiling": (250, 248, 250),
            "dark": (45, 25, 35)
        },
        "taj-mahal-gold": {
            "floor_base": (235, 226, 208),
            "floor_vein": (195, 160, 100),
            "wall_color": (242, 238, 228),
            "accent": (218, 165, 32),
            "ceiling": (250, 248, 242),
            "dark": (50, 42, 30)
        },
        "kota-green": {
            "floor_base": (115, 138, 120),
            "floor_vein": (75, 95, 80),
            "wall_color": (225, 230, 226),
            "accent": (60, 85, 68),
            "ceiling": (242, 246, 243),
            "dark": (30, 42, 34)
        },
        "wood-look": {
            "floor_base": (168, 122, 78),
            "floor_vein": (120, 80, 45),
            "wall_color": (240, 236, 228),
            "accent": (140, 95, 55),
            "ceiling": (248, 246, 242),
            "dark": (50, 35, 20)
        },
        "pvt-gloss": {
            "floor_base": (248, 248, 250),
            "floor_vein": (205, 210, 220),
            "wall_color": (230, 232, 236),
            "accent": (0, 120, 215),
            "ceiling": (252, 252, 254),
            "dark": (30, 35, 45)
        },
        "decorative": {
            "floor_base": (230, 228, 225),
            "floor_vein": (70, 90, 130),
            "wall_color": (242, 240, 238),
            "accent": (45, 90, 160),
            "ceiling": (250, 250, 250),
            "dark": (35, 45, 65)
        }
    }

    pal = palettes.get(theme, palettes["white-marble"])

    if room_type == "hall":
        # Luxury Living Hall
        # 1. Ceiling (top 220px)
        for y in range(220):
            factor = y / 220.0
            r = int(pal["ceiling"][0] * (1 - 0.1 * factor))
            g = int(pal["ceiling"][1] * (1 - 0.1 * factor))
            b = int(pal["ceiling"][2] * (1 - 0.1 * factor))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # 2. Back Wall (220 to 450)
        for y in range(220, 450):
            factor = (y - 220) / 230.0
            r = int(pal["wall_color"][0] * (0.95 - 0.1 * factor))
            g = int(pal["wall_color"][1] * (0.95 - 0.1 * factor))
            b = int(pal["wall_color"][2] * (0.95 - 0.1 * factor))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Large Floor to Ceiling Window in background (center-right)
        draw.rectangle([550, 100, 1050, 450], fill=(200, 220, 245))
        # Window view - soft gradient & subtle landscape/garden silhouette
        for y in range(100, 450):
            ratio = (y - 100) / 350.0
            draw.line([(550, y), (1050, y)], fill=(int(180 + 30*ratio), int(210 + 25*ratio), int(245 - 20*ratio)))
        # Window mullions
        draw.line([(800, 100), (800, 450)], fill=(40, 40, 45), width=6)
        draw.line([(550, 260), (1050, 260)], fill=(40, 40, 45), width=4)
        draw.rectangle([546, 96, 1054, 454], outline=(40, 40, 45), width=8)

        # 3. Floor Perspective (450 to 800)
        for y in range(450, height):
            depth = (y - 450) / 350.0
            r = int(pal["floor_base"][0] * (0.85 + 0.15 * depth))
            g = int(pal["floor_base"][1] * (0.85 + 0.15 * depth))
            b = int(pal["floor_base"][2] * (0.85 + 0.15 * depth))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Floor grid lines with perspective
        for x_line in range(-400, 1600, 160):
            draw.line([(600 + (x_line - 600)*0.2, 450), (x_line, height)], fill=pal["floor_vein"], width=2)
        for y_t in [480, 525, 590, 680]:
            draw.line([(0, y_t), (width, y_t)], fill=pal["floor_vein"], width=2)

        # Vein texture / pattern on floor
        random.seed(hash(theme + room_type) % 10000)
        for _ in range(8):
            start_x = random.randint(50, width - 50)
            start_y = random.randint(460, 550)
            end_x = start_x + random.randint(-150, 150)
            end_y = random.randint(650, 790)
            mid_x = (start_x + end_x) // 2 + random.randint(-40, 40)
            draw.line([(start_x, start_y), (mid_x, (start_y + end_y)//2), (end_x, end_y)], fill=pal["floor_vein"], width=random.randint(2, 5))

        # Modern Sofa & Coffee table in hall
        # Sofa left side
        draw.polygon([(80, 500), (380, 490), (430, 640), (60, 660)], fill=(70, 72, 78)) # Sofa base
        draw.polygon([(60, 430), (360, 420), (380, 490), (80, 500)], fill=(90, 92, 98)) # Sofa backrest
        draw.polygon([(50, 480), (120, 470), (110, 660), (40, 650)], fill=(80, 82, 88)) # Armrest
        # Designer Marble Coffee Table in center
        table_top_color = pal["floor_base"]
        draw.polygon([(320, 600), (580, 590), (620, 670), (340, 680)], fill=table_top_color)
        draw.polygon([(320, 600), (580, 590), (620, 670), (340, 680)], outline=pal["accent"], width=3)
        draw.line([(340, 680), (340, 720)], fill=(40, 40, 40), width=5)
        draw.line([(620, 670), (620, 710)], fill=(40, 40, 40), width=5)
        draw.line([(320, 600), (320, 630)], fill=(40, 40, 40), width=4)

        # Ceiling Chandelier / Recessed lights
        draw.line([(600, 0), (600, 120)], fill=(180, 160, 100), width=3)
        draw.ellipse([540, 110, 660, 150], outline=pal["accent"], fill=(255, 250, 220), width=4)

    elif room_type == "kitchen":
        # Luxury Kitchen with Island Counter
        # 1. Ceiling
        draw.rectangle([0, 0, width, 180], fill=pal["ceiling"])
        # Recessed spotlights
        for spot_x in [200, 450, 700, 950]:
            draw.ellipse([spot_x - 15, 70, spot_x + 15, 80], fill=(255, 248, 220))
            draw.ellipse([spot_x - 30, 60, spot_x + 30, 90], outline=(220, 210, 180), width=2)

        # 2. Back wall & cabinets (180 to 420)
        draw.rectangle([0, 180, width, 420], fill=pal["wall_color"])
        # Upper wall cabinets
        draw.rectangle([60, 180, 1140, 290], fill=(50, 52, 58))
        for cab_x in range(60, 1140, 180):
            draw.line([(cab_x, 180), (cab_x, 290)], fill=(35, 36, 40), width=3)
            # Under-cabinet LED light strip
            draw.line([(cab_x + 5, 288), (cab_x + 175, 288)], fill=(255, 245, 210), width=2)

        # Backsplash using product material
        draw.rectangle([60, 290, 1140, 390], fill=pal["floor_base"])
        # Veining on backsplash
        random.seed(hash(theme + "splash") % 10000)
        for _ in range(5):
            vx1 = random.randint(80, 1100)
            vx2 = vx1 + random.randint(-80, 80)
            draw.line([(vx1, 290), (vx2, 390)], fill=pal["floor_vein"], width=3)

        # Back base countertop & appliances
        draw.rectangle([60, 390, 1140, 410], fill=pal["dark"])
        # Chimney hood in center
        draw.polygon([(540, 210), (660, 210), (690, 290), (510, 290)], fill=(120, 125, 130))

        # 3. Floor
        for y in range(410, height):
            depth = (y - 410) / 390.0
            r = int(pal["floor_base"][0] * (0.9 + 0.1 * depth))
            g = int(pal["floor_base"][1] * (0.9 + 0.1 * depth))
            b = int(pal["floor_base"][2] * (0.9 + 0.1 * depth))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Floor tiling
        for x_line in range(-200, 1400, 200):
            draw.line([(600 + (x_line - 600)*0.3, 410), (x_line, height)], fill=pal["floor_vein"], width=2)
        for y_t in [470, 550, 660]:
            draw.line([(0, y_t), (width, y_t)], fill=pal["floor_vein"], width=2)

        # 4. Large Kitchen Waterfall Island in Center/Foreground
        # Island Top
        island_top = [(220, 520), (980, 520), (1060, 620), (140, 620)]
        draw.polygon(island_top, fill=pal["floor_base"])
        draw.polygon(island_top, outline=pal["floor_vein"], width=3)
        # Island Front
        island_front = [(140, 620), (1060, 620), (1060, 770), (140, 770)]
        draw.polygon(island_front, fill=(45, 48, 54))
        # Left Waterfall Side
        draw.polygon([(140, 620), (220, 520), (220, 670), (140, 770)], fill=pal["floor_base"])
        # Right Waterfall Side
        draw.polygon([(980, 520), (1060, 620), (1060, 770), (980, 670)], fill=pal["floor_base"])
        # Veins on Island Top & Waterfall
        random.seed(hash(theme + "island") % 10000)
        for _ in range(6):
            draw.line([(random.randint(180, 950), 530), (random.randint(180, 950), 610)], fill=pal["floor_vein"], width=3)
            draw.line([(150, random.randint(630, 750)), (210, random.randint(530, 650))], fill=pal["floor_vein"], width=2)

        # Bar stools in front of island
        for stool_x in [350, 600, 850]:
            draw.ellipse([stool_x - 35, 610, stool_x + 35, 635], fill=(30, 30, 35))
            draw.line([(stool_x, 635), (stool_x, 780)], fill=(180, 160, 100), width=4)
            draw.line([(stool_x - 30, 780), (stool_x + 30, 780)], fill=(180, 160, 100), width=4)

        # Pendant lights above island
        for pen_x in [420, 600, 780]:
            draw.line([(pen_x, 0), (pen_x, 320)], fill=(30, 30, 30), width=2)
            draw.polygon([(pen_x - 25, 350), (pen_x + 25, 350), (pen_x, 320)], fill=pal["accent"])
            draw.ellipse([pen_x - 25, 345, pen_x + 25, 355], fill=(255, 250, 200))

    elif room_type == "bedroom":
        # Master Luxury Bedroom
        # 1. Ceiling & Ambient lighting
        draw.rectangle([0, 0, width, 200], fill=pal["ceiling"])
        # 2. Headboard Accent Wall (200 to 460)
        draw.rectangle([0, 200, width, 460], fill=pal["wall_color"])
        # Fluted / panelled headboard wall in center
        draw.rectangle([250, 200, 950, 460], fill=(55, 58, 65))
        for pane_x in range(250, 950, 35):
            draw.line([(pane_x, 200), (pane_x, 460)], fill=(40, 42, 48), width=2)
        # Warm LED backlighting behind bed panel
        draw.line([(248, 200), (248, 460)], fill=(255, 220, 140), width=4)
        draw.line([(952, 200), (952, 460)], fill=(255, 220, 140), width=4)

        # 3. Floor
        for y in range(460, height):
            depth = (y - 460) / 340.0
            r = int(pal["floor_base"][0] * (0.88 + 0.12 * depth))
            g = int(pal["floor_base"][1] * (0.88 + 0.12 * depth))
            b = int(pal["floor_base"][2] * (0.88 + 0.12 * depth))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Floor grid with perspective
        for x_line in range(-300, 1500, 180):
            draw.line([(600 + (x_line - 600)*0.25, 460), (x_line, height)], fill=pal["floor_vein"], width=2)
        for y_t in [500, 560, 650, 760]:
            draw.line([(0, y_t), (width, y_t)], fill=pal["floor_vein"], width=2)

        # Floor veining
        random.seed(hash(theme + "bed") % 10000)
        for _ in range(7):
            draw.line([(random.randint(50, width-50), random.randint(480, 560)), (random.randint(50, width-50), random.randint(620, 790))], fill=pal["floor_vein"], width=3)

        # 4. King Size Bed & Nightstands
        # Nightstand Left
        draw.rectangle([130, 420, 240, 520], fill=(45, 48, 52))
        draw.rectangle([130, 420, 240, 520], outline=pal["accent"], width=2)
        # Lamp Left
        draw.polygon([(165, 360), (205, 360), (220, 400), (150, 400)], fill=(255, 245, 210))
        draw.line([(185, 400), (185, 420)], fill=(30, 30, 30), width=3)

        # Nightstand Right
        draw.rectangle([960, 420, 1070, 520], fill=(45, 48, 52))
        draw.rectangle([960, 420, 1070, 520], outline=pal["accent"], width=2)
        # Lamp Right
        draw.polygon([(995, 360), (1035, 360), (1050, 400), (980, 400)], fill=(255, 245, 210))
        draw.line([(1015, 400), (1015, 420)], fill=(30, 30, 30), width=3)

        # King Bed in Center
        # Headboard
        draw.rectangle([280, 320, 920, 470], fill=(70, 74, 82))
        # Pillows
        draw.rectangle([320, 430, 560, 490], fill=(230, 230, 235))
        draw.rectangle([640, 430, 880, 490], fill=(230, 230, 235))
        # Mattress / Duvet in perspective
        draw.polygon([(280, 470), (920, 470), (970, 680), (230, 680)], fill=(245, 245, 248))
        draw.polygon([(230, 680), (970, 680), (970, 730), (230, 730)], fill=(220, 220, 225))
        # Throw blanket at foot of bed
        draw.polygon([(230, 630), (970, 630), (970, 690), (230, 690)], fill=pal["accent"])

    elif room_type == "parking":
        # Luxury Villa Covered Carport / Parking Driveway
        # 1. Sky / Ceiling Canopy
        for y in range(250):
            ratio = y / 250.0
            draw.line([(0, y), (width, y)], fill=(int(170 - 40*ratio), int(190 - 30*ratio), int(215 - 20*ratio)))

        # Modern Pergola / Carport Roof Structure
        draw.rectangle([0, 80, width, 140], fill=(40, 42, 46))
        for beam_x in range(40, width, 90):
            draw.line([(beam_x, 80), (beam_x + 40, 140)], fill=(65, 68, 74), width=6)
        # Structural pillars
        draw.rectangle([80, 140, 130, 480], fill=(80, 85, 92))
        draw.rectangle([1070, 140, 1120, 480], fill=(80, 85, 92))

        # Architectural Feature Wall / Landscaping in background (140 to 450)
        draw.rectangle([130, 140, 1070, 450], fill=pal["wall_color"])
        # Cladding panels on parking wall
        for cy in range(160, 450, 50):
            draw.line([(130, cy), (1070, cy)], fill=(160, 160, 165), width=2)
        for cx in range(130, 1070, 120):
            draw.line([(cx, 140), (cx, 450)], fill=(160, 160, 165), width=1)

        # Planter Box with green shrubs
        draw.rectangle([130, 400, 380, 470], fill=(60, 62, 68))
        draw.ellipse([140, 340, 240, 410], fill=(45, 95, 55))
        draw.ellipse([220, 330, 320, 410], fill=(35, 85, 45))
        draw.ellipse([290, 350, 370, 410], fill=(50, 105, 60))

        # 3. Parking Floor / Paver Stones (450 to 800)
        for y in range(450, height):
            depth = (y - 450) / 350.0
            r = int(pal["floor_base"][0] * (0.80 + 0.20 * depth))
            g = int(pal["floor_base"][1] * (0.80 + 0.20 * depth))
            b = int(pal["floor_base"][2] * (0.80 + 0.20 * depth))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Heavy Duty Cobblestone / Paver Tile Grid
        for x_line in range(-400, 1600, 120):
            draw.line([(600 + (x_line - 600)*0.25, 450), (x_line, height)], fill=pal["floor_vein"], width=3)
        for y_t in [475, 510, 555, 615, 690, 780]:
            draw.line([(0, y_t), (width, y_t)], fill=pal["floor_vein"], width=3)

        # Paver stone textured speckles
        random.seed(hash(theme + "park") % 10000)
        for _ in range(2500):
            px = random.randint(0, width - 1)
            py = random.randint(450, height - 1)
            pcol = pal["floor_vein"] if random.random() > 0.5 else pal["dark"]
            draw.point((px, py), fill=pcol)

        # Parking space guide lines (white / gold thermo markings)
        draw.line([(450, 470), (280, height)], fill=(255, 255, 255), width=6)
        draw.line([(750, 470), (920, height)], fill=(255, 255, 255), width=6)

        # Luxury Sports Car Silhouette / Rear outline in parking bay
        car_color = (25, 28, 32)
        # Car body
        draw.polygon([(460, 620), (520, 520), (680, 520), (740, 620), (750, 680), (450, 680)], fill=car_color)
        # Car rear windshield
        draw.polygon([(525, 525), (675, 525), (715, 595), (485, 595)], fill=(15, 20, 25))
        # Car taillights
        draw.rectangle([460, 625, 530, 640], fill=(230, 30, 30))
        draw.rectangle([670, 625, 740, 640], fill=(230, 30, 30))
        draw.line([(530, 632), (670, 632)], fill=(220, 20, 20), width=3)
        # License plate
        draw.rectangle([565, 645, 635, 665], fill=(240, 240, 240))
        # Wheels
        draw.polygon([(440, 650), (470, 650), (470, 710), (430, 710)], fill=(10, 10, 10))
        draw.polygon([(730, 650), (760, 650), (770, 710), (730, 710)], fill=(10, 10, 10))

    # Apply subtle realistic post-processing
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(output_path, "JPEG", quality=94)
    print(f"Generated: {output_path}")

def generate_all():
    themes = [
        "white-marble",
        "black-stone",
        "beige-marble",
        "grey-stone",
        "viola-pink",
        "taj-mahal-gold",
        "kota-green",
        "wood-look",
        "pvt-gloss",
        "decorative"
    ]
    rooms = ["hall", "kitchen", "bedroom", "parking"]

    frontend_base = "frontend/public/static/rooms"
    backend_base = "backend/static/rooms"

    for t in themes:
        for r in rooms:
            f_path = os.path.join(frontend_base, t, f"{r}.jpg")
            b_path = os.path.join(backend_base, t, f"{r}.jpg")
            create_room_image(t, r, f_path)
            # Copy to backend
            os.makedirs(os.path.dirname(b_path), exist_ok=True)
            import shutil
            shutil.copy2(f_path, b_path)

if __name__ == "__main__":
    generate_all()
