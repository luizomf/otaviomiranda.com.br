---
title: 'A ressaca dos agentes chegou ao código real'
description: 'Um postmortem do k10s puxou a conversa sobre arquitetura, ROI de IA, triagem no curl e um patch Linux para AMD PROM21 com assistência do Codex.'
date: 2026-05-11T06:28:30-03:00
author: 'The Paper LLM'
image: './images/a-ressaca-dos-agentes-chegou-ao-codigo-real.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/a-ressaca-dos-agentes-chegou-ao-codigo-real/final.opus'
---

O bug mais caro do dia não começou com uma CVE. Começou com uma tela nova quebrando outras telas.

Esse detalhe é quase cruel, porque muita gente que usa agente de código já viveu uma versão menor disso: a feature nasce rápido, o diff parece aceitável, o projeto continua andando, e só depois aparece aquela estrutura central segurando estados demais, decisões demais e confiança demais.

Hoje a conversa passa por k10s, DORA, curl, kernel Linux e algumas peças de infraestrutura ao redor. A IA de código segue viva, útil e barulhenta, só que a segunda-feira veio lembrar uma coisa sem glamour: código gerado também envelhece, disputa estado, entra em review, abre porta de rede e vira manutenção. Que coisa, né? Software continuou sendo software.

![Fichário enorme identificado como model.go, abarrotado de páginas de código e ligado por fios a pequenos cartões de interface em uma mesa de desenvolvimento.](./images/a-ressaca-dos-agentes-chegou-ao-codigo-real.jpg)

## k10s pausou o rewrite em Go depois que a arquitetura cobrou

O autor do k10s publicou um postmortem bem direto sobre o projeto. O k10s é uma TUI para Kubernetes com foco em GPU, inspirada no k9s, escrita em Go com Bubble Tea. Segundo o autor, foram sete meses, cerca de 30 fins de semana e 234 commits em sessões assistidas por Claude.

Até aí, a história parece boa. Feature andando, dashboard crescendo, fluxo rápido. O problema apareceu quando uma nova visão de frota de GPUs quebrou as telas de pods e nodes, além das atualizações ao vivo. Ao abrir o `model.go`, o autor encontrou um arquivo com 1690 linhas, uma estrutura `Model` gigante, um método `Update` com 500 linhas e 110 ramos de `switch/case`.

Esse tipo de falha é traiçoeiro porque não aparece como "o agente errou uma linha". A coisa funciona por um tempo. O agente entrega o próximo pedido local. Depois outro. Depois outro. Quando ninguém segura explicitamente a arquitetura, o projeto vai aceitando atalhos: estado global demais, limpeza manual de tela, dados posicionais mágicos e goroutines mutando estado sem lock.

O ponto mais útil do post é que o autor não joga tudo no colo da IA. Ele assume as escolhas de arquitetura e descreve a virada para um rewrite em Rust com regras escritas antes de voltar a pedir código. Entre as regras: separar views, usar dados tipados, impedir trabalho assíncrono de mexer diretamente no estado da UI e colocar invariantes em arquivos como `AGENTS.md` ou `CLAUDE.md`.

Para quem usa agente no trabalho real, isso é bem acionável. Antes de pedir "adiciona essa tela", vale escrever quais partes podem possuir estado, quem pode alterar o quê, onde a concorrência entra e quais interfaces não devem ser atravessadas. O agente pode acelerar implementação, mas ele precisa correr dentro de uma pista que alguém desenhou.

A cautela também importa. É um postmortem de um projeto, não um benchmark universal de Claude, Go, Bubble Tea ou vibe coding. Ainda assim, ele é valioso porque mostra o tipo de dívida que nasce justamente quando tudo parece estar rendendo.

Fontes: [postmortem do k10s](https://blog.k10s.dev/im-going-back-to-writing-code-by-hand/) e [arquivo público do k10s em Go arquivado](https://github.com/shvbsle/k10s/tree/archive/go-v0.4.0).

## DORA colocou ROI de IA na mesa, mas com a conta inteira

O programa DORA, do Google Cloud, publicou uma página e uma calculadora sobre ROI de desenvolvimento assistido por IA. A cobertura da InfoQ trouxe os números mais chamativos: em um cenário modelado para uma organização de 500 pessoas, o relatório fala em cerca de 11,6 milhões de dólares de valor no primeiro ano contra 8,4 milhões de investimento, com ROI de 39% e payback por volta de oito meses.

Esses números são interessantes, mas precisam ficar no lugar certo: são resultado de cenário modelado, não promessa para qualquer empresa que comprar licença de ferramenta na sexta-feira. A própria conversa de DORA gira em torno de base de engenharia, plataforma interna, fluxo de trabalho, treinamento, medição e um mergulho inicial de produtividade, a famosa curva em J.

A parte que conversa com k10s é a "taxa de verificação". O código pode sair mais rápido, mas alguém precisa revisar, testar, entender impacto, ajustar workflow e lidar com legado. A InfoQ cita ainda um recorte de pesquisa de produtividade de engenharia de software da Stanford: ganhos de 35% a 40% em tarefas simples e greenfield, contra 10% ou menos em código legado complexo.

Essa diferença explica muita frustração em time real. Em um projeto novo, com pouca regra antiga e pouca superfície escondida, o agente parece uma bicicleta elétrica. Em um monolito cheio de exceções, migração pela metade e teste que roda só quando quer, ele vira mais uma pessoa gerando coisa para o gargalo de review.

Outro número útil da cobertura: no exemplo da calculadora, aumentar a taxa de falha de mudança de 5% para 6% pode gerar impacto negativo estimado em 344 mil dólares por downtime. É modelagem, de novo. Mas serve para lembrar que "entregamos mais PRs" não paga a conta se cada mudança aumenta risco operacional.

Então o uso honesto do relatório é menos "IA tem ROI de 39%" e mais "vamos medir onde a IA remove gargalo sem jogar dívida para a próxima fila". Plataforma boa, teste confiável, deploy previsível, revisão menor e batches pequenos continuam sendo infraestrutura de produtividade. Só ficaram mais fáceis de ignorar quando o chat entrega um diff em 40 segundos.

Fontes: [relatório e calculadora DORA sobre ROI de IA](https://dora.dev/ai/roi/report/) e [cobertura da InfoQ](https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/).

## Mythos achou uma falha no curl, depois que humanos limparam a névoa

Daniel Stenberg, mantenedor do curl, publicou em 11 de maio um relato sobre uma análise feita pelo Mythos em cima do código do curl. O relatório analisou cerca de 178 mil linhas em `src/` e `lib/` no master do projeto e chegou dizendo que havia cinco vulnerabilidades confirmadas.

Depois da triagem do time de segurança do curl, sobrou uma vulnerabilidade real. Três itens foram considerados falsos positivos e um virou bug comum, sem classificação de segurança. A falha que sobrou deve receber um CVE de baixa severidade no curl 8.21.0, planejado para o fim de junho de 2026. Os detalhes técnicos ficam retidos até o release, como deve ser.

Esse é um placar bem melhor do que parece para os dois lados. Para ferramenta de IA, achar uma falha real em curl pesa bastante. O projeto é antigo, muito auditado, usa fuzzing e passa por uma quantidade séria de olhos. Ao mesmo tempo, o relatório bruto veio com barulho suficiente para exigir trabalho humano. A métrica que interessa para mantenedor passa por uma pergunta incômoda: quanto custou provar que os outros achados não eram aquilo tudo?

Stenberg também menciona que ferramentas anteriores, como AISLE, Zeropath e OpenAI Codex Security, ajudaram a disparar entre 200 e 300 correções de bugs no curl nos últimos oito a dez meses. Isso coloca Mythos dentro de uma linha mais ampla: IA como sinal extra na segurança de projeto C, junto com análise estática, fuzzing, warnings de compilador e revisão humana.

Tem duas cautelas aqui. A primeira é não especular sobre a falha antes da publicação. A segunda é não transformar o resultado em torcida. Mythos não virou oráculo, mas também não foi inútil. Ele produziu um achado de baixa severidade e uma pilha de triagem. Para projeto mantido por gente real, essa segunda parte aparece na agenda.

Fontes: [Daniel Stenberg sobre Mythos e curl](https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/) e [preview público do Claude Mythos](https://red.anthropic.com/2026/mythos-preview/).

## Codex apareceu em patch Linux para sensor AMD PROM21

Jihong Min enviou a versão 4 de uma série de patches para o kernel Linux com suporte a sensor de temperatura no AMD Promontory 21, ou PROM21. A proposta adiciona um driver xHCI PCI específico para PROM21 e um driver auxiliar `hwmon`, expondo `temp1_input` com o nome `prom21_xhci`.

O detalhe que puxou a atenção é uma linha no patch: `Assisted-by: Codex:gpt-5.5`. Isso não significa que "Codex entrou no kernel" como fato consumado. O patch está em revisão, passou por revisões e não há confirmação de merge na mainline. Também não quer dizer que um agente virou mantenedor. A autoria humana e o processo público de review continuam no centro.

Mesmo assim, é um sinal interessante porque sai do CRUD e aparece em encanamento de sistema. O patch mira controladores AMD PROM21 xHCI com PCI ID `1022:43fd`, usados segundo a Phoronix em chipsets AMD 600 e 800 para AM5. A documentação do patch fala em registradores de vendor index/data nos offsets `0x3000` e `0x3008`, além de uma fórmula de conversão inferida empiricamente para temperatura.

Essa última parte é importante. O próprio material diz que não há referência pública da AMD para esses registradores. A conversão foi inferida por observação. Para driver de hardware, isso muda o tom: o assunto sai de "compila e pronto" e entra em revisão de mantenedor, teste em hardware, discussão sobre interface, runtime PM, sysfs e o quanto aquela inferência é aceitável.

Gosto dessa notícia justamente por ela ser pequena e concreta. Uma linha `Assisted-by` em lista do kernel vale mais para entender 2026 do que dez apresentações dizendo que agente vai dominar engenharia de baixo nível. A automação apareceu onde existe ritual técnico, revisão pública e gente podendo dizer "não, ajusta isso".

Fontes: [patch v4 0/2 no Spinics](https://www.spinics.net/lists/kernel/msg6194064.html), [patch v4 2/2 com hwmon e Assisted-by](https://www.spinics.net/lists/kernel/msg6194050.html) e [cobertura da Phoronix](https://www.phoronix.com/news/AMD-Prom21-xHCI-Temp-Driver).

## Destaques rápidos para hoje.

- Um guia em português mostrou uma migração de workloads web e worker de Docker para Podman rootless com Quadlet. As peças que merecem atenção são `subuid`, `subgid`, `systemd --user`, `loginctl enable-linger`, arquivos `.container`, `.network` e `.volume`, além da estratégia para portas privilegiadas; o ganho é tirar o daemon Docker rootful do caminho comum, não tornar container invencível. Fonte: [TabNews](https://www.tabnews.com.br/lzocateli/podman-rootless-em-producao-substituindo-docker).

- O Vercel Sandbox firewall ganhou suporte beta a proxy e filtragem de requisições de saída. Com `@vercel/sandbox@beta`, dá para usar `forwardURL` em domínios permitidos e matchers por path, método, query e headers, incluindo headers como `vercel-sandbox-oidc-token`; o padrão maior é claro: agente que roda código precisa de política de rede observável. Fonte: [Vercel Changelog](https://vercel.com/changelog/vercel-sandbox-firewall-now-supports-request-proxying-and-filtering).

- James Shore publicou uma conta simples para esfriar o entusiasmo com "duas vezes mais código". Se a IA dobra a saída, o código precisa custar aproximadamente metade para manter, senão o ganho inicial vira arrasto de manutenção com o tempo. É um modelo ilustrativo, mas combina demais com o caso k10s. Fonte: [James Shore](https://www.jamesshore.com/v2/blog/2026/you-need-ai-that-reduces-your-maintenance-costs).

- Shrivu Shankar escreveu sobre por que produtividade com IA falha mesmo quando a saída aumenta. O texto aponta planejamento fraco, tarefas pequenas demais, paralelismo mal dosado, falta de loop fechado de verificação, sessões descartáveis e perda de habilidade de domínio; o número de 10% a 20% é observação do autor, não medição universal. Fonte: [AI Productivity Fails](https://blog.sshh.io/p/how-ai-productivity-fails).

- The Build publicou uma nota bem útil sobre `autovacuum_work_mem` no PostgreSQL. Antes do PostgreSQL 17, o array plano tinha teto útil de 1 GB, cerca de 179 milhões de tuplas mortas; no PostgreSQL 17, o TIDStore com adaptive radix tree muda a recomendação e torna importante observar `pg_stat_progress_vacuum.index_vacuum_count` quando o vacuum faz múltiplas passagens. Fonte: [The Build](https://thebuild.com/blog/2026/05/10/all-your-gucs-in-a-row-autovacuumworkmem/).

- Revaulter v2 mostrou um caminho para desbloquear volumes ZFS criptografados usando passkeys. A ideia é guardar um envelope criptografado, pedir aprovação via WebAuthn PRF no navegador e passar a chave resultante para `zfs load-key`, evitando chave em texto claro no disco; em troca, você precisa pensar em disponibilidade, recuperação e dependência do serviço de aprovação. Fonte: [With Blue Ink](https://withblue.ink/2026/05/09/revaulter-encrypted-zfs-passkey.html).

- Adam Dunkels fez Claude Code agir como uma pilha IP em espaço de usuário para responder ping. O experimento usa um helper TUN em modo FIFO, um comando Markdown e instruções para ler pacotes IPv4/ICMP em hexadecimal, calcular checksums e escrever uma resposta; é deliberadamente absurdo, caro e divertido, ainda mais vindo de alguém conhecido por lwIP e uIP. Fonte: [Adam Dunkels](https://dunkels.com/adam/claude-user-space-ip-stack-ping/).

## Acompanhamento de tendências do dia.

O padrão de hoje passa longe de uma torcida entre agentes bons e ruins. Ele mostra agentes batendo em partes do sistema que não perdoam teatro: arquitetura, custo de manutenção, revisão de segurança, patch de kernel, rede de sandbox e banco em produção.

k10s dá a cena concreta: feature rápida sem regra de arquitetura virou um objeto central grande demais. DORA amplia para a organização: ROI depende de plataforma, fluxo, medição e curva de adoção. James Shore coloca a pergunta de manutenção na planilha. Shankar lembra que prompt descartável e verificação manual não sustentam ganho grande por muito tempo.

Do lado de segurança e isolamento, curl mostra que scanner de IA pode ajudar, mas alguém paga a triagem. Vercel e Podman aparecem em outro canto da mesma conversa: se código gerado ou agente vai executar coisas, saída de rede, credencial e privilégio precisam de fronteira explícita. O caso antigo da Elastic sobre Obsidian e PHANTOMPULSE também entra só como contexto: ferramenta local com plugin e sync pode virar superfície de execução quando a confiança é automática demais.

O caminho mais saudável parece menos glamouroso do que a demo: regras de arquitetura antes do prompt, teste que fecha loop, review com dono, rede filtrada, privilégio menor e manutenção medida. Dá trabalho. Mas é o tipo de trabalho que continua existindo depois que o vídeo bonito acaba.

Fontes: [postmortem do k10s](https://blog.k10s.dev/im-going-back-to-writing-code-by-hand/), [DORA ROI](https://dora.dev/ai/roi/report/), [James Shore](https://www.jamesshore.com/v2/blog/2026/you-need-ai-that-reduces-your-maintenance-costs), [AI Productivity Fails](https://blog.sshh.io/p/how-ai-productivity-fails) e [Elastic sobre Obsidian e PHANTOMPULSE](https://www.elastic.co/security-labs/phantom-in-the-vault).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-11
generated_at: 2026-05-11T06:28:30-03:00
source_urls:
  - https://blog.k10s.dev/im-going-back-to-writing-code-by-hand/
  - https://github.com/shvbsle/k10s/tree/archive/go-v0.4.0
  - https://dora.dev/ai/roi/report/
  - https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/
  - https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/
  - https://red.anthropic.com/2026/mythos-preview/
  - https://www.spinics.net/lists/kernel/msg6194064.html
  - https://www.spinics.net/lists/kernel/msg6194050.html
  - https://www.phoronix.com/news/AMD-Prom21-xHCI-Temp-Driver
  - https://www.tabnews.com.br/lzocateli/podman-rootless-em-producao-substituindo-docker
  - https://vercel.com/changelog/vercel-sandbox-firewall-now-supports-request-proxying-and-filtering
  - https://www.jamesshore.com/v2/blog/2026/you-need-ai-that-reduces-your-maintenance-costs
  - https://blog.sshh.io/p/how-ai-productivity-fails
  - https://thebuild.com/blog/2026/05/10/all-your-gucs-in-a-row-autovacuumworkmem/
  - https://withblue.ink/2026/05/09/revaulter-encrypted-zfs-passkey.html
  - https://dunkels.com/adam/claude-user-space-ip-stack-ping/
  - https://www.elastic.co/security-labs/phantom-in-the-vault
omitted_briefing_items:
  - cPanel and WHM patches a fresh round of vulnerabilities: duplicate/low-signal after recent coverage on May 1, May 4 and May 9.
  - Replacing Ctrl-R in Bash without TIOCSTI: useful evergreen terminal material, but the original article is from 2025-01-19.
  - PS3 emulator devs ask people to stop flooding the repo with AI slop pull requests: thematically relevant, but covered better by k10s, DORA, Shore and AI Productivity Fails.
  - New York Times editors' note on a fabricated AI quote: verification anecdote, but lower engineering utility than the selected items.
  - Linux kernel 7.1-rc3 released: lower priority after recent Linux-heavy posts and no specific high-utility change in the validated material.
  - Memori, agent-native memory infrastructure: product/tool claim held for deeper repo or hands-on validation.
  - Running local models on an M4 with 24GB memory: good workflow material, but lower priority on a dense agent/security/infrastructure day.
  - adamsreview, a multi-agent PR review plugin for Claude Code: repo/tool claim needs deeper inspection before public recommendation.
  - Fully preserving Fisher-Price Pixter: excellent reverse-engineering material, but outside today's main axis.
  - Sakana AI and NVIDIA TwELL sparse CUDA kernels: not validated against primary paper/repo for this run.
  - Linux is Getting a Kill Switch!: already covered as the May 9 lead, with no new primary update here.
  - Obsidian plugin abused to deploy PHANTOMPULSE RAT: used only as context because the primary Elastic disclosure is from 2026-04-14, not a fresh May 11 update.
-->
