import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'content/pos-existing.json');
const data = JSON.parse(fs.readFileSync(src, 'utf8'));
const allowed = new Set(['noun', 'verb', 'adjective', 'adverb', 'phrase']);
const problems = [];
for (const [word, pos] of Object.entries(data)) {
  if (!allowed.has(pos)) problems.push(`${word}: ${pos}`);
}
fs.writeFileSync(path.join(root, 'js/pos-existing.js'), `/* Azulejo — part of speech for the original 210 words. */\nwindow.AZ_POS_EXISTING = ${JSON.stringify(data, null, 2)};\n`, 'utf8');
console.log(`words=${Object.keys(data).length} problems=${problems.length}`);
if (problems.length) console.log(problems.join('\n'));
