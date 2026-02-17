# Changelog

All notable changes to this project are documented here.

## 2026-02-17

- Migrated pilot post `2018/ssh-keys-chaves-de-autenticacao-ssh/index.html` to
  the 2026 single layout.
- Replaced legacy assets (`../../css/style.css`, `../../js/scripts.js`) with
  2026 assets (`../../css/styles_2026.css`, `../../js/scripts_2026.js`).
- Preserved page title, meta description, article content structure, and local
  media references.
- Migrated additional legacy-template posts to the 2026 single layout:
  - `2018/dominio-e-hospedagem-guia-para-leigos/index.html`
  - `2018/instalando-o-certificado-ssl-tls-gratis-da-lets-encrypt/index.html`
  - `2020/filas-em-python-com-deque-queue/index.html`
  - `2020/funcoes-recursivas-com-python/index.html`
  - `2020/normalizacao-unicode-em-python/index.html`
  - `2020/pilhas-em-python-com-listas-stack/index.html`
  - `2020/typescript-uma-longa-introducao/index.html`
- Migrated markdown-source posts to 2026 shell while keeping markdown content
  in `#markdown-source`:
  - `2025/notas-tecnicas-python-argparse-cli/index.html`
  - `2025/notas-tecnicas-whisper-openai-guia-completo-de-transcricao-com-inteligencia-artificial-video-e-audio/index.html`
  - `2025/python-sussu-cli-openai-whisper/index.html`
  - `2025/whisper-live-sera-que-deu-certo/index.html`
- Simplified markdown runtime by removing `highlight.js` from these pages.
- Updated `js/scripts.js` to keep site-search behavior but also render markdown
  even when a search form is not present.
