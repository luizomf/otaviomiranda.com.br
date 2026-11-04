---
title: 'Django corrige colisão de cache; Leap 16.1 reúne instalação tradicional e imutável'
description: 'Pesquisa mede os limites da compactação de contexto em agentes. Também: correções no Puppet e rsync, Fedora 45, kitty, inferência local e novidades para desenvolvimento web.'
date: '2026-11-04T05:15:37-03:00'
author: 'The Paper LLM'
image: './images/django-cache-leap-16-1-contexto-agentes.jpg'
---

![Duas chaves iguais, etiquetadas como ausente e vazio, ilustram a colisão de cache corrigida no Django.](./images/django-cache-leap-16-1-contexto-agentes.jpg)

As novas correções do Django incluem uma falha de cache que pode expor respostas privadas. No Linux, o openSUSE Leap 16.1 reúne instalações tradicionais e imutáveis, enquanto o Fedora 45 muda opções de armazenamento e VPN. Para quem usa agentes de programação, um estudo testa até onde é possível reduzir o histórico sem prejudicar a conclusão das tarefas.

## Django corrige seis falhas, incluindo possível exposição de dados pelo cache

O Django, framework web de Python, publicou em **3 de novembro** as versões **6.1.3, 6.0.10 e 5.2.19**. O aviso reúne seis vulnerabilidades: uma de gravidade moderada e cinco baixas, segundo a classificação do projeto. Atualize a linha usada pela aplicação.

Uma delas, a **CVE-2026-113593**, afeta `cache_page()` e `UpdateCacheMiddleware`, recursos que guardam respostas para reutilizá-las em outras requisições. O cabeçalho HTTP `Vary` indica quais cabeçalhos da requisição precisam ser considerados ao escolher a resposta guardada. O Django gerava a mesma chave de cache quando um desses cabeçalhos estava ausente ou tinha valor vazio. Essa colisão poderia entregar uma resposta à requisição errada, com possível exposição de dados privados. A correção distingue os dois casos: entradas antigas referentes a cabeçalhos ausentes deixarão de ser encontradas e precisarão ser recriadas.

Quem usa recursos geográficos precisa conferir também o **GDAL**, biblioteca que o Django utiliza para processar esses dados. Na **CVE-2026-114582**, textos recebidos por `SpatialReference` podiam provocar requisições de rede ou leitura de arquivos. **A proteção completa exige GDAL 3.9 ou posterior.** Para entrada não confiável, o projeto recomenda identificadores numéricos de referência espacial; se versões antigas do GDAL precisarem aceitar textos, eles devem ser comparados com uma lista de valores permitidos.

Fonte: [aviso de segurança do Django, com versões e condições de cada falha](https://www.djangoproject.com/weblog/2026/nov/03/security-releases/).

## openSUSE Leap 16.1 chega com o modo imutável que substitui o Leap Micro

O **openSUSE Leap 16.1**, lançado em **3 de novembro**, permite escolher no instalador Agama entre a instalação tradicional e o **Immutable Mode**. Esse modo incorpora o papel do Leap Micro, distribuição voltada a sistemas com raiz somente para leitura e atualizações transacionais.

No modo imutável, as atualizações usam `transactional-update` para criar snapshots: registros do estado do sistema que permitem voltar a uma versão anterior se algo der errado. Software adicional pode ser usado por containers ou, no desktop, por Flatpak. As instalações tradicional e imutável compartilham o lançamento, o ciclo de vida e as atualizações de manutenção do Leap.

É a chegada da versão final após o [release candidate que acompanhamos em setembro](/2026/luarocks-revoga-credenciais-cisa-alerta-ataques-netscaler/). **A migração do Leap Micro 6.2 continua experimental**: o projeto pede backup antes de usar sua ferramenta de migração. Para conhecer o modo imutável, uma instalação nova em máquina virtual permite testar atualização e retorno ao estado anterior antes de mexer no servidor.

Fonte: [anúncio corrigido da equipe do openSUSE](https://news.opensuse.org/2026/11/03/leap-unites-traditional-and-immutable/).

## Estudo mostra que compactar o histórico de agentes exige testes por modelo

O relatório **“You don’t need long context”**, publicado em **3 de novembro**, investiga quanto do histórico um agente precisa carregar para continuar trabalhando. A técnica testada substitui a conversa acumulada por um registro compacto do trabalho em andamento. Quando o histórico atinge um limite, o modelo prepara esse registro; uma conversa nova recebe o pedido original e o estado resumido para dar continuidade à tarefa.

Segundo os autores, nos testes principais com **Claude Opus 4.5 e GPT 5.6 Sol**, os resultados ficaram, em geral, próximos aos obtidos com histórico completo. Já o **Qwen 3 Coder Next** resolveu **53%** das tarefas com histórico acumulado e apenas **3,6%** na configuração mais restrita, com limite total de **16 mil tokens** e compactação a partir de **12 mil**. Tokens são as unidades de texto processadas pelo modelo.

Essa comparação usa o **SWE-bench Verified**, conjunto de 500 tarefas de correção de software. O Qwen foi executado em formato numérico NVFP4, em um DGX Spark; o resultado deve ser lido dentro dessas condições de teste.

Os autores atribuem a queda principalmente à quantidade de texto produzida pelo Qwen durante a execução: o histórico voltava a atingir o limite com pouco avanço na tarefa entre uma compactação e outra. A recomendação prática é medir tarefas concluídas e requisitos esquecidos ao mudar o limite. O registro de continuidade precisa preservar o pedido, os critérios de conclusão, os próximos passos e referências aos arquivos relevantes. Esses são os elementos que o estudo identificou como úteis para retomar a execução.

Fonte: [relatório, metodologia e apêndices A e D](https://arxiv.org/html/2611.05306v1).

## Destaques rápidos para hoje.

- **Puppet e OpenVox recebem correções para execução de código no servidor de configuração.** Essas ferramentas usam um servidor central para gerenciar a configuração das máquinas atendidas por agentes. A pesquisa da Neodyme, divulgada em **3 de novembro**, demonstra que um certificado válido de agente podia permitir execução de código nesse servidor. Regras permissivas de emissão automática de certificados ampliam a exposição. Os avisos do OpenVox listam **Server 9.2.0 ou 8.18.0** como versões corrigidas e também tratam de uma falha que permite se passar por outros clientes. Confira os componentes instalados e as regras de emissão; versões de correção do OpenVox não devem ser aplicadas como referência de versão do Puppet Enterprise. Fontes: [Neodyme](https://neodyme.io/en/blog/puppet_rce), [aviso de execução de código](https://github.com/OpenVoxProject/openvox/security/advisories/GHSA-ffr6-rwpm-p5wq) e [aviso de autorização por nome](https://github.com/OpenVoxProject/trapperkeeper-authorization/security/advisories/GHSA-q4hm-33rc-572g).

- **rsync 3.5.2 corrige cópias interrompidas e limita trabalho provocado por um receptor malicioso.** A versão de **4 de novembro** corrige a duplicação do último bloco de 256 KiB em transferências interrompidas com `--append` ou `--inplace`. Também limita cálculos de verificação que um receptor poderia induzir com valores manipulados, problema identificado como **CVE-2026-119741**. Quem usa rsync para sincronização e backup deve conferir a atualização disponibilizada pela distribuição e testar a retomada das cópias com as opções habituais. Fonte: [notas oficiais do rsync 3.5.2](https://download.samba.org/pub/rsync/NEWS#3.5.2).

- **SafeDep encontra roubo de credenciais acionado pelo build do repositório antd-img-crop.** A análise de **3 de novembro** descreve um commit forjado inserido em 31 de outubro, com um gancho `prebuild` que executa ao rodar o build. Segundo a empresa, o pacote publicado no npm ficou fora do incidente. O risco descrito está em obter o código comprometido do repositório e executá-lo. A investigação atribui ao malware coleta de senhas, chaves SSH e arquivos de configuração com segredos. Revise scripts antes de executar projetos desconhecidos e mantenha credenciais fora de ambientes descartáveis de teste. Fonte: [análise da SafeDep](https://safedep.io/blog/antd-img-crop-forged-commit-overlord-stealer).

- **Fedora Linux 45 integra Stratis ao instalador e aposenta dois plugins de VPN.** Lançada em **3 de novembro**, a versão permite configurar pelo Anaconda o Stratis, camada de gerenciamento que reúne discos e oferece recursos como snapshots e criptografia. Antes da atualização, confira conexões que dependem de **NetworkManager-vpnc ou NetworkManager-fortisslvpn**: esses plugins deixam de ser mantidos na distribuição, e o anúncio aponta orientações de migração. A versão final sucede o [beta já apresentado aqui](/2026/plugins-do-networkmanager-abrem-caminho-para-root-e-gemini-3-8-live-conversa-enquanto-chama-ferramentas/). Fonte: [anúncio do Fedora 45](https://fedoramagazine.org/announcing-fedora-linux-45/).

- **kitty 0.50.0 ganha painéis fixos e restauração de sessões.** O terminal, atualizado em **3 de novembro**, permite fixar janelas nas bordas para árvores de arquivos ou barras de estado. A restauração precisa ser habilitada e salva o estado das janelas e o histórico de saída acessível pela rolagem para recuperá-los após encerrar a sessão. Os programas que estavam rodando, além do shell, **não são reiniciados automaticamente**. No Linux, a restauração exige um portal de desktop compatível, e os dados salvos ficam sem criptografia. Fontes: [changelog](https://sw.kovidgoyal.net/kitty/changelog/#id1) e [documentação da restauração](https://sw.kovidgoyal.net/kitty/sessions/).

- **Grafana Alloy passa a oferecer seu motor OpenTelemetry em prévia pública.** O anúncio de **3 de novembro**, referente ao **Alloy 1.21.0**, permite executar diretamente configurações YAML do OpenTelemetry Collector, ferramenta que coleta e encaminha métricas, logs e rastros de execução. Isso facilita experimentar o Alloy com uma configuração já existente. A extensão que executa os dois motores lado a lado continua experimental: a troca de dados entre eles ainda passa pela rede. Fonte: [anúncio e limites descritos pela Grafana](https://grafana.com/blog/bridging-alloy-and-opentelemetry-the-otel-engine-is-now-in-public-preview/).

- **llama.cpp incorpora otimização de leitura de prompts para Gemma 4 E2B e E4B.** A mudança foi integrada em **3 de novembro**. No teste do colaborador com **Gemma 4 E2B Q4_0, M4 Pro e Metal**, a leitura de um prompt de 512 tokens passou de aproximadamente **1.614 para 4.603 tokens por segundo**. A geração da resposta ficou perto de 110 tokens por segundo nas duas versões. O ganho vem de evitar cálculos desnecessários em determinadas camadas; os resultados apresentados dependem do modelo e da configuração. Fonte: [PR com explicação e medições](https://github.com/ggml-org/llama.cpp/pull/31356).

- **Google publica um método para avaliar se uma skill realmente ajuda o agente.** Uma skill é um pacote de instruções para orientar o agente em determinado trabalho. O guia de **3 de novembro** propõe comparar várias execuções da mesma tarefa, com e sem esse pacote, mantendo o mesmo pedido e ambientes limpos equivalentes. Credenciais e configurações já presentes na máquina podem fazer o agente passar no teste sem precisar da skill. Os autores também recomendam avaliar correção, segurança e eficiência separadamente: economizar tokens não deve compensar uma tarefa incorreta. Fonte: [guia de avaliação do Google Cloud](https://cloud.google.com/blog/topics/developers-practitioners/evaluate-agent-skills-before-they-bloat-your-context-window/).

- **Chimera Linux renova as imagens de instalação e troca iwd por NetworkManager.** As imagens **20261103**, publicadas em **3 de novembro**, trazem o NetworkManager também na edição básica, facilitando configurar redes sem interface gráfica. O conjunto usa kernel 7.3, GNOME 51 e Plasma 6.8; nenhuma das novas imagens inclui o servidor X.Org. Quem pretende experimentar a distribuição deve conferir essa mudança antes de planejar o ambiente gráfico. Fonte: [notas oficiais do Chimera](https://chimera-linux.org/news/2026/11/new-images.html).

- **Safari 27.3 beta testa modo escuro automático para sites claros.** Anunciado em **3 de novembro**, o Adaptive Dark Mode adapta cores quando o usuário habilita o recurso. Sites que declaram suporte a temas claro e escuro por `color-scheme` preservam sua própria apresentação. Para desenvolvedores, vale testar contraste, logos e imagens na versão beta. O WebKit ressalta que a opção `only`, destinada a impedir a transformação, **ainda não funciona na beta 1**. Fonte: [explicação do WebKit](https://webkit.org/blog/18541/introducing-adaptive-dark-mode/).

- **Vercel CI deixa de exigir um projeto Vercel vinculado ao repositório.** Desde **3 de novembro**, o serviço de integração contínua pode executar tarefas em um repositório GitHub sem criar um projeto vazio na plataforma. São necessários o aplicativo GitHub da Vercel com acesso, contas conectadas e permissão de escrita ou administração. **O suporte é limitado a repositórios privados do GitHub.** É uma ampliação do [beta anunciado em outubro](/2026/alpine-gitlab-ruby-ubuntu-core-desktop-node-lts/). Fonte: [changelog da Vercel](https://vercel.com/changelog/vercel-ci-no-longer-requires-a-linked-vercel-project).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 30459
source_urls:
  - https://www.djangoproject.com/weblog/2026/nov/03/security-releases/
  - https://news.opensuse.org/2026/11/03/leap-unites-traditional-and-immutable/
  - https://arxiv.org/html/2611.05306v1
  - https://neodyme.io/en/blog/puppet_rce
  - https://github.com/OpenVoxProject/openvox/security/advisories/GHSA-ffr6-rwpm-p5wq
  - https://github.com/OpenVoxProject/trapperkeeper-authorization/security/advisories/GHSA-q4hm-33rc-572g
  - https://download.samba.org/pub/rsync/NEWS#3.5.2
  - https://safedep.io/blog/antd-img-crop-forged-commit-overlord-stealer
  - https://fedoramagazine.org/announcing-fedora-linux-45/
  - https://sw.kovidgoyal.net/kitty/changelog/#id1
  - https://sw.kovidgoyal.net/kitty/sessions/
  - https://grafana.com/blog/bridging-alloy-and-opentelemetry-the-otel-engine-is-now-in-public-preview/
  - https://github.com/ggml-org/llama.cpp/pull/31356
  - https://cloud.google.com/blog/topics/developers-practitioners/evaluate-agent-skills-before-they-bloat-your-context-window/
  - https://chimera-linux.org/news/2026/11/new-images.html
  - https://webkit.org/blog/18541/introducing-adaptive-dark-mode/
  - https://vercel.com/changelog/vercel-ci-no-longer-requires-a-linked-vercel-project
-->
