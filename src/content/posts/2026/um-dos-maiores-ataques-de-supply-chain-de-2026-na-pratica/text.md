---
title: 'Um dos maiores ataques de supply chain de 2026 (na prática)'
description:
  'O ataque ao Trivy e LiteLLM pelo TeamPCP nos ensinou muitas coisas novas.
  Caso tenha perdido, vou replicar o ataque na prática. Bora aprender juntos!'
date: 2026-04-02T17:07:56-03:00
author: 'Otávio Miranda'
---

Obs.: o tom desse artigo está extremamente diferente de como eu escrevo
realmente. O motivo é que se eu falar realmente como eu escrevo, o artigo não
vai ser entregue ou vai ser removido por questões de segurança. O assunto é
sério e precisa ser falado, mas de forma que o algoritmo entenda e não remova o
conteúdo.

Pessoal, preciso falar de um assunto muito sério hoje. Existe um ataque de
supply chain bem engenhoso rolando na internet, e se você usa GitHub Actions ou
pip install em qualquer pacote Python, você precisa me ouvir. Entre fevereiro e
março de 2026 a coisa ficou bem feia na nossa área.

Alguns responsáveis por esse problema conseguiram comprometer o Trivy (sim, um
grande scanner de segurança do mercado) e o LiteLLM (que bate quase 95 milhões
de downloads mensais no PyPI). Tem indícios de que sobrou até para o Checkmarx.

Eu montei a timeline desses eventos, reproduzi partes do incidente no meu
laboratório privado e agora vou te mandar a real dos acontecimentos por baixo
dos panos e como você protege o seu próprio código de dor de cabeça igual a
essa.

**Apoio**

Se estiver precisando de servidores (VPS) com bom custo-benefício, dá uma olhada
na Hostinger. Usando meu link e cupom, você ganha até 2 anos de desconto.

- [hostinger.com/otaviomiranda](https://hostinger.com/otaviomiranda)
- Cupom: `OTAVIOMIRANDA`

## Em vídeo

Fiz um vídeo completo sobre o assunto, caso queira assistir:

- [https://youtu.be/oFrcf_17gRg](https://youtu.be/oFrcf_17gRg)

Então agora é texto, bora...

## A fresta de entrada e o bot

Tudo começou lá pelo final de fevereiro, quando surgiu uma conta no GitHub
chamada "hackerbot-claw". Esse bot ficava o dia todo escaneando a rede pública
atrás de projetos com aquela falha simples na área de CI/CD. Cedo ou tarde ele
iria encontrar algo.

O bot focava em projetos usando o famigerado trigger `pull_request_target`. Só
para nivelar a questão: o trigger normal `pull_request` no Actions roda tudo num
ambiente bem isolado blindando os secrets do repositório. O perigo mora lá na
sintaxe de "target", que ao contrário da normal inicia tudo mirando com
permissões da "main", com a faca e o queijo na mão (no caso todas as chaves e
senhas configuradas no sistema).

O ponto de quebra que abriu a porta foi as equipes combinarem o trigger exposto
com o checkout direto das linhas dos contribuintes na PR. Isso significa pegar
código totalmente não testado rodando nos runners com variáveis da sua carteira
de trabalho da nuvem liberados.

```yaml
on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # O erro: Fazer checkout de um PR feito por desconhecidos
      # dentro de um job na retaguarda com secrets destravados!
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}

      - run: make build
```

Eles conseguiram furar e rodar o script no repositório gigante do Trivy
explorando exatamente esse passo fraco.

## A captura silenciosa do sistema

Na surdina, o script configurado por eles largou um comando de rede simples,
entrando nos parâmetros ativos da máquina sem gritaria e sem levantar suspeitas.
Eles extraíram os dados do processo lendo a memória RAM de forma direta mapeando
os volumes de execução. Lá nesse bloco constava o token principal de acesso ao
projeto.

Assim que a senha de edição foi parar no servidor deles, efetuaram um envio
camuflado no formato do Conventional Commits e fingiram assinar com a autoria de
antigos mantenedores oficiais do Trivy. Tudo continuou parecendo muito normal
para a equipe original de manutenção do pacote.

Mas a artimanha inserida trocou com primor um apontamento lá da rotina de
lançamento para um endereço alvo falso com o nome (removido por questões de
segurança). Esse código alterado ficou um par de semanas dormente, esperando
pacientemente o fluxo rodar.

## Farsa das tags e a queda do LiteLLM

Então botaram a cereja principal da situação e cometeram o force push no
repositório brutalmente, rebaixando e trocando muito mais do que setenta tags do
Trivy de volta à fase comprometida. Agora mesmo quem só declarava o clássico
valor (REMOVIDO POR QUESTÕES DE SEGURANÇA) nas automações passava a usar esse
código contendo as extrações escondidas.

Para o grupo do LiteLLM o estrago nas tags causou muito dano. Todo o fluxo
interno de Actions que a equipe geria estava perfeitamente configurado sem erros
no caso de checkouts e PRs de estranhos. Só que os devs haviam importado o Trivy
na esteira para auditar falhas do mesmo modo padrão utilizado pela grande
comunidade global.

A action modificada desceu rodando no servidor LiteLLM engolido pelos scanners
deles e extraiu na hora as credenciais sensíveis de enviar releases lá de dentro
da automação (chaves das atualizações locais). Pegaram tudo, codificaram os
textos e jogaram no próprio servidor remoto que hospedavam. Usando a chave do
pacote que eles conseguiram puxar do projeto oficial, o grupo subiu na loja do
Python de forma validada o conteúdo do LiteLLM alterado, e para enganar geral a
conta primária de código continuava livre desse incidente. O buraco havia sido
feito só lá no entregável do servidor e a comunidade de uso instalava pacotes
não oficiais rotineiramente sem nem notar.

## O truque do .pth e a bomba de processos

Qual foi o passo sorrateiro no pacote pra sobrecarregar a máquina dos
desenvolvedores que instalavam isso no seu uso trivial daquele dia? Eles
espalharam um pequeno arquivo de sistema usando o formato `.pth` guardado com
discrição nos diretórios de ambiente (pasta padrão originada na execução das
instalações locais).

Muitos desconhecem, mas quando a gente sobe uma rotina do código, o motor
processa este script `.pth` para registrar os percursos extras em diretórios que
vão constar na variável base. O detalhe não divulgado é que iniciar frases
contendo a ordem "import" executa na mesma hora toda alocação contida logo à
frente. Sem cerimônia e sem exigências adicionais.

```python
import os; exec("REMOVIDO POR QUESTÕES DE SEGURANÇA")
```

Só de levantar o prompt REPL, pedir um log simples ou debugar a aplicação, a
ferramenta já ativava rotinas secundárias no fundo, mapeando variáveis de
ambiente e transferindo resumos pra longe. E sabe por que a conta não fechou e
fomos notificados prontamente pela comunidade? Eles erraram bizarramente os
loops na inicialização, o que ocasionou chamadas retroativas num
congestionamento de tarefas conhecido no mercado por fork bomb. Cerca de onze
mil comandos simultâneos rodando até engasgar os computadores alertaram a
supervisão em vários setores de que isso era um gargalo gravíssimo rolando de
forma anômala.

## Ajustes necessários pra você e sua equipe

Esse alerta vem para mostrar onde devemos nos ligar ao construir e publicar
sistemas inteiros pelo Github sem copiar do escopo global como meros
digitadores. Segue o que funciona tranquilamente no isolamento básico reduzindo
bastante os perigos em pipelines.

Use sempre o valor de Hash e não coloque mais a variável nominal do pacote via
tag. Todo commit original do projeto traz uma representação com letras que você
joga fixada de forma absoluta na frente de tudo que puxar nos runners que nunca
será fraudada ou mudada a rodo. Acima disso você tranca no Docker os pacotes
referenciando a imagem por meio de digest da versão original ao invés da sintaxe
última do release na linha.

```yaml
# Inseguro
uses: exemplo/seguro@v1

# Correto fixado via hash de origem do projeto
uses: exemplo/seguro@a1b2c3d4e5f6...
```

Outro conselho de peso pra amarrar bem a porta nos workflows lida com a
verificação de código puxado. Só traga checkouts desconhecidos validando por
`pull_request` fechado impedindo rodagem nas permissões chaves da branch mãe de
ponta. Reserve `pull_request_target` no limite seguro pra aprovar flags e regras
nos projetos, contanto que jamais em nenhuma circunstância puxe ou aplique `ref`
externa junto com isso nas ações de build. Tranque a sua internet configurando
firewalls travando saídas agressivas de envio direto a domínios ocultos da rede
no executor Github se não usar isso nas chamadas oficiais ou pacotes internos
pra evitar vazamentos descarados do token local na tela dele.

E façam revisões atentas nas dependências do backend renovando credenciais em
bloco, nunca deixando chaves antigas ativas. Analisem também aquele formato
`.pth`, sempre validando se algo conta com chamadas automatizadas antes que isso
crie brechas indesejáveis em aplicações rodando de forma corporativa ou caseira.

No blog e aqui na aba de comunidade falo das paradas baseadas na raiz, focando
para melhorarmos nossas skills avançadas na engenharia ao criarmos ferramentas
pra toda galera dev na comunidade com as nossas proteções sólidas montadinhas do
que o mercado expõe como norma nas vulnerabilidades em andamento diário no
ecosistema por ai afora da net de desenvolvimento livre onde tem o perigo atual
operante do supply chain escondidinho onde menos se acredita. Assine a
Newsletter ali pra ganhar essas pegadas que chegam rápidas por lá também sem
burocracia dos banners irritantes nas navegações usuais na plataforma oficial. É
eu trocando a parte técnica limpa a seu dispor direto pro coração dos estudos em
tecnologia.

Até a próxima.
