(function () {
  'use strict';

  var STORAGE_KEY = 'theme-mode';
  var root = document.documentElement;
  var toggle = document.getElementById('theme-mode');

  if (!toggle) return;

  var saved = localStorage.getItem(STORAGE_KEY);

  if (saved === 'dark') {
    root.classList.add('dark-mode');
    toggle.checked = true;
  }

  toggle.addEventListener('change', function () {
    var isDark = toggle.checked;

    if (isDark) {
      root.classList.add('dark-mode');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark-mode');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  });
})();
