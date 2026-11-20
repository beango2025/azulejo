/* Azulejo — a small, opinionated European Portuguese learning app. */
(function () {
  'use strict';

  const DATA = window.AZ_DATA;
  if (Array.isArray(window.AZ_PHRASES_1000) && window.AZ_PHRASES_1000.length) DATA.phrases = window.AZ_PHRASES_1000;
  if (Array.isArray(window.AZ_CULTURE_100) && window.AZ_CULTURE_100.length) DATA.articles = window.AZ_CULTURE_100;
  const PHRASE_SCENES = Array.isArray(window.AZ_PHRASE_SCENES) ? window.AZ_PHRASE_SCENES : [];
  const CULTURE_CATEGORIES = Array.isArray(window.AZ_CULTURE_CATEGORIES) ? window.AZ_CULTURE_CATEGORIES : [];
  const ADVANCED = window.AZ_ADVANCED || { units: [], media: [] };
  const MORE = window.AZ_MORE || { units: [], lexicon: {} };
  const LEVELS = window.AZ_LEVELS || [];
  const LEXICON = window.AZ_LEXICON || {};
  const LISTENING_ZH = window.AZ_LISTENING_ZH || {};
  const GRAMMAR_EXTRA = window.AZ_GRAMMAR_EXTRA || {};
  const POS_EXISTING = window.AZ_POS_EXISTING || {};
  const SCENES = window.AZ_CORE_SCENES || {};
  const RESOURCES = window.AZ_RESOURCES || [];
  const STORAGE_KEY = 'azulejo.state.v1';
  const VERSION_KEY = 'azulejo.version.seen';
  const APP_VERSION = '3.9.0';
  const XP_PER_LEVEL = 120;
  const LEVEL_TITLES = ['Curioso', 'Viajante', 'Conversador', 'Lisboeta', 'Contador de histórias', 'Alma portuguesa'];

  /* Merge core units and attach level / five-language metadata. */
  DATA.units.push(...(ADVANCED.units || []), ...(MORE.units || []));
  DATA.media = ADVANCED.media || [];
  DATA.levels = LEVELS;
  Object.assign(LEXICON, MORE.lexicon || {});
  MORE.units.forEach(unit => {
    const level = LEVELS.find(l => l.id === unit.level);
    if (level && !level.units.includes(unit.id)) level.units.push(unit.id);
  });
  let nextUnitOrder = 1;
  LEVELS.forEach(level => {
    const levelUnits = [];
    level.units.forEach(unitId => {
      const unit = DATA.units.find(u => u.id === unitId);
      if (unit && !levelUnits.includes(unit)) levelUnits.push(unit);
    });
    level.units = levelUnits.map(unit => unit.id);
    levelUnits.forEach(unit => {
      unit.level = level.id;
      unit.order = nextUnitOrder++;
    });
  });
  DATA.units.sort((a, b) => a.order - b.order);
  DATA.units.forEach(unit => {
    if (!unit.level) unit.level = 'A1';
    unit.lessons.forEach(lesson => {
      const scene = SCENES[lesson.id];
      if (scene) {
        lesson.title = scene.pt;
        lesson.zh = scene.zh;
      }
      lesson.vocab.forEach(word => {
        const tr = LEXICON[word.id] || [];
        word.en = tr[0] || '—';
        word.fr = tr[1] || '—';
        word.es = tr[2] || '—';
      });
    });
  });

  /* 30 lessons per level: core units + deterministic practice labs. */
  DATA.labs = window.AZ_BUILD_LABS
    ? window.AZ_BUILD_LABS({ levels: LEVELS, units: DATA.units, media: DATA.media })
    : [];

  DATA.achievements.push(
    { id: 'b1', icon: 'book', title: 'Contador de histórias', zh: '讲故事的人', desc: '完成 B1 单元', test: s => ['b1l1', 'b1l2', 'b1l3'].every(id => s.lessons[id]) },
    { id: 'b2', icon: 'chart', title: 'Voz da mesa', zh: '会议发声者', desc: '完成 B2 单元', test: s => ['b2l1', 'b2l2', 'b2l3'].every(id => s.lessons[id]) },
    { id: 'c1', icon: 'pin', title: 'Olhar crítico', zh: '批判视角', desc: '完成 C1 单元', test: s => ['c1l1', 'c1l2', 'c1l3'].every(id => s.lessons[id]) },
    { id: 'c2', icon: 'sparkle', title: 'Nas entrelinhas', zh: '读懂言外之意', desc: '完成 C2 单元', test: s => ['c2l1', 'c2l2', 'c2l3'].every(id => s.lessons[id]) },
    { id: 'media6', icon: 'video', title: 'Ouvido absoluto', zh: '影音耳朵', desc: '完成 6 个影音练习', test: s => Object.keys(s.media || {}).length >= 6 },
    { id: 'words100', icon: 'layers', title: 'Cinco línguas', zh: '五语词汇家', desc: '收集 100 个词', test: s => Object.keys(s.words).length >= 100 }
  );

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------------------------------------------------------------------ */
  /* Small utilities                                                     */
  /* ------------------------------------------------------------------ */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const pad = n => String(n).padStart(2, '0');

  function dateKey(date = new Date()) {
    const d = new Date(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function dateFromKey(key) {
    return new Date(`${key}T12:00:00`);
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function daysBetween(a, b) {
    const d1 = new Date(a);
    const d2 = new Date(b);
    d1.setHours(12, 0, 0, 0);
    d2.setHours(12, 0, 0, 0);
    return Math.round((d2 - d1) / 86400000);
  }

  function prettyDate() {
    const raw = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 19) return 'Boa tarde';
    return 'Boa noite';
  }

  function todayXP() {
    return state.activity[dateKey()] || 0;
  }

  function currentStreak() {
    return DATA.streakOf(state);
  }

  function levelInfo() {
    const raw = Math.floor(state.xp / XP_PER_LEVEL) + 1;
    const n = Math.min(raw, LEVEL_TITLES.length);
    return {
      n: raw,
      title: LEVEL_TITLES[n - 1] || 'Alma portuguesa',
      current: raw > LEVEL_TITLES.length ? XP_PER_LEVEL : state.xp % XP_PER_LEVEL,
      needed: XP_PER_LEVEL,
      pct: raw > LEVEL_TITLES.length ? 1 : (state.xp % XP_PER_LEVEL) / XP_PER_LEVEL
    };
  }

  function initials(name) {
    const cleaned = (name || '').trim();
    if (!cleaned) return 'A';
    const parts = cleaned.split(/\s+/);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  function accentFold(str) {
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function normalizeAnswer(str) {
    return accentFold(str)
      .replace(/[.,!?;:¡¿"'«»…]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cleanForExact(str) {
    return String(str).toLowerCase().replace(/[.,!?;:¡¿"'«»…]/g, '').replace(/\s+/g, ' ').trim();
  }

  function joinTokens(tokens) {
    return tokens.join(' ').replace(/\s+([.,!?;:])/g, '$1');
  }

  function icon(name, cls = '') {
    return `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  function ring(pct, size, stroke, color, track) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const value = Math.max(0, Math.min(1, pct || 0));
    return `<svg class="progress-ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track || 'var(--line)'}" stroke-width="${stroke}"/>
      <circle class="ring-value" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color || 'var(--blue)'}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - value)}"/>
    </svg>`;
  }

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */

  function defaultState() {
    return {
      version: 1,
      onboarded: false,
      name: '',
      goal: 40,
      xp: 0,
      lessons: {},
      words: {},
      media: {},
      listening: {},
      dubbing: {},
      activity: {},
      streak: 0,
      lastActive: null,
      favorites: [],
      readArticles: [],
      settings: { sound: true, rate: 0.9, slowRate: 0.6, listeningRate: 0.9, voiceURI: '' }
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      const merged = Object.assign(base, parsed);
      merged.settings = Object.assign(defaultState().settings, parsed.settings || {});
      if (!Array.isArray(merged.favorites)) merged.favorites = [];
      if (!Array.isArray(merged.readArticles)) merged.readArticles = [];
      if (!merged.activity || typeof merged.activity !== 'object') merged.activity = {};
      if (!merged.lessons || typeof merged.lessons !== 'object') merged.lessons = {};
      if (!merged.words || typeof merged.words !== 'object') merged.words = {};
      if (!merged.media || typeof merged.media !== 'object') merged.media = {};
      if (!merged.listening || typeof merged.listening !== 'object') merged.listening = {};
      if (!merged.dubbing || typeof merged.dubbing !== 'object') merged.dubbing = {};
      return merged;
    } catch (err) {
      console.warn('Could not read saved progress.', err);
      return base;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (window.AZ_CLOUD && window.AZ_CLOUD.session()) window.AZ_CLOUD.schedulePush(state);
    } catch (err) {
      console.warn('Could not save progress.', err);
    }
  }

  function addXP(amount) {
    if (!amount) return;
    const key = dateKey();
    state.xp += amount;
    state.activity[key] = (state.activity[key] || 0) + amount;
    if (state.lastActive !== key) {
      const gap = state.lastActive ? daysBetween(dateFromKey(state.lastActive), dateFromKey(key)) : null;
      state.streak = gap === 1 ? (state.streak || 0) + 1 : 1;
      state.lastActive = key;
    }
    saveState();
  }

  let state = loadState();

  const coreLessons = DATA.units.flatMap(unit => unit.lessons.map(lesson => ({ ...lesson, unit })));
  const labLessons = (DATA.labs || []).map(lesson => ({ ...lesson, unit: lesson.unit }));
  const allLessons = [...coreLessons, ...labLessons];
  const lessonMap = new Map(allLessons.map(l => [l.id, l]));
  const vocabMap = new Map();
  const allVocab = [];
  coreLessons.forEach(lesson => lesson.vocab.forEach(word => {
    const enriched = {
      ...word,
      pos: word.pos || POS_EXISTING[word.pt] || '',
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      unitId: lesson.unit.id,
      level: lesson.unit.level
    };
    vocabMap.set(word.id, enriched);
    allVocab.push(enriched);
  }));
  Object.entries(window.AZ_VOCAB_BANK || {}).forEach(([level, words]) => {
    (words || []).forEach(word => {
      if (!word || !word.id || vocabMap.has(word.id)) return;
      const enriched = {
        ...word,
        pron: word.pron || (window.AZ_PHONETIC ? window.AZ_PHONETIC(word.pt) : ''),
        note: word.note || '',
        lessonId: `bank-${word.id}`,
        lessonTitle: 'Vocabulário essencial',
        unitId: `bank-${level}`,
        level
      };
      vocabMap.set(word.id, enriched);
      allVocab.push(enriched);
    });
  });

  function completedCount() {
    return allLessons.filter(l => state.lessons[l.id]).length;
  }

  function levelMeta(id) {
    return LEVELS.find(level => level.id === id) || LEVELS[0] || { id, name: id, zh: '', units: [] };
  }

  function lessonsForLevel(id) {
    return allLessons.filter(lesson => lesson.unit.level === id);
  }

  function nextLessonForLevel(id) {
    const lessons = lessonsForLevel(id);
    return lessons.find(lesson => !lesson.isLab && !state.lessons[lesson.id])
      || lessons.find(lesson => lesson.isLab && !state.lessons[lesson.id])
      || null;
  }

  function nextLesson() {
    return allLessons.find(l => !l.isLab && !state.lessons[l.id])
      || allLessons.find(l => l.isLab && !state.lessons[l.id])
      || null;
  }

  function nextLessonAfter(id) {
    const idx = allLessons.findIndex(l => l.id === id);
    return idx >= 0 ? allLessons[idx + 1] || null : null;
  }

  function learnedWordCount() {
    return Object.keys(state.words).length;
  }

  function dueWords() {
    const now = Date.now();
    return Object.entries(state.words)
      .map(([id, record]) => ({ id, ...record, vocab: vocabMap.get(id) }))
      .filter(item => item.vocab)
      .filter(item => !item.due || new Date(item.due).getTime() <= now)
      .sort((a, b) => new Date(a.due || 0) - new Date(b.due || 0));
  }

  function learnedWords() {
    return Object.entries(state.words)
      .map(([id, record]) => ({ id, ...record, vocab: vocabMap.get(id) }))
      .filter(item => item.vocab);
  }

  function addWordsToReview(words) {
    let added = 0;
    words.forEach(word => {
      if (!state.words[word.id]) {
        state.words[word.id] = {
          due: new Date().toISOString(),
          interval: 0,
          ease: 2.5,
          reps: 0,
          learnedAt: new Date().toISOString()
        };
        added += 1;
      }
    });
    return added;
  }

  function updateSRS(record, rating) {
    const now = new Date();
    const next = Object.assign({}, record);
    let days = 0;
    next.reps = (record.reps || 0) + 1;
    next.ease = record.ease || 2.5;
    if (rating === 'again') {
      next.ease = Math.max(1.6, next.ease - 0.2);
      next.interval = 0;
      now.setMinutes(now.getMinutes() + 10);
      next.due = now.toISOString();
    } else if (rating === 'hard') {
      next.ease = Math.max(1.7, next.ease - 0.05);
      next.interval = Math.max(1, Math.round((record.interval || 1) * 1.2));
      days = next.interval;
      next.due = addDays(now, days).toISOString();
    } else if (rating === 'good') {
      next.interval = record.interval ? Math.max(2, Math.round(record.interval * next.ease)) : 2;
      days = next.interval;
      next.due = addDays(now, days).toISOString();
    } else {
      next.ease = Math.min(3.2, next.ease + 0.1);
      next.interval = Math.max(4, Math.round((record.interval || 2) * next.ease * 1.4));
      days = next.interval;
      next.due = addDays(now, days).toISOString();
    }
    next.lastRating = rating;
    next.lastReviewed = now.toISOString();
    return { record: next, days };
  }

  function intervalLabel(record, rating) {
    if (rating === 'again') return '10 min';
    if (rating === 'hard') return '1 dia';
    const days = rating === 'good'
      ? (record.interval ? Math.max(2, Math.round(record.interval * (record.ease || 2.5))) : 2)
      : Math.max(4, Math.round((record.interval || 2) * (record.ease || 2.5) * 1.4));
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  }

  /* ------------------------------------------------------------------ */
  /* Audio                                                               */
  /* ------------------------------------------------------------------ */

  const Speech = {
    voices: [],
    warned: false,
    init() {
      if (!('speechSynthesis' in window)) return;
      const load = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
      };
      load();
      window.speechSynthesis.addEventListener('voiceschanged', load);
    },
    ptVoices() {
      return this.voices.filter(v => /^pt([-_]|$)/i.test(v.lang));
    },
    pick() {
      const preferred = state.settings.voiceURI;
      if (preferred) {
        const chosen = this.voices.find(v => v.voiceURI === preferred);
        if (chosen) return chosen;
      }
      return this.voices.find(v => /^pt[-_]PT$/i.test(v.lang))
        || this.voices.find(v => /portugu/i.test(v.name) && /portugal/i.test(v.name))
        || this.voices.find(v => /^pt([-_]|$)/i.test(v.lang))
        || null;
    },
    speak(text, slow, btn) {
      if (!text) return;
      if (!('speechSynthesis' in window)) {
        showToast('这个浏览器不支持语音朗读。', 'warn');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.rate = slow ? Number(state.settings.slowRate) || 0.6 : Number(state.settings.rate) || 0.9;
      utterance.pitch = 1;
      const voice = this.pick();
      if (voice) utterance.voice = voice;
      if (!voice && !this.warned) {
        this.warned = true;
        showToast('未检测到葡语语音，正在使用系统默认语音。', 'warn');
      }
      if (btn) {
        btn.classList.add('is-speaking');
        setTimeout(() => btn.classList.remove('is-speaking'), 900);
      }
      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        showToast('语音播放失败，请检查系统语音设置。', 'warn');
      }
    },
    speakSequence(texts, btn, rateOverride, onEnd) {
      if (!texts || !texts.length) { if (onEnd) onEnd(); return; }
      if (!('speechSynthesis' in window)) {
        showToast('这个浏览器不支持语音朗读。', 'warn');
        if (onEnd) onEnd();
        return;
      }
      window.speechSynthesis.cancel();
      const voice = this.pick();
      if (!voice && !this.warned) {
        this.warned = true;
        showToast('未检测到葡语语音，正在使用系统默认语音。', 'warn');
      }
      if (btn) btn.classList.add('is-speaking');
      let index = 0;
      const next = () => {
        if (index >= texts.length) {
          if (btn) btn.classList.remove('is-speaking');
          if (onEnd) onEnd();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(texts[index]);
        utterance.lang = 'pt-PT';
        utterance.rate = Number(rateOverride) || Number(state.settings.rate) || 0.9;
        utterance.pitch = 1;
        if (voice) utterance.voice = voice;
        utterance.onend = () => {
          index += 1;
          setTimeout(next, 420);
        };
        utterance.onerror = () => {
          if (btn) btn.classList.remove('is-speaking');
          if (onEnd) onEnd();
        };
        window.speechSynthesis.speak(utterance);
      };
      next();
    },
    speakMediaLine(text, roleIndex, rate, onEnd) {
      if (!text) { if (onEnd) onEnd(); return; }
      if (!('speechSynthesis' in window)) {
        if (!this.warned) {
          this.warned = true;
          showToast('这个浏览器不支持语音朗读，正在用字幕播放。', 'warn');
        }
        if (onEnd) setTimeout(onEnd, Math.max(2600, text.split(/\s+/).length * 420));
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.rate = Number(rate) || 0.9;
      utterance.pitch = 0.96 + (roleIndex % 3) * 0.045;
      const ptVoices = this.ptVoices();
      const voice = (ptVoices.length > 1 ? ptVoices[roleIndex % ptVoices.length] : this.pick());
      if (voice) utterance.voice = voice;
      if (!voice && !this.warned) {
        this.warned = true;
        showToast('未检测到葡语语音，正在使用系统默认语音。', 'warn');
      }
      utterance.onend = () => { if (onEnd) onEnd(); };
      utterance.onerror = () => { if (onEnd) onEnd(); };
      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        if (onEnd) onEnd();
      }
    },
    stop() {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  let audioCtx = null;

  function soundFX(kind) {
    if (!state.settings.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const notes = kind === 'correct' ? [523.25, 659.25, 783.99]
        : kind === 'wrong' ? [233.08, 196]
        : kind === 'complete' ? [523.25, 659.25, 783.99, 1046.5]
        : [440];
      const start = audioCtx.currentTime;
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = start + i * 0.085;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.035, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      });
    } catch (err) { /* sound is decorative */ }
  }

  /* ------------------------------------------------------------------ */
  /* Chrome, navigation and routing                                      */
  /* ------------------------------------------------------------------ */

  const NAV = [
    { id: 'learn', label: '学习', pt: 'Aprender', href: '#/learn', icon: 'book' },
    { id: 'reading', label: '阅读', pt: 'Leitura & escuta', href: '#/reading', icon: 'layers' },
    { id: 'media', label: '影音', pt: 'Vídeo & áudio', href: '#/media', icon: 'video' },
    { id: 'review', label: '复习', pt: 'Revisão', href: '#/review', icon: 'review' },
    { id: 'phrases', label: '语料', pt: 'Frases & palavras', href: '#/phrases', icon: 'chat' },
    { id: 'culture', label: '文化', pt: 'Cultura', href: '#/culture', icon: 'sun' },
    { id: 'pro', label: '模考 Pro', pt: 'Pro · A1–C2', href: '#/pro', icon: 'target' },
    { id: 'progress', label: '进度', pt: 'Progresso', href: '#/progress', icon: 'chart' }
  ];

  const ui = {
    route: 'learn',
    courseLevel: '',
    readingLevel: 'A1',
    mediaLevel: 'A1',
    languageTab: 'phrases',
    openVerb: '',
    phraseGroup: 'all',
    phraseLimit: 100,
    phraseQuery: '',
    cultureCategory: 'all',
    cultureLimit: 13,
    exam: null,
    proLevel: 'A1',
    cloudRemote: null,
    wordQuery: '',
    wordLevel: 'all',
    wordLimit: 200,
    favOnly: false,
    lesson: null,
    review: null,
    media: null,
    modalOpen: false,
    lastFocus: null
  };

  function navItem(item, active) {
    return `<a class="nav-item ${active ? 'is-active' : ''}" href="${item.href}" data-nav="${item.id}" ${active ? 'aria-current="page"' : ''}>
      <span class="nav-icon">${icon(item.icon)}</span>
      <span class="nav-copy"><strong>${item.label}</strong><small>${item.pt}</small></span>
      ${item.id === 'pro' ? `<span class="nav-pro">${window.AZ_LICENSE && window.AZ_LICENSE.isPro() ? 'PRO' : 'A2'}</span>` : ''}
      ${active ? '<span class="nav-dot" aria-hidden="true"></span>' : ''}
    </a>`;
  }

  function lastSevenDays() {
    const out = [];
    for (let i = 6; i >= 0; i--) out.push(addDays(new Date(), -i));
    return out;
  }

  function renderSidebar(active) {
    const nav = $('#nav-list');
    if (nav) nav.innerHTML = NAV.map(item => navItem(item, item.id === active)).join('');
    const foot = $('#sidebar-foot');
    if (!foot) return;
    const streak = currentStreak();
    const lvl = levelInfo();
    const days = lastSevenDays();
    foot.innerHTML = `
      <div class="streak-card">
        <span class="streak-flame">${icon('flame')}</span>
        <div class="streak-text">
          <strong>${streak} ${streak === 1 ? 'dia' : 'dias'}</strong>
          <span>连续学习</span>
        </div>
        <div class="mini-dots" aria-hidden="true">
          ${days.map(d => `<i class="${state.activity[dateKey(d)] ? 'has-xp' : ''} ${dateKey(d) === dateKey() ? 'is-today' : ''}"></i>`).join('')}
        </div>
      </div>
      <button class="profile-chip" data-action="open-settings" aria-label="打开设置">
        <span class="avatar">${esc(initials(state.name))}</span>
        <span class="profile-copy">
          <strong>${esc(state.name || 'Aprendiz')}</strong>
          <small>Nível ${lvl.n} · ${lvl.title}</small>
        </span>
        ${icon('settings', 'profile-cog')}
      </button>
        <p class="sidebar-version">Azulejo v${APP_VERSION} <span>PT-PT</span></p>`;
  }

  function renderTopbar() {
    const top = $('#topbar');
    if (!top) return;
    const xp = todayXP();
    const goal = Number(state.goal) || 40;
    const done = xp >= goal;
    top.innerHTML = `
      <div class="topbar-left">
        <p class="topbar-hello">${greeting()}${state.name ? `, ${esc(state.name)}` : ''}.</p>
        <p class="topbar-date">${prettyDate()} <span class="topbar-sep">·</span> <span class="topbar-meta">Português europeu · A1–C2</span> <span class="topbar-version">v${APP_VERSION}</span></p>
      </div>
      <div class="topbar-right">
        <a class="goal-pill ${done ? 'is-complete' : ''}" href="#/progress" aria-label="今日目标 ${xp} / ${goal} XP">
          ${icon(done ? 'check' : 'target')}
          <span><b>${xp}</b><span class="goal-slash"> / ${goal}</span> XP</span>
        </a>
        <button class="icon-btn ${state.settings.sound ? '' : 'is-muted'}" data-action="toggle-sound" aria-label="${state.settings.sound ? '关闭音效' : '打开音效'}" title="${state.settings.sound ? '关闭音效' : '打开音效'}">
          ${icon(state.settings.sound ? 'volume' : 'volume-off')}
        </button>
        <button class="icon-btn" data-action="open-settings" aria-label="设置" title="设置">${icon('settings')}</button>
        <button class="avatar-btn" data-action="open-settings" aria-label="打开个人设置">${esc(initials(state.name))}</button>
      </div>`;
  }

  function renderBottomNav(active) {
    const bottom = $('#bottom-nav');
    if (!bottom) return;
    bottom.innerHTML = NAV.map(item => `
      <a href="${item.href}" class="bottom-item ${item.id === active ? 'is-active' : ''}" ${item.id === active ? 'aria-current="page"' : ''}>
        ${icon(item.icon)}<span>${item.label}</span>
      </a>`).join('');
  }

  function renderChrome(active) {
    renderSidebar(active);
    renderTopbar();
    renderBottomNav(active);
  }

  function refreshChrome() {
    renderChrome(ui.route);
  }

  function routeInfo() {
    const raw = location.hash.replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    return { name: parts[0] || 'learn', parts };
  }

  function router() {
    const info = routeInfo();
    const name = info.name;
    const mediaPlayer = name === 'media' && Boolean(info.parts[1]);
    const directReading = name === 'read' && Boolean(info.parts[1]);
    const listeningPlayer = name === 'listening' && Boolean(info.parts[1]);
    const dubbingPlayer = name === 'dubbing' && Boolean(info.parts[1]);
    const examPlayer = name === 'exam' && Boolean(info.parts[1]);
    const focus = name === 'lesson' || directReading || mediaPlayer || listeningPlayer || dubbingPlayer || examPlayer || (name === 'review' && info.parts[1] === 'session');
    if (mediaPlay && !mediaPlayer) {
      Speech.stop();
      clearTimeout(mediaTimer);
      mediaPlay = null;
    }
    if (listeningPlay && !listeningPlayer) {
      Speech.stop();
      listeningPlay = null;
    }
    if (dubbingPlay && !dubbingPlayer) {
      dubbingPlay.discard = true;
      stopDubbingStream();
      dubbingPlay = null;
    }
    if (ui.exam && ui.exam.timerId && !examPlayer) {
      clearInterval(ui.exam.timerId);
      ui.exam = null;
    }
    document.body.classList.toggle('focus-mode', focus);
    closeModal(true);
    ui.route = name === 'lesson' ? 'learn' : directReading ? 'reading' : (listeningPlayer || dubbingPlayer) ? 'media' : (name === 'pro' || name === 'exam') ? 'pro' : name;
    if (focus) {
      if (name === 'lesson' || directReading) {
        const lesson = lessonMap.get(info.parts[1]);
        if (!lesson) {
          location.hash = directReading ? '#/reading' : '#/learn';
          return;
        }
        startLesson(lesson, directReading ? { startAt: 'immersion' } : {});
      } else if (mediaPlayer) {
        startMedia(info.parts[1]);
      } else if (listeningPlayer) {
        startListening(info.parts[1]);
      } else if (dubbingPlayer) {
        startDubbing(info.parts[1]);
      } else if (examPlayer) {
        startExam(info.parts[1]);
      } else {
        startReviewSession(info.parts[2] === 'all');
      }
      return;
    }
    if (name === 'listening' || name === 'dubbing') {
      location.hash = '#/media';
      return;
    }
    if (!['learn', 'reading', 'media', 'review', 'phrases', 'culture', 'pro', 'exam', 'legal', 'progress'].includes(name)) {
      location.hash = '#/learn';
      return;
    }
    ui.lesson = null;
    ui.review = null;
    ui.media = null;
    renderChrome(ui.route);
    if (name === 'learn') renderHome();
    if (name === 'reading') renderReadingPage();
    if (name === 'media') renderMediaPage();
    if (name === 'review') renderReviewPage();
    if (name === 'phrases') renderPhrasesPage();
    if (name === 'culture') renderCulturePage();
    if (name === 'pro' || name === 'exam') renderProPage(false);
    if (name === 'legal') renderLegalPage();
    if (name === 'progress') renderProgressPage();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function go(hash) {
    if (location.hash === hash) router();
    else location.hash = hash;
  }

  /* ------------------------------------------------------------------ */
  /* Reusable page pieces                                                */
  /* ------------------------------------------------------------------ */

  function pageHead(eyebrow, title, subtitle, extra = '') {
    return `<header class="page-head">
      <div class="page-head-copy">
        <span class="eyebrow">${eyebrow}</span>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      ${extra ? `<div class="page-head-extra">${extra}</div>` : ''}
    </header>`;
  }

  function dailyWord() {
    const dayIndex = Math.floor(Date.now() / 86400000) % DATA.dailyWords.length;
    return DATA.dailyWords[dayIndex];
  }

  function weekDots() {
    const days = lastSevenDays();
    const labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    return `<div class="week-dots" aria-hidden="true">
      ${days.map((d, i) => {
        const active = state.activity[dateKey(d)] > 0;
        const today = dateKey(d) === dateKey();
        return `<span class="week-day ${active ? 'is-done' : ''} ${today ? 'is-today' : ''}"><i>${labels[d.getDay()]}</i><b>${d.getDate()}</b></span>`;
      }).join('')}
    </div>`;
  }

  function heroTiles() {
    return `<svg class="hero-tiles" viewBox="0 0 600 420" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="az-tile" width="84" height="84" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="rgba(248,240,226,.16)" stroke-width="1.1">
            <circle cx="42" cy="42" r="25"/>
            <path d="M42 3c7 18 21 32 39 39-18 7-32 21-39 39-7-18-21-32-39-39 18-7 32-21 39-39z"/>
            <path d="M0 0h84v84H0z"/>
            <circle cx="0" cy="0" r="5" fill="rgba(248,240,226,.16)" stroke="none"/>
            <circle cx="84" cy="84" r="5" fill="rgba(248,240,226,.16)" stroke="none"/>
          </g>
        </pattern>
        <radialGradient id="hero-glow" cx="72%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#e8b25b" stop-opacity=".22"/>
          <stop offset="100%" stop-color="#e8b25b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="600" height="420" fill="url(#az-tile)"/>
      <rect width="600" height="420" fill="url(#hero-glow)"/>
    </svg>`;
  }

  function tramArt() {
    return `<svg class="tram-art" viewBox="0 0 620 430" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tramSun" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#f1c777"/><stop offset="1" stop-color="#dfa74b"/>
        </linearGradient>
        <linearGradient id="tramBody" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#f7e9c8"/><stop offset="1" stop-color="#e9ce9d"/>
        </linearGradient>
      </defs>
      <circle cx="483" cy="100" r="108" fill="#e8b25b" opacity=".09"/>
      <circle cx="483" cy="100" r="65" fill="url(#tramSun)" opacity=".95"/>
      <g stroke="#f7eede" stroke-width="1.5" opacity=".34">
        <path d="M483 8v20M483 172v20M391 100h20M555 100h20M418 35l14 14M534 151l14 14M548 35l-14 14M432 151l-14 14"/>
      </g>
      <g opacity=".38" stroke="#f7eede" stroke-width="1.7">
        <path d="M40 279v-87l49-37 49 37v87"/>
        <path d="M113 279v-56l31-25 31 25v56"/>
        <path d="M80 192l-5-23h30l-7 23"/>
        <path d="M196 279v-61l38-29 38 29v61"/>
        <path d="M170 279v-37l22-17 22 17v37"/>
        <path d="M284 279v-40h31v40"/>
      </g>
      <g opacity=".5" stroke="#f7eede" stroke-width="2">
        <path d="M20 331c79-24 134-25 196-10 56 13 105 17 169 2 64-15 121-11 201 15"/>
        <path d="M34 356c78-23 137-24 196-10 61 14 112 16 171 2 68-16 121-8 179 12"/>
      </g>
      <g transform="translate(274 132)">
        <path d="M49 23h93" stroke="#f7eede" stroke-width="2" opacity=".7"/>
        <path d="M70 23l20-19 31 19" stroke="#f7eede" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
        <path d="M18 42h170a8 8 0 0 1 8 8v145a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V50a8 8 0 0 1 8-8z" fill="url(#tramBody)"/>
        <path d="M20 34h166l10 17H10l10-17z" fill="#f7eede"/>
        <rect x="23" y="58" width="68" height="57" rx="4" fill="#173f4e"/>
        <rect x="99" y="58" width="68" height="57" rx="4" fill="#173f4e"/>
        <path d="M57 58v57M133 58v57" stroke="#f7eede" stroke-width="1.2" opacity=".4"/>
        <rect x="23" y="126" width="39" height="58" rx="3" fill="#c46745"/>
        <rect x="70" y="126" width="54" height="58" rx="3" fill="#173f4e"/>
        <rect x="132" y="126" width="35" height="58" rx="3" fill="#173f4e" opacity=".72"/>
        <text x="97" y="165" fill="#f7eede" font-family="Georgia, serif" font-size="27" text-anchor="middle">28</text>
        <circle cx="44" cy="201" r="15" fill="#0f2f3b" stroke="#f7eede" stroke-width="3"/>
        <circle cx="160" cy="201" r="15" fill="#0f2f3b" stroke="#f7eede" stroke-width="3"/>
        <circle cx="44" cy="201" r="4" fill="#e8b25b"/>
        <circle cx="160" cy="201" r="4" fill="#e8b25b"/>
        <path d="M9 173h188" stroke="#c46745" stroke-width="4"/>
      </g>
      <g stroke="#f7eede" stroke-width="2" stroke-linecap="round" opacity=".55">
        <path d="M333 68c7-7 14-7 21 0M364 82c6-6 12-6 18 0"/>
        <path d="M450 222c6-6 12-6 18 0M476 210c5-5 10-5 15 0"/>
      </g>
      <path d="M0 405c96-31 190-36 292-20 114 18 213 23 328-12v57H0z" fill="#0f2f3b" opacity=".5"/>
      <g opacity=".7" fill="#f7eede">
        <circle cx="52" cy="385" r="2.4"/><circle cx="74" cy="377" r="2"/><circle cx="96" cy="386" r="3"/>
        <circle cx="553" cy="365" r="2.2"/><circle cx="575" cy="355" r="1.6"/>
      </g>
    </svg>`;
  }

  function tileArt(article, index, large) {
    const fallback = { a1: 'pt-PT', a2: 'sh', a3: 'bica', a4: 'tu', a5: 'a', a6: 'saudade', a7: 'mesa' };
    return `<div class="tile-art art-${(index % 7) + 1} ${large ? 'is-large' : ''}">
      <svg viewBox="0 0 300 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="rgba(255,250,240,.22)" stroke-width="1.2">
          <circle cx="42" cy="36" r="24"/><circle cx="258" cy="164" r="38"/>
          <path d="M42 12c7 17 19 29 36 36-17 7-29 19-36 36-7-17-19-29-36-36 17-7 29-19 36-36z"/>
          <path d="M150 0v200M0 100h300" opacity=".35"/>
          <path d="M75 0v200M225 0v200" opacity=".15"/>
        </g>
      </svg>
      <span class="art-kicker">${esc(article.kicker)}</span>
      <span class="art-word">${esc(article.artWord || fallback[article.id] || 'olá')}</span>
      <span class="art-index">${String(index + 1).padStart(2, '0')}</span>
    </div>`;
  }

  /* ------------------------------------------------------------------ */
  /* Home                                                               */
  /* ------------------------------------------------------------------ */

  function renderHome() {
    const next = nextLesson();
    const xp = todayXP();
    const goal = Number(state.goal) || 40;
    const remaining = Math.max(0, goal - xp);
    const pct = goal ? Math.min(1, xp / goal) : 0;
    const word = dailyWord();
    const completed = completedCount();
    const newUser = completed === 0;
    const coursePct = allLessons.length ? Math.round(completed / allLessons.length * 100) : 0;
    const selectedLevelId = ui.courseLevel || (next ? next.unit.level : 'A1') || 'A1';
    const selectedLevel = levelMeta(selectedLevelId);
    const levelUnits = DATA.units.filter(u => u.level === selectedLevelId);
    const levelLessons = lessonsForLevel(selectedLevelId);
    const levelDone = levelLessons.filter(l => state.lessons[l.id]).length;
    const levelMedia = DATA.media.filter(item => item.level === selectedLevelId);

    const heroLesson = nextLessonForLevel(selectedLevelId) || next;
    const unit = heroLesson ? heroLesson.unit : null;
    const doneInUnit = unit && unit.lessons ? unit.lessons.filter(l => state.lessons[l.id]).length : 0;
    const heroTitle = heroLesson
      ? (newUser ? 'Diz <em>olá</em> ao português.' : (next && heroLesson.id === next.id ? 'Continua a tua viagem.' : 'Explora outro nível.'))
      : 'O curso está completo.';
    const heroBody = heroLesson
      ? (newUser
        ? '从第一句问候开始。六个级别，从 A1 到 C2，配情景视频、音频对话和五语词汇。'
        : `下一站：<b>${esc(heroLesson.title)}</b>。${esc(heroLesson.goal)}。`)
      : `你已经走完全部 ${allLessons.length} 节课。现在，去复习、去听、去和真实的世界说葡语。`;
    const cta = heroLesson ? (newUser ? '开始第一课' : '继续学习') : '去复习';
    const action = heroLesson ? 'start-lesson' : 'start-review';

    const unitsHTML = levelUnits.map(unitCard).join('');
    const selectedLevelDonePct = levelLessons.length ? Math.round(levelDone / levelLessons.length * 100) : 0;

    $('#view').innerHTML = `
      <div class="home">
        <div class="home-grid">
          <section class="hero-card">
            ${heroTiles()}
            <div class="hero-copy">
              <span class="eyebrow light"><span class="eyebrow-dot"></span>${heroLesson ? (heroLesson.isLab ? `PRÁTICA · ${unit.level}` : `A TUA PRÓXIMA LIÇÃO · ${unit.level} · UNIDADE ${pad(unit.order)}`) : 'PARABÉNS · CURSO COMPLETO'}</span>
              <h1>${heroTitle}</h1>
              <p>${heroBody}</p>
              <div class="hero-actions">
                <button class="btn btn-gold" data-action="${action}" ${heroLesson ? `data-id="${heroLesson.id}"` : ''}>
                  ${cta} ${icon('arrow-right')}
                </button>
                <button class="btn btn-ghost-light" data-action="scroll-course">Ver o percurso</button>
              </div>
              <div class="hero-meta">
                <span>${heroLesson ? (heroLesson.isLab ? `${unit.level} · LABORATÓRIO DE PRÁTICA` : `${unit.level} · UNIDADE ${pad(unit.order)} · ${esc(unit.title)}`) : `${allLessons.length} LIÇÕES CONCLUÍDAS`}</span>
                <span class="hero-meta-line"></span>
                <span>${heroLesson ? (heroLesson.isLab ? '5 exercícios · +15 XP' : `${doneInUnit} / ${unit.lessons.length} lições`) : `${coursePct}% do curso`}</span>
              </div>
            </div>
            <div class="hero-art">${tramArt()}</div>
          </section>

          <aside class="home-side">
            <section class="goal-card">
              <div class="card-label">${icon('target')} A TUA META</div>
              <div class="goal-main">
                <div class="ring-wrap">
                  ${ring(pct, 122, 8, pct >= 1 ? 'var(--success)' : 'var(--gold)', 'var(--line)')}
                  <div class="ring-center"><strong>${xp}</strong><span>/ ${goal} XP</span></div>
                </div>
                <div class="goal-copy">
                  <strong>${pct >= 1 ? 'Meta alcançada!' : remaining === 1 ? 'Falta 1 XP.' : `Faltam ${remaining} XP.`}</strong>
                  <p>${pct >= 1 ? 'Podes parar por aqui. Ou continuar, só porque sim.' : 'Uma lição curta chega. O importante é voltar amanhã.'}</p>
                </div>
              </div>
              ${weekDots()}
            </section>

            <section class="word-card">
              <div class="card-label">${icon('sparkle')} PALAVRA DO DIA</div>
              <div class="word-main">
                <div>
                  <div class="word-pt">${esc(word.pt)}</div>
                  <div class="word-pron">${esc(word.pron)}</div>
                  <p class="word-zh">${esc(word.zh)}</p>
                </div>
                <button class="audio-btn" data-audio="${esc(word.pt)}" aria-label="播放 ${esc(word.pt)} 的发音">${icon('volume')}</button>
              </div>
              <p class="word-note">${esc(word.note)} <span>${esc(word.exZh)}</span></p>
            </section>
          </aside>
        </div>

        <section class="course-section" id="course">
          <div class="section-head">
            <div>
              <span class="eyebrow">O TEU PERCURSO · A1 → C2</span>
              <h2>Um percurso, seis níveis.</h2>
            </div>
            <div class="section-meta">
              <span>${DATA.units.length} unidades · ${allLessons.length} lições</span>
              <span class="dot-sep"></span>
              <span>${coursePct}% concluído</span>
            </div>
          </div>

          <div class="level-tabs" role="tablist" aria-label="Escolhe o nível">
            ${LEVELS.map(level => levelTabHTML(level, selectedLevelId)).join('')}
          </div>

          <div class="level-intro level-${selectedLevel.color}">
            <div>
              <span class="level-badge level-${selectedLevel.color}">${selectedLevel.id}</span>
              <div><strong>${esc(selectedLevel.name)}</strong><span>${esc(selectedLevel.zh)} · ${levelDone} / ${levelLessons.length} lições</span></div>
            </div>
            <p>${esc(selectedLevel.blurb)}</p>
            <div class="level-ring-mini">
              ${ring(selectedLevelDonePct / 100, 54, 5, 'var(--level-ink)', 'var(--line)')}
              <span>${selectedLevelDonePct}%</span>
            </div>
          </div>

          <div class="level-media-row">
            ${levelMedia.map(mediaMiniCard).join('')}
            <button class="media-mini media-lib-link" data-action="open-media-level" data-level="${selectedLevelId}">
              <span class="media-mini-icon">${icon('video')}</span>
              <div><span class="eyebrow">TODOS OS NÍVEIS</span><strong>Biblioteca</strong><small>Vídeo & áudio · ${DATA.media.length} 个</small></div>
              ${icon('arrow-right')}
            </button>
          </div>

          <div class="unit-list">${unitsHTML}</div>
          ${practiceShelfHTML(levelLessons.filter(lesson => lesson.isLab), selectedLevel)}
        </section>

        <section class="tip-strip">
          <div class="tip-mark">sh</div>
          <div class="tip-copy">
            <span class="eyebrow">DICA DE SOTAQUE</span>
            <h3>Lisboa não é «Lis-boa».</h3>
            <p>词尾的 <b>s</b> 在葡葡里常读成 <b>sh</b>。Lisboa 听起来像「lizh-BOH-uh」，estás 像「sh-tahsh」。这是标准葡葡，不是口音。</p>
          </div>
          <button class="text-link" data-action="open-article" data-id="a2">Ler sobre o sotaque ${icon('arrow-right')}</button>
        </section>
      </div>`;
    document.title = 'Azulejo · Aprender português europeu';
    requestAnimationFrame(() => $('#view').classList.add('is-ready'));
  }

  function levelTabHTML(level, active) {
    const lessons = lessonsForLevel(level.id);
    const done = lessons.filter(l => state.lessons[l.id]).length;
    const pct = lessons.length ? Math.round(done / lessons.length * 100) : 0;
    const units = level.units.length;
    return `<button class="level-tab level-${level.color} ${level.id === active ? 'is-active' : ''}" data-action="select-level" data-level="${level.id}" role="tab" aria-selected="${level.id === active}">
      <span class="level-tab-top"><b>${level.id}</b><span>${done}/${lessons.length}</span></span>
      <strong>${esc(level.name)}</strong>
      <small>${units} ${units === 1 ? 'unidade' : 'unidades'} · ${lessons.length} lições</small>
      <span class="level-tab-bar"><i style="width:${pct}%"></i></span>
    </button>`;
  }

  function mediaMiniCard(item) {
    if (!item) return '';
    const done = state.media[item.id];
    return `<a class="media-mini ${item.type} ${done ? 'is-done' : ''}" href="#/media/${item.id}">
      <span class="media-mini-icon">${icon(item.type === 'video' ? 'play' : 'volume')}</span>
      <div>
        <span class="eyebrow">${item.type === 'video' ? 'VÍDEO-CENA' : 'DIÁLOGO ÁUDIO'}</span>
        <strong>${esc(item.title)}</strong>
        <small>${item.minutes} min · ${esc(item.zh)}</small>
      </div>
      <span class="media-mini-status">${done ? icon('check') : icon('arrow-right')}</span>
    </a>`;
  }

  function practiceShelfHTML(labs, level) {
    if (!labs.length) return '';
    const done = labs.filter(lab => state.lessons[lab.id]).length;
    return `<section class="practice-section">
      <div class="practice-head">
        <div>
          <span class="eyebrow">PRÁTICA DELIBERADA · ${level.id}</span>
          <h2>Laboratório de prática.</h2>
          <p>核心课之后的短练习：听辨、配对、造句、翻译和对话。每一节都是一次完整的 5 题训练。</p>
        </div>
        <div class="practice-count"><strong>${done}</strong><span>/ ${labs.length} práticas</span></div>
      </div>
      <div class="practice-grid">
        ${labs.map((lab, i) => {
          const record = state.lessons[lab.id];
          return `<button class="practice-tile ${record ? 'is-done' : ''}" data-action="start-lesson" data-id="${lab.id}">
            <span class="practice-tile-top"><span class="practice-focus">${icon(lab.focusIcon)} ${esc(lab.focusTitle)}</span><span class="practice-status">${record ? icon('check') : icon('play')}</span></span>
            <strong>${pad(i + 1)} · ${esc(lab.title)}</strong>
            <span class="practice-words">${esc(lab.zh)} · ${lab.vocab.slice(0, 2).map(w => esc(w.pt)).join(' · ')}</span>
            <span class="practice-meta"><span>5 exercícios</span><span>+${lab.xp} XP</span></span>
          </button>`;
        }).join('')}
      </div>
    </section>`;
  }

  function unitCard(unit) {
    const done = unit.lessons.filter(l => state.lessons[l.id]).length;
    const pct = unit.lessons.length ? done / unit.lessons.length : 0;
    const next = nextLessonForLevel(unit.level);
    return `<article class="unit-card theme-${unit.color}">
      <div class="unit-info">
        <div class="unit-heading">
          <span class="unit-number">${pad(unit.order)}</span>
          <div>
            <span class="unit-kicker">${unit.level} · UNIDADE ${pad(unit.order)} · ${unit.lessons.length} LIÇÕES</span>
            <h3>${esc(unit.title)}</h3>
            <p class="unit-zh">${esc(unit.zh)}</p>
          </div>
        </div>
        <p class="unit-blurb">${esc(unit.blurb)}</p>
        <div class="unit-progress-row">
          <div class="unit-progress"><span style="width:${pct * 100}%"></span></div>
          <span>${done} / ${unit.lessons.length}</span>
        </div>
      </div>
      <div class="lesson-tiles">
        ${unit.lessons.map((lesson, i) => {
          const record = state.lessons[lesson.id];
          const isNext = next && next.id === lesson.id;
          return `<button class="lesson-tile ${record ? 'is-done' : ''} ${isNext ? 'is-next' : ''}" data-action="start-lesson" data-id="${lesson.id}">
            <span class="lesson-tile-top">
              <span class="lesson-order">LIÇÃO ${pad(i + 1)}</span>
              <span class="lesson-status">${record ? icon('check') : isNext ? icon('play') : icon('arrow-right')}</span>
            </span>
            <strong>${esc(lesson.title)}</strong>
            <span class="lesson-zh">${esc(lesson.zh)}</span>
            <span class="lesson-meta"><span>${icon('clock')} ${lesson.minutes} min</span><span>${record ? `${record.best || 0}%` : `+${lesson.xp} XP`}</span></span>
          </button>`;
        }).join('')}
      </div>
    </article>`;
  }

  /* ------------------------------------------------------------------ */
  /* Lesson                                                              */
  /* ------------------------------------------------------------------ */

  function coreLessonFor(lesson) {
    if (!lesson || !lesson.isLab) return lesson;
    const firstWord = lesson.vocab && lesson.vocab[0] ? lesson.vocab[0].id : null;
    return coreLessons.find(item => item.vocab.some(word => word.id === firstWord))
      || coreLessons.find(item => item.title === lesson.title)
      || lesson;
  }

  function grammarForLesson(lesson) {
    return lesson.grammar || (coreLessonFor(lesson) && coreLessonFor(lesson).grammar) || null;
  }

  function grammarExtraFor(lesson) {
    const core = coreLessonFor(lesson);
    return GRAMMAR_EXTRA[core.id] || GRAMMAR_EXTRA[lesson.id] || null;
  }

  function lessonSteps(lesson) {
    const steps = [{ kind: 'vocab', words: lesson.vocab }];
    const grammar = grammarForLesson(lesson);
    if (grammar) steps.push({ kind: 'grammar', grammar });
    const extra = grammarExtraFor(lesson);
    if (extra && Array.isArray(extra.exercises)) {
      extra.exercises.forEach(ex => steps.push({ kind: 'exercise', ex: { ...ex, type: 'choice' }, isGrammar: true }));
    }
    if (window.AZ_BUILD_IMMERSION) {
      steps.push({
        kind: 'immersion',
        pack: window.AZ_BUILD_IMMERSION({ lesson, units: DATA.units, media: DATA.media })
      });
    }
    lesson.exercises.forEach(ex => steps.push({ kind: 'exercise', ex }));
    return steps;
  }

  function startLesson(lesson, options = {}) {
    const steps = lessonSteps(lesson);
    const startIndex = options.startAt === 'immersion'
      ? Math.max(0, steps.findIndex(step => step.kind === 'immersion'))
      : 0;
    ui.lesson = {
      id: lesson.id,
      lesson,
      steps,
      index: startIndex,
      correct: 0,
      mistakes: 0,
      answered: false,
      wasCorrect: false,
      accentWarning: false,
      feedback: '',
      done: false,
      directReading: Boolean(options.startAt),
      stepState: null,
      immState: { answers: {}, speaking: null }
    };
    setupLessonStep();
    renderLesson();
  }

  function setupLessonStep() {
    const lesson = ui.lesson;
    const step = lesson.steps[lesson.index];
    lesson.answered = false;
    lesson.wasCorrect = false;
    lesson.accentWarning = false;
    lesson.feedback = '';
    if (step && step.kind === 'immersion') {
      lesson.immState = { answers: {}, speaking: null };
    }
    let stepState = null;
    if (step && step.kind === 'exercise') {
      const ex = step.ex;
      if (ex.type === 'choice') stepState = { options: shuffle(ex.options), selected: null, input: '' };
      if (ex.type === 'listen') stepState = { options: shuffle(ex.options), selected: null, input: '' };
      if (ex.type === 'type') stepState = { input: '', selected: null };
      if (ex.type === 'arrange') {
        stepState = {
          bank: shuffle(ex.tokens.map((text, i) => ({ id: i, text }))),
          arranged: [],
          selected: null,
          input: ''
        };
      }
      if (ex.type === 'match') {
        const pairs = ex.pairs.map((p, i) => ({ id: i, pt: p[0], zh: p[1] }));
        stepState = {
          left: shuffle(pairs),
          right: shuffle(pairs),
          selected: null,
          solved: [],
          wrong: null,
          matchMistakes: 0,
          selectedRight: null
        };
      }
    }
    lesson.stepState = stepState;
  }

  function currentLessonStep() {
    return ui.lesson ? ui.lesson.steps[ui.lesson.index] : null;
  }

  function lessonProgressHTML() {
    const lesson = ui.lesson;
    return lesson.steps.map((step, i) => `<span class="lesson-seg ${i < lesson.index ? 'is-done' : ''} ${i === lesson.index ? 'is-current' : ''}"><i></i></span>`).join('');
  }

  function canCheck() {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!step || step.kind !== 'exercise' || lesson.answered) return false;
    const ex = step.ex;
    const st = lesson.stepState;
    if (ex.type === 'choice' || ex.type === 'listen') return st.selected !== null;
    if (ex.type === 'type') return st.input.trim().length > 0;
    if (ex.type === 'arrange') return st.arranged.length === ex.tokens.length;
    return false;
  }

  function renderLesson() {
    if (!ui.lesson) return;
    const lesson = ui.lesson;
    if (lesson.done) return renderLessonResult();
    const current = lesson.steps[lesson.index];
    const label = current.kind === 'vocab' ? 'NOVAS PALAVRAS' : current.kind === 'grammar' ? 'A LÍNGUA' : 'PRATICA';
    const foot = lessonFooterHTML();
    $('#view').innerHTML = `
      <div class="lesson-shell">
        <header class="lesson-topbar">
          <button class="close-btn" data-action="leave-lesson" aria-label="退出课程">${icon('x')}</button>
          <div class="lesson-segs" role="progressbar" aria-label="课程进度" aria-valuemin="0" aria-valuemax="${lesson.steps.length}" aria-valuenow="${lesson.index + 1}">${lessonProgressHTML()}</div>
          <span class="xp-badge">${icon('star')} +${lesson.lesson.xp} XP</span>
        </header>
        <div class="lesson-scroll" id="lesson-scroll">
          <div class="lesson-body" id="lesson-body">
            ${current.kind === 'vocab' ? vocabStepHTML(current.words) : current.kind === 'grammar' ? grammarStepHTML(current.grammar) : current.kind === 'immersion' ? immersionStepHTML(current.pack) : exerciseHTML(current.ex)}
          </div>
        </div>
        ${foot}
      </div>`;
    document.title = `${lesson.lesson.title} · Azulejo`;
    const body = $('#lesson-body');
    if (body) {
      body.classList.add('step-enter');
      setTimeout(() => body.classList.remove('step-enter'), 320);
    }
  }

  function immersionQuestionHTML(question, state) {
    const chosen = state.answers[question.key];
    const options = question.options.map(option => {
      let cls = '';
      if (chosen) {
        if (option === question.answer) cls = 'is-correct';
        else if (option === chosen.value) cls = 'is-wrong';
      }
      return `<button class="immersion-option ${cls}" data-action="immersion-answer" data-key="${question.key}" data-value="${esc(option)}" ${chosen ? 'disabled' : ''}>${esc(option)}</button>`;
    }).join('');
    const feedback = chosen
      ? `<p class="immersion-feedback ${chosen.correct ? 'is-ok' : 'is-bad'}">${chosen.correct ? 'Boa!' : `A resposta certa é «${esc(question.answer)}».`} ${esc(question.explain)}</p>`
      : '';
    return `<div class="immersion-question">
      <p class="immersion-q">${esc(question.q)}</p>
      <div class="immersion-options">${options}</div>
      ${feedback}
    </div>`;
  }

  function readingSceneCategory(scene) {
    const text = String(scene || '').toLowerCase();
    if (/café|pastelaria|esplanada|padaria/.test(text)) return 'cafe';
    if (/mercado|peixaria|talho|loja|supermercado|compras|provador/.test(text)) return 'market';
    if (/saúde|farmácia|médic|consulta|dentista|hospital|clínica/.test(text)) return 'clinic';
    if (/reunião|escritório|empresa|redação|jornal|entrevista|conferência|aula|universidade/.test(text)) return 'office';
    if (/junta|moradores|parlamento|assembleia|debate|auditório|tribuna/.test(text)) return 'meeting';
    if (/livraria|biblioteca|museu|livro|poesia/.test(text)) return 'bookshop';
    if (/comboio|elétrico|estação|aeroporto|metro|autocarro|paragem/.test(text)) return 'station';
    if (/praia|litoral|mar|porto|barco|ilha/.test(text)) return 'coast';
    if (/fado|cinema|teatro|música|filme/.test(text)) return 'culture';
    if (/casa|quarto|cozinha|sala|varanda|jardim|infância|família/.test(text)) return 'home';
    return 'studio';
  }

  const READING_PHOTOS = {
    cafe: { src: 'assets/photos/cafe.jpg', alt: 'Pastéis de Belém em Lisboa', credit: 'Yusuke Kawasaki · CC BY 2.0' },
    market: { src: 'assets/photos/market.jpg', alt: 'Mercado da Ribeira em Lisboa', credit: 'Simon Burchell · CC BY-SA 4.0' },
    clinic: { src: 'assets/photos/pharmacy.jpg', alt: 'Museu da Farmácia em Lisboa', credit: 'Jorge Franganillo · CC BY 2.0' },
    office: { src: 'assets/photos/office.jpg', alt: 'Parque das Nações, zona de escritórios em Lisboa', credit: 'Jules Verne Times Two · CC BY-SA 4.0' },
    meeting: { src: 'assets/photos/meeting.jpg', alt: 'Assembleia da República em Lisboa', credit: 'MarcoMileu · CC BY-SA 3.0' },
    bookshop: { src: 'assets/photos/bookshop.jpg', alt: 'Livraria Bertrand no Chiado, Lisboa', credit: 'Hugo Ferreira · CC BY-SA 4.0' },
    station: { src: 'assets/photos/tram.jpg', alt: 'Elétrico 28 em Lisboa', credit: 'Jules Verne Times Two · CC BY-SA 4.0' },
    coast: { src: 'assets/photos/coast.jpg', alt: 'Torre de Belém e o Tejo, Lisboa', credit: 'Alvesgaspar · CC BY-SA 3.0' },
    culture: { src: 'assets/photos/fado.jpg', alt: 'Fado numa casa de fados em Lisboa', credit: 'Vernaccia · CC BY 2.0' },
    home: { src: 'assets/photos/azulejo.jpg', alt: 'Fachada com azulejos em Lisboa', credit: 'NorbertNagel · CC BY-SA 4.0' },
    studio: { src: 'assets/photos/studio.jpg', alt: 'Praça do Comércio em Lisboa', credit: 'Berthold Werner · CC BY-SA 4.0' }
  };

  function readingPhoto(scene) {
    return READING_PHOTOS[readingSceneCategory(scene)] || READING_PHOTOS.studio;
  }

  const GLOSSARY_GROUPS = [
    ['noun', 'Substantivos', '名词'],
    ['verb', 'Verbos', '动词'],
    ['adjective', 'Adjetivos', '形容词'],
    ['adverb', 'Advérbios', '副词'],
    ['phrase', 'Expressões', '短语']
  ];
  const GLOSSARY_SKIP = new Set('a o as os de do da dos das em no na nos nas um uma uns umas que e é foi ser com por para se mas mais como ao aos à às ou já muito muita'.split(' '));

  function glossaryForLesson(lesson, text) {
    const sourceText = text || (lesson.vocab || []).map(word => word.ex).join(' ');
    const haystack = ` ${accentFold(sourceText).replace(/[^\p{L}\p{N} ]/gu, ' ')} `;
    const picked = [];
    const seen = new Set();
    const add = word => {
      if (!word || seen.has(word.id)) return;
      const key = accentFold(word.pt || '').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
      if (!key || key.length < 3) return;
      seen.add(word.id);
      picked.push({
        id: word.id,
        pt: word.pt,
        zh: word.zh,
        en: word.en || '',
        pos: word.pos || 'phrase',
        pron: word.pron || (window.AZ_PHONETIC ? window.AZ_PHONETIC(word.pt) : '')
      });
    };
    (lesson.vocab || []).forEach(add);
    const candidates = allVocab.filter(word => {
      const key = accentFold(word.pt || '').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
      if (!key || key.length < 3 || GLOSSARY_SKIP.has(key)) return false;
      if (key.includes(' ')) return haystack.includes(` ${key} `);
      return new RegExp(`(^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s)`, 'u').test(haystack);
    });
    candidates.forEach(add);
    return picked.slice(0, 12);
  }

  function glossaryHTML(lesson, text) {
    const words = glossaryForLesson(lesson, text);
    if (!words.length) return '';
    const groups = GLOSSARY_GROUPS.map(([pos, pt, zh]) => {
      const list = words.filter(word => word.pos === pos);
      if (!list.length) return '';
      return `<div class="glossary-group"><h3>${pt} <span>${zh}</span></h3>
        ${list.map(word => `<div class="glossary-row">
          <div class="glossary-word"><b>${esc(word.pt)}</b><small>[${esc(word.pron)}]</small><button class="audio-mini" data-audio="${esc(word.pt)}" aria-label="Ouvir ${esc(word.pt)}">${icon('volume')}</button></div>
          <span class="glossary-zh">${esc(word.zh)}</span>
          <span class="glossary-en">${esc(word.en)}</span>
        </div>`).join('')}</div>`;
    }).join('');
    return `<section class="reading-glossary">
      <div class="reading-glossary-head"><div><span class="eyebrow">VOCABULÁRIO DO TEXTO</span><h2>Palavras novas</h2><p>按词性分类：葡语 · 中文 · English · 发音。</p></div><span class="glossary-count">${words.length} palavras</span></div>
      <div class="glossary-groups">${groups}</div>
    </section>`;
  }

  function immersionStepHTML(pack) {
    const state = ui.lesson.immState || { answers: {}, speaking: null };
    const speaking = state.speaking;
    const media = pack.media;
    const speakingResult = !speaking
      ? '<p class="immersion-speaking-hint">Ouve primeiro. Depois repete a frase em voz alta.</p>'
      : speaking.listening
        ? '<p class="immersion-speaking-result is-listening">A ouvir… fala agora.</p>'
        : speaking.error
          ? `<p class="immersion-speaking-result is-bad">Não consegui ouvir. ${esc(speaking.error === 'not-allowed' ? 'Permite o microfone no navegador.' : 'Tenta outra vez.')}</p>`
          : speaking.manual
            ? '<p class="immersion-speaking-result is-ok">Boa. Continua a praticar em voz alta.</p>'
            : `<p class="immersion-speaking-result ${speaking.score >= 70 ? 'is-ok' : 'is-bad'}">${speaking.score >= 70 ? 'Boa pronúncia!' : 'Quase.'} ${speaking.score}% · ouvi: «${esc(speaking.heard)}»</p>`;

    return `<section class="step step-immersion">
      <div class="step-head">
        <div>
          <span class="eyebrow">LEITURA & ESCUTA · ${esc(pack.level)}</span>
          <h1>Lê, ouve, fala.</h1>
          <p>Um texto curto desta cena e um diálogo do nível. Lê, ouve outra vez e repete uma fala.</p>
          <div class="immersion-meta"><span>${esc(pack.examLabel)}</span><span>${pack.wordCount || pack.lines.length} ${pack.wordCount ? 'palavras' : 'palavras-alvo'}</span><span>${esc(pack.grammarTitle)}</span></div>
        </div>
        <span class="step-count">${pad(ui.lesson.index + 1)}<small>/ ${pad(ui.lesson.steps.length)}</small></span>
      </div>

      <div class="immersion-layout">
        <article class="immersion-reading">
          <div class="immersion-panel-top">
            <div><span class="eyebrow light">LEITURA</span><h2>${esc(pack.scene)}</h2></div>
            <button class="audio-btn small" data-action="immersion-play" data-kind="reading" aria-label="Ouvir o texto completo">${icon('volume')}</button>
          </div>
          <figure class="immersion-figure">
            <img class="immersion-photo" src="${readingPhoto(pack.scene).src}" alt="${esc(readingPhoto(pack.scene).alt)}" loading="eager">
            <figcaption><span>${esc(pack.level)} · ${esc(pack.scene)}</span><b>${esc(pack.sceneZh)}</b><small>${esc(readingPhoto(pack.scene).credit)} · Wikimedia Commons</small></figcaption>
          </figure>
          ${pack.text
            ? `${pack.textTitle && pack.textTitle !== pack.scene ? `<h3 class="immersion-text-title">${esc(pack.textTitle)}</h3>` : ''}
               <div class="immersion-prose">${pack.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div>`
            : `<p class="immersion-intro">${esc(pack.intro)}</p>
               <div class="immersion-dialogue">
                 ${pack.lines.map((line, i) => `<div class="immersion-line">
                   <span class="immersion-speaker">${esc(line.speaker)}</span>
                   <div class="immersion-line-copy">
                     <p>${esc(line.pt)}</p>
                     <small>${esc(line.zh)}</small>
                   </div>
                   <button class="audio-mini" data-audio="${esc(line.pt)}" aria-label="Ouvir esta fala">${icon('volume')}</button>
                 </div>`).join('')}
               </div>`}
          ${glossaryHTML(ui.lesson.lesson, pack.text || pack.lines.map(line => line.pt).join(' '))}
          <div class="immersion-questions">
            ${pack.readingQuestions.map(q => immersionQuestionHTML(q, state)).join('')}
          </div>
        </article>

        <aside class="immersion-side">
          <section class="immersion-listen">
            <div class="immersion-panel-top">
              <div><span class="eyebrow light">ESCUTA · ${esc(pack.level)}</span><h3>${esc(pack.listeningTitle)}</h3></div>
              <button class="audio-btn small" data-action="immersion-play" data-kind="listening" aria-label="Ouvir o diálogo">${icon('play')}</button>
            </div>
            <p class="immersion-hint">${pack.text ? `Ouve o texto completo (${pack.wordCount} palavras) e responde.` : `Ouve o diálogo do nível ${esc(pack.level)} e responde.`}</p>
            ${media ? `<a class="immersion-media-link" href="#/media/${esc(media.id)}" target="_blank" rel="noopener noreferrer">${icon(media.type === 'video' ? 'video' : 'volume')} Abrir ${media.type === 'video' ? 'vídeo' : 'áudio'} completo · ${esc(media.title)} ${icon('arrow-right')}</a>` : ''}
            ${pack.listeningQuestions.map(q => immersionQuestionHTML(q, state)).join('')}
          </section>

          <section class="immersion-speak">
            <span class="eyebrow light">FALA</span>
            <h3>${pack.speakingLine.fromText ? 'Repete esta frase.' : `Repete a fala de ${esc(pack.speakingLine.speaker || 'B')}.`}</h3>
            <blockquote>${esc(pack.speakingLine.pt)}</blockquote>
            ${pack.speakingLine.zh ? `<p class="immersion-speak-zh">${esc(pack.speakingLine.zh)}</p>` : ''}
            <div class="immersion-speak-actions">
              <button class="audio-btn small" data-audio="${esc(pack.speakingLine.pt)}" aria-label="Ouvir a fala">${icon('volume')}</button>
              <button class="btn btn-primary small" data-action="speak-immersion">${icon('mic')} Falar</button>
              <button class="immersion-mark" data-action="mark-spoken">Já repeti</button>
            </div>
            <div aria-live="polite">${speakingResult}</div>
          </section>

        </aside>
      </div>
    </section>`;
  }

  function refreshImmersion() {
    const step = currentLessonStep();
    const body = $('#lesson-body');
    if (!body || !step || step.kind !== 'immersion') return;
    body.innerHTML = immersionStepHTML(step.pack);
  }

  function answerImmersion(key, value) {
    const step = currentLessonStep();
    if (!step || step.kind !== 'immersion') return;
    const question = [...step.pack.readingQuestions, ...step.pack.listeningQuestions].find(item => item.key === key);
    if (!question || ui.lesson.immState.answers[key]) return;
    ui.lesson.immState.answers[key] = { value, correct: value === question.answer };
    refreshImmersion();
  }

  function markSpoken() {
    if (!ui.lesson) return;
    ui.lesson.immState.speaking = { manual: true };
    refreshImmersion();
  }

  function startShadowing() {
    const step = currentLessonStep();
    if (!step || step.kind !== 'immersion') return;
    const target = step.pack.speakingLine.pt;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      showToast('Este navegador não tem reconhecimento de fala. Ouve e repete em voz alta.', 'warn');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'pt-PT';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      ui.lesson.immState.speaking = { listening: true };
      refreshImmersion();
    };
    recognition.onerror = event => {
      ui.lesson.immState.speaking = { error: event.error || 'audio' };
      refreshImmersion();
    };
    recognition.onresult = event => {
      const heard = event.results[0][0].transcript || '';
      const targetWords = normalizeAnswer(target).split(' ').filter(Boolean);
      const heardWords = new Set(normalizeAnswer(heard).split(' ').filter(Boolean));
      const matched = targetWords.filter(word => heardWords.has(word)).length;
      const score = Math.round((matched / Math.max(1, targetWords.length)) * 100);
      ui.lesson.immState.speaking = { heard, score };
      refreshImmersion();
    };
    recognition.onend = () => {
      const state = ui.lesson.immState.speaking;
      if (state && state.listening) {
        state.listening = false;
        state.error = 'no-speech';
        refreshImmersion();
      }
    };
    try {
      recognition.start();
    } catch (err) {
      ui.lesson.immState.speaking = { error: 'audio' };
      refreshImmersion();
    }
  }

  function vocabStepHTML(words) {
    const isLab = ui.lesson && ui.lesson.lesson.isLab;
    return `<section class="step step-vocab">
      <div class="step-head">
        <div>
          <span class="eyebrow">${isLab ? 'REVISÃO ATIVA' : 'NOVAS PALAVRAS'} · ${words.length}</span>
          <h1>${isLab ? 'Revê, ouve, repara.' : 'Ouve, repete, guarda.'}</h1>
          <p>${isLab ? '这些词来自本级别的核心课。先快速过一遍，再用五道题把它们重新叫醒。' : '先听一遍，再跟着读。别急着记住拼写，先让耳朵熟悉节奏。'}</p>
        </div>
        <span class="step-count">${pad(ui.lesson.index + 1)}<small>/ ${pad(ui.lesson.steps.length)}</small></span>
      </div>
      <div class="vocab-grid">
        ${words.map(word => `<article class="word-tile">
          <div class="word-tile-top">
            <button class="audio-btn small" data-audio="${esc(word.pt)}" aria-label="播放 ${esc(word.pt)} 的发音">${icon('volume')}</button>
            <span class="pron">${esc(word.pron)}</span>
          </div>
          <h2>${esc(word.pt)}</h2>
          <p class="word-zh">${esc(word.zh)}</p>
          <div class="word-langs">
            <span><b>EN</b>${esc(word.en)}</span>
            <span><b>FR</b>${esc(word.fr)}</span>
            <span><b>ES</b>${esc(word.es)}</span>
          </div>
          <div class="word-example">
            <button class="audio-mini" data-audio="${esc(word.ex)}" aria-label="播放例句">${icon('volume')}</button>
            <div><span>${esc(word.ex)}</span><small>${esc(word.exZh)}</small></div>
          </div>
          ${word.note ? `<p class="word-tip">${esc(word.note)}</p>` : ''}
        </article>`).join('')}
        ${words.length % 2 ? `<aside class="vocab-tip">
          <span class="eyebrow light">${isLab ? 'PRÁTICA DELIBERADA' : 'OUVE OUTRA VEZ'}</span>
          <h3>${isLab ? 'Não é repetir. É reconhecer.' : 'Deixa as palavras pousar.'}</h3>
          <p>${isLab ? '第二次遇到同一个词，应该比第一次更快。听完整组，再开始做题。' : '先别急着翻译。闭上眼睛，把这几张词卡完整听一遍，让节奏先于拼写进入耳朵。'}</p>
          <button class="btn btn-ghost-light small" data-action="play-all">${icon('play')} Ouvir as ${words.length} palavras</button>
        </aside>` : ''}
      </div>
      <p class="voice-hint">${icon('volume')} 语音由浏览器提供。可在设置中选择欧洲葡语声音。</p>
    </section>`;
  }

  function grammarStepHTML(grammar) {
    const extra = grammarExtraFor(ui.lesson.lesson) || {};
    return `<section class="step step-grammar">
      <div class="step-head">
        <div>
          <span class="eyebrow">UM SEGREDO DA LÍNGUA</span>
          <h1>${esc(grammar.title)}</h1>
          ${extra.titleEn ? `<p class="grammar-title-en">${esc(extra.titleEn)}</p>` : ''}
        </div>
        <span class="step-count">${pad(ui.lesson.index + 1)}<small>/ ${pad(ui.lesson.steps.length)}</small></span>
      </div>
      <p class="grammar-lead">${esc(grammar.body)}</p>
      ${extra.bodyEn ? `<p class="grammar-lead-en"><span>EN</span>${esc(extra.bodyEn)}</p>` : ''}
      <div class="example-stack">
        ${grammar.examples.map(ex => `<div class="example-row">
          <button class="audio-btn small" data-audio="${esc(ex.pt)}" aria-label="播放例句">${icon('volume')}</button>
          <div><strong>${esc(ex.pt)}</strong><span>${esc(ex.zh)}</span></div>
        </div>`).join('')}
      </div>
      <div class="tip-box"><span class="tip-icon">${icon('sparkle')}</span><p>${esc(grammar.tip)}${extra.tipEn ? `<small class="tip-en">${esc(extra.tipEn)}</small>` : ''}</p></div>
    </section>`;
  }

  function exerciseTypeLabel(ex) {
    if (ex.type === 'listen') return 'COMPREENSÃO ORAL';
    if (ex.type === 'type') return 'ESCREVER';
    if (ex.type === 'arrange') return 'CONSTRUIR';
    if (ex.type === 'match') return 'LIGAR';
    return 'ESCOLHER';
  }

  function exerciseHTML(ex) {
    const st = ui.lesson.stepState;
    const answered = ui.lesson.answered;
    const audioForQuestion = ex.audio || (ex.type === 'choice' && !ex.q.includes('___') && /[A-Za-zÀ-ÿ]{3}/.test(ex.q) ? ex.q : '');
    return `<section class="step step-exercise">
      <div class="step-head exercise-head">
        <span class="eyebrow">${exerciseTypeLabel(ex)}</span>
        <span class="step-count">${pad(ui.lesson.index + 1)}<small>/ ${pad(ui.lesson.steps.length)}</small></span>
      </div>
      <h1 class="exercise-title">${esc(ex.prompt)}</h1>
      <div class="exercise-stage">
        ${ex.type === 'listen' ? listenExerciseHTML(ex, st, answered) : ''}
        ${ex.type === 'choice' ? choiceExerciseHTML(ex, st, answered, audioForQuestion) : ''}
        ${ex.type === 'type' ? typeExerciseHTML(ex, st, answered) : ''}
        ${ex.type === 'arrange' ? arrangeExerciseHTML(ex, st, answered) : ''}
        ${ex.type === 'match' ? matchExerciseHTML(ex, st, answered) : ''}
      </div>
    </section>`;
  }

  function listenExerciseHTML(ex, st, answered) {
    return `<div class="listen-stage">
      <button class="listen-disc ${answered ? 'is-muted' : ''}" data-audio="${esc(ex.audio)}" aria-label="播放音频">
        <span class="listen-ripple"></span>
        ${icon('volume')}
      </button>
      <p class="listen-caption">${esc(ex.q)}</p>
      <div class="options options-listen">
        ${st.options.map((opt, i) => {
          const selected = st.selected === i;
          const correct = answered && opt === ex.answer;
          const wrong = answered && selected && opt !== ex.answer;
          return `<button class="option ${selected ? 'is-selected' : ''} ${correct ? 'is-correct' : ''} ${wrong ? 'is-wrong' : ''}" data-action="select-option" data-index="${i}" ${answered ? 'disabled' : ''}>
            <span class="option-key">${i + 1}</span><span class="option-label">${esc(opt)}</span>
            ${correct ? `<span class="option-mark">${icon('check')}</span>` : wrong ? `<span class="option-mark">${icon('x')}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
    </div>`;
  }

  function choiceExerciseHTML(ex, st, answered, audioForQuestion) {
    const hasBlank = ex.q.includes('___');
    return `<div class="question-line ${hasBlank ? 'is-blank' : ''}">
      ${audioForQuestion ? `<button class="audio-btn" data-audio="${esc(audioForQuestion)}" aria-label="播放题目">${icon('volume')}</button>` : ''}
      <p>${esc(ex.q)}</p>
    </div>
    <div class="options">
      ${st.options.map((opt, i) => {
        const selected = st.selected === i;
        const correct = answered && opt === ex.answer;
        const wrong = answered && selected && opt !== ex.answer;
        return `<button class="option ${selected ? 'is-selected' : ''} ${correct ? 'is-correct' : ''} ${wrong ? 'is-wrong' : ''}" data-action="select-option" data-index="${i}" ${answered ? 'disabled' : ''}>
          <span class="option-key">${i + 1}</span><span class="option-label">${esc(opt)}</span>
          ${correct ? `<span class="option-mark">${icon('check')}</span>` : wrong ? `<span class="option-mark">${icon('x')}</span>` : ''}
        </button>`;
      }).join('')}
    </div>`;
  }

  function typeExerciseHTML(ex, st, answered) {
    return `<div class="type-stage">
      <p class="source-sentence">「${esc(ex.q)}」</p>
      <label class="sr-only" for="type-answer">输入葡语答案</label>
      <input id="type-answer" class="type-input ${answered ? 'is-locked' : ''}" type="text" value="${esc(st.input)}" placeholder="${esc(ex.placeholder)}" autocomplete="off" autocapitalize="off" spellcheck="false" ${answered ? 'disabled' : ''}>
      ${!answered ? `<div class="accent-row" aria-label="特殊字符">
        ${['á', 'à', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ç'].map(ch => `<button type="button" class="accent-key" data-action="insert-char" data-char="${ch}">${ch}</button>`).join('')}
      </div>` : ''}
      ${ex.hint ? `<p class="exercise-hint">${icon('sparkle')} ${esc(ex.hint)}</p>` : ''}
    </div>`;
  }

  function arrangeExerciseHTML(ex, st, answered) {
    return `<div class="arrange-stage">
      <p class="source-sentence">「${esc(ex.q)}」</p>
      <div class="answer-zone ${answered ? (ui.lesson.wasCorrect ? 'is-correct' : 'is-wrong') : ''}" aria-label="你的答案">
        ${st.arranged.length
          ? st.arranged.map(t => `<button class="token" data-action="remove-token" data-token="${t.id}" ${answered ? 'disabled' : ''}>${esc(t.text)}</button>`).join('')
          : '<span class="answer-placeholder">Clica nas palavras para construir a frase…</span>'}
      </div>
      <div class="word-bank" aria-label="可选词语">
        ${st.bank.map(t => `<button class="token bank-token" data-action="add-token" data-token="${t.id}" ${answered ? 'disabled' : ''}>${esc(t.text)}</button>`).join('')}
      </div>
    </div>`;
  }

  function matchExerciseHTML(ex, st, answered) {
    return `<div class="match-stage">
      <p class="match-hint">${st.solved.length === ex.pairs.length ? 'Tudo ligado!' : '先点左边的葡语，再点右边的中文。'}</p>
      <div class="match-grid">
        <div class="match-col">
          ${st.left.map(pair => {
            const solved = st.solved.includes(pair.id);
            return `<button class="match-item ${solved ? 'is-solved' : ''} ${st.selected === pair.id ? 'is-selected' : ''} ${st.wrong === pair.id ? 'is-wrong' : ''}" data-action="match-left" data-id="${pair.id}" ${solved || answered ? 'disabled' : ''}>
              <span>${esc(pair.pt)}</span>${solved ? icon('check') : ''}
            </button>`;
          }).join('')}
        </div>
        <div class="match-col">
          ${st.right.map(pair => {
            const solved = st.solved.includes(pair.id);
            return `<button class="match-item is-zh ${solved ? 'is-solved' : ''} ${st.wrong === pair.id ? 'is-wrong' : ''}" data-action="match-right" data-id="${pair.id}" ${solved || answered ? 'disabled' : ''}>
              <span>${esc(pair.zh)}</span>${solved ? icon('check') : ''}
            </button>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  }

  function lessonFooterHTML() {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!step) return '';
    if (step.kind !== 'exercise') {
      return `<footer class="lesson-footer simple">
        <div class="lesson-footer-inner">
          <span class="keyboard-hint">${icon('keyboard')} Enter para continuar</span>
          <button class="btn btn-primary" data-action="next-step">Continuar ${icon('arrow-right')}</button>
        </div>
      </footer>`;
    }
    if (!lesson.answered) {
      const enabled = canCheck();
      return `<footer class="lesson-footer simple">
        <div class="lesson-footer-inner">
          <span class="keyboard-hint">${icon('keyboard')} ${step.ex.type === 'match' ? 'Liga todos os pares' : 'Enter para verificar'}</span>
          <button class="btn btn-primary" data-action="check" ${enabled ? '' : 'disabled'}>Verificar</button>
        </div>
      </footer>`;
    }
    const feedbackTitle = lesson.wasCorrect ? (lesson.accentWarning ? 'Quase perfeito!' : ['Boa!', 'Muito bem!', 'Exato!', 'Assim mesmo!'][lesson.index % 4]) : 'Quase!';
    const correctAnswer = step.ex.answer || (step.ex.answers ? step.ex.answers[0] : '');
    return `<footer class="lesson-footer ${lesson.wasCorrect ? 'is-ok' : 'is-bad'}">
      <div class="lesson-footer-inner">
        <div class="feedback" role="status">
          <span class="feedback-icon">${icon(lesson.wasCorrect ? 'check' : 'x')}</span>
          <div class="feedback-copy">
            <strong>${feedbackTitle}</strong>
            <p>${lesson.accentWarning ? '意思和拼写都对，只是别忘了重音符号。' : esc(step.ex.explain)}</p>
            ${!lesson.wasCorrect && correctAnswer ? `<p class="feedback-answer">Resposta certa: <b>${esc(correctAnswer)}</b></p>` : ''}
          </div>
        </div>
        <button class="btn ${lesson.wasCorrect ? 'btn-primary' : 'btn-dark'}" data-action="next-step">Continuar ${icon('arrow-right')}</button>
      </div>
      <div class="feedback-progress"><span style="width:${((lesson.index + 1) / lesson.steps.length) * 100}%"></span></div>
    </footer>`;
  }

  function refreshLessonFooter() {
    const shell = $('.lesson-shell');
    if (!shell) return;
    const old = $('.lesson-footer', shell);
    if (!old) return;
    const temp = document.createElement('div');
    temp.innerHTML = lessonFooterHTML();
    old.replaceWith(temp.firstElementChild);
  }

  function selectOption(index) {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!lesson || lesson.answered || !step || step.kind !== 'exercise') return;
    if (!['choice', 'listen'].includes(step.ex.type)) return;
    lesson.stepState.selected = index;
    $$('.option').forEach((el, i) => {
      el.classList.toggle('is-selected', i === index);
      el.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
    refreshLessonFooter();
  }

  function checkCurrent() {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!lesson || lesson.answered || !step || step.kind !== 'exercise') return;
    const ex = step.ex;
    const st = lesson.stepState;
    let correct = false;
    let accentWarning = false;

    if (ex.type === 'choice' || ex.type === 'listen') {
      if (st.selected === null) return;
      correct = st.options[st.selected] === ex.answer;
    } else if (ex.type === 'type') {
      const input = $('#type-answer');
      if (input) st.input = input.value;
      if (!st.input.trim()) return;
      const norm = normalizeAnswer(st.input);
      const matched = ex.answers.find(a => normalizeAnswer(a) === norm);
      correct = Boolean(matched);
      if (matched) {
        accentWarning = cleanForExact(st.input) !== cleanForExact(matched);
      }
    } else if (ex.type === 'arrange') {
      const built = joinTokens(st.arranged.map(t => t.text));
      correct = normalizeAnswer(built) === normalizeAnswer(ex.answer);
    } else {
      return;
    }

    lesson.answered = true;
    lesson.wasCorrect = correct;
    lesson.accentWarning = accentWarning;
    if (correct) {
      lesson.correct += 1;
      soundFX('correct');
    } else {
      lesson.mistakes += 1;
      soundFX('wrong');
    }
    const body = $('#lesson-body');
    if (body) {
      body.innerHTML = exerciseHTML(ex);
      body.classList.add('step-enter');
      setTimeout(() => body.classList.remove('step-enter'), 300);
    }
    refreshLessonFooter();
    const footer = $('.lesson-footer');
    if (footer) footer.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function addToken(id) {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!lesson || lesson.answered || !step) return;
    const st = lesson.stepState;
    const idx = st.bank.findIndex(t => t.id === id);
    if (idx < 0) return;
    const token = st.bank.splice(idx, 1)[0];
    st.arranged.push(token);
    const body = $('#lesson-body');
    if (body) body.innerHTML = exerciseHTML(step.ex);
    refreshLessonFooter();
  }

  function removeToken(id) {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!lesson || lesson.answered || !step) return;
    const st = lesson.stepState;
    const idx = st.arranged.findIndex(t => t.id === id);
    if (idx < 0) return;
    const token = st.arranged.splice(idx, 1)[0];
    st.bank.push(token);
    const body = $('#lesson-body');
    if (body) body.innerHTML = exerciseHTML(step.ex);
    refreshLessonFooter();
  }

  function matchLeft(id) {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!lesson || lesson.answered || !step || step.ex.type !== 'match') return;
    const st = lesson.stepState;
    if (st.solved.includes(id) || st.wrong !== null) return;
    st.selected = st.selected === id ? null : id;
    refreshMatchBody();
  }

  function matchRight(id) {
    const lesson = ui.lesson;
    const step = currentLessonStep();
    if (!lesson || lesson.answered || !step || step.ex.type !== 'match') return;
    const st = lesson.stepState;
    if (st.solved.includes(id) || st.wrong !== null) return;
    if (st.selected === null) {
      showToast('先选左边的一个葡语词。', 'warn');
      return;
    }
    if (st.selected === id) {
      st.solved.push(id);
      st.selected = null;
      refreshMatchBody();
      if (st.solved.length === step.ex.pairs.length) {
        lesson.answered = true;
        lesson.wasCorrect = st.matchMistakes === 0;
        if (lesson.wasCorrect) lesson.correct += 1;
        lesson.feedback = 'match';
        if (lesson.wasCorrect) soundFX('correct');
        refreshMatchBody();
        refreshLessonFooter();
      }
    } else {
      st.wrong = id;
      st.matchMistakes += 1;
      soundFX('wrong');
      refreshMatchBody();
      const expectStep = step;
      setTimeout(() => {
        if (!ui.lesson || ui.lesson.steps[ui.lesson.index] !== expectStep) return;
        st.wrong = null;
        st.selected = null;
        refreshMatchBody();
      }, 520);
    }
  }

  function refreshMatchBody() {
    const step = currentLessonStep();
    const body = $('#lesson-body');
    if (!step || !body) return;
    body.innerHTML = exerciseHTML(step.ex);
  }

  function insertChar(ch) {
    const input = $('#type-answer');
    if (!input || input.disabled) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    input.setRangeText(ch, start, end, 'end');
    input.focus();
    ui.lesson.stepState.input = input.value;
  }

  function nextLessonStep() {
    const lesson = ui.lesson;
    if (!lesson) return;
    if (lesson.index >= lesson.steps.length - 1) {
      finishLesson();
      return;
    }
    lesson.index += 1;
    setupLessonStep();
    renderLesson();
    const scroll = $('#lesson-scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  function finishLesson() {
    const lesson = ui.lesson;
    if (!lesson || lesson.done) return;
    const data = lesson.lesson;
    const previous = state.lessons[data.id] || null;
    const firstTime = !previous;
    const total = data.exercises.length;
    const accuracy = total ? Math.round(lesson.correct / total * 100) : 100;
    const best = Math.max(previous ? previous.best || 0 : 0, accuracy);
    const bonus = accuracy === 100 ? 5 : 0;
    const xpGain = firstTime ? data.xp + bonus : 10;
    const newWords = addWordsToReview(data.vocab);
    state.lessons[data.id] = {
      completedAt: new Date().toISOString(),
      best,
      attempts: (previous ? previous.attempts || 0 : 0) + 1
    };
    addXP(xpGain);
    saveState();
    lesson.done = true;
    lesson.results = { accuracy, best, xpGain, firstTime, newWords, total };
    renderLessonResult();
    soundFX('complete');
    launchConfetti();
  }

  function renderLessonResult() {
    const lesson = ui.lesson;
    const r = lesson.results;
    const next = nextLessonAfter(lesson.id);
    const perfect = r.accuracy === 100;
    $('#view').innerHTML = `
      <div class="lesson-shell result-shell">
        <div class="result-scroll">
          <div class="result-card">
            <div class="result-stamp">${icon(perfect ? 'award' : 'check')}</div>
            <span class="eyebrow">${lesson.lesson.isLab ? 'PRÁTICA CONCLUÍDA' : 'LIÇÃO CONCLUÍDA'}</span>
            <h1>${perfect ? 'Perfeito. Sem erros.' : 'Muito bem. Mais um passo.'}</h1>
            <p class="result-sub">${esc(lesson.lesson.title)} · ${esc(lesson.lesson.zh)}</p>
            <div class="result-stats">
              <div><strong>+${r.xpGain}</strong><span>XP</span></div>
              <div><strong>${r.accuracy}%</strong><span>precisão</span></div>
              <div><strong>${lesson.lesson.vocab.length}</strong><span>palavras</span></div>
            </div>
            <div class="result-words">
              <span class="eyebrow">PARA LEVAR CONTIGO</span>
              <div class="result-chips">
                ${lesson.lesson.vocab.map(w => `<button class="word-chip" data-audio="${esc(w.pt)}">${icon('volume')} ${esc(w.pt)}</button>`).join('')}
              </div>
            </div>
            ${r.firstTime
              ? `<p class="result-note">+${lesson.lesson.isLab ? r.xpGain : lesson.lesson.xp} XP ${lesson.lesson.isLab ? 'por esta prática' : `pela primeira conclusão${perfect ? ' e +5 XP por acertar tudo' : ''}`}. ${lesson.lesson.isLab ? 'Estas palavras estão no teu caderno de revisão.' : 'As palavras já estão na tua revisão.'}</p>`
              : `<p class="result-note">${lesson.lesson.isLab ? 'Prática repetida. A repetição também conta.' : 'Já conhecias esta lição. As palavras continuam na tua revisão.'}</p>`}
            <div class="result-actions">
              ${next ? `<button class="btn btn-primary" data-action="next-lesson" data-id="${next.id}">${next.isLab ? 'Próxima prática' : 'Próxima lição'} ${icon('arrow-right')}</button>` : `<button class="btn btn-primary" data-action="go-review">Rever palavras ${icon('arrow-right')}</button>`}
              <button class="btn btn-secondary" data-action="go-home">Voltar ao início</button>
            </div>
            <button class="text-link center" data-action="go-review">${icon('review')} Revisar as palavras desta lição</button>
          </div>
        </div>
      </div>`;
    document.title = `Lição concluída · Azulejo`;
  }

  function requestLeaveLesson() {
    if (!ui.lesson || ui.lesson.done) {
      go(ui.lesson && ui.lesson.directReading ? '#/reading' : '#/learn');
      return;
    }
    if (ui.lesson.directReading) {
      go('#/reading');
      return;
    }
    openConfirm('Sair da lição?', 'O progresso desta lição não será guardado. As palavras novas só entram na revisão no fim.', 'confirm-leave-lesson', 'Sair', 'Continuar a lição');
  }

  /* ------------------------------------------------------------------ */
  /* Review                                                              */
  /* ------------------------------------------------------------------ */

  function renderReviewPage() {
    const due = dueWords();
    const learned = learnedWords();
    const dueCount = due.length;
    const inDay = learned.length - dueCount;
    const wordPreview = learned.slice(-8).reverse();
    const featured = due[0]?.vocab || learned[learned.length - 1]?.vocab || dailyWord();
    const backOne = due[1]?.vocab?.pt || learned[1]?.vocab?.pt || 'obrigado';
    const backTwo = due[2]?.vocab?.pt || learned[2]?.vocab?.pt || 'saudade';

    const queueInner = learned.length === 0
      ? `<div class="empty-review">
          <div class="empty-art">${icon('book')}</div>
          <h2>Ainda não há palavras.</h2>
          <p>完成第一节课后，新词会自动进入你的复习队列。</p>
          <button class="btn btn-primary" data-action="start-next">Começar a aprender ${icon('arrow-right')}</button>
        </div>`
      : `<div class="review-hero">
          <div class="review-hero-copy">
            <span class="eyebrow light">REVISÃO INTELIGENTE</span>
            <h2>${dueCount ? (dueCount === 1 ? 'Uma palavra está à tua espera.' : `${dueCount} palavras estão à tua espera.`) : 'Tudo em dia. Por agora.'}</h2>
            <p>${dueCount ? '间隔重复会在快要忘记的时候，把词重新带回你面前。每次只需几分钟。' : '没有到期卡片。你可以提前练一遍，也可以去学一节新课。'}</p>
            <div class="review-actions">
              ${dueCount
                ? `<a class="btn btn-gold" href="#/review/session">Começar revisão ${icon('arrow-right')}</a>`
                : learned.length
                  ? `<a class="btn btn-gold" href="#/review/session/all">Praticar tudo ${icon('arrow-right')}</a>`
                  : `<button class="btn btn-primary" data-action="start-next">Começar a aprender ${icon('arrow-right')}</button>`}
              ${learned.length ? `<button class="btn btn-ghost-light" data-action="open-settings">Ajustar meta</button>` : ''}
            </div>
            <div class="review-tip">${icon('info')} 系统按 1 → 3 → 7 → 14 天的节奏安排复习。</div>
          </div>
          <div class="card-stack" aria-hidden="true">
            <div class="stack-card back-2"><span>${esc(backTwo)}</span></div>
            <div class="stack-card back-1"><span>${esc(backOne)}</span></div>
            <div class="stack-card front"><span class="stack-kicker">LEMBRAS-TE?</span><strong>${esc(featured.pt)}</strong><em>${esc(featured.pron || '')}</em>${icon('volume')}</div>
          </div>
        </div>`;
    const statsHTML = learned.length ? `<div class="stats-grid stats-grid-3">
      <div class="stat-card"><span class="stat-icon gold">${icon('layers')}</span><div><strong>${dueCount}</strong><span>今日到期</span></div></div>
      <div class="stat-card"><span class="stat-icon blue">${icon('book')}</span><div><strong>${learned.length}</strong><span>已收集词语</span></div></div>
      <div class="stat-card"><span class="stat-icon green">${icon('check')}</span><div><strong>${inDay}</strong><span>记忆稳固</span></div></div>
    </div>` : '';
    $('#view').innerHTML = `
      <div class="page review-page">
        ${pageHead('REVISAR', 'Não percas o que já sabes.', '把学过的词，在恰当的时刻重新捞回来。间隔重复比临时抱佛脚更可靠。', `<div class="head-badge">${icon('review')}<span><strong>${dueCount}</strong><small>para hoje</small></span></div>`)}
        ${statsHTML}
        ${queueInner}
        ${wordPreview.length ? `<section class="review-words-section">
          <div class="section-head compact"><div><span class="eyebrow">O TEU CADERNO</span><h2>Palavras no teu ouvido.</h2></div><a class="text-link" href="#/phrases">Ver frases ${icon('arrow-right')}</a></div>
          <div class="word-cloud">
            ${wordPreview.map(item => `<button class="cloud-word" data-audio="${esc(item.vocab.pt)}"><span>${esc(item.vocab.pt)}</span><small>${esc(item.vocab.zh)}</small>${icon('volume')}</button>`).join('')}
          </div>
        </section>` : ''}
      </div>`;
    document.title = 'Revisão · Azulejo';
  }

  function startReviewSession(practiceAll) {
    if (ui.review && !ui.review.done && !ui.review.empty) return;
    const queue = practiceAll ? learnedWords() : dueWords();
    if (!queue.length) {
      ui.review = { empty: true, practiceAll };
      renderReviewEmpty();
      return;
    }
    ui.review = {
      queue: shuffle(queue).slice(0, 15),
      index: 0,
      flipped: false,
      ratings: [],
      xp: 0,
      done: false,
      practiceAll,
      bonus: 0
    };
    renderReviewSession();
  }

  function reviewCurrent() {
    const review = ui.review;
    return review && !review.done ? review.queue[review.index] : null;
  }

  function renderReviewEmpty() {
    $('#view').innerHTML = `<div class="review-shell">
      <header class="lesson-topbar">
        <button class="close-btn" data-action="close-review" aria-label="退出复习">${icon('x')}</button>
        <div class="review-top-title">REVISÃO</div>
        <span class="xp-badge">${icon('star')} +2 XP / palavra</span>
      </header>
      <div class="review-scroll">
        <div class="review-empty-card">
          <div class="result-stamp">${icon('check')}</div>
          <span class="eyebrow">TUDO EM DIA</span>
          <h1>Não há nada para revisar.</h1>
          <p>As tuas palavras estão descansadas. Volta mais tarde, ou aprende uma lição nova para adicionar vocabulário.</p>
          <div class="result-actions">
            <button class="btn btn-primary" data-action="start-next">Aprender uma lição ${icon('arrow-right')}</button>
            <button class="btn btn-secondary" data-action="go-review">Voltar à revisão</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderReviewSession() {
    const review = ui.review;
    if (!review) return;
    if (review.empty) return renderReviewEmpty();
    if (review.done) return renderReviewResult();
    const item = reviewCurrent();
    if (!item) return finishReview();
    const word = item.vocab;
    const record = state.words[item.id];
    const progress = review.queue.length ? review.index / review.queue.length : 0;
    $('#view').innerHTML = `<div class="review-shell">
      <header class="lesson-topbar">
        <button class="close-btn" data-action="close-review" aria-label="退出复习">${icon('x')}</button>
        <div class="review-progress" role="progressbar" aria-label="复习进度" aria-valuemin="0" aria-valuemax="${review.queue.length}" aria-valuenow="${review.index + 1}"><span style="width:${progress * 100}%"></span></div>
        <span class="review-counter">${review.index + 1} / ${review.queue.length}</span>
      </header>
      <div class="review-scroll">
        <div class="reviewer">
          <div class="reviewer-label"><span class="eyebrow">${review.practiceAll ? 'PRÁTICA LIVRE' : 'REVISÃO'}</span><span class="review-unit">${esc(word.lessonTitle || '')}</span></div>
          <article class="flashcard ${review.flipped ? 'is-flipped' : ''}" data-action="flip-card">
            <div class="flashcard-corner tl"></div><div class="flashcard-corner br"></div>
            ${!review.flipped
              ? `<div class="flash-front">
                  <span class="flash-kicker">LEMBRAS-TE?</span>
                  <h1>${esc(word.pt)}</h1>
                  <p class="flash-pron">${esc(word.pron)}</p>
                  <button class="audio-btn large" data-audio="${esc(word.pt)}" aria-label="播放发音">${icon('volume')}</button>
                  <p class="flash-hint">Tenta lembrar-te do significado antes de virar.</p>
                </div>`
              : `<div class="flash-back">
                  <span class="flash-kicker">SIGNIFICADO</span>
                  <h2>${esc(word.zh)}</h2>
                  <div class="flash-example"><button class="audio-mini" data-audio="${esc(word.ex)}" aria-label="播放例句">${icon('volume')}</button><div><strong>${esc(word.ex)}</strong><span>${esc(word.exZh)}</span></div></div>
                  ${word.note ? `<p class="flash-note">${esc(word.note)}</p>` : ''}
                </div>`}
          </article>
          <p class="review-keyboard">${icon('keyboard')} ${review.flipped ? '1–4 评价记忆 · Space 翻面' : 'Space 翻面 · 先自己想一想'}</p>
        </div>
      </div>
      ${review.flipped ? reviewRatingHTML(record) : `<footer class="review-footer simple"><button class="btn btn-primary wide" data-action="flip-card">Mostrar resposta</button></footer>`}
    </div>`;
    document.title = `Revisão ${review.index + 1}/${review.queue.length} · Azulejo`;
  }

  function reviewRatingHTML(record) {
    const ratings = [
      { id: 'again', label: 'Outra vez', pt: '忘记', cls: 'again' },
      { id: 'hard', label: 'Difícil', pt: '困难', cls: 'hard' },
      { id: 'good', label: 'Bem', pt: '记得', cls: 'good' },
      { id: 'easy', label: 'Fácil', pt: '轻松', cls: 'easy' }
    ];
    return `<footer class="review-footer">
      <div class="review-footer-inner">
        <span class="rating-label">Como foi?</span>
        <div class="rating-grid">
          ${ratings.map((r, i) => `<button class="rating-btn ${r.cls}" data-action="rate" data-rating="${r.id}">
            <span class="rating-key">${i + 1}</span>
            <strong>${r.label}</strong><small>${intervalLabel(record, r.id)} · +2 XP</small>
          </button>`).join('')}
        </div>
      </div>
    </footer>`;
  }

  function flipCard() {
    if (!ui.review || ui.review.done) return;
    ui.review.flipped = !ui.review.flipped;
    renderReviewSession();
  }

  function rateReview(rating) {
    const review = ui.review;
    if (!review || review.done || !review.flipped) return;
    const item = reviewCurrent();
    if (!item) return;
    const updated = updateSRS(state.words[item.id], rating);
    state.words[item.id] = updated.record;
    addXP(2);
    review.xp += 2;
    review.ratings.push({ id: item.id, rating });
    review.index += 1;
    review.flipped = false;
    saveState();
    if (review.index >= review.queue.length) finishReview();
    else renderReviewSession();
  }

  function finishReview() {
    const review = ui.review;
    if (!review || review.done) return;
    review.done = true;
    const bonus = review.ratings.length >= 3 ? 5 : 0;
    if (bonus) {
      addXP(bonus);
      review.xp += bonus;
      review.bonus = bonus;
    }
    saveState();
    soundFX('complete');
    launchConfetti();
    renderReviewResult();
  }

  function renderReviewResult() {
    const review = ui.review;
    const counts = { again: 0, hard: 0, good: 0, easy: 0 };
    review.ratings.forEach(r => { counts[r.rating] += 1; });
    $('#view').innerHTML = `<div class="review-shell result-shell">
      <div class="result-scroll">
        <div class="result-card review-result-card">
          <div class="result-stamp">${icon('check')}</div>
          <span class="eyebrow">REVISÃO CONCLUÍDA</span>
          <h1>${review.ratings.length} palavras revisitadas.</h1>
          <p class="result-sub">每复习一次，记忆的间隔就会更长一点。</p>
          <div class="review-result-grid">
            <div><strong>${counts.again}</strong><span>Outra vez</span></div>
            <div><strong>${counts.hard}</strong><span>Difícil</span></div>
            <div><strong>${counts.good}</strong><span>Bem</span></div>
            <div><strong>${counts.easy}</strong><span>Fácil</span></div>
          </div>
          <div class="result-stats two">
            <div><strong>+${review.xp}</strong><span>XP ganho</span></div>
            <div><strong>${review.queue.length}</strong><span>palavras</span></div>
          </div>
          <div class="result-actions">
            <button class="btn btn-primary" data-action="go-review">Voltar à revisão ${icon('arrow-right')}</button>
            <button class="btn btn-secondary" data-action="go-home">Ir para o início</button>
          </div>
        </div>
      </div>
    </div>`;
    document.title = 'Revisão concluída · Azulejo';
  }

  /* ------------------------------------------------------------------ */
  /* Phrasebook                                                          */
  /* ------------------------------------------------------------------ */

  const PHRASE_GROUPS = {
    all: '全部',
    ...Object.fromEntries(PHRASE_SCENES.map(scene => [scene.key, scene.zh || scene.pt || scene.key]))
  };

  function phraseMatches(phrase) {
    if (ui.favOnly && !state.favorites.includes(phrase.id)) return false;
    if (ui.phraseGroup !== 'all' && phrase.group !== ui.phraseGroup) return false;
    const q = accentFold(ui.phraseQuery.trim());
    if (!q) return true;
    return [phrase.pt, phrase.zh, phrase.en, phrase.fr, phrase.level, PHRASE_GROUPS[phrase.group]]
      .some(value => accentFold(value || '').includes(q));
  }

  function filteredPhrases() {
    return DATA.phrases.filter(phraseMatches);
  }

  function phrasesGridHTML() {
    const list = filteredPhrases();
    const shown = list.slice(0, ui.phraseLimit);
    if (!list.length) {
      return `<div class="empty-phrases"><span>${icon('search')}</span><h3>Nenhuma frase encontrada.</h3><p>试试别的关键词，或切回「全部」。</p><button class="btn btn-secondary" data-action="clear-phrase-filters">Limpar filtros</button></div>`;
    }
    return shown.map(phrase => `<article class="phrase-card ${state.favorites.includes(phrase.id) ? 'is-fav' : ''}">
      <div class="phrase-top">
        <span class="phrase-group">${esc(PHRASE_GROUPS[phrase.group] || phrase.group)}</span>
        <span class="phrase-level">${esc(phrase.level || '')}</span>
        <button class="fav-btn ${state.favorites.includes(phrase.id) ? 'is-fav' : ''}" data-action="fav-phrase" data-id="${phrase.id}" aria-label="${state.favorites.includes(phrase.id) ? '取消收藏' : '收藏'}" aria-pressed="${state.favorites.includes(phrase.id)}">${icon('bookmark')}</button>
      </div>
      <div class="phrase-pt-row">
        <h3>${esc(phrase.pt)}</h3>
        <button class="audio-btn small" data-audio="${esc(phrase.pt)}" aria-label="播放发音">${icon('volume')}</button>
      </div>
      <div class="phrase-translations">
        <p><b>中</b><span>${esc(phrase.zh)}</span></p>
        <p><b>EN</b><span>${esc(phrase.en)}</span></p>
        <p><b>FR</b><span>${esc(phrase.fr)}</span></p>
      </div>
    </article>`).join('');
  }

  function renderPhraseGrid() {
    const grid = $('#phrase-grid');
    if (grid) grid.innerHTML = phrasesGridHTML();
    const list = filteredPhrases();
    const count = $('#phrase-count');
    if (count) count.textContent = `${Math.min(ui.phraseLimit, list.length)} / ${list.length} frases`;
    const more = $('#phrase-more');
    if (more) {
      more.innerHTML = list.length > ui.phraseLimit
        ? `<button class="btn btn-secondary" data-action="show-more-phrases">Mostrar mais 100 ${icon('arrow-right')}</button>`
        : '';
    }
  }

  function languageTabsHTML() {
    return `<div class="language-tabs" role="tablist" aria-label="语料类型">
      <button class="language-tab ${ui.languageTab === 'phrases' ? 'is-active' : ''}" data-action="select-language-tab" data-tab="phrases" role="tab" aria-selected="${ui.languageTab === 'phrases'}">
        <span class="language-tab-icon">${icon('chat')}</span><span><strong>短语</strong><small>Frases · ${DATA.phrases.length}</small></span>
      </button>
      <button class="language-tab ${ui.languageTab === 'words' ? 'is-active' : ''}" data-action="select-language-tab" data-tab="words" role="tab" aria-selected="${ui.languageTab === 'words'}">
        <span class="language-tab-icon">${icon('layers')}</span><span><strong>词汇</strong><small>5 línguas · ${allVocab.length}</small></span>
      </button>
      <button class="language-tab ${ui.languageTab === 'verbs' ? 'is-active' : ''}" data-action="select-language-tab" data-tab="verbs" role="tab" aria-selected="${ui.languageTab === 'verbs'}">
        <span class="language-tab-icon">${icon('review')}</span><span><strong>动词</strong><small>Conjugações · ${(window.AZ_VERBS ? window.AZ_VERBS.verbs.length : 0)}</small></span>
      </button>
    </div>`;
  }

  function wordMatches(word) {
    if (ui.wordLevel !== 'all' && word.level !== ui.wordLevel) return false;
    const q = accentFold(ui.wordQuery.trim());
    if (!q) return true;
    return [word.pt, word.zh, word.en, word.fr, word.es, word.pron, word.level]
      .some(value => accentFold(value).includes(q));
  }

  const WORD_POS_GROUPS = [
    ['noun', 'Substantivos', '名词'],
    ['verb', 'Verbos', '动词'],
    ['adjective', 'Adjetivos', '形容词'],
    ['adverb', 'Advérbios', '副词'],
    ['phrase', 'Expressões', '短语']
  ];
  const WORD_POS_KEYS = new Set(WORD_POS_GROUPS.map(([key]) => key));

  function wordPos(word) {
    return WORD_POS_KEYS.has(word.pos) ? word.pos : 'phrase';
  }

  function lexiconGridHTML() {
    const list = allVocab.filter(wordMatches);
    if (!list.length) {
      return `<div class="empty-phrases lex-empty"><span>${icon('search')}</span><h3>Nenhuma palavra encontrada.</h3><p>试试中文、English、français 或 español。</p><button class="btn btn-secondary" data-action="clear-word-filters">Limpar filtros</button></div>`;
    }
    let sequence = 0;
    const visible = list.slice(0, ui.wordLimit);
    return WORD_POS_GROUPS.map(([pos, label, zh]) => {
      const words = visible
        .filter(word => wordPos(word) === pos)
        .sort((a, b) => String(a.level || '').localeCompare(String(b.level || '')) || String(a.pt || '').localeCompare(String(b.pt || ''), 'pt'));
      if (!words.length) return '';
      return `<section class="lex-pos-group">
        <div class="lex-pos-head"><h3>${label}<span>${zh}</span></h3><em>${words.length}</em></div>
        <div class="lex-group-rows">${words.map(word => {
          sequence += 1;
          const learned = Boolean(state.words[word.id]);
          return `<article class="lex-row ${learned ? 'is-learned' : ''}">
            <span class="lex-index">${String(sequence).padStart(3, '0')}</span>
            <div class="lex-main">
              <button class="audio-btn small" data-audio="${esc(word.pt)}" aria-label="播放 ${esc(word.pt)} 的发音">${icon('volume')}</button>
              <div><strong>${esc(word.pt)}</strong><span class="lex-pron">${esc(word.pron)}</span></div>
              <em class="level-pill level-${word.level}">${word.level}</em>
            </div>
            <div class="lex-zh"><b>中</b><span>${esc(word.zh)}</span></div>
            <div class="lex-lang"><b>EN</b><span>${esc(word.en)}</span></div>
            <div class="lex-lang"><b>FR</b><span>${esc(word.fr)}</span></div>
            <div class="lex-lang"><b>ES</b><span>${esc(word.es)}</span></div>
            <div class="lex-learned">${learned ? `<span title="已加入复习">${icon('check')}</span>` : ''}</div>
          </article>`;
        }).join('')}</div>
      </section>`;
    }).join('');
  }

  function renderWordGrid() {
    const grid = $('#lex-grid');
    if (grid) grid.innerHTML = lexiconGridHTML();
    const list = allVocab.filter(wordMatches);
    const count = $('#word-count');
    if (count) count.textContent = `${Math.min(ui.wordLimit, list.length)} / ${list.length} palavras`;
    const more = $('#word-more');
    if (more) more.innerHTML = list.length > ui.wordLimit
      ? `<button class="btn btn-secondary" data-action="show-more-words">Mostrar mais 200 ${icon('arrow-right')}</button>`
      : '';
    $$('#word-level-chips .filter-chip').forEach(chip => chip.classList.toggle('is-active', chip.dataset.level === ui.wordLevel));
  }

  function renderLexiconPage() {
    const levelChips = [
      `<button class="filter-chip ${ui.wordLevel === 'all' ? 'is-active' : ''}" data-action="filter-words" data-level="all">全部<span>${allVocab.length}</span></button>`,
      ...LEVELS.map(level => {
        const count = allVocab.filter(word => word.level === level.id).length;
        return `<button class="filter-chip ${ui.wordLevel === level.id ? 'is-active' : ''}" data-action="filter-words" data-level="${level.id}">${level.id}<span>${count}</span></button>`;
      })
    ].join('');
    const langLegend = ['PT', '中文', 'EN', 'FR', 'ES'].map((code, i) => `<span class="legend-item ${i === 0 ? 'is-primary' : ''}">${code}</span>`).join('');
    $('#view').innerHTML = `
      <div class="page phrases-page lexicon-page">
        ${pageHead('PALAVRAS', 'Cinco línguas, uma palavra.', '课程里的每一个词，都能在中文、English、français 和 español 之间对照。先听葡语，再用你最熟的语言确认意思。', `<div class="head-badge">${icon('layers')}<span><strong>${allVocab.length}</strong><small>palavras</small></span></div>`)}
        ${languageTabsHTML()}
        <div class="lex-legend">${langLegend}<span class="legend-note">按词性分组：名词 · 动词 · 形容词 · 副词 · 短语；序号连续编号</span></div>
        <div class="phrase-toolbar word-toolbar">
          <label class="search-box">
            ${icon('search')}
            <input id="word-search" type="search" value="${esc(ui.wordQuery)}" placeholder="搜索：中文 / English / français / español…" aria-label="搜索五语词汇">
            <span class="search-kbd">${/Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘ K' : 'Ctrl K'}</span>
          </label>
        </div>
        <div class="filter-chips" id="word-level-chips">${levelChips}</div>
        <div class="phrase-grid-head"><span id="word-count">${Math.min(ui.wordLimit, allVocab.filter(wordMatches).length)} / ${allVocab.filter(wordMatches).length} palavras</span><span>${icon('volume')} 点小喇叭听葡语发音</span></div>
        <div class="lex-table-head" aria-hidden="true"><span>Nº</span><span>Português</span><span>中文</span><span>English</span><span>Français</span><span>Español</span><span></span></div>
        <div class="lex-grid" id="lex-grid">${lexiconGridHTML()}</div>
        <div class="word-more" id="word-more">${allVocab.filter(wordMatches).length > ui.wordLimit ? `<button class="btn btn-secondary" data-action="show-more-words">Mostrar mais 200 ${icon('arrow-right')}</button>` : ''}</div>
      </div>`;
    document.title = 'Palavras · Azulejo';
  }

  function renderVerbsPage() {
    const data = window.AZ_VERBS;
    if (!data || !Array.isArray(data.verbs)) {
      $('#view').innerHTML = `<div class="page"><div class="empty-phrases"><h3>Sem verbos.</h3></div></div>`;
      return;
    }
    const verbs = data.verbs;
    $('#view').innerHTML = `
      <div class="page phrases-page verbs-page">
        ${pageHead('VERBOS', 'Um verbo, muitos tempos.', '每个动词都有现在时、过去时、将来时和虚拟式的变位表。点开一个动词，横向滑动查看六个人称。', `<div class="head-badge alt">${icon('review')}<span><strong>${verbs.length}</strong><small>verbos</small></span></div>`)}
        ${languageTabsHTML()}
        <div class="verb-grid">${verbs.map(verb => {
          const open = ui.openVerb === verb.infinitive;
          return `<article class="verb-card ${open ? 'is-open' : ''}">
            <button class="verb-head" data-action="toggle-verb" data-verb="${esc(verb.infinitive)}" aria-expanded="${open}">
              <span><b>${esc(verb.infinitive)}</b><small>${esc(verb.zh)} · ${esc(verb.en)}</small></span>
              <em>${verb.infinitive.endsWith('ar') ? '-ar' : verb.infinitive.endsWith('er') ? '-er' : '-ir'}</em>
              ${icon(open ? 'x' : 'arrow-right')}
            </button>
            ${open ? `<div class="verb-table-wrap"><table class="verb-table"><thead><tr><th></th>${verb.table.map(t => `<th>${esc(t.label)}</th>`).join('')}</tr></thead><tbody>
              ${data.people.map((person, i) => `<tr><th>${esc(person)}</th>${verb.table.map(t => `<td>${esc(t.forms[i] || '—')}</td>`).join('')}</tr>`).join('')}
            </tbody></table></div>` : ''}
          </article>`;
        }).join('')}</div>
      </div>`;
    document.title = 'Verbos · Azulejo';
  }

  function renderPhrasesPage() {
    if (ui.languageTab === 'words') {
      renderLexiconPage();
      return;
    }
    if (ui.languageTab === 'verbs') {
      renderVerbsPage();
      return;
    }
    const shortcut = /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘ K' : 'Ctrl K';
    const groupChips = Object.entries(PHRASE_GROUPS).map(([id, label]) => {
      const count = id === 'all' ? DATA.phrases.length : DATA.phrases.filter(p => p.group === id).length;
      return `<button class="filter-chip ${ui.phraseGroup === id ? 'is-active' : ''}" data-action="filter-phrases" data-group="${id}">${label}<span>${count}</span></button>`;
    }).join('');
    $('#view').innerHTML = `
      <div class="page phrases-page">
        ${pageHead('FRASES & PALAVRAS', 'Mil frases para a vida real.', '1000 句按场景编排的葡语口语句型，配中文、English 和 français。点小喇叭听发音，点书签收藏。', `<div class="head-badge alt">${icon('chat')}<span><strong>${DATA.phrases.length}</strong><small>frases</small></span></div>`)}
        ${languageTabsHTML()}
        <div class="phrase-toolbar">
          <label class="search-box">
            ${icon('search')}
            <input id="phrase-search" type="search" value="${esc(ui.phraseQuery)}" placeholder="搜索葡语 / 中文 / English / français…" aria-label="搜索短语">
            <span class="search-kbd">${shortcut}</span>
          </label>
          <button class="fav-filter ${ui.favOnly ? 'is-active' : ''}" data-action="toggle-fav-filter" aria-pressed="${ui.favOnly}">${icon('bookmark')} 收藏 <span>${state.favorites.length}</span></button>
        </div>
        <div class="filter-chips phrase-scene-chips" id="phrase-filters">${groupChips}</div>
        <div class="phrase-grid-head"><span id="phrase-count">${Math.min(ui.phraseLimit, filteredPhrases().length)} / ${filteredPhrases().length} frases</span><span>${icon('volume')} 点击可听发音</span></div>
        <div class="phrase-grid" id="phrase-grid">${phrasesGridHTML()}</div>
        <div class="phrase-more" id="phrase-more">${filteredPhrases().length > ui.phraseLimit ? `<button class="btn btn-secondary" data-action="show-more-phrases">Mostrar mais 100 ${icon('arrow-right')}</button>` : ''}</div>
      </div>`;
    document.title = 'Frases · Azulejo';
  }

  function updatePhraseChips() {
    $$('#phrase-filters .filter-chip').forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.group === ui.phraseGroup);
    });
    const fav = $('.fav-filter');
    if (fav) {
      fav.classList.toggle('is-active', ui.favOnly);
      fav.setAttribute('aria-pressed', ui.favOnly);
    }
    const favCount = $('.fav-filter span');
    if (favCount) favCount.textContent = state.favorites.length;
  }

  function toggleFavorite(id) {
    if (state.favorites.includes(id)) {
      state.favorites = state.favorites.filter(f => f !== id);
      showToast('Removida dos favoritos.');
    } else {
      state.favorites.push(id);
      showToast('Guardada nos favoritos.');
    }
    saveState();
    renderPhraseGrid();
    updatePhraseChips();
  }

  /* ------------------------------------------------------------------ */
  /* Culture                                                             */
  /* ------------------------------------------------------------------ */

  function resourceCardHTML(resource) {
    return `<a class="resource-card resource-${resource.accent}" href="${esc(resource.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(resource.name)} — abrir recurso externo">
      <div class="resource-top">
        <span class="resource-icon">${icon(resource.icon)}</span>
        <span class="resource-kind">${esc(resource.kind)}</span>
        <span class="resource-level">${esc(resource.level)}</span>
      </div>
      <h3>${esc(resource.name)}</h3>
      <p>${esc(resource.desc)}</p>
      <div class="resource-bottom"><span>${esc(resource.license)}</span><span class="resource-link">Abrir ${icon('arrow-right')}</span></div>
      <span class="resource-note">${esc(resource.note)}</span>
    </a>`;
  }

  const READING_RANGES = { A1: '140–180', A2: '180–230', B1: '280–340', B2: '420–500', C1: '550–650', C2: '700–850' };
  const READING_EXAMS = { A1: 'Pré-CIPLE', A2: 'CIPLE', B1: 'DEPLE', B2: 'DIPLE', C1: 'DAPLE', C2: 'DUPLE' };

  function readingCardHTML(lesson) {
    const level = lesson.unit.level;
    const grammar = lesson.grammar ? lesson.grammar.title : `Prática · ${lesson.focusTitle || 'revisão'}`;
    const words = lesson.vocab.slice(0, 3).map(word => word.pt).join(' · ');
    const exam = window.AZ_READINGS && window.AZ_READINGS[lesson.id];
    const count = exam ? exam.text.trim().split(/\s+/).filter(Boolean).length : 0;
    return `<a class="reading-card reading-${level}" href="#/read/${lesson.id}" aria-label="Ler e ouvir: ${esc(lesson.title)}">
      <div class="reading-card-top"><span class="reading-card-level">${level}</span><span class="reading-card-kind">${lesson.isLab ? 'PRÁTICA' : 'LIÇÃO'}</span></div>
      <h3>${esc(lesson.title)}</h3>
      <p>${esc(lesson.zh)}</p>
      <div class="reading-card-words">${esc(words)}</div>
      <div class="reading-card-foot"><span>${esc(grammar)}</span><b>${count ? `${count} palavras · ` : ''}Ler & ouvir ${icon('arrow-right')}</b></div>
    </a>`;
  }

  function renderReadingPage() {
    const level = LEVELS.find(item => item.id === ui.readingLevel) || LEVELS[0];
    const lessons = lessonsForLevel(level.id);
    const total = coreLessons.length + labLessons.length;
    $('#view').innerHTML = `
      <div class="page reading-page">
        ${pageHead('LEITURA & ESCUTA', 'Lê, ouve, fala.', '每节课都有一篇场景短文、一个同级别对话和一句跟读。选一个场景，直接开始阅读。', `<div class="head-badge alt">${icon('layers')}<span><strong>${total}</strong><small>leituras</small></span></div>`)}
        <div class="reading-level-tabs" role="tablist" aria-label="Escolhe o nível de leitura">
          ${LEVELS.map(item => `<button class="filter-chip ${item.id === level.id ? 'is-active' : ''}" data-action="select-reading-level" data-level="${item.id}">${item.id}<span>${lessonsForLevel(item.id).length}</span></button>`).join('')}
        </div>
        <div class="reading-list-head"><span>${level.id} · ${lessons.length} leituras · texto de ${READING_RANGES[level.id]} palavras</span><span>${icon('volume')} ${READING_EXAMS[level.id]} · texto + áudio + fala</span></div>
        <div class="reading-grid">${lessons.map(readingCardHTML).join('')}</div>
      </div>`;
    document.title = 'Leitura & escuta · Azulejo';
  }

  function filteredArticles() {
    if (ui.cultureCategory === 'all') return DATA.articles;
    return DATA.articles.filter(article => article.category === ui.cultureCategory);
  }

  function renderCulturePage() {
    const all = filteredArticles();
    const featured = all[0];
    const rest = all.slice(1, ui.cultureLimit);
    const categories = [{ key: 'all', pt: 'Tudo', zh: '全部' }, ...CULTURE_CATEGORIES];
    $('#view').innerHTML = `
      <div class="page culture-page">
        ${pageHead('CULTURA & SOTAQUE', '100 histórias de Portugal.', '100 个葡萄牙本土文化讲解：从里斯本街区、饮食、法朵、瓷砖到足球和日常语言。每篇配中文、English 和 français。', `<div class="head-badge plum">${icon('sun')}<span><strong>${DATA.articles.length}</strong><small>histórias</small></span></div>`)}
        <div class="filter-chips culture-category-chips" role="tablist" aria-label="Categorias de cultura">
          ${categories.map(cat => `<button class="filter-chip ${ui.cultureCategory === cat.key ? 'is-active' : ''}" data-action="filter-culture" data-category="${cat.key}">${esc(cat.zh)}<span>${cat.key === 'all' ? DATA.articles.length : DATA.articles.filter(a => a.category === cat.key).length}</span></button>`).join('')}
        </div>
        ${featured ? `<section class="featured-article" data-action="open-article" data-id="${featured.id}" role="button" tabindex="0" aria-label="阅读：${esc(featured.title)}">
          ${tileArt(featured, 0, true)}
          <div class="featured-copy">
            <div class="article-meta"><span>${esc(featured.kicker)}</span><span class="dot-sep"></span><span>${featured.read} min</span>${state.readArticles.includes(featured.id) ? `<span class="read-badge">${icon('check')} lido</span>` : ''}</div>
            <h2>${esc(featured.title)}</h2>
            <p class="article-zh">${esc(featured.zh)}</p>
            <p class="featured-excerpt">${esc(featured.excerpt)}</p>
            <span class="text-link">Ler o artigo ${icon('arrow-right')}</span>
          </div>
        </section>` : ''}
        <div class="culture-list-head"><span>${all.length} histórias · 中文 / English / Français</span><span>${icon('volume')} 读文化，也读语言</span></div>
        <div class="article-grid">
          ${rest.map((article, i) => `<article class="article-card ${state.readArticles.includes(article.id) ? 'is-read' : ''}" data-action="open-article" data-id="${article.id}" role="button" tabindex="0" aria-label="阅读：${esc(article.title)}">
            ${tileArt(article, i + 1, false)}
            <div class="article-card-copy">
              <div class="article-meta"><span>${esc(article.kicker)}</span><span class="dot-sep"></span><span>${article.read} min</span>${state.readArticles.includes(article.id) ? `<span class="read-badge">${icon('check')} lido</span>` : ''}</div>
              <h3>${esc(article.title)}</h3>
              <p class="article-zh">${esc(article.zh)}</p>
              <p class="article-excerpt">${esc(article.excerpt)}</p>
            </div>
          </article>`).join('')}
        </div>
        <div class="phrase-more" id="culture-more">${all.length > ui.cultureLimit ? `<button class="btn btn-secondary" data-action="show-more-culture">Mostrar mais 12 ${icon('arrow-right')}</button>` : ''}</div>
        <div class="culture-note">
          <span>${icon('sparkle')}</span>
          <p><b>Uma língua, muitas vozes.</b> 葡萄牙本土、马德拉、亚速尔群岛的口音也各不相同。先把标准葡葡听熟，再让耳朵去旅行。</p>
        </div>

        <section class="resource-section">
          <div class="resource-head">
            <div>
              <span class="eyebrow">RECURSOS EXTERNOS · PT-PT</span>
              <h2>Para ouvir Portugal fora da app.</h2>
              <p>这些是我实际筛选过的欧洲葡语资源。没有巴西葡语项目；每个都标注了级别和许可证。</p>
            </div>
            <span class="pt-only-badge">PT-PT ONLY</span>
          </div>
          <div class="resource-grid">${RESOURCES.map(resourceCardHTML).join('')}</div>
          <p class="resource-disclaimer">${icon('info')} 外部链接由第三方维护；Fala Bem 没有许可证，仅作为学习入口，不复制其内容。</p>
        </section>
      </div>`;
    document.title = 'Cultura · Azulejo';
  }

  /* ------------------------------------------------------------------ */
  /* Legal, credits and privacy                                           */
  /* ------------------------------------------------------------------ */

  function renderLegalPage() {
    const photos = [...new Map(Object.values(READING_PHOTOS).map(photo => [photo.src, photo])).values()];
    const contact = (window.AZ_CONFIG && (window.AZ_CONFIG.contactUrl || window.AZ_CONFIG.supportEmail)) || '';
    $('#view').innerHTML = `
      <div class="page legal-page">
        ${pageHead('CRÉDITOS & LICENÇAS', 'Transparência, sem letra pequena.', '这里说明照片、音频、内容、数据和考试名称的使用方式。最后更新：2026-11-20。', `<div class="head-badge alt">${icon('info')}<span><strong>©</strong><small>legal</small></span></div>`)}
        <div class="legal-grid">
          <section class="legal-block">
            <span class="eyebrow">FOTOGRAFIAS</span>
            <h2>照片与授权</h2>
            <p>阅读和听力页使用的照片来自 Wikimedia Commons，按原作者的 CC BY 或 CC BY-SA 授权使用；部分照片经过裁剪，裁剪版本沿用原授权。每张图下方保留作者与授权信息。</p>
            <ul class="legal-list">${photos.map(photo => `<li><b>${esc(photo.src.split('/').pop())}</b> — ${esc(photo.credit)} · <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></li>`).join('')}</ul>
            <p class="legal-small">如果你要再发布这些照片，请保留作者、授权和来源，并遵守 CC BY-SA 的相同方式共享要求。完整清单也在仓库的 <code>assets/photos/CREDITS.md</code>。</p>
          </section>
          <section class="legal-block">
            <span class="eyebrow">ÁUDIO</span>
            <h2>声音说明</h2>
            <p>A2 听力使用 Microsoft Edge TTS 的 <b>pt-PT-RaquelNeural</b> 神经语音生成，不是真人录音棚录音。其余级别在浏览器不支持原生音频时使用设备语音。</p>
            <p>神经语音主要用于当前版本的可听性；在扩大商业投放前，建议换成有明确商业授权的 PT-PT 真人录音，并核对 TTS 服务条款。</p>
          </section>
          <section class="legal-block">
            <span class="eyebrow">CONTEÚDO</span>
            <h2>课程、考试与商标</h2>
            <p>课程、阅读、句型、词汇表、文化讲解和模拟题由 Azulejo 独立编写。模拟考试是原创练习，不复制 CAPLE 官方试卷，也不属于 CAPLE 官方产品。</p>
            <p>“CAPLE”“CIPLE”“DEPLE”“DIPLE”“DAPLE”“DUPLE”仅用于说明考试级别和备考目标，不表示授权、合作或官方认可。考试要求以官方最新信息为准；本产品不提供移民或法律建议。</p>
          </section>
          <section class="legal-block">
            <span class="eyebrow">DADOS & PRIVACIDADE</span>
            <h2>数据与隐私</h2>
            <p>默认情况下，学习进度只保存在你的浏览器 localStorage。启用云同步后，进度会保存到你配置的 Supabase 项目；启用分析端点后，匿名产品事件会发送到该端点。许可证在本地验证，不需要上传。</p>
            <p>支付由第三方支付平台处理；我们不保存银行卡信息。购买邮箱仅用于发放许可证和售后。你可以随时清除浏览器数据或停用云同步。</p>
          </section>
          <section class="legal-block">
            <span class="eyebrow">TERMOS</span>
            <h2>使用条款</h2>
            <p>Azulejo 是独立学习产品，不保证考试通过，也不替代官方考试、课程或移民咨询。许可证仅供购买者个人使用，不可转售或公开分发。模拟考试成绩不是官方成绩。</p>
            <p>数字内容一经解锁通常不支持退款；具体退款、发票和团体席位以购买页或销售方说明为准。若发现内容错误，请通过下方联系方式反馈。</p>
          </section>
          <section class="legal-block">
            <span class="eyebrow">CONTACTO</span>
            <h2>联系与更正</h2>
            <p>内容更正、授权问题、发票或退款：${contact ? `<a href="${esc(contact)}" target="_blank" rel="noopener noreferrer">${esc(contact)}</a>` : '请通过购买页或销售方提供的联系方式联系。'}</p>
            <p class="legal-small">如果你是权利人并认为某处使用不当，请附上具体页面和权利证明；我们会先下架相关内容，再处理授权。</p>
          </section>
        </div>
        <div class="legal-actions"><a class="btn btn-primary" href="#/learn">Voltar à aprendizagem</a><a class="btn btn-secondary" href="#/pro">Azulejo Pro</a></div>
      </div>`;
    document.title = 'Créditos, licenças e privacidade · Azulejo';
  }

  /* ------------------------------------------------------------------ */
  /* Azulejo Pro: A2 mock exams, licence and paywall                     */
  /* ------------------------------------------------------------------ */

  function trackEvent(name, props) {
    if (window.AZ_TRACK) window.AZ_TRACK(name, props || {});
  }

  function isProUser() {
    return Boolean(window.AZ_LICENSE && window.AZ_LICENSE.isPro());
  }

  function licensePayload() {
    const record = window.AZ_LICENSE && window.AZ_LICENSE.current();
    return record ? record.payload : null;
  }

  function examCardsHTML(locked, level) {
    return (window.AZ_EXAMS || []).filter(set => set.level === level).map(set => `<article class="exam-card ${locked ? 'is-locked' : ''}">
      <div class="exam-card-top"><span class="eyebrow">${esc(set.level)} · MOCK ${set.n}</span><span class="exam-card-time">${set.minutes} min</span></div>
      <h3>${esc(set.title)}</h3>
      <p>${esc(set.subtitle)}</p>
      <div class="exam-card-meta"><span>${set.readingIds.length} leituras</span><span>${set.listeningIds.length} audições</span><span>${set.writing.length} escrita</span><span>${set.speaking.length} oral</span></div>
      ${locked
        ? `<button class="btn btn-secondary" data-action="paywall-exam">${icon('lock')} Desbloquear com Pro</button>`
        : `<a class="btn btn-primary" href="#/exam/${set.id}">Começar exame ${icon('arrow-right')}</a>`}
    </article>`).join('');
  }

  function licenseFormHTML() {
    const payload = licensePayload();
    if (payload) {
      return `<div class="pro-license is-active"><span class="pro-license-icon">${icon('check')}</span><div><b>Azulejo Pro ativo</b><p>${esc(payload.sub || '')} · válido até ${new Date(Number(payload.exp)).toLocaleDateString('pt-PT')}</p></div><button class="text-link" data-action="deactivate-license">Desativar</button></div>`;
    }
    return `<div class="pro-license-form">
      <label for="license-input">Já compraste? Cola aqui a tua licença.</label>
      <div class="pro-license-row"><input id="license-input" type="text" autocomplete="off" spellcheck="false" placeholder="Cola o código de licença…"><button class="btn btn-primary" data-action="activate-license">Ativar</button></div>
      <p id="license-msg" class="pro-license-msg">A licença é verificada no teu dispositivo; não precisa de conta.</p>
    </div>`;
  }

  function renderProPage(paywall) {
    const licensed = isProUser();
    const config = window.AZ_CONFIG || {};
    const checkout = config.checkoutUrl || '';
    const contact = config.contactUrl || '';
    const success = /#\/pro\/success/.test(location.hash);
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const selectedLevel = levels.includes(ui.proLevel) ? ui.proLevel : 'A1';
    const selectedExam = (window.AZ_EXAMS || []).find(set => set.level === selectedLevel && set.n === 1);
    trackEvent(paywall ? 'paywall_view' : success ? 'pro_success_view' : 'pro_view', { licensed, source: paywall ? 'exam' : 'pro', level: selectedLevel });
    $('#view').innerHTML = `
      <div class="page pro-page">
        ${pageHead('AZULEJO PRO', 'A1–C2, com método.', '60 套完整模拟考试，每个级别 10 套：阅读、听力、写作和口语。计时、交卷、分项成绩和错题回顾。适合准备 CAPLE / 葡萄牙国籍语言证明的学习者。', `<div class="head-badge gold">${icon('target')}<span><strong>60</strong><small>mock exams</small></span></div>`)}
        ${success ? `<div class="paywall-banner is-success">${icon('check')}<div><b>Pagamento recebido.</b><span>Vais receber a licença por email. Se não chegar em alguns minutos, usa o contacto abaixo com o teu recibo.</span></div><a class="text-link" href="#/pro">Ativar licença ${icon('arrow-right')}</a></div>` : ''}
        ${paywall ? `<div class="paywall-banner">${icon('lock')}<div><b>Esta parte é Pro.</b><span>这套模拟考试需要有效许可证。可以先看下面的内容和样题。</span></div><a class="text-link" href="#/pro">Ver Pro ${icon('arrow-right')}</a></div>` : ''}
        <section class="pro-hero">
          <div class="pro-hero-copy">
            <span class="eyebrow">A1–C2 · CAPLE · MOCK EXAMS</span>
            <h2>60 套模拟卷，<br>每个级别 10 套。</h2>
            <p>不是又一套练习题，而是按考试节奏做的完整模拟：阅读、听力、写作、口语，交卷后看到分项成绩和错题解释。按 CEFR 级别切换 A1、A2、B1、B2、C1、C2。</p>
            <div class="pro-actions">
              ${licensed
                ? `<a class="btn btn-primary" href="#/exam/${selectedExam ? selectedExam.id : 'a2-mock-1'}">Começar ${selectedLevel} Mock 1 ${icon('arrow-right')}</a>`
                : checkout
                  ? `<a class="btn btn-gold" href="${esc(checkout)}" target="_blank" rel="noopener noreferrer" data-action="checkout">Comprar acesso ${icon('arrow-right')}</a>`
                  : `<button class="btn btn-gold" data-action="contact-buy">获取购买方式 ${icon('arrow-right')}</button>`}
              <a class="text-link" href="#/exam">Ver exames ${icon('arrow-right')}</a>
            </div>
            <p class="pro-note">${icon('info')} 独立备考产品，不是 CAPLE 官方考试，也不提供官方证书。</p>
          </div>
          <div class="pro-price-card">
            <span class="eyebrow">ACESSO COMPLETO</span>
            <strong class="pro-price">€39</strong>
            <span class="pro-price-sub">ou ¥299 · pagamento único</span>
            <ul>
              <li>${icon('check')} 60 套完整模拟考试</li>
              <li>${icon('check')} A1–C2，每个级别 10 套</li>
              <li>${icon('check')} 阅读 + 听力 + 写作 + 口语</li>
              <li>${icon('check')} 计时、交卷、成绩报告</li>
              <li>${icon('check')} 错题解释与口语示范</li>
            </ul>
            ${licensed ? `<span class="pro-active-pill">${icon('check')} Pro ativo</span>` : `<span class="pro-price-foot">购买后获得离线许可证，无需账号。</span>`}
          </div>
        </section>

        <section class="pro-exams">
          <div class="section-head compact"><div><span class="eyebrow">MOCK EXAMS</span><h2>Escolhe o teu nível.</h2></div><span class="panel-chip">${licensed ? 'ACESSO LIBERADO' : 'PREVIEW'}</span></div>
          <div class="pro-level-tabs" role="tablist" aria-label="Nível do simulado">
            ${levels.map(level => `<button class="filter-chip ${level === selectedLevel ? 'is-active' : ''}" data-action="select-pro-level" data-level="${level}">${level}<span>10</span></button>`).join('')}
          </div>
          <div class="exam-card-grid">${examCardsHTML(!licensed, selectedLevel)}</div>
        </section>

        <section class="pro-license-section">
          <div class="section-head compact"><div><span class="eyebrow">LICENÇA</span><h2>Acesso offline, sem conta.</h2></div><span class="panel-chip">${icon('lock')} LOCAL</span></div>
          ${licenseFormHTML()}
          ${!licensed && contact ? `<p class="pro-contact">购买、发票或团体席位：<a href="${esc(contact)}" target="_blank" rel="noopener noreferrer">${esc(contact)}</a></p>` : ''}
          ${!licensed ? `<p class="pro-contact">购买后会收到离线许可证；激活不需要账号。 <a href="#/legal">Créditos, licenças e privacidade</a></p>` : ''}
        </section>

        <section class="pro-faq">
          <div class="section-head compact"><div><span class="eyebrow">FAQ</span><h2>Antes de comprar.</h2></div></div>
          <details><summary>这是官方 CAPLE 考试吗？</summary><p>不是。这是独立制作的模拟考试，用于练习考试节奏和题型；不会发放官方证书，也不代表 CAPLE 或葡萄牙政府的认可。</p></details>
          <details><summary>许可证怎么用？</summary><p>购买后会收到一串签名许可证。打开本页，粘贴到「Ativar」即可解锁全部 60 套模拟考试。许可证在本地验证，不上传学习数据。</p></details>
          <details><summary>可以在几台设备上用？</summary><p>当前许可证是本地离线验证，可在你常用的浏览器使用。正式多设备方案会绑定账号和云同步。</p></details>
          <details><summary>包含口语评分吗？</summary><p>当前版本提供口语题、录音入口和示范答案，成绩报告中的口语部分为自评。人工口语评分可作为单独服务。</p></details>
        </section>
      </div>`;
    document.title = 'Azulejo Pro · A2 CIPLE';
  }

  async function ensureRemoteExamBank() {
    const url = window.AZ_CONFIG && window.AZ_CONFIG.examApiUrl;
    const license = window.AZ_LICENSE && window.AZ_LICENSE.current();
    if (!url || !license || !license.token || window.__remoteExamBankLoaded) return false;
    try {
      const response = await fetch(url, { headers: { authorization: `Bearer ${license.token}` } });
      if (!response.ok) throw new Error(`exam bank ${response.status}`);
      const bank = await response.json();
      if (!Array.isArray(bank) || !bank.length) throw new Error('empty exam bank');
      window.AZ_EXAMS = bank;
      window.__remoteExamBankLoaded = true;
      return true;
    } catch (error) {
      console.warn('Remote exam bank unavailable; using local fallback.', error.message);
      return false;
    }
  }

  async function activateLicenseFromForm() {
    const input = $('#license-input');
    const message = $('#license-msg');
    if (!input) return;
    const token = input.value.trim();
    if (!token) {
      if (message) { message.textContent = 'Cola primeiro o código de licença.'; message.className = 'pro-license-msg is-bad'; }
      return;
    }
    const result = await window.AZ_LICENSE.activate(token);
    if (result.ok) {
      trackEvent('license_activate', { plan: result.payload.plan });
      await ensureRemoteExamBank();
      showToast('Azulejo Pro ativado.', 'success');
      renderChrome('pro');
      renderProPage(false);
    } else {
      if (message) { message.textContent = result.reason; message.className = 'pro-license-msg is-bad'; }
      trackEvent('license_activate_fail', { reason: result.reason });
    }
  }

  function examQuestionHTML(question, qid, index, section) {
    const selected = ui.exam.answers[qid];
    return `<article class="exam-question" data-qid="${qid}">
      <div class="exam-question-head"><span class="exam-qnum">${String(index + 1).padStart(2, '0')}</span><p>${esc(question.q)}</p></div>
      <div class="exam-options">
        ${question.options.map(option => `<label class="exam-option ${selected === option ? 'is-selected' : ''}">
          <input type="radio" name="${qid}" value="${esc(option)}" data-exam-qid="${qid}" data-section="${section}" ${selected === option ? 'checked' : ''}>
          <span>${esc(option)}</span>
        </label>`).join('')}
      </div>
    </article>`;
  }

  function renderExamPage() {
    const exam = ui.exam;
    if (!exam) return;
    const set = exam.set;
    const data = exam.data;
    let qIndex = 0;
    $('#view').innerHTML = `
      <div class="page exam-page">
        <header class="exam-header">
          <button class="icon-btn" data-action="close-exam" aria-label="Fechar exame">${icon('x')}</button>
          <div class="exam-header-title"><span class="eyebrow">${esc(set.title)}</span><h1>${esc(set.subtitle)}</h1></div>
          <div class="exam-clock" id="exam-clock">${formatExamTime(exam.remaining)}</div>
        </header>
        <div class="exam-disclaimer">${icon('info')} Simulado independente. Não é uma prova oficial CAPLE. O áudio usa a voz do teu navegador.</div>

        <section class="exam-section">
          <div class="exam-section-head"><span class="exam-section-num">01</span><div><span class="eyebrow">LEITURA</span><h2>Lê e responde.</h2></div><span class="exam-section-count">${data.readings.reduce((n, r) => n + r.questions.length, 0)} perguntas</span></div>
          ${data.readings.map((reading, ri) => `<div class="exam-reading">
            <div class="exam-reading-top"><h3>${esc(reading.title || `Texto ${ri + 1}`)}</h3><span>${reading.text.trim().split(/\s+/).length} palavras</span></div>
            <div class="exam-reading-text">${reading.text.split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('')}</div>
            <div class="exam-questions">${reading.questions.map(q => examQuestionHTML(q, `r${ri}q${reading.questions.indexOf(q)}`, qIndex++, 'reading')).join('')}</div>
          </div>`).join('')}
        </section>

        <section class="exam-section">
          <div class="exam-section-head"><span class="exam-section-num">02</span><div><span class="eyebrow">COMPREENSÃO ORAL</span><h2>Ouve e responde.</h2></div><span class="exam-section-count">${data.listenings.reduce((n, l) => n + l.questions.length, 0)} perguntas</span></div>
          ${data.listenings.map((track, li) => `<div class="exam-listening">
            <div class="exam-listening-top"><div><h3>${esc(track.title)}</h3><span>${esc(track.id)} · ${track.words} palavras${track.audioSrc ? ' · áudio PT-PT' : ''}</span></div>${track.audioSrc ? `<audio class="exam-audio" controls preload="metadata" src="${esc(track.audioSrc)}"></audio>` : `<button class="btn btn-secondary" data-audio="${esc(track.text)}">${icon('volume')} Ouvir</button>`}</div>
            <p class="exam-listen-hint">O texto fica escondido durante o exame; aparece no resultado.</p>
            <div class="exam-questions">${track.questions.map(q => examQuestionHTML(q, `l${li}q${track.questions.indexOf(q)}`, qIndex++, 'listening')).join('')}</div>
          </div>`).join('')}
        </section>

        <section class="exam-section">
          <div class="exam-section-head"><span class="exam-section-num">03</span><div><span class="eyebrow">ESCRITA</span><h2>Escreve.</h2></div><span class="exam-section-count">${set.writing.length} tarefas</span></div>
          ${set.writing.map((task, wi) => `<div class="exam-writing">
            <h3>${esc(task.prompt)}</h3>
            <p class="exam-writing-hint">${esc(task.hint)} · mínimo ${task.min} palavras</p>
            <textarea data-exam-writing="${wi}" rows="6" placeholder="Escreve aqui…">${esc(exam.writing[wi] || '')}</textarea>
            <span class="exam-word-count" id="exam-writing-count-${wi}">${examWordCount(exam.writing[wi] || '')} palavras</span>
          </div>`).join('')}
        </section>

        <section class="exam-section">
          <div class="exam-section-head"><span class="exam-section-num">04</span><div><span class="eyebrow">EXPRESSÃO ORAL</span><h2>Fala.</h2></div><span class="exam-section-count">${set.speaking.length} tarefas</span></div>
          ${set.speaking.map((task, si) => `<div class="exam-speaking">
            <h3>${esc(task.prompt)}</h3>
            <p class="exam-speaking-model">${icon('sparkle')} Modelo: ${esc(task.model)}</p>
            <label class="exam-check"><input type="checkbox" data-exam-speaking="${si}" ${exam.speaking[si] ? 'checked' : ''}> Gravei / pratiquei esta resposta em voz alta.</label>
          </div>`).join('')}
          <p class="exam-free-note">Podes gravar a tua resposta com o telemóvel ou usar o microfone do sistema; a app não avalia o áudio nesta versão.</p>
        </section>

        <div class="exam-submit-bar"><div><strong>${formatExamTime(exam.remaining)}</strong><span>restantes</span></div><button class="btn btn-primary" data-action="submit-exam">Entregar exame ${icon('arrow-right')}</button></div>
      </div>`;

    $$('input[data-exam-qid]').forEach(input => input.addEventListener('change', () => {
      ui.exam.answers[input.dataset.examQid] = input.value;
      input.closest('.exam-option')?.parentElement?.querySelectorAll('.exam-option').forEach(label => label.classList.toggle('is-selected', label.querySelector('input')?.checked));
    }));
    $$('textarea[data-exam-writing]').forEach(area => area.addEventListener('input', () => {
      const index = Number(area.dataset.examWriting);
      ui.exam.writing[index] = area.value;
      const count = $(`#exam-writing-count-${index}`);
      if (count) count.textContent = `${examWordCount(area.value)} palavras`;
    }));
    $$('input[data-exam-speaking]').forEach(input => input.addEventListener('change', () => {
      ui.exam.speaking[input.dataset.examSpeaking] = input.checked;
    }));
    exam.data.readings.forEach((reading, ri) => reading.questions.forEach((q, qi) => { q.__qid = `r${ri}q${qi}`; }));
    exam.data.listenings.forEach((track, li) => track.questions.forEach((q, qi) => { q.__qid = `l${li}q${qi}`; }));
    updateExamClock();
  }

  function examWordCount(value) {
    return String(value || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function formatExamTime(seconds) {
    const safe = Math.max(0, Number(seconds) || 0);
    return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
  }

  function updateExamClock() {
    if (!ui.exam) return;
    const el = $('#exam-clock');
    if (el) el.textContent = formatExamTime(ui.exam.remaining);
  }

  function examAllQuestions() {
    if (!ui.exam) return [];
    const out = [];
    ui.exam.data.readings.forEach((reading, ri) => reading.questions.forEach((q, qi) => out.push({ ...q, qid: `r${ri}q${qi}`, section: 'reading', source: reading.title })));
    ui.exam.data.listenings.forEach((track, li) => track.questions.forEach((q, qi) => out.push({ ...q, qid: `l${li}q${qi}`, section: 'listening', source: track.title })));
    return out;
  }

  async function startExam(id) {
    await ensureRemoteExamBank();
    const set = (window.AZ_EXAMS || []).find(item => item.id === id);
    if (!set) { location.hash = '#/pro'; return; }
    if (!isProUser()) {
      trackEvent('paywall_view', { source: 'exam_route', exam: id });
      location.hash = '#/pro';
      return;
    }
    const readings = set.readingIds.map(readingId => {
      const reading = window.AZ_READINGS && window.AZ_READINGS[readingId];
      const lesson = lessonMap.get(readingId);
      return { id: readingId, title: lesson ? lesson.title : readingId, text: reading ? reading.text : '', questions: reading ? reading.questions : [] };
    }).filter(item => item.text);
    const listenings = set.listeningIds.map(trackId => {
      const track = listeningById(trackId);
      return track ? { ...track, audioSrc: (window.AZ_AUDIO || {})[trackId] || '' } : null;
    }).filter(Boolean);
    ui.exam = {
      set,
      data: { readings, listenings },
      answers: {},
      writing: {},
      speaking: {},
      remaining: set.minutes * 60,
      submitted: false,
      timerId: null
    };
    trackEvent('exam_start', { exam: set.id });
    renderExamPage();
    ui.exam.timerId = setInterval(() => {
      if (!ui.exam || ui.exam.submitted) return;
      ui.exam.remaining -= 1;
      updateExamClock();
      if (ui.exam.remaining <= 0) submitExam(true);
    }, 1000);
  }

  function submitExam(auto) {
    if (!ui.exam || ui.exam.submitted) return;
    clearInterval(ui.exam.timerId);
    ui.exam.timerId = null;
    ui.exam.submitted = true;
    const questions = examAllQuestions();
    const correct = questions.filter(q => ui.exam.answers[q.qid] === q.answer);
    const writing = ui.exam.set.writing.map((task, index) => ({
      words: examWordCount(ui.exam.writing[index] || ''),
      min: task.min,
      done: examWordCount(ui.exam.writing[index] || '') >= task.min
    }));
    const speaking = ui.exam.set.speaking.map((_, index) => Boolean(ui.exam.speaking[index]));
    const percent = questions.length ? Math.round(correct.length / questions.length * 100) : 0;
    ui.exam.result = { questions, correct, writing, speaking, percent, pass: percent >= 60, auto: Boolean(auto) };
    trackEvent('exam_submit', { exam: ui.exam.set.id, percent, auto: Boolean(auto) });
    window.scrollTo({ top: 0, behavior: 'auto' });
    renderExamResult();
  }

  function renderExamResult() {
    const exam = ui.exam;
    if (!exam || !exam.result) return;
    const result = exam.result;
    const readingTotal = result.questions.filter(q => q.section === 'reading').length;
    const readingCorrect = result.correct.filter(q => q.section === 'reading').length;
    const listeningTotal = result.questions.filter(q => q.section === 'listening').length;
    const listeningCorrect = result.correct.filter(q => q.section === 'listening').length;
    $('#view').innerHTML = `
      <div class="page exam-result-page">
        <header class="exam-header">
          <button class="icon-btn" data-action="close-exam" aria-label="Fechar resultado">${icon('x')}</button>
          <div class="exam-header-title"><span class="eyebrow">${esc(exam.set.title)}</span><h1>Resultado do simulado</h1></div>
          <span class="exam-result-status ${result.pass ? 'is-pass' : 'is-fail'}">${result.pass ? 'APTO' : 'A REVER'}</span>
        </header>
        ${result.auto ? `<div class="exam-auto-note">${icon('info')} O tempo terminou; o exame foi entregue automaticamente.</div>` : ''}
        <section class="exam-result-hero">
          <div class="exam-score-ring" style="--score:${result.percent}"><strong>${result.percent}%</strong><span>${result.correct.length} / ${result.questions.length}</span></div>
          <div><span class="eyebrow">CIPLE A2 · MOCK</span><h2>${result.pass ? 'Bom trabalho.' : 'Ainda há caminho.'}</h2><p>${result.pass ? 'Passaste o critério de 60% neste simulado. Continua com o segundo mock e revê as explicações.' : 'O critério deste simulado é 60%. Revê as perguntas abaixo e repete o exame.'}</p><span class="exam-result-note">Não é uma classificação oficial CAPLE.</span></div>
        </section>
        <section class="exam-result-grid">
          <div><span>Leitura</span><strong>${readingCorrect} / ${readingTotal}</strong></div>
          <div><span>Compreensão oral</span><strong>${listeningCorrect} / ${listeningTotal}</strong></div>
          <div><span>Escrita</span><strong>${result.writing.filter(w => w.done).length} / ${result.writing.length}</strong></div>
          <div><span>Oral</span><strong>${result.speaking.filter(Boolean).length} / ${result.speaking.length}</strong></div>
        </section>
        <section class="exam-writing-review">
          <span class="eyebrow">ESCRITA</span><h2>As tuas tarefas.</h2>
          ${exam.set.writing.map((task, index) => `<div class="exam-writing-result"><div><b>Tarefa ${index + 1}</b><span>${result.writing[index].words} palavras · mínimo ${task.min}</span></div><em class="${result.writing[index].done ? 'is-good' : 'is-bad'}">${result.writing[index].done ? 'Cumprida' : 'Abaixo do mínimo'}</em><p>${esc(task.prompt)}</p></div>`).join('')}
        </section>
        <section class="exam-review-section">
          <span class="eyebrow">REVISÃO</span><h2>Perguntas e explicações.</h2>
          ${result.questions.map((q, index) => {
            const chosen = exam.answers[q.qid];
            const ok = chosen === q.answer;
            return `<article class="exam-review-item ${ok ? 'is-correct' : 'is-wrong'}">
              <div class="exam-review-head"><span>${String(index + 1).padStart(2, '0')}</span><b>${ok ? 'Correta' : 'A rever'}</b><em>${esc(q.source)}</em></div>
              <p>${esc(q.q)}</p>
              <div class="exam-review-answers"><span>${ok ? 'A tua resposta' : 'A tua resposta'}: <strong>${esc(chosen || '—')}</strong></span>${ok ? '' : `<span>Correta: <strong>${esc(q.answer)}</strong></span>`}</div>
              <p class="exam-review-explain">${esc(q.explain)}</p>
            </article>`;
          }).join('')}
        </section>
        <div class="exam-result-actions"><a class="btn btn-primary" href="#/exam/${exam.set.id}" data-action="restart-exam">Repetir exame ${icon('arrow-right')}</a><a class="btn btn-secondary" href="#/pro">Voltar a Pro</a></div>
      </div>`;
  }

  function openArticle(id) {
    const article = DATA.articles.find(a => a.id === id);
    if (!article) return;
    const index = DATA.articles.findIndex(a => a.id === id);
    const read = state.readArticles.includes(id);
    openModal(`
      <div class="article-modal">
        ${tileArt(article, index, true)}
        <div class="article-modal-body">
          <div class="article-meta"><span>${esc(article.kicker)}</span><span class="dot-sep"></span><span>${article.read} min de leitura</span></div>
          <h1>${esc(article.title)}</h1>
          <p class="article-zh">${esc(article.zh)}</p>
          ${article.titleEn ? `<p class="article-title-translations"><b>EN</b> ${esc(article.titleEn)} <span>·</span> <b>FR</b> ${esc(article.titleFr)}</p>` : ''}
          ${article.titleEn ? '' : `<p class="article-lede">${esc(article.excerpt)}</p>`}
          ${article.sections.map(section => `<section class="article-section"><h2>${esc(section.h)}</h2>${String(section.p).split(/\n{2,}/).map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>`).join('')}
          ${article.tips && article.tips.length ? `<div class="article-tips">
            <span class="eyebrow">PARA GUARDAR</span>
            <ul>${article.tips.map(tip => `<li>${esc(tip)}</li>`).join('')}</ul>
          </div>` : ''}
          <div class="article-modal-footer">
            <button class="btn ${read ? 'btn-secondary' : 'btn-primary'}" id="article-read-btn" data-action="mark-article" data-id="${id}" ${read ? 'disabled' : ''}>${read ? `${icon('check')} Já lido` : `Marcar como lido · +5 XP`}</button>
            <span class="article-footer-note">Ler também é treinar o ouvido.</span>
            <button class="text-link article-close-link" data-action="close-modal">Fechar ${icon('x')}</button>
          </div>
        </div>
      </div>`, { className: 'article-panel', label: article.title });
  }

  function markArticleRead(id) {
    if (state.readArticles.includes(id)) return;
    state.readArticles.push(id);
    addXP(5);
    saveState();
    const btn = $('#article-read-btn');
    if (btn) {
      btn.innerHTML = `${icon('check')} Já lido`;
      btn.disabled = true;
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
    }
    const card = document.querySelector(`[data-action="open-article"][data-id="${id}"]`);
    if (card) card.classList.add('is-read');
    refreshChrome();
    showToast('Artigo guardado. +5 XP', 'success');
  }

  /* ------------------------------------------------------------------ */
  /* Media: level video scenes and audio dialogues                        */
  /* ------------------------------------------------------------------ */

  let mediaPlay = null;
  let mediaTimer = null;
  let listeningPlay = null;
  let dubbingPlay = null;

  const LISTENING_IDS = {
    A1: ['u1l1', 'u1l2', 'u1l3', 'u2l1', 'u2l2', 'u2l3', 'u3l1', 'u3l2', 'u3l3', 'a1lab01'],
    A2: ['u4l1', 'u4l2', 'u4l3', 'u5l1', 'u5l2', 'u5l3', 'u6l1', 'u6l2', 'u6l3', 'a2lab01'],
    B1: ['b1l1', 'b1l2', 'b1l3', 'b1l4', 'b1l5', 'b1l6', 'b1lab01', 'b1lab02', 'b1lab03', 'b1lab04'],
    B2: ['b2l1', 'b2l2', 'b2l3', 'b2l4', 'b2l5', 'b2l6', 'b2lab01', 'b2lab02', 'b2lab03', 'b2lab04'],
    C1: ['c1l1', 'c1l2', 'c1l3', 'c1l4', 'c1l5', 'c1l6', 'c1lab01', 'c1lab02', 'c1lab03', 'c1lab04'],
    C2: ['c2l1', 'c2l2', 'c2l3', 'c2l4', 'c2l5', 'c2l6', 'c2lab01', 'c2lab02', 'c2lab03', 'c2lab04']
  };

  function listeningItems(levelId) {
    return (LISTENING_IDS[levelId] || []).map((lessonId, index) => {
      const lesson = lessonMap.get(lessonId);
      const exam = window.AZ_READINGS && window.AZ_READINGS[lessonId];
      const text = exam ? exam.text : '';
      const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      const translation = LISTENING_ZH[`${levelId}.${index + 1}`] || null;
      return {
        id: `${levelId}.${index + 1}`,
        level: levelId,
        lessonId,
        title: lesson ? lesson.title : lessonId,
        titleZh: translation ? translation.titleZh : (lesson ? lesson.zh : ''),
        zh: lesson ? lesson.zh : '',
        text,
        audioSrc: (window.AZ_AUDIO || {})[`${levelId}.${index + 1}`] || '',
        paragraphsZh: translation ? translation.paragraphsZh : [],
        questions: exam ? exam.questions : [],
        audio: (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map(part => part.trim()).filter(Boolean),
        words,
        minutes: Math.max(1, Math.round(words / 145))
      };
    });
  }

  function listeningById(id) {
    const match = String(id || '').match(/^([A-C][12])\.(\d+)$/);
    if (!match) return null;
    return listeningItems(match[1])[Number(match[2]) - 1] || null;
  }

  function mediaById(id) {
    return DATA.media.find(item => item.id === id) || null;
  }

  function mediaCompletedInLevel(levelId) {
    return DATA.media.filter(item => item.level === levelId && state.media[item.id]).length;
  }

  function sceneArt(scene) {
    const themes = {
      cafe: ['#5a382d', '#241714', '#e8b25b'],
      market: ['#4e5a36', '#222c1c', '#e0a94e'],
      clinic: ['#1f5a64', '#0b3038', '#9dc5bd'],
      office: ['#1c4052', '#0b2230', '#d9a648'],
      meeting: ['#4b3942', '#241a20', '#d9a648'],
      bookshop: ['#4f2d33', '#251619', '#e0a94e'],
      studio: ['#164451', '#08232d', '#9dc5bd']
    };
    const [from, to, accent] = themes[scene] || themes.studio;
    let detail = '';
    if (scene === 'cafe') {
      detail = `<g stroke="rgba(247,238,222,.32)" stroke-width="2" fill="none">
        <path d="M0 372h900M76 118h246v254H76z"/>
        <path d="M108 118V72c0-27 22-49 49-49h34c27 0 49 22 49 49v46"/>
        <path d="M96 240h210M96 306h210"/>
        <path d="M520 346h310v32H520zM548 346V228h88v118M660 346V264h96v82"/>
        <path d="M790 346V190M754 190h72M790 190v-34"/>
        <path d="M196 238h34v26h-34zM262 238h34v26h-34z"/>
        <path d="M230 204c-10-13 10-19 0-32M270 204c-10-13 10-19 0-32"/>
        <path d="M36 410h828" opacity=".5"/>
      </g>
      <g fill="${accent}" opacity=".55"><circle cx="790" cy="176" r="17"/><circle cx="790" cy="176" r="37" fill="none" stroke="${accent}" opacity=".28"/></g>`;
    } else if (scene === 'market') {
      detail = `<g stroke="rgba(247,238,222,.3)" stroke-width="2" fill="none">
        <path d="M0 92h900M0 132h900"/>
        <path d="M30 92l34 44h48l-34-44M160 92l34 44h48l-34-44M290 92l34 44h48l-34-44M420 92l34 44h48l-34-44M550 92l34 44h48l-34-44M680 92l34 44h48l-34-44"/>
        <path d="M40 356h820M80 356V210h250v146M430 356V210h200v146M700 356V210h150v146"/>
        <path d="M100 210v-36M100 174h210M300 174v36M470 210v-42M470 168h120M570 168v42"/>
        <path d="M110 244h190M110 286h190M460 244h140M460 286h140"/>
        <path d="M34 420h832" opacity=".4"/>
      </g>
      <g fill="${accent}" opacity=".62">
        <circle cx="148" cy="320" r="17"/><circle cx="190" cy="318" r="14"/><circle cx="230" cy="323" r="18"/><circle cx="270" cy="318" r="13"/>
        <circle cx="506" cy="320" r="17"/><circle cx="548" cy="316" r="14"/><circle cx="590" cy="322" r="18"/>
        <circle cx="760" cy="320" r="16"/><circle cx="800" cy="316" r="20"/>
      </g>`;
    } else if (scene === 'clinic') {
      detail = `<g stroke="rgba(247,238,222,.31)" stroke-width="2" fill="none">
        <path d="M0 372h900M70 96h260v276H70zM98 96v276M302 96v276M98 180h204M98 246h204"/>
        <path d="M520 372V168h250v204M540 168v-30h210v30M560 200h170M560 240h170"/>
        <path d="M820 372V274h44v98M842 274v-58"/>
        <path d="M850 216c-24 0-34-18-34-38 22 0 34 16 34 38zM850 216c24 0 34-18 34-38-22 0-34 16-34 38z"/>
        <path d="M128 118v52M102 144h52"/>
      </g>
      <g fill="${accent}" opacity=".3"><rect x="560" y="264" width="170" height="10" rx="5"/><rect x="560" y="292" width="120" height="8" rx="4"/></g>`;
    } else if (scene === 'office') {
      detail = `<g stroke="rgba(247,238,222,.3)" stroke-width="2" fill="none">
        <path d="M0 372h900M70 76h350v240H70zM70 132h350M70 188h350M70 244h350M188 76v240M304 76v240"/>
        <path d="M470 340h370v32H470zM520 340V242h140v98M760 340V270h48v70"/>
        <path d="M548 242v-56h84v56M580 186v-16M610 186v-16"/>
        <path d="M470 120h330M500 120v-38h270v38"/>
        <path d="M40 420h820" opacity=".4"/>
      </g>
      <g fill="${accent}" opacity=".42"><rect x="96" y="92" width="30" height="24"/><rect x="212" y="92" width="30" height="24"/><rect x="322" y="92" width="30" height="24"/><circle cx="800" cy="152" r="13"/></g>`;
    } else if (scene === 'meeting') {
      detail = `<g stroke="rgba(247,238,222,.3)" stroke-width="2" fill="none">
        <path d="M0 372h900M60 104h260v150H60zM88 104v150M288 104v150M88 156h200M88 208h200"/>
        <path d="M120 380h660M170 380v-48h560v48M210 380v32M690 380v32"/>
        <path d="M170 332h560M250 332v-36h400v36"/>
        <path d="M80 156h30M80 208h30M270 156h30M270 208h30" opacity=".7"/>
      </g>
      <g fill="${accent}" opacity=".4"><rect x="112" y="116" width="50" height="28" rx="3"/><rect x="180" y="116" width="50" height="28" rx="3"/><rect x="248" y="116" width="50" height="28" rx="3"/></g>
      <g fill="none" stroke="${accent}" stroke-width="2" opacity=".4"><circle cx="760" cy="330" r="16"/><circle cx="800" cy="330" r="16"/><circle cx="840" cy="330" r="16"/></g>`;
    } else if (scene === 'bookshop') {
      detail = `<g stroke="rgba(247,238,222,.3)" stroke-width="2" fill="none">
        <path d="M0 372h900M56 72h250v284H56zM80 72v284M282 72v284M80 150h202M80 226h202M80 302h202"/>
        <path d="M420 72h230v284H420zM444 72v284M626 72v284M444 150h182M444 226h182M444 302h182"/>
        <path d="M710 356V146h140v210M730 356V194h100v162"/>
        <path d="M780 194v-36M758 158h44"/>
        <path d="M730 356v28M820 356v28"/>
      </g>
      <g fill="${accent}" opacity=".36">
        <rect x="92" y="112" width="16" height="30"/><rect x="114" y="106" width="13" height="36"/><rect x="133" y="116" width="18" height="26"/><rect x="158" y="110" width="12" height="32"/>
        <rect x="456" y="112" width="14" height="30"/><rect x="476" y="108" width="18" height="34"/><rect x="500" y="116" width="12" height="26"/>
        <rect x="736" y="212" width="12" height="30"/><rect x="754" y="208" width="16" height="34"/>
      </g>`;
    } else {
      detail = `<g stroke="rgba(247,238,222,.28)" stroke-width="2" fill="none">
        <path d="M0 372h900M80 90h200v80H80zM620 90h200v80H620zM80 210h200v60H80zM620 210h200v60H620z"/>
        <path d="M430 356V126M430 126h-60M370 126v-30h56v30"/>
        <path d="M430 126v-44M400 82h60"/>
        <path d="M394 196c44-30 92-30 136 0M380 230c56-38 118-38 174 0M366 264c68-44 142-44 210 0"/>
        <path d="M300 372h300M320 372v-24h260v24"/>
      </g>
      <g fill="${accent}" opacity=".35"><circle cx="430" cy="366" r="8"/><circle cx="430" cy="352" r="6"/><circle cx="430" cy="340" r="4"/></g>`;
    }
    return `<svg class="scene-art" viewBox="0 0 900 506" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="scene-${scene}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
      <rect width="900" height="506" fill="url(#scene-${scene})"/>
      ${detail}
      <rect width="900" height="506" fill="url(#scene-vignette-${scene})" opacity=".55"/>
      <defs><radialGradient id="scene-vignette-${scene}" cx="50%" cy="42%" r="72%"><stop stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>
    </svg>`;
  }

  function waveformHTML(count, active) {
    return `<div class="waveform ${active ? 'is-active' : ''}" aria-hidden="true">
      ${Array.from({ length: count }, (_, i) => {
        const h = 18 + Math.abs(Math.sin(i * 1.37) * 0.62 + Math.cos(i * 0.71) * 0.38) * 78;
        return `<i style="--h:${h.toFixed(0)}%;--d:${(i % 7) * 0.08}s"></i>`;
      }).join('')}
    </div>`;
  }

  function actorPortrait(index) {
    const palettes = [
      { skin: '#e7b68d', hair: '#2a1a14', shirt: '#c46745', accent: '#f2d1ad' },
      { skin: '#c98e68', hair: '#1d1412', shirt: '#2e7d83', accent: '#e9bd92' },
      { skin: '#f0c7a1', hair: '#7a4b2a', shirt: '#7c8b63', accent: '#f6d9ba' }
    ];
    const p = palettes[index % palettes.length];
    return `<svg viewBox="0 0 170 240" aria-hidden="true">
      <ellipse cx="85" cy="229" rx="57" ry="13" fill="rgba(0,0,0,.2)"/>
      <path d="M27 240c2-55 24-83 58-83s56 28 58 83z" fill="${p.shirt}"/>
      <path d="M58 150h54v34c0 14-11 25-27 25s-27-11-27-25z" fill="${p.skin}"/>
      <path d="M55 164c-9-2-15-9-15-19v-38c0-30 19-50 45-50s45 20 45 50v38c0 10-6 17-15 19z" fill="${p.skin}"/>
      <path d="M55 102c0-28 13-45 30-45 19 0 43 12 43 46-12-9-23-15-39-17-11 10-21 25-34 29z" fill="${p.hair}"/>
      <circle cx="69" cy="117" r="2.6" fill="#2b1b16"/>
      <circle cx="101" cy="117" r="2.6" fill="#2b1b16"/>
      <path d="M78 137c5 4 10 4 15 0" stroke="#8c4f3c" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M65 169l20 17 20-17" stroke="${p.accent}" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M52 201c13 9 22 13 33 13s20-4 33-13" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none"/>
    </svg>`;
  }

  function mediaLevelTabHTML(level, active) {
    const items = DATA.media.filter(item => item.level === level.id);
    const done = mediaCompletedInLevel(level.id);
    return `<button class="media-level-tab level-${level.color} ${level.id === active ? 'is-active' : ''}" data-action="select-media-level" data-level="${level.id}">
      <b>${level.id}</b><span>${esc(level.name)}</span><i>${done}/${items.length}</i>
    </button>`;
  }

  function dubbingCardHTML(item) {
    return `<a class="dubbing-card" href="#/dubbing/${item.id}" aria-label="Dublar ${esc(item.title)}">
      <span class="dubbing-card-icon">${icon('mic')}</span>
      <span><b>${item.level} · ${esc(item.title)}</b><small>${esc(item.zh)} · ${item.lines.length} falas</small></span>
      ${icon('arrow-right')}
    </a>`;
  }

  function listeningCardHTML(item) {
    const done = state.listening[item.id];
    return `<a class="listening-card ${done ? 'is-done' : ''}" href="#/listening/${item.id}" aria-label="Ouvir ${item.id}: ${esc(item.title)}">
      <div class="listening-card-top"><span class="listening-number">${item.id}</span>${done ? `<span class="listening-check">${icon('check')}</span>` : `<span class="listening-play">${icon('play')}</span>`}</div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.zh)}</p>
      <div class="listening-card-foot"><span>${item.words} palavras · ${item.minutes} min</span><b>Ouvir ${icon('arrow-right')}</b></div>
    </a>`;
  }

  function renderMediaPage() {
    const levelId = ui.mediaLevel || 'A1';
    const level = levelMeta(levelId);
    const items = DATA.media.filter(item => item.level === levelId);
    const listening = listeningItems(levelId);
    const listeningDone = listening.filter(item => state.listening[item.id]).length;
    const video = items.find(item => item.type === 'video');
    const audio = items.find(item => item.type === 'audio');
    const done = Object.keys(state.media).length;
    const total = DATA.media.length;
    const levelDone = mediaCompletedInLevel(levelId);
    $('#view').innerHTML = `
      <div class="page media-page">
        ${pageHead('VÍDEO & ÁUDIO', 'Vê, ouve, reage.', '每个级别有 10 篇独立编号听力、1 场情景视频、1 段音频对话和 1 个短剧配音。先听，再看，再开口。', `<div class="head-badge alt">${icon('video')}<span><strong>${done}</strong><small>/ ${total} feitos</small></span></div>`)}
        <div class="media-stats">
          <div><strong>6</strong><span>níveis</span></div>
          <div><strong>60</strong><span>faixas de escuta</span></div>
          <div><strong>${DATA.media.filter(i => i.type === 'video').length}</strong><span>vídeos-cena</span></div>
          <div><strong>${listeningDone}/10</strong><span>escuta neste nível</span></div>
        </div>
        <div class="media-level-tabs">${LEVELS.map(l => mediaLevelTabHTML(l, levelId)).join('')}</div>
        <div class="media-level-note"><span class="level-badge level-${level.color}">${level.id}</span><p><b>${esc(level.name)} · ${esc(level.zh)}</b> ${esc(level.blurb)}</p></div>
        <section class="listening-section">
          <div class="section-head compact">
            <div><span class="eyebrow">ESCUTA · 10 CENAS</span><h2>Dez histórias para ouvir.</h2><p>Cada faixa tem número próprio, texto completo e velocidade ajustável.</p></div>
            <div class="listening-progress"><strong>${listeningDone}</strong><span>/ 10 ouvidas</span></div>
          </div>
          <div class="listening-grid">${listening.map(listeningCardHTML).join('')}</div>
        </section>

        <div class="media-feature-grid">
          ${video ? mediaFeatureCard(video, 'VÍDEO-CENA', 'play') : ''}
          ${audio ? mediaFeatureCard(audio, 'DIÁLOGO ÁUDIO', 'volume') : ''}
        </div>

        <section class="dubbing-section">
          <div class="section-head compact"><div><span class="eyebrow">DUBLAGEM · 6 CENAS</span><h2>Dá voz à cena.</h2><p>Ouve a fala, grava a tua voz e recebe uma nota de pronúncia e velocidade.</p></div></div>
          <div class="dubbing-grid">${DATA.media.filter(item => item.type === 'video').map(dubbingCardHTML).join('')}</div>
        </section>

        <section class="media-how">
          <div><span class="eyebrow">COMO PRATICAR</span><h2>Três passagens, três ouvidos.</h2></div>
          <ol>
            <li><b>1 · Sem legendas</b><span>先看/听一遍，只抓语气和场景，不逐字翻译。</span></li>
            <li><b>2 · Com transcrição</b><span>打开字幕，把没听清的词和连读标出来。</span></li>
            <li><b>3 · Faz tu</b><span>音频对话可切换角色，轮到你时大声说出来。</span></li>
          </ol>
        </section>
      </div>`;
    document.title = 'Vídeo & áudio · Azulejo';
  }

  function startListening(id) {
    const item = listeningById(id);
    if (!item) {
      location.hash = '#/media';
      return;
    }
    Speech.stop();
    const previousAudio = $('#listening-native');
    if (previousAudio) previousAudio.pause();
    listeningPlay = {
      item,
      playing: false,
      playToken: 0,
      rate: Number(state.settings.listeningRate) || 0.9,
      transcript: false,
      answers: {}
    };
    renderListeningPlayer();
  }

  function listeningQuestionHTML(question, index) {
    const chosen = listeningPlay.answers[index];
    const options = question.options.map(option => {
      let cls = '';
      if (chosen) {
        if (option === question.answer) cls = 'is-correct';
        else if (option === chosen.value) cls = 'is-wrong';
      }
      return `<button class="immersion-option ${cls}" data-action="listening-answer" data-q="${index}" data-value="${esc(option)}" ${chosen ? 'disabled' : ''}>${esc(option)}</button>`;
    }).join('');
    return `<div class="immersion-question">
      <p class="immersion-q">${esc(question.q)}</p>
      <div class="immersion-options">${options}</div>
      ${chosen ? `<p class="immersion-feedback ${chosen.correct ? 'is-ok' : 'is-bad'}">${chosen.correct ? 'Boa!' : `A resposta certa é «${esc(question.answer)}».`} ${esc(question.explain || '')}</p>` : ''}
    </div>`;
  }

  function renderListeningPlayer() {
    if (!listeningPlay) return;
    const item = listeningPlay.item;
    const completed = state.listening[item.id];
    const questions = (item.questions || []).slice(0, 2);
    const rateLabel = listeningPlay.rate.toFixed(2).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',');
    $('#view').innerHTML = `
      <div class="listening-shell">
        <header class="lesson-topbar media-topbar">
          <button class="close-btn" data-action="close-listening" aria-label="退出听力">${icon('x')}</button>
          <div class="media-top-title"><span class="level-badge level-${levelMeta(item.level).color}">${item.level}</span><strong>${esc(item.id)} · ${esc(item.title)}</strong></div>
          <span class="media-type-pill">ESCUTA</span>
          <span class="xp-badge">${icon('volume')} ${item.words} palavras</span>
        </header>
        <div class="media-player-scroll">
          <div class="media-player-wrap listening-wrap">
            <div class="listening-hero">
              <img class="listening-photo" src="${readingPhoto(item.title).src}" alt="${esc(readingPhoto(item.title).alt)}">
              <div class="listening-hero-copy">
                <span class="eyebrow light">${esc(item.id)} · ${esc(item.level)}</span>
                <h1>${esc(item.title)}</h1>
                <p>${esc(item.titleZh || item.zh)}</p>
                <small class="listening-photo-credit">Foto: ${esc(readingPhoto(item.title).credit)} · Wikimedia Commons</small>
              </div>
            </div>
            <div class="listening-toolbar">
              <button class="media-play-btn" data-action="listening-toggle" aria-label="${listeningPlay.playing ? '暂停' : '播放'}">${icon(listeningPlay.playing ? 'pause' : 'play')}</button>
              <div class="listening-speed">
                <label for="listening-speed">Velocidade <b id="listening-speed-value">${rateLabel}×</b></label>
                <input id="listening-speed" type="range" min="0.6" max="1.4" step="0.05" value="${listeningPlay.rate}" aria-label=" velocidade de reprodução">
              </div>
              <button class="media-chip ${listeningPlay.transcript ? 'is-on' : ''}" data-action="listening-transcript">${icon('captions')} ${listeningPlay.transcript ? 'Ocultar texto' : 'Mostrar texto'}</button>
              <span class="listening-meta">${item.words} palavras · ${item.minutes} min${item.audioSrc ? ' · áudio PT-PT' : ''}</span>
            </div>
            ${item.audioSrc ? `<audio id="listening-native" src="${esc(item.audioSrc)}" preload="metadata"></audio>` : ''}
            ${listeningPlay.transcript
              ? `<div class="listening-text">${item.text.split(/\n+/).filter(Boolean).map((part, index) => `<div class="listening-bi"><p>${esc(part)}</p>${item.paragraphsZh[index] ? `<small>${esc(item.paragraphsZh[index])}</small>` : ''}</div>`).join('')}</div>`
              : `<div class="listening-locked"><span>${icon('volume')}</span><p>Ouve primeiro. Abre o texto e a tradução só quando precisares.</p></div>`}
            <section class="listening-questions">
              <div class="section-head compact"><div><span class="eyebrow">COMPREENSÃO</span><h2>O que ficou?</h2></div><span class="listening-count">${Object.keys(listeningPlay.answers).length} / ${questions.length}</span></div>
              ${questions.map((question, index) => listeningQuestionHTML(question, index)).join('')}
            </section>
            <div class="listening-actions">
              <span>${completed ? `${icon('check')} ouvida em ${new Date(completed.completedAt).toLocaleDateString('pt-PT')}` : 'Ouve a faixa completa e responde às perguntas.'}</span>
              <button class="btn ${completed ? 'btn-secondary' : 'btn-primary'}" data-action="listening-complete" ${completed ? 'disabled' : ''}>${completed ? 'Concluída' : 'Marcar como ouvida'} ${icon('check')}</button>
            </div>
          </div>
        </div>
      </div>`;
    document.title = `${item.id} · ${item.title} · Azulejo`;
    const nativeAudio = $('#listening-native');
    if (nativeAudio) {
      nativeAudio.playbackRate = listeningPlay.rate;
      nativeAudio.addEventListener('play', () => {
        if (!listeningPlay) return;
        listeningPlay.playing = true;
        updateListeningPlayButton();
      });
      nativeAudio.addEventListener('pause', () => {
        if (!listeningPlay) return;
        listeningPlay.playing = false;
        updateListeningPlayButton();
      });
      nativeAudio.addEventListener('ended', () => {
        if (!listeningPlay) return;
        listeningPlay.playing = false;
        updateListeningPlayButton();
      });
      if (listeningPlay.playing) {
        nativeAudio.playbackRate = listeningPlay.rate;
        nativeAudio.play().catch(() => { listeningPlay.playing = false; updateListeningPlayButton(); });
      }
    }
    const speed = $('#listening-speed');
    if (speed) {
      speed.addEventListener('input', event => {
        const value = $('#listening-speed-value');
        if (value) value.textContent = `${Number(event.target.value).toFixed(2).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',')}×`;
      });
      speed.addEventListener('change', event => applyListeningRate(Number(event.target.value)));
    }
  }

  function updateListeningPlayButton() {
    if (!listeningPlay) return;
    const button = $('.media-play-btn');
    if (!button) return;
    button.innerHTML = icon(listeningPlay.playing ? 'pause' : 'play');
    button.setAttribute('aria-label', listeningPlay.playing ? 'Pausar' : 'Reproduzir');
  }

  function applyListeningRate(rate) {
    if (!listeningPlay) return;
    listeningPlay.rate = Number(rate) || 0.9;
    state.settings.listeningRate = listeningPlay.rate;
    saveState();
    const nativeAudio = $('#listening-native');
    if (nativeAudio) {
      nativeAudio.playbackRate = listeningPlay.rate;
      return;
    }
    const wasPlaying = listeningPlay.playing;
    Speech.stop();
    listeningPlay.playToken += 1;
    listeningPlay.playing = false;
    renderListeningPlayer();
    if (wasPlaying) {
      showToast(`Velocidade ${String(listeningPlay.rate).replace('.', ',')}× · a repetir do início`, 'success');
      setTimeout(() => { if (listeningPlay) startListeningPlayback(); }, 120);
    }
  }

  function startListeningPlayback() {
    if (!listeningPlay || listeningPlay.playing) return;
    if (listeningPlay.item.audioSrc) {
      const nativeAudio = $('#listening-native');
      if (!nativeAudio) return;
      if (nativeAudio.ended) nativeAudio.currentTime = 0;
      nativeAudio.playbackRate = listeningPlay.rate;
      nativeAudio.play().catch(() => showToast('Não foi possível reproduzir o áudio.', 'error'));
      return;
    }
    const token = ++listeningPlay.playToken;
    listeningPlay.playing = true;
    renderListeningPlayer();
    Speech.speakSequence(listeningPlay.item.audio, null, listeningPlay.rate, () => {
      if (listeningPlay && listeningPlay.playToken === token) {
        listeningPlay.playing = false;
        renderListeningPlayer();
      }
    });
  }

  function toggleListening() {
    if (!listeningPlay) return;
    if (listeningPlay.item.audioSrc) {
      const nativeAudio = $('#listening-native');
      if (!nativeAudio) return;
      if (nativeAudio.paused) {
        if (nativeAudio.ended) nativeAudio.currentTime = 0;
        nativeAudio.playbackRate = listeningPlay.rate;
        nativeAudio.play().catch(() => showToast('Não foi possível reproduzir o áudio.', 'error'));
      } else {
        nativeAudio.pause();
      }
      return;
    }
    if (listeningPlay.playing) {
      Speech.stop();
      listeningPlay.playing = false;
      listeningPlay.playToken += 1;
      renderListeningPlayer();
      return;
    }
    startListeningPlayback();
  }

  function setListeningRate(rate) {
    applyListeningRate(rate);
  }

  function completeListening() {
    if (!listeningPlay) return;
    state.listening[listeningPlay.item.id] = { completedAt: new Date().toISOString() };
    saveState();
    showToast(`Ouvida: ${listeningPlay.item.id}`, 'success');
    renderListeningPlayer();
  }

  function closeListening() {
    Speech.stop();
    const nativeAudio = $('#listening-native');
    if (nativeAudio) nativeAudio.pause();
    listeningPlay = null;
    go('#/media');
  }

  function startDubbing(id) {
    const item = mediaById(id);
    if (!item || item.type !== 'video') {
      location.hash = '#/media';
      return;
    }
    Speech.stop();
    if (dubbingPlay) {
      dubbingPlay.discard = true;
      stopDubbingStream();
    }
    dubbingPlay = {
      item,
      index: 0,
      rate: Number(state.settings.listeningRate) || 0.9,
      recording: false,
      processing: false,
      discard: false,
      stream: null,
      recorder: null,
      recognition: null,
      recognitionSupported: Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
      startedAt: 0,
      duration: 0,
      heard: '',
      audioUrl: '',
      result: null,
      error: ''
    };
    renderDubbing();
  }

  function stopDubbingStream() {
    if (!dubbingPlay) return;
    try { if (dubbingPlay.recognition) dubbingPlay.recognition.stop(); } catch (err) { /* noop */ }
    try { if (dubbingPlay.recorder && dubbingPlay.recorder.state !== 'inactive') dubbingPlay.recorder.stop(); } catch (err) { /* noop */ }
    try { if (dubbingPlay.stream) dubbingPlay.stream.getTracks().forEach(track => track.stop()); } catch (err) { /* noop */ }
  }

  function dubbingOrder() {
    if (!dubbingPlay) return [];
    return dubbingPlay.item.cast.map(person => person.role);
  }

  function renderDubbing() {
    if (!dubbingPlay) return;
    const item = dubbingPlay.item;
    const line = item.lines[dubbingPlay.index];
    const prevBest = state.dubbing[item.id];
    const result = dubbingPlay.result;
    $('#view').innerHTML = `
      <div class="dubbing-shell">
        <header class="lesson-topbar media-topbar">
          <button class="close-btn" data-action="dubbing-close" aria-label="退出配音">${icon('x')}</button>
          <div class="media-top-title"><span class="level-badge level-${levelMeta(item.level).color}">${item.level}</span><strong>Dublagem · ${esc(item.title)}</strong></div>
          <span class="media-type-pill">DUBLAGEM</span>
          <span class="xp-badge">${icon('mic')} ${dubbingPlay.index + 1} / ${item.lines.length}</span>
        </header>
        <div class="media-player-scroll">
          <div class="media-player-wrap dubbing-wrap">
            <div class="dubbing-stage">
              ${sceneArt(item.scene)}
              <div class="dubbing-stage-top"><span>${item.level} · ${esc(item.title)}</span><span>${dubbingPlay.index + 1} / ${item.lines.length}</span></div>
              <div class="dubbing-cast">
                ${item.cast.map((person, i) => `<span class="dubbing-actor ${line.who === person.name ? 'is-speaking' : ''}">${actorPortrait(i)}<b>${esc(person.name)}</b></span>`).join('')}
              </div>
              <div class="dubbing-subtitle" aria-live="polite">
                <span>${esc(line.who)}</span>
                <p>${esc(line.pt)}</p>
                <small>${esc(line.zh)}</small>
              </div>
              ${!dubbingPlay.recording && !dubbingPlay.processing ? `<button class="stage-play dubbing-listen" data-action="dubbing-listen" aria-label="Ouvir a fala">${icon('volume')}<span>Ouvir a fala</span></button>` : ''}
            </div>

            <div class="dubbing-timeline">
              ${item.lines.map((l, i) => `<button class="media-seg ${i === dubbingPlay.index ? 'is-current' : ''} ${i < dubbingPlay.index ? 'is-done' : ''}" data-action="dubbing-jump" data-index="${i}" aria-label="Fala ${i + 1}"></button>`).join('')}
            </div>

            <div class="dubbing-toolbar">
              <div class="dubbing-nav">
                <button class="media-ctrl" data-action="dubbing-prev" aria-label="Fala anterior" ${dubbingPlay.index === 0 ? 'disabled' : ''}>${icon('arrow-left')}</button>
                <button class="media-ctrl" data-action="dubbing-next" aria-label="Fala seguinte" ${dubbingPlay.index === item.lines.length - 1 ? 'disabled' : ''}>${icon('arrow-right')}</button>
              </div>
              <div class="dubbing-speeds">
                ${[0.7, 0.85, 1, 1.15].map(rate => `<button class="media-chip ${Math.abs(dubbingPlay.rate - rate) < 0.01 ? 'is-on' : ''}" data-action="dubbing-rate" data-rate="${rate}">${String(rate).replace('.', ',')}×</button>`).join('')}
              </div>
              <button class="btn ${dubbingPlay.recording ? 'btn-secondary' : 'btn-primary'} dubbing-record-btn" data-action="dubbing-record" ${dubbingPlay.processing ? 'disabled' : ''}>
                ${icon(dubbingPlay.recording ? 'pause' : 'mic')} ${dubbingPlay.recording ? 'Parar gravação' : 'Gravar a minha voz'}
              </button>
            </div>

            <div class="dubbing-target">
              <span class="eyebrow">A TUA FALA</span>
              <blockquote>${esc(line.pt)}</blockquote>
              <p>${esc(line.zh)}</p>
            </div>

            ${dubbingPlay.recording ? `<div class="dubbing-status is-live">${icon('mic')} A gravar… fala agora. ${dubbingPlay.recognitionSupported ? 'Fala de forma natural.' : 'O reconhecimento de fala não está disponível neste navegador.'}</div>` : ''}
            ${dubbingPlay.processing ? `<div class="dubbing-status">${icon('volume')} A analisar a tua gravação…</div>` : ''}
            ${dubbingPlay.error ? `<div class="dubbing-status is-bad">${esc(dubbingPlay.error)}</div>` : ''}
            ${result ? `<div class="dubbing-result">
              <div class="dubbing-score"><strong>${result.overall}</strong><span>nota</span></div>
              <div class="dubbing-score-copy">
                <b>Pronúncia ${result.pron == null ? '—' : result.pron + '%'} · Velocidade ${result.speed}%</b>
                <span>${result.speedLabel} · ${result.duration.toFixed(1)} s</span>
                <small>${result.heard ? `Ouvi: «${esc(result.heard)}»` : 'Não foi possível transcrever a fala; a nota usa apenas a velocidade.'}</small>
              </div>
              ${dubbingPlay.audioUrl ? `<audio class="dubbing-audio" controls src="${dubbingPlay.audioUrl}"></audio>` : ''}
            </div>` : ''}
            ${!result && !dubbingPlay.recording && !dubbingPlay.processing && !dubbingPlay.error ? `<p class="dubbing-hint">${icon('info')} Ouve a fala original, grava a tua voz e compara pronúncia e velocidade. Podes repetir as vezes que quiseres.</p>` : ''}
            ${prevBest ? `<p class="dubbing-best">${icon('star')} Melhor nota nesta cena: ${prevBest.best} · ${new Date(prevBest.at).toLocaleDateString('pt-PT')}</p>` : ''}
          </div>
        </div>
      </div>`;
    document.title = `Dublagem · ${item.title} · Azulejo`;
  }

  function startDubbingRecording() {
    if (!dubbingPlay || dubbingPlay.recording) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      dubbingPlay.error = 'Este navegador não permite gravar áudio. Usa Chrome, Edge ou Safari.';
      renderDubbing();
      return;
    }
    if (dubbingPlay.stream) dubbingPlay.stream.getTracks().forEach(track => track.stop());
    const line = dubbingPlay.item.lines[dubbingPlay.index];
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      if (!dubbingPlay) { stream.getTracks().forEach(track => track.stop()); return; }
      dubbingPlay.stream = stream;
      dubbingPlay.recording = true;
      dubbingPlay.processing = false;
      dubbingPlay.result = null;
      dubbingPlay.error = '';
      dubbingPlay.heard = '';
      dubbingPlay.audioUrl = '';
      dubbingPlay.startedAt = performance.now();
      const recorder = new MediaRecorder(stream);
      dubbingPlay.recorder = recorder;
      const chunks = [];
      recorder.ondataavailable = event => { if (event.data && event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        if (!dubbingPlay) return;
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        dubbingPlay.audioUrl = URL.createObjectURL(blob);
        dubbingPlay.duration = Math.max(0.2, (performance.now() - dubbingPlay.startedAt) / 1000);
        dubbingPlay.processing = false;
        if (dubbingPlay.stream) dubbingPlay.stream.getTracks().forEach(track => track.stop());
        if (!dubbingPlay.discard) setTimeout(() => { if (dubbingPlay && !dubbingPlay.discard) finishDubbingScore(); }, 450);
      };
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (Recognition) {
        const recognition = new Recognition();
        recognition.lang = 'pt-PT';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = event => {
          if (dubbingPlay) dubbingPlay.heard = event.results[0][0].transcript || '';
        };
        recognition.onerror = () => { /* keep rate-only scoring if speech recognition fails */ };
        dubbingPlay.recognition = recognition;
        try { recognition.start(); } catch (err) { dubbingPlay.recognition = null; }
      }
      try {
        recorder.start();
        renderDubbing();
      } catch (err) {
        dubbingPlay.error = 'Não foi possível iniciar a gravação.';
        dubbingPlay.recording = false;
        renderDubbing();
      }
    }).catch(() => {
      if (!dubbingPlay) return;
      dubbingPlay.error = 'Permite o microfone para gravar a tua voz.';
      dubbingPlay.recording = false;
      renderDubbing();
    });
  }

  function stopDubbingRecording() {
    if (!dubbingPlay || !dubbingPlay.recording) return;
    dubbingPlay.recording = false;
    dubbingPlay.processing = true;
    try { if (dubbingPlay.recognition) dubbingPlay.recognition.stop(); } catch (err) { /* noop */ }
    try {
      if (dubbingPlay.recorder && dubbingPlay.recorder.state !== 'inactive') dubbingPlay.recorder.stop();
      else {
        dubbingPlay.processing = false;
        finishDubbingScore();
      }
    } catch (err) {
      dubbingPlay.processing = false;
      finishDubbingScore();
    }
    renderDubbing();
  }

  function finishDubbingScore() {
    if (!dubbingPlay) return;
    const line = dubbingPlay.item.lines[dubbingPlay.index];
    const targetWords = normalizeAnswer(line.pt).split(' ').filter(Boolean);
    const heardWords = new Set(normalizeAnswer(dubbingPlay.heard).split(' ').filter(Boolean));
    const matched = targetWords.filter(word => heardWords.has(word)).length;
    const pron = dubbingPlay.recognitionSupported && dubbingPlay.heard ? Math.round((matched / Math.max(1, targetWords.length)) * 100) : null;
    const duration = Math.max(0.2, dubbingPlay.duration || 0.2);
    const wps = targetWords.length / duration;
    const expected = 2.2 * dubbingPlay.rate;
    const speed = Math.max(0, Math.round(100 - (Math.abs(wps - expected) / expected) * 100));
    const overall = pron == null ? speed : Math.round(pron * 0.7 + speed * 0.3);
    dubbingPlay.result = {
      pron,
      speed,
      overall,
      duration,
      heard: dubbingPlay.heard,
      speedLabel: wps < expected * 0.75 ? 'Um pouco lento' : wps > expected * 1.3 ? 'Um pouco rápido' : 'Velocidade natural'
    };
    const previous = state.dubbing[dubbingPlay.item.id];
    if (!previous || overall > previous.best) {
      state.dubbing[dubbingPlay.item.id] = { best: overall, at: new Date().toISOString() };
      saveState();
    }
    renderDubbing();
  }

  function playDubbingLine() {
    if (!dubbingPlay) return;
    const line = dubbingPlay.item.lines[dubbingPlay.index];
    const roleIndex = Math.max(0, dubbingPlay.item.cast.findIndex(person => person.name === line.who));
    Speech.speakMediaLine(line.pt, roleIndex, dubbingPlay.rate);
  }

  function closeDubbing() {
    if (!dubbingPlay) { go('#/media'); return; }
    const item = dubbingPlay.item;
    dubbingPlay.discard = true;
    stopDubbingStream();
    dubbingPlay = null;
    go(`#/media/${item.id}`);
  }

  function jumpDubbing(index) {
    if (!dubbingPlay) return;
    const next = Number(index);
    if (!Number.isInteger(next) || next < 0 || next >= dubbingPlay.item.lines.length) return;
    if (dubbingPlay.recording) stopDubbingRecording();
    Speech.stop();
    if (dubbingPlay.audioUrl) URL.revokeObjectURL(dubbingPlay.audioUrl);
    dubbingPlay.index = next;
    dubbingPlay.result = null;
    dubbingPlay.heard = '';
    dubbingPlay.audioUrl = '';
    dubbingPlay.error = '';
    renderDubbing();
  }

  function mediaFeatureCard(item, label, iconName) {
    const done = state.media[item.id];
    const art = item.type === 'video'
      ? `<div class="media-feature-art video">${sceneArt(item.scene)}<div class="media-thumb-actors">${item.cast.slice(0, 2).map((person, i) => `<span>${actorPortrait(i)}<b>${esc(person.name)}</b></span>`).join('')}</div><span class="media-play-badge">${icon('play')}</span><span class="media-time">${item.minutes} min</span></div>`
      : `<div class="media-feature-art audio"><div class="audio-thumb">${waveformHTML(32, false)}</div><div class="audio-thumb-cast">${item.cast.slice(0, 2).map(person => `<span>${esc(person.name)}</span>`).join('')}</div><span class="media-play-badge">${icon('volume')}</span><span class="media-time">${item.minutes} min</span></div>`;
    return `<a class="media-feature ${item.type} ${done ? 'is-done' : ''}" href="#/media/${item.id}">
      ${art}
      <div class="media-feature-copy">
        <div class="media-feature-meta"><span class="eyebrow">${item.level} · ${label}</span>${done ? `<span class="read-badge">${icon('check')} concluído</span>` : ''}</div>
        <h2>${esc(item.title)}</h2>
        <p class="article-zh">${esc(item.zh)}</p>
        <p>${esc(item.description)}</p>
        <div class="media-feature-bottom"><span>${icon('clock')} ${item.minutes} min</span><span>${item.lines.length} falas</span><span class="text-link">${done ? 'Rever' : 'Começar'} ${icon('arrow-right')}</span></div>
      </div>
    </a>`;
  }

  function startMedia(id) {
    const item = mediaById(id);
    if (!item) {
      location.hash = '#/media';
      return;
    }
    Speech.stop();
    clearTimeout(mediaTimer);
    ui.mediaLevel = item.level;
    mediaPlay = {
      item,
      index: 0,
      playing: false,
      finished: false,
      captions: item.type === 'video',
      rate: 0.9,
      rolePlay: false,
      userRole: item.cast[0]?.role || 'A',
      showTranscript: item.type === 'video',
      answers: {},
      token: 0,
      xpAwarded: 0
    };
    renderMediaPlayer();
  }

  function mediaCurrentLine() {
    return mediaPlay ? mediaPlay.item.lines[mediaPlay.index] || null : null;
  }

  function mediaCastIndex(name) {
    if (!mediaPlay) return 0;
    return Math.max(0, mediaPlay.item.cast.findIndex(person => person.name === name));
  }

  function mediaBubbleSide() {
    const line = mediaCurrentLine();
    if (!line) return 'left';
    const idx = mediaCastIndex(line.who);
    return idx === 0 ? 'left' : idx === 1 ? 'right' : 'center';
  }

  function renderMediaPlayer() {
    if (!mediaPlay) return;
    const item = mediaPlay.item;
    const line = mediaCurrentLine();
    const isVideo = item.type === 'video';
    const isUserTurn = mediaPlay.rolePlay && line.role === mediaPlay.userRole;
    const progress = item.lines.length ? (mediaPlay.index + (mediaPlay.finished ? 1 : 0)) / item.lines.length : 0;
    const cast = item.cast;
    $('#view').innerHTML = `
      <div class="media-shell">
        <header class="lesson-topbar media-topbar">
          <button class="close-btn" data-action="close-media" aria-label="退出影音练习">${icon('x')}</button>
          <div class="media-top-title"><span class="level-badge level-${levelMeta(item.level).color}">${item.level}</span><strong>${esc(item.title)}</strong></div>
          <span class="media-type-pill">${isVideo ? 'VÍDEO-CENA' : 'ÁUDIO'}</span>
          <span class="xp-badge">${icon('star')} +${item.xp || 25} XP</span>
        </header>
        <div class="media-player-scroll">
          <div class="media-player-wrap">
            <div class="media-stage ${isVideo ? 'is-video' : 'is-audio'} ${mediaPlay.playing ? 'is-playing' : ''}">
              ${isVideo ? `
                <div class="video-stage">
                  ${sceneArt(item.scene)}
                  <div class="stage-topline"><span>${item.level} · ${({ cafe: 'CAFÉ', market: 'MERCADO', clinic: 'CONSULTA', office: 'ESCRITÓRIO', meeting: 'REUNIÃO', bookshop: 'LIVRARIA' }[item.scene]) || 'CENA'}</span><span>${mediaPlay.index + 1} / ${item.lines.length}</span></div>
                  <div class="stage-actors actors-${cast.length}">
                    ${cast.map((person, i) => `<div class="stage-actor ${line.who === person.name ? 'is-speaking' : ''} ${mediaPlay.rolePlay && person.role === mediaPlay.userRole ? 'is-user' : ''}">
                      ${actorPortrait(i)}<span>${esc(person.name)}</span>
                    </div>`).join('')}
                  </div>
                  ${mediaPlay.captions ? `<div class="stage-bubble is-${mediaBubbleSide()}"><span>${esc(line.who)}</span><p>${esc(line.pt)}</p></div>` : ''}
                  ${!mediaPlay.playing && !isUserTurn ? `<button class="stage-play" data-action="media-toggle" aria-label="${mediaPlay.finished ? '重复播放' : '播放'}">${icon('play')}<span>${mediaPlay.finished ? 'Ouvir outra vez' : mediaPlay.index === 0 ? 'Começar' : 'Continuar'}</span></button>` : ''}
                  ${mediaPlay.captions ? `<div class="caption-bar"><span>${esc(line.pt)}</span><small>${esc(line.zh)}</small></div>` : ''}
                </div>`
              : `
                <div class="audio-stage">
                  <div class="stage-topline"><span>${item.level} · DIÁLOGO ÁUDIO</span><span>${mediaPlay.index + 1} / ${item.lines.length}</span></div>
                  <div class="audio-speaker-row">
                    ${cast.map((person, i) => `<span class="speaker-chip ${line.who === person.name ? 'is-speaking' : ''}">${actorPortrait(i).replace('<svg', '<svg class="speaker-face"')}<b>${esc(person.name)}</b></span>`).join('')}
                  </div>
                  ${waveformHTML(48, mediaPlay.playing)}
                  <div class="audio-current ${isUserTurn ? 'is-user-turn' : ''}">
                    ${mediaPlay.captions || isUserTurn
                      ? `<span class="audio-who">${isUserTurn ? 'A TUA VEZ' : esc(line.who)}</span><p>${esc(line.pt)}</p><small>${esc(line.zh)}</small>`
                      : `<span class="audio-who">${esc(line.who)}</span><p class="audio-listen-prompt">Ouve com atenção.</p><small>按「Legendas」显示台词，先让耳朵工作。</small>`}
                  </div>
                  ${!mediaPlay.playing && !isUserTurn ? `<button class="stage-play compact" data-action="media-toggle" aria-label="${mediaPlay.finished ? '重复播放' : '播放'}">${icon('play')}<span>${mediaPlay.finished ? 'Ouvir outra vez' : mediaPlay.index === 0 ? 'Começar' : 'Continuar'}</span></button>` : ''}
                </div>`}
            </div>

            <div class="media-timeline" role="progressbar" aria-label="Progresso do diálogo" aria-valuemin="0" aria-valuemax="${item.lines.length}" aria-valuenow="${mediaPlay.index + 1}">
              ${item.lines.map((l, i) => `<button class="media-seg ${i < mediaPlay.index ? 'is-done' : ''} ${i === mediaPlay.index ? 'is-current' : ''} ${l.role === mediaPlay.userRole && mediaPlay.rolePlay ? 'is-user' : ''}" data-action="jump-media" data-index="${i}" aria-label="Fala ${i + 1}"></button>`).join('')}
            </div>

            <div class="media-controls">
              <div class="media-controls-left">
                <button class="media-ctrl" data-action="media-prev" aria-label="上一句" ${mediaPlay.index === 0 ? 'disabled' : ''}>${icon('arrow-left')}</button>
                <button class="media-play-btn" data-action="media-toggle" aria-label="${mediaPlay.playing ? '暂停' : '播放'}">${icon(mediaPlay.playing ? 'pause' : 'play')}</button>
                <button class="media-ctrl" data-action="media-next" aria-label="下一句">${icon('arrow-right')}</button>
                <button class="media-ctrl" data-action="media-repeat" aria-label="重复本句">${icon('review')}</button>
              </div>
              <div class="media-controls-right">
                <button class="media-chip" data-action="media-rate">${mediaPlay.rate.toFixed(1).replace('.', ',')}×</button>
                <button class="media-chip ${mediaPlay.captions ? 'is-on' : ''}" data-action="media-captions">${icon('captions')} Legendas</button>
                ${isVideo ? `<button class="media-chip" data-action="open-dubbing" data-id="${item.id}">${icon('mic')} Dublar</button>` : ''}
                ${!isVideo ? `<button class="media-chip ${mediaPlay.rolePlay ? 'is-on' : ''}" data-action="toggle-roleplay">${icon('mic')} Praticar</button>` : ''}
              </div>
            </div>

            ${!isVideo && mediaPlay.rolePlay ? `<div class="roleplay-bar">
              <span>Escolhe a tua personagem:</span>
              ${cast.map(person => `<button class="role-chip ${mediaPlay.userRole === person.role ? 'is-active' : ''}" data-action="set-role" data-role="${person.role}">${esc(person.name)}</button>`).join('')}
              ${isUserTurn ? `<button class="btn btn-primary small" data-action="media-next">A minha vez · continuar ${icon('arrow-right')}</button>` : `<small>As tuas falas ficam em silêncio para leres em voz alta.</small>`}
            </div>` : ''}

            <div class="media-info">
              <div>
                <span class="eyebrow">${item.level} · ${isVideo ? 'VÍDEO-CENA' : 'DIÁLOGO ÁUDIO'}</span>
                <h1>${esc(item.title)} <span>${esc(item.zh)}</span></h1>
                <p>${esc(item.description)}</p>
              </div>
              <div class="media-info-meta"><span>${icon('clock')} ${item.minutes} min</span><span>${icon('chat')} ${item.lines.length} falas</span></div>
            </div>

            <section class="media-transcript-section">
              <div class="section-head compact">
                <div><span class="eyebrow">TRANSCRIÇÃO</span><h2>Palavra por palavra.</h2></div>
                ${!isVideo ? `<button class="btn btn-secondary small" data-action="toggle-transcript">${mediaPlay.showTranscript ? 'Ocultar' : 'Mostrar transcrição'}</button>` : ''}
              </div>
              ${mediaPlay.showTranscript ? `<div class="transcript-list">
                ${item.lines.map((l, i) => `<button class="transcript-line ${i === mediaPlay.index ? 'is-current' : ''}" data-action="jump-media" data-index="${i}">
                  <span class="transcript-speaker">${esc(l.who)}</span>
                  <span class="transcript-pt">${esc(l.pt)}</span>
                  <span class="transcript-zh">${esc(l.zh)}</span>
                  <span class="transcript-audio">${icon('volume')}</span>
                </button>`).join('')}
              </div>` : `<div class="transcript-locked"><span>${icon('volume')}</span><p>先只听声音。准备好后，再打开逐句文字。</p></div>`}
            </section>

            ${mediaPlay.finished ? mediaQuestionsHTML(item) : `<div class="media-listen-note">${icon('info')} 听完整段对话后，会出现 3 道理解题。${mediaPlay.rolePlay ? ' 角色练习中，你的台词会暂停等待。' : ''}</div>`}
          </div>
        </div>
      </div>`;
    document.title = `${item.title} · Azulejo`;
  }

  function mediaQuestionsHTML(item) {
    const answers = mediaPlay.answers;
    const answeredCount = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const allDone = answeredCount === item.questions.length;
    return `<section class="media-quiz">
      <div class="quiz-head"><div><span class="eyebrow">COMPREENSÃO</span><h2>O que ficou?</h2></div>
        <div class="quiz-score"><strong>${correctCount}</strong><span>/ ${item.questions.length}${allDone ? ' · ' + (correctCount === item.questions.length ? 'Perfeito!' : 'Boa!') : ''}</span></div>
      </div>
      ${item.questions.map((q, qi) => {
        const answer = answers[qi];
        return `<article class="quiz-card ${answer ? (answer.correct ? 'is-correct' : 'is-wrong') : ''}">
          <div class="quiz-q"><span>${qi + 1}</span><div><strong>${esc(q.q)}</strong><small>${esc(q.zh)}</small></div></div>
          <div class="quiz-options">
            ${q.options.map(opt => {
              const chosen = answer && answer.choice === opt;
              const correct = answer && opt === q.answer;
              return `<button class="quiz-option ${chosen ? 'is-chosen' : ''} ${correct ? 'is-correct' : ''} ${chosen && !correct ? 'is-wrong' : ''}" data-action="answer-media" data-q="${qi}" data-value="${esc(opt)}" ${answer ? 'disabled' : ''}>${esc(opt)}${correct ? icon('check') : chosen ? icon('x') : ''}</button>`;
            }).join('')}
          </div>
          ${answer ? `<p class="quiz-explain">${answer.correct ? icon('check') : icon('info')} ${esc(q.explain)}</p>` : ''}
        </article>`;
      }).join('')}
      <div class="quiz-actions">
        <button class="btn btn-secondary" data-action="media-restart">${icon('review')} Ouvir outra vez</button>
        <button class="btn btn-primary" data-action="close-media">Voltar ao início ${icon('arrow-right')}</button>
      </div>
    </section>`;
  }

  function mediaAdvance(auto) {
    if (!mediaPlay || mediaPlay.finished) return;
    if (mediaPlay.index >= mediaPlay.item.lines.length - 1) {
      finishMedia();
      return;
    }
    mediaPlay.index += 1;
    renderMediaPlayer();
    if (auto && mediaPlay.playing) playMediaCurrent();
  }

  function playMediaCurrent() {
    if (!mediaPlay || mediaPlay.finished) return;
    const line = mediaCurrentLine();
    if (!line) return;
    if (mediaPlay.rolePlay && line.role === mediaPlay.userRole) {
      mediaPlay.playing = false;
      renderMediaPlayer();
      return;
    }
    mediaPlay.playing = true;
    mediaPlay.token += 1;
    const token = mediaPlay.token;
    renderMediaPlayer();
    let done = false;
    const advance = () => {
      if (done || !mediaPlay || mediaPlay.token !== token || !mediaPlay.playing) return;
      done = true;
      clearTimeout(mediaTimer);
      mediaTimer = setTimeout(() => {
        if (!mediaPlay || mediaPlay.token !== token || !mediaPlay.playing) return;
        mediaAdvance(true);
      }, 600);
    };
    const words = line.pt.split(/\s+/).length;
    mediaTimer = setTimeout(advance, Math.max(5200, words * 620 + 2200));
    Speech.speakMediaLine(line.pt, mediaCastIndex(line.who), mediaPlay.rate, advance);
  }

  function pauseMedia() {
    if (!mediaPlay) return;
    mediaPlay.token += 1;
    mediaPlay.playing = false;
    clearTimeout(mediaTimer);
    Speech.stop();
    renderMediaPlayer();
  }

  function toggleMedia() {
    if (!mediaPlay) return;
    if (mediaPlay.finished) {
      restartMedia();
      return;
    }
    const line = mediaCurrentLine();
    if (mediaPlay.rolePlay && line.role === mediaPlay.userRole) {
      mediaPlay.playing = true;
      mediaAdvance(true);
      return;
    }
    if (mediaPlay.playing) pauseMedia();
    else playMediaCurrent();
  }

  function jumpMedia(index) {
    if (!mediaPlay) return;
    const wasPlaying = mediaPlay.playing;
    mediaPlay.token += 1;
    clearTimeout(mediaTimer);
    Speech.stop();
    mediaPlay.index = Math.max(0, Math.min(mediaPlay.item.lines.length - 1, index));
    mediaPlay.finished = false;
    mediaPlay.playing = false;
    renderMediaPlayer();
    if (wasPlaying) playMediaCurrent();
  }

  function finishMedia() {
    if (!mediaPlay || mediaPlay.finished) return;
    mediaPlay.playing = false;
    mediaPlay.finished = true;
    mediaPlay.token += 1;
    clearTimeout(mediaTimer);
    Speech.stop();
    const id = mediaPlay.item.id;
    if (!state.media[id]) {
      const xp = mediaPlay.item.xp || 25;
      state.media[id] = { completedAt: new Date().toISOString(), best: 0 };
      mediaPlay.xpAwarded = xp;
      addXP(xp);
      saveState();
      soundFX('complete');
      launchConfetti();
      showToast(`+${xp} XP · ${mediaPlay.item.title}`, 'success');
    }
    renderMediaPlayer();
  }

  function restartMedia() {
    if (!mediaPlay) return;
    Speech.stop();
    clearTimeout(mediaTimer);
    mediaPlay.index = 0;
    mediaPlay.finished = false;
    mediaPlay.playing = false;
    mediaPlay.answers = {};
    mediaPlay.token += 1;
    renderMediaPlayer();
  }

  function answerMediaQuestion(qi, value) {
    if (!mediaPlay || !mediaPlay.finished || mediaPlay.answers[qi]) return;
    const question = mediaPlay.item.questions[qi];
    if (!question) return;
    const correct = value === question.answer;
    mediaPlay.answers[qi] = { choice: value, correct };
    soundFX(correct ? 'correct' : 'wrong');
    const all = Object.keys(mediaPlay.answers).length === mediaPlay.item.questions.length;
    if (all) {
      const record = state.media[mediaPlay.item.id] || { completedAt: new Date().toISOString(), best: 0 };
      const score = Object.values(mediaPlay.answers).filter(a => a.correct).length;
      record.best = Math.max(record.best || 0, Math.round(score / mediaPlay.item.questions.length * 100));
      state.media[mediaPlay.item.id] = record;
      saveState();
    }
    renderMediaPlayer();
  }

  function closeMedia() {
    Speech.stop();
    clearTimeout(mediaTimer);
    mediaPlay = null;
    go('#/media');
  }

  /* ------------------------------------------------------------------ */
  /* Progress                                                            */
  /* ------------------------------------------------------------------ */

  function renderProgressPage() {
    const lvl = levelInfo();
    const streak = currentStreak();
    const learned = learnedWordCount();
    const done = completedCount();
    const days = lastSevenDays();
    const values = days.map(d => state.activity[dateKey(d)] || 0);
    const max = Math.max(Number(state.goal) || 40, ...values, 20);
    const totalWeek = values.reduce((a, b) => a + b, 0);
    const unlocked = DATA.achievements.filter(a => a.test(state));
    const unlockedIds = unlocked.map(a => a.id);

    $('#view').innerHTML = `
      <div class="page progress-page">
        ${pageHead('PROGRESSO', 'O teu caminho, em números.', '不是和别人比，而是看见自己已经走了多远。', `<button class="btn btn-secondary small" data-action="open-settings">${icon('settings')} Ajustar meta</button>`)}
        <div class="progress-top">
          <section class="level-card">
            <div class="level-ring">
              ${ring(lvl.pct, 142, 9, 'var(--gold)', 'rgba(255,255,255,.14)')}
              <div class="level-ring-center"><span>NÍVEL</span><strong>${lvl.n}</strong></div>
            </div>
            <div class="level-copy">
              <span class="eyebrow light">A TUA JORNADA</span>
              <h2>${lvl.title}</h2>
              <p>${lvl.current} / ${lvl.needed} XP para o próximo nível.</p>
              <div class="level-bar"><span style="width:${lvl.pct * 100}%"></span></div>
              <div class="level-meta"><span>${state.xp} XP no total</span><span>${done} / ${allLessons.length} lições</span></div>
            </div>
          </section>
          <div class="progress-mini-stats">
            <div class="mini-stat"><span class="stat-icon gold">${icon('flame')}</span><div><strong>${streak}</strong><span>dias seguidos</span></div></div>
            <div class="mini-stat"><span class="stat-icon blue">${icon('book')}</span><div><strong>${learned}</strong><span>palavras</span></div></div>
            <div class="mini-stat"><span class="stat-icon green">${icon('check')}</span><div><strong>${done}</strong><span>lições</span></div></div>
            <div class="mini-stat"><span class="stat-icon plum">${icon('award')}</span><div><strong>${unlocked.length}</strong><span>conquistas</span></div></div>
          </div>
        </div>

        <section class="panel level-progress-panel">
          <div class="panel-head"><div><span class="eyebrow">A1 → C2</span><h2>Seis níveis, um só caminho.</h2></div><span class="panel-chip">${icon('chart')} CEFR</span></div>
          <div class="level-progress-grid">
            ${LEVELS.map(level => {
              const lessons = lessonsForLevel(level.id);
              const levelDone = lessons.filter(l => state.lessons[l.id]).length;
              const levelMedia = DATA.media.filter(item => item.level === level.id && state.media[item.id]).length;
              const pct = lessons.length ? Math.round(levelDone / lessons.length * 100) : 0;
              return `<button class="level-progress-card level-${level.color}" data-action="go-level" data-level="${level.id}">
                <span class="level-progress-top"><b>${level.id}</b><span>${pct}%</span></span>
                <strong>${esc(level.name)}</strong>
                <small>${levelDone}/${lessons.length} lições · ${levelMedia}/${DATA.media.filter(item => item.level === level.id).length} media</small>
                <span class="level-tab-bar"><i style="width:${pct}%"></i></span>
              </button>`;
            }).join('')}
          </div>
        </section>

        <div class="progress-grid">
          <section class="panel activity-panel">
            <div class="panel-head"><div><span class="eyebrow">ESTA SEMANA</span><h2>${totalWeek} XP em sete dias.</h2></div><span class="panel-chip">${icon('target')} meta ${state.goal} XP</span></div>
            <div class="chart">
              <div class="chart-goal" style="bottom:${((Number(state.goal) || 40) / max) * 100}%"><span>${state.goal} XP</span></div>
              ${days.map((d, i) => {
                const value = values[i];
                const h = value ? Math.max(6, (value / max) * 100) : 2;
                const today = dateKey(d) === dateKey();
                return `<div class="bar-col ${today ? 'is-today' : ''}">
                  <span class="bar-value">${value || ''}</span>
                  <div class="bar-track"><span class="bar-fill" style="height:${h}%"></span></div>
                  <span class="bar-label">${new Intl.DateTimeFormat('pt-PT', { weekday: 'short' }).format(d).replace('.', '')}<b>${d.getDate()}</b></span>
                </div>`;
              }).join('')}
            </div>
          </section>

          <section class="panel achievements-panel">
            <div class="panel-head"><div><span class="eyebrow">CONQUISTAS</span><h2>${unlocked.length} de ${DATA.achievements.length}.</h2></div><span class="panel-chip">${icon('award')} pequenas vitórias</span></div>
            <div class="achievement-grid">
              ${DATA.achievements.map(a => {
                const has = unlockedIds.includes(a.id);
                return `<div class="achievement ${has ? 'is-unlocked' : 'is-locked'}">
                  <span class="ach-icon">${icon(has ? a.icon : 'lock')}</span>
                  <div><strong>${esc(a.title)}</strong><span>${esc(a.desc)}</span></div>
                  ${has ? `<span class="ach-check">${icon('check')}</span>` : ''}
                </div>`;
              }).join('')}
            </div>
          </section>
        </div>

        <section class="panel mastery-panel">
          <div class="panel-head"><div><span class="eyebrow">POR UNIDADE</span><h2>Onde estás, unidade a unidade.</h2></div><span class="panel-chip">${icon('chart')} ${Math.round(done / allLessons.length * 100)}% do curso</span></div>
          <div class="mastery-list">
            ${DATA.units.map(unit => {
              const unitDone = unit.lessons.filter(l => state.lessons[l.id]).length;
              const pct = unitDone / unit.lessons.length;
              return `<div class="mastery-row theme-${unit.color}">
                <span class="mastery-num">${pad(unit.order)}</span>
                <div class="mastery-copy"><strong>${esc(unit.title)}</strong><span>${esc(unit.zh)}</span></div>
                <div class="mastery-bar"><span style="width:${pct * 100}%"></span></div>
                <span class="mastery-count">${unitDone} / ${unit.lessons.length}</span>
              </div>`;
            }).join('')}
          </div>
        </section>

        <div class="danger-zone">
          <div><strong>Os teus dados ficam neste navegador.</strong><span>进度保存在 localStorage 中，不会上传。换设备或清理浏览器数据会丢失。</span></div>
          <button class="text-link danger" data-action="request-reset">Apagar progresso</button>
        </div>
      </div>`;
    document.title = 'Progresso · Azulejo';
  }

  /* ------------------------------------------------------------------ */
  /* Modals, settings and onboarding                                     */
  /* ------------------------------------------------------------------ */

  function openModal(content, options = {}) {
    const root = $('#modal-root');
    ui.lastFocus = document.activeElement;
    root.innerHTML = `<div class="modal-backdrop" data-action="close-modal"></div>
      <div class="modal-panel ${options.className || ''}" role="dialog" aria-modal="true" aria-label="${esc(options.label || 'Janela')}" tabindex="-1">
        ${options.showClose === false ? '' : `<button class="modal-close" data-action="close-modal" aria-label="关闭">${icon('x')}</button>`}
        ${content}
      </div>`;
    ui.modalOpen = true;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => {
      root.classList.add('is-open');
      const panel = $('.modal-panel', root);
      if (panel) panel.focus();
    });
  }

  function closeModal(silent) {
    const root = $('#modal-root');
    if (!root) return;
    root.classList.remove('is-open');
    root.innerHTML = '';
    ui.modalOpen = false;
    document.body.classList.remove('modal-open');
    if (!silent && ui.lastFocus && typeof ui.lastFocus.focus === 'function') {
      try { ui.lastFocus.focus(); } catch (err) { /* noop */ }
    }
  }

  function openConfirm(title, body, action, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar') {
    openModal(`<div class="confirm-modal">
      <span class="confirm-icon">${icon('info')}</span>
      <h2>${esc(title)}</h2>
      <p>${esc(body)}</p>
      <div class="confirm-actions">
        <button class="btn btn-secondary" data-action="close-modal">${esc(cancelLabel)}</button>
        <button class="btn btn-danger" data-action="${action}">${esc(confirmLabel)}</button>
      </div>
    </div>`, { className: 'confirm-panel', label: title });
  }

  function setCloudMessage(text, bad) {
    const message = $('#cloud-msg');
    if (message) {
      message.textContent = text;
      message.className = `cloud-msg ${bad ? 'is-bad' : ''}`;
    }
  }

  function cloudPanelHTML() {
    const cloud = window.AZ_CLOUD;
    if (!cloud || !cloud.configured()) return '';
    const session = cloud.session();
    if (session) {
      return `<div class="cloud-account">
        <div class="cloud-account-head"><span class="cloud-avatar">${esc((session.user.email || '?')[0].toUpperCase())}</span><div><b>${esc(session.user.email)}</b><span>Sessão iniciada · sincronização automática</span></div><button class="text-link" data-action="cloud-signout">Sair</button></div>
        <p class="cloud-help">每次学习后自动上传；换设备时先「Carregar」再继续。</p>
        <div class="cloud-actions"><button class="btn btn-secondary" data-action="cloud-push">${icon('arrow-up')} Enviar agora</button><button class="btn btn-secondary" data-action="cloud-pull">${icon('arrow-down')} Carregar da nuvem</button></div>
        <p id="cloud-msg" class="cloud-msg"></p>
      </div>`;
    }
    return `<div class="cloud-auth">
      <p class="cloud-help">登录后自动同步学习进度；不登录也可以继续用本地模式。</p>
      <div class="cloud-fields">
        <label><span>Email</span><input id="cloud-email" type="email" autocomplete="email" placeholder="tu@exemplo.com"></label>
        <label><span>Palavra-passe</span><input id="cloud-password" type="password" autocomplete="current-password" minlength="6" placeholder="mínimo 6 caracteres"></label>
      </div>
      <div class="cloud-actions"><button class="btn btn-primary" data-action="cloud-signin">Entrar</button><button class="btn btn-secondary" data-action="cloud-signup">Criar conta</button></div>
      <p id="cloud-msg" class="cloud-msg">A conta é opcional. Os dados ficam no teu projeto Supabase.</p>
    </div>`;
  }

  async function cloudSignIn() {
    const email = $('#cloud-email')?.value.trim();
    const password = $('#cloud-password')?.value || '';
    if (!email || password.length < 6) { setCloudMessage('Preenche um email e uma palavra-passe com pelo menos 6 caracteres.', true); return; }
    try {
      await window.AZ_CLOUD.signIn(email, password);
      showToast('Sessão iniciada.', 'success');
      openSettings();
    } catch (error) {
      setCloudMessage(error.message, true);
    }
  }

  async function cloudSignUp() {
    const email = $('#cloud-email')?.value.trim();
    const password = $('#cloud-password')?.value || '';
    if (!email || password.length < 6) { setCloudMessage('Preenche um email e uma palavra-passe com pelo menos 6 caracteres.', true); return; }
    try {
      const result = await window.AZ_CLOUD.signUp(email, password);
      if (result.needsConfirmation) {
        setCloudMessage('Conta criada. Confirma o email antes de iniciar sessão.', false);
      } else {
        showToast('Conta criada e sessão iniciada.', 'success');
        openSettings();
      }
    } catch (error) {
      setCloudMessage(error.message, true);
    }
  }

  async function cloudPush() {
    try {
      await window.AZ_CLOUD.push(state);
      showToast('Progresso enviado para a nuvem.', 'success');
      setCloudMessage('Progresso enviado.', false);
    } catch (error) {
      setCloudMessage(error.message, true);
    }
  }

  async function cloudPull() {
    try {
      const remote = await window.AZ_CLOUD.pull();
      if (!remote || !remote.state) { setCloudMessage('Ainda não há progresso na nuvem.', false); return; }
      ui.cloudRemote = remote.state;
      openConfirm('Carregar o progresso da nuvem?', `O progresso na nuvem é de ${new Date(remote.updatedAt).toLocaleString('pt-PT')}. O progresso local desta máquina será substituído.`, 'cloud-apply-remote', 'Carregar da nuvem', 'Manter local');
    } catch (error) {
      setCloudMessage(error.message, true);
    }
  }

  function openSettings() {
    const lvl = levelInfo();
    const ptVoices = Speech.ptVoices();
    const allVoices = Speech.voices.slice().sort((a, b) => (a.lang || '').localeCompare(b.lang || ''));
    const voiceOptions = allVoices.map(v => {
      const isPt = /^pt([-_]|$)/i.test(v.lang);
      return `<option value="${esc(v.voiceURI)}" ${state.settings.voiceURI === v.voiceURI ? 'selected' : ''}>${isPt ? '★ ' : ''}${esc(v.name)} (${esc(v.lang)})</option>`;
    }).join('');
    openModal(`<div class="settings-modal">
      <div class="modal-heading"><span class="eyebrow">DEFINIÇÕES</span><h2>Um pouco à tua medida.</h2><p>这些设置只影响这台设备，随时可以改。</p></div>
      <form id="settings-form">
        <div class="field">
          <label for="settings-name">Como te chamas? <span>怎么称呼你</span></label>
          <input id="settings-name" name="name" type="text" maxlength="24" value="${esc(state.name)}" placeholder="O teu nome">
        </div>
        <div class="field">
          <span class="field-label">Meta diária <span>每天的目标</span></span>
          <div class="goal-picker">
            ${[[20, '5 分钟', 'Leve'], [40, '10 分钟', 'Equilibrada'], [60, '15 分钟', 'Intensa']].map(([value, label, name]) => `<label class="goal-option ${Number(state.goal) === value ? 'is-active' : ''}">
              <input type="radio" name="goal" value="${value}" ${Number(state.goal) === value ? 'checked' : ''}>
              <strong>${label}</strong><span>${name} · ${value} XP</span>
            </label>`).join('')}
          </div>
        </div>
        <div class="field-row">
          <label class="switch-row" for="settings-sound">
            <span><strong>音效</strong><small>答对、答错和完成时的提示音</small></span>
            <input id="settings-sound" name="sound" type="checkbox" ${state.settings.sound ? 'checked' : ''}>
            <span class="switch" aria-hidden="true"></span>
          </label>
        </div>
        <div class="field">
          <label for="settings-voice">Voz <span>朗读声音</span></label>
          <select id="settings-voice" name="voiceURI">
            <option value="">自动选择（优先 pt-PT）</option>
            ${voiceOptions}
          </select>
          ${ptVoices.length
            ? `<p class="field-hint">${icon('check')} 检测到 ${ptVoices.length} 个葡语声音。优先选择标有 ★ 的 pt-PT 声音。</p>`
            : `<p class="field-hint warn">${icon('info')} 未检测到葡语声音。可在系统「语言和区域」中安装 Português (Portugal) 语音包。学习内容不受影响。</p>`}
          <button type="button" class="text-link" data-action="test-voice">${icon('volume')} Testar a voz</button>
        </div>
        <div class="field">
          <label for="settings-rate">Velocidade da voz <span>朗读速度</span> <b id="rate-value">${Number(state.settings.rate).toFixed(1)}×</b></label>
          <input id="settings-rate" name="rate" type="range" min="0.6" max="1.2" step="0.05" value="${state.settings.rate}">
        </div>
        <div class="settings-footer">
          <button type="button" class="text-link danger" data-action="request-reset">Apagar progresso</button>
          <div class="settings-actions">
            <button type="button" class="btn btn-secondary" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </form>
      ${cloudPanelHTML() ? `<div class="settings-cloud">
        <div class="settings-cloud-head"><span class="eyebrow">CONTA NA NUVEM</span><span class="cloud-beta">BETA</span></div>
        ${cloudPanelHTML()}
      </div>` : ''}
      <p class="settings-version">Azulejo · português europeu · versão ${APP_VERSION}<br>${lvl.n > 1 ? `Nível ${lvl.n} · ${lvl.title} · ` : ''}${state.xp} XP · <a href="#/legal">Créditos e licenças</a></p>
    </div>`, { className: 'settings-panel', label: 'Definições' });
    const rate = $('#settings-rate');
    if (rate) rate.addEventListener('input', () => {
      const label = $('#rate-value');
      if (label) label.textContent = Number(rate.value).toFixed(1) + '×';
    });
  }

  function saveSettings(form) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim().slice(0, 24);
    const goal = Number(data.get('goal')) || 40;
    state.name = name;
    state.goal = goal;
    state.settings.sound = data.get('sound') === 'on';
    state.settings.voiceURI = String(data.get('voiceURI') || '');
    state.settings.rate = Number(data.get('rate')) || 0.9;
    saveState();
    closeModal();
    refreshChrome();
    router();
    showToast('Definições guardadas.', 'success');
  }

  function openOnboarding() {
    const root = $('#modal-root');
    root.innerHTML = `<div class="onboarding" role="dialog" aria-modal="true" aria-label="欢迎来到 Azulejo">
      <div class="onboarding-art">
        ${heroTiles()}
        <div class="onboarding-brand"><span class="brand-tile">${icon('flower')}</span><span><b>azulejo</b><small>PORTUGUÊS EUROPEU</small></span></div>
        <blockquote>“Cada palavra é uma janela.”<span>每一个词，都是一扇窗。</span></blockquote>
        <div class="onboarding-tiles" aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
      <div class="onboarding-form-wrap">
        <div class="onboarding-form-inner">
          <span class="eyebrow">BEM-VINDO / BEM-VINDA</span>
          <h1>Olá! Vamos aprender português?</h1>
          <p class="onboarding-lede">从 A1 到 C2，不只学语法。这里用情景视频、音频对话和五语词汇，教你在里斯本、波尔图、咖啡馆和会议上真正会听到、用得上的欧洲葡语。</p>
          <form id="onboarding-form">
            <div class="field">
              <label for="onboarding-name">Como te chamas? <span>怎么称呼你（可留空）</span></label>
              <input id="onboarding-name" name="name" type="text" maxlength="24" placeholder="O teu nome" autocomplete="off">
            </div>
            <div class="field">
              <span class="field-label">Quanto tempo por dia? <span>每天想学多久？</span></span>
              <div class="goal-picker onboarding-goals">
                <label class="goal-option"><input type="radio" name="goal" value="20"><strong>5 分钟</strong><span>Leve · 20 XP</span></label>
                <label class="goal-option is-active"><input type="radio" name="goal" value="40" checked><strong>10 分钟</strong><span>Equilibrada · 40 XP</span></label>
                <label class="goal-option"><input type="radio" name="goal" value="60"><strong>15 分钟</strong><span>Intensa · 60 XP</span></label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary wide">Começar a aprender ${icon('arrow-right')}</button>
            <button type="button" class="onboarding-skip" data-action="skip-onboarding">Só quero explorar · 先看看</button>
          </form>
          <p class="onboarding-foot">${icon('info')} 进度只保存在本机浏览器，不需要注册。</p>
        </div>
      </div>
    </div>`;
    ui.modalOpen = true;
    document.body.classList.add('onboarding-open');
    setTimeout(() => {
      const input = $('#onboarding-name');
      if (input) input.focus();
    }, 350);
  }

  function markVersionSeen() {
    try { localStorage.setItem(VERSION_KEY, APP_VERSION); } catch (err) { /* storage may be unavailable */ }
  }

  function maybeShowVersionNotice() {
    let seen = null;
    try { seen = localStorage.getItem(VERSION_KEY); } catch (err) { /* storage may be unavailable */ }
    if (!seen) {
      markVersionSeen();
      if (state.onboarded) setTimeout(() => showToast(`Azulejo v${APP_VERSION} · versão atual`, 'success'), 900);
      return;
    }
    if (seen === APP_VERSION) return;
    markVersionSeen();
    setTimeout(() => showToast(`Azulejo atualizado para v${APP_VERSION}`, 'success'), 900);
  }

  function completeOnboarding(name, goal) {
    state.onboarded = true;
    state.name = String(name || '').trim().slice(0, 24);
    state.goal = Number(goal) || 40;
    saveState();
    markVersionSeen();
    closeModal(true);
    document.body.classList.remove('onboarding-open');
    refreshChrome();
    router();
    showToast(state.name ? `Bem-vindo/a, ${state.name}!` : 'Bem-vindo/a ao português europeu!', 'success');
  }

  /* ------------------------------------------------------------------ */
  /* Toast and confetti                                                  */
  /* ------------------------------------------------------------------ */

  let toastTimer = null;

  function showToast(message, tone = 'default') {
    const root = $('#toast-root');
    if (!root) return;
    root.innerHTML = `<div class="toast ${tone}">${icon(tone === 'success' ? 'check' : tone === 'warn' ? 'info' : 'sparkle')}<span>${esc(message)}</span></div>`;
    root.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => root.classList.remove('is-visible'), 3200);
  }

  function launchConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = $('#confetti');
    if (!layer) return;
    const colors = ['#1e5c73', '#c46745', '#e0a94e', '#7c8b63', '#8b5e6b', '#f7f0e3'];
    layer.innerHTML = '';
    for (let i = 0; i < 44; i++) {
      const piece = document.createElement('i');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.5}s`;
      piece.style.animationDuration = `${2.2 + Math.random() * 1.8}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.width = `${5 + Math.random() * 7}px`;
      piece.style.height = `${8 + Math.random() * 10}px`;
      layer.appendChild(piece);
    }
    setTimeout(() => { layer.innerHTML = ''; }, 4800);
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                              */
  /* ------------------------------------------------------------------ */

  function handleAction(action, el) {
    switch (action) {
      case 'select-level':
        ui.courseLevel = el.dataset.level;
        renderHome();
        requestAnimationFrame(() => {
          const course = $('#course');
          if (course) course.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        break;
      case 'select-reading-level':
        ui.readingLevel = el.dataset.level;
        renderReadingPage();
        break;
      case 'select-media-level':
        ui.mediaLevel = el.dataset.level;
        renderMediaPage();
        break;
      case 'open-media-level':
        ui.mediaLevel = el.dataset.level;
        go('#/media');
        break;
      case 'go-level':
        ui.courseLevel = el.dataset.level;
        go('#/learn');
        setTimeout(() => {
          const course = $('#course');
          if (course) course.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        break;
      case 'close-media':
        closeMedia();
        break;
      case 'media-toggle':
        toggleMedia();
        break;
      case 'media-prev':
        if (mediaPlay && !mediaPlay.finished) {
          const wasPlaying = mediaPlay.playing;
          mediaPlay.token += 1;
          clearTimeout(mediaTimer);
          Speech.stop();
          mediaPlay.index = Math.max(0, mediaPlay.index - 1);
          mediaPlay.playing = false;
          renderMediaPlayer();
          if (wasPlaying) playMediaCurrent();
        }
        break;
      case 'media-next':
        if (mediaPlay) {
          if (mediaPlay.finished || mediaPlay.index >= mediaPlay.item.lines.length - 1) {
            finishMedia();
          } else {
            const currentLine = mediaCurrentLine();
            const wasPlaying = mediaPlay.playing || (mediaPlay.rolePlay && currentLine && currentLine.role === mediaPlay.userRole);
            mediaPlay.token += 1;
            clearTimeout(mediaTimer);
            Speech.stop();
            mediaPlay.index += 1;
            mediaPlay.playing = false;
            renderMediaPlayer();
            if (wasPlaying) playMediaCurrent();
          }
        }
        break;
      case 'media-repeat':
        if (mediaPlay && !mediaPlay.finished) {
          const line = mediaCurrentLine();
          mediaPlay.token += 1;
          clearTimeout(mediaTimer);
          Speech.stop();
          mediaPlay.playing = false;
          renderMediaPlayer();
          Speech.speakMediaLine(line.pt, mediaCastIndex(line.who), mediaPlay.rate, null);
        }
        break;
      case 'media-rate':
        if (mediaPlay) {
          const rates = [0.75, 0.9, 1.05];
          const idx = rates.findIndex(r => Math.abs(r - mediaPlay.rate) < 0.01);
          const wasPlaying = mediaPlay.playing;
          mediaPlay.rate = rates[(idx + 1) % rates.length];
          mediaPlay.token += 1;
          clearTimeout(mediaTimer);
          Speech.stop();
          mediaPlay.playing = false;
          renderMediaPlayer();
          if (wasPlaying) playMediaCurrent();
        }
        break;
      case 'media-captions':
        mediaPlay.captions = !mediaPlay.captions;
        renderMediaPlayer();
        break;
      case 'toggle-roleplay':
        if (mediaPlay) {
          mediaPlay.rolePlay = !mediaPlay.rolePlay;
          if (mediaPlay.rolePlay) {
            mediaPlay.captions = true;
            pauseMedia();
          } else renderMediaPlayer();
        }
        break;
      case 'set-role':
        if (mediaPlay) {
          mediaPlay.userRole = el.dataset.role;
          if (mediaPlay.index < mediaPlay.item.lines.length) renderMediaPlayer();
        }
        break;
      case 'toggle-transcript':
        mediaPlay.showTranscript = !mediaPlay.showTranscript;
        renderMediaPlayer();
        break;
      case 'jump-media':
        jumpMedia(Number(el.dataset.index));
        break;
      case 'answer-media':
        answerMediaQuestion(Number(el.dataset.q), el.dataset.value);
        break;
      case 'media-restart':
        restartMedia();
        break;
      case 'listening-toggle':
        toggleListening();
        break;
      case 'listening-rate':
        setListeningRate(el.dataset.rate);
        break;
      case 'listening-transcript':
        if (listeningPlay) {
          listeningPlay.transcript = !listeningPlay.transcript;
          renderListeningPlayer();
        }
        break;
      case 'listening-answer':
        if (listeningPlay) {
          const key = Number(el.dataset.q);
          if (listeningPlay.answers[key]) break;
          const question = listeningPlay.item.questions[key];
          if (!question) break;
          listeningPlay.answers[key] = { value: el.dataset.value, correct: el.dataset.value === question.answer };
          renderListeningPlayer();
        }
        break;
      case 'listening-complete':
        completeListening();
        break;
      case 'close-listening':
        closeListening();
        break;
      case 'open-dubbing':
        go(`#/dubbing/${el.dataset.id}`);
        break;
      case 'dubbing-close':
        closeDubbing();
        break;
      case 'dubbing-listen':
        playDubbingLine();
        break;
      case 'dubbing-record':
        if (dubbingPlay && dubbingPlay.recording) stopDubbingRecording();
        else startDubbingRecording();
        break;
      case 'dubbing-rate':
        if (dubbingPlay) {
          dubbingPlay.rate = Number(el.dataset.rate) || 0.9;
          state.settings.listeningRate = dubbingPlay.rate;
          saveState();
          Speech.stop();
          renderDubbing();
        }
        break;
      case 'dubbing-prev':
        jumpDubbing((dubbingPlay ? dubbingPlay.index : 0) - 1);
        break;
      case 'dubbing-next':
        jumpDubbing((dubbingPlay ? dubbingPlay.index : 0) + 1);
        break;
      case 'dubbing-jump':
        jumpDubbing(Number(el.dataset.index));
        break;
      case 'start-lesson':
        go(`#/lesson/${el.dataset.id}`);
        break;
      case 'start-next': {
        const next = nextLesson();
        if (next) go(`#/lesson/${next.id}`);
        else go('#/review');
        break;
      }
      case 'scroll-course': {
        const section = $('#course');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'open-settings':
        openSettings();
        break;
      case 'cloud-signin':
        cloudSignIn();
        break;
      case 'cloud-signup':
        cloudSignUp();
        break;
      case 'cloud-push':
        cloudPush();
        break;
      case 'cloud-pull':
        cloudPull();
        break;
      case 'cloud-signout':
        window.AZ_CLOUD.signOut();
        openSettings();
        break;
      case 'cloud-apply-remote':
        if (ui.cloudRemote) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(ui.cloudRemote));
          location.reload();
        }
        break;
      case 'toggle-sound':
        state.settings.sound = !state.settings.sound;
        saveState();
        refreshChrome();
        showToast(state.settings.sound ? '音效已打开。' : '音效已关闭。');
        if (state.settings.sound) soundFX('correct');
        break;
      case 'select-option':
        selectOption(Number(el.dataset.index));
        break;
      case 'check':
        checkCurrent();
        break;
      case 'next-step':
        nextLessonStep();
        break;
      case 'immersion-answer':
        answerImmersion(el.dataset.key, el.dataset.value);
        break;
      case 'immersion-play': {
        const step = currentLessonStep();
        if (step && step.kind === 'immersion') {
          const lines = (el.dataset.kind === 'listening' || step.pack.text) ? step.pack.listeningLines : step.pack.lines;
          Speech.speakSequence(lines.map(line => line.pt), el);
        }
        break;
      }
      case 'speak-immersion':
        startShadowing();
        break;
      case 'mark-spoken':
        markSpoken();
        break;
      case 'add-token':
        addToken(Number(el.dataset.token));
        break;
      case 'remove-token':
        removeToken(Number(el.dataset.token));
        break;
      case 'insert-char':
        insertChar(el.dataset.char);
        break;
      case 'play-all':
        if (ui.lesson) Speech.speakSequence(ui.lesson.lesson.vocab.map(w => w.pt), el);
        break;
      case 'match-left':
        matchLeft(Number(el.dataset.id));
        break;
      case 'match-right':
        matchRight(Number(el.dataset.id));
        break;
      case 'leave-lesson':
        requestLeaveLesson();
        break;
      case 'next-lesson':
        go(`#/lesson/${el.dataset.id}`);
        break;
      case 'go-home':
        go('#/learn');
        break;
      case 'go-review':
        go('#/review');
        break;
      case 'start-review':
        go('#/review/session');
        break;
      case 'start-review-all':
        go('#/review/session/all');
        break;
      case 'flip-card':
        flipCard();
        break;
      case 'rate':
        rateReview(el.dataset.rating);
        break;
      case 'close-review':
        go('#/review');
        break;
      case 'select-language-tab':
        ui.languageTab = el.dataset.tab;
        ui.openVerb = '';
        renderPhrasesPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'toggle-verb':
        ui.openVerb = ui.openVerb === el.dataset.verb ? '' : el.dataset.verb;
        renderVerbsPage();
        break;
      case 'filter-words':
        ui.wordLevel = el.dataset.level;
        ui.wordLimit = 200;
        renderWordGrid();
        break;
      case 'show-more-words':
        ui.wordLimit += 200;
        renderWordGrid();
        break;
      case 'clear-word-filters':
        ui.wordLevel = 'all';
        ui.wordQuery = '';
        ui.wordLimit = 200;
        renderPhrasesPage();
        break;
      case 'filter-phrases':
        ui.phraseGroup = el.dataset.group;
        ui.phraseLimit = 100;
        updatePhraseChips();
        renderPhraseGrid();
        break;
      case 'show-more-phrases':
        ui.phraseLimit += 100;
        renderPhraseGrid();
        break;
      case 'toggle-fav-filter':
        ui.favOnly = !ui.favOnly;
        ui.phraseLimit = 100;
        updatePhraseChips();
        renderPhraseGrid();
        break;
      case 'fav-phrase':
        toggleFavorite(el.dataset.id);
        break;
      case 'clear-phrase-filters':
        ui.phraseGroup = 'all';
        ui.phraseQuery = '';
        ui.favOnly = false;
        ui.phraseLimit = 100;
        renderPhrasesPage();
        break;
      case 'filter-culture':
        ui.cultureCategory = el.dataset.category;
        ui.cultureLimit = 13;
        renderCulturePage();
        break;
      case 'show-more-culture':
        ui.cultureLimit += 12;
        renderCulturePage();
        break;
      case 'checkout':
        trackEvent('checkout_click', { source: 'pro' });
        if (window.AZ_CONFIG && window.AZ_CONFIG.checkoutUrl) {
          window.open(window.AZ_CONFIG.checkoutUrl, '_blank', 'noopener,noreferrer');
        } else {
          showToast('支付链接还未配置。请先通过联系方式购买。');
        }
        break;
      case 'contact-buy':
        if (window.AZ_CONFIG && window.AZ_CONFIG.contactUrl) {
          window.open(window.AZ_CONFIG.contactUrl, '_blank', 'noopener,noreferrer');
        } else {
          const license = $('#license-input');
          if (license) { license.scrollIntoView({ behavior: 'smooth', block: 'center' }); license.focus(); }
          showToast('购买后把许可证粘贴到下方即可解锁。');
        }
        break;
      case 'paywall-exam':
        const licenseInput = $('#license-input');
        if (licenseInput) { licenseInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); licenseInput.focus(); }
        break;
      case 'select-pro-level':
        ui.proLevel = el.dataset.level;
        renderProPage(false);
        break;
      case 'activate-license':
        activateLicenseFromForm();
        break;
      case 'deactivate-license':
        if (window.AZ_LICENSE) window.AZ_LICENSE.clear();
        renderChrome('pro');
        renderProPage(false);
        break;
      case 'close-exam':
        location.hash = '#/pro';
        break;
      case 'submit-exam':
        submitExam(false);
        break;
      case 'restart-exam':
        if (el.getAttribute('href')) location.hash = el.getAttribute('href');
        break;
      case 'open-article':
        openArticle(el.dataset.id);
        break;
      case 'mark-article':
        markArticleRead(el.dataset.id);
        break;
      case 'close-modal':
        closeModal();
        break;
      case 'request-reset':
        openConfirm('Apagar todo o progresso?', 'XP、连续学习、课程记录和复习词汇都会被删除。这个操作无法撤销。', 'reset-all', 'Apagar tudo', 'Manter');
        break;
      case 'reset-all':
        try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* noop */ }
        location.hash = '#/learn';
        location.reload();
        break;
      case 'confirm-leave-lesson':
        go(ui.lesson && ui.lesson.directReading ? '#/reading' : '#/learn');
        break;
      case 'test-voice':
        Speech.speak('Olá! Bem-vindo ao português europeu. Esta é a tua voz.', false, el);
        break;
      case 'skip-onboarding':
        completeOnboarding('', 40);
        break;
      default:
        break;
    }
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const audioEl = event.target.closest('[data-audio]');
      if (audioEl) {
        event.preventDefault();
        event.stopPropagation();
        Speech.speak(audioEl.dataset.audio, false, audioEl);
        return;
      }

      const actionEl = event.target.closest('[data-action]');
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (action === 'leave-lesson') {
          requestLeaveLesson();
          return;
        }
        if (action === 'reset-all') {
          try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* noop */ }
          location.hash = '#/learn';
          location.reload();
          return;
        }
        handleAction(action, actionEl);
      }
    });

    document.addEventListener('input', event => {
      if (event.target.id === 'phrase-search') {
        ui.phraseQuery = event.target.value;
        ui.phraseLimit = 100;
        renderPhraseGrid();
        return;
      }
      if (event.target.id === 'word-search') {
        ui.wordQuery = event.target.value;
        ui.wordLimit = 200;
        renderWordGrid();
        return;
      }
      if (event.target.id === 'type-answer' && ui.lesson && ui.lesson.stepState) {
        ui.lesson.stepState.input = event.target.value;
        refreshLessonFooter();
        return;
      }
      if (event.target.name === 'goal' && event.target.closest('.goal-picker')) {
        const picker = event.target.closest('.goal-picker');
        $$('.goal-option', picker).forEach(opt => opt.classList.toggle('is-active', $('input', opt)?.checked));
      }
    });

    document.addEventListener('submit', event => {
      if (event.target.id === 'settings-form') {
        event.preventDefault();
        saveSettings(event.target);
        return;
      }
      if (event.target.id === 'onboarding-form') {
        event.preventDefault();
        const form = event.target;
        const name = $('#onboarding-name')?.value || '';
        const goal = Number(new FormData(form).get('goal')) || 40;
        completeOnboarding(name, goal);
      }
    });

    document.addEventListener('keydown', event => {
      if (ui.modalOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          if (document.body.classList.contains('onboarding-open')) return;
          closeModal();
          return;
        }
        if (event.key === 'Tab') trapFocus(event);
        return;
      }

      if (document.body.classList.contains('focus-mode') && mediaPlay) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeMedia();
          return;
        }
        if (event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          toggleMedia();
          return;
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          if (!mediaPlay.finished) jumpMedia(mediaPlay.index + 1);
          return;
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          jumpMedia(mediaPlay.index - 1);
          return;
        }
        return;
      }

      if (document.body.classList.contains('focus-mode') && ui.lesson && !ui.lesson.done) {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        const step = currentLessonStep();
        if (event.key === 'Escape') {
          event.preventDefault();
          requestLeaveLesson();
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          if (ui.lesson.answered) nextLessonStep();
          else if (canCheck()) checkCurrent();
          return;
        }
        if (!ui.lesson.answered && tag !== 'input' && step && step.kind === 'exercise' && ['choice', 'listen'].includes(step.ex.type)) {
          const n = Number(event.key);
          if (n >= 1 && n <= 4) selectOption(n - 1);
        }
        return;
      }

      if (document.body.classList.contains('focus-mode') && ui.review && !ui.review.done && !ui.review.empty) {
        if (event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          flipCard();
          return;
        }
        if (ui.review.flipped) {
          const map = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };
          if (map[event.key]) rateReview(map[event.key]);
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          go('#/review');
        }
        return;
      }

      const focused = document.activeElement;
      if (focused && focused.matches('[data-action="open-article"]') && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openArticle(focused.dataset.id);
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && ui.route === 'phrases') {
        event.preventDefault();
        const search = ui.languageTab === 'words' ? $('#word-search') : $('#phrase-search');
        if (search) search.focus();
      }
    });

    window.addEventListener('hashchange', router);
  }

  function trapFocus(event) {
    const panel = $('.modal-panel') || $('.onboarding');
    if (!panel) return;
    const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', panel)
      .filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  function boot() {
    Speech.init();
    document.body.dataset.version = APP_VERSION;
    const next = nextLesson();
    ui.courseLevel = next ? next.unit.level : 'A1';
    const nextMedia = DATA.media.find(item => !state.media[item.id]);
    ui.mediaLevel = nextMedia ? nextMedia.level : 'A1';
    if (!location.hash) {
      try { history.replaceState(null, '', '#/learn'); } catch (err) { location.hash = '#/learn'; }
    }
    bindEvents();
    router();
    if (!state.onboarded) {
      setTimeout(openOnboarding, 300);
    } else {
      maybeShowVersionNotice();
    }
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  boot();
})();
