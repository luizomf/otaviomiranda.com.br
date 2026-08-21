---
title: 'OMXTerm Web: o terminal no navegador é a parte fácil'
description: 'O projeto liga xterm.js a um host SSH real e mostra onde um terminal web acumula confiança, credenciais, SSRF, limites e ciclo de vida.'
date: 2026-08-20T19:48:05-03:00
author: 'The Paper LLM'
image: './images/omxterm-web-o-terminal-no-navegador-e-a-parte-facil.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/omxterm-web-o-terminal-no-navegador-e-a-parte-facil/final.opus'
---

![Palco com terminal OMXTerm Web e cortina aberta para o broker ligado a uma porta SSH.](./images/omxterm-web-o-terminal-no-navegador-e-a-parte-facil.jpg)

Você abre uma aba, vê o cursor piscando e pronto: parece que o terminal foi morar no navegador. Só parece. O shell continua em outra máquina, atrás de uma conexão SSH, enquanto um servidor no meio recebe credenciais, escolhe o destino, abre a sessão e depois tenta fechar a lojinha sem deixar um pequeno incêndio operacional.

É nesse servidor do meio que o OMXTerm Web fica interessante. O MVP open source criado por Otávio Miranda usa xterm.js na interface e um broker em Node.js para chegar a um host SSH real. A tela é a parte bonita. O trabalho pesado está em decidir quem pode abrir a conexão, em qual máquina, confiando em qual chave e por quanto tempo.

## O navegador desenha o terminal; o shell mora no alvo

O OMXTerm Web tem três atores. O frontend em React usa xterm.js para desenhar a tela, capturar o teclado e acompanhar o tamanho da janela. O broker usa Fastify, WebSocket e a biblioteca `ssh2`. Na outra ponta está o servidor escolhido pelo usuário, onde o SSH cria o pseudoterminal, ou PTY, e executa o processo interativo.

Essa separação desfaz uma confusão comum: xterm.js é um emulador de terminal no frontend. Ele interpreta a saída e mantém a grade visual. Bash, Zsh ou qualquer outro shell não aparece ali por osmose. A própria documentação do xterm.js descreve o uso normal como uma ligação entre a entrada e a saída do componente e uma API de pseudoterminal.

No OMXTerm, os bytes fazem uma viagem. O navegador envia eventos pelo WebSocket. O broker traduz a conversa para o canal SSH. No host remoto, o processo interativo enxerga um lado do PTY, enquanto o controlador lê e escreve pelo outro. A janela é só o pedaço que você vê. A autoridade para alcançar a máquina está espalhada pelo caminho inteiro.

É como instalar uma campainha com vídeo e descobrir que o projeto difícil sempre foi decidir quem abre o portão.

Fontes: [README do OMXTerm Web](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/README.md#L1-L8) e [README oficial do xterm.js](https://github.com/xtermjs/xterm.js/blob/master/README.md#L1-L43).

## Antes do SSH existe uma fila de decisões

A conexão não pula do formulário direto para o SSH. Primeiro, o usuário passa por um token de acesso. O broker cria cookies de sessão e dispositivo. Depois vêm a sondagem da chave do host, a emissão de um ticket de terminal, o upgrade para WebSocket e, finalmente, a conexão SSH com o PTY remoto.

Esse ticket dura 60 segundos, vale uma vez e fica vinculado à sessão, ao dispositivo e ao `Origin` esperado. Assim que é consumido corretamente, some. Isso reduz replay e dificulta o sequestro de WebSocket entre sites, o tal Cross-Site WebSocket Hijacking. Como o navegador entrega cookies automaticamente, uma página de outra origem não deveria herdar a mesma autoridade só porque conseguiu iniciar uma conexão.

O `Origin` tem uma função bem específica. Scripts e bots fora do navegador conseguem forjar esse header, então ele participa do controle sem virar uma identidade universal de qualquer cliente que saiba soletrar HTTPS.

E tem um detalhe operacional daqueles que gostam de esperar a sexta-feira: o ticket viaja na query string do upgrade WebSocket. Ele expira rápido, tem uso único e está amarrado ao contexto, mas o proxy pode registrar a URL inteira. A aplicação evita esse conteúdo no audit log. A borda e o proxy também precisam omitir query strings. Segredo curto ainda é segredo. Só corre mais depressa.

Fontes: [How OMXTerm Web works](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L40-L70) e [Exposing OMXTerm Web publicly](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/public-exposure.md#L99-L123).

## O fingerprint observado ainda precisa de confiança

Antes de pedir autenticação, o broker sonda a chave do host e mostra o fingerprint ao usuário. Quando abre a conexão de verdade, calcula o fingerprint outra vez e compara com o valor aceito. Uma troca entre a sondagem e a abertura do SSH aparece nessa conferência.

Agora vem a pegadinha: as duas observações passam pelo mesmo caminho. Se essa rota já estiver interceptada, a sonda pode mostrar a chave do intermediário e a conexão seguinte pode encontrar a mesmíssima chave. A coincidência confirma consistência naquela rota. A identidade original da máquina precisa de outra fonte.

Por isso a documentação pede que o fingerprint seja comparado com uma fonte independente. É o mesmo princípio descrito pelo OpenSSH: fingerprints ajudam a verificar chaves de host quando a confiança não vem toda do canal que você está tentando verificar.

O MVP não persiste `known_hosts`. A memória de confiança fica com a pessoa e vale para aquela sessão. É uma escolha simples e explícita para o estágio atual, acompanhada do custo: o usuário precisa buscar a confirmação por outro canal sempre que necessário. Conveniência e memória de confiança não brotam espontaneamente porque o terminal ganhou CSS.

Fontes: [documentação de confirmação da chave do host](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L188-L229) e [manual `ssh(1)` do OpenSSH](https://man.openbsd.org/ssh.1#VERIFYING_HOST_KEYS).

## A proteção contra SSRF depende da configuração

O broker recebe do usuário o host ao qual fará SSH. Com isso, ele também pode virar uma ponte para endereços acessíveis apenas pelo servidor. Essa classe de problema é SSRF: uma entrada externa convence o backend a iniciar uma conexão de rede em nome dela.

O projeto oferece uma allowlist de saída por CIDR. Com `OMXTERM_SSH_ALLOWED_CIDR` configurada, todos os resultados da resolução DNS precisam ser válidos e estar na faixa permitida da família exata, IPv4 ou IPv6. O broker escolhe o primeiro IP canônico aprovado e o fixa para a conexão, sem resolver o nome outra vez na hora do dial. Essa combinação reduz destinos fora da política e a janela para DNS rebinding.

A palavra importante é “configurada”. Sem a variável, a política declarada é `unrestricted`, preservando o uso local do demo. Hosts internos ficam acessíveis conforme a rede do broker. Quem expõe o serviço precisa desenhar a fronteira de saída do próprio ambiente; o código não adivinha qual sub-rede guarda o banco de produção e qual guarda a cafeteira inteligente do escritório.

Fonte: [`ssh-egress-policy.ts`](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/apps/server/src/ssh-egress-policy.ts#L1-L29).

## Soltar referências da chave não apaga a memória

O material de autenticação atravessa a requisição do ticket e passa algum tempo na memória do broker. Para encurtar a retenção de referências conhecidas, o projeto fixa `ssh2` exatamente na versão 1.17.0 e aplica uma adaptação própria durante o `postinstall`.

A adaptação mexe em arquivos internos da dependência porque a versão original não oferece o hook necessário. O script confere versão, integridade e hashes dos arquivos completos. Se a estrutura mudar ou o contrato esperado não existir em runtime, o processo falha. Melhor quebrar com barulho do que continuar trabalhando em cima de uma suposição vencida.

O preço vem junto. Na prática, o projeto mantém uma espécie de fork reaplicado dentro de `node_modules`. Atualizar `ssh2` exige revisar a adaptação e seus hashes. Trocar o número no `package.json` e admirar o CI verde de longe não encerra o serviço.

A garantia também tem um limite preciso: o mecanismo libera referências conhecidas, sem prometer apagar fisicamente a chave da RAM. Strings imutáveis, cópias feitas pelo V8, o coletor de lixo, alocações nativas do OpenSSL, swap e dumps ficam fora. “Reduzir a retenção” descreve o que existe. Zeroização de memória exigiria um contrato que esse runtime não oferece.

Fontes: [adaptação do material de autenticação do `ssh2`](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/scripts/ssh2-auth-material-adaptation.mjs#L1-L30) e [limites do descarte de credenciais](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L372-L438).

## Encerrar a sessão também faz parte do produto

Um terminal interativo produz fluxo contínuo nos dois sentidos. Se o navegador envia mais rápido do que o SSH consome, o broker acumula trabalho. Se a conexão desaparece sem fechar a sessão remota, acumula estado também. O projeto lida com isso usando limite de payload, heartbeat, limites de mensagens, bytes e fila, coalescência de resize e destruição da sessão SSH quando o WebSocket desconecta.

Os números documentados incluem payload WebSocket de 64 KiB, heartbeat a cada 30 segundos, até cinco sessões SSH ativas por sessão e 50 WebSockets globais. O flood guard também limita mensagens, volume por segundo e fila de entrada. O escopo desses controles é o abuso individual e as sessões órfãs dentro da aplicação.

Ataque distribuído ou volumétrico chega com outra conta. Para exposição fora de loopback, a documentação exige HTTPS e WSS terminados num proxy, além de cookies `Secure`; o broker não termina TLS. Configuração de `trustProxy`, rate limiting e higiene dos logs da borda entram nessa fronteira. O app cuida do que chega ao processo. A enchente que lota o link antes disso precisa ser contida em outro lugar.

Fontes: [controles de ciclo de vida e abuso](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/public-exposure.md#L17-L78) e [limites da exposição pública](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/public-exposure.md#L99-L123).

## O MVP escolheu estado em memória e aceita a conta

Sessões, dispositivos, probes e tickets vivem num único processo. O projeto não persiste chaves, perfis, transcrições ou `known_hosts`. Também não oferece contas, store compartilhado, múltiplas instâncias, reconexão ou retomada. Reiniciar o broker derruba as conexões e leva embora o estado temporário.

Isso simplifica a destruição de sessões e deixa o fluxo estudável. Também tira alta disponibilidade e escala horizontal da mesa por enquanto. Uma segunda instância não conhece o ticket emitido pela primeira. Uma sessão caída recomeça do zero. Se o broker for comprometido enquanto manipula autenticação, o atacante está exatamente no lugar por onde passam a credencial e a autoridade de conexão.

O usuário define o privilégio final no host SSH. Uma conta remota poderosa continua poderosa. TLS fica com a borda, a confirmação independente do fingerprint com o operador e a disponibilidade com a infraestrutura. Os controles do projeto reduzem riscos específicos dentro desses limites.

O estado inspecionado foi o commit `6fe50dc1`, de 20 de agosto de 2026. O CI desse SHA passou por instalação, verificação da adaptação, audit, lint, checagem de tipos, testes e build. O teste completo, do navegador até um SSH real, é opt-in e fica fora do job rápido padrão. O selo verde confirma a automação configurada. Auditoria independente, pentest e garantia absoluta são trabalhos bem maiores que alguns pixels coloridos.

Fontes: [limites atuais do OMXTerm Web](https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L553-L575) e [execução do CI no commit pesquisado](https://github.com/luizomf/omxterm-web/actions/runs/32368123100).

## O vídeo explica o terminal; o repositório mostra o recorte atual

O projeto começou em 27 de junho de 2026 e recebeu ondas de hardening nos meses seguintes. Em 20 de agosto, Otávio publicou o vídeo “Você NÃO SABE NADA sobre o terminal”. Naquela manhã, o repositório principal passou a apontar para o vídeo, enquanto um repositório auxiliar reuniu diagramas, scripts e uma demonstração didática de PTY usados na gravação.

A demo em Python percorre `openpty`, `fork`, `setsid`, controlling TTY, `dup2` e `exec`. Ela revela a mecânica entre processo e pseudoterminal sem implementar um parser VT ou ANSI completo. Os scripts de deploy pertencem ao cenário gravado, são específicos e incluem um reset destrutivo do Docker do host. Material didático. Receita para colar no servidor depois do almoço, não.

O SHA exato executado na gravação não foi identificado. O vídeo fornece o enquadramento, e o repositório auxiliar documenta as demonstrações. Já o estado técnico desta análise está preso ao commit `6fe50dc1` do projeto principal e ao commit `586f9f1` dos materiais. Assim, cada controle atual fica atribuído ao código atual, sem ser colocado na boca do vídeo.

Essa diferença entre aparência e mecanismo é a melhor parte do OMXTerm Web. xterm.js resolve a superfície com a qual você conversa. Logo atrás vêm identidade do host, saída de rede, retenção de credenciais, pressão de fluxo, desligamento e operação. Colocar um cursor no browser é rápido. Decidir com segurança aonde ele pode levar você é o projeto de verdade.

Fontes: [materiais do vídeo no repositório `omxterm-web-video`](https://github.com/luizomf/omxterm-web-video/blob/586f9f1a58a86a5fcb6ea3aeee9f7d96bba35cbc/README.md#L1-L30) e [vídeo “Você NÃO SABE NADA sobre o terminal”](https://www.youtube.com/watch?v=up0im04clS8).

> Nota: gerado por IA (The Paper LLM), com fontes listadas por bloco.

<!--
briefing_id: none
source_urls:
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/README.md#L1-L8
  - https://github.com/xtermjs/xterm.js/blob/master/README.md#L1-L43
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L40-L70
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L188-L229
  - https://man.openbsd.org/ssh.1#VERIFYING_HOST_KEYS
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/apps/server/src/ssh-egress-policy.ts#L1-L29
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/scripts/ssh2-auth-material-adaptation.mjs#L1-L30
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L372-L438
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/public-exposure.md#L17-L78
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/public-exposure.md#L99-L123
  - https://github.com/luizomf/omxterm-web/blob/6fe50dc1efa00f84d4e384708f89d4615fbe564c/docs/how-it-works.md#L553-L575
  - https://github.com/luizomf/omxterm-web/actions/runs/32368123100
  - https://github.com/luizomf/omxterm-web-video/blob/586f9f1a58a86a5fcb6ea3aeee9f7d96bba35cbc/README.md#L1-L30
  - https://www.youtube.com/watch?v=up0im04clS8
-->
