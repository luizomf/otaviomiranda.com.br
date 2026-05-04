---
title: 'DigiCert, cPanel e software sob medida: confiança dá trabalho'
description:
  'Certificados de code signing roubados, exploração em massa no cPanel, um
  desktop pessoal feito com Claude Code e a conta prática dos agentes de
  código.'
date: 2026-05-04T06:45:53-03:00
author: 'The Paper LLM'
image: './images/digicert-cpanel-software-sob-medida-confianca-da-trabalho.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/digicert-cpanel-software-sob-medida-confianca-da-trabalho/final.opus'
---

![Capa editorial com certificados translúcidos, token de assinatura, servidor exposto e uma pessoa revisando tecnologia, com o texto "Confiança dá trabalho".](./images/digicert-cpanel-software-sob-medida-confianca-da-trabalho.jpg)

O tema de hoje é confiança em lugares que costumam parecer chatos até o dia em
que quebram: suporte de autoridade certificadora, painel de hospedagem, fornecedor
de serviço público, fila no Postgres, terminal "só texto" que vira uma parede
para leitor de tela.

A notícia mais forte é a DigiCert. A raiz da internet segue de pé, calma lá. O
problema é mais mundano, e por isso mesmo mais útil: um fluxo de suporte
aparentemente comum abriu caminho para certificados EV de code signing usados em
malware. Depois, o remédio da detecção também tropeçou e o Microsoft Defender
passou a tratar certificados legítimos da DigiCert como trojan.

No outro extremo do dia tem Geir Isene montando um desktop para uma pessoa só
com Claude Code no banco de ferramentas. Parece uma história pequena, mas é uma
das formas mais honestas de olhar para agentes de código: eles ficam muito mais
úteis quando o escopo é estreito, o dono sabe o que quer e a revisão continua
humana.

## DigiCert: quando o suporte vira parte da cadeia de confiança

O incidente da DigiCert começou em abril de 2026 com engenharia social contra a
equipe de suporte. Segundo o relatório publicado no Bugzilla da Mozilla, o
atacante enviou arquivos ZIP disfarçados de capturas de tela por um canal de
chat de suporte. Dentro havia um `.scr`, que no Windows é executável com roupa
de descanso de tela. Quatro tentativas foram bloqueadas, mas uma delas
comprometeu um endpoint usado por um analista.

O primeiro endpoint foi detectado e contido em 3 de abril. O problema é que um
segundo endpoint, comprometido no dia 4, só entrou no radar em 14 de abril por
causa de uma falha de cobertura do CrowdStrike naquele host. Esse detalhe
importa porque o incidente passa do clique errado para algo bem mais perigoso:
uma máquina fora do campo de visão transforma a telemetria em um cobertor curto.

Com acesso ao endpoint do analista, o atacante entrou em funções internas do
portal de suporte. A DigiCert afirma que esse acesso não permitia gerenciar
contas, usuários, chaves de API ou pedidos. Mesmo assim, ele permitia ver
códigos de inicialização de pedidos já aprovados de certificados EV de code
signing. E aí mora o susto: com um pedido aprovado e o código de inicialização,
era possível obter o certificado.

Certificado EV de code signing não é enfeite de PDF. Ele ajuda sistemas,
navegadores e ferramentas de segurança a decidir se um binário assinado merece
mais confiança. Quando isso cai na mão errada, malware ganha uma fantasia
administrativa, daquelas que passam pela portaria acenando com crachá.

A DigiCert revogou 60 certificados de code signing. Vinte e sete foram
explicitamente ligados ao ator, e alguns certificados explorados apareceram
assinando a família de malware Zhong Stealer. A empresa também cancelou pedidos
pendentes no escopo, passou a mascarar códigos de inicialização em sessões de
suporte proxied e disse não ter encontrado abuso de validação para outros tipos
de certificado.

O segundo tropeço veio pelo lado defensivo. Depois dos relatos de certificados
comprometidos, o Microsoft Defender passou a marcar entradas legítimas de
certificados raiz da DigiCert como `Trojan:Win32/Cerdigent.A!dha`. Em alguns
casos, segundo a BleepingComputer, essas entradas chegaram a ser removidas do
trust store do Windows. A Microsoft orientou atualizar para Security
Intelligence `1.449.430.0` ou superior.

A distinção aqui precisa ficar limpa: as raízes da DigiCert não foram
confirmadas como comprometidas nesse incidente. O que houve foi abuso de
certificados de code signing emitidos a partir de pedidos aprovados, seguido por
uma detecção que exagerou e acertou itens legítimos do `AuthRoot`.

Para quem administra ambiente Windows, suporte técnico, EDR ou cadeia de build,
o checklist é feio e útil: procurar binários assinados pelos certificados
revogados, confirmar a versão das assinaturas do Defender, verificar integridade
do trust store e olhar com carinho para cobertura de endpoint em máquinas de
suporte. A cadeia de confiança não começa no HSM glamouroso. Às vezes começa
numa tela de chat e num arquivo `.scr` que jamais deveria ter passado dali.

Fontes:
[relatório da DigiCert no Bugzilla da Mozilla](https://bugzilla.mozilla.org/show_bug.cgi?id=2033170),
[BleepingComputer sobre o falso positivo do Defender](https://www.bleepingcomputer.com/news/security/microsoft-defender-wrongly-flags-digicert-certs-as-trojan-win32-cerdigentadha/)
e
[Risky Business](https://risky.biz/risky-bulletin-digicert-hacked-with-a-malicious-screensaver-file/).

## Um desktop para uma pessoa só também ensina bastante

Geir Isene publicou "A desktop made for one", um texto sobre trocar ferramentas
de desktop tradicionais por software feito para o próprio fluxo. O artigo fala
de componentes em assembly x86_64, ferramentas em Rust, editor modal, TUI e
Claude Code funcionando como força de implementação. A parte que chama atenção:
ele diz que usava Vim desde 2001, fez o primeiro commit do novo editor em 1 de
maio e, em 3 de maio, já tinha parado de usar Vim.

Essa é a manchete perigosa, porque dá vontade de transformar em "IA matou o
Vim", e aí a gente perde a notícia real. O ponto bom é outro: agentes reduziram
o custo de criar software para uma audiência de uma pessoa. Não um produto para
todo mundo, com documentação, compatibilidade ampla, empacotamento decente,
governança e as dores que fazem um mantenedor olhar para a parede às três da
tarde. Um conjunto de ferramentas para as mãos de quem construiu.

Isso muda a economia da gambiarra séria. Um dev experiente pode olhar para um
incômodo antigo, descrever o comportamento que quer, deixar o agente escrever
boa parte do código e continuar tomando as decisões de design, revisão e aceite.
O agente vira workhorse. Não vira dono da oficina.

O limite também é a graça da história. Software de uma pessoa pode aceitar
arestas afiadas, atalhos estranhos e decisões impossíveis de vender para uma
base grande de usuários. O criador sabe onde dói, sabe o que tolera e sabe
quando jogar fora. Isso não prova que agentes eliminam engenharia. Prova que
engenharia pequena, situada e muito opinativa ficou mais barata.

Para quem usa Claude Code, Codex ou qualquer ferramenta parecida no dia a dia, o
aprendizado prático é simples: procure tarefas com fronteira clara. Editor
pessoal, utilitário de arquivos, scripts de workflow, visualizador interno,
pequena ferramenta de terminal. Se o público é você mesmo, o ciclo de feedback é
curto e honesto. Se o público é "o mundo", prepare teste, suporte, release,
documentação e paciência. A IA ajuda nos dois casos, mas só em um deles o usuário
principal consegue reclamar diretamente com o autor no espelho do banheiro.

Fonte: [Geir Isene](https://isene.org/2026/05/Audience-of-One.html).

## Destaques rápidos para hoje.

- A exploração do cPanel/WHM `CVE-2026-41940` ganhou uma atualização pesada:
  a SecurityWeek reportou mais de 40 mil servidores provavelmente comprometidos,
  com um pico de 44 mil IPs únicos interpretado a partir de sensores da
  Shadowserver. Como isso já foi assunto principal por aqui em 1 de maio, o
  ponto novo é escala e resposta: aplicar versões corrigidas, reiniciar
  `cpsrvd`, rodar checagens de IOC da cPanel e tratar painel exposto como
  incidente completo, além do patch atrasado. Fontes:
  [SecurityWeek](https://www.securityweek.com/over-40000-servers-compromised-in-ongoing-cpanel-exploitation/),
  [cPanel](https://support.cpanel.net/hc/en-us/articles/40073787579671-Security-CVE-2026-41940-cPanel-WHM-WP2-Security-Update-04-28-2026)
  e [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-41940).

- Na Itália, a IBM confirmou que a Sistemi Informativi, empresa do grupo que
  atende infraestrutura de administração pública e grandes clientes, sofreu um
  incidente cibernético, foi contida e teve serviços afetados restaurados. A
  atribuição a Salt Typhoon e o escopo de exfiltração ainda aparecem como
  pontos reportados, não como fatos fechados. O valor da notícia é lembrar que
  provedor gerenciado concentra risco: quando o fornecedor cai, vários clientes
  precisam entender que logs, sistemas e dados estavam ao alcance dele. Fontes:
  [la Repubblica](https://www.repubblica.it/tecnologia/2026/05/03/news/esclusivo_pa_italiana_e_non_solo_attaccata_da_un_gruppo_di_hacker_cinesi-425320702/)
  e
  [Adnkronos via Il Fatto Nisseno](https://www.ilfattonisseno.it/2026/05/attacco-hacker-a-sistemi-informativi-ibm-servizi-interessati-sono-stati-ripristinati/).

- O DeepClaude tenta separar o loop autônomo do Claude Code do backend de modelo.
  O projeto configura variáveis como `ANTHROPIC_BASE_URL` e
  `ANTHROPIC_AUTH_TOKEN`, ou usa um proxy local em `localhost:3200`, para rotear
  chamadas para DeepSeek V4 Pro, OpenRouter, Fireworks ou backends compatíveis.
  A ideia é interessante para custo e portabilidade, mas as promessas de economia
  são claims do README, e há limitações em visão, ferramentas MCP pela camada de
  compatibilidade e semântica de cache. Teste em projeto descartável antes de
  mandar código sensível passear por outro provedor. Fonte:
  [GitHub](https://github.com/aattaran/deepclaude).

- PgQue trouxe de volta uma ideia estilo PgQ para filas/event logs no Postgres
  sem mutar a tabela quente no caminho do consumidor. Em vez de `UPDATE`,
  `DELETE` ou `SELECT FOR UPDATE SKIP LOCKED` nos eventos, o desenho usa
  snapshots, `pg_visible_in_snapshot()` e um cursor de assinatura para calcular
  o que ficou visível entre dois ticks. É uma bela aula de sistema: ótimo para
  fan-out e event log, menos indicado se você precisa despacho de jobs com
  latência de poucos milissegundos. Fonte:
  [Christophe Pettus](https://thebuild.com/blog/2026/05/03/pgque-two-snapshots-and-a-diff/).

- A Microsoft publicou materiais antigos de DOS com licença MIT: listagens do
  kernel do 86-DOS 1.00, snapshots de desenvolvimento do PC-DOS 1.00,
  utilitários como `CHKDSK`, scans e notas manuscritas. O escopo é preservação
  de artefatos iniciais, não uma abertura geral de todo DOS, e ajuda a estudar
  como sistemas nasciam antes de histórico Git ser barato. Fonte:
  [Microsoft Open Source Blog](https://opensource.microsoft.com/blog/2026/04/28/continuing-the-story-of-early-dos-development/).

- Um ensaio do The Inclusive Lens lembra que terminal não é automaticamente
  acessível. CLIs em fluxo linear costumam conversar melhor com leitores de
  tela; TUIs modernas baseadas em grade reativa podem virar cursor pulando,
  spinner repetindo, timer redesenhando e histórico inteiro sendo recalculado.
  Para ferramentas de IA no terminal, vale oferecer modo linear, headless ou
  sem cursor agressivo, e tratar bug de leitor de tela como bug de produto.
  Fonte:
  [The Inclusive Lens](https://xogium.me/the-text-mode-lie-why-modern-tuis-are-a-nightmare-for-accessibility).

- HTTPXYZ se apresenta como um fork mantido do HTTPX para Python, com foco em
  estabilidade, correções e compatibilidade. Os mantenedores dizem que o HTTPX
  ficou sem patch release desde novembro de 2024 enquanto problemas reais
  seguiam abertos; a migração documentada pode ser tão pequena quanto importar
  `httpxyz as httpx`. Ainda assim, fork de dependência central não é troca de
  tema no editor: avalie governança, cadência, compatibilidade transitiva e
  impacto do alias em produção. Fontes:
  [HTTPXYZ](https://httpxyz.org/) e
  [PyPI](https://pypi.org/project/httpxyz/).

- Lina documentou a investigação de um aparente honeypot de booter/stresser
  chamado Cyberzap, associado por ela ao contexto da Operation PowerOFF. O caso
  é bom para pensar em engenharia de engano: mercados de DDoS-for-hire dependem
  de confiança, e um honeypot, mesmo imperfeito, pode envenenar essa confiança.
  Mas a ligação exata com operadores oficiais e a causa do bloqueio por `401
  Unauthorized` ficam como inferência da autora, não confirmação de autoridade.
  Fonte: [lina's blog](https://lina.sh/blog/ddos-honeypot).

## Acompanhamento de tendências do dia.

Os agentes de código ganharam hoje um contrapeso bom. Lars Faye escreveu que
agentic coding pode criar dívida cognitiva: quanto mais você delega, mais
precisa supervisionar, e essa supervisão exige justamente as habilidades que
podem enferrujar. O texto também aponta dependência de fornecedor e custo de
tokens como risco operacional. Se a sua equipe só trabalha quando um serviço
específico está no ar e barato, você não tem apenas ferramenta. Você tem uma
dependência de produção com logo bonito.

Lelanthran chega por outro caminho e cutuca a metáfora de "LLM como abstração de
nível mais alto". Compilador, linguagem e framework continuam sendo sistemas
determinísticos no essencial: uma entrada leva a um artefato esperado dentro de
regras definidas. Um LLM produz uma distribuição de probabilidades sobre
artefatos possíveis. Isso não torna a ferramenta inútil, longe disso. Só torna
perigoso fingir que ela tem o mesmo contrato de uma abstração clássica. O teste
feliz pode passar enquanto comportamento indesejado entra pela janela.

A conexão com o desktop do Isene é direta. Agentes brilham quando a tarefa é
limitada, o dono entende o domínio, o diff cabe na cabeça e a consequência de
errar é suportável. Para trabalho desconhecido, arquitetura sensível, segurança
ou código que muita gente vai manter depois, a disciplina precisa subir junto:
escopo menor, diffs revisáveis, testes determinísticos e checagens para aquilo
que o agente não deveria fazer. A meta é usar IA sem chamar probabilidade de
abstração só porque soa mais bonito na reunião.

Fontes:
[Lars Faye](https://larsfaye.com/articles/agentic-coding-is-a-trap)
e
[Lelanthran](https://www.lelanthran.com/chap15/content.html).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_slug: 2026-05-04
generated_at: 2026-05-04T06:45:53-03:00
source_urls:
  - https://bugzilla.mozilla.org/show_bug.cgi?id=2033170
  - https://www.bleepingcomputer.com/news/security/microsoft-defender-wrongly-flags-digicert-certs-as-trojan-win32-cerdigentadha/
  - https://risky.biz/risky-bulletin-digicert-hacked-with-a-malicious-screensaver-file/
  - https://isene.org/2026/05/Audience-of-One.html
  - https://larsfaye.com/articles/agentic-coding-is-a-trap
  - https://www.lelanthran.com/chap15/content.html
  - https://github.com/aattaran/deepclaude
  - https://www.securityweek.com/over-40000-servers-compromised-in-ongoing-cpanel-exploitation/
  - https://support.cpanel.net/hc/en-us/articles/40073787579671-Security-CVE-2026-41940-cPanel-WHM-WP2-Security-Update-04-28-2026
  - https://nvd.nist.gov/vuln/detail/CVE-2026-41940
  - https://www.repubblica.it/tecnologia/2026/05/03/news/esclusivo_pa_italiana_e_non_solo_attaccata_da_un_gruppo_di_hacker_cinesi-425320702/
  - https://www.ilfattonisseno.it/2026/05/attacco-hacker-a-sistemi-informativi-ibm-servizi-interessati-sono-stati-ripristinati/
  - https://opensource.microsoft.com/blog/2026/04/28/continuing-the-story-of-early-dos-development/
  - https://lina.sh/blog/ddos-honeypot
  - https://thebuild.com/blog/2026/05/03/pgque-two-snapshots-and-a-diff/
  - https://xogium.me/the-text-mode-lie-why-modern-tuis-are-a-nightmare-for-accessibility
  - https://httpxyz.org/
  - https://pypi.org/project/httpxyz/
omitted_briefing_items:
  - Copy Fail / CVE-2026-31431: omitido por duplicata; o post de 2026-05-02 já cobriu como lead, incluindo CISA KEV e mitigação.
  - Last Week in AI #243: omitido por ser agregador/background, não fonte primária para o panorama público de hoje.
  - ContextAtlas: omitido por evidência majoritariamente promocional e repetição do eixo recente de contexto para agentes.
  - Cryptographic hashes as hash-table keys: omitido por ser nota evergreen sem gancho novo suficiente para este roundup.
-->
