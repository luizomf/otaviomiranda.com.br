---
title: 'Funções recursivas com Python'
description:
  'Funções recursivas com Python (ou qualquer linguagem de programação) são
  funções que chamam a si mesmas de maneira direta ou indireta.'
date: 2018-06-20
---

<h1>Funções recursivas com Python</h1>

<p class="author">
  <span class="meta-date">
    <time datetime="2018-06-20">20 de junho de 2020</time>
  </span>
  ·
  <span class="meta-author">Luiz Otávio Miranda</span>
</p>

<p>
  Funções recursivas com Python (ou qualquer linguagem de
  programação) são funções que chamam
  a si mesmas de maneira direta ou indireta. Infelizmente, não
  há nenhum benefício em termos de desempenho ao usar
  funções recursivas em
  <a href="https://www.otaviomiranda.com.br/2017/cursos-de-python-e-javascript-com-desconto/">Python</a>, já que laços podem resolver o problema com mais
  eficiência. Porém, funções recursivas podem
  ser mais intuitivas para o programador quando um problema pode ser
  dividido em problemas menores de mesmo tipo.
</p>

<p>
  Considere o conceito de
  <a href="https://www.todamateria.com.br/fatorial/">fatorial da matemática</a>: o fatorial de um número é calculado pela
  multiplicação desse número por todos os seus
  antecessores até chegar ao número 1.
</p>

<p>
  Esse é um problema extremamente simples para ser resolvido com
  recursão por dois fatores:
</p>

<ul>
  <li>
    É um problema que pode ser dividido em sub-problemas menores
    e de mesmo tipo (multiplicar um número pelos seus
    antecessores)
  </li>
  <li>
    Temos um <em>caso-base</em> para parar a recursão, retornar
    um valor real e resolver as equações (quando chegarmos
    em 1)
  </li>
</ul>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> fatorial</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">n</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">    if</span><span style="color:#CDD6F4"> n </span><span style="color:#94E2D5">==</span><span style="color:#FAB387"> 1</span><span style="color:#CBA6F7"> or</span><span style="color:#CDD6F4"> n </span><span style="color:#94E2D5">==</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#FAB387"> 1</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#CDD6F4"> n </span><span style="color:#94E2D5">*</span><span style="color:#89B4FA"> fatorial</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">n </span><span style="color:#94E2D5">-</span><span style="color:#FAB387"> 1</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    fat5 </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> fatorial</span><span style="color:#9399B2">(</span><span style="color:#FAB387">5</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">fat5</span><span style="color:#9399B2">)</span></span></code></pre>

<p>O resultado da execução da função acima será 120.</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># 5 * 4 * 3 * 2 * 1 = 120</span></span></code></pre>

<p>
  <strong>Observação:</strong> você poderia escrever
  uma condição mais concisa eliminando o
  <code>or</code> da expressão com “<code>if n &lt; 2</code>” ao invés de “<code>if n == 1 or n == 0</code>“.
</p>
<h2>Caso-base e caso recursivo</h2>

<p>
  É muito fácil escrever uma função
  recursiva incorretamente e cair em uma recursão infinita. Veja
  isso no código a seguir:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> recursao_infinita</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">numero</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#94E2D5"> =</span><span style="color:#FAB387"> 100</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#89B4FA"> recursao_infinita</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">numero </span><span style="color:#94E2D5">-</span><span style="color:#FAB387"> 1</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#89B4FA">    recursao_infinita</span><span style="color:#9399B2">()</span></span></code></pre>

<p>
  O Python não vai permitir que este código execute infinitamente, então
  você deverá ver uma exceção:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># RecursionError: maximum recursion depth exceeded</span></span></code></pre>

<p>
  Isso ocorre porque nunca dissemos para a função quando
  parar a recursão, mais especificamente, não adicionamos
  um
  <a href="https://pt.wikipedia.org/wiki/Caso_base">caso-base na função</a>.
</p>

<p>
  Toda função recursiva é composta de, pelo menos,
  duas partes: caso-base e caso recursivo. O caso-base é quando a
  função <em>NÃO</em> chama a si mesma, mas retorna
  um valor real; já o caso recursivo, como o próprio nome
  indica, é onde a recursividade ocorre (a função
  chama a si mesma).
</p>

<p>
  Veja uma nova função recursiva, porém com ambos
  os casos: caso-base e caso recursivo.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> contagem_regressiva_recursiva</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">comeca_em</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#94E2D5"> =</span><span style="color:#FAB387"> 10</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> termina_em</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#94E2D5"> =</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">    """</span></span>
<span class="line"><span style="color:#A6E3A1">    Contagem regressiva iniciando em 'comeca_em' e terminando em 'termina_em'</span></span>
<span class="line"><span style="color:#A6E3A1">    """</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">comeca_em</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # Caso-base</span></span>
<span class="line"><span style="color:#CBA6F7">    if</span><span style="color:#CDD6F4"> comeca_em </span><span style="color:#94E2D5">&lt;=</span><span style="color:#CDD6F4"> termina_em</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # Perceba que aqui um valor real é retornado</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # e não há mais recursão</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#CDD6F4"> comeca_em</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # Caso recursivo</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # Esse código será executado sempre, até</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # 'comeca_em' se tornar menor ou igual a 'termina_em'</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#89B4FA"> contagem_regressiva_recursiva</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">comeca_em </span><span style="color:#94E2D5">-</span><span style="color:#FAB387"> 1</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#89B4FA">    contagem_regressiva_recursiva</span><span style="color:#9399B2">()</span></span></code></pre>

<h2>Call stack</h2>

<p>
  Sempre que invocamos uma função, dados do seu escopo
  interno (como variáveis e parâmetros) precisam ser salvos
  em algum local. Além disso, também precisamos saber
  quando a função retorna um valor para que o programa
  continue a seguir o seu fluxo. Tudo isso é gerenciado pela
  <em>Call Stack</em> (pilha de chamada ou pilha de
  execução).
</p>

<h3>Como funciona a Call Stack</h3>

<p>
  De forma simples e direta, funciona assim: quando meu programa
  está em execução e encontra uma chamada de
  função, ele pausa temporariamente o que estava fazendo e
  vai até o código interno da função para
  realizar sua execução. Após a
  execução, a função precisa saber como
  retornar o programa para o local onde ele parou antes da chamada para
  a execução. Então, após o retorno da
  função, o programa sabe como resumir o código
  partindo exatamente de onde a função retornou.
</p>

<h3>Exemplo de funcionamento da Call Stack</h3>

<p>
  Veja um exemplo no gif abaixo como o fluxo do programa muda quando
  existe uma chamada para função:
</p>


![Exemplo de recursão](./imgs/recursion-1.gif)





<p>
  No trecho simples de código acima, existe uma
  definição de função (linha 1),
  definição de variável (linha 5), uma chamada para
  função (linha 8) e em seguida um “print” em
  uma variável (linha 11). Eu marquei breakpoints nas linhas 2,
  5, 8 e 11, mas não é essa a ordem de
  execução. Ao executar o programa, a ordem dos
  breakpoints não é a mesma. Ela é alterada para 5,
  8, 2 e 11. Isso porque existe uma chamada para função na
  linha 8. Então enquanto o interpretador não conferir o
  que a função da linha 8 retorna, ele não tem como
  continuar a execução.
</p>

<p>
  Além disso, perceba que, na lateral esquerda do gif, a
  “Call Stack” está aberta. Nela, existe o que
  está sendo executado no momento (stack frames). Nesse caso em
  específico, começamos com o módulo que
  está sendo executado (<code>&lt;module&gt;</code>). Tudo o que
  estiver definido dentro do módulo, será exibido na Call
  Stack dele. Porém, ao chamar a função, algo novo
  é adicionado ali, a chamada para função
  “<code>funcao</code>“. Isso ocorre após a
  execução da linha 8 (chamada da função) e
  termina após o retorno da função.
</p>

<h3>Locals</h3>

<p>
  Vamos observar o que existe dentro da chamada de função
  (após a execução da linha 8).
</p>


![Exemplo no VS Code](./imgs/rec-2.png)





<p>
  Após a chamada para a função, a
  execução do módulo é pausada
  temporariamente até que o interpretador verifique o que a
  função retorna. Nesse momento, ela é adicionada
  na “Call Stack”, seus dados internos são salvos
  até que ela decida retornar um valor. Perceba que o argumento
  enviado ao parâmetro “<code>nome</code>” está
  em “<code>Variables</code>” como locals dessa
  função, essas são suas variáveis locais.
</p>

<p>
  Assim que o retorno for concluído, a execução do
  módulo continuará a seguir seu fluxo e a chamada para a
  função será eliminada da “Call
  stack”.
</p>


![Exemplo 3](./imgs/rec-3.png)





<p>
  Após o retorno da função, ela é eliminada
  da Call Stack e o módulo pode prosseguir com sua
  execução. Aliás, também preciso mencionar
  que capturei o valor do seu retorno em uma variável
  <code>frase</code> para fazer algo ela posteriormente (como dar um
  simples print no terminal).
</p>

<p>
  Então, podemos resumir que “Call Stack” é
  exatamente o que sua tradução descreve, uma
  <em>pilha de chamadas</em>. Assim como existe uma pilha de livros na
  prateleira, existe uma pilha de chamadas de funções no
  seu programa. Cada elemento na call stack contém os dados do
  momento em que a funções foram chamadas.
</p>

<h3>Funções dentro de funções</h3>

<p>
  Assim como acontece com funções chamadas diretamente
  dentro de um módulo, também ocorre com
  funções chamadas dentro de outras funções.
  Nesse caso, a pilha de chamadas fica ainda maior, porque se existir
  outra chamada para função dentro de uma
  função existente, o interpretador também
  precisará checar o retorno dessa outra função.
</p>

<p>
  Considere o mesmo código anterior, porém com uma chamada
  dentro da função já criada.
</p>


![Exemplo 4](./imgs/rec4.png)




<p>
  Agora os passos são um pouco diferentes. Mas, se você me
  acompanhou até aqui, não terá dificuldade nenhuma
  para entender o que ocorreu.
</p>

<p>
  Lembra que eu te disse que quando há uma chamada de
  função, o interpretador precisa verificar o que essa
  chamada retorna? Então, não é diferente aqui!
</p>

<p>
  Quando estamos dentro de uma <code>funcao_um</code> realizando uma
  chamada para uma <code>funcao_dois</code>, o que ocorre é que a
  <code>funcao_um</code> precisa pausar sua execução para
  saber o que a <code>funcao_dois</code> retorna. Só após
  isso, a <code>funcao_um</code> poderá continuar sua
  execução normal.
</p>

<p>
  Mas não termina aqui, isso tudo é registrado pela
  “Call Stack” (chamarei de <em>pilha</em> daqui em diante).
  Então, quanto mais chamadas de funções dentro de
  funções, mais coisas existem acontecendo na pilha.
</p>

<p>
  <a href="https://gist.github.com/luizomf/83c8f286a83ad6ddb1e7094aedabbef5">No código da imagem anterior</a>, temos uma chamada para função na linha 19,
  então sabemos que o interpretador vai conferir o retorno para
  essa chamada. Porém, ao acessar o código da
  função, o interpretador encontra uma nova chamada para
  função na linha 13, então ele também vai
  conferir o que essa outra função retorna.
</p>

<p>Veja na imagem, que a pilha agora tem o seguinte:</p>

<ul>
  <li><code>nova_funcao</code></li>
  <li><code>funcao_anterior</code></li>
  <li><code>&lt;module&gt;</code></li>
</ul>

<p>
  Cada elemento na pilha tem suas próprias variáveis
  locais salvas em memória.
</p>

<p>
  Portanto, para resolver essa pilha o interpretador precisa voltar
  resolvendo todos os retornos de cima para baixo. Ou seja, o resultado
  final será: retorno da <code>nova_funcao</code> + retorno da
  <code>funcao_anterior</code> + continua executando o módulo.
  Como a <code>funcao_anterior</code> retorna a
  <code>nova_funcao</code>, o retorno final será o que a
  <code>nova_funcao</code> retornar.
</p>

<h2>Funções recursivas com Python</h2>

<p>
  As funções recursivas com Python ou com qualquer outra
  linguagem de programação, funcionam exatamente como
  outras funções, porém, ao chamarem a si mesmas
  dentro do seu código, a cada nova chamada um novo elemento
  é adicionado na pilha (Call Stack, lembra?) contendo as
  variáveis locais daquele ponto na execução.
</p>

<p>
  Considere a função fatorial, que te mostrei mais acima
  nesse post:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> fatorial</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">n</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">  if</span><span style="color:#CDD6F4"> n </span><span style="color:#94E2D5">==</span><span style="color:#FAB387"> 1</span><span style="color:#CBA6F7"> or</span><span style="color:#CDD6F4"> n </span><span style="color:#94E2D5">==</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">      return</span><span style="color:#FAB387"> 1</span></span>
<span class="line"><span style="color:#CBA6F7">  return</span><span style="color:#CDD6F4"> n </span><span style="color:#94E2D5">*</span><span style="color:#89B4FA"> fatorial</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">n </span><span style="color:#94E2D5">-</span><span style="color:#FAB387"> 1</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">  fat5 </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> fatorial</span><span style="color:#9399B2">(</span><span style="color:#FAB387">5</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">  print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">fat5</span><span style="color:#9399B2">)</span></span></code></pre>

<p>
  A chamada dessa função (iniciando na linha 8) desencadeará mais 4
  chamadas para ela mesma (somando 5 no total) até atingir meu
  caso-base, que é quando n for igual a 1.
</p>


![Exemplo 5](./imgs/rec5.png)





<p>Essas chamadas ocorreram na seguinte ordem:</p>

<p>
  <code>fatorial(5) * fatorial(4) * fatorial(3) * fatorial(2) * fatorial(1)
  </code>
</p>

<p>
  Isso tudo está na pilha de chamadas e agora o interpretador precisa
  voltar resolvendo todas as chamadas de cima para baixo (ou de trás pra
  frente).
</p>

<p>Dessa maneira (vou mostrar apenas os retornos):</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># 1 = 1</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># 2 * 1 = 2</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># 3 * 2 = 6</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># 4 * 6 = 24</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># 5 * 24 = 120</span></span></code></pre>

<p>O trecho descrito acima é exatamente como a pilha foi resolvida.</p>


![Exemplo 6](./imgs/6.png)




<p>
  Perceba que após retornar todos os valores e a pilha terminar
  de ser resolvida, todas as chamadas e suas variáveis locais
  agora foram eliminadas da memória e temos apenas o valor de
  retorno de toda a pilha.
</p>

<p>
  É assim que as Funções recursivas com Python (ou
  qualquer outra linguagem de programação) funcionam.
  Exatamente como descrito em todo este artigo.
</p>

<h2>
  Problemas que podemos encontrar com Funções recursivas
</h2>

<p>
  Como você pôde perceber no texto que seguiu, cada chamada
  para função dentro de uma função recursiva
  é adicionada à pilha (cada elemento na pilha, cujo
  retorno ainda não foi finalizado, é chamado de
  <em>stack frame</em>). Isso pode ser um problema quando temos muitas
  recursões ocorrendo dentro de um programa.
</p>

<p>
  Imagine que eu peça o fatorial de 998, isso significa que a
  minha recursão ocorreria 997 vezes até atingir o caso
  base (somando 998 chamadas). Isso também significa que eu teria
  998 elementos na minha pilha de chamadas (sem contar qualquer outra
  chamada para funções no módulo e a chamada do
  módulo em si). Talvez, se o custo de execução da
  função consumir muita memória, eu poderia esgotar
  os recursos do computador facilmente apenas chamando uma
  função recursiva.
</p>

<p>
  Existe uma técnica chamada de
  <em>Tail Call Optimization</em> (ou
  <em>Tail Recursion Elimination</em> em casos recursivos) que
  resolveria este problema. Porém, Guido van Rossum, criador do
  Python, foi um contra a adição disso no Python alegando
  ser “Não Pythônico”.
</p>

<blockquote>
  <p>
    <em>I recently posted an entry in my Python History blog on the
      origins of Python’s functional features. A side remark about
      not supporting tail recursion elimination (TRE) immediately
      sparked several comments about what a pity it is that Python
      doesn’t do this, including links to recent blog entries by
      others trying to “prove” that TRE can be added to
      Python easily. So let me defend my position (which is that I
      don’t want TRE in the language). If you want a short answer,
      it’s simply unpythonic. Here’s the long answer.</em>
  </p>
  <a href="https://neopythonic.blogspot.com/2009/04/tail-recursion-elimination.html">Por Guido van Rossum, em 22/04/2009, em Neopythonic</a>
</blockquote>

<p>Tradução Livre:</p>

<blockquote>
  <p>
    <em>Recentemente, publiquei um post em meu blog Python History, sobre
      as origens dos recursos funcionais do Python. Uma
      observação simples sobre não suportar Tail
      Recursion Elimination (TRE) imediatamente provocou vários
      comentários sobre ser uma pena Python suportar isso,
      incluindo links para posts recentes de blogs de outros que
      tentaram “provar” que TRE pode ser adicionado ao
      Python facilmente. Então, deixe-me defender minha
      posição (que não quero TRE na linguagem). Se
      você quer uma resposta curta, simplesmente não
      é Pythônico. Aqui está a resposta longa.</em>
  </p>
  <a href="https://neopythonic.blogspot.com/2009/04/tail-recursion-elimination.html">Por Guido van Rossum, em 22/04/2009, em Neopythonic</a>
</blockquote>

<p>
  Se o próprio criador do Python mencionou isso, não
  iremos discutir isso por aqui =).
</p>

<h2>RecursionError: maximum recursion depth exceeded in comparison</h2>

<p>
  Esse erro apareceu pra você? Isso quer dizer que a pilha de
  elementos no seu call stack passou de 1000 (limite padrão em
  Python).
</p>

<p>
  Você pode fazer três coisas para resolver este problema:
</p>

<ul>
  <li>
    Checar se você realmente queria fazer mais de 1000 chamadas
    recursivas. Geralmente, quando criamos funções
    recursivas incorretamente, são realizadas mais
    recursões do que gostaríamos;
  </li>
  <li>
    Trocar por um laço <code>for</code>. Como Python não
    tem <em>Tail Recursion Elimination</em> (pelo menos até o
    momento da escrita deste post), talvez você poderia reescrever
    o código usando <code>for</code> ou até
    <code>while</code>;
  </li>
  <li>Por fim, um hack (aumentar o limite de recursão).</li>
</ul>

<p>Para aumentar o limite de recursão, use:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> sys</span></span>
<span class="line"><span style="color:#CDD6F4">sys</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">setrecursionlimit</span><span style="color:#9399B2">(</span><span style="color:#FAB387">5000</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">sys</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">getrecursionlimit</span><span style="color:#9399B2">())</span><span style="color:#9399B2;font-style:italic">  # 5000</span></span></code></pre>

<p>
  O padrão são 1000 recursões, no trecho acima
  aumentei para 5000.
</p>

<h2>Algoritmos usando recursão</h2>

<p>
  Como vimos anteriormente, o algoritmo mais clichê que é
  implementado com recursão, seria o fatorial, que vimos ao longo
  de todo o post. No entanto, há uma gama enorme de algoritmos
  que podem se beneficiar da recursão.
</p>

<p>
  Eu não pretendo detalhar o que todos eles fazem (talvez fique
  pra um próximo post), mas seguem alguns:
</p>

<h3>Sequência Fibonacci</h3>

<script src="https://gist.github.com/luizomf/2a44f26d91f25a755420cb2d3bf085e1.js"></script><link rel="stylesheet" href="https://github.githubassets.com/assets/gist-embed-f6e25add23b42c0d.css"><div id="gist102084320" class="gist">
<div class="gist-file" translate="no" data-color-mode="light" data-light-theme="light">
<div class="gist-data">

<div class="js-gist-file-update-container js-task-list-container">
<div id="file-fibonacci_sequence-py" class="file my-2">

<div itemprop="text" class="Box-body p-0 blob-wrapper data type-python  " style="overflow: auto" tabindex="0" role="region" aria-label="fibonacci_sequence.py content, created by luizomf on 05:28PM on March 30, 2020.">

<div class="js-check-hidden-unicode js-blob-code-container blob-code-content">

<template class="js-file-alert-template">
<div data-view-component="true" class="flash flash-warn flash-full d-flex flex-items-center">
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-alert">
<path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
</svg>
<span>
This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
<a class="Link--inTextBlock" href="https://github.co/hiddenchars" target="_blank">Learn more about bidirectional Unicode characters</a>
</span>

<div data-view-component="true" class="flash-action">        <a href="{{ revealButtonHref }}" data-view-component="true" class="btn-sm btn">    Show hidden characters
</a>
</div>
</div></template>
<template class="js-line-alert-template">
<span aria-label="This line has hidden Unicode characters" data-view-component="true" class="line-alert tooltipped tooltipped-e">
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-alert">
<path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
</svg>
</span></template>

<table data-hpc="" class="highlight tab-size js-file-line-container" data-tab-size="4" data-paste-markdown-skip="" data-tagsearch-path="fibonacci_sequence.py">
<tbody><tr>
  <td id="file-fibonacci_sequence-py-L1" class="blob-num js-line-number js-blob-rnum" data-line-number="1"></td>
  <td id="file-fibonacci_sequence-py-LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-k">from</span> <span class="pl-s1">functools</span> <span class="pl-k">import</span> <span class="pl-s1">lru_cache</span></td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L2" class="blob-num js-line-number js-blob-rnum" data-line-number="2"></td>
  <td id="file-fibonacci_sequence-py-LC2" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L3" class="blob-num js-line-number js-blob-rnum" data-line-number="3"></td>
  <td id="file-fibonacci_sequence-py-LC3" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L4" class="blob-num js-line-number js-blob-rnum" data-line-number="4"></td>
  <td id="file-fibonacci_sequence-py-LC4" class="blob-code blob-code-inner js-file-line"><span class="pl-en">@<span class="pl-s1">lru_cache</span></span></td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L5" class="blob-num js-line-number js-blob-rnum" data-line-number="5"></td>
  <td id="file-fibonacci_sequence-py-LC5" class="blob-code blob-code-inner js-file-line"><span class="pl-k">def</span> <span class="pl-en">fibonacci_sequence</span>(<span class="pl-s1">n</span>: <span class="pl-smi">int</span>) <span class="pl-c1">-&gt;</span> <span class="pl-smi">int</span>:</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L6" class="blob-num js-line-number js-blob-rnum" data-line-number="6"></td>
  <td id="file-fibonacci_sequence-py-LC6" class="blob-code blob-code-inner js-file-line">    <span class="pl-s">"""Sequência Fibonacci with memoization"""</span></td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L7" class="blob-num js-line-number js-blob-rnum" data-line-number="7"></td>
  <td id="file-fibonacci_sequence-py-LC7" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">if</span> <span class="pl-s1">n</span> <span class="pl-c1">&lt;</span> <span class="pl-c1">1</span>:</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L8" class="blob-num js-line-number js-blob-rnum" data-line-number="8"></td>
  <td id="file-fibonacci_sequence-py-LC8" class="blob-code blob-code-inner js-file-line">        <span class="pl-k">return</span> <span class="pl-c1">0</span></td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L9" class="blob-num js-line-number js-blob-rnum" data-line-number="9"></td>
  <td id="file-fibonacci_sequence-py-LC9" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">if</span> <span class="pl-s1">n</span> <span class="pl-c1">&lt;=</span> <span class="pl-c1">2</span>:</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L10" class="blob-num js-line-number js-blob-rnum" data-line-number="10"></td>
  <td id="file-fibonacci_sequence-py-LC10" class="blob-code blob-code-inner js-file-line">        <span class="pl-k">return</span> <span class="pl-c1">1</span></td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L11" class="blob-num js-line-number js-blob-rnum" data-line-number="11"></td>
  <td id="file-fibonacci_sequence-py-LC11" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">return</span> <span class="pl-en">fibonacci_sequence</span>(<span class="pl-s1">n</span> <span class="pl-c1">-</span> <span class="pl-c1">1</span>) <span class="pl-c1">+</span> <span class="pl-en">fibonacci_sequence</span>(<span class="pl-s1">n</span> <span class="pl-c1">-</span> <span class="pl-c1">2</span>)</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L12" class="blob-num js-line-number js-blob-rnum" data-line-number="12"></td>
  <td id="file-fibonacci_sequence-py-LC12" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L13" class="blob-num js-line-number js-blob-rnum" data-line-number="13"></td>
  <td id="file-fibonacci_sequence-py-LC13" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L14" class="blob-num js-line-number js-blob-rnum" data-line-number="14"></td>
  <td id="file-fibonacci_sequence-py-LC14" class="blob-code blob-code-inner js-file-line"><span class="pl-k">if</span> <span class="pl-s1">__name__</span> <span class="pl-c1">==</span> <span class="pl-s">"__main__"</span>:</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L15" class="blob-num js-line-number js-blob-rnum" data-line-number="15"></td>
  <td id="file-fibonacci_sequence-py-LC15" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">for</span> <span class="pl-s1">i</span> <span class="pl-c1">in</span> <span class="pl-en">range</span>(<span class="pl-c1">1000</span>):</td>
</tr>
<tr>
  <td id="file-fibonacci_sequence-py-L16" class="blob-num js-line-number js-blob-rnum" data-line-number="16"></td>
  <td id="file-fibonacci_sequence-py-LC16" class="blob-code blob-code-inner js-file-line">        <span class="pl-en">print</span>(<span class="pl-en">fibonacci_sequence</span>(<span class="pl-s1">i</span>))</td>
</tr>
</tbody></table>
</div>

</div>

</div>

</div>

</div>
<div class="gist-meta">
<a href="https://gist.github.com/luizomf/2a44f26d91f25a755420cb2d3bf085e1/raw/bb48d06e8a05e5d562742d5f11bb0350c12bb371/fibonacci_sequence.py" style="float:right" class="Link--inTextBlock">view raw</a>
<a href="https://gist.github.com/luizomf/2a44f26d91f25a755420cb2d3bf085e1#file-fibonacci_sequence-py" class="Link--inTextBlock">
  fibonacci_sequence.py
</a>
hosted with ❤ by <a class="Link--inTextBlock" href="https://github.com">GitHub</a>
</div>
</div>
</div>

<p>
  A
  <a href="https://pt.wikipedia.org/wiki/Sequ%C3%AAncia_de_Fibonacci">Sequência Fibonacci</a>
  pode se beneficiar da
  <a href="https://en.wikipedia.org/wiki/Memoization">memoization</a>
  (cache) de funções executadas anteriormente. O Python
  inclui
  <a href="https://docs.python.org/3/library/functools.html#functools.lru_cache">lru_cache</a>
  no módulo
  <a href="https://docs.python.org/3/library/functools.html">functools</a>
  que serve justamente para isso.
</p>

<p>
  Adaptação do Livro
  <a href="https://amzn.to/2QXcx8W">Estruturas de dados e algoritmos com JavaScript (por Loiane
    Groner)</a>
</p>

<h3>Quicksort</h3>

<script src="https://gist.github.com/luizomf/afcd473af1ecdb8210e508511e6005f3.js"></script><link rel="stylesheet" href="https://github.githubassets.com/assets/gist-embed-f6e25add23b42c0d.css"><div id="gist102084604" class="gist">
<div class="gist-file" translate="no" data-color-mode="light" data-light-theme="light">
<div class="gist-data">

<div class="js-gist-file-update-container js-task-list-container">
<div id="file-quicksort-py" class="file my-2">

<div itemprop="text" class="Box-body p-0 blob-wrapper data type-python  " style="overflow: auto" tabindex="0" role="region" aria-label="quicksort.py content, created by luizomf on 05:45PM on March 30, 2020.">

<div class="js-check-hidden-unicode js-blob-code-container blob-code-content">

<template class="js-file-alert-template">
<div data-view-component="true" class="flash flash-warn flash-full d-flex flex-items-center">
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-alert">
<path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
</svg>
<span>
This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
<a class="Link--inTextBlock" href="https://github.co/hiddenchars" target="_blank">Learn more about bidirectional Unicode characters</a>
</span>

<div data-view-component="true" class="flash-action">        <a href="{{ revealButtonHref }}" data-view-component="true" class="btn-sm btn">    Show hidden characters
</a>
</div>
</div></template>
<template class="js-line-alert-template">
<span aria-label="This line has hidden Unicode characters" data-view-component="true" class="line-alert tooltipped tooltipped-e">
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-alert">
<path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
</svg>
</span></template>

<table data-hpc="" class="highlight tab-size js-file-line-container" data-tab-size="4" data-paste-markdown-skip="" data-tagsearch-path="quicksort.py">
<tbody><tr>
  <td id="file-quicksort-py-L1" class="blob-num js-line-number js-blob-rnum" data-line-number="1"></td>
  <td id="file-quicksort-py-LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-s">"""</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L2" class="blob-num js-line-number js-blob-rnum" data-line-number="2"></td>
  <td id="file-quicksort-py-LC2" class="blob-code blob-code-inner js-file-line"><span class="pl-s">Quicksort algorithm</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L3" class="blob-num js-line-number js-blob-rnum" data-line-number="3"></td>
  <td id="file-quicksort-py-LC3" class="blob-code blob-code-inner js-file-line"><span class="pl-s"></span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L4" class="blob-num js-line-number js-blob-rnum" data-line-number="4"></td>
  <td id="file-quicksort-py-LC4" class="blob-code blob-code-inner js-file-line"><span class="pl-s">&gt;&gt;&gt; print(quicksort(list_of_numbers))</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L5" class="blob-num js-line-number js-blob-rnum" data-line-number="5"></td>
  <td id="file-quicksort-py-LC5" class="blob-code blob-code-inner js-file-line"><span class="pl-s">[2, 2, 4, 5, 9, 10, 11, 122, 123, 321]</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L6" class="blob-num js-line-number js-blob-rnum" data-line-number="6"></td>
  <td id="file-quicksort-py-LC6" class="blob-code blob-code-inner js-file-line"><span class="pl-s">&gt;&gt;&gt; print(quicksort(list_of_words))</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L7" class="blob-num js-line-number js-blob-rnum" data-line-number="7"></td>
  <td id="file-quicksort-py-LC7" class="blob-code blob-code-inner js-file-line"><span class="pl-s">['Aline', 'Helena', 'João', 'Luiz', 'Maria', 'Zara']</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L8" class="blob-num js-line-number js-blob-rnum" data-line-number="8"></td>
  <td id="file-quicksort-py-LC8" class="blob-code blob-code-inner js-file-line"><span class="pl-s">&gt;&gt;&gt; print(quicksort(['A']))</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L9" class="blob-num js-line-number js-blob-rnum" data-line-number="9"></td>
  <td id="file-quicksort-py-LC9" class="blob-code blob-code-inner js-file-line"><span class="pl-s">['A']</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L10" class="blob-num js-line-number js-blob-rnum" data-line-number="10"></td>
  <td id="file-quicksort-py-LC10" class="blob-code blob-code-inner js-file-line"><span class="pl-s">&gt;&gt;&gt; print(quicksort(['B', 'A']))</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L11" class="blob-num js-line-number js-blob-rnum" data-line-number="11"></td>
  <td id="file-quicksort-py-LC11" class="blob-code blob-code-inner js-file-line"><span class="pl-s">['A', 'B']</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L12" class="blob-num js-line-number js-blob-rnum" data-line-number="12"></td>
  <td id="file-quicksort-py-LC12" class="blob-code blob-code-inner js-file-line"><span class="pl-s">&gt;&gt;&gt; print(quicksort([]))</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L13" class="blob-num js-line-number js-blob-rnum" data-line-number="13"></td>
  <td id="file-quicksort-py-LC13" class="blob-code blob-code-inner js-file-line"><span class="pl-s">[]</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L14" class="blob-num js-line-number js-blob-rnum" data-line-number="14"></td>
  <td id="file-quicksort-py-LC14" class="blob-code blob-code-inner js-file-line"><span class="pl-s">"""</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L15" class="blob-num js-line-number js-blob-rnum" data-line-number="15"></td>
  <td id="file-quicksort-py-LC15" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L16" class="blob-num js-line-number js-blob-rnum" data-line-number="16"></td>
  <td id="file-quicksort-py-LC16" class="blob-code blob-code-inner js-file-line"><span class="pl-k">import</span> <span class="pl-s1">doctest</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L17" class="blob-num js-line-number js-blob-rnum" data-line-number="17"></td>
  <td id="file-quicksort-py-LC17" class="blob-code blob-code-inner js-file-line"><span class="pl-k">from</span> <span class="pl-s1">typing</span> <span class="pl-k">import</span> <span class="pl-v">List</span>, <span class="pl-v">TypeVar</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L18" class="blob-num js-line-number js-blob-rnum" data-line-number="18"></td>
  <td id="file-quicksort-py-LC18" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L19" class="blob-num js-line-number js-blob-rnum" data-line-number="19"></td>
  <td id="file-quicksort-py-LC19" class="blob-code blob-code-inner js-file-line"><span class="pl-v">TListValue</span> <span class="pl-c1">=</span> <span class="pl-en">TypeVar</span>(<span class="pl-s">'TListValue'</span>, <span class="pl-s1">int</span>, <span class="pl-s1">float</span>, <span class="pl-s1">str</span>, <span class="pl-s1">bool</span>)</td>
</tr>
<tr>
  <td id="file-quicksort-py-L20" class="blob-num js-line-number js-blob-rnum" data-line-number="20"></td>
  <td id="file-quicksort-py-LC20" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L21" class="blob-num js-line-number js-blob-rnum" data-line-number="21"></td>
  <td id="file-quicksort-py-LC21" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L22" class="blob-num js-line-number js-blob-rnum" data-line-number="22"></td>
  <td id="file-quicksort-py-LC22" class="blob-code blob-code-inner js-file-line"><span class="pl-s1">list_of_numbers</span>: <span class="pl-v">List</span>[<span class="pl-smi">int</span>] <span class="pl-c1">=</span> [<span class="pl-c1">10</span>, <span class="pl-c1">9</span>, <span class="pl-c1">5</span>, <span class="pl-c1">2</span>, <span class="pl-c1">11</span>, <span class="pl-c1">4</span>, <span class="pl-c1">2</span>, <span class="pl-c1">123</span>, <span class="pl-c1">321</span>, <span class="pl-c1">122</span>]</td>
</tr>
<tr>
  <td id="file-quicksort-py-L23" class="blob-num js-line-number js-blob-rnum" data-line-number="23"></td>
  <td id="file-quicksort-py-LC23" class="blob-code blob-code-inner js-file-line"><span class="pl-s1">list_of_words</span>: <span class="pl-v">List</span>[<span class="pl-smi">str</span>] <span class="pl-c1">=</span> [<span class="pl-s">'Luiz'</span>, <span class="pl-s">'Maria'</span>, <span class="pl-s">'João'</span>, <span class="pl-s">'Helena'</span>, <span class="pl-s">'Zara'</span>, <span class="pl-s">'Aline'</span>]</td>
</tr>
<tr>
  <td id="file-quicksort-py-L24" class="blob-num js-line-number js-blob-rnum" data-line-number="24"></td>
  <td id="file-quicksort-py-LC24" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L25" class="blob-num js-line-number js-blob-rnum" data-line-number="25"></td>
  <td id="file-quicksort-py-LC25" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L26" class="blob-num js-line-number js-blob-rnum" data-line-number="26"></td>
  <td id="file-quicksort-py-LC26" class="blob-code blob-code-inner js-file-line"><span class="pl-k">def</span> <span class="pl-en">quicksort</span>(<span class="pl-s1">a_list</span>: <span class="pl-v">List</span>[<span class="pl-smi">TListValue</span>]) <span class="pl-c1">-&gt;</span> <span class="pl-v">List</span>[<span class="pl-smi">TListValue</span>]:</td>
</tr>
<tr>
  <td id="file-quicksort-py-L27" class="blob-num js-line-number js-blob-rnum" data-line-number="27"></td>
  <td id="file-quicksort-py-LC27" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">if</span> <span class="pl-en">len</span>(<span class="pl-s1">a_list</span>) <span class="pl-c1">&lt;</span> <span class="pl-c1">2</span>:</td>
</tr>
<tr>
  <td id="file-quicksort-py-L28" class="blob-num js-line-number js-blob-rnum" data-line-number="28"></td>
  <td id="file-quicksort-py-LC28" class="blob-code blob-code-inner js-file-line">        <span class="pl-k">return</span> <span class="pl-s1">a_list</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L29" class="blob-num js-line-number js-blob-rnum" data-line-number="29"></td>
  <td id="file-quicksort-py-LC29" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L30" class="blob-num js-line-number js-blob-rnum" data-line-number="30"></td>
  <td id="file-quicksort-py-LC30" class="blob-code blob-code-inner js-file-line">    <span class="pl-s1">pivot_index</span> <span class="pl-c1">=</span> <span class="pl-en">len</span>(<span class="pl-s1">a_list</span>) <span class="pl-c1">//</span> <span class="pl-c1">2</span></td>
</tr>
<tr>
  <td id="file-quicksort-py-L31" class="blob-num js-line-number js-blob-rnum" data-line-number="31"></td>
  <td id="file-quicksort-py-LC31" class="blob-code blob-code-inner js-file-line">    <span class="pl-s1">pivot</span> <span class="pl-c1">=</span> <span class="pl-s1">a_list</span>.<span class="pl-c1">pop</span>(<span class="pl-s1">pivot_index</span>)</td>
</tr>
<tr>
  <td id="file-quicksort-py-L32" class="blob-num js-line-number js-blob-rnum" data-line-number="32"></td>
  <td id="file-quicksort-py-LC32" class="blob-code blob-code-inner js-file-line">    <span class="pl-s1">smaller_values</span>: <span class="pl-smi">List</span> <span class="pl-c1">=</span> [<span class="pl-s1">item</span> <span class="pl-k">for</span> <span class="pl-s1">item</span> <span class="pl-c1">in</span> <span class="pl-s1">a_list</span> <span class="pl-k">if</span> <span class="pl-s1">item</span> <span class="pl-c1">&lt;=</span> <span class="pl-s1">pivot</span>]</td>
</tr>
<tr>
  <td id="file-quicksort-py-L33" class="blob-num js-line-number js-blob-rnum" data-line-number="33"></td>
  <td id="file-quicksort-py-LC33" class="blob-code blob-code-inner js-file-line">    <span class="pl-s1">higher_values</span>: <span class="pl-smi">List</span> <span class="pl-c1">=</span> [<span class="pl-s1">item</span> <span class="pl-k">for</span> <span class="pl-s1">item</span> <span class="pl-c1">in</span> <span class="pl-s1">a_list</span> <span class="pl-k">if</span> <span class="pl-s1">item</span> <span class="pl-c1">&gt;</span> <span class="pl-s1">pivot</span>]</td>
</tr>
<tr>
  <td id="file-quicksort-py-L34" class="blob-num js-line-number js-blob-rnum" data-line-number="34"></td>
  <td id="file-quicksort-py-LC34" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L35" class="blob-num js-line-number js-blob-rnum" data-line-number="35"></td>
  <td id="file-quicksort-py-LC35" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">return</span> <span class="pl-en">quicksort</span>(<span class="pl-s1">smaller_values</span>) <span class="pl-c1">+</span> [<span class="pl-s1">pivot</span>] <span class="pl-c1">+</span> <span class="pl-en">quicksort</span>(<span class="pl-s1">higher_values</span>)</td>
</tr>
<tr>
  <td id="file-quicksort-py-L36" class="blob-num js-line-number js-blob-rnum" data-line-number="36"></td>
  <td id="file-quicksort-py-LC36" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L37" class="blob-num js-line-number js-blob-rnum" data-line-number="37"></td>
  <td id="file-quicksort-py-LC37" class="blob-code blob-code-inner js-file-line">
</td>
</tr>
<tr>
  <td id="file-quicksort-py-L38" class="blob-num js-line-number js-blob-rnum" data-line-number="38"></td>
  <td id="file-quicksort-py-LC38" class="blob-code blob-code-inner js-file-line"><span class="pl-k">if</span> <span class="pl-s1">__name__</span> <span class="pl-c1">==</span> <span class="pl-s">"__main__"</span>:</td>
</tr>
<tr>
  <td id="file-quicksort-py-L39" class="blob-num js-line-number js-blob-rnum" data-line-number="39"></td>
  <td id="file-quicksort-py-LC39" class="blob-code blob-code-inner js-file-line">    <span class="pl-s1">doctest</span>.<span class="pl-c1">testmod</span>(<span class="pl-s1">verbose</span><span class="pl-c1">=</span><span class="pl-c1">True</span>)</td>
</tr>
</tbody></table>
</div>

</div>

</div>

</div>

</div>
<div class="gist-meta">
<a href="https://gist.github.com/luizomf/afcd473af1ecdb8210e508511e6005f3/raw/db4aa9566efa937dfd49b8c41acf6ac477caba81/quicksort.py" style="float:right" class="Link--inTextBlock">view raw</a>
<a href="https://gist.github.com/luizomf/afcd473af1ecdb8210e508511e6005f3#file-quicksort-py" class="Link--inTextBlock">
  quicksort.py
</a>
hosted with ❤ by <a class="Link--inTextBlock" href="https://github.com">GitHub</a>
</div>
</div>
</div>

<p>
  Adaptação do Livro
  <a href="https://amzn.to/39v5jPV">Entendendo Algoritmos (por Aditya Bhargava)</a>
</p>

<h3>Um código personalizado</h3>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">  class</span><span style="color:#F9E2AF;font-style:italic"> Caixa</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">      def</span><span style="color:#89DCEB;font-style:italic"> __init__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> tem_chave</span><span style="color:#94E2D5">=</span><span style="color:#FAB387">False</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">          self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">tem_chave </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> tem_chave</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">      def</span><span style="color:#89DCEB;font-style:italic"> __repr__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">          return</span><span style="color:#A6E3A1;font-style:italic"> f</span><span style="color:#A6E3A1">'Caixa(</span><span style="color:#F5C2E7">{</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">tem_chave</span><span style="color:#F5C2E7">}</span><span style="color:#A6E3A1">)'</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">  def</span><span style="color:#89B4FA;font-style:italic"> encontra_chave</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">caixas</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">Caixa</span><span style="color:#9399B2">],</span><span style="color:#EBA0AC;font-style:italic"> index</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#94E2D5"> =</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Caixa</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">      if</span><span style="color:#FAB387;font-style:italic"> len</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">caixas</span><span style="color:#9399B2">)</span><span style="color:#94E2D5"> &lt;=</span><span style="color:#CDD6F4"> index</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">          return</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">      caixa </span><span style="color:#94E2D5">=</span><span style="color:#EBA0AC;font-style:italic"> caixas</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">index</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">      print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1;font-style:italic">f</span><span style="color:#A6E3A1">'Procurando chave na caixa do índice </span><span style="color:#F5C2E7">{</span><span style="color:#CDD6F4">index</span><span style="color:#F5C2E7">}</span><span style="color:#A6E3A1"> -&gt; </span><span style="color:#F5C2E7">{</span><span style="color:#CDD6F4">caixa</span><span style="color:#F5C2E7">}</span><span style="color:#A6E3A1">'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">      if</span><span style="color:#CDD6F4"> caixa</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">tem_chave</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">          return</span><span style="color:#CDD6F4"> caixa</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">      index </span><span style="color:#94E2D5">+=</span><span style="color:#FAB387"> 1</span></span>
<span class="line"><span style="color:#CBA6F7">      return</span><span style="color:#89B4FA"> encontra_chave</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">caixas</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> index</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">  if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">      caixas</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">Caixa</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> [</span></span>
<span class="line"><span style="color:#89B4FA">          Caixa</span><span style="color:#9399B2">(</span><span style="color:#FAB387">True</span><span style="color:#9399B2">),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span></span>
<span class="line"><span style="color:#89B4FA">          Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span></span>
<span class="line"><span style="color:#89B4FA">          Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span><span style="color:#89B4FA"> Caixa</span><span style="color:#9399B2">(),</span></span>
<span class="line"><span style="color:#9399B2">      ]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">      print</span><span style="color:#9399B2">(</span><span style="color:#89B4FA">encontra_chave</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">caixas</span><span style="color:#9399B2">))</span></span></code></pre>

<p>Meu código mesmo.</p>

<h3>Torre de Hanoi</h3>

<p>
  Adaptação do Livro
  <a href="https://amzn.to/2Jn18Lc">O melhor do JavaScript (Por Douglas Crockford)</a>
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Torre de Hanói</span></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> hanoi</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">disco</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> origem</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> auxiliar</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> destino</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">    if</span><span style="color:#CDD6F4"> disco </span><span style="color:#94E2D5">&lt;=</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span></span>
<span class="line"><span style="color:#89B4FA">    hanoi</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">disco </span><span style="color:#94E2D5">-</span><span style="color:#FAB387"> 1</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> origem</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> destino</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> auxiliar</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1;font-style:italic">f</span><span style="color:#A6E3A1">'Movendo disco </span><span style="color:#F5C2E7">{</span><span style="color:#CDD6F4">disco</span><span style="color:#F5C2E7">}</span><span style="color:#A6E3A1"> de </span><span style="color:#F5C2E7">{</span><span style="color:#CDD6F4">origem</span><span style="color:#F5C2E7">}</span><span style="color:#A6E3A1"> para </span><span style="color:#F5C2E7">{</span><span style="color:#CDD6F4">destino</span><span style="color:#F5C2E7">}</span><span style="color:#A6E3A1">'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#89B4FA">    hanoi</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">disco </span><span style="color:#94E2D5">-</span><span style="color:#FAB387"> 1</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> auxiliar</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> origem</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> destino</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#89B4FA">    hanoi</span><span style="color:#9399B2">(</span><span style="color:#FAB387">3</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'Origem'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'Auxiliar'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'Destino'</span><span style="color:#9399B2">)</span></span></code></pre>

<p>
  Adaptação do Livro
  <a href="https://amzn.to/2Jn18Lc">O melhor do JavaScript (Por Douglas Crockford)</a>
</p>

<h2>Em vídeo</h2>

<p>
  Também criei um vídeo sobre este conteúdo em meu
  canal do Youtube, segue abaixo:
</p>

<p>
  Link do vídeo no YouTube:
  <a href="https://youtu.be/0PwFwqiNfAI">https://youtu.be/0PwFwqiNfAI
  </a>
</p>

<h2>Super resumo do resumo</h2>

<p>
  Funções recursivas com Python (ou qualquer linguagem de
  programação) são funções que chamam
  a si mesmas de maneira direta ou indireta.
</p>

