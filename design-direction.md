# Design direction — TT Education Plus

Selected direction: **Highlighter Study**. Approved by the client from a live
hero mockup on 2026-10-23.

## Concept

A clean, studious landing page built around the brand's black / white / yellow
badge. The signature device is a **yellow "highlighter" sweep** over the key
word in each major heading — a nod to marking up a textbook. Light theme by
default (white with a faint graph-paper panel behind the hero), with a fully
designed dark theme that echoes the black logo. Motion is light: a gentle
reveal on load and small hover lifts.

## Palette (tokens in `src/styles/tokens.css`)

- Ink (near-black, slightly warm): `#16171b` light / paper `#f4f3ee` dark
- Page background: `#ffffff` light / `#0e0f12` dark
- Panel (graph paper): warm off-white `#faf9f4` / `#141519`
- Highlighter yellow (accent, both themes): `#f5c518`
- Muted text, hairline borders, soft card shadows.

## Type

- **Display:** Bricolage Grotesque (characterful grotesque, used for headings).
- **Body:** Source Sans 3 (already self-hosted by the template; clean, formal).
- **Labels / data:** Space Mono (eyebrows, level tags, report card).
- **CJK:** Noto Sans TC covers the Traditional-Chinese locale.

Bricolage Grotesque, Space Mono and Noto Sans TC load from Google Fonts; Source
Sans 3 stays self-hosted. See the dependency justification in `README`.

## Layout

Single scrolling home page with anchored sections, reachable from the header:
Hero → How it works (Exam Prep / 1-to-1 / Door-to-Door) → Subjects (6 cards) →
Gallery → Schedule → FAQ → About → Contact (WhatsApp + Instagram, no form).

## Localisation

Trilingual: English (default), Bahasa Melayu (`ms`), Traditional Chinese
(`zh-Hant`). All landing copy lives in the UI dictionaries (`src/content/ui.json`
plus `src/i18n/ms.json`, `src/i18n/zh-Hant.json`). The BM and ZH dictionaries
are **draft translations and must be reviewed by a native speaker before
launch** (per the template's i18n policy).

## Placeholders to replace before launch

- Real logo artwork (currently a CSS/SVG badge placeholder).
- Real WhatsApp number (currently `wa.me/60000000000`).
- Gallery photos (currently styled placeholders).
- Real course details, schedule times, and FAQ answers.
- Production domain in `site.config.ts` (`url`).
