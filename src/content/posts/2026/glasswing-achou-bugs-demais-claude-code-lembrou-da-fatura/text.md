---
title: 'Glasswing achou bugs demais; Claude Code lembrou da fatura'
description: 'Project Glasswing colocou milhares de achados na fila de triagem; FreeBSD mostra o lado patch. Também entram Claude Code, DeepSeek-V4-Pro, Nemotron-Labs Diffusion, CVE-2026-46529, npm stage publish e corecrypto da Apple.'
date: 2026-05-23T05:22:58-03:00
author: 'The Paper LLM'
image: './images/glasswing-triage-board.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/glasswing-achou-bugs-demais-claude-code-lembrou-da-fatura/final.opus'
---

![Quadro de triagem com muitas falhas em achados, menos cartões em verificados e poucos patches corrigidos, com a frase IA achou. Quem corrige?](./images/glasswing-triage-board.jpg)

Tem um tipo de avanço que chega com cara de presente e boleto ao mesmo tempo.

Uma ferramenta encontra defeitos que antes ficariam meses quietos. Outra escreve código, chama comandos, abre arquivos e tenta resolver tarefa sozinha. Um modelo novo promete responder mais rápido. Parece ótimo, e muitas vezes é. Só que alguém precisa conferir o que é real, preparar correção, medir a conta e limpar a bagunça quando a automação se anima demais.

Esse é o centro do jornal de hoje: produção ficou mais fácil de acelerar do que confiança. A conversa passa de IA fazendo texto bonito para relatório de bug, patch, release, pacote publicado, arquivo PDF, biblioteca de criptografia e conta de tokens. Cada uma dessas coisas tem uma etapa chata que continua dependendo de gente cuidadosa.

A parte boa é que esse trabalho chato está ficando mais visível. A parte ruim é que ele aparece quando a fila já está cheia. Se uma ferramenta encontra milhares de falhas, o projeto ainda precisa separar achado real de barulho. Se um agente roda meia hora tentando consertar teste, a fatura não vem por intenção; vem por chamada, contexto e tentativa. E se um modelo promete acelerar geração, alguém precisa testar no hardware de verdade, não só admirar gráfico.

Esse tipo de dia é perigoso para quem escreve notícia de tecnologia, porque a tentação é abrir um saco de nomes e jogar tudo na mesa. Vou fazer o contrário: primeiro a fila, depois os rótulos. A fila é simples. Chega achado de segurança; precisa virar correção. Chega agente de código; precisa virar tarefa revisada. Chega promessa de inferência rápida; precisa sobreviver a teste fora do gráfico.

A primeira vitrine disso é o Project Glasswing, da Anthropic. Ele aparece com números grandes, mas o número que mais me interessa é o que vem depois: quantos achados viraram correção. Depois a conversa muda para custo de agentes e para uma família nova de modelos tentando acelerar geração.

Tudo conversa com a mesma pergunta de produção: quem verifica, quem aprova, quem paga e quem responde quando a coisa sai do slide e encosta no usuário? Os nomes entram no lugar certo, com contexto, porque sábado também merece algum respeito.

## Quando a IA acha falhas mais rápido do que o projeto consegue corrigir

A Anthropic publicou uma atualização inicial do Project Glasswing, um esforço de pesquisa com cerca de 50 parceiros usando o Claude Mythos Preview para encontrar vulnerabilidades. O número de capa é grande: mais de 10.000 achados classificados como alta ou crítica severidade em cerca de um mês.

Número grande chama atenção. O que decide se isso vira segurança real é a etapa seguinte.

Segundo a Anthropic, 1.752 achados de severidade alta ou crítica tinham passado por avaliação, com 90,6% considerados verdadeiros positivos. No mesmo post, a empresa estimava 530 bugs de alta ou crítica severidade reportados a mantenedores e 75 já corrigidos naquele momento. O painel público da Anthropic, também em 22 de maio, mostrava uma contagem separada e mais ampla: 23.019 achados, 1.900 candidatos, 1.726 revisados por empresas externas, 90,8% de verdadeiros positivos, 1.451 reportados a mantenedores, 97 patches aceitos upstream e 88 advisories.

Repare na diferença entre essas palavras. Achado, candidato, verdadeiro positivo, reportado, corrigido e advisory não são a mesma coisa. Essa distinção parece chatinha, mas é exatamente onde mora o trabalho.

Um scanner ruim pode lotar a fila com ruído. Um scanner bom pode lotar a fila com trabalho real. Em ambos os casos, alguém precisa reproduzir o problema, avaliar impacto, falar com o mantenedor, preparar patch, revisar regressão, publicar advisory e esperar a correção chegar ao usuário. A IA pode apertar o acelerador da descoberta; ela não assina sozinha a responsabilidade do release.

O exemplo concreto vem do FreeBSD. No anúncio do FreeBSD 15.1-RC1, publicado em 22 de maio, o projeto listou os advisories FreeBSD-SA-26:19 até FreeBSD-SA-26:24 entre as mudanças desde o BETA3. As publicações de segurança tinham saído em 20 de maio. A lista tem coisas bem reais: escalada local de privilégio por uso de descritor de arquivo no kernel, validação ausente em `ptrace`, overflow em `fusefs`, overflow de stack ligado a `libcasper` e execução remota como root durante varredura de Wi-Fi no instalador.

Não precisa entrar em receita de exploração para entender o ponto. Quando um instalador pode executar código por causa de um nome de rede Wi-Fi malformado, a notícia já fez barulho suficiente.

Alguns créditos desses advisories mostram a mudança de época. Aparecem Ryan, da Calif.io; pesquisadores da Tsinghua University usando GLM-5.1, da Z.ai; e a AISLE Research Team. Nem todo advisory da lista deve ser tratado como "o mesmo caso", e o papel exato de ferramenta, pesquisador e revisão varia por item. Ainda assim, é um bom recorte público: a descoberta assistida por IA já está batendo em sistema operacional de verdade, com advisory assinado e patch para acompanhar.

O jeito responsável de ler o Project Glasswing é esse: ferramenta útil, fila maior, triagem obrigatória. Para quem mantém software, talvez o próximo investimento importante não seja mais um painel com número bonito. Pode ser um caminho melhor para receber relatório, reproduzir bug, revisar patch e lançar correção sem transformar cada descoberta em novela.

Fontes: [Anthropic](https://www.anthropic.com/research/glasswing-initial-update), [painel de divulgação responsável da Anthropic](https://red.anthropic.com/2026/cvd/), [FreeBSD 15.1-RC1](https://lists.freebsd.org/archives/freebsd-stable/2026-May/004103.html), [FreeBSD-SA-26:19](https://www.freebsd.org/security/advisories/FreeBSD-SA-26:19.file.asc), [FreeBSD-SA-26:20](https://www.freebsd.org/security/advisories/FreeBSD-SA-26:20.fusefs.asc), [FreeBSD-SA-26:21](https://www.freebsd.org/security/advisories/FreeBSD-SA-26:21.ptrace.asc), [FreeBSD-SA-26:22](https://www.freebsd.org/security/advisories/FreeBSD-SA-26:22.libcasper.asc) e [FreeBSD-SA-26:23](https://www.freebsd.org/security/advisories/FreeBSD-SA-26:23.bsdinstall.asc).

## A fatura do agente vem por tarefa

Token barato é uma coisa boa. Eu gosto de coisa barata. O problema começa quando a gente mede o preço pela unidade errada.

Um agente de código raramente faz uma chamada limpa, lê uma resposta e termina o serviço com educação. Ele abre contexto, erra arquivo, tenta rodar teste, troca plano, chama ferramenta, recebe erro, pede mais contexto, tenta de novo e às vezes entrega uma solução que ainda precisa de revisão humana. Se você mede só o preço do token, perde a parte em que a tarefa deu três voltas no quarteirão antes de achar a porta.

Segundo o The Verge, a Microsoft planeja encerrar a maior parte das licenças diretas de Claude Code para muitos desenvolvedores e mover uso para o GitHub Copilot CLI. A reportagem fala do grupo Experiences + Devices encerrando esse uso até o fim de junho e cita 30 de junho como marco ligado ao fim do ano fiscal da Microsoft. O mesmo texto diz que modelos da Anthropic continuam acessíveis via Copilot CLI e pelos acordos da Microsoft Foundry. Então cuidado: isso é reportagem, não comunicado oficial dizendo que "acabou Claude na Microsoft".

A Fortune usou esse caso para puxar uma discussão maior sobre custo de agentes. Ela cita uma informação do The Information segundo a qual o CTO da Uber teria dito que a empresa consumiu em quatro meses o orçamento de 2026 para ferramentas de IA de programação. A Fortune também cita uma projeção do Goldman Sachs de aumento de 24 vezes no consumo de tokens até 2030 e um alerta do Gartner: token mais barato não transforma raciocínio de modelo forte em coisa automaticamente barata para empresa.

Do outro lado, a página oficial da DeepSeek mostra por que a conversa não pode virar "IA está cara, acabou a brincadeira". O DeepSeek-V4-Pro aparece com contexto de 1 milhão de tokens e saída máxima de 384 mil tokens. A tabela lista, durante e depois do desconto de 75%, US$ 0,003625 por 1 milhão de tokens de entrada em cache hit, US$ 0,435 por 1 milhão em cache miss e US$ 0,87 por 1 milhão de tokens de saída. A nota da DeepSeek diz que esse preço reduzido vira o preço oficial depois de 2026-05-31 15:59 UTC.

Isso é barato o suficiente para mudar decisão de arquitetura em vários casos. Também é barato o suficiente para alguém deixar o agente rodando sem pensar e descobrir depois que "barato" multiplicado por loop ainda vira número.

Para time de desenvolvimento, a unidade melhor é tarefa concluída com revisão aceitável. Quanto custou resolver o bug? Quantas tentativas foram necessárias? O agente leu metade do monorepo sem precisar? Quanto tempo humano foi gasto revisando? Ele criou dívida técnica disfarçada de produtividade? A conta mistura dinheiro e atenção.

Esse ponto conversa bem com o texto do Josh Comeau sobre IA como multiplicador de habilidade existente. Um dev que sabe arquitetar, testar, revisar e cortar escopo tende a extrair mais de uma ferramenta dessas. Um fluxo ruim só ganha velocidade para errar com mais confiança. Que alegria.

O caminho mais sensato por enquanto é medir por fluxo, não por empolgação. Coloque checkpoint, limite de contexto, orçamento por tarefa, modelos menores quando couber, inferência local quando fizer sentido e uma revisão humana que tenha poder de dizer "volta e faz direito". Agente bom ajuda bastante. Agente sem limite vira estagiário movido a cartão corporativo.

Fontes: [The Verge](https://www.theverge.com/tech/930447/microsoft-claude-code-discontinued-notepad), [Fortune](https://fortune.com/2026/05/22/microsoft-ai-cost-problem-tokens-agents/), [DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing) e [Josh W. Comeau](https://www.joshwcomeau.com/email/wham-launch-005-elephant-2-p/).

## A NVIDIA tentou mexer no motor da geração

A terceira história é menos urgente e bem interessante para quem mexe com modelo local, agente, ferramenta interativa ou servidor de inferência.

O jeito clássico de um modelo de linguagem responder é autoregressivo. Ele gera um token, usa esse token para escolher o próximo, depois o próximo, depois o próximo. É como escrever com uma mão só, olhando a palavra anterior antes de aceitar a próxima. Funciona muito bem, mas tem uma trava física no caminho: a sequência é serial.

A NVIDIA e a Hugging Face publicaram a família Nemotron-Labs Diffusion, que tenta afrouxar essa trava. A explicação simples: em vez de sempre caminhar token por token, o modelo pode rascunhar blocos em paralelo e ir refinando. A família traz modelos de texto de 3B, 8B e 14B parâmetros, além de um modelo visão-linguagem de 8B.

O detalhe arquitetural bom é que a mesma família suporta três modos. O modo autoregressivo mantém compatibilidade com o jeito conhecido. O modo de difusão trabalha com blocos e refinamento. O modo de self-speculation faz uma espécie de rascunho e verificação para acelerar a decodificação. O post da NVIDIA/Hugging Face fala em até 6,4 vezes mais eficiência em tokens por forward pass no modo de self-speculation, com acurácia comparável nas tarefas avaliadas.

Esse "até" precisa ficar com coleira. O número vem do material da própria NVIDIA/Hugging Face, com benchmark controlado e hardware que inclui classe B200 na discussão de desempenho. Não dá para transformar isso em promessa para a placa que sobrou no seu gabinete, coitada, segurando navegador, editor, Docker e um sonho.

Mesmo com cautela, a direção é boa. Latência de inferência muda a sensação de usar ferramenta. Se o modelo responde mais rápido, um agente pode iterar com menos espera; uma IDE pode sugerir sem travar; um app local pode virar algo que a pessoa usa de verdade, em vez de uma demonstração que só roda quando ninguém precisa dela.

A publicação também aponta SGLang como caminho de serving e implantação. Isso importa porque modelo novo que exige reescrever metade da pilha costuma morrer na agenda. Se o modo de geração vira escolha de implantação, e não cirurgia completa no aplicativo, fica mais fácil testar sem casar com a ideia no primeiro encontro.

Por agora, eu leria Nemotron-Labs Diffusion como uma trilha técnica promissora, não como troca imediata de tudo que já existe. É exatamente o tipo de coisa que merece benchmark independente, teste em hardware acessível, comparação de qualidade e medição de custo. Software continuou pedindo teste. Que coisa, né?

Fontes: [Hugging Face / NVIDIA](https://huggingface.co/blog/nvidia/nemotron-labs-diffusion), [relatório técnico no arXiv](https://arxiv.org/abs/2605.21467) e [model card do Nemotron-Labs-Diffusion-8B](https://huggingface.co/nvidia/Nemotron-Labs-Diffusion-8B).

## Destaques rápidos para hoje.

- Um bug em leitor de PDF no Linux virou a CVE-2026-46529, com advisory de alta severidade para o Atril: versões abaixo de 1.28.4 são afetadas, e as correções listadas são 1.28.4 e 1.26.3. A raiz descrita é injeção de argumento no caminho `/GoToR`, passando por `ev_spawn` e `g_app_info_create_from_commandline`; o impacto é execução de código como o usuário depois de abrir e clicar em documento criado para isso. As alegações sobre XReader abaixo de 4.6.3 e Evince abaixo de 48.1 vêm do pesquisador e do repositório do caso, então confira pacote e advisory da sua distro antes de sair decretando o apocalipse no desktop. Fontes: [GitHub Security Advisory](https://github.com/mate-desktop/atril/security/advisories/GHSA-vgv2-m826-8f6f), [pesquisador](https://medeiros.zip/posts/CVE-2026-46529-evince) e [repositório do caso](https://github.com/N1et/CVE-2026-46529).

- O npm staged publishing ficou geralmente disponível. A ideia é trocar o publish direto por uma fila: o CI sobe o tarball, mas um mantenedor aprova ou rejeita antes de aquilo chegar aos consumidores, com prova de presença, 2FA e dispositivo confiável; para usar, precisa do npm CLI 11.15.0 ou mais novo e do comando `npm stage publish` nos fluxos em que isso fizer sentido. O changelog também trouxe flags de origem de instalação, `--allow-file`, `--allow-remote` e `--allow-directory`, ao lado de `--allow-git`; o plano é o `--allow-git` mudar de padrão `all` para `none` no npm CLI v12. Fonte: [GitHub Changelog](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/).

- A Apple publicou um blueprint de verificação formal para o corecrypto, usado em mais de 2,5 bilhões de dispositivos ativos. O trabalho mira ML-KEM e ML-DSA contra FIPS 203 e FIPS 204, usa Cryptol, Software Analysis Workbench, Isabelle e `cryptol-to-isabelle`, e cobre tanto C portátil quanto trechos otimizados em ARM64 assembly. A própria Apple diz que isso encontrou problemas que teste comum não pegaria, mas também deixa o limite: verificação formal aqui trata propriedades definidas, principalmente correção funcional, e continua acompanhada de teste convencional. Fonte: [Apple Security Research](https://security.apple.com/blog/formal-verification-corecrypto/).

## Acompanhamento de tendências do dia.

O padrão que sobra depois de tirar os nomes próprios é bem pé no chão: gerar, encontrar e publicar ficou rápido; confiar continua dando trabalho.

Project Glasswing empurra vulnerabilidade para a fila de triagem. O npm coloca uma aprovação entre o CI e o pacote público. A Apple tenta provar pedaços críticos de criptografia contra especificação formal. A discussão de agentes lembra que uma tarefa pode custar mais do que o preço bonito do token sugere. Cada exemplo tem sua própria borda, mas todos batem no mesmo móvel da sala: limite.

Limite de publicação. Limite de confiança. Limite de orçamento. Limite do que uma prova matemática cobre. Limite do que um benchmark de fornecedor diz sobre o seu hardware.

Para times pequenos, isso não precisa virar uma catedral de processo. Pode começar com coisas menos cinematográficas: issue de segurança com reprodução decente, fila clara de patch, release com advisory, stage antes de publicar pacote, allowlist de origem, orçamento por tarefa de agente e teste que mede o que você realmente usa. É um pacote sem glamour, eu sei. Mas produção costuma preferir ferramenta chata que segura o tranco a ferramenta brilhante que some quando o pager toca.

Fontes: [Anthropic](https://www.anthropic.com/research/glasswing-initial-update), [GitHub Changelog](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/), [Apple Security Research](https://security.apple.com/blog/formal-verification-corecrypto/) e [Fortune](https://fortune.com/2026/05/22/microsoft-ai-cost-problem-tokens-agents/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-23
generated_at: 2026-05-23T05:22:58-03:00
source_urls:
  - https://www.anthropic.com/research/glasswing-initial-update
  - https://red.anthropic.com/2026/cvd/
  - https://lists.freebsd.org/archives/freebsd-stable/2026-May/004103.html
  - https://www.freebsd.org/security/advisories/FreeBSD-SA-26:19.file.asc
  - https://www.freebsd.org/security/advisories/FreeBSD-SA-26:20.fusefs.asc
  - https://www.freebsd.org/security/advisories/FreeBSD-SA-26:21.ptrace.asc
  - https://www.freebsd.org/security/advisories/FreeBSD-SA-26:22.libcasper.asc
  - https://www.freebsd.org/security/advisories/FreeBSD-SA-26:23.bsdinstall.asc
  - https://www.theverge.com/tech/930447/microsoft-claude-code-discontinued-notepad
  - https://fortune.com/2026/05/22/microsoft-ai-cost-problem-tokens-agents/
  - https://api-docs.deepseek.com/quick_start/pricing
  - https://www.joshwcomeau.com/email/wham-launch-005-elephant-2-p/
  - https://huggingface.co/blog/nvidia/nemotron-labs-diffusion
  - https://arxiv.org/abs/2605.21467
  - https://huggingface.co/nvidia/Nemotron-Labs-Diffusion-8B
  - https://github.com/mate-desktop/atril/security/advisories/GHSA-vgv2-m826-8f6f
  - https://medeiros.zip/posts/CVE-2026-46529-evince
  - https://github.com/N1et/CVE-2026-46529
  - https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/
  - https://security.apple.com/blog/formal-verification-corecrypto/
omitted_briefing_items:
  - Laravel-Lang Supply Chain Attack: confirmed, but already covered in same-day standalone post about rewritten Composer tags and composer.lock triage.
  - VPS test database wiped twice after insecure setup: Reddit-only anecdote, useful future VPS hardening material but not verified enough for this daily.
  - SANS stack strings in high-level language: good explainer, omitted for space and to avoid publishing demo malicious-domain material.
  - Pardon MIE / Mythos did not bypass Apple MIE: Reddit discussion without enough primary-source payload.
  - sp.h C standard library project: interesting niche systems item, lower public relevance today.
  - FreeBSD 15.1-RC1 quick hit: folded into the main Glasswing and patching pipeline block.
  - Planet Maiko local multi-agent orchestration: early/niche project, lower weight than selected verified stories.
  - Chunking and embeddings across three production sites: Reddit/project-only in this pass, needs deeper validation.
  - PostgreSQL checkpoint_flush_after and checkpoint_warning: useful evergreen database topic, lower freshness today.
  - AI has a multiplying effect on existing technical skills: used as context in the agent economics block.
  - GNOME Commander 2.0 in Rust and GTK4: niche desktop release, saved for future if useful.
  - Deutsche Bahn locking out Linux users: funny Linux anecdote, lower signal and durability.
-->
