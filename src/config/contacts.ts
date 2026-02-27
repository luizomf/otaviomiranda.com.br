/**
 * ARQUIVO: contacts.ts
 *
 * O QUE FAZ:
 *   Exporta os dados de contato do autor (e-mail e links de redes sociais,
 *   newsletter, blog, cursos). Cada link possui label, href e uma flag que
 *   indica se e externo (abre em nova aba) ou interno ao site.
 *
 * USADO EM:
 *   - contacts.astro (renderiza a lista de links de contato na pagina)
 *
 * CONCEITO ASTRO:
 *   Dados estaticos importados em build time. O Astro resolve o import
 *   durante a geracao estatica (SSG), entao este arquivo nunca e enviado
 *   ao navegador — apenas o HTML resultante.
 */
export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

export const EMAIL = 'luizomf@gmail.com';

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@otaviomiranda/videos',
    external: true,
  },
  {
    label: 'Newsletter',
    href: 'https://luizomf.substack.com/',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/luizomf',
    external: true,
  },
  {
    label: 'Blog',
    href: '/blog/1/',
    external: false,
  },
  {
    label: 'Cursos',
    href: '/#courses',
    external: false,
  },
];
