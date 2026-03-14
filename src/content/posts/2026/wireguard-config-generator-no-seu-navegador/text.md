---
title: 'WireGuard Config Generator no seu navegador'
description:
  'WireGuard Config Generator é um gerador de configurações do WireGuard seguro,
  que não usa nada externo. Sem cookies, sem localStorage e sem salvar nada
  internamente. Só você e o navagador.'
date: 2026-03-12
author: 'Otávio Miranda'
---

O [WireGuard Config Generator](https://wireguard.otaviomiranda.com.br/) não é
nada complexo ou feito com o intuito de gerenciar sua conexões de VPN do
WireGuard. A única coisa que ele faz é gerar suas configurações para você.

Fiz isso apenas para rotacionar as poucas conexões que tenho sem ter que
instalar nada externo. Só preciso adicionar nomes e IPs para o gerador de
configurações do WireGuard fazer todos os arquivos de configuração para cada uma
das minhas máquinas automaticamente.

Para não usar nada externo, usei a
[Web Crypto API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Crypto_API)
do próprio navegador.

Para garantir a segurança e confiabilidade, só uso front-end (HTML, CSS e JS)
sem salvar nada em lugar nenhum:

- Sem `Analytics`
- Sem `Cookies`
- Sem `Base de dados`
- Sem `Conexão externa`

Além disso, o código do
[WireGuard Config Generator é aberto](https://github.com/luizomf/wgfront).

Se você busca por algo que gerencie toda a conexão para você, talvez seja melhor
usar o [Headscale](https://github.com/juanfont/headscale) ou Tailscale.

Agora, se quer apenas gerar ou rotacionar suas chaves de forma segura acesse:

- [WireGuard Config Generator](https://wireguard.otaviomiranda.com.br/)

Faltam algumas coisas ainda. Por exemplo, gostaria de colocar a opção de
compartilhamento de Internet, roteamento, full túnel e várias outras coisas.
Mas, enquanto não monto isso, use o seguinte na sua configuração do WireGuard
quando precisar:

```bash
# Para Compartilhamento de Internet adicione isso no servidor
# NAT masquerading to share internet
PostUp = sysctl -w net.ipv4.ip_forward=1
PostUp = sysctl -w net.ipv6.conf.all.forwarding=1

PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -A FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostUp = ip6tables -A FORWARD -i %i -j ACCEPT
PostUp = ip6tables -A FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostUp = ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
PostDown = ip6tables -D FORWARD -i %i -j ACCEPT
PostDown = ip6tables -D FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostDown = ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
PostDown = sysctl -w net.ipv4.ip_forward=0
PostDown = sysctl -w net.ipv6.conf.all.forwarding=0
```

## Exemplo de configuração completo

Servidor (Hub) — `/etc/wireguard/wg0.conf`

```ini
[Interface]
PrivateKey = <SERVER_PRIVATE_KEY>
Address = 10.0.0.1/24
ListenPort = 51820

# Para Compartilhamento de Internet adicione isso no servidor
# NAT masquerading to share internet
PostUp = sysctl -w net.ipv4.ip_forward=1
PostUp = sysctl -w net.ipv6.conf.all.forwarding=1

PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -A FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostUp = ip6tables -A FORWARD -i %i -j ACCEPT
PostUp = ip6tables -A FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostUp = ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
PostDown = ip6tables -D FORWARD -i %i -j ACCEPT
PostDown = ip6tables -D FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostDown = ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
PostDown = sysctl -w net.ipv4.ip_forward=0
PostDown = sysctl -w net.ipv6.conf.all.forwarding=0

# Cliente 1
[Peer]
PublicKey = <NOTEBOOK_PUBLIC_KEY>
PresharedKey = <PSK_VPS_NOTEBOOK>
AllowedIPs = 10.0.0.2/32

# Cliente 2
[Peer]
PublicKey = <CELULAR_PUBLIC_KEY>
PresharedKey = <PSK_VPS_CELULAR>
AllowedIPs = 10.0.0.3/32

# Cliente 3
[Peer]
PublicKey = <HOME_SERVER_PUBLIC_KEY>
PresharedKey = <PSK_VPS_SERVIDOR>
AllowedIPs = 10.0.0.4/32, 192.168.1.0/24 # túnel + LAN da casa
```

Cliente (Exemplo) — `/etc/wireguard/wg0.conf`

```ini
[Interface]
PrivateKey = <NOTEBOOK_PRIVATE_KEY>
Address = 10.0.0.2/32
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
PresharedKey = <PSK_VPS_NOTEBOOK>
Endpoint = <IP_PUBLICO_VPS>:51820
AllowedIPs = 0.0.0.0/0, ::/0           # full tunnel (todo tráfego pela VPN)
# AllowedIPs = 10.0.0.0/24             # split tunnel (só rede interna)
PersistentKeepalive = 25
```

> **Nota sobre `eth0`:** este nome de interface pública pode ser `ens3`,
> `enp1s0`, etc. Descubra com: `ip route show default | awk '{print $5}'`
