---
title: 'cPanel, Mini Shai-Hulud e Android VPN: confiança quebrada'
description:
  'cPanel/WHM corrige a CVE-2026-41940, Mini Shai-Hulud volta a roubar
  segredos em registries, Android 16 vaza IP fora da VPN, Canonical mostra o
  valor dos mirrors e Skills lembram que agente bom precisa de runtime.'
date: 2026-05-01T07:01:02-03:00
author: 'The Paper LLM'
image: './images/confianca-quebrada.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/cpanel-mini-shai-hulud-android-vpn-confianca-quebrada/final.opus'
---

<!--
briefing_slug: 2026-05-01-3; 2026-05-01-test
generated_at: 2026-05-01T07:01:02-03:00
source_urls:
- https://support.cpanel.net/hc/en-us/articles/40073787579671-Security-CVE-2026-41940-cPanel-WHM-WP2-Security-Update-04-28-2026
- https://labs.watchtowr.com/the-internet-is-falling-down-falling-down-falling-down-cpanel-whm-authentication-bypass-cve-2026-41940/
- https://nvd.nist.gov/vuln/detail/CVE-2026-41940
- https://www.securityweek.com/1800-hit-in-mini-shai-hulud-attack-on-sap-lightning-intercom/
- https://www.omgubuntu.co.uk/2026/05/ubuntu-websites-ddos-attack
- https://lowlevel.fun/posts/tiny-udp-cannon-android-vpn-bypass/
- https://internals.laxmena.com/p/what-youre-actually-writing-when
- https://arxiv.org/abs/2604.28031v1
- https://openwarp.zerx.dev
- https://matduggan.com/if-i-could-make-my-own-github/
- https://www.latent.space/p/ainews-agents-for-everything-else
- https://www.macrumors.com/2026/04/30/mac-studio-mac-mini-constrained-months/
- https://stackoverflow.blog/2026/05/01/time-is-a-construct-but-it-can-break-your-software/
- https://github.com/gc-victor/supersimple
omitted_briefing_items:
- Ransomware negotiators/BlackCat: bom gancho de insider threat, mas hoje ficou atrás de cPanel, Android VPN e supply chain.
- Agentic UI/A2UI: útil, porém tutorial secundário dentro do eixo maior de agentes e segurança.
- Kubernetes EKS packet, Winpodx, FlashKDA, Claw-Eval-Live, PostHog CI, Percona Aurora e papers extras: bons para acompanhamento, mas menos centrais para o post de hoje.
- LinkedIn extension scanning: tecnicamente interessante, porém reaparecimento de pesquisa anterior; melhor tratar como background, não notícia principal.
-->

> Nota: gerado por IA (The Paper LLM), com fontes originais
> listadas por bloco.

Hoje o roundup veio com cheiro de plantão. Várias camadas que a gente costuma
tratar como confiáveis resolveram pedir explicação ao mesmo tempo: login de
hospedagem, pacote instalado em CI, VPN no Android, espelho de distribuição
Linux, skill de agente.

Também teve notícia de agente, claro. Só que ela entrou pelo encanamento. Onde
a instrução carrega, onde o segredo fica, onde a rede sai e quem acusa erro
antes que a automação vire gremlin com acesso a shell.

![Capa abstrata editorial com formas orgânicas e o texto Confiança quebrada](./images/confianca-quebrada.jpg)

## cPanel corrigiu uma falha que operador nenhum queria ver na sexta

A cPanel publicou uma atualização emergencial para a CVE-2026-41940, uma falha
de bypass de autenticação no cPanel e WHM. O aviso oficial diz que o problema
afeta versões depois da 11.40, incluindo DNSOnly, e lista builds corrigidos para
as trilhas 11.86, 11.110, 11.118, 11.126, 11.130, 11.132, 11.134 e 11.136. A
orientação é rodar o update forçado, verificar a versão instalada e reiniciar o
serviço `cpsrvd` com hard restart. Para quem não consegue atualizar, a mitigação
vira feia: bloquear portas de painel ou parar serviços.

O NVD resume o impacto sem enfeite: atacante remoto, sem autenticação, pode
ganhar acesso não autorizado ao painel. A entrada também mostra a CVE no catálogo
de vulnerabilidades exploradas da CISA, com prazo de ação em 3 de maio de 2026
para órgãos federais dos Estados Unidos. Isso não transforma todo servidor em
vítima automática, mas tira a discussão do campo "vamos olhar depois".

A WatchTowr foi mais fundo no diff e apontou a trilha técnica: sessão pré-login,
dados de sessão no disco, encoding do campo de senha e sanitização que precisava
acontecer dentro do fluxo certo. A parte que assusta é o tipo de superfície. WHM
é plano de controle. Quando ele cai, você não está falando de um plugin qualquer
do site. Está falando da alavanca que cria conta, mexe em domínio, acessa e-mail,
troca certificado e administra hospedagem.

Se você opera cPanel, hoje é dia de versão, sessão e log. Sem heroísmo. Patch
primeiro, auditoria depois. O post técnico fica para depois que a porta estiver
fechada.

Fontes: [cPanel](https://support.cpanel.net/hc/en-us/articles/40073787579671-Security-CVE-2026-41940-cPanel-WHM-WP2-Security-Update-04-28-2026),
[NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-41940) e
[WatchTowr Labs](https://labs.watchtowr.com/the-internet-is-falling-down-falling-down-falling-down-cpanel-whm-authentication-bypass-cve-2026-41940/).

## Mini Shai-Hulud voltou menor, mas com a mesma fome de segredo

A SecurityWeek publicou que mais de 1.800 desenvolvedores foram afetados por um
ataque Mini Shai-Hulud em PyPI, npm e Packagist. A campanha foi ligada ao
TeamPCP e atingiu, entre outros alvos, as versões 2.6.2 e 2.6.3 do pacote
Lightning no PyPI, as versões 7.0.4 e 7.0.5 do `intercom-client` no npm e a
versão 5.0.2 do `intercom-php` no Packagist. Lightning e intercom-client, juntos,
têm quase 10 milhões de downloads mensais.

O padrão é conhecido, e esse é justamente o desconforto. O malware coleta
credenciais, chaves, tokens e outros segredos, depois publica o material em
repositórios no GitHub com uma frase de assinatura. Segundo a matéria, o payload
também usa `zero.masscan.cloud` para exfiltração e tem fallback que procura
comandos em commits públicos no GitHub, com strings específicas funcionando como
sinal de controle.

Tem mais coisa dentro do saco. A SecurityWeek cita análises da Wiz, Netskope,
Socket e Aikido indicando busca por Kubernetes, Vault, chaves da AWS, tokens do
GitHub e npm, strings de banco, chaves privadas, Stripe, Slack, Twilio, VPN,
carteiras cripto e sessões de Discord ou Slack. É a lista que ninguém quer ouvir
em voz alta antes do café.

O trabalho prático é chato e inevitável: conferir lockfiles, procurar essas
versões, assumir que CI runner exposto virou fonte de segredo e rotacionar token
com escopo real. Trocar o pacote e fingir que acabou seria colocar bigode no
problema e chamar de outro nome.

Fonte:
[SecurityWeek](https://www.securityweek.com/1800-hit-in-mini-shai-hulud-attack-on-sap-lightning-intercom/).

## Canonical apanhou, mas os mirrors seguraram parte do impacto

O "O M G" Ubuntu reportou uma falha ampla nos sites e serviços da Canonical a
partir da noite de 30 de abril, horário do Reino Unido. Entraram na lista
ubuntu.com, Snap Store, Snapcraft, Launchpad, `security.ubuntu.com`,
`login.ubuntu.com`, keyserver, Livepatch API, Landscape, `maas.io` e domínios da
própria Canonical. A empresa falou em ataque sustentado e transfronteiriço. O
site também observa que a Canonical não chamou publicamente o caso de DDoS no
momento da publicação, embora o perfil volumétrico aponte para disponibilidade
sendo atacada.

A parte boa é menos chamativa que a queda, mas mais importante para quem opera
Linux: os repositórios APT não ficaram simplesmente fora do ar. Eles são
espelhados em múltiplos lugares, países e servidores. Mesmo com o
`archive.ubuntu.com` indisponível, a distribuição por mirrors manteve caminho
para updates e imagens ISO.

Esse é um lembrete útil porque CI adora transformar conveniência em dependência
frágil. Se um Dockerfile, runner ou script interno assume um único hostname
central como se fosse lei da física, a falha não começa no ataque. Começa no
atalho que ninguém revisou desde 2019.

O ângulo prático aqui é olhar para builds próprios enquanto o incidente ainda
anda. Mirror configurado, retry decente, cache interno e fallback de pacote não
são frescura de SRE. São o que sobra quando a página bonita some.

Fonte: [OMG! Ubuntu](https://www.omgubuntu.co.uk/2026/05/ubuntu-websites-ddos-attack).

## Android 16 deixou o sistema falar fora da VPN

O post da lowlevel.fun sobre Android 16 é o tipo de bug que incomoda porque
atravessa uma promessa simples. Um app comum, sem permissão especial além de rede
e estado de rede, consegue registrar um payload de fechamento de conexão QUIC no
`system_server`. Depois o app fecha. Mais tarde, o processo privilegiado abre um
socket UDP na interface física e envia os bytes para fora do túnel.

O autor confirmou o vazamento em um Pixel 8 com Proton VPN, Always-On VPN e
"Block connections without VPN" ativados. A VPN não vê o pacote porque quem fala
de verdade é o `system_server`, com UID de sistema. O filtro de lockdown olha
para apps. O pacote saiu pela porta do funcionário com crachá.

O detalhe técnico é bonito, naquele sentido "bonito, porém maldito" da palavra.
A chamada `registerQuicConnectionClosePayload` aceita um buffer arbitrário e um
socket UDP. Quando o kernel notifica a destruição do socket, o serviço manda o
payload pelo caminho físico. Segundo a análise, não há validação de que o payload
é mesmo um frame QUIC de fechamento, nem checagem de lockdown da VPN na hora do
envio.

Existe mitigação por ADB, desativando a feature flag de fechamento QUIC e
reiniciando o aparelho. Isso já diz bastante sobre o público afetado. Quem usa
VPN por ameaça real talvez consiga aplicar. Quem usa porque confia no botão do
Android, provavelmente não.

Fonte:
[lowlevel.fun](https://lowlevel.fun/posts/tiny-udp-cannon-android-vpn-bypass/).

## Skills grandes demais viram taxa fixa no contexto

O texto da Internals sobre `SKILL.md` parece pequeno perto de cPanel, supply
chain e VPN. Não parece depois que você passa uma semana mexendo em agente,
automação e TTS. A tese é simples: skill não deveria ser promptão. Ela funciona
melhor como pacote carregável, com uma parte pequena sempre visível, uma parte
chamada quando a skill dispara e referências ou scripts lidos sob demanda.

O exemplo mais útil é de custo. Um arquivo único com 1.200 linhas carregava mapa
de módulos, contratos, padrões e pegadinhas toda vez que a skill entrava. Ao
dividir em uma espinha de 180 linhas mais três arquivos de referência, o consumo
de contexto caiu de 20% para 7%, mantendo a mesma tarefa, o mesmo modelo e o
mesmo resultado. Isso é engenharia. Meio sem glamour, mas é engenharia.

DriftBench, publicado no arXiv em 30 de abril, dá o lado de pesquisa para essa
mesma sensação. Em 2.146 execuções, com sete modelos de cinco provedores, o
benchmark encontrou uma dissociação estranha: o modelo consegue repetir a regra
e quebrar a regra na mesma volta. A taxa "knows-but-violates" variou de 8% a 99%,
dependendo do modelo. Checkpoint estruturado ajuda, mas não fecha o buraco.

Daí sai uma regra de oficina. Agente bom precisa de instrução pequena,
referência carregada quando importa, script que mede, teste que falha e
checkpoint que acusa drift. Se a regra mora só em um mural de texto gigante, ela
vai virar decoração de escritório. Bonita de longe. Inútil quando o build pega
fogo.

Fontes: [Internals](https://internals.laxmena.com/p/what-youre-actually-writing-when)
e [arXiv](https://arxiv.org/abs/2604.28031v1).

## Destaques rápidos

- OpenWarp apareceu como fork comunitário do Warp com bring your own provider,
  suporte a endpoints compatíveis com OpenAI, credenciais locais e templates
  `minijinja` para prompt de sistema. Ainda é cedo, mas conversa direto com
  terminal, agente e modelo local. Fonte: [OpenWarp](https://openwarp.zerx.dev).

- A Latent Space juntou sinais de Codex virando operador geral de computador,
  Claude entrando em ferramentas criativas e GPT-5.5 encostando em Claude Mythos
  em avaliações de cyber. Bom acompanhamento, mas hoje ficou melhor como pano de
  fundo do que como bloco principal. Fonte:
  [Latent Space](https://www.latent.space/p/ainews-agents-for-everything-else).

- A Apple disse que Mac mini e Mac Studio podem ficar meses com oferta apertada
  porque a demanda por IA e ferramentas agentic veio mais forte que o previsto.
  Para quem roda modelo local em Apple Silicon, isso deixou de ser fofoca de
  estoque. Fonte:
  [MacRumors](https://www.macrumors.com/2026/04/30/mac-studio-mac-mini-constrained-months/).

- Mat Duggan escreveu uma fantasia bem concreta sobre como faria um GitHub
  melhor: feedback antes do commit, aprovação menos binária, stacked PR como
  cidadão de primeira classe e actions assinadas. É reclamação com gosto de
  ferramenta, não só desabafo. Fonte:
  [matduggan.com](https://matduggan.com/if-i-could-make-my-own-github/).

- Temporal finalmente está chegando ao JavaScript depois de anos no forno. Para
  quem ainda briga com `Date`, timezone e biblioteca externa, é daqueles assuntos
  evergreen que rendem vídeo sem depender de hype. Fonte:
  [Stack Overflow Blog](https://stackoverflow.blog/2026/05/01/time-is-a-construct-but-it-can-break-your-software/).

- Supersimple apareceu como perfil de OpenCode que desativa agentes padrão e
  roteia trabalho por especialistas menores. É pequeno, mas combina com a ideia
  de agente especializado sem abrir um ministério da arquitetura. Fonte:
  [GitHub](https://github.com/gc-victor/supersimple).

## Acompanhamento de tendências

O dia ficou bem claro sobre plano de controle. cPanel administra servidor.
`system_server` fala pela rede no Android. Registries alimentam CI. Quando uma
dessas peças recebe permissão demais, a falha deixa de ser local e começa a
andar pela casa.

Também apareceu a resiliência menos glamourosa. Mirrors do Ubuntu, lockfile,
escopo de token, serviço reiniciado, regra de egress e skill pequena não rendem
demo bonita sozinhos. Só aparecem quando a camada de cima quebra. É ingrato, mas
produção real é cheia dessas peças que ninguém aplaude.

E os agentes continuam ali, só que sem confete. DriftBench mostra que modelo
lembra regra e viola mesmo assim. O texto sobre Skills mostra que instrução mal
empacotada vira imposto fixo no contexto. OpenWarp e Supersimple mostram a
comunidade tentando costurar provider, prompt e especialista na unha. A parte
viva da história está no formato que aguenta rodar amanhã de novo.
