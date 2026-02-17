
import re
import html
import json

def clean_legacy_html(md_text):
    # Regex to match the multi-line HTML header pattern found in TEXT.md
    # <hX id="...">\n<a href="...">\nText\n</a>\n</hX>
    pattern = re.compile(
        r'<h([1-6])\s+id="[^"]+">\s*<a\s+href="[^"]+">\s*(.*?)\s*</a>\s*</h\1>',
        re.DOTALL | re.IGNORECASE
    )
    
    def replace_header(match):
        level = int(match.group(1))
        text = match.group(2).strip()
        return f"{'#' * level} {text}"

    return pattern.sub(replace_header, md_text)

def convert_md_to_html(md_text):
    md_text = clean_legacy_html(md_text)
    html_output = []
    lines = md_text.split('\n')
    in_code_block = False
    code_block_content = []
    code_block_lang = ""
    in_list = False
    in_blockquote = False
    
    code_blocks = []
    code_block_counter = 0
    
    # regex patterns
    h1_pattern = re.compile(r'^#\s+(.+)$')
    h2_pattern = re.compile(r'^##\s+(.+)$')
    h3_pattern = re.compile(r'^###\s+(.+)$')
    list_pattern = re.compile(r'^-\s+(.+)$')
    blockquote_pattern = re.compile(r'^>\s+(.+)$')
    code_start_pattern = re.compile(r'^```(\w+)?$')
    code_end_pattern = re.compile(r'^```$')
    img_pattern = re.compile(r'!\[(.*?)\]\((.*?)\)')
    link_pattern = re.compile(r'\[(.*?)\]\((.*?)\)')
    bold_pattern = re.compile(r'\*\*(.*?)\*\*')
    italic_pattern = re.compile(r'\*(.*?)\*') # simple italics *text*
    code_inline_pattern = re.compile(r'`([^`]+)`')

    def process_inline(text):
        text = html.escape(text) # basic escaping
        # Convert images first
        text = img_pattern.sub(r'<img src="\2" alt="\1" />', text)
        # Links
        text = link_pattern.sub(r'<a href="\2">\1</a>', text)
        # Bold
        text = bold_pattern.sub(r'<strong>\1</strong>', text)
        # Italic
        text = italic_pattern.sub(r'<em>\1</em>', text)
        # Inline Code
        text = code_inline_pattern.sub(r'<code>\1</code>', text)
        return text

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped_line = line.strip()
        
        if in_code_block:
            if code_end_pattern.match(stripped_line):
                in_code_block = False
                full_code = "\n".join(code_block_content)
                code_block_counter += 1
                
                # Store code block
                code_blocks.append({
                    'lang': code_block_lang,
                    'code': full_code
                })
                
                # Output placeholder
                html_output.append(f"<!-- CODE_BLOCK_{code_block_counter} -->")
            else:
                code_block_content.append(line)
            i += 1
            continue

        # Code Blocks
        if code_start_pattern.match(stripped_line):
            in_code_block = True
            code_block_lang = code_start_pattern.match(stripped_line).group(1) or "text"
            code_block_content = []
            i += 1
            continue

        # Headers
        h1_match = h1_pattern.match(line)
        if h1_match:
            content = process_inline(h1_match.group(1))
            html_output.append(f'<h1>{content}</h1>')
            i += 1
            continue

        h2_match = h2_pattern.match(line)
        if h2_match:
            content = process_inline(h2_match.group(1))
            slug = content.lower().replace(' ', '-').replace('?', '').replace('!', '').replace('.', '').replace(',', '')
            slug = re.sub(r'<[^>]+>', '', slug)
            html_output.append(f'<h2 id="{slug}">{content}</h2>')
            i += 1
            continue

        h3_match = h3_pattern.match(line)
        if h3_match:
            content = process_inline(h3_match.group(1))
            slug = content.lower().replace(' ', '-').replace('?', '').replace('!', '').replace('.', '').replace(',', '')
            slug = re.sub(r'<[^>]+>', '', slug)
            html_output.append(f'<h3 id="{slug}">{content}</h3>')
            i += 1
            continue

        # Lists
        list_match = list_pattern.match(line)
        if list_match:
            if not in_list:
                html_output.append('<ul>')
                in_list = True
            content = process_inline(list_match.group(1))
            html_output.append(f'  <li>{content}</li>')
            i += 1
            continue
        elif in_list:
            if not list_match: 
                if stripped_line == "":
                    if i + 1 < len(lines) and list_pattern.match(lines[i+1]):
                        i+=1
                        continue
                html_output.append('</ul>')
                in_list = False

        # Blockquotes
        blockquote_match = blockquote_pattern.match(line)
        if blockquote_match:
           if not in_blockquote:
               html_output.append('<blockquote>')
               in_blockquote = True
           content = process_inline(blockquote_match.group(1))
           html_output.append(f'<p>{content}</p>')
           i+=1
           continue
        elif in_blockquote:
           if stripped_line == "":
               if i + 1 < len(lines) and blockquote_pattern.match(lines[i+1]):
                    i+=1
                    continue
           html_output.append('</blockquote>')
           in_blockquote = False

        # Paragraphs
        if stripped_line:
            if not (h1_match or h2_match or h3_match or list_match or blockquote_match or code_start_pattern.match(line)):
                if stripped_line == '---':
                    html_output.append('<hr />')
                else:
                    content = process_inline(line)
                    html_output.append(f'<p>{content}</p>')
        
        i += 1
    
    if in_list:
        html_output.append('</ul>')
    if in_blockquote:
        html_output.append('</blockquote>')

    return "\n".join(html_output), code_blocks

# 2026 Template Content
template = """<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Escopo e Namespace em Python - Otávio Miranda</title>
    <meta
      name="description"
      content="Em Python, o escopo determina a visibilidade e o tempo de vida dos nomes do seu programa, já o namespace é o local onde os nomes estão salvos."
    />

    <link rel="stylesheet" href="../../css/styles_2026.css" />

    <link rel="icon" type="image/webp" href="../../imgs/favicon-1.webp" />

    <!-- conexão antecipada -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- fonte -->
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;800&display=swap"
      rel="stylesheet"
    />
  </head>

  <body>
    <input
      aria-label="Tema Claro ou Escuro (Temporário)"
      title="Tema Claro ou Escuro (Temporário)"
      id="theme-mode"
      type="checkbox"
    />

    <main class="main">
      <aside class="nav">
        <a class="copyright-link" href="/">Otávio Miranda</a>
        <a
          target="_blank"
          href="https://beacons.ai/otaviomiranda"
          rel="nofollow noopener noreferrer"
          >Contatos</a
        >
      </aside>

      <article class="article">
        <!-- Content will be injected here -->
        {content}
      </article>

      <footer class="footer">
        <p>
          Feito com <span class="heart">❤</span> por
          <a href="https://www.otaviomiranda.com.br/">Luiz Otávio Miranda</a>
        </p>
      </footer>
    </main>

    <!-- Syntax Highlight -->
    <script>
      // Implementar depois se precisar de JS específico
    </script>
  </body>
</html>
"""

def main():
    with open('TEXT.md', 'r', encoding='utf-8') as f:
        md_content = f.read()

    html_content, code_blocks = convert_md_to_html(md_content)
    
    final_output = template.format(content=html_content)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(final_output)

    with open('codes.json', 'w', encoding='utf-8') as f:
        json.dump(code_blocks, f, indent=2)
    
    print(f"Generated index.html and codes.json ({len(code_blocks)} blocks)")

if __name__ == "__main__":
    main()
