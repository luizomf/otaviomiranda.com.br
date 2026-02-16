// import { codeToHtml } from "https://esm.run/shiki@3.22";
// const foo = document.getElementById("foo");
// foo.innerHTML = await codeToHtml(
//   `import logging
// import sys

// format1 = "%(levelname)s|%(name)s|%(asctime)s|%(message)s|%(filename)s|%(lineno)d"

// # Podemos criar nossos próprios handlers usando as classes que mencionei antes
// file_handler = logging.FileHandler(
//     filename="log.log",
//     mode="a",
//     encoding="utf-8",
// )
// stream_handler = logging.StreamHandler(sys.stdout)

// # Nossos handlers precisam de um formatter
// main_formatter = logging.Formatter(fmt=format1)

// # A configuração do formatter pode ser reutilizada.
// file_handler.setFormatter(main_formatter)
// stream_handler.setFormatter(main_formatter)

// # configura o root logger
// logging.basicConfig(handlers=[file_handler, stream_handler])

// # cria o meu logger
// logger = logging.getLogger("meuapp")
// # define o nível do meu log
// logger.setLevel(logging.DEBUG)

// # Saída nos dois handlers
// logger.debug("mensagem de log")
// logger.info("mensagem de log")
// logger.warning("mensagem de log")
// logger.error("mensagem de log")
// logger.critical("mensagem de log")

// # Exception
// try:
//     print(1 / 0)
// except ZeroDivisionError:
//     logger.exception("Alguém tentou dividir por zero aí.")console.log("Hi, Shiki on CDN :)")
// `,
//   {
//     lang: "python",
//     theme: "aurora-x"
//   }
// );

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
