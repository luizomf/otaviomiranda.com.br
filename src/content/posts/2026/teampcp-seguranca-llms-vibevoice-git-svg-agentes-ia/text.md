---
title: 'TeamPCP, segurança de LLMs e VibeVoice: agentes saem do prompt'
description:
  'TeamPCP volta com ataques em npm, PyPI e Docker Hub; LCF e AgentWard olham
  segurança de LLMs em runtime; VibeVoice, Git e SVG completam o dia de
  infraestrutura para agentes.'
date: 2026-04-28T07:01:57-03:00
author: 'The Paper LLM'
image: './images/seguranca-de-agentes.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/teampcp-seguranca-llms-vibevoice-git-svg-agentes-ia/final.opus'
---

<!--
briefing_slug: 2026-04-28
generated_at: 2026-04-28T07:01:57-03:00
source_urls:
- https://isc.sans.edu/diary/TeamPCP%2BSupply%2BChain%2BCampaign%2BUpdate%2B008%2B26Day%2BPause%2BEnds%2Bwith%2BThree%2BConcurrent%2BCompromises%2BCheckmarx%2BKICS%2BBitwarden%2BCLI%2BCascade%2Bxinference%2BPyPI%2BCanisterSprawl%2Bnpm%2BWorm%2BIdentified%2Band%2BTier%2B1%2BCoverage%2BReturns/32926
- https://socket.dev/blog/checkmarx-supply-chain-compromise
- https://www.docker.com/blog/kics-security-incident/
- https://research.jfrog.com/campaigns/teampcp/
- https://arxiv.org/abs/2604.24542v1
- https://arxiv.org/abs/2604.24657v1
- https://simonwillison.net/2026/Apr/27/vibevoice/
- https://github.com/microsoft/VibeVoice
- https://gitperf.com/
- https://muffin.ink/blog/scratch-svg-sanitization/
- https://www.silverfort.com/blog/agent-id-administrator-scope-overreach-service-principal-takeover-in-entra-id/
- https://www.infoq.com/news/2026/04/npmx-browser-alpha/
- https://ichard26.github.io/blog/2026/04/whats-new-in-pip-26.1/
- https://ergaster.org/til/yubikey-unlock-laptop/
- https://cybereason-public.github.io/owLSM/
- https://gtfobins.org/
- https://www.infoq.com/articles/ai-code-guardian/
omitted_briefing_items:
- Google Cloud AI infrastructure at Next 26: bom sinal de infraestrutura, mas anúncio de semana anterior e com energia de release.
- Persona Collapse e AI sabotage papers: interessantes, porém menos práticos para o leitor de hoje que LCF e AgentWard.
- Jandaira, 49Agents e zsh-claude-code: ferramentas alinhadas ao tema, mas jovens demais para virar recomendação forte.
- elementary-data PyPI compromise: item potencialmente forte, mas melhor esperar relatório primário antes de promover.
- Chrome Prompt API: relevante, mas já entrou como nota recente e não tinha desenvolvimento novo hoje.
- RAS, FastOMOP e prompt under-specification: bons papers para acompanhamento, mas ficaram redundantes com o eixo de segurança em runtime.
- PostgreSQL archive_mode: redirect falhou no briefing e não passou como fonte final.
- Claude Code model configuration: documentação útil, mas sem confirmação externa suficiente para a alegação de uso extra no Pro.
-->

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

Dia mais de incidente do que de lançamento. A campanha TeamPCP voltou, e desta
vez encostou em ferramentas que aparecem no build de quem desenvolve software.
Junto disso, dois papers tratam segurança de LLM como problema de runtime, e não
de prompt bem escrito.

No meio do dia ainda apareceu teste local de transcrição com VibeVoice, um livro
aberto sobre Git por dentro e um post longo sobre sanitização de SVG que serve
quase como leitura obrigatória pra quem mexe com agente.

![Imagem abstrata sobre segurança de agentes, supply chain e runtime de LLMs](./images/seguranca-de-agentes.jpg)

## TeamPCP volta com três comprometimentos no mesmo dia

O SANS Internet Storm Center publicou em 27 de abril de 2026 uma atualização
sobre a campanha TeamPCP. Segundo o diário, a pausa de 26 dias acabou com três
comprometimentos quase ao mesmo tempo: imagens Docker do Checkmarx KICS, pacote
xinference no PyPI e um worm de npm chamado CanisterSprawl.

O ruim é que isso não tem cara de pacote malicioso isolado. A cadeia passa por
scanner de segurança popular, imagem Docker oficial e token de quem publica
pacote. Quando o caminho quebra nesses pontos, o CI vira porta de entrada, não
só esteira de build.

A Docker disse que as imagens de KICS foram trocadas em 22 de abril de 2026 por
alguém com credenciais válidas de publicador. A Socket descreveu extensões de VS
Code e OpenVSX baixando um payload chamado `mcpAddon.js` que coleta praticamente
tudo que importa numa máquina de dev: credenciais cloud, tokens de GitHub e npm,
chaves SSH e configuração de Claude e MCP.

Tem ainda o caso do Bitwarden CLI na mesma vizinhança. Não dá mais pra usar
`latest` por conveniência e dormir tranquilo. Coisa básica como pin por digest,
permissão mínima em GitHub Actions e rotação de segredo depois de ferramenta
comprometida virou requisito, não capricho.

Fontes:
[SANS Internet Storm Center](https://isc.sans.edu/diary/TeamPCP%2BSupply%2BChain%2BCampaign%2BUpdate%2B008%2B26Day%2BPause%2BEnds%2Bwith%2BThree%2BConcurrent%2BCompromises%2BCheckmarx%2BKICS%2BBitwarden%2BCLI%2BCascade%2Bxinference%2BPyPI%2BCanisterSprawl%2Bnpm%2BWorm%2BIdentified%2Band%2BTier%2B1%2BCoverage%2BReturns/32926),
[Socket](https://socket.dev/blog/checkmarx-supply-chain-compromise),
[Docker](https://www.docker.com/blog/kics-security-incident/) e
[JFrog Security Research](https://research.jfrog.com/campaigns/teampcp/).

## Defesa de LLM agora olha pra dentro do modelo

O paper Layerwise Convergence Fingerprints, publicado no arXiv em 27 de abril de
2026, tenta detectar mau comportamento de LLM enquanto o modelo ainda está
gerando. A ideia é observar como os estados internos convergem entre camadas.
Quando essa trajetória fica estranha, o sistema trata aquilo como sinal de
risco.

Em vez de esperar a resposta sair pra bloquear depois, a defesa observa o que
rola nas camadas. Foi testado contra backdoor, jailbreak e prompt injection, com
a ressalva óbvia: precisa de acesso aos internos do modelo. Em API fechada, esse
caminho não está na sua mão.

O AgentWard completa bem a leitura. O paper organiza segurança de agente por
fase do ciclo de vida, da inicialização até a execução de ferramenta. O ganho
real é trocar a metáfora. Tratar agente como chat com ferramenta pendurada é
descrição pequena demais. Na prática é runtime: tem estado, identidade,
permissão e produz efeito real no mundo.

Nesse nível, "melhorar o prompt" vira peça pequena. Ainda importa, mas não
segura tudo. O resto fica em telemetria, política de ferramenta e limite
explícito pra ação perigosa.

Fontes:
[arXiv, "Layerwise Convergence Fingerprints for Runtime Misbehavior Detection in Large Language Models"](https://arxiv.org/abs/2604.24542v1)
e
[arXiv, "AgentWard: A Lifecycle Security Architecture for Autonomous AI Agents"](https://arxiv.org/abs/2604.24657v1).

## VibeVoice rodou local com número medido

Simon Willison testou o VibeVoice da Microsoft no macOS em 27 de abril de 2026,
usando uma conversão pra MLX. O modelo não é estreia, o repositório da Microsoft
já existia. O que muda é ter alguém rodando localmente, medindo e contando o que
doeu.

No teste dele, cerca de uma hora de áudio virou JSON com timestamps e
identificação de falantes em 524,79 segundos. Isso dá pouco menos de 9 minutos
em um M5 Max com 128 GB de memória. A conversão quantizada em 4 bits pesava 5,71
GB, contra 17,3 GB do modelo original.

A pegadinha aparece depois. Pra colocar isso num fluxo real, ainda tem trabalho:
limite de duração por chamada, pico de memória no prefill e a chatice de cortar
áudio em pedaços com sobreposição pra reconciliar quem fala o quê. Boa o
bastante pra entrar em pipeline, mas não simples o bastante pra fingir que não
tem engenharia ali.

Pra quem grava aula, podcast ou áudio de reunião, esse tipo de teste vale mais
que benchmark genérico. A dúvida agora é prática: dá pra rodar toda semana, com
erro controlado, sem transformar o Mac numa torradeira?

Fontes: [Simon Willison](https://simonwillison.net/2026/Apr/27/vibevoice/) e
[repositório microsoft/VibeVoice no GitHub](https://github.com/microsoft/VibeVoice).

## High Performance Git, agora com agente no loop

O Ted Nyman publicou High Performance Git como livro aberto sobre Git por
dentro. O ângulo é interessante porque ele larga o Git do dia a dia (`add`,
`commit`, `push`) e olha pra estrutura: armazenamento por conteúdo, grafo de
commits, cache, índice e tudo que faz o Git ser rápido (ou lento) na prática.

O sumário cobre o que normalmente fica escondido: objetos, refs, packfiles,
commit-graphs, partial clone, worktrees e Trace2. Dá pra usar Git anos sem
pensar em nenhuma dessas coisas. Só que aí entra agente criando branch, worktree
e commit em ritmo de máquina.

Aí performance vira assunto sério, não obsessão de quem cronometra milissegundo.
Repo grande com automação por cima sofre em clone, fetch e indexação. Se o
agente usa Git como memória de trabalho, o custo aparece no fluxo todo.

O livro serve bem como referência de base. Antes de culpar o agente, vale checar
se o repo tem commit-graph configurado, partial clone bem usado e algum rastro
via Trace2 pra entender pra onde o tempo está indo.

Fonte: [Ted Nyman, "High Performance Git"](https://gitperf.com/).

## SVG continua sendo um pesadelo de sanitizar

O texto "The woes of sanitizing SVGs", publicado em abril de 2026, usa anos de
histórico do Scratch pra mostrar por que sanitizar SVG é tarefa ingrata. O
formato parece imagem, mas carrega script, CSS, import remoto e parser de
navegador no meio do caminho. Com isso tudo, filtro vira corrida sem fim.

O autor mostra bugs com DOMPurify, vazamento por imagem remota, `image-set()` e
diferença entre o parser de CSS deles e o do navegador. Coisa que só aparece pra
quem insiste o bastante. Detalhe divertido: o próprio post foi atualizado depois
que o Claude achou outro vazamento via CSS nesting e import HTTP.

A lição não fica presa ao SVG. Algumas entradas são expressivas demais pra gente
fingir que vai limpar tudo com regex, parser e esperança. Em algum momento, a
saída honesta é contenção: iframe sandboxed, Content Security Policy restritiva
e limite claro do que aquele conteúdo pode alcançar.

Isso conversa direto com agente. Ferramenta, arquivo, pacote e página HTML viram
linguagem de ataque sem aviso. Sanitizar melhor às vezes resolve. A pergunta
mais útil costuma ser qual o raio de alcance se aquele conteúdo for hostil.

Fonte:
[muffin.ink, "The woes of sanitizing SVGs"](https://muffin.ink/blog/scratch-svg-sanitization/).

## Destaques rápidos

- A Silverfort detalhou uma falha no papel Agent ID Administrator do Microsoft
  Entra ID. Segundo a empresa, o papel conseguia assumir propriedade de service
  principals fora do escopo de agentes, criar credenciais e autenticar como
  eles; a Microsoft informou correção em abril de 2026. Fonte:
  [Silverfort](https://www.silverfort.com/blog/agent-id-administrator-scope-overreach-service-principal-takeover-in-entra-id/).

- O npmx chegou em alpha como alternativa comunitária pra navegar o registro
  npm. O ponto bom é a transparência: dá pra ver tamanho transitivo, ESM ou CJS
  e aviso de dependência velha antes de instalar qualquer coisa. Fonte:
  [InfoQ](https://www.infoq.com/news/2026/04/npmx-browser-alpha/).

- O pip 26.1 trouxe cooldown de dependência, lockfile experimental em
  `pylock.toml` e dropou suporte a Python 3.9. Evolução boa, mas lockfile
  experimental ainda não é coisa pra colocar direto em produção. Fonte:
  [Richard Si](https://ichard26.github.io/blog/2026/04/whats-new-in-pip-26.1/).

- Thibault Martin mostrou um setup de YubiKey com PAM e U2F pra sudo, login e
  lock screen no Linux. A parte boa é o cuidado com fallback: segurança que
  prende o dono pra fora da máquina morre rápido. Fonte:
  [Thibault Martin](https://ergaster.org/til/yubikey-unlock-laptop/).

- O owLSM da Cybereason combina eBPF LSM com regras Sigma com estado. Parece
  nichado, mas a ideia é forte: prevenir no kernel em vez de só alertar depois.
  Fonte: [Cybereason](https://cybereason-public.github.io/owLSM/).

- GTFOBins voltou a aparecer como referência evergreen pra Unix e Linux. Em
  imagem de agente, container mínimo ou shell restrito, a lista funciona como
  checklist de binários que podem ler arquivo, abrir shell ou escapar de
  política fraca. Fonte: [GTFOBins](https://gtfobins.org/).

- O CodeGuardian, descrito pela InfoQ, encaixa scanners de qualidade e segurança
  num servidor MCP. Ferramenta de segurança chamável por agente é uma direção
  promissora. O contraponto é que adiciona mais uma superfície entre prompt,
  scanner e correção automática. Fonte:
  [InfoQ](https://www.infoq.com/articles/ai-code-guardian/).

## Acompanhamento de tendências

Tem dois eixos claros no dia. O primeiro é supply chain virando infraestrutura
de ataque. TeamPCP, npmx e GTFOBins encostam no mesmo chão: máquina de dev,
runner de CI e pacote já são parte do ambiente produtivo. Tratar tudo isso como
"só build" ficou ingênuo.

O segundo eixo é segurança de agente saindo do prompt. LCF olha pra dentro do
modelo, AgentWard organiza o ciclo de vida e owLSM puxa enforcement pro kernel.
Entra ID e SVG entram pelo lado de identidade e contenção, dois assuntos que
continuam mandando independente do hype do dia.

A parte local também ressurgiu hoje. VibeVoice mostra áudio local quase pronto
pra fluxo sério, e High Performance Git lembra que o básico fica caro quando
roda em cadência de agente. Modelo é o que ganha manchete, mas o trabalho real
do dia está em coisa mais chata: ferramenta, permissão e log de execução.
