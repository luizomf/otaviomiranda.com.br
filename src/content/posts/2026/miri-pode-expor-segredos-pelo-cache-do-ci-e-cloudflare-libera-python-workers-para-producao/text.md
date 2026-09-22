---
title: 'Miri pode expor segredos pelo cache do CI, e Cloudflare libera Python Workers para produção'
description: 'Rust orienta limpar caches potencialmente expostos; Python chega aos Workers com limites para extensões nativas. Grok 4.7 mantém preço-base, e Benchling detalha isolamento de agentes.'
date: 2026-09-22T05:21:46-03:00
author: 'The Paper LLM'
image: './images/miri-pode-expor-segredos-pelo-cache-do-ci-e-cloudflare-libera-python-workers-para-producao.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/miri-pode-expor-segredos-pelo-cache-do-ci-e-cloudflare-libera-python-workers-para-producao/final.opus'
---

![Jaqueta com símbolo do Rust e cargo miri, com chaves visíveis no bolso target/, ilustrando o risco de segredos no cache do CI.](./images/miri-pode-expor-segredos-pelo-cache-do-ci-e-cloudflare-libera-python-workers-para-producao.jpg)


## Miri pode deixar segredos em caches acessíveis a pull requests

A equipe de segurança do Rust alertou em 21 de setembro que o Miri, ferramenta que verifica a execução de código Rust, guarda variáveis de ambiente em `target/`. Se elas contiverem segredos e esse diretório for parar num cache acessível a pull requests, as credenciais podem ficar expostas.

Confira se as condições se juntam no seu CI: ele executa `cargo miri`, passa segredos para esse passo por variáveis de ambiente e salva `target/` num cache que os PRs conseguem ler. O GitHub permite que PRs de forks leiam caches da branch de destino. O acesso é só de leitura. Para levar uma credencial, basta.

A orientação é manter os segredos longe do Miri ou desabilitar o cache desse job, **limpar os caches afetados** e considerar a rotação das credenciais potencialmente expostas. A divulgação não estabelece que houve exploração.

A correção está prevista para a nightly de 22 de setembro, mas o anúncio avisa que ela pode ainda não estar disponível. Mesmo depois de atualizar, você continua com os caches antigos para limpar.

Fontes: [Rust Blog](https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/) e [documentação de caches do GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching#restrictions-for-accessing-a-cache).

## Cloudflare passa a dar suporte de produção a Python Workers

A Cloudflare anunciou em 21 de setembro a disponibilidade geral de Python Workers. Python agora tem suporte de produção na plataforma, com frameworks como FastAPI, Django e Flask e integrações nativas com os serviços de armazenamento, filas e workflows da empresa.

Por baixo, o interpretador roda compilado para WebAssembly, por meio do Pyodide. As pontes ASGI e WSGI conectam os frameworks ao sistema de requisições dos Workers. Você reconhece o código da aplicação, mas o ambiente onde ele roda é outro.

Para acessar bancos, as operações de socket passam pela API de conexão dos Workers, com suporte a drivers e integração com Hyperdrive. É por aí que aplicações Python podem conversar com PostgreSQL ou MySQL.

Antes de levar a aplicação, confira as dependências: extensões escritas em C, C++ ou Rust precisam de compilação compatível com WebAssembly. O framework entrou; a comitiva ainda passa na portaria.

Fonte: [Cloudflare Blog](https://blog.cloudflare.com/python-workers-ga/).

## Grok 4.7 chega com o mesmo preço-base de API

A SpaceXAI lançou o Grok 4.7 em 21 de setembro, com acesso pela API, pelo Cursor e pelo Grok Build. O foco é programação e trabalhos de conhecimento mais longos. O preço-base começa em US$ 2 por milhão de tokens de entrada e US$ 6 por milhão de saída, os mesmos valores-base listados para o Grok 4.6.

Segundo a empresa, a versão usa um modelo-base maior e passou por um treinamento por reforço mais longo, com ênfase em tarefas de várias horas. A desenvolvedora também promete melhorias na verificação e no tratamento de contexto, ainda sem avaliação independente aqui.

A variante rápida é anunciada com o dobro da velocidade de saída e o dobro do preço. Confira qual das duas você está colocando na conta.

Se você usa agentes de programação, compare quantas tarefas o modelo conclui e quanto custa no seu projeto. As ferramentas e permissões de execução continuam sob controle do sistema que envolve o modelo. Mais horas trabalhando também exigem saber onde ele pode mexer.

Fonte: [anúncio da SpaceXAI](https://x.ai/news/grok-4-7).

## Benchling separa rede, DNS e acesso aos dados dos agentes

Benchling e AWS publicaram em 21 de setembro como isolam código científico gerado por agentes com o AgentCore Code Interpreter. A configuração já está em uso desde abril: o código roda numa conta AWS separada da produção, em uma rede privada sem gateway de internet nem NAT.

O acesso permitido a serviços passa por endpoints privados. O DNS, que resolve os nomes, tem um controle separado: um firewall libera destinos aprovados e bloqueia as demais consultas. Mesmo depois de tirar a saída comum para a internet, esse caminho precisa ser conferido.

No armazenamento, políticas dos endpoints limitam o acesso ao S3. Credenciais temporárias e políticas de sessão restringem cada tarefa aos dados do cliente correspondente. Rede, identidade e dados têm controles distintos; o crachá do agente precisa dizer mais que “trabalha aqui”.

A validação é relatada pelas próprias equipes, sem uma auditoria independente de todas as possibilidades de fuga. Segundo elas, testes de integração tentam consultas DNS, conexões diretas e acessos ao S3 fora do escopo autorizado. Se uma violação passa, o pipeline falha e a release fica bloqueada.

Fonte: [relato de engenharia da Benchling e AWS](https://aws.amazon.com/blogs/machine-learning/how-benchling-secured-multi-tenant-ai-agents-with-amazon-bedrock-agentcore/).

## Modelo de retries mostra uma fila estável que trabalha mal

Murat Demirbas publicou em 21 de setembro um modelo exploratório em que limitar o tamanho das filas mantém o sistema ocupado com trabalho duplicado. A fila para de crescer, enquanto parte da capacidade continua gasta em repetir pedidos.

[No dia 18, falamos da coordenação de retries do Uber](/2026/uber-freia-tempestades-de-retries-e-dokploy-corrige-backup-que-pode-dar-root/). Esta análise independente olha para outro ponto: o que acontece quando um timeout dispara uma nova tentativa e o pedido original ainda está em andamento. A repetição disputa espaço com trabalho novo e pode alimentar mais repetição.

No exemplo simulado com filas limitadas, duas de cada três unidades de capacidade atendem duplicatas. Só uma faz trabalho útil. É um resultado daquele modelo, sem medição de produção nem uma taxa geral de desperdício. O sistema encontrou estabilidade fazendo bastante coisa que já estava fazendo.

Se você opera APIs ou workers, acompanhe quantos pedidos úteis terminam e quantas duplicatas ocupam o sistema, junto do tamanho da fila. Orçamentos de retries e prioridade para trabalho novo rompem o ciclo no modelo. O autor ainda deixa em aberto uma teoria geral para a composição desses sistemas.

Fonte: [análise de Murat Demirbas](https://muratbuffalo.blogspot.com/2026/09/in-search-of-compositional-theory-of.html).

## VPS dá endereço público ao servidor caseiro atrás de CGNAT

David Álvarez Rosa publicou em 21 de setembro sua configuração para receber conexões num servidor doméstico atrás de CGNAT. Essa camada de tradução de endereços fica no provedor, fora do controle do roteador de casa. Você abre a porta do roteador e ainda tem outra pelo caminho.

Na configuração, a máquina doméstica inicia um túnel WireGuard até um VPS com endereço público. O VPS recebe as conexões e troca o destino para encaminhá-las ao servidor de casa, preservando o endereço de origem do cliente.

A resposta também precisa voltar pelo caminho certo. Regras de roteamento baseadas na origem mandam as respostas do serviço pelo túnel, enquanto o tráfego próprio da máquina doméstica segue pela rota normal. É esse caminho de volta que completa a ligação.

O exemplo encaminha portas de forma ampla, com exceções para os acessos separados de SSH e WireGuard. Se você adaptar a ideia, escolha deliberadamente quais serviços expor. Mantenha também uma entrada administrativa alternativa, como recomenda o autor, para conseguir acessar a máquina se a ponte cair.

Fonte: [configuração de David Álvarez Rosa](https://david.alvarezrosa.com/posts/self-hosting-behind-cgnat/).

## Destaques rápidos para hoje.

- **A CISA incluiu a falha CVE-2026-7273 dos switches Zyxel GS1900 no catálogo de exploração conhecida em 21 de setembro.** Ela permite executar comandos sem autenticação a partir da rede local. Confira o modelo exato e aplique o firmware corrigido indicado na tabela. Fontes: [CISA](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) e [Zyxel](https://www.zyxel.com/global/en/support/security-advisories/zyxel-security-advisory-for-stack-based-buffer-overflow-vulnerability-in-gs1900-series-switches-06-16-2026).

- **Rsync 3.5.1 corrige regressões da [3.5.0 já coberta](/2026/rsync-corrige-33-falhas-e-agentes-acertam-pelo-caminho-errado/).** Voltam a funcionar caminhos explícitos com ancestrais que são links simbólicos e casos com descritores de arquivos ou substituição de processos. A restrição de caminhos recursivos permanece. Teste seus scripts de backup e deploy ao atualizar. Fonte: [rsync NEWS](https://download.samba.org/pub/rsync/NEWS).

- **A Constructive anunciou o pgsql-test para testar aplicações num PostgreSQL real, com reversão das transações.** Clientes administrativos e de aplicação separados permitem testar a segurança por linha, ou RLS, sob o papel correto, em vez de um superusuário que a ignora. A identidade de teste não valida tokens de autenticação. Fonte: [anúncio no PostgreSQL.org](https://www.postgresql.org/about/news/pgsql-test-real-postgres-testing-for-faster-development-loops-3380/).

- **A Linear retirou um cache de dependências que demorava mais para restaurar do que instalar.** No CI medido pela equipe, restaurar `node_modules` levava cerca de 28 segundos; instalar só as dependências necessárias, 7,5 segundos. Meça no seu pipeline: a economia também precisa descontar o frete. Fonte: [engenharia da Linear](https://linear.app/now/ci-bottleneck-reworked).

- **Grafana 13.2 disponibiliza múltiplas árvores de políticas de notificação.** Cada equipe pode administrar separadamente como agrupa e encaminha seus alertas, pela interface, API ou Terraform. Regras sem uma seleção explícita continuam na árvore padrão, então dá para migrar aos poucos. Fonte: [Grafana Labs](https://grafana.com/blog/grafana-alerting-scale-alert-routing-without-scaling-complexity-using-multiple-notification-policies/).

- **Kubernetes detalhou o sinal de armazenamento sem uso da versão 1.37, em beta e habilitado por padrão.** A condição `Unused` registra quando nenhum pod ainda não finalizado referencia a solicitação de volume; pods pendentes contam como uso. Use o sinal para revisar volumes. Apagar os dados exige outra decisão. Fonte: [Kubernetes Blog](https://kubernetes.io/blog/2026/09/21/kubernetes-v1-37-pvc-last-used-time/).

- **A Xiaomi publicou o MiMo-V2.6-Distill-Qwen-9B, modelo de nove bilhões de parâmetros derivado do Qwen3.5-9B.** Os pesos receberam ajuste supervisionado com exemplos gerados pelo MiMo. São um ponto de partida para pesquisa de agentes com aprendizado por reforço, útil para quem quer avaliar modelos menores. Fonte: [modelo oficial da Xiaomi MiMo](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B).

- **Kev atualizou em 21 de setembro seus modelos locais de decisão, de 0,8, 4 e 9 bilhões de parâmetros.** Eles pontuam alternativas fornecidas pelo programa, incluindo sim ou não, múltipla escolha e notas. Dá para experimentar classificação e roteamento; a confiança retornada não é uma taxa medida de acerto. Fonte: [repositório Kev](https://github.com/jaredpalmer/kev).

- **Kitty 0.49.0 adiciona shaders personalizados e melhorias no processamento de saída do terminal.** O projeto relata ganhos de vazão de 15% a 35%, dependendo da carga. A medição é do processamento no terminal, não da execução do comando. Teste com a saída que você costuma acompanhar. Fonte: [changelog do kitty](https://sw.kovidgoyal.net/kitty/changelog/).

- **WebKitGTK e WPE WebKit 2.54 passam a combinar as camadas das páginas com Skia por padrão.** Segundo a Igalia, a mudança implementa recursos ausentes e melhora a maioria dos testes, com regressões em algumas cargas. Aplicações afetadas podem comparar com o compositor anterior usando `WEBKIT_USE_SKIA_FOR_COMPOSITION=0`. Fonte: [relato da Igalia](https://blogs.igalia.com/carlosgc/2026/09/21/skia-compositor-for-wpe-webkit-and-webkitgtk/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27839
source_urls:
  - https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/
  - https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching#restrictions-for-accessing-a-cache
  - https://blog.cloudflare.com/python-workers-ga/
  - https://x.ai/news/grok-4-7
  - https://aws.amazon.com/blogs/machine-learning/how-benchling-secured-multi-tenant-ai-agents-with-amazon-bedrock-agentcore/
  - https://muratbuffalo.blogspot.com/2026/09/in-search-of-compositional-theory-of.html
  - https://david.alvarezrosa.com/posts/self-hosting-behind-cgnat/
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://www.zyxel.com/global/en/support/security-advisories/zyxel-security-advisory-for-stack-based-buffer-overflow-vulnerability-in-gs1900-series-switches-06-16-2026
  - https://download.samba.org/pub/rsync/NEWS
  - https://www.postgresql.org/about/news/pgsql-test-real-postgres-testing-for-faster-development-loops-3380/
  - https://linear.app/now/ci-bottleneck-reworked
  - https://grafana.com/blog/grafana-alerting-scale-alert-routing-without-scaling-complexity-using-multiple-notification-policies/
  - https://kubernetes.io/blog/2026/09/21/kubernetes-v1-37-pvc-last-used-time/
  - https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B
  - https://github.com/jaredpalmer/kev
  - https://sw.kovidgoyal.net/kitty/changelog/
  - https://blogs.igalia.com/carlosgc/2026/09/21/skia-compositor-for-wpe-webkit-and-webkitgtk/
-->
