/* Azulejo — writing practice bank. 50 original prompts per level (not official past papers). */
(function () {
  'use strict';

  const TOPICS = [
    ['família', 'A minha família', '我的家庭', 'description'],
    ['rotina', 'Um dia normal na minha vida', '我平常的一天', 'description'],
    ['cidade', 'A minha cidade ou aldeia', '我的城市或村庄', 'description'],
    ['casa', 'A casa onde vivo', '我住的房子', 'description'],
    ['comida', 'Uma refeição de que gosto', '我喜欢的一顿饭', 'description'],
    ['viagem', 'Uma viagem que fiz', '我经历过的一次旅行', 'narrative'],
    ['férias', 'O próximo período de férias', '下一个假期', 'email'],
    ['amizade', 'Um amigo importante', '一位重要的朋友', 'description'],
    ['estudos', 'Porque estudo português', '我为什么学葡语', 'opinion'],
    ['trabalho', 'O trabalho dos meus sonhos', '我梦想的工作', 'opinion'],
    ['tecnologia', 'A tecnologia no dia a dia', '日常生活中的科技', 'opinion'],
    ['redes sociais', 'Redes sociais: vantagens e riscos', '社交网络：好处与风险', 'opinion'],
    ['ambiente', 'O que posso fazer pelo ambiente', '我能为环境做什么', 'opinion'],
    ['transportes', 'Transportes na minha cidade', '我城市的交通', 'opinion'],
    ['saúde', 'Hábitos saudáveis', '健康习惯', 'opinion'],
    ['desporto', 'O desporto e o bem-estar', '运动与健康', 'opinion'],
    ['cultura', 'Um livro ou filme que marcou', '一本影响我的书或电影', 'review'],
    ['música', 'A música portuguesa', '葡萄牙音乐', 'review'],
    ['fado', 'O fado e a saudade', '法朵与 saudade', 'opinion'],
    ['festas', 'Uma festa tradicional', '一个传统节日', 'description'],
    ['turismo', 'Turismo e a cidade', '旅游与城市', 'opinion'],
    ['habitação', 'O problema da habitação', '住房问题', 'opinion'],
    ['emigração', 'Emigrar: sonho ou sacrifício?', '移民：梦想还是牺牲？', 'opinion'],
    ['regresso', 'Voltar ao país de origem', '回到原籍国', 'narrative'],
    ['língua', 'A importância das línguas', '语言的重要性', 'opinion'],
    ['aprendizagem', 'Como aprendo melhor', '我如何学得更好', 'opinion'],
    ['leitura', 'Os jovens e a leitura', '年轻人与阅读', 'opinion'],
    ['internet', 'A internet e a privacidade', '互联网与隐私', 'opinion'],
    ['publicidade', 'A publicidade e o consumo', '广告与消费', 'opinion'],
    ['dinheiro', 'Poupar e gastar', '储蓄与消费', 'opinion'],
    ['voluntariado', 'Voluntariado na comunidade', '社区志愿服务', 'email'],
    ['bairro', 'Vizinhos e vida de bairro', '邻居与街区生活', 'description'],
    ['tradição', 'Uma tradição que devia continuar', '应该延续的传统', 'opinion'],
    ['modernidade', 'Tradição e modernidade', '传统与现代', 'opinion'],
    ['igualdade', 'Igualdade no trabalho', '职场平等', 'opinion'],
    ['juventude', 'Ser jovem hoje', '今天的年轻人', 'opinion'],
    ['velhice', 'Os mais velhos e a família', '长辈与家庭', 'opinion'],
    ['educação', 'O papel da escola', '学校的作用', 'opinion'],
    ['universidade', 'Estudar fora da cidade', '离开家乡上大学', 'email'],
    ['teletrabalho', 'Trabalhar a partir de casa', '居家办公', 'opinion'],
    ['tempo', 'Apressa e qualidade de vida', '忙碌与生活质量', 'opinion'],
    ['solidão', 'Viver sozinho nas cidades', '城市里的独居', 'opinion'],
    ['multiculturalidade', 'Viver entre culturas', '在多种文化之间生活', 'narrative'],
    ['literacia', 'Notícias falsas e pensamento crítico', '假新闻与批判性思维', 'opinion'],
    ['arte', 'A arte no espaço público', '公共空间中的艺术', 'opinion'],
    ['património', 'Preservar o património', '保护遗产', 'opinion'],
    ['ciência', 'Ciência e vida quotidiana', '科学与日常生活', 'opinion'],
    ['clima', 'Alterações climáticas e cidades', '气候变化与城市', 'opinion'],
    ['futuro', 'Como imagino o futuro', '我如何想象未来', 'essay'],
    ['tempo_livre', 'Tempo livre e descanso', '空闲时间与休息', 'opinion']
  ];

  const LEVELS = {
    A1: { min: 30, max: 50, minutes: 15, mode: 'texto curto', register: '简单句、现在时、常用连接词 e / mas / porque。' },
    A2: { min: 60, max: 80, minutes: 20, mode: 'email ou descrição', register: '过去时、理由、问候和结尾。' },
    B1: { min: 120, max: 150, minutes: 30, mode: 'texto de opinião', register: '清楚分段；使用 porque、no entanto、por isso。' },
    B2: { min: 180, max: 220, minutes: 40, mode: 'carta formal ou artigo', register: '正式称呼、论点、例证、让步和结论。' },
    C1: { min: 250, max: 300, minutes: 50, mode: 'artigo ou ensaio', register: '复杂句、名词化、衔接、语体控制。' },
    C2: { min: 350, max: 400, minutes: 60, mode: 'ensaio argumentativo', register: '反讽、保留、精确词汇、篇章结构。' }
  };

  function taskFor(level, topic) {
    const spec = LEVELS[level];
    const [id, ptTopic, zhTopic, kind] = topic;
    const counts = `${spec.min}–${spec.max} palavras`;
    if (level === 'A1' || level === 'A2') {
      return {
        id: `${level}-${id}`,
        level,
        kind,
        title: ptTopic,
        titleZh: zhTopic,
        prompt: `Escreve um ${spec.mode} sobre «${ptTopic}». Usa ${counts}. ${spec.register}`,
        promptZh: `写一篇关于「${zhTopic}」的${spec.mode}，${spec.min}–${spec.max} 词。${spec.register}`,
        min: spec.min,
        max: spec.max,
        minutes: spec.minutes,
        checklist: ['Cumprimenta e despede-te', 'Usa frases completas', 'Escreve pelo menos um motivo', 'Revisa os verbos']
      };
    }
    if (level === 'B1') {
      return {
        id: `${level}-${id}`,
        level,
        kind: 'opinion',
        title: ptTopic,
        titleZh: zhTopic,
        prompt: `Escreve um texto de opinião sobre «${ptTopic}». Apresenta a tua posição, duas razões e uma conclusão. Usa ${counts}.`,
        promptZh: `就「${zhTopic}」写一篇观点文，说明立场、两个理由和结论，${spec.min}–${spec.max} 词。`,
        min: spec.min,
        max: spec.max,
        minutes: spec.minutes,
        checklist: ['Introdução com posição clara', 'Dois argumentos com exemplos', 'Conectores variados', 'Conclusão coerente']
      };
    }
    if (level === 'B2') {
      return {
        id: `${level}-${id}`,
        level,
        kind: 'formal',
        title: ptTopic,
        titleZh: zhTopic,
        prompt: `Escreve uma carta formal ou um artigo sobre «${ptTopic}». Apresenta o problema, uma proposta e as consequências esperadas. Usa ${counts}.`,
        promptZh: `就「${zhTopic}」写一封正式信或文章，说明问题、提出建议并写出预期结果，${spec.min}–${spec.max} 词。`,
        min: spec.min,
        max: spec.max,
        minutes: spec.minutes,
        checklist: ['Registo formal', 'Problema e proposta', 'Argumentos com exemplos', 'Fecho adequado']
      };
    }
    if (level === 'C1') {
      return {
        id: `${level}-${id}`,
        level,
        kind: 'essay',
        title: ptTopic,
        titleZh: zhTopic,
        prompt: `Escreve um artigo de opinião sobre «${ptTopic}». Discute duas perspetivas e toma posição. Usa ${counts}.`,
        promptZh: `就「${zhTopic}」写一篇观点文章，讨论两种视角并表明立场，${spec.min}–${spec.max} 词。`,
        min: spec.min,
        max: spec.max,
        minutes: spec.minutes,
        checklist: ['Tese explícita', 'Duas perspetivas', 'Coesão e progressão', 'Registo consistente']
      };
    }
    return {
      id: `${level}-${id}`,
      level,
      kind: 'essay',
      title: ptTopic,
      titleZh: zhTopic,
      prompt: `Escreve um ensaio argumentativo sobre «${ptTopic}». Problematiza a afirmação, antecipa objeções e conclui com uma posição fundamentada. Usa ${counts}.`,
      promptZh: `就「${zhTopic}」写一篇论证随笔，问题化主题、预设反驳并给出有根据的结论，${spec.min}–${spec.max} 词。`,
      min: spec.min,
      max: spec.max,
      minutes: spec.minutes,
      checklist: ['Problematização', 'Antecipação de objeções', 'Precisão lexical', 'Conclusão fundamentada']
    };
  }

  const bank = {};
  Object.keys(LEVELS).forEach(level => {
    bank[level] = TOPICS.map(topic => taskFor(level, topic));
  });

  window.AZ_WRITING_BANK = bank;
  window.AZ_WRITING_LEVELS = LEVELS;
})();
