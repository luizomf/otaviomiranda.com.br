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
})();
