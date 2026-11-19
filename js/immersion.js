/* Azulejo — per-lesson reading & listening packs.
   Reading: the lesson's own target sentences, framed as a scene.
   Listening & speaking: a level-appropriate dialogue from the media library. */
(function () {
  'use strict';

  const CAST = {
    A1: ['Ana', 'Tomás'],
    A2: ['Inês', 'Miguel'],
    B1: ['Sofia', 'Pedro'],
    B2: ['Marta', 'João'],
    C1: ['Helena', 'Rui'],
    C2: ['Rita', 'Vasco']
  };

  const INTRO = {
    A1: (scene) => `É uma cena em ${scene}. Ouve as falas devagar; são frases curtas da cena.`,
    A2: (scene) => `Nesta cena, ouvem-se falas em ${scene}. Repara nas expressões do dia a dia.`,
    B1: (scene) => `A cena passa-se em ${scene}. Ouve a conversa e repara nas expressões e nos tempos verbais.`,
    B2: (scene) => `Em ${scene}, ouvem-se falas do dia a dia. Repara nos conectores e no registo.`,
    C1: (scene) => `Este diálogo decorre em ${scene}. A conversa é natural, mas o léxico e as estruturas exigem atenção ao contexto.`,
    C2: (scene) => `Em ${scene}, o diálogo esconde tanto quanto diz. Lê as falas e observa o subtexto, o registo e as escolhas lexicais.`
  };

  /* Prefer the media dialogue that best matches the lesson's scene. */
  const MEDIA_BY_LESSON = {
    u1l1: 'm-a1-audio', u1l2: 'm-a1-audio', u1l3: 'm-a1-audio',
    u2l1: 'm-a1-video', u2l2: 'm-a1-video', u2l3: 'm-a1-video',
    u3l1: 'm-a1-video', u3l2: 'm-a1-video', u3l3: 'm-a1-video',
    u4l1: 'm-a2-audio', u4l2: 'm-a2-audio', u4l3: 'm-a2-audio',
    u5l1: 'm-a2-audio', u5l2: 'm-a2-audio', u5l3: 'm-a2-audio',
    u6l1: 'm-a2-video', u6l2: 'm-a2-video', u6l3: 'm-a2-video',
    b1l1: 'm-b1-audio', b1l2: 'm-b1-audio', b1l3: 'm-b1-audio',
    b1l4: 'm-b1-video', b1l5: 'm-b1-video', b1l6: 'm-b1-audio',
    b2l1: 'm-b2-video', b2l2: 'm-b2-video', b2l3: 'm-b2-audio',
    b2l4: 'm-b2-audio', b2l5: 'm-b2-audio', b2l6: 'm-b2-video',
    c1l1: 'm-c1-video', c1l2: 'm-c1-audio', c1l3: 'm-c1-audio',
    c1l4: 'm-c1-video', c1l5: 'm-c1-video', c1l6: 'm-c1-video',
    c2l1: 'm-c2-video', c2l2: 'm-c2-audio', c2l3: 'm-c2-audio',
    c2l4: 'm-c2-video', c2l5: 'm-c2-video', c2l6: 'm-c2-video'
  };

  function hash(text) {
    let value = 0;
    for (let i = 0; i < text.length; i++) value = (value * 31 + text.charCodeAt(i)) >>> 0;
    return value;
  }

  function uniqueOptions(answer, pool, fallback) {
    const options = [answer];
    pool.forEach(value => {
      if (value && value !== answer && !options.includes(value)) options.push(value);
    });
    while (options.length < 3) options.push(fallback);
    return options.slice(0, 3);
  }

  function mediaForLesson(lesson, levelMedia, allLevelLessons) {
    const coreMatch = allLevelLessons.find(item => item.title === lesson.title);
    const id = MEDIA_BY_LESSON[lesson.id] || (coreMatch && MEDIA_BY_LESSON[coreMatch.id]);
    if (id) {
      const match = levelMedia.find(item => item.id === id);
      if (match) return match;
    }
    return levelMedia.length ? levelMedia[hash(lesson.id) % levelMedia.length] : null;
  }

  window.AZ_BUILD_IMMERSION = function buildImmersion({ lesson, units, media }) {
    const level = (lesson.unit && lesson.unit.level) || lesson.level || 'A1';
    const cast = CAST[level] || CAST.A1;
    const allLevelLessons = units
      .filter(unit => unit.level === level)
      .flatMap(unit => unit.lessons);
    const sceneOptions = [...new Set(allLevelLessons.map(item => item.title))];
    const scenePool = sceneOptions.filter(title => title !== lesson.title);
    const levelMedia = (media || []).filter(item => item.level === level);
    const mediaPick = mediaForLesson(lesson, levelMedia, allLevelLessons);

    const namePattern = '([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)';
    const selfPattern = new RegExp(`(?:chamo-me|o meu nome é|\\bsou\\s+(?:a|o))\\s+${namePattern}`, 'i');
    const addressedPattern = new RegExp(`(?:até logo|olá|bom dia|boa tarde|boa noite|conhecer-te|ver-te),?\\s+${namePattern}`, 'i');
    const isName = value => /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(value || '');
    const lines = [];
    lesson.vocab.slice(0, 5).forEach((word, index) => {
      const self = word.ex.match(selfPattern);
      const addressed = word.ex.match(addressedPattern);
      const previous = lines.length ? lines[lines.length - 1].speaker : null;
      let speaker = cast[index % 2];
      if (self && isName(self[1])) {
        speaker = self[1];
      } else if (addressed && isName(addressed[1])) {
        const other = addressed[1];
        speaker = previous && previous !== other
          ? previous
          : (cast.find(name => name !== other) || cast[0]);
      }
      lines.push({ speaker, pt: word.ex, zh: word.exZh, word: word.pt });
    });

    const firstSpeaker = lines[0] ? lines[0].speaker : cast[0];
    const speakerOptions = uniqueOptions(firstSpeaker, [...new Set(lines.map(line => line.speaker))], 'Outra pessoa');
    const intro = (INTRO[level] || INTRO.A1)(lesson.title, cast[0], cast[1]);
    const sceneQuestionOptions = uniqueOptions(lesson.title, scenePool, 'Noutro lugar');

    const mediaLines = mediaPick && Array.isArray(mediaPick.lines) && mediaPick.lines.length
      ? mediaPick.lines
      : lines.map(line => ({ who: line.speaker, role: 'A', pt: line.pt, zh: line.zh }));
    const speakCandidates = mediaPick && Array.isArray(mediaPick.lines) && mediaPick.lines.length
      ? mediaPick.lines.filter(line => line.role === 'B' && line.pt.split(/\s+/).length >= 4)
      : [];
    const mediaSpeak = speakCandidates[0] || (mediaPick && mediaPick.lines && mediaPick.lines[mediaPick.lines.length - 1]);
    const speakingLine = mediaSpeak
      ? { speaker: mediaSpeak.who || 'B', pt: mediaSpeak.pt, zh: mediaSpeak.zh }
      : (lines.find(line => line.pt.split(/\s+/).length >= 5) || lines[1] || lines[0]);

    const mediaQuestions = mediaPick && Array.isArray(mediaPick.questions) && mediaPick.questions.length
      ? mediaPick.questions.slice(0, 2).map((question, index) => ({
          key: `l${index + 1}`,
          q: question.q,
          options: question.options,
          answer: question.answer,
          explain: question.explain || question.zh || ''
        }))
      : [
          {
            key: 'l1',
            q: 'Qual é a primeira frase que ouves?',
            options: uniqueOptions(mediaLines[0].pt, mediaLines.slice(1).map(line => line.pt), 'Não sei.'),
            answer: mediaLines[0].pt,
            explain: `A conversa começa com «${mediaLines[0].pt}».`
          },
          {
            key: 'l2',
            q: 'Qual é o tema provável da conversa?',
            options: uniqueOptions(lesson.zh, allLevelLessons.map(item => item.zh), 'Outro tema'),
            answer: lesson.zh,
            explain: `O tema é «${lesson.zh}».`
          }
        ];

    return {
      level,
      scene: lesson.title,
      sceneZh: lesson.zh,
      grammarTitle: lesson.grammar ? lesson.grammar.title : 'Revisão da cena',
      cast,
      intro,
      lines,
      speakingLine,
      media: mediaPick ? {
        id: mediaPick.id,
        title: mediaPick.title,
        zh: mediaPick.zh,
        level: mediaPick.level,
        type: mediaPick.type,
        minutes: mediaPick.minutes
      } : null,
      listeningTitle: mediaPick ? mediaPick.title : 'Diálogo da cena',
      listeningLines: mediaLines,
      readingQuestions: [
        {
          key: 'r1',
          q: 'Onde se passa esta cena?',
          options: sceneQuestionOptions,
          answer: lesson.title,
          explain: `A cena chama-se «${lesson.title}».`
        },
        {
          key: 'r2',
          q: 'Quem fala primeiro?',
          options: speakerOptions,
          answer: firstSpeaker,
          explain: `A primeira fala é de ${firstSpeaker}.`
        }
      ],
      listeningQuestions: mediaQuestions
    };
  };
})();
