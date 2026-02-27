/**
 * ARQUIVO: astro.config.mjs
 *
 * O QUE FAZ:
 *   Arquivo central de configuracao do projeto Astro. Define o dominio do site,
 *   o modo de saida (SSG estatico), configuracoes de Markdown (syntax highlighting
 *   via Shiki), tratamento de imagens responsivas e integracoes (sitemap).
 *
 * USADO?
 *   Sim. O Astro le este arquivo automaticamente na raiz do projeto ao rodar
 *   `astro dev`, `astro build` e `astro preview`. Toda configuracao global
 *   do projeto vive aqui.
 *
 * CONCEITO ASTRO:
 *   "Astro Configuration" — defineConfig() fornece tipagem e autocomplete.
 *   Cada chave (site, output, markdown, image, integrations) mapeia para um
 *   subsistema do Astro. `output: 'static'` gera HTML puro no build (SSG).
 *   `integrations` e o sistema de plugins do Astro (aqui: @astrojs/sitemap).
 */
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL final do site — usada pelo sitemap, canonical URLs e Open Graph
  site: 'https://www.otaviomiranda.com.br',

  // SSG puro: todas as paginas sao pre-renderizadas em HTML no build
  output: 'static',

  // Configuracao do processador de Markdown (posts do blog sao .md)
  markdown: {
    shikiConfig: {
      // Tema que se assemelha ao legacy dark highlighter
      theme: 'github-dark-high-contrast',
      wrap: true, // Forca a quebra de linha em telas pequenas ao inves de scroll infinito
    },
  },

  // Otimizacao de imagens: gera srcset automatico com layout "constrained"
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },

  // Integracoes (plugins) do Astro — sitemap gera /sitemap-index.xml no build
  integrations: [sitemap()],
});
