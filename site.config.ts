import type { SiteConfig } from './src/lib/config/schema.ts';

// Client identity for TT Education Plus. The production domain and the real
// WhatsApp number are placeholders — replace `url` and `social.whatsapp`
// before launch. All values here are public: no secrets.
export const siteConfig = {
  name: 'TT Education⁺',
  shortName: 'TT Education⁺',
  description:
    'Personalised one-to-one, small-group and online tutoring with Teacher Thomas — SPM and IGCSE exam preparation for secondary students.',
  url: 'https://chowxingshao.github.io',
  base: '/tteducationplus/',
  language: 'en',
  author: 'Teacher Thomas',
  email: '',
  formEndpoint: '',
  social: {
    instagram: 'https://instagram.com/ttedu.plus',
    whatsapp: 'https://wa.me/60000000000',
  },
  analyticsId: '',
  defaultOgImage: '/og-default.png',
  i18n: { defaultLocale: 'en', locales: ['en', 'ms', 'zh-Hant'] },
  features: {
    blog: false,
    projects: false,
    rss: false,
    motion: true,
    i18n: true,
    deploy: 'github-pages',
  },
} satisfies SiteConfig;
