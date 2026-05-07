// Run with: node scripts/test-parser.mjs
import { createRequire } from 'module';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Inline gray-matter import
const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const CONTENT_DIR = join(ROOT, 'content');

function parseListField(lines, key) {
  const prefix = `- **${key}**:`;
  const line = lines.find((l) => l.trimStart().startsWith(prefix));
  if (!line) return [];
  const raw = line.slice(line.indexOf(prefix) + prefix.length).trim();
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseStringField(lines, key) {
  const prefix = `- **${key}**:`;
  const line = lines.find((l) => l.trimStart().startsWith(prefix));
  if (!line) return '';
  return line.slice(line.indexOf(prefix) + prefix.length).trim();
}

function parseExemples(lines) {
  const exemples = [];
  let inExemples = false;
  for (const line of lines) {
    if (line.trimStart().startsWith('- **exemples**:')) { inExemples = true; continue; }
    if (inExemples) {
      const t = line.trim();
      if (t.startsWith('- ') && !t.startsWith('- **')) exemples.push(t.slice(2).trim());
      else if (t.startsWith('- **')) break;
    }
  }
  return exemples;
}

function parseWordSection(header, body) {
  const word = header.trim();
  if (!word) return null;
  const lines = body.split('\n');
  return {
    word,
    nature: parseStringField(lines, 'nature'),
    registre: parseStringField(lines, 'registre') || 'courant',
    definition: parseStringField(lines, 'définition'),
    traduction: parseStringField(lines, 'traduction'),
    exemples: parseExemples(lines),
    synonymes: parseListField(lines, 'synonymes'),
    antonymes: parseListField(lines, 'antonymes'),
    collocations: parseListField(lines, 'collocations'),
    piege: parseStringField(lines, 'piège') || null,
  };
}

const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
for (const file of files) {
  const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  const sections = content.split(/^## /m);
  const items = sections.slice(1).map((s) => {
    const [header, ...rest] = s.split('\n');
    return parseWordSection(header, rest.join('\n'));
  }).filter(Boolean);

  console.log(`\n=== ${file} ===`);
  console.log(`Session ${data.session} | ${data.date} | ${data.theme}`);
  console.log(`${items.length} words parsed:\n`);
  for (const item of items) {
    console.log(`  [${item.word}]`);
    console.log(`    nature      : ${item.nature}`);
    console.log(`    registre    : ${item.registre}`);
    console.log(`    définition  : ${item.definition.slice(0, 60)}…`);
    console.log(`    traduction  : ${item.traduction}`);
    console.log(`    exemples    : ${item.exemples.length} (first: "${item.exemples[0]?.slice(0,50)}…")`);
    console.log(`    synonymes   : ${item.synonymes.join(', ')}`);
    console.log(`    antonymes   : ${item.antonymes.join(', ')}`);
    console.log(`    collocations: ${item.collocations.join(', ')}`);
    console.log(`    piège       : ${item.piege ? item.piege.slice(0, 60) + '…' : 'null'}`);
  }
}
