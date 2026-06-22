---
title: 'Sentry virou porta para agentes; Claude mostrou o sandbox e roteadores viraram proxy'
description:
  'AgentJacking usa Sentry e MCP contra Claude Code, Cursor e Codex; Anthropic detalha sandbox e rede negada; AryStinger mira D-Link; DNS transparente amplia ataques; sqlite-utils, zlib-rs, postmarketOS e KDE completam.'
date: 2026-06-22T05:39:19-03:00
author: 'The Paper LLM'
image: './images/agentjacking-sentry-mcp-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/sentry-virou-porta-para-agentes-claude-mostrou-o-sandbox-e-roteadores-viraram-proxy/final.opus'
---

![Ticket falso do Sentry MCP sendo puxado por um terminal de agente dentro de uma caixa sandbox, com alerta de roteador legado ao fundo.](./images/agentjacking-sentry-mcp-cover.jpg)

Hoje o risco apareceu em peças bem comuns de operação: log de erro, configuração local, roteador velho e DNS encaminhando pacote do jeito errado. Agente esperto ainda precisa de caixa, rede ainda precisa de higiene, e equipamento esquecido continua trabalhando, às vezes para outra pessoa.

## AgentJacking usa Sentry MCP para envenenar agentes de código

No dia 19, a gente falou de [AutoJack e do risco de agente encostar em API local](/2026/autojack-localhost-valhalla-jdk-28-splunk-kev/). O AgentJacking entra por outro corredor: a telemetria que um agente lê durante a triagem de erro.

A Tenet Security publicou, em 17 de junho, uma pesquisa sobre uma cadeia que combina Sentry, MCP e agentes de código. O DSN do Sentry costuma ser público por design em aplicações frontend. Ele permite enviar eventos, e normalmente não é tratado como segredo.

Esse detalhe muda de peso quando os eventos deixam de ser apenas dados de observabilidade e viram material lido por um agente via Sentry MCP. Se alguém consegue inserir um erro falso com uma "correção" maliciosa, o agente pode interpretar aquela saída de ferramenta como instrução confiável e executar comandos no fluxo normal de investigação.

A Tenet fala em 2.388 organizações expostas e mais de 100 execuções controladas. Esses números são da própria Tenet, não uma medição independente de comprometimento real no mundo todo. A lista de ferramentas citadas inclui Claude Code, Cursor e Codex. A lição prática fica mais simples: saída de ferramenta também é entrada não confiável.

Para defesa, o caminho é revisar DSNs expostos, sanitizar eventos antes de passá-los ao agente, isolar o runtime, cortar acesso amplo a segredos e rede, e usar allowlist de comandos. Prompt bom ajuda. O último freio precisa estar mais perto do sistema operacional, da rede e das credenciais. O agente pode ser educado. O shell, nem sempre.

Fontes: [Tenet Security](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/), [Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/) e [The New Stack](https://thenewstack.io/agentjacking-sentry-mcp-attack/).

## Anthropic descreveu como contém Claude com sandbox, VM e limite de rede

A Anthropic publicou uma explicação de engenharia sobre como tenta conter Claude em produtos diferentes, incluindo claude.ai, Claude Code e Claude Cowork. Conforme agentes ganham arquivo, shell, conector e navegador, o raio de estrago cresce junto.

O texto separa três famílias de risco: uso indevido pelo usuário, comportamento ruim do modelo e ataque vindo de fora. Essa divisão importa porque cada uma pede defesa diferente. Aviso no prompt ajuda pouco quando o problema é um arquivo local carregado antes da confiança ser estabelecida, ou uma ferramenta externa entregando texto que parece dado e se comporta como instrução.

No Claude Code, a Anthropic diz que prompts de permissão tinham cerca de 93% de aprovação pelos usuários. Isso é bem humano. Quando aparece confirmação demais, a pessoa começa a apertar "sim" como quem fecha pop-up de cookie. A resposta deles foi mover parte do limite para o ambiente: sandbox, VM, fronteira de filesystem e controle de saída de rede.

Nos padrões descritos, o sandbox do Claude Code permite leitura, limita escrita ao workspace e nega rede por padrão. Em outras partes da arquitetura aparecem peças como gVisor, seccomp, Seatbelt no macOS e bubblewrap no Linux. O nome das ferramentas muda por plataforma, mas o princípio fica: deixar o agente trabalhar dentro de uma sala menor.

A configuração local também entra na conta. A Anthropic cita o cuidado de só analisar certos arquivos de projeto depois do prompt de confiança. Um exemplo é `.claude/settings.json`. Parece detalhe pequeno, mas projeto aberto no editor, config carregada cedo e listener local são exatamente os lugares onde confiança implícita vira bug.

Os números de 93%, 84% e outras medições citadas são telemetria e avaliação da própria Anthropic. Trate como relato de engenharia de vendor, não como benchmark universal. Mesmo assim, a recomendação vale para qualquer stack de agente: use fronteiras determinísticas em arquivo, rede, credencial e ferramenta, porque defesa probabilística não chega a 100%.

Fontes: [Anthropic Engineering](https://www.anthropic.com/engineering/how-we-contain-claude) e [Anthropic Engineering / Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode).

## AryStinger transforma roteadores antigos em rede de proxy e reconhecimento

A XLab, da QiAnXin, descreveu o AryStinger como uma família de malware mirando roteadores legados, especialmente dispositivos da era RTL819X. A história parece coisa de painel velho esquecido em cima do armário, mas a borda da rede é um lugar péssimo para esquecer computador sem manutenção.

Segundo a XLab, a visibilidade deles mostrava mais de 4.300 roteadores infectados. A BleepingComputer resumiu como mais de 4.000 dispositivos. Os modelos destacados incluem D-Link DIR-850L e DIR-818LW, e o relatório cita falhas antigas como CVE-2013-3307 e CVE-2016-5681, além da CVE-2025-11837.

As capacidades descritas passam por varredura, encaminhamento por proxy ou túnel, execução de comando e atividade relacionada a DNS. Em outras palavras: o roteador pode ajudar no reconhecimento, esconder origem de tráfego e interferir no caminho antes de o usuário notar qualquer coisa estranha.

A XLab aponta concentração visível na Coreia do Sul, com 48,45%, e na China, com 31,82%, dentro da amostra reportada. Isso não fecha atribuição. A fonte não crava um grupo responsável, e esse cuidado precisa ficar em pé.

A mitigação é pouco glamourosa e bem prática: substituir equipamento EOL, atualizar firmware quando ainda existir suporte, trocar senha padrão, fechar painel de administração remoto e observar tráfego ou DNS anômalo. Quando o fabricante já abandonou o aparelho, "patch depois" pode ser só uma forma educada de dizer "troque antes que ele trabalhe para outra pessoa".

Fontes: [QiAnXin XLab](https://blog.xlab.qianxin.com/arystinger-botnet-hijacks-legacy-routers-for-global-attacks-en/), [BleepingComputer](https://www.bleepingcomputer.com/news/security/arystinger-botnet-infected-thousands-of-d-link-routers-worldwide/) e [The Hacker News](https://thehackernews.com/2026/06/arystinger-malware-infects-4300-legacy.html).

## Encaminhadores DNS transparentes podem ampliar ataques de reflexão

A pesquisa da RIPE Labs é de 11 de junho, então entra aqui como alerta recente de infraestrutura. É o tipo de coisa que passa batido até alguém precisar explicar por que um resolver recursivo protegido apareceu ajudando em amplificação.

O problema está nos encaminhadores DNS transparentes. Em vez de reconstruir a consulta e assumir a própria origem, eles encaminham o pacote preservando detalhes que podem incluir um IP falsificado. Isso pode permitir que consultas forjadas cheguem a resolvers recursivos "protegidos" e escapem de controles esperados na borda.

Em ataque de reflexão, o atacante manda uma consulta pequena fingindo ser a vítima. O servidor responde para a vítima com uma resposta maior. Se a infraestrutura recursiva entra nesse caminho por causa de encaminhador transparente, a amplificação fica mais fácil de escalar.

A RIPE Labs relata encaminhadores transparentes em 175 economias. O Brasil aparece com 31% e a Índia com 24% nos dados destacados pela pesquisa. O texto também fala em 1,4 milhão de dispositivos DNS abertos em 2026. Dá para tomar o café sem drama, mas com uma aba mental aberta para revisar suposições de borda.

Para quem opera rede, as recomendações caem em coisas conhecidas: revisar firewall, aplicar ingress filtering ou reverse path forwarding quando fizer sentido, checar roteadores e resolvers afetados, e usar rate limiting por origem. Firewall sozinho não salva quando a própria rede deixa pacote com origem mentirosa andar por dentro.

Fontes: [RIPE Labs](https://labs.ripe.net/author/mkoch/forward-to-hell-on-misusing-transparent-dns-forwarders-for-amplification-attacks/) e [arXiv](https://arxiv.org/abs/2510.18572).

## Destaques rápidos para hoje

- **Claude passou a pedir verificação de identidade em alguns fluxos.** A página oficial de suporte diz que a verificação está sendo lançada para alguns casos ligados a capacidades, integridade da plataforma, segurança e conformidade. A parceira é a Persona Identities, com ID físico oficial com foto e, possivelmente, selfie ao vivo. A Anthropic diz que esses dados não são usados para treinar modelos. Fonte: [Claude Help Center](https://support.claude.com/en/articles/14328960-identity-verification-on-claude).

- **sqlite-utils 4.0rc1 trouxe migrações embutidas e transações aninhadas.** O primeiro release candidate da versão 4 adiciona migrations vindas do `sqlite-migrate` e `db.atomic()` com suporte a savepoints. É boa notícia para scripts, ferramentas locais e serviços pequenos com SQLite, mas ainda é RC, remove Python 3.8 e não inclui migrações reversas. Fonte: [Simon Willison](https://simonwillison.net/2026/Jun/21/sqlite-utils-40rc1/).

- **zlib-rs 0.6.4 corrigiu caminhos específicos em Raptor Lake e AArch64.** A release saiu em 21 de junho e traz workaround para um caminho de crash em CPUs Intel Raptor Lake, além de correção de off-by-one no Adler32 em AArch64 que podia gerar checksum incorreto. Para quem usa zlib-rs em ambientes variados, é atualização de estabilidade com pouca pirotecnia. Fontes: [GitHub / zlib-rs](https://github.com/trifectatechfoundation/zlib-rs/releases/tag/v0.6.4) e [Phoronix](https://www.phoronix.com/news/zlib-rs-0.6.4).

- **postmarketOS v26.06 atualizou a base Alpine e as interfaces móveis.** A versão "Alpen Avocado" saiu em 21 de junho com Alpine Linux 3.24, GNOME 50, KDE Plasma Mobile 6.6.5, Phosh 0.55.0, volta do Plasma Bigscreen e troca do `pbsplash` pelo Plymouth. O próprio projeto lembra que o público esperado continua sendo entusiasta de Linux; quem espera polimento de Android ou iOS vai precisar de paciência. Fonte: [postmarketOS](https://postmarketos.org/blog/2026/06/21/v26.06-release/).

- **KDE Plasma 6.7 enfim separa desktops virtuais por tela.** A release oficial é de 16 de junho e traz uma melhoria antiga para quem usa vários monitores: trocar área de trabalho em uma tela sem bagunçar a outra. Também aparecem teste de volume do microfone, visibilidade de apps Flatpak em segundo plano, melhorias de impressão e o tema Union como preview desligado por padrão. Fontes: [KDE](https://kde.org/announcements/plasma/6/6.7.0/) e [Diolinux](https://diolinux.com.br/noticias/kde-plasma-6-7-21-anos.html).

## Acompanhamento de tendências do dia

O CivBench apareceu como um benchmark experimental usando Civilization VI para testar agentes em planejamento longo. O jogo serve como cenário; o teste real é sustentar objetivo por centenas de decisões, com ferramenta, memória e mudança de estado acontecendo no caminho.

O autor descreve cenários fixos, 76 ferramentas e um diário por turno para ajudar o agente a manter contexto. Também cita execuções longas, com 330 turnos e algo entre duas e oito horas de parede. A anedota da bomba nuclear chama atenção, claro, mas funciona melhor como ilustração de objetivo mal acompanhado do que como prova definitiva de perigo dos modelos.

Para quem monta agente de código, suporte ou automação, esse tipo de avaliação cutuca um lugar importante: benchmark de pergunta e resposta mede só uma fatia. Quando a ferramenta tem memória, ação e tempo, o teste precisa acompanhar plano, observação, correção de rota e erro acumulado. Por enquanto, trate CivBench como relato experimental de autor antes de qualquer ranking independente.

Fonte: [L. Wilko](https://www.lwilko.com/blog/i-gave-an-ai-a-civilization).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: none
source_mode: recent_curated_fallback
generated_at: 2026-06-22T05:39:19-03:00
fallback:
  reason: same_day_briefing_unusable_timeout_body
  window_start: 2026-06-21T08:17:55.000Z
  window_end: 2026-06-22T08:17:55.000Z
  candidate_article_ids_considered:
    - 721641
    - 721656
    - 721685
    - 721582
    - 721488
    - 721276
    - 721277
    - 721278
    - 721280
    - 721153
    - 721590
    - 721031
    - 720999
    - 720929
    - 720928
    - 720786
    - 720950
    - 720799
    - 720779
    - 720758
    - 720603
    - 720556
    - 720674
    - 720439
    - 720470
    - 720531
    - 720355
    - 720331
    - 720377
    - 720302
    - 720296
    - 720349
    - 720271
    - 720376
    - 720664
    - 720188
    - 720038
    - 721060
    - 720107
    - 719973
    - 719983
    - 719928
    - 720210
    - 719842
    - 719987
    - 719776
    - 719786
    - 719839
    - 719787
    - 719727
    - 719788
    - 719696
    - 719470
    - 719642
    - 719471
  selected_article_ids:
    - 720799
    - 720038
    - 719471
    - 720349
    - 721060
    - 721641
    - 721031
    - 720439
    - 720355
    - 721582
source_urls:
  - https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/
  - https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/
  - https://thenewstack.io/agentjacking-sentry-mcp-attack/
  - https://www.anthropic.com/engineering/how-we-contain-claude
  - https://www.anthropic.com/engineering/claude-code-auto-mode
  - https://labs.ripe.net/author/mkoch/forward-to-hell-on-misusing-transparent-dns-forwarders-for-amplification-attacks/
  - https://arxiv.org/abs/2510.18572
  - https://blog.xlab.qianxin.com/arystinger-botnet-hijacks-legacy-routers-for-global-attacks-en/
  - https://www.bleepingcomputer.com/news/security/arystinger-botnet-infected-thousands-of-d-link-routers-worldwide/
  - https://thehackernews.com/2026/06/arystinger-malware-infects-4300-legacy.html
  - https://support.claude.com/en/articles/14328960-identity-verification-on-claude
  - https://simonwillison.net/2026/Jun/21/sqlite-utils-40rc1/
  - https://github.com/trifectatechfoundation/zlib-rs/releases/tag/v0.6.4
  - https://www.phoronix.com/news/zlib-rs-0.6.4
  - https://postmarketos.org/blog/2026/06/21/v26.06-release/
  - https://kde.org/announcements/plasma/6/6.7.0/
  - https://diolinux.com.br/noticias/kde-plasma-6-7-21-anos.html
  - https://www.lwilko.com/blog/i-gave-an-ai-a-civilization
omitted_briefing_items:
  - none: source_mode recent_curated_fallback; same-day briefing body was unusable timeout text and was not used.
-->
