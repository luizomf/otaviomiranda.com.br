---
title: 'GitHub Actions em alerta: Megalodon, chaves do Google e passkeys'
description: 'Megalodon colocou workflows do GitHub Actions no centro do vazamento de segredos; Aikido mediu chaves do Google funcionando após exclusão; Microsoft empurra contas pessoais para passkeys. Também entram Gemma local, npm, Kata Containers, Cisco, LVFS e agentes com freio.'
date: 2026-05-22T05:26:57-03:00
author: 'The Paper LLM'
image: './images/github-actions-ci-secrets.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/github-actions-em-alerta-megalodon-chaves-do-google-e-passkeys/final.opus'
---

![Placa do GitHub Actions ao lado de um workflow YAML com a linha `secrets` destacada em vermelho, em uma mesa de revisão de incidente de CI.](./images/github-actions-ci-secrets.jpg)

Tem uma confiança silenciosa dentro de quase todo projeto moderno. A gente escreve código, empurra para o repositório e deixa a automação fazer o resto: testar, empacotar, publicar, subir em servidor, falar com nuvem, abrir conexão, assinar artefato, avisar chat. Quando funciona, parece higiene de engenharia. Quando dá errado, parece que a esteira que levava o release também atravessou a área restrita sem pedir crachá.

O detalhe ingrato é que essa automação costuma morar bem perto dos segredos. Ela não só vê o código. Ela enxerga variáveis de ambiente, tokens temporários, chave de acesso a provedor, credencial de pacote, conexão de banco e, às vezes, acesso suficiente para mexer em produção sem fazer cerimônia. É por isso que um arquivo pequeno, com cara de configuração, pode ter impacto maior do que muito código "de verdade".

Hoje o fio principal passa por essa ideia: não basta proteger a aplicação. O caminho que constrói, publica, autentica e recupera a aplicação também virou parte da produção. Às vezes ele tem menos tela bonita e mais poder.

Depois entram os nomes. Uma campanha nova mirou workflows em repositórios do GitHub. Um teste mostrou que apagar uma chave de API do Google não necessariamente mata a chave na mesma hora. A Microsoft está tirando códigos por SMS das contas pessoais. E, no meio do noticiário mais tenso, apareceu uma história boa de IA local fazendo trabalho útil com vídeo, arquivo e esquema limitado, sem precisar vender a alma para uma nuvem qualquer.

Vamos com calma, porque hoje a palavra "credencial" aparece bastante. Ela não grita, mas dá trabalho.

## Um workflow malicioso é código com crachá de produção

A história mais importante do dia é o Megalodon, nome dado por pesquisadores a uma campanha de backdoor em massa contra repositórios no GitHub. O ponto novo não é só "alguém colocou arquivo ruim em repositório". O ponto novo é o tipo de arquivo: workflows do GitHub Actions.

Workflow parece configuração. Na prática, ele é execução. Um YAML desses pode rodar shell, baixar coisa, chamar serviço externo e receber segredos do ambiente de integração contínua. Em muitos projetos, é ali que ficam permissões para publicar pacote, abrir deploy, acessar nuvem, usar SSH, assinar release ou conversar com algum provedor via token. O arquivo tem indentação humilde, mas não é humilde coisa nenhuma.

Segundo a SafeDep, a campanha fez milhares de commits maliciosos em uma janela de cerca de seis horas, em 18 de maio de 2026. Os arquivos usavam gatilhos de CI e payloads em shell, incluindo conteúdo codificado em base64, para coletar segredos e enviar dados para infraestrutura controlada pelo atacante. A OX Security também analisou a campanha e disse ter confirmado mais de 3.500 repositórios com um YAML infectado, com contagem subindo naquele momento.

Esses números devem ser lidos com cuidado. A campanha ainda estava sendo medida quando as análises saíram, e cada empresa olhou uma fatia diferente. O que já basta para o leitor agir é menos cinematográfico e mais operacional: houve uma campanha automatizada grande, mirando o lugar onde muitos projetos guardam permissões fortes por conveniência.

Para quem usa GitHub Actions, a revisão boa começa por commits recentes em `.github/workflows/`. Procure workflow novo, nome genérico demais, trigger estranho, trecho que decodifica script, chamada para domínio desconhecido e execução que não combina com o projeto. Depois vem a parte chata e necessária: reduzir permissões do `GITHUB_TOKEN`, fixar actions confiáveis por versão ou commit, revisar secrets disponíveis por ambiente, exigir proteção de branch e rotacionar credenciais se algum workflow suspeito rodou.

Também vale olhar para OIDC com carinho técnico, não como adesivo de segurança. Token de curta duração é melhor que segredo permanente jogado no CI, mas a política precisa ser estreita. Se qualquer workflow de qualquer branch consegue pedir identidade para publicar ou subir recurso, a esteira continua passando por uma porta que deveria exigir autorização melhor.

Essa história conversa com os incidentes recentes de pacote, extensão e token, mas tem uma novidade própria: o atacante não precisa convencer o usuário final a instalar nada se conseguir fazer a automação oficial do projeto trabalhar para ele. É um tipo de abuso muito desagradável, porque usa a linguagem normal do repositório. O golpe chega vestido de manutenção.

Fontes: [SafeDep](https://safedep.io/megalodon-mass-github-repo-backdooring-ci-workflows/), [OX Security](https://www.ox.security/blog/megalodon-cicd-malware-github/) e [SANS Internet Storm Center](https://isc.sans.edu/podcastdetail/9942).

## Apagar a chave não é o mesmo que ela sumir

A segunda história é menor em barulho e grande em expectativa quebrada. A Aikido testou a exclusão de chaves de API do Google e mediu uma janela em que chaves apagadas continuavam funcionando.

Isso mexe com uma suposição comum em resposta a incidente. Vazou chave? Apaga. Rotaciona. Pronto, próximo incêndio. Só que sistemas distribuídos têm propagação, cache, bordas, réplicas e um monte de encanamento que ninguém quer lembrar às duas da manhã. O botão de excluir pode registrar a intenção imediatamente sem fazer o mundo inteiro obedecer no mesmo milissegundo.

Nos testes da Aikido, feitos em 10 rodadas ao longo de dois dias, a pior janela observada foi de quase 23 minutos. A menor ficou perto de 8 minutos, e a mediana ficou por volta de 16 minutos. A empresa diz que o Google fechou o relatório como `won't fix`, tratando a propagação eventual como propriedade conhecida do sistema. A recomendação da Aikido é tratar a exclusão como uma operação de 30 minutos e monitorar uso durante esse período.

O ponto público não é "Google Cloud caiu" nem "toda chave do Google é inútil". A história é mais específica: chaves de API do Google podem continuar autenticando por alguns minutos depois de deletadas. Isso importa para quem colocou chave de Gemini, Maps, BigQuery ou qualquer API genérica em app, script, repositório, automação, CI ou agente.

Um detalhe técnico curioso da própria Aikido ajuda a calibrar. Nos testes dela, chaves de service account revogaram em cerca de 5 segundos, e novas chaves da API Gemini teriam ficado em torno de 1 minuto. Ou seja, não dá para transformar o resultado em lei universal para todo tipo de credencial. Dá para transformar em regra de resposta: depois de apagar uma chave vazada, continue olhando logs, uso e cobrança como se a chave ainda respirasse um pouco.

A frase "eventualmente consistente" explica muita coisa em infraestrutura. Ela só não deve virar anestesia. Para o usuário, uma credencial apagada que ainda funciona é uma janela de abuso. Pequena, talvez. Mas suficiente para alguém automatizado fazer bastante besteira.

Fonte: [Aikido Security](https://www.aikido.dev/blog/google-api-keys-deletion).

## O SMS vai perdendo espaço para chave de verdade

A Microsoft publicou que vai começar a retirar códigos por SMS como método de autenticação e recuperação para contas pessoais. A direção sugerida é conta sem senha, passkeys e e-mail verificado.

Quem já perdeu acesso a número de telefone, trocou chip, viajou, sofreu tentativa de golpe ou precisou recuperar conta antiga entende por que esse assunto sai do campo abstrato rápido. SMS é familiar e conveniente, mas carrega problemas conhecidos: interceptação, troca fraudulenta de chip, phishing, redirecionamento e aquele velho teatro em que a pessoa digita um código em uma página que só parece legítima.

Passkey muda o desenho. Em vez de um segredo curto que o usuário lê, copia, cola ou entrega sem querer, ela usa criptografia de chave pública. A comparação imperfeita, mas útil para dev, é pensar mais em par de chaves SSH do que em código descartável. O serviço guarda a parte pública; o dispositivo ou gerenciador guarda a parte privada; o login prova posse sem mandar a chave privada pela rede.

Isso não resolve tudo. Perda de dispositivo, recuperação de conta, sincronização entre ecossistemas e suporte de navegador ainda são detalhes que podem virar dor real. Segurança boa também precisa de saída de emergência, senão vira cofre tão seguro que nem o dono entra.

Mesmo assim, a direção faz sentido. A própria Microsoft descreve SMS como uma fonte importante de fraude. Para quem usa conta Microsoft em Windows, Xbox, email, assinatura, ambiente de desenvolvimento ou alguma rotina ligada ao ecossistema, vale configurar passkey e revisar email de recuperação antes de ser empurrado pela mudança no pior momento possível. Segurança forçada durante login urgente tem um talento especial para estragar o humor.

Fontes: [Microsoft Support](https://support.microsoft.com/en-us/account-billing/microsoft-to-stop-sending-sms-codes-for-personal-accounts-31b80825-bdd0-4bf2-926b-dca3c35ee4c1) e [Risky Business News](https://news.risky.biz/risky-bulletin-microsoft-ends-sms-mfa-for-personal-accounts/).

## IA local ficou interessante quando virou encanamento

Depois de CI, chave e autenticação, uma história mais construtiva: um desenvolvedor descreveu como indexou um ano de vídeos localmente em um MacBook Pro M1 Max de 2021, usando Gemma 4 31B e um monte de ferramenta comum de mídia.

A parte menos importante é discutir se esse modelo "ganhou" de algum serviço de nuvem. A própria história não deve ser lida como benchmark universal. O valor está na arquitetura miúda: extrair metadados com `ffprobe` e `exiftool`, amostrar frames com `ffmpeg`, transcrever áudio com WhisperX, fazer diarização de falantes, usar `insightface` para embeddings faciais e escrever arquivos YAML ao lado dos vídeos.

Isso é bonito por um motivo pouco glamouroso: o resultado fica perto do arquivo original, em texto simples, com esquema limitado. O autor enfatiza geração com schema e enums, em vez de pedir para o modelo "descrever tudo aí com capricho". Para busca local, automação e manutenção futura, um YAML consistente vale mais do que uma prosa brilhante que muda de humor a cada execução.

O setup citado inclui LM Studio, quantização de 4 bits e até bastante swap. Não é mágica. É um trabalho batch, local-first, aceitando limite de máquina, usando nuvem só em casos mais difíceis e mantendo o acervo sob controle do usuário. Para quem tem vídeo de aula, reunião, gravação de tela, arquivo de família ou material de pesquisa, a ideia é bem reaproveitável: primeiro transforme bagunça multimídia em índice estruturado; depois peça inteligência em cima desse índice.

Esse é o lado saudável da IA em ferramenta: menos "olha o modelo pensando bonito" e mais "agora eu consigo achar aquele trecho de 2023 em que alguém explicou o bug". Se a revolução couber em `grep`, banco local e arquivo legível, eu presto atenção com mais boa vontade.

Fonte: [SimbaStack](https://blog.simbastack.com/indexed-a-year-of-video-locally/).

## Destaques rápidos para hoje.

- O npm segue endurecendo o caminho de publicação com ideias como staged publishing, trusted publishing via OIDC, tokens mais estreitos e autenticação forte. A motivação é simples: quando token roubado consegue publicar versão maliciosa rápido demais, o registro precisa de freio antes do pacote chegar a todo mundo. Para mantenedores, vale auditar tokens clássicos, planejar publicação confiável e não tratar 2FA como enfeite de perfil. Fonte: [npm Docs](https://docs.npmjs.com/).

- Kata Containers corrigiu a CVE-2026-47243, uma fuga de guest-root para host-root ligada ao caminho de `virtiofsd` no `runtime-rs` 3.30 e anteriores. A divulgação diz que, em uma condição específica, execução equivalente a root dentro do guest poderia criar symlinks pertencentes a root em caminhos sensíveis do host. A correção está no Kata Containers 3.31.0 ou em builds de fornecedor. Para quem usa microVM como isolamento de CI, workload não confiável ou agente de código, a lição é atualizar também os helpers na fronteira, não só confiar no rótulo "sandbox". Fontes: [oss-security/Openwall](https://www.openwall.com/lists/oss-security/2026/05/21/14) e [Kata Containers 3.31.0](https://github.com/kata-containers/kata-containers/releases/tag/3.31.0).

- A Cisco corrigiu a CVE-2026-20223 no Secure Workload, com pontuação CVSS 10.0. O problema envolve endpoints REST API, afeta SaaS e on-prem, não tem workaround e foi corrigido nas versões 3.10.8.3 e 4.0.3.17; instalações 3.9 e anteriores precisam migrar. Segundo a reportagem, a Cisco disse não ter evidência de exploração no momento da divulgação. Se você roda a ferramenta, é caso de patch direto, não de reunião contemplativa. Fonte: [The Hacker News](https://thehackernews.com/2026/05/cisco-patches-cvss-100-secure-workload.html).

- A HP entrou como patrocinadora premier do Linux Vendor Firmware Service, ao lado de Dell e Lenovo. O LVFS, usado com `fwupd` e `fwupdmgr`, é aquele tipo de infraestrutura que ninguém aplaude quando funciona, mas todo usuário de Linux sente falta quando precisa atualizar firmware por um caminho torto. A notícia não garante suporte perfeito para todo dispositivo HP, mas é um bom sinal para manutenção de BIOS e firmware no desktop Linux. Fontes: [It's FOSS](https://feed.itsfoss.com/link/24361/17346142/hp-supports-lvfs) e [LVFS](https://fwupd.org/).

- O Dropbox descreveu Nova, sua plataforma interna para agentes de código. O interessante não é vender "agente autônomo substitui engenharia", e sim o contrário: a empresa fala em ambientes isolados, snapshots de repositório, comandos de validação, integração com fluxo de trabalho e tentativas controladas para casos como falha de CI, teste instável, migração e upgrade de dependência. Em escala menor, a moral é a mesma para quem usa Codex, Claude Code ou ferramenta parecida: construa o arnês antes de soltar a corrida. Fonte: [Dropbox Tech](https://dropbox.tech/machine-learning/introducing-nova-our-internal-platform-for-coding-agents).

## Acompanhamento de tendências do dia.

O tema que liga boa parte do dia é fronteira. Fronteira entre workflow e produção. Entre chave apagada e chave realmente morta. Entre conta pessoal e método de recuperação. Entre guest e host. Entre agente útil e agente com acesso demais.

Por isso o Claw Patrol, anunciado pela Deno, é um sinal interessante mesmo sendo projeto novo. A proposta é colocar um firewall entre agentes e sistemas reais, segurando credenciais, analisando tráfego, aplicando regras, registrando auditoria e exigindo aprovação humana para ações sensíveis. A lista de integrações citada pela Deno é bem pé no chão para produção moderna: AWS, GCP, Postgres, Kubernetes, ClickHouse, GitHub, Slack e Grafana.

O desenho importa mais que o produto específico. Prompt não é perímetro. Mensagem de sistema não é cofre. Agente que consegue falar com banco, cluster, repositório e nuvem precisa de política fora dele: rede, segredo injetado na borda, log verificável, regra por recurso e um botão humano quando a ação passar do aceitável.

Isso conversa com Nova, com Kata Containers e até com Megalodon. A mesma indústria que está colocando automação em mais partes do trabalho está descobrindo que automação sem limite vira multiplicador de acidente. Às vezes o limite é passkey. Às vezes é OIDC. Às vezes é sandbox corrigida. Às vezes é um gateway segurando a credencial para o agente não sair com ela no bolso.

O bom caminho parece menos mágico e mais administrativo. Desculpa. Segurança frequentemente vence por ser meio sem charme.

Fontes: [Deno](https://deno.com/blog/clawpatrol) e [Claw Patrol](https://clawpatrol.dev/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-22
generated_at: 2026-05-22T05:26:57-03:00
source_urls:
  - https://safedep.io/megalodon-mass-github-repo-backdooring-ci-workflows/
  - https://www.ox.security/blog/megalodon-cicd-malware-github/
  - https://isc.sans.edu/podcastdetail/9942
  - https://www.aikido.dev/blog/google-api-keys-deletion
  - https://support.microsoft.com/en-us/account-billing/microsoft-to-stop-sending-sms-codes-for-personal-accounts-31b80825-bdd0-4bf2-926b-dca3c35ee4c1
  - https://news.risky.biz/risky-bulletin-microsoft-ends-sms-mfa-for-personal-accounts/
  - https://blog.simbastack.com/indexed-a-year-of-video-locally/
  - https://docs.npmjs.com/
  - https://www.openwall.com/lists/oss-security/2026/05/21/14
  - https://github.com/kata-containers/kata-containers/releases/tag/3.31.0
  - https://thehackernews.com/2026/05/cisco-patches-cvss-100-secure-workload.html
  - https://feed.itsfoss.com/link/24361/17346142/hp-supports-lvfs
  - https://fwupd.org/
  - https://dropbox.tech/machine-learning/introducing-nova-our-internal-platform-for-coding-agents
  - https://deno.com/blog/clawpatrol
  - https://clawpatrol.dev/
omitted_briefing_items:
  - Stop Using Pull Requests: usado apenas como contexto editorial indireto; opinião útil, mas fraca como notícia principal diante de itens técnicos verificados.
  - Black Kite supply-chain report: não entrou por compressão; Megalodon, npm e Kata cobriram melhor o arco operacional de supply chain.
  - Zero-downtime data migration: bom evergreen, mas menos urgente que credenciais, CI e isolamento.
  - Postgres checkpoint tuning: omitido por espaço; item técnico útil, mas o dia já tinha alta densidade.
  - Grab Apache Flink ingestion: arquitetura interessante, menor urgência pública nesta edição.
  - Opaque types in Python: bom tema de design de API, guardado por menor relevância diária.
  - Slumber terminal HTTP client: ferramenta interessante, omitida para não alongar destaques além do necessário.
  - pkg.go.dev API: útil, mas perdeu espaço para npm, Kata, Cisco, LVFS e Nova.
  - Python 3.15 quiet wins: omitido por menor urgência e falta de validação adicional nesta etapa.
  - Gnutella protocol: história/arquitetura boa, mas evergreen demais para o arco do dia.
  - Tight C: projeto experimental divertido, abaixo das histórias verificadas de produção.
  - Qwen3.7-Max e Cohere Command A+: anúncios de modelo via fonte secundária, sem validação primária suficiente nesta etapa.
-->
