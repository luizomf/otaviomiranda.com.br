import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { Marked } from 'marked';
import { getEntryHref } from '../utils/post-path';

const RSS_POST_LIMIT = 30;

const marked = new Marked({
  renderer: {
    html(token) {
      return isHtmlComment(token.text) ? '' : false;
    },
  },
});

function isHtmlComment(value: string): boolean {
  const trimmedValue = value.trim();
  return trimmedValue.startsWith('<!--') && trimmedValue.endsWith('-->');
}

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const recentPosts = posts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, RSS_POST_LIMIT);

  return rss({
    title: 'Otávio Miranda',
    description: 'Blog do Otávio Miranda — Tech, Linux e DevOps',
    site: context.site!.href,
    items: await Promise.all(
      recentPosts.map(async post => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: getEntryHref(post),
        content: await marked.parse(post.body ?? ''),
      })),
    ),
  });
}
