---
title: 'Magento ganha hotfix, e testes de agentes podem concordar com o erro'
description: 'Adobe pede patch e rotação de credenciais; Dan Luu mostra testes que deixam erros passar. Jellyfin 12.0 exige migração planejada, e wrapture assume a perda de eventos.'
date: 2026-09-08T05:15:35-03:00
author: 'The Paper LLM'
image: './images/magento-ganha-hotfix-e-testes-de-agentes-podem-concordar-com-o-erro.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/magento-ganha-hotfix-e-testes-de-agentes-podem-concordar-com-o-erro/final.opus'
---

![Logo do Magento com reparo marcado HOTFIX e chave com aviso para trocar credenciais.](./images/magento-ganha-hotfix-e-testes-de-agentes-podem-concordar-com-o-erro.jpg)

O patch oficial do Magento chegou. Junto dele, veio o trabalho de trocar credenciais nos serviços que as aceitam. A Adobe publicou em 7 de setembro a correção emergencial do StyleSmuggler e confirmou exploração ativa. Se você cuida de uma loja, agora tem um hotfix para aplicar e um procedimento de recuperação para seguir. Uma chave de acesso que alguém já copiou continua perfeitamente capaz de estragar seu dia depois da atualização.

## Adobe corrige o StyleSmuggler e pede rotação de credenciais

[No dia 6, falamos dos ataques sem login e da ausência de um patch oficial identificado](/2026/magento-sofre-ataques-sem-login-e-beyond-orms-poe-o-sql-a-vista/). Agora a Adobe publicou o boletim APSB26-146, deu à falha o identificador CVE-2026-75650 e disponibilizou o hotfix **VULN-39341**. A vulnerabilidade recebeu nota máxima, 10, no CVSS 3.1, e prioridade 1 do fornecedor.

O problema permite executar código arbitrário sem autenticação. Na cadeia descrita pela Sansec, o sistema de templates processa conteúdo armazenado como entrada executável enquanto o servidor monta um email de pagamento malsucedido. O código roda ali mesmo, antes de qualquer interação com o destinatário.

A correção vem como hotfix aplicado via Composer, não como uma nova versão completa do produto. Antes de escolher o pacote, confira produto, ramo e build. A tabela oficial cobre ramos do Adobe Commerce de 2.4.4 a 2.4.9, nos níveis de patch de agosto de 2026 listados e anteriores. Para Magento Open Source, começa em 2.4.6 e vai até 2.4.9. A extensão B2B tem sua própria lista no boletim.

Aqui há duas coisas para conferir: se a instalação está na faixa afetada e se o hotfix teve a compatibilidade testada naquela build. A Adobe só declara testes nas builds de agosto explicitamente listadas. Outras builds suportadas ficaram sem essa verificação oficial. A Sansec também descreve um alcance maior que a tabela oficial de Magento Open Source. Se sua instalação antiga ficou fora da lista, procure orientação específica sobre exposição e pacote compatível. A ausência na tabela não atesta segurança.

Depois do patch, vem a recuperação. O procedimento da Adobe pede colocar a loja em manutenção, suspender o cron, trocar as chaves de criptografia e as credenciais afetadas, limpar o cache e restaurar o cron e o serviço. Entram nessa lista senhas administrativas, tokens de integração, segredos OAuth e acessos ao provedor de pagamentos, banco de dados, SSH e deploy. Serviços e extensões também precisam de revisão.

Por que trocar tudo isso se a chave de criptografia da aplicação já mudou? Porque essa chave protege os segredos armazenados. Um token que alguém já leu continua sendo aceito pelo serviço de destino até ser revogado ou trocado lá. Trocar a fechadura do armário não cancela o cartão que saiu de dentro dele.

A rotação é a precaução oficial de recuperação. As fontes não estabelecem que toda loja afetada perdeu todos esses segredos, nem informam um total de lojas comprometidas.

Também sobra trabalho no host. Segundo a Sansec, o patch deixa intactas as backdoors instaladas antes dele. A atualização de 7 de setembro da investigação acrescentou um implante disfarçado de chronyd e um segundo atacante usando uma web shell PHP. A busca precisa ir além da pista de processo do primeiro relato. E um nome de processo isolado, por si só, não prova que ele seja malicioso.

Preserve evidências e investigue as alterações em vez de sair apagando arquivos suspeitos. Para Adobe Commerce on Cloud, a documentação ensina a verificar o hotfix pela Quality Patches Tool, procurando o estado `Applied`; essa instrução é específica para clientes Cloud. Reserve tempo tanto para confirmar a correção quanto para investigar o ambiente e revogar os acessos expostos. O `Applied` só responde pela primeira parte.

Fontes: [Adobe — boletim APSB26-146](https://helpx.adobe.com/security/products/magento/apsb26-146.html), [instruções do hotfix e da rotação de credenciais](https://experienceleague.adobe.com/en/docs/commerce-knowledge-base/kb/announcements/commerce-apsb26-146) e [Sansec — investigação do StyleSmuggler](https://sansec.io/research/stylesmuggler).

## O teste do agente precisa conseguir discordar do código

Você pede uma implementação, exige testes e recebe uma suíte verde. Beleza. Que implementação errada essa suíte conseguiria reprovar? Dan Luu foi olhar isso de perto num experimento em que o Codex implementava Zstd em Rust. Encontrou testes que concordavam com o código sem conseguir distinguir erros plausíveis.

A investigação trata de agentes de setembro de 2026. Luu comparou 26 condições de prompt e quatro skills, usando GPT-5.6 Sol com esforço médio e xhigh. No gráfico principal, cada condição e nível de esforço reúne 80 execuções. Ele compara custo com a fração de execuções que passaram em **todos os testes ocultos**. A medida é essa, e não a porcentagem de asserts verdes da suíte escrita pelo próprio agente.

Uma das falhas fica bem visível nos dados. O agente usou quatro fluxos comprimidos idênticos em testes que deveriam ajudar a detectar erros de transposição. Como os quatro são iguais, algumas trocas de posição deixam o resultado indistinguível. O teste entrega quatro objetos iguais, embaralha a mesa e pergunta se alguém percebeu. Nem o fiscal mais desconfiado resolve isso olhando só o resultado.

Em outra execução que Luu inspecionou, os dados eram palindrômicos: ficavam iguais quando lidos ao contrário. Um erro que invertia o fluxo de bits passava despercebido com aquela entrada. Você poderia acrescentar mais verificações sobre a mesma simetria e continuar sem pegar a inversão.

Escolher entradas faz parte do teste. Valores diferentes entre si permitem verificar ordem. Casos nas bordas ajudam a separar interpretações que coincidem no caminho mais confortável. Antes de pedir mais testes ao agente, eu pediria um erro plausível e o caso que conseguiria denunciá-lo. Depois, conferiria se a expectativa faz sentido.

Essa expectativa precisa vir de algum lugar confiável. Em testes, o critério usado para decidir o resultado correto se chama oráculo. Se o teste calcula o que espera receber com a mesma lógica da implementação, os dois podem carregar o mesmo engano. Código e teste assinam embaixo um do outro. A reunião terminou em consenso; o bug agradece.

Luu também encontrou agentes cumprindo só a aparência de instruções mais sofisticadas. Prompts que pediam ferramentas formais frequentemente recebiam provas de propriedades irrelevantes. Pedidos de testes aleatórios muitas vezes exercitavam a rejeição de entradas, em vez de explorar estados válidos interessantes. Gerar bytes até o validador reclamar testa uma parte do programa. Para chegar à lógica seguinte, o gerador precisa produzir entradas válidas variadas e fronteiras relevantes.

A orientação personalizada que mais pontuou nesse experimento enfatizava erros prováveis, entradas assimétricas e verificações capazes de distinguir interpretações. O próprio autor diz que ela ainda não estava pronta como skill de uso geral. As instruções para derivar expectativas em contexto novo raramente eram seguidas.

O estudo usa uma tarefa e configurações específicas, omite parte dos detalhes experimentais e traz um aviso do autor contra conclusões fortes sobre o ranking. Os resultados mostram problemas na execução das técnicas pelos agentes; não demonstram que TDD, testes de propriedades ou verificação formal sejam inúteis.

Num trabalho exploratório separado, Birgitta Böckeler também não encontrou vantagem clara do TDD nas medidas usadas. Eram tarefas pequenas de lógica de negócio, com avaliações de qualidade feitas em grande parte por outro modelo. Ela distingue testes definidos por humanos, checkpoints humanos e o ciclo totalmente autônomo. E deixa uma observação que dá para levar à revisão: confira por que o teste ficou vermelho. Se ele falhou pelo motivo errado, você pode cumprir a cerimônia do red-green sem verificar o comportamento pretendido.

Eu começaria por um teste importante e seguiria a expectativa até sua origem. Depois perguntaria qual troca de ordem, inversão ou caso de borda ele detecta. Isso dá à gente algo bem mais preciso para inspecionar do que “o agente usou TDD”. O nome da técnica cabe no prompt. A capacidade de pegar o erro precisa aparecer nos dados e na comparação.

Fontes: [Dan Luu — How well do agents use test/verification techniques?](https://danluu.com/agentic-testing/) e [Birgitta Böckeler — TDD in the agent loop](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html).

## Jellyfin 12.0 muda o banco e pede uma janela de migração

Se você mantém um Jellyfin, reserve tempo antes de trocar a tag do container. A versão estável 12.0, anunciada em 7 de setembro, altera o esquema do banco e reescreve dados. O projeto pede backup manual completo, atenção à compatibilidade e uma varredura integral da biblioteca depois da atualização.

O salto no número foi de propósito. O que seria 10.12.0 perdeu o 10 inicial porque, segundo a equipe, ele escondia a importância das versões maiores. O servidor passa a informar 12.0.0. Revise scripts de deploy, monitoramento e qualquer automação que interprete essa string. O número finalmente está avisando que a mudança é grande; eu acreditaria nele.

Uma alteração no banco ajuda a entender o trabalho. Playlists, coleções e boxsets guardavam a lista de membros serializada dentro do item pai. Para contar, paginar ou editar essa lista, a aplicação precisava carregar ou reescrever o conjunto. Agora os membros ocupam linhas individuais, que o banco consegue consultar diretamente.

O armazenamento fica mais próximo das operações que o programa faz. Para pedir uma página da coleção, a aplicação deixa de desembrulhar a lista inteira só para selecionar um pedaço. A equipe espera melhorias na navegação, mas não publicou um multiplicador de desempenho que valha para qualquer biblioteca. O primeiro scan, inclusive, pode demorar bastante mais.

Confira o caminho inteiro antes de começar a atualização. Descobrir um pré-requisito no meio da migração é uma forma bem chata de prolongar a manutenção:

- Confira a versão de origem: a atualização direta parte da 10.10.7 ou de qualquer 10.11.x. Versões anteriores precisam chegar primeiro à 10.10.7.
- Verifique nomes de usuário que diferem apenas em maiúsculas e minúsculas. Na 12.0, essa diferença deixa de distinguir contas, e colisões existentes fazem a migração falhar.
- Pare o Jellyfin e faça backup manual completo dos dados e da configuração. Remova plugins de terceiros antes da atualização.
- Deixe as migrações terminarem sem interrupção. Depois da reescrita, o caminho de volta à versão anterior é restaurar o backup. Interromper a migração não desfaz o trabalho.
- Execute a varredura completa da biblioteca para reconstruir o agrupamento automático de versões alternativas. Confira os clientes e só restaure plugins compatíveis.

Se você separa essa etapa no deploy, a opção `--mode MigrateSystem` executa a migração e encerra sem iniciar o restante do servidor. Plugins da 10.11 precisam de novos builds, e o servidor passa a usar .NET 10.

Clientes antigos também exigem atenção: as rotas legadas `/emby/` e `/mediabrowser/` foram removidas, e a autenticação obsoleta foi desabilitada. Já o TLS interno continua nesta versão, porque sua remoção foi adiada. A recomendação do projeto segue sendo usar um proxy reverso.

Na interface web, o layout Modern vira padrão em desktop e celular para quem ainda não fez uma escolha explícita. A TV mantém seu layout. O lançamento também integra funcionalidades de livros e quadrinhos, oferece versões alternativas de episódios e inclui correções de segurança. Há coisa visível para aproveitar quando a migração e o scan terminarem. Até lá, deixe o backup à mão.

Fonte: [Jellyfin — anúncio da versão 12.0 e requisitos de atualização](https://jellyfin.org/posts/jellyfin-release-12.0/).

## wrapture põe o trace na configuração e descarta eventos quando a fila enche

Você herdou um serviço Python e quer observar algumas chamadas sem editar a lógica da aplicação. Na demonstração de 8 de setembro, Graham Dumpleton põe os pontos de observação do wrapture num arquivo `wrapture.toml`. O comando `python -m wrapture main.py` aplica a configuração antes de iniciar o programa.

[Ontem vimos a captura e a ocultação do argumento de cartão](/2026/n-central-exige-novo-patch-e-wrapture-mostra-o-cartao-no-trace/); o exemplo novo ainda mostra os últimos dígitos na mensagem de exceção, com dados sintéticos, um lembrete de que cada campo capturado precisa de tratamento próprio. Desta vez, a mudança principal está em quem instala a observação e no que acontece quando a saída fica para trás da aplicação.

O arquivo declara os alvos em entradas `observe` e o destino dos eventos em entradas `sink`. Os alvos identificam módulos ou caminhos específicos dentro deles. Os hooks só se prendem às chamadas depois que a própria aplicação importa o módulo. Assim, você escolhe onde observar sem antecipar imports nem mudar a ordem de importação do programa.

O destino JSONLines grava eventos concluídos como um objeto JSON por linha. Entre a chamada observada e o arquivo há uma fila limitada e um gravador em segundo plano. Quando a fila enche, novas linhas são descartadas e o contador `dropped` aumenta. A chamada observada segue sem bloquear à espera dessa gravação. Os resumos de valores também evitam manter objetos vivos da aplicação só para registrá-los depois.

O serviço pode continuar funcionando enquanto parte da evidência fica pelo caminho. O gravador estava ocupado e resolveu perder a ata em vez de parar a reunião. Por isso, confira o contador de descarte antes de usar o trace para investigar o que aconteceu.

A documentação não promete instrumentação sem custo. E o flush espera pelas linhas que já estão na fila: no encerramento, portanto, pode haver espera. Esse caminho de saída aceita perda de eventos e não serve como promessa de auditoria completa.

Outra opção é injetar a instrumentação na inicialização do interpretador. Para isso, você precisa instalar autowrapt e definir `AUTOWRAPT_BOOTSTRAP=wrapture`. Nesse caminho, uma configuração ausente ou inutilizável gera um aviso e deixa o processo subir sem trace. Pelo runner, configuração ausente é erro. Se você precisa capturar aquela execução, confira essa diferença antes de escolher como iniciá-la.

A variável de ambiente normalmente chega aos processos Python descendentes. Delimite quais processos devem recebê-la e controle quem pode escrever no arquivo de configuração: ele pode nomear código arbitrário. A autoridade para instalar essa instrumentação fica no arquivo, mesmo com o fonte da aplicação intocado.

Dumpleton apresenta a injeção como ferramenta de desenvolvimento, staging ou intervenção emergencial. Para rastreamento rotineiro em produção, a orientação é integrar deliberadamente pela aplicação. Num diagnóstico pontual, eu consideraria a configuração externa e conferiria as duas pontas: se o trace realmente foi ligado e quanto dele conseguiu chegar ao disco.

Fontes: [Graham Dumpleton — Zero-code tracing with wrapture](https://grahamdumpleton.me/posts/2026/09/zero-code-tracing-with-wrapture/) e [documentação de tracing do wrapture](https://wrapture.readthedocs.io/en/latest/ad-hoc-tracing.html).

## Destaques rápidos para hoje.

- **O CERT Polska confirma ataques com a cadeia MikroTrick no RouterOS.** O aviso de 5 de setembro acrescenta exploração real à [reprodução condicionada de laboratório que cobrimos naquele dia](/2026/hydrafusion-poe-modelos-para-trabalhar-juntos-e-mikrotik-pede-patch/): a CVE-2026-67276 contorna autenticação SSH, e a CVE-2026-86060 permite manipular privilégios. A entrada depende de conhecer o usuário e o módulo público de sua chave RSA, por isso a exposição varia conforme a configuração. Instale uma versão corrigida da linha do equipamento, como 7.24.2 na stable ou 6.49.21 na v6, ou posterior aplicável. Restrinja SSH ao gerenciamento confiável e revise configurações desconhecidas, mesmo sem a marca `Flagged`. Fontes: [CERT Polska](https://cert.pl/en/posts/2026/09/vulnerabilities-in-mikrotik-routeros-actively-exploited/) e [boletim da MikroTik](https://mikrotik.com/supportsec/september-2026-vulnerability).

- **A Arm lançou o AI Portal para descobrir modelos otimizados e caminhos de implantação.** O anúncio de 8 de setembro reúne informações de precisão, latência, memória e tamanho, além de exemplos de código para hardware Arm em nuvem ou na borda. Dá para começar por ali a escolha de modelo, runtime e dispositivo. Os recursos voltados a agentes estão em acesso antecipado; as ferramentas para levar e otimizar seus próprios modelos ficaram na promessa de vir depois. Fonte: [Arm — lançamento do AI Portal](https://newsroom.arm.com/news/arm-unveils-arm-ai-portal).

- **Duas chaves RSA de 512 bits da antiga E-Certify foram reconstruídas num desktop.** Matthew McPherrin relata, em 7 de setembro, fatorações de 32 e 29 horas com CADO-NFS num Ryzen 9 5950X. Fatorar o módulo público permite recuperar os componentes da chave privada. Essas raízes saíram do conjunto de confiança em 2002; para demonstrar aceitação, foi preciso usar Netscape 4.51 e voltar o relógio para antes da expiração dos certificados, em 2003. O experimento fica nessas chaves históricas fracas, com confiança já aposentada. As chaves RSA maiores usadas hoje não foram quebradas por essa demonstração. Fonte: [Matthew McPherrin — experimento com a E-Certify](https://mcpherrin.ca/2026/09/07/rsa.html).

- **O motor de diagramas TALA virou código aberto sob MPL-2.0 e vem no D2 0.9.0.** O anúncio de 7 de setembro oferece posicionamento híbrido: você fixa os componentes importantes e deixa o motor organizar os demais e traçar as conexões, escolhendo `--layout=tala`. Entradas e sementes idênticas reproduzem o resultado, mas acrescentar um nó pode reorganizar bastante o desenho. Se aquela posição faz parte da explicação da arquitetura, fixe-a antes que o diagrama resolva redecorar o escritório. Fonte: [D2 — TALA is open-source](https://d2lang.com/blog/tala-is-open-source/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 26587
source_urls:
  - https://helpx.adobe.com/security/products/magento/apsb26-146.html
  - https://experienceleague.adobe.com/en/docs/commerce-knowledge-base/kb/announcements/commerce-apsb26-146
  - https://sansec.io/research/stylesmuggler
  - https://danluu.com/agentic-testing/
  - https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html
  - https://jellyfin.org/posts/jellyfin-release-12.0/
  - https://grahamdumpleton.me/posts/2026/09/zero-code-tracing-with-wrapture/
  - https://wrapture.readthedocs.io/en/latest/ad-hoc-tracing.html
  - https://cert.pl/en/posts/2026/09/vulnerabilities-in-mikrotik-routeros-actively-exploited/
  - https://mikrotik.com/supportsec/september-2026-vulnerability
  - https://newsroom.arm.com/news/arm-unveils-arm-ai-portal
  - https://mcpherrin.ca/2026/09/07/rsa.html
  - https://d2lang.com/blog/tala-is-open-source/
-->
