---
title: 'Pilhas em Python com listas (stack)'
description:
  'Pilhas em Python são comumente criadas usando listas, porque estamos
  interessados em manipular apenas a extremidade do topo da estrutura (o final
  da lista).'
date: 2018-09-02
---

<h1>Pilhas em Python com listas (stack)</h1>

<p class="author">
  <span class="meta-date">
    <time datetime="2018-09-02">2 de setembro de 2020</time>
  </span>
  ·
  <span class="meta-author">Luiz Otávio Miranda</span>
</p>

<p>
  Pilhas em Python são comumente criadas usando
  <a href="https://docs.python.org/pt-br/3.8/tutorial/datastructures.html">listas</a>, porque estamos interessados em manipular apenas a extremidade do
  topo da estrutura (o final da lista). Isso nos garante
  <a href="https://wiki.python.org/moin/TimeComplexity">complexidade de tempo O(1)</a>
  (tempo constante) com métodos <code>append</code> e
  <code>pop</code>.
</p>

<p>
  Uma pilha é uma coleção de itens que segue o
  princípio <strong>LIFO</strong> (<strong>L</strong>ast
  <strong>I</strong>n <strong>F</strong>irst <strong>O</strong>ut) , ou
  seja, o último item a entrar, será o primeiro a sair. A
  adição e remoção de novos itens ocorre
  sempre na mesma ponta da pilha, o final da lista. O final da lista
  (último índice), representa o topo da pilha, o
  começo da lista (índice 0) representa a base da pilha.
</p>

<p>
  Itens mais novos são sempre adicionados no topo da pilha e se
  tornam mais antigos a medida que adicionamos outros itens. Quanto
  maior o índice na lista, mais novo é o item e mais cedo
  ele será removido da pilha.
</p>

<p>
  Pilhas são estruturas de dados muito simples, mas podem ser
  usadas para representar várias coisas no mundo real, por
  exemplo: uma pilha de pratos, uma pilha de livros ou qualquer coisa
  que você coloque uma sobre a outra formando uma pilha.
  Além disso, programas também usam pilhas, como a
  <a href="https://www.otaviomiranda.com.br/2020/funcoes-recursivas-com-python/#Call_stack">pilha de chamadas</a>
  para funções que já vimos anteriormente nesse
  blog.
</p>
<h2>Listas são pilhas muito genéricas em Python</h2>

<p>
  Como pilhas só precisam de métodos para adicionar e
  remover itens do seu topo, as listas do Python já fazem esse
  trabalho com excelência e complexidade de tempo O(1), ou tempo
  constante. Então, é super rápido.
</p>

<p>
  Porém, ou você só usa esses dois métodos
  (<code>append</code> e <code>pop</code>), ou você cria sua
  própria estrutura de dados chamada de <code>Stack</code> (uma
  classe que você verá ao final desse post) para outros
  desenvolvedores não usarem sua pilha de maneira genérica
  (como filas, por exemplo).
</p>

<p>
  Se você quiser trabalhar diretamente com as listas, pode fazer o
  seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de livros com type annotation</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span><span style="color:#9399B2;font-style:italic">  # {1}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando livros no topo da pilha</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 2'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 3'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Obtendo o elemento mais novo</span></span>
<span class="line"><span style="color:#CDD6F4">book </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # {3}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # Livro 3 {4}</span></span></code></pre>

<p>
  Perceba que no código acima, criei uma pilha de livros
  (<code>stack_of_books</code>) como uma lista vazia {1}. Quando
  precisei adicionar livros na pilha, usei o método
  <code>append</code>, que é padrão de listas em Python
  para adicionar itens ao final da lista {2}. Além disso, quando
  precisei obter o livro mais novo (do topo da pilha), usei o
  método <code>pop</code>, que também é
  padrão de listas em Python para obter o último item da
  lista (ou o elemento do topo da pilha) {3}.
</p>

<p>
  Na verdade, o método <code>pop</code> faz duas coisas.
  Além de remover o item do topo da pilha, ele também
  retorna este valor. Então, Isso me permitiu fazer duas coisas
  em {3}: remover o item do topo da pilha e coletar seu valor em uma
  variável.
</p>

<p>
  Por fim {4}, imprimimos o valor de book, que foi o “Livro
  3”.
</p>
<h3>Cuidados com pop</h3>

<p>
  Note que, a cada execução do método
  <code>pop</code>, o item mais novo será removido da pilha. Em
  algum momento, sua pilha poderá estar vazia e esse
  método levantará a exceção “<code>IndexError: pop from empty list</code>“, ou “<em>Erro de índice: pop de uma lista vazia</em>” (em tradução livre).
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de livros com type annotation</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span><span style="color:#9399B2;font-style:italic">  # {1}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando livros no topo da pilha</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 2'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 3'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Obtendo o elemento mais novo</span></span>
<span class="line"><span style="color:#CDD6F4">book_1 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Livro 3 {3}</span></span>
<span class="line"><span style="color:#CDD6F4">book_2 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Livro 2 {3}</span></span>
<span class="line"><span style="color:#CDD6F4">book_3 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Livro 1 {3}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># IndexError: pop from empty list</span></span>
<span class="line"><span style="color:#CDD6F4">book </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Não há mais livros {4}</span></span></code></pre>

<p>
  Isso ocorre porque não há mais valores para serem
  removidos e recuperados da sua pilha {4}.
</p>

<p>
  Para prevenir esse tipo de situação, podemos envolver
  nosso código em um bloco <code>try</code> e
  <code>except</code>, tratando a exceção
  “<code>IndexError</code>“. Veja:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de livros com type annotation</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span><span style="color:#9399B2;font-style:italic">  # {1}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando livros no topo da pilha</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 2'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 3'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">try</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # Obtendo o elemento mais novo</span></span>
<span class="line"><span style="color:#CDD6F4">    book_1 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Livro 3 {3}</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book_1</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # Livro 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">    book_2 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Livro 2 {3}</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book_2</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # Livro 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">    book_3 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Livro 1 {3}</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book_3</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # Livro 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # IndexError: pop from empty list</span></span>
<span class="line"><span style="color:#CDD6F4">    book </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span><span style="color:#9399B2;font-style:italic">  # Não há mais livros {4}</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # Seu código não chegará aqui</span></span>
<span class="line"><span style="color:#CBA6F7">except</span><span style="color:#FAB387;font-style:italic"> IndexError</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Trate o erro como preferir aqui.'</span><span style="color:#9399B2">)</span></span></code></pre>

<p>
  Assim, a partir do momento que a exceção ocorrer {4}, seu código
  pulará imediatamente para o bloco except. Se não houver exceções, seu
  código não executará o bloco except.
</p>
<h3>Não use listas como filas</h3>

<p>
  Além das pilhas, outra estrutura de dados muito usada em
  programação são as filas (falamos sobre elas em
  outro artigo). Basicamente, filas trabalham no lado oposto das pilhas.
  Então, se nas pilhas você trabalha na extremidade final
  (adicionando e removendo itens do topo), nas filas você trabalha
  nas duas extremidades, enfileirando itens no final (topo) e
  desenfileirando itens do início (base).
</p>

<p>
  As listas podem ser usadas para filas também, porém,
  não é recomendável. Isso torna sua complexidade
  de tempo O(n), ou tempo linear, o que torna as listas mais lentas para
  isso.
</p>

<p>
  O método pop, pode receber o índice que você
  pretende remover da pilha, por exemplo (mas não faça
  isso):
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de livros com type annotation</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span><span style="color:#9399B2;font-style:italic">  # {1}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando livros no topo da pilha</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 2'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 3'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">book_1 </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">(</span><span style="color:#FAB387">0</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {3} Livro 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book_1</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # Livro 1</span></span></code></pre>

<p>
  Perceba que, no código acima, eu consigo passar um
  índice para <code>pop</code> descrevendo qual livro quero
  remover da pilha {3}. Assim, isso me permite remover o item da base da
  minha pilha (índice 0). Mas, o problema ao fazer algo assim,
  é que como as listas não foram otimizadas para tal,
  todos os outros itens da lista agora precisam ter seus índices
  alterados. O que tinha índice 1, passa a ter índice 0, o
  que tinha índice 2, passa a ter índice 1 e assim por
  diante.
</p>

<p>
  A complexidade de tempo O(n) significa que, na pior das
  hipóteses, quando eu removo um item da base da minha pilha
  (como nas filas), todos os outros items agora precisam ser
  modificados, e eu assumo que não era essa a sua
  intenção.
</p>

<p>
  Nós já falamos sobre filas aqui, mas para resumir, use
  <a href="https://docs.python.org/pt-br/3.8/library/collections.html#collections.deque">collections.deque</a>
  para filas e listas para pilhas.
</p>

<h2>Iterando pilhas</h2>

<p>
  Em Python a iteração dos iteráveis é feita
  com <code>for</code>. Se você não quer remover nenhum
  elemento, mas apenas iterar sobre toda a pilha, faça o
  seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de livros com type annotation</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span><span style="color:#9399B2;font-style:italic">  # {1}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando livros no topo da pilha</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 2'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 3'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Laço for</span></span>
<span class="line"><span style="color:#CBA6F7">for</span><span style="color:#CDD6F4"> book </span><span style="color:#CBA6F7">in</span><span style="color:#EBA0AC;font-style:italic"> stack_of_books</span><span style="color:#9399B2">[::</span><span style="color:#94E2D5">-</span><span style="color:#FAB387;font-style:italic">1</span><span style="color:#9399B2">]:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # Faça o que preferir com o Livro</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span>
<span class="line"><span style="color:#A6E3A1">Saída:</span></span>
<span class="line"><span style="color:#A6E3A1">Livro 3</span></span>
<span class="line"><span style="color:#A6E3A1">Livro 2</span></span>
<span class="line"><span style="color:#A6E3A1">Livro 1</span></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span></code></pre>

<p>
  Perceba que no código acima, na linha 13, temos um laço
  for que vai iterar em todos os elementos da lista. Então eu
  posso fazer o que preferir com a variável
  <code>book</code>.
</p>

<p>
  <strong>Detalhe importante:</strong> para manter a ordem da pilha (do
  topo para a base), eu preciso fazer uma iteração em
  ordem reversa na pilha quando uso <code>for</code>. Por isso adicionei
  <code>[::-1] </code>em <code>stack_of_books</code>. Isso inverte a
  ordem de listas em Python.
</p>

<p>
  Um outro tipo de iteração sobre pilha, seria removendo
  os elementos da pilha ao mesmo tempo que itero sobre eles. Podemos
  fazer isso com o laço <code>while</code>:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de livros com type annotation</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span><span style="color:#9399B2;font-style:italic">  # {1}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando livros no topo da pilha</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 2'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 3'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Laço while</span></span>
<span class="line"><span style="color:#CBA6F7">while</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    book </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">book</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span>
<span class="line"><span style="color:#A6E3A1">Saída:</span></span>
<span class="line"><span style="color:#A6E3A1">Livro 3</span></span>
<span class="line"><span style="color:#A6E3A1">Livro 2</span></span>
<span class="line"><span style="color:#A6E3A1">Livro 1</span></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span></code></pre>

<p>
  Perceba que usando o laço <code>while</code> com o
  método <code>pop</code>, a ordem é mantida.
  Porém, é importante saber que estou removendo cada um
  dos elementos da minha pilha.
</p>

<h2>Copiando pilhas</h2>

<p>
  Trabalhar com dados mutáveis, como as listas, pode ser perigoso
  em qualquer linguagem de programação porque manipulamos
  o dado diretamente. Então, é uma boa ideia manter uma
  cópia do dado original sempre que o manipulamos (se for
  possível, é claro). Por outro lado, pode ser caro manter
  cópia de dados que são muito grandes, então
  você precisa ponderar as duas coisas: segurança e peso.
</p>

<p>
  Manter a cópia de uma lista, pode ter uma complexidade de tempo
  linear O(n) se você fizer uma cópia rasa (shallow copy)
  ou mais do que isso se você mantiver uma cópia profunda
  (deep copy).
</p>

<h3>Shallow copy:</h3>

<p>
  Esse tipo de cópia é um clone superficial dos itens da
  pilha. Ela tem complexidade de tempo linear – O(n) – o que
  significa que é necessário passar por todos os itens
  para realizar a cópia destes. A parte interessante desse tipo
  de cópia é que dados imutáveis (como str, int,
  float e bool) serão realmente copiados para uma nova pilha.
  Porém, dados mutáveis (como outras listas,
  dicionários e sets) não serão copiados, a nova
  pilha terá apenas uma referência para os dados
  mutáveis da pilha original.
</p>

<p>
  Para realizar uma cópia do tipo shallow copy da sua pilha,
  faça o seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de livros com type annotation</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span><span style="color:#9399B2;font-style:italic">  # {1}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando livros no topo da pilha</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 2'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Livro 3'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # {2}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># A cópia (shallow copy)</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_books_copy </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_books</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">copy</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Agora não estou mais alterando os dados</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># da pilha original.</span></span>
<span class="line"><span style="color:#CBA6F7">while</span><span style="color:#CDD6F4"> stack_of_books_copy</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack_of_books_copy</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># A original continua intacta</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack_of_books</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic">  # ['Livro 1', 'Livro 2', 'Livro 3']</span></span></code></pre>

<h3>Deep copy</h3>

<p>
  Quando falamos em pilhas que contém dados mutáveis, como
  por exemplo, outras listas dentro da nossa pilha. É preciso
  tomar cuidado com a shallow copy, porque ela não vai copiar
  esses elementos, vai fazer apenas uma referência apontando para
  os dados da lista original. Isso significa que meus dados ainda
  continuarão mutáveis internamente, mesmo na
  cópia.
</p>

<p>
  A complexidade de tempo de uma deep copy vai depender da profundidade
  dos itens mutáveis da sua pilha, quanto maior a profundidade,
  maior a complexidade (mais tempo leva).
</p>

<p>Imagine essa estrutura de dados:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de listas</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando elementos</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">])</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'C'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'D'</span><span style="color:#9399B2">])</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'E'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'F'</span><span style="color:#9399B2">])</span></span></code></pre>

<p>
  Esse é um tipo de estrutura que devo tomar cuidado, porque existem
  listas dentro da minha pilha.
</p>

<p>Veja o problema:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de listas</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando elementos</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">])</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'C'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'D'</span><span style="color:#9399B2">])</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'E'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'F'</span><span style="color:#9399B2">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Shallow copy</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists_clone </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">copy</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Obtendo o elemento do topo da pilha</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Isso não altera a lista original</span></span>
<span class="line"><span style="color:#CDD6F4">item </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_lists_clone</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Mas isso sim</span></span>
<span class="line"><span style="color:#EBA0AC;font-style:italic">item</span><span style="color:#9399B2">[</span><span style="color:#FAB387;font-style:italic">0</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#A6E3A1"> 'ALTERANDO O DADO'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Veja o resultado na lista original</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span>
<span class="line"><span style="color:#A6E3A1">Saída:</span></span>
<span class="line"><span style="color:#A6E3A1">[['A', 'B'], ['C', 'D'], ['ALTERANDO O DADO', 'F']]</span></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span></code></pre>

<p>
  Os comentários do código acima, explicam o que ocorre em
  cada trecho. Mas, aqui vai uma breve explicação:
</p>

<ul>
  <li>
    Linha 13 – Faço uma shallow copy da minha pilha. Como
    te descrevi anteriormente, dados mutáveis NÃO
    são copiados de dentro da pilha original, eles passados
    apenas como referência. Isso significa que a lista
    cópia terá uma referência desses dados
    (você consegue acessá-los por ela) mas eles ainda
    são os dados da lista original e não uma cópia
    real;
  </li>
  <li>
    Linha 17 – Obtém o item do topo da lista (esse ainda
    é o dado da lista original);
  </li>
  <li>
    Linha 20 – Altero o item. Porém, como esse item
    é uma referência ao item da lista original, quem
    será alterado efetivamente será o item da lista
    original;
  </li>
  <li>Linha 23 – Percebo a besteira que fiz.</li>
</ul>

<p>
  Para solucionar esse tipo de coisa, usamos a deep copy, que é
  um tipo de cópia recursiva. Com isso, todos os dados,
  mutáveis e imutáveis serão copiados para a lista
  cópia.
</p>

<p>Veja:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># Para Type annotation</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Preciso importar deepcopy</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> copy </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> deepcopy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Pilha de listas</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Adicionando elementos</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">])</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'C'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'D'</span><span style="color:#9399B2">])</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'E'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'F'</span><span style="color:#9399B2">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Deep copy</span></span>
<span class="line"><span style="color:#CDD6F4">stack_of_lists_clone </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> deepcopy</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Obtendo o elemento do topo da pilha</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Isso não altera a lista original</span></span>
<span class="line"><span style="color:#CDD6F4">item </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack_of_lists_clone</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Mas isso sim</span></span>
<span class="line"><span style="color:#EBA0AC;font-style:italic">item</span><span style="color:#9399B2">[</span><span style="color:#FAB387;font-style:italic">0</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#A6E3A1"> 'ALTERANDO O DADO'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Veja o resultado na lista original</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack_of_lists</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span>
<span class="line"><span style="color:#A6E3A1">Saída:</span></span>
<span class="line"><span style="color:#A6E3A1">[['A', 'B'], ['C', 'D'], ['E', 'F']]</span></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span></code></pre>

<p>
  Veja que as únicas coisas alteradas foram na linha 5, porque eu
  preciso importar “deepcopy” do módulo
  “copy”. E a linha 16, porque ao invés de
  “shallow copy”, agora estou fazendo uma “deep
  copy”.
</p>

<h2>Classe Stack</h2>

<p>
  A maneira mais segura e correta de se trabalhar com listas como pilhas
  em Python, é proteger o código para que os
  métodos genéricos das listas não possam ser
  chamados diretamente. Assim protegeremos o nosso código para
  que outros desenvolvedores não possam chamar um
  <code>pop(0)</code> na nossa pilha, dentre vários outros.
</p>

<p>
  Criando uma classe, podemos adicionar exclusivamente os métodos
  que queremos. Como append, pop e alguns métodos mágicos
  para iteração e visualização de dados.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> Any</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> copy </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> deepcopy</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">class</span><span style="color:#F9E2AF;font-style:italic"> Stack</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">    """Uma classe representando uma pilha"""</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __init__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # Essa stack é genérica, por isso</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # a lista poderá receber qualquer</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # tipo de dados</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">        self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">Any</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # Representa o índice para iterações</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # com for</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">        self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__index </span><span style="color:#94E2D5">=</span><span style="color:#FAB387"> 0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89B4FA;font-style:italic"> append</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> item</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC"> Any</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Representa o append da lista"""</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">        self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">item</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89B4FA;font-style:italic"> pop</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Any</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Representa o pop da lista sem parâmetros"""</span></span>
<span class="line"><span style="color:#CBA6F7">        if</span><span style="color:#CBA6F7"> not</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">            return</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89B4FA;font-style:italic"> peek</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Any</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Mostra o último elemento adicionado à pilha"""</span></span>
<span class="line"><span style="color:#CBA6F7">        if</span><span style="color:#CBA6F7"> not</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">            return</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#EBA0AC;font-style:italic">__data</span><span style="color:#9399B2">[</span><span style="color:#94E2D5">-</span><span style="color:#FAB387;font-style:italic">1</span><span style="color:#9399B2">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __repr__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Representação dos dados"""</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __iter__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">):</span></span>
<span class="line"><span style="color:#A6E3A1">        """Para iteração com for"""</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">        self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__index </span><span style="color:#94E2D5">=</span><span style="color:#FAB387;font-style:italic"> len</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __next__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">):</span></span>
<span class="line"><span style="color:#A6E3A1">        """Para iteração com for (next item)"""</span></span>
<span class="line"><span style="color:#CBA6F7">        if</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__index </span><span style="color:#94E2D5">==</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">            raise</span><span style="color:#FAB387;font-style:italic"> StopIteration</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">        self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__index </span><span style="color:#94E2D5">-=</span><span style="color:#FAB387"> 1</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#EBA0AC;font-style:italic">__data</span><span style="color:#9399B2">[</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#EBA0AC;font-style:italic">__index</span><span style="color:#9399B2">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __bool__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">):</span></span>
<span class="line"><span style="color:#A6E3A1">        """Para iteração com while"""</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#CBA6F7;font-style:italic"> bool</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__data</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    stack </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> Stack</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">    stack</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    stack</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'B'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    stack</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'C'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'FOR:'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CBA6F7">    for</span><span style="color:#CDD6F4"> item </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> stack</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">        print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">item</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'POP:'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    last_item </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> stack</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> last_item</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'WHILE:'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    stack_copy </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> deepcopy</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CBA6F7">    while</span><span style="color:#CDD6F4"> stack_copy</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">        print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack_copy</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">pop</span><span style="color:#9399B2">())</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'ORIGINAL STACK:'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stack</span><span style="color:#9399B2">)</span></span></code></pre>

<h2>Resumo</h2>

<p>
  Em Python, usamos as listas como pilhas (nunca como filas). Elas
  são estruturas de dados bem simples que precisam de apenas dois
  métodos para funcionarem corretamente. Um método de
  inserção e outro de remoção de valores
  (<code>append</code> e <code>pop</code>). Geralmente, o método
  de remoção (pop) também retorna o valor removido
  e você pode usá-lo com o que preferir.
</p>

<p>
  As pilhas trabalham apenas na extremidade final da lista, por isso
  têm comportamento LIFO (Last In First Out), ou, o último
  a entrar é o primeiro a sair. O último elemento
  adicionado é considerado o elemento do topo da pilha; o
  primeiro elemento adicionado é o elemento da base da pilha.
</p>

<p>
  Podemos iterar sobre pilhas usando laços
  <code>for</code> (invertendo seus valores) ou laço
  <code>while</code> combinado com <code>pop</code>.
</p>

<p>
  É possível copiar listas utilizando shallow copy ou deep
  copy.
</p>

<p>É só isso… Te vejo no próximo artigo.</p>

