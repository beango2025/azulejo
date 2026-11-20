import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const bank = {};
const ids = new Set();
const problems = [];
for (const level of levels) {
  const file = path.join(root, 'content', `vocab-${level}.json`);
  if (!fs.existsSync(file)) { problems.push(`missing ${level}`); continue; }
  const words = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(words)) { problems.push(`${level}: not array`); continue; }
  bank[level] = words;
  for (const word of words) {
    for (const key of ['id', 'pt', 'zh', 'en', 'fr', 'es', 'pos', 'ex', 'exZh']) {
      if (!word[key]) problems.push(`${level} ${word.id || '?'}: missing ${key}`);
    }
    if (ids.has(word.id)) problems.push(`duplicate id ${word.id}`);
    ids.add(word.id);
  }
}
fs.writeFileSync(path.join(root, 'js/vocab-bank.js'), `/* Azulejo — extra level vocabulary (generated from content/vocab-*.json). */\nwindow.AZ_VOCAB_BANK = ${JSON.stringify(bank, null, 2)};\n`, 'utf8');
console.log(`levels=${Object.keys(bank).length} words=${ids.size} problems=${problems.length}`);
if (problems.length) console.log(problems.slice(0, 40).join('\n'));
