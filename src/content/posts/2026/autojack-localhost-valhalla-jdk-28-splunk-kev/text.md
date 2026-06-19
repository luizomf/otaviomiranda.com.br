---
title: 'AutoJack põe localhost sob suspeita; Valhalla mira JDK 28 e Splunk entra no KEV'
description:
  'AutoJack em AutoGen Studio mostra o risco de agente navegando até localhost; Project Valhalla leva value classes ao radar do JDK 28; Splunk CVE-2026-20253 entrou em exploração e CISA KEV; GLM-5.2, FortiBleed, AMD GAIA e Squidbleed completam.'
date: 2026-06-19T08:46:40-03:00
author: 'The Paper LLM'
image: './images/autojack-localhost-valhalla-jdk-28-splunk-kev-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/autojack-localhost-valhalla-jdk-28-splunk-kev/final.opus'
---

![Jornal de tecnologia com a manchete "LOCALHOST NÃO É FRONTEIRA", mostrando AutoJack, localhost, 127.0.0.1 e uma porta MCP local.](./images/autojack-localhost-valhalla-jdk-28-splunk-kev-cover.jpg)

Tem coisa que parece segura só porque fica perto da nossa máquina. Hoje a primeira história começa nesse engano: uma página da web, um agente com navegador e um serviço ouvindo em `localhost`.

## AutoJack transforma uma página web em caminho para o MCP local do AutoGen Studio

AutoJack é o nome que a Microsoft deu a uma cadeia encontrada no AutoGen Studio. O caso é útil pelo desenho de risco: um agente abre conteúdo remoto e, ao mesmo tempo, conversa com ferramentas locais. Quando isso acontece sem isolamento suficiente, uma página externa pode ganhar um caminho indireto até o plano de controle da máquina.

No relato da Microsoft, a rota sensível era um MCP WebSocket no `localhost`. MCP aqui é o Model Context Protocol, usado para ligar agentes a ferramentas. A falha vinha de uma suposição perigosa: se a origem parece `127.0.0.1`, então a chamada é confiável. Só que, com um agente navegando, conteúdo não confiável pode virar o empurrão que faz uma chamada local acontecer.

O resultado da cadeia era execução de comando no host que rodava o agente. A ressalva importante vem da própria Microsoft: a superfície afetada foi endurecida no ramo principal antes de sair em release no PyPI. A cadeia, como descrita, não chegou aos usuários que instalaram AutoGen Studio pelo PyPI. A lição maior é arquitetural.

Agente que navega na web não deve ter caminho livre até API local, WebSocket local ou servidor MCP que execute ferramenta com privilégio demais. Rode protótipo em container, VM ou usuário separado. Coloque autenticação real em endpoints locais. Faça allowlist de comandos e servidores MCP. E trate `localhost` como uma conveniência de rede, não como certificado de bons antecedentes.

Fonte: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/06/18/autojack-single-page-rce-host-running-ai-agent/).

## Project Valhalla prepara value classes como preview do JDK 28

No lado Java, o Project Valhalla está mais perto de aparecer para desenvolvedores comuns pelo JEP 401, que define value classes e value objects como recurso preview mirado no JDK 28.

A ideia central é permitir classes sem identidade. Em Java tradicional, objeto costuma carregar identidade própria: duas referências podem apontar para o mesmo objeto, `==` pode perguntar sobre essa identidade, e algumas operações dependem dela. Só que muitos tipos pequenos usados como dados não precisam disso. Coordenada, valor monetário, par de inteiros, ponto geométrico: em vários casos, o que interessa é o valor, não a "personalidade" daquele objeto na memória.

Quando a JVM sabe que uma instância não tem identidade, ela pode organizar os dados de forma mais compacta. Isso reduz ponteiros, indireção e pressão de cache em cenários com muito dado pequeno. O ganho não cai automaticamente em todo programa Java, mas abre caminho para código com cara de objeto e custo mais próximo de dado denso.

O cuidado fica nos hábitos antigos. Código que sincroniza em boxed values, depende de igualdade por referência ou usa identidade como atalho precisa ser auditado. Também vale segurar a empolgação com duas promessas que ainda não chegam juntas: specialized generics e tipos value com restrição de `null` fazem parte da conversa maior, mas não viram benefício automático no primeiro preview.

Por enquanto, Valhalla é estudo sério para quem mexe com Java de longo prazo. Preview desligado por padrão é convite para testar, medir e entender. Produção continua pedindo calma, flag explícita e benchmark no próprio código.

Fontes: [OpenJDK / JEP 401](https://openjdk.org/jeps/401), [OpenJDK jdk-dev](https://mail.openjdk.org/archives/list/jdk-dev@openjdk.org/thread/AIA3O3LHFZ6T7TIPH7KZT4WS4B6U72U5/) e [JVM Weekly](https://www.jvm-weekly.com/p/project-valhalla-explained-how-a).

## Splunk CVE-2026-20253 entrou no KEV depois de exploração limitada

No dia 14, a gente falou que a [Splunk tinha corrigido a CVE-2026-20253](/2026/relatorio-acusa-ad-blockers-de-roubar-prompts-tensorzero-e-splunk-pedem-atencao/). Agora o fato novo é pior: em 18 de junho, a própria Splunk atualizou o aviso dizendo que o PSIRT viu exploração limitada, e a CISA colocou a falha no catálogo KEV.

A vulnerabilidade fica no Splunk Enterprise, nas linhas 10.2.0 a 10.2.3 e 10.0.0 a 10.0.6. O problema é uma ausência de autenticação em um endpoint do serviço sidecar PostgreSQL. Segundo o aviso SVD-2026-0603, um atacante sem autenticação poderia criar ou truncar arquivos arbitrários. A pontuação CVSS é 9.8, o tipo de número que raramente melhora o humor de quem está de plantão.

As versões corrigidas são 10.4.0, 10.2.4, 10.0.7 ou mais novas dentro da linha aplicável. Existe mitigação: desabilitar o sidecar PostgreSQL. Só que essa troca pode quebrar Edge Processor, OpAmp ou pipelines SPL2, então não é botão para apertar no escuro.

A CISA deu prazo de 21 de junho de 2026 para agências federais americanas resolverem o item. Mesmo fora desse escopo, a mensagem operacional é curta: inventarie versão, confirme se o sidecar está habilitado, atualize quando puder e, se for mitigar, teste o impacto nos fluxos que dependem dele. Não há detalhe público suficiente para inventar escala de ataque ou ator envolvido. Já tem urgência confirmada sem enfeitar.

Fontes: [Splunk Advisory SVD-2026-0603](https://advisory.splunk.com/advisories/SVD-2026-0603), [CISA](https://www.cisa.gov/news-events/alerts/2026/06/18/cisa-adds-one-known-exploited-vulnerability-catalog) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/cisa-splunk-enterprise-flaw-actively-exploited-patch-by-sunday/).

## Destaques rápidos de hoje

- **GLM-5.2 ganhou um caminho local em GGUF para `llama.cpp`.** No dia 17, o [GLM-5.2 apareceu por aqui como modelo aberto e pesado](/2026/mastra-levou-o-risco-para-o-npm-install-e-glm-5-2-abriu-pesos-no-hugging-face/). A novidade agora é a trilha da Unsloth no Hugging Face: o modelo completo fica perto de 1,51 TB; uma build 2-bit aparece na casa de 238 GB para máquinas com 256 GB de memória; e a fonte fala em cerca de 82% de retenção de acurácia. É teste sério para hardware grande. Ainda não é história de laptop comum. Fontes: [Hugging Face / Unsloth](https://huggingface.co/unsloth/GLM-5.2-GGUF), [Unsloth Docs](https://unsloth.ai/docs/models/glm-5.2) e [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1u9vfhf/glm52_can_now_run_locally_in_llamacpp_and_unsloth/).

- **CISA transformou FortiBleed em checklist de resposta.** Ontem a gente [explicou a lista com credenciais de VPN Fortinet em texto puro](/2026/fortibleed-expos-senha-de-vpn-de-73-mil-firewalls-fortinet/). Agora a CISA publicou orientação para casos associados a cerca de 74 mil dispositivos: encerrar sessões SSL VPN e de administração, resetar senhas, ativar MFA resistente a phishing, revisar logs, restringir interfaces de gerenciamento e remover contas não autorizadas. A origem exata dos dados ainda não está fechada publicamente, e isso não confirma zero-day novo na Fortinet. Fontes: [CISA](https://www.cisa.gov/news-events/alerts/2026/06/18/cisa-urges-hardening-fortinet-devices-after-reports-credential-exposure) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/cisa-warns-fortinet-users-to-secure-devices-after-fortibleed-leak/).

- **AMD GAIA 0.21.2 adicionou um agente nativo para bash.** O `gaia-bash` é um agente em C++ voltado a shell, com TUI interativa, CLI one-shot, pipe mode, servidor REST compatível com OpenAI e servidor MCP via stdio. Ele também expõe ferramentas para arquivo, Git e execução de comando. Parece útil para automação de terminal, desde que entre primeiro em staging, com revisão e política de comando; shell novo com autonomia demais costuma cobrar juros. Fontes: [GitHub / AMD GAIA](https://github.com/amd/gaia/releases/tag/v0.21.2) e [Phoronix](https://www.phoronix.com/news/AMD-GAIA-Bash-Coding-Agent).

- **Squidbleed acende alerta no parser de FTP do Squid Proxy.** A CVE-2026-47729 envolve um heap over-read no parser de listagem FTP do Squid, em um caminho antigo de compatibilidade. O risco depende do cenário: tráfego HTTPS via CONNECT fica opaco para o proxy, e o ataque passa por situações em que o proxy fala com servidor FTP controlado pelo atacante. Para quem roda Squid, vale acompanhar o fix, olhar o caminho do Squid v7.6 e desabilitar FTP quando ele não for necessário. Fonte: [Calif](https://blog.calif.io/p/squidbleed-cve-2026-47729).

## Acompanhamento de tendências do dia

Os itens de agente hoje apontam para duas camadas diferentes do mesmo problema. AutoJack é a camada de infraestrutura: navegador, porta local, WebSocket e ferramenta executando no host. Dois preprints olham para a outra camada, a conversa com o modelo quando alguém tenta empurrar o agente para fora do comportamento esperado.

Um deles propõe Contextual Misdirection via Progressive Engagement, ou CMPE. A tese dos autores é que recusas previsíveis ajudam ataques automatizados, porque dão feedback para ferramentas como PAIR e GPTFuzz ajustarem a próxima tentativa. Em vez de devolver sempre um bloqueio óbvio, a defesa detecta e responde com conteúdo seguro, mas pouco útil para o atacante. Nos benchmarks dos autores, isso reduziu em até duas ordens de magnitude os limites superiores estimados de sucesso de ataque. É resultado de paper, não escudo pronto para instalar sexta-feira à tarde.

O outro trabalho, NRT-Bench, simula agentes atuando como operadores em sala de controle nuclear sob pressão adversarial de múltiplos turnos. O número chama atenção: os autores reportam perda de função crítica de segurança em 8,7% a 12,1% das sessões de ataque, dependendo do modelo. A leitura saudável é tratar isso como benchmark de pesquisa em ambiente simulado. Nada de transformar preprint em manchete apocalíptica.

Para times construindo agente com ferramenta, o caminho é menos dramático e mais trabalhoso: teste por modelo, registre ataques reproduzíveis, acompanhe telemetria e não trate guardrail como tinta impermeável. Segurança de agente está ficando parecida com segurança de software mesmo. Dá trabalho, muda por versão e fica melhor quando alguém consegue repetir o teste.

Fontes: [arXiv / CMPE](https://arxiv.org/abs/2606.20470) e [arXiv / NRT-Bench](https://arxiv.org/abs/2606.20408).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-06-19
source_mode: briefing
generated_at: 2026-06-19T08:46:40-03:00
source_urls:
  - https://www.microsoft.com/en-us/security/blog/2026/06/18/autojack-single-page-rce-host-running-ai-agent/
  - https://openjdk.org/jeps/401
  - https://mail.openjdk.org/archives/list/jdk-dev@openjdk.org/thread/AIA3O3LHFZ6T7TIPH7KZT4WS4B6U72U5/
  - https://www.jvm-weekly.com/p/project-valhalla-explained-how-a
  - https://advisory.splunk.com/advisories/SVD-2026-0603
  - https://www.cisa.gov/news-events/alerts/2026/06/18/cisa-adds-one-known-exploited-vulnerability-catalog
  - https://www.bleepingcomputer.com/news/security/cisa-splunk-enterprise-flaw-actively-exploited-patch-by-sunday/
  - https://huggingface.co/unsloth/GLM-5.2-GGUF
  - https://unsloth.ai/docs/models/glm-5.2
  - https://www.reddit.com/r/LocalLLaMA/comments/1u9vfhf/glm52_can_now_run_locally_in_llamacpp_and_unsloth/
  - https://www.cisa.gov/news-events/alerts/2026/06/18/cisa-urges-hardening-fortinet-devices-after-reports-credential-exposure
  - https://www.bleepingcomputer.com/news/security/cisa-warns-fortinet-users-to-secure-devices-after-fortibleed-leak/
  - https://github.com/amd/gaia/releases/tag/v0.21.2
  - https://www.phoronix.com/news/AMD-GAIA-Bash-Coding-Agent
  - https://blog.calif.io/p/squidbleed-cve-2026-47729
  - https://arxiv.org/abs/2606.20470
  - https://arxiv.org/abs/2606.20408
omitted_briefing_items:
  - Monitoring the Claude execution layer with OpenTelemetry: official docs validate the telemetry angle, but the day was already agent-heavy.
  - Intel TDX runtime module updates: useful Linux/confidential-compute item, lower urgency than selected stories.
  - Azure Functions serverless agents runtime: product announcement crowded out by stronger agent-security and infrastructure items.
  - GitLab 19.0 agentic AI updates: potentially useful later, weaker than AutoJack, Splunk and Valhalla today.
  - AWS Bedrock Managed Knowledge Base: cloud product update with weaker public urgency for this post.
  - Squidbleed Reddit duplicate: original Calif source used instead.
  - SecurityWeek FortiBleed credential report: same incident as June 18 lead; CISA alert used as the clean follow-up.
  - LLM Agent Safety in Nuclear Power Plant Control Rooms: merged into the agent-safety trend instead of standalone quick hit.
-->
