import os
import sqlite3
import shutil
import sys
import subprocess
import json

# Ensure pillow is installed
try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    print("Pillow not found. Installing pillow dynamically...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image, ImageDraw, ImageFilter

from generate_room_galleries import generate_all as generate_rooms

def get_db_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "aurelia_marmi.db")

def clean_database():
    db_path = get_db_path()
    print(f"Connecting to database at {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 1. Identify and delete irrelevant products (Tiles, Bathware, and Onyx)
    cursor.execute("SELECT id, name, category FROM products")
    products = cursor.fetchall()
    
    irrelevant_ids = []
    print("Checking product relevance:")
    for pid, name, category in products:
        name_l = (name or "").lower()
        cat_l = (category or "").lower()
        if (cat_l in ["tiles", "bathware", "onyx"] or 
            "somany" in name_l or 
            "elita" in name_l or 
            "onyx" in name_l or 
            "onyx" in cat_l):
            print(f" -> IRRELEVANT / ONYX: ID {pid} - '{name}' (Category: {category})")
            irrelevant_ids.append(pid)
        else:
            print(f" -> RELEVANT: ID {pid} - '{name}' (Category: {category})")

    if irrelevant_ids:
        placeholders = ",".join("?" for _ in irrelevant_ids)
        cursor.execute(f"DELETE FROM products WHERE id IN ({placeholders})", irrelevant_ids)
        conn.commit()
        print(f"Successfully deleted {len(irrelevant_ids)} irrelevant/onyx products from database.")
    else:
        print("No irrelevant/onyx products found in database.")

    # 2. Update product images for Hall, Kitchen, Bedroom, Parking
    room_galleries = {
        "Carrara Gold": [
            "/static/real/hero-marble-hall.jpg",
            "/static/real/kitchen-white-marble-island.jpg",
            "/static/real/project-residential-bedroom.jpg",
            "/static/rooms/white-marble/parking.jpg"
        ],
        "Nero Marquina": [
            "/static/real/hero-office-lobby.jpg",
            "/static/nh/granite-kitchen-black.jpg",
            "/static/real/bedroom-minimal-modern.jpg",
            "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
        ],
        "Calacatta Viola": [
            "/static/rooms/viola-pink/hall.jpg",
            "/static/rooms/viola-pink/kitchen.jpg",
            "/static/rooms/viola-pink/bedroom.jpg",
            "/static/rooms/viola-pink/parking.jpg"
        ],
        "Taj Mahal": [
            "/static/real/hallway-travertine-arched.jpg",
            "/static/real/quartz-countertop-island.jpg",
            "/static/rooms/taj-mahal-gold/bedroom.jpg",
            "/static/real/quartzite-speckled-courtyard-floor.jpg"
        ],
        "Statuario Marble": [
            "/static/real/marble-imported-curtain-hall.jpg",
            "/static/real/marble-imported-statuario-kitchen.jpg",
            "/static/real/project-residential-bedroom.jpg",
            "/static/rooms/white-marble/parking.jpg"
        ],
        "Flawless White": [
            "/static/real/hero-marble-hall.jpg",
            "/static/real/kitchen-white-marble-island.jpg",
            "/static/real/project-residential-bedroom.jpg",
            "/static/rooms/white-marble/parking.jpg"
        ],
        "Beige Marble": [
            "/static/real/hallway-travertine-arched.jpg",
            "/static/nh/stone-living-kitchen.jpg",
            "/static/nh/stone-bedroom-living.jpg",
            "/static/rooms/beige-marble/parking.jpg"
        ],
        "Grey Granite": [
            "/static/nh/gray-marble-hall.jpg",
            "/static/nh/gray-marble-kitchen.jpg",
            "/static/nh/gray-marble-bedroom.jpg",
            "/static/nh/gray-marble-parking.jpg"
        ]
    }

    for name, imgs in room_galleries.items():
        cursor.execute("UPDATE products SET images = ? WHERE name = ?", (json.dumps(imgs), name))
    conn.commit()

    conn.close()

def generate_missing_images():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_dir = os.path.dirname(base_dir)
    
    # Destination directories
    backend_seed_dir = os.path.join(base_dir, "static", "seed")
    frontend_seed_dir = os.path.join(workspace_dir, "frontend", "public", "static", "seed")
    
    os.makedirs(backend_seed_dir, exist_ok=True)
    os.makedirs(frontend_seed_dir, exist_ok=True)

    # Generate Statuario Marble
    print("Generating Statuario Marble texture...")
    statuario_img = Image.new("RGB", (800, 800), "#fcfcfc")
    draw = ImageDraw.Draw(statuario_img)
    draw.line([(50, 0), (120, 180), (300, 400), (350, 520), (550, 700), (600, 800)], fill="#5c5c5c", width=6)
    draw.line([(600, 0), (500, 200), (300, 400), (150, 600), (50, 800)], fill="#7a7a7a", width=3)
    draw.line([(0, 300), (150, 350), (250, 500), (400, 550)], fill="#9c9c9c", width=2)
    draw.line([(500, 500), (650, 600), (800, 750)], fill="#7a7a7a", width=4)
    statuario_img = statuario_img.filter(ImageFilter.GaussianBlur(2.0))
    statuario_img.save(os.path.join(backend_seed_dir, "statuario.jpg"), "JPEG", quality=95)
    statuario_img.save(os.path.join(frontend_seed_dir, "statuario.jpg"), "JPEG", quality=95)

    # Generate Flawless White
    print("Generating Flawless White texture...")
    flawless_img = Image.new("RGB", (800, 800), "#ffffff")
    draw = ImageDraw.Draw(flawless_img)
    draw.line([(0, 100), (400, 450), (800, 600)], fill="#fafafa", width=80)
    draw.line([(100, 0), (300, 500), (600, 800)], fill="#f7f7f7", width=40)
    flawless_img = flawless_img.filter(ImageFilter.GaussianBlur(10.0))
    flawless_img.save(os.path.join(backend_seed_dir, "flawless_white.jpg"), "JPEG", quality=95)
    flawless_img.save(os.path.join(frontend_seed_dir, "flawless_white.jpg"), "JPEG", quality=95)

    # Generate Beige Marble
    print("Generating Beige Marble texture...")
    beige_img = Image.new("RGB", (800, 800), "#e5ddc8")
    draw = ImageDraw.Draw(beige_img)
    draw.line([(100, 0), (250, 300), (450, 500), (800, 750)], fill="#bba27d", width=4)
    draw.line([(0, 400), (300, 480), (550, 680), (700, 800)], fill="#c8b79b", width=3)
    draw.line([(400, 0), (350, 150), (500, 350), (450, 500)], fill="#d6c5af", width=2)
    beige_img = beige_img.filter(ImageFilter.GaussianBlur(2.5))
    beige_img.save(os.path.join(backend_seed_dir, "beige_marble.jpg"), "JPEG", quality=95)
    beige_img.save(os.path.join(frontend_seed_dir, "beige_marble.jpg"), "JPEG", quality=95)

    # Generate Grey Granite
    print("Generating Grey Granite texture...")
    grey_img = Image.new("RGB", (800, 800), "#6a6a6a")
    draw = ImageDraw.Draw(grey_img)
    import random
    random.seed(42)
    for _ in range(30000):
        x = random.randint(0, 799)
        y = random.randint(0, 799)
        color = random.choice(["#3a3a3a", "#4e4e4e", "#8a8a8a", "#a2a2a2", "#e8e8e8"])
        radius = random.choice([1, 2, 3])
        draw.ellipse([x-radius, y-radius, x+radius, y+radius], fill=color)
    grey_img = grey_img.filter(ImageFilter.GaussianBlur(0.8))
    grey_img.save(os.path.join(backend_seed_dir, "grey_granite.jpg"), "JPEG", quality=95)
    grey_img.save(os.path.join(frontend_seed_dir, "grey_granite.jpg"), "JPEG", quality=95)

    # Generate complete room galleries for Hall, Kitchen, Bedroom, Parking
    print("Generating complete room galleries for Hall, Kitchen, Bedroom, Parking...")
    generate_rooms()

if __name__ == "__main__":
    clean_database()
    generate_missing_images()
    print("All Onyx removal, relevance check, and room image generation tasks completed successfully!")
