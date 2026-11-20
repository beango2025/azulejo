/* Azulejo — European Portuguese verb tables.
   Regular -ar/-er/-ir verbs plus the essential irregulars. */
(function () {
  'use strict';

  const PERSONS = ['eu', 'tu', 'ele / ela', 'nós', 'vós', 'eles / elas'];
  const ENDINGS = {
    ar: {
      presente: ['o', 'as', 'a', 'amos', 'ais', 'am'],
      perfeito: ['ei', 'aste', 'ou', 'ámos', 'astes', 'aram'],
      imperfeito: ['ava', 'avas', 'ava', 'ávamos', 'áveis', 'avam'],
      futuro: ['arei', 'arás', 'ará', 'aremos', 'areis', 'arão'],
      condicional: ['aria', 'arias', 'aria', 'aríamos', 'aríeis', 'ariam'],
      conjuntivo: ['e', 'es', 'e', 'emos', 'eis', 'em'],
      imperfeitoConj: ['asse', 'asses', 'asse', 'ássemos', 'ásseis', 'assem']
    },
    er: {
      presente: ['o', 'es', 'e', 'emos', 'eis', 'em'],
      perfeito: ['i', 'este', 'eu', 'emos', 'estes', 'eram'],
      imperfeito: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
      futuro: ['erei', 'erás', 'erá', 'eremos', 'ereis', 'erão'],
      condicional: ['eria', 'erias', 'eria', 'eríamos', 'eríeis', 'eriam'],
      conjuntivo: ['a', 'as', 'a', 'amos', 'ais', 'am'],
      imperfeitoConj: ['esse', 'esses', 'esse', 'êssemos', 'êsseis', 'essem']
    },
    ir: {
      presente: ['o', 'es', 'e', 'imos', 'is', 'em'],
      perfeito: ['i', 'iste', 'iu', 'imos', 'istes', 'iram'],
      imperfeito: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
      futuro: ['irei', 'irás', 'irá', 'iremos', 'ireis', 'irão'],
      condicional: ['iria', 'irias', 'iria', 'iríamos', 'iríeis', 'iriam'],
      conjuntivo: ['a', 'as', 'a', 'amos', 'ais', 'am'],
      imperfeitoConj: ['isse', 'isses', 'isse', 'íssemos', 'ísseis', 'issem']
    }
  };

  const IRREGULAR = {
    ser: {
      presente: ['sou', 'és', 'é', 'somos', 'sois', 'são'],
      perfeito: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'],
      imperfeito: ['era', 'eras', 'era', 'éramos', 'éreis', 'eram'],
      futuro: ['serei', 'serás', 'será', 'seremos', 'sereis', 'serão'],
      condicional: ['seria', 'serias', 'seria', 'seríamos', 'seríeis', 'seriam'],
      conjuntivo: ['seja', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam'],
      imperfeitoConj: ['fosse', 'fosses', 'fosse', 'fôssemos', 'fósseis', 'fossem']
    },
    estar: {
      presente: ['estou', 'estás', 'está', 'estamos', 'estais', 'estão'],
      perfeito: ['estive', 'estiveste', 'esteve', 'estivemos', 'estivestes', 'estiveram'],
      imperfeito: ['estava', 'estavas', 'estava', 'estávamos', 'estáveis', 'estavam'],
      futuro: ['estarei', 'estarás', 'estará', 'estaremos', 'estareis', 'estarão'],
      condicional: ['estaria', 'estarias', 'estaria', 'estaríamos', 'estaríeis', 'estariam'],
      conjuntivo: ['esteja', 'estejas', 'esteja', 'estejamos', 'estejais', 'estejam'],
      imperfeitoConj: ['estivesse', 'estivesses', 'estivesse', 'estivéssemos', 'estivésseis', 'estivessem']
    },
    ter: {
      presente: ['tenho', 'tens', 'tem', 'temos', 'tendes', 'têm'],
      perfeito: ['tive', 'tiveste', 'teve', 'tivemos', 'tivestes', 'tiveram'],
      imperfeito: ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham'],
      futuro: ['terei', 'terás', 'terá', 'teremos', 'tereis', 'terão'],
      condicional: ['teria', 'terias', 'teria', 'teríamos', 'teríeis', 'teriam'],
      conjuntivo: ['tenha', 'tenhas', 'tenha', 'tenhamos', 'tenhais', 'tenham'],
      imperfeitoConj: ['tivesse', 'tivesses', 'tivesse', 'tivéssemos', 'tivésseis', 'tivessem']
    },
    ir: {
      presente: ['vou', 'vais', 'vai', 'vamos', 'ides', 'vão'],
      perfeito: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'],
      imperfeito: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
      futuro: ['irei', 'irás', 'irá', 'iremos', 'ireis', 'irão'],
      condicional: ['iria', 'irias', 'iria', 'iríamos', 'iríeis', 'iriam'],
      conjuntivo: ['vá', 'vás', 'vá', 'vamos', 'vades', 'vão'],
      imperfeitoConj: ['fosse', 'fosses', 'fosse', 'fôssemos', 'fósseis', 'fossem']
    },
    fazer: {
      presente: ['faço', 'fazes', 'faz', 'fazemos', 'fazeis', 'fazem'],
      perfeito: ['fiz', 'fizeste', 'fez', 'fizemos', 'fizestes', 'fizeram'],
      imperfeito: ['fazia', 'fazias', 'fazia', 'fazíamos', 'fazíeis', 'faziam'],
      futuro: ['farei', 'farás', 'fará', 'faremos', 'fareis', 'farão'],
      condicional: ['faria', 'farias', 'faria', 'faríamos', 'faríeis', 'fariam'],
      conjuntivo: ['faça', 'faças', 'faça', 'façamos', 'façais', 'façam'],
      imperfeitoConj: ['fizesse', 'fizesses', 'fizesse', 'fizéssemos', 'fizésseis', 'fizessem']
    },
    poder: {
      presente: ['posso', 'podes', 'pode', 'podemos', 'podeis', 'podem'],
      perfeito: ['pude', 'pudeste', 'pôde', 'pudemos', 'pudestes', 'puderam'],
      imperfeito: ['podia', 'podias', 'podia', 'podíamos', 'podíeis', 'podiam'],
      futuro: ['poderei', 'poderás', 'poderá', 'poderemos', 'podereis', 'poderão'],
      condicional: ['poderia', 'poderias', 'poderia', 'poderíamos', 'poderíeis', 'poderiam'],
      conjuntivo: ['possa', 'possas', 'possa', 'possamos', 'possais', 'possam'],
      imperfeitoConj: ['pudesse', 'pudesses', 'pudesse', 'pudéssemos', 'pudésseis', 'pudessem']
    },
    querer: {
      presente: ['quero', 'queres', 'quer', 'queremos', 'quereis', 'querem'],
      perfeito: ['quis', 'quiseste', 'quis', 'quisemos', 'quisestes', 'quiseram'],
      imperfeito: ['queria', 'querias', 'queria', 'queríamos', 'queríeis', 'queriam'],
      futuro: ['quererei', 'quererás', 'quererá', 'quereremos', 'querereis', 'quererão'],
      condicional: ['quereria', 'quererias', 'quereria', 'quereríamos', 'quereríeis', 'quereriam'],
      conjuntivo: ['queira', 'queiras', 'queira', 'queiramos', 'queirais', 'queiram'],
      imperfeitoConj: ['quisesse', 'quisesses', 'quisesse', 'quiséssemos', 'quisésseis', 'quisessem']
    },
    saber: {
      presente: ['sei', 'sabes', 'sabe', 'sabemos', 'sabeis', 'sabem'],
      perfeito: ['soube', 'soubeste', 'soube', 'soubemos', 'soubestes', 'souberam'],
      imperfeito: ['sabia', 'sabias', 'sabia', 'sabíamos', 'sabíeis', 'sabiam'],
      futuro: ['saberei', 'saberás', 'saberá', 'saberemos', 'sabereis', 'saberão'],
      condicional: ['saberia', 'saberias', 'saberia', 'saberíamos', 'saberíeis', 'saberiam'],
      conjuntivo: ['saiba', 'saibas', 'saiba', 'saibamos', 'saibais', 'saibam'],
      imperfeitoConj: ['soubesse', 'soubesses', 'soubesse', 'soubéssemos', 'soubésseis', 'soubessem']
    },
    ler: {
      presente: ['leio', 'lês', 'lê', 'lemos', 'ledes', 'leem'],
      perfeito: ['li', 'leste', 'leu', 'lemos', 'lestes', 'leram'],
      imperfeito: ['lia', 'lias', 'lia', 'líamos', 'líeis', 'liam'],
      futuro: ['lerei', 'lerás', 'lerá', 'leremos', 'lereis', 'lerão'],
      condicional: ['leria', 'lerias', 'leria', 'leríamos', 'leríeis', 'leriam'],
      conjuntivo: ['leia', 'leias', 'leia', 'leiamos', 'leiais', 'leiam'],
      imperfeitoConj: ['lesse', 'lesses', 'lesse', 'lêssemos', 'lêsseis', 'lessem']
    },
    ouvir: {
      presente: ['ouço', 'ouves', 'ouve', 'ouvimos', 'ouvis', 'ouvem'],
      perfeito: ['ouvi', 'ouviste', 'ouviu', 'ouvimos', 'ouvistes', 'ouviram'],
      imperfeito: ['ouvia', 'ouvias', 'ouvia', 'ouvíamos', 'ouvíeis', 'ouviam'],
      futuro: ['ouvirei', 'ouvirás', 'ouvirá', 'ouviremos', 'ouvireis', 'ouvirão'],
      condicional: ['ouviria', 'ouvirias', 'ouviria', 'ouviríamos', 'ouviríeis', 'ouviriam'],
      conjuntivo: ['ouça', 'ouças', 'ouça', 'ouçamos', 'ouçais', 'ouçam'],
      imperfeitoConj: ['ouvisse', 'ouvisses', 'ouvisse', 'ouvíssemos', 'ouvísseis', 'ouvissem']
    },
    pedir: {
      presente: ['peço', 'pedes', 'pede', 'pedimos', 'pedis', 'pedem'],
      perfeito: ['pedi', 'pediste', 'pediu', 'pedimos', 'pedistes', 'pediram'],
      imperfeito: ['pedia', 'pedias', 'pedia', 'pedíamos', 'pedíeis', 'pediam'],
      futuro: ['pedirei', 'pedirás', 'pedirá', 'pediremos', 'pedireis', 'pedirão'],
      condicional: ['pediria', 'pedirias', 'pediria', 'pediríamos', 'pediríeis', 'pediriam'],
      conjuntivo: ['peça', 'peças', 'peça', 'peçamos', 'peçais', 'peçam'],
      imperfeitoConj: ['pedisse', 'pedisses', 'pedisse', 'pedíssemos', 'pedísseis', 'pedissem']
    },
    subir: {
      presente: ['subo', 'sobes', 'sobe', 'subimos', 'subis', 'sobem'],
      perfeito: ['subi', 'subiste', 'subiu', 'subimos', 'subistes', 'subiram'],
      imperfeito: ['subia', 'subias', 'subia', 'subíamos', 'subíeis', 'subiam'],
      futuro: ['subirei', 'subirás', 'subirá', 'subiremos', 'subireis', 'subirão'],
      condicional: ['subiria', 'subirias', 'subiria', 'subiríamos', 'subiríeis', 'subiriam'],
      conjuntivo: ['suba', 'subas', 'suba', 'subamos', 'subais', 'subam'],
      imperfeitoConj: ['subisse', 'subisses', 'subisse', 'subíssemos', 'subísseis', 'subissem']
    },
    dormir: {
      presente: ['durmo', 'dormes', 'dorme', 'dormimos', 'dormis', 'dormem'],
      perfeito: ['dormi', 'dormiste', 'dormiu', 'dormimos', 'dormistes', 'dormiram'],
      imperfeito: ['dormia', 'dormias', 'dormia', 'dormíamos', 'dormíeis', 'dormiam'],
      futuro: ['dormirei', 'dormirás', 'dormirá', 'dormiremos', 'dormireis', 'dormirão'],
      condicional: ['dormiria', 'dormirias', 'dormiria', 'dormiríamos', 'dormiríeis', 'dormiriam'],
      conjuntivo: ['durma', 'durmas', 'durma', 'durmamos', 'durmais', 'durmam'],
      imperfeitoConj: ['dormisse', 'dormisses', 'dormisse', 'dormíssemos', 'dormísseis', 'dormissem']
    }
  };

  const LABELS = {
    presente: 'Presente',
    perfeito: 'Pretérito perfeito',
    imperfeito: 'Pretérito imperfeito',
    futuro: 'Futuro',
    condicional: 'Condicional',
    conjuntivo: 'Conjuntivo presente',
    imperfeitoConj: 'Conjuntivo imperfeito'
  };

  const VERBS = [
    ['ser', '是（本质）', 'to be'], ['estar', '是（状态）', 'to be (state)'], ['ter', '有', 'to have'],
    ['ir', '去', 'to go'], ['fazer', '做', 'to do / make'], ['poder', '能', 'can'],
    ['querer', '想要', 'to want'], ['saber', '知道', 'to know'], ['falar', '说', 'to speak'],
    ['comer', '吃', 'to eat'], ['viver', '生活', 'to live'], ['trabalhar', '工作', 'to work'],
    ['estudar', '学习', 'to study'], ['gostar', '喜欢', 'to like'], ['comprar', '买', 'to buy'],
    ['pagar', '付钱', 'to pay'], ['chegar', '到达', 'to arrive'], ['partir', '出发', 'to leave'],
    ['dormir', '睡觉', 'to sleep'], ['ouvir', '听', 'to listen'], ['ler', '读', 'to read'],
    ['escrever', '写', 'to write'], ['pedir', '请求', 'to ask for'], ['abrir', '打开', 'to open'],
    ['amar', '爱', 'to love'], ['ajudar', '帮助', 'to help'], ['andar', '走', 'to walk'],
    ['apanhar', '抓住 / 乘坐', 'to catch / take'], ['aprender', '学习', 'to learn'], ['beber', '喝', 'to drink'],
    ['bater', '敲 / 打', 'to knock / hit'], ['caminhar', '步行', 'to walk'], ['cantar', '唱歌', 'to sing'],
    ['cozinhar', '做饭', 'to cook'], ['correr', '跑', 'to run'], ['cortar', '切', 'to cut'],
    ['conversar', '聊天', 'to chat'], ['convidar', '邀请', 'to invite'], ['cuidar', '照顾', 'to care for'],
    ['dançar', '跳舞', 'to dance'], ['decidir', '决定', 'to decide'], ['deixar', '留下 / 让', 'to leave / let'],
    ['descansar', '休息', 'to rest'], ['entrar', '进入', 'to enter'], ['esperar', '等待 / 希望', 'to wait / hope'],
    ['explicar', '解释', 'to explain'], ['fechar', '关闭', 'to close'], ['gastar', '花费', 'to spend'],
    ['guardar', '保存', 'to keep / save'], ['jantar', '吃晚饭', 'to have dinner'], ['jogar', '玩 / 比赛', 'to play'],
    ['lavar', '洗', 'to wash'], ['levantar', '抬起 / 起床', 'to lift / get up'], ['levar', '带走', 'to take away'],
    ['limpar', '清洁', 'to clean'], ['mandar', '发送 / 命令', 'to send / order'], ['morar', '居住', 'to live / reside'],
    ['mostrar', '展示', 'to show'], ['mudar', '改变', 'to change'], ['nadar', '游泳', 'to swim'],
    ['olhar', '看', 'to look'], ['passar', '经过 / 度过', 'to pass / spend'], ['pensar', '思考', 'to think'],
    ['precisar', '需要', 'to need'], ['preparar', '准备', 'to prepare'], ['receber', '收到', 'to receive'],
    ['responder', '回答', 'to answer'], ['sentar', '坐下', 'to sit'], ['sofrer', '受苦', 'to suffer'],
    ['subir', '上升', 'to go up'], ['tocar', '触摸 / 演奏', 'to touch / play'], ['vender', '卖', 'to sell'],
    ['visitar', '拜访', 'to visit'], ['viajar', '旅行', 'to travel'], ['acordar', '醒来', 'to wake up'],
    ['almoçar', '吃午饭', 'to have lunch'], ['arrumar', '整理', 'to tidy'], ['assistir', '观看 / 协助', 'to watch / assist'],
    ['começar', '开始', 'to begin'], ['contar', '讲述 / 数', 'to tell / count'], ['costumar', '习惯于', 'to be used to'],
    ['cumprimentar', '问候', 'to greet'], ['desculpar', '原谅', 'to forgive'], ['desejar', '希望', 'to wish'],
    ['desligar', '关掉', 'to turn off'], ['ensinar', '教', 'to teach'], ['escolher', '选择', 'to choose'],
    ['ficar', '待 / 变得', 'to stay / become'], ['ganhar', '赢 / 赚', 'to win / earn'], ['gritar', '喊', 'to shout'],
    ['lembrar', '记得', 'to remember'], ['ligar', '打电话 / 连接', 'to call / connect'], ['lutar', '战斗', 'to fight'],
    ['melhorar', '改善', 'to improve'], ['necessitar', '需要', 'to need'], ['observar', '观察', 'to observe'],
    ['parar', '停止', 'to stop'], ['perdoar', '原谅', 'to forgive'], ['permitir', '允许', 'to allow'],
    ['preocupar', '担心', 'to worry'], ['quebrar', '打破', 'to break'], ['queixar', '抱怨', 'to complain'],
    ['recusar', '拒绝', 'to refuse'], ['reparar', '注意 / 修理', 'to notice / repair'], ['resolver', '解决', 'to solve'],
    ['usar', '使用', 'to use'], ['voltar', '返回', 'to return'], ['votar', '投票', 'to vote'],
    ['abraçar', '拥抱', 'to hug'], ['aceitar', '接受', 'to accept'], ['achar', '认为', 'to think / find'],
    ['adorar', '喜爱', 'to adore'], ['alugar', '租', 'to rent'], ['analisar', '分析', 'to analyse'],
    ['apoiar', '支持', 'to support'], ['assinar', '签名', 'to sign'], ['atender', '接待', 'to answer / serve'],
    ['atravessar', '穿过', 'to cross'], ['aumentar', '增加', 'to increase'], ['avançar', '前进', 'to advance']
  ];

  function regular(infinitive) {
    const root = infinitive.slice(0, -2);
    const group = infinitive.slice(-2);
    const endings = ENDINGS[group];
    if (!endings) return null;
    const form = ending => {
      let stem = root;
      // Portuguese orthography: -car -> -que, -gar -> -gue before e.
      if (group === 'ar' && /^e/.test(ending)) {
        if (stem.endsWith('c')) stem = `${stem.slice(0, -1)}qu`;
        else if (stem.endsWith('g')) stem = `${stem.slice(0, -1)}gu`;
        else if (stem.endsWith('ç')) stem = `${stem.slice(0, -1)}c`;
      }
      return stem + ending;
    };
    return Object.fromEntries(Object.entries(endings).map(([tense, forms]) => [
      tense,
      forms.map(form)
    ]));
  }

  function conjugate(infinitive) {
    const table = IRREGULAR[infinitive] || regular(infinitive);
    if (!table) return null;
    return Object.entries(LABELS).map(([id, label]) => ({
      id,
      label,
      forms: table[id] || []
    }));
  }

  window.AZ_VERBS = {
    people: PERSONS,
    labels: LABELS,
    verbs: VERBS.map(([infinitive, zh, en]) => ({
      infinitive,
      zh,
      en,
      table: conjugate(infinitive)
    }))
  };
})();
