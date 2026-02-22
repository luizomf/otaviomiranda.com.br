---
title: 'Domínio e hospedagem: guia para leigos'
description: 'Domínio e hospedagem: guia para leigos'
date: 2018-04-04
---

<h1>Domínio e hospedagem: guia para leigos</h1>

<p class="author">
  <span class="meta-date">
    <time datetime="2018-04-04">4 de abril de 2018</time>
  </span>
  ·
  <span class="meta-author">Luiz Otávio Miranda</span>
</p>

<p>
  Domínio e hospedagem são duas coisas que caminham de
  mãos dadas, mas não são a mesma coisa. Nesse
  tópico, vou deixar claro o que são e como configurar
  ambos em algumas hospedagens diferentes. Ao final, você
  poderá configurar seu próprio domínio e
  hospedagem sem precisar pagar um profissional para isso.
</p>

<p>
  Se você precisa de um site, seja para vender, ter um blog ou
  qualquer outro fim, vai precisar de duas coisas em seu nome ou da sua
  empresa: domínio e hospedagem. O domínio é o nome
  (endereço) do site; a hospedagem é o local onde os
  arquivos e configurações do site estão.
</p>

<p>
  Ambos estão ligados porque o domínio aponta para o IP do
  servidor de hospedagem, onde os arquivos do site estão. Desse
  modo, pessoas que digitarem o domínio do seu site no navegador,
  serão redirecionadas automaticamente para o servidor de
  hospedagem.
</p>

<p>
  Geralmente, empresas especializadas em hospedagem de sites têm
  planos que trazem ambos os serviços em um mesmo pacote. Vamos
  falar sobre essas empresas posteriormente nesse artigo.
</p>

<h2>Domínio: o endereço do site</h2>

<p>
  O domínio é o endereço do site em si. Aquele que,
  geralmente, inicia-se com “www” e termina com
  “.com” ou “.com.br”. Como
  <a href="https://www.otaviomiranda.com.br/">www.otaviomiranda.com.br</a>
  por exemplo.
</p>

<p>
  Contudo, aqui cabem alguns adendos: não é
  necessário que um domínio inicie com “www”,
  mas é recomendado. As partes “.com” e
  “.br” são
  <a href="https://pt.wikipedia.org/wiki/Dom%C3%ADnio_de_topo">domínios de topo</a>
  e ambos podem ser totalmente diferentes para cada domínio.
</p>

<p>
  Vamos ver, na prática, o que acontece quando o seu
  domínio é usado no navegador de Internet:
</p>

<ul>
  <li>
    O internauta digita o endereço (domínio) do seu site
    no navegador;
  </li>
  <li>
    O navegador busca as configurações do seu
    domínio no servidor de DNS;
  </li>
  <li>
    O servidor de DNS diz para o navegador qual o IP da sua hospedagem;
  </li>
  <li>
    Sua hospedagem diz pro navegador em qual pasta do servidor seu site
    está;
  </li>
  <li>
    O navegador faz o download do conteúdo da pasta do seu site
    na hospedagem para o internauta e mostra na tela.
  </li>
</ul>

<p>
  Assim, para que um domínio funcione corretamente ele precisa de
  servidores de DNS. Geralmente, esses servidores serão
  configurados pelo próprio provedor no qual você o
  contratou e não precisam ser modificados, porém,
  é bom que você entenda como eles funcionam.
</p>

<p>
  Um servidor de DNS é quem vai receber a
  requisição do navegador de internet e direcionar o
  Internauta para o local onde seu site está hospedado
  (hospedagem) de acordo com as configurações da Zona de
  DNS.
</p>

<p>
  A não ser em casos muito específicos, como a
  configuração de uma rede de distribuição
  de conteúdo (<a href="https://www.gocache.com.br/cdn/">CDN</a>), você
  <strong>não precisa alterar os servidores de DNS</strong>
  do seu domínio. Mas, se precisar, é só ir no
  painel do provedor onde você contratou o domínio, acessar
  a parte de <strong>domínios</strong> (ou meus domínios)
  e acessar as configurações do domínio desejado.
  Certamente, a opção vai se chamar algo similar a
  “Configurar servidores DNS”, “Alterar
  Nameservers” ou algo parecido com isso. Ainda assim, vou mostrar
  como fazer isso em duas hospedagens diferentes mais abaixo.
</p>

<p>
  <strong>Dica importante:</strong> A “Zona de DNS” tem
  configurações
  <strong>dentro do servidor de DNS</strong>. Portanto, você
  não precisa alterar o servidor de DNS para configurar um
  registro dentro da zona de DNS.
</p>

<h3>Como modificar os Servidores de DNS</h3>

<p>
  Conforme mencionei anteriormente nesse artigo, são poucos os
  casos em que você precisa alterar os servidores de DNS do seu
  provedor, mas caso precise, veja como fazê-lo na Uolhost e
  Hostgator.
</p>

<h4>Na uolhost</h4>

<ol>
  <li>
    Acesse o
    <a href="https://painelhost.uol.com.br/myProducts.html">painel da uolhost</a>;
  </li>
  <li>Entre com seus dados de usuário e senha;</li>
  <li>Acesse o menu “Domínios”;</li>
  <li>
    Role a página até encontrar “Seus
    domínios”;
  </li>
  <li>
    Em “Gerenciar”, clique no menu suspenso e acesse a
    opção “Configurar Servidores DNS”;
  </li>
</ol>

<p>
  Nessa página, você verá 3 opções de
  servidores “Master”, “Slave 1” e “Slave
  2”. Os servidores padrão da Uolhost são:
</p>

<ul>
  <li>ns1.dominios.uol.com.br</li>
  <li>ns2.dominios.uol.com.br</li>
  <li>ns3.dominios.uol.com.br</li>
</ul>

<p>Troque esses servidores de DNS para os desejados.</p>

<p>
  <strong>Nota:</strong> A princípio, você não
  precisa preencher todos os campos, o servidor “Master”
  é o principal, “Slave 1” e “Slave 2”
  são servidores secundários. Caso o “Master”
  não funcione por algum motivo, os servidores secundários
  serão acionados, entretanto, como o “Master”
  é o mais importante, geralmente todas as
  requisições vão pra ele.
</p>

<p>
  Finalmente, clique em “Salvar” após a
  configuração.
</p>

<h4>Na hostgator</h4>

<ol>
  <li>
    Acesse a
    <a href="https://financeiro.hostgator.com.br/">área do cliente</a>;
  </li>
  <li>Entre com seu usuário e senha;</li>
  <li>
    No menu superior vá em “Domínios” &gt;
    “Meus domínios”;
  </li>
  <li>
    No menu suspenso ao lado do domínio desejado, clique em
    “Alterar Nameserver – DNS”;
  </li>
</ol>

<p>
  A hostgator te dá opção para adicionar 5
  servidores de DNS, mas você não precisa usar todos caso
  não tenha milhares de servidores de DNS. O primeiro é o
  “Master” e o restante secundários.
</p>

<p>
  Configure como quiser e clique em “Alterar Nameserver –
  DNS”.
</p>

<h3>Zona de DNS</h3>

<p>
  A zona de DNS armazena registros que especificam os endereços
  dos serviços do seu site, como ip da hospedagem, servidores de
  e-mail, subdomínios, entre outros dados específicos do
  seu domínio.
</p>

<p>
  Existem vários tipos de registros que podem ser configurados na
  Zona de DNS do seu domínio, dentre eles:
</p>

<ul>
  <li>
    <strong>Tipo A</strong> – Registro que associa um
    domínio ao endereço IP de um servidor. O valor sempre
    será um endereço de IP. Geralmente, o IP da sua
    hospedagem, mas pode ser outro IP em alguns casos;
  </li>
  <li>
    <strong>CNAME</strong> – É um tipo de registro que
    mapeia um nome de alias para um nome de domínio. Certamente,
    são muito usados para criar subdomínios ao seu
    domínio. Por exemplo: suponhamos que você venda um
    curso online e que esse curso seja uma página separada do
    restante do seu site. Você pode criar o subdomínio
    “curso.seudominio.com.br” e mapear isso com um registro
    CNAME. Contudo, vale lembrar que dentro da hospedagem precisa
    existir uma pasta específica para esse subdomínio.
    Sozinho, o registro CNAME não fará nada.
    Provavelmente, no painel da sua hospedagem existe uma
    opção para configuração de
    subdomínios e ela irá criar o registro CNAME,
    portanto, use-a ao invés de alterar os registros CNAME.
  </li>
  <li>
    <strong>TXT</strong> – Registros que podem conter um texto.
    Normalmente são usados para verificação de
    domínio. Por exemplo: recentemente adicionei o “Search
    console” da Google em um site e eles me pediram para verificar
    a autoridade do domínio com um registro de DNS do tipo TXT.
  </li>
  <li>
    <strong>MX</strong> – Registros que tem como destino o
    servidor responsável por receber os e-mails do
    domínio. O campo “Prioridade” é usado para
    definir a prioridade dos servidores (quanto menor o número,
    maior a prioridade).
  </li>
</ul>

<p>
  Antes que você me pergunte, esses não são todos os
  tipos de registros de DNS. Caso tenha interesse, veja mais alguns
  tipos
  <a href="https://wiki.dialhost.com.br/o-que-sao-tipos-de-registro/">aqui</a>.
</p>

<p>
  Se você contratou domínio e hospedagem no mesmo pacote de
  uma empresa de hospedagem, certamente não vai precisar se
  preocupar com essas configurações. Sem dúvida, o
  pessoal das empresas de hospedagens já deixam o domínio
  contratado apontando para a hospedagem, de modo que é só
  enviar os arquivos do site pelo servidor FTP (vamos falar sobre isso
  também mais adiante) e acessá-los pelo domínio
  contratado. Afinal, isso é interessante pra eles!
</p>

<p>
  Caso tenha interesse em alterar a zona de DNS, faça o seguinte:
</p>

<h4>Na uolhost</h4>

<ol>
  <li>
    <a href="https://painelhost.uol.com.br/myProducts.html">Acesse o painel</a>;
  </li>
  <li>Entre com seus dados de usuário e senha;</li>
  <li>Acesse a opção “Domínios”;</li>
  <li>
    No menu suspenso do domínio desejado, clique em
    “Alterar Zona de DNS”;
  </li>
  <li>
    Em “Zona de DNS”, clique em “Gerenciar”;
  </li>
  <li>Crie os registros dos tipos desejados e salve.</li>
</ol>

<h4>Na hostgator</h4>

<p>
  Dependendo do seu tipo de hospedagem, pode ser que seja
  necessário usar o cPanel. Portanto, vou mostrar como encontrar
  as opções para gerenciar a zona de DNS do seu
  domínio por ele.
</p>

<ol>
  <li>
    <a href="https://financeiro.hostgator.com.br/clientarea.php">Entre no seu painel</a>;
  </li>
  <li>Na sua hospedagem, clique em cPanel;</li>
  <li>
    Role a página até a sessão
    “Domínios”;
  </li>
  <li>
    Você pode usar tanto o “Simple Zone Editor” ou o
    “Advanced Zone Editor”. No “Simple Zone
    Editor” você tem algo mais simples e direto, basta
    escolher o tipo de registro, nome e o valor. Porém, para o
    “Advanced Zone Editor” é necessário que
    você entenda o que está fazendo, já que tem
    todas as opções disponíveis pra você
    configurar um registro de DNS;
  </li>
</ol>

<p>
  Vale lembrar que o cPanel possui uma área específica
  para a criação de subdomínios, portanto,
  não é necessário criar um registro CNAME para um
  subdomínio, ele fará isso automaticamente. Aliás,
  se você criar uma entrada CNAME e tentar criar um
  subdomínio, será apresentado um erro na tela.
</p>

<p>
  Mas, ainda assim, é bom que você saiba como realizar tais
  configurações.
</p>

<h3>Whois – Informações de contato</h3>

<p>
  O <strong>whois </strong>serve para identificar o proprietário
  de um site. Assim, ele é alimentado pela própria empresa
  de hospedagem e reúne todas as informações
  pertencentes a uma página. incluindo CNPJ ou CPF de quem o
  registrou. Além disso, essas informações
  são públicas, ou seja, se você registrou um
  domínio em seu nome, eventualmente, alguns dos seus dados
  serão disponibilizados publicamente online para quem olhar o
  whois do seu domínio.
</p>

<p>
  São três setores de contato disponíveis no whois:
  o contato administrativo, o contato técnico e o contato de
  cobrança. Muitos serviços de hospedagem vão usar
  o contato do proprietário para todos os setores de contato,
  todavia, você pode mudar isso no painel da sua hospedagem.
</p>

<p>
  Se você quiser ver o whois de um site, acesse
  <a href="https://who.is/">who.is</a> e digite o domínio
  desejado. Então veja a mágica!
</p>

<h2>Hospedagem: o local onde seu site está</h2>

<p>
  Agora que você já está fera em domínios,
  vejamos o que é uma hospedagem.
</p>

<p>
  Embora pareça complicado, uma hospedagem nada mais é do
  que um espaço que você está alugando para os
  arquivos e configurações do seu site em um ou
  vários servidores.
</p>

<p>
  Um servidor pode ser um ou vários computadores que as empresas
  de hospedagem mantém sempre ligados para que seu site esteja
  sempre online.
</p>

<p>
  Existem vários tipos de hospedagem que você pode
  contratar, cada um com seus prós e contras. Mas isso vai
  depender do nível no qual o seu site está. Quando eu
  digo nível, estou me referindo a quantidade de acessos e quais
  serviços serão utilizados.
</p>

<p>
  Embora pareça complexo de início, se você
  está iniciando e sabe que seu site vai começar a receber
  visitas neste momento, provavelmente a mais barata irá lhe
  servir bem, mas é sempre bom verificar se a sua hospedagem
  oferece upgrade do seu plano, ou seja, se seu site crescer,
  será fácil pagar um pouco mais para que eles liberem
  mais recursos do servidor para seu site a medida que precise.
</p>

<p>
  Em uma analogia, seria como se a sua hospedagem fosse um cano, desses
  que passam água, e os visitantes do site a água. Se a
  quantidade de água que passar for menor que o diâmetro do
  cano, tudo funciona muito bem, mas, se a quantidade de água for
  maior, ela será limitada pelo diâmetro do cano. Assim, se
  seu site receber mais visitar do que a hospedagem pode suportar,
  alguns clientes poderão ver páginas de erros do
  servidor, outros não conseguiram acessar e, certamente, tudo
  vai ficar muito lento.
</p>

<h3>Tipos de hospedagem</h3>

<p>
  Separei alguns tipos de hospedagem encontrados comumente nos
  provedores.
</p>

<h4>Hospedagem compartilhada</h4>

<p>
  Geralmente, trata-se do pacote mais barato dos provedores. Uma
  solução excelente para quem está começando
  e sabe que não terá um turbilhão de visitas de
  início.
</p>

<p>
  Os provedores conseguem um preço tão em conta porque
  compartilham os recursos de apenas um servidor com outros sites. Ou
  melhor, CPU, memória, espaço em disco, tudo isso
  é compartilhado.
</p>

<p>
  Além disso, esse plano vem todo configurado, portanto
  você não precisará modificar praticamente nada,
  nem mesmo as configurações de domínio que
  mencionei anteriormente nesse artigo.
</p>

<p>
  Contudo, nem tudo são flores. Você não terá
  praticamente nenhum controle sobre as configurações do
  seu servidor e, provavelmente, também não terá
  acesso SSH. Além disso, se algum dos sites do servidor tiver
  algum pico de visitas ou receber ataques, o desempenho do seu,
  certamente, será afetado.
</p>

<p>
  Ainda assim, continua sendo um dos melhores e mais populares planos
  para sites que estão começando ou que recebem poucas
  visitas.
</p>

<h4>Hospedagem VPS (Virtual Private Server)</h4>

<p>
  Na hospedagem VPS, apesar de você ainda continuar compartilhando
  um servidor com outros sites, nesse caso recursos são alocados
  especificamente para seu site, só que picos em outros sites
  podem não afetar o desempenho do seu.
</p>

<p>
  Seu provedor vai alocar uma partição do servidor e
  recursos (CPU e memória) exclusivos para o seu site com
  possibilidade de expansão caso necessário.
</p>

<p>
  Apesar de mais cara do que a hospedagem compartilhada, pode valer a
  pena para sites que têm grande prospecção para
  expansão. Além disso, a empresa também vai te
  passar dados para que você acesse e altere
  configurações via SSH, ou seja, você tem acesso e
  autonomia para configurar determinados serviços dentro do seu
  “servidor virtual”.
</p>

<p>
  Como nem tudo é um mar de rosas, pode ser necessário
  conhecimento adicional para trabalhar com hospedagens VPS.
</p>

<h4>Hospedagem Cloud</h4>

<p>
  Atualmente, a maioria dos provedores oferecem hospedagem
  “Cloud” (na nuvem). Nesse tipo de hospedagem seu site
  não estará em um servidor, muito menos compartilhado com
  outros sites, ele estará alocado em um cluster de servidores
  (vários servidores). Isso quer dizer que, se algum dos
  servidores parar de funcionar por algum motivo seu site será
  realocado para outro servidor e continuará funcionando
  normalmente.
</p>

<p>
  O fornecimento de recursos também pode ser de acordo com a
  demanda, ou seja, você pode pagar mais para receber mais
  recursos. Particularmente, já vi casos em que você paga
  um valor fixo mensal, mas também já vi casos em que
  você paga pelo que utiliza.
</p>

<p>
  Aqui você também vai precisar de muito conhecimento
  adicional. Me lembro quando contratei o primeiro plano cloud para um
  site em que estávamos trabalhando, o provedor me mandou o IP de
  um servidor com o Ubuntu Server instalado e usuário e senha,
  ponto. Não tinha absolutamente nada configurado nesse servidor.
</p>

<h4>Hospedagem WordPress</h4>

<p>
  Como o próprio nome já diz, é um tipo de
  hospedagem específica para sites feitos com o WordPress.
  Já vem até com alguns plugins de segurança e
  cache configurados. Porém, como é uma hospedagem
  específica, o site vai performar bem melhor nela pela
  otimização já realizada pelo provedor.
</p>

<p>
  Os benefícios disso é que é uma hospedagem mais
  em conta e que não demanda conhecimento. Talvez você nem
  precise ter conhecimento sobre WordPress em si.
</p>

<p>
  Vale lembrar que se seu site não usa o WordPress, não
  vale a pena investir nessa hospedagem.
</p>

<h4>Hospedagem dedicada</h4>

<p>
  Na hospedagem dedicada você tem seu próprio servidor e
  pode fazer o que quiser com ele, até mudar o sistema
  operacional, alterar configurações de acordo com suas
  necessidades ou desligar o servidor quando quiser (dependendo do
  provedor).
</p>

<p>
  Porém, além de um enorme conhecimento, você vai
  precisar de grana. É um tipo de hospedagem bem caro.
</p>

<h4>Minha hospedagem preferida</h4>

<p>
  De todos os planos que já utilizei em vários provedores,
  pra mim o que mais gostei foi a hospedagem cloud (na nuvem).
  Além da flexibilidade, nunca vi o serviço fora do ar por
  nem um segundo em anos.
</p>

<h3>O que você precisa saber sobre a sua hospedagem?</h3>

<p>
  Quando se contrata uma hospedagem você precisará saber
  algumas coisas sobre ela para realizar configurações,
  dentre elas estão o gerenciamento do banco de dados e contas
  FTP, já que a maioria dos sites que você vai configurar
  vão utilizar pelo menos um banco de dados e uma conta FTP.
</p>

<p>
  Se a sua hospedagem oferecer o cPanel gratuitamente, tudo fica bem
  mais simples, porque você não precisará de tanto
  conhecimento para realizar tais configurações.
</p>

<p>
  Vou mostrar como criar um usuário do banco de dados e um banco
  de dados para este usuário no cPanel de maneira rápida.
</p>

<h4>Como criar usuário MySQL e banco de dados no cPanel</h4>

<p>
  <strong>Passo 1:</strong> Abra o cPanel e acesse “MySQL
  remoto®”;
</p>

<p>
  <strong>Passo 2:</strong> Em “Host (o coringa % é
  permitido)” adicione o “%” (sem aspas) e clique em
  “Adicionar host”;
</p>

<p>
  <strong>Dica:</strong> vale lembrar que aqui você está
  adicionando quais IPs podem acessar seu servidor MySQL. O coringa
  significa “todos”.
</p>

<p>
  <strong>Passo 3:</strong> no menu da lateral esquerda, clique
  novamente em “Banco de dados” e agora acesse a
  configuração “Bancos de dados MySQL®”;
</p>

<p>
  <strong>Passo 4:</strong> em “Criar novo banco de dados”
  adicione o nome do seu banco de dados e clique em “Criar banco
  de dados”;
</p>

<p>
  <strong>Dica:</strong> onde adicionei o retângulo vermelho, vai
  existir um prefixo que a própria hospedagem lhe fornece, isso
  não é editável, porém faz parte do nome do
  seu banco de dados.
</p>

<p>
  <strong>Passo 5:</strong> clique em voltar e role a página
  até “Adicionar novo usuário”; Preencha os
  campos “Nome de usuário” (depois do prefixo),
  “Senha” e “Senha (novamente)”. Por fim, clique
  em “Criar usuário”;
</p>

<p>
  <strong>Passo 6:</strong> Clique em “Voltar” e navegue
  até “Adicionar usuário ao banco de dados”;
  Em “Usuário”, selecione o usuário que acabou
  de criar; Em “Banco de dados”, selecione o banco de dados
  que criamos anteriormente; Por fim, clique em “Adicionar”;
</p>

<p>
  Na nova janela que abriu, clique em “Todos os
  privilégios” e para finalizar “Fazer
  alterações”;
</p>

<p>
  Pronto, agora se você precisar dos dados para criar qualquer
  site, os dados serão:
</p>

<ul>
  <li><strong>Servidor MySQL (host):</strong> seudominio.com.br;</li>
  <li>
    <strong>Usuário do Banco de dados:</strong> O usuário
    que você acabou de criar;
  </li>
  <li>
    <strong>Senha:</strong> A senha que você deu para o
    usuário anteriormente;
  </li>
  <li>
    <strong>Banco de dados:</strong> O nome do banco de dados que
    você acabou de criar.
  </li>
</ul>

<p>Vamos ver como criar uma conta FTP a seguir.</p>

<h4>Como criar uma conta FTP no cPanel</h4>

<p>
  Contas FTP serão necessárias para que qualquer
  desenvolvedor envie arquivos pra dentro do seu site. Além
  disso, você também pode querer ter uma pasta virtual
  dentro do seu servidor, para fazer backup dos seus arquivos ou coisas
  do tipo.
</p>

<p>
  Nesse caso, vamos criar uma conta FTP para adicionar arquivos
  diretamente dentro da pasta do nosso site. Veja como:
</p>

<p>
  <strong>Passo 1:</strong> Na página inicial do cPanel, em
  “Arquivos”, clique em “Contas FTP”;
</p>

<p>
  <strong>Passo 2:</strong> Em “Adicionar conta de FTP”
  digite o “Fazer login” (nome do usuário),
  “Senha” e “Senha (novamente)”; Em
  “Diretório”, adicione apenas
  “public_html” (que é a pasta onde o site deve
  estar). Clique em “Criar conta de FTP”.
</p>

<p>
  <strong>Passo 3:</strong> Para ver os dados de acesso do
  usuário, role a página um pouco para baixo, encontre o
  nome de usuário que acabou de criar e clique em
  “Configurar cliente FTP”;
</p>

<p>Serão exibidos os seguintes dados:</p>

<ul>
  <li>Nome de usuário do FTP</li>
  <li>Servidor FTP (Host)</li>
  <li>FTP &amp; porta FTPS explícita (A porta)</li>
</ul>

<p>
  A senha, certamente não será exibida, mas é
  aquela que você configurou anteriormente ao criar a conta FTP.
</p>

<h2>Domínio e hospedagem: conclusão</h2>

<p>
  Domínio e hospedagem caminham de mãos dadas, mas
  não são a mesma coisa. Conforme expliquei amplamente
  anteriormente, domínio trata-se do nome do site e é que
  encaminha o usuário para o local correto na hospedagem.
</p>

<p>
  A hospedagem em si é um espaço no servidor onde os
  arquivos e configurações do site estão.
</p>

<p>
  Apesar de não serem a mesma coisa, um depende muito do outro
  para o bom funcionamento de tudo o que é online atualmente.
</p>

<h2>Dicas de nomes de domínio</h2>

<p>
  Pra finalizar, algumas dicas para não errar na hora de criar
  seu domínio:
</p>

<ul>
  <li>
    Tente usar uma ou duas palavras apenas (sempre que possível)
    pra ficar fácil de lembrar;
  </li>
  <li>
    Se o domínio em nome de sua empresa já existir, tente
    colocar termos antes do nome da empresa. Por exemplo: para um
    e-commerce, pode adicionar “loja” +
    “nomedaempresa”;
  </li>
  <li>
    Se não conseguir mesmo assim, pegue o contato do
    proprietário do domínio pelo registro whois (expliquei
    anteriormente nesse artigo);
  </li>
  <li>
    Não utilize nomes que não sejam relacionado com a sua
    empresa. Os e-mails do seu domínio terão o nome do seu
    domínio ao final, exemplo: meuemail@meudominio.com.br;
  </li>
  <li>
    Você não precisa utilizar os famosos “.com”
    ou “.com.br”, existem milhares de extensões de
    domínio possíveis. Exemplo: .net, .tv, .website, .biz
    e assim por diante.
  </li>
</ul>

<p>
  Caso tenha ficado alguma dúvida, não hesite em comentar
  nesse artigo.
</p>

<p>Até a próxima 🙏!</p>
