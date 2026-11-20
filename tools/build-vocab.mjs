import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const bank = {};
const ids = new Set();
const headwords = new Set();
const problems = [];
const normalise = value => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/^(o|a|os|as|um|uma)\s+/, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
for (const level of levels) {
  const files = [`vocab-${level}.json`, `vocab-extra-${level}.json`, `vocab-extra2-${level}.json`, `vocab-extra3-${level}.json`]
    .map(name => path.join(root, 'content', name))
    .filter(file => fs.existsSync(file));
  if (!files.length) { problems.push(`missing ${level}`); continue; }
  const words = [];
  for (const file of files) {
    const part = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(part)) { problems.push(`${level}: not array`); continue; }
    words.push(...part);
  }
  bank[level] = [];
  for (const word of words) {
    for (const key of ['id', 'pt', 'zh', 'en', 'fr', 'es', 'pos']) {
      if (!word[key]) problems.push(`${level} ${word.id || '?'}: missing ${key}`);
    }
    if (ids.has(word.id)) { problems.push(`duplicate id ${word.id}`); continue; }
    const headword = normalise(word.pt);
    if (headwords.has(headword)) continue;
    headwords.add(headword);
    ids.add(word.id);
    bank[level].push(word);
  }
}
fs.writeFileSync(path.join(root, 'js/vocab-bank.js'), `/* Azulejo — extra level vocabulary (generated from content/vocab-*.json). */\nwindow.AZ_VOCAB_BANK = ${JSON.stringify(bank, null, 2)};\n`, 'utf8');
console.log(`levels=${Object.keys(bank).length} words=${ids.size} problems=${problems.length}`);
if (problems.length) console.log(problems.slice(0, 40).join('\n'));
