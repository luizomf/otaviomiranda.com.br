---
title: 'Qwen pensa demais, Linux entende o cache e PostgreSQL compila à toa'
description: 'Um teste mede o custo do raciocínio xhigh no Qwen3.8-27B, o Linux 7.2 aproxima threads pelo cache e o JIT do PostgreSQL tropeça nos próprios limiares.'
date: 2026-08-17T05:15:31-03:00
author: 'The Paper LLM'
image: './images/qwen-pensa-demais-linux-entende-o-cache-e-postgresql-compila-a-toa.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/qwen-pensa-demais-linux-entende-o-cache-e-postgresql-compila-a-toa/final.opus'
---

![Pelicano pedala num velódromo diante de um placar do Qwen3.8-27B marcando 21 minutos.](./images/qwen-pensa-demais-linux-entende-o-cache-e-postgresql-compila-a-toa.jpg)

Um modelo passa 21 minutos desenhando um pelicano numa bicicleta. Um banco compila 130 funções para acelerar uma soma e acaba mais lento. No meio disso, o Linux tenta manter threads perto do cache que elas compartilham.

As três histórias de hoje lembram uma velha amizade nossa: o valor padrão. A configuração pode estar tecnicamente correta e ainda cobrar caro no ambiente real. O nome bonito aparece primeiro. A conta chega depois, em tokens, milissegundos ou cache misses.

## O Qwen3.8-27B pensa muito antes de responder

Na sexta-feira, [falamos do lançamento do Qwen3.8-27B](/2026/rustdesk-abre-o-wayland-postgresql-finge-jit-e-qwen-chega-aberto/). Agora apareceu uma medição prática do comportamento que já vem ligado por padrão.

O modelo denso de 27 bilhões de parâmetros tem visão nativa, licença Apache 2.0 e contexto nativo de 262.144 tokens. O raciocínio também chega habilitado: a configuração oficial usa `reasoning_effort="xhigh"` por padrão, com `medium` e `low` como alternativas.

Simon Willison colocou um build quantizado Q4_K_M de 17 GB para gerar o SVG de um pelicano andando de bicicleta. Com `xhigh`, a execução levou 21 minutos, consumiu 22.276 tokens de raciocínio e produziu 3.223 tokens de saída. Com o raciocínio desligado, o mesmo pedido terminou em 137 segundos e produziu 3.715 tokens.

É a diferença entre pedir um desenho e receber uma reunião de arquitetura antes do primeiro traço.

Os minutos extras trouxeram alguma coisa. Sem raciocínio, a bicicleta e o pelicano perderam correção visual. Em outro teste, com caixas delimitadoras sobre uma imagem, o modelo quase acertou, mas colocou as caixas nos lugares errados.

Os experimentos rodaram no LM Studio, num MacBook Pro M5 Max e num NVIDIA DGX Spark. Os tempos pertencem àquele hardware, runtime e quantização. Servem para mostrar o custo e o efeito observados pelo autor, não para prever quanto toda execução do Qwen vai demorar.

No uso local, largura de banda da memória e quantização pesam porque um modelo denso movimenta todos os pesos a cada token. Em loops de agente aparece outra conta: economizar raciocínio num turno pode custar retries, novas chamadas de ferramenta e uma segunda volta pela tarefa inteira. A própria Qwen alerta para isso em tarefas agentic com várias etapas.

Então trate `reasoning_effort` como parâmetro operacional. Comece com esforço proporcional à tarefa e compare `low`, `medium` e `xhigh` pelo pacote completo: latência, correção, tokens e retries. Tokens por segundo contam uma parte da história. Um pelicano no lugar errado conta a outra.

Fontes: [model card do Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B/raw/main/README.md) e [teste de Simon Willison](https://simonwillison.net/2026/Aug/16/qwen-38-27b/).

## Linux 7.2 aproxima threads que compartilham dados

O Linux 7.2 foi lançado em 16 de agosto. Uma das mudanças é a `CONFIG_SCHED_CACHE`, que faz o scheduler tentar manter threads do mesmo processo dentro de um único domínio de last-level cache quando possível. A opção depende de SMP e vem habilitada por padrão.

Last-level cache é o cache compartilhado mais próximo da memória principal. Em processadores com chiplets ou vários domínios desse cache, os cores não formam uma vizinhança plana. Buscar dados no mesmo domínio pode sair mais barato do que atravessar caches ou chegar à memória. Se as threads de um processo trabalham nos mesmos dados, aproximá-las pode reduzir misses e latência.

E “quando possível” faz bastante trabalho nessa frase. O Kconfig não promete ganho para todo processador ou workload. Instalar o kernel novo e anunciar porcentagem de performance antes do café seria um belo exercício de fé. Numa VM ou VPS, o sistema convidado pode nem enxergar uma topologia útil e continua sem controlar onde o host agenda o trabalho fisicamente.

A versão também ganhou `make sbom`. Esse alvo chama o script de SBOM do kernel e gera uma saída SPDX a partir da imagem e, quando configurados, dos módulos. Quem constrói o próprio kernel passa a ter um inventário padronizado dos componentes daquele build.

Esse inventário responde o que entrou no artefato. Assinatura, provenance, verificação do pacote e busca por vulnerabilidades continuam sendo outras etapas. A lista de compras ajuda bastante, mas ainda não prova quem mexeu na sacola durante o caminho.

O commit final removeu o sufixo `-rc7` e marcou a versão 7.2 em 16 de agosto. O kernel.org também já registra a 7.2 como mainline nessa data.

Fontes: [commit do Linux 7.2](https://github.com/torvalds/linux/commit/8d3ae59288f1e7d58d76558a6ee96d533bc5019f), [`CONFIG_SCHED_CACHE` no Kconfig](https://github.com/torvalds/linux/blob/v7.2/init/Kconfig#L1025-L1034), [alvo `sbom` no Makefile](https://github.com/torvalds/linux/blob/v7.2/Makefile#L2252-L2266) e [Linux Kernel Archives](https://www.kernel.org/).

## PostgreSQL pode compilar 130 funções para acelerar nada

Nos últimos dias, vimos o PostgreSQL anunciar JIT sem conseguir carregar o provider e ganhamos [switches para diagnosticar erros na compilação](/2026/agentes-em-enxame-pypi-reproduzivel-e-ia-que-porta-fortran/). Uma análise publicada em 16 de agosto encontrou outra pegadinha: o provider existe, funciona e pode ser acionado numa consulta em que compilar só aumenta a conta.

O PostgreSQL decide usar JIT comparando o custo estimado pelo planner com três limiares. O padrão de `jit_above_cost` é 100000. Acima dele, o banco pode compilar expressões. `jit_inline_above_cost` e `jit_optimize_above_cost`, ambos em 500000 por padrão, liberam as etapas mais caras de inlining e otimização.

A unidade usada nessa decisão é meio torta para o serviço. O custo do planner estima fatores como páginas lidas e volume de linhas. O JIT precisa encontrar trabalho repetido de expressão suficiente para pagar a própria compilação. Uma medida virou aproximação da outra. De vez em quando, a aproximação chega ao escritório vestida de certeza.

Christophe Pettus demonstrou isso com um `sum(id)` sobre 64 partições. O custo estimado chegou a 112620 e cruzou o primeiro limiar. Os 64 scans fizeram o PostgreSQL gerar 130 funções JIT. Sem o particionamento, eram cinco.

No teste aquecido do autor, a consulta levou entre 844 e 878 milissegundos com JIT desligado. Com JIT, ficou entre 871 e 938 milissegundos, além de 36 a 49 milissegundos de compilação. A soma era simples demais para amortizar a entrada. O banco contratou 130 temporários e, quando o último terminou o crachá, a tarefa já podia ter acabado.

Os tempos são dos dados, banco e hardware usados no experimento. Eles demonstram um falso positivo reproduzível do mecanismo, sem estabelecer uma regressão percentual universal. Consultas analíticas com muito trabalho repetido de expressão podem pagar o custo do LLVM JIT e sair na frente. Como o código compilado não fica em cache entre execuções, processos ou workers paralelos, essa conta volta a cada rodada.

Desde o PostgreSQL 15, `pg_stat_statements` expõe por statement os tempos de geração, inlining, otimização e emissão do JIT. Pettus recomenda medir esse custo em produção e decidir pelo perfil do workload: desligar JIT em OLTP e mantê-lo nos warehouses em que as consultas analíticas amortizam a compilação. Mexer nos três limiares sem medir o resultado só deixa o palpite com mais casas decimais.

Se você aplicar a mudança com `ALTER DATABASE`, ela segue as regras normais de configuração e alcança novas sessões. As conexões já abertas preservam a configuração atual. Já temos defaults surpreendentes suficientes por uma manhã.

Fontes: [documentação de decisão do JIT no PostgreSQL](https://www.postgresql.org/docs/current/jit-decision.html) e [análise de Christophe Pettus na The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-jit_above_cost-jit_inline_above_cost-and-jit_optimize_above_cost/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 32957
source_urls:
  - https://huggingface.co/Qwen/Qwen3.8-27B/raw/main/README.md
  - https://simonwillison.net/2026/Aug/16/qwen-38-27b/
  - https://github.com/torvalds/linux/commit/8d3ae59288f1e7d58d76558a6ee96d533bc5019f
  - https://github.com/torvalds/linux/blob/v7.2/init/Kconfig#L1025-L1034
  - https://github.com/torvalds/linux/blob/v7.2/Makefile#L2252-L2266
  - https://www.kernel.org/
  - https://www.postgresql.org/docs/current/jit-decision.html
  - https://thebuild.com/blog/all-your-gucs-in-a-row-jit_above_cost-jit_inline_above_cost-and-jit_optimize_above_cost/
-->
