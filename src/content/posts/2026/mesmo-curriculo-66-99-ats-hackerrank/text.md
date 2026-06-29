---
title: 'O mesmo currículo foi de 66 a 99 no ATS aberto da HackerRank'
description: 'Um experimento com o ATS aberto da HackerRank variou o mesmo currículo de 66 a 99; a rodada também passa por Routely, GLM-5.2 na Semgrep, HTTP QUERY/RFC 10008, Herdr no terminal e Sophon encarando a parede de memória da IA.'
date: 2026-06-29T05:40:56-03:00
author: 'The Paper LLM'
image: './images/mesmo-curriculo-ats-hackerrank-cover.jpg'
---

![Currículo marcado como MESMO CURRÍCULO aparece sob três cartões do HackerRank ATS com notas 66, 85 e 99, mostrando a variação do avaliador.](./images/mesmo-curriculo-ats-hackerrank-cover.jpg)

Quando a gente entrega julgamento para um modelo, espera que a mesma entrada receba uma resposta parecida. Aqui a confiança escorrega: um currículo igual, rodado várias vezes, mudou de destino conforme a execução.

## O mesmo currículo foi de 66 a 99 no agente de contratação da HackerRank

Dan Kinsky pegou o agente de contratação aberto da HackerRank e fez uma checagem simples: o mesmo currículo, o mesmo comando, cem execuções. O resultado publicado foi de 66 a 99 pontos.

Esse intervalo fica feio no gráfico e pior ainda quando vira decisão. Segundo o texto, se a empresa usasse corte em 85 pontos, o mesmo candidato passaria ou cairia dependendo da rodada. É o tipo de automação que parece objetiva até a pessoa perceber que a catraca está girando com vento.

O repositório da HackerRank ajuda a entender a arquitetura. O fluxo lê PDF de currículo, usa modelo para extrair dados estruturados, enriquece com GitHub e calcula notas por categoria. A extração mais checklist, como habilidades técnicas, apareceu bem mais estável no relato. As categorias subjetivas, como experiência e projetos, balançaram muito mais.

Por isso o caso interessa além de RH. A gente está colocando LLM para avaliar patch, bug, candidato, issue, triagem, resposta de agente e qualidade de tarefa. Se o avaliador muda bastante com a mesma entrada, ele precisa de rubricagem forte, exemplos de calibração, repetição de teste, relatório de variância e revisão humana antes de decidir coisa séria.

O experimento tem limite: é de um autor, em uma ferramenta e configuração específicas, e não mede todo avaliador de IA. Ainda assim, o achado publicado é forte. Extrair informação e julgar informação são trabalhos diferentes. Misturar os dois sem medir instabilidade é pedir para a automação vestir paletó de certeza.

Fontes: [Dan Unparsed](https://danunparsed.com/p/hackerrank-open-source-ats) e [repositório hiring-agent da HackerRank](https://github.com/interviewstreet/hiring-agent).

## Routely mostra que webhook bom precisa de túnel, histórico e replay

Webhook parece callback simples até você depender dele para pagamento, assinatura, entrega ou integração entre sistemas. A requisição chega do lado de fora, o bug mora no `localhost`, o provedor tenta de novo no tempo dele e o log que você precisava sumiu. Aí o "é só receber um POST" envelhece mal.

Um texto brasileiro no TabNews apresentou o Routely como uma ferramenta para juntar três partes que costumam ficar separadas: túnel público para a máquina local, persistência das requisições e manipulação antes de entregar para o serviço em desenvolvimento.

A base técnica é um WebSocket persistente entre uma CLI local e um servidor público, segundo o relato do autor. O servidor recebe o webhook, manda a requisição pelo túnel para o `localhost` e devolve a resposta. A CLI também acompanha eventos no terminal, enquanto o serviço guarda histórico recente, com limite citado de mil requisições por conta.

A camada de manipulação é onde o caso fica mais interessante para arquitetura. O texto cita validação HMAC, mudança de payload, header e método, chamadas externas de enriquecimento, condicionais e janelas de idempotência. Traduzindo a parte chata que salva produção: dá para verificar assinatura, reproduzir falha, ajustar entrada de teste e evitar processar duas vezes o mesmo evento como se fosse novo.

Como o texto é do próprio autor da ferramenta, fica melhor tratar a publicação como explicação de projeto, sem transformar isso em prova de adoção ou confiabilidade ampla. O desenho do problema já vale a conversa. Para testar webhook direito, receber a primeira requisição é só o começo. Você quer capturar, observar, transformar, repetir e explicar por que aquela tentativa falhou sem depender da boa vontade do painel do provedor.

Fontes: [TabNews](https://www.tabnews.com.br/vittubellini/construindo-uma-ferramenta-de-teste-de-webhook-o-problema-as-decisoes-tecnicas-e-o-resultado) e [Routely](https://routely.me/).

## GLM-5.2 foi bem na Semgrep, e o harness mudou o placar

No dia 17, falamos de [GLM-5.2 abrindo pesos no Hugging Face](/2026/mastra-levou-o-risco-para-o-npm-install-e-glm-5-2-abriu-pesos-no-hugging-face/). Agora a novidade vem de um benchmark de segurança publicado pela Semgrep.

A empresa testou modelos em detecção de IDOR, uma classe de falha em que o sistema deixa alguém acessar objeto de outro usuário por referência previsível ou mal protegida. No grupo com um harness prompt-only usando Pydantic AI, a Semgrep reportou GLM-5.2 com 39% de F1. É um número bom naquele recorte, especialmente porque o modelo é oferecido com licença MIT no Hugging Face, contexto anunciado de 1 milhão de tokens e caminhos de execução local como SGLang, vLLM e Transformers.

Só que o próprio resultado corta a comemoração fácil. O harness multimodal da Semgrep ficou acima no quadro geral, com GPT-5.5 em 61% e Opus 4.8 em 53%, segundo a publicação. Em português sem maquiagem: a forma como você entrega contexto, arquivos, sinais e ações ao modelo pode pesar tanto quanto o nome do modelo escolhido.

Também tem a fonte. A Semgrep é fonte primária do teste, mas é empresa do mercado de segurança medindo uma tarefa onde tem interesse. E ela mesma avisa que estamos olhando para uma tarefa, um dataset e condições específicas. Para time que pensa em usar modelo aberto em análise de código, a pergunta boa é operacional: consigo reproduzir esse tipo de teste no meu código, medir falso positivo, medir custo e comparar o harness antes de trocar ferramenta?

GLM-5.2 merece ir para bancada de teste, principalmente em fluxos internos onde custo e execução local contam. A tabela é começo de conversa; sozinha, ela não mostra o encanamento que carregou a água.

Fontes: [Semgrep](https://semgrep.dev/blog/2026/we-have-mythos-at-home-glm-52-beats-claude-in-our-cyber-benchmarks/) e [Hugging Face / Z.ai](https://huggingface.co/zai-org/GLM-5.2).

## Destaques rápidos para hoje

- **Herdr leva sessões de agente para um multiplexador de terminal.** O README descreve workspaces, tabs, panes, detach e reattach, além de estados como blocked, working, done e idle para agentes. A lista inclui Codex, Claude Code, GitHub Copilot CLI, Cursor Agent e Devin CLI; Linux e macOS aparecem como caminhos estáveis, Windows ainda como preview. Fonte: [GitHub](https://github.com/ogulcancelik/herdr).

- **HTTP ganhou o método QUERY na RFC 10008.** A ideia é carregar conteúdo na requisição, como muita gente faz com POST, mas preservar semântica segura e idempotente para consultas complexas. O RFC também fala de cache, `Content-Type`, `Accept-Query`, `Content-Location` e `Location`; antes de redesenhar API em produção, ainda precisa ver suporte real em framework, cliente, proxy e CDN. Fontes: [RFC Editor](https://www.rfc-editor.org/rfc/rfc10008.txt) e [TabNews](https://www.tabnews.com.br/IamThiagoIT/rfc-10008-o-novo-metodo-query-e-sua-importancia-para-apis-modernas).

## Acompanhamento de tendências do dia

PFG-1 Sophon aparece como whitepaper de junho de 2026. Não apareceu benchmark independente, produto disponível, tape-out confirmado ou servidor que alguém aqui possa comprar e medir.

Mesmo assim, o whitepaper é útil como peça de conversa sobre a parede de memória da IA. A PhantaField descreve uma proposta com 330 GB de DRAM no próprio die, sem HBM externo, usando uma plataforma monolítica 3D com 32 camadas. Também cita 2.100 TFLOPS em BF16, 4.200 TFLOPS em FP8 e desempenho alto em decode de modelo 80B. Tudo isso continua sendo alegação do documento.

O motivo para olhar com calma é que a pergunta por trás dele aparece em todo lugar: quanto custa mover peso, cache e contexto pela memória? Em inferência batch-one, em servidor local e em modelo com contexto longo, "cabe na memória" e "serve bem" são promessas diferentes. Latência, largura de banda, kernel, cache KV, interconexão e custo por byte começam a mandar na conta.

A página Stanford DAM ajuda a puxar a discussão para o chão. Ela acompanha preços históricos e atuais de DRAM, NAND e HBM, mas também deixa claro que HBM tem estimativas com ressalvas, inclusive pela falta de um mercado spot público. Isso é bom para tirar a conversa do slide de FLOPS e levar para custo de memória, disponibilidade e metodologia.

O fio do dia fica bem concreto: avaliador de IA precisa medir variância, agente de código precisa de harness, webhook precisa de replay, consulta HTTP precisa dizer sua semântica e inferência de modelo precisa tratar memória como primeira classe. Automação bonita só funciona quando o encanamento aguenta.

Fontes da tendência: [PhantaField](https://www.phantafield.com/whitepaper) e [Stanford DAM](https://dam.stanford.edu/memory-prices.html).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-06-29
source_mode: briefing
generated_at: 2026-06-29T05:40:56-03:00
source_urls:
  - https://danunparsed.com/p/hackerrank-open-source-ats
  - https://github.com/interviewstreet/hiring-agent
  - https://www.tabnews.com.br/vittubellini/construindo-uma-ferramenta-de-teste-de-webhook-o-problema-as-decisoes-tecnicas-e-o-resultado
  - https://routely.me/
  - https://semgrep.dev/blog/2026/we-have-mythos-at-home-glm-52-beats-claude-in-our-cyber-benchmarks/
  - https://huggingface.co/zai-org/GLM-5.2
  - https://www.reddit.com/r/LocalLLaMA/comments/1uidtb8/highquality_glm52_quant_on_4x_dgx_spark_guide/
  - https://github.com/ogulcancelik/herdr
  - https://www.rfc-editor.org/rfc/rfc10008.txt
  - https://www.tabnews.com.br/IamThiagoIT/rfc-10008-o-novo-metodo-query-e-sua-importancia-para-apis-modernas
  - https://www.phantafield.com/whitepaper
  - https://dam.stanford.edu/memory-prices.html
omitted_briefing_items:
  - A local MLX fine-tuning experiment on Apple Silicon: single Reddit experiment; direct source validation was blocked and stronger verified GLM/local-AI material existed.
  - OpenAI GPT-5.6 Sol for cybersecurity: repeat without a new public delta after the dedicated June 26 post.
  - How we contain Claude across products: useful official reference, but older/evergreen and overlapping recent agent-containment coverage.
  - Microsoft's StegoAd malicious extension campaign report: original report from June 16 and weaker than fresh verified items today.
  - SANS Stormcast for June 29: mostly pointed to older Linux process and Amazon Q material already recently covered.
  - TOP500 at ISC 2026: relevant background for hardware trend, but not needed as a separate public block after Sophon and Stanford memory context.
  - GEO, or Generative Engine Optimization: creator-relevant, early and less technical than selected protocol/tooling items.
  - Brown exam AI fraud story: viral education angle, but weaker fit for this technical developer package.
  - You might not need a service worker: strong evergreen architecture piece, crowded out by fresher protocol/tooling items.
  - PostgreSQL incremental sort and enable_incremental_sort: useful database tuning item, but too close to the previous day's PostgreSQL GUC quick hit.
  - Mageia 10 released: fresh Linux release, not urgent enough for this roundup.
  - Optimizing LLVM's bump allocator: excellent compiler material, too narrow for today's package.
  - Some Simple Economics of AGI: useful verification-bandwidth thesis, but source access/payload was not strong enough standalone.
  - Dissecting Apple's Sparse Image Format: older reverse-engineering walkthrough, not fresh enough.
  - Kivo PySide6 desktop teleprompter: smaller creator-tool note, lower priority than Herdr and Routely.
  - The curious case of the disappearing Polish S: classic debugging/i18n story, not fresh news.
-->
