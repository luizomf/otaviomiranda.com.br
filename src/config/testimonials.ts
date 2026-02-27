/**
 * ARQUIVO: testimonials.ts
 *
 * O QUE FAZ:
 *   Exporta a lista de depoimentos de alunos exibidos na home page.
 *   Cada entrada possui slug (identificador unico), nome do autor,
 *   funcao/papel e o texto do depoimento.
 *
 * USADO EM:
 *   - Testimonials.astro (itera sobre o array TESTIMONIALS e renderiza
 *     os cards de depoimentos)
 *
 * CONCEITO ASTRO:
 *   Dados estaticos importados em build time. O Astro resolve o import
 *   durante a geracao estatica (SSG), injetando os depoimentos
 *   diretamente no HTML — sem JavaScript no cliente.
 */
export interface TestimonialEntry {
  slug: string;
  author: string;
  role: string;
  text: string;
}

export const TESTIMONIALS: TestimonialEntry[] = [
  {
    slug: 'francisco_juan_s',
    author: 'Francisco Juan S.',
    role: 'Aluno desde 2022',
    text: 'Fala professor! Gostaria de vir aqui apenas para agradecer por essa ruma de conhecimento que voce sempre traz. Sou seu aluno desde 2022 e, desde entao, praticamente gabaritei seus cursos. Acho sensacional o tanto de conteudo gratuito que voce deixa pra gente aprender, tipo essa baita enciclopedia que voce fez de docker. Enfim, deixo registrado minha admiracao e carinho. Muito obrigado por tudo!',
  },
  {
    slug: 'hugo_ledertheil_ruffo',
    author: 'Hugo Ledertheil Ruffo',
    role: 'Aluno Udemy',
    text: '... Hoje eu trabalho há 5 anos com Django e em parte isso é por conta dele (Otávio Miranda). Obrigado pela atenção e pela contribuição com conversas e ( principalmente ) tanto conteúdo de alto nível (MUITOS DE GRAÇA NO CANAL DELE DO YOUTUBE).',
  },
  {
    slug: 'lazier_fernandes',
    author: 'Lazier Fernandes',
    role: 'Aluno de Python',
    text: 'Há 5 anos iniciei minha jornada na área e tive o privilégio de aprender com o seu curso. Em apenas 3 anos alcancei o nível sênior... Sou muito grato por tudo o que aprendi com você. Vamos continuar nessa jornada de aprendizado e, acima de tudo, de compartilhar conhecimento. Muito obrigado!',
  },
  {
    slug: 'leandro_de_jesus_santos',
    author: 'Leandro de Jesus Santos',
    role: 'Estudante de Programacao',
    text: 'Eu sou muito grato ao senhor, o primeiro curso de programação que eu comprei na vida foi o seu e se hoje eu tenho autonomia para aprender outros tópicos, linguagens, etc. É tudo graças ao senhor...',
  },
  {
    slug: 'lucas_medeiros',
    author: 'Lucas Medeiros',
    role: 'Aluno iniciante',
    text: '...Seu curso de django e ele mudou minha vida. Com o tempo fui desenvolvendo soluções, fui sendo promovido na empresa, até virar CTO hoje, numa empresa da minha cidade, mas não para por aí, fiz projetos na faculdade, ganhei bolsas, enfim. Agradecer pelo seu belíssimo curso, acredito que parte do sucesso que tenho hoje devo às suas aulas! Então um sincero obrigado!',
  },
  {
    slug: 'luiz_danella',
    author: 'Luiz Danella',
    role: 'Software Engineer',
    text: '...Só queria passar aqui e deixar meu agradecimento pra ti. Hoje sou programador sênior muito por sua ajuda! Seus cursos são ótimos e sua didática é perfeita. Muito obrigado e que Deus continue abençoando o senhor e sua família!',
  },
];
