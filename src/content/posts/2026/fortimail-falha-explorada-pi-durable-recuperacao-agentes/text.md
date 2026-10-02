---
title: 'FortiMail tem falha explorada; Pi Durable estreia para retomar agentes após interrupções'
description: 'Cloudflare K2 estreia em beta, SvelteKit 3 muda a configuração e Rust 1.99 amplia a integração com C. Python, Ubuntu, Git e integridade de dados completam a edição.'
date: '2026-10-02T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/fortimail-falha-explorada-pi-durable-recuperacao-agentes.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/fortimail-falha-explorada-pi-durable-recuperacao-agentes/final.opus'
---

![Jornal ilustrativo nas mãos de um passageiro destaca a falha explorada no FortiMail.](./images/fortimail-falha-explorada-pi-durable-recuperacao-agentes.jpg)

A edição desta sexta-feira começa com uma vulnerabilidade que exige atenção de quem administra FortiMail. Nas ferramentas de desenvolvimento, os destaques são a recuperação de agentes após interrupções e um novo serviço para guardar eventos até que seus consumidores possam processá-los.

## Falha no FortiMail permite gravar arquivos sem autenticação e tem exploração conhecida

A CISA, agência de cibersegurança dos Estados Unidos, incluiu em 1º de outubro a **CVE-2026-104286**, do FortiMail, em seu catálogo de vulnerabilidades reconhecidamente exploradas. O produto é usado na proteção de e-mail. Segundo o registro, a combinação de falhas no tratamento de caminhos e de caracteres nulos permite que um atacante sem autenticação grave arquivos arbitrários no sistema por meio de requisições HTTP ou HTTPS.

Para quem opera esses equipamentos, a prioridade é identificar os ativos expostos e seguir as orientações de mitigação do fabricante. O registro também aponta exigência de triagem forense: vale investigar sinais de comprometimento, além de reduzir a exposição. A inclusão no catálogo confirma exploração conhecida, mas não informa quantos equipamentos foram atingidos nem identifica os responsáveis.

Fonte: [registro oficial da CISA, identificado pela CVE no catálogo JSON](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json).

## Pi Durable estreia experimental com regras para retomar agentes após uma falha

A Earendil apresentou em 1º de outubro o **Pi Durable**, um framework experimental para construir aplicações com agentes de IA. Ele separa o armazenamento das conversas do ambiente que executa as ferramentas e oferece opções de persistência como SQLite e JSONL, um formato que guarda um registro JSON por linha.

O ponto central é o que acontece quando o processo para inesperadamente. O framework registra pontos de recuperação das tarefas. Uma chamada interrompida ao modelo é enviada novamente; uma ferramenta interrompida só é repetida automaticamente quando declara que isso é seguro. Nos demais casos, o modelo recebe o relato da interrupção.

Isso importa quando a ferramenta produz efeitos fora da conversa. Imagine uma cobrança concluída antes de o agente registrar o resultado: repeti-la pode cobrar duas vezes. O `requestId` evita duplicar a submissão de uma solicitação ao framework; a operação de pagamento ainda precisa de sua própria chave de idempotência, que permite reconhecer uma tentativa repetida. O exemplo de pagamentos do anúncio usa exatamente essa proteção.

Fonte: [anúncio do Pi Durable](https://earendil.com/posts/pi-durable/).

## Cloudflare K2 abre beta público para eventos com consumidores independentes

A Cloudflare lançou em 1º de outubro o **K2**, serviço que mantém um registro durável de eventos sobre o armazenamento de objetos R2. Diferentes consumidores podem ler os mesmos eventos no próprio ritmo. Em uma loja, por exemplo, análise de vendas e detecção de fraude podem acompanhar o mesmo fluxo sem depender uma da velocidade da outra.

A arquitetura junta eventos em memória e grava segmentos completos, porque o armazenamento de objetos não permite simplesmente acrescentar bytes ao final de um arquivo. Segundo a empresa, essa escolha resulta em cerca de um segundo de latência para registrar eventos no percentil 99 — a marca abaixo da qual ficam 99% dos tempos medidos.

A escolha entre produtos depende do trabalho: o K2 privilegia retenção e distribuição de grandes fluxos; o Cloudflare Queues oferece controle por tarefa, com tentativas, atrasos e tratamento de falhas. O beta público do K2 exige uma assinatura Workers Paid e começa com limites de 10 GB armazenados e 30 MB por segundo de produção por fluxo. O uso do K2 não será cobrado durante o beta.

Fonte: [anúncio e arquitetura do Cloudflare K2](https://blog.cloudflare.com/cloudflare-k2-streams/).

## Destaques rápidos para hoje.

- **SvelteKit 3 chega com configuração no Vite e novo alias de imports.** A versão estável do framework de aplicações Svelte foi lançada em 1º de outubro. A configuração passa para `vite.config.ts`, e `$lib` dá lugar a `#lib`, baseado nos imports de subcaminhos do Node.js. O comando de migração automatiza parte das alterações e lista o restante. As funções remotas ainda dependem do Async Svelte experimental. Fonte: [anúncio do SvelteKit 3](https://svelte.dev/blog/sveltekit-3-is-here).

- **Rust 1.99 permite definir funções variádicas compatíveis com C.** Lançada em 1º de outubro, a versão estabiliza a escrita de funções com quantidade variável de argumentos nas convenções `C` e `C-unwind`. Rust já conseguia chamar funções externas desse tipo; agora pode implementá-las. A integração continua exigindo cuidado: quem chama precisa respeitar os tipos e a quantidade de argumentos esperados pela implementação. Fonte: [anúncio do Rust 1.99](https://blog.rust-lang.org/2026/10/01/Rust-1.99.0/).

- **Tachyon permite investigar desempenho no Python 3.15 ainda em pré-lançamento.** O episódio de 1º de outubro do Talk Python apresenta o profiler por amostragem da biblioteca padrão, uma ferramenta para investigar onde o programa gasta tempo. Ele observa periodicamente a pilha de chamadas — as funções em execução naquele instante — e pode se conectar a um processo sem reiniciá-lo. A documentação consultada é da versão 3.15.0rc2: ferramenta e alvo precisam de versões compatíveis e permissão para leitura de memória. Funções muito breves podem escapar das amostras, e o profiler também consome recursos. Fontes: [entrevista com os desenvolvedores](https://talkpython.fm/episodes/show/565/tachyon-python-3.15s-built-in-sampling-profiler) e [documentação do Tachyon](https://docs.python.org/3.15/library/profiling.sampling.html).

- **Firezone descreve proteção contra exclusão de usuários em sincronizações incompletas.** Em publicação de 1º de outubro, a empresa descreve a combinação de reconciliações completas do diretório com notificações do provedor de identidade. Uma fila serializa as escritas; cada notificação provoca uma nova consulta à origem. Uma proteção limita exclusões em massa, porque uma resposta HTTP bem-sucedida pode trazer apenas parte do diretório. É uma lição útil para integrações em que dados desatualizados afetam permissões de acesso. Fonte: [engenharia da Firezone](https://www.firezone.dev/blog/building-reliable-directory-sync).

- **Cisco corrige falha explorada que permite acesso sem login no SD-WAN Manager.** O aviso de 30 de setembro sobre a CVE-2026-76504 informa exploração ativa e acesso à API com privilégios de administrador sem login. A Cisco recomenda atualizar para a versão corrigida correspondente à linha instalada. Restringir o acesso de redes não confiáveis reduz exposição; a empresa afirma que não há solução alternativa que resolva a vulnerabilidade. Fonte: [aviso oficial da Cisco](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-sdwan-webauth-xr8beuuU).

- **Ubuntu 26.10, ainda em desenvolvimento, conclui a troca dos coreutils por Rust.** As notas da versão dizem que `cp`, `mv` e `rm` — usados para copiar, mover e remover arquivos — foram substituídos pelas implementações do projeto uutils. Eram os utilitários GNU que ainda restavam nesse conjunto padrão. Para quem mantém automações, isso justifica testes de compatibilidade antes da atualização. As notas também colocam o Sequoia PGP no repositório principal; torná-lo a ferramenta OpenPGP padrão continua sendo um objetivo. Fonte: [notas do Ubuntu 26.10](https://documentation.ubuntu.com/release-notes/26.10/).

- **A discussão sobre SHA-256 no Git coloca a compatibilidade em primeiro plano.** Scott Chacon, do GitButler, questiona o custo da mudança e propõe separar a verificação criptográfica dos identificadores atuais. O plano oficial fornece o contexto: Git 3.0 ainda não tem data, a mudança de padrão vale para repositórios novos e depende da preparação do ecossistema. Não há plano atual de descontinuar o formato SHA-1. Para equipes, vale mapear bibliotecas e scripts que pressupõem hashes de 40 caracteres. Fontes: [argumento de Chacon](https://blog.gitbutler.com/git-3-sha-256) e [plano oficial do Git](https://git-scm.com/docs/BreakingChanges).

- **Clef oferece respostas tipadas com probabilidades para decisões em aplicações.** A Cloudflare lançou Clef e Clef-flash em 1º de outubro, com pesos disponibilizados sob Apache 2.0 e hospedagem no Workers AI. Em vez de montar uma resposta em texto token a token, a etapa de decisão pontua as opções válidas de um esquema. Isso serve, por exemplo, para encaminhar um chamado à equipe adequada. As probabilidades precisam ser avaliadas com casos reais antes de comandar ações sensíveis. Fonte: [anúncio do Clef](https://blog.cloudflare.com/clef-decision-models/).

- **Workers KV Instant entra em beta privado para configurações pequenas.** Segundo a Cloudflare, o novo modo entrega leituras abaixo de dois milissegundos no percentil 99. O escopo é estreito: até 1 MB por namespace, o agrupamento de chaves e valores, e uma escrita nesse agrupamento por segundo. O preço anunciado do armazenamento é de US$ 100 por MB ao mês. É uma opção voltada a configurações pouco alteradas e muito consultadas; tamanho e frequência de atualização pesam tanto quanto a latência na decisão. Fonte: [anúncio do Workers KV Instant](https://blog.cloudflare.com/workers-kv-instant/).

- **SDKs do Google Cloud Storage passam a calcular checksums de upload por padrão.** O anúncio de 1º de outubro informa que as versões mais recentes das bibliotecas calculam e enviam essa soma de verificação quando a aplicação não a fornece. Assim, o servidor pode comparar o conteúdo recebido com o que saiu do cliente, cobrindo uma etapa anterior ao cálculo feito no próprio serviço. A recomendação do Google é atualizar os SDKs para obter a proteção. Fonte: [engenharia do Google Cloud Storage](https://cloud.google.com/blog/products/storage-data-transfer/enabling-end-to-end-checksums-in-cloud-storage/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28068
source_urls:
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://earendil.com/posts/pi-durable/
  - https://blog.cloudflare.com/cloudflare-k2-streams/
  - https://svelte.dev/blog/sveltekit-3-is-here
  - https://blog.rust-lang.org/2026/10/01/Rust-1.99.0/
  - https://talkpython.fm/episodes/show/565/tachyon-python-3.15s-built-in-sampling-profiler
  - https://docs.python.org/3.15/library/profiling.sampling.html
  - https://www.firezone.dev/blog/building-reliable-directory-sync
  - https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-sdwan-webauth-xr8beuuU
  - https://documentation.ubuntu.com/release-notes/26.10/
  - https://blog.gitbutler.com/git-3-sha-256
  - https://git-scm.com/docs/BreakingChanges
  - https://blog.cloudflare.com/clef-decision-models/
  - https://blog.cloudflare.com/workers-kv-instant/
  - https://cloud.google.com/blog/products/storage-data-transfer/enabling-end-to-end-checksums-in-cloud-storage/
-->
