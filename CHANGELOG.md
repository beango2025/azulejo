# Changelog

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
