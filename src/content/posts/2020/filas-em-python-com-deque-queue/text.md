---
title: 'Filas em Python com deque (queue)'
description:
  'Filas em Python podem ser implementadas utilizando a estrutura de dados deque
  (do módulo collections) para garantirmos complexidade de tempo constante para
  inserção e remoção de elementos em qualquer uma das pontas, cabeça (head) ou
  cauda (tail).'
date: 2020-06-08
---

<h1>Filas em Python com deque (queue)</h1>

<p class="author">
  <span class="meta-date">
    <time datetime="2020-06-08">8 de junho de 2020</time>
  </span>
  ·
  <span class="meta-author">Luiz Otávio Miranda</span>
</p>

<p>
  Filas em Python podem ser implementadas utilizando a estrutura de
  dados <code>deque</code> (do módulo
  <a href="https://docs.python.org/pt-br/3.9/library/collections.html">collections</a>) para garantirmos complexidade de tempo constante para
  inserção e remoção de elementos em
  qualquer uma das pontas, cabeça (head) ou cauda (tail).
  <strong>Deque</strong> – abreviação de
  <em>Double Ended Queue</em> (ou Fila de duas pontas) – pode ser
  usada para implementar filas FIFO (que veremos a seguir) e
  <a href="https://www.otaviomiranda.com.br/2020/pilhas-em-python-com-listas-stack/">pilhas LIFO</a>.
</p>

<h2>O que são filas?</h2>

<p>
  Quando falamos em filas, estamos tratando de uma estrutura de dados
  abstrata que se comporta exatamente como uma fila na vida real.
  Elementos são adicionados à cauda (tail) e removidos da
  frente (head).
</p>

<p>
  Porém, remover elementos da frente (com índice 0) pode
  ser problemático do ponto de vista de desempenho do programa.
  Por exemplo, poderíamos usar listas para criar filas (<a href="https://www.otaviomiranda.com.br/2020/pilhas-em-python-com-listas-stack/">como fizemos com as pilhas</a>), porém elas não são otimizadas para isso e
  acabam movendo os índices de todos os elementos posteriores ao
  elemento removido. Infelizmente, isso nos dá uma complexidade
  de tempo linear O(n), ou seja, ao remover um item do começo da
  lista, o interpretador precisa navegar em todos os seus elementos,
  reajustando os índices dos elementos restantes.
</p>

<p>
  No entanto, isso não ocorre com <code>deque</code>. Segundo a
  <a href="https://docs.python.org/pt-br/3.9/library/collections.html#collections.deque">documentação oficial do Python</a>, <code>deque</code> adiciona e remove em ambas as
  direções com complexidade de tempo de aproximadamente
  O(1). Isso quer dizer que requer aproximadamente uma
  operação para a adição e
  remoção de elementos.
</p>

<p>
  De forma resumida, <code>deque</code> é mais rápido para
  inserir e remover elementos da frente da fila (no índice 0).
</p>

<h2>Filas são FIFO</h2>

<p>
  Na programação, o comportamento de uma fila é
  conhecido como
  <a href="https://pt.wikipedia.org/wiki/FIFO">FIFO</a> (First In First
  Out), ou seja, o primeiro que entrar será o primeiro a sair.
  Isso é exatamente o que acontece em uma fila da vida real, a
  primeira pessoa a entrar na fila, será a primeira a ser
  atendida. É claro, se ninguém furar a fila!
</p>

<p>Imagine uma fila de letras: A, B, C.</p>

<p>
  Agora, suponha que eu quero adicionar um novo elemento, o D. Para as
  filas, esse elemento deve ser adicionado na cauda, como mostra o
  diagrama a seguir:
</p>


![Queues em Python - Exemplo 1](./imgs/Queues-1.png)





<p>
  Mas, se eu precisasse remover um elemento da fila anterior, o elemento
  removido deveria sair na cabeça (head).
</p>

<p>Este elemento é representado pelo A na imagem a seguir:</p>


![Queues em Python - Exemplo 2](./imgs/Queues-2-1.png)





<p>
  Além disso, perceba que agora, além da minha fila
  não ter mais o elemento A, os índices foram
  reorganizados. B passou a ter o índice 0, C, índice 1 e
  D, índice 2. Lembre-se que <code>deque</code> é
  otimizada para isso.
</p>

<p>
  Outra informação que você deve ter percebido,
  é que a cabeça (head) e a cauda (tail) da minha fila
  também mudaram. B é a cabeça e D a cauda.
</p>

<h2>Filas em Python com deque</h2>

<p>
  Se fossemos representar a fila apresentada nas imagens anteriores com
  os elementos A, B e C, em seguida acrescentar o elemento D, o
  código ficaria da seguinte maneira:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> collections </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> deque</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">fila </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> deque</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'C'</span><span style="color:#9399B2">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Inserindo o elemento D</span></span>
<span class="line"><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'D'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># deque(['A', 'B', 'C', 'D'])</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">)</span></span></code></pre>

<p>
  Perceba que <code>deque</code> tem quase os mesmos métodos de
  uma lista normal no Python (por isso podemos usá-las como
  <a href="https://www.otaviomiranda.com.br/2020/pilhas-em-python-com-listas-stack/">pilhas</a>
  se quisermos). Então, para inserir um novo elemento na cauda da
  fila, basta usarmos o método <code>append</code>.
</p>

<p>
  Para a remoção do elemento A (como fizemos na
  seção anterior desse post), poderíamos utilizar o
  método <code>popleft</code> (remover da esquerda).
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> collections </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> deque</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">fila </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> deque</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'C'</span><span style="color:#9399B2">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Inserindo o elemento D</span></span>
<span class="line"><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'D'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Removendo A</span></span>
<span class="line"><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">popleft</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># deque(['B', 'C', 'D'])</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">)</span></span></code></pre>

<p>É bem simples, não é mesmo?</p>

<h2>popleft retorna o elemento removido</h2>

<p>
  Um comportamento padrão sempre que usamos métodos
  “<code>pop</code>” (de remoção) é que
  o elemento removido é retornado por essa função.
  Isso não é diferente como
  <code>popleft</code>.
</p>

<p>
  Por exemplo, se eu estou removendo um elemento da minha fila, é
  natural querer usá-lo em algum momento do meu código.
  Então, eu poderia usar uma variável para isso.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> collections </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> deque</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">fila </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> deque</span><span style="color:#9399B2">([</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'C'</span><span style="color:#9399B2">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Inserindo o elemento D</span></span>
<span class="line"><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'D'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Removendo A e usando seu valor</span></span>
<span class="line"><span style="color:#CDD6F4">head </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">popleft</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># A</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">head</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># deque(['B', 'C', 'D'])</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">)</span></span></code></pre>

<p>
  Perceba que no código acima (linha 9),
  <code>popleft</code> faz duas coisas:
</p>

<ol>
  <li>Remove o primeiro elemento da fila (cabeça);</li>
  <li>
    Retorna o valor do elemento removido para a variável
    <code>head</code> (A).
  </li>
</ol>

<p>
  Assim, é possível utilizar o valor removido conforme
  preferir no seu código.
</p>

<h2>Criando uma filas em Python</h2>

<p>
  Assim como fizemos com as pilhas (no
  <a href="https://www.otaviomiranda.com.br/2020/pilhas-em-python-com-listas-stack/">artigo anterior</a>), podemos encapsular <code>deque</code> em uma classe para manter o
  controle sobre os métodos que deverão ser utilizados
  para manter o comportamento <strong>FIFO</strong> das filas. Afinal,
  <code>deque</code> não tem apenas os métodos
  <code>append</code> e <code>popleft</code>. De fato, se você
  conferir a
  <a href="https://docs.python.org/3.9/library/collections.html#collections.deque">documentação oficial</a>, vai ver que existem vários outros métodos
  possíveis para <code>deque</code>, incluindo os que quebram o
  princípio <strong>FIFO</strong>, removendo elementos da cauda
  ou inserindo na cabeça, por exemplo.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> Deque</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> Any</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> collections </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> deque</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">class</span><span style="color:#F9E2AF;font-style:italic"> Queue</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">    """Uma classe representando uma fila"""</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __init__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> maxlen</span><span style="color:#94E2D5">=</span><span style="color:#FAB387">None</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # Deque permite enviar maxlen</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # para criar um tamanho máximo para</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # a fila</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">        self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> Deque</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">Any</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#89B4FA"> deque</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">maxlen</span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4">maxlen</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89B4FA;font-style:italic"> enqueue</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> *</span><span style="color:#EBA0AC;font-style:italic">items</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC"> Any</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Enqueue (enfileirar) é o mesmo que append"""</span></span>
<span class="line"><span style="color:#CBA6F7">        for</span><span style="color:#CDD6F4"> item </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> items</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">            self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">item</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89B4FA;font-style:italic"> dequeue</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Any</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Dequeue (desenfileirar) é o mesmo que popleft"""</span></span>
<span class="line"><span style="color:#CBA6F7">        if</span><span style="color:#CBA6F7"> not</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">            raise</span><span style="color:#FAB387;font-style:italic"> IndexError</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'pop from empty queue'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">popleft</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __repr__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __bool__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> bool</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#CBA6F7;font-style:italic"> bool</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __len__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#FAB387;font-style:italic"> len</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">)</span></span></code></pre>

<p>
  Na classe anterior, criei apenas os métodos que precisava para
  minha fila. Nesse sentido, também mudei o nome de algumas
  coisas: <code>append</code> passou a ser
  <code>enqueue</code> (enfileirar); <code>popleft</code> passou a ser
  <code>dequeue</code> (desenfileirar). Contudo, eles continuam fazendo
  o mesmo trabalho.
</p>

<p>
  Também permiti adicionar o argumento
  “<code>maxlen</code>” de <code>deque</code>, para fixar um
  tamanho máximo para nossa fila.
</p>

<p>
  Além disso, nós precisamos saber de três coisas
  muito importantes:
</p>

<ul>
  <li>
    Quais valores estão na fila? Por isso o método
    <code>__repr__</code>;
  </li>
  <li>
    Existem valores na minha fila? Por isso o método
    <code>__bool__</code>;
  </li>
  <li>
    Quantos valores tem na minha fila? Por isso o método
    <code>__len__</code>.
  </li>
</ul>

<p>
  Você pode enfeitar essa classe com os métodos que
  preferir. Aqui eu quis manter as coisas o mais simples que foi
  possível.
</p>

<p>Agora podemos usar a classe:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Instanciando</span></span>
<span class="line"><span style="color:#CDD6F4">fila </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> Queue</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Enfileirando A, B e C</span></span>
<span class="line"><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">enqueue</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'C'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Enfileirando D</span></span>
<span class="line"><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">enqueue</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'D'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Recuperando A</span></span>
<span class="line"><span style="color:#CDD6F4">head </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">dequeue</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">head</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Mostrando a fila</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span>
<span class="line"><span style="color:#A6E3A1">Resultado:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">A</span></span>
<span class="line"><span style="color:#A6E3A1">deque(['B', 'C', 'D'])</span></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span></code></pre>

<h3>Indo além do básico</h3>

<p>
  Em algum momento, você pode querer iterar sobre a sua fila ou
  então obter um item diretamente. Pra isso podemos repassar o
  método <code>__iter__</code> da nossa classe para o
  método <code>__iter__</code> do <code>deque</code> da mesma
  (<code>__items</code>). Veja a implementação do
  método <code>__iter__</code> por si só.
</p>

<p>
  Este método deve estar dentro da classe, é claro
  (não se preocupe, vou mostrar o código completo logo
  abaixo).
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89DCEB;font-style:italic"> __iter__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Iterator</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">.</span><span style="color:#89DCEB;font-style:italic">__iter__</span><span style="color:#9399B2">()</span></span></code></pre>

<p>
  Por fim, se você quiser permitir que um item da fila seja obtido pelo
  seu índice, também pode implementar o método __getitem__, dessa
  maneira:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89DCEB;font-style:italic"> __getitem__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> index</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Any</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#EBA0AC;font-style:italic">__items</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">index</span><span style="color:#9399B2">]</span></span></code></pre>

<p>Veja como ficou nossa classe completa:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> Deque</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> Any</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> Iterator</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> collections </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> deque</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">class</span><span style="color:#F9E2AF;font-style:italic"> Queue</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">    """Uma classe representando uma fila"""</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __init__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> maxlen</span><span style="color:#94E2D5">=</span><span style="color:#FAB387">None</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # Deque permite enviar maxlen</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # para criar um tamanho máximo para</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">        # a fila</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">        self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> Deque</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">Any</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#89B4FA"> deque</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">maxlen</span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4">maxlen</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89B4FA;font-style:italic"> enqueue</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> *</span><span style="color:#EBA0AC;font-style:italic">items</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC"> Any</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#FAB387"> None</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Enqueue (enfileirar) é o mesmo que append"""</span></span>
<span class="line"><span style="color:#CBA6F7">        for</span><span style="color:#CDD6F4"> item </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> items</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">            self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">append</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">item</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89B4FA;font-style:italic"> dequeue</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Any</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#A6E3A1">        """Dequeue (desenfileirar) é o mesmo que popleft"""</span></span>
<span class="line"><span style="color:#CBA6F7">        if</span><span style="color:#CBA6F7"> not</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">            raise</span><span style="color:#FAB387;font-style:italic"> IndexError</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'pop from empty queue'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">popleft</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __repr__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __bool__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> bool</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#CBA6F7;font-style:italic"> bool</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __len__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#FAB387;font-style:italic"> len</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __iter__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Iterator</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">__items</span><span style="color:#9399B2">.</span><span style="color:#89DCEB;font-style:italic">__iter__</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    def</span><span style="color:#89DCEB;font-style:italic"> __getitem__</span><span style="color:#9399B2">(</span><span style="color:#F38BA8;font-style:italic">self</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> index</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> int</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CDD6F4"> Any</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CBA6F7">        return</span><span style="color:#F38BA8;font-style:italic"> self</span><span style="color:#9399B2">.</span><span style="color:#EBA0AC;font-style:italic">__items</span><span style="color:#9399B2">[</span><span style="color:#EBA0AC;font-style:italic">index</span><span style="color:#9399B2">]</span></span></code></pre>

<p>
  Perceba que agora temos os métodos __iter__ e __getitem__. Isso nos
  permite iterar sobre nossa fila e também obter itens por índice, veja:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Instanciando</span></span>
<span class="line"><span style="color:#CDD6F4">fila </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> Queue</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Enfileirando A, B, C e D</span></span>
<span class="line"><span style="color:#CDD6F4">fila</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">enqueue</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'B'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'C'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'D'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Obtendo o elemento com índice 1 (B)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Item com índice 1:'</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> fila</span><span style="color:#9399B2">[</span><span style="color:#FAB387;font-style:italic">1</span><span style="color:#9399B2">],</span><span style="color:#EBA0AC;font-style:italic"> end</span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1">'</span><span style="color:#F5C2E7">\n\n</span><span style="color:#A6E3A1">'</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Iterando com for em nossa fila</span></span>
<span class="line"><span style="color:#CBA6F7">for</span><span style="color:#CDD6F4"> item </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> fila</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'Iteração:'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> item</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span>
<span class="line"><span style="color:#A6E3A1">Resultado:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">Item com índice 1: B</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">Iteração: A</span></span>
<span class="line"><span style="color:#A6E3A1">Iteração: B</span></span>
<span class="line"><span style="color:#A6E3A1">Iteração: C</span></span>
<span class="line"><span style="color:#A6E3A1">Iteração: D</span></span>
<span class="line"><span style="color:#A6E3A1">"""</span></span></code></pre>

<p>
  Nossa classe ficou assim, simples mas útil e eficaz. Todavia,
  você pode adicionar os métodos que preferir. Apenas
  adicionei métodos que acho que podem ser úteis.
</p>

<h2>Resumo</h2>

<p>
  Em conclusão, você viu o seguinte ao decorrer desse post:
</p>

<ul>
  <li>
    Filas em Python podem ser implementadas utilizando
    <code>deque</code>;
  </li>
  <li>
    Filas têm o comportamento <strong>FIFO</strong> (First In
    First Out), assim como na vida real;
  </li>
  <li><code>append</code> adiciona elementos na cauda (tail);</li>
  <li>
    <code>popleft</code> remove elementos da cabeça (head);
  </li>
  <li>
    <code>deque</code> é muito genérica, por isso criamos
    nossa própria classe para permitir apenas os métodos
    que queremos.
  </li>
</ul>

<p>
  Como resultado, agora você já sabe criar filas em Python.
  Além disso, também sabe usar
  <code>deque</code>, que é outra estrutura de dados abstrata
  conhecida em programação.
</p>

<p>Te vejo no próximo post!</p>
