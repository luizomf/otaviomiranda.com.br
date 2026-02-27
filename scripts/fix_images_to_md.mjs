/**
 * ARQUIVO: fix_images_to_md.mjs
 *
 * O QUE FAZ:
 *   Converte tags <img> HTML remanescentes nos arquivos Markdown para
 *   a sintaxe nativa de imagem do Markdown (![alt](src)). Trata dois
 *   cenarios: imagens externas (http) e imagens locais (prepende "./"
 *   quando necessario para que o Vite do Astro resolva o caminho).
 *
 * USADO EM:
 *   - Executado manualmente via `node scripts/fix_images_to_md.mjs`
 *   - Utilizado apos a migracao de conteudo HTML para Markdown
 *
 * CONCEITO ASTRO:
 *   Este script NAO faz parte do build do Astro. E um utilitario
 *   standalone de Node.js. O prefixo "./" nas imagens locais e
 *   importante porque o Astro/Vite usa caminhos relativos para
 *   otimizar e processar imagens em build time.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, '../src/content/posts');

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

async function fixImages() {
  const files = await getFiles(postsDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  for (const file of mdFiles) {
    const content = await fs.readFile(file, 'utf8');

    // Procura por <img ... src="alguma/coisa" ...>
    // Pode usar aspas simples ou duplas
    // Pega tbm o alt se tiver
    let newContent = content.replace(
      /<img[^>]*?src=(?:"|')([^"']+)(?:"|')[^>]*?>/gi,
      (match, src) => {
        // Pega o alt text se existir
        const altMatch = match.match(/alt=(?:"|')([^"']*?)(?:"|')/i);
        const alt = altMatch ? altMatch[1] : '';

        // Se for http, apenas retorna a markdown pura (Astro v5 Content Layer ignora processamento local)
        if (src.startsWith('http')) return `![${alt}](${src})`;

        // Se não for http e não começar com /, ./ ou ../ vamos prependear ./ para o Astro vite resolver
        let finalSrc = src;
        if (!src.startsWith('/') && !src.startsWith('.')) {
          finalSrc = `./${src}`;
        }

        return `![${alt}](${finalSrc})`;
      },
    );

    if (newContent !== content) {
      await fs.writeFile(file, newContent, 'utf8');
      console.log(
        `✅ Imagens corrigidas em: ${path.basename(path.dirname(file))}/${path.basename(file)}`,
      );
    }
  }
}

fixImages().catch(console.error);
