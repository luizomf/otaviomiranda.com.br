---
title:
  'Terrarium, Lazarus e benchmarks: 4 alertas sobre segurança e infraestrutura
  de agentes de IA'
description:
  'Falha no Terrarium, campanha da Lazarus contra desenvolvedores, ruído em
  benchmarks de coding agents e a arquitetura do Managed Agents mostram onde
  estão os riscos reais da IA aplicada ao desenvolvimento.'
date: 2026-04-23T09:00:50-03:00
author: 'The Paper LLM'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/terrarium-lazarus-e-benchmarks-4-alertas-sobre-seguranca-e-infra-de-agentes-de-ia/final.opus'
---

<!--
briefing_slug: 2026-04-23
generated_at: 2026-04-23T09:00:50-03:00
source_urls:
- https://kb.cert.org/vuls/id/414811
- https://www.anthropic.com/engineering/infrastructure-noise
- https://expel.com/blog/inside-lazarus-how-north-korea-uses-ai-to-industrialize-attacks-on-developers/
- https://www.anthropic.com/engineering/managed-agents
-->

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

O lote de hoje gira em torno do mesmo problema: muita gente ainda olha para IA
pensando só no modelo, mas os riscos e os gargalos estão cada vez mais no
runtime, no sandbox, no ambiente de execução e no jeito como essas ferramentas
entram no fluxo de trabalho de quem desenvolve.

## Terrarium mostra como um sandbox pode virar parte do problema

Em 21 de abril de 2026, o CERT/CC publicou a nota VU#414811 sobre uma falha no
Terrarium, plataforma de execução de código em sandbox. O problema está numa
travessia da cadeia de protótipos JavaScript dentro do ambiente Pyodide, o que
abre caminho para alcançar o `globalThis`, acessar internals do Node.js e
executar comandos arbitrários com privilégios de root no processo hospedeiro.

O ponto mais importante aqui não é só a existência da falha. É o tipo de
confiança que ela quebra. Ferramentas como o Terrarium costumam aparecer
justamente no momento em que alguém pensa: "beleza, vou deixar o modelo gerar
código porque isso aqui está isolado". Quando a camada de isolamento falha, o
sandbox deixa de ser proteção e passa a ser mais uma superfície de ataque.

O CERT/CC diz que não conseguiu coordenar uma correção com o fornecedor e lista
mitigações mais defensivas do que curativas: segmentação de rede, monitoramento
da atividade do container, controles de acesso e redução de funcionalidades
expostas. Em português claro, se você executa código não confiável, o ideal
continua sendo reduzir o raio de explosão desde o início, não presumir que o
sandbox vai segurar tudo sozinho.

Fonte: [CERT/CC - VU#414811](https://kb.cert.org/vuls/id/414811)

## A campanha descrita pela Expel leva o ataque direto para o workflow do dev

Em 22 de abril de 2026, a Expel publicou um relatório sobre um grupo que ela
rastreia com alta confiança como ligado à Coreia do Norte. O alvo principal são
desenvolvedores de Web3, mas a mecânica do ataque interessa a qualquer pessoa
que receba repositório de teste, projeto de entrevista ou prova técnica para
rodar localmente.

Segundo a Expel, o grupo usa falsas ofertas de emprego e envia take-home
assessments adulterados. Em vários casos, o pacote vem com `tasks.json`
malicioso no VS Code, configurado para disparar código assim que a pasta é
aberta. Quando isso não basta, o próprio código do projeto já traz backdoors
pensados para rodar quando a vítima tenta executar a aplicação.

O detalhe que chama atenção é o uso pesado de ferramentas de IA generativa no
processo. No relatório, a Expel diz que o grupo abusa de ferramentas como Cursor
e ChatGPT para escalar a operação. O resultado não é "malware mágico feito por
IA". É algo mais pé no chão e, por isso mesmo, mais perigoso: campanhas mais
baratas, melhor escritas e mais fáceis de multiplicar.

Esse tipo de história é um bom lembrete de que abrir pasta, confiar em automação
do editor e rodar projeto de terceiros já faz parte do modelo de ameaça. Não é
só navegador, e-mail ou anexo estranho. O ambiente de desenvolvimento entrou de
vez nessa conta.

Fonte:
[Expel - Inside Lazarus: How North Korea uses AI to industrialize attacks on developers](https://expel.com/blog/inside-lazarus-how-north-korea-uses-ai-to-industrialize-attacks-on-developers/)

## Benchmarks de agentes podem mudar bastante só por causa da infraestrutura

Em um texto recente de engenharia, a Anthropic argumenta que benchmarks de
coding agents podem variar vários pontos percentuais sem que o modelo mude. A
mudança vem só da configuração de infraestrutura. No experimento descrito pela
empresa, a diferença entre o setup mais restrito e o menos restrito no
Terminal-Bench 2.0 chegou a 6 pontos percentuais.

Os números do texto ajudam a entender o tamanho do ruído. Em configuração
estrita, os erros de infraestrutura ficaram em 5,8%. No cenário sem limite,
caíram para 0,5%. Até certo ponto, dar mais folga de CPU e memória corrige
instabilidade que nem deveria contaminar a medição. Depois desse ponto, a
própria prova muda, porque agentes mais pesados passam a conseguir instalar
dependências grandes, abrir subprocessos caros e tentar estratégias que morrem
sob orçamento apertado.

Essa distinção importa muito. Uma coisa é remover ruído operacional. Outra é
facilitar a prova sem dizer claramente que isso aconteceu. O argumento da
Anthropic é simples: leaderboard de agente não vale muita coisa sem CPU, RAM,
limite rígido, método de enforcement e janela de tempo bem descritos. Diferença
pequena demais, sem metodologia clara, merece desconfiança.

Fonte:
[Anthropic - Quantifying infrastructure noise in agentic coding evals](https://www.anthropic.com/engineering/infrastructure-noise)

## Managed Agents reforça uma separação que muita stack ainda ignora

Em outro texto de engenharia, a Anthropic descreve a arquitetura do Managed
Agents como uma separação mais dura entre sessão, harness e sandbox. A ideia é
parar de tratar o agente inteiro como um container único, frágil e cheio de
acoplamentos. Em vez disso, o "cérebro" fica desacoplado das "mãos", e cada
parte pode falhar, reiniciar ou ser trocada sem levar o resto junto.

O ganho não fica só na elegância da arquitetura. A Anthropic diz que, com essa
separação, a recuperação de falhas ficou mais simples, a integração com VPCs dos
clientes melhorou e a latência até o primeiro token caiu bastante. No texto, a
empresa afirma que o p50 de time-to-first-token caiu cerca de 60%, enquanto o
p95 caiu mais de 90%.

Tem também um ponto de segurança que vale prestar atenção. Quando código não
confiável roda no mesmo container que guarda credenciais e contexto, uma injeção
bem sucedida precisa atravessar bem menos barreiras para encontrar segredo
valioso. Separar harness, sessão e sandbox não elimina risco, mas corta um
atalho ruim que aparece em muita implementação apressada.

Fonte:
[Anthropic - Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)

## Destaques rápidos

- O texto do Martin Fowler sobre [technical, cognitive, and intent debt](https://martinfowler.com/fragments/2026-04-02.html) continua valendo a leitura porque põe nome num problema que muita equipe já está sentindo: não é só o código que degrada quando a automação entra sem cuidado. O entendimento do sistema e a clareza sobre o que o time realmente quis construir também começam a escorregar. Fonte: [Martin Fowler - Technical, cognitive, and intent debt](https://martinfowler.com/fragments/2026-04-02.html)

- O paper sobre [hidden measurement error in LLM pipelines](https://arxiv.org/abs/2604.11581) combina bem com a discussão sobre benchmarks acima. A ideia central é simples: juiz, prompt, temperatura e detalhes do pipeline conseguem distorcer avaliação a ponto de fazer diferença pequena parecer grande. Fonte: [arXiv - Hidden Measurement Error in LLM Pipelines Distorts Annotation, Evaluation, and Benchmarking](https://arxiv.org/abs/2604.11581)

- Em [The Tool-Overuse Illusion](https://arxiv.org/abs/2604.19749), os autores batem numa tecla que aparece com frequência em stacks de agentes: mais ferramenta nem sempre significa mais capacidade. Em bastante caso, excesso de chamada é sintoma de orquestração ruim ou planejamento fraco. Fonte: [arXiv - The Tool-Overuse Illusion](https://arxiv.org/abs/2604.19749)

- O trabalho [AVISE](https://arxiv.org/abs/2604.20833) chama atenção por um motivo bem prático: segurança de IA precisa de suíte de avaliação repetível, não só demo bonita de lançamento. Ainda está cedo, mas a direção faz sentido. Fonte: [arXiv - AVISE: Framework for Evaluating the Security of AI Systems](https://arxiv.org/abs/2604.20833)

## Acompanhamento de tendências

- A fronteira de segurança está descendo a pilha. O risco aparece menos no prompt isolado e mais no editor, no sandbox, no runner, no CI e no container onde o agente realmente vive.

- A discussão sobre benchmark está ficando menos glamourosa e mais útil. Infraestrutura, metodologia e critério de avaliação estão pesando tanto quanto o modelo em si.

- Plataformas de agentes estão ficando com cara de produto de infraestrutura. Memória, identidade, observabilidade, isolamento e governança já não são detalhe de implementação.

## Fechando o quadro

Juntando as quatro histórias, o padrão fica claro: a discussão séria sobre
agentes de IA está descendo a pilha. O modelo continua importante, claro. Mas o
estrago real e as diferenças práticas estão aparecendo no container, no editor,
no benchmark, no scheduler, no sandbox e na forma como tudo isso conversa com
código e credenciais do mundo real.
