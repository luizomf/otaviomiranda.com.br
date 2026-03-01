import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');

const includeExtensions = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mdx',
  '.mjs',
  '.ts',
]);

const ignoredDirectories = new Set(['.astro', '.git', 'dist', 'node_modules']);

const definitionPatterns = [
  /--([a-z0-9-]+)\s*:/gi,
  /@property\s+--([a-z0-9-]+)/gi,
];
const usagePattern = /var\(--([a-z0-9-]+)/gi;
const blankLayoutImportPattern =
  /import\s+BlankLayout\s+from\s+['"][^'"]+BlankLayout\.astro['"]/;

function listFiles(directory) {
  const files = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.github') {
      continue;
    }

    if (ignoredDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
      continue;
    }

    if (!includeExtensions.has(path.extname(entry.name))) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function collectMatches(content, pattern) {
  const matches = [];

  for (const match of content.matchAll(pattern)) {
    matches.push(match[1]);
  }

  return matches;
}

const definitions = new Set();
const usages = new Map();
const fileDefinitions = new Map();
const fileUsages = new Map();
const blankLayoutPages = new Set();

for (const filePath of listFiles(repoRoot)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(repoRoot, filePath);
  const localDefinitions = new Set();
  const localUsages = new Set();

  if (blankLayoutImportPattern.test(content)) {
    blankLayoutPages.add(relativePath);
  }

  for (const pattern of definitionPatterns) {
    for (const tokenName of collectMatches(content, pattern)) {
      definitions.add(tokenName);
      localDefinitions.add(tokenName);
    }
  }

  for (const tokenName of collectMatches(content, usagePattern)) {
    localUsages.add(tokenName);

    if (!usages.has(tokenName)) {
      usages.set(tokenName, new Set());
    }

    usages.get(tokenName).add(relativePath);
  }

  fileDefinitions.set(relativePath, localDefinitions);
  fileUsages.set(relativePath, localUsages);
}

const missingTokens = [...usages.entries()]
  .filter(([tokenName]) => !definitions.has(tokenName))
  .sort(([left], [right]) => left.localeCompare(right));

const blankLayoutTokenLeaks = [...blankLayoutPages]
  .map(relativePath => {
    const localDefinitions = fileDefinitions.get(relativePath) ?? new Set();
    const localUsages = fileUsages.get(relativePath) ?? new Set();
    const missingLocalTokens = [...localUsages]
      .filter(tokenName => !localDefinitions.has(tokenName))
      .sort();

    return { relativePath, missingLocalTokens };
  })
  .filter(({ missingLocalTokens }) => missingLocalTokens.length > 0)
  .sort((left, right) => left.relativePath.localeCompare(right.relativePath));

if (missingTokens.length === 0 && blankLayoutTokenLeaks.length === 0) {
  console.log('All CSS custom property references resolve to a definition.');
  process.exit(0);
}

if (missingTokens.length > 0) {
  console.error('Undefined CSS custom properties found:\n');

  for (const [tokenName, filePaths] of missingTokens) {
    const locations = [...filePaths].sort().join(', ');
    console.error(`- --${tokenName}: ${locations}`);
  }
}

if (blankLayoutTokenLeaks.length > 0) {
  if (missingTokens.length > 0) {
    console.error('');
  }

  console.error(
    'BlankLayout pages must define the custom properties they use:\n',
  );

  for (const { relativePath, missingLocalTokens } of blankLayoutTokenLeaks) {
    const formattedTokens = missingLocalTokens.map(
      tokenName => `--${tokenName}`,
    );
    console.error(`- ${relativePath}: ${formattedTokens.join(', ')}`);
  }
}

process.exit(1);
