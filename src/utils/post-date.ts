/**
 * ARQUIVO: post-date.ts
 *
 * O QUE FAZ:
 *   Funcoes utilitarias para extrair, formatar e comparar datas de posts
 *   da content collection "posts". Lida com tres cenarios:
 *     1. Data definida no frontmatter (campo "date")
 *     2. Ano extraido do ID do arquivo (ex.: "2024/meu-post")
 *     3. Fallback para Date(0) quando nenhuma data e encontrada
 *   Exporta tambem helpers de ordenacao (desc), label legivel em pt-BR
 *   e atributo datetime para a tag <time>.
 *
 * USADO EM:
 *   - [...slug].astro (exibe a data de publicacao do post)
 *   - blog/[page].astro (ordena posts por data na listagem paginada)
 *   - RecentPosts.astro (ordena e exibe os posts mais recentes)
 *
 * CONCEITO ASTRO:
 *   Trabalha com Content Collections (astro:content). O tipo
 *   CollectionEntry<'posts'> garante tipagem forte sobre o frontmatter
 *   definido no schema Zod. Tudo e resolvido em build time (SSG).
 */
import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'posts'>;

const YEAR_IN_ID_REGEX = /^(\d{4})(?:\/|$)/;

const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

export function getEntryFrontmatterDate(entry: PostEntry): Date | undefined {
  const { date } = entry.data;

  if (isValidDate(date)) {
    return date;
  }

  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date);
    if (isValidDate(parsedDate)) {
      return parsedDate;
    }
  }

  return undefined;
}

export function getEntryYearFallback(entry: PostEntry): number | undefined {
  const match = entry.id.match(YEAR_IN_ID_REGEX);
  if (!match) {
    return undefined;
  }

  const year = Number.parseInt(match[1], 10);
  return Number.isInteger(year) ? year : undefined;
}

function getEntryFallbackDate(entry: PostEntry): Date | undefined {
  const year = getEntryYearFallback(entry);
  if (!year) {
    return undefined;
  }

  return new Date(Date.UTC(year, 0, 1));
}

export function getEntrySortDate(entry: PostEntry): Date {
  return (
    getEntryFrontmatterDate(entry) ?? getEntryFallbackDate(entry) ?? new Date(0)
  );
}

export function comparePostsByDateDesc(a: PostEntry, b: PostEntry): number {
  const diff = getEntrySortDate(b).getTime() - getEntrySortDate(a).getTime();
  if (diff !== 0) {
    return diff;
  }

  return b.id.localeCompare(a.id);
}

export function getEntryDateLabel(
  entry: PostEntry,
  locale = 'pt-BR',
): string | undefined {
  const frontmatterDate = getEntryFrontmatterDate(entry);
  if (frontmatterDate) {
    return frontmatterDate.toLocaleDateString(locale);
  }

  const year = getEntryYearFallback(entry);
  return year ? String(year) : undefined;
}

export function getEntryDateTimeAttr(entry: PostEntry): string | undefined {
  const date = getEntryFrontmatterDate(entry) ?? getEntryFallbackDate(entry);
  return date?.toISOString();
}
