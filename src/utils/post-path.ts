/**
 * ARQUIVO: post-path.ts
 *
 * O QUE FAZ:
 *   Funcoes utilitarias para gerar o caminho (slug) e o href final
 *   de cada post da content collection "posts". Remove segmentos
 *   finais como "/text" ou "/texto" do ID do arquivo, produzindo
 *   URLs limpas (ex.: "/2024/meu-post/").
 *
 * USADO EM:
 *   - [...slug].astro (gera o parametro de rota dinamica do post)
 *   - blog/[page].astro (monta os links para cada post na listagem)
 *   - RecentPosts.astro (monta os links dos posts recentes)
 *
 * CONCEITO ASTRO:
 *   Trabalha com Content Collections (astro:content). O ID do entry
 *   reflete a estrutura de pastas em src/content/posts/. Este utilitario
 *   transforma esse ID no slug usado nas rotas dinamicas do Astro SSG.
 */
import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'posts'>;

const TRAILING_CONTENT_SEGMENT_REGEX = /\/(text|texto)$/i;

export function getEntrySlugPath(entry: PostEntry): string {
  return entry.id.replace(TRAILING_CONTENT_SEGMENT_REGEX, '');
}

export function getEntryHref(entry: PostEntry): string {
  return `/${getEntrySlugPath(entry)}/`;
}
