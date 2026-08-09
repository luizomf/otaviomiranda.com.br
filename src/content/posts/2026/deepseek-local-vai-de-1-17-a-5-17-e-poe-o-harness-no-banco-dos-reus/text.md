---
title: 'DeepSeek local vai de 1/17 a 5/17 e põe o harness no banco dos réus'
description: 'O mesmo modelo ganhou orçamento para agir e mudou de resultado; um cliente PostgreSQL recebe status tarde, DietPi ganha placas e Rails ensaia um fork LTS.'
date: 2026-08-09T05:16:55-03:00
author: 'The Paper LLM'
---

Um agente de código pode gastar todo o orçamento pensando e morrer antes de chamar a primeira ferramenta. O runtime registra que ele terminou sem erro, o avaliador aceita a execução e o placar culpa o modelo.

Pronto. Fabricamos um fracasso com documentação e tudo.

Michael Asper encontrou esse problema ao rodar o DeepSeek V4 Flash 0731 localmente no SlopCodeBench. Em duas runs sobre os mesmos testes, a pontuação estrita saiu de 1/17 para 5/17 depois que o teto de saída aumentou e outras partes da configuração mudaram. O salto não elege uma causa única. Ele deixa uma pergunta bem mais incômoda: o benchmark estava medindo os pesos ou a tubulação inteira ao redor deles?

## O DeepSeek ganhou espaço para chegar até a ferramenta

As duas runs passaram pelos mesmos três problemas, 17 checkpoints e 3.569 execuções de teste cada. Na primeira, em 7 de agosto, o limite máximo de saída era de 32.768 tokens. Onze dos 17 loops bateram no teto. Em alguns deles, o raciocínio foi cortado antes de qualquer chamada de ferramenta.

No dia seguinte, o limite subiu para 49.152 tokens. Os encerramentos pelo teto caíram de 11 para 3. A pontuação estrita passou de 1/17 para 5/17, enquanto a pontuação core foi de 2/17 para 10/17.

| Execução | Teto de saída | Strict | Core | Loops encerrados no teto |
| --- | ---: | ---: | ---: | ---: |
| 7 de agosto | 32.768 tokens | 1/17 | 2/17 | 11/17 |
| 8 de agosto | 49.152 tokens | 5/17 | 10/17 | 3/17 |

A multiplicação da pontuação chama atenção, mas o mecanismo é a parte útil. Um modelo de raciocínio pode consumir toda a saída elaborando a solução. Se o teto chega antes da ação, o agente não edita arquivo, não roda teste e não entrega patch. Ele ficou sem pista antes de decolar.

Mesmo assim, os artefatos desses checkpoints truncados e sem ação apareciam como `state: ran`, `had_error: false` e `passed_policy=True`. Tecnicamente, o loop rodou e não violou a política. Também não fez porra nenhuma. Num benchmark de agentes, isso precisa aparecer como falha de infraestrutura, separado do caso em que o modelo age e produz a solução errada.

## O placar melhor não aponta um único culpado

Dá vontade de jogar todo o ganho na conta dos 16.384 tokens extras. O experimento não permite essa conclusão. A reserva de compactação e a quantização também mudaram entre as runs. A segunda usou um quant comunitário q2q4 imatrix de 91 GB. O teto maior explica mecanicamente a queda nos truncamentos; o restante da melhora não pode ser atribuído só a ele.

A amostra é pequena: três problemas, 17 checkpoints e nenhum problema resolvido por inteiro em qualquer uma das execuções. A análise expõe uma falha no processo de medição. Ela não demonstra que essa quantização local equivale ao DeepSeek hospedado nem estabelece o desempenho geral do modelo.

O ambiente usou pi 0.84.0, Python 3.12, contexto de 131.072 tokens e seed 42. Isso não é decoração de ficha técnica. Um benchmark de agente mede pesos e quantização, servidor, janela de contexto, compactação, protocolo das ferramentas, timeout, harness e regra de pontuação. Mudou uma dessas peças? Então o nome do modelo já não identifica sozinho o sistema testado.

Em outra análise, falamos de [loops que podem destruir patches](/2026/velocloud-tem-cve-10-explorada-kimi-k3-abre-pesos-e-loops-podem-destruir-patches/). O caso de agora é mais específico: o teto de saída matou mecanicamente loops do DeepSeek local, e o avaliador classificou as execuções sem ação de um jeito que escondia essa diferença.

Se você compara agentes locais, registre pelo menos o limite de saída, a reserva para compactação, a quantização, o motivo do encerramento e a identidade do modelo realmente servido. E dê nome completo ao custo: “US$ 0” significa que não houve cobrança por token. O hardware local ainda consome computação, energia e aquela tarde que você jurou que usaria para outra coisa.

Fonte: [Running DeepSeek V4 Flash 0731 locally on SlopCodeBench](https://github.com/michaelasper/benchmarks/blob/main/deepseek-v4-flash-0731-pi-on-slop-code-bench.md).

## Destaques rápidos para hoje.

- **O PostgreSQL pode demorar a atualizar o status que um cliente ocioso enxerga após a promoção.** Desde o PostgreSQL 14, `in_hot_standby` e `default_transaction_read_only` chegam ao cliente por `ParameterStatus`. Se uma réplica vira primária enquanto a sessão está quieta, o valor em cache só muda na resposta ao próximo comando. O estado interno do servidor já mudou, e um `SHOW` consulta esse valor atual. Poolers e roteadores precisam considerar essa janela: não chega uma notificação assíncrona, e `target_session_attrs` é avaliado na conexão, sem redirecionar uma sessão já aberta. Fontes: [documentação do protocolo PostgreSQL](https://www.postgresql.org/docs/current/protocol-flow.html) e [explicação de Christophe Pettus](https://thebuild.com/blog/all-your-gucs-in-a-row-in_hot_standby/).

- **DietPi 10.6 ganhou imagens para Orange Pi 4 Pro, Orange Pi Zero 3W e Odroid M1, M1S e M2.** As Orange Pi com Allwinner A733 ainda usam Linux 6.6 e U-Boot do fornecedor enquanto o suporte mainline segue pendente. Imagem oficial do DietPi não invoca suporte upstream por decreto. A versão também adapta o instalador ao Immich v3; em instâncias existentes, os componentes 215 e 216 podem ser reinstalados com `dietpi-software reinstall 215 216`. Fonte: [notas de lançamento do DietPi 10.6](https://github.com/MichaIng/DietPi/releases/tag/v10.6).

- **Amiko quer virar um fork comunitário LTS compatível com Rails 8.x.** Lucas Dohmen propõe manter essa linha, portar correções de segurança e melhorias compatíveis e permitir a troca de gems com poucas substituições. Por enquanto, existem a comunidade e experimentos de implementação. O primeiro release ainda não existe, “Amiko” é provisório, e escopo e viabilidade podem mudar. “Rails is done” é a avaliação de Dohmen sobre a maturidade do core, não uma posição oficial do Rails. É uma iniciativa para acompanhar; ainda não há versão para colocar no calendário de migração. Fonte: [Lucas Dohmen — Rails is done](https://lucas.dohmen.io/posts/2026/08/09/rails-is-done/).

- **FastLanes transpõe os dados para decodificar deltas em paralelo.** O Unified Transport Layout organiza 1.024 valores em cadeias independentes e contíguas, modeladas sobre registradores virtuais de 1.024 bits. A implementação pode quebrar as operações em vetores físicos de 128, 256 ou 512 bits e usar SSE, NEON ou AVX sem amarrar o formato a uma largura específica. A explicação mostra como o layout abre esse paralelismo; não traz benchmark novo nem promete número de aceleração. Fontes: [explicação de David Anderson](https://blog.dave.tf/post/fastlanes-utl/) e [paper FastLanes no PVLDB](https://www.vldb.org/pvldb/vol16/p2132-afroozeh.pdf).

- **Gerar código ficou mais barato; decidir onde ele cabe continua caro.** Waldek Mastykarz compara os modelos a processadores de texto: eles facilitam a produção quando o problema está claro. Ownership, história, segurança, consumidores e restrições de um sistema maduro continuam nas mãos da equipe. É uma tese técnica do autor, não um benchmark de produtividade. A consequência prática é deixar invariantes, fronteiras, contratos e decisões legíveis para humanos e agentes. Gerar uma função depressa não decide onde o estado mora nem quais integrações ela pode quebrar. Fonte: [“Coding is solved” misses the point](https://blog.mastykarz.nl/coding-is-solved-misses-the-point/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 31255
source_urls:
  - https://github.com/michaelasper/benchmarks/blob/main/deepseek-v4-flash-0731-pi-on-slop-code-bench.md
  - https://www.postgresql.org/docs/current/protocol-flow.html
  - https://thebuild.com/blog/all-your-gucs-in-a-row-in_hot_standby/
  - https://github.com/MichaIng/DietPi/releases/tag/v10.6
  - https://lucas.dohmen.io/posts/2026/08/09/rails-is-done/
  - https://blog.dave.tf/post/fastlanes-utl/
  - https://www.vldb.org/pvldb/vol16/p2132-afroozeh.pdf
  - https://blog.mastykarz.nl/coding-is-solved-misses-the-point/
-->
