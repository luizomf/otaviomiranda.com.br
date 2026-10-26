---
title: 'Gheist usa logs do GitHub Actions para roubar segredos; Python bloqueia chaves comprometidas da eMudhra'
description: 'Linux troca o Binder em C pela implementação Rust. Também: WSL com partição física, revisão de código, IA local, Zig, OpenLDK, pnpm e o impasse do C++26.'
date: '2026-10-26T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/gheist-github-python-emudhra-linux-binder-rust.jpg'
---

![Jornal nas mãos de um passageiro mostra o GitHub Actions e uma chave sobre logs, ilustrando o roubo de segredos pela campanha Gheist.](./images/gheist-github-python-emudhra-linux-binder-rust.jpg)

Uma investigação da Wiz mostra como a campanha Gheist usa os registros de execução do GitHub Actions para extrair segredos de repositórios. O Python publicou cinco atualizações para bloquear chaves de certificados comprometidas da eMudhra. E o Linux incorporou a substituição do Binder em C pela versão Rust, com consequências para quem compila kernels com esse recurso.

## Gheist rouba segredos pelos próprios logs do GitHub Actions

A Wiz publicou em **25 de outubro** uma investigação sobre a **Gheist**, campanha que usa tokens de acesso do GitHub já comprometidos para inserir workflows nos repositórios acessíveis. Esses arquivos definem as tarefas executadas pelo GitHub Actions, a plataforma de automação do serviço. A empresa identificou mais de **13,5 mil branches maliciosas em mais de 850 contas comprometidas**; esses totais descrevem o alcance observado da campanha, sem medir quantos repositórios tiveram segredos extraídos.

Segundo a Wiz, o workflow registra no log uma versão codificada dos segredos que recebe, escapando da ocultação automática desses valores. O atacante então recupera os registros e apaga a execução. Isso transforma uma ferramenta de diagnóstico em um canal de saída de credenciais. Limitar as permissões do token interno do workflow, o `GITHUB_TOKEN`, deixa intacto o acesso aos segredos entregues à tarefa.

Na amostra examinada pela Wiz, a exigência de aprovação do GitHub impediu a execução dos workflows maliciosos em repositórios públicos. A empresa observou execuções bem-sucedidas em repositórios privados e ambientes empresariais.

Para quem administra integração contínua (CI), vale procurar criação inesperada de workflows e execuções apagadas logo após terminar. **Credenciais expostas precisam ser revogadas ou substituídas.** Proteja ambientes com segredos de produção por aprovação de revisores e restrinja a autenticação na nuvem às branches ou aos ambientes autorizados. A própria documentação do GitHub alerta que a ocultação de segredos transformados não é garantida.

Fontes: [investigação e orientações da Wiz](https://www.wiz.io/blog/gheist-attempted-scaled-abuse-of-stolen-github-tokens-stumbles) e [proteção de segredos no GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).

## Python publica cinco atualizações para bloquear chaves comprometidas da eMudhra

As versões **Python 3.15.2, 3.14.10, 3.13.18, 3.12.16 e 3.11.18**, anunciadas em **26 de outubro**, bloqueiam no módulo `ssl` as chaves intermediárias comprometidas da eMudhra. É uma nova medida concreta após o [incidente de certificados que cobrimos no dia 21](/2026/emudhra-confianca-tls-jepsen-tarefas-sem-execucao/).

Certificados ajudam o cliente a confirmar a identidade do servidor em uma conexão HTTPS. Uma chave comprometida nessa cadeia pode permitir falsificar essa identidade. A defesa foi incorporada ao próprio interpretador, no módulo `ssl`, usado para conexões seguras. Por isso, segundo a equipe do Python, atualizar o interpretador protege os usos normais do `pip` contra essas chaves, inclusive ao baixar uma atualização do próprio instalador de pacotes.

A proteção depende de a verificação de certificados estar habilitada. Confira qual interpretador roda na aplicação, na imagem de contêiner e no executor de CI; atualize e reimplante esses ambientes. **A equipe do Python oferece instaladores binários para 3.15.2 e 3.14.10; as outras três versões foram publicadas somente em código-fonte.** Quem usa pacotes da distribuição deve acompanhar a atualização correspondente.

Fontes: [anúncio da equipe de releases](https://blog.python.org/2026/10/python-3152-31410-31318-31216-31118/) e [escopo da verificação no CPython](https://github.com/python/cpython/issues/160040).

## Linux remove o Binder em C e adota a implementação Rust no ciclo 7.4

A árvore principal do Linux incorporou a remoção da implementação C do **Binder**, mecanismo que permite a processos Android se comunicarem e chamarem operações uns dos outros. A mudança faz parte do desenvolvimento do **Linux 7.4**.

Na justificativa do commit, Carlos Llamas afirma que o trabalho de Alice Ryhl alcançou equivalência de funcionalidades e já rodava em dispositivos Android. Segundo o mantenedor, a implementação Rust igualava ou superava o desempenho da versão C nos testes realizados.

A transição também aparece na configuração de compilação: habilitar o Binder passa a depender do suporte a Rust. Quem compila kernels com esse recurso precisa considerar essa exigência no ambiente de build. A integração ocorreu na árvore de desenvolvimento; a chegada aos aparelhos Android depende da adoção pelos fornecedores.

Fontes: [merge no repositório de Linus Torvalds](https://github.com/torvalds/linux/commit/330517c63aa9b48227b6ab45f01003effac77ae4) e [remoção do Binder em C e mudança de configuração](https://github.com/torvalds/linux/commit/fd2bc059ed466bdd95347a4f7891d150d94e7de2).

## Destaques rápidos para hoje.

- **DreamHost pede novas senhas para usuários afetados de e-mail e FTP/SFTP.** Na atualização da madrugada desta segunda, a hospedagem informou ter enviado as instruções aos titulares das contas atingidas. Esses usuários continuam sem conseguir entrar até que o responsável defina e compartilhe novas credenciais. O gerenciador de arquivos permanece indisponível. A orientação é acessar diretamente o painel da DreamHost; a empresa afirma que nunca pede a senha por e-mail. O aviso não estabelece a causa do incidente. Fonte: [estado dos serviços e instruções oficiais](https://www.dreamhoststatus.com/).

- **Protótipo inicia no WSL a mesma instalação Linux usada no dual boot.** O projeto `dualboot-linux-as-wsl` modifica o serviço do WSL, ambiente Linux dentro do Windows, para usar uma partição física como raiz da distribuição. O autor relata funcionamento de systemd, Docker e aplicações gráficas em uma máquina com Kubuntu. O suporte está limitado a uma partição ext4 simples em um segundo disco; criptografia LUKS, volumes LVM e arranjos RAID ficam fora. Como há escrita no disco real, o experimento exige backup e desligamento completo do Linux nativo; hibernação e acesso simultâneo podem comprometer os dados. Fonte: [projeto, testes e limites de segurança](https://github.com/sottam/dualboot-linux-as-wsl).

- **Farol apresenta um mapa para orientar a revisão de pull requests.** Compartilhada pelo autor no domingo, a ferramenta usa análise estática para relacionar arquivos alterados às páginas, operações e tarefas que podem ser afetadas. Trabalha com TypeScript, Go e Python e pode combinar esse alcance com relatórios de cobertura de testes. O objetivo é ajudar o revisor a decidir por onde começar. Sua pontuação ajuda a priorizar a revisão: chamadas dinâmicas e reflexão limitam o que a análise consegue determinar. Fontes: [documentação do Farol](https://github.com/winnin/farol) e [apresentação e limitações descritas pelo autor](https://news.ycombinator.com/item?id=50231349).

- **llama.cpp incorpora otimização para processar prompts em GPUs NVIDIA.** A mudança integrada em 25 de outubro reúne operações de uma camada da rede em uma única chamada à GPU. O autor relata ganhos de **4,6% a 10,7% no DGX Spark** e **1,9% a 4,7% na RTX 5090**, conforme modelo e quantização. Os testes usaram prompts de 16.384 tokens — unidades de texto processadas pelo modelo —, cinco repetições e nenhuma geração de resposta. Os números descrevem a leitura inicial do texto pelo modelo; medir a geração exige outro teste. Fonte: [mudança, configuração e resultados do contribuinte](https://github.com/ggml-org/llama.cpp/pull/29948).

- **Zig passa a exigir parênteses em combinações ambíguas de operadores.** O devlog de 24 de outubro anuncia a mudança na versão de desenvolvimento. Expressões aritméticas comuns preservam as regras usuais, enquanto certas combinações passam a produzir erro de compilação. O comando `zig fmt --upgrade` insere parênteses mantendo a ordem de avaliação anterior. Revise o resultado: preservar o comportamento existente também preserva um eventual erro de intenção. Fonte: [explicação e migração no devlog do Zig](https://ziglang.org/devlog/2026/#2026-10-24).

- **OpenLDK amplia a integração entre Java e Common Lisp.** Anthony Green apresentou em 25 de outubro avanços no runtime que traduz bytecode Java para Lisp e usa o compilador SBCL para gerar código nativo. O projeto consegue executar linguagens como Kotlin e Clojure no mesmo processo. Em 20 execuções num Intel Core Ultra 7 255H, seu pequeno aplicativo Spring de linha de comando teve mediana de **83,9 milissegundos**, reutilizando estado já inicializado e salvo; o GraalVM marcou **53,5 milissegundos** na mesma comparação. A medição cobre iniciar, executar a tarefa e sair. O projeto ainda tem lacunas de compatibilidade, incluindo verificação de bytecode não implementada. Fonte: [demonstração, condições do benchmark e limitações](https://atgreen.github.io/repl-yell/posts/openldk-java-in-common-lisp/).

- **Drew Breunig descreve a dificuldade de agentes abandonarem uma hipótese.** Em análise publicada no dia 24, ele chama de “inércia de contexto” a insistência em uma subtarefa ou solução mesmo depois de ela deixar de produzir progresso. Uma estratégia discutida é preservar os arquivos e resultados do trabalho, registrar um resumo e reiniciar a conversa. Para quem constrói agentes, isso sugere separar fatos verificados, estado da tarefa e tentativas fracassadas, em vez de carregar todo o histórico indefinidamente. É uma proposta de diagnóstico do autor para avaliar quando o histórico deixa de ajudar o agente a avançar. Fonte: [texto e transcrição da apresentação](https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html).

- **Vercel reutiliza verificações para acelerar instalações com pnpm.** A melhoria anunciada hoje reaproveita verificações de dependências que já tiveram sucesso. A empresa observou redução média de **14% no tempo de instalação** em deploys Pro com cache de build restaurado. Quando as dependências permanecem iguais, o reaproveitamento evita repetir parte do trabalho. A mudança é automática e está disponível em todos os planos; o percentual informado corresponde ao grupo medido pela Vercel. Fonte: [anúncio e condições da otimização](https://vercel.com/changelog/faster-pnpm-installs).

- **Participante do comitê relata rejeição do rascunho C++26 em votação ISO.** Mateusz Pusz, integrante do grupo de evolução da biblioteca e do organismo nacional polonês, publicou no dia 25 que o texto falhou na votação encerrada em 23 de outubro. O resultado abre uma etapa de revisão e deixa o calendário indefinido. Os contratos, recurso para expressar condições esperadas pelo código, estão no centro da disputa descrita pelo autor, mas os comentários completos dos países ainda não estavam públicos. Para projetos que já usam recursos experimentais de C++26, permanece o risco de diferenças entre o rascunho implementado pelo compilador e o padrão final. Fonte: [relato de Pusz, distinção entre resultado e motivos ainda desconhecidos](https://train-it.eu/blog/cpp26-contracts-the-ballot-result/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29225
source_urls:
  - https://www.wiz.io/blog/gheist-attempted-scaled-abuse-of-stolen-github-tokens-stumbles
  - https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
  - https://blog.python.org/2026/10/python-3152-31410-31318-31216-31118/
  - https://github.com/python/cpython/issues/160040
  - https://github.com/torvalds/linux/commit/330517c63aa9b48227b6ab45f01003effac77ae4
  - https://github.com/torvalds/linux/commit/fd2bc059ed466bdd95347a4f7891d150d94e7de2
  - https://www.dreamhoststatus.com/
  - https://github.com/sottam/dualboot-linux-as-wsl
  - https://github.com/winnin/farol
  - https://news.ycombinator.com/item?id=50231349
  - https://github.com/ggml-org/llama.cpp/pull/29948
  - https://ziglang.org/devlog/2026/#2026-10-24
  - https://atgreen.github.io/repl-yell/posts/openldk-java-in-common-lisp/
  - https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html
  - https://vercel.com/changelog/faster-pnpm-installs
  - https://train-it.eu/blog/cpp26-contracts-the-ballot-result/
-->
