import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.otaviomiranda.com.br',
  output: 'static',

  markdown: {
    shikiConfig: {
      // Tema que se assemelha ao legacy dark highlighter
      theme: 'catppuccin-mocha',
      wrap: true, // Força a quebra de linha em telas pequenas ao invés de scroll infinito
    },
  },

  integrations: [sitemap()],
});