---
title: 'Git bare em VPS: seu próprio GitHub sem GitHub'
description:
  'Entenda o que é um repositório bare, quando faz sentido usar isso em uma VPS,
  como configurar SSH com uma chave específica e como transformar git push em
  deploy simples.'
date: 2026-05-04T16:22:46-0300
author: 'Otávio Miranda'
image: './images/github.webp'
---

Git bare em VPS: seu próprio GitHub sem GitHub

Isso tem acontecido há algum tempo. Vou fazer alguma coisa que depende do GitHub
e me deparo com um erro no comando. Tento de novo... Nada! Vou no site e dou de
cara com um unicórnio colorido.

![Uma imagem mostrando a página de erro do GitHub. A imagem tem um unicórnio colorido e contém os textos: No server is currently available to service your request. Sorry about that. Please try refreshing and contact us if the problem persists. Contact Support, GitHub Status, @githubstatus](./images/github.webp)

Não ligo muito para isso. Tudo bem acontecerem alguns erros (quer dizer,
[às vezes não, né?](https://www.youtube.com/watch?v=CDedT1uQljQ)). Mas, quando
você roda uma automação às 6 da manhã no Heartbeat de modelos de LLM caríssimos,
seria muito bom acordar e ver tudo pronto para review. E eu já perdi a conta de
quantas vezes essa falha ocorreu.

O fato é: eu quero comprar um submarino. Mas o dinheiro ainda não dá. Então sigo
trabalhando e juntando.

Esses dias pra trás eu tive um "momento eureca" no banho. É sempre lá.

E eu só falei banho por educação... foi noutro momento...

Mas, sabe quando vem aquela ideia que não é nova, mas que estava guardada lá em
cima daquele seu guarda-roupa que você não limpa há uns 13 anos? Ela veio de lá.
Só dei uma lavada, repaginei e aqui estamos. Ironicamente, em uma página no
GitHub Pages.

O negócio é o seguinte. Dá para ter um servidor Git próprio com praticamente
nada além de **Linux**, **OpenSSH** e **Git**.

E não me venha com "é um GitHub caseiro". Se eu coloquei isso no título,
desculpa. Não tem botão bonito, pull request, issue, Action, estrelinha,
gráfico, mascote, nem aquela sensação de que você está usando uma rede social
disfarçada de ferramenta de versionamento.

É só Git. E, dependendo do projeto, isso é exatamente o que você quer. Vai mesmo
publicar todas essas notas privadas no GitHub com todas essas falhas de
segurança aparecendo ultimamente? Sei lá, sua declaração de imposto de renda?
Seus boletos? Faturas de cartão? Tem doido pra tudo.

Neste texto, vou te montar o caminho que usaria para colocar um repositório
**bare** em uma VPS, acessar via SSH, escolher a chave certa e usar `git push`
como gatilho de deploy.

Então, com a vossa licença, apresento-lhe o post. Bora!

## Repositório... É o quê? Bare? Bear? Bearer?

Agora virou modinha falar de "worktree". O "LinkedIner" vai à loucura quando
surge um assunto em alta assim. Tudo por conta das IAs.

E é claro que eu vou falar disso também no futuro.

![Mindset](./images/mindset.gif)

Sobre o git bare, quando criamos um repositório normal, ganhamos essas duas
coisas:

- os arquivos do projeto;
- a pasta `.git`, onde o Git guarda objetos (commits, árvores, blobs), refs
  (branches e tags), hooks, configurações e tudo que ele precisa para saber o
  que está acontecendo.

Algo assim:

```text
meu-projeto/
├── .git/
├── src/
├── package.json
└── README.md
```

Um repositório **bare** é, de forma bem simplificada, só a parte do `.git`. Tipo
pegar tudo o que está dentro de `.git` e jogar na raiz do projeto sem o projeto.

Ele não tem uma cópia de trabalho dos seus arquivos. Só guarda o histórico, refs
e os objetos do Git.

Por isso ele costuma terminar com `.git` no nome. Tipo `crud-clean-arch.git`,
`ddd-crud.git`, `crud-micro-service.git`, `hello-sass.git`...

```text
meu-projeto.git/
├── HEAD
├── objects/
├── refs/
├── hooks/
└── config
```

Veja a diferença. Em um repositório normal, `.git` fica dentro do projeto. No
bare, o próprio diretório já é o repositório.

Você cria um assim:

```bash
git init --bare meu-projeto.git
```

Saída esperada:

```text
Initialized empty Git repository in /caminho/meu-projeto.git/
```

Fala a verdade. Dá uma sensação boa isso, né? Esse momento "_ahhhhhh, entendi_"
que acabamos de ter. 🥹

## Um cenário mais real

Não é necessariamente necessário, com o perdão da redundância, mas vou usar uma
VPS para um cenário mais real.

Tem zero graça fazer `git push` para a minha própria máquina.

E como você já deve ter sentido isso chegando, também faço um plug sem vergonha
aqui da minha parceira. A Hostinger.

Se precisar de um servidor VPS, use o meu link e cupom para desconto:

- [hostinger.com/otaviomiranda](https://hostinger.com/otaviomiranda)
- Cupom: `OTAVIOMIRANDA` (10% de desconto)

Voltando ao assunto, quando você faz `git push origin main`, seu Git local
conversa com outro Git do outro lado. Esse outro lado precisa receber objetos,
atualizar refs e guardar o histórico.

Ele não precisa ter uma cópia de trabalho aberta.

Na verdade, se você tentar dar `push` para um repositório normal em que a branch
está checada, o Git costuma recusar. E isso faz sentido. Imagine que o servidor
está com `main` aberta em disco e você empurra uma versão nova por cima.

O que acontece com os arquivos que já estavam lá? E com alteração local? E com o
índice do Git?

É o tipo de coisa que parece funcionar até o dia em que apaga algo ou deixa o
servidor em um estado esquisito.

Com bare repo, a separação fica clara:

- `/srv/git/meuapp.git` é o repositório remoto;
- `/var/www/meuapp` é onde a aplicação pode ser publicada;
- seu notebook continua sendo onde você trabalha;
- a VPS recebe `push` via SSH.

Essa separação é o motivo da coisa toda.

## Git bare não é GitHub

Só pra constar, aqui vai uma comparação bem besta, mas útil.

O **Git** é o motor. O **GitHub** e o **GitLab** são plataformas inteiras em
volta desse motor.

Quando você usa GitHub, você ganha Git remoto, interface web, pull request,
review, issue, Actions, permissões, integrações, webhooks, releases, pacotes e
um monte de coisas que não fazem parte do Git em si.

Quando você usa um bare repo em uma VPS, você ganha basicamente isto:

- `git clone`;
- `git fetch`;
- `git pull`;
- `git push`;
- SSH;
- hooks do Git, se quiser automatizar algo.

E é só. Mas, isso seria ruim? Sei lá. Depende!

Se você quer trabalhar com time, fazer review formal, controlar permissão por
branch, rodar pipeline, auditar tudo e ter uma interface confortável, bare repo
puro vai ficar pequeno rápido.

Mas, se você quer um remoto privado para projeto pessoal, um ambiente simples de
staging, um deploy direto para uma VPS ou um servidor Git interno para poucas
pessoas, ele resolve muito bem.

É como usar SQLite em vez de subir um cluster de banco. Às vezes, a resposta
certa é justamente a que tem menos peça para quebrar.

## Quando EU usaria?

Eu usaria Git bare em VPS para:

- projeto pessoal privado;
- site estático;
- app pequeno;
- protótipo;
- staging;
- ferramenta interna;
- deploy simples por SSH;
- cenário em que eu quero controle e não quero depender de plataforma externa.

Eu pensaria duas vezes antes de usar para:

- time grande;
- projeto com muitos juniores dependendo de review visual;
- fluxo pesado de pull requests;
- permissão fina por branch;
- Git LFS pesado;
- auditoria formal;
- CI/CD mais sofisticado;
- código em que a equipe precisa de uma forge completa.

Se você quer continuar self-hosted, mas precisa de interface, dá para olhar
Gitea ou Forgejo. Se o problema é só controle de acesso mais fino via SSH, o
Gitolite existe há muito tempo e resolve uma parte disso.

Mas, para este texto, vou ficar no Git puro.

## A nossa VPS

Vou assumir uma VPS Linux com Ubuntu ou Debian. Se você estiver em outra distro,
troque `apt` pelo gerenciador de pacotes correspondente.

A ideia é:

```text
Notebook
  |
  | git push vps main
  v
VPS
  |
  | /srv/git/meuapp.git        # repositório bare
  | /var/www/meuapp/current    # arquivos publicados
```

O usuário `git` recebe os pushes.

O repositório bare fica em `/srv/git`.

O diretório publicado fica em `/var/www/meuapp/current`.

Não coloque o bare repo dentro do diretório servido pelo nginx/Apache.

Ou seja, evite coisas assim:

```text
/var/www/meuapp/meuapp.git
```

Se o webserver expõe isso por acidente, você pode acabar entregando o histórico
do seu projeto inteiro por HTTP. Aí nem precisa atacante sofisticado. Você mesmo
montou o buffet.

## Preparando a VPS

No servidor:

```bash
sudo apt update
sudo apt install -y git openssh-server
```

Agora criamos um usuário dedicado para o Git:

```bash
sudo adduser --disabled-password --gecos "" git
```

Criamos a pasta `.ssh` desse usuário com as permissões corretas:

```bash
sudo install -d -m 700 -o git -g git /home/git/.ssh
sudo install -m 600 -o git -g git /dev/null /home/git/.ssh/authorized_keys
```

E criamos o diretório onde os repositórios bare vão ficar:

```bash
sudo install -d -o git -g git /srv/git
```

Agora criamos o bare repo:

```bash
sudo -u git git init --bare --initial-branch=main /srv/git/meuapp.git
```

Saída esperada:

```text
Initialized empty Git repository in /srv/git/meuapp.git/
```

Também gosto de configurar duas travas básicas no repo central:

```bash
sudo -u git git --git-dir=/srv/git/meuapp.git config receive.denyNonFastForwards true
sudo -u git git --git-dir=/srv/git/meuapp.git config receive.denyDeletes true
```

A primeira evita `push --force` destrutivo.

A segunda evita apagar branch via push.

Dá para desativar depois? Dá. Mas, como padrão de servidor central, eu prefiro
começar chato e aliviar se tiver motivo. Pode pular isso se quiser.

Mas começar permissivo e descobrir depois que alguém apagou `main` é uma
experiência que eu ainda não passei e espero continuar assim.

## A parte do SSH que confunde

Aqui tem uma distinção importante.

Quando você faz `git push` do seu notebook para a VPS, **quem escolhe a chave
privada é o seu notebook**.

A VPS não "usa uma chave privada" para receber esse push. Ela recebe uma conexão
SSH e verifica se a chave pública correspondente está em
`/home/git/.ssh/authorized_keys`.

Então o fluxo é:

```text
notebook usa chave privada -> VPS confere chave pública -> SSH libera -> Git recebe push
```

Isso resolve a dúvida mais comum.

Se o **servidor** também precisar acessar outro Git remoto, por exemplo clonar
um repositório privado do GitHub dentro de um hook ou script, aí sim o Git
rodando no servidor precisa escolher uma chave privada específica.

Vamos cobrir os dois casos.

## Criando uma chave específica para a VPS

Na sua máquina local:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_vps_git -C "vps-git"
```

Isso cria dois arquivos:

```text
~/.ssh/id_ed25519_vps_git      # chave privada, fica com você
~/.ssh/id_ed25519_vps_git.pub  # chave pública, vai para a VPS
```

Agora você copia a chave pública para o servidor. Pode ser com `ssh-copy-id`,
mas vou mostrar do jeito explícito porque assim você entende onde ela fica:

```bash
cat ~/.ssh/id_ed25519_vps_git.pub
```

Copie a linha que apareceu.

No servidor, cole essa chave em `/home/git/.ssh/authorized_keys`:

```bash
echo 'ssh-ed25519 COLE_A_CHAVE_PUBLICA_AQUI vps-git' | sudo tee -a /home/git/.ssh/authorized_keys >/dev/null
sudo chown git:git /home/git/.ssh/authorized_keys
sudo chmod 600 /home/git/.ssh/authorized_keys
```

Agora teste da sua máquina local:

```bash
ssh -i ~/.ssh/id_ed25519_vps_git -o IdentitiesOnly=yes git@SEU_IP
```

Se entrar, beleza. Saia com:

```bash
exit
```

Depois que você testou o acesso, dá para restringir o usuário `git` para aceitar
apenas comandos Git:

```bash
sudo chsh -s "$(command -v git-shell)" git
```

O `git-shell` vem com o próprio Git. Ele bloqueia login interativo normal, mas
permite comandos de servidor como `git-receive-pack` e `git-upload-pack`, que
são justamente os comandos usados por `git push` e `git fetch`.

Depois disso, se você rodar:

```bash
ssh git@SEU_IP
```

Pode receber algo parecido com:

```text
fatal: Interactive git shell is not enabled.
```

Isso não é erro para o nosso caso. Na verdade, é o que a gente queria.

O usuário `git` não é para ficar navegando no servidor. Ele é para receber Git.

## Fazendo o Git usar a chave certa

Agora vem a parte que eu mesmo erro às vezes.

Você provavelmente já tem uma chave para GitHub, outra para algum servidor,
outra para trabalho, outra esquecida de 2021 com nome esquisito. Não me pergunte
nem de onde é.

Se você não configurar nada, o SSH pode tentar várias chaves do seu `ssh-agent`
até acertar uma. Em alguns servidores, isso termina em:

```text
Too many authentication failures
```

Ou pior: você autentica com a chave errada e fica tentando entender por que está
logando como outra identidade.

A forma mais limpa que eu encontrei é usar `~/.ssh/config`. Sempre me salvando.

Na sua máquina local:

```text
Host minha-vps-git
    HostName SEU_IP
    User git
    IdentityFile ~/.ssh/id_ed25519_vps_git
    IdentitiesOnly yes
```

O detalhe importante é `IdentitiesOnly yes`.

Sem isso, o SSH ainda pode oferecer chaves que estão no agent antes da chave que
você colocou em `IdentityFile`. Com isso, ele usa a identidade configurada para
aquele host.

Agora você pode usar o alias `minha-vps-git` como se fosse o servidor:

```bash
ssh minha-vps-git
```

E no Git:

```bash
cd /caminho/do/seu/projeto
git remote add vps minha-vps-git:/srv/git/meuapp.git
git push -u vps main
```

Saída esperada em um primeiro push:

```text
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 220 bytes | 220.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
To minha-vps-git:/srv/git/meuapp.git
 * [new branch]      main -> main
branch 'main' set up to track 'vps/main'.
```

Pronto. Você tem um remoto Git privado na sua VPS.

Não tem UI. Não tem PR. Não tem Action.

Mas tem `git push`.

E, para muita coisa, isso já é bastante.

## Alternativas ao `~/.ssh/config`

Eu prefiro `~/.ssh/config` porque ele funciona para `ssh`, `scp`, `rsync`, Git e
qualquer outro cliente que use SSH.

Mas existem alternativas.

Para um comando só:

```bash
GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_vps_git -o IdentitiesOnly=yes' \
  git push vps main
```

Para deixar configurado só em um repositório local:

```bash
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_vps_git -o IdentitiesOnly=yes"
```

Essa configuração fica em `.git/config` do projeto atual.

Eu usaria assim:

- `~/.ssh/config` para uso diário;
- `core.sshCommand` quando quero prender uma chave a um repo específico;
- `GIT_SSH_COMMAND` em script, CI ou teste pontual.

## E se o servidor precisar usar uma chave SSH?

Agora o outro caso.

Imagine que, dentro da VPS, o usuário `git` precisa clonar um repositório
privado do GitHub. Nesse caso, o servidor virou cliente SSH. Aí sim ele precisa
de uma chave privada própria.

No servidor:

```bash
sudo -u git ssh-keygen -t ed25519 -f /home/git/.ssh/id_ed25519_github -C "vps-github"
```

Veja a chave pública:

```bash
sudo cat /home/git/.ssh/id_ed25519_github.pub
```

Você adiciona essa chave pública no lugar adequado do serviço remoto. No GitHub,
por exemplo, isso pode ser uma **Deploy Key** do repositório.

Depois, configure o SSH do usuário `git`:

```bash
sudo tee /home/git/.ssh/config >/dev/null <<'EOF'
Host github-vps
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes
EOF

sudo chown git:git /home/git/.ssh/config
sudo chmod 600 /home/git/.ssh/config
```

Agora, quando um comando rodar como `git`, ele pode usar o alias:

```bash
sudo -u git git clone github-vps:USUARIO/REPO.git /tmp/teste-repo
```

Esse é o caso em que "o Git do servidor usa uma chave específica".

Para receber `push` da sua máquina, não é isso. Para o servidor acessar outro
repositório, é isso.

## Transformando push em deploy

Até aqui, a VPS já funciona como remoto Git.

Agora vem a parte divertida: usar um hook para publicar os arquivos quando você
der `push` na branch `main`.

No servidor, crie o diretório de deploy:

```bash
sudo install -d -o git -g www-data -m 2750 /var/www/meuapp/current
```

Se seu nginx/Apache/app não usa `www-data`, ajuste o grupo para o usuário real
do serviço.

Agora crie o hook `post-receive`:

```bash
sudo tee /srv/git/meuapp.git/hooks/post-receive >/dev/null <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail

BRANCH="refs/heads/main"
REPO="/srv/git/meuapp.git"
TARGET="/var/www/meuapp/current"

while read -r oldrev newrev ref; do
    if [ "$ref" != "$BRANCH" ]; then
        echo "Ignorando $ref"
        continue
    fi

    mkdir -p "$TARGET"
    git --git-dir="$REPO" --work-tree="$TARGET" checkout -f "$newrev"

    echo "Deploy publicado em $TARGET"
    echo "Commit: $newrev"
done
EOF

sudo chown git:git /srv/git/meuapp.git/hooks/post-receive
sudo chmod +x /srv/git/meuapp.git/hooks/post-receive
```

Agora, no seu projeto local:

```bash
git push vps main
```

Você deve ver mensagens do remoto:

```text
remote: Deploy publicado em /var/www/meuapp/current
remote: Commit: a1b2c3d4...
```

O `post-receive` roda no servidor depois que o Git atualiza as refs. Ele recebe
no `stdin` três valores por linha:

```text
oldrev newrev ref
```

Por isso o script consegue saber qual branch recebeu push.

Também tem outro detalhe importante: hooks disparados por `push` rodam dentro do
`$GIT_DIR`. Em repo bare, isso significa que caminho relativo vira uma armadilha
fácil. Use caminho absoluto no hook. É chato, mas é o chato que evita surpresa.

## Esse hook simples tem um limite

O hook acima é bom para aprender e para deploy simples.

Mas ele faz checkout em cima do mesmo diretório sempre:

```text
/var/www/meuapp/current
```

Isso significa que arquivos não rastreados podem ficar ali entre deploys. Às
vezes isso é exatamente o que você quer, como uploads, `.env`, cache local ou
arquivos gerados. Às vezes é lixo velho.

Se você quer um deploy mais limpo, eu prefiro releases versionadas:

```text
/var/www/meuapp/releases/20260503153000-a1b2c3
/var/www/meuapp/releases/20260503154510-d4e5f6
/var/www/meuapp/current -> /var/www/meuapp/releases/20260503154510-d4e5f6
```

Cada deploy cria uma pasta nova. Depois, o symlink `current` aponta para a
release mais recente.

Rollback fica muito mais simples:

```bash
sudo ln -sfn /var/www/meuapp/releases/RELEASE_ANTERIOR /var/www/meuapp/current
```

Se tiver um serviço rodando:

```bash
sudo systemctl restart meuapp.service
```

Não vou colocar esse como primeiro exemplo porque ele distrai um pouco da ideia
principal. Mas, para produção, é o desenho que eu gosto mais.

O `git checkout -f` é simples. Release versionada é mais disciplinada.

## E build?

Depende do projeto.

Se você está publicando um site estático já pronto, talvez o hook só precise
colocar arquivos no lugar certo.

Se é Node, Python, PHP, Go ou qualquer coisa que precisa buildar, você tem
algumas escolhas:

- buildar local e enviar artefato;
- buildar em CI e enviar artefato;
- buildar na VPS dentro do hook;
- fazer o hook chamar um script de deploy separado.

O que eu evitaria: transformar o `post-receive` em uma novela de 300 linhas.

Hook bom é curto, previsível e fácil de debugar. Se o deploy ficou complexo,
chame um script:

```bash
/usr/local/bin/deploy-meuapp "$newrev"
```

E deixe o script cuidar do resto.

Também evite dar `sudo` amplo para o usuário `git`. Se ele precisa reiniciar um
serviço, libere só aquele comando no `sudoers`.

Exemplo:

```text
git ALL=(root) NOPASSWD: /bin/systemctl restart meuapp.service
```

Não faça:

```text
git ALL=(ALL) NOPASSWD: ALL
```

A segunda linha é basicamente dizer: "usuário que recebe push agora manda no
servidor inteiro".

Coragem, mas não nesse sentido.

## Troubleshooting rápido

Se der:

```text
Permission denied (publickey).
```

Verifique:

```bash
ssh -v minha-vps-git
```

No servidor:

```bash
ls -ld /home/git/.ssh
ls -l /home/git/.ssh/authorized_keys
```

Você quer algo assim:

```text
drwx------ 2 git git ... /home/git/.ssh
-rw------- 1 git git ... /home/git/.ssh/authorized_keys
```

Se der:

```text
Too many authentication failures
```

Confira se o bloco do `~/.ssh/config` tem:

```text
IdentitiesOnly yes
```

Se o hook não rodar:

```bash
ls -l /srv/git/meuapp.git/hooks/post-receive
```

Você quer ver o bit de execução:

```text
-rwxr-xr-x 1 git git ... post-receive
```

Se você recebeu:

```text
refusing to update checked out branch
```

Provavelmente empurrou para um repositório não-bare. Volta duas casas e cria o
repo com:

```bash
git init --bare
```

Se o deploy publicou, mas a aplicação não lê os arquivos, olhe usuário, grupo e
permissão do diretório em `/var/www`.

Metade dos problemas de "Git não funciona" nessa área são SSH e permissão Unix.
O Git só estava passando perto e levou a culpa.

## As fontes

Óbvio que não sei essas coisas de cabeça. A zoeira tá sempre lá, mas comandos
são só doc mesmo.

- [Git: `git init`](https://git-scm.com/docs/git-init)
- [Git: hooks](https://git-scm.com/docs/githooks)
- [Git: `git-shell`](https://git-scm.com/docs/git-shell)
- [Git: `git config`](https://git-scm.com/docs/git-config)
- [Pro Git: Git on the Server](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols)
- [OpenSSH: `ssh_config`](https://man.openbsd.org/ssh_config)

## Pra finalizar

Git bare é uma daquelas coisas que parecem antigas demais para serem úteis até
você lembrar que o Git foi feito justamente para isso: mover histórico entre
máquinas.

Você não precisa de uma plataforma inteira para todo projeto.

Às vezes, uma VPS, um usuário `git`, uma chave SSH, um bare repo e um hook
pequeno resolvem.

Só não confunda simplicidade com improviso.

Separe o repositório bare do diretório publicado. Use chave SSH específica. Use
`IdentitiesOnly yes`. Não coloque o `.git` dentro do webserver. Teste o acesso
antes de desligar senha. Não dê `sudo` infinito para o usuário do Git. E, se o
deploy for ficando sério, pense em releases e rollback.

Pronto, já dei a lição de moral (opa, de segurança), agora o resto é Git.

Ah... já tava esquecendo. Eu te aviso quando comprar o submarino.
