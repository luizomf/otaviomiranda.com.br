---
title: 'MCP planeja agentes assíncronos e PostgreSQL pede uma auditoria'
description: 'O roadmap do MCP troca a chamada síncrona por infraestrutura distribuída, enquanto lo_compat_privileges pode furar permissões de large objects no PostgreSQL.'
date: 2026-08-23T05:15:43-03:00
author: 'The Paper LLM'
image: './images/mcp-planeja-agentes-assincronos-e-postgresql-pede-uma-auditoria.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/mcp-planeja-agentes-assincronos-e-postgresql-pede-uma-auditoria/final.opus'
---

![Placa do MCP aponta tarefas, eventos, identidade e descoberta em um viaduto em construção.](./images/mcp-planeja-agentes-assincronos-e-postgresql-pede-uma-auditoria.jpg)

Uma chamada de ferramenta parece simples enquanto tudo termina antes do timeout. O agente pede, o servidor responde e cada um segue sua vida. A brincadeira muda quando a tarefa leva horas, precisa ser cancelada, acorda outro serviço e exige credencial própria. Aí já temos um sistema distribuído usando crachá de agente.

O novo roadmap do Model Context Protocol assume essa mudança sem muito romance. Do outro lado, uma configuração de compatibilidade do PostgreSQL mostra como fazer software antigo voltar a funcionar pode retirar verificações de privilégio dos large objects do banco inteiro. Hoje tem infraestrutura nova pedindo projeto e infraestrutura velha pedindo auditoria. O encanamento venceu de novo.

## MCP prepara tarefas que não terminam na mesma chamada

Os mantenedores do Model Context Protocol publicaram em 22 de agosto um roadmap voltado a agentes que trabalham por mais tempo. O protocolo já tem Tasks, notificações de progresso e o `subscriptions/listen`. O plano agora inclui eventos iniciados pelo servidor, via webhooks ou canais, e o amadurecimento da extensão de tarefas SEP-2663 dentro da especificação.

Pense numa ferramenta que dispara um job de vinte minutos. Com polling, o cliente pergunta “acabou?” repetidamente, até o servidor responder ou alguém perder a paciência. Com um evento iniciado pelo servidor, o progresso ou a conclusão chega quando alguma coisa muda. Parece mais cômodo porque é. Também traz uma lista bem adulta de problemas: identificador durável da tarefa, regras de entrega, cancelamento, autorização e observabilidade.

É a chamada de ferramenta virando runtime de agente. Se sua equipe mantém um servidor MCP, faz sentido desenhar estado e retomada antes de receber a primeira tarefa longa em produção. Deixar isso para depois costuma render um job que terminou, um cliente que não sabe e três dashboards contando histórias diferentes. Sistemas distribuídos também trabalham em equipe. Só raramente na mesma equipe.

O transporte vai pelo mesmo caminho. Desde a versão do protocolo de 28 de julho de 2026, o servidor MCP remoto é tratado como uma carga HTTP. O roadmap propõe unificar esse caminho em torno da semântica padrão do HTTP e reforçar a segurança. Para quem opera o serviço, entrega de eventos, autenticação, falha de rede e repetição de requisições passam a morar no centro do projeto.

### O agente ganha identidade própria, em vez da sua chave colada

A parte de identidade tenta aposentar um hábito ruim e muito conveniente: entregar ao agente uma chave de API durável pertencente ao usuário. Entre as prioridades, os mantenedores listam DPoP, identidade e delegação de agentes por Workload Identity Federation, o grant ID-JAG e troca padronizada de tokens.

DPoP vincula o token a uma chave criptográfica. Junto de identidade de workload e token exchange, isso abre caminho para credenciais curtas e limitadas à tarefa. Um agente que consulta um sistema e grava em outro pode receber só a autoridade necessária para aquele trabalho. Também fica mais fácil responder qual workload agiu, em nome de quem e por quanto tempo.

“O agente fez” é uma trilha de auditoria tão útil quanto “alguém mexeu”. Serviço, usuário e agente precisam continuar distinguíveis quando a automação atravessa ambientes. Dar uma chave humana ao runtime resolve a demo com a eficiência de esconder a chave de casa debaixo do tapete: é rápido, tradicional e só surpreende quem encontra primeiro.

### Catálogos enormes não precisam entrar inteiros no contexto

Outra prioridade é a descoberta progressiva de ferramentas. O servidor apresenta uma entrada pequena e revela outras partes do catálogo conforme a conversa se estreita. Se a pergunta é sobre deploy, o cliente não precisa carregar centenas ou milhares de descrições de ferramentas de cobrança, suporte e inventário para escolher o próximo passo.

Isso reduz consumo de contexto e ruído na seleção. Para servidores com catálogos grandes, a consequência prática é organizar ferramentas em superfícies que possam ser descobertas aos poucos. Despejar o manual inteiro no modelo e torcer para ele achar a chave certa no chaveiro continua sendo uma estratégia. Uma estratégia ruim, mas uma estratégia.

Por enquanto, Tasks, `subscriptions/listen` e notificações de progresso já existem. Webhooks, descoberta progressiva e o conjunto de identidade são prioridades do roadmap, ainda sem a promessa de que tudo esteja estável no núcleo do MCP. A direção ficou clara: quem constrói servidor MCP já pode pensar nele como serviço distribuído, com estado, eventos, credenciais curtas e catálogo navegável.

Fonte: [Model Context Protocol Blog — MCP Roadmap](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/).

## Uma chave do PostgreSQL pode desligar privilégios de large objects

O PostgreSQL tem uma configuração cujo nome parece peça esquecida no fundo da gaveta: `lo_compat_privileges`. Ela restaura o comportamento anterior ao PostgreSQL 9.0, quando large objects não tinham privilégios próprios e qualquer usuário podia ler ou escrever neles. Hoje, o padrão da opção é `off`.

Large objects são objetos separados, com metadados em `pg_largeobject_metadata`, proprietário e lista de controle de acesso. A aplicação pode tratá-los como arquivos guardados pelo banco, mas eles não são colunas comuns. Com `lo_compat_privileges` ligado, verificações introduzidas a partir da versão 9.0 deixam de proteger operações importantes.

A documentação oficial confirma o efeito geral. Christophe Pettus publicou em 22 de agosto uma análise da fronteira exata, depois de conferir o código do PostgreSQL 18 e testar num cluster temporário. Com a opção ligada, o banco pula verificações de leitura e escrita alcançadas por `lo_open()`. Também pula checagens de propriedade em `lo_unlink()`, comentários sobre large objects e security labels.

Outros controles continuam ativos: opções de concessão, transferência de propriedade e controles de execução das funções de filesystem do servidor, `lo_import()` e `lo_export()`, passam por verificações próprias. A configuração também exige ação de um administrador ou papel com permissão adequada para ser habilitada na sessão, no papel ou no banco.

Desde o PostgreSQL 15, essa permissão pode ser delegada com `GRANT SET ON PARAMETER`. Por isso, conferir apenas o arquivo principal de configuração pode deixar coisa para trás. Um papel pode receber a opção com `ALTER ROLE ... SET`; um banco, com `ALTER DATABASE ... SET`.

A auditoria começa com um comando pequeno:

```sql
SHOW lo_compat_privileges;
```

Se o resultado for `on`, teste a aplicação com a opção desligada e repare a permissão de que ela realmente precisa. Um caso comum aparece depois de migrações: um papel cria os large objects e a aplicação conecta com outro. O erro de permissão entrega a diferença de propriedade. Ligar a compatibilidade global faz o erro sumir porque remove verificações de todos os large objects. É o equivalente bancário de consertar uma porta emperrada arrancando as fechaduras do prédio.

A correção estreita pode trocar o proprietário do objeto ou conceder apenas o acesso necessário. Para leitura, Pettus recomenda `SELECT`; para escrita, a permissão correspondente é `UPDATE`. O ajuste deve alinhar ownership e ACLs ao desenho da aplicação, sem transformar um bypass geral na documentação informal de uma migração antiga.

Vale conferir o valor em cada ambiente relevante e procurar configurações por papel e por banco. Como a opção vem desligada por padrão, exposição exige que alguém a tenha habilitado. Se ela estiver ligada, porém, “compatibilidade” está cobrindo uma mudança material de autorização. É uma palavra educada demais para aparecer num checklist de segurança.

Fontes: [documentação atual do PostgreSQL sobre `lo_compat_privileges`](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-LO-COMPAT-PRIVILEGES) e [The Build — All Your GUCs in a Row: lo_compat_privileges](https://thebuild.com/blog/all-your-gucs-in-a-row-lo_compat_privileges/).

## Destaques rápidos para hoje.

- **O Linux recebeu hardening do eCryptfs para o ciclo 7.3.** O pull `ecryptfs-7.3-rc1`, integrado em 21 de agosto, reforça a validação de metadados vindos de arquivos cifrados e de mensagens entre userspace e kernel, além de corrigir locking. Entre os commits, um limita a leitura que avançava um byte além do buffer; outro rejeita chaves cifradas maiores que o destino de 64 bytes. São defeitos reais em duas fronteiras de confiança. Os registros públicos não trazem um CVE único, exploit, matriz de distribuições ou caminho demonstrado de escalada para o conjunto. E 7.3 aqui é o ciclo de desenvolvimento; a versão final ainda não está disponível. Fonte: [merge do eCryptfs no Linux](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=af33c5a2a9fd52f07ffb428255b7f060da1de49d), [correção do tamanho do pacote](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=95540462e630edbc8504e9537d16453d6942d143) e [limite da chave cifrada](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=5babe9c177c364521e3e682b949c5a8c47f4a441).

- **Ora e Vercel lançaram o Is Agentic para auditar sites públicos.** O scanner verifica conteúdo renderizado no servidor, comportamento HTTP, estrutura do documento, recuperação de erros e controles utilizáveis. Quando encontra superfícies como API, OAuth, GraphQL, MCP ou comércio, ativa testes recomendados. Relatórios concluídos ficam disponíveis no navegador, numa API JSON limitada a 120 requisições por IP a cada 60 segundos, na CLI oficial ou por três ferramentas MCP somente de leitura. Dá para encaixar a revisão em fluxo local ou CI. A própria documentação limita o resultado a uma revisão técnica priorizada, sem certificar automação para todo modelo, segurança, acessibilidade, privacidade ou conformidade legal. Fonte: [site oficial do Is Agentic](https://is-agentic.com/) e [documentação para desenvolvedores](https://is-agentic.com/docs).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 24713
source_urls:
  - https://blog.modelcontextprotocol.io/posts/mcp-roadmap/
  - https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-LO-COMPAT-PRIVILEGES
  - https://thebuild.com/blog/all-your-gucs-in-a-row-lo_compat_privileges/
  - https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=af33c5a2a9fd52f07ffb428255b7f060da1de49d
  - https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=95540462e630edbc8504e9537d16453d6942d143
  - https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=5babe9c177c364521e3e682b949c5a8c47f4a441
  - https://is-agentic.com/
  - https://is-agentic.com/docs
-->
