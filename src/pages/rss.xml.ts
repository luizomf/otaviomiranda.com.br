import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { Marked } from 'marked';
import { getEntryHref } from '../utils/post-path';

const marked = new Marked();

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: 'Otávio Miranda',
    description: 'Blog do Otávio Miranda — Tech, Linux e DevOps',
    site: context.site!.href,
    items: await Promise.all(
      sortedPosts.map(async post => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: getEntryHref(post),
        content: await marked.parse(post.body ?? ''),
      })),
    ),
  });
}
