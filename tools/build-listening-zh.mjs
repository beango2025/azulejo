import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'content');
const files = fs.readdirSync(dir).filter(name => /^listening-zh-[A-C][12]\.json$/.test(name)).sort();
const map = {};
let problems = [];
for (const file of files) {
  const entries = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  for (const entry of entries) {
    if (!entry.id || !Array.isArray(entry.paragraphsZh)) { problems.push(`${file}: bad entry`); continue; }
    map[entry.id] = { titleZh: entry.titleZh || '', paragraphsZh: entry.paragraphsZh };
  }
}
fs.writeFileSync(path.join(root, 'js', 'listening-zh.js'), `/* Azulejo — Chinese translations for the 60 listening tracks. */\nwindow.AZ_LISTENING_ZH = ${JSON.stringify(map, null, 2)};\n`, 'utf8');
console.log(`files=${files.length} translations=${Object.keys(map).length} problems=${problems.length}`);
if (problems.length) console.log(problems.join('\n'));
