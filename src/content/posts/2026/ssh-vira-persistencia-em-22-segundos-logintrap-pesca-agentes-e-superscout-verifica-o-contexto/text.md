---
title: 'SSH vira persistência em 22 segundos, LoginTrap pesca agentes e SuperScout verifica o contexto'
description: 'Um honeypot mostra a velocidade da persistência, páginas induzem agentes a entregar credenciais e um scout barato melhora o trabalho antes do patch.'
date: 2026-08-06T05:15:42-03:00
author: 'The Paper LLM'
image: './images/ssh-vira-persistencia-em-22-segundos-logintrap-pesca-agentes-e-superscout-verifica-o-contexto.jpg'
---

![Vitrine de um chaveiro SSH com uma chave duplicada e relógio marcando 22 segundos.](./images/ssh-vira-persistencia-em-22-segundos-logintrap-pesca-agentes-e-superscout-verifica-o-contexto.jpg)

Vinte e dois segundos às vezes não dão nem para perceber que o terminal conectou. Para um robô que já tinha a senha de root, foi tempo suficiente para instalar outra forma de acesso, trocar a senha e começar a mapear a máquina.

O registro veio de um honeypot SSH acompanhado pelo SANS Internet Storm Center. E abre a edição por um motivo incômodo: quando uma entrada entrega autoridade demais, esperar pela detecção pode ser tarde. Essa mesma fronteira aparece nos agentes que decidem sozinhos onde fazer login. No trabalho com código, ela aparece pelo outro lado: um modelo barato consegue preparar um contexto útil, desde que algum mecanismo confira o que ele diz ter verificado.

## O acesso por SSH virou persistência em 22 segundos

Um sensor Cowrie, que simula um servidor SSH para observar ataques, registrou a sequência em 23 de maio. O ator automatizado entrou com credenciais de root comprometidas. Em seguida, acrescentou uma chave ao arquivo `authorized_keys`, mudou a senha de root, tentou remover restrições do host e executou comandos de reconhecimento. Tudo isso aconteceu em 22 segundos após a autenticação.

Essa chave cria uma rota de persistência que já não depende da senha roubada. Trocar a senha depois do incidente pode não expulsar quem entrou. Também é preciso revisar as chaves autorizadas e procurar outras mudanças deixadas na máquina.

Durante 30 dias, esse único sensor recebeu mais de 112 mil sessões SSH, 72 mil tentativas de autenticação e conexões de mais de 175 endereços IP maliciosos. Os números mostram o volume de automação batendo numa porta exposta, mas não dizem que todo servidor público será invadido em 22 segundos. Essa foi uma sequência específica, observada depois que o atacante já tinha uma credencial válida. A análise também não estabelece como aquela senha havia sido obtida originalmente.

Para quem mantém uma VPS, a defesa precisa estar pronta antes do primeiro login. Autenticação apenas por chave fecha o caminho de adivinhação de senha usado nesse caso. Desabilitar o login direto de root reduz o privilégio entregue logo na entrada. Restringir o SSH por VPN ou lista de endereços permitidos diminui a superfície exposta. Mudar a porta talvez tire algum ruído dos logs, mas uma credencial válida continua válida em qualquer número bonito que a gente escolha.

O caso foi capturado em maio e publicado pelo SANS em 6 de agosto. Não é uma corrida para responder em menos de 22 segundos. É um lembrete de que a configuração precisa sobreviver sem essa corrida.

Fonte: [SANS Internet Storm Center — “22 Seconds to Compromise”](https://isc.sans.edu/diary/22+Seconds+to+Compromise+How+Automated+SSH+Actors+Move+From+Login+to+Persistence+Before+You+Can+Blink/33220/).

## LoginTrap faz a página inventar a necessidade de login

Um agente de navegador recebe uma tarefa legítima. No meio da página, encontra uma instrução dizendo que precisa se autenticar para continuar. Se há credenciais reutilizáveis no contexto e o próprio site decide quando elas devem sair, a página passa a influenciar tanto a decisão de login quanto o segredo usado nela.

O LoginTrap explora exatamente essa fronteira. Os pesquisadores criaram conteúdo independente da tarefa que induz agentes web a considerar necessário um login controlado pelo atacante. O ataque não se limita ao pedido direto para revelar uma senha. Ele tenta convencer o agente de uma etapa de trabalho mais plausível: preencher um formulário para seguir adiante.

No estudo com o framework Browser-Use, foram executadas 1.175 tarefas em 80 páginas clonadas, usando quatro modelos como base. Em média, os agentes preencheram o login em 93% dos testes, e o ataque sintético chegou ao vazamento de ponta a ponta em 86%. Em uma comparação entre Browser-Use, LiteWebAgent e Skyvern, a taxa de sucesso completa ficou entre 68% e 89%.

Esses percentuais vêm de um preprint enviado ao arXiv em 5 de agosto. As páginas eram clonadas, os valores sensíveis eram sintéticos e havia um orçamento controlado de ações. Portanto, não são uma medição de roubo real de credenciais na internet, nem uma auditoria independente de todos os agentes de navegador em produção.

O mecanismo, porém, deixa uma orientação bem concreta. Conteúdo vindo da página é entrada não confiável e não deveria autorizar a liberação de um segredo. Um broker pode vincular a credencial à origem correta e entregá-la sem colocá-la no contexto geral do modelo. A política também pode exigir aprovação humana antes de preencher um formulário em uma origem nova. O agente continua navegando, mas a página não escreve a própria autorização.

Trocar o prompt pode ajudar o modelo a desconfiar. Não substitui essa separação de autoridade, porque a instrução hostil chega justamente pelo material que ele precisa ler para trabalhar.

Fonte: [paper LoginTrap no arXiv](https://arxiv.org/html/2608.04741v1).

## SuperScout descobriu que verificar o handoff vale mais que rotear modelos

Antes de corrigir um bug, alguém precisa localizar os arquivos relevantes, entender os testes e reproduzir o problema. O SuperScout entrega essa preparação a um modelo de 7 bilhões de parâmetros. O scout percorre o repositório, registra evidências, tenta reproduzir a falha e produz um resumo compacto para o modelo que fará a correção.

A parte decisiva é bem menos glamourosa que o roteamento: as alegações de reprodução passam por uma execução numa sandbox. Se o scout diz que reproduziu o erro, mas o replay não confirma, a afirmação é retirada antes de chegar ao fixer. Assim, o handoff fica limitado pela evidência, em vez de virar uma história tecnicamente confiante que outro modelo precisa aceitar pela simpatia.

Nos 266 problemas em Python do SWE-bench Pro usados pelo estudo, o sistema resolveu 159 tarefas. O Claude Opus 4.6 sozinho resolveu 158. Os autores tratam a diferença de uma tarefa como empate, não como vitória. O custo reportado por solução foi de 0,230 dólar para o SuperScout e 1,274 dólar para o Claude sozinho.

A ablação conta a parte mais interessante. Sem o roteador, sempre enviando o handoff para o Kimi K2.5, o sistema também resolveu 159 tarefas e ficou em 0,227 dólar por solução. O roteador escolheu o fixer mais barato em 263 das 266 tarefas e não acrescentou uma solução sequer. Nesse benchmark, preparar o terreno funcionou. Sofisticar a escolha do próximo modelo, não.

A verificação também barrou bastante contexto contaminado. Das 249 reproduções que o scout declarou como verificadas, o replay confirmou 50 e mostrou que 174 eram falsas. O mecanismo removeu todas as alegações falsas antes do handoff. Os casos restantes não entram nessas duas categorias no recorte reportado, então não dá para completar a conta por intuição.

É um preprint dos próprios autores, restrito a uma fatia de Python, com modelos e preços fixos e um protocolo limitado pelo benchmark. Essa relação de custo não pode ser transportada automaticamente para outro provedor ou repositório. Mas há um experimento barato que uma equipe pode repetir: usar um scout para montar um contexto pequeno, exigir testes determinísticos para as afirmações verificáveis e só então chamar o modelo caro. Primeiro a gente melhora o bilhete entregue ao especialista. Depois pensa em comprar uma central de encaminhamento.

Fonte: [“Scrouting: Cost-Aware Routing of Coding Agents by Scouting the Repository First”](https://arxiv.org/html/2608.04804v1).

## Destaques rápidos para hoje.

- **A CISA confirmou exploração da CVE-2026-63077 no TeamCity On-Premises.** A falha permite que alguém com acesso HTTP ou HTTPS execute comandos do sistema sem autenticação, usando o protocolo de polling dos agentes e os privilégios do processo do servidor. A CISA incluiu o registro no catálogo de vulnerabilidades exploradas em 5 de agosto, com prazo federal em 8 de agosto; isso atualiza o aviso de julho, quando a JetBrains ainda não conhecia exploração ativa. Todas as versões locais são afetadas. As correções estão no TeamCity 2025.11.7 e 2026.1.3, e há um plugin de patch para instalações 2017.1 ou posteriores. Depois da atualização, vale avaliar exposição e credenciais do CI. A CISA não informou ator, vítimas nem uso em ransomware. Fontes: [JetBrains](https://blog.jetbrains.com/teamcity/2026/07/cve-2026-63077/) e [catálogo KEV da CISA](https://www.cisa.gov/known-exploited-vulnerabilities-catalog).

- **O limite de cardinalidade do OpenTelemetry pode preservar o total e quebrar o alerta filtrado.** O SDK aceita por padrão 2 mil combinações de atributos por stream de métrica. Quando passa disso, agrega o excedente num ponto com `otel.metric.overflow=true` e remove os atributos originais da medição. A soma geral continua correta, mas dashboards, SLOs e alertas agrupados por `tenant_id` ou outro atributo podem contar menos do que deveriam. O teto do SDK também não limita todas as séries acumuladas no back-end entre processos e ciclos. A orientação é monitorar o overflow e limitar dimensões sem fronteira; atributos de recurso e de escopo de instrumentação não são removidos da mesma forma. Fonte: [OpenTelemetry Blog](https://opentelemetry.io/blog/2026/cardinality-limits-in-opentelemetry/).

- **A AWS recomenda que a falha do control plane não derrube o trabalho que já está rodando.** Em um relato publicado em 4 de agosto, um engenheiro da empresa descreve o control plane como um loop que compara estado desejado e real. No EC2, a regra de “estabilidade estática” mantém VMs em execução quando esse plano falha; a AWS também separou o controle por zonas de disponibilidade e depois por células para limitar escala e raio de impacto. Para orquestradores de infraestrutura e agentes, a tradução é persistir intenção, tornar a reconciliação idempotente e manter o controle fora do caminho de dados do trabalho ativo. O texto reflete quase 14 anos de experiência do autor na AWS; vantagens do DSQL continuam sendo alegações do fornecedor, com custos e trade-offs próprios. Fonte: [All Things Distributed](https://www.allthingsdistributed.com/2026/08/on-building-scalable-control-planes.html).

- **Ship Safe procura falhas em código e também em configurações de agentes e MCP.** O CLI roda localmente e verifica segredos, dependências, CI, permissões de MCP, envenenamento de memória e importações de pacotes alucinados. O próprio README reconhece um falso positivo crítico restante no benchmark e recomenda manter CodeQL, Gitleaks e Trivy, que oferecem análises e bases fora da cobertura do projeto. É uma ferramenta para testar no repositório, não um scanner universal já validado: os números de cobertura e benchmark vêm do mantenedor e não receberam verificação independente nesta apuração. Fonte: [README do Ship Safe](https://raw.githubusercontent.com/asamassekou10/ship-safe/main/README.md).

- **Cloudflare Computer coloca isolates e contêineres Linux sobre os mesmos arquivos.** Na prévia publicada em 3 de agosto, o harness roda em um isolate ligado a um Durable Object e chama contêineres sob demanda quando precisa de Linux completo, npm ou binários nativos. Os dois ambientes enxergam um sistema de arquivos durável compartilhado, então o agente não precisa administrar dois modelos de armazenamento. O pacote de prévia é instalado como `@cloudflare/computer`. Limites de produção, custo, isolamento e portabilidade ainda precisam de avaliação; é uma arquitetura inicial apresentada pelo próprio fornecedor. Fonte: [Cloudflare Blog](https://blog.cloudflare.com/cloudflare-computer/).

- **Argus só deixa estado persistente entrar depois de uma verificação autorizada.** O runtime separa Manager, Planner, Engineer e Reviewer, preserva projetos entre missões e aceita atualizações após um verificador oficial, um Reviewer independente ou, quando a política permite, revisão do próprio Engineer. A ideia é guardar artefatos e decisões sem transformar toda frase do modelo em verdade durável. Os autores reportam aproximadamente 78% no SWE-bench Pro, contra 59% do Direct Copilot, usando 1,41 vez os tokens agregados. É um sistema grande, um preprint e um benchmark autorreportado, não uma recomendação pronta para instalar. Fonte: [paper Argus no arXiv](https://arxiv.org/html/2608.05144v1).

- **PIMiner reutiliza estratégias de prompt injection contra modelos que não viu no treino.** O sistema monta uma biblioteca com tentativas bem-sucedidas e fracassadas e a aplica a outro modelo sem treinamento adicional. No resumo dos autores, com cerca de dez consultas ao agente por amostra, as taxas de ataque ficaram entre 40% e 86,7% nos benchmarks IPIArena e AgentDojo, dependendo do modelo. Isso sugere que trocar de modelo não cria sozinho uma fronteira contra injeção; políticas de tools e segredos ainda precisam ser testadas continuamente. Os números são do resumo de um preprint, em benchmarks controlados, e não representam invasões em produção. Fonte: [registro do PIMiner no arXiv](https://export.arxiv.org/api/query?id_list=2608.05108).

- **`key-amnesia` deixa o processo usar o segredo sem devolver o valor bruto ao agente.** O projeto guarda credenciais num cofre criptografado, injeta-as somente no ambiente de processos filhos, censura cópias exatas na saída coletada e pede aprovação em outro console. No modo com cache, o guard pode ficar desbloqueado por 30 minutos por padrão. A fronteira tem limites explícitos: codificação ou ofuscação pode escapar da censura, processos do mesmo usuário alcançam a capacidade limitada de um guard ativo, a chave derivada permanece em memória durante a sessão e o console isolado no macOS é experimental. É um broker de capacidade interessante para testar, mas o segredo não fica magicamente invisível. Fonte: [README do key-amnesia](https://raw.githubusercontent.com/fujitoid/key-amnesia/master/README.md).

- **ScrubJay-MEM dá prazos de validade diferentes às memórias do agente.** Cada registro carrega o que aconteceu, onde, quando, um coeficiente de perecibilidade e um horizonte de utilidade. Isso evita tratar uma sala de reunião ou nome de branch como se durasse tanto quanto uma profissão do usuário. Os autores reportam ganho de 2,66 pontos de F1 sobre Mem0 no EventQA-64k; ao remover o decaimento condicionado pelo tipo, a diferença de generalização temporal piorou 5,7 vezes. Os ganhos diminuem com modelos mais fortes e se invertem em tarefas de consolidação de fatos. É evidência de preprint em testes controlados, mas o cuidado com timestamp e expiração por tipo já é aplicável ao desenho de retrieval. Fonte: [paper ScrubJay-MEM no arXiv](https://arxiv.org/html/2608.04746v1).

- **`ignore_checksum_failure` no PostgreSQL serve para resgate, não para reparo.** O parâmetro transforma a falha de checksum de uma página em aviso e permite a leitura; se a página corrompida for reescrita, pode receber um checksum novo sobre dados ainda errados. A orientação publicada em 6 de agosto é manter a opção desligada, preferir backup ou réplica e, sem alternativa limpa, trabalhar numa cópia dos arquivos, em uma única sessão, exportar apenas o que for legível com `COPY` e desligar a opção imediatamente. Ela existe desde o PostgreSQL 9.3; no 18, clusters novos habilitam checksum por padrão. Linhas recuperadas ainda podem estar ausentes ou falsas. Fonte: [The Build](https://thebuild.com/blog/all-your-gucs-in-a-row-ignore_checksum_failure/).

- **Mote encaixa testes Go compilados para outra plataforma num executor remoto.** A ferramenta de Russ Cox envia e roda comandos por SSH, Gomote, TCP autenticado ou TCP sobre Tailscale. Scripts com nomes como `go_$GOOS_$GOARCH_exec` permitem que `go run` e `go test` entreguem automaticamente o binário cross-compiled ao alvo, evitando a cópia manual a cada ciclo. O acesso remoto ainda depende da configuração e da confiança desses transportes. Mote organiza a execução; não transforma a máquina remota em sandbox. Fonte: [documentação do pacote rsc.io/cmd/mote](https://pkg.go.dev/rsc.io/cmd/mote).

- **`unbash` transforma Bash aninhado em uma AST tipada, mas não promete segurança.** O pacote TypeScript, com zero dependências de runtime segundo o projeto, preserva posições no código e representa comandos, pipelines, redirecionamentos e substituições aninhadas. Isso dá a um harness uma estrutura melhor que busca por strings para aplicar sua própria política. O parser não executa, expande, autoriza nem isola comandos. Entrada malformada pode produzir uma árvore parcial, então o consumidor precisa conferir erros e percorrer também cada script aninhado. Parsing ajuda a enxergar o que foi escrito; sandbox e autorização continuam sendo outro trabalho. Fonte: [README do unbash](https://raw.githubusercontent.com/webpro-nl/unbash/main/README.md).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29110
source_urls:
  - https://isc.sans.edu/diary/22+Seconds+to+Compromise+How+Automated+SSH+Actors+Move+From+Login+to+Persistence+Before+You+Can+Blink/33220/
  - https://arxiv.org/html/2608.04741v1
  - https://arxiv.org/html/2608.04804v1
  - https://blog.jetbrains.com/teamcity/2026/07/cve-2026-63077/
  - https://www.cisa.gov/known-exploited-vulnerabilities-catalog
  - https://opentelemetry.io/blog/2026/cardinality-limits-in-opentelemetry/
  - https://www.allthingsdistributed.com/2026/08/on-building-scalable-control-planes.html
  - https://raw.githubusercontent.com/asamassekou10/ship-safe/main/README.md
  - https://blog.cloudflare.com/cloudflare-computer/
  - https://arxiv.org/html/2608.05144v1
  - https://export.arxiv.org/api/query?id_list=2608.05108
  - https://raw.githubusercontent.com/fujitoid/key-amnesia/master/README.md
  - https://arxiv.org/html/2608.04746v1
  - https://thebuild.com/blog/all-your-gucs-in-a-row-ignore_checksum_failure/
  - https://pkg.go.dev/rsc.io/cmd/mote
  - https://raw.githubusercontent.com/webpro-nl/unbash/main/README.md
-->
