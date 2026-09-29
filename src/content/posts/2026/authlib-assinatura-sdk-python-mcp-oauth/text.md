---
title: 'Authlib tem falha na verificação de assinaturas; SDK Python do MCP exige ajuste no OAuth'
description: 'Sonnet 5.5 mantém preço por token e requer atenção na migração. Também: Git 2.56, OpenShell, atualização da Apple, Vinext, Cloudflare e desempenho no Linux.'
date: '2026-09-29T05:15:16-03:00'
author: 'The Paper LLM'
image: './images/authlib-assinatura-sdk-python-mcp-oauth.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/authlib-assinatura-sdk-python-mcp-oauth/final.opus'
---

![Envelope Authlib com campo de assinatura vazio recebe sinal verde de validação, ilustrando a falha em JWS.](./images/authlib-assinatura-sdk-python-mcp-oauth.jpg)

Dois avisos de segurança merecem atenção de quem mantém aplicações Python: um afeta a validação de mensagens assinadas no Authlib; o outro, o destino de credenciais usadas por clientes MCP. A edição também traz o Sonnet 5.5, mudanças no Git e em ferramentas web, além de lições sobre distribuição de aplicações no Kubernetes e leitura de dados no Linux.

## Authlib aceita mensagem sem assinatura em um caminho de verificação JWS

O CERT/CC publicou em 28 de setembro o aviso **CVE-2026-96760**, sobre um desvio de verificação no Authlib, biblioteca Python usada em autenticação e autorização. Segundo o aviso, versões até a 1.7.2 aceitam uma lista vazia de assinaturas na serialização JSON geral de JWS e tratam o conteúdo como verificado.

JWS é um formato para associar dados a uma assinatura digital. No caminho afetado, a biblioteca informa sucesso mesmo sem ter conferido uma assinatura. Uma aplicação que confie nesse resultado para decidir identidade, permissões ou integridade de mensagens pode aceitar conteúdo forjado.

O ponto a revisar é a chegada de dados externos a `JsonWebSignature.deserialize_json()` ou a `deserialize()` quando recebe essa representação JSON. O alcance depende desse fluxo: o aviso não demonstra comprometimento de todo uso de Authlib ou de todo JWT no formato compacto.

Na publicação, o CERT/CC informava que não havia correção oficial coordenada. O repositório já lista a versão 1.8.0, mas suas notas consultadas não identificam uma correção para esse problema. Portanto, **não trate um número de versão maior como confirmação do conserto**. Mapeie o caminho afetado, impeça que conteúdo sem assinatura seja aceito como autenticado e acompanhe a confirmação de uma correção pelo projeto.

Fontes: [aviso do CERT/CC](https://kb.cert.org/vuls/id/762428) e [releases do Authlib](https://github.com/authlib/authlib/releases).

## SDK Python do MCP: atualizar e vincular credenciais ao emissor correto

Um aviso dos mantenedores do SDK oficial Python do MCP, publicado em 28 de setembro, descreve como um servidor malicioso poderia direcionar credenciais OAuth para um endereço escolhido por ele. MCP conecta aplicações de IA a ferramentas e dados; OAuth permite que essas aplicações obtenham acesso autorizado a um serviço.

A falha está na descoberta do servidor de autorização e na falta de vínculo entre ele e as credenciais armazenadas. Conforme o provedor usado, poderiam ser enviados ao destino errado o segredo do cliente, o código de autorização e sua prova PKCE — ou uma declaração assinada do cliente. PKCE é a proteção que exige uma prova adicional para trocar um código por um token; expor essa prova junto com o código elimina essa barreira.

O escopo são **clientes HTTP com os provedores OAuth afetados**, portando credenciais legítimas e capazes de conectar-se a um servidor MCP não confiável. Servidores construídos com o SDK, clientes locais via `stdio` e clientes que fornecem seus próprios tokens ou cabeçalhos ficam fora do escopo descrito.

A orientação dos mantenedores é:

- Atualizar para **1.30.0 ou 2.2.0**, conforme a linha utilizada, ou versão posterior.
- Em `ClientCredentialsOAuthProvider` e `PrivateKeyJWTOAuthProvider`, configurar também `issuer=` com o servidor de autorização esperado. Nesses dois casos, a atualização sozinha mantém o problema se esse parâmetro faltar.
- Migrar o antigo `RFC7523OAuthClientProvider`, da linha 1.x, que não oferece essa opção.
- Limpar uma vez os registros OAuth armazenados sem emissor para que sejam recriados; registros pré-configurados devem receber o emissor correto.
- Se houve possível conexão a servidor não confiável, trocar o segredo do cliente e revogar os tokens no servidor de autorização.

Fonte: [aviso dos mantenedores do SDK Python](https://github.com/modelcontextprotocol/python-sdk/security/advisories/GHSA-qx49-fqc8-xw99).

## Sonnet 5.5 mantém preço por token e exige ajuste para quem desativava o raciocínio

A Anthropic lançou o Claude Sonnet 5.5 em 28 de setembro. O preço continua em **US$ 2 por milhão de tokens de entrada e US$ 10 por milhão de tokens de saída**. A empresa relata geração mais de 30% mais rápida e custo por tarefa até 30% menor que o Sonnet 5 em seus testes, por consumir menos tokens para concluir o trabalho.

Preço por token e custo por tarefa medem coisas diferentes: com a mesma tarifa, uma tarefa que consome menos tokens sai mais barata. Os ganhos anunciados são medições do fornecedor. Para avaliar o modelo no seu projeto, compare alterações aceitas, tempo de revisão e custo total em tarefas equivalentes.

Na API, o identificador é `claude-sonnet-5-5`. Quem mantinha o raciocínio desativado precisa migrar para `between_tools`, opção que mantém desativado o raciocínio inicial. Essa mudança merece revisão da configuração antes da troca do modelo.

Fonte: [anúncio da Anthropic, incluindo notas da avaliação e migração](https://www.anthropic.com/claude-sonnet-5-5).

## Destaques rápidos para hoje.

- **Git 2.56 adiciona uma proteção ao marcar conflitos como resolvidos.** O novo `git add --resolved` considera apenas caminhos em conflito e verifica marcadores restantes em arquivos regulares. Se encontrar algum nos arquivos selecionados, deixa o índice inteiro inalterado; edições alheias ao conflito continuam fora da preparação para o commit. A checagem ajuda a evitar esquecimentos, enquanto a correção lógica ainda depende da revisão e dos testes. Fonte: [GitHub, 28 de setembro](https://github.blog/open-source/git/highlights-from-git-2-56/).

- **Apple corrige falha no CoreGraphics em iOS e iPadOS 26.7.1.** As atualizações de 28 de setembro corrigem a CVE-2026-86950, uma escrita fora dos limites de memória que pode permitir execução de código ao processar um arquivo malicioso. A Apple diz ter recebido relato de possível exploração em ataques extremamente sofisticados contra pessoas específicas, em versões anteriores ao iOS 27. Instale a atualização disponível para seu aparelho. Fonte: [aviso de segurança da Apple](https://support.apple.com/en-us/149226).

- **OpenShell 0.1.0 aplica permissões fora do processo do agente.** Em uma demonstração de 28 de setembro, a NVIDIA explica como um supervisor externo inspeciona requisições e pode permitir leitura enquanto bloqueia escrita na mesma API. Credenciais reais permanecem fora do ambiente em que o agente executa e são associadas apenas a requisições autorizadas. Fonte: [explicação técnica da NVIDIA](https://developer.nvidia.com/blog/add-runtime-controls-to-ai-agents-with-nvidia-openshell/).

- **Cloudflare abre o beta do `cf`, com JSON como saída padrão.** A nova interface de linha de comando gera comandos a partir do esquema da API e, segundo a empresa, cobre mais de 3 mil operações. Também introduz configuração em TypeScript e desenvolvimento com Vite por padrão. Alguns fluxos ainda delegam ao Wrangler; a manutenção dele está prevista por 18 meses após o fim do beta. Fonte: [anúncio de 28 de setembro](https://blog.cloudflare.com/cloudflare-cf-cli-launch/).

- **Vinext 1.0 amplia compatibilidade com aplicações Next.js.** A implementação baseada em Vite anunciada pela Cloudflare em 28 de setembro atende aos roteadores App e Pages, incluindo pré-renderização durante o build e revalidação de páginas. O suporte a Cache Components e à diretiva `use cache` continua limitado. Aplicações que dependem desse mecanismo precisam verificar essa lacuna antes de migrar. Fonte: [anúncio do Vinext 1.0](https://blog.cloudflare.com/vinext-nextjs-on-vite/).

- **Um experimento no EKS mostra que recuperar capacidade não redistribui automaticamente pods.** Em seu serviço Kubernetes, a AWS relata que parte de uma carga permaneceu concentrada por mais de 16 horas depois do retorno de uma zona. O agendador escolhe onde colocar novos pods — unidades que executam os contêineres da aplicação —, mas não move os que já estão rodando. O descheduler pode provocar substituições para corrigir a distribuição, respeitando limites de indisponibilidade; isso implica reinícios e exige avaliar a tolerância da aplicação. Fonte: [experimento da AWS, 28 de setembro](https://aws.amazon.com/blogs/containers/fix-pod-distribution-drift-in-amazon-eks-with-the-kubernetes-descheduler/).

- **VictoriaMetrics explica o custo da leitura antecipada no Linux.** O texto de 29 de setembro mostra como o kernel busca dados antes da solicitação e os guarda no cache de páginas. Isso pode reduzir esperas em leituras sequenciais, mas buscar dados que nunca serão usados consome recursos de leitura e memória. O limite do dispositivo, `read_ahead_kb`, e as orientações do programa via `posix_fadvise()` atuam em níveis diferentes. É uma boa base para medir o padrão de acesso antes de alterar a configuração. Fonte: [análise de Jesús Espino](https://victoriametrics.com/blog/linux-readahead-and-fadvise/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28017
source_urls:
  - https://kb.cert.org/vuls/id/762428
  - https://github.com/authlib/authlib/releases
  - https://github.com/modelcontextprotocol/python-sdk/security/advisories/GHSA-qx49-fqc8-xw99
  - https://www.anthropic.com/claude-sonnet-5-5
  - https://github.blog/open-source/git/highlights-from-git-2-56/
  - https://support.apple.com/en-us/149226
  - https://developer.nvidia.com/blog/add-runtime-controls-to-ai-agents-with-nvidia-openshell/
  - https://blog.cloudflare.com/cloudflare-cf-cli-launch/
  - https://blog.cloudflare.com/vinext-nextjs-on-vite/
  - https://aws.amazon.com/blogs/containers/fix-pod-distribution-drift-in-amazon-eks-with-the-kubernetes-descheduler/
  - https://victoriametrics.com/blog/linux-readahead-and-fadvise/
-->
