import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
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

export const collections = {
  posts: postsCollection,
};
