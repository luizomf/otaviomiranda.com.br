---
title: 'Cursor alerta sobre extensão adulterada do Claude Code; Northflank pede revogação de chaves'
description: 'Falha no TCP do Linux exige atualizar o kernel, com alerta específico para aplicações Go. Também: correções da JetBrains, limites de gastos no Google Cloud e novidades em observabilidade, agentes e colaboração.'
date: '2026-10-31T07:06:00-03:00'
author: 'The Paper LLM'
image: './images/cursor-claude-code-northflank-linux-mptcp.jpg'
---

![Embalagem ilustrativa do Claude Code no Cursor, com lacre aberto e aviso de extensão adulterada.](./images/cursor-claude-code-northflank-linux-mptcp.jpg)

Os principais alertas deste sábado pedem cuidados em três lugares: o computador de desenvolvimento, os segredos guardados na hospedagem e o kernel dos servidores Linux. No Cursor, desinstalar uma extensão adulterada pode deixar artefatos maliciosos para trás. Na Northflank, a orientação é revogar credenciais nos provedores que as emitiram. No Linux, uma configuração do Go reduz uma via de exposição, mas a correção depende de atualizar o kernel. A edição também traz ferramentas e mudanças para acompanhar aplicações, controlar custos e colaborar em código.

## Extensão adulterada do Claude Code no Cursor tenta manter acesso remoto

Uma análise publicada pela **Microsoft em 30 de outubro** detalha o código malicioso encontrado nas versões **2.1.312 e 2.1.313 de `Anthropic.claude-code` distribuídas pelo marketplace do Cursor**. O aviso do Cursor identifica os pacotes para macOS e Windows, disponíveis em 29 de outubro, aproximadamente das **6h27 às 17h35 de Brasília**. Segundo a Microsoft, o Visual Studio Marketplace e a distribuição oficial pelo npm ficaram fora do incidente; a Anthropic informou que seus sistemas não foram comprometidos.

Ao carregar, a extensão tentava acrescentar uma chave autorizada para acesso por SSH, ativar esse serviço de acesso remoto e abrir um túnel até a máquina do desenvolvedor. Também criava mecanismos para repetir a conexão após reinícios. O sucesso do acesso dependia das permissões e da configuração da máquina. Mesmo quando essa etapa falhava, podiam permanecer chaves e scripts maliciosos. A coleta descrita pela Microsoft incluía **nomes de variáveis de ambiente**; essa coleta, por si só, não demonstra roubo dos valores guardados nelas.

**Desinstalar a extensão não elimina os arquivos gravados fora de seu diretório.** Quem instalou os pacotes afetados deve preservar evidências, conferir o histórico de instalação e investigar os indicadores do aviso oficial. Máquinas com sinais de execução do código malicioso devem ser isoladas. A limpeza precisa remover os artefatos confirmados e preservar chaves SSH legítimas; a ausência de um único marcador não descarta o incidente. O Cursor orienta ainda trocar credenciais e revogar sessões acessíveis à máquina afetada, a partir de um computador confiável. A empresa diz ter retirado o servidor do atacante do ar.

Fontes: [aviso do Cursor, atualizado em 30 de outubro](https://cursor.com/blog/claude-code-extension-security-notice) e [análise e orientações da Microsoft](https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/).

## Northflank orienta revogar segredos armazenados na plataforma

A **Northflank**, plataforma para hospedar aplicações e bancos de dados, publicou em **30 de outubro** um aviso de segurança orientando todos os usuários a assumir que suas variáveis de ambiente foram descriptografadas. A recomendação abrange segredos dos serviços, grupos de segredos e segredos globais. Em atualização posterior, a empresa registrou relatos de uso não autorizado de chaves de APIs de IA fornecidas à plataforma.

A ação indicada é **revogar as credenciais antigas nos serviços que as emitiram, gerar substitutas e atualizar as aplicações**. Alterar apenas o valor salvo na hospedagem deixa a chave anterior utilizável no provedor. Confira também registros de consumo e cobrança das APIs. A Northflank habilitou rotação de segredos para seus complementos PostgreSQL e MongoDB e recomenda desativar o acesso público desses serviços quando estiver habilitado.

Na atualização de **30 de outubro, às 22h04 de Brasília**, a empresa anunciou logs de auditoria para todos os clientes, incluindo os gratuitos. A investigação continuava em andamento no aviso consultado. A orientação de revogação vale para todos os usuários; os relatos de abuso ainda não permitem quantificar quantas credenciais foram efetivamente usadas por invasores.

Fonte: [incidente e atualizações oficiais da Northflank](https://status.northflank.com).

## Falha no TCP do Linux exige corrigir o kernel; mitigação no Go tem alcance limitado

A **CVE-2026-98432** envolve o uso de uma estrutura de memória depois que ela foi liberada, durante o processamento de conexões TCP IPv4 no Linux. Em pesquisa publicada em **27 de outubro**, a Anthropic relata ter demonstrado execução remota de comandos como **root**, o administrador do sistema, contra um servidor com um ponto de escuta **Multipath TCP, ou MPTCP**, exposto. Esse recurso permite que uma conexão TCP use múltiplos caminhos de rede.

O alerta da equipe de segurança do Go, de **29 de outubro**, importa para quem não configurou MPTCP deliberadamente: desde o **Go 1.24**, programas escritos na linguagem usam esse recurso por padrão nos sockets de escuta no Linux — os pontos pelos quais um servidor recebe conexões. A recomendação principal é instalar um **kernel corrigido pela distribuição** e conferir que a máquina passou a executar essa versão.

Enquanto a atualização é preparada, `GODEBUG=multipathtcp=0` desativa esse padrão no programa Go que recebe a variável. Chamadas explícitas da aplicação podem sobrepor a configuração, e basta manter outro ponto de escuta MPTCP exposto para preservar a via de exploração demonstrada. Além disso, o defeito está no TCP IPv4; a equipe do Go alerta que outros caminhos de exploração, sem MPTCP, podem existir. Por isso, a mudança de configuração é uma mitigação temporária e limitada.

Fontes: [aviso da equipe de segurança do Go](https://groups.google.com/g/golang-announce/c/PCoQcdxoScw) e [pesquisa da Anthropic, seção sobre Linux](https://www.anthropic.com/research/discovering-vulnerabilities-with-claude).

## Destaques rápidos para hoje.

- **Google Cloud libera limites de gastos com API e reinício mensal automático.** O anúncio de **30 de outubro** coloca os *spend caps* do Budgets em disponibilidade geral para serviços elegíveis de cada projeto. Eles pausam uso sem apagar recursos; para serviços de IA, o acionamento usa custos estimados e ocorre em minutos. A API permite administrar os limites, e o reinício mensal pode desbloquear os serviços no próximo ciclo. **Capacidade reservada por Provisioned Throughput continua funcionando**, uma exceção importante ao planejar o orçamento. O Google recomenda começar por ambientes de desenvolvimento e testes, nos quais a interrupção é mais tolerável. Fonte: [anúncio e limites do recurso](https://cloud.google.com/blog/topics/cost-management/google-cloud-spend-caps-now-generally-available/).

- **JetBrains publica correções próprias para os certificados comprometidos da eMudhra.** O aviso de **30 de outubro** acrescenta medidas específicas ao [incidente já acompanhado aqui](/2026/emudhra-confianca-tls-jepsen-tarefas-sem-execucao/). Há três componentes a conferir nos produtos da empresa: o runtime Java **JBR**, o navegador embutido **JCEF** e o serviço **`jetbrainsd`**, corrigido na versão **0.9.9728**. Atualizar o sistema operacional não protege esses componentes. Os patches **2025.2.6.\*** corrigem apenas o JBR; enquanto falta a correção do JCEF nessa linha, a orientação é desabilitá-lo. Nas versões corrigidas **2025.3 ou superiores**, o JCEF depende de atualizações de certificados do Google; redes que bloqueiam esse acesso também precisam desabilitá-lo. Consulte a tabela por produto antes de considerar a atualização concluída. A JetBrains informa não conhecer exploração contra seus usuários até a publicação. Fonte: [boletim, versões e procedimentos da JetBrains](https://blog.jetbrains.com/security/2026/10/compromised-emudhra-certificates-ides/).

- **OpenTelemetry eBPF Instrumentation chega à versão 1.0.0.** Anunciado em **30 de outubro**, o **OBI** coleta métricas e rastros de execução de aplicações Linux sem exigir mudanças no código-fonte. Para isso, combina eBPF, que permite executar programas de observação no kernel, com instrumentação específica de cada ambiente. A versão estabelece compromissos de compatibilidade para configuração e implantação. Algumas convenções da telemetria continuam em evolução, e métricas de runtime permanecem experimentais. Quem já usa o projeto deve revisar a migração para **Config v2** e comparar métricas e alertas numa implantação pequena antes de atualizar tudo. Fonte: [lançamento e orientações do OpenTelemetry](https://opentelemetry.io/blog/2026/obi-v1-release/).

- **Tangled passa a guardar issues e pull requests como objetos Git.** A plataforma de hospedagem e colaboração de código anunciou em **30 de outubro** um novo modelo para os dados do projeto. Seu servidor **knot2**, reescrito em Rust, guarda issues, pull requests, comentários e outros registros de colaboração como cadeias de objetos Git vinculadas ao repositório. O lançamento inclui contas de organizações e uma interface refeita em Svelte. Quem hospeda o próprio serviço deve seguir o guia de atualização para **knot v1.20.0**, com o novo modelo de dados. Fonte: [anúncio e orientação de migração da Tangled](https://tangled.org/blog/forge/).

- **Prospero apresenta uma interface nativa para agentes de programação.** Chris Wellons publicou em **31 de outubro** seu ambiente em C++ com interface gráfica nativa, que conecta modelos a ferramentas de arquivos, comandos e subagentes. O usuário fornece o acesso ao modelo. Entre as decisões descritas pelo autor estão prazos para operações e uma interface que fica ociosa quando não há nada a redesenhar. A edição comunitária tem código aberto; a profissional inclui mecanismos de implantação remota. O autor ressalta que as permissões internas não impedem um agente malicioso de agir: o isolamento também depende de restrições no ambiente em que o programa executa. Fonte: [apresentação e limites do Prospero](https://nullprogram.com/blog/2026/10/31/).

- **Firezone lança sanstun, biblioteca WireGuard em Rust que separa a lógica das operações de rede.** Voltada a desenvolvedores de VPNs, a biblioteca anunciada em **31 de outubro** adota o modelo *sans-IO*: a aplicação que a utiliza controla a rede, a passagem do tempo e outros efeitos. Essa separação facilita simular cenários e testar o estado do protocolo. A API também separa o controle dos pacotes do trabalho criptográfico, permitindo executar a criptografia em outras threads. O projeto usa licença Apache 2.0 e substitui o fork de boringtun mantido pela Firezone. Fonte: [arquitetura e lançamento do sanstun](https://www.firezone.dev/blog/introducing-sanstun).

- **Google explica como uma combinação de falhas bloqueou conexões à API do Kubernetes.** O relato publicado em **30 de outubro** reconstrói um incidente de janeiro no GKE, serviço gerenciado de Kubernetes do Google. Pacotes chegavam fora de ordem no caminho privado do Private Service Connect; o proxy Envoy mantinha conexões parcialmente abertas; e um bug no TCP do Linux impedia o processamento de um pacote de encerramento. Conexões antigas ficavam presas, e a reutilização dos mesmos identificadores de rede prejudicava novas tentativas. O caso mostra por que capturar tráfego em pontos diferentes ajuda a localizar uma falha que aparece na aplicação apenas como tempo de espera esgotado. Fonte: [investigação técnica do Google Cloud](https://cloud.google.com/blog/products/networking/the-three-layer-gke-network-mystery/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29752
source_urls:
  - https://cursor.com/blog/claude-code-extension-security-notice
  - https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/
  - https://status.northflank.com
  - https://groups.google.com/g/golang-announce/c/PCoQcdxoScw
  - https://www.anthropic.com/research/discovering-vulnerabilities-with-claude
  - https://cloud.google.com/blog/topics/cost-management/google-cloud-spend-caps-now-generally-available/
  - https://blog.jetbrains.com/security/2026/10/compromised-emudhra-certificates-ides/
  - https://opentelemetry.io/blog/2026/obi-v1-release/
  - https://tangled.org/blog/forge/
  - https://nullprogram.com/blog/2026/10/31/
  - https://www.firezone.dev/blog/introducing-sanstun
  - https://cloud.google.com/blog/products/networking/the-three-layer-gke-network-mystery/
-->
