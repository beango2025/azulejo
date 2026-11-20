# Changelog

## 3.7.0 — 2026-11-20

- Expanded the unique five-language lexicon to **6,088 words** (5,878 bank entries + 210 core words), reaching the 6,000–8,000 CEFR band target.
- Added 3,000 new A1–C2 entries with cross-level deduplication: A1 1,100 / A2 886 / B1 930 / B2 1,015 / C1 1,034 / C2 1,123 entries.
- Kept 120 verb tables and 200-row vocabulary pagination.
- Bumped the service worker cache to `azulejo-v3.7.0`.

## 3.6.0 — 2026-11-20

- Expanded the five-language vocabulary bank from 810 to **3,600 words**: 600 per level (A1–C2).
- Expanded the verb bank from 24 to **120 verbs**, with seven-tense tables and fixed orthographic forms (`pagar`, `chegar`, `ficar`, `começar`, `dançar`, `subir`).
- Added vocabulary pagination (200 at a time) to keep the 3,600-row lexicon responsive.
- Bumped the service worker cache to `azulejo-v3.6.0`.

## 3.5.0 — 2026-11-20

- Expanded the mock-exam bank from 2 to **60 exams: 10 per CEFR level (A1, A2, B1, B2, C1, C2)**.
- Added level tabs to Azulejo Pro; each level shows its 10 exams.
- Added 300 level-specific writing/speaking prompts with Chinese translations.
- Updated the A2 SEO landing page to 10 A2 mocks / 60 total.
- Bumped the service worker cache to `azulejo-v3.5.0`.

## 3.4.0 — 2026-11-20

- Added a static, crawlable SEO layer: 1 A2 CIPLE landing page, a culture hub with 10 categories and 100 article pages, and a phrase hub with 20 scene pages.
- Added `sitemap.xml` (134 URLs), `robots.txt`, canonical URLs, Open Graph metadata and JSON-LD.
- Split the public marketing surface from the hash-routed PWA so Google can index the content.
- Added a standalone `seo/seo.css` design and `tools/build-seo.mjs` generator.
- Bumped the service worker cache to `azulejo-v3.4.0`.

## 3.3.0 — 2026-11-20

- Added 10 recorded **PT-PT neural audio** files for the A2 listening tracks.
- A2 listening player now uses native audio with playback-rate control; other levels keep browser TTS fallback.
- A2 mock-exam listening questions now use native `<audio>` playback instead of browser speech.
- Added `js/audio-map.js`, `assets/audio/` and `tools/generate-a2-audio.py`.
- Bumped the service worker cache to `azulejo-v3.3.0`.

## 3.2.0 — 2026-11-20

- Added optional **Supabase account + progress sync** with email/password auth, automatic push after study changes, manual cloud pull/push, and a local-mode fallback.
- Added RLS table schema in `server/supabase.sql`.
- Added account UI to settings with sign-in, sign-up, pull/push and sign-out.
- Added `supabaseUrl` / `supabaseAnonKey` to `js/config.js`.
- Bumped the service worker cache to `azulejo-v3.2.0`.

## 3.1.1 — 2026-11-20

- Added a deployable Cloudflare Worker (`server/worker.js`) that verifies Stripe webhooks, signs a Pro licence and emails it with Resend.
- Added the `#/pro/success` payment-success screen.
- Added Worker deployment docs and secret configuration.
- Bumped the service worker cache to `azulejo-v3.1.1`.

## 3.1.0 — 2026-11-20

- Added the paid **Azulejo Pro** layer: sales page, configurable checkout link, offline signed licences and activation form.
- Added two 75-minute A2 CIPLE mock exams with reading, listening, writing and speaking sections, timer, scoring and answer review.
- Added `js/config.js` for checkout/contact/analytics configuration and `tools/make-license.mjs` for issuing signed licences.
- Added lightweight analytics events for Pro views, checkout clicks, licence activation and exam attempts.
- Added Pro navigation entry and paywall redirect for unlicensed exam access.
- Bumped the service worker cache to `azulejo-v3.1.0`.

## 3.0.1 — 2026-11-20

- Grouped the 810-word lexicon by part of speech: nouns, verbs, adjectives, adverbs and phrases.
- Added continuous three-digit sequence numbers before every word, plus per-group counts.
- Added `Nº` to the table header and kept the numbering visible on mobile.
- Bumped the service worker cache to `azulejo-v3.0.1`.

## 3.0.0 — 2026-11-20

- Replaced the old 48-phrase list with **1,000 European Portuguese spoken sentence patterns**, organised into 20 real-life scenes (50 each), with Chinese, English and French translations.
- Added scene filters, full-text search across four languages, favourites and progressive loading (100 at a time).
- Added **100 Portuguese culture explainers** in 10 categories, each written in Chinese, English and French, with category filters, article reading progress and a 100-article library.
- Bumped the service worker cache to `azulejo-v3.0.0`.

## 2.3.0 — 2026-11-20

- Added a per-reading vocabulary section directly after each text.
- Each glossary has up to 12 words from that specific text, with PT / Chinese / English and a pronunciation guide.
- Words are grouped and labelled by part of speech: nouns, verbs, adjectives, adverbs and phrases.
- Added part-of-speech classification for the original 210 words and a pronunciation respelling fallback for the 600 bank words.
- Bumped the service worker cache to `azulejo-v2.3.0`.

## 2.2.0 — 2026-11-20

- Added the original Portuguese text plus a full Chinese translation to all 60 listening tracks.
- Expanded the five-language vocabulary bank from 210 to 810 words (600 level-specific additions: 100 per level).
- Added a `Verbos` tab with conjugation tables for 24 core verbs across 7 tenses.
- Added English grammar explanations and Chinese/English tips to all 42 core grammar points; labs now reuse the core grammar.
- Added 2 grammar practice questions to every lesson (core and practice), with answers and Chinese explanations.
- Bumped the service worker cache to `azulejo-v2.2.0`.

## 2.1.2 — 2026-11-20

- Replaced the Porto/Coimbra photos with Lisbon-only subjects: Bertrand Chiado, Parque das Nações, Assembleia da República, Torre de Belém and Praça do Comércio.
- Replaced the generic custard-tart photo with Pastéis de Belém.
- All 11 reading photos are now Lisbon or Lisbon-area and thematically distinct.
- Bumped the service worker cache to `azulejo-v2.1.2`.

## 2.1.1 — 2026-11-19

- Listening speed is now a slider; changing it while playing restarts at the new speed instead of pausing silently.
- Reading and listening illustrations now use real licensed photographs of Portugal (Wikimedia Commons), with credits.
- Added visible desktop scrollbars and increased body/reading/question/card font sizes.
- Bumped the service worker cache to `azulejo-v2.1.1`.

## 2.1.0 — 2026-11-19

- Added 10 numbered listening tracks per level (`A1.1`–`A1.10` … `C2.1`–`C2.10`), using distinct scenes and the exam-length texts.
- Added per-track speed control and separate listening progress.
- Added scene illustrations to reading screens.
- Added short-drama dubbing: subtitles, line-by-line recording, playback, pronunciation score and speech-rate score.
- Bumped the service worker cache to `azulejo-v2.1.0`.

## 2.0.0 — 2026-11-19

- Replaced the short five-line readings with 180 CAPLE-oriented exam texts.
- Added CEFR/CAPLE length targets: A1 140–180, A2 180–230, B1 280–340, B2 420–500, C1 550–650, C2 700–850 words.
- Added 4 comprehension questions per text; listening now uses the full text (1.5–6 minutes) instead of the short media excerpt.
- Kept the media dialogue link for extra listening/speaking, but reading and listening are now exam-length.
- Added `content/lesson-briefs.json`, `content/readings-*.json`, `tools/build-readings.mjs` and generated `js/readings.js`.
- Bumped the service worker cache to `azulejo-v2.0.0`.

## 1.8.0 — 2026-11-19

- Gave every practice lab its own distinct scene; all 180 lessons now have unique titles.
- Rebalanced lab scenes so each level has 30 different places/situations, with no repeated scene names.
- Kept lab vocabulary tied to the core lesson so the reading text still matches the stage.
- Bumped the service worker cache to `azulejo-v1.8.0`.

## 1.7.0 — 2026-11-19

- Added a top-level `Leitura & escuta` library with all 180 lessons grouped by CEFR level.
- Reading cards jump directly to the immersion step of a lesson via `#/read/{lessonId}`.
- Direct reading sessions return to the reading library when closed.
- Bumped the service worker cache to `azulejo-v1.7.0`.

## 1.6.0 — 2026-11-19

- Added a per-lesson `Leitura & escuta` step to all 180 lessons.
- Each lesson gets a short scene text built from its own target sentences, a listening check, comprehension questions, and a shadowing/speaking line.
- Listening and speaking now use a dialogue from the level-appropriate video/audio library, with the full media linked inside the lesson.
- Added `js/immersion.js`; the listening questions come from the same dialogue used for the media lesson.
- Bumped the service worker cache to `azulejo-v1.6.0`.

## 1.5.0 — 2026-11-19

- Renamed every A1–C2 core lesson after a real-life scene.
- Practice labs now inherit their scene title and vocabulary from the corresponding core lesson.
- Added `js/scenes.js` as the single source for scene names.
- Bumped the service worker cache to `azulejo-v1.5.0`.

## 1.4.0 — 2026-11-19

- Added a PT-PT-only external resources section: Falar, Fala Bem, PTptIndex, EP Spoken Frequency and Conversas com Amália.
- Excluded Brazilian Portuguese resources; added a visible PT-PT-only notice.
- Added a persistent version badge in the top bar, sidebar and settings.
- Added a “new version” toast when the stored version changes.
- Bumped the service worker cache to `azulejo-v1.4.0`.

## 1.3.0 — 2026-11-19

- Added a dedicated resource page entry point and culture integration.
- Service worker cache: `azulejo-v1.3.0`.

## 1.2.0 — 2026-11-19

- Expanded each CEFR level to 30 lessons: 180 lessons total (42 core + 138 practice labs).
- Added 14 units, 210 five-language words and deterministic practice labs.
- Service worker cache: `azulejo-v1.2.0`.

## 1.1.0 — 2026-11-19

- Added A1–C2 structure, 12 video/audio media lessons and 150 five-language words.
- Service worker cache: `azulejo-v1.1.0`.

## 1.0.0 — 2026-11-19

- Initial release: A1–A2 course, SRS review, phrasebook, culture library and progress system.
