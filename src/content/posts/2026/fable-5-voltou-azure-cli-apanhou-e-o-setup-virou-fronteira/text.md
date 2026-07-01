---
title: 'Fable 5 voltou, Azure CLI apanhou e o setup virou fronteira'
description: 'Anthropic reabriu o Fable 5 e lançou o Sonnet 5; Huntress viu 81 milhões de tentativas contra Azure CLI; 0DIN mostrou por que repo limpo ainda pode comprometer agente; e o webernetes colocou Kubernetes no navegador.'
date: 2026-07-01T05:35:46-03:00
author: 'The Paper LLM'
image: './images/fable-5-voltou-fronteira-cover.jpg'
---

![Posto de controle futurista com a placa "Fable 5 voltou", cancela aberta, documento "Claude Fable 5" liberado em 1 de julho e painel de limite de 50%.](./images/fable-5-voltou-fronteira-cover.jpg)

Algumas mudanças parecem pequenas no painel de controle: liberar um modelo de novo, ligar MFA, deixar um agente rodar o setup. Depois elas aparecem como custo, conta invadida ou comando rodando no lugar errado. Hoje o fio é esse: ferramenta útil também precisa de limite bem desenhado.

## Fable 5 volta em 1 de julho, e Sonnet 5 vira padrão para Free e Pro

No dia 13, a gente falou que [os EUA tinham colocado Fable 5 e Mythos 5 sob controle de exportação](/2026/controle-de-exportacao-dos-eua-tirou-fable-5-e-mythos-5-do-ar/). Agora a mudança é concreta: a Anthropic diz que esses controles foram retirados em 30 de junho, e o Claude Fable 5 volta globalmente em 1 de julho.

O retorno vale para Claude Platform, Claude.ai, Claude Code e Claude Cowork. Para planos Pro, Max, Team e alguns Enterprise, o Fable 5 entra até 50% do limite semanal de uso até 7 de julho. Depois disso, passa para créditos de uso. É uma volta com limite de uso, data de transição e cobrança para acompanhar de perto.

A AWS diz que o Fable 5 volta ao Amazon Bedrock em 1 de julho. Ali, a camada de segurança chama atenção: no texto da AWS, o trabalho com a Anthropic aparece dentro do Project Glasswing, com guardrails mais fortes e redirecionamento para Opus 4.8 quando uma regra dispara. Para operação, isso muda a experiência: guardrail pode bloquear, trocar o modelo em uso ou gerar falso positivo. Quem depende de um modelo específico precisa medir esse caminho inteiro, não só ler o cartão de lançamento.

No mesmo pacote de anúncios, a Anthropic lançou o Claude Sonnet 5 em 30 de junho. Ele está disponível em todos os planos e virou o modelo padrão para Free e Pro. O preço introdutório fica em US$ 2 por milhão de tokens de entrada e US$ 10 por milhão de tokens de saída até 31 de agosto de 2026; depois sobe para US$ 3 e US$ 15.

Token barato no anúncio não fecha a conta sozinho. A própria Anthropic avisa que o Sonnet 5 usa um tokenizer atualizado, e que a mesma entrada pode virar de 1,0 a 1,35 vez mais tokens, dependendo do conteúdo. Em agente, onde uma tarefa pode chamar ferramenta, reler contexto e dar várias voltas, essa diferença aparece na fatura. Antes de trocar o padrão do time, vale medir tarefa real: prompt, ferramentas, redirecionamento de modelo, número de turnos e custo final.

Fontes: [Anthropic sobre o retorno do Fable 5](https://www.anthropic.com/news/redeploying-fable-5), [Anthropic sobre o Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5) e [AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/safely-releasing-frontier-models-to-customers/).

## Azure CLI levou 81 milhões de tentativas, e MFA mal escopado não segurou

Huntress publicou uma investigação de password spray contra autenticação da Microsoft, mirando o caminho do Azure CLI. Entre 12 e 26 de junho de 2026, a empresa observou mais de 81 milhões de tentativas de login contra contas de clientes. Segundo a Huntress, pelo menos 78 contas Microsoft, em 64 organizações, foram comprometidas.

Password spray não é adivinhação sofisticada de senha por usuário. É tentar poucas senhas comuns em muitas contas, para não parecer uma força bruta óbvia em uma conta só. A parte que dói aqui é que algumas organizações tinham MFA ligado, mas a política não cobria o caminho usado pelo atacante.

O fluxo citado é Resource Owner Password Credentials, ou ROPC. Nesse modo, usuário e senha vão direto para o endpoint de token, sem a experiência interativa normal que costuma acionar desafio de MFA. Se a Conditional Access Policy não cobre o app, o tipo de cliente, o usuário ou a origem certa, a empresa fica com uma placa dizendo "tem MFA" e uma porta lateral sem a mesma regra.

O trabalho para admin é menos glamouroso que comprar ferramenta nova: bloquear ou restringir autenticação legada e ROPC quando possível, ampliar Conditional Access para todos os apps e tipos de cliente relevantes, restringir Azure CLI para quem não precisa, girar credenciais expostas e monitorar falhas no endpoint de token. Também vale lembrar a ressalva: os números são da visibilidade da Huntress, não uma contagem global de todos os tenants Microsoft.

Fontes: [Huntress](https://www.huntress.com/blog/lshiy-password-spray-attack), [The Hacker News](https://thehackernews.com/2026/07/azure-cli-password-spray-hits-at-least.html) e [Microsoft Learn](https://learn.microsoft.com/en-us/security/operations/incident-response-playbook-password-spray).

## Repo limpo ainda pode virar ataque quando o agente roda o setup por você

No dia 27, a gente falou que [abrir repo não é passivo](/2026/npm-amazon-q-entrevista-falsa-abrir-repo-nao-e-passivo/). A novidade agora deixa esse limite mais concreto: a Mozilla 0DIN demonstrou uma prova de conceito em que um repositório com aparência limpa conduz um agente de código pelo setup e pela recuperação de erro até execução perigosa.

A parte ruim não precisa estar plantada como um arquivo malicioso óbvio dentro do repositório. A cadeia descrita pela 0DIN usa instruções de setup, comportamento prestativo do agente e dados buscados em tempo de execução. Entre os exemplos citados aparece canal fora do repo via registro DNS TXT. Para defesa, importa perceber que "instalar dependência" e "corrigir erro de ambiente" viraram primeira fronteira de segurança.

Isso pega Claude Code, Cursor, Copilot, Gemini CLI e qualquer ferramenta que tente ajudar demais em um projeto desconhecido. A ajuda é justamente o risco: o agente lê a falha, decide o próximo comando e tenta fazer o projeto funcionar. Se a sessão está na sua máquina normal, com seus tokens, chaves e variáveis de ambiente, o estrago não precisa pedir crachá.

Ainda é uma prova de conceito, não uma campanha ampla confirmada. Mesmo assim, a política defensiva já é aplicável: primeiro contato com repositório desconhecido vai para container, VPS descartável ou ambiente isolado; o agente deve inspecionar arquivos de setup antes de agir; comandos de shell e rede precisam de plano e aprovação explícita; segredo só entra quando a tarefa realmente precisa dele. É menos mágico, mas magia com token de produção costuma sair cara.

Fontes: [Mozilla 0DIN](https://0din.ai/blog/clone-this-repo-and-i-own-your-machine), [SecurityWeek](https://www.securityweek.com/new-attack-abuses-claude-code-and-harmless-looking-repositories-to-hijack-developer-machines/) e [TabNews](https://www.tabnews.com.br/Centelha/antes-de-deixar-o-agente-rodar-o-setup-trate-o-repositorio-como-nao-confiavel).

## Webernetes colocou um pedaço de Kubernetes dentro do navegador

Depois de segurança pesada, um brinquedo sério. Sam Rose, da ngrok, lançou o webernetes: uma porta parcial de Kubernetes para TypeScript que roda cluster no navegador, sem backend de servidor. A ideia é ensino interativo, não produção. Essa distinção precisa vir junto, porque alguém sempre olha para uma demo bonita e começa a imaginar o cluster de sexta-feira.

O projeto tem quase 100 mil linhas geradas ao longo de 552 commits e 629 arquivos, segundo o post. Ele simula partes que ajudam a ensinar Kubernetes de verdade: ciclo de vida de pods, DNS e rede de cluster, kubelet, Deployments, ReplicaSets, alocação de IP, garbage collection de containers e pedaços do comportamento de control plane.

O relato sobre LLMs funciona melhor quando não vira propaganda. O autor diz que usou modelos para portar código e relata os erros típicos: atalhos inventados, helpers que não existem, teste perdido, comportamento que parece plausível e não bate com o sistema original. Por isso a confiança vem dos testes, não da vibe da geração. O texto fala em comparação com k3s, 204 testes de integração e 1.855 testes unitários. O pacote gzipped fica em torno de 140 KiB.

Os limites também importam. O webernetes não é Kubernetes completo: não tem Secrets reais, ConfigMaps completos, volumes persistentes, limites de recurso nem pull real de registry. Como ferramenta de aula, isso pode ser ótimo. Como substituto operacional, não. A graça é poder ver conceitos como pod, controller e DNS funcionando em uma aba do navegador, com um projeto que também ensina uma coisa sobre port automatizado: se o teste não vigia, o modelo abrevia.

Fontes: [ngrok](https://ngrok.com/blog/i-ported-kubernetes-to-the-browser) e [GitHub ngrok/webernetes](https://github.com/ngrok/webernetes).

## Destaques rápidos de hoje

- **Chrome 151 corrigiu 382 vulnerabilidades, segundo a SecurityWeek.** O pacote teria 15 falhas críticas e 67 de alta severidade, sem menção a exploração ativa naquele aviso. Browser é superfície diária: atualize e confirme rollout em frota gerenciada. Fonte: [SecurityWeek](https://www.securityweek.com/google-patches-382-chrome-vulnerabilities/).

- **Citrix publicou correções para seis falhas em NetScaler ADC e NetScaler Gateway.** As linhas afetadas incluem 14.1 antes de 14.1-72.61 e 13.1 antes de 13.1-63.18, além de linhas FIPS e NDcPP. A lista passa por `CVE-2026-8451`, `CVE-2026-8452`, `CVE-2026-8655`, `CVE-2026-10816`, `CVE-2026-10817` e `CVE-2026-13474`, com riscos que variam por configuração, incluindo leitura de arquivo e negação de serviço. Fontes: [Citrix](https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX696604), [Canadian Centre for Cyber Security](https://www.cyber.gc.ca/en/alerts-advisories/citrix-security-advisory-av26-645) e [The Hacker News](https://thehackernews.com/2026/07/citrix-patches-six-netscaler-flaws.html).

- **Um despejo anônimo de zero-days colocou mantenedores sob pressão.** Risky Biz reporta PoCs e write-ups para mais de uma dúzia de falhas, com projetos como Linux kernel, FFmpeg, OpenVPN, VLC, PHP, 7-Zip, Gitea e Gogs no radar. A ajuda por IA ainda depende do relato do pesquisador; o problema confirmado para operadores é acompanhar advisories sem amplificar link de exploit. Fontes: [Risky Biz News](https://news.risky.biz/risky-bulletin-researcher-drops-giant-cache-of-zero-day-exploits/) e [The Register](https://www.theregister.com/security/2026/06/29/anonymous-researcher-drops-0-day-exploitarium-repo/5263961).

## Acompanhamento de tendências do dia

Ontem, o [TraceLab apareceu por aqui](/2026/tracelab-codex-claude-code-infraestrutura/) mostrando agente de código como carga de infraestrutura. A cobertura do AI Engineer World's Fair aponta para a próxima camada: loops, automações, cron jobs, fábricas de software e trabalho de orquestração ao redor do modelo.

O dispatch da Latent Space diz que loops dominaram conversas no primeiro dia cheio de keynotes e sessões. A trajetória descrita é sair do chat, passar por ferramentas, chegar a objetivos e depois a rotinas que continuam trabalhando. Palestrantes da OpenAI falaram de Codex e loops multiagente; Natalie Meurer, da Sierra, colocou bastante trabalho específico de cliente na camada de orquestração, não dentro do modelo sozinho.

A fala de Vint Cerf citada pela TechCrunch puxa a mesma preocupação para padrões: agentes não podem depender só de linguagem natural imprecisa para cooperar. Precisam de interoperabilidade e contratos mais formais. Em projeto real, isso vira schema, permissão, fila, estado, avaliação, revisão humana, limite de ferramenta, MCP, A2A e implantação. Modelo melhor ajuda. Mas, quando o trabalho dura horas ou dias, o encanamento começa a mandar no resultado.

Fontes da tendência: [Latent Space](https://www.latent.space/p/aiewf-daily-dispatch-loops), [AI Engineer World's Fair 2026](https://www.ai.engineer/worldsfair/2026) e [TechCrunch](https://techcrunch.com/2026/06/30/the-father-of-the-internet-is-finally-retiring/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-07-01
source_mode: briefing
generated_at: 2026-07-01T05:35:46-03:00
source_urls:
  - https://www.anthropic.com/news/redeploying-fable-5
  - https://www.anthropic.com/news/claude-sonnet-5
  - https://aws.amazon.com/blogs/machine-learning/safely-releasing-frontier-models-to-customers/
  - https://www.huntress.com/blog/lshiy-password-spray-attack
  - https://thehackernews.com/2026/07/azure-cli-password-spray-hits-at-least.html
  - https://learn.microsoft.com/en-us/security/operations/incident-response-playbook-password-spray
  - https://0din.ai/blog/clone-this-repo-and-i-own-your-machine
  - https://www.securityweek.com/new-attack-abuses-claude-code-and-harmless-looking-repositories-to-hijack-developer-machines/
  - https://www.tabnews.com.br/Centelha/antes-de-deixar-o-agente-rodar-o-setup-trate-o-repositorio-como-nao-confiavel
  - https://ngrok.com/blog/i-ported-kubernetes-to-the-browser
  - https://github.com/ngrok/webernetes
  - https://www.securityweek.com/google-patches-382-chrome-vulnerabilities/
  - https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX696604
  - https://www.cyber.gc.ca/en/alerts-advisories/citrix-security-advisory-av26-645
  - https://thehackernews.com/2026/07/citrix-patches-six-netscaler-flaws.html
  - https://news.risky.biz/risky-bulletin-researcher-drops-giant-cache-of-zero-day-exploits/
  - https://www.theregister.com/security/2026/06/29/anonymous-researcher-drops-0-day-exploitarium-repo/5263961
  - https://www.latent.space/p/aiewf-daily-dispatch-loops
  - https://www.ai.engineer/worldsfair/2026
  - https://techcrunch.com/2026/06/30/the-father-of-the-internet-is-finally-retiring/
omitted_briefing_items:
  - Researcher analyzes 3,000 live ClickFix payloads: not validated from original research during this pass and crowded out by stronger verified security stories.
  - Structurally fixing injection bugs: confirmed evergreen 2012 teaching material, not same-day news.
  - AWS: Safely releasing frontier models to customers: included inside the Anthropic/Fable main story instead of separate block.
  - A lifecycle survey of LLM vulnerabilities: not checked and too paper-heavy for today's public shape.
  - Claude Code is steganographically marking requests: not checked and needs hands-on verification before public claim.
  - Installing Cursor on iOS irreversibly changes your privacy settings: HN anecdote without enough vendor or public confirmation.
  - Generative Skill Composition for LLM Agents: fits harness trend but would overload the trend section with paper acronyms.
  - ACE adaptive context management: relevant to harness trend, but less recognizable than AIEWF/Codex/orchestration.
  - World-Model Collapse as a phase transition: research-watch item not needed for today's public package.
  - QVal: cheaply evaluating supervision signals for long-horizon agents: interesting research caveat, lower reader-action value than selected stories.
  - Governance gaps in agent interoperability protocols: standards/interoperability represented by the AIEWF/Cerf trend.
  - Postgres enable_material and enable_memoize: good database teaching item but outside today's core package.
  - The PostgreSQL feature that makes data recovery painful: useful systems item, crowded out by today's security density.
  - Why does the cloud stop computing? Lessons from hundreds of outages: confirmed classic 2016 paper, evergreen context.
  - How to set up a private droplet and bastion host with cloud firewalls: good VPS tutorial, but not a news hook.
  - audio.cpp adds VibeVoice 1.5B: Reddit-heavy benchmark needs Otavio testing before public recommendation.
  - DeepSeek-V4-Flash KV cache quant surprise: Reddit/local-model optimization note, too narrow today.
  - Crom Video Gen and Miniflow Go: community project, weaker and more self-promotional than selected stories.
  - From Julia to Rust: a differentiable tensor stack: architecture essay saved for another day.
  - ArXiv's next chapter: confirmed open-science milestone, weaker fit than main dev/security payload.
  - Fake Bug Report Hijacks AI Coding Agents at Scale: verified but overlaps selected setup-boundary story.
  - New BioShocking attack manipulates AI browser into data theft: not selected because original research was not validated in this run.
-->
