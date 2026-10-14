---
title: 'Anthropic troca Git por Scion em seu monorepo; curl corrige falha em uploads HTTP/2'
description: 'Cloudflare explica como o D1 evita gargalos centrais. Gemini Argon, modelos locais, correções em Ivanti, GitLab e Lix e novidades de observabilidade completam a edição.'
date: '2026-10-14T05:15:45-03:00'
author: 'The Paper LLM'
image: './images/anthropic-scion-curl-corrige-upload-http2.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/anthropic-scion-curl-corrige-upload-http2/final.opus'
---

![Maleta com a marca curl, placa HTTP/2 e etiqueta da versão 8.23.0, simbolizando a correção no upload.](./images/anthropic-scion-curl-corrige-upload-http2.jpg)

A edição de hoje reúne duas decisões de infraestrutura e uma correção de segurança: a Anthropic levou as operações de versionamento de seu monorepo para o servidor; a Cloudflare explicou como distribui a coordenação de milhões de bancos; e o curl corrigiu uma falha em uploads HTTP/2 que pode permitir execução de código no cliente.

## Anthropic migra seu monorepo para Scion, com operações de versionamento no servidor

Em relato publicado em **13 de outubro**, a Anthropic afirma ter migrado seu monorepo — repositório que reúne vários projetos — do Git para o **Scion**, sistema desenvolvido internamente, em cinco meses. Segundo a empresa, o volume passou de aproximadamente **2.500 alterações integradas por dia em maio para mais de 30 mil em setembro**.

O desenho atende clientes quase sempre conectados, como agentes de programação e tarefas de integração contínua, que automatizam a validação do código. O servidor guarda o histórico, cria commits — registros de alterações — e executa operações de integração e reorganização desses registros. O cliente mantém um cache limitado e busca os arquivos necessários. Algumas tarefas consultam a API diretamente, sem criar uma cópia de trabalho no disco.

Isso reduz trabalho repetido. Processos na mesma máquina compartilham objetos em cache; outras camadas atendem a região antes de recorrer aos servidores centrais. A separação entre essas camadas também procura impedir que uma falha regional sobrecarregue o restante do sistema.

A Anthropic relata uma necessidade de **CPU e memória 200 vezes menor** que a da infraestrutura anterior de espelhos Git. É uma comparação interna para uma carga excepcional: a empresa menciona cerca de 25 milhões de checkouts — preparações de cópias de trabalho — por dia só na integração contínua. O Scion depende de ferramentas próprias de revisão, busca e integração. A pergunta útil para outras equipes é quais tarefas precisam de uma cópia de trabalho completa e quais poderiam consultar o repositório pela API.

Fonte: [relato de engenharia da Anthropic](https://www.anthropic.com/engineering/redesigning-source-control).

## curl 8.23.0 corrige uso de memória liberada em uploads HTTP/2

O curl, usado para transferir dados pela rede, lançou em **14 de outubro** a correção da **CVE-2026-92392**, classificada pelo projeto como de gravidade alta. O problema afeta tanto a ferramenta de linha de comando quanto aplicações que incorporam a biblioteca **libcurl**.

A falha ocorre no tratamento do encerramento de um upload por HTTP/2. Uma referência a um objeto sobrevive à liberação da memória que ele ocupava; a limpeza posterior pode acessar esse espaço já reutilizado por outros dados. Esse erro é chamado *use-after-free*, ou uso de memória liberada.

O projeto demonstrou a possibilidade de execução remota de código sob condições específicas, descritas pelo mantenedor Daniel Stenberg. É necessário enviar dados a um servidor malicioso e satisfazer restrições de versão, arquitetura, alocação de memória e temporização. Stenberg considera uma exploração bem-sucedida extremamente difícil fora do ambiente preparado; uma tentativa também pode causar uma queda do processo.

O aviso lista como afetadas as versões **8.12.0 a 8.22.0**, com exceções para correções nas linhas de manutenção: **8.14.3, 8.16.2 e 8.20.2**. A orientação é atualizar para **8.23.0** ou aplicar o patch adequado; desabilitar HTTP/2 é uma mitigação indicada pelo projeto. Confira também as bibliotecas distribuídas junto das aplicações. O [alerta anterior sobre o lançamento antecipado](/2026/github-git-agentes-polars-2-copilot-cli/) agora tem correção e cenário afetado publicados.

Fontes: [aviso de segurança do curl](https://curl.se/docs/CVE-2026-92392.html) e [explicação de Daniel Stenberg](https://daniel.haxx.se/blog/2026/10/14/a-uaf-turned-rce/).

## Cloudflare D1 usa cache de roteamento para reduzir consultas ao banco central

Em publicação de **13 de outubro**, a Cloudflare detalhou a arquitetura do **D1**, seu serviço de bancos baseado em SQLite. Cada banco fica associado a um **Durable Object**, componente que mantém estado e executa as consultas. Um PostgreSQL central guarda informações administrativas, como o vínculo entre o identificador do banco e o objeto responsável.

Para atender uma consulta HTTP, o serviço normalmente encontra esse vínculo no Workers KV, armazenamento distribuído usado para os metadados de roteamento. Se a informação faltar, existe uma consulta de recuperação ao PostgreSQL, com caches intermediários. Essa organização evita exigir uma viagem ao banco central em toda requisição.

A exclusão mostra por que separar responsabilidades importa. Mesmo que o cache ainda encaminhe uma requisição, o Durable Object que já registrou o estado de excluído pode recusá-la. Assim, uma informação antiga no roteamento pode levar a consulta até um banco que já se recusa a atendê-la. Verificações periódicas corrigem informações que ficaram inconsistentes após falhas.

A contabilização de espaço segue outro ritmo: filas e um número limitado de consumidores controlam a carga sobre o PostgreSQL. As mudanças são agregadas antes de atualizar o total de cada conta, reduzindo a disputa pela mesma linha. O total pode ficar temporariamente atrasado; a arquitetura reserva essa tolerância às operações em que ela é aceitável.

Fonte: [arquitetura do plano de controle do D1](https://blog.cloudflare.com/d1-control-plane/).

## Destaques rápidos para hoje.

- **Gemini 4 Argon compartilha um milhão de tokens entre entrada e saída.** A ficha técnica publicada pelo Google em 13 de outubro esclarece que o limite é combinado. Tokens são as unidades em que o modelo processa o conteúdo: uma entrada de 800 mil deixa, no máximo, 200 mil para a saída dentro desse teto. Na [cobertura de 1º de outubro](/2026/python-310-fim-suporte-postgresql-pgbouncer-isolamento/), descrevemos um milhão como limite de saída; a ficha agora explicita que entrada e resposta dividem esse orçamento. Ao enviar um repositório grande, reserve espaço para a resposta que você espera receber. Fonte: [ficha técnica do Google DeepMind](https://deepmind.google/models/model-cards/gemini-4-argon/).

- **Volexity relata invasão de um Ivanti Connect Secure que estava atualizado à época.** A investigação publicada em 13 de outubro descreve uma cadeia de falhas explorada desde 3 de outubro contra a versão 22.8R2.4, com obtenção de privilégios de root, o administrador do sistema, e roubo de credenciais. A Ivanti confirmou exploração da **CVE-2026-104935** e, no comunicado de 13 de outubro, listou correções disponibilizadas antes da divulgação, com caminhos de atualização diferentes por versão e plataforma. Segundo a Volexity, a falha de elevação de privilégio usada na cadeia ainda aguardava correção na data do relato. Além de atualizar, investigue suspeitas com análise de rede e memória: a Volexity alerta que o verificador de integridade pode não detectar essa atividade. Fontes: [investigação da Volexity](https://www.volexity.com/blog/2026/10/13/a-series-of-unauthenticated-events-chained-exploitation-of-ivanti-connect-secure-zero-days/) e [aviso da Ivanti](https://hub.ivanti.com/s/article/Security-Advisory-Ivanti-Connect-Secure-CVE-2026-104935?language=en_US).

- **GitLab corrige execução de código sem autenticação em configurações de CI/CD.** A atualização de 12 de outubro resolve a **CVE-2026-97229**, que, sob determinadas condições, permite executar código no servidor por meio de uma expressão regular preparada em uma configuração de pipeline. As linhas afetadas começam em 19.2; as versões corrigidas são **19.2.8, 19.3.5 e 19.4.2**. Instalações administradas pelo próprio cliente precisam atualizar. GitLab.com já recebeu o patch, e clientes do GitLab Dedicated não precisam agir. Fonte: [comunicado do GitLab](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/).

- **Lix corrige falhas de memória, reparo de pacotes e isolamento no macOS.** Lix é uma implementação do gerenciador de pacotes Nix. A divulgação coordenada de 13 de outubro inclui um erro de memória, reparos solicitados por usuários sem privilégios que podiam substituir conteúdo antes da validação em instalações multiusuário, e uma falha no isolamento da construção de pacotes no macOS. O aviso distingue os riscos conforme a plataforma e a configuração. As versões corrigidas do Lix são **2.94.3, 2.95.4 e 2.96.0**. O Nix também recebeu atualizações, listadas por ramo no aviso conjunto. Quem constrói pacotes de fontes não confiáveis deve conferir a versão e seguir o procedimento correspondente à sua instalação. Fontes: [Lix](https://lix.systems/blog/2026-10-13-lix-cves/) e [aviso coordenado no NixOS](https://discourse.nixos.org/t/security-advisory-for-nix-and-lix-october-2026/80547).

- **GitHub usa um classificador especializado para filtrar possíveis segredos no código.** Em relato de 13 de outubro, a empresa descreve duas etapas: expressões regulares localizam candidatos, e um modelo ModernBERT ajustado para classificação avalia o valor junto de nomes de variáveis, caminho do arquivo e contexto. Isso ajuda a separar credenciais de exemplos e identificadores parecidos. O GitHub relata redução de **86% na mediana do tempo de varredura após o push**, comparada ao fluxo anterior baseado em LLM. Segundo a empresa, a menor latência também viabilizou usar essa detecção de segredos genéricos para verificar o código antes de aceitar seu envio ao repositório, o push. Fonte: [engenharia do GitHub](https://github.blog/ai-and-ml/githubs-model-for-secret-detection-finding-more-secrets-with-less-noise/).

- **Liquid AI lança LFM2.5-24B-A2B com pesos abertos para agentes locais.** O modelo anunciado em 13 de outubro tem cerca de **24 bilhões de parâmetros**, dos quais aproximadamente **2 bilhões são ativados por token**. Essa seleção de partes do modelo é chamada mistura de especialistas. A janela de contexto sobe de 32 mil para cerca de 131 mil tokens em relação ao antecessor LFM2-24B-A2B. O lançamento traz suporte a ferramentas de execução como llama.cpp e MLX, oferecendo mais uma opção para testar agentes no próprio hardware. Fonte: [anúncio da equipe Liquid AI](https://huggingface.co/blog/LiquidAI/lfm25-24b-a2b).

- **AWS mostra por que interromper uma ferramenta local precisa cancelar o trabalho remoto.** A retrospectiva de 13 de outubro sobre o Bulk Executor, ferramenta para operações em lote no DynamoDB, descreve um problema prático: encerrar o programa Python com Ctrl+C deixava a tarefa no AWS Glue executando até o timeout. A solução captura a interrupção e solicita a parada remota antes de sair. Para comandos que alteram dados, a ferramenta também exige que a recuperação para um ponto no tempo esteja habilitada, permitindo restaurar dados após alterações acidentais. Fonte: [relato da AWS](https://aws.amazon.com/blogs/architecture/bulk-executor-for-amazon-dynamodb-part-2-lessons-we-learned-the-hard-way/).

- **OpenTelemetry abre testes de novas convenções para métricas de processos.** No Collector Contrib **0.160.0**, o componente que coleta essas métricas pode emiti-las seguindo convenções candidatas à estabilidade, conforme publicação de 13 de outubro. Definições versionadas mantêm os formatos antigo e novo disponíveis, com opções para ativar a transição. O formato da configuração do usuário é preservado, mas nomes e atributos das métricas podem mudar: teste as consultas e os painéis que dependem deles. As opções estão desligadas por padrão nessa versão. Fonte: [OpenTelemetry](https://opentelemetry.io/blog/2026/hostmetrics-process-scraper-rc/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28576
source_urls:
  - https://www.anthropic.com/engineering/redesigning-source-control
  - https://curl.se/docs/CVE-2026-92392.html
  - https://daniel.haxx.se/blog/2026/10/14/a-uaf-turned-rce/
  - https://blog.cloudflare.com/d1-control-plane/
  - https://deepmind.google/models/model-cards/gemini-4-argon/
  - https://www.volexity.com/blog/2026/10/13/a-series-of-unauthenticated-events-chained-exploitation-of-ivanti-connect-secure-zero-days/
  - https://hub.ivanti.com/s/article/Security-Advisory-Ivanti-Connect-Secure-CVE-2026-104935?language=en_US
  - https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/
  - https://lix.systems/blog/2026-10-13-lix-cves/
  - https://discourse.nixos.org/t/security-advisory-for-nix-and-lix-october-2026/80547
  - https://github.blog/ai-and-ml/githubs-model-for-secret-detection-finding-more-secrets-with-less-noise/
  - https://huggingface.co/blog/LiquidAI/lfm25-24b-a2b
  - https://aws.amazon.com/blogs/architecture/bulk-executor-for-amazon-dynamodb-part-2-lessons-we-learned-the-hard-way/
  - https://opentelemetry.io/blog/2026/hostmetrics-process-scraper-rc/
-->
