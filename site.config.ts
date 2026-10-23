import type { SiteConfig } from './src/lib/config/schema.ts';

// Client identity for TT Education Plus. The production domain and the real
// WhatsApp number are placeholders — replace `url` and `social.whatsapp`
// before launch. All values here are public: no secrets.
export const siteConfig = {
  name: 'TT Education Plus',
  shortName: 'TT Education Plus',
  description:
    'Exam prep, one-to-one and door-to-door tutoring with Teacher Thomas — Science, Chemistry, Physics, Maths, Sejarah and BM.',
  url: 'https://tteducationplus.com',
  base: '/',
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
    deploy: 'none',
  },
} satisfies SiteConfig;
