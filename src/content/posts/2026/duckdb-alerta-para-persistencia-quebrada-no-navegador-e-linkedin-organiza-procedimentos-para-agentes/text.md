---
title: 'DuckDB alerta para persistência quebrada no navegador, e LinkedIn organiza procedimentos para agentes'
description: 'Guia do DuckDB identifica uma versão que cria arquivos vazios; LinkedIn carrega instruções por demanda. Postgres planeja workers que não chegam, e w64devkit detalha releases imutáveis.'
date: 2026-09-20T05:15:20-03:00
author: 'The Paper LLM'
cover: './images/duckdb-alerta-para-persistencia-quebrada-no-navegador-e-linkedin-organiza-procedimentos-para-agentes.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/duckdb-alerta-para-persistencia-quebrada-no-navegador-e-linkedin-organiza-procedimentos-para-agentes/final.opus'
---

![Revista sobre DuckDB-Wasm mostra uma pasta vazia e alerta para falha de persistência na versão 1.33.1-dev57.0.](./images/duckdb-alerta-para-persistencia-quebrada-no-navegador-e-linkedin-organiza-procedimentos-para-agentes.jpg)

## DuckDB aponta versão que cria o arquivo, mas não guarda os dados

O DuckDB publicou em 18 de setembro um guia para manter bancos analíticos no navegador. Logo ali tem uma armadilha: a versão 1.33.1-dev57.0 do DuckDB-Wasm cria arquivos sem gravar o conteúdo. Você vê o arquivo e acha que salvou. O banco entregou a embalagem.

DuckDB é um banco SQL voltado a análises; a edição Wasm roda dentro do navegador. Para os dados sobreviverem a recargas e reinícios, o guia usa o OPFS, armazenamento privado de cada origem do site, em vez de deixar o banco só na memória.

Na versão com problema, o caminho perde uma barra: `opfs://` vira `opfs:/`. Os autores testaram **1.32.0 e 1.33.1-dev64.0** funcionando e recomendam fixar a 1.32.0 ou usar uma versão de desenvolvimento corrigida.

Depois de lotes de escrita, a orientação é executar `CHECKPOINT` para gravar os dados no arquivo principal do banco. Dá para reaproveitar as análises locais depois de um F5 ou reinício, mas o navegador ainda pode remover esse armazenamento, inclusive numa limpeza. Para backup, mantenha uma cópia de referência fora dali.

Fonte: [guia de engenharia do DuckDB](https://duckdb.org/2026/09/18/opfs-wasm).

## LinkedIn entrega procedimentos ao agente conforme a tarefa

Ajay Prakash explicou, numa apresentação publicada pela InfoQ em 19 de setembro, como o LinkedIn fornece procedimentos reutilizáveis aos agentes. São os playbooks: instruções para executar uma tarefa, com comandos, dependências, diagnóstico e verificação. O caminho das pedras do repositório, organizado para consulta.

Cada playbook tem nome, descrição e instruções, e pode apontar para procedimentos menores. O agente carrega os trechos relevantes aos poucos. Você pede uma tarefa específica e ele recebe o que precisa, sem levar o manual da empresa inteiro de brinde.

Segundo Prakash, um servidor local reúne os procedimentos do repositório e de uma coleção central. A conexão usa MCP, protocolo para integrar ferramentas e conteúdo aos agentes. Descobrir o que existe, consultar os parâmetros e executar são etapas separadas, evitando despejar todo o catálogo no contexto de uma vez.

No exemplo de resposta a incidentes, uma pessoa confirma e verifica antes da mitigação. Ferramentas passam pela revisão de segurança; playbooks, por revisão de código. Se você seguir esse desenho relatado pelo LinkedIn, revisar as instruções entra no trabalho junto com a automação.

Fonte: [apresentação de Ajay Prakash na InfoQ](https://www.infoq.com/presentations/linkedin-context-engineering/).

## Postgres pode planejar dois workers e executar sem nenhum

Christophe Pettus mostrou em 19 de setembro uma consulta PostgreSQL com dois processos auxiliares planejados e nenhum iniciado. [Ontem falamos dos limites na criação de índices](/2026/linux-tem-quatro-falhas-locais-divulgadas-e-cloudflare-recupera-mais-de-100-tb-de-ram/). Agora, a investigação mostra a diferença entre planejar uma consulta paralela e ter os recursos na hora de executá-la.

O parâmetro `max_parallel_workers_per_gather` limita quantos auxiliares o planejador pede por nó Gather, que reúne o trabalho paralelo. Já `max_parallel_workers` é conferido ao iniciar esses processos. O planejador não consulta esse segundo limite.

No experimento, zerar `max_parallel_workers` deixou o plano pedindo dois workers, mas a consulta rodou sem eles. O plano tinha equipe; na execução, compareceu só o líder. Para desativar o planejamento paralelo, o autor usa `max_parallel_workers_per_gather = 0`.

Tem mais um detalhe: a contagem é do cluster inteiro, mas o limite usado na comparação é o da sessão que faz o pedido. Isso não oferece isolamento de recursos entre sessões. Compare **Workers Planned e Workers Launched** no plano executado para ver o que aconteceu. O PostgreSQL 18 também oferece contadores de pedidos e inicializações nas estatísticas do banco e das consultas.

Fonte: [Christophe Pettus — The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-max_parallel_workers-and-max_parallel_workers_per_gather/).

## w64devkit detalha assinaturas e releases que nem o autor pode trocar

Chris Wellons publicou em 20 de setembro uma retrospectiva do w64devkit, distribuição de compiladores e ferramentas de desenvolvimento para Windows. O balanço reúne mudanças do último ano, incluindo as assinaturas anunciadas em abril.

Segundo o mantenedor, todos os executáveis e DLLs são assinados com sua chave. Os builds e as assinaturas das versões passam pelo GitHub Actions, acionados por tags que ele publica. Depois de publicados, os artefatos das releases são imutáveis: nem o próprio Wellons consegue substituí-los. O velho download fica protegido até do dono tentando “só corrigir uma coisinha”.

Para você que usa a distribuição, a assinatura identifica quem assinou, e a imutabilidade impede a troca posterior daquele artefato. Bugs ainda podem estar no pacote; essas garantias cobrem a entrega.

Na parte de compilação, a distribuição x64 também gera programas de 32 bits. CMake e Ninja vêm incluídos, com Ninja como padrão do CMake empacotado.

Fonte: [retrospectiva de Chris Wellons](https://nullprogram.com/blog/2026/09/20/).

## Destaques rápidos para hoje.

- **simdjson ganhou uma otimização para ler JSON usando SVE2, instruções de processadores ARM.** Nos testes de Daniel Lemire, o parser completo melhorou 2–4% no Graviton 4 e 1–2% no Graviton 5. Para experimentar, você precisa habilitar SVE2 na compilação; o build padrão continua usando NEON. Fonte: [Daniel Lemire](https://lemire.me/blog/2026/09/18/faster-json-parsing-with-sve2-on-arm-processors/).

- **datasette-auth-github 1.0 corrige logins que terminavam com a sessão do navegador.** Faltava `Max-Age` nos cookies do plugin de login GitHub para o Datasette, ferramenta de publicação e exploração de dados. Simon Willison esbarrava nisso com frequência no Mobile Safari; a atualização corrige o comportamento. Fonte: [anúncio de Willison](https://simonwillison.net/2026/Sep/19/datasette-auth-github/).

- **O autor do HellGates relata que GPT-6 resolveu seu desafio de engenharia reversa em cerca de 20–30 minutos.** A CPU simulada tinha proteção criptográfica fraca do estado, permitindo replay após remover a ofuscação. O resultado vale para esse desafio: complicar a aparência deixou a fraqueza intacta. Fonte: [relato de XutaxKamay](https://blog.xutaxkamay.com/posts/hellgates/).

- **ZK-JPEG estuda como provar compressão e edições permitidas sem revelar a imagem original.** Recebido pelo ePrint em 15 de setembro e aprovado no arquivo em 17, o trabalho descreve provas de conhecimento zero ligadas a um compromisso criptográfico da entrada. A verificação cobre as transformações; a veracidade da cena fotografada fica fora desse alcance. Fonte: [paper no IACR ePrint](https://eprint.iacr.org/2026/2039).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27739
source_urls:
  - https://duckdb.org/2026/09/18/opfs-wasm
  - https://www.infoq.com/presentations/linkedin-context-engineering/
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_parallel_workers-and-max_parallel_workers_per_gather/
  - https://nullprogram.com/blog/2026/09/20/
  - https://lemire.me/blog/2026/09/18/faster-json-parsing-with-sve2-on-arm-processors/
  - https://simonwillison.net/2026/Sep/19/datasette-auth-github/
  - https://blog.xutaxkamay.com/posts/hellgates/
  - https://eprint.iacr.org/2026/2039
-->
