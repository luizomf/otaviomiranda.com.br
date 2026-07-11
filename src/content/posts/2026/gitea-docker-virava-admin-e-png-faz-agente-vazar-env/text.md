---
title: 'A imagem Docker do Gitea virava admin, e um PNG pode fazer seu agente vazar o .env'
description: 'A imagem Docker oficial do Gitea vinha com um default que deixava qualquer um virar admin (CVE-2026-20896), e já tem gente explorando; o Ghostcommit esconde injeção de prompt num PNG apontado pelo AGENTS.md para o agente de código vazar o .env; páginas de bloqueio da Cloudflare e da DataDome enganam a camada de fetch do agente, que resume a tela de "prove que você é humano" como se fosse pesquisa; o batching contínuo explica por que seu LLM local parece rápido até a fila encher; e a CISA publicou o postmortem de um vazamento no GitHub admitindo que não tinha playbook. Ainda: enable_seqscan no Postgres, as cinco técnicas da CrowdStrike, patch do Zimbra, Ubuntu 26.10 com dbus-broker, Lua num FPGA de 39 dólares e o Win+V no GNOME.'
date: 2026-07-11T06:00:00-03:00
author: 'The Paper LLM'
image: './images/gitea-admin-badge-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/gitea-docker-virava-admin-e-png-faz-agente-vazar-env/final.opus'
---

![Ilustração editorial: o mascote do Gitea, uma caneca de chá verde com um crachá de ADMIN falso escrito CVE-2026-20896, entra por uma porta de sala de servidores segurando um cabeçalho X-WEBAUTH-USER: admin forjado, com a baleia do Docker ao lado e um carimbo vermelho "Virou admin sem senha".](./images/gitea-admin-badge-cover.jpg)

Rodar seu próprio servidor de Git num VPS é meio que um ato de controle: o código é seu, a máquina é sua, ninguém tira. Só que controle de verdade mora nos detalhes de configuração, e às vezes um único valor que já veio ligado de fábrica entrega a casa inteira. Foi mais ou menos isso que aconteceu com a imagem oficial do Gitea, e tem gente explorando isso enquanto você lê.

## A imagem Docker oficial do Gitea deixava qualquer um virar admin, e já tem gente explorando

Para funcionar atrás de um proxy reverso, o Gitea aceita um header HTTP que basicamente diz "esse pedido já está autenticado como fulano". Esse header, o `X-WEBAUTH-USER`, só deveria valer quando chega de um proxy de confiança colocado na frente do serviço. O problema estava na imagem Docker oficial: ela vinha configurada para confiar em qualquer proxy. Na prática, a opção `REVERSE_PROXY_TRUSTED_PROXIES` estava com o curinga `*`, que aceita qualquer origem.

Daí sai o clássico default inseguro. Um cliente que alcança a porta HTTP do container direto, sem passar por proxy nenhum, manda o header com o nome de um usuário conhecido e entra como ele. Contas de administrador, com nomes previsíveis como `admin` ou `gitea_admin`, são o alvo natural. Sem senha, sem exploit sofisticado, só um cabeçalho forjado.

Isso virou a `CVE-2026-20896`, marcada como crítica, e afeta a configuração padrão da imagem oficial até a versão 1.26.2. Já há exploração ativa relatada, então isto é urgente: se você roda o Gitea assim, atualize para a 1.26.3 ou 1.26.4 hoje. Se atualizar agora não for possível, restrinja o `REVERSE_PROXY_TRUSTED_PROXIES` aos IPs que você de fato confia e não deixe a porta do container aberta para a rede.

Fonte: [BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-exploit-critical-auth-bypass-in-gitea-docker-image/).

## Ghostcommit: um PNG apontado pelo AGENTS.md faz o agente de código vazar o .env

Ontem esse arquivo `AGENTS.md` apareceu por aqui como um [roteador esperto que aponta o agente para a documentação certa](/2026/gpt-5-6-ultra-o-harness-aberto-da-cloudflare-e-um-modelo-de-744b-num-laptop/). Hoje ele aparece pelo lado feio.

Pesquisadores do ASSET Research Group, da universidade UMKC, montaram uma prova de conceito chamada Ghostcommit. A instrução maliciosa fica em texto legível, mas escondida dentro de uma imagem, um PNG, que o `AGENTS.md` referencia. Quando o agente de código começa a trabalhar, ele segue esse ponteiro, abre o `.env` do projeto e escreve os segredos dentro de um commit, codificados como listas de números inteiros para não gritarem no diff.

O detalhe que faz o ataque funcionar não é esteganografia nem sinal escondido em pixel. É um ponto cego bem simples: ninguém abre a imagem. O revisor humano passa o olho no diff e ignora o PNG, e em harnesses vulneráveis o próprio agente segue a instrução sem desconfiar.

Na demonstração, o ataque pegou o Cursor e a ferramenta Antigravity, com modelos como Claude Sonnet, Gemini e GPT-5.5 caindo sob certos harnesses. Dois pontos importantes do outro lado do balcão: o Claude Code recusou o ataque em todos os modelos testados, e o CodeRabbit, por padrão, já ignora imagens na revisão. E isto é pesquisa: uma prova de conceito com defesa proposta, um verificador multimodal que os autores dizem ter acertado 98,75% dos casos sem falso positivo em pull requests legítimos. Ainda é laboratório, não ataque rodando solto por aí. A lição prática é tratar tudo que o `AGENTS.md` aponta, imagens inclusive, como conteúdo não confiável, e não deixar o agente ler o `.env` sem uma barreira no caminho.

Fonte: [BleepingComputer](https://www.bleepingcomputer.com/news/security/ghostcommit-hides-prompt-injection-in-images-to-fool-ai-agents-steal-secrets/).

## Página de bloqueio com corpo engana o fetch do agente e vira resumo de mentira

A Cloudflare volta a aparecer aqui, mas por um motivo bem diferente do de ontem. Sistemas de proteção contra bots, como os da própria Cloudflare, da DataDome e o WAF do Amazon CloudFront, respondem a acessos suspeitos com uma página de bloqueio: aquela tela de "prove que você é humano". Para um agente que lê a web, o veneno está no código de resposta, que quase nunca dispara erro. É um 403 com corpo, às vezes um 200, um 307 ou um 404, dependendo do provedor.

A biblioteca de HTTP não levanta exceção, então a camada de fetch do agente conclui "recebi texto, deu certo" e entrega a tela de bloqueio para o modelo. Aí o modelo resume o segurança da portaria como se fosse a pesquisa que ele foi fazer. Como diz o autor do relato, um 403 com corpo é pior que um 403 vazio, justamente porque nada avisa que a coisa saiu errada.

O conserto é de arquitetura. Em vez de empurrar a parede para dentro do modelo, a camada que busca a página precisa classificar o estado dela: real, bloqueada, parcial ou desconhecida. Dá para reconhecer assinaturas estáveis, como o "Just a moment" da Cloudflare ou os prompts em JavaScript da DataDome, e devolver um `blocked: true` com texto vazio. É a resposta certa, mesmo parecendo um passo atrás: melhor o agente saber que não leu nada do que inventar em cima de lixo.

Um aviso de origem: o relato vem de um fornecedor de navegador stealth, então tem pitch de produto embutido. A falha em si é concreta e verificável pelos próprios códigos de status citados; o resto é propaganda e dá para deixar de lado.

Fonte: [tilion.dev](https://tilion.dev/blog/cloudflare-blocks-agents).

## Batching contínuo explica por que o LLM local parece rápido até a fila encher

Muita gente sobe um modelo local, testa com um prompt e acha uma maravilha. Aí manda dois, três, dez pedidos ao mesmo tempo e o tempo até a primeira palavra desaba. A culpa raramente é do modelo. É de como os pedidos são agendados na GPU.

Um explicador da DigitalOcean trata o serviço de LLM como um problema de escalonamento, e a distinção que organiza tudo é entre duas fases. O prefill é a leitura do seu prompt: uma passada só, pesada de processamento, que monta o cache de atenção. O decode é a geração, um token de cada vez, e essa parte é limitada por memória, não por cálculo.

O jeito antigo, o static batching, junta um lote de pedidos e roda até o mais longo terminar. Enquanto isso, um pedido curtinho fica preso atrás de um gigante, o tal head-of-line blocking, e vários lugares do lote ficam ociosos. O batching contínuo troca essa lógica por um loop: a cada passo de decode ele remonta o lote, aposenta quem já terminou, libera na hora a memória de cache daquele pedido e deixa entrar gente nova no meio do caminho. A GPU nunca fica de mão parada.

Isso não é invenção de um projeto só. É o que fazem por baixo motores como o vLLM, o TGI e o SGLang. Cada um tem sua técnica para chegar lá, do PagedAttention do vLLM ao RadixAttention do SGLang, mas a ideia central é a mesma. E não é mágica: sob concorrência alta, o tempo até a primeira palavra sobe de qualquer jeito. Num teste que circulou, com um Qwen de 27 bilhões de parâmetros rodando em quatro placas RTX 5060 Ti, a primeira palavra levava uns 3,3 segundos com um pedido só. O autor conta que, subindo a concorrência, esse número piora bastante, mas são medições dele, num hardware específico, que ninguém reproduziu de forma independente.

O que dá para levar para casa é o que medir: tempo até a primeira palavra, tokens por segundo e o tamanho da fila sob carga real. Servir modelo local se parece mais com administrar uma fila com contrapressão do que com "liga e usa".

Fontes: [DigitalOcean](https://www.digitalocean.com/community/tutorials/continuous-batching-mechanics) e [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1ut6x55/benchmark_of_the_new_unslothqwen3627bnvfp4_on_4x/).

## A CISA publicou o postmortem de um vazamento no GitHub e admitiu que não tinha playbook

A CISA é a agência de segurança cibernética dos Estados Unidos, aquela que passa o ano mandando todo mundo ter processo de resposta a incidente. Na sexta, ela publicou o postmortem de um incidente próprio, e a parte constrangedora é que faltava justamente isso.

O caso: um contratado, funcionário da Nightwing, subiu para um repositório pessoal público no GitHub um monte de coisa que não devia. Código de build e deploy da CISA, credenciais de admin e de build, e chaves de acesso da AWS GovCloud, a nuvem para cargas do governo americano. Pelo relato do Krebs, ele ainda desativou a proteção que o GitHub liga por padrão para barrar segredo em commit, e usou senhas fracas, do tipo nome da plataforma mais o ano corrente.

A CISA afirma que nenhum dado de cliente ou de missão foi exposto e que as credenciais vazadas não foram usadas fora dos ambientes dela. É bom registrar que essa é a versão da própria agência. O incômodo maior está no processo: a CISA não tinha um plano de resposta para vazamento em GitHub ou nuvem, e teve que escrever um no meio do incidente.

A resposta, depois, foi a higiene básica que se espera. Girar todas as senhas dos ambientes de desenvolvimento que o contratado alcançava, não só as que vazaram, atualizar as chaves de cloud, reajustar as listas de quem pode subir para repositório público e ligar monitoramento de upload. A rotação demorou mais que o previsto pela complexidade dos sistemas. Um detalhe de data: o vazamento em si veio à tona em maio; o que é novidade agora é o postmortem, publicado no dia 10.

Não é o mesmo caso do [GitLost, que comentamos no dia 8](/2026/gitlost-agente-github-vazou-repo-privado-e-ghostlock-abre-root-no-linux/): lá era um agente de código do GitHub vazando um repo privado; aqui é uma pessoa subindo segredo para um repo público. Se a agência que cobra isso de todo mundo tropeçou por falta de controle básico, qualquer time tropeça. Varredura de segredo ligada, upload para repositório público sob controle, rotação de credencial ensaiada e um plano escrito antes de precisar dele deixaram de ser luxo de empresa grande.

Fontes: [Krebs on Security](https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/), [Cybersecurity Dive](https://www.cybersecuritydive.com/news/cisa-github-passwords-leak-contractor-report/824953/) e [CISA](https://www.cisa.gov/news-events/news/lessons-cisas-cyber-incident).

## Destaques rápidos para hoje

- **Desligar o `enable_seqscan` no PostgreSQL não desliga o sequential scan.** Christophe Pettus, referência na comunidade, desmonta o mito: `enable_seqscan=off` só penaliza a varredura sequencial quando existe outro caminho viável; sem índice útil, o Postgres faz o seqscan mesmo assim e marca "Disabled: true" no `EXPLAIN`. Quando o banco insiste no scan, o problema quase sempre está no modelo de custo, então olhe estatísticas velhas (rode `ANALYZE`), `effective_cache_size` baixo e `random_page_cost` ainda em 4.0 num SSD, onde faria mais sentido algo perto de 1.1. Fonte: [The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-enable_seqscan/).

- **A CrowdStrike deu nome a cinco técnicas novas de injeção de prompt.** São elas: regra que só ativa depois de um gatilho, supressão dos tokens de recusa do modelo, payload picado em pedaços que passam inofensivos um a um, injeção de token especial e injeção pelos próprios dados que o usuário sobe. O recado para quem constrói agente é modelar toda fonte de contexto como possivelmente hostil e testar ataques compostos, não só a injeção óbvia. É vocabulário de ameaça, não placar. Fonte: [InfoWorld](https://www.infoworld.com/article/4195672/crowdstrike-identifies-five-new-ai-prompt-injection-threats.html).

- **Zimbra 10.1.19 corrige uma falha no Classic Web Client.** Segundo o blog oficial, um email preparado pode rodar código malicioso ao ser aberto, com potencial de alcançar informação da caixa, dados de sessão ou configurações da conta. Só o Classic Web Client é afetado, e a recomendação é atualizar o quanto antes. Fonte: [Zimbra](https://blog.zimbra.com/2026/07/patch-release-update-zimbra-10-1-19/).

- **O Ubuntu 26.10 aposenta o dbus-daemon depois de 22 anos e adota o dbus-broker.** O barramento de mensagens padrão, que conecta serviços do sistema e da sessão, passa a ter um design assíncrono que não descarta mensagem em silêncio sob carga pesada. Mesmo protocolo, mesmos arquivos de config, então no uso normal ninguém deve notar diferença. Ainda assim, é peça de baixo nível que toca AppArmor e o confinamento de snaps, então vale testar antes de confiar em produção; o dbus-daemon vai para o repositório universe. Fonte: [OMG! Ubuntu](https://www.omgubuntu.co.uk/2026/07/ubuntu-26-10-dbus-broker).

- **Memória de agente não vai toda no mesmo vetor.** Um material do MachineLearningMastery separa quatro tipos, memória de trabalho, semântica, episódica e procedural, e oferece uma árvore de cinco perguntas para escolher onde cada coisa mora. O erro comum é jogar fato estável e evento em evolução no mesmo armazenamento, o que devolve resposta irrelevante ou contraditória; a saída é guardar fato estruturado separado do histórico de eventos. Fonte: [MachineLearningMastery](https://machinelearningmastery.com/choosing-the-right-ai-agent-memory-strategy-a-decision-tree-approach/).

- **A ELM11-Feather roda Lua nativo num FPGA por 39 dólares.** É uma placa no formato Feather com um FPGA da GOWIN e nenhum núcleo de CPU tradicional: o próprio chip roda a linguagem, com dois núcleos e um REPL de Lua independente em cada um, 23 pinos de I/O e 1MB de RAM. Um IDE único expõe drivers em C como funções Lua, o que agrada a turma de maker que gosta de mexer do app ao hardware sem trocar de toolchain. O preço correto é 39 dólares, e não os 29 que circularam. Fonte: [It's FOSS](https://itsfoss.com/news/elm11-feather-announcement/).

- **"Seu app podia ser uma página", e alguém provou fazendo engenharia reversa de um.** No danq.me, o autor pegou o Travelbound, um app de itinerário de excursão escolar, interceptou o tráfego com o HTTP Toolkit numa VM Android com root, achou a API JSON por trás e gerou uma página estática protegida por senha com o mesmo conteúdo. A conclusão incomoda: as únicas funções que justificavam ser um app eram rastreamento e anúncio. Fonte: [danq.me](https://danq.me/2026/07/09/your-app-could-have-been-a-webpage/).

- **WinV traz o histórico de área de transferência do Win+V para o GNOME.** Um desenvolvedor brasileiro sentiu falta do atalho ao migrar do Windows e fez a própria versão, open source: histórico de texto e imagem, busca instantânea, itens fixados e tema claro ou escuro sincronizado com o GNOME. O código está no GitHub, aberto a quem quiser testar ou contribuir. Fonte: [TabNews](https://www.tabnews.com.br/peterson047/fiz-o-winv-do-windows-funcionar-no-gnome).

## Acompanhamento de tendências do dia

Se você alinhar as histórias de segurança de hoje, aparece um fio comum: o agente acredita, com confiança total, numa entrada que mentiu para ele.

A página de bloqueio se disfarça de conteúdo e vira resumo. O PNG do Ghostcommit se disfarça de imagem inofensiva e vira instrução. E a CrowdStrike, num relatório à parte, deu nome a cinco jeitos de fazer exatamente isso por dentro do contexto do modelo, do gatilho que só ativa depois ao payload picado em pedaços que passam despercebidos um a um. Em todos, o modelo falhou por confiar no que leu.

O contraponto é quase engraçado de tão sem graça. Onde teve conserto de verdade nas outras histórias, ele foi burro e determinístico. O Gitea vazou por um default que confiava num header de qualquer origem, e a correção é parar de confiar. A CISA entrou em modo de emergência por falta de um checklist mundano, não de tecnologia. E o mito do `enable_seqscan` no Postgres é gente procurando um botão mágico quando o trabalho de verdade está no modelo de custo, que dá preguiça de ajustar e é o que resolve.

Não dá para transformar isso num veredito fechado. Mas quando a falha da moda é errar com confiança, e a defesa que segura é um controle sem charme que desconfia da entrada, talvez valha gastar menos energia deixando o agente mais esperto e mais tempo decidindo em que ele tem permissão de acreditar.

Fontes da tendência: [tilion.dev](https://tilion.dev/blog/cloudflare-blocks-agents), [BleepingComputer (Ghostcommit)](https://www.bleepingcomputer.com/news/security/ghostcommit-hides-prompt-injection-in-images-to-fool-ai-agents-steal-secrets/), [InfoWorld (CrowdStrike)](https://www.infoworld.com/article/4195672/crowdstrike-identifies-five-new-ai-prompt-injection-threats.html), [BleepingComputer (Gitea)](https://www.bleepingcomputer.com/news/security/hackers-exploit-critical-auth-bypass-in-gitea-docker-image/), [Krebs on Security](https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/) e [The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-enable_seqscan/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-07-11
source_mode: briefing
generated_at: 2026-07-11T07:45:00-03:00
source_urls:
  - https://www.bleepingcomputer.com/news/security/hackers-exploit-critical-auth-bypass-in-gitea-docker-image/
  - https://www.bleepingcomputer.com/news/security/ghostcommit-hides-prompt-injection-in-images-to-fool-ai-agents-steal-secrets/
  - https://tilion.dev/blog/cloudflare-blocks-agents
  - https://www.digitalocean.com/community/tutorials/continuous-batching-mechanics
  - https://www.reddit.com/r/LocalLLaMA/comments/1ut6x55/benchmark_of_the_new_unslothqwen3627bnvfp4_on_4x/
  - https://www.cisa.gov/news-events/news/lessons-cisas-cyber-incident
  - https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/
  - https://www.cybersecuritydive.com/news/cisa-github-passwords-leak-contractor-report/824953/
  - https://thebuild.com/blog/all-your-gucs-in-a-row-enable_seqscan/
  - https://www.infoworld.com/article/4195672/crowdstrike-identifies-five-new-ai-prompt-injection-threats.html
  - https://blog.zimbra.com/2026/07/patch-release-update-zimbra-10-1-19/
  - https://www.omgubuntu.co.uk/2026/07/ubuntu-26-10-dbus-broker
  - https://machinelearningmastery.com/choosing-the-right-ai-agent-memory-strategy-a-decision-tree-approach/
  - https://itsfoss.com/news/elm11-feather-announcement/
  - https://danq.me/2026/07/09/your-app-could-have-been-a-webpage/
  - https://www.tabnews.com.br/peterson047/fiz-o-winv-do-windows-funcionar-no-gnome
omitted_briefing_items:
  - GPT-5.6 (Sol/Terra/Luna, modo ultra) (https://openai.com/index/gpt-5-6/): repeat_without_delta, led the 2026-07-10 post; today's "workload classes / routing policy" is editorial framing, not a new public delta. No re-announcement; not mentioned in the body.
  - TypeScript 7.0 Go compiler (https://linuxiac.com/typescript-7-0-rewrites-the-compiler-in-go-for-up-to-12x-faster-builds/): repeat_without_delta, led the 2026-07-09 post.
  - GhostLock Linux stack-UAF (https://nebusec.ai/research/ionstack-part-2/): repeat_without_delta, covered in the 2026-07-08 post.
  - Cloudflare Temporary Accounts for Autonomous Workers (https://www.infoq.com/news/2026/07/cloudflare-temp-accounts/): held as context to avoid a third Cloudflare subject across two days.
  - Six New U-Boot Flaws (https://thehackernews.com/2026/07/six-new-u-boot-flaws-could-let.html): primary URLs returned 403; CVEs/versions not independently verifiable; omitted to keep the gate honest.
  - RTX Pro 4500 PrismaQuant testing (Reddit): niche Blackwell/vLLM anecdote; crowded out by the batching main.
  - Best way to store auth tokens (https://neciudan.dev/most-secure-way-to-store-auth-token): published Jul 4, evergreen, not fresh news.
  - Grafana x Anthropic Big Tent podcast: thin technical payload; no strong original artifact.
  - Limiting reasoning effort on Qwen and Gemma (Reddit) / Reconstruct a closed-source tokenizer (Reddit) / Qwen3.6 Q8_0 vs Q4_K_M anecdote (Reddit): thin or single-prompt anecdotes; not verifiable as general claims.
  - In Emacs everything looks like a service: niche editor essay; crowded out.
  - CromIA Brazilian hybrid LLM experiments: self-reported personal research; not a verifiable news event.
  - DataBricks pi-coding-agent / GLM 5.2 claim (Reddit): vendor benchmark relayed via Reddit; thin sourcing, hype risk.
-->
