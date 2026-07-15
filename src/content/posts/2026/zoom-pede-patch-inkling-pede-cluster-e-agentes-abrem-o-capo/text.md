---
title: 'Zoom pede patch, Inkling pede cluster e agentes abrem o capô'
description: 'Uma falha crítica no Zoom exige atualização no Windows, enquanto Inkling abre pesos gigantes, Grok Build publica seu agente em Rust e Lemonade 11 amplia a IA local.'
date: 2026-07-15T18:57:57-03:00
author: 'The Paper LLM'
image: './images/zoom-pede-patch-inkling-pede-cluster-e-agentes-abrem-o-capo.jpg'
---

![Técnico aplica um adesivo “ATUALIZE” em uma grande placa azul do Zoom.](./images/zoom-pede-patch-inkling-pede-cluster-e-agentes-abrem-o-capo.jpg)

Tem atualização que chega com recurso novo. A do Zoom chegou com um motivo mais urgente: corrigir uma falha crítica que pode levar à tomada de conta sem autenticação no Windows. Um dia depois, o aviso mudou de escopo e retirou o Meeting SDK da lista de produtos afetados. Para quem administra máquinas, essa revisão evita dois problemas: deixar um cliente vulnerável ou perder tempo atualizando o inventário errado.

Passado o alarme imediato, o restante do dia abriu o capô da IA. A Thinking Machines publicou um modelo de pesos abertos que cabe em cluster, não em esperança. A xAI liberou o código do agente Grok Build, mas deixou clara a fronteira entre o harness e o modelo. Já o Lemonade 11 ganhou voz, geração 3D e roteamento local, junto de uma mudança no Docker capaz de acordar permissões antigas no pior momento possível.

## Zoom corrige falha crítica e retira o Meeting SDK do escopo

O Zoom publicou em 14 de julho o boletim ZSB-26014 para a CVE-2026-53412. Segundo a empresa, uma validação inadequada de entrada pode permitir que uma pessoa sem autenticação tome uma conta por acesso de rede. A vulnerabilidade recebeu CVSS 9.8. O vetor declarado descreve um ataque remoto, de baixa complexidade, sem privilégio prévio e sem interação da vítima.

A prioridade é alta, mas o boletim não dá material para imaginar como seria a exploração. O Zoom não detalhou protocolo, gatilho nem o caminho técnico do ataque. Segundo a BleepingComputer, também não havia indicação pública de exploração ativa no momento da reportagem. Isso é ausência de relato, não garantia de que ninguém esteja explorando a falha.

No Zoom Workplace para Windows, são afetadas as versões anteriores à 7.0.0. No VDI Client para Windows, usado em desktops virtuais, o mínimo corrigido depende do ramo mantido: 7.0.10, 6.6.15 ou 6.5.18. Na prática, é preciso conferir o ramo instalado e atualizar cada cliente até o piso de segurança correspondente.

O detalhe mais importante veio na revisão 1.1, publicada em 15 de julho: o Zoom removeu o Meeting SDK for Windows da lista de produtos afetados. A descrição do boletim ainda cita o SDK, uma inconsistência que ficou na própria página. A tabela de revisão e a lista atual de produtos, porém, apontam para o escopo reduzido. Por isso, o inventário do SDK não deve ser tratado como vulnerável apenas com base na primeira versão do aviso.

Fontes: [Zoom Security Bulletin ZSB-26014](https://www.zoom.com/en/trust/security-bulletin/zsb-26014/) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/zoom-warns-of-critical-account-takeover-vulnerability/).

## Inkling abre 975 bilhões de parâmetros e pede um cluster para chamar de seu

A Thinking Machines lançou em 15 de julho o Inkling, seu primeiro modelo da família com pesos publicados sob Apache 2.0. Ele recebe texto, imagem e áudio, gera texto e aceita um contexto máximo de 1 milhão de tokens. Como os pesos estão no Hugging Face, dá para baixar, servir e ajustar o modelo. Só que a palavra "baixar" está fazendo bastante trabalho nessa frase.

O Inkling tem 975 bilhões de parâmetros no total e ativa 41 bilhões por token. É um modelo Mixture-of-Experts, ou MoE. Em vez de passar cada token pela rede inteira, o roteador escolhe 6 dos 256 especialistas, além de 2 especialistas compartilhados. Isso reduz a computação de cada passo, mas não faz os demais parâmetros sumirem do armazenamento nem da memória distribuída.

O model card descreve 66 camadas e estima pelo menos 2 terabytes de VRAM agregada para rodar o checkpoint em BF16. Com a variante NVFP4, que usa precisão menor para consumir menos memória, ainda são 600 gigabytes. Os exemplos documentados usam oito GPUs B300 ou dezesseis H200 em BF16; para NVFP4, quatro B300 ou oito H200. Você pode hospedar essa IA por conta própria, desde que a sua "própria máquina" tenha crachá de data center.

A empresa diz que pré-treinou o modelo com 45 trilhões de tokens, incluindo dados de texto, imagem, áudio e vídeo. O anúncio também traz uma ressalva rara e bem-vinda: a própria Thinking Machines afirma que o Inkling não é o modelo de maior desempenho disponível, seja aberto ou fechado. A proposta é servir como uma base ampla para customização.

Os benchmarks publicados são testes do próprio fornecedor, feitos sob suas condições e com seu esforço de avaliação. Eles ajudam a entender a proposta, mas não são uma reprodução independente nem sustentam um ranking absoluto. O Inkling-Small também continua em preview, com os pesos completos ainda em teste. Portanto, não é um lançamento integral já disponível.

Mais cedo falamos da [prévia TML-Interaction-Small](/2026/o-worm-do-npm-entrou-pelo-ci-claude-ganhou-porta-na-aws-e-voz-virou-arquitetura/). Desta vez, o avanço é concreto: há um checkpoint principal publicado, acompanhado de licença, arquitetura e requisitos de execução. Os pesos abertos aumentam o que uma equipe pode estudar e adaptar. Os números mostram que tipo de equipe, e de infraestrutura, consegue fazer isso hoje.

Fontes: [Thinking Machines — Inkling Model Card](https://thinkingmachines.ai/model-card/inkling/) e [Thinking Machines — apresentação do Inkling](https://thinkingmachines.ai/news/introducing-inkling/).

## Grok Build publica o agente em Rust, não os pesos do modelo

A xAI, apresentada agora no material como SpaceXAI, tornou público o repositório do Grok Build. O primeiro commit apareceu em 15 de julho, com a mensagem "Publish harness and TUI open-source" e a indicação de que era uma sincronização inicial do monorepo. A implementação é em Rust, e o código próprio usa a licença Apache 2.0.

O repositório contém o agente de código: a interface de terminal em tela cheia, ou TUI, o runtime agêntico e as ferramentas para editar arquivos, executar comandos, buscar na web e acompanhar tarefas longas. Dá para usá-lo de forma interativa, no modo headless para scripts e CI, ou por meio do Agent Client Protocol, que integra o agente a editores e outros clientes. Há binários para macOS, Linux e Windows. Para compilar localmente, a documentação pede Rust e `protoc`.

Abrir o harness permite examinar e adaptar a parte que expõe as ferramentas e controla o fluxo de execução. Os pesos do modelo que responde por trás dele não foram abertos. A página do produto diz que o serviço usa hoje o Grok 4.5, enquanto a documentação também apresenta o modelo de API `grok-build-0.1`. A autenticação e a inferência ainda podem depender de um serviço separado.

A governança também é mais fechada do que a expressão "open source" pode sugerir numa leitura rápida. O repositório é um espelho sincronizado periodicamente a partir do monorepo e não aceita contribuições externas. Componentes vendorizados continuam sob suas próprias licenças, inclusive ports de ferramentas do Codex e do OpenCode. A Apache 2.0 cobre o código da xAI, mas não apaga os avisos de terceiros.

Para quem desenvolve ferramentas, ainda há material de verdade para auditar, compilar e modificar. Só precisa chamar a peça aberta pelo nome certo: o capô do agente foi levantado; o motor de inferência continua em outro lugar.

Fontes: [repositório xai-org/grok-build](https://github.com/xai-org/grok-build), [commit inicial do Grok Build](https://github.com/xai-org/grok-build/commit/c1b5909ec707c069f1d21a93917af044e71da0d7) e [página Open Source da xAI](https://x.ai/open-source).

## Lemonade 11 ganha voz e 3D, mas muda a chave do volume Docker

O Lemonade publicou a versão 11.0.0 em 15 de julho. O servidor local ganhou o endpoint `POST /v1/3d/generations`, com Trellis.2 para geração 3D, além de recursos de texto para fala pelo backend OpenMOSS, incluindo clonagem e design de voz. Como consentimento não vem embutido na clonagem, quem habilitar o recurso ainda precisa cuidar da autorização e do risco de personificação.

A release também adicionou o roteamento por `collection.router` às APIs de chat, completions e responses. A rota escolhida aparece no corpo, no campo `x_lemonade_route`, ou no cabeçalho `x-lemonade-route`. Assim dá para ver qual combinação de engine e modelo atendeu à chamada, em vez de deixar essa decisão escondida dentro do servidor.

O ModelScope passou a ser o segundo registro remoto, ao lado do Hugging Face, e o FastFlowLM ganhou instalação automática no Linux. O projeto publicou pacotes para Windows, Ubuntu 24.04 ou posterior, Debian 13, Fedora 43 e 44 e macOS. Também há artefatos embutíveis para Ubuntu, Windows e macOS. É uma lista ampla, mas IA local não garante que todo backend rode bem em qualquer hardware. Ainda é preciso escolher uma combinação compatível de engine, modelo e artefato.

Para quem já usa Docker, talvez a parte mais importante esteja nas breaking changes. O container agora roda sem root, com UID 10001, e o cache mudou de `/root/.cache` para `/opt/lemonade/.cache`. Tirar o root reduz o impacto potencial de um comprometimento, mas os volumes persistentes criados pela versão antiga podem continuar com um ownership incompatível.

Durante a atualização, volumes nomeados talvez precisem ser recriados ou receber `chown` para o novo usuário. É o tipo de melhoria de segurança que merece aplauso depois da migração, não antes de conferir se o serviço ainda consegue escrever no próprio cache.

Os recursos e as compatibilidades vêm das notas do projeto; não houve benchmark independente nesta apuração. A versão aumentou bastante a API local, mas o uso em produção ainda pede testes do backend escolhido, da aceleração disponível e, desta vez, das permissões do volume.

Fonte: [notas de lançamento do Lemonade 11.0.0](https://github.com/lemonade-sdk/lemonade/releases/tag/v11.0.0).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://www.zoom.com/en/trust/security-bulletin/zsb-26014/
  - https://www.bleepingcomputer.com/news/security/zoom-warns-of-critical-account-takeover-vulnerability/
  - https://thinkingmachines.ai/model-card/inkling/
  - https://thinkingmachines.ai/news/introducing-inkling/
  - https://github.com/xai-org/grok-build
  - https://github.com/xai-org/grok-build/commit/c1b5909ec707c069f1d21a93917af044e71da0d7
  - https://x.ai/open-source
  - https://github.com/lemonade-sdk/lemonade/releases/tag/v11.0.0
-->
