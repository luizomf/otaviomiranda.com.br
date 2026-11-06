---
title: 'Alpine corrige falha de autenticação SSH; GitHub detalha novo armazenamento'
description: 'Dropbox explica permissões e recuperação de arquivos alterados por agentes. A edição também traz alertas da Barracuda e Microsoft, Vercel Schedules e novos modelos de IA.'
date: '2026-11-06T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/alpine-corrige-ssh-github-armazenamento-dropbox-agentes.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/alpine-corrige-ssh-github-armazenamento-dropbox-agentes/final.opus'
---

![Faixa do Alpine Linux orienta atualizar e reiniciar o SSH após a correção de segurança.](./images/alpine-corrige-ssh-github-armazenamento-dropbox-agentes.jpg)

A edição de hoje começa com uma correção importante para quem usa acesso remoto no Alpine Linux: servidores SSH com uma combinação específica de configurações podem aceitar login sem a senha da conta. O GitHub explica como distribui o trabalho para receber mais alterações no mesmo repositório, e o Dropbox mostra como controla permissões e desfaz mudanças feitas por agentes sem sobrescrever edições posteriores de outras pessoas.

## Alpine corrige falha que permite login SSH sem conhecer a senha em configurações específicas

O Alpine publicou em **5 de novembro** um alerta sobre o `sshd`, o servidor de acesso remoto por SSH. **A recomendação é atualizar o pacote `openssh` da sua série do Alpine e reiniciar o `sshd`.** A atualização do pacote, sozinha, deixa o processo antigo em execução.

A exposição depende de quatro condições simultâneas: OpenSSH sem PAM ativo, a camada que pode intermediar a autenticação; login por senha habilitado; uma conta cujo campo de senha contém apenas `*`; e outra conta local com um hash de senha iniciado por `$5$` ou `$6$`. O hash é a representação calculada da senha. Já o asterisco pode aparecer em contas preparadas para acesso por chave.

A falha está na comparação desses valores. Em uma situação de erro, a função de hash da musl, biblioteca básica do Alpine, devolve `*`. Esse retorno pode coincidir com o marcador da conta e ser aceito como uma senha correta. O problema foi relatado por Özgün Kültekin; o OpenSSH **10.6p2** inclui uma proteção, também aplicada aos pacotes das versões do Alpine.

Se a atualização precisar esperar, a mitigação documentada é desabilitar o login por senha com `PasswordAuthentication no` e reiniciar o serviço. Antes de mudar o acesso remoto, **confirme que o login por chave funciona e mantenha a sessão atual aberta até testar uma nova conexão**. Confira também a configuração efetiva do servidor.

Containers que não executam `sshd` ficam fora desse problema. A configuração `PermitRootLogin prohibit-password` protege o login direto como root, o administrador do sistema; outra conta afetada, porém, pode ter permissão para elevar privilégios depois de entrar.

Fontes: [aviso e versões corrigidas do Alpine](https://alpinelinux.org/posts/2026-11-05-openssh-password-authentication-bypass/), [notas do OpenSSH 10.6p2](https://www.openssh.com/txt/release-10.6p2) e [análise do pesquisador](https://sshhole.com/).

## GitHub separa objetos e referências para ampliar escritas no mesmo repositório

Em um relato técnico de **5 de novembro**, o GitHub explicou a arquitetura Rubicon, preparada para receber muitos envios de alterações, os *pushes*, ao mesmo repositório. A divisão parte de duas características do Git: objetos, como commits e conteúdos de arquivos, são imutáveis; referências, como o ponteiro de uma branch para seu commit atual, mudam com o trabalho.

Os objetos ficam no Azure Blob Storage e podem ser gravados em paralelo. As referências passam pelo **Ref-CAS**, um serviço replicado que compara o valor atual com o valor que quem pediu a atualização esperava encontrar. A mudança só é aceita se eles coincidirem. Assim, alterações em branches distintas podem avançar sem disputar o mesmo bloqueio; escritas concorrentes sobre a mesma referência precisam resolver a disputa.

O fluxo grava os objetos de forma durável antes de confirmar a mudança da referência. As máquinas que atendem requisições usam discos locais como caches reconstruíveis. Outras máquinas cuidam da compactação dos arquivos de objetos, separando essa manutenção do atendimento às requisições.

O GitHub relata testes internos com **5 mil agentes concorrentes e 7.200 pushes por segundo em um repositório**. A arquitetura está em **prévia privada limitada**, com expansão prevista para o início de 2027. A divisão ajuda a entender o resultado: o pequeno estado que exige coordenação entre escritores fica separado do grande volume de dados imutáveis.

Fonte: [arquitetura de armazenamento do GitHub](https://github.blog/engineering/architecture-optimization/inside-githubs-new-git-storage-architecture/).

## Dropbox mantém credenciais fora do agente e preserva edições posteriores ao desfazer

O Dropbox explicou em **5 de novembro** a arquitetura de seu agente para organizar pastas, renomear arquivos e executar outras tarefas sobre documentos. Cada conversa recebe uma máquina virtual isolada, equipada com programas e acesso controlado aos arquivos autorizados.

As credenciais ficam fora dessa máquina. Um componente externo verifica o destino da requisição, a operação e as permissões concedidas; só depois acrescenta a autenticação necessária. Como o ambiente não tem acesso geral à internet, esse caminho concentra as verificações tanto para chamadas de ferramentas quanto para programas executados pelo agente.

Para desfazer uma tarefa, o sistema precisa reconhecer quais mudanças pertencem a ela. Cada versão alterada pelo agente registra a conversa que a originou. Se outra pessoa ou agente já editou um arquivo afetado, o Dropbox restaura a versão em uma **cópia separada e renomeada**, preservando a edição posterior.

A solução descrita combina dois cuidados úteis em aplicações compartilhadas: verificar permissões fora do ambiente do agente e considerar o histórico de outras edições ao desfazer seu trabalho.

Fonte: [relato de engenharia do Dropbox](https://dropbox.tech/machine-learning/how-two-engineer-side-projects-became-the-agent-taking-action-inside-dropbox).

## Destaques rápidos para hoje.

- **Barracuda corrige aviso: falha no ESG dispensa login, mas exige acesso à interface administrativa.** A atualização de **5 de novembro** esclarece o requisito da **CVE-2026-116606**. No Email Security Gateway, equipamento que filtra e-mails, a combinação dessa falha com a injeção de comandos **CVE-2026-111560** pode dar controle como root. A watchTowr publicou uma demonstração técnica da cadeia. Confira firmware e patches aplicados e restrinja a interface administrativa a redes confiáveis. Outros produtos aparecem no boletim por causa da injeção de comandos; a cadeia sem login descrita aqui é a do ESG. Fontes: [boletim atualizado da Barracuda](https://trust.barracuda.com/security/pre-authentication-authorization-bypass-command-injection) e [pesquisa da watchTowr](https://labs.watchtowr.com/barracuda-networks-is-your-new-best-friend-barracuda-email-security-gateway-pre-auth-remote-root-rce-cve-2026-116606-cve-2026-111560/).

- **Microsoft relata um caso de roubo de dados cinco minutos após a busca por segredos no GitHub.** No relatório de **5 de novembro**, a empresa descreve um agente que passou da busca por credenciais expostas à retirada de dados do Azure Key Vault, serviço de armazenamento de segredos, nesse intervalo. A orientação é revogar ou trocar imediatamente as credenciais expostas, investigar seu uso e revisar as permissões das aplicações. Apagar o segredo do código mantém a credencial utilizável enquanto ela não for invalidada. Fonte: [Microsoft Threat Intelligence](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/).

- **Cinco scripts funcionais revelaram 15 problemas no uso do Dev Proxy por agentes.** Em **5 de novembro**, Waldek Mastykarz, da Microsoft, relatou cinco testes com Copilot Chat e Claude Sonnet 5.5. A tarefa era criar scripts de integração contínua para registrar chamadas à API do GitHub com o Dev Proxy, ferramenta local que intercepta requisições HTTP. Os agentes leram arquivos binários para descobrir plugins e improvisaram esperas pela conclusão dos relatórios. A lição é examinar também os passos das execuções bem-sucedidas: comandos que listem plugins e sinais explícitos de conclusão podem evitar essas adaptações frágeis. Os achados são dessa pequena amostra; cada melhoria precisa ser testada novamente. Fonte: [análise das trajetórias no Dev Proxy](https://devblogs.microsoft.com/blog/your-best-ax-fixes-are-hiding-in-agent-trajectories/).

- **Vercel Schedules entra em beta público em todos os planos.** O serviço, anunciado em **5 de novembro**, permite agendar tarefas uma vez ou de forma recorrente. Agendamentos declarados em `vercel.json` podem acionar uma função privada, um caminho HTTP ou um tópico de fila; os criados durante a execução da aplicação têm um tópico de fila como destino. É possível habilitar, desabilitar ou disparar um agendamento sem publicar uma nova versão da aplicação. O serviço sucede Cron Jobs, que continua funcionando, e tem cotas ou cobrança conforme o plano. Fonte: [changelog do Vercel Schedules](https://vercel.com/changelog/vercel-schedules-is-now-in-public-beta).

- **OpenAI anuncia GPT-6 Cyber com acesso inicial restrito.** O lançamento de **5 de novembro** disponibiliza o modelo pela API e pelo Codex a um grupo selecionado de clientes aprovados no Daybreak Red, programa da empresa para testes avançados de segurança. A ampliação para todos os clientes desse programa está planejada. A OpenAI identifica o modelo como responsável pela pesquisa no Linux [coberta na edição anterior](/2026/apt-corrige-pacotes-go-json-v2-workflow-agentes/); a novidade é a identificação do modelo e o início desse acesso. Fonte: [anúncio da OpenAI](https://openai.com/index/introducing-gpt-6-cyber/).

- **Inkling 2 Small chega ao Tinker com entrada de imagens e pesos ainda fechados.** A Thinking Machines anunciou em **5 de novembro** a disponibilidade do modelo para geração de respostas e ajuste fino no Tinker, sua plataforma para executar e treinar modelos. A empresa pretende liberar os pesos sob Apache 2.0 na semana seguinte, após testes externos de segurança. Essa abertura ainda era um plano na publicação do anúncio. O modelo aceita imagens, mas não áudio. Fonte: [anúncio da Thinking Machines](https://thinkingmachines.ai/news/inkling-2-small/).

- **Experimento com Datastar mostra atualizações de HTML enviadas pelo servidor.** Em um relato de **4 de novembro**, o autor do Noteflakes explora aplicações reativas usando SSE, conexão HTTP pela qual o servidor envia eventos ao navegador. O exemplo atualiza trechos de HTML ou valores de estado sem escrever manualmente cada alteração da página. O texto também examina limites: os sinais de estado são globais à página, embora possam ser organizados em objetos, e a integração com outro JavaScript exige cuidado. É uma leitura prática sobre interfaces controladas pelo backend, com exemplos em Ruby. Fonte: [experimento no Noteflakes](https://noteflakes.com/articles/2026-11-04-datastar).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 30631
source_urls:
  - https://alpinelinux.org/posts/2026-11-05-openssh-password-authentication-bypass/
  - https://www.openssh.com/txt/release-10.6p2
  - https://sshhole.com/
  - https://github.blog/engineering/architecture-optimization/inside-githubs-new-git-storage-architecture/
  - https://dropbox.tech/machine-learning/how-two-engineer-side-projects-became-the-agent-taking-action-inside-dropbox
  - https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/
  - https://devblogs.microsoft.com/blog/your-best-ax-fixes-are-hiding-in-agent-trajectories/
  - https://vercel.com/changelog/vercel-schedules-is-now-in-public-beta
  - https://thinkingmachines.ai/news/inkling-2-small/
  - https://openai.com/index/introducing-gpt-6-cyber/
  - https://trust.barracuda.com/security/pre-authentication-authorization-bypass-command-injection
  - https://labs.watchtowr.com/barracuda-networks-is-your-new-best-friend-barracuda-email-security-gateway-pre-auth-remote-root-rce-cve-2026-116606-cve-2026-111560/
  - https://noteflakes.com/articles/2026-11-04-datastar
-->
