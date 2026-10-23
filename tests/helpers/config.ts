import {
  parseSiteConfig,
  type SiteConfig,
} from '../../src/lib/config/schema.ts';

// A stable demonstration baseline for library unit tests, independent of the
// client's site.config.ts. Library logic (SEO, routing, config validation,
// forms, project setup) must behave the same regardless of client identity,
// so these tests assert against fixed values rather than the live config.
const baseline = {
  name: 'Canvas Base',
  shortName: 'Canvas',
  description: 'A reusable static website starter.',
  url: 'https://example.com',
  base: '/',
  language: 'en',
  author: '',
  email: '',
  formEndpoint: '',
  social: {},
  analyticsId: '',
  defaultOgImage: '/og-default.png',
  i18n: { defaultLocale: 'en', locales: ['en'] },
  features: {
    blog: true,
    projects: true,
    rss: true,
    motion: true,
    i18n: false,
    deploy: 'none',
  },
} as const;

export function withFeatures(
  flags: Partial<SiteConfig['features']>,
): SiteConfig {
  const fixture = structuredClone(baseline) as Record<string, unknown>;
  return parseSiteConfig({
    ...fixture,
    features: { ...baseline.features, ...flags },
  });
}
