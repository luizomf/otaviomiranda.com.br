---
title: 'Google vai exigir que agentes de IA acessem Gmail e Drive pelos seus servidores MCP, e falha sem patch no Cacti leva visitante convidado a rodar comandos'
description: 'A partir de 1º de fevereiro de 2027, agentes que usarem as APIs REST do Workspace ficam presos à cota básica, e o adendo limita a 30 dias a memória que eles guardam. Também nesta edição: a cadeia de quatro requisições contra o Cacti 1.2.31, a OWASP explicando por que git status não é somente leitura num repositório hostil, o PolinRider escondido em conftest.py, Linus Torvalds e o pull do ext4 cheio de correções geradas por IA, o painel web do Garage 2.6 e duas ferramentas da comunidade para VPS no TabNews. E mais: ataques com agentes na Suíça, Mitel e Juniper na lista da CISA, incidente na SAP, provedores de inferência ligados à ByteDance, PostgreSQL, MariaDB 13.1, Brush 0.5, BlueZ e o preço dos HDs.'
date: '2026-11-27T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/google-exige-mcp-para-agentes-cacti-zero-day-git-status-ext4-ia.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/google-exige-mcp-para-agentes-cacti-zero-day-git-status-ext4-ia/final.opus'
---

![Pequeno robô de cerâmica branca empurra um envelope para dentro de uma fenda de correio de latão gravada com MCP, numa parede escura iluminada por um abajur.](./images/google-exige-mcp-para-agentes-cacti-zero-day-git-status-ext4-ia.jpg)

Sexta-feira com uma regra nova do Google para quem constrói agentes, uma falha ainda sem correção numa ferramenta de monitoramento muito usada em redes, e um lembrete prático para quem roda agentes de código: comandos que parecem só de leitura podem executar programas escolhidos pelo repositório.

## Google vai exigir que agentes de IA usem os servidores MCP oficiais para acessar Gmail, Drive e Agenda a partir de 1º de fevereiro

**O que o Google lançou.** O MCP (Model Context Protocol) é o padrão que agentes de IA usam para chamar ferramentas externas. Na terça (24), o Google colocou em disponibilidade geral servidores MCP remotos para oito produtos do Workspace: Gmail, Drive, Docs, Sheets, Slides, Agenda, Chat e Tasks. No mesmo dia, publicou um adendo aos termos das APIs, o Workspace AI Tools Addendum.

**A regra.** O adendo diz que a ferramenta de acesso "deve usar um MCP do Google quando a ferramenta é, ou é conduzida por, um agente de IA". O post do Google Cloud completa: agentes precisam usar os servidores MCP ou o Workspace CLI, e não as APIs REST que existem hoje. A aplicação técnica começa em 1º de fevereiro de 2027.

**O que acontece com quem não migrar.** Segundo a documentação do Google, a partir dessa data agentes que chamam as APIs REST direto ficam limitados à cota do nível Standard, qualquer que seja o plano contratado. O adendo também permite ao Google restringir ou remover o acesso da ferramenta e suspender ou encerrar o acesso de quem descumprir as regras.

**O argumento do Google.** No post, Chandu Thota e Brad Calder escrevem que as APIs REST foram feitas para apps no ritmo humano, em que um token OAuth válido indicava a intenção do usuário. Com agentes agindo sozinhos, "um token válido não basta mais".

Os servidores MCP aplicam checagens de permissão e de vazamento de dados, rejeitam clientes OAuth que não se declaram como agente e pedem confirmação humana antes de enviar e-mail, mudar o compartilhamento no Drive ou fazer edições em massa.

**O que muda na prática.** Os números vêm da documentação de cotas e do texto do adendo:

- A cota Standard é de 5.000 requisições por dia, por projeto, por produto. No Gmail, `search_threads` e `list_drafts` contam como 10 requisições cada, o que dá cerca de 500 buscas por dia.
- Em 1º de abril de 2027 começa a cobrança do nível Scaled. O uso dos servidores MCP de Gmail, Agenda e Drive nesse nível é cobrado desde a primeira requisição, sem franquia diária.
- O adendo proíbe guardar por mais de 30 dias o que chama de "Google Technical Information", termo cuja definição inclui embeddings vetoriais, índices de memória, perfis de usuário e grafos organizacionais derivados do acesso ao Workspace.
- Os dados só podem ser usados para cumprir tarefas ativas autorizadas pelo usuário, devem ser apagados quando ele desconecta o agente e não podem servir para treinar, fazer fine-tuning ou montar conjuntos de avaliação.

**Agente com memória de longo prazo.** A regra dos 30 dias é a que mais pesa para quem constrói assistentes que indexam a caixa de entrada inteira para responder perguntas depois. Como a definição cita embeddings e índices de memória, esse índice passa a ter prazo de validade. Integrações sem IA, como um backup noturno ou uma sincronização com CRM, ficam de fora, segundo a análise da TechStackups, desde que usem um cliente OAuth próprio e nenhum modelo seja ligado a elas.

**A dúvida sobre enviar e-mail.** Uma análise da TechStackups publicada na quinta (26) afirmou que o servidor público do Gmail não podia enviar, responder, encaminhar nem editar rascunhos, e citou a página de cotas do Google dizendo que essas ferramentas exigiam "acesso de parceiro". A versão atual dessa página, atualizada em 27 de novembro, e a referência do servidor MCP do Gmail, atualizada em 26, listam `send_message`, `reply`, `forward` e `update_draft` entre as ferramentas disponíveis no endpoint principal.

As fontes não permitem dizer se o Google mudou a página ou se a análise leu outra versão. Pela documentação atual, essas ações ficam de fora só de um endpoint alternativo, feito para clientes MCP que não sabem exibir o formulário de aprovação. No endpoint principal, elas passam pela confirmação de uma pessoa.

**O que fazer agora.** Se você mantém um agente ou um servidor MCP próprio que fala com o Workspace, vale separar o que é automação determinística do que é conduzido por modelo, criar um cliente OAuth marcado como agente para a parte de IA e revisar por quanto tempo guarda embeddings e memória feitos a partir desses dados.

Fontes: [Google Cloud Blog](https://cloud.google.com/blog/products/identity-security/deploying-agents-safely-in-your-enterprise), [Workspace AI Tools Addendum](https://workspace.google.com/terms/ai-tools), [cotas da API e do servidor MCP do Gmail](https://developers.google.com/workspace/gmail/api/guides/quotas), [referência do servidor MCP do Gmail](https://developers.google.com/workspace/gmail/api/reference/mcp), [níveis de uso e cotas do Workspace](https://developers.google.com/workspace/tools-safety), [configuração dos servidores MCP](https://developers.google.com/workspace/guides/configure-mcp-servers), [TechStackups](https://techstackups.com/articles/google-workspace-ai-agents-mcp/)

## Falha sem patch no Cacti 1.2.31 deixa visitante convidado rodar comandos no servidor com quatro requisições

**O que é o Cacti.** O Cacti é uma ferramenta open source de monitoramento, escrita em PHP, que coleta métricas de roteadores, switches e servidores, muitas vezes por SNMP, e desenha gráficos com elas. Costuma ficar numa posição privilegiada da rede, porque precisa alcançar e consultar todos esses equipamentos.

**O que foi publicado.** Na quinta (26), um pesquisador que assina ek0ms savi0r publicou no GitHub uma cadeia de ataque contra o Cacti 1.2.31, a versão mais recente, de junho. A watchTowr, que chama a falha de 4HTTP2ROOT, publicou um FAQ no mesmo dia. Segundo ela, ainda não há CVE nem versão corrigida, e até esta sexta não havia relato de exploração.

**A condição.** O ataque só funciona se a conta de convidado estiver ativada. É o recurso que deixa qualquer visitante ver gráficos sem login. No código do Cacti, a opção de usuário convidado vem como "No User", ou seja, desligada. O risco fica com as instalações que ligaram esse acesso e deixaram a interface web alcançável por redes não confiáveis.

**Dois conceitos antes da cadeia.** Injeção de SQL é quando um texto controlado pelo atacante vira parte de um comando do banco de dados. Na injeção "de segunda ordem", o valor é guardado agora e só vira comando depois, quando outra página o lê. E o banco aceita "comandos empilhados": várias instruções SQL numa só chamada, separadas por ponto e vírgula.

**A cadeia, passo a passo.** O pesquisador descreve quatro etapas:

1. O visitante recebe uma sessão de convidado, sem senha.
2. Ele salva a preferência de quantos gráficos ver por página. O valor deveria ser um número, mas o Cacti aceita qualquer texto.
3. Ao abrir a página de gráficos, o Cacti coloca esse texto dentro do `LIMIT` de uma consulta SQL. O atacante empilha um segundo comando, que altera uma linha da tabela onde o Cacti guarda os comandos de coleta.
4. A página de gráfico em tempo real executa o coletor, e ele passa o valor dessa linha para a função `popen()` do PHP, que roda o texto como comando no shell.

**Com que privilégio.** O comando roda com o usuário do servidor web e do coletor do Cacti, "muitas vezes um usuário web de baixo privilégio, não o root", segundo a watchTowr. Mesmo assim, o pesquisador lembra que um Cacti invadido expõe as credenciais que ele guarda para consultar os equipamentos da rede.

**O que fazer enquanto não sai o patch.** As recomendações da watchTowr são:

- desativar a conta de convidado, deixando a opção de usuário convidado como "No User";
- restringir o acesso à interface web a redes confiáveis, como uma VPN ou rede de gerência;
- revisar a configuração do coletor em busca de comandos inesperados;
- procurar nos logs avisos de valores não numéricos em configurações de exibição;
- aplicar a correção quando o projeto publicar uma.

Fontes: [publicação do pesquisador no GitHub](https://github.com/ekomsSavior/Sad-Girls-0day-Club/tree/main/4http2shell), [FAQ da watchTowr](https://watchtowr.com/intelligence/4http2root-cacti-zero-day-faq/), [configuração padrão do usuário convidado no código do Cacti 1.2.31](https://github.com/Cacti/cacti/blob/release/1.2.31/include/global_settings.php)

## OWASP explica por que `git status` não é somente leitura num repositório hostil, e o PolinRider passa a se esconder em `conftest.py`

**A orientação nova.** O OWASP Cheat Sheet Series é uma coleção de guias práticos de segurança mantida pela comunidade da OWASP. Na quinta (26), o projeto aceitou uma seção nova no guia de segurança para agentes de IA. O tema é rodar Git dentro de um workspace cujo conteúdo é controlado pelo repositório, algo que agentes e editores fazem o tempo todo, sem perguntar.

**O mecanismo.** O Git lê a configuração do próprio repositório, e algumas opções apontam um programa para ele executar. O guia lista estas:

- `core.fsmonitor`, um hook que acelera comandos como `git status`;
- `diff.external`, que roda um programa em `git diff`, e `textconv`, que roda em `git diff`, `git log -p`, `git show` e `git blame`;
- os filtros `clean`, `smudge` e `process`, que podem rodar até em `git status` e `git diff` quando um arquivo parece modificado (um `touch` já basta);
- `log.showSignature` junto com um `gpg.program` definido pelo repositório, que roda em `git log` e `git show`.

**Como isso chega ao workspace.** O guia trata de dois cenários: quando o agente consegue escrever essa configuração, ou quando o workspace já chega com ela. Proteger só a pasta `.git/` não basta. Um repositório "bare" guarda os metadados direto na própria pasta, e um deles pode vir aninhado entre os arquivos do projeto. A seção cita casos reais com CVE no GitHub Copilot CLI, no Zed e no Docker Sandboxes.

**As contramedidas.** O guia recomenda:

- rodar o Git de workspaces não confiáveis dentro do sandbox do agente, incluindo o Git que o editor dispara sozinho;
- não aprovar automaticamente nenhum comando Git como "somente leitura", nem `git status`, `git diff`, `git log` e `git show`;
- exigir aprovação antes de o agente escrever em `.git/` ou em arquivos como `HEAD`, `config` e `hooks/` em qualquer lugar do workspace;
- usar opções endurecidas, como `-c core.fsmonitor=false` e `--no-textconv`, só como camada extra dentro do sandbox, porque elas deixam filtros e hooks ativos.

**O mesmo padrão num ataque real.** Na terça (24), a SafeDep publicou uma variante nova do PolinRider, a campanha que o blog já tinha mostrado [em julho](/2026/openssh-10-4-corrige-ssh-e-agentes-tropecam-em-dados-hostis/) envenenando pacotes e repositórios. Agora o carregador é um script Python de 58 linhas, só com a biblioteca padrão, plantado num pacote `utils` ou num `conftest.py`. A SafeDep o encontrou em 375 repositórios públicos de 260 contas.

**Por que o `conftest.py` importa.** O pytest importa sozinho todo arquivo `conftest.py` que encontra ao coletar os testes, então o carregador roda sem nenhuma linha de import no projeto. Ele consulta a transação mais recente de uma carteira Ethereum, lê o campo de dados dessa transação num nó público, decodifica o conteúdo como JavaScript e executa com `node`.

**O que vem depois.** O estágio seguinte busca o endereço do servidor de comando em outra carteira e baixa mais código. A SafeDep não se conectou a esse servidor, então o conteúdo final desta cadeia é desconhecido. Numa cadeia anterior, de setembro, os estágios seguintes instalavam um ladrão de segredos de ambiente, senhas do navegador, cookies e carteiras.

**O que fazer.** Segundo a SafeDep, o carregador Python roda com o pytest, com um script ao lado da pasta `utils` plantada ou com a aplicação iniciada a partir dessa pasta. Se um deles rodou numa máquina com Node.js, ela deve ser tratada como comprometida: troque os segredos do ambiente do shell e as senhas e cookies de sessão salvos no navegador, e tire os fundos de carteiras guardadas nela.

Quem é dono de um repositório infectado também precisa limpar os computadores que fazem push nele e trocar os tokens do GitHub e as chaves SSH, senão o repositório volta a ser infectado. A empresa avisa ainda que datas de commit não provam nada, porque quem controla a máquina ou o token define a data que quiser.

**O ponto em comum.** "Clonar e rodar os testes" e "deixar o agente dar uma olhada no repositório" são, os dois, caminhos de execução de código. A lição que liga os dois casos é a do guia da OWASP: isolar o workspace inteiro em vez de confiar numa lista de comandos considerados seguros.

Fontes: [OWASP CheatSheetSeries, PR #3022](https://github.com/OWASP/CheatSheetSeries/pull/3022), [SafeDep](https://safedep.io/blog/polinrider-python-loader-ethereum-calldata)

## Linus Torvalds aceita a contragosto um pull do ext4 com 94 commits, a maioria das correções feitas por IA, e o kernel ganha um diretório de skills para agentes

**O pull.** Na terça (24), Linus Torvalds incorporou ao kernel o pacote de mudanças do ext4, o sistema de arquivos padrão de muitas distribuições, enviado por Ted Ts'o para o 7.4-rc5. São 94 commits. Na mensagem do merge, Ts'o escreve que a maior parte das linhas novas vem de testes KUnit, "o que torna mais seguro validar patches gerados por IA", e que a maioria das muitas correções "foi gerada por IA".

**Por que o tamanho incomodou.** O kernel aceita novidades só nas duas semanas da janela de merge. Depois vêm as release candidates (rc), que deveriam trazer só correções pequenas. Segundo o It's FOSS, o merge acrescenta mais de 41 mil linhas em 68 arquivos, 22 deles de testes KUnit, o framework de testes unitários que roda dentro do próprio kernel.

**O que cada um disse.** O It's FOSS relata que Torvalds escreveu, num tom duro, que um pull desse tamanho pertence à janela de merge e que chamar algo de correção não o torna adequado para uma rc. Ts'o respondeu que os testes estavam num branch separado, no fim do pull, para poderem ser descartados, e ofereceu reenviar sem eles. Torvalds manteve o merge, dizendo que ainda objetava em parte.

**O que as correções cobrem.** A lista na mensagem do merge inclui problemas sérios: perda de dados já sincronizados com `fsync` em certos casos do fast commit, dados antigos devolvidos depois de uma falha ao zerar blocos, use-after-free depois de uma montagem que falhou e um deadlock entre locks. Também há três ganhos de desempenho, como espalhar inodes de diretórios irmãos para acelerar a criação paralela de arquivos.

**O outro lado da mesma conversa.** Na mesma semana, apareceu no git.kernel.org um branch de Sasha Levin, mantenedor do kernel estável, que cria um diretório `agents/` com "skills" no formato Agent Skills. São instruções para assistentes de código seguirem processos do kernel. Uma delas, de autoria do próprio Ts'o, ensina a escrever testes KUnit.

**O que as skills fazem.** As outras quatro são de Levin. Elas ajudam a:

- descobrir a tag `Fixes:`, que aponta o commit que introduziu um bug;
- decidir se uma correção deve ir para as versões estáveis;
- procurar o mesmo bug em outros pontos do código, com a ferramenta Coccinelle;
- escrever mensagens de commit curtas e no imperativo.

A regra geral é que as skills só inspecionam e relatam, a não ser que a tarefa seja escrever código ou testes. Cada skill devolve o resultado com a evidência que o sustenta, ou diz o que está faltando, sem preencher a lacuna com um palpite.

**Em que pé está.** Os patches foram enviados à lista em outubro e levam o Signed-off-by de Ts'o; quatro deles também têm o Acked-by de Rafael Wysocki, outro mantenedor. Até esta edição, o branch está só na árvore pessoal de Levin, fora do linux-next e do mainline. A próxima chance de entrar é a janela de merge do 7.5.

Fontes: [commit do merge do ext4 no git.kernel.org](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=4dce97c6c265544342e716e62fd24bbb232590c5), [It's FOSS](https://itsfoss.com/news/linux-torvalds-scolds-ext4-maintainer/), [branch agents de Sasha Levin](https://git.kernel.org/pub/scm/linux/kernel/git/sashal/linux.git/log/?h=agents)

## Garage 2.6 ganha painel web de administração, encerra a linha 1.x e abre o beta do 3.0

**O que é o Garage.** O Garage é um armazenamento de objetos compatível com a API do S3, o serviço de arquivos da Amazon que virou padrão de mercado. Ele é feito pelo coletivo francês Deuxfleurs para rodar em máquinas modestas espalhadas por locais diferentes, como alguns servidores em casas ou escritórios distintos, replicando os dados entre eles.

**O painel.** A versão 2.6.0, publicada na quarta (25), traz uma interface web de administração financiada pela NLnet e construída por Tixie Salander ao longo de quase dois anos. Ela roda na porta da API de administração, a 3903 por padrão, pede um token de administrador e cobre monitoramento do cluster, configuração do layout, buckets e chaves de acesso.

**O aviso de segurança.** Os mantenedores escrevem que administrar um cluster remoto por HTTP puro "NÃO é seguro", porque o token viaja sem criptografia. A recomendação é colocar um proxy reverso com HTTPS na frente do nó ou acessar o painel por uma VPN como o WireGuard.

**O resto do anúncio.** A versão vem com outras mudanças:

- há um Helm chart oficial, com versionamento próprio;
- a linha 1.x foi declarada obsoleta, e a última versão dela foi a 1.3.1, de janeiro;
- o 3.0.0-beta1 traz leitura anônima de buckets pela API S3, tags em buckets e objetos e o protocolo Noise no lugar do handshake antigo entre os nós;
- no beta 3.0, os arquivos de metadados no formato Fjall do 2.x não são compatíveis e precisam ser convertidos para LMDB ou SQLite antes da atualização.

**Por que o travamento de objetos será "best-effort".** O versionamento no estilo S3 começa a ser feito em 2027. Os mantenedores avisam que o bloqueio de objetos vai funcionar só no melhor esforço, porque o Garage não usa algoritmo de consenso. Esse tipo de algoritmo faz os nós concordarem numa ordem única de operações. Sem ele, não dá para garantir uma trava em todos os casos.

Pelo mesmo motivo, eles avisam que usar as escritas condicionais como trava distribuída não vai funcionar. O bloqueio de objetos ficará atrás de uma opção que o administrador precisa ligar de propósito.

**Onde isso encontra o e-mail.** Uma reportagem da Linux Magazine sobre servidores de e-mail independentes cita medições de DNS publicadas pelo RIPE Labs. Entre o milhão de domínios web mais acessados, a fatia que usa servidores de e-mail pequenos ou próprios caiu de 44,6% em 2016 para 22,4% em julho de 2026.

A Deuxfleurs desenvolve o Aerogramme, um servidor IMAP que não guarda estado próprio e salva as caixas criptografadas no Garage, e planeja migrar o próprio e-mail para ele por volta de janeiro de 2027.

Fontes: [blog do Garage](https://garagehq.deuxfleurs.fr/blog/2026-11-webadmin-release/), [Linux Magazine](https://www.linux-magazine.com/Online/Features/Taking-Email-Back)

## No TabNews, duas ferramentas para VPS que colocam a trava antes da ação: Gaia para endurecer o servidor e um MCP do Coolify com escrita desligável

**O Gaia.** O desenvolvedor jaovitm apresentou no TabNews o Gaia, um script em Bash puro, sob licença Apache 2.0, que pega um Ubuntu ou Debian recém-instalado e aplica um endurecimento básico com um comando. O README cobre Ubuntu 22.04, 24.04 e 26.04 e Debian 12 e 13. O repositório foi criado na terça (24).

**O que ele faz.** Segundo o README, o Gaia faz estas configurações:

- cria uma conta administradora com chave SSH e desliga o login de root e por senha;
- liga o firewall `ufw` negando conexões de entrada, depois de liberar o SSH;
- configura o fail2ban e as atualizações automáticas só de segurança;
- ajusta o kernel contra spoofing e SYN flood e mantém o AppArmor ativo;
- opcionalmente instala Docker, com o firewall valendo também para as portas dos containers, e o Caddy com HTTPS automático.

**A trava.** O ponto mais útil para iniciantes é o cuidado para não trancar o dono do lado de fora. A configuração do SSH é validada antes de valer e revertida se algo não bater, e o Gaia não continua sem uma chave pública válida. O `--dry-run` mostra o que mudaria sem tocar no sistema. O Lynis, um auditor de segurança, roda antes e depois para medir o efeito.

Como em qualquer script que mexe em SSH e firewall, vale ler o código e testar numa VM descartável antes de rodar numa VPS de produção, mantendo a sessão atual aberta até conseguir entrar por uma segunda.

**O MCP do Coolify.** O Coolify é uma plataforma open source para fazer deploy de apps e bancos na sua própria VPS, no estilo Heroku. Num tutorial publicado no TabNews pelo usuário fernandochagas, o autor mostra como ligar Claude Code, Cursor ou Codex ao Coolify pelo servidor MCP open source `@fndchagas/coolify-mcp`. Com ele, o agente cria projetos, configura variáveis, dispara deploys e lê logs de build.

**As travas do MCP.** O tutorial sugere três camadas:

- um token de API do Coolify com o menor privilégio possível, só leitura para começar;
- a variável `COOLIFY_ALLOW_WRITE=false`, que bloqueia criação, alteração, exclusão e deploy no próprio servidor MCP;
- a confirmação humana antes de exclusões, que vem ligada e aparece nos clientes MCP que suportam esse pedido, como o Claude Code.

Um detalhe que o README do projeto mostra: o padrão de `COOLIFY_ALLOW_WRITE` é `true`. Por isso o tutorial manda começar com o valor `false` e só liberar a escrita depois de validar a leitura. Ele também lembra de não versionar o arquivo de configuração do MCP com o token dentro.

Fontes: [Gaia no TabNews](https://www.tabnews.com.br/jaovitm/oss-para-seguranca-de-servidores), [repositório do Gaia](https://github.com/Black-Ghost-Corp/gaia-harden), [tutorial do Coolify MCP no TabNews](https://www.tabnews.com.br/fernandochagas/coolify-mcp-na-vps-deploy-com-claude-code-cursor-e-codex), [repositório do coolify-mcp](https://github.com/frndchagas/coolify-mcp)

## Destaques rápidos para hoje.

- **Suíça confirma as primeiras invasões feitas com ajuda de agentes de IA.** O Centro Nacional de Cibersegurança suíço (NCSC) informou na terça (24) que recebeu os primeiros relatos de ataques conduzidos com agentes de IA, e que em todos os casos conhecidos houve comprometimento. Foram atingidas organizações e operadores de infraestrutura crítica de pelo menos dois setores, sem nomes. O órgão diz que o número de agentes ofensivos acessíveis pela internet, como ARTEX e CyberStrikeAI, quase dobrou desde outubro, e pede que falhas críticas em sistemas expostos sejam corrigidas em até 24 horas. Fonte: [NCSC da Suíça](https://www.bacs.admin.ch/en/26-ki-agenten-1-en)

- **Falhas do Mitel MiCollab e do Juniper Session Smart entram na lista de exploradas da CISA.** A agência americana incluiu na quarta (25) cinco CVEs do componente de conferência do MiCollab 10.3 e anteriores, corrigidas pela Mitel em 16 de novembro. A Accenture diz ter alta confiança de que elas foram exploradas antes do patch e avalia, com base em telemetria amostrada, que ferramentas com IA conduziram parte da invasão. A lista também ganhou uma falha de 9,8 no Juniper Session Smart Conductor, nota dada pela própria Juniper, com pelo menos um caso de exploração relatado e correção nas versões 7.0.5, 7.1.7 e 7.2.3. Fontes: [Accenture](https://accenture.github.io/cyber-intelligence/micollab-exploitation/), [CISA](https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog), [registro da CVE da Juniper](https://www.cve.org/CVERecord?id=CVE-2026-103406)

- **SAP confirma atividade suspeita, e a imprensa alemã fala em código-fonte no GitHub.** A SAP disse à SecurityWeek que detectou atividade suspeita e que, até agora, não encontrou acesso indevido a dados de negócio de clientes. O que vai além disso ainda não foi confirmado pela empresa. Segundo a Der Spiegel, invasores obtiveram tokens de funcionários e copiaram e alteraram código no GitHub. A dpa relata que a atividade foi identificada no GitHub, e o Handelsblatt fala em troca de chaves de assinatura e acesso restrito ao GitHub. Nenhuma das reportagens indica que código alterado tenha chegado a clientes. Fontes: [SecurityWeek](https://www.securityweek.com/sap-confirms-cyberattack-source-code-reportedly-compromised/), [heise](https://www.heise.de/news/IT-Vorfall-bei-SAP-Entwicklungssysteme-betroffen-11539973.html)

- **Pesquisador liga provedores de inferência "sem retenção" à nuvem da ByteDance.** O caso continua a história das [iscas da Dragos no OpenRouter](/2026/openrouter-dragos-ghostscript-upload2shell-cpp26-buzios/). Num post de quarta (25), o autor do blog kendell.dev afirma que Novita, StreamLake e Ant Digital revendem a plataforma Ark, da ByteDance. Ele se baseia em quem baixa as imagens enviadas nos prompts, no formato dos IDs de chamadas de ferramenta e numa recusa de censura idêntica à da ByteDance. A conclusão é dele e não foi confirmada pelas empresas. Separadamente, Novita e MiniMax confirmaram que pedidos de modelos MiniMax, incluindo alguns marcados como sem retenção, foram repassados à MiniMax. Fontes: [Kendell](https://kendell.dev/blog/arkwrapper/), [Novita](https://novita.ai/blog/minimax-requests-privacy-notice/), [MiniMax](https://www.minimax.io/blog/update-on-url-access-in-forwarded-api-requests-20261124)

- **Restore do PostgreSQL com um arquivo faltando sobe sem erro e devolve dados pela metade.** Christophe Pettus testou uma tabela de 2.400 MB dividida em três arquivos de segmento e apagou o do meio numa cópia restaurada. O servidor subiu sem reclamar, um scan sequencial devolveu só as linhas do primeiro arquivo e o `pg_dump` terminou com sucesso. A única ferramenta que acusou o problema foi o `pg_verifybackup`, rodado sobre a cópia antes de subir o servidor, comparando com o manifesto do backup. Fonte: [The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-segment_size/)

- **MariaDB 13.1 vira estável com `DENY` para negar privilégios e os operadores JSON do MySQL.** A versão 13.1.2 saiu na segunda (23) como estável, numa linha de lançamento contínuo, não LTS. O `DENY` registra um privilégio que a conta nunca deve ter e vence qualquer `GRANT`. Os operadores `->` e `->>` permitem rodar consultas JSON do MySQL sem mudança. Atenção na atualização: `utf8` agora significa `utf8mb4`, e o `mariadb-dump` deixa de gravar valores de colunas geradas. Fonte: [notas da versão](https://mariadb.com/docs/release-notes/community-server/13.1/13.1.2)

- **Brush 0.5, shell compatível com Bash escrito em Rust, passa em mais de 96% da suíte do bash-completion.** A versão saiu na quinta (26) com 2.040 testes passando na suíte de autocompletar, medidos no CI do projeto. A suíte própria de compatibilidade com o Bash cresceu de cerca de 2.100 para mais de 3.600 casos, e esta é a primeira versão com binários prontos para Windows. Fonte: [release no GitHub](https://github.com/reubeno/brush/releases/tag/brush-shell-v0.5.0)

- **BlueZ, a pilha de Bluetooth do Linux, ficou meses com o e-mail de segurança sem funcionar.** Bastien Nocera conta que o site bluez.org e os aliases de e-mail que ele hospedava pararam neste ano, e que o endereço de segurança virou um buraco negro por alguns meses. O projeto agora tem uma política em `SECURITY.md`, com relatos pelo GitHub. Ele também prepara a migração do build para o Meson, que levou a suíte de testes de 50 segundos para menos de 4. Fonte: [blog de Bastien Nocera](https://www.hadess.net/2026/11/bluez-news-2026.html)

- **O preço por terabyte de HD dobrou em dois anos nas compras de um homelabber.** O autor do blog ktz pagou US$ 249,99 num HD externo WD de 20 TB em novembro de 2024, cerca de US$ 12,50 por TB. Nesta Black Friday, o mesmo modelo está a US$ 549,99, ou US$ 27,50 por TB. Em discos recertificados e recondicionados que ele acompanha, as altas vão de 58% a 218%. São preços de varejo americano anotados por uma pessoa, não um índice de mercado. Fonte: [blog ktz](https://blog.ktz.me/black-friday-hard-drive-prices-are-messed-up/)

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 35993
source_urls:
  - https://cloud.google.com/blog/products/identity-security/deploying-agents-safely-in-your-enterprise
  - https://workspace.google.com/terms/ai-tools
  - https://developers.google.com/workspace/gmail/api/guides/quotas
  - https://developers.google.com/workspace/gmail/api/reference/mcp
  - https://developers.google.com/workspace/tools-safety
  - https://developers.google.com/workspace/guides/configure-mcp-servers
  - https://techstackups.com/articles/google-workspace-ai-agents-mcp/
  - https://github.com/ekomsSavior/Sad-Girls-0day-Club/tree/main/4http2shell
  - https://watchtowr.com/intelligence/4http2root-cacti-zero-day-faq/
  - https://github.com/Cacti/cacti/blob/release/1.2.31/include/global_settings.php
  - https://github.com/OWASP/CheatSheetSeries/pull/3022
  - https://safedep.io/blog/polinrider-python-loader-ethereum-calldata
  - https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=4dce97c6c265544342e716e62fd24bbb232590c5
  - https://itsfoss.com/news/linux-torvalds-scolds-ext4-maintainer/
  - https://git.kernel.org/pub/scm/linux/kernel/git/sashal/linux.git/log/?h=agents
  - https://garagehq.deuxfleurs.fr/blog/2026-11-webadmin-release/
  - https://www.linux-magazine.com/Online/Features/Taking-Email-Back
  - https://www.tabnews.com.br/jaovitm/oss-para-seguranca-de-servidores
  - https://github.com/Black-Ghost-Corp/gaia-harden
  - https://www.tabnews.com.br/fernandochagas/coolify-mcp-na-vps-deploy-com-claude-code-cursor-e-codex
  - https://github.com/frndchagas/coolify-mcp
  - https://www.bacs.admin.ch/en/26-ki-agenten-1-en
  - https://accenture.github.io/cyber-intelligence/micollab-exploitation/
  - https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog
  - https://www.cve.org/CVERecord?id=CVE-2026-103406
  - https://www.securityweek.com/sap-confirms-cyberattack-source-code-reportedly-compromised/
  - https://www.heise.de/news/IT-Vorfall-bei-SAP-Entwicklungssysteme-betroffen-11539973.html
  - https://kendell.dev/blog/arkwrapper/
  - https://novita.ai/blog/minimax-requests-privacy-notice/
  - https://www.minimax.io/blog/update-on-url-access-in-forwarded-api-requests-20261124
  - https://thebuild.com/blog/all-your-gucs-in-a-row-segment_size/
  - https://mariadb.com/docs/release-notes/community-server/13.1/13.1.2
  - https://github.com/reubeno/brush/releases/tag/brush-shell-v0.5.0
  - https://www.hadess.net/2026/11/bluez-news-2026.html
  - https://blog.ktz.me/black-friday-hard-drive-prices-are-messed-up/
-->
