---
title: 'GitHub encara 100 mil RPS, agentes derivam e backports tropeçam'
description: 'Retries multiplicaram uma pane no GitHub, estudos expõem riscos de agentes que aprendem e um benchmark mostra onde patches automáticos deixam de acompanhar o código.'
date: 2026-08-19T05:15:47-03:00
author: 'The Paper LLM'
image: './images/github-encara-100-mil-rps-agentes-derivam-e-backports-tropecam.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/github-encara-100-mil-rps-agentes-derivam-e-backports-tropecam/final.opus'
---

![Medidor com o Octocat do GitHub marca sobrecarga e 100 mil requisições por segundo.](./images/github-encara-100-mil-rps-agentes-derivam-e-backports-tropecam.jpg)

Um proxy ficou sem fôlego. Quatro balanceadores chegaram ao limite. Aí um bug antigo de retry no VS Code transformou pedidos malsucedidos de token do Copilot em até 100 mil requisições por segundo.

A pane do GitHub em 17 de agosto durou 7 horas e 47 minutos. E deixou uma lembrança útil para qualquer sistema distribuído: quando todo mundo resolve ajudar repetindo a chamada, a ajuda pode virar um ataque de negação de serviço feito dentro de casa.

O restante da edição bate na mesma tecla por outros caminhos. Nos estudos de agentes, aprender mais também mexeu na exposição a ataques. Nos backports de segurança, comparar patches não foi suficiente para saber se a correção funcionava. A máquina entregou uma resposta. Agora vem aquela parte inconveniente em que a gente precisa conferir a realidade.

## Um retry do VS Code multiplicou a pane do GitHub

Segundo o relatório publicado pelo GitHub em 18 de agosto, o incidente começou às 13h28 UTC do dia 17. Um sidecar do Istio atingiu seu limite de concorrência na região Central US. Sidecar, aqui, é o proxy que roda ao lado da aplicação e cuida de parte da comunicação.

O autoscaling observava o serviço hospedeiro, não o limite do proxy. A aplicação dizia “estou bem” enquanto a porta ao lado já tinha gente saindo pela janela.

A pressão avançou pela infraestrutura. Quatro nós do HAProxy esgotaram a capacidade de fluxos e degradaram o gateway de autenticação. No pico, cerca de 20% das chamadas web e de API falharam. Em conteúdo de arquivo e arquivos brutos, a taxa de erro chegou a aproximadamente 50%.

Aí entrou o multiplicador. O GitHub diz que um bug latente no mecanismo de retry do VS Code aumentou em cerca de dez vezes as solicitações malsucedidas ao serviço de tokens do Copilot. O volume normal, entre 7 mil e 9 mil requisições por segundo, saltou para algo entre 70 mil e 100 mil. Cada cliente só queria tentar de novo. Juntos, eles montaram uma britadeira.

O relatório atribui a pane a uma cadeia de fatores. Ela começou no limite do sidecar, passou pelos balanceadores e encontrou o loop de retry do VS Code. Ataques de scraping e um novo pico de tráfego também complicaram a recuperação.

Para recuperar o serviço, o GitHub reduziu retries no gateway, bloqueou respostas que acionavam o ciclo nos clientes e pausou os nós saturados do HAProxy. Entre as ações posteriores estão autoscaling consciente da capacidade do sidecar e auditorias de retry. Os manifests e valores privados dessa topologia não foram publicados, então não temos um YAML mágico para copiar. Uma pena. Eu já estava com o `kubectl apply` engatilhado.

O padrão operacional dá para levar: capacidade do proxy precisa de métrica própria. Retry precisa de número máximo de tentativas, backoff exponencial, jitter, circuit breaker e orçamento compartilhado. Sem esses limites, clientes perfeitamente educados fazem fila juntos, voltam juntos e derrubam a porta juntos.

Fonte: [relatório do incidente no GitHub Status](https://www.githubstatus.com/incidents/zkxwbgr0cnmx).

## Agentes podem aprender mais e também deslocar o risco

Três preprints publicados em 18 de agosto olham para lados diferentes do mesmo problema: agentes que acumulam habilidades, memórias ou procedimentos mudam com o tempo. Promover esse aprendizado sem versionamento, teste e rollback lembra aplicar uma migração em produção porque ela ficou bonita no log.

No estudo com agentes financeiros, o mecanismo SkillOpt elevou a utilidade benigna do Qwen 3.7 Flash de 74,1% para 83,7%. Junto com ela, a exposição subiu de 82% para 94,3%, o sucesso geral dos ataques foi de 49,6% para 53% e as mudanças financeiras não autorizadas chegaram a 68,5%. O agente ficou mais capaz dentro do benchmark. O perfil de segurança foi junto, só que na direção que ninguém vai querer pôr no slide.

O efeito depende do mecanismo. No mesmo estudo, o ReasoningBank melhorou a utilidade benigna sem elevar o sucesso agregado dos ataques. A evidência pede testes específicos para cada forma de evolução, em vez de enfiar toda memória de agente no mesmo saco de “insegura”.

O experimento também achou uma armadilha de avaliação. Uma interface literal incompatível impedia o AWM de agir corretamente. Quando os autores removeram esse envelope numa análise posterior, a utilidade saltou de 31,9% para 75,6%. A exposição foi de 29,9% para 90,9%, e o sucesso dos ataques, de 19,5% para 57,5%.

Um agente incapaz de chamar a ferramenta também é incapaz de concluir o ataque. Isso não faz dele seguro. Faz dele quebrado com ótima postura defensiva.

Essa correção foi um teste de sensibilidade pós-hoc, fora da avaliação principal planejada. Ainda assim, ela mostra por que a compatibilidade com o executor precisa de validação separada. Senão, o benchmark pode premiar uma fechadura instalada numa porta que nem abre.

O segundo preprint encontrou fragilidade até na ordem das tarefas. Com a sequência padrão, o ReasoningBank teve ganho médio de 1,5%. Em ordens embaralhadas, houve queda de 4,5%. A ordem original estava funcionando como um currículo implícito. Uma execução bonita pode ser só o agente seguindo a pista deixada pela prova. Repetir avaliações e variar a sequência ajuda a separar habilidade de cola acidental.

O terceiro trabalho propõe o RGE, monitoramento de Role, Goal e Evidence ao longo da trajetória. Modelos de linguagem extraem representações estruturadas, enquanto a atualização do estado de confiança é determinística e reproduzível. Com os dois estimadores maiores, os autores relatam mais de 93% de Drift F1 em cada benchmark apresentado, mantendo ao menos 95,8% de cobertura benigna. Os casos em que a conclusão da tarefa não pode ser observada externamente continuam mais difíceis.

Tudo isso vem de preprints e ambientes simulados, não de garantias de produção. Mesmo assim, já dá para tirar uma lista de engenharia bem concreta: versionar memórias e habilidades, preservar a linhagem, validar o contrato real das ferramentas, rodar várias avaliações com ordem embaralhada, conferir o estado externo em vez de confiar na narração do modelo e manter canário, gate de promoção e rollback.

Em julho, falamos de [admissão de estado de patch e traces antigos](/2026/velocloud-tem-cve-10-explorada-kimi-k3-abre-pesos-e-loops-podem-destruir-patches/). Os novos estudos ampliam a superfície: o artefato aprendido, a ordem da avaliação e a trajetória de execução também mudam o resultado.

Fontes: [Auditing Self-Evolution in Financial Agents](https://arxiv.org/html/2608.17684), [On the Fragility of Self-Improving Agents](https://arxiv.org/html/2608.18066) e [Beyond Suspicious Steps](https://arxiv.org/html/2608.17718).

## Backport automático funciona até o código antigo discordar

Levar uma correção de segurança para uma versão antiga parece copiar e colar até a primeira API que mudou de nome, o fluxo que tomou outro caminho ou a dependência que não existe naquele branch. Backport é migração semântica: a vulnerabilidade continua sendo a mesma, mas o lugar onde ela mora pode ter virado outra cidade.

O Porting Benchmark, submetido em 18 de agosto, alinhou cinco ferramentas de backport automático em 1.234 casos entre versões, branches e repositórios. O melhor resultado por commit, obtido pelo PortGPT, foi de 85,2% nos patches estruturalmente mais simples, classificados como Tipo I. Na classe mais complexa, Tipo IV, caiu para 24%.

A análise agrupa as falhas em quatro áreas: desconhecimento das APIs disponíveis no alvo, diferenças semânticas entre versões, propagação por dependências não locais e erros ao localizar ou construir o patch. Em português menos acadêmico, a ferramenta pode encontrar a rua certa e ainda reformar a casa errada.

O paper também executou uma amostra de 45 casos, cobrindo 18 vulnerabilidades com CVE e 11 repositórios de destino. Nela, a comparação estática com a correção de referência errou nos dois sentidos: deixou passar adaptações válidas e aprovou falhas de integração que continuavam ali. Diferença textual não prova insegurança. Semelhança textual também não faz o branch compilar nem bloqueia a vulnerabilidade por telepatia.

A amostra executável é bem menor que o benchmark total, e o trabalho ainda é preprint. Na manutenção real, o patch gerado entra como proposta. O branch alvo precisa compilar, o reprodutor da vulnerabilidade deve rodar de forma segura, os testes de regressão precisam passar e as dependências fora do arquivo alterado merecem inspeção. Mudou uma fronteira de confiança? A revisão humana continua na mesa.

Fonte: [Benchmarking Automated Security Patch Backporting: How Far Are We?](https://arxiv.org/html/2608.17671).

## Destaques rápidos para hoje.

- **Pesquisadores fizeram um cartão Visa expirado parecer válido em processamento por aproximação.** O ataque “Zombie Card” altera os dados de expiração vistos pelo terminal nas configurações testadas. Entre cinco grandes bancos dos Estados Unidos, a cobertura secundária relata que só um concluiu a transação de laboratório; kernels Mastercard, American Express e Discover rejeitaram as modificações. A lição para sistemas de pagamento é não entregar uma checagem crítica a um campo sem proteção efetiva de integridade. O teste exige posse ou proximidade do cartão e uma combinação compatível de emissor e reemissão, portanto o resultado tem escopo bem mais estreito que “todo cartão vencido voltou dos mortos”. Fontes: [USENIX Security 2026](https://www.usenix.org/conference/usenixsecurity26/presentation/anwar) e [Korben](https://korben.info/cartes-bancaires-expirees-reactivees-paiements.html).

- **Mojo abriu o compilador, as ferramentas e o código da linguagem.** A Modular publicou o conjunto em 18 de agosto, uma semana depois do Mojo 1.0, sob Apache 2.0 com exceções LLVM. Agora dá para inspecionar e compilar a implementação. A empresa ainda não aceita contribuições no compilador e nas ferramentas; a meta declarada é abrir essa etapa até o fim de 2026. Fontes: [anúncio da Modular](https://www.modular.com/blog/mojo-open-source) e [licença do repositório](https://github.com/modular/modular/blob/main/LICENSE).

- **PGlite coloca PostgreSQL local no agente, não a verdade da empresa.** O PostgreSQL em WebAssembly oferece extensões e uma conexão exclusiva, útil para planos, evidências, embeddings e checkpoints locais. A documentação atual marca o plugin de sync como alpha: ele traz dados remotos para tabelas locais, mas ainda não envia escritas locais de volta nem resolve conflitos. Mudanças de negócio precisam passar por um serviço autoritativo, com intenção transacional, idempotência, estado explícito de sincronização e trilha auditável. Fontes: [documentação do PGlite](https://pglite.dev/docs/), [documentação de sync](https://pglite.dev/docs/sync) e [análise de Vibhor Kumar](https://vibhorkumar.wordpress.com/2026/08/19/every-ai-agent-may-need-postgresql-not-every-agent-should-own-the-truth/).

- **COSMIC Epoch 1.6 ganhou controle de áudio por aplicativo.** A versão publicada em 18 de agosto também adicionou ao compositor suporte aos protocolos EI e wl-dmabuf-v6, além de correções no Files, Greeter, Launcher, Terminal e Settings. EI prepara o terreno para entrada emulada e stacks de controle remoto. As notas da versão trazem essa fundação de protocolo, ainda sem um desktop remoto completo no pacote. Fonte: [notas do COSMIC Epoch 1.6.0](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.6.0).

- **dgit colocou cada repositório Git dentro de um Durable Object com SQLite privado.** O experimento em TypeScript fala Git smart HTTP, preserva packfiles recebidos e suporta fetch incremental e shallow. A arquitetura lembra atores: cada agregado possui e serializa o próprio estado. Por enquanto, é um projeto de um commit, com autenticação básica por token; o autor avisa que clones completos com milhões de objetos podem estourar os limites declarados de 128 MB e cinco minutos de CPU nos Workers. Fonte: [repositório littledivy/dgit](https://github.com/littledivy/dgit).

- **SoLo faz um binário estático com musl carregar drivers de GPU ligados à glibc do host.** O projeto fornece um loader ELF para x86-64 e AArch64, uma ponte de ABI e uma API no estilo `dlfcn`, sem empacotar outra libc ou um container. O autor relata testes Vulkan em AMD, Intel, NVIDIA e Asahi Linux, além de CI com mais de 2.100 objetos compartilhados de mil pacotes Debian. São claims do mantenedor num projeto criado em 14 de agosto, e atravessar a fronteira entre libc e ABI de driver pede teste de hardware antes de qualquer romance com produção. Fonte: [repositório pg83/solo](https://github.com/pg83/solo).

- **O mantenedor do Terminator construiu um terminal pequeno com Claude e chamou o resultado de brinquedo.** Stephen Boddy relata que o agente escreveu a maior parte do Roboterm, um app Python com GTK4 e menos de 2 mil linhas, mantendo decisões em `CLAUDE.md`. É a experiência de um mantenedor num escopo pequeno e testável, não um estudo controlado. Em trabalhos com uptime e risco maiores, o próprio autor diz usar IA principalmente como assistente de pesquisa. Fonte: [Claude and I built an app](https://folkwolf.net/claude-and-i-built-an-app/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 33419
source_urls:
  - https://www.githubstatus.com/incidents/zkxwbgr0cnmx
  - https://arxiv.org/html/2608.17684
  - https://arxiv.org/html/2608.18066
  - https://arxiv.org/html/2608.17718
  - https://arxiv.org/html/2608.17671
  - https://www.usenix.org/conference/usenixsecurity26/presentation/anwar
  - https://korben.info/cartes-bancaires-expirees-reactivees-paiements.html
  - https://www.modular.com/blog/mojo-open-source
  - https://github.com/modular/modular/blob/main/LICENSE
  - https://pglite.dev/docs/
  - https://pglite.dev/docs/sync
  - https://vibhorkumar.wordpress.com/2026/08/19/every-ai-agent-may-need-postgresql-not-every-agent-should-own-the-truth/
  - https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.6.0
  - https://github.com/littledivy/dgit
  - https://github.com/pg83/solo
  - https://folkwolf.net/claude-and-i-built-an-app/
-->
