(function () {
  const form = document.getElementById('main-search');
  const prepend = 'site:otaviomiranda.com.br';

  if (!form) return;

  const input = form.querySelector('input[name="q"]');

  form.addEventListener('submit', e => {
    const original = input.value;
    input.value = `${prepend} ${original}`;

    setTimeout(() => {
      form.submit();
      input.value = original;
    }, 0);

    e.preventDefault();
  });

  const options = {
    prefix: '',
  };

  if (typeof markedGfmHeadingId !== 'undefined') {
    marked.use(markedGfmHeadingId.gfmHeadingId({ prefix: '' }));
  }

  const markdownContent =
    document.getElementById('markdown-source').textContent;
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = marked.parse(markdownContent);

  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }
})();
