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
- Improved mobile behavior in 2026 layout styles (`css/styles_2026.css`):
  - added safer width constraints for `.article` and `pre` blocks;
  - reduced list indentation on small screens;
  - prevented horizontal overflow from long content in migrated post pages.
- Ran a final mobile pass in localhost (`390x844` and `320x568`) and confirmed
  all migrated posts are now passing without horizontal overflow.
- Added a new 2026 home draft in `index_2026.html` focused on conversion and
  visibility of key links, while keeping legacy `index.html` unchanged.
- Added dedicated home styles in `css/home_2026.css` with:
  - alternating light/dark sections;
  - responsive hero, metrics, coupon, and course-card grids;
  - mouse-reactive glow on highlighted dark sections.
- Added `js/home_2026.js` for home-only interactions:
  - scoped Google search (`site:otaviomiranda.com.br`);
  - animated counters on scroll (including reset when leaving viewport);
  - pointer-follow glow positioning via CSS custom properties.
- Updated homepage metrics/copy to final values:
  - nota Udemy `4.8`;
  - `330.819` alunos;
  - `108.302` avaliações;
  - `140.000+` inscritos no YouTube;
  - cupom `FEB2026`, válido até `22/02/2026`.
- Refined the first fold of `index_2026.html` to a more minimal/personal style:
  - headline simplified to `Olá, sou Otávio Miranda.`;
  - reduced intro text and emphasized direct links (`YouTube`, `Cursos`,
    `Contatos`);
  - removed the search form from the first fold.
- Improved home performance by using local/system font stacks in
  `css/home_2026.css` (without Google Fonts dependency).
- Reworked `js/home_2026.js` into modular blocks and removed legacy particle
  code coupled to `#nokey`.
- Added a reusable particles contract via `data-particles-*` attributes and
  enabled it in the hero (`#about`) with defaults:
  - desktop density `160`, mobile density `56`;
  - radius `1.6`, speed `0.35`, attract `0.055`, friction `0.92`,
    opacity `0.55`;
  - palette `#1d4ed8,#2563eb,#3b82f6,#ef4444,#f59e0b`.
- Implemented a lightweight canvas vortex engine with:
  - auto canvas injection (`.particles-canvas`) in marked sections;
  - pointer attraction, center-orbit dynamics, and device-pixel-ratio cap;
  - pause/resume by section visibility and document visibility;
  - reduced-motion static rendering fallback.
- Added `animation-timeline: view(...)` progressive enhancement for
  `.course-card` reveal animation, with static fallback where unsupported.
- Added root feature flag detection (`html.has-view-timeline`) to gate scroll
  timeline styles safely.
