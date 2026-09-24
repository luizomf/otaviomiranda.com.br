---
title: 'Plugin da MemTensor executa código malicioso durante o uso; PostgreSQL mantém transações sem sessão'
description: 'Entenda o risco no plugin de memória, a recuperação de transações preparadas no PostgreSQL e como o GitHub renderiza PRs com mais de um milhão de linhas alteradas.'
date: '2026-09-24T05:15:00-03:00'
author: 'The Paper LLM'
image: "./images/memtensor-executa-no-uso-postgresql-mantem-transacoes-sem-sessao.jpg"
---

![Cartucho ilustrativo do plugin MemTensor conectado, com aviso de risco durante o uso.](./images/memtensor-executa-no-uso-postgresql-mantem-transacoes-sem-sessao.jpg)

Desabilitar scripts de instalação ajuda a controlar dependências, mas não impede que uma biblioteca execute código quando a aplicação a carrega. A investigação sobre um plugin de memória para agentes mostra esse limite de maneira bem concreta. No PostgreSQL, outro detalhe merece atenção: transações preparadas para um commit em duas fases sobrevivem à desconexão e ao reinício do servidor. São problemas diferentes, mas ambos exigem olhar além do momento em que a instalação ou a sessão termina.

## O plugin comprometido espera a aplicação funcionar

A StepSecurity publicou em 23 de setembro uma investigação sobre versões maliciosas de `@memtensor/memos-cloud-openclaw-plugin`. O pacote conecta agentes OpenClaw a um serviço de memória, usado para recuperar informações de interações anteriores. Essa integração coloca o plugin no caminho de execução dos pedidos do usuário.

Segundo a análise, as versões **0.1.21, 0.1.23 e 0.1.25** contêm um lançador de executáveis embutidos no pacote. Ele é chamado na inicialização do gateway e durante a recuperação de memória. Recebe o ambiente do processo, que pode incluir credenciais; na recuperação de memória, recebe também o texto do pedido do usuário.

O código malicioso não depende de `preinstall`, `install` ou `postinstall`. Por isso, instalar com scripts desabilitados não torna seguro usar essas versões. Há duas perguntas diferentes na investigação de uma máquina: o pacote chegou ao disco? E a aplicação carregou o plugin e acionou esses caminhos?

O histórico de publicação também preocupa. Duas versões com conteúdo limpo foram seguidas por novas versões maliciosas em menos de quatro minutos. Um relato aberto no repositório descreve artefatos npm sem commits ou tags correspondentes. Isso aponta para a necessidade de investigar o acesso à publicação; não prova, sozinho, qual credencial foi roubada ou como o invasor entrou.

Para quem usa o pacote, a prioridade é interromper o uso das versões afetadas, identificar onde elas foram carregadas e avaliar as credenciais acessíveis nesses ambientes. Para quem mantém a distribuição, publicar uma versão limpa precisa vir acompanhado de revogação de acessos comprometidos e revisão do processo de release. Se a porta da publicação continua aberta, o próximo pacote pode trazer tudo de volta.

O autor do relato no repositório informa que examinou o código e os artefatos sem executar os binários: essa é a limitação da sua análise estática. O acesso do lançador ao ambiente e aos pedidos sustenta o alerta sobre segredos e prompts, mas não demonstra que toda instalação sofreu exfiltração, isto é, envio de dados para fora do ambiente. A ausência de scripts de instalação, por sua vez, não elimina a oportunidade de execução posterior.

Fontes: [investigação da StepSecurity](https://www.stepsecurity.io/blog/sckit-supply-chain-worm-hits-memtensor-npm-pypi-scopes) e [relato no repositório do plugin](https://github.com/MemTensor/MemOS-Cloud-OpenClaw-Plugin/issues/173).

## A transação do PostgreSQL que não termina com a conexão

Christophe Pettus publicou em 23 de setembro uma demonstração de `max_prepared_transactions`, parâmetro do PostgreSQL que controla quantas transações podem permanecer no estado preparado. O recurso faz parte do **commit em duas fases**, usado para coordenar uma operação entre participantes: primeiro, um coordenador externo pede que cada um prepare seu trabalho; depois, comunica a decisão de confirmar ou desfazer a operação. Estar preparado ainda não é ter confirmado a transação.

Depois de `PREPARE TRANSACTION`, o trabalho deixa de pertencer à sessão que o iniciou. Seu estado fica persistido, e os bloqueios continuam existindo. Desconectar o cliente ou reiniciar o banco não encerra essa obrigação. Essa persistência é justamente o que permite ao coordenador retomar o protocolo depois de uma falha.

No experimento de Pettus com PostgreSQL 18.6, uma transação preparada impediu uma alteração de tabela e manteve registros mortos que o `VACUUM`, responsável pela limpeza, ainda não podia remover. A criação de um slot de replicação lógica também ficou esperando uma transação antiga terminar.

O perigo aparece quando o coordenador desaparece e ninguém assume a recuperação. A transação já não está vinculada a um processo de atendimento da conexão que possa ser encerrado; os limites de tempo da sessão não resolvem. Ela precisa de `COMMIT PREPARED` ou `ROLLBACK PREPARED`, executado no mesmo banco pelo papel de acesso (role) que a preparou ou por um superusuário. Essa decisão deve respeitar o resultado da operação distribuída: sair desfazendo tudo por idade pode contrariar o que outros participantes já fizeram.

A documentação recomenda manter `max_prepared_transactions` em zero quando não houver um gerenciador externo acompanhando e encerrando essas transações. Se o sistema precisa do recurso, monitore a idade das entradas em `pg_prepared_xacts` e defina quem consulta o coordenador e resolve os casos pendentes. O alerta precisa encontrar um responsável, não apenas acordar alguém para tentar reiniciar o banco.

Fontes: [demonstração de Christophe Pettus](https://thebuild.com/blog/all-your-gucs-in-a-row-max_prepared_transactions/) e [documentação de PREPARE TRANSACTION](https://www.postgresql.org/docs/current/sql-prepare-transaction.html).

## GitHub separa linhas de código e comentários para renderizar PRs enormes

Em um relato de engenharia de 23 de setembro, o GitHub descreve a reconstrução da visualização de pull requests no aplicativo GitHub Copilot. A equipe usou como caso extremo um PR com 2.200 arquivos, mais de um milhão de linhas alteradas e mais de 400 comentários inline.

A técnica básica é a virtualização: criar elementos de interface apenas para a região visível e uma pequena margem ao redor. O restante existe como dados e cálculos de posição, não como um milhão de elementos no navegador.

Comentários complicam essa conta de alturas e posições. Uma linha de código tem geometria previsível no modelo descrito; um comentário pode crescer quando uma imagem carrega, o texto quebra em outra largura ou alguém abre a caixa de resposta. Recalcular tudo durante a rolagem produz saltos e travamentos.

A solução mantém dois cálculos de posição: um para o código, cujas dimensões são previsíveis nesse modelo, e outro para os blocos dinâmicos de comentários. Estes usam alturas estimadas, medidas e armazenadas em cache. Um agendador concentra as medições perto da área visível e evita fazê-las durante a rolagem ativa. Ao corrigir uma altura, a interface preserva a posição do conteúdo que o usuário estava lendo.

O detalhe útil para outros frontends está na medição do resultado. A equipe instrumentou quantos elementos ficam montados, quanto custam as correções e se aparecem espaços vazios. Esses sinais viraram limites verificados em testes. A experiência de fluidez relatada é do GitHub; a lição reaproveitável é separar o custo previsível daquele que depende da renderização e testar os dois sob carga.

Fonte: [engenharia do GitHub](https://github.blog/engineering/user-experience/rendering-huge-pull-requests-in-the-github-copilot-app/).

## Destaques rápidos para hoje.

- **Ubuntu prepara releases semanais de kernel com ciclos de duas semanas sobrepostos.** No anúncio de 23 de setembro, a Canonical reserva uma semana para preparação e outra para certificação, integração e regressão; um novo ciclo começa a cada semana. O repositório `-proposed` permite iniciar testes próprios antes da certificação, mas não equivale à versão já validada. A empresa também estabelece como objetivo oferecer mitigação ou orientação de endurecimento em 24 a 48 horas após a divulgação de uma falha, quando aplicável — não promete um patch nesse prazo. Fonte: [Canonical](https://canonical.com/blog/accelerating-delivery-of-cve-fixes-with-a-new-kernel-release-strategy).

- **Um backup novo não conserta uma lacuna antiga no histórico de recuperação.** Stefan Fercot demonstrou em 23 de setembro um failover de PostgreSQL no qual faltava arquivamento de WAL, o registro das alterações usado na recuperação. Um backup posterior pôde ser restaurado, mas isso não recompôs os registros ausentes necessários para recuperar um backup anterior através da troca de servidor principal. Configure `archive_mode=on` nos servidores que poderão assumir como principal com antecedência — a mudança exige reinício — e confira se o arquivamento está pronto antes da troca. Teste a recuperação que você precisa garantir, não só a criação do próximo backup. Fonte: [experimento de pgBackRest e failover](https://pgstef.github.io/2026/09/23/pgbackrest_and_postgresql_failover_why_archive_mode_matters.html).

- **GKE integra o caminho para desligar e reacordar workers por métricas externas.** Depois do [HPA com escala até zero no Kubernetes 1.37](/2026/kubernetes-1-37-leva-o-hpa-a-zero-e-skills-enviesam-agentes/), o anúncio do Google de 23 de setembro detalha a integração gerenciada no GKE 1.37: um recurso `AutoscalingMetric` alimenta o HPA, o controlador que ajusta a quantidade de réplicas da aplicação, por exemplo com o número de mensagens pendentes no Pub/Sub. A integração ainda exige configurar esse recurso customizado; não elimina essa etapa. Os buffers de capacidade mantêm computação aquecida compartilhada para reduzir a espera de retorno; zero réplicas de um worker não significa custo total zero do cluster. Meça do recebimento da mensagem até o processamento útil. Fonte: [Google Cloud](https://cloud.google.com/blog/products/containers-kubernetes/gke-adds-native-scale-to-zero-capabilities/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27948
source_urls:
  - https://www.stepsecurity.io/blog/sckit-supply-chain-worm-hits-memtensor-npm-pypi-scopes
  - https://github.com/MemTensor/MemOS-Cloud-OpenClaw-Plugin/issues/173
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_prepared_transactions/
  - https://www.postgresql.org/docs/current/sql-prepare-transaction.html
  - https://github.blog/engineering/user-experience/rendering-huge-pull-requests-in-the-github-copilot-app/
  - https://canonical.com/blog/accelerating-delivery-of-cve-fixes-with-a-new-kernel-release-strategy
  - https://pgstef.github.io/2026/09/23/pgbackrest_and_postgresql_failover_why_archive_mode_matters.html
  - https://cloud.google.com/blog/products/containers-kubernetes/gke-adds-native-scale-to-zero-capabilities/
-->
