import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const categories = JSON.parse(fs.readFileSync(path.join(root, 'content/culture-categories.json'), 'utf8'));
const files = fs.readdirSync(path.join(root, 'content'))
  .filter(name => /^culture-\d+\.json$/.test(name))
  .sort();
const raw = [];
for (const file of files) {
  raw.push(...JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8')));
}
const catMap = new Map(categories.map(cat => [cat.key, cat]));
const articles = [];
const problems = [];
const byCategory = new Map();
for (const item of raw) {
  const cat = catMap.get(item.category);
  if (!cat) { problems.push(`unknown category ${item.category}`); continue; }
  if (!item.titlePt || !item.titleZh || !item.titleEn || !item.titleFr || !item.zh || !item.en || !item.fr) {
    problems.push(`missing fields: ${item.titlePt || '?'}`);
    continue;
  }
  byCategory.set(item.category, (byCategory.get(item.category) || 0) + 1);
  articles.push({
    id: `c${String(articles.length + 1).padStart(3, '0')}`,
    category: item.category,
    kicker: cat.pt,
    title: item.titlePt,
    zh: item.titleZh,
    titleEn: item.titleEn,
    titleFr: item.titleFr,
    excerpt: item.zh.replace(/\s+/g, ' ').slice(0, 96),
    read: Number(item.read) || 4,
    artWord: item.artWord || 'Portugal',
    sections: [
      { h: '中文', p: item.zh },
      { h: 'English', p: item.en },
      { h: 'Français', p: item.fr }
    ],
    tips: []
  });
}
for (const cat of categories) if ((byCategory.get(cat.key) || 0) !== 10) problems.push(`${cat.key}: ${byCategory.get(cat.key) || 0} articles`);
if (articles.length !== 100) problems.push(`total ${articles.length} articles`);
fs.writeFileSync(path.join(root, 'js/culture100.js'), `/* Azulejo — 100 Portuguese culture explainers (ZH/EN/FR). */\nwindow.AZ_CULTURE_CATEGORIES = ${JSON.stringify(categories, null, 2)};\nwindow.AZ_CULTURE_100 = ${JSON.stringify(articles, null, 2)};\n`, 'utf8');
console.log(`files=${files.length} articles=${articles.length} problems=${problems.length}`);
if (problems.length) console.log(problems.slice(0, 30).join('\n'));
