# Current Plan

## Task: Migrate all post pages to the 2026 single layout

Migrate all post pages to the `base/index_2026.html` structure and keep the
home page unchanged for now.

Current Date: 2026-02-17

- [x] Step 1: Confirm the exact list of post files to migrate (exclude home and non-post pages).
- [x] Step 2: Define the migration checklist (metadata, structure, links, images, code blocks, scripts).
- [x] Step 3: Migrate one pilot post using the checklist.
- [x] Step 4: Validate the pilot against the old page (content parity and layout behavior).
- [x] Step 5: Execute the migration loop for the remaining posts, one by one.
- [x] Step 6: Verify all migrated posts and regenerate sitemap if needed.
- [x] Step 7: Update CHANGELOG.md.
- [ ] Step 8: Clear PLAN.md (remove all completed content).

Scope notes:
- Keep `/index.html` (home) unchanged in this task.
- Keep redirect pages in `/2017/*` unchanged.
- Boilerplate source: `base/index_2026.html`.
- Already in 2026 layout (skip for now):
  - `2025/f-strings-no-python-do-basico-ao-avancado/index.html`
  - `2025/liskov-substitution-principle-lsp-solid/index.html`
  - `2025/logging-no-python-pare-de-usar-print-no-lugar-errado/index.html`
  - `2025/namespace-escopo-python/index.html`
  - `2026/shiki_syntax_highlighter_generator/index.html`
- Pending migration batch: none.

Pilot migration checklist:
- Keep canonical file path and URL unchanged (`.../index.html`).
- Use 2026 boilerplate structure (`styles_2026.css` + `scripts_2026.js` + nav/footer).
- Preserve `<title>` and `<meta name="description">` semantics from old page.
- Preserve article content order and HTML (headings, paragraphs, links, images, lists, code blocks).
- Keep all relative links/assets valid after migration.
- Normalize author line to: `Publicado em <date> | Por Luiz Otávio Miranda`.
- Keep only required scripts (remove legacy `scripts.js` from old layout).
- Validate by checking title, description, content presence, and broken local references.

Pilot status:
- Migrated: `2018/ssh-keys-chaves-de-autenticacao-ssh/index.html`
- Validation:
  - `<h2>` count unchanged (8 -> 8)
  - `<pre>` count unchanged (10 -> 10)
  - `<ul>` count unchanged (1 -> 1)
  - Local assets verified (`styles_2026.css`, `scripts_2026.js`, `favicon`, `imgs/1.jpg`)

Batch status:
- Migrated legacy template posts:
  - `2018/dominio-e-hospedagem-guia-para-leigos/index.html`
  - `2018/instalando-o-certificado-ssl-tls-gratis-da-lets-encrypt/index.html`
  - `2020/filas-em-python-com-deque-queue/index.html`
  - `2020/funcoes-recursivas-com-python/index.html`
  - `2020/normalizacao-unicode-em-python/index.html`
  - `2020/pilhas-em-python-com-listas-stack/index.html`
  - `2020/typescript-uma-longa-introducao/index.html`
- Migrated markdown-source posts to 2026 shell:
  - `2025/notas-tecnicas-python-argparse-cli/index.html`
  - `2025/notas-tecnicas-whisper-openai-guia-completo-de-transcricao-com-inteligencia-artificial-video-e-audio/index.html`
  - `2025/python-sussu-cli-openai-whisper/index.html`
  - `2025/whisper-live-sera-que-deu-certo/index.html`
- Verification:
  - Content structure parity checks passed for legacy template posts (`h2/pre/ul`).
  - Markdown-source content length unchanged for all 4 markdown-source posts.
  - Year routes (`20*/**/index.html`) now use `styles_2026.css`, except intentional redirects in `2017/*`.
  - `js/scripts.js` syntax check passed.
  - `sitemap.xml` regeneration skipped (route set unchanged).

_(Note: Once all items are checked `[x]`, this file should be cleared for the
next task)_
