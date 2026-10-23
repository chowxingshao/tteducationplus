# 0007: TT Education⁺ client-brief refresh and interactions

Status: Accepted

Follows [0006](0006-tteducationplus-client-site.md). The client supplied a
confirmed written brief and the real logo. This record covers the content
realignment and the four interaction changes requested alongside it. The
"Highlighter Study" direction, fonts, config and test strategy from 0006 are
unchanged.

## Content realignment (to the client brief)

- **Teaching formats** are now one-to-one, small-group and online tuition
  (`home.ways`), replacing the earlier exam-prep / 1-to-1 / door-to-door set.
  All door-to-door / Klang-Valley references were removed across the hero,
  FAQ, schedule and contact copy.
- **Programmes** are structured into three tiers — Lower Secondary (Form 1–3),
  Upper Secondary (Form 4–5 / SPM) and IGCSE (Chemistry, Physics) — rendered as
  subject-chip cards (`Subjects.astro`), replacing the six single-subject cards.
- **Primary CTA** is "Book a 30-Minute Trial Class", deep-linking to WhatsApp
  with a prefilled message (`home.contact.waMessage`). A dedicated trial CTA
  band (`Trial.astro`) and a testimonials section (`Testimonials.astro`, with
  clearly marked placeholder quotes) were added; fees are presented as
  "message on WhatsApp for pricing".
- **Brand** is rendered as `TT Education⁺` (config `name`/`shortName`). The logo
  is rebuilt from the supplied artwork as an inline SVG badge (`BrandBadge.astro`)
  — a periodic-table "Tt" symbol with the 2014 atomic number on a yellow ring —
  so it scales crisply and stays legible in dark mode. Ring colour is the logo's
  exact `#ffcc00`; the UI accent stays `#f5c518`.

All copy remains in the UI dictionaries, honouring the content-in-dictionaries
contract; BM and ZH entries were updated in lockstep and stay draft translations
pending native-speaker review.

## Interactions

- **Scroll-triggered reveals.** `reveal()` previously ran a single `fromTo` on
  load, so nothing animated on scroll. `page-motion.ts` now pre-sets each
  `[data-reveal]` element's hidden state and animates it in via
  `ScrollTrigger.batch` as it enters the viewport, with a gentle stagger.
  `reveal()` keeps its signature (pinned by `motion-lifecycle` tests); the
  resolver (`resolveReveal`, `revealStartVars`) was extracted for reuse. Still
  fully gated by `prefers-reduced-motion` and the `features.motion` flag; the
  content-visible-without-JS contract is preserved (hiding is JS-only).
- **Hide-on-scroll header.** The header is shorter (removed a stray legacy
  global `.site-header` padding rule) and hides on scroll-down / shows on
  scroll-up, staying put while a header control holds focus. On ≤900px the
  in-page nav collapses; on ≤760px it becomes a compact single row (brand +
  language + theme), dropping the redundant header WhatsApp button.
- **Language switcher dropdown.** Replaced the inline list of locales with an
  accessible button + menu (keyboard, Escape, click-outside). The
  `language-switcher` class is retained (asserted by `pages-build` tests).
- **Theme toggle.** `tokens.css` gained `:root[data-theme="dark"|"light"]`
  overrides (the OS dark block is guarded by `:not([data-theme="light"])`); a
  no-flash inline `<head>` script applies a stored choice before paint. The
  toggle (`ThemeToggle.astro`) lets a viewer override the OS setting and return
  to light — previously impossible.

## Validation

`pnpm lint`, `pnpm check`, `pnpm test` (243 pass) and `pnpm build` (4 pages) all
pass. Verified in-browser: scroll reveals, both dropdowns, theme persistence,
header auto-hide, no mobile horizontal overflow, and the BM locale.
