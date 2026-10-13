---
title: 'Teste em Go mostra como o uso do pool quebra o isolamento entre clientes no PostgreSQL'
description: 'AWS lança Lambda Web Functions para servidores HTTP; pesquisador detalha falha corrigida no Google DevSite. Docker Hub, ditado local no Ubuntu e desempenho de Python e IA completam a edição.'
date: '2026-10-13T05:15:24-03:00'
author: 'The Paper LLM'
image: './images/postgres-pool-go-lambda-web-functions-cookie-google.jpg'
---

![Cartaz com o elefante do PostgreSQL questiona a troca de clientes no pool em Go durante um teste de isolamento.](./images/postgres-pool-go-lambda-web-functions-cookie-google.jpg)

Ao reutilizar conexões com o banco, a aplicação precisa manter a identificação do cliente junto das consultas que ele pode fazer. Um experimento com Go mostra o que acontece quando essas operações se separam. A edição também traz um cookie que expunha a própria chave de assinatura no Google DevSite e o lançamento do Lambda Web Functions para aplicações HTTP.

## Chamadas separadas ao pool em Go comprometem isolamento por cliente em teste

Chris van Eijk, da Now-Next, publicou em **13 de outubro** testes com pgx, biblioteca de acesso ao PostgreSQL em Go. A aplicação usava segurança por linha, ou **RLS**: uma política do banco filtrava as faturas conforme o cliente — o *tenant* — identificado em uma variável da conexão.

Um **pool** mantém conexões disponíveis para reutilização. No código testado, uma chamada ao pool definia o cliente e devolvia a conexão; outra pegava uma conexão para consultar as faturas. Cada chamada podia receber uma diferente, ainda com a identificação deixada por outra requisição. Com **30 requisições simultâneas**, aproximadamente metade das requisições com cliente definido contou as faturas do outro cliente, segundo o autor. O experimento usou pgx 5.11.0, PostgreSQL 17.11 e uma tabela de 30 linhas.

O estudo amplia o [teste com PgBouncer que cobrimos em 1º de outubro](/2026/python-310-fim-suporte-postgresql-pgbouncer-isolamento/). Agora, compara também rotinas que preparam e limpam a conexão ao retirá-la do pool e devolvê-la. Elas funcionaram no acesso direto ao banco, mas falharam com o PgBouncer em modo de agrupamento por transação: nesse modo, a preparação, a consulta e a limpeza podiam chegar a conexões diferentes no PostgreSQL.

O padrão que funcionou foi abrir uma transação, definir o cliente como primeira operação — com validade limitada àquela transação — e executar **todas as consultas pelo objeto dessa transação**. Nesse desenho, uma requisição sem cliente também precisa definir explicitamente um valor vazio, com uma política que negue acesso nesse caso. Pular essa etapa pode recuperar uma identificação antiga. O teste mostra por que vale verificar concorrência e conexões com estado residual; a aplicação continua responsável por escolher uma identidade autorizada.

Fontes: [testes com Go e pgx](https://now-next.nl/en/insights/go-pgx-postgresql-row-level-security-tenant/), [síntese da investigação](https://now-next.nl/en/insights/postgresql-row-level-security-multi-tenant-saas/) e [semântica de SET LOCAL no PostgreSQL](https://www.postgresql.org/docs/17/sql-set.html).

## Pesquisador relata execução de código no Google DevSite por cookie que expunha a própria chave

Simon Koeck divulgou em **12 de outubro** uma falha no DevSite, plataforma usada por sites de documentação do Google. Segundo seu relato, um cookie de sessão carregava um objeto do fluxo de autorização OAuth com um segredo. Esse mesmo segredo assinava o cookie. Quem o recebesse podia extrair a chave e produzir uma sessão alterada que o servidor aceitava.

Nas sessões padrão do Flask, framework Python usado nesse caso, o conteúdo do cookie é legível para quem o recebe. A assinatura permite detectar alterações enquanto a chave permanece secreta. No DevSite, havia mais uma etapa: a aplicação reconstruía o objeto recebido usando **pickle**, formato do Python cuja desserialização — a reconstrução de objetos a partir dos dados — pode executar código. A chave exposta permitia entregar conteúdo alterado a essa operação.

Koeck relata ter demonstrado a execução por atrasos controlados na resposta, acompanhados de testes de validação da assinatura. Sua cronologia registra o envio do relatório em **6 de agosto**, uma recompensa de **US$ 90 mil** e a correção em **7 de outubro**. As informações sobre o incidente e sua resolução vêm do pesquisador; as documentações do Flask e do Python corroboram os mecanismos envolvidos.

Para revisar um sistema semelhante, mantenha segredos no servidor, use chaves distintas para funções distintas e prefira formatos que representem apenas dados ao receber conteúdo do cliente. A segurança dessa fronteira depende tanto da proteção da chave quanto do que a aplicação faz depois de validar a assinatura.

Fontes: [relato de Simon Koeck](https://simonkoeck.com/writeups/google-devsite-flask-session-pickle-rce), [sessões no Flask](https://flask.palletsprojects.com/en/stable/quickstart/#sessions) e [alerta de segurança do pickle](https://docs.python.org/3/library/pickle.html).

## Lambda Web Functions recebe servidores HTTP em Node.js, com até 128 requisições simultâneas por ambiente

A AWS anunciou em **12 de outubro** o Lambda Web Functions. O novo formato executa aplicações de frameworks como Express, Hono, Fastify e Next.js no modelo habitual de servidor web: o código escuta no endereço e na porta informados pelo ambiente e atende requisições HTTP. A AWS gerencia a expansão da capacidade.

Cada ambiente de execução aceita **até 128 requisições simultâneas**. A cobrança separa CPU ativa de memória: esperar uma consulta ao banco consome pouca CPU, mas a memória permanece sendo medida durante a vida do ambiente. A economia depende da carga e do uso dos recursos. Como várias requisições compartilham o ambiente, vale revisar variáveis mutáveis compartilhadas e quantas conexões com o banco a aplicação pode abrir.

O lançamento oferece revisões imutáveis do código, divisão de tráfego entre versões e implantação em múltiplas regiões. O suporte inicial é a **Node.js 24 em Arm64**, em Virgínia do Norte, Ohio, Oregon, Tóquio e Irlanda. São Paulo fica fora dessa lista inicial. As funções orientadas a eventos continuam disponíveis com o nome Lambda Event Functions.

Fonte: [anúncio da AWS](https://aws.amazon.com/blogs/aws/announcing-aws-lambda-web-functions-for-fast-consistent-web-app-performance-anywhere/).

## Destaques rápidos para hoje.

- **Docker Hub detalha falha corrigida na transferência de tokens de acesso.** O comunicado de 12 de outubro sobre a **CVE-2026-105445** explica que converter uma conta pessoal em organização podia transferir tokens para outro usuário sem seu consentimento e sem trocar o segredo desses tokens. Quem já possuía o segredo podia agir no registro de imagens como o novo titular, dentro das permissões do token. A Docker corrigiu o fluxo em 30 de setembro e diz não ter encontrado evidência de exploração. A empresa desativou os tokens afetados em 8 de outubro, com exceções solicitadas pelos titulares; quem recebeu o aviso de 2 de outubro deve conferir os tokens indicados. Fonte: [Docker](https://www.docker.com/blog/docker-hub-security-advisory-cve-2026-105445/).

- **Anthropic explica cobrança de certas requisições bloqueadas por suas defesas.** Em publicação de 12 de outubro, a empresa descreve controles contra a destilação, treinamento de outro modelo a partir das respostas coletadas de um modelo existente. Desde 24 de setembro, voltou a cobrar requisições barradas antes da resposta em áreas nas quais seus classificadores apresentam, segundo a empresa, menos de 0,1% de falsos positivos. A regra inclui destilação. Para quem integra a API, uma chamada bloqueada pode gerar cobrança; a empresa reconhece que pedidos legítimos também podem ser classificados incorretamente. Fonte: [Anthropic](https://www.anthropic.com/research/distillation-defenses).

- **Ubuntu abre testes do Myna, ferramenta de ditado local.** A prévia anunciada em 12 de outubro transcreve a fala no campo de texto da aplicação em uso. Segundo a Canonical, após baixar o modelo, o reconhecimento funciona sem internet e o áudio não é enviado nem armazenado. A disponibilidade inicial cobre Ubuntu 24.04 LTS, 26.04 LTS e 26.10, em amd64 e amd64v3, com GNOME sobre Wayland. É uma versão em desenvolvimento; os motores disponíveis têm diferenças de idiomas, precisão e exigência de hardware. Fonte: [Canonical](https://ubuntu.com/blog/myna-speech-to-text-technology-preview-available).

- **Cloudflare explica como transforma logs antes da exportação.** O relato de 12 de outubro mostra o motor SQL DataFusion incorporado ao Logpush para filtrar registros, remover campos sensíveis e reorganizar dados, evitando uma chamada de rede a outro serviço de processamento. Se a transformação falha, o sistema retém o lote e tenta novamente, sem enviar os dados brutos ao destino. Falhas persistentes podem desativar o trabalho de exportação: quem depende desses registros precisa monitorar também essa interrupção. Fonte: [Cloudflare](https://blog.cloudflare.com/transformers-on-logpush/).

- **Instagram Live migra a entrada de vídeo para Media over QUIC.** A Meta descreveu em 12 de outubro a adoção do protocolo para receber transmissões dos aplicativos iOS e Android. Uma camada na borda da rede traduz os dados para RUSH, o protocolo já usado pelos serviços internos; endereços gerados pelo servidor controlam quais transmissões usam o novo caminho. Segundo a equipe, o resultado inicial foi manter qualidade e confiabilidade equivalentes às anteriores. Essa tradução permite trocar o transporte gradualmente, preservando o restante do processamento. Fonte: [engenharia da Meta](https://engineering.fb.com/2026/10/12/video-engineering/shipping-media-over-quic-at-meta-scale-for-instagram-live-ingest/).

- **curl prepara rotinas mais rápidas e estruturas menores para a versão 8.23.0.** Daniel Stenberg apresentou hoje resultados dos testes de desempenho que orientaram mudanças em conversão de URLs, datas e números. A estrutura criada para cada transferência simultânea caiu de 4.256 para 3.064 bytes. O lançamento está previsto para **14 de outubro**. São ganhos internos; o próprio mantenedor observa que a maioria das transferências terá pouca diferença perceptível. Fonte: [Daniel Stenberg](https://daniel.haxx.se/blog/2026/10/13/a-slightly-faster-slimmer-curl/).

- **Benchmark de Python chega a 65,7 GB/s ao acessar apenas parte dos campos JSON.** Daniel Lemire publicou em 12 de outubro um teste do fastsimdjson 0.6.0 com Python 3.14.6 sem o bloqueio global de threads, em um servidor de **64 núcleos**. Os 7,6 GB de entrada já estavam descompactados na memória, e o resultado é o melhor de sete execuções. A biblioteca analisa os dados e só cria objetos Python para os valores acessados. Essa economia de alocações é relevante quando cada registro contém muitos campos que a aplicação descarta. Fonte: [experimento de Daniel Lemire](https://lemire.me/blog/2026/10/12/parsing-json-at-tens-of-gigabytes-per-second-in-python/).

- **ReplaySSM reduz gravações de estado em modelos híbridos de IA.** Em análise de 12 de outubro, NVIDIA e pesquisadores de Princeton explicam como guardar uma cópia de referência do estado do modelo, chamada checkpoint, junto das entradas recentes. Isso permite calcular a saída a cada token — unidade de texto processada pelo modelo — e atualizar o checkpoint apenas quando esse pequeno conjunto de entradas se completa. Nos testes relatados com quatro modelos híbridos, os ganhos apareceram com lotes maiores de sequências; com uma única sequência, não houve aceleração. A otimização beneficia o cenário medido de atendimento simultâneo de solicitações. Fonte: [análise técnica da NVIDIA](https://developer.nvidia.com/blog/replayssm-rethinking-state-storage-for-faster-hybrid-model-decoding/).

- **Tutorial de kagent mostra agentes de IA criando outros no Kubernetes, com aprovação.** O laboratório publicado pela CNCF em 12 de outubro usa kagent para executar agentes no Kubernetes, com inferência local. Uma lista restrita de ferramentas e permissões do Kubernetes limita as escritas ao tipo de recurso `Agent`; o usuário revisa e aprova o manifesto, arquivo que descreve o agente a criar. É material para estudar no laptop: o roteiro mantém autenticação de desenvolvimento, na qual todos agem como o mesmo usuário, e expõe a interface apenas localmente. Levar esse desenho a um cluster compartilhado exige rever identidade e autorização. Fonte: [tutorial na CNCF](https://www.cncf.io/blog/2026/10/12/from-zero-to-agent-builder-running-kagent-on-your-laptop/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28533
source_urls:
  - https://now-next.nl/en/insights/go-pgx-postgresql-row-level-security-tenant/
  - https://now-next.nl/en/insights/postgresql-row-level-security-multi-tenant-saas/
  - https://www.postgresql.org/docs/17/sql-set.html
  - https://simonkoeck.com/writeups/google-devsite-flask-session-pickle-rce
  - https://flask.palletsprojects.com/en/stable/quickstart/#sessions
  - https://docs.python.org/3/library/pickle.html
  - https://aws.amazon.com/blogs/aws/announcing-aws-lambda-web-functions-for-fast-consistent-web-app-performance-anywhere/
  - https://www.docker.com/blog/docker-hub-security-advisory-cve-2026-105445/
  - https://www.anthropic.com/research/distillation-defenses
  - https://ubuntu.com/blog/myna-speech-to-text-technology-preview-available
  - https://blog.cloudflare.com/transformers-on-logpush/
  - https://engineering.fb.com/2026/10/12/video-engineering/shipping-media-over-quic-at-meta-scale-for-instagram-live-ingest/
  - https://daniel.haxx.se/blog/2026/10/13/a-slightly-faster-slimmer-curl/
  - https://lemire.me/blog/2026/10/12/parsing-json-at-tens-of-gigabytes-per-second-in-python/
  - https://developer.nvidia.com/blog/replayssm-rethinking-state-storage-for-faster-hybrid-model-decoding/
  - https://www.cncf.io/blog/2026/10/12/from-zero-to-agent-builder-running-kagent-on-your-laptop/
-->
