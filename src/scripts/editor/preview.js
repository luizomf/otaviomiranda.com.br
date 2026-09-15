import { marked } from 'marked';
import DOMPurify from 'dompurify';

const SHIKI_URL = 'https://esm.sh/shiki@3.14.0?bundle';
let highlighterPromise;

function getHighlighter() {
  return (highlighterPromise ??= import(/* @vite-ignore */ SHIKI_URL)
    .then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['github-dark'],
        langs: [
          'plaintext',
          'bash',
          'javascript',
          'typescript',
          'jsx',
          'tsx',
          'json',
          'python',
          'html',
          'css',
          'yaml',
          'markdown',
          'sql',
          'nginx',
          'xml',
          'apache',
          'ssh-config',
        ],
      }),
    )
    .catch(() => null));
}

/** Own rendering and async highlighting; stale results never replace a newer document. */
export function createPreview(element) {
  let revision = 0;
  return async markdown => {
    const current = ++revision;
    const source = markdown
      .replace(/^\uFEFF/, '')
      .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
    element.innerHTML = DOMPurify.sanitize(marked.parse(source), {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'form', 'button', 'textarea', 'select'],
      FORBID_ATTR: ['style', 'id', 'name'],
    });
    for (const input of element.querySelectorAll('input')) {
      if (input.type === 'checkbox') input.disabled = true;
      else input.remove();
    }
    // Preview navigation must not replace the workspace and lose the document.
    for (const link of element.querySelectorAll('a[href]')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    const blocks = [...element.querySelectorAll('pre > code')];
    if (!blocks.length) return;
    const highlighter = await getHighlighter();
    if (!highlighter || revision !== current) return;
    for (const code of blocks) {
      const language =
        [...code.classList]
          .find(value => value.startsWith('language-'))
          ?.slice(9) || 'plaintext';
      const lang = highlighter.getLoadedLanguages().includes(language)
        ? language
        : 'plaintext';
      const template = document.createElement('template');
      template.innerHTML = highlighter.codeToHtml(code.textContent || '', {
        lang,
        theme: 'github-dark',
      });
      code.parentElement.replaceWith(template.content);
    }
  };
}
