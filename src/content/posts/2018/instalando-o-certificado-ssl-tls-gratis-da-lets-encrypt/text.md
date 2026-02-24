---
title: 'Instalando o certificado SSL-TLS grátis da Let’s Encrypt'
description:
  'você vai aprender a instalar e configurar o certificado SSL-TLS grátis da
  Lets Encrypt em quantos domínios preferir. É HTTPS gratuito para todos os seus
  sites.'
date: 2018-04-04
author: 'Luiz Otávio Miranda'
---

Nesse artigo você vai aprender a instalar e configurar o certificado SSL-TLS
grátis da Let's Encrypt em quantos domínios preferir. É HTTPS gratuito para
todos os seus sites.

Quando falamos em comércio eletrônico, estamos falando em duas coisas
extremamente importantes e sensíveis: dados pessoais e dinheiro. Portanto, a
segurança é primordial para que todos os dados passem através de conexões
seguras.

Certamente, você já deve ter ouvido algum especialista em
[segurança online](/categoria/seguranca/) explicando que, uma das primeiras
coisas a se verificar para saber se um e-commerce qualquer é seguro, é verificar
se ele possui “aquele cadeado” falando que a conexão é segura (ou, ao invés de
usar **HTTP** no início do
[domínio](/2018/dominio-e-hospedagem-guia-para-leigos/), usar **HTTPS**).

Na verdade, todos os sites que utilizam
[HTTPS](https://pt.wikipedia.org/wiki/Hyper_Text_Transfer_Protocol_Secure)
(_Hyper Text Transfer Protocol Secure_) têm uma camada adicional de segurança
que usa o protocolo
[SSL-TLS](https://pt.wikipedia.org/wiki/Transport_Layer_Security). Essa camada
de segurança permite que dados sejam transmitidos por uma conexão criptografada
que verifica a autenticidade do servidor e do computador cliente usando
certificados SSL-TLS. A porta TCP usada pelo HTTPS é a 443.

Falando em modo superficial, qualquer dado pessoal que o cliente digitar em um
site com HTTPS, só poderá ser lido no servidor para o qual ele foi enviado. Se,
por algum motivo, algum hacker consiga capturar os dados no meio do caminho,
esses dados estarão fortemente criptografados e seria quase impossível lê-los
(digo “quase”, porque nunca se sabe, né?).

Além disso, se você se preocupa com
[SEO](https://marketingdeconteudo.com/o-que-e-seo/) (aparecer primeiro nas
buscas), HTTPS também deverá ajudar
[seu site a se posicionar melhor](https://imasters.com.br/devsecops/o-impacto-ssl-e-o-https-ranking-em-seo)
no google, por exemplo.

A [Let's Encrypt](https://letsencrypt.org/) é uma autoridade de certificação
lançada em 12 de abril de 2016, que fornece certificados SSL-TLS grátis através
de um processo automatizado, criado para eliminar a complexidade dos processos
atuais de criação, validação, instalação e renovação de certificados para sites
seguros. Sua intenção é fazer com que toda a Internet use HTTPS por uma web mais
segura.

Com poucos comandos você conseguirá instalar e configurar seu certificado
SSL-TLS, habilitando assim HTTPS para seu site.

Então vamos às configurações. Bora lá!

## Antes de começar

Este tutorial é voltado para a instalação do certificado SSL-TLS grátis da Let’s
Encrypt diretamente no servidor, sendo, assim, não vou me atentar para
[hospedagens](/2018/dominio-e-hospedagem-guia-para-leigos/) que ofereçam este
recurso em seus respectivos painéis. Se a sua hospedagem oferece certificado SSL
gratuito (certamente, é da Let’s Encrypt), por favor, utilize o próprio painel
da hospedagem para habilitar HTTPS no seu site, certamente, eles têm um tutorial
explicando como realizar tal procedimento.

No momento da criação deste tutorial, estou usando o Debian 9. Este tutorial
deverá funcionar perfeitamente em qualquer versão baseada em Debian (Ubuntu,
Linux Mint e assim por diante).

Vou explicar como instalar e configurar o certificado. Posteriormente no artigo,
explicar como configurar um server block para **Nginx** e como configurar um
Virtualhost para **Apache**.

Se você ainda não instalou nem configurou nenhum desses servidores Web, siga um
dos tutoriais abaixo:

- [nginx + php-fpm no Linux (Debian ou Ubuntu)](/2018/nginx-php-fpm-no-linux/)
- [Como instalar e configurar o Apache2 e o PHP-FPM no Ubuntu ou Debian](/2018/apache2-php-fpm-ubuntu-debian/)

Feito isso, agora é só prosseguir com o tutorial.

## Instalando o certbot

**certbot** é o cliente que vai buscar os certificados da Let’s Encrypt. Muito
fácil de usar e instalar.

Para instalar basta digitar:

```shell
sudo apt-get install certbot
```

No seu terminal.

## Instalando o certificado SSL-TLS

Após a instalação do certbot, você precisa parar os serviços que rodam na porta
80 (apache ou nginx). Para isso basta digitar:

```shell
# Para o nginx
service nginx stop
# Para o apache2
service apache2 stop
```

E para instalar o certificado SSL-TLS digite:

```shell
sudo certbot certonly --standalone -d meudominio.com.br -d www.meudominio.com.br
```

A única coisa que você precisa alterar são os domínios. Geralmente, um domínio
tem duas versões:

- meudominio.com.br
- www.meudominio.com.br

Ambas apontando para o mesmo local, se esse for o seu caso, no comando acima
altere apenas a parte “meudominio.com.br” para o seu domínio nos dois locais.

Se o seu domínio tem apenas uma versão, use o seguinte comando:

```shell
sudo certbot certonly --standalone -d meudominio.com.br
```

Você deverá receber uma mensagem dizendo que está tudo OK, por exemplo:

```shell
IMPORTANT NOTES:
- Congratulations! Your certificate and chain have been saved at
  /etc/letsencrypt/live/meudominio.com.br/fullchain.pem.
  Your cert will expire on 2018-11-23. To obtain a new or tweaked
  version of this certificate in the future, simply run certbot
  again. To non-interactively renew *all* of your certificates, run
  "certbot renew"
- If you like Certbot, please consider supporting our work by:

  Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
  Donating to EFF:                    https://eff.org/donate-le
```

Isso quer dizer que seu certificado SSL-TLS foi salvo em
/etc/letsencrypt/live/meudominio.com.br/.

Para cada domínio você terá uma pasta com o nome do domínio em questão.
Portanto, se você tem mais de um domínio, siga os mesmos passos para gerar um
certificado SSL-TLS para cada um deles.

## Configurando um Server Block no nginx

Depois de criar seu certificado SSL-TLS, agora você precisa falar para o nginx
as configurações SSL. Para isso acesse o server block do seu site em
/etc/nginx/sites-enabled/meudominio.com.br (ou o nome que você deu para o server
block do seu site).

```shell
sudo nano /etc/nginx/sites-enabled/meudominio.com.br
```

E adicione as linhas a seguir em vermelho:

```nginx
server {
	listen 80;
	listen [::]:80;

	listen 443 ssl http2;
	listen [::]:443 ssl http2;

	ssl_certificate /etc/letsencrypt/live/meudominio.com.br/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/meudominio.com.br/privkey.pem;
	ssl_trusted_certificate /etc/letsencrypt/live/meudominio.com.br/chain.pem;

	ssl_session_cache shared:SSL:10m;
	ssl_session_timeout 5m;

	ssl_prefer_server_ciphers on;
	ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

	# Desativa SSLv3
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

	# Diffie-Hellman
	# $ sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
	ssl_dhparam /etc/ssl/certs/dhparam.pem;

	# Ativa HSTS
	add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";

	# Ativa OCSP stapling
	ssl_stapling on;
	ssl_stapling_verify on;
	resolver 8.8.8.8 8.8.4.4 valid=300s;
	resolver_timeout 5s;

	root /var/www/meudominio.com.br/public_html/;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html index.php;

	server_name meudominio.com.br www.meudominio.com.br;

	location / {
		try_files $uri $uri/ =404;

		# Para WordPress
		# try_files $uri $uri/ /index.php?q=$uri&$args;
	}

	# Passa scripts PHP para o servidor FastCGI (PHP-FPM)
	#
	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_intercept_errors on;

		#fastcgi_index index.php;
		if (!-f $realpath_root$fastcgi_script_name) {
			return 404;
		}

		fastcgi_buffers 16 16k;
		fastcgi_buffer_size 32k;

		include /etc/nginx/fastcgi_params;
		fastcgi_pass 127.0.0.1:9010;
	}

	location ~ /\. {
		access_log off;
		log_not_found off;
		deny all;
	}

	access_log off;
	error_log   /var/log/nginx/meudominio.com.br-error.log;
}
```

As linhas em vermelho no trecho do server block acima configuram SSL no seu
nginx.

Mais uma coisinha: você precisa executar mais um comando para prevenir
[ataque contra chaves Diffie-Hellman](https://www.kryptus.com/diffie-hellman-no-openssl/)
no OpenSSL.

Para isso digite:

```shell
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096
```

**Atenção:** isso vai demorar mmmmmmmmmmmuuuuuuuuuuuiiiiiiiiitooo.

Por fim, não se esqueça de iniciar o nginx novamente.

```shell
sudo service nginx start
```

Em caso de erros, provavelmente são os caminhos dos arquivos, verifique se estão
todos em seus devidos locais.

## Configurando um Virtualhost no Apache

Se você usa apache, altere seu virtualhost digitando:

```shell
sudo nano /etc/apache2/sites-enabled/meudominio.com.br.conf
```

Claro, você precisa alterar o comando acima para o nome do seu virtualhost.conf.

Eu criei um virtualhost simples aqui no apache na porta 80 que ficou assim:

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@meudominio.com.br
    DocumentRoot /var/www/meudominio.com.br/public_html
    ServerName meudominio.com.br
    ServerAlias www.meudominio.com.br

    CustomLog /var/log/apache2/access-meudominio.com.br.br.log combined
    ErrorLog /var/log/apache2/error-meudominio.com.br.br.log

    <FilesMatch "\.php$">
        <If "-f %{SCRIPT_FILENAME}">
            SetHandler "proxy:fcgi://127.0.0.1:9010"
        </If>
    </FilesMatch>

    <Directory "/var/www/meudominio.com.br/public_html">
        Options FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        allow from all
    </Directory>
</VirtualHost>
```

Um virtualhost bem básico com [PHP-FPM](/2018/apache2-php-fpm-ubuntu-debian/).

Para certificado SSL-TLS, vou clonar esse virtualhost, porém adicionando algumas
coisinhas, veja:

```apache
<VirtualHost *:443>
    ServerAdmin webmaster@meudominio.com.br
    DocumentRoot /var/www/meudominio.com.br/public_html
    ServerName meudominio.com.br
    ServerAlias www.meudominio.com.br

    <FilesMatch "\.php$">
        <If "-f %{SCRIPT_FILENAME}">
            SetHandler "proxy:fcgi://127.0.0.1:9010"
            #SetHandler "proxy:unix:/var/run/php/php7.2-fpm-om.sock|fcgi://127.0.0.1:9010/"
        </If>
    </FilesMatch>

    <Directory "/var/www/meudominio.com.br/public_html">
        Options FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        allow from all
    </Directory>

    CustomLog /var/log/apache2/access-meudominio.com.br.br.log combined
    ErrorLog /var/log/apache2/error-meudominio.com.br.br.log

    SSLEngine on

    SSLProtocol             all -SSLv2 -SSLv3
    SSLCipherSuite          ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS
    SSLHonorCipherOrder     on
    SSLCompression          off

    SSLOptions +StrictRequire

    SSLCertificateFile /etc/letsencrypt/live/meudominio.com.br/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/meudominio.com.br/privkey.pem
</VirtualHost>
```

As partes em vermelho do código são as partes que adicionei para o certificado
SSL-TLS.

Você também precisa ativar o módulo SSL do apache2, para isso digite:

```shell
sudo a2enmod ssl
```

Lembre-se também que, no apache, você precisa ter os dois virtualhosts, o da
porta 80 e o da porta 443.

Para finalizar, inicie o apache:

```shell
service apache2 start
```

Prontinho, só testar.

Até a próxima!
