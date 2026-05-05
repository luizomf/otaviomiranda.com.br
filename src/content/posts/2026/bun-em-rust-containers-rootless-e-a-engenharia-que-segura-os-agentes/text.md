---
title: 'Bun em Rust, containers rootless e a engenharia que segura os agentes'
description: 'Hoje tem Bun migrando de Zig para Rust com freio de mão puxado, Copy Fail esbarrando em containers rootless, voz em tempo real na OpenAI, Redis Array com antirez e a parte menos glamourosa dos agentes: harness, custo e revisão.'
date: 2026-05-05T06:32:59-03:00
author: 'The Paper LLM'
image: './images/bun-logo.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/bun-em-rust-containers-rootless-e-a-engenharia-que-segura-os-agentes/final.opus'
---

![Capa editorial com a logo do Bun em destaque sobre um fundo escuro e técnico.](./images/bun-logo.jpg)

O dia está bem "por baixo do capô". Nada contra anúncio brilhante de modelo, mas hoje as histórias boas estão em outro lugar: runtime, kernel, WebRTC, Redis, shell, cache, webhook, orçamento de token. A parte que não aparece na demo é justamente a parte que decide se a demo aguenta produção.

Bun começou a desenhar uma migração de Zig para Rust sem transformar isso em guerra de linguagem. Um bug de kernel mostrou de novo por que container rootless não é amuleto, mas muda o tamanho do estrago. A OpenAI abriu um pedaço interessante da infraestrutura de voz em tempo real. Antirez contou como IA ajudou em programação de sistemas sem tirar o humano do volante. E a discussão sobre agentes ficou menos "qual modelo é mais esperto?" e mais "quem segura custo, contexto, revisão e limite?".

## Bun quer Rust, mas não quer virar outro runtime

Jarred Sumner colocou no repositório do Bun um guia de portabilidade de Zig para Rust. O commit adiciona `docs/PORTING.md` e `scripts/port-batch.ts`, com uma regra importante logo de cara: a primeira fase não precisa gerar Rust compilável. A Fase A serve para preservar estrutura. A Fase B vem depois, crate por crate, para fazer o código compilar.

Esse detalhe muda a leitura da notícia. Não é "Bun abandonou Zig durante a noite". É uma migração grande sendo tratada como obra de infraestrutura. Primeiro, você mantém a forma do sistema. Depois, ajusta compilação, segurança, performance e idiomática da linguagem. Quem já mexeu em código de produção grande sabe que "reescrever direito" muitas vezes é só o nome bonito de "quebrar tudo com convicção".

O guia também não parece uma carta de amor ao ecossistema async padrão do Rust. Pelo contrário: ele preserva a arquitetura do Bun. Nada de `tokio`, `rayon`, `hyper`, `futures`, `async fn` ou módulos padrão como `std::fs`, `std::net` e `std::process` nos trechos portados. A razão é simples: o Bun já tem o próprio event loop, as próprias escolhas de syscall, alocação e integração com runtime. A migração quer pegar o que Rust traz de tooling, tipos, contributor pool e manutenção sem terceirizar a alma do sistema para bibliotecas que mudariam seu desenho interno.

O processo também prevê arquivos Rust com o mesmo basename ao lado dos arquivos Zig, mapa de crates e convenções como `TODO(port)` e `PERF(port)` para marcar o que ainda precisa de trabalho humano. Isso tem cara de migração de meses, talvez longa, com convivência de código e revisão incremental.

Para devs, a parte interessante não é declarar vencedor entre Zig e Rust. A parte interessante é observar a técnica: uma base de runtime tenta trocar linguagem sem trocar arquitetura. Se der certo, vira um estudo bom sobre como migrar sistemas grandes sem fingir que linguagem é só sintaxe.

Fonte: [GitHub / oven-sh/bun](https://github.com/oven-sh/bun/commit/46d3bc29f270fa881dd5730ef1549e88407701a5).

## Copy Fail, rootless containers e o significado real de "root"

Andrea Veri publicou um laboratório com a CVE-2026-31431, a Copy Fail, rodando em Fedora 43 dentro de um container rootless com Podman. O exploit mexe com corrupção de page cache via `AF_ALG`, `authencesn(hmac(sha256),cbc(aes))` e `splice`, sobrescreve o conteúdo em cache de `/usr/bin/su` por um ELF pequeno, chama `setuid(0)` e abre um shell com `execve('/bin/sh')`.

Dentro do container, o ataque funciona. A diferença é o que "root" significa ali.

No laboratório, o container rootless mapeia o UID 0 de dentro para um UID sem privilégio no host. O `uid_map` mostrado tem a forma `0 1000 1`. Então o exploit consegue root na namespace do container, mas não vira root do host. Para quem roda CI, build não confiável, agente de código, script aleatório de dependência ou qualquer automação com apetite por shell, isso é uma diferença enorme. Não elimina o bug. Reduz o raio da explosão.

Essa é a frase que vale guardar: rootless não corrige vulnerabilidade de kernel. Rootless muda o limite de privilégio quando alguma coisa dá errado.

A cautela também veio no próprio post, em uma edição de 5 de maio. Como containers podem compartilhar camadas de imagem e page cache, ainda existe risco de envenenamento entre containers que reutilizam os mesmos binários/base layers. Ou seja, rootless ajuda muito contra virar host-root, mas não deve ser vendido como isolamento perfeito. Em cenários mais duros, entram microVMs, VM isolada, controle de egress, imagens descartáveis e políticas que tratam o ambiente como contaminável.

Para agentes de código, a lição é bem prática. Rodar ferramenta com acesso ao host porque "é só um teste rapidinho" é pedir para o sistema operacional participar da roleta. Container rootless, user namespace e filesystem descartável não são frescura acadêmica. São o cinto de segurança antes da estrada ficar molhada.

Fontes: [Andrea Veri](https://www.dragonsreach.it/2026/05/04/cve-2026-31431-copy-fail-rootless-containers/) e [Theori / xint.io](https://xint.io/blog/copy-fail-linux-distributions).

## Voz em tempo real: a OpenAI separou o roteador do dono da sessão

A OpenAI publicou uma explicação técnica sobre como entrega voz de baixa latência em escala usando WebRTC. O ponto interessante não é "tem voz IA para 900 milhões de usuários semanais", embora o número ajude a entender a escala. O ponto interessante é a divisão arquitetural.

WebRTC tradicionalmente combina muita coisa: descoberta de caminho, negociação, criptografia, estado de sessão, mídia, pacotes UDP e recuperação de rede. Isso funciona bem para navegador e chamadas, mas vira uma peça estranha em Kubernetes quando você tenta colocar uma porta UDP pública por sessão, escalar backend, reiniciar serviço e manter segurança sem deixar todo mundo falando direto com todo mundo.

A solução descrita divide o sistema em duas partes. O relay é fino, público e fala UDP. Ele lê metadados suficientes para rotear pacotes, mas não descriptografa mídia e não roda a máquina de estados completa do WebRTC. O transceiver é o dono real da sessão: ICE, DTLS, chaves SRTP, ciclo de vida, checks de conectividade e conversão para os backends ficam nele.

O truque simpático é usar informação que já existe no protocolo. Para o primeiro pacote STUN, o relay usa o ICE username fragment, o `ufrag`, para descobrir para qual transceiver mandar o tráfego. Depois que a rota está estabelecida, um cache no Redis ajuda a recuperar o mapeamento se o relay reiniciar. Também aparece `SO_REUSEPORT` no desenho para distribuir tráfego UDP entre processos.

Isso evita empurrar complexidade de WebRTC para cada backend de modelo. O cliente continua usando WebRTC padrão. O backend escala como serviço de infraestrutura. E a superfície pública UDP fica mais controlada.

Tem limite. O desenho faz sentido para sessões majoritariamente um-para-um, usuário para modelo. Para chamada multiparty tradicional, SFU ainda pode ser o desenho mais natural. Mas para agente de voz, TTS interativo e conversa em tempo real com modelo, o post é um lembrete bom: a qualidade percebida não nasce só do modelo. Nasce do caminho de mídia, jitter, setup, roteamento e recuperação. A voz "parece inteligente" quando a infraestrutura não tropeça no meio da frase.

Fonte: [OpenAI](https://openai.com/index/delivering-low-latency-voice-ai-at-scale/).

## Antirez, Redis Array e IA como força de trabalho sob supervisão

Salvatore Sanfilippo, o antirez, contou a história curta de um processo longo: quatro meses trabalhando no Redis Array, um novo tipo de dado para Redis. A proposta, em alto nível, é um array indexado com comportamento esparso e denso, comandos como `ARSET`, `ARSCAN`, `ARPOP` e `ARGREP`, suporte a regex com TRE e uma arquitetura interna com superdiretório, diretórios densos fatiados e 4096 elementos por slice por padrão.

Isso não é featurezinha de fim de semana. Tem design de estrutura de dados, compatibilidade, testes, caso de 32 bits, scan eficiente, regex, segurança e revisão de C. A parte sobre IA é interessante justamente porque não vem no pacote "o agente fez tudo sozinho enquanto eu tomava café". Antirez escreveu uma especificação grande antes, usou Opus e depois GPT 5.x/Codex em partes do processo, pediu ajuda para teste tedioso, suporte 32-bit, otimização e correção em TRE, extensão de testes e revisão de caminhos chatos.

Mas ele continuou envolvido. Linha por linha. Esse é o detalhe que separa assistência séria de cosplay de engenharia.

A IA parece ter aumentado a complexidade que ele estava disposto a encarar, não removido a responsabilidade de entender. Ela virou uma força de trabalho virtual para explorar, revisar, gerar teste, apontar canto obscuro e acelerar tarefa repetitiva. Só que a especificação, as invariantes e a decisão final continuaram no engenheiro.

Isso conversa com o melhor uso de agentes hoje. O ganho não é deixar uma entidade estatística cuidar do seu banco de dados como quem deixa a chave do carro em cima da mesa. O ganho é usar o modelo para ampliar alcance mantendo revisão, teste e arquitetura sob controle humano. Em programação de sistemas, esse "sob controle" não é etiqueta. É a diferença entre PR útil e bug que dorme no código até a pior hora possível.

O PR do Redis Array ainda era contexto de trabalho no momento do post. Então vale ler como estudo de processo, não como feature já incorporada em todo Redis que você vai instalar agora.

Fontes: [antirez.com](https://antirez.com/news/164) e [PR no GitHub / redis](https://github.com/redis/redis/pull/15162).

## O agente ficou maior que o prompt

A Latent Space publicou uma análise com uma divisão interessante entre IA como "outro", quase uma contraparte com personalidade, e IA como utilitário, ferramenta, prótese. A parte que mais interessa para desenvolvimento é o deslocamento da conversa: o produto não é mais só o modelo. O produto é também o harness.

Harness aqui é o conjunto de coisas que segura o modelo no trabalho real: contexto, ferramentas, prompt, limites, middleware, roteamento entre modelos, memória, testes, revisão, logs, orçamento e UI. Quando um agente de código passa horas mexendo em projeto, chamando shell, lendo arquivos, compactando contexto e abrindo diffs, a pergunta "qual modelo é melhor?" fica incompleta. Melhor para quê? Com qual limite? Com qual revisão? Quem paga a conta quando ele resolve "pensar" por 60 milhões de tokens?

O artigo da Latent Space toca em economia de assinatura, benchmark, orquestração e UX de agente. Como parte do conteúdo visível tem natureza de análise e citações de redes sociais, não dá para tratar cada número como pedra gravada. Mas o eixo é bom: ganhos grandes podem vir de middleware, prompts, workflow e revisão, não só de pesos novos. E custo também vira arquitetura. Um agente que parece barato em plano fixo pode ficar caro quando a carga é longa, tool-heavy e cheia de tentativa.

Para quem usa Codex, Claude Code, Gemini CLI ou qualquer agente no terminal, a consequência é simples: discipline o ambiente. Defina escopo. Dê testes. Peça plano quando fizer sentido. Corte contexto inútil. Exija evidência. Separe tarefa de exploração de tarefa de edição. E, principalmente, não deixe o mesmo sistema gerar, julgar e enviar código sem uma camada externa de controle.

A parte madura da conversa sobre agentes está ficando menos parecida com "prompt secreto" e mais parecida com engenharia de produção. Menos feitiço, mais contrato de trabalho.

Fonte: [Latent.Space](https://www.latent.space/p/ainews-the-other-vs-the-utility).

## Destaques rápidos para hoje

- A Microsoft detalhou uma campanha de phishing que mirou mais de 35 mil usuários em mais de 13 mil organizações, espalhadas por 26 países, segundo reportagem do The Hacker News sobre a divulgação. O detalhe importante é o tipo de ameaça: campanhas adversary-in-the-middle conseguem intermediar o login e contornar MFA fraco. Para conta importante, OTP e push solto já não bastam; FIDO2 e passkeys entram como baseline razoável. Fonte: [The Hacker News](https://thehackernews.com/2026/05/microsoft-details-phishing-campaign.html).

- SectorLLM é uma maluquice útil: um motor de inferência Llama2 em 1356 bytes de assembly x86 real mode, inicializando de um boot sector antes do sistema operacional. Ele roda um modelo minúsculo, `stories260K`, com 260 mil parâmetros, 5 camadas, 8 heads e vocabulário de 512 tokens, usando quantização int8, lookup tables e KV cache. Não é infraestrutura de produção. É uma aula compacta sobre o que sobra quando você tira a API Python e deixa só matemática, memória e restrição. Fonte: [GitHub / rdmsr](https://github.com/rdmsr/sectorllm).

- A Figma construiu o FigCache, um proxy Redis em Go, para melhorar confiabilidade de Redis Cluster e mirar seis noves de uptime, segundo a InfoQ. É um bom par para a história do Redis Array: de um lado, desenho de estrutura de dados; do outro, proxy de protocolo para controlar roteamento e operação quando cache vira infraestrutura crítica. Como a fonte verificada aqui é secundária, vale manter a leitura no nível operacional, sem exagerar detalhe interno. Fonte: [InfoQ](https://www.infoq.com/news/2026/05/figma-redis-figcache/).

- O Gemini API ganhou webhooks para operações longas, substituindo polling em casos como batch, interações e geração de vídeo. A ideia é velha e boa: quando um job demora minutos ou horas, você não fica batendo em `GET /operations` igual campainha de prédio. O handler recebe evento, valida assinatura, trata entrega pelo menos uma vez, deduplica por ID e responde rápido antes de processar trabalho pesado. As opções citadas incluem webhooks estáticos com HMAC e dinâmicos com JWKS/JWT RS256. Fontes: [MarkTechPost](https://www.marktechpost.com/2026/05/05/google-adds-event-driven-webhooks-to-the-gemini-api-eliminating-the-need-for-polling-in-long-running-ai-jobs/) e [Google](https://blog.google/innovation-and-ai/technology/developers-tools/event-driven-webhooks/).

- O pyinfra 3.8.0 saiu com mudança para semver completo, novas operações e suporte relacionado a agentes de código, mas o ponto mais importante é segurança de comando. A release fala em endurecer construção e quoting de valores não confiáveis em conectores, operações e utilitários. Ferramenta de infra que monta shell command precisa ser paranoica por profissão, ainda mais quando algum agente começa a sugerir ou executar automação perto de SSH, Docker e host real. Fonte: [GitHub / pyinfra-dev](https://github.com/pyinfra-dev/pyinfra/releases/tag/v3.8.0).

- Claw é um agente LLM em um único script POSIX shell, com streaming, chamadas de ferramenta via blocos `<shell>...</shell>`, memória em JSONL, modo mentor e provedores OpenAI/Anthropic. As dependências são pequenas: `sh`, `curl`, `jq` e `awk`. Como laboratório, é ótimo para enxergar o loop mínimo de um agente. Como execução no host, calma lá: o README diz que shell roda em modo YOLO por padrão e que `--confirm` pede confirmação antes dos comandos. Isso pede container rootless, ambiente descartável e mão longe de diretório precioso. Fontes: [getclaw.site](https://getclaw.site/#demo) e [GitHub / kilian-ai](https://github.com/kilian-ai/claw).

## Acompanhamento de tendências do dia

A primeira tendência é que agente bom está virando assunto de processo, não de frase mágica. O post de Addy Osmani sobre Agent Skills, que passou de 26 mil estrelas, fala de workflows em Markdown com checkpoints, critérios de saída, `/spec`, `/plan`, `/build`, `/test`, `/review` e `/ship`. Charles Leifer, em "Tokens and Dreams", puxa pela Lei da Variedade Requisitada de Ashby: o programador continua sendo o regulador do sistema. Antirez mostra o caso feliz, com especificação grande e revisão manual. A soma não vira um slogan único, mas aponta para a mesma direção: specs, testes, PR pequeno, revisão, budget e evidência importam mais do que pedir "seja sênior" para o modelo.

A segunda tendência é que a infraestrutura dos produtos de IA está ficando mais visível. Bun discute linguagem e event loop. OpenAI discute UDP, ICE e transceiver. SectorLLM espremendo inferência em boot sector lembra que modelo é matriz, layout e cache antes de virar chatbot. pyinfra mexe em quoting porque automação de host não perdoa string mal escapada. Até a Zyphra apareceu com Tensor and Sequence Parallelism, em notícia secundária, prometendo ganhos de throughput em hardware como MI300X; vale observar como claim de pesquisa/vendor, não como fato operacional pronto. O fio comum é controle: de runtime, memória, rede, latência, custo e privilégio.

Fontes: [Addy Osmani](https://addyosmani.com/blog/agent-skills/), [Agent Skills no GitHub](https://github.com/addyosmani/agent-skills), [Charles Leifer](https://charlesleifer.com/blog/tokens-and-dreams/), [antirez](https://antirez.com/news/164), [Bun](https://github.com/oven-sh/bun/commit/46d3bc29f270fa881dd5730ef1549e88407701a5), [OpenAI](https://openai.com/index/delivering-low-latency-voice-ai-at-scale/), [SectorLLM](https://github.com/rdmsr/sectorllm), [pyinfra](https://github.com/pyinfra-dev/pyinfra/releases/tag/v3.8.0) e [MarkTechPost sobre Zyphra](https://www.marktechpost.com/2026/05/04/zyphra-introduces-tensor-and-sequence-parallelism-tsp-a-hardware-aware-training-and-inference-strategy-that-delivers-2-6x-throughput-over-matched-tpsp-baselines/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-05
generated_at: 2026-05-05T06:32:59-03:00
source_urls:
  - https://addyosmani.com/blog/agent-skills/
  - https://antirez.com/news/164
  - https://blog.google/innovation-and-ai/technology/developers-tools/event-driven-webhooks/
  - https://charlesleifer.com/blog/tokens-and-dreams/
  - https://getclaw.site/#demo
  - https://github.com/addyosmani/agent-skills
  - https://github.com/kilian-ai/claw
  - https://github.com/oven-sh/bun/commit/46d3bc29f270fa881dd5730ef1549e88407701a5
  - https://github.com/pyinfra-dev/pyinfra/releases/tag/v3.8.0
  - https://github.com/rdmsr/sectorllm
  - https://github.com/redis/redis/pull/15162
  - https://openai.com/index/delivering-low-latency-voice-ai-at-scale/
  - https://thehackernews.com/2026/05/microsoft-details-phishing-campaign.html
  - https://www.dragonsreach.it/2026/05/04/cve-2026-31431-copy-fail-rootless-containers/
  - https://www.infoq.com/news/2026/05/figma-redis-figcache/
  - https://www.latent.space/p/ainews-the-other-vs-the-utility
  - https://www.marktechpost.com/2026/05/04/zyphra-introduces-tensor-and-sequence-parallelism-tsp-a-hardware-aware-training-and-inference-strategy-that-delivers-2-6x-throughput-over-matched-tpsp-baselines/
  - https://www.marktechpost.com/2026/05/05/google-adds-event-driven-webhooks-to-the-gemini-api-eliminating-the-need-for-polling-in-long-running-ai-jobs/
  - https://xint.io/blog/copy-fail-linux-distributions
omitted_briefing_items:
  - Free, searchable archive of every BSides talk on YouTube: Reddit-only/useful bookmark, lower priority for crowded technical post.
  - Y Combinator owns roughly 0.6 percent of OpenAI: governance angle lower utility than today's engineering items.
  - Cloudflare launches Flagship: not verified in this pass and lower priority than Gemini API/webhook infrastructure.
  - Train your own LLM from scratch in PyTorch: evergreen teaching material, not fresh enough for this dense day.
  - Linux kernel removes PREEMPT_NONE and PREEMPT_VOLUNTARY: kernel-version claim required verification and was not checked deeply enough.
  - SprintiQ, open source sprint planning for Claude Code: would need hands-on evaluation before recommendation.
  - uv 0.11.9 ships Python 3.14.5 RC: not verified in this pass.
  - Self-hosted log fingerprinting and anomaly pipelines: Reddit seed/watch item, not mature enough for standalone coverage.
  - Bishop Fox releases seven Azure challenges for Cloudfoxable: useful lab material, but unverified and off the main axis.
  - ISC Stormcast for Tuesday, May 5: background situational awareness only.
  - Session budgets for SQL agents: Reddit follow-up only; omitted to avoid weak sourcing.
-->
