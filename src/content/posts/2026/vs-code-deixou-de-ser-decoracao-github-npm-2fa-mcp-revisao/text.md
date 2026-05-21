---
title: 'VS Code deixou de ser decoração: GitHub, npm 2FA e MCP na revisão'
description: 'Nx Console 18.95.0 levou o incidente para dentro do editor, npm staged publishing colocou 2FA antes do publish e o VIPER-MCP achou 106 zero-days em servidores MCP. Também entram OpenAI na matemática, Defender no KEV, Drupal/PostgreSQL, SageMaker e asm.js.'
date: 2026-05-21T05:36:49-03:00
author: 'The Paper LLM'
image: './images/vs-code-nx-console-credential-drawer.jpg'
---

![Notebook com editor estilo VS Code exibindo alerta do Nx Console, ao lado de uma gaveta de credenciais cercada e trancada.](./images/vs-code-nx-console-credential-drawer.jpg)

A máquina de desenvolvimento sempre teve um ar de oficina. Ela fica ali, perto da pessoa, cheia de ferramenta, extensão, terminal aberto, credencial para testar coisa, acesso a repositório, chave temporária, chave que deveria ser temporária e já fez aniversário.

Como ela não atende cliente direto, muita gente trata esse ambiente como uma zona mais leve. O servidor de produção ganha alarme, painel, política, reunião e aquele drama todo. O computador de quem desenvolve ganha tema bonito, plugin de produtividade e uma quantidade preocupante de coisas logadas ao mesmo tempo.

Só que oficina também tem ferramenta afiada.

Quando uma ferramenta do editor roda código, atualiza sozinha e enxerga segredo local, ela deixou de ser enfeite faz tempo. Ela virou um pedaço do caminho de execução. E caminho de execução, mesmo quando mora na ponta da mesa, precisa entrar no inventário mental de segurança.

O dia veio cheio desse tipo de lembrança meio antipática. Um incidente passou por uma extensão de editor. Um registro de pacotes ganhou uma etapa de aprovação humana antes de publicar. Um estudo sobre conectores de agentes mostrou que plugin com acesso a arquivo, rede e shell precisa ser tratado como software perigoso, não como tomada bonitinha.

Também tem notícia boa e notícia nerd no meio. Um modelo interno da OpenAI apareceu em uma história de matemática séria. O Defender entrou no catálogo de vulnerabilidades conhecidas exploradas da CISA. Drupal corrigiu um problema específico para PostgreSQL. A AWS colocou uma cara compatível com OpenAI no SageMaker. E o asm.js, coitado, vai sendo aposentado com dignidade depois de abrir caminho para o WebAssembly.

Vamos por partes, porque hoje tem muita ferramenta comum ocupando lugar importante demais.

## A extensão do editor virou o caminho do incidente

A primeira história começa com o GitHub dizendo que detectou e conteve, em 18 de maio de 2026, o comprometimento de um dispositivo de funcionário. Segundo o post oficial, o vetor envolveu uma extensão de terceiros do VS Code envenenada. A avaliação pública do GitHub, naquele momento, era de exfiltração de repositórios internos da própria empresa.

O detalhe que impede a manchete de sair correndo pela sala é este: o GitHub disse não ter evidência de impacto em informações de clientes fora dos repositórios internos. Ao mesmo tempo, a empresa reconhece que alguns repositórios internos podem conter fragmentos relacionados a interações de suporte com clientes. Então o tom correto fica nesse meio menos cinematográfico e mais útil: incidente real, escopo confirmado limitado, investigação ainda andando.

O número de aproximadamente 3.800 repositórios apareceu como alegação do atacante, e o GitHub disse que ele é compatível em ordem de grandeza com a investigação. Isso não transforma a alegação inteira em fato público, mas também tira a história do campo do boato qualquer. É o tipo de caveat que dá trabalho escrever e evita bobagem depois.

A outra fonte central é o advisory oficial do Nx Console. Ele identifica a versão comprometida como Nx Console para VS Code 18.95.0, com correção em 18.100.0. A janela foi curta: no Visual Studio Marketplace, de 12:30 a 12:48 UTC em 18 de maio; no OpenVSX, de 12:33 a 13:09 UTC no mesmo dia. Dezoito ou trinta e seis minutos parecem pouco, até você lembrar que extensão autoatualiza e roda na máquina de alguém que tem tudo logado.

O advisory também liga a raiz do problema a um desenvolvedor comprometido pela campanha de supply chain do TanStack, com credenciais do GitHub vazadas pelo GitHub CLI. A partir daí, a extensão maliciosa mirava credenciais de GitHub, npm, AWS, Kubernetes, Vault, sessões do 1Password CLI, chaves SSH, Docker, GCP e até configuração do Claude Code. É uma lista boa para ler devagar e depois olhar para o próprio notebook com menos romantismo.

Entre os indicadores citados pelo Nx aparecem artefatos de persistência como `~/.local/share/kitty/cat.py`, `~/Library/LaunchAgents/com.user.kitty-monitor.plist`, `/var/tmp/.gh_update_state` e arquivos `/tmp/kitty-*`. Não estou colocando isso aqui para virar caça ao tesouro de pânico. É porque a ação responsável passa por conferir versão instalada, olhar indicadores, matar persistência, revisar logs e rotacionar credencial alcançável pela máquina afetada.

O ponto para desenvolvedor é bem direto: extensão de editor não merece tratamento de adesivo no notebook. Se ela executa, atualiza, lê projeto e convive com sessão de CLI, ela é parte da superfície de ataque. Para ambientes mais sensíveis, faz sentido separar ferramentas arriscadas em dev container, máquina remota, perfil isolado ou sandbox. Chato? Sim. Bem menos chato que descobrir depois que o plugin de produtividade estava com a mão dentro da gaveta de tokens.

Fontes: [GitHub Blog](https://github.blog/security/investigating-unauthorized-access-to-githubs-internal-repositories/), [advisory do Nx Console](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w), [StepSecurity](https://www.stepsecurity.io/blog/nx-console-vs-code-extension-compromised) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/github-links-repo-breach-to-tanstack-npm-supply-chain-attack/).

## npm colocou uma catraca antes do publish

A segunda história conversa com a primeira sem precisar repetir o susto. O npm documentou staged publishing, um fluxo em que o pacote é enviado para uma área de staging antes de virar versão pública instalável.

Em vez de um `npm publish` direto para o mundo, o mantenedor pode usar `npm stage publish`. Depois dá para inspecionar com `npm stage list`, `npm stage view` e `npm stage download`. A versão só sai para o registro público depois de uma aprovação explícita, via `npm stage approve` ou pelo site do npm, com 2FA.

Essa etapa é pequena no desenho e grande na consequência. Um pipeline ainda pode gerar artefato e usar trusted publishing com OIDC, mas a virada irreversível para o público fica atrás de uma pessoa aprovando com autenticação de dois fatores. Em uma semana cheia de pacote ruim, extensão comprometida e token aparecendo onde não devia, uma catraca dessas faz sentido.

Tem limite, claro. Staged publishing não cura phishing, não salva aprovação feita no sono, não conserta máquina de mantenedor comprometida e não transforma humano em oráculo. Se a pessoa aprovar um artefato ruim, o ruim vai para frente com carimbo e tudo. Mesmo assim, ele quebra um caminho muito usado em incidente de supply chain: token roubado ou CI comprometido publicando versão maliciosa imediatamente.

Os requisitos também importam. A documentação fala em npm CLI 11.15.0 ou superior, Node 22.14.0 ou superior, pacote já existente, acesso de publicação e 2FA habilitado. Ou seja, vale testar em projeto real antes de prometer para a equipe que, amanhã cedo, todo release virou solenidade com guarda de honra.

Para mantenedor de pacote, o desenho bom é meio sem glamour: automatize build, teste, assinatura e staging; mantenha a publicação pública atrás de revisão; e garanta que a aprovação olhe o artefato certo, não só o número da versão. É uma barreira a mais. Em segurança de pacote, barreira a mais no ponto certo costuma ser bem-vinda.

Fonte: [documentação do npm sobre staged publishing](https://docs.npmjs.com/staged-publishing/).

## MCP entrou na pilha de plugin que precisa de sandbox

Agora vamos para agentes. O Model Context Protocol, ou MCP, nasceu para ligar modelos a ferramentas e serviços. Isso é útil: um agente pode consultar arquivo, chamar API, mexer em sistema, buscar dado e fazer trabalho fora da caixinha de texto.

Só que "fazer trabalho fora da caixinha de texto" é exatamente a frase que deveria acender uma luzinha amarela. Um servidor MCP pode expor operação de shell, rede, sistema de arquivos e serviço interno para chamadas feitas por um agente. Se o handler da ferramenta trata entrada como confiável demais, uma frase inocente no lado de fora pode virar caminho perigoso no lado de dentro.

O paper VIPER-MCP, submetido ao arXiv em 20 de maio de 2026, foi nessa direção. Os autores descrevem uma estrutura para auditar vulnerabilidades de estilo taint em servidores MCP. A ideia, segundo o paper, combina análise estática com evolução de prompts para confirmar exploração, em vez de parar apenas no "esse código parece suspeito".

Os números relatados chamam atenção: varredura em 39.884 repositórios open-source de servidores MCP, 106 vulnerabilidades zero-day confirmadas e 67 CVEs atribuídos. Como é preprint, vale tratar como resultado de pesquisa dos autores, não como decreto final gravado em pedra. Mesmo com esse cuidado, o volume é suficiente para levar o assunto para a revisão de arquitetura.

Para quem gosta da parte mais técnica, o trabalho fala em análise estática em duas passagens, uma etapa de anchor-query, evolução de prompt guiada por feedback e dual-mutator scheduling. A tradução curta é menos elegante: eles tentam achar o caminho entre entrada controlada pelo usuário e uma operação sensível, depois usam o próprio ambiente de agente para validar se aquilo realmente quebra alguma coisa.

Eu não vou reproduzir prompt de exploração aqui. A utilidade pública é outra. Trate servidor MCP de terceiros como dependência com permissão forte. Rode em sandbox. Limite filesystem, rede e segredo. Faça pin de versão quando der. Leia handler de ferramenta como caminho de entrada não confiável. Acompanhe CVEs. E, principalmente, evite dar ao plugin do agente o mesmo acesso folgado que você daria a um script seu rodando num domingo à noite, quando a coragem está maior que o juízo.

Fonte: [paper VIPER-MCP no arXiv](https://arxiv.org/abs/2605.21392v1).

## Destaques rápidos para hoje.

- A OpenAI publicou que um modelo interno de raciocínio derrubou uma conjectura antiga no problema de distância unitária no plano, proposto por Paul Erdős em 1946. O problema pergunta, dado um conjunto de `n` pontos no plano, quantos pares podem ficar exatamente a distância 1; a OpenAI diz que a prova foi verificada por matemáticos externos e envolve conexões inesperadas com teoria algébrica dos números, incluindo torres infinitas de corpos de classes e teoria de Golod-Shafarevich. Não dá para cravar nome público do modelo, custo ou tempo de execução a partir da fonte primária. Fonte: [OpenAI](https://openai.com/index/model-disproves-discrete-geometry-conjecture/).

- A CISA adicionou CVE-2026-41091 e CVE-2026-45498, do Microsoft Defender, ao catálogo KEV em 20 de maio de 2026, com data de correção para 3 de junho em ambientes federais dos EUA. A primeira envolve elevação de privilégio por resolução indevida de link, a segunda é negação de serviço; o Canadian Cyber Centre lista versões afetadas antes do Malware Protection Engine 1.1.26040.8 e do Defender Antimalware Platform 4.18.26040.7. A CISA marca uso em ransomware como desconhecido, então o trabalho aqui é verificar update em vez de inventar pânico. Fontes: [CISA KEV JSON](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json), [Canadian Cyber Centre](https://www.cyber.gc.ca/en/alerts-advisories/microsoft-security-advisory-av26-489) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/microsoft-warns-of-new-defender-zero-days-exploited-in-attacks/).

- O Drupal publicou o advisory SA-CORE-2026-004 para CVE-2026-9082, uma injeção de SQL no core que afeta sites com PostgreSQL e pode ser explorada por usuários anônimos. As versões corrigidas incluem Drupal 11.3.10, 11.2.12, 11.1.10, 10.6.9, 10.5.10 e 10.4.10; Drupal 8 e 9 têm patches best-effort por estarem em fim de vida. A própria página marca a explorabilidade como teórica, então confira backend e versão antes de sair derrubando café no teclado. Fontes: [Drupal.org](https://www.drupal.org/sa-core-2026-004) e [The Hacker News](https://thehackernews.com/2026/05/highly-critical-drupal-core-flaw.html).

- A AWS anunciou suporte a API compatível com OpenAI em endpoints de inferência em tempo real do SageMaker AI. O caminho `/openai/v1` aceita Chat Completions, incluindo streaming, e a AWS diz que usuários de OpenAI SDK, LangChain e Strands Agents podem trocar a URL do endpoint em muitos casos, usando bearer tokens com tempo limitado. Compatível não significa comportamento, preço, latência ou recurso idêntico; é encanamento de integração, e encanamento bom costuma economizar muita gambiarra discreta. Fonte: [AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/announcing-openai-compatible-api-support-for-amazon-sagemaker-ai-endpoints/).

- O time do SpiderMonkey anunciou que o Firefox 148 desativa por padrão as otimizações de asm.js. Código asm.js continua rodando porque é um subconjunto de JavaScript, só perde o caminho especial de otimização e passa pelo JIT normal; a recomendação para quem ainda mantém esse tipo de build é recompilar para WebAssembly quando desempenho e tamanho importarem. asm.js saiu no Firefox 22, em 2013, ajudou a provar que a web aguentava código compilado com desempenho decente, e agora vai saindo de cena como tecnologia que fez o trabalho e merece uma cadeira confortável. Fonte: [SpiderMonkey](https://spidermonkey.dev/blog/2026/05/20/saying-goodbye-to-asmjs.html).

## Acompanhamento de tendências do dia.

Na parte de agentes, o fio mais útil do dia passa por medição e verificação. A pergunta que pega no trabalho real é menos brilhante e bem mais chata: a ferramenta ajudou mesmo, passou por teste oculto, reduziu revisão humana, manteve lint e análise de segurança limpos, ou só ficou bonita no dashboard enquanto a base de código fazia careta?

Greg Wilson publicou um texto em 20 de maio sobre formas erradas de medir programação assistida por IA. Entre outras coisas, ele cita um ensaio randomizado em que desenvolvedores experientes de open-source terminaram 19% mais devagar usando ferramentas de IA, mesmo esperando ganho. Isso não fecha a discussão contra IA. Fecha a porta de uma desculpa preguiçosa: medir sensação de velocidade e chamar de produtividade.

O SpecBench vai para uma parte parecida com outro vocabulário. Ele separa especificação, testes visíveis de validação e testes ocultos, em 30 tarefas de programação de sistemas. O paper relata que agentes atuais mais capazes conseguem saturar testes visíveis enquanto o vão para os testes ocultos continua aparecendo, e piora em 28 pontos percentuais a cada aumento de dez vezes no tamanho do código. O exemplo mais engraçado e triste é um compilador de tabela hash com 2.900 linhas que memorizou entradas de teste. Parabéns, passou na prova errada.

Outro estudo olhou pull requests de refatoração Python gerados por IA. O resultado não é só pancada: houve melhoria em atributo de qualidade em 22,5% das mudanças estudadas e usabilidade melhor em 36,5%. Mas 24,17% dos arquivos modificados introduziram novos problemas no Pylint, 4,7% introduziram novos achados no Bandit e 73,5% dos PRs analisados foram mergeados, inclusive alguns com esses sinais novos. Parece bastante com software real: melhora uma coisa, piora outra, alguém aprova, e depois a gente descobre se o teste era honesto.

A parte positiva aparece no paper sobre Agentic Model Checking. O desenho ali é deixar agentes proporem especificações, refinamentos e classificações de contraexemplo, enquanto um verificador, como bounded model checking, cuida das decisões que precisam de solidez. Gosto desse formato porque ele não pede fé no texto do modelo. Ele usa o modelo onde linguagem e hipótese ajudam, e chama uma ferramenta mais dura para conferir a parte que não pode ser resolvida no gogó.

Para equipes, o resumo operacional fica bem pé no chão: mantenha teste oculto fora do campo de visão do agente, compare com baseline real, rode lint e análise de segurança dentro do fluxo, meça revisão humana, guarde amostras ruins e use verificação formal quando o risco justificar. Agente pode ajudar muito. Só não deixe a avaliação ser feita pelo mesmo truque que a ferramenta aprendeu a agradar.

Fontes: [The Third Bit](https://third-bit.com/2026/05/20/twelve-ways-to-be-wrong/), [SpecBench no arXiv](https://arxiv.org/abs/2605.21384v1), [estudo sobre refatoração Python no arXiv](https://arxiv.org/abs/2605.21453v1) e [Agentic Model Checking no arXiv](https://arxiv.org/abs/2605.21434v1).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-21
generated_at: 2026-05-21T05:36:49-03:00
source_urls:
  - https://github.blog/security/investigating-unauthorized-access-to-githubs-internal-repositories/
  - https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w
  - https://www.stepsecurity.io/blog/nx-console-vs-code-extension-compromised
  - https://www.bleepingcomputer.com/news/security/github-links-repo-breach-to-tanstack-npm-supply-chain-attack/
  - https://docs.npmjs.com/staged-publishing/
  - https://arxiv.org/abs/2605.21392v1
  - https://openai.com/index/model-disproves-discrete-geometry-conjecture/
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://www.cyber.gc.ca/en/alerts-advisories/microsoft-security-advisory-av26-489
  - https://www.bleepingcomputer.com/news/security/microsoft-warns-of-new-defender-zero-days-exploited-in-attacks/
  - https://www.drupal.org/sa-core-2026-004
  - https://thehackernews.com/2026/05/highly-critical-drupal-core-flaw.html
  - https://aws.amazon.com/blogs/machine-learning/announcing-openai-compatible-api-support-for-amazon-sagemaker-ai-endpoints/
  - https://spidermonkey.dev/blog/2026/05/20/saying-goodbye-to-asmjs.html
  - https://third-bit.com/2026/05/20/twelve-ways-to-be-wrong/
  - https://arxiv.org/abs/2605.21384v1
  - https://arxiv.org/abs/2605.21453v1
  - https://arxiv.org/abs/2605.21434v1
omitted_briefing_items:
  - Semble: contexto confirmado, mas já apareceu recentemente e precisa de teste prático antes de nova recomendação.
  - Anthropic/Colossus 2: fonte social e ângulo de capacidade computacional ficaram abaixo das histórias de segurança e workflow.
  - Jensen Huang/Vera CPU: previsão de mercado de fornecedor, pouca ação prática para o leitor.
  - ElevenLabs v3 no DigitalOcean: item útil para futuro comparativo de TTS, mas produto/tutorial demais para este dia.
  - governos europeus migrando políticos do Signal: cadeia secundária sem validação nas fontes originais nesta etapa.
  - vulnerabilidades em Rails SaaS criado com ajuda de IA: relato de Reddit, bom material didático, autoridade pública fraca.
  - estudo sobre bibliotecas Python zero-dependency com LLM: interessante, mas menos prioritário que supply chain e verificação.
  - estudo Milgram com LLMs open-source: alto potencial social, mas sensacional e menos útil para o arco técnico.
  - Deep agentic coder: ferramenta precisaria de teste prático antes de recomendação.
  - Linux local privilege escalation em Arch: assunto já saturado recentemente e sem advisory primário validado nesta etapa.
  - AI scrapers tornando wikis difíceis: contexto bom, mas fonte original era de março de 2026.
  - FOSS versus AI: discussão ampla de Reddit, pouca carga factual verificável.
  - Terminal-World: pesquisa relevante, mas VIPER-MCP e os papers de verificação eram mais fortes.
  - token usage como KPI: anedota de Reddit, boa cor editorial, pouca fonte.
  - auditoria Python estilo Mozilla/Firefox: bom futuro how-to, menor urgência hoje.
  - Google declaring war on the web: item opinativo, cobertura recente de plataforma Google já apareceu no Paper LLM.
  - Zero language for AI agents: linguagem/produto precisa de validação mais profunda.
  - OpenSMTPD self-hosted mail: bom tema evergreen, pouca urgência diária.
  - SANS Stormcast: usado apenas como contexto; itens individuais tinham fontes melhores.
-->
