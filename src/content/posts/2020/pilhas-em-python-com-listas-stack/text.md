---
title: 'Pilhas em Python com listas (stack)'
description:
  'Pilhas em Python são comumente criadas usando listas, porque estamos
  interessados em manipular apenas a extremidade do topo da estrutura (o final
  da lista).'
date: 2018-09-03
author: 'Luiz Otávio Miranda'
---

Pilhas em Python são comumente criadas usando
[listas](https://docs.python.org/pt-br/3.8/tutorial/datastructures.html), porque
estamos interessados em manipular apenas a extremidade do topo da estrutura (o
final da lista). Isso nos garante
[complexidade de tempo O(1)](https://wiki.python.org/moin/TimeComplexity) (tempo
constante) com métodos `append` e `pop`.

Uma pilha é uma coleção de itens que segue o princípio **LIFO** (**L**ast **I**n
**F**irst **O**ut) , ou seja, o último item a entrar, será o primeiro a sair. A
adição e remoção de novos itens ocorre sempre na mesma ponta da pilha, o final
da lista. O final da lista (último índice), representa o topo da pilha, o começo
da lista (índice 0) representa a base da pilha.

Itens mais novos são sempre adicionados no topo da pilha e se tornam mais
antigos a medida que adicionamos outros itens. Quanto maior o índice na lista,
mais novo é o item e mais cedo ele será removido da pilha.

Pilhas são estruturas de dados muito simples, mas podem ser usadas para
representar várias coisas no mundo real, por exemplo: uma pilha de pratos, uma
pilha de livros ou qualquer coisa que você coloque uma sobre a outra formando
uma pilha. Além disso, programas também usam pilhas, como a
[pilha de chamadas](https://www.otaviomiranda.com.br/2020/funcoes-recursivas-com-python/#Call_stack)
para funções que já vimos anteriormente nesse blog.

## Listas são pilhas muito genéricas em Python

Como pilhas só precisam de métodos para adicionar e remover itens do seu topo,
as listas do Python já fazem esse trabalho com excelência e complexidade de
tempo O(1), ou tempo constante. Então, é super rápido.

Porém, ou você só usa esses dois métodos (`append` e `pop`), ou você cria sua
própria estrutura de dados chamada de `Stack` (uma classe que você verá ao final
desse post) para outros desenvolvedores não usarem sua pilha de maneira genérica
(como filas, por exemplo).

Se você quiser trabalhar diretamente com as listas, pode fazer o seguinte:

```python
# Para Type annotation
from typing import List

# Pilha de livros com type annotation
stack_of_books: List[str] = []  # {1}

# Adicionando livros no topo da pilha
stack_of_books.append('Livro 1')  # {2}
stack_of_books.append('Livro 2')  # {2}
stack_of_books.append('Livro 3')  # {2}

# Obtendo o elemento mais novo
book = stack_of_books.pop()  # {3}

print(book)  # Livro 3 {4}
```

Perceba que no código acima, criei uma pilha de livros (`stack_of_books`) como
uma lista vazia {1}. Quando precisei adicionar livros na pilha, usei o método
`append`, que é padrão de listas em Python para adicionar itens ao final da
lista {2}. Além disso, quando precisei obter o livro mais novo (do topo da
pilha), usei o método `pop`, que também é padrão de listas em Python para obter
o último item da lista (ou o elemento do topo da pilha) {3}.

Na verdade, o método `pop` faz duas coisas. Além de remover o item do topo da
pilha, ele também retorna este valor. Então, Isso me permitiu fazer duas coisas
em {3}: remover o item do topo da pilha e coletar seu valor em uma variável.

Por fim {4}, imprimimos o valor de book, que foi o “Livro 3”.

### Cuidados com pop

Note que, a cada execução do método `pop`, o item mais novo será removido da
pilha. Em algum momento, sua pilha poderá estar vazia e esse método levantará a
exceção “`IndexError: pop from empty list`“, ou “_Erro de índice: pop de uma
lista vazia_” (em tradução livre).

```python
# Para Type annotation
from typing import List

# Pilha de livros com type annotation
stack_of_books: List[str] = []  # {1}

# Adicionando livros no topo da pilha
stack_of_books.append('Livro 1')  # {2}
stack_of_books.append('Livro 2')  # {2}
stack_of_books.append('Livro 3')  # {2}

# Obtendo o elemento mais novo
book_1 = stack_of_books.pop()  # Livro 3 {3}
book_2 = stack_of_books.pop()  # Livro 2 {3}
book_3 = stack_of_books.pop()  # Livro 1 {3}

# IndexError: pop from empty list
book = stack_of_books.pop()  # Não há mais livros {4}
```

Isso ocorre porque não há mais valores para serem removidos e recuperados da sua
pilha {4}.

Para prevenir esse tipo de situação, podemos envolver nosso código em um bloco
`try` e `except`, tratando a exceção “`IndexError`“. Veja:

```python
# Para Type annotation
from typing import List

# Pilha de livros com type annotation
stack_of_books: List[str] = []  # {1}

# Adicionando livros no topo da pilha
stack_of_books.append('Livro 1')  # {2}
stack_of_books.append('Livro 2')  # {2}
stack_of_books.append('Livro 3')  # {2}

try:
    # Obtendo o elemento mais novo
    book_1 = stack_of_books.pop()  # Livro 3 {3}
    print(book_1)  # Livro 3

    book_2 = stack_of_books.pop()  # Livro 2 {3}
    print(book_2)  # Livro 2

    book_3 = stack_of_books.pop()  # Livro 1 {3}
    print(book_3)  # Livro 1

    # IndexError: pop from empty list
    book = stack_of_books.pop()  # Não há mais livros {4}
    print(book)  # Seu código não chegará aqui
except IndexError:
    print('Trate o erro como preferir aqui.')
```

Assim, a partir do momento que a exceção ocorrer {4}, seu código pulará
imediatamente para o bloco except. Se não houver exceções, seu código não
executará o bloco except.

### Não use listas como filas

Além das pilhas, outra estrutura de dados muito usada em programação são as
filas (falamos sobre elas em outro artigo). Basicamente, filas trabalham no lado
oposto das pilhas. Então, se nas pilhas você trabalha na extremidade final
(adicionando e removendo itens do topo), nas filas você trabalha nas duas
extremidades, enfileirando itens no final (topo) e desenfileirando itens do
início (base).

As listas podem ser usadas para filas também, porém, não é recomendável. Isso
torna sua complexidade de tempo O(n), ou tempo linear, o que torna as listas
mais lentas para isso.

O método pop, pode receber o índice que você pretende remover da pilha, por
exemplo (mas não faça isso):

```python
# Para Type annotation
from typing import List

# Pilha de livros com type annotation
stack_of_books: List[str] = []  # {1}

# Adicionando livros no topo da pilha
stack_of_books.append('Livro 1')  # {2}
stack_of_books.append('Livro 2')  # {2}
stack_of_books.append('Livro 3')  # {2}

book_1 = stack_of_books.pop(0)  # {3} Livro 1

print(book_1)  # Livro 1
```

Perceba que, no código acima, eu consigo passar um índice para `pop` descrevendo
qual livro quero remover da pilha {3}. Assim, isso me permite remover o item da
base da minha pilha (índice 0). Mas, o problema ao fazer algo assim, é que como
as listas não foram otimizadas para tal, todos os outros itens da lista agora
precisam ter seus índices alterados. O que tinha índice 1, passa a ter índice 0,
o que tinha índice 2, passa a ter índice 1 e assim por diante.

A complexidade de tempo O(n) significa que, na pior das hipóteses, quando eu
removo um item da base da minha pilha (como nas filas), todos os outros items
agora precisam ser modificados, e eu assumo que não era essa a sua intenção.

Nós já falamos sobre filas aqui, mas para resumir, use
[collections.deque](https://docs.python.org/pt-br/3.8/library/collections.html#collections.deque)
para filas e listas para pilhas.

## Iterando pilhas

Em Python a iteração dos iteráveis é feita com `for`. Se você não quer remover
nenhum elemento, mas apenas iterar sobre toda a pilha, faça o seguinte:

```python
# Para Type annotation
from typing import List

# Pilha de livros com type annotation
stack_of_books: List[str] = []  # {1}

# Adicionando livros no topo da pilha
stack_of_books.append('Livro 1')  # {2}
stack_of_books.append('Livro 2')  # {2}
stack_of_books.append('Livro 3')  # {2}

# Laço for
for book in stack_of_books[::-1]:
    # Faça o que preferir com o Livro
    print(book)

"""
Saída:
Livro 3
Livro 2
Livro 1
"""
```

Perceba que no código acima, na linha 13, temos um laço for que vai iterar em
todos os elementos da lista. Então eu posso fazer o que preferir com a variável
`book`.

**Detalhe importante:** para manter a ordem da pilha (do topo para a base), eu
preciso fazer uma iteração em ordem reversa na pilha quando uso `for`. Por isso
adicionei `[::-1]` em `stack_of_books`. Isso inverte a ordem de listas em
Python.

Um outro tipo de iteração sobre pilha, seria removendo os elementos da pilha ao
mesmo tempo que itero sobre eles. Podemos fazer isso com o laço `while`:

```python
# Para Type annotation
from typing import List

# Pilha de livros com type annotation
stack_of_books: List[str] = []  # {1}

# Adicionando livros no topo da pilha
stack_of_books.append('Livro 1')  # {2}
stack_of_books.append('Livro 2')  # {2}
stack_of_books.append('Livro 3')  # {2}

# Laço while
while stack_of_books:
    book = stack_of_books.pop()
    print(book)

"""
Saída:
Livro 3
Livro 2
Livro 1
"""
```

Perceba que usando o laço `while` com o método `pop`, a ordem é mantida. Porém,
é importante saber que estou removendo cada um dos elementos da minha pilha.

## Copiando pilhas

Trabalhar com dados mutáveis, como as listas, pode ser perigoso em qualquer
linguagem de programação porque manipulamos o dado diretamente. Então, é uma boa
ideia manter uma cópia do dado original sempre que o manipulamos (se for
possível, é claro). Por outro lado, pode ser caro manter cópia de dados que são
muito grandes, então você precisa ponderar as duas coisas: segurança e peso.

Manter a cópia de uma lista, pode ter uma complexidade de tempo linear O(n) se
você fizer uma cópia rasa (shallow copy) ou mais do que isso se você mantiver
uma cópia profunda (deep copy).

### Shallow copy:

Esse tipo de cópia é um clone superficial dos itens da pilha. Ela tem
complexidade de tempo linear – O(n) – o que significa que é necessário passar
por todos os itens para realizar a cópia destes. A parte interessante desse tipo
de cópia é que dados imutáveis (como str, int, float e bool) serão realmente
copiados para uma nova pilha. Porém, dados mutáveis (como outras listas,
dicionários e sets) não serão copiados, a nova pilha terá apenas uma referência
para os dados mutáveis da pilha original.

Para realizar uma cópia do tipo shallow copy da sua pilha, faça o seguinte:

```python
# Para Type annotation
from typing import List

# Pilha de livros com type annotation
stack_of_books: List[str] = []  # {1}

# Adicionando livros no topo da pilha
stack_of_books.append('Livro 1')  # {2}
stack_of_books.append('Livro 2')  # {2}
stack_of_books.append('Livro 3')  # {2}

# A cópia (shallow copy)
stack_of_books_copy = stack_of_books.copy()

# Agora não estou mais alterando os dados
# da pilha original.
while stack_of_books_copy:
    print(stack_of_books_copy.pop())

# A original continua intacta
print(stack_of_books)  # ['Livro 1', 'Livro 2', 'Livro 3']
```

### Deep copy

Quando falamos em pilhas que contém dados mutáveis, como por exemplo, outras
listas dentro da nossa pilha. É preciso tomar cuidado com a shallow copy, porque
ela não vai copiar esses elementos, vai fazer apenas uma referência apontando
para os dados da lista original. Isso significa que meus dados ainda continuarão
mutáveis internamente, mesmo na cópia.

A complexidade de tempo de uma deep copy vai depender da profundidade dos itens
mutáveis da sua pilha, quanto maior a profundidade, maior a complexidade (mais
tempo leva).

Imagine essa estrutura de dados:

```python
# Para Type annotation
from typing import List

# Pilha de listas
stack_of_lists: List[List[str]] = []

# Adicionando elementos
stack_of_lists.append(['A', 'B'])
stack_of_lists.append(['C', 'D'])
stack_of_lists.append(['E', 'F'])
```

Esse é um tipo de estrutura que devo tomar cuidado, porque existem listas dentro
da minha pilha.

Veja o problema:

```python
# Para Type annotation
from typing import List

# Pilha de listas
stack_of_lists: List[List[str]] = []

# Adicionando elementos
stack_of_lists.append(['A', 'B'])
stack_of_lists.append(['C', 'D'])
stack_of_lists.append(['E', 'F'])

# Shallow copy
stack_of_lists_clone = stack_of_lists.copy()

# Obtendo o elemento do topo da pilha
# Isso não altera a lista original
item = stack_of_lists_clone.pop()

# Mas isso sim
item[0] = 'ALTERANDO O DADO'

# Veja o resultado na lista original
print(stack_of_lists)

"""
Saída:
[['A', 'B'], ['C', 'D'], ['ALTERANDO O DADO', 'F']]
"""
```

Os comentários do código acima, explicam o que ocorre em cada trecho. Mas, aqui
vai uma breve explicação:

- Linha 13 – Faço uma shallow copy da minha pilha. Como te descrevi
  anteriormente, dados mutáveis NÃO são copiados de dentro da pilha original,
  eles passados apenas como referência. Isso significa que a lista cópia terá
  uma referência desses dados (você consegue acessá-los por ela) mas eles ainda
  são os dados da lista original e não uma cópia real;
- Linha 17 – Obtém o item do topo da lista (esse ainda é o dado da lista
  original);
- Linha 20 – Altero o item. Porém, como esse item é uma referência ao item da
  lista original, quem será alterado efetivamente será o item da lista original;
- Linha 23 – Percebo a besteira que fiz.

Para solucionar esse tipo de coisa, usamos a deep copy, que é um tipo de cópia
recursiva. Com isso, todos os dados, mutáveis e imutáveis serão copiados para a
lista cópia.

Veja:

```python
# Para Type annotation
from typing import List

# Preciso importar deepcopy
from copy import deepcopy

# Pilha de listas
stack_of_lists: List[List[str]] = []

# Adicionando elementos
stack_of_lists.append(['A', 'B'])
stack_of_lists.append(['C', 'D'])
stack_of_lists.append(['E', 'F'])

# Deep copy
stack_of_lists_clone = deepcopy(stack_of_lists)

# Obtendo o elemento do topo da pilha
# Isso não altera a lista original
item = stack_of_lists_clone.pop()

# Mas isso sim
item[0] = 'ALTERANDO O DADO'

# Veja o resultado na lista original
print(stack_of_lists)

"""
Saída:
[['A', 'B'], ['C', 'D'], ['E', 'F']]
"""
```

Veja que as únicas coisas alteradas foram na linha 5, porque eu preciso importar
“deepcopy” do módulo “copy”. E a linha 16, porque ao invés de “shallow copy”,
agora estou fazendo uma “deep copy”.

## Classe Stack

A maneira mais segura e correta de se trabalhar com listas como pilhas em
Python, é proteger o código para que os métodos genéricos das listas não possam
ser chamados diretamente. Assim protegeremos o nosso código para que outros
desenvolvedores não possam chamar um `pop(0)` na nossa pilha, dentre vários
outros.

Criando uma classe, podemos adicionar exclusivamente os métodos que queremos.
Como append, pop e alguns métodos mágicos para iteração e visualização de dados.

```python
from typing import List, Any
from copy import deepcopy


class Stack:
    """Uma classe representando uma pilha"""

    def __init__(self) -> None:
        # Essa stack é genérica, por isso
        # a lista poderá receber qualquer
        # tipo de dados
        self.__data: List[Any] = []

        # Representa o índice para iterações
        # com for
        self.__index = 0

    def append(self, item: Any) -> None:
        """Representa o append da lista"""
        self.__data.append(item)

    def pop(self) -> Any:
        """Representa o pop da lista sem parâmetros"""
        if not self.__data:
            return

        return self.__data.pop()

    def peek(self) -> Any:
        """Mostra o último elemento adicionado à pilha"""
        if not self.__data:
            return

        return self.__data[-1]

    def __repr__(self) -> str:
        """Representação dos dados"""
        return str(self.__data)

    def __iter__(self):
        """Para iteração com for"""
        self.__index = len(self.__data)
        return self

    def __next__(self):
        """Para iteração com for (next item)"""
        if self.__index == 0:
            raise StopIteration

        self.__index -= 1
        return self.__data[self.__index]

    def __bool__(self):
        """Para iteração com while"""
        return bool(self.__data)


if __name__ == "__main__":
    stack = Stack()

    stack.append('A')
    stack.append('B')
    stack.append('C')

    print('FOR:')
    for item in stack:
        print(item)
    print()

    print('POP:')
    last_item = stack.pop()
    print(stack, last_item)
    print()

    print('WHILE:')
    stack_copy = deepcopy(stack)
    while stack_copy:
        print(stack_copy.pop())
    print()

    print('ORIGINAL STACK:')
    print(stack)
```

## Resumo

Em Python, usamos as listas como pilhas (nunca como filas). Elas são estruturas
de dados bem simples que precisam de apenas dois métodos para funcionarem
corretamente. Um método de inserção e outro de remoção de valores (`append` e
`pop`). Geralmente, o método de remoção (pop) também retorna o valor removido e
você pode usá-lo com o que preferir.

As pilhas trabalham apenas na extremidade final da lista, por isso têm
comportamento LIFO (Last In First Out), ou, o último a entrar é o primeiro a
sair. O último elemento adicionado é considerado o elemento do topo da pilha; o
primeiro elemento adicionado é o elemento da base da pilha.

Podemos iterar sobre pilhas usando laços `for` (invertendo seus valores) ou laço
`while` combinado com `pop`.

É possível copiar listas utilizando shallow copy ou deep copy.

É só isso… Te vejo no próximo artigo.
