# Current Plan

## Task: Migração para o Astro (SSG)

Migrar o site estático atual para o projeto Astro, gerenciando as URLs atuais de
postagens, separando layout em componentes reutilizáveis e otimizando a criação
de conteúdo usando Content Collections de Markdown.

Current Date: 2026-02-21

- [ ] Step 1: Inicializar projeto Astro mantendo a estática (Static Site
      Generator).
- [ ] Step 2: Mover assets globais (`css/`, `js/`, `imgs/`) para o ecossistema
      Astro (`src/assets` ou `public`).
- [ ] Step 3: Desenvolver Componentes UI Reutilizáveis (Header, Footer,
      Headings, Newsletter, Highlighters).
- [ ] Step 4: Criar BaseLayout.astro e PostLayout.astro para padronizar qualquer
      nova página.
- [ ] Step 5: Configurar Astro Content Collections para carregar os posts das
      pastas `2018/`, `2020/`, `2025/`, `2026/` diretamente como arquivos
      Markdown/MDX.
- [ ] Step 6: Configurar "Dynamic Routing" para preservar perfeitamente todas as
      URIs antigas para SEO (evitar erros 404).
- [ ] Step 7: Substituir implementação manual atual do Shiki pelo Shiki interno
      nativo e potente do próprio Astro.
- [ ] Step 8: Setup de um ambiente de _Live Preview_ para que o markdown editado
      seja renderizado localmente sem delays (aproveitando o dev server nativo).
- [ ] Step 9: Verify/Test.
- [ ] Step 10: Update .agents/MEMORY.md.
- [ ] Step 11: Clear PLAN.md (remove all completed content).

_(Note: Once all items are checked `[x]`, this file should be cleared for the
next task)_
