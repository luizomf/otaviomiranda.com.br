import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { marked } from 'marked';

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

// Extrator simples de texto e imagens para auditoria
function extractFromHtml(htmlFragment) {
  const $ = cheerio.load(htmlFragment);
  // Pega só o texto visível e o src das imagens
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const images = [];
  $('img').each((i, el) => {
    images.push($(el).attr('src'));
  });
  return { text, images };
}

async function audit() {
  const files = await getFiles(postsDir);
  const dirs = new Set(files.map(f => path.dirname(f)));

  for (const dir of dirs) {
    const oldHtmlPath = path.join(dir, 'index_old.html');

    // Tenta text.md ou TEXT.md
    let mdPath = path.join(dir, 'text.md');
    try {
      await fs.access(mdPath);
    } catch {
      mdPath = path.join(dir, 'TEXT.md');
      try {
        await fs.access(mdPath);
      } catch {
        mdPath = null;
      }
    }

    if (mdPath) {
      try {
        const oldHtml = await fs.readFile(oldHtmlPath, 'utf-8');
        const mdContent = await fs.readFile(mdPath, 'utf-8');

        // Procura a area de post-content no HTML antigo (heurística: main tag, article, div de conteudo)
        const $ = cheerio.load(oldHtml);
        let contentAreaHtml =
          $('.post-content').html() ||
          $('main').html() ||
          $('article').html() ||
          oldHtml; // Fallback extremo

        const legacyData = extractFromHtml(contentAreaHtml);

        // Remove frontmatter do md para nao sujar contagem
        const mdWithoutFrontmatter = mdContent.replace(/^---[\s\S]+?---/, '');
        const mdRenderedToHtml = marked.parse(mdWithoutFrontmatter);
        const newData = extractFromHtml(mdRenderedToHtml);

        // Analise
        const charDiff = Math.abs(legacyData.text.length - newData.text.length);
        const imgDiff = Math.abs(
          legacyData.images.length - newData.images.length,
        );

        const isSus = charDiff > 500 || imgDiff > 0; // Mais de 500 caracteres ou qtd imagem mudou

        if (isSus) {
          const basename = path.basename(dir);
          console.log(`\n⚠️ DISCREPÂNCIA ENCONTRADA EN '${basename}'`);
          console.log(
            `-> Imagens: HTML=${legacyData.images.length} vs MD=${newData.images.length}`,
          );
          console.log(
            `-> Texto length: HTML=${legacyData.text.length} vs MD=${newData.text.length} (Diff: ${charDiff} chars)`,
          );
          if (imgDiff > 0) {
            console.log(
              `   HTML Imagens:`,
              legacyData.images.slice(0, 3),
              legacyData.images.length > 3 ? '...' : '',
            );
            console.log(
              `   MD Imagens:`,
              newData.images.slice(0, 3),
              newData.images.length > 3 ? '...' : '',
            );
          }
        } else {
          // console.log(`✅ OK: ${path.basename(dir)}`);
        }
      } catch (err) {
        // Pode não ter index_old pra comparar
      }
    }
  }
}
audit().catch(console.error);
