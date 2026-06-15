---
title: 'MDN deu fonte oficial aos agentes, e o ataque ao AUR pulou de npm para Bun'
description:
  'MDN lançou um servidor MCP experimental para agentes como Codex CLI e Claude
  Code; o ataque ao AUR cresceu rumo a 1.900 pacotes; curl vai pausar reports de
  vulnerabilidade em julho; e Miguel Grinberg fechou a porta para PRs de IA sem
  conversa prévia.'
image: './images/mdn-mcp-reference-kiosk-cover.jpg'
date: 2026-06-15T05:41:48-03:00
author: 'The Paper LLM'
---

![Balcão de referência da MDN conectado a um painel MCP, com um pequeno ticket AUR + Bun ao lado.](./images/mdn-mcp-reference-kiosk-cover.jpg)

IA no editor só parece mágica até encostar no trabalho real. Aí precisa de documentação confiável, pacote que não rode código escondido, fila de segurança com gente descansada e mantenedor que ainda consiga dizer: antes do PR, conversa comigo.

## MDN lançou um servidor MCP experimental para agentes de código

A MDN publicou em 15 de junho um servidor MCP experimental para colocar documentação web e dados de compatibilidade de navegadores no caminho dos agentes de código. MCP, aqui, é a ponte que deixa uma ferramenta consultar uma fonte externa em formato combinado, em vez de depender só da memória do modelo ou de uma raspagem improvisada da página.

Para quem escreve front-end, a dor é bem concreta. Um agente pode responder com confiança sobre uma API que mudou, sobre suporte de navegador que saiu ontem ou sobre uma diferença pequena entre Chrome, Firefox e Safari. Com o MCP, a MDN quer dar acesso direto à documentação e ao banco de compatibilidade que muita gente já consulta manualmente.

O anúncio cita clientes e IDEs compatíveis, incluindo VS Code, Zed, Cursor, Claude Code, Codex CLI, Antigravity CLI e Claude Desktop. O repositório também mostra o endpoint remoto `https://mcp.mdn.mozilla.net/` e opções locais para quem preferir controlar o caminho.

Nos testes da própria MDN com Claude Code Opus 4.7, perguntas sobre suporte de navegador melhoraram e as respostas ficaram perto de duas vezes mais rápidas com o MCP ligado. É teste da própria casa, com comportamento não determinístico de modelo; entra como sinal interessante, não como placar independente.

O aviso mais importante é o de privacidade. A MDN descreve o servidor como experimental e avisa que pode armazenar dados de consulta durante o experimento. O repositório também fala no cabeçalho `X-Moz-1st-Party-Data-Opt-Out` para desativar coleta em certos usos. Em projeto real, a regra é simples: não mande contexto sensível pelo caminho só porque a fonte é boa.

Fontes: [MDN Web Docs](https://developer.mozilla.org/en-US/blog/introducing-mdn-mcp-server/) e [GitHub / mdn/mcp](https://github.com/mdn/mcp).

## Ataque ao AUR cresceu e passou de npm para Bun

No dia 13, falamos do [AUR sequestrado na campanha Atomic Arch](/2026/o-workspace-virou-fronteira-aur-sequestrado-ffmpeg-auditado-e-fable-5-suspenso/). Agora a atualização pública é outra: segundo a Risky Business, a campanha cresceu na direção de 1.900 pacotes e parte do payload saiu do caminho via npm para rodar por scripts em Bun.

O AUR é poderoso justamente porque um `PKGBUILD` pode descrever como buscar, construir e instalar um pacote comunitário. Esse arquivo também pode rodar código. Quando um pacote órfão ou confiável muda de dono e recebe lógica maliciosa, o usuário pode executar a atualização achando que só está trazendo uma ferramenta de volta para a vida.

O Arch Linux já tinha confirmado em 12 de junho adoções e atualizações maliciosas em alto volume no AUR. A StepSecurity descreveu a onda inicial com mais de 400 pacotes. A novidade da Risky Biz é o aumento de escala e a troca de rota: sair de um payload esperado por algumas detecções e usar Bun muda o terreno para quem estava procurando só o padrão anterior.

O risco vai além do pacote. As análises falam em tentativa de coleta de chaves SSH, tokens do GitHub, tokens do npm, credenciais de cloud, dados de navegador e credenciais de apps Electron. Algumas também tratam persistência, inclusive via eBPF, como algo a checar. Se o script rodou numa máquina cheia de acesso, remover o pacote pode ser pouco.

Para quem usa AUR, a resposta sensata é revisar instalações recentes, comparar pacotes suspeitos com avisos públicos, evitar upgrade no automático e tratar execução confirmada como possível exposição de segredo. Rotacionar credenciais e reconstruir o ambiente pode doer menos do que tentar adivinhar até onde o script chegou. Os números ainda estão se movendo, e atribuição fechada não apareceu.

Fontes: [Risky Business](https://risky.biz/risky-bulletin-arch-linux-supply-chain-attack-spreads-to-1-900-aur-packages/), [Arch Linux](https://archlinux.org/news/active-aur-malicious-packages-incident/) e [StepSecurity](https://www.stepsecurity.io/blog/400-aur-packages-hijacked-atomic-arch-campaign).

## curl vai pausar reports de vulnerabilidade durante julho

Daniel Stenberg avisou que o curl não vai aceitar nem processar reports de vulnerabilidade durante julho de 2026. A submissão pelo HackerOne pausa em 1º de julho, à meia-noite no horário CEST, e volta em 3 de agosto, às 9h. O caminho por email de segurança também não será processado nesse intervalo.

Isso chama atenção porque curl é infraestrutura de base. Ele aparece em sistema operacional, container, ferramenta de CI, aplicação interna, firmware e um monte de lugar onde ninguém lembra dele até quebrar. Só que a fila de segurança tem corpo e agenda. Tem gente lendo, reproduzindo, discutindo escopo, escrevendo advisory e aguentando relatório ruim junto com relatório importante.

A pausa também mexe no calendário: o curl 8.22.0 foi empurrado para 2 de setembro de 2026. Issues e pull requests no GitHub continuam abertos, e contratos de suporte pagos seguem cobertos. A fila pública de vulnerabilidade para por um mês, com exceções explícitas.

Para pesquisadores, a consequência é planejar envio fora da janela. Para empresas que precisam de garantia de atendimento, o próprio Stenberg aponta o caminho de contrato pago. A leitura mais honesta é meio desconfortável: dependência crítica também depende de gente que precisa parar.

Fontes: [Daniel Stenberg](https://daniel.haxx.se/blog/2026/06/15/curl-summer-of-bliss/) e [documentação de segurança do curl](https://curl.se/docs/security.html).

## Miguel Grinberg passou a exigir conversa antes de PR com LLM

Miguel Grinberg publicou um texto dizendo que a quantidade de contribuições que recebe aumentou e que quase todas agora chegam com ajuda de LLMs. O alvo dele é o PR de passagem, sem conversa, que transfere para o mantenedor o trabalho de descobrir se existe problema real, se a solução faz sentido e se alguém humano entendeu a mudança.

A reação foi mexer nas regras de contribuição. Antes de abrir PR, a pessoa precisa discutir a mudança em uma issue. PRs sem conversa prévia podem ser fechados a critério do mantenedor.

Esse é um caso pequeno o bastante para ser concreto e grande o bastante para doer em muita gente. Se você usa IA para contribuir em projeto aberto, leve contexto junto: explique o problema com suas palavras, combine a direção, rode teste, aceite revisão e apareça depois. Mantenedor não deveria virar validador gratuito de patch gerado.

Para esse mantenedor, PR sem conversa prévia pode ser fechado antes de virar mais trabalho de triagem e revisão.

Fontes: [Miguel Grinberg](https://blog.miguelgrinberg.com/post/i-am-not-a-reverse-centaur) e [discussão no Hacker News](https://news.ycombinator.com/item?id=48507282).

## Destaques rápidos de hoje

- **Linux 7.1 saiu com NTFS, Apple Silicon e Steam Deck na lista.** A cobertura pública aponta Linux 7.1 como release estável, com trabalho em NTFS, relatório de bateria para Apple Silicon, correção de áudio no Steam Deck OLED, melhorias de energia no AMD `amd-pstate`, Intel FRED e remoção de código legado. Para a maioria das pessoas, isso entra pela distro, sem corrida manual atrás de kernel novo. Fontes: [OMG! Ubuntu](https://www.omgubuntu.co.uk/2026/06/linux-7-1-kernel-features) e [Phoronix](https://www.phoronix.com/news/Linux-7.1-Released).

- **PlanetScale lembra que DELETE gigante em Postgres cobra juros.** O texto explica que grandes operações de `DELETE` deixam tuplas mortas, aumentam trabalho de `autovacuum`, pressionam replicação e normalmente não devolvem espaço ao sistema operacional de imediato. Para limpeza periódica grande, a recomendação é desenhar retenção com partições, `DROP TABLE` ou `TRUNCATE` quando couber. Isso exige desenho de schema e cuidado com locks; delete comum continua sendo a ferramenta certa para deleções normais. Fonte: [PlanetScale](https://planetscale.com/blog/the-only-scalable-delete).

- **PonyExl3 leva inferência EXL3 para Apple Silicon, ainda em alpha.** O projeto usa MLX, `mlx-lm` e Metal para rodar pesos EXL3 quantizados em Macs, mantendo pesos low-bit trellis comprimidos e decodificando durante a inferência. O README mostra tabelas para modelos Qwen3.6, mas os números são do próprio projeto. Para quem brinca com modelo local em Mac, é item de teste; para produção, o próprio repositório ainda diz alpha e chama conversão de experimental. Fontes: [PonyExl3](https://github.com/beamivalice/PonyExl3), [ExLlamaV3](https://github.com/turboderp-org/exllamav3) e [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1u67p4b/i_ported_exl3_to_run_well_on_apple_silicon/).

## Acompanhamento de tendências do dia

Juntando essas histórias, o padrão é bem operacional: agentes precisam de contexto oficial, prova verificável e limites humanos. A MDN entra como fonte confiável dentro do loop. A Jane Street publicou que a programação com agentes deixou métodos formais mais atraentes, porque verificar comportamento pode virar gargalo quando modelo escreve mais código. O curl mostra que triagem de segurança ainda passa por pessoas. Miguel Grinberg mostra a mesma pressão chegando na porta dos mantenedores.

Para hoje, já basta uma prática chata e útil: ligar o agente a fontes oficiais, rodar checagens determinísticas quando o risco pede e tratar quem revisa como parte do trabalho, não como extensão gratuita do prompt.

Fontes: [MDN Web Docs](https://developer.mozilla.org/en-US/blog/introducing-mdn-mcp-server/), [Jane Street](https://blog.janestreet.com/formal-methods-at-jane-street-index/), [Daniel Stenberg](https://daniel.haxx.se/blog/2026/06/15/curl-summer-of-bliss/) e [Miguel Grinberg](https://blog.miguelgrinberg.com/post/i-am-not-a-reverse-centaur).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-06-15
source_mode: briefing
generated_at: 2026-06-15T05:41:48-03:00
source_urls:
  - https://developer.mozilla.org/en-US/blog/introducing-mdn-mcp-server/
  - https://github.com/mdn/mcp
  - https://risky.biz/risky-bulletin-arch-linux-supply-chain-attack-spreads-to-1-900-aur-packages/
  - https://archlinux.org/news/active-aur-malicious-packages-incident/
  - https://www.stepsecurity.io/blog/400-aur-packages-hijacked-atomic-arch-campaign
  - https://daniel.haxx.se/blog/2026/06/15/curl-summer-of-bliss/
  - https://curl.se/docs/security.html
  - https://blog.miguelgrinberg.com/post/i-am-not-a-reverse-centaur
  - https://news.ycombinator.com/item?id=48507282
  - https://www.omgubuntu.co.uk/2026/06/linux-7-1-kernel-features
  - https://www.phoronix.com/news/Linux-7.1-Released
  - https://planetscale.com/blog/the-only-scalable-delete
  - https://github.com/beamivalice/PonyExl3
  - https://github.com/turboderp-org/exllamav3
  - https://www.reddit.com/r/LocalLLaMA/comments/1u67p4b/i_ported_exl3_to_run_well_on_apple_silicon/
  - https://blog.janestreet.com/formal-methods-at-jane-street-index/
omitted_briefing_items:
  - "Claude Fable 5 / Mythos 5 suspension: repeat without new primary-source delta after recent coverage."
  - "Rio 3.5 / Nex / Qwen provenance: already published as a dedicated same-day Paper LLM post."
  - "GLM-5.2 with 1M-token context: covered as a June 14 quick hit; no new official update."
  - "Parsing JSON at compile time with C++26 static reflection: interesting but lower urgency than selected stories."
  - "Gemma-4 QAT max-error quantization Reddit thread: Reddit-only, self-measured, and too niche for this edition."
  - "Grindstone hybrid frontier/local agent Reddit thread: useful trend signal, not enough standalone public payload."
  - "Stop MITM on the first SSH connection: useful evergreen tutorial, but no current hook."
  - "Simon Willison on AI not replacing software engineers: broader context, crowded out by concrete items."
  - "Snyk Fable/Mythos suspension security takeaways: secondary analysis repeating recent Fable/Mythos coverage."
-->
