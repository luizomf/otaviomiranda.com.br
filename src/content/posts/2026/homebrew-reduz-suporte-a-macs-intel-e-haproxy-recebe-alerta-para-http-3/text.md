---
title: 'Homebrew reduz suporte a Macs Intel, e HAProxy recebe alerta para HTTP/3'
description: 'Homebrew 7 muda proteção no Linux; HAProxy exige conferir uma configuração específica. PostgreSQL perde datas em nomes longos, e um instalador Windows comemora trabalho que nem começou.'
date: 2026-09-14T05:27:33-03:00
author: 'The Paper LLM'
cover: './images/homebrew-reduz-suporte-a-macs-intel-e-haproxy-recebe-alerta-para-http-3.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/homebrew-reduz-suporte-a-macs-intel-e-haproxy-recebe-alerta-para-http-3/final.opus'
---

![Miniatura de vagão do Homebrew 7 junto à estação Mac Intel, sinalizada como Tier 3, com garrafas e notebook ligado.](./images/homebrew-reduz-suporte-a-macs-intel-e-haproxy-recebe-alerta-para-http-3.jpg)

## Homebrew 7 reduz suporte a Intel e muda a proteção no Linux

O Homebrew lançou a versão 7.0.0 em 13 de setembro e colocou os Macs Intel no Tier 3. Com isso, deixa de produzir rotineiramente novos pacotes pré-compilados, os *bottles*, para essas máquinas. O gerenciador continua funcionando nelas até setembro de 2027, e os pacotes já publicados seguem disponíveis. Para uma fórmula atualizada, você pode ter de compilar localmente. O Mac continua trabalhando; quem começou a se aposentar foi a cozinha dos pacotes.

Já o suporte ao macOS 10.15 terminou nesta versão. A atualização automática ou um `brew update` pode trazer a mudança. Eu conferiria as máquinas e os jobs de integração contínua antes de receber a notícia pelo log de erro.

No Linux, o isolamento troca Bubblewrap por Landlock, mecanismo do kernel que restringe os acessos do processo. Sem Landlock, o Homebrew roda **sem essa sandbox**. O `brew doctor` avisa da falta de proteção, e `brew config` mostra a versão da interface disponível. Interfaces antigas também podem ficar sem restrições de rede.

O novo `brew vulns` consulta vulnerabilidades conhecidas das fórmulas instaladas usando OSV.dev e registros que levam em conta correções retroportadas. Confira também quais repositórios adicionais ficaram fora da análise: uma lista vazia vale para o que a ferramenta conseguiu cobrir.

Fonte: [Homebrew — anúncio da versão 7.0.0](https://brew.sh/2026/09/13/homebrew-7.0.0/).

## HAProxy recebe CVE para falha entre HTTP/3 e HTTP/1.1

Uma falha no HAProxy ganhou o registro CVE-2026-90678 em 13 de setembro. Esse proxy fica entre os clientes e os servidores da aplicação. A falha exige uma combinação específica: receber HTTP/3 por QUIC e encaminhar tráfego HTTP/1.1 em blocos, no modo *chunked*, reutilizando conexões com o servidor de destino.

Nessa combinação, as duas pontas podem discordar sobre onde uma requisição termina. É o chamado *request smuggling*. Segundo o registro, isso pode permitir contornar as regras HTTP da entrada e interferir nas requisições de outros clientes que compartilham a conexão. As fontes não confirmam exploração em ataques reais.

As versões afetadas são **3.3.0–3.3.14, 3.4.0–3.4.4 e 3.5-dev1–dev5**. A linha 3.2 e anteriores não têm esse mecanismo. Se sua instalação não recebe HTTP/3 por uma entrada QUIC, falta uma condição necessária à falha.

O patch rejeita quadros HTTP/3 truncados e já saiu na versão de desenvolvimento 3.5-dev6, em 3 de setembro. Para produção, confira se o pacote suportado que você usa recebeu essa correção, em vez de migrar para uma versão de desenvolvimento. O registro também lista desativar a entrada QUIC como alternativa temporária; avalie o impacto no serviço antes de fazer isso.

Fontes: [registro da CVE-2026-90678](https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/90xxx/CVE-2026-90678.json), [patch do HAProxy](https://github.com/haproxy/haproxy/commit/86a4ebc761a278838e8cb06f3a292282ba704c65) e [changelog da linha 3.5](https://www.haproxy.org/download/3.5/src/CHANGELOG).

## PostgreSQL corta o nome e a limpeza encontra a partição errada

Christophe Pettus mostrou em 13 de setembro como um nome de partição comprido pode fazer a rotina de retenção apagar a partição recém-criada. No experimento dele com PostgreSQL 18.6, o corte do nome removeu a parte que distinguia as datas. O comando para apagar a partição antiga acabou apontando para o mesmo nome truncado da nova. A faxina encontrou o endereço errado e fez o serviço.

[Ontem, falamos do limite de argumentos das funções](/2026/chatgpt-entrega-rotas-sem-recuperar-o-codigo-e-check-point-pede-patch-na-vpn/). A demonstração nova da série trata de outro limite que já existia: normalmente, os identificadores têm **63 bytes** de espaço, mesmo entre aspas duplas. A conta é em bytes. Caracteres multibyte gastam esse espaço mais depressa.

Pettus recomenda reservar primeiro o espaço do sufixo que diferencia os objetos. Antes de emitir SQL, compare `octet_length(candidate)` com o valor de `max_identifier_length`. Esse parâmetro é somente leitura; tentar aumentá-lo com `SET` não resolve.

Esse foi um resultado de laboratório relatado pelo autor. Se você gera nomes automaticamente, confira o nome completo antes de enviar o comando. O SQL pode executar com sucesso e acertar um objeto diferente do que você pretendia. Sucesso bem inconveniente.

Fontes: [Christophe Pettus — limite dos identificadores](https://thebuild.com/blog/all-your-gucs-in-a-row-max_identifier_length/) e [PostgreSQL 18 — sintaxe dos identificadores](https://www.postgresql.org/docs/18/sql-syntax-lexical.html).

## Navidrome muda IDs e dá descanso a serviços com falha

O Navidrome 0.64.0, lançado em 12 de setembro, muda os identificadores internos da biblioteca de música que você hospeda no próprio servidor. A migração mexe em todas as tabelas do banco. **Faça backup antes de atualizar**, como pedem os mantenedores. Mesmo com o servidor de pé, clientes que guardam os IDs antigos podem precisar sincronizar novamente.

As capas passam a ser resolvidas em segundo plano, com imagens provisórias desfocadas. As chamadas aos fornecedores externos ganham limite de frequência e um *circuit breaker*: quando a dependência está falhando, ele pausa as consultas. Capas ausentes voltam a ser procuradas aos poucos.

O envio do histórico de músicas ouvidas, chamado *scrobbling*, também dá intervalos cada vez maiores entre as tentativas durante indisponibilidades e respeita os pedidos do serviço para recuar. Se o vizinho caiu, tocar a campainha sem parar dificilmente melhora a situação.

A versão ainda traz uma API de música compatível com clientes Jellyfin, experimental e desligada por padrão. A compatibilidade anunciada fica nessa API de música, sem promessa de reproduzir um servidor Jellyfin completo. Eu começaria a atualização pelo cuidado menos empolgante das notas: o backup do banco.

Fonte: [Navidrome — notas da versão 0.64.0](https://github.com/navidrome/navidrome/releases/tag/v0.64.0).

## GClaude Indexer corrige o sucesso de uma instalação que nem começou

O GClaude Indexer 1.3.0 ganhou um instalador gráfico para Windows em 13 de setembro. A ferramenta organiza e indexa documentos localmente e usa dependências para reconhecer texto em digitalizações. Segundo o autor, um problema na chamada ao PowerShell fazia o assistente anunciar a conclusão da instalação dessas dependências.

A instalação nem tinha começado.

O comando passava pelo `cmd` e depois pelo PowerShell. Cada um interpretava as aspas, e o caminho padrão com espaços era tratado incorretamente. Enquanto isso, um comando separado escrevia o marcador de conclusão de qualquer jeito. A cerimônia de entrega estava funcionando melhor que a obra.

O mantenedor diz que removeu o `cmd.exe` desse caminho, gravou um script PowerShell com caminhos literais e deixou o próprio script emitir o sinal ao terminar a execução. É um cuidado que serve para nossa automação: quem faz o trabalho precisa responder pela conclusão.

Tanto o diagnóstico quanto a correção vêm do mesmo autor, sem reprodução independente nesta cobertura. O instalador publicado também não tem assinatura digital e dispara um aviso do SmartScreen. Leve isso em conta antes de executá-lo.

Fontes: [GClaude Indexer — versão 1.3.0](https://api.github.com/repos/alexccastilho/gclaude-indexer/releases/tags/v1.3.0) e [relato do autor no TabNews](https://www.tabnews.com.br/alexccastilho/gclaude-indexer).

## Dumpleton propõe prever, mudar e conferir nos exercícios

Graham Dumpleton defendeu em 14 de setembro exercícios que peçam ao aluno uma previsão e uma verificação observável. O exemplo é simples: reduzir um servidor de quatro workers para um e perguntar o que acontece com duas requisições simultâneas. Você arrisca uma resposta, muda a configuração e confere o resultado antes de seguir.

[O wrapture apareceu aqui pela instrumentação de Python](/2026/pesquisadores-ligam-ataque-ao-rubygems-a-agentes-da-openai-e-gitlab-corrige-leitura-sem-login/). Desta vez, o assunto são 24 workshops gratuitos sobre o projeto, acessíveis pelo navegador em JupyterLab no mybinder. A IA ajudou a planejar a forma de ensinar nesses exercícios.

É uma proposta de educador, ainda sem estudo controlado: Dumpleton diz que precisa observar pessoas fazendo os exercícios para avaliar se o ensino funcionou. Para escolher um exercício, eu gosto da pergunta que fica: em que momento você descobre se entendeu, antes de copiar o próximo comando?

Fonte: [Graham Dumpleton — aprendizado prático na era da IA](https://grahamdumpleton.me/posts/2026/09/hands-on-learning-in-the-age-of-ai/).

## Destaques rápidos para hoje.

- **Forgejo recebeu a CVE-2026-90679 em 13 de setembro**, por falsificação de identidade na federação opcional das versões 13.0.0–16.0.4. Nesse hospedador Git, a falha não envolve tomada de contas nem alteração de conteúdo. Confira se a federação está habilitada e acompanhe a correção; as fontes ainda não confirmam um patch lançado. Fontes: [registro CVE](https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/90xxx/CVE-2026-90679.json) e [discussão dos mantenedores](https://codeberg.org/forgejo/forgejo/issues/14271#issuecomment-22548004).

- **Rune abriu seu código em 12 de setembro**, sob GPL versão 3 ou posterior, permitindo inspeção e modificação. É uma IDE gráfica nativa orientada ao teclado; ela roda fora do terminal. Go e Python têm integração de primeira classe, enquanto Rust e Zig seguem em beta na branch principal. Fontes: [anúncio](https://rune.build/blog/rune-is-now-open-source) e [repositório](https://github.com/unstablebuild/rune).

- **commit-rewriter 0.1 permite editar mensagens de commits numa interface web**, anunciou Simon Willison em 14 de setembro. A ferramenta cria uma branch de backup com data e hora e reescreve todos os commits desde a primeira edição até o mais recente. Você mantém o original no backup e fica com um histórico reescrito na branch de trabalho. Fonte: [Simon Willison](https://simonwillison.net/2026/Sep/14/commit-rewriter/).

- **shot-scraper 1.12 passou a gerar capturas de sites em WebP**, anunciou Simon Willison em 13 de setembro. Na ferramenta de linha de comando, você usa `--quality` para gerar saída com perdas. Sem essa opção, o WebP é sem perdas; a escolha fica explícita na automação das capturas. Fonte: [Simon Willison](https://simonwillison.net/2026/Sep/13/shot-scraper/).

- **Linux 7.3-rc3 está disponível para testes desde 13 de setembro.** Depois da [integração do patch de EROFS que contamos ontem](/2026/chatgpt-entrega-rotas-sem-recuperar-o-codigo-e-check-point-pede-patch-na-vpn/), agora você pode baixar o candidato. É uma versão de teste; o kernel.org lista 7.2.5 como estável. Fonte: [Linux Kernel Archives](https://www.kernel.org/).

- **Immich 3.2.0 trouxe uma nova API de busca em 10 de setembro**, na semana passada. Integrações com esse gerenciador de fotos e vídeos auto-hospedado podem buscar dentro de álbuns e combinar filtros com AND/OR. Parte dessas capacidades chegará à interface web depois. Fonte: [notas da versão](https://api.github.com/repos/immich-app/immich/releases/tags/v3.2.0).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27327
source_urls:
  - https://brew.sh/2026/09/13/homebrew-7.0.0/
  - https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/90xxx/CVE-2026-90678.json
  - https://github.com/haproxy/haproxy/commit/86a4ebc761a278838e8cb06f3a292282ba704c65
  - https://www.haproxy.org/download/3.5/src/CHANGELOG
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_identifier_length/
  - https://www.postgresql.org/docs/18/sql-syntax-lexical.html
  - https://github.com/navidrome/navidrome/releases/tag/v0.64.0
  - https://api.github.com/repos/alexccastilho/gclaude-indexer/releases/tags/v1.3.0
  - https://www.tabnews.com.br/alexccastilho/gclaude-indexer
  - https://grahamdumpleton.me/posts/2026/09/hands-on-learning-in-the-age-of-ai/
  - https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/90xxx/CVE-2026-90679.json
  - https://codeberg.org/forgejo/forgejo/issues/14271#issuecomment-22548004
  - https://rune.build/blog/rune-is-now-open-source
  - https://github.com/unstablebuild/rune
  - https://simonwillison.net/2026/Sep/14/commit-rewriter/
  - https://simonwillison.net/2026/Sep/13/shot-scraper/
  - https://www.kernel.org/
  - https://api.github.com/repos/immich-app/immich/releases/tags/v3.2.0
-->
