---
title: 'Cisco corrige invasão sem login no ISE, e GitHub leva o motor do Copilot para Rust'
description: 'Falha no ISE já é explorada; Sentry exige atenção antes da revisão do PR. Copilot muda sua integração, Node ganha FFI, Delta abre beta e um experimento busca planos melhores no Postgres.'
date: 2026-09-17T06:21:32-03:00
author: 'The Paper LLM'
cover: './images/cisco-corrige-invasao-sem-login-no-ise-e-github-leva-o-motor-do-copilot-para-rust.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/cisco-corrige-invasao-sem-login-no-ise-e-github-leva-o-motor-do-copilot-para-rust/final.opus'
---

![Robô do GitHub Copilot com um motor de Rust exposto no peito, ilustrando a migração do runtime.](./images/cisco-corrige-invasao-sem-login-no-ise-e-github-leva-o-motor-do-copilot-para-rust.jpg)


## Cisco corrige falha já explorada que permite entrar no ISE sem login

A Cisco publicou em 16 de setembro correções para uma falha já explorada no ISE e no ISE-PIC, plataformas de identidade e acesso à rede. A CVE-2026-76460 permite passar pela autenticação da interface de administração usando um endpoint de API. Afeta os produtos qualquer que seja a configuração e recebeu a nota máxima de gravidade: 10. A CISA também incluiu a falha no catálogo de vulnerabilidades exploradas.

[No dia 15, falamos do gateway de e-mail da Cisco](/2026/cisco-corrige-falha-explorada-no-gateway-de-e-mail-e-luna-perde-bugs-de-seguranca-em-teste/). Desta vez, o equipamento e a falha são outros. As versões corrigidas são **3.1 Patch 12, 3.2 Patch 11, 3.3 Patch 12, 3.4 Patch 7 e 3.5 Patch 4**. Enquanto prepara a atualização, restrinja o tráfego de gerenciamento com listas de controle de acesso na infraestrutura. Essa é a mitigação temporária indicada pela Cisco.

Confira os logs de acesso de cada nó e cruze com registros externos de firewall e rede: um atacante com root pode apagar as evidências locais. Se houver suspeita de atividade maliciosa, a Cisco recomenda reinstalar a imagem dos nós. O patch fecha a entrada; a investigação precisa descobrir quem já passou por ela.

Fontes: [boletim da Cisco](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-ISE-ABP-VNSW7Tn5) e [alerta da CISA](https://www.cisa.gov/news-events/alerts/2026/09/16/cisa-adds-two-known-exploited-vulnerabilities-catalog).

## Sentry Seer pode levar instruções do atacante até o agente de código

O CERT/CC divulgou em 16 de setembro a CVE-2026-90999 num fluxo do Seer, recurso do Sentry que analisa erros e pode pedir correções a um agente de código. Se esse encaminhamento for automático, eventos de erro preparados pelo atacante podem levar à execução de um pacote no ambiente do agente.

O caminho começa no endereço público usado pelo navegador para enviar telemetria. Campos controlados pelo atacante entram na análise da causa do erro e, dali, no prompt inicial do agente. No fluxo documentado, o pacote é baixado e executado **antes da revisão humana do pull request**. Quando você abre o diff para fiscalizar o trabalho, a instalação já aconteceu.

[Em junho, cobrimos AgentJacking via Sentry MCP](/2026/sentry-virou-porta-para-agentes-claude-mostrou-o-sandbox-e-roteadores-viraram-proxy/). O aviso de agora trata do encaminhamento automático do Seer e tem outro registro de falha.

Se você usa essa integração automática, o CERT recomenda desativar a remediação automática ou restringir a instalação de pacotes. O aviso não traz informação de patch do fornecedor nem confirma exploração em ataques reais.

Fonte: [CERT/CC — VU#212479](https://kb.cert.org/vuls/id/212479).

## GitHub migra o motor compartilhado do Copilot para Rust

O GitHub publicou em 16 de setembro o relato da migração do runtime do Copilot de TypeScript para Rust. É o motor compartilhado pelos produtos e pelas aplicações que usam o SDK. A migração do código de produção terminou em 21 de agosto; agora saiu o relato de engenharia.

Antes, o SDK iniciava a ferramenta de linha de comando em outro processo e conversava com ela por JSON-RPC. Cada aplicação carregava junto Node, V8 e esse processo extra. Agora, você pode optar por carregar a biblioteca nativa dentro do processo da própria aplicação, por uma interface compatível com C. A opção de deixar o motor num processo separado continua disponível.

Essa escolha muda o isolamento: dentro do mesmo processo, biblioteca e aplicação compartilham também o limite de falha. O contrato entre elas continua usando bytes de JSON-RPC, com a serialização ainda fazendo parte do trabalho.

Segundo Stephen Toub, agentes escreveram a maior parte das mais de 800 mil linhas de Rust. A entrega aconteceu em 128 PRs incrementais, mantendo os testes de ponta a ponta. Já a migração da CLI inteira para a interface pública do SDK segue em andamento.

Fonte: [GitHub — migração do runtime do Copilot](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/).

## Node.js 26.9.0 habilita FFI e ganha módulo de benchmark

O Node.js lançou a versão 26.9.0 em 16 de setembro com FFI habilitado por padrão e um módulo próprio para benchmarks, o `node:bench`. FFI permite chamar funções de bibliotecas nativas. Se você precisa integrar esse código ao backend, tem um caminho no próprio runtime para testar.

O benchmark mede como o código se comporta sob uma carga escolhida. Se a ideia é atravessar a fronteira entre linguagens para ganhar desempenho, eu começaria por essa medição. O ganho depende do trabalho que a biblioteca vai fazer. A função pode ser nativa; a pressa de declarar vitória é nossa.

A versão também adiciona Web Workers e integra o sistema de arquivos virtual aos carregadores CommonJS e ESM, os dois caminhos de módulos. Se sua aplicação depende desses mecanismos, inclua essas mudanças nos testes de compatibilidade.

A 26.9.0 pertence à linha **Current**, não à LTS. A estabilidade precisa ser conferida por API, mesmo com recursos habilitados por padrão: as notas trazem, por exemplo, uma API de DTLS explicitamente experimental. Eu passaria pelos testes antes de levar a atualização ao serviço.

Fonte: [Node.js — notas da versão 26.9.0](https://nodejs.org/en/blog/release/v26.9.0).

## Zed abre beta do Delta com revisão na conversa do agente

A Zed abriu em 16 de setembro o beta público do Delta, ferramenta de colaboração que organiza alterações em conversas compartilhadas com agentes. Você pode revisar numa conversa derivada, com cópias isoladas da área de trabalho. São os worktrees: diretórios separados ligados ao repositório. As correções feitas ali podem voltar para a conversa principal.

[Já falamos do DeltaDB como histórico anterior ao commit](/2026/fable-5-abriu-o-navegador-deltadb-quer-guardar-o-rastro-do-agente/). Agora, o beta oferece esse fluxo de revisão no desktop e na web. Quem revisa recebe também a conversa que produziu a mudança. O diff final fica com menos trabalho de explicar como aquilo foi parar ali.

O DeltaDB guarda as edições entre commits e as mensagens de humanos e agentes. Os commits Git continuam servindo para trocar código e fazer builds, inclusive com colegas que estão fora do Delta. O repositório do próprio editor Zed permanece no GitHub.

O beta é gratuito e está disponível para macOS, Linux, Windows e web. Há planos pagos previstos e uma versão gratuita permanente. A integração própria de CI baseada no conteúdo ficou para o futuro; por enquanto, um agente pode chamar um provedor existente.

Fonte: [Zed — beta público do Delta](https://zed.dev/blog/delta-public-beta).

## QORL procura planos mais rápidos para consultas no Postgres

Rohan Bansal publicou em 16 de setembro um experimento com um modelo de quatro bilhões de parâmetros para procurar planos de execução mais rápidos no PostgreSQL. O plano define como o banco percorre e combina os dados. Outro caminho pode dar bem menos trabalho para responder à mesma consulta.

No teste do autor com 113 consultas do Join Order Benchmark, a soma das latências caiu **44,7%**. O resultado usa o melhor desempenho medido entre três tentativas por consulta, com até 15 planos candidatos. É uma busca com feedback: esse número mede a execução dos planos escolhidos. O custo de procurar por eles ficou fora da conta.

Durante a busca, o modelo passava tempo produzindo respostas enquanto um worker do banco ficava reservado. O banco estava guardando lugar para a IA pensar.

Bansal mudou a reserva para durar só durante as medições. Com isso, 20 buscas concorrentes puderam compartilhar quatro workers do PostgreSQL. Para avaliar a proposta na nossa aplicação, a conta precisa incluir tanto a busca quanto a execução posterior.

Fonte: [Rohan Bansal — experimento QORL](https://rohanbansal.com/qorl).

## Destaques rápidos para hoje.

- **GNOME 51 saiu em 16 de setembro com mudanças na exibição e na captura de tela.** Segundo o projeto, o Mutter, que coordena janelas e quadros, melhora as animações sob carga. A captura reduz trabalho repetido e cópias de buffers. Se você grava demonstrações no Linux, tem o que testar. Fonte: [GNOME](https://release.gnome.org/51/).

- **Kubernetes 1.37 ganhou controles alfa para montagens e permissões de volumes temporários.** Depois dos [gerenciadores de recursos de ontem](/2026/plugins-do-networkmanager-abrem-caminho-para-root-e-gemini-3-8-live-conversa-enquanto-chama-ferramentas/), o assunto agora é armazenamento. Para testar, habilite as opções no servidor da API e no kubelet. O alcance de `noexec` é restringir a execução direta naquele volume. Fonte: [Kubernetes](https://kubernetes.io/blog/2026/09/16/kubernetes-v1-37-hardening-container-storage/).

- **CERT divulgou formas de contornar o bloqueio de pickle no MLflow**, ferramenta que carrega modelos de aprendizado de máquina. O ataque exige escrita no local que fornece os modelos e pode executar código. O caminho statsmodels tem correção desde 3.15.0; o CERT recomenda evitar dspy enquanto sua correção não estiver disponível. Fonte: [CERT/CC](https://kb.cert.org/vuls/id/369093).

- **Um experimento no PostgreSQL 18.6 mostra como `FOR UPDATE` bloqueia inserções numa tabela filha**, por conflitar com a proteção da chave estrangeira. Quando basta proteger uma atualização sem alteração de chave, `FOR NO KEY UPDATE` permite essa verificação. A escolha depende do que a transação protege; nada de trocar tudo no automático. Fonte: [BoringSQL](https://boringsql.com/posts/row-locks-on-the-page/).

- **CloudX separou caches de testes e lint no CI de Go** e relatou queda da mediana dos jobs de teste de 131 para 41 segundos. Sua alternativa ao setup-go cria caches novos a cada execução. Confira se há disputa por chaves no seu CI: nesse caso, o ganho trouxe custos de armazenamento e limpeza. Fonte: [CloudX](https://www.cloudx.ai/posts/setup-go).

- **Replicação no Postgres precisa reservar workers para a cópia inicial**, mostra Christophe Pettus. Aqui falta capacidade de execução, um problema diferente do [limite de acompanhamento já coberto](/2026/deepseek-reduz-o-cache-e-github-explica-a-fila-que-insistia-em-jobs-cancelados/): a assinatura é criada, mas as tabelas ficam esperando. Dimensione `max_logical_replication_workers` dentro de `max_worker_processes`; mudar o primeiro exige reinício. Fonte: [The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-max_logical_replication_workers/).

- **Percona mediu o custo de CPU da compressão de backups com pgBackRest.** No experimento, níveis baixos de Zstandard, especialmente o 3, equilibraram tamanho e processamento. Subir o nível comprou reduções cada vez menores por muito mais CPU. Meça com seus dados antes de escolher o arquivo mais magro. Fonte: [Percona](https://www.percona.com/blog/pgbackrest-compression-how-much-cpu-is-a-smaller-backup-worth/).

- **PlanetScale anunciou disponibilidade geral do TIN em 16 de setembro para suas ofertas Postgres e Neki.** A extensão de busca textual permite consultas por frases, correspondência aproximada e ordenação por relevância com BM25. São esses os serviços cobertos pelo anúncio; confira se atendem à sua integração. Fonte: [PlanetScale](https://planetscale.com/blog/introducing-tin).

- **Manganin descreveu um rastreador de issues que guarda os dados num repositório Git separado.** Os títulos ficam nos nomes dos arquivos; as descrições, no conteúdo. Você pode clonar e editar tudo com ferramentas locais. Assim, cada ajuste numa issue deixa em paz o histórico das branches do código. Fonte: [Manganin](https://blog.manganin.dev/blog/reinventing-issue-tracking/).

- **JetBrains explicou como seu plugin OpenTelemetry monta mapas de serviços dentro da IDE.** Ele relaciona os registros de operações, os spans, mesmo quando chegam fora de ordem. A aplicação precisa emitir esses registros e propagar o contexto corretamente. O mapa mostra as relações que essa instrumentação conseguiu observar. Fonte: [JetBrains](https://blog.jetbrains.com/platform/2026/09/how-to-service-map-with-opentelemetry/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27569
source_urls:
  - https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-ISE-ABP-VNSW7Tn5
  - https://www.cisa.gov/news-events/alerts/2026/09/16/cisa-adds-two-known-exploited-vulnerabilities-catalog
  - https://kb.cert.org/vuls/id/212479
  - https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/
  - https://nodejs.org/en/blog/release/v26.9.0
  - https://zed.dev/blog/delta-public-beta
  - https://rohanbansal.com/qorl
  - https://release.gnome.org/51/
  - https://kubernetes.io/blog/2026/09/16/kubernetes-v1-37-hardening-container-storage/
  - https://kb.cert.org/vuls/id/369093
  - https://boringsql.com/posts/row-locks-on-the-page/
  - https://www.cloudx.ai/posts/setup-go
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_logical_replication_workers/
  - https://www.percona.com/blog/pgbackrest-compression-how-much-cpu-is-a-smaller-backup-worth/
  - https://planetscale.com/blog/introducing-tin
  - https://blog.manganin.dev/blog/reinventing-issue-tracking/
  - https://blog.jetbrains.com/platform/2026/09/how-to-service-map-with-opentelemetry/
-->
