---
title: 'SSH Tunnels: o canivete suíço que você não está usando'
description:
  'Aprenda SSH Tunnels na prática: Local -L, Remote -R e Dynamic -D. Acesse
  serviços remotos, exponha portas locais e crie proxies SOCKS com um comando.'
date: 2026-03-21
author: 'Otávio Miranda'
---

Aproveitando o embalo do meu último conteúdo sobre
[VPN com o WireGuard](/2026/vpn-com-wireguard-o-guia-definitivo/), hoje trago o
seu primo minimalista: SSH Tunnels na prática. Vamos ver um túnel local com -L,
remoto com -R e dinâmico com -D.

![SSH Tunnel Cover](./images/ssh-tunnels-1.jpg)

Depois dessa, você vai conseguir acessar o seu computador da Internet para
dentro da sua rede local (mesmo com NAT ou firewall), simular que você está no
servidor remoto mesmo estando dentro do seu quarto e, de quebra, ainda vai criar
um servidor proxy SOCKS. Tudo via SSH.

Nesse texto, vou assumir que você já tem uma conexão SSH com um servidor
qualquer. Não precisar ser um servidor com IP real, mas vai ser muito mais legal
se for 😈.

---

## O que é um SSH Tunnel?

Que você usa SSH para acessar o terminal de outra máquina todo mundo já sabe. O
que pouca gente te ensina é que aquele mesmo canal criptografado pode carregar
**outro tipo de tráfego**.

E se você parar para pensar, tudo começa a fazer mais sentido. O túnel já está
aberto e seguro, que tal aproveitar a oportunidade para enfiar uma conexão com
banco de dados, uma requisição HTTP ou qualquer coisa que use TCP?

O SSH suporta três tipos de _tunnel_:

**Local** `-L` - Esse é o cara que abre uma porta na sua máquina e redireciona
para o servidor. Com ele você poderia fazer algo assim: _"Quando alguém acessar
a porta 4321 na minha máquina local, redirecione para a porta 5432 no servidor
SSH"_. E, magicamente, ao usar `localhost:4321`, você recebe um PostgreSQL como
se estivesse lá no servidor.

**Remote** `-R` - Esse aqui já vai furar o seu NAT ou firewall com vontade. A
conexão vem de fora para dentro, por isso tende a confundir as pessoas. Quando
você precisa que o seu computador local entregue algo na Internet, seu firewall
ou NAT não vão permitir que essa conexão aconteça. O _SSH Tunnel Remote (-R)_
consegue enviar algo que chega em uma porta no seu servidor para dentro da sua
conexão. Novamente acontece a mágica: alguém acessa a porta 8000 no servidor e o
SSH chama o seu computador local na porta 3000.

**Dynamic** `-D` - Cria um proxy SOCKS onde você o executar. O que souber usar
este proxy vai mandar tudo por SSH. Quando eu configuro o proxy no macOS em uma
conexão de rede, tudo que usar essa conexão passa a sair pelo proxy.

Vamos ver cada um.

---

## sshd_config

Estou reescrevendo isso depois de ter terminado o artigo inteiro. Eu havia
espalhado essas configurações pelo texto, mas julguei melhor adicionar tudo
junto antes de você começar.

Abra o seu arquivo de configuração do servidor SSH. No meu caso é o:

```bash
# No Ubuntu Server 24
/etc/ssh/sshd_config.d/01_sshd_settings.conf
# No MacOS (porque mexi no arquivo original ao invés dos includes)
/etc/ssh/ssh_config
```

Tenha certeza que essas configurações estão assim:

```ssh-config
# SSH tunnels (-L, -R, -D)
AllowTcpForwarding yes
PermitOpen any
PermitListen any
GatewayPorts yes
```

Se não existirem, pode copiar o trecho acima e colar no seu arquivo de
configuração. Depois reinicie o servidor SSH.

```bash
sudo systemctl restart ssh # ou sshd
```

Não vem tanto ao caso, mas o meu arquivo completo (com hardening) está assim e o
resto é padrão:

```ssh-config
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
PermitRootLogin no
PermitEmptyPasswords no
UsePAM yes
AuthenticationMethods publickey
PermitUserEnvironment no
PermitUserRC no
X11Forwarding no
AllowStreamLocalForwarding no
AllowAgentForwarding no
PermitTunnel no
MaxAuthTries 4
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
PrintMotd no
UseDNS no

# SSH tunnels (-L, -R, -D)
AllowTcpForwarding yes
PermitOpen any
PermitListen any
GatewayPorts yes
```

---

## Local Forward (`-L`): "trago a porta de lá pra cá"

Esse é o mais simples. Você abre uma porta na **sua máquina** e tudo que chegar
nela é encaminhado, pelo túnel SSH, para um destino do outro lado. O resultado é
que, ao acessar essa porta, quem responde é o servidor.

![Local Forward -L trago a porta de lá pra cá](./images/diagram-l.jpg)

> Todos os diagramas estão
> [aqui \(via excalidraw\)](https://excalidraw.com/#json=pZCWitiR0Byu9xrH4Ct3D,yQJRrX-QjT4rDzTaAs5mBA).

**A sintaxe**

```bash
# <porta_local> encaminha para <destino:porta_destino> em <user@servidor>
ssh -L <porta_local>:<destino:porta_destino> <user@servidor>
```

**Fluxo**

```
sua_máquina:porta_local -> túnel SSH -> servidor -> destino:porta_destino
```

**Na prática**

Você tem um VPS e subiu um servidorzinho HTTP nele. Este servidor escuta em
`localhost:8080`. Você não liberou a porta no firewall, não configurou NGINX,
não fez nada. Exemplo:

```bash
# caminho_qualquer tem um index.html
python3 -m http.server 8080 -d caminho_qualquer
```

Na sua máquina você pode encaminhar chamadas na porta 8080 para 8080 no servidor
dessa forma:

```bash
# ---> você:vps --->
ssh -L 8080:localhost:8080 user@seu-vps
```

Agora, se você abrir `http://localhost:8080` no seu navegador, vai ver o
conteúdo do VPS como se estivesse lá. Sem liberar porta, sem configurar nada.
Tipo um _teletransporte_.

O `localhost` ali no meio da sintaxe se refere ao ponto de vista do
**servidor**. Ou seja, "conecte em `localhost:8080` do servidor e traga pra
minha porta `8080`".

### Outro exemplo: banco de dados

Um PostgreSQL rodando no servidor, porta `5432`, escutando só em `localhost`.
Sem acesso externo.

```bash
# Isso é o mais comum, mesma porta
ssh -L 5432:localhost:5432 deploy@servidor

```

Conecte seu cliente local em `localhost:5432`. Pronto, você está no banco
remoto.

Se a porta `5432` já estiver em uso na sua máquina, mude a local:

```bash
# Você controla qual a porta quer usar no seu lado
ssh -L 15432:localhost:5432 deploy@servidor
```

Agora use `localhost:15432`. Isso continuará chamando "5432" no lado do
servidor.

---

## Remote Forward (`-R`): "mando minha porta pra lá"

Esse é o inverso. Você abre uma porta **no servidor** e tudo que chegar lá volta
pelo túnel até a sua máquina. O resultado é que, ao acessar essa porta no
servidor, quem responde é sua máquina local.

![Remote Forward -R mando minha porta pra lá](./images/diagram-r.jpg)

**A sintaxe**

```bash
#       ⬇️
# <porta_remota> encaminha para <destino:porta_destino> em <user@servidor>
ssh -R porta_remota:destino:porta_destino user@servidor
```

**O fluxo**

```
servidor:porta_remota → túnel SSH → sua_máquina → destino:porta_destino
```

**Na prática**

Agora inverte o cenário (vou parar de falar _inverte_, juro 😅). Você tem um
servidorzinho rodando **na sua máquina**:

Mesmo exemplo, só que... 😏

```bash
# caminho_qualquer tem index.html
python3 -m http.server 8080 caminho_qualquer
```

Quer que alguém acesse isso pelo seu VPS? Faz esse túnel com -R:

```bash
# Alguém acessa seu VPS por fora, na porta 8080 e o SSH chama na sua máquina local
ssh -R 8080:localhost:8080 user@seu-vps
```

Qualquer pessoa que acessar `http://seu-vps:8080` chega no servidorzinho que
está rodando na sua máquina local.

### Wait, what? Não funcionou?

Isso acontece. Por padrão, o `-R` só escuta em `127.0.0.1` no servidor. Ou seja,
só funciona se alguém acessar de dentro do próprio servidor.

Para liberar acesso externo, o servidor SSH precisa ter isso no
`/etc/ssh/sshd_config`:

```
GatewayPorts yes
```

Ou, se quiser dar o controle pro cliente:

```
GatewayPorts clientspecified
```

E aí você especifica:

```bash
ssh -R 0.0.0.0:8080:localhost:8080 user@seu-vps
```

Depois de alterar o `sshd_config`, reinicie o serviço:

```bash
sudo systemctl restart sshd
# Ou
sudo systemctl restart ssh
```

E não esqueça do firewall. Se a porta `8080` está bloqueada no firewall do VPS,
o _tunnel_ funciona, mas ninguém de fora chega lá.

---

## Dynamic Forward (`-D`): proxy SOCKS

Os dois anteriores conectam portas específicas. O `-D` é diferente: ele cria um
**proxy SOCKS** na sua máquina. Qualquer aplicação que suporte SOCKS pode rotear
tráfego pelo servidor SSH, e o servidor conecta no destino final.

Você não precisa definir o destino antes. O proxy decide na hora.

![Dynamic Forward -D proxy SOCKS](./images/diagram-d.jpg)

**A sintaxe**

```bash
ssh -D porta_local user@servidor
```

**O fluxo**

```
seu app -> SOCKS proxy (localhost:porta) -> túnel SSH -> servidor -> destino final
```

**Na prática**

Você quer navegar como se estivesse no seu VPS (igual a um VPS _full tunnel_).
Talvez para testar algo, talvez porque está numa rede Wi-Fi duvidosa e quer
criptografar tudo.

```bash
ssh -D 1080 user@seu-vps
```

Agora configure o proxy SOCKS no sistema ou no navegador.

**No macOS:** vá em Ajustes do Sistema -> Rede -> a interface que está usando
(Wi-Fi, por exemplo) -> Detalhes -> Proxies -> ative **Proxy SOCKS** → coloque
`localhost` e porta `1080`.

Abra o navegador e acesse `ifconfig.me` ou `ip.me`. O IP que aparece é o do seu
VPS, não o seu.

Todo o tráfego está passando pelo servidor.

### Um detalhe sobre DNS

Dependendo da aplicação, a resolução DNS pode acontecer **antes** de ir pro
proxy. Isso meio que anula o propósito.

No Firefox, por exemplo, vá em `about:config` e mude
`network.proxy.socks_remote_dns` para `true`. Assim até as consultas DNS passam
pelo tunnel.

---

## Flags úteis

Na maioria das vezes, você não quer um shell remoto. Quer só o tunnel. Essas
flags resolvem:

`-N` - sem comando remoto

Não executa nenhum comando no servidor. Só mantém o tunnel aberto.

```bash
ssh -N -L 8080:localhost:8080 user@servidor
```

`-f` - manda pro background

Joga o processo SSH pro background depois de autenticar.

```bash
ssh -f -N -L 8080:localhost:8080 user@servidor
```

Combinar `-f` com `-N` é o padrão pra tunnels que rodam em segundo plano. Quando
quiser encerrar, mate o processo:

```bash
# encontre o PID
ps aux | grep ssh

# ou, se souber a porta
lsof -i :8080

# mate o processo
kill <PID>
```

### Keepalive

Tunnels morrem se ficam muito tempo sem tráfego. Para evitar isso:

```bash
ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -L 8080:localhost:8080 user@servidor
```

Envia um pacote a cada 60 segundos. Se 3 falharem seguidos, encerra a conexão.

---

## Múltiplos tunnels de uma vez

Pode empilhar quantos quiser:

```bash
ssh -L 5432:localhost:5432 -L 8080:localhost:80 -L 3000:localhost:3000 user@servidor
```

---

## Coloca isso no SSH config

Se você usa algum tunnel com frequência, pare de digitar o comando toda vez.
Adicione em `~/.ssh/config`:

```
Host vps-tunnel
    HostName seu-vps.com
    User deploy
    LocalForward 5432 localhost:5432
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Agora basta:

```bash
ssh -N vps-tunnel
```

---

## Tunnels persistentes com `autossh`

O SSH não reconecta sozinho. Se a conexão cair, o tunnel morre junto. O
`autossh` resolve isso: ele monitora a conexão e reinicia se precisar.

```bash
autossh -M 0 -f -N -o "ServerAliveInterval=60" -o "ServerAliveCountMax=3" \
  -L 5432:localhost:5432 deploy@servidor
```

O `-M 0` desativa a porta de monitoramento do `autossh` e usa o
`ServerAliveInterval` do próprio SSH, que funciona melhor.

Se quiser algo ainda mais robusto, crie um serviço no systemd e ele reinicia
automaticamente em caso de falha.

---

## Coisas que pegam gente desprevenida

### Só funciona com TCP

SSH Tunnels encaminham **apenas TCP**. Se você precisa de UDP (DNS, VPN, jogos),
olhe para `socat`, WireGuard ou `sshuttle`.

### Portas privilegiadas

Portas abaixo de 1024 precisam de root. Se você tentar:

```bash
ssh -L 80:localhost:80 user@servidor
```

Vai falhar sem `sudo`. Use uma porta alta:

```bash
ssh -L 8080:localhost:80 user@servidor
```

### Firewall

O tunnel funciona entre as máquinas, mas se o firewall do servidor bloqueia a
porta do `-R`, ninguém de fora chega. Libere a porta:

```bash
# UFW
sudo ufw allow 8080

# firewalld
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

### Segurança

Tunnels podem furar políticas de rede. Use com responsabilidade.

Qualquer pessoa que acesse sua porta local encaminhada consegue chegar no
serviço remoto. Por isso o SSH escuta em `localhost` por padrão. Se for mudar
para `0.0.0.0`, saiba o que está fazendo.

---

## Referência rápida

- Acessar serviço remoto localmente - `ssh -L 8080:localhost:8080 user@servidor`
- Expor serviço local pelo servidor - `ssh -R 8080:localhost:3000 user@vps`
- Proxy SOCKS para navegação - `ssh -D 1080 user@servidor`
- Tunnel em background - `ssh -f -N -L 8080:localhost:8080 user@servidor`
- Tunnel persistente - `autossh -M 0 -f -N -L 8080:db:5432 user@vps`
- Múltiplos forwards - `ssh -L 5432:db:5432 -L 8080:web:80 user@srv`

---

## Quando usar cada tipo?

- Precisa acessar algo que está numa rede remota - Local (`-L`)
- Precisa expor algo local para o mundo - Remote (`-R`)
- Precisa acessar vários serviços sem criar tunnel por um - Dynamic (`-D`)
- Quer navegar com o IP de outra máquina - Dynamic (`-D`)

---

## Conclusão

SSH Tunnel é uma daquelas ferramentas que resolve o problema em uma linha e,
mesmo assim, a maioria das pessoas não usa.

`-L` traz, `-R` manda, `-D` faz proxy. Mais do que isso, é saber que você não
precisa liberar porta no firewall, configurar reverse proxy ou instalar
ferramenta nenhuma toda vez que quer acessar algo de outra máquina.

Isso já está instalado no seu sistema. Usa.
