# Otávio Miranda Blog 🚀

Bem-vindo ao código-fonte do blog oficial do
**[Otávio Miranda](https://www.otaviomiranda.com.br)** (vulgo meu site).

Este projeto não é apenas o meu site pessoal, mas também um laboratório aberto
para todos acompanharem.

## 🕰️ Um Breve Histórico: Do Estático Legacy para o Astro SSG

Este site nasceu há muitos anos atrás como um compilado de centenas de arquivos
de texto e **HTML estático gerado manualmente** ("na unha"). Por muito tempo,
cada postagem era injetada num container mestre HTML, resultando numa
arquitetura complexa de manter, cheia de classes `CSS` duplicadas, scripts
antigos, tags HTML espaguete (`<p><a><img></a></p>`) e nenhuma validação ou
sistema de bundle (como Webpack/Vite).

Em **Fevereiro de 2026** nós iniciamos a grande _"Apollo Mission"_: **A migração
completa do núcleo estático para o [Astro](https://astro.build) (Static Site
Generation)**.

## 🧭 Princípios Editoriais (Real)

- O conteúdo (texto + código) vem primeiro: leitura acima da dobra e sem
  distração desnecessária.
- Sem popup, sem ads e sem dependência de script externo para highlight de
  código.
- Posts em Markdown com frontmatter obrigatório (`title`, `description`, `date`,
  `author`) para manter padrão.
- Arquivo do blog simples e paginado (sem vitrine de cards com thumbnail).
- Links de contato centralizados em página interna do próprio site.

### O que mudou com o Astro?

1. **Content Layer API (Acesso a dados tipados)**: O site agora extrai 100% dos
   tutoriais de formato **Markdown (`.md`)** e constrói dinamicamente as rotas
   das páginas atráves de schemas `zod`.
2. **Vite Asset Optimization**: Acabou o inferno de gerenciar URIs quebradas de
   imagens em subpastas. O Vite analisa as imagens, otimiza, comprime para
   `.webp` hiper-leve em build time e recalcula todos os caminhos.
3. **Syntax Highlight Nativo (Shiki)**: Os pesados scripts de highlight do
   browser foram substituídos pelo motor ultrarrápido do Shiki.
4. **Deploy Serverless Automático**: Fim dos deploys arrastando pasta `dist/` ou
   branches sujas. O pipeline compila pelo **GitHub Actions** em ambiente Linux
   na nuvem e empurra a _build estática_ para o ar sozinho.

---

## 💻 Como Rodar o Projeto na Sua Máquina

Se quiser seguir o mesmo caminho que eu, pode clonar o repositório e rodar o
projeto na sua máquina.

### Pré-requisitos

- **Node.js**: Versão 20 ou superior.

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/luizomf/otaviomiranda.com.br.git
cd otaviomiranda.com.br
```

2. Instale as dependências:

```bash
npm install
```

3. Suba o servidor de desenvolvimento:

```bash
npm run dev
```

Visite `http://localhost:4321` no navegador.

### Comandos do dia a dia

```bash
# Dev server local
npm run dev

# Lint (Astro check + Prettier check)
npm run lint

# Build de produção (check + build)
npm run build

# Preview local da build gerada em dist/
npm run preview
```

---

## 📝 Como Criar um Novo Post

Nós padronizamos a criação de posts na versão atual do site para utilizar os
recursos de indexação do **Astro Content Layer**. Todo post novo **DEVE** seguir
as seguintes regras de diretório (ele só varre `src/content/posts/`):

### Fluxo recomendado (automatizado)

Use o gerador de post:

```bash
npm run post "Título do meu novo artigo"
```

Esse comando cria automaticamente:

1. Pasta do post em `src/content/posts/ANO/slug-do-titulo/`
2. Pasta de imagens em `src/content/posts/ANO/slug-do-titulo/images/`
3. Arquivo `text.md` com frontmatter padrão preenchido

### Fluxo manual (caso necessário)

1. Crie uma nova pasta: `src/content/posts/ANO/nomedopost/`
2. Crie `text.md` dentro dela
3. Adicione imagens em `src/content/posts/ANO/nomedopost/images/`

### O "Frontmatter" (Obrigatório)

Seu arquivo `text.md` DEVE começar com a estruturação de metadados:

```yaml
---
title: 'Título Sensacional do Post'
description: 'Um subtítulo que resume a dor resolvida em 2 linhas.'
author: 'Seu nome'
date: 2026-03-01
---

# Aqui, você começa o conteúdo real em H1!

![Sua Imagem](./images/sua-imagem.png)

Seja sempre claro e coloque espaços duplos enter parágrafos!
```

## 🧪 Como Criar Página em Branco (Experimentos)

Para páginas de experimento com CSS/JS próprios (sem herdar o visual global),
use o `BlankLayout`.

1. Crie um arquivo em `src/pages/` (exemplo: `src/pages/lab-meu-teste.astro`)
2. Importe `BlankLayout`
3. Escreva seu HTML livre
4. Ligue seus assets próprios (opcional) via `/public`

Exemplo mínimo:

```astro
---
import BlankLayout from '../layouts/BlankLayout.astro';
---

<BlankLayout title='Lab - Meu Teste'>
  <main>
    <h1>Meu experimento</h1>
    <p>Página isolada para testes.</p>
  </main>
</BlankLayout>
```

Com assets próprios:

```astro
---
import BlankLayout from '../layouts/BlankLayout.astro';
---

<BlankLayout title='Lab - Com CSS e JS próprios'>
  <link rel='stylesheet' href='/labs/meu-lab.css' />
  <main id='app'></main>
  <script is:inline src='/labs/meu-lab.js'></script>
</BlankLayout>
```

Nesse caso, coloque os arquivos em:

- `public/labs/meu-lab.css`
- `public/labs/meu-lab.js`

## ✍️ Editor Markdown (Browser)

Existe uma página de editor local em:

- `/editor/`

Ela oferece:

- Monaco editor de um lado + preview markdown do outro;
- Abrir arquivo `.md` local;
- Salvar (`Ctrl/Cmd + S`) com File System Access API;
- Fallback de download `.md` em navegadores sem suporte da API.

---

## 🛠️ Deploy: Como Vai Para o Ar?

O projeto está hospedado no domínio customizado das plataformas do **GitHub
Pages**. Mas a mágica real tá escondida no arquivo
`.github/workflows/deploy.yml`.

Toda vez que uma alteração é fundida (merge / push) para a branch **`main`**, o
robô do Github assume o comando: faz o checkout, executa `npm run build`, e
injeta essa build ultra-otimizada silenciosamente no ambiente de DNS público. Ou
seja, eu altero o arquivo Markdown hoje e aperto um botão para publicar.

---

## 📊 Números do Site

| Metric | Valor |
|--------|-------|
| Páginas | 22 |
| Build time | ~900ms |
| Home (total transfer) | ~150KB |
| Post (total transfer) | ~40KB |
| JS em `public/` | 0 arquivos |
| CSS em `public/` | 0 arquivos |

Todo JavaScript e CSS é processado pelo Vite em build time. O único script
client-side é o canvas de partículas do Hero, empacotado como componente Astro.

---

## 📋 Histórico da Migração

A migração completa de HTML estático para Astro SSG foi concluída em Fevereiro
de 2026. Este projeto foi construído com a ajuda de múltiplos agentes de IA
(Gemini, GPT/Codex, Claude), cada um contribuindo em etapas diferentes.

Destaques do que foi feito:

- Layouts e componentes reutilizáveis (Header, Footer, Section, SectionHeader)
- Content Layer API com schemas Zod para validação de frontmatter
- Syntax highlight nativo via Shiki (`github-dark-high-contrast`)
- Deploy automático via GitHub Actions para GitHub Pages
- Sitemap automatizado com `@astrojs/sitemap`
- Editor Markdown no browser (`/editor/`) com Monaco, Vim mode e DOMPurify
- CLI para criação de posts (`npm run post "Titulo"`)
- Dados de cursos, depoimentos e contatos centralizados em `src/config/`
- Purge completo de assets legados (~4.000 linhas de código morto removidas)
- Canvas de partículas do Hero como componente Astro com TypeScript

Não há débitos técnicos ativos neste ciclo.

---

_"Feito vale mais do que perfeito. Resolva agora, melhore depois."_
