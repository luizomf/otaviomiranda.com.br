import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function dropFile(page: Page, name: string, text: string) {
  await page.locator('.editor-shell').evaluate(
    (element, file) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(
        new File([file.text], file.name, { type: 'text/plain' }),
      );
      element.dispatchEvent(
        new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer,
        }),
      );
    },
    { name, text },
  );
}

test('writer can drop a Markdown file to open it without navigating away', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(
    page,
    'notes.md',
    '# Dropped notes\n\nA file from the desktop.',
  );
  await expect(page.locator('#editor-file')).toHaveText('notes.md');
  await expect(page.locator('#editor-preview h1')).toHaveText('Dropped notes');
  await expect(page).toHaveURL(/\/editor\/$/);
});

async function openMenu(page: Page) {
  await page.getByRole('button', { name: 'Editor menu', exact: true }).click();
}

test('reader gets contained rich Markdown and a persistent dark preview', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(
    page,
    'rich.md',
    '# Heading\n\n> A useful quotation.\n\n| Name | Notes |\n| --- | --- |\n| Example | A table cell |\n\n```js\nconst greeting = "Hello";\n```\n\n' +
      'long-link-'.repeat(80),
  );
  await openMenu(page);
  const dark = page.getByRole('button', { name: /Dark preview/ });
  await dark.click({ timeout: 2000 });
  await expect(page.locator('.editor-pane--preview')).toHaveAttribute(
    'data-theme',
    'dark',
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Preview only', exact: true }).click();
  await expect(page.locator('#editor-preview blockquote')).toHaveCSS(
    'border-left-style',
    'solid',
  );
  await expect(page.locator('#editor-preview pre')).toHaveCSS(
    'overflow-x',
    'auto',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const fits = await page
    .locator('#editor-preview')
    .evaluate(el => el.scrollWidth <= el.clientWidth);
  expect(fits).toBe(true);
  await page.reload();
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await expect(page.locator('.editor-pane--preview')).toHaveAttribute(
    'data-theme',
    'dark',
  );
});

test('writer can enable word wrap and keep that preference after reload', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(page, 'wrap.md', 'A long line of Markdown. '.repeat(100));
  await expect(page.locator('.view-line')).toHaveCount(1);
  await openMenu(page);
  const wrap = page.getByRole('button', { name: /Word wrap/ });
  await wrap.click({ timeout: 2000 });
  await expect(wrap).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() => page.locator('.view-line').count())
    .toBeGreaterThan(1);
  await page.reload();
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  await expect(wrap).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('#editor-menu')).toBeHidden();
  await expect(
    page.getByRole('button', { name: 'Editor menu', exact: true }),
  ).toBeFocused();
});

test('writer keeps Vim motions and can insert undoable frontmatter', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  const vim = page.getByRole('button', { name: /Vim mode/ });
  await expect(vim).toBeEnabled();
  await expect(vim).toHaveAttribute('aria-pressed', 'true');
  await vim.click();
  await expect(vim).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  await openMenu(page);
  await page
    .getByRole('button', { name: 'Insert frontmatter', exact: true })
    .click();
  await expect(page.locator('.view-lines')).toContainText('author:');
  await page.getByRole('textbox', { name: 'Editor content' }).focus();
  await page.keyboard.press('ControlOrMeta+z');
  await expect(page.locator('#editor-file')).toHaveText('untitled.md');
  await openMenu(page);
  await vim.click();
  await page.keyboard.press('Escape');
  await page.getByRole('textbox', { name: 'Editor content' }).focus();
  await page.keyboard.press('i');
  await page.keyboard.type('# Vim works');
  await page.keyboard.press('Escape');
  await expect(page.locator('#editor-preview h1')).toHaveText('Vim works');
});

test('reader can disable synchronized scrolling and read independently', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(
    page,
    'long.md',
    Array.from(
      { length: 100 },
      (_, i) => `## Section ${i + 1}\n\nParagraph ${i + 1}.\n`,
    ).join('\n'),
  );
  await expect(page.locator('#editor-preview h2').last()).toHaveText(
    'Section 100',
  );
  await page.locator('#editor-preview').evaluate(el => {
    el.scrollTop = el.scrollHeight;
  });
  await expect(page.locator('.view-lines')).toContainText('Paragraph 100.');
  await openMenu(page);
  await page.getByRole('button', { name: /Sync scrolling/ }).click();
  await page.keyboard.press('Escape');
  await page.locator('#editor-preview').evaluate(el => {
    el.scrollTop = 0;
  });
  await expect(page.locator('.view-lines')).toContainText('Paragraph 100.');
});

test('unsaved edits survive cancelled replacement and invalid drops', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  await page.getByRole('button', { name: /Vim mode/ }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('textbox', { name: 'Editor content' }).focus();
  await page.keyboard.type('Unsaved thought');
  await expect(page.locator('#editor-file')).toContainText('●');
  page.on('dialog', dialog => dialog.dismiss());
  await dropFile(page, 'replacement.md', '# Replacement');
  await expect(page.locator('#editor-preview')).toContainText(
    'Unsaved thought',
  );
  await dropFile(page, 'image.png', 'not Markdown');
  await expect(page.getByRole('status')).toContainText('Choose a .md');
  await expect(page.locator('#editor-preview')).toContainText(
    'Unsaved thought',
  );
  await page.locator('.editor-shell').evaluate(el => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File(['one'], 'one.md'));
    dataTransfer.items.add(new File(['two'], 'two.md'));
    el.dispatchEvent(
      new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }),
    );
  });
  await expect(page.getByRole('status')).toContainText('one Markdown');
  await openMenu(page);
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  await expect(page.locator('#editor-preview')).toContainText(
    'Unsaved thought',
  );
});

test('preview sanitizes hostile HTML while preserving Markdown formatting', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(
    page,
    'hostile.md',
    `---\ntitle: Secret frontmatter\n---\n# Safe heading\n\n<script>document.title='PWNED'</script>\n<img src=x onerror="document.title='PWNED'">\n<a href="javascript:alert(1)">Bad link</a>\n<style>body { display: none }</style>\n<form id="editor-shell"><input name="anything"><button>Submit</button></form>\n\n- [x] Done\n\n**Safe bold**\n\n\`\`\`html\n<script>alert('shown as text')</script>\n\`\`\``,
  );
  const preview = page.locator('#editor-preview');
  await expect(preview.locator('h1')).toHaveText('Safe heading');
  await expect(preview).not.toContainText('Secret frontmatter');
  await expect(
    preview.locator(
      'script, style, form, button, [onerror], [id], [name], a[href^="javascript:"]',
    ),
  ).toHaveCount(0);
  await expect(preview.locator('strong')).toHaveText('Safe bold');
  await expect(preview.locator('input[type=checkbox]')).toBeDisabled();
  await expect(preview.locator('pre code')).toContainText(
    "<script>alert('shown as text')</script>",
  );
  await expect(page).not.toHaveTitle('PWNED');
});

test('browser without file pickers can open and download a Markdown copy', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'showOpenFilePicker', { value: undefined });
    Object.defineProperty(window, 'showSaveFilePicker', { value: undefined });
  });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: /Open file/ }).click();
  await (
    await chooser
  ).setFiles({
    name: 'fallback.markdown',
    mimeType: 'text/markdown',
    buffer: Buffer.from('# Fallback file'),
  });
  await expect(page.locator('#editor-preview h1')).toHaveText('Fallback file');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe('fallback.markdown');
  expect(await readFile((await download.path())!, 'utf8')).toBe(
    '# Fallback file',
  );
  await expect(page.getByRole('status')).toContainText('Download requested');
});

test('saving a snapshot does not mark edits made during the write as saved', async ({
  page,
}) => {
  let finishWrite: (() => void) | undefined;
  let written = '';
  await page.exposeFunction('testWrite', async (content: string) => {
    written = content;
    await new Promise<void>(resolve => {
      finishWrite = resolve;
    });
  });
  await page.addInitScript(() => {
    (window as any).showSaveFilePicker = async () => ({
      name: 'saved.md',
      createWritable: async () => ({
        write: (content: string) => (window as any).testWrite(content),
        close: async () => {},
        abort: async () => {},
      }),
      queryPermission: async () => 'granted',
    });
  });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(page, 'snapshot.md', '# Snapshot');
  await openMenu(page);
  await page.getByRole('button', { name: /Vim mode/ }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect.poll(() => written).toBe('# Snapshot');
  await expect(
    page.getByRole('button', { name: 'Save', exact: true }),
  ).toBeDisabled();
  await page.getByRole('textbox', { name: 'Editor content' }).focus();
  await page.keyboard.type('Newer ');
  finishWrite!();
  await expect(page.locator('#editor-file')).toHaveText('● saved.md');
  await expect(page.getByRole('status')).toContainText(
    'newer edits are unsaved',
  );
  expect(written).toBe('# Snapshot');
});

test('native file open, manual save and permission-aware autosave keep working', async ({
  page,
}) => {
  const writes: string[] = [];
  await page.exposeFunction('testWrite', (content: string) => {
    writes.push(content);
  });
  await page.addInitScript(() => {
    const handle = {
      name: 'native.md',
      getFile: async () => new File(['# Native file'], 'native.md'),
      createWritable: async () => ({
        write: (content: string) => (window as any).testWrite(content),
        close: async () => {},
        abort: async () => {},
      }),
      queryPermission: async () => 'granted',
    };
    (window as any).showOpenFilePicker = async () => [handle];
    // Accelerate the browser's minute timer without faking Monaco's animation clock.
    const nativeSetInterval = window.setInterval.bind(window);
    window.setInterval = (
      callback: TimerHandler,
      delay?: number,
      ...args: any[]
    ) => nativeSetInterval(callback, delay === 60_000 ? 1000 : delay, ...args);
  });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  await page.getByRole('button', { name: /Vim mode/ }).click();
  await page.getByRole('button', { name: /Open file/ }).click();
  await expect(page.locator('#editor-preview h1')).toHaveText('Native file');
  await page.getByRole('textbox', { name: 'Editor content' }).focus();
  await page.keyboard.type('First ');
  await page.keyboard.press('ControlOrMeta+s');
  await expect(page.locator('#editor-file')).toHaveText('native.md');
  expect(writes).toEqual(['First # Native file']);
  await page.keyboard.type('Second ');
  await expect(page.locator('#editor-file')).toContainText('●');
  await expect(page.locator('#editor-file')).toHaveText('native.md');
  expect(writes).toEqual(['First # Native file', 'First Second # Native file']);
});

test('failed saving reports the error and leaves the document available', async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).showSaveFilePicker = async () => ({
      name: 'failed.md',
      createWritable: async () => {
        throw new DOMException('Denied', 'NotAllowedError');
      },
    });
  });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(page, 'safe.md', '# Keep this');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('File operation failed');
  await expect(page.locator('#editor-preview h1')).toHaveText('Keep this');
  await expect(page.locator('#editor-file')).toHaveText('safe.md');
  await expect(
    page.getByRole('button', { name: 'Save', exact: true }),
  ).toBeEnabled();
});

test('mobile layouts and menu stay inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  await expect(page.locator('#editor-menu')).toBeInViewport();
  await page.keyboard.press('Escape');
  for (const name of ['Preview only', 'Editor only', 'Split view']) {
    await page.getByRole('button', { name, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test('failed Monaco loading leaves an actionable error instead of a silent blank', async ({
  page,
}) => {
  await page.route('**/monaco-editor@*/min/vs/loader.js', route =>
    route.abort(),
  );
  await page.goto('/editor/');
  await expect(page.getByRole('status')).toContainText('Editor could not load');
  await expect(
    page.getByRole('button', { name: 'Save', exact: true }),
  ).toBeDisabled();
  await dropFile(page, 'loading.md', '# Not yet');
  await expect(page).toHaveURL(/\/editor\/$/);
});

test('zen mode hides chrome in every layout and always offers an exit', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  for (const layout of ['Split view', 'Editor only', 'Preview only']) {
    await page.getByRole('button', { name: layout, exact: true }).click();
    await openMenu(page);
    await page
      .getByRole('button', { name: /Zen mode/ })
      .click({ timeout: 2000 });
    await expect(page.locator('.editor-toolbar')).toBeHidden();
    await expect(page.locator('.editor-statusbar')).toBeHidden();
    await expect(page.locator('.editor-pane-heading').first()).toBeHidden();
    await expect(page.locator('.editor-pane-heading').last()).toBeHidden();
    const exit = page.getByRole('button', {
      name: 'Exit zen mode',
      exact: true,
    });
    await expect(exit).toBeVisible();
    if (layout === 'Editor only') await page.keyboard.press('Escape');
    else await exit.click();
    await expect(page.locator('.editor-toolbar')).toBeVisible();
    await expect(
      page.getByRole('button', { name: layout, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
  }
});

test('split panels resize by dragging or keyboard, including in zen mode', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  const divider = page.getByRole('separator', {
    name: 'Resize editor and preview',
  });
  await expect(divider).toBeVisible();
  const bounds = (await divider.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(950, bounds.y + bounds.height / 2, { steps: 8 });
  await page.mouse.up();
  expect(
    (await page.locator('.editor-pane--code').boundingBox())!.width,
  ).toBeGreaterThan(900);
  await divider.focus();
  await page.keyboard.press('Home');
  await expect(divider).toHaveAttribute('aria-valuenow', '20');
  await page.keyboard.press('Enter');
  await expect(divider).toHaveAttribute('aria-valuenow', '50');
  await openMenu(page);
  await page.getByRole('button', { name: /Zen mode/ }).click();
  await divider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(divider).toHaveAttribute('aria-valuenow', '55');
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(divider).toHaveAttribute('aria-valuenow', '55');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  await divider.focus();
  await page.keyboard.press('ArrowUp');
  await expect(divider).toHaveAttribute('aria-valuenow', '50');
});

test('Vim search and write commands work in normal and zen layouts', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'showSaveFilePicker', { value: undefined });
  });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  await expect(page.getByRole('button', { name: /Vim mode/ })).toBeEnabled();
  await page.keyboard.press('Escape');
  await dropFile(page, 'vim.md', '# Search me\n\nA second line.');
  for (const zen of [false, true]) {
    if (zen) {
      await openMenu(page);
      await page.getByRole('button', { name: /Zen mode/ }).click();
    }
    await page.locator('.view-lines').click({ position: { x: 160, y: 12 } });
    await page.keyboard.type('/');
    const command = page.locator('#editor-vim-status input');
    await expect(command).toBeVisible();
    await expect(command).toBeFocused();
    await page.keyboard.type('second');
    await page.keyboard.press('Enter');
    await expect(command).toHaveCount(0);
    await page.keyboard.type(':');
    await expect(command).toBeVisible();
    await expect(command).toBeFocused();
    const downloaded = page.waitForEvent('download');
    await page.keyboard.type('w');
    await page.keyboard.press('Enter');
    const download = await downloaded;
    expect(await readFile((await download.path())!, 'utf8')).toBe(
      '# Search me\n\nA second line.',
    );
    await expect(command).toHaveCount(0);
  }
});

test('opening mixed line endings stays clean until the writer edits', async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).showOpenFilePicker = async () => [
      {
        name: 'mixed.md',
        getFile: async () =>
          new File(['# Mixed\r\n\nOne\r\nTwo\n'], 'mixed.md'),
        queryPermission: async () => 'granted',
      },
    ];
  });
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  await page.getByRole('button', { name: /Open file/ }).click();
  await expect(page.locator('#editor-preview h1')).toHaveText('Mixed');
  await expect(page.locator('#editor-file')).toHaveText('mixed.md');
  await dropFile(page, 'copy.md', '# Copy\r\n\nOne\r\nTwo\n');
  await expect(page.locator('#editor-preview h1')).toHaveText('Copy');
  await expect(page.locator('#editor-file')).toHaveText('copy.md');
});

test('Markdown tables preserve explicit column alignment', async ({ page }) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await dropFile(
    page,
    'table.md',
    '| Left | Center | Right |\n| :--- | :---: | ---: |\n| a | b | c |',
  );
  await expect(page.locator('#editor-preview th').nth(1)).toHaveCSS(
    'text-align',
    'center',
  );
  await expect(page.locator('#editor-preview td').nth(2)).toHaveCSS(
    'text-align',
    'right',
  );
});

test('an invalid search regex can be corrected without an obstructed input', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await openMenu(page);
  await expect(page.getByRole('button', { name: /Vim mode/ })).toBeEnabled();
  await page.keyboard.press('Escape');
  await page.locator('.view-lines').click({ position: { x: 180, y: 32 } });
  await page.keyboard.press('ControlOrMeta+f');
  await page.getByRole('checkbox', { name: /Use Regular Expression/ }).click();
  const find = page.getByRole('textbox', { name: 'Find', exact: true });
  await find.fill('(');
  await expect(find).toHaveAttribute('aria-invalid', 'true');
  await find.click();
  await find.fill('think');
  await expect(find).toHaveValue('think');
  await expect(find).not.toHaveAttribute('aria-invalid', 'true');
});

test('reader can switch between preview, editor and split layouts', async ({
  page,
}) => {
  await page.goto('/editor/');
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await page.getByRole('button', { name: 'Preview only', exact: true }).click();
  await expect(page.locator('#editor-monaco')).toBeHidden();
  await expect(page.locator('#editor-preview')).toBeVisible();
  await page.getByRole('button', { name: 'Editor only', exact: true }).click();
  await expect(page.locator('#editor-monaco')).toBeVisible();
  await expect(page.locator('#editor-preview')).toBeHidden();
  await page.getByRole('button', { name: 'Split view', exact: true }).click();
  await expect(page.locator('#editor-monaco')).toBeVisible();
  await expect(page.locator('#editor-preview')).toBeVisible();
});
