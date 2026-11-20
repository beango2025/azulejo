import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const minutes = { A1: 60, A2: 75, B1: 90, B2: 105, C1: 120, C2: 120 };
const briefs = JSON.parse(fs.readFileSync(path.join(root, 'content/lesson-briefs.json'), 'utf8'));
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/readings.js'), 'utf8'), ctx);
const readings = ctx.window.AZ_READINGS || {};

const exams = [];
const problems = [];
for (const level of levels) {
  const promptPath = path.join(root, 'content', `exam-prompts-${level}.json`);
  if (!fs.existsSync(promptPath)) { problems.push(`missing prompts ${level}`); continue; }
  const promptBank = JSON.parse(fs.readFileSync(promptPath, 'utf8'));
  if (!Array.isArray(promptBank.exams) || promptBank.exams.length !== 10) { problems.push(`${level}: need 10 prompt sets`); continue; }
  const levelReadings = briefs
    .filter(item => item.level === level && readings[item.id])
    .sort((a, b) => a.order - b.order);
  if (levelReadings.length < 20) { problems.push(`${level}: only ${levelReadings.length} readings`); continue; }
  const chosen = levelReadings.slice(0, 20);
  for (let n = 1; n <= 10; n += 1) {
    const prompt = promptBank.exams[n - 1];
    if (!prompt || prompt.n !== n) { problems.push(`${level}: prompt set ${n} mismatch`); continue; }
    if (!Array.isArray(prompt.writing) || prompt.writing.length !== 2) { problems.push(`${level} ${n}: writing`); continue; }
    if (!Array.isArray(prompt.speaking) || prompt.speaking.length !== 3) { problems.push(`${level} ${n}: speaking`); continue; }
    const readingIds = [chosen[(n - 1) * 2].id, chosen[(n - 1) * 2 + 1].id];
    exams.push({
      id: `${level.toLowerCase()}-mock-${n}`,
      level,
      n,
      title: `${level} · Mock ${n}`,
      subtitle: `${levelReadings.length} leituras disponíveis · simulado completo`,
      minutes: minutes[level],
      readingIds,
      listeningIds: [`${level}.${n}`, `${level}.${(n % 10) + 1}`],
      writing: prompt.writing,
      speaking: prompt.speaking
    });
  }
}
if (exams.length !== 60) problems.push(`total ${exams.length} exams (need 60)`);
fs.writeFileSync(path.join(root, 'js/exam-bank.js'), `/* Azulejo — 60 mock exams, 10 per CEFR level. */\nwindow.AZ_EXAMS = ${JSON.stringify(exams, null, 2)};\n`, 'utf8');
console.log(`exams=${exams.length} problems=${problems.length}`);
if (problems.length) console.log(problems.slice(0, 30).join('\n'));
