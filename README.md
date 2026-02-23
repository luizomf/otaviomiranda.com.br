# Otávio Miranda Blog 🚀

Bem-vindo ao código-fonte do blog oficial do **[Otávio Miranda](https://www.otaviomiranda.com.br)**.

Este projeto não é apenas o meu site pessoal, mas também um laboratório aberto para alunos dos meus cursos acompanharem, stalkearem e entenderem como funciona a engenharia de um projeto real com anos de estrada.

## 🕰️ Um Breve Histórico: Do Estático Legacy para o Astro SSG

Este site nasceu há muitos anos atrás como um compilado de centenas de arquivos de texto e **HTML estático gerado manualmente** ("na unha"). Por muito tempo, cada postagem era injetada num container mestre HTML, resultando numa arquitetura complexa de manter, cheia de classes `CSS` duplicadas, scripts antigos, tags HTML espaguete (`<p><a><img></a></p>`) e nenhuma validação ou sistema de bundle (como Webpack/Vite).

Em **Fevereiro de 2026** nós iniciamos a grande *"Apollo Mission"*:
**A migração completa do núcleo estático para o [Astro](https://astro.build) (Static Site Generation)**. 

### O que mudou com o Astro?
1. **Content Layer API (Acesso a dados tipados)**: O site agora extrai 100% dos tutoriais de formato **Markdown (`.md`)** e constrói dinamicamente as rotas das páginas atráves de schemas `zod`. 
2. **Vite Asset Optimization**: Acabou o inferno de gerenciar URIs quebradas de imagens em subpastas. O Vite analisa as imagens, otimiza, comprime para `.webp` hiper-leve em build time e recalcula todos os caminhos.
3. **Syntax Highlight Nativo (Shiki)**: Os pesados scripts de highlight do browser foram substituídos pelo motor ultrarrápido do Shiki.
4. **Deploy Serverless Automático**: Fim dos deploys arrastando pasta `dist/` ou branches sujas. O pipeline compila pelo **GitHub Actions** em ambiente Linux na nuvem e empurra a _build estática_ para o ar sozinho.

---

## 💻 Como Rodar o Projeto na Sua Máquina

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

---

## 📝 Como Criar um Novo Post

Nós padronizamos a criação de posts na versão atual do site para utilizar os recursos de indexação do **Astro Content Layer**. Todo post novo **DEVE** seguir as seguintes regras de diretório (ele só varre `src/content/posts/`):

1. **Crie uma nova pasta** pro seu post usando a estrutura:
`src/content/posts / ANO / nomedopost /`
2. **Crie o arquivo `text.md`** dentro dela.
3. **Adicione as imagens** de referência dentro de uma subpasta `.../nomedopost/images/` no seu post.

### O "Frontmatter" (Obrigatório)
Seu arquivo `text.md` DEVE começar com a estruturação de metadados:

```yaml
---
title: 'Título Sensacional do Post'
description: 'Um subtítulo que resume a dor resolvida em 2 linhas.'
date: 2026-03-01
---

# Aqui, você começa o conteúdo real em H1!

![Sua Imagem](./images/sua-imagem.png)

Seja sempre claro e coloque espaços duplos enter parágrafos!
```

---

## 🛠️ Deploy: Como Vai Para o Ar?

O projeto está hospedado no domínio customizado das plataformas do **GitHub Pages**. Mas a mágica real tá escondida no arquivo `.github/workflows/deploy.yml`.

Toda vez que uma alteração é fundida (merge / push) para a branch **`main`**, o robô do Github assume o comando:  faz o checkout, executa `npm run build`, e injeta essa build ultra-otimizada silenciosamente no ambiente de DNS público. Ou seja, eu altero o arquivo Markdown hoje e aperto um botão para publicar.

---

## 📋 TODO & Technical Debts (A Memória do Projeto)

Como num software real com 8 anos de história as refatorações são cruéis e nunca o tempo é suficiente para apagar rastros de bibliotecas defuntas e regras antigas. Alunos: **Isso é um software de verdade na vida real**.

Aqui embaixo eu deixo o nosso histórico de combate recente e problemas que eu e o meu Agent AI (O *"Brien"*) catalogamos para voltar e matar depois.

### ✅ O que foi CONCLUÍDO (Successes)
- Migração dos `assets/js` e `css/` puros para subdireção Vite controlada.
- Refatoração do modelo antigo (Páginas independentes) para sistema de Layout e Componentes reutilizáveis (Header.astro, BaseHead.astro, etc)
- Implementação da biblioteca **Shiki**, abandonando bibliotecas legacy de JS Highlight que pesavam o LCP no LightHouse.
- Script de RegEx personalizado massivo gerado em Node para consertar imagens antigas: Removemos os block-wrappers indesejados (`<p><img/></p>`) que haviam saído imundos de conversores HTML -> MD antigos, consertando ~20 imagens 404 quebradas no build estático.
- Action Pipeline para GitHub Pages configurado, rodando sem travamentos de `Cache.duplicateId`.

### 🚧  TO-DO: Débitos e Próximas Milestones 
- [ ] **Sitemap Automatizado**: Descobrir/adicionar o plugin `@astrojs/sitemap` ou `Astro API` para gerar um sitemap atualizado toda vez que um novo post é listado, em vez de depender de uma árvore manual do Webmaster legado.
- [ ] **Templates "Puros" ou Landing Pages em Branco**: Precisamos pensar num Layout sem navegação. Antigamente, páginas experimentais subiam "html puro", agora, as páginas injetarão `CSS` e `Header` fatalmente. Precisamos de um layout para driblar o sistema atual de rotas/CSS se precisarmos fazer demo visual de um App por fora.
- [ ] CSS Legacy Cleaning: Ainda existem classes e divs (`is-pulled-right`, e centenas de divs irrelevantes) que vieram da exportação bruta das páginas de 2020 para o Markdown. Limpar visualmente.
- [ ] Resquícios do Lightbox Visual: Algumas imagens ainda podem carregar as classes do Javascript/Lightbox anterior, ignorando carregamentos nativos lazy (isso não quebra a foto, mas carrega semântica vazia).
- [ ] Revisitar index.astro: Fazer grid de paginação pros arquivos `.md` caso os posts comecem a crescer infinitivamente na primeira página baseada.

---
_"Feito vale mais do que perfeito. Resolva agora, melhore depois."_
