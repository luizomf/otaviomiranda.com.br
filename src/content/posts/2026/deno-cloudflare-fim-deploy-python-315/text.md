---
title: 'Deno vai para a Cloudflare e anuncia fim do Deploy; Python 3.15 chega estável'
description: 'Deploy terá mais seis meses de operação. A edição também traz a nova onda de GhostAction, imports adiados no Python e mudanças em Bun, bancos de dados e ferramentas para agentes.'
date: '2026-10-10T05:15:26-03:00'
author: 'The Paper LLM'
image: './images/deno-cloudflare-fim-deploy-python-315.jpg'
---

![Calendário com o logo do Deno Deploy e aviso de encerramento em seis meses.](./images/deno-cloudflare-fim-deploy-python-315.jpg)

Quem usa Deno Deploy tem uma migração para planejar: o serviço será desligado em seis meses, após a ida da equipe para a Cloudflare. A edição deste sábado também traz uma nova onda de roubo de credenciais pelo GitHub Actions, cuidados para adotar o Python 3.15 e novidades para testar código e investigar aplicações em produção.

## Equipe do Deno vai para a Cloudflare; Deploy fecha em seis meses

Ryan Dahl anunciou em **9 de outubro** que toda a equipe do Deno está se juntando à Cloudflare. O **Deno Deploy**, serviço de hospedagem de aplicações, continuará operando por seis meses a partir do anúncio. Clientes pagantes terão apoio de migração para Cloudflare Workers, a plataforma de execução de código da empresa.

O **runtime Deno**, ambiente que executa JavaScript e TypeScript, terá mais um ano de versões mensais com correções de bugs e segurança. Depois, a equipe encerrará seu desenvolvimento. O código continuará aberto, disponível para outros mantenedores. O **JSR**, registro de pacotes, seguirá funcionando, com sua infraestrutura transferida para a Cloudflare.

O novo trabalho reúne **workerd**, o runtime aberto do Cloudflare Workers, e **celld**, projeto voltado a executar esse modelo em infraestrutura própria. A meta é facilitar também a operação distribuída de Durable Objects: unidades de execução com estado persistente que podem representar, por exemplo, uma sala de chat com seu banco de dados e suas conexões.

A Cloudflare reconhece que o suporte atual a Durable Objects no workerd aberto está limitado a uma única instância. A integração pretende superar essa restrição, mas ainda é um plano de desenvolvimento. Para quem depende do Deploy, a ação imediata é inventariar as aplicações e testar alternativas de hospedagem dentro do prazo anunciado.

Fontes: [anúncio do Deno](https://deno.com/blog/cloudflare) e [plano conjunto de Ryan Dahl e Kenton Varda](https://blog.cloudflare.com/deno-joins-cloudflare/).

## GhostAction volta com busca de credenciais no histórico Git, relata StepSecurity

A StepSecurity publicou em **9 de outubro** uma investigação sobre ataques do dia anterior. Segundo a empresa, duas contas de mantenedores comprometidas foram usadas para inserir workflows maliciosos em **345 repositórios**, incluindo forks — cópias de outros projetos. Os arquivos se apresentavam como uma auditoria de segurança.

Workflows são as rotinas de automação do GitHub Actions, usadas para tarefas como testar e publicar software. Nesse ataque, o código buscava segredos referenciados na configuração, além de padrões de credenciais nos arquivos e no histórico Git. **Apagar uma chave do código atual não a invalida no serviço que a emitiu**: se ela permanecer no histórico e continuar ativa, ainda poderá ser usada.

Em uma execução analisada, o servidor do atacante confirmou o recebimento da requisição quatro segundos após o início do workflow, segundo a StepSecurity. O relatório não estabelece roubo bem-sucedido em todos os 345 repositórios; a varredura tinha limites de volume e erros em algumas expressões de busca.

A revisão dos mantenedores deve começar por alterações não autorizadas em `.github/workflows` e pelos registros das execuções. É preciso revogar a credencial comprometida que permitiu alterar o repositório e, havendo exposição, revogar e substituir os segredos afetados, inclusive os ainda válidos encontrados no histórico. Revisão de mudanças nos workflows e aprovação para acesso a segredos de ambientes acrescentam barreiras a esse tipo de ataque.

Fontes: [investigação da StepSecurity](https://www.stepsecurity.io/blog/ghostaction-returns) e [orientações de segurança do GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).

## Python 3.15 chega estável com imports adiados e UTF-8 por padrão

O **Python 3.15 foi lançado em 9 de outubro**. Duas mudanças merecem atenção na migração: a possibilidade de adiar imports explicitamente e o uso de UTF-8 como codificação padrão em operações de entrada e saída sem codificação declarada.

Com `lazy import`, o carregamento do módulo fica para o primeiro uso do nome importado. Isso pode reduzir o tempo de partida quando o programa usa apenas parte das dependências que costuma carregar. Também adia os efeitos dessa importação: um módulo que registra plugins ao carregar pode deixar de fazê-lo no momento esperado. A adoção é explícita; imports comuns mantêm o comportamento habitual no modo padrão.

O **Lifeguard**, analisador estático da Meta, ajuda a localizar padrões incompatíveis com esse adiamento. A ferramenta examina o código sem executá-lo, está em beta e adota uma avaliação conservadora: módulos cuja segurança não consegue determinar são marcados como incompatíveis.

Já a mudança para UTF-8 exige cuidado com arquivos legados. Ao ler dados em outra codificação, declare-a explicitamente e teste arquivos reais do projeto. A versão também inclui o profiler Tachyon, [apresentado aqui durante o pré-lançamento](/2026/fortimail-falha-explorada-pi-durable-recuperacao-agentes/), que coleta amostras da execução para investigar onde o programa gasta tempo.

No **uv 0.13.0**, gerenciador de projetos e instalações Python, downloads sem versão solicitada ou fixada passam a escolher Python 3.15. Instalações compatíveis já presentes continuam sendo aproveitadas. Fixar a versão do projeto evita diferenças inesperadas de interpretador ao preparar uma nova máquina.

Fontes: [novidades oficiais do Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html), [Lifeguard](https://github.com/facebook/Lifeguard) e [notas do uv 0.13.0](https://github.com/astral-sh/uv/releases/tag/0.13.0).

## Destaques rápidos para hoje.

- **Bun 1.4.3 ganha verificação de tipos TypeScript.** A versão de 10 de outubro adiciona `bun check`, que lê o `tsconfig.json` sem exigir o pacote TypeScript instalado. Quem usa Bun para executar e empacotar projetos também pode acrescentar `--check` a `bun run`, `bun test` e `bun build`: erros de tipos interrompem a operação antes de ela começar. O verificador não gera JavaScript nem arquivos de declaração, e o servidor de linguagem do editor continua sendo uma ferramenta separada. Fonte: [anúncio do Bun 1.4.3](https://bun.com/blog/bun-v1.4.3).

- **PostgreSQL: `RETURNING` pode explicar uma inserção bloqueada pela segurança por linha.** Em testes publicados em 10 de outubro, Chris van Eijk mostrou o caso no PostgreSQL 17.11. Políticas de segurança por linha restringem quais registros um usuário pode acessar; uma delas pode permitir inserir uma linha sem permitir sua leitura. Ao acrescentar `RETURNING id` para receber o identificador gravado, a instrução precisa também satisfazer a política de leitura. Para investigar a diferença entre uma inserção manual e a feita pela aplicação, reproduza a instrução exata com o mesmo usuário do banco e o mesmo contexto da transação. Fontes: [experimento da Now-Next](https://now-next.nl/en/insights/postgresql-new-row-violates-row-level-security-policy/) e [documentação do PostgreSQL 17](https://www.postgresql.org/docs/17/sql-createpolicy.html).

- **StackGres detalha roteadores de consultas entregues na versão 1.19.** A plataforma de operação de PostgreSQL no Kubernetes apresentou, em 9 de outubro, outra opção para aliviar o coordenador do Citus, que distribui dados entre máquinas. Os roteadores recebem conexões, planejam consultas e as encaminham aos nós que guardam as partições. Essa camada pode crescer separadamente do armazenamento; o coordenador continua cuidando das alterações de estrutura e topologia. Os roteadores também podem manter cópias de tabelas de referência. Fonte: [arquitetura dos Query Routers no StackGres](https://stackgres.io/blog/scaling-citus-beyond-one-coordinator-announcing-query-routers-stackgres/).

- **Cloudflare libera perfis de CPU e memória de Workers e Durable Objects em produção.** Desde o anúncio de 9 de outubro, é possível solicitar a captura pelo painel ou pela linha de comando e examinar um flamegraph, gráfico que relaciona funções ao consumo observado. A captura depende de uma instância ativa com tráfego. Para memória, o perfil registra alocações durante a janela escolhida, podendo deixar de fora as feitas na inicialização. Isso ajuda a localizar funções caras durante o uso real da aplicação. Fonte: [anúncio da Cloudflare](https://blog.cloudflare.com/workers-on-demand-profiling/).

- **Prime Agent lança reescrita em Rust e suporte nativo a Windows em beta.** A Prime Intellect anunciou em 9 de outubro a nova implementação de seu agente de programação. Segundo a equipe, testes compararam telas do terminal, sessões, requisições ao modelo e mensagens do protocolo com a versão TypeScript. O uso interno ainda revelou bugs e comportamentos ausentes fora da cobertura dos testes, exigindo revisão e ajustes orientados por pessoas. O relato oferece um exemplo de validação para migrações assistidas por agentes. Fonte: [relato da Prime Intellect](https://www.primeintellect.ai/blog/prime-agent-rust).

- **Ai2 relata menos espera por GPUs após mudar sua política de compartilhamento.** Em texto de 9 de outubro sobre uma implantação iniciada em julho, o instituto descreve orçamentos de tempo por equipe e períodos mínimos de execução protegida. Segundo suas medições, o limite de espera que abrange 90% dos trabalhos de depuração caiu de duas horas para 30 segundos. A amostra anterior era menor e mais variável. A ocupação permaneceu em 98% — proporção do tempo disponível reservado a trabalhos. Após a janela protegida, sessões interativas podem ser interrompidas e perder o estado mantido em memória, um custo da redistribuição dos recursos. Fonte: [engenharia de infraestrutura do Ai2](https://huggingface.co/blog/allenai/impactful-scheduling).

- **SQLite 3.54.0 encerra suporte ao Windows XP e altera comandos do terminal SQL.** Lançada em 9 de outubro, a versão passa a exigir Windows Vista ou posterior; essa mudança de plataforma não afeta Linux, macOS e outros sistemas Unix. No terminal, `.diskused` passa a analisar o espaço ocupado no banco, substituindo o utilitário `sqlite3_analyzer`, agora marcado como obsoleto. Scripts que usam linhas contendo apenas `go` ou `/` para encerrar comandos SQL precisam de revisão: esse comportamento deixa de estar disponível na compilação padrão. Fonte: [notas oficiais do SQLite 3.54.0](https://www.sqlite.org/releaselog/3_54_0.html).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28362
source_urls:
  - https://deno.com/blog/cloudflare
  - https://blog.cloudflare.com/deno-joins-cloudflare/
  - https://www.stepsecurity.io/blog/ghostaction-returns
  - https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
  - https://docs.python.org/3.15/whatsnew/3.15.html
  - https://github.com/facebook/Lifeguard
  - https://github.com/astral-sh/uv/releases/tag/0.13.0
  - https://bun.com/blog/bun-v1.4.3
  - https://now-next.nl/en/insights/postgresql-new-row-violates-row-level-security-policy/
  - https://www.postgresql.org/docs/17/sql-createpolicy.html
  - https://stackgres.io/blog/scaling-citus-beyond-one-coordinator-announcing-query-routers-stackgres/
  - https://blog.cloudflare.com/workers-on-demand-profiling/
  - https://www.primeintellect.ai/blog/prime-agent-rust
  - https://huggingface.co/blog/allenai/impactful-scheduling
  - https://www.sqlite.org/releaselog/3_54_0.html
-->
