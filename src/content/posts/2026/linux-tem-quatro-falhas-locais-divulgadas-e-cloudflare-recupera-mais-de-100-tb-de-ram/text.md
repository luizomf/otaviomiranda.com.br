---
title: 'Linux tem quatro falhas locais divulgadas, e Cloudflare recupera mais de 100 TB de RAM'
description: 'Kernel exige conferir patches da distribuição; Cloudflare encolhe o roteamento de cache. Postgres limita workers, CrowdSec detalha vazamento e ZCode põe o histórico Git na discussão.'
date: 2026-09-19T05:15:00-03:00
author: 'The Paper LLM'
cover: './images/linux-tem-quatro-falhas-locais-divulgadas-e-cloudflare-recupera-mais-de-100-tb-de-ram.jpg'
---

![Tux em placa metálica com aviso sobre quatro falhas locais no Linux.](./images/linux-tem-quatro-falhas-locais-divulgadas-e-cloudflare-recupera-mais-de-100-tb-de-ram.jpg)


## Quatro falhas no Linux podem levar um usuário local a root

Asim Manizada divulgou em 18 de setembro quatro falhas no kernel Linux, com demonstrações em que um usuário local chegou a root nos sistemas testados. As correções já haviam chegado ao kernel nas semanas anteriores. Se você administra máquinas compartilhadas ou hosts de contêineres, confira os patches da distribuição e o kernel que está rodando.

Três delas, DirtyAH6, TUNderflow e PPPoEject, têm caminhos de corrupção que dependem de namespaces de usuário e rede sem privilégios ou de permissões específicas. Os namespaces permitem criar ambientes isolados. Já a DiagSpill exige suporte a SCTP e ao componente de diagnóstico sctp_diag, sem aquela exigência de namespaces ou permissões. Por isso, desabilitar namespaces sem privilégios deixa caminhos descobertos. As demonstrações completas de root têm dependências adicionais.

Contêineres compartilham o kernel do host. O pesquisador relata a possibilidade de corromper esse kernel sob os pré-requisitos relevantes, mas não demonstrou fuga de contêiner nem estabeleceu exploração em ataques reais.

Na hora de conferir a correção, olhe os boletins da sua distribuição: ela pode aplicar o patch mantendo uma numeração anterior à versão corrigida do kernel original. Comparar só o número pode dar um susto desnecessário. Ou uma tranquilidade bem mal informada.

Fonte: [divulgação de Asim Manizada na lista oss-security](https://seclists.org/oss-sec/2026/q3/822).

## Cloudflare encolhe o mapa do cache e recupera mais de 100 TB de RAM

A Cloudflare relatou em 18 de setembro ter recuperado mais de 100 TB de RAM na frota ao encolher estruturas do Pingora Backend Router. Ele escolhe o servidor de destino usando um anel de hashes para distribuir requisições entre caches, com menos mudanças de destino quando servidores entram ou saem.

Cada ponto passou de oito para seis bytes, uma economia de 25% nessa estrutura. Só diminuir um campo deixava espaços de alinhamento no Rust. O tipo emagreceu; a estrutura continuou ocupando a mesma cadeira. Foi preciso mudar sua representação.

A equipe também reduziu em 90% a quantidade de hashes gerados por servidor, depois de estudar as colisões e o ganho cada vez menor na distribuição. Esse percentual mede a redução na contagem de hashes; os mais de 100 TB são a economia total medida pela empresa.

Só que trocar esse mapa poderia mandar requisições para caches ainda vazios e sobrecarregar a origem. Na migração, a Cloudflare manteve os dois anéis, selecionou requisições de forma consistente pelo hash e ampliou a mudança por datacenter. Acompanhou cache e origem, com a possibilidade de voltar atrás antes de remover o mapa antigo.

Fonte: [Cloudflare Engineering](https://blog.cloudflare.com/saving-100-tb-of-ram-with-math/).

## No Postgres, aumentar o limite de workers pode ficar só na configuração

Christophe Pettus mostrou em 18 de setembro por que aumentar o limite de processos auxiliares de manutenção pode não acelerar a criação de índices no PostgreSQL. O parâmetro `max_parallel_maintenance_workers` define um teto por comando. O banco também considera o tamanho da tabela, a memória e os workers disponíveis no conjunto compartilhado.

Nos exemplos com PostgreSQL 18.6, o cálculo normal exige 32 MB de `maintenance_work_mem` por participante, incluindo o processo líder. Os 64 MB padrão permitem apenas um worker, embora o teto padrão seja dois. Você autorizou mais gente; o orçamento só pagou uma cadeira extra. A opção `parallel_workers` da tabela pode contornar esse cálculo de memória. Já o VACUUM manual segue outras regras.

Num restore paralelo, cada sessão do `pg_restore` faz seus próprios pedidos. Dimensione memória e workers levando em conta os comandos concorrentes. Para ver quem realmente começou a trabalhar, observe `pg_stat_activity`, agrupando por `leader_pid`. A mensagem de depuração da criação do índice mostra quantos workers foram pedidos, não necessariamente quantos foram iniciados.

Fonte: [Christophe Pettus — The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-max_parallel_maintenance_workers/).

## CrowdSec liga cópia de repositórios ao acesso mantido de um ex-funcionário

A CrowdSec publicou em 18 de setembro a investigação de um vazamento de aproximadamente 170 repositórios privados do GitHub. A cópia aconteceu em **22 de maio**; a empresa soube da publicação do material em 16 de setembro. O acesso era de um ex-funcionário e tinha sido mantido para ele terminar trabalhos pendentes. A remoção veio em 25 de maio.

Segundo a CrowdSec, o ataque à cadeia de pacotes do TanStack comprometeu esse ex-funcionário e levou ao roubo de um token OAuth, que permite autorizar operações Git sem outro login interativo. A empresa diz que o GitHub ajudou a rastrear o ciclo de vida do token.

A investigação da própria CrowdSec não encontrou alteração de código nem comprometimento de CI ou infraestrutura. Houve exposição de e-mails de 83 usuários, além de nomes, e-mails e contexto de investimento de 51 potenciais investidores.

Se você mantém exceções no desligamento de alguém, dê prazo e responsável a elas. E, ao responder a um pacote comprometido, revogue também os tokens expostos. Remover o pacote deixa a credencial roubada funcionando.

Fonte: [relatório de incidente da CrowdSec](https://www.crowdsec.net/blog/tanstack-supply-chain-attack-analysis).

## Pesquisador encontra histórico Git em snapshot do ZCode

Ferstar publicou em 18 de setembro uma investigação do ZCode, agente de programação para desktop da Zhipu. Ao examinar artefatos locais e o cliente, encontrou um snapshot criptografado do projeto cujo manifesto incluía objetos do Git, cache de LFS e reflogs. O histórico pode guardar conteúdo que já sumiu dos arquivos atuais.

O pesquisador também identificou um fluxo de envio em segundo plano que negocia credenciais e manda o pacote para armazenamento na nuvem. Segundo sua análise, as opções Optimize Experience e Repo Snapshot Indexing controlavam, respectivamente, a autorização de treinamento e a indexação no servidor. Aquele fluxo de captura e envio continuava funcionando independentemente delas.

O arquivo destacado estava pendente, com tentativas de upload falhas. Isso não comprova transferência bem-sucedida nem uso para treinamento. O relato se limita à inspeção do pesquisador, sem reprodução independente ou resposta do fornecedor verificada.

Antes de abrir um repositório privado ali, confira o alcance da captura. O conteúdo visível no editor pode ser só uma parte da bagagem.

Fonte: [investigação de Ferstar](https://blog.ferstar.org/en/posts/zcode-silent-workspace-snapshot-upload/).

## Destaques rápidos para hoje.

- **Claude Code 2.1.277 passa a ler AGENTS.md quando não há CLAUDE.md no projeto.** Dá para compartilhar instruções entre agentes sem duplicar o arquivo. A seleção fica em Project instructions, no `/config`. O recurso ainda não está disponível em Bedrock, Vertex ou Foundry. Fonte: [changelog oficial](https://code.claude.com/docs/en/changelog).

- **A CISA incluiu três outras falhas do Linux no catálogo de vulnerabilidades exploradas em 18 de setembro:** CVE-2025-39964, CVE-2026-53266 e CVE-2025-39682. São diferentes das quatro divulgadas pelo pesquisador acima. Para estas três, há evidência de exploração: priorize as correções indicadas pelos fornecedores. Fonte: [catálogo KEV da CISA](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json).

- **Warpgate 0.29.0 adiciona aprovação administrativa de sessões e política global de cadastro de segundo fator.** O gateway de acesso à infraestrutura amplia os controles após o [WebSSH já coberto](/2026/codex-aws-agente-infraestrutura/). A política permite exceções para SSO, e o upgrade traz mudanças incompatíveis na API. Confira suas automações. Fonte: [Warpgate](https://github.com/warp-tech/warpgate/releases/tag/v0.29.0).

- **Google abriu uma prévia de busca por relevância BM25 no AlloyDB e Cloud SQL para PostgreSQL 17 ou superior.** A extensão `pg_textsearch` permite testar busca por palavras junto da vetorial no banco. É uma prévia distinta do [TIN da PlanetScale já coberto](/2026/cisco-corrige-invasao-sem-login-no-ise-e-github-leva-o-motor-do-copilot-para-rust/). Fonte: [Google Cloud](https://cloud.google.com/blog/products/databases/native-bm25-search-in-alloydb-and-cloud-sql/).

- **uv 0.12.17 corrige a seleção de pacotes incompatíveis com o macOS mínimo configurado.** Depois dos [hashes da 0.12.16](/2026/uber-freia-tempestades-de-retries-e-dokploy-corrige-backup-que-pode-dar-root/), o gerenciador Python impede que `required-environments` escolha versões cujos pacotes pré-compilados exijam um macOS mais novo. Atualize e confira a resolução para seu alvo de implantação. Fonte: [Astral](https://github.com/astral-sh/uv/releases/tag/0.12.17).

- **Comparações entre Wild e Mold mudam com o ambiente do build**, mostrou David Lattimore, desenvolvedor do Wild. Os linkers juntam objetos compilados no executável. Sistema de arquivos, reaproveitamento da saída e criação de processos alteraram os resultados, sem um vencedor universal. Meça nas condições do seu pipeline. Fonte: [análise de Lattimore](https://davidlattimore.github.io/posts/2026/09/18/benchmarking-wild-vs-mold.html).

- **Google descreveu uma revisão de segurança que combina agentes com verificações programáticas do código.** A triagem percorre a estrutura e as chamadas para conferir se o caminho suspeito é alcançável. As correções propostas passam por humanos. É um jeito concreto de validar achados da IA antes de aceitá-los. Fonte: [Google Cloud](https://cloud.google.com/blog/topics/systems/using-ai-agents-to-secure-google-infrastructure/).

- **NVIDIA detalhou como o AIPerf separa geração de carga e processamento de resultados em processos diferentes.** A ferramenta mede inferência de modelos e permite configurar padrões de chegada das requisições. Ao testar seu servidor, confira também se o cliente de carga virou o gargalo da medição. Fonte: [NVIDIA](https://developer.nvidia.com/blog/benchmarking-llm-inference-at-scale-with-aiperf/).

- **mcp-handler 2.2.0 ganhou integração experimental com WebMCP.** Um script na página expõe ferramentas MCP selecionadas explicitamente a agentes de navegador, reaproveitando as ferramentas do servidor. As chamadas usam a autoridade do usuário conectado. O padrão web ainda é proposto; confira a compatibilidade antes de planejar a integração. Fonte: [Vercel](https://vercel.com/changelog/webmcp-mcp-handler).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27702
source_urls:
  - https://seclists.org/oss-sec/2026/q3/822
  - https://blog.cloudflare.com/saving-100-tb-of-ram-with-math/
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_parallel_maintenance_workers/
  - https://www.crowdsec.net/blog/tanstack-supply-chain-attack-analysis
  - https://blog.ferstar.org/en/posts/zcode-silent-workspace-snapshot-upload/
  - https://code.claude.com/docs/en/changelog
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://github.com/warp-tech/warpgate/releases/tag/v0.29.0
  - https://cloud.google.com/blog/products/databases/native-bm25-search-in-alloydb-and-cloud-sql/
  - https://github.com/astral-sh/uv/releases/tag/0.12.17
  - https://davidlattimore.github.io/posts/2026/09/18/benchmarking-wild-vs-mold.html
  - https://cloud.google.com/blog/topics/systems/using-ai-agents-to-secure-google-infrastructure/
  - https://developer.nvidia.com/blog/benchmarking-llm-inference-at-scale-with-aiperf/
  - https://vercel.com/changelog/webmcp-mcp-handler
-->
