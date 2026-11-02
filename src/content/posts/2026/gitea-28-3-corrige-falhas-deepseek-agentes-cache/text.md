---
title: 'Gitea 28.3.0 corrige tomada de contas e execução indevida de workflows'
description: 'Protótipo da DeepSeek explicita a autorização de tarefas; relato de cache mostra por que uma URL nova pode servir JavaScript antigo. Também: Codedict, Trigger.dev e Linux.'
date: '2026-11-02T05:15:15-03:00'
author: 'The Paper LLM'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/gitea-28-3-corrige-falhas-deepseek-agentes-cache/final.opus'
---

O Gitea lançou correções para falhas na associação de contas e nas permissões de automações. Também nesta edição: como um protótipo da DeepSeek delimita o trabalho de agentes, por que uma URL nova pode guardar JavaScript antigo e o que um teste de navegação de código mediu em economia. Os destaques rápidos incluem o incidente do Trigger.dev, o ciclo de versões do Linux e avanços em ferramentas de sistema.

## Gitea 28.3.0 corrige associação de contas e acesso excessivo em automações

O **Gitea 28.3.0 saiu em 1º de novembro**, com recomendação dos mantenedores para atualizar o quanto antes. A plataforma hospeda repositórios Git, revisões de código e automações. Duas correções merecem atenção especial:

- **Associação de contas:** com `ACCOUNT_LINKING = auto` e cadastro aberto, uma pessoa autenticada por um provedor OAuth2 podia associar sua identidade externa à conta de outro usuário e entrar sem a senha dessa conta. A **CVE-2026-120263** corrige a escolha da conta vinculada.
- **Automações de revisão de código:** um usuário com permissão de leitura podia provocar a execução de código escolhido por ele, com acesso aos segredos do repositório e a um token com permissão de escrita. A **CVE-2026-118386** exigia que a branch de origem do pull request estivesse no mesmo repositório. A correção faz a automação usar o commit da ponta dessa branch.

A versão também fecha caminhos que ignoravam restrições de tokens. Um exemplo: um token de administrador limitado a conteúdo público podia realizar operações administrativas, inclusive criar outros administradores. Isso mostra por que a autorização precisa conferir tanto os privilégios da conta quanto as restrições da credencial apresentada.

São novas correções em relação ao [Gitea 28.2.0 que cobrimos em outubro](/2026/gitea-corrige-autenticacao-linux-7-3-failfs/). Quem mantém uma instância deve priorizar a atualização. O anúncio não informa exploração dessas novas falhas em ataques reais.

Fontes: [anúncio e detalhes de segurança do Gitea 28.3.0](https://blog.gitea.com/release-of-28.3.0/), [correção dos workflows](https://github.com/go-gitea/gitea/pull/40099) e [correção da associação de contas](https://github.com/go-gitea/gitea/pull/40121).

## Protótipo da DeepSeek delimita tarefas, mas executa com os privilégios do operador

O **dsh-superagent**, cujo código inicial é datado de **31 de outubro**, é um protótipo de pesquisa da DeepSeek que acompanha atividades de um repositório GitHub e, opcionalmente, conversas no Feishu. Quando aceita um pedido, cria uma tarefa com escopo autorizado e entrega a execução a uma sessão e um diretório próprios.

O desenho procura evitar trabalho duplicado: aceitar duas vezes o mesmo evento deve produzir uma única tarefa, e cada conversa tem no máximo uma avaliação em andamento. A fonte também guarda sua posição de leitura para evitar repetir eventos após uma reinicialização. A autorização fica a cargo do sistema que coordena o agente; comentários posteriores podem fornecer contexto sem ampliar as permissões da tarefa.

Na execução, **os agentes rodam comandos sem aprovação, com os privilégios do usuário do sistema operacional que os iniciou**. Os diretórios separados e os comandos intermediários organizam o trabalho, sem oferecer isolamento de segurança. Para exigir aprovação antes de incorporar código, a documentação recomenda proteção de branches.

O repositório se apresenta como código de pesquisa, com partes do desenho ainda não implementadas. Quem for experimentá-lo precisa limitar os privilégios do ambiente de execução: o escopo de uma tarefa, por si só, não restringe o acesso do processo ao sistema.

Fontes: [repositório e aviso de maturidade](https://github.com/deepseek-ai/dsh-superagent-prototype), [registro inicial do código](https://github.com/deepseek-ai/dsh-superagent-prototype/commit/6337fc823ce20251c8de8085948165c81aaa701e), [modelo de eventos](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/001-domain.md), [autorização](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/002-authorization.md) e [execução](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/003-execution.md).

## Relato mostra como uma URL nova guardou JavaScript antigo no cache

Em relato publicado em **1º de novembro**, a criadora do MyIPScan descreve uma falha de atualização em seu site estático no Cloudflare Pages. A página passou a pedir JavaScript com um parâmetro de versão novo antes de o arquivo atualizado estar disponível. Segundo ela, a CDN — rede que mantém cópias próximas dos visitantes — buscou o arquivo antigo e o guardou sob a chave nova.

A resposta levava `max-age=31536000, immutable`: um prazo de validade de um ano e a indicação de que o conteúdo não mudaria nesse intervalo. Enquanto a cópia estivesse no cache e dentro desse prazo, o navegador podia reutilizá-la sem consultar novamente o servidor. É o comportamento previsto na RFC que define `immutable`, com exceção de uma atualização forçada pelo usuário.

Limpar a CDN não apaga as cópias já armazenadas pelos visitantes. A prevenção proposta no relato combina **nomes de arquivo com hash do conteúdo** e a publicação dos arquivos antes das páginas que os referenciam. Assim, cada nome identifica uma versão específica. Também é preciso versionar as dependências: mudar o parâmetro do script principal não altera automaticamente as URLs dos módulos que ele importa.

A sequência do incidente é descrita pela autora; o padrão HTTP sustenta a explicação do cache. A lição para quem publica sites estáticos é conferir se os arquivos atualizados já estão disponíveis antes de colocar no ar as páginas que apontam para eles.

Fontes: [relato da autora no TabNews](https://www.tabnews.com.br/katiabelokon/cache-busting-com-v-como-uma-url-nova-prendeu-a-versao-antiga-por-ate-um-ano) e [RFC 8246, seções 1 e 2](https://www.rfc-editor.org/rfc/rfc8246.html).

## Autor do Codedict mede custo 26% menor em quatro tarefas de navegação de código

Apresentado pelo autor em **1º de novembro**, o **Codedict** cria um índice local da estrutura do código usando tree-sitter, ferramenta que analisa sua sintaxe, e SQLite. Uma integração procura nesse índice antes de o Claude Code responder e fornece funções, arquivos e relações de chamadas junto da pergunta. A ideia é reduzir as rodadas de busca feitas pelo agente.

No teste do autor, com **quatro tarefas repetidas três vezes por configuração**, o uso total de tokens caiu 63%, as rodadas caíram 75% e o custo passou de **US$ 5,76 para US$ 4,27**, redução de 26%. O projeto privado tinha cerca de 250 arquivos em TypeScript, C# e Python.

As tarefas avaliavam localização de código e explicação de fluxos, com ferramentas somente de leitura. A avaliação automática conferia se as respostas citavam os símbolos e arquivos esperados, uma checagem limitada de acerto. O resultado se aplica a esse conjunto de consultas; implementar e validar uma funcionalidade inteira exigiria outro teste. A ferramenta também infere relações de chamadas sem um compilador e atribui níveis de confiança a elas. Ao experimentar, compare custo, tempo e precisão nas perguntas do seu próprio projeto.

Fontes: [apresentação do Codedict](https://www.tabnews.com.br/Marqueos/como-cortei-63-por-cento-dos-tokens-do-claude-code-indexando-o-projeto-sem-ia), [funcionamento e limites](https://github.com/Marqueos/codedict) e [metodologia do benchmark](https://github.com/Marqueos/codedict/blob/main/BENCHMARK.md).

## Destaques rápidos para hoje.

- **Trigger.dev confirma acesso indevido a variáveis de ambiente.** Em comunicado de **1º de novembro**, a plataforma de tarefas em segundo plano informou que um atacante acessou essas variáveis em parte das organizações. A empresa diz ter bloqueado a exploração e enviado instruções aos responsáveis pelas contas afetadas. O aviso público ainda não quantifica o alcance nem detalha a causa. Como variáveis de ambiente podem guardar credenciais, confira a comunicação recebida e siga as medidas de mitigação indicadas para sua organização. Fontes: [comunicado do Trigger.dev](https://trigger.dev/blog/security-incident-nov-2026) e [registro do incidente](https://status.trigger.dev/incident/1110434?mp=true).

- **Linux 7.4 chega ao primeiro candidato; a série 7.2 encerra seu ciclo no projeto original.** O kernel.org registra o **7.4-rc1 em 1º de novembro**, ainda em fase de testes, e marca o **7.2.15**, da mesma data, como fim de vida. A versão estável mais recente listada é a 7.3.1. Quem usa os pacotes de uma distribuição deve conferir o suporte e as atualizações oferecidos por ela. O fim de vida anunciado pelo projeto original do kernel e o período de suporte da distribuição são informações distintas. Fonte: [quadro oficial de versões do Linux](https://www.kernel.org/).

- **Trinity R14.1.7 muda o tratamento de texto colado no Konsole.** Lançado em **1º de novembro**, o ambiente gráfico adiciona *bracketed paste*, protocolo que sinaliza ao programa no terminal o início e o fim de uma colagem. As notas destacam a mudança prática: colagens de múltiplas linhas passam a esperar Enter. Também chegam melhorias no relato de eventos do mouse e correções de rolagem. Fonte: [notas oficiais do Trinity](https://www.trinitydesktop.org/newsentry.php?entry=2026.11.01).

- **Lemire reduz a cadeia de instruções de certas divisões inteiras.** Em análise de **31 de outubro**, Daniel Lemire usa multiplicação de 64 bits para simplificar a divisão de inteiros com sinal de 32 bits por algumas constantes. Os testes desativam vetorização automática: a latência melhora em vários casos, enquanto a taxa de operações no Intel melhora com Clang e fica igual com GCC. Para o divisor 1000, a alternativa piora a latência no Apple M4. É um exemplo de otimização que pede medição no compilador e no processador usados. Fonte: [explicação, código e medições de Lemire](https://lemire.me/blog/2026/10/31/beating-the-compiler-at-signed-32-bit-division/).

- **GEFS ganha ferramentas de criação no OpenBSD e segue experimental.** Na atualização de **31 de outubro**, Ori Bernstein relata correções e ferramentas que já permitem criar esse sistema de arquivos no OpenBSD. O protocolo de consistência segue como a maior peça ausente: ele precisa ordenar gravações para que os metadados não anunciem um estado antes de os blocos correspondentes chegarem ao disco. O porte é experimental, com perda de dados esperada em situações de erro. Fonte: [mensagem do desenvolvedor na lista openbsd-tech](https://marc.info/?l=openbsd-tech&m=179346643071941&w=2).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 30295
source_urls:
  - https://blog.gitea.com/release-of-28.3.0/
  - https://github.com/go-gitea/gitea/pull/40099
  - https://github.com/go-gitea/gitea/pull/40121
  - https://github.com/deepseek-ai/dsh-superagent-prototype
  - https://github.com/deepseek-ai/dsh-superagent-prototype/commit/6337fc823ce20251c8de8085948165c81aaa701e
  - https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/001-domain.md
  - https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/002-authorization.md
  - https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/003-execution.md
  - https://www.tabnews.com.br/katiabelokon/cache-busting-com-v-como-uma-url-nova-prendeu-a-versao-antiga-por-ate-um-ano
  - https://www.rfc-editor.org/rfc/rfc8246.html
  - https://www.tabnews.com.br/Marqueos/como-cortei-63-por-cento-dos-tokens-do-claude-code-indexando-o-projeto-sem-ia
  - https://github.com/Marqueos/codedict
  - https://github.com/Marqueos/codedict/blob/main/BENCHMARK.md
  - https://trigger.dev/blog/security-incident-nov-2026
  - https://status.trigger.dev/incident/1110434?mp=true
  - https://www.kernel.org/
  - https://www.trinitydesktop.org/newsentry.php?entry=2026.11.01
  - https://lemire.me/blog/2026/10/31/beating-the-compiler-at-signed-32-bit-division/
  - https://marc.info/?l=openbsd-tech&m=179346643071941&w=2
-->
