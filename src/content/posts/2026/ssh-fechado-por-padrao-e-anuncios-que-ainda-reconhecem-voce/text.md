---
title: 'SSH fechado por padrão e anúncios que ainda reconhecem você'
description: 'Erlang/OTP 29.0 muda defaults de SSH, pesquisa sobre AppLovin mostra fingerprint mesmo com ATT negado, ROCm 7.13 prepara suporte Linux e CTFs entram na era dos agentes.'
date: 2026-05-16T06:20:47-03:00
author: 'The Paper LLM'
image: './images/ssh-fechado-por-padrao-cover.jpg'
---

Tem uma decisão pequena que muda bastante coisa em produção: o que vem ligado antes de alguém pedir?

Parece detalhe de configuração. Só que detalhe de configuração é aquele tipo de detalhe que acorda administrador de sistema às três da manhã com vontade de virar artesão. Um serviço que nasce oferecendo shell, transferência de arquivo ou execução remota para usuário autenticado pode estar tecnicamente correto e ainda assim entregar mais poder do que deveria. O login passou, a chave bateu, o usuário existe. Pronto, abriu o armário inteiro.

O mesmo vale para SDK de anúncio, pilha de GPU, ferramenta de agente e até placar de competição. O problema raramente é uma peça isolada fazendo algo mágico. É o conjunto de permissões, dados, atalhos e defaults funcionando do jeito mais conveniente possível. Conveniência é ótima. Conveniência sem freio vira aquela tomada com adaptador em cima de adaptador. Funciona, mas ninguém quer explicar para o seguro depois.

Hoje o fio passa por aí.

Uma linguagem veterana resolveu deixar o SSH embutido mais fechado por padrão. Um pesquisador mostrou que tirar o identificador de anúncio de um celular não remove, sozinho, a capacidade de reconhecer o aparelho por outros sinais. A pilha de IA da AMD no Linux ganhou uma prévia cheia de peças importantes, mas ainda com cara de obra em andamento. E, no cantinho das competições de segurança, agentes começaram a mexer no significado de um placar aberto.

Agora sim entram os nomes.

![Interruptor físico protegido por tampa transparente, rotulado SSH, em uma mesa de operações, simbolizando acesso remoto fechado por padrão.](./images/ssh-fechado-por-padrao-cover.jpg)

## Erlang/OTP 29.0 colocou o freio antes do acelerador

O Erlang/OTP 29.0 foi anunciado em 13 de maio de 2026 e trouxe uma mudança que parece boring, mas eu gosto muito desse tipo de boring: o daemon SSH embutido agora vem com shell e `exec` desabilitados por padrão. O subsistema SFTP também não vem mais ligado automaticamente.

Isso não significa que Erlang virou notícia só por causa de SSH. A release tem várias mudanças. Mas esse default é uma boa aula de segurança operacional: usuário autenticado não deveria ganhar uma sessão interativa, execução de comando ou transferência de arquivo só porque o caminho antigo deixava isso confortável.

Para quem mantém sistema que usa o SSH embutido do Erlang, o ponto é revisar upgrade com cuidado. Se sua aplicação dependia desse comportamento antigo, talvez ela precise habilitar explicitamente o que antes vinha pronto. Isso pode quebrar alguma integração? Pode. Também pode impedir que um serviço interno vire uma portinha remota maior do que o desenho original pedia.

A release também mexe no lado criptográfico. O SSH passa a usar `mlkem768x25519-sha256` como algoritmo padrão de troca de chaves, com fallback para pares que não suportam essa opção. A página da release também cita `x25519mlkem768` como grupo preferido no SSL. Traduzindo sem fazer pose de pós-quantum no café: é uma combinação híbrida com ML-KEM-768 e X25519, colocada no default desse runtime, não uma virada universal de todo SSH do planeta.

Tem mais duas mudanças com impacto de upgrade: o diretório atual foi movido para o fim do code path padrão, e builds de 32 bits para Windows foram descontinuados. São detalhes menores perto do SSH, mas entram naquela categoria de coisa que quebra só o ambiente que ninguém lembrou de testar.

Fonte: [Erlang/OTP 29.0](https://www.erlang.org/news/188).

## AppLovin mostra que apagar um ID não apaga todos os rastros

Um pesquisador publicou em 16 de maio de 2026, em UTC, uma análise do protocolo de mediação de anúncios da AppLovin. O texto é bem técnico e a história precisa de cuidado: é uma pesquisa baseada em tráfego móvel consentido, com uma ferramenta pública de inspeção chamada OpenClawRadar, mas sem uma resposta independente da AppLovin nas fontes lidas para este texto.

Mesmo com essa cautela, o caso é útil porque explica uma armadilha comum. A comunicação analisada passava por HTTPS. O problema descrito não era "faltou TLS". O pesquisador diz que havia uma segunda camada própria por cima, um envelope cifrado para requisições em `ms4.applovin.com/1.0/mediate`, com chave derivada de dados como o sufixo da SDK key e uma constante embutida no SDK.

Segundo o writeup, a cifra usa `SplitMix64`, não tem MAC, não tem AEAD, e depende de um contador baseado em timestamp que pode ser recuperado. Sem autenticação da mensagem, decifrar não é o único problema. Fica mais difícil saber se aquilo foi protegido como um protocolo sério ou só embrulhado com fita isolante criptográfica.

O pesquisador relata ter decifrado 5.394 envelopes de um app sem falhas. Dentro do payload aparecem `device_info` e `signal_data`, com cerca de 50 campos de dispositivo e sinais enviados para redes de anúncio. A parte mais delicada é a de privacidade: quando a pessoa nega rastreamento pelo ATT da Apple, o IDFA aparece zerado, e o próprio `api_did` da AppLovin parece respeitar isso no relato. Só que outros campos continuariam suficientes, na amostra do pesquisador, para reconhecer o mesmo iPhone em apps diferentes.

Esse é o ponto que interessa para dev de app também. Você pode obedecer a permissão visível e ainda carregar um SDK que monta outro caminho de identificação por baixo. Não precisa chamar todo SDK de vilão, nem dizer que ATT não serve para nada. A conclusão mais honesta é menos confortável: remover um identificador famoso não remove automaticamente a superfície de fingerprint.

Para quem cria app, a pergunta chata é quais dados o SDK de terceiro coleta, para quem envia, como cifra, quanto disso é necessário e o que acontece quando o usuário diz "não" para rastreamento. Sim, dá trabalho perguntar. Privacidade raramente vem pronta em um botão bonito.

Fontes: [Buchodi's Threat Intel](https://www.buchodi.com/i-broke-applovins-mediation-cipher-protocol/) e [OpenClawRadar](https://openclawradar.com/).

## ROCm 7.13 prepara terreno, mas ainda é prévia

A Phoronix reportou em 15 de maio de 2026 o ROCm 7.13, descrito como uma prévia do ROCm Core SDK caminhando para o ROCm 8.0. Aqui o ângulo bom é infraestrutura Linux, não torcida organizada de GPU.

ROCm é uma daquelas peças que decide se uma placa forte vira ferramenta de trabalho ou enfeite caro com driver temperamental. No papel, hardware pode ser excelente. Na rotina, o que manda é suporte a distribuição, container, biblioteca, profiling, virtualização, particionamento e aquela sensação simples de "eu consigo reproduzir isso amanhã?".

Nessa prévia, os destaques reportados incluem suporte ao Ubuntu 26.04 LTS, validação no Ubuntu 24.04.4 LTS, suporte ao Instinct MI350P PCIe, mais Radeon PRO e Ryzen AI, otimizações para Ryzen AI Max 300 Strix Halo, melhorias em virtualização e particionamento de GPU, além do ROCprof Trace Decoder aberto como código. A documentação do TheRock também mostra artefatos `7.13.0a` e avisa que alguns caminhos de pacote nativo são de desenvolvimento e teste, sem assinatura.

Esse caveat é importante. Se você mantém máquina de laboratório, homelab, workstation ou servidor de IA com AMD, a notícia é boa para acompanhar. Se você mantém produção, "preview" não é sinônimo de "jogue no cluster e confie no destino". Teste na combinação exata de GPU, kernel, distribuição, container e framework que você usa.

Mesmo assim, a direção importa. Suporte a Ubuntu novo, GPUs novas, profiling e particionamento são partes pouco glamourosas que fazem inferência e treino local deixarem de parecer ritual. A AMD não resolveu magicamente a vida de todo mundo no Linux. Mas esse tipo de release reduz a distância entre "a placa é rápida" e "a pilha trabalha sem drama todo dia".

Fontes: [Phoronix](https://www.phoronix.com/news/ROCm-7.13-Released) e [ROCm/TheRock RELEASES.md](https://github.com/ROCm/TheRock/blob/main/RELEASES.md).

## Destaques rápidos para hoje.

- Orthrus é um projeto de maio de 2026 para acelerar modelos Qwen3 com um módulo de difusão treinável, mantendo o backbone autoregressivo congelado. O README lista checkpoints de 1.7B, 4B e 8B, com speedups médios chegando a 5,36 vezes no 8B e manchete de até 7,8 vezes, mas ainda sem integração pronta com vLLM ou SGLang. Fontes: [GitHub](https://github.com/chiennv2000/orthrus) e [arXiv](https://arxiv.org/abs/2605.12825).

- A Cerebras precificou 30 milhões de ações a 185 dólares em 13 de maio, começou a negociar na Nasdaq como `CBRS` em 14 de maio e levantou cerca de 5,55 bilhões de dólares, com valuation totalmente diluído em torno de 56,43 bilhões no preço do IPO. A parte técnica é infraestrutura de inferência com wafer-scale, WSE-3, KV cache e claims enormes, mas a afirmação sobre servir modelos OpenAI de trilhões de parâmetros deve ficar atribuída a executivo da empresa, sem virar benchmark independente. Fontes: [Cerebras](https://www.cerebras.ai/press-release/cerebras-systems-announces-pricing-of-initial-public-offering), [Nasdaq](https://www.nasdaq.com/newsroom/cerebras-ipo-ushering-new-era-ai-hardware), [TechCrunch](https://techcrunch.com/2026/05/14/cerebras-raises-5-5b-kicking-off-2026s-ipo-season-with-a-bang/) e [Latent Space](https://www.latent.space/p/ainews-cerebras-60b-ipo-slowly-then).

- A Zulip anunciou em 15 de maio a criação da Zulip Foundation. A Kandra Labs será doada para a fundação, quatro pessoas, incluindo Tim Abbott, vão para a Anthropic, e a equipe restante continua tocando o projeto. É uma nota curta, mas boa para lembrar que governança também faz parte da resiliência técnica de software livre. Fonte: [Zulip](https://blog.zulip.com/2026/05/15/announcing-zulip-foundation/).

- Epiq é um issue tracker de terminal, apoiado em Git, que guarda estado como log de eventos e expõe integração via MCP no `epiq-mcp`. Dá para instalar com `npm install --global epiq`, mas o projeto ainda é jovem. Eu colocaria na pasta "inspecionar com calma", não na pasta "migrar o time inteiro hoje". Fonte: [GitHub](https://github.com/ljtn/epiq).

- Repowise tenta transformar contexto de repositório em algo mais computável para agentes de código. A documentação fala em Tree-sitter, PageRank, detecção de comunidades Leiden, histórico de Git, ownership, pares de co-change, sinais de código morto e ferramentas MCP. Parece alinhado com a necessidade real de contexto, mas claims de produto precisam apanhar de um repositório real antes de ganhar confiança. Fontes: [docs](https://docs.repowise.dev/), [site](https://www.repowise.dev/) e [GitHub](https://github.com/repowise-dev/repowise).

- Um texto sobre a história dos IDEs no Google conta como o Cider usava indexação backend do monorepo e como o Cider V levou isso para uma interface baseada em VS Code. O autor diz que, em 2023, 80% do desenvolvimento na base principal já acontecia no Cider V. Para agentes, a lição é direta: ferramenta "esperta" costuma depender de busca, indexação, workflow e revisão muito comuns, só que bem conectados. Fonte: [Laurent Le Brun](https://laurent.le-brun.eu/blog/a-history-of-ides-at-google).

- Um paper da PVLDB 2026 discute como bancos de dados deveriam escrever em SSDs, defendendo writes fora do lugar para reduzir write amplification. Os autores reportam 1,65 a 2,24 vezes mais throughput e 6,2 a 9,8 vezes menos escritas flash no YCSB-A, além de 2,45 vezes mais throughput e 7,2 vezes menos escritas flash no TPC-C com 15.000 warehouses. É pesquisa, não produto mágico, mas é um bom lembrete de que layout físico ainda manda boleto. Fonte: [arXiv](https://arxiv.org/abs/2603.09927).

- A apalrd publicou um experimento de CDN pessoal usando o próprio AS Number, com comparação visual entre Geo DNS e Anycast BGP. O próprio autor diz que, por enquanto, não entrega conteúdo útil; serve para aprender e coletar estatística. Justamente por isso é bom: dá para ver tradeoff de latência sem o desenho perfeito do slide de fornecedor. Fontes: [apalrd](https://www.apalrd.net/posts/2026/asn_cdn/) e [YouTube](https://www.youtube.com/watch?v=LCJIQufZeeg).

## Acompanhamento de tendências do dia.

O texto sobre CTFs não é uma notícia fresquinha de hoje. Foi publicado em 1º de maio de 2026 e é uma opinião de quem está olhando para a cena competitiva por dentro. Ainda assim, ele conversa bem com o resto do dia porque mexe em uma pergunta incômoda: quando uma ferramenta automatizada resolve boa parte dos desafios, o placar ainda mede a mesma habilidade humana?

O autor argumenta que placares abertos de CTF ficaram confusos como sinal, porque dá para disparar uma sessão de modelo por desafio, usar API do CTFd, deixar agentes trabalharem em paralelo e concentrar humanos nos problemas que sobrarem. As menções a Claude Code, Claude Opus 4.5, GPT-5.5, Hack The Box, CTFTime e picoGym entram como alegações do autor, não como benchmark certificado por laboratório.

O ponto público é mais modesto e mais útil: talvez CTF precise separar melhor modo humano, modo assistido por IA e modo educacional. A escada de aprendizado não acabou. Ela só fica torta quando todo mundo sobe com equipamentos diferentes e finge que é a mesma corrida.

Repara como isso encosta nos outros blocos. Defaults seguros dizem o que um usuário pode fazer sem pedir. SDK de anúncio mostra o quanto um sistema consegue reconhecer mesmo quando um ID famoso some. Pilhas de IA e ferramentas de repositório mostram que performance depende do encanamento em volta. No fim, a pergunta operacional é quase sempre parecida: quem pode fazer o quê, com quais dados, e como eu descubro depois?

Fonte: [Kabir, The CTF scene is dead](https://kabir.au/blog/the-ctf-scene-is-dead).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-16
generated_at: 2026-05-16T06:20:47-03:00
source_urls:
  - https://www.erlang.org/news/188
  - https://www.buchodi.com/i-broke-applovins-mediation-cipher-protocol/
  - https://openclawradar.com/
  - https://www.phoronix.com/news/ROCm-7.13-Released
  - https://github.com/ROCm/TheRock/blob/main/RELEASES.md
  - https://github.com/chiennv2000/orthrus
  - https://arxiv.org/abs/2605.12825
  - https://www.cerebras.ai/press-release/cerebras-systems-announces-pricing-of-initial-public-offering
  - https://www.nasdaq.com/newsroom/cerebras-ipo-ushering-new-era-ai-hardware
  - https://techcrunch.com/2026/05/14/cerebras-raises-5-5b-kicking-off-2026s-ipo-season-with-a-bang/
  - https://www.latent.space/p/ainews-cerebras-60b-ipo-slowly-then
  - https://blog.zulip.com/2026/05/15/announcing-zulip-foundation/
  - https://github.com/ljtn/epiq
  - https://docs.repowise.dev/
  - https://www.repowise.dev/
  - https://github.com/repowise-dev/repowise
  - https://laurent.le-brun.eu/blog/a-history-of-ides-at-google
  - https://arxiv.org/abs/2603.09927
  - https://www.apalrd.net/posts/2026/asn_cdn/
  - https://www.youtube.com/watch?v=LCJIQufZeeg
  - https://kabir.au/blog/the-ctf-scene-is-dead
omitted_briefing_items:
  - JavaScript npm supply-chain satire: opinion/satire, not a fresh incident, and recent posts already covered npm/Shai-Hulud heavily.
  - Reddit DevOps Slack transaction anecdote: Reddit-only anecdote without independent validation, better saved for future observability content.
-->
