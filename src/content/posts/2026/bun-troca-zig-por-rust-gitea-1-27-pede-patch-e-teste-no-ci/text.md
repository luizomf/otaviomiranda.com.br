---
title: 'Bun troca Zig por Rust; Gitea 1.27 pede patch e teste no CI'
description: 'A nova runtime do Bun já está dentro do Claude Code, após uma migração assistida por agentes. No Git self-hosted, o Gitea corrige uma falha crítica e muda workflows reutilizáveis.'
date: 2026-07-19T04:28:43-03:00
author: 'The Paper LLM'
image: './images/bun-troca-zig-por-rust-gitea-1-27-pede-patch-e-teste-no-ci.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/bun-troca-zig-por-rust-gitea-1-27-pede-patch-e-teste-no-ci/final.opus'
---
![Jaqueta do Bun aberta mostra forro Rust, com o antigo forro Zig ao lado.](./images/bun-troca-zig-por-rust-gitea-1-27-pede-patch-e-teste-no-ci.jpg)


Você pode ter recebido uma runtime inteira reescrita sem instalar nada por conta própria. O Claude Code já vem com o Bun em Rust, resultado de uma tradução grande feita por um engenheiro com dezenas de workflows do próprio Claude Code.

A frase parece encomendada para começar uma discussão sobre agentes antes do café. Mas a parte útil dessa história é bem menos mágica: compilador, um milhão de verificações, revisão adversarial e supervisão humana.

Enquanto isso, quem mantém Git dentro de casa tem uma atualização mais direta para planejar. O Gitea 1.27 corrige uma falha crítica de autorização, inclui várias outras correções de segurança e muda de forma incompatível a execução de workflows reutilizáveis.

## Bun 1.4 troca Zig por Rust e já roda no Claude Code

O Bun reúne runtime para JavaScript e TypeScript, gerenciador de pacotes, bundler e executor de testes. Segundo o projeto, a versão 1.3.14 foi a última implementada em Zig. A 1.4.0 será a primeira em Rust. Durante a apuração, ela ainda estava no canal canary, sem release estável para todo mundo.

A troca acontece por baixo da interface usada pelo Claude Code, então não há migração manual para quem usa a ferramenta. O port já está no Claude Code 2.1.181, lançado em 17 de junho, e nas versões posteriores.

No relato oficial, um engenheiro fez a tradução em 11 dias, com cerca de 50 workflows dinâmicos do Claude Code rodando continuamente. Foram 6.778 commits. Erros de compilação e falhas nos testes viravam filas de trabalho: alguns loops geravam código, outros comparavam as implementações em Zig e Rust, e outros faziam revisão adversarial. Quando aparecia uma classe nova de erro, o engenheiro ajustava os loops e acompanhava o resultado.

Essa diferença importa. Ele não soltou um pedido para o modelo recriar a runtime do zero. O trabalho foi uma tradução mecânica de uma base existente, guiada por documentação, invariantes e uma suíte independente da linguagem. Segundo o autor, essa suíte executou um milhão de assertions sem remover ou pular testes. O processo também teve comparação lado a lado e correções manuais.

Nesse caso, o agente virou uma quantidade pouco razoável de braços trabalhando sobre trilhos que alguém precisou construir e vigiar. A engenharia continuou lá.

Rust também oferece outras ferramentas para encontrar problemas. A linguagem mantém a verificação dos limites de acesso, os chamados bounds checks, mesmo em builds de release. O mecanismo `Drop` cuida da limpeza automática quando um valor deixa de ser usado. O post do Bun associa essas propriedades à descoberta de erros durante o port e à redução de vazamentos. Tanto a relação de causa quanto o tamanho desse efeito são interpretações do próprio projeto.

Os números publicados pelo Bun chamam atenção. A equipe diz que a 1.4.0 corrige 128 bugs reproduzíveis na 1.3.14, reduz o binário em cerca de 20% no Linux e no Windows e melhora entre 2% e 5% os workloads apresentados. Na telemetria de produção do Claude Code no Linux, o tempo mediano de startup caiu de 517 para 464 milissegundos, uma redução de aproximadamente 10%.

São medições do fornecedor, não benchmarks reproduzidos de forma independente. E “um engenheiro em 11 dias” inclui preparação, testes extensos, monitoramento e revisão. O número não descreve trabalho humano ausente.

Pelo menos uma parte da história ganhou confirmação externa: o software distribuído contém o novo port. Em 19 de julho, Simon Willison rodou `strings` no binário local do Claude Code. Essa ferramenta extrai sequências legíveis de um executável. Ele encontrou a identificação `Bun v1.4.0 (macOS arm64)` e 563 nomes de arquivos Rust.

A inspeção é simples, não uma auditoria completa, e não confirma os ganhos de desempenho. Ela sustenta um ponto específico: o Bun em Rust já chegou ao artefato do Claude Code. Não está restrito a um anúncio ou branch de desenvolvimento.

Fontes: [Bun — Rewriting Bun in Rust](https://bun.com/blog/bun-in-rust) e [Simon Willison — Claude Code uses Bun written in Rust now](https://simonwillison.net/2026/Jul/19/claude-code-in-bun-in-rust/).

## Gitea 1.27 corrige falha crítica e muda workflows reutilizáveis

O Gitea 1.27.0 saiu em 13 de julho. Para quem hospeda a própria forge Git, essa atualização junta dois trabalhos que merecem ser feitos com calma: corrigir falhas de segurança e validar mudanças no CI.

O caso mais urgente é a CVE-2026-58443, também identificada pelo advisory GHSA-xxjv-752h-3vp2. A falha tem severidade crítica e nota CVSS 9,6. Ela afeta as versões até a 1.26.4 e foi corrigida especificamente na 1.27.0.

O problema é um desvio de escopo de autorização. Um token limitado a repositórios públicos podia atualizar a branch de origem de um pull request privado. Portanto, a credencial podia alterar conteúdo privado e afetar a integridade e, potencialmente, a disponibilidade do repositório.

As notas da 1.27 também listam correções em controle de acesso, migração, tokens, metadados privados, Git LFS, redirecionamentos de mirrors, OAuth, Actions e travessia de diretórios. A Linuxiac contou 45 CVEs corrigidas e citou casos de escalada de privilégio, requisições forjadas pelo servidor, desvios de autorização, exposição de repositórios e negação de serviço.

Essa contagem é da publicação. As notas oficiais não informam um total, enquanto a API pública exibia 46 advisories publicados em 13 de julho. A diferença pode ser apenas de escopo, inclusive porque nem todo advisory daquele mês recebeu necessariamente seu primeiro patch nessa versão.

No Gitea Actions, os workflows reutilizáveis passam a ser analisados e expandidos pelo servidor como jobs separados. Workflows compartilhados evitam repetir YAML e, na 1.27, também podem ficar no escopo do proprietário ou no escopo global. Só que o próprio release classifica a mudança na execução como incompatível. Subir a imagem nova e descobrir a semântica no pipeline principal é um teste, mas não dos bons.

O Actions também ganhou `continue-on-error`, para que uma falha esperada não derrube indevidamente o status geral, e suporte a `GITHUB_STEP_SUMMARY`, com o qual um job pode escrever Markdown no resumo da execução. A versão melhora a limpeza depois de cancelamentos e traz ajustes na execução e na visualização.

Fora do CI, o Gitea agora renderiza notebooks Jupyter em arquivos `.ipynb`, permite associar vários projetos a uma issue ou pull request e publica uma especificação OpenAPI 3.0 em `/openapi.v1.json`.

O caminho prudente para atualizar começa pelo backup do banco, dos repositórios, anexos, configuração e secrets. Depois da instalação, teste login, clone e push, hooks, LFS e os pipelines críticos. Quem ainda está na 1.26.4 ou anterior tem uma falha de segurança concreta para corrigir. Quem usa workflows reutilizáveis também tem um bom motivo para não fazer a atualização no automático.

Fontes: [notas de lançamento do Gitea 1.27.0](https://github.com/go-gitea/gitea/releases/tag/v1.27.0), [advisory da CVE-2026-58443](https://github.com/go-gitea/gitea/security/advisories/GHSA-xxjv-752h-3vp2) e [Linuxiac](https://linuxiac.com/gitea-1-27-released-with-actions-improvements-and-45-cve-fixes/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://bun.com/blog/bun-in-rust
  - https://simonwillison.net/2026/Jul/19/claude-code-in-bun-in-rust/
  - https://github.com/go-gitea/gitea/releases/tag/v1.27.0
  - https://github.com/go-gitea/gitea/security/advisories/GHSA-xxjv-752h-3vp2
  - https://linuxiac.com/gitea-1-27-released-with-actions-improvements-and-45-cve-fixes/
-->
