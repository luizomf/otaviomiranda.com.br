---
title: 'SleeperGem foge do CI; WP2Shell entra em exploração relatada'
description: 'RubyGems maliciosas miram laptops de desenvolvedores, empresas relatam ataques ao WordPress, Harness Score leva verificações ao CI e um certificado atribuído ao Fable põe uma conjectura matemática à prova.'
date: 2026-07-20T05:18:57-03:00
author: 'The Paper LLM'
image: './images/sleepergem-foge-do-ci-wp2shell-entra-em-exploracao-relatada.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/sleepergem-foge-do-ci-wp2shell-entra-em-exploracao-relatada/final.opus'
---

![Gema Ruby vermelha sobre um laptop após passar por um checkpoint verde de CI.](./images/sleepergem-foge-do-ci-wp2shell-entra-em-exploracao-relatada.jpg)

O pipeline terminou verde. Ótimo. Só tem um problema: o pacote malicioso pode ter reconhecido o CI e ficado quieto. No laptop do desenvolvedor, perto das chaves SSH, dos tokens de cloud e das credenciais Git, o comportamento era outro.

Foi essa a escolha da campanha SleeperGem, encontrada em três pacotes do RubyGems publicados entre 18 e 19 de julho. A pergunta deixa de ser apenas “a build passou?” e vira “o que rodou na máquina de quem escreveu o código?”. E tem outra verificação urgente nesta manhã: poucos dias depois do patch, empresas de segurança já relatam exploração da cadeia WP2Shell no WordPress.

## SleeperGem reconhece o CI e espera pelo laptop

StepSecurity e Aikido analisaram três gems usadas como carregadores da mesma campanha. RubyGems é o registro de pacotes do ecossistema Ruby. O Bundler registra as versões escolhidas no `Gemfile.lock`, então é por esse arquivo que a busca começa.

As versões apontadas são:

- `git_credential_manager` da 2.8.0 à 2.8.3;
- `Dendreo` 1.1.3 e 1.1.4;
- `fastlane-plugin-run_tests_firebase_testlab` 0.3.2.

Segundo a StepSecurity, o carregador procurava cerca de 30 variáveis de ambiente ligadas a sistemas de integração contínua. Se encontrasse sinais de CI, parava antes de ativar o segundo estágio. Ou seja, instalar a dependência numa pipeline e não ver nada suspeito não reproduzia o que podia acontecer numa estação de trabalho.

Fora do CI, o código baixava um segundo estágio de um caminho hospedado numa instância pública de Forgejo. A StepSecurity descreve a instalação de um daemon nativo, além de persistência por serviço systemd de usuário e cron. Assim, o processo voltava depois de uma reinicialização. A análise também encontrou um caminho de escalada capaz de criar um shell setuid disfarçado de `ping6`, mas só quando a condição de privilégio prevista pelo script fosse satisfeita.

O daemon ainda não foi completamente caracterizado. A StepSecurity observou o servidor que distribuía o payload, mas diz que o comportamento de rede do binário precisa de uma análise separada. Portanto, não dá para dizer que os pesquisadores viram credenciais sendo exfiltradas. Já dá para dizer que código persistente chegou perto de segredos valiosos numa máquina de desenvolvimento. É motivo suficiente para tratar o incidente com seriedade.

A sequência de versões mostra como a campanha evoluiu. No pacote que imitava o Git Credential Manager, a 2.8.2 baixava o segundo estágio, mas deixava a execução comentada. A 2.8.3 ativou a cadeia. A Aikido relata quatro versões rápidas desse pacote, duas versões novas de `Dendreo` e uma atualização do plugin de fastlane depois de anos parado. O plugin somava 574.661 downloads no momento da análise. Esse é o histórico total do pacote, **não a quantidade de vítimas**.

Durante a apuração, as versões maliciosas já tinham sumido do inventário público atual. `Dendreo` voltou a mostrar a 1.1.2; o plugin de fastlane, a 0.3.1, publicada em 2019; e a API de `git_credential_manager` respondia com 404. Isso combina com remoção ou yank, embora a API não explique o motivo. Também não limpa uma máquina onde alguma dessas versões já foi instalada.

Para começar a investigação, procure as versões afetadas em todos os `Gemfile.lock`, inclusive em branches e repositórios menos ativos. Encontrar uma delas no lockfile confirma a dependência, não a execução. A exposição depende de a gem ter sido instalada ou carregada e do ambiente em que isso ocorreu. Se uma versão afetada rodou numa estação, os pesquisadores recomendam tratar a máquina e os segredos ao alcance dela como comprometidos: remova a persistência, investigue os artefatos e rotacione as credenciais.

Os caminhos locais relatados são `$HOME/.local/share/gcm/git-credential-manager`, `$HOME/.local/share/gcm/.env` e `/usr/local/sbin/ping6`. O caminho remoto usado no ataque foi `git[.]disroot[.]org/git-ecosystem/`. O domínio hospeda um Forgejo público legítimo, então bloquear o serviço inteiro sem considerar o caminho e a conta usados na campanha não faz sentido.

Recentemente a gente falou de [pacotes npm e instalações induzidas por README](/2026/o-agente-instala-o-que-o-readme-mandar-a-openai-admite-que-o-sol-apaga-arquivos/). Agora o carregador tenta parecer inofensivo justamente onde a equipe costuma inspecionar as dependências. O CI verde ainda ajuda. Só não serve mais de álibi.

Fontes: [StepSecurity — análise da campanha SleeperGem](https://www.stepsecurity.io/blog/sleepergem-compromised-rubygems-drop-persistent-backdoor), [Aikido Security — ataque à supply chain do RubyGems](https://www.aikido.dev/blog/sleepergem-rubygems-supply-chain-attack), [API do RubyGems para Dendreo](https://rubygems.org/api/v1/gems/Dendreo.json) e [API do RubyGems para o plugin fastlane](https://rubygems.org/api/v1/gems/fastlane-plugin-run_tests_firebase_testlab.json).

## WP2Shell já aparece em relatos de exploração

No sábado, [explicamos a correção da cadeia WP2Shell no WordPress](/2026/wordpress-fecha-rce-no-core-enquanto-sqlite-e-aurora-dsql-expoem-o-custo-da-coordenacao/). Naquele momento, as fontes primárias consultadas não confirmavam exploração ativa. Agora Patchstack, Hexastrike e WatchTowr disseram à SecurityWeek que observaram tentativas ou incidentes de exploração durante o fim de semana. Provas de conceito públicas também apareceram.

Essa atribuição precisa ficar clara. O relato de exploração vem da SecurityWeek e das empresas ouvidas pela reportagem. As páginas oficiais do WordPress, da Searchlight e da Cloudflare consultadas nesta apuração não afirmam ter telemetria própria de exploração em campo.

A falha combina duas peças no core. O endpoint batch da API REST agrupa requisições, e uma confusão de rota deixa acessível uma injeção SQL no parâmetro `author__not_in`, usado pelo `WP_Query`. Nas versões afetadas das linhas 6.9 e 7.0, a cadeia chega à execução remota de código sem autenticação. O atacante não precisa ter conta, e a exploração não depende de um plugin vulnerável.

O mapa das versões exige atenção:

- WordPress 6.9.0 a 6.9.4 deve ser atualizado para 6.9.5;
- WordPress 7.0.0 e 7.0.1 deve ser atualizado para 7.0.2;
- WordPress 6.8.0 a 6.8.5 deve ir para 6.8.6, que corrige a injeção SQL nessa linha. O advisory não inclui a linha 6.8 na cadeia de execução remota.

A cadeia é identificada por CVE-2026-63030 e GHSA-ff9f-jf42-662q. A injeção SQL é a CVE-2026-60137, também identificada por GHSA-fpp7-x2x2-2mjf. O WordPress publicou os patches em 17 de julho, recomendou atualização imediata e acionou atualizações automáticas forçadas para as versões afetadas.

Mesmo assim, confira a versão que está instalada. Uma tentativa de auto-update não prova que o patch chegou a todos os sites. Se a instalação ficou exposta e sem correção nessa janela, o novo relato é motivo para investigar o servidor como potencialmente comprometido. Só atualizar e tocar o dia não resolve essa dúvida.

A Cloudflare implantou regras de WAF contra a injeção e a execução de código em 17 de julho, às 17h03 UTC. Isso inclui o plano gratuito quando o tráfego passa pelo WAF. Como contenção temporária, a Searchlight também recomenda bloquear as duas formas da rota batch: `/wp-json/batch/v1` e `rest_route=/batch/v1`. WAF e bloqueio de rota podem reduzir a exposição, mas ainda podem sofrer bypass ou quebrar integrações. Nenhum dos dois corrige o WordPress ou remove um comprometimento anterior.

Fontes: [WordPress 7.0.2](https://wordpress.org/news/2026/07/wordpress-7-0-2-release/), [advisory da cadeia de RCE](https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-ff9f-jf42-662q), [advisory da injeção SQL](https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-fpp7-x2x2-2mjf), [SecurityWeek — exploração relatada em campo](https://www.securityweek.com/wp2shell-wordpress-vulnerabilities-exploited-in-the-wild/), [Cloudflare — regras de WAF](https://blog.cloudflare.com/wordpress-vulnerabilities/) e [Searchlight — orientação de mitigação](https://wp2shell.com/).

## Harness Score transforma o ambiente do agente em gate

Ontem falamos de [harness engineering como o trabalho feito ao redor do modelo](/2026/nsjail-blinda-codigo-de-terceiros-num-vps-e-o-harness-vira-a-peca-que-decide-o-agente/). O Harness Score 1.0 transforma esse vocabulário numa ferramenta brasileira concreta: um scanner determinístico que examina os artefatos do repositório e devolve nível, pontuação e sugestões de melhoria.

“Harness”, neste caso, é o ambiente que orienta e restringe o agente. A conta inclui arquivos de contexto como `AGENTS.md` e `CLAUDE.md`, regras com escopo, skills, hooks, ferramentas, testes, lint, tipos e CI. O scanner verifica fatos no filesystem e na configuração. Ele não pede a opinião de outro modelo, então o mesmo commit deve gerar o mesmo resultado. Isso permite criar uma baseline, comparar mudanças e bloquear a pipeline abaixo de um nível mínimo.

A versão 1.0.0 saiu em 15 de julho e ainda aparecia como `latest` no npm durante a apuração. Segundo o projeto, o scanner tem 36 checagens, 108 pontos, seis dimensões e níveis de L0 a L4. A execução não chama LLM, não usa rede e não tem dependências de runtime. O pacote requer Node.js 18 ou superior.

O comando inicial é `npx harness-score`. A opção `--json` produz uma saída que outras ferramentas conseguem consumir. No exemplo do projeto, `--min-level 3` transforma o nível em gate. Os códigos de saída diferenciam aprovação, falha do gate e erro de uso. O scanner também reconhece artefatos equivalentes de Cursor, Claude Code, Windsurf, Cline, Continue, Codex e outros ambientes.

Tem uma pegadinha operacional aqui: se o pacote não estiver em cache, `npx` pode baixá-lo da rede e executá-lo. Para ter uma pipeline reproduzível, eu fixaria a versão em `devDependencies` em vez de rodar sempre o pacote que estiver publicado naquele momento.

O score também precisa ser lido pelo que ele mede. O próprio autor diz que a ferramenta verifica a infraestrutura disponível, não a qualidade dos testes, a verdade das regras, a correção funcional do software ou práticas que ficam fora do repositório. Checagens baseadas em presença ou padrão podem dar falsos positivos e falsos negativos. E, nesta apuração, não apareceu estudo independente que associe um score alto a menos defeitos ou a agentes melhores.

O uso é mais modesto, mas bem prático: transformar ausências em algo visível e repetível. “Existe teste?” não responde “o teste presta?”. Ainda assim, é uma pergunta muito melhor para automatizar do que “esse repositório parece responsável?”.

Fontes: [GitHub — paladini/harness-score](https://github.com/paladini/harness-score), [release v1.0.0](https://github.com/paladini/harness-score/releases/tag/v1.0.0) e [registro do pacote no npm](https://registry.npmjs.org/harness-score).

## Um certificado atribuído ao Fable desafia uma conjectura de 1939

A última história também passa por verificação, mas troca YAML por álgebra. Levent Alpöge, matemático que trabalha na Anthropic, publicou numa rede social uma aplicação polinomial de três variáveis complexas em outras três. Ele atribui o trabalho ao “Fable” e apresenta o objeto como um possível contraexemplo à Conjectura Jacobiana.

Formulada por O. H. Keller em 1939, a conjectura pergunta se todo mapa polinomial complexo com determinante jacobiano constante e diferente de zero precisa ter uma inversa também polinomial. O jacobiano é a matriz das derivadas parciais do mapa. Um determinante não nulo garante invertibilidade local; a conjectura tenta estender essa propriedade para uma afirmação global.

O mapa publicado tem grau máximo sete. Alpöge afirma que o determinante jacobiano é sempre -2 e fornece três entradas distintas com a mesma saída: `(0, 0, -1/4)`, `(1, -3/2, 13/2)` e `(-1, 3/2, 13/2)` produziriam `(-1/4, 0, 0)`.

É isso que torna o certificado interessante. Uma função com inversa precisa ser injetiva, ou seja, entradas diferentes não podem terminar no mesmo resultado. Se o polinômio publicado realmente mantém o determinante em -2 e contém essa colisão, ele contradiz a conclusão da conjectura. A checagem mínima é finita: derive o determinante e substitua os três pontos. Alpöge incluiu links de cálculo na sequência da publicação, e a apuração reproduziu as duas propriedades localmente com SymPy.

Ainda não dá para escrever “IA resolveu a matemática” na manchete. O post saiu em 20 de julho, às 02h19 UTC, poucas horas antes desta edição começar a circular. Não foi localizado paper, preprint, revisão por pares, comunicado da Anthropic ou validação pública independente de um especialista. A reprodução algébrica local confere o objeto apresentado, mas não substitui a revisão pública. Correções e contexto adicional ainda podem aparecer.

A autoria também não está bem delimitada. Alpöge credita o Fable, porém não publicou prompts, transcrição, versão do modelo ou a divisão exata entre o trabalho humano e o da IA. Por enquanto, a história é mais estreita: um matemático publicou um possível contraexemplo atribuído ao sistema e entregou um certificado compacto que outras pessoas podem tentar confirmar ou refutar.

Já tínhamos falado do [Fable 5 e da necessidade de controlar agentes](/2026/fable-5-voltou-azure-cli-apanhou-e-o-setup-virou-fronteira/). Desta vez existe algo melhor que uma demonstração de palco: um objeto explícito. Pode virar um resultado histórico, receber uma correção rápida ou esbarrar num detalhe que muda a interpretação. Seja qual for o caso, o próximo passo é o mesmo: abra a álgebra.

Fontes: [thread de Levent Alpöge, em mirror público](https://xcancel.com/__alpoge__/status/2079028340955197566), [Encyclopedia of Mathematics — Jacobian conjecture](https://encyclopediaofmath.org/wiki/Jacobian_conjecture) e [página pessoal de Levent Alpöge](https://alpo.ge/).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
source_urls:
  - https://www.stepsecurity.io/blog/sleepergem-compromised-rubygems-drop-persistent-backdoor
  - https://www.aikido.dev/blog/sleepergem-rubygems-supply-chain-attack
  - https://rubygems.org/api/v1/gems/Dendreo.json
  - https://rubygems.org/api/v1/gems/fastlane-plugin-run_tests_firebase_testlab.json
  - https://wordpress.org/news/2026/07/wordpress-7-0-2-release/
  - https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-ff9f-jf42-662q
  - https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-fpp7-x2x2-2mjf
  - https://www.securityweek.com/wp2shell-wordpress-vulnerabilities-exploited-in-the-wild/
  - https://blog.cloudflare.com/wordpress-vulnerabilities/
  - https://wp2shell.com/
  - https://github.com/paladini/harness-score
  - https://github.com/paladini/harness-score/releases/tag/v1.0.0
  - https://registry.npmjs.org/harness-score
  - https://xcancel.com/__alpoge__/status/2079028340955197566
  - https://encyclopediaofmath.org/wiki/Jacobian_conjecture
  - https://alpo.ge/
-->
