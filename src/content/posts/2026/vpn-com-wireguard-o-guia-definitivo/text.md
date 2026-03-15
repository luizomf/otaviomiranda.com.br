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
temos menos para configurar e servidor tem menos com o que se preocupar.

### Opinativo

O WireGuard é um protocolo opinativo. Ele não senta com você pra perguntar o que
quer usar, quais algoritmos prefere, quais modos deseja negociar. Não. Ele já
chega dizendo: "vai ser assim". E pronto.

Isso reduz flexibilidade? Com certeza. Mas, os ganhos superam essa redução.

Enquanto outras ferramentas, como o OpenVPN, nos dão uma liberdade absurda, o
**WireGuard** pega alguns atalhos, impõe limites e tira opções.

E, por incrível que pareça, nesse caso, isso é uma das suas maiores qualidades.

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

No final, é essa soma de restrições que fazem o WireGuard ser tão interessante:
menos negociação, menos ambiguidade, menos superfície para erro. E uma operação
muito mais direta.

---

## Topologias: Hub-and-Spoke e Mesh

Eu sei... eu sei... Já estamos chegando lá.

Mas, antes de fazer qualquer configuração, primeiro você precisa definir qual a
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

Luiz
