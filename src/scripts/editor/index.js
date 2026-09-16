import { createPreview } from './preview.js';
import { createDocuments } from './documents.js';
import { setupVim } from './vim.js';
import { setupScrollSync } from './scroll-sync.js';
import { setupSplitter } from './splitter.js';
import { loadPreferences, savePreferences } from './preferences.js';

const $ = id => document.getElementById(`editor-${id}`);
const shell = document.querySelector('.editor-shell');
const codePane = document.querySelector('.editor-pane--code');
const previewPane = document.querySelector('.editor-pane--preview');
const preview = $('preview');
const render = createPreview(preview);
let editor;
let layout = 'split';
let zen = false;
let renderTimer;
let documents;
let syncScroll = () => {};
const preferences = loadPreferences();

function setMenu(open, restoreFocus = false) {
  if (!open && $('menu').contains(document.activeElement)) restoreFocus = true;
  $('menu').hidden = !open;
  $('menu-toggle').setAttribute('aria-expanded', String(open));
  if (open) $('menu').querySelector('button:not(:disabled)')?.focus();
  if (restoreFocus) $('menu-toggle').focus();
}

$('menu-toggle').addEventListener('click', () => setMenu($('menu').hidden));
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.editor-menu-container')) setMenu(false);
});
document.addEventListener('focusin', () => {
  queueMicrotask(() => {
    if (!document.activeElement?.closest('.editor-menu-container'))
      setMenu(false);
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('menu').hidden) {
    event.preventDefault();
    setMenu(false, true);
  }
});

function setting(id, enabled) {
  const button = $(id);
  button.disabled = false;
  button.setAttribute('aria-pressed', String(enabled));
  button.querySelector('.editor-setting-state').textContent = enabled
    ? 'On'
    : 'Off';
}

function toggleWrap() {
  preferences.wrap = !preferences.wrap;
  editor.updateOptions({ wordWrap: preferences.wrap ? 'on' : 'off' });
  setting('wrap', preferences.wrap);
  savePreferences(preferences);
}

function status(message, error = false) {
  $('status').textContent = message;
  $('status').dataset.error = String(error);
}

function renderPreview() {
  if (editor && layout !== 'code') {
    render(editor.getValue())
      .then(syncScroll)
      .catch(() => status('Could not render preview.', true));
    syncScroll();
  }
}

function setLayout(value) {
  layout = value;
  shell.dataset.layout = value;
  codePane.hidden = value === 'preview';
  previewPane.hidden = value === 'code';
  for (const button of document.querySelectorAll('button[data-layout]')) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.layout === value),
    );
  }
  editor?.layout();
  renderPreview();
}

// Register early so a drop during CDN loading never navigates away.
let dragDepth = 0;
const isFileDrag = event =>
  [...(event.dataTransfer?.types || [])].includes('Files');
window.addEventListener('dragenter', event => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  dragDepth++;
  $('drop-overlay').hidden = false;
});
window.addEventListener('dragover', event => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = documents ? 'copy' : 'none';
});
window.addEventListener('dragleave', event => {
  if (!isFileDrag(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) $('drop-overlay').hidden = true;
});
window.addEventListener('dragend', () => {
  dragDepth = 0;
  $('drop-overlay').hidden = true;
});
window.addEventListener(
  'drop',
  event => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    dragDepth = 0;
    $('drop-overlay').hidden = true;
    if (!documents) {
      status('Editor is still loading. Try dropping the file again shortly.');
      return;
    }
    const files = [...event.dataTransfer.files];
    if (files.length !== 1) {
      status('Drop one Markdown or text file at a time.', true);
      return;
    }
    setMenu(false);
    documents.openFile(files[0]);
  },
  true,
);

function setZen(enabled) {
  zen = enabled;
  setMenu(false);
  shell.dataset.zen = String(enabled);
  $('zen').setAttribute('aria-pressed', String(enabled));
  $('zen-exit').hidden = !enabled;
  editor?.layout();
  if (layout === 'preview') preview.focus();
  else editor?.focus();
}

function loadMonaco() {
  return new Promise((resolve, reject) => {
    if (!window.require?.config)
      return reject(new Error('Monaco loader unavailable.'));
    const timer = setTimeout(
      () => reject(new Error('Monaco loading timed out.')),
      20_000,
    );
    window.require.config({
      paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.56.0/min/vs',
        'monaco-vim':
          'https://cdn.jsdelivr.net/npm/monaco-vim@0.4.4/dist/monaco-vim.umd',
      },
    });
    window.require(
      ['vs/editor/editor.main'],
      () => {
        clearTimeout(timer);
        // The Vim UMD build names its peer by the ESM path; reuse this Monaco instance.
        window.define(
          'monaco-editor/esm/vs/editor/editor.api',
          [],
          () => window.monaco,
        );
        resolve(window.monaco);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function boot() {
  const monaco = await loadMonaco();
  monaco.editor.defineTheme('workspace-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1c2028',
      'editorLineNumber.foreground': '#647084',
      'editorLineNumber.activeForeground': '#c3dfa0',
    },
  });
  editor = monaco.editor.create($('monaco'), {
    value: `# A little room to think

**A proper Markdown editor. A comfortable place to read. A little less noise.**

Draft a blog post. Clean up your notes. Read that impossibly long answer from your AI assistant. This is your space to turn a wall of text into something worth spending time with.

> Your words deserve better than a tiny text box.
>
> **Welcome to your Markdown workspace.**

---

## One document. Three ways to see it.

Some moments are for writing. Others are for stepping back and seeing the whole picture. Switch views without leaving your document.

| View | What you see | Made for |
| :--- | :---: | :--- |
| **Write** | Just the editor | Finding the words |
| **Split** | Editor + live preview | Watching an idea take shape |
| **Read** | Just the preview | Reading without distractions |

**Need more room on one side?** Drag the divider. Double-click it to return to an even split. Prefer the keyboard? Focus the divider and use the arrow keys; Enter resets it. On a small screen, the panes stack and the divider moves with them.

## Less interface. More ideas.

Open the menu and turn on **Zen mode**. The toolbar, panel headings, and footer disappear. Your document stays.

Zen works in **every view**. Pair it with your browser's full-screen mode for a workspace that is almost entirely words. A subtle **Exit zen** handle brings the controls back; Escape works too.

> No dashboard to manage. No panels fighting for attention.
>
> Just a little room to think.

## A real editor under the hood

Powered by **Monaco**, the editing engine behind VS Code. Not a dressed-up text area.

- **Word wrap** — let long lines breathe instead of scrolling sideways. Toggle it in the menu or press **Alt+Z**.
- **Find and replace** — including regular expressions, case matching, and whole-word search.
- **Undo and redo** — because writing is mostly rewriting.
- **Vim mode** — motions, search, and write commands for people whose fingers already know the way. Even **jj** leaves insert mode.
- **Frontmatter, on demand** — insert a starter block for your post without losing the ability to undo it.
- **Synchronized scrolling** — keep the preview alongside your source, or switch it off and explore each pane independently.

Your wrap, Vim, scroll-sync, preview-theme, and split-size preferences are remembered. Make yourself at home.

## Markdown with a little breathing room

Clear headings. Comfortable line lengths. Proper spacing. **Bold when it matters**, *a little emphasis when it helps*, and ~~the words you decided to leave behind~~.

### Give your ideas some structure

1. Start with the question you actually want to answer.
2. Write the rough version.
   - Keep the useful details.
   - Cut the impressive-sounding filler.
3. Read it as if someone else wrote it.
4. Make it simpler.

### Keep track of the small victories

- [x] Find a quieter place to write
- [x] Give the preview room to breathe
- [x] Stop fighting long lines
- [ ] Turn that half-finished idea into a finished post

Tables, quotes, nested lists, images, and syntax-highlighted code blocks all have a place here. Switch between a **light preview** and a **dark preview** whenever your eyes ask for a change.

---

## Your files, without the ceremony

**Drag a file anywhere onto the workspace to open it.** Markdown and plain text are welcome: **.md**, **.markdown**, and **.txt**, one file at a time, up to **10 MB**.

Or use **Open file** in the menu. Familiar shortcuts are here too:

| Action | Shortcut |
| :--- | :--- |
| Open file | **Cmd/Ctrl+O** |
| Save | **Cmd/Ctrl+S** |
| Save as | **Cmd/Ctrl+Shift+S** |
| Toggle word wrap | **Alt+Z** |
| Leave zen mode | **Escape** |

Dropped files open as **copies**: Save lets you choose a destination. In browsers that support direct file access, connected files can be saved back to disk and **autosaved every minute once write permission is granted**. Other browsers download a copy instead.

A small dot beside the filename tells you there are unsaved edits. Opening a different document will ask before discarding them. No quiet surprises.

## Local work. Clear boundaries.

No account to create. No document-upload step. Your Markdown is parsed and sanitized in the browser.

A few honest details:

- **Preferences are remembered; document contents are not.** Save your work before closing the tab.
- Editor libraries and optional syntax highlighting load from external CDNs, so this is not a guaranteed offline workspace.
- Images embedded in a document may load from external sites.
- Download-only browsers cannot confirm that a file reached your disk, so unsaved-edit warnings remain.
- Preview HTML is sanitized: your document is a document, not a place to run scripts.

---

## Start with one sentence.

A tutorial. A README. Tomorrow's post. The note you keep meaning to finish.

Choose **New document** from the menu, drop in something you already wrote, or simply replace these words with your own.

**The workspace is ready. The next idea is yours.**
`,
    language: 'markdown',
    theme: 'workspace-dark',
    fontSize: 14,
    fontFamily: '"FiraMono Nerd Font", "SFMono-Regular", Consolas, monospace',
    fontLigatures: false,
    lineHeight: 23,
    padding: { top: 20, bottom: 20 },
    minimap: { enabled: false },
    automaticLayout: true,
    wordWrap: preferences.wrap ? 'on' : 'off',
    lineNumbersMinChars: 3,
    scrollBeyondLastLine: false,
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
  });
  // Refresh Monaco's cached fallback metrics after the self-hosted face loads.
  document.fonts.load('14px "FiraMono Nerd Font"').then(
    () => monaco.editor.remeasureFonts(),
    () => {}, // Keep the usable system fallback if the font request fails.
  );
  editor.onDidChangeModelContent(() => {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderPreview, 120);
  });
  for (const button of document.querySelectorAll('button[data-layout]')) {
    button.addEventListener('click', () => setLayout(button.dataset.layout));
  }
  setupSplitter(shell, {
    value: preferences.split,
    onChange: value => {
      preferences.split = value;
      savePreferences(preferences);
    },
  });
  $('zen').disabled = false;
  $('zen').addEventListener('click', () => setZen(true));
  $('zen-exit').addEventListener('click', () => setZen(false));
  window.addEventListener(
    'keydown',
    event => {
      if (event.key === 'Escape' && zen) setZen(false);
    },
    true,
  );
  syncScroll = setupScrollSync(
    editor,
    preview,
    () => layout === 'split' && preferences.sync,
  );
  setting('sync', preferences.sync);
  $('sync').addEventListener('click', () => {
    preferences.sync = !preferences.sync;
    setting('sync', preferences.sync);
    savePreferences(preferences);
    syncScroll();
  });
  setting('wrap', preferences.wrap);
  $('wrap').addEventListener('click', toggleWrap);
  const applyPreviewTheme = () => {
    previewPane.dataset.theme = preferences.darkPreview ? 'dark' : 'light';
    setting('preview-theme', preferences.darkPreview);
  };
  applyPreviewTheme();
  $('preview-theme').addEventListener('click', () => {
    preferences.darkPreview = !preferences.darkPreview;
    applyPreviewTheme();
    savePreferences(preferences);
  });
  editor.addAction({
    id: 'workspace.wordWrap',
    label: 'Toggle Word Wrap',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
    run: toggleWrap,
  });
  documents = createDocuments(editor, state => {
    $('file').textContent = `${state.dirty ? '● ' : ''}${state.name}`;
    $('file').title = state.name;
    for (const id of ['new', 'open', 'save', 'save-as'])
      $(id).disabled = state.busy;
    status(state.message, state.error);
  });
  setupVim(editor, {
    button: $('vim-toggle'),
    status: $('vim-status'),
    enabled: preferences.vim,
    onChange: value => {
      preferences.vim = value;
      savePreferences(preferences);
    },
    save: () => documents.save(),
  });
  $('frontmatter').disabled = false;
  $('frontmatter').addEventListener('click', () => {
    setMenu(false);
    const value = editor.getValue();
    if (/^\uFEFF?---\r?\n/.test(value)) {
      status('This document already has frontmatter.');
      return;
    }
    const date = new Date().toLocaleDateString('sv-SE');
    const text = `---\ntitle: ''\ndescription: ''\ndate: ${date}\nauthor: 'Otávio Miranda'\n---\n\n`;
    editor.pushUndoStop();
    editor.executeEdits('frontmatter', [
      { range: new monaco.Range(1, 1, 1, 1), text },
    ]);
    editor.pushUndoStop();
    if (layout !== 'preview') editor.focus();
  });
  const open = () => {
    if (window.showOpenFilePicker) return documents.open();
    $('open-input').value = '';
    $('open-input').click();
  };
  for (const [id, action] of Object.entries({
    new: () => documents.new(),
    open,
    save: () => documents.save(),
    'save-as': () => documents.save(true),
  }))
    $(id).addEventListener('click', () => {
      setMenu(false);
      action();
    });
  $('open-input').addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) documents.openFile(file);
  });
  window.addEventListener(
    'keydown',
    event => {
      if (!(event.metaKey || event.ctrlKey)) return;
      const key = event.key.toLowerCase();
      if (key === 's') {
        event.preventDefault();
        documents.save(event.shiftKey);
      }
      if (key === 'o') {
        event.preventDefault();
        open();
      }
    },
    true,
  );
  window.addEventListener('beforeunload', event => {
    if (documents.dirty()) event.preventDefault();
  });
  let autosaveTimer = setInterval(() => documents.autosave(), 60_000);
  window.addEventListener('pagehide', () => {
    clearInterval(autosaveTimer);
    autosaveTimer = null;
  });
  window.addEventListener('pageshow', () => {
    if (!autosaveTimer)
      autosaveTimer = setInterval(() => documents.autosave(), 60_000);
  });
  renderPreview();
}

boot().catch(() =>
  status('Editor could not load. Check your connection and reload.', true),
);
