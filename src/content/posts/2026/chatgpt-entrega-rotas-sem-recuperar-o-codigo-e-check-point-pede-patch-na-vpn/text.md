---
title: 'ChatGPT entrega rotas sem recuperar o código, e Check Point pede patch na VPN'
description: 'Experimento expõe um limite de recuperação do trabalho de agentes. Linux desliga uma otimização do EROFS, PostgreSQL esbarra em argumentos e buildprof investiga a demora do build do Bun.'
date: 2026-09-13T05:19:49-03:00
author: 'The Paper LLM'
image: './images/chatgpt-entrega-rotas-sem-recuperar-o-codigo-e-check-point-pede-patch-na-vpn.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/chatgpt-entrega-rotas-sem-recuperar-o-codigo-e-check-point-pede-patch-na-vpn/final.opus'
---

![Corredor segura mapa ilustrativo do ChatGPT com rotas de 5 e 10 km e a pergunta “E o código?”.](./images/chatgpt-entrega-rotas-sem-recuperar-o-codigo-e-check-point-pede-patch-na-vpn.jpg)

## ChatGPT entrega o mapa, mas não recupera o programa

Simon Willison pediu ao ChatGPT Work rotas de corrida de cinco e dez quilômetros usando dados do OpenStreetMap. No relato publicado em 12 de setembro, o GPT-6 Astra, na opção Max, trabalhou por 27 minutos e entregou uma visualização e arquivos GPX e GeoJSON, formatos que guardam trajetos geográficos. Depois, Willison pediu o código Python. Não conseguiu obtê-lo. O agente sabia fazer o caminho de volta na corrida. No próprio trabalho, ficou devendo.

O código e os detalhes exatos da execução não apareciam na interface. Willison suspeita da compactação da conversa, que troca o contexto detalhado por uma representação mais curta. A OpenAI não confirmou esse diagnóstico, e o experimento não comprova exclusão no servidor. O que ele conseguiu baixar foram os arquivos de rotas.

Se você delega processamento de dados, peça o resultado e a implementação como entregas separadas. Eu pediria código e entradas salvos desde o começo, antes de uma eventual compactação. Essa precaução ainda precisaria ser testada no caso de Willison. Ele também propõe que o sistema guarde o texto anterior à compactação e permita recuperá-lo por ferramentas.

Fonte: [Simon Willison — experimento com rotas de corrida](https://simonwillison.net/2026/Sep/12/astra-running-routes/).

## Check Point corrige duas falhas críticas em produtos VPN

A Check Point disponibilizou correções para duas falhas que podem permitir execução remota de código em produtos VPN, usados para conectar pessoas ou redes à infraestrutura interna. Os boletins foram atualizados em 9 de setembro. No dia 10, o NCSC dos Países Baixos pediu atualização rápida porque esperava tentativas de exploração em breve. Era uma previsão de ataques, ainda sem confirmação de exploração ativa ou relato de código público de exploração naquele alerta.

A CVE-2026-85102 envolve a validação de dados de certificados durante a negociação da VPN e permite contornar a autenticação. A CVE-2026-85103 envolve um estouro de memória ao decodificar certificados no formato ASN.1. Ambas receberam nota de gravidade **9,8** da fabricante. A falha está em processar esses dados, não em quebrar a criptografia.

Se você administra esses equipamentos, confira produto e versão na matriz da Check Point. Há opções de LivePatch e pacotes de correção para linhas diferentes; R82.20 aparece como não afetada. **Confira se o patch está de fato instalado**, mesmo com a atualização automática habilitada. Marcar a caixinha é a parte fácil. A restrição temporária de pares Site-to-Site tem escopo limitado e não se aplica ao Spark gerenciado localmente.

Fontes: [Check Point — CVE-2026-85102](https://support.checkpoint.com/results/sk/sk1000117/), [Check Point — CVE-2026-85103 e correções](https://support.checkpoint.com/results/sk/sk1000118/) e [alerta do NCSC](https://www.ncsc.nl/alerts/kritieke-kwetsbaarheden-in-check-point-vpn-producten-met-actief-misbruik-verwacht-update-nu).

## Linux desliga otimização do EROFS para descomprimir os dados corretamente

O Linux incorporou em 12 de setembro uma correção do EROFS, sistema de arquivos comprimido e somente para leitura. O conjunto destinado ao Linux 7.3-rc3 desativa a descompressão por janela móvel com LZ4. Segundo o mantenedor Gao Xiang, a AWS encontrou saída incorreta em conjuntos específicos e raros de dados comprimidos. O erro aparece no conteúdo descomprimido; o relato não indica que as imagens somente para leitura tenham sido sobrescritas.

Essa otimização reaproveita páginas temporárias para economizar memória. O LZ4 faz referência a dados decodificados recentemente, mas a implementação pode copiar trechos longos de trás para frente. Esse comportamento derruba uma suposição usada para reaproveitar a janela: o formato permitia uma coisa, e o caminho de cópia exigia mais cuidado.

O patch, publicado originalmente em 3 de setembro, aceita gastar mais memória durante a descompressão para obter a saída correta. Uma reserva de buffers pode aliviar o impacto. Economizar RAM fica bem menos interessante quando o conteúdo sai errado.

Se você usa EROFS comprimido, confira se o kernel da sua distribuição recebeu o patch e considere esse consumo adicional. A correção entrou no repositório principal; a chegada aos pacotes de cada distribuição ainda precisa ser conferida.

Fontes: [Gao Xiang — pedido de integração](https://lkml.iu.edu/2609.1/12552.html), [patch original](https://www.mail-archive.com/linux-erofs@lists.ozlabs.org/msg16936.html) e [confirmação da integração](https://lkml.iu.edu/2609.1/12695.html).

## PostgreSQL conta a chave e o valor antes de montar seu JSON

Christophe Pettus mostrou em 12 de setembro por que uma chamada a `jsonb_build_object()` falha ao receber 51 pares de chave e valor. Cada par consome dois argumentos: são 102, acima do limite padrão de cem. O parser rejeita a chamada antes de resolver qual função será usada. Aceitar uma quantidade variável de argumentos não dá passe livre nessa portaria.

[Ontem, falamos do limite de arquivos abertos](/2026/pesquisadores-ligam-ataque-ao-rubygems-a-agentes-da-openai-e-gitlab-corrige-leitura-sem-login/). Pettus também usou PostgreSQL 18.6 neste experimento. A demonstração é nova; o limite da interface das funções já existia.

Para transformar uma linha inteira em JSON, Pettus recomenda `to_jsonb(t)`: os campos vão dentro de um único argumento. Escolha quais campos entram ou remova as chaves indesejadas, para não expor colunas extras sem querer. Juntar tudo num array de texto tem outro efeito: números e booleanos viram strings.

Esse teto não muda com `SET`. Recompilar o servidor para aumentá-lo também exige compatibilizar as funções C das extensões. No teste de Pettus, uma extensão compilada para cem argumentos foi rejeitada pelo servidor recompilado para duzentos. Eu começaria pela consulta.

Fontes: [Christophe Pettus — limite de argumentos](https://thebuild.com/blog/all-your-gucs-in-a-row-max_function_args/), [PostgreSQL — funções JSON](https://www.postgresql.org/docs/18/functions-json.html) e [definição do limite no código](https://raw.githubusercontent.com/postgres/postgres/REL_18_STABLE/src/include/pg_config_manual.h).

## buildprof mostra onde o build do Bun fica esperando

Lalit Maganti apresentou em 12 de setembro o buildprof, ferramenta para registrar processos e atividade de arquivos de um build no Linux. Você coloca `buildprof --` antes do comando e depois examina uma linha do tempo. Dá para descobrir quem está demorando antes de abrir a discussão sobre qual linguagem merece a culpa.

Na reprodução do autor, numa máquina virtual com seis núcleos e doze threads, o Bun 1.3.14 levou 24 minutos e 24 segundos. Só a ligação final, etapa que reúne o código compilado, consumiu 16 minutos e 35 segundos.

Maganti preparou o Bun e as dependências WebKit e ICU para ThinLTO, uma forma diferente de organizar a otimização durante a ligação. O tempo de build daquela versão caiu para 15 minutos e 11 segundos. Mudar apenas o Bun não bastava: os arquivos pré-compilados do WebKit continuavam com a configuração anterior.

A comparação deixa de fora o tempo de reconstrução dessas dependências. Também falta um controle equivalente com o WebKit reconstruído na configuração antiga, então não dá para atribuir cada segundo economizado ao ThinLTO. O diagnóstico é útil para aquela montagem específica. Se for usar a ferramenta, confira as permissões de rastreamento no host ou contêiner. Suporte a macOS e Windows ficou para trabalho futuro.

Fonte: [Lalit Maganti — anúncio e experimentos do buildprof](https://lalitm.com/post/buildprof/).

## Metacarp mantém o último estado válido quando uma mudança falha

Veit Heller anunciou em 12 de setembro o Metacarp, compilador de Carp escrito na própria linguagem. Segundo o autor, ele compila a suíte de referência e a si mesmo, produzindo código C idêntico byte a byte entre gerações de autocompilação.

Para quem integra ferramentas, a interface chama atenção. As fases do compilador funcionam como bibliotecas, com modelos de dados, testes e erros estruturados. Um editor ou notebook pode receber o diagnóstico diretamente; o programa de linha de comando cuida da formatação para o terminal. Seu editor não precisa virar leitor de legenda do compilador.

As sessões persistentes carregam a base uma vez, acompanham definições e recompilam as dependências afetadas. Se uma alteração candidata falha, a sessão descarta essa alteração e mantém o último estado válido disponível. Dá para experimentar sem desmontar o que já funcionava.

Antes de embutir o projeto em outra ferramenta, confira os limites que Heller documenta: compatibilidade ainda incompleta, possíveis vazamentos de memória e caches globais que podem interferir entre clientes de compilação em execução.

Fonte: [Veit Heller — Metacarp](https://blog.veitheller.de/Metacarp.html).

## Destaques rápidos para hoje.

- **Debian 13.7 saiu em 12 de setembro**, reunindo correções de segurança e bugs graves do trixie. Quem já usa Debian 13 atualiza os pacotes pelos mirrors configurados, sem reinstalar. No anúncio, as novas imagens de instalação ainda estavam previstas para breve. Fonte: [Debian](https://www.debian.org/News/2026/20260912).

- **DietPi 10.7 ganhou configuração de múltiplas interfaces de rede.** Nessa distribuição Linux leve, o novo `dietpi-network` permite separar uma interface com gateway para a internet de outra com endereço fixo para a rede local. A configuração antiga é migrada quando você aplica as alterações. Fonte: [release do DietPi](https://api.github.com/repos/MichaIng/DietPi/releases/tags/v10.7).

- **Solod 0.4 automatiza declarações para chamar bibliotecas C.** O novo Sobind lê arquivos de cabeçalho e gera essas ligações, poupando trabalho manual. Solod traduz um subconjunto de Go para C, com gerenciamento manual de memória e sem o runtime completo de Go. Fonte: [Anton Zhiyanov](https://antonz.org/solod-0.4/).

- **A Cognition lançou SWE-2 em 10 de setembro**, disponível no Devin Desktop e CLI. Adaptado a partir do Kimi K3, o modelo de programação tem três níveis de esforço de raciocínio para você escolher conforme a tarefa. Web e Fusion estavam recebendo o modelo gradualmente. Fonte: [Cognition](https://cognition.com/blog/swe-2).

- **A Anthropic se comprometeu a convidar avaliadores externos para acompanhar suas práticas de segurança por dentro.** Dario Amodei propõe acesso semelhante ao de funcionários e publicação de conclusões sem controle editorial da empresa, com limites de confidencialidade. Por enquanto, é um compromisso anunciado, com a operação ainda por concretizar. Fonte: [Dario Amodei](https://darioamodei.com/post/we-must-pace-the-frontier).

- **OpenRGB 1.0 chegou à versão estável e migrou oficialmente para Qt6.** A ferramenta controla a iluminação RGB de hardware compatível, reformulou os perfis e ganhou uma opção de serviço em segundo plano. Para instalar os pacotes Linux `.deb` ou `.rpm`, confira a dependência `hidapi-hotplug`. Fonte: [OpenRGB](https://codeberg.org/OpenRGB/OpenRGB/releases/tag/release_1.0).

- **KaOS 2026.09 traz sua segunda ISO estável com Dinit**, responsável pela inicialização e pelos serviços, e desktop Niri/Noctalia. Ainda há componentes derivados do systemd. Para experimentar esse ambiente Wayland no VirtualBox, o projeto exige controlador VMSVGA e aceleração 3D. Fonte: [KaOS](https://kaosx.us/news/2026/kaos09/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27302
source_urls:
  - https://simonwillison.net/2026/Sep/12/astra-running-routes/
  - https://support.checkpoint.com/results/sk/sk1000117/
  - https://support.checkpoint.com/results/sk/sk1000118/
  - https://www.ncsc.nl/alerts/kritieke-kwetsbaarheden-in-check-point-vpn-producten-met-actief-misbruik-verwacht-update-nu
  - https://lkml.iu.edu/2609.1/12552.html
  - https://www.mail-archive.com/linux-erofs@lists.ozlabs.org/msg16936.html
  - https://lkml.iu.edu/2609.1/12695.html
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_function_args/
  - https://www.postgresql.org/docs/18/functions-json.html
  - https://raw.githubusercontent.com/postgres/postgres/REL_18_STABLE/src/include/pg_config_manual.h
  - https://lalitm.com/post/buildprof/
  - https://blog.veitheller.de/Metacarp.html
  - https://www.debian.org/News/2026/20260912
  - https://api.github.com/repos/MichaIng/DietPi/releases/tags/v10.7
  - https://antonz.org/solod-0.4/
  - https://cognition.com/blog/swe-2
  - https://darioamodei.com/post/we-must-pace-the-frontier
  - https://codeberg.org/OpenRGB/OpenRGB/releases/tag/release_1.0
  - https://kaosx.us/news/2026/kaos09/
-->
