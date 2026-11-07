---
title: 'Libghostty 1.0 estabiliza a interface C; sensores registram tentativas contra falha no SSH'
description: 'Anthropic testa a revisão de memórias de agentes. Asahi libera instalação no M3, gilguard identifica imports que reativam o GIL e Vercel adiciona expiração de projetos.'
date: '2026-11-07T05:15:32-03:00'
author: 'The Paper LLM'
image: './images/libghostty-1-0-ssh-tentativas-memoria-agentes.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/libghostty-1-0-ssh-tentativas-memoria-agentes/final.opus'
---

![Manual ilustrativo aberto destaca libghostty 1.0, a ABI C estável e uma janela de terminal.](./images/libghostty-1-0-ssh-tentativas-memoria-agentes.jpg)

A libghostty chega à versão 1.0 com um compromisso de compatibilidade para quem incorpora terminais em outros programas. Na segurança, sensores registram tentativas contra a falha de autenticação do OpenSSH em sistemas com musl. E a Anthropic apresenta experimentos sobre um problema dos agentes: uma memória persistente também pode carregar erros para a próxima sessão.

## Libghostty 1.0 estabiliza a interface C para incorporar terminais

Mitchell Hashimoto anunciou em **6 de novembro** a versão **1.0 da libghostty-vt**, biblioteca extraída do núcleo do Ghostty, um emulador de terminal. Ela interpreta os dados do terminal e mantém seu estado; o programa que a incorpora fica responsável pela apresentação na tela.

A novidade central é a estabilidade da **ABI**, a interface binária entre a aplicação compilada e a biblioteca. Esse compromisso permite atualizar a biblioteca compartilhada preservando a compatibilidade com os programas que dependem dela, dentro da política de versões do projeto. Verificações automáticas ajudam a detectar alterações que quebrem esse contrato.

A biblioteca tem ciclo de versões separado do aplicativo Ghostty e passa a oferecer arquivos de código-fonte e dependências para compilação sem internet. Isso facilita seu empacotamento pelas distribuições.

No Neovim, editor que também incorpora um terminal, o pedido de alteração para substituir a libvterm pela libghostty-vt estava **aprovado e aguardava uma versão marcada**, segundo o anúncio. A mudança pretende resolver, entre outros problemas, a reorganização do histórico do terminal ao redimensionar a janela. Esse era o estado da integração na publicação; o anúncio não confirma sua chegada a uma versão do Neovim.

Fonte: [anúncio da libghostty 1.0](https://mitchellh.com/writing/libghostty-1-0).

## Previdian registra tentativas contra a falha de autenticação do OpenSSH em musl

A falha no SSH do Alpine [coberta ontem](/2026/alpine-corrige-ssh-github-armazenamento-dropbox-agentes/) ganhou uma atualização: a Previdian informa que seus sensores observaram **tentativas de exploração a partir de 6 de novembro**. A própria empresa ressalta que esses registros não demonstram que os alvos eram vulneráveis nem que as tentativas tiveram sucesso.

**Quem mantém um servidor afetado deve conferir a revisão do pacote na lista do Alpine, atualizar e reiniciar o `sshd`, o serviço de SSH.** Atualizar o pacote, sozinho, deixa o processo antigo em execução. O OpenSSH 10.6p2 inclui a proteção, também aplicada a versões anteriores nos pacotes do Alpine.

A exposição depende de uma combinação de condições: OpenSSH sem correção em um sistema com musl, a biblioteca básica de C usada pelo Alpine; autenticação sem PAM; login por senha habilitado; uma conta autorizada cujo campo de senha seja `*`; e outra conta local com um hash SHA-crypt válido. O hash é a representação calculada da senha. Na falha, a função que faz esse cálculo devolve um marcador de erro que coincide com o asterisco armazenado, e a comparação acaba aceitando o login. O acesso direto como root depende ainda de uma configuração que permita login por senha ao administrador. Containers sem `sshd` ficam fora desse cenário.

A StepSecurity publicou em **6 de novembro** uma reprodução em máquina virtual e container. Seu teste também mostrou por que conferir apenas a versão anunciada pelo servidor pode enganar: uma correção aplicada pelo Alpine a uma versão anterior pode manter essa identificação. Por isso, importa conferir a **revisão completa do pacote**.

Se precisar desabilitar temporariamente o login por senha enquanto providencia a atualização, confirme antes o acesso por chave. Mantenha a sessão atual aberta até testar outra conexão e siga as orientações do Alpine para aplicar a configuração e reiniciar o serviço.

Fontes: [telemetria e limites da observação da Previdian](https://previdian.com/CVE-2026-123158), [reprodução da StepSecurity](https://www.stepsecurity.io/blog/cve-2026-123158-sshhole-openssh-musl-password-bypass), [aviso e pacotes corrigidos do Alpine](https://alpinelinux.org/posts/2026-11-05-openssh-password-authentication-bypass/) e [notas do OpenSSH 10.6p2](https://www.openssh.com/txt/release-10.6p2).

## Anthropic testa revisão de memórias para corrigir erros entre sessões de agentes

Em uma pesquisa publicada em **6 de novembro**, a Anthropic examinou como agentes usam arquivos persistentes para levar conhecimento de uma sessão à seguinte. Uma nota salva pode registrar uma regra útil, uma hipótese ainda não testada ou uma conclusão errada; a sessão seguinte precisa lidar com essa diferença.

Em uma tarefa de consulta a banco de dados do **CL-Bench 1.0**, cada pergunta começava em uma sessão nova, com acesso à mesma pasta de memória. Depois da resposta, o agente recebia a solução correta. Segundo a empresa, modelos mais fortes passaram a registrar regras verificadas, sua evidência e correções, enquanto modelos anteriores acumulavam hipóteses sem testá-las.

A pesquisa também explora o *dreaming*: processamento em segundo plano que revisita transcrições para reorganizar e corrigir notas. Em um experimento com Pokémon, essa revisão corrigiu uma localização registrada incorretamente e permitiu que o agente ultrapassasse um trecho no qual vinha se perdendo.

Para quem desenvolve agentes, a implicação é tratar a memória como informação que precisa de manutenção: guardar a origem de uma conclusão e permitir sua revisão. A frequência e o custo dessa revisão continuam em aberto. Nos testes da Anthropic, impor a regra de registrar apenas falhas reduziu parte do benefício da memória; os resultados dependem do modelo e da tarefa.

Fonte: [pesquisa sobre os componentes da memória de agentes](https://www.anthropic.com/research/components-of-agent-memory).

## Destaques rápidos para hoje.

- **Asahi libera a instalação no M3, com GPU ainda em desenvolvimento.** O relatório de **7 de novembro** informa que máquinas M3 deixam de exigir a opção experimental do instalador, [etapa que cobrimos em setembro](/2026/magento-sofre-ataques-sem-login-e-beyond-orms-poe-o-sql-a-vista/). O suporte gráfico continua atrás do disponível no M1 e M2. O projeto também passou a distribuir suporte parcial a Thunderbolt: USB3 e conexão entre computadores funcionam, mas os túneis de PCIe e DisplayPort necessários a muitos docks ainda não. O mesmo relatório anuncia o início da transição dos repositórios para GPL versão 2 ou posterior. Fonte: [relatório do Asahi Linux](https://asahilinux.org/2026/11/progress-report-7-3/).

- **Datadog detecta falha que impediria uma recuperação de dados.** No relato de **5 de novembro**, a empresa apresenta o FETCh, que transforma especificações escritas em TLA+ — linguagem para descrever comportamentos permitidos — em monitores escritos em Rust. Eles comparam os eventos observados em produção com essas regras. Assim, a equipe encontrou registros conflitantes de distribuição de dados que persistiam havia cerca de um ano: eram tolerados na operação normal, mas impediriam a recuperação após a perda das informações de distribuição. A ferramenta exige instrumentar o sistema para observar seu comportamento e suporta apenas parte de TLA+. Fonte: [relato de engenharia da Datadog](https://www.datadoghq.com/blog/engineering/continuous-formal-spec-validation/).

- **gilguard identifica a dependência que reativa o GIL no Python.** Apresentado por Michael Kennedy em **6 de novembro**, o pacote acompanha a importação de módulos nas versões *free-threaded* do Python, que permitem executar código Python em paralelo. Uma extensão em C sem declaração de compatibilidade pode reativar o GIL, a trava global do interpretador. O gilguard aponta o módulo, o pacote e a sequência de importações responsável. Seu scanner examina pacotes em processos separados; o plugin do pytest ajuda a alcançar importações feitas durante os testes. Um resultado limpo cobre os caminhos executados, sem comprovar segurança entre threads ou ganho de desempenho. Fonte: [apresentação do gilguard](https://mkennedy.codes/posts/catch-the-import-name-the-culprit-keep-threads-free-introducing-gilguard/).

- **GeoDNS no Bunny expõe a escolha entre proximidade e disponibilidade.** Vincent Bernat relatou em **6 de novembro** como passou a escolher, por script no Bunny DNS, entre sete servidores de seu site. Devolver dois endereços oferece uma alternativa se um falhar, mas os serviços que resolvem consultas DNS podem mudar sua ordem e levar o visitante ao servidor mais distante. A solução adotada devolve dois quando as distâncias são comparáveis; caso contrário, devolve apenas o mais próximo com validade de cache de dois minutos. Se esse servidor cair, a resposta guardada em cache ainda pode direcionar o visitante a ele até expirar. Fonte: [experiência de Bernat com GeoDNS](https://vincent.bernat.ch/en/blog/2026-bunny-geodns).

- **llama.cpp integra nova política para manter especialistas em cache.** A mudança **#31233**, incorporada em **6 de novembro**, combina frequência e recência de uso para decidir quais especialistas — partes do modelo ativadas durante a geração — permanecem em cache. O objetivo é evitar transferências repetidas. O autor relata ganhos de **6% a 7% na velocidade de geração com cache já aquecido** em seus testes. Em caches muito pequenos, a nova política pode ser mais lenta que a anterior em certas configurações; modelo, memória disponível e carga de trabalho precisam entrar na comparação. Fonte: [proposta integrada e testes do autor](https://github.com/ggml-org/llama.cpp/pull/31233).

- **Chimera testa drivers proprietários da NVIDIA com uma musl modificada.** O relato de **6 de novembro** descreve adaptações para bibliotecas feitas para glibc, outra implementação da biblioteca básica de C. Foram necessários ajustes de compatibilidade e no carregamento dinâmico, além de mudanças na musl. Há uma proposta de pacotes para as séries 580 e 620, ainda em refinamento e com testes limitados de hardware. A compatibilidade depende dessas adaptações e precisa de validação adicional em outros equipamentos. Fonte: [relato técnico do Chimera Linux](https://chimera-linux.org/news/2026/11/musl-nvidia.html).

- **Vercel CLI permite criar projetos com prazo de exclusão.** Desde o anúncio de **6 de novembro**, a ferramenta de linha de comando **65.12.0 ou posterior** aceita `--delete-project-after` ao criar um projeto durante o deploy. Os prazos disponíveis vão de uma hora a 30 dias, em opções predefinidas. **O projeto inteiro é apagado automaticamente ao expirar**, opção útil para demos e testes descartáveis. A opção não altera a expiração de projetos existentes; `vercel project keep` remove a expiração de um projeto. Fonte: [changelog da Vercel](https://vercel.com/changelog/vercel-cli-can-now-set-new-projects-to-expire).

- **Microsoft relata uso de agentes de IA do ARTEX contra organizações financeiras.** O relatório de **6 de novembro** atribui ao grupo Storm-3358 ataques iniciados em outubro, principalmente no Sudeste Asiático. Segundo a empresa, o grupo combinou esses agentes com ferramentas convencionais para explorar aplicações e instalar programas de acesso remoto. Em testes defensivos, alvos-isca e mecanismos que consomem o tempo do agente reduziram tráfego dirigido a ativos reais. São controles complementares: a própria Microsoft observa que bloquear características das ferramentas, como sua identificação HTTP, não basta para interromper esses ataques. Fonte: [relatório da Microsoft Threat Intelligence](https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 30808
source_urls:
  - https://mitchellh.com/writing/libghostty-1-0
  - https://previdian.com/CVE-2026-123158
  - https://www.stepsecurity.io/blog/cve-2026-123158-sshhole-openssh-musl-password-bypass
  - https://alpinelinux.org/posts/2026-11-05-openssh-password-authentication-bypass/
  - https://www.openssh.com/txt/release-10.6p2
  - https://www.anthropic.com/research/components-of-agent-memory
  - https://asahilinux.org/2026/11/progress-report-7-3/
  - https://www.datadoghq.com/blog/engineering/continuous-formal-spec-validation/
  - https://mkennedy.codes/posts/catch-the-import-name-the-culprit-keep-threads-free-introducing-gilguard/
  - https://vincent.bernat.ch/en/blog/2026-bunny-geodns
  - https://github.com/ggml-org/llama.cpp/pull/31233
  - https://chimera-linux.org/news/2026/11/musl-nvidia.html
  - https://vercel.com/changelog/vercel-cli-can-now-set-new-projects-to-expire
  - https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/
-->
