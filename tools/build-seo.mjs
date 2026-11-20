import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const BASE = 'https://beango2025.github.io/azulejo';
const seo = path.join(root, 'seo');
const ctx = { window: {} };
vm.createContext(ctx);
for (const file of ['js/culture100.js', 'js/phrases1000.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
}
const articles = ctx.window.AZ_CULTURE_100 || [];
const categories = ctx.window.AZ_CULTURE_CATEGORIES || [];
const scenes = ctx.window.AZ_PHRASE_SCENES || [];
const phrases = ctx.window.AZ_PHRASES_1000 || [];

const esc = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
const strip = value => String(value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const fold = value => strip(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const slug = value => fold(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 54) || 'pagina';
const paragraphs = value => String(value || '').split(/\n{2,}/).map(part => `<p>${esc(part)}</p>`).join('');

const photoByCategory = {
  lisboa: 'tram.jpg', gastronomia: 'cafe.jpg', fado: 'fado.jpg', azulejo: 'azulejo.jpg',
  festas: 'market.jpg', historia: 'coast.jpg', quotidiano: 'studio.jpg', religiao: 'coast.jpg',
  futebol: 'tram.jpg', lingua: 'bookshop.jpg'
};

const articleSlugs = new Map();
for (const article of articles) {
  let value = `${article.id}-${slug(article.title)}`;
  if ([...articleSlugs.values()].includes(value)) value += `-${article.id}`;
  articleSlugs.set(article.id, value);
}

function layout({ title, description, pathName, body, image = 'screenshots/culture100.png', jsonLd = null, lang = 'zh-CN' }) {
  const canonical = `${BASE}${pathName}`;
  const imageUrl = `${BASE}/${image}`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Azulejo">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${imageUrl}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="${BASE}/seo/seo.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<header class="topbar"><div class="wrap topbar-inner">
  <a class="brand" href="${BASE}/seo/"><span class="brand-mark">A</span><span><b>azulejo</b><small>Português europeu</small></span></a>
  <nav class="nav" aria-label="Navegação">
    <a href="${BASE}/seo/a2-ciple/">A2 CIPLE</a>
    <a href="${BASE}/seo/culture/">Cultura</a>
    <a href="${BASE}/seo/phrases/">1000 frases</a>
    <a class="cta" href="${BASE}/#/pro">Azulejo Pro</a>
  </nav>
</div></header>
<main>${body}</main>
<footer class="footer"><div class="wrap footer-inner">
  <span>Azulejo · português europeu · conteúdo original para aprender PT-PT</span>
  <span><a href="${BASE}/#/learn">Entrar na app</a> · <a href="${BASE}/#/legal">Créditos e licenças</a> · <a href="${BASE}/sitemap.xml">Sitemap</a></span>
</div></footer>
</body>
</html>`;
}

function a2Page() {
  const body = `
<div class="wrap">
  <section class="hero">
    <span class="eyebrow">A2 · CIPLE · MOCK EXAMS</span>
    <h1>A2 CIPLE 葡萄牙语模拟考试：10 套完整演练</h1>
    <p class="lede">面向在葡萄牙生活、申请国籍或准备 A2 语言证明的中文学习者。10 套 A2 完整模拟，每套 75 分钟：阅读、听力、写作、口语；计时、交卷、分项成绩和逐题解释。Azulejo Pro 还包含 A1–C2 每级 10 套，共 60 套。</p>
    <div class="meta"><span class="pill">10 套 A2</span><span class="pill">全级别 60 套</span><span class="pill">75 分钟 / 套</span><span class="pill">阅读 + 听力 + 写作 + 口语</span><span class="pill">中文解释</span></div>
    <div class="actions"><a class="btn btn-gold" href="${BASE}/#/pro">查看 Azulejo Pro</a><a class="btn btn-secondary" href="${BASE}/#/learn">先试学 A1–A2</a></div>
    <div class="notice">独立备考产品，不是 CAPLE 官方考试，也不发放官方证书。具体考试要求以官方最新信息为准。</div>
  </section>
  <section class="section">
    <div class="section-head"><div><span class="eyebrow">COMO FUNCIONA</span><h2>不是刷题，是一次完整考试。</h2><p>先熟悉节奏，再针对性补弱项。</p></div></div>
    <div class="grid-3">
      <div class="card"><span class="kicker">01 · LEITURA</span><h3>阅读</h3><p>两篇贴近生活的文本，8 道选择题；交卷后显示正确率和解释。</p></div>
      <div class="card"><span class="kicker">02 · AUDIÇÃO</span><h3>听力</h3><p>两段 PT-PT 音频，8 道题；考试中隐藏原文，交卷后可回看。</p></div>
      <div class="card"><span class="kicker">03 · ESCRITA</span><h3>写作</h3><p>两篇任务：给房东写邮件、给朋友写消息；系统检查最低字数。</p></div>
      <div class="card"><span class="kicker">04 · ORAL</span><h3>口语</h3><p>三个口试任务，配示范答案；先自评，再决定是否加人工批改。</p></div>
      <div class="card"><span class="kicker">05 · TEMPO</span><h3>计时</h3><p>75 分钟倒计时，时间到自动交卷，训练考试节奏。</p></div>
      <div class="card"><span class="kicker">06 · RELATÓRIO</span><h3>成绩报告</h3><p>阅读、听力、写作、口语分项；60% 为模拟通过线，附错题解释。</p></div>
    </div>
  </section>
  <section class="section">
    <div class="section-head"><div><span class="eyebrow">PARA QUEM</span><h2>适合谁？</h2></div></div>
    <div class="grid">
      <div class="card"><h3>准备 CIPLE A2</h3><p>想知道考试节奏、题型和自己的薄弱项，而不是继续背零散单词。</p></div>
      <div class="card"><h3>需要 A2 语言证明</h3><p>葡萄牙国籍申请通常需要 A2 葡语证明；本产品用于备考，不替代官方考试。</p></div>
      <div class="card"><h3>在葡生活的华人</h3><p>已有生活词汇，但缺少一次完整的阅读、听力、写作、口语演练。</p></div>
      <div class="card"><h3>中文授课偏好</h3><p>题目和解释配中文，不必先看懂英文语法术语。</p></div>
    </div>
  </section>
  <section class="section faq">
    <div class="section-head"><div><span class="eyebrow">FAQ</span><h2>常见问题</h2></div></div>
    <details><summary>这是官方 CAPLE 考试吗？</summary><p>不是。这是独立制作的模拟考试，用于练习节奏和题型；不发放官方证书，也不代表 CAPLE 认可。</p></details>
    <details><summary>价格包含什么？</summary><p>Azulejo Pro 含 A1–C2 每级 10 套，共 60 套完整模拟、计时与成绩报告、错题解释、口语示范答案。</p></details>
    <details><summary>买了怎么用？</summary><p>付款后会收到离线许可证。打开 A2 模考页，把许可证粘贴到 Licença 即可解锁。</p></details>
    <details><summary>有口语评分吗？</summary><p>当前版本提供口语题、录音入口和示范答案；成绩报告中的口语部分为自评。人工批改可作为单独服务。</p></details>
  </section>
  <div class="cta-band"><div><span class="eyebrow">AZULEJO PRO</span><h2>先做一套，再决定。</h2><p>两套 A2 模拟 · 一次购买 · 离线许可证</p></div><a class="btn btn-gold" href="${BASE}/#/pro">Começar agora</a></div>
</div>`;
  return layout({
    title: 'A2 CIPLE 葡萄牙语模拟考试：10 套完整模拟 | Azulejo',
    description: '10 套 75 分钟 A2 CIPLE 模拟考试：阅读、听力、写作、口语，计时、成绩报告和中文解释。Azulejo Pro 含 A1–C2 每级 10 套，共 60 套。适合准备葡萄牙 A2 语言证明的中文学习者。',
    pathName: '/seo/a2-ciple/',
    body,
    image: 'screenshots/exam.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Azulejo A2 CIPLE Mock Exams',
      description: 'Ten full A2 CIPLE mock exams, plus A1–C2 mock exams, with reading, listening, writing and speaking sections, timer and score report.',
      provider: { '@type': 'Organization', name: 'Azulejo' },
      inLanguage: 'pt-PT',
      offers: { '@type': 'Offer', price: '39', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: `${BASE}/#/pro` }
    }
  });
}

function cultureHub() {
  const cards = categories.map(cat => {
    const items = articles.filter(article => article.category === cat.key);
    return `<a class="card" href="${BASE}/seo/culture/${cat.key}.html"><span class="kicker">${esc(cat.pt)}</span><h3>${esc(cat.zh)}</h3><p>${items.length} 篇 · ${esc(items[0]?.zh || '')} …</p><span class="more">Ler a categoria →</span></a>`;
  }).join('');
  const latest = articles.slice(0, 12).map(article => `<li><a href="${BASE}/seo/culture/${articleSlugs.get(article.id)}.html">${esc(article.zh)}</a> — <span>${esc(article.kicker)}</span></li>`).join('');
  return layout({
    title: '葡萄牙文化 100 篇：里斯本、饮食、法朵、瓷砖与足球 | Azulejo',
    description: '100 篇葡萄牙本土文化讲解，中文、English、français 三语对照：里斯本街区、饮食、法朵、瓷砖、节庆、历史、日常、宗教、足球和语言。',
    pathName: '/seo/culture/',
    body: `<div class="wrap"><section class="hero"><span class="eyebrow">CULTURA PORTUGUESA</span><h1>100 篇葡萄牙文化讲解</h1><p class="lede">不是旅游简介，而是理解葡萄牙人怎么生活、怎么说话。每篇配中文、English 和 français 三种完整讲解。</p><div class="actions"><a class="btn btn-primary" href="${BASE}/#/culture">在 App 中阅读</a><a class="btn btn-secondary" href="${BASE}/seo/a2-ciple/">A2 CIPLE 模考</a></div></section>
    <section class="section"><div class="section-head"><div><span class="eyebrow">CATEGORIAS</span><h2>从里斯本到语言。</h2></div></div><div class="grid">${cards}</div></section>
    <section class="section"><div class="section-head"><div><span class="eyebrow">COMEÇAR</span><h2>Últimos artigos.</h2></div></div><ul class="hub-list">${latest}</ul></section></div>`
  });
}

function cultureCategory(cat) {
  const items = articles.filter(article => article.category === cat.key);
  const cards = items.map(article => `<a class="card" href="${BASE}/seo/culture/${articleSlugs.get(article.id)}.html"><span class="kicker">${esc(article.kicker)}</span><h3>${esc(article.title)}</h3><p>${esc(article.zh)} · ${esc(article.excerpt)}</p><span class="more">Ler em 3 línguas →</span></a>`).join('');
  const others = categories.filter(item => item.key !== cat.key).map(item => `<a href="${BASE}/seo/culture/${item.key}.html">${esc(item.zh)}</a>`).join(' · ');
  return layout({
    title: `${cat.zh}：葡萄牙文化 | Azulejo`,
    description: `${cat.zh}主题的 10 篇葡萄牙文化讲解，配中文、English 和 français。`,
    pathName: `/seo/culture/${cat.key}.html`,
    image: `assets/photos/${photoByCategory[cat.key] || 'azulejo.jpg'}`,
    body: `<div class="wrap"><div class="hero"><div class="breadcrumbs"><a href="${BASE}/seo/culture/">Cultura</a> / ${esc(cat.pt)}</div><span class="eyebrow">${esc(cat.pt)}</span><h1>${esc(cat.zh)}</h1><p class="lede">10 篇关于${esc(cat.zh)}的葡萄牙本土文化讲解，中文、English、français 三语对照。</p></div><section class="grid" style="margin-bottom:30px">${cards}</section><p class="notice">其他主题：${others}</p></div>`
  });
}

function cultureArticle(article, index) {
  const cat = categories.find(item => item.key === article.category) || { pt: article.kicker, zh: '' };
  const prev = articles[index - 1];
  const next = articles[index + 1];
  const related = articles.filter(item => item.category === article.category && item.id !== article.id).slice(0, 4).map(item => `<li><a href="${BASE}/seo/culture/${articleSlugs.get(item.id)}.html">${esc(item.zh)}</a></li>`).join('');
  const langBlocks = article.sections.map(section => `<div class="lang-block"><h2>${esc(section.h)}</h2>${paragraphs(section.p)}</div>`).join('');
  const nav = [prev ? `<a href="${BASE}/seo/culture/${articleSlugs.get(prev.id)}.html">← ${esc(prev.zh)}</a>` : '', next ? `<a href="${BASE}/seo/culture/${articleSlugs.get(next.id)}.html">${esc(next.zh)} →</a>` : ''].join('');
  return layout({
    title: `${article.title} · ${article.zh} | Azulejo`,
    description: strip(article.excerpt || article.zh).slice(0, 155),
    pathName: `/seo/culture/${articleSlugs.get(article.id)}.html`,
    image: `assets/photos/${photoByCategory[article.category] || 'azulejo.jpg'}`,
    lang: 'zh-CN',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      alternativeHeadline: article.zh,
      description: strip(article.excerpt || article.zh),
      inLanguage: ['zh-CN', 'en', 'fr', 'pt-PT'],
      author: { '@type': 'Organization', name: 'Azulejo' },
      publisher: { '@type': 'Organization', name: 'Azulejo' },
      mainEntityOfPage: `${BASE}/seo/culture/${articleSlugs.get(article.id)}.html`
    },
    body: `<div class="wrap article-layout"><article class="article-body"><div class="breadcrumbs"><a href="${BASE}/seo/culture/">Cultura</a> / <a href="${BASE}/seo/culture/${article.category}.html">${esc(cat.zh)}</a></div><span class="eyebrow">${esc(article.kicker)} · ${article.read} min</span><h1>${esc(article.title)}</h1><p class="lede" style="font-size:22px;color:var(--terra)">${esc(article.zh)}</p><p class="lede" style="font-size:12px;color:var(--muted)">EN ${esc(article.titleEn)} · FR ${esc(article.titleFr)}</p>${langBlocks}<p class="notice">这是文化讲解，不是官方历史或移民建议。独立内容，配中文、English、français 三语。</p><div class="actions">${nav}</div></article><aside class="side"><div class="card"><span class="kicker">CONTINUAR</span><h3>100 篇文化</h3><p>按主题阅读里斯本、饮食、法朵、瓷砖、历史与语言。</p><a class="btn btn-secondary" href="${BASE}/seo/culture/">Ver todos</a></div><div class="card" style="margin-top:12px"><span class="kicker">APRENDER</span><h3>在 App 里读</h3><p>配阅读进度、收藏和更完整的课程。</p><a class="btn btn-primary" href="${BASE}/#/culture">Abrir Azulejo</a></div>${related ? `<div class="card" style="margin-top:12px"><span class="kicker">RELACIONADOS</span><ul class="hub-list" style="columns:1">${related}</ul></div>` : ''}</aside></div>`
  });
}

function phraseHub() {
  const cards = scenes.map(scene => `<a class="card" href="${BASE}/seo/phrases/${scene.key}.html"><span class="kicker">${esc(scene.pt)}</span><h3>${esc(scene.zh)}</h3><p>50 句 · PT / 中文 / English / français</p><span class="more">Ver as 50 frases →</span></a>`).join('');
  return layout({
    title: '1000 句欧洲葡语口语句型，按场景分类 | Azulejo',
    description: '1000 句欧洲葡语常用口语句型，20 个真实场景，每场景 50 句，配中文、English 和 français。',
    pathName: '/seo/phrases/',
    image: 'screenshots/phrases1000.png',
    body: `<div class="wrap"><section class="hero"><span class="eyebrow">FRASES & PALAVRAS</span><h1>1000 句欧洲葡语口语句型</h1><p class="lede">按真实场景编排：问候、咖啡馆、餐厅、市场、交通、问路、购物、医疗、工作、旅行、紧急情况、观点讨论。每句配中文、English 和 français。</p><div class="actions"><a class="btn btn-primary" href="${BASE}/#/phrases">在 App 中练习</a></div></section><section class="section"><div class="section-head"><div><span class="eyebrow">20 CENAS</span><h2>Escolhe a tua situação.</h2></div></div><div class="grid">${cards}</div></section></div>`
  });
}

function phraseScene(scene) {
  const list = phrases.filter(item => item.group === scene.key);
  const rows = list.map((item, index) => `<div class="phrase"><span class="num">${String(index + 1).padStart(2, '0')}</span><div><b>${esc(item.pt)}</b><span class="zh">${esc(item.zh)}</span></div><span>${esc(item.en)}</span><span>${esc(item.fr)}</span></div>`).join('');
  const others = scenes.filter(item => item.key !== scene.key).slice(0, 8).map(item => `<a href="${BASE}/seo/phrases/${item.key}.html">${esc(item.zh)}</a>`).join(' · ');
  return layout({
    title: `${scene.zh}：50 句欧洲葡语口语句型 | Azulejo`,
    description: `${scene.zh}场景的 50 句欧洲葡语常用口语句型，配中文、English 和 français。`,
    pathName: `/seo/phrases/${scene.key}.html`,
    body: `<div class="wrap"><section class="hero"><div class="breadcrumbs"><a href="${BASE}/seo/phrases/">1000 frases</a> / ${esc(scene.pt)}</div><span class="eyebrow">${esc(scene.pt)} · ${esc(scene.level)}</span><h1>${esc(scene.zh)}：50 句</h1><p class="lede">真实场景里的欧洲葡语常用句，配中文、English 和 français。点进 App 还能听发音、收藏和搜索全部 1000 句。</p><div class="actions"><a class="btn btn-primary" href="${BASE}/#/phrases">Praticar na app</a></div></section><section class="section"><div class="section-head"><div><span class="eyebrow">FRASES</span><h2>50 句，直接开口。</h2></div><span class="pill">${esc(scene.pt)}</span></div><div class="phrase-list">${rows}</div></section><p class="notice">其他场景：${others}</p></div>`
  });
}

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
}

// Clean generated page directories but keep seo.css.
for (const dir of ['a2-ciple', 'culture', 'phrases']) fs.rmSync(path.join(seo, dir), { recursive: true, force: true });
fs.rmSync(path.join(seo, 'index.html'), { force: true });

write(path.join(seo, 'index.html'), layout({
  title: 'Azulejo — 欧洲葡语 A1–C2、1000 句场景句型、A2 CIPLE 模考',
  description: '欧洲葡语学习网站：180 节课、1000 句场景口语句型、100 篇文化讲解、810 个五语词汇、A2 CIPLE 模拟考试。',
  pathName: '/seo/',
  body: `<div class="wrap"><section class="hero"><span class="eyebrow">AZULEJO · PT-PT</span><h1>欧洲葡语，按真实生活学。</h1><p class="lede">A1–C2 课程、1000 句场景口语句型、100 篇葡萄牙文化讲解、810 个五语词汇和两套 A2 CIPLE 模拟考试。</p><div class="actions"><a class="btn btn-primary" href="${BASE}/#/learn">Entrar na app</a><a class="btn btn-gold" href="${BASE}/seo/a2-ciple/">A2 CIPLE</a><a class="btn btn-secondary" href="${BASE}/seo/culture/">Cultura</a><a class="btn btn-secondary" href="${BASE}/seo/phrases/">1000 frases</a></div></section><section class="section"><div class="grid-3"><a class="card" href="${BASE}/seo/a2-ciple/"><span class="kicker">EXAME</span><h3>A2 CIPLE 模考</h3><p>两套 75 分钟完整模拟，计时、成绩报告、错题解释。</p><span class="more">Ver →</span></a><a class="card" href="${BASE}/seo/culture/"><span class="kicker">CULTURA</span><h3>100 篇文化</h3><p>里斯本、饮食、法朵、瓷砖、历史、足球与语言。</p><span class="more">Ler →</span></a><a class="card" href="${BASE}/seo/phrases/"><span class="kicker">FRASES</span><h3>1000 句场景</h3><p>20 个真实场景，每场景 50 句，中英法对照。</p><span class="more">Praticar →</span></a></div></section></div>`
}));
write(path.join(seo, 'a2-ciple', 'index.html'), a2Page());
write(path.join(seo, 'culture', 'index.html'), cultureHub());
for (const cat of categories) write(path.join(seo, 'culture', `${cat.key}.html`), cultureCategory(cat));
articles.forEach((article, index) => write(path.join(seo, 'culture', `${articleSlugs.get(article.id)}.html`), cultureArticle(article, index)));
write(path.join(seo, 'phrases', 'index.html'), phraseHub());
for (const scene of scenes) write(path.join(seo, 'phrases', `${scene.key}.html`), phraseScene(scene));

const urls = [
  '/seo/',
  '/seo/a2-ciple/',
  '/seo/culture/',
  ...categories.map(cat => `/seo/culture/${cat.key}.html`),
  ...articles.map(article => `/seo/culture/${articleSlugs.get(article.id)}.html`),
  '/seo/phrases/',
  ...scenes.map(scene => `/seo/phrases/${scene.key}.html`)
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${BASE}${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`, 'utf8');

console.log(`seo pages=${urls.length + 1} articles=${articles.length} scenes=${scenes.length} sitemap=${urls.length}`);
