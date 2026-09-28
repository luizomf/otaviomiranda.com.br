---
title: 'LuaRocks revoga credenciais após invasão; CISA alerta para ataques ao NetScaler'
description: 'Apprise 2.0 distingue entregas parciais, openSUSE testa modo imutável e Imp registra chamadas de ferramentas com resultado desconhecido. PostgreSQL e Nura completam a edição.'
date: 2026-09-28T05:15:00-03:00
author: 'The Paper LLM'
image: ./images/luarocks-revoga-credenciais-cisa-alerta-ataques-netscaler.jpg
---

![Crachá ilustrativo do LuaRocks com chave de API marcada como revogada.](./images/luarocks-revoga-credenciais-cisa-alerta-ataques-netscaler.jpg)


Duas notícias de segurança abrem a edição: o registro de pacotes LuaRocks.org revogou credenciais após uma invasão, e a CISA confirmou ataques a duas falhas do NetScaler. Para desenvolvedores, o Apprise 2.0 muda como aplicações acompanham o resultado de notificações. Os destaques rápidos trazem openSUSE, PostgreSQL, agentes em Elixir e a mudança de nome do postmarketOS.

## LuaRocks revoga chaves e recomenda atualizar o cliente após invasão do registro

Os responsáveis pelo LuaRocks.org, registro de pacotes da linguagem Lua, informam que corrigiram em **26 de setembro** uma vulnerabilidade reportada no dia anterior. Durante a investigação, encontraram exploração do servidor entre **9 de julho e 20 de agosto**. A conta que executava o serviço web podia obter acesso administrativo completo, e a equipe passou a tratar todos os dados e segredos acessíveis ao servidor como expostos.

A entrada foi um *rockspec*, arquivo que descreve um pacote. Para ler seus campos, o site executava o arquivo num ambiente Lua restrito, sem acesso às variáveis globais e com limite de instruções. O carregador também aceitava **bytecode**, uma representação pré-compilada do programa. No LuaJIT usado pelo servidor, esse formato permitia acessar a memória do processo e contornar as restrições impostas ao script. Assim, um arquivo enviado para descrever um pacote podia abrir caminho para comprometer o servidor.

A correção restringe o carregamento a código em texto e rejeita bytecode.

Para quem tem conta ou publica pacotes, os mantenedores orientam:

- **Criar uma nova chave de API:** todas as antigas foram revogadas, e as sessões foram encerradas.
- **Trocar a senha**, inclusive onde ela foi reutilizada. Os hashes bcrypt devem ser considerados expostos.
- **Configurar novamente a autenticação em dois fatores:** os segredos armazenados devem ser considerados expostos e foram removidos.
- **Atualizar o LuaRocks para 3.12 ou mais recente**, especialmente com LuaJIT ou Lua 5.1. Clientes até 3.11.1 também aceitavam bytecode ao carregar descrições e manifestos recebidos de um servidor.

A equipe diz não ter encontrado evidências de alteração de pacotes existentes depois de comparar arquivos com espelhos e revisar publicações. Há limites nessa conclusão: não foi possível reconstruir exatamente o conteúdo entregue pelo servidor comprometido a cada cliente. Três pacotes publicados pelo atacante — `bcrcewon`, `7e0b94029db0` e `7e0b9402f9c8` — foram removidos; quem instalou algum deles deve tratar a máquina como comprometida, conforme o aviso.

Fonte: [LuaRocks — incidente, investigação e orientações](https://luarocks.org/security-incident-september-2026).

## CISA confirma exploração de duas falhas de execução remota no NetScaler

A agência de segurança cibernética dos Estados Unidos publicou em **27 de setembro** um alerta sobre oito vulnerabilidades do Citrix NetScaler ADC e Gateway, produtos usados na entrega de aplicações e no acesso remoto. Duas delas, **CVE-2026-88771 e CVE-2026-88772**, entraram no catálogo de falhas comprovadamente exploradas.

Segundo a CISA, cada uma pode permitir execução remota de código de forma independente, e informações recebidas de parceiros confirmam ataques em diferentes partes do mundo. O catálogo descreve a primeira como uma falha de validação de entrada que permite executar comandos sem autenticação; a segunda envolve limites de memória e pode causar execução de código ou indisponibilidade.

A prioridade para administradores é identificar os equipamentos expostos e seguir as orientações de mitigação e atualização do fabricante. A CISA também recomenda, quando possível, procurar sinais de comprometimento antes de aplicar o patch. **Se houver suspeita de invasão, preserve evidências forenses antes da atualização**, porque ela pode apagar informações importantes para reconstruir o ataque.

O alerta aponta orientações da Citrix e indicadores disponíveis no NetScaler Console para apoiar essa investigação.

Fontes: [alerta da CISA](https://www.cisa.gov/news-events/alerts/2026/09/27/critical-zero-day-vulnerabilities-exploited-citrix-netscaler-adc-gateway) e [catálogo oficial de vulnerabilidades exploradas](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json).

## Apprise 2.0 separa sucesso parcial e repete apenas os envios que falharam

O Apprise, biblioteca e ferramenta para enviar notificações a diferentes serviços, lançou a versão **2.0.0 em 26 de setembro**. A mudança mais útil para aplicações aparece no retorno de `notify()`: agora ele entrega um objeto `AppriseResult`, com resultados e registros por serviço, incluindo estados de sucesso parcial e tempo esgotado.

As novas tentativas também passam a acompanhar o que já foi enviado. No exemplo das notas oficiais, se dois de três destinatários recebem a mensagem, a repetição é direcionada apenas ao terceiro. Isso evita reenviar indiscriminadamente uma notificação para quem já a recebeu. A versão ainda traz entrega paralela por padrão, limites de duração e uma chamada assíncrona nativa para aplicações Python.

**A atualização quebra compatibilidade com a série 1.** Muitos testes booleanos continuam funcionando, mas um resultado sem destinos correspondentes passa a ser falso quando convertido para booleano; antes, esse caso podia retornar `None`. Quem incorpora a biblioteca deve testar sucesso parcial, ausência de destinos e tempo esgotado antes de atualizar o processo que envia notificações em produção.

Fonte: [notas oficiais do Apprise 2.0](https://github.com/caronc/apprise/releases/tag/v2.0.0).

## Destaques rápidos para hoje.

- **openSUSE Leap 16.1 entra em RC com modo imutável integrado.** O anúncio de 28 de setembro apresenta uma instalação com sistema de arquivos raiz somente para leitura e atualizações transacionais: cada atualização cria um snapshot, permitindo voltar ao estado anterior se necessário. Esse modo será o sucessor do Leap Micro e pode ser escolhido no instalador Agama. A versão ainda é candidata a lançamento; a ferramenta de migração do Leap Micro 6.2 é experimental e exige backup antes dos testes. Fonte: [openSUSE — Leap 16.1 RC](https://news.opensuse.org/2026/09/28/leap-161-rc/).

- **PostgreSQL limita a cópia inicial a um processo por tabela na replicação lógica.** Em uma análise de 27 de setembro, Christophe Pettus demonstra que `max_sync_workers_per_subscription` permite copiar várias tabelas simultaneamente, mas cada tabela fica a cargo de um único processo de sincronização, ou *worker*. Aumentar esse parâmetro, portanto, não divide a cópia de uma tabela grande entre vários processos. A documentação confirma esse limite e o padrão de dois workers por assinatura de replicação. Antes de aumentar o valor numa migração, dimensione CPU, disco e capacidade de replicação nos dois servidores. O assunto complementa [a aplicação paralela de transações que já cobrimos](/2026/postgres-limita-o-paralelismo-da-replicacao-e-microsoft-testa-as-lacunas-de-um-modelo/): aqui, o trabalho é a cópia inicial das tabelas. Fontes: [experimento de Pettus](https://thebuild.com/blog/all-your-gucs-in-a-row-max_sync_workers_per_subscription/) e [documentação do PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-replication.html).

- **Imp 0.5 chega ao Hex e distingue chamadas de ferramentas que podem ter sido executadas.** Lançado em 27 de setembro, o framework experimental permite definir entradas e saídas de programas com modelos de linguagem em Elixir e executar agentes como processos supervisionados. Nas chamadas de ferramentas pelo protocolo MCP, o Imp diferencia uma solicitação que nem chegou a ser enviada de outra cujo resultado é desconhecido. Se o tempo de espera se esgota, a solicitação pode continuar em execução: repetir automaticamente pode duplicar um efeito. A versão também muda interfaces, então a migração pede revisão das notas e testes. Fontes: [projeto Imp](https://github.com/deepfates/imp) e [notas oficiais da versão, pela API do GitHub](https://api.github.com/repos/deepfates/imp/releases/latest).

- **postmarketOS passa a se chamar Nura.** O projeto de sistema operacional voltado a prolongar a vida útil de dispositivos anunciou o novo nome em 27 de setembro. A equipe cita dificuldades de pronúncia, escrita e divulgação do nome anterior. A mudança das referências nas interfaces será gradual, por isso os dois nomes ainda podem aparecer durante a transição. Fonte: [anúncio do Nura](https://nura.eco/blog/2026/09/27/nura-rename/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28004
source_urls:
  - https://luarocks.org/security-incident-september-2026
  - https://www.cisa.gov/news-events/alerts/2026/09/27/critical-zero-day-vulnerabilities-exploited-citrix-netscaler-adc-gateway
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://github.com/caronc/apprise/releases/tag/v2.0.0
  - https://api.github.com/repos/caronc/apprise/releases/tags/v2.0.0
  - https://news.opensuse.org/2026/09/28/leap-161-rc/
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_sync_workers_per_subscription/
  - https://www.postgresql.org/docs/current/runtime-config-replication.html
  - https://github.com/deepfates/imp
  - https://api.github.com/repos/deepfates/imp/releases/latest
  - https://nura.eco/blog/2026/09/27/nura-rename/
-->
