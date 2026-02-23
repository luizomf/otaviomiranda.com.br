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
