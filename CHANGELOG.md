# Changelog

All notable changes to this project are documented here.

## 2026-02-23

- Switched base styling to Astro's CSS pipeline by removing direct stylesheet
  loading from `BaseLayout.astro` and keeping global styles via
  `import '../styles/global.css'`.
- Completed legacy gist snapshot cleanup in active markdown content:
  - replaced embedded GitHub/Gist HTML markup with plain markdown fences in
    `2020/funcoes-recursivas-com-python/text.md`;
  - adjusted post metadata date in
    `2025/python-sussu-cli-openai-whisper/text.md`.
- Replaced external contacts hub dependency:
  - created an internal contacts page;
  - migrated navigation links from `beacons.ai` to the internal route;
  - normalized route naming to `/contacts/`.
- Updated project documentation (`README.md`) with:
  - editorial principles for the blog experience;
  - clarified and updated TODO milestones;
  - completion of archive pagination and legacy CSS cleaning tasks.

## 2026-02-20

- Reordered sections on the homepage (`index.html`) to improve conversion flow:
  - Moved `section-coupon` up right after courses.
  - Moved `section-blog` up.
  - Moved `section-testimonials` down (fallback for deeper scrolling).
  - Moved `section-newsletter` down.
  - Final order: Hero -> Courses -> Coupon -> Blog -> Testimonials -> Newsletter -> Footer.
- Updated Newsletter form to use the native Substack embed endpoint (`luizomf.substack.com`), preserving custom UI without relying on iframes.
- Added new `.bg-parallax` utility class in `css/styles_2026_v2.css` built with `animation-timeline: view()` for scroll-driven background effects.
- Applied `.bg-parallax` to `#section-coupon`, `#section-testimonials`, and `#section-footer` in `index.html`.
- Implemented `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)` to ensure `.bg-parallax` degrades gracefully in browsers without support and respects accessibility settings.
- Adjusted typography and casing in `index.html`: replaced `Javascript` with `JavaScript` and straight quotes (`""`) with typographic quotes (`“”`) in testimonials.



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
- Refined first fold behavior in `index_2026.html`:
  - hero now uses full viewport height (`100svh/100dvh` with fallback);
  - adjusted vertical paddings to keep first-screen composition balanced;
  - added a subtle scroll cue linking to `#numbers` to indicate more content
    below the fold.
- Refined metrics section visual behavior in `css/home_2026.css`:
  - tightened metrics grid spacing for better containment;
  - enforced metric card content containment (`min-width: 0`, hidden overflow);
  - changed metric numbers to a more neutral/system sans stack with reduced
    weight and tuned size/letter-spacing;
  - enabled tabular numeric rendering for cleaner counters.
- Tuned metrics counters and section rhythm:
  - reduced metric counter max size to `clamp(2.8rem, 4.4vw, 4.6rem)`;
  - increased `#numbers` vertical padding for more breathing room.
- Updated `#numbers` breathing room to
  `padding: clamp(6rem, 14vw, 18rem)` (top and bottom) after visual tuning.
- Expanded `#numbers` spacing again to
  `padding: clamp(7rem, 16vw, 22rem)` for a less compressed visual rhythm.
- Updated home color tokens in `css/home_2026.css` to the new palette:
  - `--home-dark: #000011`
  - `--home-dark-soft: #111112`
  - `--home-accent: #347ce3`
  - `--home-accent-strong: #1b79ff`
- Applied the same expanded vertical spacing rhythm to `#coupon`:
  - `padding-top: clamp(7rem, 16vw, 22rem)`
  - `padding-bottom: clamp(7rem, 16vw, 22rem)`
