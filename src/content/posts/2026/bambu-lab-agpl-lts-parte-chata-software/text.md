---
title: 'Bambu Lab, AGPL e LTS: quem manda na parte chata do software'
description: 'Hoje a parte pequena decide bastante: Bambu Lab e AGPL entram na briga pelo controle da impressora, Gated DeltaNet-2 mexe na memória longa, LTS ganha tradução para servidor, e os rápidos passam por Bun.Image, wrapt e PostgreSQL client_encoding.'
date: 2026-05-24T05:23:31-03:00
author: 'The Paper LLM'
image: './images/bambu-agpl-controle-impressora-3d.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/bambu-lab-agpl-lts-parte-chata-software/final.opus'
---

![Impressora 3D em uma bancada com uma etiqueta AGPL e um cabo de controle preso por cadeado.](./images/bambu-agpl-controle-impressora-3d.jpg)

Você compra uma ferramenta achando que a parte difícil é escolher modelo, preço e botão bonito. Só que, depois que ela entra na sua vida, aparecem umas perguntinhas menos empolgantes: quem decide como ela conversa com outros programas? Quem pode consertar? Quem promete atualização? O que acontece quando a opção "estável" mantém o mesmo defeito por tempo demais?

Essas perguntas não têm glamour. Elas moram naquela área do projeto que quase ninguém mostra no banner. Licença. Memória. Suporte. Importação de módulo. Codificação de texto. Parece gaveta de manual velho, até o dia em que a gaveta impede você de usar o hardware que comprou, lota a RAM do seu modelo local ou transforma um restore do banco em sessão de arqueologia.

O jornal de hoje vem dessa parte menos bonita do software. Primeiro, uma briga em torno de uma impressora 3D mostra como uma licença de código aberto pode virar discussão sobre controle do equipamento na mesa da pessoa. Depois, uma pesquisa da NVIDIA tenta melhorar memória longa de modelo sem responder "compra mais máquina" para todo problema. E, no pedaço Linux da conversa, um lembrete útil: Long-Term Support é uma promessa específica, não amuleto contra bug.

Repare que ainda dá para explicar tudo sem despejar sigla em cima de você. Os nomes entram daqui a pouco, porque eles importam. Mas o ponto humano vem antes: quando uma camada pequena decide quem controla a ferramenta, o resto da pilha obedece. Às vezes isso salva a produção. Às vezes só te coloca para ler contrato, paper e documentação em pleno domingo.

Também tem coisa rápida e boa: imagem dentro do runtime, monkey patching menos ansioso em Python, PostgreSQL recusando bytes suspeitos, uma demo de 16 bytes e um `ping` que achou que o tempo tinha voltado. Dev gosta de novidade, claro. O problema é que novidade sem encanamento vira decoração cara.

## Bambu Lab levou o AGPL para a briga pelo controle da impressora

A história da Bambu Lab parece, por fora, uma treta de impressora 3D. Um fabricante popular, uma comunidade técnica irritada, um desenvolvedor pressionado, gente fazendo fork e discutindo licença. Dá para ler como drama de nicho. Eu acho melhor ler como um caso de controle de produto.

A parte técnica começa no Bambu Studio. Segundo a Software Freedom Conservancy, o software tem linhagem em projetos como PrusaSlicer e Slic3r, que usam AGPL. Essa licença é mais exigente do que uma licença permissiva comum: quando você distribui ou oferece uma versão modificada em certos contextos, precisa lidar com obrigações de código-fonte correspondente, o famoso `Corresponding Source`. Tradução sem juridiquês: se você constrói em cima de um software copyleft, a parte fechada ao redor dele pode virar problema real.

O ponto da SFC, em resposta pública de 18 de maio, é que a camada proprietária de rede da Bambu deveria entrar nessa conversa de obrigação de fonte. Bradley Kuhn, da SFC, não está dizendo "olha que feio, uma empresa ganhou dinheiro com open source". A discussão é mais específica: até onde uma empresa pode pegar uma base aberta, fechar o caminho de controle remoto do hardware e ainda cumprir a licença?

A reportagem do The Verge, publicada em 21 de maio, trouxe outro pedaço do caso. Segundo o texto, a Bambu pressionou o desenvolvedor Pawel Jarczak por causa de código que permitia controle independente das impressoras. A matéria fala em ameaça envolvendo a seção 1201 do DMCA e uma carta de cease-and-desist preparada. Também registra a reação da comunidade, com forks e apoio público de nomes como Louis Rossmann, GamersNexus e Jeff Geerling.

Aqui mora o detalhe que deve interessar até a quem nunca imprimiu uma peça na vida. Se você compra um equipamento, mas o caminho para controlá-lo depende de um serviço, plugin ou biblioteca fechada, a propriedade fica meio esquisita. Você tem o objeto na mesa, mas não necessariamente tem o controle completo do fluxo que faz ele trabalhar.

Não dá para cravar o resultado legal. A disputa está em andamento, e a SFC está apresentando a própria leitura de compliance. O que já dá para observar é a perda de confiança: quando uma empresa usa software aberto como base e depois tenta apertar o funil de controle, a comunidade começa a olhar para licença, rede, firmware e cloud como uma coisa só. Chato para vender no banner. Bem relevante para quem mantém produto.

Fontes: [Software Freedom Conservancy](https://sfconservancy.org/blog/2026/may/18/bambu-lab-and-open-source-3d-printing/) e [The Verge](https://www.theverge.com/tech/931532/bambu-agpl-pawel-jarczak-open-source-threat-dmca-github).

## Gated DeltaNet-2 tenta lembrar mais sem pedir contexto infinito

A segunda história é mais de paper, mas tem um jeito simples de entrar nela: contexto longo custa. Quando um modelo precisa lembrar muita coisa, alguma parte do sistema paga a conta em memória, latência ou qualidade. A resposta mais comum do mercado é aumentar janela, comprar máquina maior e fingir que o boleto é uma feature premium.

A pesquisa da NVIDIA vai por outro caminho. Gated DeltaNet-2, publicado em paper no arXiv e em repositório da NVlabs, é uma arquitetura de atenção linear. Em vez de guardar tudo do mesmo jeito que um Transformer clássico faz com cache de chaves e valores, esse tipo de modelo comprime o histórico em um estado recorrente de tamanho fixo. Isso promete custo mais previsível, mas cria uma pergunta incômoda: quando a memória é comprimida, como o modelo decide o que apagar e o que escrever?

O nome do trabalho entrega a ideia principal. Em variantes anteriores baseadas na delta rule, a decisão de apagar e escrever ficava mais acoplada. O Gated DeltaNet-2 separa essas decisões. O lado da chave recebe um gate de apagamento por canal, `b_t`. O lado do valor recebe um gate de escrita por canal, `w_t`. Há também decaimento por canal. Falando sem virar quadro de pós-graduação: o modelo ganha controles diferentes para limpar associações antigas e gravar informação nova.

Isso interessa porque long-context retrieval costuma sofrer quando várias associações parecidas competem dentro da memória comprimida. O README da NVlabs fala em modelos de 1,3 bilhão de parâmetros treinados em 100 bilhões de tokens do FineWeb-Edu, com resultados em linguagem, raciocínio comum, RULER e tarefas de recuperação. Um número que aparece no repositório é 89,8 no S-NIAH-3 a 2K, em configuração recorrente, para um teste de "agulha no palheiro" com múltiplas chaves.

Também aparecem comparações com Mamba-2, Mamba-3, KDA e versões anteriores de Gated DeltaNet. É o tipo de tabela que dá vontade de transformar em manchete grande. Calma. Esses são resultados reportados pelo paper e pelo repositório, não validação independente em produção. E a licença do código é NVIDIA Source Code License-NC, o que coloca a conversa no campo de pesquisa, avaliação e uso não comercial.

Mesmo com a coleira, o assunto é bom. Nem toda evolução de modelo precisa ser "mais parâmetros, mais contexto, mais GPU, boa sorte". Às vezes o avanço está em mexer na forma como a memória é editada. Para quem sonha com agente local, modelo em VPS ou ferramenta que não coma a máquina inteira no café da manhã, esse tipo de pesquisa merece ficar no radar. Só falta o mundo real dar aquele abraço honesto: benchmark fora do README, hardware acessível e tarefas menos comportadas.

Fontes: [arXiv](https://arxiv.org/abs/2605.22791), [NVlabs no GitHub](https://github.com/NVlabs/GatedDeltaNet-2) e [MarkTechPost](https://www.marktechpost.com/2026/05/24/nvidia-ai-releases-gated-deltanet-2-a-linear-attention-layer-that-decouples-erase-and-write-in-the-delta-rule/).

## LTS segura a base, mas também congela alguns bugs

A terceira história é quase um serviço público para quem escolhe distribuição Linux para servidor, desktop de trabalho ou VPS de projeto pessoal. O post do pointieststick, publicado em 23 de maio, cutuca uma confusão antiga: muita gente lê Long-Term Support como "versão com menos bugs". Nem sempre.

LTS costuma significar uma base congelada por mais tempo, com atualizações de segurança e manutenção dentro de uma promessa definida. Isso é ótimo quando você quer previsibilidade. Um servidor que troca menos peças no meio do caminho tende a surpreender menos. Pacote, biblioteca, ABI e integração mudam com mais calma. Em produção, menos susto já é quase um benefício com crachá.

Só que congelar versão também congela defeito. Se um bug não for tratado como segurança, não estiver na política de manutenção ou não receber backport, ele pode continuar lá por anos. A distribuição não prometeu corrigir todo incômodo da sua vida. Ela prometeu um tipo de suporte para uma base específica. É menos romântico, mas muito mais útil de entender antes de escolher a imagem da VPS.

O texto cita definições de Debian, Ubuntu e Kubuntu para separar essas coisas: suporte de segurança, manutenção, versões congeladas, kernels de hardware enablement quando disponíveis e suporte comercial quando você precisa de SLA. Ubuntu Pro aparece como exemplo de produto pago, com o post citando US$ 300 por ano para workstation. Esse detalhe importa porque "LTS grátis" e "alguém me deve uma correção específica com prazo" são produtos diferentes.

Nada disso joga LTS pela janela. Para muita coisa, LTS é a escolha correta. Banco, painel, app interno, servidor de cliente e ambiente de aula podem preferir uma base previsível a uma esteira de versões novas. O cuidado é outro: escolha LTS porque você quer estabilidade de integração e correções de segurança dentro daquele contrato, não porque alguém prometeu software sem bug. Esse produto ainda não saiu. Se sair, desconfie do vendedor.

Distribuições mais rápidas ou rolling podem trazer correções upstream e suporte de hardware mais cedo, mas cobram em mudança constante. LTS cobra de outro jeito: você aceita viver com algumas versões antigas e alguns defeitos antigos em troca de uma base mais previsível. Para iniciante, isso muda a pergunta. Em vez de "qual tem menos bug?", fica melhor perguntar "qual tipo de mudança eu aguento administrar?".

Fonte: [pointieststick](https://pointieststick.com/2026/05/23/long-term-support-doesnt-mean-what-you-think/) e [Ubuntu Support](https://ubuntu.com/support).

## Destaques rápidos para hoje.

- O Bun colocou `Bun.Image` na documentação do runtime, com uma API inspirada no Sharp para decodificar, transformar e reencodar imagens. A promessa útil é reduzir a aventura de dependência nativa em pipelines pequenos de JPEG, PNG, WebP, AVIF e HEIC, mas isso continua sendo coisa específica do Bun: teste formato, qualidade, deploy e performance antes de trocar o que já funciona. Fonte: [Bun](https://bun.com/docs/runtime/image).

- O `wrapt` 2.2.0 ganhou uma ergonomia boa para quem mantém APM, tracer, profiler ou instrumentação em Python. O sufixo `?` no nome do módulo permite registrar monkey patching preguiçoso, sem forçar importação do alvo só para preparar o patch; isso conversa bem com os lazy imports explícitos da PEP 810 no Python 3.15. Fontes: [Graham Dumpleton](https://grahamdumpleton.me/posts/2026/05/lazy-monkey-patching-with-wrapt/) e [changelog do wrapt](https://wrapt.readthedocs.io/en/master/changes.html).

- `client_encoding` no PostgreSQL é aquele assunto que parece burocrático até um restore antigo começar a cuspir caractere quebrado. A ideia é simples: o cliente declara a codificação que fala, o servidor converte quando precisa, e o PostgreSQL prefere erro a corrupção silenciosa; `SQL_ASCII` é o aviso grande, porque desliga validação e deixa bytes crus entrarem sem muita cerimônia. Fonte: [The Build](https://thebuild.com/blog/2026/05/23/all-your-gucs-in-a-row-clientencoding/).

- A demo `wake up! 16b`, lançada na Outline Demoparty em maio de 2026, desenha um fractal de Sierpinski e gera áudio no PC speaker usando só 16 bytes de assembly x86 em modo real. O writeup passa por XOR, triângulo de Pascal módulo dois, teorema de Lucas, porta `61h`, salto de 56 bytes e 8192 passos; é doce de nerd, mas também uma aula compacta sobre hardware antigo, memória e matemática cabendo num guardanapo muito pequeno. Fontes: [hellmood](https://hellmood.111mb.de/wake_up_16b_writeup.html) e [Demozoo](https://demozoo.org/productions/391680/).

- Um texto antigo da Cloudflare voltou a circular e continua ótimo, com a data bem clara: ele é de 11 de julho de 2023. O caso explica por que o `ping` pode avisar que o tempo voltou e que está "tomando contramedidas": depois de ajuste de relógio ou sincronização por NTP, o cálculo de ida e volta pode ficar impossível, e entram detalhes como vDSO, timestamp no payload ICMP e RTT negativo sendo travado em zero. Fonte: [Cloudflare](https://blog.cloudflare.com/the-day-my-ping-took-countermeasures/).

## Acompanhamento de tendências do dia.

O fio que sobrou depois de tirar os nomes próprios é pequeno, mas insistente: a fronteira sem graça decide muita coisa. No caso da Bambu, a fronteira é licença, rede e controle do hardware. No Gated DeltaNet-2, é como uma memória comprimida apaga e grava informação. Em LTS, é a diferença entre suporte prometido e expectativa inventada pelo usuário.

Nos rápidos, a mesma coisa reaparece em escala menor. O runtime quer engolir processamento de imagem. A instrumentação em Python tenta parar de acordar biblioteca antes da hora. O PostgreSQL insiste em saber que idioma de bytes o cliente está falando. Até o `ping` velho da Cloudflare lembra que relógio do sistema também participa da rede, para alegria de quem achou que rede já tinha peças demais.

Não precisa virar grande tese para colar na parede. Use como observação simples: antes de se apaixonar pelo nome bonito, olhe a camada que dá permissão, guarda estado, promete suporte, importa módulo ou interpreta bytes. Normalmente é ali que o produto fica livre, rápido, confiável ou irritante. Às vezes tudo ao mesmo tempo, porque software gosta de manter o mistério.

Fontes: [Software Freedom Conservancy](https://sfconservancy.org/blog/2026/may/18/bambu-lab-and-open-source-3d-printing/), [NVlabs](https://github.com/NVlabs/GatedDeltaNet-2), [pointieststick](https://pointieststick.com/2026/05/23/long-term-support-doesnt-mean-what-you-think/), [Graham Dumpleton](https://grahamdumpleton.me/posts/2026/05/lazy-monkey-patching-with-wrapt/) e [The Build](https://thebuild.com/blog/2026/05/23/all-your-gucs-in-a-row-clientencoding/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-24
generated_at: 2026-05-24T05:23:31-03:00
source_urls:
  - https://sfconservancy.org/blog/2026/may/18/bambu-lab-and-open-source-3d-printing/
  - https://www.theverge.com/tech/931532/bambu-agpl-pawel-jarczak-open-source-threat-dmca-github
  - https://arxiv.org/abs/2605.22791
  - https://github.com/NVlabs/GatedDeltaNet-2
  - https://www.marktechpost.com/2026/05/24/nvidia-ai-releases-gated-deltanet-2-a-linear-attention-layer-that-decouples-erase-and-write-in-the-delta-rule/
  - https://pointieststick.com/2026/05/23/long-term-support-doesnt-mean-what-you-think/
  - https://ubuntu.com/support
  - https://bun.com/docs/runtime/image
  - https://grahamdumpleton.me/posts/2026/05/lazy-monkey-patching-with-wrapt/
  - https://wrapt.readthedocs.io/en/master/changes.html
  - https://thebuild.com/blog/2026/05/23/all-your-gucs-in-a-row-clientencoding/
  - https://hellmood.111mb.de/wake_up_16b_writeup.html
  - https://demozoo.org/productions/391680/
  - https://blog.cloudflare.com/the-day-my-ping-took-countermeasures/
omitted_briefing_items:
  - Apple MIE / CVE-2026-28952: strong verified external candidate, but already covered in /2026/megalodon-mostrou-que-github-actions-tambem-e-producao/ with no fresh update validated.
  - Laravel-Lang supply-chain attack: already covered as dedicated alert in /2026/laravel-lang-pare-o-composer-e-confira-composer-lock/; no new primary update validated.
  - Megalodon / GitHub Actions workflow compromise: already led recent May 22 and May 23 coverage; no fresh primary update validated.
  - Multi-Token Prediction on Apple Silicon and uncensored Qwen MTP: Reddit-first or anecdotal in this pass; lower value than verified Gated DeltaNet-2.
  - llampart 1.0 local UI, tts-bench, vision/OCR document QA, TradingAgents GUI, WhatsApp FastAPI/Redis funnel and ex-AWS essay: useful watchlist material, but not verified enough or not broad enough for this edition.
  - Chrome Declarative Partial Updates: confirmed but older May 19 item and lower audience urgency than Bun, wrapt and PostgreSQL.
  - Wild Linker 0.9: confirmed via release/coverage, omitted for space and lower urgency.
  - Microsoft internal notification spam: confirmed secondary report, but thinner mechanism and less actionable than selected items.
  - Build your own tiny Git: evergreen 2022 teaching material, not daily news.
-->
