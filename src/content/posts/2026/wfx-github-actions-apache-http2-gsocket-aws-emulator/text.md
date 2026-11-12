---
title: 'wfx planta ladrão de segredos em mais de 8 mil repositórios do GitHub, e Apache corrige falha crítica no HTTP/2'
description: 'Uma campanha com tokens roubados planta um ladrão de credenciais em workflows e apaga o rastro; o Apache 2.4.71 fecha uma execução remota de código no mod_http2. Também: GSocket mantém invasores depois do patch, chaves vazando em configurações do Claude Code, o emulador local da AWS e o consenso da Cloudflare que não depende de um líder.'
date: '2026-11-12T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/wfx-github-actions-apache-http2-gsocket-aws-emulator.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/wfx-github-actions-apache-http2-gsocket-aws-emulator/final.opus'
---

![Recorte de papel de uma chave sendo puxada por um anzol com a etiqueta "wfx", sobre fundo amarelo](./images/wfx-github-actions-apache-http2-gsocket-aws-emulator.jpg)

O tema que atravessa as notícias de hoje é a automação que roda sozinha: o pipeline de CI, o módulo HTTP/2 do servidor web, o cron do servidor e o agente de código. A principal mostra o que acontece quando um token com permissão de escrita cai na mão errada. Depois vêm uma falha crítica no Apache, um lembrete de que o patch não expulsa quem já entrou, chaves vazando em configurações de agente e três relatos sobre como testar o que agentes e sistemas distribuídos produzem.

## wfx usa tokens roubados para plantar um ladrão de segredos em mais de 8 mil repositórios do GitHub

O GitHub Actions é o sistema de automação do GitHub: arquivos YAML dentro do repositório dizem o que rodar a cada push, e essas execuções costumam ter acesso aos segredos do projeto, como chaves de nuvem e tokens de publicação. A campanha batizada de **wfx** explora exatamente isso. Segundo a SafeDep, a Aikido Security foi a primeira a relatar o caso; a SafeDep publicou nesta quinta (12) a análise mais detalhada até agora.

Pelos dados da SafeDep, entre 12h46 UTC de 10 de novembro e 04h36 UTC de 12 de novembro, **8.093 repositórios** receberam commits maliciosos, e a campanha seguia ativa quando os dados foram coletados. Os commits aparecem com a identidade real de usuários de cada repositório, com o e-mail noreply do GitHub e sem assinatura. Por isso a SafeDep conclui que a causa provável são tokens roubados. Em 1.343 repositórios, o autor do commit não é o dono do repositório, e sim outra conta, como um colaborador ou um bot.

O ataque segue uma sequência:

- **Teste de permissão.** O invasor abre um pull request chamado `docs: dependency audit notes`, a partir de uma branch `wfx-docs`, só para conferir se o token consegue escrever no repositório. A SafeDep contou 61.879 desses PRs em 61.734 repositórios, abertos por 4.833 contas, e 91% ainda estavam abertos. Uma consulta à busca do GitHub feita para este texto, na manhã desta quinta, já retornava 64.785 PRs com esse título.
- **Instalação do ladrão.** O código malicioso entra de três jeitos: injetado num workflow existente (7.309 repositórios, commit `ci: refresh build cache`), como workflow novo em repositórios vazios (16) ou como hook `postinstall` do npm (771, commit `chore: add ci helper`). Esse último roda também no notebook de quem fizer `npm install` naquele commit.
- **Limpeza.** Depois da execução, o invasor envia commits `ci: restore` e `ci: cleanup`, e a branch volta a parecer limpa. Num dos exemplos, o código entrou às 14h01 e saiu às 14h05.

O payload coleta todos os segredos e variáveis do repositório, o `GITHUB_TOKEN` e os tokens internos do Actions. Ele também varre a memória dos processos do runner atrás de chaves do GitHub, da AWS, da OpenAI e da Anthropic, e copia `~/.ssh`, kubeconfig, configurações de CLIs de nuvem, arquivos `.env`, `*.tfvars` e estado do Terraform. Em seguida pede tokens OIDC para AWS, Azure e Google Cloud, mesmo em repositórios sem nenhuma configuração de nuvem. OIDC aqui é o mecanismo que troca a identidade do workflow por credenciais temporárias de nuvem, sem chave fixa guardada. Quando a relação de confiança do lado da nuvem é frouxa, esse token vira acesso real. O payload ainda reaproveita o mesmo token contra o HashiCorp Vault e APIs do Kubernetes.

O que mais preocupa é a persistência. Na AWS, o código cria novas chaves de acesso e altera políticas de confiança de roles, com sessões chamadas `wfx-<pid>`. No Azure, adiciona às aplicações do Entra uma credencial federada chamada `wfx-ci-<n>`: com ela, qualquer workflow da branch principal do repositório consegue entrar no Azure como aquela aplicação, mesmo depois da troca dos segredos. Os dados saem por HTTP POST na porta 8080 para os endereços 194.150.166[.]244, 18.143.168[.]96 ou 153.75.82[.]159, ou por um chat do Telegram. Os endereços estão escritos de forma inerte de propósito: servem para busca em logs e regras de bloqueio, não para acesso.

Do lado dos pacotes, três carregam o payload: `digitalelvis/neuronai-studio` v3.14.3 no Packagist e os módulos Go `github.com/vkuznet/gocurl` e `github.com/onuragtas/redock`. A SafeDep diz que uma instalação normal (`composer require`, `go get`) não executa o código em nenhum deles. O risco aparece quando alguém roda `npm install` dentro da pasta do pacote PHP ou dispara os workflows envenenados. Mesmo assim, a recomendação é bloquear essas versões.

Se o seu repositório recebeu o PR de teste, a SafeDep trata a conta como comprometida, mesmo sem commit malicioso depois. A lista de ações:

- revogar tokens, autorizações de apps OAuth, chaves SSH e sessões do autor do commit, e ativar 2FA;
- trocar todos os segredos e variáveis que o repositório consegue ler, incluindo os de ambiente e de organização;
- apagar a branch `wfx-docs` e fechar o PR;
- retirar qualquer versão de pacote gerada entre o commit malicioso e o `ci: cleanup`, e publicar de novo a partir de um commit limpo;
- tratar como comprometida qualquer máquina que tenha rodado `npm install` num commit afetado;
- procurar backdoors: credenciais federadas `wfx-ci-*` no Entra ID; no CloudTrail, sessões `wfx-*` seguidas de `CreateAccessKey` ou `UpdateAssumeRolePolicy`; no GCP, chamadas `GenerateAccessToken` e `SignJwt` vindas do pool de identidade do GitHub; no Vault, logins JWT emitidos pelo GitHub.

No mesmo dia, Hugo van Kemenade publicou um guia sobre os novos lockfiles de workflows do GitHub, gerados pela extensão `gh actions-lock`. O lockfile registra o commit exato de cada action usada e falha no CI se alguém mover uma tag para código malicioso. É uma boa prática, mas protege contra outro ataque. O wfx não mexe em actions de terceiros: ele usa tokens válidos para escrever direto no seu repositório. Contra ele, o que conta é token com escopo mínimo e vida curta, condições estreitas nas roles de nuvem que aceitam OIDC (restringir repositório e branch) e auditoria dos logs atrás de branches `wfx`.

Fontes: [SafeDep](https://safedep.io/blog/github-actions-wfx-credential-stealer), [PR de teste no GitHub](https://github.com/iamharidasan/great-vibes-job/pull/2), [Hugo van Kemenade](https://hugovk.dev/blog/2026/lock-github-actions/).

## Apache 2.4.71 corrige falha crítica no HTTP/2, e as fontes discordam sobre a existência de exploit

O projeto Apache HTTP Server lançou nesta quarta (11) a versão **2.4.71**, que corrige a **CVE-2026-119618**. Trata-se de uma condição de corrida, quando duas threads mexem na mesma memória sem coordenação, na função `assign_headers()` do `mod_http2`, o módulo que implementa HTTP/2. O aviso oficial classifica a falha como crítica e diz que ela pode levar a execução remota de código. Afeta as versões 2.4.55 a 2.4.70 e as builds avulsas do módulo, publicadas no GitHub como `mod_h2`, da 2.0.8 à 2.0.42.

A Red Hat explica o mecanismo: o HTTP/2 permite várias requisições simultâneas na mesma conexão, e uma thread de trabalho acaba escrevendo em memória que pertence à thread da conexão. A empresa dá nota 9,8 de 10 e diz que o ataque não exige autenticação. Os créditos vão para o OSS Scanner da Anthropic, que reportou em 26 de outubro, e para Anthony Weems e Simon Scannell, do time de pesquisa de vulnerabilidades do Google Cloud, que reportaram em 3 de novembro. A mesma versão corrige ainda uma falha no `mod_md` que derruba processos filhos e uma escrita de um byte fora do limite no `mod_vhost_alias`.

As fontes discordam sobre a exploração. A Red Hat afirma que "pesquisa pública demonstrou um exploit confiável" contra um servidor em configuração padrão com o `mod_http2` ligado, mas não diz qual pesquisa. A Wiz escreveu no mesmo dia que não há exploit disponível nem relato de exploração ativa. A Wiz também diz que 64% dos ambientes de nuvem que monitora têm recursos com versões vulneráveis e 51% têm instâncias expostas na internet, números que não consideram se o HTTP/2 está de fato ligado.

O risco depende da configuração. Só servidores com HTTP/2 ativado pela diretiva `Protocols` (com `h2` para HTTP/2 sobre TLS ou `h2c` sem TLS) são afetados. Essa diretiva pode estar na configuração global ou em cada virtual host, então vale olhar todos. A situação nas distribuições, quando conferimos nesta manhã:

- **Red Hat:** no RHEL 9 e 10 a nota é "Important", porque os pacotes de lá dão a cada fluxo HTTP/2 seu próprio alocador de memória, o que dificulta bastante o ataque. Correções já saíram. O RHEL 8 e anteriores não têm o código vulnerável.
- **Debian:** o unstable (sid) já tem o 2.4.71; bookworm, trixie e forky ainda aparecem como vulneráveis no rastreador de segurança.
- **Ubuntu:** o rastreador de CVEs ainda não tinha página para a falha.
- **`mod_h2` avulso:** o repositório foi arquivado em junho e não há versão corrigida.

Na prática: confira a versão com `apachectl -v` (ou `apache2ctl -v` no Debian e no Ubuntu), veja se o módulo http2 está carregado com `apachectl -M` e procure `h2` e `h2c` nos arquivos de configuração. Se não der para atualizar hoje, a mitigação sugerida pela Wiz é deixar só `Protocols http/1.1`. E, como mostra a próxima notícia, o patch fecha a porta, mas não tira de dentro quem já entrou.

Fontes: [aviso do Apache HTTP Server](https://httpd.apache.org/security/vulnerabilities_24.html), [avaliação da Red Hat](https://access.redhat.com/security/cve/cve-2026-119618), [Wiz](https://www.wiz.io/blog/cve-2026-119618-rce-apache-http-server-vulnerability), [rastreador do Debian](https://security-tracker.debian.org/tracker/CVE-2026-119618), [The Hacker News](https://thehackernews.com/2026/11/critical-apache-http2-flaw-could-let.html).

## Microsoft mostra invasores usando GSocket para continuar em servidores Linux depois do patch

A Microsoft publicou nesta quarta (11) um relatório sobre um padrão que vem crescendo. O invasor explora uma aplicação web e, em seguida, instala o **GSocket**, uma ferramenta de acesso remoto de código aberto e legítima. Com ela, o acesso continua mesmo depois que a falha original é corrigida, porque o GSocket roda independente da aplicação explorada.

O truque está na rede. Tanto o servidor comprometido quanto o operador fazem conexões de saída para a Global Socket Relay Network, um serviço público de retransmissão que junta as duas pontas num canal com criptografia de ponta a ponta. A Microsoft destaca três consequências: não existe IP ou domínio do invasor para bloquear, o servidor não precisa de porta aberta para entrada e o NAT não atrapalha. As pontas se reconhecem por um segredo compartilhado, não por endereço, então o operador pode voltar depois de qualquer lugar.

Pela telemetria do Microsoft Defender, os dispositivos com detecções ligadas ao GSocket cresceram 356,2% de março a agosto de 2026, embora não de forma constante mês a mês. Aplicações web e hospedagem respondem por 87,1% dos incidentes atribuíveis. Dentro desse grupo, aplicações PHP e hospedagem cPanel somam 63,9%, e o Apache, 24,3%.

O passo a passo observado é bem Linux. Um comando `curl` baixa um script que identifica a arquitetura da máquina e coloca o binário certo em diretórios graváveis ou em memória, como `/dev/shm`. O processo ganha nome de thread do kernel para se disfarçar. A persistência fica espalhada em cron, unidades systemd com nomes plausíveis, arquivos de inicialização do shell e processos vigias, e depois os arquivos de instalação são apagados. Em alguns casos, os invasores tentaram ainda virar root com a CVE-2026-43284, a falha do kernel conhecida como Dirty Frag.

A recomendação central da Microsoft é não tratar o patch da aplicação como fim da resposta ao incidente. A empresa sugere:

- regras de saída que neguem tudo por padrão e liberem só os destinos necessários, com monitoramento de conexões para a infraestrutura de retransmissão;
- montar diretórios temporários e em memória como não executáveis, quando possível;
- revisar entradas de cron, unidades systemd e arquivos de inicialização do shell, lembrando que matar o processo não remove a persistência;
- priorizar patches de escalada de privilégio local em servidores expostos;
- confirmar no fim que as conexões de saída para a retransmissão pararam.

Fonte: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/11/11/global-socket-how-threat-actors-weaponizing-gsocket-stealthy-c2/).

## Claude Code guarda chaves de API nas regras de "não perguntar de novo", e milhares vazaram no GitHub

Antes de rodar certos comandos no shell, o Claude Code pede permissão. Quando o desenvolvedor escolhe "Yes, and don't ask again", a ferramenta salva uma regra de permissão em `.claude/settings.local.json`, na pasta do projeto. Segundo a GitGuardian, essa regra é o próprio texto do comando. Se o comando era um `curl` com a chave de API no cabeçalho, a chave fica gravada no arquivo.

O Claude Code coloca esse arquivo no gitignore local quando o cria. Mas, como explica o pesquisador Guillaume Valadon, essa proteção vale só na máquina onde o arquivo nasceu. Em outro computador, num clone antigo ou quando o arquivo já era rastreado, ele vai para o commit junto com o resto. De janeiro de 2025 a 7 de novembro de 2026, a GitGuardian achou **31.088 segredos distintos** nesse arquivo em 23.276 repositórios públicos, e **5.343** ainda funcionavam quando foram detectados. Credenciais de banco de dados lideram entre as válidas (2.280), seguidas de tokens de nuvem (971) e de IA (583). A empresa diz que 63% das ocorrências são senhas e tokens sem formato reconhecível, que scanners baseados em padrões de provedores tendem a perder.

O Docker piora o quadro. Uma instrução `COPY . .` copia a pasta de trabalho inteira, não o que o Git versiona, e ignora o `.gitignore`. Assim, imagens públicas no Docker Hub carregavam 613 segredos distintos desses arquivos, 99 válidos. Um único token válido da Cloudflare aparece em 559 tags de uma imagem. Apagar o arquivo do repositório não limpa as imagens já publicadas.

Os vazamentos mensais chegaram a 12.535 ocorrências em abril de 2026 e caíram para 959 em outubro. A GitGuardian diz que ainda não sabe o que mudou. A Apiiro já tinha publicado em 5 de novembro uma análise do mesmo arquivo, com números menores porque mediu outra coisa: o que está exposto hoje, sem testar validade. Segundo a GitGuardian, Boris Cherny, que lidera o Claude Code na Anthropic, disse que a equipe está estudando o problema e prototipando varredura de segredos embutida.

O que fazer:

- trocar primeiro qualquer credencial que o arquivo já tenha guardado, porque histórico, forks e imagens mantêm cópias;
- adicionar o `.claude/settings.local.json` ao `.gitignore` do próprio repositório e listar `.claude/` no `.dockerignore`;
- apagar as regras que contêm segredos, editando o arquivo ou pelo comando `/permissions`;
- passar a referenciar segredos por variável de ambiente, como `$N8N_API_KEY`, para a regra gravar o nome e não o valor.

A GitGuardian também recomenda tratar as pastas de configuração de agentes (`.claude/`, `.cursor/`, `.codex/`, `.mcp.json`, `CLAUDE.md`) como arquivos sensíveis, no mesmo nível de um `.env`.

Fontes: [GitGuardian](https://blog.gitguardian.com/claude-code-settings-local-json-secrets-docker-hub/), [InfoWorld](https://www.infoworld.com/article/4247344/claude-codes-dont-ask-again-button-has-a-secrets-spilling-problem-2.html).

## AWS lança emulador local gratuito da AWS, escrito e testado por agentes

A AWS lançou nesta quarta (11) o **AWS Emulator**, uma cópia local das APIs da AWS que roda na sua máquina, sem custo de serviço. A AWS CLI, os SDKs e agentes de código falam com ele por um endpoint HTTPS local, com as mesmas APIs da nuvem. Assim, um teste que cria uma tabela no DynamoDB, grava e lê um item roda no notebook, sem deploy e sem conta real. O emulador é escrito em Rust e, no Linux, vem em pacote RPM ou Debian. No macOS e no Windows, você monta uma imagem Docker a partir de um Dockerfile curto da documentação, porque a AWS não publica imagem pronta.

Ao iniciar, ele gera as próprias credenciais, com chaves que começam com `EMULATOR`, e recusa requisições assinadas com outras chaves. Funciona como uma conta única, sem comportamento entre contas ou regiões. Há também um modo embutido, por enquanto só para o SDK de Rust, que cria uma instância isolada dentro de cada teste. Operações ainda não implementadas devolvem HTTP 501, para o teste falhar logo. A AWS publica a cada versão uma nota de fidelidade por serviço, no formato "k de n testes passando".

O limite mais importante: o emulador **não avalia políticas de IAM** como a AWS avalia. Uma requisição que a nuvem negaria pode passar localmente. Por isso a AWS diz para não usá-lo em produção nem para testar segurança.

O detalhe que chamou atenção é como ele foi feito. Segundo a AWS, todo o código foi escrito e testado por agentes, a partir de mais de 400 modelos de API que cobrem mais de 200 serviços. Os agentes escrevem "testes de fidelidade" a partir desses modelos e os corrigem até passarem contra a AWS real. Depois, constroem o emulador até ele passar no mesmo teste. Cada mudança passa por uma barreira de merge com verificações automáticas, incluindo vários agentes de segurança fazendo revisão adversarial. O código está sob CC0, uma dedicação ao domínio público, e o repositório tinha 29.684 commits quando conferimos.

Num texto convidado no blog de Werner Vogels, CTO da Amazon, Swami Sivasubramanian liga o projeto ao "Alf", um serviço de locks baseado em Paxos que a Amazon construiu há cerca de vinte anos e que hoje sustenta sistemas como S3 e DynamoDB. A equipe testava o Alf simulando a rede inteira dentro de uma JVM, para injetar falhas e forçar ordens específicas de eventos. Swami conta que tentou reconstruir com um agente o motor de replicação do Alf e o supervisionou por quatro noites sem resultado, porque o agente não tinha como verificar o próprio trabalho. Com uma especificação e um ambiente de teste, a reconstrução levou cerca de duas horas.

Um post da AWS dá um exemplo concreto. Um agente monta um worker que lê pedidos de uma fila SQS padrão e grava no DynamoDB com escrita condicional, que só grava se o pedido ainda não existir. A fila SQS padrão pode entregar a mesma mensagem mais de uma vez. Quando chega uma duplicata, a gravação é recusada, o worker trata a recusa como falha temporária, e a mensagem volta para a fila a cada fim do tempo de visibilidade. A correção é apagar a mensagem, porque ela já foi processada. Um emulador fiel deixa o agente encontrar esse bug localmente.

Fontes: [AWS News Blog](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/), [repositório no GitHub](https://github.com/aws/aws-emulator), [All Things Distributed](https://www.allthingsdistributed.com/2026/11/aws-emulator-and-the-engineers-job-when-agents-write-the-code.html), [AWS Insights](https://aws.amazon.com/blogs/aws-insights/better-feedback-for-building-with-agents/).

## Microsoft relata 59 bugs do kernel Linux achados com IA, e quatro meses de trabalho humano para reportá-los

O FORGE Lab, laboratório de pesquisa da Microsoft, contou nesta quarta (11) como foi usar uma ferramenta interna de varredura com IA, de codinome MDASH, em subsistemas do kernel Linux como rede, sistemas de arquivos e módulos de segurança. A varredura, feita entre o fim de maio e meados de junho de 2026, gerou **26.502 achados brutos** em cerca de duas semanas, rodando em dois servidores. Um filtro de confiança e agentes de triagem reduziram a lista para 11.769 candidatos. Agentes que geram prova de conceito tentaram reproduzir cada um no QEMU, e especialistas revisaram os 621 casos com evidência. O resultado foram **59 relatos** enviados aos mantenedores.

Desses relatos saíram até agora 33 CVEs, 24 delas com nota 7,0 ou mais. Em oito, a equipe confirmou em laboratório exploits que levam um usuário local a root, alguns dependentes de configurações fora do padrão ou de proteções desligadas. Já foram aceitas 38 correções no kernel principal. Os bugs tinham em média 8,1 anos, e um deles, no classificador de tráfego `cls_u32` (CVE-2026-74544), estava lá havia pelo menos 21 anos.

A lição que a própria Microsoft destaca é o desequilíbrio. Duas semanas de varredura geraram o material, mas reportar os 59 casos tomou mais de quatro pessoas-mês, em parte porque o Linux costuma exigir que o relato venha com patch funcional. O primeiro relato público só saiu em 27 de junho, mais de cinco semanas depois do início. Para a equipe, mais tokens podem achar mais bugs, mas não tornam o sistema seguro por si só, e a revisão humana continua sendo o gargalo.

Fonte: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/11/11/lessons-from-59-linux-kernel-bug-reports/).

## Cloudflare explica por que escolheu o QuePaxa, e não o Raft, para seu serviço de consenso global

Um algoritmo de consenso faz um grupo de máquinas concordar sobre uma única sequência de decisões, mesmo com algumas delas fora do ar. É a base de sistemas como etcd, Consul e ZooKeeper. A Cloudflare está construindo o **Meerkat**, um serviço de consenso experimental para o seu plano de controle interno, com réplicas espalhadas por vários continentes. Num post desta quarta (11), a empresa explica por que escolheu o **QuePaxa**, algoritmo publicado em 2023 por Tennage, Băsescu e colegas, em vez de opções consagradas como Raft, Multi-Paxos ou Viewstamped Replication.

A motivação é um incidente real. Em 2020, a falha parcial de um switch de rede da Cloudflare fez um sistema baseado em consenso degradar, e o painel ficou 80 vezes mais lento que o normal por seis horas. Nenhum dado se perdeu, mas as escritas ficaram indisponíveis o tempo todo.

O post explica o problema dos algoritmos com líder. No Raft, uma única réplica, o líder, coordena as decisões. Enquanto ele está saudável e a rede se comporta, tudo é rápido. Mas numa rede de longa distância, um soluço de dois segundos pode fazer o líder parecer morto e disparar uma eleição. Os candidatos disputam votos, podem bloquear uns aos outros e continuar disputando depois que o problema original passou. É o que se chama de falha metaestável, uma pane que se alimenta sozinha. Além disso, como não dá para distinguir um servidor caído de uma rede lenta, o detector de falhas sempre chuta, e às vezes erra.

O QuePaxa ataca esses pontos com três escolhas: o líder é opcional, não existe detecção de falhas e os proponentes cooperam em vez de competir. Cada proposta recebe uma prioridade aleatória, e quem vê uma proposta de prioridade maior passa a defendê-la. Com a rede boa, o líder decide em uma ida e volta. Quando não, o sistema fica mais lento, mas continua decidindo. Nos testes da Cloudflare, mais de 95% das decisões saíram do líder na primeira fase. Quando o líder caiu, a taxa de decisões baixou para cerca de 65% e voltou ao normal quando ele foi substituído, um minuto depois, sem o sistema parar.

Fonte: [Cloudflare Blog](https://blog.cloudflare.com/choosing-quepaxa/).

## Destaques rápidos para hoje.

- **Podman 6.2 corrige três falhas de segurança.** Publicada na terça (10), a versão da ferramenta de contêineres sem daemon fecha a CVE-2026-121885, em que rótulos de imagens não confiáveis podiam levar o `podman auto-update` a reiniciar unidades systemd erradas. Também corrige uma forma de imagens maliciosas escaparem da validação de digest e assinatura e um desvio na regra de sockets do perfil seccomp padrão. Entre as novidades estão o `kube play` criando vários pods quando um Deployment pede réplicas e systemd nativo nas máquinas WSL. Fonte: [notas da versão](https://github.com/podman-container-tools/podman/releases/tag/v6.2.0).

- **RHEL 10.3 libera imagens seladas e servidor MCP para diagnóstico.** A Red Hat anunciou nesta quarta (11) o RHEL 10.3 e o 9.9. As imagens seladas do modo imagem, agora disponíveis para produção, verificam criptograficamente a integridade do firmware ao sistema de arquivos raiz, que fica somente leitura. O servidor MCP para RHEL, que dá a assistentes de IA acesso a informações do sistema para diagnóstico, saiu da prévia e vem em RPM. O GCC Toolset 16 passa a usar C++20 como padrão. Fontes: [Red Hat](https://www.redhat.com/en/blog/introducing-red-hat-enterprise-linux-103-and-99), [Linuxiac](https://linuxiac.com/rhel-10-3-released-with-linux-kernel-6-12-gcc-16-and-sealed-images/).

- **Agente do Proofpoint ITM para macOS dá root a qualquer usuário, e ainda não há correção.** A Bishop Fox revelou nesta quarta (11) que o serviço de monitoramento de arquivos do agente, que roda como root, monta comandos `/bin/bash -c` com nomes de arquivos sem tratar caracteres especiais. Um usuário comum que cria, numa pasta gerenciada pelo OneDrive, um arquivo com `$(comando)` no nome faz o comando rodar como root. As versões confirmadas vão da 4.4.3.148 à 5.0.1. Não há patch nem CVE, e a sugestão provisória é desativar o componente File Activity Monitor. O agente para Windows não é afetado. Fonte: [Bishop Fox](https://bishopfox.com/blog/proofpoint-itm-4-4-3-148-5-0-1).

- **llm 0.37.2 corrige envio da chave da OpenAI a outros provedores.** A ferramenta de terminal de Simon Willison para acessar modelos de linguagem podia, em dois casos, mandar a chave da OpenAI configurada para endpoints compatíveis de terceiros: quando a chave indicada em `api_key_name` nunca tinha sido guardada, ou quando um modelo `responses: true` rodava com `-o chat_completions 1`. Quem usa provedores próprios deve atualizar. Fonte: [Simon Willison](https://simonwillison.net/2026/Nov/11/llm/).

- **Mais de 35 mil apps feitos com o Grok estavam abertos a qualquer um.** A Claroc encontrou 37.571 apps criados pelo construtor de apps do Grok, e 35.578 abriam sem login. Cerca de um em dez tinha dados internos ou pessoais, incluindo 24 apps de funcionários do X e da SpaceXSI, empresa dona do Grok, já retirados do ar. Segundo os pesquisadores, a opção "qualquer pessoa com o link" vinha pré-selecionada, e os endereços não ficam secretos: serviços de DNS passivo registram as consultas e permitem buscá-las. Fontes: [Claroc](https://blog.claroc.io/ghostshares-grok-build-apps/), [The Hacker News](https://thehackernews.com/2026/11/over-35000-grok-built-apps-exposed.html).

- **CSP sem `form-action` deixa roubar senhas sem JavaScript.** A PortSwigger lembra que a diretiva `form-action` da Content Security Policy não herda de `default-src`. Numa página com injeção de HTML, um formulário injetado que envia para a própria página, o que `form-action 'self'` permite, pode levar usuário e senha para a URL e depois vazá-los pelo cabeçalho Referer, mesmo com todos os scripts bloqueados. Fonte: [PortSwigger Research](https://portswigger.net/research/blind-trust-stealing-credentials-through-csp).

- **EventSourcingDB 1.3 exige cuidado na atualização em Kubernetes.** O banco de dados para event sourcing ganhou uma API v2 que devolve o resultado da requisição no corpo da resposta, pré-condições recursivas por assunto e backups incrementais. O aviso importante: versões até a 1.2 não travam o diretório de dados, então um rollout que sobe o servidor novo antes de parar o antigo, como um Deployment com `RollingUpdate`, pode rodar dois servidores sobre os mesmos dados e corrompê-los. Fonte: [Event Foundation](https://www.eventfoundation.io/resources/blog/eventsourcingdb-1-3-0-is-available).

- **OpenTelemetry descontinua o batch processor do Collector.** O agrupamento de dados passa para dentro dos exporters e vira padrão na maioria deles na versão v0.171.0, prevista para fevereiro de 2027. Quem usa o processor antigo precisa removê-lo dos pipelines por conta própria antes da remoção definitiva. Fonte: [blog do OpenTelemetry](https://opentelemetry.io/blog/2026/collector-batching-migration/).

- **Zellij 0.46 vira também um terminal de desktop.** O multiplexador de terminal escrito em Rust agora abre como aplicativo próprio no Linux, no macOS e no Windows, com `zellij terminal`, e continua funcionando dentro de outro terminal como antes. As builds musl não incluem o terminal, e há mudanças incompatíveis para autores de plugins. Fonte: [notas da versão](https://github.com/zellij-org/zellij/releases/tag/v0.46.0).

- **Google lança API para decisões fechadas com o Gemini Decision 1.** A Gemini Decisions API responde até 1.000 perguntas de sim ou não, múltipla escolha ou nota numa única passagem sobre texto, imagem, áudio, vídeo ou PDF. Em vez de gerar texto, devolve probabilidades e notas de confiança, em 150 a 250 milissegundos ponta a ponta segundo o Google, a US$ 0,10 por milhão de tokens de entrada e sem cobrança de saída. O uso sugerido é rotear pedidos entre modelos e checar regras. Fonte: [Google](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 32866
source_urls:
  - https://safedep.io/blog/github-actions-wfx-credential-stealer
  - https://github.com/iamharidasan/great-vibes-job/pull/2
  - https://hugovk.dev/blog/2026/lock-github-actions/
  - https://httpd.apache.org/security/vulnerabilities_24.html
  - https://access.redhat.com/security/cve/cve-2026-119618
  - https://www.wiz.io/blog/cve-2026-119618-rce-apache-http-server-vulnerability
  - https://security-tracker.debian.org/tracker/CVE-2026-119618
  - https://thehackernews.com/2026/11/critical-apache-http2-flaw-could-let.html
  - https://www.microsoft.com/en-us/security/blog/2026/11/11/global-socket-how-threat-actors-weaponizing-gsocket-stealthy-c2/
  - https://blog.gitguardian.com/claude-code-settings-local-json-secrets-docker-hub/
  - https://www.infoworld.com/article/4247344/claude-codes-dont-ask-again-button-has-a-secrets-spilling-problem-2.html
  - https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/
  - https://github.com/aws/aws-emulator
  - https://www.allthingsdistributed.com/2026/11/aws-emulator-and-the-engineers-job-when-agents-write-the-code.html
  - https://aws.amazon.com/blogs/aws-insights/better-feedback-for-building-with-agents/
  - https://www.microsoft.com/en-us/security/blog/2026/11/11/lessons-from-59-linux-kernel-bug-reports/
  - https://blog.cloudflare.com/choosing-quepaxa/
  - https://github.com/podman-container-tools/podman/releases/tag/v6.2.0
  - https://www.redhat.com/en/blog/introducing-red-hat-enterprise-linux-103-and-99
  - https://linuxiac.com/rhel-10-3-released-with-linux-kernel-6-12-gcc-16-and-sealed-images/
  - https://bishopfox.com/blog/proofpoint-itm-4-4-3-148-5-0-1
  - https://simonwillison.net/2026/Nov/11/llm/
  - https://blog.claroc.io/ghostshares-grok-build-apps/
  - https://thehackernews.com/2026/11/over-35000-grok-built-apps-exposed.html
  - https://portswigger.net/research/blind-trust-stealing-credentials-through-csp
  - https://www.eventfoundation.io/resources/blog/eventsourcingdb-1-3-0-is-available
  - https://opentelemetry.io/blog/2026/collector-batching-migration/
  - https://github.com/zellij-org/zellij/releases/tag/v0.46.0
  - https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/
-->
