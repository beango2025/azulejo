/* Azulejo — deterministic practice labs.
   Every level gets 30 lessons: its core lessons plus practice labs generated
   from that level's vocabulary and media dialogues. */
(function () {
  'use strict';

  const TYPES = [
    { key: 'listen', title: 'Ouvir', zh: '听辨', icon: 'volume', order: ['listen', 'choice', 'match', 'arrange', 'type'] },
    { key: 'words', title: 'Palavras', zh: '词汇', icon: 'layers', order: ['choice', 'reverse', 'match', 'listen', 'type'] },
    { key: 'sentences', title: 'Frases', zh: '造句', icon: 'keyboard', order: ['arrange', 'arrange', 'choice', 'type', 'match'] },
    { key: 'translate', title: 'Traduzir', zh: '翻译', icon: 'book', order: ['type', 'reverse', 'arrange', 'listen', 'choice'] },
    { key: 'dialogue', title: 'Diálogo', zh: '对话', icon: 'chat', order: ['dialogue-listen', 'dialogue-choice', 'arrange', 'match', 'type'] },
    { key: 'pronounce', title: 'Pronúncia', zh: '语音', icon: 'sparkle', order: ['listen', 'listen', 'choice', 'type', 'match'] },
    { key: 'mixed', title: 'Mistura', zh: '综合', icon: 'target', order: ['choice', 'listen', 'arrange', 'match', 'type'] }
  ];

  const pad = n => String(n).padStart(2, '0');

  function uniq(values) {
    return [...new Set(values.filter(v => v != null && String(v).trim() !== ''))];
  }

  function distractors(pool, target, field, count = 2) {
    const targetValue = target[field];
    const values = uniq(pool.filter(w => w.id !== target.id).map(w => w[field]))
      .filter(v => v !== targetValue);
    return values.slice(0, count);
  }

  function optionsFor(pool, target, field) {
    return [target[field], ...distractors(pool, target, field, 2)];
  }

  function tokenize(sentence) {
    return String(sentence)
      .replace(/([.,!?;:])/g, ' $1 ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  function listenExercise(word, pool) {
    return {
      type: 'listen',
      prompt: '听音频，选出你听到的词或句子',
      q: 'Clica no altifalante e ouve com atenção.',
      audio: word.pt,
      options: optionsFor(pool, word, 'pt'),
      answer: word.pt,
      explain: `${word.pt} = ${word.zh}。`
    };
  }

  function choiceExercise(word, pool) {
    return {
      type: 'choice',
      prompt: '这个词是什么意思？',
      q: word.pt,
      options: optionsFor(pool, word, 'zh'),
      answer: word.zh,
      explain: `${word.pt} 的意思是「${word.zh}」。`,
      audio: ''
    };
  }

  function reverseExercise(word, pool) {
    return {
      type: 'choice',
      prompt: '哪个葡语词最合适？',
      q: word.zh,
      options: optionsFor(pool, word, 'pt'),
      answer: word.pt,
      explain: `${word.zh} 对应 ${word.pt}。`,
      audio: ''
    };
  }

  function typeExercise(word) {
    const variants = new Set([word.pt]);
    word.pt.split(' / ').forEach(part => variants.add(part.trim()));
    word.pt.replace(/^(o|a|os|as|um|uma|uns|umas)\s+/i, '').trim().split(' / ').forEach(part => {
      if (part.trim().length > 2) variants.add(part.trim());
    });
    return {
      type: 'type',
      prompt: '把这句话翻译成欧洲葡语',
      q: word.zh,
      answers: [...variants],
      explain: `${word.zh} → ${word.pt}。`,
      hint: word.pt.slice(0, Math.min(2, word.pt.length)) + '…',
      placeholder: 'Escreve em português…'
    };
  }

  function arrangeExercise(word) {
    const tokens = tokenize(word.ex);
    if (tokens.length < 3) return choiceExercise(word, [word]);
    return {
      type: 'arrange',
      prompt: '把词语排成一句正确的葡语',
      q: word.exZh,
      tokens,
      answer: word.ex,
      explain: `${word.pt} — ${word.ex}`
    };
  }

  function matchExercise(words) {
    const chosen = words.slice(0, 4);
    return {
      type: 'match',
      prompt: '把葡语和中文配对',
      pairs: chosen.map(word => [word.pt, word.zh])
    };
  }

  function dialogueExercises(lines, pool) {
    if (!lines.length) return [listenExercise(pool[0], pool), choiceExercise(pool[1] || pool[0], pool)];
    const line = lines[0];
    const otherPt = uniq(lines.map(l => l.pt).filter(pt => pt !== line.pt)).slice(0, 2);
    const otherZh = uniq(lines.map(l => l.zh).filter(zh => zh !== line.zh)).slice(0, 2);
    return [
      {
        type: 'listen',
        prompt: '听这段对话，选出你听到的句子',
        q: 'Clica no altifalante e ouve com atenção.',
        audio: line.pt,
        options: [line.pt, ...otherPt],
        answer: line.pt,
        explain: `${line.who}: ${line.pt}（${line.zh}）`
      },
      {
        type: 'choice',
        prompt: '这句话是什么意思？',
        q: line.pt,
        options: [line.zh, ...otherZh],
        answer: line.zh,
        explain: `${line.who} 说：${line.zh}。`
      }
    ];
  }

  function buildExercises(type, words, pool, dialogues) {
    let listenCount = 0;
    let arrangeCount = 0;
    const map = {
      listen: () => listenExercise(words[listenCount++ % words.length], pool),
      choice: () => choiceExercise(words[1] || words[0], pool),
      reverse: () => reverseExercise(words[2] || words[0], pool),
      type: () => typeExercise(words[3] || words[0]),
      arrange: () => arrangeExercise(words[(arrangeCount++ + 1) % words.length]),
      match: () => matchExercise(words.length >= 4 ? words : pool.slice(0, 4))
    };
    let dialogueUsed = false;
    return type.order.map(kind => {
      if (kind === 'dialogue-listen' || kind === 'dialogue-choice') {
        if (!dialogueUsed) {
          dialogueUsed = true;
          return dialogueExercises(dialogues, pool)[kind === 'dialogue-listen' ? 0 : 1];
        }
        return kind === 'dialogue-listen' ? listenExercise(words[2] || words[0], pool) : choiceExercise(words[3] || words[0], pool);
      }
      return map[kind]();
    });
  }

  window.AZ_BUILD_LABS = function buildLabs({ levels, units, media }) {
    const labs = [];
    levels.forEach(level => {
      const coreLessons = units
        .filter(unit => unit.level === level.id)
        .flatMap(unit => unit.lessons);
      const poolById = new Map();
      coreLessons.forEach(lesson => lesson.vocab.forEach(word => {
        if (!poolById.has(word.id)) poolById.set(word.id, word);
      }));
      const pool = [...poolById.values()];
      if (!pool.length) return;
      const needed = Math.max(0, 30 - coreLessons.length);
      const levelDialogueLines = media
        .filter(item => item.level === level.id)
        .flatMap(item => item.lines || []);

      for (let i = 0; i < needed; i++) {
        const type = TYPES[i % TYPES.length];
        const selected = [];
        for (let k = 0; k < 5; k++) selected.push(pool[(i * 5 + k) % pool.length]);
        const uniqueSelected = [...new Map(selected.map(w => [w.id, w])).values()];
        while (uniqueSelected.length < 5) {
          const candidate = pool[(i * 5 + uniqueSelected.length + 3) % pool.length];
          if (!uniqueSelected.some(w => w.id === candidate.id)) uniqueSelected.push(candidate);
          else break;
        }
        const words = uniqueSelected.slice(0, 5);
        const lineOffset = (i * 3) % Math.max(1, levelDialogueLines.length);
        const dialogues = levelDialogueLines.length
          ? [levelDialogueLines[lineOffset], levelDialogueLines[(lineOffset + 2) % levelDialogueLines.length]]
          : [];
        const exercises = buildExercises(type, words, pool, dialogues);
        labs.push({
          id: `${level.id.toLowerCase()}lab${pad(i + 1)}`,
          title: `Prática ${pad(i + 1)} · ${type.title}`,
          zh: `练习 ${pad(i + 1)} · ${type.zh}`,
          minutes: 5,
          xp: 15,
          goal: '巩固本级别的词汇、句型和听力。',
          vocab: words,
          grammar: null,
          exercises,
          isLab: true,
          focus: type.key,
          focusTitle: type.title,
          focusZh: type.zh,
          focusIcon: type.icon,
          level: level.id,
          unit: { id: `practice-${level.id}`, level: level.id, title: 'Prática', zh: '练习', color: level.color, order: 99 }
        });
      }
    });
    return labs;
  };
})();
