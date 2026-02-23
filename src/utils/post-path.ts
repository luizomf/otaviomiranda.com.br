import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'posts'>;

const TRAILING_CONTENT_SEGMENT_REGEX = /\/(text|texto)$/i;

export function getEntrySlugPath(entry: PostEntry): string {
  return entry.id.replace(TRAILING_CONTENT_SEGMENT_REGEX, '');
}

export function getEntryHref(entry: PostEntry): string {
  return `/${getEntrySlugPath(entry)}/`;
}
