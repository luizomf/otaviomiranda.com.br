---
title: 'Pacotes falsos de Express instalam worm no Linux; estudo avalia otimizações feitas por agentes'
description: 'Também: chaves de criptografia e recuperação no Lambda, planos da Cloudflare para certificados, memória no Valkey, Ubuntu, Rust e novos relatos de segurança.'
date: '2026-09-30T06:31:00-03:00'
author: 'The Paper LLM'
image: './images/pacotes-falsos-express-worm-linux-otimizacoes-agentes.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/pacotes-falsos-express-worm-linux-otimizacoes-agentes/final.opus'
---

![Placa amarela alerta para pacote falso de Express e risco no Linux, com ilustração de worm saindo de uma caixa e Tux.](./images/pacotes-falsos-express-worm-linux-otimizacoes-agentes.jpg)

Pacotes que imitam Express e React usam a instalação para executar malware no Linux, segundo a SafeDep. Na revisão de código, um estudo mostra por que aceitar uma otimização feita por agente ainda exige medir desempenho e conferir os resultados. A edição também traz um guia da AWS sobre recuperação de execuções, atualizações de ferramentas e novos relatos de segurança.

## Pacotes falsos de Express e React instalam um worm no Linux

A SafeDep publicou em **29 de setembro** uma análise de nove pacotes maliciosos no npm: oito imitam o Express, framework para aplicações web em Node.js, e um imita o React. O comprometimento descrito envolve esses pacotes impostores, sem indicação de invasão dos projetos legítimos Express e React.

Segundo a análise, um script executado automaticamente durante a instalação busca código externo e inicia, no Linux, um **worm**, malware capaz de se propagar. Ele instala uma ferramenta de acesso remoto disfarçada de serviço de fontes e tenta usar chaves SSH e tokens do npm disponíveis na máquina para alcançar outros servidores e publicar versões infectadas de pacotes. Também tenta contaminar pacotes do AUR, repositório comunitário do Arch Linux, quando encontra credenciais com permissão de escrita.

O alcance depende das permissões e dos segredos acessíveis. A análise identifica formas de manter o malware instalado — a chamada persistência — tanto como administrador quanto como usuário comum. Por isso, executar a instalação sem `root` ainda deixa expostos os recursos que aquele usuário pode acessar.

**Se um dos pacotes identificados foi instalado em uma máquina Linux, a orientação da SafeDep é tratar o host e suas chaves e tokens como comprometidos.** A lista para conferência está no relatório. Para prevenção, vale separar ambientes que executam dependências das credenciais de produção e publicação: isso reduz o que um script de instalação consegue atingir.

Fonte: [investigação da SafeDep, com a lista dos pacotes e indicadores](https://safedep.io/dirtyblanket-express-impersonation-npm/).

## Estudo encontra ganhos ausentes e mudanças de comportamento em otimizações de agentes

Um preprint de **29 de setembro**, ainda uma publicação preliminar, examinou **1.262 correções de desempenho produzidas por agentes em 582 repositórios**. Entre as 1.259 correções com dados de arquivos disponíveis, apenas 11% incluíam teste de desempenho ou benchmark — uma medição feita sobre uma carga definida.

Os pesquisadores também executaram novamente **30 correções já incorporadas aos projetos**. Dezoito entregaram o ganho de desempenho segundo os critérios do estudo, três melhoraram menos do que prometiam e nove não apresentaram ganho significativo ou pioraram. Em 14 das 30, surgiram mudanças de comportamento para entradas que os testes da alteração não cobriam. Essas 14 fazem parte dos mesmos grupos: uma alteração pode melhorar a velocidade e ainda mudar o resultado para certas entradas.

A amostra de 30 foi escolhida entre correções que alteravam testes e podiam ser executadas nos ambientes disponíveis. Portanto, esses números descrevem os casos estudados; não permitem estimar a taxa de falha de todo código escrito por agentes.

Ao revisar uma otimização, peça uma comparação antes/depois com uma carga reproduzível e confira se o resultado continua correto. Medir em tamanhos diferentes também importa: uma busca que compensa para centenas de elementos pode acrescentar trabalho quando a coleção tem apenas alguns.

Fonte: [Merged, Not Measured, especialmente as seções 7.2 e 7.3](https://arxiv.org/html/2609.37985v1).

## AWS explica por que a chave de criptografia faz parte da recuperação de um fluxo

Em um guia publicado em **29 de setembro**, a AWS demonstra como configurar chaves de criptografia nas funções duráveis do Lambda, serviço que executa código sob demanda. O exemplo usa Terraform, ferramenta para definir infraestrutura em código. Essas funções salvam **checkpoints**, registros do progresso que permitem retomar uma execução interrompida. Eles podem conter resultados intermediários, dados de entrada e respostas de callbacks, que sinalizam a conclusão de trabalho externo.

Cada execução permanece associada à chave com que começou. Configurar outra chave para a função afeta as novas execuções; as anteriores continuam dependendo da antiga. Assim, a troca de chave exige preservar o acesso à anterior enquanto houver estado salvo que dependa dela. Segundo a AWS, desabilitar essa chave ou retirar a permissão de descriptografia impede o acesso ao estado salvo. Excluí-la torna esse estado irrecuperável.

Para quem mantém fluxos longos, a consequência é incluir as execuções antigas no planejamento de desativação de chaves. O guia recomenda usar o período de espera do KMS, serviço de gerenciamento de chaves, de 7 a 30 dias. Também orienta acompanhar chamadas de descriptografia no CloudTrail, registro de atividades da AWS, antes de concluir a exclusão. Salvar progresso e conservar os meios de lê-lo são partes da mesma estratégia de recuperação.

Fonte: [guia da AWS sobre criptografia de execuções duráveis](https://aws.amazon.com/blogs/compute/implementing-customer-managed-keys-for-aws-lambda-durable-functions-with-terraform/).

## Destaques rápidos para hoje.

- **Cloudflare anuncia planos para uma autoridade certificadora pública.** Em 29 de setembro, a empresa informou que solicitou inclusão nos programas de confiança de Chrome, Apple, Microsoft e Mozilla e assinou um acordo para adquirir uma raiz já estabelecida da GlobalSign — um certificado que os clientes usam como referência de confiança. Essa raiz ajuda a alcançar aparelhos antigos que não receberiam uma nova por atualização. A empresa ainda não está emitindo certificados e planeja exigir renovação automatizada por ACME com suporte a ARI, mecanismo que informa quando renovar. Fonte: [anúncio da Cloudflare](https://blog.cloudflare.com/cloudflare-certificate-authority/).

- **Teste da Percona mede 37,5% menos memória por chave no Valkey.** A análise de 29 de setembro compara versões do banco chave-valor e encontra queda de 102,48 para 64,02 bytes por chave entre 7.2.14 e 9.1.1. O teste usa valores de 16 bytes, aproximadamente 632 mil chaves únicas e o mesmo alocador de memória, com persistência e remoção automática de dados desativadas. As mudanças reduzem o espaço gasto nas estruturas que organizam os dados; a economia da sua aplicação precisa ser medida com suas chaves, valores e configuração. Fonte: [benchmark da Percona](https://www.percona.com/blog/valkey-memory-optimization/).

- **Ubuntu prepara a atualização de desktops 24.04 LTS para 26.04 LTS.** A Canonical informou em 29 de setembro que os avisos de atualização chegarão em breve e que o 26.04.1 já está disponível para download. A versão adota o desktop GNOME 50 com Wayland, protocolo de comunicação com o sistema gráfico, e amplia o uso de ferramentas reescritas em Rust, incluindo `sudo-rs` e `uutils`; implementações GNU permanecem disponíveis para compatibilidade. Antes de migrar a máquina de trabalho, teste seus scripts e os fluxos de desktop dos quais depende. Fonte: [comunicado da Canonical](https://ubuntu.com/blog/upgrade-your-desktop-ubuntu-26-04-lts).

- **OpenZL 0.3.0 acelera a descompressão e exige atenção ao formato.** A biblioteca de compressão lançada em 29 de setembro incorpora uma nova implementação de Huffman. Seus mantenedores relatam descompressão 33% mais rápida que na 0.2.0, no nível 1 com janela de 64 KB. Novos arquivos usam por padrão a versão 27 do formato; para leitores da 0.2.0, é necessário produzir o formato 24. Vale testar velocidade e compatibilidade com seus dados antes da troca. Fonte: [notas da versão](https://github.com/facebook/openzl/releases/tag/v0.3.0).

- **Microsoft relata roubo de credenciais Kubernetes por uma pipeline maliciosa.** No caso divulgado em 29 de setembro, uma conta comprometida deu acesso ao Azure DevOps, onde o invasor criou uma automação para coletar arquivos `kubeconfig`, que guardam informações de conexão e autenticação de clusters. A investigação encontrou sete desses arquivos adicionados a um repositório. A recomendação inclui limitar quem pode criar, alterar e executar pipelines, além de revisar as permissões dos recursos conectados. Fonte: [relato da equipe de resposta da Microsoft](https://www.microsoft.com/en-us/security/blog/2026/09/29/beyond-source-code-a-path-to-the-keys-to-the-kingdom/).

- **Mandiant detalha acessos persistentes após ataques ao NetScaler.** Depois do [alerta da CISA que cobrimos em 28 de setembro](/2026/luarocks-revoga-credenciais-cisa-alerta-ataques-netscaler/), o relatório de 29 de setembro descreve comandos remotos via web e túneis para redes internas após exploração da CVE-2026-88772. O novo material traz orientação para examinar configurações, arquivos e logs do equipamento. Quem opera NetScaler precisa combinar atualização com investigação de comprometimento: corrigir a entrada explorada não comprova a remoção dos acessos já instalados. Fonte: [análise e orientações da Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/defending-against-active-exploitation-of-citrix-netscaler-adc-and-gateway-appliances/).

- **Anthropic publica avaliação de exploração de falhas com GLM-5.3.** Em testes isolados descritos em 29 de setembro, a empresa relata que o modelo conseguiu tomar o controle do fluxo de execução em 4% das tentativas de uma avaliação interna, usando 100 tarefas sorteadas de projetos participantes do OSS-Fuzz. O resultado é uma medição de laboratório feita por uma concorrente, com alvos preparados para avaliação; não representa uma taxa de sucesso contra sistemas em produção. Fonte: [metodologia e resultados da Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities).

- **Rust registra redução média de 4,57% no tempo de compilação medido.** No balanço publicado em 30 de setembro, Nicholas Nethercote compara os benchmarks do compilador entre 29 de julho e 28 de setembro: 555 de 629 medições melhoraram e 74 regrediram. Entre as mudanças estão atualização do LLVM e redução de trabalho em análises internas. É um resultado da suíte de testes durante a evolução do compilador; o ganho em um projeto específico depende da carga e da versão utilizada. Fonte: [balanço de Nethercote](https://nnethercote.github.io/2026/09/30/how-to-speed-up-the-rust-compiler-in-september-2026.html).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 28032
source_urls:
  - https://safedep.io/dirtyblanket-express-impersonation-npm/
  - https://arxiv.org/html/2609.37985v1
  - https://aws.amazon.com/blogs/compute/implementing-customer-managed-keys-for-aws-lambda-durable-functions-with-terraform/
  - https://blog.cloudflare.com/cloudflare-certificate-authority/
  - https://www.percona.com/blog/valkey-memory-optimization/
  - https://ubuntu.com/blog/upgrade-your-desktop-ubuntu-26-04-lts
  - https://github.com/facebook/openzl/releases/tag/v0.3.0
  - https://www.microsoft.com/en-us/security/blog/2026/09/29/beyond-source-code-a-path-to-the-keys-to-the-kingdom/
  - https://cloud.google.com/blog/topics/threat-intelligence/defending-against-active-exploitation-of-citrix-netscaler-adc-and-gateway-appliances/
  - https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities
  - https://nnethercote.github.io/2026/09/30/how-to-speed-up-the-rust-compiler-in-september-2026.html
-->
