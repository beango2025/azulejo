# Changelog

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
