/* Azulejo — European Portuguese course data. All content is local and offline. */
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

  const units = [
    {
      id: 'u1', order: 1, title: 'Primeiros passos', zh: '初次见面', color: 'blue', symbol: 'wave',
      blurb: '从第一声「Olá」开始，认识名字、来处和问候。',
      lessons: [
        {
          id: 'u1l1', title: 'Olá, bom dia', zh: '你好，早上好', minutes: 6, xp: 30,
          goal: '用葡语打招呼，介绍自己的名字',
          vocab: [
            v('ola', 'Olá', '你好', 'oh-LAH', 'Olá, eu sou a Ana.', '你好，我是安娜。', '最通用的问候，任何时间都能用。'),
            v('bomdia', 'Bom dia', '早上好', 'bohn DEE-uh', 'Bom dia! Como estás?', '早上好！你好吗？', '午饭前使用；bom 的 m 是鼻音。'),
            v('chamome', 'Chamo-me…', '我叫……', 'SHAH-moo-muh', 'Chamo-me Pedro.', '我叫佩德罗。', '动词 chamar-se 的反身形式，代词放在动词后。'),
            v('prazer', 'Prazer em conhecer-te.', '很高兴认识你。', 'prah-ZEHR ehn koo-nyeh-SEHR-tuh', 'Prazer em conhecer-te, Ana!', '很高兴认识你，安娜！', '对 tu 说；正式场合用 conhecê-lo/a。'),
            v('atelogo', 'Até logo', '回头见', 'ah-TEH LOH-goo', 'Até logo, Pedro!', '回头见，佩德罗！', '比 Adeus 随意，适合当天还会再见。')
          ],
          grammar: {
            title: 'Chamo-me：把「自己」放在动词后面',
            body: '欧洲葡语里，反身代词通常跟在动词后面，并用连字符连接。chamar-se 是「名叫」：eu chamo-me、tu chamas-te、ele/ela chama-se。巴西葡语常说 Me chamo，但葡葡更常说 Chamo-me。',
            examples: [
              { pt: 'Chamo-me Ana.', zh: '我叫安娜。' },
              { pt: 'Chamas-te Pedro?', zh: '你叫佩德罗吗？' },
              { pt: 'Ela chama-se Inês.', zh: '她叫伊内斯。' }
            ],
            tip: '第一次见面，握手并说「Prazer em conhecer-te」就很自然。'
          },
          exercises: [
            choice('这句话是什么意思？', 'Bom dia!', ['早上好！', '晚上好！', '再见！'], '早上好！', 'Bom dia 用于午饭前；boa tarde 是下午好，boa noite 是晚上好。'),
            listen('Chamo-me Ana.', ['Chamo-me Ana.', 'Chamas-te Ana.', 'Chama-se Ana.'], 'Chamo-me Ana.', '仔细听词尾：chamo-me 是「我叫」，chamas-te 是「你叫」。'),
            arrange('我叫安娜。', ['Chamo-me', 'Ana', '.'], 'Chamo-me Ana.', '反身代词 me 放在动词后面，中间加连字符。'),
            typeIn('很高兴认识你。', ['Prazer em conhecer-te.', 'Muito prazer.'], 'Prazer em conhecer-te 是更地道的葡葡说法，也可以简单说 Muito prazer。', '以 Prazer 开头'),
            match([['Olá', '你好'], ['Bom dia', '早上好'], ['Até logo', '回头见'], ['Chamo-me…', '我叫……']])
          ]
        },
        {
          id: 'u1l2', title: 'De onde és?', zh: '你从哪里来？', minutes: 7, xp: 30,
          goal: '说出自己的国籍和居住地，理解 ser 的变化',
          vocab: [
            v('deonde', 'De onde és?', '你从哪里来？', 'dee OHN-duh ehs', 'De onde és, Mei?', '梅，你从哪里来？', '对朋友用 és；对长辈用 De onde é?'),
            v('sou', 'Sou…', '我是……', 'soh', 'Sou chinesa.', '我是中国人。', 'ser 的 eu 形式，表示身份、国籍。'),
            v('portugues', 'português / portuguesa', '葡萄牙人（男/女）', 'por-too-GEHSH / por-too-GUEH-zuh', 'Ele é português.', '他是葡萄牙人。', '形容词要跟名词阴阳性变化。'),
            v('chines', 'chinês / chinesa', '中国人（男/女）', 'shee-NEHSH / shee-NEH-zuh', 'Ela é chinesa.', '她是中国人。'),
            v('vivo', 'Vivo em…', '我住在……', 'VEE-voo ehn', 'Vivo em Lisboa.', '我住在里斯本。', 'viver 的 eu 形式；后面接城市时用 em。')
          ],
          grammar: {
            title: 'ser：身份是「长期」的',
            body: 'ser 用来谈身份、国籍、职业和性格。eu sou、tu és、ele/ela é、nós somos。注意国籍首字母小写，并且形容词跟着人的性别变化：ele é chinês，ela é chinesa。',
            examples: [
              { pt: 'Sou portuguesa.', zh: '我是葡萄牙人（女）。' },
              { pt: 'Tu és chinês?', zh: '你是中国人吗？' },
              { pt: 'Vivo em Lisboa, mas sou de Xangai.', zh: '我住在里斯本，但我来自上海。' }
            ],
            tip: '问「你来自哪里」还可以说 De onde vens?；回答 Eu venho da China。'
          },
          exercises: [
            choice('选择正确的形式：', 'Ela ___ portuguesa.', ['é', 'és', 'sou'], 'é', 'ela 对应 ser 的 é。'),
            listen('Sou chinês e vivo em Lisboa.', ['Sou chinês e vivo em Lisboa.', 'Sou português e vivo no Porto.', 'Sou chinês e vivo em Xangai.'], 'Sou chinês e vivo em Lisboa.', '先抓住 Sou chinês，再听城市名 Lisboa。'),
            arrange('你从哪里来？', ['De', 'onde', 'és', '?'], 'De onde és?', '口语里问句语序不变，只把语调上扬。'),
            typeIn('我住在里斯本。', ['Vivo em Lisboa.', 'Eu vivo em Lisboa.'], 'vivo em + 城市；里斯本拼作 Lisboa。', 'Vivo …'),
            match([['Sou', '我是'], ['és', '你是'], ['é', '他/她是'], ['Vivo em', '我住在']])
          ]
        },
        {
          id: 'u1l3', title: 'Tudo bem?', zh: '你好吗？', minutes: 7, xp: 30,
          goal: '问候近况，分清 tu 和正式称呼',
          vocab: [
            v('tudobem', 'Tudo bem?', '你好吗？', 'TOO-doo behn', 'Olá! Tudo bem?', '嗨！你好吗？', '最常用的近况问候，语气轻松。'),
            v('maisoumenos', 'Mais ou menos.', '一般般。', 'myz oh MEH-noosh', 'Tudo bem? — Mais ou menos.', '你好吗？——一般般。', 'ou 要连读，s 在词尾发 sh 音。'),
            v('estoubem', 'Estou bem, obrigado/a.', '我很好，谢谢。', 'shTOH behn, oh-bree-GAH-doo/duh', 'Estou bem, obrigado. E tu?', '我很好，谢谢。你呢？', '男性说话用 obrigado，女性用 obrigada。'),
            v('desculpe', 'Desculpe.', '对不起 / 打扰一下。', 'desh-KOOL-puh', 'Desculpe, como se chama?', '打扰一下，您叫什么名字？', '对 tu 可以说 Desculpa；对陌生人用 Desculpe。'),
            v('ateamanha', 'Até amanhã', '明天见', 'ah-TEH ah-muh-NYUHN', 'Até amanhã!', '明天见！', 'amanhã 的 ã 是鼻音，结尾很轻。')
          ],
          grammar: {
            title: 'Tu、você 还是 o senhor？',
            body: '在葡萄牙，tu 是日常朋友之间的「你」，动词用第二人称：Como estás? 正式场合不说 você 更自然，而是用 o senhor / a senhora 或直接省略主语：Como está? 在商店、诊所和第一次见面的长辈面前，优先用正式形式。',
            examples: [
              { pt: 'Como estás?', zh: '你好吗？（对朋友）' },
              { pt: 'Como está, senhora Silva?', zh: '您好吗，席尔瓦女士？' },
              { pt: 'Estou bem, obrigada. E o senhor?', zh: '我很好，谢谢。您呢？' }
            ],
            tip: '在葡萄牙，obrigado 是「谢谢」；别人说 obrigado，你通常回 De nada。'
          },
          exercises: [
            choice('朋友问你「Tudo bem?」，最自然的回答是：', 'Tudo bem?', ['Tudo bem, obrigado. E tu?', 'Chamo-me Ana.', 'São três euros.'], 'Tudo bem, obrigado. E tu?', '先回答近况，再把问题抛回去，聊天就自然继续。'),
            listen('Estou bem, obrigada.', ['Estou bem, obrigada.', 'Estou mal, obrigado.', 'Mais ou menos, obrigado.'], 'Estou bem, obrigada.', '词尾 obrigada 说明说话者是女性。'),
            arrange('你今天好吗？', ['Como', 'estás', 'hoje', '?'], 'Como estás hoje?', '对朋友用 estás；hoje 是今天。'),
            typeIn('打扰一下，您叫什么名字？', ['Desculpe, como se chama?', 'Desculpe, como é que se chama?'], '正式场合用 se chama；对朋友则说 Como te chamas?', 'Desculpe…'),
            match([['Tudo bem?', '你好吗？'], ['Mais ou menos', '一般般'], ['Desculpe', '打扰一下'], ['Até amanhã', '明天见']])
          ]
        }
      ]
    },
    {
      id: 'u2', order: 2, title: 'No café', zh: '咖啡馆', color: 'terra', symbol: 'cup',
      blurb: '点一杯 bica，读懂账单，学会用葡语表达喜欢。',
      lessons: [
        {
          id: 'u2l1', title: 'Um café, por favor', zh: '请来一杯咖啡', minutes: 6, xp: 30,
          goal: '在咖啡馆礼貌点单',
          vocab: [
            v('cafe', 'um café', '一杯浓缩咖啡', 'oon ka-FEH', 'Um café, se faz favor.', '请来一杯浓缩咖啡。', '在葡萄牙，café 默认是小小一杯浓缩，不是美式。'),
            v('meialeite', 'uma meia de leite', '一杯半奶咖啡', 'OO-muh MAY-uh duh LAY-tuh', 'Queria uma meia de leite.', '我想要一杯半奶咖啡。', 'meia de leite 的奶量约一半，比 galão 少。'),
            v('agua', 'uma água', '一瓶/一杯水', 'OO-muh AH-gwuh', 'Uma água sem gás, por favor.', '请来一瓶无气泡水。', 'sem gás 无气泡，com gás 有气泡。'),
            v('sefazfavor', 'Se faz favor.', '请 / 劳驾。', 'suh fahsh fah-VOHR', 'Um café, se faz favor.', '请来一杯咖啡。', '葡萄牙人日常极常用的礼貌说法，比 por favor 更「本地」。'),
            v('queria', 'Queria…', '我想要……', 'kuh-REE-uh', 'Queria um pastel de nata.', '我想要一个葡式蛋挞。', '过去式形式，语气比 Quero 更委婉，是点单神器。')
          ],
          grammar: {
            title: '点单三件套：Queria + 名词 + se faz favor',
            body: '葡萄牙咖啡馆节奏很快，点单不用长篇大论。Queria… 是「我想要」，比 Quero 更礼貌；se faz favor 可以放在句尾。要确认人数或数量，用 um/uma：um café、uma meia de leite。',
            examples: [
              { pt: 'Queria um café, se faz favor.', zh: '我想要一杯咖啡，谢谢。' },
              { pt: 'Uma água sem gás, por favor.', zh: '请来一瓶无气泡水。' },
              { pt: 'Era tudo, obrigado.', zh: '就这些，谢谢。' }
            ],
            tip: '在里斯本点「一杯咖啡」可以说 uma bica；在波尔图说 um cimbalino。'
          },
          exercises: [
            choice('在葡萄牙点「um café」，你通常会得到：', 'Um café, se faz favor.', ['一小杯浓缩咖啡', '一大杯加奶咖啡', '一杯冰美式'], '一小杯浓缩咖啡', 'café 在葡萄牙默认是 expresso，想喝加奶的要另说。'),
            listen('Queria uma meia de leite, se faz favor.', ['Queria uma meia de leite, se faz favor.', 'Queria uma água sem gás, se faz favor.', 'Queria um café e um pastel.'], 'Queria uma meia de leite, se faz favor.', 'meia de leite 是半奶咖啡，注意 leite 的 ei 音。'),
            arrange('请来一杯咖啡。', ['Um', 'café', ',', 'se', 'faz', 'favor', '.'], 'Um café, se faz favor.', '逗号在 café 后面；se faz favor 放句尾。'),
            typeIn('我想要一杯水。', ['Queria uma água.', 'Queria uma água, por favor.', 'Queria uma água, se faz favor.'], 'Queria 后面接名词；água 是阴性，所以用 uma。', 'Queria uma…'),
            match([['um café', '浓缩咖啡'], ['uma água', '水'], ['meia de leite', '半奶咖啡'], ['se faz favor', '请 / 劳驾']])
          ]
        },
        {
          id: 'u2l2', title: 'Quanto custa?', zh: '多少钱？', minutes: 7, xp: 30,
          goal: '问价格、听懂金额并买单',
          vocab: [
            v('quantocusta', 'Quanto custa?', '多少钱？', 'KWAHN-too KOOSH-tuh', 'Quanto custa o pastel?', '这个蛋挞多少钱？', '复数用 Quanto custam?'),
            v('aconta', 'A conta, por favor.', '请结账。', 'uh KOHN-tuh, por fah-VOHR', 'A conta, por favor.', '请结账。', '在咖啡馆也可以直接说 A conta。'),
            v('euro', 'um euro', '一欧元', 'oon EH-roo', 'São dois euros e cinquenta.', '一共两欧五十。', '复数 euros；金额里的 e 读作「伊」。'),
            v('caro', 'É muito caro.', '太贵了。', 'eh MOO-ee-too KAH-roo', 'É muito caro!', '太贵了！', 'caro 的阴阳性：caro/cara。'),
            v('barato', 'barato', '便宜的', 'buh-RAH-too', 'Este café é barato.', '这杯咖啡很便宜。', '反义词 caro；问「有没有更便宜的」可说 Tem algo mais barato?')
          ],
          grammar: {
            title: '数字 1–20 与价格',
            body: 'um/uma、dois/duas、três、quatro、cinco、seis、sete、oito、nove、dez、onze、doze、treze、catorze、quinze、dezasseis、dezassete、dezoito、dezanove、vinte。价格里用「e」连接：três euros e cinquenta。',
            examples: [
              { pt: 'Quanto custa?', zh: '多少钱？' },
              { pt: 'São três euros e vinte.', zh: '一共三欧二十。' },
              { pt: 'Tem troco para dez euros?', zh: '十欧找得开吗？' }
            ],
            tip: '葡萄牙的 decimal 用逗号：3,50 €。口语说 três euros e cinquenta。'
          },
          exercises: [
            choice('€3,50 用葡语怎么说？', 'Quanto custa?', ['três euros e cinquenta', 'trinta euros e cinco', 'cinco euros e três'], 'três euros e cinquenta', 'e 连接整数和小数部分；cinquenta 是 50。'),
            listen('São dois euros e vinte.', ['São dois euros e vinte.', 'São doze euros e vinte.', 'São dois euros e cinquenta.'], 'São dois euros e vinte.', 'dois 与 doze 容易混：doze 是 12，结尾更重。'),
            arrange('请结账。', ['A', 'conta', ',', 'por', 'favor', '.'], 'A conta, por favor.', 'conta 是账单；a conta 是阴性。'),
            typeIn('这个太贵了。', ['É muito caro.', 'Isto é muito caro.', 'Este é muito caro.'], 'muito 放在形容词前；如果指阴性名词，说 É muito cara。', 'É muito…'),
            match([['três', '3'], ['sete', '7'], ['doze', '12'], ['vinte', '20']])
          ]
        },
        {
          id: 'u2l3', title: 'Pastel de nata', zh: '葡式蛋挞', minutes: 7, xp: 30,
          goal: '谈论喜欢和不喜欢的食物',
          vocab: [
            v('pasteldenata', 'pastel de nata', '葡式蛋挞', 'puhsh-TEHL duh NAH-tuh', 'Um pastel de nata, se faz favor.', '请来一个葡式蛋挞。', '复数 pastéis de nata；里斯本贝伦的最有名。'),
            v('gosto', 'Gosto de…', '我喜欢……', 'GOHSH-too duh', 'Gosto de café.', '我喜欢咖啡。', 'gostar de 后面接名词或动词原形。'),
            v('naogosto', 'Não gosto de…', '我不喜欢……', 'now GOHSH-too duh', 'Não gosto de leite.', '我不喜欢牛奶。', '否定词 não 放在动词前。'),
            v('delicioso', 'delicioso', '美味的', 'duh-lee-see-OH-zoo', 'Este pastel é delicioso.', '这个蛋挞很美味。', '阴性 deliciosa；也可以说 está uma delícia。'),
            v('quesabor', 'Que sabor?', '什么口味？', 'kuh suh-BOHR', 'Que sabor tem o gelado?', '这个冰淇淋是什么口味？', 'sabor 是味道、口味；tem 是「有」。')
          ],
          grammar: {
            title: 'Gosto de：喜欢要带「de」',
            body: 'gostar 后面必须接介词 de：Gosto de café、Gosto de viajar。否定是 Não gosto de…。如果喜欢的是「人」，要说 Gosto dela / Gosto dele，而不是 Gosto de ela。',
            examples: [
              { pt: 'Gosto muito de pastéis de nata.', zh: '我很喜欢葡式蛋挞。' },
              { pt: 'Não gosto de café sem açúcar.', zh: '我不喜欢不加糖的咖啡。' },
              { pt: 'Adoro este sabor!', zh: '我超爱这个口味！' }
            ],
            tip: 'Adoro 比 Gosto muito 更强烈，用于特别爱的东西。'
          },
          exercises: [
            choice('「我喜欢咖啡」正确的是：', 'Eu ___ café.', ['gosto de', 'gosto', 'gosto em'], 'gosto de', 'gostar 后面固定接 de，不能省略。'),
            listen('Gosto muito de pastéis de nata.', ['Gosto muito de pastéis de nata.', 'Não gosto de pastéis de nata.', 'Gosto pouco de café.'], 'Gosto muito de pastéis de nata.', 'muito 放在 gosto 和 de 之间，表示「很喜欢」。'),
            arrange('我不喜欢牛奶。', ['Não', 'gosto', 'de', 'leite', '.'], 'Não gosto de leite.', '否定词 Não 放句首，de 不能丢。'),
            typeIn('这个蛋挞很美味。', ['Este pastel é delicioso.', 'Este pastel está delicioso.', 'O pastel é delicioso.'], 'pastel 是阳性，形容词用 delicioso；阴性是 deliciosa。', 'Este pastel…'),
            match([['pastel de nata', '葡式蛋挞'], ['delicioso', '美味的'], ['gosto de', '我喜欢'], ['não gosto de', '我不喜欢']])
          ]
        }
      ]
    },
    {
      id: 'u3', order: 3, title: 'Pela cidade', zh: '穿行城市', color: 'olive', symbol: 'pin',
      blurb: '问路、看时间、跳上 28 路电车，在里斯本不迷路。',
      lessons: [
        {
          id: 'u3l1', title: 'Onde fica?', zh: '在哪里？', minutes: 7, xp: 30,
          goal: '问路并听懂左右、前方和环岛',
          vocab: [
            v('ondefica', 'Onde fica…?', '……在哪里？', 'OHN-duh FEE-kuh', 'Onde fica a estação?', '车站在哪里？', '问固定地点用 ficar；问可移动的东西用 Onde está…?'),
            v('aesquerda', 'à esquerda', '在左边', 'ah esh-KEHR-duh', 'Vire à esquerda.', '向左转。', 'esquerda 的 s 发 sh 音。'),
            v('adireita', 'à direita', '在右边', 'ah dee-RAY-tuh', 'A farmácia fica à direita.', '药店在右边。'),
            v('emfrente', 'em frente', '在前面 / 直走', 'ehn FREHN-tuh', 'Siga em frente.', '一直往前走。', 'siga 是正式命令式，对朋友说 segue。'),
            v('rotunda', 'rotunda', '环岛', 'roo-TOON-duh', 'Na rotunda, vire à direita.', '在环岛向右转。', '葡葡说 rotunda，巴葡常说 rotatória。')
          ],
          grammar: {
            title: 'ficar 还是 estar？',
            body: '问一个地点「在哪里」，通常用 Onde fica…?（永久位置）。问人或可移动物品在哪，用 Onde está…? 例如 Onde fica o museu? 但 Onde está o meu telemóvel? 回答地点用 fica：Fica ali、Fica à direita。',
            examples: [
              { pt: 'Onde fica a estação?', zh: '车站在哪里？' },
              { pt: 'Fica em frente ao café.', zh: '在咖啡馆对面。' },
              { pt: 'Onde está o bilhete?', zh: '车票在哪里？' }
            ],
            tip: '「一直走」是 Siga em frente；「过马路」是 Atravesse a rua。'
          },
          exercises: [
            choice('你想问博物馆在哪里，应该说：', '___ o museu?', ['Onde fica', 'Onde estás', 'Quanto custa'], 'Onde fica', '地点位置用 ficar；Onde fica o museu?'),
            listen('A farmácia fica à direita.', ['A farmácia fica à direita.', 'A farmácia fica à esquerda.', 'O café fica em frente.'], 'A farmácia fica à direita.', 'direita 是右，esquerda 是左，先听清开头。'),
            arrange('一直往前走。', ['Siga', 'em', 'frente', '.'], 'Siga em frente.', 'Siga 是「您继续」的正式命令式。'),
            typeIn('车站在哪里？', ['Onde fica a estação?', 'Onde é a estação?'], 'estação 是车站；a estação 是阴性。', 'Onde fica…'),
            match([['à esquerda', '左边'], ['à direita', '右边'], ['em frente', '前面'], ['rotunda', '环岛']])
          ]
        },
        {
          id: 'u3l2', title: 'A que horas?', zh: '几点？', minutes: 7, xp: 30,
          goal: '问时间、搭火车和公交',
          vocab: [
            v('quehoras', 'A que horas…?', '几点……？', 'ah kuh OH-ruhsh', 'A que horas parte o comboio?', '火车几点出发？', '回答用 às…：às oito。'),
            v('comboio', 'comboio', '火车', 'kohn-BOY-oo', 'O comboio para o Porto é às nove.', '去波尔图的火车九点开。', '巴葡说 trem，葡葡说 comboio。'),
            v('autocarro', 'autocarro', '公交车', 'ow-too-KAH-roo', 'Apanho o autocarro para o centro.', '我坐公交去市中心。', '巴葡说 ônibus；「坐/赶车」用 apanhar。'),
            v('bilhete', 'bilhete', '车票', 'bee-LYEH-tuh', 'Queria um bilhete, se faz favor.', '我想要一张票。', 'bilhete 也可指小纸条；机票是 bilhete de avião。'),
            v('atrasado', 'atrasado', '迟到的 / 晚点的', 'uh-truh-ZAH-doo', 'O comboio está atrasado.', '火车晚点了。', '阴性 atrasada；atrasar 是延误。')
          ],
          grammar: {
            title: '说时间：São as duas e meia',
            body: '一点是 É uma hora；其余用 São as…：São as duas、São as três e um quarto、São as quatro menos dez。「在几点」用 às：às duas、às oito e meia。正式时刻表常用 24 小时制：às catorze e trinta。',
            examples: [
              { pt: 'A que horas é o concerto?', zh: '音乐会几点？' },
              { pt: 'É às nove e meia.', zh: '九点半。' },
              { pt: 'O comboio das oito está atrasado.', zh: '八点的火车晚点了。' }
            ],
            tip: 'meia = 半，um quarto = 一刻钟，menos = 差。三点差一刻是 três menos um quarto。'
          },
          exercises: [
            choice('「九点半」怎么说？', 'A que horas?', ['às nove e meia', 'às nove e um quarto', 'às dez menos meia'], 'às nove e meia', 'meia 表示半点；às 表示「在几点」。'),
            listen('O comboio das oito está atrasado.', ['O comboio das oito está atrasado.', 'O comboio das oito está a chegar.', 'O autocarro das oito está atrasado.'], 'O comboio das oito está atrasado.', 'atrasado 是晚点；注意 comboio 与 autocarro 的区别。'),
            arrange('火车几点出发？', ['A', 'que', 'horas', 'parte', 'o', 'comboio', '?'], 'A que horas parte o comboio?', 'partir 是出发；o comboio 放动词后。'),
            typeIn('我想要一张票。', ['Queria um bilhete.', 'Queria um bilhete, por favor.', 'Queria um bilhete, se faz favor.'], '车票是阳性，用 um bilhete。', 'Queria um…'),
            match([['comboio', '火车'], ['autocarro', '公交车'], ['bilhete', '车票'], ['atrasado', '晚点的']])
          ]
        },
        {
          id: 'u3l3', title: 'No elétrico 28', zh: '坐上 28 路电车', minutes: 7, xp: 30,
          goal: '谈论交通、上下车和市中心',
          vocab: [
            v('eletrico', 'elétrico', '有轨电车', 'ee-LEH-tree-koo', 'O elétrico 28 vai para o centro.', '28 路电车开往市中心。', '巴葡说 bonde；里斯本的 28 路是经典线路。'),
            v('paragem', 'paragem', '车站', 'puh-RAH-zhehn', 'A próxima paragem é o Rossio.', '下一站是罗西奥。', '公交/电车停靠站；火车站用 estação。'),
            v('subir', 'subir', '上车 / 上升', 'soo-BEER', 'Subimos no elétrico.', '我们上电车。', '上车也可以说 entrar；下车是 descer。'),
            v('descer', 'descer', '下车 / 下降', 'desh-SEHR', 'Desça na próxima paragem.', '在下一站下车。', '正式命令式 desça；对朋友说 desce。'),
            v('centro', 'centro', '市中心', 'SEHN-troo', 'Vou para o centro.', '我去市中心。', 'centro histórico 是历史中心。')
          ],
          grammar: {
            title: 'ir para 还是 ir a？',
            body: '去一个城市或国家常用 ir para：Vou para Lisboa。去一个具体地点常用 ir a：Vou ao centro（a + o = ao）、Vou à praia（a + a = à）。上车用 subir / entrar，下车用 descer / sair。',
            examples: [
              { pt: 'Vou para o centro.', zh: '我去市中心。' },
              { pt: 'Vou à praia.', zh: '我去海滩。' },
              { pt: 'Desço na próxima paragem.', zh: '我在下一站下车。' }
            ],
            tip: '在里斯本，电车快到站时要提前按铃；下车说 Com licença 很礼貌。'
          },
          exercises: [
            choice('选择正确的形式：', 'Eu ___ na próxima paragem.', ['desço', 'subo', 'apanho'], 'desço', 'descer 是下车，eu 形式是 desço；subir 是上车。'),
            listen('Vou para o centro no elétrico 28.', ['Vou para o centro no elétrico 28.', 'Vou para o centro no autocarro 28.', 'Vou para o Porto no comboio.'], 'Vou para o centro no elétrico 28.', 'elétrico 的重音在 le：e-LEH-tri-co。'),
            arrange('我在下一站下车。', ['Desço', 'na', 'próxima', 'paragem', '.'], 'Desço na próxima paragem.', 'descer 的 eu 形式是 desço，ç 发 s 音。'),
            typeIn('28 路电车开往市中心。', ['O elétrico 28 vai para o centro.'], 'vai para 表示开往；elétrico 是葡萄牙 1990 年正字法后的拼写。', 'O elétrico 28…'),
            match([['elétrico', '电车'], ['paragem', '车站'], ['subir', '上车'], ['descer', '下车']])
          ]
        }
      ]
    },
    {
      id: 'u4', order: 4, title: 'A minha vida', zh: '我的生活', color: 'gold', symbol: 'house',
      blurb: '聊家人、讲一天的生活，用反身动词描述日常。',
      lessons: [
        {
          id: 'u4l1', title: 'A minha família', zh: '我的家人', minutes: 6, xp: 30,
          goal: '介绍家庭成员和所有格',
          vocab: [
            v('familia', 'família', '家庭', 'fuh-MEE-lee-uh', 'A minha família é pequena.', '我的家庭很小。', '注意重音在 mí：fa-MÍ-lia。'),
            v('mae', 'mãe', '妈妈', 'muhn', 'A minha mãe chama-se Rosa.', '我妈妈叫罗莎。', 'ão 是鼻音；mãe 只有一个音节。'),
            v('pai', 'pai', '爸爸', 'pie', 'O meu pai é professor.', '我爸爸是老师。', 'pai 的 ai 读「艾」；复数是 pais（父母）。'),
            v('irmao', 'irmão', '兄弟', 'eer-MOWN', 'Tenho um irmão mais velho.', '我有一个哥哥。', 'irmã 是姐妹；irmãos 是兄弟姐妹。'),
            v('avos', 'avós', '祖父母 / 外祖父母', 'uh-VOHSH', 'Os meus avós vivem no Porto.', '我的祖父母住在波尔图。', 'avô 是爷爷/外公，avó 是奶奶/外婆；avós 统称。')
          ],
          grammar: {
            title: '所有格：o meu、a minha',
            body: '葡语的所有格通常带冠词：o meu pai、a minha mãe、os meus pais。名词阴阳性决定用 meu/minha，单复数决定 meu/meus。和家人说话时，常省略冠词：A minha mãe… 也可以说 A mãe…。',
            examples: [
              { pt: 'A minha irmã chama-se Inês.', zh: '我妹妹/姐姐叫伊内斯。' },
              { pt: 'Os meus pais vivem em Xangai.', zh: '我父母住在上海。' },
              { pt: 'O teu irmão é simpático.', zh: '你哥哥人很好。' }
            ],
            tip: '葡语里「哥哥/弟弟」都是 irmão，年长用 mais velho，年幼用 mais novo。'
          },
          exercises: [
            choice('「我妈妈」正确的是：', '___ mãe', ['a minha', 'o meu', 'as minhas'], 'a minha', 'mãe 是阴性单数，用 a minha。'),
            listen('Os meus avós vivem no Porto.', ['Os meus avós vivem no Porto.', 'Os meus pais vivem em Lisboa.', 'A minha avó vive em Faro.'], 'Os meus avós vivem no Porto.', 'avós 是祖父母；no Porto 表示「在波尔图」。'),
            arrange('我有一个哥哥。', ['Tenho', 'um', 'irmão', 'mais', 'velho', '.'], 'Tenho um irmão mais velho.', 'ter 的 eu 形式是 tenho；mais velho 是年长的。'),
            typeIn('我的家庭很小。', ['A minha família é pequena.'], 'família 是阴性，形容词用 pequena。', 'A minha família…'),
            match([['mãe', '妈妈'], ['pai', '爸爸'], ['irmão', '兄弟'], ['avós', '祖父母']])
          ]
        },
        {
          id: 'u4l2', title: 'Um dia normal', zh: '普通的一天', minutes: 7, xp: 30,
          goal: '用反身动词讲一天的作息',
          vocab: [
            v('acordar', 'acordar', '醒来', 'uh-kor-DAHR', 'Acordo às sete.', '我七点醒来。', 'acordar 不带反身代词；levantar-se 才是「起床」。'),
            v('levantarse', 'levantar-se', '起床', 'luh-vuhn-TAHR-suh', 'Levanto-me às sete e meia.', '我七点半起床。', '反身代词放在动词后：levanto-me。'),
            v('pequenoalmoco', 'pequeno-almoço', '早餐', 'puh-KEH-noo ahl-MOH-soo', 'Tomo o pequeno-almoço em casa.', '我在家吃早餐。', '巴葡说 café da manhã；吃早餐用 tomar。'),
            v('apanhar', 'apanhar', '赶上 / 乘坐', 'uh-puh-NYAHR', 'Apanho o autocarro às oito.', '我八点坐公交。', 'apanhar o comboio/autocarro 是赶车、坐车。'),
            v('deitarse', 'deitar-se', '上床睡觉', 'day-TAHR-suh', 'Deito-me às onze.', '我十一点睡觉。', '反身形式 deito-me；dormir 是睡着。')
          ],
          grammar: {
            title: '反身动词：动作回到自己身上',
            body: '描述日常作息常用反身动词：levantar-se、deitar-se、vestir-se。葡葡把反身代词放在动词后：Levanto-me às sete、Deito-me cedo。否定时代词依然跟着动词：Não me levanto cedo。',
            examples: [
              { pt: 'Acordo às sete e levanto-me às sete e meia.', zh: '我七点醒，七点半起床。' },
              { pt: 'Tomo o pequeno-almoço e apanho o autocarro.', zh: '我吃早餐，然后坐公交。' },
              { pt: 'Deito-me à meia-noite.', zh: '我午夜上床睡觉。' }
            ],
            tip: '「洗澡」是 tomar duche（葡葡），不是 tomar banho（泡澡）。'
          },
          exercises: [
            choice('「我七点半起床」正确的是：', '___ às sete e meia.', ['Levanto-me', 'Me levanto', 'Levanto'], 'Levanto-me', '葡葡把反身代词放在动词后，并用连字符。'),
            listen('Tomo o pequeno-almoço em casa.', ['Tomo o pequeno-almoço em casa.', 'Tomo o pequeno-almoço no café.', 'Apanho o autocarro em casa.'], 'Tomo o pequeno-almoço em casa.', 'pequeno-almoço 是早餐；em casa 是在家。'),
            arrange('我八点坐公交。', ['Apanho', 'o', 'autocarro', 'às', 'oito', '.'], 'Apanho o autocarro às oito.', 'apanhar 是乘坐/赶上；às oito 是八点。'),
            typeIn('我十一点睡觉。', ['Deito-me às onze.', 'Eu deito-me às onze.'], 'deitar-se 的 eu 形式是 deito-me，反身代词后置。', 'Deito-me…'),
            match([['acordar', '醒来'], ['levantar-se', '起床'], ['pequeno-almoço', '早餐'], ['deitar-se', '上床睡觉']])
          ]
        },
        {
          id: 'u4l3', title: 'A minha casa', zh: '我的家', minutes: 6, xp: 30,
          goal: '描述房子和房间，用 há 说「有」',
          vocab: [
            v('casa', 'casa', '家 / 房子', 'KAH-zuh', 'A minha casa é pequena.', '我的家很小。', 'em casa 是在家；para casa 是回家。'),
            v('cozinha', 'cozinha', '厨房', 'koo-ZEE-nyuh', 'A cozinha é grande.', '厨房很大。', 'cozinhar 是做饭。'),
            v('quarto', 'quarto', '卧室 / 房间', 'KWAHR-too', 'O meu quarto tem uma varanda.', '我的卧室有一个阳台。', 'quarto de banho 也可以是浴室，但葡葡更常说 casa de banho。'),
            v('casadebanho', 'casa de banho', '浴室 / 卫生间', 'KAH-zuh duh BAH-nyoo', 'Onde fica a casa de banho?', '卫生间在哪里？', '巴葡说 banheiro；在葡萄牙问 casa de banho 最自然。'),
            v('varanda', 'varanda', '阳台', 'vuh-RUHN-duh', 'Tomamos café na varanda.', '我们在阳台上喝咖啡。', 'na varanda 表示在阳台上。')
          ],
          grammar: {
            title: 'há：那里有',
            body: '表示「有、存在」用 haver 的无人称形式 há：Há dois quartos。否定是 Não há…。问「有……吗？」说 Há…? 不要说 Tem，除非主语明确（A casa tem dois quartos）。',
            examples: [
              { pt: 'Há uma cozinha e dois quartos.', zh: '有一个厨房和两个卧室。' },
              { pt: 'Não há varanda.', zh: '没有阳台。' },
              { pt: 'Há um supermercado perto?', zh: '附近有超市吗？' }
            ],
            tip: '「在二楼」是 no primeiro andar（欧洲的 first floor 是二楼）。'
          },
          exercises: [
            choice('「有一个厨房」用：', '___ uma cozinha.', ['Há', 'Tem', 'É'], 'Há', '表示「存在有」用 há；Tem 需要明确主语。'),
            listen('O meu quarto tem uma varanda.', ['O meu quarto tem uma varanda.', 'A minha casa tem uma cozinha.', 'O meu quarto não tem varanda.'], 'O meu quarto tem uma varanda.', 'tem 是「有」；varanda 是阳台。'),
            arrange('卫生间在哪里？', ['Onde', 'fica', 'a', 'casa', 'de', 'banho', '?'], 'Onde fica a casa de banho?', 'casa de banho 是固定搭配，问位置用 fica。'),
            typeIn('我的家很小。', ['A minha casa é pequena.'], 'casa 是阴性，形容词用 pequena。', 'A minha casa…'),
            match([['cozinha', '厨房'], ['quarto', '卧室'], ['casa de banho', '卫生间'], ['varanda', '阳台']])
          ]
        }
      ]
    },
    {
      id: 'u5', order: 5, title: 'Fim de semana', zh: '周末时光', color: 'plum', symbol: 'sun',
      blurb: '说说昨天做了什么、明天去哪里，再聊聊天气。',
      lessons: [
        {
          id: 'u5l1', title: 'Ontem fui…', zh: '昨天我去了……', minutes: 7, xp: 30,
          goal: '用简单过去时讲周末',
          vocab: [
            v('ontem', 'ontem', '昨天', 'OHN-tehn', 'Ontem fui ao cinema.', '昨天我去了电影院。', '前天是 anteontem。'),
            v('fui', 'fui', '我去了 / 我是', 'foo-ee', 'Fui ao Porto.', '我去了波尔图。', 'ir 和 ser 的过去式同形，靠语境区分。'),
            v('comi', 'comi', '我吃了', 'koo-MEE', 'Comi bacalhau.', '我吃了鳕鱼。', 'comer 的 eu 过去式；规则 -er 动词变 -i。'),
            v('gostei', 'gostei', '我喜欢（过去）', 'goosh-TAY', 'Gostei muito do filme.', '我很喜欢这部电影。', 'gostar 的过去式；gostei de… 常缩合为 do/da。'),
            v('fimdesemana', 'fim de semana', '周末', 'feen duh suh-MAH-nuh', 'O fim de semana foi ótimo.', '周末很棒。', '葡葡常说 fim de semana；周末愉快是 bom fim de semana。')
          ],
          grammar: {
            title: '简单过去时：讲完一件已经发生的事',
            body: 'pretérito perfeito 用来讲已完成的动作。规则动词：falei、comi、parti。ir/ser 的 eu 形式都是 fui，você/ele 是 foi。常和 ontem、na semana passada、no fim de semana 一起用。',
            examples: [
              { pt: 'Ontem fui ao cinema.', zh: '昨天我去了电影院。' },
              { pt: 'Comi uma francesinha.', zh: '我吃了一个 francesinha 三明治。' },
              { pt: 'Gostei muito do fim de semana.', zh: '我很喜欢这个周末。' }
            ],
            tip: '「去电影院」是 ir ao cinema；「看电影」是 ver um filme。'
          },
          exercises: [
            choice('「昨天我去了波尔图」正确的是：', 'Ontem ___ ao Porto.', ['fui', 'vou', 'foi'], 'fui', 'ontem 提示过去；ir 的 eu 过去式是 fui。'),
            listen('Gostei muito do fim de semana.', ['Gostei muito do fim de semana.', 'Gosto muito do fim de semana.', 'Gostei pouco do filme.'], 'Gostei muito do fim de semana.', 'gostei 的结尾 ay 表示过去；gosto 是现在。'),
            arrange('昨天我吃了鳕鱼。', ['Ontem', 'comi', 'bacalhau', '.'], 'Ontem comi bacalhau.', '时间词可以放句首，动词随后。'),
            typeIn('我很喜欢这部电影。', ['Gostei muito do filme.', 'Eu gostei muito do filme.'], 'gostei de + o filme = gostei do filme。', 'Gostei muito…'),
            match([['ontem', '昨天'], ['fui', '我去了'], ['comi', '我吃了'], ['gostei', '我喜欢（过去）']])
          ]
        },
        {
          id: 'u5l2', title: 'Amanhã vou…', zh: '明天我要……', minutes: 6, xp: 30,
          goal: '用 ir + 动词原形谈计划',
          vocab: [
            v('amanha', 'amanhã', '明天', 'ah-muh-NYUHN', 'Amanhã vou viajar.', '明天我要去旅行。', '注意与 manhã（早上）区分，amanhã 是明天。'),
            v('vou', 'vou', '我要 / 我去', 'voh', 'Vou estudar português.', '我要学葡语。', 'ir 的 eu 形式；vou + 动词原形表示将来。'),
            v('viajar', 'viajar', '旅行', 'vyah-ZHAHR', 'Vou viajar para o Algarve.', '我要去阿尔加维旅行。', 'viajar para + 地方；viagem 是名词旅行。'),
            v('encontro', 'encontro', '见面 / 约会', 'ehn-KOHN-troo', 'Tenho um encontro às cinco.', '我五点有个约。', 'encontrar 是遇见；encontro 也可指浪漫约会。'),
            v('talvez', 'talvez', '也许', 'tahl-VEHSH', 'Talvez vá à praia.', '也许我会去海滩。', 'talvez 后面的动词常用虚拟式，但初级先记住整句。')
          ],
          grammar: {
            title: '将来很简单：vou + 动词原形',
            body: '日常计划用 ir 的现在时 + 动词原形：vou viajar、vais comer、vamos sair。这比未来的动词变位更常用。注意 vais（你）、vai（他/她）、vamos（我们）。',
            examples: [
              { pt: 'Amanhã vou trabalhar.', zh: '明天我要工作。' },
              { pt: 'Vamos jantar fora?', zh: '我们出去吃晚饭吗？' },
              { pt: 'Ela vai viajar para o Porto.', zh: '她要去波尔图旅行。' }
            ],
            tip: '「周末你有什么计划？」可以说 Que planos tens para o fim de semana?'
          },
          exercises: [
            choice('「明天我要学习」正确的是：', 'Amanhã ___ estudar.', ['vou', 'vais', 'vai'], 'vou', '主语是 eu，ir 的现在时是 vou。'),
            listen('Vou viajar para o Algarve.', ['Vou viajar para o Algarve.', 'Vou viajar para o Porto.', 'Vou trabalhar no Algarve.'], 'Vou viajar para o Algarve.', 'Algarve 是葡萄牙南部地区，重音在 ga。'),
            arrange('我们出去吃晚饭吗？', ['Vamos', 'jantar', 'fora', '?'], 'Vamos jantar fora?', 'Vamos + 动词原形表示建议；fora 是外面。'),
            typeIn('明天我要去波尔图。', ['Amanhã vou para o Porto.', 'Amanhã vou ao Porto.', 'Amanhã vou viajar para o Porto.'], 'vou para/a + 地点；波尔图是 o Porto。', 'Amanhã vou…'),
            match([['amanhã', '明天'], ['vou', '我要'], ['viajar', '旅行'], ['talvez', '也许']])
          ]
        },
        {
          id: 'u5l3', title: 'Está sol!', zh: '天气真好！', minutes: 6, xp: 30,
          goal: '聊天气，用 estar a + 动词原形',
          vocab: [
            v('sol', 'sol', '太阳 / 晴天', 'sohl', 'Está sol hoje.', '今天出太阳。', 'faz sol 也可以，但 estar sol 更常用。'),
            v('chuva', 'chuva', '雨', 'SHOO-vuh', 'Está a chover.', '正在下雨。', 'chuva 是名词；chover 是动词下雨。'),
            v('frio', 'frio', '冷', 'FREE-oo', 'Faz frio em janeiro.', '一月很冷。', '天气冷用 faz frio，不用 está frio（指物体冷）。'),
            v('calor', 'calor', '热', 'kuh-LOHR', 'Faz calor no Algarve.', '阿尔加维很热。', 'faz calor 表示天气热。'),
            v('tempo', 'tempo', '天气 / 时间', 'TEHN-poo', 'Como está o tempo?', '天气怎么样？', 'tempo 既可指天气，也可指时间。')
          ],
          grammar: {
            title: 'Está a chover：葡葡的「正在」',
            body: '欧洲葡语用 estar a + 动词原形表示正在做某事：Estou a estudar、Está a chover。巴西葡语则用 estar + 动名词：Estou estudando。天气里「冷/热」用 fazer：Faz frio、Faz calor。',
            examples: [
              { pt: 'Está a chover.', zh: '正在下雨。' },
              { pt: 'Estou a aprender português.', zh: '我正在学葡语。' },
              { pt: 'Faz calor, mas está vento.', zh: '很热，但有风。' }
            ],
            tip: '「天气怎么样？」是 Como está o tempo?；「今天天气很好」是 Está um dia lindo。'
          },
          exercises: [
            choice('「正在下雨」在欧洲葡语里是：', '___ a chover.', ['Está', 'Faz', 'É'], 'Está', '天气状态用 estar；正在做某事用 estar a + 动词。'),
            listen('Faz frio, mas está sol.', ['Faz frio, mas está sol.', 'Faz calor, mas está a chover.', 'Está frio e está a chover.'], 'Faz frio, mas está sol.', 'faz frio 是天气冷；mas 是但是。'),
            arrange('我正在学葡语。', ['Estou', 'a', 'aprender', 'português', '.'], 'Estou a aprender português.', 'estar a + 动词原形，是葡葡的「正在」。'),
            typeIn('今天天气怎么样？', ['Como está o tempo hoje?', 'Como está o tempo?'], 'tempo 是天气；hoje 是今天。', 'Como está…'),
            match([['sol', '晴天'], ['chuva', '雨'], ['frio', '冷'], ['calor', '热']])
          ]
        }
      ]
    },
    {
      id: 'u6', order: 6, title: 'Portugal real', zh: '真实的葡萄牙', color: 'sea', symbol: 'shell',
      blurb: '购物、求助，还有那些让葡语真正「像葡萄牙人」的说法。',
      lessons: [
        {
          id: 'u6l1', title: 'Às compras', zh: '去购物', minutes: 7, xp: 30,
          goal: '试穿、问尺码、付款',
          vocab: [
            v('tamanho', 'tamanho', '尺码 / 大小', 'tuh-MAH-nyoo', 'Tem em tamanho M?', '有 M 码吗？', '问尺码：Que tamanho tem?'),
            v('experimentar', 'experimentar', '试穿 / 尝试', 'esh-puh-ree-mehn-TAHR', 'Posso experimentar?', '我可以试穿吗？', '试衣间是 cabine de prova。'),
            v('levo', 'levo', '我买下 / 带走', 'LEH-voo', 'Levo este.', '我买这件。', '购物时说 Levo este/esta 很自然。'),
            v('desconto', 'desconto', '折扣', 'desh-KOHN-too', 'Tem desconto?', '有折扣吗？', 'em promoção 是促销中。'),
            v('cartao', 'cartão', '银行卡', 'kar-TOWN', 'Posso pagar com cartão?', '可以刷卡吗？', 'cartão multibanco 是葡萄牙的借记卡系统。')
          ],
          grammar: {
            title: '购物常用句型',
            body: '问有没有某物：Tem…? 问价格：Quanto custa? 试穿：Posso experimentar? 买下：Levo este/esta。付款方式：em dinheiro（现金）、com cartão（刷卡）。注意葡萄牙排队叫 bicha，不要被这个词吓到。',
            examples: [
              { pt: 'Tem este casaco em tamanho M?', zh: '这件外套有 M 码吗？' },
              { pt: 'Posso experimentar?', zh: '我可以试穿吗？' },
              { pt: 'Levo este, obrigado.', zh: '我买这件，谢谢。' }
            ],
            tip: '在葡萄牙，fila 不常用，排队说 bicha；这是完全正常的日常词。'
          },
          exercises: [
            choice('在试衣间前，你想问「我可以试穿吗？」：', '___ experimentar?', ['Posso', 'Tenho', 'Quero'], 'Posso', 'Posso…? 是「我可以……吗？」，最礼貌。'),
            listen('Tem este casaco em tamanho M?', ['Tem este casaco em tamanho M?', 'Tem esta camisa em tamanho S?', 'Quanto custa este casaco?'], 'Tem este casaco em tamanho M?', 'casaco 是外套；tamanho M 是 M 码。'),
            arrange('我买这件，谢谢。', ['Levo', 'este', ',', 'obrigado', '.'], 'Levo este, obrigado.', '购物时说要买，再道谢，语气自然。'),
            typeIn('可以刷卡吗？', ['Posso pagar com cartão?', 'Posso pagar com o cartão?'], 'pagar com cartão 是刷卡；cartão 是银行卡。', 'Posso pagar…'),
            match([['tamanho', '尺码'], ['experimentar', '试穿'], ['desconto', '折扣'], ['cartão', '银行卡']])
          ]
        },
        {
          id: 'u6l2', title: 'Preciso de ajuda', zh: '我需要帮助', minutes: 7, xp: 30,
          goal: '在紧急情况下求助',
          vocab: [
            v('ajuda', 'ajuda', '帮助', 'uh-ZHOO-duh', 'Preciso de ajuda.', '我需要帮助。', 'pedir ajuda 是求助；ajudar 是帮助。'),
            v('perdido', 'perdido / perdida', '迷路的（男/女）', 'per-DEE-doo / per-DEE-duh', 'Estou perdido.', '我迷路了。（男性）', '女性说 perdida。'),
            v('farmacia', 'farmácia', '药店', 'far-MAH-see-uh', 'Onde fica a farmácia?', '药店在哪里？', '绿色十字是葡萄牙药店的标志。'),
            v('medico', 'médico', '医生', 'MEH-dee-koo', 'Preciso de um médico.', '我需要看医生。', '女性医生是 médica。'),
            v('urgencia', 'urgência', '急诊', 'oor-ZHEHN-see-uh', 'Leve-me à urgência, por favor.', '请带我去急诊。', '医院的急诊部叫 urgência；紧急电话是 112。')
          ],
          grammar: {
            title: '求助：Preciso de…',
            body: 'precisar 后面接 de：Preciso de ajuda、Preciso de um médico。请别人帮忙用 Pode ajudar-me?（您能帮我吗？）或 Podia ajudar-me?（更委婉）。紧急电话在葡萄牙和多数欧盟国家是 112。',
            examples: [
              { pt: 'Preciso de ajuda.', zh: '我需要帮助。' },
              { pt: 'Pode ajudar-me, se faz favor?', zh: '您能帮我一下吗？' },
              { pt: 'Estou perdida e não tenho telemóvel.', zh: '我迷路了，而且没带手机。' }
            ],
            tip: '「手机」在葡葡是 telemóvel，在巴葡是 celular。'
          },
          exercises: [
            choice('「我需要帮助」正确的是：', 'Preciso ___ ajuda.', ['de', 'em', 'a'], 'de', 'precisar de 是固定搭配。'),
            listen('Estou perdido. Onde fica a farmácia?', ['Estou perdido. Onde fica a farmácia?', 'Estou perdido. Onde fica a estação?', 'Preciso de um médico.'], 'Estou perdido. Onde fica a farmácia?', 'perdido 是迷路；farmácia 是药店。'),
            arrange('您能帮我吗？', ['Pode', 'ajudar-me', ',', 'se', 'faz', 'favor', '?'], 'Pode ajudar-me, se faz favor?', 'Pode + 动词原形；ajudar-me 的 me 后置。'),
            typeIn('我需要看医生。', ['Preciso de um médico.', 'Eu preciso de um médico.'], 'médico 是阳性名词；重音在 mé。', 'Preciso de…'),
            match([['ajuda', '帮助'], ['perdido', '迷路的'], ['farmácia', '药店'], ['urgência', '急诊']])
          ]
        },
        {
          id: 'u6l3', title: 'À portuguesa', zh: '像葡萄牙人那样说', minutes: 7, xp: 30,
          goal: '听懂高频口语词，说得更自然',
          vocab: [
            v('pois', 'Pois', '对啊 / 嗯', 'poysh', 'Pois, tens razão.', '对啊，你说得对。', '葡国人高频口头禅；Pois é 表示「可不是嘛」。'),
            v('pa', 'Pá', '喂 / 老兄（语气词）', 'pah', 'Ó pá, vamos!', '喂，走吧！', '非常口语，朋友间使用；正式场合别用。'),
            v('olha', 'Olha', '你看 / 听我说', 'OH-lyuh', 'Olha, isto é importante.', '听我说，这很重要。', 'olhar 是看；Olha 常用来引起注意。'),
            v('jaagora', 'Já agora', '对了 / 顺便', 'zhah uh-GOH-ruh', 'Já agora, tens um lápis?', '对了，你有铅笔吗？', '聊天时自然插入补充问题。'),
            v('comcerteza', 'Com certeza', '当然 / 没问题', 'kohn ser-TEH-zuh', 'Com certeza!', '当然可以！', '比 claro 更正式一点，也非常常用。')
          ],
          grammar: {
            title: '让葡语有「葡萄牙味」的小词',
            body: '葡萄牙人说话离不开 pois、pá、olha、já agora。它们没有完整翻译，却决定语气：pois 表示同意或思考，pá 拉近距离，olha 引起注意，já agora 顺便补充。先听懂，再慢慢用。',
            examples: [
              { pt: 'Pois é, a vida é assim.', zh: '是啊，生活就是这样。' },
              { pt: 'Olha, já agora, queres um café?', zh: '哎，对了，你要咖啡吗？' },
              { pt: 'Com certeza, não há problema.', zh: '当然，没问题。' }
            ],
            tip: 'Ó 也常放在名字前：Ó Ana! 相当于「喂，安娜」，朋友之间很自然。'
          },
          exercises: [
            choice('朋友说了一件你也同意的事，最自然的回应是：', 'A vida é difícil, não é?', ['Pois é.', 'Quanto custa?', 'Até amanhã.'], 'Pois é.', 'Pois é 表示「可不是嘛」，是葡葡对话里的万能应和。'),
            listen('Olha, já agora, queres um café?', ['Olha, já agora, queres um café?', 'Olha, já agora, queres uma água?', 'Ó pá, vamos tomar um café?'], 'Olha, já agora, queres um café?', 'já agora 是「顺便问一下」，语速很快。'),
            arrange('当然，没问题。', ['Com', 'certeza', ',', 'não', 'há', 'problema', '.'], 'Com certeza, não há problema.', 'não há 表示「没有」；problema 是阳性。'),
            typeIn('听我说，这很重要。', ['Olha, isto é importante.', 'Olha, isso é importante.'], 'Olha 用来引起注意；importante 阴阳同形。', 'Olha, isto…'),
            match([['Pois', '对啊'], ['Pá', '喂 / 老兄'], ['Já agora', '对了 / 顺便'], ['Com certeza', '当然']])
          ]
        }
      ]
    }
  ];

  const phrases = [
    { id: 'p1', group: 'greetings', pt: 'Olá! Tudo bem?', zh: '你好！最近好吗？', pron: 'oh-LAH! TOO-doo behn?', note: '最日常的问候，朋友之间随时可用。' },
    { id: 'p2', group: 'greetings', pt: 'Bom dia! Como está?', zh: '早上好！您好吗？', pron: 'bohn DEE-uh! KOH-moo shTAH?', note: '对长辈或陌生人用 está；朋友间用 estás。' },
    { id: 'p3', group: 'greetings', pt: 'Chamo-me Li. E tu?', zh: '我叫李。你呢？', pron: 'SHAH-moo-muh lee. ee too?', note: '反身代词放动词后，是葡葡的标志。' },
    { id: 'p4', group: 'greetings', pt: 'Prazer em conhecer-te.', zh: '很高兴认识你。', pron: 'prah-ZEHR ehn koo-nyeh-SEHR-tuh', note: '正式场合可说 Prazer em conhecê-lo/a。' },
    { id: 'p5', group: 'greetings', pt: 'De onde és?', zh: '你来自哪里？', pron: 'dee OHN-duh ehs?', note: '正式：De onde é? 回答：Sou da China.' },
    { id: 'p6', group: 'greetings', pt: 'Até logo!', zh: '回头见！', pron: 'ah-TEH LOH-goo!', note: '当天还会再见时用；永别才说 Adeus。' },
    { id: 'p7', group: 'greetings', pt: 'Boa noite!', zh: '晚上好 / 晚安！', pron: 'BOH-uh NOY-tuh!', note: '天黑后问候和道别都能用。' },
    { id: 'p8', group: 'greetings', pt: 'Muito prazer.', zh: '很荣幸。', pron: 'MOO-ee-too prah-ZEHR.', note: '初次见面的简短礼貌说法。' },

    { id: 'p9', group: 'cafe', pt: 'Um café, se faz favor.', zh: '请来一杯浓缩咖啡。', pron: 'oon ka-FEH, suh fahsh fah-VOHR', note: '里斯本说 uma bica；波尔图说 um cimbalino。' },
    { id: 'p10', group: 'cafe', pt: 'Queria uma meia de leite.', zh: '我想要一杯半奶咖啡。', pron: 'kuh-REE-uh OO-muh MAY-uh duh LAY-tuh', note: '比 galão 奶量少；点单用 Queria 更礼貌。' },
    { id: 'p11', group: 'cafe', pt: 'Uma água sem gás, por favor.', zh: '请来一瓶无气泡水。', pron: 'OO-muh AH-gwuh sehn gahsh, por fah-VOHR', note: '有气泡是 com gás。' },
    { id: 'p12', group: 'cafe', pt: 'Quanto custa?', zh: '多少钱？', pron: 'KWAHN-too KOOSH-tuh?', note: '复数用 Quanto custam?。' },
    { id: 'p13', group: 'cafe', pt: 'A conta, por favor.', zh: '请结账。', pron: 'uh KOHN-tuh, por fah-VOHR', note: '也可以说 Pode trazer a conta?。' },
    { id: 'p14', group: 'cafe', pt: 'Tem pastéis de nata?', zh: '有葡式蛋挞吗？', pron: 'tehn puhsh-TAYSH duh NAH-tuh?', note: 'pastel 的复数是 pastéis。' },
    { id: 'p15', group: 'cafe', pt: 'Está delicioso!', zh: '太好吃了！', pron: 'shTAH duh-lee-see-OH-zoo!', note: '女性说话指自己时用 obrigada；这里形容食物用阳性。' },
    { id: 'p16', group: 'cafe', pt: 'Era tudo, obrigado.', zh: '就这些，谢谢。', pron: 'EH-ruh TOO-doo, oh-bree-GAH-doo', note: '点完单后告诉服务员「就这些」。' },

    { id: 'p17', group: 'transport', pt: 'Onde fica a estação?', zh: '车站在哪里？', pron: 'OHN-duh FEE-kuh uh sh-tuh-SOWN?', note: '问固定地点用 fica，不用 está。' },
    { id: 'p18', group: 'transport', pt: 'A que horas parte o comboio?', zh: '火车几点出发？', pron: 'ah kuh OH-ruhsh PAR-tuh oo kohn-BOY-oo?', note: 'partir 是出发；chegar 是到达。' },
    { id: 'p19', group: 'transport', pt: 'Queria um bilhete para o Porto.', zh: '我想要一张去波尔图的票。', pron: 'kuh-REE-uh oon bee-LYEH-tuh PAR-uh oo POHR-too', note: '往返票是 bilhete de ida e volta。' },
    { id: 'p20', group: 'transport', pt: 'Este autocarro vai para o centro?', zh: '这辆公交去市中心吗？', pron: 'ESH-tuh ow-too-KAH-roo vy PAR-uh oo SEHN-troo?', note: '葡葡 autocarro，巴葡 ônibus。' },
    { id: 'p21', group: 'transport', pt: 'Desço na próxima paragem.', zh: '我在下一站下车。', pron: 'DESH-soo nuh PROH-see-muh puh-RAH-zhehn', note: '正式命令式：Desça na próxima paragem。' },
    { id: 'p22', group: 'transport', pt: 'O comboio está atrasado.', zh: '火车晚点了。', pron: 'oo kohn-BOY-oo shTAH uh-truh-ZAH-doo', note: '女性名词用 atrasada。' },
    { id: 'p23', group: 'transport', pt: 'Siga em frente e vire à direita.', zh: '一直走，然后右转。', pron: 'SEE-guh ehn FREHN-tuh ee VEE-ruh ah dee-RAY-tuh', note: '对朋友说 Segue em frente。' },
    { id: 'p24', group: 'transport', pt: 'Fica a dez minutos a pé.', zh: '步行十分钟。', pron: 'FEE-kuh uh dehs mee-NOO-toosh ah peh', note: 'a pé 是步行；de carro 是开车。' },

    { id: 'p25', group: 'shopping', pt: 'Posso experimentar?', zh: '我可以试穿吗？', pron: 'POH-soo esh-puh-ree-mehn-TAHR?', note: '试衣间是 cabine de prova。' },
    { id: 'p26', group: 'shopping', pt: 'Tem em tamanho M?', zh: '有 M 码吗？', pron: 'tehn ehn tuh-MAH-nyoo EH-m(ee)?', note: '尺码：S、M、L、XL；也可说 número。' },
    { id: 'p27', group: 'shopping', pt: 'Quanto custa este casaco?', zh: '这件外套多少钱？', pron: 'KWAHN-too KOOSH-tuh ESH-tuh kuh-ZAH-koo?', note: 'este 指离说话者近的「这个」。' },
    { id: 'p28', group: 'shopping', pt: 'É muito caro.', zh: '太贵了。', pron: 'eh MOO-ee-too KAH-roo', note: '想砍价可说 Faz mais barato?（口语）。' },
    { id: 'p29', group: 'shopping', pt: 'Levo este.', zh: '我买这个。', pron: 'LEH-voo ESH-tuh', note: '指女性物品用 Levo esta。' },
    { id: 'p30', group: 'shopping', pt: 'Posso pagar com cartão?', zh: '可以刷卡吗？', pron: 'POH-soo puh-GAHR kohn kar-TOWN?', note: '现金是 em dinheiro。' },
    { id: 'p31', group: 'shopping', pt: 'Tem desconto?', zh: '有折扣吗？', pron: 'tehn desh-KOHN-too?', note: '促销中是 em promoção。' },
    { id: 'p32', group: 'shopping', pt: 'Só estou a ver, obrigado.', zh: '我只是看看，谢谢。', pron: 'soh shTOH ah vehr, oh-bree-GAH-doo', note: '不想被店员打扰时的礼貌说法。' },

    { id: 'p33', group: 'social', pt: 'Gosto muito de estar aqui.', zh: '我很喜欢待在这里。', pron: 'GOHSH-too MOO-ee-too duh sh-TAHR uh-KEE', note: 'gostar de + 动词原形。' },
    { id: 'p34', group: 'social', pt: 'Queres ir beber um café?', zh: '你想去喝杯咖啡吗？', pron: 'KEH-rish eer buh-BEHR oon ka-FEH?', note: '对 tu；正式用 Quer ir…?' },
    { id: 'p35', group: 'social', pt: 'Já agora, tens planos para amanhã?', zh: '对了，你明天有安排吗？', pron: 'zhah uh-GOH-ruh, tehnsh PLAH-noosh PAR-uh ah-muh-NYUHN?', note: 'já agora 用来顺便追问。' },
    { id: 'p36', group: 'social', pt: 'Pois é. Concordo contigo.', zh: '是啊，我同意你。', pron: 'poysh eh. kohn-KOHR-doo kohn-TEE-goo', note: 'contigo 是「和你」，葡葡常用。' },
    { id: 'p37', group: 'social', pt: 'Com certeza!', zh: '当然可以！', pron: 'kohn ser-TEH-zuh!', note: '语气比 claro 更肯定。' },
    { id: 'p38', group: 'social', pt: 'Não faz mal.', zh: '没关系。', pron: 'now fahsh mahl', note: '回应道歉或小意外。' },
    { id: 'p39', group: 'social', pt: 'Foi ótimo conhecer-te.', zh: '认识你真好。', pron: 'foy OH-tee-moo koo-nyeh-SEHR-tuh', note: '道别时用，比 Prazer 更温暖。' },
    { id: 'p40', group: 'social', pt: 'Bom fim de semana!', zh: '周末愉快！', pron: 'bohn feen duh suh-MAH-nuh!', note: '周五下午最常听到的祝福。' },

    { id: 'p41', group: 'emergency', pt: 'Preciso de ajuda.', zh: '我需要帮助。', pron: 'pruh-SEE-zoo duh uh-ZHOO-duh', note: '紧急电话是 112。' },
    { id: 'p42', group: 'emergency', pt: 'Estou perdido/a.', zh: '我迷路了。', pron: 'shTOH per-DEE-doo/duh', note: '男性说 perdido，女性说 perdida。' },
    { id: 'p43', group: 'emergency', pt: 'Onde fica a farmácia mais próxima?', zh: '最近的药店在哪里？', pron: 'OHN-duh FEE-kuh uh far-MAH-see-uh myzh PROH-see-muh?', note: '药店门口通常有绿色十字。' },
    { id: 'p44', group: 'emergency', pt: 'Preciso de um médico.', zh: '我需要看医生。', pron: 'pruh-SEE-zoo duh oon MEH-dee-koo', note: '急诊是 urgência。' },
    { id: 'p45', group: 'emergency', pt: 'Chame uma ambulância!', zh: '叫救护车！', pron: 'SHAH-muh OO-muh ahn-boo-LAHN-see-uh!', note: '正式命令式；紧急时直接说 112 即可。' },
    { id: 'p46', group: 'emergency', pt: 'Não me sinto bem.', zh: '我感觉不舒服。', pron: 'now muh SEEN-too behn', note: 'sinto-me bem 是「我感觉好」。' },
    { id: 'p47', group: 'emergency', pt: 'Falo um pouco de português.', zh: '我会说一点葡语。', pron: 'FAH-loo oon POH-koo duh por-too-GEHSH', note: 'Fala inglês? 是「您说英语吗？」' },
    { id: 'p48', group: 'emergency', pt: 'Pode ajudar-me, se faz favor?', zh: '您能帮我一下吗？', pron: 'POH-duh uh-zhuh-DAR-muh, suh fahsh fah-VOHR?', note: 'Pode + 动词原形，礼貌又直接。' }
  ];

  const articles = [
    {
      id: 'a1', category: 'sotaque', title: '不只是口音：葡葡与巴葡', zh: 'European vs. Brazilian Portuguese', read: 6,
      kicker: 'Antes de começar', excerpt: '同样是葡萄牙语，为什么里斯本街头的一句话，和里约的听起来像两种语言？先弄清你正在学什么。',
      sections: [
        { h: '你学的是 português europeu', p: '欧洲葡语（português europeu，简称 pt-PT）以葡萄牙本土为标准，约一千万使用者；巴西葡语（pt-BR）有两亿多人使用。两者不是「方言与标准语」的关系，而是同一语言的两个标准变体。教材、字幕和语音包常默认巴葡，所以从一开始就挑选「pt-PT」资源很重要。' },
        { h: '最明显的三个差异', p: '第一，发音：葡葡元音弱化明显，词尾 s 常读成 sh，巴葡更接近逐字发音。第二，进行时：葡葡说 Estou a estudar，巴葡说 Estou estudando。第三，代词位置：葡葡说 Chamo-me Ana，巴葡常说 Me chamo Ana。' },
        { h: '词汇也不一样', p: '公交车：autocarro / ônibus；手机：telemóvel / celular；冰箱：frigorífico / geladeira；早餐：pequeno-almoço / café da manhã；电车：elétrico / bonde。学葡葡时，先建立这一套「葡萄牙生活词库」，到了葡萄牙才不会有陌生感。' },
        { h: '听力上的心理准备', p: '葡萄牙人说话语速快，且吞音多。你可能会觉得「每个词都学过，但连起来听不懂」。这不是你的问题，而是葡葡的节奏：重读元音被拉长，非重读元音几乎消失。多听真实的葡葡材料，耳朵会慢慢适应。' }
      ],
      tips: ['在浏览器或 App 里选择「Português (Portugal)」，不要选「Brasil」。', '遇到新词时，查一下它在 pt-PT 和 pt-BR 里是否不同。', '不要因为听懂巴葡就以为自己听懂了葡葡，反之亦然。']
    },
    {
      id: 'a2', category: 'sotaque', title: '「sh」的秘密', zh: 'The sound of Lisbon', read: 5,
      kicker: 'Pronúncia', excerpt: 'Lisboa 为什么听起来像「Lizh-boa」？掌握词尾 s 和元音弱化，你的葡葡会立刻像样很多。',
      sections: [
        { h: '词尾的 s 是 sh', p: '在欧洲葡语里，词尾或辅音前的 s 通常读成 /ʃ/，也就是英文 ship 的开头。gostos 听起来像「gosh-toosh」，estás 像「sh-tahsh」，Lisboa 像「lizh-BOH-uh」。这不是口音，而是标准葡葡的一部分。' },
        { h: '非重读元音会「消失」', p: '葡葡会把非重读的 e 读得很轻，接近 /ɨ/，有时几乎听不见。telefone 听起来像「tlfone」，pequeno 像「pkeno」。所以别期待每个音节都清清楚楚，抓重读音节才是关键。' },
        { h: '鼻音要留住', p: 'ão、ãe、õe 是葡语的招牌鼻音。pão、mãe、ações 都要从鼻腔出气。中文母语者对鼻音不陌生，但要避免把它读成完整的「昂」或「安」，尾音要收在鼻腔里。' },
        { h: '三个可以马上练的词', p: 'Lisboa：lizh-BOH-uh；português：por-too-GEHSH；estação：sh-tuh-SOWN。先用慢速跟读，再恢复正常速度。慢速不是逐字停顿，而是把重音和节奏拉清楚。' }
      ],
      tips: ['练词尾 s 时，先发「sh」再连到下一个词。', '不要每个音节都用力，重读元音清楚即可。', '录音对比比单纯听更有效。']
    },
    {
      id: 'a3', category: 'cafe', title: 'Um café é uma bica', zh: '一杯咖啡的学问', read: 5,
      kicker: 'Café', excerpt: '在葡萄牙，咖啡馆不是办公空间，而是站着喝一杯、和熟人聊两句的日常仪式。',
      sections: [
        { h: 'Café 不是美式', p: '你说 um café，得到的是一小杯浓缩咖啡，通常两口就能喝完。想喝加奶的，点 uma meia de leite（半奶）或 um galão（大杯奶咖）。在里斯本，浓缩咖啡叫 uma bica；在波尔图，叫 um cimbalino。' },
        { h: '站着喝更便宜', p: '很多咖啡馆的「吧台价」（ao balcão）比坐下便宜。当地人常站在吧台边，一口咖啡、一句问候，然后继续上班。坐下慢慢喝也没问题，只是价格和节奏不同。' },
        { h: '点单不用太复杂', p: 'Um café, se faz favor 就够了。想配点心，说 Um pastel de nata, se faz favor。结账说 A conta, por favor。服务员可能问 Mais alguma coisa?（还要别的吗？），回答 Era tudo, obrigado 即可。' },
        { h: '小费与礼仪', p: '账单通常已含服务，留下零钱或凑整就很得体。不要大声叫「服务员」，举手或说 Se faz favor 更自然。早晨的咖啡馆很热闹，拼桌也常见。' }
      ],
      tips: ['里斯本：uma bica；波尔图：um cimbalino。', '想吃早餐说 um pequeno-almoço，不要直译成 café da manhã。', '结账说 A conta, por favor，不要说 A bill。']
    },
    {
      id: 'a4', category: 'social', title: 'Tu, você ou o senhor?', zh: '怎么称呼才不失礼', read: 5,
      kicker: 'Formalidade', excerpt: '在葡萄牙，用错「你」可能比语法错误更尴尬。三个称呼，三种距离。',
      sections: [
        { h: 'Tu：朋友之间的默认', p: '同龄朋友、家人、同事之间常用 tu，动词用第二人称：Como estás?、Tens tempo?、Queres um café? 在葡萄牙，tu 的使用范围比巴西广，很多年轻人在工作场合也直接互称 tu。' },
        { h: 'Você：能用，但有点距离', p: 'você 在葡萄牙并非禁忌，但语气可能显得疏离，甚至有点「把人当外人」。在服务场合，直接省略主语更自然：Como está?、Quer um café? 在巴西，você 才是日常默认。' },
        { h: 'O senhor / a senhora：正式', p: '对长辈、第一次见面的客户、医生或官员，用 o senhor / a senhora，动词用第三人称：O senhor quer um café? 注意 o senhor 后面虽然指「您」，动词却像「他」一样变位。' },
        { h: '不确定时怎么办', p: '先用正式形式，等对方说 Pode tratar-me por tu（可以叫我 tu）再切换。这是最安全的策略。被纠正时也不用紧张，说一句 Desculpe, claro 就好。' }
      ],
      tips: ['第一次见面：Como está? 比 Como estás? 安全。', '对朋友：Tudo bem? 比 Como vai? 更自然。', '正式邮件：Exmo./Exma. Sr./Sra. 开头，结尾 Com os melhores cumprimentos。']
    },
    {
      id: 'a5', category: 'gramatica', title: 'Estou a aprender', zh: '葡葡的「正在进行」', read: 6,
      kicker: 'Gramática viva', excerpt: '一个小小的 a，区分了里斯本和里约的语法习惯。学会它，你的句子会立刻变「葡」。',
      sections: [
        { h: 'estar a + 动词原形', p: '欧洲葡语表示「正在做」用 estar a + 不定式：Estou a estudar（我正在学习）、Está a chover（正在下雨）、Eles estão a comer（他们正在吃）。这是葡葡最标志性的结构之一。' },
        { h: '和巴葡的 gerúndio 对比', p: '巴西葡语用 estar + 动名词：Estou estudando、Está chovendo。两种都对，只是变体不同。如果你在葡萄牙说 Estou estudando，对方完全能听懂，但会立刻听出巴葡影响。' },
        { h: '代词放哪里', p: '在 estar a 结构里，反身代词通常放在 estar 后面：Estou-me a levantar（我正在起床）。否定时同样放在前面：Não me estou a levantar。这一块是葡葡语法的难点，先记住常见整句，比背规则更有效。' },
        { h: '什么时候不用它', p: '表示习惯或事实时用现在时：Trabalho em Lisboa（我在里斯本工作），而不是 Estou a trabalhar em Lisboa（强调此刻正在工作）。不要把所有现在时都换成 estar a。' }
      ],
      tips: ['现在进行：Estou a + 动词原形。', '习惯动作：用一般现在时。', '听到 -ndo 结尾，多半是巴葡影响。']
    },
    {
      id: 'a6', category: 'alma', title: 'Saudade não se traduz', zh: '无法翻译的乡愁', read: 5,
      kicker: 'Alma portuguesa', excerpt: 'Saudade 不是简单的「想念」。它混合了缺席、温柔和一点点宿命感，也是理解法多的钥匙。',
      sections: [
        { h: '一个没有英文对应的词', p: 'saudade 常被解释为「对缺席之物的深切想念」，但它不只是 missing someone。它可以指向一个人、一个地方、一段过去，甚至一种从未发生过的可能。说 Tenho saudades tuas 是「我想你」，但语气比 I miss you 更绵长。' },
        { h: '语法小细节', p: '常用结构是 ter saudades de：Tenho saudades de Lisboa（我想念里斯本）、Tenho saudades tuas（我想你）。注意复数 saudades 更常见，表达一种持续的、多层的思念。' },
        { h: '法多与命运', p: 'fado 是葡萄牙的传统音乐，歌词里充满 saudade、mar、destino。里斯本的 Alfama 区是听法多的经典去处。听法多时，安静、专注是基本礼貌，不需要跟着唱。' },
        { h: '怎么用才自然', p: '不要把它当成一个浪漫的万能词。日常里，Tenho saudades de ti 已经很重；对朋友说 Já tinha saudades! 更轻松。理解它的分寸，比会拼写更重要。' }
      ],
      tips: ['Tenho saudades tuas = 我想你。', 'matar saudades = 解乡愁、和老友相聚。', 'fado 演出中尽量保持安静，拍照先确认。']
    },
    {
      id: 'a7', category: 'comida', title: 'Comer como um português', zh: '像葡萄牙人一样吃', read: 6,
      kicker: 'Mesa', excerpt: '午餐是一天的主角，鳕鱼有一千种做法，蛋挞要趁热吃。葡萄牙人的餐桌，比你想的更日常。',
      sections: [
        { h: '一天三餐的节奏', p: '早餐 pequeno-almoço 通常很轻：咖啡、吐司、酸奶。午餐 almoço 是一天最正式的一餐，常从汤开始，配面包、橄榄和葡萄酒。晚餐 jantar 较晚，通常八点以后。' },
        { h: 'bacalhau 的信条', p: '鳕鱼 bacalhau 是国民食材，据说有一千零一种做法。最常见的是 bacalhau à Brás（鳕鱼炒土豆丝鸡蛋）和 bacalhau com natas（奶油焗鳕鱼）。点菜时别问「有没有鳕鱼」，问「哪种鳕鱼」更地道。' },
        { h: '小馆子的规矩', p: '入座后服务员会先上 couvert：面包、黄油、橄榄，通常按人头收费。不想吃可以礼貌拒绝，或直接说 Não, obrigado。午餐的 prato do dia（今日特餐）通常最划算。' },
        { h: '甜点与咖啡', p: 'pastel de nata 要趁热吃，撒肉桂粉是经典吃法。餐后一杯 bica 是仪式。葡萄牙甜点偏甜，配苦咖啡刚好。francesinha 是波尔图的重量级三明治，第一次吃建议两人分。' }
      ],
      tips: ['couvert 不是免费的，不吃可以拒绝。', '午餐特餐 prato do dia 通常包含汤、主菜、饮料。', '点水要说 com gás 或 sem gás。']
    }
  ];

  const dailyWords = [
    { pt: 'saudade', zh: '无法翻译的思念', pron: 'sow-DAH-duh', note: 'Tenho saudades de Lisboa.', exZh: '我想念里斯本。' },
    { pt: 'bica', zh: '里斯本的浓缩咖啡', pron: 'BEE-kuh', note: 'Um café? Uma bica!', exZh: '来杯咖啡？一杯 bica！' },
    { pt: 'azulejo', zh: '彩绘瓷砖', pron: 'uh-zoo-LAY-zhoo', note: 'Os azulejos contam histórias.', exZh: '瓷砖会讲故事。' },
    { pt: 'pois', zh: '对啊 / 嗯', pron: 'poysh', note: 'Pois é, tens razão.', exZh: '可不是嘛，你说得对。' },
    { pt: 'desenrascanço', zh: '临场解决问题的本事', pron: 'duh-zehn-rush-KUHN-soo', note: 'Ele tem muito desenrascanço.', exZh: '他特别会随机应变。' },
    { pt: 'apetecer', zh: '突然想要', pron: 'uh-puh-tuh-SEHR', note: 'Apetece-me um café.', exZh: '我突然想喝杯咖啡。' },
    { pt: 'fixe', zh: '酷 / 棒（葡葡口语）', pron: 'FEE-shuh', note: 'Que fixe!', exZh: '太酷了！' },
    { pt: 'miúdo', zh: '小孩 / 小伙子', pron: 'mee-OO-doo', note: 'Os miúdos estão a brincar.', exZh: '孩子们在玩。' },
    { pt: 'fado', zh: '葡萄牙命运之歌', pron: 'FAH-doo', note: 'O fado nasceu em Lisboa.', exZh: '法多诞生于里斯本。' },
    { pt: 'giro', zh: '可爱 / 好看（葡葡口语）', pron: 'ZHEE-roo', note: 'Que vestido giro!', exZh: '这条裙子真好看！' }
  ];

  const achievements = [
    { id: 'first', icon: 'sparkle', title: 'Primeira palavra', zh: '第一句话', desc: '完成第一节课', test: s => Object.keys(s.lessons).length >= 1 },
    { id: 'streak3', icon: 'flame', title: 'Três dias', zh: '三日之火', desc: '连续学习 3 天', test: s => streakOf(s) >= 3 },
    { id: 'streak7', icon: 'flame', title: 'Uma semana', zh: '一周不断', desc: '连续学习 7 天', test: s => streakOf(s) >= 7 },
    { id: 'words25', icon: 'book', title: 'Colecionador', zh: '词汇收藏家', desc: '在复习中收集 25 个词', test: s => Object.keys(s.words).length >= 25 },
    { id: 'unit1', icon: 'pin', title: 'Lisboa, cheguei', zh: '初到里斯本', desc: '完成第一单元', test: s => ['u1l1', 'u1l2', 'u1l3'].every(id => s.lessons[id]) },
    { id: 'perfect', icon: 'target', title: 'Sem erros', zh: '一气呵成', desc: '一节课全部答对', test: s => Object.values(s.lessons).some(l => l.best === 100) },
    { id: 'culture3', icon: 'sun', title: 'Curioso', zh: '文化好奇者', desc: '读完 3 篇文化文章', test: s => (s.readArticles || []).length >= 3 },
    { id: 'xp500', icon: 'star', title: 'Meio caminho', zh: '半程旅人', desc: '累计获得 500 XP', test: s => s.xp >= 500 }
  ];

  function streakOf(s) {
    if (!s.lastActive) return 0;
    const last = new Date(s.lastActive + 'T12:00:00');
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const diff = Math.round((today - last) / 86400000);
    return diff <= 1 ? (s.streak || 0) : 0;
  }

  window.AZ_DATA = { units, phrases, articles, dailyWords, achievements, streakOf };
})();
