/* Azulejo — CAPLE exam guide and level/syllabus map. Summaries only; always check the official CAPLE site. */
window.AZ_EXAM_GUIDE = {
  officialUrl: 'https://caple.letras.ulisboa.pt/',
  updated: '2026-11',
  exams: [
    { level: 'A1', exam: 'ACESSO', name: 'Certificado Acesso ao Português', focus: 'First contact: identity, routine, immediate needs.', paper: 'CL 20m · PIE 20m · CO 25m · PIO 10–15m' },
    { level: 'A2', exam: 'CIPLE', name: 'Certificado Inicial de Português Língua Estrangeira', focus: 'Everyday survival and simple social interaction.', paper: 'CL + PIE 75m · CO 30m · PIO 10–15m' },
    { level: 'B1', exam: 'DEPLE', name: 'Diploma Elementar de Português Língua Estrangeira', focus: 'Independent user: experiences, plans, opinions, familiar topics.', paper: 'CL 30m · PIE 60m · CO 40m · PIO 20m' },
    { level: 'B2', exam: 'DIPLE', name: 'Diploma Intermédio de Português Língua Estrangeira', focus: 'Complex texts, argument, formal interaction, current issues.', paper: 'CL 75m · PIE 75m · CO 40m · PIO 20m' },
    { level: 'C1', exam: 'DAPLE', name: 'Diploma Avançado de Português Língua Estrangeira', focus: 'Flexible, effective language for academic and professional life.', paper: 'CL 90m · PIE 90m · CO 40m · PIO 20m' },
    { level: 'C2', exam: 'DUPLE', name: 'Diploma Universitário de Português Língua Estrangeira', focus: 'Near-native comprehension, nuance, style and argument.', paper: 'CL 120m · PIE 105m · CO 40m · PIO 20m' }
  ],
  components: [
    ['CL', 'Compreensão da Leitura', '阅读：通知、文章、观点、文学/评论等，随级别变长变抽象。'],
    ['PIE', 'Produção e Interação Escritas', '写作：表格、邮件、叙述、观点文、正式信、文章或 essay。'],
    ['CO', 'Compreensão do Oral', '听力：对话、访谈、广播、讲座等，语速和长度随级别增加。'],
    ['PIO', 'Produção e Interação Orais', '口语：自我介绍、图片/话题描述、与考官和另一位考生互动。']
  ],
  levels: {
    A1: { descriptor: '能应对非常具体的日常需求：自我介绍、问路、买东西、说时间。', functions: ['Cumprimentar e apresentar-se', 'Pedir e dar informações básicas', 'Falar de família, casa e rotina', 'Comprar, pedir e agradecer'], grammar: ['Presente do indicativo', 'Artigos e género', 'Plural', 'Interrogativos', 'Números e horas'] },
    A2: { descriptor: '能完成日常任务，描述过去、计划和简单经历。', functions: ['Descrever o passado', 'Falar de planos', 'Resolver problemas simples', 'Escrever emails curtos'], grammar: ['Pretérito perfeito', 'Ir + infinitivo', 'Comparativos', 'Pronomes objeto', 'Conectores básicos'] },
    B1: { descriptor: '能独立应对熟悉话题，表达观点、经历和理由。', functions: ['Contar experiências', 'Dar opinião e justificar', 'Fazer planos e previsões', 'Lidar com situações menos previsíveis'], grammar: ['Perfeito vs. imperfeito', 'Futuro e condicional', 'Conjuntivo presente (intro)', 'Relativas', 'Conectores de argumento'] },
    B2: { descriptor: '能理解复杂文本并有效论证，语体开始分化。', functions: ['Argumentar e contra-argumentar', 'Escrever carta formal', 'Resumir e reformular', 'Discutir temas sociais'], grammar: ['Conjuntivo presente', 'Passiva', 'Relativa com cujo', 'Nominalização', 'Concessão e causa'] },
    C1: { descriptor: '能灵活、有效地使用语言，处理学术、职业和抽象话题。', functions: ['Sintetizar fontes', 'Tomar posição fundamentada', 'Adequar registo', 'Gerir ambiguidade e nuance'], grammar: ['Conjuntivo imperfeito', 'Inversão', 'Coesão e referenciação', 'Nominalização avançada', 'Modalização'] },
    C2: { descriptor: '接近母语者的理解与表达，能处理反讽、省略、语体和风格。', functions: ['Interpretar ironia e subtexto', 'Recriar estilo', 'Argumentar com concessões', 'Avaliar criticamente'], grammar: ['Elipse', 'Estruturas clivadas', 'Concessivas avançadas', 'Metáfora e registo', 'Coesão e ambiguidade'] }
  }
};
