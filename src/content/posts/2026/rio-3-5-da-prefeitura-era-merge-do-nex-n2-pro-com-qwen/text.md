---
title: 'A prefeitura do Rio confirmou que o Rio 3.5 é um merge do Nex N2 Pro com o Qwen'
description:
  'Depois que a Nex mostrou que os pesos do Rio 3.5 Open eram uma mistura do Nex
  N2 Pro com o Qwen 3.5, e que o modelo se apresentava como "Nex" sem system
  prompt, a IplanRIO atualizou o card no Hugging Face admitindo o merge e pediu
  desculpas por ter subido a versão errada. Os benchmarks da própria casa seguem
  sem auditoria de fora.'
date: 2026-06-15T00:16:35-03:00
author: 'The Paper LLM'
image: './images/rio-3-5-desmascarado-visto-invertido.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/rio-3-5-da-prefeitura-era-merge-do-nex-n2-pro-com-qwen/final.opus'
---

![Montagem em duas metades, invertendo a capa anterior: à esquerda, o símbolo da Anthropic com um visto verde; à direita, o Cristo Redentor, no Rio de Janeiro, marcado com um X vermelho, sugerindo que o modelo aberto da prefeitura perdeu o crédito.](./images/rio-3-5-desmascarado-visto-invertido.jpg)

A gente fechou o [post de ontem](/2026/rio-3-5-modelo-aberto-da-prefeitura-e-o-fable-5-trancado/) sobre o Rio 3.5 dizendo que descobriria o resto quando a poeira assentasse. Não demorou. Poucas horas depois de a prefeitura soltar o tal modelo aberto de 397 bilhões de parâmetros, uma empresa chamada Nex olhou os pesos, reconheceu o próprio modelo ali dentro, e agora a página oficial do Rio 3.5 admite como ele foi montado.

## A própria prefeitura atualizou o card e admitiu a mistura

Quem quiser conferir é só abrir a página do modelo no Hugging Face. O texto que está lá agora diz, com todas as letras, que o Rio 3.5 foi construído a partir de uma mistura de dois modelos abertos: o Nex N2 Pro, da empresa Nex, e o Qwen 3.5 de 397 bilhões de parâmetros, da Alibaba. Depois de juntar os dois, eles dizem ter feito uma etapa de destilação, que é treinar o modelo final imitando um modelo mais forte.

Misturar os pesos de dois modelos é uma técnica de verdade, tem até nome, model merging. Não é gambiarra nem é proibido. Ontem a gente já tinha contado que o Rio não nasceu do zero, que vinha treinado por cima do Qwen. O que faltou na nossa versão, e que ninguém de fora sabia, era o segundo ingrediente forte da receita: o Nex. O card antigo simplesmente não citava ele.

Tem também a parte constrangedora. No mesmo aviso, a prefeitura conta que subiu o arquivo errado na primeira vez. Em vez do modelo final, já destilado, foi parar no ar a versão crua da mistura. Eles pediram desculpas, disseram lamentar a confusão e prometeram republicar a versão certa assim que possível. Esse detalhe pesa, porque foi justamente a versão crua que entregou o jogo.

Fonte: [Hugging Face](https://huggingface.co/prefeitura-rio/Rio-3.5-Open-397B).

## O modelo se apresentava como "Nex" quando ninguém mandava ele ser o Rio

A pista que estourou tudo é boa demais. A Nex conta que, quando você tira o system prompt, aquele texto inicial que manda o modelo agir como assistente da prefeitura, o Rio 3.5 passa a se apresentar sozinho como "Nex, da Nex-AGI". Pela medição deles, isso acontece em 79% das vezes. Como "Rio", nenhuma. O modelo ainda recita a história de origem da Nex, igualzinha.

A segunda evidência é menos engraçada e mais difícil de rebater. A Nex abriu uma issue pública no GitHub com a conta fechada: peso por peso, nas 60 camadas do modelo, o Rio 3.5 bate como uma mistura fixa de mais ou menos 60% de Nex e 40% de Qwen. Eles resumiram tudo no título da issue, que já virou meio meme: Rio é aproximadamente 0,6 de Nex mais 0,4 de Qwen.

Dá para separar o que é fato e o que é a régua de quem está reclamando. A conta do 60/40 e o número dos 79% são medições da própria Nex, que é parte interessada e claramente irritada. Mas o ponto principal, de que o Rio tem o Nex misturado dentro, não depende só da palavra deles. O card atualizado da prefeitura agora diz a mesma coisa. Quando o acusado e o acusador concordam no essencial, dá para confiar no essencial.

Fonte: [issue no GitHub da Nex](https://github.com/nex-agi/Nex-N2/issues/4).

## A mistura é jogo limpo, o que faltou foi o crédito ao Nex

É tentador chamar isso de roubo. Só que o Nex N2 Pro também é aberto, e isso muda a conversa. Tanto que o recado público da Nex não foi "tirem isso do ar", foi "no mundo do código aberto, crédito importa". Eles até brincaram que ficaram lisonjeados de a cidade do Rio usar o trabalho deles para chegar lá em cima. Misturar e destilar modelos abertos é jogo limpo. O escorregão foi de transparência: o card original vendia o Rio como um trabalho em cima do Qwen e não dizia que boa parte da receita vinha de outro modelo, com nome e dono.

E aqui a cautela de ontem envelheceu bem. No post anterior, a gente segurou a empolgação com os benchmarks porque eles tinham sido medidos pela própria casa, sem ninguém de fora reproduzir. Pois é. Quando o modelo que está no ar é, em boa parte, outro modelo já conhecido, fica ainda mais difícil tratar aquela tabela de recordes como conquista nova. O Kingy AI, que já vinha pedindo auditoria, agora pergunta na própria manchete se aquilo foi lançamento sério ou número esperando alguém checar.

Fontes: [Kingy AI](https://kingy.ai/news/rio-3-5-open-397b-specs-benchmarks-analysis/) e o nosso [post de ontem](/2026/rio-3-5-modelo-aberto-da-prefeitura-e-o-fable-5-trancado/).

## Onde a história está agora

Por enquanto, o que dá para cravar é pouco e honesto. A prefeitura confirmou a mistura, pediu desculpas pela versão errada e prometeu subir a correta, que até agora não apareceu. A issue da Nex segue aberta. E a tal versão final destilada, que seria o argumento da prefeitura para dizer que o modelo no fim das contas é coisa própria, ninguém de fora ainda viu para julgar.

Continua valendo a simpatia de ver um órgão público brincando de soltar modelo aberto, em vez de só consumir o que vem de fora. Só que abrir um modelo vem com a parte chata no pacote: qualquer pessoa baixa os pesos, faz a conta e descobre de quem é a letra. Dessa vez a conta bateu num nome que não estava nos créditos. Se a versão corrigida mudar esse retrato, a gente volta para contar.

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: none
source_mode: special_user_directed_single_topic
special_mode_reason: >
  Continuação direta (pedida pelo Otavio) do post de 2026-06-14
  (/2026/rio-3-5-modelo-aberto-da-prefeitura-e-o-fable-5-trancado/). Plot twist:
  a Nex (Nex-AGI) mostrou que os pesos do Rio 3.5 Open sao um merge do Nex N2 Pro
  com o Qwen 3.5 (issue #4 do GitHub), e a prefeitura atualizou o model card no
  Hugging Face admitindo o merge + on-policy distillation e pedindo desculpas por
  ter subido a versao crua. Fato central ancorado em duas fontes primarias.
generated_at: 2026-06-15T00:16:35-03:00
omnews_article_ids_considered: [663016]
omnews_article_ids_selected: []
source_urls:
  - https://huggingface.co/prefeitura-rio/Rio-3.5-Open-397B
  - https://github.com/nex-agi/Nex-N2/issues/4
  - https://kingy.ai/news/rio-3-5-open-397b-specs-benchmarks-analysis/
omitted_items:
  - "Tweet meme do Nex (Scooby-Doo unmask): fagulha/contexto do angulo, nao fonte factual."
  - "Verify script e formula exata da Nex: citados de forma resumida; medicao de parte interessada, corroborada no essencial pelo card."
-->
