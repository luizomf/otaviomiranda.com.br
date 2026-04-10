---
title: 'Guia de sobrevivência Bash e Shell Script (Sério!)'
description:
  'Se eu coloquei a mão no negócio, é porque é bom. Só leia! Tô brincando, estou
  estudando mais bash e shell script e pensei em montar este post. Tudo aqui é
  parte do que já estudei.'
date: 2026-04-10T16:09:38-03:00
author: 'Otávio Miranda'
---

Esse vai para devs que já sabem o básico do Shell Script e Bash e querem subir
de nível. Me incluo nisso também. De fato, só estou escrevendo isso porque tenho
estudado muito sobre o assunto.

Você vai ler por sua conta e risco. Perceba que o autor desse post não tem
nenhum desses nomes: **Erich Gamma**, **Richard Helm**, **Ralph Johnson** e
**John Vlissides**. Então você está vivendo perigosamente.

Tá parei!

Não sei se foi assim com você também, mas eu tive um caso com Bash e Shell
Script.

Como tinha acesso ao root do servidor, aprendi `#!/bin/bash` e
`echo "hello world"`. Daqui foi só ladeira abaixo. Te juro que lembro de
pesquisar no Google, porque via `#!/bin/bash` e `#!/bin/sh` em scripts (pode ir
lá, vou te esperar. Tá
[aqui o link](https://claude.ai/share/9b9bb01d-d98b-4166-aa1c-685100146860)).

Se você está estranhando o acesso ao servidor, antigamente usávamos tudo direto
mesmo (pelo menos EU, usava). Digitava `ssh user@host` e usava um programa
maravilhoso chamado **FileZilla** na porta `21` (seco mesmo). Segurança? FTP-se.

Mas eu divago. As coisas mudaram um pouco. Melhorei meu conhecimento (um pouco)
e sigo estudando. Considere que você está lendo minhas notas de estudo. Espero
que elas sejam úteis pra você, como estão sendo pra mim..

Do que pretendo falar? (caramba velho, você já está no artigo, só rolar ↓)

- Padrões de tratamento de erro que separam script de brinquedo de script de
  produção
- Técnicas de manipulação de variáveis que substituem vários dos seus hábitos
  com `sed` e `awk`
- Mistérios de controle de processo que causam o famoso bug do "ué, por que
  minha variável ficou vazia?"
- Padrões do mundo real pra parsing de argumentos, config, logs e testes
- Armadilhas de segurança e como não ser atropelado por elas

Eu poderia muito bem corrigir as frases acima, trazendo o texto de volta para
meu tom de escrita. Mas prefiro manter as coisas simples. Como minha mãe sempre
falava: **Otávio, lembre-se que mais é menos**.

A lista acima foi gerada por IA porque eu não sabia o que era cada uma daquelas
coisas. Mas confia, tem coisa interessante para baixo.

Eu já enrolei e brinquei demais. E cá entre nós, faço isso pra espantar público
desqualificado. Aquele povo só queria copiar algo daqui e sair.

Já que eles já foram, então agora temos trabalho. (Você leu aquela frase de
novo?)

---

# Fundamentos e redes de segurança: escrevendo scripts Bash sem susto

Essa parte aqui é o kit de sobrevivência. Não é a parte "olha como eu sou
avançado". É a parte "como eu evito passar vergonha porque um `cd` falhou e o
resto do script saiu correndo sem mim".

## Tratamento de erro sem autoengano

Quase todo mundo já escreveu algo nessa linha:

```bash
#!/bin/bash
cd /tmp/build
rm -rf *
cp -r /src/output/* .
tar czf release.tar.gz *
echo "Pronto!"
```

Enquanto tudo está bonito, ele parece ótimo. O problema aparece no dia em que
`/tmp/build` não existe. O `cd` falha, o `rm -rf *` roda no diretório errado, e
pronto: você ganhou uma tarde bem educativa.

O primeiro freio de mão costuma ser este:

```bash
set -euo pipefail
```

Ajuda bastante. Só não compra a lenda de que isso resolve tudo sozinho.

**`set -e` (errexit)** manda o script parar quando um comando falha. Beleza. Só
que ele tem vários cantos estranhos. Um dos meus favoritos é este aqui:

```bash
# Isso engole erros silenciosamente:
local result=$(might_fail)

# Isso captura o erro direito:
local result
result=$(might_fail)
```

No primeiro caso, o `local` devolve `0` e esconde a falha do comando. Você segue
com uma variável vazia e ainda acha que está tudo certo.

Outra pegadinha chata: `set -e` fica meio "desligado" em alguns contextos, como
comandos usados em `if`. Então não confia cegamente nele. Entende onde ele ajuda
e onde ele faz pose.

**`set -u` (nounset)** transforma variável não definida em erro. Sem isso,
`$UNSET_VAR` vira string vazia e a festa continua. Em Bash antigo, arrays vazios
podem dar umas respostas mais esquisitas, então vale testar se você ainda
precisa suportar versão jurássica.

**`set -o pipefail`** corrige outro clássico: pipeline que "passa" porque só o
último comando foi bem. Sem ele, um `curl` pode falhar e o `jq` ainda sair com
cara de inocente. Só lembra que `head -n1` e amigos podem encerrar o pipe cedo e
gerar `SIGPIPE` no processo anterior. Quando isso for esperado, trate o caso de
forma explícita.

### O modo estrito moderno

Hoje, se eu puder escolher, eu prefiro partir daqui:

```bash
#!/usr/bin/env bash
set -Euo pipefail
shopt -s inherit_errexit  # Bash 4.4+
trap 's=$?; echo "$0: Erro na linha $LINENO: $BASH_COMMAND" >&2; exit $s' ERR
```

Os extras fazem diferença.

- `set -E` ajuda o `trap ERR` a alcançar função e subshell.
- `inherit_errexit` evita outra daquelas "gentilezas" do Bash com `$(...)`.
- O `trap` pelo menos te diz onde a coisa foi pro espaço, em vez de deixar só um
  silêncio constrangedor.

Olha o contraste:

```bash
#!/bin/bash
DATA=$(curl -s https://api.example.com/data)
echo "$DATA" | jq '.users[] | .email' > emails.txt
wc -l emails.txt
echo "Exportacao concluida"
```

Se a API estiver fora, esse script ainda consegue terminar sorrindo e dizendo
"exportação concluída". Maravilhoso. Só que não.

Eu prefiro algo assim:

```bash
#!/usr/bin/env bash
set -Euo pipefail
shopt -s inherit_errexit
trap 's=$?; echo "FALHOU na linha $LINENO: $BASH_COMMAND (saida $s)" >&2; exit $s' ERR

DATA=$(curl -sf https://api.example.com/data)
echo "$DATA" | jq -e '.users[] | .email' > emails.txt
LINES=$(wc -l < emails.txt)
echo "Exportacao concluida: $LINES emails"
```

`curl -f` para de fingir que HTTP quebrado é sucesso. `jq -e` também ajuda a
falhar quando o resultado vem vazio ou `null`. E o `trap` te devolve um erro que
dá pra investigar sem precisar abrir uma sessão espírita.

## POSIX vs recursos específicos do Bash

Antes de usar array, `[[ ]]`, `mapfile` e companhia, decide uma coisa: seu
script é `sh` ou é Bash?

`#!/bin/sh` não significa "shell genérico mágico". No macOS, costuma cair num
Bash 3.2 antigo. Em Debian e Ubuntu, normalmente é `dash`. Em Alpine, geralmente
é `ash`. Cada um tem suas manias, e nenhum deles jura compatibilidade com os
bashismos que a gente usa sem pensar.

O bug clássico é este: você testa localmente com Bash, sobe a mesma coisa num
container Alpine e toma um `Syntax error: "(" unexpected` na cara.

```bash
#!/bin/sh
# Parece inocente. Quebra em praticamente qualquer lugar que nao seja bash.

NAMES=("Alice" "Bob" "Charlie")
for name in "${NAMES[@]}"; do
    if [[ "$name" == "Bob" ]]; then
        echo "Bob encontrado!"
    fi
done

MSG="Hello\tWorld"
echo -e "$MSG"

curl -s https://example.com &>/dev/null
```

Aí já tem array, `[[ ]]`, `echo -e` e `&>/dev/null`. Tudo coisa que pode
explodir ou se comportar diferente fora do Bash.

Se a ideia for ficar em POSIX, algo assim já é bem mais honesto:

```bash
#!/bin/sh
set -- "Alice" "Bob" "Charlie"
for name in "$@"; do
    case "$name" in
        Bob) echo "Bob encontrado!" ;;
    esac
done

printf 'Hello\tWorld\n'

curl -s https://example.com >/dev/null 2>&1
```

Minha regra é simples:

- Se o shebang é `#!/bin/sh`, escreve POSIX sem jeitinho.
- Se você quer recurso do Bash, assume isso logo e usa `#!/usr/bin/env bash`.

Pra testar, `shellcheck -s sh` e `dash script.sh` já evitam bastante dor de
cabeça.

## ShellCheck é seu melhor amigo

Se eu tivesse que te recomendar uma ferramenta só pra escrever shell script
menos torto, seria o [ShellCheck](https://www.shellcheck.net/). Ele não pega só
estilo. Ele pega bug que morde.

Um aviso famoso é o `SC2115`:

```bash
# ShellCheck avisa: SC2115
# Use "${var:?}" para garantir que isso nunca expanda para /*
rm -rf "$STEAMROOT/"*
```

Se `$STEAMROOT` vier vazio, isso pode virar `rm -rf /*`. Não é paranoia. Já
aconteceu com o cliente Linux da Steam. A forma segura é exigir que a variável
exista de verdade com `${STEAMROOT:?}`.

Cinco avisos que valem decorar:

- **SC2086**: coloca aspas nas variáveis.
- **SC2155**: separa declaração de atribuição.
- **SC2164**: não trata `cd` como decoração.
- **SC2046**: coloca aspas em substituição de comando também.
- **SC2162**: usa `read -r`.

Se quiser integrar no projeto:

```bash
# .shellcheckrc
shell=bash
enable=all
severity=style
source-path=SCRIPTDIR
```

No CI, já resolve assim:

```yaml
- name: ShellCheck
  run: find . -name '*.sh' -print0 | xargs -0 shellcheck --severity=warning
```

E no `pre-commit`:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/koalaman/shellcheck-precommit
    rev: v0.10.0
    hooks:
      - id: shellcheck
```

## Quando NÃO usar Bash

Bash é ótimo como cola. Como linguagem de propósito geral, cá entre nós, ele é
meio barraqueiro.

Eu gosto de Bash quando a tarefa é:

- ligar comando com comando
- mover arquivo, chamar processo, organizar pipeline
- fazer automação curta
- ser entrypoint, script de deploy ou etapa de CI

Eu já começo a desconfiar quando aparece isso aqui:

- estrutura de dados mais séria
- parsing de JSON, YAML ou XML virando rotina
- HTTP com retry, autenticação e tratamento de erro mais chato
- muito `awk` e `sed` segurando a arquitetura nas costas
- regra de negócio crescendo dentro do shell

Não existe número mágico, mas quando um script começa a crescer e a lógica vai
ficando mais cheia de desvio, vale parar e perguntar: "isso aqui ainda é Bash ou
eu só estou teimando?".

Às vezes 200 linhas em Bash ficam ótimas. Às vezes 50 já passaram da conta. O
critério, pra mim, é menos tamanho e mais sofrimento.

No fim, o melhor script Bash costuma ser o que sabe seu lugar: orquestra bem,
falha cedo e passa o trabalho pesado pra ferramenta certa.

---

# Variáveis e expansões avançadas: além de `$var`

Muita gente aprende `name="world"` e `echo "$name"` e para ali. Eu também fiquei
um bom tempo nessa. Só que Bash começa a ficar menos sofrido quando você usa as
expansões direito e para de abrir subprocesso por qualquer coisinha.

## Arrays: pare de fingir com string separada por espaço

Se você ainda faz isso aqui:

```bash
files="file1.txt file2.txt file3.txt"
```

... então você está deixando um bug quietinho esperando o primeiro nome com
espaço aparecer.

Use array de verdade:

```bash
# Declaracao
files=("report Q1.csv" "data 2024.json" "notes.txt")

# Iteracao - O UNICO JEITO CORRETO
for f in "${files[@]}"; do
    echo "Processando: $f"
done
```

Esse `"${files[@]}"` com aspas não é frescura. É o que impede `report Q1.csv` de
virar dois argumentos.

Se precisar de mapa, tem array associativo:

```bash
declare -A http_codes=(
    [200]="OK"
    [404]="Not Found"
    [500]="Internal Server Error"
)

echo "${http_codes[404]}"  # Not Found
echo "${!http_codes[@]}"   # Chaves: 200 404 500
echo "${#http_codes[@]}"   # Quantidade: 3
```

Sem `declare -A`, o Bash faz o favor de interpretar chave string como expressão
aritmética. Adivinha o tipo de bug bonito que sai daí.

Exemplo mais útil:

```bash
declare -A status_counts

while IFS= read -r line; do
    # Extrai o status HTTP (quinto campo do common log format)
    status="${line##* \" }"
    status="${status%% *}"
    (( status_counts[$status]++ ))
done < access.log

# Relatorio
for code in "${!status_counts[@]}"; do
    printf "%-6s %d\n" "$code" "${status_counts[$code]}"
done | sort -t' ' -k2 -rn
```

Quando o dado vai continuar vivo dentro do script, isso costuma ser melhor do
que transformar tudo em texto e depois parsear de novo.

Pra carregar arquivo em array:

```bash
# Correto: lida com espacos e nao faz glob
mapfile -t lines < input.txt

# Tambem correto (alternativa para bash 3.x)
IFS=$'\n' read -r -d '' -a lines < input.txt || true

# ERRADO: globbing + word splitting destroem seus dados
lines=( $(cat input.txt) )    # NAO FACA ISSO
```

`mapfile` resolve isso sem drama. O `$(cat file)` é o tipo de coisa que parece
funcionar até o dia em que a entrada vem com espaço, `*` ou qualquer outra
surpresinha simpática.

## Expansão de parâmetros: o tipo de coisa que faz você chamar menos `sed`

Aqui começa a parte divertida do Bash. Não divertida no sentido "uau, que
linguagem elegante". Divertida no sentido "pera, eu realmente não preciso abrir
um processo pra isso?".

```bash
filepath="/home/deploy/app/config.tar.gz"

echo "${filepath##*/}"    # config.tar.gz  (basename, remove prefixo de forma gulosa)
echo "${filepath%/*}"     # /home/deploy/app  (dirname, remove sufixo de forma curta)
echo "${filepath%%.*}"    # /home/deploy/app/config  (remove TODAS as extensoes)
echo "${filepath%.gz}"    # /home/deploy/app/config.tar  (remove so a ultima extensao)
```

Resumo rápido:

- `#` corta da esquerda
- `%` corta da direita
- uma vez = menor correspondência
- dobrado = maior correspondência

Renomear extensão fica simples:

```bash
for f in *.jpeg; do
    mv -- "$f" "${f%.jpeg}.jpg"
done
```

Busca e substituição também:

```bash
msg="ERROR: connection failed: timeout: host=db.prod"

echo "${msg//:/ -}"          # Substitui todos os : por -
echo "${msg//:/}"            # Remove todos os :
echo "${msg/#ERROR/WARN}"    # Substitui so se estiver no inicio
echo "${msg/%prod/staging}"  # Substitui so se estiver no fim
```

E tem as expansões de default, que eu uso bastante:

```bash
# ${var:-default} - usa o default se var estiver vazia OU nao definida
db_host="${DB_HOST:-localhost}"

# ${var:=default} - mesma coisa, mas TAMBEM atribui o valor a var
: "${CACHE_TTL:=3600}"  # Define CACHE_TTL se ainda nao existir

# ${var:+alternate} - usa alternate so se var EXISTIR e nao estiver vazia
auth_header="${API_TOKEN:+Authorization: Bearer $API_TOKEN}"

# ${var:?message} - sai com erro se var estiver vazia ou nao definida
: "${DATABASE_URL:?DATABASE_URL precisa estar definida}"
```

`:=` é útil pra inicializar. `:?` é ótimo pra falhar cedo sem escrever aquele
bloco `if [ -z ... ]` pela milésima vez.

Se você estiver num Bash 4+, ainda ganha conversão de caixa:

```bash
name="john DOE"
echo "${name^^}"   # JOHN DOE  (maiusculas)
echo "${name,,}"   # john doe  (minusculas)
echo "${name^}"    # John DOE  (capitaliza o primeiro caractere)
```

É pouca coisa? Sim. Mas já corta subprocesso besta com `tr`.

## O inferno das aspas

Se eu tivesse que escolher uma coisa pra martelar em shell script, seria aspas.
Metade dos bugs estranhos de Bash parece ter sido criada num laboratório só pra
te lembrar disso.

```bash
#!/bin/bash
cleanup() {
    local dir=$1
    for file in $(ls "$dir"); do
        rm "$dir/$file"
    done
}

cleanup "/tmp/my app/cache"
```

Esse script é uma fábrica de problema. `$(ls "$dir")` faz word splitting. Aí o
arquivo com espaço vira dois. E você só percebe quando apagou a coisa errada ou
quando nada funciona no servidor "sem motivo".

O mínimo aceitável fica assim:

```bash
cleanup() {
    local dir=$1
    for file in "$dir"/*; do
        [[ -f "$file" ]] && rm -- "$file"
    done
}
```

Três regras que ajudam muito:

1. Coloca aspas em expansão de variável.
2. Usa `"$@"` pra repassar argumentos.
3. Prefere `[[ ]]` a `[ ]` quando estiver em Bash.

Sobre `"$@"` vs `$*`, olha isso:

```bash
# Suponha que o script foi chamado assim: ./script "hello world" "foo bar"

echo "--- \$* ---"
for arg in $*; do echo "  [$arg]"; done
# [hello] [world] [foo] [bar]  - 4 args. Quebrado.

echo "--- \"\$*\" ---"
for arg in "$*"; do echo "  [$arg]"; done
# [hello world foo bar]  - 1 arg. Tambem quebrado.

echo "--- \"\$@\" ---"
for arg in "$@"; do echo "  [$arg]"; done
# [hello world] [foo bar]  - 2 args. Correto.
```

`"$@"` preserva os argumentos do jeito que eles vieram. `"$*"` tem seus usos,
mas quase nunca é o que você quer.

E sobre `[[ ]]`:

```bash
# Fragil - quebra com valores vazios ou com espacos
[ "$var" = "" ] && echo "vazia"

# Robusto - sem ginastica com aspas
[[ -z $var ]] && echo "vazia"

# Bonus: regex (so em [[ ]])
[[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]] && echo "valido"
```

## Variáveis indiretas e nameref: dinamismo sem `eval`

Quando você precisa usar o nome de uma variável guardado dentro de outra, `eval`
costuma ser a primeira ideia ruim que aparece.

```bash
# PERIGOSO - nunca faca isso com entrada nao confiavel
key="PATH"
eval "echo \$$key"    # Funciona, mas eval interpreta codigo arbitrario
```

Funciona? Funciona. E também abre a porta pra você executar coisa que não devia.

Pra ler o valor de outra variável, usa expansão indireta:

```bash
key="HOME"
echo "${!key}"    # /home/deploy - expande a variavel cujo nome esta em $key
```

Se precisar mesmo de referência, aí entra `declare -n`:

```bash
declare -n ref="HOME"
echo "$ref"           # /home/deploy
ref="/opt/app"        # Isso ALTERA $HOME (cuidado!)
```

Caso real:

```bash
load_config() {
    local config_file="$1"
    while IFS='=' read -r key value; do
        # Ignora comentarios e linhas em branco
        [[ "$key" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$key" ]] && continue
        # Remove espacos
        key="${key## }" ; key="${key%% }"
        value="${value## }" ; value="${value%% }"
        # Exporta como variavel de ambiente em maiusculas
        declare -g "${key^^}=$value"
    done < "$config_file"
}

# config.env:
# db_host = postgres.prod
# db_port = 5432
# cache_ttl = 3600

load_config "config.env"
echo "$DB_HOST"    # postgres.prod
echo "$CACHE_TTL"  # 3600
```

Sem `eval`, sem `source`, sem transformar config em código executável.

Outra situação boa pra `nameref` é "retorno múltiplo":

```bash
# Uma funcao que devolve o valor em variaveis escolhidas pelo chamador
parse_semver() {
    local version="$1"
    declare -n major_ref="$2"
    declare -n minor_ref="$3"
    declare -n patch_ref="$4"

    major_ref="${version%%.*}"
    local rest="${version#*.}"
    minor_ref="${rest%%.*}"
    patch_ref="${rest#*.}"
}

parse_semver "3.14.2" maj min pat
echo "$maj.$min.$pat"  # 3.14.2
```

É um jeito limpo de fazer a função escrever no que o chamador escolheu, sem
arquivo temporário e sem gambiarra global.

> **Nota de versão:** arrays associativos exigem Bash 4.0+, conversão de caixa
> (`^^`, `,,`) exige 4.0+, `mapfile` exige 4.0+, e `declare -n` exige 4.3+. O
> macOS ainda vem com Bash 3.2 por causa da novela da GPLv3. Então, se você
> precisa suportar macOS puro, ou instala Bash novo com `brew install bash`, ou
> segura a onda com recursos mais antigos.

---

# Controle de processos e sinais: aqui o shell começa a aprontar

Quando Bash fica estranho de verdade, geralmente não é por causa de variável. É
por causa de processo. A variável sumiu? Talvez ela tenha nascido num subshell.
O `Ctrl-C` não limpou nada? Talvez você não amarrou os sinais. O `nohup` não
virou daemon? Porque ele nunca prometeu isso.

## Substituição de processo: quando pipe não resolve

Pipe é ótimo quando o próximo comando quer `stdin`. Nem sempre ele quer.

Nesses casos, a substituição de processo quebra um galho enorme:

```bash
<(list)   # um pseudo-arquivo legivel com o stdout de list
>(list)   # um pseudo-arquivo gravavel alimentando o stdin de list
```

O Bash te entrega algo via `/dev/fd` ou FIFO pra você plugar em comando que
espera caminho de arquivo.

Exemplo clássico:

```bash
comm -3 <(sort prod-packages.txt) <(sort staging-packages.txt)
```

Ou com `diff`:

```bash
diff -u <(sort before.txt) <(sort after.txt)
```

Sem arquivo temporário perdido em `/tmp`, sem cleanup extra só pra comparar duas
coisas.

O `>(...)` também é útil:

```bash
tar -cf - project \
  | tee >(sha256sum > project.tar.sha256) \
  > project.tar
```

Você gera o tar uma vez só e ainda calcula o hash no caminho.

Agora, o bug clássico:

```bash
last=""
printf '%s\n' alpha beta | while IFS= read -r line; do
  last=$line
done
printf 'last=%s\n' "$last"
```

Se isso te devolveu variável vazia, bem-vindo ao clube. O loop rodou num
subshell por causa do pipeline. O shell pai não ficou sabendo de nada.

Quando o estado precisa sobreviver, eu prefiro assim:

```bash
last=""
while IFS= read -r line; do
  last=$line
done < <(printf '%s\n' alpha beta)
printf 'last=%s\n' "$last"
```

Ou, se já for arquivo:

```bash
while IFS= read -r line; do
  last=$line
done < input.txt
```

Tem `lastpipe`? Tem. Eu basearia convenção de time nisso? Nem ferrando.

Regra simples: se a lógica mexe em estado que você ainda vai usar, evita pipear
pra dentro dela.

## Traps: cleanup de verdade

Se o script cria temporário, lock, socket ou processo em background, cleanup não
é detalhe. Tem que entrar no design.

Um padrão que costuma me servir bem:

```bash
#!/usr/bin/env bash
set -euo pipefail

tmpdir=$(mktemp -d)
worker_pid=""

cleanup() {
  [[ -n "$worker_pid" ]] && kill "$worker_pid" 2>/dev/null || true
  rm -rf "$tmpdir"
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

(
  while :; do
    date +%s >>"$tmpdir/heartbeat.log"
    sleep 2
  done
) &
worker_pid=$!

printf 'worker=%s temp=%s\n' "$worker_pid" "$tmpdir"
wait "$worker_pid"
```

Se o script só limpa no caminho feliz, ele não limpa. Só teve sorte.

Coisas que valem lembrar:

- `EXIT` é onde eu quase sempre penduro teardown.
- `INT` e `TERM` merecem atenção.
- `ERR` ajuda no diagnóstico, mas não substitui fluxo pensado.
- `SIGKILL` não negocia com ninguém.

E não, o Bash não vira supervisor só porque você colocou um `&` no final.
Guardou PID? Sabe quem precisa morrer? Sabe o que acontece se o shell ignorar um
sinal? Isso tudo importa.

## Job control: ótimo no terminal, não no lugar de um supervisor

No shell interativo, job control é uma mão na roda:

```bash
$ rsync -av --info=progress2 big-tree/ backup:/srv/backup/
^Z
[1]+  Stopped                 rsync -av --info=progress2 big-tree/ backup:/srv/backup/
$ bg %1
[1]+ rsync -av --info=progress2 big-tree/ backup:/srv/backup/ &
$ jobs
[1]+  Running                 rsync -av --info=progress2 big-tree/ backup:/srv/backup/ &
$ fg %1
rsync -av --info=progress2 big-tree/ backup:/srv/backup/
```

Pra esse tipo de uso, ele é ótimo. Você pausa, manda pro background, traz de
volta. Beleza.

O tropeço vem quando a gente começa a tratar isso como gerenciamento de serviço.
Não é.

Se quiser manter o job vivo depois do logout:

```bash
bg %1
disown -h %1
```

Ou já inicia com `nohup`:

```bash
nohup rsync -av --info=progress2 big-tree/ backup:/srv/backup/ \
  >rsync.log 2>&1 &
```

Lembra do detalhe: `nohup` não manda pro background sozinho. O `&` continua
necessário.

Se o processo realmente importa, usa `systemd`, `tmux`, `screen`, `systemd-run`
ou outro supervisor de verdade. `disown` e `nohup` resolvem um problema bem mais
simples.

## Subshells vs grupos de comando

Essa diferença parece boba até o dia em que você toma uma rasteira:

```bash
(commands)      # roda em um subshell
{ commands; }   # roda no shell atual
```

Com parênteses, mudança de diretório, variável e opções do shell morrem ali
dentro. Com chaves, elas continuam valendo.

```bash
(cd /tmp; printf 'dentro de (): %s\n' "$PWD")
printf 'depois de (): %s\n' "$PWD"

{ cd /tmp; printf 'dentro de {}: %s\n' "$PWD"; }
printf 'depois de {}: %s\n' "$PWD"
```

E é a mesma ideia por trás do contador que fica em `0`:

```bash
count=0
printf '%s\n' a b c | while IFS= read -r _; do
  ((count++))
done
echo "$count"   # 0

count=0
while IFS= read -r _; do
  ((count++))
done < <(printf '%s\n' a b c)
echo "$count"   # 3
```

O resumo que eu tento guardar é este:

- usa `(...)` quando quiser isolamento
- usa `{ ...; }` quando quiser manter efeito colateral
- evita pipeline quando a lógica precisa alterar estado do shell atual

Parece detalhe. Não é. É o tipo de detalhe que decide se o script é previsível
ou se vai ter comportamento de poltergeist.

---

# Padrões do mundo real: Bash de produção

Quando eu penso em Bash de produção, eu não penso em "script elegante". Eu penso
em script previsível. Aquele troço chato, explícito e um pouco paranoico, mas
que não inventa surpresa ruim.

## Parsing de argumentos do jeito certo

`getopts` já resolve muita coisa. Não é framework de CLI, não vai te dar
subcomando bonitinho, mas pra muito script real ele basta.

O ponto é: parsing não termina quando você conseguiu ler `-v` e `-o`. Parsing
também é validar aridade, formato e pressuposto que o resto do script depende.

Esse padrão aqui é bom de manter na manga:

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: report-sync [-v] [-o file] [-c config] job_name source_dir
USAGE
}

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

verbose=0
output_file=
config_file=
job_name=
source_dir=

normalize_args() {
  local normalized=()

  while (($#)); do
    case "$1" in
      --verbose) normalized+=(-v) ;;
      --output)
        (($# >= 2)) || die "--output requires a file path"
        normalized+=(-o "$2")
        shift
        ;;
      --config)
        (($# >= 2)) || die "--config requires a path"
        normalized+=(-c "$2")
        shift
        ;;
      --help) normalized+=(-h) ;;
      --)
        shift
        while (($#)); do
          normalized+=("$1")
          shift
        done
        break
        ;;
      *) normalized+=("$1") ;;
    esac
    shift
  done

  printf '%s\0' "${normalized[@]}"
}

parse_args() {
  local -a argv=()

  while IFS= read -r -d '' token; do
    argv+=("$token")
  done < <(normalize_args "$@")

  set -- "${argv[@]}"
  OPTIND=1

  while getopts ':vo:c:h' opt; do
    case "$opt" in
      v) verbose=1 ;;
      o) output_file=$OPTARG ;;
      c) config_file=$OPTARG ;;
      h)
        usage
        exit 0
        ;;
      :)
        die "Option -$OPTARG requires an argument"
        ;;
      \?)
        usage >&2
        die "Unknown option: -$OPTARG"
        ;;
    esac
  done

  shift $((OPTIND - 1))
  (($# == 2)) || die 'Expected job_name and source_dir'

  job_name=$1
  source_dir=$2

  [[ $job_name =~ ^[a-zA-Z0-9._-]+$ ]] || die "Invalid job name: $job_name"
  [[ -d $source_dir ]] || die "Source directory not found: $source_dir"

  if [[ -n ${output_file:-} ]]; then
    local parent_dir
    parent_dir=$(dirname -- "$output_file")
    [[ -d $parent_dir ]] || die "Output directory does not exist: $parent_dir"
  fi
}

parse_args "$@"
```

Algumas escolhas aí eu manteria sem pensar muito:

- normalizar opção longa na mão em vez de depender de `getopt` externo
- validar logo depois do parsing
- falhar cedo quando caminho, nome ou formato vierem errados

Se o script começa a pedir subcomando, config aninhada e um monte de modo
mutuamente exclusivo, é um bom sinal de que talvez já tenha passado da hora de
sair do Bash.

## Arquivos de configuração: dados, não código surpresa

Eu evito `source` pra config sempre que posso. `source` não lê "dados". Ele
executa shell dentro do shell atual. Se isso é o que você quer, beleza. Se não
é, você acabou de transformar configuração em código executável sem nem
perceber.

Pra config simples, `KEY=VALUE` ainda é um formato honesto. Fácil de versionar,
de sobrepor com variável de ambiente e de entender sem sofrimento.

Este loader aqui segue essa ideia e já recusa sintaxe shell no valor:

```bash
#!/usr/bin/env bash
set -euo pipefail

readonly DEFAULT_CONFIG="$HOME/.myapprc"
readonly SYSTEM_CONFIG="/etc/myapp.conf"
config_file_for_current_run=

find_config_file() {
  local candidate

  for candidate in "${MYAPP_CONFIG:-}" "$DEFAULT_CONFIG" "$SYSTEM_CONFIG"; do
    [[ -n ${candidate:-} && -f $candidate ]] || continue
    config_file_for_current_run=$candidate
    return 0
  done

  return 1
}

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

load_config_file() {
  local file=$1 line lineno=0 key value

  [[ -f $file ]] || die "Config is not a regular file: $file"

  while IFS= read -r line || [[ -n $line ]]; do
    ((lineno++))
    [[ $line =~ ^[[:space:]]*($|#) ]] && continue

    [[ $line =~ ^[[:space:]]*([A-Z_][A-Z0-9_]*)=(.*)$ ]] \
      || die "Sintaxe de config nao suportada em $file:$lineno"

    key=${BASH_REMATCH[1]}
    value=${BASH_REMATCH[2]}

    [[ ! $value =~ [\`\$\(\)\;\&\|\<\>] ]] \
      || die "Recusando sintaxe shell em $file:$lineno"

    value=${value##[[:space:]]}
    value=${value%$'\r'}

    if [[ $value =~ ^"(.*)"$ ]]; then
      value=${BASH_REMATCH[1]}
    elif [[ $value =~ ^\'(.*)\'$ ]]; then
      value=${BASH_REMATCH[1]}
    fi

    printf -v "$key" '%s' "$value"
    export "$key"
  done < "$file"
}

if find_config_file; then
  load_config_file "$config_file_for_current_run"
fi
```

Ele é rígido de propósito. Se alguém quiser array, objeto aninhado e meia dúzia
de regra de escape, melhor trocar de formato logo em vez de inventar uma mini
linguagem no shell.

Pra JSON, usa `jq`:

```bash
api_base_url=$(jq -er '.api_base_url' "$config_json")
concurrency=$(jq -er '.concurrency // 4' "$config_json")
```

Pra mim, costuma funcionar bem assim:

- arquivo de config pros defaults estáveis
- variável de ambiente pros overrides do deploy e pros segredos

## Logging e debug sem virar bagunça

Log bom em shell, pra mim, tem duas regras:

- humano lê em `stderr`
- dado da pipeline vai limpo em `stdout`

Misturou os dois, você transformou um script reutilizável num bicho irritante.

Uma camada simples já ajuda bastante:

```bash
LOG_LEVEL=${LOG_LEVEL:-info}
LOG_FILE=${LOG_FILE:-}

level_number() {
  case "$1" in
    debug) printf '10\n' ;;
    info)  printf '20\n' ;;
    warn)  printf '30\n' ;;
    error) printf '40\n' ;;
    *) return 1 ;;
  esac
}

log() {
  local level=${1:?missing log level}
  shift

  local current threshold ts line
  current=$(level_number "${level,,}") || return 1
  threshold=$(level_number "${LOG_LEVEL,,}") || threshold=20

  (( current < threshold )) && return 0

  printf -v ts '%(%Y-%m-%dT%H:%M:%S%z)T' -1
  printf -v line '%s %-5s %s' "$ts" "${level^^}" "$*"

  printf '%s\n' "$line" >&2
  [[ -n ${LOG_FILE:-} ]] && printf '%s\n' "$line" >> "$LOG_FILE"
}
```

Isso te dá nível, timestamp e arquivo de log sem sujar `stdout`. Quando eu quero
espelhar stream, ainda gosto de `tee`:

```bash
exec 2> >(tee -a "$LOG_FILE" >&2)
```

`set -x` ajuda, mas a saída crua costuma ser barulhenta demais. O truque abaixo
deixa o trace num descritor separado e com contexto que presta:

```bash
exec 9>>"${TRACE_FILE:-/tmp/report-sync.trace}"
export BASH_XTRACEFD=9
export PS4='+ ${BASH_SOURCE##*/}:${LINENO}:${FUNCNAME[0]:-main}: '

set -x
# bloco suspeito aqui
set +x
```

É o tipo de coisa que vale guardar porque economiza um bom tempo quando o script
começa a se comportar como se estivesse possuído.

## Testando script Bash como gente grande

Dá pra testar shell script, sim. E eu acho que vale bastante quando o script
começa a lidar com flag, config, arquivo ou efeito colateral.

Se for um scriptinho de 15 linhas em volta de um comando, talvez nem precise.
Agora, se ele apaga coisa, faz parsing e conversa com produção, eu prefiro ter
algum teste.

[`bats`](https://bats-core.readthedocs.io/en/latest/writing-tests.html) resolve
bem porque mantém tudo no ecossistema do shell.

Um teste útil, pro loader de config acima, seria algo assim:

```bash
#!/usr/bin/env bats

load '../lib/config.sh'

@test "load_config_file rejeita sintaxe shell em valores" {
  config="$BATS_TEST_TMPDIR/bad.conf"
  printf 'OUTPUT_FILE=$(touch /tmp/nope)\n' > "$config"

  run load_config_file "$config"

  [ "$status" -eq 1 ]
  [[ "$output" == *"Recusando sintaxe shell"* ]]
}
```

Esse teste protege uma fronteira importante: config tem que continuar sendo
dado.

Pra mockar comando externo, eu gosto do jeito simples: diretório temporário no
começo do `PATH` e executável falso lá dentro. Menos frágil do que tentar
inventar mágica com alias.

No fim, testabilidade em Bash costuma andar junto com design menos bagunçado.
Quando parsing, config e efeito colateral ficam separados em funções pequenas, o
teste deixa de ser castigo.

---

# Segurança e produção: onde Bash para de ser brincadeira

Quando o script começa a rodar em servidor, CI, container ou qualquer lugar com
entrada menos controlada, a história muda rápido. O que no notebook era só
"script útil" vira superfície de ataque sem pedir licença.

## As armadilhas de segurança

### Injeção de comando: o botão vermelho do `eval`

Se você monta comando a partir de entrada de usuário, está perigosamente perto
de entregar um shell de presente.

**O script vulnerável:**

```bash
#!/bin/bash
# "Visualizador simples" de logs - NAO USE ISSO
echo "Digite o nome do arquivo:"
read -r filename
eval "cat logs/$filename"
```

O atacante pode meter um `;`, um `$(...)` ou qualquer outra gracinha. E, às
vezes, nem precisa ser algo espalhafatoso pra causar estrago.

A correção não é "sanitizar melhor". A correção é parar de tratar dado como
código:

```bash
#!/bin/bash
read -r filename

# Valida: somente letras, numeros, traco, ponto e underscore
if [[ ! "$filename" =~ ^[a-zA-Z0-9._-]+$ ]]; then
    echo "Nome de arquivo invalido" >&2
    exit 1
fi

# Usa a variavel como DADO, nao como CODIGO
# Sem eval, sem expansao desprotegida, sem montar comando na mao
cat -- "logs/$filename"
```

O `--` evita interpretar nome como opção. O regex barra `../../etc/passwd` e
coisa parecida. Aqui a ideia é simples: cada camada corta um pedaço do problema.

Minha regra pessoal é: se bateu vontade de usar `eval`, eu paro e desconfio.
Quase sempre dá pra fazer melhor. Quando realmente precisar montar comando, usa
array:

```bash
cmd=(find "$directory" -name "*.log" -mtime +"$days")
"${cmd[@]}"
```

### Corrida com arquivo temporário: `mktemp` ou arrependimento

```bash
# VULNERAVEL: nome previsivel, condicao de corrida
tmpfile="/tmp/myapp-$$"
echo "$data" > "$tmpfile"
```

Esse padrão com PID no nome parece "único o bastante" até o dia em que alguém
cria um symlink ali antes de você. Aí o seu script grava dado onde não devia e a
brincadeira acaba.

**O padrão correto:**

```bash
#!/bin/bash
set -euo pipefail

tmpdir=$(mktemp -d "${TMPDIR:-/tmp}/myapp.XXXXXXXXXX")
trap 'rm -rf -- "$tmpdir"' EXIT

# Agora use $tmpdir com seguranca - aleatorio, dono voce, modo 0700
echo "$data" > "$tmpdir/output.txt"
```

`mktemp` cria de forma atômica e com permissão restritiva. O `trap` limpa
depois. E diretório temporário costuma ser mais prático do que arquivo
temporário solto.

### Segredos: o que NÃO fazer

```bash
# Tudo isso aqui esta errado:
PASSWORD="hunter2"                      # Hardcoded no codigo
curl -u "admin:$PASSWORD" "$url"        # Visivel em /proc/$pid/cmdline
echo "$SECRET" | docker login --stdin   # Melhor, mas cuidado com historico do shell
export DB_PASS="secret"                 # Herdado por TODO processo filho
```

Em shell, segredo espalha fácil demais. Vai pro histórico, vai pro `ps`, vai pro
ambiente do processo filho, vai parar onde você não queria.

Sempre que der, lê de arquivo/FD ou deixa a plataforma injetar só no momento do
uso:

```bash
# Le segredo de file descriptor, sem tocar disco nem aparecer em ps
db_password=$(< /run/secrets/db_password)
PGPASSWORD="$db_password" psql -h "$host" -U "$user" "$dbname" <<< "$query"
```

## Quando o Bash fica lento (e quando isso não importa)

Bash é muito melhor abrindo processo do que processando dado em loop apertado.
Quando o script fica lento, muitas vezes o problema é um festival de fork.

**A versão lenta**: 3 forks externos por iteração.

```bash
# Processando 10.000 linhas: ~45 segundos
while IFS= read -r line; do
    name=$(echo "$line" | cut -d',' -f1)
    value=$(echo "$line" | cut -d',' -f2)
    echo "$name: $value"
done < data.csv
```

**A versão rápida**: zero fork.

```bash
# Processando 10.000 linhas: ~0.3 segundos
while IFS=, read -r name value _rest; do
    printf '%s: %s\n' "$name" "$value"
done < data.csv
```

A diferença está aí: o primeiro exemplo cria processo demais. O segundo deixa o
shell fazer o que ele consegue fazer sem sair abrindo ferramenta externa em cada
linha.

Pra paralelismo de verdade, muitas vezes é melhor sair do loop manual:

```bash
# Processa arquivos em paralelo, 8 por vez
find . -name '*.log' -print0 | xargs -0 -P 8 -I{} gzip {}

# GNU parallel com barra de progresso
find . -name '*.csv' | parallel --bar -j+0 'process_file {}'
```

A regra prática que eu tento lembrar é: shell lento quase sempre tem loop com
fork demais.

## CI/CD: códigos de saída são sua API

CI é binário: saiu `0`, passou. Qualquer outra coisa, falhou. Então o script que
roda ali precisa ser bem honesto com código de saída:

```bash
#!/bin/bash
set -euo pipefail
```

Sem `pipefail`, o pipeline pode mascarar erro feio e o build passar com cara de
vencedor.

### ShellCheck no CI

ShellCheck no CI é um daqueles freios baratos que compensam muito:

```yaml
# .github/workflows/lint.yml
name: Shell Lint
on: [push, pull_request]
jobs:
  shellcheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run ShellCheck
        run: |
          find . -name '*.sh' -print0 | xargs -0 shellcheck --severity=warning
      - name: Run BATS tests
        run: |
          sudo apt-get install -y bats
          bats tests/
```

Com ShellCheck e algum teste em Bats, você já sobe bastante o nível do script.

## Docker: o problema do PID 1

Docker com shell tem uma pegadinha bem comum: PID 1. Se a sua app vira filha do
Bash e o Bash não repassa sinal direito, o container morre de forma feia.

**Um entrypoint decente pra produção:**

```bash
#!/bin/bash
set -euo pipefail

# --- Configuracao via ambiente ---
: "${APP_PORT:=8080}"
: "${APP_ENV:=production}"
: "${GRACEFUL_SHUTDOWN_TIMEOUT:=30}"

# --- Espera dependencias ---
wait_for_db() {
    local retries=30
    while ! pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -q; do
        retries=$((retries - 1))
        if [[ $retries -le 0 ]]; then
            echo "ERROR: Banco de dados indisponivel apos 30 tentativas" >&2
            exit 1
        fi
        sleep 1
    done
}

# --- Tratamento de sinais ---
shutdown_handler() {
    echo "Sinal de encerramento recebido, drenando conexoes..."
    # Da tempo pro load balancer remover a instancia
    sleep 2
    kill -TERM "$child_pid" 2>/dev/null || true
    wait "$child_pid"
    exit_code=$?
    echo "Aplicacao saiu com codigo $exit_code"
    exit "$exit_code"
}

trap shutdown_handler SIGTERM SIGINT

# --- Init ---
wait_for_db
echo "Iniciando app em :${APP_PORT} (env=${APP_ENV})"

# --- Launch: exec substitui o shell SE nao houver pos-processamento ---
# Quando voce precisa encaminhar sinais (como no tratador acima), NAO use exec.
# Em vez disso, jogue o processo para background e espere.
/usr/local/bin/myapp --port "$APP_PORT" &
child_pid=$!
wait "$child_pid"
```

O que eu tento guardar daqui:

- `exec` substitui o shell pelo processo final quando você não precisa de lógica
  extra.
- `background + wait` entra quando você realmente precisa interceptar sinal.
- Alpine não te dá Bash por padrão.
- `--init` com `tini` às vezes já resolve sem precisar reinventar nada.

## Padrões de deploy

### Publique do jeito certo

Pra script standalone, eu gosto de falhar cedo se a versão do Bash não for a
necessária:

```bash
#!/bin/bash
# Checagem de versao no topo - falha rapido, nao no meio do caminho
if [[ "${BASH_VERSINFO[0]}" -lt 4 ]]; then
    echo "ERROR: Bash 4+ obrigatorio (encontrado ${BASH_VERSION})" >&2
    exit 1
fi
```

### Idempotência ou nada

Script de produção roda de novo. Retry, cron, recuperação, operador apertando
seta pra cima sem querer pensar muito. Então idempotência ajuda bastante:

```bash
# Idempotente: cria so se nao existir
mkdir -p /opt/myapp/data
id -u appuser &>/dev/null || useradd -r -s /bin/false appuser

# Idempotente: move so se a origem existir
[[ -f "$src" ]] && mv -- "$src" "$dst"
```

### Quando parar de usar Bash

Bash é bom pra colar programa, mover arquivo, orquestrar etapa. Começa a ficar
ruim quando:

- você está parseando JSON/YAML o tempo todo
- você precisa de estrutura de dados de verdade
- o script cresce e ninguém mais quer encostar
- recovery de erro e concorrência viram parte do problema

Nessa hora, chamar Python ou Go não é derrota. Muitas vezes é só bom senso.

---

# Conclusão: script chato costuma ser o melhor script

Pra mim, evoluir em Bash tem menos a ver com decorar truque obscuro e mais com
entender onde o shell costuma mentir, omitir ou te dar corda pra se enforcar.

No meio desse artigo, a gente passou por várias dessas cascas de banana:

- erro que some no meio do caminho
- variável que morre em subshell
- `eval` querendo transformar dado em código
- loop lento porque cada linha abre processo demais
- PID 1 maltratado no container

Se eu tivesse que resumir tudo numa lista curta, seria mais ou menos isto:

- falha cedo
- coloca aspas onde precisa
- valida entrada antes de mexer no que não deve
- trata config como dado
- limpa temporário e processo auxiliar
- testa o que pode machucar

Bash bom, no fim, costuma ser meio sem graça. E isso é elogio.

Ele faz o trabalho, não inventa moda, não esconde erro e não tenta parecer uma
linguagem que ele não é. A parte interessante normalmente está nos programas que
ele orquestra. O shell é a cola.

Então, se eu puder te deixar com uma ideia só, é esta: tenta escrever script que
não surpreende você daqui a três meses.

Se funcionar no notebook, no CI, no container e ainda falhar de um jeito que dá
pra entender, já está muito bom.

Valeu.
