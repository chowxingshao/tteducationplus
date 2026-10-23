# 0006: TT Education Plus client site

Status: Accepted

This repository is a client project built on Canvas Base for **TT Education
Plus** (Teacher Thomas), a solo tutoring centre. The approved visual direction
is "Highlighter Study" (see root `design-direction.md` and `brief.md`).

## Variable-layer changes

- The home page is composed from section components (`src/components/home/*`)
  rather than the generic `PageView` markdown renderer. `index.astro` and
  `[locale]/[...index].astro` render `HomePage.astro`; `PageView` remains for any
  standalone pages.
- All landing copy lives in the UI dictionaries (`src/content/ui.json` plus
  `src/i18n/ms.json` and `src/i18n/zh-Hant.json`), honouring the content-in-
  dictionaries contract. The `home.md` entry supplies only the route and
  structured data; page titles/descriptions come from the dictionary.
- Palette and typography were replaced in `src/styles/tokens.css`; shared
  primitives (buttons, eyebrow, highlighter) live in `src/styles/global.css`.

## Fonts (external resource)

Source Sans 3 stays self-hosted (body text), preserving the offline/privacy
baseline and the mounted `/fonts/...` preload. Three display faces load from
Google Fonts (`fonts.googleapis.com` stylesheet + `fonts.gstatic.com` files):

| Face                | Role                         | Weights     |
| ------------------- | ---------------------------- | ----------- |
| Bricolage Grotesque | Headings / display           | 600/700/800 |
| Space Mono          | Eyebrows, labels, data chips | 400/700     |
| Noto Sans TC        | Traditional-Chinese coverage | 500/700     |

Rationale: these faces are not available as the self-hosted woff2 bundle, and
Google Fonts subsets Noto Sans TC by `unicode-range`, so English pages do not
download the CJK files. This adds two external hosts to the page; no npm
dependency is added, and the static-output and no-JS-content contracts are
unchanged. Replace with self-hosted woff2 files before launch if the client
requires zero third-party requests.

## Configuration

`blog`, `projects` and `rss` are disabled; `i18n` is enabled for `en` (default),
`ms` and `zh-Hant`. The Bahasa Melayu and Traditional-Chinese dictionaries are
**draft translations and require native-speaker review before launch**, per the
template i18n policy. The production `url` and `social.whatsapp` number are
placeholders.

## Tests

The demonstration-coupled integration tests were adapted to the client config:
they inject sample blog/project/page content via build fixtures and assert the
client's home-locale output. Library unit tests use a fixed demo baseline
(`tests/helpers/config.ts`) independent of the client identity. The sample blog
post and project under `src/content/` remain as dormant fixtures for these
tests; with `blog`/`projects` disabled they never route or enter the sitemap.
