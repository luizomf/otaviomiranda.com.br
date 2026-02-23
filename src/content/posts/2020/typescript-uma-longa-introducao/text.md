---
title: 'TypeScript - uma longa introdução'
description:
  'Sou Luiz Otávio Miranda e trabalho com desenvolvimento de softwares desde
  2009 usando várias linguagens, bibliotecas e frameworks diferentes.'
date: 2018-09-02
---

<p class="author">
  <span class="meta-date">
    <time datetime="2018-09-02">2 de setembro de 2020</time>
  </span>
  ·
  <span class="meta-author">Luiz Otávio Miranda</span>
</p>
<p>
  Esse post vai te ajudar a entender melhor o que é o TypeScript
  de maneira geral. Vamos entrar um pouco mais na parte conceitual sem
  aprofundarmos em detalhes para que você saiba como e quando
  usá-lo.
</p>

<p>
  Atenção: não tenho o intuito de falar sobre tudo
  o que é possível sobre o TS. Para isso, veja a
  <a href="https://www.typescriptlang.org/docs/home.html">documentação oficial</a>.
</p>

<h2>O que é o TypeScript?</h2>

<p>
  Segundo o site oficial, o
  <em>TypeScript é um superconjunto do JavaScript com tipagem que
    é compilado para JavaScript simples</em>
  (<a href="https://www.typescriptlang.org/">texto original</a>:
  <em>TypeScript is a typed superset of JavaScript that compiles to plain
    JavaScript</em>), ou seja, algo que é adicionado sobre o JavaScript.
</p>

<p>
  No entanto, como poderíamos imaginar um
  “superconjunto” (<em>superset</em>)? Isso é uma
  linguagem de programação? Uma versão do JS? Uma
  quarta dimensão? De fato, um
  <em>superset</em> não explica muita coisa pra quem conhece o
  termo (<em>e eu não estou brincando, existe uma outra dimensão
    no TS, você vai descobrir já já</em>).
</p>

<h3>Comparação com versões do ECMAScript</h3>

<p>
  Assim como cada versão do ECMAScript adiciona novos recursos ao
  JavaScript, o TypeScript também o fará.
</p>

<p>
  Por exemplo, imagine as versões do ECMAScript (ES3, ES5, ES6,
  …, ES2020):
</p>

<p>


![Figura 1. Cada nova versão do ECMAScript adiciona novos recursos ao JavaScript.](./imgs/JavaScript-Versions@2x-2048x1648.png)


  <span class="img-description">Figura 1. Cada nova versão do ECMAScript adiciona novos recursos ao
    JavaScript.</span>
</p>

<p>
  Como podemos ver na <strong>Figura 1</strong>, novas versões do
  ECMAScript adicionam novos recursos ao JavaScript.
</p>

<p>
  Além disso, cada uma das versões é
  compatível com a versão anterior. Portanto, você
  pode facilmente rodar um script ES5 em ambientes ES7, mas não o
  contrário. Não é possível usar os recursos
  do ES7 em ambientes ES5, porque tais recursos ainda não existem
  no ES5 (salvo se usarmos algum
  <a href="https://developer.mozilla.org/pt-BR/docs/Glossario/Polyfill">polyfill</a>).
</p>

<p>
  Mas, mesmo tendo várias versões do ECMAScript, chamamos
  todas elas de Javascript (a menos que você queira falar ou usar
  determinada especificidade de uma versão).
</p>

<p>
  <em><strong>Nota:</strong> existem várias versões do
    ECMAScript, separei apenas três para exemplo. Você pode
    ver todas elas
    <a href="https://en.wikipedia.org/wiki/ECMAScript">aqui</a>.</em>
</p>

<h3>Onde o TypeScript se encaixa?</h3>

<p>
  Se adicionarmos o TS como um layer, como fizemos na
  <strong>Figura 1</strong>, esse diagrama ficaria assim:
</p>

<p>


![Figura 2. O TypeScript é um superset do JavaScript.
        ](./imgs/Typescript-is-a-javascript-superset-2048x1946.png)


  <span class="img-description">Figura 2. O TypeScript é um superset do JavaScript.
  </span>
</p>

<p>
  Então, podemos perceber que o TS adiciona funcionalidades sobre
  o JS simples. Portanto, é isso que o site oficial quer dizer
  quando detalha o TypeScript como um superset do JavaScript.
</p>

<h3>O que realmente é o TypeScript</h3>

<p>
  Aqui segue um resumão sobre o que eu acho que o TS realmente
  é:
  <strong>O TypeScript é um superset do JS criado pela Microsoft. Um
    JavaScript mais moderno e seguro, que adiciona as últimas
    versões do ECMAScript, muitos recursos próprios e um
    sistema extremamente rico para tipagem</strong>. Além disso, ele também adiciona recursos muito
  úteis ao editor de código para facilitar a vida do
  desenvolvedor (falaremos mais sobre isso mais adiante).
</p>

<p>
  Por falar em tipagem, uma das partes mais importantes do TypeScript
  são os tipos (<strong>types</strong>), por isso o nome
  <strong>Type</strong>Script (acho que você já tinha
  percebido, né?). De fato, esse é um dos fatores que
  costuma levar o TS para projetos de larga escala em bases de
  código gigantescas. Vamos falar mais sobre a tipagem mais
  adiante neste post também.
</p>

<h2>Linguagem interpretada ou linguagem compilada?</h2>

<p>
  Depende do seu ponto de vista e do seu ambiente de desenvolvimento!
</p>

<p>
  Quando falamos em TypeScript, geralmente estamos imaginando o ambiente
  mais comum atualmente (06/2020):
  <a href="https://nodejs.org/en/download/">Node.js</a>.
</p>

<p>
  Assim, se você pensar neste ambiente, é meio incomum
  falar de algo como o TS, porque ele não seria uma
  <a href="https://pt.wikipedia.org/wiki/Linguagem_interpretada#:~:text=Linguagem%20interpretada%20%C3%A9%20uma%20linguagem,pelo%20sistema%20operacional%20ou%20processador.">linguagem interpretada</a>
  (como <a href="categoria/python/">Python</a>, Ruby, PHP…), nem
  uma
  <a href="https://pt.wikipedia.org/wiki/Linguagem_compilada#:~:text=Linguagem%20compilada%20%C3%A9%20uma%20linguagem,linguagem%20de%20baixo%20n%C3%ADvel%2C%20como">linguagem que compila</a>
  para bytecode ou código de máquina como outras
  linguagens de mais baixo nível fazem. O TS com Node.js seria
  uma linguagem que compila diretamente para outra linguagem de alto
  nível, o JavaScript.
</p>

<p>
  Lembra da <strong>Figura 2</strong>? Pois é, ao terminar de
  escrever o meu código TypeScript, eu faria a
  compilação diretamente para JavaScript simples. Por
  isso, o JavaScript gerado seria o meu código de
  produção, que ambos, Node.js e o Browser, entendem.
  Portanto, minha aplicação em produção
  rodaria apenas JavaScript.
</p>

<p>


![Figura 3. Processo de compilação do TypeScript em JavaScript usando Node.js

        ](./imgs/TypeScript-compilado-para-javascript-1-2048x1690.png)



<span class="img-description">Figura 3. Processo de compilação do TypeScript em
JavaScript usando Node.js </span>

</p>

<h3>Outra dimensão?</h3>

<p>
  Lembra da nova dimensão que falei anteriormente? Então,
  é aqui que ela entra. Tudo o que o TypeScript adiciona de
  recursos no momento do desenvolvimento, será removido no
  código final compilado. Afinal, o Javascript não entende
  muitos dos recursos adicionados pelo TS, no final das contas, o que a
  gente quer mesmo é o código compilado, ou seja, o JS
  puro.
</p>

<p>
  A “dimensão do TypeScript” existirá apenas
  no seu código de desenvolvimento.
</p>

<h3>Um cenário diferente</h3>

<p>
  Este acima seria o cenário Node.js, onde você precisa
  compilar o código para ter o JS puro no back-end. Certamente,
  é o cenário mais usado hoje em dia e acho que isso ainda
  vai perdurar por alguns anos.
</p>

<p>
  Porém, em 13 de maio de 2020, a
  <a href="https://deno.land/v1">versão 1.0 do Deno foi lançada</a>
  e ele interpreta TypeScript puro, sem a necessidade de
  compilação. Então, olhando por este ponto de
  vista, o
  <strong>TS seria uma linguagem de programação</strong>
  com tipagem estática e interpretada. Você ainda
  precisaria compilar o código para o front-end, mas não
  para o back-end.
</p>

<p>
  Neste post, vou focar mais no lado “Node.js” da coisa, com
  o processo de compilação.
</p>

<h2>Extensão .ts e .tsx</h2>

<p>
  Arquivos TypeScript tem a extensão <code>.ts</code> ou
  <code>.tsx</code> ao invés de <code>.js</code> ou
  <code>.jsx</code> e aqui cabe uma dica interessante: converter um
  arquivo JavaScript válido em TypeScript válido é
  um processo relativamente simples, basta renomear a extensão de
  <code>.js(x)</code> para <code>.ts(x)</code>. Dependendo da
  configuração do seu ambiente, o TypeScript poderá
  compilar o seu código JavaScript sem nenhum problema (talvez
  com alguns alertas, mas o código JS será gerado
  normalmente).
</p>

<p>
  Este é um dos muitos fatores que dão tanta popularidade
  ao TypeScript atualmente. Muitos desenvolvedores estão migrando
  suas bases de código de JavaScript para TypeScript por conta
  dessa simplicidade. Apenas configure seu ambiente, renomeie um arquivo
  <strong>.js</strong> para <strong>.ts</strong> e pronto, estará
  em ambiente TypeScript!
</p>

<p>Por exemplo, isso é TypeScript:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">function</span><span style="color:#89B4FA;font-style:italic"> greet</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">name</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CDD6F4">  console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Olá, </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">name</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1">!`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">greet</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'Otávio Miranda'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // Olá, Otávio Miranda!</span></span></code></pre>

<p>
  Alguma diferença com o JS que você conhece? É claro que não usei
  nenhum recurso do TypeScript neste código, mas eu poderia facilmente
  (e não acho que isso dificultaria seu entendimento):
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">function</span><span style="color:#89B4FA;font-style:italic"> greet</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">name</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> string</span><span style="color:#9399B2">)</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> void</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CDD6F4">  console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Olá, </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">name</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1">!`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">greet</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'Otávio Miranda'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // Olá, Otávio Miranda!</span></span></code></pre>

<p>
  Isto só é possível, porque se observarmos nossa
  <strong>Figura 2</strong> o
  <strong>TypeScript É JavaScript</strong>. Portanto, assim como
  podemos rodar scripts ES5 em ambientes ES7 (ou superiores), o
  compilador do TypeScript não terá nenhum problema em
  entender JavaScript puro. Por outro lado, assim como não
  conseguimos usar recursos do ES7 no ES5 sem um polyfill, também
  não conseguimos rodar TypeScript diretamente em ambiente
  JavaScript. Nem o Browser, nem o Node.js entenderiam TS.
</p>

<p>
  O primeiro código (sem tipagem) rodaria perfeitamente tanto em
  ambientes JavaScript quanto TypeScript; o segundo (com tipagem)
  não poderia ser interpretado pelo JavaScript.
</p>

<h2>Por que o TypeScript é mais seguro?</h2>

<p>Considere este código JavaScript abaixo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> name </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Otávio Miranda'</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> upperCaseName </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> name</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">toUppercase</span><span style="color:#CDD6F4">()</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(upperCaseName)</span><span style="color:#9399B2">;</span></span></code></pre>

<p>
  Agora, me diga: encontrou o erro? Sim! Ele tem um erro que só seria
  detectado no momento da execução (runtime). Porém, quase posso
  garantir que, ao passar o olho sobre este código, você não o detectou
  facilmente, estou certo?
</p>

<p>
  Se um código assim fosse para produção, ao ser executado seus usuários
  veriam algo como:
</p>

<p>
  <code>Uncaught TypeError: name.toUppercase is not a function</code>
</p>

<p>
  Ou, para um usuário comum, ele simplesmente veria seu programa parar
  de funcionar sem saber o motivo.
</p>

<p>
  Mas, se você colocar este código em um ambiente TypeScript, antes
  mesmo da execução do seu código este erro seria detectado.
</p>

<p>


![Figura 4. O TypeScript detecta o erro antes que você possa executar seu código.

        ](./imgs/typescript-error-1.png)



<span class="img-description">Figura 4. O TypeScript detecta o erro antes que
você possa executar seu código. </span>

</p>

<h3>Conveniência da <em>Intelligent code completion</em></h3>

<p>
  Além de analisar o meu código enquanto eu digito sem
  deixar o meu editor lento, a mensagem do TypeScript ainda me informa
  qual o erro, qual o tipo da variável e ainda me da uma
  sugestão sobre o que eu quis dizer. Nesse caso, se você
  ainda não detectou,
  <code>toUppercase</code> não existe no tipo
  <code>string</code>, o correto seria <code>toUpperCase</code>.
</p>

<p>
  Por fim, veja esse outro código (aqui o erro é
  explícito)?
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">([</span><span style="color:#FAB387">1</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 2</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 3</span><span style="color:#CDD6F4">] </span><span style="color:#94E2D5">*</span><span style="color:#FAB387"> 2</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // NaN</span></span></code></pre>

<p>
  Viu o erro? No entanto, o JavaScript não tem problema em permitir que
  meu código rode assim, multiplicando um array por um número.
</p>

<p>Porém, veja o que acontece quando migramos para TypeScript:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">([</span><span style="color:#FAB387">1</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 2</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 3</span><span style="color:#CDD6F4">] </span><span style="color:#94E2D5">*</span><span style="color:#FAB387"> 2</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // NaN</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">//          ^ The left-hand side of an</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">//            arithmetic operation must</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">//            be of type 'any', 'number',</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">//            'bigint' or an enum</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">//            type.ts(2362)</span></span></code></pre>

<p>
  Por isso que o TypeScript deixa nossos códigos mais seguros.
</p>

<p>
  <strong>Nota: </strong>vou representar esses erros com
  <strong>comentários de código</strong> (se
  necessário) ao invés de imagens pra facilitar minha
  vida. O <code>^</code> representa onde o erro será exibido.
</p>

<p>
  Esses erros são bem simples e fáceis de encontrar e
  corrigir. Mas, você provavelmente já sabe que um ambiente
  de produção é muito mais complexo que isso:
  objetos podem ser aninhados, funções, classes e
  variáveis podem vir de outros módulos, bases de dados e
  o ambiente podem prover APIs (como a DOM, do browser por exemplo), e
  assim por diante. Esses são os casos onde o TypeScript brilha
  ainda mais.
</p>

<p>
  Mas, espera aí! Como o TypeScript está vendo erros no
  meu código sendo que eu ainda nem o compilei? Este, minha amiga
  ou meu amigo, é trabalho do
  <code>tsserver</code> e do Typechecker do TypeScript. Que vamos falar
  logo a seguir.
</p>

<h2>TypeScript – Typechecker e tsserver</h2>

<p>
  <strong>Nota: </strong>você realmente não precisa saber
  de nada disso pra programar em TypeScript ou JavaScript.
</p>

<p>
  Programas são feitos por humanos e para humanos (<a href="https://amzn.to/2B1IZlg">pelo menos alguns</a>
  rsrs), isso quer dizer que a linguagem de programação
  que escolhemos funciona exatamente como um “Idioma”
  qualquer que será traduzido para que o dispositivo entenda e
  execute de alguma forma. Mas, seu código precisa chegar na
  engine do JS de alguma forma, certo? Vamos ver.
</p>

<h3>Como seu código Javascript vai parar na engine do JS</h3>

<p>
  Este processo é feito no JavaScript seguindo os seguintes
  passos (de forma bem resumida):
</p>

<ol>
  <li>
    Seu código JavaScript é convertido em uma
    <a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree">AST</a>;
  </li>
  <li>
    A AST é convertida em
    <a href="https://pt.wikipedia.org/wiki/Bytecode">Bytecode</a>;
  </li>
  <li>O Bytecode é avaliado pela engine.</li>
</ol>

<p>
  Perceba que entre você criar seu código e ele ser
  executado pela engine do JS, nada além de uma conversão
  ocorre do seu código. Se ocorrer um erro (algo digitado
  incorretamente, por exemplo), seu código vai ser executado com
  erro e a engine vai parar no ato do erro. Por isso vemos
  <code>Uncaught TypeError: Bla bla bla</code> por não tratar
  essa exceção, só depois de executar o
  código.
</p>

<h3>Como seu código TypeScript vai parar na engine do JS</h3>

<p>Ao adicionar o TypeScript, esse processo fica bem maior, veja:</p>

<ol>
  <li>
    <strong>Seu código TypeScript é convertido em uma AST
      (TS)</strong>
  </li>
  <li>
    <strong>A AST é analisada pelo Typechecker (TS)</strong>
  </li>
  <li>
    <strong>A AST é convertida em código JavaScript
      (TS)</strong>
  </li>
  <li>
    O código JavaScript é convertido em uma AST (JS)
  </li>
  <li>A AST é convertida em Bytecode (JS);</li>
  <li>O Bytecode é avaliado pela engine (JS);</li>
</ol>

<p>
  Perceba que as partes em negrito foram adicionadas ao processo. Passos
  de 1 a 3 são executados pelo TypeScript; passos de 4 a 6 são
  executados pelo JavaScript. A tipagem é checada nos passos 1 e
  2 (do TS). Do passo 3 em diante, o TypeScript não vai mais
  checar seu código. Em outras palavras, a última coisa
  que o compilador do TypeScript faz é compilar o seu
  código para Javascript, toda a checagem é feita antes da
  compilação.
</p>

<p>
  Por este motivo, eu posso compilar meus códigos JavaScript sem
  tipagem pelo TypeScript (como eu te disse, TypeScript é
  JavaScript). Também é por este motivo, que eu posso
  configurar o nível de restrição do TypeScript (eu
  poderia, por exemplo, não permitir a compilação
  se meu código tiver algum tipo de alerta ou falta de tipagem).
</p>

<h3>tsserver</h3>

<p>
  Eu falei, falei e falei, e acabei não respondendo sua pergunta:
  <strong>Como o TypeScript está vendo erros no meu código
    sendo que eu ainda nem o compilei?</strong>
</p>

<p>
  Quando instalamos o TypeScript, ganhamos duas coisas: o compilador
  (<code>tsc</code>) e um servidor que provê serviços da
  linguagem (<code>tsserver</code>). De fato, você pode ver eles
  na pasta “bin” do “node_modules”. Em nosso dia
  a dia como programador ou programadora, não nos preocupamos com
  o <code>tsserver</code> porque ele geralmente é usado pelo seu
  editor ou IDE. Porém, ele é super importante pra gente.
  É ele que nos permite ter auto completar,
  inspeções de código, navegação,
  refatoração, e muito mais, diretamente no editor que
  usamos para criar nosso código.
</p>

<p>
  Então, respondendo a sua pergunta, o
  <code>tsserver</code> roda em background em alguns editores de
  código fazendo essa checagem. Quando ele encontra algo que
  não bate com a minha configuração do TypeScript,
  ele grifa o trecho de código com aquela linha vermelha ondulada
  dizendo o que está incorreto. Dessa forma, eu não
  preciso executar meu código pra saber que existe um erro nele.
</p>

<h3>vscode</h3>

<p>
  Eu não sei qual editor de códigos você usa, mas
  gosto bastante do
  <a href="https://code.visualstudio.com/">VSCode</a> porque ele
  já vem com o <code>tsserver</code> embutido (muito editores
  também já fazem isso). Com isso, eu posso digitar o meu
  código tranquilamente, sabendo que enquanto o sublinhado
  vermelho não aparecer, provavelmente meu código
  não tem nenhum erro (a não ser de lógica rsrs).
</p>

<p>
  Outra coisa interessante é que se eu passar o mouse sobre
  determinada variável, eu sei exatamente qual o tipo dela. Isso
  em bases de código maiores é uma mão na roda.
</p>

<p>


![Figura 5. VSCode + tsserver exibindo o tipo de uma variável

        ](./imgs/typescript-2.png)



<span class="img-description">Figura 5. VSCode + tsserver exibindo o tipo de uma
variável </span>

</p>

<h4>Fatos interessantes:</h4>

<p>
  O VSCode foi criado pela Microsoft e foi escrito em TypeScript e
  JavaScript com o
  <a href="https://www.electronjs.org/">Electron</a>. Ele usa
  <a href="https://github.com/DefinitelyTyped/DefinitelyTyped">type definitions</a>
  do TypeScript para a maioria das funções do seu
  <a href="https://code.visualstudio.com/docs/editor/intellisense">IntelliSense</a>
  tanto para JavaScript quanto para TypeScript. Portanto, se você
  usa o VSCode para editar seus códigos Javascript, você
  já faz uso extensivo de TypeScript (mesmo sem saber).
</p>

<h2>Instalando e configurando o TypeScript</h2>

<p>
  Se você chegou até aqui, provavelmente eu já
  despertei seu interesse em TypeScript (ou talvez você já
  o tinha). De qualquer forma, que bom! Na minha opinião, se
  você começar a usar o TS nos seus projetos, vai ser
  difícil voltar atrás, vai por mim.
</p>

<p>
  Contudo, isso pode ser algo desafiador em meio a tantas
  opções, não é mesmo? A seguir, vamos ver
  como iniciar um projeto TypeScript do zero. Embora eu não
  vá conseguir te explicar tudo o que existe sobre ele em apenas
  um post, percebo que o mais difícil é iniciar, o resto
  você pode ir aprendendo com o tempo e a
  <a href="https://www.typescriptlang.org/docs/handbook/basic-types.html">documentação</a>.
</p>

<h3>Instalação de programas</h3>

<p>
  Eu gosto de usar algumas coisas nos meus projetos, por isso, a
  configuração que você vai ver a seguir será
  a mesma que utilizo em muitos dos meus projetos. Entretanto, tenha em
  mente que isso vai variar muito de desenvolvedor para desenvolvedor e
  de projeto para projeto. Assim, é provável que
  você verá outras configurações muito
  diferentes por aí, ou talvez você tenha que conversar com
  seu time antes de sair configurando o ambiente de um projeto como um
  todo.
</p>

<p>
  Se você tem experiencia com isso, provavelmente poderá
  pular para “<strong><a href="#Instalando_o_TypeScript,_tsnode_e_eslint">Instalando o TypeScript, ts-node e eslint</a></strong>“.
</p>

<p>
  Antes de começar, você vai precisar do seguinte (se
  quiser o mesmo ambiente que o meu):
</p>

<ul>
  <li>
    Baixar e
    <a href="https://nodejs.org/en/download/">instalar o Node.js</a>;
  </li>
  <li>
    Baixar e
    <a href="https://code.visualstudio.com/">instalar o VSCode</a>;
  </li>
</ul>

<h3>Criando a pasta do projeto</h3>

<p>
  No seu sistema operacional, crie uma pasta exclusiva para o seu
  projeto com o TS. Isso é importante para termos uma pasta
  node_modules e package.json exclusivos para este projeto.
</p>

<p>
  <strong>Nota:</strong> você pode migrar uma base de
  código existente apenas renomeando arquivos
  <strong>.js</strong> para <strong>.ts</strong> e fazendo as
  configurações abaixo. Nesse caso use
  <code>strict</code> como <code>false</code> (você vai ver isso
  abaixo). Além disso, verifique se todos os módulos que
  você utiliza no projeto JS dão suporte para TS. Tenha em
  mente que pode ser necessário modificar coisas complicadas para
  fazer essa migração.
</p>

<p>
  Para um projeto novo (recomendável), apenas abra a nova pasta
  pasta no VSCode, indo em
  <code>File &gt; Open Folder</code> e escolhendo a pasta que você
  acabou de criar.
</p>

<h3>Instalando o TypeScript, ts-node e eslint</h3>

<p>
  Abra o terminal do VSCode em <code>View &gt; Terminal</code> e digite
  o seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">npm</span><span style="color:#A6E3A1"> init</span><span style="color:#A6E3A1"> -y</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">npm</span><span style="color:#A6E3A1"> i</span><span style="color:#A6E3A1"> typescript</span><span style="color:#A6E3A1"> ts-node</span><span style="color:#A6E3A1"> eslint</span><span style="color:#A6E3A1"> @types/node</span><span style="color:#A6E3A1"> -D</span></span></code></pre>
<p>Para que você compreenda o que está instalando:</p>

<ul>
  <li>
    <code>typescript</code> – é o próprio TypeScript
    (<code>tsc</code> e <code>tsserver</code>);
  </li>
  <li>
    <code>ts-node</code> – permite executar scripts do TypeScript
    diretamente;
  </li>
  <li>
    <code>eslint</code> – É o meu
    <a href="https://pt.stackoverflow.com/questions/330821/o-que-significa-executar-lint-no-c%C3%B3digo#:~:text=Um%20linter%20ou%20lint%20%C3%A9%20uma%20ferramenta%20de%20an%C3%A1lise%20est%C3%A1tica%20de%20c%C3%B3digo.&amp;text=Um%20linter%20ou%20lint%20se,c%C3%B3digo%2Dfonte%20em%20linguagem%20C.">linter</a>
    preferido, algumas pessoas preferem o
    <a href="https://palantir.github.io/tslint/">tslint</a>
    (você pode conferir depois);
  </li>
  <li>
    <code>@types/node</code> – São as
    definições de tipo para o Node.js
  </li>
</ul>

<h3>Extensões do VSCode</h3>

<p>
  Para uso do ESLint e do ts-node, eu gosto de duas extensões no
  VSCode.
</p>

<ul>
  <li>
    <a href="https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner">Code Runner</a>
  </li>
  <li>
    <a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint">ESLint</a>
  </li>
</ul>

<p>Instale ambas as extensões no seu VSCode</p>

<p>
  O <strong>Code Runner</strong> habilita a possibilidade executar um
  comando apenas pressionando um botão de “Play” no
  canto superior direito do seu VSCode. Assim, ao invés de
  digitar:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">npx</span><span style="color:#A6E3A1"> ts-node</span><span style="color:#A6E3A1"> index.ts</span></span></code></pre>

<p>
  Eu posso simplesmente configurar o
  <strong>Code Runner </strong>para executar automaticamente este
  comando para todos os meus arquivos TypeScript assim que eu pressionar
  o play. Isso é fantástico para executar rapidamente seus
  código e focar no aprendizado.
</p>

<p>
  O <strong>Eslint</strong> (a extensão) faz a
  integração do <strong>ESLint</strong> (linter) com o
  VSCode.
</p>

<h3>Configurando o ESLint</h3>

<p>
  Vamos instalar alguns plugins para que o ESLint funcione com o
  TypeScript. Para isso, digite no terminal:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">npm</span><span style="color:#A6E3A1"> i</span><span style="color:#A6E3A1"> @typescript-eslint/eslint-plugin</span><span style="color:#A6E3A1"> @typescript-eslint/parser</span><span style="color:#A6E3A1"> -D</span></span></code></pre>

<p>
  Crie um arquivo com o nome .eslintrc.js na raiz do seu projeto e cole
  o seguinte nele:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">module.exports</span><span style="color:#A6E3A1"> =</span><span style="color:#A6E3A1"> {</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">  env:</span><span style="color:#A6E3A1"> {</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    browser:</span><span style="color:#FAB387"> true</span><span style="color:#A6E3A1">,</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    es6:</span><span style="color:#FAB387"> true</span><span style="color:#A6E3A1">,</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    node:</span><span style="color:#FAB387"> true</span><span style="color:#A6E3A1">,</span></span>
<span class="line"><span style="color:#CDD6F4">  },</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">  extends:</span><span style="color:#CDD6F4"> [</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    'eslint:recommended'</span><span style="color:#89B4FA;font-style:italic">,</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    'plugin:@typescript-eslint/eslint-recommended'</span><span style="color:#89B4FA;font-style:italic">,</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    'plugin:@typescript-eslint/recommended'</span><span style="color:#89B4FA;font-style:italic">,</span></span>
<span class="line"><span style="color:#CDD6F4">  ],</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">  globals:</span><span style="color:#A6E3A1"> {</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    Atomics:</span><span style="color:#A6E3A1"> 'readonly',</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    SharedArrayBuffer:</span><span style="color:#A6E3A1"> 'readonly',</span></span>
<span class="line"><span style="color:#CDD6F4">  },</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">  parser:</span><span style="color:#A6E3A1"> '@typescript-eslint/parser',</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">  parserOptions:</span><span style="color:#A6E3A1"> {</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    ecmaVersion:</span><span style="color:#A6E3A1"> 11,</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    sourceType:</span><span style="color:#A6E3A1"> 'module',</span></span>
<span class="line"><span style="color:#CDD6F4">  },</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">  plugins:</span><span style="color:#CDD6F4"> [</span><span style="color:#A6E3A1">'@typescript-eslint'</span><span style="color:#CDD6F4">],</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">  rules:</span><span style="color:#A6E3A1"> {},</span></span>
<span class="line"><span style="color:#CDD6F4">};</span></span></code></pre>

<p>
  E é só, agora você já tem o ESLint
  integrado ao seu VSCode e configurado. No entanto, não
  configurei nenhuma regra do ESLint justamente para que você
  possa fazer suas próprias escolhas. Seu projeto usa aspas
  simples ou duplas? Requer ponto e vírgula? Usa tabs ou
  espaços? Quantos? Enfim, essas são decisões que
  você precisa tomar.
</p>

<p>
  Eu gosto de usar as regras do
  <a href="https://prettier.io/">Prettier</a>, com ponto e
  vírgula, aspas simples e 2 espaços (vou mostrar como
  configurar mais abaixo).
</p>

<h3>Configurando o Code Runner</h3>

<p>
  No seu projeto, crie uma pasta chamada de <code>.vscode</code>. Nessa
  pasta, crie um arquivo chamado de <code>settings.json</code>.
</p>

<p>Cole o seguinte neste arquivo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2">{</span></span>
<span class="line"><span style="color:#9399B2">  "</span><span style="color:#89B4FA">code-runner.executorMap</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">typescript</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#A6E3A1"> "npx ts-node --files"</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">  }</span></span>
<span class="line"><span style="color:#9399B2">}</span></span></code></pre>

<p>
  Note que este arquivo pode já existir. Caso positivo, adicione a
  configuração acima junto com a configuração anterior que pode já estar
  no arquivo settings.json.
</p>

<p>Por exemplo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2">{</span></span>
<span class="line"><span style="color:#9399B2">  "</span><span style="color:#89B4FA">window.zoomLevel</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">  "</span><span style="color:#89B4FA">code-runner.executorMap</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">typescript</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#A6E3A1"> "npx ts-node --files"</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">  }</span></span>
<span class="line"><span style="color:#9399B2">}</span></span></code></pre>

<p>
  No arquivo acima, estou simulando que já existia a
  configuração
  <code>"window.zoomLevel"</code>, então adicionei as
  configurações do <strong>Code Runner</strong> junto.
</p>

<p>
  Agora você pode clicar no “Play” no canto superior
  direito sempre que quiser executar o seu arquivo TypeScript.
</p>

<h3>tsconfig.json</h3>

<p>
  Você pode compilar seus arquivos TypeScript em JavaScript de
  duas maneiras diferentes:
</p>

<ol>
  <li>com parâmetros via linha de comando</li>
  <li>com parâmetros via <code>tsconfig.json</code></li>
</ol>

<p>
  No entanto, não recomendo o uso da primeira
  opção.
</p>

<p>
  Assim, crie um arquivo chamado <code>tsconfig.json</code> na raiz do
  seu projeto e cole o seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2">{</span></span>
<span class="line"><span style="color:#9399B2">  "</span><span style="color:#89B4FA">compilerOptions</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">lib</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#9399B2"> [</span></span>
<span class="line"><span style="color:#A6E3A1">      "es2015"</span></span>
<span class="line"><span style="color:#9399B2">    ],</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">module</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#A6E3A1"> "commonjs"</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">outDir</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#A6E3A1"> "dist"</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">strict</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> true</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">target</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#A6E3A1"> "es2015"</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">esModuleInterop</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> true</span></span>
<span class="line"><span style="color:#9399B2">  },</span></span>
<span class="line"><span style="color:#9399B2">  "</span><span style="color:#89B4FA">include</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#9399B2"> [</span></span>
<span class="line"><span style="color:#A6E3A1">    "src"</span></span>
<span class="line"><span style="color:#9399B2">  ]</span></span>
<span class="line"><span style="color:#9399B2">}</span></span></code></pre>

<p>
  Vamos entender o que fizemos, afinal, é pra isso que você
  está aqui:
</p>

<ul>
  <li>
    <code>lib</code> – configura o ambiente que o TSC vai assumir
    que você está usando. Assim, es2015 assume que o
    ambiente no qual você vai rodar seu código é
    compatível com o ECMAScript 2015.
  </li>
  <li>
    <code>module</code> – configura qual o sistema de
    módulos o TSC vai usar para compilar seu código.
    Geralmente, escolho ‘<code>common.js</code>‘ e ativo
    ‘<code>esModuleInterop</code>‘. Isso me permite usar
    Import/Export em qualquer ambiente. No entanto, se eu fosse usar
    algum ambiente front-end, usaria o
    <a href="https://webpack.js.org/">webpack</a> para fazer meu
    <em>bundle</em>.
  </li>
  <li>
    <code>outDir</code> – É a pasta de saída do seu
    código. Quando você compilar, a pasta de saída
    terá a mesma estrutura da pasta de entrada. Então,
    seus arquivos de produção estarão em
    “dist” após a compilação.
  </li>
  <li>
    <code>strict</code> – Esse é o modo recomendável
    para uso do TS, ativa várias
    <a href="https://www.typescriptlang.org/docs/handbook/compiler-options.html">flags restritivas no TSC</a>. Qualquer coisa que não estiver em conformidade, o
    compilador vai reclamar. Porém, isso só é
    recomendável se você estiver iniciando um projeto do
    zero com TS, se for migrar um código antigo de JS para TS,
    configure como <code>false</code>.
  </li>
  <li>
    <code>target</code> – configura a versão ECMASCript que
    o TSC vai usar para compilar seu código (ES3, ES5, …,
    ES2020, ESNext). Entretanto, o ambiente de produção do
    seu código precisará suportar a versão
    escolhida.
  </li>
  <li><code>esModuleInterop</code> – Ver <code>module</code>.</li>
  <li>
    <code>include</code> – quais pastas o <code>tsc</code> vai
    analisar para compilar.
  </li>
</ul>

<h3>Testando tudo</h3>

<p>
  Como você pôde perceber na configuração
  anterior, nossa pasta de entrada será
  “<strong>src</strong>” e de saída
  “<strong>dist</strong>“. Embora você possa usar a
  configuração que preferir, essa é uma
  convenção muito utilizada atualmente. Então,
  prefira mantê-la.
</p>

<p>
  <strong>Nota:</strong> a pasta <strong>src</strong> precisa ser criada
  manualmente, assim como os arquivos <strong>.ts </strong>dentro dela.
</p>

<p>
  Vamos criar todos os nossos arquivos com extensões
  <strong>.ts</strong> na pasta <strong>src</strong>. Eventualmente,
  vamos compilar nosso código simplesmente digitando
  “<strong>tsc</strong>” (sem aspas) no terminal.
</p>

<p>
  Você terá duas opções para executar seu
  código:
</p>

<ol>
  <li>Usando o ts-node</li>
  <li>Usando o tsc</li>
</ol>

<h4>Código de exemplo</h4>

<p>
  Embora eu ainda não tenha especificado como escrever
  códigos TS. Crie o arquivo
  <code>src/index.ts</code> (arquivo <em>index.ts</em> dentro da pasta
  <em>src</em>) e digite o seguinte para testar:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> name </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Otávio Miranda'</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(name)</span><span style="color:#9399B2">;</span></span></code></pre>

<p>
  Conforme configuramos o <code>tsconfig.json</code> com
  <code>strict = true</code>, você não conseguiria executar
  qualquer JS sem tipagem adequada (alguns sim, outros não). No
  trecho acima estou usando a inferência de tipos do TypeScript.
  Porém, se quiser executar qualquer JS normal (sem tipagem)
  dentro do seu script TS, modifique <code>strict</code> para
  <code>false</code>.
</p>

<h4>ts-node</h4>

<p>
  Para usar o <code>ts-node</code>, digite seu código dentro de
  um arquivo (suponha <code>index.ts</code>) ou use meu código de
  exemplo (acima) e pressione o play no canto superior direito da tela.
  Similarmente, você pode simplesmente digitar:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CDD6F4">npx ts</span><span style="color:#94E2D5">-</span><span style="color:#CDD6F4">node src</span><span style="color:#94E2D5">/</span><span style="color:#CDD6F4">index</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">ts</span></span></code></pre>

<p>
  Se o arquivo <code>index.ts</code> importar qualquer outro
  módulo, ele será compilado temporariamente apenas para
  exibir o resultado no terminal. Embora isso não compile
  códigos reais, é super interessante para
  execução rápida de códigos
  <em><a href="https://www.mairovergara.com/on-the-fly-o-que-significa-esta-expressao/">on the fly</a></em>. Contudo, você vai precisar compilar seu código em
  algum momento. Para isso, use <code>tsc</code>.
</p>

<h4>tsc</h4>

<p>
  Anteriormente, vimos uma maneira simples para compilar códigos
  temporariamente (sem criar novos arquivos) com
  <code>ts-node</code>. Contudo, você vai precisar dos arquivos
  para produção, afinal, o código JS é que
  será executado no ambiente de produção. Portanto,
  para compilar realmente seu código (gerando os arquivos na
  pasta <strong>dist</strong>), simplesmente digite no terminal:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CDD6F4">npx tsc</span></span></code></pre>

<p>
  O compilador irá usar as configurações no
  <code>tsconfig.json</code> a fim de gerar nossos arquivos JS.
  Além disso, ele criará e atualizará a pasta
  “<strong>dist</strong>” com os arquivos de saída.
  Embora não necessário, dê uma olhada nos arquivos
  gerados na pasta <strong>dist</strong>.
</p>

<p>
  Depois que compilei o código <strong>TS</strong>, meu arquivo
  <code>dist/index.js</code> ficou assim:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#A6E3A1">"use strict"</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> name </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Otávio Miranda'</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(name)</span><span style="color:#9399B2">;</span></span></code></pre>

<p>
  Ou seja, quase nenhuma diferença do arquivo original. Todavia,
  os arquivos reais de produção devem ficar extremamente
  diferentes dos originais, vai por mim.
</p>

<p>
  Uma outra forma de compilação é o modo
  “<strong>watch</strong>“, onde o <code>tsc</code> fica
  “<em>assistindo</em>” mudanças no seu código
  a fim de gerar automaticamente os arquivos de saída. Para usar
  o modo “<strong>watch</strong>“, digite:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CDD6F4">npx tsc </span><span style="color:#94E2D5">-</span><span style="color:#CDD6F4">w</span></span></code></pre>

<p>
  Você vai perceber que o <code>tsc</code> vai ficar assistindo
  modificações no seu código e atualizando a
  saída assim que você salvar seu arquivo. Para parar,
  pressione CTRL + C no terminal.
</p>

<h3>
  Prettier e formatação automática (opcional)
</h3>

<p>
  Como eu te disse anteriormente, gosto bastante de usar as
  configurações do “Prettier” e a
  formatação automática em meus códigos.
  Embora opcional, você pode fazer essa configuração
  como mostro abaixo.
</p>

<h4>Instalando os pacotes do Prettier</h4>

<p>Digite o seguinte no terminal:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">npm</span><span style="color:#A6E3A1"> i</span><span style="color:#A6E3A1"> prettier</span><span style="color:#A6E3A1"> eslint-config-prettier</span><span style="color:#A6E3A1"> eslint-plugin-prettier</span><span style="color:#A6E3A1"> -D</span></span></code></pre>

<p>
  Não tenho muito o que te explicar sobre isso, são pacotes necessários
  para o funcionamento do Prettier com o ESLint.
</p>

<p>
  Crie um arquivo chamado .prettierrc.js na raiz do seu projeto e cole o
  seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CDD6F4">module.exports = </span><span style="color:#9399B2">{</span></span>
<span class="line"><span style="color:#CDD6F4">  semi</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> true</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#CDD6F4">  trailingComma</span><span style="color:#9399B2">:</span><span style="color:#CDD6F4"> 'all'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#CDD6F4">  singleQuote</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> true</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#CDD6F4">  printWidth</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> 80</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#CDD6F4">  tabWidth</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> 2</span></span>
<span class="line"><span style="color:#9399B2">}</span></span></code></pre>

<p>As configurações são as seguintes:</p>

<ul>
  <li>
    <code>semi</code> – força o uso de ponto e
    vírgula;
  </li>
  <li>
    <code>trailingComma</code> – deixa uma vírgula ao final
    de arrays, objetos, etc;
  </li>
  <li>
    <code>singleQuote</code> – prefere o uso de aspas simples
  </li>
  <li>
    <code>printWidth</code> – tenta quebrar linhas com 80
    caracteres ou mais;
  </li>
  <li>
    <code>tabWidth</code> – usa dois espaços para tab;
  </li>
</ul>

<h4>Configurando a formatação automática</h4>

<p>
  O legal é que agora você pode acessar as
  configurações do VSCode e solicitar a
  formatação automática afim de formatar seu
  arquivo assim que você salvá-lo. Para isso, clique em
  <code>"File" &gt; "Preferences" &gt;
    "Settings"</code>. No canto superior direito da tela, clique no ícone
  <code>"Open settings (JSON)"</code>. Por fim, cole o
  seguinte nas configurações:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2">{</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">  // Configurações já existentes</span></span>
<span class="line"><span style="color:#9399B2">  "</span><span style="color:#89B4FA">editor.codeActionsOnSave</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">source.fixAll.eslint</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> true</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">    "</span><span style="color:#89B4FA">source.fixAll</span><span style="color:#9399B2">"</span><span style="color:#9399B2">:</span><span style="color:#FAB387"> true</span></span>
<span class="line"><span style="color:#9399B2">  },</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">  // Mais configurações existentes</span></span>
<span class="line"><span style="color:#9399B2">}</span></span></code></pre>

<p>
  Assim, quando você salvar o seu arquivo, ele será
  automaticamente formatado com o Prettier e o ESLint.
</p>

<h4>Ajustando o eslint</h4>

<p>
  Agora, precisamos adicionar o <em>prettier</em> na
  configuração “<em>extends</em>” do seu
  <code>.eslintrc.js</code>.
</p>

<p>
  Abra o <code>.eslintrc.js</code>, que atualmente deve estar assim:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7;font-style:italic">module</span><span style="color:#94E2D5">.</span><span style="color:#CBA6F7;font-style:italic">exports</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">  // outras configs</span></span>
<span class="line"><span style="color:#CDD6F4">  extends</span><span style="color:#94E2D5">:</span><span style="color:#CDD6F4"> [</span></span>
<span class="line"><span style="color:#A6E3A1">    'eslint:recommended'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#A6E3A1">    'plugin:@typescript-eslint/eslint-recommended'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#A6E3A1">    'plugin:@typescript-eslint/recommended'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#CDD6F4">  ]</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">  // outras configs</span></span>
<span class="line"><span style="color:#9399B2">};</span></span></code></pre>

<p>
  Em extends, adicione 'plugin:prettier/recommended', dessa maneira:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7;font-style:italic">module</span><span style="color:#94E2D5">.</span><span style="color:#CBA6F7;font-style:italic">exports</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">  // outras configs</span></span>
<span class="line"><span style="color:#CDD6F4">  extends</span><span style="color:#94E2D5">:</span><span style="color:#CDD6F4"> [</span></span>
<span class="line"><span style="color:#A6E3A1">    'eslint:recommended'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#A6E3A1">    'plugin:@typescript-eslint/eslint-recommended'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#A6E3A1">    'plugin:@typescript-eslint/recommended'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#A6E3A1">    'plugin:prettier/recommended'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#CDD6F4">  ]</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">  // outras configs</span></span>
<span class="line"><span style="color:#9399B2">};</span></span></code></pre>

<p>Como na <strong>linha 7</strong> do exemplo acima.</p>

<p>
  Se você adicionou tudo corretamente, agora o
  <em>prettier</em> e a
  <em>formatação automática</em> já devem
  estar funcionando.
</p>

<h2>Tipos básicos e inferência de tipos do TypeScript</h2>

<p>
  Até aqui você leu coisas superficiais sobre o TypeScript.
  Você sabe o que é, como configurar, mas ainda não
  viu uma das coisas que faz ele ser o que é e ter a popularidade
  que tem atualmente, os
  <strong>Tipos</strong>.
</p>

<h3>Um perigo: A tipagem fraca e dinâmica do JS</h3>

<p>
  O Javascript é uma linguagem de tipagem fraca e dinâmica.
  Fraca porque você consegue fazer coisas como
  <code>10 / '20'</code> e o JavaScript se vira de alguma
  maneira pra retornar um <code>0.5</code>. Quem não conhece JS
  pode assustar com esse resultado (mas está certo).
</p>

<p>
  Isso pode ser algo ruim do ponto de vista lógico, quando
  <code>10 / '20'</code> um seria <code>0.5</code>? Só
  podemos presumir que isso foi uma coerção de tipos,
  portanto, entendemos um dos valores foi convertido pra outro tipo
  automaticamente. A string 20 foi convertida em number. Isso
  caracteriza uma linguagem de <strong>tipagem fraca</strong>.
</p>

<p>
  Linguagens de tipagem forte, provavelmente levantariam uma
  exceção neste ponto do seu código.
</p>

<p>
  E dinâmica porque você não precisa declarar os
  tipos com antecedência e o tipo pode mudar ao longo do
  código, uma variável que muda de valor, também
  pode mudar de tipo. Em momento algum eu preciso falar que
  <code>10</code> é um <code>number</code>, que
  <code>true</code> é um <code>boolean</code>, que
  <code>'Luiz'</code> é uma <code>string</code>. Ele faz
  isso automaticamente também. Isso caracteriza uma linguagem de
  <strong>tipagem dinâmica</strong>.
</p>

<p>
  Essas duas coisas combinadas podem trazer um benefício
  excelente, a <strong>flexibilidade</strong>. É algo
  extremamente simples escrever códigos em Javascript. Mas, aqui
  também mora um perigo iminente. Programadores precisam tomar um
  <strong>cuidado extremo</strong> e escrever testes além do
  necessário apenas para garantir que os tipos dos valores
  estão corretos. Do contrário, um erro assim poderia
  chegar em produção sem que soubéssemos:
</p>

<p><code>10 / [20, 10] // NaN</code></p>

<h3>A tipagem forte, estática e inferida do TypeScript</h3>

<p>
  Por outro lado, o TS tem tipagem forte, estática e inferida (a
  inferência é muito importante aqui,
  atenção).
</p>

<p>
  Se eu escrevo um código assim no TypeScript, imediatamente
  tenho um erro, veja:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">let</span><span style="color:#CDD6F4"> number1 </span><span style="color:#94E2D5">=</span><span style="color:#FAB387"> 10</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CBA6F7">let</span><span style="color:#CDD6F4"> number2 </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> '20'</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // string</span></span>
<span class="line"><span style="color:#CBA6F7">let</span><span style="color:#CDD6F4"> number3 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> number1 </span><span style="color:#94E2D5">/</span><span style="color:#CDD6F4"> number2</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">//                      ^</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// The right-hand side of an arithmetic</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// operation must be of type 'any',</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// 'number', 'bigint' or an enum type.ts(2363)</span></span></code></pre>

<p>
  Aqui o TS usa um recurso muito interessante chamado de
  <strong>inferência de tipos</strong>. Perceba que eu deixei
  comentado os tipos das duas primeiras variáveis (a
  última foi um erro). Esses tipos foram inferidos
  automaticamente pelo TypeScript, em momento algum eu disse que
  <code>10</code> era um <code>number</code> e que
  <code>'20'</code> era uma <code>string</code>. Mas está
  igual ao JS, tipagem dinâmica? Não!
</p>

<p>
  A inferência de tipos é uma forma do TypeScript modelar o
  comportamento do JavaScript e também de deixar o seu
  código mais limpo. Você não precisa adicionar
  tipagem em coisas óbvias (salvo em casos onde ele não
  consegue inferir um tipo). No entanto, uma vez que o tipo for
  inferido, ele não poderá mais ser alterado (e aqui
  estamos falando em tipo, não em valor).
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">let</span><span style="color:#CDD6F4"> number1 </span><span style="color:#94E2D5">=</span><span style="color:#FAB387"> 10</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CDD6F4">number1 </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> '20'</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// ^</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Type '"20"' is not assignable to type 'number'.ts(2322)</span></span></code></pre>

<p>
  Em conclusão, minha dica pra você que está iniciando com o TS seria:
  só coloque tipos em coisas que não são óbvias, evite sair adicionando
  tipo em todas as suas variáveis. Quando o TS não conseguir inferir um
  tipo, ele vai te avisar. Use o seu editor para saber qual tipo foi
  inferido. Geralmente basta passar o mouse sobre a variável e o editor
  (como o VSCode) irá lhe informar o tipo da variável.
</p>

<p>


![Figura 6. A inferência de tipos consegue saber o tipo de retorno da função e repassar isso para a variável.
        ](./imgs/Peek-14-06-2020-17-38.gif)


  <span class="img-description">Figura 6. A inferência de tipos consegue saber o tipo de retorno da
    função e repassar isso para a variável.
  </span>
</p>

<h3>Tipos mais básicos</h3>

<p>
  O TS suporta todos os tipos que você tem o costume de usar em
  JS, como: boolean, number, bigint, symbol, string, array, null,
  undefined e object. Além disso, ele também adiciona seus
  próprios tipos, como: any, tuple, void, never e Enum.
</p>

<p>
  A maneira que eu tenho para informar qual o tipo da minha
  variável, parâmetro ou retorno de funções e
  métodos é com
  <code>:</code> (dois pontos). Existem algumas outras maneiras, mas
  vamos deixar isso de lado por enquanto.
</p>

<p>
  Por exemplo, aqui eu vou
  <strong>quebrar minha própria dica (sobre inferência)</strong>
  e vou adicionar os tipos em tudo o que for possível só
  pra você ver a estrutura:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic">/* eslint-disable */</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Se você não desativar o ESLint aqui, não conseguirá</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// declarar esses tipos que seriam inferidos naturalmente</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> name</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> string</span><span style="color:#94E2D5"> =</span><span style="color:#A6E3A1"> 'Luiz'</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // string</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> age</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#94E2D5"> =</span><span style="color:#FAB387"> 30</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> birthday</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> Date </span><span style="color:#94E2D5">=</span><span style="color:#CBA6F7;font-weight:bold"> new</span><span style="color:#89B4FA;font-style:italic"> Date</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'1990-06-14T00:00:00-03:00'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // Date</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> addresses</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> Array</span><span style="color:#89DCEB">&lt;</span><span style="color:#CBA6F7">string</span><span style="color:#89DCEB">&gt;</span><span style="color:#94E2D5"> =</span><span style="color:#CDD6F4"> [</span><span style="color:#A6E3A1">'Rua 1'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'Rua 2'</span><span style="color:#CDD6F4">]</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // array de strings</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> parentNames</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> string</span><span style="color:#F9E2AF;font-style:italic">[] </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> [</span><span style="color:#A6E3A1">'João'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'Maria'</span><span style="color:#CDD6F4">]</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // array de strings</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> isEmployed</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> boolean</span><span style="color:#94E2D5"> =</span><span style="color:#FAB387"> true</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Meu nome é </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">name</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1"> e tenho </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">age</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1"> anos.`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Nasci em </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">birthday</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">toLocaleString</span><span style="color:#A6E3A1">()</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1">, moro em </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">addresses</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">join</span><span style="color:#A6E3A1">(</span><span style="color:#A6E3A1">', '</span><span style="color:#A6E3A1">)</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1">.`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Meus pais são </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">parentNames</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">join</span><span style="color:#A6E3A1">(</span><span style="color:#A6E3A1">' e '</span><span style="color:#A6E3A1">)</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1">`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Eu </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">isEmployed</span><span style="color:#94E2D5"> ?</span><span style="color:#A6E3A1"> 'estou'</span><span style="color:#94E2D5"> :</span><span style="color:#A6E3A1"> 'não estou'</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1"> empregado atualmente.`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">/*</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">Saída:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">Meu nome é Luiz e tenho 30 anos.</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">Nasci em 14/06/1990 00:00:00, moro em Rua 1, Rua 2.</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">Meus pais são João e Maria</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">Eu estou empregado atualmente.</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">*/</span></span></code></pre>

<p>
  Perceba que todos esses tipos seriam inferidos naturalmente por serem
  óbvios, basta o TS olhar o valor para saber o tipo. Então, eu poderia
  limpar drasticamente meu código os removendo.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> name </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Luiz'</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // string</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> age </span><span style="color:#94E2D5">=</span><span style="color:#FAB387"> 30</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> birthday </span><span style="color:#94E2D5">=</span><span style="color:#CBA6F7;font-weight:bold"> new</span><span style="color:#89B4FA;font-style:italic"> Date</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'1990-06-14T00:00:00-03:00'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // Date</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> addresses </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> [</span><span style="color:#A6E3A1">'Rua 1'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'Rua 2'</span><span style="color:#CDD6F4">]</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // array de strings</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> parentNames </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> [</span><span style="color:#A6E3A1">'João'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'Maria'</span><span style="color:#CDD6F4">]</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // array de strings</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> isEmployed </span><span style="color:#94E2D5">=</span><span style="color:#FAB387"> true</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // boolean</span></span></code></pre>

<p>
  Menos em objetos um pouco mais complexos, como array e date, o
  TypeScript foi capaz de inferir os tipos.
</p>

<p>
  O ideal seria você adicionar tipos em coisas onde o tipo não é tão
  óbvio assim. Por exemplo, os parâmetros de uma função não são óbvios,
  eu poderia passar literalmente qualquer coisa sem que o JS reclamasse.
  Esses parâmetros devem ter tipos em TypeScript.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic">// Essa função precisa receber um array de números</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// posso representar isso com number[] ou Array&lt;number&gt;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> sumNumbers</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">arrayOfNumbers</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#F9E2AF;font-style:italic">[]</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> =&gt;</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">return</span><span style="color:#CDD6F4"> arrayOfNumbers</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">reduce</span><span style="color:#CDD6F4">(</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">s</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> v</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> =&gt;</span><span style="color:#CDD6F4"> s </span><span style="color:#94E2D5">+</span><span style="color:#CDD6F4"> v)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> result </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> sumNumbers</span><span style="color:#CDD6F4">([</span><span style="color:#FAB387">1</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 2</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 3</span><span style="color:#CDD6F4">])</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(result)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // 6</span></span></code></pre>

<p>
  Além disso, eu também poderia representar isso com o
  <a href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/rest_parameters">rest operator (…)</a>.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic">// Agora qualquer parâmetro dessa função deve</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// ser um número</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> sumNumbers</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> (</span><span style="color:#94E2D5">...</span><span style="color:#EBA0AC;font-style:italic">nums</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#F9E2AF;font-style:italic">[]</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> =&gt;</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">  return</span><span style="color:#CDD6F4"> nums</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">reduce</span><span style="color:#CDD6F4">(</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">s</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> v</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> =&gt;</span><span style="color:#CDD6F4"> s </span><span style="color:#94E2D5">+</span><span style="color:#CDD6F4"> v)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> result </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> sumNumbers</span><span style="color:#CDD6F4">(</span><span style="color:#FAB387">1</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 2</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 3</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(result)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // 6</span></span></code></pre>

<p>
  Conforme você também pôde notar nos códigos
  anteriores, a maioria dos tipos básicos são adicionados
  com letra minúscula: boolean, number, bigint, symbol, string,
  array, null, undefined e object.
</p>

<h3>Tipos básicos que existem apenas no TypeScript</h3>

<p>
  Alguns dos tipos que indiquei anteriormente, existem apenas no
  TypeScript, como any, tuple, void, never e Enum. Então vamos
  ver quando usá-los:
</p>

<h4>any</h4>

<p>
  Esse é um tipo que você não gostaria de ter no seu
  código (a não ser que não tenha outra
  opção). Significa a mesma coisa que “qualquer
  coisa” (assim como no JS).
</p>

<p>
  O fato aqui é que tudo precisa ter um tipo em tempo de
  compilação no TypeScript, quando você não
  fornecer um tipo e o TSC também não conseguir inferir um
  tipo correto, o padrão será “any” (qualquer
  coisa). Assim, você não terá funções
  de intelliSense (auto completar, erros, etc). O any aceitará
  literalmente qualquer coisa que você pedir pra ele fazer.
</p>

<p>Por exemplo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic">// Agora a função recebe qualquer coisa</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> sumNumbers</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> (</span><span style="color:#94E2D5">...</span><span style="color:#EBA0AC;font-style:italic">anything</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> any</span><span style="color:#F9E2AF;font-style:italic">[]</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> =&gt;</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">  return</span><span style="color:#CDD6F4"> anything</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">reduce</span><span style="color:#CDD6F4">(</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">s</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> v</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> =&gt;</span><span style="color:#CDD6F4"> s </span><span style="color:#94E2D5">+</span><span style="color:#CDD6F4"> v)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> result </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> sumNumbers</span><span style="color:#CDD6F4">(</span><span style="color:#FAB387">1</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 2</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'a'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // O tipo dessa variável é any</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(result)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // 3a &lt;- Resultado inesperado</span></span></code></pre>

<p>
  Evite usar <code>any</code> a todo o custo. Quase sempre tem uma
  opção melhor.
</p>

<h4>tuple</h4>

<p>Uma tupla é um array de tamanho fixo. Por exemplo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic">// O tipo é [string, number]</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> personFirstNameAndAge</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> [</span><span style="color:#CBA6F7">string</span><span style="color:#9399B2">,</span><span style="color:#CBA6F7"> number</span><span style="color:#F9E2AF;font-style:italic">] </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> [</span><span style="color:#A6E3A1">'Luiz'</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 30</span><span style="color:#CDD6F4">]</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(personFirstNameAndAge)</span><span style="color:#9399B2">;</span></span></code></pre>

<p>
  Perceba que a tupla em TypeScript é representada como um array,
  porém ela é muito mais específica. Os tipos
  precisam bater exatamente com os valores. No exemplo acima, minha
  tupla precisa ter uma string na posição 0 e um
  número na posição 1. Eu consigo alterar os
  valores apenas se forem do mesmo tipo.
</p>

<p>
  Tupas podem ter quantos valores você quiser, não
  são apenas dois como no exemplo acima.
</p>

<h4>void</h4>

<p>
  Embora represente um “não valor”, é
  interessante em alguns casos representar um método ou
  função que não tenha retorno, por exemplo:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">function</span><span style="color:#89B4FA;font-style:italic"> showLog</span><span style="color:#9399B2">()</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> void</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CDD6F4">  console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'Hey, sou o log.'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span></code></pre>

<p>
  Essa função não tem retorno, por isso
  representamos seu retorno com “void”.
</p>

<h4>never</h4>

<p>
  Você já imaginou um método ou função
  que NUNCA retorna? Sim, eu posso ter funções que nunca
  retornam mas lançam um erro. Por exemplo:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">function</span><span style="color:#89B4FA;font-style:italic"> error</span><span style="color:#9399B2">()</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> never</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">  throw</span><span style="color:#CBA6F7;font-weight:bold"> new</span><span style="color:#89B4FA;font-style:italic"> Error</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'NUNCA VOU RETORNAR'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">error</span><span style="color:#CDD6F4">()</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // Error: NUNCA VOU RETORNAR</span></span></code></pre>

<p>
  O retorno dessa função nunca vai ocorrer, porque o erro
  ocorre antes.
</p>

<h4>Enum</h4>

<p>
  Enums são uma maneira de enumerar valores. Uma estrutura de
  dados não ordenada que mapeiam chaves para valores. São
  muito usados quando pessoas querem dar um determinado número de
  opções de escolha (choice).
</p>

<p>
  Por exemplo, na função abaixo, só posso receber
  parâmetros do tipo
  “<code>ProgrammingLanguages</code>“, nada mais que isso.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">enum</span><span style="color:#F9E2AF;font-style:italic"> ProgrammingLanguages</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#94E2D5">  Python</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#94E2D5">  JavaScript</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#94E2D5">  TypeScript</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">function</span><span style="color:#89B4FA;font-style:italic"> yourPreferedProgrammingLanguage</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">choice</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> ProgrammingLanguages</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CDD6F4">  console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Você gosta de </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">ProgrammingLanguages</span><span style="color:#A6E3A1">[</span><span style="color:#CDD6F4">choice</span><span style="color:#A6E3A1">]</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1">`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Você gosta de TypeScript</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">yourPreferedProgrammingLanguage</span><span style="color:#CDD6F4">(ProgrammingLanguages</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">TypeScript)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Você gosta de JavaScript</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">yourPreferedProgrammingLanguage</span><span style="color:#CDD6F4">(ProgrammingLanguages</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">JavaScript)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Você gosta de Python</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">yourPreferedProgrammingLanguage</span><span style="color:#CDD6F4">(ProgrammingLanguages</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">Python)</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Error</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Argument of type '"Java"' is not assignable to</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// parameter of type 'ProgrammingLanguages'.ts(2345)</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">yourPreferedProgrammingLanguage</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'Java'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span></code></pre>

<p>
  Te confesso que não uso muito essa estrutura (tem outras
  maneira de fazer “choices” em TS).
</p>

<h3>Salvando tipos em variáveis</h3>

<p>
  É claro que você também pode reusar os tipos que
  você cria, para isso você pode usar Type ou Interface.
  Não vou me aprofundar tanto nisso aqui, porque esse post
  está mais imenso do que eu poderia imaginar. Porém,
  você pode ver um tutorial sobre isso
  <a href="https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases">aqui para Type</a>
  e
  <a href="https://www.typescriptlang.org/docs/handbook/interfaces.html">aqui para Interfaces</a>.
</p>

<p>
  Por exemplo, imagine que eu queira criar uma calculadora com
  funções. Todas as operações serão
  iguais, add (somar), div (dividir), sub (subtrair), mul (multiplicar).
  Todas essas funções receberiam x (number) e y (number).
  Eu posso facilmente criar um Type Alias ou uma Interface para mapear o
  tipo de todas essas funções a fim de reutilizar a
  tipagem.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic">// Usando type para declarar o tipo de uma função</span></span>
<span class="line"><span style="color:#CBA6F7">type</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CBA6F7"> number</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> add</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">+</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> div</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">/</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> sub</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">-</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> mul</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">*</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> onePlusTwo </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> add</span><span style="color:#CDD6F4">(</span><span style="color:#FAB387">1</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 2</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(onePlusTwo)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // 3</span></span></code></pre>

<p>
  Perceba que o tipo CalculatorFn agora pode ser utilizado em qualquer
  função que implemente essa assinatura. Além disso, eu já fiz a tipagem
  dos parâmetros também, então não preciso adicionar tipos de x e y em
  cada uma das funções.
</p>

<p>
  Similarmente, posso fazer o mesmo com Interfaces (em várias ocasiões,
  Type Alias e Interfaces podem ser usados para fazer a mesma coisa).
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic">// Usando type para declarar o tipo de uma função</span></span>
<span class="line"><span style="color:#CBA6F7">interface</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#9399B2">  (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#9399B2">)</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> number</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> add</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">+</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> div</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">/</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> sub</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">-</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#89B4FA;font-style:italic"> mul</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> CalculatorFn </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> (</span><span style="color:#EBA0AC;font-style:italic">x</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> y</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> =&gt;</span><span style="color:#CDD6F4"> x </span><span style="color:#94E2D5">*</span><span style="color:#CDD6F4"> y</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CDD6F4"> onePlusTwo </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> add</span><span style="color:#CDD6F4">(</span><span style="color:#FAB387">1</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 2</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // number</span></span>
<span class="line"><span style="color:#CDD6F4">console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(onePlusTwo)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // 3</span></span></code></pre>

<p>
  Para casos mais simples assim, eu prefiro usar Type Alias, para casos
  mais complexos, talvez use Interfaces.
</p>

<p>Eu posso fazer isso com qualquer tipo, por exemplo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">type</span><span style="color:#F9E2AF;font-style:italic"> NumberOrString </span><span style="color:#94E2D5">=</span><span style="color:#CBA6F7"> number</span><span style="color:#94E2D5"> |</span><span style="color:#CBA6F7"> string</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // | significa OU (union type)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">function</span><span style="color:#89B4FA;font-style:italic"> sayIt</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">it</span><span style="color:#94E2D5">:</span><span style="color:#F9E2AF;font-style:italic"> NumberOrString</span><span style="color:#9399B2">)</span><span style="color:#94E2D5">:</span><span style="color:#CBA6F7"> void</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CDD6F4">  console</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">log</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">`Você disse: </span><span style="color:#9399B2">${</span><span style="color:#CDD6F4">it</span><span style="color:#9399B2">}</span><span style="color:#A6E3A1">`</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">sayIt</span><span style="color:#CDD6F4">(</span><span style="color:#FAB387">10</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // Você disse: 10</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">sayIt</span><span style="color:#CDD6F4">(</span><span style="color:#A6E3A1">'Olá'</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span><span style="color:#9399B2;font-style:italic"> // Você disse: Olá</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Error:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// Argument of type '{}' is not</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// assignable to parameter</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">// of type 'NumberOrString'.</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">sayIt</span><span style="color:#CDD6F4">(</span><span style="color:#9399B2">{}</span><span style="color:#CDD6F4">)</span><span style="color:#9399B2">;</span></span></code></pre>

<p>
  Perceba também que além de usar Type Alias,
  também usei Union Type. Da uma lida sobre isso
  <a href="https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types">aqui</a>.
</p>

<h2>Concluindo</h2>

<p>
  Como eu te disse no comecinho, essa seria uma longa
  introdução ao TypeScript. Falamos sobre muita coisa,
  porém ainda tem muito, mas muito mais para você aprender.
  O local que sempre indico para quem me pergunta onde e como aprender
  TypeScript é na documentação, mais
  especificamente na parte do
  <a href="https://www.typescriptlang.org/docs/handbook/basic-types.html">Handbook</a>.
</p>

<p>
  Tenho a intenção de trazer mais conteúdo como
  este aqui para o blog, então fique de olho.
</p>

