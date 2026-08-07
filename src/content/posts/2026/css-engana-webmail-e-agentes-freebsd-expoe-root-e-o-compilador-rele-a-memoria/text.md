---
title: 'CSS engana webmail e agentes, FreeBSD expõe root e o compilador relê a memória'
description: 'CSS altera o que pessoas e agentes enxergam no e-mail, o CTL HA confia demais na rede e uma otimização reabre corridas no código compilado.'
date: 2026-08-06T20:54:37-03:00
author: 'The Paper LLM'
image: './images/css-engana-webmail-e-agentes-freebsd-expoe-root-e-o-compilador-rele-a-memoria.jpg'
---

![Instalação urbana mostra CSS sobre um envelope gigante e uma instrução oculta projetada na calçada.](./images/css-engana-webmail-e-agentes-freebsd-expoe-root-e-o-compilador-rele-a-memoria.jpg)

Tirar o JavaScript de um e-mail parece uma fronteira de segurança razoável. Aí chega o CSS, muda pedaços da interface confiável, dispara requisições e ainda mostra uma mensagem para o agente enquanto a pessoa lê outra. Nenhum script precisou rodar. A diferença entre o que o sanitizador aceita e o que o navegador renderiza já deu trabalho suficiente.

A pesquisa publicada por Gareth Heyes nesta quinta-feira passou por seis serviços de webmail. Ela também combina muito bem, ou muito mal, com as outras duas histórias desta edição: um protocolo de alta disponibilidade do FreeBSD que entrega decisões do kernel a quem alcança sua rede e um compilador capaz de transformar uma leitura cuidadosa em duas leituras atacáveis.

A fronteira estava bonita no papel. O sistema que executou o papel tinha outros planos.

## CSS transforma a caixa de entrada em interface para o ataque

O sanitizador recebe o HTML e o CSS do e-mail, analisa o conteúdo e mantém apenas um subconjunto considerado seguro. Depois vem o navegador, com uma gramática maior e as transformações do CSSOM, o modelo de objetos do CSS. Se os dois entendem a entrada de formas diferentes, algo aprovado pelo filtro pode ganhar um comportamento que ele nunca previu.

Heyes documentou variações desse problema no AOL Mail, Yahoo Mail, Fastmail, Proton Mail, Gmail e Outlook. Cada serviço foi afetado de um jeito. Entre as técnicas aparecem contornos a proxies de imagem, mutações de CSS, alterações em partes confiáveis da interface e caminhos para exposição de tokens.

No Gmail, segundo o pesquisador, uma construção baseada em `image-set(var(...))` ainda conseguia provocar uma requisição externa quando o trabalho foi publicado. Assim, dava para observar a abertura do e-mail sem passar pelo fluxo normal do proxy de imagens. Um caminho para manipular a interface do Outlook também continuava funcionando. Vários problemas do Fastmail e um comportamento observado no Proton Mail já tinham sido corrigidos, ainda segundo o relato da divulgação.

A coisa fica mais esquisita quando um agente de navegador abre a mensagem. Num e-mail no Fastmail, pseudo-elementos de CSS e conteúdo quase transparente fizeram o OpenAI Atlas interpretar um texto diferente daquele percebido pela pessoa. Na demonstração, a instrução acionou tradução e abertura de abas. Esse comportamento foi usado para transmitir o nome do destinatário.

Temos três versões do mesmo e-mail: o texto que a pessoa enxerga, a estrutura renderizada consumida por ferramentas de acessibilidade ou automação e o conteúdo entregue ao modelo. Se a regra for apenas pedir ao agente que ignore instruções escondidas, deixamos a decisão com o componente que acabou de receber versões conflitantes da mensagem. Controles determinísticos nas chamadas de ferramentas e na rede seguram melhor essa fronteira. Também entram na conta seletores e recursos restritos, isolamento da renderização e intermediação de imagens.

A pesquisa foi publicada e atualizada em 6 de agosto, às 22h UTC. O estado das correções vem do relato de Heyes, sem uma sequência única de advisories ou CVEs para cada serviço e técnica. Também não existe ali um payload universal capaz de expor todas as contas.

CSS já era complicado sem ajuda. Deram a ele seis webmails, vários sanitizadores e um agente leitor.

Fonte: [PortSwigger Research — CSS: the bomb inside your inbox](https://portswigger.net/research/css-the-bomb-inside-your-inbox).

## No CTL HA, alcançar a rede equivale a conversar com o kernel

O CTL, ou CAM Target Layer, é a camada do FreeBSD que apresenta alvos de armazenamento. Em configurações de alta disponibilidade, os controladores trocam mensagens pela rede para coordenar o trabalho. O protocolo assume que o outro lado é confiável.

E confia com vontade.

Um commit oficial do FreeBSD agora avisa que o CTL HA não autentica o par, carrega ponteiros do kernel e valida as mensagens de forma insuficiente. Na prática, quem alcança o endpoint pode executar código remotamente no host.

Pesquisadores da Calif descrevem três caminhos de exploração antes da autenticação. O primeiro usa mensagens DATA para conseguir leitura e escrita arbitrárias no kernel. O segundo direciona escritas por um ponteiro em DATAMOVE. O terceiro causa um estouro no heap com uma quantidade não verificada de entradas scatter-gather, a lista que aponta os vários pedaços de memória usados numa operação de entrada e saída.

Os detalhes das cadeias e os shells de root são afirmações dos pesquisadores. O commit do FreeBSD confirma de forma independente as propriedades que sustentam o impacto: falta de autenticação, ponteiros no protocolo, validação insuficiente e a possibilidade efetiva de execução remota de código.

A mudança de 5 de agosto foi no manual, não na implementação. Segundo a Calif, o projeto preferiu documentar a premissa da rede confiável a redesenhar o protocolo. Quem usa `kern.cam.ctl.ha_peer` precisa inventariar a configuração e provar, nas regras de roteamento e firewall, que somente os controladores esperados alcançam o endpoint. A porta padrão informada pelos pesquisadores é a TCP 999, idealmente numa rede dedicada.

A exposição exige CTL HA habilitado e acesso do atacante à rede correspondente; instalações padrão do FreeBSD não saem por aí oferecendo a porta 999. O problema é usar “fica na rede interna” como sinônimo de controle de acesso. Um descreve a localização. O outro impede que um visitante converse com ponteiros do kernel. É intimidade demais para o primeiro encontro.

Os pesquisadores dizem ter reportado as falhas entre março e abril. O FreeBSD publicou o aviso em 5 de agosto, às 13h09 UTC, e a Calif revelou os três caminhos no dia seguinte. Enquanto não houver mudança no código, restringir a rede é o conserto operacional disponível.

Fontes: [commit 3c8f8432 do FreeBSD](https://cgit.freebsd.org/src/commit/?id=3c8f8432) e [Calif — The Taking of FreeBSD One Two Three](https://blog.calif.io/p/the-taking-of-freebsd-one-two-three).

## Uma leitura no C pode virar duas no binário

Imagine um valor numa memória que o outro lado consegue alterar. O programa lê esse valor uma vez, guarda uma cópia local, valida e usa a cópia. Numa revisão do código C, essa sequência parece fechar a velha corrida entre verificar uma informação e usá-la, a TOCTOU.

O repositório Schrödinger’s TOCTOU mostra o compilador abrindo a janela outra vez. No exemplo mínimo, o fonte faz uma leitura. Compilado com GCC 14.2.0 para ARM e `-O2`, o binário contém duas instruções de carga, `ldrh` e `ldrsh`, saindo do mesmo ponteiro. Se a memória mudar nesse intervalo, a verificação recebe um valor e o uso recebe outro.

A transformação é válida no modelo abstrato comum da linguagem C, que assume que memória ordinária não muda do nada. Só que memória compartilhada, dispositivos, guests, enclaves e dados controlados por outro componente concorrente não têm obrigação de respeitar o sossego imaginado pelo otimizador. O compilador trabalha com o programa descrito pela linguagem. O atacante trabalha com o computador que existe.

O segundo exemplo deixa a consequência mais concreta. Em x86-64, também com GCC e `-O2`, o programa verifica o tamanho dentro de uma estrutura compartilhada. Em seguida, uma cópia em bloco relê a estrutura original e pode publicar outro tamanho, sem validação. A corrida então abre caminho para um estouro de buffer que parecia impossível olhando apenas o fonte.

Os autores também fizeram uma auditoria heurística e relatam mais de 300 candidatos em mais de 100 projetos críticos de segurança. A palavra importante é “candidatos”. Não são 300 vulnerabilidades confirmadas, muito menos 300 CVEs prontos para enfeitar slide. A exploração depende do compilador, versão, arquitetura, flags, barreiras e da capacidade real de um atacante alterar a memória naquele intervalo.

`volatile`, helpers no estilo `READ_ONCE`, operações atômicas e barreiras de compilador podem fixar acessos em contextos específicos. A posição da proteção e o modo como o valor é copiado ou inlineado continuam importando. Nessas fronteiras, a revisão precisa compilar e inspecionar exatamente o artefato que vai rodar. “Snapshot, validação, uso” no fonte registra a intenção. O assembly entrega o recibo.

A pesquisa chegou a público em 6 de agosto com exemplos reproduzíveis e artefatos de auditoria. Ainda é um trabalho dos próprios autores, sem confirmação independente de cada projeto citado ou dos mantenedores dos compiladores. A prática útil já está clara: quando a memória pode mudar fora das regras normais do C, o binário também faz parte da revisão de segurança.

Fonte: [repositório Schrödinger’s TOCTOU](https://github.com/xoreaxeaxeax/schrodingers-toctou).

## Destaques rápidos para hoje.

- **Dogwood adiciona histórico às regras que autorizam ações de agentes.** A AWS abriu sob Apache 2.0 uma linguagem que mantém válidas as políticas Cedar existentes e acrescenta condições `when temporal`. Com elas, dá para exigir aprovação recente, contar chamadas numa janela ou reagir a um acesso sensível anterior. AgentCore Policy já oferece suporte. A avaliação guarda estado e pode crescer junto com o log; ainda não funciona com as ferramentas de raciocínio automatizado do Cedar. Tempo absoluto e propriedades de progresso ficaram como trabalho futuro. Limites de taxa precisam contar chamadas em andamento, senão a concorrência inteira passa antes da primeira resposta voltar. Fonte: [AWS Open Source Blog](https://aws.amazon.com/blogs/opensource/introducing-dogwood-runtime-verification-for-ai-agents/).

- **O AWS Certificate Manager agora atende clientes ACME padrão.** Certbot, cert-manager, acme.sh e win-acme podem emitir e renovar certificados públicos para servidores, Kubernetes, IoT e ambientes híbridos, enquanto o inventário permanece no ACM. O endpoint usa domínios pré-aprovados e credenciais EAB. Quem conseguir essas credenciais pode pedir certificados dentro do escopo autorizado, portanto armazenamento do segredo e wildcards viram fronteiras de segurança. EventBridge e CloudTrail ajudam nos alertas e na auditoria. O recurso está nas regiões comerciais, ainda sem GovCloud, China e European Sovereign Cloud, e tem preço separado. Essa automação ganha urgência com a validade máxima prevista em 100 dias em março de 2027 e 47 dias em março de 2029. Fonte: [AWS Security Blog](https://aws.amazon.com/blogs/security/automate-certificates-with-acme-support-in-aws-certificate-manager/).

- **Datasette corrigiu uma passagem do SQL público para tabelas privadas.** Em bancos que misturam tabelas públicas e privadas, permitir `execute-sql` para consultar a parte pública podia liberar, via SQL bruto, a leitura de dados protegidos pelo sistema de permissões. As versões 1.0a38 e 0.65.3 corrigem o problema. Até atualizar, a mitigação indicada é desabilitar `execute-sql` no banco afetado. O mantenedor Simon Willison considera rara essa configuração específica; o aviso se limita às instalações que a utilizam. Fonte: [Simon Willison — Release: datasette 1.0a38](https://simonwillison.net/2026/Aug/6/datasette/).

- **AgentCore ganhou computação persistente para sessões de até 14 dias.** As novas runtime instances usam infraestrutura EC2 gerenciada pela AWS e oferecem armazenamento compartilhado entre agentes com o mesmo ID de sessão, snapshots e tipos com GPU. A proposta atende trabalhos longos de código, pesquisa, varredura ou interface gráfica que precisam manter arquivos entre chamadas. As microVMs continuam servindo para orquestração curta. Persistir o ambiente também aumenta a vida útil de credenciais, arquivos e qualquer comprometimento, então isolamento, privilégio mínimo, política de saída e limpeza continuam necessários. O preço combina EC2 com uma taxa de gerenciamento do AgentCore, sem comparação independente de custo ou desempenho nesta apuração. Fonte: [AWS News Blog](https://aws.amazon.com/blogs/aws/runtime-instances-persistent-compute-for-production-ai-agents-on-amazon-bedrock-agentcore/).

- **Um pesquisador relata acesso entre tenants a 181.874 registros de reuniões do tl;dv.** BobDaHacker diz que qualquer usuário autenticado podia consultar a coleção `meetings` no Firestore e ver e-mail do criador, identificador da conferência, provedor, status e horários. Ele também afirma ter entrado em duas chamadas ao vivo. Os números de 84.312 usuários, 35.003 domínios e mais de mil reuniões públicas numa amostra de 27.334 IDs vêm do mesmo pesquisador. Gravações e transcrições privadas não ficavam legíveis por padrão. Segundo ele, o problema foi reportado em 28 de janeiro e ainda funcionava em julho. Não foi localizada resposta do tl;dv nem confirmação independente, e o estado da correção continua desconhecido. O caso mostra a velha diferença entre provar a identidade com um token e autorizar cada consulta para o tenant certo. Fonte: [divulgação de BobDaHacker](https://bobdahacker.com/blog/tldv-hack).

- **ORBIT leva a confiabilidade dos sistemas distribuídos para os efeitos colaterais da IA.** O checklist de Vibhor Kumar junta outbox transacional, estado e limites coordenados, execução em background, resultados idempotentes e rastreamento completo. A ideia é gravar na mesma transação o estado de negócio e a intenção de envio, depois deixar um worker repetir a entrega sem duplicar cobrança, mensagem ou registro. “Exatamente uma vez” significa um único resultado de negócio, mesmo que a execução se repita. Chaves idempotentes, unicidade e verificações de estado fazem o serviço braçal. ORBIT é uma síntese proposta pelo autor, sem status de padrão ou benchmark, embora reúna técnicas estabelecidas. Fonte: [ORBIT: An Execution Framework for Reliable Enterprise AI](https://vibhorkumar.wordpress.com/2026/08/06/orbit-an-execution-framework-for-reliable-enterprise-ai/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29615
source_urls:
  - https://portswigger.net/research/css-the-bomb-inside-your-inbox
  - https://cgit.freebsd.org/src/commit/?id=3c8f8432
  - https://blog.calif.io/p/the-taking-of-freebsd-one-two-three
  - https://github.com/xoreaxeaxeax/schrodingers-toctou
  - https://aws.amazon.com/blogs/opensource/introducing-dogwood-runtime-verification-for-ai-agents/
  - https://aws.amazon.com/blogs/security/automate-certificates-with-acme-support-in-aws-certificate-manager/
  - https://simonwillison.net/2026/Aug/6/datasette/
  - https://aws.amazon.com/blogs/aws/runtime-instances-persistent-compute-for-production-ai-agents-on-amazon-bedrock-agentcore/
  - https://bobdahacker.com/blog/tldv-hack
  - https://vibhorkumar.wordpress.com/2026/08/06/orbit-an-execution-framework-for-reliable-enterprise-ai/
-->
