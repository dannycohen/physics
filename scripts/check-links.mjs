// Verify every internal, base-prefixed link/asset in the built site resolves to
// a real file in dist/. Fast, dependency-free, and covers all pages, so broken
// nav/cross-links fail the build instead of shipping. Run after `astro build`.
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const BASE = '/physics/';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

const files = await htmlFiles(DIST);
const linkRe = /(?:href|src)="([^"#?]+)"/g;
let broken = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const [, url] of html.matchAll(linkRe)) {
    if (!url.startsWith(BASE)) continue; // external / anchors / relative handled elsewhere
    const rel = url.slice(BASE.length);
    const target = rel === '' || rel.endsWith('/') ? join(DIST, rel, 'index.html') : join(DIST, rel);
    if (!existsSync(target)) {
      console.error(`Broken internal link in ${file}: ${url} -> ${target}`);
      broken++;
    }
  }
}

if (broken > 0) {
  console.error(`\n${broken} broken internal link(s).`);
  process.exit(1);
}
console.log(`Internal links OK across ${files.length} page(s).`);
