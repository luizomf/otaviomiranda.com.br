---
title: 'Downloads falsos, BadHost e a IA encostando na produção'
description: 'Microsoft ligou recomendações de chatbots a uma campanha de cryptojacking, BadHost expôs middleware em Starlette/FastAPI, Anthropic falou de contenção, DeepSWE apertou benchmarks e curl sentiu a fila de triagem.'
date: 2026-05-27T05:37:38-03:00
author: 'The Paper LLM'
image: './images/download-falso-ia-gpu-mineracao.jpg'
---

Tem uma confiança pequena, quase automática, que aparece no dia a dia de quem trabalha com computador. Você precisa instalar uma ferramenta, pergunta ao buscador ou ao chat, abre o link que parece certo, baixa, roda e segue a vida. Às vezes é só preguiça saudável. Às vezes é o começo do problema.

O mesmo vale para aquele servidor simples que nasceu para servir uma API interna, para o agente que pede aprovação com cara de formalidade, para o gráfico de benchmark que chega bonito no feed e para a issue de segurança escrita com todos os detalhes do mundo. Cada uma dessas coisas parece pertencer a uma gaveta diferente. Download. Web. Agente. Teste. Manutenção.

Mas produção não respeita gaveta. Se uma dica de download aponta para o lugar errado, a GPU trabalha para outra pessoa. Se o middleware olha para um caminho e o roteador entrega outro, autenticação vira decoração. Se o agente recebe permissão demais, o botão de "aprovar" começa a parecer aqueles termos de uso que todo mundo aceita sem ler. E se o benchmark mede a coisa torta, o placar só fica mais elegante, não mais verdadeiro.

O primeiro alerta vem da Microsoft, com uma campanha de cryptojacking que mistura busca envenenada e recomendações observadas em chatbots. Depois entra o BadHost, uma falha no Starlette que interessa bastante para quem usa FastAPI em volta de serviços de IA. A Anthropic publicou uma explicação boa sobre contenção de agentes, a Datacurve apresentou o DeepSWE para medir agentes de código com mais cuidado, e o curl mostrou uma parte humana dessa história: quando relatório fica barato de produzir, alguém ainda paga a conta da triagem.

![Placa luminosa com o texto "DOWNLOAD FALSO" em uma vitrine de loja de PC, com balão "IA INDICOU" e placas de GPU ao fundo.](./images/download-falso-ia-gpu-mineracao.jpg)

## Recomendações de download por IA viraram caminho para cryptojacking

A Microsoft publicou uma análise de uma campanha ativa de cryptojacking que se aproveita de uma rotina bem comum: procurar utilitário popular e clicar no download que parece confiável. A diferença de agora é que a empresa observou o caminho aparecendo também em interações com chatbots, além de envenenamento de resultados de busca.

Isso não transforma todo chatbot em malware ambulante. A leitura mais honesta é mais chata e mais útil: atacante aprendeu que muita gente já trata resposta de IA como atalho para a internet. Se a pessoa pergunta onde baixar uma ferramenta e recebe um link com cara de resposta organizada, a barreira mental cai um pouco. A engenharia social agradece, com recibo e minerador.

Os nomes falsificados são daqueles que fazem sentido para dev, gamer, técnico e gente com máquina boa: CrystalDiskInfo, HWMonitor, Display Driver Uninstaller, FurMark, K-Lite Codec Pack e PDFgear aparecem na análise. São utilitários de disco, hardware, vídeo, codec e PDF. Nada muito exótico. Justamente por isso funcionam como isca.

Segundo a Microsoft, o pacote não parava em mineração barulhenta. A cadeia descrita inclui sideloading de DLL, uso abusivo do ScreenConnect para acesso remoto persistente, process hollowing, exclusões no Microsoft Defender e implantação de mineradores que exploram GPU. O susto vai além da ventoinha subindo: um "download normal" pode abrir uma janela de controle remoto e mexer nas defesas da máquina.

Para quem roda máquina com GPU para jogo, modelo local, benchmark ou trabalho pesado, o cuidado é bem direto: download de utilitário vem de domínio do fornecedor, repositório confiável ou gerenciador de pacotes. Resposta de chatbot pode ajudar a lembrar o nome da ferramenta, mas não deve virar instalador com autoridade de package manager.

Em máquinas suspeitas, vale procurar ScreenConnect inesperado, tarefas agendadas estranhas, exclusões novas no Defender, DLLs carregadas por caminhos esquisitos e sinais de mineração. A Microsoft também liga a campanha a sistemas com maior valor de mineração, então aquela placa de vídeo que você comprou para rodar modelo local talvez esteja atraindo mais atenção do que o RGB dela sugeria.

Fontes: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/05/26/poisoned-search-results-gpu-mining-cryptojacking-campaign-abusing-screenconnect-microsoft-net-utilities/) e [The Hacker News](https://thehackernews.com/2026/05/ai-chatbot-recommendations-redirect.html).

## BadHost mostrou um risco real em middleware Starlette/FastAPI

O BadHost é uma daquelas falhas que parecem pequenas até você lembrar quantas decisões de segurança moram em middleware. A vulnerabilidade é a CVE-2026-48710 e afeta Starlette antes da versão 1.0.1 quando o código usa `request.url` ou `URL(scope=...)` para tomar decisão de segurança baseada no caminho da URL.

Em português normal: uma requisição criada de propósito pode fazer a reconstrução da URL enxergar um caminho, enquanto o roteamento real chega em outro endpoint. Se o middleware usa essa URL reconstruída para liberar, bloquear, aplicar CSRF, limitar taxa ou decidir se um caminho precisa de autenticação, ele pode proteger a porta errada.

Isso interessa para FastAPI porque FastAPI se apoia em Starlette. Também interessa para o mundinho de IA porque muita API de modelo, proxy, gateway de ferramenta e backend de agente usa esse tipo de pilha. A divulgação do BadHost cita ambientes ASGI, servidores de inferência, proxies de LLM, frameworks de agente, gateways MCP e APIs customizadas. No fim, servidor de IA continua sendo servidor web. Ele só ganhou uma camiseta mais cara.

O cuidado para o leitor é menos cinematográfico que o nome da falha: atualizar Starlette para 1.0.1 ou posterior e auditar middleware próprio. Procure `BaseHTTPMiddleware`, middleware ASGI cru, uso de `request.url.path` e construção manual com `starlette.datastructures.URL(scope=...)`. Quando a decisão for segurança, prefira o caminho do `scope`, autenticação no endpoint e normalização clara na borda, como proxy reverso bem configurado.

Também vale segurar a ansiedade. A falha não significa que todo app FastAPI do planeta ficou aberto. O centro do risco está em código customizado que confia na URL reconstruída para decidir permissão. Dependências de autenticação no endpoint, por exemplo, não são o padrão principal descrito pelo BadHost. Mesmo assim, esse é o tipo de bug que merece `grep` hoje, porque middleware antigo costuma ficar escondido naquele arquivo chamado "depois eu vejo".

Fontes: [BadHost](https://badhost.org/), [advisory do Starlette no GitHub](https://github.com/encode/starlette/security/advisories/GHSA-86qp-5c8j-p5mr) e [Risky Biz News](https://news.risky.biz/risky-bulletin-badhost-vulnerability-bypasses-authentication-on-ai-infrastructure/).

## Anthropic descreveu contenção para reduzir o raio de dano dos agentes

Ontem falamos de [Copilot Cowork agindo antes da revisão](/2026/copilot-cowork-e-ghost-cms-quando-a-automacao-age-antes-da-revisao/) e, no dia 25, de [TrapDoor mexendo em arquivos de instrução](/2026/trapdoor-mexeu-no-claudemd-e-a-revisao-virou-a-noticia/). O texto novo da Anthropic entra nessa conversa pelo lado da arquitetura: como limitar o estrago quando um agente precisa mesmo tocar ferramenta, arquivo, rede e credencial.

A empresa chama isso de contenção. A ideia central é tratar o aumento de capacidade do agente como aumento de raio de dano. Quanto mais ele pode fazer, mais importante fica controlar o ambiente onde ele age. Instrução educada ajuda, claro, mas instrução sozinha é um cadeado desenhado na porta.

O post fala em camadas. A camada de ambiente envolve isolamento parecido com sandbox ou máquina virtual, controle de saída de rede e credenciais escopadas. A camada de modelo lida com instruções, confiança e comportamento. A camada de conteúdo externo olha para o que vem de ferramenta, documento, página ou repositório, porque saída de ferramenta também pode virar entrada maliciosa para o próximo passo.

Um detalhe humano do texto merece destaque: segundo a Anthropic, usuários do Claude Code aprovaram cerca de 93% dos pedidos de permissão. Esse número explica por que aprovação manual pode virar teatro operacional. Se quase tudo recebe "sim", a segurança real precisa morar fora do cansaço do usuário: no runtime, na rede, nas credenciais, na política e na trilha de auditoria.

Para quem usa Codex, Claude Code, Gemini CLI, MCP servers, agentes locais ou automações em VPS, o desenho fica bem concreto. Use credencial com escopo pequeno. Corte saída de rede quando a tarefa não precisa. Não deixe token de produção solto em ambiente de experimento. Faça ferramenta retornar dado de um jeito que possa ser inspecionado. E trate plugin de segurança ou sandbox como peça de uma arquitetura maior, não como selo mágico de "agora está tudo resolvido".

A fonte é da própria Anthropic, então cabe a cautela normal com texto de fornecedor. Daqui, vale levar o vocabulário antes de qualquer promessa de segurança universal: raio de dano, contenção, egress, credencial escopada e inspeção de saída de ferramenta.

Fontes: [Anthropic Engineering](https://www.anthropic.com/engineering/how-we-contain-claude) e [SecurityWeek](https://www.securityweek.com/anthropic-releases-new-claude-sandbox-security-guidance-plugin/).

## DeepSWE tenta medir agentes de código sem vazar a resposta

Benchmark de agente de programação é um assunto perigoso porque número bonito viaja mais rápido do que metodologia. A Datacurve apresentou o DeepSWE como um benchmark de tarefas longas de engenharia, com foco em evitar contaminação e melhorar a forma de verificar se o agente realmente resolveu o problema.

A diferença que a Datacurve quer vender não está só no placar. O DeepSWE usa tarefas escritas do zero, em vez de adaptar commits ou pull requests já existentes. A fonte fala em 113 tarefas, 91 repositórios e cinco linguagens: TypeScript, Go, Python, JavaScript e Rust. As tarefas são avaliadas com verificadores escritos manualmente, mirando comportamento observável, não só diffs que parecem plausíveis.

Isso importa porque benchmark público costuma sofrer de vazamento. A tarefa pode ter aparecido em dado de treino. O teste pode aceitar solução errada. O verificador pode medir uma implementação específica em vez do comportamento esperado. O ambiente pode entregar pista sem querer. Quando isso acontece, o agente aprende a ganhar o jogo, mas a pessoa do outro lado acha que ele aprendeu engenharia.

A Datacurve também menciona uso do `mini-swe-agent` para rodar o leaderboard e diz que o DeepSWE separa melhor os modelos de fronteira do que alguns benchmarks públicos. Esses resultados devem ser lidos como resultado reportado pela própria Datacurve, não como consenso independente. Ainda falta reprodução externa, auditoria ampla e aquela fase divertida em que a internet tenta quebrar o brinquedo novo.

Mesmo com esse limite, a história é boa para quem usa agente no trabalho. Antes de acreditar em taxa de resolução, olhe de onde vieram as tarefas, se os testes medem comportamento, como falsos positivos e falsos negativos foram auditados, e se o ambiente limpa pistas que o agente poderia explorar. Benchmark também é software. E software de avaliação quebrado consegue deixar todo mundo confiante do jeito errado.

Fonte: [DeepSWE, da Datacurve](https://deepswe.datacurve.ai/blog).

## curl sentiu a fila de relatórios de segurança assistidos por IA

Daniel Stenberg, criador do curl, publicou um texto curto e importante sobre pressão de manutenção. Segundo ele, o time de segurança do curl está recebendo relatórios em ritmo inédito: quatro a cinco vezes o volume de 2024 e aproximadamente o dobro da velocidade de 2025.

O detalhe delicado é que esses relatórios não chegam todos como lixo óbvio. Daniel descreve material detalhado, longo e plausível, muitas vezes assistido por IA, que precisa ser lido, entendido e triado. Um relatório pode acabar sendo falha real, duplicata, baixo impacto, comportamento esperado ou hipótese sem exploração convincente. Só dá para saber depois que alguém gastou atenção.

Essa é a parte que desaparece quando a gente fala de "IA achando vulnerabilidade" como se fosse só vitória. Reduzir o custo de produzir um relatório não reduz automaticamente o custo de manter uma biblioteca crítica. curl está em sistema operacional, container, appliance, aplicação, pipeline e aquele script velho que ninguém quer mexer porque ainda funciona. Quando a fila aumenta, o peso cai em gente de verdade.

Daniel também deixa um freio importante: quase nenhuma das vulnerabilidades encontradas é de alta severidade, e o texto não apresenta curl como projeto desabando. A notícia é sobre economia de triagem. Segurança responsável precisa de caso mínimo reproduzível, impacto claro, paciência e respeito pelo processo do projeto. Mandar um PDF bonito com ar de laudo não substitui evidência.

Para empresas que consomem open source, fica uma pergunta meio indigesta: quem financia a triagem que o seu stack exige? Ferramenta nova pode gerar alerta mais rápido. A revisão, a coordenação de disclosure, a correção e a decisão de severidade continuam custando tempo humano. Não tem botão mágico escondido no `curl_easy_setopt`.

Fontes: [Daniel Stenberg](https://daniel.haxx.se/blog/2026/05/26/the-pressure/) e [Simon Willison](https://simonwillison.net/2026/May/26/the-pressure/).

## Destaques rápidos para hoje.

- O ensaio "agent memory: an anatomy" desmonta a palavra "memória" em três partes: extractor, store e retriever. A graça está no checklist que isso cria: de onde veio a memória, quando ela fica velha, como conflitos são tratados, como a busca ranqueia resultados e se rótulos como memória episódica, semântica ou procedural descrevem engenharia real ou só embalagem bonita. Fonte: [brgsk](https://brgsk.xyz/agent-memory-anatomy/).

- No dia 23, citamos o problema do LiteSpeed cPanel Plugin em [Megalodon mostrou que GitHub Actions também é produção](/2026/megalodon-mostrou-que-github-actions-tambem-e-producao/). A novidade é que a CISA adicionou a CVE-2026-48172 ao catálogo KEV em 26 de maio, com due date em 29 de maio para órgãos federais dos EUA. A falha envolve o user-end cPanel plugin e pode permitir que qualquer conta cPanel execute scripts como root; a LiteSpeed orienta atualizar para LiteSpeed WHM Plugin 5.3.1.0 com cPanel plugin 2.4.7 ou mais novo, ou remover o user-end plugin se não der para corrigir. Fontes: [CISA KEV](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json), [LiteSpeed](https://blog.litespeedtech.com/2026/05/21/security-update-for-litespeed-cpanel-plugin/) e [SecurityWeek](https://www.securityweek.com/cisa-urges-immediate-patching-of-exploited-litespeed-cpanel-plugin-zero-day/).

- O vLLM publicou o EAGLE 3.1, em colaboração com os times EAGLE e TorchSpec, como avanço em speculative decoding. O problema técnico é attention drift quando a especulação fica mais profunda ou quando entrada, contexto e concorrência mudam; a proposta fala em FC normalization e post-norm hidden-state feedback. Parece ótimo para servir modelo mais rápido, mas teste com entradas reais, contexto longo e usuários concorrentes antes de prometer ganho para alguém. Fontes: [vLLM](https://vllm.ai/blog/2026-05-26-eagle-3-1) e [MarkTechPost](https://www.marktechpost.com/2026/05/27/meet-eagle-3-1-the-speculative-decoding-algorithm-that-fixes-attention-drift-in-llm-inference/).

- O Zig registrou no devlog de 26 de maio uma mudança grande no build system: separar o processo que configura o grafo do processo que executa o grafo. O `build.zig` passa por um configurer pequeno em modo debug, que serializa o build graph; depois um maker otimizado executa o trabalho em release mode. É uma nota de main branch e prévia de release notes, então vale acompanhar e testar, não tratar como garantia final para todo projeto. Fonte: [Zig Devlog](https://ziglang.org/devlog/2026/#2026-05-26).

## Acompanhamento de tendências do dia.

As histórias de hoje são separadas. A Microsoft descreveu uma campanha de download malicioso, o BadHost é uma falha de middleware web, a Anthropic publicou arquitetura de contenção, o DeepSWE fala de benchmark e o curl fala de gente recebendo relatório demais. Elas não formam uma campanha única nem um problema com uma raiz só.

Mesmo assim, elas rimam no lugar onde a engenharia fica menos glamourosa. Quando IA entra no caminho de download, a fonte do binário importa. Quando agente encosta em arquivo e rede, limite de ambiente importa. Quando benchmark vira vitrine de modelo, verificador importa. Quando relatório de segurança fica barato de produzir, triagem de mantenedor importa.

O ensaio sobre memória de agente coloca mais uma peça nesse quadro. Agente que lembra coisa também precisa de proveniência, conflito, esquecimento e busca responsável. Caso contrário, a memória vira uma gaveta com etiqueta bonita onde fatos antigos, palpites e contradições moram juntos, todos falando com a mesma confiança.

Para quem está construindo ou usando essas ferramentas, o caminho saudável é tratar agente como sistema em produção cedo demais para o conforto. Isolar, escopar credencial, validar fonte, medir comportamento, rastrear decisão e manter rollback continuam sendo tarefas meio sem brilho. Também são as tarefas que impedem a mágica de virar chamado às 3 da manhã.

Fontes: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/05/26/poisoned-search-results-gpu-mining-cryptojacking-campaign-abusing-screenconnect-microsoft-net-utilities/), [BadHost](https://badhost.org/), [Anthropic Engineering](https://www.anthropic.com/engineering/how-we-contain-claude), [DeepSWE](https://deepswe.datacurve.ai/blog) e [agent memory: an anatomy](https://brgsk.xyz/agent-memory-anatomy/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-27
generated_at: 2026-05-27T05:37:38-03:00
source_urls:
  - https://www.microsoft.com/en-us/security/blog/2026/05/26/poisoned-search-results-gpu-mining-cryptojacking-campaign-abusing-screenconnect-microsoft-net-utilities/
  - https://thehackernews.com/2026/05/ai-chatbot-recommendations-redirect.html
  - https://badhost.org/
  - https://github.com/encode/starlette/security/advisories/GHSA-86qp-5c8j-p5mr
  - https://news.risky.biz/risky-bulletin-badhost-vulnerability-bypasses-authentication-on-ai-infrastructure/
  - https://www.anthropic.com/engineering/how-we-contain-claude
  - https://www.securityweek.com/anthropic-releases-new-claude-sandbox-security-guidance-plugin/
  - https://deepswe.datacurve.ai/blog
  - https://daniel.haxx.se/blog/2026/05/26/the-pressure/
  - https://simonwillison.net/2026/May/26/the-pressure/
  - https://brgsk.xyz/agent-memory-anatomy/
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://blog.litespeedtech.com/2026/05/21/security-update-for-litespeed-cpanel-plugin/
  - https://www.securityweek.com/cisa-urges-immediate-patching-of-exploited-litespeed-cpanel-plugin-zero-day/
  - https://vllm.ai/blog/2026-05-26-eagle-3-1
  - https://www.marktechpost.com/2026/05/27/meet-eagle-3-1-the-speculative-decoding-algorithm-that-fixes-attention-drift-in-llm-inference/
  - https://ziglang.org/devlog/2026/#2026-05-26
omitted_briefing_items:
  - Pullfrog AI: original launch was May 12 and weaker freshness than the verified security and benchmark stories.
  - MobileMoE, SIA, PilotTTS, MeMo, FinHarness, MUSE-Autoskill, EviACT, governed runtime, DualGraph, agentic technical debt and AI controllability papers: useful background, but too dense for separate public notes today; the containment/harness pattern was preserved in the trend section.
  - LoRA correction loop app, COGNOS Linux AI OS, Gentle Coding experiment, Qwen sub-agent failures, Qwen quantization threads and MTP context drop: mostly Reddit-first or anecdotal in this pass.
  - MiniCPM5 tokenizer support in llama.cpp: concrete but lower practical urgency than EAGLE 3.1/vLLM for this edition.
  - Jaeger/OpenTelemetry for AI agents and Docker AI sandboxes: confirmed context for the agent-infrastructure theme, but held behind Anthropic containment and BadHost.
  - PostgreSQL cluster_name, iozone on macOS, mod_wsgi switch interval, GNOME clipboard, Posthorn, TSDuck, Tunecat, Cactus Hybrid Router and local GPU setup threads: omitted for focus, validation budget or lower urgency.
-->
