"""Regenerates public/sitemap.xml from the live product/category slugs in
src/data/catalog.ts. Re-run this whenever products are added or removed.
"""
import re
import os
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, 'src', 'data', 'catalog.ts')
DOMAIN = 'https://goldmoufdogandco.com'
TODAY = date.today().isoformat()

with open(CATALOG, encoding='utf-8') as f:
    src = f.read()

category_slugs = re.findall(r"\{\s*slug:\s*'([a-z0-9-]+)',\s*name:", src)
product_slugs = re.findall(r"^\s*slug:\s*'([a-z0-9-]+)'\s*,\s*$", src, re.M)
product_slugs = [s for s in product_slugs if s not in category_slugs]

static_routes = [
    ('/', '1.0', 'weekly'),
    ('/shop', '0.9', 'weekly'),
    ('/configurator', '0.9', 'monthly'),
    ('/story', '0.6', 'monthly'),
    ('/custom-inquiry', '0.7', 'monthly'),
    ('/instant-quote', '0.7', 'monthly'),
    ('/contact', '0.6', 'monthly'),
    ('/legal/grillz-policy', '0.3', 'yearly'),
    ('/legal/jewelry-policy', '0.3', 'yearly'),
    ('/legal/return-policy', '0.3', 'yearly'),
    ('/legal/shipping', '0.3', 'yearly'),
    ('/legal/privacy', '0.3', 'yearly'),
    ('/legal/terms', '0.3', 'yearly'),
]

urls = []
for path, priority, freq in static_routes:
    urls.append((path, priority, freq))
for slug in category_slugs:
    urls.append((f'/shop/{slug}', '0.8', 'weekly'))
for slug in product_slugs:
    urls.append((f'/product/{slug}', '0.7', 'monthly'))

entries = '\n'.join(
    f'  <url>\n'
    f'    <loc>{DOMAIN}{path}</loc>\n'
    f'    <lastmod>{TODAY}</lastmod>\n'
    f'    <changefreq>{freq}</changefreq>\n'
    f'    <priority>{priority}</priority>\n'
    f'  </url>'
    for path, priority, freq in urls
)

xml = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f'{entries}\n'
    '</urlset>\n'
)

with open(os.path.join(ROOT, 'public', 'sitemap.xml'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(xml)

print(f'sitemap.xml written: {len(urls)} urls ({len(category_slugs)} categories, {len(product_slugs)} products)')
