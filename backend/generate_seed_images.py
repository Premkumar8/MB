import os
import subprocess
import sys

# Ensure pillow is installed
try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    print("Pillow not found. Installing pillow dynamically...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image, ImageDraw, ImageFilter

def create_directory_structure():
    dirs = [
        "static/seed",
        "static/seed/textures",
        "static/uploads"
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        print(f"Created directory: {d}")

def generate_carrara_gold():
    # White base with gray & gold veins
    img = Image.new("RGB", (800, 800), "#f7f7f7")
    draw = ImageDraw.Draw(img)
    # Veins
    draw.line([(50, 100), (300, 400), (450, 500), (750, 700)], fill="#d4af37", width=3) # Gold
    draw.line([(200, 50), (400, 300), (500, 600), (600, 750)], fill="#8e8e8e", width=2) # Gray
    draw.line([(50, 600), (200, 650), (400, 750)], fill="#c0c0c0", width=1) # Thin gray
    draw.line([(600, 100), (550, 200), (700, 400)], fill="#d4af37", width=1) # Thin gold
    
    # Smooth a bit
    img = img.filter(ImageFilter.GaussianBlur(1))
    img.save("static/seed/carrara_gold.jpg", "JPEG")
    img.save("static/seed/textures/carrara_gold_diff.jpg", "JPEG")
    print("Generated Carrara Gold texture.")

def generate_nero_marquina():
    # Deep black with sharp white veins
    img = Image.new("RGB", (800, 800), "#0f0f11")
    draw = ImageDraw.Draw(img)
    
    # Sharp white calcite veins
    draw.line([(100, 50), (150, 200), (400, 500), (700, 780)], fill="#ffffff", width=2)
    draw.line([(50, 300), (250, 400), (350, 550), (500, 650)], fill="#e0e0e0", width=1)
    draw.line([(600, 50), (450, 300), (550, 600)], fill="#ffffff", width=2)
    
    img = img.filter(ImageFilter.GaussianBlur(0.8))
    img.save("static/seed/nero_marquina.jpg", "JPEG")
    img.save("static/seed/textures/nero_marquina_diff.jpg", "JPEG")
    print("Generated Nero Marquina texture.")

def generate_emerald_onyx():
    # Translucent green bands
    img = Image.new("RGB", (800, 800), "#133527") # Deep green
    draw = ImageDraw.Draw(img)
    
    # Concentric or wavy jade, gold, mint bands
    for r in range(100, 800, 60):
        # Draw soft concentric rings
        draw.ellipse([400-r, 400-r, 400+r, 400+r], outline="#4a7c59", width=12)
        draw.ellipse([400-r-20, 400-r-20, 400+r+20, 400+r+20], outline="#d4af37", width=2) # Gold accent ring
        draw.ellipse([400-r-40, 400-r-40, 400+r+40, 400+r+40], outline="#2e5a44", width=8)

    img = img.filter(ImageFilter.GaussianBlur(8)) # Heavy blur for glowing translucent onyx effect
    img.save("static/seed/emerald_onyx.jpg", "JPEG")
    img.save("static/seed/textures/emerald_onyx_diff.jpg", "JPEG")
    print("Generated Emerald Onyx texture.")

def generate_calacatta_viola():
    # Cream base with bold purple/burgundy veining
    img = Image.new("RGB", (800, 800), "#f4f1ea") # Creamy white
    draw = ImageDraw.Draw(img)
    
    # Thick dramatic purple veins
    draw.line([(0, 200), (300, 350), (400, 600), (800, 700)], fill="#4a1525", width=12)
    draw.line([(200, 0), (250, 100), (100, 300), (300, 600), (700, 800)], fill="#3c101e", width=8)
    draw.line([(500, 0), (600, 200), (450, 500), (600, 800)], fill="#5c1a30", width=4)
    
    img = img.filter(ImageFilter.GaussianBlur(1.5))
    img.save("static/seed/calacatta_viola.jpg", "JPEG")
    img.save("static/seed/textures/calacatta_viola_diff.jpg", "JPEG")
    print("Generated Calacatta Viola texture.")

def generate_taj_mahal():
    # Soft cream/beige base with faint warm gold veins
    img = Image.new("RGB", (800, 800), "#e8e5dc") # Warm cream
    draw = ImageDraw.Draw(img)
    
    # Soft faint gold/tan veins
    draw.line([(0, 100), (200, 250), (500, 400), (800, 650)], fill="#caba9c", width=5)
    draw.line([(100, 0), (300, 200), (400, 500), (600, 800)], fill="#bcae8d", width=3)
    
    img = img.filter(ImageFilter.GaussianBlur(3)) # Soft quartzite blur
    img.save("static/seed/taj_mahal.jpg", "JPEG")
    img.save("static/seed/textures/taj_mahal_diff.jpg", "JPEG")
    print("Generated Taj Mahal texture.")

def generate_blog_images():
    # Blog 1: Onyx lighting
    img = Image.new("RGB", (800, 500), "#1c2e24")
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 750, 450], outline="#d4af37", width=2)
    # Draw glow light center
    for r in range(50, 200, 10):
        draw.ellipse([400-r, 250-r, 400+r, 250+r], outline="#4a7c59", width=2)
    img.save("static/seed/blog1.jpg", "JPEG")
    
    # Blog 2: Marble care
    img = Image.new("RGB", (800, 500), "#2a2a2a")
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 750, 450], outline="#c0c0c0", width=2)
    img.save("static/seed/blog2.jpg", "JPEG")
    print("Generated blog images.")

def generate_user_avatars():
    # User 1
    img = Image.new("RGB", (150, 150), "#d4af37")
    draw = ImageDraw.Draw(img)
    draw.ellipse([30, 30, 120, 120], fill="#ffffff")
    img.save("static/seed/user1.jpg", "JPEG")
    
    # User 2
    img = Image.new("RGB", (150, 150), "#0f0f11")
    draw = ImageDraw.Draw(img)
    draw.ellipse([30, 30, 120, 120], fill="#d4af37")
    img.save("static/seed/user2.jpg", "JPEG")
    print("Generated user avatars.")

def generate_mock_glb():
    # Writes a minimal valid-enough-for-loader empty binary block
    # In our frontend Three.js viewer, we'll implement a robust fallback logic so that
    # if a GLB model is empty or mock, we dynamically construct a beautiful rotating 3D slab
    # using Three.js built-in BoxGeometry/PlaneGeometry and map the PBR texture.
    # This prevents WebGL loading crashes and creates a stellar, fast-rendering 3D slab!
    glb_content = b"glTF\x02\x00\x00\x00\x00\x00\x00\x00"
    for name in ["carrara_gold", "nero_marquina", "emerald_onyx", "calacatta_viola", "taj_mahal"]:
        with open(f"static/seed/{name}.glb", "wb") as f:
            f.write(glb_content)
    print("Generated mock 3D GLB slab placeholders.")

if __name__ == "__main__":
    create_directory_structure()
    generate_carrara_gold()
    generate_nero_marquina()
    generate_emerald_onyx()
    generate_calacatta_viola()
    generate_taj_mahal()
    generate_blog_images()
    generate_user_avatars()
    generate_mock_glb()
    print("All static assets created successfully!")
