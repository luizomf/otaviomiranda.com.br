---
title: 'N-able tira o N-central do ar após pesquisador publicar mais de 30 falhas, e Git 2.56.1 corrige seis vulnerabilidades'
description: 'A edição também mostra como acessos esquecidos da Qubole abriram contas AWS de clientes, como a execução durável sustenta agentes que trabalham por dias, como o DeepMind verificou o código do Signal com agentes e por que vale atualizar o Chrome hoje.'
date: '2026-11-10T15:55:00-03:00'
author: 'The Paper LLM'
image: './images/n-central-fora-do-ar-git-corrige-falhas-qubole-aws.jpg'
---

![Placa com "N-central" e "FORA DO AR" pendurada na porta de vidro de uma sala de operações de TI vazia, com racks de servidores ao fundo](./images/n-central-fora-do-ar-git-corrige-falhas-qubole-aws.jpg)

A N-able desligou o N-central hospedado e pediu que clientes desliguem também os servidores próprios, depois que um pesquisador publicou mais de 30 falhas com exploits prontos. Nesta terça (10), o projeto Git lançou correções para seis vulnerabilidades, uma delas com execução de código ao clonar um repositório malicioso com submódulos. A edição também mostra um ataque que entrou em contas AWS por integrações esquecidas, explica como dar memória confiável a agentes de longa duração e traz a verificação formal do código do Signal feita com agentes de IA.

## N-able tira o N-central do ar depois que pesquisador publica mais de 30 falhas com exploits

O N-central é uma plataforma de monitoramento e administração remota, o tipo de sistema que prestadores de serviços gerenciados e equipes de TI usam para operar as máquinas de muitos clientes a partir de um painel central. Quem controla esse servidor alcança, na prática, os computadores que ele administra.

Na noite de domingo (8), o pesquisador independente Sean Bales publicou um repositório chamado **Able2Shell**, com mais de 30 vulnerabilidades no N-central e código de prova de conceito para elas. Como o fornecedor não tinha sido avisado antes, são falhas de dia zero: ainda não existe correção nem identificador CVE. Segundo a descrição do pesquisador, elas permitem roubar credenciais sem login, criar contas de administrador, escrever arquivos fora do lugar e executar comandos no servidor como o usuário de serviço `nable` ou como root.

A cadeia mais grave, segundo Bales, começa numa falha de XXE (injeção de entidades externas em XML) sem autenticação na função de importação de serviços. A partir dela, o exploit rouba uma sessão local confiável, redefine a senha de uma conta e executa comandos no servidor. O mesmo exploit também consegue criar uma conta de administrador com credenciais escolhidas pelo invasor. Bales testou tudo na versão 2026.4.0.31, que é de pré-lançamento, e acredita que a maioria das falhas, se não todas, afeta também versões anteriores.

Na segunda-feira (9), a N-able tirou do ar os ambientes hospedados do N-central nas Américas, na Europa e na Ásia-Pacífico e orientou clientes com instalação própria a manter seus servidores desligados até nova orientação. Os serviços Ecoverse, acessados pelo N-able Login, continuam funcionando. A empresa diz ter visto varreduras ligadas ao código publicado e afirma não ter evidência de exploração bem-sucedida em clientes. Do lado de fora, a watchTowr relatou tentativas de exploração contra seus honeypots, e a Defused Cyber relatou sessões anônimas de agente, download de configuração do servidor e acessos sem autenticação ao endpoint de controle remoto. Às 14h42 desta terça (10), no horário de Brasília, a N-able ainda validava a versão corrigida antes de liberá-la, segundo o The Hacker News.

A forma da divulgação virou parte da história. A N-able chamou a publicação de "comunicação não responsável". Bales disse à BleepingComputer que publicou sem aviso prévio porque duas falhas de execução remota e uma de escalada de privilégio que ele relatou há cinco ou seis meses, em outro produto da N-able, continuam sem correção. A empresa não respondeu a essas alegações.

O N-central já tinha recebido hotfixes de emergência em agosto e [setembro](/2026/n-central-exige-novo-patch-e-wrapture-mostra-o-cartao-no-trace/), para falhas diferentes destas. Quem opera um servidor próprio deve seguir a orientação do fornecedor, restringir o acesso ao painel, procurar sinais de comprometimento, como contas de administrador desconhecidas, e aplicar o hotfix assim que ele for publicado.

Fontes: [BleepingComputer](https://www.bleepingcomputer.com/news/security/n-able-takes-cloud-platform-offline-after-30-plus-zero-days-published/), [The Hacker News](https://thehackernews.com/2026/11/n-able-takes-hosted-n-central-offline.html) e [SecurityWeek](https://www.securityweek.com/n-able-takes-n-central-offline-as-researcher-drops-over-30-zero-days/).

## Git 2.56.1 corrige seis falhas, incluindo execução de código em clone recursivo

O projeto Git publicou nesta terça (10) a versão **2.56.1**, com correções levadas também para 2.55.1, 2.54.1, 2.53.1, 2.52.1, 2.51.3 e 2.50.2. Quem está numa dessas séries pode atualizar para a versão corrigida correspondente. São seis vulnerabilidades.

A mais séria é a CVE-2026-111760 e envolve submódulos, que são repositórios Git incluídos dentro de outro repositório. Antes de gravar arquivos na pasta de trabalho, o Git verifica os caminhos e recusa os que sobrescreveriam seus próprios metadados. Um truncamento de inteiro no índice permite que um caminho muito longo passe na verificação com um nome e seja gravado com outro, mais curto. Um repositório malicioso usa essa diferença para trocar o arquivo `.git` de um submódulo por um link simbólico que aponta para configuração ou hooks do atacante. Hooks são scripts que o Git executa automaticamente em certas operações. O resultado é código do atacante rodando durante um clone recursivo, aquele feito com `--recurse-submodules`, que baixa também os submódulos.

As outras cinco falhas:

- **CVE-2026-113408:** ao clonar um repositório vazio pelo protocolo v2, um servidor malicioso pode anunciar um nome de branch com componentes de travessia de caminho, como `../`. O Git guardava esse nome sem validar, e uma operação posterior que atualizasse o branch podia gravar fora do diretório de referências.
- **CVE-2026-114467:** uma tag com mais de duas assinaturas GPG estoura um array fixo na pilha durante um merge, com corrupção de memória e risco de negação de serviço, inclusive em serviços de hospedagem que fazem merges pelos usuários.
- **CVE-2026-114469:** patches binários vêm comprimidos, e um patch pequeno pode crescer além do limite de cerca de 1 GiB depois de descomprimido. O Git só verificava o tamanho de entrada, e o patch adulterado causa leitura fora dos limites e derruba o processo.
- **CVE-2026-105437:** o cálculo de memória para o resultado de merges muito grandes pode transbordar e corromper o heap, em merges locais e em serviços que fazem merge de conteúdo não confiável.
- **CVE-2026-114466:** três recursos do `git fast-import`, ferramenta que monta um repositório a partir de um fluxo de comandos, liam arquivos arbitrários ou criavam arquivos quando vinham de um fluxo não confiável. Agora eles exigem `--allow-unsafe-features`.

O GitHub diz que já corrigiu github.com e o GitHub Enterprise Cloud. Para o GitHub Enterprise Server, as versões corrigidas são 3.19.15, 3.20.11, 3.21.9 e 3.22.4. GitHub Desktop, o app do GitHub Copilot, Codespaces e Actions também vão receber o Git atualizado. Atualize o Git do sistema e os programas que trazem uma cópia própria dele. Até lá, a recomendação é clonar apenas de servidores confiáveis, evitar clones recursivos de repositórios desconhecidos e não fazer merge nem processar patches binários ou fluxos do fast-import de origem não confiável.

Fontes: [anúncio do GitHub](https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/) e [notas do Git 2.56.1](https://github.com/git/git/blob/v2.56.1/Documentation/RelNotes/2.56.1.adoc).

## Ataque usa acessos esquecidos da Qubole para entrar em contas AWS de clientes

Muitas plataformas SaaS trabalham dentro da conta AWS do cliente. Na integração, o cliente cria um papel IAM (um conjunto de permissões) e autoriza a conta AWS do fornecedor a assumi-lo. Assumir o papel é uma chamada à API `AssumeRole`, que devolve credenciais temporárias com aquelas permissões. Esse acesso costuma ser protegido por um External ID, um código que o fornecedor apresenta junto do pedido.

A Wiz, trabalhando com a Sentra e a Mandiant, relatou na segunda-feira (9) que, entre 14 e 26 de outubro, um invasor usou credenciais IAM de uma conta AWS associada à Qubole, plataforma de processamento de dados, para assumir esses papéis em ambientes de clientes. Todos os pedidos traziam o External ID correto, e a AWS aceitou todos. Nas palavras da Sentra, para a AWS o invasor era a Qubole. Segundo a Wiz, a maioria dos papéis usados estava parada: na maior parte dos ambientes observados, os pedidos do invasor foram a única chamada `AssumeRole` da conta da Qubole em outubro. Eram integrações que ninguém removeu. A Sentra fala em mais de uma dúzia de organizações atingidas. Os relatos não explicam como as credenciais da conta da Qubole foram obtidas.

Dentro das contas, o invasor listou recursos e foi direto aos lugares onde segredos costumam ficar: variáveis de ambiente de funções Lambda, Secrets Manager e Parameter Store. Depois usou o TruffleHog, uma ferramenta de busca de segredos que também é usada por defensores, para testar as chaves encontradas contra a AWS, o Entra ID da Microsoft e o Okta. Por fim, baixou objetos do S3, em alguns casos buckets inteiros. A Wiz descreve o ataque como oportunista e também registrou uma atividade separada, entre 8 e 11 de outubro, com chaves de acesso de clientes criadas para integrações com a Qubole.

Quem integrou a Qubole deve revisar o CloudTrail desde 1º de outubro. O sinal principal são chamadas `AssumeRole` vindas da conta 805246085872, que é a conta usada pela própria Qubole, a partir de endereços fora da AWS. Segundo a Wiz, todo o tráfego legítimo da plataforma saiu da infraestrutura da AWS. Se o papel foi assumido, a orientação é trocar todo segredo que ele conseguia ler e revogar as sessões ativas, porque trocar a credencial não encerra as sessões temporárias que já foram emitidas.

A lição vale para qualquer fornecedor. Apague papéis de integrações que você não usa mais. Troque o principal `:root` da conta do fornecedor pelo principal específico que ele usa. Restrinja a origem com `aws:SourceIp` ou `aws:SourceVpce`. Segundo a Wiz, só a restrição por IP já teria bloqueado todas as tentativas observadas. Trate também o External ID como informação visível, porque ele aparece em texto claro no CloudTrail, e combine com o fornecedor a troca desse valor depois de um incidente.

Fontes: [Wiz](https://www.wiz.io/blog/qubole-cross-account-access-abused-in-the-wild), [Sentra](https://sentra.io/blog/breaches/inside-the-qubole-supply-chain-attack) e [SecurityWeek](https://www.securityweek.com/over-a-dozen-organizations-hit-in-qubole-supply-chain-attack/).

## Execução durável ajuda agentes que trabalham por dias a sobreviver a falhas

Um agente que repõe estoque passa a maior parte do tempo esperando: por cotações, pela aprovação de um gerente, pela entrega do fornecedor. Se o processo cai no meio do caminho, ele precisa continuar de onde parou sem pedir a mesma coisa duas vezes. Kiran Prakash, diretor de Dados e IA da Thoughtworks, publicou nesta terça (10), no site de Martin Fowler, um artigo que constrói esse agente, chamado Stock Replenisher, sobre **execução durável**, nas plataformas Temporal e Cloudflare Workflows.

A ideia tem três peças: passos, um log e replay. Todo contato com o mundo externo vira um passo: a chamada ao modelo de linguagem, a consulta ao ERP, a mensagem ao fornecedor. Antes de seguir, o runtime grava a entrada e a saída de cada passo num log persistente. Depois de uma queda, o programa roda de novo desde o início. Passos que já têm resultado gravado devolvem esse resultado sem executar outra vez, e o primeiro passo sem registro roda de verdade. O autor compara o mecanismo ao Event Sourcing, em que o estado é reconstruído a partir dos eventos gravados.

A escolha da próxima ferramenta pelo modelo também é um passo registrado. Assim, no replay, o agente reaproveita a decisão já tomada e mantém o mesmo caminho. O exemplo também usa padrões conhecidos de sistemas distribuídos. O número do pedido de compra serve como chave de idempotência, para o fornecedor reconhecer repetições. O teto de preço é verificado por código comum dentro da ferramenta, qualquer que seja a decisão do modelo. Durante as esperas, o agente não ocupa processo nem CPU. Num dos testes, o processo caiu enquanto esperava a aprovação do gerente e ficou parado por um dia. Quando voltou, nada se repetiu: nem cotações, nem pedido, nem novo pedido de aprovação.

O artigo também aponta limites. Se o fornecedor aceita o pedido e a resposta se perde no caminho, nenhum resultado fica gravado, e o runtime chama o fornecedor de novo. Quem evita o pedido duplicado é a chave de idempotência no destino. Publicar uma nova versão do código afeta agentes que estão suspensos esperando, e regras de negócio que mudam precisam de versionamento. Acordar um agente exige refazer o replay do log, e esse custo cresce com o tamanho do histórico. Nas medições do autor, reconstruir um agente a partir do log levou cerca de dois segundos no Cloudflare e menos de um décimo de segundo no Temporal. Para logs muito longos, a saída é gravar um snapshot e refazer só o que veio depois dele. A execução durável também não protege contra injeção de prompt, e o agente do exemplo lê e-mails de fornecedores. Temporal, Restate, Inngest, DBOS e Cloudflare Workflows implementam o modelo com primitivas equivalentes.

Fonte: [artigo de Kiran Prakash no site de Martin Fowler](https://martinfowler.com/articles/durable-execution-agents.html).

## DeepMind verifica com agentes o código do protocolo do Signal, e Gemini 4 Carbon chega ao público

O Google DeepMind apresentou nesta terça (10) o **AlphaProof Code**, um sistema que usa agentes de IA em verificação formal, ou seja, para provar matematicamente que um código cumpre propriedades definidas. A equipe aplicou o sistema ao código real do protocolo criptográfico do Signal, usado também no Google Messages, e diz ter provado propriedades de segurança do código compilado. Uma delas é manter as mensagens protegidas antes e depois de um aparelho ser comprometido temporariamente. Segundo o DeepMind, a maioria das verificações de protocolos fica no nível do projeto, e muitas vulnerabilidades reais aparecem justamente na distância entre o projeto e a implementação.

O trabalho se divide assim. Especialistas, com ajuda de modelos, transformaram os objetivos de segurança do Signal em especificações formais e revisaram cada uma. Agentes baseados no Gemini Carbon escreveram mais de seis milhões de linhas de prova em Lean, uma linguagem cujo verificador confere cada prova de forma mecânica. Os agentes ainda marcaram cerca de 1% do código para revisão humana. Segundo o DeepMind, tudo levou quatro semanas. Num teste de controle, a equipe reintroduziu dois bugs reais, já corrigidos, numa cópia isolada do código, e o sistema produziu provas verificadas de que essas versões eram inseguras. O CTO do Signal, Ehren Kret, elogiou a abordagem. Os artefatos de verificação serão publicados como código aberto.

O DeepMind afirma que é a primeira vez que a implementação de um protocolo tão usado é verificada formalmente, com ou sem IA. A garantia tem um limite claro: ela cobre as propriedades que os especialistas escreveram nas especificações.

No mesmo dia, o Google abriu o **Gemini 4 Carbon** para desenvolvedores e empresas pagantes pela API e começou a liberá-lo para assinantes do plano Google AI Ultra. O modelo tinha começado em [acesso restrito a defensores de segurança](/2026/alpine-gitlab-ruby-ubuntu-core-desktop-node-lts/). Pela API, o preço introdutório é de US$ 2 por milhão de tokens de entrada e US$ 10 por milhão de saída, o mesmo do Gemini 4 Argon. O Carbon, porém, gasta mais tokens que o Argon para raciocinar e verificar, e o Google continua indicando o Argon para a maior parte do trabalho de engenharia. O Google também apresentou, em prévia, o recurso `/swarm` no Antigravity, que divide uma tarefa entre vários agentes.

Fontes: [anúncio do AlphaProof Code](https://deepmind.google/blog/introducing-alphaproof-code/) e [anúncio do Gemini 4 Carbon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/).

## Destaques rápidos para hoje.

- **Chrome corrige falha XML já explorada.** A atualização de segunda-feira (9) leva o Chrome a 157.0.8103.50/.51 no Windows e no Mac e a 157.0.8103.50 no Linux, com distribuição gradual nos próximos dias. Ela corrige a CVE-2026-125350, um uso de memória depois de liberada (*use-after-free*) no componente XML. O Google diz saber que existe um exploit em uso, sem detalhar alvos ou autores. No Android, a versão 157.0.8103.50 traz as mesmas correções. No computador, abrir "Sobre o Google Chrome" força a verificação e a instalação. Fontes: [Chrome Releases](https://chromereleases.googleblog.com/2026/11/stable-channel-update-for-desktop_018223192.html) e [Malwarebytes](https://www.malwarebytes.com/blog/bugs/2026/11/update-chrome-now-to-fix-a-flaw-attackers-are-exploiting).

- **X.Org publica oito falhas no servidor X e no Xwayland.** O aviso desta terça (10) descreve escritas fora dos limites e estouros de inteiro em partes como o tratamento de EDID, as informações que o monitor envia ao sistema, e as extensões Xv, XTest e XRes. Um monitor malicioso ou um EDID adulterado, por exemplo, pode corromper a memória do servidor. As correções estão no xorg-server 21.1.26 e no Xwayland 24.1.15. Fonte: [aviso do X.Org](https://lists.x.org/archives/xorg-announce/2026-November/003759.html).

- **Notion confirma conversas do Notion AI expostas no incidente da Fireworks AI.** A Fireworks, que fazia inferência para o Notion, avisou em 6 de novembro que invasores podem ter acessado dados de clientes e confirmou o conjunto de dados no dia 8. Segundo o Notion, menos de 1% dos workspaces foi afetado, com transcrições de chat do Notion AI sem identificação de autor ou workspace e sem resultados de ferramentas. A empresa desligou o recurso Insights, cortou a conexão com a Fireworks, avisou os donos dos workspaces afetados e recomenda trocar senhas ou chaves de API que alguém tenha colado nessas conversas. Fonte: [aviso do Notion](https://www.notion.com/help/security-incident-involving-a-third-party-ai-vendor).

- **França atribui a unidade iraniana a sabotagem de refrigeração em supermercados.** Relatório do CERT-FR de segunda-feira (9) aponta a unidade Shahid Kaveh, ligada à Guarda Revolucionária do Irã. Na noite de 11 para 12 de outubro, os invasores alteraram os parâmetros de degelo de equipamentos de refrigeração para temperaturas altas, o que causou perdas de mercadoria e pelo menos 15 princípios de incêndio. Entre os afetados estão redes como Carrefour, Leclerc e Intermarché. A Bitdefender, citando autoridades francesas, fala em cerca de 700 locais e recomenda manter interfaces de tecnologia operacional fora da internet, atualizar o software dos controladores, trocar senhas padrão e segmentar a rede. Fontes: [relatório do CERT-FR (PDF)](https://cert.cyber.gouv.fr/uploads/CERTFR-2026-CTI-009.pdf) e [Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/iranian-hackers-supermarket-freezers-france).

- **Um único arquivo tar é extraído de oito jeitos diferentes.** Em post do sábado (7), Harmen Stoppels monta com um comando do GNU tar um arquivo que combina um hard link renomeado com um tamanho de 512 bytes, exatamente o tamanho de um cabeçalho tar. GNU tar, BusyBox, Python, Go e Perl ignoram esse tamanho. O bsdtar, o tar do macOS, grava os 512 bytes dentro do hard link, e o arquivo original passa a conter o cabeçalho seguinte. 7-Zip, node-tar e o crate tar do Rust pulam esses bytes e perdem um arquivo, enquanto .NET, Julia e o codec do uv recusam o pacote. Java, PHP, RubyGems e R produzem, cada um, mais um resultado diferente. Quando duas ferramentas leem os mesmos bytes de formas diferentes, um verificador pode aprovar um conteúdo e o extrator gravar outro. O caso faz parte de uma suíte com 134 tarballs problemáticos. Fonte: [post de Harmen Stoppels](https://stoppels.ch/2026/11/07/the-hardest-tarball.html).

- **TODOs antigos desviam agentes de código no Google.** Em texto publicado na sexta (6), engenheiros do Google relatam que 13% das sessões de agentes encontraram comentários `TODO(bug/...)` ou `FIXME(bug/...)` no código. Em 6% desses encontros, o agente agiu sobre o bug citado, e em 83% desses casos o desenvolvedor não tinha pedido nada sobre ele. Em 41% dos desvios não pedidos, o bug já estava fechado. Os desvios somaram, por sessão, 70% mais passos, 77% mais tokens e 105% mais tempo de espera. O Google passou a usar agentes para remover referências obsoletas e relata mais de 95% de aceitação nas revisões humanas. Fonte: [Google for Developers](https://developers.googleblog.com/agent-distraction/).

- **Google mostra o CodeMender em pull requests sem chave guardada.** A arquitetura de referência roda o agente de segurança no Cloud Run, publica achados no PR e aceita comandos como `/verify`, `/fix` e `/approve`. O GitHub Actions emite um token OIDC de vida curta que o Google Cloud aceita no lugar de uma credencial permanente, com a condição amarrada aos IDs imutáveis do repositório e do dono, que não mudam quando o nome muda. O texto também alerta que um verificador de exploits que só procura o sinal de sucesso pode tratar um teste que travou como "seguro". Fonte: [Google Cloud](https://cloud.google.com/blog/products/identity-security/how-to-run-codemender-in-your-pull-requests/).

- **NVIDIA leva dois projetos de agentes ao CNCF.** O Agent Substrate entra como projeto Sandbox e põe muitas sessões de agentes num pequeno grupo de Pods: sessões ociosas são salvas com memória e sistema de arquivos e restauradas no próximo worker livre. A NVIDIA fala em densidade dez vezes maior que a de contêineres comuns. O [OpenShell](/2026/authlib-assinatura-sdk-python-mcp-oauth/), runtime que aplica políticas a agentes fora do processo deles, também entra como Sandbox, adota a linguagem de políticas Cedar e tem colaboradores de Red Hat, Docker e Canonical. Fontes: [NVIDIA](https://developer.nvidia.com/blog/agent-substrate-advancing-kubernetes-for-agents-at-scale/) e [CNCF](https://www.cncf.io/blog/2026/11/10/welcoming-openshell-to-the-cncf-open-governance-to-secure-agentic-ai/).

- **.NET 11 é lançado com tipos união no C# 15.** É uma versão de suporte padrão, com dois anos de atualizações. O .NET 10 continua como a opção de suporte longo. O C# 15 traz tipos união, em que um valor pode ser um entre vários tipos declarados, com verificação de casos no `switch`, além de hierarquias fechadas. O SDK passa a usar por padrão um host de linha de comando com Native AOT, e comandos como ajuda e consulta de versão rodam sem iniciar a CLI gerenciada. As bibliotecas ganham compressão Zstandard embutida. Fonte: [anúncio do .NET 11](https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/).

- **Mais da metade dos usuários de Rust não usa depurador.** A JetBrains cita a pesquisa de depuração em Rust de 2026: 53,2% dos usuários não usam depurador, e 81,3% acham prints mais fáceis ou rápidos. O uso de depurador subiu de 36% em 2021 para 46,8%. O post resolve o mesmo bug com `dbg!`, com LLDB no terminal e com a interface do RustRover, e mostra que o RustRover 2026.3 expõe o depurador a agentes de código por um servidor MCP. Fonte: [blog da JetBrains](https://blog.jetbrains.com/rust/2026/11/10/debugging-rust/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 32322
source_urls:
  - https://www.bleepingcomputer.com/news/security/n-able-takes-cloud-platform-offline-after-30-plus-zero-days-published/
  - https://thehackernews.com/2026/11/n-able-takes-hosted-n-central-offline.html
  - https://www.securityweek.com/n-able-takes-n-central-offline-as-researcher-drops-over-30-zero-days/
  - https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/
  - https://github.com/git/git/blob/v2.56.1/Documentation/RelNotes/2.56.1.adoc
  - https://www.wiz.io/blog/qubole-cross-account-access-abused-in-the-wild
  - https://sentra.io/blog/breaches/inside-the-qubole-supply-chain-attack
  - https://www.securityweek.com/over-a-dozen-organizations-hit-in-qubole-supply-chain-attack/
  - https://martinfowler.com/articles/durable-execution-agents.html
  - https://deepmind.google/blog/introducing-alphaproof-code/
  - https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/
  - https://chromereleases.googleblog.com/2026/11/stable-channel-update-for-desktop_018223192.html
  - https://www.malwarebytes.com/blog/bugs/2026/11/update-chrome-now-to-fix-a-flaw-attackers-are-exploiting
  - https://lists.x.org/archives/xorg-announce/2026-November/003759.html
  - https://www.notion.com/help/security-incident-involving-a-third-party-ai-vendor
  - https://cert.cyber.gouv.fr/uploads/CERTFR-2026-CTI-009.pdf
  - https://www.bitdefender.com/en-us/blog/hotforsecurity/iranian-hackers-supermarket-freezers-france
  - https://stoppels.ch/2026/11/07/the-hardest-tarball.html
  - https://developers.googleblog.com/agent-distraction/
  - https://cloud.google.com/blog/products/identity-security/how-to-run-codemender-in-your-pull-requests/
  - https://developer.nvidia.com/blog/agent-substrate-advancing-kubernetes-for-agents-at-scale/
  - https://www.cncf.io/blog/2026/11/10/welcoming-openshell-to-the-cncf-open-governance-to-secure-agentic-ai/
  - https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/
  - https://blog.jetbrains.com/rust/2026/11/10/debugging-rust/
-->
