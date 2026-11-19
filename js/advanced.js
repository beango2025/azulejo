/* Azulejo — B1 to C2 course extension, level metadata and media scripts. */
(function () {
  'use strict';

  const v = (id, pt, zh, pron, ex, exZh, note) => ({ id, pt, zh, pron, ex, exZh, note: note || '' });
  const choice = (prompt, q, options, answer, explain, audio) => ({ type: 'choice', prompt, q, options, answer, explain, audio: audio || '' });
  const listen = (audio, options, answer, explain) => ({
    type: 'listen',
    prompt: '听音频，选出你听到的句子',
    q: 'Clica no altifalante e ouve com atenção.',
    audio, options, answer, explain
  });
  const arrange = (q, tokens, answer, explain) => ({ type: 'arrange', prompt: '把词语排成一句正确的葡语', q, tokens, answer, explain });
  const typeIn = (q, answers, explain, hint, placeholder) => ({
    type: 'type', prompt: '把这句话翻译成欧洲葡语', q, answers, explain, hint: hint || '',
    placeholder: placeholder || 'Escreve em português…'
  });
  const match = (pairs) => ({ type: 'match', prompt: '把葡语和中文配对', pairs });

  const levels = [
    { id: 'A1', name: 'Iniciação', zh: '入门', units: ['u1', 'u2', 'u3'], color: 'blue', blurb: '第一次开口：问候、咖啡、问路。' },
    { id: 'A2', name: 'Sobrevivência', zh: '日常生存', units: ['u4', 'u5', 'u6'], color: 'olive', blurb: '讲自己的生活、周末和突发状况。' },
    { id: 'B1', name: 'Narrar e planear', zh: '叙事与计划', units: ['u7'], color: 'terra', blurb: '讲过去的故事，谈假设和未来。' },
    { id: 'B2', name: 'Argumentar e decidir', zh: '论证与决策', units: ['u8'], color: 'gold', blurb: '开会、写正式邮件、参与辩论。' },
    { id: 'C1', name: 'Sociedade e estilo', zh: '社会与语体', units: ['u9'], color: 'sea', blurb: '讨论住房、移民与环境，控制语体。' },
    { id: 'C2', name: 'Ironia e maestria', zh: '反讽与精通', units: ['u10'], color: 'plum', blurb: '读懂文学、反讽、习语与言外之意。' }
  ];

  const units = [
    {
      id: 'u7', order: 7, title: 'Contar e imaginar', zh: '讲述与想象', color: 'terra', symbol: 'book',
      blurb: '把过去讲成故事，把「如果」说成真正的葡语。',
      lessons: [
        {
          id: 'b1l1', title: 'Quando era pequeno', zh: '小时候', minutes: 9, xp: 45,
          goal: '用未完成过去时描述童年习惯和背景',
          vocab: [
            v('infancia', 'a infância', '童年', 'een-FAHN-see-uh', 'A minha infância foi no campo.', '我的童年在乡下度过。', '重音在 fân：in-fân-cia。'),
            v('brincar', 'brincar', '玩耍', 'breen-KAHR', 'Brincávamos na rua até tarde.', '我们常在街上玩到很晚。', '未完成过去时 brincava/brincávamos 表示过去的习惯。'),
            v('costumava', 'costumava', '过去常常', 'koosh-too-MAH-vuh', 'Costumava ir à praia todos os verões.', '我以前每年夏天都去海滩。', 'costumar 的未完成过去时，专门表达过去的习惯。'),
            v('derepente', 'de repente', '突然', 'duh ruh-PEHN-tuh', 'De repente, começou a chover.', '突然下起雨来。', '叙事里用来打断背景，后面常接简单过去时。'),
            v('crescer', 'crescer', '长大', 'kr(uh)SH-SEHR', 'Cresci numa cidade pequena.', '我在一座小城长大。', 'cresci 是简单过去时，指成长这件事已经完成。')
          ],
          grammar: {
            title: 'Imperfeito vs. perfeito：背景与事件',
            body: '未完成过去时（imperfeito）画背景、讲习惯：Quando era criança, brincava na rua。简单过去时（pretérito perfeito）讲一次完成的事件：Ontem brinquei no parque。当一个动作打断另一个持续动作时，背景用 imperfeito，打断用 perfeito：Estava a chover quando saí。',
            examples: [
              { pt: 'Quando era pequeno, costumava passar os verões no Algarve.', zh: '我小时候常在阿尔加维过夏天。' },
              { pt: 'Estava a jantar quando o telefone tocou.', zh: '电话响的时候我正在吃晚饭。' },
              { pt: 'De repente, alguém bateu à porta.', zh: '突然有人敲门。' }
            ],
            tip: '信号词：sempre、todos os anos、costumava 常配 imperfeito；de repente、ontem、naquele dia 常配 perfeito。'
          },
          exercises: [
            choice('哪一句描述的是过去的习惯？', 'Qual é a frase correta?', [
              'Quando era pequeno, brincava na rua.',
              'Ontem brinquei na rua.',
              'Amanhã vou brincar na rua.'
            ], 'Quando era pequeno, brincava na rua.', 'brincava 是未完成过去时，配合「小时候」表示反复发生的习惯。'),
            listen('Costumava passar os verões no Algarve.', [
              'Costumava passar os verões no Algarve.',
              'Costumo passar os verões no Algarve.',
              'Costumava passar os invernos no Porto.'
            ], 'Costumava passar os verões no Algarve.', 'costumava 的结尾 -va 表明是过去的习惯；verões 是夏天。'),
            arrange('我小时候常去海滩。', ['Quando', 'era', 'criança', ',', 'costumava', 'ir', 'à', 'praia', '.'], 'Quando era criança, costumava ir à praia.', '背景用 era，习惯用 costumava + 动词原形。'),
            typeIn('突然开始下雨。', ['De repente, começou a chover.', 'De repente começou a chover.'], 'de repente 后接简单过去时 começou；「开始下雨」是 começar a chover。', 'De repente…'),
            match([['infância', '童年'], ['brincar', '玩耍'], ['costumava', '过去常常'], ['crescer', '长大']])
          ]
        },
        {
          id: 'b1l2', title: 'Se pudesse…', zh: '如果我可以……', minutes: 9, xp: 45,
          goal: '用条件式与虚拟式谈假设和梦想',
          vocab: [
            v('gostaria', 'Gostaria de…', '我想要……', 'goosh-tuh-REE-uh duh', 'Gostaria de viver em Lisboa.', '我想住在里斯本。', '比 Queria 更正式、更书面；后面接动词原形。'),
            v('sepudesse', 'se pudesse', '如果我能', 'suh poo-DEH-suh', 'Se pudesse, viajaria pelo mundo.', '如果我能，我会环游世界。', 'poder 的虚拟式过去时；假设从句常用它。'),
            v('fosse', 'se fosse', '如果我是/如果是', 'suh FOH-suh', 'Se fosse rico, compraria uma casa.', '如果我有钱，我会买一栋房子。', 'ser/ir 的虚拟式过去时同形，靠语境区分。'),
            v('sonho', 'o sonho', '梦想', 'SOH-nyoo', 'O meu sonho é abrir um café.', '我的梦想是开一家咖啡馆。', 'sonhar 是做梦；sonho 也可指睡眠中的梦。'),
            v('mudar', 'mudar', '改变 / 搬家', 'moo-DAHR', 'Gostaria de mudar de cidade.', '我想换一座城市生活。', 'mudar de + 名词；mudar-se 也可指搬家。')
          ],
          grammar: {
            title: 'Se + imperfeito do conjuntivo + condicional',
            body: '表达与现在或未来相反的假设：Se + 虚拟式过去时，主句用条件式。Se pudesse, viajaria…；Se fosse rico, compraria…。口语里也常听到用未完成过去时代替条件式（Se pudesse, viajava），但写作时优先用条件式。',
            examples: [
              { pt: 'Se pudesse, viajaria pelo mundo.', zh: '如果我能，我会环游世界。' },
              { pt: 'Se fosse mais novo, estudaria música.', zh: '如果我更年轻，我会学音乐。' },
              { pt: 'Gostaria de mudar de vida, mas não é fácil.', zh: '我想改变生活，但这并不容易。' }
            ],
            tip: '不要说 Se eu posso；假设句里要用 pudesse。条件式词尾：-ia、-ias、-ia、-íamos、-iam。'
          },
          exercises: [
            choice('补全句子：Se pudesse, ___ pelo mundo.', 'Se pudesse, ___ pelo mundo.', ['viajaria', 'viajo', 'viajei'], 'viajaria', '与现在相反的假设，主句用条件式 viajaria。'),
            listen('Gostaria de mudar de cidade.', [
              'Gostaria de mudar de cidade.',
              'Gostaria de mudar de casa.',
              'Gostaria de mudar de emprego.'
            ], 'Gostaria de mudar de cidade.', 'mudar de cidade 是换城市；注意 cidade 的 d 音。'),
            arrange('如果我有钱，我会买一栋房子。', ['Se', 'fosse', 'rico', ',', 'compraria', 'uma', 'casa', '.'], 'Se fosse rico, compraria uma casa.', 'fosse 是虚拟式过去时，compraria 是条件式。'),
            typeIn('我想在里斯本生活。', ['Gostaria de viver em Lisboa.', 'Eu gostaria de viver em Lisboa.'], 'Gostaria de + 动词原形，是礼貌而正式的表达。', 'Gostaria de…'),
            match([['gostaria', '我想要'], ['se pudesse', '如果我能'], ['sonho', '梦想'], ['mudar', '改变']])
          ]
        },
        {
          id: 'b1l3', title: 'Uma história em Lisboa', zh: '里斯本的一天', minutes: 9, xp: 45,
          goal: '用连接词把一段经历讲清楚',
          vocab: [
            v('primeiro', 'primeiro', '首先', 'pree-MAY-roo', 'Primeiro, visitei o castelo.', '首先，我参观了城堡。', '叙事顺序：primeiro, depois, por fim。'),
            v('entretanto', 'entretanto', '与此同时 / 期间', 'ehn-truh-TEHN-too', 'Entretanto, começou a anoitecer.', '与此同时，天开始黑了。', '可放在句首或句中，语气比 enquanto 更书面。'),
            v('afinal', 'afinal', '最终 / 毕竟', 'ah-fee-NAHL', 'Afinal, não fomos ao fado.', '最后我们还是没去听法多。', '既可表示「最终」，也可表示「毕竟、原来」。'),
            v('enfim', 'enfim', '终于 / 总之', 'ehn-FEEN', 'Enfim, foi um dia inesquecível.', '总之，那是难忘的一天。', '常用于总结，也可表示松一口气的「终于」。'),
            v('recordacao', 'a recordação', '回忆', 'ruh-kor-dah-SOWN', 'Guardo uma boa recordação daquela viagem.', '那次旅行给我留下了美好的回忆。', '复数 recordações；动词 recordar 是记得。')
          ],
          grammar: {
            title: '把事件串起来：叙事连接词',
            body: '讲故事时，先用 imperfeito 铺背景，再用 perfeito 推进事件：Estava em Lisboa quando…。连接词负责方向：primeiro 先、depois 然后、entretanto 期间、por fim 最后、afinal 最终/原来。写作时不要每句都用 e，连接词会让叙事更有层次。',
            examples: [
              { pt: 'Primeiro, fomos ao mercado. Depois, subimos ao castelo.', zh: '我们先去了市场，然后登上了城堡。' },
              { pt: 'Entretanto, começou a chover.', zh: '在此期间，开始下雨了。' },
              { pt: 'Afinal, decidimos ficar em casa.', zh: '最后，我们决定待在家里。' }
            ],
            tip: '结尾想表达「总之」可以用 Enfim；想表达「结果发现」用 Afinal。'
          },
          exercises: [
            choice('哪一句的「afinal」表示「最后、结果」？', 'Afinal…', [
              'Afinal, ficámos em casa.',
              'Afinal de contas, tens razão.',
              'Ele chegou, afinal.'
            ], 'Afinal, ficámos em casa.', '句首的 Afinal 常表示「最终/结果」；afinal de contas 是「毕竟」。'),
            listen('Primeiro fomos ao mercado e depois subimos ao castelo.', [
              'Primeiro fomos ao mercado e depois subimos ao castelo.',
              'Primeiro subimos ao castelo e depois fomos ao mercado.',
              'Entretanto fomos ao mercado e ao castelo.'
            ], 'Primeiro fomos ao mercado e depois subimos ao castelo.', 'primeiro… depois… 是叙事顺序；subimos 是「登上」。'),
            arrange('首先我们去了市场，然后登上了城堡。', ['Primeiro', 'fomos', 'ao', 'mercado', 'e', 'depois', 'subimos', 'ao', 'castelo', '.'], 'Primeiro fomos ao mercado e depois subimos ao castelo.', '顺序词放句首；ir ao mercado 是去市场。'),
            typeIn('最后，我们决定留在家里。', ['No fim, decidimos ficar em casa.', 'Afinal, decidimos ficar em casa.'], 'decidimos 是简单过去时；ficar em casa 是待在家。', 'No fim…'),
            match([['primeiro', '首先'], ['entretanto', '与此同时'], ['afinal', '最终'], ['enfim', '终于 / 总之']])
          ]
        }
      ]
    },
    {
      id: 'u8', order: 8, title: 'Argumentar e decidir', zh: '论证与决策', color: 'gold', symbol: 'chart',
      blurb: '在会议上表达立场，写一封得体的正式邮件，听懂辩论里的让步。',
      lessons: [
        {
          id: 'b2l1', title: 'Na reunião', zh: '在会议上', minutes: 10, xp: 50,
          goal: '用连接词组织观点和让步',
          vocab: [
            v('porumlado', 'por um lado', '一方面', 'por oon LAH-doo', 'Por um lado, a ideia é boa.', '一方面，这个想法不错。', '常与 por outro lado 配对。'),
            v('noentanto', 'no entanto', '然而', 'noo ehn-TAHN-too', 'No entanto, há riscos.', '然而，存在风险。', '比 mas 更书面，适合会议和写作。'),
            v('portanto', 'portanto', '因此', 'por-TAHN-too', 'Portanto, precisamos de mais tempo.', '因此，我们需要更多时间。', '表示逻辑结论，不表示转折。'),
            v('teremconta', 'ter em conta', '考虑到', 'tehr ehn KOHN-tuh', 'Temos de ter em conta os custos.', '我们必须考虑成本。', '固定搭配：ter em conta + 名词。'),
            v('decisao', 'a decisão', '决定', 'duh-see-ZOWN', 'A decisão foi adiada.', '决定被推迟了。', '复数 decisões；动词 decidir。')
          ],
          grammar: {
            title: '观点的骨架：让步 + 转折 + 结论',
            body: '成熟的观点不是一串「我觉得」，而是有结构的：Por um lado…, por outro lado…；No entanto…；Portanto…。表达必要性时可用 É importante que + 虚拟式：É importante que tenhamos em conta os riscos。会议里还常用 Chegámos a um consenso。',
            examples: [
              { pt: 'Por um lado, o projeto é caro; por outro, é necessário.', zh: '一方面项目很贵；另一方面，它有必要。' },
              { pt: 'No entanto, ainda não temos todos os dados.', zh: '然而，我们还没有全部数据。' },
              { pt: 'Portanto, proponho adiar a decisão.', zh: '因此，我建议推迟决定。' }
            ],
            tip: 'No entanto 后面接事实或反方观点；Portanto 后面接你的结论。'
          },
          exercises: [
            choice('选择最合适的连接词：O projeto é caro; ___, vale a pena.', 'O projeto é caro; ___, vale a pena.', ['no entanto', 'portanto', 'por exemplo'], 'no entanto', '前后是让步/转折关系，用 no entanto。'),
            listen('Por um lado, é uma boa ideia; por outro, há riscos.', [
              'Por um lado, é uma boa ideia; por outro, há riscos.',
              'Por um lado, é caro; portanto, há riscos.',
              'No entanto, é uma boa ideia e não há riscos.'
            ], 'Por um lado, é uma boa ideia; por outro, há riscos.', 'por um lado… por outro… 是平衡论证的固定框架。'),
            arrange('我们需要把成本考虑进去。', ['Temos', 'de', 'ter', 'em', 'conta', 'os', 'custos', '.'], 'Temos de ter em conta os custos.', 'ter de + 动词原形表示「必须」；ter em conta 是考虑到。'),
            typeIn('因此，我不同意这个决定。', ['Portanto, não concordo com a decisão.', 'Por isso, não concordo com a decisão.'], 'concordar com + 名词；decisão 是阴性。', 'Portanto…'),
            match([['por um lado', '一方面'], ['no entanto', '然而'], ['portanto', '因此'], ['decisão', '决定']])
          ]
        },
        {
          id: 'b2l2', title: 'Uma carta formal', zh: '一封正式邮件', minutes: 10, xp: 50,
          goal: '掌握求职邮件的正式语体',
          vocab: [
            v('venhoporeste', 'Venho por este meio…', '我特此……', 'VEH-nyoo por ESH-tuh MAY-oo', 'Venho por este meio candidatar-me à vaga.', '我特此申请该职位。', '正式邮件开头，后面接动词原形。'),
            v('candidatura', 'a candidatura', '申请', 'kuhn-dee-duh-TOO-ruh', 'Envio a minha candidatura em anexo.', '我随附我的申请。', 'candidatar-se a 是申请。'),
            v('agradeco', 'Agradeço…', '感谢……', 'uh-gruh-DEH-soo', 'Agradeço a sua atenção.', '感谢您的关注。', '比 obrigado 更正式，邮件常用。'),
            v('atenciosamente', 'Atenciosamente,', '此致敬礼', 'uh-tehn-see-oh-zuh-MEHN-tuh', 'Atenciosamente, Ana Silva', '此致敬礼，安娜·席尔瓦', '非常正式的邮件结尾；朋友间不用。'),
            v('anexo', 'em anexo', '随附', 'ehn uh-NEH-ksoo', 'Em anexo, envio o meu currículo.', '随附我的简历。', '也可说 em anexo segue…；anexo 是附件。')
          ],
          grammar: {
            title: '正式语体：距离感不是复杂词',
            body: '正式邮件靠稳定的结构，而不是堆砌大词：称呼（Exmo./Exma. Sr./Sra.）、来意（Venho por este meio…）、正文（Agradeço… / Solicito…）、附件（Em anexo…）、结尾（Atenciosamente / Com os melhores cumprimentos）。避免 tu、缩写和口语。',
            examples: [
              { pt: 'Venho por este meio candidatar-me à vaga de gestor de projeto.', zh: '我特此申请项目经理职位。' },
              { pt: 'Agradeço a atenção dispensada à minha candidatura.', zh: '感谢您对我的申请给予关注。' },
              { pt: 'Em anexo, envio o meu currículo e uma carta de motivação.', zh: '随附我的简历和求职信。' }
            ],
            tip: '正式邮件里少用 Quero，多用 Gostaria / Solicito / Venho por este meio。'
          },
          exercises: [
            choice('哪一句最适合正式求职邮件？', 'Escolhe a opção formal.', [
              'Venho por este meio candidatar-me à vaga.',
              'Oi! Quero esse emprego.',
              'Então, dá para trabalhar aí?'
            ], 'Venho por este meio candidatar-me à vaga.', '正式邮件用完整结构；其余两句过于口语。'),
            listen('Em anexo, envio o meu currículo.', [
              'Em anexo, envio o meu currículo.',
              'Em anexo, envio a minha carta.',
              'Agradeço o envio do currículo.'
            ], 'Em anexo, envio o meu currículo.', 'currículo 是简历；em anexo 是随附。'),
            arrange('我特此申请这个职位。', ['Venho', 'por', 'este', 'meio', 'candidatar-me', 'à', 'vaga', '.'], 'Venho por este meio candidatar-me à vaga.', 'candidatar-me à vaga；à = a + a。'),
            typeIn('感谢您的关注。', ['Agradeço a sua atenção.', 'Agradeço a atenção.'], '正式邮件用 Agradeço a sua atenção。', 'Agradeço…'),
            match([['candidatura', '申请'], ['agradeço', '感谢'], ['atenciosamente', '此致敬礼'], ['em anexo', '随附']])
          ]
        },
        {
          id: 'b2l3', title: 'Debate sobre turismo', zh: '关于旅游的辩论', minutes: 10, xp: 50,
          goal: '用让步和条件从句表达复杂立场',
          vocab: [
            v('embora', 'embora', '虽然', 'ehn-BOH-ruh', 'Embora seja caro, vale a pena.', '虽然贵，但值得。', '后面接虚拟式：embora seja / embora tenha。'),
            v('apesarde', 'apesar de', '尽管', 'uh-puh-ZEHR duh', 'Apesar de haver turistas, a cidade está calma.', '尽管有游客，城市依然平静。', 'apesar de + 名词/动词原形。'),
            v('desdeque', 'desde que', '只要', 'DEHSH-duh kuh', 'Desde que haja regras claras, apoio.', '只要有明确规则，我就支持。', '表示条件，后面常接虚拟式。'),
            v('pelocontrario', 'pelo contrário', '相反', 'PEH-loo kohn-TRAH-ree-oo', 'Não critico o turismo; pelo contrário, defendo-o.', '我不批评旅游；相反，我支持它。', '用来强烈纠正前面的预设。'),
            v('turismo', 'o turismo', '旅游业', 'too-REESH-moo', 'O turismo representa uma parte importante da economia.', '旅游业占经济的重要部分。', 'turista 是游客；turístico 是旅游的（形容词）。')
          ],
          grammar: {
            title: '让步与条件：embora、apesar de、desde que',
            body: 'embora 后接虚拟式：Embora seja caro…；apesar de 后接名词或动词原形：Apesar de ser caro…；desde que 表示「只要」，也常接虚拟式：Desde que haja…。这些结构让立场更有层次，而不是简单的 a favor / contra。',
            examples: [
              { pt: 'Embora o turismo crie emprego, também aumenta as rendas.', zh: '虽然旅游业创造就业，但也推高房租。' },
              { pt: 'Apesar de haver mais turistas, o centro continua habitado.', zh: '尽管游客更多，市中心仍有人居住。' },
              { pt: 'Desde que o bairro não perca identidade, sou a favor.', zh: '只要社区不失去特色，我就支持。' }
            ],
            tip: 'Embora + 虚拟式；apesar de + 不定式/名词；desde que + 虚拟式。三者不能混用。'
          },
          exercises: [
            choice('补全：Embora ___ caro, vale a pena.', 'Embora ___ caro, vale a pena.', ['seja', 'é', 'era'], 'seja', 'embora 后面必须用虚拟式：seja。'),
            listen('Apesar de haver mais turistas, a cidade continua calma.', [
              'Apesar de haver mais turistas, a cidade continua calma.',
              'Embora haja mais turistas, a cidade continua calma.',
              'Apesar de haver menos turistas, a cidade está calma.'
            ], 'Apesar de haver mais turistas, a cidade continua calma.', 'apesar de + haver 保持动词原形；mais 是更多。'),
            arrange('只要不失去本地特色，我就支持旅游。', ['Desde', 'que', 'não', 'se', 'perca', 'a', 'identidade', 'local', ',', 'apoio', 'o', 'turismo', '.'], 'Desde que não se perca a identidade local, apoio o turismo.', '条件从句用虚拟式 perca；se perca 是无人称反身结构。'),
            typeIn('虽然很贵，我还是买了。', ['Embora fosse caro, comprei.', 'Embora seja caro, comprei.'], 'embora 后接虚拟式；fosse 指过去，seja 指现在。', 'Embora…'),
            match([['embora', '虽然'], ['apesar de', '尽管'], ['desde que', '只要'], ['pelo contrário', '相反']])
          ]
        }
      ]
    },
    {
      id: 'u9', order: 9, title: 'Portugal em mudança', zh: '变化中的葡萄牙', color: 'sea', symbol: 'pin',
      blurb: '用更抽象的葡语讨论住房、移民与环境，练习公共议题的语体。',
      lessons: [
        {
          id: 'c1l1', title: 'A crise da habitação', zh: '住房危机', minutes: 11, xp: 55,
          goal: '用无人称与名词化表达公共议题',
          vocab: [
            v('arrendamento', 'o arrendamento', '租赁 / 房租', 'uh-rrehn-duh-MEHN-too', 'O arrendamento subiu muito nos últimos anos.', '近年来房租上涨了很多。', 'arrendar 是出租；senhorio 是房东。'),
            v('especulacao', 'a especulação', '投机', 'esh-puh-koo-lah-SOWN', 'A especulação imobiliária expulsa residentes.', '房地产投机迫使居民离开。', 'especulação imobiliária 是房地产投机。'),
            v('despejo', 'o despejo', '驱逐 / 迫迁', 'desh-PEH-zhoo', 'Muitas famílias estão em risco de despejo.', '许多家庭面临被驱逐的风险。', 'despejar 是驱逐；despejo 是名词。'),
            v('gentrificacao', 'a gentrificação', '绅士化', 'zhehn-tree-fee-kah-SOWN', 'A gentrificação transformou o centro histórico.', '绅士化改变了历史中心。', '社会学词汇，常与 turistificação 并列。'),
            v('politicaspublicas', 'as políticas públicas', '公共政策', 'poo-LEE-tee-kush POO-blee-kush', 'São necessárias políticas públicas de habitação.', '需要公共住房政策。', 'política 是政策；público 是公共的。')
          ],
          grammar: {
            title: '客观语体：无人称、被动与名词化',
            body: '讨论公共议题时，葡语常用无人称结构：É urgente que se criem soluções；Diz-se que…；Foram tomadas medidas。名词化让语体更正式：aumentar → o aumento、expulsar → a expulsão。但过度名词化会让文章僵硬，一段里用一两次即可。',
            examples: [
              { pt: 'É urgente que se criem soluções para a crise da habitação.', zh: '必须为住房危机创造解决方案。' },
              { pt: 'Foram tomadas medidas para travar a especulação.', zh: '已采取措施遏制投机。' },
              { pt: 'O aumento do arrendamento expulsou famílias do centro.', zh: '房租上涨把家庭赶出了市中心。' }
            ],
            tip: 'se + 第三人称动词是葡语常用的无人称结构：se criem、se diga、se saiba。'
          },
          exercises: [
            choice('哪一句最客观、最适合公共议题写作？', 'Escolhe a frase mais adequada.', [
              'É urgente que se criem soluções.',
              'Temos de arranjar qualquer coisa.',
              'Não há casas, ponto.'
            ], 'É urgente que se criem soluções.', '无人称 se 结构和虚拟式 criem 让语气更正式、客观。'),
            listen('O aumento do arrendamento expulsou muitas famílias do centro.', [
              'O aumento do arrendamento expulsou muitas famílias do centro.',
              'A falta de arrendamento atraiu muitas famílias ao centro.',
              'O aumento do despejo expulsou muitas pessoas do centro.'
            ], 'O aumento do arrendamento expulsou muitas famílias do centro.', 'aumento do arrendamento 是房租上涨；expulsou 是赶走。'),
            arrange('必须采取公共政策来应对投机行为。', ['É', 'necessário', 'tomar', 'medidas', 'públicas', 'para', 'combater', 'a', 'especulação', '.'], 'É necessário tomar medidas públicas para combater a especulação.', 'É necessário + 动词原形；combater a especulação 是打击投机。'),
            typeIn('许多家庭面临被驱逐的风险。', ['Muitas famílias estão em risco de despejo.', 'Muitas famílias correm o risco de despejo.'], 'em risco de + 名词；correr o risco de 也是「冒着……的风险」。', 'Muitas famílias…'),
            match([['arrendamento', '租赁'], ['especulação', '投机'], ['despejo', '迫迁'], ['gentrificação', '绅士化']])
          ]
        },
        {
          id: 'c1l2', title: 'Emigração e regresso', zh: '移民与归来', minutes: 11, xp: 55,
          goal: '谈论迁徙、融入与乡愁',
          vocab: [
            v('diaspora', 'a diáspora', '侨民群体', 'dee-AHSH-poo-ruh', 'A diáspora portuguesa está espalhada pelo mundo.', '葡萄牙侨民遍布世界。', '常指一个民族散居在外的群体。'),
            v('emigracao', 'a emigração', '移居国外', 'ee-mee-gruh-SOWN', 'A emigração marcou gerações de portugueses.', '移居国外影响了几代葡萄牙人。', 'emigrar 是移出；imigrar 是移入。'),
            v('integracao', 'a integração', '融入', 'een-teh-gruh-SOWN', 'A integração exige tempo e língua.', '融入需要时间和语言。', 'integrar-se em 是融入……。'),
            v('saudade', 'a saudade', '乡愁 / 思念', 'sow-DAH-duh', 'Tenho saudades da minha terra.', '我想念我的故乡。', 'ter saudades de… 是想念……；难以逐字翻译。'),
            v('regresso', 'o regresso', '归来', 'ruh-GREH-soo', 'O regresso a casa foi emocionante.', '回家的过程令人动容。', 'regressar a 是回到；regresso a casa 是回家。')
          ],
          grammar: {
            title: '谈论迁移：相对从句与时间跨度',
            body: '描述迁徙经历常用：Há dez anos que vivo fora；Vivi dez anos no estrangeiro；Quem emigra…。注意「在国外」是 no estrangeiro，「在国外生活」是 viver no estrangeiro。ter saudades de 后面接人、地方或动名词。',
            examples: [
              { pt: 'Há dez anos que vivo no estrangeiro.', zh: '我在国外生活十年了。' },
              { pt: 'Quem emigra procura, muitas vezes, melhores condições.', zh: '移居国外的人常常是在寻找更好的条件。' },
              { pt: 'Tenho saudades de Lisboa, mas a vida aqui é boa.', zh: '我想念里斯本，但这里的生活很好。' }
            ],
            tip: 'Há + 时间 + que + 现在时，表示从过去持续到现在；不要用「faz」代替 há 的持续性。'
          },
          exercises: [
            choice('「我想念里斯本」最自然的是：', 'Escolhe a frase correta.', [
              'Tenho saudades de Lisboa.',
              'Tenho saudade Lisboa.',
              'Sou saudade de Lisboa.'
            ], 'Tenho saudades de Lisboa.', '固定搭配是 ter saudades de + 地方/人。'),
            listen('Muitos emigrantes regressam a Portugal nas férias de verão.', [
              'Muitos emigrantes regressam a Portugal nas férias de verão.',
              'Muitos emigrantes regressam a Portugal no inverno.',
              'Muitos turistas regressam a Portugal nas férias de verão.'
            ], 'Muitos emigrantes regressam a Portugal nas férias de verão.', 'emigrantes 是移居国外的人；regressam a 是回到。'),
            arrange('我在国外生活了十年，但一直想念里斯本。', ['Vivi', 'dez', 'anos', 'no', 'estrangeiro', ',', 'mas', 'sempre', 'tive', 'saudades', 'de', 'Lisboa', '.'], 'Vivi dez anos no estrangeiro, mas sempre tive saudades de Lisboa.', '时间跨度用 vivi；ter saudades de 是想念。'),
            typeIn('融入需要时间和语言。', ['A integração exige tempo e língua.', 'A integração requer tempo e língua.'], 'exigir 是要求、需要；注意重音 integração。', 'A integração…'),
            match([['diáspora', '侨民群体'], ['emigração', '移居国外'], ['integração', '融入'], ['regresso', '归来']])
          ]
        },
        {
          id: 'c1l3', title: 'O ambiente e o litoral', zh: '环境与海岸', minutes: 11, xp: 55,
          goal: '讨论环境政策与沿海治理',
          vocab: [
            v('erosaocosteira', 'a erosão costeira', '海岸侵蚀', 'ee-roh-ZOWN koosh-TAY-ruh', 'A erosão costeira ameaça várias praias.', '海岸侵蚀威胁着多处海滩。', 'erosão 是侵蚀；costeiro 是沿海的。'),
            v('sustentabilidade', 'a sustentabilidade', '可持续性', 'soosh-tehn-tuh-bee-lee-DAH-duh', 'A sustentabilidade não é só uma questão ambiental.', '可持续性不只是环境问题。', 'sustentável 是可持续的。'),
            v('transicaoenergetica', 'a transição energética', '能源转型', 'truhn-zee-SOWN ee-ner-ZHEH-tee-kuh', 'A transição energética exige investimento.', '能源转型需要投资。', 'transição 是过渡；energético 是能源的。'),
            v('pegada', 'a pegada', '足迹', 'puh-GAH-duh', 'Queremos reduzir a pegada de carbono.', '我们想减少碳足迹。', 'pegada de carbono 是碳足迹；pegada ecológica 是生态足迹。'),
            v('ordenamento', 'o ordenamento', '规划 / 整治', 'or-duh-nuh-MEHN-too', 'O ordenamento do território é essencial.', '国土规划至关重要。', 'ordenamento do território 是空间规划。')
          ],
          grammar: {
            title: '环境议题的搭配与被动',
            body: '环境话语有一批固定搭配：reduzir a pegada de carbono、travar a erosão、promover a transição energética、ordenar o território。被动语态让政策文本更客观：Têm sido tomadas medidas；O litoral foi classificado como zona protegida。',
            examples: [
              { pt: 'Têm sido tomadas medidas para travar a erosão costeira.', zh: '已采取措施遏制海岸侵蚀。' },
              { pt: 'É fundamental reduzir a pegada de carbono.', zh: '减少碳足迹至关重要。' },
              { pt: 'O ordenamento do território deve envolver as comunidades locais.', zh: '空间规划应让当地社区参与。' }
            ],
            tip: '「采取措施」是 tomar medidas；「实施政策」是 implementar políticas。'
          },
          exercises: [
            choice('哪个搭配是正确的？', 'Qual é a collocação correta?', ['pegada de carbono', 'pé de carbono', 'marca de carbono'], 'pegada de carbono', '碳足迹固定说 pegada de carbono。'),
            listen('A erosão costeira tem sido agravada pelas alterações climáticas.', [
              'A erosão costeira tem sido agravada pelas alterações climáticas.',
              'A transição energética tem sido agravada pelas alterações climáticas.',
              'A erosão costeira tem sido resolvida pelas alterações climáticas.'
            ], 'A erosão costeira tem sido agravada pelas alterações climáticas.', 'tem sido agravada 是现在完成被动；alterações climáticas 是气候变化。'),
            arrange('沿海地区需要更严格的规划。', ['O', 'litoral', 'precisa', 'de', 'um', 'ordenamento', 'mais', 'rigoroso', '.'], 'O litoral precisa de um ordenamento mais rigoroso.', 'precisar de + 名词；rigoroso 是严格的。'),
            typeIn('可持续性不只是环境问题。', ['A sustentabilidade não é apenas uma questão ambiental.', 'A sustentabilidade não é só uma questão ambiental.'], 'não é apenas/só… 是「不只是」；ambiental 阴阳同形。', 'A sustentabilidade…'),
            match([['erosão costeira', '海岸侵蚀'], ['sustentabilidade', '可持续性'], ['pegada', '足迹'], ['ordenamento', '规划']])
          ]
        }
      ]
    },
    {
      id: 'u10', order: 10, title: 'Vozes e subtexto', zh: '声音与言外之意', color: 'plum', symbol: 'sun',
      blurb: '读文学、听懂反讽、掌握习语，在字面之外再听一层。',
      lessons: [
        {
          id: 'c2l1', title: 'Pessoa e os heterónimos', zh: '佩索阿与异名者', minutes: 12, xp: 60,
          goal: '用文学批评语言谈论佩索阿',
          vocab: [
            v('heteronimo', 'o heterónimo', '异名者', 'eh-teh-ROH-nee-moo', 'Pessoa criou vários heterónimos.', '佩索阿创造了多个异名者。', 'hetero- 是「异」，-ónimo 是「名」；不是笔名 pseudónimo。'),
            v('fingimento', 'o fingimento', '虚构 / 伪装', 'feen-zhee-MEHN-too', 'Para Pessoa, o fingimento é criação poética.', '对佩索阿来说，虚构就是诗歌创造。', '在佩索阿诗学里不是「撒谎」，而是创造另一种真实。'),
            v('desassossego', 'o desassossego', '不安 / 不宁', 'duh-zuh-soh-SEH-goo', 'O Livro do Desassossego é uma obra fragmentária.', '《不安之书》是一部碎片化的作品。', 'sossego 是安宁；desassossego 是它的反面。'),
            v('verso', 'o verso', '诗句', 'VEHR-soo', 'O verso é livre e íntimo.', '诗句自由而私密。', 'verso 是诗行；poema 是整首诗。'),
            v('alteridade', 'a alteridade', '他者性', 'ahl-teh-ree-DAH-duh', 'O outro é uma forma de alteridade.', '他者是「他者性」的一种形式。', '哲学词汇；alter 是「他者」。')
          ],
          grammar: {
            title: '文学语体：隐喻、同位与保留',
            body: '文学评论常用：A obra gira em torno de…；O eu lírico…；A escrita de Pessoa caracteriza-se por…。注意区分 autor（作者）、narrador（叙述者）和 eu lírico（抒情主体）。谈佩索阿时，fingimento 不是「造假」，而是通过异名者创造多重主体。',
            examples: [
              { pt: 'A obra de Pessoa caracteriza-se pela multiplicidade de vozes.', zh: '佩索阿的作品以多重声音为特征。' },
              { pt: 'O fingimento poético não equivale a mentira.', zh: '诗歌中的虚构并不等同于谎言。' },
              { pt: 'O Livro do Desassossego gira em torno da inquietação interior.', zh: '《不安之书》围绕内心的不安展开。' }
            ],
            tip: 'ao invés de = 而不是；caracterizar-se por = 以……为特征；girar em torno de = 围绕……展开。'
          },
          exercises: [
            choice('在佩索阿的诗学里，fingimento 更接近：', 'O que significa «fingimento» em Pessoa?', [
              '诗歌创造，而不是单纯撒谎',
              '伪造文件',
              '忘记自己的名字'
            ], '诗歌创造，而不是单纯撒谎', '佩索阿的「fingimento」是通过异名者创造另一种真实，不是日常意义的欺骗。'),
            listen('Pessoa diz que o poeta é um fingidor.', [
              'Pessoa diz que o poeta é um fingidor.',
              'Pessoa diz que o poeta é um mentiroso.',
              'Pessoa diz que o poema é uma mentira.'
            ], 'Pessoa diz que o poeta é um fingidor.', 'fingidor 是「虚构者」；这是佩索阿名句的核心。'),
            arrange('诗人是一个虚构者，虚构得如此彻底。', ['O', 'poeta', 'é', 'um', 'fingidor', 'que', 'finge', 'tão', 'completamente', '.'], 'O poeta é um fingidor que finge tão completamente.', '关系从句 que finge 修饰 fingidor；tão completamente 是「如此彻底」。'),
            typeIn('《不安之书》是一部关于不安的作品。', ['O Livro do Desassossego é uma obra sobre a inquietação.', 'O Livro do Desassossego é uma obra sobre o desassossego.'], '书名保留原文；inquietação 与 desassossego 都可表达不安。', 'O Livro do Desassossego…'),
            match([['heterónimo', '异名者'], ['fingimento', '虚构'], ['desassossego', '不安'], ['alteridade', '他者性']])
          ]
        },
        {
          id: 'c2l2', title: 'Ironia à portuguesa', zh: '葡萄牙式反讽', minutes: 12, xp: 60,
          goal: '识别反讽、言外之意和双重含义',
          vocab: [
            v('ironia', 'a ironia', '反讽', 'ee-roh-NEE-uh', 'A ironia está no tom, não nas palavras.', '反讽在语气里，不在字面上。', 'irónico 是讽刺的；ironizar 是讽刺地说。'),
            v('subentendido', 'o subentendido', '言外之意', 'soo-behn-tehn-DEE-doo', 'Há um subentendido naquela resposta.', '那个回答里另有含义。', 'entender 是理解；subentendido 是「未被明说但可理解」的意思。'),
            v('duplosentido', 'o duplo sentido', '双关', 'DOO-ploo sehn-TEE-doo', 'A frase tem um duplo sentido.', '这句话有双关。', '常见于幽默、广告和文学。'),
            v('socapa', 'à socapa', '悄悄地', 'ah soo-KAH-puh', 'Ele sorriu à socapa.', '他偷偷笑了。', '书面、口语都用，带一点「不让别人发现」的意味。'),
            v('gozar', 'gozar', '开玩笑 / 取笑', 'goo-ZAHR', 'Estou só a gozar contigo.', '我只是在跟你开玩笑。', 'gozar com alguém 是取笑某人；语境决定是否友善。')
          ],
          grammar: {
            title: '反讽不靠词汇，靠语气与语境',
            body: '葡语反讽常用「过度肯定」或轻描淡写：Claro, porque isso corre sempre tão bem；Está bem, está；Pois, pois。听者要结合语气、表情和上下文判断。写作中可用 aspas 或「dito isto」提示反讽，但不要滥用。',
            examples: [
              { pt: 'Claro, porque isso corre sempre tão bem.', zh: '当然啦，毕竟这事总是那么顺利。（反讽）' },
              { pt: 'Ele disse que estava tudo ótimo, mas num tom irónico.', zh: '他说一切都很好，但语气是讽刺的。' },
              { pt: 'Está bem, está. Acredito.', zh: '行行行，我信。（未必真信）' }
            ],
            tip: '重复对方的词、故意夸张、突然停顿，都是葡语反讽的信号。'
          },
          exercises: [
            choice('哪一句最可能是反讽？', 'Qual é a frase irónica?', [
              'Claro, porque isso corre sempre tão bem.',
              'O projeto correu bem.',
              'Fiquei satisfeito com o resultado.'
            ], 'Claro, porque isso corre sempre tão bem.', '「总是那么顺利」在明显出问题时就是反讽。'),
            listen('Ele disse que estava tudo ótimo, mas num tom irónico.', [
              'Ele disse que estava tudo ótimo, mas num tom irónico.',
              'Ele disse que estava tudo mal, mas num tom irónico.',
              'Ele disse que estava tudo ótimo, mas num tom sério.'
            ], 'Ele disse que estava tudo ótimo, mas num tom irónico.', 'tudo ótimo 与 tom irónico 形成反差；注意 mas。'),
            arrange('他话里有话。', ['Há', 'ali', 'qualquer', 'coisa', 'nas', 'entrelinhas', '.'], 'Há ali qualquer coisa nas entrelinhas.', 'nas entrelinhas 是「字里行间」，比直译 subentendido 更自然。'),
            typeIn('她只是在开玩笑，别当真。', ['Ela está só a gozar, não leves a sério.', 'Ela está só a brincar, não leves a sério.'], 'gozar 是开玩笑/取笑；levar a sério 是当真。', 'Ela está só…'),
            match([['ironia', '反讽'], ['subentendido', '言外之意'], ['duplo sentido', '双关'], ['gozar', '开玩笑']])
          ]
        },
        {
          id: 'c2l3', title: 'O português do dia a dia', zh: '地道习语', minutes: 12, xp: 60,
          goal: '听懂并使用高频葡萄牙习语',
          vocab: [
            v('pulgaorelha', 'ficar com a pulga atrás da orelha', '起疑心', 'fee-KAHR kohn uh POOL-guh uh-TRAHS duh oh-REH-lyuh', 'Fiquei com a pulga atrás da orelha.', '我起了疑心。', '字面是「耳朵后面有只跳蚤」，表示觉得不对劲。'),
            v('pespelasmaos', 'meter os pés pelas mãos', '手忙脚乱 / 搞砸', 'muh-TEHR oosh pehsh peh-lush mownsh', 'Meta os pés pelas mãos e disse a coisa errada.', '他手忙脚乱，说错了话。', '字面是「把脚伸进手里」，形容笨拙出错。'),
            v('aguasdebacalhau', 'ficar em águas de bacalhau', '不了了之', 'fee-KAHR ehn AH-gwush duh buh-kuh-LYOW', 'O plano ficou em águas de bacalhau.', '计划不了了之。', '字面是「泡在鳕鱼水里」，指事情没成。'),
            v('atoa', 'à toa', '漫无目的地', 'ah TOH-uh', 'Andámos à toa pela cidade.', '我们在城里漫无目的地逛。', '常与 andar、vaguear 搭配；不是「在船上」。'),
            v('maosabanar', 'de mãos a abanar', '空手', 'duh mownsh ah buh-NAHR', 'Saí de lá de mãos a abanar.', '我空手而归。', '字面是「双手晃着」，表示什么也没拿到。')
          ],
          grammar: {
            title: '习语是固定块，不要逐字翻译',
            body: '习语的意义不能从字面推导，也不能随意换词：ficar com a pulga atrás da orelha、meter os pés pelas mãos、ficar em águas de bacalhau。先整块记住，再观察语域：多数习语偏口语，正式写作中要慎用。',
            examples: [
              { pt: 'Fiquei com a pulga atrás da orelha quando ele mudou de assunto.', zh: '他转移话题时，我起了疑心。' },
              { pt: 'O projeto ficou em águas de bacalhau.', zh: '项目不了了之。' },
              { pt: 'Voltámos de mãos a abanar.', zh: '我们空手而归。' }
            ],
            tip: '习语里的冠词、介词和复数都不能改：a pulga、os pés、as mãos、águas de bacalhau。'
          },
          exercises: [
            choice('「fiquei com a pulga atrás da orelha」是什么意思？', 'O que significa a expressão?', ['我起了疑心', '我耳朵痒', '我养了一只跳蚤'], '我起了疑心', '字面是耳朵后有跳蚤，实际表示觉得不对劲、起疑。'),
            listen('No fim, o projeto ficou em águas de bacalhau.', [
              'No fim, o projeto ficou em águas de bacalhau.',
              'No fim, o projeto ficou em águas de bacalhau e foi um sucesso.',
              'No fim, o projeto ficou em mãos de bacalhau.'
            ], 'No fim, o projeto ficou em águas de bacalhau.', 'ficar em águas de bacalhau 是「不了了之」，不是成功。'),
            arrange('我们空手而归。', ['Voltámos', 'para', 'casa', 'de', 'mãos', 'a', 'abanar', '.'], 'Voltámos para casa de mãos a abanar.', 'de mãos a abanar 是固定短语，表示空手。'),
            typeIn('别把这件事搞得一团糟。', ['Não metas os pés pelas mãos.', 'Não meta os pés pelas mãos.'], 'meter os pés pelas mãos 是手忙脚乱、搞砸；对 tu 用 metas。', 'Não metas…'),
            match([['pulga atrás da orelha', '起疑心'], ['pés pelas mãos', '手忙脚乱'], ['águas de bacalhau', '不了了之'], ['mãos a abanar', '空手']])
          ]
        }
      ]
    }
  ];

  const media = [
    {
      id: 'm-a1-video', level: 'A1', type: 'video', scene: 'cafe', title: 'No café', zh: '在咖啡馆点单', minutes: 2,
      description: 'Ana 走进街角咖啡馆，点了一杯 bica 和一个 pastel de nata。听她怎么点单、问价和道谢。',
      cast: [{ name: 'Ana', role: 'A' }, { name: 'Rui', role: 'B' }],
      lines: [
        { who: 'Rui', role: 'B', pt: 'Bom dia! O que deseja?', zh: '早上好！您要什么？' },
        { who: 'Ana', role: 'A', pt: 'Bom dia! Um café e um pastel de nata, se faz favor.', zh: '早上好！请来一杯浓缩咖啡和一个葡式蛋挞。' },
        { who: 'Rui', role: 'B', pt: 'É para aqui ou para levar?', zh: '在这儿喝还是带走？' },
        { who: 'Ana', role: 'A', pt: 'É para aqui. Quanto custa?', zh: '在这儿。多少钱？' },
        { who: 'Rui', role: 'B', pt: 'São dois euros e vinte.', zh: '一共两欧二十。' },
        { who: 'Ana', role: 'A', pt: 'Aqui tem. Obrigada!', zh: '给您。谢谢！' }
      ],
      questions: [
        { q: 'O que pede a Ana?', zh: 'Ana 点了什么？', options: ['Um café e um pastel de nata.', 'Uma água e um bolo.', 'Um galão e uma sandes.'], answer: 'Um café e um pastel de nata.', explain: '她点了 um café 和 um pastel de nata。' },
        { q: 'Quanto paga?', zh: '她付了多少钱？', options: ['Dois euros e vinte.', 'Dois euros e cinquenta.', 'Três euros e vinte.'], answer: 'Dois euros e vinte.', explain: 'Rui 说 São dois euros e vinte。' },
        { q: 'Onde vai comer a Ana?', zh: 'Ana 在哪里吃？', options: ['No café.', 'Em casa.', 'No trabalho.'], answer: 'No café.', explain: '她回答 É para aqui，意思是就在这里。' }
      ]
    },
    {
      id: 'm-a1-audio', level: 'A1', type: 'audio', scene: 'studio', title: 'Conhecer alguém', zh: '认识新朋友', minutes: 2,
      description: 'Tomás 和 Mei 第一次见面，互相介绍名字、来处和语言。适合练 tu 的日常问候。',
      cast: [{ name: 'Tomás', role: 'A' }, { name: 'Mei', role: 'B' }],
      lines: [
        { who: 'Tomás', role: 'A', pt: 'Olá! Chamo-me Tomás. E tu?', zh: '你好！我叫托马斯。你呢？' },
        { who: 'Mei', role: 'B', pt: 'Olá, Tomás. Sou a Mei. Prazer em conhecer-te.', zh: '你好，托马斯。我是梅。很高兴认识你。' },
        { who: 'Tomás', role: 'A', pt: 'De onde és?', zh: '你来自哪里？' },
        { who: 'Mei', role: 'B', pt: 'Sou chinesa, mas vivo em Lisboa. E tu?', zh: '我是中国人，但住在里斯本。你呢？' },
        { who: 'Tomás', role: 'A', pt: 'Sou português, do Porto. Falas português muito bem!', zh: '我是葡萄牙人，来自波尔图。你的葡语说得很好！' },
        { who: 'Mei', role: 'B', pt: 'Obrigada! Estou a aprender.', zh: '谢谢！我正在学。' }
      ],
      questions: [
        { q: 'De onde é a Mei?', zh: 'Mei 来自哪里？', options: ['Da China.', 'De Portugal.', 'Do Porto.'], answer: 'Da China.', explain: '她说 Sou chinesa，因此来自中国。' },
        { q: 'Onde vive a Mei?', zh: 'Mei 住在哪里？', options: ['Em Lisboa.', 'No Porto.', 'Em Xangai.'], answer: 'Em Lisboa.', explain: '她说 vivo em Lisboa。' },
        { q: 'Como se chama o rapaz?', zh: '男生叫什么？', options: ['Tomás.', 'Rui.', 'Pedro.'], answer: 'Tomás.', explain: '他自我介绍 Chamo-me Tomás。' }
      ]
    },
    {
      id: 'm-a2-video', level: 'A2', type: 'video', scene: 'market', title: 'No mercado', zh: '在菜市场', minutes: 3,
      description: '在里斯本的 mercado，顾客买番茄、香菜和橙子。练习数量、价格和 mais alguma coisa。',
      cast: [{ name: 'Vendedora', role: 'A' }, { name: 'Cliente', role: 'B' }],
      lines: [
        { who: 'Vendedora', role: 'A', pt: 'Bom dia! O que deseja?', zh: '早上好！您要什么？' },
        { who: 'Cliente', role: 'B', pt: 'Queria meio quilo de tomates e um ramo de coentros.', zh: '我想要半公斤番茄和一把香菜。' },
        { who: 'Vendedora', role: 'A', pt: 'Mais alguma coisa?', zh: '还要别的吗？' },
        { who: 'Cliente', role: 'B', pt: 'Sim, tem laranjas doces?', zh: '有，你们有甜橙吗？' },
        { who: 'Vendedora', role: 'A', pt: 'Tenho estas, são ótimas. São três euros o quilo.', zh: '有这些，非常好。三欧一公斤。' },
        { who: 'Cliente', role: 'B', pt: 'Então, leve um quilo. Quanto é tudo?', zh: '那来一公斤。一共多少钱？' },
        { who: 'Vendedora', role: 'A', pt: 'São cinco euros e quarenta.', zh: '一共五欧四十。' }
      ],
      questions: [
        { q: 'Quanto tomate pede o cliente?', zh: '顾客要多少番茄？', options: ['Meio quilo.', 'Um quilo.', 'Dois quilos.'], answer: 'Meio quilo.', explain: '他说 meio quilo de tomates。' },
        { q: 'Quanto custam as laranjas?', zh: '橙子多少钱？', options: ['Três euros o quilo.', 'Cinco euros o quilo.', 'Dois euros o quilo.'], answer: 'Três euros o quilo.', explain: '摊主说 São três euros o quilo。' },
        { q: 'Quanto paga no total?', zh: '总共付多少？', options: ['Cinco euros e quarenta.', 'Cinco euros e catorze.', 'Três euros e cinquenta.'], answer: 'Cinco euros e quarenta.', explain: '最后一句是 São cinco euros e quarenta。' }
      ]
    },
    {
      id: 'm-a2-audio', level: 'A2', type: 'audio', scene: 'studio', title: 'Planos para o fim de semana', zh: '周末计划', minutes: 2,
      description: 'Inês 和 Miguel 约周末去 Sintra。听他们怎么提议、约定时间、做准备。',
      cast: [{ name: 'Inês', role: 'A' }, { name: 'Miguel', role: 'B' }],
      lines: [
        { who: 'Inês', role: 'A', pt: 'Já tens planos para o fim de semana?', zh: '你周末有安排了吗？' },
        { who: 'Miguel', role: 'B', pt: 'Ainda não. Talvez vá a Sintra no sábado. Queres vir?', zh: '还没有。也许周六去辛特拉。你想来吗？' },
        { who: 'Inês', role: 'A', pt: 'Adorava! A que horas partimos?', zh: '我很想去！我们几点出发？' },
        { who: 'Miguel', role: 'B', pt: 'Podemos apanhar o comboio às nove e meia.', zh: '我们可以坐九点半的火车。' },
        { who: 'Inês', role: 'A', pt: 'Combinado. Levo uns sandes e uma garrafa de água.', zh: '说定了。我带几个三明治和一瓶水。' },
        { who: 'Miguel', role: 'B', pt: 'Ótimo. Vai fazer sol, dizem.', zh: '太好了。据说会出太阳。' }
      ],
      questions: [
        { q: 'Para onde quer ir o Miguel?', zh: 'Miguel 想去哪里？', options: ['A Sintra.', 'Ao Porto.', 'À praia.'], answer: 'A Sintra.', explain: '他说 Talvez vá a Sintra。' },
        { q: 'A que horas partem?', zh: '他们几点出发？', options: ['Às nove e meia.', 'Às nove.', 'Às dez e meia.'], answer: 'Às nove e meia.', explain: '火车是 às nove e meia。' },
        { q: 'O que leva a Inês?', zh: 'Inês 带什么？', options: ['Sandes e água.', 'Café e bolo.', 'Vinha e queijo.'], answer: 'Sandes e água.', explain: '她说 Levo uns sandes e uma garrafa de água。' }
      ]
    },
    {
      id: 'm-b1-video', level: 'B1', type: 'video', scene: 'clinic', title: 'Na consulta', zh: '在诊所', minutes: 3,
      description: '持续头痛、睡不好，如何向医生描述症状、说明用药，并听懂医嘱。',
      cast: [{ name: 'Médica', role: 'A' }, { name: 'Doente', role: 'B' }],
      lines: [
        { who: 'Médica', role: 'A', pt: 'Bom dia. O que se passa?', zh: '早上好。哪里不舒服？' },
        { who: 'Doente', role: 'B', pt: 'Tenho dores de cabeça há três dias e não consigo dormir.', zh: '我头痛三天了，而且睡不着。' },
        { who: 'Médica', role: 'A', pt: 'Tem tomado algum medicamento?', zh: '您在吃什么药吗？' },
        { who: 'Doente', role: 'B', pt: 'Só paracetamol, mas não tem ajudado.', zh: '只吃了扑热息痛，但没什么用。' },
        { who: 'Médica', role: 'A', pt: 'Vou receitar-lhe algo mais forte. Se não melhorar até segunda, volte.', zh: '我给您开点更强的药。如果到周一还不好，请再来。' },
        { who: 'Doente', role: 'B', pt: 'Muito obrigado, doutora.', zh: '非常感谢，医生。' }
      ],
      questions: [
        { q: 'Há quanto tempo tem dores de cabeça?', zh: '头痛持续多久了？', options: ['Há três dias.', 'Há três semanas.', 'Há três horas.'], answer: 'Há três dias.', explain: '他说 dores de cabeça há três dias。' },
        { q: 'Que medicamento tomou?', zh: '他吃了什么药？', options: ['Paracetamol.', 'Ibuprofeno.', 'Nada.'], answer: 'Paracetamol.', explain: '他说 Só paracetamol。' },
        { q: 'O que deve fazer se não melhorar?', zh: '如果没好转要怎么做？', options: ['Voltar à consulta.', 'Parar o medicamento.', 'Ir às urgências imediatamente.'], answer: 'Voltar à consulta.', explain: '医生说 Se não melhorar até segunda, volte。' }
      ]
    },
    {
      id: 'm-b1-audio', level: 'B1', type: 'audio', scene: 'studio', title: 'Uma história de viagem', zh: '一次旅行', minutes: 3,
      description: 'Pedro 讲他在 Gerês 的两天：下雨、改计划、徒步六小时。注意叙事中的时态切换。',
      cast: [{ name: 'Sofia', role: 'A' }, { name: 'Pedro', role: 'B' }],
      lines: [
        { who: 'Sofia', role: 'A', pt: 'Conta-me como foi a tua viagem ao Gerês.', zh: '跟我说说你去热雷什的旅行吧。' },
        { who: 'Pedro', role: 'B', pt: 'Foi incrível. No primeiro dia, choveu imenso, por isso ficámos no alojamento.', zh: '太棒了。第一天雨下得很大，所以我们待在住处。' },
        { who: 'Sofia', role: 'A', pt: 'E depois?', zh: '然后呢？' },
        { who: 'Pedro', role: 'B', pt: 'No dia seguinte, o tempo melhorou e fizemos uma caminhada de seis horas.', zh: '第二天天气好转，我们徒步了六个小时。' },
        { who: 'Sofia', role: 'A', pt: 'Deves ter ficado exausto!', zh: '你一定累坏了！' },
        { who: 'Pedro', role: 'B', pt: 'Fiquei, mas valeu a pena. As vistas eram fantásticas.', zh: '确实累，但值得。景色太美了。' }
      ],
      questions: [
        { q: 'Como estava o tempo no primeiro dia?', zh: '第一天的天气怎样？', options: ['Choveu imenso.', 'Fez sol.', 'Estava frio e seco.'], answer: 'Choveu imenso.', explain: 'Pedro 说 choveu imenso。' },
        { q: 'O que fizeram no segundo dia?', zh: '第二天他们做了什么？', options: ['Uma caminhada de seis horas.', 'Ficaram no alojamento.', 'Foram à praia.'], answer: 'Uma caminhada de seis horas.', explain: '他们 fizemos uma caminhada de seis horas。' },
        { q: 'Pedro ficou arrependido?', zh: 'Pedro 后悔了吗？', options: ['Não, valeu a pena.', 'Sim, ficou exausto e triste.', 'Não respondeu.'], answer: 'Não, valeu a pena.', explain: '他说 valeu a pena，所以不后悔。' }
      ]
    },
    {
      id: 'm-b2-video', level: 'B2', type: 'video', scene: 'office', title: 'Entrevista de emprego', zh: '求职面试', minutes: 3,
      description: '一场项目经理岗位的面试：谈动机、抗压方式，并在最后提出有分量的问题。',
      cast: [{ name: 'Entrevistadora', role: 'A' }, { name: 'Candidato', role: 'B' }],
      lines: [
        { who: 'Entrevistadora', role: 'A', pt: 'Porque é que se candidatou a esta vaga?', zh: '您为什么申请这个职位？' },
        { who: 'Candidato', role: 'B', pt: 'Porque procuro um desafio que me permita aplicar a minha experiência em gestão de projetos.', zh: '因为我在寻找一个能让我运用项目管理经验的挑战。' },
        { who: 'Entrevistadora', role: 'A', pt: 'Como lida com prazos apertados?', zh: '您如何应对紧迫的截止日期？' },
        { who: 'Candidato', role: 'B', pt: 'Costumo priorizar tarefas e comunicar riscos à equipa desde o início.', zh: '我通常会给任务排优先级，并从一开始就向团队沟通风险。' },
        { who: 'Entrevistadora', role: 'A', pt: 'Muito bem. Tem alguma pergunta para nós?', zh: '很好。您有什么问题想问我们吗？' },
        { who: 'Candidato', role: 'B', pt: 'Sim. Como é que avaliam o sucesso neste cargo nos primeiros seis meses?', zh: '有。你们如何评估这个职位前六个月的成功表现？' }
      ],
      questions: [
        { q: 'Que experiência destaca o candidato?', zh: '候选人强调什么经验？', options: ['Gestão de projetos.', 'Vendas.', 'Design gráfico.'], answer: 'Gestão de projetos.', explain: '他说 experiência em gestão de projetos。' },
        { q: 'Como lida com prazos apertados?', zh: '他如何应对紧迫期限？', options: ['Prioriza tarefas e comunica riscos.', 'Trabalha sozinho.', 'Pede mais tempo.'], answer: 'Prioriza tarefas e comunica riscos.', explain: '他先排优先级，再沟通风险。' },
        { q: 'Que pergunta faz no fim?', zh: '他最后问了什么？', options: ['Como avaliam o sucesso nos primeiros seis meses?', 'Qual é o salário?', 'Posso começar amanhã?'], answer: 'Como avaliam o sucesso nos primeiros seis meses?', explain: '他问的是前六个月的成功评估方式。' }
      ]
    },
    {
      id: 'm-b2-audio', level: 'B2', type: 'audio', scene: 'studio', title: 'Debate sobre turismo', zh: '旅游辩论', minutes: 3,
      description: '两位嘉宾讨论旅游对里斯本的影响：就业、房租、alojamento local 与监管。',
      cast: [{ name: 'Moderadora', role: 'A' }, { name: 'João', role: 'B' }, { name: 'Marta', role: 'C' }],
      lines: [
        { who: 'Moderadora', role: 'A', pt: 'O turismo trouxe benefícios ou problemas a Lisboa?', zh: '旅游给里斯本带来了好处还是问题？' },
        { who: 'João', role: 'B', pt: 'Por um lado, criou emprego; por outro, aumentou as rendas e a pressão sobre os bairros.', zh: '一方面创造了就业；另一方面，房租上涨，社区压力增大。' },
        { who: 'Marta', role: 'C', pt: 'Concordo, mas não podemos ignorar a receita que o setor gera.', zh: '我同意，但我们不能忽视这个行业带来的收入。' },
        { who: 'João', role: 'B', pt: 'Claro. No entanto, é urgente regular o alojamento local.', zh: '当然。然而，迫切需要监管短租。' },
        { who: 'Marta', role: 'C', pt: 'Desde que haja regras claras, sou a favor.', zh: '只要有明确规则，我就支持。' },
        { who: 'Moderadora', role: 'A', pt: 'Portanto, defendem uma abordagem mais equilibrada.', zh: '所以，你们主张更平衡的方式。' }
      ],
      questions: [
        { q: 'Que benefício menciona João?', zh: 'João 提到什么好处？', options: ['A criação de emprego.', 'A descida das rendas.', 'Menos turistas.'], answer: 'A criação de emprego.', explain: '他说 criou emprego。' },
        { q: 'O que João considera urgente?', zh: 'João 认为什么很紧迫？', options: ['Regular o alojamento local.', 'Aumentar o turismo.', 'Fechar os bairros.'], answer: 'Regular o alojamento local.', explain: '他说 é urgente regular o alojamento local。' },
        { q: 'Qual é a posição final de Marta?', zh: 'Marta 的最终立场是什么？', options: ['Apoia, desde que haja regras claras.', 'É totalmente contra.', 'Não tem opinião.'], answer: 'Apoia, desde que haja regras claras.', explain: '她说 Desde que haja regras claras, sou a favor。' }
      ]
    },
    {
      id: 'm-c1-video', level: 'C1', type: 'video', scene: 'meeting', title: 'Reunião de condomínio', zh: '业主委员会会议', minutes: 4,
      description: '讨论外墙修复与预算：要求更多报价、质疑技术依据、建议推迟投票。练习正式会议语体。',
      cast: [{ name: 'Administradora', role: 'A' }, { name: 'Condómino', role: 'B' }, { name: 'Condómina', role: 'C' }],
      lines: [
        { who: 'Administradora', role: 'A', pt: 'A ordem de trabalhos inclui a reabilitação da fachada e o orçamento para 2027.', zh: '议程包括外墙修复和 2027 年预算。' },
        { who: 'Condómino', role: 'B', pt: 'Antes de votarmos, gostaria de saber se foi pedido mais do que um orçamento.', zh: '在表决之前，我想知道是否索取了一份以上的报价。' },
        { who: 'Administradora', role: 'A', pt: 'Sim, recebemos três propostas. A mais barata não cobre a impermeabilização.', zh: '是的，我们收到了三份报价。最便宜的那份不包含防水工程。' },
        { who: 'Condómina', role: 'C', pt: 'Isso é preocupante. Não me parece prudente decidir hoje sem um parecer técnico.', zh: '这令人担忧。没有技术意见就今天决定，我认为不够谨慎。' },
        { who: 'Administradora', role: 'A', pt: 'Proponho adiarmos a votação e convidarmos o engenheiro para a próxima reunião.', zh: '我建议推迟表决，并邀请工程师参加下次会议。' },
        { who: 'Condómino', role: 'B', pt: 'Parece-me razoável. Desde que o prazo não comprometa a candidatura ao fundo.', zh: '我觉得合理。只要期限不影响基金申请。' }
      ],
      questions: [
        { q: 'Quantas propostas foram recebidas?', zh: '收到了几份报价？', options: ['Três.', 'Duas.', 'Uma.'], answer: 'Três.', explain: '管理员说 recebemos três propostas。' },
        { q: 'Qual é o problema da proposta mais barata?', zh: '最便宜的报价有什么问题？', options: ['Não cobre a impermeabilização.', 'É demasiado cara.', 'Não inclui a fachada.'], answer: 'Não cobre a impermeabilização.', explain: '最便宜的报价不包含防水工程。' },
        { q: 'O que propõe a administradora?', zh: '管理员提议什么？', options: ['Adiar a votação.', 'Aceitar a proposta mais barata.', 'Cancelar a obra.'], answer: 'Adiar a votação.', explain: '她建议 adiarmos a votação。' }
      ]
    },
    {
      id: 'm-c1-audio', level: 'C1', type: 'audio', scene: 'studio', title: 'Podcast sobre habitação', zh: '住房播客', minutes: 4,
      description: '记者与研究者讨论住房危机的结构性原因、公共住房与短租监管。注意论证中的保留语气。',
      cast: [{ name: 'Jornalista', role: 'A' }, { name: 'Investigadora', role: 'B' }],
      lines: [
        { who: 'Jornalista', role: 'A', pt: 'O acesso à habitação tornou-se a principal preocupação de muitos lisboetas.', zh: '住房可负担性已成为许多里斯本居民最关心的问题。' },
        { who: 'Investigadora', role: 'B', pt: 'Sem dúvida. A especulação imobiliária e a falta de oferta pública criaram uma crise estrutural.', zh: '毫无疑问。房地产投机和公共住房供应不足造成了结构性危机。' },
        { who: 'Jornalista', role: 'A', pt: 'Que medidas considera prioritárias?', zh: '您认为哪些措施应优先？' },
        { who: 'Investigadora', role: 'B', pt: 'É indispensável aumentar o parque habitacional público e regular o alojamento local.', zh: '必须扩大公共住房存量并监管短租。' },
        { who: 'Jornalista', role: 'A', pt: 'Há quem defenda que isso afasta o investimento.', zh: '有人认为这会赶走投资。' },
        { who: 'Investigadora', role: 'B', pt: 'É um argumento recorrente, mas não me parece sustentável confiar apenas no mercado.', zh: '这是一个常见的论点，但我认为只依赖市场并不可持续。' }
      ],
      questions: [
        { q: 'Que duas causas da crise são mencionadas?', zh: '提到哪两个危机原因？', options: ['Especulação e falta de oferta pública.', 'Turismo e clima.', 'Emigração e impostos.'], answer: 'Especulação e falta de oferta pública.', explain: '研究者提到 especulação imobiliária 和 falta de oferta pública。' },
        { q: 'Que medida é considerada indispensável?', zh: '哪项措施被认为不可或缺？', options: ['Aumentar o parque habitacional público.', 'Reduzir salários.', 'Acabar com o turismo.'], answer: 'Aumentar o parque habitacional público.', explain: '她说 é indispensável aumentar o parque habitacional público。' },
        { q: 'Como responde ao argumento sobre investimento?', zh: '她如何回应投资论点？', options: ['Diz que é recorrente, mas não sustentável.', 'Concorda completamente.', 'Ignora a pergunta.'], answer: 'Diz que é recorrente, mas não sustentável.', explain: '她承认论点常见，但认为只靠市场不可持续。' }
      ]
    },
    {
      id: 'm-c2-video', level: 'C2', type: 'video', scene: 'bookshop', title: 'Na livraria', zh: '书店里的佩索阿', minutes: 4,
      description: '一位读者寻找《不安之书》，和书商谈佩索阿、异名者与「fingimento」。文学语体与口语自然切换。',
      cast: [{ name: 'Livreiro', role: 'A' }, { name: 'Cliente', role: 'B' }],
      lines: [
        { who: 'Livreiro', role: 'A', pt: 'Procura algo em particular?', zh: '您在找什么特别的书吗？' },
        { who: 'Cliente', role: 'B', pt: 'Procurava o Livro do Desassossego. Dizem que é impossível lê-lo de uma só vez.', zh: '我在找《不安之书》。据说不可能一次读完。' },
        { who: 'Livreiro', role: 'A', pt: 'É verdade. Não é bem um romance; é um conjunto de fragmentos, quase um diário.', zh: '确实。它不完全是小说，而是一组碎片，几乎像日记。' },
        { who: 'Cliente', role: 'B', pt: 'Sempre me intrigou essa ideia de fingimento em Pessoa.', zh: '佩索阿的「虚构」概念一直让我着迷。' },
        { who: 'Livreiro', role: 'A', pt: 'Ele dizia que o poeta é um fingidor. Mas fingir, aí, não é mentir; é criar uma verdade outra.', zh: '他说诗人是个虚构者。但这里的「虚构」不是撒谎，而是创造另一种真实。' },
        { who: 'Cliente', role: 'B', pt: 'Então levo-o. Preciso de um pouco de desassossego.', zh: '那我买了。我需要一点不安。' }
      ],
      questions: [
        { q: 'Como o livreiro descreve o livro?', zh: '书商如何描述这本书？', options: ['Um conjunto de fragmentos, quase um diário.', 'Um romance policial.', 'Uma biografia de Pessoa.'], answer: 'Um conjunto de fragmentos, quase um diário.', explain: '他说 é um conjunto de fragmentos, quase um diário。' },
        { q: 'Para o livreiro, «fingir» significa:', zh: '在书商看来，fingir 意味着什么？', options: ['Criar uma verdade outra.', 'Mentir deliberadamente.', 'Esconder o livro.'], answer: 'Criar uma verdade outra.', explain: '他强调 fingir 不是 mentir，而是 criar uma verdade outra。' },
        { q: 'Porque é que o cliente leva o livro?', zh: '顾客为什么买下这本书？', options: ['Precisa de um pouco de desassossego.', 'É obrigatório.', 'Quer oferecê-lo ao livreiro.'], answer: 'Precisa de um pouco de desassossego.', explain: '他最后说 Preciso de um pouco de desassossego。' }
      ]
    },
    {
      id: 'm-c2-audio', level: 'C2', type: 'audio', scene: 'studio', title: 'Ironia à mesa', zh: '餐桌上的反讽', minutes: 4,
      description: '一顿失败的晚餐，Nuno 全程用反讽表达不满，Rita 逐层拆解。练习听语气和弦外之音。',
      cast: [{ name: 'Rita', role: 'A' }, { name: 'Nuno', role: 'B' }],
      lines: [
        { who: 'Rita', role: 'A', pt: 'Então, gostaste do jantar?', zh: '怎么样，你喜欢这顿晚餐吗？' },
        { who: 'Nuno', role: 'B', pt: 'Ah, foi memorável. O arroz estava cru e o peixe chegou uma hora depois.', zh: '啊，真是难忘。米饭是生的，鱼晚了一个小时才到。' },
        { who: 'Rita', role: 'A', pt: 'Pelo tom, diria que não foi bem um elogio.', zh: '听这语气，我会说这不算什么赞美。' },
        { who: 'Nuno', role: 'B', pt: 'Muito pelo contrário. Mas, olha, a companhia compensou.', zh: '恰恰相反。不过，你看，同伴弥补了一切。' },
        { who: 'Rita', role: 'A', pt: 'Ainda bem. Já agora, quem vai pagar a conta?', zh: '那就好。顺便问一下，谁付账？' },
        { who: 'Nuno', role: 'B', pt: 'Não sei. Talvez o chef, em sinal de agradecimento.', zh: '不知道。也许厨师吧，以示感谢。' }
      ],
      questions: [
        { q: 'O que correu mal no jantar?', zh: '晚餐哪里出了问题？', options: ['O arroz estava cru e o peixe atrasou-se.', 'A conta era barata.', 'A companhia era má.'], answer: 'O arroz estava cru e o peixe atrasou-se.', explain: 'Nuno 用反讽列出两个问题。' },
        { q: 'Quando Nuno diz «foi memorável», está a:', zh: 'Nuno 说「真是难忘」时，是在：', options: ['Fazer ironia.', 'Elogiar sinceramente.', 'Pedir a conta.'], answer: 'Fazer ironia.', explain: '随后他说米饭生、鱼迟到，说明是反讽。' },
        { q: 'Quem sugere que pague a conta?', zh: 'Nuno 暗示谁付账？', options: ['O chef.', 'Rita.', 'Ninguém.'], answer: 'O chef.', explain: '他说 Talvez o chef, em sinal de agradecimento，是玩笑。' }
      ]
    }
  ];

  window.AZ_LEVELS = levels;
  window.AZ_ADVANCED = { units, media };
})();
