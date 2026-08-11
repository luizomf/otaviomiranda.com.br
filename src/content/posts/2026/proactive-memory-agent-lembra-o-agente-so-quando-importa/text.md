---
title: 'Proactive Memory Agent lembra o agente só quando importa'
description: 'Um segundo agente organiza fatos, tentativas e subobjetivos, escolhe quando intervir e melhora benchmarks — agora com código público para inspecionar o custo da memória.'
date: 2026-08-11T14:43:55-03:00
author: 'The Paper LLM'
image: './images/proactive-memory-agent-lembra-o-agente-so-quando-importa.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/proactive-memory-agent-lembra-o-agente-so-quando-importa/final.opus'
---

![Agente de memória entrega um único lembrete a um robô que trabalha no laptop.](./images/proactive-memory-agent-lembra-o-agente-so-quando-importa.jpg)
Um agente passa vinte minutos investigando um erro, encontra a causa, tenta duas correções e anota um requisito importante. Três chamadas depois, toma uma decisão como se nada daquilo tivesse acontecido. A informação continua no transcript. Só parou de mandar no comportamento.

Yifan Wu e coautores deram um nome ao sumiço: **degradação do estado comportamental**, ou _behavioral state decay_. A proposta deles coloca um segundo agente para acompanhar o trabalho, organizar o que importa e decidir, antes da próxima ação, se vale lembrar o colega de alguma coisa ou ficar quieto.

Sim, chegamos à IA que diz para outra IA: “você já tentou isso”. Quem nunca trabalhou em equipe que atire o primeiro ticket duplicado.

## A informação está no contexto. O agente só não usa

Quando a gente fala de memória para agentes, o primeiro suspeito costuma ser o armazenamento. A janela encheu, o contexto foi compactado ou uma mensagem antiga ficou para trás. O paper descreve outro caso: requisitos, fatos do ambiente, tentativas, diagnósticos e subobjetivos continuam no histórico, mas deixam de influenciar a próxima decisão.

Um transcript longo mistura descoberta importante, saída de ferramenta, conversa, hipótese abandonada e repetição. Está tudo ali. Só que despejar ainda mais texto no prompt pode transformar memória em arquivo morto: muito bem guardado e completamente inútil na hora de agir.

O Proactive Memory Agent acrescenta uma pergunta à recuperação: “isso precisa entrar na próxima chamada agora?”. Ficar em silêncio é uma ação explícita. A memória pode deixar o agente trabalhar quando não tem nada útil para acrescentar, uma habilidade que seria bem-vinda em muita reunião.

Fonte: [Remember When It Matters, seção 1](https://arxiv.org/html/2607.08716v1#S1).

## Um agente cuida do banco e escolhe a hora de cutucar

A arquitetura mantém o agente que executa a tarefa e adiciona um agente de memória com duas fases. Primeiro, ele edita um banco estruturado. Pode salvar, atualizar ou apagar informações em três grupos:

- um estado privado, com progresso e riscos que não precisam entrar no prompt de ação;
- memórias de conhecimento, com requisitos e fatos relativamente estáveis do ambiente;
- memórias procedurais, com tentativas, erros, diagnósticos e soluções.

Depois, o agente de memória consulta o banco e escolhe entre produzir um lembrete específico ou não intervir. Se houver lembrete, ele entra como contexto transitório apenas na próxima chamada do agente de ação. O banco inteiro fica fora do caminho.

Essa divisão tenta manter o componente no próprio emprego. A primeira chamada mexe na memória; a segunda decide entre lembrete e silêncio. Assim, ele tem menos espaço para virar outro planejador geral disputando o volante. Tem uma cerca. Modelo de linguagem, como gato, ainda merece supervisão perto de qualquer limite desenhado no chão.

Na configuração principal dos experimentos, o agente de memória recebe a descrição da tarefa, as oito mensagens mais recentes e o banco estruturado. Ele roda no primeiro passo e em todos os seguintes. O “plug-and-play” dos autores quer dizer que o modelo e a política do agente de ação continuam sem alteração ou novo treinamento. Ainda sobra integração para o harness: chamar outro modelo, persistir o banco e injetar o lembrete.

Fontes: [arquitetura na seção 3](https://arxiv.org/html/2607.08716v1#S3) e [configuração experimental na seção 4.1](https://arxiv.org/html/2607.08716v1#S4.SS1.SSS0.Px3).

## O agente mais fraco ganhou mais

Nos resultados dos autores, Claude Sonnet 4.5 saiu de 37,6% para 45,9% de pass@1 no Terminal-Bench 2.0. São 8,3 pontos percentuais de ganho. A comparação considerou 85 tarefas válidas das 89 configuradas; quatro saíram por falhas de Docker sem relação com o comportamento do agente.

No τ²-Bench, Sonnet passou de 55,0% para 61,8% em 278 tarefas: 50 de airline, 114 de retail e 114 de telecom. Nos dois benchmarks, Claude Opus 4.6 fazia o papel de agente de memória.

Quando Opus 4.6 também virou o agente de ação, a diferença encolheu. O Terminal-Bench foi de 43,5% para 45,9%, mais 2,4 pontos. No τ²-Bench, foi de 66,2% para 68,7%, mais 2,5 pontos. Dentro desses experimentos, a memória produziu um delta maior sobre o baseline mais baixo do Sonnet. Isso ainda é um resultado dos autores, não uma lei universal sobre modelos fortes e fracos.

As ablações deixam o desenho mais interessante. Manter o banco e escolher quando intervir produziu resultados mais equilibrados entre os domínios do que expor tudo, forçar lembrete em cada passo, orientar sem banco ou recuperar as dez entradas mais próximas com Mem0. O modo que sempre injetava lembrete ficou 0,3 ponto à frente no micro-average. Os próprios autores tratam essa diferença como variação esperada, e não como superioridade robusta.

Essa rodada de ablação tem números próprios. O sistema completo aparece, por exemplo, com 57,0% em retail e 61,2% na média ponderada. Na comparação principal, os valores são 58,8% e 61,8%. São execuções e condições diferentes. Misturar as colunas para deixar o placar bonito seria uma demonstração bastante criativa de degradação do estado editorial.

O τ²-Bench também usa uma única conversa amostrada por episódio, e o paper não apresenta intervalos de confiança nem repetições completas. Diferenças pequenas não sustentam um ranking definitivo. O trabalho permanece no preprint v1, publicado em 9 de julho, e esta apuração não encontrou validação independente.

Fontes: [Tabela 1 e resultados principais](https://arxiv.org/html/2607.08716v1#S4.T1) e [Tabela 2 e ablações](https://arxiv.org/html/2607.08716v1#S4.SS3).

## Uma memória menor ajudou, mas a receita não veio junto

Os autores também fizeram um experimento preliminar com um modelo de memória de pesos abertos. Treinaram o Qwen3.5-27B com SFT e GRPO, mantiveram o Qwen3.5-122B-A10B congelado como agente de ação e avaliaram a transferência no conjunto retido do Terminal-Bench.

O pass@1 reportado foi de 37,6% para 41,1%, ganho de 3,5 pontos percentuais. O resultado sugere que dá para especializar a função de memória em vez de entregá-la sempre a um modelo proprietário maior. Só que o repositório não publica os pesos nem a receita completa desse Qwen treinado. Dá para conferir o número no paper; o material público dos autores ainda não permite reproduzi-lo.

Fonte: [seção 4.5 e Tabela 4 do paper](https://arxiv.org/html/2607.08716v1#S4.SS5).

## O código chegou depois e mostrou onde a memória mora

Em 10 de julho, mencionamos rapidamente [o companheiro de memória que injeta lembretes na hora certa](/2026/gpt-5-6-ultra-o-harness-aberto-da-cloudflare-e-um-modelo-de-744b-num-laptop/). Quatro dias depois, os autores publicaram a implementação sob Apache 2.0, com configuração do Terminal-Bench e trajetórias para inspeção.

O código implementa as duas fases, as operações no banco e as respostas `<context_for_action>` e `<no_intervention/>`. Quando o banco passa do limite configurado, um filtro BM25 reduz o material antes da chamada. A tal “memória do agente” fica bem menos mística quando aparece no código: estado persistido, seleção lexical, duas inferências e um ponto exato para inserir contexto.

O projeto exige Python 3.12 ou mais recente e usa LiteLLM. O runner do Terminal-Bench trabalha com Harbor e Enroot, além de trazer uma alternativa documentada em Docker. Há também cinco pares de trajetórias, cada um com baseline e versão com memória, para comparar onde uma intervenção mudou o caminho.

Até a apuração de 11 de agosto, o repositório continuava apenas com o commit inicial de 14 de julho. O README ensina a reproduzir o Terminal-Bench, mas não o τ²-Bench. Já dá para abrir, inspecionar e testar o padrão. Reproduzir todos os resultados do paper com um comando e uma quantidade simbólica de fé ainda não entrou no pacote.

Fontes: [implementação do agente de memória](https://github.com/yifannnwu/proactive-memory-agent/blob/main/src/memory_agent/memory/memory_agent.py), [README do projeto](https://github.com/yifannnwu/proactive-memory-agent/blob/main/README.md) e [commit inicial de 14 de julho](https://github.com/yifannnwu/proactive-memory-agent/commit/89e5c0d6aadfe531a1aee42fd290d48be89973dd).

## Lembrar melhor também entra na fatura

Para agentes de coding ou automações longas, esse padrão oferece um lugar explícito para requisitos, fatos do ambiente, tentativas e subobjetivos. Ele pode reduzir repetição e decisões que contradizem descobertas anteriores sem despejar o passado inteiro em cada chamada.

A conta chega junto. Na configuração principal, o agente de memória faz outra inferência no primeiro passo e em todos os seguintes. Isso adiciona tokens, latência, persistência e outro modelo capaz de errar. O paper relata lembretes que repetem informação, transformam hipótese em certeza ou provocam verificações desnecessárias.

Eu compararia pelo menos três configurações no workload real: baseline, banco sempre exposto e intervenção seletiva. Acerto sozinho conta metade da história. Também entram chamadas extras, tokens, latência, frequência de intervenções, repetições evitadas e regressões causadas por lembretes ruins. Os ganhos mudaram conforme o benchmark e a força do agente de ação. Seu repositório não assinou contrato para se comportar como uma tabela do arXiv.

A melhor ideia talvez seja colocar o silêncio na interface. Memória boa aparece quando consegue mudar a próxima decisão. No resto do tempo, deixa o agente trabalhar.

Fonte: [Remember When It Matters](https://arxiv.org/html/2607.08716v1#S4).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: none
source_urls:
  - https://arxiv.org/html/2607.08716v1#S1
  - https://arxiv.org/html/2607.08716v1#S3
  - https://arxiv.org/html/2607.08716v1#S4.SS1.SSS0.Px3
  - https://arxiv.org/html/2607.08716v1#S4.T1
  - https://arxiv.org/html/2607.08716v1#S4.SS3
  - https://arxiv.org/html/2607.08716v1#S4.SS5
  - https://github.com/yifannnwu/proactive-memory-agent/blob/main/src/memory_agent/memory/memory_agent.py
  - https://github.com/yifannnwu/proactive-memory-agent/blob/main/README.md
  - https://github.com/yifannnwu/proactive-memory-agent/commit/89e5c0d6aadfe531a1aee42fd290d48be89973dd
  - https://arxiv.org/html/2607.08716v1#S4
-->
