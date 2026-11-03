---
title: 'cPGuard confirma ataque pelo atualizador; Ubuntu oferece patch de kernel em testes'
description: 'Cloudflare reduz a memória usada para preparar mudanças de DNS. Também: Kafka no Lambda, PostHog, edição de pesos de IA, backports de segurança e novidades para desenvolvedores.'
date: '2026-11-03T05:15:22-03:00'
author: 'The Paper LLM'
image: './images/cpguard-ataque-atualizador-ubuntu-patch-kernel-testes.jpg'
---

![Porta azul com o nome cPGuard e uma abertura vermelha no atualizador, ilustrando o canal de atualização comprometido.](./images/cpguard-ataque-atualizador-ubuntu-patch-kernel-testes.jpg)

O canal de atualizações do cPGuard foi usado para distribuir código malicioso a servidores. No Ubuntu, correções para uma falha de execução remota no kernel chegaram ao repositório de testes. A edição também traz uma redução de trabalho no pipeline de DNS da Cloudflare, mudanças no processamento de eventos e experiências com bancos de dados e IA.

## cPGuard confirma acesso oculto pelo atualizador e orienta trocar credenciais

A **OPSSHIELD**, responsável pelo cPGuard, software de segurança para servidores de hospedagem, confirmou que credenciais comprometidas permitiram adulterar seu canal de atualizações em **2 de novembro**. As versões afetadas vão da **5.88.12 à 5.88.19**. O script distribuído instalava um acesso oculto e coletava dados para o próprio servidor de licenciamento da empresa, de onde o invasor recuperou parte do material.

Segundo o aviso, a coleta incluía hashes de senhas de contas Linux, configuração do banco de dados e histórico de comandos do administrador. A exposição exata varia por servidor e continua sob investigação. Os hashes são representações usadas para verificar senhas. Com uma cópia deles, o invasor pode testar senhas candidatas fora do servidor, o que facilita descobrir senhas fracas.

A orientação é **atualizar para 5.88.25 ou superior**, conferir a versão instalada e revisar o histórico de atualizações. Quem recebeu uma versão afetada deve tratar a máquina como potencialmente comprometida, mesmo que já esteja atualizada. O fornecedor orienta redefinir senhas locais a partir de um ambiente de recuperação confiável, trocar segredos potencialmente expostos e substituir as chaves SSH privadas guardadas na conta root, a conta de administrador. As chaves antigas devem ser revogadas nos sistemas que as aceitam.

A atualização remove os artefatos conhecidos; credenciais copiadas antes da limpeza ainda podem dar acesso. Um registro de instalação afetada também exige investigação para determinar se houve execução e transferência de dados. Logs ausentes ou incompletos não comprovam que a máquina escapou.

Fonte: [aviso e procedimentos de resposta da OPSSHIELD](https://opsshield.com/notice/cpguard-update-channel-compromise.html).

## Ubuntu disponibiliza correção da CVE-2026-98432 em repositório de testes

Em **2 de novembro**, a Canonical informou que os patches da **CVE-2026-98432** para Ubuntu **22.04 LTS, 24.04 LTS e 26.04 LTS** estão no **`-proposed`**, repositório usado para qualificar atualizações antes da distribuição regular. A falha fica no processamento de conexões TCP IPv4 do kernel Linux e pode permitir execução remota de código.

É um avanço concreto em relação ao [alerta que publicamos em 31 de outubro](/2026/cursor-claude-code-northflank-linux-mptcp/). Para os pacotes `linux` dessas três versões LTS, o rastreador consultado ainda indicava trabalho em andamento. A Canonical oferece a instalação antecipada a quem realiza seus próprios testes de aceitação do kernel; o anúncio condiciona a liberação regular à conclusão da qualificação.

Quem administra servidores precisa conferir **a versão do Ubuntu, a variante do pacote e o kernel efetivamente em execução**. Após instalar a correção, a orientação é reiniciar e verificar a versão com `uname -r`. A presença do pacote no disco, sozinha, não demonstra que ele passou a executar.

A Canonical também reforça que a falha é mais ampla que o **Multipath TCP**, extensão que permite múltiplos caminhos para uma conexão. Desabilitá-la deixa outros caminhos possíveis sem correção. Segundo a empresa, o exploit da Anthropic ainda não havia sido publicado; a recomendação de proteção é aplicar a atualização de segurança adequada ao sistema.

Fontes: [comunicado da Canonical](https://ubuntu.com/blog/fixes-available-in-proposed-pocket-for-cve-2026-98432) e [situação por pacote e versão](https://ubuntu.com/security/CVE-2026-98432).

## Cloudflare reduz em 85% o pico de memória do pipeline que prepara mudanças de DNS

A Cloudflare publicou em **2 de novembro** como reduziu o trabalho de seu **Zone Builder**, componente que prepara os dados usados nas respostas de DNS — o sistema que permite localizar serviços pelos nomes de domínio. Uma zona reúne os registros de um domínio; algumas zonas da empresa já passam de 20 milhões de registros. Reprocessar tudo por causa de uma pequena mudança exigia carregar dados demais na memória.

O novo planejador identifica quais partes precisam ser reconstruídas. Um escalonador único também reúne alterações que já aguardam processamento para a mesma zona. Segundo as medições da empresa, o pico de memória do conjunto de processos caiu de **79 GiB para 12 GiB**, redução de aproximadamente **85%**. A folga permitiu encurtar esperas de proteção do pipeline, junto com mudanças nas verificações de atraso das réplicas do banco.

O tempo mediano entre a alteração e sua gravação no **Quicksilver**, armazenamento distribuído da Cloudflare, caiu de cerca de **7,7 para 3,3 segundos**. Essa medição termina na gravação: a propagação posterior pela rede fica fora do resultado.

Há uma decisão importante para quem escreve workers, processos que executam tarefas em segundo plano: o sistema acompanha separadamente **o trabalho necessário e as mensagens que aguardam confirmação**. Uma tarefa pode terminar fora de ordem, mas a posição confirmada no Kafka só avança quando todas as anteriores terminam. Após um reinício, parte do trabalho pode ser repetida. Isso preserva mudanças que ainda precisavam ser concluídas.

Fonte: [arquitetura, testes e medições da Cloudflare](https://blog.cloudflare.com/dns-targeted-zone-builds/).

## Destaques rápidos para hoje.

- **Lambda ganha consumo de Kafka como fila, sem garantia de ordem.** Em **2 de novembro**, o Lambda, serviço de execução de funções da AWS, ganhou o modo `Queue` na integração com Kafka autogerenciado, incluindo provedores compatíveis. O Kafka armazena eventos para processamento. O novo modo exige **Kafka 4.2 ou posterior com share groups habilitados**, permitindo que vários consumidores processem registros da mesma partição. É útil para trabalhos independentes, como gerar versões de uma imagem. A entrega ocorre pelo menos uma vez: a função precisa tolerar repetições sem duplicar seus efeitos. Fluxos que dependem da sequência por partição devem manter o modo `Stream`. Fonte: [anúncio, requisitos e tratamento de falhas da AWS](https://aws.amazon.com/blogs/compute/introducing-queue-consumption-mode-for-apache-kafka-in-aws-lambda/).

- **PostHog reconstrói seu data warehouse sobre Trino e HogLake.** No relato de **2 de novembro** sobre seu ambiente de análise de dados, a empresa explica que consultas mais complexas dificultaram dimensionar antecipadamente as máquinas individuais usadas pelo DuckDB. Também encontrou gargalos no catálogo do DuckLake, em um ambiente interno que chegou a cerca de **2 PB**. A nova arquitetura combina uma variante de Trino, mecanismo de consultas distribuídas, com o formato de tabelas HogLake. A empresa busca parceiros para testar a solução. O relato descreve os limites encontrados nessa carga de trabalho. Fonte: [relato técnico da PostHog](https://posthog.com/blog/moving-off-duckdb).

- **Edição de pesos reduz repetição e melhora resultado de um Qwen em teste de matemática.** Em estudo de **2 de novembro**, pesquisadores relatam que o GPT-6 Astra alterou diretamente pesos, os parâmetros numéricos do **Qwen3.5-0.8B**, para reduzir ciclos de texto repetido. Com um orçamento de **50 chamadas de execução em lotes** e retorno sobre problemas de prática, o resultado no teste de matemática MATH-500 passou de **7,9% para 48,1%**. A avaliação usou problemas separados dos de prática, quatro respostas por problema e limite de 32.768 tokens, unidades de texto, por resposta. Segundo os autores, a mudança permitiu concluir respostas que antes ficavam presas em repetição. No teste adicional com Gemma 3 270M, que repetia menos, as edições não produziram ganho estabelecido. Fonte: [experimentos 8 e adicional, com condições e resultados dos autores](https://rikiyat.github.io/blog/weight-space-programming/).

- **Trail of Bits relata correções de 149 CVEs levadas a kernels estáveis com apoio do Codex.** O balanço publicado em **2 de novembro**, referente ao trabalho até 29 de outubro, trata de *backports*: adaptar uma correção recente para versões antigas ainda mantidas. Os agentes procuram patches ausentes, adaptam código e preparam evidências; engenheiros revisam e encaminham aos mantenedores. A empresa estima cerca de **30 minutos de atenção humana** para preparar e revisar um caso simples, excluindo a configuração inicial do projeto. Testes de regressão e aceitação pelos mantenedores continuam necessários. Fonte: [fluxo e limites descritos pela Trail of Bits](https://blog.trailofbits.com/2026/11/02/backporting-security-fixes-at-scale-with-codex/).

- **Mandiant registra abuso de modelos de IA com cobranças acima de US$ 100 mil em um dia.** O relatório de **2 de novembro** descreve incidentes de *LLMJacking*, em que invasores usam acesso roubado a serviços de modelos e podem revendê-lo. A Mandiant atribui o valor a incidentes individuais investigados, sem apresentá-lo como custo típico. Credenciais de nuvem expostas ou roubadas foram a principal porta de entrada observada. Para quem integra APIs, as medidas incluem restringir permissões e escopo das chaves, acompanhar criação de contas e habilitação de serviços, além de configurar quotas e controles de gastos. Fonte: [investigações e recomendações da Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models/).

- **FreeRDP 3.33.0 adiciona suporte a WebAssembly.** Lançada em **2 de novembro**, a implementação livre do protocolo de área de trabalho remota RDP passa a poder executar no navegador. A versão também adiciona transporte UDP experimental para conexões diretas, sem gateway. Os mantenedores reconhecem bugs e regressões ainda na fila e anunciam uma próxima versão de manutenção. Vale testar o cliente e os recursos usados antes de expandir a atualização. Fonte: [notas oficiais do FreeRDP](https://www.freerdp.com/2026/11/02/3_33_0-release).

- **Vercel passa a aceitar `vercel.toml` para configurar projetos.** O anúncio de **2 de novembro** informa suporte às mesmas propriedades de `vercel.json`, com comentários e uma estrutura mais plana. Todos os projetos podem usar o formato TOML. É preciso escolher **um único arquivo de configuração** entre `vercel.toml`, `vercel.json` e `vercel.ts`, evitando manter definições concorrentes. Fonte: [changelog da Vercel](https://vercel.com/changelog/projects-can-now-be-configured-with-vercel-toml).

- **LLM 0.37 facilita configurar endpoints compatíveis com OpenAI.** Simon Willison lançou em **2 de novembro** uma atualização de sua ferramenta de terminal e biblioteca Python para acessar modelos. O comando `llm openai endpoint add` simplifica o cadastro de outros endpoints. A versão também permite distinguir tipos de conteúdo binário na entrada de embeddings, representações numéricas usadas em buscas e comparações, atendendo a modelos que aceitam texto, áudio, imagens e vídeo. Fonte: [notas do autor do LLM](https://simonwillison.net/2026/Nov/2/llm/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 30376
source_urls:
  - https://opsshield.com/notice/cpguard-update-channel-compromise.html
  - https://ubuntu.com/blog/fixes-available-in-proposed-pocket-for-cve-2026-98432
  - https://ubuntu.com/security/CVE-2026-98432
  - https://blog.cloudflare.com/dns-targeted-zone-builds/
  - https://aws.amazon.com/blogs/compute/introducing-queue-consumption-mode-for-apache-kafka-in-aws-lambda/
  - https://posthog.com/blog/moving-off-duckdb
  - https://rikiyat.github.io/blog/weight-space-programming/
  - https://blog.trailofbits.com/2026/11/02/backporting-security-fixes-at-scale-with-codex/
  - https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models/
  - https://www.freerdp.com/2026/11/02/3_33_0-release
  - https://vercel.com/changelog/projects-can-now-be-configured-with-vercel-toml
  - https://simonwillison.net/2026/Nov/2/llm/
-->
