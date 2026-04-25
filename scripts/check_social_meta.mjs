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

async function validateImageUrl({ filePath, label, value }) {
  const errors = [];
  const relativePath = path.relative(ROOT_DIR, filePath);

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
