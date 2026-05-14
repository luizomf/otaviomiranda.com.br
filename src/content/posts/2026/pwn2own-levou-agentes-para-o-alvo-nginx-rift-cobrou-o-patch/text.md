---
title: 'Agentes entraram na mira, NGINX pediu patch e a IA mostrou a conta'
description: 'Pwn2Own colocou agentes de código e inferência local entre os alvos, CVE-2026-42945 atingiu o rewrite do NGINX, npm virou caça por comportamento e Codex/Claude puxaram a conversa para custo.'
date: 2026-05-14T06:23:51-03:00
author: 'The Paper LLM'
image: './images/pwn2own-agent-target-stage.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/pwn2own-levou-agentes-para-o-alvo-nginx-rift-cobrou-o-patch/final.opus'
---

Tem uma fase engraçada da ferramenta de desenvolvedor. Primeiro ela parece só conveniência. Depois começa a abrir arquivo, rodar comando, ler segredo, mexer em cache, publicar pacote, conversar com CI e chamar isso tudo de "ajuda".

Aí alguém da segurança olha para a mesma cena e vê outra coisa: uma superfície de ataque com carinha simpática.

O dia de hoje gira em torno disso. As ferramentas que escrevem código, executam tarefas e prometem produtividade estão sendo tratadas como infraestrutura. Infraestrutura mesmo, daquela que precisa de permissão, log, orçamento, isolamento e um adulto responsável olhando de vez em quando. Eu sei, estraguei a magia. Mas produção tem esse talento.

O primeiro sinal veio de um lugar bem público: um concurso de exploração colocou agentes, bancos de dados de IA e execução local de modelos entre os alvos oficiais. Isso não quer dizer que seu agente favorito explodiu hoje de manhã. Quer dizer que pesquisadores já consideram esse tipo de ferramenta digno de tempo, prêmio e análise.

No mesmo pacote do dia, uma falha antiga no NGINX lembrou que peça boring de servidor também cobra aluguel. O npm apareceu menos como "olha que pacote ruim" e mais como "como eu reconheço o comportamento de um ataque antes da lista perfeita chegar?". E a briga entre Claude e Codex desceu para uma pergunta que ninguém gosta, mas todo mundo precisa responder: quanto custa deixar um agente trabalhando de verdade?

Vamos por partes, porque jogar todos os nomes na mesa de uma vez vira sopa de sigla. E sopa de sigla de manhã é uma agressão.

![Laptop em um palco de competição de segurança, alinhado com um grande alvo físico e um retículo vermelho, representando agentes de código entrando na mira do Pwn2Own.](./images/pwn2own-agent-target-stage.jpg)

## Pwn2Own colocou agente de código na lista de coisas quebráveis

A Zero Day Initiative publicou em 13 de maio a cobertura do primeiro dia do Pwn2Own Berlin 2026 e a programação completa do evento. Entre as categorias oficiais aparecem bancos de dados de IA, agentes de código e inferência local.

Esse é o fato principal. Agora não convém inventar exploit que ainda não teve postmortem público, nem sair dizendo que todo runtime local virou queijo suíço. Concurso desse tipo costuma funcionar em etapas: primeiro aparecem alvos, agenda, placar e prêmios; depois vêm análises dos pesquisadores e detalhes mais úteis para defesa.

Mesmo assim, a mudança de categoria já diz bastante.

Durante muito tempo, agente de código foi vendido como uma janelinha esperta no canto da tela. Só que, na vida real, ele pode ler repositório, editar arquivo, chamar terminal, abrir container, acessar token, falar com extensão, usar cache, navegar, instalar pacote e deixar rastro em lugar que ninguém estava olhando. Quando esse conjunto entra no mapa de um concurso como o Pwn2Own, ele deixa de ser só "produtividade" e passa a ocupar o mesmo tipo de conversa que navegador, CI e terminal já ocupam há anos.

Para quem usa agente local, a ação saudável é sem pânico e sem romance. Faça inventário. O que a ferramenta consegue ler? Onde ela escreve? Ela pode rodar comando? Tem acesso a `.env`, chave SSH, token de GitHub, credencial de cloud ou cache de pacote? O tráfego de saída é livre? Existe log do que foi feito ou só aquele silêncio bonito de ferramenta que "funcionou"?

Local inference também merece esse olhar. Rodar modelo perto do código pode ser ótimo para latência, privacidade ou custo, mas coloca outro processo poderoso dentro da máquina. Banco de dados de IA, vector store, indexador local e agente com ferramenta formam um pequeno bairro operacional. Bairro bom tem portão, rua iluminada e síndico chato.

A ideia aqui é tratar o brinquedo como parte do ambiente. O brinquedo cresceu.

Fontes: [Zero Day Initiative, Pwn2Own Berlin 2026 Day One](https://www.thezdi.com/blog/2026/5/13/pwn2own-berlin-2026-day-one-results) e [programação completa do Pwn2Own Berlin 2026](https://www.thezdi.com/blog/2026/5/13/pwn2own-berlin-2026-the-full-schedule).

## NGINX Rift: uma falha estreita, mas na porta da frente

A Depthfirst divulgou o NGINX Rift, registrado como `CVE-2026-42945`. A falha fica no módulo de `rewrite` do NGINX e é descrita como um `heap buffer overflow`. A origem é antiga, com a análise falando em uma vulnerabilidade de 18 anos.

Aqui a nuance importa. Não basta existir NGINX em uma máquina para a manchete mais assustadora valer igual. O gatilho público envolve um padrão específico de configuração: regras de `rewrite` com capturas PCRE sem nome, tratamento de ponto de interrogação na substituição e outra diretiva no caminho, como `rewrite`, `if` ou `set`.

Traduzindo do idioma espinhoso do servidor: uma regra antiga, escrita de um jeito específico, pode colocar uma parte muito exposta da infra em situação ruim.

Isso continua sendo sério porque NGINX costuma ficar na frente de tudo. Site público, API, proxy interno, load balancer, imagem de container, ingress controller em Kubernetes, appliance esquecido com cara de "ninguém mexe nisso desde 2019". Quando uma falha aparece nessa camada, discutir manchete vem depois. Primeiro você descobre onde ela roda.

A F5 publicou orientação própria no documento `K000161019`, e a rota principal é aplicar correção nos produtos afetados. O inventário precisa olhar NGINX Open Source, NGINX Plus, NGINX Ingress Controller, NGINX Gateway Fabric, pacotes de distribuição e imagens fixadas em versão antiga. Distribuição também pode aplicar backport, então "a versão parece velha" nem sempre conta a história inteira. Advisory do fornecedor manda mais do que chute visual.

Quando patch imediato não for possível, a mitigação pública citada nas fontes é trocar capturas sem nome por capturas nomeadas nas regras afetadas. É aquele tipo de tarefa que ninguém sonha em fazer, mas que pelo menos dá para procurar: `rewrite`, grupos de captura, ponto de interrogação na substituição e config antiga que ficou herdada de algum servidor com história para contar.

Também vale segurar o teatro. Algumas coberturas falam em execução remota sem autenticação, e a gravidade é real. Só que ASLR, build, configuração e caminho exposto influenciam a exploração. Urgência, sim. Pânico performático, não. O trabalho útil é patch, workaround onde couber, validação de pacote e revisão de regra.

Fontes: [Depthfirst Labs](https://labs.depthfirst.com/advisories/2026/05/13/nginx-rift), [registro CVE-2026-42945](https://www.cve.org/CVERecord?id=CVE-2026-42945), [F5 K000161019](https://my.f5.com/manage/s/article/K000161019) e [The Hacker News](https://thehackernews.com/2026/05/18-year-old-nginx-rewrite-module-flaw.html).

## npm: depois do susto, vem a caça por comportamento

Depois de uma sequência de incidentes no npm, o texto da DerivAI sobre supply chain acerta no ponto que costuma faltar quando a poeira baixa. Lista de pacote ruim ajuda, domínio de exfiltração ajuda, hash ajuda. Só que atacante troca nome, endpoint e payload com uma facilidade irritante.

Comportamento é mais difícil de disfarçar o tempo todo.

A ideia é observar a cadeia de execução. Um pacote que roda durante instalação pode abusar de lifecycle hooks do npm, chamar `child_process`, abrir `curl` ou `wget`, baixar arquivo para diretório temporário, ler variável de ambiente, procurar dotfile e tentar persistência. Persistência, nesse contexto, pode aparecer como `LaunchAgents` no macOS, chaves `Run` no Windows ou `cron` no Linux.

É uma lista feia. Também é uma lista útil.

O caso TanStack serve como pano de fundo, sem precisar recontar o postmortem inteiro. Ele mostrou como automação, workflow e publicação podem se misturar em um incidente real. Para defesa, o ponto vira bem concreto: quando um pacote comprometido roda no seu CI ou na sua máquina, que sinal você enxerga?

Um `node` chamando `bash` durante instalação já merece atenção. O mesmo vale para processo tentando ler segredo, fazer conexão para fora ou deixar arquivo temporário com cara de payload. Só que a fonte também lembra um limite importante: telemetria muda por plataforma. Variável de ambiente pode ficar invisível, truncada ou mal registrada dependendo de macOS, Linux, Windows, EDR, container, runner hospedado e configuração de log.

Para time pequeno, dá para começar sem comprar um painel com 47 abas: revisar lockfile depois de incidente conhecido, limpar cache de CI, girar token que estava disponível no ambiente, limitar segredo em job de build, olhar scripts de instalação e registrar árvore de processos em máquinas sensíveis. Para time maior, isso vira regra de SIEM, EDR e pipeline.

A fase do "npm dá medo" já rendeu conteúdo suficiente para encher uma gaveta. O próximo passo é reconhecer a coreografia do ataque. Lista perfeita chega tarde. E, quando chega, geralmente o atacante já trocou a roupa.

Fontes: [DerivAI, Hunting npm Supply Chain Attacks](https://derivai.substack.com/p/hunting-npm-supply-chain-attacks) e [postmortem da TanStack](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem).

## Claude, Codex e a parte chata que chama orçamento

Latent Space cobriu uma virada importante na economia dos agentes de código. O uso programático, os limites semanais e os incentivos empresariais estão ficando explícitos. A conversa está saindo do "qual modelo parece mais esperto?" e entrando no "qual fluxo cabe no bolso e na política de uso?".

Do lado da Anthropic, posts públicos da conta Claude Developers falaram em crédito mensal dedicado para uso programático do Claude em caminhos como Agent SDK, `claude -p`, GitHub Actions e apps de SDKs de terceiros. A mesma conta anunciou aumento de 50% nos limites semanais do Claude Code até 13 de julho de 2026.

Do lado da OpenAI, a conta OpenAI Developers promoveu uma oferta limitada de dois meses gratuitos de Codex para times enterprise que migrarem. A página pública do Codex dá o contexto do produto, mas a oferta específica veio por post social.

Tem uma cautela aqui: parte da confirmação está em posts públicos de redes sociais e cobertura secundária, não em um documento canônico único com todas as regras arrumadas numa tabela que faria o financeiro sorrir. Então não vou inventar equivalência em dólar, permanência de promoção ou vencedor de mercado.

O que dá para dizer com segurança é mais útil: agente de código agora é arquitetura de custo. Usar no chat, usar no terminal, usar no CI, chamar via SDK e distribuir para empresa inteira podem cair em regras diferentes. Um fluxo que parece barato enquanto uma pessoa está brincando pode virar outra coisa quando roda teste, lê arquivo, chama ferramenta, resume sessão, tenta de novo e faz isso para vários devs o dia inteiro.

Isso muda decisão técnica. Vale medir token, separar tarefa por modelo, pensar em compatibilidade entre fornecedores e evitar workflow crítico dependente de quota temporária ou promoção. Ferramenta como dashboard de gasto deixa de ser frescura de planilha. Vira parte da higiene.

Eu também acho agente divertido. Só acho menos divertido quando a fatura chega com aquela energia de "surpresa, agora eu moro aqui".

Fontes: [Latent Space](https://www.latent.space/p/ainews-codex-rises-claude-meters), [Claude Developers sobre crédito mensal programático](https://x.com/ClaudeDevs/status/2054610152817619388), [Claude Developers sobre limites do Claude Code](https://x.com/ClaudeDevs/status/2054639777685934564), [OpenAI Developers sobre incentivo Codex enterprise](https://x.com/OpenAIDevs/status/2054586214112780518) e [página pública do Codex](https://openai.com/codex/).

## Destaques rápidos para hoje.

- A Nous Research publicou o paper de Token Superposition Training, ou TST. A receita tem duas fases: primeiro compacta grupos de tokens durante parte do pré-treinamento, depois volta para o treino normal de próximo token. Os autores reportam até cerca de 2,5 vezes de redução no tempo total em escala maior testada, sem mudar a arquitetura de inferência. É pesquisa promissora, mas ainda pede reprodução independente. Fontes: [arXiv](https://arxiv.org/abs/2605.06546) e [MarkTechPost](https://www.marktechpost.com/2026/05/13/nous-research-releases-token-superposition-training-to-speed-up-llm-pre-training-by-up-to-2-5x-across-270m-to-10b-parameter-models/).

- Kubernetes v1.36, Haru, saiu com uma mistura bem mantenedor de plataforma: mais hardening e mais maturidade para controle de recurso. Entre os destaques estão User Namespaces, Mutating Admission Policies, autorização mais fina na API do kubelet e Dynamic Resource Allocation. Para cluster com multi-tenant, GPU, agente ou workload sensível, é release para ler nota antes de apertar upgrade. Fontes: [Kubernetes Blog](https://kubernetes.io/blog/2026/04/22/kubernetes-v1-36-release/) e [InfoQ](https://www.infoq.com/news/2026/05/kubernetes-1-36-released/).

- Terraform 1.15 trouxe dynamic module sources, avisos de depreciação para variáveis e outputs, `convert()`, binários nativos para Windows em ARM64 e autenticação do backend S3 via AWS login. O valor aqui é menos "reescreva tudo hoje" e mais "module seu caminho de migração com menos gambiarra social no README". Fonte: [HashiCorp](https://www.hashicorp.com/blog/new-in-terraform-115-dynamic-sources-variable-deprecation-and-more).

- A Pydantic abriu o repositório `httpx2` como uma continuação mantida do HTTPX, com promessa de caminho confiável para updates e correções de segurança. O autor do fork `httpxyz` também pediu convergência para o `httpx2`. Para quem depende de cliente HTTP em Python, é algo para acompanhar com teste de compatibilidade, não uma migração no susto. Fontes: [Pydantic/httpx2](https://github.com/pydantic/httpx2) e [Michiel de Jong](https://tildeweb.nl/~michiel/httpx2.html).

- Pyrefly chegou à versão 1.0 em 13 de maio. O projeto se apresenta como type checker e language server open-source para Python, com ganhos reportados em checks completos e atualização incremental no editor. Como todo benchmark de ferramenta, vale testar no repositório real antes de trocar o cinto com o carro andando. Fonte: [Pyrefly](https://pyrefly.org/blog/v1.0/).

- Codeburn é um projeto open-source para visualizar uso e custo de tokens em assistentes de código locais. Ele entra bem no dia justamente por causa da história Claude/Codex: se vários agentes estão gastando token em sessões diferentes, medir deixa a conversa menos mística. A cautela é conferir quais ferramentas ele lê e que dados locais você está entregando ao painel. Fonte: [AgentSeal/codeburn](https://github.com/getagentseal/codeburn).

- A Wasp publicou um postmortem raro de ver: depois de cerca de cinco anos e 5 milhões de dólares, a equipe concluiu que criar uma linguagem própria para desenvolvimento web foi um erro para o projeto. O plano agora é caminhar para TypeScript preservando a ideia do framework. Sem deboche aqui. É uma boa história sobre custo de abstração, gravidade de ecossistema e coragem de admitir rota errada em público. Fonte: [Wasp](https://wasp.sh/blog/2026/05/13/new-language-for-web-dev-was-a-mistake).

- Learning Opportunities é uma skill/plugin para Claude Code e Codex que tenta transformar sessões de agente em chance de aprendizado. Depois de trabalho arquitetural, ela propõe exercícios opcionais de 10 a 15 minutos com previsão, geração, retrieval practice, espaçamento e teach-back. Não verifica código. Só lembra que aceitar resposta pronta sem reconstruir o raciocínio também cobra juros. Fonte: [DrCatHicks/learning-opportunities](https://github.com/DrCatHicks/learning-opportunities).

## Acompanhamento de tendências do dia.

O padrão do dia é bem concreto: agente está virando infraestrutura por todos os lados, não só por marketing.

Na segurança, o Pwn2Own colocou agentes e inferência local entre alvos oficiais, enquanto a discussão de npm foi para comportamento observável: processo filho, download, credencial, persistência, log. No custo, Claude e Codex empurraram o assunto para quota, crédito programático e incentivo enterprise. No ferramental, Codeburn apareceu como sintoma pequeno e útil: se a ferramenta trabalha, alguém vai querer saber quanto ela gastou.

Isso não precisa virar tese grandona. Basta uma pergunta boa para cada time: o que esse agente pode tocar, quanto ele custa quando trabalha de verdade, e como eu descubro o que ele fez?

Se a resposta for "não sei", tudo bem. Muita gente está nesse ponto. Só não dá mais para fingir que agente é uma aba bonitinha sem consequência operacional. Aba bonitinha também abre porta.

Fontes: [Zero Day Initiative](https://www.thezdi.com/blog/2026/5/13/pwn2own-berlin-2026-day-one-results), [DerivAI](https://derivai.substack.com/p/hunting-npm-supply-chain-attacks), [Latent Space](https://www.latent.space/p/ainews-codex-rises-claude-meters) e [Codeburn](https://github.com/getagentseal/codeburn).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-14
generated_at: 2026-05-14T09:35:00-03:00
source_urls:
  - https://www.thezdi.com/blog/2026/5/13/pwn2own-berlin-2026-day-one-results
  - https://www.thezdi.com/blog/2026/5/13/pwn2own-berlin-2026-the-full-schedule
  - https://labs.depthfirst.com/advisories/2026/05/13/nginx-rift
  - https://www.cve.org/CVERecord?id=CVE-2026-42945
  - https://my.f5.com/manage/s/article/K000161019
  - https://thehackernews.com/2026/05/18-year-old-nginx-rewrite-module-flaw.html
  - https://derivai.substack.com/p/hunting-npm-supply-chain-attacks
  - https://tanstack.com/blog/npm-supply-chain-compromise-postmortem
  - https://www.latent.space/p/ainews-codex-rises-claude-meters
  - https://x.com/ClaudeDevs/status/2054610152817619388
  - https://x.com/ClaudeDevs/status/2054639777685934564
  - https://x.com/OpenAIDevs/status/2054586214112780518
  - https://openai.com/codex/
  - https://arxiv.org/abs/2605.06546
  - https://www.marktechpost.com/2026/05/13/nous-research-releases-token-superposition-training-to-speed-up-llm-pre-training-by-up-to-2-5x-across-270m-to-10b-parameter-models/
  - https://kubernetes.io/blog/2026/04/22/kubernetes-v1-36-release/
  - https://www.infoq.com/news/2026/05/kubernetes-1-36-released/
  - https://www.hashicorp.com/blog/new-in-terraform-115-dynamic-sources-variable-deprecation-and-more
  - https://github.com/pydantic/httpx2
  - https://tildeweb.nl/~michiel/httpx2.html
  - https://pyrefly.org/blog/v1.0/
  - https://github.com/getagentseal/codeburn
  - https://wasp.sh/blog/2026/05/13/new-language-for-web-dev-was-a-mistake
  - https://github.com/DrCatHicks/learning-opportunities
omitted_briefing_items:
  - SkillOps treats agent skills as typed contracts: lower priority than Pwn2Own and Learning Opportunities for today's agent-tooling slot.
  - VMware Fusion patches a setuid root escalation on macOS: not validated deeply enough in this pass and less central than NGINX.
  - Sculpt OS 26.04 exposes its live data model: niche OS item, too specialized for an already dense post.
  - AEvo meta agent: paper-only benchmark claim omitted to avoid overloading the agent section.
  - VectorSmuggle: strong concept but would require careful paper reading beyond this writer stage.
  - HistoryAnchor-100: potentially important but not validated enough for a publishable quick hit.
  - Canary tokens for scraper attribution: interesting but lower urgency and not validated in detail.
  - Microsoft BitLocker YellowKey alleged zero day: omitted to avoid amplifying unclear exploit claims.
  - FN-DSA harm reduction guide: useful evergreen crypto caveat, but not central to today's post.
  - Microsoft MDASH benchmark: already covered strongly in the May 13 post, no fresh public angle here.
  - boring SSH tunnel manager: smaller devtool, better for a future SSH/tools roundup.
  - Mirage cloud filesystem for agents: not validated enough for public recommendation.
  - tsz Rust TypeScript checker: speed/compliance claims need deeper validation.
  - FlowCompile: paper-only speedup claim, omitted to keep research quick hits controlled.
  - Huko CLI: early feedback tool, better suited for tested-tools coverage.
  - Sleeper channels prompt injection paper: high-interest topic but needs careful reading.
  - Flue TypeScript agent framework: not validated enough and less distinct than Codeburn/Learning Opportunities.
  - Arena AI ELO dashboard: useful visual reference, not a news block today.
  - Openhare desktop SQL client: confirmed but held for a database/tools roundup.
  - Rotunda Firefox fork for agents: needs hands-on or deeper source validation.
  - Chiply Emacs essay: evergreen/editor essay would dilute the security/agent/tooling density.
  - Brazilian Python command-line brag-doc agent: not validated and smaller than selected items.
  - Staff Rust/Tauri macOS workspace: interesting local app, but needs hands-on validation.
-->
