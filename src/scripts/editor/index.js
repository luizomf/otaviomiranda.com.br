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
    value:
      '# A little room to think\n\nOpen a Markdown file, or start writing here.\n\nYour words on the left. A little clarity on the right.\n\n## Make yourself at home\n\n- **Write**, **Split**, or **Read** — pick your view.\n- Drop a Markdown file anywhere to open it.\n- Find word wrap and Vim mode in the menu.\n\n> Less interface. More ideas.\n',
    language: 'markdown',
    theme: 'workspace-dark',
    fontSize: 14,
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
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
