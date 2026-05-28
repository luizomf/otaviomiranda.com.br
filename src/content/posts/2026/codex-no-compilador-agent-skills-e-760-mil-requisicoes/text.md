---
title: 'Codex no compilador, agent skills e 760 mil requisições'
description: 'Agentes ajudaram a achar miscompiles em LLVM, ptxas e AMDGPU; skills viraram cadeia de suprimentos; logs server-side expuseram bots no WordPress; e PostgreSQL, CUDA, Workshop e Kubernetes entraram na conta da verificação.'
date: 2026-05-28T05:39:17-03:00
author: 'The Paper LLM'
image: './images/codex-compilador-verificar.jpg'
---

![Placa industrial vermelha com o texto "VERIFICAR COMPILADOR", tags LLVM, ptxas e AMDGPU penduradas em um portão de inspeção e um pequeno selo Codex ao lado.](./images/codex-compilador-verificar.jpg)

Tem uma parte do trabalho de software que quase nunca fica bonita no anúncio: provar.

Provar que o programa fez o que parecia fazer. Provar que o pacote instalado não trouxe um presente escondido. Provar que o tráfego que chegou no servidor veio de gente, robô, crawler ou tentativa de invasão. Provar que uma configuração de banco, tão simples no exemplo da documentação, não virou um encanamento cheio de pressão em produção.

Esse trabalho sempre existiu. A diferença é que agora tem mais coisa sendo gerada, sugerida, instalada e automatizada em volta dele. Código chega mais rápido. Relatório chega maior. Agente chama ferramenta. Bot abre pull request. Dashboard mostra uma parte da realidade e deixa outra parte batendo direto no servidor.

A parte cara virou separar o que aconteceu de verdade do que só pareceu organizado.

Hoje isso aparece em quatro lugares bem diferentes. Um engenheiro usou agentes para ajudar a caçar falhas silenciosas em compiladores. Um relatório novo olhou para skills de agentes como uma cadeia de suprimentos. Um estudo de caso brasileiro mostrou que analytics de JavaScript não contam tudo que um site paga para servir. E um texto sobre PostgreSQL lembrou que replicação lógica parece simples até você enxergar o pipeline inteiro dentro do banco.

O assunto parece espalhado, mas a pergunta é parecida: quando a máquina produz mais ação, quem paga a verificação?

## Codex e Claude ajudaram a achar miscompiles em LLVM, ptxas e AMDGPU

A história mais forte do dia veio da SemiAnalysis. Justin Lebar descreveu um fluxo de trabalho usando Codex e Claude para ajudar em fuzzing e inspeção de código de compiladores. Os alvos citados incluem LLVM, o `ptxas` da NVIDIA e LLVM AMDGPU.

Miscompile é um daqueles bugs que dão vontade de fingir que não existem. O seu código parece certo. O compilador aceita. O binário sai. Só que a transformação feita no meio muda o comportamento. Às vezes o erro só aparece em uma combinação específica de otimização, arquitetura, tipo de dado e azar. É uma falha silenciosa, e falha silenciosa é o tipo de coisa que entra na sala sem fazer barulho e senta no sofá.

O uso interessante de IA aqui passa longe da fantasia de "o modelo virou engenheiro de compilador". A fonte descreve agentes ajudando em tarefas repetitivas e caras: gerar programas aleatórios, mutar casos de teste, procurar caminhos suspeitos no código, evitar cair sempre no mesmo bug e reduzir um exemplo quebrado até ele virar um reproducer menor.

Essa última parte importa muito. Encontrar um comportamento estranho é só o começo. Um mantenedor precisa de um caso pequeno, claro e repetível. Se o relatório chega gigante, misturado e cheio de variação inútil, a triagem vira uma segunda investigação. O agente pode ajudar a fazer essa faxina, desde que tenha um harness decente e alguém que entenda o domínio acompanhando.

No caso do LLVM, a conversa passa por `instcombine`, uma área ligada a otimizações internas. No caso do `ptxas`, a dificuldade aumenta porque o compilador é fechado. Quando você não consegue ver nem corrigir o código do outro lado, evitar duplicata e continuar fuzzing depois do primeiro achado fica mais chato. Apertar "gerar bug" e esperar a cesta sair cheia seria cômodo demais para o universo permitir.

O que muda é economia. Trabalho de verificação que antes era tedioso demais, caro demais ou simplesmente esquecido pode virar um orçamento de agente: tokens, tempo de máquina, harness, revisão humana e fila de triagem. Ainda é custo. Só que talvez passe a caber em mais lugares.

Para times comuns, a lição é mais humilde do que parece. Antes de pedir para um agente reescrever um sistema, talvez valha pedir para ele procurar comportamento quebrado em volta de testes, parsers, compiladores, serializadores e caminhos críticos. Geração de código ficou barata. Comportamento verificado continua sendo a parte que salva a terça-feira.

Fontes: [SemiAnalysis](https://newsletter.semianalysis.com/p/finding-miscompiles-for-fun-not-profit) e [FuzzX no GitHub](https://github.com/SemiAnalysisAI/FuzzX/).

## Agent skills começam a parecer dependências com permissão

Um relatório técnico publicado no arXiv em 27 de maio olhou para outro pedaço da mesma fase: o ecossistema de skills para agentes. O título é "Technical Report: Exploring the Emerging Threats of the Agent Skill Ecosystem". Os autores dizem ter analisado 3.984 skills de agentes em marketplaces importantes.

Os números chamam atenção. O relatório fala em 76 payloads maliciosos confirmados e diz que 13,4% das skills analisadas tinham pelo menos um problema de nível crítico, segundo os próprios autores. Entre as classes citadas aparecem roubo de credencial, instalação de backdoor, downloads suspeitos, prompt injection e exfiltração de dados.

Skill pode soar como uma coisinha fofa de produtividade. Um arquivo de instrução, uma receita, um atalho. Só que, dependendo do ambiente, ela também pode carregar código, chamar ferramenta, baixar coisa, receber permissão e influenciar o que o agente faz com arquivos e credenciais. Aí o nome simpático vira embalagem; o risco parece mais com dependência.

No dia 25, falamos de [TrapDoor mexendo em `CLAUDE.md` e `.cursorrules`](/2026/trapdoor-mexeu-no-claudemd-e-a-revisao-virou-a-noticia/). Aquela história passava por pacotes em registries e arquivos de instrução. A novidade agora é olhar para a própria skill instalável como item de cadeia de suprimentos.

Isso não significa que toda skill é malware esperando um café desatento. Significa que popularidade, nome bonito e promessa de produtividade não bastam como sinal de confiança. Quem instala skill precisa pensar como pensa em pacote: quem publicou, o que mudou, de onde baixa, se roda script, que permissões pede, qual versão está presa no projeto e que acesso recebe no runtime.

Para time que usa agente com acesso a repositório, shell, navegador, arquivos locais ou serviços internos, o controle começa simples e meio sem glamour. Revisar código da skill. Fixar versão. Evitar atualização remota silenciosa. Rodar em ambiente isolado. Reduzir credenciais. Separar token de experimento de token de produção. Registrar ação executada.

É o mesmo filme da cadeia de suprimentos, só que agora o pacote pode falar com confiança, ler contexto e pedir ferramenta. Software adora reciclar problemas antigos com interface nova.

Fontes: [arXiv](https://arxiv.org/abs/2605.28588v1) e contexto de ecossistema em [Snyk](https://snyk.io/fr/blog/snyk-vercel-securing-agent-skill-ecosystem/).

## 760 mil requisições mostraram o que GA e Plausible não veem no servidor

O terceiro bloco é menos "grande laboratório" e mais vida real de quem mantém site. Um autor no TabNews publicou um estudo de caso com cerca de três meses de dados em 22 sites WordPress, somando 760 mil requisições capturadas.

A graça está na diferença entre visita humana e tráfego que o servidor realmente atende. Google Analytics e Plausible são úteis para entender público, página, origem e comportamento de navegador. Eles não foram feitos para contar tudo que bate no backend: crawler, robô, tentativa de login, varredura de caminho, chamada sem JavaScript e requisição que nunca carregou pixel nenhum.

No dataset do autor, crawlers de IA apareceram como categoria visível. A publicação fala em cerca de 15 mil hits desse tipo ao longo da medição, com user agents como GPTBot, OAI-SearchBot, ClaudeBot e PerplexityBot aparecendo no breakdown. Também foram relatadas cerca de 89,5 mil requisições automatizadas de atacante, algo perto de 12% do tráfego total naquele conjunto.

Segura a vontade de transformar isso em estatística universal da internet. São 22 sites WordPress de um operador, não um censo global. Mesmo assim, como estudo de caso, é muito bom para acordar aquela parte do cérebro que só olha pageview e acha que o servidor ficou em paz.

A implementação descrita mistura um pequeno pixel JavaScript assíncrono, um beacon no `shutdown` do WordPress para pegar requisições que o pixel não vê, partições mensais no MariaDB e agregação horária. Também entram detalhes de performance de usuário real, como Web Vitals, com LCP, INP e CLS.

Para quem tem blog, página de curso, site institucional, documentação ou WordPress em VPS, essa história vira observabilidade de pobre no melhor sentido. Logs do Nginx ou OpenLiteSpeed, registros do Cloudflare, um endpoint simples, hooks do WordPress e agregação barata já mostram muita coisa. Você começa a separar gente, crawler, brute force em `wp-login.php`, chamadas a XML-RPC, barulho em `admin-ajax` e probes que nem chegam perto do dashboard de marketing.

Também ajuda a conversar com custo. Crawler que não converte pode gastar CPU. Ataque automatizado pode pressionar PHP, banco e cache. Web Vital ruim pode aparecer só para usuário real, enquanto seu gráfico bonito mostra média confortável. O servidor não quer saber se a requisição entrou no relatório executivo. Ele serviu, gastou e pronto.

Fontes: [TabNews](https://www.tabnews.com.br/aporce/760k-requisicoes-depois-o-que-ga-e-plausible-nao-te-mostram-sobre-seu-proprio-site) e [SysWP Radar no WordPress.org](https://wordpress.org/plugins/syswp-radar/).

## PostgreSQL logical replication é um pipeline dentro do banco

Agora vamos para um assunto menos chamativo e muito útil: replicação lógica no PostgreSQL. A Fastware, ligada à Fujitsu, publicou um texto para quem quer entender e contribuir nesse subsistema.

No exemplo simples, replicação lógica parece um publish/subscribe de banco. Você publica mudanças de uma tabela ou conjunto de tabelas, cria uma assinatura do outro lado e espera que os dados sigam caminho. Para explicar no começo, esse modelo ajuda. Para operar e mexer no código de verdade, ele é pequeno demais.

Por baixo, tem pipeline. Primeiro o banco gera WAL, o log de mudanças. Depois entra a decodificação lógica, que transforma aquelas mudanças em algo que pode ser enviado em nível mais próximo de linha e tabela. Em seguida vêm streaming, workers de apply no subscriber e sincronização inicial ou complementar. Cada etapa tem vida própria, estado próprio e jeitos próprios de quebrar o humor do DBA.

O texto da Fastware fala com contribuidores, então aparecem detalhes como snapshots históricos de catálogo, `relcache`, buscas em catálogo e comportamento específico de worker. A tradução para quem está operando é esta: uma decisão pequena no caminho quente pode custar caro se roda para cada mudança replicada. Consulta de catálogo desnecessária, cache mal usado ou comportamento diferente entre versões pode virar latência, erro de apply ou surpresa em upgrade.

Isso importa porque replicação lógica não vive só em laboratório. Ela aparece em migração entre versões, integração com analytics, troca gradual de arquitetura, multi-região e manutenção de sistemas que não podem simplesmente parar para um `pg_dump` com café longo. Quando funciona, parece mágica educada. Quando começa a atrasar, cada etapa do pipeline ganha voz.

Para backend e DBA, o texto é um convite a pensar por estágio. O problema está no publisher ou no subscriber? Na geração do WAL, na decodificação, no streaming, no apply worker ou na sincronização? É bug, gargalo, incompatibilidade entre versões, carga de dados ou expectativa errada sobre o que a replicação lógica promete?

E, antes de sair mexendo em configuração como quem gira botão de rádio antigo, perfil. O próprio artigo fala de contribuição em performance, bug fix, refatoração e feature nova. Isso pede entender o caminho inteiro. Banco de dados também é software distribuído quando quer. Às vezes ele só veste uma camiseta com elefante para parecer mais calmo.

Fontes: [Fastware / Fujitsu](https://www.postgresql.fastware.com/blog/how-to-hack-logical-replication-in-postgresql) e [documentação do PostgreSQL](https://www.postgresql.org/docs/current/logical-replication.html).

## Destaques rápidos para hoje.

- A NVIDIA anunciou o CUDA 13.3 em 27 de maio. A versão traz CUDA Python 1.0, CUDA Tile para C++ e o CompileIQ, com a NVIDIA falando em ganho de até 15% em kernels selecionados de GEMM e attention; ótimo para acompanhar, mas número de fornecedor precisa encontrar seu próprio kernel antes de virar promessa. Fontes: [NVIDIA Developer Blog](https://developer.nvidia.com/blog/nvidia-cuda-13-3-enhances-gpu-development-with-tile-programming-in-c-compiler-autotuning-and-python-updates/) e [Phoronix](https://www.phoronix.com/news/NVIDIA-CUDA-13.3-Released).

- A Canonical apresentou o Workshop, ferramenta para descrever ambientes de desenvolvimento em YAML e rodar isso em containers LXD não privilegiados. Ele pode compor SDKs como Ollama, OpenCode, NVIDIA CUDA e AMD ROCm, além de pedir acesso a recursos do host, como display e SSH agent; a parte boa é reprodutibilidade, a parte sensível é revisar exatamente que ponte o ambiente abre para a máquina real. Fontes: [Canonical](https://canonical.com/blog/introducing-workshop-sandboxed-development-environments) e [OMG! Ubuntu](https://www.omgubuntu.co.uk/2026/05/canonical-workshop-dev-environments).

- Artificial Analysis e IBM publicaram o ITBench-AA, começando por tarefas de SRE em incidentes Kubernetes. A fonte relata modelos de fronteira abaixo de 50%, com placares de topo em 47% e 46%, em 59 tarefas que incluem logs, traces, métricas, eventos, alertas e topologia; benchmark depende do desenho, mas aqui funciona como banho frio útil em marketing de "agente vai operar tudo sozinho". Fonte: [Hugging Face Blog / IBM Research](https://huggingface.co/blog/ibm-research/itbench-aa).

- A NVIDIA também publicou o Dynamo Snapshot para reduzir cold start de workloads de inferência em Kubernetes. A ideia usa conceitos de checkpoint e restore, com CRIU e `cuda-checkpoint`, para evitar GPU alocada e parada enquanto réplica sobe; parece uma direção boa para custo e SLA, mas ainda deve ser lida como história técnica cedo demais para virar milagre de autoscaling. Fonte: [NVIDIA Developer Blog](https://developer.nvidia.com/blog/nvidia-dynamo-snapshot-fast-startup-for-inference-workloads-on-kubernetes/).

- Um ensaio da Mendral provocou com a ideia de que você não deveria atualizar dependências no automático em 2026. A frase é feita para cutucar, mas a leitura responsável é melhor: update de dependência é contribuição de código não confiável, então precisa de revisão de origem, mantenedor, script de install, diff transitivo, reachability e comportamento no CI. Congelar pacote vulnerável também dá ruim; só troca o tipo de sofrimento. Fonte: [Mendral](https://www.mendral.com/blog/you-should-not-update).

## Acompanhamento de tendências do dia.

O padrão que atravessa o dia é que agentes estão deixando de ser só caixa de chat. Eles começam a ganhar runtime, protocolo de registro, app com interface, SDK de arquivo, ambiente de desenvolvimento e política de permissão. Quando isso acontece, a pergunta muda de "qual prompt eu escrevo?" para "qual fronteira esse sistema respeita?".

O AX se apresenta como um runtime distribuído de agentes em prévia inicial, com Kubernetes, suporte a MCP e A2A, auditoria e políticas. O `auth.md`, da WorkOS, propõe um jeito em Markdown para registro e descoberta de agentes. O Skybridge descreve MCP apps como aplicações React que podem rodar em Claude, ChatGPT, VS Code e clientes compatíveis. O Files SDK aponta para ferramentas prontas de acesso a arquivos, incluindo modos de leitura e gates de aprovação.

Nenhum desses nomes precisa virar padrão amanhã para o sinal importar. A direção já é suficiente: agente passa a ter identidade, arquivo, app, permissão, log, rollback e superfície para usuário. A parte que parece produto novo é também parte do controle operacional.

Para avaliar essa leva sem cair em vitrine de ferramenta, dá para usar uma checklist simples: de onde veio, que escopo tem, onde roda, que arquivo enxerga, qual rede acessa, como registra ação, como revoga permissão, como mede acerto e como volta atrás quando dá ruim. O resto é detalhe importante, mas detalhe em cima dessa mesa.

Fontes: [AX](https://agentexecutor.io/), [WorkOS sobre auth.md](https://workos.com/blog/agent-registration-with-auth-md), [Skybridge](https://www.skybridge.tech/), [Files SDK](https://files-sdk.dev/) e [Canonical Workshop](https://canonical.com/blog/introducing-workshop-sandboxed-development-environments).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-28
generated_at: 2026-05-28T05:39:17-03:00
source_urls:
  - https://newsletter.semianalysis.com/p/finding-miscompiles-for-fun-not-profit
  - https://github.com/SemiAnalysisAI/FuzzX/
  - https://arxiv.org/abs/2605.28588v1
  - https://snyk.io/fr/blog/snyk-vercel-securing-agent-skill-ecosystem/
  - https://www.tabnews.com.br/aporce/760k-requisicoes-depois-o-que-ga-e-plausible-nao-te-mostram-sobre-seu-proprio-site
  - https://wordpress.org/plugins/syswp-radar/
  - https://www.postgresql.fastware.com/blog/how-to-hack-logical-replication-in-postgresql
  - https://www.postgresql.org/docs/current/logical-replication.html
  - https://developer.nvidia.com/blog/nvidia-cuda-13-3-enhances-gpu-development-with-tile-programming-in-c-compiler-autotuning-and-python-updates/
  - https://www.phoronix.com/news/NVIDIA-CUDA-13.3-Released
  - https://canonical.com/blog/introducing-workshop-sandboxed-development-environments
  - https://www.omgubuntu.co.uk/2026/05/canonical-workshop-dev-environments
  - https://huggingface.co/blog/ibm-research/itbench-aa
  - https://developer.nvidia.com/blog/nvidia-dynamo-snapshot-fast-startup-for-inference-workloads-on-kubernetes/
  - https://www.mendral.com/blog/you-should-not-update
  - https://agentexecutor.io/
  - https://workos.com/blog/agent-registration-with-auth-md
  - https://www.skybridge.tech/
  - https://files-sdk.dev/
omitted_briefing_items:
  - BadHost / Starlette / FastAPI: already covered as a main block on 2026-05-27, with mitigation and primary sources.
  - GPU mining malware via SEO poisoning and chatbot recommendations: already led the 2026-05-27 public post through Microsoft source coverage.
  - Cloudflare Claude Managed Agents: original source is from 2026-05-19 and works better as agent-runtime context than as today's news.
  - NVIDIA LocateAnything 3B: benchmark and license claims need more validation before public coverage.
  - OpenAI Erdos Unit Distance Result: original source is from 2026-05-20 and weaker for today's practical verification/production frame.
  - WordPress at 23: valid governance context, but lower urgency than the server-side analytics WordPress/VPS story.
  - Heterogeneous GPU weighting, GH200 versus RTX 6000 Blackwell, and Defense by Accumulation: Reddit-first or not checked enough in this pass.
  - Cognition funding: fresh but funding-focused and less directly useful than the verified technical stories.
-->
