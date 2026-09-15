/** One resizable source share, adapted to side-by-side or stacked panes. */
export function setupSplitter(shell, { value, onChange }) {
  const divider = shell.querySelector('[role="separator"]');
  const panes = shell.querySelector('.editor-panes');
  const stacked = matchMedia('(max-width: 700px)');
  let pointer = null;
  const apply = next => {
    value = Math.min(80, Math.max(20, next));
    panes.style.setProperty('--code-size', `${value}fr`);
    panes.style.setProperty('--preview-size', `${100 - value}fr`);
    divider.setAttribute('aria-valuenow', String(Math.round(value)));
    divider.setAttribute(
      'aria-valuetext',
      `${Math.round(value)}% editor, ${Math.round(100 - value)}% preview`,
    );
  };
  const orientation = () =>
    divider.setAttribute(
      'aria-orientation',
      stacked.matches ? 'horizontal' : 'vertical',
    );
  orientation();
  stacked.addEventListener('change', orientation);
  apply(value);
  divider.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    divider.focus();
    pointer = event.pointerId;
    divider.setPointerCapture(pointer);
    shell.dataset.resizing = 'true';
  });
  divider.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    const bounds = panes.getBoundingClientRect();
    const extent = stacked.matches ? bounds.height : bounds.width;
    const offset = stacked.matches
      ? event.clientY - bounds.top
      : event.clientX - bounds.left;
    apply(((offset - 3.5) / Math.max(1, extent - 7)) * 100);
  });
  const finish = () => {
    if (pointer === null) return;
    pointer = null;
    shell.dataset.resizing = 'false';
    onChange(value);
  };
  divider.addEventListener('pointerup', finish);
  divider.addEventListener('pointercancel', finish);
  divider.addEventListener('lostpointercapture', finish);
  divider.addEventListener('dblclick', () => {
    apply(50);
    onChange(value);
  });
  divider.addEventListener('keydown', event => {
    const decrease = stacked.matches ? 'ArrowUp' : 'ArrowLeft';
    const increase = stacked.matches ? 'ArrowDown' : 'ArrowRight';
    const next = {
      [decrease]: value - 5,
      [increase]: value + 5,
      Home: 20,
      End: 80,
      Enter: 50,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    apply(next);
    onChange(value);
  });
}
