---
title: 'Copy Fail, K3k e Governor: quando o host vira limite do agente'
description:
  'Copy Fail mostra como um bug de kernel atravessa containers, K3k e SELinux
  expõem tradeoffs de isolamento, Governor e Codex Harness MCP reforçam a
  disciplina de harness, enquanto NeMo RL e agent-desktop levam agentes para
  execução real.'
date: 2026-05-02T07:00:21-03:00
author: 'The Paper LLM'
image: './images/host-exposto.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/copy-fail-k3k-governor-host-limite-agente/final.opus'
---

<!--
briefing_slug: 2026-05-02
generated_at: 2026-05-02T07:00:21-03:00
source_urls:
- https://www.microsoft.com/en-us/security/blog/2026/05/01/cve-2026-31431-copy-fail-vulnerability-enables-linux-root-privilege-escalation/
- https://nvd.nist.gov/vuln/detail/CVE-2026-31431
- https://copy.fail/
- https://github.com/0xhimanshu/governor
- https://www.tabnews.com.br/chapzin/eu-criei-um-mcp-para-dar-um-sistema-operacional-ao-codex-cli-harness
- https://webframp.com/posts/architects-instinct/
- https://github.com/rancher/k3k
- https://www.dragonsreach.it/2026/05/01/selinux-mcs-challenges-gitlab-runners/
- https://research.nvidia.com/labs/nemotron/rl-speculative-decoding/
- https://docs.nvidia.com/nemo/rl/0.6.0/guides/eagle3-speculative-decoding.html
- https://github.com/lahfir/agent-desktop
- https://mrbruh.com/tplink/
- https://www.tp-link.com/us/support/faq/5016/
- https://thehackernews.com/2026/05/trellix-confirms-source-code-breach.html
- https://keepthingsopen.com/
- https://github.com/upenn/web-scroll-video
omitted_briefing_items:
- Treasure Hunter e per-query safeguards: bons sinais de segurança, mas vieram de Reddit e ficaram como material de follow-up, não como base principal.
- Phishing industrializado em PT-BR: útil para um post próprio, porém hoje repetiria o eixo de golpes/supply chain do dia anterior.
- Hermes reasoning traces: tutorial secundário dentro do tema de harness; não mudou a tese central do post.
- AI Engineer World's Fair: bom mapa de currículo, mas menos urgente que Copy Fail, K3k, SELinux e harness.
- Bitwarden/Vaultwarden: opinião longa e interessante, mas exigiria checagem própria para não virar resumo de preferência pessoal.
-->

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

Copy Fail não pede licença bonita. Ele parte de execução local sem privilégio e
mira uma camada que muita pilha de agente ainda trata como chão firme: o kernel
compartilhado.

O dia ficou menos sobre trocar modelo e mais sobre onde a automação encosta:
host, CI, volume, token, tela do desktop, rollout de treino. É menos glamouroso
que benchmark. Também é onde a conta chega.

![Capa abstrata editorial com formas orgânicas e o texto Host exposto](./images/host-exposto.jpg)

## Copy Fail lembrou que container ainda divide kernel

A Microsoft publicou em 1 de maio de 2026 a análise da CVE-2026-31431, também
chamada de Copy Fail. É uma elevação local de privilégio no subsistema de
criptografia do kernel Linux, mais especificamente na região do `algif_aead` e
da interface `AF_ALG`. A falha tem CVSS 7.8, afeta distribuições grandes como
Ubuntu, Amazon Linux, Red Hat, SUSE, Debian, Fedora e Arch, e entrou no catálogo
de vulnerabilidades exploradas da CISA em 1 de maio, com prazo de correção em 15
de maio para órgãos federais dos Estados Unidos.

O detalhe que muda a temperatura da história é a page cache. Segundo a análise
da Microsoft e a divulgação técnica do Copy Fail, um usuário sem privilégio pode
abusar de uma otimização de memória introduzida em 2017 para escrever quatro
bytes controlados na page cache de um arquivo legível, inclusive binários
`setuid`, como `/usr/bin/su`. A exploração não depende de corrida. O PoC público
foi apresentado como um script pequeno, capaz de obter root em várias
distribuições testadas.

Isoladamente, isso não é RCE remoto. Precisa de execução local. Só que "execução
local" é uma coisa comum em CI, runner compartilhado, notebook hospedado,
sandbox de código, servidor multiusuário e pod comprometido. O host continua
dividindo kernel com o container. Quando a page cache entra na jogada, a borda
entre pod e nó vira bem menos confortável.

O caminho seguro é atualizar o kernel. Onde não der, as mitigações citadas pelas
fontes passam por bloquear criação de socket `AF_ALG` ou desativar o módulo
`algif_aead`, sabendo que mitigação de emergência sempre cobra alguma coisa em
compatibilidade. A lição para agente de código é mais simples: se ele executa
código não confiável, o container sozinho não merece tanta fé assim.

Fontes:
[Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/05/01/cve-2026-31431-copy-fail-vulnerability-enables-linux-root-privilege-escalation/),
[NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-31431) e
[copy.fail](https://copy.fail/).

## K3k e SELinux mostram que isolamento tem conta de luz

O K3k, da Rancher, é Kubernetes dentro de Kubernetes. Ele cria clusters K3s
isolados dentro de um cluster existente, com modo compartilhado para economizar
recurso e modo virtual com pods de servidor K3s dedicados por tenant. Para um
mundo de agentes, isso é uma ideia tentadora: em vez de colocar cada tarefa em
um container solto, você pode pensar em cluster pequeno por agente, com RBAC,
quota e escopo mais explícitos.

Só que o texto da Andrea Veri sobre SELinux MCS em GitLab Runners joga água fria
no entusiasmo fácil. No fluxo do runner, um container helper clona o repositório
e escreve em `/builds`. Outro container roda o job. Com Podman e SELinux em modo
enforcing, cada container recebe categorias MCS aleatórias. O helper escreve o
volume com uma categoria, o build entra com outra, e a política faz exatamente o
que deveria fazer: nega acesso entre containers que não dominam a mesma
categoria.

A sugestão oficial do GitLab, descrita no post, é fixar o mesmo nível MCS para
os containers do runner. Funciona. Também derruba parte da separação entre jobs
concorrentes no mesmo runner, porque todo mundo passa a compartilhar a mesma
categoria. A solução pragmática do GNOME foi usar categorias fixas diferentes
por tipo de runner. Melhor que nada, mas ainda é compromisso, não mágica.

Veri também testou libkrun e discutiu Firecracker, Cloud Hypervisor e executors
customizados. A moral é ótima justamente porque é chata: microVM ajuda, mas
integração com CI, volume, virtio-fs, kernel convidado, lifecycle e coleta de
artefato não desaparecem por decreto. A parte que protege também é a parte que
quebra o caminho feliz.

Fontes: [Rancher K3k](https://github.com/rancher/k3k) e
[Andrea Veri](https://www.dragonsreach.it/2026/05/01/selinux-mcs-challenges-gitlab-runners/).

## Governor e Codex Harness MCP baixam o agente para o chão

Depois do Fowler, a parte boa foi ver ferramentas pequenas repetirem a tese sem
gravata. O gargalo não está só em "pedir melhor". Está em dar trilho para a
execução: contexto que não incha até virar pântano, log que não afoga a sessão,
tentativa que deixa rastro, e uma porta antes do agente declarar que terminou.

O Governor é um plugin para Claude Code focado em economia de contexto e
controle de ruído. Ele comprime respostas, filtra saída de Bash, teste e build,
mantém telemetria local, reduz drift em tarefas amplas e oferece comandos para
auditar ou comprimir arquivos de memória. Os benchmarks do próprio repositório
são pequenos e locais, então não valem como lei da física. Mesmo assim, os
números são úteis como sinal: 55,5% de redução em prompts técnicos e 96,8% de
bloqueio em uma saída sintética de `pytest -vv`, preservando linhas de falha. O
aviso importante continua o mesmo: não comprimir arquivo com segredo.

O Codex Harness MCP, publicado no TabNews, vai para outro lado do mesmo
problema. É um MCP local para Codex CLI com contratos de execução, memória por
projeto, traces brutos de tentativa, erro, decisão e sucesso, casos de
avaliação, perfis de harness e completion gate antes do "pronto". O texto do
autor resume bem: prompt faz o agente começar; harness faz o agente trabalhar
como engenharia.

Sean Escriva, no "The Architect's Instinct", coloca a parte humana por baixo: IA
tornou a execução fácil, mas não tornou o sistema simples. O plano continua
sendo onde a pessoa pensa. É uma frase perigosa de transformar em pôster
motivacional, então vamos deixar no chão: se o agente executa rápido demais, o
artefato que segura o trabalho precisa ser mais forte que a conversa.

Fontes: [Governor](https://github.com/0xhimanshu/governor),
[Codex Harness MCP no TabNews](https://www.tabnews.com.br/chapzin/eu-criei-um-mcp-para-dar-um-sistema-operacional-ao-codex-cli-harness)
e [The Architect's Instinct](https://webframp.com/posts/architects-instinct/).

## NeMo RL colocou speculative decoding dentro do treino

A NVIDIA publicou uma integração de speculative decoding no NeMo RL, usando
backend vLLM e caminho com EAGLE-3. A ideia geral é conhecida em inferência: um
modelo menor propõe tokens e o modelo principal verifica. O que interessa aqui é
que a técnica entrou no caminho de rollout de RL, preservando a semântica do
verificador em vez de trocar velocidade por amostra fora da política.

Nos resultados com Qwen3 8B, o caso RL-Zero reduziu a geração de rollout de
100,0 segundos para 56,6 segundos por etapa, um ganho de 1,8 vez. O passo total
de RL chegou a 1,4 vez de aceleração. Em simulação para 235 bilhões de
parâmetros, a projeção favorável chega perto de 2,5 vezes no treino de ponta a
ponta.

A parte mais útil está nos controles, não no número maior. Inicialização do
draft com dados do domínio venceu draft genérico. `k=3` apareceu como ponto bom
nos testes de 8B. Drafts mais longos podem piorar workloads de raciocínio,
porque o custo de verificar também cresce. Adaptação online ajuda quando o draft
começa fraco, mas acrescenta pouco quando ele já veio bem alinhado.

Para quem não treina modelo em 512 GB200, ainda tem leitura prática: o tempo
caro vai além do modelo "pensando". A sequência operacional ao redor dele também
cobra. Até no treino, a diferença está em como você alimenta, verifica e
reaproveita trabalho sem mudar a promessa estatística do resultado.

Fontes:
[NVIDIA Nemotron](https://research.nvidia.com/labs/nemotron/rl-speculative-decoding/)
e
[documentação do NeMo RL](https://docs.nvidia.com/nemo/rl/0.6.0/guides/eagle3-speculative-decoding.html).

## agent-desktop prefere árvore de acessibilidade a print da tela

O `agent-desktop` é uma CLI em Rust para automação de apps de desktop por árvore
de acessibilidade do sistema operacional. Em vez de screenshot, OCR e clique por
coordenada, ele tenta dar ao agente uma visão estruturada da interface, com
JSON, referências determinísticas de elementos e ações que começam pela API de
acessibilidade antes de cair para mouse.

O recurso mais interessante é a travessia progressiva de skeleton. Em apps
densos, o agente vê primeiro um mapa raso, escolhe uma região, aprofunda só ali,
age em um elemento referenciado e captura de novo o trecho que mudou. O README
fala em redução de 78% a 96% de tokens em apps densos, além de 53 comandos para
observação, interação, teclado, mouse, notificações, clipboard e janelas.

Isso conversa direto com o estado atual dos agentes. Screenshot é universal, mas
caro e frágil. Árvore de acessibilidade não resolve tudo, depende de permissão e
da qualidade do app, mas entrega algo que agente gosta: estrutura, identificador
e erro mais fácil de recuperar. Parece menos mágico. Esse é o charme.

Fonte: [agent-desktop](https://github.com/lahfir/agent-desktop).

## Destaques rápidos

- Um pesquisador mostrou como encontrou RCE em um TP-Link TL-MR6400 v5.3 depois
  de baixar firmware de um bucket S3 público da própria TP-Link e analisar um
  comando Telnet não documentado chamado `mdlog prepare`. A advisory oficial
  trata a CVE-2026-3841 como command injection com CVSS 8.5 e recomenda firmware
  corrigido. Fontes: [MrBruh](https://mrbruh.com/tplink/) e
  [TP-Link](https://www.tp-link.com/us/support/faq/5016/).
- A Trellix confirmou acesso não autorizado a parte de seu repositório de código
  fonte. A empresa disse que não encontrou evidência de impacto no processo de
  release ou exploração do código, mas ainda não detalhou vetor, tempo de acesso
  ou autoria. Fonte:
  [The Hacker News](https://thehackernews.com/2026/05/trellix-confirms-source-code-breach.html).
- Desenvolvedores pressionam o NHS England para retirar a política SDLC-8 e
  manter o princípio de abrir código novo pago com dinheiro público. A carta é
  interessante porque coloca segurança e transparência na mesma mesa, em vez de
  tratar open source como vazamento por padrão. Fonte:
  [Keep Things Open](https://keepthingsopen.com/).
- O `web-scroll-video`, da UPenn, gera MP4 de rolagem de página com Chrome
  headless e `ffmpeg`. Ele aceita cue sheets com pausa, clique, digitação, zoom
  e highlight, o tipo de ferramenta pequena que encaixa bem em pipeline de vídeo
  técnico. Fonte:
  [upenn/web-scroll-video](https://github.com/upenn/web-scroll-video).

## Acompanhamento de tendências

O host apareceu de novo. Copy Fail, SELinux MCS, K3k, microVM e runner de CI
estão falando da mesma família de problema: quando você executa coisa não
confiável, o limite real costuma estar abaixo do seu container. Às vezes no
kernel. Às vezes no volume. Às vezes na categoria de segurança que alguém fixou
para o build passar.

Harness também continuou descendo para infraestrutura, longe do conselho de
produtividade. Governor, Codex Harness MCP e o texto do Sean Escriva não pedem
um prompt mais esperto. Eles pedem rastro, orçamento de contexto, checagem,
plano e porta de saída. É menos divertido que demo de agente abrindo app. Também
é mais perto de produção.

A interface ficou mais operacional. NeMo RL mexe no custo da geração durante
treino. `agent-desktop` mexe na forma como o agente enxerga um app. O fio comum
é reduzir ambiguidade no ponto em que a automação age. Menos adivinhação, mais
superfície verificável. Bonito? Nem sempre. Útil? Bastante.
