---
title: 'SSH ProxyJump Muda Completamente a Segurança da Rede Privada'
description:
  'Aprenda a usar o SSH ProxyJump e um Jump Server (Bastion Host) pra acessar
  servidores internos sem expor SSH na internet: -J, ~/.ssh/config e a config de
  produção completa do usuário de salto.'
date: 2026-06-11T22:11:00-03:00
author: 'Otávio Miranda'
---

Aprenda a usar o SSH ProxyJump e um Jump Server (Bastion Host) pra acessar
servidores internos sem expor SSH na internet: `-J`, `~/.ssh/config` e a config
de produção completa do usuário de salto.

> Este artigo é um complemento ao vídeo abaixo.

[![Vídeo sobre: SSH ProxyJump Muda Completamente a Segurança da Rede Privada](./images/ssh-trampolim-black.jpg)](https://youtu.be/UJuu_I5ohFY)

Vídeo: [youtu.be/UJuu_I5ohFY](https://youtu.be/UJuu_I5ohFY)

## Quando a rede cresce

Quando a sua rede começa a crescer, é super normal ter mais de um servidor. Base
de dados, load balancer, cache e assim vai.

Só que antes de sair abrindo SSH público em cada servidor só pra conseguir
administrar essa rede inteira, talvez seja melhor entender como funciona o SSH
ProxyJump e o Jump Server (ou Bastion Host).

A ideia até que é simples: você mantém um único ponto de entrada na rede e usa
esse ponto pra chegar nos servidores que ficam atrás dele.

Mas é bom ter um modelo mental da arquitetura e da segurança antes de sair
digitando comando, pra não cometer uns "_errinhos besta_" e acabar expondo coisa
que não precisava ficar exposta. Eu mesmo já cometi um desses errinhos e quase
precisei visitar um servidor pessoalmente. Conto essa história mais pra frente
😅.

E o melhor: quando esse modelo mental encaixa bonitinho, os comandos e
configurações ficam bem mais simples do que parecem.

## O problema

Esse é um problema que talvez você ainda nem enxergue, principalmente se você só
tem um servidor. Mas uma hora ou outra a rede cresce e você acaba adicionando
mais máquinas.

Então vamos pegar um exemplo pequeno: a minha máquina local e dois servidores em
algum cloud provider qualquer. O SSH dos dois servidores está exposto direto na
internet, porta 22 de cara pro mundo.

Eu não tenho tanto problema com isso assim, até porque eu faço a configuração
mais restritiva possível nos meus servidores. Mas, mesmo assim, eu tenho certeza
absoluta de que estou deixando passar alguma falha que ninguém descobriu ainda.
Pode ser que essa falha esteja até no Kernel do Linux em si.

Como esses servidores estão de cara pra internet, eu preciso ficar de olho neles
pra corrigir problemas de segurança antes que alguém descubra primeiro e faça
algo que eu não queira.

Agora adicione um terceiro, um quarto, um quinto servidor. Essa preocupação se
multiplica pela quantidade de servidores que você tem.

E aqui estamos falando só de "servidor". Se você trocar essa palavra por "rede",
a coisa passa a fazer muito mais sentido.

Não seria melhor não expor o SSH da rede interna inteira pra internet? Deixar um
único ponto de entrada e concentrar toda a segurança mais restritiva possível
nesse único ponto?

Esse ponto de entrada vira o "_porteiro_" da rede. Ele verifica coisas
importantes em cada tentativa de acesso: "Quem é você?", "Você tem autorização
pra entrar aqui?", "Você pode ir no setor que está solicitando?".

A boa notícia: esse é exatamente o padrão que vamos montar neste post.

## Jump Server, Bastion Host, trampolim

Eu vou chamar esse servidor de _jump server_ no post todo, mas você também vai
encontrar por aí como _jump host_, _jump box_, _bastion host_... ou trampolim
mesmo.

Guarde o conceito: essa máquina do meio, exposta na internet, é o que te joga
pra dentro da rede interna. Ponto!

No OpenSSH, quando você passa por essa máquina do meio usando a flag `-J`, isso
é chamado de **ProxyJump**. Mais um nome pra lembrar.

E o que acontece por baixo quando você roda um `ssh -J`?

1. Seu cliente SSH faz a autenticação no jump server.
2. Se autenticar, ele pede um encaminhamento TCP pra algum servidor de destino
   da rede interna.
3. O jump server verifica se o seu usuário pode fazer esse tipo de
   encaminhamento TCP e, se puder, abre o túnel.
4. A conversa entre o cliente e o servidor final acontece de ponta a ponta, por
   dentro desse túnel TCP.

Um detalhe importante: **a autenticação acontece nos dois pontos**. Isso
significa que o acesso por chave precisa estar configurado no jump server e no
servidor de destino.

Se chave SSH ainda é um assunto nebuloso pra você, eu fiz um vídeo só sobre
isso:

- [SSH na prática: o guia definitivo que ninguém te ensinou](https://youtu.be/Lf7846MlOkY)

Resumindo em português claro: o jump server é um trampolim de verdade. A ideia é
ter só ele de cara pra internet, e ele te impulsiona pro lado interno da rede.

Agora vamos ver isso funcionando de verdade.

## Na prática: kvm2 e kvm4

Chega de exemplo fictício. Eu tenho alguns computadores na minha rede local e
vários servidores VPS na Hostinger. Pra esse exemplo vou usar só dois deles: o
`kvm2` e o `kvm4` (sim, eu batizo os servidores com o nome do plano, zero
criatividade e 100% de clareza).

E como você já deve ter sentido isso chegando, aqui vai o plug sem vergonha da
minha parceira. Se precisar de um servidor VPS, use o meu link e cupom para
desconto:

- [hostinger.com/otaviomiranda](https://hostinger.com/otaviomiranda)
- Cupom: `OTAVIOMIRANDA` (10% de desconto)

Na dúvida, pega o `kvm2`, que é o mais popular por ser o melhor custo benefício.
O cupom acumula com as promoções de época.

Voltando ao assunto. A topologia é essa:

```text
minha máquina (cliente)  ──►  kvm2 (bastion, público)  ──►  kvm4 (interno)
```

- O `kvm2` é o jump server. É o único que aceita SSH vindo da minha máquina.
- O `kvm4` é o destino "interno". O firewall dele (`ufw`) está com
  `Default: deny (incoming)` e uma única regra de `ALLOW IN`: o IP do `kvm2`.

Ou seja: da minha máquina, o `kvm4` **recusa** conexão direta. Eu não consigo
simplesmente dar um `ssh kvm4` e esperar que funcione. O único ponto que eu
alcanço do outro lado é o `kvm2`. E o `kvm2`, esse sim, enxerga o `kvm4`.

Nessa situação, o `kvm2` pode ser usado como jump server pra jogar a minha
conexão até o `kvm4`. E, dependendo da configuração do `sshd` no `kvm2`, isso é
a coisa mais simples do planeta:

```bash
# Da minha máquina
ssh -J kvm2 kvm4
# otavio@kvm4:~$
```

Parece que não aconteceu nada, né? Mas só nesse comando o meu cliente SSH já:

- Autenticou no `kvm2` usando as minhas chaves SSH
- Pediu a ele pra abrir um túnel TCP pro `kvm4`
- Passou por dentro do túnel e fez autenticação no `kvm4`

A partir de agora, toda a comunicação acontece por dentro desse túnel. O `kvm4`
continua invisível pra internet, e mesmo assim eu estou logado nele.

## AllowTcpForwarding e PermitOpen

Uma palavra rápida sobre a configuração do `sshd` no servidor que vai ser o jump
server.

Se você já seguiu aquele hardening que eu mostro no meu guia de deploy de VPS (o
[DEV_GUIDE do meu template](https://github.com/luizomf/vps_deploy_template/blob/main/DEV_GUIDE.md)),
seu servidor está com `AllowTcpForwarding no` e `PermitOpen none`.

Isso bloqueia justamente o **TCP Forwarding** que o jump server precisa fazer
pra encaminhar a conexão. Com essa config, o `-J` não funciona.

Pra funcionar, você precisa de `AllowTcpForwarding local` e de um `PermitOpen`
liberando o destino. Só que abrir isso globalmente, com `AllowTcpForwarding yes`
e `PermitOpen any`, é muito aberto pra um servidor desse nível de importância.

O jeito certo não é afrouxar o servidor inteiro. É criar um usuário dedicado só
pra salto e aplicar a regra só nele, com `Match User`.

Esse usuário de salto é uma **catraca**: ele nem shell tem, não loga, não abre
sessão. Só serve pra encaminhar a conexão pro destino que você liberou. O ponto
de entrada não é uma conta usável, é um portão.

A receita completa dessa catraca, testada em produção, está logo abaixo. Mas
antes deixa eu fechar o lado do cliente, porque ainda tem um incômodo grande
ali.

## Dá pra encadear quantos saltos você quiser

Primeira pergunta que aparece: e se a rede tiver mais de uma camada? Dá pra
encadear salto? Dá. E é mais simples do que parece, é só ir separando os jump
servers por vírgula:

```bash
ssh -J bastion1,bastion2,bastion3 destino
```

O SSH vai pulando de um pro outro, na ordem, até chegar no destino.

Agora deixa eu te mostrar o tamanho do problema que esse `-J` resolve sem você
nem perceber. Antes de existir esse atalho (ou se você simplesmente não soubesse
dele), como é que você faria esse caminho na mão? Abriria um SSH, de dentro dele
abriria outro, de dentro desse outro... uma corrente manual, mais ou menos
assim:

```bash
ssh joazinho@bastion1 -i ~/.ssh/id_bastion1
ssh joazinho@bastion2 -i ~/.ssh/id_bastion2
ssh joazinho@bastion3 -i ~/.ssh/id_bastion3
ssh joazinho@destino  -i ~/.ssh/id_destino
```

Repara que pesadelo: pra cada salto você loga de novo e tem que lembrar qual
chave usa em cada máquina. Todo santo dia, várias vezes por dia. (Esse `-i` aí é
só pra ilustrar a dor de gerenciar uma chave por servidor.)

O `-J` colapsa essa corrente inteira numa linha só. Bem melhor.

Mas ainda sobrou um incômodo, e esse é o pior pro dia a dia: você teria que
digitar esse comando comprido **toda vez**. Pra cada máquina. Decorar host,
ordem dos saltos, qual é o destino... Não tem como ser esse o jeito final.

## A virada: `~/.ssh/config`

E não é. É aqui que entra o `~/.ssh/config`.

Esse arquivo é onde o SSH lê as suas preferências de conexão. Em vez de repetir
tudo na linha de comando, você escreve uma vez só: dá um nome pro destino e diz
qual é o jump server dele.

Voltando pro exemplo real, do `kvm2` pro `kvm4`:

```ssh_config
# ~/.ssh/config na minha máquina
Host kvm4
  ProxyJump kvm2
```

Pronto. A partir de agora, no lugar daquele `ssh -J kvm2 kvm4`, eu dou só:

```bash
ssh kvm4
```

E funciona. Oito caracteres, pode contar.

O salto sumiu da minha frente. Ele continua acontecendo, mas fica escondido no
config. Eu passo a usar o `kvm4` como se ele estivesse no caminho normal do SSH,
que era exatamente a ideia lá do começo: o servidor interno acessível, mas sem
nunca estar exposto direto na internet.

E se fossem vários saltos? Mesma ideia: o `ProxyJump` também aceita a corrente
separada por vírgula, ou você vai encadeando um `Host` no outro. O ponto é que
você configura uma vez e nunca mais digita o caminho.

## Quem mais herda esse salto

E tem um bônus que, pra mim, é a melhor parte de tudo isso.

Como o caminho agora mora no `~/.ssh/config`, tudo que lê esse arquivo herda o
salto de graça, sem você configurar mais nada.

O `scp`, o `rsync`, o `sftp`: todos passam a chegar no `kvm4` pelo `kvm2`
automaticamente. (Um detalhe honesto: versões mais antigas de algumas dessas
ferramentas lidam com o `ProxyJump` de um jeito diferente. Se não funcionar de
primeira, confere a versão.)

E a que eu acho mais legal: o VS Code com o Remote-SSH. Ele lê o mesmo
`~/.ssh/config`, então eu abro o `kvm4` e edito os arquivos como se fossem
locais, passando pelo salto sem nem pensar nisso.

Agora, nem tudo herda, e é importante ser honesto aqui. O Claude Code, por
exemplo, não suporta esse proxy. Com ele, do jeito que está, não vai funcionar.
E essa é a real: alguns programas entendem o ssh config, outros não. A dica
honesta é simples: **testa o teu caso**. Se a ferramenta lê o `~/.ssh/config`, é
bem provável que o salto venha junto de brinde.

## Jump server de produção: a catraca

Agora a parte que, pra mim, é a mais importante: como esse jump server fica
quando é pra valer, em produção.

Como eu disse, eu não afrouxaria o servidor inteiro. Eu criaria um usuário
dedicado só pra salto, aquela catraca que nem shell tem:

```bash
sudo useradd -m -s /usr/sbin/nologin jumper
sudo passwd -l jumper
```

No vídeo eu comento a ideia de colocar uma senha inútil, criada para nunca ser
usada. Aqui no artigo eu prefiro deixar o caminho mais explícito: crio o usuário
sem shell, travo a senha com `passwd -l` e libero só a chave pública no
`authorized_keys`.

E no `sshd_config` eu travaria tudo nesse usuário com `Match User`, liberando só
o TCP Forwarding pro destino certo:

```ssh_config
Match User jumper
  AllowTcpForwarding local
  PermitOpen kvm4:22
  MaxSessions 0
  ForceCommand /usr/sbin/nologin
```

O `nologin` no shell mais o `ForceCommand /usr/sbin/nologin` garantem que esse
usuário nunca abre uma sessão de verdade, nem com acesso direto ao servidor. Ele
só existe pra saltar pro destino que o `PermitOpen` libera.

### Cuidado (história real)

E um aviso pra você não fazer como eu fiz.

Em algum momento eu apliquei essas configurações no meu próprio usuário. Só
tinha esquecido de um detalhe: eu precisava acessar o servidor com o mesmo SSH
que eu tinha acabado de bloquear. O resultado? Quase tive que ir fisicamente no
servidor. Me salvou o painel do provedor, que tem console de emergência.

Então: aplique isso num usuário dedicado, **nunca** no seu usuário admin. E,
sempre que mexer em `sshd_config` remoto, mantenha uma sessão aberta e um
console de emergência à mão antes de testar.

### Funcionando

Com a catraca aplicada, o comportamento fica exatamente como deveria. Eu não
consigo abrir uma sessão no `kvm2` com o usuário de salto:

```bash
otavio@minha-maquina:~$ ssh jumper@kvm2
channel 0: open failed: connect failed: open failed
Connection closed.
```

Mas eu continuo passando por ele pra chegar no `kvm4`:

```bash
otavio@minha-maquina:~$ ssh -J kvm2 kvm4
otavio@kvm4:~$
```

Olha que beleza: o jump server está endurecido, o usuário de salto não loga em
lugar nenhum, e mesmo assim o `-J` passa. Catraca fechada pra sessão, aberta só
pro salto.

## Apêndice: hardening completo do bastion

Essa é a configuração completa do meu bastion real, comentada linha por linha. A
lógica dela: **default-deny global** (nega tudo pra todo mundo) e o
`Match User jumper` reabrindo só o salto. Tudo que o `Match` não menciona herda
os "no" globais.

```ssh_config
# /etc/ssh/sshd_config.d/01_sshd_settings.conf

# --- Autenticação: só chave, nada de senha ---

# Login por chave pública ligado
PubkeyAuthentication yes
# Login por senha desligado
PasswordAuthentication no
# Sem prompts interativos de teclado (OTP etc.)
KbdInteractiveAuthentication no
# Nome legado da opção acima (compatibilidade)
ChallengeResponseAuthentication no
# Root nunca loga direto por SSH
PermitRootLogin no
# Conta com senha vazia nunca autentica
PermitEmptyPasswords no
# Autentica sem passar pelo PAM (menos superfície; ok porque é só chave)
UsePAM no
# Exige chave explicitamente, e nada mais
AuthenticationMethods publickey

# --- Sessão: sem extras ---

# Usuário não injeta variáveis de ambiente no login
PermitUserEnvironment no
# Não executa o ~/.ssh/rc do usuário
PermitUserRC no
# Sem encaminhamento de GUI/X11
X11Forwarding no

# --- Forwarding: default-deny total (a catraca depende disso) ---

# Túnel TCP negado pra todo mundo
AllowTcpForwarding no
# Nenhum destino de forward liberado
PermitOpen none
# Forward de socket Unix também negado (o PermitOpen NÃO cobre socket)
AllowStreamLocalForwarding no
# ssh-agent do cliente não é repassado pro servidor
AllowAgentForwarding no
# Ninguém abre porta de escuta no bastion via -R
PermitListen none
# Porta remota nunca é exposta pra fora do localhost
GatewayPorts no
# Sem VPN via interface tun/tap
PermitTunnel no

# --- Ruído e limites ---

# Sem mensagem do dia no login
PrintMotd no
# Sem banner de "last login"
PrintLastLog no
# Até 4 tentativas de autenticação por conexão
MaxAuthTries 4
# 30s pra completar o login, senão derruba
LoginGraceTime 30
# Ping de keepalive a cada 300s...
ClientAliveInterval 300
# ...e 2 sem resposta derrubam a conexão (~10min de silêncio)
ClientAliveCountMax 2
# Sem reverse-DNS no login (mais rápido)
UseDNS no

# --- A catraca: reabre SÓ o salto; todo o resto herda os "no" globais ---

Match User jumper
  # Reabre só forward local (o direct-tcpip que o -J usa)
  AllowTcpForwarding local
  # E só pra esse destino:porta — string exata que o cliente pede;
  # quem resolve o nome "kvm4" é o próprio bastion (hosts/DNS interno)
  PermitOpen kvm4:22
  # Zero sessões: nem shell, nem exec, nem sftp (mata X11/agent junto)
  MaxSessions 0
  # Cinto e suspensório: se alguma sessão abrisse, cai no nologin
  ForceCommand /usr/sbin/nologin

# --- Usuário admin: forwarding livre ---

Match User <seu_usuario_admin>
  AllowTcpForwarding yes
  PermitOpen any
```

### O detalhe do `PermitOpen` que vai te economizar um debug

O `PermitOpen` casa com a **string** que o cliente pede, sem resolver DNS na
hora do match. Isso tem duas consequências práticas:

1. A string que o seu cliente pede e a string do `PermitOpen` precisam ser
   **idênticas**. Se o seu `~/.ssh/config` local tem um `HostName` diferente do
   que está no `PermitOpen` do bastion, o match falha e você ganha um
   `open failed` confuso, mesmo com tudo "certo".
2. Quem resolve o nome é o **bastion**, do lado dele (via `/etc/hosts` ou DNS
   interno). Eu testei isso no meu servidor real: `PermitOpen kvm4:22`, com o
   alias puro, funciona. O IP e o domínio do destino nem precisam existir no
   arquivo, o que de quebra evita documentar de graça a topologia interna da sua
   rede.

### Uma nota honesta sobre o admin

Restringir forwarding de quem **tem** shell é cosmético: com shell, o usuário
faz o que quiser de qualquer jeito. A catraca só funciona porque o `jumper`
**não tem** shell. Por isso o admin pode ter `PermitOpen any` sem hipocrisia: a
segurança dele é a chave, não o forwarding.

## Links úteis

- [SSH na prática: o guia definitivo que ninguém te ensinou](https://youtu.be/Lf7846MlOkY)
- [DEV_GUIDE do meu template de deploy de VPS](https://github.com/luizomf/vps_deploy_template/blob/main/DEV_GUIDE.md)
- [OpenSSH: `ssh_config`](https://man.openbsd.org/ssh_config)
- [OpenSSH: `sshd_config`](https://man.openbsd.org/sshd_config)
- [OpenSSH: `ssh`](https://man.openbsd.org/ssh) (procure por `-J`)
- [Hostinger (parceira do canal)](https://hostinger.com/otaviomiranda), cupom
  `OTAVIOMIRANDA`

## Pra finalizar

Olha o caminho que a gente fez: saímos de "abrir SSH público em cada servidor",
entendemos o jump server como único ponto de entrada, fizemos o primeiro salto
com o `-J`, salvamos tudo no `~/.ssh/config` pra dar só `ssh kvm4`, e travamos
esse ponto de entrada como um portão de verdade. Tudo isso sem nunca expor o
`kvm4` direto pra internet.

Só pra ser honesto e não te vender ilusão: mesmo travado desse jeito, o
ProxyJump **muda o caminho de acesso e reduz a exposição** da rede. Ele não é um
sistema de segurança completo. Firewall, hardening e chave bem configurada
continuam valendo. Ele organiza por onde você entra; não substitui o resto.

E se você quiser ir ainda além: dá pra colocar um login social, tipo GitHub ou
Google, na frente desse acesso, gerenciando as conexões via PAM. Mas isso é papo
pra um próximo post (ou vídeo, quem sabe 👀).

Agora vai lá testar o salto. Só não esquece da sessão aberta e do console de
emergência antes de mexer no `sshd_config`... eu avisei.
