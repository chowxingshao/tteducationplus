import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { SiteConfig } from '../../src/lib/config/schema.ts';
import { buildFixture, exists } from '../helpers/build.ts';

const fixtures: Awaited<ReturnType<typeof buildFixture>>[] = [];
afterEach(async () => {
  await Promise.all(fixtures.splice(0).map((fixture) => fixture.dispose()));
});
async function build(options: Parameters<typeof buildFixture>[0] = {}) {
  const fixture = await buildFixture(options);
  fixtures.push(fixture);
  expect(fixture.exitCode, fixture.stdout + fixture.stderr).toBe(0);
  return fixture.outputDir;
}
const html = (root: string, path: string) => readFile(join(root, path), 'utf8');

describe('client page output', () => {
  it('renders every home locale with one heading, semantic landmarks, and the language switcher', async () => {
    const root = await build();
    for (const path of [
      'index.html',
      'ms/index.html',
      'zh-Hant/index.html',
      '404.html',
    ]) {
      expect(await exists(root, path), path).toBe(true);
      const output = await html(root, path);
      expect(output.match(/<h1(?:\s|>)/g), path).toHaveLength(1);
      expect(output).toContain('<main id="main-content"');
      expect(output).toContain('href="#main-content"');
      expect(output).toContain('<header');
      expect(output).toContain('<footer');
    }
    // The language switcher appears on localized home pages but not on the 404.
    for (const path of ['index.html', 'ms/index.html', 'zh-Hant/index.html']) {
      expect(await html(root, path), path).toContain('language-switcher');
    }
    expect(await html(root, '404.html')).not.toContain('language-switcher');
    // The home page surfaces the hero, the subjects anchor and both contacts.
    const home = await html(root, 'index.html');
    expect(home).toContain('id="subjects"');
    expect(home).toContain('id="schedule"');
    expect(home).toContain('wa.me');
    expect(home).toContain('instagram.com/ttedu.plus');
    // Blog, projects and the not-found slug stay out of the published output.
    expect(await exists(root, 'blog/index.html')).toBe(false);
    expect(await exists(root, 'projects/index.html')).toBe(false);
    expect(await exists(root, 'not-found/index.html')).toBe(false);
  }, 120_000);

  it('keeps disabled indexes and their links out of the page', async () => {
    const root = await build({
      config: {
        features: { blog: false, projects: false } as SiteConfig['features'],
      },
    });
    for (const path of ['blog/index.html', 'projects/index.html']) {
      expect(await exists(root, path), path).toBe(false);
    }
    const output = await html(root, 'index.html');
    expect(output).not.toContain('href="/blog/"');
    expect(output).not.toContain('href="/projects/"');
  }, 120_000);

  it('uses localized UI, source-language fallback content, RTL, and a mounted self-hosted font', async () => {
    const root = await build({
      config: {
        base: '/demo/',
        i18n: { defaultLocale: 'en', locales: ['en', 'ms', 'ar'] },
        features: { i18n: true } as SiteConfig['features'],
      },
      content: {
        'src/content/pages/en/about.md':
          '---\ntitle: About\ndescription: About.\nslug: about\ndraft: false\n---\nThis page contains sample-only content.\n',
      },
    });
    // A fallback page uses the requested UI language but the source article language.
    const malay = await html(root, 'ms/about/index.html');
    expect(malay).toMatch(/<html[^>]*lang="ms"[^>]*dir="ltr"/);
    expect(malay).toMatch(/<article[^>]*lang="en"[^>]*dir="ltr"/);
    expect(malay).toContain('sample-only content');
    expect(malay).toContain('href="/demo/fonts/source-sans-3-latin.woff2"');
    // The localized home renders Bahasa Melayu UI copy from its dictionary.
    const malayHome = await html(root, 'ms/index.html');
    expect(malayHome).toMatch(/<html[^>]*lang="ms"/);
    expect(malayHome).toContain('Subjek');
    // An Arabic locale renders right-to-left.
    const arabic = await html(root, 'ar/index.html');
    expect(arabic).toMatch(/<html[^>]*lang="ar"[^>]*dir="rtl"/);
  }, 120_000);
});
