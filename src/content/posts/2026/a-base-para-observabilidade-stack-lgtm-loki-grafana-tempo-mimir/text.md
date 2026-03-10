---
title: 'A Base Para Observabilidade: Stack LGTM (Loki, Grafana, Tempo, Mimir)'
description:
  'Como saí do achismo com logs e montei uma stack LGTM real, localmente e numa
  VPS, para entender métricas, traces e alertas.'
date: 2026-03-10
author: 'Otávio Miranda'
---

Até poucos dias atrás, eu não sabia quase nada sobre essa sopa de letrinhas:
Loki, Grafana, Tempo, Mimir, Alloy, OpenTelemetry e outras que vão aparecendo
nos meus estudos.

Na minha cabeça de "dev raiz", observabilidade era algo como:

> "Joga uns logs aí, abre o terminal, procura erro e vai."

Funciona? Às vezes. Sempre damos um jeito de resolver. O problema é sempre está
correndo atrás do rabo. Sempre "reagindo ao erro" e não "prevenindo o erro".

E tem mais, chega uma hora em que o log sozinho não responde o que você quer
saber. Ele só te mostra que algo aconteceu. Mas não responde algumas perguntas
que tendem a aparecer. Alguns exemplos:

- quanto aquilo piorou ao longo do tempo?
- onde a requisição ficou lenta?
- foi no meu código ou na infra?
- qual a quantidade de usuários afetados?

Depois de algumas tentativas falhas de estudar observabilidade no passado, dessa
vez resolvi pegar firme. Óbvio que não sou nenhum especialista, longe disso.
Mas, pelo menos já consigo dar meus pitacos.

Um dos primeiros desafios que encontrei, foi essa sopa de letrinhas. Eu ainda
estava só nos logs, quando apareceram: Métricas, Traces e Profiles.

Foi exatamente por isso que resolvi montar uma stack LGTM completa e
disponibilizar isso, primeiro para quem me acompanha. (O próprio
[Grafana](https://github.com/grafana/docker-otel-lgtm) tem essa stack pronta,
mas eu precisava montar a minha).

---

## Stack LGTM em vídeo

Gravei um vídeo falando mais detalhadamente sobre isso, caso queira assistir,
segue abaixo:

[![Observabilidade: Loki, Grafana, Tempo e Mimir (LGTM Stack)](./images/lgtm.jpg)](https://youtu.be/8VlmEK5ler0?si=ESYvJFkl6doVynaz)

[Observabilidade: Loki, Grafana, Tempo e Mimir (LGTM Stack)](https://youtu.be/8VlmEK5ler0)

---

## O log é bom, mas...

Todo desenvolvedor faz isso: acontece alguma coisa estranha na aplicação e a
reação imediata é sair espalhando `print`, `console.log`, `logger.info` ou
qualquer variação dessa ideia. Quando é fora da aplicação, `tail`, `grep`,
`rg`...

Eu faço isso muito mais do que gostaria. Você, provavelmente também faz isso.
Acho que todo mundo faz um pouco disso.

Ao meu ver, tá tudo certo. O log é bom, mas... log é um evento textual congelado
no tempo. Ele vai te contar algo que aconteceu em um ponto muito específico no
tempo.

Só que observabilidade de verdade começa quando você quer responder perguntas um
pouco menos específicas. Por exemplo:

- isso aconteceu uma vez ou está acontecendo várias vezes sem eu perceber?
- isso começou agora ou já vem piorando faz algum tempo?
- essa requisição passou por onde?
- foi CPU?
- foi rede?
- foi banco?
- foi meu último deploy?

Aí entram os três pilares (tem mais, mas eu ainda estou nesses).

---

## Logs, métricas e traces

### Logs

Logs são registros de eventos capturados em momentos específicos no tempo. É o
relato bruto. O "aconteceu isso".

Neste projetinho que vou disponibilizar mais adiante no texto, os logs saem da
aplicação via `stdout`, o Docker coleta, o `Grafana Alloy` lê isso e encaminha
para o `Loki`. Depois eu exploro tudo na interface do Grafana usando `LogQL`.

É o básico que todo mundo entende primeiro. E com razão. Log é o tipo de coisa
que você bate o olho e já reconhece.

### Métricas

Métricas são medidas numéricas acompanhadas ao longo do tempo. Aqui a conversa
muda.

Você não quer mais saber só se "deu erro" em algum ponto. Você quer saber:

- qual foi a taxa de erro?
- quantas requisições por segundo estão chegando?
- quanto de CPU a VPS está usando?
- como a latência se comportou nos últimos minutos

Métrica é tendência, comportamento, padrão. Geralmente, preciso de algum volume
de dados e tempo para análise. Um exemplo de métrica poderia ser o tempo médio
de resposta da API para os usuários em determinado período.

Sozinhos, Logs não conseguiriam responder isso.

No projeto, essas métricas vão para o `Mimir` e eu consulto tudo com `PromQL`.

### Traces

Isso aqui é um pouco mais complexo até conseguir configurar tudo de uma forma
que os dados façam sentido, mas é uma das partes mais interessantes para mim.

Trace é o caminho completo de uma requisição. E por requisição, não estou
falando apenas de requisições HTTP. Qualquer caminho que os dados façam em
qualquer aplicação.

Ele mostra por onde a chamada passou e onde o tempo foi gasto em cada um dos
pontos. Não interessa se foi uma função do seu código ou alguma parte da infra.
Se configurado de maneira correta, você conseguiria ver precisamente onde uma
requisição pode ter gerado um erro ou ficado mais lenta.

Então, em vez de olhar só para o resultado final, você passa a olhar para a
jornada inteira:

- entrou aqui
- passou por esse middleware
- ficou esse tempo nessa etapa
- terminou desse jeito

No meu caso, estou usando `Tempo` para armazenar traces e `OpenTelemetry` para
instrumentar a API.

É a peça que mais ajuda a sair do "acho que o gargalo está aqui" para "não, está
aqui mesmo".

**Obs.:** já podemos tirar os `prints` e `console.logs` de "Chegou Aqui" do
código.

---

## Grafana Alloy - Ele é quem distruibui os dados

Uma das coisas que eu não entendia no começo era:

> "Beleza, eu tenho logs, métricas e traces. Mas quem pega isso tudo e leva para
> os lugares certos?"

No meu projeto, esse papel ficou com o `Grafana Alloy`. Ele funciona como um
coletor e roteador.

Pega logs do Docker, recebe métricas e traces da aplicação, coleta sinais do
host e dos containers e distribui cada coisa para o backend certo

O fluxo fica mais ou menos assim:

- API Logs -> Docker -> Alloy -> `Loki`
- API Métricas -> OTel -> Alloy -> `Mimir`
- API traces -> OTel -> Alloy -> `Tempo`

Otel é OpenTelemetry.

O `Grafana` entra depois como a interface onde eu exploro tudo.

---

## Falando em OpenTelemetry (OTel)

O `OpenTelemetry` entra dentro da aplicação. Tipo o que você faz com seu Logger,
mas para métricas e traces. O **OTel** também faz **log** e **profiling**, mas
ainda não cheguei nessa página do livro 😅.

Mas, ele foi o padrão que usei para instrumentar a API e emitir telemetria sem
ter que sair inventando formato próprio para tudo. Na verdade, hoje em dia ele
já é o padrão da indústria (todo mundo já usa).

Foi ele que me permitiu gerar métricas e traces da aplicação de um jeito mais
organizado e menos artesanal.

Ou seja:

- o `Alloy` coleta e encaminha
- o `OpenTelemetry` ajuda a aplicação a emitir os sinais

---

## A parte divertida: subir isso em um VPS real

Montar tudo localmente é ótimo para aprender. Mas localmente tudo sempre parece
mais bonito do que realmente é.

> Se precisar de VPS
>
> Tenho link e cupom de 10% de desconto adicional na Hostinger para planos de 12
> e 24 meses.
>
> [hostinger.com/otaviomiranda](https://hostinger.com/otaviomiranda)  
> Cupom: OTAVIOMIRANDA

Você está na sua máquina. Sem latência de internet. Sem borda pública. Sem
firewall de verdade. Sem aquele sentimento de "agora isso aqui mora em outro
lugar e pode dar ruim". E, o mais importante, sem bots de Internet tentando
fazer brute force no seu SSH ou qualquer formulário disponível no seu front-end.

Então resolvi subir a stack numa VPS real.

E aqui entra uma coisa importante: eu não queria fazer um tutorial gigante de
"digite 300 comandos comigo". A verdade é que 2025 já foi muito cruel com quem
dedicou tempo para criar tutoriais. Então fiz diferente.

Documentei o passo a passo em dois guias:

- um
  [guia completo](https://github.com/luizomf/lgtm1/blob/main/docs/DEV_GUIDE.md),
  explicando o que cada comando faz
- e um
  [guia mais direto](https://github.com/luizomf/lgtm1/blob/main/docs/DEV_GUIDE_SENIOR.md),
  só com os comandos para subir o servidor

Assim, este texto ou meu vídeo não se tornam um walkthrough cansativo. Quem
quiser replicar tem tudo mastigado.

---

## O deploy ficou simples de propósito

Tentei abstrair o máximo da parte chata para deixar a stack mais fácil de
estudar.

No repositório, a base do deploy gira em torno do `Justfile`.

Então, em vez de sair lembrando `docker compose` gigantesco, arquivo de
ambiente, receita de tráfego e outras miudezas, eu deixei comandos curtos para
as tarefas principais.

Por exemplo:

```bash
cp .env.example .env
# Configure o seu .env
just deploy
```

Depois disso, consigo gerar tráfego, disparar alertas, resetar ambiente,
explorar dashboards e repetir cenários sem precisar decorar um carnaval de
comandos.

Esse tipo de coisa parece detalhe, mas faz muita diferença quando você quer
estudar sem transformar tudo em atrito.

---

## Segurança: o Grafana não precisa ficar pelado na internet

Outra decisão importante foi não expor tudo publicamente. Mas, quero mudar isso
já como um próximo passo.

Eu tinha algumas opções na mesa no momento da configuração:

- Traefik com HTTPS para API e Grafana
- Traefik com HTTPS para API e Grafana liberando apenas meu IP
- VPN WireGuard e Grafana apenas no VPN
- E outras...

No meu setup, fiz o seguinte: a API fica atrás de `Traefik` em `80/443`, mas o
Grafana fica privado, acessível pela rede do `WireGuard`.

Isso me dá uma divisão que queria, mas não expõe nada do Grafana para a
Internet.

- a aplicação pública fica pública
- a interface administrativa fica privada

Como laboratório, ainda vou abrir o Grafana para a Internet para "OBSERVAR 😂" o
que acontece.

## O mais legal de tudo

O mais legal desse processo foi perceber como o entendimento vai mudando muito
rápido quando você começa a ver as peças funcionando juntas.

Dois dias antes de montar isso, eu mal sabia o que era LGTM. Pouco depois, eu já
estava discutindo:

- single binary no Loki
- traces no Tempo
- métricas do host
- alertas no Mimir
- Grafana privado via WireGuard
- latência real da API vs delay injetado

O cérebro humano é uma máquina engraçada. Isso acontece com você também?

Primeiro você se sente um idiota. Depois começa a reconhecer os nomes. Depois
entende o fluxo. Depois começa a ter opinião. Depois está aqui escrevendo sobre
isso.

---

## Se você quiser estudar isso

Te convido a usar o meu projeto. Ele está público, gratuito e foi pensado para
iniciantes que querem aprender observabilidade vendo algo real funcionar.

Foi pensado assim porque eu também me considero inciante nisso.

O projeto, até agora, tem:

- aplicação de demo
- stack LGTM completa
- dashboards provisionados
- tráfego simulando cenários previsíveis
- guias para subir localmente e numa VPS

Devo continuar mexendo, então não leve isso ao pé da letra. Mas, se você quiser
dar uma olhada, o repositório está aqui:

- **[github.com/luizomf/lgtm1](https://github.com/luizomf/lgtm1)**

Se for usar VPS para brincar com isso em ambiente real, eu usei uma da
[Hostinger](https://hostinger.com/otaviominranda) nesse laboratório e ela deu
conta do recado. Mas o mais importante aqui não é o provedor. É você finalmente
parar de depender de achismo para entender o que sua aplicação está fazendo.

No fim, era isso que eu queria.

Menos "hmm, estranho". Mais "agora eu sei onde olhar".
