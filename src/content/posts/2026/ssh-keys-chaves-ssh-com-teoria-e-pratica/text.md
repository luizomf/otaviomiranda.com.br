---
title: 'SSH Keys: chaves SSH com teoria e prática'
description:
  'O caminho completo para usar chaves SSH sem mistério: OpenSSH,
  `authorized_keys`, `ssh-keygen`, permissões e `~/.ssh/config`.'
date: 2026-06-04T09:42:06-03:00
author: 'Otávio Miranda'
---

SSH é uma daquelas coisas que você usa todo dia, mas sem saber muito bem o que
está acontecendo por baixo dos panos. Eu mesmo, criava uma chave SSH uma única
vez e saia usando essa ela em todos os serviços do planeta.

É mais fácil fazer isso, e também funciona normal. Só que _ela é a única coisa
que impede alguém de acessar tudo o que você já criou na vida_. Então é melhor
separar uma chave por serviço do que perder tudo em uma única tacada.

Vou te explicar o suficiente para que você resolva a maioria dos problemas
relacionados com a chave SSH.

Dessa vez, quando servidor responder `Permission denied (publickey)` você vai
saber o motivo. Nos meus cursos essa é a dúvida número um, de longe.

## Em vídeo: Chaves ssh

O texto que você está lendo é baseado no vídeo: _**Chaves SSH: agora você vai
entender de verdade**_. Deixo o vídeo abaixo para acompanhar:

[![Chaves SSH: agora você vai entender de verdade](./images/ssh-keys-3.jpg)](https://youtu.be/Lf7846MlOkY)

- [youtu.be/Lf7846MlOkY](https://youtu.be/Lf7846MlOkY)

Se quiser continuar lendo, bora...

## Chave privada de um lado, chave pública do outro

No vídeo eu falei algo que gostei bastante: você pode imaginar as chaves SSH
como **_chave_** e _**fechadura**_.

### Chave SSH privada (private key)

A chave privada fica comigo (a `chave` na analogia). Ela é o arquivo que eu não
compartilho. Já a chave pública vai para o servidor, dentro de um arquivo que
normalmente se chama `authorized_keys` (a `fechadura` da analogia).

Quando tento entrar no servidor, o OpenSSH faz a conversa entre essas duas
partes. Se a minha chave privada combina com a chave pública que está autorizada
lá no servidor, a porta abre. Agora consigo logar sem digitar a senha do usuário
do servidor.

Autenticação por chave costuma ser o padrão mais desejável para servidor. E não
usamos chaves SSH _para não usar senhas_. É porque elas são muito mais seguras
do que usar senha por si só.

### Chave SSH pública (public key)

A chave pública foi feita para ser compartilhada. Você coloca essa chave no
GitHub, no GitLab, em um servidor, em uma ferramenta de deploy, ou entrega para
um administrador configurar acesso para você.

A regra é bem simples. Quando criamos chaves SSH, dois arquivos são gerados.
Você só toca no arquivo que termina com `.pub` (essa é a chave pública).

```txt
id_two      -> chave privada, fica com você
id_two.pub  -> chave pública, pode ir para o servidor
```

Se não tem `.pub`, deixa o arquivo quietinho lá no canto dele.

## OpenSSH tem cliente e servidor

SSH não é uma coisa só. Tem o cliente SSH e o servidor SSH.

O cliente é o programa que inicia a conexão. Quando você digita:

```bash
ssh usuario@10.0.0.3
```

Você está usando o cliente SSH da sua máquina.

O servidor é o serviço que fica escutando conexões do outro lado. No `OpenSSH`,
o servidor geralmente é o `sshd`, com `d` no final porque ele roda como
**_daemon_**.

Em uma máquina Linux baseada em Debian ou Ubuntu, por exemplo, a instalação
costuma ser algo nessa linha:

```bash
sudo apt install openssh-server openssh-client
```

Em uma máquina real, você pode ter os dois instalados. Ela pode se conectar em
outros servidores e também aceitar conexão de fora. Ela pode conectar até nela
mesma se você quiser. Às vezes faço isso para criar scripts uniformes, assim não
preciso saber se estou no `localhost` ou via rede.

No meu exemplo, usei dois containers Docker para simular isso: um container
chamado `one` e outro chamado `two`.

```txt
one -> cliente, tentando entrar no servidor
two -> servidor, aceitando conexão SSH
```

Depois eu inverto o caminho também, para mostrar que cada direção precisa da sua
própria autorização. Se `one` consegue entrar em `two`, isso não quer dizer
automaticamente que `two` consegue entrar em `one`.

## O servidor SSH e o hardening básico

O arquivo principal de configuração do servidor costuma ficar aqui:

```txt
/etc/ssh/sshd_config
```

Só que em muitas instalações modernas esse arquivo também carrega configurações
extras de um diretório:

```txt
/etc/ssh/sshd_config.d/*.conf
```

Isso é bom porque você não precisa mexer diretamente no arquivo grande do
sistema. Pode criar um arquivo próprio, por exemplo:

```txt
/etc/ssh/sshd_config.d/00-hardening.conf
```

Um detalhe importante: configuração de SSH é lida de cima para baixo. Dependendo
da diretiva, a primeira ocorrência pode ser a que vale. Por isso costumo colocar
arquivo começando com `00-` quando quero que ele entre cedo na ordem.

Um exemplo simples de configuração:

```conf
Port 22
ListenAddress 0.0.0.0

PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
PermitRootLogin no
```

`Port 22` é a porta padrão do SSH. Você pode mudar, mas mudar a porta sozinho
não é segurança forte.

Na verdade, isso é um mito que vem se propagando desde quando eu me entendo por
gente. Um fato até um pouco controverso, mas os bots já são inteligentes para
testar as portas mais usadas pelas pessoas, e elas são bem previsíveis. Mudar a
porta de `22` para `2222` não tem muito efeito prático e ainda atrapalha
serviços que esperam o servidor SSH na porta 22. Em resumo, é pior do que não
mudar.

`ListenAddress 0.0.0.0` diz para o servidor ouvir em todos os endereços IPv4
daquela máquina. Em ambiente real, talvez você queira restringir isso.

`PubkeyAuthentication yes` permite autenticação por chave pública. Eu
normalmente quero isso ligado.

`PasswordAuthentication no` desliga login por senha. Isso reduz bastante a
superfície para brute force. Se o servidor aceita senha e está exposto na
internet, alguém vai tentar adivinhar.

`PermitEmptyPasswords no` nem deveria precisar de explicação, mas precisa
existir porque sistema mal configurado acontece.

`PermitRootLogin no` impede login direto como `root`. Melhor entrar com um
usuário normal e usar `sudo` quando fizer sentido.

Existem outras opções de hardening, como TCP forwarding, X11 forwarding e afins.
Eu posso deixar certas coisas ligadas quando vou precisar delas em um cenário
específico, por exemplo SSH tunnels. Mas se não vou usar, prefiro fechar.

## SSH Toolkit por Otávio Miranda

Eu criei um site que pode te ajudar a configurar seu servidor SSH. Isso não é
publicidade e eu não ganho nada com isso. O site foi uma ferramenta criada para
o meu uso pessoal que coloquei gratuitamente no GitHub Pages.

Não há um servidor, ele renderiza direto no seu navegador e usa as APIs dele
para fazer o trabalho. (digo isso por questão de segurança)

Aqui está o link caso queira conferir:

- [SSH Toolkit - Otávio Miranda](https://sshtoolkit.otaviomiranda.com.br/)

Continuando...

## O primeiro erro esperado:

`Permission denied (publickey)` é a primeira coisa que você vai ver se tentar
entrar direto noutro server.

Imagine que o container `two` tem o servidor SSH rodando, aceita só chave
pública e está no IP `10.0.0.3`.

Do container `one`, eu tento:

```bash
# Estou em 10.0.0.2 (one)
ssh otavio@10.0.0.3
```

Na primeira conexão, o SSH pergunta se eu confio naquele host. Essa pergunta
aparece porque o cliente ainda não conhece a identidade do servidor. O dedo coça
para digitar `yes` sem ler, mas essa etapa existe para evitar ataque do tipo
"alguém se passando pelo servidor no meio da rede".

Confirmado o host, vem o erro:

```txt
Permission denied (publickey).
```

E está certo. O servidor só aceita chave pública, mas eu ainda não coloquei
nenhuma chave pública autorizada dentro dele. Do ponto de vista do servidor, eu
sou só alguém batendo na porta sem credencial válida.

## Preparando _~/.ssh_ e _authorized_keys_

Por padrão, as configurações do usuário ficam em:

```txt
~/.ssh
```

Esse diretório precisa ter permissões cuidadosas. Um padrão comum é `700`, onde
só o dono acessa:

```bash
install -d -m 700 -o "$(whoami)" -g "$(id -gn)" ~/.ssh
```

O comando `install` é útil porque cria diretório e já ajusta permissão, dono e
grupo. Daria para fazer com `mkdir`, `chmod` e `chown`, mas o `install` resolve
isso em uma linha.

No servidor, o arquivo que guarda as chaves públicas autorizadas geralmente é:

```txt
~/.ssh/authorized_keys
```

Você pode criar esse arquivo assim:

```bash
install -m 644 -o "$(whoami)" -g "$(id -gn)" /dev/null ~/.ssh/authorized_keys
```

Para `authorized_keys`, `644` costuma funcionar: o dono lê e escreve, grupo e
outros leem. Muita gente prefere deixar mais fechado, como `600`, e também está
tudo bem. O ponto é não deixar uma configuração relaxada demais, porque o
OpenSSH pode rejeitar acesso quando acha permissões inseguras.

## Gerando a chave com _ssh-keygen_

Agora eu preciso gerar a identidade no cliente. No exemplo, `one` vai se
conectar em `two`, então crio uma chave chamada `id_two`:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_two
```

`-t ed25519` escolhe o algoritmo da chave. Hoje é uma boa escolha para uso
comum.

`-f ~/.ssh/id_two` define onde a chave será salva. Eu gosto do prefixo `id_`
porque deixa claro que aquilo é um arquivo de identidade. O nome depois disso eu
escolho conforme o destino. Se a chave é para o servidor `two`, `id_two` é fácil
de entender daqui a seis meses.

Esse comando gera dois arquivos:

```txt
~/.ssh/id_two
~/.ssh/id_two.pub
```

O primeiro é a chave privada. O segundo é a chave pública.

Durante a geração, o `ssh-keygen` pergunta por uma passphrase. Ela é como uma
senha para abrir a chave privada. Se alguém copiar sua chave privada, ainda vai
precisar da passphrase para usar.

É considerado boa prática colocar passphrase nas chaves SSH. Eu sigo? Nope.
_Sorry_ sou igual a você!

Em alguns cenários eu prefiro gerar uma chave separada para cada serviço e
manter a automação mais simples, principalmente em ambiente controlado.

Mas é uma decisão com custo. Sem passphrase, a proteção fica muito mais
dependente da segurança do seu usuário, da sua máquina e dos backups onde essa
chave possa parar. Nem dá pra falar que isso é um custo calculado, porque hoje
em dia um agente poderia exfiltrar todos os seus dados e pronto, já era!

Para ver a chave pública:

```bash
cat ~/.ssh/id_two.pub
```

É esse conteúdo que vai para o servidor inteiro que apareceu na tela vai no
arquivo `~/.ssh/authorized_keys` do servidor.

## Colocando a chave pública no servidor

No servidor `two`, a chave pública do cliente `one` precisa entrar em:

```txt
~/.ssh/authorized_keys
```

Em um exemplo manual, dá para fazer assim:

```bash
echo "ssh-ed25519 AAAA... otavio@one" >> ~/.ssh/authorized_keys
```

Em uso real, você pode copiar com `ssh-copy-id`, colar pelo painel do provedor,
entregar para quem administra o servidor ou usar uma automação. O mecanismo é o
mesmo: a chave pública fica listada em `authorized_keys`. No meu caso aqui, não
tinha como porque eu não estava permitindo uso de senhas no servidor.

Vou te dar uma breve explicação para entender melhor em uma _"lista mental"_:

1. Eu preciso colocar a chave pública que tenho no servidor;
2. Para isso, preciso acessar o servidor;
3. O único método de autenticação ativo no servidor é:
   `PubkeyAuthentication yes`;
4. Mas eu não tenho chave configurada nele ainda;
5. Eu preciso colocar a chave... Isso viraria um loop infinito.

O único método para acessar o servidor é indo nele fisicamente. Em alguns
provedores, o terminal oferecido é conectador diretamente ao servidor. Seria
equivalente a acessar o servidor diretamente, então dá pra seguir da mesma forma
que estou te explicando.

Depois disso, o cliente pode tentar de novo, agora dizendo explicitamente qual
identidade usar:

```bash
ssh -i ~/.ssh/id_two otavio@10.0.0.3
```

O `-i` passa o `IdentityFile`, ou seja, o arquivo de identidade usado naquela
conexão. Aqui é importante: eu passo a chave privada, não a `.pub`.

Se a chave pública correspondente estiver no `authorized_keys` do servidor, a
conexão entra.

## A direção contrária precisa de outra chave

Agora vem uma parte que parece detalhe, mas ajuda muito a entender o modelo.

Se `one` acessa `two`, isso só prova que `two` confia na chave pública de `one`.
Para `two` acessar `one`, eu preciso fazer a configuração inversa.

No `two`, gero uma chave para acessar `one`:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_one
```

Depois copio a chave pública:

```bash
cat ~/.ssh/id_one.pub
```

E coloco essa chave pública no `authorized_keys` do `one`.

A conexão de `two` para `one` fica assim:

```bash
ssh -i ~/.ssh/id_one otavio@10.0.0.2
```

Repara no desenho mental:

```txt
one tem id_two privada
two tem id_two.pub em authorized_keys

two tem id_1 privada
one tem id_1.pub em authorized_keys
```

Cada lado tem sua chave privada. Cada servidor guarda as chaves públicas de quem
pode entrar nele.

## Limpando o comando com _~/.ssh/config_

Digitar isso toda hora é chato:

```bash
ssh -i ~/.ssh/id_two otavio@10.0.0.3
```

Por isso existe o arquivo de configuração do cliente:

```txt
~/.ssh/config
```

Esse arquivo não é do servidor. Ele fica na máquina que inicia a conexão. Nele
eu posso criar um apelido para o host:

```ssh_config
Host two
    HostName 10.0.0.3
    User otavio
    Port 22
    IdentityFile ~/.ssh/id_two
    IdentitiesOnly yes
```

Com isso, a conexão vira:

```bash
ssh two
```

Bem melhor.

Cada diretiva tem um papel:

`Host two` cria o apelido que eu vou digitar no comando.

`HostName 10.0.0.3` aponta para o IP ou domínio real.

`User otavio` define o usuário remoto.

`Port 22` define a porta.

`IdentityFile ~/.ssh/id_two` diz qual chave privada usar.

`IdentitiesOnly yes` manda o SSH usar só aquela identidade para esse host.

Esse último item parece frescura até você ter várias chaves configuradas. O
cliente SSH pode tentar identidades em ordem. Dependendo do servidor e da
configuração, ele pode estourar o limite de tentativas antes de chegar na chave
certa. Quando eu coloco `IdentitiesOnly yes`, eu corto esse problema: para o
host `two`, use `id_two` e pronto.

Do outro lado, no `two`, eu poderia criar uma configuração parecida para entrar
no `one`:

```ssh_config
Host one
    HostName 10.0.0.2
    User otavio
    Port 22
    IdentityFile ~/.ssh/id_one
    IdentitiesOnly yes
```

Então as conexões ficam naturais:

```bash
ssh two
ssh one
```

## Uma organização simples que evita dor de cabeça

O que eu tento manter no dia a dia é uma organização previsível:

```txt
~/.ssh/
  config
  id_github
  id_github.pub
  id_producao
  id_producao.pub
  id_vps_cliente_x
  id_vps_cliente_x.pub
  authorized_keys
```

Não precisa usar exatamente esses nomes. O importante é não tratar chave SSH
como um arquivo mágico que você gerou uma vez e nunca mais pensou.

Para cada serviço sensível, eu prefiro ter uma chave própria. Se algum acesso
precisa ser revogado, removo aquela chave pública do lugar onde ela foi
autorizada. Se uma chave vaza, o estrago fica mais limitado do que usar a mesma
chave para tudo.

Também vale lembrar: se você desliga `PasswordAuthentication`, teste a conexão
por chave antes de fechar sua sessão atual no servidor. Parece conselho bobo até
você se trancar para fora da própria máquina.

## Recapitulando

SSH por chave fica bem menos misterioso quando você separa as peças:

A chave privada fica no cliente e não deve sair dali.

A chave pública vai para o servidor, normalmente em `~/.ssh/authorized_keys`.

O servidor OpenSSH é configurado em `/etc/ssh/sshd_config` e pode carregar
arquivos em `/etc/ssh/sshd_config.d/*.conf`.

Autenticação por chave pública costuma ser o caminho certo. Autenticação por
senha em servidor exposto merece cuidado.

`ssh-keygen -t ed25519 -f ~/.ssh/id_two` gera uma identidade para um destino
específico.

`ssh -i ~/.ssh/id_two usuario@host` força o uso daquela chave.

`~/.ssh/config` transforma comandos longos em aliases como `ssh two`.

E `IdentitiesOnly yes` ajuda quando você tem várias chaves e quer que o SSH pare
de tentar tudo que encontra pela frente.

Se você trabalha com servidor, deploy, Git, tunnel, VPS ou qualquer automação
que passa por SSH, entender isso economiza tempo e evita gambiarra perigosa.

E pronto, terminamos. Se você chegou até aqui, parabéns. Tamo junto e até o
próximo.
