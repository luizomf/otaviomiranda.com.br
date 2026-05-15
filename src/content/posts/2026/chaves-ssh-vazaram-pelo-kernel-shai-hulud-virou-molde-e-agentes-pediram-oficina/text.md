---
title: 'Chaves SSH vazaram pelo kernel, Shai-Hulud virou molde e agentes pediram oficina'
description: 'Falha local no Linux expõe chaves de host, código do Shai-Hulud aumenta risco de cópia, wrappers de agentes entram no centro e DS4 mostra IA local de alto custo.'
date: 2026-05-15T06:22:40-03:00
author: 'The Paper LLM'
image: './images/chaves-ssh-kernel.jpg'
---

Tem um tipo de problema que só aparece quando a gente para de olhar para a ferramenta bonita e começa a olhar para o que ela pode tocar.

Um programa simples pode ler arquivo? Pode abrir descritor de outro processo? Pode publicar pacote? Pode rodar dentro do CI com credencial de nuvem? Pode vasculhar seu repositório, chamar terminal, mexer em cache e depois dizer que era só uma ajudinha?

Hoje o fio que passa pelas notícias é esse: permissão demais, contexto velho ou confiança automática viram superfície de ataque. Às vezes isso aparece como falha no kernel. Às vezes aparece como verme de supply chain. Às vezes aparece como agente de código que só fica bom quando alguém monta uma oficina inteira ao redor dele, com busca, regra, teste e porteiro.

A primeira história é bem pé no chão. Em uma máquina Linux compartilhada, uma falha local pode expor chaves que identificam o servidor por SSH. Não é o tipo de bug que permite invadir qualquer máquina pela internet com um estalar de dedos, mas é daqueles que deixam uma pergunta chata depois do patch: se alguém já estava dentro, a identidade da máquina ainda é confiável?

A segunda história vem do mundo dos pacotes. O Shai-Hulud, aquele verme de supply chain que já tinha aparecido em ataques envolvendo npm e PyPI, agora entrou em outra fase: código publicado, risco de cópia e mais gente olhando para a mesma receita.

E, para completar, os agentes continuam saindo da fantasia de "modelo esperto" para um lugar mais operacional. O modelo ainda importa, claro. Só que o entorno dele, busca no código vivo, permissões, arquivos de instrução, hooks, validação, começa a parecer a parte que decide se a coisa ajuda ou só produz trabalho com confiança.

Vamos com calma, porque hoje tem chave, pacote, agente, modelo local e kernel de Mac no mesmo café. Café forte, inclusive.

![Mascote do Linux segurando uma grande chave SSH de metal diante de uma casca preta rachada em uma oficina de servidores.](./images/chaves-ssh-kernel.jpg)

## Uma falha local no Linux pode virar vazamento de identidade da máquina

A lista oss-security da Openwall publicou um aviso sobre uma falha de lógica no `ptrace` do kernel Linux, corrigida pelo commit `31e62c2ebbfdc3fe3dbdf5e02c92a9dc67087a3a` depois de reporte da Qualys. O repositório público `ssh-keysign-pwn` demonstra o impacto de um jeito que chama atenção: ler chaves privadas de host SSH usando `ssh-keysign`, e também ler `/etc/shadow` via `chage`, em kernels antes da correção.

O detalhe técnico fica no caminho de permissão do `__ptrace_may_access()`. Durante a saída de um processo, existe uma janela em que `task->mm` pode estar como `NULL`. Segundo a análise, isso pulava uma verificação de "dumpability" enquanto descritores de arquivo ainda podiam ser roubados com `pidfd_getfd(2)`. Em português de gente: um processo privilegiado está indo embora, mas ainda segura arquivos importantes; outro processo local consegue aproveitar o momento certo e puxar o que não deveria.

É uma falha local. Esse ponto precisa ficar grudado na notícia. Não é uma porta remota aberta para qualquer pessoa da internet.

Só que "local" não quer dizer "irrelevante". CI runner roda código de PR. VPS recebe usuário, serviço, container e script que nem sempre merecem confiança plena. Laboratório de aula e servidor compartilhado têm múltiplas contas. Container também compartilha o kernel do host, então a frase "mas está containerizado" não é cobertor mágico para dormir tranquilo.

O estrago mais sensível aqui é a identidade do host. Quando a chave privada de SSH de uma máquina vaza, o problema não termina no `apt upgrade` ou no reboot. Depois de aplicar o kernel corrigido, vale avaliar rotação das chaves em máquinas expostas, multiusuário, de build ou de container host. Trocar chave de host dá trabalho, quebra confiança conhecida, gera aviso para cliente SSH e geralmente aparece no pior horário. Ainda assim, é melhor do que manter uma identidade possivelmente copiada.

O histórico também cutuca: Jann Horn já tinha proposto correções relacionadas em 2020. Software de base às vezes passa anos com uma porta pequena torta, até alguém encostar do ângulo certo. Que alegria tranquila.

Fontes: [oss-security/Openwall](https://seclists.org/oss-sec/2026/q2/529), [commit no Linux](https://github.com/torvalds/linux/commit/31e62c2ebbfdc3fe3dbdf5e02c92a9dc67087a3a), [PoC ssh-keysign-pwn](https://github.com/0xdeadbeefnetwork/ssh-keysign-pwn) e [Phoronix](https://www.phoronix.com/news/Linux-ssh-keysign-pwn).

## O Shai-Hulud deixou de ser só incidente e virou material reutilizável

Risky Biz reportou que o código-fonte do Shai-Hulud foi publicado por pessoas que diziam ter ligação com o TeamPCP. A mesma cobertura cita avaliação da Datadog de que o material seria uma correspondência quase exata. A atribuição ainda merece cuidado, porque alguém pode estar se passando pelo grupo. O ponto publicável mais sólido é outro: código de um verme de supply chain saiu do campo de resposta a incidente e virou material que outras pessoas podem estudar, adaptar ou copiar.

Isso muda a temperatura do caso.

JFrog e Orca descrevem a campanha Mini Shai-Hulud atingindo pacotes em npm e PyPI, com nomes conhecidos no caminho, incluindo TanStack, Mistral AI e UiPath. A cadeia abusava de suposições de confiança no fluxo de publicação. Código malicioso rodava dentro de infraestrutura legítima de release, extraía material OIDC do runner, mexia com cache do GitHub Actions e podia publicar pacote com atestação de proveniência aparentemente válida.

Essa última parte é a que dói. Assinatura e proveniência ajudam muito, mas não salvam sozinhas quando o atacante consegue executar antes da publicação, dentro do workflow confiável. É como carimbar um documento falso usando o carimbo verdadeiro da empresa. O carimbo é real. O conteúdo continua sendo problema.

Também apareceu OpenAI nessa história, mas de forma estreita. A cobertura pública fala em dispositivos corporativos afetados e rotação de credenciais, sem relato de comprometimento de dados de usuários. Melhor deixar assim, sem transformar um detalhe em espetáculo.

Para quem mantém pacote ou CI, o trabalho útil é bem menos cinematográfico: revisar triggers do GitHub Actions, cache compartilhado, escopo de segredo, OIDC, lifecycle hooks do npm, allowlist de pacote, token que fica disponível para build e o que acontece quando um `preinstall` decide brincar de ser adulto. E, se você depende de pacote publicado por terceiros, provenance vira um sinal dentro de um conjunto maior, não uma bênção papal.

Comparações com Mirai, Babuk ou LockBit ajudam só como alerta histórico: quando código ofensivo funcional vaza, variantes costumam aparecer. Não quer dizer que todo `npm install` virou roleta russa. Quer dizer que uma receita que já funcionou agora ficou mais fácil de reaproveitar.

Fontes: [Risky Biz](https://news.risky.biz/risky-bulletin-shai-hulud-goes-open-source/), [JFrog](https://research.jfrog.com/post/shai-hulud-here-we-go-again/), [Orca Security](https://orca.security/resources/blog/tanstack-npm-supply-chain-worm/) e [The Next Web](https://thenextweb.com/news/openai-tanstack-npm-supply-chain-mini-shai-hulud).

## Agente bom depende da oficina, não só do motor

Uma parte das notícias de agentes está ficando mais honesta. A conversa sai um pouco do ranking de modelo e entra no desenho do ambiente onde o agente trabalha. Eu gosto dessa virada porque ela deixa menos espaço para misticismo e mais espaço para engenharia chata, aquela que realmente salva a pele.

A própria Anthropic publicou orientações sobre como usar Claude Code em bases grandes dizendo, com todas as letras, que o harness importa tanto quanto o modelo. No texto, a recomendação passa por navegação no sistema de arquivos vivo, busca com grep, instruções enxutas em `CLAUDE.md`, hooks, skills, plugins, servidores MCP, integrações com LSP e subagentes. O nome da moda pode mudar; a ideia é antiga: ferramenta precisa enxergar o lugar certo, ter permissão limitada e receber feedback que preste.

Um preprint chamado "Is Grep All You Need?" coloca sal nessa conversa. No recorte testado de busca agentic, grep venceu recuperação vetorial em certas condições. Isso não aposenta vetor, RAG ou indexação. Só lembra que uma busca simples, atual e bem conectada ao código real pode ganhar de uma camada bonita que ficou velha cinco minutos depois do último commit.

Outro ponto vem do AuthBench. O benchmark trabalha com 120 tarefas de terminal e mostra que permissões continuam difíceis para agentes. A decomposição em duas etapas, gerar e depois auditar, melhorou em 15,8% o sucesso em tarefas sensíveis e reduziu sucesso de ataque no recorte reportado. O nome técnico é Sufficiency-Tightness Decomposition. O efeito que interessa é mais simples: peça para uma parte fazer e outra revisar a autoridade concedida. Parece burocracia. Às vezes burocracia é só segurança usando sapato social.

Também há sinais de pesquisa em memória e execução, como Chronos e amostras de LongMemEval, além da cobertura secundária sobre Poetiq montando harness de forma automática. Eu trataria esses números como material interessante, não como verdade industrial já carimbada. Preprint e post de fornecedor são convite para testar, não para tatuar arquitetura no braço.

Para dev que usa agente hoje, o resumo operacional fica bem concreto: mantenha instruções de projeto curtas, dê acesso ao código vivo, rode type checker e teste, separe ferramenta perigosa, registre ação, audite permissão e evite encher contexto com um caminhão de texto morto. Modelo forte dentro de oficina bagunçada continua tropeçando em chave de boca no chão.

Fontes: [Anthropic, Claude Code em codebases grandes](https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start), [Is Grep All You Need?](https://arxiv.org/abs/2605.15184v1), [AuthBench](https://arxiv.org/abs/2605.14859v1), [preprint sobre barreiras de adoção de agentes](https://arxiv.org/abs/2605.14675v1) e [MarkTechPost sobre Poetiq](https://www.marktechpost.com/2026/05/14/poetiqs-meta-system-automatically-builds-a-model-agnostic-harness-that-improved-every-llm-tested-on-livecodebench-pro-without-fine-tuning/).

## IA local ficou mais séria, mas ainda cobra hardware

Salvatore Sanfilippo, o antirez, publicou o DS4, ou DwarfStar 4. A proposta usa DeepSeek v4 Flash com uma receita de quantização assimétrica em 2 e 8 bits. Segundo ele, isso torna viável rodar localmente, em máquinas com 96 GB ou 128 GB de RAM, algo que ele realmente usaria para trabalho sério que antes mandaria para Claude ou GPT.

O model card no Hugging Face dá uma dimensão melhor do bicho: o artefato `q2` tem 80,8 GiB e mira Macs de 128 GB. O `q4` tem 153,3 GiB e pede máquinas com 256 GB ou mais. Só essa frase já separa curiosidade técnica de compra parcelada em sofrimento.

Mesmo assim, a notícia é importante. Durante muito tempo, IA local parecia dividida entre brinquedo pequeno simpático e modelo grande que exigia um laboratório doméstico. DS4 sugere que a faixa alta está ficando mais usável para quem tem memória de sobra, especialmente em Apple Silicon. Não é substituto universal para nuvem. É um sinal de que setups locais de alto nível estão ficando menos folclóricos.

Para não vender sonho errado, vale colocar do lado o teste do It's FOSS com modelos locais sem GPU. Em CPU, modelos pequenos como Qwen 3 de 0,6 bilhão de parâmetros ficaram na casa de 34 a 36 tokens por segundo. TinyLlama 1.1B apareceu em 25 a 28 tokens por segundo. Isso pode ser útil para tarefas leves, automação simples, rascunho local e privacidade. Quando o modelo cresce, a paciência também precisa crescer. Às vezes ela pede férias.

O texto de Anton Leicht sobre corte de acesso a modelos de fronteira dá o contexto estratégico. Se APIs ficarem mais caras, restritas, policiadas por política ou limitadas por disponibilidade de compute, rodar parte da pilha localmente ganha valor. Eu não leria isso como previsão de apocalipse da nuvem. Nuvem continua conveniente demais. Mas ter uma rota local reduz dependência e pode deixar agentes mais reproduzíveis, privados e controláveis.

Então o quadro honesto é este: no laptop comum, modelos pequenos ainda são o caminho razoável. Em máquinas de 128 GB ou 256 GB, DS4 mostra uma trilha bem mais ambiciosa. A diferença entre as duas coisas cabe em muitos gigabytes e em uma conversa séria com o cartão de crédito.

Fontes: [antirez](https://antirez.com/news/165), [DS4 no Hugging Face](https://huggingface.co/antirez/deepseek-v4-gguf), [Its FOSS](https://feed.itsfoss.com/link/24361/17341706/testing-local-llms-without-gpu) e [Anton Leicht](https://writing.antonleicht.me/p/cut-off).

## Destaques rápidos para hoje.

- A Calif afirma ter uma cadeia de escalada local de privilégio no macOS 26.4.1, build `25E253`, em hardware Apple M5 com Memory Integrity Enforcement ativo. A equipe diz que o Mythos Preview ajudou a identificar bugs e no desenvolvimento do exploit, com descoberta em 25 de abril e exploit funcional em 1º de maio. O relatório técnico de 55 páginas está retido até a Apple corrigir, então por enquanto isso é sinal de metodologia e pressão sobre mitigação, não walkthrough público. Fontes: [Calif](https://blog.calif.io/p/first-public-kernel-memory-corruption) e [arXiv](https://arxiv.org/abs/2605.15097v1).

- CloudNativePG 1.29.1 e 1.28.3 corrigem a `CVE-2026-44477`, com CVSS v4 9.4. A falha vinha do metrics exporter conectando como superusuário `postgres` e tentando rebaixar com `SET ROLE`; com `RESET ROLE`, dava para recuperar superusuário e usar `COPY TO PROGRAM` para executar comando no pod primário. A correção troca isso por uma role dedicada, `cnpg_metrics_exporter`, com privilégios de `pg_monitor`. Fonte: [PostgreSQL News](https://www.postgresql.org/about/news/cloudnativepg-1291-and-1283-released-critical-cve-fix-3296/).

- O Rust discute uma política estreita para contribuições geradas por LLM no PR `rust-lang/rust-forge#1040`. A proposta é ficar no Forge e ser linkada pelos guias de contribuição do `rust-lang/rust`, com foco em reduzir PRs de baixo esforço gerados por IA. Caveat importante: é um PR aberto no momento da curadoria, não uma regra final já mesclada. Fonte: [rust-lang/rust-forge#1040](https://github.com/rust-lang/rust-forge/pull/1040).

- Um experimento independente com Mullvad testou 3.650 chaves públicas WireGuard em 9 servidores e encontrou apenas 284 combinações de IPs de saída, apesar de os pools sugerirem mais de 8,2 trilhões de combinações possíveis. A hipótese é atribuição determinística por chave, o que pode virar impressão digital entre servidores. Não é advisory oficial da Mullvad, mas é uma boa lembrança: trocar servidor VPN não garante identidade nova se o padrão acompanha a chave. Fonte: [tmctmt](https://tmctmt.com/posts/mullvad-exit-ips-as-a-fingerprinting-vector/).

- O preprint Veritas, submetido em 14 de maio, mostra uma forma mais pé no chão de usar LLM em pesquisa de vulnerabilidade. O sistema combina IR LLVM levantado pelo RetDec, slicing estático, visão em C decompilado, detector com LLM e validação por debugger e artefatos de runtime. O resumo fala em 90% de recall e uma descoberta de CVE da Apple, mas continua sendo preprint: bom sinal de direção, não placa de "problema resolvido". Fonte: [arXiv](https://arxiv.org/abs/2605.15097v1).

- Supertonic v3 apareceu em cobertura secundária como TTS local com suporte a 31 idiomas e tags de expressão. Para quem monta pipeline local de IA e áudio, isso é candidato interessante, especialmente se português entrar bem. Só não dá para recomendar migração sem testar pronúncia, latência e integração no mundo real. Fonte: [MarkTechPost](https://www.marktechpost.com/2026/05/15/supertone-releases-supertonic-v3-on-device-text-to-speech-model-with-31-language-support-fewer-reading-failures-and-expression-tags/).

## Acompanhamento de tendências do dia.

O padrão de hoje é menos sobre "IA ficou mais poderosa" e mais sobre o entorno ficando impossível de ignorar.

No Linux, uma janela de permissão local pode expor a identidade SSH da máquina. No Shai-Hulud, a assinatura do pacote não basta quando o workflow de publicação já virou palco do ataque. Nos agentes, a qualidade depende de busca viva, instrução curta, permissão auditada e verificação executável. No DS4, a promessa local só fica boa quando a máquina tem memória para bancar.

Tudo isso aponta para uma pergunta simples para produção: quem pode tocar o quê, com qual evidência e por quanto tempo?

Essa pergunta não resolve o post inteiro, mas ajuda a organizar a bagunça. Chave de host, pacote publicado, agente com terminal, modelo local, exporter de métrica e VPN parecem assuntos separados. A cola entre eles é autoridade. Quando a autoridade está ampla demais, antiga demais ou invisível demais, o problema só está esperando a notícia certa para ganhar nome.

Fontes: [oss-security/Openwall](https://seclists.org/oss-sec/2026/q2/529), [Risky Biz](https://news.risky.biz/risky-bulletin-shai-hulud-goes-open-source/), [Anthropic](https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start), [antirez](https://antirez.com/news/165) e [PostgreSQL News](https://www.postgresql.org/about/news/cloudnativepg-1291-and-1283-released-critical-cve-fix-3296/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-15
generated_at: 2026-05-15T06:22:40-03:00
source_urls:
  - https://seclists.org/oss-sec/2026/q2/529
  - https://github.com/torvalds/linux/commit/31e62c2ebbfdc3fe3dbdf5e02c92a9dc67087a3a
  - https://github.com/0xdeadbeefnetwork/ssh-keysign-pwn
  - https://www.phoronix.com/news/Linux-ssh-keysign-pwn
  - https://news.risky.biz/risky-bulletin-shai-hulud-goes-open-source/
  - https://research.jfrog.com/post/shai-hulud-here-we-go-again/
  - https://orca.security/resources/blog/tanstack-npm-supply-chain-worm/
  - https://thenextweb.com/news/openai-tanstack-npm-supply-chain-mini-shai-hulud
  - https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start
  - https://arxiv.org/abs/2605.15184v1
  - https://arxiv.org/abs/2605.14859v1
  - https://arxiv.org/abs/2605.14675v1
  - https://www.marktechpost.com/2026/05/14/poetiqs-meta-system-automatically-builds-a-model-agnostic-harness-that-improved-every-llm-tested-on-livecodebench-pro-without-fine-tuning/
  - https://antirez.com/news/165
  - https://huggingface.co/antirez/deepseek-v4-gguf
  - https://feed.itsfoss.com/link/24361/17341706/testing-local-llms-without-gpu
  - https://writing.antonleicht.me/p/cut-off
  - https://blog.calif.io/p/first-public-kernel-memory-corruption
  - https://arxiv.org/abs/2605.15097v1
  - https://www.postgresql.org/about/news/cloudnativepg-1291-and-1283-released-critical-cve-fix-3296/
  - https://github.com/rust-lang/rust-forge/pull/1040
  - https://tmctmt.com/posts/mullvad-exit-ips-as-a-fingerprinting-vector/
  - https://www.marktechpost.com/2026/05/15/supertone-releases-supertonic-v3-on-device-text-to-speech-model-with-31-language-support-fewer-reading-failures-and-expression-tags/
omitted_briefing_items:
  - Microsoft Exchange CVE-2026-42897 active exploitation: high-stakes vendor/security claim was not checked against primary Microsoft advisory before artifact cutoff.
  - Cisco SD-WAN CVE-2026-20182 added to CISA KEV: high-stakes KEV/vendor details were not checked against CISA/Cisco primary pages before artifact cutoff.
  - PyCon US 2026 typing summit recap: trend overlap; harness block used stronger primary sources.
  - Best AI Agents ranking: leaderboard item weaker than primary harness sources and distracting for today's frame.
  - Coldkey post-quantum key backup tool: interesting tooling, lower priority than verified security/agent/local-AI stories.
  - RustPrint C to Rust migration framework: paper item omitted on a high-compression day.
  - AI Knows When It's Being Watched: provocative behavior claim needs careful reading before publication.
  - Fingerprinting LLM browser agents from UI traces: good future web-agent security item, lower priority today.
  - mdrfckr botnet libssh 0.11 update: detection-rule detail too narrow for today's post.
  - arXiv one-year ban for hallucinated references: source chain was social and not validated against arXiv policy.
  - AINews Everything is Conductor: trend overlap; stronger direct harness sources selected.
  - Have a Coherent AI Policy: Rust policy was the concrete open-source governance item.
  - TabNews Copilot outage: useful human-interest angle, lower news priority today.
  - Stack Overflow observability podcast: confirmed but better for a future observability-plus-agents piece.
  - Amazonbot respecting robots.txt: minor crawler-policy note compared with selected stories.
  - ClickFix scam motorcycle parts site: Reddit/powershell details need careful handling.
  - Voice tool-calling benchmark: related to voice, but Supertonic was the fresher practical quick hit.
  - WARD prompt-injection defense: good agent-security paper, omitted to avoid overloading the harness section.
  - SemaTune Linux kernel parameter tuning: interesting Linux-plus-LLM research, less immediately actionable.
  - Toward Securing AI Agents Like Operating Systems: theoretical support, omitted to avoid repeating the harness point.
  - Reddit thread on AI coding tools shipping faster than security review: Reddit-only discussion; stronger primary evidence selected.
  - Orchard open source agentic framework: watch item; adoption not established.
  - SANS Stormcast May 15: audio roundup not needed; NGINX was covered yesterday and Cisco was not primary-validated today.
-->
