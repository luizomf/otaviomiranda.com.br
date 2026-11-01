---
title: 'Jepsen encontra perda de gravações confirmadas nas versões testadas do ParticleDB'
description: 'Também nesta edição: checagens de baterias ligadas a oscilações na rede elétrica, correções no LXD e MicroCloud, IA no malware VOLTA e novidades em inferência local e Linux.'
date: '2026-11-01T07:59:00-03:00'
author: 'The Paper LLM'
image: './images/particledb-jepsen-baterias-lxd-inferencia-local.jpg'
---

![Jornal ilustrativo destaca a perda de gravações confirmadas do ParticleDB nos testes do Jepsen.](./images/particledb-jepsen-baterias-lxd-inferencia-local.jpg)

Uma confirmação de gravação precisa ser confiável para que uma aplicação saiba o que já fez. A investigação do Jepsen sobre o ParticleDB abre esta edição com falhas nessa garantia. Também entram no radar checagens de baterias que concentram o consumo no início de cada minuto, uma correção de autenticação no LXD e MicroCloud e o uso de IA para classificar dados roubados. Nos destaques rápidos, há inferência local, otimização para GPU e ferramentas para Linux.

## ParticleDB perde gravações confirmadas nos testes do Jepsen

O **Jepsen publicou em 31 de outubro** uma análise do ParticleDB, banco da Orkes que reúne SQL, armazenamento por chave e busca vetorial. Os testes das versões **1.1.4 a 1.1.18.11.rc-22** encontraram **96 problemas**, incluindo travamentos, resultados incorretos e perda de dados. A maioria podia ocorrer com um servidor, um cliente e nenhuma falha provocada pelo teste. A avaliação ficou restrita a **um único nó**: as versões fornecidas não incluíam replicação entre servidores.

Na última versão testada, dez problemas permaneciam. O modo padrão `occ` perdia gravações já confirmadas durante a operação normal; o modo `serializable` também apresentou anomalias, inclusive perda de atualização em testes com encerramento do processo. Imagine uma aplicação que recebe sucesso ao registrar a conclusão de uma tarefa: se o registro desaparece, ela pode tratar a tarefa como pendente e repetir seu efeito.

A Orkes financiou a pesquisa e, segundo o relatório, afirma ter corrigido os problemas restantes na **1.1.19-rc.13**. O Jepsen não avaliou essa versão nem as posteriores. O histórico do produto já lista a **1.1.19-rc.16**, de 30 de outubro, ainda como candidata a lançamento. Diante dos resultados que obteve, o Jepsen recomenda interromper novas implantações, migrar para outros bancos e conferir ou reconstruir o estado a partir de fontes confiáveis, quando disponíveis.

O relatório trata do banco refatorado e é uma investigação distinta da [análise anterior do Orkes Conductor](/2026/emudhra-confianca-tls-jepsen-tarefas-sem-execucao/). Segundo a Orkes, os clientes que permaneceram na versão **1.0.0** provavelmente ficaram fora dos problemas mais graves da linha 1.1. Os testes breves dessa versão antiga tiveram resultados melhores, com alcance limitado e sem avaliar replicação.

Fontes: [análise do Jepsen, resultados e limites dos testes](https://jepsen.io/analyses/particledb-1.1.4) e [histórico de versões do ParticleDB](https://particledb.ai/installation/releases/).

## Jülich liga checagens sincronizadas de baterias a oscilações na rede elétrica

O centro de pesquisa **Forschungszentrum Jülich divulgou em 30 de outubro** uma investigação sobre oscilações que se repetem a cada minuto na rede elétrica. A equipe encontrou uma causa em grandes sistemas de baterias: os equipamentos verificam seu estado de carga no começo de cada minuto. Quando essas atividades coincidem, produzem picos de consumo e pequenas quedas na frequência da rede.

As medições cobriram **80 locais do campus**. O padrão apareceu nos pontos com baterias que mantêm a alimentação sem interrupções; a inspeção de um desses sistemas confirmou o pico ligado à checagem. Outros aparelhos controlados digitalmente também podem contribuir para o fenômeno, segundo os pesquisadores.

As oscilações observadas **não eram críticas para a segurança da rede**, mas podem aumentar o desgaste de turbinas, que desaceleram e voltam a acelerar. A proposta é distribuir as verificações aleatoriamente ao longo do tempo. Em software, a mesma ideia ajuda a entender o *jitter*: uma variação aleatória no horário de tarefas periódicas para evitar que muitos clientes concentrem a carga no mesmo instante.

Fonte: [Jülich — investigação e proposta de reduzir a sincronização](https://www.fz-juelich.de/en/news/archive/press-release/2026/mystery-of-60-second-fluctuations-in-power-grids-solved).

## LXD e MicroCloud corrigem falha que permitia assumir a identidade de um cliente confiável

A Canonical pede atualização do **LXD e do MicroCloud**, ferramentas para gerenciar contêineres, máquinas virtuais e infraestrutura em cluster. O aviso de **28 de outubro**, complementado pelo registro da **CVE-2026-112816 em 30 de outubro**, descreve uma falha na autenticação por certificado. Um atacante capaz de alcançar a API HTTPS e obter o certificado público de um cliente confiável podia assumir essa identidade sem possuir a chave privada correspondente.

O problema estava na verificação de confiança: o servidor aceitava como identidade um certificado enviado pelo cliente sem exigir a prova de posse da chave daquele certificado. Dependendo dos privilégios da identidade, o acesso pode chegar a **root, o superusuário da máquina hospedeira**. No MicroCloud, o aviso também descreve a exposição envolvendo o certificado de um membro que ingressa no cluster.

As versões snap corrigidas são **LXD 6.10.1, 5.21.9, 5.0.11 e 4.0.15**, conforme o canal utilizado, e **MicroCloud 2.1.5 e 3.4.1**. A Canonical data as correções de **29 de outubro** e informa distribuição progressiva das atualizações do LXD para o canal estável. Atualize no canal da sua instalação e confira a versão efetivamente instalada. O aviso não confirma exploração em ataques reais.

Fontes: [aviso da Canonical e versões corrigidas](https://discourse.ubuntu.com/t/security-advisory-critical-vulnerability-found-in-canonical-lxd-and-microcloud/90557) e [registro da CVE no Ubuntu](https://ubuntu.com/security/CVE-2026-112816).

## VOLTA usa etapa opcional de IA para classificar dados roubados, segundo a Talos

A **Cisco Talos publicou em 31 de outubro** uma análise do VOLTA, malware para Windows que rouba credenciais, sessões e dados de carteiras de criptomoedas. Depois da coleta, uma etapa opcional envia informações a um modelo de linguagem para organizar um perfil da vítima e classificar seus ativos pelo possível valor para o criminoso. O malware também aproveita sessões roubadas para enriquecer esse perfil e envia um relatório ao operador.

A análise descreve uma capacidade do código, sem medir quantas vítimas foram atingidas ou o ganho financeiro dessa etapa. Para quem desenvolve software, o alcance da coleta merece atenção: inclui chaves SSH e configurações de provedores de nuvem, além dos dados do navegador.

Em caso de comprometimento, a Talos recomenda preservar registros úteis à investigação, **revogar tokens potencialmente expostos e trocar senhas**. Como o executável pode se apagar, sua ausência não basta para considerar a máquina limpa.

Fonte: [Cisco Talos — análise do VOLTA e contramedidas](https://blog.talosintelligence.com/appraisal-by-ai-model-driven-victim-prioritization-in-the-volta-infostealer/).

## Destaques rápidos para hoje.

- **Basalt documenta atalhos de inferência que alteram o cálculo e a saída do modelo.** Em medições publicadas em **30 de outubro**, o motor de inferência local explora duas opções para modelos que ativam apenas partes da rede, chamadas de especialistas. Elas favorecem especialistas já na GPU ou deixam de calcular alguns que precisariam ser buscados, reduzindo transferências. Nos testes do autor, a velocidade variou com a configuração; uma delas ficou mais lenta. Foram medições exploratórias em duas GPUs, com uma execução por configuração e ajustes adicionais na decodificação. As opções vêm desligadas e exibem aviso quando ativadas. Quem experimentar deve avaliar também a qualidade nas próprias tarefas. Fonte: [mecanismo, condições e medições do Basalt](https://github.com/jesdga95/basalt/blob/main/docs/precision/routing.md).

- **Futhark melhora a organização das cópias na memória da GPU.** Em texto de **31 de outubro**, o projeto da linguagem para processamento paralelo de arrays explica uma otimização que reorganiza o percurso da cópia conforme a disposição dos dados na memória. Assim, threads vizinhas — unidades de execução da GPU — acessam endereços próximos, permitindo atender mais acessos com menos operações de memória. O ganho nos testes de programas existentes foi modesto: o autor relata até cerca de 10% nos poucos beneficiados. Os saltos maiores vieram de testes específicos de cópia. Fonte: [explicação e medições do Futhark](https://futhark-lang.org/blog/2026-10-31-faster-copying.html).

- **Kwi estreia como experimento de terminal KDE com renderização acelerada por GPU.** Apresentado por Eike Hein em **1º de novembro**, combina a biblioteca `libghostty-vt`, que interpreta o terminal e mantém seu estado, com Qt Quick e Kirigami para a interface. Também oferece um módulo que outras aplicações Qt Quick podem incorporar. Ainda não tem uma versão 0.1.0 marcada e passou por testes limitados; seu anúncio não estabelece uma substituição do Konsole no KDE. Fonte: [apresentação e estado do Kwi](https://blogs.kde.org/2026/11/01/introducing-kwi/).

- **Enlightenment 0.28.0 adiciona integração com NetworkManager e mixer nativo para PipeWire.** A versão de **31 de outubro** amplia o controle de rede e áudio nesse ambiente gráfico, com gerenciamento de conexões salvas e suporte a VPN no novo módulo de rede. Também inclui histórico configurável da área de transferência e limites de carga de bateria. Quem compila o desktop precisa de **EFL 1.29.0 ou posterior**, conforme as notas. Fonte: [lançamento do Enlightenment](https://www.enlightenment.org/news/2026-10-31-enlightenment-0.28.0).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 29943
source_urls:
  - https://jepsen.io/analyses/particledb-1.1.4
  - https://particledb.ai/installation/releases/
  - https://www.fz-juelich.de/en/news/archive/press-release/2026/mystery-of-60-second-fluctuations-in-power-grids-solved
  - https://discourse.ubuntu.com/t/security-advisory-critical-vulnerability-found-in-canonical-lxd-and-microcloud/90557
  - https://ubuntu.com/security/CVE-2026-112816
  - https://blog.talosintelligence.com/appraisal-by-ai-model-driven-victim-prioritization-in-the-volta-infostealer/
  - https://github.com/jesdga95/basalt/blob/main/docs/precision/routing.md
  - https://futhark-lang.org/blog/2026-10-31-faster-copying.html
  - https://blogs.kde.org/2026/11/01/introducing-kwi/
  - https://www.enlightenment.org/news/2026-10-31-enlightenment-0.28.0
-->
