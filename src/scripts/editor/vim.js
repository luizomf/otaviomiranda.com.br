/** Vim is optional; a failed plugin must never prevent editing or saving. */
export async function setupVim(
  editor,
  { button, status, enabled, onChange, save },
) {
  try {
    const plugin = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Vim loading timed out.')),
        10_000,
      );
      window.require(
        ['monaco-vim'],
        module => {
          clearTimeout(timer);
          resolve(module);
        },
        error => {
          clearTimeout(timer);
          reject(error);
        },
      );
    });
    let mode;
    plugin.VimMode?.Vim?.map('jj', '<Esc>', 'insert');
    for (const [name, short] of [
      ['write', 'w'],
      ['wq', 'wq'],
    ]) {
      plugin.VimMode?.Vim?.defineEx(name, short, () => save());
    }
    const apply = value => {
      mode?.dispose();
      status.style.removeProperty('display');
      status.replaceChildren();
      // The plugin owns its status children, including command/search inputs.
      mode = value ? plugin.initVimMode(editor, status) : null;
      if (!value) status.textContent = 'Vim off';
      button.disabled = false;
      button.setAttribute('aria-pressed', String(value));
      button.querySelector('span').textContent = value ? 'On' : 'Off';
    };
    apply(enabled);
    button.addEventListener('click', () => {
      enabled = !enabled;
      apply(enabled);
      button.focus();
      onChange(enabled);
    });
  } catch {
    button.disabled = true;
    button.querySelector('span').textContent = 'Unavailable';
    status.textContent = 'Vim unavailable';
  }
}
