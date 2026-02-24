export interface CourseEntry {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

export const COURSES: CourseEntry[] = [
  {
    href: 'https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado/?referralCode=C6F07057B0999D3E36BA',
    imageSrc: 'imgs/curso-javascript-typescript.webp',
    imageAlt: 'Curso de JavaScript e TypeScript do básico ao avançado',
    title: 'Curso de JavaScript e TypeScript do básico ao avançado',
    description:
      'JavaScript e TypeScript - front-end e back-end (Full Stack) - Node, Express, noSQL, React, hooks, Redux, Design Patterns',
  },
  {
    href: 'https://www.udemy.com/course/python-3-do-zero-ao-avancado/?referralCode=5DDCAD01311E2A9599B2',
    imageSrc: 'imgs/curso-de-python.webp',
    imageAlt: 'Curso de Python 3 do Básico Ao Avançado',
    title: 'Curso de Python 3 do Básico Ao Avançado (com projetos reais)',
    description:
      'Python 3 completo - programação com Django, PyQT5, Selenium, Regexp, Testes e TDD, POO, Design Patterns GoF, algoritmos.',
  },
  {
    href: 'https://www.udemy.com/course/nestjs-curso-completo-rest-api-typeorm-jwt-e-mais/?referralCode=7EAD0D9F0C7D4B6F9B4E',
    imageSrc: 'imgs/curso-de-nestjs.webp',
    imageAlt: 'NestJS - Curso completo',
    title: 'NestJS - Curso completo para REST API com TypeORM e JWT',
    description:
      'Domine NestJS criando APIs RESTful com TypeORM, autenticação JWT, e testes automatizados para aplicações robustas.',
  },
  {
    href: 'https://hostinger.com/otaviomiranda',
    imageSrc: 'imgs/hostinger.webp',
    imageAlt: 'Hostinger',
    title: 'Para servidores e hospedagem de sites, recomendo Hostinger!',
    description:
      'Além da qualidade da infraestrutura, a Hostinger ainda disponibiliza +10% de desconto com o cupom OTAVIOMIRANDA.',
  },
  {
    href: 'https://www.udemy.com/course/curso-de-django-web-framework-com-python-html-e-css/?referralCode=D43F8EDA2A980B64C0FC',
    imageSrc: 'imgs/curso-django.webp',
    imageAlt: 'Curso de Django',
    title: 'Curso de Django Web Framework com Python, HTML e CSS',
    description:
      'Aprenda Django Web Framework com Python, HTML e CSS. Conheça o ORM, os templates e Views, entenda HTTP e muito mais.',
  },
  {
    href: 'https://www.udemy.com/course/curso-de-reactjs-nextjs-completo-do-basico-ao-avancado/?referralCode=C228CEEAEB14B76159E1',
    imageSrc: 'imgs/curso-react-nextjs.webp',
    imageAlt: 'Curso de React.Js + Next.Js',
    title: 'Curso de React.Js + Next.Js completo do básico ao avançado',
    description:
      'Aprenda ReactJS, NextJS, Styled-Components, Testes com Jest, Storybook, Strapi, HTML e CSS com TypeScript e JavaScript.',
  },
  {
    href: 'https://www.udemy.com/course/curso-de-graphql-e-apollo-server-client/?referralCode=7C1982716397A5668A2C',
    imageSrc: 'imgs/graphql.webp',
    imageAlt: 'Curso de GraphQL e Apollo-Server',
    title: 'Curso de GraphQL e Apollo-Server',
    description:
      'GraphQL e Apollo-Server - Crie back-ends para aplicações e junte tudo em um grafo e end-point usando dados de APIs e BDs',
  },
  {
    href: 'https://www.udemy.com/course/expressoes-regulares-com-python-3-curso-gratuito/?referralCode=974C646591CF3D055109',
    imageSrc: 'imgs/expressoes-regulares.webp',
    imageAlt: 'Expressões regulares com Python 3',
    title: 'Expressões regulares com Python 3 (Curso gratuito)',
    description: 'Aprenda expressões regulares utilizando Python 3 - Grátis',
  },
];
