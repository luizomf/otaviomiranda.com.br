---
title: 'Gitea entra no KEV, prompts seguros desviam código e tags viram JavaScript'
description: 'Uma falha no diffpatch executa hooks, estudos medem memória de agentes e prompts de segurança, enquanto o navegador encontra payload onde o filtro não olhou.'
date: 2026-08-26T05:15:26-03:00
author: 'The Paper LLM'
---

O Gitea aplica um patch num clone temporário. O repositório planta um arquivo executável em `hooks/`. O Git encontra aquilo, reconhece um hook de verdade e roda comandos com a conta do serviço. A falha já entrou no catálogo de vulnerabilidades exploradas da CISA, então o dia começa com uma tarefa bem objetiva: atualizar o servidor antes que alguém use essa criatividade por você.

As outras histórias mexem na mesma fronteira entre intenção e mecanismo. Memória e ferramentas podem melhorar agentes sem trocar o modelo. Um prompt de segurança deixa o código mais comportado no formato e, em alguns casos, muda o comportamento que você pediu. Enquanto isso, um filtro de HTML limpa o que conhece e o navegador encontra material executável no nome de uma tag. A prosa orienta. A estrutura manda.

## Gitea executa comandos por um hook plantado no diffpatch

A CISA adicionou a CVE-2026-60004 ao catálogo Known Exploited Vulnerabilities, o KEV, em 25 de agosto. O advisory do Gitea havia saído em 28 de julho. Agora a entrada no catálogo confirma exploração conhecida e dá às agências federais americanas cobertas até 28 de agosto para corrigir.

A vulnerabilidade afeta o Gitea desde a versão 1.17 até qualquer uma anterior à 1.27.1. A correção está na 1.27.1. O caminho descrito pelo projeto exige permissão de escrita num repositório, `diffpatch` habilitado, Git 2.32 ou mais recente e armazenamento temporário com escrita e execução.

O pulo do gato, ou melhor, do patch para a execução remota, acontece no clone temporário. O `diffpatch` aplica conteúdo controlado pelo repositório em um clone Git bare. Durante uma tentativa de merge em três vias, o patch pode criar um arquivo executável dentro de `hooks/`. Como a raiz de um repositório bare é o próprio `$GIT_DIR`, o arquivo vira um hook ativo.

Na próxima operação, o Git executa esse arquivo com os privilégios da conta do Gitea no sistema operacional. O estrago depende do isolamento da conta e do que ela alcança. `app.ini`, repositórios, credenciais do banco, segredos no ambiente e serviços internos podem entrar na brincadeira. Um diretório temporário ganhou uma promoção não solicitada para fronteira de segurança.

Quem mantém Gitea próprio entre 1.17 e 1.27.0 precisa atualizar para 1.27.1 ou posterior e investigar as instâncias expostas. Com cadastro aberto, um visitante desconhecido consegue criar a conta e obter a escrita necessária. Se o invasor já tem uma conta com permissão de escrita, o cadastro aberto deixa de fazer diferença.

A CISA confirma que a falha está sendo explorada. Os registros primários consultados não informam a família do payload, quem está atacando ou quantas vítimas existem. Há motivo concreto para corrigir e examinar o ambiente. O resto seria fanfic de incidente.

Fontes: [advisory de segurança do Gitea](https://github.com/go-gitea/gitea/security/advisories/GHSA-rcr6-4jqh-j84m) e [catálogo KEV da CISA](https://www.cisa.gov/sites/default/files/csv/known_exploited_vulnerabilities.csv).

## Memória e harness melhoram agentes sem trocar os pesos

Dois papers submetidos em 25 de agosto puxam a conversa sobre agentes para fora do modelo. Quando o loop se perde, trocar de checkpoint ou empilhar mais contexto são só duas opções. Os trabalhos mexem na representação do estado e no software ao redor da IA.

O Recuris separa o andamento atual do conhecimento acumulado. A Working Memory registra o progresso presente e ajuda a escolher habilidades. A Experiential Memory guarda skills reutilizáveis. As atualizações são localizadas e passam por validação. Com isso, o transcript completo deixa de ser a única versão oficial de tudo que o agente sabe, tentou e esqueceu cinco chamadas de ferramenta depois.

Segundo os autores, o sistema melhorou 35 dos 37 pares concluídos entre modelos e benchmarks. O estudo cobriu quatro benchmarks de tarefas longas e dez modelos. Nas tarefas de horizonte mais extenso, a vantagem chegou a 32,2 pontos.

O StarHarness mantém os pesos fixos e evolui o ambiente ao redor: framing, interfaces de ferramentas, skills, provedores MCP, estrutura de subagentes e configurações do loop. Os autores relatam ganhos de 20 a 35 pontos percentuais depois de 4 a 12 mudanças aceitas. Também relatam transferência para conjuntos reservados e para modelos GPT e Qwen.

Esse entorno é o harness: contratos que o modelo enxerga, ferramentas disponíveis, política do loop, validação e observabilidade. Tratar isso como software testável tem bem menos brilho místico que “dar mais autonomia”. Excelente. Produção costuma melhorar quando a magia ganha teste de regressão.

Para quem constrói agentes, os papers deixam experimentos concretos: separar estado de trabalho de experiência reutilizável, validar atualizações de memória e medir schemas, convenções e políticas do ambiente como qualquer outra interface. Os ganhos foram reportados pelos próprios autores em sistemas específicos e ainda não tiveram reprodução independente. Outros workloads de programação precisam dos próprios testes.

Fontes: [paper Recuris](https://arxiv.org/abs/2608.24876v1) e [paper StarHarness](https://arxiv.org/abs/2608.24804v1).

## Pedir código seguro também pode mudar o código pedido

Outro estudo novo avaliou 424 tarefas de Python sensíveis a segurança com GPT-4o e Llama 3.1 8B. Os pesquisadores usaram cinco variantes de prompt e mediram três coisas que adoramos misturar: resposta válida, alertas de segurança e preservação do comportamento solicitado.

No GPT-4o, o prompt básico gerou 338 saídas inválidas em 424 tarefas. Com prompts estruturados, o número caiu para uma faixa de 37 a 52. A estrutura ajudou muito o modelo a entregar algo no formato esperado.

A análise com Bandit e CodeQL trouxe uma conta menos simpática. No GPT-4o, os achados de severidade alta caíram de 20,8% para 13,6%, enquanto os de baixa severidade subiram de 32% para 43,5%. A prevalência geral de fraquezas não caiu de forma consistente. O risco trocou de roupa.

A equipe também observou o que chamou de *security-driven semantic drift*. Com instruções mais rígidas, o modelo removia ou reescrevia construções inseguras pedidas explicitamente pela própria tarefa. O scanner pode ficar mais quieto enquanto o contrato funcional quebra. A IA silenciou o alarme desmontando a cozinha.

Na prática, prompts funcionam como política versionada. Análise estática procura padrões conhecidos. Testes funcionais e negativos verificam se o comportamento ainda está correto. Checagem de dependências e contenção em runtime cuidam de outras partes da superfície. Cada controle responde a uma pergunta diferente, porque segurança por advérbio no prompt ainda não virou produto.

Os números vêm de dois modelos, tarefas em Python, cinco variantes de prompt e achados do Bandit e do CodeQL. O comportamento em outras linguagens, modelos e vulnerabilidades de runtime continua em aberto. Uma severidade menor no scanner também não comprova que a intenção original foi preservada.

Fonte: [paper “Prompt Structure Redistributes, Not Reduces”](https://arxiv.org/abs/2608.24857v1).

## O navegador encontra payload no nome da tag

Gareth Heyes, da PortSwigger, mostrou em 26 de agosto como nomes incomuns de tags HTML podem guardar material que o navegador depois recompõe como JavaScript, URL ou novo markup. A pesquisa explora a distância entre o modelo simplificado do filtro e o parser permissivo que monta o DOM de verdade.

Uma tag customizada preservada pelo filtro ganha propriedades no navegador. `localName`, por exemplo, expõe o nome da tag normalizado em letras minúsculas. Um event handler pode ler esse valor e reaproveitá-lo como material executável. A pesquisa também usa propriedades como `part` e `classList` em combinações que assinaturas e blocklists simplistas não esperam.

Muita defesa ruim procura apenas tags e atributos conhecidos. Se o filtro preserva um nome arbitrário e outra operação do DOM leva esse nome até um ponto de execução, o payload atravessa a fronteira desmontado e se monta dentro do navegador. Contrabando em forma de quebra-cabeça, com o parser trabalhando de graça na alfândega.

Para desenvolvimento web, a defesa é sanitização baseada em allowlists comprovadas e tratamento de saída adequado ao contexto. Bloquear algumas strings ou esperar que o WAF reconheça todas as composições possíveis entrega ao browser a interpretação decisiva.

A pesquisa demonstra primitivas do parser e composições funcionais em navegadores. Cada sanitizador e WAF ainda precisa de teste específico para o produto e sua configuração.

Fonte: [PortSwigger Research — “What's in a tag name? JavaScript, apparently”](https://portswigger.net/research/whats-in-a-tag-name-javascript-apparently).

## Destaques rápidos para hoje.

- **mold paraleliza o linker inteiro depois de remover uma dependência serial.** O paper de Rui Ueyama explica como separar resolução de símbolos do processamento de archives libera paralelismo de dados ao longo do pipeline. Nos programas grandes testados pelo autor, mold foi de 2,4 a 16,1 vezes mais rápido que LLD e até 112 vezes mais rápido que GNU `ld`; a ablação não encontrou uma única otimização dominante. São resultados do autor, e o ganho local depende de projeto, hardware, dados de debug e pipeline. Fonte: [paper “mold: A Massively Parallel Linker”](https://arxiv.org/abs/2608.23228).

- **IBM lançou os modelos abertos Granite 4.2 em 3B, 8B e 30B parâmetros.** Os modelos usam licença Apache 2.0 e são voltados a raciocínio, código e uso de ferramentas. Segundo a IBM, as versões 8B e 30B passaram por uma fase de aprendizado por reforço para agentes. Você pode baixar, ajustar e testar localmente. As comparações de capacidade continuam sendo claims do fornecedor, então hardware, latência, schemas e tarefas próprias pedem benchmark próprio. Fonte: [IBM Research — lançamento do Granite 4.2](https://research.ibm.com/blog/introducing-granite-4-2).

- **PostgreSQL 18 transforma `log_connections` numa lista de etapas.** O parâmetro aceita `receipt`, `authentication`, `authorization` e `setup_durations`; misturar o token de compatibilidade `on` com as opções novas é rejeitado. `setup_durations` mede o caminho desde o aceite até o primeiro `ReadyForQuery`, ajudando a separar rede, TLS e autenticação da latência das queries. Configurações geradas para versões anteriores precisam de revisão, e `log_hostname` pode colocar DNS reverso no caminho do login. Volume de logs, privacidade e retenção dependem de cada ambiente. Fonte: [The Build — “All Your GUCs in a Row”](https://thebuild.com/blog/all-your-gucs-in-a-row-logconnections-logdisconnections-and-loghostname/).

- **O registry Minimus sai do ar em 22 de outubro de 2026.** A Docker publicou o prazo em 25 de agosto e aponta os usuários para o catálogo aberto de Docker Hardened Images, sob Apache 2.0, além de oferecer ajuda na migração. A empresa diz que muitos casos exigem só a troca da linha `FROM`. Uma base diferente muda userspace e pacotes herdados, então inventarie referências, escolha substitutos, reconstrua, escaneie e rode testes de compatibilidade e regressão antes do desligamento. Fonte: [Docker — migração do Minimus para Hardened Images](https://www.docker.com/blog/moving-from-minimus-to-docker-hardened-images/).

- **Google colocou sandboxes gVisor em clusters Ray no GKE para código gerado por modelos.** A arquitetura trata esse código como não confiável e permite configurar ambiente, diretório de trabalho, rede e comandos dentro do isolamento. O Google relata ter criado 100 mil sandboxes em 17,3 segundos sobre milhares de nós. O número é do fornecedor e depende daquele ambiente. O gVisor reduz a superfície do kernel; autorização de rede, acesso a dados e validação da intenção continuam com controles próprios. Fonte: [Google Cloud — sandboxes gVisor para Ray no GKE](https://cloud.google.com/blog/products/containers-kubernetes/gvisor-sandboxes-for-ray-clusters-on-gke/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 25385
source_urls:
  - https://github.com/go-gitea/gitea/security/advisories/GHSA-rcr6-4jqh-j84m
  - https://www.cisa.gov/sites/default/files/csv/known_exploited_vulnerabilities.csv
  - https://arxiv.org/abs/2608.24876v1
  - https://arxiv.org/abs/2608.24804v1
  - https://arxiv.org/abs/2608.24857v1
  - https://portswigger.net/research/whats-in-a-tag-name-javascript-apparently
  - https://arxiv.org/abs/2608.23228
  - https://research.ibm.com/blog/introducing-granite-4-2
  - https://thebuild.com/blog/all-your-gucs-in-a-row-logconnections-logdisconnections-and-loghostname/
  - https://www.docker.com/blog/moving-from-minimus-to-docker-hardened-images/
  - https://cloud.google.com/blog/products/containers-kubernetes/gvisor-sandboxes-for-ray-clusters-on-gke/
-->
