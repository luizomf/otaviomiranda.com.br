---
title: 'Tensorlake 0.5.144 distribui malware pelo npm; Haiku 5.5 reduz preços'
description: 'O ataque exige cuidado antes de revogar tokens. A edição também explica as faixas de preço do Haiku, a ordem das mensagens no Kafka e novidades de segurança, Node.js e contêineres.'
date: '2026-10-08T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/tensorlake-npm-comprometido-haiku-5-5-precos.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/tensorlake-npm-comprometido-haiku-5-5-precos/final.opus'
---

![Placa iluminada alerta para o pacote Tensorlake 0.5.144 comprometido, com a identificação do npm em tamanho menor.](./images/tensorlake-npm-comprometido-haiku-5-5-precos.jpg)

Uma versão comprometida do pacote Tensorlake colocou credenciais de desenvolvedores em risco e incluiu um mecanismo que pode apagar arquivos após a revogação de um token. Nesta quinta-feira, a edição também explica a redução de preços do Haiku 5.5 e como uma equipe preservou a ordem das mensagens no Kafka ao processar várias conversas em paralelo.

## Tensorlake 0.5.144 distribui malware pelo próprio fluxo de publicação

A StepSecurity e a SafeDep identificaram código malicioso no pacote **`tensorlake` 0.5.144**, publicado no npm, registro de pacotes do ecossistema JavaScript. A publicação ocorreu em 8 de outubro, às 01h12 UTC — 22h12 de quarta-feira em Brasília. Segundo as análises, um script de instalação executa um programa que rouba credenciais de GitHub, npm e provedores de nuvem, além de tentar se espalhar por outros pacotes e repositórios. O instalador pula a execução quando detecta determinados ambientes de integração contínua; as estações de desenvolvimento são o alvo destacado pelos pesquisadores.

Os mantenedores confirmaram que o código entrou diretamente na branch principal por uma conta administradora e foi distribuído pelo próprio fluxo de lançamento. A atestação de procedência que acompanhava a publicação documentava a origem da compilação, cujo código já estava comprometido. O projeto integrou a reversão e informou que o npm removeu `tensorlake` 0.5.144. Na mesma resposta, ainda apontava seis pacotes nativos da família `tensorlake-native-*`, também na versão 0.5.144, pendentes de retirada.

**A ordem da resposta importa.** Os pesquisadores descrevem um serviço chamado `gh-token-monitor`, capaz de apagar o diretório pessoal quando o token GitHub roubado deixa de funcionar. A SafeDep localizou sua ativação no caminho em que a checagem de organizações da conta resulta em uma lista vazia. Para uma máquina possivelmente afetada, a orientação é preservar os dados e remover esse monitor antes de revogar o token; em seguida, trocar as demais credenciais acessíveis.

Confira os arquivos que registram as dependências instaladas e bloqueie a versão 0.5.144. A investigação também precisa alcançar configurações de Claude Code e VS Code, nas quais o malware tenta deixar mecanismos de execução. A troca da dependência, sozinha, deixa esses possíveis pontos de persistência sem tratamento. Se a limpeza não puder ser assegurada, a StepSecurity recomenda reinstalar o ambiente.

Fontes: [StepSecurity — análise e resposta](https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm), [SafeDep — comportamento e condições do monitor](https://safedep.io/tensorlake-npm-compromise-mini-shai-hulud) e [reversão integrada pelos mantenedores](https://github.com/tensorlakeai/tensorlake/pull/1016).

## Haiku 5.5 reduz preços; prompts acima de 100 mil tokens entram em outra faixa

A Anthropic lançou o **Claude Haiku 5.5** em 7 de outubro para tarefas curtas e frequentes, como classificação, resumos e trabalho de subagentes — agentes encarregados de partes de uma tarefa maior. A AWS também anunciou sua disponibilidade no Amazon Bedrock naquela data.

Na tabela da Anthropic, requisições com prompts de até **100 mil tokens** custam **US$ 0,10 por milhão de tokens de entrada** e **US$ 0,50 por milhão de saída**. Acima desse tamanho de prompt, as tarifas passam a **US$ 0,50 e US$ 2,50**, respectivamente: ambas ficam cinco vezes maiores. Para comparação, a mesma tabela lista o Haiku 4.5 a US$ 1 por milhão de tokens de entrada e US$ 5 por milhão de saída.

Tokens são as unidades em que o modelo divide o conteúdo. Enviar muitos arquivos de um repositório pode colocar uma tarefa na faixa mais cara. A empresa também informa que o novo tokenizador usa um pouco mais de tokens por tarefa que o do Haiku 4.5. Por isso, a redução da tarifa não se traduz automaticamente na mesma redução da conta: vale medir gasto total, tempo de resposta e acertos com exemplos reais da aplicação.

O modelo oferece ajuste de esforço de raciocínio. A própria Anthropic mantém Sonnet 5.5 e Opus 5.5 como escolhas melhores para programação complexa com agentes, reservando ao Haiku o foco em tarefas mais delimitadas.

Fontes: [Anthropic — preços, escopo e condições](https://www.anthropic.com/claude-haiku-5-5) e [anúncio de disponibilidade na AWS](https://aws.amazon.com/blogs/machine-learning/introducing-claude-haiku-5-5-on-aws/).

## Pipeline em Go preserva a ordem por sessão no Kafka, inclusive durante novas tentativas

Em um relato publicado em 7 de outubro, Joshua Oluikpe apresentou o desenho de um pipeline de mensagens para uma plataforma de IA conversacional. O Kafka, sistema de armazenamento e transmissão de eventos, mantém a ordem dentro de cada partição, uma subdivisão desse fluxo. Ao distribuir o processamento entre várias tarefas concorrentes, a aplicação precisa preservar a sequência que importa para cada conversa.

A implementação encaminha mensagens da mesma sessão para uma **goroutine**, tarefa leve de execução do Go, que processa uma mensagem por vez. Se houver uma falha temporária, ela repete aquela mensagem antes de avançar. Outras sessões continuam em paralelo. Isso impede, por exemplo, que uma segunda instrução rápida ultrapasse a primeira enquanto ela aguarda uma nova tentativa.

A confirmação de progresso também precisa respeitar as lacunas: o consumidor só avança o ponto de retomada até uma sequência contínua de mensagens concluídas. Após uma queda, mensagens posteriores podem ser repetidas. Os serviços que recebem esse trabalho precisam de **idempotência**, isto é, evitar repetir o efeito de uma operação já aplicada.

Há uma escolha operacional importante no relato: o sistema pode avançar sobre trabalho permanentemente travado para liberar a partição, sacrificando a entrega daquele evento. Essa situação precisa ser tratada como falha e acompanhada, inclusive na fila de mensagens problemáticas. A estratégia de recuperação, portanto, também define quando a aplicação aceita deixar trabalho para trás para continuar funcionando.

Fonte: [Joshua Oluikpe — arquitetura, recuperação e limites dos testes](https://www.infoq.com/articles/apache-kafka-golang-session-ordered-pipeline/).

## Destaques rápidos para hoje.

- **LMCache tem alerta de execução remota no modo multiprocesso exposto à rede.** A ferramenta mantém cache para a execução de modelos de IA. A JFrog publicou em 7 de outubro a CVE-2026-105192: dados recebidos sem autenticação chegam ao desserializador `pickle`, que pode executar código ao reconstruir objetos Python. O risco remoto exige acesso à porta de comunicação; o endereço padrão é local, e o uso dentro do processo do servidor de modelos vLLM não abre essa porta. O aviso de 7 de outubro ainda não identificava versão corrigida. Restrinja o acesso e evite expor o transporte a redes não confiáveis. Fontes: [aviso da JFrog](https://research.jfrog.com/vulnerabilities/lmcache-is-vulnerable-to-unauthenticated-remote-code-execution-via-pickle-deserialization-on-the-multiprocess-zmq-transport-cve-2026-105192-jfsa-2026-001694382/) e [desserializador na versão 0.5.5](https://github.com/LMCache/LMCache/blob/v0.5.5/lmcache/v1/platform/base/ipc_wrapper.py).

- **SANS observa tentativas de explorar a CVE-2026-21589 em produtos Atlassian.** A [falha já coberta aqui](/2026/atlassian-corrige-acesso-arquivos-css-reconstroi-tokens/) permite acessar, sem autenticação, arquivos específicos dentro do diretório da aplicação web, inclusive dados sensíveis ali armazenados. Ela afeta versões de produtos administrados pelo próprio cliente, como Jira Software Data Center, Jira Service Management Data Center, Confluence Data Center e Bitbucket Data Center. No relato de 7 de outubro, o Internet Storm Center informa tentativas recebidas desde 6 de outubro em seu honeypot, um sistema usado para observar ataques. Isso comprova tentativas naquele sensor, sem demonstrar comprometimento de instalações de clientes. Quem administra versões afetadas deve aplicar as correções e investigar sinais de comprometimento conforme o aviso da Atlassian. Os produtos Atlassian Cloud afetados já foram corrigidos e dispensam ação dos clientes, segundo a empresa. Fontes: [observação do SANS ISC](https://isc.sans.edu/diary/rss/33406) e [aviso da Atlassian](https://confluence.atlassian.com/security/cve-2026-21589-arbitrary-file-access-vulnerability-impacts-multiple-products-1870495748.html).

- **AWS demonstra remediação de incidentes com aprovação humana e retomada do fluxo.** O guia de 7 de outubro combina EventBridge, Bedrock e Lambda Durable Functions — serviços para encaminhar eventos, acessar modelos de IA e executar funções com estado salvo. O modelo escolhe ferramentas de uma lista permitida; consultas rodam automaticamente, enquanto alterações na infraestrutura suspendem o fluxo até aprovação humana. O estado salvo permite retomar a execução depois da espera. A AWS orienta revisar os parâmetros completos da chamada antes de aprová-la, pois tanto a investigação quanto a solução proposta são geradas por IA. Fonte: [arquitetura de referência da AWS](https://aws.amazon.com/blogs/machine-learning/automate-remediation-post-aws-devops-agent-investigation/).

- **Node.js 26.11 adiciona controles de processo e recebe um patch no mesmo dia.** A versão 26.11.0 do ambiente de execução JavaScript, de 7 de outubro, acrescentou `--process-timeout=N`, tornou estáveis `process.ref()` e `process.unref()` e adicionou snapshots e diferenças de histogramas para observabilidade. A 26.11.1 saiu ainda no dia 7, revertendo três mudanças ligadas à construção da documentação. São lançamentos da linha **Current**; quem testa as novidades já deve considerar o patch posterior. Fontes: [26.11.0](https://nodejs.org/en/blog/release/v26.11.0) e [26.11.1](https://nodejs.org/en/blog/release/v26.11.1).

- **Podman prepara semana de testes do monitor de contêineres reescrito em Rust.** De 12 a 18 de outubro, as equipes de Podman e qualidade do Fedora pedem testes do conmon v3. Esse processo acompanha o contêiner, coleta logs e registra seu estado de saída mesmo depois que o comando Podman termina. A chamada, publicada no dia 7, destaca terminais interativos, reinícios e execução sem privilégios de administrador. A recomendação é usar uma máquina de testes ou VM sem dados importantes. Fonte: [Fedora Magazine](https://fedoramagazine.org/podman-test-week-help-test-the-rust-based-conmon-v3/).

- **Google relata certificados indevidos após ataques a registros de domínios nacionais.** No comunicado de 6 de outubro, a empresa diz que invasores alteraram DNS em registros dos sufixos `.gh`, `.sl` e `.as`, obtendo certificados para domínios de várias organizações. O Chrome bloqueou certificados identificados. Para responsáveis por domínios, a orientação é monitorar os registros públicos de Certificate Transparency e configurar regras restritivas de emissão, chamadas CAA. Essas regras ajudam após a recuperação do DNS; durante um sequestro ativo, o invasor pode controlar os próprios registros. Fonte: [equipe de segurança do Chrome](https://blog.google/security/chromes-response-to-recent-cctld-registry-hijacks/).

- **Chrome anuncia JPEG XL a partir da versão 155, com decodificador em Rust.** O anúncio de 6 de outubro apresenta o `jxl-rs`, usado para ler imagens desse formato. A equipe destaca aplicações com alta fidelidade, compressão sem perda e carregamento progressivo, no qual a imagem ganha detalhes durante a transferência. Para escolher o formato de uma aplicação, o Google recomenda testar JPEG XL e AVIF. Fonte: [Chrome for Developers](https://developer.chrome.com/blog/jpeg-xl-in-chrome).

- **MIT comunica a morte de Margaret Hamilton aos 90 anos.** A nota publicada em 7 de outubro informa que ela morreu em 30 de setembro. Hamilton liderou a equipe de software de voo do programa Apollo no MIT e ajudou a estabelecer a engenharia de software como disciplina. O obituário destaca seu trabalho em prevenção de erros e em sistemas que priorizavam tarefas essenciais, contribuições que continuam relevantes para quem constrói software confiável. Fonte: [MIT News](https://news.mit.edu/2026/margaret-hamilton-computing-pioneer-dies-1007).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28294
source_urls:
  - https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm
  - https://safedep.io/tensorlake-npm-compromise-mini-shai-hulud
  - https://github.com/tensorlakeai/tensorlake/pull/1016
  - https://www.anthropic.com/claude-haiku-5-5
  - https://aws.amazon.com/blogs/machine-learning/introducing-claude-haiku-5-5-on-aws/
  - https://www.infoq.com/articles/apache-kafka-golang-session-ordered-pipeline/
  - https://research.jfrog.com/vulnerabilities/lmcache-is-vulnerable-to-unauthenticated-remote-code-execution-via-pickle-deserialization-on-the-multiprocess-zmq-transport-cve-2026-105192-jfsa-2026-001694382/
  - https://github.com/LMCache/LMCache/blob/v0.5.5/lmcache/v1/platform/base/ipc_wrapper.py
  - https://isc.sans.edu/diary/rss/33406
  - https://confluence.atlassian.com/security/cve-2026-21589-arbitrary-file-access-vulnerability-impacts-multiple-products-1870495748.html
  - https://aws.amazon.com/blogs/machine-learning/automate-remediation-post-aws-devops-agent-investigation/
  - https://nodejs.org/en/blog/release/v26.11.0
  - https://nodejs.org/en/blog/release/v26.11.1
  - https://fedoramagazine.org/podman-test-week-help-test-the-rust-based-conmon-v3/
  - https://blog.google/security/chromes-response-to-recent-cctld-registry-hijacks/
  - https://developer.chrome.com/blog/jpeg-xl-in-chrome
  - https://news.mit.edu/2026/margaret-hamilton-computing-pioneer-dies-1007
-->
