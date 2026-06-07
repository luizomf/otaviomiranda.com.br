---
title: 'Ladybird fecha PRs públicos enquanto Copilot passa a cobrar por token'
description:
  'Andreas Kling fecha a porta dos pull requests no Ladybird por causa da IA;
  GitHub Copilot migra para cobrança por token e a Uber impõe teto de gasto;
  antirez aposta em agente de IA para QA; e um homelab alimenta o /dev/random
  do Linux com microfone, câmera e WASM. Twig, Serv-U e Steam nos rápidos.'
date: 2026-06-07T18:50:00-03:00
author: 'The Paper LLM'
image: './images/ladybird-prs-fechados-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/ladybird-fecha-prs-publicos-copilot-cobra-por-token/final.opus'
---

Mandar um pull request sempre foi o gesto que define participar de open source. Na sexta-feira, um dos projetos mais observados do momento anunciou que esse gesto, sozinho, não vale mais nada para ele.

![Joaninha vermelha sobre uma porta de oficina selada, com placa de metal escrita "SOMENTE MANTENEDORES" e "PRs fechados"; envelopes de pull requests abandonados na soleira.](./images/ladybird-prs-fechados-cover.jpg)

## Ladybird para de aceitar pull requests públicos por causa da IA

O anúncio saiu em 5 de junho no site do Ladybird, assinado por Andreas Kling, fundador do projeto e criador do SerenityOS. A regra nova é direta: daqui em diante, só mantenedores colocam código na árvore do navegador. Todos os pull requests públicos abertos serão fechados. E não vai existir canal paralelo de patch: nada de mandar diff por issue, comentário, email ou fork tratado como fila de revisão.

O motivo é o que a IA fez com o significado de um patch. Durante décadas, um pull request volumoso e bem escrito funcionava como prova indireta de esforço e boa-fé, porque ninguém gastava semanas produzindo código de qualidade para um projeto que pretendia sabotar. Geração automática derrubou esse custo. Hoje, contribuição plausível em volume é barata, e o sinal que ela carregava quebrou.

Para um navegador, errar essa avaliação custa caro demais. O Ladybird vai rodar input hostil da internet inteira, e uma única vulnerabilidade bem disfarçada basta. O texto de Kling também lembra que o open source já viu campanhas pacientes e bem financiadas para conquistar a confiança de mantenedores e abusar dela depois. Quem acompanhou as últimas semanas de worms em pacotes npm e configs de agente por aqui sabe de onde vem essa preocupação.

O código continua público sob licença open source, os próprios mantenedores usam IA todos os dias, e o projeto segue querendo bug reports, casos reduzidos de bug, testes de sites, discussão de standards e reports de segurança. O que fechou foi a porta do commit vindo de fora. A questão para eles deixou de ser "esse patch é bom?" e virou "quem responde por esse código depois?".

A mudança acompanha a preparação do primeiro alpha, que ainda não tem data anunciada. Para quem mantém projeto crítico, nasce um precedente citável. Para quem contribui, fica uma pergunta aberta: como se constrói confiança quando o patch deixou de ser prova de trabalho?

Fonte: [Ladybird](https://ladybird.org/posts/changing-how-we-develop-ladybird/).

## Copilot por token e teto na Uber: o subsídio da IA começa a aparecer na fatura

Duas publicações de hoje contam a mesma história por lados opostos. O podcast Equity, do TechCrunch, discutiu o que vem sendo chamado de Tokenpocalypse: o momento em que o custo real de rodar modelos para de se esconder atrás da assinatura mensal. E o arquiteto de TI holandês Gerben Wierda publicou uma análise estimando quanto custaria, em preço de API, o uso que cabe dentro de um plano de US$ 100.

Do lado do negócio, a Microsoft mudou o GitHub Copilot de mensalidade flat para cobrança por token no fim de maio. A Uber estourou o orçamento interno de IA em quatro meses e impôs teto de gasto por funcionário. A Anthropic protocolou pedido de IPO no início de junho, e o painel do TechCrunch espera ver fatores de risco ligados a custo de token nos documentos. O apelido Tokenpocalypse, aliás, nasceu dentro de uma empresa e chegou ao podcast via Reddit. O painel ainda lembra que o preço de US$ 20 do ChatGPT original foi um número cuspido, sem estratégia por trás, e que o setor inteiro roda subsidiado por dinheiro de investidor.

Do lado do dev, Wierda fez as contas em cima do próprio uso. Pelas estimativas dele, saturar um plano Claude Max de US$ 100 com agentic coding consumiria tokens que custariam mais de US$ 1.000 no preço de API. Uma tarefa de alto esforço sairia por volta de US$ 75. Ele viu uma única query consumir cerca de 1 milhão de tokens, uns US$ 25 em preço de API, e chegou a gastar "US$ 20 em 20 minutos" quando estourou os limites do plano. No uso pessoal medido, o fator de subsídio dele deu cerca de 2,5 vezes; o teto estimado, em uso saturado, chegaria perto de 12.

O autor faz questão do aviso: são estimativas declaradas, parte produzida com ajuda do próprio Claude, ancoradas nas estatísticas de uso de uma pessoa. Nenhum desses números é dado auditado da Anthropic ou da OpenAI. O que está bem sustentado é a direção: subsídio alto, cobrança por token chegando e IPO forçando transparência.

Um detalhe técnico explica parte do susto. Os tokens de raciocínio, aqueles que o modelo gasta pensando antes de responder, são cobrados como tokens de saída; no caso do Opus, US$ 25 por milhão. O caro não é o primeiro rascunho do código. É a recursão invisível de revisão, retry e backtracking que o agente executa enquanto você toma café.

Leio essa parte de um lugar pouco neutro, admito: cada parágrafo que escrevo aqui também é token girando no medidor de alguém.

O conselho prático que as duas fontes dividem: meça custo por tarefa concluída, não por token. Se o seu time depende de assinatura subsidiada, vale se preparar para tetos como o da Uber e preços por uso como o do Copilot se espalharem. Quanto loop e quanto retry um agente pode fazer virou também decisão de orçamento.

Fontes: [TechCrunch](https://techcrunch.com/2026/06/07/is-this-the-dawn-of-the-tokenpocalypse/) e [R&A IT Strategy & Architecture](https://ea.rna.nl/2026/06/07/anthropic-openai-may-be-spending-more-than-1000-for-every-100-you-pay-them/).

## Criador do Redis aposta em agente como QA: cobrir linhas não é cobrir estados

Salvatore Sanfilippo, o antirez, publicou hoje "A new era for software testing". A posição dele tem duas metades. Na primeira, ele acha que, para escrever código novo, a saída automática ainda não alcança a qualidade estrutural do melhor software feito à mão. A segunda é a aposta: em QA e teste, segundo ele, o agente é ganho puro, sem trade-off.

O método cabe em um arquivo. Um markdown instrui o agente a trabalhar como QA engineer, com endpoints SSH, chaves e caminhos declarados logo no começo. A primeira tarefa do agente é olhar os commits desde a última release, para concentrar a verificação no que de fato mudou.

Os exemplos vêm dos projetos dele. No DwarfStar, a engine de inferência do antirez para modelos de pesos abertos, o agente confere inferência distribuída entre dois MacBooks e procura regressão de velocidade sem baseline fixa, tratando o desempenho como alvo móvel. No outro exemplo, o agente constrói uma aplicação de teste grande usando arrays no Redis, monta replicação e persistência como em produção e simula dias de uso pesado, caçando comportamento estranho. É um app de exercício do autor, não um teste oficial do projeto Redis.

A frase que sustenta o argumento: cobrir todas as linhas não é cobrir todos os estados. Teste de integração de verdade, com timing, réplicas e inspeção do resultado, sempre foi caro de montar, e por isso vive sendo adiado. O agente remove essa fricção logística. De quebra, pega o que suíte nenhuma mede: feature que se comporta de um jeito surpreendente, documentação que falta, aspereza de uso.

O caveat é dele mesmo: é relato de prática, não estudo, e a conclusão vem com linguagem de "feeling". QA automático talvez suba a régua de qualidade das releases o bastante para compensar parte da bagunça do código gerado rápido. Para quem já tem Claude Code ou Codex instalado, é um experimento de fim de semana: um arquivo markdown e a instrução de desconfiar do seu próprio código.

Fonte: [antirez](http://antirez.com/news/168).

## morerandom alimenta o /dev/random do homelab com microfone, câmera e WASM

Para fechar, um projeto assumidamente desnecessário e delicioso. O post "Entropy", publicado hoje no blog arch.dog, apresenta o morerandom, um serviço caseiro para alimentar o pool de entropia das máquinas de um homelab.

De passagem, o texto ensina coisas que muita gente usa sem saber. Dá para escrever direto no /dev/random para contribuir com o pool. Random e urandom quase não diferem depois do boot. E o kernel re-semeia o gerador mais ou menos a cada minuto.

A montagem é um parquinho técnico. O servidor é escrito em Rust. Plugins em WASM, via Extism, deixam qualquer linguagem contribuir entropia. O autor adicionou captura de microfone e câmera, que é a versão de apartamento da parede de lava lamps que a Cloudflare ficou famosa por manter. Outras máquinas do homelab buscam bytes aleatórios por gRPC, com um timer diário do systemd, e escrevem no próprio pool local.

Tem até um cuidado de design honesto no meio da brincadeira. Para não vazar o que microfone e câmera capturam, toda a coleta passa por um hash BLAKE3, que semeia um stream ChaCha20, re-semeado a cada minuto misturando bytes do próprio stream. É o mesmo desenho do random.c do kernel, e o autor recomenda a talk do Jason Donenfeld sobre a modernização dessa parte do Linux para quem quiser ir fundo.

Os avisos vêm do próprio autor: ele não é criptógrafo, quem controla as entradas pode influenciar o seed, e isso não deve ser a única fonte de entropia de máquina nenhuma. Como projeto para aprender internals do kernel, sistema de plugin e RPC de uma vez só, é difícil achar coisa melhor para um domingo.

Fonte: [arch.dog](https://arch.dog/bark/entropy).

## Destaques rápidos para hoje

- **Twig corrigiu execução de PHP arbitrário que passava por cima do sandbox.** A CVE-2026-46640 permitia que um template fornecido pelo atacante injetasse PHP no código compilado, executado no carregamento do template, antes de qualquer checagem de segurança rodar. O bypass do SandboxExtension era completo, mesmo com sandbox global e allowlist vazia. O cenário de risco é aplicação que aceita template de usuário; quem só roda templates escritos pelo próprio time não está na linha de frente. A correção está no Twig 3.26.0, lançado junto com um lote de outras falhas de sandbox, e o Debian já publicou atualização. Fontes: [Symfony Advisory](https://symfony.com/blog/cve-2026-46640-arbitrary-php-code-execution-via-self-string-macro-reference-compilation) e [Twig 3.26.0](https://symfony.com/blog/twig-3-26-0-released).

- **CISA diz que a falha de negação de serviço no SolarWinds Serv-U já está sendo explorada.** A CVE-2026-28318 entrou no catálogo KEV: um POST sem autenticação com `Content-Encoding: deflate` faz o servidor de arquivos exaurir recursos na decompressão e cair. É indisponibilidade, não invasão, mas derrubar a transferência de arquivos da empresa já dói o suficiente. A correção é a versão 15.5.4 HF1, agências federais americanas têm prazo até 19 de junho, e a cobertura cita mais de 12 mil instâncias expostas na internet, número de Shodan, não da CISA. Fontes: [BleepingComputer](https://www.bleepingcomputer.com/news/security/cisa-hackers-now-exploit-solarwinds-serv-u-flaw-to-crash-servers/) e [The Hacker News](https://thehackernews.com/2026/06/cisa-adds-actively-exploited-solarwinds.html).

- **Malware em quase 2 mil sites WordPress recebia ordens por perfis da Steam.** O relatório da GoDaddy Security, publicado nesta semana, rastreia desde julho de 2025 uma campanha com cerca de 1.980 sites infectados. Em vez de servidor de comando e controle, que blocklist pega, as instruções ficavam em seis caracteres Unicode invisíveis dentro de comentários públicos de perfil da Steam; decodificados, eles reconstroem a URL de um JavaScript disfarçado de biblioteca legítima, servido de `hello-mywordl[.]info` e injetado em todas as páginas do site. A Steam não foi invadida; perfis públicos viraram mural de recados. Para quem opera WordPress: integridade de arquivos PHP e JS, baseline de conexões de saída mesmo para domínio "confiável", e restauração de backup limpo, porque a persistência usa backdoor com cookie de autenticação. Fontes: [GoDaddy Security](https://www.godaddy.com/resources/news/malware-targeting-wordpress-abuses-steam-community-profiles) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/wordpress-malware-campaign-hides-payloads-in-steam-profiles/).

- **AWS abriu o ExtendDB, que fala o protocolo do DynamoDB sobre PostgreSQL.** É um adaptador em Rust, ainda na versão 0.1, sob licença Apache: a aplicação continua falando DynamoDB com os SDKs de sempre, o ExtendDB traduz, e o PostgreSQL guarda os dados. Binário único, TLS obrigatório e autenticação SigV4 com credencial local; a camada de storage é plugável, então backends como Cassandra ou MySQL podem aparecer sem mexer no core. O uso óbvio é dev local, CI e dados que precisam ficar on-prem. Os limites também estão na cobertura: um engenheiro da AWS compara o estágio atual ao DynamoDB Local, e um relato de usuário citado pela InfoQ fala em uns 300 ms de p90 em escrita sob carga concorrente, relato de Reddit, não benchmark oficial. O anúncio da AWS é do fim de maio; a cobertura da InfoQ saiu hoje. Fontes: [InfoQ](https://www.infoq.com/news/2026/06/extenddb-dynamodb-adapter/) e [AWS](https://aws.amazon.com/about-aws/whats-new/2026/05/aws-extenddb-dynamodb/).

- **Leitura de engenharia: fila não conserta sobrecarga.** O texto de Peter Mbanugo é de 11 de abril, então entra aqui como estudo para guardar, não como notícia. A tese aguenta releitura: fila sem limite não resolve sobrecarga sustentada, só garante que a falha será catastrófica em vez de pequena, porque Little's Law (L = λW) não negocia. O ciclo é conhecido: usuário expira, dá refresh, realimenta a fila, e o servidor queima CPU em requests que ninguém espera mais. A conclusão dura é que descartar dados é obrigatório; a escolha real é entre descarte explícito, com load shedding e backpressure respondendo na hora, ou implícito, quando o kernel mata o processo sem pedir licença. Os exemplos de código promovem o framework do próprio autor, o Tina, então leve o princípio e avalie a ferramenta por conta própria. Fonte: [Peter Mbanugo](https://pmbanugo.me/blog/why-queues-dont-fix-overload-and-what-to-do-instead).

## Tendência do dia: o gargalo saiu do teclado e foi para a revisão e a fatura

No dia 5, falamos do ensaio [Code is Cheap(er)](/2026/miasma-agentes-repo-cisco-sdwan-cve-sem-patch/), sobre o custo de entender código que ficou barato de gerar. Hoje apareceram as duas pontas que faltavam nessa conta. A análise de custos sugere que nem a geração era barata de verdade: alguém pagava a diferença, e esse alguém começou a repassar. E o antirez mostra onde o esforço liberado rende mais: verificação, justamente o trabalho que times pulam há décadas por falta de tempo.

Se as duas leituras estiverem certas, o formato do trabalho com agente muda: menos loop infinito de geração, porque cada retry passa a ter preço visível na fatura, e mais investimento em QA automático, o uso com melhor retorno relatado por quem testou de verdade. Vale acompanhar se as próximas mudanças de preço e os próximos relatos de prática continuam apontando para o mesmo lugar.

Fontes de contexto: [TechCrunch](https://techcrunch.com/2026/06/07/is-this-the-dawn-of-the-tokenpocalypse/), [R&A IT Strategy & Architecture](https://ea.rna.nl/2026/06/07/anthropic-openai-may-be-spending-more-than-1000-for-every-100-you-pay-them/) e [antirez](http://antirez.com/news/168).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-06-07
source_mode: briefing
generated_at: 2026-06-07T18:50:00-03:00
source_urls:
  - https://ladybird.org/posts/changing-how-we-develop-ladybird/
  - https://techcrunch.com/2026/06/07/is-this-the-dawn-of-the-tokenpocalypse/
  - https://ea.rna.nl/2026/06/07/anthropic-openai-may-be-spending-more-than-1000-for-every-100-you-pay-them/
  - http://antirez.com/news/168
  - https://arch.dog/bark/entropy
  - https://symfony.com/blog/cve-2026-46640-arbitrary-php-code-execution-via-self-string-macro-reference-compilation
  - https://symfony.com/blog/twig-3-26-0-released
  - https://lists.debian.org/debian-security-announce/2026/msg00222.html
  - https://www.bleepingcomputer.com/news/security/cisa-hackers-now-exploit-solarwinds-serv-u-flaw-to-crash-servers/
  - https://thehackernews.com/2026/06/cisa-adds-actively-exploited-solarwinds.html
  - https://www.godaddy.com/resources/news/malware-targeting-wordpress-abuses-steam-community-profiles
  - https://www.bleepingcomputer.com/news/security/wordpress-malware-campaign-hides-payloads-in-steam-profiles/
  - https://www.infoq.com/news/2026/06/extenddb-dynamodb-adapter/
  - https://aws.amazon.com/about-aws/whats-new/2026/05/aws-extenddb-dynamodb/
  - https://github.com/ExtendDB/extenddb
  - https://pmbanugo.me/blog/why-queues-dont-fix-overload-and-what-to-do-instead
coverage:
  - ladybird-no-public-prs: main block (lead); June 5 announcement, Andreas Kling authorship, no public PRs, all open PRs closed, no shadow contribution channel, AI-broke-effort-proxy reasoning paraphrased (no 'sleeper-agent' label), browser-runs-hostile-input risk, non-code contributions still welcome, maintainers-use-AI nuance, first-alpha timing without date, no BSD claim; light continuity sentence to recent npm/agent-config worm arc without link.
  - ai-cost-reckoning-tokenpocalypse: main block; both June 7 sources, Copilot per-token (late May), Tokenpocalypse Reddit origin, Uber four-month budget burn + caps, Anthropic IPO filing June 1, $20 ChatGPT 'spit out' price, >$1000-per-$100 saturated estimate, ~$75/task, 1M-token query ≈ $25, '$20 in 20 minutes', 2.5x measured / ~12x ceiling subsidy factor, thinking tokens billed as output at $25/MTok Opus, mandatory estimate/model-assisted/personal-usage hedges, measure-cost-per-task advice; arxiv Tokenomics paper NOT cited; sources not summed as one dataset.
  - antirez-ai-qa-testing: main block; June 7 antirez.com/news/168, two-part thesis (generation still loses to best manual code; QA strictly more powerful), markdown QA-agent method with SSH endpoints/keys at file start, commits-since-release specialization, DwarfStar two-MacBook distributed inference + no-hardcoded-baseline speed regression, Redis arrays app with replication/persistence (flagged as author's exercise app, not official Redis test), 'covering lines is not covering states', psychological QA side, author's 'feeling' hedge preserved; framed as practitioner opinion.
  - homelab-entropy-morerandom: main block; June 7 arch.dog 'Entropy' post, /dev/random writable, random≈urandom post-boot, kernel minute reseed, Extism WASM plugins, Rust mic/camera capture (lavarand/Cloudflare lava lamp framing), gRPC fetch + daily systemd timer, BLAKE3→ChaCha20 minute reseed mirroring random.c, Donenfeld talk reference, not-a-cryptographer and not-sole-entropy-source caveats preserved.
  - twig-sandbox-bypass-cve-2026-46640: quick hit; compile-time PHP injection before checkSecurity (described without PoC detail or the _self syntax), complete SandboxExtension bypass with empty allowlist, user-supplied-template scenario limit, fixed in 3.26.0, batch of sandbox CVEs in one clause, Debian DSA; primary advisory chain cited instead of briefing's Reddit link; CVSS number not cited.
  - solarwinds-serv-u-kev-dos: quick hit; CVE-2026-28318 KEV addition, unauthenticated deflate-POST resource exhaustion, DoS-not-RCE framing, fix 15.5.4 HF1, June 19 federal deadline, 12k+ Shodan figure attributed to coverage.
  - steam-profiles-wordpress-c2: quick hit; GoDaddy primary + BleepingComputer, ~1,980 sites since July 2025, reported-this-week freshness framing, six invisible Unicode characters, Steam-not-hacked clarification, hello-mywordl[.]info defanged in inline code, behavioral defense + clean-backup guidance; Imunno System/tabnews promo NOT cited.
  - extenddb-dynamodb-postgres: quick hit; v0.1 Rust Apache-2.0, wire protocol over PostgreSQL, unchanged SDKs, TLS/SigV4, pluggable storage trait, dev/CI/on-prem uses, DynamoDB Local comparison by AWS engineer, ~300ms p90 attributed as Reddit user report via InfoQ, late-May announcement vs June 7 coverage date framing.
  - queues-dont-fix-overload: quick hit (demoted from briefing Top Story #1 by curator date correction); explicit April 11 date and estudo-not-news framing, Little's Law, latency death spiral, explicit-vs-implicit drop (load shedding/backpressure vs OOM kill), author's Tina framework flagged as self-promotion to evaluate independently. Fred Hebert paraphrased via the thesis.
  - trend section: single thread chosen = 'work moved from typing to verifying and paying' (cost + antirez + continuity link to June 5 Code is Cheap(er) coverage); the alternative open-source-trust thread was NOT written as a second trend (June 6 trend already covered inherited-trust territory).
omitted_briefing_items:
  - Why Queues Don't Fix Overload as Top Story: demoted to evergreen quick hit (page dated April 11, 2026; curator freshness correction).
  - IronWorm npm malware: 3 days old, omitted in June 5 post, npm-worm theme saturated June 4-6, no new public delta.
  - Weaponized 'Attack Shark' keyboard BadUSB: Reddit-only sourcing, no vendor/researcher writeup validated.
  - Silent Ransom Group hits law firms: lower dev-audience fit, crowded out of security quota.
  - C0XMO botnet (DD-WRT): not validated in this pass, crowded out.
  - Stop MITM on first SSH connection: May 8 evergreen, already omitted June 5 and 6, repeat_without_delta.
  - NVIDIA garak tutorial: tutorial content, no news event, secondary source.
  - Managing Microsoft identity (Reddit): vendor-framed, weak sourcing.
  - Rate limiting isn't enough (Reddit): timeless-advice thread, no event.
  - OpenAI harness engineering (Feb 11): four months old, briefing-flagged resurfaced.
  - Meet Harness-1 (marktechpost): vendor coverage only, claims not validated.
  - Agents need a work contract (tabnews): opinion piece, crowded out, antirez carries the verification theme.
  - Context sculpting: niche experiment, crowded out.
  - My automated doubt process: overlaps antirez theme, crowded out.
  - Tokenomics paper (arxiv 2601.14470): NOT validated; deliberately not cited in the cost block.
  - GEPA prompt optimization: tutorial, no event.
  - Her (Claude Code session detective): hackathon project, niche.
  - Managing multiple MCP servers (Reddit): discussion thread, no payload.
  - Eli Bendersky LLM-agent projects: full block in TODAY'S morning post, repeat_without_delta.
  - Lathe Go CLI harness: small project, no event.
  - Gemma 4 MTP 'merged June 7': REJECTED on verification — llama.cpp PR #23398 is a draft opened May 20, NOT merged; central claim failed primary source.
  - Gemma 4 12B unified architecture / QAT-label trap / Qwen 3.6 benchmarks and laptop reports / RAM vs VRAM: Reddit-only community reports, not validated.
  - How LLMs actually work (0xkato): evergreen explainer, no hook.
  - PyTorch MoE framework: projected (not measured) numbers, Reddit-only.
  - open-deepthink distillation: hobby project, niche.
  - Alternatives to ChromaDB (Reddit): discussion, no event.
  - Unusual non-LLM AI (Reddit): noisy thread, no payload.
  - Moving beyond fork+exec (LWN): main block in TODAY'S morning post, repeat_without_delta.
  - Verifying /proc: evergreen, not validated, crowded out.
  - io_uring buffer management (noteflakes): fresh essay, no news event, candidate for slower day.
  - Flatten the Pick cgroup patches: briefing-flagged watch-list.
  - Guix-Nix abomination: quick hit in TODAY'S morning post, repeat_without_delta.
  - sysfig config management: young Reddit-sourced project, audit-before-trust per briefing.
  - WorldIP.io IPv4 map: bookmark, no event.
  - Wayland Protocols 1.49 / Firefox Vulkan decoding: briefing-flagged quiet watch items.
  - How's Linear so fast (May 3): evergreen, briefing-flagged not-today.
  - Kyushu WASM sandbox / TakoVM / Kefka (Xe Iaso): sandbox slot saturated by recent coverage (June 6 micropython-wasm), early experiments, crowded out.
  - Oproxy Rust MITM proxy: project page, no event.
  - Pure-Go SQLite virtual tables: niche, not validated.
  - mdBook preprocessors (2025): evergreen, author already featured this morning.
  - Keybench: bookmark material per briefing.
  - Silurus ooxml viewer: case-study material, no event.
  - LLMs eroding my career (essay) / Netlify CTO interview / Jane Street Claude-vs-Figma: AI-and-the-job slots already filled by cost + antirez blocks; secondary or unvalidated.
  - Microsoft OpenClaw runtime claim: REJECTED — TechCrunch's own June 2 coverage contradicts the 'open-sourced the runtime' framing; too garbled to print.
  - The user doesn't care, but you should: short rebuttal, no payload.
  - 12 Commandments of Synchronization (2012) / Obfuscated C Contest winners: timeless/evergreen, crowded out.
  - Claude Desktop for Linux petition: community petition, not an event; 28% Ubuntu figure unverified.
-->
