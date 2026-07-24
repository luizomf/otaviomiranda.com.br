---
title: 'Claude Opus 5 custa metade do Fable, mas a migração pede atenção'
description: 'A Anthropic lançou o Claude Opus 5 com contexto de 1 milhão de tokens, thinking ligado por padrão, novos níveis de effort e salvaguardas específicas para segurança.'
date: 2026-07-24T15:06:44-03:00
author: 'The Paper LLM'
image: './images/claude-opus-5-custa-metade-do-fable-mas-a-migracao-pede-atencao.jpg'
---

![Mala laranja do Claude Opus 5 passa por um checkpoint de migração de API.](./images/claude-opus-5-custa-metade-do-fable-mas-a-migracao-pede-atencao.jpg)

Trocar o nome de um modelo na configuração leva alguns segundos. Descobrir depois que ele passou a raciocinar por padrão, gastou mais tokens que o esperado e rejeitou uma combinação antiga de parâmetros leva um pouco mais. O Claude Opus 5 chegou hoje com essa mistura: preço-base conhecido, capacidades maiores e uma migração que parece simples até a gente olhar o comportamento da API.

A Anthropic posiciona o novo Opus para coding com agentes, tarefas longas e trabalho profissional. Ele custa o mesmo que o Opus 4.8 e, por token, metade do Fable 5. Para equipes que acharam o Fable caro, o teste ficou bem mais interessante. Ainda assim, benchmark do fornecedor não é cheque em branco. Antes de apontar a produção para `claude-opus-5`, é preciso medir custo por tarefa, ferramentas, subagentes, latência e salvaguardas.

## Opus 5 reduz o preço sem tentar substituir todo o Fable

A Anthropic lançou o Claude Opus 5 em 24 de julho de 2026. O modelo já está disponível nos produtos Claude e na API, com o ID `claude-opus-5`. Ele virou o padrão para assinantes do Claude Max e, segundo a empresa, é o modelo mais forte oferecido no Claude Pro.

O preço-base é de US$ 5 por milhão de tokens de entrada e US$ 25 por milhão de tokens de saída. São os mesmos valores do Opus 4.8 e metade dos US$ 10 e US$ 50 cobrados pelo Fable 5. [Quando o Fable apareceu por aqui](/2026/claude-fable-5-acima-do-opus-com-coleira-e-prazo/), o pacote combinava contexto grande, desempenho de ponta e uma coleira operacional mais apertada. Agora temos uma opção mais barata, sem requisito geral de retenção de dados e com classificadores de cibersegurança que, segundo a Anthropic, intervêm menos.

O Opus 5 não é simplesmente “Fable pela metade do preço”. A própria Anthropic ainda coloca Fable e Mythos à frente em partes do trabalho de longa duração e de segurança cibernética. A comparação que ajuda começa pelo workload, não pelo sobrenome do modelo.

Na API, o Opus 5 tem uma janela de contexto de 1 milhão de tokens e pode gerar até 128 mil tokens. A primeira medida diz quanto material cabe na requisição ou conversa. A segunda é o teto da saída inteira, incluindo raciocínio e resposta visível. Não é uma promessa de que produzir 128 mil tokens será útil ou barato.

Fonte: [Anthropic — Introducing Claude Opus 5](https://www.anthropic.com/news/claude-opus-5) e [Claude Platform Docs — What's new in Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5).

## Thinking ligado por padrão muda a conta da migração

A troca mínima do Opus 4.8 para o Opus 5 é quase um drop-in: basta mudar o ID do modelo. O comportamento padrão, porém, mudou. Quando a requisição omite o campo `thinking`, o Opus 5 ativa o chamado adaptive thinking. Nesse modo, o próprio modelo decide quando raciocinar e quanto trabalho dedicar a essa etapa.

Numa integração que usava o Opus 4.8 sem thinking, isso pode mexer no consumo de tokens, na latência e no custo real. O parâmetro `max_tokens` limita o total usado pelo raciocínio e pela resposta final. Aquele teto que antes parecia folgado pode virar gargalo quando parte dele é consumida antes mesmo de o texto visível começar.

O modelo também aceita a escada completa de `effort`: `low`, `medium`, `high`, `xhigh` e `max`. Esse parâmetro sinaliza quanto trabalho o modelo deve gastar, mas não é um orçamento rígido. A documentação mantém `high` como uma base razoável e recomenda reservar bastante `max_tokens` para `xhigh` e `max`.

Uma combinação quebra de forma explícita: desativar thinking com effort em `xhigh` ou `max` retorna HTTP 400. Com `high` ou menos, `thinking: {"type": "disabled"}` continua aceito. A Anthropic recomenda manter o raciocínio ligado e reduzir o effort quando possível. Desligar o thinking também pode fazer o modelo imprimir uma chamada de ferramenta como texto ou expor tags XML internas em alguns casos.

É mudança para teste de contrato, não só para uma chamada feliz no playground. Eu cobriria pelo menos as combinações de parâmetros, o limite de saída, custo, latência, tool calls, verbosidade e delegação para subagentes. Modelo novo costuma passar no teste “responda olá”. Produção, infelizmente, tem imaginação maior.

Fonte: [Claude Platform Docs — What's new in Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5) e [Claude Platform Docs — Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-4-8-to-claude-opus-5).

## Velocidade, cache e ferramentas também entram no QA

Para quem prefere pagar mais e esperar menos, o Opus 5 estreia um Fast mode. A Anthropic reporta uma velocidade cerca de 2,5 vezes maior que a do modo padrão, pelo dobro do preço: US$ 10 por milhão de tokens de entrada e US$ 50 por milhão de tokens de saída. O recurso chega como research preview e, no lançamento, está restrito à Claude API. A documentação não o oferece por Amazon Bedrock, Google Cloud ou Microsoft Foundry.

O prompt cache agora aceita prefixos menores. O mínimo caiu de 1.024 tokens no Opus 4.8 para 512 no Opus 5. Isso pode ajudar integrações com instruções recorrentes que antes não alcançavam o tamanho necessário para cache. A economia concreta, claro, ainda depende do padrão das chamadas.

Duas funções beta acompanham o modelo. A primeira permite adicionar ou remover ferramentas no meio da conversa sem invalidar todo o prompt cache, usando o header `mid-conversation-tool-changes-2026-07-01`. A segunda cria um modo de fallback padrão no servidor, habilitado por `server-side-fallback-2026-07-01`. Os nomes datados lembram que beta não é decoração: o cliente precisa enviar o header certo e tolerar mudanças de contrato.

O guia de migração também traz duas ausências: web fetch e Priority Tier não são suportados no Opus 5 no lançamento. Se a aplicação depende de uma delas, trocar o ID deixa de ser migração e vira descoberta de requisito em horário comercial.

Um roteiro curto de validação fica assim:

- medir custo e latência com thinking e effort nos níveis realmente usados;
- ajustar `max_tokens` para o orçamento conjunto de raciocínio e resposta;
- testar chamadas de ferramentas, cache e trabalho delegado a subagentes;
- confirmar se web fetch ou Priority Tier fazem parte do fluxo;
- separar Fast mode da configuração de provedores cloud, onde ele ainda não está disponível.

Fonte: [Claude Platform Docs — What's new in Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5) e [Claude Platform Docs — Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-4-8-to-claude-opus-5).

## Os benchmarks são promissores e continuam sendo da Anthropic

A Anthropic diz que o Opus 5 alcançou estado da arte no Frontier-Bench versão 0.1. Segundo a empresa, ele mais que dobrou o desempenho do Opus 4.8 nesse teste, com menor custo por tarefa. No CursorBench 3.2, usando effort máximo, o modelo teria ficado a 0,5 ponto percentual do pico do Fable 5 por metade do custo por tarefa.

Os resultados justificam uma avaliação, mas não encerram a avaliação. A maior parte dos testes do system card foi feita internamente. O harness, o nível de effort e o desenho da tarefa variam. E preço por token não é a mesma coisa que custo por tarefa: um modelo mais barato pode usar mais tokens ou demorar mais; outro mais caro pode terminar com menos tentativas.

O Frontier-Bench citado ainda tem condições importantes. Foi uma execução interna no mini-SWE-agent sobre GKE, com média de cinco tentativas por tarefa. Quando os classificadores recusaram pedidos, o teste usou Opus 4.8 como fallback. O número continua válido dentro desse teste, mas serve mal para comparação direta. Pior ainda seria copiar a tabela para uma apresentação como se ela fosse uma medição neutra do universo.

O retrato mais seguro é este: de acordo com a Anthropic, os maiores avanços sobre o Opus 4.8 aparecem em coding com agentes, uso de computador e trabalho prolongado. Para descobrir se o avanço sobrevive ao seu repositório, às suas ferramentas e ao seu orçamento, só rodando a tarefa completa.

Fontes: [Anthropic — Introducing Claude Opus 5](https://www.anthropic.com/news/claude-opus-5) e [Anthropic — System Card: Claude Opus 5](https://www.anthropic.com/claude-opus-5-system-card).

## Segurança permite encontrar falhas, mas restringe a exploração

O Opus 5 tem uma política específica para trabalho de cibersegurança. A Anthropic permite buscar vulnerabilidades em código-fonte. Já pentest, geração de exploits e análise de binários podem acionar bloqueios. Para equipes defensivas, a diferença é prática: localizar uma falha num repositório e demonstrar sua exploração não recebem o mesmo tratamento.

Nos produtos Claude.ai, Claude Code e Claude Cowork, pedidos de cyber sinalizados caem por padrão para o Opus 4.8. A aplicação precisa distinguir esse fallback de uma resposta produzida pelo modelo solicitado originalmente, principalmente se compara resultados, registra auditoria ou depende de um comportamento específico do Opus 5.

Segundo a Anthropic, os novos classificadores intervêm cerca de 85% menos que os do Fable 5. A empresa também diz que o Opus 5 se aproxima do Mythos 5 para encontrar vulnerabilidades, mas continua substancialmente atrás dele na capacidade de explorá-las. Esses resultados vêm das avaliações e da taxonomia da própria Anthropic.

Equipes com uso defensivo legítimo que esbarra nessas restrições podem recorrer ao Cyber Verification Program. Participantes já aprovados recebem acesso a uma variante menos restritiva, quando disponível. O programa exige retenção de dados habilitada, não funciona no Bedrock nem no Vertex AI e não libera usos proibidos. São requisitos diferentes: o acesso geral ao Opus 5 não exige retenção, mas a participação no programa exige.

Fonte: [Anthropic — Introducing Claude Opus 5](https://www.anthropic.com/news/claude-opus-5) e [Claude Help Center — Real-time cyber safeguards on Claude Opus and Sonnet](https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude-opus-and-sonnet).

## Mais preciso não quer dizer mais confiável em toda resposta

O system card aplica ao Opus 5 as proteções ASL-3 e o classifica como CB-1, não CB-2. A Anthropic também conclui que o modelo não cruza seu limiar para capacidade automatizada de pesquisa e desenvolvimento em IA. Esses rótulos são avaliações de risco da empresa, feitas segundo a metodologia dela. Não são certificações externas.

O documento traz um caveat fácil de perder no meio dos gráficos. O Opus 5 foi mais preciso no geral, mas alucinou afirmações factuais ligeiramente mais que o Opus 4.8. A avaliação também encontrou respostas confiantes sobre pontos dos quais o modelo não tinha certeza.

Os ganhos reportados continuam ali. O que não dá é concluir que um modelo melhor em média precisa de menos verificação em cada tarefa. Para coding, o teste continua sendo teste. Para trabalho profissional, a fonte continua sendo fonte. E, quando a resposta vier segura demais, talvez seja uma boa hora de conferir se a razão acompanhou a confiança.

Na prática, o Opus 5 parece ocupar este espaço: aproxima parte da capacidade dos modelos mais caros sem repetir o preço-base deles. O valor real vai aparecer depois da migração, quando a equipe medir a tarefa inteira e descobrir quanto thinking, effort, ferramenta, fallback e revisão humana entraram na conta.

Fonte: [Anthropic — System Card: Claude Opus 5](https://www.anthropic.com/claude-opus-5-system-card).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://www.anthropic.com/news/claude-opus-5
  - https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5
  - https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-4-8-to-claude-opus-5
  - https://www.anthropic.com/claude-opus-5-system-card
  - https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude-opus-and-sonnet
-->
