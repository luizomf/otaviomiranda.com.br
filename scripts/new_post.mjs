/**
 * ARQUIVO: new_post.mjs
 *
 * O QUE FAZ:
 *   Scaffolding interativo para criar novos posts no blog. Pergunta
 *   titulo e descricao (via stdin), gera o slug automaticamente,
 *   cria a estrutura de pastas (ano/slug/images/) e o arquivo text.md
 *   com frontmatter pre-preenchido (titulo, descricao, data, autor).
 *   Tambem aceita o titulo como argumento de linha de comando.
 *
 * USADO EM:
 *   - Executado manualmente via `node scripts/new_post.mjs [titulo]`
 *   - Utilizado sempre que um novo post precisa ser criado
 *
 * CONCEITO ASTRO:
 *   Este script NAO faz parte do build do Astro. E um utilitario
 *   standalone de Node.js que gera a estrutura de arquivos esperada
 *   pela Content Collection "posts" do Astro (src/content/posts/ANO/SLUG/).
 *   O frontmatter gerado segue o schema Zod definido na collection.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Equivalente a __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/[\s-]+/g, '-'); // Troca espaços por hifens
}

const AUTHOR_NAME = 'Otávio Miranda';
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createPost() {
  console.log('🚀 Criador de Postagens - OtavioMiranda.com.br');
  console.log('-----------------------------------------------');

  let title = process.argv.slice(2).join(' ');

  if (!title) {
    title = await askQuestion('Digite o título da postagem: ');
    if (!title.trim()) {
      console.error('❌ Erro: O título não pode ser vazio!');
      process.exit(1);
    }
  }

  const description = await askQuestion(
    'Digite uma breve descrição (opcional): ',
  );

  const date = new Date();
  const year = date.getFullYear().toString();

  // Formatando data em ISO 8601 com offset de São Paulo
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset',
  }).formatToParts(date);
  const get = (type) => parts.find(p => p.type === type)?.value ?? '';
  const offset = get('timeZoneName').replace('GMT', '') || '+00:00';
  const formattedDate = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}${offset}`;

  const slug = toSlug(title);

  const postDirPath = path.join(CONTENT_DIR, year, slug);
  const imagesDirPath = path.join(postDirPath, 'images');
  const filePath = path.join(postDirPath, 'text.md');

  if (fs.existsSync(postDirPath)) {
    console.error(
      `\n❌ Erro: Uma postagem com o slug "${slug}" já existe no ano ${year}!`,
    );
    process.exit(1);
  }

  // Criar pastas
  fs.mkdirSync(imagesDirPath, { recursive: true });

  // Criar arquivo text.md com Frontmatter do Zod
  const frontmatter = `---
title: '${title.replace(/'/g, "''")}'
description: '${(description || '').replace(/'/g, "''")}'
date: ${formattedDate}
author: '${AUTHOR_NAME}'
---
<!-- Substitua este texto pelo conteúdo da sua aula/artigo -->
`;

  fs.writeFileSync(filePath, frontmatter, 'utf-8');

  console.log(
    '\n✅ Postagem gerada com sucesso e pronta para uso no Astro SSG!',
  );
  console.log(`📁 Diretório: src/content/posts/${year}/${slug}/`);
  console.log(
    `📄 DICA DEV (Neovim): e src/content/posts/${year}/${slug}/text.md`,
  );

  rl.close();
}

createPost();
