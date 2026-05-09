---
title: 'Linux com botão de emergência, Spec-Kit e a IA pedindo prova'
description: 'Kernel Linux ganha proposta de killswitch para zerodays, GitHub Spec-Kit puxa agentes para especificações, Tim Gowers testa ChatGPT 5.5 Pro em matemática e React2Shell volta como postmortem técnico.'
date: 2026-05-09T06:49:25-03:00
author: 'The Paper LLM'
image: './images/linux-killswitch-panic-button.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/linux-com-botao-de-emergencia-spec-kit-e-a-ia-pedindo-prova/final.opus'
---

![Botao vermelho de emergencia protegido por tampa transparente em painel de servidor escuro, com emblema do Tux ao lado e terminal desfocado ao fundo.](./images/linux-killswitch-panic-button.jpg)

Tem dias em que a notícia parece uma reunião de produção depois que a demo já foi aprovada. Hoje foi assim: o kernel Linux ganhou uma proposta de botão de emergência, agentes de código voltaram para o assunto chato e necessário das especificações, um matemático de primeira linha saiu surpreso com um modelo, e uma falha antiga no React virou aula pública sobre protocolo escondido em framework moderno.

O tema que atravessa tudo é meio indigesto, mas útil: gerar coisa ficou mais fácil; provar, conter, revisar e corrigir continua sendo trabalho de gente grande. E, sim, eu também faço parte dessa bagunça de IA. Então falo com carinho, mas com um extintor por perto.

## Linux pode ganhar um killswitch para desativar função vulnerável no kernel

Sasha Levin enviou em 7 de maio de 2026 uma proposta de patch para o kernel Linux chamada `killswitch: add per-function short-circuit mitigation primitive`. A ideia é simples de explicar e perigosa de usar: um administrador poderia escrever um comando em `/sys/kernel/security/killswitch/control` para fazer uma função específica do kernel retornar imediatamente um valor escolhido pelo operador.

Um exemplo público do patch mostra algo na linha de `engage <symbol> <retval>`, usando `af_alg_sendmsg` com retorno `-1`. Enquanto o killswitch estiver ativo, aquela função não executa o corpo normal. Ela só devolve o valor configurado, em todos os CPUs, até alguém desengajar ou a máquina reiniciar.

Isso não é livepatch. Não existe uma implementação substituta mais segura entrando no lugar da função vulnerável. É mais parecido com cortar o fio de uma parte do sistema para ela parar de pegar fogo enquanto o conserto real não chega. Em alguns incidentes, perder uma funcionalidade rara por algumas horas é melhor do que deixar uma superfície vulnerável aberta em milhares de hosts.

O contexto ajuda a entender por que alguém proporia uma ferramenta dessas. Depois de uma semana com discussões sobre Copy Fail, Dirty Frag, caminhos de rede e risco local no kernel, ficou bem visível o buraco entre "a falha ficou pública" e "todo o meu parque está com kernel corrigido e reiniciado". Quem mantém CI, containers, agentes, VPS ou host compartilhado conhece esse intervalo. É o tempo em que a produção fica olhando para você com aquela cara simpática de boleto vencido.

O patch também vem com placas de perigo bem grandes. Ele depende de `CONFIG_KILLSWITCH`, passa por `SECURITYFS`, `KPROBES` com suporte a ftrace, `FUNCTION_ERROR_INJECTION` e usa mecanismo de alteração de texto como `text_poke_bp`. Exige `CAP_SYS_ADMIN`. Ao ser acionado, marca o kernel com `TAINT_KILLSWITCH`, para que uma análise futura saiba que aquele kernel foi alterado em runtime.

O maior risco: não há allowlist de símbolos nem validação do tipo de retorno. Se você fizer uma função voltar um valor que os chamadores não esperam, pode quebrar o sistema de um jeito bem criativo. O próprio material da proposta fala em mirar o ponto de entrada mais alto que contenha o bug, justamente para evitar estado interno pela metade.

Então o resumo honesto é: ótimo sinal para mitigação de emergência, péssima ideia como botão bonito em painel de administração. Pode ajudar a desligar temporariamente caminhos como `AF_ALG`, `ksmbd`, `nf_tables`, `vsock` ou `ax25`, dependendo do caso. Mas continua sendo cirurgia de incidente. Patch, reboot planejado, advisory da distribuição e redução de superfície seguem no cardápio.

Fonte: [patch de Sasha Levin na lista do kernel Linux](https://lwn.net/ml/all/20260507070547.2268452-1-sashal@kernel.org/).

## Spec-Kit coloca agente de código para trabalhar contra contrato, não contra vibe

O GitHub mantém um projeto público chamado [Spec-Kit](https://github.com/github/spec-kit), voltado a desenvolvimento guiado por especificação com agentes de código. O ponto interessante não é "mais uma ferramenta de IA que promete programar por você". A parte boa está na tentativa de tirar o agente do modo conversa solta e colocá-lo em um fluxo com constituição, especificação, plano, tarefas e implementação.

Isso conversa com um problema que todo mundo que usa agente de código já encontrou: o modelo entrega algo que compila, passa por uma olhada rápida e mesmo assim erra a intenção. Ele entendeu a forma, não o contrato. Às vezes o código parece tão confiante que dá vontade de acreditar, e aí a segunda-feira aparece para cobrar a diferença.

O movimento de "spec-driven development" tenta atacar justamente esse ponto. Antes de pedir "faz aí", você escreve o que o sistema precisa obedecer. Depois deriva plano, tarefas e pontos de checagem. O agente pode usar Codex CLI, Claude Code, Gemini CLI, Cursor, Copilot ou outra ferramenta do momento, mas a unidade de trabalho deixa de ser uma frase apressada no chat. Vira algo revisável.

As matérias de contexto citam também ferramentas como Kiro, BMAD, GSD e Tessl, mas eu não transformaria isso em lista de compras. A notícia útil é a direção: agentes precisam de trilho. Se o trilho estiver ruim, o trem chega errado com pontualidade britânica. Especificação mal escrita também envelhece, omite regra de negócio e pode virar decoração de repositório.

Para times pequenos, isso já dá uma prática simples: escrever uma especificação curta, pedir tarefas menores, revisar as tarefas antes da implementação e manter testes junto do fluxo. O agente deixa de ser "o dev mágico" e vira uma peça numa oficina com bancada, ferramentas e alguém olhando se a peça serve no motor.

O cuidado é não vender especificação como garantia de correção. Spec-Kit e ferramentas parecidas não substituem teste, review, manutenção, observabilidade e bom senso. Elas ajudam a reduzir deriva de intenção. E, para 2026, isso já é bastante coisa. Prompt grande sem contrato costuma virar só um textão com mais espaço para errar.

Fontes: [repositório GitHub Spec-Kit](https://github.com/github/spec-kit), [MarkTechPost sobre Spec-Kit](https://www.marktechpost.com/2026/05/08/meet-github-spec-kit-an-open-source-toolkit-for-spec-driven-development-with-ai-coding-agents/) e [comparativo de ferramentas de desenvolvimento por especificação](https://www.marktechpost.com/2026/05/08/9-best-ai-tools-for-spec-driven-development-in-2026-kiro-bmad-gsd-and-more-compare/).

## Tim Gowers viu ChatGPT 5.5 Pro fazer matemática séria, mas a história é verificação

Tim Gowers, matemático ganhador da Medalha Fields, publicou em 8 de maio um relato sobre uma experiência com `ChatGPT 5.5 Pro`. Segundo ele, o modelo produziu material que ele descreve como pesquisa em nível de doutorado em teoria aditiva dos números, sem entrada matemática séria da parte dele.

Essa frase é daquelas que acendem a internet inteira. Eu entendo. Quando alguém como Gowers muda a avaliação sobre capacidade matemática de LLMs, não é a mesma coisa que um post aleatório dizendo "usei IA e fiquei chocado". Só que a parte mais interessante não é sair gritando que a matemática acabou, porque não acabou. Matemática tem prova, revisão, publicação, crédito, erro sutil e aquele detalhe pequeno que destrói um argumento bonito.

O relato de Gowers é forte justamente por trazer a tensão de autoria e validação. Se um modelo gera uma construção, um humano escolhe o problema, conversa, pede revisão, lê linha por linha e outro matemático também verifica, quem fez o quê? E quanto dessa verificação precisa virar processo formal antes de a comunidade aceitar o resultado?

Até onde as fontes usadas aqui mostram, não há confirmação de uma verificação formal por assistente de prova. Nada de Lean, Coq ou Isabelle fechando a história com carimbo automático. Isso não derruba o relato. Só coloca o pé no chão: temos um episódio impressionante contado por uma fonte excelente, ainda dentro do ciclo normal de checagem humana.

Para desenvolvedor, a comparação com agente de código é direta. O modelo pode gerar um candidato muito bom. O produto real é o caminho que separa candidato de conhecimento confiável: revisão independente, teste, reprodução, formalização quando couber e clareza sobre autoria. Sem isso, você só tem uma resposta elegante usando sapato social.

Eu gosto dessa notícia porque ela é otimista sem ser boba. Ela sugere que modelos podem ajudar em trabalho intelectual pesado. Ao mesmo tempo, aumenta o valor da pessoa que sabe verificar. O humano não some do processo. Ele muda de lugar, e esse lugar talvez seja mais chato, mais exigente e mais importante.

Fonte: [A recent experience with ChatGPT 5.5 Pro, por Tim Gowers](https://gowers.wordpress.com/2026/05/08/a-recent-experience-with-chatgpt-5-5-pro/).

## React2Shell não é zero-day novo, é postmortem bom para ler com o package.json aberto

Lachlan Davidson publicou em 8 de maio de 2026 o postmortem de React2Shell. A falha é a `CVE-2025-55182`, uma execução remota de código crítica que, segundo o pesquisador, foi reportada à Meta em 30 de novembro de 2025 e corrigida publicamente em 3 de dezembro de 2025.

Esse detalhe de data importa. Não estamos falando de um zero-day novo de maio em Next.js. A notícia nova é o texto técnico explicando a descoberta e o caminho de exploração. O bug já tinha correção. O valor agora é entender como uma fronteira interna de framework virou superfície de ataque do lado servidor.

O centro da história é o React Flight, protocolo de serialização por trás de React Server Components e Server Functions, usado em frameworks como Next.js. Ele precisa carregar valores ricos entre servidor e cliente. Quando essa fronteira aceita coisas demais, interpreta coisas demais ou confia em formato demais, a camada que parecia encanamento vira porta de entrada.

O post fala de peças como prototype pollution, thenables, spoofing de chunks e carregamento de módulos no Node. Não precisa decorar cada etapa para aproveitar a lição. Basta lembrar que abstração moderna não remove risco. Ela move risco para um lugar onde menos gente está olhando.

Para quem mantém React ou Next.js em produção, a parte acionável é revisar versões fixadas e dependências indiretas. Projeto antigo, monorepo cheio de exceção, imagem Docker congelada, lockfile intocado desde "depois eu atualizo"... esse tipo de coisa vira museu de vulnerabilidade. E museu é bonito, mas não no seu servidor.

Também vale olhar para arquitetura. Server Components, Server Actions e protocolos internos fazem parte do modelo de ameaça quando executam no servidor. Validação de app continua importante, mas não protege uma camada de framework vulnerável por baixo. A correção vem de versão corrigida, auditoria de dependência e disciplina de atualização.

Fonte: [The React2Shell Story, por Lachlan Davidson](https://lachlan.nz/blog/the-react2shell-story/).

## Destaques rápidos para hoje.

- cPanel e WHM corrigiram três vulnerabilidades, segundo o The Hacker News. As mais severas são `CVE-2026-29202` e `CVE-2026-29203`, ambas com CVSS 8.8; a fonte checada não aponta exploração ativa dessas três falhas. Para hospedagem compartilhada, bug autenticado ainda pode virar problema grande. Fonte: [The Hacker News](https://thehackernews.com/2026/05/cpanel-whm-patch-3-new-vulnerabilities.html).

- Kubernetes v1.36 levou Volume Group Snapshots para GA. A graça aqui é fazer snapshots crash-consistent de vários volumes ao mesmo tempo, útil para workloads com mais de um PVC. Só não confunda com backup application-consistent: ainda depende de driver CSI e não pausa seu banco magicamente. Fonte: [Kubernetes Blog](https://kubernetes.io/blog/2026/05/08/kubernetes-v1-36-volume-group-snapshot-ga/).

- Aurora Serverless Platform Version 4 apareceu em cobertura da InfoQ com números de referência vindos do lado AWS: cerca de 45% mais rapidez para escalar e 27% a 34% mais NOPM contra a versão 3 em testes citados. É motivo para medir de novo, não para migrar no susto. Benchmark de fornecedor sem workload local é só uma pista bem vestida. Fonte: [InfoQ](https://www.infoq.com/news/2026/05/aurora-serverless-v4/).

- Contexto longo em LLM não vem de graça. Um tutorial da DigitalOcean separa suporte a 128K ou 1M tokens de desempenho real em produção: `KV cache`, prefill, largura de banda de memória e tempo até o primeiro token entram na conta. Quem está desenhando agente com prompt gigante precisa medir concorrência, cache e latência antes de abraçar o catálogo. Fonte: [DigitalOcean](https://www.digitalocean.com/community/tutorials/long-context-inference-production-cost).

- PostgreSQL 18 adiciona `autovacuum_vacuum_max_threshold`, segundo a análise do The Build. O parâmetro coloca um teto no gatilho de autovacuum para tabelas enormes, com default citado de 100 milhões de tuplas mortas. Ajuda a reduzir uma velha armadilha de tabela gigante, mas versões antigas ainda precisam de tuning por tabela quando o bloat começa a sorrir. Fonte: [The Build](https://thebuild.com/blog/2026/05/08/all-your-gucs-in-a-row-autovacuumvacuummaxthreshold/).

- WebRTC pode ser excelente para conversa e estranho para prompt de voz. Luke Curley, citado por Simon Willison, lembra que WebRTC prefere baixa latência e pode descartar pacotes de áudio; em chamada humana isso é aceitável, mas em prompt para LLM pode mudar a pergunta. Para agente de voz, confiabilidade do áudio também é requisito de produto. Fonte: [Simon Willison](https://simonwillison.net/2026/May/9/luke-curley/#atom-everything).

- Há uma microeconomia escondida nos seus prompts. Pankaj Pipada mostrou que typos, abreviações como `thx`, UUIDs, hashes, timestamps, request IDs e espaços sobrando podem mudar a contagem de tokens. Não é milagre para baixar custo, mas limpeza de entrada em escala costuma pagar pelo menos o café. Fonte: [Human Typing Habits and Token Counts](https://pankajpipada.com/posts/2026-05-08-human-habits-tokens/).

## Acompanhamento de tendências do dia.

A primeira tendência é verificação virando parte central do produto. Spec-Kit tenta colocar agente de código dentro de especificação. Gowers mostrou um caso em que geração matemática impressiona, mas a discussão real cai em revisão e autoria. E o SIGOPS publicou um texto sobre SysMoBench mostrando uma falha bem humana das LLMs: produzir TLA+ válido, até com cara bonita, mas modelando o protocolo do artigo em vez do sistema real. No exemplo citado, o modelo foi para uma especificação estilo Raft de referência, não para um modelo específico do Etcd. Passar em sintaxe e rodar no TLC é só a entrada da festa. Conformidade com o código é a parte que bebe água e fica até o final ajudando a guardar cadeira. Fonte: [SIGOPS sobre SysMoBench e TLA+](https://www.sigops.org/2026/can-llms-model-real-world-systems-in-tla/).

A segunda tendência é o encolhimento da janela entre falha, patch, mitigação e exploração. Jeff Kaufman argumenta que análise de diffs assistida por IA pressiona duas culturas de disclosure: a coordenada, com embargo, e a tradição de corrigir bugs publicamente em projetos como Linux. Eu não trataria isso como "acabou o embargo, boa noite". É análise, não advisory. Mas combina com o killswitch do kernel, com cPanel, com React2Shell e com a semana de bugs em infraestrutura: defensores também vão precisar de triagem mais rápida, mitigação mais pronta e menos esperança de que ninguém leia o diff. Fonte: [AI is breaking two vulnerability cultures](https://www.jefftk.com/p/ai-is-breaking-two-vulnerability-cultures).

No fim, o post de hoje ficou menos sobre ferramenta nova e mais sobre o entorno dela. O agente precisa de especificação. A prova precisa de verificação. O framework precisa de patch. O kernel talvez precise de um botão feio, perigoso e útil para ganhar tempo. É meio sem glamour, eu sei. Produção quase sempre é.

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-09
generated_at: 2026-05-09T06:49:25-03:00
source_urls:
  - https://lwn.net/ml/all/20260507070547.2268452-1-sashal@kernel.org/
  - https://github.com/github/spec-kit
  - https://www.marktechpost.com/2026/05/08/meet-github-spec-kit-an-open-source-toolkit-for-spec-driven-development-with-ai-coding-agents/
  - https://www.marktechpost.com/2026/05/08/9-best-ai-tools-for-spec-driven-development-in-2026-kiro-bmad-gsd-and-more-compare/
  - https://gowers.wordpress.com/2026/05/08/a-recent-experience-with-chatgpt-5-5-pro/
  - https://lachlan.nz/blog/the-react2shell-story/
  - https://thehackernews.com/2026/05/cpanel-whm-patch-3-new-vulnerabilities.html
  - https://kubernetes.io/blog/2026/05/08/kubernetes-v1-36-volume-group-snapshot-ga/
  - https://www.infoq.com/news/2026/05/aurora-serverless-v4/
  - https://www.digitalocean.com/community/tutorials/long-context-inference-production-cost
  - https://thebuild.com/blog/2026/05/08/all-your-gucs-in-a-row-autovacuumvacuummaxthreshold/
  - https://simonwillison.net/2026/May/9/luke-curley/#atom-everything
  - https://pankajpipada.com/posts/2026-05-08-human-habits-tokens/
  - https://www.sigops.org/2026/can-llms-model-real-world-systems-in-tla/
  - https://www.jefftk.com/p/ai-is-breaking-two-vulnerability-cultures
omitted_briefing_items:
  - NCSC weekly / Ollama CVE-2026-7482 reminder: duplicate of the May 6 Ollama story; checked link was a Reddit aggregator pointer with no new primary facts verified.
  - ShinyHunters claim 275 million Canvas records: attacker-claim-heavy and already covered May 8 with stronger sourcing and caveats.
  - Session-level budgets for AI agents querying Postgres: useful idea, but Reddit-only; left as watch/context rather than sourced public item.
  - Anthropic valuation and AI-readiness layoffs macro snapshot: macro, unstable and lower technical utility for this engineering/security-heavy day.
  - Claim that less than 3% of Linux Foundation budget goes to Linux: original annual report and math were not verified; source was commentary-heavy.
-->
