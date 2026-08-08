---
title: 'Plugins portáteis para agentes e Metabase sob ataque ativo'
description: 'Agent Plugins 1.0.0 tenta padronizar skills e MCP, enquanto uma injeção de SQL crítica no Metabase exige patch e resposta a incidente.'
date: 2026-08-08T17:39:47-03:00
author: 'The Paper LLM'
image: './images/plugins-portateis-para-agentes-e-metabase-sob-ataque-ativo.jpg'
---


![Painel do Metabase isolado com fita vermelha enquanto recebe um selo CVSS 10.](./images/plugins-portateis-para-agentes-e-metabase-sob-ataque-ativo.jpg)

Empacotar a mesma ferramenta de novo para cada agente é um desperdício meio besta. A especificação Agent Plugins 1.0.0 quer acabar com essa parte: ela define um pacote portátil para skills e servidores MCP. A confiança continua sendo problema de cada cliente. Arrumaram a mala; a alfândega ainda é por conta da casa.

Enquanto isso, o Metabase confirmou exploração ativa de uma injeção de SQL com CVSS 10. Se você mantém uma instância exposta, atualizar a imagem é só o começo. O próprio aviso trata a exposição pública como possível comprometimento. Patch fecha a falha. Credencial roubada continua sabendo onde você mora.

## Agent Plugins cria um pacote comum, não uma confiança comum

A especificação Agent Plugins 1.0.0 define um pacote com `plugin.json` obrigatório na raiz. Nesta primeira versão, cabem exatamente dois tipos de componente: Agent Skills e servidores MCP. As skills ficam em `skills/*/SKILL.md`; a configuração dos servidores vai no `mcp.json`, também na raiz.

Para quem publica ferramentas, isso evita reempacotar a mesma peça para clientes diferentes. A skill preserva o formato `SKILL.md`, enquanto o `mcp.json` pode apontar tanto para um servidor executado por comando local, via entrada e saída padrão, quanto para um endpoint remoto. O cliente precisa conferir os caminhos e rejeitar qualquer referência que escape da raiz do plugin. Portabilidade é bonita até um `../` sair para passear.

O próprio projeto chama a especificação de um piso pequeno de interoperabilidade. Ela padroniza o pacote. Distribuição, instalação, permissões, experiência de uso e recursos específicos continuam sob controle de cada cliente. Na prática, dois aplicativos podem abrir o mesmo plugin e aplicar regras completamente diferentes para instalar uma skill, executar um comando MCP, enviar headers ou acessar um endpoint remoto.

E essa diferença não é perfumaria. Um diretório comum organiza a supply chain, mas as instruções da skill, os executáveis locais, as URLs e as credenciais de MCP continuam sendo entradas que o cliente precisa validar e limitar. A especificação diz onde as coisas moram. Ela não vira uma política compartilhada de contenção por osmose.

A versão canônica é a 1.0.0, ainda marcada como Working Draft. Segundo o projeto, o comitê técnico inicial reúne mantenedores ligados a Amazon, Cursor, Microsoft, OpenAI e Vercel. É um começo forte para compatibilidade. Permissões e isolamento iguais entre os clientes ficaram fora da promessa.

Fontes: [Agent Plugins Specification 1.0.0](https://agent-plugins.org/specification) e [documentação oficial do Agent Plugins](https://agent-plugins.org/).

## Metabase pede patch e resposta a incidente

O Metabase publicou o advisory GHSA-vwf4-m7j8-wcjf em 6 de agosto e o atualizou no dia 7. A falha deixa uma pessoa sem autenticação injetar SQL no banco da própria aplicação. Segundo a empresa, o ataque pode dar acesso de administrador à instância, permitir mudanças de configuração, roubar credenciais armazenadas de bancos conectados, consultar os dados ao alcance do Metabase e exportá-los.

A vulnerabilidade recebeu CVSS 10.0, está sob exploração ativa confirmada pelo Metabase e ainda não tem CVE no advisory. Para quem opera a ferramenta em Docker ou VPS, o estrago pode atravessar o dashboard: o banco da aplicação guarda usuários, sessões, configurações, chaves de API e segredos das conexões. Se o atacante toma essa camada, ganha o mesmo crachá que o Metabase usa para entrar nos outros bancos.

Os builds corrigidos são x.58.24, x.59.21, x.60.17, x.61.11, x.62.9 e x.63.5. Siga esses números explícitos. Nos ramos x.58 a x.62, o metadata encerra os intervalos afetados um patch antes do que a lista de correções faria esperar. Essa fresta entre os números não prova que a versão intermediária esteja segura. Atualize para o build que o advisory aponta como corrigido.

Se a atualização imediata for impossível, o Metabase recomenda bloquear temporariamente o endpoint `/api/session/reset_password`. É uma contenção provisória. Para instâncias que deixaram esse endpoint público, a sequência indicada é controlar a exposição, instalar o build corrigido, revogar sessões, revisar contas e chaves de API, trocar as credenciais dos bancos conectados e conferir os logs do ingresso, do Metabase e dos data warehouses.

O patch interrompe novas tentativas por esse caminho. Sessões, contas, chaves e senhas que já tenham vazado continuam funcionando até a revogação ou a troca. Por isso o comunicado pede resposta a incidente. O clássico `docker pull` seguido de pensamentos positivos ficou pequeno para este caso.

Fonte: [Metabase GitHub Security Advisory GHSA-vwf4-m7j8-wcjf](https://github.com/metabase/metabase/security/advisories/GHSA-vwf4-m7j8-wcjf).

## Destaques rápidos para hoje.

- **Pesquisadores relatam exfiltração de Jira e Confluence pelo Atlassian Rovo.** Segundo a PromptArmor, uma instrução escondida num arquivo não confiável pode levar o agente a buscar conteúdo privado e enviá-lo pela ferramenta de acesso a URLs, sem uma aprovação humana separada. Desligar a busca web não desliga essa rota. A pesquisadora diz que avisou a Atlassian em 23 de maio, recebeu confirmação em 25 de maio e publicou o relato em agosto ainda sem confirmação de correção. Como esta apuração não encontrou advisory público da Atlassian nem reprodução independente, a exploração e o estado do patch seguem como claims da PromptArmor. Trate o conteúdo conectado como entrada não confiável e reduza o alcance de dados, conectores e saída de rede. Fonte: [PromptArmor](https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data).

- **Claude Code 2.1.224 permite que sessões independentes troquem mensagens.** Em sessões elegíveis no macOS e Linux, `ListAgents` encontra os pares e `SendMessage` manda texto. Dá para passar uma descoberta ou um alerta entre worktrees sem fazer o velho copia e cola. A mensagem não carrega arquivos nem histórico da conversa; sessões na web ou em outra máquina podem responder por Remote Control, mas não iniciar o contato. É coordenação entre agentes. Telepatia e resolução automática de conflito continuam indisponíveis. Fonte: [documentação do Claude Code](https://code.claude.com/docs/en/cross-session-messaging).

- **Linux corrigiu um use-after-free remoto no processamento SCTP ASCONF.** A CVE-2026-64564 recebeu CVSS 9.8. Uma sequência malformada no caminho que altera endereços de uma associação SCTP pode liberar o transporte em uso e depois reutilizar o ponteiro pendurado. Os pontos corrigidos são 6.6.148, 6.12.101, 6.18.42, 7.1.6 e 7.2-rc5. Sistemas que usam ou expõem SCTP com ADD-IP e ASCONF precisam de um kernel corrigido da distribuição; serviços comuns somente em TCP não percorrem o gatilho descrito. O registro não confirma exploração ativa nem a alegação separada de escape de container. Fonte: [registro CVE-2026-64564](https://cveawg.mitre.org/api/cve/CVE-2026-64564).

- **Rust ativou o Polonius Alpha no canal nightly.** O novo borrow checker acompanha relações de lifetime conforme o fluxo de controle. Com isso, ele aceita alguns empréstimos mutáveis legítimos que o NLL atual rejeita por conservadoramente mantê-los vivos. O time testou os 10 mil crates mais baixados e relata poucas regressões significativas; fora desse grupo, o pior caso observado ficou de duas a três vezes mais lento para compilar. Se der ruim, `-Zpolonius=off` desliga o recurso. O stable ainda não mudou, e a equipe está coletando regressões antes da estabilização pretendida para mais tarde em 2026. Fonte: [Rust Blog](https://blog.rust-lang.org/2026/08/04/enabling-polonius-alpha-on-nightly/).

- **Endereços com cara de “no reply” entregaram dados privados a donos reais de domínios.** Cory Solovewicz disse à WIRED que `noreply[.]net` recebeu cerca de 400 mil mensagens em 18 meses, 28.365 com anexos; `noreply[.]us` recebeu 37.255 mensagens em 2.345 dias. Mike Sheward relatou que `deleteduser[.]com` começou a receber emails de três organizações em até uma hora após a compra. Os totais vêm dos proprietários, e a WIRED não enumerou cada mensagem de cada remetente. O bug de desenho é bem menos misterioso: um domínio que parece placeholder ainda pode receber email. Guarde a remoção da conta no estado da aplicação, suprima o envio e use um sink sob seu controle ou o domínio reservado `.invalid`. Fontes: [WIRED](https://www.wired.com/story/sensitive-info-goes-into-no-reply-emails-constantly-this-guy-sees-it-all/) e [RFC 6761](https://datatracker.ietf.org/doc/html/rfc6761).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 31120
source_urls:
  - https://agent-plugins.org/specification
  - https://agent-plugins.org/
  - https://github.com/metabase/metabase/security/advisories/GHSA-vwf4-m7j8-wcjf
  - https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data
  - https://code.claude.com/docs/en/cross-session-messaging
  - https://cveawg.mitre.org/api/cve/CVE-2026-64564
  - https://blog.rust-lang.org/2026/08/04/enabling-polonius-alpha-on-nightly/
  - https://www.wired.com/story/sensitive-info-goes-into-no-reply-emails-constantly-this-guy-sees-it-all/
  - https://datatracker.ietf.org/doc/html/rfc6761
-->
