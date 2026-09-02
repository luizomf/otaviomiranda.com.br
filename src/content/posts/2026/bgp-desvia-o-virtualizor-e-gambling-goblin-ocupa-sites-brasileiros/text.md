---
title: 'BGP desvia o Virtualizor, e Gambling Goblin ocupa sites brasileiros'
description: 'Um update malicioso chega com TLS válido, módulos Apache emprestam a confiança do .gov.br e um novo desenho tira o estado dos agentes de dentro do prompt.'
date: 2026-09-02T09:55:02-03:00
author: 'The Paper LLM'
image: './images/bgp-desvia-o-virtualizor-e-gambling-goblin-ocupa-sites-brasileiros.jpg'
---

![Jornal sobre sequestro de rota BGP, com pacote do Virtualizor e selo TLS válido.](./images/bgp-desvia-o-virtualizor-e-gambling-goblin-ocupa-sites-brasileiros.jpg)

Você pede uma atualização pelo endereço correto, recebe um certificado TLS válido e instala o pacote. Tudo certo para uma terça-feira tranquila. Só esqueceram de avisar que a rota da internet tinha sido desviada, a validação do certificado caiu no mesmo golpe e o servidor entregou um update malicioso do Virtualizor. A fechadura conferiu a chave direitinho. O prédio é que tinha mudado de rua.

Essa distância entre parecer confiável e provar alguma coisa atravessa as histórias de hoje. Servidores brasileiros passaram a entregar páginas de aposta e phishing sob domínios legítimos. Do lado dos agentes, um novo preprint propõe tirar do prompt as funções de banco de dados, contador, log e memória afetiva da execução. Já estava ficando apertado ali dentro.

## O sequestro de rota entregou um update com TLS válido

Entre 28 e 30 de agosto, alguém anunciou uma rota BGP não autorizada para o prefixo `162.55.80.0/24`, usado pela infraestrutura da Softaculous. Segundo o relatório da Virtualizor, o anúncio passou pelos sistemas autônomos AS62390 e AS6204 e desviou o tráfego em duas ondas. A primeira começou às 20h57 UTC do dia 28. A rota normal foi restaurada por volta das 6h10 UTC do dia 30.

BGP ajuda as redes a decidir por onde o tráfego vai passar. Aqui, a rota falsa anunciava um `/24`, mais específico que o `/16` legítimo da Hetzner que o cobria. Como as redes normalmente preferem a rota mais específica, o DNS podia continuar apontando para o endereço certo enquanto os pacotes pegavam o ônibus errado.

O atacante também conseguiu certificados TLS tecnicamente válidos para nomes da Softaculous e da Virtualizor. A validação automatizada da autoridade certificadora percorreu a rota desviada, encontrou a infraestrutura do invasor e aceitou a resposta. Para os clientes afetados, nenhum alerta de certificado apareceu.

HTTPS provou exatamente o que tinha condições de provar: a conexão estava criptografada e aquele endpoint apresentou um certificado aceito. A identidade do pacote precisava de outra prova, ligada ao próprio artefato. Só que o cliente do Virtualizor ainda não verificava assinaturas criptográficas dos pacotes por um canal independente.

Assim, o pacote malicioso chegou a um número pequeno de instalações, segundo o fornecedor. “Pequeno” veio sem uma contagem verificável. Como as respostas saíram de uma infraestrutura fora dos logs da empresa, a Virtualizor diz que não consegue identificar todos os servidores atingidos. Na prática, todo operador precisa conferir a própria máquina em vez de se imaginar fora desse grupo.

O indicador conhecido é a unidade systemd `/etc/systemd/system/java-jre-update.service`. Se ela aparecer, preserve as evidências e trate o host como comprometido. Apagar o arquivo e comemorar antes do almoço só ajuda a perder o rastro. O fornecedor também orienta revisar chaves SSH, usuários, tarefas agendadas e conexões de saída, além de girar e restringir credenciais de API.

Em 1º de setembro, a Virtualizor lançou a versão 3.2.9.9 com um Security Analyzer e uma ferramenta de mitigação. A atualização entrega a verificação; o histórico da máquina ainda precisa ser investigado. Na publicação do relatório, a apuração sobre outros produtos da Softaculous continuava aberta.

A empresa promete adicionar assinatura de código aos pacotes. Durante esta apuração, isso ainda era uma remediação prometida, sem confirmação de implantação em todo o catálogo. É justamente o canal que faltou: mesmo com rota, servidor e certificado tomados juntos, o update só seria aceito se carregasse a assinatura criptográfica do publicador.

TLS cuida da conexão. A assinatura cuida do artefato. Pedir que um único controle responda pelos dois é deixar uma mentira depor como duas testemunhas.

Fontes: [Virtualizor — Security Incident: BGP Hijacking](https://www.virtualizor.com/blog/security-incident-bgp-hijacking/) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-push-malicious-virtualizor-update-in-bgp-hijacking-attack/).

## Gambling Goblin usa o Apache para vestir a camisa do governo

A Check Point Research publicou em 2 de setembro uma investigação sobre uma campanha acompanhada desde meados de 2025. O grupo, batizado pela empresa de Gambling Goblin, compromete organizações brasileiras, principalmente instituições governamentais e educacionais, e usa seus domínios para promover páginas de aposta e phishing.

O golpe consegue passar longe daquela clássica página inicial piscando “fui invadido”. Módulos maliciosos entram no Apache, observam os caminhos pedidos e encaminham alguns deles para a infraestrutura do atacante. O visitante continua vendo um hostname legítimo, inclusive em domínios `.gov.br`, enquanto o servidor entrega por proxy reverso o conteúdo escolhido pelo invasor.

Um dos módulos analisados também troca a Content Security Policy por regras permissivas. A CSP restringe de onde scripts e outros recursos podem vir. Depois de enfraquecida, ela deixa o conteúdo retransmitido carregar o que precisa para funcionar. O servidor participa da resposta, altera cabeçalhos e ainda empresta sua reputação ao golpe. Serviço completo.

Uma busca comum por arquivos alterados pode deixar boa parte dessa história passar. O módulo roda dentro do web server e interfere no caminho entre a requisição e a resposta. Módulos, arquivos de carregamento, regras de proxy e configuração do Apache merecem o mesmo controle de integridade dado ao diretório público da aplicação. A cozinha também faz parte do restaurante, mesmo quando a placa na rua continua impecável.

Segundo a Check Point, o arsenal observado vai bem além do desvio de páginas. A lista inclui DownPro, AlphaAgent, oRAT, um coletor de senhas derivado do 3snake, uma ferramenta de força bruta contra SSH e scripts de reconhecimento. As capacidades cobrem coleta de dados de `.ssh` e do histórico do shell, túneis, acesso remoto a arquivos e shell, persistência, movimento lateral e processos mascarados.

A pesquisa não viu diretamente o acesso inicial. Serviços sem patch e credenciais SSH fracas aparecem como avaliação e contexto, sem uma cadeia demonstrada para cada vítima. Na resposta ao incidente, exposição e contas entram na revisão. Encontrar uma senha ruim não explica automaticamente o caminho inteiro.

Para operadores Linux, principalmente em governo e educação, a caça inclui módulos e arquivos de carregamento inesperados no Apache, regras de proxy desconhecidas, nomes de processo disfarçados e anomalias de DNS ou saída de rede. O básico também entra antes de voltar ao rodapé: corrigir serviços expostos, restringir SSH e auditar contas e chaves.

Entre os indicadores publicados estão `playfootball[.]info`, usado em phishing, os domínios parecidos com serviços de desenvolvimento `github[.]la` e `gitlab[.]bet`, além de `br[.]team-c2[.]com`. Eles ficam defangados aqui para uma lista defensiva não virar uma coleção de links clicáveis. A fonte traz os demais indicadores para caça e correlação.

A Check Point atribui a campanha ao Earth Berberoka com confiança de média a alta. A avaliação cruza malware, infraestrutura, artefatos em chinês e o foco em apostas. Em 2022, a Trend Micro documentou um cluster de língua chinesa com esse nome agindo contra sites de jogos em Windows, Linux e macOS. Esse trabalho confirma o perfil histórico do grupo. A atribuição da operação brasileira de 2026 continua sendo uma avaliação da Check Point, sem confirmação independente nesta apuração.

Até agora, o conteúdo observado foi de apostas e phishing. O relatório projeta que uma mudança de configuração permitiria entregar malware, mas não apresenta evidência de que essas páginas já tenham feito isso. O ocorrido já dá trabalho suficiente: servidores confiáveis viraram infraestrutura do atacante sem abrir mão do domínio que usuários e buscadores aprenderam a respeitar.

Fontes: [Check Point Research — Gaming the system](https://research.checkpoint.com/2026/gaming-the-system-how-a-chinese-speaking-actor-turned-brazilian-government-sites-into-an-seo-weapon/) e [Trend Micro Research — Earth Berberoka](https://www.trendmicro.com/en_us/research/22/d/new-apt-group-earth-berberoka-targets-gambling-websites-with-old.html).

## O estado do agente sai do prompt e entra num ledger

Uma execução longa de agente acumula conversa, chamadas de ferramenta, resultados, decisões, erros e tentativas repetidas. Aí alguém pergunta “quantas tarefas terminaram?” ou “qual etapa falhou?”, e a solução comum é jogar um pedaço do trace para o modelo e torcer para a resposta ainda estar lá. O banco de dados é uma janela de contexto com prazo de validade e cobrança por token. Parece prático porque a fatura conceitual chega depois.

Egor Pakhomov e Erik Nijkamp, da Salesforce AI Research, propõem outro desenho no preprint *Parsing the Stream*. Cada evento da execução vai para um ledger tipado e append-only. Um redutor determinístico incorpora os eventos ao estado atual. Depois, views compiladas entregam a cada consumidor somente sua projeção: uma para o agente que trabalha, outra para a pessoa que acompanha.

A semelhança com event sourcing e CQRS é direta. O ledger imutável preserva a origem para auditoria e replay. O fold transforma a sequência em estado, incluindo contagens, status, proveniência e invariantes. As projeções poupam o estoque inteiro de eventos quando a pergunta é pequena.

Essa divisão também deixa as responsabilidades menos nebulosas. O modelo interpreta a situação e toma decisões. Código comum faz o bookkeeping que pode ser definido e testado. Ao reproduzir o mesmo ledger, o redutor deve chegar ao mesmo estado. Idempotência, transições e invariantes saem do campo da fé no prompt e viram comportamento verificável.

Nos testes de observação dos autores, as views compiladas consumiram cerca de 14 a 15 vezes menos tokens de entrada e custaram de 5 a 7 vezes menos que a leitura de uma cauda do trace limitada pelo orçamento. A acurácia ficou entre 0,85 e 0,87, contra 0,48 para o trace cru.

O resultado é forte dentro daquele protocolo, que já nasceu com uma vantagem declarada: as perguntas de monitoramento e o schema foram desenhados juntos. A view sabia representar os fatos cobrados na avaliação. Quando uma pergunta de produção depende de uma relação descartada pelo schema, a compressão barata vira amnésia muito eficiente.

O segundo experimento deixa esse limite ainda mais claro. Em tarefas com dependência sequencial de 120 passos, os mecanismos que guardavam a estatística necessária no estado de cada etapa acertaram 30 de 30 casos. O contexto completo acertou 8 de 30. Os autores chamam a amostra de 30 de descritiva porque desenvolveram benchmark e sistema juntos.

Tem ainda um concorrente embaraçosamente simples. Um scratchpad no prompt empatou com o fold na acurácia dessas tarefas e custou menos. O ledger se diferencia pela auditabilidade determinística e pelo reaproveitamento do mesmo estado entre consumidores. Para uma execução curta e descartável, uma anotação barata pode resolver sem a fundação de um cartório de eventos.

O paper relata também uma família de tarefas sensível à ordem na qual o fold fixo deixa de ajudar. Esse é o preço da síntese: o schema guarda algumas propriedades e joga outras fora. Antes de transformar o padrão em infraestrutura, a equipe precisa descobrir quais perguntas, decisões e operações futuras dependem do detalhe eliminado.

A implementação pública `tracelab` ajuda a fazer essa conta. O repositório expõe o código de ledger, fold e views, além de scoreboards, registros de gasto, 99 testes e um corpus sintético regenerável com 12 sessões. Os 12 traces reais usados pelos autores são pessoais e ficaram de fora. Dá para inspecionar o mecanismo e os artefatos sintéticos; a evidência baseada nas conversas reais não pode ser reconstruída por completo.

A ideia útil é separar evento bruto, estado derivado e visão de cada consumidor. Lifecycle, contagem e invariantes podem morar em código. O trace continua disponível para uma auditoria voltar ao detalhe. E o modelo recebe o necessário para a próxima decisão sem reler a autobiografia inteira da execução só para descobrir se já chamou uma ferramenta três vezes.

Fontes: [*Parsing the Stream* (arXiv:2609.01466v1)](https://arxiv.org/abs/2609.01466) e [SalesforceAIResearch/tracelab](https://github.com/SalesforceAIResearch/tracelab).

## Destaques rápidos para hoje.

- **SonicWall corrigiu duas falhas do SMA1000 após relatar exploração ativa.** A CVE-2026-83548 permite SSRF antes da autenticação e tem CVSS 10.0; a CVE-2026-83549 permite injeção de comando por administrador autenticado e tem CVSS 7.8, embora a descrição de exploração remota conflite com o vetor `AV:L` publicado. Os modelos 6210, 7210 e 8200v precisam das builds 12.4.3-03526 ou 12.5.0-02952, ou posteriores. Não há workaround. A exploração vem de um caso investigado pelo fornecedor, ainda sem cadeia ou indicadores públicos. Se houver sinal de invasão, a orientação inclui acionar a SonicWall, reimplantar o appliance e girar senhas e tokens TOTP. Fontes: [SonicWall PSIRT SNWLID-2026-0016](https://psirt.global.sonicwall.com/vuln-detail/SNWLID-2026-0016) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/sonicwall-warns-of-actively-exploited-sma1000-zero-day-flaws/).

- **Anthropic colocou um bloqueador antes da chamada de ferramenta.** Já falamos dos [agentes que agiram na internet](/2026/http-terminator-caca-desync-agentes-agem-na-internet-e-webhooks-pedem-um-log/). A novidade de 31 de agosto é um classificador em tempo real capaz de barrar a ação suspeita, encerrar a tarefa e alertar uma pessoa. A empresa também reforçou o isolamento e passou a exigir de avaliadores externos ambiente sem internet por padrão, chaves fora da sandbox, escopo explícito e um monitor capaz de interromper a execução. Os incidentes envolveram modelos de pré-lançamento ou configurações com proteções reduzidas. A análise completa, com revisão independente da METR, ainda não estava pronta. Fonte: [Anthropic — Improving our alignment and security efforts](https://www.anthropic.com/news/improving-alignment-security-efforts).

- **Kubernetes 1.37 passou a transmitir leituras grandes do etcd em blocos.** O `EtcdRangeStream` chegou a beta e fica ligado por padrão quando o cluster usa etcd 3.7 ou posterior. API server e etcd processam chunks ajustados ao tamanho dos valores e liberam memória durante o avanço, em vez de montar páginas limitadas pela quantidade de chaves. Isso deixa o pico mais previsível na inicialização do watch cache e em listas que vão direto ao etcd; versões antigas caem automaticamente no caminho paginado. A métrica `etcd_request_duration_seconds_count{operation="listStream"}` diferente de zero confirma o uso. O recurso cobre esse caminho de leitura, não todos os problemas de memória do cluster. Fonte: [Kubernetes Blog — etcd RangeStream](https://kubernetes.io/blog/2026/09/01/kubernetes-v1-37-etcd-range-stream/).

- **Starlight 0.42 trocou TypeScript distribuído por JavaScript compilado e refez o menu móvel.** O pacote agora leva declarações de tipo separadas, evitando que cada consumidor verifique os arquivos `.ts` da dependência com sua própria configuração. O menu usa a Popover API e funciona mesmo sem JavaScript no cliente. Rode `npx @astrojs/upgrade` e revise plugins de tema, overrides e CSS: markup, seletores e suporte mínimo de navegador mudaram. A versão também exige Astro 7.2.10 ou posterior e versões mínimas das integrações Markdown usadas. Fontes: [Astro Blog — Starlight 0.42](https://astro.build/blog/starlight-042/) e [release 0.42.0](https://github.com/withastro/starlight/releases/tag/%40astrojs%2Fstarlight%400.42.0).

- **Percona documentou autenticação OIDC aberta para MySQL.** O plugin de servidor valida tokens assinados, atualiza chaves por JWKS, mapeia grupos do provedor de identidade para roles e suporta proxy users. Os tokens passam apenas por TLS, socket Unix ou memória compartilhada. Expiração e grupos são conferidos na conexão, então uma sessão longa pode sobreviver ao token ou manter roles até reconectar. A Percona cita as versões 8.4.11-11 e 9.7.2-2, mas dizia que elas ainda não tinham sido lançadas quando publicou o artigo. Confirme o pacote antes de desenhar a migração no quadro branco. Fontes: [documentação do Percona Server for MySQL](https://docs.percona.com/percona-server/8.4/openid-connect-authentication.html) e [Percona Blog](https://www.percona.com/blog/oidc-authentication-for-percona-mysql/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 26489
source_urls:
  - https://www.virtualizor.com/blog/security-incident-bgp-hijacking/
  - https://www.bleepingcomputer.com/news/security/hackers-push-malicious-virtualizor-update-in-bgp-hijacking-attack/
  - https://research.checkpoint.com/2026/gaming-the-system-how-a-chinese-speaking-actor-turned-brazilian-government-sites-into-an-seo-weapon/
  - https://www.trendmicro.com/en_us/research/22/d/new-apt-group-earth-berberoka-targets-gambling-websites-with-old.html
  - https://arxiv.org/abs/2609.01466
  - https://github.com/SalesforceAIResearch/tracelab
  - https://psirt.global.sonicwall.com/vuln-detail/SNWLID-2026-0016
  - https://www.bleepingcomputer.com/news/security/sonicwall-warns-of-actively-exploited-sma1000-zero-day-flaws/
  - https://www.anthropic.com/news/improving-alignment-security-efforts
  - https://kubernetes.io/blog/2026/09/01/kubernetes-v1-37-etcd-range-stream/
  - https://astro.build/blog/starlight-042/
  - https://github.com/withastro/starlight/releases/tag/%40astrojs%2Fstarlight%400.42.0
  - https://docs.percona.com/percona-server/8.4/openid-connect-authentication.html
  - https://www.percona.com/blog/oidc-authentication-for-percona-mysql/
-->
