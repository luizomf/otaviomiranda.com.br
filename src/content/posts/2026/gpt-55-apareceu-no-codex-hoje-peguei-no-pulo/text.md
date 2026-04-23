---
title: 'GPT-5.5 apareceu no Codex hoje. Peguei no pulo.'
description:
  'O GPT-5.5 saiu hoje e apareceu no meu Codex. Ainda é material de lançamento
  da OpenAI, então fica como nota quente, não review definitivo.'
date: 2026-04-23T17:04:35-0300
author: 'Otávio Miranda'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/gpt-55-apareceu-no-codex-hoje-peguei-no-pulo/final.opus'
---

O GPT-5.5 saiu hoje, 23 de abril de 2026, e eu descobri do jeito mais besta
possível: apareceu um botão pra atualizar o Codex. Cliquei.

Quando olhei de novo, o modelo já tinha mudado pra GPT-5.5.

![OpenAI GPT 5.5](./images/gpt-5-5.jpg)

Então, antes que isso vire "notícia de ontem" (o que em IA parece acontecer em
umas três horas), resolvi deixar esta nota aqui.

Mas, vamos com calma: isso aqui **não é review**. Não deu tempo. Eu literalmente
acabei de pegar o modelo. Este texto é baseado principalmente no
[material de lançamento da própria OpenAI](https://openai.com/index/introducing-gpt-5-5/),
então ainda tem muito cheiro de marketing de fabricante. Benchmark bonito, frase
forte, promessa de produtividade, aquele pacote completo.

Dito isso, tem algumas coisas interessantes.

## O que a OpenAI está prometendo

Segundo a OpenAI, o GPT-5.5 não está sendo vendido só como "um chat melhor". A
promessa é mais específica: um modelo melhor pra trabalhar com ferramentas por
mais tempo.

Código, pesquisa online, análise de dados, documentos, planilhas, uso de
software e tarefas que exigem várias etapas.

Ou seja: menos "me responde isso aqui" e mais "pega esse problema bagunçado,
entende o contexto, usa ferramentas, testa, corrige e me devolve algo que
preste".

Pra quem usa Codex, isso é exatamente onde a coisa começa a ficar interessante.

A OpenAI diz que o GPT-5.5 melhorou em tarefas de código e uso de terminal. No
material oficial, eles citam **82.7% no Terminal-Bench 2.0** contra **75.1% do
GPT-5.4**. No **SWE-Bench Pro**, que tenta medir resolução de issues reais em
projetos, o número subiu pouco: **58.6% contra 57.7%**.

Esse "subiu pouco" também é importante. Nem todo benchmark grita revolução.
Algumas coisas parecem avanço incremental mesmo.

E tudo isso ainda precisa passar pelo teste mais cruel: projeto real, com código
velho, decisão estranha, teste quebrando, dependência chata e humano cansado do
outro lado.

## Codex, contexto e preço

No [anúncio oficial](https://openai.com/index/introducing-gpt-5-5/), a OpenAI
diz que o GPT-5.5 está chegando ao ChatGPT e ao Codex para usuários Plus, Pro,
Business e Enterprise. No Codex, também entram Edu e Go, com janela de contexto
de **400K**.

Também existe um modo **Fast**, que gera tokens mais rápido, mas custa mais. A
promessa oficial é 1.5x mais rápido por 2.5x o custo.

Na API, ele ainda aparece como "em breve". A própria
[página de preços da OpenAI](https://openai.com/api/pricing/) já lista o GPT-5.5
como "coming soon", com **US$5 por 1 milhão de tokens de entrada** e **US$30 por
1 milhão de tokens de saída**.

Então, sim, parece mais capaz. Também parece mais caro.

Como todo bom dev, a gente comemora com uma mão e segura a carteira com a outra.

## A parte de segurança

Outra parte forte do lançamento é segurança.

A OpenAI publicou um
[system card do GPT-5.5](https://deploymentsafety.openai.com/gpt-5-5), fala em
testes antes do lançamento, red teaming, avaliações para cyber e biologia, além
de feedback de quase 200 parceiros de acesso antecipado.

Ela também abriu um
[Bio Bug Bounty específico do GPT-5.5](https://openai.com/index/gpt-5-5-bio-bug-bounty/).
O escopo é bem específico: GPT-5.5 no Codex Desktop, procurando um jailbreak
universal para perguntas de segurança biológica. O prêmio principal anunciado é
de US$25.000.

Traduzindo: eles também sabem que um modelo melhor em código, pesquisa e
ferramentas pode ser útil pra coisa boa e pra coisa ruim.

E esse é o pedaço que mais me interessa no longo prazo. Não só "o modelo ficou
mais inteligente", mas "o modelo ficou mais capaz de agir". Quando entra
ferramenta, terminal, navegador, arquivo, repositório, sandbox e automação, a
conversa muda de tamanho.

## Minha impressão de primeira hora

Curiosidade.

Não vou fingir conclusão madura onde só existe botão recém-clicado. Quero ver se
ele realmente entende melhor projetos grandes, se respeita mais o estilo do
código, se testa direito, se não inventa moda quando eu só quero uma alteração
pequena e se consegue trabalhar sem transformar cada tarefa simples numa tese.

Também quero ver uma coisa que benchmark não mede tão bem: comportamento no
fluxo real.

Porque um agente pode ser muito inteligente e ainda ser chato. Pode ser capaz e
ansioso. Pode resolver um bug difícil e, cinco minutos depois, mexer onde não
precisava. Quem usa esse tipo de ferramenta todo dia sabe que "mais autonomia"
só é bom quando vem junto com bom senso.

Então fica a nota: peguei o GPT-5.5 no pulo aqui no Codex.

Talvez eu volte a falar dele depois de usar mais. Talvez não. Eu não costumo
fazer post sobre cada modelo novo que aparece, mas esse caiu direto na
ferramenta que eu uso pra trabalhar no blog, no código e nas automações.

Aí ficou difícil ignorar.

Valeu.

## Fontes

- [OpenAI - Introducing GPT-5.5](https://openai.com/index/introducing-gpt-5-5/)
- [OpenAI - GPT-5.5 System Card](https://deploymentsafety.openai.com/gpt-5-5)
- [OpenAI - API Pricing](https://openai.com/api/pricing/)
- [OpenAI - GPT-5.5 Bio Bug Bounty](https://openai.com/index/gpt-5-5-bio-bug-bounty/)
