---
title: 'Liskov Substitution Principle ou Princípio da Substituição de Liskov'
description:
  'Liskov Substitution Principle explicado: valide pré‑condições, pós‑condições
  e invariantes com casos reais e código Python.'
---

# O Princípio da Substituição de Liskov (LSP)

12 de agosto de 2025 - Luiz Otávio Miranda

Quem já trabalhou com herança na programação orientada a objetos, muito
provavelmente também já ouviu falar sobre o **Princípio da Substituição de
Liskov**, ou até já sofreu na prática quando ele foi quebrado no seu programa.

Introduzido
[por Barbara Liskov em 1987](https://en.wikipedia.org/wiki/Liskov_substitution_principle),
o LSP é um dos cinco princípios do famoso **SOLID** e define uma regra simples,
mas muito poderosa: _um subtipo deve poder substituir seu tipo base sem que o
comportamento esperado do sistema mude_.

Parece simple e extremamente óbvio, mas não é. O que muita gente esquece é que
não basta a tipagem funcionar, o **comportamento** (a sua lógica) também precisa
ser compatível. É aqui que entram conceitos como **pré-condições**,
**pós-condições** e **invariantes**: três pilares que ajudam a identificar se um
subtipo realmente respeita o contrato definido pela superclasse.

Neste artigo, vamos entender a definição formal do LSP, traduzi-la para um
contexto mais prático e analisar exemplos, desde os clássicos, até situações
sutis que passam despercebidas por type checkers, mas que podem quebrar seu
sistema no pior momento possível.

---

## A Definição Formal de Barbara Liskov

Se você for como eu, precisará ler o que ela disse algumas vezes até entender o
que ela quis dizer. Mas vamos para a definição forma em inglês e português.

> "What is wanted here is something like the following substitution property: If
> for each object `o1` of type `S` there is an object `o2` of type `T` such that
> for all programs `P` defined in terms of `T`, the behavior of `P` is unchanged
> when `o1` is substituted for `o2`, then `S` is a subtype of `T`."

Tradução literal:

> "O que se quer aqui é algo como a seguinte propriedade de substituição: se,
> para cada objeto `o1` do tipo `S`, existe um objeto `o2` do tipo `T`, de forma
> que, para todos os programas `P` definidos em termos de `T`, o comportamento
> de `P` permanece inalterado quando `o1` é substituído por `o2`, então `S` é um
> subtipo de `T`."

Entendeu? Ok, vamos decifrar isso juntos...

### O que ela quis dizer?

Tomei a liberdade de traduzir o que ela disse de uma forma menos formal. E eu
não fiz isso enquanto escrevia este texto, foram anos quebrando a cabeça até
chegar em algo assim:

> `S` é subtipo de `T` **somente** se **qualquer programa** escrito para
> funcionar com objetos do tipo `T` continuar se comportando **exatamente da
> mesma forma** quando receber um objeto do tipo `S`, sem "perceber" a troca.

Ou seja, **não basta a tipagem bater com o Type Checker, o comportamento do
subtipo também precisa ser compatível** com o comportamento do supertipo.

Você pode ter um código perfeito para o type checker e mesmo assim quebrar o LSP
se violar o contrato do tipo base.

Se isso acontecer, com certeza terá bugs no seu programa no futuro.

---

## Como verificar se o LSP está sendo respeitado

O checklist clássico é baseado em três pontos-chave: **pré-condições**,
**pós-condições** e **invariantes**. Antes de analisarmos cada um, vale lembrar
que **a compatibilidade começa na assinatura dos métodos**, ou seja, parâmetros,
retorno e exceções fazem parte do contrato que o subtipo precisa manter.

### Compatibilidade de assinaturas

- **Parâmetros:** No subtipo, devem ser **iguais ou mais genéricos**
  (**contravariantes**).
- **Retorno:** No subtipo, devem ser **iguais ou mais específicos**
  (**covariantes**).
- **Exceções:** O subtipo não deve lançar exceções que não sejam subtipos das
  lançadas pela superclasse.

Em Python, o `Callable` já é contravariante nos argumentos e covariante nos
retornos. Para saber qual exceção é subtipo de outra, veja a
[hierarquia de exceptions](https://docs.python.org/3/library/exceptions.html#exception-hierarchy).

Falamos sobre a variância no vídeo
[Genéricos ABC, Covariância, Contravariância e Invariância no Python - Aula 5](https://youtu.be/26BdcuNAlys).

---

### Pré-condições (inputs / parâmetros)

Pré-condições estão relacionadas aos parâmetros de entrada (ou inputs).

**Regra:** O subtipo **não pode** ser mais restritivo que o tipo base.

**Exemplos:**

- Se a abstração aceita um container iterável com **qualquer tipo de elemento**,
  o subtipo não pode exigir uma `list[str]`.
- Se a abstração espera uma **URL** (HTTP ou HTTPS), o subtipo não pode aceitar
  apenas **caminhos de arquivo local**.
- Se a abstração aceita **qualquer `int`**, o subtipo não pode restringir para
  **apenas inteiros positivos**.
- Se a abstração aceita `str` **vazia ou não vazia**, o subtipo não pode proibir
  string vazia.
- Se a abstração aceita `None` como valor opcional, o subtipo não pode rejeitar
  `None`.
- Se a abstração aceita **qualquer objeto** no `in` (`__contains__`), o subtipo
  não pode lançar `TypeError` para tipos diferentes.
- Se a abstração aceita `float` **com ou sem casas decimais**, o subtipo não
  pode aceitar apenas números inteiros representados como float (ex.: `1.0`,
  `2.0`).
- Se a abstração aceita **qualquer formato de data válido**, o subtipo não pode
  aceitar apenas `datetime.date` e rejeitar `datetime.datetime`.
- Se a abstração aceita parâmetros **por posição ou por nome**, o subtipo não
  pode exigir que todos sejam nomeados (ou todos posicionais).
- Se a abstração aceita qualquer arquivo aberto (modo leitura ou escrita), o
  subtipo não pode exigir exclusivamente arquivos abertos em modo leitura.

---

### Exemplo concreto para pré-condições (inputs / parâmetros)

Vejamos um exemplo onde o subtipo viola uma pré-condição do LSP:

```python
class Tags:
    def __init__(self, tags: set[str]) -> None:
        self._tags = tags

    # Contrato amplo: aceita qualquer objeto
    def __contains__(self, item: object) -> bool:
        return item in self._tags  # Para tipo "errado", retorna False


class StrictTags(Tags):
    # 🚫 Pré-condição mais restritiva: agora só aceita str
    def __contains__(self, item: object) -> bool:
        if not isinstance(item, str):
            raise TypeError("item must be str")
        return item in self._tags


# Cliente escrito para o tipo base:
def has_tag(t: Tags, q: object) -> bool:
    return q in t


t1 = Tags({"python", "types"})
t2 = StrictTags({"python", "types"})

print(has_tag(t1, 123))  # False (ok no contrato do base)
print(has_tag(t2, 123))  # 💥 TypeError, subtipo ficou mais restritivo
```

No código acima, `Tags` aceita que qualquer `object` seja utilizado com
`__contains__` (`in` e `not in`). Mas `StrictTags` impõe que apenas `str` pode
ser utilizado. O type checker não reclama, mas o comportamento mudou, quebrando
a pré-condição da classe base.

Pode parecer sutil, pode funcionar agora, mas em algum momento isso vai quebrar.

---

### Pós-condições (retorno / output)

**Regra:** O subtipo **não pode** entregar menos do que o tipo base, ou seja,
não pode enfraquecer as condições do tipo base.

**Exemplos:**

- Se o pai promete **retornar sempre um número positivo**, o filho não pode
  retornar negativos.
- Se o pai promete retornar um **objeto não nulo** (`None` nunca é retorno
  válido), o filho não pode retornar `None`.
- Se o pai promete retornar uma **coleção ordenada**, o filho não pode retornar
  elementos fora de ordem.
- Se o pai promete retornar **todos os registros** encontrados, o filho não pode
  retornar apenas parte deles sem avisar.
- Se o pai promete retornar um **tipo específico** (`list`), o filho não pode
  retornar outro tipo compatível mas diferente (`tuple`, `set`), mesmo que tenha
  os mesmos dados.
- Se o pai promete retornar **um valor convertido para minúsculas**, o filho não
  pode retornar o valor com caixa mista.
- Se o pai promete retornar um **JSON válido**, o filho não pode retornar uma
  string que não seja JSON parseável.
- Se o pai promete retornar um **arquivo legível até o fim**, o filho não pode
  retornar um arquivo truncado.
- Se o pai promete retornar um **caminho absoluto**, o filho não pode retornar
  um caminho relativo.
- Se o pai promete retornar um **hash único**, o filho não pode retornar um
  valor fixo ou repetido.

> **Observação:** Você pode **prometer mais** que o pai, mas nunca menos.

---

### Exemplo concreto para pós-condições (outputs / retornos)

Um exemplo de algo que só retorna positivos no Python é o `__len__`. Este método
é chamado ao usar `len()` para saber quantos itens existem no container. Ou o
container está vazio (0 itens) ou tem elementos. Ele nunca terá uma quantidade
negativa de itens.

```python
# Tipagem perfeita, mas pós-condição violada
class SizedProtocol:
    def __init__(self, data: list[int]) -> None:
        self._data = data

    def __len__(self) -> int:
        return len(self._data)  # Sempre >= 0 (contrato implícito do Python)

class BadSized(SizedProtocol):
    def __len__(self) -> int:
        return len(self._data) - 1  # 🚫 Pode gerar valor negativo (sutil)


bad_sized = BadSized([])  # Vazio, então seria zero, mas será -1
size = len(bad_sized)     # ValueError: __len__() should return >= 0
```

Esse exemplo já quebrou antes de nascer, bastou passar um objeto vazio e pedir
quantos itens ele tem.

---

### Invariantes (verdades que sempre se mantêm)

**Regra:** O subtipo deve manter todos os invariantes do tipo base.

**Exemplos:**

- Se a classe base garante que um **ID é imutável após criação**, o subtipo não
  pode permitir alterar o ID.
- Se a classe base garante que o **saldo inicial de conta bancária ≥ 0**, o
  subtipo não pode criar contas com saldo negativo.
- Se a classe base garante que uma **lista está sempre ordenada**, o subtipo não
  pode inserir elementos fora de ordem.
- Se a classe base garante que a **largura e altura são independentes**, o
  subtipo não pode forçar que sejam sempre iguais (clássico `Rectangle` vs
  `Square`).
- Se a classe base garante que um **arquivo temporário é apagado após uso**, o
  subtipo não pode manter o arquivo no disco.
- Se a classe base garante que a **conexão com banco de dados está aberta**
  enquanto o objeto existir, o subtipo não pode fechar a conexão no meio da
  execução.
- Se a classe base garante que **valores duplicados não existem** numa coleção,
  o subtipo não pode permitir duplicatas.
- Se a classe base garante que **datas estão sempre no futuro** (ex.:
  agendamento), o subtipo não pode permitir datas no passado.
- Se a classe base garante que um **token expira em até 1 hora**, o subtipo não
  pode emitir tokens com expiração indefinida.
- Se a classe base garante que a **moeda de uma transação é fixa** após criação,
  o subtipo não pode permitir mudar a moeda depois.

---

### Exemplo concreto para invariantes (verdades que devem se manter)

Um dos exemplos mais conhecidos de quebra de invariante é quando se tenta usar o
`Quadrado` como subtipo de `Retângulo`. A ideia parece natural: _um quadrado é
um retângulo com a mesma altura e largura_.

O problema é que, nessa frase, já quebramos a invariante dos dois:

- **Retângulo:** largura e altura são **independentes**.
- **Quadrado:** largura e altura são **sempre iguais**.

Ou seja, `Quadrado` e `Retângulo` são objetos distintos que, por acaso,
compartilham uma propriedade em comum: a **área**. Mas, se for por isso,
`Círculo` também tem área e nem por isso é um retângulo.

Para ilustrar um caso diferente do clássico retângulo/quadrado, veja o código
abaixo:

```python
class DatabaseConfig:
    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    @property
    def dsn(self) -> str: # uma invariância
        return self._dsn


class MySqlDatabaseConfig(DatabaseConfig):
    def __init__(self, host: str, user: str, password: str, db: str) -> None:
        # Não tem DSN, mas força herança para "reaproveitar" métodos
        self.host = host
        self.user = user
        self.password = password
        self.db = db

        # Apenas inicializa a base com valor vazio (quebrando a invariante)
        super().__init__("")


def connect(cfg: DatabaseConfig) -> None:
    # Cliente depende da invariante DatabaseConfig.dsn
    print("Connecting to:", cfg.dsn)


cfg_bad = MySqlDatabaseConfig(host="", user="root", password="", db="app")
connect(cfg_bad)  # ❌ imprime DSN vazio; quebra a invariante
```

No exemplo acima, `DatabaseConfig` foi projetada para trabalhar com `dsn` como
parte obrigatória. O subtipo herda a classe mas ignora essa regra, inicializando
com valor vazio. Isso quebra o contrato implícito de que `dsn` sempre está
configurado.

Uma forma de resolver seria:

- Extrair métodos compartilhados para outra classe/módulo, evitando herança
  forçada.
- Padronizar todas as subclasses para realmente usarem `dsn` no mesmo formato.

---

## Por que isso importa?

O LSP é fácil de quebrar sem perceber. Não é preciso "herança do mal" nem mudar
tipagem, um simples detalhe de lógica já quebra o contrato. Muitos desses bugs
são sutis e podem viver despercebidos por anos... até que um dia 💥💥💥.

No fim das contas, respeitar o LSP é menos sobre decorar uma definição formal e
mais sobre entender o **contrato invisível** que existe entre a classe base e
seus subtipos. Muitas violações não aparecem nos testes de tipagem, nem nos seus
testes automatizados, mas cobram seu preço em produção, quando o sistema começa
a se comportar de forma inesperada. Então, da próxima vez que criar uma
hierarquia de classes, lembre-se: herdar é fácil, mas herdar corretamente é
outra história completamente diferente.

---
