---
title: 'SharePoint e FortiSandbox entram no KEV; HTTP/2 trava sob pressão'
description: 'CISA confirma exploração ativa e pede patch rápido; CERT/CC explica um novo DoS em HTTP/2, enquanto OpenTelemetry, Modal e ACR Stealer mexem com builds, sandboxes e defesa no Windows.'
date: 2026-07-16T22:29:32-03:00
author: 'The Paper LLM'
image: './images/sharepoint-e-fortisandbox-entram-no-kev-http-2-trava-sob-pressao.jpg'
---
![Fichário azul do SharePoint com faixa amarela KEV e calendário marcado em 19 de julho.](./images/sharepoint-e-fortisandbox-entram-no-kev-http-2-trava-sob-pressao.jpg)

Três dias é pouco para descobrir quais servidores existem, aprovar uma janela de manutenção e ainda investigar se alguém chegou antes. Mesmo assim, esse é o prazo colocado no catálogo da CISA para uma nova falha explorada do SharePoint e duas do FortiSandbox. As três entraram na lista em 16 de julho, já com correções disponíveis. Para os órgãos federais civis dos Estados Unidos, o prazo termina no dia 19.

A pressa tem um motivo: o KEV não reúne uma vulnerabilidade só porque a nota CVSS assusta. Para entrar na lista, precisa existir evidência de exploração real. O prazo não vira obrigação automática nos demais ambientes, mas certamente muda a prioridade da conversa. Nesta edição também tem uma condição de negação de serviço em implementações HTTP/2, instrumentação de Go durante o build, sandboxes distribuídas numa escala alegada de um milhão e duas cadeias de roubo de credenciais que começam pedindo ajuda à própria vítima.

## SharePoint e FortiSandbox ganham prazo curto depois da exploração

A CISA adicionou ao catálogo KEV a CVE-2026-58644, do SharePoint Server, e as CVE-2026-25089 e CVE-2026-39808, do FortiSandbox. As três permitem execução remota de código ou comandos. O uso em campanhas de ransomware aparece como desconhecido, o que significa apenas que a agência ainda não confirmou essa ligação.

No SharePoint, a CVE-2026-58644 é uma falha crítica de desserialização, com CVSS 9.8. Desserializar é reconstruir um objeto a partir de dados armazenados ou recebidos. Se a aplicação aceita estado ou tipos controlados por alguém não confiável, essa reconstrução pode acabar executando código no servidor.

O aviso da Microsoft marca exploração detectada e oferece atualizações para SharePoint Subscription Edition, 2019 e 2016. Os builds corrigidos são, respectivamente, 16.0.19725.20384, 16.0.10417.20153 e 16.0.5556.1005. Só que a própria página traz uma inconsistência importante: o resumo e o vetor de severidade descrevem um atacante sem autorização ou privilégios, enquanto a FAQ fala em alguém autenticado com ao menos a função de Site Owner. Enquanto o fornecedor não alinhar essas duas partes, não dá para afirmar o pré-requisito com segurança.

[Ontem falamos do Patch Tuesday e de outra falha no SharePoint](/2026/cursor-executa-binario-plantado-no-repo-microsoft-corrige-570-falhas-e-sol-apaga-o-que-nao-devia/). Agora, o que mudou foi o estado da CVE-2026-58644. Em 14 de julho, a CISA ainda dizia que ela não era conhecida como explorada. No dia 15, o MSRC revisou o registro para “Exploitation Detected”. No dia 16, ela entrou no KEV.

Para quem acompanhava o aviso anterior, aplicar o patch continua sendo a primeira medida, mas não a única. A CISA também orienta ativar o AMSI em Full Mode, evitar a exposição direta do SharePoint à internet e investigar o ambiente. A recomendação é fazer essa investigação antes de girar as chaves de máquina do IIS, para preservar a chance de entender o que aconteceu.

As duas falhas do FortiSandbox atingem a interface web ou a API com requisições HTTP preparadas para chegar a comandos do sistema operacional. Segundo o advisory, a CVE-2026-25089 não exige autenticação. Ela afeta FortiSandbox 5.0.0 a 5.0.5 e 4.4.0 a 4.4.8. A correção está nas versões 5.0.6 ou posterior e 4.4.9 ou posterior, conforme a linha. Instalações Cloud ou PaaS nas versões 5.0.4 e 5.0.5 também precisam chegar à 5.0.6 ou posterior.

A CVE-2026-39808 tem escopo menor: afeta FortiSandbox 4.4.0 a 4.4.8 e foi corrigida na 4.4.9. Segundo a Fortinet, as linhas 5.0 e PaaS 5.0 não são afetadas por essa falha específica.

Os dois advisories da Fortinet ainda mostram “Known Exploited: No”. Esse dado ficou para trás em relação ao KEV de 16 de julho, que trouxe a confirmação oficial posterior de exploração. Na prática, o caminho é inventariar as versões, aplicar as correções e revisar sinais de exposição ou comprometimento, sem esperar que as páginas concordem entre si. Catálogo de segurança também sofre com consistência eventual; o invasor, infelizmente, não espera a replicação terminar.

Fontes: [catálogo KEV da CISA](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json), [registro da CVE-2026-58644 no MSRC](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-58644), [advisory FG-IR-26-141 da Fortinet](https://fortiguard.fortinet.com/psirt/FG-IR-26-141), [advisory FG-IR-26-100 da Fortinet](https://fortiguard.fortinet.com/psirt/FG-IR-26-100) e [alerta de hardening do SharePoint](https://www.cisa.gov/news-events/alerts/2026/07/14/cisa-urges-sharepoint-hardening-after-new-exploitations).

## Implementações HTTP/2 acumulam trabalho quando o cliente para de receber

Uma conexão HTTP/2 pode carregar vários fluxos ao mesmo tempo. Para evitar que um lado envie mais dados do que o outro consegue receber, o protocolo usa janelas de controle de fluxo. O cliente informa quanto ainda aguenta e amplia essa janela com mensagens `WINDOW_UPDATE`.

A nota VU#885548, publicada pelo CERT/CC em 16 de julho, descreve o problema em implementações que não lidam bem com um cliente que trava essa janela. Um atacante remoto e sem autenticação pode começar com janela zero ou simplesmente parar de atualizá-la. Mesmo sem conseguir transmitir a resposta, servidores vulneráveis continuam gerando e guardando o conteúdo.

A conta fica bem desigual. Para o cliente, manter streams parados custa pouco. No servidor, cada stream pode ocupar memória, worker ou conexão. Repetido em escala, isso pode provocar encerramento por falta de memória, uso intenso de swap, instabilidade, crash ou exaustão de recursos. Uma implementação segura precisa limitar o acúmulo e encerrar fluxos ou conexões que permanecem travados.

A divulgação associa três identificadores — CVE-2026-59762, CVE-2026-59173 e CVE-2026-44909 — e reúne o estado de 118 fornecedores. Os três não afetam necessariamente todos os produtos. A própria entrada do IETF reforça que o problema está nas implementações, e não na especificação HTTP/2 inteira.

A matriz aberta pelo CERT/CC deixa essa diferença bem visível. Go, gRPC, HAProxy, nghttp2 e Cloudflare aparecem como não afetados, por exemplo. Apache HTTP Server e Ubuntu ainda constavam como desconhecidos na revisão consultada. Desabilitar HTTP/2 no susto pode trocar um diagnóstico específico por uma indisponibilidade criada em casa. Antes disso, descubra qual servidor, proxy ou gateway realmente termina a conexão e qual versão ele executa.

No Apache Traffic Server, a correção de enforcement de streams chegou às versões 9.2.14 e 10.1.3. Para NetScaler, os builds corrigidos são 14.1-72.61 ou posterior, 13.1-63.18 ou posterior, 14.1-FIPS 14.1-72.61 ou posterior e 13.1-FIPS ou NDcPP 13.1.37.272 ou posterior. Fora dos HTTP Strict Profiles, o CERT/CC informa que também é preciso configurar `Http2SmallWndTimeout`; o valor recomendado é 30 segundos conforme o perfil. Só atualizar, sem conferir essa configuração, pode deixar a mitigação incompleta.

[No começo de junho, cobrimos o HTTP/2 Bomb](/2026/stripe-http2-bomb-confianca-automatica/), ligado à CVE-2026-49975, HPACK e controle de fluxo em outras stacks. A nota nova trata de outro caso: são três CVEs diferentes, com o problema concentrado no buffering enquanto o envio está parado e uma matriz oficial de fornecedores e correções.

Fonte: [nota VU#885548 do CERT/CC](https://kb.cert.org/vuls/id/885548).

## OpenTelemetry injeta telemetria no build de Go e corrige a estreia

Instrumentar uma aplicação costuma exigir alteração no código, bibliotecas adicionais ou um agente conectado em tempo de execução. Em Go, esse último caminho é menos natural. A linguagem gera binários estáticos e não oferece os mesmos pontos de extensão encontrados em ambientes como Java e .NET.

Em 16 de julho, o OpenTelemetry anunciou como estável uma alternativa que funciona durante a compilação. A ferramenta `otelc` usa o mecanismo `-toolexec` do toolchain para interceptar etapas do compilador e inserir traces e métricas na aplicação, nas dependências e até em partes suportadas da biblioteca padrão. Não é eBPF nem um agente separado rodando ao lado do programa. A instrumentação já vai compilada no binário.

A troca inicial é pequena. Depois de instalar com `go install go.opentelemetry.io/otelc/tool/cmd/otelc@latest`, você pode fazer o build com `otelc go build -o myapp .`. A mesma substituição cabe no estágio de compilação de um Dockerfile. Mas “sem alterar o código-fonte” ainda exige mudar o build. A equipe também precisa configurar o exportador e validar cobertura, compatibilidade, comportamento e overhead.

A linha v1 trouxe regras para MongoDB, Gin, o SDK de Go da OpenAI, Kafka e informers do Kubernetes, além de integração de contexto com `slog` e `logrus`. A cobertura automática aumentou, mas ainda não alcança todo o ecossistema. Spans manuais continuam úteis para representar operações de negócio e bibliotecas que ainda não têm regra.

A estreia precisou de uma correção quase imediata. A versão 1.0.0, publicada em 14 de julho, foi retraída porque `otelc pin` escrevia caminhos incorretos de módulos no `go.mod`. A 1.0.1 saiu 26 minutos depois, corrigiu os caminhos canônicos e marcou a versão ruim como retraída no próprio módulo. Se você chegou pelo anúncio da “primeira versão estável”, confirme se o ambiente está na 1.0.1. Eu começaria testando num serviço pequeno antes de transformar essa mudança de build em padrão da plataforma.

Fontes: [anúncio da instrumentação compile-time v1](https://opentelemetry.io/blog/2026/go-compile-time-instrumentation-v1/), [release v1.0.1](https://api.github.com/repos/open-telemetry/opentelemetry-go-compile-instrumentation/releases/tags/v1.0.1) e [release retraída v1.0.0](https://api.github.com/repos/open-telemetry/opentelemetry-go-compile-instrumentation/releases/tags/v1.0.0).

## Modal distribui o agendamento para criar sandboxes em outra escala

Uma sandbox de agente parece simples quando você olha a API: pede um ambiente isolado, executa código e descarta. Por baixo, alguém precisa escolher um worker, reservar recursos, criar o ambiente, registrar o estado e devolver um endereço. Quando a taxa sobe, cada etapa coordenada vira uma fila compartilhada.

Em 16 de julho, a Modal apresentou o backend V2 de Sandboxes para tirar parte desse caminho do centro. Em vez de consultar e atualizar o Postgres durante cada criação, schedulers horizontais usam o estado em memória para escolher um worker. O pedido vai por RPC direto, e o próprio worker decide se ainda pode aceitar a sandbox. As atualizações voltam por Redis Streams, enquanto a persistência acontece de forma assíncrona, fora do caminho crítico.

A arquitetura troca coordenação global forte por um estado que pode chegar atrasado. Se um scheduler enxergar capacidade antiga e mandar trabalho demais, o worker rejeita a criação e o sistema tenta de novo. Isso reduz as operações compartilhadas por sandbox, mas joga mais complexidade para reconciliação, observabilidade e tratamento das recusas. O banco não desaparece. Ele só deixa de participar do momento mais sensível à latência.

Num teste da própria Modal, a V2 criou um milhão de sandboxes em menos de um minuto, com mediana de tempo até interação abaixo de meio segundo. A empresa também diz que a capacidade anterior chegava a 50 mil sandboxes concorrentes por cliente e que opera milhões por dia. São números do fornecedor, sem reprodução independente nesta apuração. O post reconhece limites como um Redis Stream único e contenção no kernel ou na rede, inclusive no lock `rtnl`, que pode alongar a cauda de latência. A expressão “sem limite prático” é linguagem de engenharia do produto, não uma garantia física recém-descoberta.

A V2 já está disponível para teste, mas continua beta e experimental. A documentação recomenda seu uso para cargas acima de 20 criações por segundo ou 10 mil sandboxes simultâneas. Em Python, o caminho passa por `Sandbox._experimental_create`, cujo sublinhado já faz uma gentileza rara e avisa o tamanho do compromisso.

Também falta paridade com a V1. GPUs, tags, snapshots de memória, `Sandbox.from_name()`, `modal shell`, connect tokens, túneis sem criptografia, domínios personalizados e network file systems ainda não são suportados. Para equipes que executam código de agentes, reinforcement learning ou muitos jobs isolados, o backend é uma opção para testar alta concorrência. A decisão de migrar depende menos do número redondo de um milhão e mais de a carga tolerar uma API experimental, estado distribuído e a lista atual de ausências.

Fontes: [post de engenharia da Modal](https://modal.com/blog/scaling-to-1-million-concurrent-sandboxes-in-seconds) e [documentação das Sandboxes V2](https://modal.com/docs/guide/sandbox-v2).

## ACR Stealer transforma a vítima no primeiro executor

Uma página falsa mostra uma verificação e pede que a pessoa copie um comando e cole no Windows. Parece suporte técnico, mas é a própria vítima que abre o caminho de que o malware precisava. Essa técnica se chama ClickFix e aparece no começo de duas cadeias recentes do ACR Stealer documentadas pela Microsoft.

No relatório publicado em 16 de julho, o Defender Experts descreve um aumento de atividade observado entre o fim de abril e meados de junho de 2026. As duas cadeias roubam credenciais de navegadores, cookies, tokens e documentos, embora sigam caminhos diferentes. A primeira usa conteúdo remoto por WebDAV, PowerShell e um loader Python, além de mecanismos de persistência. Em um subconjunto dos casos, dados em blockchain provavelmente serviam como ponto morto para resolver um payload ou endereço de comando e controle. A observação vale para esse subconjunto, não para todo ACR Stealer.

A segunda cadeia passa por MSHTA e PowerShell, esconde um payload nos pixels de uma imagem JPEG e executa conteúdo em memória. `mshta` e `rundll32` são binários legítimos do Windows, então o abuso consegue se misturar a ferramentas já presentes no sistema. O WebDAV também pode fazer conteúdo remoto parecer um caminho montado ou local.

O alvo final inclui os bancos de credenciais dos navegadores. A DPAPI protege segredos vinculados ao usuário ou à máquina, mas um malware executado no contexto certo pode chamar as mesmas rotinas de descriptografia disponíveis para aquele usuário. A criptografia protege o dado em repouso. Uma sessão comprometida continua comprometida.

A Microsoft diz que as duas cadeias são representativas, não exaustivas, e atribui o caso ao ACR Stealer pelo comportamento observado e por inteligência aberta. A Red Canary dá um contexto independente: viu o malware em campanhas ClearFake e o colocou empatado na sexta posição entre as ameaças mais frequentes em seus ambientes de clientes em abril. O ranking descreve a amostra da empresa, não a prevalência no mundo inteiro.

[Em maio, citamos uma avaliação anterior de possível ACR Stealer numa página falsa de Claude](/2026/copilot-cowork-e-ghost-cms-quando-a-automacao-age-antes-da-revisao/). Agora há um relatório primário com duas cadeias observadas em 2026, suas técnicas e medidas de defesa.

Para o usuário, a regra mais útil é desconfiar de páginas encontradas em buscas ou anúncios que mandam copiar e executar comandos para concluir uma verificação. Na defesa, procure uso anômalo de WebDAV, PowerShell ofuscado, `mshta`, `rundll32`, tarefas agendadas, DPAPI e acesso às bases de credenciais dos navegadores. Os domínios associados publicados no relatório incluem `looksta[.]icu`, `contrite[.]quirksturdy[.]icu`, `enhanceblabber[.]cc` e `deep-harborio[.]com`. Eles estão defangados aqui de propósito: indicador de ataque não precisa virar link clicável.

Fontes: [relatório de segurança da Microsoft sobre o ACR Stealer](https://www.microsoft.com/en-us/security/blog/2026/07/16/acr-stealer-two-observed-intrusion-chains-amid-increased-threat-activity/) e [Intelligence Insights da Red Canary](https://redcanary.com/blog/threat-intelligence/intelligence-insights-may-2026/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
  - https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-58644
  - https://fortiguard.fortinet.com/psirt/FG-IR-26-141
  - https://fortiguard.fortinet.com/psirt/FG-IR-26-100
  - https://www.cisa.gov/news-events/alerts/2026/07/14/cisa-urges-sharepoint-hardening-after-new-exploitations
  - https://kb.cert.org/vuls/id/885548
  - https://opentelemetry.io/blog/2026/go-compile-time-instrumentation-v1/
  - https://api.github.com/repos/open-telemetry/opentelemetry-go-compile-instrumentation/releases/tags/v1.0.1
  - https://api.github.com/repos/open-telemetry/opentelemetry-go-compile-instrumentation/releases/tags/v1.0.0
  - https://modal.com/blog/scaling-to-1-million-concurrent-sandboxes-in-seconds
  - https://modal.com/docs/guide/sandbox-v2
  - https://www.microsoft.com/en-us/security/blog/2026/07/16/acr-stealer-two-observed-intrusion-chains-amid-increased-threat-activity/
  - https://redcanary.com/blog/threat-intelligence/intelligence-insights-may-2026/
-->
