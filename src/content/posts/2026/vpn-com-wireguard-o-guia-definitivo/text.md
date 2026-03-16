---
title: 'VPN com WireGuard: O Guia Definitivo'
description:
  'Veja como montar uma VPN WireGuard de verdade: com topologias, túneis, NAT e
  tudo que eu descobri configurando 7 nodes espalhados por casa, Hostinger e
  GCP.'
date: 2026-03-15
author: 'Otávio Miranda'
---

Veja como montar uma VPN WireGuard de verdade: com topologias, túneis, NAT e
tudo que eu descobri configurando 7 nodes espalhados por casa, Hostinger e GCP.

---

## Por que WireGuard

Sempre que você coloca um software novo no projeto, não está levando só uma nova
feature. Leva o pacote completo. Base de código, dependências, bugs, falhas de
segurança... é tipo casamento 😅.

O WireGuard ajuda bastante nessa parte, porque a proposta dele é super
minimalista. No Linux, sua implementação fica abaixo de 4.000 linhas de código.

Especialistas em segurança agradecem.

Em um final de semana uma pessoa consegue auditar todo o código do
**WireGuard**, tomar umas, bodar e ainda sobra o domingo inteiro pra curar a
ressaca.

Além disso, manutenção e desempenho também são otimizados. Com menos código,
temos menos para configurar e o servidor tem menos com o que se preocupar.

### Opinativo

O WireGuard é um protocolo opinativo. Ele não senta com você pra perguntar o que
quer usar, quais algoritmos prefere, quais modos deseja negociar. Não. Ele já
chega dizendo: "vai ser assim". E pronto.

Isso reduz flexibilidade? Com certeza. Mas os ganhos superam essa redução.

Enquanto outras ferramentas, como o OpenVPN, nos dão uma liberdade absurda, o
**WireGuard** pega alguns atalhos, impõe limites e tira opções.

E, por incrível que pareça, isso é uma das suas maiores qualidades.

Eu poderia te falar um milhão de coisas que estava lendo no
[WhitePaper do WireGuard](https://www.wireguard.com/papers/wireguard.pdf), mas
aí já seríamos duas pessoas sem entender o que foi explicado.

Mas, sério agora, ele encapsula pacotes _IPv4_/_IPv6_ sobre o protocolo UDP e
trabalha na camada 3. Só isso!

Nada de bridge de camada 2. Nada de túnel sobre TCP. Isso já evita
[TCP-over-TCP meltdown](https://en.wikipedia.org/wiki/Tunneling_protocol#TCP_meltdown_problem).

### Silencioso

Outra característica muito boa é o silêncio por padrão.

Se um pacote não puder ser autenticado, o WireGuard simplesmente o ignora. Não
responde. Não explica. Não negocia.

Isso pode atrapalhar um pouco na hora de depurar algum problema, claro
(aconteceu comigo, como veremos 😂). Mas, do ponto de vista de segurança, é
bonito de ver. O protocolo fica quieto, como se soubesse que tem alguém tentando
fazer algo inesperado.

### Cryptokey Routing

Nunca ouviu esse termo? Eu também não! É do próprio **WireGuard**.

Em vez de separar totalmente autenticação e roteamento, o WireGuard amarra cada
chave pública a uma lista de IPs permitidos dentro do túnel.

Na saída, isso funciona como tabela de rotas. Na entrada, funciona como uma ACL
(_Access Control List_). Pra ficar uma frase mais bonita: identidade
criptográfica e caminho de rede andam juntos.

Isso chega a mudar até a sua forma de pensar, porque fica mais direto e
previsível.

E isso vai ficar muito claro quando começarmos a configurar, você vai ver que
mudar um número no `AllowedIPs` muda tudo.

No final, é essa soma de restrições que faz o WireGuard ser tão interessante:
menos negociação, menos ambiguidade, menos superfície para erro. E uma operação
muito mais direta.

---

## Topologias: Hub-and-Spoke e Mesh

Eu sei... eu sei... Já estamos chegando lá.

Mas, antes de fazer qualquer configuração, primeiro você precisa definir qual
topologia de rede vai usar. Então, responder essas perguntas pode ajudar.

- Você tem um servidor que controla tudo?
- Vai conectar quantos dispositivos?
- Um dispositivo precisa falar diretamente com o outro?
- Vai compartilhar a Internet pela VPN?
- Tem [NAT](https://en.wikipedia.org/wiki/Network_address_translation) (a gente
  fura 😂)?
- e outras...

O fato é que, no mundo de redes, existem várias topologias que você pode usar.

Nós, no entanto, não estamos em um curso de redes. Além disso, no **WireGuard**
dá pra fazer muita coisa
([se não tudo](https://pt.wikipedia.org/wiki/Efeito_Dunning%E2%80%93Kruger) o
que você quiser) apenas usando essas duas:

- [Hub-and-Spoke ou Estrela](https://en.wikipedia.org/wiki/Network_topology)
- [Topologia Mesh](https://en.wikipedia.org/wiki/Mesh_networking)

Caso queira algo mais formal, os links acima vão te ajudar a entender melhor
essas topologias de rede. Mas vou deixar um atalho para os mais apressados.

### Hub-and-spoke

Meus dispositivos se conectam a um servidor central e ele faz o roteamento dos
pacotes para onde for necessário.

O **Hub** é onde tudo se conecta, o servidor. Os **Spokes** são os dispositivos
que falam com o servidor quando precisam alcançar alguma rota.

Vamos imaginar **três spokes** e **um hub**. Um `server` (hub) e três
dispositivos (spoke), `node_a`, `node_b`, `node_c`. Assim, você escala este
modelo para quantos nodes precisar.

> **Node** (nó) é um aparelho qualquer conectado à rede (Computador, servidor,
> smartphone...).

```
 Ilustração simplificada de Hub-and-Spoke com WireGuard VPN.

                          ┏ HUB ━━━━━━━━━━━━━┓
          ┏━━━━━━━━━━━━━▶ ┃ server           ┃ ◀━━━━━━━━━━━━━━┓
          ┃               ┃ 10.0.0.2/24      ┃                ┃
          ┃               ┗━━━━━━━━━━━━━━━━━━┛                ┃
          ┃                         ▲                         ┃
          ┃                         ┃                         ┃
          ┃                         ┃                         ┃
  10.0.0.0/24 (Split)        0.0.0.0/0 (Full)       10.0.0.0/24 (Split)
          ┃                         ┃                         ┃
          ┃                         ┃                         ┃
          ▼                         ▼                         ▼
 ┏ SPOKE ━━━━━━━━━━━┓     ┏ SPOKE ━━━━━━━━━━━┓     ┏ SPOKE ━━━━━━━━━━━┓
 ┃ node_a           ┃     ┃ node_b           ┃     ┃ node_c           ┃
 ┃ 10.0.0.3/24      ┃     ┃ 10.0.0.4/24      ┃     ┃ 10.0.0.5/24      ┃
 ┗━━━━━━━━━━━━━━━━━━┛     ┗━━━━━━━━━━━━━━━━━━┛     ┗━━━━━━━━━━━━━━━━━━┛

 Split Túnel: parte das redes do node saem pelo VPN (como em 10.0.0.0/24).
 Full Túnel:  todas as redes do node saem pela conexão VPN (como em 0.0.0.0/0).
```

Você pode fazer o roteamento como preferir no **Hub**. Ou seja, o `server` pode
rotear os pacotes para dentro ou para fora da rede. Isso permite uma
configuração extremamente flexível.

Por exemplo, `node_b` poderia falar com `node_c`, `node_a`, com a Internet e até
com outra rede. Isso tudo é controlado pela diretiva `AllowedIPs` do arquivo de
configuração do `WireGuard`.

#### ✅ Prós

- Segurança e auditoria centralizadas
- Simplicidade de implementação

#### ❌ Contras

- Aumento de Latência (Hairpinning): se não tomar cuidado com a configuração,
  seus IPs locais passam a sair para a Internet ao acessar nodes da mesma rede.
  Aconteceu na minha rede. Ao pingar o node ao lado (mesma mesa), a rota foi até
  São Paulo (no Hub) e voltou (estou em Minas).
- SPOF (Single Point Of Failure): é muito comum que redes menores tenham um
  único **Hub**. Como ele controla tudo, toda sua **VPN** para se ele cair.

### Topologia Mesh

Na Topologia Mesh, cada node tem uma conexão direta com os outros nodes. Isso
permite ter uma VPN sem nenhum servidor, apenas um dispositivo que conhece os
outros (e vice-versa).

E olha que coisa interessante: como todo mundo conhece todo mundo, não há
necessidade de roteamento. O próprio formato da rede em si já é roteado.

```
 Ilustração simplificada de topologia Mesh com WireGuard VPN.

          10.0.0.4/32 →         ← 10.0.0.3/32
  ┌ PEER ────────────┐ ◀───────▶ ┌ PEER ────────────┐
  │ node_a           │           │ node_b           │
  │ 10.0.0.3/32      │           │ 10.0.0.4/32      │
  └──────────────────┘           └──────────────────┘
    ▲               ▲             ▲               ▲
    │                ╲           ╱                │
    │            10.0.0.6/32 ↓  ╱                 │
 10.0.0.5/32 ↓         ╲       ╱             10.0.0.6/32 ↓
    │                   ╲ 10.0.0.5/32 ↓           │
    │                    ╲   ╱                    │
    │                     ╲ ╱                     │
    │                      ╱                      │
    │                     ╱ ╲                     │
    │                    ╱   ╲                    │
    │           10.0.0.4/32 ↑ ╲                   │
 10.0.0.3/32 ↑         ╱       ╲             10.0.0.4/32 ↑
    │                 ╱    10.0.0.3/32 ↑          │
    │                ╱           ╲                │
    ▼               ▼             ▼               ▼
  ┌ PEER ────────────┐           ┌ PEER ────────────┐
  │ node_c           │           │ node_d           │
  │ 10.0.0.5/32      │           │ 10.0.0.6/32      │
  └──────────────────┘ ◀───────▶ └──────────────────┘
          10.0.0.6/32 →         ← 10.0.0.5/32

 Em Mesh, cada node tem uma conexão direta com os outros nodes.
```

Isso te dá várias vantagens em termos de desempenho, estabilidade e alta
disponibilidade, mas também te dá algumas boas dores de cabeça na hora de
escalar.

Adicionar novos nodes à rede ou até rotacionar as chaves é um pesadelo. Com 4
nodes, cada um tendo uma conexão direta com os outros, estamos falando em 6
conexões. Agora veja como isso cresce rápido:

- 4 nodes: 6 conexões
- 6 nodes: 15 conexões
- 8 nodes: 28 conexões
- 10 nodes: 45 conexões
- 12 nodes: 66 conexões
- 14 nodes: 91 conexões
- 16 nodes: 120 conexões

Entendeu, não é? Cada node novo adicionado na rede fará você voltar a configurar
todos os outros nodes, mais a nova conexão do que estiver sendo adicionado.

A conta para isso é: `N (N-1) / 2`. Exemplo com 20 nodes: `20*(20-1)/2 = 190`.

E não pense que 16 nodes é muito. Eu, com minha rede minúscula, já bati 7 nodes
brincando de montar VPNs.

Se eu adicionasse os dispositivos da minha residência, já subiria fácil para 14
nodes. Você precisa contar tudo o que for fazer parte da rede (ou então voltar
para o NAT). Relógios, TVs, Tablets, Laptops, Smartphones, talvez até geladeiras
(se você gosta dessas coisas 🤔). Tudo isso pode entrar na sua conexão VPN
também.

#### ✅ Prós

- Melhor desempenho e latência muito mais baixa
- Resiliência (sem ponto único de falha). Um node cair afeta apenas ele mesmo (e
  os nodes que precisarem dele), o restante da rede funciona normalmente
- Existem gerenciadores que ajudam a manter a configuração em dia

#### ❌ Contras

- Escalar, a partir de poucos nodes, se torna insustentável. Você vai precisar
  de softwares de terceiros para gerenciar todas as conexões (existem vários).
- Quando os dois nodes estão atrás de NAT, não tem como fechar a conexão. Um
  deles sempre precisa conseguir receber pelo menos um pacote para fechar a
  conexão.
- Fazer auditoria é mais complicado sem um ponto centralizado de conexões.

### Qual usar?

Você precisa analisar o seu caso. Mas basta olhar o funcionamento do WireGuard
que dá para ter uma noção.

Para autenticar um node, uma das pontas precisa conseguir enviar um pacote
diretamente para ele. Isso significa que você precisa que um deles tenha IP
válido na Internet.

Um `node_a` que tem IP válido não consegue se conectar com um `node_b` que está
atrás de NAT. Mas o contrário é possível. O `node_b` consegue chegar diretamente
no `node_a`. Isso fecharia a conexão.

É por este motivo que precisamos de um servidor quando falamos em VPN.

> Falando nisso 💜
>
> Se precisar de servidor VPS, tenho link e cupom que te dá um belo desconto por
> até 2 anos se quiser.
>
> [https://hostinger.com/otaviomiranda](https://hostinger.com/otaviomiranda)  
> Cupom: OTAVIOMIRANDA
>
> Obrigado à Hostinger por acreditar no meu conteúdo.

Agora, imagine que você está conectando 10 escritórios. Todos eles atrás de NAT.
Você vai precisar de um servidor externo para fechar essas conexões.

Se você acompanhou o que eu disse, claramente precisamos de uma rede
**Hub-and-spoke** aqui.

Por outro lado, se todos os nodes estão de cara para a Internet, dá para usar
**Mesh** sem problemas.

E, por fim, se você tem uma rede híbrida, dá para fazer uma configuração híbrida
também. Onde estiver de frente para a Internet, use **Mesh**, onde não for
possível, **Hub-and-spoke**.

---

## Instalando o WireGuard

O **WireGuard** funciona em todos os sistemas mais conhecidos, então é melhor
você seguir o tutorial de instalação do site deles:

- [Instalar WireGuard](https://www.wireguard.com/install/)

Sim! Funciona em iOS, Android, Linux, macOS, Windows e vários outros sistemas.

Para o macOS, estou usando a versão do `brew`:

```bash
# macOS
brew install wireguard-tools
```

Para os VPSs e VM, todos tem o **Ubuntu Server 24.04 LTS**, então:

```bash
# Ubuntu Server 24.04 LTS
sudo apt install wireguard
```

Para iOS (iPhone), estou usando a
[versão oficial](https://apps.apple.com/us/app/wireguard/id1441195209).

Também tenho um Fedora Asahi aqui, estou usando a versão do **Fedora**:

```bash
# Fedora
 sudo dnf install wireguard-tools
```

---

## Configurando uma rede híbrida no WireGuard

Vamos entender o que tenho para colocar em rede e quais são os desafios. Alguns
problemas são propositais, apenas para fins didáticos.

**Rede Local (Minas Gerais)**

A rede local recebe um IP do provedor e distribui IPs internos. Entrada e saída
usam NAT, ou seja, todos os dispositivos da rede interna saem com o mesmo IP do
roteador do provedor.

Também significa que não tem como chegar em um dispositivo específico dentro da
minha rede, já que o NAT vai bloquear (teria que mexer com redirecionamento de
portas, o que não vem ao caso agora).

Então a limitação é: os nodes da minha rede local precisam iniciar a conexão com
dispositivos externos, só assim consigo autenticar usando o **WireGuard**.

Funciona tanto para **Hub-spoke** quanto para **Mesh**, mas o dispositivo do
outro lado precisa estar visível na Internet. Eu também deixei uma pegadinha nos
outros nodes que vão forçar o uso de **Hub-and-spoke**. Já falaremos sobre isso.

Os dispositivos são (por hostname):

- `m132` - Laptop - `192.168.0.108/24`
- `m4128` - Laptop - `192.168.0.109/24`
- `fedoraair` - Laptop - `192.168.0.114/24`
- `Smartphone` - iOS - `Dinâmico`

**Hostinger (São Paulo)**

Sem segredo aqui. Todos estão nos datacenters da Hostinger, de cara para a
Internet. São 3 VPSs.

- `kvm2` - VPS - `76.13.71.178/24`
- `kvm4` - VPS - `191.101.70.130/23`
- `kvm8` - VPS - `89.116.73.152/24`

**VM Google Cloud Platform (Iowa, EUA)**

Este é mais um servidor em outra rede completamente diferente das duas
anteriores. Rede da Google, em Council Bluffs, Iowa, EUA (`us-central1-b`).

- `gc_micro` - VM - `Dinâmico`

E essa foi a pegadinha que deixei para apimentar as coisas. Eu poderia fixar o
IP nessa VM, porém vou manter dinâmico.

Se você entendeu tudo até aqui, já deve ter notado que não tenho como fazer
**Mesh** da minha **rede local** (NAT) para a rede da Google. Até dá para fazer,
mas quando o IP da VM mudar, não terei mais conexão. A VM não conseguirá chegar
nas minhas máquinas locais e minhas máquinas locais terão o IP da VM incorreto,
porque mudou.

A solução mais simples para isso é **Hub-and-spoke**.

---

## Gerador de Configuração WireGuard Config Generator

De tanto ficar fazendo essas configurações do WireGuard na mão, acabei criando o
[WireGuard Config Generator](https://wireguard.otaviomiranda.com.br/). Isso nem
é público, não tem ads, não salva dados, nem cookies. Tudo roda no seu navegador
usando a Web Crypto API. As chaves são geradas localmente e nunca saem da sua
máquina. Foi simplesmente um aplicativo que criei para solucionar um problema
meu mesmo.

Ele suporta **Hub-and-spoke** e **Mesh** separadamente. Para montar uma rede
híbrida como a minha, gerei primeiro a base Hub-and-spoke (com o `kvm2` como
Hub), depois troquei para Mesh e juntei as configs manualmente. Não é o ideal,
mas é muito mais rápido do que fazer tudo do zero.

🚨 Vou te explicar todas as configurações, mas te aconselho fortemente a usar o
"Generator". Já perdi incontáveis horas tentando encontrar qual chave ou IP eu
errei (foi por isso que o criei).

Depois de te passar medo 😂, vamos ver como fazer isso na unha (ainda assim, vou
usar a base do Generator).

### Como funciona o WireGuard?

Isso varia bastante de sistema para sistema. Porém, pelo menos no Linux e macOS,
depois de instalado, você cria um arquivo de configuração com o nome da
Interface em `/etc/wireguard/wg0.conf`.

No caso do macOS, essa pasta nem existia, então criei ela também.

```bash
# Cria a pasta do WireGuard
sudo mkdir /etc/wireguard

# Cria o arquivo de configuração do WireGuard
 sudo touch /etc/wireguard/wg0.conf

# Ajusta as permissões do arquivo de configuração do WireGuard
sudo chmod 600 /etc/wireguard/wg0.conf
```

Os comandos acima são para Linux e macOS. No Windows eu não sei dizer como
funciona, mas não deve ser muito diferente disso.

Com este arquivo pronto, agora só precisamos preencher os dados de `Interface`
(nossa interface de rede local) e `Peer`. Cada **Peer** é um dispositivo que
vamos nos conectar.

### Gerando as chaves

Antes de configurar qualquer coisa, cada node precisa de um par de chaves:
**privada** e **pública**. Se você já usou SSH com chave, é o mesmo conceito.

A chave privada fica só no seu node. Nunca sai de lá. A chave pública você
distribui para os peers que precisam se conectar a você.

```bash
# Gera a chave privada
wg genkey
```

Isso vai cuspir uma string em Base64. Essa é a sua chave privada. Guarda ela
(nunca, em hipótese alguma, mostre essa chave para ninguém).

Agora, para gerar a pública a partir da privada:

```bash
# Gera a chave pública a partir da privada
echo "SUA_CHAVE_PRIVADA" | wg pubkey
```

Se quiser fazer tudo de uma vez e já salvar nos arquivos:

```bash
# Gera o par de chaves e salva nos arquivos
wg genkey | sudo tee /etc/wireguard/private.key | wg pubkey | sudo tee /etc/wireguard/public.key > /dev/null ;
# Ajuste as permissões dos arquivos importantes
sudo chmod 600 /etc/wireguard/{wg0.conf,private.key}

# COPIE A CHAVE PÚBLICA E ANOTE A QUAL DISPOSITIVO ELA PERTENCE
sudo cat /etc/wireguard/public.key
```

Faça isso em **todos** os nodes. No final, cada node terá sua chave privada e
você terá a chave pública de cada um para distribuir.

### Anatomia do arquivo de configuração

O arquivo `wg0.conf` tem duas seções: `[Interface]` e `[Peer]`. Você terá
**uma** Interface e **um ou mais** Peers.

```ini
[Interface]
PrivateKey = <chave privada deste node>
ListenPort = 51820
Address = <IP do node na VPN>/mascara

[Peer]
PublicKey = <chave pública do peer>
AllowedIPs = <IPs que esse peer pode usar no túnel>
Endpoint = <IP público:porta do peer>
PersistentKeepalive = 25
```

Calma que vou explicar cada campo.

#### `[Interface]`: Quem sou eu?

- **`PrivateKey`** a chave privada deste node. Aquela que você gerou e não
  compartilha com ninguém.
- **`ListenPort`** a porta UDP que o WireGuard vai escutar. O padrão é `51820`.
  Pode ser qualquer uma, mas lembre de liberar no firewall. Se quer uma dica,
  mantenha o padrão `51820`.
- **`Address`** o IP deste node **dentro da VPN**. É um IP que você inventa.
  Nada a ver com o IP da sua rede ou da Internet. É o endereço que identifica
  este node dentro do túnel. Eu costumo usar a rede `10.100.0.0/24` alterando
  apenas o final de 2 para cima (`10.100.0.2`, `10.100.0.3`, ...
  `10.100.0.254`).

#### `[Peer]`: Quem são os outros?

- **`PublicKey`** a chave pública do peer. É o que identifica ele.
- **`AllowedIPs`** essa é a diretiva mais importante do **WireGuard**. Ela faz
  duas coisas ao mesmo tempo:
  - **Na saída:** funciona como tabela de rotas. "Para onde enviar pacotes
    destinados a esse IP?"
  - **Na entrada:** funciona como ACL. "Aceito pacotes vindos desse peer apenas
    se o IP de origem estiver nessa lista."
  - Se colocar `10.100.0.4/32`, só o IP `10.100.0.4` passa.
  - Se colocar `10.100.0.0/24`, toda a sub-rede `10.100.0.x` passa.
  - Se colocar `0.0.0.0/0`, **tudo** passa. Isso é o Full Túnel.
- **`Endpoint`** o IP público (ou domínio) e porta do peer. É para onde o
  WireGuard manda o primeiro pacote. Esse campo é **opcional**. Se o peer está
  atrás de NAT ou tem IP dinâmico, ele não precisa de Endpoint, porque é ele
  quem vai iniciar a conexão.
- **`PersistentKeepalive`** intervalo em segundos para enviar um pacote vazio ao
  peer. Serve para manter a conexão ativa, especialmente quando tem NAT no
  caminho. Se o NAT não receber pacotes por um tempo, ele fecha o mapeamento e o
  peer fica inalcançável. O valor `25` (segundos) é o recomendado.

---

## Configurando o Hub (servidor central)

Vamos começar pelo coração da rede: o `kvm2`. Ele é o Hub. É o servidor que
todos os outros nodes conhecem e que faz o roteamento quando necessário.

Lembra do `AllowedIPs`? No Hub, cada peer recebe um `/32` (um IP específico).

Isso porque o Hub sabe exatamente quem é quem. Ele não precisa rotear sub-redes
inteiras para um peer, só o IP daquele node.

```ini
# /etc/wireguard/wg0.conf — kvm2 (HUB)

[Interface]
PrivateKey = <chave privada do kvm2>
ListenPort = 51820
Address = 10.100.0.2/24, fd10:100::2/64
```

> Repare no `Address`. Estou usando **duas** redes: uma IPv4 (`10.100.0.2/24`) e
> uma IPv6 (`fd10:100::2/64`). A rede IPv6 usa o prefixo `fd`, que é para redes
> privadas (equivalente ao `10.x.x.x` no IPv4). Você pode usar só IPv4 se
> preferir.

Agora os peers. Vou colocar dois para você entender o padrão, depois é só
replicar.

```ini
# kvm4 - Hostinger VPS
[Peer]
PublicKey = <chave pública do kvm4>
AllowedIPs = 10.100.0.4/32, fd10:100::4/128
Endpoint = 191.101.70.130:51820
PersistentKeepalive = 25

# m132 - Laptop na rede local
[Peer]
PublicKey = <chave pública do m132>
AllowedIPs = 10.100.0.25/32, fd10:100::25/128
Endpoint = 187.108.118.25:51820
PersistentKeepalive = 25
```

O `kvm4` tem IP fixo, então o Endpoint é direto. O `m132` está atrás de NAT, mas
o Hub tem o IP público do roteador como Endpoint. Funciona? Funciona. Mas tem um
detalhe.

Na minha rede local eu tenho 3 máquinas, todas saindo pelo mesmo IP público.

Isso significa que o Hub não pode iniciar a conexão para uma máquina específica,
porque o NAT não saberia para qual delas entregar o pacote. Quem precisa iniciar
são as máquinas locais. Quando elas fazem o handshake, o Hub aprende a rota
correta (com a porta NAT de cada uma) e a comunicação flui.

O `PersistentKeepalive = 25` garante que, uma vez conectado, o NAT não feche o
mapeamento por inatividade.

### Compartilhando a Internet pelo Hub

Se você quer que um node navegue na Internet usando o IP do servidor (Full
Túnel), o Hub precisa fazer NAT masquerading. É como dizer: "tudo que chegar
pelo túnel e precisar sair para a Internet, sai com o meu IP".

Para isso, adicionamos regras no `[Interface]` usando `PostUp` e `PostDown`:

```ini
[Interface]
PrivateKey = <chave privada do kvm2>
ListenPort = 51820
Address = 10.100.0.2/24, fd10:100::2/64

# Habilita o encaminhamento de pacotes
PostUp = sysctl -w net.ipv4.ip_forward=1
PostUp = sysctl -w net.ipv6.conf.all.forwarding=1

# Regras de firewall para NAT masquerading
PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -A FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostUp = ip6tables -A FORWARD -i %i -j ACCEPT
PostUp = ip6tables -A FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostUp = ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Limpeza (quando o WireGuard desliga)
PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
PostDown = ip6tables -D FORWARD -i %i -j ACCEPT
PostDown = ip6tables -D FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostDown = ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
PostDown = sysctl -w net.ipv4.ip_forward=0
PostDown = sysctl -w net.ipv6.conf.all.forwarding=0
```

> **`%i`** é substituído automaticamente pelo nome da interface (`wg0`).
>
> **`eth0`** é a interface de rede que tem acesso à Internet no servidor. No seu
> caso pode ser `ens3`, `enp1s0` ou outro nome. Para descobrir, rode `ip route`
> e veja qual interface aparece na rota `default`.
>
> **`PostUp`** roda quando o WireGuard sobe. **`PostDown`** roda quando desce.
> Assim o servidor fica limpo quando a VPN está desligada.

Isso só precisa existir no Hub. Os spokes não precisam dessas regras (a não ser
que também compartilhem Internet para outra rede).

---

## Configurando os Spokes

Agora vamos para o lado dos spokes. A ideia é a mesma em todos: dizer quem eu
sou (`Interface`) e quem eu conheço (`Peer`).

### Spoke com IP fixo (VPS)

O `kvm4` é um VPS da Hostinger com IP fixo. Ele tem conexão direta com o Hub e
também faz mesh com os outros VPSs e com os nodes locais.

```ini
# /etc/wireguard/wg0.conf — kvm4 (Spoke + Mesh)

[Interface]
PrivateKey = <chave privada do kvm4>
ListenPort = 51820
Address = 10.100.0.4/24, fd10:100::4/64

# kvm2 (HUB) - Rota para toda a sub-rede passa por aqui
[Peer]
PublicKey = <chave pública do kvm2>
AllowedIPs = 10.100.0.0/24, fd10:100::0/64
Endpoint = 76.13.71.178:51820
PersistentKeepalive = 25

# kvm8 - Mesh direto (VPS com IP fixo)
[Peer]
PublicKey = <chave pública do kvm8>
AllowedIPs = 10.100.0.8/32, fd10:100::8/128
Endpoint = 89.116.73.152:51820
PersistentKeepalive = 25
```

Olha o que acontece com o `AllowedIPs`:

- Para o **kvm2** (Hub): `10.100.0.0/24`. Toda a sub-rede. Isso significa que
  qualquer IP da VPN que o `kvm4` não conheça diretamente vai ser encaminhado
  para o Hub. O Hub é o "caminho padrão".
- Para o **kvm8** (Mesh): `10.100.0.8/32`. Só o IP específico. Quando o `kvm4`
  quiser falar com `10.100.0.8`, vai direto, sem passar pelo Hub.

É aqui que mora a mágica da rede híbrida. O WireGuard escolhe a rota mais
específica. `/32` ganha de `/24`. Então o mesh é usado quando possível, e o Hub
serve de fallback para o resto.

### Spoke atrás de NAT (rede local)

Os nodes de casa (`m132`, `m4128`, `fedoraair`) seguem o mesmo padrão. A única
diferença é que eles têm peers extras para os vizinhos de rede local, usando IPs
internos.

```ini
# /etc/wireguard/wg0.conf — m132 (Spoke local)

[Interface]
PrivateKey = <chave privada do m132>
ListenPort = 51820
Address = 10.100.0.25/24, fd10:100::25/64

# kvm2 (HUB)
[Peer]
PublicKey = <chave pública do kvm2>
AllowedIPs = 10.100.0.0/24, fd10:100::0/64
Endpoint = 76.13.71.178:51820
PersistentKeepalive = 25

# kvm4 - Mesh direto
[Peer]
PublicKey = <chave pública do kvm4>
AllowedIPs = 10.100.0.4/32, fd10:100::4/128
Endpoint = 191.101.70.130:51820
PersistentKeepalive = 25

# kvm8 - Mesh direto
[Peer]
PublicKey = <chave pública do kvm8>
AllowedIPs = 10.100.0.8/32, fd10:100::8/128
Endpoint = 89.116.73.152:51820
PersistentKeepalive = 25

# m4128 - Vizinho de LAN (Endpoint local!)
[Peer]
PublicKey = <chave pública do m4128>
AllowedIPs = 10.100.0.26/32, fd10:100::26/128
Endpoint = 192.168.0.109:51820
PersistentKeepalive = 25

# fedoraair - Vizinho de LAN (Endpoint local!)
[Peer]
PublicKey = <chave pública do fedoraair>
AllowedIPs = 10.100.0.27/32, fd10:100::27/128
Endpoint = 192.168.0.114:51820
PersistentKeepalive = 25
```

Repare nos Endpoints dos vizinhos de LAN: `192.168.0.x`. São IPs internos da
rede local. Quando o `m132` quer falar com o `m4128`, ele vai direto pela rede
local, sem sair para a Internet e sem passar pelo Hub.

Isso é exatamente o problema de **hairpinning** que comentei lá em cima. Se eu
não colocasse esses Endpoints locais, o pacote iria até o Hub em São Paulo e
voltaria. Da minha mesa em Minas para São Paulo e de volta. Para falar com o
laptop ao lado.

### Spoke com IP dinâmico (gc_micro)

O `gc_micro` é uma VM no Google Cloud com IP dinâmico. Ele não tem Endpoint
fixo, então nenhum peer coloca o IP dele na configuração.

```ini
# /etc/wireguard/wg0.conf — gc_micro (Spoke dinâmico)

[Interface]
PrivateKey = <chave privada do gc_micro>
ListenPort = 51820
Address = 10.100.0.28/24, fd10:100::28/64

# kvm2 (HUB) - Rota para toda a sub-rede
[Peer]
PublicKey = <chave pública do kvm2>
AllowedIPs = 10.100.0.0/24, fd10:100::0/64
Endpoint = 76.13.71.178:51820
PersistentKeepalive = 25

# kvm4 - Mesh direto
[Peer]
PublicKey = <chave pública do kvm4>
AllowedIPs = 10.100.0.4/32, fd10:100::4/128
Endpoint = 191.101.70.130:51820
PersistentKeepalive = 25

# kvm8 - Mesh direto
[Peer]
PublicKey = <chave pública do kvm8>
AllowedIPs = 10.100.0.8/32, fd10:100::8/128
Endpoint = 89.116.73.152:51820
PersistentKeepalive = 25
```

O `gc_micro` conhece o Hub e os VPSs (que têm IP fixo). Para todo o resto,
depende do Hub. E o mais importante: **ninguém aponta Endpoint para ele**. Ele
inicia a conexão, o `PersistentKeepalive` mantém o NAT aberto e o Hub aprende o
caminho.

Se a VM reiniciar e ganhar um IP novo? Sem problemas. Ela conecta de novo no
Hub, o Hub atualiza o Endpoint automaticamente e a vida segue.

---

## Subindo o túnel

Configurou tudo? Então vamos ligar.

```bash
# Sobe a interface wg0
sudo wg-quick up wg0
```

Para derrubar:

```bash
# Desce a interface wg0
sudo wg-quick down wg0
```

Se quiser que o WireGuard suba automaticamente junto com o sistema (Linux com
systemd):

```bash
# Habilita o WireGuard no boot
sudo systemctl enable wg-quick@wg0
```

Para verificar o status da conexão:

```bash
# Mostra o status de todos os peers
sudo wg show
```

O comando `wg show` é o seu melhor amigo. Ele mostra quais peers estão
conectados, quando foi o último handshake e quantos dados passaram.

### Testando a conexão

O bom e velho `ping`:

```bash
# Pinga o Hub pelo IP da VPN
ping 10.100.0.2
```

Se chegar, o túnel está funcionando. Se não chegar, respira fundo e confere:

1. O WireGuard está rodando nos dois lados? (`sudo wg show`)
2. As chaves públicas estão corretas? (chave pública do peer A no config do B e
   vice-versa)
3. A porta `51820/UDP` está liberada no firewall?
4. O `AllowedIPs` inclui o IP que você está tentando alcançar?
5. Se tem NAT, o node atrás do NAT iniciou a conexão primeiro?

Lembra que eu disse que o WireGuard é silencioso? Se algo estiver errado, ele
simplesmente não responde. Não tem mensagem de erro bonitinha. Então a depuração
é por eliminação mesmo 😂.
