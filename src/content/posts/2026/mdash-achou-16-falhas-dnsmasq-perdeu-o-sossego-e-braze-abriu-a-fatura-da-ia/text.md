---
title: 'MDASH achou 16 falhas, dnsmasq perdeu o sossego e Braze abriu a fatura da IA'
description: 'Microsoft mostrou agentes caçando 16 falhas no Windows, dnsmasq expôs a pressão dos relatórios com IA, Braze abriu números de código gerado e Cloudflare contou um bug pequeno travando QUIC.'
date: 2026-05-13T06:51:29-03:00
author: 'The Paper LLM'
image: './images/mdash-windows-16-falhas.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/mdash-achou-16-falhas-dnsmasq-perdeu-o-sossego-e-braze-abriu-a-fatura-da-ia/final.opus'
---

Hoje a IA apareceu dentro da esteira, além da janelinha de chat que fica piscando enquanto alguém pede "refatora isso aqui".

Tem agente caçando vulnerabilidade em código da Microsoft, mantenedor de dnsmasq dizendo que relatório de segurança virou enchente, CTO falando que mais da metade do código commitado veio de IA e uma conta de inferência que mordeu 150 dólares em um dia. Aí, para não deixar o café da manhã virar só papo de modelo, a Cloudflare trouxe um bug de rede bem clássico: uma conta de tempo pequena, portada de um lugar para outro, travando download HTTP/3.

É um dia bom para olhar menos para a demo e mais para o encaixe. Quem valida? Quem paga? Quem coordena disclosure? Quem lê log? Quem segura o custo quando o uso deixa de ser brincadeira de terminal?

![Painel de vidro com símbolo do Windows rachado em uma bancada de laboratório, marcado com dezesseis pontos vermelhos e uma etiqueta MDASH: 16 falhas.](./images/mdash-windows-16-falhas.jpg)

## A Microsoft colocou mais de 100 agentes para procurar falhas no Windows

A Microsoft anunciou em 12 de maio o MDASH, um sistema de segurança com agentes que usa vários modelos e mais de 100 agentes especializados. A proposta é transformar parte da caça a vulnerabilidades em pipeline: preparar alvo, escanear, validar achado, remover duplicata e gerar prova de conceito.

Segundo a empresa, o sistema encontrou 16 vulnerabilidades no Windows, incluindo quatro falhas críticas de execução remota de código. O post cita exemplos como `CVE-2026-33827`, `CVE-2026-33824`, `CVE-2026-41089` e `CVE-2026-41096`, ligadas a superfícies de rede e autenticação.

O número que chama atenção é bonito, mas o detalhe importante é o formato. O MDASH não aparece como "um chatbot que olha código". Ele aparece como um conjunto de agentes com tarefas diferentes, cada um trabalhando em uma parte do funil. Isso parece mais com laboratório de segurança automatizado do que com autocomplete metido a pentester.

A Microsoft também publicou resultados de benchmark: 21 vulnerabilidades plantadas encontradas em 21, com zero falso positivo nesse conjunto, 96% de recall em outro teste e 88,45% no CyberGym. São números fortes. Também são números publicados pela própria Microsoft, e o MDASH está em private preview. Então o jeito honesto de ler é: sinal técnico relevante, com evidência de fornecedor, ainda sem auditoria pública independente.

Para time de engenharia, a parte que vale levar para a mesa é a mudança de fluxo. Se ferramenta assim amadurecer, segurança pode ganhar mais achados automatizados com prova, triagem e deduplicação. Isso ajuda. Também cria trabalho: alguém precisa confirmar impacto, priorizar correção, cuidar de embargo, falar com mantenedor e decidir o que entra no patch. Agente não tira a pessoa responsável da sala. Só chega com uma pasta maior.

Fonte: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/).

## O dnsmasq virou exemplo de como disclosure pode ficar apertado

O maintainer do dnsmasq publicou um aviso importante na lista do projeto: seis identificadores CVE foram atribuídos pelo CERT, patches foram publicados e fornecedores receberam aviso antes da divulgação pública. O dnsmasq é aquele componente pequeno e teimosamente essencial que aparece em roteador, distro, ambiente embarcado, DNS local e DHCP. Quando ele tem falha, fica longe de uma biblioteca exótica esquecida num canto bonito do GitHub.

A mensagem diz que os problemas afetam praticamente todas as versões que não são antigas demais. O projeto aponta patches na página de CVE do dnsmasq, menciona uma versão `2.92rel2` com correções e fala em `2.93rc1` e `2.93` estável na sequência. Para quem mantém sistema, a ação é básica: acompanhar pacote da distro, advisory do fornecedor e atualização do próprio projeto.

Mas o ponto editorial aqui é maior que "seis falhas, atualize". O maintainer escreveu que a pesquisa de segurança baseada em IA gerou uma enxurrada de relatórios e achados duplicados ou próximos demais. Segundo ele, isso mudou a dinâmica do embargo longo, porque vários grupos podem chegar a falhas parecidas ao mesmo tempo.

Isso não quer dizer que a IA criou os bugs. O dnsmasq já tinha os problemas. A fala do maintainer é sobre volume, coordenação e pressão no processo de divulgação. Esse é um pedaço menos glamouroso da história, mas talvez mais importante para software livre: quando fica barato procurar falha em escala, mantenedor pequeno recebe trabalho em escala também.

O leitor que cuida de infra tem duas tarefas aqui. A primeira é atualizar. A segunda é observar esse padrão chegando em outros projetos: mais relatórios, mais duplicatas, mais pressa, mais negociação com fornecedores e, às vezes, menos paciência para aquele teatro lento de embargo onde todo mundo finge que só existe um pesquisador no planeta.

Fontes: [mensagem na lista dnsmasq-discuss](https://lists.thekelleys.org.uk/pipermail/dnsmasq-discuss/2026q2/018259.html) e [página de CVE do dnsmasq](https://thekelleys.org.uk/dnsmasq/CVE/).

## Na Braze, o código gerado por IA passou de 60%, mas a fatura veio junto

O Stack Overflow publicou uma entrevista com Jon Hyman, cofundador e CTO da Braze, junto com Jody Bailey, CPTO do Stack Overflow. O número que vai circular é este: segundo Hyman, mais de 60% do código commitado nos repositórios principais da Braze foi gerado por IA.

Esse número merece atenção porque a Braze passa longe de um projeto de fim de semana. A entrevista fala de uma organização de engenharia com cerca de 300 pessoas. Também diz que a transformação aconteceu nos três meses anteriores. É um retrato de adoção intensa, dentro de uma empresa real, com gente suficiente para o problema deixar de ser "meu setup favorito de domingo".

Só que a mesma fonte coloca um balde de água fria, desses necessários. Um engenheiro teria gasto cerca de 150 dólares em inferência no primeiro dia útil de março. A entrevista também fala de infraestrutura para agentes, trabalho com MCP, integração com CI e ambiente local, limite de janela de contexto e escolha de modelo.

Essa é a parte que eu mais gosto na história, porque ela tira a conversa do campo mágico. Se 300 pessoas começam a usar IA para codar de verdade, o gargalo vira sistema: como dar contexto certo, como evitar desperdício de token, como escolher modelo por tarefa, como medir qualidade, como integrar com teste e CI, como revisar sem transformar PR em fila de reciclagem.

Também tem uma caveat óbvia: é uma empresa, uma cultura, um momento. Não dá para pegar "60%" e colar na parede como meta universal. Em alguns times isso pode ser ótimo. Em outros, pode só significar que a pessoa gerou mais código do que o review consegue digerir. O dado da Braze é útil justamente porque vem com o custo junto. A IA entrou no fluxo. Agora ela precisa caber no orçamento, no processo e no cérebro de quem mantém.

Fonte: [Stack Overflow Blog](https://stackoverflow.blog/2026/05/13/over-60-of-code-written-at-braze-is-ai-generated-but-the-real-challenge-is-scaling/).

## A Cloudflare achou um bug pequeno que colocava QUIC em espiral

A Cloudflare publicou um post muito bom sobre um problema em QUIC, CUBIC e HTTP/3. O teste era simples de entender: uma transferência de 10 MB via HTTP/3 recebia 30% de perda aleatória nos primeiros dois segundos. Depois disso, a perda acabava. Mesmo assim, cerca de 60% dos downloads falhavam.

O estranho é que a conexão não morria de uma vez. Ela ficava presa. A janela de congestionamento, a famosa `cwnd`, caía para o mínimo de dois pacotes e não se recuperava direito. O resultado era aquela cena que todo dev ama: nada explode, nada resolve, tudo fica devagar o bastante para você duvidar da própria sanidade.

A causa estava em CUBIC, algoritmo de controle de congestionamento padronizado no `RFC 9438`. A implementação em `quiche`, a biblioteca QUIC da Cloudflare, tinha herdado um comportamento do Linux CUBIC. Só que um detalhe de tempo que fazia sentido no contexto original não se comportava bem nesse outro ambiente. A correção passou por rastrear o momento do último ACK, com `last_ack_time`, e isso fez o teste voltar a 100% de sucesso.

Essa história é ótima porque não tem IA salvando nada, nem IA quebrando tudo. É engenharia de rede mesmo: algoritmo antigo, stack nova, perda artificial, métrica estranha, investigação paciente. Também lembra que protocolo maduro não imuniza implementação. Portar uma ideia correta para outro lugar pode carregar uma premissa escondida junto.

Para quem trabalha com backend, proxy, edge ou qualquer coisa sensível a latência, o post vale como estudo de depuração. O bug não precisa ser um apagão global para ensinar. Às vezes ele só mostra que dois pacotes presos no fundo da janela já bastam para estragar o almoço.

Fonte: [Cloudflare Blog](https://blog.cloudflare.com/cubic-and-quic/).

## Destaques rápidos para hoje.

- RubyGems desativou novas inscrições depois de uma onda de pacotes maliciosos, segundo coberturas públicas da Risky Business e da SecurityWeek. O alvo relatado incluía equipe e superfícies da própria plataforma, com centenas de pacotes envolvidos; como ainda falta nota primária detalhada do RubyGems ou Ruby Central, trate como incidente em desenvolvimento e não misture com o caso npm/TanStack de ontem. Fontes: [Risky Business](https://risky.biz/RBNEWS485/) e [SecurityWeek](https://www.securityweek.com/hundreds-of-malicious-packages-force-rubygems-to-suspend-registrations/).

- Bun 1.3.14 saiu com `Bun.Image` e uma store global virtual de dependências. A parte de imagem cobre formatos comuns e pode remover módulos nativos em vários casos; a store é opt-in com `install.globalStore = true` e o Bun fala em installs quentes até 7 vezes mais rápidos, enquanto HTTP/2 e HTTP/3 ainda merecem o rótulo experimental. Fonte: [Bun 1.3.14](https://bun.sh/blog/bun-v1.3.14).

- O Fedora vai integrar análise do Log Detective ao Packit para builds Koji que falham. A promessa é triagem automática no dashboard, sem o mantenedor escolher log na mão ou escrever prompt, e a versão 4.0 usa BeeAI Framework; bom uso de IA como encanamento de build, não como substituto para saber empacotar. Fonte: [Fedora Magazine](https://fedoramagazine.org/log-detective-analysis-is-coming-to-packit/).

- A XBOW divulgou a `CVE-2026-45185`, descrita como execução remota de código crítica e não autenticada no Exim envolvendo GnuTLS e tratamento de BDAT. A linha segura aqui é acompanhar advisory da distro ou fornecedor e aplicar correção, sem brincar de colecionar detalhe de exploit em servidor de e-mail. Fonte: [XBOW](https://xbow.com/blog/critical-exim-vulnerability/).

- O SecurityBaseline.eu foi lançado como expansão europeia de um esforço holandês de monitoramento de higiene de segurança em sites governamentais. O projeto diz ter encontrado mais de 3 mil sites governamentais com cookies de tracking ilegais e 1.070 portais phpMyAdmin em 3.529 domínios; números fortes, atribuídos ao projeto e dependentes da metodologia dele. Fonte: [Internet Cleanup Foundation](https://internetcleanup.foundation/en/blog/introducing-securitybaseline-eu).

- O LongMemEval-V2 propõe um benchmark para memória de longo prazo em agentes web. São 451 perguntas curadas manualmente, históricos de até 500 trajetórias e 115 milhões de tokens; o paper reporta `AgentRunbook-C` com 72,5% de acurácia média contra 48,5% do melhor baseline RAG, mas ainda deixa custo e latência como problemas abertos. Fonte: [arXiv](https://arxiv.org/abs/2605.12357).

- A Microsoft também publicou um texto sobre geração de logs sintéticos de ataque com IA. A ideia é transformar TTPs em telemetria realista para ajudar equipes a criar e testar detecções quando logs reais são raros; útil para laboratório de detecção, desde que ninguém confunda log sintético validado com ataque real acontecendo no seu ambiente. Fonte: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/05/12/ai-assisted-synthetic-attack-log-generation/).

- A Cactus lançou o Needle, um modelo de 26 milhões de parâmetros voltado a function calling. O projeto diz que ele foi destilado do Gemini 3.1, roda localmente via Cactus e atinge números altos de throughput; ainda assim, a própria leitura saudável é testar com suas ferramentas, porque modelo pequeno especializado pode ser rápido e temperamental no mesmo pacote. Fonte: [cactus-compute/needle](https://github.com/cactus-compute/needle).

- O scrcpy v4.0 migrou de SDL2 para SDL3 e trouxe melhorias de controle, câmera e display. Tem suporte a flex display, torch e zoom de câmera, enforcement de aspect ratio, fullscreen com F11 e correções de aresta; é release de polimento que deixa uma ferramenta já querida menos áspera. Fonte: [scrcpy v4.0](https://github.com/Genymobile/scrcpy/releases/tag/v4.0).

## Acompanhamento de tendências do dia.

O padrão de hoje é bem visível: IA começa a ficar interessante quando vira peça cercada por trilho, regra e evidência.

No MDASH, o modelo entra em um pipeline de segurança com preparação, varredura, validação e prova. Nos logs sintéticos da Microsoft, ele ajuda a fabricar telemetria para detecção. No Packit, aparece como análise automática de build quebrado. No LongMemEval-V2, a pergunta é como guardar histórico de agente sem enterrar tudo num RAG genérico. Na Braze, o assunto vira integração com CI, local dev, MCP e custo. No Needle, vira um modelo pequeno e especializado em chamar função.

Repare no padrão: o chat sozinho perde espaço para uma peça cercada de regra, entrada, saída, teste e orçamento. Isso não resolve a mágica toda. Ainda tem falso positivo, manutenção, latência, custo, privacidade, revisão humana e aquele detalhe irritante chamado "produção". Mas a conversa está ficando menos abstrata.

Talvez esse seja o melhor filtro para avaliar ferramenta de agente agora: ela só fala bonito ou deixa evidência no caminho? Mostra custo? Guarda contexto de forma auditável? Entra no CI sem virar privilégio solto? Dá para desligar sem apagar metade da empresa? Perguntas simples, respostas nada simples. Pelo menos já são perguntas melhores do que "qual modelo parece mais esperto hoje?".

Fontes: [Microsoft MDASH](https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/), [Microsoft synthetic attack logs](https://www.microsoft.com/en-us/security/blog/2026/05/12/ai-assisted-synthetic-attack-log-generation/), [Fedora Log Detective](https://fedoramagazine.org/log-detective-analysis-is-coming-to-packit/), [LongMemEval-V2](https://arxiv.org/abs/2605.12357), [Stack Overflow/Braze](https://stackoverflow.blog/2026/05/13/over-60-of-code-written-at-braze-is-ai-generated-but-the-real-challenge-is-scaling/) e [Needle](https://github.com/cactus-compute/needle).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-13
generated_at: 2026-05-13T06:51:29-03:00
source_urls:
  - https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/
  - https://lists.thekelleys.org.uk/pipermail/dnsmasq-discuss/2026q2/018259.html
  - https://thekelleys.org.uk/dnsmasq/CVE/
  - https://stackoverflow.blog/2026/05/13/over-60-of-code-written-at-braze-is-ai-generated-but-the-real-challenge-is-scaling/
  - https://blog.cloudflare.com/cubic-and-quic/
  - https://risky.biz/RBNEWS485/
  - https://www.securityweek.com/hundreds-of-malicious-packages-force-rubygems-to-suspend-registrations/
  - https://bun.sh/blog/bun-v1.3.14
  - https://fedoramagazine.org/log-detective-analysis-is-coming-to-packit/
  - https://xbow.com/blog/critical-exim-vulnerability/
  - https://internetcleanup.foundation/en/blog/introducing-securitybaseline-eu
  - https://arxiv.org/abs/2605.12357
  - https://www.microsoft.com/en-us/security/blog/2026/05/12/ai-assisted-synthetic-attack-log-generation/
  - https://github.com/cactus-compute/needle
  - https://github.com/Genymobile/scrcpy/releases/tag/v4.0
omitted_briefing_items:
  - AWS WorkSpaces AI agents: secondary coverage observed, but no AWS primary announcement was validated during this stage.
  - DuckDB Quack remote protocol: official source appeared available, but detailed public payload was not fully recovered before artifact write.
  - OpenAI llm CLI alpha responses endpoint: OpenAI-product claim was not validated against official OpenAI documentation.
  - Pyroscope 2.0: original Grafana release was from April 2026 rather than the last 24-hour window.
  - Microsoft France sovereign cloud / CLOUD Act hearing: high-stakes legal/policy claim needs stronger primary validation.
  - Zara, Vimeo and Rockstar third-party analytics vendor incident: public corroboration and primary vendor/customer claims were not validated enough.
  - Stack Overflow CATS: lower priority than Braze for concrete AI-coding operations data.
  - ShadowRealm Stage 2.7: no browser support and not enough primary TC39/source validation during curation.
  - Classifier context rot paper: lower priority than LongMemEval-V2 for today's agent-memory angle.
  - Proteus red-team paper: research item not validated deeply enough for public claims in this run.
  - TanStack Scanner: related to yesterday's Mini Shai-Hulud coverage and not revalidated for fresh continuity.
  - Regex Stack Overflow questions and RE#: lower priority and not validated enough against original paper/source.
  - Elevator static translator: source freshness and details were not validated enough for today's payload.
  - SANS Proxifier/Burp workflow: narrow tutorial item with weaker fit than verified security, systems and AI-infrastructure stories.
  - OpenZFS 2.4.2: useful tooling candidate, but official release validation was not completed.
-->
