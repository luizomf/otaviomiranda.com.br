const FILE_TYPES = [
  {
    description: 'Markdown or text',
    accept: { 'text/markdown': ['.md', '.markdown'], 'text/plain': ['.txt'] },
  },
];

/** Own file identity, saved snapshots and serialized IO, including download fallback. */
export function createDocuments(editor, onState) {
  let name = 'untitled.md';
  let handle = null;
  let savedContent = editor.getValue();
  let busy = false;
  const dirty = () => editor.getValue() !== savedContent;
  const report = (message, error = false) =>
    onState({
      name,
      dirty: dirty(),
      busy,
      error,
      message:
        message ||
        (busy
          ? 'Working…'
          : dirty()
            ? 'Unsaved changes'
            : handle
              ? 'Saved · file connected'
              : 'No unsaved changes'),
    });
  const discard = () =>
    !dirty() ||
    window.confirm('Discard unsaved changes and replace this document?');

  async function run(action) {
    if (busy) {
      report('A file operation is already in progress.');
      return;
    }
    busy = true;
    report();
    let message;
    let error = false;
    try {
      message = await action();
    } catch (cause) {
      if (cause?.name !== 'AbortError') {
        message =
          'File operation failed. Your edits are still here; try Save as.';
        error = true;
      }
    } finally {
      busy = false;
      report(message, error);
    }
  }

  async function readFile(file, nextHandle = null) {
    if (!/\.(md|markdown|txt)$/i.test(file.name))
      return 'Choose a .md, .markdown or .txt file.';
    if (file.size > 10 * 1024 * 1024)
      return 'This file is too large. The limit is 10 MB.';
    const text = await file.text();
    // Check after the read: the user may have typed while IO was pending.
    if (!discard()) return;
    handle = nextHandle;
    name = file.name;
    editor.setValue(text);
    // Monaco normalizes mixed line endings; loading is not an edit to autosave.
    savedContent = editor.getValue();
    editor.setPosition({ lineNumber: 1, column: 1 });
    editor.setScrollTop(0);
    return handle
      ? 'File opened · autosave after write permission is granted'
      : 'Opened a copy · Save to choose a destination';
  }

  async function writeFile(target, content) {
    const writable = await target.createWritable();
    try {
      await writable.write(content);
      await writable.close();
    } catch (error) {
      try {
        await writable.abort();
      } catch {
        /* Preserve the original failure. */
      }
      throw error;
    }
    savedContent = content;
  }

  function download(content) {
    const url = URL.createObjectURL(
      new Blob([content], { type: 'text/markdown;charset=utf-8' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = /\.(md|markdown|txt)$/i.test(name) ? name : `${name}.md`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    // A download request is not proof that the browser saved the file.
    return 'Download requested · confirm it in your browser';
  }

  const documents = {
    dirty,
    refresh: () => report(),
    openFile: file => run(() => readFile(file)),
    open: () =>
      run(async () => {
        const [nextHandle] = await window.showOpenFilePicker({
          multiple: false,
          types: FILE_TYPES,
        });
        return readFile(await nextHandle.getFile(), nextHandle);
      }),
    new: () =>
      run(async () => {
        if (!discard()) return;
        handle = null;
        name = 'untitled.md';
        savedContent = '';
        editor.setValue('');
        return 'New document';
      }),
    save: (saveAs = false) =>
      run(async () => {
        if (!window.showSaveFilePicker) return download(editor.getValue());
        let target = handle;
        if (saveAs || !target) {
          target = await window.showSaveFilePicker({
            suggestedName: name,
            types: FILE_TYPES,
          });
        }
        const content = editor.getValue();
        await writeFile(target, content);
        handle = target;
        name = target.name || name;
        return dirty()
          ? 'Saved snapshot · newer edits are unsaved'
          : 'Saved · autosave every minute';
      }),
    autosave: async () => {
      if (busy || !handle || !dirty()) return;
      await run(async () => {
        // Never trigger a permission prompt from a background timer.
        if (
          (await handle.queryPermission({ mode: 'readwrite' })) !== 'granted'
        ) {
          return 'Unsaved changes · Save to grant file write permission';
        }
        await writeFile(handle, editor.getValue());
        return dirty()
          ? 'Saved snapshot · newer edits are unsaved'
          : 'Autosaved';
      });
    },
  };
  editor.onDidChangeModelContent(() => report());
  report();
  return documents;
}
