---
title: 'Domínio e hospedagem: guia para leigos'
description:
  'Domínio e hospedagem são duas coisas que caminham de mãos dadas, mas não são
  a mesma coisa. Nesse artigo, vou deixar claro o que são e como configurar
  ambos em algumas hospedagens diferentes.'
date: 2018-04-04
author: 'Luiz Otávio Miranda'
---

Domínio e hospedagem são duas coisas que caminham de mãos dadas, mas não são a
mesma coisa. Nesse tópico, vou deixar claro o que são e como configurar ambos em
algumas hospedagens diferentes. Ao final, você poderá configurar seu próprio
domínio e hospedagem sem precisar pagar um profissional para isso.

Se você precisa de um site, seja para vender, ter um blog ou qualquer outro fim,
vai precisar de duas coisas em seu nome ou da sua empresa: domínio e hospedagem.
O domínio é o nome (endereço) do site; a hospedagem é o local onde os arquivos e
configurações do site estão.

Ambos estão ligados porque o domínio aponta para o IP do servidor de hospedagem,
onde os arquivos do site estão. Desse modo, pessoas que digitarem o domínio do
seu site no navegador, serão redirecionadas automaticamente para o servidor de
hospedagem.

Geralmente, empresas especializadas em hospedagem de sites têm planos que trazem
ambos os serviços em um mesmo pacote. Vamos falar sobre essas empresas
posteriormente nesse artigo.

## Domínio: o endereço do site

O domínio é o endereço do site em si. Aquele que, geralmente, inicia-se com
“www” e termina com “.com” ou “.com.br”. Como `www.exemplo.com.br`, por
exemplo.

Contudo, aqui cabem alguns adendos: não é necessário que um domínio inicie com
“www”, mas é recomendado. As partes “.com” e “.br” são
[domínios de topo](https://pt.wikipedia.org/wiki/Dom%C3%ADnio_de_topo) e ambos
podem ser totalmente diferentes para cada domínio.

Vamos ver, na prática, o que acontece quando o seu domínio é usado no navegador
de Internet:

- O internauta digita o endereço (domínio) do seu site no navegador;
- O navegador busca as configurações do seu domínio no servidor de DNS;
- O servidor de DNS diz para o navegador qual o IP da sua hospedagem;
- Sua hospedagem diz pro navegador em qual pasta do servidor seu site está;
- O navegador faz o download do conteúdo da pasta do seu site na hospedagem para
  o internauta e mostra na tela.

Assim, para que um domínio funcione corretamente ele precisa de servidores de
DNS. Geralmente, esses servidores serão configurados pelo próprio provedor no
iqual você o contratou e não precisam ser modificados, porém, é bom que você
entenda como eles funcionam.

Um servidor de DNS é quem vai receber a requisição do navegador de internet e
direcionar o Internauta para o local onde seu site está hospedado (hospedagem)
de acordo com as configurações da Zona de DNS.

A não ser em casos muito específicos, como a configuração de uma rede de
distribuição de conteúdo ([CDN](https://www.gocache.com.br/cdn/)), **você não
precisa alterar os servidores de DNS** do seu domínio. Mas, se precisar, é só ir
no painel do provedor onde você contratou o domínio, acessar a parte de
**domínios** (ou meus domínios) e acessar as configurações do domínio desejado.
Certamente, a opção vai se chamar algo similar a “Configurar servidores DNS”,
“Alterar Nameservers” ou algo parecido com isso. Ainda assim, vou mostrar como
fazer isso em duas hospedagens diferentes mais abaixo.

**Dica importante:** A “Zona de DNS” tem configurações dentro do **servidor de
DNS**. Portanto, você não precisa alterar o servidor de DNS para configurar um
registro dentro da zona de DNS.

## Como modificar os Servidores de DNS

Conforme mencionei anteriormente nesse artigo, são poucos os casos em que você
precisa alterar os servidores de DNS do seu provedor, mas caso precise, veja
como fazê-lo na Uolhost e Hostgator.

### Na uolhost

1. Acesse o [painel da uolhost](https://painelhost.uol.com.br/myProducts.html);
2. Entre com seus dados de usuário e senha;
3. Acesse o menu “Domínios”;
4. Role a página até encontrar “Seus domínios”;
5. Em “Gerenciar”, clique no menu suspenso e acesse a opção “Configurar
   Servidores DNS”;

Nessa página, você verá 3 opções de servidores “Master”, “Slave 1” e “Slave 2”.
Os servidores padrão da Uolhost são:

- ns1.dominios.uol.com.br
- ns2.dominios.uol.com.br
- ns3.dominios.uol.com.br

**Nota:** A princípio, você não precisa preencher todos os campos, o servidor
“Master” é o principal, “Slave 1” e “Slave 2” são servidores secundários. Caso o
“Master” não funcione por algum motivo, os servidores secundários serão
acionados, entretanto, como o “Master” é o mais importante, geralmente todas as
requisições vão pra ele.

Finalmente, clique em “Salvar” após a configuração.

### Na hostgator

1. Acesse a [área do cliente](https://financeiro.hostgator.com.br/);
2. Entre com seu usuário e senha;
3. No menu superior vá em “Domínios” > “Meus domínios”;
4. No menu suspenso ao lado do domínio desejado, clique em “Alterar Nameserver –
   DNS”;

A hostgator te dá opção para adicionar 5 servidores de DNS, mas você não precisa
usar todos caso não tenha milhares de servidores de DNS. O primeiro é o “Master”
e o restante secundários.

Configure como quiser e clique em “Alterar Nameserver – DNS”.

## Zona de DNS

A zona de DNS armazena registros que especificam os endereços dos serviços do
seu site, como ip da hospedagem, servidores de e-mail, subdomínios, entre outros
dados específicos do seu domínio.

Existem vários tipos de registros que podem ser configurados na Zona de DNS do
seu domínio, dentre eles:

Zona de DNS A zona de DNS armazena registros que especificam os endereços dos
serviços do seu site, como ip da hospedagem, servidores de e-mail, subdomínios,
entre outros dados específicos do seu domínio.

Existem vários tipos de registros que podem ser configurados na Zona de DNS do
seu domínio, dentre eles:

- **Tipo A** – Registro que associa um domínio ao endereço IP de um servidor. O
  valor sempre será um endereço de IP. Geralmente, o IP da sua hospedagem, mas
  pode ser outro IP em alguns casos;
- **CNAME** – É um tipo de registro que mapeia um nome de alias para um nome de
  domínio. Certamente, são muito usados para criar subdomínios ao seu domínio.
  Por exemplo: suponhamos que você venda um curso online e que esse curso seja
  uma página separada do restante do seu site. Você pode criar o subdomínio
  “curso.seudominio.com.br” e mapear isso com um registro CNAME. Contudo, vale
  lembrar que dentro da hospedagem precisa existir uma pasta específica para
  esse subdomínio. Sozinho, o registro CNAME não fará nada. Provavelmente, no
  painel da sua hospedagem existe uma opção para configuração de subdomínios e
  ela irá criar o registro CNAME, portanto, use-a ao invés de alterar os
  registros CNAME.
- **TXT** – Registros que podem conter um texto. Normalmente são usados para
  verificação de domínio. Por exemplo: recentemente adicionei o “Search console”
  da Google em um site e eles me pediram para verificar a autoridade do domínio
  com um registro de DNS do tipo TXT.
- **MX** – Registros que tem como destino o servidor responsável por receber os
  e-mails do domínio. O campo “Prioridade” é usado para definir a prioridade dos
  servidores (quanto menor o número, maior a prioridade).

Antes que você me pergunte, esses não são todos os tipos de registros de DNS.
Caso tenha interesse, veja mais alguns tipos
[aqui](https://wiki.dialhost.com.br/o-que-sao-tipos-de-registro/).

Se você contratou domínio e hospedagem no mesmo pacote de uma empresa de
hospedagem, certamente não vai precisar se preocupar com essas configurações.
Sem dúvida, o pessoal das empresas de hospedagens já deixam o domínio contratado
apontando para a hospedagem, de modo que é só enviar os arquivos do site pelo
servidor FTP (vamos falar sobre isso também mais adiante) e acessá-los pelo
domínio contratado. Afinal, isso é interessante pra eles!

Caso tenha interesse em alterar a zona de DNS, faça o seguinte:

### Na uolhost

1. [Acesse o painel](https://painelhost.uol.com.br/myProducts.html);
2. Entre com seus dados de usuário e senha;
3. Acesse a opção “Domínios”;
4. No menu suspenso do domínio desejado, clique em “Alterar Zona de DNS”;
5. Em “Zona de DNS”, clique em “Gerenciar”; Crie os registros dos tipos
   desejados e salve.

### Na hostgator

Dependendo do seu tipo de hospedagem, pode ser que seja necessário usar o
cPanel. Portanto, vou mostrar como encontrar as opções para gerenciar a zona de
DNS do seu domínio por ele.

1. [Entre no seu painel](https://financeiro.hostgator.com.br/clientarea.php);
2. Na sua hospedagem, clique em cPanel;
3. Role a página até a sessão “Domínios”;
4. Você pode usar tanto o “Simple Zone Editor” ou o “Advanced Zone Editor”. No
   “Simple Zone Editor” você tem algo mais simples e direto, basta escolher o
   tipo de registro, nome e o valor. Porém, para o “Advanced Zone Editor” é
   necessário que você entenda o que está fazendo, já que tem todas as opções
   disponíveis pra você configurar um registro de DNS;

Vale lembrar que o cPanel possui uma área específica para a criação de
subdomínios, portanto, não é necessário criar um registro CNAME para um
subdomínio, ele fará isso automaticamente. Aliás, se você criar uma entrada
CNAME e tentar criar um subdomínio, será apresentado um erro na tela.

Mas, ainda assim, é bom que você saiba como realizar tais configurações.

### Whois – Informações de contato

O **whois **serve para identificar o proprietário de um site. Assim, ele é
alimentado pela própria empresa de hospedagem e reúne todas as informações
pertencentes a uma página. incluindo CNPJ ou CPF de quem o registrou. Além
disso, essas informações são públicas, ou seja, se você registrou um domínio em
seu nome, eventualmente, alguns dos seus dados serão disponibilizados
publicamente online para quem olhar o whois do seu domínio.

São três setores de contato disponíveis no whois: o contato administrativo, o
contato técnico e o contato de cobrança. Muitos serviços de hospedagem vão usar
o contato do proprietário para todos os setores de contato, todavia, você pode
mudar isso no painel da sua hospedagem.

Se você quiser ver o whois de um site, acesse [who.is](https://who.is/) e digite
o domínio desejado. Então veja a mágica!

## Hospedagem: o local onde seu site está

Agora que você já está fera em domínios, vejamos o que é uma hospedagem.

Embora pareça complicado, uma hospedagem nada mais é do que um espaço que você
está alugando para os arquivos e configurações do seu site em um ou vários
servidores.

Um servidor pode ser um ou vários computadores que as empresas de hospedagem
mantém sempre ligados para que seu site esteja sempre online.

Existem vários tipos de hospedagem que você pode contratar, cada um com seus
prós e contras. Mas isso vai depender do nível no qual o seu site está. Quando
eu digo nível, estou me referindo a quantidade de acessos e quais serviços serão
utilizados.

Embora pareça complexo de início, se você está iniciando e sabe que seu site vai
começar a receber visitas neste momento, provavelmente a mais barata irá lhe
servir bem, mas é sempre bom verificar se a sua hospedagem oferece upgrade do
seu plano, ou seja, se seu site crescer, será fácil pagar um pouco mais para que
eles liberem mais recursos do servidor para seu site a medida que precise.

Em uma analogia, seria como se a sua hospedagem fosse um cano, desses que passam
água, e os visitantes do site a água. Se a quantidade de água que passar for
menor que o diâmetro do cano, tudo funciona muito bem, mas, se a quantidade de
água for maior, ela será limitada pelo diâmetro do cano. Assim, se seu site
receber mais visitar do que a hospedagem pode suportar, alguns clientes poderão
ver páginas de erros do servidor, outros não conseguiram acessar e, certamente,
tudo vai ficar muito lento.

### Tipos de hospedagem

Separei alguns tipos de hospedagem encontrados comumente nos provedores.

#### Hospedagem compartilhada

Geralmente, trata-se do pacote mais barato dos provedores. Uma solução excelente
para quem está começando e sabe que não terá um turbilhão de visitas de início.

Os provedores conseguem um preço tão em conta porque compartilham os recursos de
apenas um servidor com outros sites. Ou melhor, CPU, memória, espaço em disco,
tudo isso é compartilhado.

Além disso, esse plano vem todo configurado, portanto você não precisará
modificar praticamente nada, nem mesmo as configurações de domínio que mencionei
anteriormente nesse artigo.

Contudo, nem tudo são flores. Você não terá praticamente nenhum controle sobre
as configurações do seu servidor e, provavelmente, também não terá acesso SSH.
Além disso, se algum dos sites do servidor tiver algum pico de visitas ou
receber ataques, o desempenho do seu, certamente, será afetado.

Ainda assim, continua sendo um dos melhores e mais populares planos para sites
que estão começando ou que recebem poucas visitas.

#### Hospedagem VPS (Virtual Private Server)

Na hospedagem VPS, apesar de você ainda continuar compartilhando um servidor com
outros sites, nesse caso recursos são alocados especificamente para seu site, só
que picos em outros sites podem não afetar o desempenho do seu.

Seu provedor vai alocar uma partição do servidor e recursos (CPU e memória)
exclusivos para o seu site com possibilidade de expansão caso necessário.

Apesar de mais cara do que a hospedagem compartilhada, pode valer a pena para
sites que têm grande prospecção para expansão. Além disso, a empresa também vai
te passar dados para que você acesse e altere configurações via SSH, ou seja,
você tem acesso e autonomia para configurar determinados serviços dentro do seu
“servidor virtual”.

Como nem tudo é um mar de rosas, pode ser necessário conhecimento adicional para
trabalhar com hospedagens VPS.

#### Hospedagem Cloud

Atualmente, a maioria dos provedores oferecem hospedagem “Cloud” (na nuvem).
Nesse tipo de hospedagem seu site não estará em um servidor, muito menos
compartilhado com outros sites, ele estará alocado em um cluster de servidores
(vários servidores). Isso quer dizer que, se algum dos servidores parar de
funcionar por algum motivo seu site será realocado para outro servidor e
continuará funcionando normalmente.

O fornecimento de recursos também pode ser de acordo com a demanda, ou seja,
você pode pagar mais para receber mais recursos. Particularmente, já vi casos em
que você paga um valor fixo mensal, mas também já vi casos em que você paga pelo
que utiliza.

Aqui você também vai precisar de muito conhecimento adicional. Me lembro quando
contratei o primeiro plano cloud para um site em que estávamos trabalhando, o
provedor me mandou o IP de um servidor com o Ubuntu Server instalado e usuário e
senha, ponto. Não tinha absolutamente nada configurado nesse servidor.

#### Hospedagem WordPress

Como o próprio nome já diz, é um tipo de hospedagem específica para sites feitos
com o WordPress. Já vem até com alguns plugins de segurança e cache
configurados. Porém, como é uma hospedagem específica, o site vai performar bem
melhor nela pela otimização já realizada pelo provedor.

Os benefícios disso é que é uma hospedagem mais em conta e que não demanda
conhecimento. Talvez você nem precise ter conhecimento sobre WordPress em si.

Vale lembrar que se seu site não usa o WordPress, não vale a pena investir nessa
hospedagem.

#### Hospedagem dedicada

Na hospedagem dedicada você tem seu próprio servidor e pode fazer o que quiser
com ele, até mudar o sistema operacional, alterar configurações de acordo com
suas necessidades ou desligar o servidor quando quiser (dependendo do provedor).

Porém, além de um enorme conhecimento, você vai precisar de grana. É um tipo de
hospedagem bem caro.

#### Minha hospedagem preferida

De todos os planos que já utilizei em vários provedores, pra mim o que mais
gostei foi a hospedagem cloud (na nuvem). Além da flexibilidade, nunca vi o
serviço fora do ar por nem um segundo em anos.

### O que você precisa saber sobre a sua hospedagem?

Quando se contrata uma hospedagem você precisará saber algumas coisas sobre ela
para realizar configurações, dentre elas estão o gerenciamento do banco de dados
e contas FTP, já que a maioria dos sites que você vai configurar vão utilizar
pelo menos um banco de dados e uma conta FTP.

Se a sua hospedagem oferecer o cPanel gratuitamente, tudo fica bem mais simples,
porque você não precisará de tanto conhecimento para realizar tais
configurações.

Vou mostrar como criar um usuário do banco de dados e um banco de dados para
este usuário no cPanel de maneira rápida.

#### Como criar usuário MySQL e banco de dados no cPanel

**Passo 1:** Abra o cPanel e acesse “MySQL remoto®”;

**Passo 2:** Em “Host (o coringa % é permitido)” adicione o “%” (sem aspas) e
clique em “Adicionar host”;

**Dica:** vale lembrar que aqui você está adicionando quais IPs podem acessar
seu servidor MySQL. O coringa significa “todos”.

**Passo 3:** no menu da lateral esquerda, clique novamente em “Banco de dados” e
agora acesse a configuração “Bancos de dados MySQL®”;

**Passo 4:** em “Criar novo banco de dados” adicione o nome do seu banco de
dados e clique em “Criar banco de dados”;

**Dica:** onde adicionei o retângulo vermelho, vai existir um prefixo que a
própria hospedagem lhe fornece, isso não é editável, porém faz parte do nome do
seu banco de dados.

**Passo 5:** clique em voltar e role a página até “Adicionar novo usuário”;
Preencha os campos “Nome de usuário” (depois do prefixo), “Senha” e “Senha
(novamente)”. Por fim, clique em “Criar usuário”;

**Passo 6:** Clique em “Voltar” e navegue até “Adicionar usuário ao banco de
dados”; Em “Usuário”, selecione o usuário que acabou de criar; Em “Banco de
dados”, selecione o banco de dados que criamos anteriormente; Por fim, clique em
“Adicionar”;

Na nova janela que abriu, clique em “Todos os privilégios” e para finalizar
“Fazer alterações”;

Pronto, agora se você precisar dos dados para criar qualquer site, os dados
serão:

- **Servidor MySQL (host):** seudominio.com.br;
- **Usuário do Banco de dados:** O usuário que você acabou de criar;
- **Senha:** A senha que você deu para o usuário anteriormente;
- **Banco de dados:** O nome do banco de dados que você acabou de criar.

Vamos ver como criar uma conta FTP a seguir.

#### Como criar uma conta FTP no cPanel

Contas FTP serão necessárias para que qualquer desenvolvedor envie arquivos pra
dentro do seu site. Além disso, você também pode querer ter uma pasta virtual
dentro do seu servidor, para fazer backup dos seus arquivos ou coisas do tipo.

Nesse caso, vamos criar uma conta FTP para adicionar arquivos diretamente dentro
da pasta do nosso site. Veja como:

**Passo 1:** Na página inicial do cPanel, em “Arquivos”, clique em “Contas FTP”;

**Passo 2:** Em “Adicionar conta de FTP” digite o “Fazer login” (nome do
usuário), “Senha” e “Senha (novamente)”; Em “Diretório”, adicione apenas
“public_html” (que é a pasta onde o site deve estar). Clique em “Criar conta de
FTP”.

**Passo 3:** Para ver os dados de acesso do usuário, role a página um pouco para
baixo, encontre o nome de usuário que acabou de criar e clique em “Configurar
cliente FTP”;

Serão exibidos os seguintes dados:

- Nome de usuário do FTP
- Servidor FTP (Host)
- FTP &amp; porta FTPS explícita (A porta)

A senha, certamente não será exibida, mas é aquela que você configurou
anteriormente ao criar a conta FTP.

## Domínio e hospedagem: conclusão

Domínio e hospedagem caminham de mãos dadas, mas não são a mesma coisa. Conforme
expliquei amplamente anteriormente, domínio trata-se do nome do site e é que
encaminha o usuário para o local correto na hospedagem.

A hospedagem em si é um espaço no servidor onde os arquivos e configurações do
site estão.

Apesar de não serem a mesma coisa, um depende muito do outro para o bom
funcionamento de tudo o que é online atualmente.

## Dicas de nomes de domínio

Pra finalizar, algumas dicas para não errar na hora de criar seu domínio:

- Tente usar uma ou duas palavras apenas (sempre que possível) pra ficar fácil
  de lembrar;
- Se o domínio em nome de sua empresa já existir, tente colocar termos antes do
  nome da empresa. Por exemplo: para um e-commerce, pode adicionar “loja” +
  “nomedaempresa”;
- Se não conseguir mesmo assim, pegue o contato do proprietário do domínio pelo
  registro whois (expliquei anteriormente nesse artigo);
- Não utilize nomes que não sejam relacionado com a sua empresa. Os e-mails do
  seu domínio terão o nome do seu domínio ao final, exemplo:
  meuemail@meudominio.com.br;
- Você não precisa utilizar os famosos “.com” ou “.com.br”, existem milhares de
  extensões de domínio possíveis. Exemplo: .net, .tv, .website, .biz e assim por
  diante.

Caso tenha ficado alguma dúvida, não hesite em comentar nesse artigo.

Até a próxima 🙏!
