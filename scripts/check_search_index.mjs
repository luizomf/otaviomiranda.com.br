import {
  lstatSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';

const directory = join(process.cwd(), 'dist', 'pagefind');
try {
  if (
    process.argv.length > 3 ||
    (process.argv[2] !== undefined && process.argv[2] !== '--prepare')
  ) {
    throw new Error('Usage: node scripts/check_search_index.mjs [--prepare]');
  }
  for (const path of [join(process.cwd(), 'dist'), directory]) {
    if (lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new Error(`Refusing symlink output: ${path}`);
    }
  }
  if (process.argv[2] === '--prepare') {
    rmSync(directory, { recursive: true, force: true });
    process.exit(0);
  }
  for (const name of ['pagefind.js', 'pagefind-entry.json']) {
    const file = statSync(join(directory, name));
    if (!file.isFile() || file.size === 0)
      throw new Error(`Missing or empty ${name}`);
  }
  const entry = JSON.parse(
    readFileSync(join(directory, 'pagefind-entry.json'), 'utf8'),
  );
  if (
    !Object.values(entry.languages ?? {}).some(
      language => language.page_count > 0,
    )
  ) {
    throw new Error('No indexed pages');
  }
  for (const language of Object.values(entry.languages)) {
    if (
      !/^[\w-]+$/.test(language.hash) ||
      (language.wasm != null && !/^[\w-]+$/.test(language.wasm))
    ) {
      throw new Error('Invalid language asset identifier');
    }
    for (const name of [
      `pagefind.${language.hash}.pf_meta`,
      `pagefind.${language.wasm ?? 'unknown'}.wasm`,
    ]) {
      const file = statSync(join(directory, name));
      if (!file.isFile() || file.size === 0)
        throw new Error(`Missing or empty ${name}`);
    }
  }
  for (const [folder, suffix] of [
    ['index', '.pf_index'],
    ['fragment', '.pf_fragment'],
  ]) {
    const files = readdirSync(join(directory, folder)).filter(name =>
      name.endsWith(suffix),
    );
    if (files.length === 0) throw new Error(`No ${folder} chunks`);
    for (const name of files) {
      const file = statSync(join(directory, folder, name));
      if (!file.isFile() || file.size === 0)
        throw new Error(`Missing or empty ${name}`);
    }
  }
  console.log('Search index validated.');
} catch (error) {
  console.error(`Search index validation failed: ${error.message}`);
  process.exitCode = 1;
}
