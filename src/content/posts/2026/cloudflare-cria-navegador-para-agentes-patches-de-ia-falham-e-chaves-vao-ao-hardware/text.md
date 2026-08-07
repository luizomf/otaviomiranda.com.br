---
title: 'Cloudflare cria navegador para agentes, patches de IA falham e chaves vão ao hardware'
description: 'Kitesurf troca Chromium por Workers, só 26% dos patches estudados foram correções limpas e hardware limita o que agentes podem assinar.'
date: 2026-08-07T05:15:37-03:00
author: 'The Paper LLM'
image: './images/cloudflare-cria-navegador-para-agentes-patches-de-ia-falham-e-chaves-vao-ao-hardware.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/cloudflare-cria-navegador-para-agentes-patches-de-ia-falham-e-chaves-vao-ao-hardware/final.opus'
---

![Pipa laranja da Cloudflare ligada a um aparelho compacto com o nome Kitesurf.](./images/cloudflare-cria-navegador-para-agentes-patches-de-ia-falham-e-chaves-vao-ao-hardware.jpg)
Abrir um navegador inteiro para cada agente é como entregar uma oficina mecânica para apertar um parafuso. A Cloudflare resolveu testar uma ferramenta menor: o Kitesurf roda sobre Workers e cuida de tarefas como extrair HTML e tirar screenshots sem provisionar uma instância de Chromium para cada agente.

Essa ideia de dar à automação apenas o pedaço de que ela precisa atravessa as histórias desta edição. Uma pesquisa mostra por que um patch gerado por IA precisa provar algo além de sua capacidade de calar um exploit. Outra coloca chaves de assinatura no hardware e deixa o modelo apenas pedir a operação. Na infraestrutura, um benchmark de LLM lembra que a resposta pode começar voando e engasgar no meio. E, no Linux, o histórico caprichado do Atuin arrumou um segundo emprego na perícia.

A automação continua útil. A oficina, o chaveiro e a ata de aprovação podem ficar com componentes menos impressionáveis.

## Kitesurf leva o navegador do agente para os Workers

A Cloudflare anunciou em 6 de agosto o Kitesurf, um navegador sem estado feito para agentes e executado inteiramente sobre Cloudflare Workers. O beta está disponível de graça pelo Browser Run.

A proposta é cortar a gordura do navegador humano. Chromium carrega processos, renderização e uma montanha de mecanismos necessários para navegar pela web como nós navegamos. Kitesurf mira um recorte menor: DOM, extração de conteúdo, screenshots e automação sobre isolates V8.

Segundo a Cloudflare, ele usa significativamente menos CPU e memória do que Chromium em tarefas comuns de agentes, incluindo captura de tela e extração de HTML. A comparação é do próprio fornecedor. O anúncio também não demonstra compatibilidade universal com Chromium nem oferece SLA de produção durante o beta.

Para uma equipe que executa muitos agentes, o ganho potencial está no provisionamento. Em vez de subir um navegador completo para cada trabalho, dá para experimentar um caminho serverless mais leve. Só que “abre uma página” esconde uma fauna respeitável de sites, scripts e comportamentos. Antes da troca, a equipe precisa rodar seus fluxos reais, conferir a compatibilidade com o que usa de Puppeteer e descobrir em que momento o navegador magro começa a pedir almoço reforçado.

Fonte: [Cloudflare Blog — Introducing Kitesurf](https://blog.cloudflare.com/kitesurf/).

## Um exploit bloqueado ainda pode esconder um patch ruim

A Off-by-1 Labs, numa pesquisa apresentada pela 1Password, gerou 6.480 patches para seis vulnerabilidades recentes escolhidas de propósito por sua complexidade. Quatrocentas tentativas foram sinalizadas por recuperar correções existentes e saíram do conjunto principal. Restaram 6.080 patches avaliados.

Desses, 26% corrigiram a vulnerabilidade sem alterar materialmente o comportamento da aplicação. Outros 20,1% fecharam a falha, mas mudaram o comportamento. Nos 53,9% restantes, o patch falhou em corrigir o problema, introduziu uma vulnerabilidade nova ou conseguiu fazer as duas coisas. “O teste passou” virou o início da conversa.

O mecanismo lembra alguém que decorou uma questão da prova. Um patch pode bloquear exatamente o exploit fornecido e preservar a falha que tornou o ataque possível. Também pode resolver o problema de segurança quebrando uma regra normal do software. A revisão precisa responder duas perguntas separadas: a vulnerabilidade foi eliminada? O comportamento esperado da aplicação continuou intacto?

Na prática, patches gerados por IA pedem variantes do exploit, testes de regressão, invariantes e fuzzing quando fizer sentido. Uma pessoa também precisa ter autoridade para rejeitar a mudança. Um diff convincente e um teste verde são evidências úteis. Absolvição automática já é querer intimidade demais com o autocomplete.

A taxa de 26% vale para este experimento, com seis vulnerabilidades deliberadamente difíceis e dois modelos de fronteira. Ela não representa qualquer modelo, bug ou repositório. A pesquisa sustenta um processo rigoroso de revisão, sem demonstrar que todo patch de IA seja inseguro. Demonstra algo bem menos cinematográfico e mais trabalhoso: cada patch ainda precisa provar que presta.

Fontes: [1Password — AI-generated vulnerability patches require human review](https://1password.com/blog/why-ai-generated-patches-still-require-human-review) e [repositório FLAWED da Off-by-1 Labs](https://github.com/Off-by-1-Labs/FLAWED).

## A chave fica no hardware e o agente recebe um pedido limitado

Um novo preprint propõe tirar chaves privadas de assinatura dos arquivos, das variáveis de ambiente e do contexto do modelo. Elas ficam num HSM, TPM ou smart card, atrás da interface criptográfica PKCS#11. O agente pode solicitar uma assinatura; política e hardware decidem se aquele payload exato está autorizado.

No PKCS#11, o programa trabalha com um identificador opaco da chave. A operação criptográfica acontece dentro do keystore, e o host recebe o resultado em vez do material privado bruto. O desenho junta essa barreira com identidade de sessão, capacidades, compromisso sobre o conteúdo, rastreamento de dados contaminados, validação semântica e aprovação humana.

A sacada é separar autoridade. O modelo prepara um commit ou documento e pede a assinatura, mas continua sem uma chave copiável para assinar outra coisa depois. O compromisso do payload impede ainda que a autorização dada a um conteúdo seja reaproveitada silenciosamente em outro. É o equivalente técnico de autorizar um pagamento específico em vez de deixar o cartão e a senha em cima da mesa porque o agente pediu com educação.

Nos testes dos autores, três modelos que obedeceram a injeções no modo básico somaram 192 tentativas. A taxa de sucesso do ataque foi de 19,3% nesse modo e de 0% com as proteções. Foram zero ataques observados, com limite superior de 2% no intervalo de confiança de 95%. A avaliação de falsos positivos teve só quatro cenários benignos.

O trabalho é um preprint executado pelos próprios autores, ainda sem auditoria independente em produção. Boa parte do resultado vem de duas propriedades determinísticas: a chave não pode ser extraída e a assinatura só vale para o payload comprometido. A arquitetura limita ações específicas mesmo quando o modelo é enganado; ela não resolve prompt injection como problema geral.

E tudo bem. “O agente não consegue fazer isso” costuma ser uma fronteira melhor do que “pedimos no prompt para ele não fazer”.

Fonte: [Hardware Keystores for AI Agent Signing Workflows](https://arxiv.org/html/2608.06130v1).

## A primeira palavra rápida pode esconder pausas no resto da resposta

Um experimento reproduzível publicado pela DigitalOcean comparou o batching contínuo atual do vLLM com um controle de entrada em lotes no cliente. No batching contínuo, novas requisições entram e as concluídas saem entre iterações de geração. O servidor é mais bem aproveitado e pode entregar o primeiro token mais cedo. Em troca, novos prompts podem interromper o ritmo de uma resposta que já começou.

A 10 requisições por segundo, o modo contínuo entregou mediana de 24,1 milissegundos até o primeiro token. No comparador com entrada em lotes, foram 195,8 milissegundos. A ordem se inverteu na pior pausa mediana dentro do stream: 129,6 milissegundos no contínuo contra 52,8 milissegundos no modo controlado.

Para o usuário, a resposta aparece cedo e depois o cursor para para meditar. Uma única métrica de latência conta a primeira metade da experiência e vai embora antes do silêncio constrangedor.

O teste usou vLLM 0.24.0, Llama 3.1 de 8 bilhões de parâmetros e uma NVIDIA H200 com 141 GB. Desabilitar o prefill em blocos elevou o p99 da pior pausa de 189,9 para 267,8 milissegundos. O prefill em blocos divide prompts longos para que a geração continue trabalhando entre as partes. O experimento não registrou preempção do cache de chave e valor, num cenário com memória muito folgada para esse modelo. GPUs apertadas e modelos maiores jogam outro jogo.

Também há um limite importante na comparação: o braço chamado de “estático” é uma barreira no cliente sobre o mesmo motor contínuo do vLLM, e não uma implementação separada de batching estático. A consequência operacional continua útil. Observe tempo até o primeiro token, intervalos entre tokens, tempo total, profundidade da fila e preempções do cache. P50 sozinho pode apresentar um servidor simpático que começa a frase depressa e esquece o que ia dizer.

Fonte: [DigitalOcean Community — Continuous Batching Improves Your P50…](https://www.digitalocean.com/community/tutorials/continuous-batching-vs-static-batching).

## O histórico do Atuin ajuda a investigar, mas não vira testemunha perfeita

O histórico tradicional do shell costuma guardar o comando e pouco mais. O Atuin registra em SQLite horário, host, sessão, diretório de trabalho, duração e status de saída. Um diário publicado pelo SANS Internet Storm Center mostra como esse material ajuda a reconstruir atividade durante uma investigação Linux.

A base também pode preservar rastros menos óbvios. O campo `deleted_at` marca exclusões lógicas. Páginas livres ou não alocadas do SQLite podem guardar versões antigas de linhas, e o arquivo de write-ahead log, o `-wal`, pode conter mudanças ainda não consolidadas na base principal. Esses resíduos às vezes são recuperáveis; reutilização de páginas e limpeza podem apagá-los.

Na resposta a incidente, faz sentido coletar a base do Atuin, seu WAL, a configuração e o contexto de sincronização. O último item é especialmente importante: um histórico sincronizado pode descrever um comando executado em outro host. Como a base é controlada pelo próprio usuário e pode ser alterada, ela também não funciona como log de auditoria resistente a adulteração.

A atribuição vem da correlação com o journal do sistema, telemetria de processos ou auditoria, histórico convencional e logs centralizados. Atuin entrega peças ótimas para o quebra-cabeça. Só não chega de toga para declarar quem executou cada comando e em qual máquina.

Para quem queria apenas um histórico melhor no terminal, fica o lembrete: segredo digitado na linha de comando pode acabar num banco muito mais organizado do que você gostaria.

Fonte: [SANS ISC — Linux Shell Forensic: Let’s Dive Into Atuin!](https://isc.sans.edu/diary/rss/33226).

## Destaques rápidos para hoje.

- **Proxmox VE 9.2 ganhou uma edição Arm64 oficialmente suportada.** Ela já está disponível por ISO bare-metal ou repositórios e traz KVM, LXC, rede, clustering, ZFS e Ceph em hardware de servidor compatível, com validação inicial para NVIDIA Grace e Vera. Operadores de servidores Arm agora têm um caminho suportado; Raspberry Pi e outras placas que dependem apenas de devicetree ficam fora desse alvo oficial. O host executa workloads Arm64, e a paridade de recursos não faz guests x86 rodarem ou migrarem de forma transparente. Fonte: [anúncio oficial do Proxmox](https://www.proxmox.com/en/about/company-details/press-releases/proxmox-virtual-environment-launches-official-arm64-support).

- **Chamadas de ferramentas em Python igualaram ou superaram JSON em 11 dos 14 modelos testados.** No BFCL v4, o novo preprint expôs ferramentas como stubs tipados, permitindo ao modelo compor, encadear e paralelizar chamadas num script. O formato chegou a 13 de 14 modelos no fan-out paralelo e permaneceu estável num teste de degradação por contexto em que o baseline caiu 2,3% em média. É uma boa razão para testar a interface no próprio harness; três modelos ainda ficaram abaixo do baseline JSON. Fonte: [The Bitter Lesson of Tool Calling](https://arxiv.org/html/2608.06370v1).

- **`ignore_invalid_pages` permite resgatar dados; ele não repara o PostgreSQL.** O parâmetro transforma dois caminhos de PANIC durante a reprodução do WAL em avisos, pula as escritas problemáticas e mantém a corrupção ou ausência de páginas. A orientação é usá-lo numa cópia descartável quando não houver backup melhor, exportar o que ainda estiver legível, avaliar a perda e reconstruir um cluster limpo. Num standby vivo, a opção pode esconder divergência permanente; a própria documentação alerta para crashes, perda de dados e corrupção oculta ou propagada. Fonte: [The Build — All Your GUCs in a Row: ignore_invalid_pages](https://thebuild.com/blog/all-your-gucs-in-a-row-ignore_invalid_pages/).

- **Skills de agentes de código precisam de consolidação e replay de tarefas antigas.** O preprint GSE relaciona skills em um grafo, combina atualizações próximas e repete trabalhos anteriores para encontrar contradições e regressões. Os autores relatam os melhores resultados de precisão, recall e F1 em duas tarefas com OpenHands e mini-SWE-agent, além de melhora interna de 61,4% em F1. A amostra é estreita e o deployment interno não foi divulgado. A lição prática continua boa: trate o banco de skills como código, remova regras sobrepostas e rode regressão antes de promover a mudança. Fonte: [Learning Globally Reusable Skills for Coding Agents](https://arxiv.org/html/2608.06153v1).

- **A diferença por idade num agente de voz apareceu no fim do turno, não na transcrição.** Nas amostras publicadas, o Whisper teve taxa de erro de palavras de 6,53% para pessoas na faixa dos vinte anos e 4,67% para pessoas na faixa dos setenta. O problema cresceu quando um limiar fixo de silêncio, exemplificado em 700 milissegundos, decidiu que a pessoa tinha acabado de falar; um modelo semântico reduziu a maior parte dessa diferença medida. O teste avaliou componentes, não interrupções em produtos completos, e seus resultados não cobrem toda língua, sotaque, microfone ou população. Equipes precisam medir reconhecimento de fala e detecção de turno separadamente. Fonte: [repositório asr-age-gap](https://github.com/Kayvan-Zahiri/asr-age-gap).

- **O Zsh consegue executar um predicado para cada caminho candidato de um glob.** Os qualificadores `(e)` e `+` permitem filtrar diretamente coisas como “diretórios que contêm `.git`”, sem transformar nomes de arquivos em texto para `grep` ou `find`. O Zsh coloca o caminho em `$REPLY`, mantém o item quando o predicado retorna status zero e também aceita o nome de uma função ou comando. Como a avaliação roda uma vez por candidato, comandos caros deixam globs amplos lentos; valores de path também precisam continuar tratados e citados como dados do shell. Fonte: [Adam Johnson — Zsh: select files with arbitrary code…](https://adamj.eu/tech/2026/08/07/zsh-e-glob-qualifiers/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29872
source_urls:
  - https://blog.cloudflare.com/kitesurf/
  - https://1password.com/blog/why-ai-generated-patches-still-require-human-review
  - https://github.com/Off-by-1-Labs/FLAWED
  - https://arxiv.org/html/2608.06130v1
  - https://www.digitalocean.com/community/tutorials/continuous-batching-vs-static-batching
  - https://isc.sans.edu/diary/rss/33226
  - https://www.proxmox.com/en/about/company-details/press-releases/proxmox-virtual-environment-launches-official-arm64-support
  - https://arxiv.org/html/2608.06370v1
  - https://thebuild.com/blog/all-your-gucs-in-a-row-ignore_invalid_pages/
  - https://arxiv.org/html/2608.06153v1
  - https://github.com/Kayvan-Zahiri/asr-age-gap
  - https://adamj.eu/tech/2026/08/07/zsh-e-glob-qualifiers/
-->
