import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`site loads full local fonts at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const fonts: string[] = [];
    page.on('request', request => {
      if (request.resourceType() === 'font') fonts.push(request.url());
    });
    await page.goto('/');
    const faces = await page.evaluate(async () => {
      const loaded = await Promise.all(
        [400, 500, 700].map(weight =>
          document.fonts.load(
            `${weight} 19px "FiraMono Nerd Font"`,
            'ação → \uf120',
          ),
        ),
      );
      return loaded.map(group => group.map(face => face.status));
    });
    expect(faces).toEqual([['loaded'], ['loaded'], ['loaded']]);
    await expect(page.locator('body')).toHaveCSS('font-size', '19px');
    await expect(page.locator('body')).toHaveCSS(
      'font-variant-ligatures',
      'none',
    );
    expect(
      await page
        .locator('body')
        .evaluate(el => getComputedStyle(el).fontFamily),
    ).toContain('FiraMono Nerd Font');
    expect(fonts.length).toBeGreaterThanOrEqual(3);
    for (const url of fonts) {
      expect(new URL(url).origin).toBe(new URL(page.url()).origin);
      expect(new URL(url).pathname).toMatch(/^\/fonts\/fira-mono-nerd\//);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test('editor code uses the local font with ligatures disabled', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await page.evaluate(() => document.fonts.load('14px "FiraMono Nerd Font"'));
  const lines = page.locator('.monaco-editor .view-lines').first();
  await expect(lines).toHaveCSS('font-size', '14px');
  expect(await lines.evaluate(el => getComputedStyle(el).fontFamily)).toContain(
    'FiraMono Nerd Font',
  );
  expect(
    await lines.evaluate(el => getComputedStyle(el).fontFeatureSettings),
  ).toContain('"liga" 0');
  await page.locator('.editor-shell').evaluate(element => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(
      new File(['```js\nconst equal = a === b;\n```'], 'font.md', {
        type: 'text/plain',
      }),
    );
    element.dispatchEvent(
      new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }),
    );
  });
  const code = page.locator('#editor-preview code').first();
  await expect(code).toHaveCSS('font-variant-ligatures', 'none');
  expect(await code.evaluate(el => getComputedStyle(el).fontFamily)).toContain(
    'FiraMono Nerd Font',
  );
});
