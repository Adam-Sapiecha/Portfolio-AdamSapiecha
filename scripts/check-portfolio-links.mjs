import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.cwd();
const pages = ['index.html','projects.html','about.html','contact.html','taskmesh/index.html','sentinelhub/index.html','dual-agent/index.html','posture-lab/index.html','samsung/index.html','sorno/index.html','tikrow/index.html'];
for (const page of pages) {
  const source = fs.readFileSync(page,'utf8');
  assert(!/<<<<<<<|=======\n|>>>>>>>/.test(source), `Merge markers: ${page}`);
  assert.equal((source.match(/<h1(?:\s|>)/g)||[]).length,1,`One H1: ${page}`);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`Unique IDs: ${page}`);
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:|\/\/)/.test(match[1])) continue;
    const url = new URL(match[1],`https://test.invalid/${page}`);
    let file = path.join(root,decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) file = path.join(file,'index.html');
    assert(fs.existsSync(file),`Missing local target in ${page}: ${match[1]}`);
    if (url.hash && file.endsWith('.html')) {
      const target = fs.readFileSync(file,'utf8');
      assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`Missing anchor in ${page}: ${match[1]}`);
    }
  }
}
console.log(`Checked local files, anchors, unique IDs and H1 on ${pages.length} pages.`);
