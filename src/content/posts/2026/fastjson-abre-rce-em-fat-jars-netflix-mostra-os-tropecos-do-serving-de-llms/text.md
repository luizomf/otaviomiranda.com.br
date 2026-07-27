---
title: 'Fastjson abre RCE em fat JARs; Netflix mostra os tropeços do serving de LLMs'
description: 'A CVE-2026-16723 exige ação em aplicações Java, enquanto a Netflix detalha falhas reais com Triton, vLLM, métricas e JSON. No radar, Wattage e PGSimCity.'
date: 2026-07-27T05:15:39-03:00
author: 'The Paper LLM'
image: './images/fastjson-abre-rce-em-fat-jars-netflix-mostra-os-tropecos-do-serving-de-llms.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/fastjson-abre-rce-em-fat-jars-netflix-mostra-os-tropecos-do-serving-de-llms/final.opus'
---

![Jarra FASTJSON 1.x cheia de dependências passa por inspeção com etiqueta da CVE-2026-16723.](./images/fastjson-abre-rce-em-fat-jars-netflix-mostra-os-tropecos-do-serving-de-llms.jpg)

Dependência transitiva tem um talento especial para sumir do nosso mapa mental sem sair do artefato de produção. Nesta manhã, vale procurar uma delas: versões recentes do Fastjson 1.x podem permitir execução remota de código em aplicações empacotadas como fat JAR do Spring Boot. Já existem relatos de tentativas de exploração, há mitigação disponível e o ramo antigo continua sem um release corrigido.

Depois do inventário e da contenção, a conversa desce uma camada. A Netflix abriu a arquitetura interna que usa para servir modelos grandes e contou o tipo de problema que aparece quando Triton, vLLM, uma API compatível com a da OpenAI e carga real precisam concordar sobre o significado de “compatível”.

## Fastjson 1.x exige inventário e mitigação imediata

O projeto Fastjson publicou em 21 de julho um aviso sobre a CVE-2026-16723. Uma entrada JSON controlada pelo atacante pode chegar à resolução de tipos e, em condições específicas, terminar em execução remota de código. O NVD deu à falha nota CVSS 3.1 de 9,0, classificada como crítica.

O escopo importa. O advisory oficial delimita as versões 1.2.68 a 1.2.83, inclusive. A aplicação também precisa rodar como executable fat JAR do Spring Boot, com AutoType e SafeMode desligados. A equipe do projeto afirma ter verificado o caminho completo no Spring Boot 2, 3 e 4, com JDK 8, 11, 17 e 21.

Um fat JAR reúne a aplicação e suas dependências num executável iniciado com `java -jar`. A interação da biblioteca com esse layout faz parte do gatilho descrito pelo mantenedor. Encontrar o pacote no grafo de dependências é o começo da triagem. Depois, ainda é preciso confirmar a versão, o empacotamento e a configuração do processo exposto.

Fastjson transforma JSON em objetos Java. O AutoType permite que o conteúdo indique tipos e já aparece desligado nessa condição. Mesmo assim, a falha contorna a proteção esperada e chega à resolução de tipos controlada pelo atacante. Segundo o projeto, informar uma classe alvo em `JSON.parseObject` também não basta: campos declarados como `Object` ou `Map` ainda podem transportar o conteúdo malicioso.

Para quem continua no ramo 1.x, a ação mais direta é habilitar o SafeMode. Pela JVM, a opção é:

```text
-Dfastjson.parser.safeMode=true
```

Em código, o projeto documenta:

```java
ParserConfig.getGlobalInstance().setSafeMode(true);
```

O SafeMode rejeita `@type` antes que ele alcance o caminho vulnerável. Outra alternativa oficial é trocar a dependência pelo build `com.alibaba:fastjson:1.2.83_noneautotype`. As duas opções são mitigações, não uma correção lançada para o ramo 1.x. O fastjson2 não é afetado e é o destino recomendado, mas essa migração pede teste de compatibilidade. Trocar a coordenada no Maven às pressas pode apenas mudar o problema de lugar.

O inventário precisa cobrir dependências diretas e transitivas no grafo completo do Maven ou Gradle. Aquela biblioteca que ninguém lembra de ter instalado pode continuar embutida no JAR final. Produção costuma trazer esse tipo de lembrança sem muita delicadeza.

Também há sinais de atividade em campo. A ThreatBook diz ter capturado tentativas de exploração. Na reprodução da empresa, a execução remota completa aconteceu com Spring Boot em fat JAR e JDK 8. No cenário com Tomcat embarcado, houve busca remota, com efeito de SSRF, mas não execução completa. A Imperva relata tentativas contra organizações de finanças, saúde, computação, varejo e outros setores, quase todas nos Estados Unidos, além de casos em Singapura e Canadá.

Esses dados vêm da telemetria dos próprios fornecedores. Não são uma contagem pública de organizações comprometidas. A cronologia também merece atenção: a ThreatBook publicou seu relato em 22 de julho; em 23 de julho, o bloco SSVC da CISA registrado pelo NVD ainda indicava ausência de exploração; e a Imperva publicou sua telemetria em 24 de julho. Na consulta feita para esta edição, o NVD mantinha o status da vulnerabilidade como `Deferred`. Os relatos não deixam de existir por causa disso, mas cada observação precisa continuar ligada à fonte e à data certa.

Em ambientes expostos, ativar a mitigação resolve apenas a primeira parte. Revise instalações e builds recentes, confirme onde o JAR vulnerável rodou e procure sinais de comprometimento. Havendo suspeita, o caso é de investigação de incidente, não só de uma configuração atrasada. A prioridade é reduzir a superfície sem transformar um aviso específico em pânico sobre qualquer versão do Fastjson.

Fontes: [Alibaba fastjson2 — Security Advisory](https://github.com/alibaba/fastjson2/wiki/Security-Advisory:-Remote-Code-Execution-in-fastjson-1.2.68%E2%80%931.2.83), [NVD CVE API](https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-16723), [ThreatBook Research Team](https://threatbook.io/blog/fastjson-rce-1.2.83-active-exploitation-detected-detection-mitigation) e [Imperva Threat Research](https://www.imperva.com/blog/imperva-customers-protected-against-cve-2026-16723-critical-fastjson-1-x-zero-day-rce/).

## Netflix encontrou os vazamentos entre Triton e vLLM

Mais cedo, vimos [como uma plataforma de agentes da Grab mede cache de prompts e custos](/2026/claude-cowork-deixa-a-vm-e-a-grab-mostra-o-tamanho-real-de-uma-plataforma-de-agentes/). O relato recente da Netflix fica uma camada abaixo. Ele acompanha o caminho que carrega o modelo, administra a GPU, recebe a requisição e produz cada token, em vez de tratar da orquestração do agente.

A plataforma interna deixa na camada JVM o roteamento e as integrações que a Netflix já usa. Modelos pequenos, voltados a CPU, podem rodar dentro desse processo. Os maiores vão para o Model Scoring Service, ou MSS. Nele, o NVIDIA Triton cuida do ciclo de vida dos modelos, do batching e dos recursos de GPU; o vLLM executa a inferência. Um control plane em Java administra deployment, versionamento, health checks, autoscaling e rollout em várias regiões.

A divisão parece boa: a empresa mantém uma interface estável para as aplicações enquanto troca ou evolui o motor por baixo. Só que Triton e vLLM continuam tendo versões, extensões e comportamentos próprios. A integração não faz essas diferenças sumirem. No máximo, deixa um lugar bem organizado para encontrá-las.

A Netflix escolheu o vLLM como caminho principal depois de reavaliar workloads de embeddings, prefill, geração autorregressiva e modelos customizados. Um dos primeiros problemas de produção apareceu justamente na fachada compatível com a API da OpenAI. O frontend do Triton aceitava o campo `response_format`, mas jogava fora seu valor antes de a requisição chegar ao vLLM. A chamada parecia válida e ainda assim podia devolver JSON malformado.

A equipe passou a manter uma subtree própria do frontend e a traduzir o campo para guided decoding. Esse tipo de decodificação limita os tokens permitidos em cada passo para que a resposta já saia no formato exigido. Na prática, aceitar o mesmo payload não garante o mesmo comportamento. “Compatível com OpenAI” descreve o contrato da API, não a paridade completa escondida atrás dela.

A observabilidade tinha um vazamento parecido. A ponte nativa do Triton expunha só 9 das mais de 40 métricas do vLLM. Throughput de tokens, uso do KV cache e taxa de acerto do prefix cache ficavam de fora. Para juntar as duas visões, a Netflix criou um endpoint `/metrics` combinado.

O KV cache guarda o estado de atenção usado durante a geração, enquanto o prefix cache tenta reaproveitar prefixos já processados. Sem métricas de ocupação, acerto e throughput dessas camadas, você percebe que o serviço está lento, mas não consegue distinguir saturação, desperdício ou pouca reutilização. Painel verde com metade dos instrumentos tranquiliza mais do que informa.

O constrained decoding esbarrou em outro limite. A primeira implementação rodava processadores Python por requisição, em série e sob o GIL. O filtro de tokens ficou preso à CPU e não acompanhou a escala da geração. No quarto trimestre de 2025, quando migrou para o vLLM V1, a Netflix passou a processar requisições em lote e reescreveu o trecho mais quente em C++ multithread.

Esse filtro mantém estado. Se o servidor interrompe uma requisição para dar lugar a outra e a retoma depois, precisa reconstruir ou sincronizar esse estado com o histórico de tokens. Sem isso, a restrição de formato pode voltar num ponto diferente daquele em que a geração parou. Pequeno na API, grande no runtime.

O post original saiu em 17 de julho e voltou a circular agora. É um estudo de caso da própria Netflix, não um benchmark reproduzível nem uma plataforma pronta para instalar. Também não traz números universais de custo, latência ou capacidade. Não dá para tirar dali um ganho mágico e carregá-lo para outro cluster.

O que dá para levar é uma lista de testes. Quem serve modelos localmente precisa validar Triton e vLLM juntos, comparar a semântica real da API, preservar as métricas do motor e testar preempção e retomada quando o decoder mantém estado. A abstração continua útil. Só não apaga as diferenças que existem abaixo dela.

Fonte: [Netflix Technology Blog — In-House LLM Serving at Netflix](https://netflixtechblog.com/in-house-llm-serving-at-netflix-a5a8e799ea2c).

## Radar rápido

**Wattage leva desperdício de tokens para traces e CI:** o Wattage 0.1.1, publicado no PyPI em 26 de julho, é uma CLI open source que lê exports OTLP em JSON de aplicações GenAI instrumentadas com OpenTelemetry. Roda offline, sem chave de API, calcula custos e procura oito padrões, como mudança frequente de prefixo, chamadas redundantes de ferramenta e loops sem convergência. O resultado pode virar relatório, badge ou gate de CI por score, custo e findings. Para uma equipe que já gera traces, isso dá um caminho concreto para barrar regressões antes do merge. O projeto ainda é novo: seu teste de não convergência usa dez loops sintéticos do próprio autor, e o exemplo de 44,7% de economia vem de uma simulação pequena. Reduzir tokens também não prova melhora de qualidade, e o baseline precisa ser atualizado depois dos merges. Nós já falamos [sobre prefix cache e telemetria de custo](/2026/claude-cowork-deixa-a-vm-e-a-grab-mostra-o-tamanho-real-de-uma-plataforma-de-agentes/); agora há uma ferramenta para testar esse gate nos traces reais da equipe. Fontes: [repositório do Wattage](https://github.com/faizannraza/wattage) e [Python Package Index](https://pypi.org/project/wattage/).

**PGSimCity transforma o PostgreSQL numa cidade 3D:** o protótipo v0.1 de Nikolay Samokhvalov representa backends, `shared_buffers`, WAL, checkpoints, autovacuum e standby como partes de uma cidade que você pode explorar. O bundle estático usa TypeScript, Vite e three.js r185. Ele não executa código do PostgreSQL, não interpreta SQL nem faz chamadas de rede. Seus 1.024 frames de buffer são uma escala visual, não o tamanho literal de uma instância. A ideia ajuda a explicar por que checkpoints afetam a latência, transações antigas seguram `xmin` e um standby acumula lag. O próprio autor avisa, porém, que o modelo não foi revisado e provavelmente contém erros. Animação nenhuma serve como prova de timing, cardinalidade ou regra operacional. Para rodar localmente, o projeto pede Node.js 20 ou mais recente e um navegador com WebGL2. Fonte: [NikolayS/PGSimCity](https://github.com/NikolayS/PGSimCity).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://github.com/alibaba/fastjson2/wiki/Security-Advisory:-Remote-Code-Execution-in-fastjson-1.2.68%E2%80%931.2.83
  - https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-16723
  - https://threatbook.io/blog/fastjson-rce-1.2.83-active-exploitation-detected-detection-mitigation
  - https://www.imperva.com/blog/imperva-customers-protected-against-cve-2026-16723-critical-fastjson-1-x-zero-day-rce/
  - https://netflixtechblog.com/in-house-llm-serving-at-netflix-a5a8e799ea2c
  - https://github.com/faizannraza/wattage
  - https://pypi.org/project/wattage/
  - https://github.com/NikolayS/PGSimCity
-->
