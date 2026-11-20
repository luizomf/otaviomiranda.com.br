---
title: 'PostgreSQL 19 chega com REPACK sem travar a tabela, e PHP 8.6 sai junto com correções para sete falhas críticas'
description: 'O PostgreSQL 19 traz REPACK (CONCURRENTLY), WAIT FOR LSN e JIT desligado por padrão, com um atraso que um committer atribui aos bugs achados por IA. O PHP lançou o 8.6.0 e versões de segurança para os ramos 8.2 a 8.5. Também nesta edição: o APT do Debian corta formatos antigos de repositório, um estudo mostra que a maioria dos danos reais causados por agentes de IA não teve atacante, Valkey 9.2, zero-day no vCenter, a estreia da Anthropic na Nasdaq e a ANPD mantendo as lives do Discord suspensas.'
date: '2026-11-20T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/postgresql-19-php-8-6-apt-repositorios-antigos-agentes-sem-atacante.jpg'
---

![Elefante azul de feltro, mascote do PostgreSQL, amarrado por uma cinta de papel com a palavra REPACK, ao lado de uma etiqueta com o número 19, sobre fundo de feltro vermelho-coral](./images/postgresql-19-php-8-6-apt-repositorios-antigos-agentes-sem-atacante.jpg)

Esta sexta é dia de atualizar a pilha de quem desenvolve para a web. O PostgreSQL 19 saiu com um comando que limpa tabelas inchadas sem parar a aplicação. O PHP lançou a versão 8.6 e, no mesmo dia, as correções de segurança que anunciamos ontem. Segundo um dos seus committers, o PostgreSQL atrasou porque a IA está achando bugs mais rápido do que o projeto consegue corrigir. O mantenedor do APT, o gerenciador de pacotes do Debian, cita a mesma pressão e decidiu responder apagando código. Fechamos com um estudo que reconstruiu mais de cem incidentes com agentes de IA e concluiu que, na maioria dos danos reais, não havia atacante nenhum.

## PostgreSQL 19 sai com REPACK, que limpa tabelas sem bloquear escrita, e WAIT FOR LSN, para ler numa réplica o que acabou de ser gravado

O projeto PostgreSQL lançou nesta quinta (19) a versão **19** do banco de dados. Ela chega fora da janela de costume: nos últimos dez anos, as versões principais saíram entre meados de setembro e meados de outubro. Num post de 30 de outubro, o committer Robert Haas, da Databricks, atribuiu o atraso aos modelos de linguagem. Segundo ele, a IA ficou muito boa em achar bugs, e a capacidade de corrigi-los melhorou menos. As correções propostas por IA nem sempre vêm corretas ou dentro do padrão do projeto, e alguém precisa revisar. Haas contou as correções aplicadas também ao ramo da versão que estava para sair, entre 8 de abril e 25 de setembro: foram 1.169 no ramo do 19 em 2026, contra 724 no ramo do 18 no mesmo período de 2025, mais de 60% a mais. Três recursos grandes foram retirados antes do lançamento: `UPDATE/DELETE FOR PORTION OF`, SQL/PGQ (consultas de grafos) e `ALTER TABLE ... MERGE/SPLIT PARTITION`.

**REPACK, o destaque para quem opera banco em produção.** No PostgreSQL, atualizar ou apagar uma linha não sobrescreve o dado no lugar: a versão antiga fica no arquivo até o `VACUUM` marcar aquele espaço como reutilizável. Em tabelas com muita escrita, o arquivo incha e não encolhe sozinho. Até agora, a ferramenta embutida para devolver esse espaço era o `VACUUM FULL`, que reescreve a tabela inteira com um bloqueio exclusivo: ninguém lê nem escreve enquanto ele roda. Quem não podia parar recorria a extensões externas, como o pg_repack.

O 19 traz o comando `REPACK`, que substitui o `VACUUM FULL` e o `CLUSTER` (os dois continuam existindo por compatibilidade). Com a opção `CONCURRENTLY`, a reescrita acontece com a tabela aberta para leitura e escrita, e o bloqueio exclusivo fica só para a troca final dos arquivos, normalmente curta. Por baixo, as mudanças feitas durante a reescrita são capturadas com decodificação lógica, o mesmo mecanismo da replicação lógica.

A documentação lista as condições. A tabela precisa ter chave primária ou um índice usado como identidade de réplica, e não pode ser particionada nem `UNLOGGED`. É preciso ter espaço livre em disco de pelo menos o tamanho da tabela somado ao dos índices, porque o comando monta uma cópia completa. O comando falha se mais de uns 104 milhões de linhas forem alteradas ou apagadas durante a execução, e pode não terminar se outra transação mudar a estrutura da tabela no meio do caminho. E há um aviso que merece atenção: o `REPACK (CONCURRENTLY)` **não é seguro para MVCC**. Uma transação que pegou seu retrato dos dados (o *snapshot*) antes do início do repack vai enxergar a tabela vazia depois que ele terminar. Relatórios longos rodando durante a manutenção são o caso a vigiar.

**WAIT FOR LSN: ler o que você acabou de gravar.** Muitas aplicações mandam as escritas para o servidor principal e as leituras para réplicas. A réplica recebe as mudanças pelo WAL, o registro de alterações do PostgreSQL, sempre com algum atraso. Resultado clássico: o usuário salva um formulário, a página recarrega lendo da réplica e mostra o dado antigo. O LSN (*log sequence number*) é a posição de um registro dentro do WAL, e o comando novo usa essa posição para esperar a réplica alcançar a escrita.

O fluxo da documentação é este: depois de gravar no principal, a aplicação pega a posição atual do WAL com `SELECT pg_current_wal_insert_lsn();`, que devolve algo como `0/0306EE20`. Na leitura seguinte, já na réplica, ela roda antes da consulta:

```sql
WAIT FOR LSN '0/0306EE20' WITH (TIMEOUT '100ms');
```

Se a réplica não alcançar essa posição dentro do prazo, o comando dá erro, e a aplicação pode ler do principal. Com a opção `NO_THROW`, ele devolve um status (`success`, `timeout` ou `not in recovery`) em vez do erro. Sem `TIMEOUT`, a espera é indefinida. O `WAIT` precisa ser o primeiro comando da transação: ele não roda dentro de função nem de bloco `DO`, e é recusado se a sessão já segura um bloqueio, porque isso poderia travar a aplicação das mudanças na réplica.

**Outras mudanças que valem conhecer:**

- **Replicação lógica sem reiniciar o servidor.** Com `wal_level = replica`, o PostgreSQL agora sobe sozinho o nível efetivo para `logical` quando você cria o primeiro slot de replicação lógica. O novo parâmetro `effective_wal_level` mostra o nível em uso. Antes, ligar a replicação lógica costumava exigir restart.
- **Planos de consulta estáveis.** A extensão `pg_plan_advice` permite fixar escolhas do planejador com uma minilinguagem de "conselhos". A `pg_stash_advice` guarda esses conselhos e os aplica pelo identificador da consulta, o que permite corrigir um plano lento sem mexer no código da aplicação.
- **JIT desligado por padrão.** O anúncio diz que as estimativas de custo usadas para decidir quando compilar consultas em código nativo se mostraram pouco confiáveis. [Já falamos aqui](/2026/rustdesk-abre-o-wayland-postgresql-finge-jit-e-qwen-chega-aberto/) de como o JIT pode parecer ligado sem estar funcionando. Quem roda muitas consultas analíticas grandes pode querer religá-lo.
- **Autovacuum em paralelo.** Ele passa a limpar índices com vários workers (`autovacuum_max_parallel_workers`) e ganha um sistema de pontuação para decidir quais tabelas atender primeiro.
- **Para quem escreve SQL:** `INSERT ... ON CONFLICT DO SELECT` devolve no `RETURNING` a linha que já existia, o `COPY` pode gerar JSON, e funções de janela aceitam `IGNORE NULLS`. Segundo o anúncio, a verificação de chaves estrangeiras ficou mais rápida, e nos testes do projeto isso deixou inserções em lote quase duas vezes mais rápidas.
- **Saem de cena:** a autenticação RADIUS foi removida, e logins com senha `md5` passam a gerar um aviso, já que esse método vai ser removido numa versão futura. A recomendação é migrar para SCRAM.

**Antes de atualizar.** Como em toda versão principal, o formato dos dados muda: é preciso usar `pg_upgrade`, dump e restore, ou replicação lógica. As notas de lançamento listam incompatibilidades que pegam gente desprevenida. Três exemplos: o `standard_conforming_strings` agora fica sempre ligado, então dumps feitos por um `pg_dump` antigo com esse parâmetro desligado não carregam (use o `pg_dump` do 19); o padrão de `max_locks_per_transaction` subiu de 64 para 128, e quem tinha um valor customizado precisa dobrá-lo para manter a mesma capacidade; e, em bancos que usam o ICU ou o provedor de locale `builtin`, a recomendação é reindexar os índices de busca textual e do `pg_trgm` depois de um `pg_upgrade`. O 19 chega uma semana depois das versões de manutenção que [cobrimos no dia 13](/2026/microsoft-365-fora-postgresql-18-7-rust-1-100-gemini-hydrogen/).

Fontes: [anúncio do PostgreSQL 19](https://www.postgresql.org/about/news/postgresql-19-released-3449/), [notas de lançamento](https://www.postgresql.org/docs/release/19.0/), [documentação do REPACK](https://www.postgresql.org/docs/19/sql-repack.html), [documentação do WAIT FOR LSN](https://www.postgresql.org/docs/19/sql-wait.html) e [post de Robert Haas sobre o atraso](https://rhaas.blogspot.com/2026/10/postgres-19-is-late-and-its-ais-fault.html).

## PHP 8.6 traz aplicação parcial de funções, e as versões de segurança de quinta corrigem sete falhas críticas

[Ontem avisamos](/2026/nginx2root-codeberg-fora-do-dns-scanners-cacam-chaves-de-agentes/) que o PHP lançaria versões de segurança na quinta (19). Elas saíram por volta das 11h no horário de Brasília: **8.2.36, 8.3.37, 8.4.28 e 8.5.13**. No mesmo dia saiu o **PHP 8.6.0**, e o changelog dele lista as mesmas correções de segurança. O projeto publicou 17 avisos: sete críticos, quatro graves e seis médios. Quase todos os críticos dependem de configuração específica, e vale ler as condições antes de entrar em pânico ou de relaxar.

**O mais perigoso: contrabando de requisição no PHP-FPM (CVE-2026-129289).** O PHP-FPM é o processo que executa o PHP atrás de um servidor web como nginx ou Apache. Os dois conversam pelo protocolo FastCGI, e uma mesma conexão pode carregar vários pedidos em sequência, se o servidor web pedir isso. O PHP lê o corpo do pedido de forma preguiçosa: só quando o código pede. O erro estava na limpeza ao fim de cada pedido. Se a aplicação tinha aberto o `php://input` sem ler até o fim, o PHP achava que o corpo já tinha sido tratado e deixava bytes para trás na conexão.

Um atacante sem login podia montar um corpo de pedido em que esses bytes restantes formam um segundo pedido FastCGI completo, que o PHP-FPM aceita como se viesse do servidor web. Nesse pedido falso, o atacante escolhe o script, o endereço IP de origem e até configurações de administrador do PHP. O aviso mostra que, sabendo o caminho de algum script PHP que exista no servidor, isso basta para executar código PHP do atacante com os privilégios do worker, sem corromper memória. O código afetado existe desde o PHP 5.6.

São duas condições. A primeira é um caminho da aplicação que abra o `php://input` sem lê-lo inteiro, algo que, segundo o aviso, pode acontecer em frameworks que criam esse fluxo antes do roteamento ou da autenticação. A segunda é a conexão reaproveitada: nginx com `fastcgi_keep_conn on`, Apache com `mod_proxy_fcgi` e `enablereuse=on`, ou um HAProxy que mantém as conexões com o backend. Segundo o aviso, as configurações padrão do nginx e do Apache, que fecham a conexão FastCGI depois de cada pedido, não são afetadas pelo ataque demonstrado. Se você não pode atualizar agora, a mitigação é desligar esse reaproveitamento. E nunca exponha a porta do PHP-FPM para redes não confiáveis.

**Sessões em arquivo viram porta de entrada.** Três falhas críticas envolvem as sessões do PHP, que por padrão ficam gravadas em arquivos no servidor:

- **Arquivo de sessão sobrescrito pela metade (CVE-2026-126714).** O PHP gravava a sessão nova por cima da antiga sem apagar o arquivo antes. Se a gravação fosse interrompida no meio, sobrava um arquivo com o começo da sessão nova e o fim da antiga. Bem arrumada, essa mistura faz o PHP desserializar objetos escolhidos pelo atacante na próxima leitura da sessão. O defeito existe desde o PHP 4.1.0. A execução de código exige que o atacante influencie o conteúdo da sessão, que consiga interromper a gravação no ponto certo e que a aplicação tenha uma "cadeia de gadgets": classes cujo código, ao ser desserializado, pode ser encadeado para fazer algo útil ao atacante.
- **Formatos de sessão misturados (CVE-2026-115560).** Acontece quando o recurso de progresso de upload grava a sessão num formato e outra parte do sistema lê com outro, por exemplo duas aplicações ou dois pools do FPM que compartilham o mesmo diretório de sessões. Também depende de uma cadeia de gadgets.
- **Uso de memória já liberada no fim da sessão (CVE-2026-129481),** nas versões 8.3 em diante.

Para as duas primeiras, a mitigação temporária sugerida é desligar `session.upload_progress.enabled` se você não usa o recurso.

**As outras críticas.** Uma está no cache de fuso horário (CVE-2026-129496) e depende de um aviso ser escrito no arquivo de log de erros do PHP durante a inicialização, como um `date.timezone` inválido. Duas afetam só o PHP 8.5. Uma delas (CVE-2026-129474) envolve os backtraces de erros fatais, ligados por padrão no 8.5, e só funciona com `zend.exception_ignore_args=0`. O arquivo `php.ini-production` já vem com esse valor em 1, o que bloqueia o ataque demonstrado. Dois dos avisos dizem que corrigem casos que escaparam da correção do PHP2Shell, que [cobrimos em outubro](/2026/litellm-1-107-0-malware-php2shell-correcoes-thinkingbox/).

Em resumo: atualize para a versão corrigida do seu ramo ou para o pacote corrigido da sua distribuição. As distros costumam aplicar a correção sem mudar o número da versão principal, então confira o aviso de segurança delas.

**O que o PHP 8.6 traz.** A novidade mais visível é a **aplicação parcial de funções**: você chama uma função com `?` no lugar de um argumento e recebe de volta uma nova função que só espera o que faltou. O exemplo oficial filtra uma lista de versões com `array_filter($versions, version_compare(?, '8.6', '>='))`, sem escrever uma função anônima. Também chegam:

- **`Io\Poll`,** uma API nativa para vigiar vários sockets ao mesmo tempo, que usa por baixo o mecanismo de cada sistema (epoll no Linux, kqueue nos BSDs e no macOS, WSAPoll no Windows). Isso interessa a quem escreve servidores e bibliotecas assíncronas em PHP.
- **`clamp()`,** que prende um valor entre um mínimo e um máximo.
- **A classe `\Time\Duration`,** para representar intervalos de tempo sem fazer conta com inteiros.
- **O enum `SortDirection`,** para ordem crescente ou decrescente.
- **Valores padrão para propriedades `readonly`.**

As sessões também ficam mais rígidas por padrão: `session.use_strict_mode` e `session.cookie_httponly` passam a vir ligados, e o cookie de sessão sai com `SameSite=Lax`. Entre as depreciações estão `return` dentro de `finally`, as funções de regex do mbstring (`mb_ereg()` e companhia, porque a biblioteca Oniguruma não é mais mantida) e apelidos antigos como `is_double()` e `is_long()`. Funções como `fclose()` e `file_put_contents()` passam a devolver `false` quando falham ao gravar, em vez de ignorar o erro. O guia de migração do manual lista tudo.

Fontes: [anúncios no php.net](https://www.php.net/archive/2026.php#2026-11-19-5), [changelog do PHP 8](https://www.php.net/ChangeLog-8.php#8.5.13), [o que há de novo no PHP 8.6](https://www.php.net/releases/8.6/en.php), [aviso do contrabando no PHP-FPM](https://github.com/php/php-src/security/advisories/GHSA-qc49-hpvq-g2w6), [aviso das sessões sobrescritas](https://github.com/php/php-src/security/advisories/GHSA-fm2m-fjf5-v3cp), [aviso dos formatos de sessão](https://github.com/php/php-src/security/advisories/GHSA-658j-r8rw-q6mx) e [aviso dos backtraces no PHP 8.5](https://github.com/php/php-src/security/advisories/GHSA-8mjj-2r7p-4hg2).

## APT do Debian vai deixar de aceitar formatos antigos de repositório, e o mantenedor cita a pesquisa de segurança com IA

Na quinta (19), Julian Andres Klode, mantenedor do APT, o gerenciador de pacotes do Debian e do Ubuntu, avisou na lista oficial de anúncios do Debian que vai remover o suporte a várias configurações antigas de repositório. As remoções começam no **unstable**, a versão de desenvolvimento do Debian, a partir da semana que vem. O prazo para o que entra nessa leva é **terça, 24 de novembro**.

**Por que importa: o caminho do download é a porta de entrada.** Quando você roda `apt update`, o APT baixa de cada repositório um arquivo de índice chamado `Release`. Ele lista os outros arquivos do repositório com tamanho e *hash*, uma espécie de impressão digital que permite conferir se o arquivo baixado é o original. Para provar que esse índice veio de quem diz, o repositório o assina. A forma moderna é o `InRelease`, que traz o índice e a assinatura no mesmo arquivo. A forma antiga separa os dois, com a assinatura num `Release.gpg`.

Vão sair três coisas:

1. **Repositórios com a assinatura separada em `Release.gpg`.** Sem um `InRelease`, eles passam a funcionar só como repositórios não confiáveis.
2. **Repositórios que só oferecem hashes fracos, MD5 ou SHA-1,** hoje liberados com a opção `allow-weak`. Klode planeja uma forma limitada de marcar um hash como confiável, só para inspecionar repositórios históricos.
3. **Repositórios sem hashes ou sem arquivo `Release`,** incluindo os repositórios "planos" que não têm `Release`. Sem saber de antemão o tamanho e o hash de cada arquivo, o APT precisa sondar todos os caminhos possíveis, o que, nas palavras dele, o expõe a "respostas infinitas", entre outros problemas.

Sobram dois tipos: repositório assinado com `InRelease`, ou repositório sem assinatura, mas com um `Release` que traz hashes e tamanhos. Também estão em avaliação as opções que permitem repositórios inseguros (`allow-insecure` e `allow-downgrade-to-insecure`) e os caminhos alternativos de download, como cair do `Packages.xz` para o `Packages.gz` quando o primeiro falha. Outros recursos não essenciais, como guardar índices comprimidos, podem sair sem aviso.

**O argumento.** Klode escreve que a vulnerabilidade recente no código de download do APT e os avanços da IA chamaram atenção para a complexidade desse código, que existe em boa parte para manter formatos que quase ninguém usa. Para ele, com os avanços da pesquisa de segurança com IA, o risco dessa complexidade agora supera em muito o benefício da compatibilidade. A mensagem não diz qual vulnerabilidade; a mais recente que veio a público foi a CVE-2026-109518, [que noticiamos no dia 5](/2026/apt-corrige-pacotes-go-json-v2-workflow-agentes/), em que um atacante no meio do tráfego podia trocar um pacote depois da verificação. O aviso traz ainda um recado para quem roda versões estáveis: Klode espera continuar dando suporte de segurança a esses recursos, mas diz que talvez não consiga, e que **atualizações de segurança de 2027 em diante podem remover recursos sem aviso prévio**.

**O que fazer.** Os repositórios oficiais do Debian e do Ubuntu já publicam `InRelease`, então quem só usa eles não deve sentir diferença. A atenção vai para repositórios de terceiros e, principalmente, os internos, montados à mão anos atrás. Um teste rápido é ver se o repositório publica `dists/<suite>/InRelease` e se o `Release` traz hashes SHA-256. Repositórios planos, gerados só com `dpkg-scanpackages`, precisam ganhar um arquivo `Release` com hashes. É o mesmo pano de fundo do atraso do PostgreSQL, com uma resposta diferente: em vez de correr atrás de cada bug que a IA encontra, cortar o código onde eles moram.

Fonte: [anúncio de Julian Andres Klode na debian-devel-announce](https://lists.debian.org/debian-devel-announce/2026/11/msg00001.html).

## Estudo reconstrói 108 incidentes com agentes de IA e conclui que a maioria dos danos reais não teve atacante

Quando se fala em segurança de agentes de IA, o vilão costuma ser a injeção de prompt: um texto malicioso escondido numa página ou num arquivo que sequestra o agente. Um artigo publicado na quinta (19) no arXiv por Mengxiao Wang, Mahbub Alam, Kalyan Nakka e Nitesh Saxena olhou para os incidentes reais e encontrou outra coisa. Dos 72 incidentes com dano no mundo real que o estudo analisou, **62 não tiveram atacante**, e só 2 foram injeção de prompt. O agente fez o que pediram e tropeçou num perigo comum do ambiente.

**Como o estudo foi feito.** O sistema, chamado ROGUE-AI, usa agentes para buscar relatos de incidentes publicados entre janeiro de 2025 e outubro de 2026. Achou 253. Cada um foi conferido na fonte mais detalhada disponível, como post-mortem, confirmação do fornecedor ou registro de CVE, e 244 se confirmaram. Os pesquisadores então reconstruíram os incidentes num ambiente simulado, cada um com um "controle": a mesma situação sem a causa apontada no relato. Das 108 reconstruções, que cobrem 96 incidentes, 89% reproduziram o dano relatado.

Os agentes testados usam cinco modelos: GPT-5.6-luna e GPT-5.6-sol, da OpenAI, Claude Sonnet 4.6, da Anthropic, Gemini 3.5 Flash, do Google, e o DeepSeek-V4-Flash, de pesos abertos. Eles repetiram o erro relatado em **18% a 33% das execuções**, contra no máximo 1% quando a causa apontada não estava lá.

**O exemplo principal** é a reconstrução de um incidente com a Replit. Nela, o README do projeto dizia que preview, testes e produção compartilhavam o banco de dados configurado no `.env`. O agente rodou `make test` para conferir uma correção, e os testes apagaram 1.206 registros de produção. Ninguém injetou nada: a informação estava lá, e o agente não ligou o comando ao risco. Um dado do estudo mostra bem o contraste. O Claude Sonnet 4.6 não causou dano em nenhuma das 138 sessões com instruções maliciosas, mas causou dano em 26% das sessões sem atacante.

Por isso, defesas contra injeção de prompt não ajudam aqui. Nas palavras do artigo, elas procuram instruções injetadas, e essas reconstruções não têm nenhuma.

**O que reduziu o dano.** Os pesquisadores testaram intervenções nas reconstruções em que cada modelo tinha causado dano com frequência. Nelas, sem intervenção, o dano aparecia em 85% a 98% das sessões. Os resultados:

- **Um aviso depois de cada saída de ferramenta, nomeando o perigo e a consequência** (no caso da Replit, "os testes apagam o banco de produção"), reduziu o dano nos cinco modelos: para 1 em 40 sessões no Claude Sonnet 4.6 e para no máximo 62% nos outros.
- **Uma nota neutra do mesmo tamanho**, sem citar o perigo, manteve o dano entre 83% e 98%. Ou seja, não é o texto extra que ajuda, é a informação.
- **Citar o fato sem a consequência** deixou o dano entre 58% e 82%, e **repetir a regra na mensagem do usuário** deixou entre 67% e 80%.
- As defesas tiradas dos próprios relatos e das correções dos fornecedores foram as mais fortes: **pedir confirmação ao usuário** ou **rastrear o fluxo dos dados** zerou o dano nos cinco modelos. Checagens que comparam o texto da ação foram mais fracas, porque a ação reescrita com outras palavras ainda passava em parte.

**Os limites.** Os próprios autores avisam que o catálogo deve ter mais dos incidentes sobre os quais as pessoas escrevem, que o ambiente simulado com um único laço de agente pode não refletir o risco de um produto real, e que, quando o relato não explica o mecanismo, a reconstrução precisa supor um. Uma reconstrução que falha não prova que o relato é falso. Uma observação nossa: os modelos da OpenAI, da Anthropic e do Google usados no estudo já têm sucessores lançados, como o GPT-6.2 e o Claude Sonnet 5.5.

**Para quem usa agentes no dia a dia,** a lição prática é sobre o ambiente, não sobre o prompt. Separe de verdade os bancos e as credenciais de teste e de produção. Faça as ferramentas que podem destruir algo devolverem um aviso explícito do que está em jogo. E exija confirmação humana para ações irreversíveis.

Fonte: [artigo do ROGUE-AI no arXiv](https://arxiv.org/abs/2611.26553v1).

## Destaques rápidos para hoje.

- **Valkey 9.2 permite snapshots sem `fork()` e troca a estrutura dos sorted sets grandes.** O Valkey é o banco em memória que nasceu como fork do Redis quando este mudou de licença, e é para ele que [o autor do Redict mandou seus usuários esta semana](/2026/java4shell-pypi-agent-framework-chips-brasil-gpt-6-2/). A versão 9.2.0, primeira estável da série, foi publicada no GitHub na quinta (19). Para salvar o banco em disco, o Valkey tradicionalmente cria um processo filho com `fork()`. Como pai e filho dividem as páginas de memória até alguém escrever nelas, um servidor com muita escrita pode precisar de bem mais memória durante o snapshot. A 9.2 traz snapshots feitos numa thread em segundo plano, sem `fork()`, mas o recurso é opcional: precisa ser ligado na inicialização (`forkless-infrastructure-enabled yes`) e escolhido na política de snapshots (`forkless-policy prefer-forkless`, opção que nas versões de teste se chamava `bgsave-default-method`). Sorted sets grandes passam a usar uma árvore B+ no lugar da skiplist. A versão também traz um tipo de dado novo, o Path Hash, para buscas por prefixo, e papéis reutilizáveis no controle de acesso (ACL). Fonte: [notas da versão 9.2.0](https://github.com/valkey-io/valkey/releases/tag/9.2.0).

- **Falha no vCenter foi explorada como zero-day pelo grupo Armory Castle, e a versão 7.0 não tem correção pública.** O vCenter é o painel central que administra servidores de virtualização VMware. Na quinta (19), a Broadcom corrigiu a CVE-2026-123890, nota 9,8, um desvio de autenticação no serviço de diretório do vCenter que pode ser atacado pela rede, sem login. As versões corrigidas são 9.1.1.0200, 9.0.2.0200 e 8.0 U3m. Para a 7.0, o aviso manda falar com o suporte quem tem contrato de suporte estendido. No mesmo dia, a Mandiant, do Google, relatou que o grupo Armory Castle usou a falha para criar uma conta de administrador no login único (SSO) do vCenter. Segundo a empresa, o grupo entrou na rede da vítima por uma falha no BeyondTrust Remote Support, executou sua ferramenta contra um vCenter interno no início de setembro e explorou UUIDs previsíveis na autenticação que passa pela porta 2012. A empresa recomenda aplicar a correção, procurar sinais de invasão e restringir o acesso às portas de gerenciamento (443, 2012, 5480 e 22). Fontes: [aviso VMSA-2026-0009 da Broadcom](https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/39495), [análise da Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-vsphere/).

- **Ações da Anthropic estreiam na Nasdaq e fecham o primeiro dia 17% acima do preço do IPO.** Ontem [contamos](/2026/nginx2root-codeberg-fora-do-dns-scanners-cacam-chaves-de-agentes/) que a empresa por trás do Claude tinha fixado o preço em US$ 83 por ação. Na quinta (19), o primeiro negócio com o código ANT só saiu às 11h48 no horário de Nova York, mais de duas horas depois da abertura do pregão, a US$ 111,50, 34% acima do preço da oferta. A ação fechou a US$ 97,17. A Latent Space trata a oferta como o maior IPO da história, acima do da SpaceX em junho. O valor de mercado varia conforme a conta: a Stock Titan estima cerca de US$ 1,28 trilhão no fechamento, contando todas as classes de ações. Fontes: [cobertura da Stock Titan](https://www.stocktitan.net/articles/anthropic-ipo-live-ant-first-trading-day-2026), [AINews da Latent Space](https://latent.space/p/ainews-anthropic-successfully-completes-largest-ipo-in-history-valued-at-1-5t/).

- **ANPD nega recurso do Discord e mantém as transmissões ao vivo suspensas no Brasil.** A Autoridade Nacional de Proteção de Dados suspendeu em 12 de agosto, por medida cautelar, o Go Live e os recursos de transmissão ao vivo do Discord no país, por risco a crianças e adolescentes. Segundo o Convergência Digital, o Conselho Diretor da ANPD rejeitou o recurso da empresa por unanimidade na quarta (18). Para o conselho, o Discord não adotou medidas que tornem as transmissões mais seguras. O relator, o presidente interino Iagê Miola, disse que a medida é "preventiva, provisória e reversível, e não constitui penalidade". O restante da plataforma continua funcionando, e a ANPD diz que segue conversando com a empresa sobre a volta das lives. Não encontramos a nota oficial da ANPD no site do governo. Fonte: [Convergência Digital](https://convergenciadigital.com.br/governo/anpd-rejeita-recurso-e-mantem-suspensas-transmissoes-ao-vivo-do-discord-no-brasil/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 34729
source_urls:
  - https://www.postgresql.org/about/news/postgresql-19-released-3449/
  - https://www.postgresql.org/docs/release/19.0/
  - https://www.postgresql.org/docs/19/sql-repack.html
  - https://www.postgresql.org/docs/19/sql-wait.html
  - https://rhaas.blogspot.com/2026/10/postgres-19-is-late-and-its-ais-fault.html
  - https://www.php.net/archive/2026.php#2026-11-19-5
  - https://www.php.net/ChangeLog-8.php#8.5.13
  - https://www.php.net/releases/8.6/en.php
  - https://github.com/php/php-src/security/advisories/GHSA-qc49-hpvq-g2w6
  - https://github.com/php/php-src/security/advisories/GHSA-fm2m-fjf5-v3cp
  - https://github.com/php/php-src/security/advisories/GHSA-658j-r8rw-q6mx
  - https://github.com/php/php-src/security/advisories/GHSA-8mjj-2r7p-4hg2
  - https://lists.debian.org/debian-devel-announce/2026/11/msg00001.html
  - https://arxiv.org/abs/2611.26553v1
  - https://github.com/valkey-io/valkey/releases/tag/9.2.0
  - https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/39495
  - https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-vsphere/
  - https://www.stocktitan.net/articles/anthropic-ipo-live-ant-first-trading-day-2026
  - https://latent.space/p/ainews-anthropic-successfully-completes-largest-ipo-in-history-valued-at-1-5t/
  - https://convergenciadigital.com.br/governo/anpd-rejeita-recurso-e-mantem-suspensas-transmissoes-ao-vivo-do-discord-no-brasil/
-->
