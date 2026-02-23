import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Data opcional depois nós vemos como extrair do HTML antigo
        date: z.date().optional(),
        author: z.string().optional(),
        image: z.string().optional(),
    }),
});

export const collections = {
    'posts': postsCollection,
};
