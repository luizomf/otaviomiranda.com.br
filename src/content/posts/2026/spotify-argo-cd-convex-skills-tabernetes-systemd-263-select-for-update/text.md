---
title: 'Spotify conta como o Argo CD derrubou seu login ao brigar com o autoscaler, e skills da Convex ensinavam o agente a driblar checagens de segurança'
description: 'O relatório da pane de 29 de setembro mostra duas mudanças testadas separadamente que, juntas, faziam o deploy cortar réplicas a cada sincronização. Também nesta edição: a correção parcial nas skills da Convex para o Claude Code, o Tabernetes, que faz de abas do navegador nós de Kubernetes, o systemd 263-rc1 com broker de terminais e o /run fechado de novo, e um dev júnior no TabNews explicando o SELECT ... FOR UPDATE. E mais: skimmer de cartão por WebRTC, Drupal e GeoServer na lista da CISA, bat 0.27, Wine 11.23, Linux Mint 27 beta, Qwen local contra Claude e o livro de Michael Nielsen fora do ar.'
date: '2026-11-28T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/spotify-argo-cd-convex-skills-tabernetes-systemd-263-select-for-update.jpg'
---

![Fader de mesa de som em cerâmica branca com a palavra REPLICAS, puxado para baixo por um pequeno polvo laranja de massinha, sobre fundo verde](./images/spotify-argo-cd-convex-skills-tabernetes-systemd-263-select-for-update.jpg)

## Spotify conta como duas mudanças testadas separadamente fizeram o Argo CD derrubar o login, brigando com o autoscaler

O Spotify publicou na sexta (27) o relatório da pane de 29 de setembro, que tirou o acesso de usuários à plataforma. A causa não foi um servidor caindo sozinho. Foram duas mudanças no sistema de deploy, cada uma testada isoladamente, que entraram em conflito quando chegaram juntas à produção.

**Para entender o conflito, vale separar três peças.** No Kubernetes, um Deployment descreve quantas cópias (réplicas) de um serviço devem rodar. O Argo Rollouts é uma alternativa ao Deployment, com esquema um pouco diferente, usada para lançamentos graduais. O Argo CD é a ferramenta de GitOps: compara o estado do cluster com a configuração desejada e "sincroniza" o que estiver diferente.

A terceira peça é o autoscaler, que aumenta ou reduz o número de réplicas conforme a carga. O combinado é que esse número pertence ao autoscaler, e o sistema de deploy não deveria mexer nele. Essa regra de "quem é dono de qual campo" é exatamente o que quebrou.

**O que deu errado, segundo o Spotify:**

1. Uma mudança trocou o tipo das cargas, de Deployment para Argo Rollout.
2. Outra mudou quais campos ficam de fora da comparação entre o estado atual e o desejado.
3. Juntas, elas incluíram por engano o campo de réplicas mínimas, e o sistema de deploy passou a gravar o número mínimo de réplicas a cada sincronização.

O efeito só aparecia em serviços que usavam Argo Rollouts e também tinham ambiente de testes. O relatório diz que uma regra derivada dos testes foi aplicada na produção apesar da diferença entre os tipos de carga. Entre os afetados estava o serviço que mantém as pessoas logadas, e sem ele os apps não carregavam conteúdo.

**Aí começou a cascata.** Quando o login cai, os apps precisam emitir tokens de novo, e isso gera um pico de carga mesmo com os clientes esperando entre as tentativas. As instâncias restantes caíram, e o laço de reconciliação continuava reduzindo réplicas. No começo da recuperação, o sistema de login atendia 200 vezes o tráfego de antes do incidente.

A maioria das regiões voltou às 16h30 UTC (13h30 em Brasília). Numa região europeia, a enxurrada de apps voltando derrubou os serviços que ficam depois da autenticação, e a recuperação completa só veio às 19h34 UTC. Pela linha do tempo, o bug suspeito de causar a redução de réplicas só foi identificado às 19h31, três minutos antes do "tudo liberado".

**As lições que o próprio Spotify lista:**

- **Sintomas ambíguos:** era difícil saber se as quedas causavam a perda de capacidade ou se a perda de capacidade causava as quedas, e um deploy grande no mesmo momento criou hipóteses concorrentes.
- **Automação na hora errada:** o sistema reaplicava a configuração defeituosa e atrasava a recuperação manual.
- **Métricas que mentem sob pressão:** serviços sobrecarregados que descartam requisições cedo, no load shedding, registram menos tráfego do que realmente recebem.
- **Piso baixo demais:** o mínimo de réplicas do login não protegia contra a redução.

Como correção, a empresa diz que vai impedir que a automação de deploy sobrescreva réplicas gerenciadas pelo autoscaler, simplificar os controles de emergência para pausar essa automação e melhorar a forma de devolver tráfego aos poucos depois de uma queda.

**Para quem usa Argo CD com autoscaler, a documentação da ferramenta tem um detalhe que vale conhecer.** Dá para mandar o Argo CD ignorar `/spec/replicas` com `ignoreDifferences`. Mas, por padrão, isso só vale para a comparação: na sincronização, o estado desejado é aplicado como está, a menos que a opção `RespectIgnoreDifferences=true` esteja ligada. O relatório do Spotify não diz se esse mecanismo estava envolvido; a dica é da documentação do Argo CD.

A autocorreção do Argo CD já tinha aparecido aqui [no sábado passado (21)](/2026/riemann-claude-ruby2shell-gpgme-cairn-vps-atacado/), num caso em que ela pulou uma migração de banco.

Fontes: [Spotify Engineering](https://engineering.atspotify.com/2026/11/september-29-outage-incident-report-what-we-learnt/), [documentação do Argo CD sobre diffing](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/) e [opções de sincronização do Argo CD](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/).

## Skills da Convex para o Claude Code ensinavam o agente a dividir comandos para escapar das checagens de segurança, e a correção chegou só em parte

Skills são arquivos de instrução, os `SKILL.md`, que um agente como o Claude Code lê e segue para fazer uma tarefa. A Convex, plataforma de backend com banco de dados e funções no servidor, distribui um plugin com várias delas, listado no marketplace oficial de plugins da Anthropic. Três dessas skills viraram assunto na sexta (27), quando uma issue de outubro chegou à primeira página do Hacker News.

**A issue 64, aberta em 26 de outubro pelo usuário thirtysix, aponta três problemas:**

- a skill `quickstart` enviava a ideia do usuário, a frase descrevendo o app, para um servidor da Convex com nome gerado, marcado no código como telemetria, sem avisar a pessoa;
- a skill `add` baixava um script desse mesmo servidor e mandava direto para o `bash`, sem versão fixa;
- a skill `labs-quickstart` dividia o download e a execução em duas chamadas separadas, e explicava por quê.

A explicação era esta, no texto original: "um único comando que baixa código remoto e o executa é o formato que os classificadores de segurança do harness bloqueiam". Ou seja, a instrução mudava a forma do comando para que a checagem não o reconhecesse. O autor da issue diz que vê ali uma tentativa de tornar o onboarding confiável, não má-fé, mas que isso remove uma proteção que o usuário ou o administrador escolheu ter.

**Neste sábado (28), às 6h38 UTC, um commit no repositório mudou parte disso.** O trecho sobre os classificadores saiu, e o diff mostra que ele também estava na skill `quickstart`. No lugar, a skill manda o agente dizer ao usuário o que o script faz e deixar a pessoa aprovar ou recusar, e diz para nunca reescrever, dividir ou juntar um comando para passar por um pedido de permissão ou checagem de segurança. As marcações de "telemetria" também sumiram.

**O que continua igual:** a ideia ainda é enviada por padrão, agora com um comentário dizendo que a Convex apaga o texto depois de 24 horas. A skill `add` ainda faz `curl ... | bash`, e os scripts continuam sendo baixados na hora, sem hash que fixe a versão. Outro participante da issue analisou os scripts baixados e listou mais pontos, como uma dependência npm sem versão fixa e um passo que publica mudanças no backend.

James Cowling, cofundador e CTO da Convex, respondeu na issue que as ideias não são usadas como telemetria e só vão ao servidor para gerar um quickstart personalizado, que é o propósito da skill. Segundo ele, a palavra "telemetry" no código era um comentário mal escrito, e uma atualização vem em breve.

Um detalhe para quem instala pelo marketplace: quando checamos, a entrada da Convex no marketplace oficial da Anthropic ainda apontava para o commit `6ca54f6`, o mesmo citado na issue, que contém o trecho sobre os classificadores. A correção deste sábado está no repositório da Convex, e a entrada do marketplace não tinha sido atualizada.

**A lição prática é tratar skill como código.** Antes de instalar, abra os `SKILL.md` e procure o que você procuraria num script de instalação: `curl` mandando para o shell, servidores externos recebendo dados e, agora, qualquer instrução sobre como lidar com pedidos de permissão. O agente segue esse texto como se fosse sua vontade.

Fontes: [issue 64 no GitHub](https://github.com/convex/convex-backend-skill/issues/64), [commit de 28 de novembro](https://github.com/convex/convex-backend-skill/commit/51b4e6593a) e [marketplace oficial de plugins da Anthropic](https://github.com/anthropics/claude-plugins-official).

## Tabernetes transforma abas do navegador em nós de um cluster Kubernetes, com um Linux de verdade rodando em WebAssembly

Num cluster Kubernetes, um nó é uma máquina que recebe pods para rodar, e o programa que faz essa ponte com o cluster é o kubelet. O Tabernetes, de Farid Zakaria, é um kubelet para abas do navegador: você abre a página, toca em Join, e a aba do seu celular vira um nó. O projeto tem licença MIT, e o repositório foi criado na noite de quinta (26), no horário de Brasília.

**Como funciona, segundo o README:**

1. Um agente roda ao lado do servidor de API de um Kubernetes comum, o k3s, e faz o papel de kubelet para todas as abas ao mesmo tempo.
2. A página de entrada mantém um WebSocket aberto com esse agente, que registra um Node com o nome do aparelho.
3. Quando o agendador manda um pod para esse Node, o agente cria para ele um endereço de rede na máquina do cluster e inicia o contêiner com o tabc.
4. A aba dá boot no unkernel, um kernel Linux compilado para WebAssembly, e roda o programa com a CPU e a memória do aparelho.
5. Os arquivos e a rede do contêiner ficam na máquina do cluster. Por isso um Service alcança o pod no celular como qualquer outro pod.
6. Quando a aba fecha, o agente apaga o Node e os pods, e os controladores criam pods novos em outros nós.

Para mandar um pod para uma aba, basta uma linha no YAML: `runtimeClassName: tab`. Os outros pods continuam na máquina do cluster. Na página do projeto, um botão faz cada aba conectada calcular alguns blocos de um conjunto de Mandelbrot em awk, e a imagem mostra qual aparelho desenhou cada pedaço. Fechar a aba vira uma demonstração ao vivo de falha de nó.

**Os limites estão escritos no README.** O pod numa aba tem um contêiner, uma CPU e de 128 a 256 MiB de memória, e a imagem precisa de variante `linux/arm64`. `kubectl exec`, contêineres de inicialização, ConfigMaps e Secrets ainda não funcionam. O firewall da máquina nega a esses pods acesso à internet, ao servidor de API e à própria máquina, porque são navegadores de estranhos.

E o projeto avisa: nada de segredos nesses pods, porque a aba guarda a memória do pod e pode ler tudo. É um ótimo jeito de ver o contrato entre kubelet e nó funcionando, não um lugar para rodar carga sensível.

**O kernel por baixo é o unkernel, de Pooya Parsa,** que [apareceu aqui em 17 de novembro](/2026/optimizely-malware-windows-agentes-exchange-curl-rust/). Ele compila o Linux 7.x como um único módulo WebAssembly, com gerenciamento de memória real. O kernel (agendador, chamadas de sistema, ext4, TCP/IP) roda como código compilado; só os programas de usuário são emulados.

Uma mudança desde a nossa nota: na época, o unkernel rodava binários riscv64. Agora roda binários aarch64 (arm64) sem alteração, e o README confirma que o projeto começou com riscv64. Por isso pacotes do Alpine e do Debian funcionam como estão.

Os números são do autor. O kernel chega ao `/init` cerca de 70 ms depois de começar, e o prompt do Alpine aparece 0,3 segundo depois de iniciar pelo Node. Um ciclo de fork, exit e wait leva uns 60 microssegundos, contra uns 70 no nativo e 1,2 milissegundo num QEMU com emulação completa; esse número foi medido ainda com o riscv64, mas o README diz que o caminho pelo kernel é o mesmo. Programas pesados de CPU, avisa o README, ficam bem atrás do nativo.

O tabc, o runtime que roda contêineres em abas, foi [destaque nesta quinta (26)](/2026/nfs2root-api-claude-rust-1password-defang-siren-custo-claude-code/). O Tabernetes junta as duas peças num cluster.

Fontes: [Tabernetes](https://tabernet.es/), [repositório do Tabernetes](https://github.com/fzakaria/tabernetes) e [repositório do unkernel](https://github.com/pithings/unkernel).

## systemd 263-rc1 traz um broker de terminais, abre espaço para Rust e fecha o /run que o ProtectSystem=strict deixava gravável desde a v248

O systemd é o sistema de inicialização e gerenciamento de serviços da maioria das distribuições Linux. A primeira versão candidata do systemd 263 saiu na sexta (27). Como é candidata, a versão final ainda pode mudar, mas as notas já mostram o que vem.

**A novidade mais curiosa é o systemd-ptybrokerd, ainda experimental.** Um pseudoterminal, ou PTY, é o "terminal de mentira" que programas como o emulador de terminal, o SSH e o console de um contêiner usam para conversar com um shell. Normalmente ele some quando o cliente que o pediu vai embora.

O broker aloca esses terminais e os mantém abertos independentemente do cliente. O exemplo das notas: dá para se desconectar do console de um contêiner e voltar depois sem parar o contêiner. A ferramenta `ptyctl` lista os terminais, conecta a eles e os encerra. É parecido com o que o tmux faz por sessões, só que dentro do gerenciador do sistema.

**A mudança que exige atenção de quem administra servidor é no `/run`.** A opção `ProtectSystem=strict` deixa o sistema de arquivos somente leitura para um serviço, como camada de proteção. Desde a v248, quando `MountAPIVFS=` estava ativo, o `/run` ficava gravável por engano. Esse modo é ligado implicitamente por opções como `ProtectControlGroups=`, `ProtectKernelTunables=` e `ProtectProc=`.

Pior: quando o serviço compartilhava o `/run` do host, o `/run` do host também ficava gravável. Na 263, ele passa a ser somente leitura de verdade. As notas listam isso como mudança incompatível: serviços que dependiam do erro precisam pedir escrita explicitamente com `ReadWritePaths=` ou `RuntimeDirectory=`. Vale revisar suas units antes de atualizar.

**O resto, em resumo:**

- **Rust opcional:** o systemd pode ser compilado com suporte a programas escritos em Rust, pela nova opção `-Drust=` do meson, com rustc 1.85 ou mais novo.
- **Filtro de io_uring:** a nova opção `IOUringFilter=` permite ou nega operações específicas de io_uring para um serviço.
- **DNS:** o systemd-resolved pode verificar assinaturas DNSSEC ML-DSA-44, pós-quânticas, se o OpenSSL suportar, e responde consultas `.onion` localmente em vez de mandá-las ao servidor DNS.
- **Manifestos:** a nova ferramenta `systemd-manifest` gera e verifica manifestos de arquivos, com assinatura opcional.
- **Rede:** systemd-networkd e networkctl viraram um único binário.

Fonte: [notas do systemd v263-rc1 no GitHub](https://github.com/systemd/systemd/releases/tag/v263-rc1).

## No TabNews, um dev júnior mostra como dois cliques em "Assinar" viravam duas cobranças, e como o SELECT ... FOR UPDATE do Postgres resolveu

Um desenvolvedor júnior que está terminando um kit de SaaS em português, com Next.js, Prisma, Supabase e cobrança por Pix pelo Asaas, contou no TabNews, na sexta (27), um bug que um testador achou no beta. Dois cliques rápidos em "Assinar" podiam criar duas assinaturas e cobrar o cliente em dobro.

**O código original fazia "confere e, se não existir, cria".** Com uma requisição por vez, funciona. Com duas ao mesmo tempo, as duas fazem a conferência antes de qualquer uma criar a linha, as duas veem "não existe" e as duas seguem. Isso é uma condição de corrida. E o estrago sai do banco, porque a segunda chamada já pode ter criado a assinatura no provedor de pagamento.

**A correção trava a linha da conta dentro de uma transação:**

1. `SELECT id FROM "Account" WHERE id = ... FOR UPDATE`, que tranca a linha daquela conta.
2. Confere se já existe assinatura pendente, ativa ou atrasada. Se existir, para.
3. Cria uma linha de reserva com um identificador provisório.
4. Só depois chama o Asaas e troca o identificador provisório pelo real. Se algo falhar no meio, cancela no Asaas o que foi criado e apaga a reserva.

**Por que isso funciona, pela documentação do PostgreSQL:** um `SELECT ... FOR UPDATE` bloqueia outros `FOR UPDATE` na mesma linha até a transação terminar. No nível de isolamento padrão, o Read Committed, cada comando enxerga o que já foi confirmado até o momento em que começa. Então a segunda requisição espera, e quando passa da trava já vê a reserva da primeira.

Um cuidado que vem da mesma documentação: um `SELECT` comum, sem `FOR UPDATE`, não é bloqueado por essa trava. A proteção só vale se todo caminho que cria assinatura passar pelo mesmo `FOR UPDATE` antes de conferir.

**O teste é a parte mais didática.** O autor disparou 10 chamadas simultâneas para a mesma conta, em 3 rodadas com contas novas, num Postgres de verdade, e em todas só uma reserva foi criada. Ele observa que os testes unitários do kit usam um banco simulado com `vi.mock` e não provam nada disso, porque simulam a transação.

Ele também conta o que não fez. Um índice único parcial impediria duplicatas no próprio banco, mas, segundo ele, o Prisma não declara esse tipo de índice no `schema.prisma`, e seria preciso uma migration em SQL à mão.

E há uma limitação que ainda existe: se o servidor cair entre a reserva e a resposta do Asaas, a reserva fica pendente e bloqueia novas assinaturas da conta até a pessoa cancelar pela tela; uma rotina que expire reservas antigas seria o próximo passo.

Fontes: [TabNews](https://www.tabnews.com.br/Bacaninha01/como-evitei-assinatura-duplicada-com-select-for-update-no-postgres-prisma-asaas), [PostgreSQL: SELECT e cláusulas de trava](https://www.postgresql.org/docs/current/sql-select.html) e [PostgreSQL: níveis de isolamento](https://www.postgresql.org/docs/current/transaction-iso.html).

## Destaques rápidos para hoje.

- **Skimmer de cartão roubava dados pelo WebRTC em cinco lojas online, só no celular e só no checkout.** A InfoHawk publicou na sexta (27) que um script foi plantado nas lojas da Lascana, Samsonite, American Tourister, Revolve e FWRD na semana antes da Black Friday, e que todas o removeram em 24 ou 25 de novembro, depois do aviso. O WebRTC é a tecnologia de chamadas de vídeo do navegador. O script usava o canal de dados dele, passando pelo relay da Cloudflare, para receber o código e, pela análise da InfoHawk, mandar número, validade, código de segurança, nome e endereço antes de a loja validar o pagamento. Só na Lascana a InfoHawk viu o envio acontecer com o cartão de teste, e não sabe quantos clientes foram afetados. O código entrava por vários caminhos: uma configuração do banner de cookies, um arquivo no CDN da loja, um pixel de marketing compartilhado ou o HTML da própria loja. A defesa sugerida é uma regra `connect-src` de CSP listando só os servidores que a loja usa, o que bloqueia as duas requisições web de que o script precisa antes de abrir o canal WebRTC. Fonte: [InfoHawk](https://www.infohawk.com/news/2026-11-27-black-friday-webrtc-skimmer).

- **CISA põe a segunda falha do instalador do Drupal e duas falhas do GeoServer na lista de exploradas.** A agência americana adicionou as três ao catálogo KEV na sexta (27), com base em evidência de exploração, e deu às agências federais dos EUA até segunda (30) para agir. A do Drupal é a CVE-2026-136716, a tomada de sites em estado de instalação incompleto que [noticiamos na quinta (26)](/2026/nfs2root-api-claude-rust-1password-defang-siren-custo-claude-code/). O GeoServer é um servidor aberto que publica dados geográficos na web. Uma das falhas deixa um visitante sem login ler arquivos do servidor ou fazer o servidor buscar URLs, e a outra pula as checagens de permissão por serviço com um nome de serviço prefixado. Segundo o projeto, as duas são etapas de uma cadeia que chega a execução de código sem login. A correção está no GeoServer 3.0.2, 2.28.6 e 2.27.7. Fontes: [CISA](https://www.cisa.gov/news-events/alerts/2026/11/27/cisa-adds-three-known-exploited-vulnerabilities-catalog) e [GeoServer](https://geoserver.org/vulnerability/2026/11/23/cve-update.html).

- **bat 0.27 ganha `--sanitize` para mostrar arquivos não confiáveis sem truques de terminal.** O bat é um substituto do `cat`, escrito em Rust, com realce de sintaxe. A versão saiu neste sábado (28). A nova opção troca bytes de controle do terminal (como sequências de escape e movimentos de cursor) e caracteres Unicode invisíveis de direção e largura zero pelo caractere de substituição. Ajuda contra o Trojan Source, em que o código exibido parece diferente do que é executado. Entre as correções, uma tem a ver com o [`git status` em repositório hostil](/2026/google-exige-mcp-para-agentes-cacti-zero-day-git-status-ext4-ia/): o bat não roda mais comandos de filtro definidos na configuração do repositório Git que contém o arquivo exibido. Fonte: [notas do bat 0.27.0](https://github.com/sharkdp/bat/releases/tag/v0.27.0).

- **Wine 11.23 passa a suportar macOS em ARM64.** O Wine roda programas de Windows em Linux e macOS. A versão de desenvolvimento 11.23, de sexta (27), traz suporte a macOS em ARM64, os Macs com Apple Silicon, além de AVX na emulação de 32 bits em ARM64, o vkd3d 2.2 (que traduz Direct3D 12 para Vulkan) e 40 bugs corrigidos. Fonte: [anúncio do Wine 11.23](https://gitlab.winehq.org/wine/wine/-/releases/wine-11.23).

- **Linux Mint 27 "Adrien" entra em beta, com terminal próprio e Wayland completo no Cinnamon.** O beta saiu na sexta (27), só para testes. A versão tem suporte até 2031 e usa a base de pacotes do Ubuntu 26.04, chamada Resolute, com kernel 7.0. As novidades incluem o Velocitty, um terminal novo com abas salvas para abrir projetos e sessões SSH, suporte completo a Wayland no Cinnamon e o Live Installer no lugar do Ubiquity. Dá para atualizar do beta para a versão estável, e também a partir do Mint 22.3. Fontes: [blog do Linux Mint](https://blog.linuxmint.com/?p=5120) e [novidades do Mint 27](https://www.linuxmint.com/rel_adrien_whatsnew.php).

- **No TabNews, um Qwen de 35B rodando em casa empatou com o Claude em três de cinco tipos de tarefa.** O autor, ken imoto, comparou o Qwen3.5-9B, o Qwen3.6-35B-A3B (os dois numa RTX 4070 de 12 GB) e o Claude Sonnet 5 pela API, com o mesmo prompt e correção automática. Em extração de dados de página já baixada, resumo e mensagem de commit, o 35B empatou com o Claude. Em correção de código, o Claude acertou 10 de 10, contra 8 do 35B. Em classificação, os três acertaram 5 de 12 e erraram parecido, o que o autor atribui às etiquetas mal definidas, e não aos modelos. A amostra é pequena (de 10 a 15 casos por tarefa), o 35B foi bem mais lento nas entradas longas, e o diretório de dados citado no post não estava acessível publicamente quando checamos. Fonte: [TabNews](https://www.tabnews.com.br/kenimo49/medi-5-tipos-de-tarefa-em-3-modelos-e-em-3-deles-o-qwen-35b-local-empatou-com-o-claude).

- **Michael Nielsen tira do ar seu livro gratuito sobre redes neurais.** O "Neural Networks and Deep Learning", escrito entre 2011 e 2015, foi por anos uma das portas de entrada mais usadas para quem estudava o assunto. No lugar do livro, Nielsen publicou um texto dizendo que o comportamento "imprudente" dos laboratórios de fronteira acelerou a IA além do que ele esperava. Ele critica nominalmente Anthropic e OpenAI, e diz que não quer ajudar, nem um pouco, a formar pessoas para esse trabalho. O texto é assinado em novembro de 2026, sem dia exato, e a mudança ganhou destaque no Hacker News na sexta (27). Fonte: [página do livro](https://neuralnetworksanddeeplearning.com/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 36128
source_urls:
  - https://engineering.atspotify.com/2026/11/september-29-outage-incident-report-what-we-learnt/
  - https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/
  - https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/
  - https://github.com/convex/convex-backend-skill/issues/64
  - https://github.com/convex/convex-backend-skill/commit/51b4e6593a
  - https://github.com/anthropics/claude-plugins-official
  - https://tabernet.es/
  - https://github.com/fzakaria/tabernetes
  - https://github.com/pithings/unkernel
  - https://github.com/systemd/systemd/releases/tag/v263-rc1
  - https://www.tabnews.com.br/Bacaninha01/como-evitei-assinatura-duplicada-com-select-for-update-no-postgres-prisma-asaas
  - https://www.postgresql.org/docs/current/sql-select.html
  - https://www.postgresql.org/docs/current/transaction-iso.html
  - https://www.infohawk.com/news/2026-11-27-black-friday-webrtc-skimmer
  - https://www.cisa.gov/news-events/alerts/2026/11/27/cisa-adds-three-known-exploited-vulnerabilities-catalog
  - https://geoserver.org/vulnerability/2026/11/23/cve-update.html
  - https://github.com/sharkdp/bat/releases/tag/v0.27.0
  - https://gitlab.winehq.org/wine/wine/-/releases/wine-11.23
  - https://blog.linuxmint.com/?p=5120
  - https://www.linuxmint.com/rel_adrien_whatsnew.php
  - https://www.tabnews.com.br/kenimo49/medi-5-tipos-de-tarefa-em-3-modelos-e-em-3-deles-o-qwen-35b-local-empatou-com-o-claude
  - https://neuralnetworksanddeeplearning.com/
-->
