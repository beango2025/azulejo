/* Azulejo — one extra three-lesson unit for each advanced level,
   plus the five-language entries for those 60 new words. */
(function () {
  'use strict';

  const v = (id, pt, zh, pron, ex, exZh, note) => ({ id, pt, zh, pron, ex, exZh, note: note || '' });
  const choice = (prompt, q, options, answer, explain) => ({ type: 'choice', prompt, q, options, answer, explain, audio: '' });
  const listen = (audio, options, answer, explain) => ({
    type: 'listen', prompt: '听音频，选出你听到的句子', q: 'Clica no altifalante e ouve com atenção.',
    audio, options, answer, explain
  });
  const arrange = (q, tokens, answer, explain) => ({ type: 'arrange', prompt: '把词语排成一句正确的葡语', q, tokens, answer, explain });
  const typeIn = (q, answers, explain, hint) => ({
    type: 'type', prompt: '把这句话翻译成欧洲葡语', q, answers, explain, hint: hint || '',
    placeholder: 'Escreve em português…'
  });
  const match = (pairs) => ({ type: 'match', prompt: '把葡语和中文配对', pairs });

  const units = [
    {
      id: 'u11', order: 0, level: 'B1', title: 'Corpo e bem-estar', zh: '身体与状态', color: 'olive', symbol: 'sun',
      blurb: '看医生、吃得更好、睡得更稳，用葡语照顾自己的身体。',
      lessons: [
        {
          id: 'b1l4', title: 'No centro de saúde', zh: '在健康中心', minutes: 10, xp: 50,
          goal: '描述症状、预约就诊并听懂医嘱',
          vocab: [
            v('sintoma', 'o sintoma', '症状', 'SEEN-toh-muh', 'Tenho sintomas de gripe.', '我有流感症状。', '常用复数 sintomas；问道症状可说 Que sintomas tem?'),
            v('receita', 'a receita', '处方', 'ruh-SAY-tuh', 'O médico passou-me uma receita.', '医生给我开了处方。', 'receita 也可指食谱；开处方用 passar uma receita。'),
            v('tratamento', 'o tratamento', '治疗', 'truh-tuh-MEHN-too', 'O tratamento dura uma semana.', '治疗持续一周。', 'tratar 是治疗；tratamento 是名词。'),
            v('consulta', 'a consulta', '就诊 / 门诊', 'kohn-SOOL-tuh', 'Tenho uma consulta às dez.', '我十点有一个门诊。', 'marcar uma consulta 是预约就诊。'),
            v('melhorar', 'melhorar', '好转 / 改善', 'muh-lyoo-RAHR', 'Espero melhorar até amanhã.', '我希望明天前好转。', '反义 piorar；melhor 是「更好」。')
          ],
          grammar: {
            title: '描述症状：ter、estar com 与 há quanto tempo',
            body: '说症状常用 ter：Tenho dores de cabeça、Tenho febre。也可以说 Estou com dores。问持续时间用 Há quanto tempo…? 回答 Há três dias。给建议可用 Deve + 动词原形（您应该）或 Tem de + 动词原形（您必须）。',
            examples: [
              { pt: 'Tenho dores de garganta há dois dias.', zh: '我喉咙痛两天了。' },
              { pt: 'Há quanto tempo tem febre?', zh: '您发烧多久了？' },
              { pt: 'Deve descansar e beber água.', zh: '您应该休息、喝水。' }
            ],
            tip: '「嗓子疼」是 dores de garganta；「头疼」是 dores de cabeça。'
          },
          exercises: [
            choice('补全：Tenho ___ de gripe.', 'Tenho ___ de gripe.', ['sintomas', 'sintoma', 'receita'], 'sintomas', '症状通常用复数 sintomas de gripe。'),
            listen('O tratamento dura uma semana.', ['O tratamento dura uma semana.', 'A consulta dura uma semana.', 'O sintoma dura uma semana.'], 'O tratamento dura uma semana.', 'tratamento 是治疗；dura 是持续。'),
            arrange('我需要预约就诊。', ['Preciso', 'de', 'marcar', 'uma', 'consulta', '.'], 'Preciso de marcar uma consulta.', 'precisar de + 动词原形；marcar uma consulta 是预约门诊。'),
            typeIn('我嗓子疼。', ['Tenho dores de garganta.', 'Estou com dores de garganta.'], 'garganta 是喉咙；dor/dores 是疼痛。', 'Tenho dores…'),
            match([['sintoma', '症状'], ['receita', '处方'], ['tratamento', '治疗'], ['consulta', '就诊']])
          ]
        },
        {
          id: 'b1l5', title: 'Comer melhor', zh: '吃得更健康', minutes: 10, xp: 50,
          goal: '谈饮食习惯、份量和更健康的选择',
          vocab: [
            v('alimentacao', 'a alimentação', '饮食', 'uh-lee-mehn-tuh-SOWN', 'A alimentação mediterrânica é equilibrada.', '地中海饮食很均衡。', 'alimento 是食物；alimentação 是饮食方式。'),
            v('habito', 'o hábito', '习惯', 'AH-bee-too', 'Mudar hábitos leva tempo.', '改变习惯需要时间。', '复数 hábitos；habituar-se a 是习惯于。'),
            v('equilibrado', 'equilibrado', '均衡的', 'ee-kee-lee-BRAH-doo', 'É importante ter uma dieta equilibrada.', '均衡饮食很重要。', '阴性 equilibrada；名词 equilíbrio。'),
            v('processado', 'processado', '加工过的', 'pruh-suh-SAH-doo', 'Evito comida processada.', '我避免加工食品。', 'ultraprocessado 是超加工；阴性 processada。'),
            v('hidratar', 'hidratar-se', '补水', 'ee-druh-TAHR-suh', 'Hidrato-me ao longo do dia.', '我一天中会补水。', '反身形式 hidrato-me；名词 hidratação。')
          ],
          grammar: {
            title: '建议与习惯：costumar、dever、em vez de',
            body: '说习惯用 costumar + 动词原形：Costumo comer sopa。给建议用 dever：Deve comer mais legumes。表达替代用 em vez de + 名词/动词原形：Em vez de refrigerante, bebo água。注意 comida processada 的阴性一致。',
            examples: [
              { pt: 'Costumo comer fruta ao pequeno-almoço.', zh: '我早餐通常吃水果。' },
              { pt: 'Deve reduzir o açúcar.', zh: '您应该减少糖分。' },
              { pt: 'Em vez de carne, escolho peixe.', zh: '我选择鱼而不是肉。' }
            ],
            tip: '份量：uma porção、meio quilo、uma lata；「含糖饮料」是 bebidas açucaradas。'
          },
          exercises: [
            choice('补全：Evito comida ___.', 'Evito comida ___.', ['processada', 'processado', 'processar'], 'processada', 'comida 是阴性，所以用 processada。'),
            listen('Tento evitar produtos processados.', ['Tento evitar produtos processados.', 'Tento comprar produtos frescos.', 'Costumo beber refrigerantes.'], 'Tento evitar produtos processados.', 'evitar 是避免；produtos processados 是加工食品。'),
            arrange('我尽量每天吃蔬菜。', ['Tento', 'comer', 'legumes', 'todos', 'os', 'dias', '.'], 'Tento comer legumes todos os dias.', 'tentar + 动词原形；legumes 是蔬菜。'),
            typeIn('均衡饮食很重要。', ['Uma alimentação equilibrada é importante.', 'A alimentação equilibrada é importante.'], 'alimentação 是阴性；equilibrada 要与之一致。', 'Uma alimentação…'),
            match([['alimentação', '饮食'], ['hábito', '习惯'], ['equilibrado', '均衡的'], ['processado', '加工过的']])
          ]
        },
        {
          id: 'b1l6', title: 'Dormir e descansar', zh: '睡眠与休息', minutes: 10, xp: 50,
          goal: '谈睡眠、压力和恢复精力的方法',
          vocab: [
            v('descanso', 'o descanso', '休息', 'desh-KUHN-soo', 'Preciso de descanso.', '我需要休息。', 'descansar 是休息；descansado 是休息好的。'),
            v('stress', 'o stress', '压力', 'shtrehs', 'O stress afeta o sono.', '压力影响睡眠。', '葡葡也写 stresse；stress 很常见。'),
            v('insonia', 'a insónia', '失眠', 'een-SOH-nee-uh', 'Sofro de insónia.', '我受失眠困扰。', 'sofrer de + 疾病/症状。'),
            v('rotina', 'a rotina', '规律 / 日常', 'roo-TEE-nuh', 'Uma rotina regular ajuda.', '规律的日常有帮助。', 'rotina diária 是日常作息。'),
            v('recuperar', 'recuperar', '恢复', 'ruh-koo-puh-RAHR', 'Ao fim de semana, recupero energia.', '周末我恢复精力。', 'recuperar energias 是恢复精力。')
          ],
          grammar: {
            title: '建议与持续：sofrer de、há quanto tempo、recomendar que',
            body: 'sofrer de 后面接病症：Sofro de insónia。问持续多久：Há quanto tempo não dorme bem? 医生建议可用 Recomendo que descanse（虚拟式）或 É importante que mantenha uma rotina。',
            examples: [
              { pt: 'Há quanto tempo sofre de insónia?', zh: '您失眠多久了？' },
              { pt: 'Recomendo que evite ecrãs antes de dormir.', zh: '我建议您睡前避免屏幕。' },
              { pt: 'É importante que mantenha uma rotina regular.', zh: '保持规律作息很重要。' }
            ],
            tip: '「睡前」是 antes de dormir；「屏幕」是 ecrãs（葡葡）或 telas（巴葡）。'
          },
          exercises: [
            choice('补全：Sofro de ___.', 'Sofro de ___.', ['insónia', 'insónias', 'insone'], 'insónia', 'sofrer de + 名词；insónia 是失眠。'),
            listen('Preciso de descansar mais.', ['Preciso de descansar mais.', 'Preciso de trabalhar mais.', 'Preciso de dormir menos.'], 'Preciso de descansar mais.', 'descansar 是休息；mais 是更多。'),
            arrange('我晚上很难放松。', ['Tenho', 'dificuldade', 'em', 'relaxar', 'à', 'noite', '.'], 'Tenho dificuldade em relaxar à noite.', 'ter dificuldade em + 动词原形；à noite 是晚上。'),
            typeIn('规律作息有帮助。', ['Uma rotina regular ajuda.', 'A rotina regular ajuda.'], 'rotina 是阴性；regular 阴阳同形。', 'Uma rotina…'),
            match([['descanso', '休息'], ['stress', '压力'], ['insónia', '失眠'], ['rotina', '规律']])
          ]
        }
      ]
    },
    {
      id: 'u12', order: 0, level: 'B2', title: 'Media e tecnologia', zh: '媒体与技术', color: 'blue', symbol: 'chart',
      blurb: '判断新闻来源、理解算法，用葡语讨论人工智能的伦理。',
      lessons: [
        {
          id: 'b2l4', title: 'Notícias e fontes', zh: '新闻与来源', minutes: 11, xp: 55,
          goal: '评估新闻可信度，使用转述和保留语气',
          vocab: [
            v('manchete', 'a manchete', '头条标题', 'muhn-SHEH-tuh', 'A manchete dizia tudo.', '标题说明了一切。', 'manchete 是报纸头版标题；titular 是标题/主演。'),
            v('fonte', 'a fonte', '来源', 'FOHN-tuh', 'Devemos verificar a fonte.', '我们应该核实来源。', 'fonte 也可指喷泉；fonte fiável 是可靠来源。'),
            v('credibilidade', 'a credibilidade', '可信度', 'kruh-dee-bee-lee-DAH-d(uh)', 'A credibilidade do jornal está em causa.', '这家报纸的可信度受到质疑。', 'estar em causa 是受到质疑。'),
            v('enviesado', 'enviesado', '有偏见的', 'ehn-vyuh-ZAH-doo', 'O artigo parece enviesado.', '这篇文章似乎有偏见。', '阴性 enviesada；名词 enviesamento。'),
            v('verificar', 'verificar', '核实', 'vuh-ree-fee-KAHR', 'É importante verificar os factos.', '核实事实很重要。', 'verificar os factos 是事实核查。')
          ],
          grammar: {
            title: '转述与保留：segundo、alegadamente、supostamente',
            body: '新闻语体常用保留表达：Segundo a fonte…、A notícia terá sido confirmada（据称已确认）、Alegadamente, o documento foi alterado。这些表达让说话者不背书信息。被动语态也常见：A informação foi confirmada por duas fontes。',
            examples: [
              { pt: 'Segundo a fonte, a notícia ainda não foi confirmada.', zh: '据消息来源称，这条新闻尚未得到证实。' },
              { pt: 'O artigo foi acusado de ser enviesado.', zh: '这篇文章被指有偏见。' },
              { pt: 'É fundamental verificar os factos antes de partilhar.', zh: '分享前核实事实至关重要。' }
            ],
            tip: '「据称」可用 alegadamente 或 supostamente；正式新闻更常用 alegadamente。'
          },
          exercises: [
            choice('补全：Antes de partilhar, devemos ___ a informação.', 'Antes de partilhar, devemos ___ a informação.', ['verificar', 'verificado', 'verificação'], 'verificar', 'dever + 动词原形；verificar 是核实。'),
            listen('Segundo a fonte, a notícia ainda não foi confirmada.', ['Segundo a fonte, a notícia ainda não foi confirmada.', 'Segundo o jornal, a notícia foi confirmada.', 'A fonte confirmou que a notícia é falsa.'], 'Segundo a fonte, a notícia ainda não foi confirmada.', 'segundo a fonte 是据来源称；ainda não 是尚未。'),
            arrange('我们应该核实信息来源。', ['Devemos', 'verificar', 'a', 'fonte', 'da', 'informação', '.'], 'Devemos verificar a fonte da informação.', 'fonte da informação 是信息来源。'),
            typeIn('这篇文章似乎有偏见。', ['O artigo parece enviesado.', 'Este artigo parece enviesado.'], 'parecer + 形容词；artigo 是阳性。', 'O artigo…'),
            match([['manchete', '头条标题'], ['fonte', '来源'], ['credibilidade', '可信度'], ['enviesado', '有偏见的']])
          ]
        },
        {
          id: 'b2l5', title: 'Redes sociais', zh: '社交媒体', minutes: 11, xp: 55,
          goal: '讨论算法、隐私和错误信息',
          vocab: [
            v('algoritmo', 'o algoritmo', '算法', 'ahl-goh-REET-moo', 'O algoritmo decide o que vês.', '算法决定你看到什么。', 'o algoritmo 是阳性；复数 algoritmos。'),
            v('privacidade', 'a privacidade', '隐私', 'pree-vuh-see-DAH-d(uh)', 'A privacidade é uma preocupação.', '隐私是一个令人担忧的问题。', 'privado 是私人的；privacidade 是隐私。'),
            v('polarizacao', 'a polarização', '极化', 'poh-luh-ree-zuh-SOWN', 'As redes podem aumentar a polarização.', '社交网络可能加剧极化。', 'polarizar 是使极化；polos 是两极。'),
            v('partilhar', 'partilhar', '分享', 'par-tee-LYAHR', 'Penso antes de partilhar.', '我分享前会想一想。', '葡葡常用 partilhar；巴葡常用 compartilhar。'),
            v('desinformacao', 'a desinformação', '虚假信息', 'duh-zeen-foor-muh-SOWN', 'A desinformação espalha-se depressa.', '虚假信息传播得很快。', 'desinformação 不等于 misinformation 的全部语境，但常对应。')
          ],
          grammar: {
            title: '因果与反身：levar a、fazer com que、espalhar-se',
            body: '讨论平台影响常用：levar a + 名词/动词、fazer com que + 虚拟式、contribuir para。反身代词可表达自发过程：A notícia espalhou-se rapidamente。注意 fazer com que 后面用虚拟式：faz com que as pessoas acreditem。',
            examples: [
              { pt: 'O algoritmo pode levar à polarização.', zh: '算法可能导致极化。' },
              { pt: 'A desinformação espalha-se mais depressa do que a correção.', zh: '虚假信息比更正传播得更快。' },
              { pt: 'É preciso proteger a privacidade dos utilizadores.', zh: '需要保护用户的隐私。' }
            ],
            tip: '「用户」是 utilizadores（葡葡）或 usuários（巴葡）。'
          },
          exercises: [
            choice('补全：A desinformação ___ rapidamente.', 'A desinformação ___ rapidamente.', ['espalha-se', 'espalhar', 'espalhado'], 'espalha-se', '反身动词 espalhar-se 表示「传播」；第三人称单数是 espalha-se。'),
            listen('O algoritmo pode reforçar a polarização.', ['O algoritmo pode reforçar a polarização.', 'O algoritmo pode reduzir a polarização.', 'A privacidade pode reforçar o algoritmo.'], 'O algoritmo pode reforçar a polarização.', 'reforçar 是加强；polarização 是极化。'),
            arrange('我们应该在分享前核实。', ['Devemos', 'verificar', 'antes', 'de', 'partilhar', '.'], 'Devemos verificar antes de partilhar.', 'antes de + 动词原形。'),
            typeIn('隐私是一项基本权利。', ['A privacidade é um direito fundamental.'], 'privacidade 是阴性；direito fundamental 是基本权利。', 'A privacidade…'),
            match([['algoritmo', '算法'], ['privacidade', '隐私'], ['polarização', '极化'], ['desinformação', '虚假信息']])
          ]
        },
        {
          id: 'b2l6', title: 'Inteligência artificial', zh: '人工智能', minutes: 11, xp: 55,
          goal: '讨论自动化的机会、风险与伦理',
          vocab: [
            v('inteligencia', 'a inteligência', '智能', 'een-tuh-lee-ZHEHN-see-uh', 'A inteligência artificial levanta questões éticas.', '人工智能引发伦理问题。', 'inteligência artificial 常缩写为 IA。'),
            v('automatizar', 'automatizar', '自动化', 'ow-toh-muh-tee-ZAHR', 'A empresa quer automatizar processos.', '公司想自动化流程。', 'automação 是自动化（名词）。'),
            v('etica', 'a ética', '伦理', 'EH-tee-kuh', 'A ética deve orientar a inovação.', '伦理应引导创新。', 'ético 是伦理的；ética 也可指伦理学。'),
            v('regulamentar', 'regulamentar', '监管', 'ruh-goo-luh-mehn-TAHR', 'É necessário regulamentar a tecnologia.', '有必要监管这项技术。', 'regulamento 是规章；regulamentação 是监管。'),
            v('substituir', 'substituir', '取代', 'soobsh-tee-TWEER', 'As máquinas não substituem o julgamento humano.', '机器不能取代人的判断。', 'substituir A por B 是用 B 取代 A。')
          ],
          grammar: {
            title: '风险与条件：correr o risco de、desde que、não só… mas também',
            body: '讨论技术风险可用 correr o risco de + 动词原形：Corremos o risco de perder empregos。条件用 desde que + 虚拟式：Desde que haja regras claras…。强调双重性用 não só… mas também：não só cria oportunidades, mas também riscos。',
            examples: [
              { pt: 'A IA não só cria oportunidades, mas também riscos.', zh: '人工智能不仅带来机会，也带来风险。' },
              { pt: 'Corremos o risco de automatizar decisões injustas.', zh: '我们冒着自动化不公正决策的风险。' },
              { pt: 'Desde que haja supervisão humana, a ferramenta é útil.', zh: '只要有人的监督，这个工具就有用。' }
            ],
            tip: '「监管」可用 regulamentação（规则体系）或 supervisão（监督）。'
          },
          exercises: [
            choice('补全：É necessário ___ a utilização da IA.', 'É necessário ___ a utilização da IA.', ['regulamentar', 'regulamento', 'regulamentado'], 'regulamentar', 'É necessário + 动词原形；regulamentar 是监管。'),
            listen('A inteligência artificial não substitui o julgamento humano.', ['A inteligência artificial não substitui o julgamento humano.', 'A inteligência artificial substitui o julgamento humano.', 'A tecnologia não levanta questões éticas.'], 'A inteligência artificial não substitui o julgamento humano.', 'substituir 是取代；julgamento 是判断。'),
            arrange('创新必须符合伦理。', ['A', 'inovação', 'deve', 'estar', 'alinhada', 'com', 'a', 'ética', '.'], 'A inovação deve estar alinhada com a ética.', 'estar alinhado com 是与……一致；inovação 是阴性。'),
            typeIn('这项技术带来了新的风险。', ['Esta tecnologia traz novos riscos.', 'A tecnologia traz novos riscos.'], 'trazer 是带来；riscos 是风险。', 'Esta tecnologia…'),
            match([['inteligência artificial', '人工智能'], ['automatizar', '自动化'], ['ética', '伦理'], ['substituir', '取代']])
          ]
        }
      ]
    },
    {
      id: 'u13', order: 0, level: 'C1', title: 'Arte e memória', zh: '艺术与记忆', color: 'plum', symbol: 'sun',
      blurb: '讨论博物馆归还、葡萄牙电影与公共记忆的争议。',
      lessons: [
        {
          id: 'c1l4', title: 'Museus e repatriamento', zh: '博物馆与文物归还', minutes: 12, xp: 60,
          goal: '用正式语体讨论殖民遗产与文物归还',
          vocab: [
            v('repatriamento', 'o repatriamento', '遣返 / 归还', 'ruh-puh-tree-muh-MEHN-too', 'O repatriamento de obras é debatido.', '文物的归还问题正在被讨论。', 'repatriar 是遣返/归还；repatriamento 是名词。'),
            v('acervo', 'o acervo', '藏品', 'uh-SEHR-voo', 'O acervo do museu é vasto.', '博物馆的藏品很丰富。', 'acervo 可指博物馆、图书馆的收藏。'),
            v('colonial', 'colonial', '殖民的', 'koh-loh-nee-AHL', 'O legado colonial é complexo.', '殖民遗产很复杂。', 'colonialismo 是殖民主义；colonizar 是殖民。'),
            v('restituicao', 'a restituição', '归还', 'ruhsh-tee-too-EE-sown', 'A restituição exige negociação.', '归还需要谈判。', 'restituir 是归还；restituição 是名词。'),
            v('proveniencia', 'a proveniência', '来源', 'proo-vuh-NYEHN-see-uh', 'É preciso investigar a proveniência.', '需要调查来源。', 'proveniência 多用于文物、商品的来源。')
          ],
          grammar: {
            title: '机构语体：被动、名词化与「estar em causa」',
            body: '讨论博物馆与归还时，常用被动和名词化：A proveniência das peças deve ser investigada；A restituição foi adiada。estar em causa 表示「受到质疑/涉及」：A legitimidade do acervo está em causa。避免把复杂议题写成简单指控，用 há que、é necessário que 保持距离。',
            examples: [
              { pt: 'A proveniência das peças deve ser investigada.', zh: '这些藏品的来源应被调查。' },
              { pt: 'A restituição exige vontade política e negociação.', zh: '归还需要政治意愿和谈判。' },
              { pt: 'A legitimidade de alguns acervos está em causa.', zh: '一些藏品的合法性受到质疑。' }
            ],
            tip: '「殖民时期」是 período colonial；「来源研究」是 estudo de proveniência。'
          },
          exercises: [
            choice('补全：A ___ das obras exige negociação.', 'A ___ das obras exige negociação.', ['restituição', 'restituir', 'restituído'], 'restituição', '冠词 a 后需要名词 restituição。'),
            listen('A proveniência das peças deve ser investigada.', ['A proveniência das peças deve ser investigada.', 'A restituição das peças foi esquecida.', 'O acervo foi comprado ontem.'], 'A proveniência das peças deve ser investigada.', 'proveniência 是来源；investigada 是被调查。'),
            arrange('博物馆正在讨论殖民时期的藏品。', ['O', 'museu', 'está', 'a', 'discutir', 'o', 'acervo', 'colonial', '.'], 'O museu está a discutir o acervo colonial.', 'estar a + 动词原形表示正在；acervo colonial 是殖民藏品。'),
            typeIn('归还需要政治意愿。', ['A restituição exige vontade política.', 'A restituição requer vontade política.'], 'exigir 是要求、需要；vontade política 是政治意愿。', 'A restituição…'),
            match([['repatriamento', '归还'], ['acervo', '藏品'], ['colonial', '殖民的'], ['proveniência', '来源']])
          ]
        },
        {
          id: 'c1l5', title: 'Cinema português', zh: '葡萄牙电影', minutes: 12, xp: 60,
          goal: '用电影批评词汇谈论导演、剧本与票房',
          vocab: [
            v('realizador', 'o realizador', '导演', 'ryah-lee-zuh-DOHR', 'O realizador apresentou o filme.', '导演介绍了这部电影。', '女性导演是 realizadora；巴葡常用 diretor。'),
            v('argumento', 'o argumento', '剧本', 'ar-goo-MEHN-too', 'O argumento é baseado num romance.', '剧本改编自一部小说。', 'argumento 也可指论点；剧本语境靠上下文。'),
            v('plano', 'o plano', '镜头 / 计划', 'PLAH-noo', 'Este plano é muito longo.', '这个镜头很长。', '电影语境是镜头；日常也指计划。'),
            v('montagem', 'a montagem', '剪辑', 'mohn-TAH-zhehn', 'A montagem dá ritmo ao filme.', '剪辑赋予电影节奏。', 'montar 是组装/剪辑；montagem 是名词。'),
            v('bilheteira', 'a bilheteira', '票房 / 售票处', 'bee-lyuh-TAY-ruh', 'O filme foi um sucesso de bilheteira.', '这部电影票房很成功。', 'sucesso de bilheteira 是票房成功。')
          ],
          grammar: {
            title: '电影语体：trata-se de、ao longo de、ser baseado em',
            body: '影评常用：O filme trata-se de…（注意更自然的是 O filme trata de… 或 Trata-se de um filme sobre…）、ao longo do filme、o argumento gira em torno de。被动：O filme foi realizado por…；O argumento é baseado num romance。',
            examples: [
              { pt: 'Trata-se de um filme sobre a memória.', zh: '这是一部关于记忆的电影。' },
              { pt: 'O argumento é baseado num romance.', zh: '剧本改编自一部小说。' },
              { pt: 'Ao longo do filme, o ritmo torna-se mais lento.', zh: '整部电影中，节奏变得更慢。' }
            ],
            tip: '「票房」是 bilheteira；「首映」是 estreia；「影评」是 crítica。'
          },
          exercises: [
            choice('补全：O ___ apresentou o filme no festival.', 'O ___ apresentou o filme no festival.', ['realizador', 'realização', 'realizado'], 'realizador', '冠词 o 后需要名词 realizador。'),
            listen('A montagem dá ritmo ao filme.', ['A montagem dá ritmo ao filme.', 'A bilheteira dá ritmo ao filme.', 'O argumento foi esquecido.'], 'A montagem dá ritmo ao filme.', 'montagem 是剪辑；ritmo 是节奏。'),
            arrange('这部电影改编自一部小说。', ['O', 'filme', 'é', 'baseado', 'num', 'romance', '.'], 'O filme é baseado num romance.', 'ser baseado em 是改编自；num = em + um。'),
            typeIn('它取得了票房成功。', ['Foi um sucesso de bilheteira.', 'O filme foi um sucesso de bilheteira.'], 'sucesso de bilheteira 是票房成功。', 'Foi um sucesso…'),
            match([['realizador', '导演'], ['argumento', '剧本'], ['montagem', '剪辑'], ['bilheteira', '票房']])
          ]
        },
        {
          id: 'c1l6', title: 'Monumentos e memória', zh: '纪念碑与记忆', minutes: 12, xp: 60,
          goal: '讨论公共记忆、纪念与争议',
          vocab: [
            v('memoria', 'a memória', '记忆', 'muh-MOH-ree-uh', 'A memória pública é seletiva.', '公共记忆是有选择性的。', 'memória 是记忆；memorizar 是记住。'),
            v('monumento', 'o monumento', '纪念碑', 'moh-noo-MEHN-too', 'O monumento foi contestado.', '这座纪念碑受到争议。', 'monumento 可指纪念碑、古迹。'),
            v('homenagem', 'a homenagem', '致敬 / 纪念', 'oh-muh-NAH-zhehn', 'A homenagem gerou debate.', '这次纪念引发了辩论。', 'prestar homenagem a 是向……致敬。'),
            v('contestado', 'contestado', '有争议的', 'kohn-tush-TAH-doo', 'O projeto é contestado.', '这个项目有争议。', 'contestar 是质疑；contestado 是被质疑的。'),
            v('esquecimento', 'o esquecimento', '遗忘', 'esh-kuh-see-MEHN-too', 'O esquecimento também é político.', '遗忘也是政治性的。', 'esquecer 是忘记；esquecimento 是名词。')
          ],
          grammar: {
            title: '记忆与争议：ser alvo de、longe de、concessão',
            body: '讨论争议可用 ser alvo de críticas（受到批评）、estar longe de consenso（远未达成共识）。让步用 Embora + 虚拟式：Embora seja polémico, o monumento permanece。保持分析语气时，少用「好/坏」，多用「contestado、ambíguo、problemático」。',
            examples: [
              { pt: 'O monumento foi alvo de críticas.', zh: '这座纪念碑受到了批评。' },
              { pt: 'A questão está longe de estar resolvida.', zh: '这个问题远未解决。' },
              { pt: 'Embora seja polémico, o memorial permanece.', zh: '尽管有争议，纪念碑仍然保留。' }
            ],
            tip: '「公共记忆」是 memória pública；「纪念」是 homenagem；「遗忘」是 esquecimento。'
          },
          exercises: [
            choice('补全：O monumento foi ___ por vários grupos.', 'O monumento foi ___ por vários grupos.', ['contestado', 'contestar', 'contestando'], 'contestado', 'ser + 过去分词构成被动：foi contestado。'),
            listen('A homenagem gerou um debate público.', ['A homenagem gerou um debate público.', 'O monumento foi removido sem debate.', 'A memória pública não mudou.'], 'A homenagem gerou um debate público.', 'gerar 是产生；debate público 是公共辩论。'),
            arrange('纪念碑是公共记忆的一部分。', ['Os', 'monumentos', 'fazem', 'parte', 'da', 'memória', 'pública', '.'], 'Os monumentos fazem parte da memória pública.', 'fazer parte de 是……的一部分。'),
            typeIn('这个问题远未解决。', ['A questão está longe de estar resolvida.', 'A questão está longe de resolvida.'], 'estar longe de 是远未；resolvida 是阴性。', 'A questão está…'),
            match([['memória', '记忆'], ['monumento', '纪念碑'], ['homenagem', '致敬'], ['esquecimento', '遗忘']])
          ]
        }
      ]
    },
    {
      id: 'u14', order: 0, level: 'C2', title: 'Retórica e tradução', zh: '修辞与翻译', color: 'gold', symbol: 'book',
      blurb: '拆解演讲的修辞，读懂委婉语，思考翻译中的得与失。',
      lessons: [
        {
          id: 'c2l4', title: 'Discursos e poder', zh: '演讲与权力', minutes: 13, xp: 65,
          goal: '识别修辞手法并分析政治话语',
          vocab: [
            v('retorica', 'a retórica', '修辞', 'ruh-TOH-ree-kuh', 'A retórica pode unir ou dividir.', '修辞可以团结，也可以分裂。', 'retórico 是修辞的；a retórica 也可指修辞学。'),
            v('persuasao', 'a persuasão', '说服', 'pur-swuh-ZOWN', 'A persuasão não depende só de argumentos.', '说服不只依赖论点。', 'persuadir 是说服；persuasivo 是有说服力的。'),
            v('anfora', 'a anáfora', '首语重复', 'uh-NAH-foh-ruh', 'A anáfora repete uma palavra no início.', '首语重复在句首重复一个词。', 'anáfora 是修辞格；anfora（无重音）是双耳瓶。'),
            v('repeticao', 'a repetição', '重复', 'ruh-puh-tee-SOWN', 'A repetição cria ritmo.', '重复创造节奏。', 'repetir 是重复；repetição 是名词。'),
            v('apelo', 'o apelo', '呼吁', 'uh-PEH-loo', 'O discurso termina com um apelo.', '演讲以呼吁结束。', 'apelo à ação 是行动号召；apelar a 是呼吁。')
          ],
          grammar: {
            title: '修辞分析：不是说服，而是让人愿意相信',
            body: '分析演讲时可说：O orador recorre a…、A repetição reforça…、O apelo emocional sobrepõe-se aos dados。注意区分 logos（论证）、pathos（情感）和 ethos（人格可信度）。葡语常用 não é por acaso que…（……并非偶然）提示设计感。',
            examples: [
              { pt: 'A repetição cria ritmo e memória.', zh: '重复创造节奏和记忆。' },
              { pt: 'O orador recorre a uma anáfora para sublinhar a ideia.', zh: '演讲者用首语重复来强调这个观点。' },
              { pt: 'Não é por acaso que o discurso termina com um apelo.', zh: '演讲以呼吁结束并非偶然。' }
            ],
            tip: 'logos / pathos / ethos 在葡语学术写作中通常保留希腊词形。'
          },
          exercises: [
            choice('补全：A ___ consiste em repetir uma palavra no início de várias frases.', 'A ___ consiste em repetir uma palavra no início de várias frases.', ['anáfora', 'anfora', 'analogia'], 'anáfora', 'anáfora 是首语重复；注意重音。'),
            listen('A repetição cria ritmo e memória.', ['A repetição cria ritmo e memória.', 'A persuasão dispensa a repetição.', 'O discurso não tem apelo.'], 'A repetição cria ritmo e memória.', 'repetição 是重复；ritmo 是节奏。'),
            arrange('这篇演讲以行动呼吁结束。', ['O', 'discurso', 'termina', 'com', 'um', 'apelo', 'à', 'ação', '.'], 'O discurso termina com um apelo à ação.', 'terminar com 是以……结束；apelo à ação 是行动号召。'),
            typeIn('修辞可以团结，也可以分裂。', ['A retórica pode unir ou dividir.'], 'unir 是团结；dividir 是分裂。', 'A retórica…'),
            match([['retórica', '修辞'], ['persuasão', '说服'], ['anáfora', '首语重复'], ['apelo', '呼吁']])
          ]
        },
        {
          id: 'c2l5', title: 'Eufemismos e silêncios', zh: '委婉语与沉默', minutes: 13, xp: 65,
          goal: '识别委婉语、言外之意与话语中的沉默',
          vocab: [
            v('eufemismo', 'o eufemismo', '委婉语', 'eh-foo-MEEZH-moo', 'O eufemismo suaviza a realidade.', '委婉语柔化现实。', '反义 disfemismo；动词 eufemizar 不常用。'),
            v('subtexto', 'o subtexto', '潜台词', 'soob-TEHSH-too', 'O subtexto diz mais do que as palavras.', '潜台词比字面说得更多。', 'sub- 表示「下面」；texto 是文本。'),
            v('silencio', 'o silêncio', '沉默', 'see-LEHN-see-oo', 'O silêncio também comunica.', '沉默也在传达信息。', 'silencioso 是安静的；silenciar 是压下。'),
            v('atenuar', 'atenuar', '缓和 / 减轻', 'uh-tuh-NWAHR', 'A linguagem serve para atenuar o conflito.', '语言用于缓和冲突。', 'atenuante 是减轻情节；atenuação 是缓和。'),
            v('insinuar', 'insinuar', '暗示', 'een-see-NWAHR', 'Ele insinuou que havia um problema.', '他暗示存在问题。', 'insinuação 是暗示；insinuar que + 从句。')
          ],
          grammar: {
            title: '不说破：eufemismo、understatement 与「digamos」',
            body: '葡语常用「digamos que…」（姑且说）、「não propriamente…」（并不完全是）、「há quem diga…」（有人说）来制造距离。委婉语把敏感词换掉：ajuste de efetivos（裁员）、interrupção voluntária da gravidez（堕胎）。分析时要指出「谁在回避什么」。',
            examples: [
              { pt: 'Chamar «ajuste» a um despedimento é um eufemismo.', zh: '把裁员称为「调整」是委婉语。' },
              { pt: 'Ele não disse, mas insinuou o problema.', zh: '他没有明说，但暗示了问题。' },
              { pt: 'O silêncio também faz parte do discurso.', zh: '沉默也是话语的一部分。' }
            ],
            tip: '「裁员」可直接说 despedimentos；「调整岗位」是 reestruturação。'
          },
          exercises: [
            choice('Chamar «ajuste» a um despedimento é um ___.', 'Chamar «ajuste» a um despedimento é um ___.', ['eufemismo', 'euforia', 'enfâse'], 'eufemismo', 'eufemismo 是委婉语；euforia 是兴奋。'),
            listen('O silêncio também faz parte do discurso.', ['O silêncio também faz parte do discurso.', 'O silêncio não comunica nada.', 'O discurso não tem subtexto.'], 'O silêncio também faz parte do discurso.', 'fazer parte de 是……的一部分。'),
            arrange('他没有明说，但暗示了问题。', ['Ele', 'não', 'disse', ',', 'mas', 'insinuou', 'o', 'problema', '.'], 'Ele não disse, mas insinuou o problema.', 'insinuar 是暗示；mas 是但是。'),
            typeIn('语言可以缓和冲突。', ['A linguagem pode atenuar o conflito.'], 'atenuar 是缓和；conflito 是冲突。', 'A linguagem…'),
            match([['eufemismo', '委婉语'], ['subtexto', '潜台词'], ['silêncio', '沉默'], ['insinuar', '暗示']])
          ]
        },
        {
          id: 'c2l6', title: 'Traduzir o intraduzível', zh: '翻译不可译之物', minutes: 13, xp: 65,
          goal: '讨论翻译中的对等、损失与改编',
          vocab: [
            v('intraduzivel', 'intraduzível', '不可译的', 'een-truh-doo-ZEE-vehl', 'Saudade é frequentemente considerada intraduzível.', 'saudade 常被认为不可译。', 'in- + traduzível；反义 traduzível。'),
            v('equivalencia', 'a equivalência', '对等', 'ee-kee-vuh-LEHN-see-uh', 'A tradução procura equivalência, não identidade.', '翻译追求对等，而非同一。', 'equivalente 是等同的；equivalência 是名词。'),
            v('traducao', 'a tradução', '翻译', 'truh-doo-SOWN', 'A tradução é uma forma de leitura.', '翻译是一种阅读方式。', 'traduzir 是翻译；tradutor 是译者。'),
            v('adaptacao', 'a adaptação', '改编 / 适应', 'uh-duh-tuh-SOWN', 'Toda a adaptação implica perda.', '一切改编都意味着损失。', 'adaptar 是改编；adaptação 是名词。'),
            v('perder', 'perder', '失去', 'pehr-DEHR', 'Algo se perde sempre na tradução.', '翻译中总会失去一些东西。', 'perder-se 是迷路；perda 是损失。')
          ],
          grammar: {
            title: '翻译理论：equivalência、perda、na medida em que',
            body: '讨论翻译可用：A tradução procura uma equivalência de sentido；Toda a tradução implica alguma perda；O tradutor negocia registos e contextos。na medida em que 表示「在……程度上/因为」，比 porque 更书面。',
            examples: [
              { pt: 'A tradução procura uma equivalência de sentido.', zh: '翻译追求意义上的对等。' },
              { pt: 'Toda a tradução implica alguma perda.', zh: '一切翻译都意味着某种损失。' },
              { pt: 'O tradutor negocia registos e contextos.', zh: '译者要协调语域和语境。' }
            ],
            tip: '「直译/意译」是 tradução literal / tradução livre；「可译性」是 traduzibilidade。'
          },
          exercises: [
            choice('补全：A tradução procura uma ___ de sentido.', 'A tradução procura uma ___ de sentido.', ['equivalência', 'equivalente', 'equivalentemente'], 'equivalência', '冠词 uma 后需要名词 equivalência。'),
            listen('Toda a tradução implica alguma perda.', ['Toda a tradução implica alguma perda.', 'Toda a tradução evita qualquer perda.', 'A tradução dispensa o contexto.'], 'Toda a tradução implica alguma perda.', 'implicar 是意味着；perda 是损失。'),
            arrange('翻译也是一种阅读。', ['A', 'tradução', 'é', 'também', 'uma', 'forma', 'de', 'leitura', '.'], 'A tradução é também uma forma de leitura.', 'forma de leitura 是阅读方式。'),
            typeIn('有些词无法完全翻译。', ['Há palavras que não se traduzem completamente.', 'Algumas palavras não se traduzem completamente.'], 'traduzir-se 可表示「被翻译」；completamente 是完全地。', 'Há palavras…'),
            match([['intraduzível', '不可译的'], ['equivalência', '对等'], ['tradução', '翻译'], ['perda', '损失']])
          ]
        }
      ]
    }
  ];

  const lexicon = {
    sintoma: ["symptom", "symptôme", "síntoma"],
    receita: ["prescription", "ordonnance", "receta"],
    tratamento: ["treatment", "traitement", "tratamiento"],
    consulta: ["appointment / consultation", "consultation", "consulta"],
    melhorar: ["to improve", "améliorer", "mejorar"],
    alimentacao: ["diet / nutrition", "alimentation", "alimentación"],
    habito: ["habit", "habitude", "hábito"],
    equilibrado: ["balanced", "équilibré", "equilibrado"],
    processado: ["processed", "transformé", "procesado"],
    hidratar: ["to hydrate", "hydrater", "hidratar"],
    descanso: ["rest", "repos", "descanso"],
    stress: ["stress", "stress", "estrés"],
    insonia: ["insomnia", "insomnie", "insomnio"],
    rotina: ["routine", "routine", "rutina"],
    recuperar: ["to recover", "récupérer", "recuperar"],
    manchete: ["headline", "gros titre", "titular"],
    fonte: ["source", "source", "fuente"],
    credibilidade: ["credibility", "crédibilité", "credibilidad"],
    enviesado: ["biased", "biaisé", "sesgado"],
    verificar: ["to verify", "vérifier", "verificar"],
    algoritmo: ["algorithm", "algorithme", "algoritmo"],
    privacidade: ["privacy", "vie privée", "privacidad"],
    polarizacao: ["polarisation", "polarisation", "polarización"],
    partilhar: ["to share", "partager", "compartir"],
    desinformacao: ["disinformation", "désinformation", "desinformación"],
    inteligencia: ["intelligence", "intelligence", "inteligencia"],
    automatizar: ["to automate", "automatiser", "automatizar"],
    etica: ["ethics", "éthique", "ética"],
    regulamentar: ["to regulate", "réglementer", "reglamentar"],
    substituir: ["to replace", "remplacer", "sustituir"],
    repatriamento: ["repatriation", "rapatriement", "repatriación"],
    acervo: ["collection / holdings", "collection", "acervo"],
    colonial: ["colonial", "colonial", "colonial"],
    restituicao: ["restitution", "restitution", "restitución"],
    proveniencia: ["provenance", "provenance", "procedencia"],
    realizador: ["director", "réalisateur", "director"],
    argumento: ["screenplay / argument", "scénario", "guion"],
    plano: ["shot / plan", "plan", "plano"],
    montagem: ["editing", "montage", "montaje"],
    bilheteira: ["box office", "billetterie", "taquilla"],
    memoria: ["memory", "mémoire", "memoria"],
    monumento: ["monument", "monument", "monumento"],
    homenagem: ["tribute", "hommage", "homenaje"],
    contestado: ["contested", "contesté", "contestado"],
    esquecimento: ["forgetting", "oubli", "olvido"],
    retorica: ["rhetoric", "rhétorique", "retórica"],
    persuasao: ["persuasion", "persuasion", "persuasión"],
    anfora: ["anaphora", "anaphore", "anáfora"],
    repeticao: ["repetition", "répétition", "repetición"],
    apelo: ["appeal", "appel", "llamado"],
    eufemismo: ["euphemism", "euphémisme", "eufemismo"],
    subtexto: ["subtext", "sous-texte", "subtexto"],
    silencio: ["silence", "silence", "silencio"],
    atenuar: ["to soften", "atténuer", "atenuar"],
    insinuar: ["to hint", "insinuer", "insinuar"],
    intraduzivel: ["untranslatable", "intraduisible", "intraducible"],
    equivalencia: ["equivalence", "équivalence", "equivalencia"],
    traducao: ["translation", "traduction", "traducción"],
    adaptacao: ["adaptation", "adaptation", "adaptación"],
    perder: ["to lose", "perdre", "perder"]
  };

  window.AZ_MORE = { units, lexicon };
})();
