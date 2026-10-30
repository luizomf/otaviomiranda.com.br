---
title: 'Node.js 27 alpha inclui buffers na conta de memória; Noctalia corrige desbloqueio indevido'
description: 'Meta relata 74 bugs graves de privacidade encontrados com ajuda de testes gerados por IA. Também: alertas de GitLab e Cisco, pesos do Mistral Large 4 e novidades para Python e Linux.'
date: '2026-10-30T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/node-27-alpha-memoria-noctalia-autenticacao-testes-meta.jpg'
---

![Balança do Node.js 27 alpha reúne Buffer e ArrayBuffer na mesma bandeja, ilustrando a nova conta de memória.](./images/node-27-alpha-memoria-noctalia-autenticacao-testes-meta.jpg)

A edição de hoje traz três motivos para revisar o comportamento do software: o Node.js 27 alpha muda a contabilização de memória, o Noctalia corrige falhas de autenticação na tela de bloqueio e a Meta relata resultados de testes gerados por IA para encontrar regressões. Nos destaques rápidos, há correções de segurança, ferramentas de desenvolvimento e pesquisas que ajudam a avaliar o custo e a confiabilidade de agentes.

## Node.js 27 alpha passa a contar buffers no limite de memória

A versão **27.0.0-alpha.0.0.0**, publicada em **29 de outubro**, atualiza o motor JavaScript V8 e muda o orçamento padrão de memória. Sem uma configuração explícita de `--max-old-space-size`, o limite do heap, área de memória gerenciada pelo motor, passa a ser metade da memória física, com piso de **256 MB** e teto de **4 GB**. A memória mantida por objetos `Buffer` e `ArrayBuffer`, usados para dados binários, também passa a contar nesse limite.

Aplicações que acumulam dados binários precisam testar a nova contabilização sob uma carga representativa: o mesmo código pode alcançar o limite em condições diferentes. As notas recomendam configurar `--max-old-space-size` explicitamente quando a aplicação depende dos padrões antigos. Esse orçamento deve deixar espaço para as demais necessidades de memória do processo.

A migração exige atenção também aos dados serializados, isto é, convertidos em um formato para armazenamento ou transporte. O formato usado por `v8.serialize()` e outras operações mudou, e **versões anteriores do Node.js não conseguem lê-lo**. Quem persiste esses dados precisa verificar a compatibilidade entre versões. A versão alpha é uma oportunidade de testar essas mudanças antes de planejar sua adoção em produção.

Fonte: [notas do Node.js 27 alpha](https://nodejs.org/en/blog/release/v27.0.0-alpha.0.0.0).

## Noctalia 5.4.1 rejeita mensagens falsas de desbloqueio

O **Noctalia**, componente de interface para ambientes gráficos Linux, publicou a versão **5.4.1 em 29 de outubro** com correções na tela de bloqueio. Segundo os mantenedores, mensagens falsificadas de desbloqueio e de reconhecimento de impressão digital podiam contornar a autenticação. Elas chegavam pelo **D-Bus**, sistema de comunicação entre aplicações e serviços, a partir de remetentes sem autoridade para confirmar o acesso.

A correção rejeita esses remetentes. No bloqueio por inatividade, o Noctalia também passa a consultar diretamente o estado do **logind**, serviço que gerencia sessões, para impedir que mensagens forjadas suprimam o bloqueio automático. Em ambos os casos, a segurança depende de conferir quem pode informar ou alterar o estado da sessão.

A atualização ainda corrige injeção de comandos e scripts por nomes de arquivos de papéis de parede do KDE. **Quem usa Noctalia deve atualizar para a versão corrigida.** As notas não informam exploração em andamento nem demonstram um caminho de ataque pela internet.

Fonte: [lançamento do Noctalia 5.4.1](https://github.com/noctalia-dev/noctalia/releases/tag/v5.4.1).

## Meta relata 74 bugs graves de privacidade encontrados com ajuda de testes gerados por IA

Em relatório de **29 de outubro**, a Meta apresentou resultados do **Catching JiTTests**, sistema que gera testes para encontrar regressões — comportamentos que deixam de funcionar após uma alteração. Ele prioriza mudanças de código consideradas arriscadas e busca testes que exponham diferenças entre a versão proposta e a anterior.

Uma estratégia trata a própria mudança como um possível defeito. Outra infere sua intenção, cria variantes de código com erros plausíveis e gera testes para detectá-los; depois, executa esses testes contra a alteração real. Avaliadores baseados em modelos e filtros determinísticos selecionam os achados levados aos engenheiros. A revisão ganha uma pergunta verificável: **essa mudança de comportamento era desejada?**

Segundo a Meta, os engenheiros que avaliaram os achados relataram **60% de verdadeiros positivos**, ou seja, casos que apontavam defeitos reais. A empresa também afirma que o sistema ajudou a encontrar **74 bugs graves de privacidade antes de entrarem em produção, no primeiro semestre de 2026**. Esses resultados descrevem o uso na infraestrutura da Meta. Para outras equipes, a prática aproveitável é pedir um teste que reproduza a suspeita de regressão e comparar sua execução nas duas versões.

Fonte: [relatório de engenharia da Meta](https://engineering.fb.com/2026/10/29/security/catching-bugs-before-they-land-jittestings-human-on-the-loop-approach-at-full-scale/).

## Destaques rápidos para hoje.

- **CISA inclui falha do GitLab no catálogo de vulnerabilidades exploradas.** A entrada de **29 de outubro** acrescenta confirmação de exploração à **CVE-2026-97229**, já acompanhada no [caso da imagem do Alpine](/2026/alpine-gitlab-ruby-ubuntu-core-desktop-node-lts/). Sob determinadas condições, expressões regulares em configurações de integração contínua permitem execução de código sem autenticação. O GitLab corrigiu o problema nas versões **19.2.8, 19.3.5 e 19.4.2**; instalações próprias devem usar uma versão corrigida da sua série. O comunicado também disponibiliza detecções para investigar tentativas de exploração. Fontes: [catálogo da CISA](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) e [aviso do GitLab](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/).

- **Cisco confirma exploração de falha que pode reiniciar firewalls ASA e FTD.** A **CVE-2026-76418** afeta versões vulneráveis com o serviço de VPN SSL de acesso remoto alcançável e autenticação secundária configurada no grupo de túnel aplicável. Uma solicitação preparada pode provocar reinicialização e interromper o serviço sem login. A CISA incluiu a falha em seu catálogo em **29 de outubro**. A Cisco recomenda atualizar conforme a tabela da série instalada; desabilitar autenticação secundária como mitigação pode reduzir a segurança da VPN e exige avaliação. Fontes: [aviso da Cisco](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-tunnel-dos-s6mgkb75) e [CISA](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json).

- **Mistral libera os pesos do Large 4, com condição específica para serviços de modelos.** O anúncio de **29 de outubro** concretiza a entrega prometida na [prévia apresentada neste mês](/2026/github-git-agentes-polars-2-copilot-cli/). O modelo aceita texto e imagens como entrada, tem aproximadamente **1 trilhão de parâmetros** e pode ser hospedado pela própria organização, com suporte documentado a vLLM e SGLang. A licença permite uso, modificação e comercialização, mas empresas que operam um negócio de **Model-as-a-Service**, oferecendo modelos como serviço, precisam de licença comercial separada. Essa condição importa antes de planejar uma API comercial baseada nos pesos. Fontes: [anúncio da Mistral](https://mistral.ai/news/mistral-large-4-oss/) e [documentação do modelo](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B).

- **Tutorial mostra como compartilhar iteradores entre threads no Python 3.15.** No exemplo de **29 de outubro**, Rodrigo Girão Serrão reproduz o erro `generator already executing`: duas threads, linhas de execução concorrentes, tentam avançar o mesmo gerador de valores simultaneamente. `threading.serialize_iterator()` envolve o iterador com uma trava, fazendo as chamadas esperarem sua vez; `synchronized_iterator` aplica essa proteção por meio de um decorador na função que produz iteradores. O processamento posterior de cada item continua fora dessa trava e precisa dos próprios controles de concorrência. Fontes: [exemplo do autor](https://mathspp.com/blog/threadsafe-iterators) e [documentação do Python](https://docs.python.org/3/library/threading.html#iterator-synchronization).

- **OpenTelemetry mostra como compilar um Collector com menos dependências.** O guia de **29 de outubro** explica como selecionar apenas os detectores necessários, componentes que identificam o ambiente de execução e acrescentam esses dados à telemetria. A escolha acontece durante a compilação: desabilitar um detector apenas na configuração de uso podia deixar suas dependências dentro do executável. No exemplo, baseado na distribuição para Kubernetes e mantendo os detectores `env` e `system`, o arquivo caiu de aproximadamente **182 para 147 MB**, com **13 dependências a menos**. O resultado mede tamanho de arquivo; o consumo de RAM precisa ser avaliado separadamente. Fonte: [guia do OpenTelemetry Collector Builder](https://opentelemetry.io/blog/2026/collector-with-less-dependencies/).

- **Tor Browser 16.0 leva Linux ARM64 ao canal estável.** Lançado em **29 de outubro**, o navegador passa a oferecer suporte estável a computadores Linux com processadores AArch64, incluindo Raspberry Pi e Macs Apple Silicon executando Linux. A versão também permite substituir títulos das janelas por “Tor Browser”, reduzindo a informação que outros programas locais podem ler. Essa opção vem **desativada**, enquanto o projeto avalia efeitos sobre leitores de tela e ambientes gráficos. O suporte a Linux x86 de 32 bits foi encerrado. Fonte: [anúncio do Tor Project](https://blog.torproject.org/new-release-tor-browser-160/).

- **Paru 2.2 permite adiar a instalação de pacotes muito recentes do AUR.** O auxiliar de instalação para Arch Linux ganhou **`MinimumReleaseAge`**, com exceções por pacote, para instalações, atualizações e buscas no repositório comunitário AUR. A versão, com changelog de **28 de outubro**, também adiciona suporte ao pacman 7.1. Uma espera mínima dá tempo para que problemas sejam descobertos antes da adoção; a idade do pacote, sozinha, não comprova sua segurança. Fonte: [notas do Paru 2.2.0](https://github.com/Morganamilo/paru/releases/tag/v2.2.0).

- **Estudo de modernização de PHP encontra regressões em arquivos que já funcionavam.** O preprint de **29 de outubro** avaliou cinco modelos, cada um recebendo 100 arquivos do WordPress 4.0 para adaptar ao PHP 8.3, sem contexto do projeto nem retorno da execução. Dos originais, 83 passavam em todos os testes; após a transformação pelo melhor modelo nesse critério, restaram 59. Cada modelo quebrou entre **32 e 51 arquivos antes compatíveis**. A amostra foi escolhida por padrões de modernização, e o experimento mede a primeira resposta completa. Para migrações, vale comparar o comportamento com o código intacto e dar ao processo acesso aos testes. Fonte: [estudo e metodologia](https://arxiv.org/html/2610.40269v1).

- **CORAL testa agentes que salvam progresso antes de limpar o contexto.** O trabalho de **29 de outubro** fornece ferramentas para registrar fatos e tarefas concluídas, depois reiniciar o histórico preservando esses registros. Na avaliação dos autores com **Qwen3-8B**, após treinamento específico, a configuração CORAL RL recebeu em média **136 mil tokens de entrada por execução**, contra **1 milhão e 78 mil** do agente ReAct usado na comparação. O teste usou 103 questões textuais do GAIA, com oito execuções por questão. A redução se refere ao volume de tokens de entrada nesse experimento; salvar informações erradas também pode carregar o erro para a etapa seguinte. Fonte: [artigo, seção 4 e tabela 2](https://arxiv.org/html/2610.40350v1).

- **OpenBonsai atualiza sua prévia de compressão para modelos locais.** O projeto independente substituiu seu modelo em **29 de outubro** e documenta a conversão do Qwen3.5-9B em um arquivo de aproximadamente **2 GB**, usando uma representação de pesos com três valores e fatores de escala. Esse tamanho descreve o arquivo do modelo; a memória total necessária para executá-lo deve ser avaliada à parte. A execução exige a versão modificada do llama.cpp mantida pela Prism. O projeto alerta para avaliações pequenas, resultados inferiores ao Ternary Bonsai oficial em testes de código e sobreposição entre exemplos de treinamento e parte da avaliação. A prévia é experimental, com qualidade a conferir na tarefa desejada. Fonte: [repositório e limitações do OpenBonsai](https://github.com/esokullu/openbonsai).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29640
source_urls:
  - https://nodejs.org/en/blog/release/v27.0.0-alpha.0.0.0
  - https://github.com/noctalia-dev/noctalia/releases/tag/v5.4.1
  - https://engineering.fb.com/2026/10/29/security/catching-bugs-before-they-land-jittestings-human-on-the-loop-approach-at-full-scale/
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/
  - https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-tunnel-dos-s6mgkb75
  - https://mistral.ai/news/mistral-large-4-oss/
  - https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B
  - https://mathspp.com/blog/threadsafe-iterators
  - https://docs.python.org/3/library/threading.html#iterator-synchronization
  - https://opentelemetry.io/blog/2026/collector-with-less-dependencies/
  - https://blog.torproject.org/new-release-tor-browser-160/
  - https://github.com/Morganamilo/paru/releases/tag/v2.2.0
  - https://arxiv.org/html/2610.40269v1
  - https://arxiv.org/html/2610.40350v1
  - https://github.com/esokullu/openbonsai
-->
