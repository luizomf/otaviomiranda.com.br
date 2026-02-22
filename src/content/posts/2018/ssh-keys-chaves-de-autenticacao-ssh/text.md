---
title: 'SSH keys: chaves de autenticação SSH'
description: 'SSH keys: chaves de autenticação SSH'
date: 2018-04-04
---

<h1>SSH keys: chaves de autenticação SSH</h1>

<p class="author">
  <span class="meta-date">
    <time datetime="2018-04-04">4 de abril de 2018</time>
  </span>
  ·
  <span class="meta-author">Luiz Otávio Miranda</span>
</p>

<p>
  SSH keys são chaves de autenticação SSH para
  aprimorar a segurança do servidor remoto. Nesse artigo
  você vai aprender a configurar o par de chaves
  pública/privada no seu computador local (com Linux ou Windows)
  e no servidor remoto.
</p>

<p>
  Se você administra um servidor e este funciona constantemente
  online, provavelmente faz acesso a ele via SSH (Secure Shell). E, se
  já faz algum tempo que esse seu servidor está online,
  é certo que já deve ter visto algumas coisas estranhas
  nos logs, como tentativas de login no seu arquivo
  <strong>/var/log/auth.log</strong> vindas de vários IPs
  diferentes. Isso, provavelmente, pode ser alguém tentando fazer
  brute force no seu servidor.
</p>

<p>
  Existem várias maneiras de prevenir
  <a href="https://www.profissionaisti.com.br/2011/11/o-que-e-brute-force-nada-alem-de-forca-bruta/">brute force</a>, e vários outros ataques, apenas manipulando regras de
  firewall. Um bom exemplo disso é a
  <a href="https://cloud.google.com/">Google Cloud</a>, que permite
  liberar portas específicas nas VMs apenas para sua rede,
  porém, não são todos os provedores que permitem
  tal configuração.
</p>

<p>
  Outra forma muito eficaz para aumentar a segurança do seu
  servidor e ainda prevenir brute force é usar as SSH Keys
  (chaves de autenticação SSH) e eliminar a possibilidade
  de login por senha.
</p>

<p>
  As SSH Keys funcionam no modo chave pública e chave privada
  (sempre em pares), onde a conexão SFTP/SSH só é
  autorizada se a <strong>chave privada</strong> do usuário do
  computador cliente bater com a
  <strong>chave pública</strong> do usuário do servidor.
</p>

<p>
  Soa um tanto complexo, né? Mas você vai entender
  direitinho ao terminar esse artigo.
</p>

<h2>Antes de continuar</h2>

<p>
  Será necessário um servidor com OpenSSH instalado e um
  usuário com acesso
  <a href="https://www.todoespacoonline.com/w/2015/10/su-sudo-e-sudoers-no-linux/">sudo</a>
  nesse servidor.
</p>

<p>
  <strong>Atenção:</strong> se você está
  fazendo isso em um servidor de produção, não
  feche sua conexão SSH antes de criar uma nova conexão e
  conseguir se conectar com sucesso. Do contrário, pode ser que
  você perca acesso SSH e SFTP ao servidor. Além disso,
  preste bastante atenção no que está fazendo para
  conseguir voltar as configurações anteriores caso
  necessário.
</p>

<h2>Divergência de usuários</h2>

<p>
  É importante que você saiba que não é
  necessário que os usuários do computador local e do
  servidor remoto tenham o mesmo nome, ou seja, você pode criar
  uma chave para um usuário chamado
  “Joãozinho” no computador local, porém ele
  vai se conectar no usuário “Zézinho” no
  servidor remoto.
</p>

<p>
  Porém, a chave privada do usuário Joãozinho
  precisa bater com a chave pública do usuário
  Zézinho no servidor.
</p>

<h2>Criando SSH Keys no Linux</h2>

<p>
  Se o seu computador local tem o Linux com OpenSSH instalados, basta
  digitar o seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">ssh-keygen</span><span style="color:#A6E3A1"> -t</span><span style="color:#A6E3A1"> rsa</span></span></code></pre>

<p>
  Ao pressionar “Enter” você verá algo parecido
  com:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">Generating</span><span style="color:#A6E3A1"> public/private</span><span style="color:#A6E3A1"> rsa</span><span style="color:#A6E3A1"> key</span><span style="color:#A6E3A1"> pair.</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">Enter</span><span style="color:#A6E3A1"> file</span><span style="color:#A6E3A1"> in</span><span style="color:#A6E3A1"> which</span><span style="color:#A6E3A1"> to</span><span style="color:#A6E3A1"> save</span><span style="color:#A6E3A1"> the</span><span style="color:#A6E3A1"> key</span><span style="color:#CDD6F4"> (/home/joaozinho/.ssh/id_rsa):</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">Created</span><span style="color:#A6E3A1"> directory</span><span style="color:#A6E3A1"> '/home/joaozinho/.ssh'.</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">Enter</span><span style="color:#A6E3A1"> passphrase</span><span style="color:#CDD6F4"> (empty </span><span style="color:#A6E3A1">for</span><span style="color:#A6E3A1"> no</span><span style="color:#A6E3A1"> passphrase</span><span style="color:#CDD6F4">):</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">Enter</span><span style="color:#A6E3A1"> same</span><span style="color:#A6E3A1"> passphrase</span><span style="color:#A6E3A1"> again:</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">Your</span><span style="color:#A6E3A1"> identification</span><span style="color:#A6E3A1"> has</span><span style="color:#A6E3A1"> been</span><span style="color:#A6E3A1"> saved</span><span style="color:#A6E3A1"> in</span><span style="color:#A6E3A1"> /home/joaozinho/.ssh/id_rsa.</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">Your</span><span style="color:#A6E3A1"> public</span><span style="color:#A6E3A1"> key</span><span style="color:#A6E3A1"> has</span><span style="color:#A6E3A1"> been</span><span style="color:#A6E3A1"> saved</span><span style="color:#A6E3A1"> in</span><span style="color:#A6E3A1"> /home/joaozinho/.ssh/id_rsa.pub.</span></span>
<span class="line"><span style="color:#F38BA8;font-style:italic">...</span></span></code></pre>

<p>
  Na primeira linha é requisitado que você especifique onde
  deseja gerar a chave. Não é necessário alterar
  este local, ela será gerada na sua
  <strong>pasta local</strong> dentro de uma pasta oculta chamada
  <strong>.ssh</strong>.
</p>

<p>
  <strong>Atenção:</strong> em “Enter
  passphrase”, digite uma senha forte e que você se lembre
  posteriormente. Essa senha sempre será utilizada para realizar
  a primeira conexão SSH com o servidor. Assim, se você
  perder ou alguém roubar sua chave, não conseguirá
  acesso ao servidor sem saber sua “senha forte”.
  Será necessário repetir essa senha na linha “Enter
  same passphrase again”.
</p>

<h2>Criando uma SSH Key para outro usuário no Linux</h2>

<p>
  Apesar de ser algo privado de um usuário e ele mesmo deveria
  criar e guardar sua própria chave, você pode gerar uma
  chave para outro usuário apenas alterando o caminho onde ela
  é salva no comando explicado anteriormente.
</p>

<p>
  Mas, se você tem acesso sudo no computador, pode digitar o
  seguinte:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">sudo</span><span style="color:#A6E3A1"> -u</span><span style="color:#A6E3A1"> joaozinho</span><span style="color:#A6E3A1"> ssh-keygen</span><span style="color:#A6E3A1"> -t</span><span style="color:#A6E3A1"> rsa</span></span></code></pre>

<p>
  Apenas altere “joaozinho” para o nome de usuário
  que deseja criar a chave. Se você não alterar nada, as
  chaves pública e privada serão geradas na pasta .ssh
  dentro da home do usuário “joaozinho”.
</p>

<h2>Como ver a chave pública</h2>

<p>
  Como é a chave pública que será copiada para o
  servidor, você só vai precisar copiar ela. Para isso,
  digite:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">cat</span><span style="color:#A6E3A1"> /home/joaozinho/.ssh/id_rsa.pub</span></span></code></pre>

<p>
  Apenas altere “joaozinho” para o seu usuário ou
  nome de usuário que deseja copiar a chave.
</p>

<p>
  Lembre-se que as permissões desse arquivo são voltadas
  para o usuário do arquivo, se você estiver criando para
  outro usuário, precisará usar sudo para executar esse
  comando.
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">sudo</span><span style="color:#A6E3A1"> cat</span><span style="color:#A6E3A1"> /home/joaozinho/.ssh/id_rsa.pub</span></span></code></pre>

<p>
  Você vai ver muitos caracteres, começando com
  “ssh-rsa”. Selecione e copie todos os dados dessa linha.
  Essa é a chave pública do seu usuário que
  será copiada para o servidor posteriormente nesse artigo.
</p>

<h2>Criando SSH Keys no Windows</h2>

<p>
  No Windows você vai precisar do Putty para gerar seu par de
  chaves pública e privada. Baixe o no link a seguir:
</p>

<ul>
  <li>
    <a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html">Baixar Putty</a>
  </li>
</ul>

<p>
  Baixe o instalador com extensão <strong>.msi</strong> e instale
  no seu computador.
</p>

<p>
  Depois de instalado, pressione simultaneamente as teclas
  “Windows” + “R” e digite:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">%programfiles%\Putty</span></span></code></pre>

<p>E pressione “Enter”.</p>

<p>
  Dentro da pasta do PuTTY, abra o arquivo
  <strong>puttygen.exe</strong>. Clique em “Generate” e mova
  o mouse próximo a barrinha de carregamento até terminar.
</p>

<p>
  Na imagem abaixo detalho o que você precisa fazer dentro do
  puttygen:
</p>


![Exemplo 1](./imgs/1.jpg)





<p>
  Copie sua chave pública para o servidor, como explico na
  próxima etapa.
</p>

<p>
  Não se esqueça que, para se conectar ao servidor remoto,
  você primeiro precisa carregar sua chave privada.
</p>

<h2>Adicione chave pública no servidor remoto</h2>

<p>
  Depois de criar suas chaves, você vai precisar copiar sua chave
  pública para o servidor. Para isso, basta criar um arquivo
  chamado “authorized_keys” dentro da pasta
  <strong>.ssh</strong> do usuário desejado dentro do servidor.
</p>

<p>
  Por exemplo: suponhamos que eu queira dar autorização
  para o usuário “Joãozinho” (usado no linux
  anteriormente) para acessar o servidor remoto como o usuário
  “Zézinho”. Então eu digitaria o seguinte no
  servidor remoto:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">sudo</span><span style="color:#A6E3A1"> mkdir</span><span style="color:#A6E3A1"> --mode=600</span><span style="color:#A6E3A1"> /home/zezinho/.ssh/</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">sudo</span><span style="color:#A6E3A1"> nano</span><span style="color:#A6E3A1"> /home/zezinho/.ssh/authorized_keys</span></span></code></pre>

<p>
  E colocaria a chave pública do “Joãozinho”
  dentro do arquivo “authorized_keys” do
  “Zézinho”.
</p>

<p>
  Agora cole os dados da sua chave pública dentro desse arquivo e
  pressione “CTRL” + “O” para salvar,
  “CTRL” + “X” para sair.
</p>

<p>
  Se vários usuários poderão se conectar usando o
  usuário do servidor remoto, adicione uma chave pública
  por linha no <strong>authorized_keys</strong>.
</p>

<p>
  Pronto, configuramos os usuários, agora vamos configurar o
  OpenSSH.
</p>

<h2>Configurando o OpenSSH</h2>

<p>Dentro do servidor remoto, digite o seguinte:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#89B4FA;font-style:italic">sudo</span><span style="color:#A6E3A1"> nano</span><span style="color:#A6E3A1"> /etc/ssh/sshd_config</span></span></code></pre>

<p>E altere as linhas:</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#9399B2;font-style:italic"># ...</span></span>
<span class="line"><span style="color:#CBA6F7">PermitRootLogin</span><span style="color:#F38BA8"> no</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># ...</span></span>
<span class="line"><span style="color:#CBA6F7">PubkeyAuthentication</span><span style="color:#F38BA8"> yes</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># ...</span></span>
<span class="line"><span style="color:#CBA6F7">PasswordAuthentication</span><span style="color:#F38BA8"> no</span></span>
<span class="line"><span style="color:#9399B2;font-style:italic"># ...</span></span></code></pre>

<p>
  <strong>PermitRootLogin</strong> remove completamente o acesso do root
  ao servidor SSH, <strong>PubkeyAuthentication</strong> permite o
  acesso via chave pública e
  <strong>PasswordAuthentication</strong> remove o acesso via senhas de
  texto.
</p>

<p>
  Pressione “CTRL”+”O” para salvar e reinicie o
  servidor SSH:
</p>

<pre class="shiki catppuccin-mocha" style="background-color: #1e1e2e; color: #cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CDD6F4">sudo service ssh restart</span></span></code></pre>

<p>
  <strong>Atenção:</strong> não feche sua
  conexão SSH atual. Para testar, abra uma nova conexão
  SSH, se der errado você não perderá sua
  conexão atual.
</p>

<p>É isso, se tiver dúvidas comenta aí.</p>
