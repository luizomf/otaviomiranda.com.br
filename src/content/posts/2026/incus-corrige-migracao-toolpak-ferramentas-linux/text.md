---
title: 'Incus corrige falhas de migração; Toolpak propõe ferramentas independentes do Linux base'
description: 'Uma análise esclarece a espera por conflitos nas réplicas PostgreSQL. Também: Splash para IA local, correção do Elementor, tipos em Rust, TLA+ e Guix na nuvem.'
date: '2026-09-27T05:15:17-03:00'
author: 'The Paper LLM'
image: './images/incus-corrige-migracao-toolpak-ferramentas-linux.jpg'
audio: 'https://r2-content.otaviomiranda.com.br/content/posts/2026/incus-corrige-migracao-toolpak-ferramentas-linux/final.opus'
---

![Conector com o nome Incus e a versão 7.5.1, reforçado por braçadeiras, simboliza a correção de falhas na migração.](./images/incus-corrige-migracao-toolpak-ferramentas-linux.jpg)

O Incus corrigiu falhas de segurança, incluindo uma que permitia gravar no servidor durante uma migração maliciosa. No Linux, a proposta Toolpak busca separar as dependências das ferramentas sem restringir seu acesso ao sistema. A edição deste domingo também explica por que o limite de espera de uma réplica PostgreSQL não funciona como um prazo individual para cada consulta.

## Incus 7.5 corrige 11 problemas de segurança; o pacote disponível é o 7.5.1

O Incus, gerenciador de containers e máquinas virtuais, anunciou a versão 7.5 em 25 de setembro. A equipe informa que o download efetivo é o **7.5.1**, porque a primeira tentativa de lançamento não produziu todos os artefatos.

Entre as onze correções está uma falha na recepção de migrações. Segundo o aviso dos mantenedores, uma origem maliciosa podia usar links simbólicos — referências para outros caminhos do sistema de arquivos — para fazer a transferência gravar fora do volume esperado, no host, com privilégios de root. A verificação introduzida no Incus 7.3 acontecia **depois** da transferência: detectar o problema naquele momento não impedia a escrita.

Isso não equivale a dizer que qualquer visitante anônimo podia comprometer um servidor. O aviso descreve clientes autorizados a criar instâncias ou volumes, ou servidores dos quais o destino é instruído a copiar ou mover dados. São afetadas as recepções via `rsync` e a transferência otimizada com Btrfs; a transferência otimizada com ZFS não sofre essa falha específica. O aviso marca versões anteriores à 7.5.0 como afetadas e a correção a partir da 7.5.0. Ao atualizar, confira o pacote 7.5.1 ou a correção correspondente do seu distribuidor. A mitigação indicada é aceitar criação e migração apenas de partes confiáveis.

Há também uma novidade para organizar as instâncias: elas podem mudar de projeto sem parar, durante uma migração para outro membro **do mesmo cluster**. Os dispositivos precisam ter uma configuração equivalente no destino; não se trata de uma migração irrestrita entre clusters independentes.

Fontes: [anúncio do Incus 7.5](https://discuss.linuxcontainers.org/t/incus-7-5-has-been-released/27273) e [aviso sobre escrita no host durante migração](https://github.com/lxc/incus/security/advisories/GHSA-579w-c4rw-c8q3).

## Toolpak propõe isolar dependências sem confinar ferramentas de desenvolvimento

Jordan Petridis apresentou o Toolpak em 26 de setembro como uma proposta para distribuir utilitários em sistemas Linux baseados em imagens. Neles, a base do sistema é atualizada como um conjunto; instalar ferramentas avulsas e suas dependências pode exigir soluções diferentes das usadas em distribuições tradicionais.

A proposta combina imagens independentes, dependências empacotadas e um *mount namespace*: uma visão própria dos pontos de montagem para que a ferramenta encontre suas bibliotecas sem substituir as do host. Isso procura atender utilitários como `strace`, que inspeciona chamadas ao sistema, e QEMU, usado em emulação e virtualização.

**O isolamento pretendido é de dependências, não uma barreira contra ferramentas maliciosas.** O desenho prevê amplo acesso ao restante do sistema. Assinaturas e verificação de integridade ajudam a conferir a origem e a integridade do pacote; não tornam inofensivo o programa instalado.

O autor também reconhece que substituir um comando do sistema por uma implementação incompatível continua sendo um problema. Há trabalho em um protótipo e salvaguardas a investigar, não um substituto pronto para os gerenciadores atuais.

Fonte: [Jordan Petridis — Introducing Toolpak](https://blogs.gnome.org/alatiera/2026/09/26/introducing-toolpak/).

## PostgreSQL: a espera por conflitos na réplica não é um prazo novo para cada consulta

Uma análise publicada por Christophe Pettus em 26 de setembro detalha uma configuração fácil de interpretar errado. `max_standby_streaming_delay`, cujo padrão é 30 segundos, limita a espera para aplicar registros recebidos pela replicação quando eles entram em conflito com consultas na réplica. **Não garante 30 segundos de execução para cada consulta.**

A réplica precisa reaplicar o WAL, o registro das mudanças ocorridas no servidor principal. Uma consulta pode estar usando versões de linhas que esses registros mandam remover. Nesse conflito, o PostgreSQL espera até o limite configurado e pode cancelar a consulta para continuar a atualização. Se outra consulta já consumiu parte da espera, as seguintes terão menos tempo até que a réplica volte a acompanhar o principal. A documentação oficial confirma esse comportamento; `max_standby_archive_delay` aplica uma lógica semelhante ao WAL lido de arquivos, com orçamento por segmento.

A decisão prática é quanto atraso aceitar para preservar relatórios longos. Usar `-1` nesses limites permite esperar indefinidamente pela resolução dos conflitos, aceitando que a atualização da réplica fique à espera. Já `hot_standby_feedback` pode evitar cancelamentos ligados à limpeza de versões de linhas, mas ao custo de reter dados antigos e aumentar o espaço ocupado no principal. Não elimina todos os tipos de conflito.

A novidade é a explicação técnica, não uma mudança recém-introduzida no banco. Ela vale especialmente para quem usa a mesma réplica para relatórios e para assumir o serviço quando o principal falhar: esses dois objetivos podem pedir políticas diferentes.

Fontes: [análise de Christophe Pettus](https://thebuild.com/blog/all-your-gucs-in-a-row-max_standby_archive_delay-and-max_standby_streaming_delay/) e [documentação de replicação do PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY).

## Destaques rápidos para hoje.

- **Splash 1.1.0 amplia importação de modelos para IA local em Macs.** O lançamento de 26 de setembro adiciona importação de modelos suportados em GGUF e MLX e uma camada opcional de cache em SSD. Esse cache guarda estado de atenção usado na geração e não persiste após reiniciar o servidor. O pacote exige Apple M3 ou mais recente e macOS 26.4 ou superior. O suporte não cobre qualquer modelo nesses formatos; confira a lista antes de baixar. As medidas de concordância do próximo token publicadas pela equipe não são notas de precisão em tarefas. Fonte: [release do Splash 1.1.0](https://github.com/incoai/splash/releases/tag/1.1.0).

- **Elementor 4.3.2 corrige uma falha que podia transformar um clique em criação de administrador.** Segundo a divulgação da Patchstack de 25 de setembro, o problema afeta as versões 4.3.0 e 4.3.1 com o módulo Editor Events carregado. O experimento vem ativo por padrão em sites cuja primeira instalação do Elementor foi na versão 3.32.0 ou posterior; isso importa se eles estiverem usando uma das duas versões vulneráveis. Uma checagem sobre o endereço bruto da requisição desativava a proteção contra ações forjadas usando a sessão da vítima. Um administrador autenticado que abrisse um link preparado podia, assim, criar uma conta para o atacante. A atualização 4.3.2, publicada no dia 24, passa a verificar a rota resolvida. A recomendação é atualizar, não confiar apenas nas preferências de telemetria. Fonte: [análise e cronologia da Patchstack](https://patchstack.com/articles/cross-site-request-forgery-in-elementor-plugin-affecting-2-million-sites/).

- **Um artigo de Rust mostra como preservar uma validação no próprio tipo.** Eli Bendersky publicou em 26 de setembro exemplos de “Parse, don't validate”: em vez de verificar que uma lista não está vazia e continuar passando um vetor comum, convertê-la para um tipo que necessariamente contém um primeiro elemento. Quem recebe esse valor não precisa redescobrir a mesma garantia. O princípio também aparece em caminhos absolutos e inteiros diferentes de zero; é uma técnica de modelagem, não um recurso novo da linguagem. Fonte: [artigo de Eli Bendersky](https://eli.thegreenplace.net/2026/rusty-thoughts-on-parse-dont-validate/).

- **Artigo sobre TLA+ distingue recuperação possível de recuperação garantida.** No texto de 26 de setembro, Andrew Helwer explora a diferença entre existir um caminho até determinado estado e garantir que a execução chegará lá. TLA+ é uma linguagem para especificar e analisar sistemas concorrentes. O verificador TLC tem suporte básico, ainda beta, para saber se um estado pode ser alcançado a partir de algum estado inicial. Isso não prova que a recuperação é possível de qualquer estado: o autor discute uma extensão para essa checagem e alternativas de formalização, sem anunciar a extensão como implementada. Fonte: [Andrew Helwer — propriedades de alcançabilidade](https://ahelwer.ca/post/2026-09-26-reachability/).

- **Guix na Linode recebe um roteiro com os detalhes que fazem a imagem iniciar.** David Thompson publicou em 26 de setembro sua configuração para gerar uma imagem do Guix, sistema GNU/Linux configurável por código, em vez de converter uma instalação Debian existente. O exemplo trata de discos virtuais, expansão do sistema de arquivos, acesso SSH por chave e ajustes de boot na Linode. É a configuração apresentada pelo autor, não uma nova integração oficial: os ajustes de inicialização fazem parte da solução, não são um detalhe dispensável depois do upload. Fonte: [David Thompson — Deploying Guix images on Linode](https://dthompson.us/posts/deploying-guix-images-on-linode.html).

> Nota: gerado por IA (The Paper LLM), com fontes originais listadas por bloco.

<!--
briefing_id: 27993
source_urls:
  - https://discuss.linuxcontainers.org/t/incus-7-5-has-been-released/27273
  - https://github.com/lxc/incus/security/advisories/GHSA-579w-c4rw-c8q3
  - https://blogs.gnome.org/alatiera/2026/09/26/introducing-toolpak/
  - https://thebuild.com/blog/all-your-gucs-in-a-row-max_standby_archive_delay-and-max_standby_streaming_delay/
  - https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY
  - https://github.com/incoai/splash/releases/tag/1.1.0
  - https://patchstack.com/articles/cross-site-request-forgery-in-elementor-plugin-affecting-2-million-sites/
  - https://eli.thegreenplace.net/2026/rusty-thoughts-on-parse-dont-validate/
  - https://ahelwer.ca/post/2026-09-26-reachability/
  - https://dthompson.us/posts/deploying-guix-images-on-linode.html
-->
