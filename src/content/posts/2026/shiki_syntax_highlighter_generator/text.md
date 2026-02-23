---
title: 'Shiki - Syntax highlighter'
description:
  'For my personal use. I just want the end HTML and CSS for Shiki Syntax
  highlighter (Not the JavaScript). This would be only for pure static sites.'
date: 2026-02-20
author: 'Luiz Otávio Miranda'
---

<p>
  For my personal use. I just want the end HTML and CSS from
  <a rel="nofollow noopener noreferrer" href="https://shiki.matsu.io/"
    >Shiki Syntax highlighter</a
  >
  (Not the JavaScript). This would be only for pure static sites.
</p>

<div class="form">
  <div class="form-row">
    <label for="shiki-language">Language:</label>
    <select id="shiki-language" class="shiki-language"></select>
  </div>

  <div class="form-row">
    <label for="shiki-theme">Theme:</label>
    <select id="shiki-theme" class="shiki-theme"></select>
  </div>

  <div class="form-row">
    <textarea
      id="textarea-code"
      placeholder="Place your code here."
    ></textarea>
  </div>

  <div class="form-row form-row-submit">
    <div class="link-container">
      <div class="link-bg-blur"></div>
      <div class="link-bg"></div>
      <button id="get-code" type="submit" class="link">Get code</button>
    </div>
  </div>
</div>

<p>Your beautiful code will be available below.</p>

<div id="shiki-result"></div>

<script>

(function () {
    'use strict';

    const languages = [
        'AppleScript',
        'AsciiDoc',
        'asm',
        'Astro',
        'AWK',
        'Ballerina',
        'Beancount',
        'Berry',
        'BibTeX',
        'Bicep',
        'Blade',
        'C',
        'C3',
        'Cadence',
        'Cairo',
        'Clarity',
        'Clojure',
        'CMake',
        'COBOL',
        'CODEOWNERS',
        'CodeQL',
        'CoffeeScript',
        'Coq',
        'CSS',
        'CSV',
        'CUE',
        'Cypher',
        'D',
        'Dart',
        'DAX',
        'Desktop',
        'Diff',
        'Dockerfile',
        'dotEnv',
        'Edge',
        'Elixir',
        'Elm',
        'ERB',
        'Erlang',
        'Fennel',
        'Fish',
        'Fluent',
        'GDResource',
        'GDScript',
        'GDShader',
        'Genie',
        'Gherkin',
        'Gleam',
        'GLSL',
        'GN',
        'Gnuplot',
        'Go',
        'GraphQL',
        'Groovy',
        'Hack',
        'Handlebars',
        'Haskell',
        'Haxe',
        'Hjson',
        'HLSL',
        'HTML',
        'HTTP',
        'Hurl',
        'HXML',
        'Hy',
        'Imba',
        'INI',
        'Java',
        'JavaScript',
        'Jinja',
        'Jison',
        'JSON',
        'JSON5',
        'JSONc',
        'JSONl',
        'Jsonnet',
        'JSSM',
        'JSX',
        'Julia',
        'KDL',
        'Kotlin',
        'Kusto',
        'LaTeX',
        'Lean4',
        'Less',
        'Liquid',
        'Logo',
        'Lua',
        'Luau',
        'Makefile',
        'Markdown',
        'Marko',
        'MATLAB',
        'MDC',
        'MDX',
        'Mermaid',
        'Mojo',
        'MoonBit',
        'Move',
        'Nextflow',
        'Nginx',
        'Nim',
        'Nix',
        'nushell',
        'OCaml',
        'Odin',
        'OpenSCAD',
        'Pascal',
        'Perl',
        'PHP',
        'Pkl',
        'Polar',
        'PostCSS',
        'PowerQuery',
        'PowerShell',
        'Prisma',
        'Prolog',
        'Pug',
        'Puppet',
        'PureScript',
        'Python',
        'QML',
        'R',
        'Racket',
        'Raku',
        'RegExp',
        'Rel',
        'RON',
        'Ruby',
        'Rust',
        'SAS',
        'Sass',
        'Scala',
        'Scheme',
        'SCSS',
        'ShaderLab',
        'Shell',
        'Smalltalk',
        'Solidity',
        'SPARQL',
        'SQL',
        'SSH-Config',
        'Stata',
        'Stylus',
        'SurrealQL',
        'Svelte',
        'Swift',
        'Systemd',
        'TalonScript',
        'Tasl',
        'Tcl',
        'Templ',
        'Terraform',
        'TeX',
        'TOML',
        'ts-tags',
        'TSV',
        'TSX',
        'Turtle',
        'Twig',
        'TypeScript',
        'TypeSpec',
        'Typst',
        'V',
        'Vala',
        'Verilog',
        'VHDL',
        'Viml',
        'Vue',
        'Vue-HTML',
        'Vue-Vine',
        'Vyper',
        'wasm',
        'Wenyan',
        'WGSL',
        'Wikitext',
        'Wolfram',
        'XML',
        'XSL',
        'YAML',
        'ZenScript',
        'Zig',
    ];

    const themes = [
        'andromeeda',
        'aurora-x',
        'ayu-dark',
        'ayu-light',
        'ayu-mirage',
        'catppuccin-frappe',
        'catppuccin-latte',
        'catppuccin-macchiato',
        'catppuccin-mocha',
        'dark-plus',
        'dracula',
        'dracula-soft',
        'everforest-dark',
        'everforest-light',
        'github-dark',
        'github-dark-default',
        'github-dark-dimmed',
        'github-dark-high-contrast',
        'github-light',
        'github-light-default',
        'github-light-high-contrast',
        'gruvbox-dark-hard',
        'gruvbox-dark-medium',
        'gruvbox-dark-soft',
        'gruvbox-light-hard',
        'gruvbox-light-medium',
        'gruvbox-light-soft',
        'horizon',
        'houston',
        'kanagawa-dragon',
        'kanagawa-lotus',
        'kanagawa-wave',
        'laserwave',
        'light-plus',
        'material-theme',
        'material-theme-darker',
        'material-theme-lighter',
        'material-theme-ocean',
        'material-theme-palenight',
        'min-dark',
        'min-light',
        'monokai',
        'night-owl',
        'night-owl-light',
        'nord',
        'one-dark-pro',
        'one-light',
        'plastic',
        'poimandres',
        'red',
        'rose-pine',
        'rose-pine-dawn',
        'rose-pine-moon',
        'slack-dark',
        'slack-ochin',
        'snazzy-light',
        'solarized-dark',
        'solarized-light',
        'synthwave-84',
        'tokyo-night',
        'vesper',
        'vitesse-black',
        'vitesse-dark',
        'vitesse-light',
    ];

    const selectLanguage = document.querySelector('#shiki-language');
    const selectTheme = document.querySelector('#shiki-theme');
    const getCodeBtn = document.querySelector('#get-code');
    const shikiResult = document.querySelector('#shiki-result');
    const code = document.querySelector('#textarea-code');

    // Verify elements existence to avoid errors on other pages
    if (
        !selectLanguage ||
        !selectTheme ||
        !getCodeBtn ||
        !shikiResult ||
        !code
    ) {
        return;
    }

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        selectLanguage.appendChild(option);
    });

    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        selectTheme.appendChild(option);
    });

    getCodeBtn.addEventListener('click', getShikiResult);
    selectLanguage.addEventListener('change', getShikiResult);
    selectTheme.addEventListener('change', getShikiResult);

    async function getShikiResult() {
        try {
            const value = code.value.trim();

            if (!value) {
                return;
            }

            // Loading state
            const originalBtnText = getCodeBtn.textContent;
            getCodeBtn.textContent = 'Loading...';
            getCodeBtn.disabled = true;
            shikiResult.style.opacity = '0.5';

            const { codeToHtml } = await import('https://esm.run/shiki@3.22');

            shikiResult.innerHTML = '';

            const selectedLang = selectLanguage.value;
            const selectedTheme = selectTheme.value;

            const html = await codeToHtml(value, {
                lang: selectedLang.toLowerCase().replace(' ', '_'),
                theme: selectedTheme,
            });

            const preview = document.createElement('div');
            preview.classList.add('preview-result');
            preview.innerHTML = html;
            shikiResult.appendChild(preview);

            const txtAreaResult = document.createElement('textarea');
            txtAreaResult.classList.add('textarea-result');
            txtAreaResult.value = html;
            shikiResult.appendChild(txtAreaResult);

        } catch (e) {
            console.error(e);
            alert('An error occurred while generating the code. Please check the console for details.');
            shikiResult.innerHTML = '<p style="color: red;">Error generating code. See console.</p>';
        } finally {
            // Restore state
            getCodeBtn.textContent = 'Get code';
            getCodeBtn.disabled = false;
            shikiResult.style.opacity = '1';
        }
    }
})();

</script>
