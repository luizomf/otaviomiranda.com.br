---
title: 'Ubuntu 26.10 chega com alerta no SSH; Forgejo 17 amplia Actions'
description: 'Vercel e Temporal anunciam workers gerenciados, capturas USB ajudam um agente a adaptar um scanner ao Linux e Next.js e BeyondTrust recebem correções de segurança.'
date: '2026-10-16T05:15:21-03:00'
author: 'The Paper LLM'
image: './images/ubuntu-26-10-forgejo-17-workers-em-segundo-plano.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/ubuntu-26-10-forgejo-17-workers-em-segundo-plano/final.opus'
---

![Chave com símbolo do Ubuntu 26.10, inscrição SSH e etiqueta de cuidado com o purge.](./images/ubuntu-26-10-forgejo-17-workers-em-segundo-plano.jpg)

O Ubuntu 26.10 foi lançado com uma mudança de pacotes que merece cuidado antes de mexer no acesso remoto. O Forgejo 17 melhora a investigação de falhas em automações, enquanto Vercel e Temporal apresentam novas opções para executar trabalho em segundo plano. A edição também traz correções de segurança, modelos com pesos disponíveis e um experimento de IA cujo resultado pôde ser conferido num scanner real.

## Ubuntu 26.10 é lançado com aviso sobre remoção de configurações do OpenSSH

Lançado em **15 de outubro**, o Ubuntu 26.10 terá nove meses de suporte, até julho de 2027. A versão entrega a transição dos utilitários básicos para o projeto uutils, escrito em Rust: `cp`, `mv` e `rm`, usados para copiar, mover e remover arquivos, completam o conjunto padrão. A mudança já aparecia nas [notas de desenvolvimento que cobrimos em outubro](/2026/fortimail-falha-explorada-pi-durable-recuperacao-agentes/); agora está na versão lançada. Para quem mantém scripts, vale testar saídas, permissões e tratamento de erros antes de atualizar a máquina de trabalho.

O cuidado mais imediato está no **OpenSSH**, usado para acesso remoto seguro. O empacotamento separou as variantes com autenticação GSSAPI/Kerberos, comum em redes corporativas, das variantes sem esse suporte. Trocar uma pela outra remove o pacote anterior e pode deixá-lo no estado `rc`: programa removido, configurações preservadas.

As notas alertam que executar *purge*, a remoção também das configurações, nesse pacote antigo pode apagar arquivos necessários à variante instalada e derrubar o acesso remoto. O problema é acompanhado no **LP #2169738**; a documentação informa que uma parte da correção ainda depende de atualização posterior ao lançamento. Preserve essas configurações até receber a correção e prepare um meio alternativo de acesso antes de fazer a troca num servidor.

Fonte: [notas oficiais do Ubuntu 26.10, incluindo o aviso sobre OpenSSH](https://documentation.ubuntu.com/release-notes/26.10/).

## Forgejo 17 permite repetir jobs pela API e exige revisão de webhooks

O **Forgejo 17**, lançado em 15 de outubro, traz melhorias para quem hospeda seus próprios repositórios Git e automações de build e testes. Sua API agora permite repetir um fluxo de automação (workflow) concluído ou uma tarefa individual (job) já encerrada. Os logs podem ser filtrados por texto ou recuperados por etapa, facilitando encontrar a saída que explica uma falha.

Com **Forgejo Runner 13.2 ou superior**, cada job também pode exibir um resumo em Markdown acima dos logs. Isso permite apresentar resultados de testes e tabelas sem obrigar a pessoa a procurar tudo na saída bruta.

A atualização pede atenção às integrações: os eventos de webhook `action run` foram descontinuados em favor de `workflow run`, com remoção prevista para uma versão futura. Como cabeçalhos e conteúdo mudam, a migração exige testar o sistema que recebe essas notificações. O projeto recomenda backup completo antes da atualização. A versão 17 tem suporte até **28 de janeiro de 2027**; a linha 15 LTS permanece suportada até **15 de julho de 2027**.

Fonte: [anúncio do Forgejo 17](https://forgejo.org/2026-10-release-v17-0/).

## Vercel e Temporal anunciam novas opções para workers em segundo plano

Workers são processos que executam trabalho em segundo plano, como consumir tarefas de uma fila ou rodar automações de integração contínua. Esse trabalho pode acontecer sem depender da chegada de uma requisição web.

Em **15 de outubro**, o **Vercel Daemons entrou em beta público** para executar processos desse tipo em contêineres, sem exigir um servidor HTTP. A plataforma mantém a quantidade de instâncias configurada por região e reinicia as que encerram ou falham. Os workers são implantados no mesmo projeto da aplicação.

No mesmo dia, o Google anunciou em **preview** os **Temporal Serverless Workers sobre Cloud Run worker pools**. Temporal é uma plataforma de coordenação de tarefas e fluxos duráveis. Nessa integração, o Temporal Cloud ajusta a quantidade de workers conforme o trabalho nas filas, podendo chegar a zero. Os processos continuam no projeto, na rede e sob a conta de serviço do cliente no Google Cloud; o Temporal recebe permissão para ajustar sua capacidade.

A diferença prática está em quem define essa quantidade: no anúncio da Vercel, ela é configurada pelo operador; na integração do Temporal, é ajustada pelo serviço dentro dos limites escolhidos. Nessa integração, quem precisa de resposta imediata depois de um período ocioso deve considerar manter um mínimo de instâncias acima de zero, pois iniciar novos workers leva tempo.

Fontes: [Vercel Daemons](https://vercel.com/changelog/vercel-daemons-is-now-in-public-beta) e [Temporal Serverless Workers no Cloud Run](https://cloud.google.com/blog/products/serverless/temporal-serverless-workers-on-cloud-run-worker-pools/).

## Agente ajuda a adaptar scanner ao Linux usando capturas do driver Windows

Christian F. K. Schaller relatou em **15 de outubro** como retomou uma tentativa de fazer seu scanner Plustek OpticFilm 8200i funcionar no Linux. O modelo recebido usava um controlador diferente do esperado. Depois de tentativas frustradas, ele deu ao Claude Code acesso a uma máquina virtual Windows com o driver do fabricante e capturou a comunicação USB do dispositivo.

Segundo o autor, uma primeira digitalização reconhecível no Linux apareceu em poucas horas. A captura forneceu uma referência concreta: comparar o que o driver funcional enviava ao aparelho com o comportamento da implementação em desenvolvimento, formular uma hipótese e testar o resultado físico.

O projeto SANE, que fornece suporte a scanners no Linux, já havia adicionado suporte ao aparelho independentemente quando Schaller concluiu o trabalho. O **hw-harness** publicado depois reúne uma versão generalizada dos scripts do experimento. O aprendizado do relato está no ciclo de comparação: dar ao agente uma referência funcional, medir as diferenças e conferir o resultado no aparelho real.

Fonte: [relato de Christian Schaller](https://blogs.gnome.org/uraeus/2026/10/15/aiandreverseengineerhardware/).

## Destaques rápidos para hoje.

- **Next.js publica correções para duas falhas críticas de execução de código.** A atualização de **14 de outubro** desse framework para aplicações web disponibiliza **16.4.1 e 15.5.28**, conforme a linha mantida. Uma falha envolve App Router com Cache Components e funções `use cache` que retornam múltiplos arrays tipados; a correção desse caso está na 16.4.1 e não há alternativa conhecida à atualização. A outra envolve otimização de imagens SVG em Linux baseado em glibc; garantir `sharp` 0.35.5 ou superior é a mitigação indicada para esse segundo caso. Há ainda correção de negação de serviço em App Router com Server Actions. São avisos distintos da [correção de ImageResponse de setembro](/2026/gpt-6-e-opus-5-5-chegam-as-apis-e-next-js-corrige-execucao-de-codigo-na-geracao-de-imagens/). Atualize as dependências e publique o artefato corrigido. Fontes: [comunicado do Next.js](https://nextjs.org/blog/nextjs-security-update-october-14-2026), [aviso de Cache Components](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr) e [aviso de SVG](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw).

- **Mandiant relata exploração de falha no BeyondTrust Remote Support desde agosto.** A investigação publicada em **15 de outubro** liga a **CVE-2026-102764**, que permite operações de arquivos sem autenticação no equipamento de suporte remoto, a invasões observadas no fim de agosto. A Mandiant recomenda o patch **BT26-05-RS** para instalações próprias a partir da 24.3.1; versões anteriores precisam primeiro de atualização para uma linha suportada. Segundo a investigação, a BeyondTrust corrigiu os ambientes SaaS em 9 de outubro. Equipamentos expostos durante o período vulnerável também precisam de revisão de comprometimento: foram observados mecanismos de persistência que sobrevivem a reinícios. Fonte: [investigação e orientações da Mandiant/Google Threat Intelligence Group](https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-beyondtrust/).

- **Citizen Lab documenta infecções por spyware entregues por anúncios.** O relatório de **15 de outubro** atribui à infraestrutura da Discover-Tech a entrega de spyware Candiru a dispositivos da Al Jazeera em ataques de 2024 e 2025. A técnica, chamada **AdFection**, usa código carregado na exibição do anúncio, dispensando o clique. O relatório distingue infecções confirmadas da população muito maior exposta a rastreamento e reconhecimento. A Confiant analisou a preparação e o encaminhamento desses anúncios em pesquisa coordenada, mas informa que não capturou uma cadeia completa de exploração. Para quem integra publicidade, o caso reforça a necessidade de avaliar o código de terceiros executado nas páginas. Fontes: [Citizen Lab](https://citizenlab.ca/research/how-discover-tech-turned-targeted-ads-into-a-pipeline-for-spyware/) e [Confiant](https://blog.confiant.com/p/adint-weaponized-ad-tech-for-zero-click-spyware-and-mass-identity-vacuuming).

- **Estudo de MCP mede acesso a arquivos além do escopo declarado das ferramentas.** Em preprint de **15 de outubro**, pesquisadores relatam **150 instâncias vulneráveis** confirmadas por execução dinâmica nas políticas de isolamento testadas. MCP conecta aplicações de IA a ferramentas; num servidor local, aprovar uma chamada pode deixar o processo com acesso a arquivos que a operação declarada não deveria alcançar. Os autores testaram esse desvio com arquivos de credenciais preparados para o experimento. O resultado orienta a limitar permissões e isolar o processo que executa a ferramenta. A contagem corresponde aos casos validados sob aquelas condições de teste; ela não mede a proporção de servidores vulneráveis em todo o ecossistema. Fonte: [My Credentials, Please](https://arxiv.org/abs/2610.22301v1).

- **IBM reúne conversa, decisões e transcrição no Granite Switch 4.1.** Os modelos anunciados em **15 de outubro** combinam uma base com adaptadores especializados, incluindo classificação de segurança, e reconhecimento de fala. Segundo a equipe, os adaptadores podem reutilizar o cache de atenção produzido pelo modelo-base: cálculos já feitos sobre o contexto ficam disponíveis para decisões posteriores. Isso oferece uma arquitetura para experimentar várias tarefas num mesmo endpoint, com menos recomputação do contexto. Fonte: [anúncio da equipe IBM Granite](https://huggingface.co/blog/ibm-granite/granite-switch-4-1).

- **Meta libera pesos do Muse Spark Open, com exigência elevada de memória.** O anúncio de **15 de outubro** apresenta um modelo multimodal com **816 bilhões de parâmetros totais e 42 bilhões ativos**, sob a Muse Model License, que tem condições comerciais limitadas. A configuração local destacada pela Meta usa **dois Mac Studios M5 Ultra com 512 GB cada**. A quantidade de parâmetros ativos representa a parcela utilizada por token; o exemplo de implantação continua exigindo memória para o modelo completo. Fonte: [anúncio da Meta](https://research.meta.ai/blog/muse-spark-open).

- **Rust 1.99.1 corrige falhas de ligação e de interoperabilidade.** Lançada em **15 de outubro**, a atualização corrige a ausência do símbolo `wcslen` em alguns alvos, incluindo UEFI, e o retorno de valores `bool` por FFI em x86_64. FFI é a interface usada para chamar código entre linguagens; nesse caso, bits indefinidos podiam fazer o chamador receber algo diferente de zero ou um. Também há correção para o `rust-lld`, a ferramenta de ligação usada na compilação, encontrar a biblioteca LLVM no macOS quando o compilador é chamado sem o intermediário do rustup. Fonte: [Rust Release Team](https://blog.rust-lang.org/2026/10/15/Rust-1.99.1/).

- **Solène mostra serviços reconstruíveis com Incus OS.** No relato de **15 de outubro**, a infraestrutura doméstica usa contêineres de sistema recriados a partir de configurações em Git, enquanto dados das aplicações ficam em volumes persistentes. As conexões de rede são bloqueadas por padrão e liberadas explicitamente. É um exemplo concreto de separar o sistema descartável dos dados que precisam sobreviver à reconstrução. A autora ressalta que tudo depende de um único computador e que reconstruir um componente pode interrompê-lo por um ou dois minutos. Fonte: [arquitetura descrita por Solène Rapenne](https://dataswamp.org/~solene/2026-10-15-selfhosting-infrastructure-incus-os.html).

- **IPinfo mede 70,3% dos prefixos roteados como válidos em RPKI.** A análise recém-publicada usa uma fotografia de **28 de setembro de 2026**, comparada com 54% um ano antes. RPKI permite ao responsável por um bloco de endereços publicar uma autorização assinada sobre qual rede pode anunciá-lo. O levantamento usa rotas observadas pelos coletores públicos RIPE RIS e RouteViews. A validação protege a origem anunciada; o caminho percorrido pela rota exige outros mecanismos. Fonte: [análise e metodologia da IPinfo](https://ipinfo.io/blog/rpki-protects-70-internet-routes).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28712
source_urls:
  - https://documentation.ubuntu.com/release-notes/26.10/
  - https://forgejo.org/2026-10-release-v17-0/
  - https://vercel.com/changelog/vercel-daemons-is-now-in-public-beta
  - https://cloud.google.com/blog/products/serverless/temporal-serverless-workers-on-cloud-run-worker-pools/
  - https://blogs.gnome.org/uraeus/2026/10/15/aiandreverseengineerhardware/
  - https://nextjs.org/blog/nextjs-security-update-october-14-2026
  - https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr
  - https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw
  - https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-beyondtrust/
  - https://citizenlab.ca/research/how-discover-tech-turned-targeted-ads-into-a-pipeline-for-spyware/
  - https://blog.confiant.com/p/adint-weaponized-ad-tech-for-zero-click-spyware-and-mass-identity-vacuuming
  - https://arxiv.org/abs/2610.22301v1
  - https://huggingface.co/blog/ibm-granite/granite-switch-4-1
  - https://research.meta.ai/blog/muse-spark-open
  - https://blog.rust-lang.org/2026/10/15/Rust-1.99.1/
  - https://dataswamp.org/~solene/2026-10-15-selfhosting-infrastructure-incus-os.html
  - https://ipinfo.io/blog/rpki-protects-70-internet-routes
-->
