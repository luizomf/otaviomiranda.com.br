import os
import re
from datetime import datetime

SITE_URL = "https://www.otaviomiranda.com.br"
ROOT_DIR = "."  # raiz do seu projeto
OUTPUT_SITEMAP_FILE = "sitemap.xml"
OUTPUT_TITLES_FILE = "titles.html"


TITLE_RE = re.compile(
    r"<title[^>]*>(.*?)\s*[-|]\s*Otávio\s*Miranda\s*</title>",
    re.IGNORECASE | re.DOTALL,
)
ignore_titles = ["_____CHANGE_ME_____"]
ignore_paths = [
    "./base/index.html",
    "./2017/meus-cursos/",
    "./2017/cursos-de-python-e-javascript-com-desconto/",
]

urls = []

for root, dirs, files in os.walk(ROOT_DIR):
    if "index.html" in files:
        full_path = os.path.join(root, "index.html")
        skip_loop = False

        # Ignorar se for raiz (index principal)
        if root == ".":
            continue

        for ignore_path in ignore_paths:
            if full_path.startswith(ignore_path):
                print("🚫 PATH IGNORED:", full_path)
                skip_loop = True
                break

        if skip_loop:
            skip_loop = False
            continue

        with open(full_path, "r", encoding="utf8") as file:
            html_content = file.read()
            title = TITLE_RE.search(html_content)

        if title:
            title = title[1].strip()

            if title in ignore_titles:
                print("🚫 TITLE IGNORED:", title, full_path)
                continue

        # Gera a URL relativa (ex: /2025/nome-do-video/)
        relative_url = os.path.relpath(root, ROOT_DIR).replace("\\", "/")
        url = f"{SITE_URL}/{relative_url}/"

        # Data de modificação do arquivo
        lastmod_timestamp = os.path.getmtime(full_path)
        lastmod_date = datetime.fromtimestamp(lastmod_timestamp).date().isoformat()

        urls.append((url, lastmod_date, title, full_path, lastmod_timestamp))


# Gerar sitemap
sorted_urls = sorted(urls, key=lambda item: item[4], reverse=True)

with open(OUTPUT_SITEMAP_FILE, "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')

    for url, lastmod, *_ in sorted_urls:
        f.write("  <url>\n")
        f.write(f"    <loc>{url}</loc>\n")
        f.write(f"    <lastmod>{lastmod}</lastmod>\n")
        f.write("  </url>\n")

    f.write("</urlset>\n")


with open(OUTPUT_TITLES_FILE, "w", encoding="utf-8") as f:
    f.write("<!-- ARTICLE LINKS -->\n")
    for url, lastmod, title, full_path, *_ in sorted_urls:
        full_path = full_path[2:].replace("index.html", "")

        f.write("<li>\n")
        f.write(f'<a href="{full_path}">')
        f.write(title)
        f.write("</a>\n")
        f.write("</li>\n")

    f.write("<!-- END ARTICLE LINKS -->\n")


print(f"✅ Sitemap gerado com {len(urls)} URLs em '{OUTPUT_SITEMAP_FILE}'")
