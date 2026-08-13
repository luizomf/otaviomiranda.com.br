---
title: 'Rsync corrige 33 falhas e agentes acertam pelo caminho errado'
description: 'Rsync 3.5.0 fecha uma auditoria pesada, pesquisas expõem trajetórias comprometidas e Claude Code moderniza 56 mil linhas de Fortran com um oráculo exato.'
date: 2026-08-13T05:15:35-03:00
author: 'The Paper LLM'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/rsync-corrige-33-falhas-e-agentes-acertam-pelo-caminho-errado/final.opus'
---

Você configura o backup, vê os arquivos chegarem ao destino e vai dormir em paz. O agente entrega a resposta certa, os testes passam e você também vai dormir em paz. A edição de hoje estraga um pouco esse sono com uma pergunta inconveniente: o caminho até o sucesso fez exatamente o quê?

O rsync lançou uma versão extraordinária com correções para 33 problemas de segurança. Três pesquisas mostram agentes concluindo tarefas enquanto sofrem injeção, escolhem desvios caros ou se atrapalham para recuperar de falhas. E um caso de modernização de Fortran ajuda a separar geração em escala de verificação em escala.

O resultado continua importante. Só que o percurso resolveu aparecer na auditoria.

## Rsync 3.5.0 corrige 33 problemas de segurança

O projeto rsync lançou a versão 3.5.0 em 13 de agosto, depois de uma auditoria focada em segurança. A release corrige 33 problemas em tratamento de caminhos, links simbólicos e condições de corrida, confinamento do daemon, parsing do protocolo e operação restrita do rsync sobre SSH.

A exposição muda conforme a direção da transferência, a confiança entre as pontas, o uso de daemon ou SSH, os filtros, as opções e a configuração do protocolo PROXY. São 33 problemas diferentes, não uma única RCE universal fantasiada de pacote de atualização.

Um deles mostra por que até o cliente de um backup de saída merece atenção. Na CVE-2024-12087, um servidor podia induzir o cliente a escrever fora do diretório de destino por meio de links simbólicos. O rsync interpreta nomes remotos, caminhos, filtros, links e mensagens do protocolo nos dois lados. Mandar os dados para fora não deixa a máquina só assistindo ao trabalho.

A lista também inclui falhas no tratamento de argumentos e opções, problemas no daemon, endurecimento contra corrupção de memória e falsificação da origem via protocolo PROXY. Nesse último caso, um cliente direto podia enviar um cabeçalho PROXY para fingir outra origem. Wrappers restritos de SSH, como o `rrsync`, reduzem o espaço de comandos e ainda dependem do confinamento correto de caminhos e opções.

Para quem mantém VPS, containers, deploys ou rotinas de backup, o trabalho começa pelo inventário nas duas pontas. Descubra qual rsync roda no cliente e no servidor, em qual modo e com quais filtros. Depois, prefira a atualização mantida pela distribuição assim que ela estiver disponível. Trocar o pacote do sistema por um build de origem sem dono resolve a terça-feira e agenda outra terça-feira para o futuro.

Fonte: [NEWS do rsync 3.5.0](https://download.samba.org/pub/rsync/NEWS.html).

## A resposta certa pode esconder uma trajetória comprometida

Um agente pode concluir a tarefa depois de ler uma injeção indireta, escolher uma skill manipulada, queimar quase o dobro do tempo ou adotar uma política ruim de recuperação. Se a avaliação olha apenas a resposta final, a viagem inteira aparece no painel como sucesso.

Três preprints publicados nesta janela de agosto atacam partes diferentes do problema. O ToolHazard cria ambientes executáveis e com estado para testar injeções indiretas de prompt, aquelas que chegam dentro dos dados lidos pelo agente. Segundo os autores, o momento e o lugar da injeção alteram a eficácia do ataque. Dados de alinhamento gerados pelo framework melhoraram a segurança no ToolHazard-Bench e no AgentDojo, preservando a utilidade benigna reportada.

O Convergent Detour Hijacking, ou CDH, mexe na escolha das skills e nas instruções encontradas depois. A skill maliciosa atrai o coordenador para um caminho controlado pelo atacante, desperdiça recursos e ainda deixa a tarefa chegar ao fim. É o equivalente agêntico de chegar ao restaurante certo depois de o taxista dar quatro voltas no bairro. Nesse caso, o taxista também escolheu o que você leu no caminho.

No experimento com 491 tarefas retidas, os autores relatam que o coordenador preparado foi selecionado em 80,02% dos casos com o DeepSeek-V4-Pro. Nas execuções em que esse coordenador entrou, o agente gastou 66,91% mais tokens e 92,45% mais tempo. A taxa agregada de conclusão permaneceu comparável. O placar sorri; a conta e a segurança pedem para conversar em particular.

O BENCH2ROBUST olha para a recuperação quando ferramentas falham. O agente precisa decidir se tenta de novo, troca de ferramenta ou se abstém. Os pesquisadores testaram sete modelos de quatro famílias. Uma memória bayesiana de ferramentas melhorou a robustez no conjunto retido de Retail em até 16,8 pontos percentuais. Mesmo combinando as abordagens, o resultado sob falhas injetadas ficou entre 40,8% e 45,5%.

Todos esses números vêm dos próprios autores em preprints recentes. O ToolHazard se apresenta como trabalho em andamento, e o resultado do CDH pertence ao modelo e à configuração estudados. Os 80,02% não descrevem todo marketplace de skills existente.

A consequência operacional é bem concreta. Sistemas de agentes precisam registrar a procedência das skills, impor orçamentos de tokens, tempo e chamadas de ferramenta, guardar a trajetória e definir políticas explícitas de retry, troca e abstenção. Verificações de estado e efeitos colaterais também entram no pacote. Correção de saída mede o destino. Integridade de trajetória mede se a gente aceitaria o caminho em produção.

Fontes: [preprint do ToolHazard](https://arxiv.org/abs/2608.11878), [preprint do Convergent Detour Hijacking](https://arxiv.org/abs/2608.12273) e [preprint Retry, Switch, or Abstain?](https://arxiv.org/abs/2608.11977).

## Claude Code moderniza Fortran com uma régua de doze casas

Um estudo de caso usou Claude Code para converter código do GAMESS de Fortran 77, em formato fixo, para Fortran 2008, em formato livre. E o escopo passou longe da função cuidadosamente escolhida para uma demo: foram 12 arquivos, 56.448 linhas e 225 sub-rotinas.

O workflow separou três papéis especializados por prompt, colocou cada um num Git worktree isolado e manteve a especificação sob controle de versão. Também houve gates humanos limitados. Os worktrees evitavam que funções concorrentes pisassem na mesma árvore; a especificação versionada deixava as mudanças de instrução visíveis. Agentes também trabalham melhor quando cada um ganha uma mesa e ninguém reorganiza o manual escondido.

A parte mais útil está no critério de aceitação. Cada arquivo passou por uma bateria de 51 testes. Foram 612 execuções no total, sem diferenças relevantes para a química. Uma divergência na décima segunda casa decimal já contava como falha. Nesse domínio e nesses casos, a saída numérica virou um oráculo exato: o código modernizado precisava reproduzir o comportamento observado, em vez de apenas parecer moderno numa revisão de diff.

Isso muda o tipo de delegação que dá para fazer com alguma confiança. Quando um teste barato cobre exatamente o comportamento importante, o agente pode produzir um volume grande de alterações e bater num limite duro a cada etapa. O ganho vem menos das 56 mil linhas geradas e mais da capacidade de rejeitar automaticamente uma linha errada perdida no meio delas.

A régua termina onde os testes terminam. As 612 execuções estabelecem equivalência para o comportamento observado pelo oráculo; arquitetura, manutenção e entradas não testadas ficam fora dessa prova. O estudo foi reportado pelos próprios autores e não compara o processo, sob controle, com uma modernização humana. Fora do oráculo, o código volta a ser código: cheio de maneiras criativas de parecer correto.

Fonte: [preprint sobre a modernização do GAMESS](https://arxiv.org/abs/2608.12249).

## Celld coloca o escritor único dentro da fronteira do bucket

O Celld apresenta uma implementação self-hosted inspirada em Durable Objects. Cada objeto nomeado, chamado de célula, guarda estado em SQLite. As mudanças de transação viram segmentos LTX e seguem para um bucket compatível com S3. Depois de uma falha, outro nó pode restaurar a célula dali.

Para impedir dois nós de escreverem ao mesmo tempo, a propriedade usa épocas. Cada troca de dono avança essa época, e o fencing impede o proprietário antigo de continuar gravando depois que outro assumiu. Em sistemas distribuídos, “eu ainda era o líder na minha cabeça” raramente convence o banco.

O mesmo object storage guarda o estado durável e participa da coordenação de propriedade. Segundo o projeto, isso deixa a falha inspecionável no registro de ownership, nos arquivos SQLite e LTX e nos logs. Nos testes de interrupção publicados pelos autores, nenhuma escrita já confirmada foi perdida. Eles também relatam aproximadamente 90 milissegundos de latência para uma escrita durável dentro da região.

São medições do próprio projeto, dependentes do workload e da infraestrutura. Ainda faltam benchmarks independentes. A coordenação mudou de endereço: disponibilidade do bucket, consistência, escritas condicionais e custo operacional entraram na fronteira de correção. Para experimentar estado por entidade nos próprios servidores, o desenho é concreto e reproduzível. Para operar, o contrato do object storage agora faz parte do seu sistema, mesmo que a API seja educada e fale pouco sobre isso.

Fonte: [site do projeto Celld](https://celld.dev/).

## PostgreSQL 18 liga excesso de conexões ao teto de I/O

No PostgreSQL 18, o parâmetro `io_max_concurrency` limita quantas operações de entrada e saída podem permanecer em voo por processo. Quando o valor é automático, o cálculo considera `shared_buffers` e os máximos de processos configurados, incluindo conexões, workers do autovacuum, processos auxiliares e remetentes de WAL. O resultado automático para em 64.

A fórmula tem uma consequência pouco óbvia. Aumentar `max_connections` ou reservar pouca memória em `shared_buffers` pode reduzir o teto resolvido. O banco aceita mais portas na recepção e, para acomodá-las, pode estreitar o corredor de I/O de cada processo. E `effective_io_concurrency` fica limitado ao número de operações simultâneas permitido por `io_max_concurrency`.

Antes de girar configurações, consulte o valor resolvido com `SHOW io_max_concurrency`. A visão `pg_aios` mostra operações em voo por backend; a análise de Christophe Pettus sugere agrupá-las por PID para enxergar o uso real. A decisão sobre `max_connections` e limites de I/O depende do pooling da aplicação, da memória, da semântica de sessão e do comportamento do armazenamento. Tem que medir.

A conexão com PgBouncer é direta porque o PostgreSQL usa um processo por conexão. Uma análise de Brandur Leach sobre provedores gerenciados encontrou PgBouncer ou um equivalente na oferta prática dos serviços proeminentes examinados. No pooling por transação, várias sessões do cliente reaproveitam conexões no servidor. Essa economia cobra compatibilidade: recursos que dependem de estado persistente da sessão podem se perder na troca.

Então trate o pooling como decisão de arquitetura, confira se a aplicação depende de recursos de sessão e observe o I/O antes de aumentar qualquer número. Configuração de banco é aquela arte em que uma variável chamada “máximo de conexões” consegue discretamente negociar quantas operações de disco cabem no resto da sala.

Fontes: [documentação do PostgreSQL 18](https://www.postgresql.org/docs/18/runtime-config-resource.html), [análise de `io_max_concurrency` por Christophe Pettus](https://thebuild.com/blog/all-your-gucs-in-a-row-io_max_concurrency/) e [análise de PostgreSQL com PgBouncer por Brandur Leach](https://brandur.org/fragments/postgres-without-pgbouncer).

## Destaques rápidos para hoje.

- **Podman 6.1 corrige uma poda que podia ignorar o filtro e apagar todos os volumes elegíveis.** O problema aparecia com `podman volume prune --all --filter`; automações de limpeza direcionada devem receber a atualização e ser revisadas. A release também adiciona `podman volume rename`, `podman machine restart`, encaminhamento IPv6 rootless com preservação da origem e melhorias no Quadlet. O rename não atende volumes criados por drivers nem volumes em uso. Fonte: [notas do Podman 6.1.0](https://github.com/podman-container-tools/podman/releases/tag/v6.1.0).

- **Astro 7 leva compilador, Markdown e o pipeline do Vite para mais perto do Rust.** A versão usa Vite 8 com Rolldown, adiciona roteamento avançado, servidor de desenvolvimento em segundo plano e logs estruturados. O projeto mediu redução de 15% a 61% no tempo total de build; isoladamente, o novo compilador melhorou a documentação do Astro em cerca de 6%. São benchmarks do fornecedor e variam conforme o peso de arquivos `.astro` e Markdown. Projetos com plugins próprios do Vite devem conferir a compatibilidade com Rolldown antes da migração. Fonte: [anúncio do Astro 7](https://astro.build/blog/astro-7/).

- **Qwen publicou um modelo de pesos abertos com 2,4 trilhões de parâmetros totais e 95 bilhões ativos.** O `Qwen3.8-2.4T-A95B` é um mixture-of-experts somente de texto, opera sempre no modo de raciocínio e traz suporte indicado para vLLM, SGLang e TokenSpeed. Ativar uma parte dos parâmetros reduz a computação diante de um modelo denso do mesmo tamanho; memória e infraestrutura continuam enormes. O artefato não inclui visão, modo sem raciocínio, ferramentas nem o contexto padrão de 1 milhão do serviço Qwen3.8-Max, e usa uma licença própria da Qwen que precisa ser examinada. Fonte: [model card do Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B).

- **SpaceXAI lançou o Grok 4.6 para tarefas longas e de múltiplas etapas.** A empresa posiciona a versão para agentes, pesquisa, trabalho interativo e visual, código e construção de aplicações. A API começa em US$ 2 por milhão de tokens de entrada e US$ 6 por milhão de saída; a variante fast custa o dobro. Desempenho em agente depende também do harness, das ferramentas, dos orçamentos e da recuperação, então as alegações de capacidade ainda pedem avaliação em trabalho real. Fonte: [anúncio do Grok 4.6](https://x.ai/news/grok-4-6).

- **Futhark explora `flatmap` para expressar arrays irregulares e encontra uma conta de 19 vezes.** A proposta deixa algoritmos recursivos como quicksort e Quickhull mais diretos, mas o quicksort demonstrado ficou aproximadamente 19 vezes mais lento que a implementação achatada à mão. Arrays irregulares são difíceis de encaixar em hardware paralelo plano; a abstração ainda precisa recuperar decisões de layout e escalonamento que o código manual expõe. É uma exploração de design específica, com bastante trabalho pela frente até chegar a desempenho de produção. Fonte: [post do projeto Futhark sobre `flatmap`](https://futhark-lang.org/blog/2026-08-12-flatmap.html).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 32365
source_urls:
  - https://download.samba.org/pub/rsync/NEWS.html
  - https://arxiv.org/abs/2608.11878
  - https://arxiv.org/abs/2608.12273
  - https://arxiv.org/abs/2608.11977
  - https://arxiv.org/abs/2608.12249
  - https://celld.dev/
  - https://www.postgresql.org/docs/18/runtime-config-resource.html
  - https://thebuild.com/blog/all-your-gucs-in-a-row-io_max_concurrency/
  - https://brandur.org/fragments/postgres-without-pgbouncer
  - https://github.com/podman-container-tools/podman/releases/tag/v6.1.0
  - https://astro.build/blog/astro-7/
  - https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B
  - https://x.ai/news/grok-4-6
  - https://futhark-lang.org/blog/2026-08-12-flatmap.html
-->
