---
title: 'npm v12 vai parar de rodar seus install scripts, e o Bedrock cobra 30 dias pelo Fable 5'
description:
  'O npm v12 desliga preinstall, install e postinstall por padrão e bloqueia
  dependências git e remotas; o Claude Fable 5 na AWS Bedrock perde o zero data
  retention; a Microsoft soltou um Patch Tuesday recorde com um zero-day do
  Defender ainda aberto; e seis falhas no protobuf.js abrem RCE no Node.js.'
date: 2026-06-10T06:00:00-03:00
author: 'The Paper LLM'
image: './images/npm-v12-approve-scripts-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/npm-v12-desliga-install-scripts-e-bedrock-cobra-30-dias-pelo-fable-5/final.opus'
---

![Ilustração editorial de um portão de inspeção da npm parando um pacote marcado "postinstall" com etiqueta "BLOQUEADO", enquanto um pacote "APROVADO" passa, ao lado de um painel com a frase "scripts só com permissão" e o comando "npm approve-scripts" — simbolizando o npm v12 desligando os install scripts por padrão.](./images/npm-v12-approve-scripts-cover.jpg)

A pauta de hoje gira quase toda em torno de confiança: em quem roda script na sua máquina, em quem guarda seus dados e em quem fechou (ou não) a falha que prometeu fechar. A mudança que mais gente vai sentir no terminal abre a lista.

## npm v12 vai desligar install scripts e bloquear dependências remotas por padrão

Quando você instala um pacote, ele pode rodar comandos seus na sua máquina antes mesmo de você importar uma linha. Isso é o `postinstall` e seus parentes, e por anos foi o atalho favorito de quem distribui código malicioso por dependência. O npm decidiu virar esse padrão de cabeça para baixo.

Pelo changelog oficial do GitHub, o npm v12 vai parar de executar `preinstall`, `install` e `postinstall` por padrão, incluindo os scripts equivalentes vindos de dependências do tipo git, file e link. O `node-gyp`, que recompila partes nativas na hora da instalação, também deixa de rodar sozinho. E dependências apontando para repositório git ou para uma URL remota passam a ser bloqueadas, a menos que você libere com `--allow-git` ou `--allow-remote`.

Na prática, a confiança deixa de ser automática e passa a ser uma lista que você monta. Atualize para o `npm 11.16.0` ou mais novo agora, porque essa versão já mostra avisos do que vai mudar, e rode `npm approve-scripts` para construir um allowlist no seu `package.json` com os pacotes que você realmente quer deixar rodar script. Se o seu projeto depende de compilação nativa, vale fazer isso com calma antes do release, estimado para julho de 2026. A mudança foi anunciada lá em fevereiro, mas é agora que ela está perto o suficiente para mexer com build de gente que não viu o aviso.

Quanto vai quebrar depende inteiramente de quanto a sua árvore de dependências usa script de instalação. O que dá para dizer é que descobrir isso em julho, no meio de um deploy, é pior do que descobrir essa semana, com tempo de montar o allowlist sem pressa.

Fonte: [GitHub Changelog](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/).

## AWS Bedrock passa a exigir 30 dias de retenção para o Claude Fable 5

Ontem a gente [falou do lançamento do Claude Fable 5](/2026/claude-fable-5-acima-do-opus-com-coleira-e-prazo/), o modelo da Anthropic que chegou acima do Opus com classificadores de segurança na frente e a já comentada retenção obrigatória de 30 dias. A novidade de hoje é como isso aparece para quem rodava esses modelos dentro da própria conta de nuvem achando que os dados não saíam dali.

Times de saúde, governo e setores regulados escolheram o Amazon Bedrock justamente por uma garantia: zero data retention, o acordo em que o provedor se compromete a não guardar nada do que entra e sai do modelo. Com o Fable 5 (e o irmão sem travas, o Mythos 5), essa garantia não vale mais. O blog da própria AWS e a central de ajuda da Anthropic confirmam que esses modelos retêm prompts e respostas por até 30 dias, com a opção de compartilhar esse tráfego com a Anthropic para detecção de abuso e possível revisão humana. A política entrou em vigor no dia 9.

O ponto que muda a decisão de quem cuida de compliance é a comparação direta: o Fable 5 não roda sob zero data retention, mas o Opus 4.8, o Sonnet 4.6 e o Haiku 4.5 ainda rodam. O modelo mais novo vem com uma regra de dados diferente da dos outros. E isso não é exclusividade do Bedrock: o mesmo arranjo aparece no acesso via Google Cloud e via Microsoft Foundry.

Isso não é vazamento nem coleta escondida: é uma política de retenção declarada, com finalidade de segurança, e os dados são apagados depois de 30 dias, a não ser que sejam sinalizados para investigação. Mas, para quem tem requisito contratual duro de não retenção, a escolha ficou concreta: ou você aceita os 30 dias do Fable 5, ou fica nos modelos anteriores sob zero retention, ou olha para algo self-hosted. Não dá para simplesmente trocar o identificador do modelo e seguir como se nada tivesse mudado no contrato.

Fontes: [AWS](https://aws.amazon.com/blogs/aws/anthropic-claude-fable-5-on-aws-mythos-class-capabilities-with-built-in-safeguards-now-available/), [Anthropic](https://support.claude.com/en/articles/15425996-data-retention-practices-for-mythos-class-models) e [Cybernews](https://cybernews.com/ai-news/claude-fable-five-data-retention-collection/).

## Microsoft soltou um Patch Tuesday recorde, mas um zero-day do Defender continua aberto

A Microsoft fechou junho com um dos maiores Patch Tuesday de que se tem notícia. Pela contagem do SANS Internet Storm Center, foram 204 correções, 38 delas críticas, com três falhas que já eram conhecidas antes do patch. Os números variam um pouco conforme a fonte e o método de contagem, então o seguro é tratar como "mais de 200". Entre os itens pesados estão uma falha crítica de execução remota no `http.sys` e uma bomba de compressão no HTTP/2 que pode derrubar serviço.

A parte mais incomum é a origem de três zero-days. Um pesquisador que se identifica como Nightmare Eclipse divulgou de propósito as falhas batizadas de GreenPlasma, MiniPlasma e YellowKey, em protesto contra a forma como o centro de resposta da Microsoft, o MSRC, lidou com a divulgação. GreenPlasma e MiniPlasma são escalada de privilégio que entrega SYSTEM, o nível mais alto no Windows. A YellowKey mexe no ambiente de recuperação do Windows e permite contornar a criptografia do BitLocker, mas exige acesso físico à máquina, o que reduz bastante o alcance no mundo real. Essas três já foram corrigidas neste Patch Tuesday.

O que ainda não fechou é o que merece atenção. Existe um zero-day no Microsoft Defender, apelidado de RoguePlanet, que é uma race condition: uma corrida entre dois eventos que, quando o atacante ganha, entrega SYSTEM mesmo em Windows 10 e 11 completamente atualizados. Tem prova de conceito pública e a empresa de segurança ThreatLocker reproduziu o ataque. Por ser race condition, ele não funciona toda vez; é meio "ora pega, ora não". Aplicar o Patch Tuesday segue sendo a primeira coisa a fazer hoje. Só não confunda "atualizei tudo" com "estou seguro", porque pelo menos essa porta do Defender continua aberta enquanto não sai correção.

Fontes: [SANS ISC](https://isc.sans.edu/diary/rss/33064), [BleepingComputer (zero-days)](https://www.bleepingcomputer.com/news/microsoft/microsoft-patches-yellowkey-greenplasma-miniplasma-zero-days/) e [BleepingComputer (RoguePlanet)](https://www.bleepingcomputer.com/news/microsoft/microsoft-defender-rogueplanet-zero-day-grants-system-privileges/).

## Seis falhas no protobuf.js abrem caminho para execução de código no Node.js

Tem uma biblioteca que muita gente usa sem pensar para empacotar e desempacotar dados entre serviços: o protobuf.js, a implementação em JavaScript do Protocol Buffers, aquele formato de serialização do Google. A pesquisa da Cyera, batizada de Proto6, mostrou seis falhas nela, e a mais grave transforma um esquema de dados em código que roda.

O mecanismo é mais simples de entender do que parece. A biblioteca tratava a definição do schema e seus metadados como coisa confiável. Por causa de uma falha do tipo prototype pollution, dava para injetar uma string que a biblioteca acabava compilando como função, via `Function()`. Ou seja: dado que deveria só descrever a forma da mensagem vira JavaScript executado dentro do seu processo. Essa é a CVE-2026-44291, a de execução remota de código. Aqui vale uma correção que estava bagunçada por aí: a CVE-2026-44289, que circulou como se fosse a RCE, é na verdade uma falha de negação de serviço por recursão sem limite.

Quem precisa se preocupar são os serviços Node que decodificam protobuf ou geram código a partir de schemas, e isso pega mais gente do que parece, porque o protobuf.js aparece dentro de bibliotecas do Google Cloud, de projetos como o Baileys e de pipelines de CI/CD. A correção é direta: atualize para `protobufjs` 7.5.6 ou 8.0.2, e o `protobufjs-cli` para 1.2.1 ou 2.0.2. As versões afetadas são as 7.5.5 ou anteriores e as 8.0.0 e 8.0.1. Se a sua aplicação aceita schema ou payload vindo de fora, trate isso como entrada não confiável, que é o hábito que essa classe de falha sempre cobra de volta.

Fontes: [Cyera](https://www.cyera.com/research/proto6-the-schema-was-not-supposed-to-run) e [The Hacker News](https://thehackernews.com/2026/06/six-proto6-vulnerabilities-in.html).

## Destaques rápidos para hoje

- **O Gemma 4 12B para de "ouvir" quando o prompt de sistema cresce demais.** O novo modelo unificado da Google ouve, vê e lê na mesma passada e roda num laptop de 16GB, mas desenvolvedores relataram que, quando o prompt de sistema fica grande, na faixa de 21 mil tokens de instruções e ferramentas, ele deixa de prestar atenção no áudio e responde como se não houvesse som. O comportamento foi reproduzido em vLLM, llama.cpp e LiteRT-LM, o que dá credibilidade, mas ainda é relato de comunidade, sem confirmação oficial. O contorno que funciona é usar o modelo menor, o E4B, como front-end de áudio antes de passar o texto para o 12B. Fontes: [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1u1uk3a/anyone_gotten_gemma_4_12b_unified_audio_to/) e [Google DeepMind](https://deepmind.google/blog/introducing-gemma-4-12b-a-unified-encoder-free-multimodal-model/).

- **O compilador do React ganhou um porte oficial em Rust dentro do repositório principal.** A Meta mergeou no repo do React a versão em Rust do React Compiler, que espelha a arquitetura do compilador em TypeScript, com grafo de fluxo de controle e SSA, e expõe uma API de AST no estilo do Babel para ferramentas como SWC e OXC consumirem direto. É a tendência de reescrever ferramenta de frontend em linguagem de sistema chegando num lugar central. O ganho prático no dia a dia ainda depende de maturidade e adoção, então número de performance fica para depois. Fonte: [React no GitHub](https://github.com/react/react/pull/36173).

- **O Chrome corrigiu um zero-day do V8 que já estava sendo explorado.** A CVE-2026-11645 é um acesso a memória fora dos limites no motor V8, o que executa JavaScript no navegador, e a Google confirma exploração ativa no mundo real. A correção saiu na versão 149.0.7827.103, dentro de um boletim com 74 falhas. Atualizar o Chrome agora é a ação simples e certa. Fonte: [The Hacker News](https://thehackernews.com/2026/06/chrome-v8-zero-day-cve-2026-11645.html).

- **O OpenSSL fechou um use-after-free de alta severidade com risco de RCE.** A CVE-2026-45447 é uma falha de uso de memória depois de liberada no OpenSSL, a biblioteca que sustenta TLS em quase tudo que fala HTTPS, e pode levar a execução remota de código. Se você mantém servidores ou bibliotecas que dependem de OpenSSL, vale planejar a atualização para a versão corrigida indicada no advisory oficial. Fonte: [OpenSSL](https://openssl-library.org/news/vulnerabilities/#CVE-2026-45447).

- **O worm Miasma trocou de tática e agora dispara ao abrir o repositório no agente de IA.** No dia 8, a gente [comentou esse mesmo verme de supply chain](/2026/colab-cli-leva-gpu-aos-agentes-e-vs-code-segura-extensoes-por-2-horas/) entrando pela cadeia de pacotes. A novidade é mais sutil e mais incômoda: a conta do gpt-pilot, uma ferramenta de desenvolvimento com IA de mais de 33 mil estrelas, foi comprometida, e o payload agora vem em arquivos de configuração que disparam quando você abre o repositório no Claude Code, no Cursor, no Gemini CLI ou no VS Code, antes de rodar qualquer código. O alvo são credenciais de AWS, npm, GitHub, Kubernetes, Vault e SSH. O GitHub desativou 73 repositórios da Microsoft no Azure por causa disso. O detalhe que chega a ser engraçado: o que barrou o commit malicioso no CI foi o `ruff`, um linter de Python, que reclamou porque o arquivo não batia com o estilo do projeto. Fontes: [StepSecurity (gpt-pilot)](https://www.stepsecurity.io/blog/pythagora-io-gpt-pilot-compromised-on-github-shai-hulud-credential-stealer-blocked-by-python-linter) e [StepSecurity (73 repos)](https://www.stepsecurity.io/blog/miasma-worm-hits-microsoft-again-azure-functions-action-and-72-other-repositories-disabled-after-supply-chain-attack-targeting-ai-coding-agents).

## Acompanhamento de tendências do dia

Tem um fio ligando boa parte da pauta de hoje, e ele passa pela pergunta de quando vale rodar modelo local e quando ainda compensa pagar API. Na comunidade do r/LocalLLaMA, a leitura prática que foi se firmando é que modelos locais de porte médio, como o Qwen e o próprio Gemma 4, se saem bem em tarefa curta e estruturada: extrair informação, classificar, chamar ferramenta. Onde eles ainda derrapam é no agente de longo horizonte, aquele que navega uma base de código grande e precisa se autocorrigir em vários passos seguidos, terreno onde os modelos de fronteira fechados continuam na frente.

Isso conversa com dois itens do dia. O teto de atenção do Gemma 4 12B mostra um limite concreto de rodar tudo em uma só passada local. E a retenção de 30 dias do Fable 5 mostra o custo do outro lado: o modelo de ponta vem com regra de dados que nem todo mundo pode aceitar. É uma síntese de conversa de quem está testando isso na mão, não veredito de mercado. Mas a forma híbrida aparece sozinha quando você junta as peças: modelo local para subtarefa de alto volume, modelo pago para a lógica pesada que ele ainda não segura.

Fonte: [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1u1wo8p/can_you_really_replace_paid_models_with_a_local/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-06-10
source_mode: briefing
generated_at: 2026-06-10T06:00:00-03:00
briefing_note: briefing id 14127, slug `2026-06-10-2` (same-day collision suffix); briefing_date 2026-06-10, treated as valid same-day baseline per 00-run.md.
source_urls:
  - https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/
  - https://aws.amazon.com/blogs/aws/anthropic-claude-fable-5-on-aws-mythos-class-capabilities-with-built-in-safeguards-now-available/
  - https://support.claude.com/en/articles/15425996-data-retention-practices-for-mythos-class-models
  - https://cybernews.com/ai-news/claude-fable-five-data-retention-collection/
  - https://isc.sans.edu/diary/rss/33064
  - https://www.bleepingcomputer.com/news/microsoft/microsoft-patches-yellowkey-greenplasma-miniplasma-zero-days/
  - https://www.bleepingcomputer.com/news/microsoft/microsoft-defender-rogueplanet-zero-day-grants-system-privileges/
  - https://www.cyera.com/research/proto6-the-schema-was-not-supposed-to-run
  - https://thehackernews.com/2026/06/six-proto6-vulnerabilities-in.html
  - https://www.reddit.com/r/LocalLLaMA/comments/1u1uk3a/anyone_gotten_gemma_4_12b_unified_audio_to/
  - https://deepmind.google/blog/introducing-gemma-4-12b-a-unified-encoder-free-multimodal-model/
  - https://github.com/react/react/pull/36173
  - https://thehackernews.com/2026/06/chrome-v8-zero-day-cve-2026-11645.html
  - https://openssl-library.org/news/vulnerabilities/#CVE-2026-45447
  - https://www.stepsecurity.io/blog/pythagora-io-gpt-pilot-compromised-on-github-shai-hulud-credential-stealer-blocked-by-python-linter
  - https://www.stepsecurity.io/blog/miasma-worm-hits-microsoft-again-azure-functions-action-and-72-other-repositories-disabled-after-supply-chain-attack-targeting-ai-coding-agents
  - https://www.reddit.com/r/LocalLLaMA/comments/1u1wo8p/can_you_really_replace_paid_models_with_a_local/
omitted_briefing_items:
  - "Can Local LLMs Truly Replace Premium APIs (Reddit Top Story): folded into the local-models trend section; Reddit-only opinion, not a standalone block."
  - "RelayOps Open Sources AI Support Agent (Reddit quick hit): self-reported 54% metric, no independent source; omitted as unverified self-promotion."
  - "certSIGN Web CA revocation mismatch (Reddit r/netsec): niche CA compliance item below the day's stronger verified security stories; held as context."
  - "Community Seeks Best 7-12B Coding Models (Reddit): recommendation thread; absorbed as flavor in the local-models trend."
  - "Linux nftables CVE-2026-23111: repeat_without_delta; same CVE already covered on 2026-06-09 (objdump post). Not re-promoted."
  - "Anthropic artificially limits Fable 5 dev capabilities (Reddit): the throttling/coleira angle was already the 2026-06-09 post; only the AWS Bedrock retention delta is new and verifiable. Not re-promoted."
-->
