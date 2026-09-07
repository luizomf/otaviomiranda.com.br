---
title: 'N-central exige novo patch, e wrapture mostra o cartão no trace'
description: 'HF4 corrige execução remota sem login no N-central. Um exemplo Python expõe dados no diagnóstico, e Coop fecha um caminho de credenciais na versão em desenvolvimento.'
date: 2026-09-07T05:32:19-03:00
author: 'The Paper LLM'
image: './images/n-central-exige-novo-patch-e-wrapture-mostra-o-cartao-no-trace.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/n-central-exige-novo-patch-e-wrapture-mostra-o-cartao-no-trace/final.opus'
---

![Patch bordado N-central HF4 em uma manga azul, com orientação para atualizar o servidor.](./images/n-central-exige-novo-patch-e-wrapture-mostra-o-cartao-no-trace.jpg)

Você instalou o hotfix do servidor de gerenciamento e já apareceu outro. No N-central, confira o número inteiro: a N-able publicou o Hotfix 4 para corrigir uma falha crítica que permite executar código antes do login. Quem parou no HF3 ainda precisa atualizar. O alvo é justamente o servidor usado para acompanhar e administrar outras máquinas. A portaria do prédio estava dispensando identificação.

## N-central precisa do HF4, mesmo depois do hotfix anterior

A correção é o N-central 2026.3 Hotfix 4, **build 2026.3.1.14**, para a CVE-2026-86218. A N-able publicou o aviso em 6 de setembro, com notas de versão atualizadas no dia 5. Segundo o fornecedor, a falha permite executar código remotamente no servidor N-central sem precisar de uma conta ou de entrar no painel.

O N-central concentra o monitoramento e o gerenciamento remoto de equipes de TI e prestadores de serviços gerenciados. Comece descobrindo quem cuida do servidor e qual build está instalada. A N-able diz que já corrigiu as instâncias hospedadas por ela, chamadas NCOD; nesses casos, o cliente não precisa intervir. Para quem mantém uma instalação própria, a orientação é atualizar imediatamente.

O HF4 substitui o HF3, cujo build termina em 13. Esse dígito importa: a correção anterior deixa aberta a falha tratada por esta. O alvo desse hotfix é o servidor. Você não precisa atualizar os agentes dos endpoints para proteger contra essa CVE, embora a recomendação habitual de mantê-los em dia continue valendo.

As notas permitem atualização direta a partir das versões 2025.4, 2026.1, 2026.2 e 2026.3, incluindo os três hotfixes anteriores da 2026.3. Instalações mais antigas precisam passar por uma versão intermediária suportada. Essa lista descreve os caminhos de atualização; a faixa completa de versões vulneráveis não está delimitada ali. Confira de onde você está saindo antes de escolher o pacote.

E já estão explorando? As fontes públicas divergem. A Huntress descreve a CVE como explorada ativamente e reproduz uma declaração atribuída a um representante da N-able nesse sentido. Já os avisos públicos de status e release da própria N-able ainda dizem não ter confirmação de exploração em produção. No caso investigado pela Huntress, os logs já tinham rotacionado. Com o histórico disponível, a empresa não conseguiu atribuir aquele comprometimento a esta CVE ou às falhas anteriores.

O fornecedor já pede urgência no patch. Descobrir por onde entraram naquele incidente continua sendo trabalho da investigação, com a dificuldade extra de procurar uma resposta nos registros que sobraram.

Junto da atualização, a Huntress recomenda revisar logs do appliance em busca de manipulação de API, auditar contas e mudanças de permissão e restringir o console com uma lista de origens permitidas ou VPN. O patch fecha a falha; a revisão de contas e registros procura alterações que podem ter acontecido antes dele. Reserve tempo para as duas coisas, especialmente se o console estava exposto.

Fontes: [N-able — aviso do N-central 2026.3 Hotfix 4](https://status.n-able.com/2026/09/06/n-central-2026-3-hotfix-4-cve-2026-86218/), [notas de versão e caminhos de atualização](https://documentation.n-able.com/N-central/Release_Notes/GA/Content/N-central_2026.3_HF4_Release_Notes.htm) e [Huntress — investigação e divergência sobre exploração](https://www.huntress.com/blog/n-able-vulnerability-exploitation).

## wrapture acompanha a falha e leva o cartão junto

Você quer entender por que um pedido falhou. O trace mostra a chamada do serviço, a tentativa de cobrança, a exceção e o tempo gasto. Ótimo. Mostra também o argumento com o número completo do cartão. O diagnóstico trouxe informação suficiente para resolver um problema e começar outro.

Graham Dumpleton publicou em 7 de setembro uma demonstração de rastreamento ao vivo com wrapture, biblioteca Python que [apresentamos em 31 de agosto](/2026/qubes-fecha-fuga-ao-dom0-e-omarchy-corta-atalho-para-root/). Desta vez, ele acompanha as chamadas enquanto o programa executa, mostra a captura de dados sensíveis e explica um detalhe fácil de perder: esconder uma operação no trace não esconde automaticamente as chamadas feitas dentro dela.

O serviço do exemplo recebe um pedido, chama o gateway de pagamento e registra a operação no ledger, o componente de registro contábil. Dumpleton aplica um binding em cada uma dessas fronteiras. Esse binding envolve a chamada escolhida para observar sua execução. Os eventos vão para um sink, que recebe o que foi observado. No exemplo, é o `Printer`: ele escreve na saída de erro padrão conforme as chamadas acontecem.

Nos testes, você pode guardar esses eventos numa sequência para conferir depois. Na demonstração ao vivo, eles vão direto para o sink, sem abrir uma captura com `timeline()`. Você configura quais chamadas observar e para onde mandar os eventos nos pontos de instrumentação, em vez de espalhar mensagens de log pela lógica do pedido.

Quando o cartão é recusado, dá para seguir a falha: a cobrança lança `CardDeclined`, e a mesma exceção aparece na operação de criação do pedido. O método de registro no ledger nunca é chamado. O trace mostra a relação entre as operações e onde a sequência parou, com argumentos, retornos, exceções e duração disponíveis para consulta.

Só que a primeira saída publicada inclui o argumento completo do cartão. Isso acontece nos dados do exemplo controlado do autor; não é um relato de vazamento de clientes. Dumpleton corrige a captura com `capture=wrapture.redact("card")` tanto na entrada do pedido quanto na cobrança. O valor passa a aparecer como `<redacted>`.

Repare nos dois bindings. O argumento atravessa mais de uma chamada observada, então cada ponto precisa do tratamento adequado. A demonstração cobre esse argumento nesses locais. Retornos, exceções e outras instrumentações continuam exigindo revisão própria. O nome `redact` não espalha bom senso por todo o processo, embora fosse uma API bastante desejável.

Depois vem outra escolha: quanto do fluxo você quer ver? O exemplo usa um predicado `when` para selecionar pedidos de um cliente. Se ele rejeita a captura da operação principal, as chamadas internas do gateway e do ledger ainda podem gerar eventos, porque têm bindings independentes.

Na tela, as informações do pedido somem e seus filhos ficam. Você encontra uma cobrança sem a operação que explicava de onde ela veio. O filtro deixou órfãos no trace.

Com `tree=True`, a rejeição suprime o rastreamento da árvore inteira daquela operação. O pedido continua executando seu código, inclusive as chamadas internas. Esse filtro controla o que você observa; autorização e bloqueio de cobrança precisam acontecer na lógica do negócio.

Dumpleton também explica que, sem uma captura de teste ou sink de processo escutando, os bindings aplicados não constroem eventos. Quando há alguém escutando, o predicado pode rejeitar a captura antes da construção do evento. Isso explica onde o trabalho pode ser evitado, mas o exemplo não sustenta uma promessa de desempenho para qualquer programa.

Essa escolha sobre conteúdo sensível também aparece no guia de observabilidade de IA generativa do OpenTelemetry, publicado em maio. Por padrão, conteúdo de prompts e argumentos de ferramentas fica fora da captura. Registrar o conteúdo completo exige adesão explícita, porque ele pode conter dados sensíveis. A demonstração nova do wrapture deixa bem visível o motivo desse cuidado.

Se for experimentar no seu serviço Python, eu começaria pelas fronteiras que explicam a operação e conferiria a saída, inclusive no caminho de erro. Decida quais argumentos podem sair dali e se o filtro deve atingir só a chamada ou toda a árvore. Dá para entender por que a cobrança falhou sem guardar o cartão inteiro de lembrança.

Fontes: [Graham Dumpleton — Live tracing with wrapture](https://grahamdumpleton.me/posts/2026/09/live-tracing-with-wrapture/) e [OpenTelemetry — observabilidade de chamadas de IA generativa](https://opentelemetry.io/blog/2026/genai-observability/).

## Coop bloqueia o desvio que deixava a credencial fora do cofre

Um agente trabalha dentro de uma máquina virtual, edita o projeto e devolve os arquivos ao host. Até aí, tudo como esperado. Se uma credencial for gravada dentro do projeto, ela pode pegar a mesma carona. Esse caminho dispensa uma fuga espetacular pelo hipervisor. Basta salvar o arquivo no lugar errado.

A Trail of Bits incorporou em 7 de setembro uma proteção para esse caso no Coop, seu CLI para executar Claude Code e Codex em máquinas virtuais descartáveis. O projeto usa Firecracker no Linux e Lima no macOS. A mudança recusa uma variável `CODEX_HOME` definida explicitamente quando a configuração gerenciada do Codex usa armazenamento em keyring, o cofre de credenciais do guest.

**A correção está na versão em desenvolvimento, sob “Unreleased”.** O modo de autenticação com conta ChatGPT e o proxy de credenciais também estão nessa seção. A versão estável mais recente verificada é a v0.5.4, publicada em 14 de julho. Esses recursos e o ajuste novo ainda estão fora dela.

O problema começa com uma configuração aparentemente corriqueira. `CODEX_HOME` permite escolher outro diretório para o estado do Codex. No cenário documentado pelo Coop, essa mudança podia fazer o login da conta gravar um refresh token em texto puro fora da gestão de credenciais, inclusive no workspace sincronizado com o host. Esse token serve para renovar o acesso da conta.

A proteção interrompe esse caminho e pede para remover a variável. Se você está testando esse modo ainda não lançado, mantenha a localização gerenciada. O bloqueio vale para essa configuração com keyring; em outros ambientes, mudar o diretório do Codex continua sendo uma escolha à parte.

O modelo de confiança do projeto descreve a sincronização do workspace como o canal mais amplo do guest para o host. Conteúdo, nomes de arquivos e links simbólicos produzidos dentro da VM são tratados como não confiáveis quando voltam. A VM separa a execução, mas tem uma passagem deliberada para devolver o trabalho. É por ali que um arquivo de credencial pode virar mais uma alteração do projeto.

Também é preciso distinguir os dois modos de autenticação. No proxy opcional, as chaves das APIs de modelos suportados ficam no host, e a VM recebe um token de capacidade por instância. No modo de conta ChatGPT, a credencial renovável fica no keyring dentro da VM. Um guest comprometido ainda pode usar ou extrair essa credencial quando o cofre puder ser desbloqueado. Essa descrição de segurança vem do próprio projeto; não houve uma auditoria independente de isolamento nas fontes usadas aqui.

O ajuste fecha o caminho documentado que levava o token em texto puro para um diretório não gerenciado. A credencial autorizada para uso dentro do guest continua fazendo parte do estado dele. Ao avaliar um ambiente desses para agentes, confira onde o login guarda seus dados e o que a sincronização traz de volta. “Descartável” descreve a VM. Um arquivo que já voltou para o host tem outros planos.

Fontes: [Coop — projeto e plataformas](https://github.com/trailofbits/coop), [correção do caminho alternativo de credenciais](https://github.com/trailofbits/coop/commit/10c883ecd7a981d483e71444ce79a8b924f53c5a), [modelo de confiança](https://github.com/trailofbits/coop/blob/main/docs/trust-model.md) e [changelog na revisão de 7 de setembro](https://raw.githubusercontent.com/trailofbits/coop/10c883ecd7a981d483e71444ce79a8b924f53c5a/CHANGELOG.md).

## Destaques rápidos para hoje.

- **A OpenAI relata mais de US$ 600 por dia em inferência, a preços de API, para o pesquisador mediano em uso de agentes.** O relatório de 6 de setembro retrata meados de agosto e inclui integrantes da organização de pesquisa que trabalham com infraestrutura, gestão de projetos e suporte, com cobertura incompleta do uso. O valor estima o consumo pelos preços de API; não mede a despesa interna efetiva nem um ganho equivalente de produtividade. A própria empresa aponta gargalos e dificuldade para converter métricas de código e experimentos em progresso de pesquisa. No orçamento dos seus agentes, eu manteria consumo e resultado em colunas separadas. Fonte: [OpenAI — Research acceleration: The view inside OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/).

- **O Engrim adicionou acesso entre assistentes e rótulos de origem à memória local de projetos.** O commit de 7 de setembro, identificado como v1.3.0, amplia integrações e registra de qual agente veio uma entrada no armazenamento SQLite. Você pode recuperar decisões selecionadas ao trocar de assistente, em vez de depender de uma única conversa. O rótulo é metadado de origem, em alguns casos inferido do nome declarado pelo cliente. A autoria não é autenticada, e a memória ainda precisa ser conferida para saber se todas as restrições sobreviveram. Fontes: [Engrim — commit de suporte entre agentes](https://github.com/timgordontg/engrim/commit/ee6f5c2940d343b63d9d10cb3bf3f80aacd09878) e [documentação do projeto](https://github.com/timgordontg/engrim).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 26576
source_urls:
  - https://status.n-able.com/2026/09/06/n-central-2026-3-hotfix-4-cve-2026-86218/
  - https://documentation.n-able.com/N-central/Release_Notes/GA/Content/N-central_2026.3_HF4_Release_Notes.htm
  - https://www.huntress.com/blog/n-able-vulnerability-exploitation
  - https://grahamdumpleton.me/posts/2026/09/live-tracing-with-wrapture/
  - https://opentelemetry.io/blog/2026/genai-observability/
  - https://github.com/trailofbits/coop
  - https://github.com/trailofbits/coop/commit/10c883ecd7a981d483e71444ce79a8b924f53c5a
  - https://github.com/trailofbits/coop/blob/main/docs/trust-model.md
  - https://raw.githubusercontent.com/trailofbits/coop/10c883ecd7a981d483e71444ce79a8b924f53c5a/CHANGELOG.md
  - https://openai.com/index/research-acceleration-view-inside-openai/
  - https://github.com/timgordontg/engrim/commit/ee6f5c2940d343b63d9d10cb3bf3f80aacd09878
  - https://github.com/timgordontg/engrim
-->
