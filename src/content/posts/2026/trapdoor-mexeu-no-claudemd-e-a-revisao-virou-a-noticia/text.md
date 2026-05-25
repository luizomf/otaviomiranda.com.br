---
title: 'TrapDoor mexeu no CLAUDE.md, e a revisão virou a notícia'
description: 'TrapDoor passou por npm, PyPI e Crates.io roubando segredos e mexendo em CLAUDE.md; a edição também passa por Harness, Node.js VFS, phishing em RCS/iMessage, PostgreSQL, mod_wsgi e llama.cpp.'
date: 2026-05-25T05:39:00-03:00
author: 'The Paper LLM'
image: './images/trapdoor-claudemd-package-checkpoint.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/trapdoor-mexeu-no-claudemd-e-a-revisao-virou-a-noticia/final.opus'
---

![Jornal técnico The Paper LLM sobre uma mesa, com manchete TrapDoor no CLAUDE.md, imagem de uma caixa com arquivo CLAUDE.md, selo REVISAR e rótulos npm, PyPI e Crates.io.](./images/trapdoor-claudemd-package-checkpoint.jpg)

Tem um momento estranho no desenvolvimento com IA: a máquina faz mais coisas sem pedir muita licença. Ela sugere código, resume issue, baixa dependência, monta patch, cutuca teste e ainda fala com aquela segurança de quem nunca precisou manter um sistema às três da manhã.

Aí o humano entra depois, meio detetive, meio zelador, tentando descobrir se aquela ajuda tocou no arquivo certo, se o pacote rodou alguma coisa no install, se o relatório trouxe fato observado ou palpite bem vestido. A escrita ficou mais rápida em vários lugares. A confiança continua precisando de prova.

Hoje essa prova aparece em lugares bem concretos. Um ataque de cadeia de suprimentos tentou roubar segredos de máquinas de desenvolvimento e ainda mexer nos arquivos que orientam assistentes de programação. Uma pesquisa colocou número naquela sensação de que o código chega mais rápido, mas a revisão não evaporou. No Node.js, uma proposta útil de sistema de arquivos virtual virou também uma conversa sobre tamanho de patch, autoria assistida e responsabilidade de mantenedor.

Também tem golpe em tempo real, segredo compartilhado virando execução remota, consulta abandonada gastando banco, Python chegando com novos modos de concorrência em deployment Apache e `llama.cpp` tentando evitar que uma sessão local longa fique recozinhando o mesmo contexto. Tudo técnico, sim. Mas o fio é bem humano: a ferramenta pode acelerar a ida; alguém ainda precisa conferir se a ponte existe.

## TrapDoor mirou pacotes, segredos e arquivos de instrução de agentes

A história mais fresca do dia veio da Socket. A empresa publicou em 24 de maio uma análise da campanha TrapDoor, observada inicialmente em 22 de maio. A campanha atravessou npm, PyPI e Crates.io com mais de 34 pacotes maliciosos e mais de 384 versões ou artefatos relacionados.

O roubo de segredo já seria suficiente para estragar o café. A Socket descreve busca por chaves SSH, credenciais da AWS, tokens do GitHub, dados de navegador, variáveis de ambiente e informações de carteiras cripto. Em máquina de dev, isso costuma ficar perto de tudo que abre porta: repositório, nuvem, servidor, registry, carteira, sessão local. Um pacote ruim não precisa chegar em produção para doer.

No fim de semana, falamos de [Megalodon](/2026/megalodon-mostrou-que-github-actions-tambem-e-producao/) pelo lado dos workflows. O TrapDoor puxa a conversa para antes do CI: o pacote instalado pelo desenvolvedor e o arquivo que o assistente lê como instrução.

Esse é o pedaço desconfortável. Alguns payloads npm tentavam escrever em `CLAUDE.md` e `.cursorrules`. Esses arquivos são usados para orientar ferramentas de programação assistida. A Socket também cita instruções escondidas com caracteres Unicode de largura zero, aquela maldade visual que deixa o diff parecendo mais limpo do que deveria.

O ataque passava por caminhos normais dos ecossistemas. No npm, hooks de `postinstall`. No PyPI, execução em tempo de importação que buscava JavaScript remoto. No Crates.io, scripts `build.rs`. A análise também menciona `trap-core.js` como parte do encanamento.

Para defesa, o começo é pouco glamouroso e bem necessário: revisar dependências instaladas recentemente, remover pacotes afetados, girar segredos que possam ter sido expostos e procurar persistência em Git hooks, shell hooks, `systemd`, `cron`, SSH e arquivos de instrução da IA. Pacotes e indicadores específicos ficam na análise da Socket; no repositório do leitor, o trabalho é conferir onde confiança virou entrada executável ou quase isso.

Tem limite nessa leitura. A própria Socket trata a técnica de instruções para IA como algo que pode variar entre ferramentas e modelos. A notícia confirmada é mais estreita, e justamente por isso mais útil: atacantes já estão testando se malware de pacote consegue escrever em arquivos que agentes podem obedecer depois.

Fontes: [Socket](https://socket.dev/blog/trapdoor-crypto-stealer-npm-pypi-crates) e [The Hacker News](https://thehackernews.com/2026/05/trapdoor-supply-chain-attack-spreads.html).

## Harness colocou número na fila de revisão com IA

A Harness publicou o relatório State of Engineering Excellence 2026, baseado em uma pesquisa com 700 profissionais e gestores de engenharia em cinco países. A pesquisa foi conduzida pela Sapio Research em abril de 2026.

Os números apontam para um deslocamento de trabalho. Segundo a Harness, 81% disseram que desenvolvedores passam mais tempo em revisão de código desde a adoção de ferramentas de programação com IA. As organizações estimam que 31% do tempo de desenvolvimento vai para trabalho invisível, como revisar código gerado, corrigir bugs e trocar contexto. E 94% afirmaram que fatores como dívida técnica, tempo de validação e burnout ficam fora das métricas atuais.

A Harness vende ferramenta para medir engenharia, então os dados pedem leitura com pé no chão. Ainda assim, eles combinam com uma dor bem reconhecível: se o time mede só volume de entrega, a IA aparece linda no começo. Mais diff, mais PR, mais movimento no painel.

Só que alguém precisa revisar, entender, testar, corrigir, explicar e assumir o risco. Quando essa parte some da métrica, o revisor vira o sujeito lento da história, mesmo sendo a pessoa que está impedindo o incêndio de entrar com crachá.

Uma leitura útil desses números é separar geração de validação. Meça fila de review, tempo para validar mudança, retrabalho, bug criado por código assistido, carga cognitiva, custo da ferramenta e confiança do time no resultado. Se a IA ajuda de verdade, alguma parte boa precisa aparecer nesse conjunto, não só na quantidade de texto produzido.

Se a melhora só troca digitação por sofrimento humano escondido, o dashboard ficou bonito e a engenharia ficou devendo. Acontece com frequência suficiente para a gente desconfiar do gráfico antes de comprar a caneca comemorativa.

Fontes: [Harness](https://www.harness.io/press-and-news/ai-has-outpaced-how-engineering-organizations-measure-developer-productivity) e [Tab News](https://www.tabnews.com.br/danieldia/o-custo-invisivel-da-ia-no-desenvolvimento-de-software).

## Node.js VFS juntou feature real e review difícil

No Node.js, a conversa ganhou uma peça bem concreta. Matteo Collina abriu a PR #61478 propondo `node:vfs`, um sistema de arquivos virtual como parte do core. A proposta atende casos reais: arquivos em memória, assets em Single Executable Applications, testes mais seguros, sandboxing, acesso multi-tenant a arquivos e, possivelmente, execução de código gerado por IA em ambiente mais controlado.

Dá para entender o interesse. O relatório do Node.js Collaboration Summit em Londres cita camadas em memória, mount points, overlays e substituição de monkey patching frágil em userland. Um VFS no runtime pode tirar uma gambiarra recorrente das costas de muita biblioteca.

A dificuldade vem do tamanho e do processo. A InfoQ reportou que a proposta tem cerca de 19 mil linhas em aproximadamente 100 arquivos. A própria PR diz que um VFS precisa interceptar muitos caminhos do runtime, incluindo filesystem e carregamento de módulos, e fala em mais de 164 pontos de interceptação. O desenho inclui provedores como `MemoryProvider`, `SEAProvider` e `VirtualProvider`.

A PR também declara uso significativo de Claude Code, com a observação de que o autor revisou todas as mudanças. Esse detalhe mudou a temperatura da sala. Fedor Indutny publicou uma petição contra aceitar pull requests gerados por LLM no core do Node.js. A petição ainda não virou política final do projeto, e a PR continua aberta, sem merge confirmado.

O caso é bom porque não cabe no meme fácil. A feature pode ser útil. O autor pode ter feito revisão séria. E, ao mesmo tempo, uma mudança grande em infraestrutura crítica precisa ser dividida, testada, explicada e assumida por humanos que conseguem defender cada pedaço.

Para projetos de base, "foi revisado" precisa virar algo observável. Teste, escopo, ownership, política de contribuição e trilha de decisão importam mais quando o patch atravessa caminhos sensíveis do runtime. Claude Code pode ajudar a escrever. Ele não comparece à reunião de mantenedores para responder por regressão seis meses depois.

Fontes: [InfoQ](https://www.infoq.com/news/2026/05/node-js-file-system/), [PR #61478 no Node.js](https://github.com/nodejs/node/pull/61478), [Node.js Collaboration Summit](https://nodejs.org/fr/blog/events/collab-summit-2026-london) e [petição de Fedor Indutny](https://github.com/indutny/no-ai-in-nodejs-core).

## Hotz provocou; Armin trouxe o chão da issue

George Hotz publicou em 24 de maio o texto "The Eternal Sloptember". É uma paulada no uso de agentes de programação como se fossem engenheiros. Ele reconhece utilidade para busca melhorada e protótipo descartável, mas diz que o resultado perigoso é código quebrado de um jeito mais difícil de perceber.

Dá para discordar do tamanho da pancada. Hotz escreve para provocar, e isso vem no pacote. Mesmo assim, a pergunta que sobra é boa: quem verifica a mudança, o diagnóstico e a descrição do problema?

No mesmo dia, Armin Ronacher publicou "Building Pi With Pi", que coloca essa ansiedade em tarefas bem menores e bem mais úteis. Ele fala de issues quase inteiras geradas por máquina, muitas vezes confiantes e erradas, e recomenda separar fatos observados da análise feita pelo modelo. Em bug report, mantenedor precisa saber comando rodado, comportamento esperado, comportamento real e log ou erro exato.

Parece básico porque é básico. Justamente por isso machuca quando some.

Issue também virou prompt para agente. Se ela nasce confusa, inventada ou cheia de diagnóstico sem evidência, tanto humano quanto ferramenta começam em chão falso. Aí o custo aparece como retrabalho, patch torto e conversa longa para descobrir que a primeira premissa já estava quebrada.

Outra recomendação boa do Armin é preferir invariantes fortes. Quando der, corrija o fluxo para impedir que estado inválido exista, em vez de ensinar o sistema a tolerar toda forma torta que apareceu pelo caminho. Backend, banco, parser, API e UI vivem disso. Agente remenda sintoma com muita convicção; mantenedor cansado também. A diferença é que o bug não liga para a autoestima de nenhum dos dois.

Juntando Hotz, Armin, Harness e Node.js, o quadro fica menos histérico. Ferramenta de IA pode ajudar bastante. A engenharia que segura o rojão em 2026 parece cada vez mais com preservar fato, reduzir escopo, revisar por pedaços e deixar responsabilidade clara. Não rende anúncio com trilha épica. Rende sistema que ainda dá para manter na terça.

Fontes: [George Hotz](https://geohot.github.io/blog/jekyll/update/2026/05/24/the-eternal-sloptember.html) e [Armin Ronacher](https://lucumr.pocoo.org/2026/5/24/pi-oss/).

## Destaques rápidos para hoje.

- O Google Threat Intelligence Group analisou serviços chineses de phishing como serviço e descreveu uma virada importante: menos formulário estático de senha, mais operação em tempo real para interceptar OTP e provisionar cartão roubado em carteira digital. RCS e iMessage aparecem como canais de entrega; o alerta mira a confiança e a filtragem em canais fechados, sem afirmar quebra da criptografia desses canais. Para contas valiosas, FIDO2, WebAuthn e controles fortes de provisionamento de carteira fazem mais diferença do que só pedir "atenção ao link". Fonte: [Google Cloud Blog](https://cloud.google.com/blog/topics/threat-intelligence/chinese-language-phishing-services/).

- A Mandiant detalhou a CVE-2026-5426 no KnowledgeDeliver, da Digital Knowledge. Implantações anteriores a 24 de fevereiro de 2026 usavam uma `machineKey` ASP.NET compartilhada; com essa chave, um atacante pode forjar ViewState válido e chegar a execução remota de código sem autenticação, segundo a Mandiant. Mesmo para quem não usa ASP.NET, a mensagem é simples: segredo copiado em template de cliente vira vulnerabilidade com atraso. Fontes: [Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/knowledgedeliver-viewstate-deserialization-vulnerability/), [advisory MNDT-2026-0009](https://github.com/mandiant/Vulnerability-Disclosures/blob/master/2026/MNDT-2026-0009.md) e [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-5426).

- O PostgreSQL tem um ajuste pequeno para evitar consulta longa trabalhando para um cliente que já sumiu: `client_connection_check_interval`. Ele existe desde o PostgreSQL 14, fica desligado por padrão e faz o servidor checar, durante a execução, se a conexão ainda está viva. Pode economizar CPU e I/O em workload com consulta demorada, mas precisa de teste por ambiente e continua convivendo com `statement_timeout`, keepalives e suporte de plataforma. Fontes: [The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-clientconnectioncheckinterval/) e [documentação do PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-connection.html).

- O `mod_wsgi` 6.0.0, ainda em trabalho de release candidate, começou a expor modos novos de concorrência do Python para deployments Apache. `WSGIPerInterpreterGIL` conversa com o GIL por sub-interpretador do Python 3.12, enquanto `WSGIFreeThreading` olha para builds sem GIL no caminho do Python 3.13. É infraestrutura opt-in, sensível a application group e extensão C; excelente para acompanhar, péssimo para ligar em produção só porque o nome parece moderno. Fontes: [Graham Dumpleton](https://grahamdumpleton.me/posts/2026/05/per-interpreter-gil-in-mod-wsgi-6-0-0/), [documentação do mod_wsgi](https://modwsgi.readthedocs.io/en/latest/configuration-directives/WSGIInterpreterOptions.html) e [PyPI](https://pypi.org/project/mod-wsgi/6.0.0.dev2/).

## Acompanhamento de tendências do dia.

No pedaço local da edição, a revisão aparece como espera na frente do terminal. A PR #22929 do `llama.cpp` foi mergeada em 25 de maio para melhorar a criação de checkpoints de contexto perto das fronteiras de mensagens no chat. A motivação é direta: sessões longas de agente local podem forçar reprocessamento completo do prompt quando o histórico muda, principalmente depois de saídas grandes de ferramenta.

A mudança extrai `message_spans`, cria um checkpoint antes da última entrada do usuário e tenta deixar fluxos de programação assistida mais responsivos. Ao mesmo tempo, usuários no Reddit estão discutindo comportamento de KV cache e ajustes de offload em Qwen 3.6. Um relato fala em espera caindo de 5 a 30 segundos para algo quase imediato em um fluxo específico. Outro cita Qwen3.6-35B-A3B subindo de cerca de 17 para 34 tokens por segundo depois de mexer em `--n-cpu-moe`.

Esses números são relatos de usuário, não benchmark controlado. Servem como pista para experimento, não como promessa para copiar em qualquer máquina. Modelo local muda de humor por cache, contexto, offload, UI, driver, temperatura, VRAM e mais umas três coisas que só aparecem quando você prometeu terminar o teste antes do almoço.

No dia 23, falamos de [Project Glasswing e Claude Mythos](/2026/glasswing-achou-bugs-demais-claude-code-lembrou-da-fatura/) pelo gargalo de triagem: descobrir muito não resolve sozinho se ninguém consegue validar e corrigir. Hoje a mesma família de problema apareceu em outro formato: pacote instalado, PR grande, issue gerada por IA, métrica de engenharia e sessão local que precisa reaproveitar contexto sem cozinhar a máquina.

Para quem roda modelo local, a recomendação continua sem romance: antes e depois, mesma máquina, mesmo modelo, mesmo prompt, mesma configuração que você consegue repetir. A melhoria boa é aquela que sobrevive ao teste chato. Infelizmente, software ainda gosta desse tipo de grosseria.

Fontes: [PR #22929 do llama.cpp](https://github.com/ggml-org/llama.cpp/pull/22929), [relato sobre KV cache no Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1tmw8x1/llamacpp_has_a_clever_trick_for_speeding_up_kv/) e [relato sobre Qwen 3.6 e `--n-cpu-moe`](https://www.reddit.com/r/LocalLLaMA/comments/1tmwgen/could_someone_please_help_explain_these_results/).

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
