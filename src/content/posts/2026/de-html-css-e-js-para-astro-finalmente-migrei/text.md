---
title: 'De HTML, CSS e JS para Astro: finalmente migrei'
description:
  'Migrei meu site de HTML, CSS e JavaScript puro para Astro SSG e explico as
  decisões técnicas, os desafios e como a IA (Codex, Claude e Gemini) acelerou a
  migração.'
date: 2026-02-27T12:00:00-03:00
author: 'Otávio Miranda'
---

![Logo do Astro](./images/astro-cover.webp)

Já tem alguns dias que estou falando sobre esta migração na
[comunidade do meu canal](https://www.youtube.com/@otaviomiranda/posts). Hoje,
finalmente terminei!

Meu site foi de **HTML, CSS e JavaScript PUROS** para o
[Astro](https://astro.build/) (_usando SSG - Static Site Generation_).

Além disso, este foi um dos primeiros projetos que mais administrei do que
digitei código. Diria que **95%** do código atual foi escrito por 3 LLMs
diferentes: **Claude Code** _(Opus 4.6)_, **Codex App** _(GPT 5.3 Codex High)_ e
**Antigravity** _(Gemini 3.1 Pro High)_. Também usei variações desses modelos
para tarefas simples ou mais complexas.

Usando um arquivo de regras simples, `git` e GitHub, consegui manter o contexto
do que estava em andamento até a conclusão do projeto. Isso me permitiu até
trocar de modelo ao longo da migração sem muitos problemas.

Vamos entender mais detalhes sobre isso adiante.

Mas, primeiro vamos garantir que você não vai cometer os mesmos erros que eu.

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
atualizado e estudar sem ter que se expor tanto.

Mas, com tantas opções, onde faria isso? Medium? WordPress? Blogger 😒???
Precisava de algo meu de verdade...

### Servir HTML, CSS e JS é fácil

Um site estático consiste apenas de arquivos HTML, estilos CSS e JavaScript.
[Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/),
[GitHub Pages](https://docs.github.com/pt/pages)... Todos estes serviços (_e
vários outros_) oferecem hospedagem gratuita para conteúdo estático.

Então, já que vou criar um repositório para manter os arquivos do meu site,
**GitHub Pages** foi a escolha mais próxima e de menor atrito.

### O problema começa aqui

Quando você cria seu site sem servidor, precisa entregar HTML, CSS e JS prontos.

Como eu já tinha bastante conhecimento nessas tecnologias, foi bem simples.

Olha só que legal. Se você criar este arquivo agora no seu computador, **aí está
o seu site estático**. Simples assim!

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

Geralmente, servidores web são configurados para buscar um arquivo `index.html`
no diretório requisitado.

Isso significa o seguinte:

```bash
# O caminho abaixo:
./2026/meu-post/index.html

# Se torna isso no seu domínio:
https://www.meusite.com/2026/meu-post/

# index.html carregado automaticamente pelo servidor web
```

O problema começa quando essa estrutura cresce. Você vai terminar com 1000
posts, cada um com variações do mesmo `index.html`.

Todos eles terão uma repetição do mesmo cabeçalho, rodapé, menu, etc...

Mas, como todo bom `dev`, cheio de projetos para entregar, você pensa:

> "Se funciona, deixa como está! Depois eu vejo isso."

### Tudo está bem, até que...

Você precisa alterar algo.

Não cheguei nem perto de 1000 posts, mas vamos imaginar que chegamos.

Suponha que no post 25 você decidiu fazer uma alteração porque encontrou um erro
no rodapé do site. Aquele tipo de erro de digitação que fica te provocando com
um _"FIX ME..."_ no fundo do seu cérebro.

Como você sempre clonou o último post para cada nova criação, isso foi replicado
para todos os outros 975.

> "Um script Python resolve!"

Mas, se isso ainda não tinha passado pela sua cabeça, agora você pensa o tempo
todo:

> "E se aparecer outro erro?"  
> "E se eu tiver que alterar o layout e o CSS?"  
> "E se eu quiser adicionar ou remover um link de menu?"

Refatorar todo o site nessa altura do campeonato é complicado. Você está com
vários outros projetos em andamento. Deadlines batendo na porta.

Seu script não vai capturar todas as nuances dos posts porque, todo ser humano
tem bursts de dopamina que geram micro alterações ao longo do tempo.

E nós sabemos que você nunca voltou para alterar todos os 1000 posts.

### As janelas estão quebradas...

Neste ponto, acontece algo muito parecido com a
[teoria das janelas quebradas](https://pt.wikipedia.org/wiki/Teoria_das_janelas_quebradas).

Você passa a "vandalizar" seu próprio site com: "só mais um script", "um ajuste
de margem aqui", "uma div ali"... Ele nunca vai estar perfeito.

Isso vai rapidamente da empolgação para o _"medo de quebrar algo"_, para o _"Não
ligo mais"_.

Até que você para de publicar completamente.

### Baseado em fatos reais

Foi exatamente o que aconteceu comigo.

A ideia de criar um novo post era rapidamente substituída pela ideia de
refatorar tudo ou até **jogar tudo fora e começar do zero**.

Mas, eu SEMPRE estou muito ocupado... enfim 🙄!

---

## A refatoração mal sucedida

Já tenho um vasto conhecimento no `Next.js`. E foi exatamente por este motivo
que decidi não usá-lo neste projeto. Achei **demais** para um simples blog.

Então eu tivesse essa ideia brilhante:

> "Vou refatorar isso aqui na mão mesmo."

Vamos cometer o mesmo erro duas vezes seguidas... Pense pelo lado positivo: já
que vamos errar, erramos em tudo o que for possível para não restar dúvidas do
erro.

Olhei algumas tendências no CodePen e Dribbble. Não sou bom com design, por
isso, tudo que adiciono nos meus layouts vem de coisas que vejo na Internet e
gosto.

### Meu único código do projeto

Decidi que queria uma section `Hero` no topo do site com um texto bem grande e
centralizado.

Me inspirei no design do [Antigravity](https://antigravity.google/), com as
partículas interativas que ficam se mexendo suavemente.

Cheguei a fazer 3 efeitos de background para decidir qual usar. Estão todas
abaixo:

- [Primeiro canvas](https://codepen.io/luizomf/full/ZYOdpdx)
- [Segundo Canvas](https://codepen.io/luizomf/full/yyJdoWP)
- [Final (Home do site)](https://www.otaviomiranda.com.br/)

Perdi uns 2 ou 3 dias com isso, mas consegui um resultado que me agradou.

E essa foi minha única participação em digitação de código neste projeto. O
canvas e o JavaScript que o acompanha.

### Desistência

Cheguei a colocar o canvas na página inicial e fazer alguns ajustes de fonte.

Queria (e consegui) criar um site onde o conteúdo vem primeiro. Principalmente
na [parte dos posts](/blog/1/).

Usei uma fonte grande, muito bem espaçada e não tenho anúncios, pop-ups,
cookies...

Nada além do conteúdo.

### Código antigo embaixo da cama

BoOoO 👻!

Mesmo tentando remover o máximo de coisas do código antigo sem quebrar nada,
mexer em uma parte do CSS ou JS antigo estragava outras partes do site.

É como aquele monstro embaixo da cama que as crianças têm medo. Mas o meu era só
código velho mesmo.

Trocar o tamanho de algo significava eu ter que sair conferindo todas as outras
páginas. Com umas duas ou três tentativas, já desisti e fui atrás de solução.

> Eu: Me indique um bom framework para SSG em 2026.  
> IA: Astro!

Como eu ainda não havia usado o **Astro**, vamos checar do que se trata.

---

## Astro is a JavaScript web framework 🤮🫣☺️💜

Ao entrar no [astro.build](https://astro.build/), adivinha a primeira coisa que
vejo?

_"Astro is a JavaScript web framework"_

Toda vez que vejo as palavras **JavaScript** e **Framework** juntas, a vontade é
tapar os ouvidos e ficar gritando: _"lá lá lá lá lá, não quero saber..."_.

Se você já usou a quantidade de frameworks e libs de JS que eu, deve ter a mesma
sensação. No final você só quer não usar nada.

Mas, o Astro foi diferente.

### Conceitos do Astro

Algumas coisas do **Astro** atacavam diretamente os meus problemas:

- Servidor primeiro: _"O Astro melhora o desempenho do seu website renderizando
  componentes no servidor, enviando HTML leve para o browser, com zero overhead
  de JavaScript desnecessário."_
- Voltado para conteúdo: _"O Astro foi criado para trabalhar com o seu conteúdo,
  não importa onde ele estiver. Carregue dados do seu sistema de arquivos, APIs
  externas ou seu CMS favorito."_
- Personalizável: _"Estenda o Astro com suas ferramentas favoritas. Traga sua
  própria UI de componentes, bibliotecas JS, temas, integrações e mais."_

Interessante! Tudo isso realmente está lá no site deles e pareceu falar
**diretamente para mim**.

Quer mais?

### Astro Islands

Se você já usou qualquer framework ou lib de JavaScript, já deve ter notado que
queremos encapsular o máximo de coisas que for possível em um único componente.

Isso evita o problema que eu tive na minha refatoração falha. Mas, até o
momento, eu fazia isso em um único framework na mesma página.

O Astro permite criar ilhas (islands) dentro da sua página. Dessa forma, um
componente pode usar React, outro Vue, outro pode ter somente HTML puro (de
novo, na mesma página).

Não recomendo adicionar 20 frameworks em uma página só porque pode, mas você
pode 😂.

### Fechado com Astro 💜

A partir daqui o negócio até que fluiu bem.

Só tem aquele fato que mencionei antes _"ainda não havia usado o **Astro**"_.
Então deixa eu chamar os LLMs e começar os trabalhos.

---

## LLMs: problemas e soluções

Continua...
