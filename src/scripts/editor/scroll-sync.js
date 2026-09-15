/** Ratio-based scrolling, active only while both panes are visible. */
export function setupScrollSync(editor, preview, enabled) {
  let expectedEditorTop = null;
  let expectedPreviewTop = null;
  const progress = (top, height, viewport) =>
    Math.min(1, Math.max(0, top / Math.max(1, height - viewport)));
  const fromEditor = () => {
    if (!enabled()) return;
    const ratio = progress(
      editor.getScrollTop(),
      editor.getScrollHeight(),
      editor.getLayoutInfo().height,
    );
    expectedPreviewTop =
      ratio * Math.max(0, preview.scrollHeight - preview.clientHeight);
    preview.scrollTop = expectedPreviewTop;
    expectedPreviewTop = preview.scrollTop;
  };
  editor.onDidScrollChange(event => {
    if (!event.scrollTopChanged && !event.scrollHeightChanged) return;
    if (
      event.scrollTopChanged &&
      expectedEditorTop !== null &&
      Math.abs(editor.getScrollTop() - expectedEditorTop) < 1
    ) {
      expectedEditorTop = null;
      return;
    }
    expectedEditorTop = null;
    fromEditor();
  });
  editor.onDidLayoutChange(fromEditor);
  preview.addEventListener('scroll', () => {
    if (
      expectedPreviewTop !== null &&
      Math.abs(preview.scrollTop - expectedPreviewTop) < 1
    ) {
      expectedPreviewTop = null;
      return;
    }
    expectedPreviewTop = null;
    if (!enabled()) return;
    const ratio = progress(
      preview.scrollTop,
      preview.scrollHeight,
      preview.clientHeight,
    );
    expectedEditorTop =
      ratio *
      Math.max(0, editor.getScrollHeight() - editor.getLayoutInfo().height);
    editor.setScrollTop(expectedEditorTop);
  });
  return fromEditor;
}
