# MEMORY.md - Continuity & Context

Here lies the context, past learnings, and self-reflection notes. 
**CRITICAL RULE**: Text > Brain. If you want to remember something for the next session, write it here.

## 🧠 Long-Term Memory (Core Context)
*Distilled wisdom, hard facts, and architectural constraints. Compress when necessary.*
- **[System]**: Initialized memory bank. The project context revolves around managing web apps, ASTRO migrations, and local/remote VPS infrastructure.

## 📝 Short-Term Logs (Current/Recent Actions)
*Briefly log what you are about to do, and what you just finished doing.*

- **[2026-02-21]**: Established the Federated Context architecture (SOUL, USER, TOOLS, MEMORY) inside the `.agents/` folder. Defined "Brien 👨🚀" persona.
- **[To-Do / Long-Term]**: 
  - **Sitemap**: Descobrir/automatizar como o Astro gera Sitemaps (o humano fazia isso na mão).
  - **Landing Pages em Branco**: Criar um mecanismo/layout para suportar páginas em branco (para demonstrações, landing pages puras de tutorial) sem colidir com o CSS padrão e os wrappers do tema principal.
  - **Frontmatter -> Layout (Extrair H1/Date/Author)**: Refatorar o `[...slug].astro` para consumir as variáveis do Zod Frontmatter (`title`, `date`, `author`) e injetar o cabeçalho no HTML base. O desenvolvedor não deve mais precisar escrever `# Titulo` no topo de cada documento `.md`.- **[2026-02-22]**: Executed the "Astro SSG Migration - Apollo Mission".
  - Refactored `src/content.config.ts` to use Astro 5+ `glob()` loader and `.id` routing for the Content Layer.
  - Wrote Node.js regex scripts to safely parse legacy `index_old.html` `<img.../>` tags wrapped in `<p>` and convert them to pure Markdown `![]()` with strict spacing (`\n\n`), fixing Astro's Vite Asset Optimization pipeline.
  - Automated deployment of the `dist/` build to **GitHub Pages** using `.github/workflows/deploy.yml`. 
  - *Learnings*: Astro's `.astro/data-store` cache can retain ghost mappings of duplicate names after file operations. `rm -rf .astro && npx astro sync` is the holy grail.
