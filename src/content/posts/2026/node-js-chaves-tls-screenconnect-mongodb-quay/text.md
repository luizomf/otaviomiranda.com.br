---
title: 'Node.js corrige falha que vaza chaves TLS, e ataque pelo ScreenConnect planta acesso clandestino em 48 organizações'
description: 'O Node.js fecha 16 vulnerabilidades, sete de gravidade alta, e cinco delas foram relatadas com ajuda do Claude; um ataque usa painéis do ScreenConnect para instalar acesso remoto clandestino; MongoDB e Red Hat Quay têm falhas críticas exploráveis sem login. Também: N-central volta ao ar, Nginx Proxy Manager, Steam 64 bits no Linux, uma pegadinha do Nginx, relatórios de bug feitos por IA e a morte de Tim Peters.'
date: '2026-11-12T07:34:00-03:00'
author: 'The Paper LLM'
image: './images/node-js-chaves-tls-screenconnect-mongodb-quay.jpg'
---

![Pote de vidro verde em forma de hexágono, como o logo do Node.js, com a palavra node gravada, uma rachadura na lateral e chaves douradas escapando pela fenda.](./images/node-js-chaves-tls-screenconnect-mongodb-quay.jpg)

Esta é a segunda edição do dia. A primeira, desta manhã, tratou da campanha wfx no GitHub Actions e da falha crítica no HTTP/2 do Apache. Agora vêm as notícias que chegaram depois ou ainda não tinham sido tratadas. Quase todas são correções de segurança em peças que costumam ficar expostas à rede: o servidor HTTPS do Node.js, o painel de acesso remoto de prestadores de TI, o cluster MongoDB e o registro de imagens de contêiner. Nos destaques rápidos estão o retorno do N-central, o cliente do Steam em 64 bits no Linux, uma armadilha antiga do Nginx, a queixa de um consultor de PostgreSQL contra relatórios de bug gerados por IA, uma companhia aérea barrando agentes de IA e a morte de Tim Peters, uma das figuras centrais do Python.

## Node.js corrige 16 falhas, e uma delas deixa servidores HTTPS vazarem chaves privadas

Nesta quarta (11), o Node.js lançou as versões 22.23.5, 24.22.3 e 26.13.1, uma para cada linha com suporte. Juntas, elas corrigem 16 vulnerabilidades: sete de gravidade alta, seis média e três baixa. A maioria fica nos módulos que atendem conexões de rede (`http2`, `tls`, `http` e `https`), então quem roda servidor em Node.js deve tratar a atualização como prioridade.

A mais séria é a CVE-2026-123864, que afeta as três linhas. Um servidor HTTPS em Node.js lê a requisição em partes e entrega o corpo à aplicação enquanto ainda decifra o resto. Em certa sequência de chamadas, o servidor faz uma gravação de zero bytes nesse meio-tempo; a camada TLS então decifra o próximo pedaço de dados antes da hora e volta a chamar o leitor de HTTP, que ainda estava no meio do trabalho. O resultado é uso de memória já liberada (*use-after-free*) e leitura fora dos limites. Segundo o Node.js, o servidor acaba copiando memória que pertence a outras conexões, inclusive chaves privadas TLS e requisições de outros usuários, para dentro do corpo da requisição. Há condições: o handler precisa chamar `res.flushHeaders()` antes de o corpo terminar e depois `res.end()` com conteúdo, e para ler o que vazou o atacante precisa de alguma rota que devolva ou guarde o corpo recebido. O `node:http` sem TLS não é afetado.

Entre as outras falhas graves:

- **CVE-2026-123863 (linhas 24 e 26):** qualquer cliente, sem login, derruba um servidor HTTP/2 configurado no padrão, com ou sem TLS. Basta que o handler responda antes de a requisição terminar de chegar, o que o próprio Node.js chama de típico. É uma variante da CVE-2024-27983, que a correção antiga não cobria.
- **CVE-2026-126051 (linhas 24 e 26):** uma exceção não tratada no *handshake*, a negociação inicial do TLS, permite derrubar remotamente o processo do servidor. Vale para servidores TLS que usam ganchos como `SNICallback`, `OCSPRequest`, `newSession` ou `resumeSession`, ou que chamam `server.addContext()`.
- **CVE-2026-123874 (linhas 24 e 26):** uso de memória liberada no HTTP/2 quando um fluxo servido com `respondWithFile()` ou `respondWithFD()` é cancelado durante a gravação. Um cliente sem login pode corromper a memória do servidor.
- **CVE-2026-123866 (todas as linhas):** ao encerrar um fluxo HTTP/2, o servidor pode mandar ao cliente memória já liberada, incluindo pedaços de respostas de outras conexões.
- **CVE-2026-123872 (todas as linhas):** na renegociação do TLS 1.2, um cliente pode trocar o nome do servidor pedido e chegar a hosts com regras mais rígidas de certificado de cliente do que as que valem para ele.

Cinco das falhas têm o mesmo crédito no aviso: "Chris Rohlf in collaboration with Claude and Anthropic Research", ou seja, o pesquisador Chris Rohlf em colaboração com o Claude, o modelo de IA da Anthropic, e com a equipe de pesquisa da empresa. São as três graves CVE-2026-123863, 123864 e 123874, mais a CVE-2026-123875, de gravidade média, que derruba servidores HTTP/2 quando o cliente cancela downloads de arquivo, e a CVE-2026-123862, de gravidade baixa, no `zlib`. O aviso também lembra que versões fora do período de suporte são sempre afetadas quando sai uma rodada de segurança, então quem ainda está numa linha antiga não tem correção para instalar. HTTP/2 já tinha aparecido hoje na falha do `mod_http2` do Apache, tratada [na edição da manhã](/2026/wfx-github-actions-apache-http2-gsocket-aws-emulator/), mas são bugs diferentes, em softwares diferentes.

Fontes: [aviso de segurança do Node.js](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases), [notas do Node.js 26.13.1](https://nodejs.org/en/blog/release/v26.13.1).

## Ataque usa painéis do ScreenConnect para instalar um segundo acesso remoto em 288 máquinas

O ScreenConnect, da ConnectWise, é uma ferramenta de acesso remoto muito usada por MSPs, empresas que cuidam da TI de outras empresas. O técnico entra num painel, geralmente hospedado na nuvem, e dali controla os computadores dos clientes. Um dos recursos é o comando *Run*, que executa um comando na máquina gerenciada com privilégio de SYSTEM, o nível mais alto do Windows. Quem domina o painel, portanto, domina todas as máquinas ligadas a ele.

Segundo a Huntress, empresa de segurança que monitora endpoints, invasores usaram exatamente esse caminho nesta quarta (11). Por volta das 17h47 UTC (14h47 em Brasília), a empresa viu comandos *Run* chegando a máquinas de vários painéis ScreenConnect na nuvem ao mesmo tempo. Ao todo, ao menos 288 máquinas em 48 organizações monitoradas pela Huntress foram atingidas em cerca de 90 minutos, um terço delas nos primeiros 10. Os comandos instalavam um segundo cliente ScreenConnect, controlado pelo invasor, e um kit de 16 arquivos que a Huntress chamou de SCKit. O kit cria exclusões no Microsoft Defender, agenda uma tarefa chamada `TrapWatch` e instala uma "armadilha de retransmissão" que toma o lugar do cliente legítimo na conexão.

A ConnectWise publicou um aviso às 22h45 UTC do mesmo dia e o atualizou às 02h45 UTC desta quinta (12). A empresa diz não ter evidência de invasão da própria infraestrutura nem de vulnerabilidade no ScreenConnect. Sua avaliação inicial, ainda em validação, aponta para abuso de extensões de terceiros instaladas nos ambientes dos parceiros. Por precaução, ela desativou cinco delas: Labtech Plus, RMM Plus, RMM+, RMM Plus Password Link e RMM+ Password Link. Cerca de 400 ambientes de parceiros têm pelo menos uma extensão dessa família, e a ConnectWise ressalta que ter a extensão instalada não significa ter sido invadido.

Numa atualização das 23h34 (horário da costa leste dos EUA) de quarta, a Huntress disse que a atividade parece ligada ao RMM+. Nas versões 1.0.31 e 1.0.32, se o administrador nunca tivesse configurado a chave de acesso da extensão, ela aceitava uma chave em branco. E o RMM+ passa por cima das contas, dos papéis e da autenticação em dois fatores do próprio ScreenConnect. O caminho de entrada ainda não está confirmado.

O kit foi feito para se espalhar em duas etapas. Na primeira, a infecção passa da máquina do cliente para o técnico que se conecta a ela. Na segunda, o kit tenta roubar o cookie de sessão do ScreenConnect na estação do técnico para alcançar todas as máquinas do painel. Esse mecanismo foi reconstruído pela Huntress a partir do código do kit, e a empresa diz não ter visto nenhuma das duas etapas funcionar até agora: nem o salto da máquina infectada para a estação do técnico, nem dali para outras máquinas. A tentativa de tomar o console falhou em todos os registros recuperados. As 288 máquinas foram atingidas pelos comandos *Run* enviados dos painéis, não pela autopropagação do kit.

Para quem usa ScreenConnect, as recomendações das duas empresas incluem:

- conferir se as cinco extensões estão desativadas e, em servidores próprios, desativá-las já, sem reinstalar até nova orientação;
- revisar o histórico de *Run Command* e *Toolbox* atrás de execuções em massa que ninguém da equipe disparou, e procurar um segundo cliente ScreenConnect nas máquinas;
- não investigar máquinas suspeitas pelo próprio ScreenConnect, e sim por EDR, WinRM ou outra ferramenta separada, porque a conexão é justamente o caminho de contágio;
- remover o cliente falso, a tarefa `TrapWatch` e a pasta `C:\ProgramData\RelayTrap\`, já que isolar a máquina não apaga a persistência;
- encerrar sessões ativas, trocar credenciais e revogar sessões do navegador e do provedor de identidade.

Entre os indicadores divulgados estão os domínios sc[.]payproofkit[.]com, cdn007-digitaldownloads[.]com e ns[.]mo7sen[.]dev, escritos aqui com colchetes de propósito, para não virarem links. Encontrar qualquer um deles em logs de DNS ou de proxy é sinal para investigar.

Fontes: [Huntress](https://www.huntress.com/blog/sckit-worm-rogue-screenconnect), [avisos da ConnectWise](https://www.connectwise.com/company/trust/advisories).

## MongoDB corrige falha crítica em que dois pings sem login derrubam o novo primário

Um *replica set* do MongoDB é um grupo de servidores que guardam cópias dos mesmos dados. Um deles, o primário, recebe as gravações; os outros copiam. Se o primário cai, os demais fazem uma eleição. O eleito, se estiver atrasado, primeiro aplica as gravações que perdeu, numa etapa chamada *catch-up*, e só então passa a aceitar escritas novas.

A CVE-2026-118383, divulgada pela MongoDB nesta terça (10), fica na limpeza feita ao fim dessa etapa. A Datadog Security Labs publicou na quarta (11) uma análise com o defeito reproduzido em laboratório. Um atacante manda a um membro do grupo dois comandos `ping` com o campo `readConcern.afterOpTime`, que pede ao servidor para esperar a replicação chegar a certo ponto. O servidor guarda dois "avisos pendentes", que ficam ali até ele reiniciar, fazer *rollback* ou deixar de ser primário. Se esse membro depois vencer uma eleição estando atrasado, a limpeza roda duas vezes sobre a mesma memória, e o processo cai. Esses `ping` são aceitos antes do login, então ativar autenticação não impede o ataque.

O atacante não controla a parte difícil: não tem como atrasar o membro nem provocar a eleição, que dependem de manutenção ou de uma pane. A nota CVSS 4.0 é 9,5, e o vetor da nota marca a complexidade do ataque como alta. A MongoDB diz que o defeito pode derrubar o servidor ou, "em certas condições", permitir execução de código. A Datadog conseguiu só a queda, não a execução de código. A MongoDB diz que achou a falha internamente e não sabe de tentativas de exploração.

As versões corrigidas são 9.0.7, 8.3.16, 8.0.37, 7.0.48, 6.0.30, 5.0.35 e 4.4.32. Todas as anteriores de cada ramo são afetadas, incluindo os membros de shard e de servidor de configuração em clusters fragmentados. Um `mongod` isolado, fora de qualquer replica set, não é afetado. No Atlas, o serviço gerenciado da MongoDB, a correção entra na manutenção automática, e quem adia manutenção deve aplicá-la logo. Em instalação própria, é preciso atualizar todos os membros e conferir a versão de cada um, inclusive os que rodam em contêiner ou estavam desligados. Até lá, a Datadog recomenda restringir o acesso de rede ao banco e procurar nos logs comandos sem autenticação com `afterOpTime`.

Fontes: [aviso da MongoDB](https://www.mongodb.com/community/forums/t/important-mongodb-security-update-available-action-required-november-10-2026/344843), [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/cve-2026-118383-mongodb-server-use-after-free/), [registro da CVE](https://www.cve.org/CVERecord?id=CVE-2026-118383).

## Falha crítica no Red Hat Quay deixa um estranho assinar o acesso a qualquer imagem privada

O Red Hat Quay é um registro de imagens de contêiner: o lugar de onde o Kubernetes e os pipelines baixam as imagens que vão rodar. Para autorizar cada download ou envio, ele emite tokens assinados com chaves em que ele mesmo confia. A CVE-2026-123710, publicada nesta quarta (11) com nota 9,8, permite que alguém de fora instale a própria chave nessa lista de confiança.

Pela descrição do relatório no Bugzilla da Red Hat, o ataque encadeia três detalhes. O Quay entrega um token anônimo a quem pede quando o acesso anônimo está ligado, o que, segundo a Red Hat, é o padrão, e deixa o próprio cliente escolher o "público" do token. O serviço de chaves só confere se o token foi assinado por uma chave aprovada e se o público e o emissor batem, sem olhar o que o token autoriza. Com isso, o atacante chama a rotação de chaves no endpoint `/keys` e registra uma chave dele, sem data de validade, que passa a valer na hora. A rotação ainda apaga a chave legítima da instância.

A partir daí, o atacante gera tokens para qualquer repositório. Pode baixar imagens privadas, com os segredos que estiverem embutidos nelas, e sobrescrever tags, de modo que outros sistemas passem a baixar uma imagem trocada. A Red Hat avisa que desligar o acesso anônimo não protege, porque qualquer conta válida no Quay serve, e que trocar senhas ou regenerar tokens de robô não revoga uma chave intrusa. Segundo o relatório, a lógica com defeito está no código desde o primeiro commit público.

A correção foi incorporada ao repositório do Quay na quarta (11), mas nem o aviso nem o relatório citam uma versão corrigida. Enquanto ela não sai, a Red Hat recomenda deixar o endpoint `/keys` acessível, no proxy ou no balanceador de carga, apenas para componentes internos confiáveis. Também vale procurar nos logs de auditoria eventos `service_key_rotate` e `service_key_delete` com data de validade vazia e remover chaves aprovadas que ninguém reconheça. A Red Hat avisa que essa remoção não é definitiva até a versão corrigida entrar, porque o atacante pode instalar a chave de novo.

Fontes: [Red Hat](https://access.redhat.com/security/cve/cve-2026-123710), [Bugzilla da Red Hat](https://bugzilla.redhat.com/show_bug.cgi?id=2568072), [correção no GitHub](https://github.com/quay/quay/pull/8057), [SecurityWeek](https://www.securityweek.com/critical-red-hat-quay-vulnerability-could-expose-private-container-images/).

## Destaques rápidos para hoje.

- **N-central volta ao ar com o hotfix 2026.4 HF2.** A N-able, que [tirou o serviço do ar na segunda (9)](/2026/n-central-fora-do-ar-git-corrige-falhas-qubole-aws/) depois que um pesquisador publicou mais de 30 falhas com código de exploração, diz em post desta quarta (11) que o HF2 corrige todas as falhas exploráveis sem login. A ferramenta de gestão remota usada por MSPs voltou a funcionar na versão hospedada. As falhas restantes exigem conta autenticada, muitas vezes com privilégios altos, e ficam para um próximo hotfix. A empresa diz ver varreduras ligadas ao código publicado e nenhum sinal de invasão nos servidores hospedados. Quem tem instalação própria deve aplicar o HF2 e manter o servidor fora da internet até concluir a atualização, além de atualizar agentes e probes. Fontes: [N-able](https://www.n-able.com/blog/update-on-n-central-2026-4-hf2-and-ongoing-security-response), [SecurityWeek](https://www.securityweek.com/hackers-target-n-central-zero-days-as-n-able-rushes-patches/).

- **Nginx Proxy Manager 2.17 fecha brechas de autenticação.** A interface web para configurar proxy reverso e certificados no Nginx sem editar arquivos de configuração ganhou a versão 2.17.0 nesta quinta (12). As notas de versão citam a correção de um "oráculo de autenticação", a remoção da chave privada dos certificados nas respostas da API, autenticação obrigatória para validar certificados, limite de tentativas nos endpoints de login e permissões mais restritas para usuários sobre os proxies cadastrados. Ainda atualiza dependências do backend, o que resolve 15 de 16 alertas, entre eles um de negação de serviço no body-parser. Alguns plugins de DNS mudaram de forma incompatível, e o projeto sugere recriar certificados desses provedores. Fonte: [notas da versão 2.17.0](https://github.com/NginxProxyManager/nginx-proxy-manager/releases/tag/v2.17.0).

- **Steam para Linux vira aplicativo de 64 bits e passa a rodar em contêiner.** Na atualização do cliente desta quarta (11), o Steam passa a ser um programa de 64 bits no Linux e roda dentro do Steam Runtime, o mesmo ambiente isolado usado pelos jogos. Segundo a Valve, isso deve deixar a experiência mais parecida entre distribuições diferentes. No streaming, a versão passa a capturar HDR via PipeWire no Linux e volta a ativar o HDR no Steam Deck OLED. Fonte: [notas do cliente Steam](https://store.steampowered.com/news/app/593110/view/678515036155543747).

- **Um `add_header` no lugar errado apaga os cabeçalhos de segurança do Nginx.** O guia de cabeçalhos HTTP da OWASP ganhou nesta quinta (12) um aviso sobre um comportamento documentado do Nginx: as diretivas `add_header` só são herdadas do nível de cima se o nível atual não tiver nenhuma. Na prática, um único `add_header Cache-Control "no-cache";` dentro de um `location` faz sumir, naquele caminho, todos os cabeçalhos de segurança definidos no `server`. As saídas são repetir os cabeçalhos em cada bloco, centralizá-los num arquivo incluído com `include` ou, a partir do Nginx 1.29.3, usar `add_header_inherit merge;`. Fontes: [alteração na OWASP](https://github.com/OWASP/CheatSheetSeries/pull/2952), [documentação do Nginx](https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header_inherit).

- **Consultor de PostgreSQL pede o fim dos relatórios de bug feitos por IA sem revisão.** Christophe Pettus conta, em post desta quarta (11), que a lista pgsql-bugs vem recebendo levas de 10 a 15 relatórios gerados por IA, vindos de um mesmo remetente. Numa amostra, ele achou comportamento esperado descrito como bug, duplicatas, ao menos três problemas já corrigidos na versão 19 e ao menos um patch que pioraria o problema. Ele estima que a triagem levou cerca de 90 minutos, dez vezes o tempo humano gasto para enviar tudo. O pedido não é abandonar a IA: dá para usá-la para achar bugs, mas quem envia precisa conferir, explicar e defender cada relatório. Fonte: [The Build](https://thebuild.com/blog/stop-using-ai-to-report-postgresql-bugs/).

- **United Airlines vai barrar agentes de IA que compram passagens pelo cliente.** Em reportagem desta quarta (11), a CBS News diz que a companhia aérea americana vai mudar as regras de reserva e emissão de bilhetes para impedir assistentes de IA de terceiros de usar suas plataformas, seja diretamente, seja por agências e agregadores. A United alega que entregar login e dados de pagamento a esses assistentes expõe informações sensíveis e pode gerar compras ou mudanças não pretendidas. Um analista ouvido pela CBS acrescenta outro motivo: a empresa não quer mais um intermediário entre ela e o passageiro. Fonte: [CBS News](https://www.cbsnews.com/news/united-airlines-bans-ai-agents-booking-flights/).

- **Guido van Rossum anuncia a morte de Tim Peters, autor do Zen do Python e do Timsort.** O criador do Python contou nesta quarta (11), no fórum da linguagem, que Peters morreu em 15 de julho deste ano. Peters escreveu o Zen do Python (o texto que aparece quando você digita `import this`), criou em 2002 o Timsort, algoritmo de ordenação das listas do Python depois adotado por Java e Android, e escreveu a primeira versão do `doctest`, segundo Neil Schemenauer. Guido o descreve como mentor e co-designer da linguagem; foi ele quem o convenceu de que o Python devia permitir operações misturando `int` e `float`. Fontes: [Python Discourse](https://discuss.python.org/t/in-memoriam-tim-peters-1952-2026/110028), [LWN](https://lwn.net/Articles/1106901/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 32866
source_urls:
  - https://nodejs.org/en/blog/vulnerability/november-2026-security-releases
  - https://nodejs.org/en/blog/release/v26.13.1
  - https://www.huntress.com/blog/sckit-worm-rogue-screenconnect
  - https://www.connectwise.com/company/trust/advisories
  - https://www.mongodb.com/community/forums/t/important-mongodb-security-update-available-action-required-november-10-2026/344843
  - https://securitylabs.datadoghq.com/articles/cve-2026-118383-mongodb-server-use-after-free/
  - https://www.cve.org/CVERecord?id=CVE-2026-118383
  - https://access.redhat.com/security/cve/cve-2026-123710
  - https://bugzilla.redhat.com/show_bug.cgi?id=2568072
  - https://github.com/quay/quay/pull/8057
  - https://www.securityweek.com/critical-red-hat-quay-vulnerability-could-expose-private-container-images/
  - https://www.n-able.com/blog/update-on-n-central-2026-4-hf2-and-ongoing-security-response
  - https://www.securityweek.com/hackers-target-n-central-zero-days-as-n-able-rushes-patches/
  - https://github.com/NginxProxyManager/nginx-proxy-manager/releases/tag/v2.17.0
  - https://store.steampowered.com/news/app/593110/view/678515036155543747
  - https://github.com/OWASP/CheatSheetSeries/pull/2952
  - https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header_inherit
  - https://thebuild.com/blog/stop-using-ai-to-report-postgresql-bugs/
  - https://www.cbsnews.com/news/united-airlines-bans-ai-agents-booking-flights/
  - https://discuss.python.org/t/in-memoriam-tim-peters-1952-2026/110028
  - https://lwn.net/Articles/1106901/
-->
