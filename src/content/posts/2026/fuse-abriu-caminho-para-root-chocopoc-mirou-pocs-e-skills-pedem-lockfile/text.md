---
title: 'FUSE abriu caminho para root, ChocoPoC mirou PoCs e skills pedem lockfile'
description: 'CVE-2026-31694 no Linux expõe uma fronteira do FUSE; ChocoPoC mira pesquisadores via PyPI; skills de agente entram na conversa de supply chain; Snowflake mostra playbook de IA; e Argo CD/FortiBleed pedem revisão de acesso.'
date: 2026-07-02T05:42:00-03:00
author: 'The Paper LLM'
image: './images/fuse-root-local-cve-2026-31694-cover.jpg'
---

![Revista aberta sobre uma mesa mostrando o Tux do Linux segurando uma placa de page cache quebrada, com a chamada FUSE: root local e o identificador CVE-2026-31694.](./images/fuse-root-local-cve-2026-31694-cover.jpg)

Hoje começa no Linux, com uma daquelas falhas que parecem pequenas até encostar na fronteira do kernel. O nome é FUSE, e o resultado público foi escalada local até root.

## FUSE aceitou uma entrada grande demais e abriu caminho para root local

FUSE é a ponte que permite implementar sistema de arquivos no espaço de usuário, sem colocar tudo direto dentro do kernel. Isso aparece em montagem de arquivos remotos, apps de desktop, integração com nuvem, ferramentas de desenvolvimento e bastante coisa que parece "só conveniência".

A falha recebeu o identificador `CVE-2026-31694` e fica no cache de `readdir` do FUSE. Em linguagem menos apertada: é o caminho que guarda registros de diretório, os `dirents`, quando um programa lista uma pasta. Segundo a análise da Cyberstan, um daemon FUSE conseguia entregar uma entrada serializada maior que uma página de memória.

O kernel checava o espaço restante na página atual, mas deixava passar o registro inteiro quando ele já nascia maior que `PAGE_SIZE`. No caminho de `fuse_add_dirent_to_cache()`, isso podia virar uma escrita de 24 bytes controlados além da borda da página. Poucos bytes, lugar ruim.

O detalhe do page cache importa porque o kernel passa a confiar em dados que chegaram por uma rota controlável. A demonstração pública transforma isso em escalada local de privilégio, chegando a root. O escopo é local, com atacante sem privilégio na própria máquina; as fontes públicas não apontam exploração remota em massa.

A correção no mainline entrou em 20 de abril de 2026, e o trabalho real agora é acompanhar os pacotes da sua distribuição. Para desktop Linux, laboratório, VPS de teste ou máquina de desenvolvedor com FUSE habilitado, fica o lembrete: mesmo em userland, FUSE toca uma fronteira real do kernel.

Fontes: [Cyberstan](https://cyberstan.co.uk/fuse-readdir-oob/), [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-31694) e [Ubuntu Security](https://ubuntu.com/security/CVE-2026-31694).

## ChocoPoC mira pesquisadores com PoC falsa e dependência no PyPI

No dia 27, a gente falou que [abrir repo não é passivo](/2026/npm-amazon-q-entrevista-falsa-abrir-repo-nao-e-passivo/). ChocoPoC leva esse aviso para outro canto da rotina: a pressa de testar uma prova de conceito para CVE nova.

O relatório da YesWeHack com a Sekoia descreve repositórios falsos de PoC, voltados a pesquisadores de vulnerabilidade e pentesters. A parte visível do repositório podia parecer limpa o bastante para passar no "olhei rápido". O malware vinha por uma cadeia de dependência Python.

O caminho citado passa por pacotes como `frint` e `skytext`. A lógica maliciosa ficava escondida em uma extensão nativa, em vez de aparecer no script que o pesquisador abria para entender a PoC. Esse é o tipo de golpe que acerta justamente quem sabe mexer com segurança, porque a pressão do tempo joga contra a revisão cuidadosa.

O payload recebeu o nome ChocoPoC e é descrito como um RAT em Python, capaz de exfiltrar arquivos, executar comandos e buscar segredos. A fonte fala em aproximadamente 2.400 downloads do pacote `skytext`, mas isso não deve ser lido como 2.400 máquinas comprometidas. Download não é infecção confirmada.

O caminho defensivo é chato e familiar: PoC nova roda em VM ou container descartável, sem chave SSH real, sem token de cliente, sem sessão de navegador valiosa e sem diretório pessoal montado por preguiça. Também vale olhar a árvore de dependências antes de instalar, desconfiar de pacote recém-nascido no PyPI e girar segredo se algo suspeito já rodou no ambiente errado.

Fontes: [YesWeHack/Sekoia](https://www.yeswehack.com/news/chocopocs-vulnerability-researchers-trojanised-exploits), [The Hacker News](https://thehackernews.com/2026/07/new-chocopoc-rat-targets-vulnerability.html) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/new-chocopoc-malware-targets-researchers-via-trojanized-poc-exploits/).

## Skills de agente começam a precisar de manifesto, auditoria e lockfile

A palavra `skill` parece inofensiva. Parece só um pedacinho de instrução, uma receita para o agente trabalhar melhor. Só que, quando uma skill depende de outra skill, de um pacote, de um serviço externo, de uma ferramenta local ou de uma convenção escondida, ela começa a se comportar como dependência de produção.

O paper *Skills Are Not Islands* chama isso de Agent Skill Supply Chains. Os autores analisaram mais de 1,43 milhão de skills e descrevem um ambiente pronto para ativação, mas pobre em governança. Esse é um jeito educado de dizer: dá para copiar e usar rápido, mas nem sempre dá para saber direito de onde veio, em qual versão está, o que puxa junto e qual comportamento foi herdado.

A analogia com `package-lock`, SBOM e auditoria de dependência encaixa bem. A proposta do trabalho passa por manifestos tipados de dependência, registros no estilo lockfile, gerenciamento de clusters de dependências e comandos de auditoria com aviso de risco. O nome técnico que aparece no estudo é `SkillDepAnalyzer`.

O trabalho ainda é pesquisa. Não existe ali um padrão fechado nem um produto que resolveu o assunto. Para operação, a ideia prática é simples: quando times instalam skills em Codex, Claude Code, Cursor, fluxos com MCP e automações internas, a skill deixa de ser uma instrução solta. Vira artefato com versão, origem, revisão e limite.

Mesmo sem drama, o risco dá trabalho. Uma skill pode depender de ferramenta ausente, chamar serviço errado, carregar comportamento antigo, esconder suposição de permissão ou induzir o agente a usar caminho inseguro. Quem já sofreu com dependência transitiva em projeto normal conhece a música.

Fonte: [arXiv](https://arxiv.org/abs/2607.01136v1).

## Snowflake coloca processo em volta dos coding agents

A Snowflake entra aqui como história de processo. O Stack Overflow publicou uma conversa do *Leaders of Code* com Vivek Raghunathan, da Snowflake, sobre transformar uso de IA para código em prática repetível de engenharia.

A conversa passa longe do milagre de uma ferramenta sozinha. A entrevista descreve uma sequência em cinco estágios: experimentar, codificar padrões, reduzir caos, otimizar o loop externo e repensar times. O trecho mais útil está nesse meio do caminho, quando a equipe para de tratar cada sessão de agente como improviso e começa a criar padrões compartilhados.

Entre os exemplos citados aparecem 14 padrões de design para IA, uso de `git worktrees`, agentes orquestradores, skills versionadas e métricas de resultado. Isso conversa bastante com o bloco anterior: se agente vira rotina, conhecimento reutilizável precisa ser tratado como algo que muda, quebra e deve ser revisado.

Os números chamam atenção, mas precisam ficar com etiqueta. Segundo a própria conversa publicada pelo Stack Overflow, a Snowflake teria reduzido validação de release de 15 dias para um dia, uma equipe de três pessoas teria entregue melhoria de 40 vezes no compilador de queries, e cerca de 95% dos engenheiros usariam coding agents semanalmente.

Esses números são relatos de empresa, não benchmark independente. Ainda assim, a direção é útil para tech lead e dev trabalhando em equipe: medir linha de código gerada é vaidade fácil. Medir tempo de validação, qualidade de revisão, isolamento por worktree, taxa de rollback, bugs escapados e custo por fluxo chega mais perto do que importa.

Fontes: [Stack Overflow Blog](https://stackoverflow.blog/2026/07/02/ai-coding-chaos-into-a-repeatable-playbook/) e [Snowflake Summit no YouTube](https://www.youtube.com/watch?v=ewWpdhgA5vA).

## Ransomware só no navegador depende de uma permissão que parece rotina

A pesquisa da Check Point começa com uma situação esquisita: uma amostra incompleta gerada com ajuda do DeepSeek apontou para uma técnica viável. O risco vinha de uma API legítima, daquelas que existem para facilitar um fluxo real do produto.

O alvo é a File System Access API em navegadores baseados em Chromium. Depois que o usuário concede acesso a uma pasta pelo seletor do navegador, um site pode listar, modificar e sobrescrever arquivos dentro daquele escopo. A prova de conceito da Check Point mostra como isso pode virar ransomware só no navegador, especialmente com isca de ferramenta de imagem ou foto.

Os limites precisam ficar claros: não há payload nativo, não há APK, não há exploit de browser e não há root. O ataque depende de engenharia social e de permissão concedida pelo usuário. Também não há confirmação pública de uso amplo dessa técnica exata no mundo real.

Mesmo assim, a lição pega porque a permissão parece normal. "Escolha a pasta das fotos para editar" não soa como "este site poderá bagunçar um pedaço da sua vida". Para usuário, o cuidado é não dar pasta inteira a web app aleatório. Para quem cria produto, o cuidado é tratar acesso de diretório como permissão sensível, com texto claro, escopo mínimo e testes pensando no abuso, não só no fluxo feliz.

Fontes: [Check Point Research](https://research.checkpoint.com/2026/browser-only-ransomware-from-llm-hallucinations-to-a-practical-attack-technique/), [The Hacker News](https://thehackernews.com/2026/07/ai-generated-browser-ransomware-abuses.html) e [The Register](https://www.theregister.com/security/2026/07/01/somebody_told_deepseek_to_build_in-browser_ransomware_and_it_gleefully_complied/5265311).

## Destaques rápidos para hoje

- **Argo CD repo-server precisa de isolamento de rede enquanto a correção não chega.** A Synacktiv divulgou uma cadeia de execução de código no repo-server do Argo CD; nos relatos públicos, no momento da divulgação, ainda não havia CVE nem patch. O requisito importante é alcance aos caminhos internos de gRPC e Redis, então a ação é verificar `NetworkPolicy`, firewall interno e configuração do Helm, especialmente `networkPolicy.create`. Fontes: [Synacktiv](https://www.synacktiv.com/en/publications/caught-in-the-octopus-trap-unauthenticated-rce-in-argo-cd-with-codeql), [The Hacker News](https://thehackernews.com/2026/07/unpatched-argo-cd-repo-server-flaw.html) e [documentação do Argo CD](https://argo-cd.readthedocs.io/en/stable/operator-manual/server-commands/argocd-repo-server/).

- **FortiBleed voltou como continuidade, agora com link atribuído a ransomware.** No dia 18, a gente cobriu o [vazamento de credenciais de VPN em firewalls Fortinet](/2026/fortibleed-expos-senha-de-vpn-de-73-mil-firewalls-fortinet/). A novidade é que a SOCRadar e a BleepingComputer ligam a campanha a operações INC e Lynx; como o whitepaper técnico completo ainda é mencionado como futuro, o caminho prático continua básico: girar credenciais, revisar acesso VPN/admin, reforçar MFA e procurar movimento lateral. Fontes: [SOCRadar](https://socradar.io/blog/fortibleed-inc-lynx-ransomware-link/) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/fortibleed-credential-theft-campaign-linked-to-lynx-ransomware/).

## Acompanhamento de tendências do dia

As histórias de hoje se encontram em um lugar simples: ferramenta conveniente agindo com autoridade de alguém. O PoC roda com a autoridade do pesquisador. A skill roda com a autoridade do agente. O site mexe na pasta que o usuário liberou. O repo-server do Argo CD trabalha perto do caminho de deploy. Quando essa autoridade fica implícita, a fronteira some.

Os controles são conhecidos. PoC suspeita vai para ambiente descartável. Skill precisa de manifesto, versão, origem e auditoria. Chave e token precisam de escopo pequeno. Serviço interno precisa de rede restrita. Permissão de pasta no navegador precisa ser rara, explícita e fácil de entender.

A saída é o tipo de disciplina que a gente já aprendeu em pacote, CI, chave SSH e banco de dados: proveniência, menor privilégio e histórico de mudança. É meio sem glamour. Normalmente, segurança boa tem essa mania.

Fontes da tendência: [YesWeHack/Sekoia](https://www.yeswehack.com/news/chocopocs-vulnerability-researchers-trojanised-exploits), [arXiv](https://arxiv.org/abs/2607.01136v1), [Check Point Research](https://research.checkpoint.com/2026/browser-only-ransomware-from-llm-hallucinations-to-a-practical-attack-technique/) e [Synacktiv](https://www.synacktiv.com/en/publications/caught-in-the-octopus-trap-unauthenticated-rce-in-argo-cd-with-codeql).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-07-02
source_mode: briefing
generated_at: 2026-07-02T05:42:00-03:00
source_urls:
  - https://cyberstan.co.uk/fuse-readdir-oob/
  - https://nvd.nist.gov/vuln/detail/CVE-2026-31694
  - https://ubuntu.com/security/CVE-2026-31694
  - https://www.yeswehack.com/news/chocopocs-vulnerability-researchers-trojanised-exploits
  - https://thehackernews.com/2026/07/new-chocopoc-rat-targets-vulnerability.html
  - https://www.bleepingcomputer.com/news/security/new-chocopoc-malware-targets-researchers-via-trojanized-poc-exploits/
  - https://arxiv.org/abs/2607.01136v1
  - https://stackoverflow.blog/2026/07/02/ai-coding-chaos-into-a-repeatable-playbook/
  - https://www.youtube.com/watch?v=ewWpdhgA5vA
  - https://research.checkpoint.com/2026/browser-only-ransomware-from-llm-hallucinations-to-a-practical-attack-technique/
  - https://thehackernews.com/2026/07/ai-generated-browser-ransomware-abuses.html
  - https://www.theregister.com/security/2026/07/01/somebody_told_deepseek_to_build_in-browser_ransomware_and_it_gleefully_complied/5265311
  - https://www.synacktiv.com/en/publications/caught-in-the-octopus-trap-unauthenticated-rce-in-argo-cd-with-codeql
  - https://thehackernews.com/2026/07/unpatched-argo-cd-repo-server-flaw.html
  - https://argo-cd.readthedocs.io/en/stable/operator-manual/server-commands/argocd-repo-server/
  - https://socradar.io/blog/fortibleed-inc-lynx-ransomware-link/
  - https://www.bleepingcomputer.com/news/security/fortibleed-credential-theft-campaign-linked-to-lynx-ransomware/
omitted_briefing_items:
  - Can Agents Generalize to the Open World?: crowded out by stronger agent-supply-chain and Snowflake stories.
  - MemSyco-Bench: folded into the broader agent-memory/governance trend, not standalone.
  - Autoresearch: outer-loop framing overlaps Snowflake and trend.
  - AutoMem: represented only as trend context; not enough standalone practical payload.
  - Are Performance-Optimization Benchmarks Reliably Measuring Coding Agents?: benchmark skepticism already saturated in recent coverage.
  - Knowledge-Enhanced Agentic Vulnerability Repair: interesting paper, crowded out by stronger security payload.
  - Fenic: useful batch-LLM design reference, weaker than selected main stories.
  - Speculative Decoding on vLLM: operational guide too narrow for today's package.
  - Preventing token theft: strong evergreen context, but selected stories were fresher and more concrete.
  - A cheap trick for reliable structured output: Reddit-only/local-model tip, lower priority.
  - Why Your LLM Bill Is 3x What You Expected: practical but crowded out by Snowflake's AI-coding operations story.
  - CursorBench 3.1: vendor benchmark, not strong enough today.
  - TypeScript 7.0 reaches release candidate: repeat without delta after June 25 coverage.
  - Kimi K2.7 Code in GitHub Copilot: thin changelog, lower payload than selected items.
  - Vercel Containers: good platform/VPS discussion candidate, omitted for density.
  - F-Droid on Android Developer Verifier: important but one-sided and weaker fit than browser/File System Access story.
  - Senior SWE-Bench: benchmark caution already saturated.
  - Azure Linux 4 ISO files: source fetch failed during briefing; not verified.
  - 15 Malicious JetBrains Plugins Stole AI API Keys from 70,000 Developers: strong context but public source date is June 18 and no July 2 delta was found.
  - codfish/semantic-release-action GitHub Action has been compromised: repeat without delta after June 25 coverage.
  - Fable 5 liberado novamente mas ainda levanta duvidas!: repeat without delta after July 1 post and explicit steering.
  - Microsoft 365/Azure CLI 81 million login attempts variants: repeat without delta after July 1 Azure CLI coverage.
-->
