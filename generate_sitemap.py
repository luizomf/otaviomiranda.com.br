import os
from datetime import datetime

SITE_URL = "https://www.otaviomiranda.com.br"
ROOT_DIR = "."  # raiz do seu projeto
OUTPUT_FILE = "sitemap.xml"

urls = []

for root, dirs, files in os.walk(ROOT_DIR):
    if "index.html" in files:
        full_path = os.path.join(root, "index.html")

        # Ignorar se for raiz (index principal)
        if root == ".":
            continue

        # Gera a URL relativa (ex: /2025/nome-do-video/)
        relative_url = os.path.relpath(root, ROOT_DIR).replace("\\", "/")
        url = f"{SITE_URL}/{relative_url}/"

        # Data de modificação do arquivo
        lastmod_timestamp = os.path.getmtime(full_path)
        lastmod_date = datetime.fromtimestamp(lastmod_timestamp).date().isoformat()

        urls.append((url, lastmod_date))

# Gerar sitemap
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')

    for url, lastmod in sorted(urls):
        f.write("  <url>\n")
        f.write(f"    <loc>{url}</loc>\n")
        f.write(f"    <lastmod>{lastmod}</lastmod>\n")
        f.write("  </url>\n")

    f.write("</urlset>\n")

print(f"✅ Sitemap gerado com {len(urls)} URLs em '{OUTPUT_FILE}'")
