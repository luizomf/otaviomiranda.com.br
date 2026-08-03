---
title: 'N-central pede hotfix, RAG perde autoridade e TLS 1.2 congela'
description: 'Uma correção incompleta do N-central abre caminho para tomada de conta, enquanto um teste expõe limites do RAG, PostgreSQL contém transações vazadas e JSON perde tipos pelo caminho.'
date: 2026-08-03T05:15:31-03:00
author: 'The Paper LLM'
image: './images/n-central-pede-hotfix-rag-perde-autoridade-e-tls-1-2-congela.jpg'
---

![Maquete do N-central recebe o módulo do hotfix 2026.3.1.7 enquanto conexões partem para vários endpoints.](./images/n-central-pede-hotfix-rag-perde-autoridade-e-tls-1-2-congela.jpg)

Quando um servidor de administração remota é comprometido, o problema não termina nele. Esse servidor já tem acesso às máquinas dos clientes. Por isso, a nova correção do N-central exige mais do que atualizar uma versão: o primeiro patch deixou outro caminho de autenticação aberto, e há relatos de invasores usando o controle central para alcançar endpoints gerenciados.

A manhã também trouxe três problemas que parecem inofensivos até a produção começar a reclamar. Busca por similaridade não sabe, sozinha, qual documento manda. Uma transação parada no PostgreSQL ainda pode segurar recursos. E um objeto JavaScript pode atravessar um JSON perfeitamente válido e voltar com outro significado. No meio disso, a IETF colocou o TLS 1.2 em modo de manutenção. Software envelhece. Seria bom se nossos contratos envelhecessem melhor.

## N-central corrige o caminho que o primeiro patch deixou aberto

A N-able publicou em 2 de agosto o build **2026.3.1.7**, um hotfix de emergência para o N-central. A falha, identificada como CVE-2026-18577, é um caminho alternativo de bypass de autenticação que sobrou da correção incompleta da CVE-2026-18556. Segundo o registro mantido pela própria N-able, as versões até a 2026.3 são afetadas. O novo build é o primeiro listado como não afetado.

A falha permite tomada de conta pela rede, sem privilégio prévio ou interação do usuário. Recebeu pontuação CVSS 4.0 de 8,2, classificada como alta, e sua maturidade de exploração aparece como `ATTACKED`. A empresa recomenda atualizar o quanto antes. As instâncias hospedadas, chamadas NCOD, entram no calendário automático informado pela N-able. Quem opera o N-central por conta própria precisa instalar o hotfix.

Aqui, o número completo faz diferença. Em um trecho, o aviso usa a forma abreviada “2026.3.1”, mas identifica o build corrigido como **2026.3.1.7**. É esse o valor que deve orientar o inventário e a validação da equipe.

O N-central é uma plataforma de monitoramento e administração remota, ou RMM. MSPs e times de TI usam um único plano de controle para operar muitas máquinas. Se esse plano for invadido, o raio do problema é bem maior do que o de um servidor comum.

Segundo o The Hacker News, em reportagem baseada em informações atribuídas à N-able e à Huntress, os atacantes usaram o recurso Take Control para chegar aos endpoints administrados. Depois, registraram túneis de saída da Cloudflare como serviços persistentes. Em um caso acompanhado pela Huntress, uma conta de parceiro expôs nove organizações, com um endpoint atingido em cada uma. Esse número descreve apenas aquele caso, não uma contagem global de vítimas. A Cloudflare também não foi comprometida. O serviço de túnel dela foi usado no ataque.

O túnel de saída explica por que aplicar o patch não encerra a investigação. Ele pode manter acesso remoto sem abrir uma porta de entrada no firewall. Se o invasor já instalou um serviço numa máquina gerenciada, fechar o caminho pelo N-central não remove a persistência daquele endpoint.

Quem suspeita de comprometimento precisa atualizar o servidor e examinar as máquinas que ele conseguia alcançar. Registros do Take Control ajudam nessa análise, mas não provam um ataque sozinhos: administradores legítimos usam o mesmo recurso. A urgência é real. O atalho para investigar, infelizmente, não veio no hotfix.

Fontes: [registro CNA da N-able para a CVE-2026-18577](https://cveawg.mitre.org/api/cve/CVE-2026-18577), [aviso de status do N-central](https://status.n-able.com/2026/08/02/n-central-2026-3-hotfix-1-mitigation-for-cve-2026-18577/) e [The Hacker News](https://thehackernews.com/2026/08/n-able-says-attackers-take-over-n.html).

## Um teste pequeno mostra onde o RAG confunde relevância com autoridade

Joaquín Ruiz publicou um experimento local em torno de uma pergunta útil: o que acontece quando a busca encontra um texto parecido, mas não sabe se ele está atual, obsoleto ou incompleto? O repositório foi criado e recebeu o último push em 29 de julho. Os metadados registram uma atualização em 1º de agosto.

O teste compara três maneiras de recuperar o mesmo conjunto de conhecimento sintético sobre uma empresa fictícia. A primeira usa RAG vetorial clássico, com Chroma sobre 60 documentos bagunçados, divididos em 85 trechos. A segunda usa um pacote curado no Open Knowledge Format, ou OKF, formato proposto pelo Google, com nove conceitos e uma ferramenta chamada `leer_concepto`. Na terceira, o agente recebe as duas ferramentas e escolhe entre RAG e OKF.

O modelo usado foi o Qwen3 8B, rodando localmente com Ollama. O RAG gerou embeddings com `nomic-embed-text` e recuperou cinco trechos por consulta. Mantendo o mesmo modelo, hardware e conjunto de sete perguntas, o RAG acertou 2. O OKF acertou 6, assim como o modelo híbrido.

Só que o placar nem é a parte mais interessante. Nos casos que dependiam de validade temporal, um documento depreciado de 2023 apareceu com distância de cosseno melhor do que a fonte vigente. Aumentar a quantidade de trechos recuperados só trouxe mais ruído. A pergunta principal continuou sem resposta: qual documento tem autoridade agora?

Busca vetorial mede proximidade semântica. Ela não converte automaticamente “vigente”, “canônico” e “depreciado” em regras. Um texto antigo e detalhado pode render vários trechos muito parecidos com a consulta, ocupando o contexto antes da definição curta que realmente vale. O OKF leva parte desse trabalho para conceitos curados, relações e metadados de validade. O controle aumenta, junto com o trabalho de manutenção.

O híbrido mostrou outro detalhe: somar ferramentas também soma decisões. Ele respondeu a uma pergunta sobre um incidente raro que o OKF não cobria, mas errou um caso de informação dividida entre tabelas que o OKF sozinho acertou. O agente escolheu a ferramenta errada. Então o roteador também precisa entrar no teste. Dar mais botões ao agente não ensina qual deles apertar.

O experimento tem limites claros. Os resultados são do repositório, não do Google. Foi o próprio autor quem conduziu o teste, usando um corpus sintético, sete perguntas escolhidas para provocar classes específicas de falha, um modelo, uma estratégia de divisão e avaliação manual. Ele mesmo avisa que trocar o modelo muda os números. Logo, o placar de 6 a 2 não prova que conhecimento estruturado vence RAG em qualquer sistema. Ele levanta uma hipótese prática que podemos testar no nosso domínio: autoridade e validade talvez precisem de representação explícita.

Para assistentes internos, faz sentido testar documentos conflitantes, políticas vencidas, homônimos, fatos separados e perguntas fora da base. Um embedding melhor pode ajudar a encontrar material. Ainda não decide qual é a fonte oficial. O repositório também não declara licença, então conseguir reproduzir o experimento não dá permissão automática para copiar o código.

Fontes: [README do experimento rag-vs-okf](https://raw.githubusercontent.com/JoaquinRuiz/rag-vs-okf/main/README.md) e [metadados do repositório no GitHub](https://api.github.com/repos/JoaquinRuiz/rag-vs-okf).

## PostgreSQL pode encerrar a transação que ficou dormindo

Uma conexão aparece como inativa no `pg_stat_activity`, mas ainda mantém uma transação aberta. Parece não estar fazendo nada. Mesmo assim, pode continuar segurando locks e snapshots, bloquear uma alteração de tabela e deixar consultas comuns em fila atrás dela. Depois de uma escrita, ou nos níveis `REPEATABLE READ` e `SERIALIZABLE`, a conexão também pode prender o horizonte de transações e impedir o vacuum de remover tuplas mortas mais novas.

O parâmetro `idle_in_transaction_session_timeout` limita esse sono perigoso. Depois de cada comando, se a sessão ficar silenciosa com uma transação aberta, o PostgreSQL inicia o temporizador. Quando o prazo vence, o banco desfaz a transação, libera os recursos e fecha a conexão. Ao tentar usar o socket novamente, o cliente recebe o SQLSTATE `25P03`.

Christophe Pettus publicou essa orientação na noite de 2 de agosto no horário do Pacífico, quando já era 3 de agosto em UTC. Ele recomenda cinco minutos como proteção global para cargas OLTP e mostra um limite mais curto por role para aplicações com pool:

```sql
ALTER ROLE app SET idle_in_transaction_session_timeout = '1min';
```

Esses números são conselhos operacionais, não padrões seguros para qualquer carga. Uma sessão interativa ou um job em lote pode precisar de outro limite. E, como o parâmetro tem contexto de usuário, a própria sessão pode redefini-lo para zero. Ele funciona como cinto de segurança contra vazamento acidental, não como contenção de cliente hostil.

Tem outra diferença fácil de deixar passar: o relógio mede cada intervalo sem comandos, e não a idade total da transação. Se a aplicação emitir uma instrução a cada quatro minutos, um timeout de cinco minutos nunca será atingido. Para limitar a duração completa, o PostgreSQL 17 ou posterior oferece `transaction_timeout`. Já `idle_session_timeout`, disponível desde o PostgreSQL 14, cuida de sessões ociosas sem transação aberta, que não seguram os mesmos recursos.

Ativar o limite troca uma pane lenta por uma falha explícita. O pool precisa descartar a conexão morta. A aplicação, por sua vez, precisa decidir se pode repetir com segurança a unidade desfeita. Sem esse tratamento, o banco faz a parte dele e o próximo erro só muda de endereço.

Fonte: [The Build — All Your GUCs in a Row: idle_in_transaction_session_timeout](https://thebuild.com/blog/all-your-gucs-in-a-row-idle_in_transaction_session_timeout/).

## TLS 1.2 entra em manutenção, não em desligamento imediato

A IETF publicou a RFC 9851, uma especificação Standards Track de julho de 2026 que congela a evolução de recursos do TLS 1.2. Daqui em diante, as mudanças ficam restritas a correções urgentes de segurança aprovadas pelo grupo de trabalho de TLS, novos identificadores de protocolo ALPN e novos rótulos de TLS Exporter. O desenvolvimento criptográfico segue no TLS 1.3 ou em versões posteriores.

A RFC não deprecia o TLS 1.2 nem determina seu desligamento imediato. Também não fecha os registros da IANA. Em vez disso, muda as instruções para que novas entradas normalmente apontem para TLS 1.3 ou posterior, mantendo as exceções para ALPN e Exporter Labels. O DTLS ficou explicitamente fora dessa decisão.

Já falamos da [aposentadoria de trocas de chave antigas no TLS 1.2](/2026/lean-aceitou-prova-de-falso-malware-usa-comando-colado-no-terminal/). Desta vez, a mudança é mais ampla: a versão inteira deixa de receber recursos novos, embora ainda possa receber manutenção crítica.

Para infraestrutura, isso pede planejamento, não sirene. É hora de inventariar clientes, proxies, balanceadores e serviços internos que ainda negociam TLS 1.2. “Negociam” é a palavra que importa aqui. Uma configuração pode anunciar suporte ao TLS 1.3 enquanto um cliente antigo continua puxando a conexão para 1.2.

A RFC também diz que o trabalho pós-quântico do grupo será especificado apenas para TLS 1.3 ou posterior. Isso não significa que o TLS pós-quântico já esteja universalmente pronto e implantado. Significa que o TLS 1.2 não receberá essa evolução. A compatibilidade ainda mantém sistemas antigos funcionando por algum tempo, mas não cria um caminho novo para eles.

Fonte: [IETF RFC 9851](https://www.rfc-editor.org/rfc/rfc9851.txt).

## JSON válido ainda pode devolver outro objeto ao JavaScript

Um explainer publicado em 3 de agosto volta a uma armadilha antiga: `JSON.stringify` seguido de `JSON.parse` parece uma viagem de ida e volta. Para vários valores do JavaScript, é uma viagem só de ida, com um sósia esperando no desembarque.

O inteiro `9007199254740993`, por exemplo, passa da faixa exata segura do tipo `Number`. Se ele nasce como literal JavaScript, perde precisão antes mesmo do `JSON.stringify`. Um texto JSON pode carregar todos os dígitos corretamente, mas o `JSON.parse` volta a arredondar o valor quando o converte para `Number`. A limitação está no número do JavaScript, não na sintaxe JSON.

O `BigInt` consegue representar esse inteiro, mas a serialização padrão o rejeita. Para identificadores grandes, uma saída comum é definir uma string decimal no contrato. ID costuma ser um rótulo opaco mesmo. Fingir que ele precisa fazer aritmética só cria uma oportunidade bastante elegante de corrompê-lo.

Outros valores mudam de forma sem lançar erro. Uma propriedade com `undefined` desaparece do objeto. Funções e símbolos também são omitidos em objetos, mas viram `null` dentro de arrays. No topo, `JSON.stringify(undefined)` devolve o valor JavaScript `undefined`, não um texto JSON.

Uma `Date` válida chama `toJSON()` e vira uma string UTC comum. O instante pode sobreviver, mas não há uma marca dizendo ao consumidor que ele deve reconstruir uma `Date`. O offset e a intenção do fuso original também somem. `NaN` e infinitos viram `null`. `Map`, `Set`, `RegExp` e `Error`, por padrão, acabam como objetos vazios.

Um `reviver` esperto, tentando adivinhar o passado, não resolve o contrato. Produtor e consumidor precisam combinar uma representação explícita e validada: string decimal para IDs grandes, semântica declarada para timestamps, codificação com tags para tipos que não existem no JSON e significados distintos para ausência e `null`. Isso pesa ainda mais em APIs de atualização parcial, nas quais “não altere o campo” e “limpe o campo” não podem virar o mesmo estado por acidente.

JSON tem um modelo de dados menor do que o runtime do JavaScript. O serializador não consegue inventar o contrato que a API deixou de escrever.

Fonte: [Gábor Koós — Your JSON Is Lying to You](https://blog.gaborkoos.com/posts/2026-08-03-Your-JSON-Is-Lying-to-You/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://cveawg.mitre.org/api/cve/CVE-2026-18577
  - https://status.n-able.com/2026/08/02/n-central-2026-3-hotfix-1-mitigation-for-cve-2026-18577/
  - https://thehackernews.com/2026/08/n-able-says-attackers-take-over-n.html
  - https://raw.githubusercontent.com/JoaquinRuiz/rag-vs-okf/main/README.md
  - https://api.github.com/repos/JoaquinRuiz/rag-vs-okf
  - https://thebuild.com/blog/all-your-gucs-in-a-row-idle_in_transaction_session_timeout/
  - https://www.rfc-editor.org/rfc/rfc9851.txt
  - https://blog.gaborkoos.com/posts/2026-08-03-Your-JSON-Is-Lying-to-You/
-->
