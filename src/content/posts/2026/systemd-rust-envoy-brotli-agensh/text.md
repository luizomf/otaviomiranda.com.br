---
title: 'systemd incorpora infraestrutura para Rust; Envoy corrige falha no Brotli'
description: 'Microsoft abre o Agensh para coordenação de agentes. A edição também traz a causa do ataque ao LiteLLM, um aviso do PHP, WireGuard Easy e resultados de IA local com seus requisitos de memória.'
date: '2026-10-25T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/systemd-rust-envoy-brotli-agensh.jpg'
---

![Modelo metálico do systemd em C conectado a um módulo laranja com o símbolo do Rust, representando novos componentes em desenvolvimento.](./images/systemd-rust-envoy-brotli-agensh.jpg)

O systemd preparou seu código de desenvolvimento para receber novos programas em Rust, com regras próprias para lidar com falta de memória e segredos. No tráfego web, instalações do Envoy com descompressão Brotli precisam conferir as versões corrigidas. A edição também traz o Agensh, da Microsoft, e resultados de IA local que ajudam a entender a divisão do trabalho entre GPU, RAM e SSD.

## systemd integra infraestrutura para novos programas em Rust

O **systemd**, conjunto de ferramentas que inicia e gerencia serviços em muitas distribuições Linux, incorporou em **24 de outubro** a infraestrutura para criar programas em Rust. A mudança está no código de desenvolvimento do projeto. A adoção começa por programas novos dos quais os demais componentes não dependem, chamados de componentes de ponta. O código C existente permanece, e a compilação continua organizada pelo Meson.

Os programas Rust usam `no_std`, sem a biblioteca padrão da linguagem, e se integram às bibliotecas C do projeto. Para armazenar dados, usam implementações próprias de estruturas como `Box` e `Vec`. Quando falta memória para uma alocação, essas estruturas devolvem um erro que o programa pode tratar, seguindo as convenções do systemd.

O projeto também associa a limpeza de segredos ao tipo usado para armazená-los. Um `Vec<u8, Erasing>` guarda bytes e apaga sua região de memória antes de liberá-la. Essa garantia tem um limite importante: retirar elementos com operações como `pop()` ou `truncate()` pode deixar os dados na memória até a liberação do espaço.

O primeiro programa proposto para usar essa base, `systemd-keyring-setup`, segue em uma mudança separada. Para quem mantém software em C, o caso mostra como uma adoção gradual precisa definir também as fronteiras de integração, o tratamento de erros e o ciclo de vida dos dados.

Fonte: [proposta incorporada ao systemd, com regras e justificativas](https://github.com/systemd/systemd/pull/44324).

## Envoy precisa de atualização quando o descompressor Brotli está configurado

Depois da [cobertura sobre Node.js e pacotes Python](/2026/infinity-agentes-brotli-node-python-cloudflare-cache/), a mesma **CVE-2026-111497** exige conferir também o **Envoy**, proxy que pode intermediar o tráfego entre clientes e serviços. O aviso do projeto, de **23 de outubro**, delimita a exposição às instalações **com o descompressor Brotli configurado**.

Segundo o boletim, um fluxo comprimido malformado pode provocar escritas fora da região de memória reservada pelo decodificador. As consequências incluem vazamento de dados da memória, queda do processo e possível execução de código por um atacante remoto sem autenticação.

O Envoy lista **1.39.2, 1.38.5, 1.37.7 e 1.36.11** como versões afetadas. As correções estão em **1.40.0, 1.39.3, 1.38.6, 1.37.8 e 1.36.12**. Confira a versão realmente implantada e a configuração de descompressão. Se o proxy vier dentro de outro produto, procure a atualização do fornecedor correspondente.

A consequência prática é ampliar o inventário: além das bibliotecas da aplicação, verifique quais componentes no caminho de entrada ou saída descomprimem conteúdo não confiável. A atualização do proxy precisa entrar nessa revisão junto com a da aplicação.

Fontes: [boletim do Envoy](https://github.com/envoyproxy/envoy/security/advisories/GHSA-3wvj-j6qm-62mr) e [correção do Brotli](https://github.com/google/brotli/releases/tag/v1.2.1).

## Microsoft abre Agensh e relata mais testes aprovados com equipes de agentes

A Microsoft publicou em **24 de outubro** o código do **Agensh**, estrutura para agentes dividirem trabalho de programação. Cada agente escolhe subtarefas, compartilha descobertas, verifica resultados e integra alterações sem esperar que todos terminem. O Gitea fornece o espaço de desenvolvimento compartilhado; o Mattermost transporta as mensagens entre participantes.

Nos cinco problemas mais difíceis do ProgramBench, os autores relatam que a média da proporção de testes aprovados passou de **19,31% com um agente para 28,78% com 128 agentes**. O experimento usou GPT-5.6-sol, esforço de raciocínio alto, seis horas por tarefa e nenhum acesso à internet. Os agentes reconstruíam programas a partir de observações de comportamento e documentação fornecida.

É um ganho de **9,47 pontos percentuais**, com a maior parte dos testes ainda falhando. A medida descreve quanto do comportamento esperado passou nas verificações; ela permite acompanhar progresso parcial em cada tarefa. Para avaliar uma adoção, registre testes aprovados, custo e tempo de execução juntos.

O código publicado inclui instruções de reprodução, mas o projeto avisa que a infraestrutura distribuída agora difere da usada no experimento histórico. Uma nova execução precisa registrar sua versão e configuração para permitir uma comparação honesta.

Fontes: [anúncio, arquitetura e resultados do Agensh](https://github.com/microsoft/Agensh) e [condições de reprodução](https://raw.githubusercontent.com/microsoft/Agensh/main/REPRODUCE.md).

## Destaques rápidos para hoje.

- **LiteLLM atribui o ataque a uma chave exposta em maio e não revogada.** O relatório final de 23 de outubro atualiza o [incidente que cobrimos no mesmo dia](/2026/litellm-1-107-0-malware-php2shell-correcoes-thinkingbox/). Segundo a empresa, a chave permitiu acessar sua plataforma experimental de agentes e obter um token GitHub de um proprietário da organização. Outros tokens roubados permitiram aprovar a publicação maliciosa. O relatório corrige a hipótese inicial de que o primeiro token teria vindo de logs. A lição operacional é verificar a revogação: apagar o segredo do repositório precisa vir acompanhado da invalidação da credencial. Fonte: [análise final do LiteLLM](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain).

- **PHP recomenda desativar o progresso de upload em uma combinação específica de configurações.** O aviso de 23 de outubro sobre a **CVE-2026-115560** acrescenta uma orientação aos [patches do PHP2Shell](/2026/litellm-1-107-0-malware-php2shell-correcoes-thinkingbox/). O risco exige progresso de upload habilitado, `session.serialize_handler` configurado como `php_binary` ou `php_serialize` e mudança para `php` via `ini_set()` antes de `session_start()`. O projeto sugere `session.upload_progress.enabled=0` até a próxima versão regular de correções; quem já aplicou essa mitigação deve mantê-la. Aplicações que nunca mudam o serializador durante a execução podem manter o recurso, segundo o PHP. Fonte: [aviso oficial sobre progresso de upload](https://www.php.net/archive/2026.php).

- **WireGuard Easy 15.5.0 reduz a circulação de chaves na API administrativa.** Lançada em 24 de outubro, a interface de gerenciamento de VPN deixa de retornar `privateKey` e `preSharedKey` na consulta de detalhes de um cliente. A tela de edição não precisava desses campos; downloads de configuração e QR codes continuam em rotas próprias. A versão também traz atualizações de segurança do Node.js, configuração de proxies confiáveis e suporte ao AmneziaWG 3.1. Revise o acesso administrativo ao atualizar. Fontes: [release](https://github.com/wg-easy/wg-easy/releases/tag/v15.5.0) e [explicação da remoção dos segredos](https://github.com/wg-easy/wg-easy/pull/2822).

- **Wild 0.11 passa a ligar módulos do kernel Linux e habilita WebAssembly por padrão.** O linker, ferramenta que reúne partes compiladas de um programa, recebeu a versão em 24 de outubro. O suporte a WebAssembly ainda tem limitações de informações de depuração. Outra mudança limita a execução a 32 threads por padrão: segundo os mantenedores, números maiores podiam piorar o desempenho pela disputa por uma trava do Linux associada ao arquivo. Fonte: [notas do Wild 0.11.0](https://github.com/wild-linker/wild/releases/tag/0.11.0).

- **Lean-QwenFlash relata geração de 20 tokens por segundo com partes do modelo no SSD.** O autor mediu o Qwen3.8-Flash-Next com contexto de 262 mil tokens, as unidades de texto processadas pelo modelo. O teste usou uma RTX 4090 limitada a 16 GB de memória de vídeo, cerca de 8 GB de RAM, pesos quantizados no formato exl3 e cache de contexto de 4 bits. As partes do modelo chamadas especialistas que faltam no cache são carregadas do SSD NVMe, e seus cálculos ficam na GPU. O projeto recomenda SSD com leitura de cerca de 3 GB/s ou mais. A economia de RAM depende dessa movimentação de dados; o resultado deve ser lido junto com o hardware e a configuração usados. Fonte: [método, hardware e medições do autor](https://github.com/MaxDevv/lean-qwenflash).

- **ISTA publica versões comprimidas do DeepSeek que exigem olhar além da memória da GPU.** Os arquivos GSQ-RCO do DeepSeek-V4.1-Flash-1017, publicados em 23 de outubro, usam precisões diferentes para partes do modelo. O laboratório informa execução com o motor Strata em uma GPU de 12 GB, mantendo o restante dos pesos em memória do sistema e tabelas auxiliares no SSD. Os arquivos completos somam aproximadamente **231 a 266 GB**, conforme a variante. Antes de baixar, dimensione RAM, armazenamento e ambiente de execução; os 12 GB descrevem apenas a memória de vídeo. Fonte: [model card, arquivos e requisitos](https://huggingface.co/ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF).

- **Sentinela é apresentado à comunidade para monitorar regras de negócio com Python.** O autor compartilhou o projeto no TabNews com exemplos como pedidos pagos sem envio e assinaturas renovadas sem fatura. Cada monitor define como encontrar entidades com problema, atualizar seu estado e reconhecer a resolução. Isso permite acompanhar uma falha de negócio mesmo quando o serviço continua respondendo normalmente. O trabalho da equipe começa por escrever a regra que descreve o resultado esperado. Fontes: [apresentação do autor](https://www.tabnews.com.br/NullPointerException/estou-desenvolvendo-ha-3-anos-uma-ferramenta-open-source-para-monitorar-regras-de-negocio-e-gostaria-de-compartilhar-com-voces) e [documentação do Sentinela](https://github.com/GabrielSalla/sentinela).

- **Sebastian Raschka publica oito aulas sobre modelos de raciocínio.** A série de 24 de outubro reúne cerca de 11 horas de implementação em Python e PyTorch, partindo de um pequeno Qwen3 já treinado. O percurso cobre avaliação, geração de múltiplas respostas, aprendizado por reforço e destilação — treinamento com respostas de um modelo professor. O autor recomenda familiaridade com Python e PyTorch; os primeiros exemplos podem rodar em CPU, enquanto uma GPU torna os experimentos de treinamento mais práticos. Fonte: [curso e pré-requisitos](https://magazine.sebastianraschka.com/p/building-reasoning-models).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29160
source_urls:
  - https://github.com/systemd/systemd/pull/44324
  - https://github.com/envoyproxy/envoy/security/advisories/GHSA-3wvj-j6qm-62mr
  - https://github.com/google/brotli/releases/tag/v1.2.1
  - https://github.com/microsoft/Agensh
  - https://raw.githubusercontent.com/microsoft/Agensh/main/REPRODUCE.md
  - https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain
  - https://www.php.net/archive/2026.php
  - https://github.com/wg-easy/wg-easy/releases/tag/v15.5.0
  - https://github.com/wg-easy/wg-easy/pull/2822
  - https://github.com/wild-linker/wild/releases/tag/0.11.0
  - https://github.com/MaxDevv/lean-qwenflash
  - https://huggingface.co/ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF
  - https://www.tabnews.com.br/NullPointerException/estou-desenvolvendo-ha-3-anos-uma-ferramenta-open-source-para-monitorar-regras-de-negocio-e-gostaria-de-compartilhar-com-voces
  - https://github.com/GabrielSalla/sentinela
  - https://magazine.sebastianraschka.com/p/building-reasoning-models
-->
