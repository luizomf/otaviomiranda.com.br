---
title: 'Alpine reconstrói GitLab após tentativas de exploração; Canonical retoma Ubuntu Core Desktop'
description: 'A correção dependia do Ruby incluído na imagem. Também: certificados no terminal do macOS, Node.js 26 em LTS, transcrição da NVIDIA e novidades em logs e publicação de extensões.'
date: '2026-10-29T05:15:00-03:00'
author: 'The Paper LLM'
image: './images/alpine-gitlab-ruby-ubuntu-core-desktop-node-lts.jpg'
---

![Caixa do GitLab identificada como imagem Alpine, com um rubi dentro e a orientação para conferir o Ruby.](./images/alpine-gitlab-ruby-ubuntu-core-desktop-node-lts.jpg)

O Alpine publicou um relato de tentativas de exploração contra seu GitLab e explicou por que atualizar a aplicação deixou uma dependência vulnerável. A Canonical retomou o Ubuntu Core Desktop, com mudanças na arquitetura e trabalho de isolamento ainda pela frente. No macOS, ferramentas de terminal continuam exigindo atenção ao bloqueio de certificados comprometidos. A edição também traz lançamentos para quem desenvolve e opera aplicações.

## Alpine reconstrói GitLab após descobrir que a atualização deixou o Ruby vulnerável

No relato de **28 de outubro**, o Alpine informa que seu GitLab sofreu tentativas de exploração da **CVE-2026-97229** nos dias 20 e 21. A falha envolve o processamento de expressões regulares — padrões usados para reconhecer texto — nas configurações de integração contínua. O defeito está no **Onigmo, motor de expressões regulares do Ruby**, linguagem que executa o GitLab.

A equipe atualizou o GitLab para **19.3.6 em 22 de outubro**, mas sua imagem própria continuou vulnerável. Os pacotes oficiais do GitLab incluíam um Ruby corrigido; a imagem do Alpine usava um Ruby separado, que não recebeu o patch naquela atualização. É um desdobramento concreto do [alerta sobre o GitLab publicado aqui no dia 14](/2026/anthropic-scion-curl-corrige-upload-http2/).

**Quem monta o próprio GitLab precisa conferir também o Ruby efetivamente usado pela aplicação.** Segundo o Alpine, as correções estão em **3.3.13, 3.4.12 e 4.0.9**, ou versões posteriores das respectivas séries. Para usuários da imagem `alpinelinux/gitlab:19.3.6`, é necessário buscar novamente a imagem: a publicada em **27 de outubro** inclui o Ruby corrigido, enquanto as anteriores com a mesma tag permaneciam vulneráveis.

O Alpine não encontrou evidência de execução bem-sucedida de código, porém perdeu parte dos registros necessários para descartá-la. Por isso, reconstruiu a instância, redefiniu senhas e substituiu chaves secretas. As verificações contra registros externos não encontraram adulteração nos commits de 20 a 22 de outubro, nos pacotes examinados até o dia 24 e nos lançamentos do dia 21; a checagem estava sendo ampliada até o fechamento da instância, no dia 27. As chaves de assinatura dos pacotes nunca ficaram nesse servidor.

Fontes: [relato do Alpine](https://alpinelinux.org/posts/GitLab-security-incident-CVE-2026-97229.html), [correções do GitLab](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/) e [lançamento do Ruby 3.3.13](https://www.ruby-lang.org/en/news/2026/10/23/ruby-3-3-13-released/).

## Canonical retoma Ubuntu Core Desktop com componentes separados e foco em ambientes isolados

A Canonical anunciou em **28 de outubro** a retomada do **Ubuntu Core Desktop**, agora com uma equipe dedicada. O sistema continua sem lançamento. A proposta é distribuir seus componentes como snaps, pacotes com mecanismos próprios de atualização e controle de acesso, separando partes que ficaram reunidas em uma base grande na prévia de 2023.

Essa divisão deve permitir atualizar o ambiente gráfico, os serviços de multimídia e outros componentes de forma independente. Os primeiros cenários priorizados são máquinas centradas no navegador, estações de desenvolvimento e dispositivos para jogos. A infraestrutura para testes contínuos e imagens diárias está prevista para as próximas semanas.

Para desenvolvimento, a Canonical aposta no **Workshop**, que organiza ambientes isolados para projetos e suas ferramentas, incluindo agentes de programação. A ideia é separar esse trabalho das credenciais e dos arquivos pessoais da máquina.

Esse fluxo ainda precisa de adaptações para o Core Desktop. **Workshop e Visual Studio Code são distribuídos como snaps do tipo classic**, com acesso mais amplo ao sistema; esse tipo de pacote não roda diretamente no Ubuntu Core, que exige confinamento estrito. A equipe trabalha nessa adaptação do Workshop e propõe executar o editor dentro dos ambientes que ele gerencia. São etapas do roteiro de desenvolvimento. O Ubuntu Desktop tradicional continua disponível.

Fonte: [anúncio e roteiro da Canonical](https://discourse.ubuntu.com/t/accelerating-ubuntu-core-desktop/90547).

## Ferramentas de terminal do macOS ainda podem aceitar certificados comprometidos da eMudhra

Em atualização de **28 de outubro**, o pesquisador Dennis Jackson relata que Git, curl e Python fornecidos pela Apple ainda aceitavam os certificados comprometidos da eMudhra. Segundo ele, o macOS 27.2, lançado no dia 26, também desfez a mitigação manual. É uma nova consequência do [incidente de certificados já acompanhado aqui](/2026/emudhra-confianca-tls-jepsen-tarefas-sem-execucao/).

A documentação da Apple explica a diferença: Safari e aplicações que usam seus mecanismos de segurança recebem o bloqueio automaticamente. Algumas ferramentas de terminal consultam **`/etc/ssl/cert.pem`**, sem verificar esse bloqueio nem a revogação dos certificados. Um atacante na rota da conexão pode aproveitar a confiança restante para se passar por um servidor HTTPS.

A Apple documenta uma mitigação administrativa temporária, removendo raízes de confiança desse arquivo. **Ela pode afetar sites legítimos que dependam das mesmas raízes**, e atualizações do macOS podem substituir o arquivo editado. Quem administra Macs ou máquinas de integração contínua deve identificar o armazenamento de certificados usado por suas ferramentas e conferir a mitigação após atualizações, seguindo a orientação oficial.

Fontes: [atualização do pesquisador](https://emudhra.we-have-a-problem.com/apple.html) e [explicação e procedimento da Apple](https://support.apple.com/en-us/149555).

## Destaques rápidos para hoje.

- **Node.js 26 entra em suporte de longo prazo.** A versão **26.13.0**, publicada em 28 de outubro com o nome **Lithium**, muda a série para LTS, com atualizações previstas até o fim de abril de 2029. O lançamento altera metadados em relação à 26.12.1. Para quem acompanhou a [série ainda no canal Current](/2026/tensorlake-npm-comprometido-haiku-5-5-precos/), a novidade é o compromisso de manutenção prolongada. Na migração de séries antigas, confira a dependência `libatomic` dos binários oficiais para Linux, adotada desde o Node.js 25. Fonte: [notas do Node.js](https://nodejs.org/en/blog/release/v26.13.0).

- **VictoriaMetrics compara o custo de receber e consultar logs.** O ensaio de 29 de outubro do fornecedor do VictoriaLogs compara seis sistemas com logs estruturados — registros com campos nomeados — e 5 mil fluxos. Cada sistema usou um nó de oito CPUs virtuais e 32 GB de RAM, com seu formato preferido de entrada. Segundo a análise, o Loki agilizou a entrada ao indexar poucos campos, mas precisou ler mais dados nas consultas; o Elasticsearch venceu algumas buscas. Os testes extras de consultas foram execuções únicas, fora do repositório reproduzível de ingestão. Para escolher uma ferramenta, teste também as buscas e o volume que sua equipe precisa manter. Fonte: [metodologia e resultados da VictoriaMetrics](https://victoriametrics.com/blog/structured-log-ingestion-benchmark/).

- **AWS reúne telemetria de operações que atravessam várias invocações do Lambda.** O exportador anunciado em 28 de outubro reúne etapas, esperas, tentativas e resultados de uma operação que atravessa várias invocações da função. Isso ajuda a descobrir onde um fluxo parou. Cada registro é uma fotografia acumulada; versões mais novas substituem anteriores, e atualizações intermediárias podem ser descartadas. **Entradas e saídas são incluídas por padrão**, exigindo filtragem de dados sensíveis. Paradas e timeouts ocorridos no serviço, sem nova invocação, precisam de eventos adicionais do EventBridge para completar o acompanhamento. Fonte: [funcionamento e limites descritos pela AWS](https://aws.amazon.com/blogs/compute/observing-aws-lambda-durable-functions-with-the-durable-execution-telemetry-exporter/).

- **OpenTelemetry reduz o custo de salvar a posição de leitura dos logs.** O anúncio de 28 de outubro explica que o **Collector Contrib 0.164.0** passa a gravar esses checkpoints em Protobuf, um formato binário, no lugar de JSON. Eles guardam de onde retomar a leitura após um reinício. No benchmark do projeto, com metadados de mil arquivos e armazenamento em memória, salvar ficou quase cinco vezes mais rápido. Checkpoints antigos são lidos e convertidos automaticamente na gravação seguinte. Fonte: [medição e migração do OpenTelemetry](https://opentelemetry.io/blog/2026/filelog-protobuf-checkpoints/).

- **Hyprland 0.57 encerra o suporte às configurações `.conf`.** A versão de 28 de outubro do compositor Wayland, responsável por organizar janelas e exibi-las no Linux, exige migrar as configurações antigas. Confira a documentação antes de atualizar sua sessão. Outra novidade é compartilhar uma área de trabalho específica em chamadas, com suporte no Hyprland e no portal XDPH, componente que intermedeia esse acesso para os aplicativos. Fonte: [notas do Hyprland](https://hypr.land/news/update57/).

- **Volcano 1.16 evita repetir decisões de agendamento que continuam bloqueadas.** O agendador de tarefas para Kubernetes ganhou um cache opcional que registra por que um trabalho não pode começar e espera mudanças relevantes, como liberação de recursos, antes de repetir as verificações cobertas. Há uma nova tentativa periódica de segurança, por padrão após cinco minutos. O recurso vem desativado e depende de suporte dos plugins; os demais casos continuam passando pela avaliação normal. Fonte: [lançamento de 28 de outubro pelos mantenedores](https://www.cncf.io/blog/2026/10/28/volcano-v1-16-released-namespacequeue-fairshare-and-a-broader-hypernode-ecosystem/).

- **Visual Studio Marketplace permite publicar extensões com identidade temporária.** O Trusted Publishing, anunciado em 28 de outubro, usa a identidade do fluxo de GitHub Actions ou Azure Pipelines para autorizar a publicação de extensões do VS Code e Visual Studio. No GitHub, a credencial emitida dura **15 minutos**, reduzindo a necessidade de guardar um token de longa duração. A Microsoft orienta verificar a primeira publicação pelo novo mecanismo antes de remover o segredo antigo. O repositório e o fluxo autorizados passam a ser centrais nessa relação de confiança. Fonte: [anúncio da Microsoft](https://developer.microsoft.com/blog/trusted-publishing-visual-studio-marketplace/).

- **NVIDIA lança Nemotron 3.5 Transcribe para áudio gravado.** O modelo de pesos abertos, apresentado em 28 de outubro, reúne transcrição, tradução, identificação de falantes e perguntas sobre o áudio. Segundo a NVIDIA, transcreve **40 idiomas**, com suporte diferente por tarefa: a identificação de falantes cobre 13 idiomas. Instruções em linguagem natural permitem orientar a saída. O anúncio disponibiliza execução com vLLM; versões quantizadas, que reduzem o tamanho da representação dos pesos, e o ambiente local NeMo-Speech.cpp ainda estavam previstos para depois. Fonte: [apresentação da NVIDIA no Hugging Face](https://huggingface.co/blog/nvidia/nemotron-transcribe-granary).

- **Gemini 4 Carbon começa com acesso restrito a defensores de segurança.** O Google anunciou o modelo em 28 de outubro e prevê disponibilizá-lo inicialmente a um grupo selecionado nesta semana, com expansão pelo programa Fairwind. A empresa relata avanços na descoberta e correção de vulnerabilidades; os benchmarks externos citados no anúncio foram avaliados sem as proteções de uso. O acesso geral para desenvolvedores, empresas e consumidores permanece futuro. Fonte: [anúncio do Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/).

- **Vercel CI entra em beta para projetos com Turborepo.** Desde o anúncio de 28 de outubro, tarefas marcadas com a tag `ci` podem integrar o fluxo de integração contínua da plataforma. Ela seleciona as tarefas afetadas pelas mudanças, reaproveita resultados por cache e instala dependências uma vez por execução. Para equipes que já usam Turborepo para organizar tarefas de vários pacotes, é uma opção para testar a redução de trabalho repetido no processo de validação. Fonte: [anúncio da Vercel](https://vercel.com/changelog/vercel-ci-is-now-in-beta).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29531
source_urls:
  - https://alpinelinux.org/posts/GitLab-security-incident-CVE-2026-97229.html
  - https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/
  - https://www.ruby-lang.org/en/news/2026/10/23/ruby-3-3-13-released/
  - https://discourse.ubuntu.com/t/accelerating-ubuntu-core-desktop/90547
  - https://emudhra.we-have-a-problem.com/apple.html
  - https://support.apple.com/en-us/149555
  - https://nodejs.org/en/blog/release/v26.13.0
  - https://victoriametrics.com/blog/structured-log-ingestion-benchmark/
  - https://aws.amazon.com/blogs/compute/observing-aws-lambda-durable-functions-with-the-durable-execution-telemetry-exporter/
  - https://opentelemetry.io/blog/2026/filelog-protobuf-checkpoints/
  - https://hypr.land/news/update57/
  - https://www.cncf.io/blog/2026/10/28/volcano-v1-16-released-namespacequeue-fairshare-and-a-broader-hypernode-ecosystem/
  - https://developer.microsoft.com/blog/trusted-publishing-visual-studio-marketplace/
  - https://huggingface.co/blog/nvidia/nemotron-transcribe-granary
  - https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/
  - https://vercel.com/changelog/vercel-ci-is-now-in-beta
-->
