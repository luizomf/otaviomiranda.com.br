---
title: "OAuth confiável também vaza dados; agentes de código ganham um teste de realidade"
description: "Campanhas abusam consentimentos e integrações SaaS, um estudo mede agentes de código na Microsoft e a Netflix explica sua topologia em escala."
date: 2026-07-13T21:53:56-03:00
author: 'The Paper LLM'
image: './images/oauth-confiavel-tambem-vaza-dados-agentes-de-codigo-ganham-um-teste-de-realidade-cover.jpg'
---

![Crachá OAuth conectado a permissões de aplicativos e a uma faixa de registros sobre tecido coral.](./images/oauth-confiavel-tambem-vaza-dados-agentes-de-codigo-ganham-um-teste-de-realidade-cover.jpg)

Um login pode parecer legítimo e, mesmo assim, abrir caminho para a coleta de dados. Foi o que a Microsoft encontrou ao reunir campanhas que exploravam consentimentos, integrações e acesso de convidados em serviços online. Dentro da própria empresa, pesquisadores também mediram o uso de agentes de código e observaram mais entregas, mas isso não prova que o software ficou melhor. Já a Netflix mostra um problema bem concreto: quando o tráfego se distribui mal, até uma arquitetura elegante pode jogar cem vezes mais carga em alguns nós.

## A confiança entre aplicativos virou caminho para exfiltração

Não é preciso roubar uma senha ou instalar malware para entrar numa aplicação corporativa. Em um relatório publicado em 13 de julho, a Microsoft descreveu três caminhos observados entre meados de 2025 e meados de 2026. Em todos eles, os invasores exploravam uma confiança já concedida a um aplicativo, uma integração externa ou um visitante.

No primeiro, o atacante telefonava para a vítima e a convencia a autorizar um aplicativo malicioso que se apresentava como o Salesforce Data Loader. Como o consentimento liberava chamadas de API, o aplicativo herdava os privilégios do usuário. Depois disso, o tráfego podia se passar por uma operação normal, sem a anomalia tradicional de um login suspeito.

O segundo passava por integrações confiáveis. Tokens e conexões comprometidos mantinham o acesso aos dados e permitiam extraí-los por fluxos que o serviço já esperava. O relatório cita incidentes relacionados a Salesloft Drift, em agosto de 2025; Gainsight, em novembro daquele ano; e Klue, em junho de 2026. Portanto, não basta revisar contas humanas. Uma conexão de terceiro esquecida pode continuar funcionando quando ninguém mais se lembra de quem a aprovou.

No terceiro caminho, os invasores aproveitavam permissões de convidado mal configuradas para consultar dados por interfaces do serviço, incluindo endpoints Aura e GraphQL. Segundo a Microsoft, essa atividade não resultou de uma vulnerabilidade inerente ao Salesforce. O problema estava nas permissões expostas e nas relações de confiança, e não numa falha universal da plataforma.

A atribuição exige cuidado. O relatório descreve atividade com técnicas sobrepostas às comumente associadas ao ShinyHunters, mas isso não comprova que o grupo esteve por trás de cada incidente. O material publicado também não permite estimar a quantidade de vítimas nem o volume total de dados.

Na prática, as equipes precisam revisar aplicativos conectados, consentimentos, permissões de convidados e integrações de terceiros. Consultas e exportações fora do padrão também merecem atenção, mesmo quando a autenticação parece correta. A Microsoft diz que trabalhou com a Salesforce para aumentar a granularidade dos eventos disponíveis em sua ferramenta de monitoramento. A tarefa é descobrir quais sistemas ainda podem agir em nome de cada usuário.

Fonte: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/07/13/defending-saas-based-applications-against-shinyhunters-oauth-abuse/).

## Mais pull requests não encerram a discussão sobre agentes de código

Um novo estudo acompanhou a adoção de agentes que trabalham pelo terminal entre dezenas de milhares de engenheiros da Microsoft. Os autores associaram o uso das ferramentas a aproximadamente 24% mais pull requests mesclados do que em um cenário contrafactual estimado. O número chama atenção, mas não significa “24% mais produtividade”.

O trabalho é um preprint e ainda não passou por revisão por pares. Ele acompanha um rollout no início de 2026, com uma janela posterior de 5 de janeiro a 29 de abril. A análise de adoção se concentra no Copilot CLI; a de resultados inclui também o Claude Code. O período termina antes de uma mudança interna que restringiria o Claude Code para a maioria dos engenheiros e prejudicaria a comparação.

Segundo os pesquisadores, o primeiro uso se espalhou principalmente pela exposição social: ver colegas usando a ferramenta teve mais relação com a tentativa inicial. A permanência apareceu mais associada à atividade de código do que a características demográficas ou de carreira. Para o estudo, retenção significa ter atividade em pelo menos cinco dos 14 dias seguintes ao primeiro uso.

O aumento estimado de entregas persistiu durante a janela de quatro meses. Só que pull request mesclado mede output, não qualidade. Essa métrica não mostra quantos bugs entraram, quanto trabalho de manutenção veio depois, se o cliente recebeu mais valor ou se a empresa economizou dinheiro. O próprio artigo deixa em aberto a qualidade do software produzido com o throughput adicional.

O desenho observacional também tem limites. Quem adota cedo pode ter tarefas, hábitos ou motivação diferentes. As ferramentas talvez se encaixem melhor em certos tipos de trabalho, e o ambiente da Microsoft favorece uma integração mais próxima com um dos produtos estudados. Como essa população já tinha acesso a outras formas de assistência do GitHub Copilot, não dá para generalizar o resultado para empresas que estão começando do zero.

Quem conduz um rollout precisa olhar além do número de licenças ativadas: acompanhar uso repetido, custo de tokens e fluxo de entregas, além de medir separadamente defeitos, manutenção e impacto para o usuário. Os autores declaram ter usado assistência de IA no código de análise e numa versão inicial do texto, com verificação e responsabilidade humanas. Isso descreve o método; por si só, não confirma nem invalida os resultados.

Fontes: [resumo do preprint no arXiv](https://arxiv.org/abs/2607.01418) e [versão integral do estudo](https://arxiv.org/html/2607.01418v1).

## A Netflix precisou redistribuir o tráfego duas vezes

Um mapa de dependências parece simples até os dados chegarem de forma muito desigual. A Netflix detalhou como construiu sua topologia de serviços com fluxos de rede, métricas entre processos e rastreamento distribuído. As três camadas ficam fisicamente separadas. A API pode consultá-las isoladamente ou combiná-las para responder quem depende de quem.

Os fluxos de rede têm um problema próprio. Eles registram saltos por balanceadores, proxies e tradução de endereços, enquanto a equipe precisa reconstruir a relação lógica entre aplicações. O primeiro estágio agrega os registros em janelas de cinco minutos. O segundo redistribui os dados e resolve os intermediários. No terceiro, o sistema redistribui novamente, enriquece o resultado e o persiste.

Essa segunda redistribuição não fazia parte do desenho inicial. Com dois estágios, o agrupamento por intermediário levava alguns nós a receber até cem vezes o tráfego típico. Esses hot nodes acumulavam trabalho e ameaçavam o pipeline inteiro. As métricas entre processos, por outro lado, já chegam particionadas no nível da aplicação e podem passar por um pipeline de apenas um estágio.

Quando o armazenamento ou as etapas seguintes ficam lentos, os fluxos reativos propagam backpressure até os consumidores do Kafka. Assim, em vez de deixar a fila interna crescer sem limite ou derrubar o processamento, o sistema reduz o ritmo de entrada e aceita o atraso. Embora o artigo fale em atualização próxima do tempo real, isso costuma representar dezenas de minutos e pode demorar mais sob pressão.

Nesse fluxo, a equipe também trocou gRPC por eventos enviados pelo servidor, os SSE. As medições internas mostraram que serialização, pools de conexões e memória custavam mais do que o trabalho útil naquele padrão de uso. A decisão vale para esse sistema, com dados já agregados e enviados continuamente. O artigo não recomenda abandonar gRPC de forma geral.

Segundo a Netflix, a plataforma processa milhões de registros de fluxo por segundo e responde consultas em menos de um segundo. Esses números não foram reproduzidos externamente. A arquitetura também usa hashing consistente e descoberta dinâmica para acompanhar o aumento e a redução de instâncias, além das implantações. Para outros sistemas, a lição concreta é medir o particionamento real antes de escolher o protocolo ou o número de agregadores.

Fonte: [Netflix TechBlog](https://netflixtechblog.com/building-service-topology-at-scale-architecture-challenges-and-lessons-learned-f4b792f3f0d8).

## Notas rápidas

### Java sem o pico de inicialização, mas com capacidade fixa

A AWS comparou quatro modos de execução para aplicações Java. O teste reuniu 240 mil requisições em três cargas, com Spring Boot 4.0.6 sobre Java 25. Em Managed Instances, a máquina virtual permanece viva entre chamadas. Assim, compilação otimizada, pools e heap podem amadurecer em vez de recomeçar a cada invocação.

A empresa relata melhora de 18% a 30% na mediana e de 27% a 41% no percentil 99 em relação ao modo padrão. As configurações de computação eram diferentes, porém, e os resultados são do próprio fornecedor. Managed Instances cobra por instância e combina melhor com tráfego sustentado. Antes de migrar, é preciso repetir o teste com a carga, a concorrência, a versão e o custo reais. “Sem cold start” descreve aqui o caminho depois do provisionamento, não a ausência de inicialização ou operação.

Fonte: [AWS Compute Blog](https://aws.amazon.com/blogs/compute/eliminating-java-cold-starts-with-aws-lambda-managed-instances/).

### Um segundo middleware fez um tipo válido virar objeto vazio

No SDK TypeScript do Inngest, a composição de dois middlewares podia reduzir o retorno de `step.run` a um objeto vazio. O programa rodava corretamente; a falha estava na análise estática. Bastava uma propriedade opcional num objeto aninhado para disparar o problema.

A transformação `Jsonify` preservava a marca de campo opcional. Ao ler os valores do tipo mapeado, ela deixava `undefined` entrar na união usada para selecionar chaves, e a segunda aplicação ampliava o erro. A correção passou a filtrar as chaves diretamente com remapeamento. Testes que acessam uma propriedade concreta também revelaram o defeito melhor do que comparações entre aliases ainda não resolvidos. Esse caso pertence à implementação em questão, não a todo uso de tipos mapeados.

Fonte: [Inngest Blog](https://www.inngest.com/blog/adding-a-second-middleware-broke-our-typescript-types).

### Prefect anuncia acordo para comprar a Dagster Labs

A Prefect anunciou um acordo para adquirir a Dagster Labs. Integrantes da equipe adquirida devem se juntar à compradora. A empresa afirma que Dagster e Dagster+ continuarão recebendo investimento e que os clientes atuais não precisam tomar nenhuma medida imediata.

No anúncio, Dagster aparece como camada de resultados, Prefect como execução e FastMCP como acesso numa futura plataforma para agentes. Essa é a direção declarada pelo comprador. Manutenção, compatibilidade e integração ainda não são resultados observados. Preço e cronograma de fechamento também não foram divulgados. Usuários podem acompanhar o roadmap, a governança do código aberto e os contratos sem iniciar uma migração que não foi anunciada.

Fonte: [Prefect](https://www.prefect.io/prefect-acquires-dagster).

### Um jogo de terminal deixa o SQLite calcular cada pixel

DOOMQL é um jogo de tiro original, inspirado no gênero de Doom, em que o SQLite calcula movimento, colisão, inimigos, combate e o quadro de pixels. Uma consulta devolve a imagem visível. O programa em Python leva teclas, tempo e tamanho do terminal ao banco e depois imprime o resultado; a lógica do jogo e o desenho ficam nas consultas e views.

O projeto também inclui um inspetor somente leitura. Os eventos de auditoria são gravados na mesma transação da ação, então um rollback desfaz ambos. O README declara 36 testes para comportamento, determinismo, renderização e separação entre banco e host. Não houve execução local nesta apuração, e o repositório tinha apenas dois commits quando foi inspecionado. É um experimento legível sobre estado transacional, não uma recomendação de banco para engines de jogos.

Fontes: [repositório do DOOMQL](https://github.com/petergpt/doomql) e [nota de Simon Willison](https://simonwillison.net/2026/Jul/13/doomql/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_strategy: fresh-radar
briefing_slug: none
edition_mode: roundup
public_sources:
  - https://www.microsoft.com/en-us/security/blog/2026/07/13/defending-saas-based-applications-against-shinyhunters-oauth-abuse/
  - https://arxiv.org/abs/2607.01418
  - https://arxiv.org/html/2607.01418v1
  - https://netflixtechblog.com/building-service-topology-at-scale-architecture-challenges-and-lessons-learned-f4b792f3f0d8
  - https://aws.amazon.com/blogs/compute/eliminating-java-cold-starts-with-aws-lambda-managed-instances/
  - https://www.inngest.com/blog/adding-a-second-middleware-broke-our-typescript-types
  - https://www.prefect.io/prefect-acquires-dagster
  - https://github.com/petergpt/doomql
  - https://simonwillison.net/2026/Jul/13/doomql/
-->
