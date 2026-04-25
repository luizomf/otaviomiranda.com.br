#!/usr/bin/env node
/**
 * Fetch a public URL and print the metadata social crawlers usually read.
 */
import * as cheerio from 'cheerio';

const [, , url, userAgent = 'OtavioMetadataCheck/1.0'] = process.argv;

if (!url) {
  console.error(
    'Usage: node scripts/check_url_metadata.mjs <url> [user-agent]',
  );
  process.exit(1);
}

const IMPORTANT_HEADERS = [
  'age',
  'cache-control',
  'cf-cache-status',
  'content-type',
  'location',
  'server',
  'x-cache',
  'x-content-type-options',
  'x-github-request-id',
  'x-proxy-cache',
];

function getMetaContent($, selector) {
  return $(selector).attr('content')?.trim();
}

function printSection(title, entries) {
  console.log(`\n${title}`);
  for (const [key, value] of entries) {
    if (value) console.log(`${key}: ${value}`);
  }
}

const response = await fetch(url, {
  redirect: 'follow',
  headers: {
    'user-agent': userAgent,
    accept: 'text/html,application/xhtml+xml',
  },
});
const html = await response.text();
const $ = cheerio.load(html);

const headers = IMPORTANT_HEADERS.map(header => [
  header,
  response.headers.get(header),
]);
const generic = [
  ['title', $('title').first().text().trim()],
  ['description', getMetaContent($, 'meta[name="description"]')],
  ['robots', getMetaContent($, 'meta[name="robots"]')],
  ['canonical', $('link[rel="canonical"]').attr('href')?.trim()],
];
const openGraph = $('meta[property^="og:"]')
  .toArray()
  .map(element => [
    $(element).attr('property'),
    $(element).attr('content')?.trim(),
  ]);
const twitter = $('meta[name^="twitter:"]')
  .toArray()
  .map(element => [
    $(element).attr('name'),
    $(element).attr('content')?.trim(),
  ]);

console.log(`status: ${response.status} ${response.statusText}`);
console.log(`final-url: ${response.url}`);
console.log(`user-agent: ${userAgent}`);
printSection('headers', headers);
printSection('metadata', generic);
printSection('open-graph', openGraph);
printSection('twitter', twitter);
