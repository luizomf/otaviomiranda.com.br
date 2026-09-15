---
title: 'Cisco corrige falha explorada no gateway de e-mail, e Luna perde bugs de segurança em teste'
description: 'Cisco pede patch e investigação; revisão barata deixa mais falhas passarem no experimento da Entelligence. Kubernetes muda um padrão de memória, Postgres guarda o progresso das tarefas e AWS separa agentes de pagamentos.'
date: 2026-09-15T05:15:00-03:00
author: 'The Paper LLM'
cover: './images/cisco-corrige-falha-explorada-no-gateway-de-e-mail-e-luna-perde-bugs-de-seguranca-em-teste.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/cisco-corrige-falha-explorada-no-gateway-de-e-mail-e-luna-perde-bugs-de-seguranca-em-teste/final.opus'
---

![Caixa metálica com marca Cisco, envelope e aviso para atualizar e investigar o Secure Email Gateway.](./images/cisco-corrige-falha-explorada-no-gateway-de-e-mail-e-luna-perde-bugs-de-seguranca-em-teste.jpg)

## Cisco corrige execução como root no gateway de e-mail

A Cisco publicou em 14 de setembro uma correção crítica para o Secure Email Gateway, equipamento pelo qual passam os e-mails da organização. A falha já está sendo explorada, segundo a empresa. A CVE-2026-76461 permite executar comandos como root sem autenticação, por uma injeção SQL no processamento das mensagens. Afeta equipamentos físicos e virtuais, qualquer que seja a configuração. Secure Email and Web Manager e Secure Web Appliance ficam fora desta falha.

As primeiras versões corrigidas são **15.5.5-014, 16.0.4-302 e 16.5.0-780**, conforme a linha instalada. A Cisco recomenda migrar para 16.5.0-780 e diz que seu Secure Email Cloud já foi atualizado. Não há alternativa temporária que resolva a vulnerabilidade.

Se você opera o equipamento, atualize e investigue se alguém já entrou. A Cisco recomenda conferir os logs de e-mail de cada membro do cluster e cruzá-los com registros externos de rede e firewall. Com root, o atacante pode apagar os próprios rastros. Você está pedindo atestado de bons antecedentes a uma máquina que ele pode ter controlado.

Em máquinas virtuais suspeitas, preserve evidências antes de reconstruir e renovar credenciais e material criptográfico. Para equipamentos físicos suspeitos, acione o suporte TAC. A CISA também incluiu a falha no catálogo de vulnerabilidades exploradas.

Fontes: [boletim da Cisco](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-inj-2bLVGmhX) e [alerta da CISA](https://www.cisa.gov/news-events/alerts/2026/09/14/cisa-adds-one-known-exploited-vulnerability-catalog).

## Luna custa menos na revisão e encontra menos falhas de segurança

A Entelligence comparou GPT-5.6 Luna e GPT-6 Astra em 50 pull requests públicos com defeitos colocados de propósito. No experimento publicado em 14 de setembro, Luna teve 69 achados aceitos por US$ 0,20; Astra, 92 por US$ 5,66. É o custo total de cada modelo naquele teste.

Nas permissões, a diferença pesa: dos 24 bugs de segurança do conjunto aceito, Luna encontrou nove e Astra, 19. Só Astra apontou, por exemplo, códigos de recuperação que não eram marcados como usados no Keycloak, sistema de identidade e acesso. É o tipo de detalhe que merece revisão cuidadosa mesmo quando a fatura da IA está uma beleza.

Os dois receberam os mesmos prompts e apenas os diffs. A Entelligence só aceitou um achado quando dois modelos avaliadores concordaram, e um deles era o próprio Astra. O concorrente também estava na banca. O código público é anterior aos cortes de conhecimento dos modelos, e falta uma lista exaustiva dos bugs. Com esses limites, os números não medem a confiabilidade geral de uma revisão em produção.

A empresa vende ferramentas de revisão. Eu usaria o experimento como ponto de partida para avaliar nosso próprio código, olhando separadamente para erros de autorização, falsos positivos e custo.

Fonte: [Entelligence — comparação de Luna e Astra](https://entelligence.ai/blogs/gpt-5.6-luna-vs-gpt-6-astra-is-a-1.20-model-good-enough-for-code-review).

## Kubernetes liga Memory QoS, mas a proteção depende da configuração

O Memory QoS chegou ao beta no Kubernetes 1.37 com a chave do recurso ligada por padrão. A limitação e a reserva de memória, porém, ainda precisam ser configuradas. O projeto explicou essa diferença em 14 de setembro. Em nós Linux com cgroup v2, esses controles permitem desacelerar alocações sob pressão e proteger memória contra recuperação pelo kernel.

No upgrade, confira `memoryThrottlingFactor`. Na fase alfa, deixar o campo de fora significava usar 0,9. Agora, o padrão é `null`, e o Kubernetes deixa de configurar o limite `memory.high`. Para manter o comportamento anterior, declare o valor; configurações já explícitas sobrevivem à atualização. O silêncio no arquivo passou a significar outra coisa.

A reserva também vem desligada, com `memoryReservationPolicy` em `None`. Se você escolher `TieredReservation`, a política vale para o nó inteiro: pods Guaranteed recebem proteção forte; Burstable, uma proteção mais flexível. Um pod individual não pode sair dessa política.

A proteção forte inclui o cache de arquivos. Sobra menos memória que o kernel pode recuperar para as cargas vizinhas, então confira quem divide o nó antes de ativá-la.

Fonte: [Kubernetes — Memory QoS em beta](https://kubernetes.io/blog/2026/09/14/kubernetes-v1-37-memory-qos-graduates-to-beta/).

## Acronis liga invasão do Gitea a acesso ao Proxmox

A Acronis publicou em 13 de setembro uma reconstrução da campanha Red Heron contra o Gitea, hospedador de repositórios Git. A investigação relata roubo de código, persistência por SSH e movimentação para a infraestrutura vizinha. Em um ambiente de Taiwan, os atacantes chegaram ao acesso administrativo como root de um cluster Proxmox de três nós. O Proxmox gerencia máquinas virtuais. O problema já tinha passado dos repositórios de código.

[Em 26 de agosto, cobrimos a entrada da falha do Gitea no catálogo de exploração](/2026/gitea-entra-no-kev-prompts-seguros-desviam-codigo-e-tags-viram-javascript/). Agora, a Acronis traz registros operacionais recuperados e a identificação de componentes maliciosos. A correção no Gitea 1.27.1 saiu em julho.

A falha afeta versões desde 1.17 e anteriores a 1.27.1. Exige acesso de escrita a repositório, Git 2.32 ou posterior, diffpatch habilitado e armazenamento temporário adequado. Com cadastro aberto, o atacante pode obter esse acesso de escrita sem ter credenciais anteriores.

Se você hospeda Gitea, atualize, procure contas e chaves inesperadas, troque segredos expostos e examine os sistemas que a conta do serviço consegue alcançar. A Acronis recomenda reconstruir hosts com comprometimento confirmado: ferramentas locais adulteradas podem esconder a persistência durante a inspeção. A investigação também relata que backups de VMs foram iniciados, mas não comprova a exfiltração completa das imagens.

Fontes: [investigação da Acronis](https://www.acronis.com/en/tru/posts/red-heron-exploits-gitea-n-day-flaw-in-multinational-campaign-exposing-new-linux-rootkit/) e [advisory do Gitea](https://github.com/go-gitea/gitea/security/advisories/GHSA-rcr6-4jqh-j84m).

## Kestrel usa Postgres para retomar tarefas após uma queda

Raman Varma descreveu em 14 de setembro como o Kestrel usa Postgres para coordenar tarefas recuperáveis sem outro serviço de orquestração. O progresso fica salvo no banco. Se um worker morre, outro pode continuar a execução a partir dos resultados registrados.

Transações curtas reservam trabalho com `SKIP LOCKED`, pulando linhas já bloqueadas. Cada execução tem uma posse temporária, renovada enquanto o worker trabalha. Quando ela expira, uma rotina devolve a execução à fila. Para quem já opera Postgres, é uma arquitetura a avaliar. O autor aponta pressão sobre conexões e manutenção da tabela de fila entre os custos operacionais.

O trecho publicado consulta o resultado anterior, executa a etapa e só depois registra a conclusão. Nesse intervalo, um efeito externo pode acontecer e uma queda impedir que o registro seja salvo. Na retomada, a etapa pode rodar de novo. Essa é uma leitura da sequência mostrada, não um incidente reproduzido.

A chave única impede duplicar o registro de conclusão. Já a API que executa o efeito externo precisa aceitar repetições sem repetir o efeito. Guardar um recibo no banco só não obriga o caixa a cobrar uma vez.

Fonte: [InfoQ — workflows duráveis com Postgres](https://www.infoq.com/articles/durable-workflows-postgres/).

## AWS separa a sugestão do agente da reserva e do pagamento

A AWS publicou em 14 de setembro uma arquitetura de remarcação de voos em que os agentes propõem opções, e código com regras explícitas cuida das reservas e dos pagamentos. O Step Functions coordena as etapas e tentativas; o Bedrock AgentCore executa o trabalho dos agentes.

No exemplo detalhado, um agente sugere voos e outro escreve o texto sobre compensação ao passageiro. Quem calcula o direito à compensação é código Lambda, consultando tabelas de regras. Depois da validação, etapas separadas executam a decisão. O agente pode caprichar na mensagem; o valor sai da regra.

Para lidar com repetições, a execução envia às APIs de reserva e pagamento identificadores derivados do passageiro e da decisão. Essas APIs precisam respeitar os identificadores para evitar duplicação.

É uma arquitetura de referência, sem medição de segurança em produção. O exemplo confere a disponibilidade numa etapa e faz a reserva em outra, sem demonstrar reserva atômica do inventário. Esse intervalo ainda precisa de tratamento no sistema que efetivamente vende o assento.

Fonte: [AWS — validação com Step Functions e AgentCore](https://aws.amazon.com/blogs/compute/validating-multi-agent-decisions-with-step-functions-and-bedrock-agentcore/).

## Destaques rápidos para hoje.

- **Emacs tem correção incompleta para execução de código ao abrir arquivos não confiáveis**, avisou o mantenedor em 14 de setembro. O risco envolve diagnósticos do Flymake também fora do modo Lisp, no Emacs 24 ou posterior, possivelmente anteriores. Evite esses diagnósticos em conteúdo não confiável e confira os patches da distribuição: a correção está prevista para 31.2, ainda sem confirmação de lançamento. Fonte: [aviso na lista oss-security](https://lwn.net/ml/all/87tsnskt3e.fsf@athena.silentflame.com/).

- **Rustls 0.23.45 corrige mensagens de negociação TLS aceitas no nível de criptografia errado.** Se você usa uma versão entre 0.23.13 e 0.23.44 dessa biblioteca TLS para Rust, atualize a dependência. Segundo os mantenedores, a autenticação do histórico da negociação impede um atacante no caminho da rede de usar a falha para alterar ou completar essa negociação. Fonte: [notas do Rustls](https://github.com/rustls/rustls/releases/tag/v%2F0.23.45).

- **uv 0.12.14 muda códigos de saída em operações de pacotes Python.** Falhas esperadas retornam 1; falhas operacionais reconhecidas e internas, 2. Se seu CI decide o próximo passo pelo código retornado, confira essa distinção nos scripts que chamam o gerenciador. Fonte: [notas do uv](https://github.com/astral-sh/uv/releases/tag/0.12.14).

- **Copilot está recebendo preferências de eficiência, equilíbrio e inteligência na seleção automática.** As três usam o mesmo conjunto de modelos e escolhem a cada prompt. Você orienta custo, qualidade e tempo de resposta; a cobrança segue o modelo escolhido. Até a opção inteligência pode escolher um modelo pequeno. Fonte: [GitHub](https://github.blog/changelog/2026-09-14-configure-cost-and-quality-in-copilot-auto-model-selection/).

- **Vercel adicionou autenticação por assinatura nativa à camada de agentes do AI SDK**, quando o executor integrado oferece suporte. Em `direct`, credenciais explícitas do provedor no ambiente têm prioridade. `auto` segue essa regra sem credenciais do Gateway; `ai-gateway` nunca lê assinaturas nativas. Confira qual conta sua integração está usando. Fonte: [Vercel](https://vercel.com/changelog/ai-sdk-harness-native-subscription-authentication).

- **Cilium 1.20 adicionou TCPRoute e UDPRoute ao suporte à Gateway API.** Com essa ferramenta de rede para Kubernetes, você passa a gerenciar serviços TCP e UDP pelo mesmo modelo usado para HTTP. A demonstração reúne os três tipos de entrada num Gateway compartilhado. Fonte: [anúncio do projeto na CNCF](https://www.cncf.io/blog/2026/09/14/cilium-1-20-gateway-api-externalauth-tcproute-udproute-eni-ipam-for-ipv6-and-more/).

- **GNU Coreutils 9.12 saiu em 14 de setembro com `uname -A`, também chamado `--all-labeled`.** O comando mostra cada informação com rótulo, uma por linha. No diagnóstico e no suporte Linux, você pode identificar os campos sem decifrar a posição de cada um. Fonte: [notas oficiais do Coreutils](https://raw.githubusercontent.com/coreutils/coreutils/v9.12/NEWS).

- **F5 relatou na semana passada sondagens de agosto contra servidores de desenvolvimento Vite**, em busca de arquivos de ambiente e credenciais. As observações não comprovam roubo em organizações reais. Revise portas públicas, mapeamentos Docker e proxies, atualize o Vite e investigue segredos potencialmente expostos para fazer a rotação. Fonte: [F5 Labs](https://www.f5.com/labs/articles/cloud-takeover-mass-scanning-for-exposed-vite-endpoints-cve-2026-39364).

- **Swift-Qwen3.8-27B propõe raciocínio mais curto, com perda que depende da tarefa.** No teste da UkisAI, a pontuação no AIME 2026 caiu de 98,67% para 94%. O repositório foi atualizado no domingo. Uso comercial acima de US$ 1 milhão de receita recorrente anual, incluindo afiliadas, exige licença separada. Fontes: [modelo e licença](https://huggingface.co/ukisai/Swift-Qwen3.8-27b) e [metadados](https://huggingface.co/api/models/ukisai/Swift-Qwen3.8-27b).

- **Yardi comprou a Sidero Labs**, anunciou a empresa em 14 de setembro. Para quem usa Talos, Linux mínimo voltado a Kubernetes, a Sidero promete manter MPL-2.0, repositórios e processo de contribuição. Ela também diz que continuará operando como empresa independente dentro do grupo. Fonte: [Sidero Labs](https://www.siderolabs.com/blog/sidero-labs-joins-yardi).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27354
source_urls:
  - https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-inj-2bLVGmhX
  - https://www.cisa.gov/news-events/alerts/2026/09/14/cisa-adds-one-known-exploited-vulnerability-catalog
  - https://entelligence.ai/blogs/gpt-5.6-luna-vs-gpt-6-astra-is-a-1.20-model-good-enough-for-code-review
  - https://kubernetes.io/blog/2026/09/14/kubernetes-v1-37-memory-qos-graduates-to-beta/
  - https://www.acronis.com/en/tru/posts/red-heron-exploits-gitea-n-day-flaw-in-multinational-campaign-exposing-new-linux-rootkit/
  - https://github.com/go-gitea/gitea/security/advisories/GHSA-rcr6-4jqh-j84m
  - https://www.infoq.com/articles/durable-workflows-postgres/
  - https://aws.amazon.com/blogs/compute/validating-multi-agent-decisions-with-step-functions-and-bedrock-agentcore/
  - https://lwn.net/ml/all/87tsnskt3e.fsf@athena.silentflame.com/
  - https://github.com/rustls/rustls/releases/tag/v%2F0.23.45
  - https://github.com/astral-sh/uv/releases/tag/0.12.14
  - https://github.blog/changelog/2026-09-14-configure-cost-and-quality-in-copilot-auto-model-selection/
  - https://vercel.com/changelog/ai-sdk-harness-native-subscription-authentication
  - https://www.cncf.io/blog/2026/09/14/cilium-1-20-gateway-api-externalauth-tcproute-udproute-eni-ipam-for-ipv6-and-more/
  - https://raw.githubusercontent.com/coreutils/coreutils/v9.12/NEWS
  - https://www.f5.com/labs/articles/cloud-takeover-mass-scanning-for-exposed-vite-endpoints-cve-2026-39364
  - https://huggingface.co/ukisai/Swift-Qwen3.8-27b
  - https://huggingface.co/api/models/ukisai/Swift-Qwen3.8-27b
  - https://www.siderolabs.com/blog/sidero-labs-joins-yardi
-->
