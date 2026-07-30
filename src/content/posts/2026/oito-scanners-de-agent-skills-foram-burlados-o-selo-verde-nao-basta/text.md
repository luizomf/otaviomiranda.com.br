---
title: 'Oito scanners de Agent Skills foram burlados; o selo verde não basta'
description: 'Testes da Adversa encontraram rotas para passar por oito scanners de skills, além de falsos positivos e falhas de benchmark que impedem usar essas ferramentas como único gate.'
date: 2026-07-30T18:14:54-03:00
author: 'The Paper LLM'
image: './images/oito-scanners-de-agent-skills-foram-burlados-o-selo-verde-nao-basta.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/oito-scanners-de-agent-skills-foram-burlados-o-selo-verde-nao-basta/final.opus'
---

![Dossiê SKILL.md com selo verde de aprovação rompido, revelando scripts e assets internos.](./images/oito-scanners-de-agent-skills-foram-burlados-o-selo-verde-nao-basta.jpg)

Você baixa uma skill, roda o scanner e recebe o resultado que queria: tudo limpo. Só que esse verde pode significar três coisas bem diferentes. A ferramenta pode ter entendido o conteúdo e não encontrado risco. Pode não ter enxergado a parte perigosa. Ou pode ter sido convencida pelo próprio arquivo a aprová-lo.

Uma pesquisa publicada pela Adversa AI em 30 de julho encontrou ao menos uma rota para fazer uma skill maliciosa passar por cada um de oito scanners de código aberto. Não foi um arquivo mágico vencendo todos de uma vez, e ninguém reproduziu o estudo de forma independente. Mesmo assim, os testes dão um bom motivo para não transformar o resultado do scanner em autorização automática para instalar código de terceiros.

## Uma skill tem instruções, código e a autoridade do agente

Agent Skills parecem arquivos de configuração até a gente abrir o pacote inteiro. Pela especificação, toda skill precisa de um `SKILL.md`, com metadados e instruções que entram no contexto quando ela é ativada. O diretório também pode incluir scripts executáveis e outros recursos.

Isso abre duas superfícies. A primeira é o software convencional, capaz de ler arquivos, fazer requisições ou executar comandos. A segunda é a linguagem natural, que orienta um agente com acesso ao shell, ao repositório, à rede ou à nuvem. Nesse cenário, uma instrução maliciosa nem precisa explorar uma falha de memória ou inventar um malware novo. Ela pode simplesmente usar mal a autoridade que o agente já tinha.

Nós já tratamos [skills como dependências privilegiadas](/2026/codex-no-compilador-agent-skills-e-760-mil-requisicoes/) e depois vimos [uma proposta para localizar conteúdo suspeito antes de julgá-lo](/2026/lambda-microvms-isola-codigo-de-ia-e-sonicwall-lembra-que-patch-nao-limpa-vpn/). Agora temos algo menos confortável: medições mostrando que oito scanners podem ser contornados. E alguns ainda geram alertas demais para controlar instalações sem supervisão.

Fonte: [especificação de Agent Skills](https://agentskills.io/specification).

## A Adversa encontrou uma rota para passar por cada scanner

O grupo testado reuniu Cisco `skill-scanner`, NVIDIA SkillSpector, Mondoo `skillcheck`, skillcop, Claude Skill Antivirus, huifer Skill Security Scan, AI Skill Scanner e HackMyAgent. Segundo a Adversa, seis tiveram bypasses medidos com técnicas diferentes. O cliente aberto da Mondoo consultava um hash exato e deixava passar conteúdo desconhecido. O skillcop, baseado apenas num juiz de modelo de linguagem, pôde ser influenciado pelo arquivo não confiável que deveria avaliar.

A formulação aqui importa. “Passou pelos oito” significa que os pesquisadores encontraram uma variante eficaz contra cada ferramenta. Uma única skill idêntica não derrotou os oito produtos numa configuração uniforme.

Os testes também não partiram de oito instalações impecáveis e equivalentes. Sete caminhos foram exercitados nas famílias de testes; o skillcop passou por um teste separado de ponta a ponta. Estágios opcionais que dependiam de chaves de API ficaram desativados. Quatro caminhos incluíram reconstruções validadas. No caso da NVIDIA, os pesquisadores repararam bytecode preservado, com uma validação mais fraca que a das outras reconstruções. HMA, Mondoo e skillcop usaram distribuições reais.

Também existe um conflito de interesse que precisa ficar visível: essa é uma pesquisa original de uma empresa que desenvolve o `pinion-skill-scan`. A Adversa deixou o próprio produto fora da comparação principal e publicou depois resultados que não são diretamente comparáveis. Nesta apuração, não encontramos uma reprodução independente da matriz completa. Os números, portanto, descrevem as versões, modos, thresholds e configurações testadas pelos autores. Eles não representam toda edição atual ou hospedada desses scanners.

Fonte: [pesquisa original da Adversa AI](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/).

## O scanner só encontra o que sua entrada deixa visível

Antes de uma regra procurar uma instrução perigosa, alguém precisa decidir qual representação do arquivo ela vai receber. Boa parte da defesa se perde aí.

Um conteúdo codificado pode ser decodificado mais tarde pelo agente ou por um script. Caracteres Unicode quase idênticos aos nossos olhos podem não corresponder ao texto esperado por uma assinatura. Comandos podem ser reconstruídos em etapas. A instrução pode estar em outro idioma, num arquivo secundário, numa imagem ou num recurso baixado depois. Se o scanner examina uma forma e o runtime consome outra, a regra pode estar correta e ainda assim olhar para o lugar errado.

A Adversa descreve isso como a ausência de uma entrada canônica. Nenhuma das ferramentas avaliadas decodificava conteúdo arbitrariamente codificado e depois reaplicava o conjunto completo de regras. Nenhuma normalizava Unicode antes de consultar o banco de comandos relevante. Os pesquisadores também encontraram lacunas em paráfrases, arquivos empacotados, conteúdo apenas em imagem e segundos estágios remotos.

Um dos testes semânticos mostra bem a diferença. Cinco scanners estáticos detectaram uma instrução literal de prompt injection: Cisco, NVIDIA, Claude Skill Antivirus, AI Skill Scanner e HackMyAgent. Segundo os autores, uma paráfrase e uma tradução para espanhol passaram pelos cinco. Huifer e Mondoo já tinham deixado passar o controle literal. Nesses dois casos, a ofuscação não enganou um detector que antes funcionava; a ferramenta estava cega desde o começo.

Separar **bypass** de **blind spot** muda bastante a leitura da tabela. Vinte e sete células que inicialmente pareciam indicar cobertura ou evasão também falharam no controle sem ofuscação. Quando os pesquisadores compararam as previsões feitas pela leitura do código com o comportamento ao vivo, 53 de 77 células mudaram de interpretação: 27 viraram cegueira, 21 foram detectadas e cinco se tornaram bypasses completos.

Contar regras no repositório não substitui executar controles. Em alguns casos, o alarme nem chegou a ser enganado. Ele nunca esteve olhando para aquela porta.

Fonte: [pesquisa original da Adversa AI](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/).

## Um juiz de IA também recebe uma entrada adversarial

O skillcop expôs outro tipo de problema. No caminho testado, não havia uma base determinística mínima. O conteúdo da skill era concatenado diretamente ao prompt do modelo que daria o veredito.

Com o `gemma3:12b`, modelo padrão documentado pela ferramenta, uma instrução ingênua foi bloqueada. Uma versão enquadrada para interferir no julgamento recebeu o resultado limpo. Um controle com o mesmo enquadramento, mas sem a instrução que alterava o veredito, continuou bloqueado. Isso sustenta a conclusão para aquele prompt, modelo e configuração. Não permite generalizar o resultado para todo juiz baseado em modelo de linguagem.

Ainda assim, a consequência operacional é clara: um juiz de IA processa conteúdo hostil por definição. Normalizar e delimitar a entrada ajuda, mas a decisão final não deveria depender só da capacidade do modelo de resistir à conversa. Achados determinísticos graves precisam de um piso que o modelo não possa apagar com uma resposta convincente. Pedir para a IA decidir se deve confiar no texto que acabou de ler tem certa energia de “o suspeito garantiu que está tudo bem”. Em produção, a piada fica cara rápido.

Fonte: [pesquisa original da Adversa AI](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/).

## Aumentar a sensibilidade também aumenta o barulho

Se a ferramenta deixa ataques passar, aumentar a sensibilidade parece uma correção óbvia. O benchmark mostra quanto ela custa.

No snapshot do MalSkillBench usado pela Adversa, os sete scanners com caminhos estáticos offline ficaram abaixo do baseline que marca tudo como malicioso, cujo F1 era 0,655. F1 reúne precisão e recall numa única medida. O huifer teve o melhor F1 entre os scanners, 0,551, mas classificou conteúdo benigno como malicioso numa taxa de 0,624. A Cisco foi a mais precisa, com 0,784. Em compensação, encontrou apenas 0,330 dos ataques e teve taxa de falso positivo de 0,086.

O HackMyAgent 0.25.0 gerou 1.753 falsos positivos entre 4.000 artefatos benignos e terminou com F1 de 0,447. O contraste com a documentação do Open Agent Security Benchmark, ou OASB, é grande. Em 5 de junho, ela reportava HMA 0.23.8 com F1 de 82,9%, precisão de 83,2%, recall de 82,6% e taxa de falso positivo de 1,16% em 4.245 amostras rotuladas.

A diferença não demonstra impropriedade. Ela mostra o efeito da versão e do conjunto de dados. Segundo a Adversa, o OASB tinha exemplos benignos curtos de MCP e configuração, enquanto o MalSkillBench incluía skills reais e longas de integração. Um scanner pode aprender bem as pistas de um benchmark e tropeçar quando o formato dos dados muda.

Fontes: [pesquisa da Adversa AI](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/) e [resultados do OASB](https://github.com/opena2a-org/oasb#latest-results-2026-06-05).

## O próprio benchmark limita o que os rankings provam

A versão do MalSkillBench usada nos testes tinha 3.797 diretórios maliciosos e 4.000 benignos. Entre os maliciosos, 493 diretórios estavam vazios. Um scanner de conteúdo não consegue detectar o que não está lá, então o recall máximo ficava limitado a 0,870.

O conjunto ainda continha uma pista quase perfeita para os rótulos: `_meta.json` aparecia em 3.878 dos 4.000 artefatos benignos e em nenhum dos 3.797 maliciosos. Isso permite vazamento de label, quando o modelo ou a regra aprende uma característica do conjunto em vez do risco que deveria reconhecer. A Adversa descobriu o problema depois e não executou novamente as sete linhas de scanners.

O repositório público atual descreve outra coleção: 3.944 amostras maliciosas e 4.000 benignas. Ela inclui pacotes completos, com `SKILL.md`, scripts, referências e assets. Segundo os mantenedores, amostras de código ou mistas foram verificadas em runtime dentro de um sandbox Docker, enquanto prompt injections passaram por um juiz de IA. Esses números pertencem ao estado atual do repositório. Não dá para misturá-los com o snapshot testado pela Adversa.

Os experimentos adaptativos reforçam a dificuldade de transferir os resultados, mas também pedem cuidado na interpretação. Contra o scanner da própria Adversa, que ficou fora da tabela principal, agentes atacantes fizeram 178 de 191 ataques válidos passarem. A detecção foi de 6,8%. Depois das correções, subiu para 48,2%.

Em outro teste, um modelo linear de palavras alcançou F1 de 0,951 no conjunto separado do mesmo corpus de treino. Quando foi transferido, porém, marcou 3.748 de 3.975 artefatos benignos. Um ensemble permissivo, que alertava quando qualquer scanner emitisse um alerta, chegou a 62,0% de detecção, contra 50,9% do melhor scanner individual. Também herdou todos os falsos positivos. A comparação reuniu 163 dos 191 payloads após a remoção de 28 linhas com IDs duplicados.

Esses números não são uma taxa universal de risco em produção. Eles mostram como versão, corpus, threshold, modo de leitura e qualidade dos rótulos conseguem mudar a história inteira de um ranking.

Fontes: [pesquisa da Adversa AI](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/) e [repositório MalSkillBench](https://github.com/lxyeternal/MalSkillBench).

## Outros testes chegaram ao mesmo problema por caminhos diferentes

Em junho, a Trail of Bits testou a distribuição de skills por outra rota. Os pesquisadores contornaram o ClawHub, o scanner da Cisco e três scanners integrados ao skills.sh com quatro classes de artefato: truncamento por volume, instrução dentro de um documento, bytecode Python malicioso ao lado de fonte benigna e desvio retórico para um registro de pacotes controlado pelo atacante.

Os experimentos não reproduzem a matriz da Adversa. Eles cobrem sistemas, configurações e portadores diferentes. O ponto em comum está na fronteira de confiança: marketplace e scanner não transformam uma skill pública em código confiável.

A Trail of Bits publicou os quatro artefatos da pesquisa e avisou explicitamente para ninguém instalá-los. Os comportamentos declarados incluem roubo de variáveis de ambiente, conteúdo escondido em arquivo compactado, envenenamento de bytecode Python e redirecionamento de registro de pacotes. O repositório existe para verificar a pesquisa, não para uma tarde criativa no notebook da empresa.

Fontes: [pesquisa da Trail of Bits](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/) e [repositório dos artefatos de pesquisa](https://github.com/trailofbits/overtly-malicious-skills).

## O scanner deve informar a decisão, não tomar posse dela

Os resultados não tornam scanners inúteis. Assinaturas ainda encontram formas conhecidas, e ferramentas diferentes podem se complementar. A própria Adversa relata que a NVIDIA detectou 16 ataques adaptativos perdidos por duas concorrentes. O problema começa quando uma delas vira o único porteiro da instalação ou do CI.

Para quem desenvolve ou opera agentes, a saída é distribuir a confiança em camadas:

- use fontes curadas, fixe versões e controle quando uma atualização entra;
- revise o diff e o diretório completo, não apenas o `SKILL.md` ou arquivos com extensão familiar;
- confira os destinos de rede e analise domínios de verdade, em vez de procurar substrings numa allowlist;
- decodifique, normalize e transforme o conteúdo numa representação canônica antes de reaplicar as regras;
- mostre no veredito tudo que foi ignorado, truncado ou não suportado;
- impeça que um juiz de IA suprima achados determinísticos de gravidade alta ou crítica;
- limite credenciais, ferramentas, filesystem e saída de rede disponíveis durante a execução;
- trate alertas do scanner como anotação para revisão e roteamento, não como prova de segurança.

Cada uma dessas medidas cobre uma parte do problema. Juntas, reduzem a chance de um único erro ganhar autoridade irrestrita. O scanner pode dizer “não encontrei”. Quem instala ainda precisa perguntar o que foi lido, o que ficou de fora e o que essa dependência poderá fazer depois que entrar.

Fonte: [pesquisa original da Adversa AI](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://agentskills.io/specification
  - https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/
  - https://github.com/opena2a-org/oasb#latest-results-2026-06-05
  - https://github.com/lxyeternal/MalSkillBench
  - https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/
  - https://github.com/trailofbits/overtly-malicious-skills
-->
