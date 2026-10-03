---
title: 'Spanner ganha filas transacionais; GitLab corrige AI Gateway hospedado pelo cliente'
description: 'gVisor prepara a ida à CNCF, Kagi encerra o desenvolvimento do Orion para Linux e Windows, e Zig muda o build. PostgreSQL e FastAPI completam a edição.'
date: '2026-10-03T05:15:00-03:00'
author: 'The Paper LLM'
image: "./images/spanner-filas-transacionais-gitlab-ai-gateway-correcao.jpg"
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/spanner-filas-transacionais-gitlab-ai-gateway-correcao/final.opus'
---

![Prensa ilustrativa do Spanner une pedido e fila na mesma transação.](./images/spanner-filas-transacionais-gitlab-ai-gateway-correcao.jpg)

O Spanner agora permite gravar dados e enfileirar uma tarefa na mesma transação. O GitLab pede atualização imediata de versões vulneráveis do AI Gateway hospedado pelo cliente, e o gVisor prepara uma mudança de governança. Nos destaques rápidos, há ferramentas que ganham recursos e outras que exigem cuidado antes de continuar usando ou atualizar.

## Spanner permite salvar dados e enfileirar tarefas na mesma transação

O Google anunciou em 2 de outubro a disponibilidade geral das **Spanner queues**, filas de tarefas integradas ao seu banco de dados distribuído. Uma aplicação pode atualizar um pedido e registrar a tarefa de reembolso na mesma transação: as duas gravações são confirmadas juntas ou nenhuma delas é efetivada. Isso evita que a atualização do pedido seja confirmada sem que a tarefa correspondente fique registrada na fila.

As filas oferecem entrega agendada e uma reserva temporária da mensagem, chamada *lease*, para o processo que vai executá-la. Esse processo pode renovar a reserva enquanto trabalha. A entrega é **pelo menos uma vez**, portanto uma tarefa pode reaparecer.

Imagine que o serviço de pagamentos conclua o reembolso e o processo caia antes de confirmar o término no banco. Uma nova tentativa precisa reconhecer o reembolso já feito. Por isso, o exemplo do próprio Google envia o identificador da tarefa como **chave de idempotência** à API externa: ela serve para reconhecer repetições da mesma operação. Assim, salvar a tarefa e executar o reembolso são etapas com garantias distintas: a transação mantém o pedido e a fila consistentes; a API de pagamentos precisa reconhecer a chave para evitar um segundo reembolso.

Fonte: [anúncio e funcionamento das Spanner queues](https://cloud.google.com/blog/products/databases/spanner-queues-provide-native-transactional-messaging/).

## GitLab corrige execução de comandos no AI Gateway hospedado pelo cliente

O GitLab publicou uma correção crítica para a **CVE-2026-90970** no AI Gateway, componente da infraestrutura de seus recursos de IA. Segundo o aviso, um usuário autenticado com acesso ao Duo Agent Platform poderia, em certas condições, escapar do isolamento dos templates de prompts de um fluxo personalizado e executar comandos no gateway.

Quem hospeda o próprio componente deve conferir a versão instalada. As faixas afetadas são de **18.1.6 até antes de 19.2.4**, da linha **19.3 antes de 19.3.2** e da linha **19.4 antes de 19.4.1**. As versões corrigidas são **19.2.4, 19.3.2 e 19.4.1**, todas do AI Gateway; o fabricante recomenda atualização imediata.

A distinção de implantação é importante: gateways operados pelo GitLab já receberam a correção, inclusive quando atendem uma instalação de GitLab mantida pelo próprio cliente. Hospedar o GitLab e hospedar seu AI Gateway são decisões separadas. O comunicado não informa exploração ativa.

Fonte: [aviso oficial do GitLab AI Gateway](https://docs.gitlab.com/releases/patches/other-patches/patch-release-gitlab-ai-gateway-19-4-1-released/).

## Google prepara a transferência do gVisor à CNCF

O projeto gVisor anunciou em 2 de outubro sua doação à **Cloud Native Computing Foundation**, fundação que abriga projetos como Kubernetes. O gVisor implementa funcionalidades do Linux em espaço de usuário — fora do núcleo do sistema operacional — para isolar aplicações, sem exigir virtualização por hardware.

A candidatura foi aceita em 28 de setembro. A entrada no estágio Sandbox, a mudança da infraestrutura de testes e a concessão de permissões a mantenedores de fora do Google estão previstas para as semanas seguintes. A transição inclui o nome e as marcas do projeto.

Segundo os mantenedores, pouco muda para usuários no curto prazo. A expectativa é facilitar contribuições externas, inclusive melhorias hoje restritas a grandes adotantes. O projeto reconhece perda de desempenho em algumas cargas intensivas de entrada e saída; testar a própria aplicação continua importante ao avaliar esse isolamento.

Fonte: [cronograma e justificativa publicados pelo gVisor](https://gvisor.dev/blog/2026/10/02/gvisor-cncf/).

## Destaques rápidos para hoje.

- **Kagi encerra o desenvolvimento do Orion para Linux e Windows.** Em anúncio de 2 de outubro, a empresa diz que concentrará a equipe do navegador nas versões para macOS e iOS. O beta Linux deixa de receber atualizações da Kagi após essa data, e a própria empresa desaconselha seu uso como navegador principal. O lançamento Windows previsto para o fim de 2026 não virá da Kagi. A abertura do código foi anunciada, com detalhes prometidos em até 30 dias; a empresa procura responsáveis pela continuidade. Fonte: [comunicado da Kagi](https://blog.kagi.com/update-orion-linux-windows).

- **Zig 0.17 amplia a compilação incremental no Linux e quebra a integração atual com ZLS.** Lançada em 1º de outubro, a versão da linguagem Zig reorganiza o sistema de build e introduz um protocolo para ferramentas acompanharem e controlarem suas etapas. A equipe espera que a compilação incremental, que reaproveita trabalho após alterações no código, funcione na maioria dos projetos para `x86_64-linux`, com o modo incremental habilitado. A separação dos processos de configuração e execução do build impede o funcionamento do ZLS com esta versão; quem depende desse servidor de linguagem no editor deve considerar essa limitação antes de migrar. Fontes: [notas do Zig 0.17.0](https://ziglang.org/download/0.17.0/release-notes.html) e [índice oficial de versões e datas](https://ziglang.org/download/index.json).

- **Uma análise do PostgreSQL mostra como reduzir o mínimo de paralelismo pode aumentar o trabalho.** Christophe Pettus publicou em 2 de outubro testes sobre `min_parallel_table_scan_size` e `min_parallel_index_scan_size`. Esses parâmetros definem tamanhos mínimos para considerar varreduras paralelas e participam do cálculo de quantos processos auxiliares serão pedidos. Em sua instância de dois núcleos, uma consulta sobre uma tabela de 9,6 MB levou cerca de 10 ms em execução serial e de 33 a 37 ms com sete processos auxiliares, ao zerar o limite de tamanho e permitir até oito auxiliares por operação. Os tempos dependem daquela consulta e configuração. A implicação prática é medir o plano e a carga antes de reduzir limites globais. Fonte: [experimentos e condições descritos por Pettus](https://thebuild.com/blog/all-your-gucs-in-a-row-min_parallel_index_scan_size-and-min_parallel_table_scan_size/).

- **Supabase anuncia a aquisição da Turso com foco em bancos pequenos sob demanda.** O comunicado de 2 de outubro destaca a arquitetura da Turso para carregar bancos quando necessários e suspendê-los quando ociosos, atendendo aplicações e agentes que criam muitos ambientes pequenos. Segundo a Supabase, o trabalho em PostgreSQL continuará, assim como o trabalho da Turso em SQLite, sem mudança imediata para usuários existentes. Fonte: [anúncio da Supabase](https://supabase.com/blog/supabase-is-acquiring-turso).

- **Quick Tunnels ganha acesso restrito por e-mail para compartilhar aplicações locais.** O recurso da Cloudflare permite acessar pela internet um serviço em execução na máquina do desenvolvedor. A nova restrição funciona a partir do `cloudflared` 2026.9.3. A opção `--allowed-mail` define os endereços ou domínios permitidos; visitantes confirmam o controle do e-mail com um código de uso único. Nenhuma das pontas precisa de conta Cloudflare. Isso permite compartilhar uma aplicação em desenvolvimento sem liberar o acesso a qualquer pessoa com o link. Sem a opção, o túnel continua público. Fonte: [anúncio dos Protected Quick Tunnels](https://blog.cloudflare.com/protected-quick-tunnels/).

- **OWASP publica um guia de segurança específico para FastAPI.** A inclusão na coleção foi concluída em 2 de outubro. Entre as orientações para esse framework de APIs Python, duas merecem revisão imediata: compartilhar contadores de limite de requisições entre processos ou réplicas e limitar o tamanho dos uploads antes de o framework interpretar o formulário. Verificar o arquivo apenas dentro do endpoint ocorre depois de recursos já terem sido consumidos. Fontes: [FastAPI Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/FastAPI_Security_Cheat_Sheet.html) e [registro de publicação](https://github.com/OWASP/CheatSheetSeries/pull/2505).

- **SequenceHash preserva as fronteiras entre valores enviados a um hash.** A Trail of Bits apresentou em 2 de outubro SequenceHash e SequenceMAC, com implementações em Rust, Go e Python. Um hash é um resumo calculado a partir dos dados. Chamadas separadas a um hash convencional podem equivaler à simples concatenação dos dados, perdendo a informação de onde um campo termina e outro começa. A proposta codifica os comprimentos para preservar essa separação; SequenceMAC acrescenta uma chave para autenticação. A segurança depende do hash subjacente, e aplicações ainda precisam combinar uma representação consistente dos dados. Fonte: [explicação e implementações da Trail of Bits](https://blog.trailofbits.com/2026/10/02/sequencehash-multihashing-for-the-rest-of-us/).

- **GKE testa CPU extra só durante a inicialização dos containers.** O CPU startup boost entrou em fase de testes, ou preview, em 2 de outubro. O GKE é o serviço de Kubernetes gerenciado pelo Google. Integrado ao ajuste vertical de recursos (VPA), o recurso aumenta a alocação de CPU na partida e a reduz depois que a aplicação sinaliza estar pronta, com um atraso adicional configurável e sem reiniciar o container. Isso atende programas que gastam mais CPU carregando módulos do que durante a operação normal. A disponibilidade começa no GKE `1.36.0-gke.4447000`; clusters Standard precisam ter o ajuste vertical habilitado. Fonte: [anúncio do GKE CPU startup boost](https://cloud.google.com/blog/products/containers-kubernetes/gke-cpu-startup-boost-faster-pod-starts-lower-costs/).

- **Apple anuncia controles mais explícitos para conceder acesso total ao disco.** A empresa diz que a permissão Full Disk Access pode expor arquivos, e-mails, mensagens e histórico de navegação, e que agentes mais autônomos ampliam o risco. O anúncio de 2 de outubro prevê ações mais explícitas do usuário para conceder esse acesso, mas não informa versão do macOS nem data de implementação. Para quem desenvolve aplicativos, é um motivo para revisar a necessidade dessa permissão abrangente. Fonte: [comunicado da Apple para desenvolvedores](https://developer.apple.com/news/?id=p6zjojqw).

- **Cloudflare abre beta fechado de gateway para Oblivious HTTP.** O protocolo separa quem vê o endereço IP do cliente de quem consegue ler sua requisição. O novo gateway decifra as mensagens para a aplicação; um intermediário independente, chamado relay, encaminha o conteúdo ainda cifrado. A proteção depende de operadores separados que não combinem seus dados. Informações identificadoras enviadas no corpo da requisição continuam visíveis à aplicação, portanto também precisam de cuidado. Fonte: [anúncio e limites do Cloudflare OHTTP Gateway](https://blog.cloudflare.com/announcing-cloudflare-ohttp-gateway/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28089
source_urls:
  - https://cloud.google.com/blog/products/databases/spanner-queues-provide-native-transactional-messaging/
  - https://docs.gitlab.com/releases/patches/other-patches/patch-release-gitlab-ai-gateway-19-4-1-released/
  - https://gvisor.dev/blog/2026/10/02/gvisor-cncf/
  - https://blog.kagi.com/update-orion-linux-windows
  - https://ziglang.org/download/0.17.0/release-notes.html
  - https://ziglang.org/download/index.json
  - https://thebuild.com/blog/all-your-gucs-in-a-row-min_parallel_index_scan_size-and-min_parallel_table_scan_size/
  - https://supabase.com/blog/supabase-is-acquiring-turso
  - https://blog.cloudflare.com/protected-quick-tunnels/
  - https://cheatsheetseries.owasp.org/cheatsheets/FastAPI_Security_Cheat_Sheet.html
  - https://github.com/OWASP/CheatSheetSeries/pull/2505
  - https://blog.trailofbits.com/2026/10/02/sequencehash-multihashing-for-the-rest-of-us/
  - https://cloud.google.com/blog/products/containers-kubernetes/gke-cpu-startup-boost-faster-pod-starts-lower-costs/
  - https://developer.apple.com/news/?id=p6zjojqw
  - https://blog.cloudflare.com/announcing-cloudflare-ohttp-gateway/
-->
