import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = ['grammar-en-a.json', 'grammar-en-b.json'];
const briefs = JSON.parse(fs.readFileSync(path.join(root, 'content/grammar-briefs.json'), 'utf8'));
const expected = new Set(briefs.map(item => item.id));
const map = {};
const problems = [];
for (const file of files) {
  const entries = JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));
  for (const entry of entries) {
    if (!expected.has(entry.id)) { problems.push(`unknown id ${entry.id}`); continue; }
    if (!entry.titleEn || !entry.bodyEn || !entry.tipEn) problems.push(`${entry.id}: missing English text`);
    if (!Array.isArray(entry.exercises) || entry.exercises.length !== 2) problems.push(`${entry.id}: need 2 exercises`);
    (entry.exercises || []).forEach((exercise, index) => {
      if (!Array.isArray(exercise.options) || exercise.options.length !== 3) problems.push(`${entry.id} q${index + 1}: need 3 options`);
      if (exercise.options && !exercise.options.includes(exercise.answer)) problems.push(`${entry.id} q${index + 1}: answer missing`);
    });
    map[entry.id] = entry;
  }
}
for (const brief of briefs) if (!map[brief.id]) problems.push(`missing ${brief.id}`);
fs.writeFileSync(path.join(root, 'js/grammar-extra.js'), `/* Azulejo — English grammar explanations and extra practice (generated). */\nwindow.AZ_GRAMMAR_EXTRA = ${JSON.stringify(map, null, 2)};\n`, 'utf8');
console.log(`entries=${Object.keys(map).length} problems=${problems.length}`);
if (problems.length) console.log(problems.join('\n'));
