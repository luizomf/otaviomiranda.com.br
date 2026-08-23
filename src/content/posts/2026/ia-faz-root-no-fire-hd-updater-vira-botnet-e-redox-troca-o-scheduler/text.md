---
title: 'IA faz root no Fire HD, updater vira botnet e Redox troca o scheduler'
description: 'Agentes adaptam uma falha conhecida a um tablet, centrais automotivas entram numa rede de proxies e medições melhoram pipelines, escalonamento e memória de parser.'
date: 2026-08-23T15:50:37-03:00
author: 'The Paper LLM'
image: './images/ia-faz-root-no-fire-hd-updater-vira-botnet-e-redox-troca-o-scheduler.jpg'
---

![Fire HD desenterrado em uma bancada arqueológica, com root na tela e a CVE ao lado.](./images/ia-faz-root-no-fire-hd-updater-vira-botnet-e-redox-troca-o-scheduler.jpg)
Um Fire HD de 2021 ficou parado numa versão antiga do Fire OS. Em quatro dias de agosto, três modelos de IA ajudaram o dono a adaptar uma falha conhecida àquele aparelho até conseguir root repetidamente. Foram binários, offsets, tabelas de páginas, revisão entre modelos e mais de 500 tentativas. O velho “isso exige conhecimento muito específico” acaba de ganhar uma nota de rodapé cara.

A segurança também foi parar no painel do carro, onde um atualizador privilegiado virou canal para uma botnet. Depois a conversa muda de clima, mas continua girando em torno da mesma pergunta: o que “funcionou” quer dizer na prática? Uma pipeline brasileira só aceita a saída que a próxima etapa consegue usar, o Redox mede um scheduler mais justo e um parser encolhe cada nó de 232 para 16 bytes.

## Agentes adaptaram uma falha conhecida ao Fire HD 10

Eric Pardee conta que seu Fire HD 10 de 2021 ainda rodava o Fire OS 7.3.2.6. O Kimi K3 analisou o kernel dessa versão e encontrou a CVE-2022-38181, uma falha de use-after-free no driver de GPU Mali capaz de dar root ou expor informações. A CISA mantém a vulnerabilidade no catálogo de falhas conhecidas e exploradas desde 30 de março de 2023. Segundo Pardee, a Amazon levou a correção ao Fire OS 7.3.2.9 em junho de 2024.

Use-after-free acontece quando o kernel continua apontando para uma região de memória que já foi liberada. Se outro conteúdo controlado ocupar aquele espaço, a referência velha pode acabar lendo ou escrevendo onde não deveria. No caso relatado, o exploit conseguiu escrever na memória física pela GPU, desativou a imposição do SELinux e substituiu as credenciais do processo para chegar a root.

Essa frase arrumadinha esconde o inferno habitual. O exploit precisava casar com o binário exato, os offsets daquele firmware e o formato de tabela de páginas do MediaTek. Houve travamentos, reinicializações físicas, revisão entre modelos e passagem de bastão do Kimi K3 para o GLM-5.2 e depois para o GLM-5.3. “Firmware archaeology” nem precisa de tradução: é cavar o passado até encontrar o offset que parou de explodir o tablet.

Pardee diz que o Kimi trabalhou por cerca de 30 horas, trocou 621 mensagens e custou US$ 164,25. O GLM-5.2 acrescentou US$ 21,90. O GLM-5.3 concluiu a etapa final em 8 horas e 5 minutos dentro de uma assinatura de US$ 80. Entre 13 e 16 de agosto, foram mais de 500 tentativas do exploit e um gasto total relatado de US$ 266,15.

Com root, Pardee removeu pacotes da Amazon do usuário principal usando `pm uninstall --user 0`. A partição protegida do sistema continuou intacta. O resultado vale para aquele Fire HD 10, naquela build, com offsets específicos. É uma saga reproduzida no mesmo aparelho, não um script pronto para sair fazendo root em qualquer tablet.

Também convém manter o calendário no lugar: os modelos adaptaram uma vulnerabilidade pública de 2022, já corrigida upstream. Não descobriram um zero-day. Ainda assim, conseguiram ajudar na inspeção de binários e na adaptação de um exploit a firmware desatualizado, com revisão cruzada, validação específica e várias visitas ao botão de ligar.

Para quem mantém produto, a parte desconfortável é o atraso do patch. Para quem usa o aparelho, a defesa é bem menos cinematográfica e bem mais barata que US$ 266,15: instalar a versão corrigida pelo fornecedor.

Fontes: [relato técnico de Eric Pardee](https://ericpardee.github.io/fire-hd-ownership/) e [catálogo KEV da CISA](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json).

## O atualizador da central automotiva virou distribuidor de malware

A Kaspersky reconstruiu uma cadeia de malware em três estágios entregue pelo TWCore, aplicativo de sistema que atualiza centrais automotivas Android da DoFun. A empresa descobriu a atividade em junho e publicou a análise em 21 de agosto. Segundo a equipe, é o primeiro caso documentado de uma cadeia de infecção criada especificamente para centrais desse tipo.

O problema começa justamente na autoridade do atualizador. O TWCore recebe instruções de APK por MQTT, e a opção `installNotExists` permite instalar um pacote que ainda não existe no aparelho. A telemetria analisada pela Kaspersky associou instalações do malware ao pacote legítimo `com.tw.core`.

Alguém convenceu o porteiro privilegiado a carregar outra porta para dentro. Funcionou.

A cadeia passa por um dropper chamado JarService, um segundo downloader e, no fim, componentes usados para fraude de cliques e proxy reverso. A central nem precisa guardar o segredo da sua vida para interessar à botnet. Conectividade persistente, energia externa e tráfego saindo por um endereço aproveitável por terceiros já bastam.

A Kaspersky atribui a operação com alta confiança ao MoYu Group, associado à campanha BADBOX. Tanto a autoria quanto o caráter de “primeiro caso” são conclusões da própria equipe de pesquisa. O relatório não traz uma contagem de aparelhos afetados por modelo e não sustenta generalizações sobre todas as centrais Android ou sobre o Android Automotive inteiro.

A DoFun informou à Kaspersky que corrigiu os problemas depois da notificação. Para fabricantes e operadores de frota, o updater precisa ser tratado como uma fronteira de root remoto: mensagens e artefatos autenticados, identidades de pacote restritas, instalações registradas e correção do fornecedor aplicada. Um atualizador autorizado a instalar qualquer identidade de APK já é uma loja de aplicativos. Só esqueceram da vitrine, do caixa e da segurança.

Fonte: [Securelist, da Kaspersky](https://securelist.com/android-head-unit-malware/121106/).

## Uma pipeline só aceita o arquivo que a próxima etapa consegue usar

Iago Cavalcante publicou em 23 de agosto o postmortem de uma pipeline de extração de áudio e vídeo para receitas. O primeiro desenho dependia de um provedor. Na versão de produção, o sistema pede uma capacidade e percorre uma fila ordenada de candidatos. A taxa real de sucesso define a ordem; o preço serve como desempate.

Assim, nomes e manias de fornecedores não vazam pela regra de negócio, e a ordem pode mudar conforme as medições. O mundo real, como sempre, se recusou a ler a documentação. O relato não publica os nomes dos provedores, o volume de tráfego nem as taxas observadas, então temos uma experiência de produção, não um ranking de APIs.

O bug mais caro veio de um “sucesso”. Um provedor deixava o log verdinho e baixava arquivos que às vezes eram vídeos parciais ou imagens sem som. A função retornou sem erro. A próxima etapa recebeu um peso de papel digital.

A correção foi validar a pós-condição no ponto de consumo. Se a etapa seguinte não consegue usar o arquivo, a pipeline tenta o próximo candidato da fila. Transporte bem-sucedido diz que a função retornou; sucesso semântico diz que o trabalho pode continuar. É esse segundo contrato que paga a conta.

E há uma conta de verdade envolvida. Como os jobs têm entrega de pelo menos uma vez, o mesmo trabalho pode cair em dois workers. Uma checagem local de “já fiz isso?” pode correr contra outra execução. Unicidade e transação no banco precisam impedir resultado duplicado e cobrança repetida. Se todos os candidatos falharem de forma permanente, o crédito volta para o cliente.

O desenho serve para outras integrações instáveis: fornecedores ficam atrás da capacidade, métricas observadas ordenam a fila, o consumidor valida a saída e o banco arbitra a idempotência. O log verde pode comemorar sozinho. A fatura não precisa entrar na festa.

Fonte: [Iago Cavalcante no TabNews](https://www.tabnews.com.br/iagocavalcante/pipeline-de-extracao-de-audio-e-video).

## Redox troca a fila global por EEVDF e distribui CPU com mais justiça

O Redox OS publicou em 22 de agosto os resultados da troca do Deficit Weighted Round Robin por um scheduler baseado em EEVDF. O trabalho do Redox Summer of Code também substituiu a fila global de processos executáveis por filas separadas por núcleo e removeu buscas lineares de caminhos importantes.

O EEVDF acompanha quanto tempo de CPU cada tarefa deveria ter recebido e quanto recebeu de fato. Essa diferença é o lag. Tarefas com lag não negativo ficam elegíveis; entre elas, o scheduler escolhe aquela com o prazo virtual mais próximo. Os pesos apertam ou afrouxam esses prazos, distribuindo serviço sem deixar tarefas de peso menor passando fome.

No teste publicado pelo projeto com 16 processos ocupando CPU, o scheduler antigo teve variância de 389% a 617% em quatro núcleos. Com EEVDF, o intervalo caiu para 1,09% a 1,37%. O Redox resumiu a diferença como uma melhora de 782 vezes na justiça da distribuição.

Em uma carga cheia de esperas e despertares, o EEVDF chegou a 107.945 ciclos de ida e volta por segundo em um núcleo e 109.386 em quatro. O DWRR anterior registrou 2.197 e 765, respectivamente. Depois da mudança para filas por núcleo, a troca voluntária de contexto caiu de 2 microssegundos para 350 nanossegundos. O projeto também destaca um ganho geral de throughput de 2,6 vezes.

Esses números comparam o Redox atual ao Redox anterior. O próprio relatório avisa que a comparação com Linux não é equivalente: Linux rodou direto no hardware, enquanto Redox estava no QEMU. E parte do ganho veio das filas por núcleo e da remoção das varreduras lineares, além da matemática do EEVDF.

Mesmo dentro desses limites, saiu uma bela aula de scheduler em forma de patch. Medir dívida de CPU melhora a justiça, tirar a fila global reduz contenção e parar de procurar trabalho linearmente faz uma diferença brutal quando as tarefas vivem acordando. Algoritmo bom trabalha melhor quando a estrutura de dados para de puxá-lo pela camisa.

Fonte: [relatório RSoC do Redox OS](https://www.redox-os.org/news/rsoc-eevdf/).

## Um nó de Markdown caiu de 232 para 16 bytes

No relatório técnico publicado em 22 de agosto, Krzysztof Kowalczyk partiu de uma estrutura C++ gerada por IA para representar todos os tipos de nó de uma árvore de Markdown. Funcionava. Também reservava, em cada nó, espaço para oito strings, dois vetores, posições, booleanos e padding, mesmo quando quase nada disso era usado. Cada nó custava 232 bytes.

A primeira decisão foi alinhar a memória ao tempo de vida da árvore. Como todos os nós pertencem ao mesmo documento e podem morrer juntos, um bump arena reserva memória em sequência e libera tudo de uma vez. A base estável permitiu trocar ponteiros de 64 bits por offsets de 32 bits. Strings passaram a guardar offset e comprimento compactados; os outros campos foram reorganizados e especializados. No fim, o nó ficou com 16 bytes.

Kowalczyk não declarou vitória olhando apenas para `sizeof(Node)`. Ele mediu a arena inteira em quatro entradas sintéticas de 64 KB: prosa, listas aninhadas, tabelas GFM e entidades. Na linha de base de prosa, a alocação total foi de 1.646,1 KB, ou 25,7 vezes o tamanho da fonte. É assim que se evita aquela dieta em que a struct emagrece e a memória escondida come tudo atrás da cortina.

A compactação cobra seu preço. Um offset de 32 bits limita o espaço da arena que pode ser endereçado diretamente, e todas as referências compactadas dependem da mesma base e do mesmo tempo de vida. Os resultados pertencem àquele parser e àquelas quatro formas sintéticas de entrada, não a um campeonato universal de Markdown.

O método viaja melhor que os números: medir a alocação completa, observar os campos usados por cada variante, aproximar dados acessados juntos e comprimir referências quando o domínio deixa. Código gerado pode estar correto e ainda estacionar oito strings vazias em cada nó. A IA entregou a AST; a engenharia foi conferir quanto ela cobrava de aluguel.

Fonte: [Krzysztof Kowalczyk, “Optimizing memory use in a Markdown parser”](https://blog.kowalczyk.info/a-n8wf/optimizing-memory-use-in-markdown-parser.html).

## Destaques rápidos para hoje.

- **Agent Lightning v1.0 separa o agente em produção do backend de treinamento.** O framework de cerca de 3.500 linhas mantém ferramentas, contexto e interação com o ambiente no harness existente, enquanto o trainer observa as sequências de requisição e resposta do modelo. Os autores dizem que o Qwen3.5-9B subiu de 41,8% para 56,4% no SWE-bench Verified com 6 mil exemplos e publicaram os scripts desse fluxo. Tanto o benchmark quanto o “compute modesto” são claims do paper de 18 de agosto; o resumo não informa esse compute em horas de hardware nem permite transformar o resultado em promessa geral de custo. Fonte: [paper do Agent Lightning v1.0 no arXiv](https://arxiv.org/abs/2608.17528).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 24878
source_urls:
  - https://ericpardee.github.io/fire-hd-ownership/
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://securelist.com/android-head-unit-malware/121106/
  - https://www.tabnews.com.br/iagocavalcante/pipeline-de-extracao-de-audio-e-video
  - https://www.redox-os.org/news/rsoc-eevdf/
  - https://blog.kowalczyk.info/a-n8wf/optimizing-memory-use-in-markdown-parser.html
  - https://arxiv.org/abs/2608.17528
-->
