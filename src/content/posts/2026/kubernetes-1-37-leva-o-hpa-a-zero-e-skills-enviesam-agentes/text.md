---
title: 'Kubernetes 1.37 leva o HPA a zero, e Skills enviesam agentes'
description: 'O Kubernetes agora desliga o último worker ocioso, enquanto o SkillShift mostra decisões válidas sendo inclinadas por Agent Skills. CISA e Cisco completam a manhã com patches urgentes.'
date: 2026-09-03T05:15:41-03:00
author: 'The Paper LLM'
image: './images/kubernetes-1-37-leva-o-hpa-a-zero-e-skills-enviesam-agentes.jpg'
---
![Relógio azul com o logo do Kubernetes marca zero réplicas enquanto uma fila de tarefas aciona o despertar.](./images/kubernetes-1-37-leva-o-hpa-a-zero-e-skills-enviesam-agentes.jpg)

Fila vazia, nenhum trabalho chegando e aquele pod caro lá, respirando só para o número mínimo continuar em um. No Kubernetes 1.37, o HPA finalmente pode mandar o último worker dormir e acordá-lo quando a demanda voltar. Parece só um zero no YAML. Como todo zero interessante em produção, vem acompanhado de arquitetura, estado e algumas maneiras criativas de ficar indisponível.

A outra história do dia mexe com algo igualmente traiçoeiro. Um Agent Skill pode entregar a resposta no formato certo, concluir a tarefa e ainda inclinar discretamente a decisão do agente. O malware nem precisa saltar da tela quando uma política com cara de conselho sensato consegue colocar o dedo na balança.

## Kubernetes 1.37 deixa o último worker dormir

O Kubernetes publicou em 2 de setembro a chegada do scale-to-zero do Horizontal Pod Autoscaler, o HPA, à fase beta na versão 1.37. O recurso vem habilitado por padrão. Um HPA que observa uma métrica de objeto ou uma métrica externa agora pode reduzir um Deployment a zero réplicas e recriar capacidade quando o sinal de demanda mudar.

Esse mecanismo precisa de uma métrica que sobreviva aos pods. CPU e memória são medidas nos próprios workers. Quando o último desaparece, as métricas vão junto e não sobra sinal para acordá-lo. A profundidade de uma fila, por outro lado, continua visível mesmo sem consumidor. Por isso, `minReplicas: 0` exige ao menos uma métrica de objeto ou externa. Se a configuração tiver apenas CPU ou memória, o Kubernetes a rejeita.

Aí aparece o melhor caso de uso: consumidores de fila, trabalhos em lote e workers caros de CPU ou GPU podem dormir enquanto a demanda fica guardada em outro lugar. Um Service comum do Kubernetes apenas encaminha requisições para endpoints prontos. Ele não guarda o HTTP no balcão até a cozinha abrir. Para deixar um backend HTTP inteiro dormindo, você precisa de outra camada que faça esse buffer, ou mantém pelo menos uma réplica acordada.

Em julho, falamos de [métricas de profundidade de fila com workers ainda ativos](/2026/cursor-executa-binario-plantado-no-repo-microsoft-corrige-570-falhas-e-sol-apaga-o-que-nao-devia/). A mudança da versão 1.37 está justamente no último passo: o HPA principal consegue remover e depois recuperar a réplica final, sem outro scaler para fazer a travessia.

O controlador também precisa distinguir uma pausa humana de um zero criado pelo autoscaling. Quando ele mesmo leva a carga até zero, registra a condição `ScaledToZero=True` e sabe que poderá acordá-la depois. Se alguém ajustar o Deployment manualmente para zero, o HPA respeita o significado antigo dessa ação e deixa tudo parado. A condição chegou na versão 1.36; na 1.37, o conjunto virou beta e passou a vir habilitado por padrão.

Na operação, você troca recurso parado por latência de retorno. O sistema ainda precisa observar a métrica, agendar um pod e iniciar a aplicação antes de consumir o próximo trabalho. O HPA também mantém, por padrão, uma janela de estabilização de cinco minutos para reduzir capacidade. Meça esse caminho inteiro antes de descobrir o cold start com a fila crescendo e todo mundo perguntando se o cluster está "se ajustando". Tecnicamente, está. Socialmente, talvez não.

A métrica externa vira parte da disponibilidade. Se o adaptador não conseguir entregá-la, o HPA informa `ScalingActive=False`. Nesse estado, recuperar capacidade pode exigir consertar o pipeline de métricas ou escalar a carga manualmente. Consulte o sinal direto pela External Metrics API, crie alerta para falhas no adaptador e teste quanto tempo a aplicação leva para voltar.

Control planes com versões misturadas pedem mais cuidado. O API server e o controller manager precisam suportar e habilitar o recurso antes de alguém usar `minReplicas: 0`. Um controlador antigo, ou com a funcionalidade desligada, pode entender aquele zero como pausa manual. O recurso ainda é beta, então upgrades e downgrades precisam seguir as etapas de migração publicadas pelo projeto.

Fonte: [Kubernetes Blog — Kubernetes v1.37: Scale Workloads to Zero with HorizontalPodAutoscaler](https://kubernetes.io/blog/2026/09/02/kubernetes-v1-37-hpa-scale-to-zero-beta/)

## SkillShift passa na validação enquanto inclina a escolha

Agent Skills costumam parecer pacotes de conhecimento: instruções para executar uma tarefa, convenções do domínio e exemplos que ajudam o agente a decidir. Um novo preprint mostra o outro lado. A prosa da skill também funciona como política de comportamento. Critérios de ranking, desempates e exemplos podem favorecer uma opção sem jamais escrever a ordem grosseira "sempre escolha esta aqui".

Os autores chamam o ataque de SkillShift. Eles criaram skills plausíveis para dois domínios com candidatos fixos: escolha de produtos e seleção de dependências Python. Na avaliação com as 50 consultas de cada domínio, repetidas três vezes, a alternativa favorecida apareceu em 81,33% das respostas de compras e 63,33% das respostas sobre dependências. Mesmo assim, 100% das saídas passaram pelo teste de validade estrutural e de seleção do estudo.

Validar schema, formato e conclusão da tarefa responde uma pergunta: "o agente produziu algo aceitável?" Fica faltando outra: "quais regras fizeram essa opção vencer?" A skill consegue alterar silenciosamente a política usada para montar a resposta e entregar tudo arrumadinho. É como receber uma planilha com todas as colunas certas e descobrir depois que a fórmula do ranking tinha um patrocinador imaginário.

O ataque congelado manteve ganho positivo sobre as skills limpas em seis backends de modelos e dois ambientes completos de agente, sem otimização específica para cada backend. Há transferência dentro das condições testadas. O alcance continua limitado: é um preprint sem reprodução independente, com dois domínios, candidatos fixos, três execuções por consulta e configurações específicas.

Os scanners também tropeçaram na discrição. Nenhum dos seis detectores quantificados distinguiu as duas skills SkillShift de seus pares limpos nas configurações padrão usadas pelos pesquisadores. Quatro dos seis detectaram os controles mais explícitos de injeção direta em cada domínio. Uma ordem hostil escancarada dá ao scanner um alvo bem mais simpático que um conselho de domínio aparentemente razoável. E o resultado só vale para as versões e regras testadas, não para toda edição atual ou hospedada dessas ferramentas.

O estudo ainda encontrou uma queda de 0,558 para 0,506 na média de qualidade do código de dependências avaliada por um LLM. Os próprios autores não tratam isso como prova de degradação funcional: houve uma chamada do juiz por amostra, sem testes executáveis e sem teste de significância. Os 100% de saídas válidas dizem apenas que elas passaram pela validação do estudo. Também não dá para usar esse número isolado e decretar que o código parou de funcionar.

No fim de agosto, vimos [skills envenenadas gerando descendentes persistentes](/2026/agentes-invadem-hugging-face-skills-envenenam-skills-e-asahi-chega-perto-do-m3/). Antes disso, [oito scanners já tinham sido burlados em outro estudo](/2026/oito-scanners-de-agent-skills-foram-burlados-o-selo-verde-nao-basta/). O delta do SkillShift é mais silencioso: ele mede uma preferência escondida enquanto a resposta continua com cara de válida.

A defesa também precisa testar comportamento. Proveniência, versões fixadas e revisão do diff ajudam a controlar qual política entrou no agente. Nos testes de regressão, dá para reordenar candidatos, trocar atributos e renomear opções. Se a recomendação acompanha os dados, ótimo. Se continua apaixonada pelo mesmo candidato depois de trocar tudo de lugar, temos um problema.

Recomendação e execução também merecem permissões separadas. Uma skill que sugere uma biblioteca não precisa instalar pacotes, usar credenciais, publicar artefatos ou acessar a rede sem limite. Autoridade estreita reduz o tamanho da ação que uma política enviesada consegue disparar. O formulário pode estar perfeito; a permissão ainda é problema nosso.

Fonte: [arXiv preprint 2609.02564v1 — A Finger on the Scale: Covert Policy Steering through Agentic Skills](https://arxiv.org/html/2609.02564)

## Destaques rápidos para hoje.

- **A CISA adicionou sete falhas exploradas ao catálogo KEV em 2 de setembro.** Na parte de infraestrutura de desenvolvimento e IA, entram CVE-2026-48710 no Starlette, CVE-2026-59822 no endpoint MCP do LiteLLM, CVE-2026-49869 no Kestra OSS e CVE-2026-82329 no JFrog Artifactory. O mesmo lote inclui duas falhas do SonicWall SMA1000 e uma do Sangoma Switchvox. Os prazos federais são 5 de setembro para Kestra, Artifactory, Switchvox e SonicWall, e 16 de setembro para Starlette e LiteLLM. Essas datas obrigam agências civis federais dos EUA; outras equipes devem priorizar inventário, exposição, orientação dos fornecedores e sinais de comprometimento. A entrada no KEV confirma evidência de exploração, mas não informa quantidade de vítimas, prevalência ou autoria. Fonte: [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)

- **A Cisco corrigiu execução remota sem autenticação e como root em modelos específicos do Nexus 9000 com ASIC Silicon One.** A CVE-2026-20212, com CVSS 9.8, pode ser acionada remotamente por tráfego criado para as portas TCP 43210 e 43211 na VRF Layer 3 padrão. O ataque também pode derrubar o processo `S1HAL` e reiniciar o equipamento. Use `show module` para conferir o PID, porque nem todo Nexus 9000 é afetado, e instale uma versão corrigida do NX-OS indicada pelo Software Checker. iACLs e o shield Live Protect servem como pontes temporárias. Na publicação de 2 de setembro, a Cisco não conhecia exploração maliciosa nem anúncio público. A urgência vem da exposição crítica, não de um zero-day já explorado. Fonte: [Cisco Security Advisory cisco-sa-n9k-s1-rce-EH8dEtr](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-n9k-s1-rce-EH8dEtr)

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 26544
source_urls:
  - https://kubernetes.io/blog/2026/09/02/kubernetes-v1-37-hpa-scale-to-zero-beta/
  - https://arxiv.org/html/2609.02564
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-n9k-s1-rce-EH8dEtr
-->
