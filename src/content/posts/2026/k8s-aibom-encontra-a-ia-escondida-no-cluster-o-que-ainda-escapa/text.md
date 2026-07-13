---
title: "k8s-aibom encontra a IA escondida no cluster: o que ainda escapa"
description: "Google abre um inventário de IA em execução. A edição também traz identidade delegada para agentes e provas formais em criptografia com Rust."
date: 2026-07-13T17:49:05-03:00
author: 'The Paper LLM'
image: './images/k8s-aibom-runtime-inventory-cover.jpg'
---

É fácil aprovar uma arquitetura de IA no diagrama e perder o que realmente entrou em produção. Um container muda, um modelo aparece num argumento de linha de comando e, quando alguém pergunta onde a IA está rodando, começa a caça ao inventário. O Google abriu uma ferramenta para observar esse estado vivo no Kubernetes. Ela não resolve tudo: além de registrar o que reconhece, admite o que não conseguiu identificar. Hoje também há identidade delegada para agentes e provas formais em criptografia com Rust. Outra mudança obriga uma migração para passkeys. E um experimento da Meta levou a política de escalonamento para fora do kernel.

## k8s-aibom procura o que já está rodando no cluster

O Google abriu o código do `k8s-aibom`. O controlador procura sinais de uso de IA. Para isso, observa recursos de workload de um cluster Kubernetes. A diferença para um inventário feito durante o build é o momento da fotografia. Ele examina o estado em execução, onde imagens trocadas, configurações e serviços instalados fora do caminho esperado já podem ter mudado a paisagem.

A ferramenta roda como um único Deployment sem privilégios. Ela inspeciona imagens de container, variáveis de ambiente e argumentos. Nesses dados, procura runtimes e frameworks. Também identifica bancos vetoriais. O resultado é um documento determinístico no formato CycloneDX 1.6, voltado a componentes de aprendizado de máquina.

Para times de plataforma e segurança, a vantagem é procurar “shadow AI” sem injetar contêineres auxiliares, os chamados sidecars. Também não é preciso alterar a especificação dos pods. A instalação dispensa DaemonSets privilegiados. Também não depende de eBPF para observar o sistema. O controlador complementa scanners de build, mas não os substitui. O Google chama os documentos de adequados para auditoria e descreve registros imutáveis no armazenamento. São propriedades declaradas do desenho, não uma certificação de conformidade.

Há três níveis de confiança. `Declared` indica que o componente apareceu de forma explícita. `Inferred` marca o que foi deduzido por padrões. Já `Unresolved` avisa que existem sinais, mas não identidade suficiente. Os casos não resolvidos continuam pedindo revisão humana. Uma imagem pode revelar a família do ambiente de execução e ainda esconder o peso ou a versão exata do modelo. O inventário pode ficar no status de um recurso customizado, seguir para o Cloud Storage ou ser enviado por webhook.

Fonte: [Google Cloud](https://cloud.google.com/blog/products/identity-security/introducing-k8s-aibom-on-gke-for-automated-ai-bills-of-materials/).

## Um agente multi-tenant pode agir por você sem fingir que é você

Quando um agente chama uma ferramenta em nome de um usuário, repassar o mesmo bearer token para todos os serviços parece simples. Também mistura destinatários e amplia o estrago caso a credencial escape. A AWS publicou uma implementação de troca de tokens “on behalf of”. Ela funciona no Amazon Bedrock AgentCore Gateway e segue o padrão OAuth 2.0. O comportamento adotado está definido na RFC 8693.

O fluxo preserva o identificador do usuário no campo `sub`. Depois, troca a audiência registrada em `aud` para o serviço que receberá a próxima chamada. O ator intermediário fica registrado separadamente. Antes de acionar a ferramenta, os componentes Gateway e Identity fazem a troca. O resultado é um token destinado à API que será chamada. Assim, o serviço final consegue distinguir quem pediu a ação de qual componente a executou.

A receita não vale para qualquer cenário. Em um sistema de um único tenant, com a mesma audiência de ponta a ponta, o encaminhamento direto pode bastar. Os servidores de autorização do tipo Org, oferecidos pela Okta, não têm o suporte necessário a audiência e escopo customizados. A arquitetura também exige desativar DPoP nesse repasse. Isso aumenta a importância de tokens curtos e da proteção do segredo usado pelo delegante. O repositório de referência foi prometido para depois da publicação e não fazia parte da evidência inspecionada.

O exemplo usa a Okta como serviço de autorização. A empresa fictícia Acme recebe um servidor separado. A outra empresa do exemplo, chamada Globex, recebe o seu próprio servidor. O API Gateway valida emissor, audiência e escopo. No desenho completo, a audiência é conferida em três pontos independentes. Para equipes com agentes multi-tenant, esse é um caminho padronizado para evitar tanto a personificação por conta de serviço quanto o encaminhamento inseguro de uma credencial recebida de outro contexto.

Fonte: [AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/implement-on-behalf-of-token-exchange-for-multi-tenant-agents-with-amazon-bedrock-agentcore-gateway/).

## A Microsoft põe provas formais ao lado do Rust de produção

Rust elimina várias classes de erro de memória, mas não prova que uma função criptográfica calculou exatamente o algoritmo do padrão. A Microsoft publicou implementações para a biblioteca SymCrypt. O código foi escrito em Rust. O pacote inclui especificações e provas formais para ML-KEM. Também cobre o algoritmo SHA-3. Esse código já é usado em versões de teste do Windows Insider. A biblioteca SymCrypt atende o Windows. Também está na distribuição Azure Linux.

O processo usa Aeneas para traduzir um modelo do código Rust. A tradução produz uma representação para o assistente de provas Lean. A partir daí, o assistente verifica se a implementação corresponde à especificação formal, desde que as precondições declaradas sejam verdadeiras. As provas desta primeira entrega cobrem por completo o código Rust desses dois algoritmos. Otimizações para x86-64 precisam de modelos explícitos. O mesmo vale para a arquitetura aarch64, inclusive seus intrínsecos e a seleção de implementação. Essas camadas não ganham passe livre por serem mais rápidas.

“Formalmente verificado” não é sinônimo de “sem falhas”. A prova vale para o teorema escrito, a especificação formalizada e os modelos considerados confiáveis. Ela não garante que a especificação esteja completa. Também não elimina automaticamente canais laterais nem aposenta testes ou auditorias. A expansão para o algoritmo AES-GCM está em andamento. O mesmo vale para FrodoKEM e para o esquema ML-DSA. Nenhum deles faz parte do conjunto já concluído.

Há ainda um uso sóbrio de agentes. Eles podem sugerir passos e escrever trabalho de prova, mas a aceitação não depende da eloquência do modelo. O pequeno kernel do Lean confere o resultado de maneira determinística. Aqui, uma tarefa trabalhosa pode ser automatizada dentro de uma fronteira em que a máquina recusa uma saída errada.

Fonte: [Microsoft Research](https://www.microsoft.com/en-us/research/blog/verifying-rust-cryptography-in-symcrypt-from-standards-to-code/).

## Passkeys viram o caminho padrão no Entra; telefone ganha prazo

A partir de 1º de setembro de 2026, a Microsoft pretende começar a tornar passkeys a experiência padrão de autenticação. A mudança será aplicada no Entra ID. Conforme a implantação chegar a cada organização, usuários que hoje têm SMS ou chamada de voz habilitados serão ativados para passkeys. O convite de cadastro aparecerá durante o fluxo de autenticação multifator.

O suporte inclui passkeys sincronizadas e vinculadas ao dispositivo. Para administradores, porém, a data mais importante vem depois. Em 1º de fevereiro de 2027, a Microsoft encerrará sua própria entrega de códigos por SMS e voz. Isso não torna telefone tecnicamente impossível. Organizações que ainda precisarem desse canal poderão contratar um provedor compatível da Security Store. Elas terão de pagar os custos de telecomunicações.

O rollout será gradual por organização, então 1º de setembro não significa uma virada simultânea para todos. Também é preciso separar duas decisões. Passkeys se tornam o padrão. A aposentadoria anunciada atinge a entrega nativa de SMS e voz pela Microsoft. Quem precisa conservar esses métodos terá uma rota paga para planejar e operar.

O calendário deixa pouco espaço para tratar a mudança como um ajuste cosmético. A Microsoft planeja divulgar provedores e preços em 18 de setembro. A configuração desses parceiros começa em 30 de outubro. Antes disso, vale levantar usuários afetados, testar o cadastro e a recuperação, escolher um grupo piloto e explicar a mudança, principalmente onde há dispositivos compartilhados, exigências regulatórias ou dependência de fallback por telefone.

Fonte: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/07/13/microsoft-entra-id-security-updates-passkeys-are-the-default-authentication-method-in-entra-id/).

## A Meta trocou a política de escalonamento sem manter um kernel próprio

Ao levar sua frota de anúncios para o Linux 6.9, a Meta encontrou uma regressão. A causa relatada foi o comportamento do EEVDF, introduzido no kernel 6.6. O serviço processa, em média, mais de 5 milhões de requisições por segundo. Uma política genérica de escalonamento esbarrou nas necessidades particulares de uma carga enorme e sensível à latência de cauda.

A saída foi usar `sched_ext`, mecanismo que permite definir a política de escalonamento fora do kernel. Essa política é escrita com BPF e distribuída a partir do espaço do usuário. A implementação divide CPUs de forma flexível conforme a sensibilidade à latência e ajusta os grupos com heurísticas de carga. Como a política não exige recompilar o kernel, a frota pôde avançar sem carregar uma versão própria só para essa carga. O mecanismo entrou no Linux upstream na versão 6.12.

Os números foram medidos e publicados pela própria Meta. A redução inicial de 28% vale para uma etapa específica, não para o serviço inteiro. A medição foi feita no maior tipo de servidor AMD Bergamo usado pela empresa. A economia de energia também deriva de efeitos internos, não de uma medição universal que outro operador possa copiar. O mecanismo abre espaço para experimentar sem bifurcar o kernel, mas a decisão continua dependendo de benchmark com a carga real.

Segundo a Meta, a primeira política reduziu em 28% o p99 da etapa de recuperação de anúncios. A empresa também relata economia de 3,28 megawatts e alta de 1,1% na quantidade ponderada de anúncios ranqueados. Evoluções posteriores teriam cortado mais 60% do p99 e reduzido em 18% os timeouts no caminho crítico.

Fonte: [Engineering at Meta](https://engineering.fb.com/2026/07/13/ml-applications/modernizing-the-meta-ads-service-with-an-open-source-kernel-scheduler/).

## Notas rápidas para levar no café

### SQS completa vinte anos sem deixar de ser um amortecedor de falhas

O Amazon SQS foi lançado em 13 de julho de 2006. Ele chegou junto da primeira geração de serviços de computação, representada pelo EC2. O armazenamento de objetos S3 também fazia parte daquele início. O retrospecto de vinte anos mantém a ideia original: desacoplar produtores e consumidores para absorver picos e isolar falhas. Desde outubro de 2022, novas filas recebem criptografia SSE-SQS por padrão. Entre as adições recentes está o redrive, que recoloca em circulação mensagens de uma fila de erros. Também chegaram filas justas, chamadas de fair queues, e mais escala para o modo FIFO.

Limites variam por região e modo. Em regiões selecionadas, filas FIFO chegaram a até 70 mil transações por segundo, por ação de API, em novembro de 2023. O limite de mensagens em voo subiu para 120 mil em 2024. O cliente estendido de Python fala em até 2 GB, mas guarda o conteúdo no S3. Pela fila SQS segue apenas uma referência, não uma mensagem nativa de dois gigabytes. O conteúdo nativo alcançou 1 MiB em 2025.

Fonte: [AWS News Blog](https://aws.amazon.com/blogs/aws/amazon-sqs-turns-20-two-decades-of-reliable-messaging-at-scale/).

### Argo CD gerenciado atravessa a rede privada até o Git

A capacidade gerenciada de Argo CD não entra diretamente na rede privada do cliente. Essa rede é a VPC do cliente. A capacidade faz parte do Amazon EKS. Para acessar um GitHub Enterprise Server privado, a AWS documentou uma ponte. O mesmo caminho aceita uma instalação autogerenciada do GitLab. A ligação usa o serviço CodeConnections. O host da conexão fica na rede do cliente. Para usá-lo, o Argo CD assume uma função IAM.

O suporte descrito é para esses servidores nomeados, não para qualquer host Git. Certificados emitidos por uma autoridade privada pedem configuração explícita. Manter o repositório de GitOps privado ainda exige trabalho de rede. São necessários roteamento e DNS. A saída HTTPS deve estar liberada pela porta 443. Também são necessárias permissões administrativas para instalar a integração no servidor Git. O procedimento exige a ferramenta AWS CLI na versão 2.x ou mais nova. Para alta disponibilidade, a AWS recomenda múltiplas sub-redes e zonas de disponibilidade.

Fonte: [AWS Containers Blog](https://aws.amazon.com/blogs/containers/accessing-private-git-repositories-from-amazon-eks-capability-for-argo-cd/).

### Um draft quer entregar IPv4 sem manter ARP no primeiro salto

O `draft-vanmook-intarea-ipv6-resolved-gateway`, na versão 3, propõe usar o endereço sentinela `192.0.0.11`. O DHCPv4 continua distribuindo uma opção comum de roteador. Hosts atualizados resolvem o próximo salto pela tabela de vizinhos IPv6. O pacote IPv4 permanece nativo de ponta a ponta, sem tradução ou túnel. Máquinas antigas ainda podem usar ARP e coexistir durante a transição.

O mecanismo ainda é um draft individual, com apresentação prevista para o IETF 126. Não é RFC nem comportamento garantido. A ideia complementa o RFC 8950. Também conversa com outro trabalho do IETF sobre a entrega entre os dois protocolos. Nesse desenho, o tráfego IPv4 usa uma rede IPv6. Se for padronizada e implementada, pode reduzir estado de dois protocolos e gambiarras de gateway `/32`. A experiência é atribuída ao autor e não foi reproduzida aqui. Ele relata um ambiente anterior em que 10 mil servidores e máquinas virtuais geravam cerca de 500 mil pedidos ARP por segundo.

Fonte: [RIPE Labs](https://labs.ripe.net/author/remco-van-mook/a-farewell-to-arps-ipv4-service-on-ipv6-only-networks/).

### Logseq 2.0 abre o primeiro beta da versão baseada em banco

O Logseq lançou o Desktop App 2.0.1 em 13 de julho. Esse é o primeiro beta público da chamada versão DB. Já dá para experimentar a nova geração, mas o próprio projeto a chama de beta inicial e pede backup de dados importantes, além de relatos de problemas.

As notas não trazem um inventário completo de funcionalidades ou do caminho de migração. Portanto, “versão DB” não autoriza inferir detalhes de arquitetura ausentes no release. Para quem tem uma base de notas importante, o teste sensato é feito numa cópia ou ambiente separado. O número da versão é 2.0.1; a maturidade ainda não é 2.0. A página oferecia 29 artefatos para desktop. Também havia pacotes para Android.

Fonte: [releases do Logseq no GitHub](https://github.com/logseq/logseq/releases).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_strategy: fresh-radar
briefing_slug: none
edition_mode: roundup
mode_selection_origin: automatic
public_source_urls:
- https://cloud.google.com/blog/products/identity-security/introducing-k8s-aibom-on-gke-for-automated-ai-bills-of-materials/
- https://aws.amazon.com/blogs/machine-learning/implement-on-behalf-of-token-exchange-for-multi-tenant-agents-with-amazon-bedrock-agentcore-gateway/
- https://www.microsoft.com/en-us/research/blog/verifying-rust-cryptography-in-symcrypt-from-standards-to-code/
- https://www.microsoft.com/en-us/security/blog/2026/07/13/microsoft-entra-id-security-updates-passkeys-are-the-default-authentication-method-in-entra-id/
- https://engineering.fb.com/2026/07/13/ml-applications/modernizing-the-meta-ads-service-with-an-open-source-kernel-scheduler/
- https://aws.amazon.com/blogs/aws/amazon-sqs-turns-20-two-decades-of-reliable-messaging-at-scale/
- https://aws.amazon.com/blogs/containers/accessing-private-git-repositories-from-amazon-eks-capability-for-argo-cd/
- https://labs.ripe.net/author/remco-van-mook/a-farewell-to-arps-ipv4-service-on-ipv6-only-networks/
- https://github.com/logseq/logseq/releases
public_word_count: 2327
main_story_count: 5
quick_hit_count: 4
role_contracts_loaded:
- /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/shared-contract.md
- /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/editorial.md
- /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/writer.md
writer_handoff:
  status: READY
  owner: writer
  model: gpt-5.6-sol
  reasoning_effort: medium
  contracts_loaded:
  - /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/shared-contract.md
  - /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/editorial.md
  - /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/writer.md
  input_fingerprints:
  - path: /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/shared-contract.md
    file_sha256: e12f94b38bf7ade61dd78d91c19203587b1090c80bacb2ca39606973ec6e306a
  - path: /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/editorial.md
    file_sha256: ed83789179488e9b2f334d79ff577b40633fab2e917ebd69a3e633bd3bee65af
  - path: /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/writer.md
    file_sha256: e74cbe6acf256a17a5e64515c930cc95602d892560592bd490c607eb0ed11725
  - path: /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/10-source-plan.md
    file_sha256: 69795282a7ea67c7fc7956692ed053221cf7f35610aad704165ccdf2efd07ad5
  - path: /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/attempts/writer/attempt-2/20-post-draft.md
    file_sha256: 6aae18de0e46dc23f8e88286c0b0f6a0f5fc4d653b0d61ef3683dcc0bca9bad3
  - path: /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/90-qa.pre-qa1.md
    file_sha256: 9e9a2a677455be3574c2029157b694c107c6cfca76043e6571d94fc7dc4bef2e
  - path: /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/inputs/writer-calibration-posts.md
    file_sha256: 4f8ed0046517f9873123c81a6df7133ea69879e4c9f7eeccc8bbc59cb6b05ebd
  - path: /projects/code/otaviomiranda.com.br/src/content/posts/2026/rust-expoe-o-artefato-github-actions-protege-segredos-e-agentes-locais-encaram-o-mundo-real/text.md
    file_sha256: 429a580478062c0f11b05ce1c844e9e0bb423c1ac4905ed745cbd4ff9f1fa5e5
  - path: /projects/code/otaviomiranda.com.br/src/content/posts/2026/o-modelo-e-so-uma-peca-seguranca-cache-e-infraestrutura-no-daily-paper-llm/text.md
    file_sha256: 46c4fda946838bdae1eba270469390400bbf72ea540e1b9b0e0fe4d0a539c4fc
  - path: /projects/code/otaviomiranda.com.br/src/content/posts/2026/llms-na-producao-o-modelo-e-a-parte-facil/text.md
    file_sha256: c143664242ceac3283d5abc9c083f167e76065990b12048291815a1309df38a1
  outputs:
  - /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/attempts/writer/attempt-3/20-post-draft.md
  coverage_by_story_id:
  - story_id: gke-k8s-aibom-runtime-inventory
    destination: main
    central_claim_realized: yes — controlador aberto observa workloads vivos e gera ML-BOM CycloneDX 1.6
    why_it_matters_realized: yes — inventário de shadow AI sem agentes privilegiados ou mudanças nos pods
    caveat: detecção por padrões pode ficar inconclusiva e não substitui scanner de build nem certifica conformidade
    adjacent_source: yes — https://cloud.google.com/blog/products/identity-security/introducing-k8s-aibom-on-gke-for-automated-ai-bills-of-materials/
  - story_id: agentcore-obo-token-exchange
    destination: main
    central_claim_realized: yes — troca OAuth preserva usuário, muda audiência e registra o agente separadamente
    why_it_matters_realized: yes — reduz personificação e repasse inseguro de token entre tenants e serviços
    caveat: limitações da Okta e DPoP desativado exigem tokens curtos e proteção do segredo
    adjacent_source: yes — https://aws.amazon.com/blogs/machine-learning/implement-on-behalf-of-token-exchange-for-multi-tenant-agents-with-amazon-bedrock-agentcore-gateway/
  - story_id: symcrypt-rust-formal-verification
    destination: main
    central_claim_realized: yes — Microsoft publicou código Rust e provas completas de ML-KEM e SHA-3 no SymCrypt
    why_it_matters_realized: yes — agentes podem ajudar onde o kernel do Lean decide mecanicamente a aceitação
    caveat: a prova depende da especificação e dos modelos confiáveis e não elimina side channels, testes ou auditoria
    adjacent_source: yes — https://www.microsoft.com/en-us/research/blog/verifying-rust-cryptography-in-symcrypt-from-standards-to-code/
  - story_id: entra-passkeys-default-sms-retirement
    destination: main
    central_claim_realized: yes — passkeys começam a virar padrão em setembro e entrega nativa de SMS e voz termina em fevereiro
    why_it_matters_realized: yes — administradores precisam inventariar, pilotar e planejar fallback ou parceiro
    caveat: rollout é gradual e SMS ou voz continuam possíveis por provedor pago
    adjacent_source: yes — https://www.microsoft.com/en-us/security/blog/2026/07/13/microsoft-entra-id-security-updates-passkeys-are-the-default-authentication-method-in-entra-id/
  - story_id: meta-ads-sched-ext
    destination: main
    central_claim_realized: yes — política sched_ext permitiu avançar o kernel com ganhos reportados no workload de Ads
    why_it_matters_realized: yes — operadores podem testar scheduler em BPF e user space sem manter fork do kernel
    caveat: números são da Meta, específicos da carga e não foram reproduzidos de forma independente
    adjacent_source: yes — https://engineering.fb.com/2026/07/13/ml-applications/modernizing-the-meta-ads-service-with-an-open-source-kernel-scheduler/
  - story_id: sqs-twentieth-anniversary
    destination: quick_hit
    central_claim_realized: yes — retrospecto de vinte anos registra escala, segurança padrão e recursos recentes do SQS
    why_it_matters_realized: yes — filas continuam úteis para isolamento de falhas e absorção de picos
    caveat: limites variam e 2 GB usa conteúdo no S3, não payload nativo do SQS
    adjacent_source: yes — https://aws.amazon.com/blogs/aws/amazon-sqs-turns-20-two-decades-of-reliable-messaging-at-scale/
  - story_id: eks-argocd-private-git
    destination: quick_hit
    central_claim_realized: yes — CodeConnections liga Argo CD gerenciado a GitHub Enterprise ou GitLab privado na VPC
    why_it_matters_realized: yes — repositórios GitOps podem continuar privados com uma rota autorizada
    caveat: exige rede, DNS, HTTPS, permissões e configuração especial para CA privada; suporte não é universal
    adjacent_source: yes — https://aws.amazon.com/blogs/containers/accessing-private-git-repositories-from-amazon-eks-capability-for-argo-cd/
  - story_id: ipv4-over-ipv6-resolved-gateway
    destination: quick_hit
    central_claim_realized: yes — draft usa sentinela IPv4 e resolução IPv6 para evitar ARP no primeiro salto
    why_it_matters_realized: yes — pode reduzir estado dual-stack e workarounds de gateway
    caveat: é draft individual, ainda não adotado como RFC, com escala apenas relatada pelo autor
    adjacent_source: yes — https://labs.ripe.net/author/remco-van-mook/a-farewell-to-arps-ipv4-service-on-ipv6-only-networks/
  - story_id: logseq-2-beta-db
    destination: quick_hit
    central_claim_realized: yes — Logseq liberou o Desktop App 2.0.1 como primeiro beta público da versão DB
    why_it_matters_realized: yes — usuários já podem testar a geração baseada em banco
    caveat: beta inicial exige backup e as notas não detalham arquitetura ou migração completa
    adjacent_source: yes — https://github.com/logseq/logseq/releases
  checks:
  - supplied_fingerprints: pass — 10/10 supplied exact byte hashes matched before writing, including the previous draft and QA report
  - source_plan_status: pass — READY, roundup, 5 main plus 4 Quick Hits, 9/9 selected sources opened
  - selected_inventory: pass — 9/9 story IDs realized once in accepted order and destination
  - adjacent_sources: pass — 9/9 public story blocks end with required source line
  - public_word_count: pass — 2327 public words, inside the 1800–3200 normal roundup target
  - frontmatter: pass — required four fields, full ISO timestamp, no audio
  - title_and_headings: pass — SEO anchor plus honest curiosity; no series label, numbering, or story IDs
  - title_packaging_correction: pass — frontmatter title uses a natural colon instead of an em dash; body, description, date, author, facts, sources, story order, caveats, counts, and audit schema preserved
  - transparency_and_audit: pass — standard note followed by exactly one hidden audit block
  - qa_002_correction: pass — scanned the complete public draft and split or contextualized every identified sentence with more than two dense technical tokens; facts, numbers, dates, caveats, URLs, story order, destinations, title intent, description intent, roundup floor, and hidden audit schema preserved
  - cold_reader_pass: pass after correction — every block states event, consequence, limit, and source without assumed product knowledge
  - read_aloud_pass: pass after correction — all public sentences and headings were reread under the at-most-two-dense-token rule; the previous draft's contrary pass claim was not reused as evidence
  defects: none
  contract_repairs: none
humanizer_lineage:
  status: READY
  owner: humanizer
  model: gpt-5.6-sol
  reasoning_effort: medium
  contracts_loaded:
  - /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/shared-contract.md
  - /projects/automations/daily-paper/daily-paper-llm-roundup/skills/humanizer/SKILL.md
  - /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/humanizer.md
  - /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/writer.md
  input_fingerprints:
  - path: /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/shared-contract.md
    file_sha256: e12f94b38bf7ade61dd78d91c19203587b1090c80bacb2ca39606973ec6e306a
  - path: /projects/automations/daily-paper/daily-paper-llm-roundup/skills/humanizer/SKILL.md
    file_sha256: 74ec4d6c02b446bbaa443123d1dbe9ef2272572a70646b053163c41045ca23a2
  - path: /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/humanizer.md
    file_sha256: 5c1817a53633b7f3ea9088e229165439a571fd61495e444d2f22f28511d409fe
  - path: /projects/automations/daily-paper/daily-paper-llm-roundup/agents/v2/writer.md
    file_sha256: e74cbe6acf256a17a5e64515c930cc95602d892560592bd490c607eb0ed11725
  - path: /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/20-post-draft.md
    file_sha256: bd132a0f2602ed61b6fcd0440ece321d600bd010a888e438dc2bae01cb50e767
  - path: /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/10-source-plan.md
    file_sha256: 69795282a7ea67c7fc7956692ed053221cf7f35610aad704165ccdf2efd07ad5
  - path: /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/90-qa.pre-qa1.md
    file_sha256: 9e9a2a677455be3574c2029157b694c107c6cfca76043e6571d94fc7dc4bef2e
  outputs:
  - /projects/code/otaviomiranda.com.br/run_dir/2026-07-13-2026-07-13-4/attempts/humanizer/attempt-3/25-post-humanized.md
  checks:
  - full_humanizer_pass: pass
  - qa_002_density_preserved: pass
  - qa_003_one_move_endings: pass
  - public_word_count: 2222
  - main_story_count: 5
  - quick_hit_count: 4
  - inventory_reconciliation: pass — 9/9 stories preserved once in accepted order and destination
  - frontmatter_transparency_audit: pass
  - writer_handoff_byte_identity: pass — SHA-256 f7014c5c1c26d2bce61ef5f3323ffb0fde46c67371228b1d023eb26f88905720
  defects: none
  contract_repairs: none
-->
