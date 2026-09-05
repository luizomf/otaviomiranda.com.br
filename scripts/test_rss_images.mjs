import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

// Build the real RSS endpoint in an isolated Astro site. The collection loader is
// a boundary fixture: RSS receives bodies without invoking the article renderer.
const repo = fileURLToPath(new URL('../', import.meta.url));
const root = await mkdtemp(join(tmpdir(), 'site-rss-test-'));
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1sAAAAASUVORK5CYII=',
  'base64',
);

const secondPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2"/></svg>';
const posts = [
  {
    id: '2026/first/text',
    filePath: 'src/content/posts/2026/first/text.md',
    data: {
      title: 'First',
      description: 'First post',
      date: '2026-01-01',
      author: 'Test',
      image: './images/missing-cover.png',
    },
    body: '# Heading\n\nBefore **bold**.\n\n<!-- private comment -->\n\n![Existing](./images/photo.png "Photo title")\n\n![Missing](./images/missing.png)\n\nAfter [link](https://example.test/page).\n\n`![Code](./images/code.png)`\n\n![External](https://unreachable.invalid/photo.jpg?size=2&mode=original)\n\n![Protocol relative](//unreachable.invalid/photo.jpg)\n\n![Public](/images/public.jpg)\n\n![Reference][picture]\n\n[picture]: images/photo.png',
  },
  {
    // The collection ID is not a filesystem path (case and spaces matter).
    id: 'unrelated-slug/text',
    filePath: 'src/content/posts/2026/Second Post/text.md',
    data: {
      title: 'Second',
      description: 'Second post',
      date: '2026-01-02',
      author: 'Test',
    },
    body: '![Second image](images/photo.png)\n\n![Missing here](images/only-first.png)\n\n![Parent path](../first/images/photo.png)\n\n![Nested SVG](./images/nested/icon.svg)\n\n![Query](./images/photo.png?v=1)\n\n![Encoded](./images/%70hoto.png)',
  },
];

async function put(path, contents) {
  const target = join(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

try {
  await symlink(join(repo, 'node_modules'), join(root, 'node_modules'));
  await put('package.json', '{"type":"module"}');
  await put(
    'astro.config.mjs',
    `globalThis.fetch = () => { throw new Error('Network access forbidden in RSS test'); };
     export default { site: 'https://example.test' };`,
  );
  await mkdir(join(root, 'src/pages'), { recursive: true });
  await cp(
    join(repo, 'src/pages/rss.xml.ts'),
    join(root, 'src/pages/rss.xml.ts'),
  );
  await cp(join(repo, 'src/utils'), join(root, 'src/utils'), {
    recursive: true,
  });
  await put('src/content/posts/2026/first/images/photo.png', png);
  await put('src/content/posts/2026/first/images/only-first.png', png);
  await put('src/content/posts/2026/Second Post/images/photo.png', secondPng);
  await put('src/content/posts/2026/Second Post/images/nested/icon.svg', svg);
  await put(
    'src/content.config.ts',
    `
    import { defineCollection } from 'astro:content';
    export const collections = {
      posts: defineCollection({
        loader: {
          name: 'rss-fixtures',
          async load({ store }) {
            for (const post of ${JSON.stringify(posts)}) {
              post.data.date = new Date(post.data.date);
              store.set(post);
            }
          },
        },
      }),
    };
  `,
  );
  execFileSync(
    process.execPath,
    [join(repo, 'node_modules/astro/bin/astro.mjs'), 'build', '--root', root],
    {
      cwd: root,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
      stdio: 'pipe',
      timeout: 60_000,
    },
  );
  const xml = load(await readFile(join(root, 'dist/rss.xml'), 'utf8'), {
    xml: true,
  });
  const items = xml('item').toArray();
  const item = title =>
    xml(items.find(entry => xml(entry).find('title').text() === title));
  const body = load(item('First').find('content\\:encoded').text());
  const secondBody = load(item('Second').find('content\\:encoded').text());
  const src = body('img[alt="Existing"]').attr('src');

  await test('existing relative image points to an actual Astro-emitted asset', async () => {
    assert.match(
      src ?? '',
      /^https:\/\/example\.test\/_astro\/photo\.[^/]+\.png$/,
    );
    assert.deepEqual(
      await readFile(resolve(root, 'dist', new URL(src).pathname.slice(1))),
      png,
    );
    assert.equal(body('img[alt="Existing"]').attr('title'), 'Photo title');
    assert.equal(body('img[alt="Reference"]').attr('src'), src);
  });
  await test('missing images alone are omitted from RSS', () => {
    assert.equal(body('img[alt="Missing"]').length, 0);
    assert.equal(secondBody('img[alt="Missing here"]').length, 0);
    assert.equal(item('First').find('description').text(), 'First post');
    assert.match(body.text(), /Before bold/);
    assert.match(body.text(), /After link/);
  });
  await test('source file path, not slug, selects each post image', async () => {
    const secondSrc = secondBody('img[alt="Second image"]').attr('src');
    assert.match(
      secondSrc ?? '',
      /^https:\/\/example\.test\/_astro\/photo\.[^/]+\.png$/,
    );
    assert.notEqual(secondSrc, src);
    assert.deepEqual(
      await readFile(
        resolve(root, 'dist', new URL(secondSrc).pathname.slice(1)),
      ),
      secondPng,
    );
    assert.equal(
      item('Second').find('link').text(),
      'https://example.test/unrelated-slug/',
    );
    assert.equal(xml(items[0]).find('title').text(), 'Second');
  });
  await test('nested assets and parent paths resolve inside the posts tree', async () => {
    assert.equal(secondBody('img[alt="Parent path"]').attr('src'), src);
    const svgSrc = secondBody('img[alt="Nested SVG"]').attr('src');
    assert.match(
      svgSrc ?? '',
      /^https:\/\/example\.test\/_astro\/icon\.[^/]+\.svg$/,
    );
    assert.equal(
      await readFile(
        resolve(root, 'dist', new URL(svgSrc).pathname.slice(1)),
        'utf8',
      ),
      svg,
    );
  });
  await test('unsupported query and encoded local references are omitted', () => {
    assert.equal(secondBody('img[alt="Query"]').length, 0);
    assert.equal(secondBody('img[alt="Encoded"]').length, 0);
  });
  await test('normal Markdown and comment stripping are preserved', () => {
    assert.equal(body('h1').text(), 'Heading');
    assert.equal(body('strong').text(), 'bold');
    assert.equal(body('a').attr('href'), 'https://example.test/page');
    assert.equal(body('code').text(), '![Code](./images/code.png)');
    assert.doesNotMatch(body.html(), /private comment/);
  });
  await test('external and public images retain their URLs without fetching', () => {
    assert.equal(
      body('img[alt="External"]').attr('src'),
      'https://unreachable.invalid/photo.jpg?size=2&mode=original',
    );
    assert.equal(
      body('img[alt="Protocol relative"]').attr('src'),
      '//unreachable.invalid/photo.jpg',
    );
    assert.equal(body('img[alt="Public"]').attr('src'), '/images/public.jpg');
  });
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  await rm(root, { recursive: true, force: true });
}
