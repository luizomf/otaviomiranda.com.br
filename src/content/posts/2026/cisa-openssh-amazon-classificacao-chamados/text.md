---
title: 'CISA inclui falha do OpenSSH entre exploradas e Amazon troca modelo na classificação de chamados'
description: 'A edição também passa por telemetria ausente, isolamento com micro-VMs, segurança em Rust e mudanças no ecossistema de desenvolvimento.'
date: '2026-11-10T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/cisa-openssh-amazon-classificacao-chamados.jpg'
---

![Chave com etiqueta OpenSSH e aviso da CISA ao lado de um cadeado.](./images/cisa-openssh-amazon-classificacao-chamados.jpg)

A CISA incluiu uma falha de autenticação do OpenSSH em sua lista de vulnerabilidades exploradas, e a Amazon relata uma economia ao trocar o modelo que classifica chamados. A edição também traz formas de detectar eventos perdidos, isolar programas em micro-VMs e entender falhas de segurança de memória em Rust.

## CISA inclui falha do OpenSSH em lista de vulnerabilidades exploradas

Em 9 de novembro, a agência americana CISA adicionou quatro falhas ao catálogo de vulnerabilidades com evidência de exploração ativa: uma no OpenSSH e outras no GPUStack, FreeSWITCH e IBM Aspera Faspex. A inclusão ajuda equipes a priorizar a identificação e a correção de instalações expostas.

A falha de autenticação por senha do OpenSSH, **CVE-2026-123158**, já apareceu [na nossa cobertura sobre tentativas observadas pelo SANS](/2026/bee-js-comprometido-nspawn-docker-bulkhead-agentes/). A novidade é sua entrada no catálogo da CISA, que exige evidência de exploração para inclusão. O escopo continua específico: envolve determinadas configurações com a biblioteca musl, autenticação por senha e OpenSSH sem PAM, a camada que integra métodos de autenticação ao sistema. Segundo o Alpine, nessas condições e com determinadas contas e hashes presentes, alguém que alcance a porta SSH pode entrar em uma conta afetada sem conhecer sua senha.

Quem administra esses sistemas deve conferir a configuração, a versão e as correções da distribuição; o OpenSSH 10.6p2 inclui uma proteção. O Alpine orienta reiniciar o serviço SSH depois da atualização, pois trocar o pacote não substitui o processo que já está em execução. A inclusão no catálogo não significa que todo servidor SSH esteja vulnerável.

Fontes: [alerta da CISA](https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog), [aviso do Alpine](https://alpinelinux.org/posts/2026-11-05-openssh-password-authentication-bypass/) e [notas do OpenSSH 10.6p2](https://www.openssh.org/releasenotes.html#10.6p2).

## Amazon relata troca de modelo para classificar chamados internos

A Amazon relata que substituiu o Claude Sonnet 4.6 pelo Strands Decider E4B em uma tarefa interna de classificação de chamados. O trabalho consiste em escolher entre 20 categorias, com uma opção adicional para nenhum rótulo. O modelo de decisão devolve uma escolha e probabilidades, em vez de gerar uma resposta longa em texto.

A equipe pôde escolher por configuração entre três modos: usar o modelo anterior, executar os dois em paralelo mantendo a resposta antiga em produção, ou adotar o Decider. Comparar as respostas em tráfego real ajudou a examinar divergências antes da troca; a configuração também permitia voltar atrás. Segundo o relato, a ordem das chaves no mesmo JSON chegou a alterar probabilidades em até 19 pontos percentuais; ordenar as chaves tornou as comparações consistentes.

A estimativa da empresa caiu de cerca de **US$ 22.200 para US$ 500 por milhão de chamados**. São cálculos com preços de tabela para essa carga específica, sem o custo do Lambda; o valor do Decider depende da utilização das instâncias. A própria equipe aponta limites para tarefas que precisem de explicações, categorias muito variáveis ou mais contexto do que cabe no modelo.

Fonte: [relato da equipe Strands Agents](https://strandsagents.com/blog/amazon-saves-millions-replacing-sonnet-with-strands-decider/).

## OpenTelemetry explica como detectar eventos que somem entre etapas

No dia 10, o projeto OpenTelemetry publicou um guia para um problema fácil de confundir com tranquilidade: um serviço continua disponível e a taxa de erros permanece baixa, enquanto eventos deixam de atravessar uma etapa do fluxo. Um painel vazio pode indicar ausência de atividade ou falha no caminho que entrega os dados.

A sugestão é definir o que deveria acontecer e contar o trabalho em cada passagem entre etapas: quanto entrou, terminou, foi rejeitado ou continua em processamento. Ao comparar esses números, é preciso levar em conta filtros, tentativas repetidas e processamento em lotes. Métricas ajudam a perceber a diferença; rastros e logs correlacionados ajudam a localizar o ponto da perda, embora rastros amostrados não demonstrem que todos os eventos chegaram.

Um evento sintético periódico, sem dados sensíveis, pode percorrer o mesmo caminho para verificar a entrega de ponta a ponta. Também vale monitorar falhas de exportação e filas do próprio Collector, componente que recebe e encaminha telemetria. Um processo de coleta ligado ainda pode estar deixando de enviar dados.

Fonte: [guia do OpenTelemetry](https://opentelemetry.io/blog/2026/when-missing-telemetry-is-the-signal/).

## Hyperlight combina micro-VMs com snapshots de runtimes preparados

Uma visão técnica publicada pela CNCF em 9 de novembro apresenta o Hyperlight, monitor de máquinas virtuais incorporado à aplicação, e sua integração com Unikraft para executar programas Linux sem recompilá-los. O código roda em uma micro-VM, com acesso a arquivos e rede definido pela aplicação hospedeira.

A integração pode preparar o ambiente de execução, salvar um **snapshot** — uma cópia desse estado — e restaurá-lo nas próximas execuções. No teste descrito pelo projeto, programas simples iniciaram mais lentamente na micro-VM que no ambiente nativo. Já um exemplo Python com bibliotecas pesadas iniciou em 45 milissegundos a partir do snapshot, contra 1.119 milissegundos na execução nativa medida naquela máquina. A vantagem vem de reaproveitar a inicialização e depende da carga e do ambiente.

Para agentes que executam código, o isolamento ajuda a limitar o alcance de uma falha. Os arquivos montados, credenciais e regras de rede concedidos ao ambiente continuam merecendo revisão.

Fonte: [visão técnica do Hyperlight na CNCF](https://www.cncf.io/blog/2026/11/09/run-linux-applications-in-hypervisor-isolated-micro-vms-with-hyperlight/).

## Microsoft descreve falhas de segurança de memória em bibliotecas do Rust

O laboratório FORGE da Microsoft relatou falhas de segurança de memória em bibliotecas padrão do Rust, algumas acionáveis por código escrito inteiramente em Rust seguro. Os pesquisadores usaram ferramentas assistidas por IA em parte da investigação e afirmam ter reproduzido e avaliado os problemas com os mantenedores. Duas das questões relatadas pela equipe continuavam abertas quando o texto foi publicado; alguns exemplos envolvem interfaces nightly.

A explicação passa pelo código `unsafe` que implementa partes de APIs seguras. Esse código precisa cumprir os requisitos que tornam a interface segura para quem a usa. Em um exemplo didático, uma função confere o tamanho de uma fatia retornada por um método e chama esse método outra vez antes de acessar a memória. Se a segunda chamada devolver uma fatia diferente, a primeira verificação já não protege o acesso. Guardar e validar o mesmo resultado é uma das formas de preservar o contrato.

O relatório também discute saídas antecipadas por `panic` e suposições sobre o estado do sistema operacional. A lição para quem escreve abstrações é revisar o que acontece quando código fornecido pelo usuário retorna valores inconsistentes ou interrompe a execução.

Fonte: [pesquisa do Microsoft FORGE Lab](https://www.microsoft.com/en-us/security/blog/2026/11/09/forge-lab-uses-agentic-tools-to-identify-memory-safety-issues-in-rust/).

## Destaques rápidos para hoje.

- **Anthropic lança Claude Fable 5.2 e Mythos 5.2.** Segundo a empresa, os dois usam o mesmo modelo de base, com proteções e acesso diferentes: o Mythos exige aprovação para usos elegíveis de segurança ou pesquisa biomédica. O preço informado é de US$ 8 por milhão de tokens de entrada e US$ 40 na saída; o modo rápido custa mais. A versão 5.2 atualiza a família [Fable 5 já coberta aqui](/2026/claude-fable-5-acima-do-opus-com-coleira-e-prazo/). Fonte: [anúncio da Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2).

- **Grafana detalha o custo dos Watchers.** O monitoramento usa um agente para calibrar verificações, código comum para coletar e comparar sinais e um modelo menor para avaliar cada resultado. A Grafana relata mediana inferior a US$ 5 mensais nos seus Watchers internos; a conta exclui a calibração e investigações cobradas separadamente. Fonte: [Grafana Labs](https://grafana.com/blog/run-cost-effective-always-on-agents-to-monitor-your-environment-the-engineering-behind-watchers/).

- **Projeto de formalização do CPython testa a força das próprias provas.** Autores relatam a tradução parcial de funções do interpretador Python para Lean, linguagem de provas verificadas por computador, e 418 relatos de bugs. Uma prova válida ainda pode descrever uma cópia imprecisa ou uma propriedade fraca; por isso o projeto compara o modelo com o CPython e revisa o que cada prova realmente garante. Os números são dos autores e a cobertura é parcial. Fonte: [relato do projeto](https://broyojo.com/python-formalization/).

- **Tailscale libera OAuth apps para conectar agentes a redes privadas.** Os dispositivos criados pela integração agem sob a identidade de quem autorizou o aplicativo. A empresa orienta restringir o acesso do agente: atributos personalizados de postura estão nos planos Premium e Enterprise; nos demais, regras com tags oferecem uma alternativa. Fonte: [Tailscale](https://tailscale.com/blog/oauth-apps-ga).

- **Zarf 1.0 muda a configuração de pacotes para ambientes isolados.** A ferramenta de entrega para ambientes com acesso restrito à internet apresenta o esquema `v1beta1` e substitui o mecanismo antigo de variáveis por valores estruturados com templates Go. O projeto oferece guia e ferramentas de migração para pacotes existentes. Fonte: [OpenSSF](https://openssf.org/blog/2026/11/09/announcing-zarf-1-0-security-and-stability-for-airgap-software-delivery/).

- **openSUSE planeja trocar o instalador do Tumbleweed pelo Agama.** A mudança é prevista para antes do fim do ano e depende de testes de estabilidade; imagens de teste online e offline já estão disponíveis. O novo instalador oferece padrões de pacotes selecionados, sem escolha individual de pacotes durante a instalação. Fonte: [openSUSE](https://news.opensuse.org/2026/11/09/agama-is-coming-to-tw/).

- **Rótulos de versão influenciaram a revisão de alguns agentes de código.** Em experimentos da Microsoft com alterações idênticas rotuladas como patch ou major, alguns modelos verificaram menos as mudanças com rótulo de patch; outros verificaram todas. Os cenários eram pequenos e incluíam mudanças incompatíveis deliberadamente mal rotuladas. Um CI obrigatório para toda atualização ajuda a não depender desse julgamento. Fonte: [Microsoft for Developers](https://developer.microsoft.com/blog/do-ai-coding-agents-care-about-semver/).

- **Xata anuncia que está se juntando à ClickHouse.** A empresa diz que pretende levar ramificações de bancos PostgreSQL e capacidade de suspender processamento ocioso ao ClickHouse Managed Postgres. Nada muda para clientes Xata no curto prazo, segundo o anúncio; a migração para a plataforma da ClickHouse está prevista para mais adiante. Fonte: [Xata](https://xata.io/blog/xata-is-joining-clickhouse).

- **Meta apresenta arquitetura de plugins para depurar CPU e GPU no LLDB.** A proposta mantém processador e acelerador como alvos separados, com memória e registradores próprios, dentro de uma mesma sessão. O código compartilhado do depurador fica separado dos detalhes implementados para cada hardware. Fonte: [engenharia da Meta](https://engineering.fb.com/2026/11/09/developer-tools/extending-lldb-to-debug-applications-that-span-cpus-and-gpus/).

Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 31313
source_urls:
  - https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog
  - https://alpinelinux.org/posts/2026-11-05-openssh-password-authentication-bypass/
  - https://www.openssh.org/releasenotes.html#10.6p2
  - https://strandsagents.com/blog/amazon-saves-millions-replacing-sonnet-with-strands-decider/
  - https://opentelemetry.io/blog/2026/when-missing-telemetry-is-the-signal/
  - https://www.cncf.io/blog/2026/11/09/run-linux-applications-in-hypervisor-isolated-micro-vms-with-hyperlight/
  - https://www.microsoft.com/en-us/security/blog/2026/11/09/forge-lab-uses-agentic-tools-to-identify-memory-safety-issues-in-rust/
  - https://www.anthropic.com/claude-fable-and-mythos-5-2
  - https://grafana.com/blog/run-cost-effective-always-on-agents-to-monitor-your-environment-the-engineering-behind-watchers/
  - https://broyojo.com/python-formalization/
  - https://tailscale.com/blog/oauth-apps-ga
  - https://openssf.org/blog/2026/11/09/announcing-zarf-1-0-security-and-stability-for-airgap-software-delivery/
  - https://news.opensuse.org/2026/11/09/agama-is-coming-to-tw/
  - https://developer.microsoft.com/blog/do-ai-coding-agents-care-about-semver/
  - https://xata.io/blog/xata-is-joining-clickhouse
  - https://engineering.fb.com/2026/11/09/developer-tools/extending-lldb-to-debug-applications-that-span-cpus-and-gpus/
-->
