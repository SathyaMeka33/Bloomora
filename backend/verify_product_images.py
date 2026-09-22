import json

with open('../frontend/lib/products1000.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Total Products: {len(products)}")
print(f"Unique IDs: {len(set(p['id'] for p in products))}")
print(f"Unique Names: {len(set(p['name'] for p in products))}")
print(f"Unique Images: {len(set(p['images'][0] for p in products))}")

seen_cats = set()
print("\nSample category-to-image matches:")
for p in products:
    cat = p['category']
    if cat not in seen_cats:
        seen_cats.add(cat)
        img_name = p['images'][0].split('/')[-1]
        print(f"  {cat:<20} | {p['name'][:32]:<32} | {img_name[:40]}")
