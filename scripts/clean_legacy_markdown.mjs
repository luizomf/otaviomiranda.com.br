/**
 * ARQUIVO: clean_legacy_markdown.mjs
 *
 * O QUE FAZ:
 *   Limpa resquicios de HTML legado dentro dos arquivos Markdown dos
 *   posts. Remove especificamente:
 *     1. Blocos <template> de alertas do GitHub Gist
 *     2. Classes CSS prefixadas com "js-" copiadas do DOM do GitHub
 *     3. Estilos inline de float herdados de links raw do Gist
 *   Percorre recursivamente todos os .md em src/content/posts/.
 *
 * USADO EM:
 *   - Executado manualmente via `node scripts/clean_legacy_markdown.mjs`
 *   - Utilizado apos a migracao inicial de HTML para Markdown
 *
 * CONCEITO ASTRO:
 *   Este script NAO faz parte do build do Astro. E um utilitario
 *   standalone de Node.js para higienizar arquivos Markdown que serao
 *   consumidos pela Content Collection "posts" do Astro.
 */
#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve('src/content/posts');

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (/\.(md|MD)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function cleanMarkdownLegacyHtml(content) {
  let next = content;

  // Remove GitHub gist template blocks that are inert in static markdown exports.
  next = next.replace(
    /\n?<template class="[^"]*(?:js-file-alert-template|js-line-alert-template)[^"]*">[\s\S]*?<\/template>\n?/g,
    '\n',
  );

  // Remove JS-only classes copied from GitHub DOM snapshots.
  next = next.replace(/(\s+)class="([^"]*)"/g, (match, ws, classValue) => {
    const tokens = classValue.split(/\s+/).filter(Boolean);

    if (!tokens.some(token => token.startsWith('js-'))) {
      return match;
    }

    const filtered = tokens.filter(token => !token.startsWith('js-'));

    if (filtered.length === 0) {
      return '';
    }

    return `${ws}class="${filtered.join(' ')}"`;
  });

  // Remove legacy inline float style from gist raw link.
  next = next.replace(/\s+style="float:right"/g, '');

  return next;
}

const files = await collectMarkdownFiles(ROOT_DIR);
let changedFiles = 0;

for (const filePath of files) {
  const original = await fs.readFile(filePath, 'utf8');
  const cleaned = cleanMarkdownLegacyHtml(original);

  if (cleaned !== original) {
    await fs.writeFile(filePath, cleaned, 'utf8');
    changedFiles += 1;
    console.log(`cleaned: ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log(`\nDone. Changed files: ${changedFiles}`);
