import re
import json

try:
    with open(r'C:\Users\karthiksuresh\.gemini\antigravity-ide\brain\d26142fe-d56d-42af-ae6b-6d7d081d9367\.system_generated\steps\388\content.md', 'r', encoding='utf-8') as f:
        html = f.read()

    match = re.search(r'<script id="__NEXT_DATA__" type="application/json".*?>(.*?)</script>', html)
    if match:
        data = json.loads(match.group(1))
        
        # Traverse JSON recursively to find product_name and price
        products = []
        def find_products(obj):
            if isinstance(obj, dict):
                if 'product_name' in obj and 'price' in obj:
                    products.append(obj)
                for k, v in obj.items():
                    find_products(v)
            elif isinstance(obj, list):
                for item in obj:
                    find_products(item)
                    
        find_products(data)
        
        # remove duplicates
        seen = set()
        for p in products:
            if p['product_name'] not in seen:
                seen.add(p['product_name'])
                if isinstance(p['price'], dict):
                    price = p['price'].get('price', 'N/A')
                    unit = p['price'].get('unit', '')
                    curr = p['price'].get('currency', 'INR')
                else:
                    price = p['price']
                    unit = ''
                    curr = ''
                print(f"{p['product_name']} | {price} {curr} / {unit}")
                if 'image_url' in p:
                    print(f"Image: {p['image_url']}")
                print('-'*20)
    else:
        print("No script tag found")
except Exception as e:
    print(e)
