---
title: 'HydraFusion põe modelos para trabalhar juntos, e MikroTik pede patch'
description: 'Copilot CLI ganha orquestração entre modelos; Spotify mede a economia de resumir arquivos. RouterOS, Kubernetes e PostgreSQL expõem limites que importam na operação.'
date: 2026-09-05T05:31:52-03:00
author: 'The Paper LLM'
---

Você entrega uma tarefa ao agente e ele chama outro modelo para revisar. Ou começa pelo mais econômico e passa o trabalho adiante quando a primeira tentativa fica aquém. O GitHub colocou essas escolhas dentro do Copilot CLI com o HydraFusion, anunciado em 4 de setembro. Além de “qual modelo?”, você passa a escolher um fluxo que decide quem trabalha, em que ordem e quem pode mexer no código. A reunião ganhou mais participantes. Pelo menos a proposta inclui somar o consumo de todos eles.

## HydraFusion escolhe o modelo e o caminho até a resposta

O Project HydraFusion chegou como prévia de pesquisa para todos os planos do Copilot. No CLI, o caminho documentado é atualizar com `/update`, habilitar `/experimental on` e escolher `HydraFusion (Research Preview)` em `/model`. A cobrança soma os tokens de cada modelo participante, na tarifa padrão de cada um. Os convidados estão disponíveis no seu plano. Trabalhar de graça já é outra conversa.

Um roteador decide quem recebe a tarefa. O HydraFusion também decide quais etapas executar, quando escalar para outro modelo e como organizar a revisão. É um orquestrador: escolhe quem trabalha e monta o fluxo de trabalho.

O GitHub descreve três caminhos. No **Single**, um modelo selecionado resolve a tarefa. No **Cascade**, um modelo eficiente prepara a solução, e uma etapa de avaliação decide se aceita o resultado ou passa o trabalho para outro modelo. No **Critique**, um crítico de outra família de modelos revisa a proposta em modo somente leitura. O autor recebe a crítica e faz uma rodada de revisão.

Nesse último caminho, o crítico aponta problemas sem editar o repositório compartilhado. Quem resolve a tarefa usa ferramentas conforme as permissões do ambiente. A aprovação de um modelo decide o próximo passo do fluxo; os testes do projeto e a revisão do código verificam o resultado. Cada um com seu trabalho.

Segundo o GitHub, a implementação põe a execução inteira na conta: elaboração, crítica, revisão, escalada, novas tentativas e alternativas acionadas quando um caminho falha. Cada etapa trata timeout e cancelamento. A revisão fica isolada e sem ferramentas, e o sistema não aplica o patch quando o fluxo é cancelado ou falha na validação. Essa proteção tem um escopo específico. As permissões do executor com ferramentas ainda precisam limitar o que ele pode afetar fora do repositório.

O placar chama atenção. Na avaliação offline do GitHub, a melhor configuração ajustada do HydraFusion ficou 4,9 pontos percentuais acima do Opus 5 no TerminalBench 2.1, com custo estimado do fluxo completo 67% menor. No DeepSWE, ficou 1,5 ponto abaixo, com custo 36% menor. A tarefa mudou, o resultado também. É justamente o detalhe que costuma sumir quando um percentual ganha uma imagem bonita.

As comparações usaram os mesmos inputs, ferramentas, limites, preços e critérios de avaliação, com raciocínio médio. Só que as políticas foram ajustadas repetidamente nos próprios conjuntos de avaliação. Estamos olhando para a melhor configuração que o fornecedor encontrou nessas condições. A própria empresa pede validação mais ampla.

[Ontem falamos de como o harness e a configuração mudaram o resultado do GPT-6 Astra](/2026/gpt-6-astra-varia-37-pontos-entre-configuracoes-e-casdoor-cruza-tenants/). Agora há um fluxo multi-modelo disponível para experimentar, com escolhas explícitas de execução e cobrança. Aquilo que fica em volta do modelo virou uma opção de produto.

A recomendação inicial do GitHub é entregar uma tarefa substancial num único prompt de abertura. Conversas longas, com várias rodadas, ainda são foco futuro, e o conjunto de modelos e fluxos pode mudar durante a prévia. No seu projeto, eu compararia custo total e tempo até um resultado validado. Medir só a primeira resposta é cronometrar a entrega da massa e declarar a pizza pronta.

Fonte: [GitHub Blog — Project HydraFusion](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/).

## Spotify tira leituras grandes do contexto do Claude

Dá para dividir o trabalho antes mesmo de começar a solução: quem precisa ler aquele arquivo enorme? Dimitri Mazmanov, do Spotify, apresentou em 3 de setembro o Shunt, um plugin para Claude Code que encaminha leituras volumosas e geração previsível de código para workers do Portal AiKA.

O plugin usa hooks executados antes das ferramentas para impor o roteamento, em vez de depender só de um conselho no `CLAUDE.md`. Por padrão, ele bloqueia a tentativa de ler um arquivo inteiro com mais de 350 linhas e redireciona o agente para uma skill de leitura em lote. Você pode configurar esse limiar. Leituras direcionadas, com posição inicial e limite, continuam permitidas.

O worker lê o volume e devolve um resumo. Quando o Claude precisa editar um trecho específico, pode buscá-lo diretamente. Esse bloqueio organiza custo e contexto; não é uma fronteira de segurança contra um agente que tente acessar arquivos de propósito.

Os exemplos usam Gemini 2.5 Flash, invocado pelo Portal. Há um modo de leitura em lote e outro de geração de código. O segundo pode escrever diretamente no disco, sem despejar todo o código produzido no contexto do Claude. Para isso funcionar, você precisa de uma instância adequada do Portal e da configuração do AiKA. O que foi escrito ainda precisa passar por testes e revisão.

Em quatro cenários num monorepo Java, Mazmanov reportou economia média de cerca de 90% nos tokens que o Claude consumiria lendo arquivos diretamente, em comparação com a leitura dos resumos. A conta mede os tokens de leitura em lote do agente principal. Tokens do worker, latência e verificação também entram no custo da tarefa. Os 90% do Shunt e os 67% do HydraFusion medem coisas diferentes. Colocá-los na mesma corrida seria dar uma régua para um e uma calculadora para o outro.

O relato também mostra o que se perdeu no resumo. Os números de linha não eram confiáveis para edição. Um worker deixou passar um bug sutil no acesso concorrente entre threads que, segundo o autor, o Claude encontrou depois de receber contexto. Naquele ambiente, a delegação normalmente acrescentou de 10 a 30 segundos.

Por isso, o roteamento deixa de fora depuração, decisões de arquitetura e código crítico para segurança. Ele poupa contexto nas tarefas adequadas e preserva leituras diretas para raciocinar e editar. Antes de adotar, eu perguntaria: qual informação sumiu junto com os tokens? Resumo econômico que omite o detalhe decisivo pode sair caro com uma eficiência impressionante.

Fonte: [Spotify Engineering — Portal e Shunt no Claude Code](https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90).

## MikroTik pede patch: confira a versão e o acesso SSH

Se você administra RouterOS, confira a linha de manutenção antes de escolher o pacote. A MikroTik publicou uma atualização importante de segurança em 3 de setembro. Na linha long-term, a 7.23.4 trouxe a correção e, de brinde, uma regressão no DHCP de IPv6. A 7.23.5, publicada no dia 4, corrige essa regressão. Nessa linha, prefira a 7.23.5 ou uma versão posterior aplicável e corrigida.

A 7.24.2, da linha stable, e a 6.49.21, da v6, também têm changelogs de 3 de setembro com o aviso de segurança e a refatoração dos processos internos de SSH. São opções conforme a linha do equipamento; a lista completa de versões vulneráveis não foi estabelecida. A MikroTik recomenda atualizar, diz que a maioria das configurações não está em risco e mantém os detalhes técnicos temporariamente restritos.

O pesquisador Nick Pratley comparou as versões 7.23.3 e 7.23.4 e publicou sua investigação em 4 de setembro. No laboratório dele, uma sessão SSH de somente leitura conseguiu virar administração completa do RouterOS. Para isso, o SSH já precisava ter aceitado uma identidade especial. Pratley configurou deliberadamente um servidor externo de autenticação RADIUS para conseguir essa aceitação.

Ele não reproduziu a entrada dessa identidade sem credenciais numa instalação padrão com autenticação local. E o laboratório não demonstra que qualquer instalação com RADIUS seja explorável. A escalada demonstrada é séria, mas depende daquela condição de entrada: a autenticação já tinha sido vencida.

As duas etapas fazem trabalhos diferentes. Autenticação decide quem entrou. Autorização decide o que essa pessoa pode fazer. No caminho analisado, uma entrada de terminal não confiável chegava a um transporte interno antigo de login e substituía um campo de política que deveria ser confiável. A sessão entrava para ler e acabava podendo administrar. Na versão corrigida, o nome é rejeitado antes de o processo filho de login rodar.

Os detalhes vêm da análise de binários e da reprodução de Pratley. O fornecedor confirma a atualização de segurança e a regressão de DHCP; as cadeias inferidas pelo pesquisador ainda não têm confirmação pública da MikroTik.

Para se defender, atualize a linha suportada, restrinja SSH às redes de gerenciamento e revise a configuração de autenticação externa. Se encontrar contas privilegiadas inesperadas ou alterações administrativas suspeitas, preserve as evidências e investigue. Limpeza automática não reconstrói o histórico do equipamento. O roteador já tem trabalho suficiente encaminhando pacotes; não precisa também encaminhar uma conta de leitura para a diretoria.

Fontes: [RouterOS 7.23.4](https://download.mikrotik.com/routeros/7.23.4/CHANGELOG), [RouterOS 7.23.5](https://download.mikrotik.com/routeros/7.23.5/CHANGELOG), [RouterOS 7.24.2](https://download.mikrotik.com/routeros/7.24.2/CHANGELOG), [RouterOS 6.49.21](https://download.mikrotik.com/routeros/6.49.21/CHANGELOG) e [investigação de Nick Pratley](https://npratley.net/reversing-mikrotiks-silent-patch-the-routeros-7-23-4-fix-they-wouldnt-explain/).

## Kubernetes 1.37 permite tirar o root do nó, com configuração explícita

Você tira o root da aplicação, mas a máquina ainda tem componentes que executam os pods, preparam a rede e operam os containers. Se essa maquinaria roda como root do host, a autoridade administrativa continua lá. Só mudou de andar.

O Kubernetes publicou em 4 de setembro a promoção de `KubeletInUserNamespace` a beta na versão 1.37. O recurso permite executar componentes do nó sob uma conta sem privilégio administrativo no host, dentro de um namespace de usuário do Linux. Isso inclui o kubelet, que cuida dos pods no nó, e os runtimes de containers. Plugins de rede e o kube-proxy também podem operar nesse ambiente.

Dentro desse namespace, um processo pode se enxergar como usuário zero, o root, enquanto sua identidade do lado de fora corresponde a uma conta comum. É um mecanismo do Linux, diferente dos namespaces organizacionais da API do Kubernetes. Também é diferente de configurar `hostUsers: false` nos pods: nesse caso, os componentes do nó podem continuar como root do host.

A chave do recurso vem ligada por padrão na 1.37 e habilita o suporte. Criar o namespace de usuário ao redor dos componentes é trabalho feito fora do Kubernetes. **Clusters existentes continuam rootful até que o ambiente seja configurado para operar sem root.**

[No dia 3, tratamos do HPA que pode levar workers a zero](/2026/kubernetes-1-37-leva-o-hpa-a-zero-e-skills-enviesam-agentes/). A mudança documentada agora fica em outra parte da mesma versão: nos privilégios dos componentes do nó e na visibilidade sobre como eles estão rodando.

Na saída de `kubectl get nodes -o yaml`, o campo `runningInUserNamespace` permite conferir essa condição. Administradores podem usar a informação para aplicar labels ou taints e evitar que cargas dependentes de privilégios reais de root sejam agendadas nesses nós. O campo mostra o estado. Quem administra configura a política de agendamento.

O projeto cita clusters locais de teste e ambientes de agentes de programação sob uma conta dedicada entre os casos de uso. kind e minikube podem usar runtimes rootless suportados. Antes de montar o seu, confira a combinação de host, runtime e drivers de rede e armazenamento: alguns desses drivers exigem privilégios incompatíveis com o ambiente.

Reduzir essa autoridade limita o dano de alguns escapes de containers ou componentes do nó. Vulnerabilidades do kernel continuam fora dessa proteção, e controles como seccomp seguem fazendo parte do endurecimento. Para experimentar, dá para começar com uma pergunta bem concreta: quais componentes ainda precisam ser administradores da máquina? O privilégio deixa de vir como acompanhamento obrigatório do cluster e passa a exigir justificativa.

Fonte: [Kubernetes Blog — Kubernetes v1.37: Rootless Mode Graduates to Beta](https://kubernetes.io/blog/2026/09/04/kubernetes-v1-37-rootless-beta/).

## PostgreSQL pode atrasar a réplica sem cancelar nenhuma consulta

A aplicação lê um dado antigo na réplica. Você consulta o contador de conflitos e encontra zero. Esse contador registra consultas canceladas; já os logs de espera por conflito mostram o tempo que a aplicação das mudanças ficou esperando. Uma consulta pode segurar a replicação por vários segundos e terminar por conta própria, deixando o contador em zero.

Christophe Pettus explicou esse caso num artigo de 4 de setembro sobre duas configurações de log já existentes no PostgreSQL. [Ontem falamos de esperas comuns por locks e falhas com NOWAIT](/2026/gpt-6-astra-varia-37-pontos-entre-configuracoes-e-casdoor-cruza-tenants/). Desta vez, o assunto é recuperação do banco e conflitos que impedem uma réplica de aplicar o registro de alterações, o WAL.

Uma consulta no standby pode precisar de uma versão antiga de uma linha que a aplicação do WAL quer remover. O replay espera. As mudanças seguintes ficam para trás, e novas leituras da aplicação podem enxergar um estado desatualizado.

No exemplo de Pettus, a espera durou aproximadamente 13 segundos e terminou quando a sessão conflitante concluiu seu trabalho. Nenhuma consulta foi cancelada; `pg_stat_database_conflicts` continuou em zero. O log, porém, guardou a causa e a duração da espera. O contador respondeu corretamente à pergunta errada. Muito educado da parte dele.

A configuração `log_recovery_conflict_waits`, desligada por padrão, registra quando uma espera por conflito de recuperação ultrapassa `deadlock_timeout`. Pettus recomenda habilitá-la nos standbys. Ela é especialmente útil quando a configuração permite esperar indefinidamente antes de cancelar consultas. Nesse caso, a réplica pode ficar atrasada sem produzir um erro de cancelamento para chamar atenção.

A outra configuração, `log_startup_progress_interval`, cuida de uma situação diferente: o banco começa uma recuperação e parece ter ficado quieto. Por padrão, ela registra progresso a cada dez segundos nas operações demoradas. O intervalo vale separadamente para cada operação, e zero desliga o recurso.

As mensagens ajudam a distinguir a sincronização de diretórios do replay do WAL. Pettus alerta que interromper uma recuperação em andamento pode fazer o banco repetir trabalho caro. Reiniciar só porque faltou mensagem pode transformar a ansiedade do operador em mais tempo de recuperação.

Num standby já em execução, as linhas de progresso do replay são suprimidas. Você acompanha a replicação em andamento com os instrumentos SQL e investiga depois uma espera por conflito com os logs específicos. São situações diferentes, cada uma com sua forma de observação.

Esses recursos estão aí há algumas versões: o log de progresso chegou no PostgreSQL 15, e o de espera por conflito, no 14. O artigo novo explica como usá-los na operação. Manter o progresso ligado e registrar conflitos nas réplicas guarda evidência para o próximo diagnóstico. O atraso ainda precisa ser resolvido; pelo menos ele deixa de atravessar o incidente sem deixar bilhete.

Fontes: [Christophe Pettus — logs de progresso e conflitos de recuperação](https://thebuild.com/blog/all-your-gucs-in-a-row-log_startup_progress_interval-and-log_recovery_conflict_waits/) e [documentação de logging do PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-logging.html).

## Destaques rápidos para hoje.

- **A CISA adicionou uma falha explorada do Chromium ao catálogo KEV em 4 de setembro.** A CVE-2026-85046 é uma confusão de tipos no V8, o motor de JavaScript, com execução de código dentro da sandbox; as fontes não demonstram escape dessa proteção. O Google confirmou exploração em circulação e publicou o patch no dia 3. Atualize o Chrome para 152.0.7977.82/.83 no Windows e macOS, ou 152.0.7977.82 no Linux, ou versão posterior aplicável. Nos outros navegadores Chromium, confira a versão corrigida com o respectivo fornecedor. Fontes: [CISA KEV](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) e [Chrome Releases](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop_01882797386.html).

- **O caso PaperCut avançou de reconhecimento para ferramentas de coleta de credenciais e tentativas de criar contas privilegiadas.** O relato da Arctic Wolf de 4 de setembro acrescenta essas observações à [cobertura de 29 de agosto](/2026/workflow-publica-dez-pacotes-maliciosos-papercut-sofre-rce-e-kubernetes-ganha-certificados/), sem estabelecer roubo de credenciais em toda instalação afetada. Para servidores NG/MF expostos, o fornecedor orienta restringir o acesso e instalar o Emergency Patch Release 3, cumulativo, mesmo após patches anteriores. A orientação substitui a do Release 2. Possíveis alterações de contas e comprometimento prévio continuam exigindo investigação. Fontes: [Arctic Wolf](https://raw.githubusercontent.com/rtkwlf/wolf-tools/main/pack_alerts/202609-papercut-cve-exploitation/README.md) e [boletim da PaperCut](https://www.papercut.com/kb/Main/security-bulletin-27-aug-2026-urgent-security-advisory/).

- **Bun 1.4.2 corrige duas regressões da 1.4.1 em builds e retenção de memória.** A versão de 5 de setembro resolve colisões de nomes do bundler que afetavam imports do Elysia e um defeito no AsyncLocalStorage, usado para associar estado à execução assíncrona. Timers e promises pendentes podiam manter um contexto externo vivo em memória; `getStore()` continuava retornando o valor correto. Se você está na 1.4.1, valide a atualização especialmente nesses cenários. Fonte: [Bun 1.4.2](https://bun.com/blog/bun-v1.4.2).

- **O DNS público criptografado da Mullvad será encerrado; configurações manuais precisam mudar antes de 2 de novembro.** O anúncio de 3 de setembro prevê apoio financeiro à Quad9. Os padrões de DNS sobre HTTPS do Mullvad Browser, incluindo a opção de bloqueio de anúncios fornecida pelo navegador, migrarão automaticamente. Endereços personalizados e perfis Mullvad DoH instalados no iOS ou macOS precisam de intervenção. O encerramento atinge o resolvedor público; o DNS interno da VPN continua sendo outro serviço. Fonte: [Mullvad](https://mullvad.net/en/blog/shutting-down-our-public-encrypted-dns-servers-and-sponsoring-quad9-instead).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 26560
source_urls:
  - https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/
  - https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90
  - https://download.mikrotik.com/routeros/7.23.4/CHANGELOG
  - https://download.mikrotik.com/routeros/7.23.5/CHANGELOG
  - https://download.mikrotik.com/routeros/7.24.2/CHANGELOG
  - https://download.mikrotik.com/routeros/6.49.21/CHANGELOG
  - https://npratley.net/reversing-mikrotiks-silent-patch-the-routeros-7-23-4-fix-they-wouldnt-explain/
  - https://kubernetes.io/blog/2026/09/04/kubernetes-v1-37-rootless-beta/
  - https://thebuild.com/blog/all-your-gucs-in-a-row-log_startup_progress_interval-and-log_recovery_conflict_waits/
  - https://www.postgresql.org/docs/current/runtime-config-logging.html
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop_01882797386.html
  - https://raw.githubusercontent.com/rtkwlf/wolf-tools/main/pack_alerts/202609-papercut-cve-exploitation/README.md
  - https://www.papercut.com/kb/Main/security-bulletin-27-aug-2026-urgent-security-advisory/
  - https://bun.com/blog/bun-v1.4.2
  - https://mullvad.net/en/blog/shutting-down-our-public-encrypted-dns-servers-and-sponsoring-quad9-instead
-->
