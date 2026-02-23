---
title: 'Normalização Unicode em Python'
description:
  'Além da normalização Unicode e as formas de normalização NFC, NFD, NFKC e
  NFKD, você vai aprender tudo o que precisa saber sobre o padrão Unicode em si
  e Python.'
date: 2020-08-20
author: 'Luiz Otávio Miranda'
---

<p>
  Além da
  <strong>normalização Unicode</strong> e as formas de
  normalização NFC, NFD, NFKC e NFKD, você vai
  aprender tudo o que precisa saber sobre o padrão Unicode em si
  e Python.
</p>

<p>
  Falando sobre a normalização Unicode em si, que
  provavelmente é o que te trouxe aqui: normalizar é o ato
  de transformar strings (<a href="https://pt.wikipedia.org/wiki/Unicode">textos no padrão unicode</a>) para uma forma normal onde os caracteres sempre terão a
  mesma representação binária em todo o seu
  programa. Isso facilita a comparação,
  indexação e ordenação de strings já
  que, em um sistema “normalizado”, essas
  operações são é mais confiáveis.
</p>

<p>
  Frequentemente você verá emojis no meio do texto com um
  código na frete. Eu espero que você entenda isso ao
  terminar sua leitura, porque eu não costumo escrever assim, ok?
  🤐 (U+1F910).
</p>

<h2>Um contexto para iniciarmos</h2>

<p>
  Vamos iniciar uma jornada longa neste momento. Portanto, vou te deixar
  um contexto para discutirmos ao longo de todo o artigo. Porém,
  não se preocupe se não entender nada agora. Prometo que
  vou explicar tudo o que você vai ver a seguir 🙏 (U+1F64F).
</p>

<h3>Porque precisamos de normalização?</h3>

<p>
  No padrão Unicode, caracteres são representados por
  <strong>code points</strong> (códigos de identidade do
  caractere). Mas, alguns desses caracteres são representados
  mais de uma vez para que o padrão Unicode mantenha
  compatibilidade com outros padrões que vieram antes dele.
</p>

<p>
  Por exemplo, a letra “<code>á</code>” (a com acento
  agudo), representada por “<code>U+00E1</code>” em
  <a href="https://en.wikipedia.org/wiki/Code_point">code point</a>
  Unicode, também pode ser representada por
  <code>"U+0061"</code> (a) +
  “<code>U+0301</code>” (acento agudo). Na segunda
  representação, o acento é algo que é
  chamado de
  <a href="https://en.wikipedia.org/wiki/Combining_character">combining character</a>, porque combinado ao “<strong>a</strong>“, forma
  “<strong>á</strong>“. No entanto,
  “<code>U+00E1</code>” (<strong>á</strong>)
  não é igual a “<code>U+0061</code>” +
  “<code>U+0301</code>” (<strong>á</strong>) do ponto
  de vista do seu programa em Python, mesmo que visualmente o caractere
  final seja exatamente o mesmo (<strong>á</strong>).
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\u00e1</span><span style="color:#A6E3A1">'</span></span>
<span class="line"><span style="color:#A6E3A1">'á'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\u0061\u0301</span><span style="color:#A6E3A1">'</span></span>
<span class="line"><span style="color:#A6E3A1">'á'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\u00e1</span><span style="color:#A6E3A1">'</span><span style="color:#94E2D5"> ==</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\u0061\u0301</span><span style="color:#A6E3A1">'</span></span>
<span class="line"><span style="color:#FAB387">False</span></span></code></pre>

<p>
  A <strong>normalização unicode</strong> vai resolver
  este problema mantendo apenas uma forma normal dos
  “<strong>á</strong>s” apresentados acima. Ou
  “<code>U+00E1</code>” ou “<code>U+0061</code>”
  + “<code>U+0301</code>“. No entanto, para entender porque
  precisamos de normalização unicode em nosso sistema,
  precisamos entender o Padrão Unicode como um todo.
</p>

<h2>Unicode – o básico do básico</h2>

<p>
  O Unicode é um padrão que permite aos computadores
  representar e manipular texto de qualquer sistema de escrita existente
  utilizando códigos para caracteres individuais. Cada caractere
  é mapeado para um código específico chamado de
  “<em>code point</em>“.
</p>

<p>
  Code Points são representados por um
  <strong>U+</strong> seguido de
  <strong>4 a 6 dígitos hexadecimais</strong> (de 0 a 0x10FFFF).
  Por exemplo: o code point <strong>U+0041</strong> representa a letra
  “<strong>A</strong>“; o <strong>U+0042</strong>, a letra
  “<strong>B</strong>“, o <strong>U+1F40D</strong>, uma
  cobra verde “🐍”, e assim por diante.
</p>

<p>
  Para que um sistema possa representar um
  <strong>code point</strong> como um caractere “normal”,
  ele precisa de um sistema de
  <a href="https://pt.wikipedia.org/wiki/Codifica%C3%A7%C3%A3o_de_caracteres">codificação de caracteres</a>. Este sistema de codificação também é
  provido pelo padrão Unicode e é responsável por
  representar uma sequência de
  <strong>code points</strong> (qualquer string no padrão
  Unicode) como um conjunto de <strong>code units</strong> na
  memória do computador, que então são mapeados
  para bytes de 8-bits.
</p>

<p>
  Apesar do padrão Unicode disponibilizar um conjunto
  razoavelmente grande de sistemas de codificação de
  caracteres, como UTF-7, UTF-8, UTF-EBCDIC, UTF-16 e UTF32, a
  codificação mais usada atualmente é a
  <strong>UTF-8</strong> (UTF sendo
  <a href="https://pt.wikipedia.org/wiki/UTF-8">Unicode Transformation Format</a>
  e 8 sendo o número de bits por código). No momento da
  escrita deste post, o site
  <a href="https://w3techs.com/technologies/history_overview/character_encoding">W3Techs – Historical trends in the usage statistics of
    character encodings for websites</a>, mostra o padrão UTF-8 sendo usado em
  <strong>94.7%</strong> dos sites analisados até 15/04/2020 👀
  (U+1F440).
</p>

<p>
  É uma boa ideia manter seu editor de códigos ou IDE no
  padrão <strong>UTF-8</strong> para digitar seus códigos
  em Python 🤷&zwj;♂️ (U+1F937).
</p>

<h2>Python e Unicode</h2>

<p>
  <strong>Dica 💡</strong> (U+1F4A1)<strong>:</strong> Boa parte do
  trecho a seguir foi baseada na
  <a href="https://docs.python.org/3.9/howto/unicode.html">documentação oficial do Python</a>.
</p>

<p>
  As strings (<code>str</code>) em Python contém caracteres
  Unicode desde a versão 3.0. Isso quer dizer que qualquer valor
  entre aspas simples, duplas ou triplas são salvas em Unicode.
  De fato, o Python 🐍 suporta até mesmo identificadores com
  caracteres Unicode.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> atenção </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Um teste unicode'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> atenção</span></span>
<span class="line"><span style="color:#A6E3A1">'Um teste unicode'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span></span></code></pre>

<h3>Usando caracteres unicode</h3>

<p>
  Também existem várias maneiras para usar caracteres
  Unicode dentro do código 💻 (U+1F4BB).
</p>

<p>
  Por exemplo, você pode usar o caractere literal (como de
  costume), mas também pode usar o nome do caractere Unicode, um
  hexadecimal ou até um número decimal que representaria o
  caractere usando função
  <a href="https://docs.python.org/3/library/functions.html#chr">chr</a>:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> 'A'</span><span style="color:#9399B2;font-style:italic"> # Caractere literal A</span></span>
<span class="line"><span style="color:#A6E3A1">'A'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#FAB387;font-style:italic"> chr</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">0x</span><span style="color:#FAB387">41</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic"> # Usando a função chr com hexadecimal</span></span>
<span class="line"><span style="color:#A6E3A1">'A'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#FAB387;font-style:italic"> chr</span><span style="color:#9399B2">(</span><span style="color:#FAB387">65</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic"> # Usando a função chr com decimal</span></span>
<span class="line"><span style="color:#A6E3A1">'A'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\N{Latin Capital Letter A}</span><span style="color:#A6E3A1">'</span><span style="color:#9399B2;font-style:italic"> # Usando o nome do caractere</span></span>
<span class="line"><span style="color:#A6E3A1">'A'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\u0041</span><span style="color:#A6E3A1">'</span><span style="color:#9399B2;font-style:italic"> # Usando um hexadecimal 16-bit</span></span>
<span class="line"><span style="color:#A6E3A1">'A'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\U00000041</span><span style="color:#A6E3A1">'</span><span style="color:#9399B2;font-style:italic"> # Usando um hexadecimal 32-bit</span></span>
<span class="line"><span style="color:#A6E3A1">'A'</span></span></code></pre>

<p>
  Veja acima, que representei a letra “A” de várias
  maneiras diferentes.
</p>

<h3>Obtendo valores Unicode dos caracteres</h3>

<p>
  Além do que descrevi anteriormente, você também
  pode fazer o inverso, ou seja, pegar os valores decimal e hexadecimal
  que representam o caractere desejado.
</p>

<p>
  Para isso, você pode usar as funções
  <a href="https://docs.python.org/3/library/functions.html#ord">ord</a>
  e
  <a href="https://docs.python.org/3/library/functions.html#hex">hex</a>, dependendo do que deseja (talvez seja necessário
  combiná-las).
</p>

<p>Por exemplo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#FAB387;font-style:italic"> ord</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic"> # Obtém o valor decimal que representa A</span></span>
<span class="line"><span style="color:#FAB387">65</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#FAB387;font-style:italic"> hex</span><span style="color:#9399B2">(</span><span style="color:#FAB387;font-style:italic">ord</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'A'</span><span style="color:#9399B2">))</span><span style="color:#9399B2;font-style:italic"> # Obtém o valor hexadecimal que representa A</span></span>
<span class="line"><span style="color:#A6E3A1">'0x41'</span></span></code></pre>

<h3>Encode (str) e Decode (bytes)</h3>

<p>
  É possível converter uma string em bytes ou bytes em
  string usando os métodos <code>encode</code> da
  <a href="https://docs.python.org/pt-br/3/library/stdtypes.html#str">string</a>
  ou <code>decode</code> de
  <a href="https://docs.python.org/pt-br/3/library/stdtypes.html#bytes">bytes</a>. Esses métodos recebem dois argumentos. O primeiro argumento
  especifica a codificação de caracteres desejada (<code>utf-8</code>
  ou qualquer outra disponível em
  <a href="https://docs.python.org/3/library/codecs.html#standard-encodings">Standard Encodings</a>
  – use <code>utf-8</code> sempre que possível 🕵). O
  segundo informa como os erros devem ser tratados (falaremos desse
  argumento mais adiante neste post).
</p>

<p>
  Porém, é importante tomar cuidado ao converter uma
  codificação de caracteres para outra (exemplo, de
  <strong>ASCII</strong> para <strong>UTF-8</strong>). Pode não
  ser possível mapear o código de um caractere para outro
  em determinadas circunstâncias.
</p>

<p>Veja exemplos a seguir.</p>

<h4>Encode (str)</h4>

<p>
  Suponha que eu queira converter uma string
  <strong>UTF-8</strong> para bytes <strong>UTF-8</strong>.
</p>

<p>Eu posso fazer isso da seguinte maneira:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Otávio'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_em_bytes </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> meu_nome</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">encode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'utf-8'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_em_bytes</span></span>
<span class="line"><span style="color:#A6E3A1;font-style:italic">b</span><span style="color:#A6E3A1">'Ot</span><span style="color:#F5C2E7">\xc3\xa1</span><span style="color:#A6E3A1">vio'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span></span></code></pre>

<p>
  Bytes são representados por
  <code>b'valores'</code> em Python.
</p>

<p>
  De acordo com o código anterior, tudo ocorreu perfeitamente.
  Isso porque converti uma string sabendo que ela tinha caracteres
  <strong>UTF-8</strong> para bytes em <strong>UTF-8</strong>. Mantendo
  a mesma codificação de caractere, não terei
  problemas.
</p>

<p>
  Mas, eu também poderia querer converter minha string
  <strong>UTF-8</strong> para
  <a href="https://pt.wikipedia.org/wiki/ASCII">ASCII</a> (um outro tipo
  de codificação de caracteres). Dependendo do que
  você estiver convertendo, não terá problemas,
  porque o UTF-8 foi feito para ser compatível com outras
  codificações de caracteres existentes. Porém,
  assim que um caractere sair do range suportado pelo ASCII (de 0 a 127
  em base 10), terei um erro:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_em_bytes </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> meu_nome</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">encode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'ascii'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#89B4FA">Traceback </span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">most recent call last</span><span style="color:#9399B2">):</span></span>
<span class="line"><span style="color:#CDD6F4">...</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">UnicodeEncodeError</span><span style="color:#9399B2">:</span><span style="color:#A6E3A1"> 'ascii'</span><span style="color:#CDD6F4"> codec can</span><span style="color:#A6E3A1">'t encode character '</span><span style="color:#9399B2">\</span><span style="color:#CDD6F4">xe1' in position 2: ordinal not in range(128)</span></span></code></pre>

<p>
  Veja que no erro é descrito o problema. Não foi
  possível codificar o caractere
  <code>'\xe1'</code> na posição 2.
</p>

<p>
  Lembra que te mostrei como exibir o caractere utilizando a
  função <code>chr</code>? Então, o caractere
  <code>\xe1</code> é o mesmo que <code>chr(0xe1)</code>, ou
  “<strong>á</strong>” de
  “<strong>Otávio</strong>“. Esse caractere
  não faz parte da tabela <strong>ascii</strong>, portanto o
  erro.
</p>

<p>
  Logo mais veremos o segundo argumento e você poderá
  selecionar o que acontece quando um erro assim ocorrer.
</p>

<h4>Decode (bytes)</h4>

<p>
  Se o método <code>encode</code> é usado para converter
  string em bytes, o método <code>decode</code> é usado
  para fazer o inverso disso, converter bytes em strings.
</p>

<p>
  Por exemplo, suponha que eu tenha apenas os bytes e queira resgatar
  seu valor para uma string <strong>UTF-8</strong>.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_em_bytes </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1;font-style:italic"> b</span><span style="color:#A6E3A1">'Ot</span><span style="color:#F5C2E7">\xc3\xa1</span><span style="color:#A6E3A1">vio'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_str </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> meu_nome_em_bytes</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">decode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'utf-8'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_str</span></span>
<span class="line"><span style="color:#A6E3A1">'Otávio'</span></span></code></pre>

<p>
  Novamente, aqui ocorreu tudo perfeitamente, porque eu sabia que a
  codificação dos bytes era <strong>UTF-8</strong> e eu os
  decodifiquei adequadamente. Então tudo ocorreu como esperado.
  Mas, e se eu quisesse decodificar esses bytes em
  <strong>ASCII</strong>?
</p>

<p>Inicialmente, não tem como (😒 – U+1F612)!</p>

<p>
  Para isso você precisa saber a codificação de
  caracteres usada na codificação para decodificar.
</p>

<p>
  <strong>Dica:</strong>
  <a href="https://pypi.org/project/chardet/">chardet</a> ajuda a tentar
  descobrir a codificação de caracteres usada em bytes que
  você não saberia de outra forma. Mas a maneira mais
  simples continua sendo: “pergunte ao dono dos bytes qual a
  codificação”. <strong>UTF-8</strong> é um
  bom chute inicial.
</p>

<h4>Erros de codificação em decode (bytes)</h4>

<p>
  Imagine que eu não saiba a codificação usada em
  determinados bytes e tente chutar <strong>ascii</strong>, por exemplo:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_str </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> meu_nome_em_bytes</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">decode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'ascii'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic"> # Otávio (em UTF-8)</span></span>
<span class="line"><span style="color:#89B4FA">Traceback </span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">most recent call last</span><span style="color:#9399B2">):</span></span>
<span class="line"><span style="color:#CDD6F4">...</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">UnicodeDecodeError</span><span style="color:#9399B2">:</span><span style="color:#A6E3A1"> 'ascii'</span><span style="color:#CDD6F4"> codec can</span><span style="color:#A6E3A1">'t decode byte 0xc3 in position 2: ordinal not in range(128)</span></span></code></pre>

<p>
  Perceba que aqui, além de um erro de
  <code>UnicodeDecodeError</code>, eu também tenho um
  <strong>code point</strong> incorreto. Se você observar,
  <code>0xc3</code> aponta para “<strong>Ã</strong>”
  , que nem existia na minha string anterior.
</p>

<p>
  O motivo disso é simples,
  “<strong>á</strong>” da minha string anterior usa
  dois bytes em <strong>UTF-8</strong> e o codec
  <strong>ASCII</strong> não sabe disso. Então ele tenta
  decodificar byte por byte e gera esse erro estranho. Se isso passasse
  sem erros, o resultado seria um monte de caracteres que não
  fariam sentido algum. Por exemplo, se eu usasse o codec
  <a href="https://pt.wikipedia.org/wiki/ISO/IEC_8859-1">latin1</a>
  ao invés de <strong>ascii</strong>, o resultado seria
  <strong>‘OtÃ¡vio’</strong>.
</p>

<p>
  Para contornar essa situação, eu preciso saber qual a
  codificação de caracteres foi usada para codificar os
  bytes anteriormente. Sabendo disso, eu deveria decodificar esses bytes
  usando a codificação correta antes de fazer qualquer
  outra coisa.
</p>

<p>
  Depois de decodificar, eu poderia codificar novamente usando o
  <strong>codec</strong> que eu preferir, contando que ele suporte os
  caracteres que eu estiver usando (usa sempre <strong>UTF-8</strong>,
  pelo amor de Deus 😬 – U+1F62C).
</p>

<p>
  Por exemplo, se eu quero codificar de UTF-8 para
  <a href="https://pt.wikipedia.org/wiki/ISO/IEC_8859-1">ISO-8859-1 (Latin1)</a>, que é algo que vejo muito aqui no Brasil, principalmente em
  sistemas públicos, poderia fazer assim:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_str </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> meu_nome_em_bytes</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">decode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'utf8'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic"> # Otávio</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_em_bytes_latin </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> meu_nome_str</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">encode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'latin_1'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic"> # Otávio</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> meu_nome_em_bytes_latin</span></span>
<span class="line"><span style="color:#A6E3A1;font-style:italic">b</span><span style="color:#A6E3A1">'Ot</span><span style="color:#F5C2E7">\xe1</span><span style="color:#A6E3A1">vio'</span><span style="color:#9399B2;font-style:italic"> # Otávio</span></span></code></pre>

<p>
  Basicamente, isso foi uma conversão de
  <strong>UTF-8</strong> para <strong>latin_1</strong>. Tenha
  noção de que sempre que essas conversões ocorrem,
  uma codificação de caracteres deve suportar a outra. O
  Unicode foi criado para ser compatível com todas as
  codificações existentes. No entanto, apenas no sentido
  de “qualquer codificação” convertido para
  “Unicode”. Você pode ter problemas ao converter no
  sentido contrário, de Unicode para “qualquer
  codificação”, porque o padrão Unicode
  suporta muito mais caracteres do que qualquer outra
  codificação de caracteres que você quiser
  utilizar.
</p>

<p>
  No nosso exemplo, tudo funcionou perfeitamente porque todas as letras
  de “<strong>Otávio</strong>” estão presentes
  na tabela
  <a href="https://pt.wikipedia.org/wiki/ISO/IEC_8859-1">ISO-8859-1 (Latin1)</a>, caso contrário ocorreriam erros também.
</p>

<h4>Dicas</h4>

<p>
  <strong>Dica número 1:</strong> Sempre que possível use
  a codificação de caracteres <strong>UTF-8</strong>, na
  grande maioria das vezes isso é possível 😅 (U+1F605).
</p>

<p>
  <strong>Mais dicas:</strong> se você precisa detectar a
  codificação de caracteres de algo que não tem a
  mínima ideia como foi codificado, use
  <a href="https://pypi.org/project/chardet/">chardet.detect</a>. Ele
  não vai acertar em 100% dos casos, mas já me salvou de
  muitas enrascadas; Se você precisa saber quais codecs de
  codificação o Python suporta, veja
  <a href="https://docs.python.org/3.9/library/codecs.html#standard-encodings">Python Specific Encodings</a>.
</p>

<h4>Erros em encode e decode</h4>

<p>
  Como te contei anteriormente, <code>encode</code> e
  <code>decode</code> recebem um argumento com a
  codificação desejada e outro especificando como os erros
  devem ser tratados. Para o segundo argumento você pode enviar os
  seguintes valores:
</p>

<ul>
  <li>
    <code>'strict'</code> – É o padrão. O
    que levanta uma exceção de
    <a href="https://docs.python.org/3/library/exceptions.html#UnicodeEncodeError">UnicodeEncodeError</a>
    ou
    <a href="https://docs.python.org/3/library/exceptions.html#UnicodeDecodeError">UnicodeDecodeError</a>;
  </li>
  <li>
    <code>'replace'</code> – Usa o caractere U+FFFD
    (REPLACEMENT CHARACTER) no lugar do caractere que não
    pôde ser convertido;
  </li>
  <li>
    <code>'ignore'</code> – Simplesmente pula o caractere
    que não pode ser convertido;
  </li>
  <li>
    <code>'backslashreplace' </code>– que insere uma
    sequência <code>\xNN</code> no lugar do caractere que
    não pode ser convertido;
  </li>
  <li>
    <code>'xmlcharrefreplace'</code> – que insere uma
    referência para um caractere
    <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">XML</a>
    (isso só funciona com <code>encode</code>).
  </li>
</ul>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> 'Otávio'</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">encode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'utf-8'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#A6E3A1;font-style:italic">b</span><span style="color:#A6E3A1">'Ot</span><span style="color:#F5C2E7">\xc3\xa1</span><span style="color:#A6E3A1">vio'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1;font-style:italic"> b</span><span style="color:#A6E3A1">'Ot</span><span style="color:#F5C2E7">\xc3\xa1</span><span style="color:#A6E3A1">vio'</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">decode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'ascii'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'ignore'</span><span style="color:#9399B2">)</span><span style="color:#9399B2;font-style:italic"> # aqui usei ignore</span></span>
<span class="line"><span style="color:#A6E3A1">'Otvio'</span><span style="color:#9399B2;font-style:italic"> # e perdi o "á"</span></span></code></pre>

<h2>Normalização Unicode em Python</h2>

<p>
  Nós demos várias voltas até chegar aqui, mas
  é importante conhecer o que você está fazendo,
  não é mesmo (😏 – U+1F60F)?
</p>

<p>Então, só pra recapitular tudo:</p>

<ul>
  <li>Você conheceu os code points do Unicode;</li>
  <li>
    Também sabe que Unicode foi feito pensando em compatibilidade
    com padrões já existente (ascii, latin, etc). Vamos
    voltar nesse assunto já já;
  </li>
  <li>
    Viu que UTF-8 é uma das codificações de
    caracteres do Unicode;
  </li>
  <li>
    Está ciente que UTF-8 é, de longe, uma das
    codificações mais usadas no mundo;
  </li>
  <li>
    E deveria estar usando UTF-8 nos seus código (é muito
    provável que já esteja).
  </li>
</ul>

<p>
  Uma coisa que eu ainda não te falei é sobre a
  normalização e o porquê isso existe.
</p>

<p>
  Na verdade, todas as voltas foram para fazer você entender o que
  é Unicode de verdade. Se já sabia, melhor ainda!
</p>

<p>
  Então agora podemos ter uma conversa mais
  “complexa”.
</p>

<h3>Unicode e outros padrões</h3>

<p>
  Lembra que lá no comecinho ☝ (U+261D) te falei que eu poderia
  escrever a letra “<strong>á</strong>” de maneiras
  diferentes em Unicode?
</p>

<p>Só pra te lembrar:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\u00e1</span><span style="color:#A6E3A1">'</span></span>
<span class="line"><span style="color:#A6E3A1">'á'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#A6E3A1"> '</span><span style="color:#F5C2E7">\u0061\u0301</span><span style="color:#A6E3A1">'</span></span>
<span class="line"><span style="color:#A6E3A1">'á'</span></span></code></pre>

<p>
  Este pode não ser um problema no seu programa caso não
  tenha tido a necessidade de comparar esses dois
  “<strong>á</strong>s”. No entanto, em algum momento
  este problema pode aparecer e você vai demorar um tempo
  considerável até descobrir que isso está
  relacionado com a falta de normalização de caracteres.
  Nós buscamos recursos de várias fontes externas ao nosso
  programa e não sabemos qual forma normal utilizaram no sistema
  deles, e essa bomba pode explodir na sua mão.
</p>

<p>
  O Unicode foi criado pensando em compatibilidade, por isso alguns
  caracteres aparecem mais de uma vez. Por exemplo, se você olhar
  na tabela
  <a href="https://pt.wikipedia.org/wiki/ASCII">ASCII</a>, vai ver que a
  letra “<strong>A</strong>” é representada pelo
  mesmo hexadecimal que o Unicode (<strong>41</strong> vs
  <strong>U+0041</strong>). Se olhar na tabela
  <a href="https://pt.wikipedia.org/wiki/ISO/IEC_8859-1">ISO/IEC 8859-1</a>, vai ver que a letra “<strong>á</strong>”
  é representada exatamente pelo mesmo hexadecimal que o Unicode
  (<strong>00E1</strong> vs <strong>U+00E1</strong>). Isso quer dizer
  que o range de 0 a 127 (base 10) no Unicode é compatível
  com <strong>ASCII</strong>, o range de 0 a 255 (base 10) no Unicode
  é compatível com <strong>ISO/IEC 8859-1</strong> (ou
  latin1) e assim por diante. O Unicode tenta ser compatível com
  todos os padrões existentes.
</p>

<p>
  Isso vai acabar nos levando a um problema, vai vendo 🤨 (U+1F928)!
</p>

<h3>Caracteres pré-compostos e caracteres combinados</h3>

<p>
  Pelo motivo que te expliquei anteriormente, existem caracteres que
  são chamados de <strong>pré-compostos</strong>, como:
  <strong>á</strong>, <strong>é</strong>,
  <strong>À</strong>, <strong>Á</strong> e vários
  outros. Esses caracteres pré-compostos existem para manter
  compatibilidade com padrões que já existiam antes do
  Unicode.
</p>

<p>
  Por outro lado, o Unicode também dispõe de um sistema de
  combinação para estender o repositório de
  caractere suportados, e isso é genial (🥰 – U+1F970)!
</p>

<p>
  Pensa comigo 🤓 (U+1F913), se eu posso ter um
  “<strong>a</strong>” e um “<strong>acento agudo</strong>” em dois caracteres diferentes, não seria inteligente
  permitir que o <strong>acento agudo</strong> pudesse ser combinado com
  esse “<strong>a</strong>” ou com qualquer outro caractere
  formando um caractere único? Também acho!
</p>

<p>
  É exatamente esse o mecanismo que foi usado no Unicode. Ao
  invés de ter um <strong>code point</strong> único para
  cada caractere do planeta, fizeram um sistema de
  combinação de caracteres para formar esses
  símbolos loucos que a gente acaba usando e nem percebe.
</p>

<p>
  Esses caracteres que podem ser combinados com outros caracteres
  são chamados de
  <a href="https://en.wikipedia.org/wiki/Combining_character">combining character</a>
  e existem muitos deles.
</p>

<p>
  Mas, como nem tudo são flores (🥀 – U+1F940), isso gerou
  o problema de ter mais de um caractere representando a mesma coisa.
  Aquela probleminha que te mostrei no início, sobre os
  “<strong>á</strong>s”. Te falei que ia dar
  problema, não falei 😁 (U+1F601)?
</p>

<p>
  É aqui que entra a normalização e uma outra coisa
  que é chamada de
  <strong>equivalência canônica</strong>.
</p>

<h3>Equivalência canônica</h3>

<p>
  Como os criadores do Unicode são bem inteligentes 🧐 (U+1F9D0),
  eles criaram algo chamado de “<strong>equivalência canônica</strong>“. Isso é só uma maneira bonita de falar
  “esses dois caracteres são iguais”. Então,
  na equivalência canônica, <strong>U+00E1</strong> (<strong>á</strong>
  pré-composto) é igual a
  <strong>U+0041 + U+0301</strong> (<strong>a</strong> com
  <strong>acento agudo</strong> combinados). Isso acontece com todos os
  caracteres acentuados e mais outros milhares de caracteres que podem
  ser combinados em vários idiomas diferentes.
</p>

<p>
  Sabendo disso, você poder utilizar mais de uma forma normal em
  todo o seu programa: <strong>NFC</strong> e <strong>NFD</strong> (tem
  mais duas, mas é questão de compatibilidade, segura
  aí que a gente já fala sobre isso).
</p>

<h3>NFC – Normalization Form Canonical Composition</h3>

<p>
  Esse tipo de normalização Unicode visa
  <strong>manter os caracteres pré-compostos</strong> no seu
  programa (sem a separação de caractere + caractere
  combinado). Tais caracteres são unidos por equivalência
  canônica.
</p>

<p>
  Lembra dos <strong>á</strong>s? Aqui eles serão iguais,
  porque somente o <strong>U+00E1</strong> (<strong>á</strong>
  pré-composto) será mantido, os caracteres separados
  serão convertidos em pré-compostos. Por exemplo,
  <strong>U+0061 + U+0301</strong> (<strong>a</strong> com
  <strong>acento agudo</strong> combinados) se tornaria sempre
  <strong>U+00E1</strong> (<strong>á</strong>
  pré-composto).
</p>

<p>Por exemplo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CBA6F7"> import</span><span style="color:#CDD6F4"> unicodedata</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> nome </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Ot</span><span style="color:#F5C2E7">\u0061\u0301</span><span style="color:#A6E3A1">vio'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> nome_normalizado </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> unicodedata</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">normalize</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'NFC'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> nome</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#9399B2"> [</span><span style="color:#A6E3A1">'U+'</span><span style="color:#94E2D5"> +</span><span style="color:#FAB387;font-style:italic"> hex</span><span style="color:#9399B2">(</span><span style="color:#FAB387;font-style:italic">ord</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">letra</span><span style="color:#9399B2">))[</span><span style="color:#FAB387">2</span><span style="color:#9399B2">:].</span><span style="color:#89B4FA">zfill</span><span style="color:#9399B2">(</span><span style="color:#FAB387">4</span><span style="color:#9399B2">).</span><span style="color:#89B4FA">upper</span><span style="color:#9399B2">()</span><span style="color:#CBA6F7"> for</span><span style="color:#CDD6F4"> letra </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> nome_normalizado</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#9399B2">[</span><span style="color:#A6E3A1">'U+004F'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0074'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+00E1'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0076'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0069'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+006F'</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># O         t         á         v	      i         o</span></span></code></pre>

<p>
  Da pra perceber ali que a letra
  “<strong>á</strong>” do meu nome, sempre
  será mantida como <strong>U+00E1</strong> com esse tipo de
  normalização. Mesmo eu dizendo explicitamente que quero
  a string <code>'Ot\u0061\u0301vio'</code>.
</p>

<p>
  Resumidamente: isso não fará nada com caracteres
  pré-compostos, mas combinará caracteres equivalentes que
  estiverem separados em sua forma pré-composta por
  equivalência canônica.
</p>

<h3>NFD – Normalization Form Canonical Decomposition</h3>

<p>
  Esse tipo de normalização unicode visa manter os
  caracteres separados (com a separação entre caractere e
  caractere combinado). Os caracteres serão separados por
  equivalência canônica.
</p>

<p>
  Aqui os “<strong>á</strong>s” serão iguais,
  porque somente os caracteres
  <strong>U+0061 + U+0301</strong> (<strong>a</strong> com
  <strong>acento agudo</strong> combinados) serão mantidos. Os
  “<strong>á</strong>s” pré-compostos
  (<strong>U+00E1</strong>) serão convertidos em
  <strong>U+0061 + U+0301</strong>.
</p>

<p>Por exemplo:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CBA6F7"> import</span><span style="color:#CDD6F4"> unicodedata</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> nome </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Ot</span><span style="color:#F5C2E7">\u00e1</span><span style="color:#A6E3A1">vio'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> nome_normalizado </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> unicodedata</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">normalize</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'NFD'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> nome</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#9399B2"> [</span><span style="color:#A6E3A1">'U+'</span><span style="color:#94E2D5"> +</span><span style="color:#FAB387;font-style:italic"> hex</span><span style="color:#9399B2">(</span><span style="color:#FAB387;font-style:italic">ord</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">letra</span><span style="color:#9399B2">))[</span><span style="color:#FAB387">2</span><span style="color:#9399B2">:].</span><span style="color:#89B4FA">zfill</span><span style="color:#9399B2">(</span><span style="color:#FAB387">4</span><span style="color:#9399B2">).</span><span style="color:#89B4FA">upper</span><span style="color:#9399B2">()</span><span style="color:#CBA6F7"> for</span><span style="color:#CDD6F4"> letra </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> nome_normalizado</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#9399B2">[</span><span style="color:#A6E3A1">'U+004F'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0074'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0061'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0301'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0076'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0069'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+006F'</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># O         t         a         acento    v         i         o</span></span></code></pre>

<p>
  Perceba que agora eu consegui manter ambos os caracteres, tanto o
  “<strong>a</strong>” quanto o “<strong>acento agudo combinado</strong>“. Mesmo especificando que eu queria a string
  <code>'Ot\u00e1vio'</code>.
</p>

<p>
  Resumidamente: isso não fará nada com aqueles dois
  caracteres combinados, porém vai separar caracteres
  pré-compostos para sua forma combinada por equivalência
  canônica. Basicamente é
  <strong>U+00E1</strong> (<strong>á</strong>
  pré-composto) se transformando em
  <strong>U+0061 + U+0301</strong> (<strong>a</strong> com
  <strong>acento agudo</strong> combinados).
</p>

<h2>
  NFKC e NFKD – Normalization Form Compatibility
  Composition/Decomposition
</h2>

<p>
  Para complicar um pouquinho mais a sua vida na
  normalização unicode, também existem caracteres
  que <strong>não</strong> são definidos por
  <strong>equivalência canônica</strong>, mas por
  <strong>compatibilidade</strong>.
</p>

<p>
  Por exemplo, em alguns contextos, o símbolo
  <strong>TM</strong> pode ter o mesmo significado que ™ (TRADE
  MARK SIGN, U+2122). Nesse caso, ambos TM e ™ são
  definidos como caracteres compatíveis, mas que NÃO TEM
  <strong>equivalência canônica</strong>.
</p>

<p>
  Isso quer dizer que nem <strong>NFC</strong>, nem
  <strong>NFD</strong> vão normalizar esses dois valores.
</p>

<p>
  E só pra deixar claro isso pra você, caso ainda
  não tenha ficado:
</p>

<ul>
  <li>
    NF – Normalization Form (formato de
    normalização);
  </li>
  <li>C – Composition (composição – une);</li>
  <li>
    D – Decomposition (decomposição – separa);
  </li>
  <li>K – Compatibility (separa por compatibilidade).</li>
</ul>

<p>
  Agora que vem a pergunta de 1 milhão de dólares: qual a
  forma normal entre TM e ™? Depende! Em qual contexto?
</p>

<p>
  Vou te dar um exemplo: nós sabemos que seres humanos tem uma
  preguiça danada de digitar as coisas corretamente, certo?
  Imagine que a minha marca fosse
  <strong>OM™</strong> e eu quisesse que no meu sistema de busca,
  essa marca fosse encontrada. Você acha que as pessoas digitariam
  <strong>OMTM</strong> ou <strong>OM™</strong>? Eu acho que OMTM
  (caso não encontrassem antes apenas digitando OM). Mas podemos
  garantir as duas com a normalização.
</p>

<p>
  Então nesse caso, eu usaria a compatibilidade para transformar
  <strong>™</strong> em TM apenas para realizar uma
  comparação. Por exemplo, meu texto na base de dados
  seria normalizado temporariamente com NFKD e o texto enviado pelo
  usuário também seria normalizado para NFKD. Assim eu
  consigo encontrar <strong>OMTM</strong> ou
  <strong>OM™</strong> independente de como isso foi digitado pelo
  usuário.
</p>

<p>
  Para fazer a normalização unicode de
  <strong>™</strong> para TM, você vai precisar usar
  NF<strong>K</strong>(C ou D):
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CBA6F7"> import</span><span style="color:#CDD6F4"> unicodedata</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> nome </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'OM™'</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CDD6F4"> nome_normalizado </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> unicodedata</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">normalize</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'NFKC'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> nome</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#9399B2"> [</span><span style="color:#A6E3A1">'U+'</span><span style="color:#94E2D5"> +</span><span style="color:#FAB387;font-style:italic"> hex</span><span style="color:#9399B2">(</span><span style="color:#FAB387;font-style:italic">ord</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">letra</span><span style="color:#9399B2">))[</span><span style="color:#FAB387">2</span><span style="color:#9399B2">:].</span><span style="color:#89B4FA">zfill</span><span style="color:#9399B2">(</span><span style="color:#FAB387">4</span><span style="color:#9399B2">).</span><span style="color:#89B4FA">upper</span><span style="color:#9399B2">()</span><span style="color:#CBA6F7"> for</span><span style="color:#CDD6F4"> letra </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> nome_normalizado</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#9399B2">[</span><span style="color:#A6E3A1">'U+004F'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+004D'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0054'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+004D'</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># O         M         T         M</span></span></code></pre>

<p>
  Perceba que “<strong>C</strong>” e
  “<strong>D</strong>” aqui vão fazer o mesmo
  trabalho descrito anteriormente, mas o
  “<strong>K</strong>” vai trabalhar na compatibilidade que
  te falei antes.
</p>

<p>
  Então só pra resumir: O <strong>K</strong> significa
  <strong>compatibility</strong> e vai converter valores que estariam em
  apenas um <strong>code point</strong> Unicode em caracteres que seriam
  compatíveis (de acordo com as regras deles, que eu não
  sei quais são). Esses caracteres devem se comportar da mesma
  maneira em pesquisa, comparação, ordenação
  e indexação, mas podem mudar o significado e
  também podem parecer visualmente diferentes em vários
  contextos. Como no nosso exemplo, <strong>OMTM</strong> ou
  <strong>OM™</strong> deveria retornar os mesmos valores no meu
  sistema de pesquisa ou comparação, mas eles são
  bem diferentes visualmente.
</p>

<h3>Um ponto de atenção para K</h3>

<p>
  Tenha em mente que a partir do momento que eu separei os valores por
  compatibilidade, não consigo mais uni-los novamente. Por
  exemplo, se eu normalizar com <strong>K</strong> (NFKC ou NFKD) o
  valor ™ (TRADE MARK SIGN, U+2122), vou obter TM (como vimos).
  Porém TM não voltará a ser ™.
</p>

<p>
  Por este motivo, é super importante que você
  <strong>não</strong> salve os valores permanentemente
  utilizando <strong>K</strong>. Você deve normalizar
  temporariamente no momento que precisar realizar alguma
  comparação e eliminar esse valor após terminar o
  que estava fazendo. Salve os valores como eles realmente são.
</p>

<h2>
  Usando chardet para detectar a codificação de caracteres
</h2>

<p>
  Na grande maioria das vezes que nosso sistema gerar algum problema de
  codificação de caracteres, esse problema virá de
  algum recurso externo. Portanto, para simular isso, suponha que eu
  tenha um arquivo em
  <strong>ISO-8859-1</strong> (latin1). Qualquer editor de textos
  decente vai te permitir criar o mesmo texto com a mesma
  codificação de caracteres. Por exemplo, o
  <a href="https://code.visualstudio.com/">Visual Studio Code</a>.
</p>

![Exemplo de codificação no VS Code](./imgs/python-1.png)

<p>
  Nós sabemos qual a codificação de caracteres foi
  usada neste arquivo (latin1), mas finja que não. Vamos carregar
  esse arquivo pelo Python usando “<code>rb</code>” (read
  bytes) e solicitar ao
  <a href="https://pypi.org/project/chardet/">chardet</a> para detectar
  a codificação de caracteres.
</p>

<p>
  <strong>Nota:</strong> você precisa instalar o chardet com
  “<code>pip install chardet</code>“.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CBA6F7"> import</span><span style="color:#CDD6F4"> chardet</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CBA6F7"> with</span><span style="color:#FAB387;font-style:italic"> open</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'text.txt'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'rb'</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> as</span><span style="color:#CDD6F4"> file</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">...     raw_content </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> file</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">read</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#CDD6F4">...     encoding </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> chardet</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">detect</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">raw_content</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">...     </span><span style="color:#EBA0AC;font-style:italic">encoding</span><span style="color:#9399B2">[</span><span style="color:#A6E3A1">"</span><span style="color:#A6E3A1;font-style:italic">encoding</span><span style="color:#A6E3A1">"</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#CDD6F4">...</span></span>
<span class="line"><span style="color:#A6E3A1">'ISO-8859-9'</span></span></code></pre>

<p>
  Ele detectou como ‘ISO-8859-9’, isso seria
  <strong>latin5</strong> e não <strong>latin1</strong>, mas
  lembra que te falei que ele não iria acertar 100% das vezes,
  certo? Bom, vamos tentar converter esse arquivo de ISO-8859-9 (mesmo
  não sendo a codificação exata do arquivo) para
  UTF-8 e ver o que ocorre.
</p>

<p>
  Vamos abrir o arquivo novamente, decodificar com a
  codificação que o <strong>chardet</strong> quiser (no
  caso ISO-8859-9, latin5), depois vamos abrir um novo arquivo com
  <code>'wb'</code> e salvar como UTF-8. Veja:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CBA6F7"> with</span><span style="color:#FAB387;font-style:italic"> open</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'text.txt'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'rb'</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> as</span><span style="color:#CDD6F4"> file</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">...     </span><span style="color:#9399B2;font-style:italic"># Vamos ler apenas bytes do arquivo</span></span>
<span class="line"><span style="color:#CDD6F4">...     raw_content </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> file</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">read</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#CDD6F4">...     </span><span style="color:#9399B2;font-style:italic"># Agora a gente decodifica</span></span>
<span class="line"><span style="color:#CDD6F4">...     content_string </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> raw_content</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">decode</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">encoding</span><span style="color:#9399B2">[</span><span style="color:#A6E3A1">"</span><span style="color:#A6E3A1;font-style:italic">encoding</span><span style="color:#A6E3A1">"</span><span style="color:#9399B2">])</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># Perfeito, agora vamos tentar pegar o conteúdo</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># da content_string e salvar em outro arquivo</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># porém, agora vamos codificar em UTF-8</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span><span style="color:#CBA6F7"> with</span><span style="color:#FAB387;font-style:italic"> open</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'text2.txt'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'wb'</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> as</span><span style="color:#CDD6F4"> file</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">...     file</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">write</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">content_string</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">encode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'utf8'</span><span style="color:#9399B2">))</span></span>
<span class="line"><span style="color:#CDD6F4">...</span></span>
<span class="line"><span style="color:#FAB387">192</span></span>
<span class="line"><span style="color:#94E2D5">&gt;&gt;&gt;</span></span></code></pre>

<p>
  Perfeito, sem erros! Agora vamos ver como está o nosso arquivo
  “<strong>text2.txt</strong>” (o novo arquivo gerado).
  Será que os caracteres se mantiveram?
</p>

![UTF-8](./imgs/python-2.png)

<p>
  Perfeito! Viu como a aproximação que o
  <strong>chardet</strong> encontrou me ajudou muito? Mesmo que ele
  não tenha detectado com 100% de certeza qual a
  codificação de caracteres usada no arquivo, ele me
  passou uma que provavelmente iria funcionar.
</p>

<p>
  Se você fosse tentar decodificar direto com UTF-8, isso
  ocorreria:
</p>

<p>
  <code>UnicodeDecodeError: 'utf-8' codec can't decode byte
    0xe7 in position 4: invalid continuation byte</code>
</p>

<p>E se ignorasse os erros, seu texto ficaria assim:</p>

<p>
  <code>Ateno Exceo Impresso Concesso Presuno</code><br>
  <code>Voc Pur Croch Metr</code><br>
  <code>Plstico Grfico Espcie Clebre</code><br>
  <code>quelas s</code><br>
  <code>Acar ACAR CABEA CAROO'</code>
</p>

<p>Eu acho que deu pra você entender, não é?</p>

<h2>
  Funções interessantes com normalização
  unicode
</h2>

<p>
  Você, como programador(a), já pode ter imaginado milhares
  de coisas interessantes que pode fazer com a
  normalização unicode, não é mesmo? Se
  não, vou te dar algumas ideias:
</p>

<h3>Obtendo code points Unicode</h3>

<p>
  Suponha que eu queira obter uma lista com todos os code points de uma
  frase. Veja que legal:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> unicodedata </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> normalize</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> get_unicode_code_points</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">string</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]:</span></span>
<span class="line"><span style="color:#CDD6F4">    string_normalized </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> normalize</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'NFD'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> string</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    code_points</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">]</span><span style="color:#94E2D5"> =</span><span style="color:#9399B2"> [</span></span>
<span class="line"><span style="color:#A6E3A1">        'U+'</span><span style="color:#94E2D5"> +</span><span style="color:#FAB387;font-style:italic"> hex</span><span style="color:#9399B2">(</span><span style="color:#FAB387;font-style:italic">ord</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">letter</span><span style="color:#9399B2">))[</span><span style="color:#FAB387">2</span><span style="color:#9399B2">:].</span><span style="color:#89B4FA">zfill</span><span style="color:#9399B2">(</span><span style="color:#FAB387">4</span><span style="color:#9399B2">).</span><span style="color:#89B4FA">upper</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#CBA6F7">        for</span><span style="color:#CDD6F4"> letter </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> string_normalized</span></span>
<span class="line"><span style="color:#9399B2">    ]</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#CDD6F4"> code_points</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    text </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Python 🐍™'</span></span>
<span class="line"><span style="color:#CDD6F4">    code_points </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA"> get_unicode_code_points</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">text</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">code_points</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6E3A1">    """</span></span>
<span class="line"><span style="color:#A6E3A1">    ['U+0050', 'U+0079', 'U+0074', 'U+0068',</span></span>
<span class="line"><span style="color:#A6E3A1">    'U+006F', 'U+006E', 'U+0020', 'U+1F40D',</span></span>
<span class="line"><span style="color:#A6E3A1">    'U+2122']</span></span>
<span class="line"><span style="color:#A6E3A1">    """</span></span></code></pre>

<h3>Obtendo caracteres de code points</h3>

<p>
  Mas, e o inverso? Dado um code point, como converto em caractere?
  Você já viu isso ao longo do texto todo, mas aqui vai.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">from</span><span style="color:#CDD6F4"> typing </span><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> List</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> get_char_from_code_point</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">code_points</span><span style="color:#9399B2">:</span><span style="color:#EBA0AC;font-style:italic"> List</span><span style="color:#9399B2">[</span><span style="color:#CBA6F7;font-style:italic">str</span><span style="color:#9399B2">])</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    chars </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> [</span><span style="color:#FAB387;font-style:italic">chr</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7;font-style:italic">int</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">c</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">replace</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'U+'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> '0x'</span><span style="color:#9399B2">),</span><span style="color:#FAB387"> 16</span><span style="color:#9399B2">))</span><span style="color:#CBA6F7"> for</span><span style="color:#CDD6F4"> c </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> code_points</span><span style="color:#9399B2">]</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#A6E3A1"> ''</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">join</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">chars</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    code_points </span><span style="color:#94E2D5">=</span><span style="color:#9399B2"> [</span></span>
<span class="line"><span style="color:#A6E3A1">        'U+0050'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0079'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0074'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0068'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#A6E3A1">        'U+006F'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+006E'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+0020'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'U+1F40D'</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#A6E3A1">        'U+2122'</span></span>
<span class="line"><span style="color:#9399B2">    ]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#89B4FA">get_char_from_code_point</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">code_points</span><span style="color:#9399B2">))</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic">    # Python 🐍™</span></span></code></pre>

<h3>Removendo caracteres fora da tabela ASCII</h3>

<p>
  Em alguns casos, pode ser interessante manter apenas caracteres
  compatíveis com a tabela “ASCII”. Além
  disso, nós também podemos converter caracteres que
  seriam compatíveis se não fossem pré-compostos.
  Por exemplo, ‘<strong>á</strong>‘,
  ‘<strong>ã</strong>‘,
  <strong>à</strong> e <strong>â</strong> se tornariam
  simplesmente ‘<strong>a</strong>‘ e assim por diante para
  todos os caracteres. Porém, caracteres como 🐍 e 😀 não
  estariam presentes, porque não existem na tabela ASCII e
  também não existem compatíveis.
</p>

<p>Vamos ver como faríamos isso:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> unicodedata</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> non_ascii_to_ascii</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">string</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    ascii_only </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> unicodedata</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">normalize</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'NFKD'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> string</span><span style="color:#9399B2">)\</span></span>
<span class="line"><span style="color:#9399B2">        .</span><span style="color:#89B4FA">encode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'ascii'</span><span style="color:#9399B2">,</span><span style="color:#A6E3A1"> 'ignore'</span><span style="color:#9399B2">)\</span></span>
<span class="line"><span style="color:#9399B2">        .</span><span style="color:#89B4FA">decode</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'ascii'</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#CDD6F4"> ascii_only</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    string </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Atenção 🐍 😀'</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#89B4FA">non_ascii_to_ascii</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">string</span><span style="color:#9399B2">))</span><span style="color:#9399B2;font-style:italic">  # Atencao</span></span></code></pre>

<p>
  Perceba que caracteres como “<strong>ç</strong>” e
  “<strong>ã</strong>” de
  “<strong>Atenção</strong>” foram mantidos
  sem acento (porque existem na tabela ASCII), porém 🐍 e 😀
  foram ignorados.
</p>

<h3>Removendo acentos das palavras</h3>

<p>
  Na função anterior, a gente meio que removeu os acentos,
  porém também removemos outras coisas que não
  queríamos. Mas, suponha que eu queira remover apenas o
  <strong>combining character</strong> mantendo o restante (o combining
  character seria o acento propriamente dito).
</p>

<p>Isso me retornaria palavras sem acento.</p>

<p>
  Eu posso fazer isso, como o
  <a href="https://twitter.com/ramalhoorg?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor">Luciano Ramalho</a>
  descreve em seu livro
  <a href="https://amzn.to/34HdIPs">Python Fluente</a>.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> unicodedata</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> remove_accents</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">string</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    normalized </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> unicodedata</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">normalize</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'NFKD'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> string</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#A6E3A1"> ''</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">join</span><span style="color:#9399B2">([</span><span style="color:#CDD6F4">c </span><span style="color:#CBA6F7">for</span><span style="color:#CDD6F4"> c </span><span style="color:#CBA6F7">in</span><span style="color:#CDD6F4"> normalized </span><span style="color:#CBA6F7">if</span><span style="color:#CBA6F7"> not</span><span style="color:#CDD6F4"> unicodedata</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">combining</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">c</span><span style="color:#9399B2">)])</span></span></code></pre>

<p>
  Porém, eu também posso fazer isso com expressões regulares. O que
  funcionar melhor pra você:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> unicodedata</span></span>
<span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> re</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> remove_accents_regex</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">string</span><span style="color:#9399B2">:</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> -&gt;</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    regex </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> re</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">compile</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1;font-style:italic">r</span><span style="color:#F5C2E7">'</span><span style="color:#9399B2">[</span><span style="color:#A6E3A1">\u0300-\u036F</span><span style="color:#9399B2">]</span><span style="color:#F5C2E7">'</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> flags</span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4">re</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">DOTALL</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    normalized </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> unicodedata</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">normalize</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">'NFKD'</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> string</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#CDD6F4"> regex</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">sub</span><span style="color:#9399B2">(</span><span style="color:#A6E3A1">''</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> normalized</span><span style="color:#9399B2">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">    string </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> 'Atenção 🐍 😀'</span></span>
<span class="line"><span style="color:#FAB387;font-style:italic">    print</span><span style="color:#9399B2">(</span><span style="color:#89B4FA">remove_accents_regex</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">string</span><span style="color:#9399B2">))</span><span style="color:#9399B2;font-style:italic">  # Atencao 🐍 😀</span></span></code></pre>

<p>
  Por falar nisso, eu tenho um detalhe sobre expressões regulares
  pra te informar: eu tenho um curso inteiro e gratuito na
  <a href="https://www.udemy.com/course/expressoes-regulares-com-python-3-curso-gratuito/">Udemy</a>
  e no
  <a href="https://www.youtube.com/watch?v=wBI0yv2FG6U&amp;list=PLbIBj8vQhvm1VnTa2Np5vDzCxVtyaYLMr">Youtube</a>
  sobre isso.
</p>

<p>
  Portanto, não há motivos para entrarmos em detalhes
  sobre
  <a href="https://pt.wikipedia.org/wiki/Express%C3%A3o_regular">regex</a>
  aqui.
</p>

<h2>Mais sobre Unicode e Normalização Unicode</h2>

<p>
  Eu sei que esse assunto talvez passe despercebido para vários
  desenvolvedores e desenvolvedoras mundo a fora e não é
  culpa deles (ou nossa, também passei por isso). Em nosso meio,
  a maioria dos cursos, faculdades e livros que você lê para
  aprender a programar, infelizmente não tratam desse assunto,
  ou, se tratam, é de maneira superficial. Porém, como
  você pôde ver, eu fiz questão de deixar todos os
  links de onde removi todas as informações que escrevi
  aqui. Assim, é extremamente necessário que você
  leia esses links também.
</p>

<p>
  Além disso, ainda faltaram algumas coisas que não
  consegui falar neste post. Por exemplo, casefold e tratamento de
  arquivos, foram coisas que não mencionei aqui, mas que
  são mencionadas no
  <a href="https://docs.python.org/3/howto/unicode.html">Unicode HOWTO oficial do Python</a>. Então, dá um jeito de ler esse artigo também.
</p>

<p>
  Então é isso, te deixo aqui com um pouco mais de
  serviço pela frente.
</p>

<p>Te espero no próximo post.</p>
