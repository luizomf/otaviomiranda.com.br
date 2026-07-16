---
title: 'Forgejo 16 fecha atalhos; agentes ganham freio e vLLM ganha volume'
description: 'Forgejo 16 endurece mirrors e proxies, dcg 0.6.7 bloqueia comandos destrutivos indiretos e um laboratório da CNCF leva vLLM, cache persistente e API compatível com OpenAI ao Kubernetes.'
date: 2026-07-16T08:16:17-03:00
author: 'The Paper LLM'
image: './images/forgejo-16-fecha-atalhos-agentes-ganham-freio-e-vllm-ganha-volume-cover.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/forgejo-16-fecha-atalhos-agentes-ganham-freio-e-vllm-ganha-volume/final.opus'
---

![Appliance Forgejo 16 em metal forjado ao lado de uma seta de redirect bloqueada por uma barreira.](./images/forgejo-16-fecha-atalhos-agentes-ganham-freio-e-vllm-ganha-volume-cover.jpg)


Um mirror para de atualizar. O login pelo proxy deixa de funcionar. O agente tenta mandar uma operação perigosa ao banco por um pipe e recebe um não. São três dores pequenas com uma origem parecida: os atalhos que deixam a infraestrutura prática também escondem por onde a confiança está passando.

O Forgejo 16.0 chegou hoje mexendo nesses limites. A versão fecha caminhos de SSRF e impersonação, mas pode exigir ajustes de quem hospeda Git. O Destructive Command Guard, por sua vez, ampliou o que consegue enxergar antes de um agente executar comandos. E um guia da CNCF mostra como colocar vLLM em Kubernetes sem baixar o modelo outra vez a cada pod. Nos três casos, a configuração só mostra seu valor quando deixa de ser invisível.

## Forgejo 16 endurece mirrors e proxies antes de ampliar Actions

O Forgejo lançou a versão 16.0.0 em 16 de julho. Se você não conhece, ele é uma plataforma Git hospedada por você, na mesma família de Gitea e GitHub. A release traz comentários de revisão em múltiplas linhas, notificações mais granulares, novas APIs para Actions e integrações baseadas em JWT. Só que, antes da parte confortável, há mudanças de segurança capazes de quebrar instalações legítimas.

A primeira envolve mirrors. Quando o Forgejo espelha um repositório, o próprio servidor busca dados em outro endereço. Isso abre espaço para SSRF, um ataque em que uma entrada controlada faz o servidor acessar um destino que deveria estar fora do alcance. O projeto já mantinha listas de domínios permitidos e bloqueados, mas um redirecionamento HTTP ainda podia levar a operação Git por outro caminho.

Na versão 16, o Forgejo executa essas operações com `http.followRedirects=false`. A mudança fecha o desvio e também afeta mirrors de repositórios remotos que foram renomeados ou transferidos e hoje respondem com redirect. O mirror falha até o administrador trocar a URL pelo endereço atual. Faz sentido: se o servidor seguisse o destino automaticamente, a regra de domínio não garantiria muita coisa.

A segunda mudança pede atenção de quem usa autenticação no reverse proxy. Nesse desenho, Nginx, Caddy ou outro proxy autentica a pessoa e envia a identidade ao Forgejo por um header como `X-WebAuth-User`. O backend precisa confiar que o pedido veio mesmo desse intermediário.

As imagens de container configuravam `REVERSE_PROXY_TRUSTED_PROXIES = *` por padrão. Com autenticação por proxy ativa, esse wildcard virava um risco quando alguém também conseguia alcançar diretamente a porta web do Forgejo, normalmente a `:3000`. Essa pessoa poderia tentar forjar o header e se passar por outro usuário. A versão 16.0 remove a confiança universal, então instalações que dependem desse fluxo precisam declarar as redes dos proxies confiáveis.

O risco dependia de três condições juntas: autenticação por reverse proxy, wildcard nos proxies confiáveis e acesso não confiável direto ao backend. Melhor revisar a exposição e a configuração antes do upgrade do que descobrir a mudança quando o login parar.

A release também cria as Authorized Integrations. Com elas, Forgejo Actions e sistemas externos podem usar JWTs validados para acessar API e Git sem guardar um access token estático de longa duração. Isso depende de configurar direito o emissor, a audiência, a validade e as permissões. JWT não distribui segurança automática só porque tem três partes separadas por ponto. Para revisão de código, chegam comentários em várias linhas. Nas Actions, a API passa a cobrir logs de jobs e runs, artefatos e cancelamento de execuções.

Forgejo 16.0 é uma versão major non-LTS, com suporte previsto até 29 de outubro de 2026. A 15.0 LTS continua suportada até 15 de julho de 2027, enquanto a série 11.0 LTS encerra o suporte hoje. Para fazer o salto, a orientação oficial é criar um backup completo, ler todas as breaking changes e, depois da atualização, testar a interface e executar `forgejo doctor check --all --log-file /tmp/doctor.log`.

Esse servidor guarda código, credenciais de CI e a identidade dos usuários. O backup antes de um major upgrade é a parte do plano que você prefere achar entediante.

Fontes: [anúncio do Forgejo 16.0](https://forgejo.org/2026-07-release-v16-0/), [release notes da versão 16.0.0](https://codeberg.org/forgejo/forgejo/raw/branch/forgejo/release-notes-published/16.0.0.md) e [guia oficial de upgrade](https://forgejo.org/docs/v16.0/admin/upgrade/).

## dcg 0.6.7 olha para o comando que chega escondido pelo stdin

Uma linha como `psql` ou `redis-cli` parece apenas abrir um cliente de banco. A operação destrutiva pode chegar depois, por pipe, heredoc, arquivo, redirect ou substituição de comando. Para um agente com acesso ao terminal, olhar apenas o nome do processo principal deixa um buraco bem conveniente.

O Destructive Command Guard, ou dcg, tenta interceptar essas chamadas antes da execução. Ele recebe os comandos por hooks `PreToolUse`, normaliza a entrada e compara o conteúdo com regras. Há packs para Git e filesystem, além de conjuntos opcionais para bancos, Kubernetes, Docker e provedores de cloud. O projeto lista integrações com Claude Code, Codex CLI, Gemini CLI, Copilot, Cursor, Hermes e outros agentes.

A versão 0.6.7, publicada em 15 de julho às 04:06 UTC, amplia a análise do stdin nos packs de banco. Produtores estáticos, redirects, heredocs, loaders e command substitutions entram na avaliação das regras para Redis, PostgreSQL, MySQL ou MariaDB, MongoDB e SQLite. Se a origem dessa entrada for dinâmica ou insegura nesse caminho, a nova lógica falha fechada: bloqueia a operação que não conseguiu provar segura.

Aqui a distinção importa. O desenho geral do dcg continua fail-open em erros e timeouts. O comportamento fechado vale para o tratamento novo de stdin dinâmico nos packs afetados, não para a ferramenta inteira em qualquer caso incerto.

A release corrige ainda outro formato fácil de esquecer. Em Git, `git push +origem:destino` usa o sinal de mais no começo do refspec para pedir uma atualização forçada. Uma regra que bloqueasse apenas `--force` deixaria essa variante passar. O modo `strict_git` agora reconhece o `+`, inclusive em refspecs construídos de forma mais indireta. Também houve ajustes para reduzir falsos positivos com `/tmp`, substituições inertes de `sed` e allowlists executadas fora de repositórios Git.

Quem instalar os binários recebe alguns dados para conferir. Segundo a release, seis binários foram construídos manualmente a partir da tag anotada `v0.6.7`, no commit `d847471364adf24d819c34a96058bc136cdc00b1`. Os assets têm hashes SHA-256, assinaturas minisign com o key ID `36B847D11BA5A0D0`, provenance DSR/SLSA gerada localmente e SBOM no formato SPDX. O próprio projeto avisa que esses builds não têm bundle Sigstore.

Os números de teste também são do fornecedor: 165 de 165 casos Bats, 15 de 15 testes PowerShell e 323 de 323 cenários de ponta a ponta. A alegação de latência abaixo de um milissegundo não foi reproduzida nesta pesquisa. Os builds manuais e a provenance local assinada dão material para auditoria, mas não são a mesma coisa que uma cadeia automatizada e verificável por Sigstore.

Há ainda um limite jurídico. A licença aparece como “MIT License (with OpenAI/Anthropic Rider)”, com exclusões para partes nomeadas. Se a equipe pretende adotar ou redistribuir a ferramenta, precisa avaliar a compatibilidade em vez de ler a palavra MIT e seguir andando.

Na prática, o dcg pode evitar acidentes conhecidos e forçar uma pausa útil. Ele também oferece allowlists e caminhos de bypass para ações intencionais, e qualquer bloqueador baseado em padrões pode errar para os dois lados. A proteção só alcança chamadas que passam de fato pelo hook. Backup, sandbox, permissão mínima e revisão continuam segurando a estrutura quando uma regra não reconhece o comando.

Fontes: [release do dcg 0.6.7](https://github.com/Dicklesworthstone/destructive_command_guard/releases/tag/v0.6.7), [dados da release na API do GitHub](https://api.github.com/repos/Dicklesworthstone/destructive_command_guard/releases/tags/v0.6.7) e [documentação do projeto](https://github.com/Dicklesworthstone/destructive_command_guard).

## CNCF monta um vLLM de laboratório com cache persistente no Kubernetes

Baixar os pesos do modelo toda vez que um pod reinicia é um jeito caro e lento de reaprender a diferença entre container e armazenamento. Um tutorial publicado hoje no blog da CNCF documenta um laboratório de vLLM em Kubernetes no qual o cache sobrevive ao ciclo de vida do pod.

O exemplo usa `meta-llama/Llama-3.2-1B-Instruct`, um modelo de 1 bilhão de parâmetros, servido em CPU por uma imagem do vLLM. O token do Hugging Face entra por um Secret. Um volume persistente de 50 GiB é montado em `/root/.cache/huggingface`, e o download inicial dos pesos é descrito como tendo aproximadamente 2,5 GB.

Esse volume, ou PVC, separa os pesos do container que executa o servidor. Se o pod reiniciar ou for recriado, o diretório de cache continua montado e o vLLM não precisa buscar o modelo novamente. O laboratório usa uma StorageClass LINSTOR com duas réplicas. O autor, Michael Troutman, trabalha na LINBIT, empresa ligada ao LINSTOR. É uma receita de laboratório com uma tecnologia específica, não um benchmark independente de armazenamento.

O Deployment começa com uma réplica. Um Service do tipo `ClusterIP` expõe a API na porta 8000, por padrão apenas dentro do cluster. O teste chama `/v1/chat/completions` pelo DNS interno `vllm-server.default.svc.cluster.local:8000`, no formato da API da OpenAI. Para clientes que aceitam trocar a `base_url`, isso reduz o trabalho de integração.

Compatibilidade de formato não promete o mesmo modelo, qualidade, latência, limites de uso nem os mesmos recursos de um provedor. O servidor e a capacidade agora são seus. A frase perde o charme quando chega o primeiro timeout, mas é justamente o tipo de aprendizado que um laboratório interno deve revelar.

O guia também ensina a escalar o Deployment para zero. O pod desaparece, o consumo de computação para e o PVC mantém o cache para a próxima subida. É um padrão útil para testes eventuais ou ambientes de aprendizado. A documentação do vLLM, porém, trata CPU como caminho de demonstração e teste, sem desempenho comparável ao de GPU.

Levar esse manifesto para produção exige uma fila de mudanças. O exemplo da CNCF usa a tag de imagem `latest`, não define requests e limits, não inclui probes e deixa a API sem autenticação. Consumidores externos precisam de uma entrada protegida. A carga real também pede capacidade, observabilidade e políticas de disponibilidade próprias.

O Secret merece um nome honesto. Objetos Kubernetes Secret armazenam dados em base64, que é codificação, e ficam sem criptografia no etcd por padrão quando o cluster não configura encryption at rest. O acesso precisa ser limitado por RBAC, e a criptografia em repouso deve ser habilitada quando o risco exigir. Colocar o token num objeto chamado Secret organiza a entrega. Sozinho, não decide quem consegue lê-lo.

Como roteiro de aprendizado, a receita liga as peças certas: PVC, credencial, Deployment, serviço interno, chamada compatível e pausa sem perder os pesos. Ainda falta trabalho para virar uma arquitetura de produção, e tudo bem. Melhor encontrar essa lista com um Llama pequeno na CPU do que no dia em que a GPU cara já estiver esperando tráfego.

Fontes: [tutorial da CNCF sobre vLLM em Kubernetes](https://www.cncf.io/blog/2026/07/16/running-a-self-hosted-llm-in-kubernetes-with-vllm/), [documentação do vLLM para Kubernetes](https://docs.vllm.ai/en/latest/deployment/k8s/) e [boas práticas para Secrets no Kubernetes](https://kubernetes.io/docs/concepts/security/secrets-good-practices/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://forgejo.org/2026-07-release-v16-0/
  - https://codeberg.org/forgejo/forgejo/raw/branch/forgejo/release-notes-published/16.0.0.md
  - https://forgejo.org/docs/v16.0/admin/upgrade/
  - https://github.com/Dicklesworthstone/destructive_command_guard/releases/tag/v0.6.7
  - https://api.github.com/repos/Dicklesworthstone/destructive_command_guard/releases/tags/v0.6.7
  - https://github.com/Dicklesworthstone/destructive_command_guard
  - https://www.cncf.io/blog/2026/07/16/running-a-self-hosted-llm-in-kubernetes-with-vllm/
  - https://docs.vllm.ai/en/latest/deployment/k8s/
  - https://kubernetes.io/docs/concepts/security/secrets-good-practices/
-->
