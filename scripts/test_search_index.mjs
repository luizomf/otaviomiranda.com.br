import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(
  new URL('./check_search_index.mjs', import.meta.url),
);

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'search-index-test-'));
  const output = join(cwd, 'dist', 'pagefind');
  mkdirSync(output, { recursive: true });
  writeFileSync(join(output, 'pagefind.js'), '// fixture browser bundle');
  writeFileSync(
    join(output, 'pagefind-entry.json'),
    JSON.stringify({
      version: '1.5.0',
      languages: { pt: { hash: 'pt_test', wasm: 'pt', page_count: 1 } },
    }),
  );
  return { cwd, output };
}

test('build rejects an entry manifest whose language data is missing', () => {
  const { cwd } = fixture();
  try {
    const result = spawnSync(process.execPath, [script], {
      cwd,
      encoding: 'utf8',
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Search index validation failed/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('build rejects language metadata without search index chunks', () => {
  const { cwd, output } = fixture();
  writeFileSync(join(output, 'pagefind.pt_test.pf_meta'), 'metadata');
  writeFileSync(join(output, 'wasm.pt.pagefind'), 'wasm');
  try {
    const result = spawnSync(process.execPath, [script], {
      cwd,
      encoding: 'utf8',
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Search index validation failed/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('build accepts a complete nonempty search output package', () => {
  const { cwd, output } = fixture();
  for (const name of [
    'pagefind.pt_test.pf_meta',
    'wasm.pt.pagefind',
    'index/pt_test.pf_index',
    'fragment/pt_test.pf_fragment',
  ]) {
    mkdirSync(join(output, name, '..'), { recursive: true });
    writeFileSync(join(output, name), 'fixture bytes');
  }
  try {
    const result = spawnSync(process.execPath, [script], {
      cwd,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Search index validated/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('build preparation removes only the previous search output', () => {
  const { cwd, output } = fixture();
  const page = join(cwd, 'dist', 'index.html');
  writeFileSync(page, '<h1>Preserve other output</h1>');
  try {
    const result = spawnSync(process.execPath, [script, '--prepare'], {
      cwd,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(output), false);
    assert.equal(existsSync(page), true);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('build rejects missing search output with an actionable diagnostic', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'search-index-test-'));
  try {
    const result = spawnSync(process.execPath, [script], {
      cwd,
      encoding: 'utf8',
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Search index validation failed/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
