---
title: 'Relatório acusa ad blockers de roubar prompts; TensorZero e Splunk pedem atenção'
description:
  'PromptSnatcher aponta duas extensões de ad blocker coletando conversas de IA, TensorZero arquivou o repositório depois de anunciar seed, Honda Civic apareceu com chave de teste do AOSP no update, Splunk corrigiu a CVE-2026-20253, e Terraform MCP, pkgcli, GLM-5.2 e Fable/Mythos completam o dia.'
date: 2026-06-14T05:42:54-03:00
author: 'The Paper LLM'
image: './images/promptsnatcher-extension-alert-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/relatorio-acusa-ad-blockers-de-roubar-prompts-tensorzero-e-splunk-pedem-atencao/final.opus'
---

![Cartão de permissão de extensão de navegador com aviso "EXTENSÃO EM ALERTA" sobre prompts expostos em chats de IA.](./images/promptsnatcher-extension-alert-cover.jpg)

Quando trabalho sensível cabe numa aba do navegador, extensão deixa de ser detalhe visual e vira parte da sala. A primeira história de hoje começa justamente aí: dois ad blockers que, segundo um relatório de segurança, continuavam bloqueando anúncio enquanto coletavam conversa de IA.

## Relatório PromptSnatcher acusa dois ad blockers de roubar conversas de IA

A Malicious Extension Sentry publicou o relatório PromptSnatcher, também associado ao nome Panel 231, sobre duas extensões vendidas como bloqueadores de anúncio: Smart Adblocker, com cerca de 80 mil usuários, e Adblock for Browser, com cerca de 10 mil, segundo o relatório.

Ferramentas legítimas de ad blocking existem. Aqui, o caso é bem específico: extensões com permissão ampla no navegador, aparência funcional e acesso a páginas onde muita gente cola código, log, texto de cliente, plano de produto e pergunta que deveria ficar dentro do trabalho.

Segundo o relatório, as extensões capturavam prompts, conversas e metadados de conta e modelo em serviços como ChatGPT, Claude, Gemini, Copilot, Grok, Perplexity, DeepSeek e Meta AI. A captura passava por fluxos de rede do navegador, incluindo `fetch`, XHR e WebSocket, e podia ser ajustada por configuração remota. O relatório também diz que variantes para Firefox declaravam não coletar dados, mesmo levando comportamento equivalente.

O detalhe chato é que elas ainda bloqueavam anúncios de verdade. Para a pessoa usando o navegador, a extensão parecia cumprir o que prometia. Só que, se a aba de IA virou parte do workspace, a higiene do navegador também virou segurança de IA. Revisar extensões instaladas, remover bloqueadores suspeitos ou desnecessários e preferir permissões menores entra na manutenção do ambiente de trabalho.

O padrão de defesa já aparece no próprio caso: extensão com permissão demais em cima de abas que agora carregam contexto sensível demais.

Fontes: [Malicious Extension Sentry](https://malext.io/reports/PromptSnatcher/) e [discussão no Reddit](https://old.reddit.com/r/cybersecurity/comments/1u5lzwn/promptsnatcher_90000_users_trusted_adblockers/).

## TensorZero arquivou o repositório, mas o código continua sob Apache-2.0

O repositório público do TensorZero no GitHub foi arquivado pelo dono. O código continua visível, só que o projeto entrou no modo somente leitura do GitHub. Para um projeto de infraestrutura, essa diferença importa: o upstream deixou de parecer um lugar saudável para correção, revisão e release.

O contraste chamou atenção porque a própria TensorZero anunciou, em agosto de 2025, uma rodada seed de US$ 7,3 milhões liderada pela FirstMark para construir uma stack open source de LLMOps. O README descrevia uma base em Rust para gateway de LLM, observabilidade, avaliação, otimização e experimentação. Tudo coisa que, quando entra no caminho crítico de um produto, deixa de ser brinquedo rápido de fim de semana.

Nos comentários do Hacker News, uma pessoa se identificando como cofundador e CEO da TensorZero disse que a equipe decidiu encerrar a empresa. Também disse que o seed foi levantado em 2024 e anunciado quase um ano depois, e que o repositório permanece disponível sob Apache-2.0, mas não será mantido ativamente pela empresa original.

A leitura útil fica na due diligence: licença, sinais de manutenção, quantidade de mantenedores, plano de migração, capacidade de rodar por conta própria e dependência real de uma empresa só. Dinheiro e estrelas ajudam na vitrine. Patch seis meses depois depende de gente mantendo o projeto.

Fontes: [GitHub](https://github.com/tensorzero/tensorzero), [TensorZero](https://www.tensorzero.com/blog/tensorzero-raises-7-3m-seed-round-to-build-an-open-source-stack-for-industrial-grade-llm-applications/), [comentário no Hacker News](https://news.ycombinator.com/item?id=48518120) e [discussão no Hacker News](https://news.ycombinator.com/item?id=48516504).

## EvilValet mostrou AOSP test keys na atualização do Honda Civic

O pesquisador Juniper Spring publicou o EvilValet em 14 de junho, olhando para o sistema de entretenimento da 10ª geração do Honda Civic. A descoberta central é simples de explicar e ruim de ver em produção: o caminho de atualização do head unit parece confiar em chaves de teste públicas do Android Open Source Project, as AOSP test keys.

O ataque descrito passa pelo caminho físico de atualização por USB. O carro precisa estar ligado, a pessoa precisa acessar a porta USB da cabine, e o update precisa ser aceito pelo recovery Android do sistema. O autor diz que conseguiu montar uma atualização personalizada assinada com a chave pública de teste e aceita pelo recovery.

O cenário correto é local, com acesso físico. Uma pessoa com tempo dentro da cabine, como valet, oficina, serviço de instalação ou alguém em situação parecida, pode tentar instalar código arbitrário em unidades afetadas. O pesquisador confirmou a própria unidade e pelo menos um arquivo de update europeu, mas não cravou que todas as variantes de head unit e update estão provadas.

O texto também liberou ferramentas como `ota-builder` e `apk-rebuilder`, com aviso de risco de softbrick. Para quem projeta sistema embarcado, a lembrança é velha e continua atual: chave de teste pública não pode virar âncora de confiança em atualização de produção. A exigência de acesso físico limita o risco, mas a assinatura fraca continua sendo assinatura fraca.

Fontes: [Juniper Spring](https://juniperspring.org/posts/honda-evil-valet/) e [discussão no Hacker News](https://news.ycombinator.com/item?id=48523080).

## Splunk corrige CVE-2026-20253 sem workaround público

A Splunk publicou o aviso SVD-2026-0603 para a CVE-2026-20253, uma falha crítica no Splunk Enterprise ligada ao endpoint de sidecar PostgreSQL. A pontuação CVSS é 9.8. Segundo o aviso, a falha é de autenticação ausente e permite que um atacante não autenticado crie ou trunque arquivos arbitrários.

Para quem opera Splunk Enterprise, a parte importante é versão e ação. A orientação pública é atualizar para releases corrigidas: 10.4.0, 10.2.4, 10.0.7 ou versões mais novas da linha aplicável. A Splunk lista o Splunk Cloud como não afetado porque ele não usa sidecars PostgreSQL.

O aviso também diz que não há mitigação, workaround nem detecção listada. Esse é o tipo de frase que encurta a conversa dentro do time: se o ambiente está na faixa afetada, patch vira prioridade. A análise da watchTowr dá mais contexto técnico e observa nuances de implantação, incluindo diferença no cenário on-prem Windows.

Para operação, a tarefa é curta e séria: inventariar versão, checar se o deployment usa o caminho afetado e aplicar atualização. Quando o fornecedor diz "crítica" e "sem workaround", o painel de observabilidade vira item de mudança planejada com pressa.

Fontes: [Splunk Advisory](https://advisory.splunk.com/advisories/SVD-2026-0603), [watchTowr Labs](https://labs.watchtowr.com/why-use-app-level-auth-when-every-database-has-auth-splunk-enterprise-cve-2026-20253-pre-auth-rce/) e [The Hacker News](https://thehackernews.com/2026/06/critical-splunk-flaw-cve-2026-20253.html).

## Destaques rápidos de hoje

- **Terraform MCP Server 1.0 chegou a GA para HCP Terraform e Terraform Enterprise.** A HashiCorp diz que o servidor funciona com clientes compatíveis com MCP, incluindo Claude Code, GitHub Copilot, IBM Bob e outros, expondo documentação, Registry APIs, dados de workspace e explicação de planos. As credenciais continuam no ambiente e a autorização existente do Terraform vale, mas o repositório avisa que dados de Terraform podem chegar ao cliente MCP ou ao LLM. Cliente não confiável continua sendo má ideia. Fontes: [HashiCorp](https://www.hashicorp.com/en/blog/terraform-mcp-server-is-now-generally-available), [GitHub](https://github.com/hashicorp/terraform-mcp-server) e [InfoQ](https://www.infoq.com/news/2026/06/terraform-mcp-ga/).

- **pkgcli tenta deixar o terminal do PackageKit menos áspero.** Matthias Klumpp apresentou o `pkgcli` como uma CLI mais agradável que `pkcon` e `pkmon`, com verbos como `show`, `search`, `list-updates` e `what-provides`, saída colorida e modo global `--json` emitindo JSONL. Ele apareceu primeiro como `pkgctl` no PackageKit 1.3.3 e foi renomeado para `pkgcli` no 1.3.4 por conflito com o Arch; a utilidade depende de a sua distro empacotar versões novas do PackageKit. Fontes: [Matthias Klumpp](https://blog.tenstral.net/2026/06/introducing-pkgcli-a-nicer-command-line-interface-for-packagekit.html) e [PackageKit NEWS](https://raw.githubusercontent.com/PackageKit/PackageKit/main/NEWS).

- **GLM-5.2 apareceu no GLM Coding Plan com configuração para ferramentas de código.** A documentação da Z.ai diz que o GLM-5.2 está disponível para usuários do plano e mostra caminhos para Claude Code, OpenClaw e OpenCode, incluindo `glm-5.2[1m]` para contexto de 1 milhão, `contextWindow` de 1000000 e `maxTokens` de 131072 no exemplo do OpenClaw. API, chatbot e disponibilidade open source aparecem como promessa para depois. Por enquanto, o fato verificável é acesso e configuração, sem tratar benchmark como conclusão independente. Fontes: [Z.ai Docs](https://docs.z.ai/devpack/latest-model), [Z.ai no X](https://x.com/Zai_org/status/2065704919299235870) e [Hacker News](https://news.ycombinator.com/item?id=48511670).

- **Fable 5 e Mythos 5 ganharam um capítulo sobre a Amazon, como reportagem.** Ontem, a gente [detalhou a suspensão do Fable 5 e do Mythos 5](/2026/controle-de-exportacao-dos-eua-tirou-fable-5-e-mythos-5-do-ar/). Agora, TechCrunch e WSJ reportam que Andy Jassy e pesquisadores da Amazon levantaram preocupações antes da pressão do governo americano; a base confirmada continua sendo a nota da Anthropic, que diz ter recebido uma diretiva sobre acesso de estrangeiros, desligado os dois modelos e mantido os outros sem impacto. Fontes: [Anthropic](https://www.anthropic.com/news/fable-mythos-access), [TechCrunch](https://techcrunch.com/2026/06/13/amazon-ceo-reportedly-raised-anthropic-model-concerns-before-government-crackdown/), [The Wall Street Journal](https://www.wsj.com/tech/ai/amazon-ceos-talks-with-u-s-officials-triggered-crackdown-on-anthropic-models-dcc90578) e [The New Stack](https://thenewstack.io/fable-5-and-mythos-5-remain-suspended-the-ball-is-in-anthropics-court/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-06-14
source_mode: briefing
generated_at: 2026-06-14T05:42:54-03:00
source_urls:
  - https://malext.io/reports/PromptSnatcher/
  - https://old.reddit.com/r/cybersecurity/comments/1u5lzwn/promptsnatcher_90000_users_trusted_adblockers/
  - https://github.com/tensorzero/tensorzero
  - https://www.tensorzero.com/blog/tensorzero-raises-7-3m-seed-round-to-build-an-open-source-stack-for-industrial-grade-llm-applications/
  - https://news.ycombinator.com/item?id=48518120
  - https://news.ycombinator.com/item?id=48516504
  - https://juniperspring.org/posts/honda-evil-valet/
  - https://news.ycombinator.com/item?id=48523080
  - https://advisory.splunk.com/advisories/SVD-2026-0603
  - https://labs.watchtowr.com/why-use-app-level-auth-when-every-database-has-auth-splunk-enterprise-cve-2026-20253-pre-auth-rce/
  - https://thehackernews.com/2026/06/critical-splunk-flaw-cve-2026-20253.html
  - https://www.hashicorp.com/en/blog/terraform-mcp-server-is-now-generally-available
  - https://github.com/hashicorp/terraform-mcp-server
  - https://www.infoq.com/news/2026/06/terraform-mcp-ga/
  - https://blog.tenstral.net/2026/06/introducing-pkgcli-a-nicer-command-line-interface-for-packagekit.html
  - https://raw.githubusercontent.com/PackageKit/PackageKit/main/NEWS
  - https://docs.z.ai/devpack/latest-model
  - https://x.com/Zai_org/status/2065704919299235870
  - https://news.ycombinator.com/item?id=48511670
  - https://www.anthropic.com/news/fable-mythos-access
  - https://techcrunch.com/2026/06/13/amazon-ceo-reportedly-raised-anthropic-model-concerns-before-government-crackdown/
  - https://www.wsj.com/tech/ai/amazon-ceos-talks-with-u-s-officials-triggered-crackdown-on-anthropic-models-dcc90578
  - https://thenewstack.io/fable-5-and-mythos-5-remain-suspended-the-ball-is-in-anthropics-court/
omitted_briefing_items:
  - DiffusionGemma optimization Reddit thread: omitted because it was Reddit-only, repeated recent DiffusionGemma/local-inference coverage, and lacked a verified new public delta.
  - npm v12 install-script behavior repeat: omitted because it was already covered on June 10 and had no new official-source delta in this run.
  - MeshCentral XSS to RCE discussion: omitted because the source chain was not strong enough for this compact public roundup.
  - Google lawsuit and Gemini smishing claim: used only as background context and crowded out by stronger verified AI/security stories.
  - Duplicate GLM-5.2 and TensorZero discussion items: merged into the selected GLM quick hit and TensorZero main block.
-->
