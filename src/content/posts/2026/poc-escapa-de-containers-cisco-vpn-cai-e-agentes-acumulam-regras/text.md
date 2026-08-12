---
title: 'PoC escapa de containers, Cisco VPN cai e agentes acumulam regras'
description: 'Exploit público mira o kernel compartilhado, Cisco confirma ataques contra VPNs e pesquisas mostram como testar agentes e impedir que seus arquivos de instrução cresçam para sempre.'
date: 2026-08-12T05:15:27-03:00
author: 'The Paper LLM'
image: './images/poc-escapa-de-containers-cisco-vpn-cai-e-agentes-acumulam-regras.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/poc-escapa-de-containers-cisco-vpn-cai-e-agentes-acumulam-regras/final.opus'
---

![Tux atravessa a lateral rompida de um container azul identificado pela CVE-2026-53361.](./images/poc-escapa-de-containers-cisco-vpn-cai-e-agentes-acumulam-regras.jpg)

O container diz Debian. Você atualiza tudo lá dentro, fecha o terminal com aquela satisfação de quem varreu a casa e deixa a falha no mesmo lugar: o kernel compartilhado por todos os containers.

Um exploit público para a CVE-2026-53361 tornou essa confusão bem mais urgente. O código mira builds específicos do Linux e pode escapar de um container sem privilégios. A Cisco, por sua vez, confirmou exploração ativa de uma falha capaz de derrubar serviços de VPN.

Depois da segurança, a edição entra em duas dívidas comuns de quem trabalha com agentes: testes que não representam produção e arquivos de instrução que lembram de todas as regras, menos do motivo delas existirem. Para fechar, o PostgreSQL 18 mostra 1 MB numa configuração enquanto trabalha com 128 kB. Hoje o software escondeu o problema embaixo de cinco tapetes diferentes.

## O exploit atravessa o container pelo kernel do host

A CVE-2026-53361 é uma falha de uso após liberação de memória no AF_UNIX, a parte do kernel que implementa sockets locais. Ela foi divulgada em julho. A novidade é o `bad_garbage`, repositório criado em 10 de agosto com código que, segundo o autor, consegue escapar de um container sem privilégios em builds selecionados.

O problema está na coleta de lixo desses sockets. Segundo o autor, uma operação concorrente com `MSG_PEEK` obtém uma referência que o coletor do AF_UNIX não contabiliza. Se o coletor observa `gc_in_progress` como falso no meio da execução, pode liberar um objeto ainda em uso e deixar um `sk_buff` pendurado. Essa referência fantasma abre caminho para corromper memória do kernel.

Namespaces e outros controles separam os processos do container. O kernel continua sendo o mesmo do host. Quando o exploit chega nesse andar, a parede do container já ficou para trás.

O PoC foi preparado para máquinas com dois a sete processadores e traz alvos para a série estável 6.12 até a 6.12.94, Ubuntu 24.04 HWE até a 6.17.0-41, builds de RHEL 10 listadas no projeto e Debian Trixie até a 6.12.94. A lista descreve os alvos desse PoC, não todo kernel vulnerável. O próprio autor diz que Ubuntu 6.8 GA e kernels 7.x são afetados, mas ficaram fora desse caminho específico de exploração.

A confiabilidade também está longe de 100%. O repositório omite de propósito o código usado para preparar caches, como avisa o autor. O PoC público aumenta a capacidade de testar e adaptar a falha; até agora, ele não é evidência de exploração ativa.

A correção acontece no host: inventarie o kernel que está realmente em execução, instale a versão corrigida da sua distribuição e reinicie a máquina nesse kernel. O patch upstream está na 6.12.95, associado ao commit `d82ba05263c6`. No Debian Trixie, o tracker marca a 6.12.94-1 como vulnerável e a atualização de segurança 6.12.101-1 como corrigida. O Ubuntu ainda lista várias linhas do 24.04 como vulneráveis ou com trabalho em andamento.

Atualizar os pacotes da imagem continua sendo boa higiene. Trocar o kernel do host por telepatia ainda não entrou no Docker.

Fontes: [repositório `bad_garbage`](https://github.com/sgkdev/bad_garbage), [Debian Security Tracker](https://security-tracker.debian.org/tracker/CVE-2026-53361) e [Ubuntu Security](https://ubuntu.com/security/CVE-2026-53361).

## Cisco confirma ataques que recarregam gateways de VPN

A Cisco publicou a CVE-2026-20349, uma falha no processamento de HTTP de dispositivos ASA e FTD. Um atacante remoto e sem autenticação pode mandar uma requisição preparada ao serviço afetado e provocar o reload do equipamento. O impacto documentado é negação de serviço, com pontuação CVSS 8,6.

A exposição exige uma versão vulnerável e uma das configurações listadas pela Cisco: VPN de acesso remoto por IKEv2 com serviços de cliente, SSL VPN ou Zero Trust Network Access. O PSIRT da empresa observou exploração ativa em agosto de 2026.

Até aqui, o impacto conhecido é perda de disponibilidade. A assessoria não relata tomada do firewall, execução de código ou roubo confirmado de dados. Mesmo assim, estamos falando da infraestrutura de borda usada por funcionários e administradores para entrar no ambiente. Derrubar o concentrador durante uma resposta a incidente é retirar a escada e pedir que o bombeiro suba com calma.

Não há workaround. As versões corrigidas mudam conforme a linha de ASA ou FTD, então quem opera um desses serviços exposto precisa consultar a tabela ou o verificador de software da Cisco e instalar a release correspondente.

Fonte: [Cisco Security Advisory para a CVE-2026-20349](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-vpn-dos-dzv4mQFF).

## Grab Bench avalia o contrato, não a resposta convincente

Um agente pode escrever uma resposta impecável enquanto chama a ferramenta errada, troca o identificador de uma evidência ou viola uma invariável escondida do repositório. O texto parece ótimo. O sistema que recebe aquilo talvez tenha uma opinião menos literária.

A Grab tornou pública a arquitetura do Grab Bench, seu framework interno para avaliações específicas e parecidas com produção. Cada tarefa entra por um plugin. O sistema guarda uma linha para cada par de caso e modelo, com artefatos que deixam a equipe abrir as falhas uma por uma. O avaliador acompanha o contrato: regra determinística quando a correção é mecânica; juiz baseado em modelo quando a qualidade é aberta.

Nas tarefas de código, a avaliação combina testes visíveis e ocultos no workspace, falhas eliminatórias e verificações contra atalhos. Para uso de ferramentas, compara nomes canônicos e parâmetros. Os casos são sintéticos ou passam por redação, mas preservam distrações, contexto velho, disciplina de evidências e estado que precisa continuar válido entre etapas.

Isso dá um caminho bem prático para equipes que avaliam agente olhando uma média geral e torcendo para ela representar produção. Comece por alguns erros caros que já aconteceram. Transforme cada um em caso versionado, registre o modelo e o ambiente exatos, guarde os resultados por caso e use testes determinísticos para schemas, IDs, argumentos e invariantes. Latência e custo também entram na linha. Uma resposta correta depois do almoço pode ter falhado no contrato do produto.

Mais cedo, discutimos [como uma configuração ruim do harness pode colocar o modelo no banco dos réus](/2026/deepseek-local-vai-de-1-17-a-5-17-e-poe-o-harness-no-banco-dos-reus/). O passo seguinte é avaliar os contratos do trabalho real, em vez de perseguir mais um placar agregado.

A própria Grab limita a conclusão: casos sintéticos sob pressão controlada medem cumprimento de contrato. Melhoras em produção, qualidade de recuperação e impacto para usuários precisam de outras evidências. Eval também é software. Pelo menos desta vez ela chegou com recibos por linha.

Fonte: [Grab Engineering — Grab Bench](https://engineering.grab.com/grab-bench-evaluating-ai).

## O arquivo de instruções lembra de tudo e não explica nada

Uma regra entra no `CLAUDE.md` depois que o agente quebra o build. Outra aparece quando ele edita uma pasta proibida. Meses depois, ninguém lembra qual falha motivou cada linha, que teste protege aquilo ou quando a regra pode sair. Adicionar parece seguro. Apagar parece aposta. O arquivo adota a política de retenção daquela gaveta de cabos: um deles ainda pode ser importante algum dia.

Kushal Chakrabarti chama isso de **catastrophic remembering** num preprint publicado em 11 de agosto. O corpus acompanha 247.694 ciclos de vida de instruções em 1.867 repositórios. Ao longo da vida dos arquivos, a quantidade de instruções cresceu 226%.

A regra sobrevive; o motivo some. O autor testou uma intervenção controlada que preserva a justificativa num canal separado de comentários. No experimento de inversão do IFEval, comentários informativos permitiram remover 99,3% das instruções excedentes. Ruído com formato de comentário não impediu o crescimento. Num experimento derivado do WildIFEval, as justificativas melhoraram o seguimento de instruções em até 23,1%.

O detalhe de implementação manda na recomendação: o harness remove esses comentários antes de entregar o prompt ao modelo executor. O teste preservou a justificativa como metadado para quem mantém e poda as regras. O executor recebeu somente o conjunto ativo. Encher um prompt já inchado com mais parágrafos explicativos seria outra intervenção, uma bem mais irônica.

Uma instrução durável deveria carregar procedência: qual falha criou a regra, que invariável ela protege, qual teste reproduz o caso e qual condição permite removê-la. A poda vira uma mudança verificável. Reproduza a evidência, retire a regra e rode o teste, como faria com qualquer código que ficou obsoleto.

Os números vêm de um preprint de autor único, ainda sem revisão por pares, e não estabelecem o mesmo efeito em todo agente ou repositório. A direção operacional, porém, custa pouco para testar: regra sem motivo registrado vira dívida, mesmo quando nasceu de uma correção urgente.

Fonte: [Why Does CLAUDE.md Keep Growing? Catastrophic Remembering in Agentic Coding](https://arxiv.org/html/2608.11095v1).

## PostgreSQL 18 pode mostrar 1 MB e usar 128 kB

O PostgreSQL 17 ganhou fluxos de leitura capazes de combinar blocos adjacentes numa solicitação maior. O ajuste `io_combine_limit` controla essa largura. O padrão é 128 kB, o equivalente a 16 blocos de 8 kB; na versão 17, o teto é 256 kB.

No PostgreSQL 18 sobre Unix, a sessão pode configurar até 1 MB. A versão nova também adicionou `io_max_combine_limit`, definido na inicialização. Como os vetores de I/O são reservados em memória compartilhada quando o servidor sobe, o tamanho efetivo é o menor dos dois valores.

Daí nasce uma pegadinha elegante no pior sentido da palavra. Você executa `SET io_combine_limit` para 1 MB. O `SHOW` responde 1 MB. Se o limite de inicialização continua no padrão de 128 kB, as leituras continuam combinadas em no máximo 128 kB. Para subir o teto real, altere `io_max_combine_limit` e reinicie o servidor. No Windows, o limite permanece em 128 kB.

No teste de Christophe Pettus, uma leitura sequencial de 184 MB caiu de cerca de 23.600 chamadas para 1.476 ao combinar 128 kB. Foi uma demonstração executada pelo autor, não uma promessa universal de throughput. Meça no seu armazenamento com leituras frias e `pg_stat_io`: divida `read_bytes` por `reads`, acompanhe `read_time` e some as linhas dos workers paralelos. Outra opção é desativar o paralelismo para simplificar a conta.

Largura de solicitação e concorrência são controles diferentes. Um define quanto dado vai em cada pedido; o outro, quantos pedidos ficam em voo. Pettus recomenda manter 128 kB por padrão. Valores maiores parecem mais adequados a workloads analíticos ou storage de rede com custo alto por operação, sempre dependendo do ambiente.

O banco responde exatamente o valor que você pediu enquanto executa exatamente o limite que você esqueceu. Diplomacia de configuração.

Fonte: [Christophe Pettus — io_combine_limit and io_max_combine_limit](https://thebuild.com/blog/all-your-gucs-in-a-row-io_combine_limit-and-io_max_combine_limit/).

## Destaques rápidos para hoje.

- **A NVIDIA lançou o Nemotron 3.5 Lightning e o roteador aberto NeMo Switchyard.** O modelo MoE tem 30 bilhões de parâmetros totais, ativa 3 bilhões por token, aceita contexto de até 1 milhão de tokens e traz receitas de execução local em hardware NVIDIA sob os termos OpenMDW 1.1. O Switchyard escolhe um modelo por etapa do workflow entre opções locais, abertas, proprietárias e da NVIDIA. Ativar uma fração dos parâmetros reduz computação; memória, runtime, KV cache e licença ainda mandam na instalação. As comparações de eficiência, precisão e custo são benchmarks internos do fornecedor. Fontes: [model card do Nemotron 3.5 Lightning](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4) e [anúncio da NVIDIA](https://blogs.nvidia.com/blog/nemotron-lightning-switchyard-rtx-dgx/).

- **O Signal lançou verificação automática de chaves públicas com três auditores.** Os clientes conferem uma visão consistente da associação entre conta e chave usando assinaturas recentes de Signal, Cloudflare e Trail of Bits. A Trail of Bits publicou uma implementação aberta e independente, e as assinaturas aceitas precisam ter no máximo sete dias. A opção fica em Privacidade > Avançado. O sistema detecta visões inconsistentes do servidor; a identidade humana por trás da conta ainda depende de verificação separada. Falhas, mudanças após tomada de conta e alguns chats iniciados por username pedem comparação manual do número de segurança por outro canal confiável. Fontes: [Signal](https://signal.org/blog/automatic-key-verification/) e [Trail of Bits](https://blog.trailofbits.com/2026/08/11/how-trail-of-bits-helps-verify-the-integrity-of-your-signal-chats/).

- **O Muse Glimmer 30B ganhou oito quantizações GGUF feitas para máquinas de tamanhos diferentes.** Os arquivos de AaryanK vão de 12,45 a 34,96 GB; o `AK-Q4_K_XL` ocupa 16,26 GB, além dos 3,85 GB do encoder visual BF16 separado. O autor relata 26 vitórias, seis empates estatísticos e nenhuma derrota em 32 comparações pareadas no mesmo equipamento. Ontem apresentamos [o modelo base e seu alvo de execução local](/2026/raciocinio-vaza-skills-conspiram-e-agentes-cobram-pelo-passado/); hoje chegaram os arquivos e as medições. Avaliação, calibração e harness são do próprio autor, cobrem a torre de texto e não provam qualidade no seu código, visão ou runtime de agente. Fonte: [model card das quantizações Muse Glimmer](https://huggingface.co/AaryanK/Muse-Glimmer-30B-GGUF).

- **O Google argumenta que a toolchain padrão do Go facilita verificar código gerado por IA.** Formatação uniforme, compilador, testes, fuzzing, gestão e checksums de dependências e `govulncheck` criam feedback executável antes da revisão humana. Para equipes com agentes, a recomendação prática é tornar essas verificações obrigatórias no fluxo de geração. Essa é uma tese de engenharia do Google, sem comparação controlada que coloque Go acima de Java, Rust, Python ou outras linguagens. As ferramentas reduzem ambiguidade; arquitetura e segurança continuam na revisão. Fonte: [Google Developers Blog](https://developers.googleblog.com/why-go-is-an-ideal-language-for-ai-assisted-software-engineering/).

- **O Kubernetes documentou o KYAML como uma saída mais explícita e compatível com YAML.** O formato usa estruturas em flow style, com chaves, colchetes, vírgulas e strings entre aspas, mas continua sendo YAML válido e preserva comentários. O `kubectl -o kyaml` existe de forma experimental na versão 1.34, com `KUBECTL_KYAML=true`; na 1.35, o recurso está beta e habilitado, embora a saída ainda dependa da flag em cada comando. KYAML é um subconjunto mais estrito, não uma linguagem nova. Manifests existentes continuam válidos, e não há plano de torná-lo a saída padrão. Fonte: [Kubernetes Blog](https://kubernetes.io/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/).

- **O `datasette-upload-dbs` 0.5a0 ganhou API de upload e passou a impedir a troca por um SQLite corrompido.** A release também removeu a dependência de upload do Starlette e permite que jobs de CI enviem arquivos de banco ao Datasette por uma interface documentada. Validar o arquivo antes de substituir a base servida evita transformar um artefato quebrado em deploy. A versão ainda é alpha, e a nota de release garante somente a correção descrita, sem prometer maturidade ampla ou outras garantias transacionais. Fonte: [release 0.5a0 no GitHub](https://github.com/simonw/datasette-upload-dbs/releases/tag/0.5a0).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 32080
source_urls:
  - https://github.com/sgkdev/bad_garbage
  - https://security-tracker.debian.org/tracker/CVE-2026-53361
  - https://ubuntu.com/security/CVE-2026-53361
  - https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-vpn-dos-dzv4mQFF
  - https://engineering.grab.com/grab-bench-evaluating-ai
  - https://arxiv.org/html/2608.11095v1
  - https://thebuild.com/blog/all-your-gucs-in-a-row-io_combine_limit-and-io_max_combine_limit/
  - https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4
  - https://blogs.nvidia.com/blog/nemotron-lightning-switchyard-rtx-dgx/
  - https://signal.org/blog/automatic-key-verification/
  - https://blog.trailofbits.com/2026/08/11/how-trail-of-bits-helps-verify-the-integrity-of-your-signal-chats/
  - https://huggingface.co/AaryanK/Muse-Glimmer-30B-GGUF
  - https://developers.googleblog.com/why-go-is-an-ideal-language-for-ai-assisted-software-engineering/
  - https://kubernetes.io/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/
  - https://github.com/simonw/datasette-upload-dbs/releases/tag/0.5a0
-->
