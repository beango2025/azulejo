/* Browser QA for Azulejo A1–C2 · video/audio · five-language lexicon. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://127.0.0.1:8788';
const OUT = path.resolve('_shots');
const PORT = 9334;
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
const profile = path.join(OUT, `_profile-${Date.now()}`);

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions',
  '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-sync',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1440,1000', 'about:blank'
], { stdio: 'ignore' });

async function waitForDevtools() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return;
    } catch (err) { /* not ready */ }
    await sleep(150);
  }
  throw new Error('Chrome DevTools did not start');
}

await waitForDevtools();
const targetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(BASE + '/#/learn')}`, { method: 'PUT' });
const target = await targetRes.json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const errors = [];
const consoleMessages = [];

ws.addEventListener('message', event => {
  const msg = JSON.parse(event.data);
  if (msg.id) {
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
    else p.resolve(msg.result);
    return;
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    errors.push(msg.params.exceptionDetails?.text + ' ' + (msg.params.exceptionDetails?.exception?.description || ''));
  }
  if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
    errors.push(`${msg.params.entry.source}: ${msg.params.entry.text}`);
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const text = msg.params.args.map(a => a.value ?? a.description ?? '').join(' ');
    consoleMessages.push(`${msg.params.type}: ${text}`);
    if (msg.params.type === 'error') errors.push(text);
  }
});

function cmd(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await cmd('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ' ' + (result.exceptionDetails.exception?.description || ''));
  return result.result.value;
}

async function shot(name, selector) {
  if (selector) {
    await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const y = el.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo(0, Math.max(0, y));
      return true;
    })()`);
  } else {
    await evaluate('window.scrollTo(0,0)');
  }
  await sleep(380);
  const result = await cmd('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(result.data, 'base64'));
  const info = await evaluate(`({ w: innerWidth, h: innerHeight, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, cls: document.body.className, title: document.title })`);
  console.log(`SHOT ${name}  ${info.w}x${info.h}  sw=${info.sw}  sh=${info.sh}  ${info.cls}  ${info.title}`);
  return info;
}

async function click(selector) {
  const ok = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true; })()`);
  if (!ok) throw new Error('Missing click target: ' + selector);
  await sleep(320);
}

async function clickByText(selector, text) {
  const ok = await evaluate(`(() => {
    const nodes = [...document.querySelectorAll(${JSON.stringify(selector)})];
    const el = nodes.find(n => (n.textContent || '').replace(/\\s+/g, ' ').trim().includes(${JSON.stringify(text)}));
    if (!el) return false;
    el.click();
    return true;
  })()`);
  if (!ok) throw new Error(`No ${selector} containing ${text}`);
  await sleep(300);
}

async function goto(hash) {
  await evaluate(`location.hash = ${JSON.stringify(hash)}`);
  await sleep(750);
}

async function seedDemo() {
  const script = `(() => {
    const key = (d) => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth()+1).padStart(2,'0') + '-' + String(x.getDate()).padStart(2,'0'); };
    const now = new Date();
    const days = []; for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
    const words = {};
    const ids = ['ola','bomdia','chamome','prazer','atelogo','sou','portugues','vivo','tudobem','desculpe','cafe','queria'];
    ids.forEach((id, i) => { const d = new Date(now.getTime() - 1000*60*60*(i+1)); words[id] = { due: d.toISOString(), interval: 1, ease: 2.5, reps: 1, learnedAt: d.toISOString() }; });
    const lessons = {
      u1l1: { completedAt: new Date(now.getTime()-86400000*5).toISOString(), best: 100, attempts: 1 },
      u1l2: { completedAt: new Date(now.getTime()-86400000*4).toISOString(), best: 90, attempts: 1 }
    };
    const activity = {}; [80,0,45,25,40,55,30].forEach((v,i)=>{ if(v) activity[key(days[i])]=v; });
    const demo = {
      version:1, onboarded:true, name:'小林', goal:40, xp:190,
      lessons, words, media:{ 'm-a1-video': { completedAt:new Date(now.getTime()-86400000*2).toISOString(), best:67 } },
      activity, streak:5, lastActive:key(now), favorites:['p9','p12','p36'], readArticles:['a1'],
      settings:{ sound:true, rate:0.9, slowRate:0.6, voiceURI:'' }
    };
    localStorage.setItem('azulejo.state.v1', JSON.stringify(demo));
    location.reload();
  })()`;
  await evaluate(script);
  await sleep(1300);
}

try {
  await cmd('Page.enable');
  await cmd('Runtime.enable');
  await cmd('Log.enable');
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cmd('Page.navigate', { url: BASE + '/#/learn' });
  await sleep(1700);

  console.log('ONBOARDING', await evaluate('!!document.querySelector(".onboarding")'));
  await shot('01-onboarding');
  await evaluate(`(() => { const i=document.querySelector('#onboarding-name'); if(i) i.value='小林'; const f=document.querySelector('#onboarding-form'); if(f) f.requestSubmit(); })()`);
  await sleep(900);
  await shot('02-home-new');

  await seedDemo();
  await evaluate(`localStorage.setItem('azulejo.version.seen','3.30.0'); location.reload()`);
  await sleep(1250);
  console.log('VERSION_BADGE', await evaluate(`document.querySelector('.topbar-version')?.textContent`));
  console.log('VERSION_TOAST', await evaluate(`document.querySelector('.toast')?.textContent`));
  await shot('03a-version-update');
  await sleep(3400);
  await shot('03-home');
  await goto('#/daily');
  await sleep(450);
  await shot('39-daily');
  console.log('DAILY_STEP', await evaluate(`document.querySelector('.daily-card .eyebrow')?.textContent`));
  await click('[data-action="daily-next"]');
  await sleep(250);
  await click('[data-action="daily-next"]');
  await sleep(250);
  console.log('DAILY_VIDEO_LINES', await evaluate(`document.querySelectorAll('.daily-video-progress span').length`));
  await shot('39b-daily-video');
  const dailyLines = Number(await evaluate(`document.querySelectorAll('.daily-video-progress span').length`)) || 1;
  for (let i = 0; i < dailyLines; i += 1) {
    await click('[data-action="daily-mark-shadow"]');
    await sleep(200);
    await click('[data-action="daily-next"]');
    await sleep(200);
  }
  await evaluate(`[...document.querySelectorAll('[data-action="daily-answer"]:not([disabled])')][0]?.click()`);
  await sleep(200);
  await evaluate(`[...document.querySelectorAll('[data-action="daily-answer"]:not([disabled])')][0]?.click()`);
  await sleep(250);
  await click('[data-action="daily-next"]');
  await sleep(350);
  await shot('40-daily-report');
  console.log('DAILY_REPORT', await evaluate(`document.querySelector('.daily-done h2')?.textContent.trim()`));

  await goto('#/learn');
  await sleep(350);
  console.log('HERO', await evaluate(`({ title: document.querySelector('.hero-card h1')?.textContent, id: document.querySelector('.hero-actions [data-action="start-lesson"]')?.dataset.id })`));
  console.log('A1_COUNTS', await evaluate(`({ tab: document.querySelector('.level-tab.is-active .level-tab-top span')?.textContent, practice: document.querySelectorAll('.practice-tile').length, units: document.querySelectorAll('.unit-card').length })`));
  await shot('04-levels', '#course');

  await click('[data-action="select-level"][data-level="B1"]');
  await sleep(500);
  console.log('B1_HERO', await evaluate(`({ title: document.querySelector('.hero-card h1')?.textContent, id: document.querySelector('.hero-actions [data-action="start-lesson"]')?.dataset.id, level: document.querySelector('.level-tab.is-active b')?.textContent, practice: document.querySelectorAll('.practice-tile').length, units: document.querySelectorAll('.unit-card').length })`));
  await shot('05-level-b1', '#course');
  await shot('05b-level-b1-practice', '.practice-section');
  await shot('06-level-b1-media', '.level-media-row');
  await click('[data-action="select-level"][data-level="A1"]');

  await goto('#/media');
  await shot('07-media-page');
  await shot('08-media-page-levels', '.media-level-tabs');
  console.log('LISTENING_CARDS', await evaluate(`document.querySelectorAll('.listening-card').length`));
  await click('.listening-card');
  await sleep(500);
  await shot('08b-listening-player');
  console.log('LISTENING_NUMBER', await evaluate(`document.querySelector('.listening-hero-copy .eyebrow')?.textContent`));
  console.log('LISTENING_PROGRESS', await evaluate(`Boolean(document.querySelector('#listening-progress'))`));
  console.log('LISTENING_PROGRESS_LABEL', await evaluate(`document.querySelector('#listening-time')?.textContent`));
  await evaluate(`(() => { const s=document.querySelector('#listening-speed'); s.value='0.7'; s.dispatchEvent(new Event('input',{bubbles:true})); s.dispatchEvent(new Event('change',{bubbles:true})); })()`);
  await sleep(250);
  console.log('LISTENING_RATE', await evaluate(`document.querySelector('#listening-speed-value')?.textContent`));
  await click('[data-action="listening-transcript"]');
  await sleep(300);
  await shot('08b2-listening-text');
  console.log('LISTENING_ZH_PARAGRAPHS', await evaluate(`document.querySelectorAll('.listening-bi small').length`));
  await goto('#/listening/A2.1');
  await sleep(500);
  console.log('LISTENING_AUDIO_SRC', await evaluate(`document.querySelector('#listening-native')?.getAttribute('src')`));
  await goto('#/media');
  await goto('#/dubbing/m-a1-video');
  await shot('08c-dubbing');
  console.log('DUBBING_READY', await evaluate(`Boolean(document.querySelector('.dubbing-stage'))`));

  await goto('#/media');
  await click('[href="#/media/m-a1-video"]');
  await sleep(600);
  await shot('09-video-player');
  await click('[data-action="media-toggle"]');
  await sleep(2400);
  await shot('10-video-playing');
  for (let i = 0; i < 6; i++) {
    const finished = await evaluate('!!document.querySelector(".media-quiz")');
    if (finished) break;
    await click('[data-action="media-next"]');
    await sleep(280);
  }
  await sleep(500);
  await shot('11-video-finished');
  await evaluate(`(() => { const c=document.querySelector('.media-player-scroll'); const q=document.querySelector('.media-quiz'); if(c&&q) c.scrollTop = q.offsetTop - 20; })()`);
  await sleep(300);
  await shot('11b-video-quiz');
  console.log('QUIZ_CARDS', await evaluate(`document.querySelectorAll('.quiz-card').length`));
  for (let i = 0; i < 3; i++) {
    await evaluate(`(() => { const card = document.querySelectorAll('.quiz-card')[${i}]; if(card) card.querySelector('.quiz-option').click(); })()`);
    await sleep(350);
  }
  await evaluate(`(() => { const c=document.querySelector('.media-player-scroll'); const q=document.querySelector('.media-quiz'); if(c&&q) c.scrollTop = q.offsetTop - 20; })()`);
  await sleep(300);
  await shot('12-video-quiz');
  console.log('MEDIA_STATE', await evaluate(`JSON.parse(localStorage.getItem('azulejo.state.v1')).media`));

  await click('[data-action="close-media"]');
  await sleep(500);
  await click('[href="#/media/m-a1-audio"]');
  await sleep(500);
  await shot('13-audio-player');
  const transBtn = await evaluate('!!document.querySelector("[data-action=\\"toggle-transcript\\"]")');
  if (transBtn) await click('[data-action="toggle-transcript"]');
  await shot('14-audio-transcript');
  if (await evaluate('!!document.querySelector("[data-action=\\"toggle-roleplay\\"]")')) {
    await click('[data-action="toggle-roleplay"]');
    await sleep(400);
    await shot('15-audio-roleplay');
  }

  await goto('#/phrases');
  await shot('16-phrases');
  console.log('PHRASE_CARDS', await evaluate(`document.querySelectorAll('.phrase-card').length`));
  console.log('PHRASE_TOTAL', await evaluate(`document.querySelector('#phrase-count')?.textContent`));
  console.log('PHRASE_SCENES', await evaluate(`document.querySelectorAll('#phrase-filters .filter-chip').length`));
  await click('[data-action="select-language-tab"][data-tab="words"]');
  await sleep(600);
  await shot('17-lexicon');
  console.log('LEX_POS_GROUPS', await evaluate(`[...document.querySelectorAll('.lex-pos-head h3')].map(el => el.textContent.trim())`));
  console.log('LEX_ROWS', await evaluate(`document.querySelectorAll('.lex-row').length`));
  console.log('LEX_INDEX_FIRST_LAST', await evaluate(`[document.querySelector('.lex-index')?.textContent, [...document.querySelectorAll('.lex-index')].pop()?.textContent]`));
  console.log('LEX_TOTAL', await evaluate(`document.querySelector('#word-count')?.textContent`));
  await click('.page-btn[data-page="2"]');
  await sleep(350);
  console.log('LEX_PAGE2', await evaluate(`document.querySelector('#word-count')?.textContent`));
  await click('.page-btn[data-page="1"]');
  await sleep(250);
  await evaluate(`(() => { const i=document.querySelector('#word-search'); i.value='heteronym'; i.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await sleep(350);
  console.log('SEARCH_HETERONYM_ROWS', await evaluate(`document.querySelectorAll('.lex-row').length`));
  await evaluate(`(() => { const i=document.querySelector('#word-search'); i.value=''; i.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await sleep(250);
  await click('[data-action="filter-words"][data-level="C2"]');
  await sleep(400);
  await shot('18-lexicon-c2');
  await click('[data-action="filter-words"][data-level="all"]');
  await click('[data-action="select-language-tab"][data-tab="verbs"]');
  await sleep(400);
  await shot('18b-verbs');
  console.log('VERB_CARDS', await evaluate(`document.querySelectorAll('.verb-card').length`));
  await click('.verb-head');
  await sleep(300);
  await shot('18c-verb-table');
  console.log('VERB_TABLE_CELLS', await evaluate(`document.querySelectorAll('.verb-table td').length`));

  await goto('#/lesson/b1l1');
  await sleep(600);
  await shot('19-b1-lesson');
  await click('[data-action="next-step"]');
  await shot('20-b1-grammar');
  console.log('GRAMMAR_EN', await evaluate(`Boolean(document.querySelector('.grammar-lead-en'))`));
  await click('[data-action="next-step"]');
  await sleep(350);
  await shot('20a1-grammar-practice');
  await click('.option');
  await click('[data-action="check"]');
  await sleep(300);
  await click('[data-action="next-step"]');
  await click('.option');
  await click('[data-action="check"]');
  await sleep(300);
  await click('[data-action="next-step"]');
  await sleep(450);
  await shot('20a-b1-immersion');
  await evaluate(`document.querySelector('.reading-glossary')?.scrollIntoView({block:'start'})`);
  await sleep(350);
  await shot('20a3-glossary');
  console.log('IMMERSION_PROSE', await evaluate(`document.querySelectorAll('.immersion-prose p').length`));
  console.log('IMMERSION_IMAGES', await evaluate(`document.querySelectorAll('.immersion-photo').length`));
  console.log('IMMERSION_PHOTO_SRC', await evaluate(`document.querySelector('.immersion-photo')?.getAttribute('src')`));
  console.log('IMMERSION_WORDS', await evaluate(`document.querySelector('.immersion-meta span:nth-child(2)')?.textContent`));
  console.log('IMMERSION_QUESTIONS', await evaluate(`document.querySelectorAll('.immersion-question').length`));
  console.log('IMMERSION_GRAMMAR', await evaluate(`document.querySelectorAll('.immersion-grammar').length`));
  console.log('GLOSSARY_ROWS', await evaluate(`document.querySelectorAll('.glossary-row').length`));
  console.log('GLOSSARY_GROUPS', await evaluate(`[...document.querySelectorAll('.glossary-group h3')].map(el => el.textContent.trim())`));
  await click('.immersion-option');
  await sleep(250);
  await shot('20a2-immersion-answer');
  await click('[data-action="next-step"]');
  await sleep(300);
  console.log('VOCAB_PRACTICE_STEP', await evaluate(`document.querySelector('.exercise-title')?.textContent`));

  await goto('#/read/c1l1');
  await sleep(450);
  console.log('C1_GLOSSARY_COUNT', await evaluate(`document.querySelectorAll('.glossary-row').length`));
  console.log('C1_GLOSSARY_WORDS', JSON.stringify(await evaluate(`[...document.querySelectorAll('.glossary-row b')].map(el => el.textContent).slice(0, 15)`)));
  await goto('#/lesson/c1l1');
  await sleep(400);
  console.log('C1_VOCAB_COUNT', await evaluate(`document.querySelectorAll('.word-tile').length`));
  console.log('C1_VOCAB_WORDS', JSON.stringify(await evaluate(`[...document.querySelectorAll('.word-tile h2')].map(el => el.textContent).slice(0, 10)`)));

  await goto('#/lesson/c2l3');
  await sleep(600);
  await shot('20b-c2-lesson');
  await click('[data-action="next-step"]');
  await shot('20c-c2-grammar');

  await goto('#/media/m-c2-audio');
  await sleep(700);
  await shot('20d-c2-audio');

  await goto('#/lesson/a1lab01');
  await sleep(600);
  await shot('20e-practice-lab');
  await click('[data-action="next-step"]');
  await click('[data-action="next-step"]');
  await click('.option');
  await click('[data-action="check"]');
  await sleep(250);
  await click('[data-action="next-step"]');
  await click('.option');
  await click('[data-action="check"]');
  await sleep(250);
  await click('[data-action="next-step"]');
  await sleep(450);
  await shot('20f-practice-immersion');
  await click('[data-action="next-step"]');
  await sleep(400);
  await shot('20g-practice-exercise');
  console.log('LAB_TITLE', await evaluate(`document.querySelector('.lesson-body h1')?.textContent`));

  await goto('#/history');
  await sleep(400);
  await shot('41-history');
  console.log('HISTORY_CHAPTERS', await evaluate(`document.querySelectorAll('.history-chapter').length`));
  console.log('HISTORY_TITLE', await evaluate(`document.querySelector('.history-chapter h2')?.textContent`));
  console.log('HISTORY_ZH', await evaluate(`document.querySelector('.history-zh')?.textContent.slice(0,30)`));

  await goto('#/culture');
  await shot('20g-culture');
  console.log('CULTURE_CARDS', await evaluate(`document.querySelectorAll('.article-card').length`));
  console.log('CULTURE_CATEGORIES', await evaluate(`document.querySelectorAll('.culture-category-chips .filter-chip').length`));
  await click('.article-card');
  await sleep(350);
  await shot('20g1-culture-article');
  console.log('ARTICLE_SECTIONS', await evaluate(`document.querySelectorAll('.article-section').length`));
  await click('[data-action="close-modal"]');
  await sleep(300);
  console.log('RESOURCE_CARDS', await evaluate(`document.querySelectorAll('.resource-card').length`));
  await shot('20h-resources', '.resource-section');

  await goto('#/pro');
  await shot('30-pro');
  console.log('PRO_HEADING', await evaluate(`document.querySelector('.pro-hero h2')?.textContent.trim()`));
  console.log('PRO_TOTAL', await evaluate(`window.AZ_EXAMS?.length`));
  console.log('PRO_WRITING', await evaluate(`document.querySelectorAll('.pro-writing-section').length`));
  console.log('PRO_LEVEL_TABS', await evaluate(`document.querySelectorAll('.pro-level-tabs .filter-chip').length`));
  console.log('PRO_EXAMS_SHOWN', await evaluate(`document.querySelectorAll('.exam-card').length`));
  if (process.env.AZ_TEST_LICENSE) {
    await evaluate(`(() => { const i=document.querySelector('#license-input'); if(i) i.value=${JSON.stringify(process.env.AZ_TEST_LICENSE)}; })()`);
    await click('[data-action="activate-license"]');
    await sleep(3400);
    console.log('PRO_ACTIVE', await evaluate(`Boolean(document.querySelector('.pro-license.is-active'))`));
    await goto('#/exam/a2-mock-1');
    await sleep(500);
    await shot('30a-exam');
    console.log('EXAM_SECTIONS', await evaluate(`document.querySelectorAll('.exam-section').length`));
    console.log('EXAM_QUESTIONS', await evaluate(`document.querySelectorAll('.exam-question').length`));
    console.log('EXAM_AUDIO', await evaluate(`document.querySelectorAll('.exam-audio').length`));
    await click('[data-action="submit-exam"]');
    await sleep(500);
    await shot('30b-exam-result');
    console.log('EXAM_RESULT', await evaluate(`document.querySelector('.exam-result-status')?.textContent.trim()`));
  }

  await goto('#/reading');
  await shot('20i-reading-library');
  await click('[data-action="select-reading-level"][data-level="B1"]');
  await sleep(350);
  await shot('20i-b1-reading');
  console.log('READING_CODES', JSON.stringify(await evaluate(`[...document.querySelectorAll('.reading-card-kind')].map(el => el.textContent.trim()).slice(0, 4)`)));
  await click('.reading-card');
  await sleep(350);
  await shot('20k-reading-choice');
  console.log('READING_CHOICES', await evaluate(`document.querySelectorAll('.reading-choice-card').length`));
  console.log('READING_CHOICE_CODES', JSON.stringify(await evaluate(`[...document.querySelectorAll('.reading-choice-code')].map(el => el.textContent.trim())`)));
  await click('.reading-choice-card.is-intensive');
  await sleep(400);
  await shot('20k-b1-2-intensive');
  console.log('PAIR_PARAGRAPHS', await evaluate(`document.querySelectorAll('.intensive-paragraph').length`));
  console.log('PAIR_VOCAB', await evaluate(`document.querySelectorAll('.intensive-vocab .glossary-row').length`));
  console.log('PAIR_GRAMMAR', await evaluate(`document.querySelectorAll('.intensive-grammar-card').length`));
  await goto('#/reading');
  await sleep(300);
  console.log('READING_CARDS', await evaluate(`document.querySelectorAll('.reading-card').length`));
  console.log('READING_UNIQUE', await evaluate(`new Set([...document.querySelectorAll('.reading-card h3')].map(el => el.textContent)).size`));
  await click('.reading-card');
  await sleep(300);
  await click('.reading-choice-card:not(.is-intensive)');
  await sleep(500);
  await shot('20j-direct-reading');
  console.log('DIRECT_READING_STEP', await evaluate(`Boolean(document.querySelector('.step-immersion'))`));

  await goto('#/writing');
  await sleep(300);
  await shot('35-writing');
  console.log('WRITING_PROMPTS', await evaluate(`document.querySelectorAll('.writing-levels .filter-chip').length`));
  await evaluate(`const t=document.querySelector('#writing-textarea'); if(t){t.value='Eu estudo português porque quero trabalhar em Lisboa. No entanto, ainda tenho dificuldade em falar. Por isso, leio todos os dias e ouço rádio.'; t.dispatchEvent(new Event('input',{bubbles:true}));}`);
  await click('[data-action="writing-submit"]');
  await sleep(500);
  console.log('WRITING_SCORE', await evaluate(`document.querySelector('.writing-score-head h2')?.textContent`));

  await goto('#/exams-guide');
  await sleep(300);
  await shot('36-exam-guide');
  console.log('EXAM_CARDS', await evaluate(`document.querySelectorAll('.exam-card').length`));
  console.log('SYLLABUS_ROWS', await evaluate(`document.querySelectorAll('.syllabus-row').length`));

  await goto('#/themes');
  await sleep(350);
  await shot('37-themes');
  await goto('#/intensive-unit/b1l1');
  await sleep(400);
  console.log('UNIT_INTENSIVE_PARAGRAPHS', await evaluate(`document.querySelectorAll('.intensive-paragraph').length`));
  console.log('UNIT_INTENSIVE_VOCAB', await evaluate(`document.querySelectorAll('.intensive-vocab .glossary-row').length`));
  console.log('UNIT_INTENSIVE_GRAMMAR', await evaluate(`document.querySelectorAll('.intensive-grammar-card').length`));

  await goto('#/themes');
  await sleep(350);
  console.log('THEME_CARDS', await evaluate(`document.querySelectorAll('.theme-card').length`));
  console.log('THEME_WORDS', await evaluate(`document.querySelectorAll('.theme-word-row').length`));
  console.log('ADJ_GROUPS', await evaluate(`document.querySelectorAll('.adjective-panel .filter-chip').length`));

  await goto('#/grammar');
  await sleep(300);
  console.log('MEMORY_TIPS', await evaluate(`document.querySelectorAll('.memory-card').length`));

  await goto('#/reading');
  await sleep(300);
  await click('[data-action="select-reading-level"][data-level="B1"]');
  await sleep(350);
  await goto('#/grammar');
  await sleep(450);
  await shot('33-grammar');
  console.log('GRAMMAR_CARDS', await evaluate(`document.querySelectorAll('.grammar-card').length`));
  console.log('GRAMMAR_TOTAL', await evaluate(`document.querySelector('.grammar-list-head')?.textContent.trim()`));
  await click('.grammar-card');
  await sleep(400);
  await shot('33b-grammar-chapter');
  console.log('GRAMMAR_CHAPTER', await evaluate(`document.querySelector('.grammar-chapter-head h1')?.textContent`));
  console.log('GRAMMAR_EXAMPLES', await evaluate(`document.querySelectorAll('.grammar-examples .example-row').length`));
  await goto('#/grammar');
  await sleep(300);
  await click('[data-action="filter-grammar-kind"][data-kind="Morfologia"]');
  await sleep(350);
  await shot('33c-grammar-morphology');
  console.log('MORPH_CARDS', await evaluate(`document.querySelectorAll('.grammar-card').length`));
  console.log('MORPH_TAXONOMY', await evaluate(`[...document.querySelectorAll('.grammar-card-zh')].map(el => el.textContent.trim())`));

  await click('[data-action="open-settings"]');
  await sleep(350);
  await shot('31-cloud-settings');
  console.log('CLOUD_CONFIG', await evaluate(`document.querySelector('.cloud-unconfigured') ? 'unconfigured' : document.querySelector('.cloud-auth') ? 'signin' : document.querySelector('.cloud-account') ? 'signed-in' : 'hidden'`));
  await evaluate(`(() => { const s=document.querySelector('#settings-language'); if(s){s.value='en';} const f=document.querySelector('#settings-form'); if(f){f.requestSubmit();} })()`);
  await sleep(450);
  console.log('LANG_NAV', await evaluate(`document.querySelector('.nav-copy strong')?.textContent`));
  console.log('LANG_HTML', await evaluate(`document.documentElement.lang`));
  await goto('#/learn');
  await sleep(300);
  console.log('LANG_BUTTON', await evaluate(`document.querySelector('.hero-actions .btn')?.textContent.trim()`));
  await goto('#/grammar');
  await sleep(350);
  await shot('38-language-en');
  await click('.grammar-card');
  await sleep(300);
  console.log('LANG_GRAMMAR', await evaluate(`document.querySelector('.grammar-lead')?.textContent.slice(0,50)`));
  await click('[data-action="open-settings"]');
  await sleep(250);
  await evaluate(`(() => { const s=document.querySelector('#settings-language'); if(s){s.value='zh';} const f=document.querySelector('#settings-form'); if(f){f.requestSubmit();} })()`);
  await sleep(350);
  await sleep(250);

  await goto('#/legal');
  await sleep(350);
  await shot('32-legal');
  console.log('LEGAL_BLOCKS', await evaluate(`document.querySelectorAll('.legal-block').length`));

  await goto('#/progress');
  await shot('21-progress');
  await shot('22-progress-levels', '.level-progress-panel');

  await cmd('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cmd('Page.navigate', { url: BASE + '/#/learn' });
  await sleep(1100);
  await shot('23-mobile-home');
  await shot('24-mobile-levels', '#course');

  await goto('#/media');
  await shot('25-mobile-media');
  await goto('#/media/m-a1-video');
  await sleep(900);
  await shot('26-mobile-video');

  await goto('#/phrases');
  await click('[data-action="select-language-tab"][data-tab="words"]');
  await sleep(650);
  await shot('27-mobile-lexicon');

  await goto('#/progress');
  await shot('28-mobile-progress');

  await goto('#/reading');
  await shot('28c-mobile-reading');
  console.log('MOBILE_READING_NAV', await evaluate(`document.querySelectorAll('.bottom-item').length`));
  console.log('MOBILE_READING_OVERFLOW', await evaluate('document.documentElement.scrollWidth > innerWidth + 1'));

  await goto('#/lesson/b1l1');
  await sleep(600);
  await click('[data-action="next-step"]');
  await click('[data-action="next-step"]');
  await sleep(500);
  await shot('28b-mobile-immersion');
  console.log('MOBILE_IMMERSION_OVERFLOW', await evaluate('document.documentElement.scrollWidth > innerWidth + 1'));

  await evaluate(`localStorage.removeItem('azulejo.state.v1'); location.hash='#/learn'; location.reload()`);
  await sleep(1500);
  await shot('29-mobile-onboarding');

  const overflow = await evaluate('document.documentElement.scrollWidth > innerWidth + 1');
  const swCount = await evaluate('navigator.serviceWorker.getRegistrations().then(r => r.length).catch(() => -1)');
  console.log('HORIZONTAL_OVERFLOW_MOBILE', overflow);
  console.log('SERVICE_WORKERS', swCount);
  console.log('ERRORS', JSON.stringify(errors, null, 2));
  console.log('CONSOLE_TAIL', JSON.stringify(consoleMessages.slice(-12), null, 2));
} catch (err) {
  console.error('QA FAILED', err);
  console.log('ERRORS', JSON.stringify(errors, null, 2));
  process.exitCode = 1;
} finally {
  try { ws.close(); } catch (err) { /* noop */ }
  try { chrome.kill(); } catch (err) { /* noop */ }
}
