<h1 id="logging-no-python-pare-de-usar-print-no-lugar-errado">
  <a href="#logging-no-python-pare-de-usar-print-no-lugar-errado">
    `logging` no Python: Pare de usar `print` no lugar errado
  </a>
</h1>

> **Publicado em** 05 de julho de 2025 | **Por**
> [Luiz Otávio Miranda](https://www.otaviomiranda.com.br/)

O `logging` é o módulo oficial do Python para lidar com logs de forma
estruturada, profissional e extensível. Além disso, ele serve como uma
alternativa muito mais poderosa ao velho e conhecido `print()` para debug rápido
durante o desenvolvimento.

Enquanto o `print()` é ótimo pra exibir algo na tela, o `logging` te dá controle
total sobre o evento que vai ser registrado, **como** vai ser formatado e **pra
onde** essa informação vai (terminal, arquivo, socket, banco, etc). São funções
diferentes entre `print` e `logging`, mas esse comparativo sempre aparece quando
falamos de `logging`.

Ele também trabalha com níveis de severidade (`DEBUG`, `INFO`, `WARNING`,
`ERROR`, `CRITICAL`), suporta múltiplos formatos, múltiplos destinos (handlers),
hierarquia de loggers e configuração via código ou arquivos externos.

Em outras palavras: ele foi feito pra `log` em aplicações reais. São registros
de eventos categorizados para aplicações de gente grande, que sabe o que está
fazendo e sabe que vai precisar debugar e refatorar o código em algum momento.

O melhor é que já vem com o Python. Sem dependência. Sem gambiarra.

---

<h2 id="links-uteis-para-este-artigo">
  <a href="#links-uteis-para-este-artigo">
      Links úteis para este artigo
  </a>
</h2>

Se você caiu nesse artigo de paraquedas, ele é apenas parte de um conteúdo BEM
MAIOR. Temos todo esse texto em vídeo no Youtube e também um repositório com
todo o código, segue:

- [Logging no Python - Curso completo](https://www.youtube.com/playlist?list=PLbIBj8vQhvm28qR-yvWP3JELGelWxsxaI)
- [Repositório do curso](https://github.com/luizomf/logging_course_yt)

Então vamos continuar...

---

<h2 id="como-o-logging-funciona-por-dentro">
  <a href="#como-o-logging-funciona-por-dentro">
    Como o `logging` funciona por dentro
  </a>
</h2>

O sistema de logging do Python é organizado como uma estrutura hierárquica (em
forma de árvore), onde cada _logger_ é um objeto único identificado por um nome
textual (por exemplo: `meuapp`, `meuapp.api`, etc). Essa hierarquia é definida
simplesmente pelo nome, usando pontos (`.`) para indicar níveis diferentes.

Exemplo de loggers:

- `app`
- `app.database`
- `app.http`
- `app.http.requests`

Visualmente, a estrutura ficaria assim:

```text
root
└── app
    ├── database
    └── http
        └── requests
```

Essa hierarquia permite algo muito poderoso: a **propagação** dos logs. Por
padrão, quando um logger emite um log, essa mensagem sobe na hierarquia até
chegar ao logger pai e, eventualmente, ao logger raiz (`root`).

Na prática, isso significa que você pode configurar todos os handlers (por
exemplo: imprimir no terminal, gravar em arquivos, enviar logs para serviços
externos) diretamente no logger raiz. Assim, todos os loggers filhos
automaticamente reutilizam esses handlers, sem precisar configurá-los
individualmente toda vez.

Só tem um detalhe importante aqui: algumas bibliotecas também usam loggers
internamente, seguindo essa mesma hierarquia de nomes. Por isso, os logs
emitidos por essas libs podem acabar sendo capturados pelos seus handlers
globais também—desde que o nível configurado permita isso, é claro.

> **Nota:** Se seu app não for grande e cheio de partes independentes, não
> precisa complicar criando múltiplos loggers e uma hierarquia extensa. Na
> maioria dos casos, um único logger já resolve tudo.

Nos exemplos a seguir, vamos ver tudo isso funcionando claramente na prática.

---

<h2 id="conceitos-principais-loggers-handlers-formatters-e-filters">
  <a href="#conceitos-principais-loggers-handlers-formatters-e-filters">
    Conceitos principais: Loggers, Handlers, Formatters e Filters
  </a>
</h2>

O `logging` é formado por 4 blocos principais:

- **Logger:** é quem dispara a mensagem (ex: `logger.info("oi")`).
- **Handler:** define **pra onde** a mensagem vai (terminal, arquivo, e-mail
  etc).
- **Formatter:** define **como** a mensagem vai aparecer (formato da string).
- **Filter (opcional):** permite **filtrar** o que será logado.

Esses blocos funcionam como peças de LEGO: você encaixa e combina como quiser.

Pode ter um logger que salva tudo em um arquivo `.json`, outro que só mostra
`ERROR` no terminal com cor, outro que manda `INFO` pro Telegram (por que não?).

Tudo isso é configurável via código ou por arquivos `.ini`, `.yaml`, `.json`,
como preferir.

---

<h2 id="niveis-de-severidade-level">
  <a href="#niveis-de-severidade-level">
    Níveis de severidade: `level`
  </a>
</h2>

O nível de severidade (`level`) aparece em dois momentos distintos:

1. Na configuração do logger e/ou handler.
2. Na emissão do log.

A primeira define o que será aceito ou descartado. A segunda define qual a
severidade de um log específico.

```python
# 1. Configuração: esse logger aceita logs de WARNING pra cima
logger.setLevel(logging.WARNING)

# ...

# 2. Emissão: esse log será emitido com nível DEBUG
logger.debug("sou um debug")
```

---

<h3 id="como-o-level-funciona">
  <a href="#como-o-level-funciona">
    Como o `level` funciona
  </a>
</h3>

Tanto loggers quanto handlers possuem um `level`. Esse valor determina se uma
mensagem será processada ou descartada, com base em sua severidade.

Os níveis disponíveis são:

- `NOTSET` ou `0` – sem configuração explícita.
- `DEBUG` ou `10` – detalhes técnicos para depuração (tipo `print()`).
- `INFO` ou `20` – informações gerais da execução.
- `WARNING` ou `30` – algo inesperado aconteceu, mas foi contornado.
- `ERROR` ou `40` – erro durante a execução.
- `CRITICAL` ou `50` – erro grave. A aplicação pode parar ou já parou.

Você pode usar os nomes (`DEBUG`, `INFO`...) ou os números diretamente.

> O valor numérico importa porque a regra é: **um log só será processado se o
> `level` desse log for maior ou igual ao `level` do logger e do handler.**

---

**Exemplo prático usando `level`**

```python
logger.setLevel(logging.ERROR)

logger.debug("DEBUG")     # ignorado
logger.warning("WARNING") # ignorado
logger.error("ERROR")     # processado
logger.critical("CRITICAL") # processado
```

---

<h3 id="emissao-de-um-log-em-um-level-especifico">
  <a href="#emissao-de-um-log-em-um-level-especifico">
    Emissão de um log em um `level` específico
  </a>
</h3>

Para emitir um log, usamos os métodos do logger que correspondem ao nível de
severidade desejado:

- `logger.debug(...)`
- `logger.info(...)`
- `logger.warning(...)`
- `logger.error(...)`
- `logger.critical(...)`

Exemplo:

```python
# Isso emite um log com nível WARNING (30)
logger.warning("mensagem do meu log")
```

Neste caso, estamos emitindo uma mensagem com nível 30 (`WARNING`). Ela será
avaliada pelo logger e por cada handler configurado, e só será processada se
passar pelos filtros de `level`.

---

<h2 id="basicconfig-iniciando-com-logging-no-codigo">
  <a href="#basicconfig-iniciando-com-logging-no-codigo">
    `basicConfig`: iniciando com `logging` no código
  </a>
</h2>

`basicConfig` é uma função do módulo `logging`, feita para configurar o `root`
logger de forma simples e rápida. Geralmente, ela será usada em scripts menores
para facilitar a configuração rápida do `logging`.

Dependendo de quais argumentos forem usados, ela pode configurar handlers
diferentes no `root logger`.

---

<h3 id="streamhandler-saida-para-stderr-ou-stdout">
  <a href="#streamhandler-saida-para-stderr-ou-stdout">
    `StreamHandler`: saída para `stderr` ou `stdout`
  </a>
</h3>

Se você não enviar o argumento `filename` para `basicConfig`, o handler padrão
usado será um `StreamHandler`.

O termo _stream_ se refere a objetos semelhantes a arquivos, ou seja, objetos
que possuem métodos como `.write()` e `.flush()`. Tanto `sys.stdout` quanto
`sys.stderr` são exemplos desses objetos.

Por padrão, o `StreamHandler` escreve no `stderr`. Já o `print()` padrão do
Python escreve no `stdout`. Ou seja: ambos "printam", mas vão pra fluxos
diferentes.

> **Nota:** É possível trocar o stream da classe `StreamHandler`, passando um
> argumento como `sys.stdout`, mas isso foge do nosso foco aqui.

---

**Código: `basicConfig` + `StreamHandler`**

Primeiro, importamos o módulo `logging` e definimos o formato de cada linha de
log:

```python
import logging

# Formato do log - veja todos os atributos disponíveis em:
# https://docs.python.org/3/library/logging.html#logrecord-attributes
simple_format = "%(levelname)s|%(name)s|%(asctime)s|%(message)s|%(filename)s|%(lineno)d"

# Isso configura o root logger conforme explico a seguir.
logging.basicConfig(format=simple_format)
```

O trecho acima faz o seguinte:

- Cria um `StreamHandler` que envia os logs para o `stderr`;
- Aplica um `Formatter` com o formato definido;
- Adiciona esse handler ao _root logger_;
- Define o nível do _root logger_ como `WARNING` (padrão do Python, caso não
  seja especificado).

Com isso, o _root logger_ já está pronto pra uso. Basta fazer:

```python
# Logando com o root (não vamos usar isso, só exemplo)
logging.warning("Oi!")
```

> **Nota:** O `basicConfig` aceita vários outros argumentos, como `level`,
> `filename`, `filemode`, `handlers`, `stream` e mais. Se você quiser, pode
> definir o nível diretamente, por exemplo: `level=logging.DEBUG`.

---

**`getLogger()` cria ou acessa nosso próprio logger**

Com o _root logger_ configurado, a gente pode usar a função `getLogger()` para
criar (ou acessar) nossos próprios loggers. Essa função tem três comportamentos
distintos, dependendo do argumento:

- `logging.getLogger()`: sem argumento, retorna o _root logger_.
- `logging.getLogger("meuapp")`: com um nome, cria um novo logger se ainda não
  existir.
- `logging.getLogger("meuapp")`: nas próximas chamadas com o mesmo nome, retorna
  o mesmo logger criado anteriormente (singleton por nome).

Depois de criado, você pode definir o **nível de severidade** que esse logger
vai aceitar:

```python
logger = logging.getLogger("meuapp")
logger.setLevel(logging.DEBUG)
```

Feito isso, já pode começar a mandar logs e ver tudo aparecendo no terminal:

```python
# Exibe logs com StreamHandler via stderr
# debug info warning error critical
logger.debug("mensagem de log")
logger.info("mensagem de log")
logger.warning("mensagem de log")
logger.error("mensagem de log")
logger.critical("mensagem de log")

# Exception
try:
    print(1 / 0)
except ZeroDivisionError:
    logger.exception("dividiu por zero aí")
```

Saída esperada:

```
DEBUG|meuapp|2025-06-29 17:36:09,226|mensagem de log|main.py|24
INFO|meuapp|2025-06-29 17:36:09,226|mensagem de log|main.py|25
WARNING|meuapp|2025-06-29 17:36:09,226|mensagem de log|main.py|26
ERROR|meuapp|2025-06-29 17:36:09,226|mensagem de log|main.py|27
CRITICAL|meuapp|2025-06-29 17:36:09,226|mensagem de log|main.py|28
ERROR|meuapp|2025-06-29 17:36:09,226|dividiu por zero aí|main.py|34
Traceback (most recent call last):
  File "main.py", line 32, in <module>
    print(1 / 0)
          ~~^~~
ZeroDivisionError: division by zero
```

---

**Código completo para `basicConfig` e `StreamHandler`**

O código completo ficou assim:

```python
import logging

# Formato para o Formatter
# Veja os atributos disponíveis em:
# https://docs.python.org/3/library/logging.html#logrecord-attributes
simple_format = "%(levelname)s|%(name)s|%(asctime)s|%(message)s|%(filename)s|%(lineno)d"
logging.basicConfig(format=simple_format)

# cria o meu logger "meuapp"
logger = logging.getLogger("meuapp")
logger.setLevel(logging.DEBUG)

logger.debug("mensagem de log")
logger.info("mensagem de log")
logger.warning("mensagem de log")
logger.error("mensagem de log")
logger.critical("mensagem de log")

try:
    print(1 / 0)
except ZeroDivisionError:
    logger.exception("Alguém tentou dividir por zero aí.")
```

---

<h3 id="filehandler-saida-para-um-arquivo">
  <a href="#filehandler-saida-para-um-arquivo">
    `FileHandler`: saída para um arquivo
  </a>
</h3>

`basicConfig` também é capaz de escrever logs em arquivos mudando levemente os
argumentos. Precisamos passar o caminho do arquivo de log e o modo de abertura
desejado para esse arquivo.

> **Nota:** Se você mudar a pasta onde o arquivo deverá ser salvo, essa pasta
> precisa existir, do contrário terá um erro.

Peguei só o trecho que precisa de modificação no código anterior:

```python
import logging

format1 = "%(levelname)s|%(name)s|%(asctime)s|%(message)s|%(filename)s|%(lineno)d"

# Migrar para arquivo: basta informar o caminho, modo de abertura e encoding.
logging.basicConfig(
    level=logging.DEBUG,
    format=format1,
    filename="log.log",
    filemode="a",
    encoding="utf-8",
)

# Meu logger -> meuapp (root -> meuapp)
logger = logging.getLogger("meuapp")

# Agora você não verá mais saída no console
logger.debug("Isso deve aparecer no arquivo log.log")

# Arquivo log.log
# DEBUG|meuapp|2025-07-05 10:12:30,311|Isso deve aparecer no arquivo log.log|lesson01.py|20
```

Ao fazer essa configuração, em vez de usar o `StreamHandler` que vimos
anteriormente, agora ele usa o `FileHandler`. Para esse handler, precisamos do
caminho do arquivo (`filename`), do modo de abertura (`filemode`) e do
`encoding`.

Um ponto importante aqui é que você **não verá mais nada no terminal**, porque o
nosso handler agora envia apenas para o arquivo, e não para `stderr` ou
`stdout`. Para ver ambos, precisamos de mais de um handler.

O `filemode` pode ser qualquer um dos modos de escrita, por exemplo:

- `a` - escreve no final do arquivo (não apaga logs antigos, apenas adiciona)
- `w` - escreve no começo do arquivo (apaga tudo que estava lá)

<h3 id="basicconfig-filehandler-e-streamhandler">
  <a href="#basicconfig-filehandler-e-streamhandler">
    `basicConfig`, `FileHandler` e `StreamHandler`
  </a>
</h3>

Que tal a gente combinar tudo isso e adicionar dois handlers de uma vez? Bora
ver como usar `FileHandler` e `StreamHandler` junto com a função `basicConfig`.

Vou mandar o código completo pra ficar mais fácil de entender.

No exemplo abaixo, a gente cria os dois handlers manualmente e adiciona eles no
logger `root` via `basicConfig`. O resto continua o padrão de sempre.

A propagação (`propagate = True`) já fica ativa por padrão. Isso quer dizer que,
quando chamamos algo no nosso logger (que não tem handler nenhum), o log é
**propagado** para o logger acima dele, no caso, o `root`.

Como o `root` agora tem dois handlers, **os dois são executados** quando o nível
de severidade bate. O resultado? Log no terminal **e** no arquivo ao mesmo
tempo.

Você poderia ter quantos handlers e formatters quisesse, todos pendurados no
`root`.

```python
import logging

format1 = "%(levelname)s|%(name)s|%(asctime)s|%(message)s|%(filename)s|%(lineno)d"

# Podemos criar nossos próprios handlers usando as classes que mencionei antes
file_handler = logging.FileHandler(
    filename="log.log",
    mode="a",
    encoding="utf-8",
)
stream_handler = logging.StreamHandler()

# Nossos handlers precisam de um formatter
main_formatter = logging.Formatter(fmt=format1)
file_handler.setFormatter(main_formatter)
stream_handler.setFormatter(main_formatter)

# configura o root logger
logging.basicConfig(handlers=[file_handler, stream_handler])

# cria o meu logger
logger = logging.getLogger("meuapp")
# define o nível do meu log
logger.setLevel(logging.DEBUG)

# Exibe logs com StreamHandler via stderr
logger.debug("mensagem de log")
logger.info("mensagem de log")
logger.warning("mensagem de log")
logger.error("mensagem de log")
logger.critical("mensagem de log")

# Exception
try:
    print(1 / 0)
except ZeroDivisionError:
    logger.exception("Alguém tentou dividir por zero aí.")
```

A saída do código acima fica como mostro abaixo tanto no console quando no
terminal.

```text
DEBUG|meuapp|2025-07-05 10:12:30,311|Isso deve aparecer no arquivo log.log|lesson01.py|20
DEBUG|meuapp|2025-07-05 10:16:21,917|mensagem de log|lesson01.py|27
INFO|meuapp|2025-07-05 10:16:21,917|mensagem de log|lesson01.py|28
WARNING|meuapp|2025-07-05 10:16:21,917|mensagem de log|lesson01.py|29
ERROR|meuapp|2025-07-05 10:16:21,917|mensagem de log|lesson01.py|30
CRITICAL|meuapp|2025-07-05 10:16:21,917|mensagem de log|lesson01.py|31
ERROR|meuapp|2025-07-05 10:16:21,917|Alguém tentou dividir por zero aí.|lesson01.py|37
Traceback (most recent call last):
  File "/Users/luizotavio/Desktop/tutoriais_e_cursos/learn_logging/src/learn_logging/lesson01.py", line 35, in <module>
    print(1 / 0)
          ~~^~~
ZeroDivisionError: division by zero
```

---

<h3 id="hierarquia-de-loggers-e-handlers">
  <a href="#hierarquia-de-loggers-e-handlers">
    Hierarquia de Loggers e Handlers
  </a>
</h3>

Para unir a teoria à prática que exploramos, e para evitar as armadilhas mais
comuns, vamos entender com precisão o que acontece no sistema de `logging` do
Python:

**Pontos Fundamentais para Lembrar:**

1. **`basicConfig()`**: É a função de conveniência que configura o `root` logger
   (o "pai" de todos). Por padrão, ele adiciona um `StreamHandler` (para o
   console), um `Formatter` básico e define o `level` do `root` para `WARNING`.
   Em sistemas menores, é tranquilo usar, mas em sistemas maiores usaremos
   `dictConfig` que falaremos adiante.

2. **`getLogger('nome')`**: Cria (ou obtém) um `Logger` nomeado, que é filho do
   `root` logger (ou de outro logger se o nome tiver pontos, como `app.modulo`).

3. **`setLevel()`**: Usado para definir o nível mínimo de mensagens que um
   `Logger` ou um `Handler` irá processar.

4. **Métodos de Log**: `debug()`, `info()`, `warning()`, `error()` e
   `critical()` são os métodos que você usa em um `Logger` para emitir mensagens
   com um nível de gravidade específico.

---

**A Grande Sacada: A Propagação e a Filtragem**

Esta é a parte crucial e onde a maioria dos materiais simplifica demais. Preste
muita atenção aqui!

1. **Múltiplos Handlers:** Um `Logger` pode ter um ou vários `Handlers` anexados
   a ele.

2. **Handlers e Formatters:** Cada `Handler` é responsável por direcionar o log
   para um destino (console, arquivo, etc.) e sempre usará um único `Formatter`
   para definir como a mensagem será exibida. Ele também pode ter `Filters` (que
   veremos depois) para um controle ainda mais fino.

3. **Níveis Duplos:** Tanto o `Logger` (o coletor de logs) quanto o `Handler` (o
   publicador de logs) possuem seu próprio `level`. Esta é a fonte de possíveis
   problemas e pode te deixar debugando o próprio `logging` por horas.

---

**A Propagação: O Caminho Real do Log (e o Papel dos Handlers)**

Quando um log é emitido por um `Logger` nomeado, ele percorre uma jornada pela
hierarquia. Esse "caminho" pode ser confuso, porque não é apenas o `Logger` que
está filtrando, os `Handlers` também entram no jogo.

Imagine a hierarquia de loggers assim:

```text
root           [root_handler_1, root_handler_2]
└── A          [A_handler_1]
    └── A.B    [B_handler_1, B_handler_2, B_handler_3]
```

Vamos supor que o `level` de `A.B` foi configurado como `INFO` (20) e que
emitimos:

```python
A.B.warning("Mensagem de Exemplo")
```

**No `Logger` `A.B` (o emissor do log)**

A primeira filtragem acontece aqui. O log tem `level` `WARNING` (30), e o logger
`A.B` aceita logs com `INFO` (20) ou superior. Então a verificação é simples:

```text
level do log >= level do logger → ok
```

Se passar aqui, segue adiante. Se **não** passar, o log morre aqui, **não chega
em nenhum handler**.

**Nos Handlers de `A.B`**

Agora o log chega nos `Handlers` do logger `A.B`, no exemplo: `B_handler_1`,
`B_handler_2` e `B_handler_3`.

Cada handler faz **sua própria checagem de level**. Se o log for aceito, é
publicado por aquele handler. Se não, é ignorado por ele (mas ainda pode ser
aceito pelos outros handlers ou loggers superiores).

**No Logger `A` (pai de `A.B`)**

Se a propriedade `propagate` estiver `True` (valor padrão), o log **sobe na
hierarquia** e chega ao logger `A`.

Mas aqui vem a **pegadinha**: o `level` do logger `A` **não importa mais**. Ele
**não é checado**. A partir daqui, só os `handlers` dos loggers pais é que
decidem o que fazer.

**Nos Handlers de `A`**

Cada handler de `A` (ex: `A_handler_1`) faz a mesma checagem de sempre:
`level do log >= level do handler`. Se passar, o log é publicado.

**No Logger `root` (e seus handlers)**

Mais do mesmo: o log chega no logger `root`, ignora o `level` dele, e é
analisado apenas pelos handlers `root_handler_1` e `root_handler_2`.

---

Essa explicação é importante porque muita gente pensa que os loggers pais têm o
poder de **interromper** ou **descartar** um log que subiu pela propagação. Mas
não têm. O único logger com poder de barrar a mensagem é **o que emitiu o log**.

Se fosse pra resumir num post-it:

> O log é verificado **no logger que o emitiu**. Se passar, é entregue aos seus
> `handlers` e, com `propagate = True`, sobe para os loggers pais. Mas a partir
> daí, **apenas os `handlers` desses loggers superiores** fazem checagem. Os
> loggers pais **não barram** mais nada.
>
> Se o logger emissor não aceitar o log, **acabou o jogo ali**. Nada é
> publicado.

---
