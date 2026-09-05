import rss from '@astrojs/rss';
import type { APIContext, ImageMetadata } from 'astro';
import { posix } from 'node:path';
import { getCollection } from 'astro:content';
import { Marked } from 'marked';
import { getEntryHref } from '../utils/post-path';

const RSS_POST_LIMIT = 30;

const postImages = import.meta.glob<ImageMetadata>(
  '/src/content/posts/**/*.{png,jpg,jpeg,gif,webp,avif,tiff,svg}',
  { eager: true, import: 'default' },
);

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
      recentPosts.map(async post => {
        const marked = new Marked({
          renderer: {
            html(token) {
              return isHtmlComment(token.text) ? '' : false;
            },
            image(token) {
              // Keep external and public-root references on Marked's normal path.
              if (/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(token.href)) return false;
              if (!post.filePath) return '';

              // Literal source-relative paths only; unknown references are optional.
              const key = posix.join(
                '/',
                posix.dirname(post.filePath),
                token.href,
              );
              const image = postImages[key];
              if (!image) return '';

              token.href = new URL(image.src, context.site).href;
              return false;
            },
          },
        });
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.date,
          link: getEntryHref(post),
          content: await marked.parse(post.body ?? ''),
        };
      }),
    ),
  });
}
