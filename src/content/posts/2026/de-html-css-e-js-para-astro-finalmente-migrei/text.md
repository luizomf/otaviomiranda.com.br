---
title: 'De HTML, CSS e JS para Astro: finalmente migrei'
description:
  'Migrei meu site de HTML, CSS e JavaScript puro para Astro SSG e explico as
  decisões técnicas, os desafios e como a IA (Codex, Claude e Gemini) acelerou a
  migração.'
date: 2026-02-27
author: 'Otávio Miranda'
---

![Logo do Astro](./images/astro-cover.webp)

Já tem alguns dias que estou falando sobre esta migração na
[comunidade do meu canal](https://www.youtube.com/@otaviomiranda/posts). Hoje,
finalmente terminei!

Meu site foi de **HTML, CSS e JavaScript PURO** para o
[Astro](https://astro.build/) (_usando SSG - Static Site Generation_).

Além disso, digitei pouquíssimo código na migração. Diria que **95%** de todo o
código atual foi escrito por 3 LLMs diferentes: **Claude Code** _(Opus 4.6)_,
**Codex App** _(GPT 5.3 Codex High)_ e **Antigravity** _(Gemini 3.1 Pro High)_.

A parte mais legal sobre as IAs, foi **como trabalhamos neste projeto**. Ao
invés de algo complexo e cheio de regras, montei um _loop_ que fez todos os
modelos de IA trabalharem precisamente da mesma forma.

Vamos entender mais detalhes sobre tudo isso adiante.

---

## Meu erro ao usar HTML, CSS e JS puros

Desde a época do "blogger" (_nos anos 2000_), sempre mantive
[um blog](https://web.archive.org/web/20100225145510/http://www.todoespacoonline.com/)
com conteúdo sobre tecnologia. Só que fui perdendo este hábito à medida que
comecei a criar conteúdo
[em vídeo](https://www.youtube.com/@otaviomiranda/videos).

De 2018 para 2019, senti a necessidade de ter o meu cantinho da Internet
novamente. Então...

### Blog novo de novo

Para mim, escrever é uma ótima forma de marcar presença online, manter-se
atualizado e estudar.

Mas, com tantas opções, onde faria isso? Medium? WordPress? Blogger 😒???
Precisava de algo meu de verdade...

### Servir HTML, CSS e JS é fácil

Um site estático consiste apenas de arquivos HTML, estilos CSS e JavaScript.
[Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/),
[GitHub Pages](https://docs.github.com/pt/pages)... Todos estes serviços (_e
vários outros_) oferecem hospedagem gratuita para conteúdo estático.

Então, já que vou criar um repositório para manter os arquivos do meu site,
**GitHub Pages** foi a escolha mais próxima.

### O problema começa aqui

Quando você cria seu site sem servidor, precisa entregar HTML, CSS e JS prontos.

Como eu já tinha bastante conhecimento nessas tecnologias, foi bem simples.

Olha só que legal. Se você criar este arquivo no seu computador, você **já tem
um site** estático.

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Hello, world!</title>
  </head>

  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
```

Mas, se quer um conselho de quem já sofreu por muito tempo com isso: **não siga
por este caminho**.

---

## Uma breve história do que vai acontecer

Essa era a estrutura que eu tinha antes. CSS e JS globais, usados por um
`index.html` na raiz para a página inicial.

Nos posts, eu criava um diretório do `ANO/SLUG` (slug é o título do post no
formato de diretório).

```
.
├── css
│   └── styles.css
├── js
│   └── scripts.js
├── 2018
│   ├── primeiro-post-do-meu-blog
│   │   └── index.html
│   ├── segundo-post-do-meu-blog
│   │   └── index.html
├── 2019
│   ├── feliz-ano-novo
│   │   └── index.html
│   ├── fiquei-rico
│   │   └── index.html

... vários anos e posts ...

│ 
└── index.html
```

Quando essa estrutura cresce, você termina com 1000 posts, cada um com variações
do mesmo `index.html`. Todos têm o mesmo cabeçalho, rodapé, menu, etc...

Mas funciona, então você mantém a estrutura crescendo.

### Tudo está bem, até que...

Você precisa alterar algo.

Imagine que no post 25 você decidiu fazer uma alteração em um erro que passou
despercebido no rodapé do seu site. Aquele tipo de `typo` que, quando você vê,
não dá pra "desver" mais.

Como você sempre clona o último post para criar um novo, isso foi replicado para
todos os outros 975.

Você faz um script que faz essa alteração e segue o jogo.

Porém, se isso ainda não tinha passado pela sua cabeça, agora você não para de
pensar:

> "Mas... e se aparecer outro erro?"  
> "E se eu tiver que alterar o layout e o CSS?"  
> "E se eu quiser adicionar ou remover um link de menu?"

Refatorar todo o site a essa altura do campeonato é complicado. Você está com
vários outros projetos em andamento.

### As janelas estão quebradas...

Neste ponto acontece algo muito parecido com a
[teoria das janelas quebradas](https://pt.wikipedia.org/wiki/Teoria_das_janelas_quebradas).
Você passa a "vandalizar" seu próprio site com: só mais um script, só mais um
CSS, uma div aqui e ali. E assim vai... até parar de publicar coisas novas.

### Baseado em fatos reais

Foi exatamente o que aconteceu comigo. Meu site nem chegou a crescer muito para
chegar num ponto onde eu já estava desconfortável com todos os padrões
diferentes em cada um dos posts.

A ideia de criar um novo post era rapidamente substituída pela ideia de
refatorar tudo. Mas, eu SEMPRE estou muito ocupado para parar e olhar isso.

Resultado? Sem novos posts... Você abandona seu próprio site.

---

## A refatoração mal sucedida

Já tenho um vasto conhecimento no `Next.js`. De fato, foi exatamente por este
motivo que decidi não usá-lo neste projeto. Achei **demais** para um simples
blog.

Então, o que tentei fazer?

> "Vou refatorar isso aqui na mão mesmo."

Vamos cometer o mesmo erro duas vezes seguidas, não é mesmo? Já que vamos errar,
erra tudo o que for possível já para não restar dúvidas do erro.

Comecei a ver algumas tendências pelo CodePen e Dribbble. Não sou muito bom com
design, por isso, tudo que adiciono nos meus layouts vem de coisas que vejo na
Internet e gosto.

### O único código que digitei neste projeto

Decidi que queria uma section `Hero` no topo do site com um texto bem grande
centralizado.

Como background, me inspirei no design do
[Antigravity](https://antigravity.google/). Partículas interativas que ficam se
mexendo suavemente.

Cheguei a fazer 3 efeitos de background para decidir qual usar, veja:

- [Primeiro canvas](https://codepen.io/luizomf/full/ZYOdpdx)
- [Segundo Canvas](https://codepen.io/luizomf/full/yyJdoWP)
- [Final (Home do site)](https://www.otaviomiranda.com.br/)

Perdi uns 2 ou 3 dias só com isso, mas pelo menos consegui um resultado
satisfatório.

E essa foi minha única participação em digitação de código neste projeto. O
canvas e o JavaScript que o acompanha.

### Desistência

Cheguei a colocar o canvas na página inicial e fazer alguns ajustes de fonte.

Queria muito (e consegui) criar um site onde o conteúdo vem primeiro.
Principalmente na parte dos posts.

Usei uma fonte grande, muito bem espaçada e, o mais importante, não tenho
anúncios, sem pop-ups, sem coletar dados ou cookies...

Nada além do conteúdo.

### Código antigo embaixo da cama

Mesmo tentando remover o máximo de coisas do código antigo sem quebrar nada.
Infelizmente, mexer em uma parte do CSS ou JS antigo estragava outras partes do
site.

Isso é como aquele monstro embaixo da cama que as crianças têm medo. Só que o
meu realmente estava lá.

Trocar o tamanho de algo significava que eu tinha que sair conferindo todas as
outras páginas. Isso aconteceu umas duas vezes até eu desistir rapidamente e
sair em busca de uma solução.

> Eu: Me indique um bom framework para SSG em 2026.  
> IA: Astro!

Então vamos checar o tal do **Astro**.

---

## Astro is a JavaScript web framework 🤮🫣☺️💜

Ao entrar no [astro.build](https://astro.build/), a primeira coisa que vejo:
`Astro is a JavaScript web framework`.

Toda vez que vejo as palavras **JavaScript** e **Framework** juntas, a vontade é
tapar os ouvidos e ficar gritando: _"lá lá lá lá lá, não quero saber..."_. Se
você já usou a quantidade de frameworks e libs de JS que eu, deve ter a mesma
sensação.

Mas o Astro 💜 foi diferente.

### Conceitos do Astro

Esses foram alguns conceitos que me fizeram analisar melhor o **Astro**:

- Server-First: _"O Astro melhora o desempenho do website renderizando
  componentes no servidor, enviando HTML leve para o browser, com zero overhead
  de JavaScript desnecessário."_
- Content-Driven: _"O Astro foi criado para trabalhar com o seu conteúdo, não
  importa onde ele estiver. Carregue dados do seu sistema de arquivos, APIs
  externas ou seu CMS favorito."_
- Customizable: _"Extenda o Astro com suas ferramentas favoritas. Traga sua
  própria UI de componentes JS, bibliotecas JS, temas, integrações e mais."_

Interessante, parece funcionar para o que eu preciso. Agora, quer algo ainda
mais legal?

### Astro Islands

Se você já usou qualquer framework ou lib de JavaScript, já deve ter notado que
queremos encapsular o máximo de coisas que for possível em um único componente.
Isso evita o problema que eu tive na minha refatoração falha que mencionei
antes.

Mas, até o presente momento, eu fazia isso em um único framework na mesma
página.

O Astro permite criar ilhas (islands) dentro da sua página. Dessa forma, um
componente pode usar React, outro pode usar Vue, outro pode ter somente HTML
puro (de novo, na mesma página).

Não recomendo adicionar 20 frameworks em uma página só porque pode, mas você
pode 😂.

### Fechado com Astro 💜

A partir daqui o negócio até que fluiu bem.

Só tem o fato de eu não ter trabalhado com o **Astro** ainda. Então deixa eu
chamar os LLMs que tenho acesso no momento. Temos trabalho!

---

## LLMs: problemas e soluções

Continua...
