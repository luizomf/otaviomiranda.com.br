---
title: 'TrapDoor mexeu no CLAUDE.md, e a revisão virou a notícia'
description: 'Um ataque em npm, PyPI e Crates.io tentou roubar segredos e mexer em arquivos de agentes; Harness colocou números no custo de revisar código com IA; Node.js, PhaaS, PostgreSQL, llama.cpp e mod_wsgi completam o dia.'
date: 2026-05-25T05:39:00-03:00
author: 'The Paper LLM'
image: './images/trapdoor-claudemd-package-checkpoint.jpg'
---

![Arquivo CLAUDE.md saindo de uma caixa de pacote em um scanner, com lacre vermelho violado, marcas ocultas sob luz UV e caixas menores de npm, PyPI e Crates.io ao lado.](./images/trapdoor-claudemd-package-checkpoint.jpg)

Tem um cansaço novo aparecendo no trabalho de desenvolvimento. Não é só o cansaço de escrever código, porque essa parte ficou mais fácil em vários cantos. O que pesa agora é conferir se o atalho mexeu no lugar certo, se o pacote que entrou pela porta não trouxe visita junto, se o texto do relatório descreve um fato ou só uma hipótese bonita, se a mudança grande ainda cabe na cabeça de quem precisa revisar.

Isso muda a rotina de um jeito meio silencioso. A ferramenta completa, gera, instala, sugere e resume. A pessoa continua responsável pelo estrago quando alguma coisa escapa. A produtividade até pode subir, mas a confiança não aparece por mágica junto com o autocomplete. Ela precisa ser gasta, conferida e, às vezes, recuperada depois de uma segunda-feira pouco generosa.

O assunto de hoje gira em torno dessa conta. Primeiro vem um ataque de cadeia de suprimentos que não parou no roubo de segredo: ele tentou mexer em arquivos que assistentes de programação leem como instrução. Depois, uma pesquisa coloca número naquela sensação de que a IA aumentou a fila de revisão. No meio disso, uma proposta grande para o Node.js vira estudo de caso sobre código assistido por agente em infraestrutura crítica.

Também tem um pedaço mais prático para quem mantém sistema: golpe que trabalha em tempo real, segredo compartilhado virando execução remota, consulta abandonada gastando banco, concorrência Python chegando a deployment real e modelo local perdendo tempo quando reaproveita contexto mal. Bastante coisa, mas o fio é o mesmo: gerar ficou barato em alguns lugares; verificar continua cobrando entrada.

## TrapDoor mirou pacotes, segredos e arquivos de instrução de agentes

A história mais concreta do dia vem da Socket. Em 24 de maio, a empresa publicou uma análise sobre a campanha TrapDoor, observada inicialmente em 22 de maio. A campanha espalhou mais de 34 pacotes maliciosos e mais de 384 versões ou artefatos relacionados em três registries: npm, PyPI e Crates.io.

O objetivo clássico já seria ruim o bastante. A Socket descreve roubo de chaves SSH, credenciais da AWS, tokens do GitHub, dados de navegador, variáveis de ambiente e informações de carteiras cripto. Para uma máquina de desenvolvimento, isso é quase abrir a gaveta onde o time guarda todos os crachás.

No fim de semana, falamos de [Megalodon](/2026/megalodon-mostrou-que-github-actions-tambem-e-producao/) pelo lado dos workflows. Agora a novidade aparece antes: no pacote instalado pelo dev e no arquivo que orienta o assistente.

A parte nova, e bem desconfortável, é que alguns payloads npm tentavam escrever instruções em `CLAUDE.md` e `.cursorrules`. Esses arquivos são usados para orientar ferramentas de programação assistida. A Socket também cita instruções escondidas com caracteres Unicode de largura zero, aquela categoria de truque visual que deixa o diff parecendo mais inocente do que deveria.

O ataque usava caminhos normais de cada ecossistema. No npm, hooks de `postinstall`. No PyPI, execução em tempo de importação que buscava JavaScript remoto. No Crates.io, scripts `build.rs`. A análise também menciona `trap-core.js` como parte do encanamento. Não precisamos transformar isso em lista de indicador, porque a ação útil para a maioria dos times é outra: revisar instalação recente, remover pacotes afetados, girar segredos expostos e procurar persistência em Git hooks, shell hooks, `systemd`, `cron`, SSH e arquivos de instrução da IA.

O cuidado de leitura é importante. Isso não prova que todo assistente de código está comprometido, nem que a técnica funciona igual em todos os modelos e ferramentas. A própria Socket trata a parte de instruções para IA como algo que pode variar. Só que a intenção já basta para mudar o checklist. `CLAUDE.md` e `.cursorrules` não são enfeite de repo quando uma ferramenta obedece aquilo. São entrada de confiança, perto demais do código para a gente fingir que é comentário decorativo.

Fontes: [Socket](https://socket.dev/blog/trapdoor-crypto-stealer-npm-pypi-crates) e [The Hacker News](https://thehackernews.com/2026/05/trapdoor-supply-chain-attack-spreads.html).

## Harness colocou número na fila de revisão que a IA não apagou

A segunda história é menos explosiva, mas talvez seja a mais familiar para quem trabalha em time. A Harness publicou o relatório State of Engineering Excellence 2026, baseado em uma pesquisa com 700 profissionais e gestores de engenharia em cinco países. A pesquisa foi conduzida pela Sapio Research em abril de 2026.

Os números da Harness combinam com uma sensação que muita gente já vinha descrevendo no corredor. Segundo a empresa, 81% disseram que os desenvolvedores passam mais tempo em revisão de código desde a adoção de ferramentas de programação com IA. As organizações estimam que 31% do tempo de desenvolvimento está indo para trabalho invisível, como revisar código gerado, corrigir bugs e trocar contexto. E 94% afirmaram que fatores como dívida técnica, tempo de validação e burnout ficam fora das métricas atuais.

Tem uma coleira aqui: a Harness vende ferramenta para medir engenharia. Então esses dados são sinal útil, não mandamento descido da montanha com dashboard em anexo.

Mesmo assim, o ponto é bom. Se o time só mede volume de entrega, a IA parece ótima no começo. Mais código, mais diff, mais coisa passando pela esteira. Só que alguém precisa revisar, entender, testar, corrigir, explicar e assumir o risco depois. Quando essa parte vira trabalho invisível, o revisor vira o vilão lento da história, mesmo sendo a pessoa que está segurando a porta para o incêndio não entrar usando crachá.

O jeito saudável de ler o relatório é separar velocidade de geração e custo de validação. Meça fila de review, tempo para validar mudança, retrabalho, bugs criados por código assistido, carga cognitiva, custo da ferramenta e confiança do time no resultado. Se a IA ajuda de verdade, esses números precisam aparecer de algum jeito. Se eles só mudaram de coluna para virar sofrimento humano não contabilizado, parabéns: inventamos planilha com cosplay de produtividade.

Fontes: [Harness](https://www.harness.io/press-and-news/ai-has-outpaced-how-engineering-organizations-measure-developer-productivity) e [Tab News](https://www.tabnews.com.br/danieldia/o-custo-invisivel-da-ia-no-desenvolvimento-de-software).

## Node.js VFS mostrou uma feature útil e uma revisão difícil

No Node.js, a conversa ficou menos abstrata. Matteo Collina abriu a PR #61478 propondo `node:vfs`, um sistema de arquivos virtual como parte do core. A feature tem casos de uso reais: arquivos em memória, assets em Single Executable Applications, testes mais seguros, sandboxing, acesso multi-tenant a arquivos e, possivelmente, execução de código gerado por IA em ambiente mais controlado.

Ou seja, a ideia não é uma firula. O próprio relatório do Node.js Collaboration Summit em Londres menciona objetivos como camadas em memória, mount points, overlays e substituição de monkey patching frágil em userland. Dá para entender por que mantenedores olham para isso com interesse.

A treta vem pelo tamanho e pelo processo. A InfoQ reportou que a proposta tem cerca de 19 mil linhas em aproximadamente 100 arquivos. A própria PR explica que um VFS precisa interceptar muitos caminhos do runtime, incluindo filesystem e carregamento de módulos, e fala em mais de 164 pontos de interceptação. O desenho inclui provedores como `MemoryProvider`, `SEAProvider` e `VirtualProvider`.

E aí entra o pedaço que deixou a discussão quente: a PR declara uso significativo de Claude Code. O autor diz que revisou todas as mudanças. Mesmo assim, a comunidade levantou uma pergunta que vai aparecer em muitos projetos grandes: como revisar uma alteração enorme, assistida por IA, em uma peça de infraestrutura que muita gente usa para rodar software?

Fedor Indutny publicou uma petição contra aceitar pull requests gerados por LLM no core do Node.js. Isso não é política final do projeto. A PR também não foi aceita até agora. O valor público da história está em separar duas coisas que costumam grudar: a utilidade da feature e a responsabilidade pelo patch.

Um VFS no Node.js pode ser útil. Um patch grande demais para revisar com calma continua sendo um patch grande demais para revisar com calma, mesmo quando quem gerou parte dele foi uma ferramenta muito esperta. Para infraestrutura crítica, autoria assistida não remove dono humano. Só muda o tipo de prova que o dono precisa apresentar.

Fontes: [InfoQ](https://www.infoq.com/news/2026/05/node-js-file-system/), [PR #61478 no Node.js](https://github.com/nodejs/node/pull/61478), [Node.js Collaboration Summit](https://nodejs.org/fr/blog/events/collab-summit-2026-london) e [petição de Fedor Indutny](https://github.com/indutny/no-ai-in-nodejs-core).

## George Hotz provocou; Armin Ronacher trouxe higiene de issue

George Hotz publicou em 24 de maio um texto chamado "The Eternal Sloptember". É um texto de opinião, bem direto e bem Hotz: ele critica a adoção de agentes de programação como se fossem engenheiros, admite utilidade para busca melhorada e protótipos descartáveis, mas insiste que o problema é código quebrado de um jeito mais difícil de perceber.

Dá para discordar do tamanho da paulada. A parte útil é pegar a provocação e transformar em pergunta operacional: quem verifica a mudança, o diagnóstico e a descrição do problema?

No mesmo dia, Armin Ronacher publicou "Building Pi With Pi", que funciona como contraponto bem mais prático. Ele fala de issues quase inteiras geradas por máquina, muitas vezes confiantes e erradas, e recomenda uma separação simples: fatos observados de um lado, análise do modelo do outro. Em um bug report, o mantenedor precisa saber qual comando foi rodado, qual era o comportamento esperado, o que aconteceu de fato e qual log ou erro apareceu.

Isso parece básico porque é básico. Exatamente por isso machuca quando some.

Issue também virou prompt para agente. Se ela nasce confusa, inventada ou cheia de diagnóstico sem evidência, tanto o humano quanto a ferramenta começam a trabalhar em cima de chão falso. Aí o custo aparece como retrabalho, correção torta e conversa longa para descobrir que o primeiro parágrafo já estava errado.

Outra recomendação boa do Armin é preferir invariantes fortes. Em vez de ensinar o sistema a tolerar qualquer estado malformado que apareceu no caminho, corrija o fluxo para impedir que aquele estado exista. Isso conversa com backend, banco, parser, API e UI. Agente adora remendar sintomas com bastante convicção; mantenedor cansado também. A engenharia boa, quando dá, fecha a porta antes de contratar gente para enxugar a água.

Juntando Hotz, Armin, Harness e Node.js, o quadro fica menos histérico. Ferramenta de IA pode ajudar. Mas o trabalho nobre de 2026 parece cada vez mais com preservar fato, reduzir escopo, revisar pedaço por pedaço e deixar responsabilidade clara. Menos glamour, mais checklist. Ninguém coloca isso no anúncio com música épica, mas é o que impede o projeto de virar uma fábrica de plausibilidade.

Fontes: [George Hotz](https://geohot.github.io/blog/jekyll/update/2026/05/24/the-eternal-sloptember.html) e [Armin Ronacher](https://lucumr.pocoo.org/2026/5/24/pi-oss/).

## Destaques rápidos para hoje.

- O Google Threat Intelligence Group analisou serviços chineses de phishing como serviço e descreveu uma mudança importante: menos foco em formulário estático de senha, mais operação em tempo real para interceptar OTP e provisionar cartão roubado em carteira digital. RCS e iMessage aparecem como canais de entrega. A criptografia desses canais não é o alvo do alerta; mensagens familiares e canais criptografados podem dificultar filtro e aumentar confiança da vítima. A resposta boa passa por FIDO2, WebAuthn e controles fortes de provisionamento de carteira. Fonte: [Google Cloud Blog](https://cloud.google.com/blog/topics/threat-intelligence/chinese-language-phishing-services/).

- A Mandiant publicou detalhes da CVE-2026-5426 no KnowledgeDeliver, da Digital Knowledge. O ponto feio é velho conhecido: implantações antes de 24 de fevereiro de 2026 usavam uma `machineKey` ASP.NET compartilhada, o que permite forjar ViewState válido e chegar a execução remota de código sem autenticação, segundo a Mandiant. A lição serve para qualquer stack: segredo copiado em template de cliente funciona como vulnerabilidade com atraso. Fontes: [Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/knowledgedeliver-viewstate-deserialization-vulnerability/), [advisory MNDT-2026-0009](https://github.com/mandiant/Vulnerability-Disclosures/blob/master/2026/MNDT-2026-0009.md) e [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-5426).

- O PostgreSQL tem um ajuste pequeno que pode salvar CPU e I/O em consulta longa abandonada: `client_connection_check_interval`. Ele existe desde o PostgreSQL 14, fica desligado por padrão e faz o servidor checar, durante a execução, se o cliente ainda está vivo. Não é cura geral de performance; teste por workload, combine com `statement_timeout` e keepalives, e lembre que suporte depende da plataforma. Fontes: [The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-clientconnectioncheckinterval/) e [documentação do PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-connection.html).

- O `mod_wsgi` 6.0.0, ainda em trabalho de release candidate, começou a expor modos novos de concorrência do Python para deployments Apache. `WSGIPerInterpreterGIL` conversa com o GIL por sub-interpretador do Python 3.12, enquanto `WSGIFreeThreading` olha para builds sem GIL no caminho do Python 3.13. É infraestrutura opt-in, sensível a application group e extensão C; ótimo para acompanhar, perigoso para ligar sexta à tarde porque o nome parece moderno. Fontes: [Graham Dumpleton](https://grahamdumpleton.me/posts/2026/05/per-interpreter-gil-in-mod-wsgi-6-0-0/), [documentação do mod_wsgi](https://modwsgi.readthedocs.io/en/latest/configuration-directives/WSGIInterpreterOptions.html) e [PyPI](https://pypi.org/project/mod-wsgi/6.0.0.dev2/).

## Acompanhamento de tendências do dia.

O pedaço local da história aparece em `llama.cpp`. A PR #22929 foi mergeada em 25 de maio e melhora a criação de checkpoints de contexto ao redor das fronteiras de mensagens no chat. A motivação é bem concreta: sessões longas de agente local podem forçar reprocessamento completo do prompt quando o histórico muda, especialmente depois de saídas grandes de ferramenta.

A mudança extrai `message_spans`, cria um checkpoint antes da última entrada do usuário e tenta aumentar a responsividade em fluxos de programação assistida. Isso conversa com o que usuários estão relatando no Reddit sobre comportamento de KV cache e Qwen 3.6. Um relato fala em espera caindo de 5 a 30 segundos para algo quase imediato em um fluxo específico. Outro cita Qwen3.6-35B-A3B subindo de cerca de 17 para 34 tokens por segundo depois de mexer em `--n-cpu-moe`.

Esses números são interessantes, mas são relatos de usuário, não benchmark controlado. O conselho aqui é bem sem romance: antes e depois, mesma máquina, mesmo modelo, mesmo prompt, mesma configuração que você consegue repetir. Modelo local fica rápido ou lento por vários motivos, incluindo cache, reescrita de contexto, offload de MoE e UI mandando histórico de um jeito pouco amigável.

No fundo, isso fecha bem com o resto do dia. No dia 23, falamos de [Project Glasswing e Claude Mythos](/2026/glasswing-achou-bugs-demais-claude-code-lembrou-da-fatura/) pelo gargalo de triagem: descobrir muito não resolve sozinho se ninguém consegue validar, corrigir e priorizar. Hoje a mesma conta apareceu no pacote instalado, no review, na PR grande, na issue e até na sessão local que precisa reaproveitar contexto sem cozinhar a máquina.

Pode chamar de tendência, mas é mais uma lista de lugares onde o trabalho humano voltou pela porta lateral. A ferramenta gera, instala, propõe, lembra e acelera. A pessoa ainda precisa saber o que foi confiado a quê.

Fontes: [PR #22929 do llama.cpp](https://github.com/ggml-org/llama.cpp/pull/22929), [relato sobre KV cache no Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1tmw8x1/llamacpp_has_a_clever_trick_for_speeding_up_kv/), [relato sobre Qwen 3.6 e `--n-cpu-moe`](https://www.reddit.com/r/LocalLLaMA/comments/1tmwgen/could_someone_please_help_explain_these_results/), [Risky Business News](https://news.risky.biz/risky-bulletin-mythos-found-thousands-of-critical-bugs/) e [Project Glasswing](https://www.anthropic.com/project/glasswing).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-25
generated_at: 2026-05-25T05:39:00-03:00
source_urls:
  - https://socket.dev/blog/trapdoor-crypto-stealer-npm-pypi-crates
  - https://thehackernews.com/2026/05/trapdoor-supply-chain-attack-spreads.html
  - https://www.harness.io/press-and-news/ai-has-outpaced-how-engineering-organizations-measure-developer-productivity
  - https://www.tabnews.com.br/danieldia/o-custo-invisivel-da-ia-no-desenvolvimento-de-software
  - https://www.infoq.com/news/2026/05/node-js-file-system/
  - https://github.com/nodejs/node/pull/61478
  - https://nodejs.org/fr/blog/events/collab-summit-2026-london
  - https://github.com/indutny/no-ai-in-nodejs-core
  - https://geohot.github.io/blog/jekyll/update/2026/05/24/the-eternal-sloptember.html
  - https://lucumr.pocoo.org/2026/5/24/pi-oss/
  - https://cloud.google.com/blog/topics/threat-intelligence/chinese-language-phishing-services/
  - https://cloud.google.com/blog/topics/threat-intelligence/knowledgedeliver-viewstate-deserialization-vulnerability/
  - https://github.com/mandiant/Vulnerability-Disclosures/blob/master/2026/MNDT-2026-0009.md
  - https://nvd.nist.gov/vuln/detail/CVE-2026-5426
  - https://thebuild.com/blog/all-your-gucs-in-a-row-clientconnectioncheckinterval/
  - https://www.postgresql.org/docs/current/runtime-config-connection.html
  - https://grahamdumpleton.me/posts/2026/05/per-interpreter-gil-in-mod-wsgi-6-0-0/
  - https://modwsgi.readthedocs.io/en/latest/configuration-directives/WSGIInterpreterOptions.html
  - https://pypi.org/project/mod-wsgi/6.0.0.dev2/
  - https://github.com/ggml-org/llama.cpp/pull/22929
  - https://www.reddit.com/r/LocalLLaMA/comments/1tmw8x1/llamacpp_has_a_clever_trick_for_speeding_up_kv/
  - https://www.reddit.com/r/LocalLLaMA/comments/1tmwgen/could_someone_please_help_explain_these_results/
  - https://news.risky.biz/risky-bulletin-mythos-found-thousands-of-critical-bugs/
  - https://www.anthropic.com/project/glasswing
omitted_briefing_items:
  - macOS SHub Reaper infostealer: underlying reporting was from May 18-19; stale for today's security lead.
  - Anthropic Mythos / Project Glasswing: used only as continuity because it already led the May 23 Paper LLM post.
  - Megalodon GitHub Actions follow-up: linked as continuity; central incident already covered in two recent Paper LLM posts.
  - Go-horse AI cost discipline: useful theme, but specific corporate claims were not validated.
  - Sponsio deterministic contract layer: interesting agent-safety idea, but source validation was not strong enough for public coverage.
  - Constraint Decay backend-agent paper: confirmed but older May 7 research; folded into the invariants/review theme without a separate block.
  - Migrating from Go to Rust: evergreen and weaker than today's verified news.
  - Akvorado BGP sharding: strong niche systems deep dive, omitted for focus.
  - Snowflake Postgres correction: useful, but the PostgreSQL operational setting was more actionable today.
  - Jira is Turing-complete: fun item, omitted to avoid distracting from the verification/security spine.
  - Arch varnish/vinyl-cache rename: real packaging note, narrow for this edition.
  - WorkOS auth.md: not primary-source validated in this pass.
  - Linux 7.1-rc5 AI fixes: optional background only; not source-chain validated against the primary release discussion.
  - Ghost CMS ClickFix campaign: potentially strong, but not source-chain validated before drafting and the security lane already had verified material.
-->
