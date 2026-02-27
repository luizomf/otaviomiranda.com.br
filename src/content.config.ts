/**
 * ARQUIVO: src/content.config.ts
 *
 * O QUE FAZ:
 *   Define o schema (estrutura de dados) da Content Collection "posts".
 *   Valida o frontmatter de cada arquivo .md em src/content/posts/ usando Zod,
 *   garantindo que title, description, date e author existam e tenham os tipos
 *   corretos. O campo image e opcional.
 *
 * USADO?
 *   Sim. O Astro detecta este arquivo automaticamente (convencao de nome).
 *   Toda vez que voce usa getCollection('posts') ou getEntry('posts', slug)
 *   em qualquer pagina (.astro), o Astro valida os dados contra este schema.
 *   Usado nas rotas: blog/[page].astro e [...slug].astro.
 *
 * CONCEITO ASTRO:
 *   "Content Collections" — sistema do Astro para gerenciar conteudo tipado.
 *   O `loader: glob(...)` define ONDE buscar os arquivos (padrao glob + pasta base).
 *   O `schema: z.object(...)` define O QUE cada arquivo deve conter no frontmatter.
 *   Exportar `collections` e obrigatorio para o Astro registrar as colecoes.
 */
import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Colecao "posts": cada .md em src/content/posts/ deve ter este frontmatter
const postsCollection = defineCollection({
  // Loader glob: busca todos os .md recursivamente dentro de src/content/posts
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),

  // Schema Zod: validacao tipada do frontmatter de cada post
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date({
      errorMap: () => ({
        message: 'Frontmatter `date` is required and must be a valid date.',
      }),
    }),
    author: z
      .string({
        required_error: 'Frontmatter `author` is required.',
        invalid_type_error: 'Frontmatter `author` must be a string.',
      })
      .trim()
      .min(1, 'Frontmatter `author` cannot be empty.'),
    image: z.string().optional(),
  }),
});

// Exportacao obrigatoria: registra a colecao "posts" no Astro
export const collections = {
  posts: postsCollection,
};
