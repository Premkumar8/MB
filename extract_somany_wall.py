import json
import os
import urllib.request
from bs4 import BeautifulSoup

content_path = r'C:\Users\karthiksuresh\.gemini\antigravity-ide\brain\d26142fe-d56d-42af-ae6b-6d7d081d9367\.system_generated\steps\659\content.md'
out_dir = r'd:\MB\frontend\public\static\somany'

os.makedirs(out_dir, exist_ok=True)

with open(content_path, 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
div = soup.find('div', id='app')
if not div or not div.get('data-page'):
    print("No data found")
    exit(1)

data = json.loads(div['data-page'])
products = data.get('props', {}).get('products', [])

# take first 4 products
extracted = []
current_id = 300 # start ID to avoid conflicts

for p in products[:4]:
    name = p.get('name')
    desc = p.get('description', 'High quality premium wall tile.')
    category = "Wall Tiles"
    origin = "India"
    finish = p.get('finish', 'Matte')
    thickness = p.get('size', '800 x 3000 mm')
    applications = p.get('application', 'Wall')
    
    images = p.get('images', [])
    if not images and p.get('image'):
        images = [p.get('image')]
        
    local_images = []
    for idx, img_url in enumerate(images[:2]):
        filename = f"{p.get('slug', 'wall-tile')}_{idx}.webp"
        filepath = os.path.join(out_dir, filename)
        try:
            urllib.request.urlretrieve(img_url, filepath)
            local_images.append(f"/static/somany/{filename}")
        except Exception as e:
            pass
            
    if local_images:
        extracted.append(f"""
  {{
    id: {current_id},
    name: "{name.title()}",
    category: "{category}",
    price: {250 + current_id},
    image_url: "{local_images[0]}",
    images: {json.dumps(local_images)},
    origin: "{origin}",
    finish: "{finish}",
    thickness: "{thickness}",
    availability: "In Stock",
    applications: "{applications}",
    description: "{desc.replace('"', '')}"
  }}""")
        current_id += 1

print(",\n".join(extracted))
