import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/exam-bank.js'), 'utf8'), ctx);
const exams = ctx.window.AZ_EXAMS || [];
if (exams.length !== 60) {
  console.error(`Expected 60 exams, got ${exams.length}`);
  process.exit(1);
}
const out = path.join(root, 'server', 'exam-bank.json');
fs.writeFileSync(out, JSON.stringify(exams), 'utf8');
console.log(`wrote ${out} (${exams.length} exams, ${fs.statSync(out).size} bytes)`);
console.log('This file is gitignored. Upload it to Cloudflare KV, do not commit it.');
