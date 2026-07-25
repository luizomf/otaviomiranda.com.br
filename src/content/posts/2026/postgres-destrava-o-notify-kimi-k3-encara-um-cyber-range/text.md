---
title: 'Postgres destrava o NOTIFY; Kimi K3 encara um cyber range'
description: 'DBOS leva streams no PostgreSQL a 60 mil escritas por segundo com notificações em lote, enquanto uma avaliação oficial mede até onde o Kimi K3 chega em exploração e ataque de rede.'
date: 2026-07-25T05:15:34-03:00
author: 'The Paper LLM'
image: './images/postgres-destrava-o-notify-kimi-k3-encara-um-cyber-range.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/postgres-destrava-o-notify-kimi-k3-encara-um-cyber-range/final.opus'
---

![Elefante azul do PostgreSQL agrupa bilhetes de notificação diante de uma catraca.](./images/postgres-destrava-o-notify-kimi-k3-encara-um-cyber-range.jpg)

Tem uma diferença grande entre fazer uma coisa funcionar e fazê-la aguentar todo mundo usando ao mesmo tempo. Hoje isso aparece em dois lugares bem diferentes: no PostgreSQL entregando eventos sem mandar cada commit para a mesma catraca e num modelo de IA tentando atravessar uma rede simulada com dezenas de etapas. Os números chamam atenção, claro. Mas o caminho até eles conta a parte mais interessante da história.

## DBOS tira cada escrita da fila global do NOTIFY

Usar PostgreSQL como parte de um sistema de eventos é tentador. O dado já está ali, a equipe conhece SQL e adicionar outro serviço à produção nunca traz só o serviço. Vêm junto deploy, monitoramento, retenção, custo e aquela documentação nova que alguém vai precisar descobrir às três da manhã.

A complicação começa quando `LISTEN` e `NOTIFY` precisam atender mais do que um fluxo modesto. O `LISTEN` mantém uma sessão esperando sinais de um canal; o `NOTIFY` publica o sinal quando a transação confirma. Segundo a DBOS, a primeira implementação de streams da empresa disparava um `NOTIFY` a cada escrita e parava em até 2,9 mil escritas por segundo.

A tabela não era o gargalo. Transações com `NOTIFY` precisam pegar um lock exclusivo global durante o commit, inclusive no trecho que chega ao `fsync`. O lock preserva a ordem das notificações conforme os commits, mas obriga cada transação a esperar a anterior. O banco perde a chance de agrupar commits, e uma feature leve vira a catraca única do estádio inteiro.

A DBOS resolveu mudar o papel da notificação. A tabela continuou como fonte de verdade, enquanto os sinais passaram a ser acumulados em memória e descarregados em lote numa transação. Assim, várias notificações percorrem juntas o caminho serializado, em vez de uma por evento.

Só que memória cai, processo reinicia e Murphy também acompanha changelog. Se a aplicação morrer antes de esvaziar o lote, o dado continua na tabela. Um polling periódico busca o que ficou para trás. Como ele serve para recuperar sinais perdidos, e não como caminho normal de baixa latência, pode rodar com pouca frequência.

No benchmark da própria DBOS, com leitores concorrentes, o desenho chegou a até 60 mil stream writes por segundo. É cerca de 20 vezes o resultado anterior, com latência reportada entre 15 e 100 milissegundos. No limite, a CPU do PostgreSQL ficou saturada. A empresa também publicou o código e a infraestrutura usados para medir inserts, workflows, filas e throughput de streams. Pelo menos a bancada está aberta para inspeção e reprodução.

Ainda são números da DBOS, em hardware e workload específicos, sem reprodução independente nesta apuração. O patch citado para o PostgreSQL 19 melhora o caso com muitos canais e listeners específicos, mas, segundo a empresa, não remove o lock global responsável pelo gargalo.

O limite operacional pesa ainda mais. Nesse desenho, `NOTIFY` é um sinal, não uma fila durável ou perfeitamente ordenada. A durabilidade fica na tabela, e a recuperação depende do polling. Isso pode evitar um broker em alguns sistemas, mas não faz do PostgreSQL um equivalente geral a Kafka, RabbitMQ ou BullMQ. Retenção, replay, particionamento, backpressure, ordenação e rotina operacional ainda decidem a arquitetura.

Para um time que já grava eventos no banco e só precisa acordar consumidores com baixa latência, há um caminho concreto: mantenha o evento durável, agrupe os avisos e assuma que alguma notificação vai se perder. Se os requisitos forem além disso, a catraca melhorou, mas o estádio continua o mesmo.

Fontes: [DBOS](https://www.dbos.dev/blog/postgres-listen-notify-scalability) e [repositório público do benchmark](https://github.com/dbos-inc/dbos-postgres-benchmark).

## Kimi K3 avança no ataque, mas não fecha a exploração

O Kimi K3 foi lançado em 16 de julho, com a abertura dos pesos prevista para o dia 27. Nós já cobrimos [a arquitetura do modelo e essa promessa](/2026/o-agente-instala-o-que-o-readme-mandar-a-openai-admite-que-o-sol-apaga-arquivos/). Agora apareceu algo mais útil do que outra tabela do fabricante: os institutos de segurança de IA do Reino Unido e dos Estados Unidos publicaram uma avaliação preliminar das capacidades cibernéticas do modelo.

Um dos testes foi o ExploitBench, com 41 vulnerabilidades recentes do motor JavaScript V8. O teste não se limita a perguntar se o modelo "explorou a falha". Ele separa etapas como provocar um crash, conseguir leitura ou escrita arbitrária, desviar o fluxo e chegar à execução arbitrária de código.

O Kimi K3 marcou 32%, contra 24% do GLM-5.2. Isso não quer dizer que ele comprometeu 32% das máquinas — nem havia máquinas reais nessa conta. No resultado mais forte, execução arbitrária de código, o Kimi ficou em zero das 41 amostras. Os modelos mais capazes avaliados chegaram, em média, a 20 de 41.

A segunda parte colocou o modelo no TLO, um cyber range com 32 etapas, quatro sub-redes e cerca de 20 hosts. Um cyber range é uma rede simulada e controlada. Ajuda a repetir uma cadeia de ataque, mas tem bem menos caos do que produção. O Kimi chegou, em média, ao passo 17 e concluiu o cenário em uma de dez tentativas, com limite de 100 milhões de tokens. Os modelos fechados mais capazes dos Estados Unidos alcançaram, em média, o passo 28,5.

A distância importa, só que o ambiente também. O TLO entrega acesso inicial e um caminho intencional, usa hosts vulneráveis, não tem defesa ativa e não pune o modelo por gerar alertas. É quase uma rede dizendo "pode entrar" enquanto aponta o corredor. Capacidade nesse ambiente não demonstra exploração real, autorização ou intenção fora do laboratório.

A comparação agregada também não é perfeitamente simétrica. O Kimi foi medido de forma seletiva, e seu score vem de um único benchmark com 41 tarefas, o que aumenta o intervalo de confiança. Outros modelos têm resultados em mais domínios, e os modelos fechados foram testados com as salvaguardas de sistema desativadas. A própria avaliação é preliminar.

Para equipes de segurança, o resultado fica bem longe tanto de "IA já invade tudo" quanto de "não consegue fazer nada". O Kimi superou outro modelo open-weight no ExploitBench e completou uma longa cadeia pelo menos uma vez. Mesmo assim, não conseguiu execução arbitrária de código em nenhuma das 41 amostras e falhou na maioria das tentativas de rede. Já é motivo para avaliar permissões e ambientes com cuidado se os pesos forem abertos, caso a previsão para 27 de julho se confirme. Ainda não é motivo para tratar um benchmark controlado como incidente de produção.

Fonte: [NIST, U.S. CAISI e UK AISI](https://www.nist.gov/news-events/news/2026/07/uk-aisi-caisi-preliminary-assessment-kimi-k3s-cyber-capabilities).

## Radar rápido

**Zalando levou o fan-out para dentro do processo, mas não recomenda copiar:** num estudo de caso publicado originalmente em 23 de junho e recirculado agora, a empresa contou como tirou do proxy Skipper uma rota interna que abria até 100 chamadas paralelas. O cliente reproduziu `xxHash64` e 100 virtual nodes para manter o mesmo anel de consistent hashing e não dividir os caches durante o canário. Com toggles de 1% a 100% e fallback para o proxy, a Zalando diz ter removido mais de um milhão de requests por segundo do Skipper no pico. A frota associada caiu de mais de 50 pods para 8, e o custo diário, de cerca de US$ 450 para US$ 110. Os números são da própria empresa, e o módulo continua interno. Para quase todo mundo, a recomendação da Zalando ainda é usar um proxy maduro como Skipper ou Envoy. Internalizar discovery, RBAC, watchers, staleness e balanceamento no hot path só compensou nesse caso extremo. Fonte: [Zalando Engineering](https://engineering.zalando.com/posts/2026/06/client-side-load-balancing.html).

**Buz tenta manter o Bun em Zig, mas ainda é projeto de bancada:** depois de [o Bun 1.4 migrar oficialmente para Rust](/2026/bun-troca-zig-por-rust-gitea-1-27-pede-patch-e-teste-no-ci/), um mantenedor anunciou em 24 de julho um fork do último commit anterior à mudança. Segundo o autor, o Buz já acompanha o Zig atual, moveu o grafo para `build.zig`, faz builds incrementais em menos de um segundo e removeu mais de 11 mil linhas de código morto. Ele também importou testes novos do Bun em Rust e admite que muitos ainda falham. Compatibilidade com Bun 1.4.0 é um objetivo futuro, não o estado atual. Desempenho e limpeza de bugs também seguem como alegações sem validação independente. Por enquanto, quem usa Bun em produção deve continuar no upstream. Fonte: [anúncio do Buz no Ziggit](https://ziggit.dev/t/buz-a-drop-in-replacement-for-bun-using-modern-zig-with-sub-1s-incremental-builds/16891).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://www.dbos.dev/blog/postgres-listen-notify-scalability
  - https://github.com/dbos-inc/dbos-postgres-benchmark
  - https://www.nist.gov/news-events/news/2026/07/uk-aisi-caisi-preliminary-assessment-kimi-k3s-cyber-capabilities
  - https://engineering.zalando.com/posts/2026/06/client-side-load-balancing.html
  - https://ziggit.dev/t/buz-a-drop-in-replacement-for-bun-using-modern-zig-with-sub-1s-incremental-builds/16891
-->
