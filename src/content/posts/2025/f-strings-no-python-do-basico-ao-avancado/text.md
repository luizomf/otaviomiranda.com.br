---
title: 'f-strings em Python: coisas que você não sabia'
description:
  'Uso avançado de f-strings para formatação de strings em Python, cobrindo
  conceitos como concatenação, formatação numérica e representação em diferentes
  bases numéricas.'
date: 2025-11-10
author: 'Luiz Otávio Miranda'
---

Este texto explora o uso avançado das f-strings no Python, incluindo
concatenação, formatação numérica, representação em diferentes bases e várias
outras técnicas que talvez você não conheça.

Eu me baseei na transcrição do meu vídeo original, que você pode assistir aqui:

- [f-strings em Python: coisas que você não sabia](https://youtu.be/yt2wPLGMAA0)

Mas atenção: o texto não é idêntico ao vídeo. Incluí novos exemplos de código,
explicações alternativas e detalhei melhor alguns tópicos que achei
interessantes. Espero que você goste!

**Dica importante:** coloquei MUITA coisa bacana nos comentários dos exemplos de
código, não deixe de conferir.

> ℹ️ Baseado [no meu vídeo original](https://youtu.be/yt2wPLGMAA0), este texto
> foi gerado inicialmente com o apoio de Inteligência Artificial e da
> transcrição do vídeo feita pelo [Whisper](https://youtu.be/y15070biffg).
> Posteriormente, reescrevi o conteúdo para garantir clareza e precisão.

---

## Introdução: concatenando strings com inteiros

Um desafio comum na programação é concatenar strings com outros tipos de dados,
como inteiros. Em Python, se você tentar concatenar diretamente uma string com
um inteiro, terá um erro de tipo:

```python
numero = 123456789
texto = "Número: "

# Isso gera um erro: TypeError: can only concatenate str (not "int") to str
print(texto + numero)
```

Para resolver isso, você pode converter explicitamente o inteiro para string
usando a função `str()`:

```python
numero = 123456789
texto = "Número: "

# Convertendo o inteiro para string antes da concatenação
print(texto + str(numero))
# Saída: Número: 123456789
```

Mas as **f-strings** oferecem uma solução muito mais elegante, legível e
eficiente para essa tarefa. Vamos conferir na prática como utilizar esse recurso
poderoso do Python!

---

## Introdução às `f-strings`

As `f-strings` (formatação de string com prefixo `f`) oferecem uma sintaxe
concisa e poderosa para incorporar expressões Python diretamente dentro de uma
string (`str`). Para utilizá-las, basta prefixar a string com `f` e envolver a
expressão desejada entre chaves `{}`.

Exemplo básico:

```python
numero = 123456789
texto = f"Número: {numero}"
print(texto) # Saída: Número: 123456789
```

Esse método funciona com strings de uma ou várias linhas, com aspas simples,
duplas ou triplas.

---

## Formatação numérica com f-strings

As `f-strings` facilitam muito a formatação numérica, permitindo aplicar
separadores de milhares e definir facilmente quantas casas decimais você quer
exibir.

---

### Separadores de milhares

Você pode utilizar **underscores (`_`)** ou **vírgulas (`,`)** após os dois
pontos (`:`) dentro das chaves para destacar os milhares. Veja os exemplos:

```python
numero = 123456789

# Usando underscore como separador de milhares
print(f"Número com underscores: {numero:_}")  # Saída: 123_456_789

# Usando vírgula como separador de milhares
print(f"Número com vírgulas: {numero:,}")     # Saída: 123,456,789
```

Esses formatos deixam os números grandes bem mais fáceis de ler!

---

### Definindo casas decimais com `.nf`

Para formatar números com ponto flutuante usando `f-strings`, basta utilizar
`.nf`, onde `n` é a quantidade desejada de casas decimais após o ponto.

Veja os exemplos:

```python
numero_float = 198.7654321

# Limitando a duas casas decimais
print(f"Duas casas decimais: {numero_float:.2f}")  # Saída: 198.77

# Arredondando para inteiro (sem casas decimais)
print(f"Sem casas decimais: {numero_float:.0f}")   # Saída: 199

# Limitando a quatro casas decimais
print(f"Quatro casas decimais: {numero_float:.4f}")  # Saída: 198.7654
```

Com isso você consegue controlar exatamente como seu número será exibido.

---

### Combinando separador de milhares e casas decimais

Você também pode combinar os separadores de milhares com a definição de casas
decimais, tudo numa única f-string. Veja o exemplo:

```python
numero_float = 19876.54321

# Separador de milhares com vírgula e duas casas decimais
print(f"Formatado: {numero_float:,.2f}")  # Saída: 19,876.54
```

Essa abordagem é especialmente útil em dashboards, relatórios financeiros e
interfaces voltadas ao usuário, tornando os valores numéricos bem mais legíveis.

---

### Exibindo sinais (positivo e negativo)

É possível exibir explicitamente os sinais positivos ou negativos em números
usando o símbolo `+`. Veja o exemplo:

```python
numero_positivo = 10
numero_negativo = -10

# Exibindo explicitamente o sinal positivo
print(f"Número positivo: {numero_positivo:+d}")  # Saída: +10

# Número negativo já exibe o sinal por padrão
print(f"Número negativo: {numero_negativo:d}")   # Saída: -10
```

> **Observação:** O sinal `+` força a exibição do sinal também em números
> positivos. Para negativos, o sinal aparece automaticamente.

---

### Porcentagem

Para representar números como porcentagem, utilize o especificador `%` junto com
a quantidade desejada de casas decimais:

```python
porcentagem = 0.98

# Exibindo porcentagem com duas casas decimais
print(f"Porcentagem: {porcentagem:.2%}")  # Saída: 98.00%
```

---

### Conversões avançadas: `bytes`, `int`, `str` e `hex`

É possível realizar conversões entre diferentes tipos, como string, inteiro,
hexadecimal, octal, binário, ASCII, bytes e outros formatos usando funções
internas (built-ins) do Python. Quando combinamos essas funções com as
`f-strings`, temos um poder imenso nas mãos.

Além disso, usando `!r` dentro das f-strings, você exibe diretamente a
representação interna do objeto (o mesmo que usar `repr()`).

**Importante:** Ao usar f-strings, os objetos são automaticamente convertidos
para strings (`str`). Strings têm métodos especiais como `encode` para converter
em bytes, e bytes têm o método `decode` para voltar para string. Você pode
conferir mais detalhes sobre esse assunto no artigo:

- [Normalização Unicode em Python](https://otaviomiranda.com.br/2020/normalizacao-unicode-em-python/)

Agora, veja na prática como converter um inteiro em hexadecimal, depois em
bytes, em string novamente, e finalmente voltar ao inteiro original. Este
exemplo combina várias técnicas que você pode usar em Python:

```python
# Número inteiro original
num = 255  # inteiro normal: 255

# Convertendo inteiro para hexadecimal (str)
int_to_hex = f'{num:x}'  # resultado: 'ff'

# Convertendo o hexadecimal (str) em bytes
hex_to_bytes = int_to_hex.encode('utf-8')  # resultado: b'ff'

# Convertendo bytes de volta para string
bytes_to_str = hex_to_bytes.decode('utf-8')  # resultado: 'ff'

# Finalmente, convertendo a string hexadecimal de volta para inteiro
hex_to_int = int(bytes_to_str, 16)  # resultado: 255

# Exibindo representações internas usando !r (repr)
print(f"{num = !r}")           # num = 255
print(f"{int_to_hex = !r}")    # int_to_hex = 'ff'
print(f"{hex_to_bytes = !r}")  # hex_to_bytes = b'ff'
print(f"{bytes_to_str = !r}")  # bytes_to_str = 'ff'
print(f"{hex_to_int = !r}")    # hex_to_int = 255

# Exemplos adicionais com :o, :b, :x e :X
print(f"Inteiro: {num = }")          # Inteiro: num = 255
print(f"Octal: {num = :o}")          # Octal: num = 377
print(f"Binário: {num = :b}")        # Binário: num = 11111111
print(f"Hexadecimal: {num = :x}")    # Hexadecimal: num = ff
print(f"HEXADECIMAL: {num = :X}")    # HEXADECIMAL: num = FF
```

Entendendo as formatações usadas:

- `:o` exibe o valor em octal.
- `:b` exibe o valor em binário.
- `:x` exibe o valor em hexadecimal (letras minúsculas).
- `:X` exibe o valor em hexadecimal (letras maiúsculas).
- `!r` exibe a representação do objeto (equivalente ao `repr()`).
- `=` exibe também a expressão que gerou o valor dentro da f-string
  (`num = valor_de_num`).

É bastante coisa nova, né? A seguir eu explico tudo isso com mais detalhes!

---

## O Operador Walrus (`:=`) em f-strings

O operador Walrus (`:=`) permite atribuir valores diretamente dentro de
expressões, inclusive dentro de f-strings.

Com ele, você faz uma atribuição inline e já reutiliza o valor calculado
imediatamente, sem precisar declarar a variável previamente.

Veja o exemplo abaixo: temos uma sequência de bytes que representa a palavra
"Otávio" codificada em UTF-8. Primeiro, decodificamos essa sequência para uma
string. Depois, usando o operador Walrus dentro da f-string, atribuímos esse
valor a uma variável mais curta (`v`), que pode ser reutilizada em seguida.

```python
# Sequência de bytes que representa a palavra "Otávio"
my_name = b'\x4f\x74\xc3\xa1\x76\x69\x6f'

# Decodificando bytes para uma variável com nome longo
variavel_longa_e_chata = my_name.decode('utf-8')  # resultado: "Otávio"

# Usando operador Walrus diretamente dentro da f-string para atribuir a `v`
print(f"Saída: {(v := variavel_longa_e_chata) = }")
# Saída: (v := variavel_longa_e_chata) = 'Otávio'

# Agora `v` já está disponível para reutilização
print(f"Reutilizando `v`: {v} foi muito legal. {v}")
# Saída: Reutilizando `v`: Otávio foi muito legal. Otávio
```

O trecho `{(v := variavel_longa_e_chata) = }` dentro da f-string exibe tanto o
código executado quanto o valor atribuído. Isso é especialmente útil em debug,
logs ou simplesmente para mostrar valores intermediários sem precisar criar
variáveis separadas antes do print.

> **Nota:** A sequência de bytes `\x4f\x74\xc3\xa1\x76\x69\x6f`, decodificada
> com UTF-8, forma a palavra "Otávio".

---

## Trabalhando com datas e horas usando `f-strings`

A seguir vou mostrar diversos exemplos práticos sobre formatação de datas,
horas, minutos, segundos, milissegundos e microsegundos usando f-strings. Esses
formatos são úteis em praticamente qualquer aplicação que envolva manipulação de
datas e horários.

---

### Transformando segundos em horas, minutos e segundos (`H:M:S`)

Nesse exemplo, você vai aprender como formatar uma quantidade total de segundos
no formato tradicional `horas:minutos:segundos` (`H:M:S`).

Primeiro, vamos criar uma função simples para fazer essa conversão pra gente:

```python
def calcula_segundos_para_horas(segundos: int) -> tuple[int, int, int]:
    """
    Converte uma quantidade total de segundos em horas, minutos e segundos.

    Exemplo de uso:
        h, min, seg = calcula_segundos_para_horas(31989)
    """
    horas = segundos // 60 // 60
    minutos = segundos // 60 % 60
    segundos = segundos % 60

    return horas, minutos, segundos
```

Agora, vamos brincar com as **f-strings** pra exibir o tempo formatado:

```python
# 8 horas, 53 minutos, 9 segundos
# Total desejado: 08:53:09
total_de_segundos = 31989
horas, minutos, segundos = calcula_segundos_para_horas(total_de_segundos)

# Sem formatação (resultado incorreto visualmente)
print(f"Tempo: {horas}:{minutos}:{segundos}")
# Saída: Tempo: 8:53:9

# Com formatação (padding com zeros à esquerda)
print(f"Tempo: {horas:02}:{minutos:02}:{segundos:02}")
# Saída correta: Tempo: 08:53:09
```

Também é possível exibir essa mesma informação de forma mais descritiva:

```python
# Exibindo de forma mais amigável
print(f"{horas} horas, {minutos} minutos e {segundos} segundos")
# Saída: 8 horas, 53 minutos e 9 segundos
```

Você até pode inserir uma condicional diretamente dentro da f-string, embora, na
minha opinião, fique meio feio e bagunçado dependendo da complexidade. Porém, às
vezes pode ser útil:

```python
# Retirando os 9 segundos para zerar o valor
total_de_segundos = 31980
horas, minutos, segundos = calcula_segundos_para_horas(total_de_segundos)

# Criando uma string condicional para exibir segundos somente se forem maiores que zero
texto_segundos = f", {segundos} segundos"
print(f"{horas} horas, {minutos} minutos{texto_segundos if segundos > 0 else ''}")
# Saída: 8 horas, 53 minutos
```

Para situações mais complexas, o ideal seria criar uma função de formatação
separada, principalmente para evitar coisas estranhas como "1 segundos", que
fica bem feio, né?

Se suas contas eventualmente retornarem números em ponto flutuante (`float`),
você pode formatar assim, garantindo que não haverá casas decimais:

```python
print(f"Tempo: {horas:02.0f}:{minutos:02.0f}:{segundos:02.0f}")
```

Explicando rapidamente o significado de `:02.0f`:

- `:` inicia a formatação;
- `02` indica que o número deve ter dois caracteres no total, preenchidos com
  zeros à esquerda se necessário (`1` vira `01`);
- `.0f` significa que não desejamos nenhuma casa decimal (nem mesmo o ponto).

---

### Manipulação de horas usando `f-string`, `datetime` e `timedelta`

Vamos criar uma data base apenas para facilitar a formatação de horas. Neste
momento não precisamos de uma data real, então vou usar algo bem simples:
`datetime(1, 1, 1, 8, 23, 1)`. Isso representa o horário `08:23:01`.

```python
from datetime import datetime

# Criando a hora base
hora = datetime(1, 1, 1, 8, 23, 1)

# Formatando com strftime()
print(f"Hora: {hora.strftime('%H:%M:%S')}")
# Saída: Hora: 08:23:01
```

**Dica:** Os valores `%H`, `%M` e `%S` representam, respectivamente, horas,
minutos e segundos com zero à esquerda. Veja todas as opções disponíveis na
[documentação do Python](https://docs.python.org/3/library/datetime.html#format-codes).

Você também pode usar `timedelta` para adicionar ou subtrair tempo facilmente.
Vamos ver isso em ação:

```python
from datetime import datetime, timedelta

# Hora inicial: 00:00:00
hora_inicial = datetime(1, 1, 1, 0, 0, 0)

# Adicionando 10 horas, 7 minutos e 10 segundos
tempo_adicional = timedelta(hours=10, minutes=7, seconds=10)
nova_hora = hora_inicial + tempo_adicional

# Formatando com strftime()
print(f"Nova hora: {nova_hora.strftime('%H:%M:%S')}")
# Saída: Nova hora: 10:07:10

# Adicionando mais 10 segundos
nova_hora += timedelta(seconds=10)

# Formatando diretamente com f-string (sem strftime explícito)
print(f"Nova hora: {nova_hora:%H:%M:%S}")
# Saída: Nova hora: 10:07:20
```

---

### Microssegundos e milissegundos usando `f-string`

Como faço muitos vídeos diariamente, preciso lidar bastante com pequenas frações
de segundos pra sincronizar legendas e transcrições. O formato típico usado nas
legendas SRT (SubRip) é assim: `00:00:00,000`, onde `000` são milissegundos.

A lógica é parecida com a que expliquei anteriormente. Veja na prática:

```python
from datetime import datetime

# Criando um tempo base: 00:02:23
tempo_do_video = datetime(1, 1, 1, 0, 2, 23)

# Exibindo o tempo sem microsegundos
print(f"{tempo_do_video:%H:%M:%S}")
# Saída: 00:02:23
```

Agora vamos adicionar microssegundos e milissegundos usando `timedelta`:

```python
from datetime import datetime, timedelta

# Tempo base novamente: 00:02:23
tempo_do_video = datetime(1, 1, 1, 0, 2, 23)

# Adicionando 111 microssegundos (devem aparecer nas últimas três casas)
tempo_do_video += timedelta(microseconds=111)
print(f"{tempo_do_video:%H:%M:%S,%f}")
# Saída: 00:02:23,000111

# Resetando ao valor inicial
tempo_do_video = datetime(1, 1, 1, 0, 2, 23)

# Agora adicionando 111 milissegundos (primeiras três casas após a vírgula)
tempo_do_video += timedelta(milliseconds=111)
print(f"{tempo_do_video:%H:%M:%S,%f}")
# Saída: 00:02:23,111000

# Exibindo apenas milissegundos, removendo os três últimos dígitos com fatiamento
print(f"{tempo_do_video:%H:%M:%S,%f}"[:-3])
# Saída: 00:02:23,111
```

O que acontece nesse trecho `[:-3]` é o seguinte: estou removendo as últimas 3
posições da string resultante, o que chamamos de
[fatiamento de strings (slicing)](https://youtu.be/QxjArQ9xZDg?si=MOxtznr0cdQQw5a1).
Isso é bastante útil quando precisamos adaptar rapidamente o formato das
strings.

---

### Manipulação de datas usando `f-string`, `datetime` e `timedelta`

Só pra reforçar, a formatação de datas completas usando f-strings é exatamente
igual ao que vimos com horas. Veja alguns exemplos práticos:

```python
import locale
from datetime import datetime

# Configurando o locale para o padrão brasileiro (datas, números, etc.)
locale.setlocale(locale.LC_ALL, 'pt_BR')

# Exemplo de data: 02/12/1987 às 10:59:23
nascimento_joaozinho = datetime(1987, 12, 2, 10, 59, 23)

# Formatando a data completa com f-string
print(f"{nascimento_joaozinho:%d de %B de %Y às %H:%M:%S}")
# Saída: 02 de Dezembro de 1987 às 10:59:23

# Outro exemplo mais detalhado
print(
    f"Joãozinho nasceu no ano de {nascimento_joaozinho:%y}. "
    f"Estávamos no mês de {nascimento_joaozinho:%B}, "
    f"dia {nascimento_joaozinho:%d}. "
    f"Era um dia chuvoso, e o relógio marcava "
    f"{nascimento_joaozinho:%H horas e %M minutos}."
)
# Saída:
# Joãozinho nasceu no ano de 87.
# Estávamos no mês de Dezembro, dia 02.
# Era um dia chuvoso, e o relógio marcava 10 horas e 59 minutos.
```

Ok, talvez eu tenha exagerado nesse último exemplo... 😅 Mas acho que você sacou
a ideia e provavelmente é isso que você vai usar no dia a dia.

---

## Representação de objetos com f-strings: `!r`, `!s`, `!a`

Dentro das f-strings você pode exibir a representação de um objeto usando os
sufixos `!s`, `!r` ou `!a`. Cada um chama respectivamente as funções internas do
Python: `str()`, `repr()` e `ascii()` sobre o valor exibido.

Para entender melhor, vamos criar uma classe simples e ver esses métodos em
ação:

```python
class Pessoa:
    def __init__(self, nome: str, sobrenome: str, idade: int) -> None:
        self.nome = nome
        self.sobrenome = sobrenome
        self.idade = idade

    def __repr__(self) -> str:
        cls_name = self.__class__.__name__
        attrs = ", ".join(
            f"{chave}={valor!r}" for chave, valor in self.__dict__.items()
        )
        return f"{cls_name}({attrs})"

    def __str__(self) -> str:
        return f"{self.nome} {self.sobrenome}"
```

### Usando `!s` — chama o método `__str__`

```python
pessoa = Pessoa("Luiz Otávio", "Miranda", 30)

print(f"{pessoa}")    # Saída: Luiz Otávio Miranda
print(f"{pessoa!s}")  # Mesma saída acima; !s chama explicitamente str()
```

Aqui o Python usa o método `__str__`, gerando uma versão amigável e legível para
humanos.

### Usando `!r` — chama o método `__repr__`

```python
print(f"{pessoa!r}")
# Saída: Pessoa(nome='Luiz Otávio', sobrenome='Miranda', idade=30)
```

Agora o Python usa o método `__repr__`, que gera uma string detalhada e
idealmente útil para recriar o objeto.

### Usando `!a` — chama o método `ascii()`

O método `ascii()` funciona como `repr()`, porém escapa caracteres não-ASCII,
substituindo-os por sequências especiais (`\x`, `\u` ou `\U`):

```python
print(f"{pessoa!a}")
# Saída: Pessoa(nome='Luiz Ot\xe1vio', sobrenome='Miranda', idade=30)
```

Note que o caractere “á” (fora do padrão ASCII básico) foi convertido para
`\xe1`.

---

### Explorando escapes: de `á` para `\xe1` e de volta

```python
valor = "á"

print("\xe1")        # '\x' + e1 → á
print("\u00e1")      # '\u' + 00e1 → á
print("\U000000e1")  # '\U' + 000000e1 → á

# De caractere para hexadecimal:
valor_hex = hex(ord(valor))   # '0xe1'

# De hexadecimal para caractere:
print(chr(int(valor_hex, 16)))  # á
```

Os primeiros 128 códigos Unicode coincidem com os 128 caracteres ASCII
originais. Como “á” fica no ponto de código 225, ele está fora desse intervalo —
por isso é escapado.

Para mergulhar mais fundo nesse assunto, confira o artigo
[normalização Unicode em Python](https://otaviomiranda.com.br/2020/normalizacao-unicode-em-python/).

---

## Padding e Alinhamento de Strings e Números com f-strings

F-strings oferecem controle preciso sobre o preenchimento (padding) e o
alinhamento do texto dentro de um espaço definido. Isso é feito utilizando
especificadores de formatação dentro das chaves `{}`, após os dois pontos `:`.

A sintaxe geral de formatação é `:{fill}{align}{width}`, onde:

- `fill` (opcional): O caractere a ser usado para preencher o espaço. Se
  omitido, o padrão é espaço (` `).
- `align` (opcional): O tipo de alinhamento.
  - `<`: Alinha o texto à esquerda (padrão para strings).
  - `>`: Alinha o texto à direita (padrão para números).
  - `^`: Centraliza o texto.
- `width`: A largura total mínima do campo. O texto será preenchido até atingir
  essa largura.

Vamos ver alguns exemplos práticos de como aplicar esses especificadores:

```python
nome = "Python" # Alterado para "Python" para um exemplo mais genérico

# --- Alinhamento com Espaços (padding padrão) ---
print(f"'{nome:<15}'") # Aspas para visualizar o padding
# Alinhamento à esquerda (padrão para strings), preenchido com espaços até 15 caracteres.
# Saída: 'Python         '

print(f"'{nome:>15}'")
# Alinhamento à direita, preenchido com espaços até 15 caracteres.
# Saída: '         Python'

print(f"'{nome:^15}'")
# Alinhamento ao centro, preenchido com espaços até 15 caracteres.
# Saída: '    Python     '

# Para números, o preenchimento com '0' à esquerda é comum
numero_item = 7
print(f"{numero_item:03}")
# Preenchimento com '0' à esquerda até 3 caracteres (útil para numeração).
# Saída: 007

# Você pode usar qualquer caractere para preencher. O caractere de
# preenchimento vem ANTES do alinhamento.
produto_id = "ABC"
print(f"ID: {produto_id:x<10}")
# Preenche com 'x' e alinha à esquerda
# Saída: ID: ABCxxxxxxx

preco = 123.45
print(f"Preço: {preco:*>12.2f}")
# Preenche com '*' e alinha à direita, 2 casas decimais
# Saída: Preço: ******123.45

# Numeração de arquivos com zeros à esquerda (ex: 000001.mp4)
for i in range(3):
    print(f"{i:06}.mp4")
# Saída:
# 000000.mp4
# 000001.mp4
# 000002.mp4

# Alinhamento e preenchimento combinado para um formato específico
valor = 1048576
print(f"Resultado: {valor:!<20}")
# Preenchimento com '!' à esquerda, alinhamento à esquerda, largura total de 20.
# Saída: Resultado: 1048576!!!!!!!!!!!!!
```

---

## Inserindo expressões e sinal de igual (`=`) em f-strings

As f-strings permitem inserir diretamente expressões Python no texto e, melhor
ainda, exibir automaticamente a expressão seguida do seu resultado usando o
sinal de igual (`=`).

Por exemplo, ao invés de fazer algo assim para debug:

```python
print(f"variavel = {variavel}")
```

você pode simplificar para:

```python
print(f"{variavel = }")
```

O resultado será exatamente o mesmo, exibindo tanto a expressão quanto o valor
atribuído. Veja vários exemplos abaixo (não esqueça de ler os comentários!):

```python
x = 3.55
y = 7.12

# Forma tradicional, sem o sinal de igual automático:
print(f"{x} + {y} = {x + y}")  # Saída: 3.55 + 7.12 = 10.67

# Forma simplificada usando "=" dentro das chaves (ideal para debug)
print(f"{x = }, {y = }, {x + y = }")
# Saída: x = 3.55, y = 7.12, x + y = 10.67

# Usando expressões com literais diretamente:
print(f"5 * 2 = {5 * 2}")  # Saída: 5 * 2 = 10

# Exibindo o valor de uma variável diretamente:
firstName = "Luiz Otávio"
print(f"{firstName}")      # Saída: Luiz Otávio

# Exibindo com o sinal de igual:
print(f"{firstName = }")   # Saída: firstName = 'Luiz Otávio'
```

---

### Conclusão

Nesse artigo, exploramos várias formas poderosas de usar as f-strings em Python.
Começamos com concatenação básica, passamos pela formatação numérica avançada
(controle de casas decimais, separadores de milhares), manipulamos datas e
horas, representamos objetos, e terminamos mostrando a avaliação direta de
expressões com o prático sinal de igual (`=`).

Dominar f-strings é fundamental pra você, que busca escrever código Python mais
limpo, direto e eficiente, especialmente na hora de manipular textos e dados.

Se você chegou até aqui, espero de verdade que tenha aprendido coisas novas.
Mesmo eu trabalhando há anos com Python e programação, ainda aprendo muita coisa
enquanto escrevo esses textos e gravo meus vídeos.

Até o próximo artigo! ✌️

---
