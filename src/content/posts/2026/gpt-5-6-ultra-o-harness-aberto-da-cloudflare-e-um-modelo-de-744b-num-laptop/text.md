---
title: "O botão 'ultra' da GPT-5.6, o harness aberto da Cloudflare e um modelo de 744B rodando num laptop"
description: 'A OpenAI lançou a família GPT-5.6 (Sol, Terra e Luna) com um modo ultra que coordena vários agentes sozinho; a Cloudflare abriu a receita do harness de vulnerabilidade, com um segundo modelo que discorda do primeiro, estado em SQLite e PoC obrigatória; o npm 12 desliga os install scripts por padrão e você aprova o que confia com npm approve-scripts; o Colibrì faz o GLM 5.2, um MoE de 744 bilhões de parâmetros, rodar num laptop sem GPU direto do SSD; e a Grab migrou um data lake de petabytes de Hive para Apache Iceberg, com uma consulta caindo de 70s para 6s. Ainda: o loop de Karpathy, Pangolin, GitLake, IBM Bob e Linux Mint com Wayland.'
date: 2026-07-10T06:00:00-03:00
author: 'The Paper LLM'
image: './images/gpt-5-6-ultra-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/gpt-5-6-ultra-o-harness-aberto-da-cloudflare-e-um-modelo-de-744b-num-laptop/final.opus'
---

Quem já deixou dois ou três agentes rodando ao mesmo tempo sabe que a parte chata nunca foi o modelo em si. É a gambiarra em volta: abrir um tmux, picar a tarefa em pedaços, torcer para um agente não pisar no outro e ficar de babá para nenhum deles travar no meio do caminho. Pois a novidade de ontem é que a OpenAI pegou esse trabalho manual e transformou num botão.

![Botão físico gigante e brilhante com a palavra ULTRA num painel de controle da marca GPT-5.6, cercado por pequenos interruptores rotulados AGENTES, representando o modo que coordena vários agentes sozinho.](./images/gpt-5-6-ultra-cover.jpg)

## OpenAI lança a família GPT-5.6 e põe o multi-agente num botão chamado 'ultra'

A OpenAI lançou ontem, dia 9, a GPT-5.6 em três modelos com nome de corpo celeste: Sol no topo, Terra no meio e Luna como o barato e rápido. O preço acompanha a hierarquia, contado por milhão de tokens: o Sol sai a 5 dólares na entrada e 30 na saída, o Terra fica em 2,50 e 15, e o Luna desce para 1 e 6. Quem usa a API em produção vai sentir essa escada no boleto, porque agora dá para escolher o modelo pelo custo da tarefa em vez de pagar o topo para tudo.

Mas o que interessa para quem vive de agente é o modo 'ultra'. Em vez de você abrir vários processos na mão, o 'ultra' coordena subagentes em paralelo sozinho, como um nível de esforço a mais que você liga quando a tarefa pede. Aquela orquestração que era gambiarra virou configuração. Junto disso, o Codex e o ChatGPT viraram um app único de desktop, com diff inline e revisão de PR ali dentro, e um agente batizado de ChatGPT Work. Já chegou disponível no ChatGPT, no Codex, na API e no GitHub Copilot desde ontem.

A OpenAI diz que a GPT-5.6 bate a concorrência num punhado de benchmarks, um deles com nota bem acima da do Claude Fable 5, e a um quarto do custo em alguns testes. São números de lançamento, medidos pela própria casa no dia do anúncio. Vale esperar avaliação independente antes de tratar isso como placar final, porque propaganda de estreia costuma escolher bem a régua.

Fontes: [OpenAI](https://openai.com/index/gpt-5-6/), [OpenAI Help Center](https://help.openai.com/en/articles/20001325-a-preview-of-gpt-56-sol-terra-and-luna) e [GitHub](https://github.blog/changelog/2026-07-09-openais-gpt-5-6-sol-terra-and-luna-are-now-available-in-github-copilot/).

## A Cloudflare abriu o 'harness de vulnerabilidade' que caça bug com um modelo e usa outro para desconfiar

Se a OpenAI escondeu a orquestração atrás de um botão, a Cloudflare fez o contrário e mostrou o harness inteiro por dentro. Harness, aqui, é isso: todo o encanamento que fica em volta do modelo (o loop, o controle de estado, as regras) e faz o agente trabalhar sem se perder. Um aviso de data: esse texto não é de hoje, saiu em 18 de junho e voltou a circular agora. É planta de arquitetura mais do que manchete, e vale justamente por isso.

O objetivo era caçar vulnerabilidade em código com um monte de agentes de LLM, mas sem afogar todo mundo em falso positivo. Eles separaram o trabalho em dois estágios. Primeiro, um harness de descoberta com vários agentes em paralelo, cada um cuidando de uma parte (reconhecimento, caça, rastreio, relatório) em 128 repositórios. Depois, e essa é a sacada, um segundo sistema de validação rodando em outro modelo, cujo trabalho é só desconfiar. Ele age como cético e derruba o que o primeiro achou que era bug.

A disciplina em volta é o que vale copiar. Cada agente é mantido abaixo de 25% da janela de contexto, para não ficar bobo de tanta informação. Todo o estado sai da cabeça do modelo e vai para um banco SQLite, com chave por execução, repositório e etapa. E nenhuma descoberta conta como bug de verdade sem uma prova de conceito que funcione contra o código original, com o exploit sendo detonado num sandbox isolado com o unshare do Linux. Nada de patch entrando sozinho: um humano revisa antes do merge.

O funil deles é honesto sobre o tamanho do desperdício que isso corta. Foram cerca de 20.799 candidatos, que a validação reduziu para uns 12.057, chegando a 7.245 achados de fato acionáveis depois de remover 5.442 duplicados. A taxa de rejeição logo na entrada caiu de 40% para 11%. E a skill inicial que dá o pontapé nisso está aberta no GitHub, então dá para começar a brincar com a receita em vez de só admirar de longe.

Fontes: [Cloudflare](https://blog.cloudflare.com/build-your-own-vulnerability-harness/) e [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill).

## npm 12 desliga os install scripts por padrão para fechar a porta dos ataques de supply chain

Depois de um ano inteiro apanhando de ataque de cadeia de suprimentos, o npm resolveu fechar a porta mais escancarada que existia. Na versão 12, os install scripts passam a vir desligados por padrão. Traduzindo: aqueles scripts que rodavam sozinhos durante o `npm install`, o preinstall, o install, o postinstall e a compilação automática via node-gyp, não executam mais sem a sua permissão explícita.

A mudança parece pequena e é enorme, porque era justamente esse o buraco. Uma única dependência comprometida lá no fundo da árvore, daquelas que você nem sabe que instalou, ganhava o direito de rodar comando arbitrário na sua máquina e no runner de CI, no momento do install. Quase todo grande ataque de supply chain no npm dos últimos tempos passou por aí. De quebra, dependências vindas de git e de URL remota também viram opt-in, e os tokens de acesso granular foram depreciados.

Tem um preço prático nisso, e é bom saber antes de atualizar: build que depende de verdade desses scripts vai quebrar. Quem mantém projeto com node-gyp ou com um postinstall legítimo vai precisar rodar o `npm approve-scripts`, revisar a lista, aprovar só o que confia e commitar o `package.json` com essa decisão registrada. É trabalho a mais, mas é o tipo de chateação que a gente devia estar fazendo desde sempre.

Fontes: [The Hacker News](https://thehackernews.com/2026/07/npm-12-disables-install-scripts-by.html) e [SecurityWeek](https://www.securityweek.com/npm-12-will-change-script-execution-behavior-to-prevent-supply-chain-attacks/).

## Colibrì faz um modelo de 744 bilhões de parâmetros rodar (devagar) num laptop sem GPU

Alguém pegou o GLM 5.2, um modelo de 744 bilhões de parâmetros, e fez ele rodar num laptop comum, sem GPU e sem Python na hora de rodar. O projeto se chama Colibrì e cabe num único arquivo em C de umas 2.400 linhas. É o velho "será que roda?" levado ao limite, com um modelo de fronteira se arrastando para funcionar em hardware de gente normal.

O truque tem nome e é uma boa aula de arquitetura. Esse modelo é um Mixture-of-Experts, o que significa que ele não usa todos os 744 bilhões de parâmetros a cada palavra; só uns 40 bilhões disparam de fato por token. Então o Colibrì mantém na RAM apenas as partes densas, que estão sempre em uso, uns 17 bilhões de parâmetros comprimidos a 4 bits, ocupando por volta de 10GB. O resto, os cerca de 21 mil especialistas que somam uns 370GB, fica guardado no SSD e entra sob demanda, só quando aquele token precisa. Um cache que descarta o menos usado, mais o cache de página do próprio sistema operacional, seguram o rojão.

Só que tem um porém grande, e o próprio autor é honesto quanto a ele: é lento. O gargalo não é a CPU, é o disco. A frio, a coisa anda a uns 0,05 a 0,1 token por segundo, o que é praticamente ver o texto nascer letra por letra. Um M5 Max de 128GB da comunidade chegou perto de 1 token por segundo, bem melhor, mas ainda longe de confortável. E tem um detalhe que costuma sumir na empolgação: comprimir o modelo para 4 bits mexe na qualidade das respostas, e ninguém mediu direito quanto se perde. É prova de conceito, não setup de produção. Serve para entender por que Mixture-of-Experts mais streaming de disco muda o que "rodar localmente" quer dizer.

Fonte: [Colibrì no GitHub](https://github.com/JustVugg/colibri).

## A Grab migrou um data lake de petabytes de Hive para Apache Iceberg, e uma consulta caiu de 70s para 6s

Um caso de engenharia com números que ensinam. A Grab, aquela de mobilidade e entregas do Sudeste Asiático, contou como migrou um data lake de petabytes do Hive para o Apache Iceberg. Se esses nomes soam distantes, a dor por trás é bem concreta.

O problema antigo era o Hive Metastore, o catálogo que diz onde cada pedaço de dado mora. Ele tinha virado um ponto único de falha, e o custo de listar arquivos crescia junto com o número de consultas simultâneas. Pior: milhares de arquivos minúsculos, abaixo de 1MB, faziam o sistema pagar caro em chamadas de API para o armazenamento, e o catálogo vivia saindo de sincronia com o que estava de fato no disco. O Apache Iceberg é um formato de tabela que ataca isso trazendo escrita atômica (a mudança acontece inteira ou não acontece) e um jeito de pular dados que a consulta nem precisa ler.

Os ganhos vieram medidos, e é aqui que fica bom. Uma consulta de navegação que levava 70 segundos caiu para 6, umas dez vezes mais rápida, usando Z-ordering e data skipping, que é organizar os dados de um jeito que a consulta consiga ignorar blocos inteiros. Uma tabela muito consultada cortou até 95% do custo diário de API do armazenamento, sem que ninguém precisasse mexer numa linha das consultas. E um job de análise de funil passou a usar metade do cluster. Eles ainda abriram o UnifiedSparkCatalog, uma camada que esconde Iceberg, Delta, Hudi e Hive atrás de uma interface só. Não foi troca de tudo de uma vez, foi migração seletiva, começando pelas tabelas de maior valor, e no caminho tiveram que resolver chateação de verdade, como travas fantasma no metastore antigo.

Fonte: [Grab Engineering](https://engineering.grab.com/our-journey-to-apache-iceberg-adoption).

## Destaques rápidos para hoje

- **O autoresearch de Karpathy trata coding agêntico como projeto de loop, não como caça ao prompt perfeito.** Andrej Karpathy publicou um esqueleto onde o agente lê um spec (o `program.md`), edita um único arquivo, roda um orçamento fixo de 5 minutos, mede uma métrica objetiva e mantém a mudança só se ela melhorar, revertendo se não. Roda a noite toda, uns 12 experimentos por hora. Projetar bem esse loop, com meta clara, um arquivo mexível, métrica objetiva e regra de aceitar ou reverter, passou a valer mais que caçar o prompt perfeito, e o mesmo molde serve para tamanho de bundle, testes e gate de segurança. Fonte: [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

- **barebrowse dá a um agente local um navegador de verdade sem Playwright.** Em vez de subir um browser controlado à parte, ele dirige o Chrome que você já tem instalado pelo protocolo de DevTools e, no lugar de despejar o HTML cru na cara do modelo, manda uma árvore de acessibilidade podada. O autor relata corte de 40% a 90% nos tokens, o tipo de economia que faz diferença para quem roda modelo local com Ollama. Fonte: [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1usg4cq/i_built_barebrowse_give_a_localmodel_agent_a/).

- **Pangolin 1.20 ganhou um novo lançador de recursos e uma paleta de comandos global.** É um reverse proxy zero-trust que você mesmo hospeda, misturando ideias de Cloudflare Tunnel e Tailscale, para expor serviço interno com segurança sem depender de SaaS de túnel. Nada crítico nessa versão, só mais ergonomia para quem cuida do acesso remoto ao próprio VPS. Fonte: [Linuxiac](https://linuxiac.com/pangolin-1-20-tunneled-reverse-proxy-adds-new-resource-launcher/).

- **GitLake leva a semântica do Git para dentro do lakehouse inteiro.** A ideia é dar commit, branch e merge atômico não a uma tabela só, mas a todo o conjunto de dados, de forma que um agente trabalhe num branch isolado e um humano revise antes de um merge tudo-ou-nada. É pesquisa que apareceu numa conferência forte de banco de dados, não produto pronto, mas casa direto com a ideia de revisar antes de misturar. Não confundir com o GitLost de [dois dias atrás](/2026/gitlost-agente-github-vazou-repo-privado-e-ghostlock-abre-root-no-linux/): nome parecido, história completamente diferente. Fonte: [arXiv](https://arxiv.org/abs/2607.08319v1).

- **Um sistema de docs no próprio repositório trata o arquivo AGENTS como roteador, não como despejo.** A proposta é simples e boa: em vez de encher o AGENTS de tudo e afogar o modelo, deixe ele só apontar para uma pasta de documentação, com uma regra dura de que docs e código precisam bater no mesmo pull request. É um jeito enxuto de dar contexto durável ao Claude Code sem inchar a janela nem deixar a doc envelhecer. Fonte: [Gist](https://gist.github.com/lukewilson2002/cb48062397d8b51954034d94b8c19d6d).

- **O Bob, da IBM, cresceu de assistente de código para orquestrador de vários agentes.** Ignore a parte de mainframe e fique com o padrão: ele usa subagentes que isolam a exploração, para que a bagunça de vasculhar o código não suje a janela de contexto principal. É a mesma higiene de contexto que aparece em várias ferramentas hoje, e dá para roubar em qualquer stack. Fonte: [InfoWorld](https://www.infoworld.com/article/4195291/ibm-bob-expands-beyond-code-generation-to-orchestrate-the-entire-sdlc.html).

- **A Ello jogou fora o loop padrão de tool-call para não deixar uma criança de 5 anos no vácuo.** O tutor de IA em tempo real deles esbarrou num problema de latência: o ciclo normal de observar e então agir deixava 3 a 4 segundos de silêncio, insuportável numa conversa falada com criança. A saída foi construir um harness próprio que transmite várias ações enquanto um interpretador executa cada uma no meio da geração. É um caso concreto de quando vale ser dono do próprio loop em vez de aceitar o de fábrica. Fonte: [Ello](https://www.ello.com/blog/teaching-a-child-in-1000-ms).

- **Um Nextcloud vazou mais de 367 mil arquivos por um Elasticsearch mal configurado.** O boletim de segurança da Risky Business juntou um golpe viral de e-rickshaws sem autenticação na Índia com esse vazamento, e a lição para quem faz self-host é a de sempre, só que dolorida: serviço exposto sem autenticação continua vazando dado em massa. Se você auto-hospeda, vale conferir hoje se o seu Elasticsearch não está aberto para o mundo. Fonte: [Risky Business](https://news.risky.biz/risky-bulletin-india-bans-app-used-to-hack-e-rickshaws-in-viral-videos/).

- **Cpp2Rust promete traduzir C++ para Rust seguro automaticamente, mas ainda para no hello-world.** A técnica embrulha ponteiros crus num tipo checado em tempo de execução e tem peso acadêmico, com paper numa conferência forte de compiladores. Bom papo para a turma do "reescreve em Rust", desde que com o pé atrás: os exemplos públicos não passam de coisas triviais, então é protótipo de pesquisa, não ferramenta para apontar no seu código de verdade. Fonte: [Cpp2Rust](https://github.com/Cpp2Rust/cpp2rust).

- **O Linux Mint agora considera o Wayland estável, com chegada prevista por volta do Natal.** As duas sessões continuam suportadas e o X11 segue como padrão, então ninguém é empurrado para a troca. É aquele ritmo devagar-e-correto que a turma de desktop Linux gosta, e dá para acompanhar sem pressa. Fonte: [It's FOSS](https://feed.itsfoss.com/link/24361/17375901/linux-mint-wayland-stable).

## Acompanhamento de tendências do dia

Faz um tempo que esse papo circula, e [no dia 7 a gente já puxava esse fio](/2026/openssh-10-4-corrige-ssh-e-agentes-tropecam-em-dados-hostis/): o segredo do agente não está tanto no modelo, e sim na estrutura em volta dele. Hoje o assunto parou de ser previsão e tomou conta do dia. Colocando as notícias lado a lado, quase todas contam a mesma história por ângulos diferentes: a vantagem competitiva escorregou do modelo para o loop, o agendador, a memória, o firewall e o lugar onde o estado fica guardado.

Os exemplos se empilham. O modo 'ultra' da OpenAI é isso vendido como botão; a Cloudflare fez a mesma coisa com disciplina de engenheiro. O autoresearch de Karpathy é a versão conceitual, e a Ello teve que construir a dela na marra, por causa de latência. Até um modelo de vídeo aberto do dia, o LingBot-World-Infinity, chega embrulhado num arranjo que separa quem decide os eventos de quem os renderiza, embora esse ainda seja mais teaser do que ferramenta, um único checkpoint sem uso comercial.

E tem um monte de pesquisa fresca no arXiv puxando na mesma direção, cada peça mexendo num pedaço do encanamento. Uma repensa o agendamento de LLM notando que tráfego de agente reaproveita muito cache, então basta balancear a primeira requisição de cada sessão e deixar o resto seguir a rota do cache. Outra dá ao agente um companheiro de memória que injeta lembrete na hora certa, para a meta não se perder no meio de uma tarefa longa. Uma terceira, a TokenWall, é um firewall que audita o que o agente vai escrever na memória e nos argumentos de ferramenta antes de aquilo tocar algo privilegiado, reaproveitando a velha ideia de taint analysis da segurança. E a UniClawBench propõe avaliar agente dentro de container Docker vivo, checando cada passo, em vez de comparar a resposta final com uma string congelada.

Nada disso é veredito fechado, e boa parte ainda é promessa que não foi testada fora do anúncio. O que dá para levar para casa é mais tranquilizador do que parece: se você já entende cache, fila e commit atômico, você já entende metade de 'harness'. A novidade é apontar essa disciplina velha de sistemas distribuídos para os agentes.

Fontes da tendência: [autoresearch de Karpathy](https://github.com/karpathy/autoresearch), [Cloudflare](https://blog.cloudflare.com/build-your-own-vulnerability-harness/), [OpenAI](https://openai.com/index/gpt-5-6/), [SMetric](https://arxiv.org/abs/2607.08565v1), [memória proativa](https://arxiv.org/abs/2607.08716v1), [TokenWall](https://arxiv.org/abs/2607.08395v1) e [UniClawBench](https://arxiv.org/abs/2607.08768v1).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-07-10
source_mode: briefing
generated_at: 2026-07-10T09:20:00-03:00
source_urls:
  - https://openai.com/index/gpt-5-6/
  - https://help.openai.com/en/articles/20001325-a-preview-of-gpt-56-sol-terra-and-luna
  - https://github.blog/changelog/2026-07-09-openais-gpt-5-6-sol-terra-and-luna-are-now-available-in-github-copilot/
  - https://blog.cloudflare.com/build-your-own-vulnerability-harness/
  - https://github.com/cloudflare/security-audit-skill
  - https://thehackernews.com/2026/07/npm-12-disables-install-scripts-by.html
  - https://www.securityweek.com/npm-12-will-change-script-execution-behavior-to-prevent-supply-chain-attacks/
  - https://github.com/JustVugg/colibri
  - https://engineering.grab.com/our-journey-to-apache-iceberg-adoption
  - https://github.com/karpathy/autoresearch
  - https://www.reddit.com/r/LocalLLaMA/comments/1usg4cq/i_built_barebrowse_give_a_localmodel_agent_a/
  - https://linuxiac.com/pangolin-1-20-tunneled-reverse-proxy-adds-new-resource-launcher/
  - https://arxiv.org/abs/2607.08319v1
  - https://gist.github.com/lukewilson2002/cb48062397d8b51954034d94b8c19d6d
  - https://www.infoworld.com/article/4195291/ibm-bob-expands-beyond-code-generation-to-orchestrate-the-entire-sdlc.html
  - https://www.ello.com/blog/teaching-a-child-in-1000-ms
  - https://news.risky.biz/risky-bulletin-india-bans-app-used-to-hack-e-rickshaws-in-viral-videos/
  - https://github.com/Cpp2Rust/cpp2rust
  - https://feed.itsfoss.com/link/24361/17375901/linux-mint-wayland-stable
  - https://arxiv.org/abs/2607.08565v1
  - https://arxiv.org/abs/2607.08716v1
  - https://arxiv.org/abs/2607.08395v1
  - https://arxiv.org/abs/2607.08768v1
omitted_briefing_items:
  - GhostLock (CVE-2026-43499) 15-year Linux LPE feed echo: repeat_without_delta, covered in the 2026-07-08 post; only a $92k bounty figure is new. Omitted, no continuity link used.
  - Meta Muse Spark open-source variant: open-source hook is a dateless reddit rumor; kept out of the body as non-publishable context.
  - Multi-agent privacy firewall (arXiv 2607.08282): thematically folded into the harness trend alongside TokenWall to avoid two near-identical paper notes.
  - fmetrics, DropLife, APL interpreter, constrained sampling: off the harness spine or reference material; dropped to protect density.
-->
