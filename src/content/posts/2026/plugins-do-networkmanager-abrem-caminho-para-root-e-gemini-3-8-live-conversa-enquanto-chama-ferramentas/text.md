---
title: 'Plugins do NetworkManager abrem caminho para root, e Gemini 3.8 Live conversa enquanto chama ferramentas'
description: 'VPN instalada e sem uso também exige revisão. Google anuncia agentes de voz com trabalho em segundo plano; Acronis pede atualização, Fedora muda padrões e patches de IA ganham outra régua.'
date: 2026-09-16T05:28:50-03:00
author: 'The Paper LLM'
cover: './images/plugins-do-networkmanager-abrem-caminho-para-root-e-gemini-3-8-live-conversa-enquanto-chama-ferramentas.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/plugins-do-networkmanager-abrem-caminho-para-root-e-gemini-3-8-live-conversa-enquanto-chama-ferramentas/final.opus'
---

![Revista com Tux e conectores ilustra a revisão dos plugins VPN do NetworkManager, mesmo sem uso.](./images/plugins-do-networkmanager-abrem-caminho-para-root-e-gemini-3-8-live-conversa-enquanto-chama-ferramentas.jpg)

## Plugins do NetworkManager podem dar root mesmo sem usar a VPN

Michael Catanzaro divulgou em 15 de setembro falhas em quatro projetos de plugins de VPN do NetworkManager, que gerencia conexões de rede no Linux. Um usuário local sem privilégios administrativos pode chegar a root usando uma configuração maliciosa. **Basta ter o plugin afetado instalado**, mesmo que você nunca se conecte por ele. O pacote esquecido continua cumprindo expediente.

As falhas estão nos plugins, mantidos separadamente, e não no NetworkManager em si. Eles interpretam perfis de conexão e interagem com programas privilegiados. O risco está nessa passagem entre o usuário comum e o administrador.

Os projetos vpnc e fortisslvpn estão arquivados. Catanzaro recomenda removê-los e migrar, respectivamente, para libreswan e openconnect. O SSTP está sem mantenedor; o iodine tem uma proposta de correção aberta, ainda sem integração confirmada.

A divulgação trata de escalada local de privilégio e não confirma exploração em ataques reais. Se você usa Linux, confira os plugins instalados e os patches da sua distribuição: o aviso não fornece uma versão corrigida universal.

Fonte: [Michael Catanzaro — falhas nos plugins de VPN](https://blogs.gnome.org/mcatanzaro/2026/09/15/privilege-escalation-vulnerabilities-in-networkmanager-plugins/).

## Gemini 3.8 Live continua falando enquanto as ferramentas trabalham

O Google anunciou em 15 de setembro o Gemini 3.8 Live e uma variante chamada Extended Thinking para interfaces de voz. Segundo a empresa, os modelos mantêm a conversa enquanto chamadas a ferramentas e APIs rodam em segundo plano. Se você desenvolve atendimento por voz, pode responder ao usuário enquanto espera o serviço da aplicação terminar.

O Live mira escala e custo. Já o Extended Thinking foi projetado para raciocinar e falar ao mesmo tempo em tarefas com várias etapas. O anúncio também descreve entrada visual quase em tempo real e troca de idioma durante a conversa. São capacidades anunciadas pelo Google; não temos medição independente de qualidade ou latência nesta cobertura.

A distribuição começou pela Gemini API e pelo Google AI Studio, e a oferta empresarial inclui prévia privada. Eu conferiria as condições de acesso antes de planejar a integração.

Na aplicação, a confirmação de uma reserva ou de um pagamento continua dependendo da conclusão da operação. Conversar durante a consulta é útil. Uma voz tranquila dizendo “estou cuidando disso” ainda está no gerúndio.

Fonte: [Google — Gemini 3.8 Live e Extended Thinking](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/).

## Acronis alerta para exploração de plugin de backup do cPanel

A Acronis divulgou em 15 de setembro a CVE-2026-87886, uma falha nas permissões de arquivos das integrações de backup para painéis de hospedagem no Linux. Alguém com baixos privilégios locais pode usá-la para elevar seu acesso. A empresa relata exploração limitada e direcionada em instalações de cPanel & WHM.

Ao BleepingComputer, a Acronis disse que baseou sua avaliação num único relato de cliente potencialmente afetado. O Plesk também tem versões vulneráveis, mas o aviso de exploração cita especificamente cPanel & WHM. Não há indicadores públicos nem uma cronologia detalhada do incidente.

Se você administra essas integrações, confira os builds corrigidos: **1.9.3.1021, também chamado 1.9.3 HF3, para cPanel & WHM; 1.8.11.638 para Plesk**. As correções já estavam disponíveis antes desse alerta, e a Acronis pede instalação imediata da atualização para cPanel.

Quem precisa da atualização é o complemento da Acronis, que tem seu próprio ciclo de correção. Atualizar só o painel deixa o plugin esperando a vez.

Fontes: [boletim SEC-10986 da Acronis](https://security-advisory.acronis.com/advisories/SEC-10986), [atualização para cPanel & WHM](https://security-advisory.acronis.com/updates/UPD-2609-3d72-20a7) e [relato do BleepingComputer](https://www.bleepingcomputer.com/news/security/acronis-warns-of-actively-exploited-flaw-in-its-cpanel-backup-plugin/).

## Fedora 45 Beta exige assinatura de pacotes e troca o console

O Fedora lançou a versão 45 Beta em 15 de setembro com duas mudanças para testar antes do upgrade estável: assinatura válida de pacotes obrigatória por padrão e substituição do console antigo do kernel pelo kmscon. A primeira afeta a autenticidade dos pacotes instalados. A segunda troca a implementação do console do sistema, mantendo sua escolha de shell.

Se sua equipe distribui pacotes internos sem assinatura, confira o fluxo de instalação. O pacote que “sempre funcionou” vai precisar apresentar documento. Teste também o acesso pelo console nos ambientes que vocês mantêm.

No desktop, o oo7 substitui mecanismos de armazenamento de segredos como GNOME Keyring e KWallet. O Fedora CoreOS ganha systemd-oomd para lidar com pressão de memória e suporte a swap em RAM comprimida, o zram.

Ainda é uma versão de testes, e algumas variantes de ISO estavam indisponíveis no anúncio. Dá para usar a beta para descobrir incompatibilidades antes de levar esses padrões à produção.

Fonte: [Fedora — anúncio do Fedora Linux 45 Beta](https://fedoramagazine.org/announcing-fedora-linux-45-beta/).

## Trail of Bits questiona o que conta como patch de IA bem-sucedido

A Trail of Bits publicou em 15 de setembro uma crítica ao estudo FLAWED da 1Password e lançou duas skills de revisão e validação. [Em agosto, cobrimos o experimento original](/2026/cloudflare-cria-navegador-para-agentes-patches-de-ia-falham-e-chaves-vao-ao-hardware/). Agora, a empresa traz uma reanálise e um procedimento para conferir os patches.

Ela selecionou testes que permitiam execução, sem instruções de conserto errado, e excluiu os classificados como consulta a patches originais. Nesse recorte, 86% bloquearam o exploit fornecido, aquela demonstração do ataque. Já os 26% de correções limpas do estudo original exigiam resolver a vulnerabilidade sem alterar o comportamento da aplicação. A seleção dos testes e o critério de sucesso mudaram. São percentuais que respondem a perguntas diferentes.

A Trail of Bits também participa do trabalho em disputa: coordena o Patch the Planet com a OpenAI. E reconheceu que seu próprio patch para freenginx deixou um caminho vulnerável e introduziu um crash na limpeza.

As skills `post-patch-validation` e `review-walkthrough` propõem reproduzir o bug, testar outra manifestação da causa e procurar regressões. Build quebrado conta como inconclusivo. Se o teste nem rodou, a comemoração está adiantada.

Fontes: [Trail of Bits — crítica e ferramentas de validação](https://blog.trailofbits.com/2026/09/15/1passwords-ai-patching-benchmark-is-misleading/) e [1Password — metodologia e resultados originais](https://1password.com/blog/why-ai-generated-patches-still-require-human-review).

## Projeto de SBOM para Postgres refaz a verificação para quem recebe a imagem

Jeremy Schneider relatou em 15 de setembro que refez a geração dos inventários de componentes, os SBOMs, para seus contêineres de extensões do Postgres. A implementação anterior exigiria comandos de validação diferentes para imagens Debian e para o caminho PGRX, usado no desenvolvimento de extensões em Rust.

[No dia 12, falamos das lacunas nesses inventários](/2026/pesquisadores-ligam-ataque-ao-rubygems-a-agentes-da-openai-e-gitlab-corrige-leitura-sem-login/). A mudança agora está na interface de verificação: quem recebe a imagem deve conseguir conferi-la sem estudar primeiro como ela foi construída. A cozinha pode ter duas receitas; o consumidor não precisa de dois manuais para conferir a embalagem.

Schneider reconstruiu a solução usando o mecanismo de geradores personalizados de SBOM do Docker. A maior parte da lógica ficou num módulo gerador, com uma interface de plugins prevista para PGRX.

O trabalho segue em andamento. A refatoração de PGRX e o envio ao projeto original ainda estavam nos próximos passos; a funcionalidade não foi entregue em todas as imagens do CloudNativePG.

Fonte: [Jeremy Schneider — redesenho dos SBOMs para Postgres](https://ardentperf.com/2026/09/15/agents-gone-awry-on-postgres-sboms-start-over/).

## Destaques rápidos para hoje.

- **Java 27 chegou à disponibilidade geral em 15 de setembro.** O G1 passa a ser o coletor de memória padrão em todos os ambientes, e os cabeçalhos compactos dos objetos vêm habilitados. Teste esses novos padrões no seu serviço. A concorrência estruturada continua em prévia, já na sétima. Fonte: [OpenJDK](https://openjdk.org/projects/jdk/27/).

- **Google aponta indícios de possível exploração limitada da CVE-2026-58704 no Pixel.** A falha envolve o modem. Em aparelhos suportados, instale o nível de patch **2026-09-05 ou posterior**. O boletim saiu em 15 de setembro e cobre o Pixel, não todos os Androids. Fontes: [Google](https://source.android.com/docs/security/bulletin/pixel/2026/2026-09-01) e [BleepingComputer](https://www.bleepingcomputer.com/news/security/google-fixes-actively-exploited-android-zero-day-on-pixel-devices/).

- **Firefox 156 corrige falhas de gravidade alta**, anunciou a Mozilla em 15 de setembro. Há escalada de privilégio no Firefox para Android e acesso a memória já liberada em codecs de áudio e vídeo. Atualize o navegador; o boletim não confirma exploração em ataques reais. Fonte: [Mozilla](https://www.mozilla.org/en-US/security/advisories/mfsa2026-90/).

- **Kubernetes 1.37 teve seus gerenciadores de recursos por pod anunciados em beta.** Eles permitem dedicar recursos ao contêiner principal e manter um conjunto compartilhado, isolado por pod, para auxiliares leves, os sidecars. A opção `PodLevelResourceManagers` vem desligada: você precisa habilitá-la para testar. Fonte: [Kubernetes](https://kubernetes.io/blog/2026/09/15/kubernetes-v1-37-pod-level-resource-managers-beta/).

- **O processador de atributos Kubernetes do OpenTelemetry chegou à versão estável 1.0.0.** Ele acrescenta metadados de workloads à telemetria. A migração muda nomes das convenções semânticas e traz incompatibilidades. Se você já usa o componente, confira o guia antes de atualizar. Fonte: [OpenTelemetry](https://opentelemetry.io/blog/2026/k8s-attributes-processor-v1/).

- **Swift 6.4 saiu com Subprocess 1.0**, biblioteca estável para executar outros programas em diferentes plataformas. A linguagem permite chamadas assíncronas em `defer`, usado na limpeza ao sair de um escopo, e oferece proteção dessa limpeza contra cancelamento. Bom para quem escreve ferramentas de terminal e servidores. Fonte: [Swift](https://www.swift.org/blog/swift-6.4-released/).

- **Um guia da AWS detalha os limites da réplica regional do Cognito**, serviço de identidade. A réplica permite autenticação e leitura; escritas seguem na região principal. Quem usa códigos temporários de aplicativo autenticador, o TOTP, também depende da principal. Teste esses fluxos no seu plano de recuperação. Fonte: [AWS](https://aws.amazon.com/blogs/security/architecting-resilient-authentication-with-amazon-cognito-multi-region-replication/).

- **Cloudflare anunciou uma preferência contra treinamento de IA que preserva acesso para busca.** Ela sinaliza a escolha a robôs de uso misto e depende dos compromissos dos operadores. O Bing ainda exige recusa separada: segundo a Cloudflare, seu suporte via robots.txt está previsto para o início de 2027. Fonte: [Cloudflare](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/).

- **pgAssistant 3.8.0 compara coletas consecutivas do ambiente Postgres**, incluindo configuração, tempo de consultas e volume de chamadas. Você pode examinar o que mudou depois dos ajustes. Essas correlações, porém, não provam a causa da melhora nem que uma recomendação foi implementada. Fonte: [anúncio do pgAssistant](https://www.postgresql.org/about/news/pgassistant-380-continuous-improvement-loop-for-postgres-3378/).

- **Uma auditoria do SWE-bench não encontrou separação estatística entre vizinhos do top 30 Verified** no teste aplicado aos resultados publicados. O benchmark avalia resolução de problemas de software. O resultado limita a certeza sobre pequenas diferenças no ranking, sem provar equivalência entre agentes. Avalie também nas suas tarefas. Fonte: [paper no arXiv](https://arxiv.org/abs/2609.17394v1).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27538
source_urls:
  - https://blogs.gnome.org/mcatanzaro/2026/09/15/privilege-escalation-vulnerabilities-in-networkmanager-plugins/
  - https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/
  - https://security-advisory.acronis.com/advisories/SEC-10986
  - https://security-advisory.acronis.com/updates/UPD-2609-3d72-20a7
  - https://www.bleepingcomputer.com/news/security/acronis-warns-of-actively-exploited-flaw-in-its-cpanel-backup-plugin/
  - https://fedoramagazine.org/announcing-fedora-linux-45-beta/
  - https://blog.trailofbits.com/2026/09/15/1passwords-ai-patching-benchmark-is-misleading/
  - https://1password.com/blog/why-ai-generated-patches-still-require-human-review
  - https://ardentperf.com/2026/09/15/agents-gone-awry-on-postgres-sboms-start-over/
  - https://openjdk.org/projects/jdk/27/
  - https://source.android.com/docs/security/bulletin/pixel/2026/2026-09-01
  - https://www.bleepingcomputer.com/news/security/google-fixes-actively-exploited-android-zero-day-on-pixel-devices/
  - https://www.mozilla.org/en-US/security/advisories/mfsa2026-90/
  - https://kubernetes.io/blog/2026/09/15/kubernetes-v1-37-pod-level-resource-managers-beta/
  - https://opentelemetry.io/blog/2026/k8s-attributes-processor-v1/
  - https://www.swift.org/blog/swift-6.4-released/
  - https://aws.amazon.com/blogs/security/architecting-resilient-authentication-with-amazon-cognito-multi-region-replication/
  - https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/
  - https://www.postgresql.org/about/news/pgassistant-380-continuous-improvement-loop-for-postgres-3378/
  - https://arxiv.org/abs/2609.17394v1
-->
