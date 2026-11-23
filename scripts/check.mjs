import { readdir, readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const files = (await readdir('.')).filter(file => /\.(html|css|js|mjs)$/.test(file));
const references = new Set();
let failed = false;
for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/(?:assets\/[^\s"'`<>\)]+|(?:\.\/)?[a-zA-Z][\w./-]*\.(?:css|js|mjs|json))/g)) references.add(match[0].split(/[?#]/)[0].replace(/^\.\//, ''));
  if (/\.m?js$/.test(file)) {
    const result = spawnSync(process.execPath, ['--check', '--input-type=module'], { input: source, encoding: 'utf8' });
    if (result.status !== 0) { console.error(file, result.stderr); failed = true; }
  }
}
for (const reference of references) {
  try { await access(reference); }
  catch { console.error('Missing resource:', reference); failed = true; }
}
if (failed) process.exit(1);
console.log(`Validated ${files.length} source files and ${references.size} local resource references.`);
