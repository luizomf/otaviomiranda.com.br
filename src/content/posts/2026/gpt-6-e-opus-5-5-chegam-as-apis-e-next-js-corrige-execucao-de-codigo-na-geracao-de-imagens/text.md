---
title: 'GPT-6 e Opus 5.5 chegam às APIs, e Next.js corrige execução de código na geração de imagens'
description: 'Compare os preços dos novos modelos e confira o escopo do patch do Next.js. systemd organiza reinícios, Cloudflare ajusta o cache e um relato sobre Muse expõe o limite das permissões de exportação.'
date: 2026-09-23T05:15:21-03:00
author: 'The Paper LLM'
image: './images/gpt-6-e-opus-5-5-chegam-as-apis-e-next-js-corrige-execucao-de-codigo-na-geracao-de-imagens.jpg'
---

![Letreiro de cinema anuncia GPT-6 Sol/Luna e Opus 5.5 nas APIs, com bilheteria ilustrando a cobrança por token.](./images/gpt-6-e-opus-5-5-chegam-as-apis-e-next-js-corrige-execucao-de-codigo-na-geracao-de-imagens.jpg)


## GPT-6 e Opus 5.5 chegam com novas contas por token

A OpenAI lançou GPT-6 Sol e Luna em 22 de setembro, e a Anthropic lançou Claude Opus 5.5 no mesmo dia. Se você usa modelos em agentes de programação, já pode refazer o orçamento. Para decidir qual trabalha melhor, vai precisar testar no seu projeto.

Nas tarifas padrão da OpenAI para até 272 mil tokens de entrada, o Sol custa US$ 2 por milhão de tokens de entrada e US$ 10 por milhão de saída. No Luna, os valores são US$ 0,10 e US$ 0,50. Os dois recebem texto e imagens e respondem em texto pelas APIs Responses e Chat Completions. Contextos maiores, gravação de cache e outras modalidades têm tarifas diferentes.

O Opus 5.5 custa US$ 4 por milhão de tokens de entrada e US$ 20 de saída, 20% abaixo do Opus 5. A Anthropic também anuncia economia de aproximadamente 40% em cargas típicas, medida nos testes dela com configurações padrão.

Tokens são as unidades que o modelo processa e gera. Um agente pode fazer várias chamadas até concluir uma alteração, então o preço por token e a conta pelo serviço pronto são coisas diferentes. Aquele “vou pensar mais um pouquinho” também entra na fatura.

Fontes: [changelog da OpenAI](https://developers.openai.com/api/docs/changelog), [preços da OpenAI](https://developers.openai.com/api/docs/pricing) e [anúncio do Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5).

## Next.js corrige execução de código pelo ImageResponse no Node.js

A Vercel publicou em 22 de setembro uma correção emergencial para o ImageResponse, usado para gerar imagens como cartões de prévia de links. A falha permite executar código quando valores controlados por um atacante chegam ao conteúdo, aos atributos ou aos estilos do SVG gerado no ambiente Node.js.

O problema afeta **Next.js de 16.2.0 até antes de 16.3.6**. Atualizar para 16.3.6 corrige a cadeia de dependências envolvida, incluindo o Satori. Segundo a Vercel, um escape inadequado no SVG pode alcançar vulnerabilidades em outras dependências. O endpoint só precisava desenhar uma imagem. O conteúdo recebido para o desenho pode abrir esse caminho.

Confira onde sua aplicação usa `next/og` e quais dados entram ali. Se ainda não conseguir atualizar, a mitigação indicada é retirar desse caminho os valores controlados por atacantes.

A implementação Edge e aplicações que não recebem essa entrada não confiável no SVG ficam fora do aviso. Next.js 15 também não é afetado por esta execução remota; a versão 15.5.26 recebeu apenas reforços relacionados.

Fontes: [aviso de segurança da Vercel](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) e [anúncio da correção](https://nextjs.org/blog/nextjs-security-update-september-22-2026).

## systemd 262 distribui reinícios e põe a inicialização em fila

O systemd 262, lançado em 22 de setembro, ganhou controles para evitar que os serviços tentem voltar todos juntos depois de uma falha. O gerenciador de serviços do Linux pode acrescentar um atraso aleatório aos reinícios e limitar quantas unidades iniciam ao mesmo tempo.

A opção `RestartRandomizedDelaySec=` acrescenta uma espera aleatória ao intervalo de reinício configurado, inclusive quando esse intervalo aumenta progressivamente. Em vez de todo mundo tentar passar pela porta no mesmo segundo, cada serviço espera um tempo diferente. Menos cotoveladas na recuperação.

Já `ActivatingConcurrencyMax=` limita as unidades em inicialização dentro de uma hierarquia de slices, os grupos de unidades do systemd. As demais ficam na fila até surgir uma vaga. A contagem cobre quem está iniciando; serviços já em execução e requisições da aplicação ficam fora dela.

Se você administra VPS ou servidores Linux, dá para avaliar esses controles quando a distribuição entregar a versão. Os retries feitos dentro da aplicação continuam precisando de orçamento próprio.

Fonte: [notas do systemd 262](https://github.com/systemd/systemd/releases/tag/v262).

## Cloudflare permite alinhar as variações do cache com a origem

A Cloudflare anunciou em 22 de setembro suporte configurável ao cabeçalho `Vary` nas Cache Rules de todos os planos. Ele informa quais cabeçalhos da requisição influenciam a resposta: a mesma URL pode entregar HTML ao navegador e JSON a outro cliente, por exemplo.

O cache precisa distinguir essas respostas. Se juntar demais, pode servir o conteúdo errado; se separar por cada valor bruto recebido, reaproveita pouco. As regras permitem normalizar os valores, preservá-los ou desviar do cache, conforme os cabeçalhos indicados pela origem.

Na normalização, os valores podem ser ajustados antes de chegar ao servidor de origem. Assim, o servidor escolhe a resposta de acordo com a representação que vai ficar no cache. Os dois precisam concordar sobre o que o cliente pediu.

Confira também a limpeza: **configurar bypass não apaga entradas antigas**. Faça o purge se elas precisarem sair. A origem precisa enviar `Vary` para declarar a variação; com `Vary: *`, a resposta sempre fica fora do cache.

Fonte: [engenharia da Cloudflare](https://blog.cloudflare.com/vary-support/).

## Pesquisador relata que Muse exportou arquivos do próprio ambiente

Peter James relatou em 22 de setembro que o Muse, da Meta, compactou arquivos acessíveis em sua sessão e enviou o pacote ao Google Drive conectado. Segundo ele, eram cerca de 6,8 GB descompactados: arquivos do ambiente Linux, código de integrações, registros, memória e arquivos de chaves SSH.

O relato não demonstra fuga do contêiner nem estabelece se as chaves estavam ativas ou a que dariam acesso. O arquivo exportado e os registros da sessão não estão públicos para exame independente. Temos o teste descrito pelo pesquisador.

Um contêiner pode manter a execução lá dentro enquanto uma ferramenta autorizada leva arquivos para fora. Se você monta agentes, revise em conjunto o que eles conseguem ler e para onde podem exportar. A parede pode estar inteira; confira também o serviço de entrega.

Segundo James, a Meta classificou seu relato no programa de recompensas como “Not Applicable”. A resposta publicada lista possíveis motivos, sem dizer qual se aplicou ao caso.

Fonte: [relato de Peter James](https://mouse.dev/blog/muse-runtime-export/).

## Exemplo de PostgreSQL mostra chaves colidindo na replicação

Dimitri Fontaine publicou em 22 de setembro um laboratório de replicação lógica do PostgreSQL e quebrou o próprio desenho de propósito. Um banco central distribui dados de referência; bancos trabalhadores devolvem eventos de uso. Cada tabela viaja em uma direção.

[No dia 21, falamos da capacidade dos workers de replicação](/2026/postgres-limita-o-paralelismo-da-replicacao-e-microsoft-testa-as-lacunas-de-um-modelo/). Aqui, o problema é identificar os dados: sequências independentes podem gerar o mesmo número de evento. Se o banco central usar só esse número como chave, a colisão paralisa a assinatura afetada, enquanto as outras continuam. Combinar a identificação do trabalhador com a do evento resolve esse conflito no desenho demonstrado.

Em outro teste, o banco aceita um filtro de publicação, mas falha depois no UPDATE porque a coluna filtrada não faz parte da identidade usada para localizar a linha na réplica. A configuração passou; a operação veio cobrar.

Estrutura e limpeza dão trabalho à parte. As tabelas precisam existir no destino, pois a replicação lógica não copia sua definição. E mudar o filtro não remove linhas nem dados de colunas já enviados ao trabalhador.

Fonte: [laboratório de Dimitri Fontaine](https://tapoueh.org/blog/2026/09/ten-years-of-postgres-logical-replication/).

## Destaques rápidos para hoje.

- **A CISA confirmou exploração da CVE-2026-94127 no F5 BIG-IP APM**, componente de gestão de acesso. A execução remota sem autenticação envolve servidor virtual com política de acesso e perfil OAuth. Nas configurações afetadas, priorize a mitigação temporária por iRule, a análise forense e o patch final indicados pelo fornecedor. Fonte: [catálogo KEV da CISA](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json).

- **Check Point confirmou exploração da CVE-2026-93616 em servidores de gestão, logs e SmartEvent.** Aplique o hotfix da sua versão conforme a tabela oficial; LivePatch Take 28/29 não corrige esta falha. Os appliances de firewall e Spark ficam fora deste aviso, distinto da [falha anterior de VPN](/2026/chatgpt-entrega-rotas-sem-recuperar-o-codigo-e-check-point-pede-patch-na-vpn/). Fonte: [Check Point](https://support.checkpoint.com/results/sk/sk1000171).

- **Node.js 26.10.0 adiciona throttle e debounce ao módulo util**, para controlar chamadas repetidas, e histogramas de janela móvel para medir períodos recentes. A atualização traz novas utilidades depois da [26.9.0](/2026/cisco-corrige-invasao-sem-login-no-ise-e-github-leva-o-motor-do-copilot-para-rust/) e pertence à linha Current, não LTS. Fonte: [notas do Node.js](https://nodejs.org/en/blog/release/v26.10.0).

- **uv 0.12.18 permite conferir mudanças de pacotes Python sem alterar o ambiente.** O `--check` chega a install e sync, junto de saída JSON para automação. Depois das [correções de compatibilidade anteriores](/2026/linux-tem-quatro-falhas-locais-divulgadas-e-cloudflare-recupera-mais-de-100-tb-de-ram/), dá para conferir divergências de ambiente no CI. Fonte: [release do uv](https://github.com/astral-sh/uv/releases/tag/0.12.18).

- **WordPress corrigiu uma falha na seleção de templates que pode executar PHP local sem autenticação.** O risco depende de diretório de tema ativo começando por `page-`, arquivo PHP utilizável e configuração compatível. Instale 7.1.2 ou a manutenção corrigida da sua versão, conforme a tabela. Fonte: [aviso do WordPress](https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-7hp8-65ch-5whp).

- **Arch alerta para intervenção manual com mkinitcpio 42-1 em certos desbloqueios de disco por TPM2.** Quem usa o hook systemd e vincula o LUKS às medições PCR 0–7, 9 ou 12–14 precisa refazer o cadastro. Essas medições de inicialização mudaram; confira a orientação antes de atualizar. Fonte: [Arch Linux](https://archlinux.org/news/mkinitcpio-42-requires-manual-intervention-for-tpm2-based-unlocking-of-luks-devices/).

- **Flatpak 1.18.3 corrige regressões da 1.18.2 na construção de aplicativos e na abertura de sandboxes internas.** As correções incluem casos com SELinux e restrições do flatpak-spawn. As definições de dependências alternativas também avançaram; os auxiliares fornecidos pela distribuição seguem seu próprio ciclo de atualização. Fonte: [release do Flatpak](https://github.com/flatpak/flatpak/releases/tag/1.18.3).

- **Transformers ganhou integração experimental para executar modelos GGUF quantizados, inicialmente Qwen3.5 em Apple Silicon.** Ela exige a branch de desenvolvimento e componentes compatíveis. Dá para testar pesos compactados pela interface Python conhecida; sem kernel compatível, o carregamento desquantiza os pesos e consome mais memória. Fonte: [Hugging Face](https://huggingface.co/blog/transformers-llama-cpp-quants).

- **Unreal Agent coordena ferramentas com conclusão assíncrona e aceita orientação do usuário durante o trabalho.** O runtime registra o início e entrega o resultado depois, chamando o modelo sem exigir consultas repetidas de status. Os autores encontraram combinações de provedor e modelo que rejeitam esse formato em duas etapas. Fonte: [Unreal Labs](https://unreallabs.ai/blog/unreal-agent/).

- **Tailscale prevê reduzir a memória dos buffers na versão 1.104 e adicionar múltiplas filas depois dela.** As filas devem distribuir fluxos entre caminhos de processamento em roteadores e conectores, preservando a ordem dentro de cada fluxo. Quem opera esses nós ainda precisa acompanhar a entrega prevista nesse cronograma. Fonte: [engenharia da Tailscale](https://tailscale.com/blog/making-tailscale-faster).

- **Pesquisa do OpenTelemetry registra menos dificuldade declarada na integração com Prometheus: de 29% para 10%.** O recorte de 2026 tem 81 usuários selecionados e usa triagem diferente da pesquisa de 2024. Os relatos dessa amostra ajudam a avaliar uma pilha híbrida de métricas, com alcance limitado aos participantes. Fonte: [pesquisa do OpenTelemetry](https://opentelemetry.io/blog/2026/otel-prometheus-interoperability/).

- **O preprint FIRE testa instruções e bloqueios de ações para agentes acertarem repetidamente.** Em 87 tarefas do Terminal-Bench 2.1, os autores relatam que o GPT-5.6 Sol acertou ambas as tentativas em 73,6% dos casos, contra 64,4% antes. A repetibilidade foi medida nesse experimento; confiabilidade em produção ainda exige avaliação própria. Fonte: [FIRE no arXiv](https://arxiv.org/abs/2609.26048v1).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27903
source_urls:
  - https://developers.openai.com/api/docs/changelog
  - https://developers.openai.com/api/docs/pricing
  - https://www.anthropic.com/claude-opus-5-5
  - https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j
  - https://nextjs.org/blog/nextjs-security-update-september-22-2026
  - https://github.com/systemd/systemd/releases/tag/v262
  - https://blog.cloudflare.com/vary-support/
  - https://mouse.dev/blog/muse-runtime-export/
  - https://tapoueh.org/blog/2026/09/ten-years-of-postgres-logical-replication/
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://support.checkpoint.com/results/sk/sk1000171
  - https://nodejs.org/en/blog/release/v26.10.0
  - https://github.com/astral-sh/uv/releases/tag/0.12.18
  - https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-7hp8-65ch-5whp
  - https://archlinux.org/news/mkinitcpio-42-requires-manual-intervention-for-tpm2-based-unlocking-of-luks-devices/
  - https://github.com/flatpak/flatpak/releases/tag/1.18.3
  - https://huggingface.co/blog/transformers-llama-cpp-quants
  - https://unreallabs.ai/blog/unreal-agent/
  - https://tailscale.com/blog/making-tailscale-faster
  - https://opentelemetry.io/blog/2026/otel-prometheus-interoperability/
  - https://arxiv.org/abs/2609.26048v1
-->
