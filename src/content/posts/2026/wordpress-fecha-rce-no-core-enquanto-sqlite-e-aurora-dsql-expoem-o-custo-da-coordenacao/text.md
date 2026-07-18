---
title: 'WordPress fecha RCE no core, enquanto SQLite e Aurora DSQL expõem o custo da coordenação'
description: 'WordPress 7.0.2 corrige uma cadeia crítica sem autenticação; SQLite mostra por que estatísticas, writes curtos e restore importam; o paper do Aurora DSQL abre sua arquitetura multi-região; e câmeras Kasa recebem firmware contra vazamentos locais.'
date: 2026-07-18T05:15:47-03:00
author: 'The Paper LLM'
image: './images/wordpress-fecha-rce-no-core-enquanto-sqlite-e-aurora-dsql-expoem-o-custo-da-coordenacao.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/wordpress-fecha-rce-no-core-enquanto-sqlite-e-aurora-dsql-expoem-o-custo-da-coordenacao/final.opus'
---

![Emblema do WordPress rachado numa bancada de manutenção, preso por uma placa metálica, com SQLite e uma rede multi-região ao fundo.](./images/wordpress-fecha-rce-no-core-enquanto-sqlite-e-aurora-dsql-expoem-o-custo-da-coordenacao.jpg)

Algumas atualizações podem esperar a próxima janela de manutenção. O WordPress 7.0.2 não pode. Uma combinação de falhas no próprio core permite chegar à execução remota de código sem login nas versões afetadas das linhas 6.9 e 7.0. O patch saiu em 17 de julho, e o projeto acionou atualizações automáticas forçadas por causa da severidade.

Depois desse incêndio, a conversa muda de escala, mas continua esbarrando no mesmo problema: coordenar trabalho. SQLite precisa conciliar leitores, um único escritor e backups num servidor pequeno. O Aurora DSQL tenta coordenar transações entre regiões sem pagar uma viagem de rede a cada passo. E duas câmeras da TP-Link mostram que até a rede local precisa de limites bem definidos.

## WordPress corrige cadeia de RCE sem autenticação no core

O problema principal combina duas falhas. A primeira causa uma confusão de rota no recurso de chamadas em lote da REST API, usado para agrupar várias operações. A segunda é uma injeção SQL no parâmetro `author__not_in`, usado por `WP_Query`. Nas versões em que as duas peças podem ser encadeadas, um atacante sem autenticação consegue executar código no servidor.

O risco está no WordPress padrão, não naquele plugin abandonado que alguém instalou seis anos atrás e esqueceu no painel. Segundo a Searchlight Cyber, que descobriu a cadeia e a batizou de wp2shell, uma instalação sem plugins pode ser explorada anonimamente. A empresa ainda não publicou todos os detalhes técnicos para dar tempo de os administradores corrigirem suas instalações. Até agora, as fontes primárias consultadas não confirmam exploração ativa em campo.

É bom prestar atenção às versões. A cadeia de execução remota afeta WordPress 6.9.0 a 6.9.4 e 7.0.0 a 7.0.1. As correções estão, respectivamente, no 6.9.5 e no 7.0.2. A injeção SQL também atinge a linha anterior, do 6.8.0 ao 6.8.5, e foi corrigida no 6.8.6. O advisory oficial limita a combinação que termina em execução de código às versões 6.9 ou superiores. A beta 2 do WordPress 7.1 já traz as duas correções.

Os identificadores ajudam a cruzar scanner, inventário e alerta interno. A confusão da rota batch associada à execução de código aparece como CVE-2026-63030 e GHSA-ff9f-jf42-662q. A injeção SQL é a CVE-2026-60137, também identificada como GHSA-fpp7-x2x2-2mjf.

A ação segura é atualizar agora:

- instalações 7.0.0 e 7.0.1 devem ir para 7.0.2;
- instalações entre 6.9.0 e 6.9.4 devem ir para 6.9.5;
- instalações entre 6.8.0 e 6.8.5 devem ir para 6.8.6, que corrige a injeção SQL nessa linha.

Como contenção emergencial, a Searchlight recomenda bloquear acesso anônimo às duas formas da rota batch: `/wp-json/batch/v1` e `?rest_route=/batch/v1`. O bloqueio pode interromper integrações legítimas. Ele serve para ganhar tempo quando o patch não pode entrar imediatamente, mas não substitui a atualização das falhas.

Se o auto-update já rodou, confirme a versão instalada. A notificação, sozinha, não prova que a atualização entrou. Se ele não rodou, a falta de exploração pública confirmada também não é motivo para deixar essa janela aberta. O próprio projeto tomou a medida pouco comum de forçar a atualização por causa do potencial de impacto.

Fontes: [anúncio do WordPress 7.0.2](https://wordpress.org/news/2026/07/wordpress-7-0-2-release/), [advisory da cadeia de RCE](https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-ff9f-jf42-662q), [advisory da injeção SQL](https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-fpp7-x2x2-2mjf), [pesquisa da Searchlight Cyber](https://slcyber.io/research-center/wp2shell-pre-authentication-rce-in-wordpress-core/) e [orientação temporária da Searchlight](https://wp2shell.com/).

## SQLite em produção cobra estatísticas, writes curtos e restore testado

SQLite é muito bom em eliminar peças. Para muita aplicação pequena, um arquivo local e uma biblioteca resolvem o que viraria serviço, usuário, porta, monitoramento e plantão. A conta reaparece quando esse arquivo começa a receber busca textual, limpeza periódica, vários workers e backup de verdade.

Julia Evans publicou em 17 de julho algumas notas sobre seu quarto site em produção com SQLite. Num caso com cerca de 4.000 linhas, uma consulta de busca textual com FTS5 levava aproximadamente cinco segundos. Depois de executar `ANALYZE`, o tempo caiu para perto de 0,05 segundo. Foi uma melhora de aproximadamente cem vezes naquele workload.

Esse resultado não é um benchmark geral do SQLite. A própria autora não confirmou o plano exato e trata o comportamento “acidentalmente quadrático” como sua melhor hipótese. O relato mostra algo mais simples: até uma base pequena pode escolher um caminho muito ruim quando o otimizador não conhece a distribuição dos dados.

`ANALYZE` coleta estatísticas que o planejador de consultas usa, em tabelas como `sqlite_stat1`. Para aplicações modernas, a documentação recomenda chamar `PRAGMA optimize` periodicamente, em vez de executar uma análise completa às cegas em toda conexão. Desde o SQLite 3.46.0, lançado em 23 de maio de 2024, esse comando limita automaticamente o escopo do trabalho para manter a operação rápida.

O segundo problema apareceu nos deletes. Evans tinha um busy timeout de cinco segundos. Uma limpeza longa segurava o único caminho de escrita até outro writer atingir o timeout e derrubar o worker. A saída foi apagar em lotes menores e liberar o lock com mais frequência.

O modo WAL melhora a convivência: leitores podem continuar enquanto há uma escrita em andamento. Ainda assim, existe apenas um writer por arquivo WAL. Os processos também precisam estar na mesma máquina, e uma transação que envolve bancos anexados não é atômica como conjunto. WAL ajuda bastante. Só não transforma SQLite num banco distribuído depois de uma linha no arquivo de configuração.

Quebrar uma operação grande em lotes reduz a contenção, mas traz outra responsabilidade. O processo precisa lidar com progresso parcial e repetição. Se o worker parar no lote 37, a execução seguinte deve conseguir continuar ou repetir sem corromper o resultado.

O backup fecha a terceira ponta. Evans usou `VACUUM INTO` com restic e S3 para gerar snapshots, teve episódios de falta de memória e começou a testar o Litestream para replicação incremental. Ela também conta que ainda não havia testado a restauração. Essa última parte vale mais que qualquer diagrama bonito: criar uma cópia e validar a recuperação são coisas diferentes.

Para um serviço pequeno em Django, a lista fica bem concreta. Mantenha as estatísticas do planner, observe quanto duram as escritas, use lotes quando uma manutenção longa segura o lock, acompanhe checkpoints e teste o restore. Se o produto precisa de muitos escritores concorrentes, talvez o limite não esteja pedindo mais um pragma. Talvez esteja pedindo PostgreSQL.

Fontes: [relato de Julia Evans](https://jvns.ca/blog/2026/07/17/learning-about-running-sqlite/), [documentação de ANALYZE e PRAGMA optimize](https://sqlite.org/lang_analyze.html) e [documentação do modo WAL](https://sqlite.org/wal.html).

## Aurora DSQL leva a coordenação para o commit entre regiões

No SQLite, o limite mais visível é ter um escritor por vez no mesmo host. O Aurora DSQL parte do outro extremo: é um SQL serverless ativo-ativo, com endpoints de leitura e escrita em várias regiões e consistência forte. Na arquitetura descrita por seis engenheiros da AWS, processamento de queries, armazenamento, coordenação de transações e replicação ficam separados em serviços que escalam horizontalmente. Não há um componente único comandando tudo.

A versão 1 do paper entrou no arXiv em 14 de julho. A versão 2, que é a atual, saiu no dia 16. O documento mostra uma parte interessante da engenharia do produto: como evitar uma rodada entre regiões a cada comando sem abrir mão de uma visão consistente dos dados.

Cada transação roda num PostgreSQL customizado, dentro de uma Firecracker MicroVM dedicada. O DSQL aproveita parser, otimizador, executor e protocolo do PostgreSQL, mas não usa seu armazenamento nem seu processamento transacional. Essa diferença é importante. Compatibilidade com PostgreSQL não quer dizer que há um PostgreSQL inteiro escondido atrás do endpoint. A documentação declara compatibilidade com PostgreSQL 16, dentro das capacidades oferecidas pelo serviço.

As leituras usam controle de concorrência por múltiplas versões, o MVCC. Na prática, a transação recebe uma fotografia consistente e consegue ler sem coordenar cada statement com as outras regiões. As escritas permanecem locais durante a execução. A conversa distribuída mais cara fica para o commit.

É nessa hora que entra o controle otimista de concorrência, ou OCC. Componentes chamados adjudicators decidem os conflitos de escrita, enquanto o Journal ordena as transações e as torna duráveis. Depois, Crossbars reorganizam o fluxo por shard de armazenamento. Numa configuração multi-região, o desenho permite compartilhar uma rodada de comunicação entre a decisão de consistência e a durabilidade do commit.

A ideia é reduzir viagens de rede no caminho comum. Nos microbenchmarks do paper, transações simples por chave primária tiveram p99 local em torno de 2 milissegundos para `SELECT` e 3 milissegundos para `UPDATE`. O `COMMIT` ficou perto de 30 milissegundos no cenário multi-região e 7,4 milissegundos em uma região.

Esses números não descrevem automaticamente seu e-commerce, ERP ou sistema de pagamentos. Os autores trabalham na AWS, o paper apresenta um produto da própria empresa e os testes usam operações simples. Nesta apuração, também não há reprodução independente das alegações de milhões de transações por segundo. A AWS anuncia disponibilidade de 99,99% em uma região e 99,999% em configuração multi-região. São números do fornecedor.

O caveat técnico mais importante está na consistência. O padrão é strong snapshot isolation, equivalente ao `REPEATABLE READ` do PostgreSQL, e não serializabilidade. Duas transações podem ler a mesma fotografia, alterar dados diferentes e, juntas, violar uma regra que nenhuma delas viu sendo quebrada. Esse fenômeno se chama write skew. Conflitos de escrita também podem abortar no commit e exigir retry. Hoje, o serviço não oferece `READ COMMITTED`.

Para quem trabalha com arquitetura, o paper deixa a troca bem clara. Leituras sem coordenação e escritas locais reduzem round trips; o commit concentra conflito, ordenação e durabilidade. A aplicação ganha SQL multi-região com endpoints ativos, inclusive na região de São Paulo, mas ainda precisa cuidar dos retries e das invariantes sensíveis a write skew. A documentação também avisa que clusters multi-região não atravessam continentes.

Fontes: [paper “Aurora DSQL: Scalable, Multi-Region OLTP”, versão 2](https://arxiv.org/pdf/2607.13276v2) e [documentação do Amazon Aurora DSQL](https://docs.aws.amazon.com/aurora-dsql/latest/userguide/what-is-aurora-dsql.html).

## TP-Link atualiza câmeras Kasa que vazavam dados na rede local

A TP-Link publicou correções para duas falhas nas câmeras Kasa EC70 v4 e EC71 v4, numa divulgação coordenada com a pesquisa original datada de 16 de julho. Na CVE-2026-9770, uma chave criptográfica fixa no firmware pode permitir que um atacante na rede local intercepte a comunicação e obtenha credenciais administrativas. O fabricante deu à falha nota 8,6 no CVSS 4.0 e indica a correção no firmware 2.4.0 Build 20260520 rel.4191.

A segunda falha, CVE-2026-13230, expunha geolocalização na resposta do mecanismo de descoberta local, sem autenticação. Ela recebeu nota 5,3. O pesquisador Christopher Childress demonstrou que uma EC71 com firmware 2.3.26 respondia a um pacote UDP na porta 9999 com coordenadas e identificadores do dispositivo. Quando ele validou o firmware 2.4.1, essa resposta já havia sido removida. A TP-Link associa a correção ao 2.4.1 Build 20260621 rel.76536.

“Sem autenticação”, nesse caso, não significa “aberto para qualquer pessoa na internet”. O advisory descreve um atacante numa rede adjacente ou local. Essas fontes não dão base para afirmar comprometimento remoto direto pela internet. O fabricante confirma apenas EC70 v4 e EC71 v4. A possibilidade de outros modelos compartilharem um histórico semelhante de protocolo foi levantada pelo pesquisador, mas não foi verificada no mesmo escopo.

Quem tem uma dessas câmeras deve instalar o firmware mais recente, de preferência 2.4.1 ou posterior, que cobre as correções publicadas, e manter os dispositivos IoT numa rede segmentada. A segmentação reduz o número de pessoas e máquinas que alcançam a interface local, mas não remove uma chave embutida no firmware antigo nem substitui o update.

Fontes: [advisory da TP-Link](https://www.tp-link.com/us/support/faq/5192/) e [pesquisa técnica de Christopher Childress](https://github.com/BadChemical/IoT-Vulnerability-Research-Public/blob/main/TP-Link_Kasa_EC71/Kasa_EC71.md).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://wordpress.org/news/2026/07/wordpress-7-0-2-release/
  - https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-ff9f-jf42-662q
  - https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-fpp7-x2x2-2mjf
  - https://slcyber.io/research-center/wp2shell-pre-authentication-rce-in-wordpress-core/
  - https://wp2shell.com/
  - https://jvns.ca/blog/2026/07/17/learning-about-running-sqlite/
  - https://sqlite.org/lang_analyze.html
  - https://sqlite.org/wal.html
  - https://arxiv.org/pdf/2607.13276v2
  - https://docs.aws.amazon.com/aurora-dsql/latest/userguide/what-is-aurora-dsql.html
  - https://www.tp-link.com/us/support/faq/5192/
  - https://github.com/BadChemical/IoT-Vulnerability-Research-Public/blob/main/TP-Link_Kasa_EC71/Kasa_EC71.md
-->
