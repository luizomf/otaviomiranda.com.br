---
title: 'Oracle Payments entra no KEV; GitHub põe segredos e cobrança no radar'
description: 'CISA confirma exploração do Oracle Payments e de dispositivos KNX; GitHub amplia o secret scanning e mostra quanto o Code Quality pode cobrar a partir de 20 de julho.'
date: 2026-07-16T05:16:14-03:00
author: 'The Paper LLM'
image: './images/oracle-payments-entra-no-kev-github-poe-segredos-e-cobranca-no-radar.jpg'
---

![Terminal vermelho da Oracle Payments sob inspeção, com selo amarelo KEV e a identificação da CVE-2026-46817.](./images/oracle-payments-entra-no-kev-github-poe-segredos-e-cobranca-no-radar.jpg)

Instalar a correção hoje bloqueia novas explorações bem-sucedidas dessa falha. Só não apaga o que pode ter acontecido ontem. Essa diferença ficou especialmente importante para quem mantém Oracle E-Business Suite: uma falha crítica no módulo de pagamentos já tinha patch desde maio, teve tentativas de exploração observadas em junho e agora entrou no catálogo de vulnerabilidades exploradas da CISA.

Enquanto esse caso pede pressa, o GitHub trouxe dois avisos mais próximos da rotina de desenvolvimento. O secret scanning ganhou detectores e um campo útil para automações. Já o Code Quality começa a cobrar em quatro dias, e a nova estimativa de licença mostra apenas uma parte da conta.

## Oracle Payments exige patch e investigação do passado

Em 15 de julho, a CISA adicionou a CVE-2026-46817 ao catálogo de vulnerabilidades conhecidas como exploradas, o KEV. Entrar nessa lista significa que a agência aceitou evidência de exploração no mundo real. Para quem administra o Oracle E-Business Suite, a falha vai direto para o começo da fila.

A vulnerabilidade está no componente File Transmission do Oracle Payments, o módulo que centraliza fluxos de pagamento. Um atacante com acesso de rede à interface HTTP pode comprometer o componente sem credenciais. A matriz da Oracle dá nota CVSS 9.8 e descreve um ataque remoto de baixa complexidade, sem privilégio e sem interação do usuário. O problema afeta as versões 12.2.3 a 12.2.15 do E-Business Suite.

O patch faz parte do Critical Security Patch Update publicado pela Oracle em 28 de maio. Um mês depois, em 27 de junho, a empresa de inteligência de ameaças Defused observou tentativas contra seus ambientes de detecção. O relato, reproduzido pela Help Net Security, apontava uma única origem e uma prova de conceito direcionada, não uma varredura ampla. A entrada no KEV confirma a exploração, mas a CISA não informa quantas vítimas existem nem descreve uma campanha.

Para órgãos federais dos Estados Unidos sujeitos à diretiva BOD 26-04, o prazo registrado é 18 de julho de 2026. A data não é uma obrigação legal universal. Para as demais equipes, o recado operacional continua claro: aplique o pacote de maio, revise a exposição das interfaces do E-Business Suite e procure indícios de comprometimento anterior.

São dois trabalhos diferentes. O patch corrige a falha e bloqueia novas explorações bem-sucedidas por esse caminho. Logs, triagem forense e rotação de credenciais cuidam da possibilidade de alguém já ter passado por ela. Atualizar e encerrar o chamado seria confortável, mas incidente não respeita muito o botão de "concluído". No KEV, o possível uso em ransomware aparece como desconhecido. Não há base para ligar essa falha a ransomware.

Fontes: [alerta da CISA de 15 de julho](https://www.cisa.gov/news-events/alerts/2026/07/15/cisa-adds-two-known-exploited-vulnerabilities-catalog), [catálogo KEV em JSON](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json), [Critical Security Patch Update da Oracle](https://www.oracle.com/security-alerts/cspumay2026.html), [alerta da Cyber Security Agency of Singapore](https://www.csa.gov.sg/alerts-and-advisories/alerts/al-2026-065/) e [Help Net Security](https://www.helpnetsecurity.com/2026/06/30/oracle-payments-cve-2026-46817-exploitation/).

## GitHub amplia o radar para chaves de API

Nesta semana, o GitHub começou a distribuir melhorias no secret scanning e no monitoramento de vazamentos públicos. As mudanças, anunciadas em 15 de julho, afetam tanto a detecção no repositório quanto as integrações que recebem alertas por webhook.

Dois tipos explícitos de segredo entraram nos detectores: `apiclub_api_key` e `resend_api_key`. A Resend também passou a fazer parte do programa de parceiros. Quando uma credencial é encontrada em um repositório público, o GitHub pode encaminhá-la ao emissor, que decide se revoga a chave ou avisa o administrador.

A push protection agora bloqueia `volcengine_ark_api_key` por padrão nos repositórios com secret scanning habilitado, inclusive nos públicos gratuitos. A diferença prática está no momento em que cada recurso age. O bloqueio tenta impedir que a chave entre no histórico do Git. Um alerta avisa que uma ocorrência já foi encontrada. Se a credencial chegou a ficar exposta, apagar a linha não resolve: ainda é preciso revogar ou rotacionar a chave e conferir se houve uso indevido.

Para quem automatiza a triagem, o webhook `secret_scanning_alert` agora traz o campo `secret_category`. O valor `default` cobre padrões de provedores e padrões personalizados; `generic` agrupa padrões genéricos e segredos detectados por IA. Dá para separar filas e políticas sem manter uma tabela local com cada detector. Mas a categoria não informa se um alerta genérico veio de uma regra comum ou de IA. É classificação, não bola de cristal.

O monitoramento público também ganhou cartões que resumem vazamentos atribuídos à atividade de membros ou a domínios verificados, com contagens para ajudar na priorização. O anúncio fala em distribuição ao longo da semana, sem informar um percentual. Por isso, contas diferentes podem receber as mudanças em momentos diferentes.

Fonte: [GitHub Changelog — melhorias no secret scanning e public monitoring](https://github.blog/changelog/2026-07-15-improvements-to-secret-scanning-and-public-monitoring).

## Code Quality mostra a licença antes de começar a cobrar

Em 20 de julho, o GitHub Code Quality sai da prévia gratuita e entra em disponibilidade geral paga. Organizações que deixaram o recurso habilitado têm quatro dias para decidir se o ganho compensa os medidores que vêm junto.

O GitHub adicionou à área de Billing and licensing uma estimativa de committers ativos, licenças consumidas e pagamento mensal. Na tabela pública, a licença custa US$ 10 por committer ativo ao mês. "Ativo" significa que a pessoa teve um commit enviado a algum repositório habilitado nos últimos 90 dias. Bots executados como GitHub Apps não entram nessa conta. Os committers também são deduplicados conforme as regras da organização ou do enterprise, então o cálculo não é US$ 10 vezes a quantidade de commits.

A tela ajuda, mas não prevê a fatura inteira. Ela cobre a licença por committer, deixando de fora os minutos do GitHub Actions usados na análise com CodeQL, os créditos consumidos por recursos de IA e os descontos contratuais. Segundo a documentação de cobrança, cada crédito de IA equivale a US$ 0,01. Runners próprios evitam o custo dos minutos hospedados, mas não removem a licença nem um possível consumo de IA.

Essa divisão existe porque o Code Quality combina peças diferentes: análise determinística com CodeQL, findings, score e rulesets, além de recursos baseados em modelo. A ferramenta pode comentar em pull requests, sugerir correções e impor limites de qualidade. Ela está disponível para repositórios de organizações no GitHub Team e no Enterprise Cloud, mas não no Enterprise Server.

Administradores precisam abrir a estimativa, conferir quais repositórios estão habilitados e escolher o escopo antes da transição. Se a organização não quiser o serviço pago, deve desabilitá-lo antes de 20 de julho. E cuidado para não tratar a prévia da licença como conta final: Actions e IA continuam chegando por outras linhas.

Fontes: [estimativa de licença no GitHub Changelog](https://github.blog/changelog/2026-07-13-github-code-quality-license-estimate-in-public-preview/), [anúncio da disponibilidade geral](https://github.blog/changelog/2026-06-16-github-code-quality-generally-available-july-20-2026/), [documentação de cobrança](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality) e [visão geral do Code Quality](https://docs.github.com/en/code-security/concepts/about-code-quality).

## KNX transforma a primeira chave em risco de bloqueio

A segunda vulnerabilidade adicionada ao KEV em 15 de julho é mais antiga e atinge um público específico. A CVE-2023-4346 afeta dispositivos de automação que usam o protocolo KNX com Connection Authorization Option 1 e ainda não têm uma BCU Key definida.

A BCU Key protege o acesso administrativo ao dispositivo. Nesse cenário, alguém que alcance o equipamento pela rede ou fisicamente pode apagar a configuração e definir uma chave própria. O proprietário perde o acesso e, dependendo do dispositivo, pode ficar sem mecanismo de reset. O impacto documentado é de disponibilidade e bloqueio, com nota CVSS 7.5. O advisory não dá base para falar em execução de código ou roubo de dados.

A falha é conhecida desde 2023. A novidade é que a CISA recebeu relatos de exploração ativa e colocou a vulnerabilidade no KEV, com prazo de 29 de julho de 2026 para ativos federais aplicáveis. A agência não publicou ator, vítima, cronologia nem técnica observada, e o possível uso em ransomware permanece desconhecido. O risco também não se estende a todo produto KNX: depende da Option 1, da implementação e da ausência de uma BCU Key já configurada.

Para integradores e responsáveis por automação predial ou industrial, a resposta começa pelo inventário. Identifique os dispositivos nesse perfil, reduza a exposição à internet, separe a rede de controle e defina e documente as chaves conforme o checklist do KNX. O acesso remoto deve passar por uma VPN atualizada. E a segmentação continua necessária: tirar o equipamento da internet não impede que alguém dentro da rede corporativa, ou diante do painel, consiga alcançá-lo.

Fontes: [alerta da CISA de 15 de julho](https://www.cisa.gov/news-events/alerts/2026/07/15/cisa-adds-two-known-exploited-vulnerabilities-catalog), [advisory industrial ICSA-23-236-01](https://www.cisa.gov/news-events/ics-advisories/icsa-23-236-01) e [catálogo KEV em JSON](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://www.cisa.gov/news-events/alerts/2026/07/15/cisa-adds-two-known-exploited-vulnerabilities-catalog
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://www.oracle.com/security-alerts/cspumay2026.html
  - https://www.csa.gov.sg/alerts-and-advisories/alerts/al-2026-065/
  - https://www.helpnetsecurity.com/2026/06/30/oracle-payments-cve-2026-46817-exploitation/
  - https://github.blog/changelog/2026-07-15-improvements-to-secret-scanning-and-public-monitoring
  - https://github.blog/changelog/2026-07-13-github-code-quality-license-estimate-in-public-preview/
  - https://github.blog/changelog/2026-06-16-github-code-quality-generally-available-july-20-2026/
  - https://docs.github.com/en/billing/concepts/product-billing/github-code-quality
  - https://docs.github.com/en/code-security/concepts/about-code-quality
  - https://www.cisa.gov/news-events/ics-advisories/icsa-23-236-01
-->
