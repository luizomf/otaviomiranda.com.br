import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url));
const directory = 'public/fonts/fira-mono-nerd';
const hashes = {
  Regular: 'd75de06ed7a441f92a1b65e9b6d77757225ed2fd242045192b1500b4ce254ba0',
  Medium: 'ed979bd056261d3b4891a28fe5222350a49d922f5737a6db34beddb9f29a834f',
  Bold: '16bac0d6c65d895ee6427403a175b182c9d7d34aad552900b12b977b7a6dca8e',
};

for (const [face, hash] of Object.entries(hashes)) {
  test(`${face} retains the verified full-glyph WOFF2 binary`, () => {
    const font = read(`${directory}/FiraMonoNerdFont-${face}.woff2`);
    assert.equal(font.subarray(0, 4).toString(), 'wOF2');
    assert.equal(createHash('sha256').update(font).digest('hex'), hash);
  });
}

test('all weights and preloads resolve to local assets', () => {
  const css = read('src/styles/fonts.css').toString();
  for (const weight of [400, 500, 700]) {
    assert.match(css, new RegExp(`font-weight: ${weight};`));
  }
  const layout = read('src/layouts/BaseLayout.astro').toString();
  const urls = [...css.matchAll(/url\('([^']+)'\)/g)].map(match => match[1]);
  assert.equal(urls.length, 3);
  for (const url of urls) {
    assert.ok(url.startsWith('/fonts/fira-mono-nerd/'));
    assert.ok(read(`public${url}`).length);
  }
  for (const match of layout.matchAll(/href='([^']+\.woff2)'/g)) {
    assert.ok(urls.includes(match[1]));
  }
  assert.ok(!existsSync(new URL('../public/fonts/fira-code', import.meta.url)));
});

test('site and isolated editor share the family without programming ligatures', () => {
  const global = read('src/styles/global.css').toString();
  const page = read('src/pages/editor.astro').toString();
  const editor = read('src/scripts/editor/index.js').toString();
  assert.match(global, /@import '\.\/fonts.css'/);
  assert.match(page, /import '\.\.\/styles\/fonts.css'/);
  for (const text of [global, page, editor]) {
    assert.ok(text.includes('FiraMono Nerd Font'));
    assert.ok(!text.includes('Fira Code'));
  }
  assert.match(editor, /fontLigatures: false/);
  assert.match(editor, /remeasureFonts\(\)/);
  assert.match(global, /font-variant-ligatures: none/);
  assert.match(page, /font-variant-ligatures: none/);
});

test('redistribution notices and icon provenance remain available', () => {
  assert.match(
    read(`${directory}/LICENSE`).toString(),
    /Mozilla Foundation and Telefonica/,
  );
  assert.match(
    read(`${directory}/UPSTREAM-README.md`).toString(),
    /Font Logos.*unlicensed/,
  );
  assert.match(
    read(`${directory}/FONT-LOGOS-LICENSE`).toString(),
    /public domain/,
  );
  assert.match(
    read(`${directory}/NERD-FONTS-LICENSE`).toString(),
    /patched fonts/,
  );
});
