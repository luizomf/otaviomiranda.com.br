---
title: 'Fedora detalha o kmscon; Cloudflare reduz custo de revisão de código com IA'
description: 'Cloudflare relata economia de 68% e perdas na detecção de problemas de desempenho. Fedora explica mudanças no console; Rank Math PRO exige cuidados após incidente.'
date: '2026-10-20T05:15:00-03:00'
author: 'The Paper LLM'
image: "./images/fedora-kmscon-cloudflare-custo-revisao-ia.jpg"
---

![Recibo ilustrativo da Cloudflare mostra o custo menor da revisão com IA e questiona os problemas encontrados.](./images/fedora-kmscon-cloudflare-custo-revisao-ia.jpg)

O console do Fedora ganha recursos e muda algumas rotinas de administração. Na revisão de código com IA, a Cloudflare mostra uma economia expressiva acompanhada de perdas que precisam entrar na conta. A edição também traz um alerta para sites WordPress, uma mudança na divulgação de falhas do curl e atualizações de Go, OpenBSD e ferramentas de desenvolvimento.

## Fedora explica o que muda nos consoles com kmscon

O Fedora publicou em **19 de outubro** um guia das mudanças nos consoles de texto com a adoção do **kmscon no Fedora 45**. São as telas de login acessíveis, por exemplo, com `Ctrl+Alt+F3`, para trabalhar fora do ambiente gráfico. O kmscon passa a desenhar essas telas em um programa separado do kernel, o núcleo do sistema operacional.

[Já cobrimos a troca no anúncio da beta](/2026/plugins-do-networkmanager-abrem-caminho-para-root-e-gemini-3-8-live-conversa-enquanto-chama-ferramentas/). O guia agora detalha mudanças que afetam scripts e manutenção. Dentro do kmscon, o comando `tty` passa a indicar um pseudoterminal, como `/dev/pts/0`, em vez de um dispositivo como `/dev/tty1`. Scripts que usam esse caminho para reconhecer o console precisam ser revistos.

Também muda a passagem do controle da GPU para uma aplicação gráfica. O kmscon usa de forma exclusiva a interface DRM, pela qual acessa o hardware gráfico. Para iniciar uma sessão gráfica a partir dele, é preciso liberar esse acesso com `kmscon-launch-gui`, conforme o procedimento documentado. Já `setfont` e `loadkeys` deixam de controlar esse console: as fontes têm configuração própria, e o layout do teclado acompanha a configuração feita com `localectl`.

A mudança permite fontes mais adequadas a telas de alta resolução, melhor suporte a Unicode e rolagem. Para quem depende do console em manutenção, vale testar o fluxo de recuperação antes do upgrade. O guia mostra como manter um dos terminais virtuais com o console tradicional.

Fonte: [Fedora Magazine — guia do kmscon](https://fedoramagazine.org/modernizing-the-console-with-kmscon/).

## Cloudflare reduz em 68% o custo de revisão com IA, mas detecta menos problemas de desempenho

A Cloudflare relatou em **19 de outubro** que o custo médio de suas revisões de código caiu de **US$ 2,43 para US$ 0,77**, enquanto a duração mediana passou de **4 minutos e 9 segundos para 1 minuto e 32 segundos**. A economia combina mudanças no software, nos modelos e no esforço de raciocínio usado por eles.

Parte da economia veio do **cache de prefixo**, que reaproveita o processamento do trecho inicial das instruções enviadas ao modelo. A taxa geral de reaproveitamento chegava a 97%, mas a primeira chamada de cada sessão encontrava conteúdo em cache em apenas 14% a 26% dos casos. O bloco armazenado misturava instruções comuns com informações variáveis, como o diretório do repositório. Separar a parte estável e dar a ela seu próprio ponto de armazenamento permitiu reutilizá-la em revisões de outros repositórios.

A qualidade variou por especialidade e pelo nível de esforço de raciocínio configurado. Segundo a avaliação interna, o revisor de qualidade de código com esforço alto manteve aproximadamente a quantidade de problemas reais encontrados, com menos exageros na gravidade atribuída. O custo de US$ 0,77 já considera essa configuração. O revisor de desempenho, mantido em esforço médio, encontrou cerca de **64% menos problemas classificados como importantes por revisão**. Em segurança também houve queda, sem significância estatística na amostra.

A empresa usou alterações posteriores feitas pelos autores e julgamentos de modelos para avaliar os achados. Essas medidas têm limites: mudar uma linha não comprova que a crítica estava correta, e a janela final de qualidade cobria apenas um dia. Para quem mantém agentes revisores, o caso oferece duas verificações concretas: observar a primeira requisição que chega ao provedor e medir quais defeitos continuam sendo encontrados depois de baratear a execução.

Fonte: [Cloudflare — custos, cache e avaliação de qualidade](https://blog.cloudflare.com/obsessive-inference-optimization).

## Rank Math PRO distribuiu arquivos com malware; atualizar não basta após a ativação

Quem administra WordPress com **Rank Math PRO** deve conferir a origem e o horário do download da versão **3.0.123**. Segundo o fornecedor, alguns arquivos distribuídos entre **15 de outubro, às 20h02 UTC, e 16 de outubro, às 7h12 UTC**, continham malware. Em Brasília, a janela vai das **17h02 do dia 15 às 4h12 do dia 16**. O alerta ganhou nova cobertura em 19 de outubro.

O Rank Math é um plugin de otimização para mecanismos de busca. O incidente afeta a edição PRO; a versão gratuita distribuída pelo WordPress.org ficou fora do caso, segundo a empresa.

Se o pacote afetado foi instalado e ativado, a orientação é **tratar o site como comprometido**. O malware pode recriar acessos ocultos, de modo que apenas atualizar ou desativar o plugin deixa a recuperação incompleta. O fornecedor recomenda restaurar os arquivos e o banco a partir de um backup limpo, anterior ao incidente, verificar o ambiente e trocar senhas, chaves de API e outras credenciais acessíveis ao site. Depois, instalar a versão limpa **3.0.124**.

Para quem instalou sem ativar, a orientação é remover os arquivos afetados, instalar a versão limpa e fazer uma varredura. Se houve ativação e não existe backup confiável, envolva a hospedagem ou um profissional de segurança: a investigação pode precisar alcançar contas administrativas, tarefas agendadas e arquivos fora do WordPress. O número de sites comprometidos não foi estabelecido nas fontes consultadas.

Fontes: [orientações do Rank Math](https://rankmath.com/kb/pro-3-0-123-security-incident/) e [cobertura de 19 de outubro do BleepingComputer](https://www.bleepingcomputer.com/news/security/wordpress-seo-plugin-rank-math-compromised-to-backdoor-websites/).

## curl passará a receber publicamente relatos de falhas baixas e médias

Daniel Stenberg anunciou em **20 de outubro** uma mudança que entra em vigor em **26 de outubro**: relatos de vulnerabilidades do curl classificados como de gravidade baixa ou média deverão ser enviados como issues públicas no GitHub. Casos altos e críticos continuarão privados no HackerOne. Pesquisadores em dúvida sobre a gravidade ainda poderão começar pelo canal privado.

O mantenedor atribui a decisão à sobrecarga causada pelo volume de relatos. Abrir a investigação permite que mais pessoas ajudem a avaliar impacto, revisar correções e preparar avisos. Stenberg reconhece o custo de segurança: a divulgação antecipada também amplia a janela em que atacantes podem conhecer uma fraqueza ainda sem correção.

Fonte: [Daniel Stenberg — nova política de divulgação](https://daniel.haxx.se/blog/2026/10/20/do-minor-curl-vulnerabilities-in-the-open/).

## Destaques rápidos para hoje.

- **Go 1.27.3 e 1.26.10 bloqueiam cadeias com certificados intermediários considerados não confiáveis.** As versões de **19 de outubro** corrigem a CVE-2026-111943 em `crypto/x509`, pacote que verifica certificados. O patch filtra cadeias por oito identificadores de chaves públicas. A equipe recomenda atualização imediata; quem distribui aplicações Go deve incorporar a correção aos builds e reimplantar os binários. O aviso público menciona preocupações de segurança específicas, sem detalhar a causa do bloqueio. Fontes: [issue de segurança](https://github.com/golang/go/issues/82345), [versões oficiais](https://go.dev/doc/devel/release) e [patch](https://github.com/golang/go/commit/90617fb7ceb59cf08bee7826bb51b8c8fb8c11de).

- **OpenBSD 8.0 chega com até 64 processadores virtuais por máquina convidada.** Lançado em **20 de outubro**, o sistema amplia a virtualização com VMM/VMD e aumenta de 4 GB para 512 GB o espaço de endereçamento virtual do kernel em amd64. Esse espaço organiza endereços usados pelo kernel; seu tamanho não equivale à RAM instalada. É uma atualização relevante para quem usa OpenBSD como hospedeiro de máquinas virtuais. Fonte: [notas do OpenBSD 8.0](https://www.openbsd.org/80.html).

- **Tailscale lança beta do MagicRoute para reduzir trocas desnecessárias de conexão.** Anunciado em **19 de outubro** para os planos Premium e Enterprise, o recurso escolhe conectores por localização aproximada e mantém a preferência enquanto o conector estiver saudável. A seleção anterior podia oscilar com pequenas diferenças de latência e interromper sessões SSH ou transferências. Se o preferido falhar, o cliente percorre a lista de alternativas. Fonte: [Tailscale — MagicRoute](https://tailscale.com/blog/magicroute-beta).

- **Meta usa etapas fixas para coordenar 14 agentes em mudanças de pipelines de dados.** Em relato de **19 de outubro**, a empresa descreve um coordenador com etapas fixas e verificações de confiabilidade, que delega o trabalho de domínio a 14 agentes especializados. O caso envolve pipelines, as sequências de processamento de dados, com contextos separados para reduzir a mistura de regras entre subsistemas. Segundo a Meta, cerca de dois terços das alterações chegam ao código sem edições humanas significativas nesse ambiente. Fonte: [arquitetura da Meta](https://engineering.fb.com/2026/10/19/ml-applications/thin-orchestrator-ai-agent-architecture/).

- **DNSimple mede 12% menos CPU por consulta após otimizar sua biblioteca Erlang.** O relato de **19 de outubro** compara versões do `dns_erlang` numa carga sintética com formato semelhante ao tráfego real: cerca de 19 milhões de consultas e 20 mil zonas. Reduzir cópias e alocações de dados binários elevou em 14% a capacidade antes da saturação. Os percentuais pertencem a esse teste; o texto também mostra otimizações que aceleraram funções isoladas sem melhorar o servidor como um todo. Fonte: [DNSimple — metodologia e mudanças](https://blog.dnsimple.com/2026/10/making-dns-erlang-fast/).

- **Django pede testes para propostas de mudanças nos modelos da versão 6.2.** O chamado de **19 de outubro** destaca mover modelos entre aplicações, configurar o campo padrão de chave primária e trabalhar com `CompositeField`, ligado a subconsultas com múltiplas colunas. São propostas em desenvolvimento. Quem quiser contribuir deve testar a branch específica do PR, conforme a orientação do conselho do framework Python. Fonte: [Django — chamada a colaboradores](https://www.djangoproject.com/weblog/2026/oct/19/quarterly-contributor-outreach/).

- **MiniMax lança M3.1 Flash com entrada a US$ 0,15 por milhão de tokens.** O anúncio de **19 de outubro** informa US$ 0,60 por milhão de tokens de saída e US$ 0,015 para entrada em cache. O modelo está disponível na API, no M Plan e no MiniMax Code; os pesos para download ficaram prometidos para depois. Para escolher um modelo para agentes, o preço por token precisa ser combinado com a quantidade de tentativas e a qualidade nas suas tarefas. Fonte: [MiniMax — lançamento e preços](https://www.minimax.io/blog/minimax-m31f).

- **Estudo de geoquímica encontra erros de resposta após cálculos corretos feitos por agentes.** Um artigo preliminar, ou preprint, de **19 de outubro** avaliou 158 questões com o simulador de geoquímica PHREEQC. Ao buscar resultados em arquivos, alguns modelos GPT trocaram o relatório oficial por arquivos próprios com mais casas decimais e erraram o arredondamento. Indicar explicitamente qual saída era a referência melhorou os resultados. O efeito variou por modelo e foi medido nesse conjunto de questões, oferecendo um teste útil para quem altera a entrega de resultados das ferramentas ao agente. Fonte: [estudo — método, intervenções e limitações](https://arxiv.org/html/2610.26836v1).

- **uv 0.13.3 corrige lentidão severa ao exportar dependências com extras.** A versão, publicada em **20 de outubro**, ajusta o `uv export` do gerenciador Python em grafos com dependências opcionais. Depois da [mudança de padrão de Python na 0.13.0](/2026/deno-cloudflare-fim-deploy-python-315/), esta é uma correção específica de desempenho. Vale conferir o upgrade se a exportação virou gargalo no seu fluxo. Fonte: [notas do uv 0.13.3](https://github.com/astral-sh/uv/releases/tag/0.13.3).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28920
source_urls:
  - https://fedoramagazine.org/modernizing-the-console-with-kmscon/
  - https://blog.cloudflare.com/obsessive-inference-optimization
  - https://rankmath.com/kb/pro-3-0-123-security-incident/
  - https://www.bleepingcomputer.com/news/security/wordpress-seo-plugin-rank-math-compromised-to-backdoor-websites/
  - https://daniel.haxx.se/blog/2026/10/20/do-minor-curl-vulnerabilities-in-the-open/
  - https://github.com/golang/go/issues/82345
  - https://go.dev/doc/devel/release
  - https://github.com/golang/go/commit/90617fb7ceb59cf08bee7826bb51b8c8fb8c11de
  - https://www.openbsd.org/80.html
  - https://tailscale.com/blog/magicroute-beta
  - https://engineering.fb.com/2026/10/19/ml-applications/thin-orchestrator-ai-agent-architecture/
  - https://blog.dnsimple.com/2026/10/making-dns-erlang-fast/
  - https://www.djangoproject.com/weblog/2026/oct/19/quarterly-contributor-outreach/
  - https://www.minimax.io/blog/minimax-m31f
  - https://arxiv.org/html/2610.26836v1
  - https://github.com/astral-sh/uv/releases/tag/0.13.3
-->
