/**
 * Validate rendered social preview metadata after the Astro build.
 *
 * This catches broken Open Graph/Twitter image URLs before deploy, especially
 * source-tree paths such as /content/posts/... that are not public build assets.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SITE_URL = new URL(
  process.env.SITE_URL ?? 'https://otaviomiranda.com.br',
);
const MAX_SOCIAL_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_PAGE_TITLE =
  'Otávio Miranda | Cursos de Programação Python, JS e Full Stack';
const DEFAULT_PAGE_DESCRIPTION =
  'Aprenda programação de verdade com Otávio Miranda. Cursos de Python, JavaScript, TypeScript e Full Stack focados em projetos reais. Mais de 300 mil alunos.';
const BLOG_PAGINATION_PATH_PATTERN = /^blog\/(?<page>\d+)\/index\.html$/;

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectHtmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(entryPath);
      if (entry.isFile() && entry.name.endsWith('.html')) return [entryPath];
      return [];
    }),
  );

  return files.flat();
}

function getMetaContent($, selector) {
  return $(selector).attr('content')?.trim();
}

function getRootRelativePath(filePath) {
  return path.relative(ROOT_DIR, filePath);
}

function getDistRelativePath(filePath) {
  return path.relative(DIST_DIR, filePath).split(path.sep).join('/');
}

async function validateImageUrl({ filePath, label, value }) {
  const errors = [];
  const relativePath = getRootRelativePath(filePath);

  if (!value) {
    return [`${relativePath}: missing ${label}`];
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return [`${relativePath}: ${label} must be an absolute URL: ${value}`];
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return [`${relativePath}: ${label} must use http(s): ${value}`];
  }

  if (url.origin !== SITE_URL.origin) return errors;

  const pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith('/content/posts/')) {
    errors.push(`${relativePath}: ${label} points to source content: ${value}`);
  }

  const builtAssetPath = path.join(DIST_DIR, pathname.replace(/^\/+/, ''));
  if (!(await pathExists(builtAssetPath))) {
    errors.push(`${relativePath}: ${label} asset is missing in dist: ${value}`);
    return errors;
  }

  const stat = await fs.stat(builtAssetPath);
  if (stat.size > MAX_SOCIAL_IMAGE_BYTES) {
    errors.push(
      `${relativePath}: ${label} asset is over 5 MB: ${value} (${stat.size} bytes)`,
    );
  }

  return errors;
}

async function main() {
  if (!(await pathExists(DIST_DIR))) {
    throw new Error('dist directory does not exist. Run astro build first.');
  }

  const htmlFiles = await collectHtmlFiles(DIST_DIR);
  const errors = [];

  for (const filePath of htmlFiles) {
    const html = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(html);
    const relativePath = getRootRelativePath(filePath);
    const distRelativePath = getDistRelativePath(filePath);
    const documentTitle = $('title').first().text().trim();
    const description = getMetaContent($, 'meta[name="description"]');
    const ogTitle = getMetaContent($, 'meta[property="og:title"]');
    const ogDescription = getMetaContent($, 'meta[property="og:description"]');
    const twitterTitle = getMetaContent($, 'meta[name="twitter:title"]');
    const twitterDescription = getMetaContent(
      $,
      'meta[name="twitter:description"]',
    );

    if (!documentTitle) errors.push(`${relativePath}: missing <title>`);
    if (!description) {
      errors.push(`${relativePath}: missing meta description`);
    }

    const textTags = [
      { label: 'og:title', value: ogTitle, expected: documentTitle },
      {
        label: 'og:description',
        value: ogDescription,
        expected: description,
      },
      {
        label: 'twitter:title',
        value: twitterTitle,
        expected: documentTitle,
      },
      {
        label: 'twitter:description',
        value: twitterDescription,
        expected: description,
      },
    ];

    for (const tag of textTags) {
      if (!tag.value) {
        errors.push(`${relativePath}: missing ${tag.label}`);
      } else if (tag.expected && tag.value !== tag.expected) {
        errors.push(
          `${relativePath}: ${tag.label} does not match page metadata`,
        );
      }
    }

    const blogPaginationMatch = distRelativePath.match(
      BLOG_PAGINATION_PATH_PATTERN,
    );
    if (blogPaginationMatch?.groups?.page) {
      const pageLabel = `Página ${blogPaginationMatch.groups.page}`;

      if (documentTitle === DEFAULT_PAGE_TITLE) {
        errors.push(`${relativePath}: blog pagination uses home title`);
      }

      if (description === DEFAULT_PAGE_DESCRIPTION) {
        errors.push(`${relativePath}: blog pagination uses home description`);
      }

      if (!documentTitle.includes(pageLabel)) {
        errors.push(
          `${relativePath}: blog pagination title must include "${pageLabel}"`,
        );
      }

      if (!description?.includes(pageLabel)) {
        errors.push(
          `${relativePath}: blog pagination description must include "${pageLabel}"`,
        );
      }
    }

    const tags = [
      {
        label: 'og:image',
        value: getMetaContent($, 'meta[property="og:image"]'),
      },
      {
        label: 'og:image:width',
        value: getMetaContent($, 'meta[property="og:image:width"]'),
      },
      {
        label: 'og:image:height',
        value: getMetaContent($, 'meta[property="og:image:height"]'),
      },
      {
        label: 'twitter:image',
        value: getMetaContent($, 'meta[name="twitter:image"]'),
      },
    ];

    for (const tag of tags.filter(
      tag =>
        tag.label.includes('image') &&
        tag.label !== 'og:image:width' &&
        tag.label !== 'og:image:height',
    )) {
      errors.push(...(await validateImageUrl({ filePath, ...tag })));
    }

    for (const tag of tags.filter(
      tag => tag.label === 'og:image:width' || tag.label === 'og:image:height',
    )) {
      if (!tag.value || !Number.isInteger(Number(tag.value))) {
        errors.push(
          `${path.relative(ROOT_DIR, filePath)}: missing numeric ${tag.label}`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error('Social metadata validation failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Social metadata validated for ${htmlFiles.length} page(s).`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
