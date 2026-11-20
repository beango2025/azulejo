import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scenes = JSON.parse(fs.readFileSync(path.join(root, 'content/phrase-scenes.json'), 'utf8'));
const files = fs.readdirSync(path.join(root, 'content'))
  .filter(name => /^phrases-\d+\.json$/.test(name))
  .sort();
const all = [];
for (const file of files) {
  const entries = JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));
  for (const entry of entries) all.push(entry);
}
const groups = new Map();
const phrases = [];
const seen = new Set();
const problems = [];
for (const scene of scenes) groups.set(scene.key, { key: scene.key, pt: scene.pt, zh: scene.zh, level: scene.level, count: 0 });
for (const entry of all) {
  if (!groups.has(entry.group)) { problems.push(`unknown group ${entry.group}`); continue; }
  if (!entry.pt || !entry.en || !entry.fr || !entry.zh) { problems.push(`missing field: ${entry.pt}`); continue; }
  const key = entry.pt.trim().toLowerCase();
  if (seen.has(key)) { problems.push(`duplicate pt: ${entry.pt}`); continue; }
  seen.add(key);
  const group = groups.get(entry.group);
  group.count += 1;
  phrases.push({
    id: `p${String(phrases.length + 1).padStart(4, '0')}`,
    group: entry.group,
    pt: entry.pt,
    en: entry.en,
    fr: entry.fr,
    zh: entry.zh,
    level: entry.level || group.level
  });
}
const sceneList = [...groups.values()];
for (const scene of sceneList) if (scene.count !== 50) problems.push(`${scene.key}: ${scene.count} phrases (need 50)`);
if (phrases.length !== 1000) problems.push(`total ${phrases.length} phrases (need 1000)`);
fs.writeFileSync(path.join(root, 'js/phrases1000.js'), `/* Azulejo — 1,000 European Portuguese spoken sentence patterns by scene. */\nwindow.AZ_PHRASE_SCENES = ${JSON.stringify(sceneList, null, 2)};\nwindow.AZ_PHRASES_1000 = ${JSON.stringify(phrases, null, 2)};\n`, 'utf8');
console.log(`files=${files.length} phrases=${phrases.length} scenes=${sceneList.length} problems=${problems.length}`);
if (problems.length) console.log(problems.slice(0, 50).join('\n'));
