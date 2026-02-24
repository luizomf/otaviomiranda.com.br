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
